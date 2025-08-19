const MT4SERVER               = "MT4SERVER";
const MT4TERMINAL             = "MT4TERMINAL";
var tradedesk_MT4Com          = null;


var EngineBuyNbrTab             = [];
var EngineSellNbrTab            = [];
var EngineRunningTab            = [];
var EngineValueTab              = [];
var EngineColorTab              = [];
var EngineBuySellTab            = [];
var EngineTextColorTab          = [];
var SignalValueTab              = [];
var SignalColorTab              = [];
var SystemSignalValueTab        = [];
var SystemSignalColorTab        = [];
var SystemSignalTimeTab         = [];
var ProgressSignalValueTab      = [];

function tradedesk_currency_updatesymbolrow (terminal, symbolname, connect) {
    if (!terminal || terminal != solution.CurrentTerminal) {
        return;
    }

    var symbol = terminal.PG.GetSymbolFromName(symbolname);
    if (!symbol) {

        console.log ('new symbol has been added on expert')
    }

    
    var rowid = terminal.PG.GetSymbolIndexFromName(symbolname);

    sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Connected', (connect ? 'On' : 'Off'));
    sb.table_setcellcolor (tradedeskcurrenciestable, rowid, 'Connected', (connect ? theme_bull : theme_bear));

    if (!connect) {
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Bid', '---');
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Ask', '---');
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Period', '---');
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Buy', '---');
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Sell', '---');
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Spread', '---');
        sb.table_setcellcontent (tradedeskcurrenciestable, rowid, 'Pip Value', '---');
        sb.table_setcellbackground (tradedeskcurrenciestable, rowid, 'Buy', '');       
        sb.table_setcellbackground (tradedeskcurrenciestable, rowid, 'Sell', '');                 
        
    }

}
function tradedesk_highlightserver(origin, terminal, connect, color) {
    let elt = '';

    switch (origin) {
        case MT4SERVER:
            $('#tradedesk_terminals_headerpanel #button_server').css ('background', connect ? color : ''); 
            $('#tradedesk_terminals_headerpanel #button_server').css ('color', connect ? '#000000' : '');            
            solution.Terminals.forEach ((terminal, index, terminals) => {if (terminal.Type == 'Terminal' || terminal.Type == 'Tester') {terminal.InitDone = false; terminal.Running  = false;}}); 

            if (!connect) {
                //$('#button_card').css ('background', ''); 
                //$('#button_terminal').css ('background', ''); 
                //$('#button_card').css ('color',  '');            
                //$('#button_terminal').css ('color',  '');  
            }

        break;      
        case MT4TERMINAL:
            if (connect) {
                sb.tree_setitemcolor ('tradedesk_tree_terminals', terminal.Name,  connect ? color : ''); 
                $('#tradedesk_terminalselect option[value="' + terminal.Name + '"]').css('color', color);
                if (terminal.Type == 'Tester' && terminal.Running == true) {
                     $('#radio_terminaltype label').css (color, color)
                }
                
                if (terminal.Type == 'Terminal' && terminal.Running == true) {
                       $('#radio_testertype label').css (color, color)
                }

            }  else {
                if ((terminal.Type == 'Tester' && solution.GetTerminalFromNameType(terminal.Name, 'Terminal').Running == false) ||
                    (terminal.Type == 'Terminal' && solution.GetTerminalFromNameType(terminal.Name, 'Tester').Running == false)) {
                       sb.tree_setitemcolor ('tradedesk_tree_terminals', terminal.Name, ''); 
                       $('#tradedesk_terminalselect option[value="' + terminal.Name + '"]').css('color', '');
                       $('#radio_terminaltype label').css (color, '')
                       $('#radio_testertype label').css (color, '')


                }  
        }
        break;
    }  
}   

function tradedesk_ask_Login_symbols(com, terminal) {
   com.Send(solution.get('user').id + '*LOGIN*' + terminal.Type + '*' + terminal.Name);
}

function tradedesk_ask_tostop(com, terminal) {
    com.Send(solution.get('user').id + '*START*' + terminal.Type + '*' + terminal.Name + '*0'); 
}

function tradedesk_ask_tostart(com, terminal) {
   com.Send(solution.get('user').id + '*START*' + terminal.Type + '*' + terminal.Name + '*1'); 
}

function tradedesk_ask_history(com, symbol, period, from, to) {
    let userid = solution.get('user').id;
    if (userid == 0) userid = 1;

   com.Send(userid  + '*' + symbol.Name + '*GET_HISTORY ' + symbol.Name + ' = [' + period + ' '  + from + ' ' + to + '] '); 
}


function MT4Connect(adress, port, reconnection) {

    if (tradedesk_MT4Com && tradedesk_MT4Com.Socket.connected == true) 
        return;

    tradedesk_MT4Com = new connect (adress, port, 
        {
            onconnectfunction:  function (com) {

                tradedesk_highlightserver(MT4SERVER, null, 1,  theme_on)

                //let terminal = solution.GetTerminalFromCom(com)
                //terminal.InitDone = false;
                //terminal.Running  = false;
                //tradedesk_ask_Login_symbols (com, terminal)     
                //if (solution.CurrentTerminal && terminal == solution.CurrentTerminal) {
                //    tradedesk_ask_tostart (terminal)
                //}
                
                solution.Terminals.forEach ((terminal, index, terminals) => {(terminal.Type == 'Terminal' || terminal.Type == 'Tester') && tradedesk_ask_Login_symbols(com, terminal) }, com); 

                if (solution.CurrentTerminal) {
                    tradedesk_ask_tostart (com, solution.CurrentTerminal)
                }
            },
            onmessagefunction: function (com, data) {
                
                MT4TreatReception (com, data);

            },    
            ondisconnectfunction:     function (com, data) {tradedesk_highlightserver(MT4SERVER, null, 0); },
            onclosefunction:          function (com, data) {tradedesk_highlightserver(MT4SERVER, null, 0); },
            onerrorfunction:          function (com, data) {tradedesk_highlightserver(MT4SERVER, null, 0); },   
            onupdatefunction:         function (com, data) {tradedesk_highlightserver(MT4SERVER, null, 0); },
            onconnect_errorfunction:  function (com, data) {tradedesk_highlightserver(MT4SERVER, null, 0); },
            onconnect_failedfunction: function (com, data) {tradedesk_highlightserver(MT4SERVER, null, 0); },    
            reconnection:             reconnection ? reconnection : false              
        }
    )
    tradedesk_MT4Com.Name = MT4SERVER;
    return  tradedesk_MT4Com.Socket;
}

 
function MT4TreatReception(com,  recmessage) {        
    if (!recmessage) return;
    
    if (recmessage.substring(0, 1) != ":") {
        console.log ("Receiveing strange on " + com.Name);
    }
 
    var index       = recmessage.indexOf("*");
    var message     = recmessage.substring(index + 1);
    var symbolname  = recmessage.substring(1, index);
     
    var output;
    var length = message.length;
 
    if (com.Buffer !== undefined) {
        if (message[length - 1] != "*") {
            com.Buffer  = com.Buffer + message;
            return;
        } else {
            output = com.Buffer + message;
        }
    } else {
        com.Buffer = message;
        output = message;
    }
    com.Buffer = "";


    var lines = output.split('*');
    length = lines.length;
    for (var j = 0; j < length; j++) {
        if (lines[j].length < 1) continue;
        var Line = lines[j];
        var values = Line.split('^');
        MT4TreatCommand(Line, values);
    }
}

function MT4TreatCommand(Line, values) {
    
    if (values[0] == "LOGIN") {
        TreatLogin(values);
        return;
    } else
    if (values[0] == "CONNECT") {
        TreatConnect(values);
        return;        
    } else
    if (values[0] == "INIT") {
        TreatInit(values);
        return;        
    }

    if (!solution.CurrentTerminal)
        return;

    let terminal = solution.CurrentTerminal;

    if (values[0] == "SYMBOL") {
        TradedeskTreatSymbol(terminal, values);
    } else
    if (values[0] == "MM") {
        TreatTargets(terminal, values);
    } else
    if (values[0] == "ENGINE") {
        TreatSession(terminal, values);
    } else
    if (values[0] == "HISTORY") {
        TreatHistory(terminal, values);
    } else
    if (values[0] == "HISTORYFILE") {
        TreatHistoryFile(terminal, values);
    } else
    if (values[0] == "PROFIT") {
        TreatProfit(terminal, values);
    } else
    if (values[0] == "PIVOT") {
        TreatPivot(terminal, values);
    } else
    if (values[0] == "SESSION") {
        TreatSessionAttributes(terminal, values);
    } else
    if (values[0] == "ENGINEFLAGS") {
        TreatEngineFlags(terminal, values);
    } else
    if (values[0] == "OPERATION") {
        TreatInfo(values[1]);
    } else
    if (values[0] == "SDATA") {
        TreatData(terminal, values, ENGINE_ORDER);
    } else
    if (values[0] == "DATA") {
        TreatData(terminal, values, MANUAL_ORDER);
    } else
    if (values[0] == "ALERT") {
        TreatAlert(terminal, values);
    } else
    if (values[0] == "RULEFLAGS") {
        TreatRuleFlags(terminal, values);
    } else
    if (values[0] == "SIGNAL") {
        TreatSignal(terminal, values);
    } else
    if (values[0] == "SIGNALTIME") {
        TreatSignal(terminal, values, 1);
    }
}




function TreatLogin(values) {  
    let userid          = values[1];
    let terminalname    = values[2];
    let terminaltype    = values[3];
    let symbolname      = values[4];
    let responsestate   = values[5];    
 
    let connect = false;

    let terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) {
        console.log ('strange LOGIN for treat login terminalname : ' + terminalname + ' terminaltype : ' + terminaltype);
        return;
    }
    terminal.Running = (responsestate == "OK");       

    tradedesk_highlightserver(MT4TERMINAL, terminal, terminal.Running,  theme_on);  
  
}


// CONNECT FROM SERVER RECEIVED WHEN MT4 TERMINAL INIT  AFTER HTTP CONNECTION (user is verified) OR WHEN MT4 TERMINAL DISCONNECT 

