var Interval_getoptionquotes      = 0;
var Interval_optionloadterminal   = 0;
var CurrentRate = 0;
var CurrentDividend = 0;

//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function option_init() {
    option_solution('option');
    option_editors_init('option'); 
    

    Interval_optiontimer    = setInterval(option_timer, 300);     

    // market      

}

function option_end() {
    console.log ('here i execute the end process of a module')
    option_closeterminal(solution.CurrentOptionTerminal)    
}

//---------------------------------------------------------------------MODULE END   -----------------------------------------------------------------------------//

function option_select (name) {

//--- data ui platform update .............    
    let ui  = solution.get('ui')    

// market    
    $('#marketpanel').css ('display', 'flex');        
    
    ui.platform_updatedata('option', solution.CurrentOptionTerminal)

    AnimationReset('animation')
    ui.platform_expand(name, true);
    DrawChart();

//option    
    $("#togglebutton").attr("style", "display:block!important");

    sb.tree_setitemcolor ('option_tree_terminals', "Yahoo Finance", theme_on); 

    if (!solution.CurrentOptionTerminal) {
        sidebarmenu_select ('sidebar_optionterminals', true);      

        DisplayInfo("Select a Platform", true, 'operationpanel', 'var(--bg-optionterminal)');
        AnimationDisplay ('option', 'Welcome to Option Tracker', 'option_toppanel');         
        AnimationDisplay ('option', 'Sorry YAHOO API not more supported', 'option_toppanel', true);              
    }       
}

function option_solution (pname) {
    let  site           = solution.get('site');
    let  user           = solution.get('user')





    solution.CurrentOptionTerminal = null;


    if (!solution.DefaultLoaded) {
        pg_solution ()
        solution.LoadPGDefault (pname);   
        solution.DefaultLoaded = true;        
    }    
    solution.UpdatePredefinedIndicators (pname);
    

    solution.option_LoadTerminals = function (Id, url, async, interfacecallback, par) {
        if (!async) async = false;
        var params = 'user_id=' + (Id == "0" ? "1" : Id);

        var xhttp = new XMLHttpRequest();
      
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let arraystructure;    
                try {
                    arraystructure = JSON.parse(this.responseText);
                } catch(e) {
                    return console.error(e); 
                }                    

                
                for (var i = 0; i < arraystructure.length; i++) {
                    let terminalstruct = arraystructure[i];

                    let pathElements = terminalstruct.DataPath.replace(/\/$/, '').split('/');
                    let sdatapath = pathElements[pathElements.length - 1];


                    if (terminalstruct.Type == 'Yahoo') {   // 2 terminals; option and main

                        if (solution.GetTerminalsFromName (terminalstruct.Name).length != 0) continue;

                        let realterminal  = new pgterminal(OPTION_PLATFORM_PNAME, terminalstruct.Type);
                        realterminal =  {...realterminal, ...terminalstruct}
                        realterminal.Folder  = sdatapath;
                        solution.Terminals.push(realterminal);
                    }
                    else
                    if (terminalstruct.Type == 'IB') {   // 2 terminals; option and main

                        if (solution.GetTerminalsFromName (terminalstruct.Name).length != 0) continue;

                        var realterminal = new pgterminal("", terminalstruct.Type);
                        realterminal =  {...realterminal, ...terminalstruct}
                        realterminal.Folder = sdatapath;
                        solution.Terminals.push(realterminal);
                    }
                }
                if (interfacecallback)  interfacecallback (par);            
            }
        };
        xhttp.open('POST', url, async);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }


    solution.UpdateOptionTerminals = function (solution) {
        let items = [];
    
        if (solution == this) {
            console.log ('OK TO USE THIS')
        }

        for (var j = 0; j < solution.Terminals.length; j++) {
            var terminal = solution.Terminals[j];
    
            if ((terminal.Type == 'Yahoo') || terminal.Type == 'IB') {

                items.push({id:'terminal_' + terminal.Name, type: 'link', item: terminal.Name, icon: icon_terminal, Type:terminal.Type,
                    attributes:{selector: 'option_selectterminal'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}               
                });
                sb.select_additem ('option_terminalselect', terminal.Name);                 

            }
        }
        sb.tree_additems ('option_tree_terminals', items);
        $("#option_tree_terminals").addClass('show');    
    }
    
    if (solution.UserId != "0") {
        solution.AddYahooTerminal ("XXXXXX", "XXXXXX", "Yahoo Finance" , "Yahoo", "//Yahoo"); //options
    }
    solution.option_LoadTerminals(user.id, site.address  + "/php/read_terminals.php", SYNCHRONE, solution.UpdateOptionTerminals, solution);    
}

function option_timer () {
    if (solution.CurrentOptionTerminal) {
        $('#option_terminalsbar #' + 'option_close').css ('display', '');

        $('#optioncharttab').css ('display', '');
        $('#option_currencybar').css ('display', '');

        if ($('#optioncontracttab .sb_content').html() != "") {
            $('#optioncontracttab').css ('display', '');
        } else {
            $('#optioncontracttab').css ('display', 'none');     
        }       

        $('#option_root #' + 'indicatorCreate').css ('display', '');           
                
    } else {
        $('#option_terminalsbar #' + 'option_close').css ('display', 'none');        

        $('#optioncharttab').css ('display', 'none');
        $('#option_currencybar').css ('display', 'none');        

        $('#optioncontracttab').css ('display', 'none');  

        $('#option_root #' + 'indicatorCreate').css ('display', 'none');              

    }
}

function option_home_open (event) {
    let platform =  sb.get(main, 'pname', 'home');
    //    LoaderDisplay(true);
    if (platform.length == 0) {
        solution.add_module('home');               
    } 
  
    let ui  = solution.get('ui')     
    ui.platform_select(HOME_PLATFORM_PNAME)    
    onclick_home_mainbar ($('#home_mainbar_trading')[0], event)      
}

function option_selectterminal(terminal, force) {
  
    if (!terminal) {
        return;
    }

    if (!force && solution.CurrentOptionTerminal == terminal) {
        return terminal;
    }
    
    if (solution.CurrentOptionTerminal) {
      //  solution.CurrentOptionTerminal.Com.Send( solution.UserId + '*START*' +  solution.CurrentOptionTerminal.Type + '*' +  solution.CurrentOptionTerminal.Name + '*0');
        solution.CurrentOptionTerminal.PG.SaveProfile(solution.CurrentOptionTerminal);
    }
  
//--- data ui platform update .............
    let ui  = solution.get('ui')   
    solution.CurrentOptionTerminal = terminal;   
    ui.platform_updatedata('option', solution.CurrentOptionTerminal)   

    InitOption();

    if (!terminal.Loaded) {  //just copy objects
        LoaderDisplay(true);        
        
        DisplayInfo("Loading Terminal ... Please wait", true, 'operationpanel', 'var(--bg-optionterminal)');        
        Interval_optionloadterminal = setInterval(option_loadedterminal, 300, terminal); //5 minutes 300000     
        terminal.Load();
    } else {
//        UpdateIndicators(terminal);
//        UpdateSymbols(terminal);
      //  UpdateOrders(terminal);

        DisplayInfo("Terminal loaded", true, 'operationpanel', 'var(--bg-optionterminal)');  
       // terminal.Com.Send(solution.UserId + '*START*' + terminal.Type + '*' + terminal.Name + '*1');                  
        option_drawterminal (terminal, true);  
        Interval_getoptionquotes     = setInterval(OnGetContracts,    60000, terminal);   // every 6 seconds      
    }
}

function option_closeterminal (terminal) {
    if (!terminal)
        return;

    clearInterval(Interval_getoptionquotes);
         
    sb.tree_selectitem ('option_tree_terminals', terminal.Name, true);

    if (solution.UserId != "0") {
        terminal.Save ();
    }

    if (terminal == solution.CurrentOptionTerminal){
        InitOption ();
        option_drawterminal (terminal, false);

//--- data ui platform update .............
        let ui  = solution.get('ui')           
        solution.CurrentOptionTerminal = null;
        ui.platform_updatedata('option', solution.CurrentOptionTerminal)           
    }    
    
    AnimationDisplay ('option', 'Goodbye', 'option_toppanel');
    terminal.Loaded = 0;  
}

function option_loadedterminal (terminal) {
    if (terminal.Loaded) {
        clearInterval(Interval_optionloadterminal);
        LoaderDisplay(false);      

        DisplayInfo("Terminal loaded", true, 'operationpanel', 'var(--bg-terminal)');
//        terminal.Com.Send(solution.UserId + '*START*' + terminal.Type + '*' + terminal.Name + '*1');    
        option_drawterminal (terminal, true);  
        Interval_getoptionquotes     = setInterval(OnGetContracts,    60000, terminal);   // every 6 seconds        
    }
}

function option_drawterminal (terminal, open) {
    if (!terminal) {
        return;
    }
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('name', OPTION_PLATFORM_NAME); 


    if (open) {        
        $("#option_terminalselect option[value='--Select Terminal--']").remove();   
        $('#option_terminalselect option[value="' + terminal.Name + '"]').prop('selected', true);
        sb.tree_selectitem ('option_tree_terminals', terminal.Name);  

        sb.box_toggle('option_boxterminalspanel', false);

        option_editors_update()
        BottomPanel_Flat (platform, true, true);
    

    } else {
        $("#option_terminalselect option").eq(0).before($('<option>', {value: '--Select Terminal--', text: '--Select Terminal--'}));
        $("#option_terminalselect option[value='--Select Project--']").prop('selected', true);
        sb.tree_selectitem ('option_tree_terminals', '');

        sb.box_toggle('option_boxterminalspanel', true);

        BottomPanel_Flat(platform, true, true); 
        AnimationDisplay ('option', 'Goodbye', 'option_toppanel');                       
    }        
}


function onchange_option_terminalselect (elt, event) {
    let terminalname    = $('#' + elt.id + ' option:selected').val();
    console.log (terminalname)
    let terminal        = solution.GetTerminalsFromName (terminalname)[0];        
    option_selectterminal(terminal);
}

//-------------------------------------------------------------------------YAHOO MODEL-------------------------------------------------------------------

var pgoption = function (impliedVol, delta, optPrice, pvDividend, gamma, vega, theta, undPrice) {
	this.impliedVolatility = impliedVol;	
	this.bid = 0;
	this.ask = 0;
	this.lastPrice = optPrice;      

	this.delta = delta;    
	this.pvDividend = pvDividend;    
	this.gamma = gamma;    
	this.vega = vega;    
	this.theta = theta;    
	this.undPrice = undPrice;      

	this.bidsize;
	this.asksize;
}

var pgyahoooption = function () {
    this.impliedVolatility;   // 0.500005
    this.bid;   // 6.95
    this.ask;   // 7.05
    this.lastPrice;   // 5.75
    
    this.change;   // 0
    this.contractSize;   // "REGULAR"
    this.contractSymbol;   // "SLV200529C00009000"
    this.currency;   // "USD"
    this.expiration;   // 1590710400

    this.inTheMoney;   // true

    this.lastTradeDate;   // 1589774844
    this.openInterest;   // 1
    this.percentChange;   // 0
    this.strike;   // 9    
}


var pgcontract = function () {
    this.summary; 
    this.marketName;
    this.minTick;
    this.orderTypes;
    this.validExchanges;
    this.priceMagnifier;
    this.underConId;
    this.longName;
    this.contractMonth;
    this.industry;
    this.category;
    this.subcategory;
    this.timeZoneId;
    this.tradingHour;
    this.evRule;
    this.evMultiplier;
}    


var pgcontractsummary = function () {
    this.symbol;                //"symbol":"SLV",
    this.secType;               //"secType":"OPT",
    this.expiry;                //"expiry":"20200630", ok
    this.strike;                //"strike":30, ok
    this.right;                 //"right":"C",
    this.exchange;              //"exchange":"SMART",
    this.currency;              //"currency":"USD",
    this.localSymbol = "";      //"localSymbol":"SLV   200630C00030000",
    this.tradingClass;          //"tradingClass":"SLV",
    this.conId;                 //"conId":381304656,
    this.multiplier;            //"multiplier":"100",
    this.primaryExch;           //"primaryExch":""
}

var pgyahooquote = function () {
    this.ask;   // 27.33
    this.askSize;   // 29
    this.averageDailyVolume3Month;   // 417760
    this.averageDailyVolume10Day;   // 581900
    this.bid;   // 27.26
    this.bidSize;   // 18
    this.bookValue; // 18.368
    this.currency;   // "USD"
    this.esgPopulated;   // false
    this.exchange;   // "PCX"
    this.exchangeDataDelayedBy;   // 0
    this.exchangeTimezoneName;   // "America/New_York"
    this.exchangeTimezoneShortName;   // "EDT"
    this.fiftyDayAverage;   // 22.117144
    this.fiftyDayAverageChange;   // 5.1828556
    this.fiftyDayAverageChangePercent;   // 0.23433657
    this.fiftyTwoWeekHigh;   // 39.66
    this.fiftyTwoWeekHighChange;   // -12.360001
    this.fiftyTwoWeekHighChangePercent;   // -0.31164902
    this.fiftyTwoWeekLow;   // 12.66
    this.fiftyTwoWeekLowChange;   // 14.639999
    this.fiftyTwoWeekLowChangePercent;   // 1.156398
    this.fiftyTwoWeekRange;   // "12.66 - 39.66"
    this.firstTradeDateMilliseconds;   // 1228401000000
    this.fullExchangeName;   // "NYSEArca"
    this.gmtOffSetMilliseconds;   // -14400000
    this.language;   // "en-US"
    this.longName;   // "ProShares Ultra Silver"
    this.market;   // "us_market"
    this.marketState;   // "CLOSED"
    this.messageBoardId;   // "finmb_51310806"
    this.postMarketChange;   // 0.07999992
    this.postMarketChangePercent;   // 0.29304
    this.postMarketPrice;   // 27.38
    this.postMarketTime;   // 1590189399
    this.priceHint;   // 2
    this.quoteSourceName;   // "Delayed Quote"
    this.quoteType;   // "ETF"
    this.region;   // "US"
    this.regularMarketChange;   // 0.61999893
    this.regularMarketChangePercent;   // 2.323834
    this.regularMarketDayHigh;   // 27.61
    this.regularMarketDayLow;   // 27.01
    this.regularMarketDayRange;   // "27.01 - 27.61"
    this.regularMarketOpen;   // 27.15
    this.regularMarketPreviousClose;   // 26.68
    this.regularMarketPrice;   // 27.3
    this.regularMarketTime;   // 1590177600
    this.regularMarketVolume;   // 420250
    this.shortName;   // "ProShares Ultra Silver"
    this.sourceInterval;   // 15
    this.symbol;   // "AGQ"
    this.tradeable;   // true
    this.trailingThreeMonthNavReturns;   // -37.81
    this.trailingThreeMonthReturns;   // -36.73
    this.triggerable;   // false
    this.twoHundredDayAverage;   // 26.806087
    this.twoHundredDayAverageChange;   // 0.49391174
    this.twoHundredDayAverageChangePercent;   // 0.018425357
    this.ytdReturn;   // -37.39
}

