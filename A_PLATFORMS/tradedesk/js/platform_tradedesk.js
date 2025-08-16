var  Interval_loadterminal      = 0;
var CurrentSession              = null;
var CurrentTSystemObjectName    = 'VELOCITY';
var CurrentTEngine              = null;
var CurrentTSchedule            = null;
var SystemSignalNbr             = 1;

//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function tradedesk_init() {
    tradedesk_solution('tradedesk');
    tradedesk_editors_init('tradedesk');
    tradedesk_gse_init(); 


    sidebarpanel_show(tradedeskplatform, "sidebarpanel_terminals");    
    setInterval(tradedesk_timer, 300);     
}

function tradedesk_end () {
    tradedesk_closeterminal(solution.CurrentTerminal)    

    for (var i = 0; i < solution.Terminals.length; i++) {
        let terminal = solution.Terminals[i];    
        if (terminal.Type == 'Terminal' || terminal.Type == 'Tester') {
            terminal.Com.Socket.close();     
        }   
    }
}

//---------------------------------------------------------------------MODULE END -----------------------------------------------------------------------------//

function tradedesk_select (name) {

//--- data ui platform update .............
    let ui  = solution.get('ui')        
    
// market    
    $('#marketpanel').css ('display', 'flex');    

    ui.platform_updatedata('tradedesk', solution.CurrentTerminal)

    AnimationReset('animation')
    ui.platform_expand(name, true);

    DrawChart();

    if (!solution.CurrentTerminal) {
      

        if (solution.UserId == "0") {
            AnimationDisplay ('tradedesk', 'Demo MT4 Terminal is selected', 'tradedesk_toppanel');         

            var terminal = solution.GetRunningTerminalFromName (tradedesk_default_terminalname);
        //    console.log ('terminal selection')
            tradedesk_selectterminal(terminal); 
            return;
        }
        DisplayInfo("Select a Platform", true, 'operationpanel', 'var (--bg-terminal)');            
        AnimationDisplay ('tradedesk', 'Select MT4 Terminal to Start', 'tradedesk_toppanel');         
    }
}


function tradedesk_solution (pname) {
    let  site           = solution.get('site');
    let  user           = solution.get('user')


    solution.CurrentTerminal = null;


    solution.MT4Server_Protocol       = site.protocol;
    solution.MT4Server_Address        = tradedesk_default_server_name
    solution.MT4Server_Reconnection   = tradedesk_default_server_reconnection;


    
    if (site.protocol == 'http:') {  //TRADESK= 2
        solution.MT4Server_Port     =  tradedesk_default_server_port;     
    }
    else {
        solution.MT4Server_Port     =  tradedesk_default_server_sport;    
    }

    if (!solution.DefaultLoaded) {
        pg_solution ()
        solution.LoadPGDefault (pname);   
        solution.DefaultLoaded = true;            
    }    
    solution.UpdatePredefinedIndicators (pname);

   
    solution.tradedesk_LoadTerminals = function (Id, url, async, interfacecallback, par) {
        if (!async) async = false;
        var params = 'user_id=' + (Id == "0" ? "1" : Id);

        var xhttp = new XMLHttpRequest();

        xhttp.solution = this;
        xhttp.userid = Id;

        xhttp.onreadystatechange = function () {

            let solution = xhttp.solution;

            if (this.readyState == 4 && this.status == 200) {
                let arraystructure =  JSON.parse(this.responseText);
                for (var i = 0; i < arraystructure.length; i++) {

                    let terminalstruct = arraystructure[i];

                    let pathElements = terminalstruct.DataPath.replace(/\/$/, '').split('/');
                    let sdatapath = pathElements[pathElements.length - 1];
                    
                    if (terminalstruct.Type == 'MT4') {   

  
                        if (this.userid == '0' && terminalstruct.Name != tradedesk_default_terminalname) continue;
                        if (solution.GetTerminalsFromName (terminalstruct.Name).length != 0) continue;
                        terminalstruct.Type = 'Terminal';
                        let realterminal   = new pgterminal(TRADEDESK_PLATFORM_PNAME, terminalstruct.Type);
                        realterminal =  {...realterminal, ...terminalstruct}
 
                        terminalstruct.Type = 'Tester';                        
                        let testerterminal  = new pgterminal(TRADEDESK_PLATFORM_PNAME, terminalstruct.Type);
                        testerterminal =  {...testerterminal, ...terminalstruct}
                       
                       
                        realterminal.Folder             = testerterminal.Folder = sdatapath;

                        solution.Terminals.push(realterminal);
                        solution.Terminals.push(testerterminal);
                    }
                }    
                if (interfacecallback)  interfacecallback (par);            
            }
        }
        
        xhttp.open('POST', url, async);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
    

    solution.UpdateMT4Terminals = function (solution) {   //called from outside so i need to put object in par
        Menu_MT4Terminals = [];

        for (var j = 0; j < solution.Terminals.length; j++) {

            var terminal = solution.Terminals[j];
            if (terminal.Type == 'Terminal' || terminal.Type == 'Tester') {

                Menu_MT4Terminals.push({id:'terminal_' + terminal.Name, type: 'link', item: terminal.Name, icon: icon_terminal,
                    attributes:{selector: 'tradedesk_selectterminal'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}               
                })
                sb.select_additem ('tradedesk_terminalselect', terminal.Name);            
                MT4Connect(terminal, solution.MT4Server_Address, solution.MT4Server_Port, solution.MT4Server_Reconnection);                    

            }
        }
        PlatformsPanel_Update();  
    
        sb.tree_additems ('tree_terminals', Menu_MT4Terminals);
    
        $("#tree_terminals").addClass('show');   
    }    
    
    solution.GetTerminalFromCom = function (com) {  //running priority
     
        for (var i = 0; i < this.Terminals.length; i++) {

            if (this.Terminals[i].Type == 'Terminal' || this.Terminals[i].Type == 'Tester') {
                if (this.Terminals[i].Com == com) {
                    return this.Terminals[i];
                };
            }    
        }        
        return null;
    }
    solution.GetRunningTerminalFromName = function (name) {  //running priority
        var terminals = this.GetTerminalsFromName(name);
        var terminal = terminals[0];   // terminal has priority

        for (var i = 0; i < terminals.length; i++) {

            if (terminals[i].Type == 'Terminal' && terminals[i].Running == true) {
                terminal = terminals[i];
                break;
            }    
            else 
            if (terminals[i].Type == 'Tester' && terminals[i].Running == true) {
                terminal = terminals[i];
                break;
            }
        }        
        return terminal;
    }

    solution.GetTerminalFromNameType = function (name, type) {
        for (var i = 0; i < this.Terminals.length; i++) {
            if (this.Terminals[i].Name == name && this.Terminals[i].Type == type) return this.Terminals[i];
        }
        return null;
    }
    solution.tradedesk_LoadTerminals(user.id, site.address  + "/php/read_terminals.php", SYNCHRONE, solution.UpdateMT4Terminals, solution);    
}

function tradedesk_timer () {
    if (solution.CurrentTerminal) {
//bottom panel
        $('#tradedesk_bottompanel').css ('display', '');


        $('#tradedesk_terminalsbar #' + 'tradedesk_close').css ('display', '');

       // $('#tradedesk_maintabs').css ('display', '');
        $('#tradedesk_terminalsbar #tradedeskClose').css ('display', '');     

        $("#tradedeskselectstrategypanel").css ('display', '');  
        $("#tradedeskprojectnamepanel").css ('display', '');      
        $("#saccountpanel").css ('display', '');              
        $("#tsyssignalsselectpanel").css ('display', '');      
        
        $('#targetsbar #' + 'targetsbar_settings').css ('display', '');        
        $('#tsignalsbar #' + 'tsignals_settings').css ('display', '');  
        $('#alertsbar #' + 'alerts_settings').css ('display', '');                       
        $("#tradedesk_history_sidepanel").css ('display', '');          

        $('#tradedesk_root #indicatorCreate').css ('display', '');          

    } else {
//bottom panel
        $('#tradedesk_bottompanel').css ('display', 'none');


        $('#tradedesk_terminalsbar #' + 'tradedesk_close').css ('display', 'none');

   //     $('#tradedesk_maintabs').css ('display', 'none');
        $('#tradedesk_terminalsbar #tradedeskClose').css ('display', 'none');        
        
        $("#tradedeskselectstrategypanel").css ('display', 'none');  
        $("#tradedeskprojectnamepanel").css ('display', 'none');              
        $("#saccountpanel").css ('display', 'none');       
        $("#tsyssignalsselectpanel").css ('display', 'none');       

        $('#targetsbar #' + 'targetsbar_settings').css ('display', 'none');        
        $('#tsignalsbar #' + 'tsignals_settings').css ('display', 'none');    
        $('#alertsbar #' + 'alerts_settings').css ('display', 'none');    
        $("#tradedesk_history_sidepanel").css ('display', 'none');                      
          
        $('#tradedesk_root #indicatorCreate').css ('display', 'none');  
    }
}

function tradedesk_home_open  (event) {
    let platform =  sb.get(main, 'pname', 'home');
    //    LoaderDisplay(true);
    if (platform.length == 0) {
        solution.add_module('home');               
    } 
  
    let ui  = solution.get('ui')     
    ui.platform_select(HOME_PLATFORM_PNAME)       
    onclick_home_mainbar ($('#home_mainbar_trading')[0], event)      
}    



function tradedesk_selectterminal(terminal, force) {
    
    if (!terminal) {
        return;
    }
        
    if (!force && solution.CurrentTerminal == terminal) {
        return terminal;
    }

    if (solution.CurrentTerminal) {
        solution.CurrentTerminal.Com.Send(solution.UserId + '*START*' +  solution.CurrentTerminal.Type + '*' +  solution.CurrentTerminal.Name + '*0');
        solution.CurrentTerminal.Save ();            
    }

//--- data ui platform update .............
    let ui  = solution.get('ui')           
    solution.CurrentTerminal = terminal; 
    ui.platform_updatedata('tradedesk', solution.CurrentTerminal)
    
    tradedesk_inittradedesk ();            // reset platform

    if (!terminal.Loaded) {
        LoaderDisplay(true);
        DisplayInfo("Loading Terminal ... Please wait", true, 'operationpanel', 'var(--bg-terminal)');
        
        Interval_loadterminal = setInterval(tradedesk_loadedterminal, 300, terminal); //5 minutes 300000     
        terminal.Load();
    }
    else {
        UpdateEngines (terminal);
        solution.UpdateStrategies (terminal);
        solution.UpdateSchedules (terminal);
        UpdatePanel (terminal);
        Tradedesk_UpdateAlerts(terminal);

        DisplayInfo("Terminal loaded", true, 'operationpanel', 'var(--bg-terminal)');        
        terminal.Com.Send(solution.UserId + '*START*' + terminal.Type + '*' + terminal.Name + '*1');    
        tradedesk_drawterminal (terminal, true);    // relatef to interface and terminal        
    }
}

function tradedesk_closeterminal (terminal) {
    if (!terminal) {
        return null;
    }

    terminal.Com.Send(solution.UserId + '*START*' + terminal.Type + '*' + terminal.Name + '*0');


    if (terminal == solution.CurrentTerminal) {
        tradedesk_inittradedesk ();
        tradedesk_drawterminal (terminal, false);

//--- data ui platform update .............
        let ui  = solution.get('ui')                   
        solution.CurrentTerminal = null;    
        ui.platform_updatedata('tradedesk', solution.CurrentTerminal)            
    }

    return terminal;
}

function tradedesk_inittradedesk () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    today = +mm + '/' + +dd + '/' + yyyy;
    

    sb.table_clear(historytable);    
    sb.table_clear(statementtable);        


    sb.table_clear(tsignalstable);
    sb.table_clear(tsyssignalstable);
    sb.table_clear(percentchangetable);

    
    sb.table_clear(DailyTargetsTable);
    sb.table_addrow (DailyTargetsTable, ['GLOBAL', '---', '---', '---', '---', '---', '---'])

    sb.table_clear(WeeklyTargetsTable);
    sb.table_addrow (WeeklyTargetsTable, ['GLOBAL', '---', '---', '---', '---', '---', '---'])


    sb.table_clear(tradedeskcurrenciestable);
        
    sb.table_reset(automationtable, 2);    
    
    sb.table_reset(StrategiesTable, 4);
    sb.table_clear(orderstable);
    sb.table_clear(sessionstable);       
    sb.table_clear(alertstable);
    
    sb.tab_clear (tradedesk_maintabs, 'tradedesk_home_tab');
    sb.tab_clear (tradedesksignalstab);
    sb.tab_clear (tradedeskordertab);

    AccountPanels_Reset();

    var symbolcanvas = solution.GetCanvasFromTerminal();
    symbolcanvas.Init(solution.CurrentTerminal.pname);
}

function tradedesk_loadedterminal (terminal) {
    if (terminal.Loaded) {
        clearInterval(Interval_loadterminal);
        LoaderDisplay(false);      

        DisplayInfo("Terminal loaded", true, 'operationpanel', 'var(--bg-terminal)');
        terminal.Com.Send(solution.UserId + '*START*' + terminal.Type + '*' + terminal.Name + '*1');    
        tradedesk_drawterminal (terminal, true);    // relatef to interface and terminal        
    }
}

function tradedesk_drawterminal (terminal, open) {
    if (!terminal) {
        return;
    }    
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('name', TRADEDESK_PLATFORM_NAME);     
        

    var PG = terminal.PG; 
    PG.Sessions = [];
    PG.Orders = [];
    PG.EOrders = [];

    if (open) {

        $("#tradedesksyssignalselect option[value='--Select Indicator--']").remove();   
        $('#tradedesksyssignalselect option[value="' + CurrentTSystemObjectName + '"]').prop('selected', true); 


        $("#testerradio").prop("checked",  terminal.Type == 'Tester') ;
        $("#terminalradio").prop("checked",terminal.Type == 'Terminal');   
            
        $("#tradedesk_terminalselect option[value='--Select Terminal--']").remove();   
        $('#tradedesk_terminalselect option[value="' + terminal.Name + '"]').prop('selected', true);

        $("#terminalstrategyselect option[value='--Select Strategy--']").remove();   

        sb.tree_selectitem ('tree_terminals', terminal.Name);   


        $('#boxautomationpanel .box-btn-slide').click();    

        sb.box_toggle('boxtradedeskpanel', false);     

        TerminalInfoPanel_Update(terminal);  
                                   
        tradedesk_editors_update()
        BottomPanel_Flat(platform, false, true);
        !terminal.Running ? AnimationDisplay('tradedesk', 'Terminal is not running with Expert', 'tradedesk_toppanel') : AnimationDisplay ('tradedesk', 'Loading please wait', 'tradedesk_toppanel');    
    } else {

        $("#tradedesksyssignalselect option").eq(0).before($('<option>', {value: '--Select Indicator--', text: '--Select Indicator--'}));
        $("#tradedesksyssignalselect option[value='--Select Indicator--']").prop('selected', true);

        $("#tradedesk_terminalselect option").eq(0).before($('<option>', {value: '--Select Terminal--', text: '--Select Terminal--'}));
        $("#tradedesk_terminalselect option[value='--Select Terminal--']").prop('selected', true);       

        sb.tree_selectitem ('tree_terminals', '');


        sb.box_toggle('boxtradedeskpanel', true);        
        sb.box_toggle('boxtsignalspanel', false);
        sb.box_toggle('boxorderpanel', false);
        sb.box_toggle('boxautomationpanel', false);
        sb.box_toggle('boxtargetpanel', false);
        sb.box_toggle('boxaccountpanel', false);
        sb.box_toggle('boxaterminalinfopanel', false);

        BottomPanel_Flat(platform, true, true); 
        AnimationDisplay('tradedesk', 'Goodbye', 'tradedesk_toppanel');        
    }
}

function tradedesk_displayterminal(terminal, Symbol) {
    
    var period = 0;
    
    if (!sb.tab_finditem (tradedesk_maintabs, Symbol.Name)) {
        AddSymbol(terminal, Symbol);
    }
    
    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;    


    if (symbolcanvas.Updated == false) {
        GChartPanel_Update (terminal);
    }

    if (!symbolcanvas.CurrentSymbol) {
        if (terminal.Type == 'Tester') {
            Symbol_Select(terminal, Symbol, Symbol.Period);            
        } else {
            Symbol_Select(terminal, Symbol, symbolcanvas.CurrentPeriod);                
        }
    }    

    let fromperiod = 0;

    if (terminal.Type == 'Tester') {
        fromperiod =  Symbol.Period;
    }


    for (var i = fromperiod; i < PeriodName.length; i++) {
        if (!Symbol.WaitHistory[i]) {
            OnGetHistory(terminal, Symbol, i, Symbol.NbrCandles[i], Symbol.NbrCandles[i] + CANDLES_TOLOAD, true);
            Symbol.WaitHistory[i] = true;            
        }
    }
       
    HistoryPanel_Update (terminal);
    AccountPanels_Update(terminal);
    TerminalInfoPanel_Update(terminal) ;     
}

function onchange_tradedesk_terminalselect (elt, event) {
    let terminalname    = $('#' + elt.id + ' option:selected').val();
    let terminaltype    = TradedeskTypePanel_Type();
    let terminal        = solution.GetTerminalFromNameType (terminalname, terminaltype);        
    tradedesk_selectterminal(terminal);
}

//--------------------------------------------------------------------------------------------------------------------------------------------

function tradedesk_gse_init () {
    CurrentTContainer = pg_gse_init('gsecanvas_session');
}

function ondrop_tradedesk_main (event) {

}

var TradedeskSignalEditor   = null;
var TradedeskSCEditor       = null;