function TreatConnect(values) {
    let userid          = values[1];
    let terminalname    = values[2];
    let terminaltype    = values[3];
    let symbolname      = values[4];
    let responsestate   = values[5];     
    
    let terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) {
        console.log ('strange CONNECT for treat connect terminalname : ' + terminalname + ' terminaltype : ' + terminaltype);
        return;
    }
    terminal.Running = (responsestate == "OK");       
    tradedesk_currency_updatesymbolrow  (terminal, symbolname, terminal.Running)
}


function TreatInit(values) {
    let userid          = values[1];
    let terminalname    = values[2];
    let terminaltype    = values[3];
    let symbolname      = values[4];

    let terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    if (!terminal) {
        console.log ('strange INIT for treat init terminalname : ' + terminalname + ' terminaltype : ' + terminaltype);
        return;
    }

    let i = 4;

    var name        = values[++i],         //1
        pname       = values[++i],
        minlot      = values[++i],
        maxlot      = values[++i],
        lotstep     = values[++i],
        spread      = values[++i],
        stoplevel   = values[++i],
        point       = values[++i],
        digits      = values[++i],
        lotsize     = values[++i],
        tester      = values[++i],
        period      = +values[++i],

        accountnumber       = values[++i],
        accountcurrency     = values[++i],
        accountstartdate    = values[++i],
        terminalbuild       = values[++i],
        terminaltimeshift   = values[++i],
        accountname         = values[++i],
        terminalcompany     = values[++i],
        terminalname1        = values[++i],
        terminalpath        = values[++i],
        terminaldatapath    = values[++i];
    
    let terminaltype1 = tester == 1 ? 'Tester' : 'Terminal';

    var offset = parseInt(terminaltimeshift);

    terminaltimeshift = -offset / 60 / 60; //hours
    
    terminal.User.AccountNumber     = accountnumber;
    terminal.User.AccountCurrency   = accountcurrency
    terminal.User.AccountStartDate  = +accountstartdate * 1000;
    terminal.User.AccountName       = accountname
    
    terminal.Set(terminalpath, terminaldatapath, terminalbuild, terminalname, terminalcompany, terminaltimeshift, name, terminaltype, period);
    
    var symbol = terminal.PG.GetSymbolFromName(name);
    if (!symbol) {
        symbol = new pgsymbol(name);
        symbol.Set(name, pname, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize, tester, period);

        terminal.PG.AddSymbol(symbol);
        symbol.Connected = true;
    }
    symbol.Period = period;
    DisplayTerminal(terminal, symbol);
}


//----------------------------------------------------TRADEDESK DIALOGUE------------------------------------------------ 

function TradedeskCurrency_Update (terminal, Symbol) {

    var rowid = terminal.PG.GetSymbolIndexFromName(Symbol.Name);

    sb.table_setcellchildcontent (tradedeskcurrenciestable, rowid, 'Connected', 'On');
    sb.table_setcellchildcontent (tradedeskcurrenciestable, rowid, 'Ask', Symbol.Ask);
    sb.table_setcellchildcontent (tradedeskcurrenciestable, rowid, 'Bid', Symbol.Bid);
    sb.table_setcellchildcontent (tradedeskcurrenciestable, rowid, 'Spread', Symbol.Spread);
    sb.table_setcellchildcontent (tradedeskcurrenciestable, rowid, 'Pip Value', (Symbol.PipValue > 0 ? Symbol.PipValue : '---'));

    if (Symbol.Spread > 1) {
        sb.table_setcellchildbackground (tradedeskcurrenciestable, rowid, 'Spread', 'var(--theme-warning)');
        sb.table_setcellchildcolor (tradedeskcurrenciestable, rowid, 'Spread', 'white');
    }            
    else {
        sb.table_setcellchildbackground (tradedeskcurrenciestable, rowid, 'Spread', '');
    }         
    sb.table_setcellchildcolor (tradedeskcurrenciestable, rowid, 'Connected', theme_bull);
}

function ATR_Indicator(data, period) {
    let lows = [];
    let closes = [];
    let highs = [];
    let from = data.length - (period + 1);

    if (from >= 0) {
        for (var i = from; i < data.length; i++) {
            closes.push(data[i].close);
            highs.push(data[i].high);
            lows.push(data[i].low);
        }
        var result = ATR.calculate({
            period: period,
            low: lows,
            close: closes,
            high: highs
        });
        return result[result.length - 1];
    }
    return 0; 
}

function TradedeskTreatSymbol(terminal, values, selected) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) {
        return;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;        
    
    Symbol.Connected = true;
    Symbol.Ask = (+values[3]).toFixed(Symbol.Digits);
    Symbol.Bid = (+values[4]).toFixed(Symbol.Digits);
    Symbol.PriceChange = (Symbol.Bid - Symbol.Last).toFixed(Symbol.Digits);
    Symbol.Last  = Symbol.Bid;


    Symbol.Spread = ((Symbol.Ask - Symbol.Bid) / Symbol.SysPoint).toFixed(1);


// calculate ATR     
    var fromperiod = +values[2];
 
    for (var i = fromperiod; i < PeriodName.length; i++) {
        if (!Symbol.WaitHistory[i]) {
      
            Chart_UpdateData(terminal, Symbol, i, +values[9], +values[5], +values[6], +values[7], +values[8],  +values[10]);
            
            Symbol.ATR[i] = ATR_Indicator(Symbol.chartData[i], 14).toFixed(Symbol.Digits);

        }
    }

 // calculate tick value
    Symbol.CalcultatePipValue(terminal.User.AccountCurrency);   
    
    terminal.User.AccountActualDate = +values[5] * 1000;

    if (terminal == solution.CurrentTerminal) {
        var recidindex = terminal.PG.GetSymbolIndexFromName(Symbol.Name) + 1;
        if (Symbol == symbolcanvas.CurrentSymbol) {

            ontick_orderpanel(Symbol);

            Chart_Draw(terminal)   
            PriceGroup_Update (symbolcanvas, Symbol);  
          //  UpdateOrderPanel('orderpanel', Symbol);                  
           // update_orderpanel ();
        }

        TradedeskCurrency_Update(terminal, Symbol);
        PercentChangePanel_Update (terminal, Symbol, fromperiod);
    }
    if (selected) {
        SelectSymbol(Symbol, true);
    }
}

function TreatTargets(terminal, values) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    
    if (terminal != solution.CurrentTerminal)
        return;

    var TA = +values[2];
    var SL = +values[3];
    var TR = +values[4];
    var CP = +values[5];
    var STA = (+values[6] == -1) ? '---' : +values[6];
    var SSL = (+values[7] == -1) ? '---' : +values[7];
    var STR = (+values[8] == -1) ? '---' : +values[8];
    var SCP = +values[9];
    var WTA = +values[10];
    var WSL = +values[11];
    var WTR = +values[12];
    var WCP = +values[13];
    var WSTA = (+values[14] == -1) ? '---' : +values[14];
    var WSSL = (+values[15] == -1) ? '---' : +values[15];
    var WSTR = (+values[16] == -1) ? '---' : +values[16];
    var WSCP = +values[17];
    var PTA = +values[18];
    var PSL = +values[19];
    var PWTA = +values[20];
    var PWSL = +values[21];
    
    terminal.DailyTargetProfit = TA;
    terminal.DailyTargetStopLoss = SL;
    terminal.DailyTargetReached = TR;
    terminal.WeeklyTargetProfit = WTA;
    terminal.WeeklyTargetStopLoss = WSL;
    terminal.WeeklyTargetReached = WTR;
    terminal.PercentDailyTargetProfit = PTA;
    terminal.PercentDailyTargetStopLoss = PSL;
    terminal.PercentWeeklyTargetProfit = PWTA;
    terminal.PercentWeeklyTargetStopLoss = PWSL;



    var weight = Symbol.Weight.toFixed(2);
    var recidindex = terminal.PG.GetSymbolIndexFromName(Symbol.Name) + 1;
    var rowindex = recidindex;
    sb.table_setcellcontent (DailyTargetsTable, rowindex, 'Target', STA);
    sb.table_setcellcontent (DailyTargetsTable, rowindex, 'Stop Loss', SSL);
    sb.table_setcellcontent (DailyTargetsTable, rowindex, 'Reached', STR);
    sb.table_setcellcontent (DailyTargetsTable, rowindex, 'Closed', SCP);
    sb.table_setcellcontent (DailyTargetsTable, rowindex, 'Profit', (Symbol.Profit).toFixed(2));
    sb.table_setcellcontent (DailyTargetsTable, rowindex, 'Weight', Math.abs(weight));
    
    sb.table_setcellcontent (DailyTargetsTable, 0, 'Profit', terminal.User.AccountTotalProfit);
    sb.table_setcellcontent (DailyTargetsTable, 0, 'Target', TA);
    sb.table_setcellcontent (DailyTargetsTable, 0, 'Stop Loss', SL);
    sb.table_setcellcontent (DailyTargetsTable, 0, 'Reached', TR);
    sb.table_setcellcontent (DailyTargetsTable, 0, 'Closed', CP);
    

    if (+terminal.User.AccountTotalProfit >= 0) {
        sb.table_setcellcolor (DailyTargetsTable, 0, 'Profit', theme_bull);
    } else {
        sb.table_setcellcolor (DailyTargetsTable, 0, 'Profit', theme_bear);
    }
    if (+SCP >= 0) {
        sb.table_setcellcolor (DailyTargetsTable, rowindex, 'Closed', theme_bull);
    } else {
        sb.table_setcellcolor (DailyTargetsTable, rowindex, 'Closed', theme_bear);
    }
    if (+CP >= 0) {
        sb.table_setcellcolor (DailyTargetsTable, 0, 'Closed', theme_bull);
    } else {
        sb.table_setcellcolor (DailyTargetsTable, 0, 'Closed', theme_bear);
    }

    
    var cellvalue = sb.table_getcellcontent (DailyTargetsTable, rowindex, 'Profit');
    if (cellvalue >= 0) {
        sb.table_setcellcolor (DailyTargetsTable, rowindex, 'Profit', theme_bull);
    } else {
        sb.table_setcellcolor (DailyTargetsTable, rowindex, 'Profit', theme_bear);
    }
    if (+weight >= 0) {
        sb.table_setcellcolor (DailyTargetsTable, rowindex, 'Weight', theme_bull);
    } else {
        sb.table_setcellcolor (DailyTargetsTable, rowindex, 'Weight', theme_bear);
    }
    
    if (TA != '0') {
        sb.table_setcellbackground (DailyTargetsTable, 0, 'Target', 'var(--theme-info)');
    }

    
    sb.table_setcellcontent (WeeklyTargetsTable, rowindex, 'Target', WSTA);
    sb.table_setcellcontent (WeeklyTargetsTable, rowindex, 'Stop Loss', WSSL);
    sb.table_setcellcontent (WeeklyTargetsTable, rowindex, 'Reached', WSTR);
    sb.table_setcellcontent (WeeklyTargetsTable, rowindex, 'Closed', WSCP);
    sb.table_setcellcontent (WeeklyTargetsTable, rowindex, 'Profit', (Symbol.Profit).toFixed(2));
    sb.table_setcellcontent (WeeklyTargetsTable, rowindex, 'Weight', Math.abs(weight));
    
    sb.table_setcellcontent (WeeklyTargetsTable, 0, 'Profit', terminal.User.AccountTotalProfit);
    sb.table_setcellcontent (WeeklyTargetsTable, 0, 'Target', WTA);
    sb.table_setcellcontent (WeeklyTargetsTable, 0, 'Stop Loss', WSL);
    sb.table_setcellcontent (WeeklyTargetsTable, 0, 'Reached', WTR);
    sb.table_setcellcontent (WeeklyTargetsTable, 0, 'Closed', WCP);

    if (+terminal.User.AccountTotalProfit >= 0) {
        sb.table_setcellcolor (WeeklyTargetsTable, 0, 'Profit', theme_bull);            
    } else {
        sb.table_setcellcolor (WeeklyTargetsTable, 0, 'Profit', theme_bear);                 
    }
    if (+WSCP >= 0) {
        sb.table_setcellcolor (WeeklyTargetsTable, rowindex, 'Closed', theme_bull);                
    } else {
        sb.table_setcellcolor (WeeklyTargetsTable, rowindex, 'Closed', theme_bear);               
    }
    if (+WCP >= 0) {
        sb.table_setcellcolor (WeeklyTargetsTable, 0, 'Closed', theme_bull);     
    } else {
        sb.table_setcellcolor (WeeklyTargetsTable, 0, 'Closed', theme_bear);               
    }

    var cellvalue = sb.table_getcellcontent (WeeklyTargetsTable, rowindex, 'Profit');        
    if (cellvalue >= 0) {
        sb.table_setcellcolor (WeeklyTargetsTable, rowindex, 'Profit', theme_bull);             
    } else {
        sb.table_setcellcolor (WeeklyTargetsTable, rowindex, 'Profit', theme_bear);                  
    }
    if (+weight >= 0) {
        sb.table_setcellcolor (WeeklyTargetsTable, rowindex, 'Weight', theme_bull);              
    } else {
        sb.table_setcellcolor (WeeklyTargetsTable, rowindex, 'Weight', theme_bear);                  
    }
    
    if (WTA != '0') {
        sb.table_setcellbackground (WeeklyTargetsTable, 0, 'Target', 'var(--theme-info)');  
    }
}