var pgyahooexpirycontracts = function () {
    this.calls          = []         // []
    this.expirationDate = "";        // 1592524800 _datetime.datetime.fromtimestamp(exp).strftime('%Y%m%d')
    this.hasMiniOptions = false;     // false
    this.puts           = [];        // []
}

var pgyyahoooptionchain = function () {
    this.expirationDates = [];    //[1592524800, 1594944000, 1600387200, 1608249600, 1610668800, 1642723200]
    this.hasMiniOptions = false;  // false
    this.options        =  []     // pgyahooexpirycontracts
    this.quote          = "";     //{language: "en-US", region: "US", quoteType: "ETF", quoteSourceName: "Delayed Quote", triggerable: false, …}
    this.strikes        = []      // [6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]
    this.underlyingSymbol = "";   // "AGQ"
}

var pgyyahoooptionchains = function () {
    this.error  = null;
    this.result = []; // pgyyahoooptionchain
}

//-------------------------------------------------------------- OPTION ACE EDITORS ------------------------------------------------------

var OptionSignalEditor      = null;

function option_editors_init (id) {
    OptionSignalEditor   = new aceeditor('signaleditor_' + id, 'ace/theme/sc_on_dark', 'ace/mode/lisp');      
    OptionSignalEditor.setOptions({
    
        fontFamily: "sans-serif",
        fontSize: 10,
        readOnly: true,
        showPrintMargin: false,
        showGutter: false
    });

}

function option_editors_update () {
    OptionSignalEditor.setMode(); //highlights update
}

function onclick_righttabs(elt, event) {
    let id = elt.id;
    switch (id) {
        case 'tab_optioncontracts':
            $('#optioncontractstable').show() 
            $('#optiongreekstable').hide()

        break;
        case 'tab_optiongreeks':
            $('#optioncontractstable').hide() 
            $('#optiongreekstable').show() 

        break;
    }
} 

function onclick_optiontabs(event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    BottomPanel_Flat (platform, false, true);
}

function ondblclick_optiontabs(elt, event) {
    event.stopPropagation();    
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    BottomPanel_Flat (platform, undefined, true);
} 



//------------------------------------------------------------ SYMBOL TAB----------------------------------------------------------

function onclick_optionsymboltab (elt) {
    
    var symbolcanvas = solution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;      

    var symbolname = elt.innerText;

    var Symbol = symbolcanvas.PG.GetSymbolFromName(symbolname);
    Option_SelectSymbol(Symbol);   
}



//------------------------------------------------------------- CURRENCY PANEL ------------------------------------------------------------



function ondrop_option_main(event) {

}

function UpdateSymbolFromOptionChain (terminal, symbol, fulloptionchain) {        
    symbol.Contracts = [];
    symbol.NbrContractRead = 0;
    symbol.NbrContracts = fulloptionchain.expirationDates.length;            

    
    if (symbol.NbrContracts == 0) {  // symbol not found

        var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
        if (!symbolcanvas) {
            return;
        }
        if (symbolcanvas.CurrentSymbol == symbol){
            ContractsPanel_Update (symbol);   
        }             
        return; 
    }       

    UpdateContractFromOptionChain (terminal, symbol, fulloptionchain);                         // Treat first date

    var strikes     = fulloptionchain.strikes;
    
    let selected_strikes = []
    let selected_expiries = []
    
    if (symbol.Strikes.length != 0) {    // not first time
        for (var i = 0; i < symbol.Strikes.length; i++) {
            if (symbol.Strikes[i].checked == true) {
                selected_strikes.push (symbol.Strikes[i].id)
            }            
        }
    } else {
        let inthemoney = fulloptionchain.strikes.reduce((a, b) => {
            var n_a = a;
            var n_b = b;
            let aDiff = Math.abs(n_a - symbol.Last);
            let bDiff = Math.abs(n_b - symbol.Last);
    
            if (aDiff == bDiff) {
                return n_a > n_b ? a : b;
            } else {
                return bDiff < aDiff ? b : a;
            }
        });

        let index     = fulloptionchain.strikes.indexOf(inthemoney);
        let nbrtoseef = Math.min (fulloptionchain.strikes.length, index + 4);   //10
        let nbrtoseeb = Math.max (0, index - 3);                        //10
    
        for (var i = index; i < nbrtoseef; i++) {
            selected_strikes.push (fulloptionchain.strikes[i]);
        }
        for (var i = nbrtoseeb; i < index; i++) {
            selected_strikes.push (fulloptionchain.strikes[i]);
        }    
    }

    if (symbol.Expiries.length != 0) {   // not first time
        for (var i = 0; i < symbol.Expiries.length; i++) {
            if (symbol.Expiries[i].checked == true) {
                selected_expiries.push (symbol.Expiries[i].id)
            }
        }
    } else {
        let timestamp   = fulloptionchain.expirationDates[0];         // we put the first expiry
        let date        = new Date (timestamp * 1000);
        let expiry      = d3.timeFormat("%Y%m%d")(date);        
        selected_expiries.push (expiry)
    }

    symbol.Strikes   = [];
    symbol.Expiries = [];

    for (var i = 0; i < fulloptionchain.strikes.length; i++) {
        let strike = fulloptionchain.strikes[i];
        binaryInsert (
            {id: strike,   item: strike, checked: (selected_strikes.includes (strike) ? true : false), type: 'button', toggle: true, title: '',   events: {onclick:'onclick_StrikeBar(this)'}}, 
            'item', 
            symbol.Strikes);
    }

    for (var i = 0; i < fulloptionchain.expirationDates.length; i++) {   // Treat the others

        var timestamp = fulloptionchain.expirationDates[i];
        var date = new Date (timestamp * 1000);
        var expiry = d3.timeFormat("%Y%m%d")(date);
       
        symbol.Expiries.push ( {id: expiry,   item: expiry,  checked: (selected_expiries.includes (expiry) ? true : false), type: 'button', toggle: true, title: GetDaysToExpiration (expiry) + ' ' + 'days',  style: 'border-color:' + RandomColors[i],  events: {onclick:'onclick_ExpiryBar(this)'}}); 
    }
    
    for (var i = 1; i < fulloptionchain.expirationDates.length; i++) {   // Treat the others
        OnGetTreatComputation (terminal, symbol, fulloptionchain.expirationDates[i]);
    }     
}

function OnGetTreatComputation (terminal, symbol, date) {
    let  site           = solution.get('site');    

    if (terminal.Type  == 'IB') {
         //    var sorder = "*GET_TICKOPTIONCOMPUTATION^" + symbolcanvas.CurrentSymbol.Name + "^" + contractreqid + "^" + optioncontract.summary.expiry + "^" + optioncontract.summary.strike + "^" + optioncontract.summary.right + "*";
         //    solution.CurrentOptionTerminal.Com.Send(solution.UserId + '*' + symbolcanvas.CurrentSymbol.Name + sorder);       }
    }
     else
     if (terminal.Type  == 'Yahoo') {
     //    LoadURL ("https://query1.finance.yahoo.com/v7/finance/options/" + symbol.Name + "?date=" + date, true, terminal, OptionTreatComputation, symbol, date)
         url_submit ('GET', site.address + '/php/load_url.php', 
         {url: "https://query1.finance.yahoo.com/v7/finance/options/" + symbol.Name + "?date=" + date}, 
         true, OptionTreatComputation, [terminal, symbol, date])           

     }
 }


function OptionTreatComputation (responseText, parameters) {
    let terminal = parameters[0];
    let symbol   = parameters[1];
    let date     = parameters[2];

    try {
        var response = JSON.parse(responseText);  
    } catch(objError) {
        var e;
        if (objError instanceof SyntaxError) {
            e = objError.name;
        } else {
            e = objError.message;
        }            
        DisplayInfo(e, true, 'operationpanel', 'tomato');        
        LoaderDisplay(false);
        return;
    }    
    
    for (var i = 0; i < response.optionChain.result.length; i++) {        
        var fulloptionchain = response.optionChain.result[i];
        var symbolchain = fulloptionchain.quote;   
        
        UpdateSymbolFromSymbolChain (terminal, symbolchain)

        UpdateContractFromOptionChain (terminal, symbol, fulloptionchain);

        if (symbol.NbrContractRead == symbol.NbrContracts) {
            UpdateContracts(symbol);   
           
            var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
            if (!symbolcanvas) {
                return;
            }
            if (symbolcanvas.CurrentSymbol == symbol){
                ContractsPanel_Update (symbol);   
            }             
                    
        }
    }  
}

function UpdateContractFromOptionChain  (terminal, symbol, fulloptionchain) {
    var optionchain = fulloptionchain.options;

    
    symbol.NbrContractRead++;
    

    
    for (var i = 0; i < optionchain.length; i++) {
        var expirycontracts = optionchain[i];

        var expirationDate = expirycontracts.expirationDate;
        var hasMiniOptions = expirycontracts.hasMiniOptions;
        var contract;

      
        var calls = expirycontracts.calls;
        for (var i = 0; i < calls.length; i++) {
            var call = calls[i];
            contract = symbol.GetContractFromName (call.contractSymbol);
            if (!contract)   { 
                contract = new pgcontract ();
                contract.Indicator = new ContractLayout(contract, []);
                var summary = new pgcontractsummary();
                contract.summary = summary;
                var date = new Date (call.expiration * 1000);
                summary.symbol = symbol.Name;
                summary.expiry = d3.timeFormat("%Y%m%d")(date);    
                summary.strike = call.strike;
                summary.right = 'C';
                summary.currency = call.currency;
                summary.localSymbol = call.contractSymbol;        
                symbol.Contracts.push (contract);
            }
            call.impliedVolatility = (+call.impliedVolatility * 100).toFixed(1);
            contract.value = call;
        }
        var puts = expirycontracts.puts;
        for (var i = 0; i < puts.length; i++) {
            var put = puts[i];
            contract = symbol.GetContractFromName (put.contractSymbol);
            if (!contract)   { 
                contract = new pgcontract ();
                contract.Indicator = new ContractLayout(contract, []);
                var summary = new pgcontractsummary();
                contract.summary = summary;
                var date = new Date (put.expiration * 1000);
                summary.symbol = symbol.Name;
                summary.expiry = d3.timeFormat("%Y%m%d")(date);    
                summary.strike = put.strike;
                summary.right = 'P';
                summary.currency = put.currency;
                summary.localSymbol = put.contractSymbol;
                symbol.Contracts.push (contract);
            }
                
            put.impliedVolatility = (+put.impliedVolatility * 100).toFixed(1);        
            contract.value = put;
        }
    }

}   



//-----------------------------------------------------

function OptionHeaderSideBarPanel () {
    var content =     
    '<div class="sb_sidebarheader">' +
            '<div class="sb_sidebarheadertitle">OPTION TRACKER</div>' +
            '<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>' +
    '</div>';
    return content;
}

function onclick_SymbolCloseTabItem(elt, event) {
    event.stopPropagation ();      
    
    let symbolname  = $(elt).parent()[0].innerText;
    let symbol      = solution.CurrentOptionTerminal.PG.GetSymbolFromName(symbolname);

    let tabindex = sb.tab_delete (optioncontracttab, symbolname);    
    
    if (tabindex < 0) {
        OptionCloseSymbol (symbol);
    } else {
        OptionCloseSymbol (symbol);

        symbolname = optioncontracttab.items[tabindex].item;
        symbol = solution.CurrentOptionTerminal.PG.GetSymbolFromName (symbolname);
        Option_SelectSymbol(symbol)
    }
}

function OptionCloseSymbol (symbol) {
    if (!symbol) {
        return null;
    }

    sb.tab_delete (optioncontracttab, symbol.Name);    
    sb.tab_delete (optionordertab, symbol.Name);    
}

function OptionRemoveSymbol (symbol) {    // return index of the next to be selected
    let terminal        = solution.CurrentOptionTerminal;
    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];

    let symbolindex =  terminal.PG.GetSymbolIndexFromName(symbol.Name) ;

    sb.table_removechild(currencytable, symbolindex)
   
    OptionCloseSymbol(symbol);
    
    terminal.PG.RemoveSymbol(symbol);

    let nextindex = -1;

    if (symbolindex == currencytable.rows.length) {    // last one select previous
        if (currencytable.rows.length == 1) {
            nextindex = -1;
            return;                                             // nothig to do
        }
        else {
            nextindex = symbolindex -1;
        }
    } else {
            nextindex = symbolindex;  // returns the same already deleted
    }

    let nextsymbol = terminal.PG.Symbols[nextindex];
    Option_SelectSymbol(nextsymbol)      

}