function tradedesk_editors_init (id) {
    TradedeskSignalEditor= new aceeditor('signaleditor_' + id, 'ace/theme/sc_on_dark', 'ace/mode/lisp');      
    TradedeskSignalEditor.setOptions({
        fontFamily: "sans-serif",
        fontSize: 10,
        readOnly: true,
        showPrintMargin: false,
        showGutter: false
    });

    TradedeskSCEditor    = new aceeditor('tradedeskeditor',        "ace/theme/sc_on_dark", "ace/mode/lisp");        
    TradedeskSCEditor.setOptions({
        useSoftTabs: true,
        showPrintMargin: false,  
        readOnly: true,        
    });    
}

function tradedesk_editors_update () {
    TradedeskSignalEditor.setMode(); //highlights update
    TradedeskSCEditor.setMode();   
}


function onclick_tradedeskcurrenciesrow(elt, event) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var terminal = solution.CurrentTerminal;
    var PG = terminal.PG;
    

    var symbol = PG.Symbols[rowindex];
    Symbol_Select(terminal, symbol, PG.Canvas.CurrentPeriod);    
}

var EnginesMenu = [];
var ObjectsMenu = [];
const Automation_Label_Automatic  = 'Auto';
const Automation_Label_Manual     = 'Manu';




$(document).on('change', '#tradedeskstrategyselect', function () {
    var enginename= $("#tradedeskstrategyselect option:selected").val();
    var engine = solution.CurrentTerminal.PG.GetEngineFromNameOperation(enginename, "BUYSELL");      
    SelectEngine(engine);        
    $("#tradedeskstrategyselect option[value='--Select Strategy--']").remove();     
    $('#tradedesk_strategy_name').html(enginename) ; 
});		

$(document).on('change', '#tradedesksyssignalselect', function () {
    var indicatorname = $("#tradedesksyssignalselect option:selected").val();
    $("#tradedesksyssignalselect option[value='--Select Indicator--']").remove();       

    if ( CurrentTSystemObjectName != indicatorname) {
        CurrentTSystemObjectName = indicatorname;              
        sb.box_toggle ('boxtsignalspanel', true);            
    }  

});	

$(document).on('mousedown', '#tsignalstable th', function (event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    var PG = symbolcanvas.PG;
    var periodname = event.target.innerHTML;
    var period = PG.Period2Int(periodname);
    Symbol_Select(solution.CurrentTerminal, symbolcanvas.CurrentSymbol,period);              
//        SelectPeriod (solution.CurrentTerminal, symbolcanvas.CurrentSymbol, period);
});		




function onclick_sessioncommand (elt, event) {
    switch (elt.id) {
        case 'exitall':
            LaunchSessionConfirm (elt.id, "Exit all strategies for all currencies");
        break;
        case 'exitbuy':
            LaunchSessionConfirm (elt.id, "Exit all buy orders for all strategies and for all currencies");
            break;
        case 'exitsell':
            LaunchSessionConfirm (elt.id, "Exit all sell orders for all strategies and for all currencies");
            break;
        case 'closeall':
            LaunchSessionConfirm (elt.id, "Close all orders for all strategies and for all currencies");
            break;
        case 'closebuy':
            LaunchSessionConfirm (elt.id, "Close all buy orders for all strategies and for all currencies");
            break;
        case 'closesell':
            LaunchSessionConfirm (elt.id, "Close all sell orders for all strategies and for all currencies");
            break;
        case 'manual':
            break;
    }
}    

function ondblclick_sessionsrow (elt, event) {
    if (!solution.CurrentTerminal) return;
    var PG = solution.CurrentTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var symbolname  = sb.table_getcellcontent (sessionstable, rowindex, 'Symbol');


    var symbol = PG.GetSymbolFromName(symbolname);
    if (!symbol) return;                    
    
    Symbol_Select(solution.CurrentTerminal, symbol, PG.Canvas.CurrentPeriod);        
    
    var rule        = RuleName.indexOf (sb.table_getcellcontent (sessionstable, rowindex, 'Rule'));
    var operation   = OperationName.indexOf(sb.table_getcellcontent (sessionstable, rowindex, 'Operation'));    
    if (rule == R_Z) {   // manual
        return;
    }
    var session = PG.GetSessionFrom(symbolname, operation, rule);
    if (!session) return;

    OnSelectSession (session);   
}

function oncontextmenu_sessionsrow (elt, event) {

    event.preventDefault();    
    event.stopPropagation();


    if (!solution.CurrentTerminal) return;
    var PG = solution.CurrentTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];   

    var symbolname  = sb.table_getcellcontent (sessionstable, rowindex, 'Symbol');
    var rule        = RuleName.indexOf (sb.table_getcellcontent (sessionstable, rowindex, 'Rule'));
    var operation   = OperationName.indexOf(sb.table_getcellcontent (sessionstable, rowindex, 'Operation'));    
    
    var session = PG.GetSessionFrom(symbolname, operation, rule);
    if (!session) return;    
    var MenuItems = [];

    FillSessionMenu(session, MenuItems);

   sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),   
        event: event,                  
        pageX: event.pageX,
        pageY: event.pageY,
        par: session,
        onselect: function (elt, par) {
            OnSessionCommand (solution.CurrentTerminal, par, parseInt(elt.id));
        },
        html: sb.menu (MenuItems)
    });       

}

//---------------------------------------------------------   TRADEDESK MAIN PANEL    ------------------------------------------------------   



//------------------------------------------------------ ORDERS PANEL ------------------------------------------------------

function onclick_ordercommand (elt, event) {
    onclick_sessioncommand (elt);
}    

function ondblclick_ordersrow (elt, event) {
    if (!solution.CurrentTerminal) return;
    var PG = solution.CurrentTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var symbolname  = sb.table_getcellcontent (orderstable, rowindex, 'Symbol');

    var symbol = PG.GetSymbolFromName(symbolname);
    if (!symbol) return;                    
    
    Symbol_Select(solution.CurrentTerminal, symbol, PG.Canvas.CurrentPeriod);       
}

function oncontextmenu_ordersrow (elt, event) {

    event.preventDefault();    
    event.stopPropagation();


    if (!solution.CurrentTerminal) return;
    var PG = solution.CurrentTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];   

    var symbolname  = sb.table_getcellcontent (sessionstable, rowindex, 'Symbol');

    var MenuItems = [];
    FillOrderMenu(MenuItems);

   sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),   
        event: event,                  
        pageX: event.pageX,
        pageY: event.pageY,
        onselect: function (elt, par) {
          //  OnCommand (par, parseInt(elt.id));
        },
        html: sb.menu (MenuItems)
    });       

}

//------------------------------------------------------------ TRADEDESK BOTTOM PANEL ----------------------------------------------------------

function onclick_tradedesktabs(event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    BottomPanel_Flat (platform, false, true);
} 

function ondblclick_tradedesktabs(elt, event) {
    event.stopPropagation();    
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    BottomPanel_Flat (platform, undefined, true);
} 

//------------------------------------------------------------ TSIGNALS PANEL ----------------------------------------------------------

function onclick_tsyssignalsrow(elt, event) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var terminal = solution.CurrentTerminal;
    if (!terminal) {
        return;
    }

    var PG = terminal.PG;
    var symbol = PG.Symbols[rowindex];

//    SelectSymbol (symbol);
    Symbol_Select(terminal, symbol, PG.Canvas.CurrentPeriod);            
}

function ondblclick_tsyssignalsrow(elt, event) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var terminal = solution.CurrentTerminal;
    if (!terminal) {
        return;
    }

    var PG = terminal.PG;
    var symbol = PG.Symbols[rowindex];
    
//    SelectSymbol (symbol);
    Symbol_Select(terminal, symbol, PG.Canvas.CurrentPeriod);            
    OrderPanel_Show(true);
}

//------------------------------------------------------------ PERCENT CHANGE PANEL ----------------------------------------------------------

function onclick_percentchangetablerow(elt, event) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var terminal = solution.CurrentTerminal;
    if (!terminal) {
        return;
    }

    var PG = terminal.PG;
    var symbol = PG.Symbols[rowindex];
    
//    SelectSymbol (symbol);
    Symbol_Select(terminal, symbol, PG.Canvas.CurrentPeriod);            
}

function ondblclick_percentchangetablerow(elt, event) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var terminal = solution.CurrentTerminal;
    if (!terminal) {
        return;
    }

    var PG = terminal.PG;
    var symbol = PG.Symbols[rowindex];

//    SelectSymbol (symbol);
    Symbol_Select(terminal, symbol, PG.Canvas.CurrentPeriod);        
    OrderPanel_Show(true);
}

//------------------------------------------------------------ TARGETS PANEL ----------------------------------------------------------

function onclick_targetsbar_settings (elt) {
    if (!solution.CurrentTerminal) return;
    openPopupTarget(solution.CurrentTerminal);
}

function onclick_tsignals_settings (elt) {
    openPopupPanelSettings(solution.CurrentTerminal);
}

function onclick_alerts_settings (elt) {
    openPopupAlertsSettings(solution.CurrentTerminal);    
}
function oncontextmenu_alertstablerow(elt, event) {

    event.preventDefault();    
    event.stopPropagation();

    if (!solution.CurrentTerminal) return;
    var PG = solution.CurrentTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];   

    var menu = [];

    var engineindex = rowindex;


    menu.push({id: 1, text: "Clear All Alerts", icon: icon_remove, tooltip: 'Clear Alerts'});
    
   sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),        
        event: event,             
        pageX: event.pageX,
        pageY: event.pageY,
        par: engineindex,
        onselect: function (elt, par) {
           
            var text = $(elt).find('.sb_label').html();
            var engineindex = par;
            var engine = solution.CurrentTerminal.PG.Engines[engineindex];

            if (text == "Clear All Alerts") {
                sb.table_clear (alertstable);
                $('#alertnotificationpanel').html('');                
            } 
        },
        html: sb.menu (menu)
    });      
}


function ondblclick_alertstablerow (event, elt) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];
    var alertid = $('#' + alertstable.id + '_' + rowindex).attr('alertid');
    DrawAlert(rowindex, alertid);    
}


function exportData(Data, type, showFields) {
    // Data       : {}. Can be any data you want to export (records, columns, custom, etc...).
    // type       : string. Extension of file name 'xls' or 'csv' are possible. By default 'excel' format is done on array
    // showFields : boolean (optional). Insert field names on top of the file data. By default 'false'
    var arrData = typeof Data != 'object' ? JSON.parse(Data) : Data;

    var Data = '';

    // show fields on first row ?
    if (showFields) {
        var row = "";
        for (var index in arrData[0]) {
            if (row != "" && type == 'csv') row += ',';
            row += index + '\t';
        }
        row = row.slice(0, -1);
        Data += row + '\r\n';
    }
    // Prepare array data format
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            if (row != "" && type == 'csv') row += ',';
            row += (type == 'xls') ? '"' + arrData[i][index] + '"\t' : arrData[i][index] + '\t'
        }
        row.slice(0, row.length - 1);
        Data += row + '\r\n';
    }
    // No data?
    if (Data == '') {
        w2alert('No Data Found');
        return;
    }
    var fileName = 'ExportData.' + type;
    SaveDataInFile (Data, fileName, 'application/vnd.ms-excel');
}

function onclick_historyexport (elt) {
    exportData(historytable.rows, 'csv', true);
}
//----------------------------------------------------STATEMENT PANEL------------------------------------------------ 

function onclick_statementexport (elt) {
    exportData(statementtable.rows, 'csv', true);
}


function ondblclick_tradedeskcurrenciesrow(elt, event) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var terminal = solution.CurrentTerminal;
    var PG = terminal.PG;

    var symbol = PG.Symbols[rowindex];
  //  SelectSymbol (symbol);
    Symbol_Select(terminal, symbol, PG.Canvas.CurrentPeriod);        
    OrderPanel_Show(true);
}


//---------------------------------------------------- TRADEDESK TOP PANEL  --------------------------------------------------------   

  
function onclick_togglesidebar (rootid, elt) {
    varid = elt[0].id;

    sidebarmenu_select (id, false); //hide
}           

//---------------------------------------------------- TRADEDESK MAIN PANEL  ----------------------------------------------------------------------   


function SessionsPanel (id, classnames) {
    var content =
        sb.bar (sessionsbar) +
        sb.table(sessionstable);
    return content;
}    


function OrdersPanel (id, classnames) {
    var content =
        sb.bar (ordersbar) +
        sb.table(orderstable);
    return content;
} 

function StrategiesPanel (id, classnames) {
    var content =
        sb.bar (StrategiesBar, "sb_transform") +
        sb.table(StrategiesTable);
    return content;
}     

function TradedeskTopPanel (id, classnames) {
    var content = 
'   <div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +
        sb.tabs (tradedesk_maintabs, 'sb_main sb_column') +
'   </div>';
    return content;                             
 }

function TradedeskBottomPanel (id, classnames) {

    var content = 
'   <div id="' + id + 'bottompanel" class="' + (classnames ? classnames : '')  + '">' +    
        sb.tabs (tradedesk_bottomtabs) +
'   </div>';
    
    return content;                             
}

function TradedeskMainPanel (id) {
    var content =
    TradedeskTopPanel (id + 'toppanel', 'sb_main') +
    '<div id="' + id+ 'panel_drag" class="dragbar_h" dragid="' + id + 'bottompanel"></div>' +           
    TradedeskBottomPanel (id,  'sb_column sb_top');

    return content;       
}


//------------------------------------------------------------ TERMINAL TYPE PANEL ----------------------------------------------------------

function onclick_tradedesktype (type) {


    if (!solution.CurrentTerminal) return;
    var terminal = solution.GetTerminalFromNameType(solution.CurrentTerminal.Name, type);
    if (!terminal) return;

    tradedesk_selectterminal(terminal);
}

//------------------------------------------------------------ SYMBOL TAB----------------------------------------------------------

function onclick_tradedesksymboltab (elt) {
    
    var symbolcanvas = solution.GetCanvasFromTerminal(solution.CurrentTerminal);
    if (!symbolcanvas) return;      

    var symbolname = elt.innerText;
    var Symbol = symbolcanvas.PG.GetSymbolFromName(symbolname);

    Symbol_Select(solution.CurrentTerminal, Symbol, symbolcanvas.CurrentPeriod);                    
}

//-----------------------------------------------------

function SAccountPanel () {
    var content = 
'   <div id = "accounttotalprofit" class="form-control">' + 
'       <input id ="menutotalprofit" type="text" class="form-control" readonly>' + 
        sb.item({id: 'closepositions',   type:'link',  title: 'Close Positions', icon: icon_close,   events: {onclick: "onclick_closepositions(this)"}}) +
'   </div>' ;
    return content;
}

function AccountPanel(id, classnames) {
    var content = 
 
'   <div class="sb_formgroup">' +
'       <label>Name</label>' +
'       <input id ="accountname" class="form-control" readonly value=""/>' +
'   </div>' +
'   <div class="sb_formgroup">' + 
'       <label>Start Date</label>' + 
'       <input id ="accountstartdate" class="form-control" readonly value=""/>' + 
'       <label class="right-inline">Account Nbr</label>' + 
'       <input id ="accountnumber" class="form-control" readonly value=""/>' + 
'   </div>' + 
'   <div class="sb_formgroup">' + 
'       <label>Equity</label>' + 
'       <input id ="equity" class="form-control" readonly value=""/>' + 
'       <label class="right-inline">Balance</label>' + 
'       <input id ="balance" class="form-control" readonly value=""/>' + 
'   </div>' + 
'   <div class="sb_formgroup">' + 
'       <label>Free margin</label>' + 
'       <input id ="freemargin" class="form-control" readonly value=""/>' + 
'       <label class="right-inline">Margin</label>' + 
'       <input id ="margin" class="form-control" readonly value=""/>' + 
'   </div>' + 
'   <div class="sb_formgroup">' + 
'       <label>Leverage</label>' + 
'       <input id ="leverage" class="form-control" readonly value=""/>' + 
'       <label class="right-inline">Nbr Lots</label>' + 
'       <input id ="nbrlots" class="form-control" readonly value=""/>' + 
'   </div>' + 
'   <div class="sb_formgroup">' + 
'       <label>Total Profit</label>' + 
'       <input id ="totalprofit" class="form-control" readonly value=""/>' + 
'       <label class="right-inline">Currency</label>' + 
'       <input id ="accountcurrency" class="form-control" readonly value=""/>' + 
'   </div>' + 
'   <div class="sb_formgroup">' +
'       <label>Elapsed</label>' +
'       <input id ="accountelapsed" class="form-control" readonly value=""/>' + 
'   </div>' ;
    return content;
}

//-----------------------------------------------------

function CurrenciesPanel (id, classnames) {
    var content =
        '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 
        sb.table(tradedeskcurrenciestable) +
    '</div>';
    return content;
}     

//-----------------------------------------------------

function TSysSignalsSelectPanel (id, classnames) {
    var content = 
    '   <div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +

    '   <select  class="custom-select form-control" id="tradedesksyssignalselect" data-id="tradedesksyssignalselect">' +
    '   </select>' +
    '</div>';
    return content;
}

//-----------------------------------------------------

function AutomationPanel (id, classnames) {

    var content =
        '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 
    '</div>';
        
    return content;
}     


//------------------------------------------------------------------ SIDEBAR ENGINE LOOK PANEL ------------------------------------------------------------

function TradedeskStrategyPanel (classnames) {
    var content = 
'   <div id="tradedeskpanel_Strategy'  + '" class="strategypanel ' + (classnames ? classnames : '')  + '">' +    
        sb.tabs (sessiontabs) +
'   </div>';
    return content;                             
}

            
function SessionPropertiesPanel (classnames) {                      
    Init_strategypropertiestable(sessionpropertiestable);
    var content =
        sb.table (sessionpropertiestable);
    return content;
}

