document.addEventListener('readystatechange', event => { 

    // When HTML/DOM elements are ready:
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
    }
});


//---------------------------------------------------- BEFORE UNLOAD ------------------------------------------------

function OnBeforeUnLoad(event) {
    if (solution == null)
        return;

    if (solution.CurrentTerminal) {
        solution.CurrentTerminal.Save ();        
    }

    if (solution.CurrentOptionTerminal) {
        solution.CurrentOptionTerminal.Save ();        
    }
    
    solution.SaveProfile();

    if (solution.UserId != "0")  {
        event.preventDefault();
        return (event.returnValue = "Are you sure you want to leave?");    
    }
   return;
}

function GSE_init() {
    CurrentContainer  = pg_gse_init('gsecanvas_strategy');
    CurrentTContainer = pg_gse_init('gsecanvas_session');
    CurrentCContainer = pg_gse_init('gsecanvas_condition');
}

function Editors_init() {

    home_editors_init('home');
    tradedesk_editors_init('tradedesk');
    project_editors_init('project');
    option_editors_init('option');
}

function InitApp1 (solution) {
        

    window.onbeforeunload   = function (event) {OnBeforeUnLoad (event)}

    $('.visible_marker input').prop ('checked', true)
   
    $("#tradedeskcurrenciestable tbody").sortable({
        helper: 'clone',
        placeholder: 'ui-state-highlight',
        start:function(event,ui){

        },
        stop:function(event, ui){
        }
    });

   // solution.LoadProfile ();

    solution.ui.platform_select(TRADEDESK_PLATFORM_PNAME);    
/*
    let ui  = solution.get('ui')     
    let mainterminal = solution.GetMainTerminal()
    ui.platform_select(mainterminal.pname);

    onclick_sidebarmenu ('sidebar_home', true);    
    onclick_sidebarmenu ('sidebar_terminals', true);
    onclick_sidebarmenu ('sidebar_files', true);
    onclick_sidebarmenu ('sidebar_optionterminals', true);    
   // solution.add_module('solution')
    //solution.add_module('news')   
*/     
}
  

function InitApp (solution) {

    pgsolution(solution);
    
    window.onbeforeunload   = function (event) {OnBeforeUnLoad (event)}
    

    let ui  = solution.get('ui') 
  
 
    GSE_init();
    

    Editors_init();         
    speech_init();
    news_init ();

    //LoaderInit();   
    AnimationInit(); 
    home_mt4assistant_init();      

    project_assistant_init ();
    project_assistant_select (projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW);
   // StrategyAssistantFillProjects ();     

    $('.visible_marker input').prop ('checked', true)

   
    $("#tradedeskcurrenciestable tbody").sortable({
        helper: 'clone',
        placeholder: 'ui-state-highlight',
        start:function(event,ui){

        },
        stop:function(event, ui){
        }
    });
    solution.Load ();

    home_selectterminal (solution.GetMainTerminal (), 1);    

    if (solution.UserId == "0" && !market_closed()) {
        var terminal = solution.GetTerminalFromName ('Alpari MT4', 'terminal');
        tradedesk_selectterminal(terminal); 
    }

    ui.platform_select(HOME_PLATFORM_PNAME);


    onclick_sidebarmenu ('sidebar_home', true);    
    onclick_sidebarmenu ('sidebar_terminals', true);
    onclick_sidebarmenu ('sidebar_files', true);
    onclick_sidebarmenu ('sidebar_optionterminals', true);    
  
    setInterval("market_time()", 1);        
   
    setInterval(project_timer, 300);      
    setInterval(tradedesk_timer, 300); 
    setInterval(option_timer, 300); 

    solution.add_module('netprog')
    solution.add_module('emv')    
}



//  ------------------------------------------------------------------------ SAVE SCHEDULES ---------------------------------------------------------------------

function SaveSchedules(engine) {
    var PG = solution.CurrentTerminal.PG;
    if (engine && engine.Schedules.length == 0) {
        var schedule = CurrentTSchedule;
        PG.Schedules.push(schedule);
        engine.Schedules.push(schedule);
    }
    w2ui['sessionschedules'].save();
    SaveSchedulesCSV(solution.CurrentTerminal);
    OnReloadSchedule(solution.CurrentTerminal);
}

function CancelSchedules() {
    CancelGridChanges(w2ui['sessionschedules']);
    w2ui['sessionschedules'].refresh();
}