function option_displayterminal(terminal, Symbol) {
  
    Symbol.Period = P_D1;

//    if (!sb.tab_finditem (optioncontracttab, Symbol.Name)) {
        OptionAddSymbol(terminal, Symbol);
 //   }

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;     

    if (symbolcanvas.Updated == false) {
        GChartPanel_Update (terminal);
    }
    
    if (!symbolcanvas.CurrentSymbol) {
        OptionSelectPeriod(solution.CurrentOptionTerminal, Symbol, Symbol.Period);
        Option_SelectSymbol(Symbol);
    }
}

function OptionOpenSymbol (symbol){
    if (!symbol) {
        return null;
    }

    let name = symbol.Name;

    if (sb.tab_finditem (optioncontracttab, name)) {    
        return 1;   // force is set to 1
    }

    var ordertabitem    = {id: name,   item: name,  type: 'link', roleid: 'optionordertabcontent',    items: [optionorderpanel],   events: {onclick:"onclick_optionsymboltab(this)"}}           
    var contracttabitem = {id: name,   item: name,  type: 'link', roleid: 'optioncontracttabcontent', items: [optionmainpanel],  onclose: 'onclick="onclick_SymbolCloseTabItem(this, event)"', events: {onclick:"onclick_optionsymboltab(this)"}}           
    

    sb.tab_additem (optioncontracttab, contracttabitem);
    sb.tab_additem (optionordertab, ordertabitem);   
    return 0;
}

function OptionAddSymbol(terminal, symbol) {



    currency_addsymbol (terminal, symbol);

  
  //  OptionOpenSymbol(symbol);

    return symbol;
}

function OptionSelectPeriod(terminal, Symbol, Period, async) {
    if (!terminal || !Symbol) {
        return;
    }

    let symbolcanvas = solution.GetCanvasFromTerminal(terminal);

    if (!symbolcanvas) {
        return;    
    }        
    if (async == undefined) {
        async = true;    
    }

    let rootid = rootid_fromcanvas(symbolcanvas.ID);
  
    if (symbolcanvas.CurrentPeriod != null && symbolcanvas.CurrentPeriod != Period) {
        Symbol.xextents[Period] = null;
    }
        
    symbolcanvas.CurrentPeriod = Period;

    sb.group_select ('#' + rootid + ' .chartpanel  #' + Period) ; 

    if (!Symbol.WaitHistory[Period] && Symbol.chartData[Period].length == 0) {
        OnGetHistory(terminal, Symbol, Period, Symbol.NbrCandles[Period], Symbol.NbrCandles[Period] + CANDLES_TOLOAD, async);
    } else {
        Chart_Draw(solution.CurrentOptionTerminal);
    }
}

function Option_SelectSymbol(symbol, force) {

    if (!symbol) {
        return;
    }
    let terminal        = solution.CurrentOptionTerminal;
    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];

    force = OptionOpenSymbol(symbol);
    
    let symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    
    if (!symbolcanvas) return;      
    
    if (!force && symbolcanvas.CurrentSymbol == symbol)
        return;
    
    symbolcanvas.CurrentSymbol = symbol;

    OptionSelectPeriod (terminal, symbol, symbolcanvas.CurrentPeriod);
    ChartPanel_Update(symbolcanvas) ;    

    OptionUpdateOrderPanel ('optionorderpanel', symbol);

    let name = symbol.Name;

    sb.tab_select (optioncontracttab,   name);
    sb.tab_select (optionordertab,   name);

    var index = terminal.PG.GetSymbolIndexFromName(name);   
     
    currency_selectsymbol(terminal, symbol);
    
    $('#boxsidebar_optionsummary .sb_sidebarheadertitle').html(name);


    SummaryPanel_Update(summarytable, symbol);

    PriceGroup_Update (symbolcanvas, symbol);     

    ContractsPanel_Update (symbol);        
}


function OrderPanel_Update (entity, righttype, type) {
    if (entity == null) {
        return;
    }
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (righttype.value == 'Stock') {
        let symbol = entity;

        OptionSetRightType ({value : "Stock"});    
    } else {
        let symbol = symbolcanvas.CurrentSymbol;        
        let contract = entity;
        let strike = contract.summary.strike;
        let expiry = contract.summary.expiry;
        let right  = contract.summary.right;
    
        OptionSetRightType(righttype, right + strike.toString()+expiry);
        OptionSetOrderType(righttype, (type ? type : Symbol.TradeOrder));
    }
    OptionOrderPanel_Show(true);  

}

function OnOptionOrder() {
    
    var terminal = solution.CurrentOptionTerminal;
    var PG = terminal.PG;
    if (solution.UserId == "0") {
//        TreatInfotionpanel', 'red');
//        return;
    }
    
    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;    
    var Symbol = symbolcanvas.CurrentSymbol;    
    
    var size;
    var values = [];
    
    if (Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) {
        size    = +document.getElementById("ContractVolume").value;
    }
    else {
        size    = +('-' + document.getElementById("ContractVolume").value);
    }
 
    var recid  = document.getElementById("selectcontracts").value;
    var price  = +document.getElementById("ContractEntryValue").value;    

    values[0] = recid;
    values[1] = price;
    values[2] = size;
    values[3] = Symbol.Name;

    OptionTreatData (values);
    
    if (solution.UserId != "0") {
        terminal.Save();
    }    
    
}
//------------------------------------------------------------ OPTION ORDER PANEL ----------------------------------------------------------

function OptionOrderPanel_Show(show) {
    sb.box_toggle ('boxoptionorderpanel', show);     
}

function ondblclick_optionordersrow(elt, event) {
    if (!solution.CurrentOptionTerminal) return;
    var PG = solution.CurrentOptionTerminal.PG;

    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];

    var symbolname  = sb.table_getcellcontent (optionorderstable, rowindex, 'MSymbol');

    var symbol = PG.GetSymbolFromName(symbolname);
    if (!symbol) return;                    
    
    Option_SelectSymbol(symbol);
}

function OptionOrderPanel () {
    var content     = '';
    content +=     
'   <div class="sb_buttongroup">' +
'       <button id ="SymbolBuyType" class="sb_button" onmousedown="OptionSetOrderType(this, \'BUY\')" >BUY</button>' + 
'       <div id = "bid"></div> ' + 
'       <div id = "bidask">/</div>' + 
'       <div id = "ask"></div>' + 
'       <button id ="SymbolSellType" class="sb_button" onmousedown="OptionSetOrderType(this,  \'SELL\')" >SELL</button>' + 
'   </div>' +            
'   <div class="sb_bodygroup">' + 
'       <div class="sb_formgroup">' +
'           <label>Trade Type</label>' + 
'           <select id="traderighttype" class="form-control" onchange="OptionSetRightType (this)" >' + //(Symbol.RightType == TRADE_CALL ?  selected : '')                
'               <option value="Stock"' + '' + '>Stock</option>' + 
'               <option value="Call"' + '' + '>Call</option>' + 
'               <option value="Put"' + '' + '>Put</option>' + 
'           </select>' + 
'       </div>' + 
'       <div class="sb_formgroup">' +      
'           <label id="tradetype">Stock</label>' + 
'           <select id="selectcontracts" class="form-control" onchange="OptionSelectContract (this)" >' +
'               <option value="Symbol.Name"></option>' + 
'           </select>' + 
'       </div>' +
'       <div class="sb_formgroup">' +
'           <label>Size</label>' + 
'           <input id = "ContractVolume" class="form-control" type="number" min="1" step="1", id ="svolume"; onchange="SetSLTP (this, \'VOL\')"; value="' + 'tradetypevalue' + '">' +
'       </div>' + 
'       <div class="sb_formgroup">' +
'           <label>Price</label>' +             
'           <input id = "ContractEntryValue" class="form-control" type="number", min="0" step="' + 'entrystep' + '",  id ="ssl";  value:' + 'entryvalue' + '>'+ 
'       </div>' +
'   </div>' +
'   <div class="sb_buttongroup">' + 
'       <button id="tradesubmit" class="sb_button" name="tradesubmit"    type="submit"' + 'submitorder' + ' onclick="OnOptionOrder();OptionSetOrderType(this, \'CANCEL\')">Submit</button>' + 
'       <button id="tradecancel" class="sb_button" name="tradecancel"    type="submit"' + 'submitorder' + ' onclick="OptionSetOrderType(this, \'CANCEL\')" >Cancel</button>' +
'   </div>';
    return content;
}

function OptionSetOrderType(e, type) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;    
    var Symbol = symbolcanvas.CurrentSymbol;
    
    let id= 'optionorderpanel';

    if (type == 'CANCEL') {
        Symbol.TradeOrder = -1;

        $('#' + id + ' #tradesubmit').attr('disabled',  true);
        $('#' + id + ' #tradecancel').attr('disabled',  true);      
        $('#' + id + ' #SymbolBuyType').attr("style", "color: var(--theme-button-color); background-color: var(--theme-button-bg-color);");        
        $('#' + id + ' #SymbolSellType').attr("style", "color: var(--theme-button-color); background-color: var(--theme-button-bg-color);");        
        
        $('#' + id + ' #ContractVolume').val('');
        $('#' + id + ' #ContractEntryValue').val('');

    } else
    if (type == 'BUY' || type == 'BUYSTOP' || type == 'BUYLIMIT') {
        if (type == 'BUY')      Symbol.TradeOrder = OP_BUY;
        if (type == 'BUYSTOP')  Symbol.TradeOrder = OP_BUYSTOP;
        if (type == 'BUYLIMIT') Symbol.TradeOrder = OP_BUYLIMIT;

        $('#' + id + ' #tradesubmit').attr('disabled',  false);
        $('#' + id + ' #tradecancel').attr('disabled',  false);           
        $('#' + id + ' #SymbolBuyType').attr("style",  'color: var(--theme-main-color); background-color:' + theme_buy);        
        $('#' + id + ' #SymbolSellType').attr("style", 'color: var(--theme-button-color); background-color: var(--theme-button-bg-color);');        


        if (Symbol.RightType == TRADE_STOCK) {
           
            if (Symbol.BuyEntry == 0){
                $('#' + id + ' #ContractEntryValue').val(Symbol.Ask);
            } else {
                $('#' + id + ' #ContractEntryValue').val(Symbol.BuyEntry);
            }
                
            if (Symbol.BuyVolume == 0) {
                $('#' + id + ' #ContractVolume').val('100');
            } else { 
                $('#' + id + ' #ContractVolume').val(Symbol.BuyVolume);
            }
        }


    } else
    if (type == 'SELL' || type == 'SELLSTOP' || type == 'SELLLIMIT') {
        if (type == 'SELL')      Symbol.TradeOrder = OP_SELL;
        if (type == 'SELLSTOP')  Symbol.TradeOrder = OP_SELLSTOP;
        if (type == 'SELLLIMIT') Symbol.TradeOrder = OP_SELLLIMIT;


        $('#' + id + ' #tradesubmit').attr('disabled',  false);
        $('#' + id + ' #tradecancel').attr('disabled',  false);           
        $('#' + id + ' #SymbolSellType').attr("style",  'color: var(--theme-main-color); background-color:' + theme_sell);        
        $('#' + id + ' #SymbolBuyType').attr("style", 'color: var(--theme-button-color); background-color: var(--theme-button-bg-color);');    


        if (Symbol.RightType == TRADE_STOCK) {
           
            if (Symbol.BuyEntry == 0){
                $('#' + id + ' #ContractEntryValue').val(Symbol.Ask);
            } else {
                $('#' + id + ' #ContractEntryValue').val(Symbol.SellEntry);
            }
                
            if (Symbol.BuyVolume == 0) {
                $('#' + id + ' #ContractVolume').val('100');
            } else { 
                $('#' + id + ' #ContractVolume').val(Symbol.SellVolume);
            }
        }        
    }
    Chart_Draw(solution.CurrentOptionTerminal);
}

function OptionUpdateOrderPanel (id, Symbol) {
    var color;
    $('#' + id + ' #bid').html(Symbol.Bid);
    $('#' + id + ' #ask').html(Symbol.Ask);
}


function OptionSetRightType(e, contract) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;    
    
    var Symbol = symbolcanvas.CurrentSymbol;

    let id = 'optionorderpanel'

    if (e.value == "Stock") {

        Symbol.RightType = TRADE_STOCK;

        FillOption (Symbol, "Stock");
         $('#' + id + ' #ContractVolume').attr('step', '100');
         $('#' + id + ' #ContractVolume').attr('max',  '100000');
         $('#' + id + ' #ContractEntryValue').attr('step',  '0.50');

        OptionSelectContract();

    } else
    if (e.value == "Call") {
        if(Symbol.RightType == TRADE_CALL) {
            if (contract) {
                $('#' + id + ' #selectcontracts option[value="' + contract + '"]').prop('selected', true);
            }
        }
        else 
        if(Symbol.RightType == TRADE_PUT) {
            if (!contract) {                                                                            // find opposite
                var recid = document.getElementById("selectcontracts").value;
                contract = 'C' + recid.substring (1);
            }
            FillOption (Symbol, "C");
            $('#' + id + ' #selectcontracts option[value="' + contract + '"]').prop('selected', true);
        }
        else {               
            $('#' + id + ' #ContractVolume').attr('step', '1');
            $('#' + id + ' #ContractVolume').attr('max',  '1000');
            $('#' + id + ' #ContractEntryValue').attr('step',  '0.01');      // Stock 
            FillOption (Symbol, "C");

            if (contract) {
                $('#' + id + ' #selectcontracts option[value="' + contract + '"]').prop('selected', true);
            }
        }
        Symbol.RightType = TRADE_CALL;
        OptionSelectContract('C');
    } else
    if (e.value == "Put") {
        if(Symbol.RightType == TRADE_PUT) {
            if (contract) {
                $('#' + id + ' #selectcontracts option[value="' + contract + '"]').prop('selected', true);
            }
        }
        else 
        if(Symbol.RightType == TRADE_CALL) {
            if (!contract) {                                                       // find opposite
                var recid = document.getElementById("selectcontracts").value;
                contract = 'P' + recid.substring (1);
            }
            FillOption (Symbol, "P");
            $('#' + id + ' #selectcontracts option[value="' + contract + '"]').prop('selected', true);
        }
        else {                      
            $('#' + id + ' #ContractVolume').attr('step', '1');
            $('#' + id + ' #ContractVolume').attr('max',  '1000');
            $('#' + id + ' #ContractEntryValue').attr('step',  '0.01');   // Stock 
            FillOption (Symbol, "P");
            if (contract) {
                $('#' + id + ' #selectcontracts option[value="' + contract + '"]').prop('selected', true);
            }
        }
        Symbol.RightType = TRADE_PUT;
        OptionSelectContract('P');
    }
    $('#' + id + ' #traderighttype option[value="' + e.value + '"]').prop('selected', true);
    $('#' + id + ' #tradetype').html(Symbol.RightType == TRADE_STOCK ? 'Stock' : (Symbol.RightType == TRADE_CALL ? 'Call' : 'Put'));
    Chart_Draw(solution.CurrentOptionTerminal);
}