function SessionSchedulePanel (classnames) {

    Init_strategyscheduletable(sessionscheduletable, sessionschedulepropertytable);

    var content =
        sb.table (sessionscheduletable) +
        sb.table (sessionschedulepropertytable);
    return content;
}


function EngineLookHeaderPanel () {
    var content =     
//    '<span class="togglesidebar ' + icon_toggle + '" onclick="onclick_togglesidebar(this);"></span>' + 
    '<div class="sb_sidebarheader">' +
    '   <div class="sb_sidebarheadertitle">INSPECT STRATEGY </div>' +
    
    '   <a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>' +
    '</div>';         
    return content;
}

//------------------------------------------------------------------ SIDEBAR HISTORY PANEL ------------------------------------------------------------



function HistoryOrderPanel(id, classnames) {
    var content = 
'    <div class="sb_formgroup sb_bodygroup">' + 
'        <label>Start Date</label>' + 
'        <input id ="historystartdate" class="form-control" type="date" value="2013-01-08" />' + 
'        <label class="right-inline">End Date</label>' + 
'        <input id ="historyenddate" class="form-control" type="date" value="2013-01-08"/>' + 
'    </div>' + 
'    <div class="sb_buttongroup">' +
'        <button id="historyselect" class="sb_button"  type="button" disabled onclick="onclick_historyselect(this)">Get History</button>' +
'    </div>'; 
    return content;
}

//------------------------------------------------------------------ SIDEBAR NEWS PANEL ------------------------------------------------------------


function TradedeskTypePanel_Type () {
    if ($("#testerradio").prop("checked"))
        return  'Tester';
    if ($("#terminalradio").prop("checked"))

    return 'Terminal';
}


//------------------------------------------------------------------ ENGINE LOOK PANEL ------------------------------------------------------------

function TradedeskSelectStrategyPanel_Update (engines) {
    var elt1 = document.getElementById('tradedeskstrategyselect');   
    elt1.innerHTML = ' <option value="' + '--Select Strategy--' + '">' + '--Select Strategy--' + '</option>';      
    for (var j = 0; j < engines.length; j++) {
        var engine = engines[j];
        elt1.insertAdjacentHTML('beforeend','<option value="' + engines[j].Name + '">' + engines[j].Name + '</option>');   
    }        
} 

function SessionOrdersPanel (id, classnames) {
    var content =
     '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 
        sb.bar (SessionOrdersBar, "sb_transform") +
        sb.table(SessionOrdersTable) +
    '</div>';
    return content;
}     

function SessionOrdersPanel_Update (Session) {
    var SessionNumber = Session.SessionNumber;
    var Symbol = solution.CurrentTerminal.PG.GetSymbolFromName(Session.Symbol);
    var Orders = (Session.Engine == "Manual") ? solution.CurrentTerminal.PG.Orders : solution.CurrentTerminal.PG.EOrders;
   
    sb.table_clear (SessionOrdersTable);
    var rows= [];

    var nbrlots = 0;
    for (i = 0; i < Orders.length; i++) {
        if (Orders[i].Symbol == Symbol.Name && (SessionNumber < 0 || Orders[i].SessionNumber == SessionNumber)) {
            var date = new Date(Orders[i].Time);

            if (+Orders[i].Type == OP_BUY) {
                nbrlots = nbrlots + parseFloat(Orders[i].Size);
            }
            else {
                nbrlots = nbrlots - parseFloat(Orders[i].Size);
            }

            rows.push ([Orders[i].Symbol, Orders[i].Number, OpName[Orders[i].Type], Orders[i].Profit, Orders[i].Size, Orders[i].OPrice, Orders[i].CPrice,
                Orders[i].SL, Orders[i].TP, date.format('MM-DD-YYYY HH:mm:ss'), Orders[i].CTime, Orders[i].Commission, Orders[i].Swap,  Orders[i].DataType,  Orders[i].DataType,  Orders[i].Comment]);                     
        }
    }
    sb.table_setrows (SessionOrdersTable, rows)    

    SessionOrdersPanel_Refresh(Session)
}


function SessionOrdersPanel_Refresh(Session) {
    if (!Session) return;
    if (!solution.CurrentTerminal) return;
    
    var SessionNumber = Session.SessionNumber;
    var Symbol = solution.CurrentTerminal.PG.GetSymbolFromName(Session.Symbol);
    var Orders = (Session.Engine == "Manual") ? solution.CurrentTerminal.PG.Orders : solution.CurrentTerminal.PG.EOrders;
    var nbrlots = 0;
    var profit = 0;

    for (var i = 0; i < Orders.length; i++) {
        if (Orders[i].DataType == MODE_HISTORY) continue;

        if (Orders[i].Symbol == Symbol.Name && (SessionNumber < 0 || Orders[i].SessionNumber == SessionNumber)) {
            var orderindex = Orders[i].Number;
           
            if (+Orders[i].Profit >= 0) {
                profit = profit + parseFloat(Orders[i].Profit);
                sb.table_setcellcolor (SessionOrdersTable, orderindex, 'Profit', theme_bull);
            } else {
                profit = profit - parseFloat(Orders[i].Profit);
                sb.table_setcellcolor (SessionOrdersTable, orderindex, 'Profit', theme_bear);                
            }
            if (+Orders[i].Type == OP_BUY) nbrlots = nbrlots + parseFloat(Orders[i].Size);
            else nbrlots = nbrlots - parseFloat(Orders[i].Size);
            
            if (+Orders[i].SL != 0) {
                sb.table_setcellbackground (SessionOrdersTable, orderindex, 'S/L', 'var(--theme-SL)');   
            }
            if (+Orders[i].TP != 0) {
                sb.table_setcellbackground (SessionOrdersTable, orderindex, 'T/P', 'var(--theme-SL)');                   
            }
        }
    }
}



//------------------------------------------------------ STRATEGIES PANEL ------------------------------------------------------

function StrategiesPanel_Refresh (index) { 
    sb.table_setcellcontent (StrategiesTable, index, 'Buy',  EngineBuyNbrTab[index]);       
    sb.table_setcellcontent (StrategiesTable, index, 'Sell', EngineSellNbrTab[index]);  


    if (EngineSellNbrTab[index] > EngineBuyNbrTab[index]) {
        sb.table_setcellbackground (StrategiesTable, index, 'Buy', '');       
        sb.table_setcellbackground (StrategiesTable, index, 'Sell', theme_bear);         
    } else
    if (EngineSellNbrTab[index] < EngineBuyNbrTab[index]) {
        sb.table_setcellbackground (StrategiesTable, index, 'Buy', theme_bull);       
        sb.table_setcellbackground (StrategiesTable, index, 'Sell', '');            
    } else {
        sb.table_setcellbackground (StrategiesTable, index, 'Buy', '');       
        sb.table_setcellbackground (StrategiesTable, index, 'Sell', '');       
    }
}


function StrategiesPanel_Update (engines, table) {
    for (var j = 0; j < engines.length; j++) {
        var engine = engines[j];
        sb.table_addcolumn(table, engine.Name, engine.Name, ''); 
    }
}


//------------------------------------------------------ SESSIONS PANEL ------------------------------------------------------

function LaunchSessionConfirm(target, text, symbolName) {
    sb.confirm_modal(text).yes(function () {
        switch (target) {
            case 'exitall':
                OnExitAll(solution.CurrentTerminal, OP_BUYSELL);
                break;
            case 'exitbuy':
                OnExitAll(solution.CurrentTerminal, OP_BUY);
                break;
            case 'exitsell':
                OnExitAll(solution.CurrentTerminal, OP_SELL);
                break;
            case 'closeall':
                OnCloseAll(solution.CurrentTerminal, OP_BUYSELL);
                break;
            case 'closebuy':
                OnCloseAll(solution.CurrentTerminal, OP_BUY);
                break;
            case 'closesell':
                OnCloseAll(solution.CurrentTerminal, OP_SELL);
                break;
            
        }                    
        $("#confirmmodal").modal('hide');        
    }).no(function () {})
}

function FillSessionMenu (Session, menuitems) {
    var snbrTrade;
    var bnbrTrade;
    var hedgetype;
    var rule = RuleName[Session.StartRule];
    if (rule != S_MANUAL) {
       menuitems.push(SessionMenu[ID_MANUALSESSION]);
       menuitems.push(SessionMenu[ID_SPACE]);
       menuitems.push(SessionMenu[ID_DATASESSION]);
       menuitems.push(SessionMenu[ID_SPACE]);
       menuitems.push(SessionMenu[ID_SUSPENDSESSION]);
       menuitems.push(SessionMenu[ID_RESTARTSESSION]);
       menuitems.push(SessionMenu[ID_SPACE]);
    }
    snbrTrade = Session.SellNbrTrade;
    bnbrTrade = Session.BuyNbrTrade;
    hedgetype = Session.HedgeType;
    if (bnbrTrade != "0") menuitems.push(SessionMenu[ID_CLOSEBUYSESSION]);
    if (snbrTrade != "0") menuitems.push(SessionMenu[ID_CLOSESELLSESSION]);
    if (snbrTrade != "0" || bnbrTrade != "0") menuitems.push(SessionMenu[ID_CLOSESESSION]);
    if (bnbrTrade != "0" || +snbrTrade != 0) menuitems.push(SessionMenu[ID_SPACE]);
    if (Session.Operation == OP_BUYSELL && Session.ExitBuy == "0" && Session.ExitSell == "0" && rule != S_MANUAL) {
        if (Session.OrderType == OT_HEDGE) {
            menuitems.push(SessionMenu[ID_KEEPBUYSELLSESSION]);
            menuitems.push(SessionMenu[ID_RELEASEBUYSELLSESSION]);
            menuitems.push(SessionMenu[ID_SPACE]);
        }
    }
    if ((Session.Operation == OP_BUYSELL || Session.Operation == OP_BUY) && Session.ExitBuy == "0") menuitems.push(SessionMenu[ID_EXITBUYSESSION]);
    if ((Session.Operation == OP_BUYSELL || Session.Operation == OP_SELL) && Session.ExitSell == "0") menuitems.push(SessionMenu[ID_EXITSELLSESSION]);
    menuitems.push(SessionMenu[ID_EXITSESSION]);
    menuitems.push(SessionMenu[ID_SPACE]);
    if (bnbrTrade != "0" && Session.ExitBuy == "0") menuitems.push(SessionMenu[ID_HEDGESESSIONBUY]);
    if (hedgetype == OP_SELL || hedgetype == OP_BUYSELL) menuitems.push(SessionMenu[ID_UNHEDGESESSIONBUY]);
    if (snbrTrade != "0" && Session.ExitSell == "0") menuitems.push(SessionMenu[ID_HEDGESESSIONSELL]);
    if (hedgetype == OP_BUY || hedgetype == OP_BUYSELL) SessimenuitemsonMenu.push(SessionMenu[ID_UNHEDGESESSIONSELL]);
}



function OnSelectSession(Session) {
    sidebarmenu_select ( 'sidebar_enginelook', true);
    SelectSession(Session);
}



function FillOrderMenu (menuitems) {
    menuitems.push(OrderMenu[ID_CLOSEORDER]);
    menuitems.push(OrderMenu[ID_MODIFYORDER]);
}

function OrdersPanel_Refresh (type) {
    if(!solution.CurrentTerminal) return;
    
    var PG = solution.CurrentTerminal.PG;
    var Id = (type == MANUAL_ORDER) ? 'orders' : 'eorders';
    var Orders = (type == MANUAL_ORDER) ? PG.Orders : PG.EOrders;
    var BuyProfit = 0;
    var SellProfit = 0;
    var BuySize = 0;
    var SellSize = 0;

    Orders =  PG.Orders;
    for (var i = PG.Orders.length - 1; i >= 0; i--) {
        if (Orders[i].DataType == MODE_HISTORY) continue;
        
        var rowindex = Orders[i].Number;    

        if (+Orders[i].Profit >= 0) {
            sb.table_setcellcolor (orderstable, rowindex, 'Profit', theme_bull)
        } else {
            sb.table_setcellcolor (orderstable, rowindex, 'Profit', theme_bear)            
        }
        if (+Orders[i].SL != 0) {
            sb.table_setcellbackground (orderstable, rowindex, 'S/L', 'var(--theme-SL)')  
        }
        if (+Orders[i].TP != 0) {
            sb.table_setcellbackground (orderstable, rowindex, 'T/P', 'var(--theme-TP)')              
        }
        if (+Orders[i].Commission >= 0) {
            sb.table_setcellcolor (orderstable, rowindex, 'Commission', theme_bull)
        } else {
            sb.table_setcellcolor (orderstable, rowindex, 'Commission', theme_bear)            
        }        
    }
    
    Orders =  PG.EOrders;
    for (var i = Orders.length - 1; i >= 0; i--) {
        if (Orders[i].DataType == MODE_HISTORY) continue;
        
        var rowindex = Orders[i].Number;    

        if (+Orders[i].Profit >= 0) {
            sb.table_setcellcolor (orderstable, rowindex, 'Profit', theme_bull)             
        } else {
            sb.table_setcellcolor (orderstable, rowindex, 'Profit', theme_bear)             
        }
        if (+Orders[i].SL != 0) {
            sb.table_setcellbackground (orderstable, rowindex, 'S/L', 'var(--theme-SL)')                
        }
        if (+Orders[i].TP != 0) {
            sb.table_setcellbackground (orderstable, rowindex, 'T/P', 'var(--theme-TP)')                
        }
        if (+Orders[i].Commission >= 0) {
            sb.table_setcellcolor (orderstable, rowindex, 'Commission', theme_bull)
        } else {
            sb.table_setcellcolor (orderstable, rowindex, 'Commission', theme_bear)            
        }           
    }
}

//------------------------------------------------------ ALERTS PANEL ------------------------------------------------------

function onclick_alertsignal (elt, objectname, tableid) {
    let PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }    
    let table             = alertssettingstable;

    let signaldescription = elt.children[0].title;
    var signaltype        = elt.children[0].type;
    let signalname        = elt.children[0].children[0].textContent;
 
    $(elt).closest('.sb_overlay').remove();         

    
    let object          = PG.GetObjectFromName (objectname);
    if (!object) {
        return;
    }
    
    var signals         = GetSignalsFromObject (object);
    var signal          = GetSignalFromSignalName (signals, signalname);    
    
    if (!signal) {
        return;
    }
    
    var tooltip         = signal.description;
    var signaltype      = signal.type;

    var periods         = (1 << P_H1);    
    var operatorname    = 'OR';
    var not             = '0';
    var previous        = '0';
    var typename        = 'ANY BAR';
    var opvalue         =  signal.type == 'Boolean' ? '----' : AlertOpValueMenu[0].text;
    var value           = '';

    var id              = table.id;
    var rownumber       = table.rows.length;
    
    var rowtoadd = tracker_addrow (table, 
        rownumber, 
        object, 
        signalname, 
        periods, 
        operatorname, 
        not, 
        previous, 
        typename, 
        opvalue, 
        value, 
        signaltype, 
        true)

    var rowcontent = '<tr id= "' + id +  '_' + rownumber  + '" title="' + tooltip + '">';
      
    for (var j = 0; j < table.columns.length; j++) {
        rowcontent += '<td id= "' + id + '_' + alert.Id + '_'  + j + '">' + rowtoadd[j] + '</td>';
    }
    rowcontent += '</tr>';               
 
    $('#' + id + ' tbody').prepend (rowcontent);    
}

function onclick_selectalertindicator (elt, event) {
    event.stopPropagation();
    var objectname = elt.children[0].children[0].innerText;
    PickerSignalsPanel_Update (objectname, undefined, 'onclick_alertsignal(this,\'' +  objectname + '\')')   
}

function onclick_alertsettingsbar_add (elt, event) {
    openPopupPickerIndicator(event, 'popupalertssettings', undefined, 'onclick_selectalertindicator(this,event)');
}


function AlertPanel_Update (pg, table) {
   sb.table_clear(table);

    for (var j = 0; j < pg.Alerts.length; j++) {
        var alert = pg.Alerts[j];
        AlertSettingsPanel_Add (pg, table, alert);
    }
}

function AlertSettingsPanel_Update (terminal, panelid, table) {
    var PG = terminal.PG;    
    table.rows = []; 

    for (var j = 0; j < PG.Alerts.length; j++) {
        var alert = PG.Alerts[j];
        var object          = PG.GetObjectFromName (alert.Object);
        if (!object) return;
     
        var objectname      = alert.Object;
        var signalname      = alert.Signal;
        var signals         = GetSignalsFromObject (object);
        var signal          = GetSignalFromSignalName (signals, signalname);    
        
        if (!signal) {
            return;
        }
        
        var periods         = alert.Periods;
        var operatorname    = AlertOperationMenu[alert.Operator].text;
        var not             = alert.Not;
        var previous        = alert.Previous;
        var typename        = AlertTypeMenu[alert.Type].text;
        var opvalue         = alert.OpValue == 5 ? '----' : AlertOpValueMenu[alert.OpValue].text;
        var value           = alert.Value;
    
    
        var tooltip         = signal.description;
        var signaltype      = signal.type;        
        tracker_addrow (table, j, object, signalname, periods, operatorname, not, previous, typename, opvalue, value, signaltype);
    }
    $('#' + panelid).html(sb.table (table));
}

