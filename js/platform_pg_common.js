//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MANUAL_ORDER        = 0;
const ENGINE_ORDER        = 1;
const SECTION_ORDER       = 2;


const SC_GENERATION = 0;
const C_GENERATION  = 1;
const MQ4_GENERATION = 2;
const JS_GENERATION = 3;

const LOCAL_VARIABLE = 0;
const STATIC_VARIABLE = 2;
const GLOBAL_VARIABLE = 1;


const IsValue            = ["BID" ,"ASK" ,"POINT" ,"DIGITS" ,"SYMBOL" , "CURRENTTIME" ,"CURRENTPERIOD"];
const IsVariable         = ["Variable"];
const IsLogic            = ["AND", "OR",	"NOT", "=", ">", ">=", "<", "<="];
const IsBasic1Logic      = ["AND", "OR", "NOT"];
const IsBasic2Logic      = ["=", ">",	">=", "<", "<="];
const IsMath             = ["+", "-" , "*", "/", "GETDAY", "GETMONTH", "GETWEEK", "GETHOURS", "GETMINUTES", "PIPS", "PIPVALUE", "ABS", "MIN", "MAX"];
const IsInput            = ["NUMERIC","TRUE/FALSE","STRING","CHAR","DATE","FIELD","VARIABLE","TIME","SVALUE","SPVALUE","STIME","SPTIME","SPRICE","SPPRICE","ANDV","ANDPV","ANDBV","ANDPBV","ANDTV","ANDPTV","ORV","ORPV","ORBV","ORPBV","ORTV","ORPTV"];
const IsObjectInput      = ["SVALUE","SPVALUE","STIME","SPTIME","SPRICE","SPPRICE","ANDV","ANDPV","ANDBV","ANDPBV","ANDTV","ANDPTV","ORV","ORPV","ORBV","ORPBV","ORTV","ORPTV"];
const IsNumericInput     = ["NUMERIC"];
const IsBooleanInput     = ["BOOLEAN"];
const IsDateInput        = ["DATE","TIME"];
const IsFieldInput       = ["FIELD"];
const IsLogical          = ["EXECUTE"];
const IsAction           = ["START","BUY","SELL","CLOSE","CLOSE_BUY","CLOSE_SELL","HEDGE_BUY","HEDGE_SELL","CLOSE_HEDGE", "CLOSE_HEDGE_BUY","CLOSE_HEDGE_SELL","EXIT","EXIT_BUY","EXIT_SELL","SET","SETQ"];
const IsActionSet        = ["SETQ","SET"];
const IsFunction         = ["DEFUN"];
const IsStatement        = ["IF","ELSE"];
const IsIfStatement      = ["IF"];
const IsElseStatement    = ["ELSE"];
const IsObjectLogic      = ["ANDS","ANDPS","ANDBS","ANDTS","ORS","ORBS","ORTS","ORPS"];
const IsObjectLogicInput = ["ANDV","ANDPV","ANDBV","ANDPBV","ANDTV","ANDPTV","ORV","ORPV","ORBV","ORPBV","ORTV","ORPTV"];


String.prototype.ReturnTrueName = function () {
    return IsAction.includes (this.toUpperCase()) ? this.toUpperCase() : text;
}

String.prototype.IsValue = function () {
    return IsValue.includes(this.toUpperCase());
}   

String.prototype.IsVariable = function () {
    return IsVariable.includes(this.toUpperCase());
}

String.prototype.IsLogic  = function() {
    return IsLogic.includes(this.toUpperCase());
}

String.prototype.IsBasic1Logic   = function() {
    return IsBasic1Logic.includes(this.toUpperCase());
}

String.prototype.IsBasic2Logic   = function() {
    return IsBasic2Logic.includes(this.toUpperCase());
}

String.prototype.IsMath  = function() {
    return IsMath.includes(this.toUpperCase());
}

String.prototype.IsObjectInput = function() {
    return IsObjectInput.includes(this.toUpperCase());
}

String.prototype.IsInput  = function() {
    return IsInput.includes(this.toUpperCase());
}

String.prototype.IsAction  = function() {
    return IsAction.includes(this.toUpperCase());
}

String.prototype.IsNumericInput  = function() {
    return IsNumericInput.includes(this.toUpperCase());
}

String.prototype.IsBooleanInput   = function() {
    return IsBooleanInput.includes(this.toUpperCase());
}

String.prototype.IsDateInput  = function() {
    return IsDateInput.includes(this.toUpperCase());
}

String.prototype.IsFieldInput   = function() {
    return IsFieldInput.includes(this.toUpperCase());
}

String.prototype.IsLogical  = function() {
    return IsLogical.includes(this.toUpperCase());
}

String.prototype.IsActionSet  = function() {
    return IsActionSet.includes(this.toUpperCase());
}

String.prototype.IsFunction = function() {
    return IsFunction.includes(this.toUpperCase());
}

String.prototype.IsStatement = function() {
    return IsStatement.includes(this.toUpperCase());
}

String.prototype.IsIfStatement = function() {
    return IsIfStatement.includes(this.toUpperCase());
}

String.prototype.IsElseStatement  = function() {
    return IsElseStatement.includes(this.toUpperCase());
}

String.prototype.IsObjectLogic = function() {
    return IsObjectLogic.includes(this.toUpperCase());
}

String.prototype.IsObjectLogicInput = function() {
    return IsObjectLogicInput.includes(this.toUpperCase());
}

String.prototype.IsSignalName = function() {
    for (var i = 0; i < SignalName.length; i++)
        if (this == "S_" + SignalName[i]) 
            return true;
    return false;
}

String.prototype.IsPeriodName = function() {
    for (var i = 0; i < PeriodName.length; i++)
        if (this == "P_" + PeriodName[i])
            return true;
    return false;
}

String.prototype.IsFieldOrderName = function() {
    if (this.toUpperCase() == "OP_____________") 
        return true;
    for (var i = 0; i < OrderName.length; i++)
        if (this.toUpperCase() == "OP_" + OrderName[i]) 
            return true;
    return false;
}

String.prototype.IsFieldDirectionName = function() {
    if (this.toUpperCase() == "D_____________") return true;
    for (var i = 0; i < DirectionName.length; i++)
        if (this.toUpperCase() == "D_" + DirectionName[i]) 
            return true;
    return false;
}

String.prototype.IsFieldDirectionTypeName = function() {
    if (this.toUpperCase() == "DT_____________") 
        return true;
    for (var i = 0; i < DirectionTypeName.length; i++)
        if (this.toUpperCase() == "DT_" + DirectionTypeName[i]) 
            return true;
    return false;
}

String.prototype.IsFieldOrderTypeName = function() {
    if (this.toUpperCase() == "OT_____________")
        return true;

    for (var i = 0; i <  OrderTypeName.length; i++)
        if (this.toUpperCase() == "OT_" + OrderTypeName[i]) 
            return true;
    return false;
}

String.prototype.IsFieldRecoveryModeName = function() {
    if (this.toUpperCase() == "M_____________") 
        return true;

    for (var i = 0; i < RecoveryModeName.length; i++)
        if (this.toUpperCase() == "M_" + RecoveryModeName[i]) 
            return true;
    return false;
}

String.prototype.IsFieldExitModeName = function() {
    if (this.toUpperCase() == "EM_____________") 
        return true;

    for (var i = 0; i < ExitModeName.length; i++)
        if (this.toUpperCase() == "EM_" + ExitModeName[i])
        return true;
    return false;
}

String.prototype.IsFieldConstantName = function() {
    if (this.toUpperCase() == "DIRECTION" ||
        this.toUpperCase() == "DIRECTION TYPE" ||
        this.toUpperCase() == "ORDER TYPE" ||
        this.toUpperCase() == "ORDER" ||
        this.toUpperCase() == "RECOVERY MODE" ||
        this.toUpperCase() == "EXIT MODE")
        return true;
    return (this.IsFieldDirectionName ()     || this.IsFieldOrderName () ||
            this.IsFieldDirectionTypeName () || this.IsFieldOrderTypeName () ||
            this.IsFieldRecoveryModeName ()  || this.IsFieldExitModeName ());
}

String.prototype.IsFieldName = function() {
    if (this.toUpperCase() == "T_____________") 
    return true;
    for (var i = 0; i < FieldName.length; i++)
        if (this.toUpperCase() == "T_" + FieldName[i])
        return true;
    return false;
}	

String.prototype.IsObjectName = function (pg) { //not case sensitive
    let name = this;

    var object = pg.GetObjectFromName (this);
    
    if (!object) { // see if object is predefined and add it
        let name = this.toUpperCase();
        
        var objectid = ObjectPredefinedName.indexOf (name);
        
        if (objectid != -1) { 
            
            object = pg.GetObjectFromName (name);
            if (!object) {
                var cross = "", period = 0, method = 0, apply = 0, shift = 0, mode = 0, displaytype = 0, display = MAIN_DISPLAY, leveltype = 0, value = [0,0,0,0];
                
                if (name == 'VOLUME')
                    display = SEPERATE_DISPLAY;
                
                object = new pgobject (objectid.toString (), name, 'PREDEFINED', cross, period, method, apply, shift, mode, displaytype, display, leveltype, value);                     
                pg.Objects.push (object);	
            }                
        }
    }
    return (object);
}

String.prototype.IsConditionName = function (pg) {
    var condition = pg.GetConditionFromName (this);
    return condition;
}

function DisplayTerminal(terminal, Symbol) {
    if (terminal == solution.CurrentTerminal) {
        return tradedesk_displayterminal (terminal, Symbol);        
    }
    if (terminal == solution.CurrentOptionTerminal) {
        return option_displayterminal (terminal, Symbol);        
    }
}


//---------------------------------------------------- TREAT SYMBOL  --------------------------------------------------------   

var yahooPeriodName = ['1m','5m', '15m','30m','1h'  ,'1h'  ,'1d','1wk','1mo'];
var yahooRangeName  = ['7d','60d','60d','60d','730d','730d','5y','5y' ,'max'];


function YahooTreatHistory (terminal, symbol, period, values) {

    var idate = GetTimeFromPeriod(period, MILLISECONDS);
    var k = 0;
    var arr = values;        
    
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


    var PG = terminal.PG;
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
        if (i == tab_date.length - 1) {
            var last = data[data.length - 1];
            if (last != null && (tab_date[i] * 1000 - last.date.getTime()) < idate) {
                last.high = Math.max(high, last.high);
                last.low = Math.min(low, last.low);
                last.close = close;
            } else {
                data.push ({open: open, high: high, close: close, low: low, date: new Date(tab_date[i]*1000 )})                        
            }
        } else {
            data.push ({open: open, high: high, close: close, low: low, date: new Date(tab_date[i]*1000 )})                        
        }
    }

    symbol.NbrCandles[period]   += k;
    symbol.WaitHistory[period]  = false;
    symbol.chartData[period]    = data;


    LoaderChartHistory (false);    

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;


    if (symbolcanvas.CurrentPeriod == period) {
        Chart_Draw(terminal);
    }
}

function UpdateSymbolFromSymbolChain (terminal, symbolchain) {
    var Symbol = terminal.PG.GetSymbolFromName (symbolchain.symbol);
    if (!Symbol) {                                                                              // symbol loaded onsearch
        Symbol = new pgsymbol(symbolchain.symbol);
        Symbol.Set(symbolchain.symbol, 0, "0.01", "100", "0.2", "1", 5, 0.01, 2, 100); //   (name, port, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize)
        terminal.PG.AddSymbol(Symbol);
        Symbol.Connected = true;
        Symbol.Period = P_D1;
        Symbol.Quote                = symbolchain;
        Symbol.PName                = (symbolchain.longName ? symbolchain.longName : symbolchain.shortName);
        Symbol.Quote                = symbolchain;
        Symbol.PName                = (symbolchain.longName ? symbolchain.longName : symbolchain.shortName);
        Symbol.Last                 = symbolchain.regularMarketPrice;
        Symbol.Bid                  = (symbolchain.bid == 0 ? Symbol.Last : symbolchain.bid);
        Symbol.Ask                  = (symbolchain.ask == 0 ? Symbol.Last : symbolchain.ask);
        Symbol.Spread               = ((Symbol.Ask - Symbol.Bid) / Symbol.SysPoint).toFixed(1);  
        Symbol.PriceChangePercent   = (symbolchain.regularMarketChangePercent ? symbolchain.regularMarketChangePercent : 0);
        Symbol.PriceChange          = symbolchain.regularMarketChange;    
        DisplayTerminal (terminal, Symbol) ;
        return Symbol        
    }

    Symbol.Quote                = symbolchain;
    Symbol.PName                = (symbolchain.longName ? symbolchain.longName : symbolchain.shortName);
    Symbol.Last                 = symbolchain.regularMarketPrice;
    Symbol.Bid                  = (symbolchain.bid == 0 ? Symbol.Last : symbolchain.bid);
    Symbol.Ask                  = (symbolchain.ask == 0 ? Symbol.Last : symbolchain.ask);
    Symbol.Spread               = ((Symbol.Ask - Symbol.Bid) / Symbol.SysPoint).toFixed(1);  
    Symbol.PriceChangePercent   = (symbolchain.regularMarketChangePercent ? symbolchain.regularMarketChangePercent : 0);
    Symbol.PriceChange          = symbolchain.regularMarketChange;

    return Symbol;
}

function YahooTreatSymbol(responseText, parameters) {
    let terminal = parameters[0];
    let selected = parameters[1];
    let response;

    try {
        response = JSON.parse(responseText);  
    } catch(objError) {
        var e;
        if (objError instanceof SyntaxError) {
            e = objError.name;
        } else {
            e = objError.message;
        }            
        DisplayInfo('Symbol not found', true, 'operationpanel', 'tomato');        
        if (selected) LoaderDisplay(false);
        return;
    }    
  
    for (var i = 0; i < response.quoteResponse.result.length; i++) {
        let symbolchain = response.quoteResponse.result[i];
        
        let Symbol = UpdateSymbolFromSymbolChain (terminal, symbolchain);  // only one symbol
        
        for (var j = 0; j < PeriodName.length; j++) {
            if (!Symbol.WaitHistory[j]) {            
                Chart_UpdateData(terminal, Symbol, j, Symbol.Last);
            }
        }
        currency_updatesymbol (terminal, Symbol);   
       
        let symbolcanvas = solution.GetCanvasFromTerminal(terminal);
        if (!symbolcanvas) {
            return;
        }
        if (symbolcanvas.CurrentSymbol && symbolcanvas.CurrentSymbol == Symbol){
            Chart_Draw(terminal);
            PriceGroup_Update (symbolcanvas, Symbol);        
        }
        if (selected) {
            if (terminal == solution.CurrentOptionTerminal) {
                Option_SelectSymbol(Symbol, true);
            }
            else 
            if (terminal == solution.CurrentProject) {
                symbolcanvas.CurrentSymbol = Symbol;
                SelectChart();
            }
        }
    }
}

function YahooTreatContract(responseText, parameters) {
    let terminal = parameters[0];
    let selected = parameters[1];
    let response;
    
    try {
        response = JSON.parse(responseText);  
    } catch(objError) {
        var e;
        if (objError instanceof SyntaxError) {
            e = objError.name;
        } else {
            e = objError.message;
        }            
        DisplayInfo('Symbol not found', true, 'operationpanel', 'tomato');        
        if (selected) LoaderDisplay(false);
        return;
    }    

    for (var i = 0; i < response.optionChain.result.length; i++) {
        let fulloptionchain = response.optionChain.result[i];                  
        let symbolchain     = fulloptionchain.quote;
    
        let Symbol = UpdateSymbolFromSymbolChain (terminal, symbolchain);   //here we add symbol if not exist
        
        for (var j = 0; j < PeriodName.length; j++) {
            if (!Symbol.WaitHistory[j]) {            
                Chart_UpdateData(terminal, Symbol, j, Symbol.Last);
            }
        }

        currency_updatesymbol (terminal, Symbol);
             
        let symbolcanvas = solution.GetCanvasFromTerminal(terminal);
        if (!symbolcanvas) {
            return;
        }
        if (symbolcanvas.CurrentSymbol && symbolcanvas.CurrentSymbol == Symbol){
            Chart_Draw(terminal);
            PriceGroup_Update (symbolcanvas, Symbol);        
        }    
        if (terminal == solution.CurrentOptionTerminal) {  //CONTRACT IS HERE   
            UpdateSymbolFromOptionChain (terminal, Symbol, fulloptionchain);
            OptionUpdateOrders (Symbol, MANUAL_ORDER);             
        }
        if (selected) {
            if (terminal == solution.CurrentOptionTerminal) {
                Option_SelectSymbol(Symbol, true);
            }
            else 
            if (terminal == solution.CurrentProject) {
                symbolcanvas.CurrentSymbol = Symbol;
                SelectChart();
                PriceGroup_Update (symbolcanvas, Symbol);                 
            }  
        }        
    }
}

//-------------------------------------------------------------- HISTORY --------------------------------------------------------------------

function GetSeperatorFromPeriod(data, period) {
    switch (period) {
    case P_M1:
        return date;
        break;
    case P_M5:
        return data.date.getMinutes() / 5;
        break;
    case P_M15:
        return data.date.getMinutes() / 15;
        break;
    case P_M30:
        return data.date.getMinutes() / 30;
        break;
    case P_H1:
        return data.date.getHours();
        break;
    case P_H4:
        return data.date.getHours() / 4;
        break;
    case P_D1:
        return data.date.getDay();
        break;
    case P_W1:
        return data.date.getWeek();
        break;
    case P_MN:
        return data.date.getMonth();
        break;
    }
}

function GetTimeFromPeriod(Period, type) {
    var minute = 1;
    if (type == SECONDS) minute = minute * 60;
    if (type == MILLISECONDS) minute = minute * 60 * 1000;
    if (Period == P_M1) idate = minute;
    else
    if (Period == P_M5) idate = 5 * minute;
    else
    if (Period == P_M15) idate = 15 * minute;
    else
    if (Period == P_M30) idate = 30 * minute;
    else
    if (Period == P_H1) idate = 60 * minute;
    else
    if (Period == P_H4) idate = 240 * minute;
    else
    if (Period == P_D1) idate = 24 * 60 * minute;
    else
    if (Period == P_W1) idate = 7 * 24 * 60 * minute;
    else
    if (Period == P_MN) idate = 30 * 24 * 60 * minute;
    return idate;
}

function OnGetHistory (terminal, symbol, period, from, to, async) {
    let  site    = solution.get('site');    

    LoaderChartHistory (true);    
    var responsetype = '';
    if ( !terminal || terminal.pname == 'project') {
        if (symbol.Name == 'EURUSD') {
            responsetype = 'arraybuffer';
            var url = site.address + "/Terminal/history/" + symbol.Name + GetTimeFromPeriod(period, MINUTES) + ".hst";
            LoadHistory(url, async, responsetype, terminal, symbol, period, HSTTreatHistory);         

        } else {
            var link = 'https://query1.finance.yahoo.com/v8/finance/chart/' + symbol.Name + '?range=' + yahooRangeName[period] + '&interval=' + yahooPeriodName[period];
            
            var url = site.address + '/php/load_url.php?url=' + encodeURIComponent(link);
            LoadHistory(url, async, responsetype, terminal, symbol, period, YahooTreatHistory); //5 minutes 300000	         
        }
        return;
    }
    
    if (terminal.Type  == 'IB') {
        var PG = terminal.PG;
        var UserId = solution.UserId;
        if (UserId == 0) UserId = 1;
    
        var sorder = "*GET_HISTORY^" + symbol.Name  + "^[" + period + " " + from + " " + to + "]*";
        terminal.Com.Send(UserId + '*' + symbol.Name + sorder);
    }
    else
    if (terminal.Type  == 'Yahoo') {
        if (terminal.DataPath == '//Main') {
            var link = 'https://query1.finance.yahoo.com/v8/finance/chart/' + symbol.Name + '?range=' + yahooRangeName[period] + '&interval=' + yahooPeriodName[period];
            var url = site.address + '/php/load_url.php?url=' + encodeURIComponent(link);
            LoadHistory(url, async, responsetype, terminal, symbol, period, YahooTreatHistory); 
        } 
      else {
            var link = 'https://query1.finance.yahoo.com/v8/finance/chart/' + symbol.Name + '?range=' + yahooRangeName[period] + '&interval=' + yahooPeriodName[period];
            var url = site.address + '/php/load_url.php?url=' + encodeURIComponent(link);
            LoadHistory(url, async, responsetype, terminal, symbol, period, YahooTreatHistory); 

      }
    }
    else {
        var PG = terminal.PG;
        var UserId = solution.UserId;
        if (UserId == 0) UserId = 1;
        var sorder = "*GET_HISTORY " + symbol.Name + " = [" + period + " " + from + " " + to + "] ";
        terminal.Com.Send(UserId + '*' + symbol.Name + sorder);
    }
}    

function LoadHistory (url, async, responsetype, terminal, symbol, period, func, par, par1) {

    var xhttp = new XMLHttpRequest();
    xhttp.solution = this;
    xhttp.terminal = terminal;   
    xhttp.symbol = symbol;    
    xhttp.period = period;

    xhttp.responseType = responsetype;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            func(this.terminal, this.symbol, this.period, xhttp.response, par, par1);
        }
    };
    xhttp.open("GET", url, async);
    xhttp.send();
 } 


function HSTTreatHistory (terminal, Symbol, Period, values) {

    var arraybuffer = values;
    var filesize    = arraybuffer.byteLength;

    if (filesize < 148) {
        console.log ("File too small");
        return;
    }

    var view  = new DataView(arraybuffer);

    var byteOffset = 0;

    var  version = view.getInt32(byteOffset, true);  
    byteOffset += 4;

    var copyright = String.fromCharCode.apply(String, new Uint8Array(arraybuffer, byteOffset, 64));
    byteOffset += 64;

    var symbol  = String.fromCharCode.apply(String, new Uint8Array(arraybuffer, byteOffset, 12));
    byteOffset += 12;

    var  period  = view.getInt32(byteOffset, true); 
    byteOffset += 4;   

    var  digits  = view.getInt32(byteOffset, true); 
    byteOffset += 4;   

    var timesign = new Date(view.getInt32(byteOffset, true) *1000);
    byteOffset += 4;

    var last_sync = new Date(view.getInt32(byteOffset, true) *1000);
    byteOffset += 4;


    byteOffset += 52;       //    unused  

    var pos = 148 - byteOffset;
  
    var nbrcandles = 0;

    while (byteOffset != filesize) {
        var timestamp   =   Number(view.getBigInt64(byteOffset, true));     byteOffset += 8;   
        var open        =   view.getFloat64(byteOffset, true);      byteOffset += 8; 
        var high        =   view.getFloat64(byteOffset, true);      byteOffset += 8;            
        var low         =   view.getFloat64(byteOffset, true);      byteOffset += 8;         
        var close       =   view.getFloat64(byteOffset, true);      byteOffset += 8;  
        var volume      =   Number(view.getBigInt64(byteOffset, true));     byteOffset += 8;          
        var spread      =   view.getInt32(byteOffset, true);        byteOffset += 4;  
        var realvolume  =   Number(view.getBigInt64(byteOffset, true));     byteOffset += 8;  
        var mydate = new Date(timestamp * 1000 + solution.DifferenceHoursTime);

          
        Symbol.chartData[Period].push({date: mydate, open:open, high: high, low: low, close: close, volume: volume});        
        nbrcandles++;
    }

    Symbol.Digits               = digits;                         //numDecimals(Symbol.chartData[Period][0].open); 
    Symbol.Point                = SymbolPoint(Symbol.Digits);
    Symbol.NbrCandles[Period]   = nbrcandles;
    Symbol.WaitHistory[Period]  = false;

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
    
    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;

    if (symbolcanvas.CurrentPeriod == Period) {
        Chart_Draw(terminal); 
    }
}