function OptionSelectContract(e) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;    
    var Symbol = symbolcanvas.CurrentSymbol;


    let id = 'optionorderpanel'

    if (!e) {
        $('#' + id + ' #bid').html(Symbol.Bid);
        $('#' + id + ' #ask').html(Symbol.Ask);        
        $('#' + id + ' #ContractVolume').val('100')
        $('#' + id + ' #ContractEntryValue').val(Symbol.Last);       
        $('#' + id + ' #selectcontracts').attr("style", "color: var(--theme-main-color)!important");           
        return;
    }

    var value = document.getElementById("selectcontracts").value;
    var PG = solution.CurrentOptionTerminal.PG;
    
    var recid = value;
    var right = recid.charAt(0);
    var expiry = recid.substring (recid.length - 8);
    var strike = recid.substring (1, recid.length - 8);
    var contract = PG.GetContractFromStrikeExpiry (Symbol, right, strike, expiry);
    Symbol.CurrentContract = contract;
    
    
    var expiryindex = GetExpiryIndex(Symbol, expiry);     
    $('#' + id + ' #selectcontracts').attr("style", "color:" +  RandomColors[expiryindex] + " !important");        

    $('#' + id + ' #bid').html( contract.value.bid);
    $('#' + id + ' #ask').html(contract.value.ask);        
    $('#' + id + ' #ContractVolume').val('1')
    $('#' + id + ' #ContractEntryValue').val(contract.value.lastPrice);       

}


//------------------------------------------------------------------ CONTRACTS PANEL  ------------------------------------------------  


function ondblclick_optioncontractsrow (elt, event) {
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    let symbol       = symbolcanvas.CurrentSymbol;
    let eltpos       = document.elementFromPoint(event.pageX, event.pageY);
    let splitelt     = eltpos.id.split('_')
    let eltindex     = splitelt[2];
    
    let right = eltindex < 9 ? 'C' : eltindex > 10 ? 'P' : 'Stock';    

    let trid        = event.currentTarget.id;
    let rownumber   = splitelt[1];

    let price        = symbol.Last;
    let strike       = sb.table_getcellcontent (optioncontractstable, rownumber, 'Strike');
    let rate         = CurrentRate;    
    let expiry       = sb.table_getcellcontent (optioncontractstable, rownumber, 'Expiry');
    let nbrdays      = GetDaysToExpiration (expiry);    
    let dividend     = CurrentDividend;    
    let c_impliedVol = sb.table_getcellcontent (optioncontractstable, rownumber, 'C Volatility (in %)');
    let p_impliedVol = sb.table_getcellcontent (optioncontractstable, rownumber, 'P Volatility (in %)');    

    let volatility_c = (+c_impliedVol ? c_impliedVol : p_impliedVol);
    let volatility_p = (+p_impliedVol ? p_impliedVol : c_impliedVol);
    
    if (!volatility_c) volatility_c = "10";
    if (!volatility_p) volatility_p = "10";

    sb.box_toggle ('boxoptioncalculatorpanel', 1);   
    calculate_from_contract (price, strike, rate, nbrdays, dividend, volatility_c, volatility_p);    

    let contract = symbolcanvas.PG.GetContractFromStrikeExpiry (symbol, right, strike, expiry);
    let righttype = {}
    righttype.value = right == 'C' ? 'Call' : (right == 'P' ? 'Put' : 'Stock');

    OrderPanel_Update (right == 'Stock' ? symbol : contract, righttype);
}

function ondragstart_optioncontractsrow(elt, event, tableid) {
    
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    let symbol       = symbolcanvas.CurrentSymbol;
    let eltpos       = document.elementFromPoint(event.pageX, event.pageY);
    let splitelt     = eltpos.id.split('_')
    let eltindex     = splitelt[2];
    
    let right = eltindex < 9 ? 'C' : eltindex > 10 ? 'P' : 'CP';

    let trid        = event.currentTarget.id;
    let rownumber   = splitelt[1];
    let expiry      = sb.table_getcellcontent(optioncontractstable, rownumber, 'Expiry');
    let expiryindex = GetExpiryIndex(symbol, expiry);     

    $('#' + trid).css("background-color",  symbol.Expiries[expiryindex].color);
    $('#' + trid).css("color", "white");
    event.dataTransfer.setData("text/plain", 'selectcontract_' + right + '_' + rownumber);
}


function ContractsPanel_Filter (symbol) {

    if (!defined(symbol.contractsarray)) {
        return;
    }

    var contractsarray = [];
    var greeksarray = [];

    for (var j= symbol.contractsarray.length-1; j >=0; j--) {
        var expiry = symbol.contractsarray[j][10];
        var expiryindex = GetExpiryIndex(symbol, expiry);    
        
        var strike = symbol.contractsarray[j][9];
        var strikeindex = GetStrikeIndex(symbol, strike); 
        if (strikeindex == -1) {
            continue;
        }
        if (symbol.Expiries[expiryindex].checked && symbol.Strikes[strikeindex].checked) {
            contractsarray.push (symbol.contractsarray[j]);
            greeksarray.push (symbol.greeksarray[j])
        }             
    }

    sb.table_setrows (optioncontractstable, contractsarray);
    sb.table_setrows (optiongreekstable, greeksarray);

    var inthemoney = closest (symbol.Last, symbol.Strikes);
    var index = symbol.Strikes.indexOf(inthemoney);

    for (var rowindex= 0; rowindex < contractsarray.length; rowindex++) {
        var rowexpiry   = sb.table_getcellcontent (optioncontractstable, rowindex, 'Expiry');
        var rowstrike   = sb.table_getcellcontent (optioncontractstable, rowindex, 'Strike');
        var expiryindex = GetExpiryIndex(symbol, rowexpiry);  
        sb.table_setcellcolor (optioncontractstable, rowindex, "Expiry",  symbol.Expiries[expiryindex].style.split(":")[1]);
        sb.table_setcellcolor (optiongreekstable,    rowindex, "Expiry",  symbol.Expiries[expiryindex].style.split(":")[1]);
        
        if (contractsarray[rowindex][9] <= inthemoney.item) {
            
            for (var j = 0; j < 9; j++) {
                $('#' + optioncontractstable.id +'_' + rowindex + '_' + j).css ('background', 'var(--theme-select-bg-color)');
            }

        } else 
        if (contractsarray[rowindex][9] > inthemoney.item) {
            
            for (var j = 11; j < optioncontractstable.columns.length; j++) {
                $('#' + optioncontractstable.id +'_' + rowindex + '_' + j).css ('background', 'var(--theme-select-bg-color)');
            }     
            
        }  
        if (contractsarray[rowindex][9] == inthemoney.item) {
            
            $('#optioncontractstable_' + rowindex).css('background', 'var(--theme-bar-bg-color)');           
            sb.table_setcellcolor (optioncontractstable, rowindex, "Strike",  'red');
            
            $('#optiongreekstable_' + rowindex).css('background', 'var(--theme-bar-bg-color)');           
            sb.table_setcellcolor (optiongreekstable, rowindex, "Strike",  'red');

        };
    }        
  
    $('#' + optioncontractstable.id +' tr').attr('draggable', 'true');
    $('#' + optioncontractstable.id +' tr').attr('ondragstart', 'ondragstart_optioncontractsrow(this, event, "' + optioncontractstable.id + '")');
    
    $('#' + optiongreekstable.id +' tr').attr('draggable', 'true');
    $('#' + optiongreekstable.id +' tr').attr('ondragstart', 'ondragstart_optioncontractsrow(this, event, "' + optioncontractstable.id + '")');
}

function ContractsPanel_Update (symbol) {
    if (symbol.NbrContractRead != symbol.NbrContracts) {
        return;
    }

    $('#contractspanel .alert-warning').remove();
    //here
    if (symbol.NbrContracts == 0) {  // symbol not found

        $('#optiontoolbarspanel').css ('display', 'none')
        $('#righttabs').css ('display', 'none')
        $('#contractspanel').prepend(sb.render(ReturnWarningALert('No contracts for this symbol')))
        return;
    }       
    $('#optiontoolbarspanel').css ('display', '')
    $('#righttabs').css ('display', '')

    OptionToolbarsPanel_Update (symbol);
    ContractsPanel_Filter(symbol);
}

//------------------------------------------------------------ SYMBOL SUMMARY PANEL ----------------------------------------------------------

const summary_array = [
    //"ask",
    //"askSize",
    "averageDailyVolume3Month",
    "averageDailyVolume10Day",
    //"bid",
    //"bidSize",
    "bookValue",
    //"currency",
    //"esgPopulated",
    //"exchange",
    //"exchangeDataDelayedBy",
    //"exchangeTimezoneName",
    //"exchangeTimezoneShortName",
    "fiftyDayAverage",
    "fiftyDayAverageChange",
    "fiftyDayAverageChangePercent",
    "fiftyTwoWeekHigh",
    "fiftyTwoWeekHighChange",
    "fiftyTwoWeekHighChangePercent",
    "fiftyTwoWeekLow",
    "fiftyTwoWeekLowChange",
    "fiftyTwoWeekLowChangePercent",
    "dividendDate",
    "earningsTimestamp",
    "earningsTimestampStart",
    "earningsTimestampEnd",
    "trailingAnnualDividendRate",
    "trailingPE",
    "dividendRate",
    "trailingAnnualDividendYield",
    "dividendYield",
    "averageAnalystRating"
    //"firstTradeDateMilliseconds",
    //"fullExchangeName",
    //"gmtOffSetMilliseconds",
    //"language",
    //"longName",
    //"market",
    //"marketState",
    //"messageBoardId",
    //"postMarketChange",
    //"postMarketChangePercent",
    //"postMarketPrice",
    //"postMarketTime",
    //"priceHint",
    //"quoteSourceName",
    //"quoteType",
    //"region",
    //"regularMarketChange",
    //"regularMarketChangePercent",
    //"regularMarketDayHigh",
    //"regularMarketDayLow",
    //"regularMarketDayRange",
    //"regularMarketOpen",
    //"regularMarketPreviousClose",
    //"regularMarketPrice",
    //"regularMarketTime",
    //"regularMarketVolume",
    //"shortName",
    //"sourceInterval",
    //"symbol",
    //"tradeable",
    //"trailingThreeMonthNavReturns",
    //"trailingThreeMonthReturns",
    //"triggerable",
    //"twoHundredDayAverage",
    //"twoHundredDayAverageChange",
    //"twoHundredDayAverageChangePercent",
    //"ytdReturn"
] 

function SummaryPanel_Update (table, Symbol) {
    if (!Symbol) return;
  
    var quote = Symbol.Quote;

    var json = JSON.stringify(quote);      

    var values = json.substring(1).split(",");
    
    var rows = [];

    for (var i = 0; i < values.length; i++) {
        var elts = values[i].split(":");
        elts[0] = elts[0].replace(/"/g, '');
        if (summary_array.includes(elts[0])) {

            if (elts[0] == 'earningsTimestamp' ||
                elts[0] == "earningsTimestampStart" ||
                elts[0] == "earningsTimestampEnd" ||
                elts[0] == 'dividendDate') {
                elts[1] = new Date (elts[1] * 1000);
            }
            if (elts[0] == 'sharesOutstanding') {
                elts[1] = formatNumber(1*elts[1], 2);        
            }
            rows.push(['<div class="' + elts[0] + '">' + elts[0] + '</div>', elts[1]]); 
        }
   
    }
    sb.table_setrows (table, rows)

// header
    $('#summary_header_panel #summary_symbolname label').html(Symbol.PName)
    let symbolcontent = ""; 
    let symbolchange = "";
    let symbolchangepercent = "";
    let color;

    if (Symbol.PriceChange > 0) {
        symbolarrow = '<i class="fa fa-arrow-up"></i>';
        symbolchange = '+' + (+Symbol.PriceChange).toFixed(Symbol.Digits);
        symbolchangepercent = Symbol.PriceChangePercent ? '(' + Symbol.PriceChangePercent.toFixed(2)  + '%)' : '';

        symbolcontent = symbolchange + ' ' + symbolchangepercent; 
        color = theme_bull            
 
    } 
    else 
    if (Symbol.PriceChange < 0) {
        symbolarrow = '<i class="fa fa-arrow-down"></i>';
        symbolchange =  (+Symbol.PriceChange).toFixed(Symbol.Digits);
        symbolchangepercent =  Symbol.PriceChangePercent ? '(' + Symbol.PriceChangePercent.toFixed(2) + '%)' : '';

        symbolcontent = symbolchange + ' ' + symbolchangepercent;   
        color = theme_bear;          
    }    
    $('#summary_header_panel #summary_symbolprice label').html(Symbol.Last + ' ' + symbolcontent)
    $('#summary_header_panel #summary_symbolprice label').css('color', color);              
}

   
   
function RoundTo(v, d) {
	return Math.round(v * d)/d;
}

function SearchInGrid (grid) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    var symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;
    
    var SelectedStrikes = GetSelected (symbol.Strikes);
    var SelectedExpiries = GetSelected (symbol.Expiries);            

    grid.searchData = [];
    
    var search =grid.getSearch('Strike');                
    for (var i = 0; i < SelectedStrikes.length; i++) {
        var field = {field: 'Strike', value: SelectedStrikes[i], type: 'int', operator:'is'};
       grid.searchData.push($.extend(true, {}, search, field));
    }

   grid.last.field  = "all";
   grid.last.search = "";
   grid.last.multi  = true;
   grid.last.logic  = "OR";
   grid.localSearch();

   grid.searchData = [];
    var search =grid.getSearch('Strike');                

    search =grid.getSearch('Expiry');                

    for (var i = 0; i < SelectedExpiries.length; i++) {
        field = {field: 'Expiry', value: SelectedExpiries[i], operator:'is'};
       grid.searchData.push($.extend(true, {}, search, field));
    }
   grid.localSearch(true,grid.last.searchIds);
} 