function AlertSettingsPanel_Add (PG, table, alert) {
   
    var object          = PG.GetObjectFromName (alert.Object);
    if (!object) return;
 
    var objectname      = alert.Object;
    var signalname      = alert.Signal;
    var signals         = GetSignalsFromObject (object);
    var signal          = GetSignalFromSignalName (signals, signalname);    
    
    if (!signal) {
        return;
    }
    
    var periods         = alert.Periods;
    var operatorname    = AlertOperationMenu[alert.Operator].text;  //AND OR
    var not             = alert.Not;
    var previous        = alert.Previous;
    var typename        = AlertTypeMenu[alert.Type].text;  // FIRST ANY FIRST TICK
    var opvalue         = alert.OpValue == 5 ? '----' : AlertOpValueMenu[alert.OpValue].text;
    var value           = alert.Value;


    var tooltip         = signal.description;
    var signaltype      = signal.type;

    var id              = table.id;
    var rownumber       = table.rows.length;


    var rowtoadd = tracker_addrow (table, rownumber, object, signalname, periods, operatorname, not, previous, typename, opvalue, value, signaltype);

    var rowcontent = '<tr id= "' + id +  '_' + rownumber  + '" title="' + tooltip + '">';
      
    for (var j = 0; j < table.columns.length; j++) {
        rowcontent += '<td id= "' + id + '_' + alert.Id + '_'  + j + '">' + rowtoadd[j] + '</td>';
    }
    rowcontent += '</tr>';               
 
    $('#' + id + ' tbody').append (rowcontent);
  
}

function onclick_savealertssettings(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) {
        return;
    } 
    SaveAlerts (terminal);
    ReloadAlerts(terminalname, terminaltype);
    $("#popupalertssettings").modal('hide');       
}

function openPopupAlertsSettings(terminal) {
    
    if (!terminal) return;

    sb.modal ({
        id: 'popupalertssettings', 
        header: 'MT4 Alerts Settings', 
        width: 800,
        height: 380,
        resizable: true,
        static: true,
        onopen : function () {AlertPanel_Update(terminal.PG, alertssettingstable)}, //AlertSettingsPanel_Update(terminal, 'alertssettingspanel', alertssettingstable)},      
        body: sb.render (alertssettingspanel), 
        footer: 
        '<button class="sb_mbutton"   data-bs-dismiss="modal">Cancel</button>' +
        '<button class="sb_mbutton"   onclick="onclick_savealertssettings(\'' + terminal.Name + '\',\'' + terminal.Type + '\');">Save</button>' 
    });    
}

function ReloadAlerts(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var sorder = "*RELOADALERTFILE ";
    for (var i = 0; i < PG.Symbols.length; i++) {
        terminal.Com.Send(solution.UserId + '*' + PG.Symbols[i].Name + sorder);
    }
}
/// PROJECTS


function SaveAlerts (terminal) {    
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var PG = terminal.PG;    

    var alerttablerows = $('#alertssettingstable tbody tr');

    var periods;
    PG.Alerts = [];

    for (i = 0; i < alerttablerows.length; i++) {

        periods = 0;
        for (j = 0; j <= NBR_PERIODS; j++)
            if ($(alerttablerows[i].children[j + 8].children[0].children[0]).is(":checked")) periods |= (1 << j);
        
        var id          = 100 + i;
        var objectname  = $(alerttablerows[i].children[1].children[0]).html();  //div
        var signalname  = $(alerttablerows[i].children[2].children[0]).val();  //select            
        var objsignal   = solution.CurrentTerminal.PG.GetSignalFromName(signalname);
        var operator    = getmenuindexfromname(AlertOperationMenu, $(alerttablerows[i].children[7].children[0]).val());    //Alert.Operator   4
        var notname     = "0";                                                                                             //Alert.Not        5     operator not set
        var previous    = ($(alerttablerows[i].children[5].children[0].children[0]).is(":checked") ? "1" : "0");           //Alert.Previous   6
        var type        = getmenuindexfromname(AlertTypeMenu, $(alerttablerows[i].children[6].children[0]).val());         //Alert.Type       7
        var opvalue     = ($(alerttablerows[i].children[3].children[0]).val() == ''  ? "5" : getmenuindexfromname(AlertOpValueMenu, $(alerttablerows[i].children[3].children[0]).val())); //Alert.OpValue 8
        var value       = ($(alerttablerows[i].children[4].children[0]).val() == ''  ? "0" : $(alerttablerows[i].children[4].children[0]).val());//Alert.Value 9

        var onoff       = [0, 0, 0, 0];
        var code        = 233; 
        var color       = (objsignal ? objsignal.Color : '#gray');
        var from        = 0; 
        var size        = 20; 
        var distance    = 0; 
        var soundtext   = (objsignal ? objsignal.Sound : ''); 
        var alerttext   = (objsignal ? objsignal.Sound : ''); 
        var mailfromname= "PROGRESS SIGNAL"; 
        var mailfromadress= "administrator@jurextrade.com"; 
        var mailtoadress = ""; 
        var mailccadress = ""; 
        var mailsubject  = "* PIVOT_HIGH   CROSS_UP *"; 
        var mailcontent  = ""; 


        var Alert = new pgalert(id, objectname, signalname, periods, operator, notname, previous, type, opvalue, value, color);
        PG.Alerts.push(Alert);
        Alert.Set(onoff, code, color, from, size, distance, soundtext, alerttext, mailfromname, mailfromadress, mailtoadress, mailccadress, mailsubject, mailcontent); 
    }
    PG.SaveAlerts (terminal)

 
    return content;
}

function DrawAlert(rowindex, alertid) {
   
    if (!solution.CurrentTerminal) {
        return;
    }
    var terminal = solution.CurrentTerminal;

    var alert   = terminal.PG.GetAlertFromId(alertid);

    if (alert == null) {
        return;
    }
    
    var objsignal = terminal.PG.GetSignalFromName(alert.Signal);
    var color = (objsignal ? objsignal.Color : 'gray');
    
    if (alertstable.rows.length == 0) {
        return;
    }

    var PG = terminal.PG;
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;        

    sb.table_rowselect (alertstable, rowindex);

    var symbolname      = sb.table_getcellcontent (alertstable, rowindex, 'Symbol');
    var symbol          = PG.GetSymbolFromName(symbolname);

    var date            = new Date(sb.table_getcellcontent (alertstable, rowindex, 'Time'))
    var time            = date.getTime();
    var periodvalues    = sb.table_getcellcontent (alertstable, rowindex, 'Period').split(' ');

    var choosenperiod;
    
    var iperiod = [];
    
    for (var i = 0; i < periodvalues.length; i++) {
        iperiod.push(PG.Period2Int(periodvalues[i]));
    }
    
    if (iperiod.includes(symbolcanvas.CurrentPeriod)) {
        choosenperiod = symbolcanvas.CurrentPeriod;
    } else {
        choosenperiod = iperiod[0];
    }
    
    var data   = symbol.chartData[choosenperiod];
    var length = symbol.chartData[choosenperiod].length - 1;

    var barindex = FindIdxDataFromTime(time, data);
    
    if (barindex < 0) {
        return;
    }

    Chart_XExtents(terminal, symbol, choosenperiod, data[Math.max(0, barindex - 50)].date, data[Math.min(length, barindex + 50)].date)
    Symbol_Select(terminal, symbol, choosenperiod, true);   

    barindex = FindIdxDataFromTime(time, symbol.plotData);
    barindex = +alert.Previous == 0 ? barindex : barindex - 1;    

    if (barindex < 0) {
        return;
    }
    
    symbolcanvas.Alerts = {alertid: alertid, color: color, pos: symbol.plotData[barindex]};
    Chart_Draw(terminal);
}



//----------------------------------------------------HISTORY PANEL------------------------------------------------ 


function HistoryPanel_Update (terminal) {
    $('#historystartdate').val ((new Date(terminal.User.AccountStartDate)).format('YYYY-MM-DD'));
    $('#historyenddate').val((new Date()).format('YYYY-MM-DD'));
    $('#historyselect').attr('disabled',  false);    
}

function OnGetProfit(terminal, startdate, enddate) {

    var PG = terminal.PG;
    var UserId = solution.UserId;
    if (UserId == 0) UserId = 1;
    for (var i = 0; i < PG.Symbols.length; i++) {
        var sorder = "*GET_PROFIT " + "-1 = [" + startdate + " " + enddate + "] ";
        terminal.Com.Send(UserId + '*' + PG.Symbols[i].Name + sorder);
    }
}

function onclick_historyselect (elt) {

    if (!solution.CurrentTerminal) return;

    sdate = new Date($('#historystartdate').val());
    edate = new Date($('#historyenddate').val());
    
    var nowdate = new Date();
    ProfitNbr = 0;

    sb.table_clear(historytable);    
    sb.table_clear(statementtable); 
                       

    for (var i = 0; i < solution.CurrentTerminal.PG.Engines.length; i++) {
        solution.CurrentTerminal.PG.Engines[i].History = new pgenginehistory();
    }
    solution.CurrentTerminal.PG.ManualHistory = new pgenginehistory();
    //2021.09.15
    OnGetProfit(solution.CurrentTerminal, sdate.format ('YYYY.MM.DD'), edate.format ('YYYY.MM.DD'));
}

//---------------------------------------------------- ORDER PANEL  -------------------------------------------------------- 


function OrderPanel_Show(show) {
    sb.box_toggle ('boxorderpanel', show);     
}

function ontick_orderpanel (symbol) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;   
    
    let id= 'orderpanel';

    $('#' + id + ' #ask').html(symbol.Ask);     
    $('#' + id + ' #bid').html(symbol.Bid);     

   
    document.title = symbol.Name + " " + symbol.Bid + "-" + symbol.Ask;
    
    let buytradeorder  = symbol.Order.getorder (OP_BUY);
    let selltradeorder = symbol.Order.getorder (OP_SELL);


    buytradeorder.tradeentry_value[ENTRY_SPOT].value = symbol.Ask;      
    selltradeorder.tradeentry_value[ENTRY_SPOT].value = symbol.Bid;    

    let operation = symbol.Order.operation;
    if (operation == null) {

        $('#' + id + ' #tradeentry_value').val('');                         //fill prices for future and fixed 
        buytradeorder.tradeentry_value[ENTRY_PRECISE].value = symbol.Ask;      
        selltradeorder.tradeentry_value[ENTRY_PRECISE].value = symbol.Bid;    
        return;
    } 
    
    let tradeorder = symbol.Order.getorder (operation);
    let entrytype = tradeorder.tradeentry_type;    
    
    if (entrytype == ENTRY_SPOT) {
        buytradeorder.tradeentry_value[ENTRY_PRECISE].value = symbol.Ask;      
        selltradeorder.tradeentry_value[ENTRY_PRECISE].value = symbol.Bid;    

        $('#' + id + ' #tradeentry_value').val(tradeorder.tradeentry_value[entrytype].value);        

    } else {
    }

    let value = symbol.CalculateLotValue(solution.CurrentTerminal.User.AccountEquity,  tradeorder.tradesize_value[VOLUME_RISK].value);  
    $('#' + id + ' #tradesize_value_a').val(value);
        
    value = (symbol.ATR[symbolcanvas.CurrentPeriod] * +tradeorder.stoploss_value[tradeorder.stoploss_type].value / symbol.SysPoint).toFixed(0);
    $('#' + id + ' #stoploss_value_a').val(value);   
  
    value = (symbol.ATR[symbolcanvas.CurrentPeriod] * +tradeorder.takeprofit_value[tradeorder.takeprofit_type].value / symbol.SysPoint).toFixed(0);
    $('#' + id + ' #takeprofit_value_a').val(value);        
}


function update_orderpanel (symbol) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;   

    let id= 'orderpanel';
    
    let operation = symbol.Order.operation;


    if (operation == null) {
        $('#' + id + ' #buy').removeClass ('checked');
        $('#' + id + ' #sell').removeClass ('checked');
        $('#' + id + ' #tradesubmit').attr('disabled',  true);
        $('#' + id + ' #tradecancel').attr('disabled',  true);    
        

        $('#' + id + ' #tradeentry_type').attr('disabled',  true);    
        $('#' + id + ' #tradeentry_value').attr('disabled',  true);    
        $('#' + id + ' #tradeentry_value').val('');

        $('#' + id + ' #tradesize_type').attr('disabled',  true);
        $('#' + id + ' #tradesize_value').attr('disabled',  true);
        $('#' + id + ' #tradesize_value_a').css('visibility', 'hidden');
        if ($('#' + id + ' #tradesize_value').val() == TRADE_VOLUME_MENU[VOLUME_PIPS].text) {
            $('#' + id + ' #tradesize_value').val(symbol.MinLot);  
        }
        else {
            $('#' + id + ' #tradesize_value').val('2.0');  
        }

        $('#' + id + ' #stoploss_type').attr('disabled',  true);    
        $('#' + id + ' #stoploss_value').attr('disabled',  true);    
        $('#' + id + ' #stoploss_value').val('0');  
        $('#' + id + ' #stoploss_value_a').css('visibility', 'hidden');  

        $('#' + id + ' #takeprofit_value').attr('disabled',  true);    
        $('#' + id + ' #takeprofit_type').attr('disabled',  true);    
        $('#' + id + ' #takeprofit_value').val('0');  
        $('#' + id + ' #takeprofit_value_a').css('visibility', 'hidden');              
       
        return;

    } else {
        $('#' + id + ' #tradesubmit').removeAttr('disabled');
        $('#' + id + ' #tradecancel').removeAttr('disabled'); 

        if (operation == OP_BUY) {
            $('#' + id + ' #buy').addClass ('checked');
            $('#' + id + ' #sell').removeClass ('checked')        
        }
        else {
            $('#' + id + ' #sell').addClass ('checked');
            $('#' + id + ' #buy').removeClass ('checked')        
        }
        $('#' + id + ' #tradeentry_type').removeAttr('disabled');    

        $('#' + id + ' #tradesize_type').removeAttr('disabled');
        $('#' + id + ' #tradesize_value').removeAttr('disabled');

        $('#' + id + ' #stoploss_type').removeAttr('disabled');    
        $('#' + id + ' #stoploss_value').removeAttr('disabled');    

        $('#' + id + ' #takeprofit_type').removeAttr('disabled');    
        $('#' + id + ' #takeprofit_value').removeAttr('disabled');    

    }

    let tradeorder = symbol.Order.getorder (operation);        
    

  //  tradeorder.tradeentry_type = TRADE_ENTRY_MENU.filter(str => str.text == $('#' + id + ' #tradeentry_type').val())[0].id;   
    $('#' + id + ' #tradeentry_type option[value="' + TRADE_ENTRY_MENU.filter(menu => menu.id == tradeorder.tradeentry_type)[0].text + '"]').prop('selected', true); 
    if (tradeorder.tradeentry_type == ENTRY_SPOT) {
        $('#' + id + ' #tradeentry_value').attr('disabled',  true);    
    } else {
        $('#' + id + ' #tradeentry_value').removeAttr('disabled');
    }
    $('#' + id + ' #tradeentry_value').val(tradeorder.tradeentry_value[tradeorder.tradeentry_type].value);   
    $('#' + id + ' #tradeentry_value').attr('min', tradeorder.tradeentry_value[tradeorder.tradeentry_type].fields.min);
    $('#' + id + ' #tradeentry_value').attr('step',tradeorder.tradeentry_value[tradeorder.tradeentry_type].fields.step);
    $('#' + id + ' #tradeentry_value').attr('max', tradeorder.tradeentry_value[tradeorder.tradeentry_type].fields.max);




    $('#' + id + ' #tradesize_type option[value="' + TRADE_VOLUME_MENU.filter(menu => menu.id == tradeorder.tradesize_type)[0].text + '"]').prop('selected', true); 
   
    if (tradeorder.tradesize_type != VOLUME_RISK) {
        $('#' + id + ' #tradesize_value_a').css('visibility', 'hidden');
    } else {
        $('#' + id + ' #tradesize_value_a').css('visibility', '');
    }
    $('#' + id + ' #tradesize_value').attr('min', tradeorder.tradesize_value[tradeorder.tradesize_type].fields.min);
    $('#' + id + ' #tradesize_value').attr('step',tradeorder.tradesize_value[tradeorder.tradesize_type].fields.step);
    $('#' + id + ' #tradesize_value').attr('max', tradeorder.tradesize_value[tradeorder.tradesize_type].fields.max);
    $('#' + id + ' #tradesize_value').val(tradeorder.tradesize_value[tradeorder.tradesize_type].value);




    $('#' + id + ' #stoploss_type option[value="' + TRADE_SLTP_MENU.filter(menu => menu.id == tradeorder.stoploss_type)[0].text + '"]').prop('selected', true); 
    
    if (tradeorder.stoploss_type != SLTP_ATR) {
        $('#' + id + ' #stoploss_value_a').css('visibility', 'hidden');
    } else {
        $('#' + id + ' #stoploss_value_a').css('visibility', '');
    }

    $('#' + id + ' #stoploss_value').attr('min', tradeorder.stoploss_value[tradeorder.stoploss_type].fields.min);
    $('#' + id + ' #stoploss_value').attr('step',tradeorder.stoploss_value[tradeorder.stoploss_type].fields.step);
    $('#' + id + ' #stoploss_value').attr('max', tradeorder.stoploss_value[tradeorder.stoploss_type].fields.max);
    $('#' + id + ' #stoploss_value').val(tradeorder.stoploss_value[tradeorder.stoploss_type].value);   
  

    $('#' + id + ' #takeprofit_type option[value="' + TRADE_SLTP_MENU.filter(menu => menu.id == tradeorder.takeprofit_type)[0].text + '"]').prop('selected', true); 

    if (tradeorder.takeprofit_type != SLTP_ATR) {
        $('#' + id + ' #takeprofit_value_a').css('visibility', 'hidden');
    } else {
        $('#' + id + ' #takeprofit_value_a').css('visibility', '');
    }    
    $('#' + id + ' #takeprofit_value').attr('min', tradeorder.takeprofit_value[tradeorder.takeprofit_type].fields.min);
    $('#' + id + ' #takeprofit_value').attr('step',tradeorder.takeprofit_value[tradeorder.takeprofit_type].fields.step);
    $('#' + id + ' #takeprofit_value').attr('max', tradeorder.takeprofit_value[tradeorder.takeprofit_type].fields.max);
    $('#' + id + ' #takeprofit_value').val(tradeorder.takeprofit_value[tradeorder.takeprofit_type].value);   
    
    ontick_orderpanel(symbol)     
}