function CloseSession(terminal, session) {
    var PG = terminal.PG;
    var engine = PG.GetEngineFromNameOperation(session.Engine, OperationName[session.Operation]);
    CurrentSession = null;

    RefreshTreeSession(null, engine);
}

function TreatSession(terminal, values) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    var symbolindex = terminal.PG.GetSymbolIndexFromName(values[1]);
    var sessionnumber = +values[3];



    if (sessionnumber == -1) {
        var Sessions = terminal.PG.Sessions;
        for (var i = Sessions.length - 1; i >= 0; i--) {
            if (Sessions[i].Symbol == Symbol.Name && Sessions[i].Active == 0) {
                var engineindex = Sessions[i].EngineIndex;

                if (terminal == solution.CurrentTerminal) {
                    if (engineindex != EngineManual) EngineRunningTab[engineindex][symbolindex] = 0;
                    if (Sessions[i] == CurrentSession) {
                        CloseSession(terminal, CurrentSession);
                    }
                       sb.table_removerow (sessionstable, sb.table_findfirst2(sessionstable, 'Symbol', Symbol.Name, 'Session' , Sessions[i].SessionNumber), Symbol.Name + Sessions[i].SessionNumber);
                }
                Sessions.splice(i, 1);
            }
        }


        Symbol.Profit = Symbol.BuyProfit + Symbol.SellProfit;
        Symbol.Weight = Symbol.BuyNbrLots - Symbol.SellNbrLots;
        Symbol.BuyProfit = 0;
        Symbol.SellProfit = 0;
        Symbol.BuyNbrLots = 0;
        Symbol.SellNbrLots = 0;
        terminal.User.AccountEquity = values[4];
        terminal.User.AccountBalance = values[5];
        terminal.User.AccountFreeMargin = values[6];
        terminal.User.AccountMargin = values[7];
        terminal.User.AccountLeverage = values[8];
        terminal.User.AccountProfit = values[9];
        terminal.User.AccountTotalProfit = values[10];
        terminal.User.AccountNbrLots = values[11];
        terminal.User.AccountCurrency = values[12];
       
        if (Symbol.BuyVolume == 0 || Symbol.SellVolume == 0) {
            var digits = numDecimals(Symbol.MinLot);
            if (Symbol.BuyVolume == 0) Symbol.BuyVolume = (+terminal.User.AccountEquity / 10000).toFixed(digits);
            if (Symbol.SellVolume == 0) Symbol.SellVolume = (+terminal.User.AccountEquity / 10000).toFixed(digits);
        }

        for (var i = 0; i < terminal.PG.Sessions.length; i++) {
            if (terminal.PG.Sessions[i].Symbol == Symbol.Name) {
                terminal.PG.Sessions[i].Active = 0;
            }
        }
        if (terminal == solution.CurrentTerminal) {
            AccountPanels_Update(terminal);
        }
        return;
    }
    var enginename      = 'Manual';
    var engineoperation = 'BUYSELL';
    var enginerule      = S_MANUAL;
    var date            = ToTerminalTime(+values[4]);

    var engineindex     = +values[5];
    var bnbrlot         = +values[7];
    var snbrlot         = +values[8];
    var nbrbuy          = +values[9];
    var nbrsell         = +values[10];
    var bprofit         = +values[11];
    var sprofit         = +values[12];
    var profit          = +values[13];
    var tprofit         = +values[14];
    var hedgetype       = +values[15];
    var bhedgeprofit    = +values[16];
    var shedgeprofit    = +values[17];
    var baverage        = +values[18];
    var saverage        = +values[19];
    var minpoint        = +values[20];
    var maxpoint        = +values[21];
    var property        = "";
    var aprofit = (bprofit + sprofit);
    if (values[22]) {
        property = values[22];
    }
    
    
    if (engineindex != EngineManual) {
        var engine = terminal.PG.Engines[engineindex];
        if (!engine) {
            console.log('why');
        }
        enginename = engine.Name;
        enginerule = engine.StartRule;
        engineoperation = engine.Operation;
    }


    Symbol.BuyProfit += parseFloat(bprofit);
    Symbol.SellProfit += parseFloat(sprofit);
    Symbol.BuyNbrLots += bnbrlot;
    Symbol.SellNbrLots += snbrlot;


    var add = false;

    var session = terminal.PG.ReturnSession(Symbol.Name, sessionnumber, date);
    if (session == null) {
        add = true;        
        terminal.PG.Sessions.push(session = new pgsession(sessionnumber, enginename, Symbol.Name, date, engineindex, engineoperation, enginerule, bnbrlot, snbrlot, nbrbuy, nbrsell, bprofit, sprofit, hedgetype, bhedgeprofit, shedgeprofit, profit, tprofit, baverage, saverage, minpoint, maxpoint));
        if (engineindex != EngineManual) {
            Symbol.profitData[engineindex].push({
                name: enginename,
                symbol: Symbol.Name,
                startdate: date,
                enddate: date,
                bnbrlot: bnbrlot,
                snbrlot: snbrlot,
                bnbrtrade: nbrbuy,
                snbrtrade: nbrsell,
                tprofit: tprofit,
                bprofit: bprofit,
                sprofit: sprofit,
                profit: profit
            });
        }

    } else {
        session.Set(bnbrlot, snbrlot, nbrbuy, nbrsell, bprofit, sprofit, hedgetype, bhedgeprofit, shedgeprofit, profit, tprofit, baverage, saverage, minpoint, maxpoint);
        if (engineindex != EngineManual) {
            var profitelt = Symbol.profitData[engineindex][Symbol.profitData[engineindex].length - 1];
            if (profitelt) {
                profitelt.profit = profit;
                var date = new Date();
                var nowtime = date.getTime() + solution.DifferenceHoursTime;
                profitelt.enddate = nowtime;
            }
        }
    }
    session.Active = 1;

    if (terminal == solution.CurrentTerminal) {
        
        if (engineindex != EngineManual) EngineRunningTab[engineindex][symbolindex] = 1;


        var rowindex = sb.table_findfirst2(sessionstable, 'Symbol', Symbol.Name, 'Session' , sessionnumber);
        var rowid = Symbol.Name + sessionnumber;
        
        if (rowindex < 0) {
            rowindex = sb.table_addrow (sessionstable, [enginename,  Symbol.Name, sessionnumber, PeriodName[Symbol.Period], aprofit, bprofit, sprofit, profit, bnbrlot, snbrlot, nbrbuy, nbrsell, 
                             bhedgeprofit, shedgeprofit, new Date(date).format('MM-DD-YYYY HH:mm'), engineoperation, enginerule, tprofit], rowid);

        } else {       
            rowindex = Symbol.Name +sessionnumber;   
            sb.table_setcellcontent (sessionstable, rowid, 'Strategy', enginename);
            sb.table_setcellcontent (sessionstable, rowid, 'Symbol',  Symbol.Name);
            sb.table_setcellcontent (sessionstable, rowid, 'Session', sessionnumber);            
            sb.table_setcellcontent (sessionstable, rowid, 'Period', PeriodName[Symbol.Period]);
            sb.table_setcellcontent (sessionstable, rowid, 'Profit', aprofit.toFixed(2));          
            sb.table_setcellcontent (sessionstable, rowid, 'Buy Profit', bprofit.toFixed(2));
            sb.table_setcellcontent (sessionstable, rowid, 'Sell Profit', sprofit.toFixed(2));
            sb.table_setcellcontent (sessionstable, rowid, 'Session Profit', profit.toFixed(2));     
            sb.table_setcellcontent (sessionstable, rowid, 'Buy Lots',  bnbrlot);
            sb.table_setcellcontent (sessionstable, rowid, 'Sell Lots', snbrlot);
            sb.table_setcellcontent (sessionstable, rowid, 'Buy Trade',  nbrbuy);
            sb.table_setcellcontent (sessionstable, rowid, 'Sell Trade', nbrsell);
            sb.table_setcellcontent (sessionstable, rowid, 'Buy Hedge Profit', bhedgeprofit.toFixed(2));
            sb.table_setcellcontent (sessionstable, rowid, 'Sell Hedge Profit', shedgeprofit.toFixed(2));      
            sb.table_setcellcontent (sessionstable, rowid, 'Operation', engineoperation);
            sb.table_setcellcontent (sessionstable, rowid, 'Rule', enginerule);
            sb.table_setcellcontent (sessionstable, rowid, 'Total Profit', tprofit.toFixed(2));                        

        }

        TreatProperty(solution, session, 0, property);

        if (bprofit + sprofit >= 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Profit', theme_bull);
        } else {
            sb.table_setcellcolor (sessionstable, rowid, 'Profit', theme_bear);            
        }
        if (bprofit >= 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Buy Profit', theme_bull);                
        } else {
            sb.table_setcellcolor (sessionstable, rowid, 'Buy Profit', theme_bear);                
        }
        if (sprofit >= 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Sell Profit', theme_bull);                
        }
        else {
            sb.table_setcellcolor (sessionstable, rowid, 'Sell Profit', theme_bear);                
        }
        if (profit >= 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Session Profit', theme_bull);                
        }
        else {
            sb.table_setcellcolor (sessionstable, rowid, 'Session Profit', theme_bear);                
        }
        if (tprofit >= 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Total Profit', theme_bull);                 
        }
        else {
            sb.table_setcellcolor (sessionstable, rowid, 'Total Profit', theme_bear);                 
        }
        if (bhedgeprofit > 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Buy Hedge Profit', theme_bull);                
        }
        else {
            sb.table_setcellcolor (sessionstable, rowid, 'Buy Hedge Profit', theme_bear);                
        }
        if (shedgeprofit > 0) {
            sb.table_setcellcolor (sessionstable, rowid, 'Sell Hedge Profit', theme_bull);                
        }
        else {
            sb.table_setcellcolor (sessionstable, rowid, 'Sell Hedge Profit', theme_bear);                
        }
    }
}