function SymbolPoint(digits) {
    var s = "0.";
    for (var i = 0; i < digits - 1; i++) s = s + "0";
    return +(s + "1");
}

// --------------------------------------------------------------- HTML -------------------------------------------------------

function setField(id, content, changecolor, div) {

    if (document.getElementById(id) == null) return;
    
    if (div) document.getElementById(id).innerHTML = content;
    else $("#" + id).val(content);
    
    if (changecolor) {
        if (+content >= 0) 
            $("#" + id).attr ("style", "color:" + theme_bull + "!important");
        else 
            $("#" + id).attr ("style", "color:" + theme_bear + "!important");
    }
}

//---------------------------------------------------- gse panels ---------------------------------------------   

//------------------------------------------------- INDICATOR ------------------------------------------------  


function GetIndicatorTypeFromObject(object) {
    for (var i = 0; i < IndicatorsMenu.length; i++) {
        if (object.Type == "PREDEFINED") {
            if (IndicatorsMenu[i].name == object.Name) return IndicatorsMenu[i];
        } else
        if (object.Type == "CUSTOM") {
            if (IndicatorsMenu[i].type == CUSTOM_TYPE) return IndicatorsMenu[i];
        } else
        if (object.Type == "SYSTEM") {
            if (IndicatorsMenu[i].type == SYSTEM_TYPE) return IndicatorsMenu[i];
        } else {
            if (IndicatorsMenu[i].name == object.Type) return IndicatorsMenu[i];
        }
    }
}


function GetIndicatorFromName(name) {
    for (var i = 0; i < IndicatorsMenu.length; i++) {
        if (IndicatorsMenu[i].name == name) {
            return IndicatorsMenu[i];
        }
    }
    return null;
}

function GetIndicatorNameFromObject (object) {
    if (object.Type != "PREDEFINED") return object.Type;
    return object.Name;
}


function GetSignalsFromIndicatorName (indicatorname) {
    var signalmenu = [];

    for (var index = 0; index < solution.ObjectSignals.length; index++)
        if (solution.ObjectSignals[index].objectname == indicatorname) {
            signalmenu = solution.ObjectSignals[index].signals;
            break;
        }
    return signalmenu;
}

function GetSignalFromSignalName (signals, signalname) {
    
    for (var index = 0; index < signals.length; index++) {
        if (signals[index].text == signalname) return signals[index];
    }
    return null;
   
}

function GetSignalsFromObject(object) {
    var signalmenu = [];
    if (!object) return null;

    var indicatorname =  GetIndicatorNameFromObject (object);
    
    return GetSignalsFromIndicatorName (indicatorname);
}

function GetActionDescriptionFromName (name) {
    for (var index = 0; index < OperationItems.length; index++) {
        if (OperationItems[index].name == name) {
            return OperationItems[index].tooltip;
        }
    }
    return "";    
}

function GetSignalDescriptionFromObjectType(name, signal) {
    for (var index = 0; index < solution.ObjectSignals.length; index++) {
        if (solution.ObjectSignals[index].objectname == name) {
            for (var i = 0; i < solution.ObjectSignals[index].signals.length; i++)
                if (solution.ObjectSignals[index].signals[i].text == signal) return solution.ObjectSignals[index].signals[i].description;
        }
    }
    return "";
}

function ReturnObjectTypeSignalDescription(objecttypename, signalname) {
    if (!objecttypename) return "";
    if (!signalname) return "";
    for (var pos = 0; pos < solution.ObjectSignals.length; pos++) {
        if (solution.ObjectSignals[pos].objectname == objecttypename) {
            for (var j = 0; j < solution.ObjectSignals[pos].signals.length; j++) {
                if (solution.ObjectSignals[pos].signals[j].text == signalname) return solution.ObjectSignals[pos].signals[j].description;
            }
        }
    }
    return "";
}

function ReturnObjectTypeSignalIndex(objecttypename, signalname) {
    var j = 1;
    for (var index = 0; index < solution.ObjectSignals.length; index++) {
        if (solution.ObjectSignals[index].objectname == objecttypename) {
            if (solution.ObjectSignals[index].text == signalname) return j;
            j++;
        }
    }
    return -1;
}

function SetSignalGridFromObjectType(id, name) {
    w2ui[id].clear();
    for (var index = 0; index < solution.ObjectSignals.length; index++) {
        if (solution.ObjectSignals[index].objectname == name) {
            w2ui[id].add(solution.ObjectSignals[index].signals);
            break;
        }
    }
    w2ui[id].sort('signal', 'asc');
}

function SetModeEditors (terminal) {
 
    switch (terminal) {
        case solution.CurrentProject :
            project_editors_update();
        break;
        case solution.CurrentTerminal :
            tradedesk_editors_update();
        break;
        case solution.CurrentOptionTerminal :
            option_editors_update();
        break;
    } 
}

function ModifyObject(object, oldname) {
    if (!object) return;

    let terminal = solution.GetCurrentTerminal()
    let pname    = terminal.pname;    
    if (solution.CurrentProject == terminal) {

        if (oldname != object.Name) {
            sb_tree_renameitem(pname + '_tree_createdindicators', oldname,  object.Name);            
            UpdateAssistantDependency (object, oldname);                       
        }
    }

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (symbolcanvas) {
        DrawChart();
    }        
    SetModeEditors (terminal);

    return object;
}

function PasteStrategy(strategy) {
    if (!strategy) return;
    var strategy = solution.CurrentProject.PasteStrategy(strategy);
    
    try {
        solution.PL.ParseEngine(strategy.pBEngine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);     
        return;       
    }    

    var item = {id:'strategy_' + strategy.Name, type: 'link', item: strategy.Name, icon: icon_strategy,
    attributes:{selector: 'project_selectstrategy', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}             
    };

    Menu_Strategies.push(item);

    sb.tree_additems ('project_tree_strategies', [item]);
    sb.select_additem ('projectstrategyselect', item.item);     
    project_selectstrategy(strategy);

    return strategy;
}

function PasteCondition(condition) {
    if (!condition) return;

    Menu_Conditions.push({id: Menu_Conditions.length, text: condition.Name});
    sb.tree_additems ('project_tree_conditions', [{id:'condition_' + condition.Name, type: 'link', item: condition.Name, icon: icon_condition,
                    attributes:{selector: 'selectcondition', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}       
                    }]);

    return;
}

function PasteObject(object) {
    if (!object) return;

    let terminal = solution.GetCurrentTerminal();

    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('pname',  terminal.pname); 

    let pname = platform.pname;


    if (object.Type != 'PREDEFINED') {
        let item = {id:'indicator_' + object.Name, type: 'link', item: object.Name, icon: icon_indicator,
                    attributes:{selector: 'selectindicator', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}            
                   };
        sb.tree_additems (pname + '_tree_createdindicators', [item])
    }
    
    if (solution.CurrentProject == terminal) {
        UpdateAssistantDependency (object);         
    }

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (symbolcanvas) {
        symbolcanvas.AddIndicator(object.Id);
        DrawChart();
    }

    SetModeEditors (terminal);
    return object;
}
function SaveIndicator(objectname) {

    var PG = solution.GetPGFromTerminal ();
    if (!PG) return null;


    var object = PG.GetObjectFromName(objectname);
  
    
    var id = 'indicatorpar';
    
    var type = ObjectTypeName.indexOf(object.Type);
    object.Cross = $('#paramid_' + 'cross').val();
    
    switch (type) {
    case MA_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Shift    = +$('#paramid_' + 'shift').val();
        object.Apply    = +getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
        object.Method   = +getmenuindexfromname(MaMethod, $('#paramid_' + 'mamethod').val());
        break;
    case ADX_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Mode     = +getmenuindexfromname(ModeDI, $('#paramid_' + 'mode').val());
        object.Apply    = +getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case CCI_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Apply    = +getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case ICHIMOKU_TYPE:
        object.Period   = +$('#paramid_' + 'tenkansen').val();
        object.Method   = +$('#paramid_' + 'kijunsen').val();
        object.Apply    = +$('#paramid_' + 'senkouspanb').val();
        break;
    case BOLLINGER_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Shift    = +$('#paramid_' + 'shift').val();
        object.Method   = +$('#paramid_' + 'dev').val();
        object.Mode     = +getmenuindexfromname(ModeUL, $('#paramid_' + 'mode').val());
        object.Apply    = +getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
        break;
    case SAR_TYPE:
        object.Period   = +$('#paramid_' + 'step').val(); // step
        object.Method   = +$('#paramid_' + 'maximum').val();
        object.Step     = object.Period;
        object.Maximum  = object.Method
        break;
    case RSI_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Apply    = +getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case MACD_TYPE:
        object.Period   = +$('#paramid_' + 'fastema').val();
        object.Method   = +$('#paramid_' + 'slowema').val();
        object.Shift    = +$('#paramid_' + 'sma').val();
        object.Mode     = +getmenuindexfromname(ModeMS, $('#paramid_' + 'mode').val());
        object.Apply    = +getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case STOCHASTIC_TYPE:
        object.Period   = +$('#paramid_' + 'percentkperiod').val();
        object.Shift    = +$('#paramid_' + 'percentdperiodperid').val();
        object.Mode     = +getmenuindexfromname(ModeMS, $('#paramid_' + 'mode').val());
        object.Apply    = +getmenuindexfromname(PriceField, $('#paramid_' + 'pricefield').val());
        object.Value[0] = +$('#paramid_' + 'slowing').val();
        object.Method   = +getmenuindexfromname(MaMethod, $('#paramid_' + 'mamethod').val());
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case WPR_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case ATR_TYPE:
        object.Period   = +$('#paramid_' + 'period').val();
        object.Display  = +SEPERATE_DISPLAY;
        break;
    case CUSTOM_TYPE:
        object.DisplayType  = +getmenuindexfromname(DisplayType, $('#paramid_' + 'displaytype').val());
        object.Display      = +getmenuindexfromname(Display, $('#paramid_' + 'display').val());
        object.ProgName     = $('#paramid_' + 'file')[0].name;

        for (var i = 0; i < 8; i++) {
            object.Value[i] = 0;
        }
        for (var i = 0; i < 8; i++) {
			var  sindex;
			sindex = w2ui['indicatorcustomlevels'].getCellValue(i, 1);	
			if (sindex == "Up Value")
				object.Value[UPTREND]   = object.Value[UPTREND] |=  (1 << i);
			else
			if (sindex == "Down Value")
				object.Value[DOWNTREND] = object.Value[DOWNTREND] |=  (1 << i);
			else
			if (sindex == "Value")
				object.Value[TREND]     = object.Value[TREND] |=  (1 << i);
			else
			if (sindex == "Sideway Value")
			    object.Value[SIDEWAYTREND] = object.Value[SIDEWAYTREND] |=  (1 << i);
	    }        
        break;
    case PREDEFINED_TYPE:
        break;
    }

    if (object.Display == SEPERATE_DISPLAY) {
        for (var row = 0; row < 5; row++) {
            for (var col = 0; col < NBR_PERIODS; col++) {
                var value =  $('#indicatorlevelstable' + ' #' + row + '_' + col).val();
                object.Level[row][col] = (value === "" ? EMPTY_VALUE : value);
            }
        }
    }


    var name = document.getElementById('indicatorname').value;
    var oldname = object.Name;

    object.Name = name;

    object.LevelType = ($('#overboughtsold').prop("checked") ? OVERBOUGHTOVERSOLD_LEVEL : STRONGWEAK_LEVEL);

    ModifyObject(object, oldname);
    $("#popupindicator").modal('hide');
    return object;
    
}

function NewIndicator() {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return -1;
    }
    var objectname = document.getElementById('indicatorname').value;

    if (objectname == '') {
       //  $('#indicatorname').w2tag('Please give a name to your Indicator',         { "class": 'w2ui-error',    position: 'bottom'});   
        $('#indicatorname').css ('background-color', "tomato" + " !important") ;             
        $('#indicatorname').focus();
        
        return -1;
    }
    
    var indicatorelt = sb.tree_getselection ('tree_indicatortype');
    var indicatortype = IndicatorsMenu[getmenuindexfromname(IndicatorsMenu, indicatorelt.children[1].innerHTML)];
    
    var type = indicatortype.type;

    var object = PG.GetObjectFromName (objectname);
    var signalname = ""


    var signals = sb.table_getselection (IndicatorSignalsTable);
    if (signals.length != 0) {
        signalname = sb.table_getcellcontent (IndicatorSignalsTable, signals[0], 'Signals');
    }
    else {
        signalname = sb.table_getcellcontent (IndicatorSignalsTable, 0, 'Signals');
    }

    if (type == PREDEFINED_TYPE) {
        PasteObject(object);
        $("#popupindicator").modal('hide');
        return [object, signalname];
    }

    if (object) {
     //   $('#indicatorname').w2tag('Indicator Name alreay exists',  { "class": 'w2ui-error',  position: 'bottom'});   
        $('#indicatorname').focus();          
        $('#indicatorname').css ('background-color', "tomato") ;            
        
        return -1;
    }


    var cross = "";
    var period = 0;
    var method = 0;
    var apply = 0;
    var shift = 0;
    var mode = 0;
    var displaytype = 0;
    var display = MAIN_DISPLAY;
    var leveltype = 0;
    var value = [0, 0, 0, 0];
    var progname = "";
    var id = 'indicatorpar';
   
       
    switch (type) {
        case MA_TYPE:
            period  = $('#paramid_' + 'period').val();
            shift   = $('#paramid_' + 'shift').val();
            apply   = getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
            method  = getmenuindexfromname(MaMethod, $('#paramid_' + 'mamethod').val());
            break;
        case ADX_TYPE:
            period  = $('#paramid_' + 'period').val();
            mode    = getmenuindexfromname(ModeDI, $('#paramid_' + 'mode').val());
            apply   = getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
            display = SEPERATE_DISPLAY;
            break;
        case CCI_TYPE:
            period  = $('#paramid_' + 'period').val();
            apply   = getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
            display = SEPERATE_DISPLAY;
            break;
        case ICHIMOKU_TYPE:
            period  = $('#paramid_' + 'tenkansen').val();
            method  = $('#paramid_' + 'kijunsen').val();
            apply   = $('#paramid_' + 'senkouspanb').val();
            break;
        case BOLLINGER_TYPE:
            period  = $('#paramid_' + 'period').val();
            shift   = $('#paramid_' + 'shift').val();
            method  = $('#paramid_' + 'dev').val();
            mode    = getmenuindexfromname(ModeUL, $('#paramid_' + 'mode').val());
            apply   = getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
            break;
        case SAR_TYPE:
            period  = $('#paramid_' + 'step').val(); // step
            method  = $('#paramid_' + 'maximum').val();
            break;
        case RSI_TYPE:
            period  = $('#paramid_' + 'period').val();
            apply   = getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
            display = SEPERATE_DISPLAY;
            break;
        case MACD_TYPE:
            period  = $('#paramid_' + 'fastema').val();
            method  = $('#paramid_' + 'slowema').val();
            shift   = $('#paramid_' + 'sma').val();
            mode    = getmenuindexfromname(ModeMS, $('#paramid_' + 'mode').val());
            apply   = getmenuindexfromname(ApplyTo, $('#paramid_' + 'applyto').val());
            display = SEPERATE_DISPLAY;
            break;
        case STOCHASTIC_TYPE:
            period  = $('#paramid_' + 'percentkperiod').val();
            shift   = $('#paramid_' + 'percentdperiod').val();
            mode    = getmenuindexfromname(ModeMS, $('#paramid_' + 'mode').val());
            apply   = getmenuindexfromname(PriceField, $('#paramid_' + 'pricefield').val());
            value[0] = $('#paramid_' + 'slowing').val();
            method  = getmenuindexfromname(MaMethod, $('#paramid_' + 'mamethod').val());
            display = SEPERATE_DISPLAY;
            break;
        case WPR_TYPE:
            period = $('#paramid_' + 'period').val();
            display = SEPERATE_DISPLAY;
            break;
        case ATR_TYPE:
            period = $('#paramid_' + 'period').val();
            display = SEPERATE_DISPLAY;
            break;
        case CUSTOM_TYPE:
            displaytype = getmenuindexfromname(DisplayType, $('#paramid_' + 'displaytype').val());
            display = getmenuindexfromname(Display, $('#paramid_' + 'display').val());
            progname = $('#paramid_' + 'file')[0].name;
            break;
        case PREDEFINED_TYPE:
            if (name.startsWith('VOLUME')) display = SEPERATE_DISPLAY;
            break;
    }
//RESOLVE
/*
    if (solution.get('ui').currentplatform_pname == PROJECT_PLATFORM_NAME) {            
        var ProjectStrategyAssistant  = false;
        
        var form = $("#strategy_assistant_panel");      
        if (form && ProjectStrategyAssistant) {
         //   form.validate().settings.ignore = ":disabled,:hidden";
            if (!form.valid())
                return null;
        }
    }    
*/
    var objectid;
    
    if (type == PREDEFINED_TYPE) objectid = indicatortype.id;
    else objectid = PG.ReturnNextObjectId();    
    
    object = new pgobject(objectid, objectname, ObjectTypeName[indicatortype.type], cross, period, method, apply, shift, mode, displaytype, display, leveltype, value);
    
    
    if (type == CUSTOM_TYPE) object.ProgName = progname;
    object.Cross = $('#paramid_' + 'cross').val();
    
    
    if (display == SEPERATE_DISPLAY) {
        for (var row = 0; row < 5; row++) {
            for (i = 0; i < NBR_PERIODS; i++) {
                              
                var value =   $('#' + indicatorlevelstable.id +'_' + row + '_' + (i+1) + ' #' + row + '_' + i).val() //sb.table_getcellcontent (indicatorlevelstable, row, PeriodName[i]);
                object.Level[row][i] = (value === "" ? EMPTY_VALUE : value);
            }
        }
    }

    PG.Objects.push(object);
    PasteObject(object);
    $("#popupindicator").modal('hide');

    return [object, signalname];
}


function SetSLTP(e, sltp) {

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    
    var Symbol = symbolcanvas.CurrentSymbol;
    
    
    if (sltp == 'E') {
        if (Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) {
            if (Symbol.TradeOrder == OP_BUY) {
                if (+e.value < +Symbol.Ask) {
                    Symbol.TradeOrder = OP_BUYLIMIT;
                } else
                if (+e.value > +Symbol.Ask) {
                    Symbol.TradeOrder = OP_BUYSTOP;
                } else Symbol.TradeOrder = OP_BUY;
            }
            Symbol.BuyEntry = e.value;
        } else
        if (Symbol.TradeOrder == OP_SELL || Symbol.TradeOrder == OP_SELLSTOP || Symbol.TradeOrder == OP_SELLLIMIT) {
            if (Symbol.TradeOrder == OP_SELL) {
                if (+e.value < +Symbol.Bid) {
                    Symbol.TradeOrder = OP_SELLSTOP;
                } else
                if (+e.value > +Symbol.Bid) {
                    Symbol.TradeOrder = OP_SELLLIMIT;
                } else Symbol.TradeOrder = OP_SELL;
            }
            Symbol.SellEntry = e.value;
        }
    }
    if (sltp == 'VOL') {
        if (Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) {
            if (Symbol.TradeType == TRADE_VOLUME) {
                Symbol.BuyVolume = e.value;
            } else
            if (Symbol.TradeType == TRADE_RISK) {
                Symbol.TradeRisk = e.value;
            }
        } else
        if (Symbol.TradeOrder == OP_SELL || Symbol.TradeOrder == OP_SELLSTOP || Symbol.TradeOrder == OP_SELLLIMIT) {
            if (Symbol.TradeType == TRADE_VOLUME) {
                Symbol.SellVolume = e.value;
            } else
            if (Symbol.TradeType == TRADE_RISK) {
                Symbol.TradeRisk = e.value;
            }
        }
        return;
    }
    if (sltp == 'UP') {
        if (Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) sltp = 'BTP';
        else
        if (Symbol.TradeOrder == OP_SELL || Symbol.TradeOrder == OP_SELLSTOP || Symbol.TradeOrder == OP_SELLLIMIT) sltp = 'SSL';
    } else
    if (sltp == 'DOWN') {
        if (Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) sltp = 'BSL';
        else
        if (Symbol.TradeOrder == OP_SELL || Symbol.TradeOrder == OP_SELLSTOP || Symbol.TradeOrder == OP_SELLLIMIT) sltp = 'STP';
    }
    switch (sltp) {
    case 'STP':
        if (Symbol.DownTPSLType == ATR_SLTP) Symbol.ATRSellTP = e.value;
        else Symbol.SellTP = e.value;
        break;
    case 'SSL':
        if (Symbol.UpTPSLType == ATR_SLTP) Symbol.ATRSellSL = e.value;
        else Symbol.SellSL = e.value;
        break;
    case 'BTP':
        if (Symbol.UpTPSLType == ATR_SLTP) {
            Symbol.ATRBuyTP = e.value;
        } else Symbol.BuyTP = e.value;
        break;
    case 'BSL':
        if (Symbol.DownTPSLType == ATR_SLTP) Symbol.ATRBuySL = e.value;
        else Symbol.BuySL = e.value;
        break;
    }
    DrawChart();
}