function GetStrikeIndex (Symbol, strike) {
    for (var i = 0; i <  Symbol.Strikes.length; i++) {
        if (Symbol.Strikes[i].item == strike)
            return i;
    }
    return -1;
    
}

function GetExpiryIndex (Symbol, expiry) {
    for (var i = 0; i <  Symbol.Expiries.length; i++) {
        if (Symbol.Expiries[i].item == expiry)
            return i;
    }
    return -1;
    
}

function GetStrikesFromExpiry (symbol, expiry, right) {
    var strikes = [];
    for (var i = 0; i < symbol.Contracts.length; i++) {
        var contract = symbol.Contracts[i];
        if (contract.summary.expiry == expiry && (!right || contract.summary.right == right))
            strikes.push (symbol.Strikes [GetStrikeIndex (symbol, contract.summary.strike)]);
    }
    return strikes;
}

function GetExpiriesFromStrike (symbol, strike, right) {
    var expiries = [];
    for (var i = 0; i < symbol.Contracts.length; i++) {
        var contract = symbol.Contracts[i];
        if (contract.summary.strike == strike && (!right || contract.summary.right == right))
            expiries.push (symbol.Expiries [GetExpiryIndex (symbol, contract.summary.expiry)]);
    }
    return expiries;
}


function SetChartVariation(symbolcanvas, on) {
    if (on) {
        symbolcanvas.AddIndicator(HIGH);
        symbolcanvas.AddIndicator(LOW);
        symbolcanvas.AddIndicator(OPEN);
        symbolcanvas.AddIndicator(CLOSE);
    } else {
        symbolcanvas.RemoveIndicator(HIGH);
        symbolcanvas.RemoveIndicator(LOW);
        symbolcanvas.RemoveIndicator(OPEN);
        symbolcanvas.RemoveIndicator(CLOSE);
    }
}

function tooltipProfit(data, ys) {

    let color = 'gray';

    return ({ currentItem, xAccessor }) => {
        var maxhigh = 0;
        var maxlow = 0;
        var avhigh = 0;
        var avlow = 0;
        
        var percenthigh = (currentItem.high /currentItem.open)*100 - 100;
        var percentlow = (currentItem.low /currentItem.open)*100 - 100;


        
        for (var i = data.length - 1; i > data.length - variation; i--) {
                var high = data[i].high;
                var open = data[i].open;
                var low = data[i].low;
                
                avhigh +=  high - open;
                avlow  +=  open - low;
                
                maxhigh = Math.max (maxhigh, high - open)
                maxlow = Math.max (maxlow, open - low)
        }       
        avhigh = avhigh / variation;
        avlow  = avlow  / variation;
        
		return {
			x: "VARIATION Period " +  variation + "\n",
			y: [
				{
					label: "Date/Open",
					value: dateFormat(xAccessor(currentItem)) + "  /  " + currentItem.open,
					stroke: color

				},

				{
					label: "Variation from Open To High",
					value: (currentItem.high - currentItem.open && numberFormat(currentItem.high - currentItem.open)) + "  " + (percenthigh && numberFormat(percenthigh)) + " %",
					stroke: color

				},
				{
					label: "Variation from Open To Low",
					value: (currentItem.open - currentItem.low && numberFormat(currentItem.open - currentItem.low))    + "  " +  (percentlow && numberFormat(percentlow)) + " %",
					stroke: color

				},
				{
					label: "Maximum Variation from Open To High",
					value: maxhigh && numberFormat(maxhigh),
					stroke:color

				},
				{
					label: "Maximum Variation from Open To Low",
					value: maxlow && numberFormat(maxlow),
					stroke: color
				},
				{
					label: "Average Variation from Open To High",
					value: avhigh && numberFormat(avhigh),
					stroke:color

				},
				{
					label: "Average Variation from Open To Low",
					value: avlow && numberFormat(avlow),
					stroke: color
				},

				{
					label: "SHORT STRANGLE SELL CALL",
					value:  (currentItem.open + maxhigh) && numberFormat(currentItem.open + maxhigh),
					stroke: color

				},
				{
					label: "SHORT STRANGLE SELL PUT",
					value:  currentItem.open - maxlow && numberFormat(currentItem.open - maxlow),
					stroke: color

				}
			]
				.concat(
					ys.map(each => ({
						label: each.label,
						value: each.value,
						stroke: each.stroke
					}))
				)
				.filter(line => line.value)
		};
	};
}


var TrackOption = function (event, itempos, yValue, mouseXY, fulldata, state) {
    if (!ShowOptionSignals) 
        return;


        
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;
    
    var PG       = solution.CurrentOptionTerminal.PG;
    var symbol   = symbolcanvas.CurrentSymbol; 
    var data     = symbol.chartData[symbolcanvas.CurrentPeriod];
    if (data.length == 0)
        return;
    var lastdate =  data[data.length - 1].date;
    
	
	
	var x        = mouseXY[0];
	var y        = mouseXY[1] - state.chartConfig[0].origin[1];
    var nowdate  = new Date();
	var bardate  = state.xScale.invert(x);
	var price    = state.chartConfig[0].yScale.invert(y);

   // if (bardate < lastdate) 
    //    price =  bardate.close; 


    var totalprofit = 0;
    var totalmaxprofit = 0;    
    var tracevalue = "";
    var stocktracevalue = "";

    var profit = 0;
    var percent;



    
    for (var i = PG.Orders.length - 1; i >= 0; i--) {
        var order = PG.Orders[i];

        if (order.MSymbol != symbol.Name) continue;

        var recid =  order.Number;
        var right; 
        var expiry;
        var strike;
        var contract;
        var volatility;
        var dividend  ;
        var rate      ;
        var nbrdays   ;
        var theorical_price;
        var delta;
        var maxprofit = 0;        



        if (order.MSymbol == order.Symbol) { // STOCK
            percent = 1;
            right = "S";
        }            
        else {
            right = recid.charAt(0);
            expiry = recid.substring (recid.length - 8);
            strike = +recid.substring (1, recid.length - 8);
            percent = 100;
        }


        if (order.DataType == MODE_HISTORY) {
            profit = +((order.CPrice - order.OPrice) * percent * order.Size).toFixed(2);
            maxprofit = profit;
            if (right == 'P') {
                tracevalue  =   tracevalue + "\n" + 'PUT   : ' + strike  + ' Open Price : ' + order.OPrice +  ' Close Price ' + order.CPrice + ' Profit ' + profit; 
            }
            else
            if (right == 'C') {
                tracevalue  =  "\n" + 'CALL : ' + strike +  ' Open Price : ' + order.OPrice +  ' Close Price ' + order.CPrice  + ' Profit ' + profit  + tracevalue ; 
            }
            else {
                stocktracevalue  =   stocktracevalue + "\n" + 'STOCK   : ' + ''  + ' Open Price : ' + order.OPrice +  ' Close Price ' + order.CPrice + ' Profit ' + profit; 
            }

            totalprofit +=  profit;
            totalmaxprofit +=  maxprofit;
            continue;
        }    



        if (bardate.getTime() < +order.Time) {
            continue;
            profit = +((order.CPrice - order.OPrice) * percent * order.Size).toFixed(2);
            maxprofit = profit;
            if (right == 'S') {
                stocktracevalue  =   stocktracevalue + "\n" + 'STOCK   : ' + ''  + ' Open Price : ' + order.OPrice +  ' Close Price ' + order.CPrice + ' Profit ' + 0; 
            }
            else
            if (right == 'P') {
                tracevalue  =   tracevalue + "\n" + 'PUT   : ' + strike  + ' Open Price : ' + order.OPrice + ' Profit ' + 0; 
            }
            else {
                tracevalue  =  "\n" + 'CALL : ' + strike +   ' Open Price : ' + order.OPrice + ' Profit ' + 0  + tracevalue ; 
            }
            totalprofit +=  profit;
            totalmaxprofit +=  maxprofit;
            continue;
        }



        if (right == 'S') {
            profit = +((price - order.OPrice) * percent * order.Size);
            stocktracevalue  =   stocktracevalue + "\n" + 'STOCK   : ' + ''  + ' Open Price : ' + order.OPrice +  ' Close Price ' + order.CPrice + ' Profit ' + profit.toFixed(2); 
        }
        else {

            contract = PG.GetContractFromStrikeExpiry (symbol, right, strike, expiry);

            if (!contract)  {                       // order must be closed if not closed , find close prioce of the date of expiration, calculate option price, and close
                continue;
            } else {
                volatility =  parseFloat(contract.value.impliedVolatility);
                dividend   = CurrentDividend;
                rate       = CurrentRate;    
                nbrdays    = GetDaysToExpiration (expiry, bardate);
                theorical_price = 0;
                delta = 0;
                maxprofit = 0;
                volatility = 85;
            }

            if (right == 'P') {
                var put_price_greeks  = getCRROptionPriceAndGreeks(price,strike, volatility/100,rate/100, nbrdays/365, steps, dividend/100,true);
                theorical_price  = RoundTo(put_price_greeks[0],  1000);
    
                delta = RoundTo(put_price_greeks[1], 100000)
                profit = +((theorical_price - order.OPrice) * 100 * order.Size);
                if (profit > 0) 
                    maxprofit = +((0 - order.OPrice) * 100 * order.Size);
                else
                    maxprofit = profit;
                tracevalue  =   tracevalue + "\n" + 'PUT   : ' + strike + ' Days ' +  nbrdays + ' IPV : ' + volatility  + ' Open Price : ' + order.OPrice +  ' Price ' + theorical_price + ' Profit ' + profit.toFixed(2) + (maxprofit > 0 ? ' Max Profit ' + maxprofit.toFixed(2) : ''); 
            }
            else {
                var call_price_greeks = getCRROptionPriceAndGreeks(price,strike,volatility/100,rate/100, nbrdays/365, steps, dividend/100,false);
                theorical_price = RoundTo(call_price_greeks[0], 1000);
                delta = RoundTo(call_price_greeks[1], 100000)
                profit = +((theorical_price - order.OPrice) * 100 * order.Size);
                if (profit > 0) 
                    maxprofit = +((0 - order.OPrice) * 100 * order.Size);
                else
                    maxprofit = profit;
                tracevalue  =  "\n" + 'CALL : ' + strike + ' Days ' +  nbrdays + ' IPV : ' + volatility  + ' Open Price : ' + order.OPrice +  ' Price ' + theorical_price + ' Profit ' + profit.toFixed(2) + (maxprofit > 0 ? ' Max Profit ' + maxprofit.toFixed(2) : '')  + tracevalue ; 
            }
        }    
        totalprofit +=  profit;
        totalmaxprofit +=  maxprofit;

    }
    tracevalue = stocktracevalue + "\n------------------- " + "\n" + tracevalue;
    tracevalue += "\n" + "------------------- " + "\n";
    tracevalue += "PROFIT " + totalprofit.toFixed(2) + " MAX PROFIT " + totalmaxprofit.toFixed(2) +"\n";

    
    OptionSignalEditor.setValue(tracevalue, -1);
    
}

function OptionTreatHistory (terminal, symbol, period, values) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;
   
    var k = 0;
    if (solution.CurrentOptionTerminal.Type  == 'IB') {        
        var data = JSON.parse(values[2]); 
        var parseDate;
        if (period < P_D1) 
            parseDate = d3.timeParse("%Y%m%d  %H:%M:%S");
        else
            parseDate = d3.timeParse("%Y%m%d");
        for (var i = 0; i < data.length; i++) {
            k++;
            data[i].date = parseDate(data[i].date);
        }
//        data = data.map (parseData);  

        symbol.chartData[period]  = data;
        symbol.Digits = numDecimals(symbol.chartData[period][0].close); 
        symbol.Point = SymbolPoint(symbol.Digits);
        symbol.Last  = data[data.length - 1].close;
        
        SubmitSaveHistory (terminal.Folder, values[2], symbol.Name, PeriodName[period], '/php/save_symbolfile.php');
    }
    else
    if (solution.CurrentOptionTerminal.Type  == 'Yahoo') {
        var arr = values.responseText;        
        
        try {
            var data = JSON.parse(arr); 
        } catch(objError) {
            var e;
            if (objError instanceof SyntaxError) {
                e = objError.name;
            } else {
                e = objError.message;
            }            
            DisplayInfo(e, true, 'operationpanel', 'tomato');        
            LoaderChartHistory (false);    
            return;
        }    
        var PG = solution.CurrentOptionTerminal.PG;
        symbol = PG.GetSymbolFromName ( data.chart.result[0].meta.symbol);
        if (!symbol) return;
        
        
        var tab_close = data.chart.result[0].indicators.quote[0].close;
        var tab_open  = data.chart.result[0].indicators.quote[0].open;
        var tab_high  = data.chart.result[0].indicators.quote[0].high;
        var tab_low   = data.chart.result[0].indicators.quote[0].low;
        var tab_date  = data.chart.result[0].timestamp;
        var digits    = data.chart.result[0].meta.priceHint;
        symbol.Digits = digits; 
        symbol.Point = SymbolPoint(symbol.Digits);
        symbol.Last  = data.chart.result[0].meta.regularMarketPrice;


        var data = [];
        var k = 0;
        for (var i = 0; i < tab_date.length; i++) {
            
            if (!tab_open[i]) continue;
            k++;
            var open  = +tab_open[i].toFixed(symbol.Digits);
            var close = +tab_close[i].toFixed(symbol.Digits);
            var high  = +tab_high[i].toFixed(symbol.Digits);
            var low   = +tab_low[i].toFixed(symbol.Digits);
            
            
            data.push ({open: open, high: high, close: close, low: low, date: new Date(tab_date[i]*1000 )})                        
        }
    }

    symbol.NbrCandles[period] += k;
    symbol.WaitHistory[period] = false;
    symbol.chartData[period]  = data;
    
    LoaderChartHistory (false);    
    if (symbolcanvas.CurrentPeriod == period) 
        Chart_Draw(solution.CurrentOptionTerminal);
}