function TreatHistory(terminal, values) {
 
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    
    let period  = +values[2];
    let from    = +values[3];
    let nbrbars = +values[4];

    // PROBLEM WITH MULTI CLIENTS ASKING SIZE DIFFERENT !!!!
    if (!Symbol.WaitHistory[period]) return;
    if (from != Symbol.NbrCandles[period] || nbrbars != CANDLES_TOLOAD) {
        console.log ('could not read all from :  asked  from ' + Symbol.NbrCandles[period] + ' to ' + (+Symbol.NbrCandles[period] + CANDLES_TOLOAD));
    } 


    var data = [];
    var terminaltype = terminal.Type;
    i = 5;
    var k = 0;
    while (values[i]) {
        k++;
        var mydate = new Date();
        var sdate = mydate.toString();
        var terminaldate = new Date(+values[i] * 1000);
        var tdate = terminaldate.toString();
        mydate.setTime(ToTerminalTime (+values[i]));

        data.push({
            date: mydate,
            open: +values[i + 1],
            high: +values[i + 2],
            low: +values[i + 3],
            close: +values[i + 4],
            volume: +values[i + 5]
        });
        i = i + 6;
    }

    Symbol.NbrCandles[period] += k;
    Symbol.WaitHistory[period] = false;
    Symbol.chartData[period] = data.concat(Symbol.chartData[period]);

    LoaderChartHistory (false);    

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;    

    if (symbolcanvas.CurrentPeriod == period) {
        symbolcanvas.Shift = true;    
        Chart_Draw(terminal)   
    }
}

function TreatHistoryFile (terminal, values) {
    var Symbol = solution.CurrentTerminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    
    var period   = +values[2];
    var filesize = +values[3];
    var typedArray  = new Uint8Array(values[4].split('').map(function(char) {return char.charCodeAt(0);}))
    var arraybuffer = typedArray.buffer;

    HSTTreatHistory (terminal, Symbol, period, arraybuffer);
}

function ondragstart_statementtable (event) {
  
    var rows = event.currentTarget.id.split ('_');
    var rowindex = rows[rows.length -1];

    var strategyname  = sb.table_getcellcontent (statementtable, rowindex, 'Strategy');    
    event.dataTransfer.setData("text/plain", 'selectengine_' + strategyname);

}

function TreatProfit(terminal, values) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;

    var manualhistory = terminal.PG.ManualHistory;

    var enginerule = +values[2];
    if (enginerule == -1) return;


    enginerule = RuleName[enginerule];
    var engineoperation = OperationName[+values[3]];
    var date = ToTerminalTime(+values[4]);
    var edate = ToTerminalTime(+values[5]);
    var bnbrlot = +values[6];
    var snbrlot = +values[7];
    var bnbrtrade = +values[8];
    var snbrtrade = +values[9];
    var bprofit = +values[10];
    var sprofit = +values[11];
    var profit = +values[12];
    var style = (profit >= 0) ? 'background:var(--theme-TP);' : 'background:var(--theme-SL)';
    
    var elapsed = ReturnElapsedTime(edate - date);
    var engine = solution.CurrentTerminal.PG.GetEngineFromRuleOperation(enginerule, engineoperation);
    if (!engine) {
        enginename = "Manual";
    } else {
        enginename = engine.Name;
        var engineindex = solution.CurrentTerminal.PG.GetEngineIdxFromNameOperation(enginename, engineoperation);
        Symbol.profitData[engineindex].push({
            name: enginename,
            symbol: Symbol.Name,
            startdate: date,
            enddate: edate,
            bnbrlot: bnbrlot,
            snbrlot: snbrlot,
            bnbrtrade: bnbrtrade,
            snbrtrade: snbrtrade,
            bprofit: bprofit,
            sprofit: sprofit,
            profit: profit
        });
    }
    var rowindex = sb.table_addrow (historytable,  [enginename, Symbol.Name,new Date(date).format('MM-DD-YYYY HH:mm'),new Date(edate).format('MM-DD-YYYY HH:mm'),
                    elapsed, profit, bprofit, sprofit, bnbrlot, snbrlot, bnbrtrade, snbrtrade, engineoperation, enginerule]);
    sb.table_setrowattr(historytable, rowindex, 'style', style);                       



    var recs = sb.table_find (statementtable, 'Strategy', enginename);

    var add = (recs.length == 0);


    if (enginename == "Manual") {
        enginehistory = manualhistory;
    }
    else {
        enginehistory = engine.History;
    }
   
    enginehistory.Profit        += profit;
    enginehistory.BuyProfit     += bprofit;
    enginehistory.SellProfit    += sprofit;
    enginehistory.NbrLaunch     += 1;
    enginehistory.NbrGain       += (profit >= 0) ? 1 : 0;
    enginehistory.NbrLoose      += (profit < 0) ? 1 : 0;;
    enginehistory.NbrBuyLot     += bnbrlot;
    enginehistory.NbrSellLot    += snbrlot;
    enginehistory.NbrBuyTrade   += bnbrtrade;
    enginehistory.NbrSellTrade  += snbrtrade;
    style = (enginehistory.Profit >= 0) ? 'background:var(--theme-TP)' : 'background:var(--theme-SL)';
    
    
    if (add) {
        var rowindex = sb.table_addrow (statementtable,  [enginename, enginehistory.Profit.toFixed(2), enginehistory.BuyProfit.toFixed(2), enginehistory.SellProfit.toFixed(2), enginehistory.NbrLaunch,
                        enginehistory.NbrGain, enginehistory.NbrLoose, enginehistory.NbrBuyLot.toFixed(2), enginehistory.NbrSellLot.toFixed(2),
                        enginehistory.NbrBuyTrade, enginehistory.NbrSellTrade]);
        sb.table_setrowattr(statementtable, rowindex, 'style', style);   
        sb.table_setrowattr(statementtable, rowindex, 'draggable', 'true');
        sb.table_setrowattr(statementtable, rowindex, 'ondragstart', 'ondragstart_statementtable(event)');
    } else {
            var rowindex = recs[0];

            sb.table_setcellcontent (statementtable, rowindex, 'Profit',        enginehistory.Profit.toFixed(2));
            sb.table_setcellcontent (statementtable, rowindex, 'Buy Profit',    enginehistory.BuyProfit.toFixed(2));
            sb.table_setcellcontent (statementtable, rowindex, 'Sell Profit',   enginehistory.SellProfit.toFixed(2));
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr Launch',    enginehistory.NbrLaunch);
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr Gain',      enginehistory.NbrGain);
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr Loose',     enginehistory.NbrLoose);
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr BuyLot',    enginehistory.NbrBuyLot.toFixed(2));
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr SellLot',   enginehistory.NbrSellLot.toFixed(2));
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr BuyTrade',  enginehistory.NbrBuyTrade);
            sb.table_setcellcontent (statementtable, rowindex, 'Nbr SellTrade', enginehistory.NbrSellTrade);
            sb.table_setrowattr(statementtable, rowindex, 'style', style);

    }
}

function offb(s) {  //delete last char
    if (s) return s.slice(1, s.length - 1);
    return "";
}