var GraphicMenu = [
    [
        {recid: 11, name: 'If'},
        {recid: 12, name: 'Else'}
    ],
    [                
       {recid: 21,  name: 'Start'},
       {recid: 22,  name: 'Buy'}, 
       {recid: 23,  name: 'Sell'}, 
       {recid: 24,  name: 'Exit Buy'}, 
       {recid: 25,  name: 'Exit Sell'}, 
       {recid: 26,  name: 'Exit'}, 
       {recid: 27,  name: 'Close Buy'}, 
       {recid: 28,  name: 'Close Sell'}, 
       {recid: 29,  name: 'Close'}, 
       {recid: 210, name: 'Hedge Buy'}, 
       {recid: 211, name: 'Hedge Sell'},
       {recid: 212, name: 'Close Hedge Buy'}, 
       {recid: 213, name: 'Close Hedge Sell'}, 
       {recid: 214, name: 'Close Hedge'},		    		   
       {recid: 215, name: 'Set'}		    		   
    ],
    [                
	   {recid: 31, name: 'AndS'},
	   {recid: 32, name: 'AndTS'},
	   {recid: 33, name: 'AndBS'},
	   {recid: 34, name: 'AndPS'},
	   {recid: 35, name: 'OrS'},
	   {recid: 36, name: 'OrTS'},
	   {recid: 37, name: 'OrBS'},
	   {recid: 38, name: 'OrPS'},
    ],
    [      
	   {recid: 41, name: 'SValue'},
	   {recid: 42, name: 'SPValue'},
	   {recid: 43, name: 'STime'},
	   {recid: 44, name: 'SPTime'},
	   {recid: 45, name: 'SPrice'},
	   {recid: 46, name: 'SPValue'},
	   {recid: 47, name: 'AndV'},
	   {recid: 48, name: 'AndPV'},
	   {recid: 49, name: 'AndBV'},
	   {recid: 50, name: 'OrV'},
	   {recid: 51, name: 'OrPV'},
	   {recid: 52, name: 'OrBV'}

    ],
    [                         
       {recid: 51, entity: 'Input'},
	   {recid: 52, entity: 'Output'},
	   {recid: 53, entity: 'Object'}
    ],
    [                         
       {recid: 61, name: 'Bid'},
	   {recid: 62, name: 'Ask'},
	   {recid: 63, name: 'Point'},
	   {recid: 64, name: 'Digits'},
	   {recid: 65, name: 'Symbol'},
	   {recid: 66, name: 'CurrentTime'},
	   {recid: 67, name: 'CurrentPeriod'}
   ],
   [
	   {recid: 711, name: 'And'},
	   {recid: 712, name: 'Or'},
	   {recid: 713, name: 'Not'},
	   {recid: 714, name: '='},
	   {recid: 715, name: '>'},
	   {recid: 716, name: '>='},
	   {recid: 717, name: '<'},
	   {recid: 718, name: '<='}
  ],
  [                         
       {recid: 721, name: '+'},
       {recid: 722, name: '-'},
       {recid: 723, name: '*'},
       {recid: 724, name: '/'},
       {recid: 725, name: 'Min'},
       {recid: 726, name: 'Max'},
       {recid: 727, name: 'Setq'}
  ],
  [                         
       {recid: 731, name: 'Numeric'},
	   {recid: 732, name: 'True/False'},
	   {recid: 733, name: 'String'},
	   {recid: 734, name: 'Char'},
	   {recid: 735, name: 'Date'},
	   {recid: 736, name: 'Time'},
	   {recid: 737, name: 'Variable'}    
    ]  
]
 
//--------------------------------------------------- SOUND -------------------------------------------------------------



var slasterror              = "";

function Project_ParseError  (str, hash) {
    var textarea = "\n";

    var textarea = "";
    var linenumber;
    
    
    if (hash == -1) { // no error
        if (slasterror != "") {

        }
        slasterror = "";
        return;
    }
    
    if (hash == -2) { // simulator error
        TraceErrorEditor(str, 1);
        slasterror = "";
        return;
    }

    if (hash == -1000) {
        TraceErrorEditor("");
        return;
    }
    if (hash) {
        linenumber = hash.line ;
        var colnumber = str = "[line :" + linenumber + "] Error (" + hash.loc.last_column + ") str (Parse ERROR)";
    } else {
        linenumber = str[0][1] + 1;
        str = (str[1].Name ? str[1].Name + ': ' : '')  + "line [" + linenumber + "] " + str[0];
    }
    slasterror = str;

    TraceErrorEditor(str, 1);
}

