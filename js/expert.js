
// SPECIAL ENGINE TREATMENT    
/*    
    if (STRATEGY_ASSISTANT_VIEW) {
        UpdateActionsRule ();
//        CurrentEngine.SCContent = ReturnSCActionButtons();
  //      CurrentContainer.Refresh ();
    }else {
        Set_Engine(0, B_STARTAUTOMATIC, P_SIGNAL);     
    }
*/    
const MARKER_CONTEXT            = 1;
const ENGINE_CONTEXT            = 0;

const CLOSE_TICK                = 0;
const OPEN_TICK                 = 1;
const HIGH_TICK                 = 2;
const LOW_TICK                  = 3;
const BODY_TICK                 = 4;
const UPSHADOW_TICK             = 5;
const LOWSHADOW_TICK            = 6;

var TICK_STEP;

var expertcontext = new ExpertContext('', '');



var enginecontext;
var engineStartAsync;


var PausedSimulator = 0;
var TestMode        = false;
var StartDate       = 0;

var E_NbrEngine = 0;

var Bid = 0;
var Ask = 0;

var InsertBar = function(context, bar, period, Data) {
   
    var copybar = Object.assign({}, bar);
   
    copybar.close = copybar.high = copybar.low = copybar.open;
   
    Data[period].push(copybar);
   
    context.SetOpen(copybar.open, period);
    context.SetHigh(copybar.open, period);
    context.SetLow(copybar.open, period);
    context.SetClose(copybar.open, period);
   
    return copybar;
}

var FindIdxStartBar = function  (entity, symbol, period, maxperiod, type, complete) {
    
    var length          = symbol.chartData[period].length;

    if (length == 0 || !symbol.plotData || symbol.plotData.length == 0) {
        console.log ('chart not READY');
        return;
    }

    if (type == MARKER_CONTEXT) {
        clearInterval(markerStartAsync);
       
    } else {
        clearInterval(engineStartAsync);
    }

    let startbar    = symbol.plotData[1].idx.index;                 // start at second bar of plotted data to analyse prev bar 
    let endbar      = symbol.plotData[symbol.plotData.length - 1].idx.index;    
  
    if (defined(complete) && complete == 1) {
        startbar = 100;                                               // start at second bar of the whole chart to analyse prev bar 
        endbar   = symbol.chartData[period].length - 1
    }
    else {                                                          //place to treat bigger periods                                         
        if (period != maxperiod) {
            var timeneeded = GetTimeFromPeriod(maxperiod, MILLISECONDS) * 3;   // * 3 in case of analysing previous

        
            var currentbartime  = symbol.chartData[period][startbar].date.getTime ();
            var lastbartime     = symbol.chartData[period][length-1].date.getTime ();

            if (lastbartime - currentbartime < timeneeded) {
                var index = FindIdxDataFromTime (lastbartime - timeneeded,  symbol.chartData[period]);
                if (index < 0) {
                    startbar = 10; // start at the beginning no choice    
                }
                else {
                    startbar = index + 1;
                }
            }    
        }
    }

    if (type == MARKER_CONTEXT) {
        Marker_Start (entity, symbol, period, startbar, endbar);
    } else {
        Engine_Start (entity, symbol, period, startbar, endbar);
    }
 }

//============================================== SIMULATING ENGINES ===========================================================



var ResetAll = function(first) {
    switch (arguments.length) {
        case 0:
            first = -1;
    }
    enginecontext.ResetSignals(null, null, null, first);
    enginecontext.ResetSignalFilters();    
    
    ResetRules(first);
    ResetEngines(first);
    ResetSchedules();
}

var Engine_init = function(engine, symbol) {

    Orders = [];
    OrdersHistory = [];
    
    StartDate =  TimeCurrent();    

    GMTShift = GetShiftGMT();

    PG_Print(TYPE_INFO, "- - - - - - - - - - - Expert initialisation  - - - - - - - - - -");
   
    E_NbrEngine = 0;

    enginecontext.Init (symbol, engine.CurrentPeriod, engine.Data) 
    InitMarketInfo(symbol);
    InitRules();
    InitEngines();
    InitSchedules();    


    ResetAll(1);

    LoadEngine(engine);   //E_NbrEngine ++
    Set_Engine(0, B_STARTAUTOMATIC, P_SIGNAL);     
    
    LoadSchedule (engine);

//LoadAllFiles ();
    InitEnginesRuleOrder();
    PG_Print(TYPE_INFO, "- - - - - - - - - - - Expert End initialisation  - - - - - - - - - -");

    engine.FirstPass = 1;
    engine.SecondPass = 0;


    return (0);
}