function TreatPivot(terminal, values) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    var period = values[2];
    Symbol.Pivots[period].length = 0;
    var fromdate = new Date();
    var todate = new Date();
    values[5] = offb(values[5]);
    var k = 0
    for (var i = 1; i <= 3; i++) { // 3 periods
        Symbol.Pivots[period].push(values[k + 5]);
        Symbol.Pivots[period].push(values[k + 6]);
        Symbol.Pivots[period].push(values[k + 7]);
        Symbol.Pivots[period].push(values[k + 8]);
        Symbol.Pivots[period].push(values[k + 9]);
        Symbol.Pivots[period].push(values[k + 10]);
        Symbol.Pivots[period].push(values[k + 11]);
        Symbol.Pivots[period].push(values[k + 12]);
        Symbol.Pivots[period].push(values[k + 13]);
        k += 9;
    }
    SetPivot(Symbol, P_D1);
}

function TreatSessionAttributes(terminal, values) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    var i = 2;
    var sessionnumber = +values[i];
    var session = terminal.PG.ReturnSession(Symbol.Name, sessionnumber);
    if (!session) return;
    i += 1;
    session.Operation = +values[i];
    i += 1;
    session.StartRule = values[i];
    i += 1;
    session.BuyRule = values[i];
    i += 1;
    session.SellRule = values[i];
    i += 1;
    session.ExitBuyRule = values[i];
    i += 1;
    session.ExitSellRule = values[i];
    i += 1;
    session.ExitRule = values[i];
    i += 1;
    session.ILot = values[i];
    i += 1;
    session.MaxLot = values[i];
    i += 1;
    session.MaxCount = values[i];
    i += 1;
    session.Direction = values[i];
    i += 1;
    session.DirectionType = values[i];
    i += 1;
    session.RecoveryMode = values[i];
    i += 1;
    session.RecoveryValue = values[i];
    i += 1;
    session.PipStep = values[i];
    i += 1;
    session.TimeStep = values[i];
    i += 1;
    session.OrderType = +values[i];
    i += 1;
    session.KeepBuySell = values[i];
    i += 1;
    session.OneOrderPerBar = values[i];
    i += 1;
    session.ExitMode = values[i];
    i += 1;
    session.MaxTime = values[i];
    i += 1;
    session.HedgeMagnitude = values[i];
    i += 1;
    session.MinProfit = values[i];
    i += 1;
    session.BuyMinProfit = values[i];
    i += 1;
    session.SellMinProfit = values[i];
    i += 1;
    session.TP = values[i];
    i += 1;
    session.TS = values[i];
    i += 1;
    session.SL = values[i];
    i += 1;
    session.BuyTP = values[i];
    i += 1;
    session.BuyTS = values[i];
    i += 1;
    session.BuySL = values[i];
    i += 1;
    session.SellTP = values[i];
    i += 1;
    session.SellTS = values[i];
    i += 1;
    session.SellSL = values[i];
    i += 1;
    session.BuyLotTP = values[i];
    i += 1;
    session.BuyLotTS = values[i];
    i += 1;
    session.BuyLotSL = values[i];
    i += 1;
    session.SellLotTP = values[i];
    i += 1;
    session.SellLotTS = values[i];
    i += 1;
    session.SellLotSL = values[i];
    i += 1;
}

function TreatEngineFlags(terminal, values) {
    var PG = terminal.PG;
    var Symbol = PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
  
    var index = PG.GetSymbolIndexFromName(values[1]);
    var i = 2;
    var engineindex = 0;
  
    while (values[i]) {
        flag = values[i].split("/");
        flag[0] = +flag[0];
        flag[1] = +flag[1];


        var engine = PG.Engines[engineindex];
/*        
        if (CurrentSession && engine == solution.CurrentTerminal.PG.GetEngineFromNameOperation(CurrentSession.Engine, getmenufromid(OperationMenu, CurrentSession.Operation).text)) {
            for (var k = B_ILOT; k < NBR_ATTRIBUTES; k++) {
                var recid = EngineAttributeMenu[k].recid;
                if (recid == -1) continue;
                if (flag[(k >> 5)] & (1 << (k & 31))) { //auto 
                } else {
              //      w2ui['sessionproperty'].set(recid, {w2ui: {style: "background-color: black; color :lime;"}});
                }
            }
        }
*/        
        //StartRule
        if (flag[(0 >> 5)] & (1 << (0 & 31))) {
            if (EngineValueTab[engineindex][index] != 'auto') {
                automation_check(engineindex, index, true);
  
            }
        } else {
            if (EngineValueTab[engineindex][index] != 'manual') {
                automation_check(engineindex, index, false);                
            }
        }
        engineindex++;
        i++;
        //Suspend    
    }
}

function TreatData(terminal, values, type) {
   
    var PG      = terminal.PG;
    var Symbol  = PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
   
    var Orders = (type == MANUAL_ORDER) ? solution.CurrentTerminal.PG.Orders : solution.CurrentTerminal.PG.EOrders;
    var Id = (type == MANUAL_ORDER) ? 'orders' : 'eorders';
    
    var SessionNumber = +values[2];

    for (i = 0; i < Orders.length; i++) {
        if (Orders[i].Symbol == Symbol.Name && (type == MANUAL_ORDER || Orders[i].SessionNumber == SessionNumber)) Orders[i].Mark = 0;
    }
    
    var k = 3;
    while (values[k]) {
        var OrderId = +values[k];
        var DataType = +values[k + 1];
        var MagicNumber = values[k + 2];
        var OTime = ToTerminalTime(values[k + 3]);
        var Type = +values[k + 4];
        var Size = +values[k + 5];
        var OSymbol = values[k + 6];
        var OPrice = +values[k + 7];
        var SL = +values[k + 8];
        var TP = +values[k + 9];
        var CTime = ToTerminalTime(values[k + 10]);
        var CPrice = +values[k + 11];
        Commission = +values[k + 12];
        var Swap = +values[k + 13];
        var Profit = +values[k + 14];
        var Comment = values[k + 15];;
        k += 16;
        var add = false;
        var date = new Date(OTime);
        var cdate = new Date(CTime);
        var order = (type == MANUAL_ORDER) ? PG.GetOrderFromNumber(OrderId) : PG.GetEOrderFromNumber(OrderId);

        if (DataType == MODE_HISTORY) continue;
        
        if (type != MANUAL_ORDER) {
            var enginerule = Comment.substring(10, 11);      
            enginename = PG.GetEngineNameFromRule(enginerule);        
        }
        else {
            enginename = 'Manual';
        }
        
        if (CurrentSession && CurrentSession.Symbol == Symbol.Name && CurrentSession.SessionNumber == SessionNumber) {
            
             var rowindex = sb.table_findfirst(SessionOrdersTable, 'Order', OrderId);  
            
            if (rowindex < 0) {
                if (DataType == MODE_HISTORY) {
                    sb.table_addrow (SessionOrdersTable, [OSymbol, OrderId, OpName[Type], Profit, Size, OPrice, CPrice, SL, TP, date.format('MM-DD-YYYY HH:mm:ss'), cdate.format('MM-DD-YYYY HH:mm:ss'),
                                     Commission, Swap, DataType, DataType, Comment], OrderId);                     
                } else {
                    sb.table_addrow (SessionOrdersTable, [OSymbol, OrderId, OpName[Type], Profit, Size, OPrice, CPrice, SL, TP, date.format('MM-DD-YYYY HH:mm:ss'), '------',
                                     Commission, Swap, DataType, DataType, Comment], OrderId);                      
                }
            } else {
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'S/L',        SL); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'T/P',        TP); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Profit',     Profit.toFixed(2)); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Type',       OpName[Type]); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Price',      CPrice.toFixed(Symbol.Digits)); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Commission', Commission); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Swap',       Swap); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Mode',       DataType); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Status',     DataType); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Comment',    Comment); 
                sb.table_setcellcontent (SessionOrdersTable, OrderId, 'Swap',       Swap);    


                if (DataType == MODE_HISTORY) {
                    sb.table_setcellcontent (orderstable, OrderId, 'Close Time', cdate.format('MM-DD-YYYY HH:mm:ss'));                       
                } else {
                    sb.table_setcellcontent (orderstable, OrderId, 'Close Time', '------');                       
                }
            }
        }
        if (order == null) {
            Orders.push(order = new pgorder(SessionNumber, OrderId, DataType, MagicNumber, OTime, Type, Size, OSymbol, OPrice, SL, TP, CTime, CPrice, Commission, Swap, Profit, Comment));
            
            
            if (DataType == MODE_HISTORY) {
                    sb.table_addrow (orderstable, [OSymbol, enginename, OrderId, OpName[Type], Profit, Size, OPrice, CPrice, SL, TP, date.format('MM-DD-YYYY HH:mm:ss'), cdate.format('MM-DD-YYYY HH:mm:ss'),
                                     Commission, Swap, DataType, DataType, Comment], OrderId); 
            }
            else {
                sb.table_addrow (orderstable, [OSymbol, enginename, OrderId, OpName[Type], Profit, Size, OPrice, CPrice, SL, TP, date.format('MM-DD-YYYY HH:mm:ss'), '------',
                                 Commission, Swap, DataType, DataType, Comment], OrderId); 
            }
        } else {
            
            order.Set(DataType, MagicNumber, OTime, Type, Size, OSymbol, OPrice, SL, TP, CTime, CPrice, Commission, Swap, Profit, Comment);
        
            var rowindex = sb.table_findfirst (orderstable, 'Order', OrderId);    
   
            sb.table_setcellcontent (orderstable, OrderId, 'S/L',        SL); 
            sb.table_setcellcontent (orderstable, OrderId, 'T/P',        TP); 
            sb.table_setcellcontent (orderstable, OrderId, 'Profit',     Profit.toFixed(2)); 
            sb.table_setcellcontent (orderstable, OrderId, 'Type',       OpName[Type]); 
            sb.table_setcellcontent (orderstable, OrderId, 'Price',      CPrice.toFixed(Symbol.Digits)); 
            sb.table_setcellcontent (orderstable, OrderId, 'Commission', Commission); 
            sb.table_setcellcontent (orderstable, OrderId, 'Swap',       Swap); 
            sb.table_setcellcontent (orderstable, OrderId, 'Mode',       DataType); 
            sb.table_setcellcontent (orderstable, OrderId, 'Status',     DataType); 
            sb.table_setcellcontent (orderstable, OrderId, 'Comment',    Comment); 
            sb.table_setcellcontent (orderstable, OrderId, 'Swap',       Swap);                                     

            if (DataType == MODE_HISTORY) {
                sb.table_setcellcontent (orderstable, OrderId, 'Close Time', cdate.format('MM-DD-YYYY HH:mm:ss'));                  
            } 
            else {
                sb.table_setcellcontent (orderstable, OrderId, 'Close Time', '------');    
            }
        }
        order.Mark = 1;
    }
    var removed = 0;
    for (var i = Orders.length - 1; i >= 0; i--) {
        if (Orders[i].Symbol == Symbol.Name && Orders[i].Mark == 0) {
            sb.table_removerow (orderstable,  sb.table_findfirst (orderstable, 'Order', Orders[i].Number), Orders[i].Number);
            sb.table_removerow (SessionOrdersTable, sb.table_findfirst (SessionOrdersTable, 'Order', Orders[i].Number), Orders[i].Number);            
            Orders.splice(i, 1);
            removed = 1;
        }
    }
    OrdersPanel_Refresh (type);
    SessionOrdersPanel_Refresh(CurrentSession);
}