function TraceErrorEditor(value, add) {
    if (ErrorEditor != null) {
      //  bottompanel_select (projectplatform,'tab-error') 
        //sb.tab_select(project_bottomtabs, 'tab-error');
        ErrorEditor.setValue(ErrorEditor.getValue() + value + "\r\n");
        ErrorEditor.gotoEnd ();         
    }
}
//---------------------------------------------------- QUILL VARIABLES ------------------------------------------------
var QuillBindings = [];
var QuillToolBarOptions = [
    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
     [{ 'font': [] }],
     [{ 'size': ['small', false, 'large', 'huge'] }],
    
     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
   
     [{ 'align': [] }],  
     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
     [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
     [{ 'direction': 'rtl' }],                         // text direction
     
     [ 'link', 'image', 'video' ] 
   ];


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Menus
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var AlertTypeMenu = [
    { id: 1, text:  'ANY BAR',          tooltip : 'Signal occurs on any bar'}, 
    { id: 2, text:  'FIRST BAR',        tooltip : 'Signal occurs on the first bar : the previous bar do not have the same signal'}, 
    { id: 3, text:  'FIRST TICK',       tooltip : 'Signal occurs on the first tick only'},
    ]; 
    
var AlertOperationMenu = [
    { id: 1, text:  'OR',               tooltip: 'In one of the selected Time Frame'},  
    { id: 2, text:  'AND',              tooltip: 'In all selected Time Frames'} 
    ]; 
        
var AlertOpValueMenu = [
    { id: 1, text:  '<='}, 
    { id: 2, text:  '<'}, 
    { id: 3, text:  '='},
    { id: 4, text:  '>'},
    { id: 5, text:  '>='}
];


function getmenufromname(menu, name, field) {
    if (!field) field = 'text';
    for (var p in menu)
        if (eval('menu[p].' + field).toLowerCase() == name.toLowerCase()) return menu[p];
    return {id: 0, field : ' '};
}

function getmenuindexfromfield(menu, name, field) {
    if (!field) field = 'text';
    for (var p in menu)
        if (eval('menu[p].' + field).toLowerCase() == name.toLowerCase()) return p;
    return -1;
}


function getmenuindexfromname(menu, name) {
    for (var p in menu)
        if (menu[p].text == name) return p;
    return -1;
}


function getmenufromid(menu, id) {
    for (var p in menu)
        if (menu[p].id == id) return menu[p];
    return {id: 0, text: '-----'};
}

function getmenuname(menu, id) {
    for (var p in menu)
        if (menu[p].id == id) return menu[p].text;
    return "";
}

//------------------------------------------------------------ SEARCH SYMBOL PANEL ----------------------------------------------------------

function onkeypress_searchquote (event, elt) {
    let keycode = (event.keyCode ? event.keyCode : event.which);

    if (keycode === 32) {
        return false;
    }        
    if(keycode == '13'){
        var name = $(elt).val().toUpperCase();      

        var funcname =  $(elt).attr ("funcname"); 
        var fn = window[funcname];

        fn(name);        
    }
}

function onclick_searchquote (elt) {
    let parent = $(elt).parent();
    let searchelt = $(parent).children()[1];
    let name = $(searchelt).val().toUpperCase();
    if (!name.length) return;
    
    let funcname =  $(searchelt).attr ("funcname");
    let fn = window[funcname];

    fn(name);
}

function SearchQuote (name) {
    if (!name || name.length == 0) return;

    let terminal = solution.GetCurrentTerminal();
    let msymbols = name.split(',');
    
    if (msymbols.length > 1) {
        if (terminal == solution.CurrentOptionTerminal){
            OnGetContracts (terminal, name);
        }
        return;
    }

    if (terminal == solution.CurrentOptionTerminal){
        OnGetContract (terminal, name, true);
    }
    else {
        OnGetContract (terminal, name, true);
    }
}

function OnGetQuote (terminal, symbolname, select) {
    if (!terminal) return;

    let  site    = solution.get('site');    

    let async = true;

    url_submit ('GET', site.address + '/php/load_url.php', 
                {url: "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + symbolname}, 
                async, YahooTreatSymbol, [terminal, select])        
}    

function OnGetQuotes (terminal, symbols) {
    if (!terminal) {
        return;
    }
    let  site    = solution.get('site');    

    if (symbols == undefined) {
        let PG = terminal.PG;
        symbols = "";
        for (var i = 0; i< PG.Symbols.length; i++) {
            symbols += PG.Symbols[i].Name + (i != PG.Symbols.length -1 ? "," : "");
        } 
    }
    var async = true;
    if (symbols.length != 0) {
        url_submit ('GET', site.address + '/php/load_url.php', 
                    {url: "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" + symbols}, 
                    async, YahooTreatSymbol, [terminal])        
    }
}

function OnGetContract (terminal, symbolname, select) {
    if (!terminal) {
        return;
    }
    if (symbolname == '') {
        return;
    }
    let  site    = solution.get('site');            
    let async = true;

    url_submit ('GET', site.address + '/php/load_url.php', 
                {url: "https://query1.finance.yahoo.com/v7/finance/options/" + symbolname}, 
                async, YahooTreatContract, [terminal, select])           
}

function OnGetContracts (terminal, symbols) {
    if (!terminal) {
        return;
    }
    if (symbols == undefined) {
        let PG = terminal.PG;
        symbols = "";
        for (var i = 0; i< PG.Symbols.length; i++) {
            symbols += PG.Symbols[i].Name + (i != PG.Symbols.length -1 ? "," : "");
        } 
    }

    if (symbols.length != 0) {    
        let symbolnames = symbols.replace(/\s/g, "").split(',');
        
        for (var i = 0; i < symbolnames.length; i++) {
            OnGetContract(terminal, symbolnames[i]);
        } 
    }
}

function UpdateAlerts(terminal) {
    terminal.Loaded = true;
}

function UpdateProfile (terminal) {
    GChartPanel_Update (terminal)
}

function UpdateOrders (terminal, data) {                    //load orders from terminal
    var PG = terminal.PG;

    var lines = data.split(/\r\n|\n/);
    var headings = lines[0].split(','); // Splice up the first row to get the headings
    var order = null;
    for (var j = 1; j < lines.length; j++) {
        if (lines[j] == "") continue;
        var values = lines[j].split(','); // Split up the comma seperated values

        order = new pgorder(values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[14], values[15], values[16], values[17]);
        PG.Orders.push(order);

        let symbolname = order.MSymbol;
        let symbol     = PG.GetSymbolFromName(symbolname);

        if (!symbol) {
            OnGetContract (terminal, symbolname);
        }
    }    
    OptionOrdersPanel_Update('#optionorderspanel', optionorderstable);
}

function UpdateSymbols (terminal, data) {
    var symbols = "";
    var symbolname;    

    if (data.length == 0) {   //no symbols so load mainsymbols
        if (terminal.Folder == "Yahoo")  {
            return;
        }        
        for (var j = 0; j < MainSymbols.length; j++) {
            symbolname = MainSymbols[j].Name;
            symbols += symbolname + ",";            
        }

    } else {
        var lines = data.split(/\r\n|\n/);        
        for (var j = 0; j < lines.length; j++) {
            if (lines[j] == "") continue;
            var values = lines[j].split(','); // Split up the comma seperated values
            symbolname = values[0];
            symbols += symbolname + ",";

        }
    }
 
    if (terminal.Folder == "Main" ) {
        OnGetContracts (terminal, symbols);
    } else 
    if (terminal.Folder == "Yahoo" ) {
        OnGetContracts (terminal, symbols);
    }     
}

/*---------------------------------------------------------------------------------------------------------*/

function PriceGroup_Update (symbolcanvas, Symbol) {

    if (chartpanel_fromcanvas(symbolcanvas.ID).length == 0) return;
    let chartpanelid = chartpanel_fromcanvas(symbolcanvas.ID)[0].id;
    
    
    var symbolcontent = ""; 
    var symbolchange = "";
    var symbolchangepercent = "";
    var color;

    if (Symbol.PriceChange > 0) {
        symbolarrow = '<i class="fa fa-arrow-up"></i>';
        symbolchange = '+' + (+Symbol.PriceChange).toFixed(Symbol.Digits);;
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

//RESOLVE  
//    if (solution.get('ui').currentplatform_pname == TRADEDESK_PLATFORM_NAME){
//        symbolcontent = symbolchange;
//    }
        
    $('#' + chartpanelid + ' #tabname').html (Symbol.PName);   
    $('#' + chartpanelid + ' #tabname').attr ('title', Symbol.PName);   

    $('#' + chartpanelid + ' #tabperiod').html (PeriodName[symbolcanvas.CurrentPeriod]);                     
    $('#' + chartpanelid + ' #tabprice').html (Symbol.Last); 
    $('#' + chartpanelid + ' #tabprice').css ('color', color);               
    $('#' + chartpanelid + ' #tabchange').html (symbolcontent);               
    $('#' + chartpanelid + ' #tabchange').css('color', color); 
}


//------------------------------------------------------------ CHART MARKERS PANEL -------------------------------------------------------

function MarkerPanel_Update (terminal, show, setflag) {
    let symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return null;  

    if (chartpanel_fromcanvas(symbolcanvas.ID).length == 0) return;
    let chartpanelid    = chartpanel_fromcanvas(symbolcanvas.ID)[0].id;
    let panelid         = $('#' + chartpanelid + ' .markerpanel').attr('id');
    let chartpanel      = sb.get (sb.interface, 'id', chartpanelid)[0];


    let set = (defined(setflag) ? setflag : true);    
    if (show) {
        $('#' + panelid).css('display', 'flex');
    }
    else {
        $('#' + panelid).css ('display', 'none');
    }
    if (set) {sb.item_set ($('#' + chartpanelid + ' #m_markerpanel'), show)};       
    
    symbolcanvas.MarkerPanel = show;    
    sb.resize(chartpanel);
}

function ChartSignalsPanel_Update (terminal, show, setflag) {
    let symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return null;  

    if (chartpanel_fromcanvas(symbolcanvas.ID).length == 0) return;
    let chartpanelid    = chartpanel_fromcanvas(symbolcanvas.ID)[0].id;
    let panelid         = $('#' + chartpanelid + ' .signaleditor').attr('id');
  

    let set = (defined(setflag) ? setflag : true);    
    if (show) {
        $('#' + panelid).css('display', 'flex');
    }
    else {
        $('#' + panelid).css ('display', 'none');
    }
    if (set) {sb.item_set ($('#' + chartpanelid + ' #m_signalpanel'), show)};         

    symbolcanvas.SignalPanel = show;    
  
    DrawChart();        
}

function ChartPanel_Update(symbolcanvas) {
    DrawChart();
}

function GChartPanel_UpdatePeriod (symbolcanvas, period) {

    var chartpanelid = chartpanel_fromcanvas(symbolcanvas.ID)[0].id;
    sb.group_select('#' + chartpanelid + ' #' + period) ;  
}

function GChartPanel_Update (terminal) {

    let symbolcanvas = solution.GetCanvasFromTerminal(terminal);

    if (chartpanel_fromcanvas(symbolcanvas.ID).length == 0) return;

    let chartpanelid = chartpanel_fromcanvas(symbolcanvas.ID)[0].id;
    
    sb.item_set('#' + chartpanelid +  ' #seperator', symbolcanvas.Seperator);
    sb.item_set('#' + chartpanelid +  ' #levels',    symbolcanvas.Levels);
    sb.item_set('#' + chartpanelid +  ' #signals',   symbolcanvas.SignalPanel);
    sb.item_set('#' + chartpanelid +  ' #markerss',  symbolcanvas.MarkerPanel);
    sb.item_set('#' + chartpanelid +  ' #pivot',     symbolcanvas.Pivot);
    sb.item_set('#' + chartpanelid +  ' #grid',      symbolcanvas.Grid);
    sb.item_select('#' + chartpanelid +  ' #barstyle',   getmenuname(barstylemenu, symbolcanvas.BarType));

    if (symbolcanvas.CurrentPeriod == null) {
        symbolcanvas.CurrentPeriod = 4;
    }

    if (terminal.Type == 'Yahoo') {                 // yahoo platforms disable H4 periods
        sb.bar_disable (chartpanelid, P_H4)
        $('#' + chartpanelid + ' #' + P_H4).prop('title', 'Yahoo do not support H4 Period');
    }    

    GChartPanel_UpdatePeriod (symbolcanvas,  symbolcanvas.CurrentPeriod) ;

    if (symbolcanvas.Indicators.length == 0) {
        symbolcanvas.SignalPanel = false;
    }
     
    ChartSignalsPanel_Update (terminal,  symbolcanvas.SignalPanel);
    MarkerPanel_Update (terminal,  symbolcanvas.MarkerPanel);    
    symbolcanvas.Updated = true;
    return;
}

//------------------------------------------------------------ CHART SIGNALS PANEL ----------------------------------------------------------


//------------------------------------------------------------ CHART PANEL CANVAS ----------------------------------------------------------
var MENU_CHART_BUYSTOP_ID           = 1;
var MENU_CHART_SELLLIMIT_ID         = 2;
var MENU_CHART_BUYLIMIT_ID          = 3;
var MENU_CHART_SELLSTOP_ID          = 4;
var MENU_CHART_REMOVEINDICATORS_ID  = 5;
var MENU_CHART_REMOVEDRAWING_ID     = 6;
var MENU_CHART_INSERTCALL_ID        = 7;
var MENU_CHART_INSERTPUT_ID         = 8;

function ReturnChartMenu (platform) {

}

function OnChangeSignal (elt) {
    var signalname= elt.value;    
    return;
    var PG    = solution.GetPGFromTerminal ();
    var alert = PG.Alerts[index];    

    var object = PG.GetObjectFromName (alert.Object);
    if (!object) return;
    

   
    alert.Signal = signalname;
    alert.SCContent = GetSCString (null, null, true, index);

    var indicatorname =  GetIndicatorNameFromObject (object);
    var tooltip = GetSignalDescriptionFromObjectType(indicatorname, signalname)

    $('#homealerts' + index).prop('title', tooltip);
    
}

function onclick_slide (event, elt) {
 //   event.stopPropagation();
 //   $(elt).toggleClass('rotate-180');  

    if ($(elt).hasClass('collapsed'))  {

        $(elt.getAttribute("href")).collapse('show');
    } else {
        $(elt.getAttribute("href")).collapse('hide');

    } 
}

function onclick_closetrackerpanel (elt) {
    $(elt).closest('.trackerpanel').hide(); 
    DrawChart();
}

function TogglePanel (id, show) {

    if (show) {
        if (!$('#' + id + ' .box-btn-slide').hasClass('rotate-180')) {
            $('#' + id + ' #slide').click ();    
        }    
    }
    else {
        if ($('#' + id + ' .box-btn-slide').hasClass('rotate-180')) {
            $('#' + id + ' #slide').click ();    
        }    
    }
}




//----------------------------------------------------LOGIN PANEL------------------------------------------------




 
//----------------------------------------------------   MAIN PANEL END  ------------------------------------------------   


function CheckChar(event) {
    var char =  String.fromCharCode(event.which);

    var regex = /^[a-zA-Z0-9-/()_]+$/; 
    if (!regex.test(char)) {
        event.preventDefault();
        return false;
    }
    return true;
}

function CheckContent(event) {
    var text = event.clipboardData.getData('text/plain')
    var regex = /^[a-zA-Z0-9-/()_]+$/; 
    if (!regex.test(text)) {    
        event.preventDefault();
        return false;
    }
    return true;
}



function ConditionNamePanel(name, readonly) {
    var content = 
    '<div class="row">' +
    '   <div class="col-6">' +
            '<div class="sb_formgroup">' +
            '    <label>Name*</label>' +
            '        <input type="text" class="form-control valid" id="conditionname" value= "' + name + (readonly ? '" readonly ' : '"') + ' autocomplete="off"  onpaste="CheckContent(event)"  onkeypress="CheckChar(event)" aria-invalid="false">' +
            '    <label id="tegy_assistant_name-error" class="error" for="strategy_assistant_name" style="display: none;"></label>' +
            '</div>' +
        '</div>';
    return content;
}

function ConditionTrackNamePanel() {
    var content = '<div class="">' + '<input class="form-control"  type="text" id="trackconditionname" autocomplete="off" onpaste="CheckContent(event)" onkeypress="CheckChar(event)">' + '</div>';
    return content;
}

function ProjectNamePanel() {
    var content = '<div class=" panelname">' + '<input class="form-control"  type="text" id="projectname" autocomplete="off"  onpaste="CheckContent(event)" onkeypress="CheckChar(event)" ><span id="project_close" class="' + icon_close + '" onclick="OnCloseProject (project_closeproject, solution.CurrentProject)" onmouseleave="panelnametooltip ($(this), \'\', 0);" onmouseenter="panelnametooltip ($(this), \'Close Project\',  1);"></span></div>';
    return content;
}

function StrategyNamePanel() {
    var content = '<div class=" panelname"><input  class="form-control"  type="text" id="strategyname" autocomplete="off"  onpaste="CheckContent(event)" onkeypress="CheckChar(event)" ><span id="strategy_close" class="' + icon_close + '" onclick="OnCloseStrategy(project_closestrategy)" onmouseleave="panelnametooltip ($(this),\'\', 0);" onmouseenter="panelnametooltip ($(this),\'Close Strategy\',  1);"></span></div>';
    return content;
}

function SessionNamePanel() {
    var content = '<div class=""><input  class="form-control"  type="text" id="sessionname" autocomplete="off"  onpaste="CheckContent(event)" onkeypress="CheckChar(event)" readonly>' + '</div>';
    return content;
}


function DescriptionExample () {
    var content = '';
    return content;    
}

function UpdateRule (enginenumber, id, value) {
    var engine = CurrentEngine;
    switch (id) {
        case 12:   Set_Engine_Value(enginenumber, B_OPERATION, Operation2Int(engine.Operation)); break;
        case 21:   Set_Engine_Value(enginenumber, B_DIRECTION, Direction2Int(engine.Direction)); break;
        case 22:   Set_Engine_Value(enginenumber, B_DIRECTIONTYPE, DirectionType2Int(engine.DirectionType)); break;
        case 23:   Set_Engine_Value(enginenumber, B_ORDERTYPE, OrderType2Int(engine.OrderType)); break;
        case 24:   Set_Engine_Value(enginenumber, B_RECOVERYMODE, Mode2Int(engine.RecoveryMode)); break;
        case 25:   Set_Engine_Value(enginenumber, B_RECOVERYVALUE, +engine.RecoveryValue); break;
        case 26:   Set_Engine_Value(enginenumber, B_ILOT, +engine.ILot); break;
        case 27:   Set_Engine_Value(enginenumber, B_MAXLOT, +engine.MaxLot); break;
        case 28:   Set_Engine_Value(enginenumber, B_MAXCOUNT, +engine.MaxCount); break;
        case 29:   Set_Engine_Value(enginenumber, B_EXITMODE, ExitMode2Int(engine.ExitMode)); break;
        case 210:  Set_Engine_Value(enginenumber, B_KEEPBUYSELL, (engine.KeepBuySell == "FALSE" ? 0 : 1)); break;
        case 215:  Set_Engine_Value(enginenumber, B_ONEORDERPERBAR, (engine.OneOrderPerBar == "FALSE" ? 0 : 1)); break;    
        case 211:  Set_Engine_Value(enginenumber, B_PIPSTEP, +engine.PipStep); break;
        case 212:  Set_Engine_Value(enginenumber, B_TIMESTEP, +engine.TimeStep); break;
        case 213:  Set_Engine_Value(enginenumber, B_MAXTIME, +engine.MaxTime); break;
        case 214:  Set_Engine_Value(enginenumber, B_HEDGEMAGNITUDE, +engine.HedgeMagnitude); break;
        case 41:   Set_Engine_Value(enginenumber, B_BUYLOTTP, +engine.BuyLotTP); break;
        case 42:   Set_Engine_Value(enginenumber, B_BUYLOTTS, +engine.BuyLotTS); break;
        case 43:   Set_Engine_Value(enginenumber, B_BUYLOTSL, +engine.BuyLotSL); break;
        case 44:   Set_Engine_Value(enginenumber, B_SELLLOTTP, +engine.SellLotTP); break;
        case 45:   Set_Engine_Value(enginenumber, B_SELLLOTTS, +engine.SellLotTS); break;
        case 46:   Set_Engine_Value(enginenumber, B_SELLLOTSL, +engine.SellLotSL); break;
        case 34:   Set_Engine_Value(enginenumber, B_BUYTP, +engine.BuyTP); break;
        case 35:   Set_Engine_Value(enginenumber, B_BUYTS, +engine.BuyTS); break;
        case 36:   Set_Engine_Value(enginenumber, B_BUYSL, +engine.BuySL); break;
        case 37:   Set_Engine_Value(enginenumber, B_SELLTP, +engine.SellTP); break;
        case 38:   Set_Engine_Value(enginenumber, B_SELLTS, +engine.SellTS); break;
        case 39:   Set_Engine_Value(enginenumber, B_SELLSL, +engine.SellSL); break;    
        case 31:   Set_Engine_Value(enginenumber, B_TP, +engine.TP); break;
        case 32:   Set_Engine_Value(enginenumber, B_TS, +engine.TS); break;
        case 33:   Set_Engine_Value(enginenumber, B_SL, +engine.SL); break;
        case 51:   Set_Engine_Value(enginenumber, B_BUYMINPROFIT, +engine.BuyMinProfit); break;
        case 52:   Set_Engine_Value(enginenumber, B_SELLMINPROFIT, +engine.SellMinProfit); break;
        case 53:   Set_Engine_Value(enginenumber, B_MINPROFIT, +engine.MinProfit); break;
        default:    return;  break;        
    }

}
function UpdateSession (session, id, value) {
    var engine = CurrentEngine;
    switch (id) {
        case 12:    B_Operation[session]            =  Operation2Int(engine.Operation);   break;
        case 21:    B_Direction[session]            =  Direction2Int(engine.Direction);   break;
        case 22:    B_DirectionType[session]        =  DirectionType2Int(engine.DirectionType); break;
        case 23:    B_OrderType[session]            =  OrderType2Int(engine.OrderType); break;
        case 24:    B_RecoveryMode[session]         =  Mode2Int(engine.RecoveryMode); break;
        case 25:    B_RecoveryValue[session]        =  +engine.RecoveryValue; break;
        case 26:    B_ILot[session]                 =  +engine.ILot; break;
        case 27:    B_MaxLot[session]               =  +engine.MaxLot; break;
        case 28:    B_MaxCount[session]             =  +engine.MaxCount; break;
        case 29:    B_ExitMode[session]             =  ExitMode2Int(engine.ExitMode); break;
        case 210:   B_KeepBuySell[session]          =  (engine.KeepBuySell == "FALSE" ? 0 : 1); break;
        case 215:   B_OneOrderPerBar[session]       =  (engine.OneOrderPerBar == "FALSE" ? 0 : 1); break;    
        case 211:   B_PipStep[session]              =  +engine.PipStep; break;
        case 212:   B_TimeStep[session]             =  +engine.TimeStep; break;
        case 213:   B_MaxTime[session]              = +engine.MaxTime; break;
        case 214:   B_HedgeMagnitude[session]       = +engine.HedgeMagnitude; break;
        case 41:    B_BuyLotTP[session]             = +engine.BuyLotTP; break;
        case 42:    B_BuyLotTS[session]             = +engine.BuyLotTS; break;
        case 43:    B_BuyLotSL[session]             = +engine.BuyLotSL; break;
        case 44:    B_SellLotTP[session]            = +engine.SellLotTP; break;
        case 45:    B_SellLotTS[session]            = +engine.SellLotTS; break;
        case 46:    B_SellLotSL[session]            = +engine.SellLotSL; break;
        case 31:    B_TakeProfit[session]           = +engine.TP; break;
        case 32:    B_TrailingStop[session]         = +engine.TS; break;
        case 33:    B_StopLoss[session]             = +engine.SL; break;
        case 34:    B_BuyTakeProfit[session]        = +engine.BuyTP; break;
        case 35:    B_BuyTrailingStop[session]      = +engine.BuyTS; break;
        case 36:    B_BuyStopLoss[session]          = +engine.BuySL; break;
        case 37:    B_SellTakeProfit[session]       = +engine.SellTP; break;
        case 38:    B_SellTrailingStop[session]     = +engine.SellTS; break;
        case 39:    B_SellStopLoss[session]         = +engine.SellSL; break;
        case 51:    B_BuyMinProfit[session]         = +engine.BuyMinProfit; break;
        case 52:    B_SellMinProfit[session]        = +engine.SellMinProfit; break;
        case 53:    B_MinProfit[session]            = +engine.MinProfit; break;
        default:    return;  break;        
    }

}
   
function StrategyTrackPanel (id) {
      var content =   
      '<div id="strategytrackcontainer" style="position: absolute; width: 100%; height: 100%; left: 0px;">' + 
        '<div id="boxstrategytracksignal"      class="box" style="position: absolute; width: 100%; height: 100%; left: 0px; ' +  (id != "strategytracksignal"     ? 'display: none;' : '') + '"></div>' +
        '<div id="boxstrategytrackproperties"  class="box" style="position: absolute; width: 100%; height: 100%; left: 0px; ' +  (id != "strategytrackproperties" ? 'display: none;' : '') + '"></div>' +
        '<div id="boxstrategytrackconditions"  class="box" style="position: absolute; width: 100%; height: 100%; left: 0px; ' +  (id != "strategytrackconditions" ? 'display: none;' : '') + '"></div>' +
        '<div id="boxstrategytrackexpression"  class="box" style="position: absolute; width: 100%; height: 100%; left: 0px; ' +  (id != "strategytrackexpression" ? 'display: none;' : '') + '"></div>' +
        '</div>';
    return content;    
}



//------------------------------------------------------------------------------------------------------------------------

function onclick_CodeView (elt, event) {
    var filepanel = $(elt).closest('.sb_panel');
    let gsepanel = $(filepanel).find('.gsepanel');
    let scpanel  = $(filepanel).find('.strategyscpanel');

    gsepanel.css('display', 'none'); 
    scpanel.css('display', 'flex');     
    
    $('#strategy_filepanel_drag').css ('display', 'none');    

    gsepanel.removeClass('sb_main');    
    scpanel.addClass('sb_main');    

}

function onclick_GraphicView (elt, event) {
    var filepanel = $(elt).closest('.sb_panel');
    let gsepanel = $(filepanel).find('.gsepanel');
    let scpanel  = $(filepanel).find('.strategyscpanel');

    gsepanel.css('display', 'flex');
    scpanel.css('display', 'none');    

    $('#strategy_filepanel_drag').css ('display', 'none');    
    
    scpanel.removeClass('sb_main');    
    gsepanel.addClass('sb_main');    


    platform_gse_refresh(gsepanel.find('.canvas_GSE').attr('id'))    

}

function onclick_SplitView (elt, event) {
    var filepanel = $(elt).closest('.sb_panel');
    let gsepanel = $(filepanel).find('.gsepanel');
    let scpanel  = $(filepanel).find('.strategyscpanel');


    gsepanel.css('display', 'flex');
    scpanel.css('display', 'flex');    
    
    $('#strategy_filepanel_drag').css ('display', '');

    gsepanel.removeClass('sb_main');    
    scpanel.addClass('sb_main');    

    platform_gse_refresh(gsepanel.find('.canvas_GSE').attr('id'))    
}

//------------------------------------------------------- PICKER PANEL --------------------------------------------------



function ActionPickerPanel (eltpos, valuetype) {
    var content = 
   '<div class="RulePicker" name="' + eltpos + '">' +
   '    <div class="RuleTitles">'+
   '        <div class="Items Actions"      onclick="OnClickPickerActions (this)"><a>Expert Market Actions</a></div>'+
   '        <div class="Items Fields"       onclick="OnClickPickerFields (this, \'io\')"><a>Expert Properties</a></div>'+
   '        <div class="Items Values"       onclick="OnClickPickerExpression (this)"><a>Expression</a></div>'+
   '    </div>'+
   '    <ul class="PickerValuesPanel" style="display: table-cell;overflow: hidden;">' +
   '        <input id="ValuesSearch" type="text" class="form-control" placeholder="Search.." autocomplete="off" onkeyup="filterFunction(this,  event, 1)"> ' +  
   '        <ul class="PickerValues">'+
   '        </ul>'+
   '    </ul>'+
   '    <ul class="PickerSubValuesPanel" style="display: table-cell;overflow: hidden;">' +
   '        <input id="SubValuesSearch" type="text" class="form-control" placeholder="Search.." autocomplete="off" onkeyup="filterFunction(this,  event, 2)"> ' +  
   '        <ul class="PickerSubValues">'+
   '        </ul>'+
   '    </ul>'+
   '</div>';
    return content;
}

function scrollToView(element, parent) {
    element = $(element);
    
   if (element.length == 0) return;
    parent =  $(element).parent();

    var offset = element.offset().top - parent.offset().top;//+ parent.scrollTop();

    var height = element.innerHeight();
    var offset_end = offset + height;
    if (!element.is(":visible")) {
        element.css({"visibility":"hidden"}).show();
        var offset = element.offset().top;
        element.css({"visibility":"", "display":""});
    }

    var visible_area_start = parent.scrollTop();
    var visible_area_end = visible_area_start + parent.innerHeight();
    var parentheight = parent.innerHeight();
    
    if (offset-height < visible_area_start) {
        parent.animate({scrollTop: offset-height}, 600);
        return false;
    } else if (offset_end > visible_area_end) {
        parent.animate({scrollTop: parent.scrollTop()+ offset_end - visible_area_end + height + parentheight/2}, 600);
        return false;

    }
    return true;
}


function arrowFunction(elt, event, level) {

    var parent = $(elt).parent().parent();
    var li = parent.children().eq(level).children().eq(1).children('li');

    var curent_active = 0;
    var each_counter = 0;
    
    li.each(function(){
        if( $(this).hasClass('active')){
               curent_active = each_counter;
        }
        each_counter++;
    });


    if (event.keyCode == 37) { // left
        li.eq(curent_active).removeClass('active');    
        curent_active -= 1;
        li.eq(curent_active).addClass('active');
    } else 
    if (event.keyCode == 39) { // right
        li.eq(curent_active).removeClass('active');    
        curent_active += 1;
        li.eq(curent_active).addClass('active');
    }
    else
    if (event.keyCode == 38) {  // top
        li.eq(curent_active).removeClass('active');    
        curent_active -= 1;
        li.eq(curent_active).addClass('active');
    }
    else
    if (event.keyCode == 40) {  // bott
        li.eq(curent_active).removeClass('active');    
        curent_active += 1;
        li.eq(curent_active).addClass('active');
    }
}

function filterFunction(elt, event , level) {
    var parent = $(elt).parent().parent();
    var li = parent.children().eq(level).children().eq(1).children('li');
    
    var filter = elt.value.toUpperCase();
    
    for (i = 0; i < li.length; i++) {
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//--------------------------------------------------------------     PICKER PANEL ------------------------------------------------------


// ---------------------------------------------------------------- SHOW INDICATORS AND SIGNALS IN PICKER ---------------------------------------------------

function openPopupPickerIndicatorSignal (event, rootid, objectname, signalname, onclicksignal) {

    sb.overlay({
        rootelt: rootid ? $('#' + rootid) : $(event.currentTarget).closest('.sb_root'),
        event: event,            
        pageX: event.pageX,
        pageY: event.pageY,
        clickinside:true,

        onshow:  function () {
            PickerObjectsPanel_Update (objectname);
            PickerSignalsPanel_Update (objectname, signalname, onclicksignal);
        },

        html: PickerPanel()
    });    	      
}

// ---------------------------------------------------------------- SHOW INDICATORS IN PICKER ---------------------------------------------------

function openPopupPickerIndicator (event, rootid, objectname, onclick_callback) {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        console.log ('only Predefined for not loaded project')
    }                 
   sb.overlay({
        rootelt: rootid ? $('#' + rootid) : $(event.currentTarget).closest('.sb_root'),
        event: event,            
        pageX: event.pageX,
        pageY: event.pageY,
        clickinside:true,

        onshow:  function () {
            PickerObjectsPanel_Update (objectname, onclick_callback);
        },        

        html: PickerPanel()
    });    	
}

function onclick_indicators (elt, event) {
    openPopupPickerIndicator(event, 'marketpanel', undefined, 'onclick_selectindicator(this, event)');
}


function onclick_selectsignal (elt, event, objectname, platformname) {
    event.stopPropagation();
    let signalname        = elt.children[0].children[0].textContent;
    tracker_insert (objectname, signalname);
    $(elt).closest('.sb_overlay').remove();      

//    let boxtrackerid      = 'boxtrackerpanel_' + platformname;    
//    sb.box_toggle(boxtrackerid, true);
}

function onclick_selectsignalindicator (elt, event) {
    var objectname = elt.children[0].children[0].innerText;
    PickerSignalsPanel_Update (objectname, undefined, 'onclick_selectsignal(this, event, \'' +  objectname + '\')')   
}

//---------------------------------------------------------- INDICATOR -----------------------------------------------------
function onclick_defaultpickersignal (elt) {

    var signaldescription = elt.children[0].title;
    var signaltype        = elt.children[0].type;
    var signalname        = elt.children[0].children[0].textContent;
    $(elt).closest('.sb_overlay').remove();       
}

function PickerSignalsPanel_Update (objectname, signalname, onclick) {

    var onitemclick = 'onclick_defaultpickersignal(this)';
    
    if (defined (onclick)) {
        onitemclick = onclick;
    }
    
    var content = '';
    var PG      = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }            
    var object  = PG.GetObjectFromName (objectname);

    if (!object) {
        return;
    }
    var Signals = GetSignalsFromObject (object);
    for (var j = 0; j < Signals.length; j++) {
   //     if (signaltype && Signals[j].type != signaltype) continue;
        content += '<li class="Signal" onclick="' + onitemclick + '"><a type="' + Signals[j].type + '" title="' + Signals[j].description + '"><label>' + Signals[j].text + '</label></a></li>';
    }
  
    $('.PickerSubValues').html (content);
    $('.PickerSubValuesPanel').css ("display", 'flex'); 
    filterFunction (document.getElementById('SubValuesSearch'), null, 2);
    if (defined (signalname)) {
        PickerSubValue_Select (signalname); 
     }
}


function onclick_defaultpickerobject (elt) {
    var objectname = elt.children[0].children[0].innerText;
    PickerObjectsPanel_Update (objectname);    
    PickerSignalsPanel_Update (objectname, undefined);
}

function PickerObjectsPanel_Update (objectname, onclick) {

    let onitemclick = 'onclick_defaultpickerobject(this)';
 
    if (defined (onclick)) {
        onitemclick = onclick;
    }
    var content = '';
    let objects;    
    var PG = solution.GetPGFromTerminal ();
    if (!PG || PG.Objects.length == 0) {
        console.log ('picker on not loaded project')
        objects = solution.Objects;
    } else {
        objects = PG.Objects;
    }          
    
     for (var i = 0; i < objects.length; i++) {
         var indicator = GetIndicatorFromName (GetIndicatorNameFromObject(objects[i]));
         content += '<li class="Indicator" onclick="' + onitemclick + '"><a title="' + indicator.tooltip + '"><label>' +  objects[i].Name + '</label></a></li>';     
     }

     $('.PickerSubValuesPanel').css ("display", 'none');  
 
     $('.PickerValues').html (content);
     $('.RuleTitles .Items').removeClass('active');    
     $('.RuleTitles .Indicators').addClass('active');    
     $('.PickerValuesPanel').css ("display", 'flex');  

     filterFunction (document.getElementById('ValuesSearch'), null, 1);
     if (defined (objectname)) {
        PickerValue_Select (objectname); 
     }
 }


function PickerValue_Select (name) {
    var children =  $('.PickerValues li');

    for (var i = 0; i < children.length; i++) {
        if (children[i].children[0].children[0].innerText == name)
            break;
    }    

    $('.PickerValues li').removeClass('active');    
    $(children[i]).addClass('active');

    scrollToView (children[i]);    
}

function PickerSubValue_Select (name) {
    var children = $('.PickerSubValues li');
   
    for (var i = 0; i < children.length; i++) {
        if (children[i].children[0].children[0].innerText == name)
            break;
    }

    $('.PickerSubValues li').removeClass('active');
    $(children[i]).addClass('active');

    scrollToView (children[i]);    
}

function PickerValue_Active () {
    var children =  $('.PickerValues li');

    for (var i = 0; i < children.length; i++) {
        if (children[i].hasClass('active')) {
            return children[i];
        }
    }    
    return null;
}

function onclick_PickerItemType (type) {
    switch (type) {
        case 'Indicator' :
            PickerObjectsPanel_Update ();                 
        break;
        case 'Field' :
            PickerFieldsPanel_Update ();
        break;
        case 'Value' :
            SelectPickerValues ();            
        break;
        case 'Expression' :
            $('.PickerValuesPanel').css ("display", 'block');  
            $('.PickerSubValuesPanel').css ("display", 'none');              
        break;
        case 'Condition' :
            SelectPickerConditions ();     
        break;
        case 'Action' :
            PickerActionsPanel_Update ();                 
        break;
        case 'Marker' :
            
        break;        
    }
}

function PickerPanel (){
   
    var content = 
   '<div class="RulePicker">' +
   '    <div class="RuleTitles">'+
   '        <div class="Items Indicators"   onclick="onclick_PickerItemType (\'Indicator\')"><a>Indicators</a></div>'+
   '        <div class="Items Fields"       onclick="onclick_PickerItemType (\'Field\')><a>Expert Properties Values</a></div>'+
   '        <div class="Items Values"       onclick="onclick_PickerItemType (\'Value\')"><a>Expert Market Values</a></div>'+
   '        <div class="Items Expressions"  onclick="onclick_PickerItemType (\'Expression\')"><a>Expression</a></div>'+
   '        <div class="Items Values"       onclick="onclick_PickerItemType (\'Condition\')"><a>____________________________</a></div>'+
   '        <div class="Items Conditions"   onclick="onclick_PickerItemType (\'Condition\') (this)"><a>Conditions</a></div>'+
   '        <div class="Items Markers"      onclick="onclick_PickerItemType (\'Marker\')"><a>Markers</a></div>'+
      
   '    </div>'+
   '    <ul class="PickerValuesPanel" style="display:none;overflow:hidden;">' +
   '        <input id="ValuesSearch" type="text" class="form-control" placeholder="Search.." autocomplete="off" onclick="event.stopPropagation()" onkeyup="filterFunction(this,  event, 1)"> ' +  
   '        <ul class="PickerValues"  onkeydown ="arrowFunction(this, event, 1)">'+
   '        </ul>'+
   '    </ul>'+
   '    <ul class="PickerSubValuesPanel" style="display:none;overflow:hidden;">' +
   '        <input id="SubValuesSearch" type="text" class="form-control" placeholder="Search.." autocomplete="off" onkeyup="filterFunction(this,  event, 2)"> ' +  
   '        <ul class="PickerSubValues">'+
   '        </ul>'+
   '    </ul>'+
   '</div>';
    return content;
}


//----------------------------------------------------------ACTION -----------------------------------------------------

function onclick_pickeraction (elt) {
   var actiontext = elt.children[0].children[0].textContent;
   var actionname =  elt.children[0].children[0].textContent;
   var actiontooltip = elt.children[0].tooltip;

   $(elt).closest('.sb_overlay').remove();       

}


 function PickerActionsPanel_Update (onclick) {
    var onitemclick = 'onclick_pickeraction(this)';
   
    if (defined (onclick)) {
        onitemclick = onclick;
    }
    var content = '';
 
     for (var i = 0; i <OperationItems.length; i++) {
         content += '<li class="Action" onclick="' + onitemclick + '"><a title="' + OperationItems[i].tooltip + '"><label>' + OperationItems[i].name + '</label></a></li>';       
     }
     $('.PickerSubValuesPanel').css ("display", 'none');  
 
     $('.PickerValues').html (content);
     $('.RuleTitles .Items').removeClass('active');    
     $('.RuleTitles .Actions').addClass('active');    
     $('.PickerValuesPanel').css ("display", 'flex');    

     filterFunction (document.getElementById('ValuesSearch'), null, 1);     
 }

//---------------------------------------------------------- BASIC LOGIC 1 and 2 -----------------------------------------------------

function onclick_pickerlogic (elt) {
    var actiontext = elt.children[0].children[0].textContent;
    var actionname =  elt.children[0].children[0].textContent;
    var actiontooltip = elt.children[0].tooltip;

    $(elt).closest('.sb_overlay').remove();       
}

function PickerLogicPanel_Update (Menu, classname, onclick) {
    var onitemclick = 'onclick_pickerlogic(this)';
   
    if (defined (onclick)) {
        onitemclick = onclick;
    }
    var content = '';
 
     for (var i = 0; i < Menu.length; i++) {
         content += '<li class="' + classname + '" onclick="' + onitemclick + '"><a title="' + Menu[i].tooltip + '"><label>' + Menu[i].name + '</label></a></li>';       
     }
     $('.PickerSubValuesPanel').css ("display", 'none');  
     $('#ValuesSearch').css ("display", 'none');  
 
     $('.PickerValues').html (content);
     $('.RuleTitles .Items').removeClass('active');    
     $('.RuleTitles .Actions').addClass('active');    
     $('.PickerValuesPanel').css ("display", 'flex');    
 }


//---------------------------------------------------------- SIGNAL -----------------------------------------------------



//------------------------------------------------------FIELD----------------------------------------------------------

function onclick_pickerfield (elt) {
    $('.RulePicker').css ("display", 'none');    
    $(elt).closest('.sb_overlay').remove();       
    var actionname =  'SET';
    var actiontooltip = 'SET';
    
    var eltpos = $('.RulePicker')[0].attributes.name.textContent;

/*    
    var $row = $('#Rule .action tbody').children().eq(eltpos);  
    
    var $eltinput     = $row.children().eq(1).children().eq(0);
    var $eltoperators = $row.children().eq(2).children().eq(0);
    var $eltinputpar  = $row.children().eq(1).children().eq(1);
    
    var actiontext =  'SET' + ' ' + elt.children[0].children[0].textContent;
    $eltinput.val(actiontext);
    $eltinput.prop ("title", actiontooltip);  
    $eltinput.attr('action',actionname);   

    $eltoperators.css ("display", 'flex');    
  
    var name = 'B_' + elt.children[0].children[0].textContent;
    var index = getmenuindexfromfield(EngineFieldsItems, name, 'name');    
    var content =  GetPropertyContentFromType(EngineFieldsItems, index); 

    
   $eltinputpar.html (content);
   */
}

function PickerFieldsPanel_Update (fieldtype) {
    var content = '';
    for (var i = 0; i < FieldsItems.length; i++) {
        if (fieldtype && FieldsItems[i].Type == fieldtype)        
            content += '<li class="Field" onclick="onclick_pickerfield(this)"><a title="' + FieldsItems[i].Description + '"><label>' + FieldsItems[i].CName + '</label></a></li>';       
        else
            content += '<li class="Field" onclick="onclick_pickerfield(this)"><a title="' + FieldsItems[i].Description + '"><label>' + FieldsItems[i].CName + '</label></a></li>';       
    }

    $('.PickerValues').html (content);
    $('.RuleTitles .Items').removeClass('active');    
    $('.RuleTitles .Fields').addClass('active'); 

    $('.PickerValuesPanel').css ("display", 'flex');  
    $('.PickerSubValuesPanel').css ("display", 'none');  

    filterFunction (document.getElementById('ValuesSearch'), null, 'Field');    
}
   
//-------------------------------------------------------------- VALUES ----------------------------------------------------------


function SelectPickerValues (elt) {
    var content = '';
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Current Bid Price for the underlying Currency' + '"><label>' + 'Bid'    + '</label></a></li>';       
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Current Ask Price for the underlying Currency' + '"><label>' + 'Ask'    + '</label></a></li>';       
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Point of the Current Currency' + '"><label>' + 'Point'  + '</label></a></li>';       
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Digits of the Current Currency' + '"><label>' + 'Digits' + '</label></a></li>';       
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Symbol Name of the Current Currency in which Expert is Running' + '"><label>' + 'Symbol' + '</label></a></li>';       
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Time Frame in which Expert is Running' + '"><label>' + 'Period' + '</label></a></li>';       
    content += '<li class="Value" onclick="OnClickPickerValue(this)"><a title="' + 'Current Platform Time' + '"><label>' + 'Time'   + '</label></a></li>';       
    
//    content = '<input type="text" class="form-control" placeholder="Search.." id="PickerValuesSearch" onkeyup="filterFunction(this, \'Value\')">' + content;   
       

    $('.PickerValuesPanel').css ("display", 'block');  
    $('.PickerSubValuesPanel').css ("display", 'none');

    $('.PickerValues').html (content);     
    $('.RuleTitles .Items').removeClass('active');    
    $('.RuleTitles .Values').addClass('active'); 
}
   
    

//--------------------------------------------------------- CONDITION ------------------------------------------------------------


function SelectPickerConditions () {
   var content = '';
    for (var i = 0; i < solution.CurrentProject.PG.Conditions.length; i++) {
        var condition = solution.CurrentProject.PG.Conditions[i];
        content += '<li class="Condition" onclick="OnClickPickerCondition(this)"><a title="' + condition.SCContent + '"><label>' + condition.Name + '</label></a></li>';       
    }

    $('.PickerValuesPanel').css ("display", 'block');  
    $('.PickerSubValuesPanel').css ("display", 'none');


    $('.PickerValues').html (content);
    $('.RuleTitles .Items').removeClass('active');    
    $('.RuleTitles .Conditions').addClass('active');    
}

//--------------------------------------------------------    PERIODS -------------------------------------------------------------

function SelectPickerPeriods (operator, periods) {
}

function OnClickOperatorPanel () {
    $(this).w2overlay({
        openAbove: window.above,
        pageX: event.pageX,
        pageY: event.pageY,
        html: OperatorPanel()
    });
    
}

function CanDrop (pg, rootnode, dragnode, onnode) {
    let PL = solution.PL;

	PL.PG = pg;    

	var FromName = PL.ReturnTrueName (PL.ReturnIsNameFromObject (dragnode.UserField));
    
    if (onnode == rootnode) {
        return (PL.IsIfStatement (FromName));    
    }
    
    var entity = onnode.UserField;

    if (entity.Type != 'PLOPERATOR') {
        return false;	
    }
    
	var ToName = entity.Val.ActionClass.Name;
	
	return (PL.WCI (ToName, FromName))	

//	return (PL.IsIfStatement (FromName) || PL.IsAction (FromName));		
}


var rulecolumns = ['Rule', 'condition'];
var rulecolumnstitle = ['',  ''];
var rulecolumnsstyle = ['color:#1e83c9',  ''];
var rulerows = [];




function OnClickDeleteRule (rule) {
    var id = rule.id;
    var rulenumber = id.substring ("RuleDeleteButton".length, id.length);
    DeleteRule (rulenumber);   
}

function DeleteRule (rulenumber) {
    $('.RuleTable '  + '.Rule' + rulenumber + 'Class').remove ();
    var childrenrules = $('.RuleTable  tbody')[0].children;
    
    
    for (var i = 0; i < childrenrules.length; i++) {
        var j = i+1;
        jQuery(childrenrules[i]).attr('class', 'Rule' + j + 'Class');
        jQuery(childrenrules[i]).find('.RuleDeleteButton').attr("id", 'RuleDeleteButton' + j);     
        jQuery(childrenrules[i]).find('.box-title').html("Rule " + j);           
        var $ruletable =  jQuery(childrenrules[i]).find(".boxtable");   
        $ruletable.attr("id", "RuleClass" + j);
    }
}

function OnClickActionInput(elt, event) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');
   
    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
    
    var nextitem = -1;
    var previtem = -1;
    var $nexelt = null;
    var $prevelt = null;

    var items = $(elt).closest('tbody').children();

    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.parentElement.parentElement)
            break;
    }

    if (i < items.length - 1) {
        nextitem = i + 1;
        $nextelt = items[nextitem];
    }
    if (i != 0) {
        previtem = i - 1;
        $prevelt = items[previtem];
    }
    
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
        event: event,                 
        pageX: event.pageX,
        pageY: event.pageY,
        onshow : function () {
            $('.PickerValues').css ("display", 'none');             
            $('.PickerSubValues').css ("display", 'none');               
        },         
        html: ActionPickerPanel(i)
    });
}