function OptionTreatCommand(solution, terminal, Line, values) {
    
    var reqid = +values[1];
    
    if (terminal != solution, terminal, Line, values.CurrentOptionTerminal && (values[0] != "INIT" && values[0] != "SYMBOL" && values[0] != "MM" && values[0] != "ENGINE" && values[0] != "COMPILE" && values[0] != "LOGIN")) return;
    
    if (values[0] == "LOGIN") {
        TreatLogin(solution, terminal, values);
    } else
    if (values[0] == "CONNECT") {
        TreatConnect(solution, terminal, values);
    } else    
    if (values[0] == "INIT") {
        TreatInit(solution, terminal, values);
    } else 
    if (values[0] == "HISTORY") {
        OptionTreatHistory(terminal, values);
    }    
    else
    if (values[0] == "CONTRACTDETAILS") {
        YahooTreatContract (terminal,values);
    }
    else
    if (values[0] == "PRICE") {
        if (+values[1] < 100)
            OptionTreatSymbol(terminal, values);
        else
            OptionTreatOption(solution, terminal, values);
    }    
    else
    if (values[0] == "SIZE") {
        if (+values[1] < 100) {
            
        }
        else
            OptionTreatOptionSize(solution, terminal, values);
    }    
    else
    if (values[0] == "TICKOPTIONCOMPUTATION") {
        OptionTreatComputation(solution, terminal, values);
    }
}

function IBTreatReception (solution, terminal, recmessage) {        
    if (!recmessage) return;
    
    if (recmessage.substring(0, 1) != ":") {
        console.log ("Receiveing strange on " + terminal.Name);
    }
    var index = recmessage.indexOf("*");
    var message = recmessage.substring(index + 1);
    var symbolname = recmessage.substring(1, index);
    
    
    terminal.LastRunningTime = Date.now();
    var output;
    var length = message.length;
    if (eval('terminal.' + symbolname + '!== undefined')) {
        if (message[length - 1] != "*") {
            eval('terminal.' + symbolname + ' = terminal.' + symbolname + ' + message');
            return;
        } else {
            output = eval('terminal.' + symbolname) + message;
        }
    } else {
        if (symbolname != "______") {
            eval('terminal.' + symbolname + ' = message');
        }
        output = message;
    }
    if (eval('terminal.' + symbolname)) eval('terminal.' + symbolname + ' = ""');

    var lines = output.split('*');
    length = lines.length;
    for (var j = 0; j < length; j++) {
        if (lines[j].length < 1) continue;
        var Line = lines[j];
        var values = Line.split('^');
        OptionTreatCommand(solution, terminal, Line, values);
    }
}
//-------------------------------------------------------------------------IB MODEL-------------------------------------------------------------------

function GetEltFromText (tab, elt) {
    for (var i = 0; i < tab.length; i++) {
        if (tab[i].text == elt)
            return tab[i];
    }
    return null;
}

function GetContractsFrom (symbol, from, value) {
    var contracts = [];
    for (var i = 0; i < symbol.Contracts.length; i++) {
        var pgcontractsummary = symbol.Contracts[i].summary;
        if (pgcontractsummary[from] == value)
            contracts.push (symbol.Contracts[i]);
    }    
    return contracts;    
}

function GetSelected (list) {
    var selected = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].checked)
            selected.push (list[i].text);
    }
    return selected;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const parseDate = d3.timeParse("%Y%m%d  %H:%M:%S");

function parseData(d) {
	d.date = parseDate(d.date);
	d.open = d.open;
	d.high = d.high;
	d.low = d.low;
	d.close = d.close;
	d.volume = d.volume;
	return d;
}


/*
            
            regularMarketChange: -0.26000023
            regularMarketChangePercent: -0.8757165
            regularMarketDayHigh: 29.96
            regularMarketDayLow: 29.13
            regularMarketDayRange: "29.13 - 29.96"
            regularMarketOpen: 29.4
            regularMarketPreviousClose: 29.69
            regularMarketPrice: 29.43
*/   


function getNextBusinessDay(date) {
  // Copy date so don't affect original
  date = new Date(+date);
  // Add days until get not Sat or Sun
  do {
    date.setDate(date.getDate() + 1);
  } while (!(date.getDay() % 6))
  return date;
}

function OptionTreatOption(solution, terminal, values) {
    var rreqid = +values[1];
    var reqid = rreqid - 1000;
    var price   = (+values[3]).toFixed(2);   ;

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    var Symbol = symbolcanvas.CurrentSymbol;
    if (!Symbol || Symbol.Contracts.length == 0) return;


    
    var optioncontract = Symbol.Contracts[reqid];      
    var strike = optioncontract.summary.strike;
    var expiry = optioncontract.summary.expiry;

    var srecid = strike.toString()+expiry;
    if (!optioncontract.value) {
        var option = new pgoption ("", "", "", "", "", "", "", "");
        optioncontract.value = option;

    }
    if (optioncontract.summary.right == 'P') {    
        if (values[2] == 'BID') {
            optioncontract.value.bid = (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {p_bidPrice : (+values[3]).toFixed(2)});              
        }
        else 
        if (values[2] == 'ASK') {
            optioncontract.value.ask = (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {p_askPrice : (+values[3]).toFixed(2)});          
        }
        else 
        if (values[2] == 'LAST') {
            optioncontract.value.lastPrice =  (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {p_price : (+values[3]).toFixed(2)});    
        }
        else 
        if (values[2] == 'CLOSE') {
            optioncontract.value.lastPrice =  (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {p_price : (+values[3]).toFixed(2)});    
        }
        else {
            console.log (values[2]);
        }
    }
    else {
        if (values[2] == 'BID') {
            optioncontract.value.bid = (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {c_bidPrice : (+values[3]).toFixed(2)});              
        }
        else 
        if (values[2] == 'ASK') {
            optioncontract.value.ask = (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {c_askPrice : (+values[3]).toFixed(2)});          
        }
        else 
        if (values[2] == 'LAST') {
            optioncontract.value.lastPrice =  (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {c_price : (+values[3]).toFixed(2)});    
        }    
        else 
        if (values[2] == 'CLOSE') {
            optioncontract.value.lastPrice =  (+values[3]).toFixed(2);
            w2ui['contractsgrid'].set(srecid, {p_price : (+values[3]).toFixed(2)});    
        }
        else {
            console.log (values[2]);
        }
    }
}

function OptionTreatOptionSize(solution, terminal, values) {
    var rreqid = +values[1];
    var reqid = rreqid - 1000;

    var size   = +values[3];

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);  
    var Symbol = symbolcanvas.CurrentSymbol;
    if (!Symbol || Symbol.Contracts.length == 0) return;


    
    var optioncontract = Symbol.Contracts[reqid];      
    var strike = optioncontract.summary.strike;
    var expiry = optioncontract.summary.expiry;
    var srecid = strike.toString()+expiry;
}


//-------------------------------------------------------- ORDERS -----------------------------------------------------------------------

function CloseExpired (Symbol, order,  right, strike, expiry) {
   
    var data = Symbol.chartData[P_D1];
    if (data.length == 0) 
        return false;
    
    
    var date = d3.timeParse("%Y%m%d%H%M")(expiry + "2200");    
    
    for (i = data.length -1 ; i >= 0; i--) {
        if (data[i].date.setHours (0,0,0,0) == date.setHours (0,0,0,0)) {
         
            if (right == 'P') {
                order.CPrice = data[i].close >= strike ? 0 : (strike - data[i].close).toFixed(Symbol.Digits);
            }
            else {
                order.CPrice = data[i].close <= strike ? 0 : (data[i].close - strike).toFixed(Symbol.Digits);
            }            
            
            order.CTime = date.getTime();
            return true;
        }
    }
    return false;
}

function OptionTreatData (values) {
    let PG      = solution.CurrentOptionTerminal.PG;

    let Symbol          = PG.GetSymbolFromName(values[3]);
    if (!Symbol) return;

    let right           = '------';
    let expiry          = '------';  
    let strike          = '------';

    let OSymbol         = values[0];
    let MSymbol         = Symbol.Name;
    let OrderId         = OSymbol;

    let Size            = +values[2];
    let OPrice          = +values[1];
    let CPrice          = +Symbol.Last;
    let percent         = 1;

    if (OSymbol != MSymbol) {
        right           = OSymbol.charAt(0);
        expiry          = OSymbol.substring (OSymbol.length - 8);
        strike          = +OSymbol.substring (1, OSymbol.length - 8);
        
        let contract    = PG.GetContractFromStrikeExpiry (Symbol, right, strike, expiry);
        OSymbol         = contract.summary.localSymbol;  
        CPrice          = +contract.value.lastPrice;
        percent         = 100;
    }
    let Value           = +(OPrice * percent * Size)
    let Profit          = +((CPrice - OPrice) * percent * Size).toFixed(2);
    let sType           = Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT ? 'BUY' : 'SELL';


    let enginename      = 'Manual';
    let type            = MANUAL_ORDER;
    let SessionNumber   = 0;
    let DataType        = MODE_TRADES;
    let MagicNumber     = "64";
    let SL              = 0;
    let TP              = 0;
    let CTime           = 0;

    let Commission      = 0;
    let Swap            = 0;
    let Comment         = "";

   
    let date            = new Date();
    let time            = date.getTime();
    let OTime           = time; 
    let opendate        = date.format('MM-DD-YYYY HH:mm:ss');

    let Orders          = (type == MANUAL_ORDER) ? solution.CurrentOptionTerminal.PG.Orders : solution.CurrentOptionTerminal.PG.EOrders;

    sb.table_addrow(optionorderstable, [OSymbol, MSymbol, sType, right, strike, expiry, Size,  Value, Profit, OPrice, CPrice, opendate, '------', Commission]);
    Orders.push(new pgorder(SessionNumber, OrderId, DataType, MagicNumber, OTime, Symbol.TradeOrder, Size, OSymbol, OPrice, SL, TP, CTime, CPrice, Commission, Swap, Profit, Comment, MSymbol));
}

function OptionUpdateOrders (symbol, type) {
    if(!solution.CurrentOptionTerminal) return;
    Symbol.TradeOrder
    var terminal = solution.CurrentOptionTerminal;
    var PG = terminal.PG;
    var Orders = (type == MANUAL_ORDER) ? PG.Orders : PG.EOrders;
    var totalprofit = 0;
    var openvalue = 0;
    var actualvalue = 0;
    var shouldsave = false;
    var rowid;

    var date        = new Date ();    
    var currenttime = date.getTime();        


    for (var i = PG.Orders.length - 1; i >= 0; i--) {
        var order = PG.Orders[i];
        if (order.MSymbol != symbol.Name) continue;
        var percent = 100;
        var style = "";
        
        var date = new Date (+order.Time);    
        var opendate = date.format('MM-DD-YYYY HH:mm:ss');  
        
        var recid =  order.Number;
        if (order.MSymbol == order.Symbol) { // STOCK
            percent = 1;
        }
        rowid  = sb.table_findfirst2(optionorderstable, 'Symbol',  order.Symbol, 'Open Time', opendate);                

        if (order.MSymbol == order.Symbol) { // STOCK
            order.CPrice  = +symbol.Last;
        }       
        else {
            var right       = recid.charAt(0);
            var expiry      = recid.substring (recid.length - 8);
            var strike      = +recid.substring (1, recid.length - 8);
            
            var expirydate  = d3.timeParse("%Y%m%d%H%M")(expiry + "2200");    
            
            if (currenttime >= expirydate.getTime()) {
                order.DataType = MODE_HISTORY;   
            } else {
                order.DataType = MODE_TRADES;   
            }

            var contract    = PG.GetContractFromStrikeExpiry (symbol, right, strike, expiry);
        
            if (!contract) {
                if (CloseExpired (symbol, order, right, strike, expiry)) {
                    shouldsave = true;
                }
            }
            else {
                order.CPrice  = +contract.value.lastPrice;    
            }
        }
        
        order.Profit = +((order.CPrice - order.OPrice) * percent * order.Size).toFixed(2);


        if (order.DataType == MODE_HISTORY) {
            $('#' + optionorderstable.id + '_' + rowid).css ('background', 'var(--theme-button-bg-color)');
        }    

        sb.table_setcellcontent(optionorderstable, rowid, 'Profit', order.Profit);
        sb.table_setcellcontent(optionorderstable, rowid, 'Price', order.CPrice);
      
     
        if (order.Profit >= 0) {
            sb.table_setcellcolor(optionorderstable, rowid, 'Profit', theme_bull);
        } else {
            sb.table_setcellcolor(optionorderstable, rowid, 'Profit', theme_bear);
        }


        openvalue   += +(order.OPrice * percent * order.Size);
        actualvalue += +(order.CPrice * percent * order.Size);
        totalprofit +=  +order.Profit;        
    }

}