function TreatAlert(terminal, values) {
   
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;

    var alertsi = terminal.PG.GetAlertFromId(+values[2]);
    var periods = terminal.PG.GetStringPeriods(+values[4]);

    if (alertsi == null)
        return;
        
    var objsignal = terminal.PG.GetSignalFromName(alertsi.Signal);
    var color = (objsignal ? objsignal.Color : 'gray');
    

   // DisplayInfo(Symbol.Name + " : " + alertsi.Object + " " + alertsi.Signal + " " + periods, solution.CurrentTerminal.PG.AlertsSound, 'alertnotificationpanel', color);

    $('#alertnotificationpanel').val(Symbol.Name + " : " + alertsi.Object + " " + alertsi.Signal + " " + periods);
    $('#alertnotificationpanel').css ('color', color);
    $('#alertnotificationpanel').attr ('alertid', +values[2]);

    date = new Date(ToTerminalTime(+values[3]));

    sb.table_unshiftrow (alertstable, [Symbol.Name, date.format('MM-DD-YYYY HH:mm'), alertsi.Object, alertsi.Signal, periods, 
                                   (alertsi.Not == "1") ? 'NOT' : '', (alertsi.Previous == "1") ? 'PREV' : '', AlertTypeMenu[alertsi.Type].text,
                                   AlertOperationMenu[alertsi.Operator].text, +alertsi.OpValue == 5 ? '----' : AlertOpValueMenu[+alertsi.OpValue].text, +alertsi.OpValue == 5 ? '----' : alertsi.Value]);
    sb.table_setrowattr(alertstable, alertstable.rows.length - 1, 'alertid', +values[2]);    
}

function CurrenciesPanel_Refresh (index) { 
    sb.table_setcellcontent (tradedeskcurrenciestable, index, 'Buy',  EngineBuyNbrTab[index]);       
    sb.table_setcellcontent (tradedeskcurrenciestable, index, 'Sell', EngineSellNbrTab[index]);  


    if (EngineSellNbrTab[index] > EngineBuyNbrTab[index]) {
        sb.table_setcellbackground (tradedeskcurrenciestable, index, 'Buy', '');       
        sb.table_setcellbackground (tradedeskcurrenciestable, index, 'Sell', theme_bear);         
    } else
    if (EngineSellNbrTab[index] < EngineBuyNbrTab[index]) {
        sb.table_setcellbackground (tradedeskcurrenciestable, index, 'Buy', theme_bull);       
        sb.table_setcellbackground (tradedeskcurrenciestable, index, 'Sell', '');            
    } else {
        sb.table_setcellbackground (tradedeskcurrenciestable, index, 'Buy', '');       
        sb.table_setcellbackground (tradedeskcurrenciestable, index, 'Sell', '');       
    }
}   


function TreatRuleFlags(terminal, values) {
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;
    let index = terminal.PG.GetSymbolIndexFromName(values[1]);
    let sbflag  = +values[2];
    let ssflag  = +values[3];
    let sbsflag = +values[4];
    let bflag   = +values[5];
    let sflag   = +values[6];
    let bsflag  = +values[7];

    let buttonbgcolor =  'yellow'
    EngineBuyNbrTab[index] = 0;
    EngineSellNbrTab[index] = 0;


    for (var j = 0; j < terminal.PG.Engines.length; j++) {
        
        var engineindex = j + '_' + index;
        var Engine = terminal.PG.Engines[j];
        var i = RuleName.indexOf(Engine.StartRule);
        var operation = Engine.Operation;
        
        if (operation == "BUY") {
            if ((sbflag & (1 << i)) != 0) {
                if ((bflag & (1 << i)) != 0) {
                    EngineColorTab[j][index] = buttonbgcolor;
                    EngineTextColorTab[j][index] = theme_bull;
                    EngineBuySellTab[j][index] = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);

                    EngineBuyNbrTab[index]++;
                } else {
                    EngineColorTab[j][index] = buttonbgcolor;
                    EngineTextColorTab[j][index] = theme_buysell;
                    EngineBuySellTab[j][index] = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
                     
                }
            } else {
                EngineColorTab[j][index]        = buttonbgcolor;
                EngineTextColorTab[j][index]    = '';
                EngineBuySellTab[j][index]      = '';
                    
            }
                 
        } else
        if (operation == "SELL") {
            if ((ssflag & (1 << i)) != 0) {
                if ((sflag & (1 << i)) != 0) {
                    EngineColorTab[j][index]        = buttonbgcolor;
                    EngineTextColorTab[j][index]    = theme_bear;
                    EngineBuySellTab[j][index]      = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
                         
                    EngineSellNbrTab[index]++;
                } else {
                    EngineColorTab[j][index]        = buttonbgcolor;
                    EngineTextColorTab[j][index]    = theme_buysell;
                    EngineBuySellTab[j][index]      = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
                      
                }
            } else {
                EngineColorTab[j][index]        = buttonbgcolor;
                EngineTextColorTab[j][index]    = '';
                EngineBuySellTab[j][index]      = '';
            }
           
        } else
        if (operation == "BUYSELL") {
            if ((sbsflag & (1 << i)) != 0) {
                if ((sflag & (1 << i)) != 0 && (bflag & (1 << i)) != 0) {
                    EngineColorTab[j][index]        = buttonbgcolor;
                    EngineTextColorTab[j][index]    = theme_buysell;
                    EngineBuySellTab[j][index]      = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
           
                } else
                if ((sflag & (1 << i)) != 0) {
                    EngineColorTab[j][index]        = buttonbgcolor;
                    EngineTextColorTab[j][index]    = theme_bear;
                    EngineBuySellTab[j][index]      = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
 
                    EngineSellNbrTab[index]++;
                } else
                if ((bflag & (1 << i)) != 0) {
                    EngineColorTab[j][index]        = buttonbgcolor;
                    EngineTextColorTab[j][index]    = theme_bull;
                    EngineBuySellTab[j][index]      = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
                
                    EngineBuyNbrTab[index]++;
                } else {
                    EngineColorTab[j][index]        = buttonbgcolor;
                    EngineTextColorTab[j][index]    = theme_buysell;
                    EngineBuySellTab[j][index]      = (EngineValueTab[j][index] == 'auto' ? Automation_Label_Automatic : Automation_Label_Manual);
                  
                }
            } else {
                EngineColorTab[j][index]        = buttonbgcolor;
                EngineTextColorTab[j][index]    = '';
                EngineBuySellTab[j][index]      = '';
                    
            }
        
        } 
        sb.table_setcellcontent (StrategiesTable, index, Engine.Name,  EngineBuySellTab[j][index]);             
        $('#enginecontrol' + '_' + engineindex).css ('background', EngineTextColorTab[j][index]);            

        sb.table_setcellcolor (automationtable, j, Symbol.Name,        EngineTextColorTab[j][index]);  
        sb.table_setcellcolor (StrategiesTable, index, Engine.Name,    EngineTextColorTab[j][index]);          
    }


    StrategiesPanel_Refresh (index); 
    CurrenciesPanel_Refresh (index);    
}

function returnobjectindex (table, objectname) {
    for (var i= 0; i < table.length; i++) {
        if (table[i][1] == objectname)
            return i;
    }
    return -1;
}
var SignalNbr                   = 0;