function SetOrderType(entryvalue, tradeorder) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;


    switch (tradeorder) {
        case OP_BUYSTOP:
        case OP_BUYLIMIT:
            symbol.Order.operation = OP_BUY;
            let tradeorderbuy  = symbol.Order.getorder(OP_BUY);   
            tradeorderbuy.tradeentry_type = ENTRY_PRECISE;    
            tradeorderbuy.tradeentry_value[tradeorderbuy.tradeentry_type].value = entryvalue;    
        break;
        case OP_SELLSTOP:
        case OP_SELLLIMIT:
            symbol.Order.operation = OP_SELL;
            let tradeordersell = symbol.Order.getorder(OP_SELL);        
            tradeordersell.tradeentry_type = ENTRY_PRECISE; 
            tradeordersell.tradeentry_value[tradeordersell.tradeentry_type].value = entryvalue;                
        break;
    }
    update_orderpanel(symbol)
    OrderPanel_Show(true);    
} 

function onclick_tradesubmit (elt) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    

    let symbol = symbolcanvas.CurrentSymbol;

    let id= 'orderpanel';
    let operation =  symbol.Order.operation;

    if (operation == null) {
        console.log ('no operation selected')
        return;
    }

    let tradeorder = symbol.Order.getorder (operation);
    
    let entrytype  = tradeorder.tradeentry_type;    
    let price      = tradeorder.get_tradeentry_value();
    let size       = tradeorder.get_tradesize_value();
    let stoploss   = tradeorder.get_stoploss_value();
    let takeprofit = tradeorder.get_takeprofit_value();
    
    entrytype == ENTRY_SPOT ?  symbol.TradeOrder = operation 
                            :  operation == OP_BUY  ?  (price > +symbol.Ask ?  symbol.TradeOrder = OP_BUYSTOP :    price < +symbol.Ask ?  symbol.TradeOrder = OP_BUYLIMIT : symbol.TradeOrder = OP_BUY) 
                                                    :  (price > +symbol.Bid ?  symbol.TradeOrder = OP_SELLLIMIT :  price < +symbol.Bid ?  symbol.TradeOrder = OP_SELLSTOP : symbol.TradeOrder = OP_SELL);

    operation == OP_BUY  ? symbol.BuyEntry = price      : symbol.SellEntry = price;
    operation == OP_BUY  ? symbol.BuyVolume  = size     : symbol.SellVolume = size;
    operation == OP_BUY  ? symbol.BuySL  = stoploss     : symbol.SellSL = stoploss;
    operation == OP_BUY  ? symbol.BuyTP  = takeprofit   : symbol.SellTP = takeprofit;

    if (OnOrder(solution.CurrentTerminal, symbol) == null) {
        return;
    }
    $('#' + id + ' #buy').removeClass ('checked');
    $('#' + id + ' #sell').removeClass ('checked');
    $('#' + id + ' #tradesubmit').attr('disabled',  true);
    $('#' + id + ' #tradecancel').attr('disabled',  true);    
        
    bottompanel_select (tradedeskplatform,'tab_orders')    
}

function onclick_tradecancel(elt, event) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    

    let symbol = symbolcanvas.CurrentSymbol;

    symbol.Order.operation = null;
  //  symbol.Order.reset (OP_BUY);
  //  symbol.Order.reset (OP_SELL);

    update_orderpanel (symbol);

   
    Chart_Draw(solution.CurrentTerminal)    
 } 


function onclick_order (elt, type) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let operation = elt.id == 'buy' ? OP_BUY : OP_SELL;

    let symbol = symbolcanvas.CurrentSymbol;
    symbol.Order.operation = operation;
    let id= 'orderpanel';

    update_orderpanel (symbol);

    
    Chart_Draw(solution.CurrentTerminal)    
}


function onchange_tradeentry_type(elt, event) {
   let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    } 
    let tradeorder = symbol.Order.getorder (operation);
    let entrytype = TRADE_ENTRY_MENU.filter(str => str.text == elt.value)[0].id;  
    
    tradeorder.tradeentry_type = entrytype;

    let id= 'orderpanel';
    if (entrytype == ENTRY_SPOT) {
        $('#' + id + ' #tradeentry_value').attr('disabled',  true);    
    } else {
        $('#' + id + ' #tradeentry_value').removeAttr('disabled');
    }
    $('#' + id + ' #tradeentry_value').val(tradeorder.tradeentry_value[tradeorder.tradeentry_type].value);

    Chart_Draw(solution.CurrentTerminal)        
}

function onchange_tradeentry_value(elt, event) {

    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }

    let tradeorder = symbol.Order.getorder (operation);
    tradeorder.tradeentry_value[tradeorder.tradeentry_type].value = elt.value;  
    
    Chart_Draw(solution.CurrentTerminal)   
}

function onchange_tradesize_type(elt, eventt) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }
    let tradeorder = symbol.Order.getorder (operation);
    let tradesizetype = TRADE_VOLUME_MENU.filter(str => str.text == elt.value)[0].id;

    tradeorder.tradesize_type = tradesizetype;

    let id= 'orderpanel';
    $('#' + id + ' #tradesize_value').val(tradeorder.tradesize_value[tradeorder.tradesize_type].value);

    if (tradesizetype != VOLUME_RISK) {
        $('#' + id + ' #tradesize_value_a').css('visibility', 'hidden');

    } else {
        $('#' + id + ' #tradesize_value_a').css('visibility', '');
        let value = symbol.CalculateLotValue(solution.CurrentTerminal.User.AccountEquity, tradeorder.tradesize_value[tradeorder.tradesize_type].value);  
        tradeorder.tradesize_value[tradeorder.tradesize_type].value_a = value;                     
        $('#' + id + ' #tradesize_value_a').val(value);
    }


    Chart_Draw(solution.CurrentTerminal)   
}

function onchange_tradesize_value (elt, event) {   //'VOL'

    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }

    let tradeorder = symbol.Order.getorder (operation);
    tradeorder.tradesize_value[tradeorder.tradesize_type].value = elt.value;    
    
    let id= 'orderpanel';
    
    if (tradeorder.tradesize_type == VOLUME_RISK) {
        let value = symbol.CalculateLotValue(solution.CurrentTerminal.User.AccountEquity, tradeorder.tradesize_value[tradeorder.tradesize_type].value); 
        tradeorder.tradesize_value[tradeorder.tradesize_type].value_a = value;          
        $('#' + id + ' #tradesize_value_a').val(value);
    }
}

function onchange_stoploss_type (elt, event) {   //'VOL'
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }
    let tradeorder = symbol.Order.getorder (operation);
    let stoplosstype = TRADE_SLTP_MENU.filter(str => str.text == elt.value)[0].id;   

    tradeorder.stoploss_type = stoplosstype;   

    let id= 'orderpanel';
    $('#' + id + ' #stoploss_value').val(tradeorder.stoploss_value[tradeorder.stoploss_type].value);   


    if (stoplosstype != SLTP_ATR) {
        $('#' + id + ' #stoploss_value_a').css('visibility', 'hidden');
    } else {
        $('#' + id + ' #stoploss_value_a').css('visibility', '');
        let value = (symbol.ATR[symbolcanvas.CurrentPeriod] * +tradeorder.stoploss_value[tradeorder.stoploss_type].value / symbol.SysPoint).toFixed(0);
        tradeorder.stoploss_value[tradeorder.stoploss_type].value_a = value;        
        $('#' + id + ' #stoploss_value_a').val(value);
    }


    Chart_Draw(solution.CurrentTerminal)       
}

function onchange_stoploss_value (elt, event) {   //'VOL'

    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }

    let tradeorder = symbol.Order.getorder (operation);
    tradeorder.stoploss_value[tradeorder.stoploss_type].value = elt.value;       
    
    let id= 'orderpanel';

    if (tradeorder.stoploss_type == SLTP_ATR) {
        let value = (symbol.ATR[symbolcanvas.CurrentPeriod] * +tradeorder.stoploss_value[tradeorder.stoploss_type].value / symbol.SysPoint).toFixed(0);
        tradeorder.stoploss_value[tradeorder.stoploss_type].value_a = value;
        $('#' + id + ' #stoploss_value_a').val(value);    
    }
    
    Chart_Draw(solution.CurrentTerminal)   
}

function onchange_takeprofit_type (elt, event) {   //'VOL'
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    

    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }

    let tradeorder = symbol.Order.getorder (operation);
    let takeprofittype = TRADE_SLTP_MENU.filter(str => str.text == elt.value)[0].id;   

    tradeorder.takeprofit_type = takeprofittype;  

    let id= 'orderpanel';
   
    $('#' + id + ' #takeprofit_value').val(tradeorder.takeprofit_value[tradeorder.takeprofit_type].value);   

    if (takeprofittype != SLTP_ATR) {
        $('#' + id + ' #takeprofit_value_a').css('visibility', 'hidden');

    } else {
        $('#' + id + ' #takeprofit_value_a').css('visibility', '');
        let value = (symbol.ATR[symbolcanvas.CurrentPeriod] * +tradeorder.takeprofit_value[tradeorder.takeprofit_type].value / symbol.SysPoint).toFixed(0);
        tradeorder.takeprofit_value[tradeorder.takeprofit_type].value_a =  value;           
        $('#' + id + ' #takeprofit_value_a').val(value);        
    }

    Chart_Draw(solution.CurrentTerminal)   
}

function onchange_takeprofit_value (elt, event) {   //'VOL'
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    let symbol = symbolcanvas.CurrentSymbol;
    let operation = symbol.Order.operation;
    if (operation == null) {
        return;
    }

    let tradeorder = symbol.Order.getorder (operation);
    tradeorder.takeprofit_value[tradeorder.takeprofit_type].value = elt.value;     

    let id= 'orderpanel';

    if (tradeorder.takeprofit_type == SLTP_ATR) {
        let value = (symbol.ATR[symbolcanvas.CurrentPeriod] * +tradeorder.takeprofit_value[tradeorder.takeprofit_type].value / symbol.SysPoint).toFixed(0);
        tradeorder.takeprofit_value[tradeorder.takeprofit_type].value_a =  value;       
        $('#' + id + ' #takeprofit_value_a').val(value);    
    }
    
    Chart_Draw(solution.CurrentTerminal)   
}




//------------------------------------------------------------ TERMINAL INFO PANEL ----------------------------------------------------------

function TerminalInfoPanel_Update (terminal) {
    if (!terminal) return "";   

    $('#terminalname').val(terminal.Name);
    $('#terminalcompany').val(terminal.Company);
    $('#terminaldatapath').val(terminal.Folder);
    $('#terminalpath').val(terminal.Path);
    $('#terminaltimeshift').val((terminal.TimeShift < 0 ? '+' : '-') + (-terminal.TimeShift) + ' hours');
    $('#terminalbuild').val(terminal.Build);
    $('#terminalrunning').val(terminal.Running  ? 'Yes' : 'No');
    $('#terminalserver').val(terminal.Server);
    $('#tradedeskprojectname').val(terminal.PG.ProjectName);
}

//------------------------------------------------------------ ACCOUNT PANEL ----------------------------------------------------------

function AccountPanels_Update(terminal) {
    SAccountPanel_Update (terminal);
    AccountPanel_Update (terminal);
}

function AccountPanels_Reset () {
    $('.sb_formcontainer input').val ('');
}


function onclick_closepositions(elt) {
    LaunchSessionConfirm ('exitall', "This will Close All Positions. Strategies will be stopped and manual orders will be closed");
}

function SAccountPanel_Update (terminal) {
    if (!terminal) return "";
       
    setField('menuequity',      terminal.User.AccountEquity, true);
    setField('menubalance',     terminal.User.AccountBalance, true);
    setField('menutotalprofit', terminal.User.AccountTotalProfit, true);
}    

function AccountPanel_Update (terminal) {
    if (!terminal) return;

    var user = terminal.User;
    var date = new Date(user.AccountStartDate);
    var elapsed = ReturnElapsedTime(user.AccountActualDate - user.AccountStartDate, true);


    if ($('.sb_formcontainer').length == 0)
    return;


    setField('accountname', user.AccountName, false);
    setField('accountstartdate', date.format('DD-MM-YYYY'), false);
    setField('accountnumber', user.AccountNumber, false);
    setField('freemargin', user.AccountFreeMargin, false);
    setField('margin', user.AccountMargin, false);
    setField('leverage', user.AccountLeverage, false);
    setField('nbrlots', user.AccountNbrLots, false);
    setField('equity', user.AccountEquity, true);
    setField('balance', user.AccountBalance, true);
    setField('totalprofit', user.AccountTotalProfit, true);
    setField('currency', user.Currency, true);
    setfield('accountelapsed', elapsed, false);
}

//------------------------------------------------------------ AUTOMATION PANEL ----------------------------------------------------------


function LaunchAllManualAutoConfirm (engineindex, text, type) {
   
    var PG = solution.CurrentTerminal.PG;

    sb.confirm_modal(text).yes(function () {    
        for (var i = 0; i < PG.Symbols.length; i++) {
            if (!OnStartEngine(solution.CurrentTerminal, engineindex, PG.Symbols[i].Name, type))
                break;
        }
        $("#confirmmodal").modal('hide');
    }).no(function () {})
}

function LaunchStrategyConfirm(engineindex, text, symbolName, type) {

    sb.confirm_modal(text).yes(function () {
        if (type == 'exit') {
            OnExitSession(solution.CurrentTerminal, engineindex, symbolName, type);            
            return;
        }
        OnStartEngine(solution.CurrentTerminal, engineindex, symbolName, type);
    }).no(function () {})
}

function LaunchManualAutoConfirm(engineindex, label, text, symbol, type) {
    
    sb.confirm_modal(text).yes(function () {
        $(label).html('Wait...');

        if (!OnStartEngine(solution.CurrentTerminal, engineindex, symbol.Name, type)) {
            $(label).html((type== 'manual' ? Automation_Label_Automatic : Automation_Label_Manual));
        }
        $("#confirmmodal").modal('hide');
    }).no(function () {})
}

function ondblclick_automationrow(elt, event) {
    var terminal = solution.CurrentTerminal;
    if (!terminal) return;    

    sidebarmenu_select ('sidebar_enginelook', true);

    var PG = terminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var enginename  = sb.table_getcellcontent (automationtable, rowindex, 'Strategy');
    var operation   = sb.table_getcellcontent (automationtable, rowindex, 'Operation');    


    var engine = PG.GetEngineFromNameOperation(enginename, operation);
    
    SelectEngine(engine);
       
}

function onclick_enginecontrol(elt, event) {
    if (event.button == 2) return;
    var eltid, label;
    var elttype = $(elt).attr('type');
    if (elttype == 'checkbox') {
        eltid = $(elt).children()[0].id;
        label   = $(elt).children()[1];
    }else {
        eltid = elt.id;
        label   = $(elt).children()[0];
    }

    if (label.innerHTML == '----') {
        return;
    }

    var checked = $('#' + eltid).hasClass("checked");
       
    var items = eltid.split('_');
    
    var engineindex = items[1];
    var symbolindex = items[2];

    var engine = solution.CurrentTerminal.PG.Engines[engineindex];
    var symbol = solution.CurrentTerminal.PG.Symbols[symbolindex];

    if (checked) {   //go to manual
        LaunchManualAutoConfirm(engineindex, label, "Strategy " + engine.Name + " on Symbol " + symbol.Name + " will be in mode Manual ?", symbol, 'manual');    
    } else {         // go automatic       
        LaunchManualAutoConfirm(engineindex, label, "Strategy " + engine.Name + " on Symbol " + symbol.Name + " will be in mode Automatic ?", symbol, 'automatic');    

    }
}



function oncontextmenu_automationrow(elt, event) {

    event.preventDefault();    
    event.stopPropagation();

    if (!solution.CurrentTerminal) return;
    var PG = solution.CurrentTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];   

    var menu = [];

    var engineindex = rowindex;


    menu.push({id: 1, text: "All Automatic", tooltip: 'Automatic Start for this Strategy on All Currencies'});
    menu.push({id: 2, text: "All Manual",    tooltip: 'Automatic Start for this Strategy on All Currencies'});

   sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),        
        event: event,             
        pageX: event.pageX,
        pageY: event.pageY,
        par: engineindex,
        onselect: function (elt, par) {
           
            var text = $(elt).find('.sb_label').html();
            var engineindex = par;
            var engine = solution.CurrentTerminal.PG.Engines[engineindex];

            if (text == "All Automatic") {
                LaunchAllManualAutoConfirm(engineindex,  "Strategy " + engine.Name + " will be in mode Automatic for all Symbols",  'automatic');    
            } else
            if (text == "All Manual") {
                LaunchAllManualAutoConfirm(engineindex,  "Strategy " + engine.Name + " will be in mode Manual for all Symbols",  'manual');    
            }
        },
        html: sb.menu (menu)
    });      
}

function onclick_automationrow(elt, event) {
    var terminal = solution.CurrentTerminal;
    if (!terminal) return;

    var PG = terminal.PG;


    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var strategyname  = sb.table_getcellcontent (automationtable, rowindex, 'Strategy');

    var strategy = PG.GetStrategyFromName(strategyname);
    if (!strategy) return;                    
       
}

function automation_setcolor () {
    $('#enginecontrol' + engineindex + ' .custom-switch').css ('background-color',  EngineTextColorTab[j][index]);
}