function OptionOrdersPanel_Update (panelelt, table) {
    var terminal = solution.CurrentOptionTerminal;
    if (!terminal)
        return;
        
    var PG = terminal.PG;

 
    var enginename = 'Manual';
    var Type = MANUAL_ORDER;
   
    var rows = [];

    for (var i = PG.Orders.length - 1; i >= 0; i--) {
        var order = PG.Orders[i];
 //       if (order.MSymbol != Symbol.Name) continue;

        var number          = order.Number;
        var sessionnulber   = order.SessionNumber;
        var datatype        = order.DataType;
        var magicnumber     = order.MagicNumber;
        var type            = order.Type;
        var size            = order.Size;
        var symbol          = order.Symbol;
        var oprice          = order.OPrice;
        var sl              = order.SL;
        var tp              = order.TP;
        var cprice          = order.CPrice;
        var comission       = order.Commission;
        var swap            = order.Swap;
        var profit          = order.Profit;
        var comment         = order.Comment;
  
        var time            = order.Time;
        var ctime           = order.CTime;
  
        var date = new Date(+time).format('MM-DD-YYYY HH:mm:ss');
        var cdate = ctime == 0 ? '------' : new Date(+ctime).format('MM-DD-YYYY HH:mm:ss');

        var right; 
        var expiry;
        var strike;

        var style = "";
        
        if (order.MSymbol == order.Symbol) { // STOCK
            right =  '------'; 
            strike = '------'; 
            expiry = '------';
        }
        else {
            right  = number.charAt(0);
            expiry = number.substring (number.length - 8);
            strike = number.substring (1, number.length - 8);
        }
        if (datatype == MODE_HISTORY) {
            style += ";background-color: var(--theme-button-bg-color);";
        }
        rows.push([symbol, order.MSymbol, order.Type == OP_BUY ? 'BUY' : 'SELL', right, strike,  expiry,  profit, size,  oprice, cprice, date, cdate, comission])
      
    }
    sb.table_setrows(table, rows)    
  
}



function SubmitSaveHistory(terminalfolder, content, symbolname, periodname, filename, synchrone) {
    let  site           = solution.get('site');    

    var sendmode = !synchrone ? false : synchrone;
    var url = site.address + '/' + filename;
    var params = 'content=' + content + '&user_id=' + solution.UserId + '&terminalfolder=' + terminalfolder + '&symbolname=' + symbolname + '&periodname=' + periodname;

    var http = new XMLHttpRequest();
    http.open('POST', url, sendmode);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            return 1;
        }
    }
    http.send(params);
}

//-----------------------------------------------------------------------------------------------------------------------------------


var steps = 30; /* binomial steps */


var time = 1;

var round_to = 100000;

function closest (price, array) {
    if (array.length == 0) {
        return -1;
    }
    return array.reduce((a, b) => {
        var n_a = a.item;
        var n_b = b.item;
        let aDiff = Math.abs(n_a - price);
        let bDiff = Math.abs(n_b - price);

        if (aDiff == bDiff) {
            return n_a > n_b ? a : b;
        } else {
            return bDiff < aDiff ? b : a;
        }
    });
}

function nextexpiry (expiry, expiryarray) {
    var array = [];
    for (var i= 0; i < expiryarray.length; i++) {    
        if (expiryarray[i].checked) array.push (expiryarray[i].item);
    }
    
    if (expiry < array[0])
        return array[0];
    for (var i= 0; i < array.length - 1; i++) {
        if (expiry == array[i])
            return array[i];
        if (expiry > array[i] && expiry <= array[i + 1])
            return array[i+1];
    }
    return null;
}

function DaysDifference (date1, date2) {
    
    var Difference_In_Time = date2.getTime() - date1.getTime(); 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
//    return Math.max (0, Math.ceil(Difference_In_Days));
    return Math.max (0, Difference_In_Days).toFixed(2);
}


function GetDaysToExpiration (expiry, fromdate) {
    var date;    
    if (fromdate) {
        date = fromdate;
    }
    else {
        date = new Date ();
    }
    var todate = d3.timeParse("%Y%m%d%H%M")(expiry + "2200");
    return DaysDifference (date, todate);
}

function tooltipVariation(data, ys) {
   
 return ({ currentItem, xAccessor }) => {
        var variation = 12;

        var maxhigh = 0;
        var maxlow = 0;
        var avhigh = 0;
        var avlow = 0;
        var previousItem = data[currentItem.idx.index -1];
        
        var percenthigh = (currentItem.high /previousItem.close)*100 - 100;
        var percentlow = (currentItem.low /previousItem.close)*100 - 100;


        
        for (var i = data.length - 1; i > data.length - variation; i--) {
                var high = data[i].high;
                var low = data[i].low;
                var pclose = data[i-1].close;

            
                avhigh +=  high - pclose;
                avlow  +=  pclose - low;
                
                maxhigh = Math.max (maxhigh, high - pclose)
                maxlow = Math.max (maxlow, pclose - low)
        }       
        avhigh = avhigh / variation;
        avlow  = avlow  / variation;
        
		return {
			x: "VARIATION Period " +  variation + "\n",
			y: [
				{
					label: "Date/Open",
					value: dateFormat(xAccessor(currentItem)) + "  /  " + currentItem.open,
					stroke: 'tomato'

				},

				{
					label: "Variation from previous Close To High",
					value: (currentItem.high - previousItem.close && numberFormat(currentItem.high - previousItem.close)) + "  " + (percenthigh && numberFormat(percenthigh)) + " %",
					stroke: 'tomato'

				},
				{
					label: "Variation from previous Close To Low",
					value: (previousItem.close - currentItem.low && numberFormat(previousItem.close - currentItem.low))    + "  " +  (percentlow && numberFormat(percentlow)) + " %",
					stroke: 'tomato'

				},
				{
					label: "Maximum Variation from previous Close To High",
					value: maxhigh && numberFormat(maxhigh),
					stroke:'tomato'

				},
				{
					label: "Maximum Variation from Close To Low",
					value: maxlow && numberFormat(maxlow),
					stroke: 'tomato'
				},
				{
					label: "Average Variation from Close To High",
					value: avhigh && numberFormat(avhigh),
					stroke:'tomato'

				},
				{
					label: "Average Variation from Close To Low",
					value: avlow && numberFormat(avlow),
					stroke: 'tomato'
				},

				{
					label: "SHORT STRANGLE SELL CALL",
					value:  (previousItem.close + maxhigh) && numberFormat(currentItem.open + maxhigh),
					stroke: 'tomato'

				},
				{
					label: "SHORT STRANGLE SELL PUT",
					value:  previousItem.close - maxlow && numberFormat(currentItem.open - maxlow),
					stroke: 'tomato'

				}
			]
				.concat(
					ys.map(each => ({
						label: each.label,
						value: each.value,
						stroke: each.stroke
					}))
				)
				.filter(line => line.value)
		};
	};
}
  
function FillOption (symbol, right) {
    var options = [];

    if (right == 'P' || right == 'C') {
        var contracts = symbol.Contracts;
        for (var i = 0; i < symbol.Contracts.length; i++) {
            if (symbol.Contracts[i].summary.right == right) {
                var expiry      = symbol.Contracts[i].summary.expiry;
                var expiryindex = GetExpiryIndex(symbol, expiry);     
                options.push('<option value="' +   right + symbol.Contracts[i].summary.strike.toString() + symbol.Contracts[i].summary.expiry + '" style="' + symbol.Expiries[expiryindex].style.replace('border-', '') + '">' + symbol.Contracts[i].summary.localSymbol + '    '  +  symbol.Contracts[i].summary.expiry + '   ' + symbol.Contracts[i].summary.strike + '</option>');
            }
        }
    }
    else {
        options.push('<option value="' +  symbol.Name + '">' + symbol.Name + '</option>');
    }
    $("#selectcontracts").html(options.join(''));
}

function UpdateContracts (symbol) {
    var contractsList   = [];
    var greeksList      = []; 
    
    for (var i = 0; i < symbol.Contracts.length; i++) {
        
        var contract    = symbol.Contracts[i];
        var option      = contract.value;        
        
        var expiry      = contract.summary.expiry;    
        var strike      = contract.summary.strike;

        var right       = contract.summary.right;
           
         
        var dividend   = CurrentDividend;
        var rate       = CurrentRate;    
        var nbrdays    = GetDaysToExpiration (expiry);
        var theorical_price = 0;
    
        var volatility =  parseFloat(option.impliedVolatility);
        
        if (volatility == 0) volatility = 100;

          
        if (right == 'P') {
            binaryInsert2fields(
                {
                    Strike:             strike, 
                    Expiry:             expiry,
                    p_price:            option.lastPrice.toFixed(2), 
                    p_bidPrice:         option.bid, 
                    p_askPrice:         option.ask, 
                    p_change:           option.change, 
                    p_percentChange:    option.percentChange, 
                    p_openInterest:     option.openInterest, 
                    p_volume:           option.volume, 
                    p_impliedVol:       option.impliedVolatility, 
                    p_localSymbol:      contract.summary.localSymbol, 
                },       
                'Strike', 'Expiry', contractsList, true);                                               
            var put_price_greeks  = getCRROptionPriceAndGreeks(symbol.Last, strike, volatility/100, rate/100, nbrdays/365, steps, dividend/100, true);

            binaryInsert2fields(
                {
                    Strike:strike, 
                    Expiry:expiry, 
                    p_price: RoundTo(put_price_greeks[0], 100000),  
                    p_delta:  RoundTo(put_price_greeks[1], 100000), 
                    p_gamma: RoundTo(put_price_greeks[2], 100000), 
                    p_theta: RoundTo(put_price_greeks[3], 100000), 
                    p_vega: RoundTo(put_price_greeks[4], 100000),  
                    p_rho:  RoundTo(put_price_greeks[5], 100000), 
                    p_impliedVol: option.impliedVolatility, 
                    p_localSymbol: contract.summary.localSymbol, 
                },                                  
                'Strike', 'Expiry',  greeksList, true);        
        }
        else {

            binaryInsert2fields(
                {
                    c_localSymbol:   contract.summary.localSymbol, 
                    c_impliedVol:    option.impliedVolatility, 
                    c_volume:        option.volume, 
                    c_openInterest:  option.openInterest,                     
                    c_percentChange: option.percentChange, 
                    c_change:        option.change, 
                    c_bidPrice:      option.bid, 
                    c_askPrice:      option.ask, 
                    c_price:         option.lastPrice.toFixed(2),
                    Strike:          strike,
                    Expiry:          expiry, 
                },                                  
                'Strike', 'Expiry', contractsList, true);        
            
            var call_price_greeks = getCRROptionPriceAndGreeks(symbol.Last,  strike, volatility/100, rate/100, nbrdays/365, steps, dividend/100, false);

            binaryInsert2fields(
                {
                    Strike:strike, 
                    Expiry:expiry, 
                    c_price:        RoundTo(call_price_greeks[0], 100000),  
                    c_delta:        RoundTo(call_price_greeks[1], 100000), 
                    c_gamma:        RoundTo(call_price_greeks[2], 100000), 
                    c_theta:        RoundTo(call_price_greeks[3], 100000), 
                    c_vega:         RoundTo(call_price_greeks[4], 100000), 
                    c_rho:          RoundTo(call_price_greeks[5], 100000), 
                    c_impliedVol:   option.impliedVolatility, 
                    c_localSymbol:  contract.summary.localSymbol, 
                },                                  
                'Strike', 'Expiry',  greeksList, true);        
        }   
    }
    
    symbol.contractsarray   = [];
    symbol.greeksarray      = [];

    for (var i= 0; i < contractsList.length; i++) {
        symbol.contractsarray.push ([contractsList[i].c_localSymbol, contractsList[i].c_impliedVol, contractsList[i].c_volume, contractsList[i].c_openInterest, contractsList[i].c_percentChange,
         contractsList[i].c_change, contractsList[i].c_bidPrice, contractsList[i].c_askPrice, contractsList[i].c_price, contractsList[i].Strike, contractsList[i].Expiry,    
         contractsList[i].p_price, contractsList[i].p_bidPrice, contractsList[i].p_askPrice, contractsList[i].p_change, contractsList[i].p_percentChange,  
         contractsList[i].p_openInterest, contractsList[i].p_volume, contractsList[i].p_impliedVol, contractsList[i].p_localSymbol]);       
   
    }
    for (var i= 0; i < greeksList.length; i++) {
        symbol.greeksarray.push ([greeksList[i].c_localSymbol, greeksList[i].c_impliedVol, greeksList[i].c_rho, greeksList[i].c_vega, greeksList[i].c_theta,
            greeksList[i].c_gamma, greeksList[i].c_delta, greeksList[i].c_price, greeksList[i].Strike, greeksList[i].Expiry,    
            greeksList[i].p_price, greeksList[i].p_delta, greeksList[i].p_gamma, greeksList[i].p_theta, greeksList[i].p_vega,  
            greeksList[i].p_rho,  greeksList[i].p_impliedVol, greeksList[i].p_localSymbol]);                  
    }
}
 