function OnClickConditionInput(elt, event) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');
   
    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
    
    var nextitem = -1;
    var previtem = -1;
    var nexelt = null;
    var prevelt = null;

    var items = $(elt).closest('tbody').children();

    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.parentElement.parentElement)
            break;
    }


    if (i < items.length - 1) {
        nextitem = i + 1;
        nextelt = items[nextitem];
    }
    
    if (i != 0) {
        previtem = i - 1;
        prevelt = items[previtem];
    }
    
    
    var fieldname     = $(elt).attr('field');    
    var indicatorname = $(elt).attr('indicator');
    var signalname    = $(elt).attr('signal');
    var valuetype     = $(elt).attr('valuetype');

    var openvaluetype = undefined;
    
    if (previtem >= 0) {
        var $preveltinput =  $(prevelt).children().eq(1).children().eq(0);
            openvaluetype = $preveltinput.attr('valuetype');
    }
    
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),    
        event: event,             
        pageX: event.pageX,
        pageY: event.pageY,
        onshow : function () {
            
            if (indicatorname != undefined) {
                PickerObjectsPanel_Update (rulenumber);
                PickerSignalsPanel_Update (indicatorname);
                PickerSignalsPanel_Select (signalname);
            }
        },        
        html: PickerPanel(openvaluetype)
    });
}

function OnClickConditionPeriods(elt, event) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');
   
    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
 
    var items = $(elt).closest('tbody').children();
    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.closest ('tr'))
            break;
    }

    var operatorname = $(elt).attr('operator');
    var periods = $(elt).attr('periods');
    if (periods == undefined) {
        periods = 1 << PeriodName.length;
    }
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),  
        event: event,               
        pageX: event.pageX,
        pageY: event.pageY,
        onshow : function () {
          
        },          
        
        onHide : function () {
            var operatorset = false;
            var operator = $('#' + 'operatorsmenuor').hasClass( "active") ? "Or" : "And";
            var dstring = "";
            var periods = 0;
            for (var j = 0; j <= PeriodName.length; j++) {
                if ($('#PeriodsPicker #' + 'periodcheck_' + j).is(":checked")) {
                    periods |= 1 << j;
                    dstring += (operatorset ? " " + operator + " " : "") + (j == PeriodName.length ? "Current Period" : PeriodName[j]) ;
                    operatorset = true;
                }
            }
            $(elt).val(dstring);
            $(elt).attr ("operator", operator);  
            $(elt).attr('periods',   periods);
            if (periods == 0) {
                $('#PeriodsPicker tr').w2tag('You should select at least one time frame'); 
                return false;
            }
            else {
                $('#PeriodsPicker tr').w2tag(''); 
                return true;
            }
        },
        html: PeriodsPickerPanel(i, operatorname, periods)
    });
}

function OnClickDeleteCondition(elt) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');
   
    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
    
    var items = $(elt).closest('tbody').children();
    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.closest ('tr'))
            break;
    }

    
    if (i == 0 && items.length == 1) {
        var $row = $('#Rule' + rulenumber + ' .condition tbody').children().eq(i);
        var $eltoperator  = $row.children().eq(0).children().eq(0);
        var $eltindicator = $row.children().eq(1).children().eq(0);
        var $eltinput     = $row.children().eq(2).children().eq(0);
        var $eltperiods   = $row.children().eq(3).children().eq(0);
        var $eltoperators = $row.children().eq(4).children().eq(0);
    
        $eltindicator.html('');
        $eltoperator.html('');         
        $eltoperators.html('');     
        $eltinput.val('');
        $eltinput.prop ("placeholder", "Click to Insert Condition");        
        $eltinput.attr('indicator','');
        $eltinput.attr('valuetype','');
        $eltperiods.css ("display", 'none');
  
        return;   
    }
        
    DeleteCondition (rulenumber, i);
}

function DeleteCondition(rulenumber, conditionnumber) {
    var $row = $('#Rule' + rulenumber + ' .condition tbody').children().eq(conditionnumber).remove();;    
} 

function OnClickDeleteAction(elt) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');
   
    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
    
    var items = $(elt).closest('tbody').children();
    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.closest ('tr'))
            break;
    }

    
    if (i == 0 && items.length == 1) {
        var $row = $('#Rule' + rulenumber + ' .action tbody').children().eq(i);
        var $eltinput     = $row.children().eq(1).children().eq(0);
        var $eltoperators = $row.children().eq(2).children().eq(0);
    
        
        $eltinput.val('');
        $eltoperators.css ("display", 'none');        
        $eltinput.prop ("placeholder", "Click to Insert Action");        
        $eltinput.attr('action','');
        return;   
    }
        
    DeleteAction (rulenumber, i);
}
  

function DeleteAction(rulenumber, rownumber) {
    var $row = $('#Rule' + rulenumber + ' .action tbody').children().eq(rownumber).remove();;    
}   
   
function OnClickAddAction (elt) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');

    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
    var items = $(elt).closest('tbody').children();

    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.closest ('tr'))
            break;
    }
    AddAction (rulenumber, i);    
}   
   
function OnClickSetTrackOperator (elt) {
    var operatorname = null;
    switch (elt.parentElement.id) {
        case "operatorsmenuand" :
            operatorname = "And";
        break;
        case "operatorsmenuor" : 
            operatorname = "Or";
        break;  
    }
    
    w2ui['strategytracksignal'].operator = operatorname;        
}  
   
function OnClickAddCondition(elt) {
    var rulenumber = 0;  
    var fatherelt = $(elt).closest('.boxtable');
   
    if (fatherelt.length != 0) {
        var id = fatherelt.attr("id");
        var rulenumber = id.substring ("Rule".length, id.length);    
    }
    
    
    var items = $(elt).closest('tbody').children();
    for (var i = 0; i < items.length; i++) {
        if (items[i] == elt.closest ('tr'))
            break;
    }

    
    if (i == 0 && items.length == 1) {
    }
    var operatorname = null;
    switch (elt.parentElement.id) {
        case "operatorsmenul" :  
            operatorname = "<";
        break;
        case "operatorsmenuleq" :
            operatorname = "<=";
        break;
        case "operatorsmenueq" : 
            operatorname = "=";
        break;
        case "operatorsmenubeq" :
            operatorname = ">=";
        break;
        case "operatorsmenub" :  
            operatorname = ">";
        break;
        case "operatorsmenuand" :
            operatorname = "And";
        break;
        case "operatorsmenuor" : 
            operatorname = "Or";
        break;
 
    }
    AddCondition (rulenumber, i, operatorname);
    
}

function AddCondition (rulenumber, conditionnumber, operatorname) {
    var $row = $('#Rule' + rulenumber + ' .condition tbody').children().eq(conditionnumber);
    $row.after (ConditionStatement (rulenumber, operatorname));
}

function AddAction (rulenumber, rownumber) {
    var $row = $('#Rule' + rulenumber + ' .action tbody').children().eq(rownumber);
    $row.after (ActionStatement (rulenumber));
}

function OnClickPickerValue (elt, rulenumber) {
    var signaltext = elt.children[0].title;
    var fromid = $('.RulePicker')[0].attributes.name.textContent;
    var child = $('#Rule' + rulenumber + ' .RuleConditionValues').children("li").eq(fromid).children().eq(1);
    var periodchild = $('#Rule' + rulenumber + ' .RulePeriodsValues').children("li").eq(fromid).children().first();
    $(child).val(signaltext);
    $(child).prop ("title", signaltext);    
    $('.PickerValues').html ('');
    $('.PickerSubValues').html ('');
    $(periodchild).css ("display", 'none');       
    $('.RulePicker').css ("display", 'none');    
}

function AndOrPanel (operatorname, elt) {
    var onclick = '';
    if (elt) {
        var onclick = ' onclick="' + elt + '" ';
    }
    if (!operatorname) operatorname = "Or";
    var content = '<div class="operatorsmenu btn-group btn-group-toggle" data-bs-toggle="buttons" >' +
    '<label class="btn btn-secondary' +  (operatorname == "And" ? ' active' : '') + '" id = "operatorsmenuand"><input type="radio" name="options"  autocomplete="off"' + onclick + '>And</label>' +
    '<label class="btn btn-secondary' +  (operatorname == "Or" ? ' active' : '') + '"  id = "operatorsmenuor" ><input type="radio" name="options"  autocomplete="off"' + onclick + '>Or</label>' +
    '</div>';
    return content;
}    

function AddActionPanel (rulenumber) {
    var content = '<button type="button" class="operatorsmenu sb_mbutton" data-bs-toggle="button" aria-pressed="false" autocomplete="off" onclick="OnClickAddAction(this);" style="display:none">+</button>';
    return content;
}    

function Basic2LogicPanel (operatorname, elt) {
    var onclick = '';
    if (elt) {
        var onclick = ' onclick="' + elt + '" ';
    }
    if (!operatorname) operatorname = "=";    
    var content = '<div class="operatorsmenu btn-group btn-group-toggle" data-bs-toggle="buttons">' +
    '<label class="btn btn-secondary' +  (operatorname == "<" ? ' active' : '') + '"  id = "operatorsmenul"     style="width: 30px;">    <input type="radio" name="options"  autocomplete="off"' + onclick + '> <  </label>' +
    '<label class="btn btn-secondary' +  (operatorname == "<=" ? ' active' : '') + '" id = "operatorsmenuleq"   style="width: 30px;">    <input type="radio" name="options"  autocomplete="off"' + onclick + '> <=  </label>' +
    '<label class="btn btn-secondary' +  (operatorname == "=" ? ' active' : '') + '"  id = "operatorsmenueq"    style="width: 30px;">    <input type="radio" name="options"  autocomplete="off"' + onclick + '> =  </label>' +
    '<label class="btn btn-secondary' +  (operatorname == ">=" ? ' active' : '') + '" id = "operatorsmenubeq"   style="width: 30px;">    <input type="radio" name="options"  autocomplete="off"' + onclick + '> >=  </label>' +
    '<label class="btn btn-secondary' +  (operatorname == ">" ? ' active' : '') + '"  id = "operatorsmenub"     style="width: 30px;">    <input type="radio" name="options"  autocomplete="off"' + onclick + ' checked> ></label>' +
    '</div>';
    return content;
}

function OnClickAddRule () {  
    
    UpdateRules();
/*
    var rulebody = $('.RuleTable tbody')[0];
    var childrenrules = rulebody.children;
    var rulenumber = childrenrules.length + 1;
    var headercontent = 
    '   <div class="mg-danger-category">' +
    '      <a class="RuleDeleteButton" id="RuleDeleteButton' + rulenumber + '" onclick="OnClickDeleteRule(this);" title="Delete Rule">Delete</a>' +
    '   </div>';
    var rulerows = [['IF', ConditionPanel(rulenumber), ''], ['THEN', ActionPanel (rulenumber), '']];
    
     var tablecontent = TableContent ('Rule' + rulenumber, rulecolumns, rulecolumnstitle, rulecolumnsstyle, rulerows);    
    jQuery(rulebody).append (sb_box ('Rule ' + rulenumber, 'Rule' + rulenumber, tablecontent, headercontent, false, false));
*/    
}



var options = {
		placeholderCss: {
			'position': 'relative',
			'padding': 0
		},
		hintCss: {'background-color': '#bbffbb'},
		hintClass: '',
		baseClass:'RuleTable sTree2',
		onDragStart: function(e, cEl) { 

		},  
		onChange: function(cEl) {
		},
		complete: function(cEl)	{
		},
	    isAllowed: function( cEl, hint, target ) {
		    var FromName  = cEl[0].innerText.split(/ |\n/)[0];
		    var ToName    = target[0].innerText.split(/ |\n/)[0];
            
			if (solution.PL.WCI (ToName, FromName)) {
				hint.css('background-color', '#bbffbb');
				return true;
			}
			else {
				hint.css('background-color', 'tomato');
				return false;
			}
		},
		opener: {
			active: true,
			as: 'html',  // if as is not set plugin uses background image
			close: '<i class="fa fa-minus c3"></i>',  // or 'fa-minus c3'
			open: '<i class="fa fa-plus"></i>',  // or 'fa-plus'
			openerCss: {
				'display': 'inline-block',
				//'width': '18px', 'height': '18px',
				'float': 'left',
				'margin-left': '-35px',
				'margin-right': '5px'
				//'background-position': 'center center', 'background-repeat': 'no-repeat',
			//	'font-size': '1.1em'
			}
		},
		ignoreClass: 'clickable',
        ignorehintClass: 'essai'		
	};


function HTMLFromCondition (objectname, signalname, periodnames, signaldescription) {
    var operatorset = false;
    var operator = "Or";
    var dstring = "";
    var periods = 0;
    for (var j = 0; j <= periodnames.length; j++) {
        if (PeriodName.includes (periodnames[j]) || periodnames[j] == "CurrentPeriod") {
            periods |= 1 << j;
            dstring += (operatorset ? " " + operator + " " : "") + periodnames[j] ;
            operatorset = true;
        }
    }

    var indicatorhtml = '<a class="link" style="color:var(--theme-indicator-color); font-size:12px;" onclick="openPopupObject (\'' + objectname +'\')" role="button">' + objectname + '</a>';
    var content = 
    '<table class="table condition">' +
        '<thead>' +    
                '<tr>' +
                '    <th style="width:15%;">Indicator</th>' +
                '    <th style="width:40%;">Value</th>' +
                '    <th style="width:35%">Periods</th>' +
                '    <th style="width:5%">Operators</th>' +
                '    <th style="width:5%">Delete</th>' +
                '</tr>' +
        '</thead>' +                
    '    <tbody>' +

    '<tr class= "">'+
    '    <td class="">' + '<div   class="ConditionIndicator"></div>' + indicatorhtml + '</td>' +
    '    <td class="">' + '<input class="ConditionInput"     onclick="OnClickConditionInput(this,event)" autocomplete="off" type="text" placeholder="Click to Insert Condition" value="' + signaldescription + '" readonly title="' + signaldescription + '" signal = "' + signalname + '"></td>' +
    '    <td class="">' + '<input class="ConditionPeriods"   onclick="OnClickConditionPeriods(this,event)" autocomplete="off" type="text" placeholder="Current Period" value="' + dstring + '" readonly title="Periods"></td>' +
    '    <td class="">' + '<span  class="RuleOperatorsValues"></span></td>' +
    '    <td class="">' + DeleteConditionPanel(0)  + '</td>' +
    '</tr>' +
    '    </tbody>' +
    '</table>';

    return content;
}

function HTMLFromEntity (node) {   //operator
    var entity      = node.UserField;
    let PL = solution.PL;
    let PG = PL.PG;

    //var stylestring = ' style="color:' + node.TextColor + '; background-color:' + node.BackColor + ';"';
    var stylestring = '';
    var basicname   = '<div class="nodelist"' + stylestring + '>' + node.Name[0]  + '</div>';
   
    if (!entity) return basicname;   // root
    
    if (entity.Type == 'PLOPERATOR')	{
    	var action = entity.Val;   



    	if (action.ActionClass.Name.IsObjectLogic () ||
            action.ActionClass.Name.IsObjectLogicInput () ||
            action.ActionClass.Name.IsObjectInput ())  {
    
                if (action.ListParams.length < 2)
                    return basicname;
                    
    		    var nbrperiods = action.ListParams.length - 2;
    		    var objectname = action.ListParams[0].Val.Name;
    		    var signalname = action.ListParams[1].Val.Name;
    		    var periodnames = [];
    
                var object = PG.GetObjectFromName (objectname);
                if (!object) return;
                var indicatorname = objectname;
                if (object.Type != "PREDEFINED")
                    indicatorname = object.Type;
                    
    		    for (var j = 0; j < nbrperiods; j++) 
    		        periodnames.push (action.ListParams[2 + j].Val.Name == 'CurrentPeriod' ? action.ListParams[2 + j].Val.Name : action.ListParams[2 + j].Val.Name.substring(2));
    		    var signaldescription = action.UserField.Name;       
                signaldescription = GetSignalDescriptionFromObjectType (indicatorname, signalname.substring(2));
                return  '<div class="nodelist object"' + stylestring + '>' + HTMLFromCondition (objectname, signalname, periodnames, signaldescription)  + '</div>';
    	}    
    }
	return basicname;
}