function SessionEnableButtons() {
    var shouldDisable = true;
    if (solution.UserId == "0") return;
    if (!document.getElementById('SaveSession')) return;
    if (!CurrentSession) {
        document.getElementById('SaveSession').disabled = shouldDisable;
        document.getElementById('CancelSession').disabled = shouldDisable;
        return;
    }
    for (var i = 0; i < w2ui['sessionproperty'].records.length; i++) {
        if (w2ui['sessionproperty'].records[i].w2ui.changes) {
            shouldDisable = false;
            break;
        }
    }
    if (!shouldDisable) {
        document.getElementById('SaveSession').style.color = '#fff';
        //     document.getElementById('SaveSession').style.border-bottom = "4px solid #000000";
        document.getElementById('SaveSession').style.background = theme_new_hd_color;
    }
    document.getElementById('SaveSession').disabled = shouldDisable;
    document.getElementById('CancelSession').disabled = shouldDisable;
}


///////////////////////////////////////////////////////////////////////////SESSION///////////////////////////////////////////////////////////////////////////////

function GetAttributeFromRecid(recid) {
    for (var i = 0; i < EngineAttributeMenu.length; i++)
        if (EngineAttributeMenu[i].recid == recid) return EngineAttributeMenu[i].id;
    return -1;
}

function OnSaveSession(event) {
    if (!CurrentSession) return;
    var s = "";
    for (var i = 0; i < w2ui['sessionproperty'].records.length; i++) {
        var changes = w2ui['sessionproperty'].records[i].w2ui.changes;
        if (changes) {
            if (changes.value == undefined) continue;
            var recid = w2ui['sessionproperty'].records[i].recid;
            var attribute = GetAttributeFromRecid(recid);
            var Value = (changes.value.text == undefined) ? changes.value : changes.value.text;
            s += attribute + " " + Value + " ";
        }
    }
    OnManualSession(solution.CurrentTerminal, CurrentSession.SessionNumber, s);
    w2ui['sessionproperty'].save();
    for (var i = 0; i < w2ui['sessionproperty'].records.length; i++) {
        if (w2ui['sessionproperty'].records[i].w2ui.changes) w2ui['sessionproperty'].records[i].w2ui.changes = null;
    }
    w2ui['sessionproperty'].refresh();
}

function RefreshSessionGraphicOrders(Symbol, Session) {
    var PG = solution.CurrentTerminal.PG;
    var SessionNumber = Session.SessionNumber;
    var Orders = (Session.Engine == "Manual") ? PG.Orders : PG.EOrders;
    var Id = (Session.Engine == "Manual") ? 'orders' : 'eorders';
    Symbol.orderData.length = 0;
    for (var i = 0; i < Orders.length; i++)
        if (Orders[i].Symbol == Symbol.Name && (SessionNumber < 0 || Orders[i].SessionNumber == SessionNumber)) Symbol.orderData.push({
            date: new Date(Orders[i].Time * 1000 + solution.DifferenceHoursTime),
            type: OpName[Orders[i].Type],
            price: Orders[i].OPrice,
            quantity: Orders[i].Size,
            sessionnumber: SessionNumber,
            symbol: Session.Symbol
        });
}