function onpaste_sitesidebarpanel(elt, event) {
    var clipboardData, pastedData;

    event.stopPropagation();
    event.preventDefault();


    // after selecting symbols between symbols

    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;
    
    var symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;

    OptionSelectPeriod(solution.CurrentOptionTerminal, symbol, P_D1, false);
    Option_SelectSymbol(symbol);
    
    let data = symbol.chartData[P_D1];
   

    // Get pasted data via clipboard API
    clipboardData = event.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    let lines = pastedData.replace(/'/g, "").split(/\r\n|\n/);
    sb.table_clear(siteamericanbulltable);
    $(elt).html (sb.render (siteamericanbulltable))    
    let table = [];
    let parseDate = d3.timeParse("%d/%m/%Y");
    let prevmonth = '';
    let year      = '';
    
    for (var i = 1; i < lines.length; i++) {
        let line        = lines[i];
        let fields      = line.split (/' '|\t/);
        let date        = fields[0];
        let datesplit   = fields[0].split ('/');
        
        let month       = datesplit[0]
        year            = i == 1 ? new Date().getFullYear() : (month != prevmonth && month == '12' ? year - 1 : year);

        fields[0]       = datesplit[1] + '/' + month + '/' + year;
        
        sb.table_addrow (siteamericanbulltable, [fields[0], fields[1], fields[2], fields[3], fields[5]])
        if (fields[2] == 'BUY') {
            sb.table_setcellcolor (siteamericanbulltable, i-1, 'Signal', theme_bull);
            
        }
        else {
            sb.table_setcellcolor (siteamericanbulltable, i-1, 'Signal', theme_bear);
        }

        let barindex = FindFixedIdxDataFromTime (parseDate(fields[0]).getTime(), data);  // day in milliseconds                
        if (barindex >= 0) {
            eval ('data[' + barindex + '].americanbull_' + fields[2] + ' = 1;') 
        }
        prevmonth = month;
    }
}

var FindFixedIdxDataFromTime = function (time, data) {
    let Idx = -1;
    let length = data.length;
    if (length <= 1) return Idx;
  
    if (data[0].date.getTime() > time || data[length - 1].date.getTime() < time) return Idx;
    
    for (var i = 0; i < data.length; i++) {
        let date = new Date(data[i].date.getTime());
        date.setHours(0,0,0,0)
        if (date.getTime() == time) return i;
    }
    return Idx;
}

function InitOption () {

    let terminal        = solution.CurrentOptionTerminal;
    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];
    
    sb.table_clear(optiongreekstable);
    sb.table_clear(optioncontractstable);
    sb.table_clear(currencytable);
    sb.table_clear(summarytable); // and header
    $('#summary_symbolname label').html('no symbol')
    $('#summary_symbolprice label').html('')    
    sb.tab_clear (optioncontracttab);
    sb.tab_clear (optionordertab);  
}


function closestoption (symbol, right, yValue, mouseXY, fulldata, state) {

    var lastdate    = fulldata[fulldata.length - 1].date;
    var xScale      = state.xScale;
    var x           = mouseXY[0];

    var bardate     = (lastdate > xScale.invert(x) ? lastdate : xScale.invert(x));
    var price       = yValue;     

    var closestexpiry = nextexpiry(d3.timeFormat("%Y%m%d")(bardate), symbol.Expiries); 
    if (!closestexpiry) return;

    var expiryindex  = GetExpiryIndex(symbol, closestexpiry);     

    var closestprice = closest(price, symbol.Strikes); 

    var recid = closestprice.item + closestexpiry;  

    if (right == 'P') {
        symbol.AddContract('P' + recid);
    } else 
    if (right == 'C') {
        symbol.AddContract('C' + recid);
    } else {
        symbol.AddContract('C' + recid);
        symbol.AddContract('P' + recid);
    }
}

//------------------------------------------------------------ CONTRACTS PANEL ----------------------------------------------------------

function select_strike (symbol, strike, checked, update) {
    let strikeindex = GetStrikeIndex (symbol, strike);
   
    symbol.Strikes[strikeindex].checked = checked;

    if (update) {    
        checked ? $('#optionstrikegroup #' + CSS.escape(strike)).addClass ('checked') : $('#optionstrikegroup #' + strike).removeClass ('checked')    
    }

    ContractsPanel_Filter(symbol);        
}
 
function select_expiry (symbol, expiry, checked, update) {
    let expiryindex = GetExpiryIndex (symbol, expiry);

    symbol.Expiries[expiryindex].checked = checked;

    if (update) {
        checked ? $('#optionexpirygroup #' + expiry).addClass ('checked') : $('#optionexpirygroup #' + expiry).removeClass ('checked')
    }

    ContractsPanel_Filter(symbol);    
    Chart_Draw(solution.CurrentOptionTerminal)
}

function onclick_optionexpirygroup (elt, event) {
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    let symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;

    switch (elt.id) {
        case 'setall':
            for (var i = 0; i < symbol.Strikes.length; i++) {
                symbol.Strikes[i].checked = true
                $('#optionstrikebar #' +  CSS.escape(symbol.Strikes[i].item)).addClass('checked');
            }
            ContractsPanel_Filter(symbol);  
        break;
        case 'unsettall':
            for (var i = 0; i < symbol.Strikes.length; i++) {
                symbol.Strikes[i].checked = false
                $('#optionstrikebar #' +  CSS.escape(symbol.Strikes[i].item)).removeClass('checked');
            }
            ContractsPanel_Filter(symbol);          
        break;
        case 'setfrom':
            for (var i = 0; i < symbol.Strikes.length; i++) {
                symbol.Strikes[i].checked = false
                $('#optionstrikebar #' +  CSS.escape(symbol.Strikes[i].item)).removeClass('checked');
            }

            let inthemoney = closest (symbol.Last, symbol.Strikes);
            let index     = symbol.Strikes.indexOf(inthemoney);

            let from    = +inthemoney.id - +$('#downmoney').val();
            let to      = +$('#upmoney').val() + +inthemoney.id;
        
            for (var i = index; i < symbol.Strikes.length; i++) {
                if (+symbol.Strikes[i].id <= to) {
                    symbol.Strikes[i].checked = true
                    $('#optionstrikebar #' +  CSS.escape(symbol.Strikes[i].item)).addClass('checked');                
                }
            }
            for (var i = 0; i < index; i++) {
                if (+symbol.Strikes[i].id >= from) {
                    symbol.Strikes[i].checked = true
                    $('#optionstrikebar #' +  CSS.escape(symbol.Strikes[i].item)).addClass('checked');                
                }
            }  
            ContractsPanel_Filter(symbol);    
        break;

    }
}

//------------------------------------------------------------ OPTION CONTRACT MORE MENU ----------------------------------------------------------

const MENU_OPTION_CLOSEALL_ID   = 1;
const MENU_OPTION_CLOSESAVED_ID = 2;
const MENU_OPTION_VIEW_ID       = 3;

function ReturnOptionTabMenu () {
    var menu = [];
    menu.push({id: MENU_OPTION_CLOSEALL_ID,    text: "Close All",       tooltip: 'Close All Symbols',        icon:'' });
//    menu.push({id: MENU_OPTION_CLOSESAVED_ID,  text: "Close Saved",     tooltip: 'Close Saved files',      icon: ''});
//    menu.push({id: 0,     text: ""});
//    menu.push({id: MENU_OPTION_VIEW_ID,     text: (optionplatform.optionview == OPTION_BAR_VIEW ? 'Enable Menu View' : 'Enable Bar View'), tooltip: 'Switch Expiries View',         icon: ''});
    return menu;
}


function onclick_OptionTabMenu (event) {
  
    var menu = ReturnOptionTabMenu ();
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),     
        event: event,                    
        pageX: event.pageX,
        pageY: event.pageY,

        onselect: function (elt, par) {

            switch (parseInt(elt.id)) {
                case MENU_OPTION_CLOSEALL_ID :
                    OptionCloseAllSymbols();
                break;
                case MENU_OPTION_CLOSESAVED_ID :
                  //  CloseSavedStrategies();
                break;
                case MENU_OPTION_VIEW_ID :
                    SwitchOptionView();
                break;                
            }
        },        
        html: sb.menu (menu)
    });    	
}    

function SwitchOptionView () {
    if (optionplatform.optionview == OPTION_BAR_VIEW) {
        optionplatform.optionview = OPTION_MENU_VIEW;
        $('#optionexpirybar').css ('display', 'none')
        $('#optionstrikebar').css ('display', 'none')
        $('#optionmenubar').css ('display', 'flex')
    
    } else {
        optionplatform.optionview = OPTION_BAR_VIEW;
        $('#optionexpirybar').css ('display', '')
        $('#optionstrikebar').css ('display', '')
        $('#optionmenubar').css ('display', 'none')
    }
}

function OptionCloseAllSymbols() {
    while (optioncontracttab.items.length != 0) {
        let symbol = solution.CurrentOptionTerminal.PG.GetSymbolFromName(optioncontracttab.items[0].item); 
        OptionCloseSymbol(symbol);
    }
}

//------------------------------------------------------------ STRIKE BAR PANEL ----------------------------------------------------------

function onhover_ExpiryBar(elt) {
    
    var expiry = $(elt)[0].innerText;
    var nbrdays    = GetDaysToExpiration (expiry);    

    $(elt).prop ('title', nbrdays + ' ' + 'Days');
}

function onclick_ExpiryBar(elt) {
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    let symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;

    let checked = !$(elt).hasClass ('checked') 
    
    select_expiry(symbol, elt.id, checked)

}

function onclick_StrikeBar(elt) {
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    let symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;

    let checked = !$(elt).hasClass ('checked') 

    select_strike(symbol, elt.id, checked)  
}

function OptionToolbarsPanel_Update (symbol) {
   
    optionexpirygroup.items = symbol.Expiries;
    optionstrikegroup.items = symbol.Strikes;
  
    $('#' + optionstrikebar.id).html(sb.group (optionothergroup) + sb.group (optionstrikegroup));
    $('#' + optionexpirybar.id).html(sb.group (optionexpirygroup));


// STRIKE CHECK 

    let inthemoney = closest (symbol.Last, symbol.Strikes);
    if (inthemoney == -1) {
        return;
    }
  
    $('#upmoney').attr("max",   +symbol.Strikes[symbol.Strikes.length-1].id - +inthemoney.id); 
    $('#downmoney').attr("max", +inthemoney.id - +symbol.Strikes[0].id); 
    
    $('#optionstrikegroup #' + CSS.escape(inthemoney.id)).css ('color', 'red')

    for (var i = 0; i < symbol.Expiries.length; i++) {
        if (symbol.Expiries[i].checked) {
            $('#optionexpirybar #' + symbol.Expiries[i].item).addClass('checked');
        }
    }

    for (var i = 0; i < symbol.Strikes.length; i++) {
        if (symbol.Strikes[i].checked) {
            $('#optionstrikebar #' +  CSS.escape(symbol.Strikes[i].item)).addClass('checked');
        }
    }        
}

//------------------------------------------------------------ STRIKE MENU PANEL ----------------------------------------------------------

function onclick_ExpiryMenu (elt, event) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    var symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;    

    let checkelt = $(elt).find ('.custom-control-input');
    let id       = $(checkelt).attr('id')   

    let checked  = !checkelt.prop ('checked');
    checkelt.prop ('checked', checked)

    select_expiry(symbol, id,  checked, true)

}

function onclick_StrikeMenu (elt, event) {
    var symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    var symbol = symbolcanvas.CurrentSymbol;    
    if (!symbol) return;    

    let checkelt = $(elt).find ('.custom-control-input');
    let id       = $(checkelt).attr('id')    
    
    let checked  = !checkelt.prop ('checked');
    checkelt.prop ('checked', checked)
   
    select_strike(symbol, id,  checked, true)
}


function onclick_StrikesMenu (elt, event) {
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;      
    
   let symbol = symbolcanvas.CurrentSymbol;

   sb.overlay({
        rootelt: $(elt).closest('.sb_root'),
        event: event,            
        pageX: event.pageX,
        pageY: event.pageY,
        clickinside:true,
        onshow:  function () {
            StrikeMenuPanel_Update (symbol, 'onclick_StrikeMenu(this, event)');
        },        
        html: StrikeMenuPanel()
    });    	
}

function StrikeMenuPanel_Update (symbol, onclick) {
    
    optionstrikegroup.items = symbol.Strikes;

    var content = '';
    

    for (var i = 0; i <  optionstrikegroup.items.length; i++) {
         content += '<li class="Expiry" onclick="' + onclick + '">' + 
                        sb.render({
                                id:         optionstrikegroup.items[i].id,   
                                item:       optionstrikegroup.items[i].item, 
                                attributes: optionstrikegroup.items[i].checked ? {checked:''} :  {},
                                title:      optionstrikegroup.items[i].title,
                                type:       'checkbox'}) +
                     '</li>';     
     }
     $('.PickerValues').html (content);
     $('.PickerValuesPanel').css ("display", 'flex');  
}

function StrikeMenuPanel (){
    
    var content = 
   '<div class="RulePicker">' +
   '    <ul class="PickerValuesPanel" style="display:none;overflow:hidden;">' +
   '        <ul class="PickerValues"   onkeydown ="arrowFunction(this, event, 1)">'+
   '        </ul>'+
   '    </ul>'+
      '</div>';
    return content;
}

function onclick_ExpiriesMenu (elt, event) {
    let symbolcanvas = solution.CurrentOptionsolution.GetCanvasFromTerminal(solution.CurrentOptionTerminal);
    if (!symbolcanvas) return;      
    
   let symbol = symbolcanvas.CurrentSymbol;

   sb.overlay({
        rootelt: $(elt).closest('.sb_root'),
        event: event,            
        pageX: event.pageX,
        pageY: event.pageY,
        clickinside:true,
        //keepopen:true,
        onshow:  function () {
            ExpiryMenuPanel_Update (symbol, 'onclick_ExpiryMenu(this, event)');
        },        
        html: ExpiryMenuPanel()
    });    	
}

function ExpiryMenuPanel_Update (symbol, onclick) {
    
    optionexpirygroup.items = symbol.Expiries;


    var content = '';
    

    for (var i = 0; i <  optionexpirygroup.items.length; i++) {
         content += '<li class="Expiry" onclick="' + onclick + '">' + 
                        sb.render({
                                id:         optionexpirygroup.items[i].id,   
                                item:       optionexpirygroup.items[i].item, 
                                attributes: optionexpirygroup.items[i].checked ? {checked:''} :  {},
                                style:      optionexpirygroup.items[i].style.replace('border-', ''),
                                title:      optionexpirygroup.items[i].title,
                                type:       'checkbox'}) +
                     '</li>';     
     }
     $('.PickerValues').html (content);
     $('.PickerValuesPanel').css ("display", 'flex');  
}

function ExpiryMenuPanel (){
    
    var content = 
   '<div class="RulePicker">' +
   '    <ul class="PickerValuesPanel" style="display:none;overflow:hidden;">' +
   '        <ul class="PickerValues"   onkeydown ="arrowFunction(this, event, 1)">'+
   '        </ul>'+
   '    </ul>'+
      '</div>';
    return content;
}