function automation_check (engineindex, symbolindex, checkmode) {
    var index = '_' + engineindex + '_' + symbolindex;    
    sb.item_set ($('#enginecontrol' + index), checkmode);
    $('#enginecontrol' + index + ' .form-check-label').html(checkmode ? Automation_Label_Automatic : Automation_Label_Manual);  
    EngineValueTab[engineindex][symbolindex] = (checkmode ? 'auto' : 'manual');      
}


function switchcontent (rowindex, colindex) {
    var index = '_' + rowindex + '_' + colindex;
    var content =
'   <button id="enginecontrol' + index + '" class="sb_sbutton enginecontrol_button" type="button" onclick="onclick_enginecontrol(this, event)">' + 
'       <label class="sb_label form-check-label">----</label>' +
'   </button>';    
    return content;
}


function automation_addcolumn (table, colname, coltitle, colstyle) {
   table.columns.push (colname);
   table.columnstitle.push (coltitle);
}

function automation_addrow (table, rownumber, enginename, operation, rule) {

    var colname = table.columns;
    var i = 0;

    var rowtoadd = [enginename, operation];
    
    table.rows.push (rowtoadd);
    return rowtoadd;    
}
    
function automation_setrows (engines, table) {
    table.rows = []; 

    for (var j = 0; j < engines.length; j++) { // engines
        var engine = engines[j];
        automation_addrow (table, i, engine.Name, engine.Operation, engine.StartRule);
    }        
}
  
function AutomationPanel_Update (engines, table) {
    automation_setrows (engines, table);
    $('#automationpanel').html(sb.table (table));
}

//------------------------------------------------------------ SETTINGS PANEL ----------------------------------------------------------

function openPopupPanelSettings(terminal) {
    
    if (!terminal) return;

    sb.modal ({
        id: 'popuppanelsettings', 
        header: 'MT4 Platform Display', 
        width: 600,
        height: 480,
        resizable: true,
        static: true,
        onopen : function () {TradedeskSettingsPanel_Update(terminal.Name, terminal.Type)},      
        body: TradedeskSettingsPanel('tradedesksettingspanel'), 
        footer: 
        '<button class="sb_mbutton"   data-bs-dismiss="modal">Cancel</button>' +
        '<button class="sb_mbutton"   onclick="SavePanelCSV (\'' + terminal.Name + '\',\'' + terminal.Type + '\');">Apply</button>' 
    });    
}

function SavePanelCSV(terminalname, terminaltype) {
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');     
        $("#popuppanelsettings").modal('hide');              
        return;
    }


    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;

    var content = "";

    ($('#mainpanelcheck').is(":checked")) ? content += "true,": content += "false,";
    ($('#commentscheck').is(":checked")) ? content += "true,": content += "false,";
    content += "false,";
    ($('#marketscheck').is(":checked")) ? content += "true": content += "false";
    
    content += "\n";
    
    ($('#operationscheck').is(":checked")) ? content += "true,": content += "false,";
    ($('#alertscheck').is(":checked")) ? content += "true,": content += "false,";
    ($('#newscheck').is(":checked")) ? content += "true": content += "false";
   
   
   
    content += "\n";
    //Signal colors
    for (i = 0; i < NBR_SIGNALS; i++) {
        var color   = $('#tradedesksettingssignalstable_' + i + '_1 input').val();
        var display = $('#tradedesksettingssignalstable_' + i + '_2 input').is(":checked") ? "1" : "0";
        var sound   = $('#tradedesksettingssignalstable_' + i + '_3 input').val();
        content += i + "," + color + "," + display + "," + sound + "\n";
    }

    for (j = 0; j < TradedeskSettingsIndicatorsTable.rows.length; j++) {
        var Period = 0;
        content += i + ",";                 
        for (i = 0; i < NBR_PERIODS; i++) {
              if ($('#tradedesksettingsindicatortable_' + j + '_' + (i + 1) + ' input').is(":checked")) Period |= (1 << i);
        }
        content += Period + "\n";
    }

    var totablerows = $('#tradedesksettingsdisplaytotable tbody tr');

    for (i = 0; i < totablerows.length; i++) {
    
        var Indicator = $(totablerows[i].children[0]).html();
        var pname     = $(totablerows[i].children[1]).val();

        if (pname == undefined) pname = "";
        if (Indicator == "") {
            content += PANEL_FEED + "\n";
        } else
        if (Indicator == "M1 M5 M30 H1 H4 D1 W1 MN") {
            content += PANEL_PERIODS + "\n";
        } else
        if (Indicator == "__________________") {
            content += PANEL_SEPARATOR + "\n";
        } else {
            content += "0,";
            content += Indicator + ",";
            content += pname + "\n";
        }
    }
    content += PANEL_END + "\n";

    // Dependencies
    for (i = 0; i < PG.Objects.length; i++) {
        if (PG.Objects[i].Type != 'SYSTEM') continue;
        for (j = 0; j < PG.Objects[i].Dependencies.length; j++) {
            content += PG.Objects[i].Name + ",";
            content += PG.Objects[i].Dependencies[j] + "\n";
        }
    }
    ResultPanelCSV(terminal, content);
    SubmitTerminalRequest(terminal.Folder, terminaltype, content, '/php/save_panel.php', ASYNCHRONE);
    ReloadPanel(terminalname, terminaltype);

    Chart_Draw(terminal)   
    
  //.sb_widget.active  $("#popuppanelsettings").modal('hide');    
    return content;
}


function ResultPanelCSV(terminal, data) {
    var PG = terminal.PG;
    PG.GraphicMainPanel = 0;
    PG.GlobalComment = 0;
    PG.MarketOpening = 0;
    PG.OperationSound = 0;
    PG.AlertsSound = 0;
    PG.NewsSound = 0;
    PG.Panel_Signals = [];
    PG.Panel_Objects = [];
    PG.Panel_Graphic = [];
    var lines = data.split(/\r\n|\n/);
    var values = lines[0].split(',');
    
    
    PG.GraphicMainPanel = (values[0] == "false") ? 0 : 1;
    PG.GlobalComment = (values[1] == "false") ? 0 : 1;
    PG.MarketOpening = (values[3] == "false") ? 0 : 1;
    values = lines[1].split(',');
    PG.OperationSound = (values[0] == "false") ? 0 : 1;
    PG.AlertsSound = (values[1] == "false") ? 0 : 1;
    PG.NewsSound = (values[2] == "false") ? 0 : 1;
    
    
    var k = 0; //lines
    var j = 0; //panel graphic
    var h = 0; //panel objects
    var nextind = 0;
    var lastind = -1;
    var NotPanelEnd = true;


    for (i = 2; i < lines.length; i++) {
        values = lines[i].split(',');
        if (k < NBR_SIGNALS) {
            var color = values[1];
            var signal = new pgsignal(+values[0], color, +values[2], values[3]);
            PG.Panel_Signals.push(signal);
        } else
        if (k < NBR_SIGNALS + 9) {
            PG.Panel_Graphic[j] = +values[1];
            j++;
        } else {
            if (!NotPanelEnd) {
                var sysobject = PG.GetObjectFromName(values[0]);
                if (!sysobject || sysobject.Type != 'SYSTEM') continue;
                sysobject.Dependencies.push(values[1]);
            } else {
                var lineprop = [];
                for (var h = 0; h < 3; h++) {
                    lineprop.push(values[h]);
                }
                PG.Panel_Objects.push(lineprop);
                if (+values[0] == PANEL_END) NotPanelEnd = false;
                h++;
            }
        }
        k++;
    }
    if (terminal == solution.CurrentTerminal) 
        UpdatePanel(terminal);
}

function ReloadPanel(terminalname, terminaltype) {
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;
    var sorder = "*RELOADPANELFILE ";
    for (var i = 0; i < PG.Symbols.length; i++) terminal.Com.Send(solution.UserId + '*' + PG.Symbols[i].Name + sorder);
}


var drop_tradedesksettingsdisplayfromtable_options = {
    drop: function(event, ui) {
        $(ui.draggable).draggable(drag_tradedesksettingsdisplayfromtable_options);         
    },
    over: function(event, ui) {
    }
}

var drop_tradedesksettingsdisplaytotable_options = {
    drop: function(event, ui) {
        var fromdraggable = ui.draggable[0].children[0];
        if (fromdraggable.innerText != '__________________' && fromdraggable.innerText != 'M1 M5 M30 H1 H4 D1 W1 MN') {
            var fromdraggableid = fromdraggable.id;
            var rows = fromdraggableid.split ('_');
            var rowindex = parseInt(rows[1]);
            $('#tradedesksettingsdisplayfromtable' +  ' #' + fromdraggableid).parent().remove();
        }
    },
    over: function(event, ui) {
    }
}

var drag_tradedesksettingsdisplayfromtable_options = {
    connectToSortable : "#tradedesksettingsdisplaytotable tbody",
    helper: 'clone' ,
    items: 'td', 
    start: function(event, ui ) {
    },
    stop: function(event, ui) {
    }        
}

var sort_tradedesksettingsdisplaytotable_options = {
    connectWith: "#tradedesksettingsdisplayfromtable tbody",    
    create : function (event, ui) {

    },
    start: function( event, ui ) {
    },
    stop: function(event, ui) {
    }      
}


function TradedeskSettingsPanel_Update(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) return;

    var PG = terminal.PG;

    TradedeskSettingIndicatorsPanel_Update (terminalname, terminaltype);
    TradedeskSettingsDisplayPanel_Update (terminalname, terminaltype);
    TradedeskSettingsSignalsPanel_Update (terminalname, terminaltype);

    $("#tradedesksettingsdisplayfromtable tbody tr").draggable(drag_tradedesksettingsdisplayfromtable_options); 
    $("#tradedesksettingsdisplayfromtable tbody").sortable();
    $("#tradedesksettingsdisplayfromtable tbody").droppable(drop_tradedesksettingsdisplayfromtable_options); 
    $("#tradedesksettingsdisplaytotable tbody").sortable(sort_tradedesksettingsdisplaytotable_options);      
    $("#tradedesksettingsdisplaytotable tbody").droppable(drop_tradedesksettingsdisplaytotable_options);    
}



function TradedeskSettingsSoundPanel_Update(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) return;

    var PG = terminal.PG;

    $('#operationscheck').prop('checked', PG.OperationSound);
    $('#alertscheck').prop('checked', PG.AlertsSound);
    $('#newscheck').prop('checked', PG.NewsSound);
}



function TradedeskSettingsVisibilityPanel_Update(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) return;

    var PG = terminal.PG;

    $('#mainpanelcheck').prop('checked', PG.GraphicMainPanel);
    $('#commentscheck').prop('checked', PG.GlobalComment);
    $('#marketscheck').prop('checked', PG.MarketOpening);
    
}


function TradedeskSettingsMT4Panel_Update(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) return;
   
    TradedeskSettingsVisibilityPanel_Update (terminalname, terminaltype);
    TradedeskSettingsSoundPanel_Update (terminalname, terminaltype);
}



function TradedeskSettingIndicatorsPanel_Update(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) return;
   
    var PG = terminal.PG;

    for (var j = 0; j < PG.Panel_Graphic.length; j++) {
        for (var z = 1; z <= NBR_PERIODS; z++) {
            if (PG.Panel_Graphic[j] & (1 << (z - 1))) {
                $('#' + TradedeskSettingsIndicatorsTable.id + '_' + j + '_' + TradedeskSettingsIndicatorsTable.columns[z]).prop('checked', true);
            }
            else {
                $('#' + TradedeskSettingsIndicatorsTable.id + '_' + j + '_' + TradedeskSettingsIndicatorsTable.columns[z]).prop('checked', false);
            }
        }
    }    
    TradedeskSettingsMT4Panel_Update (terminalname, terminaltype);   
}

function TradedeskSettingsDisplayPanel_Update(terminalname, terminaltyoe) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltyoe);
    if (!terminal) return;
   
    var PG = terminal.PG;

    var name_array = [];
 
    for (i = 0; i < PG.Objects.length; i++) {
        name_array.push(PG.Objects[i].Name);
    }

    var h = 0;
    var NotPanelEnd = true;

    var togridtab = [];
    for (var i = 0; i < PG.Panel_Objects.length; i++) {
        var values = PG.Panel_Objects[i];
        if (+values[0] == PANEL_END) {
            NotPanelEnd = false;
            break;
        } else
        if (+values[0] == PANEL_FEED) {
            togridtab.push([' ', ' ']);
        } else
        if (+values[0] == PANEL_PERIODS) {
            togridtab.push(['M1 M5 M30 H1 H4 D1 W1 MN', ' ']);
        } else
        if (+values[0] == PANEL_SEPARATOR) {
            var v = '______';
            togridtab.push(['__________________',  ' ']);
        } else
        if (+values[0] == 0) {
            togridtab.push([values[1], values[2]]);
            index = name_array.indexOf(values[1]);
            if (index > -1) name_array.splice(index, 1);
        } 
        h++;
    }

    name_array.push('__________________');
    name_array.push('M1 M5 M30 H1 H4 D1 W1 MN');

    var tab = [];   
    for (var i = 0; i < name_array.length; i++) {
        tab.push([name_array[i]]);
        h++;
    }

    sb.table_setrows(TradedeskSettingsDisplayFromTable,tab);
    sb.table_setrows(TradedeskSettingsDisplayToTable,togridtab);    

}




function TradedeskSettingsSignalsPanel_Update(terminalname, terminaltyoe) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltyoe);
    if (!terminal) return;
   
    var PG = terminal.PG;


    var tab = [];    
    if (PG.Panel_Signals.length != 0) {
        for (var i = 0; i < PG.Panel_Signals.length; i++) {
            var signal = PG.Panel_Signals[i];
            tab.push([signal.Name,
                     '<input type="color"  value="' +  signal.Color.substring(0, 7) + '" class="form-control form-color">', 
                     sb.checkbox(TradedeskSettingsSignalsTable.id + '_' + i + '_' + TradedeskSettingsSignalsTable.columns[3], (signal.Visible == 1) ? true : false) , 
                    '<input  type="text" class="form-control"  value="' + signal.Sound  + '">'
                    ]);
        }
    } else {
        for (var i = 0; i < SignalColor.length; i++) {
            tab.push([SignalName[i], 
                      '<input type="color" value="' +  SignalColor[i].substring(0, 7) + '" class="form-control form-color">',             
                      sb.checkbox(TradedeskSettingsSignalsTable.id + '_' + i + '_' + TradedeskSettingsSignalsTable.columns[3], true) , 
                      '<input  type="text" class="form-control"  value="">'
                    ]);
        }
    }
    sb.table_setrows(TradedeskSettingsSignalsTable,tab);    
}

function TradedeskSettingsSoundPanel(id, classnames) {
    var content = 

    '<div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +  
    '   <label class="sb_widget-title">SOUND</label>' +             
    '   <div class="sb_check custom-control custom-checkbox form-check-inline" title="Operations Sound on the device Running MT4 Terminal">' +
    '     <input class="custom-control-input" type="checkbox" id="operationscheck" name="operationscheck">' +
    '     <label class="custom-control-label" for="operationscheck">Operation Sound</label>' +
    '   </div>' +
    '   <div class="sb_check custom-control custom-checkbox form-check-inline" title="Alerts Sound on the device         MT4 Terminal">' +
    '     <input class="custom-control-input" type="checkbox" id="alertscheck" name="alertscheck">' +
    '     <label class="custom-control-label" for="alertscheck">Alerts Sound</label>' +
    '   </div>' +
    '   <div class="sb_check custom-control custom-checkbox form-check-inline" title="News Sound on the device Running MT4 Terminal">' +
    '     <input class="custom-control-input" type="checkbox" id="newscheck" name="newscheck">' +
    '     <label class="custom-control-label" for="newscheck">News Sound</label>' +
    '   </div>' +
    '</div>';

    return content;
}
function TradedeskSettingsVisibilityPanel(id, classnames) {
    var content = 

    '<div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +   
    '   <label class="sb_widget-title">MT4 DISPLAY</label>' +                
    '   <div class="sb_check custom-control custom-checkbox form-check-inline"  title="Signals Panel on MT4 Terminal">' +
    '     <input class="custom-control-input" type="checkbox" id="mainpanelcheck" name="mainpanelcheck">' +
    '     <label class="custom-control-label" for="mainpanelcheck">Main Panel</label>' +
    '   </div>' +
    '   <div class="sb_check custom-control custom-checkbox form-check-inline" title="Display Comments on MT4 Terminal, Gives statues of experts running...">' +
    '     <input class="custom-control-input" type="checkbox" id="commentscheck" name="commentscheck">' +
    '     <label class="custom-control-label" for="commentscheck">Comments</label>' +
    '   </div>' +
    '   <div class="sb_check custom-control custom-checkbox form-check-inline" title="Display Opening Markets on MT4 terminal">' +
    '     <input class="custom-control-input" type="checkbox" id="marketscheck" name="marketscheck">' +
    '     <label class="custom-control-label" for="marketscheck">Markets</label>' +
    '   </div>' +
    '</div>';

    return content;
}

function TradedeskSettingsMT4Panel (id, classnames) {
    var content = 
    '<div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +   
        TradedeskSettingsVisibilityPanel('visibilitypanel') +       
        TradedeskSettingsSoundPanel('soundspanel') +    
'   </div>';
    return content;
}

function TradedeskSettingIndicatorsPanel(id, classnames) {
    for (var i= 0; i < TradedeskSettingsIndicatorsTable.rows.length; i++) {
        for (var j = 1; j <= 9; j++) {
            TradedeskSettingsIndicatorsTable.rows[i][j] = sb.checkbox(TradedeskSettingsIndicatorsTable.id + '_' + i + '_' + TradedeskSettingsIndicatorsTable.columns[j], false)
        }
    }        
    var content =     
            sb.table(TradedeskSettingsIndicatorsTable) +
            TradedeskSettingsMT4Panel('mt4panel', 'sb_row');          

    return content;
}