var Engine_start = function(engine, symbol) {
   
    enginecontext.ResetSignals(engine.Indicators, engine.Signals, engine.Periods, iTime(symbol, engine.CurrentPeriod, 0), engine.FirstPass);
   
    ResetRules(1);
   
    for (const i of engine.Periods) {
        MarketMovement(enginecontext, engine, i,  engine.Data[i], engine.Data[i].length - 1, engine.FirstPass);
    }
    /*
    if (enginecontext.GetTime(P_D1) !== iTime(symbol, P_D1, 0)) {
        MMDailySymbolTargetReached = false;
        MMDailyTargetReached = false;
    }
    */

    CalculateGAverage();
    AccountNbrLots = ReturnAccountNbrLots();
    TreatInRules();

    if (engine.SecondPass == 1) {
        try {
            eval('result = enginecontext.' + 'R_' + engine.StartRule + '_RULE ()')
    
        } catch (error) {
            Engine_Stop(engine);
            Project_ParseError(error.message, -2);
            return;
        }
    
    }

    TreatOutRules();
    TreatEngines();
   
    if (GlobalComment) PG_Comment(engine);
   
    for (const i of engine.Periods) {
        enginecontext.SetTime(iTime(symbol, i, 0), i)
    }
   
    if (engine.FirstPass === 1) {
        engine.SecondPass = 1;
        engine.FirstPass = 0;
    }

    return 0;
}

var Engine_deinit = function() {
    for (var i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] === false) B_deinit(i);
    }
    return (0);
}



//---------------------------------------------------------------- TESTER entry point ---------------------------------------------------------- 

var Engine_Run = function(engine) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;

    let symbol = symbolcanvas.CurrentSymbol;
    let period = symbolcanvas.CurrentPeriod;

    Engine_Stop (engine);
 
    try {
        solution.PL.ParseEngine(engine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);    
        return;        
    }    

    GenerateJSStrategy(solution.CurrentProject.CurrentStrategy, engine);
   
    window.eval(GenerateJSObjects(engine) +
                GenerateVariables(JS_GENERATION, GLOBAL_VARIABLE))
  
    if (engine.MinPeriod == null) {
        engine.MinPeriod = engine.MaxPeriod = period;
        engine.Periods.push(period);            
    }else {
        if (engine.MinPeriod > period) {
            engine.MinPeriod = period;
            engine.Periods.push(period);             
        }
    }     

    engine.CurrentPeriod = engine.MinPeriod; 
   
    var terminal = solution.GetCurrentTerminal();
    if (!terminal) return;
    

    if (terminal == solution.CurrentProject) {
        ProjectSelectPeriod(solution.CurrentProject, symbol, engine.CurrentPeriod, true);
    }
    else
    if (terminal == solution.CurrentOptionTerminal) {
        OptionSelectPeriod(solution.CurrentOptionTerminal, symbol, engine.CurrentPeriod, true);
    } else {
        Symbol_Select(solution.CurrentTerminal, symbol, engine.CurrentPeriod, true, true);      
    }

    var rootid = rootid_fromcanvas(symbolcanvas.ID);

    for (var i = 0; i < NBR_PERIODS; i++) {
        $('#' + rootid + ' .chartpanel  #' + i).prop("disabled", true);
    }

    for (const i of CurrentEngine.Periods) {
        $('#' + rootid + ' .chartpanel  #' + i).prop("disabled", false);
    }
    engineStartAsync = setInterval(FindIdxStartBar, 1, engine, symbol, engine.CurrentPeriod, engine.MaxPeriod, ENGINE_CONTEXT, 1);

    $('#project_tester_velocity_slider').removeAttr('disabled') 
    $('#project_tester_stop_button').removeAttr('disabled') 
    $('#project_tester_play_button label').html('Pause')
    $('#project_tester_play_button i').removeClass (icon_play);
    $('#project_tester_play_button i').addClass (icon_pause);


    return engine;    
}

var Engine_Start = function(engine, symbol, period, startbar, endbar) {

    enginecontext = new ExpertContext('R_' + engine.StartRule + '_RULE', GenerateJSConditions(engine) + engine.JSContent);

    engine.StartBar     = startbar; 
    engine.CurrentBar   = engine.StartBar    
    engine.EndBar       = endbar
    
    for (var i = 0; i < engine.Periods.length; i++) {
        engine.Data[engine.Periods[i]] = [];
    }
    
    for (var i = 0; i < engine.CurrentBar; i++) {
        engine.Data[period].push(Object.assign({}, symbol.chartData[period][i]));
    }
    TestMode = true;   
    symbol.xextents[period] = null    
    Chart_Draw(solution.CurrentProject);

    Engine_init(engine, symbol);
    TICK_STEP = OPEN_TICK;
    if (!PausedSimulator) {
        let value = Math.ceil(document.getElementById('project_tester_velocity_slider').valueAsNumber);
        engineStartAsync = setInterval(EngineAsync_Start, 1000 - value, enginecontext, engine, symbol);
    }
}