function UpdateRules () {
    let PL = solution.PL;
    let PG = PL.PG;

    if (!CurrentStrategy)
        return;
    if (!CurrentContainer.RootNode) 
        return;
    var rulebody = $('.RuleTable tbody')[0];

    jQuery(rulebody).html('');
    
    
    var headercontent = 
    '   <div class="mg-danger-category">' +
    '      <a class="RuleDeleteButton" id="RuleDeleteButton" onclick="OnClickDeleteRule(this);" title="Delete Rule">Delete</a>' +
    '   </div>';
    
    for (var i = 0; i < CurrentContainer.RootNode.Inherit.length; i++) {
        var rulenode =  CurrentContainer.RootNode.Inherit[i].ToNode;
        if (PL.IsIfStatement (rulenode.Name[0]) || PL.IsAction (rulenode.Name[0]) ) {
            var htmlstring = "";
            htmlstring =  '<ul class="sTree2" listsClass" id="Rule' + i + '">' +  HTMLFromNode (solution.CurrentProject.PG, "", CurrentContainer.RootNode, rulenode, 1) + '</ul>';
            jQuery(rulebody).append (sb_box ('Rule ' + i, 'Rule' + i, htmlstring, headercontent, true, false));
  	   //     $('#Rule' + i).sortableLists(options);            
        }        
    }
}

function HTMLFromNode (PG, htmlstring,  containerrootnode, node, expand) {

	if (!node) return "";
/*
    if (expand) {
        var entity = Object.UserField;
  
        if (entity.FatherAction && entity.FatherAction.ActionClass.Name == "EXECUTE")  {
        	var condition = PG.GetConditionFromName (Object.Name[0]);
        	markstring = markstring + condition.SCContent;
        	return markstring;
        }
    }
    */
	if (node != containerrootnode) {
        var entity = node.UserField;
        var classname= '';
        if (entity.Type != 'PLOPERATOR' || entity.Val.NbParam == 0) {
            classname= 'essai';	
        }


        var stylestring = ' style="color:' + node.TextColor + '; background-color:' + node.BackColor + ';"';
        htmlstring += '<li class="s-l-open ' + classname + '" id="item_b" data-module="' + node.Space.Name + '"' + stylestring + '>';		    

        htmlstring += HTMLFromEntity(node);		
	}

	if (node.Inherit.length != 0) {
        htmlstring += '<ul class="">'; 
	}
	
	for (var i = 0; i < node.Inherit.length; i++)	{
	    htmlstring = HTMLFromNode (PG, htmlstring, containerrootnode, node.Inherit[i].ToNode, expand);
    }
   
   	if (node.Inherit.length != 0) {
        htmlstring += '</ul>'; 
	}

	if (node != containerrootnode) {
		if (node.Space.Name == "ACTION")	{
		    htmlstring += '</li>';
		}
	}

	return htmlstring;
}	


function DeleteConditionPanel (rulenumber) {
    var onclick = ' onclick="OnClickDeleteCondition(this, ' + rulenumber + ');" ';
    var content ='<div class="mg-info-category"><a class="DeleteCondition"' +  onclick + '> <i class="fas fa-times-circle"></i> </a></div>'
    return content;
}

function ConditionStatement (rulenumber, operatorname) {
   var content = 
    '               <tr class= "">'+
    '                   <td class="">' + '<div   class="ConditionOperator">' + (operatorname ? operatorname : '') + '</div></td>' +
    '                   <td class="">' + '<div   class="ConditionIndicator"></div>' + '</td>' +
    '                   <td class="">' + '<input class="ConditionInput"     onclick="OnClickConditionInput(this,event)" autocomplete="off" type="text" placeholder="Click to Insert Condition" value="" readonly title="Condition">' + '</td>' +
    '                   <td class="">' + '<input class="ConditionPeriods"   onclick="OnClickConditionPeriods(this,event)" autocomplete="off" type="text" placeholder="Current Period" value="" readonly title="Periods" style="display:none">'+ '</td>' +
    '                   <td class="">' + '<span  class="RuleOperatorsValues"></span>' + '</td>' +
    '                   <td class="">' + DeleteConditionPanel(rulenumber)  + '</td>' +
    '               </tr>';
    return content;
}

function ConditionPanel (rulenumber) {
   var content = 
    '<table class="table condition">' +
        '<thead>' +    
                '<tr>' +
                '    <th style="width:5%;">Operator</th>' +
                '    <th style="width:10%;">Indicator</th>' +
                '    <th style="width:40%;">Value</th>' +
                '    <th style="width:35%">Periods</th>' +
                '    <th style="width:5%">Operators</th>' +
                '    <th style="width:5%">Delete</th>' +
                '</tr>' +
        '</thead>' +                
    '    <tbody>' +
            ConditionStatement (rulenumber) +
    '    </tbody>' +
    '</table>';
    return content;
}

function DeleteActionPanel (rulenumber) {
    var onclick = ' onclick="OnClickDeleteAction(this, ' + rulenumber + ');" ';
    var content ='<div class="mg-info-category"><a class="DeleteAction"' +  onclick + '> <i class="fas fa-times-circle"></i> </a></div>'
    return content;
}

function ActionStatement (rulenumber) {
   var content = 
    '               <tr class= "">'+
    '                   <td class="">' + '<div class="" >' + '</div>' +
    '                   <td class="">' + '<input class="ActionInput"  onclick="OnClickActionInput(this,event)" autocomplete="off" type="text" placeholder="Click to Insert an Action" value="" readonly title="Action">' + 
    '                                     <div class="ActionInputParameter"></div>'+ '</td>' +
    '                   <td class="">' + AddActionPanel () + '</td>' +    
    '                   <td class="">' + DeleteActionPanel(rulenumber) + '</td>' +    
    '               </tr>';
    return content;
    
}


function ActionPanel (rulenumber) {
   var content = 
    '<table class="table action">' +
        '<thead>' +    
                '<tr>' +
                '    <th style="width:15%;"></th>' +
                '    <th style="width:75%;">Action</th>' +
                '    <th style="width:5%">Operators</th>' +                
                '    <th style="width:5%">Delete</th>' +                
                '</tr>' +
        '</thead>' +                
    '    <tbody>' +
            ActionStatement (rulenumber) +
    '    </tbody>' +
    '</table>';
    return content;
}


    
function PeriodsPickerPanel (conditionnumber, operatorname, periods) {
    var content = 
    '<table class="table boxtable" id="PeriodsPicker" name="' + conditionnumber + '">' +
    '    <thead>' +
    '        <tr>' +
                 (operatorname ? '<th title= "Time Frames Combination">Logic</th>' : '') +
    '            <th title= "1 minute">M1</th>' +
    '            <th title= "5 minutes">M5</th>' +
    '            <th title= "15 minutes">M15</th>' +
    '            <th title= "30 minutes">M30</th>' +
    '            <th title= "1 hour">H1</th>' +
    '            <th title= "4 hours">H4</th>' +
    '            <th title= "1 day">D1</th>' +
    '            <th title= "1 week">W1</th>' +
    '            <th title= "1 month">MN</th>' +
    '            <th title="Any Time Frame : Time Frame in which expert is running" style="color: tomato;">EP</th>' +
    '        </tr>' +
    '    </thead>' +
    '    <tbody>';
    var id = 'PeriodsPicker';
   
    var rowcontent = '<tr>';
    
    if (operatorname) {
        var operatorstoggle = AndOrPanel (operatorname);
        rowcontent += '<td style="text-align: center;">' + operatorstoggle + '</td>';
    }
    
    for (var j = 0; j <= sPeriodName.length; j++) {
        rowcontent += '<td style="text-align: center;"' + '>' + 
                            '<input class="periodscheck" type="checkbox"  '  + (periods  && (periods & (1 << j)) ? 'checked' : '') + ' id="periodcheck' + '_' + j + '"/></td>';
    }
    rowcontent += '</tr>';
    content += rowcontent + '</tbody></table>';
    return content;
}
  
  
function OperatorPanel (isvalue) {
    var isvalue = true;
    var islogicvalue = true;
    var islogicboolean = true;
    var isoperator = true;
    
    
    var content = '<div class="calculator">' +
   '  <input type="text" class="calculator-screen" value="" disabled="">' +
   '  <div class="calculator-keys">' +
   '    <button type="button" class="operator math" value="+"' + (isoperator ? '' : 'disabled') + '> +</button>' +
   '    <button type="button" class="operator math" value="-"' + (isoperator ? '' : 'disabled') + '> -</button>' +
   '    <button type="button" class="operator math" value="*"' + (isoperator ? '' : 'disabled') + '> Ã—</button>' +
   '    <button type="button" class="operator math" value="/"' + (isoperator ? '' : 'disabled') + '> Ã·</button>' +
   
   '    <button type="button" class="operator math" value="Abs"' + (isvalue ? '' : 'disabled') + '>      Abs</button>' +
   '    <button type="button" class="operator math" value="Min"' + (isvalue ? '' : 'disabled') + '>      Min</button>' +
   '    <button type="button" class="operator math" value="Max"' + (isvalue ? '' : 'disabled') + '>      Max</button>' +
   
   '    <button type="button" class="logic basic1logic" value="And"' + (islogicboolean ? '' : 'disabled') + '>  And</button>' +
   '    <button type="button" class="logic basic1logic" value="Or"'  + (islogicboolean ? '' : 'disabled') + '>   Or</button>' +
   '    <button type="button" class="logic basic1logic" value="Not"' + (islogicboolean ? '' : 'disabled') + '>  Not</button>' + 
   '    <button type="button" class="logic basic2logic" value=">"'  + (isvalue || islogicvalue ? '' : 'disabled') + '>    > </button>' +
   '    <button type="button" class="logic basic2logic" value=">="' + (isvalue || islogicvalue ? '' : 'disabled') + '>   >=</button>' +
   '    <button type="button" class="logic basic2logic" value="="'  + (isvalue || islogicvalue ? '' : 'disabled') + '>    = </button>' +
   '    <button type="button" class="logic basic2logic" value="<="' + (isvalue || islogicvalue ? '' : 'disabled') + '>   <=</button>' +
   '    <button type="button" class="logic basic2logic" value="<"'  + (isvalue || islogicvalue ? '' : 'disabled') + '>    < </button>' +
   '    <button type="button" class="all-clear" value="all-clear">AC</button>' +
   '    <button type="button" class="equal-sign operator" value="=">=</button>' +
   '  </div>' +
   '</div>';
    return  content;    
}

function SymbolNamePanel(Symbol) {
    var Name = "";
    if (Symbol) Name = Symbol.Name;
    if (Symbol && Symbol.Connected == true) {
        color =  theme_on;
    } else color = theme_bear;
    var content = '<div><input type="text" id ="symbolname";  value = "' + Name + '" style="display:inline-block;  text-align :center; height: 20px; width: 120px; background-color:black; margin-left: 10px; color:' + color + '; border: 1px solid silver; box-shadow: 0 0 5px black;border-radius: 4px;padding: 2px;height:24px;"></div>';
    return content;
}



function StrategyTypePanel(StrategyType) {
    var descp = (StrategyType ? StrategyType.tooltip : "");
    var name = (StrategyType ? StrategyType.name : "");
    var content = '<div name="strategytypetitle" id="strategytypetitle" style="font-size: 14px; padding: 40px 45px; border-top: 0px solid silver; color : blue; background:white;height: 50px;">' + name + '</div><div name="help" id="strategytypehelp" style="font-size: 12px; padding: 0px 45px; border-top: 0px solid silver; color : black; background:white;height: 100%;">' + descp + '</div>';
    return content;
}

function OnCancelSession(event) {
    var shouldDisable = true;
    for (var i = 0; i < w2ui['sessionproperty'].records.length; i++) {
        if (w2ui['sessionproperty'].records[i].w2ui.changes) w2ui['sessionproperty'].records[i].w2ui.changes = null;
    }
    w2ui['sessionproperty'].refresh();
    document.getElementById('SaveSession').disabled = shouldDisable;
    document.getElementById('CancelSession').disabled = shouldDisable;
}


function SessionPanel1() {
    var content = '<div  style = " border: 0px solid green; margin-top: 10px; position: relative;">' + '<button class= "w2ui-btn sb_mbutton" id="seetree" name="SeeTree" onclick="OnSeeTree (event)"  style = "padding:0px;   position: absolute; left: 1%;   height: 10px; width: 50px; text-align :center;  background  :' + White + ';">See Graphic</button>' + '<button class= "w2ui-btn sb_mbutton" id="cancel" name="cancel" onclick="OnCancelSession (event)"  style = "padding:0px;   position: absolute; left: 10%;   height: 25px; width: 100px; text-align :center;  background  :' + White + ';">Cancel</button>' + '<button class= "w2ui-btn btn btn-primary" id="update" name="update" onclick="w2ui[\'sessionproperty\'].save ()" style = "padding:0px;  position: absolute; right: 10%;    float: right; height: 25px; width: 100px; text-align :center; background  :' + White + ';">Apply</button></div>';
    return content;
}

function ModalPanel () {
   var content = '';
   content += 
    '<div class="modal" tabindex="-1" role="dialog">' +
    '  <div class="modal-dialog" role="document">' +
    '    <div class="modal-content">' +
    '      <div class="modal-header">' +
    '        <h5 class="modal-title">Modal title</h5>' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '          <span aria-hidden="true">&times;</span>' +
    '        </button>' +
    '      </div>' +
    '      <div class="modal-body">' +
    '        <p>Modal body text goes here.</p>' +
    '      </div>' +
    '      <div class="modal-footer">' +
    '        <button type="button" class="sb_mbutton" data-dismiss="modal">Close</button>' +
    '        <button type="button" class="sb_mbutton">Save changes</button>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>';
    return content;    
}

function CardPanel (id, id1, title) {
    var content = '';
    content +=     
'  <div class="box" id="' + id1 + '">' +
'      <div class="box-content" >' +
'          <div class="sb_boxbody">' +
'             <div id = "' + id + '" style="position: absolute; width: 100%; height: 100%; left: 0px"></div>' +
'          </div>' +
'      </div>' +
'  </div>';
    return content;
}


function OnClickNewsCurrency (symbolname) {
    if (symbolname == "") return;
    let platform =  sb.get(main, 'pname', 'option');
    if (platform.length == 0) {
        solution.add_module('option');               
    } 
    let ui  = solution.get('ui')     
    ui.platform_select(OPTION_PLATFORM_PNAME)   
    selector_select('option_selectterminal', 'Yahoo Finance');

    SearchQuote (symbolname);
}


function FormPanel () {
    var content =
'     <table class="table boxtable" id="formpanel">' +
'     <tbody>' +    
'         <tr id="" title="Signals Panel on MT4 Terminal">' +
'             <td id=""><a class="mainpanel" >' + 'MT4 Main Panel' + '</a></td>' +
'             <td id="" style="text-align: center;"><input class="mainpanelcheck" type="checkbox" id="mainpanelcheck"></td>' +
'         </tr>' +
'         <tr id="" title="Display Comments on MT4 Terminal, Gives statues of experts running...">' +
'             <td id=""><a class="comments" >' + 'MT4 Comments' + '</a></td>' +
'             <td id="" style="text-align: center;"><input class="commentscheck" type="checkbox" id="commentscheck"></td>' +
'         </tr>' +
'         <tr id="" title="Display Opening Markets on MT4 terminal">' +
'             <td id=""><a class="markets" >' + 'MT4 Markets' + '</a></td>' +
'             <td id="" style="text-align: center;"><input class="marketscheck" type="checkbox" id="marketscheck"></td>' +
'         </tr>' +
'         <tr id="" title="Operations Sound on the device Running MT4 Terminal">' +
'             <td id=""><a class="operations" >' + 'Operations' + '</a></td>' +
'             <td id="" style="text-align: center;"><input class="operationscheck" type="checkbox" id="operationscheck"></td>' +
'         </tr>' +
'         <tr id="" title="Alerts Sound on the device Running MT4 Terminal">' +
'             <td id=""><a class="alerts" >' + 'Alerts' + '</a></td>' +
'             <td id="" style="text-align: center;"><input class="alertscheck" type="checkbox" id="alertscheck"></td>' +
'         </tr>' +
'         <tr id="" title="News Sound on the device Running MT4 Terminal">' +
'             <td id=""><a class="news" >' + 'News' + '</a></td>' +
'             <td id="" style="text-align: center;"><input class="newscheck" type="checkbox" id="newscheck"></td>' +
'         </tr>' +
'     </tbody>' +
'     </table>';
    return content;
}

function PropertyPanel (description) {
    var content =    
'	<div class="contactdialog mg-card-box padding-20">' +
'			<table style="text-align: left; width: 100%; border: 0px solid orange;" cellspacing="2" cellpadding="2">' +
'                <tbody>' +
'                    <tr>' +
'                        <td style="vertical-align: top; padding: 30px; font-size: 12px; border: 0px solid orange;">' +
'                            <p>' + description + '</p>' +
'                        </td>' +
'                    </tr>' +
'                </tbody>' +
'            </table>' +
'		</div>';
    return content;
}



function StrategyCreatorHomePanel () {
    var content =     
'   <div id="strategycreator_homepage">' +
'       <div class="col-12" id="strategycreator_header">' +
               project_assistant_panel () + 
//             StrategyCreatorHeaderPanel () +
'       </div>' +
'       <div class="row">' +
'           <div class="col-12" id="strategycreator_title">' +
                StrategyCreatorTitlePanel () +
'           </div>' +
'       </div>' +
'       <div class="elementor-row" id="strategycreator_body">' +
            StrategyCreatorElementsPanel () +
'       </div>';
'   </div>';
    return content;
}

function OnContextMenuEditor(event, element) {
    return;
}

//---------------------------------------------------- INDICATOR PANEL------------------------------------------------ 

function CrossInput_Update (array) {
    var content = '';
    
    for (var i= 0; i < array.length; i++) {
        content +='<option value="' + array[i] + '">' + array[i]  + '</option>';
    }
    $('#paramid_cross').html (content);

}

function AddCrossObjects(object) {
    if (object instanceof pgobject) {
        var TypeName    = object.Type;       
        var type = ObjectTypeName.indexOf(TypeName);         
        var Display     = object.Display;
        var DisplayType = object.DisplayType;
        var ProgName    = object.ProgName;
    } else {
        var indicatortype = object;

        var TypeName    = indicatortype.name;        
        var type        = indicatortype.type;        
        var Display     = IndicatorsTypeMenu[type].display;
        var DisplayType = IndicatorsTypeMenu[type].displaytype;
        var ProgName    = '----';
    }

    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }        
    if (DisplayType != TRENDLINE_TYPE) return;

    let ObjCross = [];
    var j = 0;


    switch (type) {
    case MA_TYPE:
    case BOLLINGER_TYPE:
    case CUSTOM_TYPE: {
        for (var i = 0; i < PG.Objects.length; i++) {
            var userobject = PG.Objects[i];
            if (!userobject || (object && userobject == object) || userobject.Type == "PREDEFINED" || userobject.Type == "SYSTEM") continue;
            if (userobject.Display != Display) continue;
            if (userobject.DisplayType != TRENDLINE_TYPE) continue;
            if (Display == MAIN_DISPLAY) {
                ObjCross[j++] = userobject.Name;
            } else {
                if (userobject.Type == TypeName) {
                    if (TypeName != "CUSTOM") ObjCross[j++] = userobject.Name;
                    else
                    if (userobject.ProgName == ProgName) ObjCross[j++] = userobject.Name;
                }
            }
        }
    }
    break;
    case CCI_TYPE:
    case ADX_TYPE:
    case WPR_TYPE:
    case ATR_TYPE:
    case RSI_TYPE:
    case STOCHASTIC_TYPE:
    case MACD_TYPE: {
        for (var i = 0; i < PG.Objects.length; i++) {
            var userobject = PG.Objects[i];
            if (!userobject || (object && userobject == object)) continue;
            if (userobject.Type == TypeName) ObjCross[j++] = userobject.Name;
        }
    }
    break;
    }
    ObjCross[j++] = '';
    CrossInput_Update (ObjCross, object);   
    if (object instanceof pgobject) {
        $('#paramid_cross').val(object.Cross);
    }
    else {
        $('#paramid_cross').val('');
    }    

}


function Indicator_UpdateFields(object) {

    var type = ObjectTypeName.indexOf(object.Type);
    $('#indicatorname').val(object.Name);
    switch (type) {
    case MA_TYPE:
        $('#paramid_period').val(object.Period);
        $('#paramid_shift').val(object.Shift);
        $('#paramid_applyto').val(ApplyTo[object.Apply].text);
        $('#paramid_mamethod').val(MaMethod[object.Method].text);
        break;
    case ADX_TYPE:
        $('#paramid_period').val(object.Period);
        $('#paramid_mode').val(ModeDI[object.Mode].text);
        $('#paramid_applyto').val(ApplyTo[object.Apply].text);
        break;
    case CCI_TYPE:
        $('#paramid_period').val(object.Period);
        $('#paramid_applyto').val(ApplyTo[object.Apply].text);
        break;
    case ICHIMOKU_TYPE:
        $('#paramid_tenkansen').val(object.Period);
        $('#paramid_kijunsen').val(object.Method);
        $('#paramid_senkouspanb').val(object.Apply);
        break;
    case BOLLINGER_TYPE:
        $('#paramid_period').val(object.Period);
        $('#paramid_shift').val(object.Shift);
        $('#paramid_dev').val(object.Method);
        $('#paramid_mode').val(ModeUL[object.Mode].text);
        $('#paramid_applyto').val(ApplyTo[object.Apply].text);
        break;
    case SAR_TYPE:
        $('#paramid_step').val(object.Step);
        $('#paramid_maximum').val(object.Maximum);
        break;
    case RSI_TYPE:
        $('#paramid_period').val(object.Period);
        $('#paramid_applyto').val(ApplyTo[object.Apply].text);
        break;
    case MACD_TYPE:
        $('#paramid_ Fast EMA').val(object.Period);
        $('#paramid_ Slow EMA').val(object.Method);
        $('#paramid_ SMA').val(object.Shift);
        $('#paramid_ Mode').val(ModeMS[object.Mode].text);
        $('#paramid_ applyto').val(ApplyTo[object.Apply].text);
        break;
    case STOCHASTIC_TYPE:
        $('#paramid_percentkperiod').val(object.Period);
        $('#paramid_percentdperiod').val(object.Shift);
        $('#paramid_mode').val(ModeMS[object.Mode].text);
        $('#paramid_pricefield').val(PriceField[object.Apply].text);
        $('#paramid_slowing').val(object.Value[0]);
        $('#paramid_mamethod').val(MaMethod[object.Method].text);
        break;
    case WPR_TYPE:
        $('#paramid_period').val(object.Period);
        break;
    case ATR_TYPE:
        $('#paramid_period').val(object.Period);
        break;
    case CUSTOM_TYPE:
        $('#paramid_display').val(Display[object.Display].text);
        $('#paramid_displaytype').val(DisplayType[object.DisplayType].text);
        $('#paramid_file').val(object.ProgName);        
        
        break;
    }

    if (object.LevelType == OVERBOUGHTOVERSOLD_LEVEL) {
        $("#overboughtsold").prop("checked", true) ;
        $("#strongweak").prop("checked", false);    
    }
    else
    if (object.LevelType == STRONGWEAK_LEVEL) {
        $("#overboughtsold").prop("checked", false) ;
        $("#strongweak").prop("checked", true);     
    }
    
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < NBR_PERIODS; col++) {
            sb.table_setcellcontent (indicatorlevelstable, row, PeriodName[col], 
                sb.item ({
                    id: row + '_' + col, 
                    type: 'float', 
                    value: object.Level[row][col] == EMPTY_VALUE ? '' :object.Level[row][col]
                }));        
        }    
    }

                