function TreatSignal(terminal, values, time) {
    var tsignalstableid = tsignalstable.id;
    var tsyssignalstableid = tsyssignalstable.id;
  
    var Symbol = terminal.PG.GetSymbolFromName(values[1]);
    if (!Symbol) return;

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;
    
    var index = terminal.PG.GetSymbolIndexFromName(values[1]);
    var add = false;
   
    var rowindex = returnobjectindex(terminal.PG.Panel_Objects, values[2]);

    var SSignal = values[3];
    var SObject = values[2];
    
    var objsignal = solution.CurrentTerminal.PG.GetSignalFromName(SSignal);
    var color = (objsignal ? objsignal.Color : 'gray');
    
    if (!SSignal) {
        return;
    }
    
    if (rowindex == -1) add = true;

    if (values.length > 10) {
        if (SSignal == "NBRBARS" || SObject == "VOLUME" || SObject == "VOLUME_DOWN" || SObject == "VOLUME_UP") {
            for (i = 4; i < 13; i++) values[i] = parseInt(values[i]).toString();
        }
        
        if (add == true) {
            tsignals_addrow (tsignalstable, tsignalstable.rows.lenghth, SObject, values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12]);
            rowindex = SignalNbr;           
            SignalNbr++;
        } 

        if (SObject == 'NEWS') {
            for (var i = 0; i < sPeriodName.length; i++) {
                if (+values[i + 4] != 0) {
                    var difftime = +values[i + 4];
                    values[i + 4] = toHHMMSS(difftime);
                } else {
                    values[i + 4] = "";
                }
            }
        }
        if (time == 1) { // time
            for (var i = 0; i < sPeriodName.length; i++) {
                if (+values[i + 4] > 0) SystemSignalTimeTab[0][index][i] = +values[i + 4];
            }
        } else { // value          
            if (SSignal == "TARGET") {
                for (var i = 0; i < sPeriodName.length; i++) {
                    if (SObject == 'UPFRACTAL')   Symbol.UpLevel[i] = +values[i + 4];
                    if (SObject == 'DOWNFRACTAL') Symbol.DownLevel[i] = +values[i + 4];
                }
                return;
            }
            for (var i = 0; i < sPeriodName.length; i++) {
                cellindex = i + 1;
                if (Symbol == symbolcanvas.CurrentSymbol) {
                    $('#' + tsignalstableid +'_' + rowindex + '_' + cellindex).html (values[i + 4]);
                }
                SignalValueTab[rowindex][index][i] = values[i + 4];
                if (SObject == CurrentTSystemObjectName) {
                    $('#' +  tsyssignalstableid +'_' + index + '_' + cellindex).html (values[i + 4])
                    SystemSignalValueTab[0][index][i] =  SignalValueTab[rowindex][index][i];
                }
            }
        }
        return;
    } 
    flags = +values[4];
    if (add == true) //values
    {
        tsignals_addrow (tsignalstable, tsignalstable.rows.lenghth, SObject, '', '', '', '', '', '', '', '','');
        rowindex = SignalNbr;
        SignalNbr++;
    } 


    for (p = 0; p < NBR_PERIODS; p++) {
        cellindex = p + 1;

        if (SSignal.substring(0, 5) == "BEAR_" || SSignal.substring(0, 5) == "BULL_") {
            if ((flags & (1 << p)) != 0) {
                if (Symbol == symbolcanvas.CurrentSymbol) {
                    $('#' + tsignalstableid +'_' + rowindex + '_' + cellindex).html (SSignal.substring(5));
                }
                SignalColorTab[rowindex][index][p] = color;
                SignalValueTab[rowindex][index][p] = SSignal.substring(5);
                if (SObject == CurrentTSystemObjectName) {
                    $('#' +  tsyssignalstableid +'_' + index + '_' + cellindex).html (SSignal.substring(5)) ;                   

                    SystemSignalColorTab[0][index][p] = SignalColorTab[rowindex][index][p];
                    SystemSignalValueTab[0][index][p] = SignalValueTab[rowindex][index][p];
                }
            }
        } else
        if (SSignal == "BUY" || SSignal == "EXIT_BUY" || SSignal == "SELL" || SSignal == "EXIT_SELL") {
            if ((flags & (1 << p)) != 0) {
                if (Symbol == symbolcanvas.CurrentSymbol) {
                    $('#' + tsignalstableid +'_' + rowindex + '_' + cellindex).html (SSignal);
                }
                SignalValueTab[rowindex][index][p] = SSignal;
                if (SObject == CurrentTSystemObjectName) {
                    $('#' +  tsyssignalstableid +'_' + index + '_' + cellindex).html (SSignal);                         
                    SystemSignalValueTab[0][index][p] = SignalValueTab[rowindex][index][p];
                }
                if (SObject == 'PROGRESS') {
                    ProgressSignalValueTab[0][index][p] = SSignal;
                }
            }
        } else
        if (SSignal == "ABOVE" || SSignal == "BELOW" || SSignal == "RANGE" || SSignal == "TOUCHED" || SSignal == "BEAR" || SSignal == "BULL" || SSignal == "ALERT" || SSignal == "ALERT") {
            if ((flags & (1 << p)) != 0) {
                if (Symbol == symbolcanvas.CurrentSymbol) {
                    $('#'+ tsignalstableid +'_' + rowindex + '_' + cellindex).css("color", color);
                }

                SignalColorTab[rowindex][index][p] = color;

                if (SObject == CurrentTSystemObjectName) {
                    $('#' +  tsyssignalstableid +'_' + index + '_' + cellindex).css("color", color);                      
                    SystemSignalColorTab[0][index][p] = SignalColorTab[rowindex][index][p];
                }
            }
        } 
    }
}
function SetField(Session, nbr, Value, from, size, field) {
    var string = Value.substring(from, from + size);
    if (field == B_OPERATION) {
        if (Session.Operation == OP_SELL) {
            Session.BuyNbrTrade = "-";
            Session.BuyProfit = "-";
            Session.HedgeSellProfit = "-";
        } else
        if (Session.Operation == OP_BUY) {
            Session.SellNbrTrade = "-";
            Session.SellProfit = "-";
            Session.HedgeBuyProfit = "-";
        }
    } else
    if (field == B_STARTRULE) {
        Session.StartRule = string;
    } else
    if (field == B_RECOVERYMODE) {
        Session.RecoveryMode = string;
    } else
    if (field == B_HEDGEMAGNITUDE) {
        Session.HedgeMagnitude = string;
    } else
    if (field == B_PIPSTEP) {
        Session.PipStep = string;
    } else
    if (field == B_MAXCOUNT) {
        Session.MaxCount = string;
    } else
    if (field == B_RECOVERYVALUE) {
        Session.RecoveryValue = string;
    } else
    if (field == B_HEDGEMAGNITUDE) {
        Session.HedgeMagnitude = string;
    } else
    if (field == B_EXITBUY) {
        Session.ExitBuy = string;
    } else
    if (field == B_EXITSELL) {
        Session.ExitSell = string;
    } else
    if (field == B_KEEPBUYSELL) {
        Session.KeepBuySell = string;
    } else
    if (field == B_ORDERTYPE) {
        Session.OrderType = +string;
    } else
    if (field == B_EXITMODE) {
        Session.ExitMode = string;
    } else
    if (field == B_DIRECTION) {
        Session.Direction = string;
    } else
    if (field == B_DIRECTIONTYPE) {
        Session.DirectionType = string;
    }
}

function SetFlag(Session, nbr, flags, flag, field) {
    if ((flags & (1 << flag)) != 0) {
        if (flag == B_HEDGEAUTOMATIC) Session.HedgeAutomatic = "Auto";
        else
        if (flag == B_DEHEDGEAUTOMATIC) Session.DeHedgeAutomatic = "Auto";
        else
        if (flag == B_EXITAUTOMATIC) Session.ExitAutomatic = "Auto";
        else
        if (flag == B_BUYSELLAUTOMATIC) Session.BuySellAutomatic = "Auto";
    } else {
        if (flag == B_HEDGEAUTOMATIC) Session.HedgeAutomatic = "Manual";
        else
        if (flag == B_DEHEDGEAUTOMATIC) Session.DeHedgeAutomatic = "Manual";
        else
        if (flag == B_EXITAUTOMATIC) Session.ExitAutomatic = "Manual";
        else
        if (flag == B_BUYSELLAUTOMATIC) Session.BuySellAutomatic = "Manual";
    }
}

function TreatProperty(solution, Session, nbr, Value) {
    SetField(Session, nbr, Value, 10, 1, B_STARTRULE);
    SetField(Session, nbr, Value, 11, 1, B_OPERATION);
    SetField(Session, nbr, Value, 12, 1, B_DIRECTION);
    SetField(Session, nbr, Value, 13, 3, B_PIPSTEP);
    SetField(Session, nbr, Value, 16, 2, B_MAXCOUNT);
    SetField(Session, nbr, Value, 18, 1, B_RECOVERYMODE);
    SetField(Session, nbr, Value, 19, 3, B_RECOVERYVALUE);
    SetField(Session, nbr, Value, 22, 1, B_HEDGEMAGNITUDE);
    SetField(Session, nbr, Value, 23, 1, B_ORDERTYPE);
    SetField(Session, nbr, Value, 24, 1, B_KEEPBUYSELL);
    SetField(Session, nbr, Value, 25, 1, B_EXITMODE);
    SetField(Session, nbr, Value, 26, 1, B_EXITBUY);
    SetField(Session, nbr, Value, 27, 1, B_EXITSELL);
    var flags = +Value.substring(28, 30);
    SetFlag(Session, nbr, flags, B_BUYSELLAUTOMATIC, B_BUYSELLAUTOMATIC);
    SetFlag(Session, nbr, flags, B_HEDGEAUTOMATIC, B_HEDGEAUTOMATIC);
    SetFlag(Session, nbr, flags, B_DEHEDGEAUTOMATIC, B_DEHEDGEAUTOMATIC);
    SetFlag(Session, nbr, flags, B_EXITAUTOMATIC, B_EXITAUTOMATIC);
}

function OnExitSession (terminal, engineindex, symbolname, start) {
    
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }  
    
    sorder = "*EXITSESSION " + engineindex + " = [-1] ";            
    solution.CurrentTerminal.Com.Send(solution.get('user').id + '*' + symbolName + sorder);
    return engineindex;    
}

function OnStartEngine(terminal, engineindex, symbolname, start) {
 
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    
    var sorder = "*STARTAENGINE " + engineindex + " = [" + ((start == 'manual') ? "0" : "1") + "] ";
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + symbolname + sorder);
    return engineindex;
}