var EngineAsync_Start = function(context, engine, symbol) {
    
    if (!engine) return;
    
    if (engine.CurrentBar == engine.EndBar + 1) {
        complete = 100;
        Engine_Stop(engine)
        PausedSimulator = 0;
        return; 
    }
    var bar  = symbol.chartData[engine.CurrentPeriod][engine.CurrentBar];
    var nbroccurence = 1;

    if (TICK_STEP == OPEN_TICK) {
        var pbar = symbol.chartData[engine.CurrentPeriod][engine.CurrentBar-1];
    
        var date  = bar.date;
        var pdate = pbar.date;
        var complete =  Math.round ((engine.CurrentBar -  engine.StartBar) / (engine.EndBar -  engine.StartBar) * 100);
        
        for (const i of engine.Periods) {
            if (engine.FirstPass) {
                InsertBar(context, bar, i, engine.Data);
            } else {
                switch (+i) {
                    case P_M1:
                        if (date.getMinutes() % 1 == 0) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_M5:
                        if (date.getMinutes() % 5 == 0) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_M15:
                        if (date.getMinutes() % 15 == 0) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_M30:
                        if (date.getMinutes() % 30 == 0) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_H1:
                        if (pdate.getHours() != date.getHours()) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_H4:
                        if (date.getHours() % 4 == 0) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                        break;
                    case P_D1:
                        if (pdate.getDay() != date.getDay()) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_W1:
                        if (pdate.getWeek() != date.getWeek()) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                    case P_MN:
                        if (pdate.getMonth() != date.getMonth()) {
                            InsertBar(context, bar, i, engine.Data);
                        }
                    break;
                }
            }
        }
    }    
    
    var nowbar = engine.Data[engine.CurrentPeriod][engine.Data[engine.CurrentPeriod].length - 1];
    switch (TICK_STEP) {
        
       case OPEN_TICK:

           for (const i of engine.Periods) {
                var copybar = engine.Data[i][engine.Data[i].length - 1];
                context.SetClose(nowbar.close, i);
                context.SetHigh(Math.max(context.GetHigh(i), nowbar.high), i);
                context.SetLow(Math.min(context.GetLow(i), nowbar.low), i);
            }
            Bid = nowbar.close;
            Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);

            Engine_start(engine, symbol);

            if (bar.open <  bar.close)  TICK_STEP = LOWSHADOW_TICK;  
            else                        TICK_STEP = UPSHADOW_TICK; 
        break;   
        
       case CLOSE_TICK:

            nowbar.close    = bar.close 
            
            for (const i of engine.Periods) {
                var copybar = engine.Data[i][engine.Data[i].length - 1];
                copybar.close = nowbar.close
                context.SetClose(copybar.close, i);
            }

            Bid = nowbar.close;
            Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);

            Engine_start(engine, symbol);
            
            engine.CurrentBar++;    
            
            TICK_STEP = OPEN_TICK;              
        break;    
 
        case HIGH_TICK:

            nowbar.high     = bar.high;
            nowbar.close    = bar.high;

            for (const i of engine.Periods) {
                var copybar = engine.Data[i][engine.Data[i].length - 1];
                copybar.high = Math.max(context.GetHigh(i), nowbar.high);   
                copybar.close = nowbar.close;       

                context.SetHigh(copybar.high, i)
                context.SetClose(copybar.close, i)
            }

            Bid = nowbar.close;
            Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);

            Engine_start(engine, symbol);

            if (bar.open <  bar.close)  TICK_STEP = CLOSE_TICK;   
            else                        TICK_STEP = BODY_TICK;
        break;          
        case LOW_TICK :          // low
           
            nowbar.low = bar.low;        
            nowbar.close = bar.low;
            
            for (const i of engine.Periods) {
                var copybar = engine.Data[i][engine.Data[i].length - 1];
                copybar.low = Math.min(context.GetLow(i), nowbar.low);      
                copybar.close = nowbar.close;      

                context.SetLow(copybar.low, i)
                context.SetClose(copybar.close, i)
            }

            Bid = nowbar.close;
            Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);
            
            Engine_start(engine, symbol);

            if (bar.open <  bar.close)  TICK_STEP = BODY_TICK;       
            else                        TICK_STEP = CLOSE_TICK;  
        break;   

        case BODY_TICK:        
            for (var k = 0; k < nbroccurence; k++) {
                if (bar.open <  bar.close)  
                    nowbar.close = RandomPrice (bar.open, bar.close);
                else
                    nowbar.close = RandomPrice (bar.close, bar.open);
                
                nowbar.high = Math.max(nowbar.close, nowbar.high);
                nowbar.low = Math.min(nowbar.close, nowbar.low);
                
                
                for (const i of engine.Periods) {
                    var copybar = engine.Data[i][engine.Data[i].length - 1];
                    copybar.high   = Math.max(context.GetHigh(i), nowbar.high);  
                    copybar.low    = Math.min(context.GetLow(i),  nowbar.low);                      
                    copybar.close  = nowbar.close;     


                    context.SetLow (copybar.low ,i)    
                    context.SetHigh (copybar.high ,i)
                    context.SetClose(copybar.close,i)
                }
                Bid = nowbar.close;
                Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);

                Engine_start(engine, symbol);
    
            }
            if (bar.open <  bar.close)  TICK_STEP = UPSHADOW_TICK;    
            else                        TICK_STEP = LOWSHADOW_TICK; 
        break;   

        case UPSHADOW_TICK:
            for (var k = 0; k < nbroccurence; k++) {
                if (bar.open <  bar.close)                 
                    nowbar.close = RandomPrice (bar.close, bar.high);
                else
                    nowbar.close = RandomPrice (bar.open, bar.high);
                nowbar.high = Math.max(nowbar.close, nowbar.high);
        
                for (const i of engine.Periods) {
                    var copybar = engine.Data[i][engine.Data[i].length - 1];
                    copybar.high = Math.max(context.GetHigh(i), nowbar.high)     
                    copybar.close = nowbar.close; 

                    context.SetHigh(copybar.high, i);
                    context.SetClose(copybar.close, i)       
                }
                Bid = nowbar.close;
                Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);

                Engine_start(engine, symbol);

            }
            TICK_STEP = HIGH_TICK;       
        break;  

        case LOWSHADOW_TICK :
            for (var k = 0; k < nbroccurence; k++) {
                if (bar.open <  bar.close)                
                    nowbar.close = RandomPrice (bar.low, bar.open);
                else
                    nowbar.close = RandomPrice (bar.low, bar.close);
                
                nowbar.low = Math.min(nowbar.close, nowbar.low);
               
       
                for (const i of engine.Periods) {
                    var copybar     = engine.Data[i][engine.Data[i].length - 1];
                    copybar.low     = Math.min(context.GetLow(i), nowbar.low);   
                    copybar.close   = nowbar.close; 

                    context.SetLow(copybar.low, i)
                    context.SetClose(copybar.close, i)      
                }

                Bid = nowbar.close;
                Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);
                
                Engine_start(engine, symbol);

            }
            if (bar.open <  bar.close)  TICK_STEP = LOW_TICK;     
            else                        TICK_STEP = LOW_TICK;                
        break;
    }
    Chart_Draw(solution.CurrentProject)          
}