/*
    	    case CUSTOM_TYPE        :

    			ObjectPar.m_ObjProgTrendCombo.SetCurSel (4);

    			ObjectPar.m_ObjProgNameEdit.SetWindowText("");

    			out.Format("%s", object.ProgName);

    			ObjectPar.m_ObjProgNameEdit.SetWindowText(out);

    			ObjectPar.m_ObjProgTypeCombo.SetCurSel (object.DisplayType);	

    			ObjectPar.m_ObjProgDisplayCombo.SetCurSel (object.Display);

    		break;

    		case PREDEFINED_TYPE    :

    			if (m_ObjTypeCombo.SelectString (-1, ObjTypeName[type]) == -1)

    				m_ObjTypeCombo.AddString (ObjTypeName[type]);

    			m_ObjTypeCombo.EnableWindow (false);

    			m_ObjNameEdit.EnableWindow (false);	

    			ObjectPar.m_ObjImageStatic.EnableWindow (true);

    		break;            

        }
*/
}

/*---------------------------------------------------- INDICATOR DESCRIPTION PANEL -----------------------------------------*/

function IndicatorDescriptionPanel(id, classnames) {

    var content     = '';
    content +=   
'   <div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +     
'       <div name="indicatortitle" id="indicatortitle">' + 
'       </div>' + 
'       <div name="help" id="indicatorhelp">' + 
'       </div>' + 
'   </div>';
    return content;
}

function IndicatorDescriptionPanel_Update (indicatortype) {
    var descp = (indicatortype ? indicatortype.tooltip : "");
    var name = (indicatortype ? indicatortype.name : "");
    
    $('#indicatortitle').html (name);
    $('#indicatorhelp').html (descp);
}

/*---------------------------------------------------------- INDICATOR NAME PANEL ----------------------------------------------*/

function IndicatorNamePanel(name, readonly, withcreated) {
    var content = 
    '<div id= "indicatornamepanel" class="row">' +
    '   <div class="col-6">' +
            '<div class="sb_formgroup">' +
            '    <label>Name*</label>' +
            '        <input id="indicatorname" type="text" class="form-control valid" value= "' + name + (readonly ? '" readonly ' : '"') + ' autocomplete="off"  onpaste="CheckContent(event)" onkeypress="CheckChar(event)" aria-invalid="false">' +
            '    <label id="strategy_assistant_name-error" class="error" for="strategy_assistant_name" style="display: none;"></label>' +
            '</div>' +
        '</div>' +
        (withcreated ? 
    '   <div class="col-6">' +  
            StrategyAssistantCreatedIndicators ('type') + 
//    '       <button id = "indicatoradd" type="button" class="btn btn-primary" onclick="NewIndicator()" style="margin-top: 25px;">Add</button>' +
    '   </div>' : '')  +
    '</div>';
    return content;
}

function IndicatorNamePanel_Update (indicatortype) {
    var name;
    var readonly = false;
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }          
    if (indicatortype.type == PREDEFINED_TYPE) {
        name = indicatortype.name;
        readonly = true;
    } else {
        name = PG.ObjectFindName(indicatortype.type);
        focusAndCursor('#indicatorname'); 
    }


    $('#indicatorname').val(name);    
    $("#indicatorname").prop("readonly", readonly);
}

/*-------------------------------------------------------- INDICATOR PARAMETERS PANEL ------------------------------------------------*/

function RefreshHelpAssistant(str, color, id) {

    if (!document.getElementById(id)) return;
    
    var help = $('#' + id);
    help.val(str);
    if (color) {
        help[0].style.cssText = 'color:' + color + ' !important';
    } else {
        help[0].style.cssText = 'color:' + "";
    }
}

function StrategyAssistantClick (id) {
    var description = getmenuname(EngineFieldsItems, id);
    RefreshHelpAssistant(description);
}


function GetIndicatorContentFromType (array, i, inputsize) {
    if (!inputsize) 
        inputsize = 8;
    var field       = array[i];
    var id          = field.field;
    var property    = field.name;
    var type        = field.editable.type;    
    var value       = field.editable.default;
    var description = '';
    var content     = '';
    
    if (type == 'file') {
        content += '<input type="text" class="ParameterClass required col-sm-' + inputsize + ' form-control" id="paramid_' + id + '" value="'+  value + '" autocomplete="off" data-toggle="tooltip" data-placement="right" title="' + description + '">';

    } else
    if (type == 'select') {
        var menu = field.editable.items;
        content += '<select  class="ParameterClass col-sm-' + inputsize + ' form-control" id="paramid_' + id + '" data-toggle="tooltip" data-placement="right" title="' + description + '">';
        for (var j = 0; j < menu.length; j++) {
            content += '<option value = "' + menu[j].text  + '"' + (value ==  menu[j].text ? ' selected' : '') + '>' + menu[j].text + '</option>'; 
        }
        content +='</select>';
    }
    else {
        var min =  field.editable.min;
        var max =  field.editable.max;
        if (field.editable.spin) {
            var step = field.editable.step;
            content += '<input type="number" class="ParameterClass required col-sm-' + inputsize + ' form-control" id="paramid_' + id + '" value="'+  value + '" min="' + min + '" max="' + max + '" step="' + step + '" autocomplete="off" data-toggle="tooltip" data-placement="right" title="' + description + '">';
        }
        else {
            content += '<input type="text"  class="ParameterClass col-sm-' + inputsize + ' form-control" id="paramid_' + id + '" value="' +  value + '" autocomplete="off" onclick= "StrategyAssistantClick (' + id + ', this)"  data-toggle="tooltip" data-placement="right" title="' + description + '">';
        }
    }        
    return content;
}

function IndicatorParametersPanel (id, classnames) {
    var content     = '';
    content +=         
    '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +  
    '</div>';
    return content;   
}

function IndicatorParametersPanel_Update (indicatortype) {
    if (indicator.type == PREDEFINED_TYPE) 
        return;

    var content = '';
    var parmenu = IndicatorsFieldMenu[indicatortype.type];
    var section = null;
    var colsize = 6;

    if (indicatortype && indicatortype.type == PREDEFINED_TYPE) {
        content += '<div class="">Predefined Indicator, No Parameters, Check Signals</div>';
    } else {   
        for (var i = 0; i < parmenu.length; i++) {
            if (i % 2 == 0) {
                content += '<div class="row" >';
            }        
            content +=    
            '  <div class="col-' + colsize + '">' + (section != null ? '<label class="sb_widget-title">' + section + '</label>' : '') +
            '      <div class="sb_formgroup sb_row">' +
            '         <label>' + parmenu[i].property + '</label>' +    
                    GetIndicatorContentFromType(parmenu, i) + 
            '      </div>' +
            ' </div>';
            if (i % 2 != 0) {
                content += '</div>';
            }        
        }
    }

    $('#indicatorparameterspanel').html (content);
     
}

/*-------------------------------------------------------- INDICATOR SIGNALS PANEL ------------------------------------------------*/

var IndicatorSignalsTable = {
    id: 'indicatorsignalstable',
    columns :  ['Signals', 'Description', 'Type'],
    columnstitle : ['Signals', 'Description', 'Type'],
//    columnsstyle: ['padding-left:10px;width: 100px;', 'text-align: left;padding-left:15px', 'text-align: center; padding-right:10px;  width:30px;'],
    rows : [] 
}


function GetSignalsTableFromIndicatorType (indicatortype) {
    var signalstable = [];
    for (var index = 0; index < solution.ObjectSignals.length; index++) {
        if (solution.ObjectSignals[index].objectname == indicatortype.name) {
            var signals = solution.ObjectSignals[index].signals;
            for (var i = 0; i < signals.length; i++) {
                signalstable.push ([signals[i].text, signals[i].description, signals[i].type]);
            }
            break;
        }
    }
    return signalstable;
}

function IndicatorSignalsPanel (id, classnames) {
    var content     = '';
    content +=         
    '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 
        sb.table (IndicatorSignalsTable) +    
    '</div>';
    return content;   
}

function IndicatorSignalsPanel_Update (indicatortype) {
    var rows = GetSignalsTableFromIndicatorType(indicatortype);
    sb.table_setrows (IndicatorSignalsTable, rows);
}

/*----------------------------------------------------------- INDICATOR LEVELS PANEL -----------------------------------------------------*/

function onclick_fillright () {
    for (var row = 0; row < 5; row++) {
        var value =  $('#indicatorlevelstable' + ' #' + row + '_' + 0).val();
        for (var col = 1; col < NBR_PERIODS; col++) {
            $('#indicatorlevelstable' + ' #' + row + '_' + col).val(value);
        }    
    }
}

function onclick_filldown () {

}

function onclick_overboughtsold () {
    $('#overboughtsold').prop("checked", true);  
    $('#strongweak').prop("checked", false);   
}

function onclick_strongweak () {
    $('#overboughtsold').prop("checked", false);  
    $('#strongweak').prop("checked", true);   
}

function onclick_clear () {
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < NBR_PERIODS; col++) {
            $('#indicatorlevelstable' + ' #' + row + '_' + col).val('');
        }
    }    
}

function IndicatorLevelsPanel (id, classnames) {
    var content     = '';
    content +=         
    '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 
        sb.bar (indicatorlevelsbar) +
        sb.table (indicatorlevelstable) +    
    '</div>';
    return content;   
}

function IndicatorLevelsPanel_Update (indicatortype) {
    if (indicator.type == PREDEFINED_TYPE || indicator.type == SYSTEM_TYPE) 
    return;

    var parmenu = IndicatorsTypeMenu[indicatortype.type];    

    if (parmenu.levels.length == 0) {
        IndicatorLevelsPanel_Toggle (false);
        return;
    } else {
        IndicatorLevelsPanel_Toggle (true);
    }
    
    if (parmenu.leveltype == OVERBOUGHTOVERSOLD_LEVEL) {
        onclick_overboughtsold();     
    } else
    if (parmenu.leveltype == STRONGWEAK_LEVEL) {
        onclick_strongweak();      
    }
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < NBR_PERIODS; col++) {
            sb.table_setcellcontent (indicatorlevelstable, row, PeriodName[col], 
                sb.item ({
                    id: row + '_' + col, 
                    type: 'float', 
                    value: parmenu.levels[row]
                }));
        }
    }
}

function IndicatorLevelsPanel_Toggle (show) {
    if (show) {
        $('#indicatorlevelspanel').css ('display', 'block');
    } else {
        $('#indicatorlevelspanel').css ('display', 'none');
    }
}

/*----------------------------------------------------------- INDICATOR  PANEL -----------------------------------------------------*/

function IndicatorMainPanel (id, classnames) {
    var content     = '';
    content +=         
    '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +  
        IndicatorDescriptionPanel ('indicatordescriptionpanel', 'sb_row') +      
        IndicatorNamePanel("", true, false) +          

     //   IndicatorDescriptionPanel ('indicatordescriptionpanel', 'sb_main') +            
        IndicatorParametersPanel ('indicatorparameterspanel') +            
        IndicatorLevelsPanel ('indicatorlevelspanel', 'sb_column sb_top') +       
        IndicatorSignalsPanel('indicatorsignalspanel', 'sb_column sb_main sb_top') +
    '</div>';
    return content;  
}

function IndicatorPanel (id, lefthidden, classnames) {
    var content     = '';
    content +=         
    '<div id="' + id + '" class="' + (classnames ? classnames : '')  + '">' +  
        (lefthidden ? '' :  sb.render(tree_indicatortype)) +  
        IndicatorMainPanel ('indicatormainpanel', 'sb_main sb_column') +
'   </div>';  
    return content;
}

function IndicatorPanel_Update (indicatortype) {
    IndicatorSignalsPanel_Update (indicatortype)
    IndicatorDescriptionPanel_Update (indicatortype);
    IndicatorParametersPanel_Update (indicatortype);  
    IndicatorLevelsPanel_Update (indicatortype);    
    IndicatorNamePanel_Update (indicatortype);
}

/*---------------------------------------------------- INDICATOR TYPE PANEL -----------------------------------------*/
  
function onclick_indicatortype(elt) {
    var indicatortypename = elt.children[1].innerHTML;
    var indicatortype = IndicatorsMenu.filter(function(x) { return x.text == indicatortypename})[0];

    sb.tree_selectitem ('tree_indicatortype', indicatortypename);        
    IndicatorPanel_Update (indicatortype);
    AddCrossObjects(indicatortype);      
}

function IndicatorTypePanel_Update (indicatortype) {
    var elt = document.getElementById('tree_indicatortype');    
    for (var i= 0; i < IndicatorsMenu.length; i++) {
        
     if (IndicatorsMenu[i].type == PREDEFINED_TYPE) continue;
        sb.tree_additem('tree_indicatortype', {
            id:   'selectindicatortype',
            type: 'link',
            item: IndicatorsMenu[i].text , 
            icon: icon_indicator,
            events: {onclick: 'onclick_indicatortype(this)'},
            arrow: false,        
        }); 
    }
    sb.tree_selectitem ('tree_indicatortype', indicatortype.text);         
}

//-------------------------------------------------POPUP PANELS ------------------------------------------------  


function onclick_closePopupIndicator (elt, event) {
    event.stopPropagation();
    $('#popupindicator').remove(); 
}

function openPopupIndicator(indicatortype, funcname) {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }  
    
    var functionname = (funcname ? funcname : "NewIndicator()");
    
    var indicatortype = indicatortype ? indicatortype : IndicatorsMenu[0];

    sb.modal({
        id : 'popupindicator',        
        header: 'INDICATORS',
        body: IndicatorPanel ('indicatorpanel', false, 'sb_row'),
              //PickerPanel(0, 1),
        footer: '<button class="sb_mbutton" id = "indicatorcancel"     data-bs-dismiss="modal" onclick="onclick_closePopupIndicator (this, event)">Cancel</button>' +
                '<button class="sb_mbutton" id = "indicatoradd"      onclick="' + functionname + ';">Add</button>',
        indicator: indicatortype,
        funcname: funcname,
        width: 1200,
        height: 700,
        onopen: function () { 
            IndicatorTypePanel_Update (indicatortype); 
            IndicatorPanel_Update (indicatortype);            
            AddCrossObjects(indicatortype);                  
        }
    });
}

function openPopupObject(objectname) {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }  

    var object = PG.GetObjectFromName(objectname);    
    if (!object)
        return;
        
    var indicatortype = GetIndicatorTypeFromObject(object);
    var type = indicatortype.type;
    var text = indicatortype.text;
    indicatortype.pg = PG;    
    
    sb.modal({
        id : 'popupindicator',         
        header: 'INDICATOR : ' + objectname,
        body: IndicatorPanel ('indicatorpanel', true, 'sb_row'),
        footer: '<button class="sb_mbutton" id = "indicatorcancel"  onclick="onclick_closePopupIndicator (this, event)" data-bs-dismiss="modal" >Close</button>' + 
                '<button class="sb_mbutton" id = "indicatorsave" onclick="SaveIndicator (\'' + object.Name + '\');" style="display:' +  (object.Type == "PREDEFINED" ? 'none' : 'block') + '">Save</button>',
        height: 700,
        width: 800,

        onopen: function () { 
            IndicatorPanel_Update (indicatortype); 
            Indicator_UpdateFields(object);
            AddCrossObjects(object);                
        }
    });
}

//------------------------------------------------- CONDITION ------------------------------------------------  

function NewCondition () {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return -1;
    }

    var name = document.getElementById('conditionname').value; 
    var condition = new pgcondition (PG, name, solution.PL.MainSection);
    condition.SCContent = markstring;    
    solution.CurrentProject.PG.Conditions.push (condition);
    PasteCondition (condition);
    
}

function DrawCondition (condition) {

    var name;
    
    var readonly = false;
    if (condition) {
        name = condition.Name;
    } else {
        var PG = solution.GetPGFromTerminal ();
        if (!PG) {
            return;
        }    
        name = PG.ConditionFindName();
    }
}


function openPopupCondition(conditionname, funcname) {
        
    var functionname = (funcname ? funcname :  "NewCondition()");
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }  

    var condition = PG.GetConditionFromName(conditionname);    

    sb.modal({
        id : 'popupcondition',               
        header: 'CONDITIONS',
        body: ConditionPanel(0),
        footer:  '<button class="sb_mbutton"   id = "conditionadd"      onclick="' + functionname + '">Save</button>' +
                 '<button class="sb_mbutton" id = "conditioncancel"   onclick="w2popup.close()">Close</button>',
        condition: condition,
        funcname: funcname,
        width: 1200,
        height: 700,
        showMax: true,
        onopen: function () {

        }
    });
}





function openPopupProperty (menuname, name, event) {
    
    var menu = (menuname == 'ScheduleMenu' ? ScheduleMenu : EngineFieldsItems);
    
    var i = getmenuindexfromfield(menu,name, 'name');
    
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),    
        event: event,             
        pageX: event.pageX,
        pageY: event.pageY,
        onshow : function () {
        },        
        html:  PropertyPanel(menu[i].text)
    });    
    
}


//////////////////////////////////////////////////////////////////////////////  DRAW TERMINAL ////////////////////////////////////////////////////////////////////////////
    
function OnCloseTerminal (callafter, terminal) {
    if (terminal) {
        CloseTerminalConfirm(terminal, callafter, terminal);
    }  
}

function CloseTerminalConfirm(terminal, callafter, param) {
        
    sb.confirm_modal('Exit Terminal ' + terminal.Name + ' ?').yes(function () {
        callafter(param);
        $("#confirmmodal").modal('hide');                   
    }).no(function () {

    })
}

//------------------------------------------------------------ STRATEGY DESCRIPTION PANEL ----------------------------------------------------------

function StrategyDescriptionPanel_Update (platform, strategy, html) {
    var pname = platform.pname;

    if (!strategy) return;
    
    let quilleditor;
  //  let quilleditor =  '#strategydescriptionpanel';
    var options = {
                    modules: {toolbar:  QuillToolBarOptions, clipboard: {matchVisual: false}}, 
                    theme: 'snow'
                };
    if (pname != 'project') {
        options.readOnly = true;
        options.modules = {toolbar: false};
        quilleditor = '#sessiondescriptionpanel'
    } else {
        quilleditor = projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW ? '#assistantquillpanel' : '#strategyquillpanel';
    }

    if ($(quilleditor).children ().length == 0) {
        platform.strategyquilleditor = new Quill(quilleditor,  options);

        platform.strategyquilleditor.on('text-change', function(delta, oldDelta, source) {
            CurrentStrategy.Description = platform.strategyquilleditor.root.innerHTML;
            if (platform.strategyquilleditor.options.first) {
                platform.strategyquilleditor.history.clear();
                platform.strategyquilleditor.options.first = false;
            }
          }
        ); 
        
        platform.strategyquilleditor.once('text-change', function() {
            platform.strategyquilleditor.history.clear();
          });        
    }      
    platform.strategyquilleditor.options.first = true;
    
    $(quilleditor + ' .ql-editor').html(html ? html : strategy.Description);
//    RefreshStrategyAssistantDescription(strategy);      
}   


//------------------------------------------------------------ STRATEGY PROPERTIES PANEL ----------------------------------------------------------

function OnStrategyOperationChange (id, value) {
    var flag = false;
    if (value == "BUYSELL") {
        flag = false;
        Strategy_SetProp (B_BUYMINPROFIT, flag);    // Buy Min Profit
        Strategy_SetProp (B_BUYTP, flag);           // Buy Take Profit
        Strategy_SetProp (B_BUYSL, flag);           // Buy Stop Loss
        Strategy_SetProp (B_BUYTS, flag);           // Buy Trailing Stop
        Strategy_SetProp (B_BUYLOTTP, flag);        // Order Buy Take Profit
        Strategy_SetProp (B_BUYLOTTS, flag);        // Order Buy Trailing Stop
        Strategy_SetProp (B_BUYLOTSL, flag);        // Order Buy Stop Loss
        Strategy_SetProp (B_SELLMINPROFIT, flag);   // Sell Min Profit
        Strategy_SetProp (B_SELLTP, flag);          // Sell Take Profit
        Strategy_SetProp (B_SELLSL, flag);          // Sell Stop Loss
        Strategy_SetProp (B_SELLTS, flag);          // Sell Trailing Stop
        Strategy_SetProp (B_SELLLOTTP, flag);       // Order Sell Take Profit
        Strategy_SetProp (B_SELLLOTTS, flag);       // Order Sell Trailing Stop
        Strategy_SetProp (B_SELLLOTSL, flag);       // Order Sell Stop Loss    
        Strategy_SetProp (B_EXITMODE, flag);        // Exit Mode
        Strategy_SetProp (B_ORDERTYPE, flag);       // Order Type
        Strategy_SetProp (B_KEEPBUYSELL, flag);     // KeepBuySell  
    }
    else 
    if (value == "BUY") {
        flag = false;
        Strategy_SetProp (B_BUYMINPROFIT, flag);    // Buy Min Profit
        Strategy_SetProp (B_BUYTP, flag);           // Buy Take Profit
        Strategy_SetProp (B_BUYSL, flag);           // Buy Stop Loss
        Strategy_SetProp (B_BUYTS, flag);           // Buy Trailing Stop
        Strategy_SetProp (B_BUYLOTTP, flag);        // Order Buy Take Profit
        Strategy_SetProp (B_BUYLOTTS, flag);        // Order Buy Trailing Stop
        Strategy_SetProp (B_BUYLOTSL, flag);        // Order Buy Stop Loss
        
        flag = true;
        Strategy_SetProp (B_SELLMINPROFIT, flag);   // Sell Min Profit
        Strategy_SetProp (B_SELLTP, flag);          // Sell Take Profit
        Strategy_SetProp (B_SELLTS, flag);          // Sell Stop Loss
        Strategy_SetProp (B_SELLSL, flag);          // Sell Trailing Stop
        Strategy_SetProp (B_SELLLOTTP, flag);       // Order Sell Take Profit
        Strategy_SetProp (B_SELLLOTTS, flag);       // Order Sell Trailing Stop
        Strategy_SetProp (B_SELLLOTSL, flag);       // Order Sell Stop Loss    
        Strategy_SetProp (B_EXITMODE, flag);        // Exit Mode
        Strategy_SetProp (B_ORDERTYPE, flag);       // Order Type
        Strategy_SetProp (B_KEEPBUYSELL, flag);     // KeepBuySell    
    }
    else 
    if (value == "SELL") {
        flag = true;
        Strategy_SetProp (B_BUYMINPROFIT, flag);    // Buy Min Profit
        Strategy_SetProp (B_BUYTP, flag);           // Buy Take Profit
        Strategy_SetProp (B_BUYSL, flag);           // Buy Stop Loss
        Strategy_SetProp (B_BUYTS, flag);           // Buy Trailing Stop
        Strategy_SetProp (B_BUYLOTTP, flag);        // Order Buy Take Profit
        Strategy_SetProp (B_BUYLOTTS, flag);        // Order Buy Trailing Stop
        Strategy_SetProp (B_BUYLOTSL, flag);        // Order Buy Stop Loss
        Strategy_SetProp (B_EXITMODE, flag);        // Exit Mode
        Strategy_SetProp (B_ORDERTYPE, flag);       // Order Type
        Strategy_SetProp (B_KEEPBUYSELL, flag);     // KeepBuySell  
        
        flag = false;
        Strategy_SetProp (B_SELLMINPROFIT, flag);   // Sell Min Profit
        Strategy_SetProp (B_SELLTP, flag);          // Sell Take Profit
        Strategy_SetProp (B_SELLSL, flag);          // Sell Stop Loss
        Strategy_SetProp (B_SELLTS, flag);          // Sell Trailing Stop
        Strategy_SetProp (B_SELLLOTTP, flag);       // Order Sell Take Profit
        Strategy_SetProp (B_SELLLOTTS, flag);       // Order Sell Trailing Stop
        Strategy_SetProp (B_SELLLOTSL, flag);       // Order Sell Stop Loss    
    }
}    