function TradedeskSettingsDisplayPanel(id, classnames) {
    var content =     
    '       <div class="sb_column sb_main sb_right">' +      
            sb.table(TradedeskSettingsDisplayFromTable) +
    '       </div>' +                   
    '       <div class="sb_column sb_main" >' +        
                sb.table(TradedeskSettingsDisplayToTable) +                
    '   </div>';    
    return content;
}

function TradedeskSettingsSignalsPanel(id, classnames) {

    var content =     
            sb.table(TradedeskSettingsSignalsTable);
    return content;
}


function TradedeskSettingsPanel (id, classnames) {
    var content = 
'   <div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +
        sb.tabs (tradedesksettingstabs) +
'   </div>';

    return content;
}


function PercentChangePanel_Update (terminal, symbol, fromperiod) {
    var rowid = terminal.PG.GetSymbolIndexFromName(symbol.Name);
    for (var period = fromperiod; period < PeriodName.length; period++) {
        var data = symbol.chartData[period];
        if (data.length == 0) continue;
        var last = data[data.length - 1];
       
        sb.table_setcellcontent (percentchangetable, rowid, PeriodName[period], last.change);
        if (last.change >= 0) {
            sb.table_setcellcolor (percentchangetable, rowid, PeriodName[period], theme_bull);
        } else {
            sb.table_setcellcolor (percentchangetable, rowid, PeriodName[period],  theme_bear);
        }
    }
}





function TSysSignalsSelectPanel_Update (PG) {
    var elt1 = document.getElementById('tradedesksyssignalselect'); 
    elt1.innerHTML = ' <option value="' + '--Select Indicator--' + '">' + '--Select Indicator--' + '</option>';  
    for (var i = 0; i < PG.Panel_Objects.length; i++) {
        var values = PG.Panel_Objects[i];
        if (+values[0] == 0) {
            elt1.insertAdjacentHTML('beforeend','<option value="' + values[1] + '">' + values[1] + '</option>');   
        }
    }    
} 



function tsignals_addrow (table, rownumber, indicatorname, m1, m5, m15, m30, h1, h4, d1, w1, mn) {

    var colname = table.columns;
    var i = 0;
    var rowtoadd = [];

    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="indicatorname" onclick="">' + indicatorname + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="m1" onclick="">' + m1 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="m5" onclick="">' + m5 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="m15" onclick="">' + m15 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="m30" onclick="">' + m30 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="h1" onclick="">' + h1 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="h4" onclick="">' + h4 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="d1" onclick="">' + d1 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="w1" onclick="">' + w1 + '</div>');
    rowtoadd.push ('<div id = "' + colname[i++] + '_' + rownumber + '" class="mn" onclick="">' + mn + '</div>');
    
    table.rows.push (rowtoadd);
    return rowtoadd;    
}
 
function TSignalsPanel_Update(PG) {
    SignalNbr = 0;

    var tablerows = [];

    for (var i = 0; i < PG.Panel_Objects.length; i++) {
        var values = PG.Panel_Objects[i];
        if (+values[0] == PANEL_END) {
            NotPanelEnd = false;
            break;
        } else
        if (+values[0] == PANEL_FEED) {
            tablerows.push (['', '', '', '', '', '', '', '', '', '']);
            SignalNbr++;
        } else
        if (+values[0] == PANEL_PERIODS) {
            tablerows.push (['',  'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN']);
            SignalNbr++;
        } else
        if (+values[0] == PANEL_SEPARATOR) {
            var v = '______';
            tablerows.push ([v, v, v, v, v, v, v, v, v,v]);
            SignalNbr++;
        } else
        if (+values[0] == 0) {
            tablerows.push ([values[1], '', '', '', '', '', '', '', '', '']);            
            SignalNbr++;
        }
    }
    sb.table_setrows (tsignalstable, tablerows);    
}

function TSignalsPanel_Refresh(symbol) {
    if (!symbol) return;
    if (!solution.CurrentTerminal) return;

    var PG = solution.CurrentTerminal.PG;

    var index = PG.GetSymbolIndexFromName(symbol.Name);
    if (index < 0) return;

    var tsignalstableid = tsignalstable.id;    
    
    for (var i = 0; i < SignalNbr; i++)
        for (var j = 0; j < sPeriodName.length; j++) {
            if (SignalValueTab[i].length && SignalValueTab[i][index].length) {
                $('#' + tsignalstableid +'_' + i + '_' + (j+1)).html (SignalValueTab[i][index][j]);
                $('#' + tsignalstableid +'_' + i + '_' + (j+1)).css ('color', SignalColorTab[i][index][j]);
            }
        }
}

//------------------------------------------------------TARGET SETTINGS PANEL  --------------------------------------------------------   

function openPopupTarget(terminal) {
    sb.modal ({
        id: 'targetsmodal', 
        header: 'Targets', 
        width: 700,
        static: true,        
        body: TargetSettingsPanel('terminaltargetpanel', 'sb_formcontainer'), 
        footer: 
            '<button class="sb_mbutton"  data-bs-dismiss="modal">Cancel</button>' +
            '<button class="sb_mbutton"  onclick="TargetSettingsPanel_Reset()">Reset</button>' +
            '<button class="sb_mbutton"  onclick="SaveMMCSV (\'' + terminal.Name + '\',\'' + terminal.Type + '\');">Apply</button>', 

        onopen: function () { TargetSettingsPanel_Update(terminal)}
        }
    );    
}


function SaveMMCSV(terminalname, terminaltype) {
    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;
    
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    var Target          = $('#DailyTargetProfit').val();
    var SL              = $('#DailyTargetStopLoss').val();
    var WTarget         = $('#WeeklyTargetProfit').val();
    var WSL             = $('#WeeklyTargetStopLoss').val();
    var PercentTarget   = $('#PercentDailyTargetProfit').val();
    var PercentSL       = $('#PercentDailyTargetStopLoss').val();      
    var PercentWTarget  = $('#PercentWeeklyTargetProfit').val();
    var PercentWSL      = $('#PercentWeeklyTargetStopLoss').val();     
    
    var content         = "-1," + Target + "," + SL + "," + WTarget + "," + WSL + "," + PercentTarget + "," + PercentSL + "," + PercentWTarget + "," + PercentWSL;
    
    SubmitTerminalRequest(terminal.Folder, terminaltype, content, '/php/save_mm.php', ASYNCHRONE);
    OnSaveMM(terminalname, terminaltype);
    $("#targetsmodal").modal('hide');    
}



function TargetSettingsPanel (id, classnames) {
    var content =     

'   <div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +  
'       <div class="sb_formgroup">' + 
'           <label>' + 'Daily Target Amount:' + '</label>' + 
'           <input id ="DailyTargetProfit" class="form-control">' + 
'           <label class="right-inline">' + 'or in Percent (%)' + '</label>' + 
'           <input id ="PercentDailyTargetProfit" class="form-control"  type="number", max="100", min="0" step="1">' +  
'       </div>' +     

'       <div class="sb_formgroup">' + 
'           <label>' + 'Daily SL Amount:' + '</label>' + 
'           <input id ="DailyTargetStopLoss" class="form-control">' +  
'           <label class="right-inline">' + 'or in Percent (%)' + '</label>' + 
'           <input id ="PercentDailyTargetStopLoss" class="form-control"  type="number", max="100", min="0" step="1">' +  
'       </div>' +          

'       <div class="sb_formgroup">' + 
'           <label>' + 'Weekly Target Amount:' + '</label>' + 
'           <input id ="WeeklyTargetProfit" class="form-control">' + 
'           <label class="right-inline">' + 'or in Percent (%)' + '</label>' + 
'           <input id ="PercentWeeklyTargetProfit" class="form-control"  type="number", max="100", min="0" step="1">' +  
'       </div>' +               

'       <div class="sb_formgroup">' + 
'           <label>' + 'Weekly SL Amount:' + '</label>' + 
'           <input id ="WeeklyTargetStopLoss" class="form-control">' +
'           <label class="right-inline">' + 'or in Percent (%)' + '</label>' + 
'           <input id ="PercentWeeklyTargetStopLoss" class="form-control"  type="number", max="100", min="0" step="1">' + 
'       </div>' +   
'       <div class="labelexplain">' +
'           <i>Modify your Daily and Stop Loss Target. When 0 target is not specified. Minimum target is 1</p>' +
'       </div>' +      
'   </div>';
    
    return content;
}

function TargetSettingsPanel_Update (terminal) {
    $('#DailyTargetProfit').val(terminal.DailyTargetProfit);
    $('#PercentDailyTargetProfit').val(terminal.PercentDailyTargetProfit);
    $('#DailyTargetStopLoss').val(terminal.DailyTargetStopLoss);
    $('#PercentDailyTargetStopLoss').val(terminal.PercentDailyTargetStopLoss);       
    $('#WeeklyTargetProfit').val(terminal.WeeklyTargetProfit);
    $('#PercentWeeklyTargetProfit').val(terminal.PercentWeeklyTargetProfit);
    $('#WeeklyTargetStopLoss').val(terminal.WeeklyTargetStopLoss);
    $('#PercentWeeklyTargetStopLoss').val(terminal.PercentWeeklyTargetStopLoss);                  
}

function TargetSettingsPanel_Reset() {
    $('#DailyTargetProfit').val(0);
    $('#DailyTargetStopLoss').val(0);
    $('#WeeklyTargetProfit').val(0);
    $('#WeeklyTargetStopLoss').val(0);
    $('#PercentDailyTargetProfit').val(0);
    $('#PercentDailyTargetStopLoss').val(0);      
    $('#PercentWeeklyTargetProfit').val(0);
    $('#PercentWeeklyTargetStopLoss').val(0);     
}




//////////////////////////////////////////////////////////////////////////////  SELECT TERMINAL ////////////////////////////////////////////////////////////////////////////

 function removeTabs(tb) {
    var ind = 0;
    var tabs = tb.get();

    tb.remove.apply(tb, tabs);
}

function UpdateEngines (terminal) {
    var PG = terminal.PG;     
    EngineBuyNbrTab = [];
    EngineSellNbrTab = [];
    EngineBuySellTab = [];
    EngineColorTab = [];
    EngineRunningTab = [];
    EngineValueTab = [];
    EngineTextColorTab = [];
    
    for (var j = 0; j < PG.Engines.length; j++) {
        var engine = PG.Engines[j];
        EngineRunningTab.push([]);
        EngineBuySellTab.push([]);
        EngineColorTab.push([]);
        EngineValueTab.push([]);
        EngineTextColorTab.push([]);
    }

    var Nbr_Max_Signals = 100;
    var Nbr_Max_Symbols = 20;
    SignalColorTab = [];
    SignalValueTab = [];

    for (var i = 0; i < Nbr_Max_Signals; i++) {
        SignalColorTab.push([]);
        SignalValueTab.push([]);
        for (var j = 0; j < Nbr_Max_Symbols; j++) {
            SignalColorTab[i].push([]);
            SignalValueTab[i].push([]);
        }
    }
    SystemSignalColorTab = [];
    SystemSignalValueTab = [];
    SystemSignalTimeTab = [];
    ProgressSignalValueTab = [];
    for (var i = 0; i < SystemSignalNbr; i++) {
        SystemSignalColorTab.push([]);
        SystemSignalValueTab.push([]);
        SystemSignalTimeTab.push([]);
        ProgressSignalValueTab.push([]);
        for (var j = 0; j < Nbr_Max_Symbols; j++) {
            SystemSignalColorTab[i].push([]);
            SystemSignalValueTab[i].push([]);
            SystemSignalTimeTab[i].push([]);
            ProgressSignalValueTab[i].push([]);
        }
    }    
    
    AutomationPanel_Update(PG.Engines, automationtable);
    StrategiesPanel_Update(PG.Engines, StrategiesTable);
    TradedeskSelectStrategyPanel_Update (PG.Engines);
    
    var EnginesMenu = GetEnginesMenu ();
    
 //   w2ui['sessions'].getSearch('name').options.items    = EnginesMenu;
 //   w2ui['orders'].getSearch('engine').options.items    = EnginesMenu;  
}





function Tradedesk_UpdateAlerts(terminal) {
    var PG = terminal.PG;
    sb.table_clear(alertssettingstable);    
    AlertPanel_Update (PG, alertssettingstable);
}


function UpdatePanel(terminal) {

    sb.table_clear(tsignalstable);
    var Nbr_Max_Signals = 100;
    var Nbr_Max_Symbols = 20;
    SignalColorTab = [];
    SignalValueTab = [];

    for (var i = 0; i < Nbr_Max_Signals; i++) {
        SignalColorTab.push([]);
        SignalValueTab.push([]);
        for (var j = 0; j < Nbr_Max_Symbols; j++) {
            SignalColorTab[i].push([]);
            SignalValueTab[i].push([]);
        }
    }
    TSignalsPanel_Update(terminal.PG);
    TSysSignalsSelectPanel_Update(terminal.PG);    
}

function GetObjectsMenu() {
    var ObjectsMenu = [];

    var PG = solution.GetPGFromTerminal ();
    if (!PG) return [];
    
    for (var i = 0; i < PG.Objects.length; i++) ObjectsMenu.push(PG.Objects[i].Name);
    return ObjectsMenu;
}

function GetSymbolsMenu() {
    var SymbolsMenu = [];
    var PG = solution.GetPGFromTerminal ();
    if (!PG) return [];

    for (var i = 0; i < PG.Symbols.length; i++) SymbolsMenu.push(PG.Symbols[i].Name);
    return SymbolsMenu;
}

function GetEnginesMenu() {
    var EnginesMenu = [];

    var PG = solution.GetPGFromTerminal ();
    if (!PG) return [];

    for (var i = 0; i < PG.Engines.length; i++) EnginesMenu.push(PG.Engines[i].Name);
    return EnginesMenu;
}

function ToTerminalTime(fromdate) {
    var date = new Date (+fromdate * 1000);
    var hours = date.getTimezoneOffset () /60;
    return (+fromdate * 1000 + hours * 60 * 60 * 1000);
}



//---------------------------------------------------- ADD SYMBOL  --------------------------------------------------------   



//---------------------------------------------------- SELECT SYMBOL  --------------------------------------------------------  

var drag_tradedesksymboltab_options = {
    axis:"x",
    containment: "parent",  
    helper: "clone",    
    start: function( event, ui ) {
    },
    drag: function(event, ui) { 
    },
        
    stop: function(event, ui) {
    }      
}

var drop_tradedesksymboltab_options = {
    drop: function(event, ui) {
        var tosymbolname = this.children[0].id;
        var fromsymbolname = ui.draggable[0].children[0].id;
    },
    over: function(event, ui) {
    }
}
var drop_tradedesktab_options = {
    drop: function(event, ui) {

    },
    over: function(event, ui) {
    }
}

function AddSymbol(terminal, Symbol) {
    var PG = terminal.PG;
    var name = Symbol.Name;
    var index = terminal.PG.GetSymbolIndexFromName(name);
     
    sb.table_addcolumn(automationtable, name, '', ''); 
    
    for (var i = 0; i < automationtable.rows.length; i++) {
        sb.table_setcellcontent (automationtable, i, name, switchcontent (i, index));
    }    
    
    index += 1;
    
    sb.table_addrow (StrategiesTable, [name, PeriodName[Symbol.Period], 0, 0]);
    sb.table_addrow (tradedeskcurrenciestable, [name, '---', '---', 'Off', PeriodName[Symbol.Period], '---', '---', '---', '---']);
    sb.table_addrow (DailyTargetsTable, [name, '---', '---', '---', '---', '---', '---',])
    sb.table_addrow (WeeklyTargetsTable, [name, '---', '---', '---', '---', '---', '---',])
    sb.table_addrow (tsyssignalstable, [name, '', '', '', '', '', '', '', '', '']);
    sb.table_addrow (percentchangetable, [name, '---', '---', '---', '---', '---', '---', '---', '---', '---']);

    var SymbolsMenu = GetSymbolsMenu();


     
    var signalstabitem  = {id: name, item: name,  type: 'link', roleid: 'tradedesksignalstabcontent', items: [tsignalstable],            events: {onclick: "onclick_tradedesksymboltab(this)"}}           
    var charttabitem    = {id: name, item: name,  type: 'link', roleid: 'tradedeskcharttabcontent',   items:[chartpanel(TRADEDESK_PLATFORM_PNAME)],   events: {onclick:"onclick_tradedesksymboltab(this)"}}            
    var ordertabitem    = {id: name, item: name,  type: 'link', roleid: 'tradedeskordertabcontent',   items: [orderpanel],               events: {onclick:"onclick_tradedesksymboltab(this)"}}            
    
    sb.tab_additem (tradedesksignalstab, signalstabitem);
    sb.tab_additem (tradedesk_maintabs, charttabitem);
    sb.tab_additem (tradedeskordertab, ordertabitem);

    //$( '#tradedesk_maintabs #' + name ).parent().draggable(drag_tradedesksymboltab_options);
    //$( '#tradedesk_maintabs #' + name ).parent().droppable(drop_tradedesksymboltab_options);    
    //$( '#tradedesk_maintabs .sb_tab').droppable(drop_tradedesktab_options);

   // $( "#tradedesk_maintabs .sb_tab" ).sortable();
   // $( "#tradedesk_maintabs .sb_tab"  ).disableSelection();

    return Symbol;
}

//---------------------------------------------------- SELECT PERIOD  --------------------------------------------------------  


//---------------------------------------------------- TREAT HISTORY  --------------------------------------------------------   

function Symbol_Select (terminal, symbol, period, draw, async) {
    if (!terminal) {
        return;
    }
    if (!symbol) {
        return;
    }

    var symbolchanged = SelectSymbol(symbol);
    var periodchanged = SelectPeriod(terminal, symbol, period, async);
    
    if (draw) {
        return ChartPanel_Update() ;  
    }
    if (symbolchanged || periodchanged) {
        return ChartPanel_Update() ;  
    }
}