var Engine_Pause = function(engine, pause) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;

    let symbol = symbolcanvas.CurrentSymbol;

    if (pause) {
        if (PausedSimulator) return;
    } else {
        if (!PausedSimulator) return;
    }
    PausedSimulator = pause;
    
    if (PausedSimulator) {
        $('#project_tester_play_button label').html('Run')
        $('#project_tester_play_button i').removeClass (icon_pause);
        $('#project_tester_play_button i').addClass (icon_play);

        clearInterval(engineStartAsync);

    } else {
        if (TestMode) {
            $('#project_tester_play_button label').html('Pause')
            $('#project_tester_play_button i').removeClass (icon_play);
            $('#project_tester_play_button i').addClass (icon_pause);

            let value = Math.ceil(document.getElementById('project_tester_velocity_slider').valueAsNumber);

            engineStartAsync = setInterval(EngineAsync_Start, 1000 - value, enginecontext, engine, symbol);
        }        
    }

}


var Engine_Stop = function(engine, dontcheck) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;
    
    
    Engine_deinit();
 
    engine.Data = [];
    TestMode = false;    
    PausedSimulator = false;
 
    clearInterval(engineStartAsync);
 
    var rootid = rootid_fromcanvas(symbolcanvas.ID);

    for (var i = 0; i < NBR_PERIODS; i++) {
        $('#' + rootid + ' .chartpanel  #' + i).prop("disabled", false);
    }

    $('#project_tester_play_button label').html('Run')
    $('#project_tester_play_button i').removeClass (icon_pause);
    $('#project_tester_play_button i').addClass (icon_play);    
    $('#project_tester_stop_button').attr('disabled',true);

    symbolcanvas.CurrentSymbol.xextents[engine.CurrentPeriod] = null; //extents
    SelectChart(engine.CurrentPeriod);
    Chart_Draw(solution.CurrentProject) 
 }

//=============================================INIT  ========================================

var onchange_strategy_velocity = function(elt) {
    if (!TestMode) return;
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;

    let symbol = symbolcanvas.CurrentSymbol;

    let value = Math.ceil(elt.valueAsNumber);
    clearInterval(engineStartAsync);
    engineStartAsync = setInterval(EngineAsync_Start, 1000 - value, enginecontext, CurrentEngine, symbol);
}

//=============================================SCHEDULES========================================

var NBR_SCHEDULES = 3; // nbr schedule by rule, operation


var S_StartM = []; // this should be set to 0 when not used
var S_StartW = [];
var S_StartD = [];
var S_StartT = [];
var S_EndM = [];
var S_EndW = [];
var S_EndD = [];
var S_EndT = [];
var S_FrequencyD = [];
var S_OnSameBar= [];
var S_BetweenT = [];
var S_TimeZone = [];
var S_NbrRuleStart = [];
var S_NbrRuleStartW = [];
var S_NbrRuleStartD = [];
var S_LastCloseTime = [];