function RefreshSessionBox(Symbol, Session) {
    var startdate = Session.StartDate;
    var enddate = Symbol.chartData[P_M1][Symbol.chartData[P_M1].length - 1].date.getTime();
    minpoint = Session.MinPoint;
    maxpoint = Session.MaxPoint;
    baverage = Session.BuyAveragePoint;
    saverage = Session.SellAveragePoint;
    Session.boxData.length = 0;
    Session.boxData.push({
        lx: startdate,
        ty: +maxpoint,
        rx: enddate,
        by: +minpoint
    });
}
function RefreshGraphicOrder(order) {
    var PG = solution.CurrentTerminal.PG;
    for (var i = 0; i < PG.EOrders.length; i++)
        if (PG.EOrders[i] == order) {
            Symbol.orderData.push({
                date: new Date(PG.EOrders[i].Time * 1000 + solution.DifferenceHoursTime),
                type: OpName[PG.EOrders[i].Type],
                price: PG.EOrders[i].OPrice,
                quantity: PG.EOrders[i].Size,
                sessionnumber: 0,
                symbol: PG.EOrders[i].Symbol
            });
            return;
        }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function InsertConditionInTrackResult(condition) {
    var records = w2ui['strategytrackresult'].records;
    var elt = {recid: records.length, condition: condition.Name,  not: false}; 
    w2ui['strategytrackresult'].add (elt);
    w2ui['strategytrackresult'].refresh();
}

////////////////////////////////////////////////////////////////////     CONNECTION TERMINAL /////////////////////////////////////////////////////////////////


function OnReloadSchedule(terminal) {
    var PG = terminal.PG;
    if (solution.UserId == "0") {
        TreatOperation(register_needed_label, 'operationpanel', 'red');
        return;
    }
    var sorder = "*RELOADSCHEDULEFILE ";
    for (var i = 0; i < PG.Symbols.length; i++) terminal.Com.Send(solution.UserId + '*' + PG.Symbols[i].Name + sorder);
}



function OnPauseStrategy () {
    if (solution.UserId == "0") {
        TreatOperation(register_needed_label, 'operationpanel', 'red');
        return;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    var Symbol = symbolcanvas.CurrentSymbol;         
    solution.CurrentTerminal.Com.Send(solution.UserId + '*' + Symbol.Name + "*PAUSE ");
}

/*--------------------------------------------------------------- SESSION -------------------------------------------------------*/





/*----------------------------------------------- ORDERS -------------------------------------------------------*/


function SaveSchedulesCSV(terminal) {
    var PG = terminal.PG;
    if (solution.UserId == "0") {
        TreatOperation(register_needed_label, 'operationpanel', 'red');
        return;
    }
    var content = "RULE,OPERATION,SYMBOL,STARTMONTH,OCCURENCEDAYINWEEK,STARTDAY,STARTTIME,ENDMONTH,ENDOCCURENCEDAYINWEEK,ENDDAY,ENDTIME,FREQDAY,SAMEBAR, TIMEBETWEENSESSION, TIMEZONE\n";
    for (var k = 0; k < PG.Engines.length; k++) {
        var schedule = PG.Engines[k].Schedules[0];
        if (!schedule) continue;
        content += schedule.StartRule + ",";
        content += schedule.Operation + ",";
        content += schedule.Currency + ",";
        content += schedule.StartMonth + ",";
        content += schedule.FromOccurenceWeek + ",";
        content += schedule.StartDay + ",";
        content += schedule.StartTime + ",";
        content += schedule.EndMonth + ",";
        content += schedule.ToOccurenceWeek + ",";
        content += schedule.EndDay + ",";
        content += (schedule.EndTime == "" ? "-1" : schedule.EndTime) + ",";
        content += (schedule.FrequencyDay == 0 ? "-1" : schedule.FrequencyDay) + ",";
        content += schedule.OnSameBar + ",";
        content += (schedule.TimeBetweenSession == 0 ? "-1" : schedule.TimeBetweenSession) + ",";
        content += schedule.TimeZone + "\n";
    }
    SubmitTerminalRequest(solution.CurrentTerminal.Folder, solution.CurrentTerminal.Type, content, '/php/save_schedules.php', ASYNCHRONE);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


function SetOrders(Symbol) {
    var PG = solution.CurrentTerminal.PG;
    Symbol.ordersData.length = 0;
    for (var i = 0; i < PG.EOrders.length; i++) {
        Symbol.ordersData.push({
            date: new Date(PG.EOrders[i].Time * 1000 + solution.DifferenceHoursTime),
            type: OpName[PG.EOrders[i].Type],
            price: PG.EOrders[i].OPrice,
            quantity: PG.EOrders[i].Size,
            sessionnumber: 0,
            symbol: PG.EOrders[i].Symbol
        });
    }
    for (var i = 0; i < PG.Orders.length; i++) {
        Symbol.ordersData.push({
            date: new Date(PG.Orders[i].Time * 1000 + solution.DifferenceHoursTime),
            type: OpName[PG.Orders[i].Type],
            price: PG.Orders[i].OPrice,
            quantity: PG.Orders[i].Size,
            sessionnumber: 0,
            symbol: PG.Orders[i].Symbol
        });
    }
}

function ParseXML(Id, url) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            ResultXML(xhttp, Id);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function ResultXML(response, Id) {
    var xmlDoc = response.responseXML;
    var x = xmlDoc.getElementsByTagName("Parameter");
    var out = "<table>";
    for (var i = 0; i < x.length; i++) {
        var y = x[i].getAttributeNode("Name");
        if (y == null) continue;
        var txt = y.nodeValue;
        out = out + "<td>" + txt + "</td>";
        // document.getElementById('hidden').innerHTML =str;
    }
    out += "</table>";
    document.getElementById(Id).innerHTML = out;
}


function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
};
 


//---------------------------------------------------- EVENTS ONLOAD-----------------------------------------------   