function SelectSymbol(Symbol) {
    var symbolchanged = false;

    if (!Symbol) return null;
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return null;      
   
    if (symbolcanvas.CurrentSymbol != Symbol) {
        if (symbolcanvas.CurrentSymbol != null) {
            sb.table_setcolstyle (automationtable, symbolcanvas.CurrentSymbol.Name, 'border-left: 0px; border-right: 0px; background-color: "";color: "";');
            sb.table_setheadercolstyle (automationtable, symbolcanvas.CurrentSymbol.Name, 'color: ""');
        }    
        symbolcanvas.CurrentSymbol = Symbol;

        sb.table_setcolstyle (automationtable, Symbol.Name, 'border-left: 1px solid var(--theme-border-color);border-right: 1px solid var(--theme-border-color);background-color: var(--theme-bar-bg-color)');
        sb.table_setheadercolstyle (automationtable, Symbol.Name, 'color: var(--theme-select-color);')


      //  SelectPeriod (solution.CurrentTerminal, Symbol, symbolcanvas.CurrentPeriod);

        setField('symbolname', Symbol.Name, false, false);

        //UpdateOrderPanel ('orderpanel', Symbol);


        sb.tab_select (tradedesksignalstab, Symbol.Name);
        sb.tab_select (tradedesk_maintabs,   Symbol.Name);
        sb.tab_select (tradedeskordertab,   Symbol.Name);

        TSignalsPanel_Refresh(Symbol);    
        
        var index = solution.CurrentTerminal.PG.GetSymbolIndexFromName(Symbol.Name);
        
        sb.table_rowselect (tradedeskcurrenciestable,  index)    
        sb.table_rowselect (tsyssignalstable, index)
        sb.table_rowselect (percentchangetable, index)
        sb.table_rowselect (StrategiesTable,  index)

        update_orderpanel (Symbol);


        InitMarketInfo(Symbol);
        
        
        PriceGroup_Update (symbolcanvas, Symbol);        
        symbolchanged = true;
    }
    return symbolchanged;
}

function SelectPeriod(terminal, Symbol, Period, async) {
    var periodchanged = false;
    
    if (!terminal || !Symbol) return null;

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return null;    

    if (async == undefined)
        async = true;

    
    if (symbolcanvas.CurrentPeriod != Period) {
        if (symbolcanvas.CurrentPeriod != null ) {
            sb.table_setcolstyle (tsignalstable, PeriodName[symbolcanvas.CurrentPeriod], 'border-left: 0px; border-right: 0px; background-color: "";color: "";');
            sb.table_setheadercolstyle (tsignalstable, PeriodName[symbolcanvas.CurrentPeriod], 'color: ""');
            sb.table_setcolstyle (tsyssignalstable, PeriodName[symbolcanvas.CurrentPeriod], 'border-left: 0px; border-right: 0px; background-color: "";color: "";');
            sb.table_setheadercolstyle (tsyssignalstable, PeriodName[symbolcanvas.CurrentPeriod], 'color: ""');
            sb.table_setcolstyle (percentchangetable, PeriodName[symbolcanvas.CurrentPeriod], 'border-left: 0px; border-right: 0px; background-color: "";color: "";');
            sb.table_setheadercolstyle (percentchangetable, PeriodName[symbolcanvas.CurrentPeriod], 'color: ""');

        }
        symbolcanvas.CurrentPeriod = Period;
        GChartPanel_UpdatePeriod (symbolcanvas, symbolcanvas.CurrentPeriod);
        sb.table_setcolstyle (tsignalstable, PeriodName[Period], 'border-left: 1px solid var(--theme-border-color);border-right: 1px solid var(--theme-border-color);background-color: var(--theme-bar-bg-color)');
        sb.table_setheadercolstyle (tsignalstable, PeriodName[Period], 'color: var(--theme-select-color);background:var(--theme-select-bg-color)')
        sb.table_setcolstyle (tsyssignalstable, PeriodName[Period], 'border-left: 1px solid var(--theme-border-color);border-right: 1px solid var(--theme-border-color);background-color: var(--theme-bar-bg-color)');
        sb.table_setheadercolstyle (tsyssignalstable, PeriodName[Period], 'color: var(--theme-select-color);background:var(--theme-select-bg-color)')
        sb.table_setcolstyle (percentchangetable, PeriodName[Period], 'border-left: 1px solid var(--theme-border-color);border-right: 1px solid var(--theme-border-color);background-color: var(--theme-bar-bg-color)');
        sb.table_setheadercolstyle (percentchangetable, PeriodName[Period], 'color: var(--theme-select-color);background:var(--theme-select-bg-color)')
      
        periodchanged = true;
    }
    return periodchanged;
}

// INIT FROM SERVER  ON SEND START




function CSVTreatHistory (terminal, Symbol, Period, values) {

    var lines = values.responseText.split(/\r\n|\n/);
    var headings = lines[0].split(','); // Splice up the first row to get the headings
    var mydate;
    
    for (var j = 0; j < lines.length; j++) {
        if (lines[j] == "") continue;
        var elt = lines[j].split(',');
        elt[0] = elt[0].replace(/[.]/g, "-");
        mydate = new Date(elt[0] + "T" + elt[1]);
        mydate.setTime(mydate.getTime());
        Symbol.chartData[period].push({date: mydate,open: +elt[2],high: +elt[3],low: +elt[4],close: +elt[5],volume: +elt[6]});
    }
    
    Symbol.Digits               = numDecimals(Symbol.chartData[period][0].open); 
    Symbol.Point                = SymbolPoint(Symbol.Digits);
    Symbol.NbrCandles[period]   = lines.length;
    Symbol.WaitHistory[period]  = false;
    
    
    var multiplier  = 1;
    
    var symboldigits = Symbol.Digits;

    if (symboldigits == 2 || symboldigits == 4) {
        multiplier = 1;
    } else 
    if (symboldigits == 3 || symboldigits == 5) {
        multiplier = 10;
    } else
    if (symboldigits == 6) {
        multiplier = 100;
    } else
    if (symboldigits == 7) {
        multiplier = 1000;
    }
    
    Symbol.SysPoint = Symbol.Point * multiplier;
    
    InitMarketInfo(Symbol);
    
    LoaderChartHistory (false);    
    
    stopLoaderMarker();


    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;

    if (symbolcanvas.CurrentPeriod == Period) {
        Chart_Draw(terminal)   
    }
        
}

//---------------------------------------------------- CHART SELECTION  --------------------------------------------------------   

function AddChartSelection(symbolcanvas, selection, x, y) {
    switch (selection) {
    case "horizontalline":
        symbolcanvas.HLines.push({start: [0, y], end: [0, y]});
        break;
    case "verticalline":
        symbolcanvas.VLines.push({start: [x.date, 0], end: [x.date, 0]});
        break;
    case "trendline":
        break;
    }
}

var onTrendLineStart = function (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    if (event.button == 2) {
        elt.state.current = null;
        OnRClickCanvasChart(event);
    }
    if (symbolcanvas.Selection != 'trendline') {
        return;
    }
}

var onFibStart = function (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    if (event.button == 2) {
        elt.state.current = null;
        OnRClickCanvasChart(event);
    }
    if (symbolcanvas.Selection != 'fiblines') {
        return;
    }
}

var onTrendLineComplete = function (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    
    
    if (event && event.button == 2) {
        return;
    }
    if (elt.props.subtype) {
        if (elt.props.subtype == "horizontal") {
            symbolcanvas.HLines = [...elt.state.trends];
        } else 
        if (elt.props.subtype == "vertical") {
            symbolcanvas.HLines = [...elt.state.trends];
        } else 
        symbolcanvas.Trends = [...elt.state.trends];
    }
}

var onFibComplete = function (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (event && event.button == 2) {
        return;
    }
    symbolcanvas.Retracements = [...elt.state.retracements];
}


//---------------------------------------------------- AMERICAN BULLS     ------------------------------------------------  


function ReadAmericanBulls(ticker) {
    let  site           = solution.get('site'); 

    url_submit (type, url, par /*object {}*/, async, callback, values /* array []*/, aftercallback, aftervalues) 
    var params = 'ticker=' + ticker;
   
    var url = site.address + '/php/read_americanbulls.php';
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            ResultAmericanBulls(xhttp);
        }
    };
    xhttp.send(params);
    return 1;
}

function ResultAmericanBulls(response) {
    console.log (response);
    return;

    var arr = response.responseText;
    var doc = new DOMParser().parseFromString(arr, "text/html");
    var lpostedOnes = doc.getElementById('MainContent_signalpagehistory_C0');
    var insertpos = 0;
   
    
    for (var i = lpostedOnes.length - 1; i >= 0 ; i--) {
        if (lpostedOnes[i].innerHTML) {
        }
    }
}

function OnLoadFrame(url) {
    console.log('url');
    var content_div = document.getElementById('myfxbook_top_news');
}

function FramePanel(url) {
    let  site           = solution.get('site');     
//    var url = site.address + '/php/read_americanbulls.php?ticker=FCX'
    var url = site.address + '/php/load_url.php?url=' + url 

    var content = "";
    content = '<iframe id="myfxbook_top_news" name="myfxbook_top_news" onload="OnLoadFrame()" width="100%" height="100%"  scrolling="yes" frameborder="0" allowtransparency="false" hspace="0" vspace="0" marginheight="0" marginwidth="0" src="' + url + '"></iframe>';
    return content;
}

//----------------------------------------------------------- SOCKET RELATED -------------------------------------------------------------

function tradedesk_PlatformsPanel () {
    var content = '';
    
    content = 
'   <div class="sb_f_style_h6">Servers</div>' +
'   <div id="platformspanel" class="">'+       		            
'       <table id="platformstable" class="sb_table table" >' +
'           <thead>' +
'               <tr>' +
'                   <th title="" style="">Terminal</th>' +
'                   <th title="" style="text-align: center;">Platform</th>' +
'                   <th title="" style="text-align: center;">Strategy Tester</th>' +
'               </tr>' +
'           </thead>' +
'           <tbody>' +
'           </tbody>' +
'       </table>' + 
'       <div class="sb_buttongroup">' +
'           <button class="sb_button"  type="button" onclick="OnClickResetServers(this)">Reset</button>' +        
'           <button class="sb_button"  type="button" onclick="OnClickApplyServers(this)">Apply</button>' +
'       </div>' +            
'   </div>';
    return content
}

//------------------------------------------------------- SERVERS SETTINGS ------------------------------------------------------------

function OnClickResetServers (elt) {
     
    let protocol = solution.get('site').protocol + '//';

    for (var i = 0; i < solution.Terminals.length; i++) {
        let terminal = solution.Terminals[i];    
        if (terminal.Type == 'Terminal') {        
            $('#terminalserver' + i).val (terminal.Server.replace(protocol, ''));         

            terminal = solution.GetTerminalFromNameType(terminal.Name, 'Tester');
            $('#strategytesterserver' + i).val (terminal.Server.replace(protocol, ''));   
        }
    }
}

function OnClickApplyServers (elt) {
   
    for (var i = 0; i < solution.Terminals.length; i++) {
        let terminal = solution.Terminals[i];    

        if (terminal.Type == 'Terminal') {
            servername =  $('#terminalserver' + i).val();
            if (servername != terminal.Server) {
                terminal.Server = servername;
                terminal.Com.Socket.close();     
                MT4Connect(terminal, solution.MT4Server_Address, solution.MT4Server_Port, solution.MT4Server_Reconnection);
            }   
            terminal = solution.GetTerminalFromNameType(terminal.Name, 'Tester');
            servername = $('#strategytesterserver' + i).val();
            if (servername != terminal.Server) {
                terminal.Server = servername;
                terminal.Com.Socket.close();   
                MT4Connect(terminal, solution.MT4Server_Address, solution.MT4Server_Port, solution.MT4Server_Reconnection);
            }
        }   
    }
}

function PlatformsPanel_Update () {
    let tcontent = '';
    for (var i = 0; i < solution.Terminals.length; i++) {
        var terminal = solution.Terminals[i];    
        if (terminal.Type == 'Terminal') {
            tcontent +=
    '         <tr id="" title="">' +
    '             <td id=""> <i class="fas fa-landmark"></i><span class="terminalname" >' +  terminal.Name + '</span></td>' +

    '             <td id="" style="text-align: center;"><input class="terminalserver form-control" value = "' + 
                        terminal.Server + 
                        '" type="text" id="terminalserver' + i + '"></td>' +

    '             <td id="" style="text-align: center;"><input class="terminalserver form-control" value = "' + 
                        solution.GetTerminalFromNameType(terminal.Name, 'Tester').Server + 
                        '" type="text" id="strategytesterserver' + i + '"></td>' +

    '         </tr>';
        }
    }
   $('#serverpanel_tradedesk tbody').html (tcontent);
}


function RefreshTreeSession(session, engine) {
    
    var PG = solution.CurrentTerminal.PG;
    
    if (session) {
        engine = PG.GetEngineFromNameOperation(session.Engine, OperationName[session.Operation]);
    }
    
    if (!engine) {
        if (CurrentTContainer) {
            CurrentTContainer.Clear(SESSION_GSE_ID);
        }
        return;
    }
     
    if (engine.Code[CODE_SS] == -1) {
        let  site           = solution.get('site');            
        let  user           = solution.get('user')  

        var rootterminal = solution.CurrentTerminal.Type == 'Terminal' ? user.path + "/Terminal/" + solution.CurrentTerminal.Folder + "/MQL4/Files/" : user.path + "/Terminal/" + solution.CurrentTerminal.Folder + "/tester/files/";        
        var rootobject   = site.address + rootterminal;        
        engine.Load(rootobject);
    }
      
    try {
        solution.PL.ParseEngine(engine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);     
        return;     
    }    
 

    if (CurrentTContainer) {
        CurrentTContainer.SetRootNode(TreeFromSS(solution.PL, CurrentTContainer.GSE));
        CurrentTContainer.Refresh(SESSION_GSE_ID);
    }
}


function SelectEngine(engine) {
    if (!engine) return;
    
    var strategy = solution.CurrentTerminal.PG.GetStrategyFromName(engine.Name);
    CurrentTEngine = engine;
   
    RefreshTreeSession(null, engine); //engine dependency is done
    TradedeskSCEditor.setValue(engine.SCContent, -1);
    
    var schedule;

    if (engine.Schedules.length == 0) {
        schedule = new pgschedule(engine.StartRule, engine.Operation, '', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1');
    } 
    else 
        schedule = engine.Schedules[0];
    
    CurrentTSchedule = schedule;
    
    var symbolcanvas = solution.GetCanvasFromTerminal();

    for (var i = 0; i < engine.Indicators.length; i++) {
        var object = solution.CurrentTerminal.PG.GetObjectFromId (engine.Indicators[i]);                        
        symbolcanvas.AddIndicator(object.Id)
    }
    if (!engine.MinPeriod) {
        engine.MinPeriod = engine.MaxPeriod = symbolcanvas.CurrentPeriod;
    }       
    
    Symbol_Select(solution.CurrentTerminal, symbolcanvas.CurrentSymbol, engine.MinPeriod);       
//    SelectPeriod(solution.CurrentTerminal, symbolcanvas.CurrentSymbol, engine.MinPeriod);    
//refresh
    StrategyPropertiesPanel_Update (tradedeskplatform, CurrentTEngine);
    StrategySchedulePanel_Update (tradedeskplatform, CurrentTSchedule);    
    StrategyDescriptionPanel_Update(tradedeskplatform, strategy);         

//draw    

    $("#tradedeskstrategyselect option[value='--Select Strategy--']").remove();   
    $('#tradedeskstrategyselect option[value="' + engine.Name + '"]').prop('selected', true); 
    $('#tradedesk_strategy_name').html(engine.Name); 
}

function SelectSession(session) {

    if (!session) return;

    if (session == CurrentSession) return;

    var PG = solution.CurrentTerminal.PG;

    var engine = PG.GetEngineFromNameOperation(session.Engine, OperationName[session.Operation]);
    if (!engine) return;
    var strategy = PG.GetStrategyFromEngine(engine);
    
    CurrentSession = session;    

    RefreshTreeSession(session); //engine dependency is done

    TradedeskSCEditor.setValue(engine.SCContent, -1);

    var schedule;

    if (engine.Schedules.length == 0) {
        schedule = new pgschedule(engine.StartRule, engine.Operation, '', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1');
    } 
    else 
        schedule = engine.Schedules[0];
    
    CurrentTSchedule = schedule;


    StrategyPropertiesPanel_Update (tradedeskplatform, engine);
    StrategySchedulePanel_Update (tradedeskplatform, CurrentTSchedule);    
    StrategyDescriptionPanel_Update(tradedeskplatform, strategy);  


   
    var Symbol = PG.GetSymbolFromName(session.Symbol);
    
    SessionOrdersPanel_Update (session);         

    
    SessionEnableButtons();
    setInterval(SessionEnableButtons, 300);
 
    var symbolcanvas = solution.GetCanvasFromTerminal();
      
    RemoveChartIndicator(symbolcanvas, "-1");
    
    for (var i = 0; i < engine.Indicators.length; i++) {
        var object = PG.GetObjectFromId (engine.Indicators[i]);
        symbolcanvas.AddIndicator(object.Id);
    }

    if (!engine.MinPeriod) {
        engine.MinPeriod = engine.MaxPeriod = Symbol.Period;
    }        

    Symbol_Select(solution.CurrentTerminal, Symbol, engine.MinPeriod);                  

   
//draw    

    $("#tradedeskstrategyselect option[value='--Select Strategy--']").remove();   
    $('#tradedeskstrategyselect option[value="' + engine.Name + '"]').prop('selected', true); 
    
}