function OnSessionCommand (terminal, Session, nID) {
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    var sorder = '';
    var sessionnumber = Session.SessionNumber;
    var hedgeamplitude = Session.HedgeMagnitude;
    var SExp = "";
    var ConfirmationRequired = true;
    var ExitConfirmationDialog = true;
    
    if (nID == ID_EXITSESSION) {
        sorder = "*EXITSESSION " + sessionnumber + " = [-1] ";
        SExp = "Exiting the session ";
    } else
    if (nID == ID_EXITBUYSESSION) {
        sorder = "*EXITSESSION " + sessionnumber + " = [0] ";
        SExp = "Exiting Buy Orders in the session ";
    } else
    if (nID == ID_EXITSELLSESSION) {
        sorder = "*EXITSESSION " + sessionnumber + " = [1] ";
        SExp = "Exiting Sell Orders in the session ";
    } else
    if (nID == ID_CLOSEBUYSESSION) {
        sorder = "*CLOSESESSION " + sessionnumber + " = [0] ";
        SExp = "Closing Buy Orders in the session ";
    } else
    if (nID == ID_CLOSESELLSESSION) {
        sorder = "*CLOSESESSION " + sessionnumber + " = [1] ";
        SExp = "Closing Sell Orders in the session ";
    } else
    if (nID == ID_CLOSESESSION) {
        sorder = "*CLOSESESSION " + sessionnumber + " = [-1] ";
        SExp = "Closing Buy Orders in the session ";
    } else
    if (nID == ID_SUSPENDSESSION) {
        ConfirmationRequired = false;
        sorder = "*SUSPENDSESSION " + sessionnumber + " = [1] ";
    } else
    if (nID == ID_RESTARTSESSION) {
        ConfirmationRequired = false;
        sorder = "*SUSPENDSESSION " + sessionnumber + " = [0] ";
    } else
    if (nID == ID_KEEPBUYSELLSESSION) {
        ConfirmationRequired = false;
        sorder = "*KBSSESSION " + sessionnumber + " = [1] ";
    } else
    if (nID == ID_RELEASEBUYSELLSESSION) {
        ConfirmationRequired = false;
        sorder = "*KBSSESSION " + sessionnumber + " = [0] ";
    } else
    if (nID == ID_HEDGESESSIONBUY) {
        if (hedgeamplitude > 3) return;
        ConfirmationRequired = false;
        sorder = "*HEDGESESSION " + sessionnumber + " = [0 1] ";
    } else
    if (nID == ID_UNHEDGESESSIONBUY) {
        ConfirmationRequired = true;
        sorder = "*HEDGESESSION " + sessionnumber + " = [0 0] ";
        SExp = "Closing Hedge Buy Orders in the session ";
    } else
    if (nID == ID_HEDGESESSIONSELL) {
        if (hedgeamplitude > 3) return;
        ConfirmationRequired = false;
        sorder = "*HEDGESESSION " + sessionnumber + " = [1 1] ";
    } else
    if (nID == ID_UNHEDGESESSIONSELL) {
        ConfirmationRequired = true;
        sorder = "*HEDGESESSION " + sessionnumber + " = [1 0] ";
        SExp = "Closing Hedge Sell Orders in the session ";
    } else
    if (nID == ID_MANUALSESSION) {
        OnSelectSession(Session);
        return;
    } else
    if (nID == ID_DATASESSION) {
        //	(GetMainFrame)->OpenDataDialog (Session,  NULL);
        return;
    }
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + Session.Symbol + sorder);
    return;
}

function OnCloseAll(terminal, optype, profit, symbol) {
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var sorder = "*CLOSEALLENGINE " + optype + " = [" + "0" + "] ";
    for (var i = 0; i < PG.Symbols.length; i++) {
        tradedesk_MT4Com.Send(solution.get('user').id + '*' + PG.Symbols[i].Name + sorder);
    }
}

function OnExitAll(terminal, optype, profit, symbol) {
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var sorder = "*EXITALLENGINE " + optype + " = [" + "0" + "] ";
    for (var i = 0; i < PG.Symbols.length; i++) {
        tradedesk_MT4Com.Send(solution.get('user').id + '*' + PG.Symbols[i].Name + sorder);
    }
}

function OnOrder (terminal, symbol) {
    
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return null;
    }
    
    let sOrder      = '';
    let sVolume     = '';
    let sOperation  = '';
    let sEntry      = '';
    let sSL         = '';
    let sTP         = '';

    switch (symbol.TradeOrder) {
        case OP_BUY: 
            sOperation  = 'BUY';
            sEntry      = '0';
            sVolume     = symbol.BuyVolume;            
            sSL         = symbol.BuySL;
            sTP         = symbol.BuyTP;
        break;
        case OP_BUYSTOP: 
            sOperation  = 'BUYSTOP';
            sEntry      = symbol.BuyEntry;
            sVolume     = symbol.BuyVolume;
            sSL         = symbol.BuySL;
            sTP         = symbol.BuyTP;
        break;
        case OP_BUYLIMIT: 
            sOperation  = 'BUYLIMIT';
            sEntry      = symbol.BuyEntry;
            sVolume     = symbol.BuyVolume;
            sSL         = symbol.BuySL;
            sTP         = symbol.BuyTP;
        break;
        case OP_SELL: 
            sOperation  = 'SELL';
            sEntry      = '0';
            sVolume     = symbol.SellVolume;
            sSL         = symbol.SellSL;
            sTP         = symbol.SellTP;            
        break;
        case OP_SELLSTOP: 
            sOperation  = 'SELLSTOP';
            sEntry      = symbol.SellEntry;
            sVolume     = symbol.SellVolume;
            sSL         = symbol.SellSL;
            sTP         = symbol.SellTP;              
        break;
        case OP_SELLLIMIT: 
            sOperation  = 'SELLLIMIT';
            sEntry      = symbol.SellEntry;
            sVolume     = symbol.SellVolume;
            sSL         = symbol.SellSL;
            sTP         = symbol.SellTP;               
        break;
        default:
            TreatInfo("Unknow order type " + symbol.TradeOrder, 'operationpanel', 'red');
            return null;
        break;
    }
    
    sOrder = '*ORDER -1 = [' + sEntry + ' ' + sOperation + ' ' + sVolume + ' ' + sSL + ' ' + sTP + ' ]';
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + symbol.Name + sOrder);
    return 1;
}

function OnManualSession(terminal, sessionnumber, s) {
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    var Symbol = symbolcanvas.CurrentSymbol;         
    
    var sorder = "*SETFLAG " + sessionnumber + " = [" + s + "]";
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + Symbol.Name + sorder);
}

function OnSaveMM(terminalname, terminaltype) {
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;

    var Target          = $('#DailyTargetProfit').val();
    var SL              = $('#DailyTargetStopLoss').val();
    var WTarget         = $('#WeeklyTargetProfit').val();
    var WSL             = $('#WeeklyTargetStopLoss').val();
    var PercentTarget   = $('#PercentDailyTargetProfit').val();
    var PercentSL       = $('#PercentDailyTargetStopLoss').val();       
    var PercentWTarget  = $('#PercentWeeklyTargetProfit').val();
    var PercentWSL      = $('#PercentWeeklyTargetStopLoss').val();          
   
    for (var i = 0; i < PG.Symbols.length; i++) {
        var scommand = "*SETMM " + PG.Symbols[i].Name + " = [" + Target + " " + SL + " " + WTarget + " " + WSL + " " + PercentTarget + " " + PercentSL + " " + PercentWTarget + " " + PercentWSL + "] ";
        tradedesk_MT4Com.Send(solution.get('user').id + '*' + PG.Symbols[i].Name + scommand);
    }
}

//RESOLVE
function OnBuy() {
    var terminal = solution.CurrentTerminal;
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    var Symbol = symbolcanvas.CurrentSymbol;         
    
    var sorder = "*ORDER -1 = [0 BUY " + Symbol.BuyVolume + " " + Symbol.BuySL + " " + Symbol.BuyTP + " ]";
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + Symbol.Name + sorder);
}

function OnSell() {
    var terminal = solution.CurrentTerminal;
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    
    var Symbol = symbolcanvas.CurrentSymbol;       
    
    var sorder = "*ORDER -1 = [0 SELL " + Symbol.SellVolume + " " + Symbol.SellSL + " " + Symbol.SellTP + " ]";
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + Symbol.Name + sorder);
}

function OnModify (terminal) {
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    // var sorder = "*ORDER -1 = [0 SELL 1 0 0 ]";
    //    terminal.Socket.emit ('message', solution.get('user').id + '*' + Symbol.Name + sorder);
}

function OnClose (terminal, etype) {
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var seltab;
    if (etype == 0 || etype == 1) {
        tab = w2ui['orders'];
    } else {
        tab = w2ui['sessionorders'];
    }

    seltab = tab.getSelection();
   
    if (seltab.length == 0) return;

    for (j = 0; j < PG.Symbols.length; j++) {
        var Symbol = PG.Symbols[j];
        var s = "";
        var tab;
        var SessionNumber;
        var Order;
    
        for (i = 0; i < seltab.length; i++) {
            var record = tab.get(seltab[i]);
            
            if (etype == 1) {
                if (record.esymbol != Symbol.Name) continue;
                ordernumber = record.eorder;
                sl          = record.eSL;
                tp          = record.eTP;
                nbrlot      = record.esize;


            } else {
                if (record.symbol != Symbol.Name) continue;
                ordernumber = record.order;
                sl          = record.SL;
                tp          = record.TP;
                nbrlot      = record.size;
            }

            if (etype == 0) { 
                Order = PG.GetOrderFromNumber(ordernumber);
            }
            else { 
                Order = PG.GetEOrderFromNumber(ordernumber);
            }
            if (!Order) continue;
            
            SessionNumber = Order.SessionNumber;

            if (etype == 1) {
                type = (record.etype == "buy" ? 0 : (record.etype == "sell" ? 1 : 2));
            } else {
                type = (record.type == "buy" ? 0 : (record.type == "sell" ? 1 : 2));
            }            
            s += ordernumber + " " + nbrlot + " " + type + " ";
        }

        if (s != "") {
            var sorder = "*CLOSEORDER " + SessionNumber + " = [" + s + "]";
            tradedesk_MT4Com.Send(solution.get('user').id + '*' + Symbol.Name + sorder);
        }
    }
}
function OnPendingOrder(terminal, type, svolume, stoploss, stakeprofit) {
 
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    
    if (type == BUYSTOP) var sorder = "ORDER -1 = [" + m_SBidAsk + " BUYSTOP " + svolume + " " + sstoploss + " " + stakeprofit + "]";
    else
    if (type == SELLSTOP) var sorder = "ORDER -1 = [" + m_SBidAsk + " SELLSTOP " + svolume + " " + sstoploss + " " + stakeprofit + "]";
    else
    if (type == BUYLIMIT) var sorder = "ORDER -1 = [" + m_SBidAsk + " BUYLIMIT " + svolume + " " + sstoploss + " " + stakeprofit + "]";
    else
    if (type == SELLLIMIT) var sorder = "ORDER -1 = [" + m_SBidAsk + " SELLLIMIT " + svolume + " " + sstoploss + " " + stakeprofit + "]";
    tradedesk_MT4Com.Send(solution.get('user').id + '*' + Symbol.Name + sorder);
    return 1;    
}


function OnGetProfit(terminal, startdate, enddate) {

    var PG = terminal.PG;
    var UserId = solution.get('user').id;
    if (UserId == 0) UserId = 1;
    for (var i = 0; i < PG.Symbols.length; i++) {
        var sorder = "*GET_PROFIT " + "-1 = [" + startdate + " " + enddate + "] ";
        tradedesk_MT4Com.Send(UserId + '*' + PG.Symbols[i].Name + sorder);
    }
}