var LoadSchedule = function (engine) {
    var schedule = engine.Schedules[0];
    var k = 0;
    
    var Rule = Rule2Int(schedule.StartRule);
    var Operation = Operation2Int(schedule.Operation);
    var SSymbol = schedule.Currency;

    S_StartM[Rule][Operation][k] = parseInt(schedule.StartMonth);

    S_StartW[Rule][Operation][k] = parseInt(schedule.FromOccurenceWeek);
    S_StartD[Rule][Operation][k] = parseInt(schedule.StartDay);

    var stime =  schedule.StartTime;
    if (stime == "-1")
        S_StartT[Rule][Operation][k] = parseInt(stime);
    else
        S_StartT[Rule][Operation][k] = schedule.StartTime;
    
    S_EndM[Rule][Operation][k] = parseInt(schedule.EndMonth);
    S_EndW[Rule][Operation][k] = parseInt(schedule.ToOccurenceWeek);
    S_EndD[Rule][Operation][k] = parseInt(schedule.EndDay);

    var etime = schedule.EndTime;
    if (etime == "-1")
        S_EndT[Rule][Operation][k] = parseInt(etime);
    else
        S_EndT[Rule][Operation][k] = schedule.EndTime;           

    S_FrequencyD[Rule][Operation][k] = parseInt(schedule.FrequencyDay);
    S_OnSameBar[Rule][Operation][k] = parseInt(schedule.OnSameBar);

    S_BetweenT[Rule][Operation][k] = parseInt(schedule.TimeBetweenSession);
    S_TimeZone[Rule][Operation][k] = parseInt(schedule.TimeZone);
    if (S_TimeZone[Rule][Operation][k] == 1) {
        S_StartT[Rule][Operation][k] = S_StartT[Rule][Operation][k] - GMTShift;
        S_EndT[Rule][Operation][k] = S_EndT[Rule][Operation][k] - GMTShift;
    }
}

var InitSchedules = function() {
    for (var i = 0; i < NBR_RULES; i++) {
        S_StartM[i] = new Array();
        S_StartW[i] = new Array();
        S_StartD[i] = new Array();
        S_StartT[i] = new Array();
        S_EndM[i] = new Array();
        S_EndW[i] = new Array();
        S_EndD[i] = new Array();
        S_EndT[i] = new Array();
        
        S_FrequencyD[i] = new Array();
        S_OnSameBar[i] = new Array();
        S_BetweenT[i] = new Array();
        S_TimeZone[i] = new Array();
        for (var j = 0; j < 3; j++) {
            S_StartM[i][j] = new Array();
            S_StartW[i][j] = new Array();
            S_StartD[i][j] = new Array();
            S_StartT[i][j] = new Array();
            S_EndM[i][j] = new Array();
            S_EndW[i][j] = new Array();
            S_EndD[i][j] = new Array();
            S_EndT[i][j] = new Array();
            S_FrequencyD[i][j] = new Array();
            S_OnSameBar[i][j] = new Array();            
            S_BetweenT[i][j] = new Array();
            S_TimeZone[i][j] = new Array();
        }
    }
    for (var i = 0; i <= NBR_RULES; i++) {
        S_NbrRuleStart[i] = new Array(NBR_SCHEDULES).fill(0);
        S_NbrRuleStartW[i] = new Array(NBR_SCHEDULES).fill(0);
        S_NbrRuleStartD[i] = new Array(NBR_SCHEDULES).fill(0);
        S_LastCloseTime[i] = new Array(NBR_SCHEDULES).fill(0);
    }
}

var ResetSchedules = function() {
    for (var i = 0; i < NBR_RULES; i++) {
        for (var k = 0; k < NBR_SCHEDULES; k++) {
            for (var j = 0; j < 3; j++) {
                S_StartM[i][j][k] = 0;
                S_StartW[i][j][k] = -1;
                S_StartD[i][j][k] = -1;
                S_StartT[i][j][k] = -1;
                S_EndM[i][j][k] = -1;
                S_EndW[i][j][k] = -1;
                S_EndD[i][j][k] = -1;
                S_EndT[i][j][k] = -1;
                S_FrequencyD[i][j][k] = -1;
                S_OnSameBar[i][j][k] = -1;                
            }
        }
    }
}

var ReturnNumberRuleStarted = function(rule, operation) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    var myprofit = 0;
    var today = "";
    var timemidnight = new Date();
    var StartDate = new Date();
    var LastOrderCloseTime = 0;
    var PStartDate = -1;
    var nbrrulestart = 0;
    var nbrrulestartd = 0;
    today = timeToString(TimeCurrent(), TIME_DATE);
    timemidnight = stringToTime(today);
    S_NbrRuleStart[rule][operation] = 0;
    S_NbrRuleStartD[rule][operation] = 0;
    var sComment = "";
    var slpos = 0;
    var tppos = 0;
    var spos = 0;
    var xtotal = OrdersHistoryTotal();
    for (var cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderType() <= OP_SELL && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            sComment = OrderComment();
            slpos = sComment.indexof("[sl]");
            tppos = sComment.indexof("[tp]");
            spos = 0;
            if (slpos === 0 || tppos === 0) {
                spos = 4;
                while (sComment.charCodeAt(spos) === ' '.charCodeAt(0)) {
                    spos++;
                }
            }
            var OrderOperation = toNumber(B_ReadSInfo(OrderComment(), spos + 11, 1));
            var OrderRule = Rule2Int(B_ReadSInfo(OrderComment(), spos + 10, 1));
            if (OrderRule === rule) {
                if (OrderOperation === operation) {
                    if (OrderCloseTime() > LastOrderCloseTime) LastOrderCloseTime = OrderCloseTime();
                    S_LastCloseTime[rule][OrderOperation] = LastOrderCloseTime;
                    StartDate = toNumber(B_ReadSInfo(OrderComment(), 0, 10));
                    if (PStartDate !== StartDate) {
                        nbrrulestart++;
                        PStartDate = StartDate;
                        S_NbrRuleStart[rule][OrderOperation] = nbrrulestart;
                        if (StartDate >= timemidnight) {
                            nbrrulestartd++;
                            S_NbrRuleStartD[rule][OrderOperation] = nbrrulestartd;
                        }
                    }
                }
            }
        }
    }
    return nbrrulestart;
}