function OnStrategyMaxCountChange (id, value) {
    var flag = false;
    if (value == "1") {
        flag = true;
    }
}

function OnStrategyRecoveryModeChange (id, value) {
    value = value.substring(0,1);    
    var flag = false;
    if (value == "P" ||
        value == "A" ||
        value == "H" ||
        value == "S" ||
        value == "N" ||
        value == "O" ||
        value == "F" ||
        value == "C") {
        flag = true;
    }
    Strategy_SetProp (B_RECOVERYVALUE, flag); // RecoveryValue
    let platform = ui.currentplatform;


    if ($('#strategy_assistant_panel-p-1 #propertyid_24').length != 0) {
        let menuindex = getmenuindexfromfield(RecoveryModeMenu, value, 'type'); 

        $('#strategy_assistant_panel-p-1 #propertyid_24').attr ("title", RecoveryModeMenu[menuindex].tooltip);
        SelectAssistantRecovery (value);
    }
}


function OnStrategyOrderTypeChange (id, value) {
    var flag = false;
    if (value == "1") {
        flag = true;
    }
    Strategy_SetProp (B_KEEPBUYSELL, flag); // keepbuysell
}

function  OnStrategDirectionChange (id, value) {
    var flag = false;
    if (value == "ANY") {
        flag = true;
    }
    Strategy_SetProp (B_DIRECTIONTYPE, flag); // DirectionType
}


function Strategy_SetProp (id, flag) {
    var $jelt =  $('[propertyid="' + id + '"]');

    $jelt.prop("disabled", flag); 

    if (flag) {
        $jelt.addClass('input-disabled'); 
    }
    else {
        $jelt.removeClass('input-disabled'); 
    }
}

function onchange_strategyproperty (elt, event) {
    var value = event.target.value;
    var id = parseInt(elt.id);

    UpdateStrategyPropertyField (id, value);    
    Strategy_SetPropertyValue (id, value);
}    

function onchange_strategyschedule (elt, event) {
    var value = event.target.value;
    var id = parseInt(elt.id);

   // StrategyAssistantRefreshError (id);
    UpdateStrategyScheduleField (id, value);  
    Strategy_SetScheduleValue (id, value)    
}

function UpdateStrategyPropertyField (id, value) {

    $('[propertyid="' + id + '"]').val(value); 

    switch (id) {
        case B_OPERATION:     OnStrategyOperationChange (id, value);  break;
        case B_DIRECTION:     OnStrategDirectionChange (id, value);  break;
        case B_ORDERTYPE:     OnStrategyOrderTypeChange (id, value); break;
        case B_RECOVERYMODE:  OnStrategyRecoveryModeChange(id, value); break;
        case B_MAXCOUNT:      OnStrategyMaxCountChange (id, value); break;
        default:
        break;
    }        
}

function UpdateStrategyScheduleField (id, value) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    $('[scheduleid="' + id + '"]').val(value); 
}

function Strategy_SetPropertyValue (id, value) {
    if (!CurrentStrategy) return;
    
    var engine = CurrentEngine;
   
    switch (id) {
        case B_OPERATION:       engine.Operation        = value; break;
        case B_DIRECTION:       engine.Direction        = value; break;
        case B_DIRECTIONTYPE:   engine.DirectionType    = value; break;
        case B_ORDERTYPE:       engine.OrderType        = value; break;
        case B_RECOVERYMODE:    engine.RecoveryMode     = value.substring (0,1); break;
        case B_RECOVERYVALUE:   engine.RecoveryValue    = value; break;
        case B_ILOT:            engine.ILot             = value; break;
        case B_MAXLOT:          engine.MaxLot           = value; break;
        case B_MAXCOUNT:        engine.MaxCount         = value; break;
        case B_EXITMODE:        engine.ExitMode         = value; break;
        case B_KEEPBUYSELL:     engine.KeepBuySell      = value; break;
        case B_ONEORDERPERBAR:  engine.OneOrderPerBar   = value; break;
        case B_PIPSTEP:         engine.PipStep          = value; break;
        case B_TIMESTEP:        engine.TimeStep         = value; break;
        case B_MAXTIME:         engine.MaxTime          = value; break;
        case B_HEDGEMAGNITUDE:  engine.HedgeMagnitude   = value; break;
        case B_BUYLOTTP:        engine.BuyLotTP         = value; break;
        case B_BUYLOTTS:        engine.BuyLotTS         = value; break;
        case B_BUYLOTSL:        engine.BuyLotSL         = value; break;
        case B_SELLLOTTP:       engine.SellLotTP        = value; break;
        case B_SELLLOTTS:       engine.SellLotTS        = value; break;
        case B_SELLLOTSL:       engine.SellLotSL        = value; break;                    
        case B_TP:              engine.TP               = value; break;
        case B_TS:              engine.TS               = value; break;
        case B_SL:              engine.SL               = value; break;
        case B_BUYTP:           engine.BuyTP            = value; break;
        case B_BUYTS:           engine.BuyTS            = value; break;
        case B_BUYSL:           engine.BuySL            = value; break;
        case B_SELLTP:          engine.SellTP           = value; break;
        case B_SELLTS:          engine.SellTS           = value; break;
        case B_SELLSL:          engine.SellSL           = value; break;
        case B_BUYMINPROFIT:    engine.BuyMinProfit     = value; break;
        case B_SELLMINPROFIT:   engine.SellMinProfit    = value; break;
        case B_MINPROFIT:       engine.MinProfit        = value; break;
        default:    return;  
    }
       
    if (TestMode) {
        UpdateRule (0, id, value)
    }
    RefreshStrategyPropertiesHelper(engine);       
}


function Strategy_SetScheduleValue (id, value) {
    if (!CurrentStrategy) return;
        
    var schedule = CurrentEngine.Schedules[0];

    if (!schedule) return;

    switch (id) {
        case 11:    schedule.StartMonth         = value == '-----' ? -1 : getmenufromname(MonthsMenu, value).id; break;
        case 12:    schedule.FromOccurenceWeek  = value == '-----' ? -1 : getmenufromname(WeeksMenu, value).id; break;
        case 13:    schedule.StartDay           = value == '-----' ? -1 : getmenufromname(DaysMenu, value).id; break;
        case 21:    schedule.EndMonth           = value == '-----' ? -1 : getmenufromname(MonthsMenu, value).id; break;
        case 22:    schedule.ToOccurenceWeek    = value == '-----' ? -1 : getmenufromname(WeeksMenu, value).id; break;
        case 23:    schedule.EndDay             = value == '-----' ? -1 : getmenufromname(DaysMenu, value).id; break;

        case 14:    schedule.StartTime          = value == "" ? "-1" : value; break;
        case 24:    schedule.EndTime            = value == "" ? "-1" : value; break;
        case 2:     schedule.FrequencyDay       = value; break;
        case 3:     schedule.OnSameBar          = value == "true" ? "1" : "-1"; break;
        case 4:     schedule.TimeBetweenSession = value; break;
        case 5:     schedule.TimeZone           = value == "true" ? "1" : "-1"; break;
    }

    if (TestMode) {
        LoadSchedule (CurrentEngine);
    }     

    RefreshStrategyPropertiesHelper(CurrentEngine);                
}

function Strategy_GetPropertyValue (engine, id) {
    
    if (!engine)
        return;
   
    var value;
   
    switch (id) { 
     //   case B_NAME :        value =  engine.Name; break;
        case B_OPERATION :      value =  getmenufromname(OperationMenu, engine.Operation).text; break;
        case B_DIRECTION :      value =  getmenufromname(DirectionMenu, engine.Direction).text; break;
        case B_DIRECTIONTYPE :  value =  getmenufromname(DirectionTypeMenu, engine.DirectionType).text; break;
        case B_ORDERTYPE :      value =  getmenufromname(OrderTypeMenu, engine.OrderType).text; break;
        case B_RECOVERYMODE :   value =  getmenufromname(RecoveryModeMenu, engine.RecoveryMode, 'type').text;   break;
        case B_RECOVERYVALUE :  value =  engine.RecoveryValue; break;
        case B_ILOT :           value =  engine.ILot; break;
        case B_MAXLOT :         value =  engine.MaxLot; break;
        case B_MAXCOUNT :       value =  engine.MaxCount; break;
        case B_EXITMODE :       value =  getmenufromname(ExitModeMenu, engine.ExitMode).text; break;
        case B_KEEPBUYSELL:     value =  getmenufromname(KeepBuySellMenu, engine.KeepBuySell).text; break;
        case B_ONEORDERPERBAR:  value =  getmenufromname(OneOrderPerBarMenu, engine.OneOrderPerBar).text; break;
        case B_PIPSTEP:         value =  engine.PipStep; break;
        case B_TIMESTEP:        value =  engine.TimeStep; break;
        case B_MAXTIME:         value =  engine.MaxTime; break;
        case B_HEDGEMAGNITUDE:  value =  engine.HedgeMagnitude; break;
        case B_TP :             value =  engine.TP; break;
        case B_TS :             value =  engine.TS; break;
        case B_SL :             value =  engine.SL; break;
        case B_BUYTP :          value =  engine.BuyTP; break;
        case B_BUYTS :          value =  engine.BuyTS; break;
        case B_BUYSL :          value =  engine.BuySL; break;
        case B_SELLTP :         value =  engine.SellTP; break;
        case B_SELLTS :         value =  engine.SellTS; break;
        case B_SELLSL :         value =  engine.SellSL; break;
        case B_BUYLOTTP :       value =  engine.BuyLotTP; break;
        case B_BUYLOTTS :       value =  engine.BuyLotTS; break;
        case B_BUYLOTSL :       value =  engine.BuyLotSL; break;
        case B_SELLLOTTP :      value =  engine.SellLotTP; break;
        case B_SELLLOTTS :      value =  engine.SellLotTS; break;
        case B_SELLLOTSL :      value =  engine.SellLotSL; break;
        case B_BUYMINPROFIT :   value =  engine.BuyMinProfit; break;
        case B_SELLMINPROFIT :  value =  engine.SellMinProfit; break;
        case B_MINPROFIT :      value =  engine.MinProfit; break;
    }
    return value;
}

function Strategy_GetScheduleValue (schedule, id) {
    var value;

    switch (id) {    
        case 11:         value =  getmenufromid(MonthsMenu, schedule.StartMonth).text; break;
        case 21:         value =  getmenufromid(MonthsMenu, schedule.EndMonth).text; break;
        case 12:         value =  getmenufromid(WeeksMenu, schedule.FromOccurenceWeek).text; break;
        case 22:         value =  getmenufromid(WeeksMenu, schedule.ToOccurenceWeek).text; break;
        case 13:         value =  getmenufromid(DaysMenu, schedule.StartDay).text; break;
        case 23:         value =  getmenufromid(DaysMenu, schedule.EndDay).text; break;

        case 14:         value =  (schedule.StartTime == "-1"  ? ""  : schedule.StartTime); break;
        case 24:         value =  (schedule.EndTime == "-1"    ? ""  : schedule.EndTime); break;

        case 2:          value =  (schedule.FrequencyDay == "-1"       ? 0   : schedule.FrequencyDay); break;
        case 4:          value =  (schedule.TimeBetweenSession == "-1" ? 0   : schedule.TimeBetweenSession); break;
        case 3:          value =  (schedule.OnSameBar == "-1"          ? getmenufromname(TrueFalseMenu, "false").text : getmenufromname(TrueFalseMenu, "true").text); break;
        case 5:          value =  (schedule.TimeZone == "1"            ? getmenufromname(TrueFalseMenu, "true").text  : getmenufromname(TrueFalseMenu, "false").text); break;
    }

    return value;
}

function Init_strategyscheduletable (table, table1) {
    var rows= [];

    for (var i= 0; i < ScheduleMenu.length; i= i + 2) {
        rows.push ([ScheduleMenu[i].item1, sb.item({...ScheduleMenu[i],   ...{attributes: {scheduleid:  ScheduleMenu[i].id}}}), sb.item({...ScheduleMenu[i+1],  ...{attributes: {scheduleid:  ScheduleMenu[i+1].id}}})]);        
    }
    table.rows = rows;
    rows=[];
    for (var i= 0; i < SchedulePropertyMenu.length; i++) {
        rows.push ([SchedulePropertyMenu[i].item1, sb.item({...SchedulePropertyMenu[i],  ...{attributes: {scheduleid:  SchedulePropertyMenu[i].id}}})]);        
    }
    table1.rows = rows;
}

function Init_strategypropertiestable (table) {
    var rows= [];

    for (var i= 0; i < EngineFieldsItems.length; i++) {
        rows.push ([EngineFieldsItems[i].item1, sb.item({...EngineFieldsItems[i],  ...{attributes: {propertyid: EngineFieldsItems[i].id}}, events: {onchange: "onchange_strategyproperty (this, event)"}})]);        
    }
    table.rows = rows;
}

function StrategyPropertiesPanel (classnames) {
    Init_strategypropertiestable(strategypropertiestable);
    var content =
        sb.table (strategypropertiestable);
    return content;
}

function StrategySchedulePanel (classnames) {

    Init_strategyscheduletable(strategyscheduletable, strategyschedulepropertytable);

    var content =
        sb.table (strategyschedulepropertytable) +
        sb.table (strategyscheduletable);
    return content;
}

function StrategyPropertiesPanel_Update (platform, engine) {
    var from = 0;
    var to = EngineFieldsItems.length;
    
    for (var i = from; i < to; i++) {
        var field = EngineFieldsItems[i];    
        var id = field.id;
        var value = Strategy_GetPropertyValue (engine, id);    
        UpdateStrategyPropertyField(id, value)        
    }      
}

function StrategySchedulePanel_Update (platform, schedule) {

    var from = 0;
    var to = ScheduleMenu.length;
    for (var i = 0; i < ScheduleMenu.length; i++) {
        var field = ScheduleMenu[i];    
        var id = field.id;
        var value = Strategy_GetScheduleValue (schedule, id); 
        $('[scheduleid="' + id + '"]').val(value);           
    }
    for (var i = 0; i < SchedulePropertyMenu.length; i++) {
        var field   = SchedulePropertyMenu[i];    
        var id      = field.id;
        var value = Strategy_GetScheduleValue (schedule, id); 
        $('[scheduleid="' + id + '"]').val(value);           
    }    
}



function RefreshStrategyName(strategy) {
    if (!strategy) return;
    var doc = document.getElementById('strategyname');
    if (doc) doc.value = strategy.Name;
    $("#strategy_assistant_name").val (CurrentStrategy.Name);  
    $('#strategy_assistant_title span').html(CurrentStrategy.Name)  
}

function RefreshStrategy(strategy) {
    console.log ('REFRESH')
    StrategyPropertiesPanel_Update (projectplatform, CurrentEngine);
    StrategySchedulePanel_Update (projectplatform,  CurrentEngine.Schedules[0]);           
    StrategyDescriptionPanel_Update(projectplatform, strategy); 
    //console.log ('refreshing properties')
    RefreshStrategyName(strategy);

 //   RefreshStrategyDependency(CurrentEngine);
 //   RefreshStrategyActions(CurrentEngine);
    RefreshStrategyAssistantProperties(CurrentEngine);
    UpdateActionsRule();

    RefreshStrategyPropertiesHelper(CurrentEngine);
    SCEditor.setValue(CurrentEngine.SCContent, -1);

    CEditor.setValue(strategy.CContent);
    CurrentContainer.Refresh();
}

function RefreshStrategyAssistantProperties () {
   
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }    
 
    $('#strategy_assistant_addedindicators').html ('');    

    for (var i = 0; i < CurrentStrategy.UsedIndicators.length; i++) {
        var object = PG.GetObjectFromId(CurrentStrategy.UsedIndicators[i]); 
        var objecthtml = GetHTMLFromObject (object);
        $('#strategy_assistant_addedindicators').append (objecthtml);    
    }   
}

function UpdateActionsRule () {
    var engine = CurrentEngine;
    var actions = CurrentEngine.Actions;
    
    
    const links =$('.strategy_assistant_actions').children ();
    $.each(links, function (index, link) {
        var name = $(link).html ();
        if (!actions.includes(name)) {    
            $(link).addClass("noactivate")             
        } else {
            $(link).removeClass("noactivate")             
        }
    });    
}

function RefreshStrategyPropertiesHelper(engine) {
    if (!solution.CurrentProject)
        return;
    if (!engine) {
        TracePropertiesEditor("");
        return;
    }
    TracePropertiesEditor(engine.GetDescriptionProperties());
}

function RefreshStrategyActions(engine) {
    if (!engine) return;
    var OperationType = OperationName.indexOf(engine.Operation);
    for (var i = 0; i < NBR_OPERATIONS; i++) {
        switch (i) {
        case OP_BUYSELL:
        case OP_BUY:
        case OP_SELL:
        case OP_HEDGE_BUY:
        case OP_HEDGE_SELL:
        case OP_CLOSE_HEDGE_BUY:
        case OP_CLOSE_HEDGE_SELL:
        case OP_CLOSE_HEDGE:
        case OP_CLOSE_BUY:
        case OP_CLOSE_SELL:
        case OP_CLOSE:
        case OP_EXIT_BUY:
        case OP_EXIT_SELL:
        case OP_EXIT:
            w2ui['strategyactions'].set(i, {value: Menu_Conditions[0]});
            break;
        }
    }
    if (OperationType == OP_BUY || OperationType == OP_BUYSELL) {
        var Tab = CurrentStrategy.BLogicals;
        for (var i = 0; i < NBR_OPERATIONS; i++) {
            for (var j = 0; j < Tab[i].length; j++) {
                for (k = 0; k < Menu_Conditions.length; k++) {
                    if (Tab[i][j].Name == Menu_Conditions[k].text) break;
                }
                switch (i) {
                case OP_BUYSELL:
                case OP_BUY:
                case OP_SELL:
                case OP_HEDGE_BUY:
                case OP_HEDGE_SELL:
                case OP_CLOSE_HEDGE_BUY:
                case OP_CLOSE_HEDGE_SELL:
                case OP_CLOSE_HEDGE:
                case OP_CLOSE_BUY:
                case OP_CLOSE_SELL:
                case OP_CLOSE:
                case OP_EXIT_BUY:
                case OP_EXIT_SELL:
                case OP_EXIT:
                    w2ui['strategyactions'].set(i, {value: Menu_Conditions[k]});
                    break;
                }
            }
        }
    }
}

function RefreshStrategyDependency(engine) {
    if (!engine) return;
    var PG = solution.CurrentProject.PG;

    w2ui['strategygvariable'].clear();
    w2ui['strategyvariable'].clear();
    w2ui['strategyindicator'].clear();

    var section = solution.PL.MainSection;
    var TabToAdd = [];

    for (var i = 0; i < section.ListVariables.length; i++) {
        var pVariable = section.ListVariables[i];
        var pValue = pVariable.Value;
        w2ui['strategyvariable'].add({recid: i + 1, variable: pVariable.Name,  type: solution.PL.ReturnType(C_GENERATION, pVariable), value: solution.PL.ReturnValue(pValue)});
    }
    // indicators in engine
    var i = 0;

    var UsedIndicators = [];
    for (i = 0; i < section.ListIndicators.length; i++) {
        section.ListIndicators[i].Recid = i + 1;
        var elt =  {
            recid:  section.ListIndicators[i].Recid, 
            object: section.ListIndicators[i].Val.Name != null ? '<a class="link" title="" onclick="openPopupObject (\'' + section.ListIndicators[i].Val.Name + '\')" href="#" role="button" style="color:var(--theme-indicator-color)">' + section.ListIndicators[i].Val.Name + '</a>' : '', 
            signal: section.ListIndicators[i].Signal   != null ? section.ListIndicators[i].Signal.Val.Name.substring(2) : "", 
            op:     AlertOperationMenu[1],  
            not:    false,  
            prev:   false, 
            type:   AlertTypeMenu[0], 
            opvalue:AlertOpValueMenu[0],  
            value:  "", 
            userfield: section.ListIndicators[i].FatherAction.UserField
        };
                    
                    
        for (var j = 0; j < section.ListIndicators[i].ListPeriods.length; j++) {0
            var period = sPeriodName[eval(section.ListIndicators[i].ListPeriods[j].Val.Name)];
            eval('elt.' + period + '= true;');
        }
        if (j == 0) {
            eval('elt.' + 'cp' + '= true;');
        }        
        if (!UsedIndicators.includes(section.ListIndicators[i].Val.Name)) {
            UsedIndicators.push (section.ListIndicators[i].Val.Name);
        }
        TabToAdd.push(elt);
    }
    
    // indicators in condition of engine
    for (var j = 0; j < section.ListConditions.length; j++) {

        var condition = PG.GetConditionFromName(section.ListConditions[j].Val.Val);
        
        section = condition.Section;
        
        for (var k = 0; k < section.ListIndicators.length; k++) {
            section.ListIndicators[k].Recid = i + 1;
            var elt = {
                recid : section.ListIndicators[k].Recid,
                object: '<a class="link" title="" onclick="openPopupObject (' + section.ListIndicators[k].Val.Name + ')" href="#" role="button" style="color:var(--theme-indicator-color)">' + section.ListIndicators[k].Val.Name + '</a>',
                signal: section.ListIndicators[k].Signal.Val.Name,
                op:     AlertOperationMenu[1],
                not:    false,
                prev:   false,
                type:   AlertTypeMenu[0],
                opvalue:AlertOpValueMenu[0],
                value: ""
            };
            for (var z = 0; z < section.ListIndicators[k].ListPeriods.length; z++) {
                var period = sPeriodName[eval(section.ListIndicators[k].ListPeriods[z].Val.Name)];
                eval('elt.' + period + '= true;');
            }
            TabToAdd.push(elt);
            i++;
        }
    }
    w2ui['strategyindicator'].add(TabToAdd);
}