//============================================= ENGINES==========================================



var LoadEngine = function(engine) {
    
    Set_Engine_Value(E_NbrEngine, B_OPERATION, Operation2Int(engine.Operation));
    Set_Engine_Value(E_NbrEngine, B_STARTRULE, Rule2Int(engine.StartRule));
    Set_Engine_Value(E_NbrEngine, B_BUYRULE, Rule2Int(engine.BuyRule));
    Set_Engine_Value(E_NbrEngine, B_SELLRULE, Rule2Int(engine.SellRule));
    Set_Engine_Value(E_NbrEngine, B_EXITBUYRULE, Rule2Int(engine.ExitBuyRule));
    Set_Engine_Value(E_NbrEngine, B_EXITSELLRULE, Rule2Int(engine.ExitSellRule));
    Set_Engine_Value(E_NbrEngine, B_EXITRULE, Rule2Int(engine.ExitRule));
    Set_Engine_Value(E_NbrEngine, B_ILOT, +engine.ILot);
    Set_Engine_Value(E_NbrEngine, B_MAXLOT, +engine.MaxLot);
    Set_Engine_Value(E_NbrEngine, B_MAXCOUNT, +engine.MaxCount);
    

    Set_Engine_Value(E_NbrEngine, B_DIRECTION, Direction2Int(engine.Direction));
    Set_Engine_Value(E_NbrEngine, B_DIRECTIONTYPE, DirectionType2Int(engine.DirectionType));
    Set_Engine_Value(E_NbrEngine, B_RECOVERYMODE, Mode2Int(engine.RecoveryMode));
    Set_Engine_Value(E_NbrEngine, B_RECOVERYVALUE, +engine.RecoveryValue);
    Set_Engine_Value(E_NbrEngine, B_PIPSTEP, +engine.PipStep);
    Set_Engine_Value(E_NbrEngine, B_TIMESTEP, +engine.TimeStep);
    Set_Engine_Value(E_NbrEngine, B_ORDERTYPE, OrderType2Int(engine.OrderType));
    Set_Engine_Value(E_NbrEngine, B_KEEPBUYSELL, (engine.KeepBuySell == "FALSE" ? 0 : 1));
    Set_Engine_Value(E_NbrEngine, B_EXITMODE, ExitMode2Int(engine.ExitMode));
    Set_Engine_Value(E_NbrEngine, B_ONEORDERPERBAR, (engine.OneOrderPerBar == "FALSE" ? 0 : 1));    

    Set_Engine_Value(E_NbrEngine, B_MAXTIME, +engine.MaxTime);
    Set_Engine_Value(E_NbrEngine, B_HEDGEMAGNITUDE, +engine.HedgeMagnitude);
    Set_Engine_Value(E_NbrEngine, B_MINPROFIT, +engine.MinProfit);
    Set_Engine_Value(E_NbrEngine, B_BUYMINPROFIT, +engine.BuyMinProfit);
    Set_Engine_Value(E_NbrEngine, B_SELLMINPROFIT, +engine.SellMinProfit);
    Set_Engine_Value(E_NbrEngine, B_TP, +engine.TP);
    Set_Engine_Value(E_NbrEngine, B_TS, +engine.TS);
    Set_Engine_Value(E_NbrEngine, B_SL, +engine.SL);
    Set_Engine_Value(E_NbrEngine, B_BUYTP, +engine.BuyTP);
    Set_Engine_Value(E_NbrEngine, B_BUYTS, +engine.BuyTS);
    Set_Engine_Value(E_NbrEngine, B_BUYSL, +engine.BuySL);
    Set_Engine_Value(E_NbrEngine, B_SELLTP, +engine.SellTP);
    Set_Engine_Value(E_NbrEngine, B_SELLTS, +engine.SellTS);
    Set_Engine_Value(E_NbrEngine, B_SELLSL, +engine.SellSL);
    Set_Engine_Value(E_NbrEngine, B_BUYLOTTP, +engine.BuyLotTP);
    Set_Engine_Value(E_NbrEngine, B_BUYLOTTS, +engine.BuyLotTS);
    Set_Engine_Value(E_NbrEngine, B_BUYLOTSL, +engine.BuyLotSL);
    Set_Engine_Value(E_NbrEngine, B_SELLLOTTP, +engine.SellLotTP);
    Set_Engine_Value(E_NbrEngine, B_SELLLOTTS, +engine.SellLotTS);
    Set_Engine_Value(E_NbrEngine, B_SELLLOTSL, +engine.SellLotSL);
    E_NbrEngine++;
}

var EngineTab           = [];
var EngineTabValue      = [];
var EngineStartRule     = [];

var Set_Engine = function(Engine, attribute, signal, value) {
    switch (arguments.length) {
        case 3:
            value = -1;
    }
    //if automatic  0 else 1
    if (Engine === -1) return;
    var index = attribute >> 5;
    if (signal === P_SIGNAL) EngineTab[Engine][index] |= (1 << (attribute & 31));
    else EngineTab[Engine][index] &= ~(1 << (attribute & 31));
    if (value !== -1) Set_Engine_Value(Engine, attribute, value);
}



var ResetEngines = function(first) {
    switch (arguments.length) {
        case 0:
            first = -1;
    }
    for (var i = 0; i < NBR_ENGINES; i++) {
        EngineTab[i][0] = 0;
        EngineTab[i][1] = 0;
        for (var k = 0; k < NBR_ATTRIBUTES; k++) {
            Set_Engine(i, k, P_SIGNAL);
            if (k === B_STARTAUTOMATIC) {
                Set_Engine(i, k, P_NOSIGNAL);
            }
            if (first === 1) EngineTabValue[i][k] = -1;
        }
    }
}

var AndE = function(Engine, attribute) {
    var index = attribute >> 5;
    var result = 0;
    result |= (1 << (attribute & 31));
    return (EngineTab[Engine][index] & result) === result;
}

var OrE = function(Engine, attribute) {
    var result = 0;
    var index = attribute >> 5;
    result |= (1 << (attribute & 31));
    return (EngineTab[Engine][index] & result) !== 0;
}

var Get_Engine = function(Engine, attribute) {
    var index = attribute >> 5;
    return EngineTab[Engine][index] & (1 << (attribute & 31));
}

var Set_Engine_Value = function(Engine, attribute, Value) {
    EngineTabValue[Engine][attribute] = Value;
    return Value;
}

var EValue = function(Engine, attribute) {
    return EngineTabValue[Engine][attribute];
}

var GetEngine = function(startrule, operation) {
    for (var i = 0; i < E_NbrEngine; i++) {
        if (EValue(i, B_STARTRULE) === startrule && EValue(i, B_OPERATION) === operation) return i;
    }
    return -1;
}

var RuleOrder           = [];

var InitEnginesRuleOrder = function() {
    for (var k = 0; k < NBR_RULES; k++) {
        RuleOrder[k] = -1;
    }
    k = 0;
    var lastrule = -1;
    for (var i = 0; i < E_NbrEngine; i++) {
        if (EValue(i, B_STARTRULE) !== lastrule) {
            RuleOrder[k] = EValue(i, B_STARTRULE);
            lastrule = RuleOrder[k];
            k++;
        }
    }
}

var InitEngines = function() {
    for (var i = 0; i < NBR_ENGINES; i++) {
        EngineTabValue[i] = new Array();
        EngineTab[i] = new Array();
    }
}

//================================================= RULES TAB ==========================================

var RuleTab             = [];
var BeforeRuleTab       = [];
var RuleTabValue        = [];
var BeforeRuleTabValue  = [];
var RuleFilterTab       = [];


var ResetRules = function(first) {
    switch (arguments.length) {
        case 0:
            first = -1;
    }
    // only status is reset
    for (var i = 0; i < NBR_OPERATIONS; i++) {
        for (var j = 0; j < NBR_FIELDS; j++) {
            BeforeRuleTab[i][j] = RuleTab[i][j];
            RuleTab[i][j] = 0;
            if (first === 1)
                for (var k = 0; k < NBR_RULES; k++) {
                    if (j === T_BUYNBRTRADE || j === T_SELLNBRTRADE) RuleTabValue[i][j][k] = 0;
                    else RuleTabValue[i][j][k] = 0;
                }
        }
    }
}

var InitRules = function() {
    for (var i = 0; i < NBR_OPERATIONS; i++) {
        RuleTab[i] = new Array();
        BeforeRuleTab[i] = new Array();
        RuleTabValue[i] = new Array();
        BeforeRuleTabValue[i] = new Array();
        RuleFilterTab[i] = new Array();
        for (var j = 0; j < NBR_FIELDS; j++) {
            RuleTabValue[i][j] = new Array();
            BeforeRuleTabValue[i][j] = new Array();
            RuleFilterTab[i][j] = new Array();
        }
    }
}


//=========================================RULES FUNCTIONS============================================================

var AndR = function(Operation, OperationType, rule, rule1, rule2, rule3, rule4, rule5) {
    switch (arguments.length) {
        case 3:
            rule1 = -1;
        case 4:
            rule2 = -1;
        case 5:
            rule3 = -1;
        case 6:
            rule4 = -1;
        case 7:
            rule5 = -1;
    }
    var result = 0;
    result |= (1 << rule);
    if (rule1 !== -1) result |= (1 << rule1);
    if (rule2 !== -1) result |= (1 << rule2);
    if (rule3 !== -1) result |= (1 << rule3);
    if (rule4 !== -1) result |= (1 << rule4);
    if (rule5 !== -1) result |= (1 << rule5);
    return (RuleTab[Operation][OperationType] & result) === result;
}

var OrR = function(Operation, OperationType, rule, rule1, rule2, rule3, rule4, rule5) {
    switch (arguments.length) {
        case 3:
            rule1 = -1;
        case 4:
            rule2 = -1;
        case 5:
            rule3 = -1;
        case 6:
            rule4 = -1;
        case 7:
            rule5 = -1;
    }
    var result = 0;
    result |= (1 << rule);
    if (rule1 !== -1) result |= (1 << rule1);
    if (rule2 !== -1) result |= (1 << rule2);
    if (rule3 !== -1) result |= (1 << rule3);
    if (rule4 !== -1) result |= (1 << rule4);
    if (rule5 !== -1) result |= (1 << rule5);
    return (RuleTab[Operation][OperationType] & result) !== 0;
}

var AndCR = function(Operation, OperationType, rule) {
    return (RuleTab[Operation][OperationType] & rule) === rule;
}

var OrCR = function(Operation, OperationType, rule) {
    return (RuleTab[Operation][OperationType] & rule) !== 0;
}

var Set_Rule = function(Operation, OperationType, rule, signal, value) {
    switch (arguments.length) {
        case 4:
            value = -1;
    }
    if (signal === P_SIGNAL) RuleTab[Operation][OperationType] |= (1 << rule);
    else RuleTab[Operation][OperationType] &= ~(1 << rule);
    Set_Rule_Value(Operation, OperationType, rule, value);
}

var Get_Rule = function(Operation, OperationType, rule) {
    return RuleTab[Operation][OperationType] & (1 << rule);
}

var Get_Previous_Rule = function(Operation, OperationType, rule) {
    return BeforeRuleTab[Operation][OperationType] & (1 << rule);
}

var Set_Rule_Value = function(Operation, OperationType, rule, Value) {
    RuleTabValue[Operation][OperationType][rule] = Value;
}

var RValue = function(Operation, OperationType, rule) {
    return RuleTabValue[Operation][OperationType][rule];
}

var Get_Previous_Filter_Value = function(Operation, OperationType, rule) {
    return BeforeRuleTabValue[Operation][OperationType][rule];
}

var SetRuleFilter = function(add, Operation, OperationType, rule) {
    if (rule === -1)
        for (var x = 0; x < NBR_RULES; x++) {
            if (OperationType === -1)
                if (Operation === -1)
                    for (var i = 0; i < NBR_OPERATIONS; i++) {
                        for (var j = 0; j < NBR_FIELDS; j++) {
                            RuleFilterTab[i][j][x] = add;
                        }
                    } else
                        for (j = 0; j < NBR_FIELDS; j++) {
                            RuleFilterTab[Operation][j][x] = add;
                        } else if (Operation === -1)
                            for (i = 0; i < NBR_OPERATIONS; i++) {
                                RuleFilterTab[i][OperationType][x] = add;
                            } else RuleFilterTab[Operation][OperationType][x] = add;
        } else if (OperationType === -1)
            if (Operation === -1)
                for (i = 0; i < NBR_OPERATIONS; i++) {
                    for (j = 0; j < NBR_FIELDS; j++) {
                        RuleFilterTab[i][j][rule] = add;
                    }
                } else
                    for (j = 0; j < NBR_FIELDS; j++) {
                        RuleFilterTab[Operation][j][rule] = add;
                    } else RuleFilterTab[Operation][OperationType][rule] = add;
}

var ResetRuleFilters = function() {
    for (var i = 0; i < NBR_OPERATIONS; i++) {
        for (var j = 0; j < NBR_FIELDS; j++) {
            for (var x = 0; x < NBR_RULES; x++) {
                RuleFilterTab[i][j][x] = 0;
            }
        }
    }
}

var GetRuleFilter = function(Operation, OperationType, rule) {
    return RuleFilterTab[Operation][OperationType][rule];
}

var OnSameBar = function (period, time) {
    var date = new Date (time);
    switch (period) {
        case P_M1 :
        if (TimeCurrent() - time < 60 && GetMinutes(TimeCurrent()) == GetMinutes(time))
            return true;     
        break;
        case P_M5 :
             if (TimeCurrent() - time < 60 * 5 && GetMinutes(TimeCurrent()) / 5 == GetMinutes(time) / 5)
                return true;         
        break;
        case P_M15 :
            if (TimeCurrent() - time < 60 * 15 && GetMinutes(TimeCurrent()) / 15 == GetMinutes(time) / 15)
                return true;
        break;
        case P_M30 :
            if (TimeCurrent() - time < 60 * 30 && GetMinutes(TimeCurrent()) / 30 == GetMinutes(time) / 30)
                return true;
        break;
        case P_H1 :
            if (TimeCurrent() - time < 60 * 60 && GetHours(TimeCurrent()) == GetHours(time))       
                return true;
        break;
        case P_H4 :
            if (TimeCurrent() - time < 60 * 60 * 4 && GetHours(TimeCurrent()) / 4 == GetHours(time) / 4)       
                return true;
        break;
        case P_D1 :
            if (GetDay(TimeCurrent()) == GetDay(time))       
                return true;
        break;
        case P_W1 :
            if (GetWeek(TimeCurrent()) == GetWeek(time))       
                return true;
        break;
        case P_MN :
            if (GetMonth(TimeCurrent()) == GetMonth(time))       
                return true;
        break;
        }
}