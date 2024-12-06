
const Bar_Candle          = 'candle';
const Bar_HeikenAshi      = 'heikenashi';
const Bar_Ohlc            = 'ohlc';
const Bar_PointFigure     = 'point&figure';
const Bar_Renko           = 'renko';
const Bar_Kagi            = 'kagi';
const CANDLES_TOLOAD      = 200; 
const Indicator_Height    = 65;


//---------------------------------------------------- UPDATE CHART DATA  --------------------------------------------------------   

function Chart_UpdateData (terminal, Symbol, Period, close, date, open, high, low, volume) {
    
    if (terminal == solution.CurrentTerminal) {
        return Chart_UpdateMT4Data(terminal, Symbol, Period, close, date, open, high, low,  volume);        
    }
    else {
        return Chart_UpdateYahooData (terminal, Symbol, Period, close);        
    }
}

function Chart_UpdateYahooData(terminal, Symbol, period, price) { //Period, date, open, high, low, close, volume) { 
    var data = Symbol.chartData[period];
    if (data.length == 0)
        return;
    
    var mydate = new Date(Symbol.Quote.regularMarketTime*1000 ); 

    var last    = data[data.length - 1];
    
    var idate   = GetTimeFromPeriod(period, MILLISECONDS);

   
    var high,low,open;
    
    var volume= Symbol.Quote.regularMarketVolume;

    if (period == P_D1) {
        high  = Symbol.Quote.regularMarketDayHigh; 
        low   = Symbol.Quote.regularMarketDayLow;
        open  = Symbol.Quote.regularMarketOpen;
    } else {
        high  = price; 
        low   = price;
        open  = price;
        
    }
    
    if (last != null && (mydate.getTime() - last.date.getTime()) < idate) {
        last.high = Math.max(high, last.high);
        last.low = Math.min(low, last.low);
        last.close = price;
    
        if (P_M1 == period) {
            last.volume = volume;
        } else {
            last.volume += (volume < Symbol.LastVolume) ? volume : (volume - Symbol.LastVolume);
        }
    } else {
        data.push({date: mydate, open: open, high: high, low: low, close: price, volume: volume});
    }

    Symbol.LastVolume = volume;

}

function Chart_UpdateMT4Data(terminal, Symbol, Period, close, date, open, high, low,  volume) {
    var data        = Symbol.chartData[Period];
    
    var mydate      = new Date(ToTerminalTime(date));


    var last        = data[data.length - 1];
    var idate       = GetTimeFromPeriod(Period, MILLISECONDS);
   

    if (last != null && (mydate.getTime() - last.date.getTime()) < idate) {
        last.high = Math.max(high, +last.high);
        last.low = Math.min(low, +last.low);
        last.close = +close;
        if (P_M1 == Period) {
            last.volume = volume;
        } else {
            last.volume += (volume < Symbol.LastVolume) ? volume : (volume - Symbol.LastVolume);
        }
        last.change = (((last.close - last.open) / last.open) * 100).toFixed(2);        
    } else {
        data.push({date: mydate, open: open, high: high, low: low, close: close, volume: volume, change: (((close - open) / open) * 100).toFixed(2)});
    }
    Symbol.LastVolume = volume;    
}

//----------------------------------------------------------------------------------------------------

function chartpanel_fromcanvas (canvasid) {
    return $('#' + canvasid).closest('.chartpanel');    
}

function rootid_fromcanvas (canvasid) {
    return canvasid.replace("chart", "root");
}

var returnperiodformat = function (period) {
    
    if (period <= P_H4)
        return d3.timeFormat("%Y %m %d %H:%M");
    else
        return d3.timeFormat("%Y-%m-%d");
}

var onloadmore_chartcanvas = function (start, end) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas || !symbolcanvas.CurrentSymbol) return;    

    var symbol    = symbolcanvas.CurrentSymbol;
    var xScale    = symbol.moreProps.xScale;
    var xAccessor = symbol.moreProps.xAccessor;

    var width = xScale(xAccessor(symbol.plotData[symbol.plotData.length - 1])) - xScale(xAccessor(symbol.plotData[0]));

    var widthRatio =  1;

    var cw = width / (symbol.plotData.length - 1) * widthRatio;
    var candleWidth = Math.round(cw);    

    var min_nbrbars = Math.abs(start)/candleWidth;
    var nb_bars     = Math.max (min_nbrbars, CANDLES_TOLOAD);
    //console.log ('width' + start + ' nbrbars = ' + nb_bars);


    if (solution.get('ui').currentplatform_pname == TRADEDESK_PLATFORM_PNAME) {
        if (!symbol.WaitHistory[symbolcanvas.CurrentPeriod]) {
            OnGetHistory(solution.CurrentTerminal, symbol, symbolcanvas.CurrentPeriod, symbol.NbrCandles[symbolcanvas.CurrentPeriod], symbol.NbrCandles[symbolcanvas.CurrentPeriod] + nb_bars, true);
            symbol.WaitHistory[symbolcanvas.CurrentPeriod] = true;
        }
    }
}

var onmousemove_chartcanvas = function (event, itempos, yValue, mouseXY, fullData, state) {

    let symbolcanvas = solution.GetCanvasFromTerminal();
    
    if (!symbolcanvas || !symbolcanvas.SignalPanel || symbolcanvas.Indicators.length == 0 || !symbolcanvas.CurrentSymbol) {
        return;  
    }

    if (!itempos.idx) {
        return;
    }

    symbolcanvas.TrackObjects = [];

    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;  
    
    var currentitem         = itempos.idx.index;
    var beforecurrentitem   = itempos.idx.index - 1;
    
   

    if (currentitem >= fullData.length) {
        console.log (currentitem)
        return;
    }

    let currentbartime = fullData[currentitem].date.getTime() / 1000;

    var k = 0;
    var tracevalue = "";

    var objects    = symbolcanvas.Indicators.map(x => symbolcanvas.PG.GetObjectFromId(x));
    var objidarray = objects.map(x => x.Id);    

      
    expertcontext.ResetSignals(objidarray, null, [period], currentbartime, 1);
   
   
    for (var i = 0; i < objects.length; i++) {
    
        let object =objects[i];
        if (!object) continue;
   
        let signalscallbackname = expertcontext.GetSignalCallbackFromObject(object);
   
        if (signalscallbackname != null) {

            eval('expertcontext.' + signalscallbackname + '(period, object, fullData, currentitem, 1)');
        }
    }
    expertcontext.ResetSignals(objidarray, null, [period], currentbartime);
   
   
    for (var i = 0; i < objects.length; i++) {
        
        var object =objects[i];
        if (!object) continue;

        let signalscallbackname = expertcontext.GetSignalCallbackFromObject(object);
        if (signalscallbackname != null) {
  
            eval('expertcontext.' + signalscallbackname + '(period, object, fullData, currentitem)');
        }
    }    


    for (var i = 0; i < objects.length; i++) {
        
        var object =objects[i];
        if (!object) continue;
  
// CROSS OBJECTS        
        if (object.Cross != "") {
           
            var cobject = symbolcanvas.PG.GetObjectFromName (object.Cross); 

            if (cobject) {
                if (expertcontext.SValue(object.Id, S_PREVIOUS, period) < expertcontext.SValue(cobject.Id, S_PREVIOUS, period) && expertcontext.SValue(object.Id, S_CURRENT, period) > expertcontext.SValue(cobject.Id, S_CURRENT, period)) {
                    expertcontext.SETSIGNAL(0, object.Id, S_RCROSSED, period, P_SIGNAL, 1);
                } else 
                if (expertcontext.SValue(object.Id, S_PREVIOUS,period) > expertcontext.SValue(cobject.Id, S_PREVIOUS, period) && expertcontext.SValue(object.Id, S_CURRENT, period) < expertcontext.SValue(cobject.Id, S_CURRENT, period)) {
                    expertcontext.SETSIGNAL(0, object.Id, S_RCROSSED, period, P_SIGNAL, 0);
                }
            }
        }
    }
// END CROSS OBJECTS         
        expertcontext.SetPreviousSignals(objidarray, null);           
        
//DRAW
    for (var i = 0; i < objects.length; i++) {      
        var object =objects[i];
        if (!object) continue;

        tracevalue += "------------------- " + "\n";
        tracevalue +=  object.Name + "\n";
        tracevalue += "------------------- " + "\n";        


        var indicatorname =  GetIndicatorNameFromObject (object);

        for (var index = 0; index < solution.ObjectSignals.length; index++) {
            if (solution.ObjectSignals[index].objectname == indicatorname) {
                var signals = solution.ObjectSignals[index].signals;

                for (var j = 0; j < signals.length; j++) {
                    var signaltype = SignalName.indexOf(signals[j].text);
                    
                    if (signals[j].type == SNumeric) {
                        var value = expertcontext.SValue(object.Id, signaltype, period);
                        if (value != undefined) value = value.toFixed(symbol.Digits);
                            
                        tracevalue += signals[j].text + " " + value  + "\n";
                        symbolcanvas.TrackObjects.push({object: object, signalname: signals[j].text, value: value, signaltype : signals[j].type});
                    } else {
                        if (expertcontext.AndS(object.Id, signaltype, period)) {
                        
                            tracevalue += signals[j].text + "\n";
                            symbolcanvas.TrackObjects.push({object: object, signalname: signals[j].text, value: null,  signaltype : signals[j].type});
                        }
                    }
                    
                }
                break;
            }
        }
    }
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

 
    let signaleditor = GetEditorFromId('signaleditor_' + platform.pname);
    signaleditor.setValue(tracevalue, -1);
}

var alldeleted;

function RemoveChartSelection(symbolcanvas, selection) {
    switch (selection) {
    case "-1":
        symbolcanvas.VLines = [];
        symbolcanvas.HLines = [];
        symbolcanvas.Marks = [];
        symbolcanvas.Trends = [];
        symbolcanvas.Retracements = [];
        break;
    case "horizontalline":
        symbolcanvas.HLines = [];
        break;
    case "verticalline":
        symbolcanvas.VLines = [];
        break;
    case "trendline":
        symbolcanvas.Trends = [];
        break;
    case "fiblines":
        symbolcanvas.Retracements = [];
        break;
    }
    alldeleted = true;
    // to make selection effevtive

    DrawChart();


    alldeleted = false;
}

function oncontextmenu_chartcanvas(event, itempos, yValue, mouseXY, fullData, state) {
    
    event.preventDefault();
    event.stopPropagation();
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    var symbol       = symbolcanvas.CurrentSymbol;
    
 
    if (symbolcanvas.Selection != 'cursor') {
        DrawChart();
    } else {
        var menu = [];
        menu.push({id: MENU_CHART_REMOVEINDICATORS_ID,  text: 'Remove Indicators',    icon: icon_indicator}); 
        menu.push({id: MENU_CHART_REMOVEDRAWING_ID,     text: 'Remove Drawing Tools', icon: 'fa fa-star'}); 
        
        if (solution.get('ui').currentplatform_pname == TRADEDESK_PLATFORM_PNAME) {
            menu.push({id: 0,  text: ''});            

            if (yValue) {
                if (yValue > symbol.Ask) {
                    menu.push({id: MENU_CHART_BUYSTOP_ID,   text: 'Buy Stop',      icon: 'buyicon  fas fa-arrow-alt-circle-right',     style:'color:' + theme_buy,   disabled: false});
                    menu.push({id: MENU_CHART_SELLLIMIT_ID, text: 'Sell Limit',    icon: 'sellicon fas fa-arrow-alt-circle-right',     style:'color:' + theme_sell,  disabled: false});
                } else {
                    menu.push({id: MENU_CHART_BUYLIMIT_ID,  text: 'Buy Limit',     icon: 'buyicon  fas fa-arrow-alt-circle-right',     style:'color:' + theme_buy,   disabled: false});
                    menu.push({id: MENU_CHART_SELLSTOP_ID,  text: 'Sell Stop',     icon: 'sellicon fas fa-arrow-alt-circle-right',     style:'color:' + theme_sell,  disabled: false});
                }
            }
        } else
        if (solution.get('ui').currentplatform_pname == PROJECT_PLATFORM_PNAME) {        
            menu.push({id: 0,  text: ''});            
        } else
        if (solution.get('ui').currentplatform_pname == OPTION_PLATFORM_PNAME) {        
            menu.push({id: 0,  text: ''});            
            menu.push({id: MENU_CHART_INSERTCALL_ID,  text: 'Insert Closest Call',  icon: '',     style:'color:' + theme_sell,  disabled: false});
            menu.push({id: MENU_CHART_INSERTPUT_ID,   text: 'Insert Closest Put',   icon: '',     style:'color:' + theme_sell,  disabled: false});
        }


        sb.overlay({
            rootelt: $('#' + rootid_fromcanvas(symbolcanvas.ID)),            
            event: event,                 
            pageX: event.pageX,
            pageY: event.pageY,
            onselect : function (elt, par) {
                var text = $(elt).find('.sb_label').html();
                switch (parseInt(elt.id)) {
                    case MENU_CHART_REMOVEDRAWING_ID:
                        symbol.SelectedContracts.length = 0;
                        DrawChart();
//                        RemoveChartSelection(symbolcanvas, "-1");
                        break;
                    case MENU_CHART_REMOVEINDICATORS_ID:
                        RemoveChartIndicator(symbolcanvas, "-1");
                        break;
                    case MENU_CHART_BUYSTOP_ID:
                        symbol.BuyEntry = +(yValue).toFixed(symbol.Digits);
                        symbol.TradeOrder = OP_BUYSTOP;
                        SetOrderType(event, "BUYSTOP");
                        OrderPanel_Show(true);
                        break;                        
                    case MENU_CHART_BUYLIMIT_ID:                        
                        symbol.BuyEntry = +(yValue).toFixed(symbol.Digits);
                        symbol.TradeOrder = OP_BUYLIMIT;
                        SetOrderType(event, "BUYLIMIT");
                        OrderPanel_Show(true);
                        break;
                    case MENU_CHART_SELLSTOP_ID:                            
                        symbol.SellEntry = +(yValue).toFixed(symbol.Digits);
                        symbol.TradeOrder = OP_SELLSTOP;
                        SetOrderType(event, "SELLSTOP");
                        OrderPanel_Show(true);
                        break;
                    case MENU_CHART_SELLLIMIT_ID:                           
                        symbol.SellEntry = +(yValue).toFixed(symbol.Digits);
                        symbol.TradeOrder = OP_SELLLIMIT;
                        SetOrderType(event, "SELLLIMIT");
                        OrderPanel_Show(true);
                        break;
                    case MENU_CHART_INSERTCALL_ID:          
                        closestoption (symbol, 'C', yValue, mouseXY, fullData, state)
                        DrawChart();
                        break;
                    case MENU_CHART_INSERTPUT_ID:                           
                        closestoption (symbol, 'P', yValue, mouseXY, fullData, state)
                        DrawChart();
                    break;                                                
                    }                

            },        
            html: sb.menu(menu)
        });    	        
    }
}

function onclick_chartcanvas(event, itempos, yValue, mouseXY, fullData, state) {
    event.stopPropagation();

    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return -1;
    }
    var symbolcanvas = PG.Canvas;
    
    if (!symbolcanvas) return;  



    switch (symbolcanvas.Selection) {
        case "horizontalline":
            AddChartSelection(symbolcanvas, "horizontalline", itempos, yValue);
            DrawChart();
            break;
        case "verticalline":
            AddChartSelection(symbolcanvas, "verticalline", itempos, yValue);
            DrawChart();
            break;
        default:
            break;
    }
}

function ondrop_chartcanvas(canvas, event) {
    event.preventDefault();

    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    var symbol       = symbolcanvas.CurrentSymbol;

    var data = event.dataTransfer.getData("text");
    
    if (data.startsWith('selectcondition')) {
        event.stopPropagation();        
        let conditionname   = data.replace ('selectcondition_', '');
        let condition       = symbolcanvas.PG.GetConditionFromName (conditionname);

        let scstsring       = condition.SCContent;

        let marker = Marker_Run (CreateMarker (conditionname, scstsring, 'Boolean'));	        
    
        return;  
    } else   
    if (data.startsWith('selectmarker')) {
        event.stopPropagation();        
        let trid = data.replace ('selectmarker_', '');
        let rows = trid.split('_');

        let row = rows[2]
        let tableid = rows[0] + '_' + rows[1];
        let scstsring = GetSCStringFromTableRow (tableid, row);
        
        let marker = Marker_Run (CreateMarker ('marker_' + symbolcanvas.MarkerNbr, scstsring, 'Boolean'));	        
  
        let mcolor = MarkerColors[marker.Id]

        $('#' + trid).css("background-color", mcolor);
        $('#' + trid).css("color", "white");        

        return;  
    } else     
    if (data.startsWith('selectindicator')) {
        event.stopPropagation();        
        let objectname = data.replace ('selectindicator_', '');
        let object = symbolcanvas.PG.GetObjectFromName (objectname);
        symbolcanvas.AddIndicator(object.Id);
        DrawChart();      
        return;  
    } else 
    if (data.startsWith('selectcontract')) {
        event.stopPropagation();        
        let splitarray = data.split ('_');
        let right      = splitarray[1];
        let rownumber  = splitarray[2];
        var expiry = sb.table_getcellcontent(optioncontractstable, rownumber, 'Expiry');
        var strike = sb.table_getcellcontent(optioncontractstable, rownumber, 'Strike');

        switch (right) {
            case 'C':
                symbol.AddContract('C' + strike + expiry);
            break;
            case 'P':
                symbol.AddContract('P' + strike + expiry);
            break;
            case 'CP':
                symbol.AddContract('C' + strike + expiry);
                symbol.AddContract('P' + strike + expiry);
            break;
            default:
                return;
            break;
        }
        DrawChart();      
        return;  
    } else {
        return;
    }
}

function ondblclick_chartcanvas(event, itempos, yValue, mouseXY, fullData, state) {
    event.preventDefault();
    event.stopPropagation();
    
    let terminal = solution.GetCurrentTerminal();

    let symbolcanvas = solution.GetCanvasFromTerminal();
    let symbol       = symbolcanvas.CurrentSymbol;
    
    if (solution.get('ui').currentplatform_pname == OPTION_PLATFORM_PNAME) {
    //    ondblclick_chartcanvasOption(event, itempos, yValue, mouseXY, fullData, state);
    }    
   // tracker_load();

    
    if (symbolcanvas.Indicators.length == 0) {
        DisplayOperation('Add an indicator to track signals')        
        return;
    }

    if (!symbolcanvas.SignalPanel) {
        ChartSignalsPanel_Update(terminal, true);
        onmousemove_chartcanvas(event, itempos, yValue, mouseXY, fullData, state)         
        return;
    }

    tracker_update (terminal)                
}

function  ondblclick_chartcanvasOption(event, itempos, yValue, mouseXY, fullData, state) {      
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
  
    var symbol = symbolcanvas.CurrentSymbol;      

    var lastdate  = fullData[fullData.length - 1].date;
    var lastprice = fullData[fullData.length - 1].close;
    
    var chartConfig = state.chartConfig[0];
    var xScale = state.xScale;
    
    var x = mouseXY[0];
    var y = mouseXY[1] - chartConfig.origin[1];
    
    var bardate = (lastdate > xScale.invert(x) ? lastdate : xScale.invert(x));
    var price   = yValue;       // chartConfig.yScale.invert(y); // (lastdate > xScale.invert(x) ? lastprice : chartConfig.yScale.invert(y));
    
    closestoption (symbol, '', yValue, mouseXY, fullData, state);
    DrawChart ();                    
}    	



 function onclick_selectindicator (elt, event) {

    var objectname = $(elt).find('label').html();

    var symbolcanvas = solution.GetCanvasFromTerminal();
    let object = symbolcanvas.PG.GetObjectFromName (objectname);

    symbolcanvas.AddIndicator(object.Id);
    $(elt).closest('.sb.overlay').remove();       
    DrawChart();        
}

function onclick_indicatorCreate (elt) {

    openPopupIndicator();
}

function onchange_barstyle(elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;

    var chartpanelid = chartpanel_fromcanvas(symbolcanvas.ID)[0].id;    


    var item= $('#' + chartpanelid + ' #' + elt.id + ' option:selected').val();    

    if (item == 'Candles') {
        symbolcanvas.SetBarType(Bar_Candle);

    } else
    if (item == 'Heiken Ashi') {
        symbolcanvas.SetBarType(Bar_HeikenAshi);
    } else
    if (item == 'Bars') {
        symbolcanvas.SetBarType(Bar_Ohlc);
    } else
    if (item == 'point&figure') {
        symbolcanvas.SetBarType(Bar_PointFigure);
    } else
    if (item == 'renko') {
        symbolcanvas.SetBarType(Bar_Renko);
    } else
    if (item == 'kagi') {
        symbolcanvas.SetBarType(Bar_Kagi);
    }
    DrawChart();    
}

function onclick_grid (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;     
    symbolcanvas.Grid = !symbolcanvas.Grid;
    DrawChart();
} 

function onclick_seperator(elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return; 
    symbolcanvas.Seperator = !symbolcanvas.Seperator;
    DrawChart();
}

function onclick_levels(elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return; 
    symbolcanvas.Levels = ! symbolcanvas.Levels;
    DrawChart();
} 

function onclick_pivot(elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return; 
    symbolcanvas.Pivot = ! symbolcanvas.Pivot;
    symbolcanvas.SetPivot(symbolcanvas.Pivot);
    DrawChart();
} 

function onclick_signalpanel (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return; 

    let terminal = solution.GetCurrentTerminal ()
    ChartSignalsPanel_Update (terminal, !symbolcanvas.SignalPanel, false);        
}

function onclick_markerpanel (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return; 

    let terminal = solution.GetCurrentTerminal ()
    MarkerPanel_Update (terminal, !symbolcanvas.MarkerPanel, false);        
}



function onclick_shiftend (elt, event) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return; 

    symbolcanvas.Shift = true;
    DrawChart();    
}

function contractclose(event, contractname, elt) {
    event.stopPropagation();
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    
    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;  

    if (symbol.RemoveContract(contractname)) {
        DrawChart();
    }
}

function indicatorclose(event, objectname, elt) {
    event.stopPropagation();
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    
    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;  
    let object = symbolcanvas.PG.GetObjectFromName (objectname);

    if (symbolcanvas.RemoveIndicator(object.Id)) {
        DrawChart();
    }
}

function engineclose(event, enginename, elt) {
    event.stopPropagation();
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;  

    if (symbolcanvas.RemoveEngine(enginename)) {
        DrawChart();
    }
}

function markerclose(event, markername, elt) {
    event.stopPropagation();
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;  

    if (symbolcanvas.RemoveMarker(markername)) {
        DrawChart();
    }
}

//------------------------------------------------- TRACKER TABLE  ------------------------------------------------ 


function GetSCString (object, signal, type, opvalue, value, op, not, prev, m1, m5, m15, m30, h1, h4, d1, w1, mn, cp) {

    var s = "";
    
    var signaltype = SignalName.indexOf (signal);
    
    if (SignalType[signaltype] != SNumeric) {
        if (prev) {
            if (op == "AND") {
                if (type == "ANY BAR") s += "AndPS";
                else
                if (type == "FIRST BAR") s += "AndPBS";
                else
                if (type == "FIRST TICK") s += "AndPTS";
            }
            else 
            if (op == "OR") {
                if (type == "ANY BAR") s += "OrPS";
                else
                if (type == "FIRST BAR") s += "OrPBS";
                else
                if (type == "FIRST TICK") s += "OrPTS";
                }
        }            
        else {
            if (op == "AND") {
                if (type == "ANY BAR") s += "AndS";
                else
                if (type == "FIRST BAR") s += "AndBS";
                else
                if (type == "FIRST TICK") s += "AndTS";
            }
            else 
            if (op == "OR") {
                if (type == "ANY BAR") s += "OrS";
                else
                if (type == "FIRST BAR") s += "OrBS";
                else
                if (type == "FIRST TICK") s += "OrTS";
            }
        }
    }
    else {      //Logic
        s += opvalue + " (";    
        if (prev) {
            
            if (op == "AND") {
                if (type == "ANY BAR") s += "AndPV";
                else
                if (type == "FIRST BAR") s += "AndPBV";
                else
                if (type == "FIRST TICK") s += "AndPTV";
            }
            else 
            if (op == "OR") {
                if (type == "ANY BAR") s += "OrPV";
                else
                if (type == "FIRST BAR") s += "OrPBV";
                else
                if (type == "FIRST TICK") s += "OrPTV";
                }
        }            
        else {
            if (op == "AND") {
                if (type == "ANY BAR") s += "AndV";
                else
                if (type == "FIRST BAR") s += "AndBV";
                else
                if (type == "FIRST TICK") s += "AndTV";
            }
            else 
            if (op == "OR") {
                if (type == "ANY BAR") s += "OrV";
                else
                if (type == "FIRST BAR") s += "OrBV";
                else
                if (type == "FIRST TICK") s += "OrTV";
            }
        }
    }
    
    
    s +=  " " + object + " S_" + signal; 
    if (cp)  s += " CurrentPeriod";
    if (m1)  s += " P_M1"; 
    if (m5)  s += " P_M5"; 
    if (m15) s += " P_M15"; 
    if (m30) s += " P_M30"; 
    if (h1)  s += " P_H1"; 
    if (h4)  s += " P_H4"; 
    if (d1)  s += " P_D1"; 
    if (w1)  s += " P_W1"; 
    if (mn)  s += " P_MN"; 
    
    if (SignalType[signaltype] == SNumeric)
        s +=")" + " " + value;
    
    
    if (not) {
        return  '(NOT ' +  '(' + s + ')' + ')'
    }    
    else {
        return '(' + s + ')';
    }        
}

function GetSCStringFromTrackSelection () {
    var string = '';

    var selection = w2ui.strategytracksignal.getSelection();
    
    if (selection.length == 0) return null;

    for (var i = 0; i < selection.length; i++) {
        string += GetSCStringFromTable (projecttrackertable, selection[i]);
    }
    
    if (selection.length > 1) {
        string = '(' + w2ui.strategytracksignal.operator.toUpperCase() + ' ' + string + ')';
    }
    return string;    
}

function GetSCStringFromTable (table, rowindex) {

    var not = false;
        
     var object =sb.table_getcellcontent (table, rowindex,  'Indicator'); 
     var signal =sb.table_getcellcontent (table, rowindex,  'Signal'); 
     var opvalue=sb.table_getcellcontent (table, rowindex,  'Vop'); 
     var value  =sb.table_getcellcontent (table, rowindex,  'Value');   
     var prev   =sb.table_getcellcontent (table, rowindex,  'Prev' ); 
     var type   =sb.table_getcellcontent (table, rowindex,  'Type'); 
     var op     =sb.table_getcellcontent (table, rowindex,  'Logic'); 
     var m1     =sb.table_getcellcontent (table, rowindex,  'M1'); 
     var m5     =sb.table_getcellcontent (table, rowindex,  'M5'); 
     var m15    =sb.table_getcellcontent (table, rowindex,  'M15'); 
     var m30    =sb.table_getcellcontent (table, rowindex,  'M30'); 
     var h1     =sb.table_getcellcontent (table, rowindex,  'H1'); 
     var h4     =sb.table_getcellcontent (table, rowindex,  'H4'); 
     var d1     =sb.table_getcellcontent (table, rowindex,  'D1'); 
     var w1     =sb.table_getcellcontent (table, rowindex,  'W1'); 
     var mn     =sb.table_getcellcontent (table, rowindex,  'MN'); 
     var cp     =sb.table_getcellcontent (table, rowindex,  'EP'); 
 
 
     return GetSCString (object, signal, type, opvalue, value, op, not, prev, m1, m5, m15, m30, h1, h4, d1, w1, mn, cp);
                  
 }
     
 function GetSCStringFromTableRow (tableid, row) {
 
     var not    = false; 
     
     var object = $('#' + tableid  + '_' + row + '_' + 'Indicator').html();
     var signal = $('#' + tableid  + '_' + row + '_' + 'Signal').val();  
     var opvalue= $('#' + tableid  + '_' + row + '_' + 'Vop').val(); 
     var value  = $('#' + tableid  + '_' + row + '_' + 'Value').val(); 
 
 
     var prev   = $('#' + tableid + '_' + row + '_' + 'Prev').is(":checked"); 
     var type   = $('#' + tableid + '_' + row + '_' + 'Type').val(); 
     var op     = $('#' + tableid + '_' + row + '_' + 'Logic').val(); 
     var m1     = $('#' + tableid + '_' + row + '_' + 'M1').is(":checked"); 
     var m5     = $('#' + tableid + '_' + row + '_' + 'M5').is(":checked"); 
     var m15    = $('#' + tableid + '_' + row + '_' + 'M15').is(":checked"); 
     var m30    = $('#' + tableid + '_' + row + '_' + 'M30').is(":checked"); 
     var h1     = $('#' + tableid + '_' + row + '_' + 'H1').is(":checked"); 
     var h4     = $('#' + tableid + '_' + row + '_' + 'H4').is(":checked"); 
     var d1     = $('#' + tableid + '_' + row + '_' + 'D1').is(":checked"); 
     var w1     = $('#' + tableid + '_' + row + '_' + 'W1').is(":checked"); 
     var mn     = $('#' + tableid + '_' + row + '_' + 'MN').is(":checked"); 
     var cp     = $('#' + tableid + '_' + row + '_' + 'EP').is(":checked"); 
 
 
     return GetSCString (object, signal, type, opvalue, value, op, not, prev, m1, m5, m15, m30, h1, h4, d1, w1, mn, cp);
   
 }
 
 //------------------------------------------------------------ MAIN CHART ----------------------------------------------------------

 var onmouseleave_chartmain = function (elt, event) {
    return;
    let symbolcanvas = solution.GetCanvasFromTerminal();   
    if (!symbolcanvas.SignalPanel) {
        return;
    }    
    let signaleditor = $(elt).closest ('.chartcontainer').find('.signaleditor')
    
    if (!signaleditor.is(':hidden')) {
     //   signalspanel.fadeToggle("slow", "swing");
     signaleditor.hide();
    }   
    DrawChart();
    //signalspanel.css ('visibility', 'hidden')

}

var onmouseenter_chartmain = function (elt, event) {
    return;
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas.SignalPanel) {
        return;
    }    

    let signaleditor = $(elt).closest ('.chartcontainer').find('.signaleditor')
    
    if (signaleditor.is(':hidden')) {
      //  signalspanel.fadeToggle("slow", "swing");
      signaleditor.show();
    }   
    DrawChart();
    //signalspanel.css ('visibility', 'visible')
}

var onmouseover_chartmain = function (elt, event) {
}
 

function onmousedown_TrackerDrag (elt, row) {
    let tablerow = elt.parentElement
    let trid = tablerow.id
    
    let rows = trid.split ('_');

    let tableid = rows[0] + '_' + rows[1];

//    $('#' + tableid + '_' + row).attr('draggable', 'true');    

}
      
function ondragstart_TrackerRow(elt, event) {

    let trid = event.currentTarget.id;
 
    event.dataTransfer.setData("text/plain", 'selectmarker_' + trid);
}

function SignalsMenuPanel (id, signals, signalname) {
    
    var content = 
   '    <select id="' + id + '" class="form-control signalname" onchange="OnChangeSignal(this)">';
    for (var i = 0; i < signals.length; i++) {
        var tooltip   = signals[i].description;
        content += '<option' + (signalname ==  signals[i].text ? ' selected' : '' ) + ' title= "' + tooltip +  '">' + signals[i].text +  '</option>';       
    }
    content += '</select>';
    return content;
}

//------------------------------------------------- PERIOD GROUP  ------------------------------------------------ 

function onclick_period (elt) {

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;       
    
    if (symbolcanvas.CurrentPeriod != elt.id) {    
        var terminal = solution.GetCurrentTerminal();
    
        if (terminal == solution.CurrentProject) {
            ProjectSelectPeriod(solution.CurrentProject, symbolcanvas.CurrentSymbol, elt.id);
            ShowChart ();          
        }
        else
        if (terminal == solution.CurrentOptionTerminal) {
            OptionSelectPeriod(solution.CurrentOptionTerminal, symbolcanvas.CurrentSymbol, elt.id);
        } else {
            Symbol_Select(solution.CurrentTerminal,  symbolcanvas.CurrentSymbol,elt.id);      
//            SelectPeriod(solution.CurrentTerminal, symbolcanvas.CurrentSymbol, elt.id);
        }
    }    
}   

//////////////////////////////////////////////////////////////////////////////  CHARTS ////////////////////////////////////////////////////////////////////////////

function DrawChart (pname) {
    var platform = null;

    let ui       = solution.get('ui') 

    if (pname == undefined) {
        platform = ui.currentplatform;
    } else {
        platform = ui.platform_get ('pname', pname);   
    }

    if (!platform) {
        return;
    }
    let terminal =  solution.GetCurrentTerminal(platform.pname)

    if (terminal == null) {
        return;
    }
    return Chart_Draw(terminal);    
}

function Chart_Draw (terminal) {
    if (terminal == null) {
        return;
    }
    let symbolcanvas = terminal.PG.Canvas;
    if (!symbolcanvas) {
        return;      
    }

    let canvas = document.getElementById(symbolcanvas.ID);
    if (!canvas) return;
    
    let period = symbolcanvas.CurrentPeriod;
    let symbol = symbolcanvas.CurrentSymbol;

    if (!symbol || period == null) {
        return;
    }   

    let data    = symbol.chartData[period];
    
    let xmargin = 50;

    if (terminal == solution.CurrentProject) {
        if (TestMode) {
            data = CurrentEngine.Data[period];
   
            xmargin = 100;
        } else {
            data = symbol.chartData[period];
        }
    }    
    if (data.length == 0) {
        return;
    }
    var length = data.length - 1;
    


    if (!symbol.xextents[period]) {
        var startdate, enddate;

        if (symbol.plotData && symbol.plotData.length != 0) {
            
            var dateindex   = FindIdxDataFromTime (symbol.plotData[symbol.plotData.length - 1].date, data);

            if (dateindex < 0) {
                startdate   = data[0].date;  
                enddate     = data[length].date;
            } else {
                startdate   = data[Math.max(0, dateindex -  symbol.plotData.length)].date;  
                enddate     = symbol.plotData[symbol.plotData.length - 1].date;
            }
        }
        else {
            startdate   = data[length - Math.min(length, CANDLES_TOLOAD)].date;  
            enddate     = data[length].date;
        }    
        Chart_XExtents(terminal, symbol, period, startdate, enddate); 
    }

    if (symbolcanvas.Shift && (length - (symbol.plotData.length - 1) >= 0)) {
        startdate   = data[length - (symbol.plotData.length - 1)].date;
        enddate     =  data[length].date;
        Chart_XExtents(terminal, symbol, period, startdate, enddate); 
        symbolcanvas.Shift = false;
    }

    let margin      = {left: 60, right: 60, top: 20, bottom: 25};   
    
    if (terminal == solution.CurrentProject) {
        margin.left = 0;
    }    

    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('pname', terminal.pname);     

    var ReactElt = React.createElement(platform.chart, {
        terminal:       terminal,          
        symbolcanvas:   symbolcanvas,
        data:           data,
        type:           "hybrid",
        width:          canvas.clientWidth,
        height:         canvas.clientHeight,
        margin:         margin,
        xmargin:        xmargin,
        ymargin:        5,
    });

    ReactDOM.render(ReactElt, canvas);
}

function Chart_XExtents(terminal, symbol, period, fromdate, todate) {
    symbol.xextents[period] = [fromdate, todate];
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('pname', terminal.pname);        


    platform.chart = fitWidth(platform.chart);  
}

function ondblclick_chartMargin () {
    var terminal = solution.GetCurrentTerminal();
    
    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) {
        return;      
    }
  
    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;  

    if (!symbol.plotData || symbol.plotData.length == 0) {
        return;
    }    
    Chart_XExtents(terminal, symbol, period, symbol.plotData[0].date, symbol.plotData[symbol.plotData.length - 1].date)
    Chart_Draw(terminal);
}

var extentfunction = function (d) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    if (symbolcanvas.CurrentSymbol == null)
        return;


    var margin = 0;
    var height;
//RESOLVE
/*
    if (solution.get('ui').currentplatform_pname == PROJECT_PLATFORM_NAME) {
        if(!document.getElementById(symbolcanvas.ID)) 
            return;        
        height = document.getElementById(symbolcanvas.ID).style.Height;
        margin = symbolcanvas.CurrentSymbol.SysPoint * 10; // 10 pips

    }
*/    
    margin = 0;
    return [d.high + margin, d.low - margin];
}

//------------------------------------------------------------ CHART BAR PANEL ----------------------------------------------------------

var FindIdxDataFromTime = function (time, data) {
    let Idx = -1;
    let length = data.length;
    if (length <= 1) return Idx;
    let itime = data[1].date.getTime() - data[0].date.getTime();
    
    if (data[0].date.getTime() > time || data[length - 1].date.getTime() + itime < time) return Idx;
    
    for (var i = 0; i < data.length; i++) {
        if (data[i].date.getTime() + itime >= time) return i;
    }
    return Idx;
}

var FindIdxDataFromTime = function (time, data) {
    var Idx = -1;
    var length = data.length;
    if (length <= 1) return Idx;
    var itime = data[length - 1].date.getTime() - data[length - 2].date.getTime();
    
    if (data[0].date.getTime() > time || data[length - 1].date.getTime() + itime < time) return Idx;
    
    for (var i = 0; i < data.length; i++) {
        if (data[i].date.getTime() + itime >= time) return i;
    }
    return Idx;
}

var _ReStock = ReStock;
var ChartCanvas = _ReStock.ChartCanvas;
var MyChart = _ReStock.ReactChart;
var series = _ReStock.series;
var scale = _ReStock.scale;
var coordinates = _ReStock.coordinates;
var tooltip = _ReStock.tooltip;
var axes = _ReStock.axes;
var indicator = _ReStock.indicator;
var helper = _ReStock.helper;
var interactive = _ReStock.interactive;
var annotation = _ReStock.annotation;


var CandlestickSeries = series.CandlestickSeries;
var KagiSeries = series.KagiSeries;
var RenkoSeries = series.RenkoSeries;
var PointAndFigureSeries = series.PointAndFigureSeries;
var OHLCSeries = series.OHLCSeries;

//var InteractiveYCoordinate = series.InteractiveYCoordinate;
var StraightLine = series.StraightLine;
var BarSeries = series.BarSeries;
var LineSeries = series.LineSeries;
var ScatterSeries = series.ScatterSeries;
var TriangleMarker = series.TriangleMarker;
var CircleMarker = series.CircleMarker;
var SquareMarker = series.SquareMarker;

var AreaSeries = series.AreaSeries;
var RSISeries = series.RSISeries;
var StochasticSeries = series.StochasticSeries;
var MACDSeries = series.MACDSeries;
var SARSeries = series.SARSeries;
var BollingerSeries = series.BollingerSeries;

var defaultScaleProvider = scale.defaultScaleProvider;
var discontinuousTimeScaleProvider = scale.discontinuousTimeScaleProvider;
var CrossHairCursor = coordinates.CrossHairCursor;
var MouseCoordinateX = coordinates.MouseCoordinateX;
var MouseCoordinateY = coordinates.MouseCoordinateY;
var CurrentCoordinate = coordinates.CurrentCoordinate;
var EdgeIndicator = coordinates.EdgeIndicator;
var OHLCTooltip = tooltip.OHLCTooltip;
var HoverTooltip = tooltip.HoverTooltip;

var MovingAverageTooltip = tooltip.MovingAverageTooltip;
var SingleValueTooltip = tooltip.SingleValueTooltip;
var RSITooltip = tooltip.RSITooltip;
var StochasticTooltip = tooltip.StochasticTooltip;
var MACDTooltip = tooltip.MACDTooltip;
var BollingerBandTooltip = tooltip.BollingerBandTooltip;

var Annotate = annotation.Annotate;
var LabelAnnotation = annotation.LabelAnnotation;
var Label = annotation.Label;

var XAxis = axes.XAxis;
var YAxis = axes.YAxis;
var macd = indicator.macd; 
var sar = indicator.sar; 
var rsi = indicator.rsi;
var atr = indicator.atr;
var ema = indicator.ema;
var sma = indicator.sma;
var kagi = indicator.kagi;
var renko = indicator.renko;
var heikinAshi = indicator.heikinAshi;
var pointAndFigure = indicator.pointAndFigure;

var kagiCalculator = kagi();
var renkoCalculator = renko();
var haCalculator = heikinAshi();
var pAndFCalculator = pointAndFigure();

var axiscolor = '#64707d';

var fitDimensions = helper.fitDimensions;
var fitWidth = helper.fitWidth;
var TypeChooser = helper.TypeChooser;
var ClickCallback = interactive.ClickCallback;
var TrendLine = interactive.TrendLine;
var FibonacciRetracement = interactive.FibonacciRetracement;



var annotationProps = {
    yPos : 100,    
	fontFamily: 'sans-serif',
	fontSize: 12,
	fill: 'tomato',
	opacity: 0.8,
	text: d => "Option : " + d3.timeFormat("%Y-%m-%d")(d.date),
	y: ({ yScale }) => yScale.range()[0],
	onClick: console.log.bind(console),
	tooltip: d => "Option : " + d3.timeFormat("%Y-%m-%d")(d.date),
	// onMouseOver: console.log.bind(console),
};

//-----------------------------------------------------------------------------------------------------------------------------------
var _createClass = function () { 
    function defineProperties(target, props) { 
        for (var i = 0; i < props.length; i++) { 
            var descriptor = props[i]; 
            descriptor.enumerable = descriptor.enumerable || false; 
            descriptor.configurable = true; 
            if ("value" in descriptor) 
                descriptor.writable = true; 
            Object.defineProperty(target, descriptor.key, descriptor); 
        } 
    } 
    return function (Constructor, protoProps, staticProps) { 
                if (protoProps) 
                    defineProperties(Constructor.prototype, protoProps); 
                if (staticProps) 
                    defineProperties(Constructor, staticProps); 
                return Constructor; 
            }; 
    }();

function _classCallCheck(instance, Constructor) { 
    if (!(instance instanceof Constructor)) {
         throw new TypeError("Cannot call a class as a function"); 
    }
}

function _possibleConstructorReturn(self, call) { 
    if (!self) { 
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    } 
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) { 
    if (typeof superClass !== "function" && superClass !== null) { 
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); 
    } 
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); 
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; 
}

//-----------------------------------------------------------------------------------------------------------------------------------

var option_chart    = ReactConstructor (React.Component); 
var tradedesk_chart = ReactConstructor (React.Component); 
var project_chart   = ReactConstructor (React.Component); 
var home_chart      = ReactConstructor (React.Component); 

option_chart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

option_chart.defaultProps = {
    panEvent: true,    
	type: "svg"
};

tradedesk_chart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

tradedesk_chart.defaultProps = {
    panEvent: true,    
	type: "svg"
};

home_chart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

home_chart.defaultProps = {
    panEvent: true,    
	type: "svg"
};

project_chart.propTypes = {
	data: React.PropTypes.array.isRequired,
	width: React.PropTypes.number.isRequired,
	ratio: React.PropTypes.number.isRequired,
	type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

project_chart.defaultProps = {
    panEvent: true,    
	type: "svg"
};
        
function ReactConstructor (_React$Component) {
	_inherits(ReactChart, _React$Component);

	function ReactChart() {
		_classCallCheck(this, ReactChart);

		return _possibleConstructorReturn(this, (ReactChart.__proto__ || Object.getPrototypeOf(ReactChart)).apply(this, arguments));
	}

	_createClass(ReactChart, [{
		key: "render",
		value: function render() {
			var _props        = this.props;

            let terminal      = _props.terminal;
            let symbolcanvas  = _props.symbolcanvas;
			let data          = _props.data;
			let type          = _props.type;
			let width         = _props.width;
			let height        = _props.height;      
			let margin        = _props.margin; 
            let xmargin       = _props.xmargin;
			let ymargin       = _props.ymargin; 

			let drawmode      = (symbolcanvas.Selection != 'cursor');
            let symbol        = symbolcanvas.CurrentSymbol;
			let period        = symbolcanvas.CurrentPeriod;

			let contracts     = symbolcanvas.CurrentSymbol.SelectedContracts                
			let objects       = symbolcanvas.Indicators
  		    let engines       = symbolcanvas.Engines
            let markers       = symbolcanvas.Markers
            let xextents      = symbolcanvas.CurrentSymbol.xextents[period]
			let discontinuous = symbolcanvas.Discontinuous        		            
            let showleftaxis  = symbolcanvas.ShowLeftAxis;
            let marks         = symbolcanvas.Marks;

            let ratio         = _props.ratio;
            let yextents      = _props.yextents;

            let news        = false;
			let hidden      = false;
        
         
            let origin1     = 12;
            let height1     = 0;

           
            let gridHeight = height - margin.top - margin.bottom;
            let gridWidth  = width  - margin.left - margin.right;           

            
            
            let yGrid = symbolcanvas.Grid ? { 
                innerTickSize: -1 * gridWidth,
                tickStrokeDasharray: 'Solid',
                tickStrokeOpacity: 0.70,
                tickStrokeWidth:0.3
            } : {};
            
            let xGrid = symbolcanvas.Grid ? { 
                innerTickSize: -1 * gridHeight,
                tickStrokeDasharray: 'Solid',
                tickStrokeOpacity: 0.70,
                tickStrokeWidth: 0.3
            } : {};	    

            let parameters      = [];
            let mainparameters  = [];
            let calculators     = []; //, kagiCalculator, renkoCalculator, haCalculator, (pAndFCalculator, discontinuousTimeScaleProvider)
            let mainindicators  = [];      

            
            let Fractal_group_processed = false;
            let Bar_group_processed     = false;
            let Pivot_group_processed   = false;
            
     

            for (var i = 0; i < engines.length; i++) {
                height1 = height1 + 50;

                let engine = symbolcanvas.PG.GetEngineFromName(engines[i])
                let properties = {
                    symbol:     symbol,
                    period:     period,
                    object:     engine,
                    height:     height1,
                    showaxes:   parameters.length == 0 ? true : false,
                    canvas:     symbolcanvas,
                    xgrid:      xGrid,
                    ygrid:      yGrid,

                }
                parameters.push (engines_react (properties));
                calculators.push (PROFIT_calculate);
            }            
            
            for (var i = 0; i < markers.length; i++) {
                let marker = symbolcanvas.PG.GetMarkerFromName(markers[i])
                if (!marker || marker.Type != 'Numeric' || marker.Symbol != symbol || +marker.CurrentPeriod != +period) {
                    continue;
                }    
                height1 = height1 + Indicator_Height; 
                let properties = {
                    symbol:     symbol,
                    period:     period,
                    object:     marker,
                    height:     height1,
                    showaxes:   parameters.length == 0 ? true : false,
                    canvas:     symbolcanvas,
                    xgrid:      xGrid,
                    ygrid:      yGrid,         
                    showleftaxis: showleftaxis,                      
                }
                parameters.push (markers_react (properties));
            }                      
            for (var i = 0; i < objects.length; i++) {
                var object = symbolcanvas.PG.GetObjectFromId (objects[i]);  
                if (!object) continue;
                
   
                if (object.Display == SEPERATE_DISPLAY) {
        	        if (object.Indicator.react) {
                        height1 = height1 + Indicator_Height; 

                        let properties = {
                            symbol:     symbol,
                            period:     period,
                            object:     object,
                            height:     height1,
                            showaxes:   parameters.length == 0 ? true : false,
                            canvas:     symbolcanvas,
                            xgrid:      xGrid,
                            ygrid:      yGrid,                  
                            showleftaxis: showleftaxis,                                                  
                        }

    	                parameters.push (object.Indicator.react (properties));
        	            if (object.Indicator.calculator){
                            calculators.push (object.Indicator.calculator);
                        }
        	        }
                }
                else {
        	        if (object.Indicator.react) {
        	            if (object.Name == 'NEWS') news = true;  
                        showxaxes = false;

                        let properties = {
                            symbol:     symbol,
                            period:     period,
                            object:     object,
                            height:     origin1,
                            showaxes:   false,
                            canvas:     symbolcanvas,
                            xgrid:      xGrid,
                            ygrid:      yGrid,       
                            showleftaxis: showleftaxis,                                                              
                        }

                        mainparameters.push (object.Indicator.react (properties));
        	            object.Indicator.origin = origin1;
        	            origin1 = origin1 + 13; 
                    }
                    let indicator_group = Indicator_isgroup(object.Name);
                     	          
                    if (object.Indicator.calculator) {
                        if (indicator_group) {
                            switch (indicator_group) {
                                case Fractal_group:
                                    if (!Fractal_group_processed) {
                                        calculators.push (object.Indicator.calculator);
                                        Fractal_group_processed = true;
                                    }
                                break;
                                case Bar_group:
                                    if (!Bar_group_processed) {
                                        calculators.push (object.Indicator.calculator);
                                        Bar_group_processed = true;
                                    }
                                break;
                                case Pivot_group:
                                    if (!Pivot_group_processed) {
                                        calculators.push (object.Indicator.calculator);
                                        Pivot_group_processed = true;
                                    }
                                break;
                            }  
                        } else {
                            calculators.push (object.Indicator.calculator);
                        }
                    }
                    mainindicators.push (object.Indicator);
                }
            }
            
            if (symbolcanvas.BarType == Bar_Kagi) {
                var calculator = eval ('_ReStock.indicator.kagi()');  
	            calculators.push (calculator);
            }
            else
            if (symbolcanvas.BarType == Bar_PointFigure){
                var calculator = eval ('_ReStock.indicator.pointAndFigure()');  
	            calculators.push (calculator);
            }
            else
            if (symbolcanvas.BarType == Bar_Renko) {
                var calculator = eval ('_ReStock.indicator.renko()');  
	            calculators.push (calculator);
            }
             
            let properties = {  
                ratio:          ratio, 
                width:          width, 
                height:         height,  
                margin:         margin, 
                type:           type, 
                seriesName:     '', 
                data:           data, 
                calculator:     calculators, 
                panEvent:       true,//[ema26, ema12, smaVolume50, RSI_Candles, atr]
                padding:        {left : 0, right : xmargin},
                drawMode:       drawmode, 
                xAccessor:      function xAccessor(d) {return d.date}, 
                xScaleProvider: discontinuous ? discontinuousTimeScaleProvider : null,    
                xScale:         discontinuous ? null : d3.scaleTime(),               
                xExtents:       xextents,
                onLoadMore:     onloadmore_chartcanvas,  
                onMouseMove:    onmousemove_chartcanvas, 
                onContextMenu:  oncontextmenu_chartcanvas, 
                onDoubleClick:  ondblclick_chartcanvas, 
                onMouseDown:    onclick_chartcanvas 
            };
                        

            
            if (terminal == solution.CurrentOptionTerminal) {
                parameters.unshift (ChartCanvas, properties, react_optionmain (
                objects,                    
                xGrid, 
                yGrid,
                width, 
                height - (height1 + margin.top + margin.bottom), 
                margin, 
                xmargin, 
                ymargin, 
                symbol, 
                mainparameters, 
                mainindicators, 
                parameters.length == 0 ? true : false, 
                symbolcanvas, 
                origin1, 
                news, 
                discontinuous)); 

            } else {
                parameters.unshift (ChartCanvas, properties, react_chartmain (
                objects, 
                xGrid, 
                yGrid, 
                width, 
                height - (height1 + margin.top + margin.bottom), 
                margin, 
                xmargin, 
                ymargin, 
                symbol, 
                mainparameters, 
                mainindicators,  
                parameters.length == 0 ? true : false, 
                symbolcanvas, 
                origin1, 
                news, 
                discontinuous,
                showleftaxis)); 
            }
            return React.createElement.apply (null, parameters);
   		}
	}]);

	return ReactChart;
}
   
var react_optionmain  = function (objects, xGrid, yGrid, width, height, margin, xmargin, ymargin, Symbol, mainparameters, mainindicators, showxaxes, symbolcanvas, origin, news, discontinuous) {
    var parameters = mainparameters;

    var yExtents = [];
    var xorigin = 4;
   
    var period = symbolcanvas.CurrentPeriod;
    var symbol = symbolcanvas.CurrentSymbol;
	var snapx = (discontinuous ? true : false);

    yExtents.push (extentfunction);

    if (symbolcanvas.Variation) {

    	parameters.push (React.createElement(HoverTooltip, {snapX: snapx,  tooltipContent:  tooltipVariation(symbol.chartData[period], []),  
    	    stroke: "red", 
    	    bgFill : "transparent",
    
    	    fill: 'black',
    	    stroke: 'white', //"transparent",
    	    fontFill: "white",
    
    	    bgOpacity: 0.9,
    	    opacity: 0.8,
    	    fontFamily:theme_font_family, 
    	    fontSize: 12	    
    	}));  
    }  

	properties = {xMargin: xmargin, yMargin: ymargin, id: 10, height: height, yExtents: yExtents};

// X   
    //BOTTOM

    if (showxaxes) {
    	parameters.push (React.createElement(XAxis,            {axisAt: "bottom", orient: "bottom", showTicks: true, outerTickSize: 0, ...xGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
    	parameters.push (React.createElement(MouseCoordinateX, {at: "bottom", snapX: snapx, orient: "bottom", displayFormat: returnperiodformat (period), fontSize: 10, fontFamily:"sans-serif"}));	
    }	
    else {
    	parameters.push (React.createElement(XAxis,            {axisAt: "bottom", orient: "bottom", showTicks: false, showDomain : true, outerTickSize: 0, ...xGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
    //	parameters.push (React.createElement(MouseCoordinateX, {at: "bottom", orient: "bottom", displayFormat: returnperiodformat (period), fontSize: 10, fontFamily:"sans-serif"}));	

    }

    // TOP
	
	parameters.push (React.createElement(XAxis,            {axisAt: "top", orient: "top", showTicks: false, outerTickSize: 0, ...xGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
//	parameters.push (React.createElement(MouseCoordinateX, {at: "top", orient: "top", displayFormat: returnperiodformat(period), fontSize: 10, fontFamily:"sans-serif"}));	
	
	
// Y 
    // RIGHT	

	parameters.push (React.createElement(YAxis, {axisAt: "right", orient: "right", ticks: 10 , tickFormat: d3.format(",." + Symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor, onDoubleClick : ondblclick_chartMargin}));
	parameters.push (React.createElement(MouseCoordinateY, {at: "right", orient: "right", displayFormat: d3.format(",." + Symbol.Digits +"f") , fontSize: 10, fontFamily:"sans-serif"}));
    
	// LEFT
    
	parameters.push (React.createElement(YAxis,            {axisAt: "left", orient: "left", showTicks: true, tickFormat: d3.format(",." + Symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
	parameters.push (React.createElement(MouseCoordinateY, {at: "left", orient: "left", displayFormat: d3.format(",." + Symbol.Digits +"f") , fontSize: 10, fontFamily:"sans-serif"}));


    if (symbolcanvas.BarType == Bar_Ohlc)
    	parameters.push (React.createElement(OHLCSeries, { stroke: function stroke(d) {return d.close > d.open ? theme_bull : theme_bear;},  period: discontinuous ? null : period}));
    else
    if (symbolcanvas.BarType == Bar_PointFigure){
    	parameters.push (React.createElement(PointAndFigureSeries, { }));
        eval ('_ReStock.indicator.pointAndFigure()');
    }
    else
    if (symbolcanvas.BarType == Bar_Renko) {
    	parameters.push (React.createElement(RenkoSeries, { }));
        eval ('_ReStock.indicator.renko()');
    }
    else
    if (symbolcanvas.BarType == Bar_Kagi) {
    	parameters.push (React.createElement(KagiSeries, {}));

    }
    else {
        
    	parameters.push (
            React.createElement(CandlestickSeries,
                    { 
                    candleStrokeWidth:  1,  
                    type:               symbolcanvas.BarType, 
                    opacity:            1,
                    period:             discontinuous ? null : period,

                    wickStroke:         function wickstroke(d) {return d.close > d.open ? theme_chart_bullwickstroke : theme_chart_bearwickstroke;}, 
                    stroke:             function stroke(d) {return d.close > d.open ? theme_chart_bullstroke : theme_chart_bearstroke;}, 
                    fill:               function fill(d) {return d.close > d.open ? theme_chart_bullbody : theme_chart_bearbody;},   

                    heikin_wickStroke:  function heikin_wickstroke(d) {return d.heikin_close > d.heikin_open ? theme_chart_bullbody : theme_chart_bearbody;}, 
                    heikin_stroke:      function heikin_stroke(d) {return d.heikin_close > d.heikin_open ?  theme_chart_bullbody : theme_chart_bearbody;},
                    heikin_fill:        function heikin_fill(d) {return d.heikin_close > d.heikin_open ?  theme_chart_bullbody : theme_chart_bearbody;}, 
                }
            )
            );            
    }
	
    // SLTP
	
    if ((Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) && Symbol.RightType == TRADE_STOCK) {
        if (+Symbol.BuyTP != 0) {
    	    parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left", fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d) {return +Symbol.BuyEntry + (+Symbol.BuyTP * Symbol.SysPoint);},	lineStroke:  theme_buy, fill: function fill(d) {return theme_buy;} }));            
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.BuyEntry + (+Symbol.BuyTP * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_buy,      label: ""}));   
        }
        if (+Symbol.BuySL != 0) {
    	    parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",  fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d) {return +Symbol.BuyEntry - (+Symbol.BuySL * Symbol.SysPoint) ;},	lineStroke:  'transparent', fill: function fill(d) {return theme_sell;} }));
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.BuyEntry - (+Symbol.BuySL * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_sell,     label: ""}));   
        }
    	
    	parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",  fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d) {return +Symbol.BuyEntry;},	                                                            lineStroke:  "green", fill: function fill(d) {return theme_buy;} }));
        parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.BuyEntry, strokeWidth : 1,      stroke: theme_buy,      label: ""}));   
    }
    else 
    if ((Symbol.TradeOrder == OP_SELL || Symbol.TradeOrder == OP_SELLSTOP || Symbol.TradeOrder == OP_SELLLIMIT) && Symbol.RightType == TRADE_STOCK) {
    
        if (+Symbol.SellSL != 0) {    
        	parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",    fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d) {return +Symbol.SellEntry + (+Symbol.SellSL * Symbol.SysPoint);},	lineStroke:  theme_sell, fill: function fill(d) {return theme_sell;} }));
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.SellEntry + (+Symbol.SellSL * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_sell,      label: ""}));  
        }
        if (+Symbol.SellTP != 0) {    
        	parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",    fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d) {return +Symbol.SellEntry - (+Symbol.SellTP * Symbol.SysPoint) ;},	lineStroke:  'transparent', fill: function fill(d) {return theme_buy;} }));
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: +Symbol.SellEntry - (+Symbol.SellTP * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_buy,     label: ""}));    
        }    
	    parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",    fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d)                                                         {return +Symbol.SellEntry;},	lineStroke:  "green", fill: function fill(d) {return theme_sell;} }));
        parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: +Symbol.SellEntry, strokeWidth : 1,      stroke: theme_sell,      label: ""}));   
    }

	parameters.push (React.createElement(OHLCTooltip,       {origin: [0 , -3],  ohlcFormat: d3.format(",." + Symbol.Digits +"f"),  volumeFormat: d3.format("d"), symbolName : Symbol.Name,
        onClick : function onClick(e) {
            OptionSetRightType ({value : "Stock"});    
            return OptionOrderPanel_Show(true);}
        }));


// TODAY DATE 

    parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: new Date() ,   	strokeWidth: 0.5, strokeDasharray:"ShortDash",  stroke : axiscolor}));  


//EXPIRIES    
    for (var i = 0; i <  Symbol.Expiries.length; i++) {
        if (Symbol.Expiries[i].checked == false) continue;        
        var expiry = Symbol.Expiries[i].item;
        parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: d3.timeParse("%Y%m%d:%H%M")(expiry + ':2100') , 
                            strokeWidth: 1, strokeDasharray: "ShortDash",  stroke : Symbol.Expiries[i].style.split(":")[1], strikes : null /*Symbol.Expiries[i].strikes*/}));  
    }


//STRIKES

    for (var i = Symbol.SelectedContracts.length - 1; i >= 0 ; i--) {
        var recid = Symbol.SelectedContracts[i];
        var right  = recid.Right;
        var expiry = recid.Expiry;
        var strike = recid.Strike;
        
        var contract = symbolcanvas.PG.GetContractFromStrikeExpiry (symbol, right, strike, expiry);  

        if (contract == null) continue;
        if (contract.Indicator.react) {
            var length = parameters.length;
            parameters.push (contract.Indicator.react (symbol, period, contract, origin, (length == 0 ? true : false), symbolcanvas.Marks, symbolcanvas));
            contract.Indicator.origin = origin;
            origin = origin + 13; 
        }
          
        if (contract.Indicator.calculator) {
            calculators.push (contract.Indicator.calculator);
        }
        mainindicators.push (contract.Indicator);
    }

// ORDERS
    for (var i = symbolcanvas.PG.Orders.length - 1; i >= 0 ; i--) {
        var order = symbolcanvas.PG.Orders[i];
        if (order.MSymbol != Symbol.Name) continue;
        
        var recid = order.Number;
        var right = recid.charAt(0);
        var expiry = recid.substring (recid.length - 8);
        var strike = +recid.substring (1, recid.length - 8);

        for (var j = Symbol.SelectedContracts.length - 1; j >= 0 ; j--) {
            if (Symbol.SelectedContracts[j].Recid == recid) continue;
            
        }        
        var exist = false;
        for (var j = Symbol.SelectedContracts.length - 1; j >= 0 ; j--) {
            if (Symbol.SelectedContracts[j].Recid == recid) exist = true;
            
        }        
        if (exist) continue;        
        
        var contract = symbolcanvas.PG.GetContractFromStrikeExpiry (symbol, right, strike, expiry);  

        if (contract == null) continue;
        if (contract.Indicator.react) {
            var length = parameters.length;
            parameters.push (contract.Indicator.react (symbol, period, contract, origin, (length == 0 ? true : false), symbolcanvas.Marks, symbolcanvas));
            contract.Indicator.origin = origin;
            origin = origin + 13; 
        }
          
        if (contract.Indicator.calculator) {
            calculators.push (contract.Indicator.calculator);
        }
        mainindicators.push (contract.Indicator);
    }



//NEWS	
	if (news) {
        if (!solution.calendarnews) {
            return;
        }

    	var actualtime = (new Date ()).getTime ();  
    	for (i = 0; i < solution.calendarnews.newsarray.length ; i++) {
            var newsline = solution.calendarnews.newsarray[i];
    
    	    if (newsline.Importance != 'High')  continue;
    	    if (newsline.gettime  - solution.DifferenceHoursTime< actualtime ) continue;
    
    	    var date = new Date (newsline.gettime)  - solution.DifferenceHoursTime;    
            parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: date ,   strokeDasharray:"ShortDash",  stroke :"tomato"}));                          
    	    
    	}    
	}

//LEVELS    
/*
    if (symbolcanvas.Levels) {
        for (var i = period; i < sPeriodName.length; i++) {
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: Symbol.UpLevel[i] ,   strokeWidth : 1, stroke: "turquoise",   labelpos : i, label: sPeriodName[i]}));    
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: Symbol.DownLevel[i] , strokeWidth : 1, stroke: "pink",        labelpos: i, label: sPeriodName[i]}));    
        }
    }

    if (!alldeleted) {
        parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.Trends, init : {trends: []}, subtype : "trendline", enabled: (symbolcanvas.Selection == 'trendline'),  type: "RAY" , snap: false, strokeWidth : 1, onStart: onTrendLineStart, onComplete : onTrendLineComplete, stroke: "yellow"}));    
    
        parameters.push (React.createElement(FibonacciRetracement , {ref : "fib", retracements: symbolcanvas.Retracements, init : {retracements: []}, enabled: (symbolcanvas.Selection == 'fiblines'),  type: "BOUND" , onStart: onFibStart, onComplete : onFibComplete, strokeWidth : 1, stroke: "yellow"}));    

        if (symbolcanvas.HLines.length != 0) 
            parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.HLines, init : {trends: symbolcanvas.HLines}, subtype : "horizontal", enabled: false, type: "LINE", strokeWidth : 1, stroke: "Magenta", onStart: onTrendLineStart, onComplete : onTrendLineComplete}));    
    
        if (symbolcanvas.VLines.length != 0) 
            parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.VLines, init : {trends: symbolcanvas.VLines}, subtype : "vertical", enabled: false, type: "LINE", strokeWidth : 1, stroke: "Magenta", onStart: onTrendLineStart, onComplete : onTrendLineComplete}));    
    }

    for (var i = 0; i < symbolcanvas.Marks.length; i++) {
        parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: symbolcanvas.Marks[i] , stroke: "yellow", strokeDasharray:"ShortDash"}));    

    }
*/
// axes end
	parameters.push (React.createElement(EdgeIndicator,     {itemType: "last", orient: "right", edgeAt: "right",  padding: {left : 0, right : xmargin},   fontSize: 10, fontFamily:"sans-serif", displayFormat: d3.format(",." + Symbol.Digits +"f"), yAccessor: function yAccessor(d) {return d.close;},	lineStroke:  axiscolor, fill: function fill(d) {return d.close > d.open ? theme_bull : theme_bear;} }));

// Cursor
    parameters.push (React.createElement(CrossHairCursor, {strokeDasharray: "Solid",  snapX: snapx, stroke: 'gray'}));
    parameters.unshift (MyChart, properties);
    
    return React.createElement.apply (null, parameters);
}

function ContractLayout (contract, dataset) {
    this.contract = contract;
    this.calculator = null; //Option_calculate;	        	        
    this.react = function (symbol, period, contract,  yorigin, showaxes, marks, symbolcanvas) {
    	var xorigin     = 4;    
        var right       = contract.summary.right;
        var option      = contract.value; 
        var parameters  = [];     
        var expiryindex = GetExpiryIndex(symbol, contract.summary.expiry);
        var color       =  symbol.Expiries[expiryindex].style.split(":")[1]              
        var ypos        = null;
        var yorigintype = null;
        this.origin     = yorigin;           
    
        if (right == 'C') {
        	parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",  fontSize: 10, fontFamily:"sans-serif",   displayFormat: d3.format(",." + symbol.Digits +"f"),   lineStroke:  'transparent', textFill: 'white',
                              	     yAccessor: function yAccessor() {return contract.summary.strike}, fill:     color}));

            parameters.push (React.createElement(StraightLine , {type: "horizontal",  x1Value: d3.timeParse("%Y%m%d:%H%M")(contract.summary.expiry + ':2100'), yValue: +contract.summary.strike, strokeWidth: 0.5, strokeDasharray:"ShortDash", stroke: color,  labelpos: 0, 
            //label:  function labelfunction(d, props) {return  ContractValueAccessor (d, props, contract, symbol.plotData);}, 
            label: contract.value.lastPrice,
            labelcolor: 'white'})); 
        }
        else {
           // ypos = 'right';
            parameters.push (React.createElement(EdgeIndicator, {itemType: "last", orient: "left", edgeAt: "left",  fontSize: 10, fontFamily:"sans-serif",   displayFormat: d3.format(",." + symbol.Digits +"f"),   lineStroke:  'transparent', textFill: 'white',
                                    yAccessor: function yAccessor() {return contract.summary.strike}, fill:     color}));
    
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  x1Value: d3.timeParse("%Y%m%d:%H%M")(contract.summary.expiry + ':2100'), yValue: +contract.summary.strike, strokeWidth: 0.5, strokeDasharray:"ShortDash", stroke: color,  labelpos: 3, 
            //label: function labelfunction(d, props) {return  ContractValueAccessor (d, props,contract, symbol.plotData);}, 
            label: contract.value.lastPrice,
            labelcolor: 'white'})); 
        }
      	parameters.push (React.createElement(SingleValueTooltip, 
            {
                origin:        [xorigin, yorigin],   
                xoriginRight : ypos, 
                yoriginType:   yorigintype, 
                yAccessor:      function yAccessor(d, props) {return OptionAccessor(d, props, contract, symbol.plotData);},  
                yDisplayFormat: function yDisplayFormat(d) {return d;}, 
                labelStroke:    color, 
                valueStroke:    color,  
                yLabel:         contract.summary.right + ' ' + contract.summary.strike + ' ' + contract.summary.localSymbol,  object: contract,  
                onClick:        function onClick(e)  {OnOption_Order (contract);} , 
                onClose :       function onClose (e) {contractclose (e, contract.summary.right+ contract.summary.strike + contract.summary.expiry);}
            }));

        return parameters;
    };     

}

var react_chartmain  = function (objects, xGrid, yGrid, width, height, margin, xmargin, 
                                 ymargin, Symbol, mainparameters, mainindicators, showxaxes, symbolcanvas, origin, news, discontinuous, showleftaxis) {

    let parameters = mainparameters;
    let yExtents = [];
    let xorigin = 4;

   
    let period = symbolcanvas.CurrentPeriod;
    let symbol = symbolcanvas.CurrentSymbol;
	let snapx = (discontinuous ? true : false);
    let tooltiporigin = [0 , -4];

    yExtents.push (extentfunction);

// X   
//BOTTOM
    if (showxaxes) {
    	parameters.push (React.createElement(XAxis,            {axisAt: "bottom", orient: "bottom", showTicks: true, outerTickSize: 0, ...xGrid, fontSize:10, fontFamily:"sans-serif", stroke: axiscolor, tickStroke: axiscolor}));
    	parameters.push (React.createElement(MouseCoordinateX, {at: "bottom", snapX: snapx, orient: "bottom", displayFormat: returnperiodformat (period), fontSize: 10, fontFamily:"sans-serif"}));	 
    }	
    else {
    	parameters.push (React.createElement(XAxis,            {axisAt: "bottom", orient: "bottom", showTicks: false, showDomain : true, outerTickSize: 0, ...xGrid, fontSize:10, fontFamily:"sans-serif", stroke: axiscolor, tickStroke:axiscolor}));
    //	parameters.push (React.createElement(MouseCoordinateX, {at: "bottom", orient: "bottom", displayFormat: returnperiodformat (period), fontSize: 10, fontFamily:"sans-serif"}));	
    }
// TOP
	parameters.push (React.createElement(XAxis,            {axisAt: "top", orient: "top", showTicks: false, outerTickSize: 0, ...xGrid, fontSize:10, fontFamily:"sans-serif", stroke: axiscolor, tickStroke: axiscolor}));
//	parameters.push (React.createElement(MouseCoordinateX, {at: "top", orient: "top", displayFormat: returnperiodformat(period), fontSize: 10, fontFamily:"sans-serif"}));	

// Y 
// RIGHT	
	parameters.push (React.createElement(YAxis,            {axisAt: "right", orient: "right", ticks: 10 , tickFormat: d3.format(",." + Symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor, onDoubleClick : ondblclick_chartMargin}));
	parameters.push (React.createElement(MouseCoordinateY, {at: "right", orient: "right", displayFormat: d3.format(",." + Symbol.Digits +"f") , fontSize: 10, fontFamily:"sans-serif"}));

// LEFT            
    if (showleftaxis) {
       // tooltiporigin = [-58, -4];        
        parameters.push (React.createElement(YAxis,            {axisAt: "left", orient: "left", showTicks: true, tickFormat: d3.format(",." + Symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
        parameters.push (React.createElement(MouseCoordinateY, {at: "left", orient: "left", displayFormat: d3.format(",." + Symbol.Digits +"f") , fontSize: 10, fontFamily:"sans-serif"}));
    } else {
        parameters.push (React.createElement(YAxis,            {axisAt: "left", orient: "left", showTicks: false, tickFormat: d3.format(",." + Symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
    }

// axes end
    
    if (symbolcanvas.BarType == Bar_Ohlc)
        parameters.push (React.createElement(OHLCSeries, { stroke: function stroke(d) {return d.close > d.open ? theme_chart_bullbody : theme_chart_bearbody;},  period: discontinuous ? null : period}));
    else
    if (symbolcanvas.BarType == Bar_PointFigure){
        parameters.push (React.createElement(PointAndFigureSeries, { }));
        eval ('_ReStock.indicator.pointAndFigure()');
    }
    else
    if (symbolcanvas.BarType == Bar_Renko) {
        parameters.push (React.createElement(RenkoSeries, { }));
        eval ('_ReStock.indicator.renko()');
    }
    else
    if (symbolcanvas.BarType == Bar_Kagi) {
        parameters.push (React.createElement(KagiSeries, {}));
    }
    else {
        parameters.push (
            React.createElement(CandlestickSeries,
                 { 
                    candleStrokeWidth:  1,  
                    type:               symbolcanvas.BarType, 
                    opacity:            1,
                    period:             discontinuous ? null : period,

                    wickStroke:         function wickstroke(d) {return d.close > d.open ? theme_chart_bullwickstroke : theme_chart_bearwickstroke;}, 
                    stroke:             function stroke(d) {return d.close > d.open ? theme_chart_bullstroke : theme_chart_bearstroke;}, 
                    fill:               function fill(d) {return d.close > d.open ? theme_chart_bullbody : theme_chart_bearbody;},   

                    heikin_wickStroke:  function heikin_wickstroke(d) {return d.heikin_close > d.heikin_open ? theme_chart_bullbody : theme_chart_bearbody;}, 
                    heikin_stroke:      function heikin_stroke(d) {return d.heikin_close > d.heikin_open ?  theme_chart_bullbody : theme_chart_bearbody;},
                    heikin_fill:        function heikin_fill(d) {return d.heikin_close > d.heikin_open ?  theme_chart_bullbody : theme_chart_bearbody;}, 
                }
            )
        );
    }


    parameters.push (React.createElement(OHLCTooltip,       {origin: tooltiporigin,  ohlcFormat: d3.format(",." + Symbol.Digits +"f"),  volumeFormat: d3.format("d"), symbolName : Symbol.Name,  onClick : function onClick(e) {return OrderPanel_Show(true);}}));
	parameters.push (React.createElement(EdgeIndicator,     {
        itemType: "last", 
        orient: "right", 
        edgeAt: "right",    
        padding: {left : 0, right : xmargin}, 
        fontSize: 10, 
        fontFamily:"sans-serif", 
        displayFormat: d3.format(",." + Symbol.Digits +"f"), 
        yAccessor: function yAccessor(d) {return d.close;},	
        lineStroke:  axiscolor, 
        fill: function fill(d) {return d.close > d.open ? theme_bull : theme_bear;} 
    }));
	
    // LEFT
    // SLTP
	

 if ((Symbol.TradeOrder == OP_BUY || Symbol.TradeOrder == OP_BUYSTOP || Symbol.TradeOrder == OP_BUYLIMIT) && Symbol.RightType == TRADE_STOCK) {
        if (+Symbol.BuyTP != 0) {
    	    parameters.push (React.createElement(EdgeIndicator, {
                itemType: "last", 
                orient: "left", 
                edgeAt: "left", 
                fontSize: 10, 
                fontFamily:"sans-serif", 
                displayFormat: d3.format(",." + Symbol.Digits +"f"), 
                yAccessor: function yAccessor(d) {return +Symbol.BuyEntry + (+Symbol.BuyTP * Symbol.SysPoint);},	
                lineStroke:  theme_buy, 
                fill: function fill(d) {return theme_buy;} 
            }));            
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.BuyEntry + (+Symbol.BuyTP * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_buy,      label: ""}));   
        }
        if (+Symbol.BuySL != 0) {
    	    parameters.push (React.createElement(EdgeIndicator, {
                itemType: "last", 
                orient: "left", 
                edgeAt: "left",  
                fontSize: 10, 
                fontFamily:"sans-serif", 
                displayFormat: d3.format(",." + Symbol.Digits +"f"), 
                yAccessor: function yAccessor(d) {return +Symbol.BuyEntry - (+Symbol.BuySL * Symbol.SysPoint) ;},	
                lineStroke:  'transparent', 
                fill: function fill(d) {return theme_sell;} 
            }));
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.BuyEntry - (+Symbol.BuySL * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_sell,     label: ""}));   
        }
    	
    	parameters.push (React.createElement(EdgeIndicator, {
            itemType: "last", 
            orient: "left", 
            edgeAt: "left",  
            fontSize: 10, 
            fontFamily:"sans-serif", 
            displayFormat: d3.format(",." + Symbol.Digits +"f"), 
            yAccessor: function yAccessor(d) {return +Symbol.BuyEntry;
            },	                                                            lineStroke:  "green", fill: function fill(d) {return theme_buy;} }));
        parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.BuyEntry, strokeWidth : 1,      stroke: theme_buy,      label: ""}));   
    }
    else 
    if ((Symbol.TradeOrder == OP_SELL || Symbol.TradeOrder == OP_SELLSTOP || Symbol.TradeOrder == OP_SELLLIMIT) && Symbol.RightType == TRADE_STOCK) {
    
        if (+Symbol.SellSL != 0) {    
        	parameters.push (React.createElement(EdgeIndicator, {
                itemType: "last", 
                orient: "left", 
                edgeAt: "left",
                fontSize: 10, 
                fontFamily:"sans-serif", 
                displayFormat: d3.format(",." + Symbol.Digits +"f"), 
                yAccessor: function yAccessor(d) {return +Symbol.SellEntry + (+Symbol.SellSL * Symbol.SysPoint);},	
                lineStroke:  theme_sell, 
                fill: function fill(d) {return theme_sell;}
             }));
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.SellEntry + (+Symbol.SellSL * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_sell,      label: ""}));  
        }
        if (+Symbol.SellTP != 0) {    
        	parameters.push (React.createElement(EdgeIndicator, {
                itemType: "last", 
                orient: "left", 
                edgeAt: "left",    
                fontSize: 10, 
                fontFamily:"sans-serif", 
                displayFormat: d3.format(",." + Symbol.Digits +"f"), 
                yAccessor: function yAccessor(d) {return +Symbol.SellEntry - (+Symbol.SellTP * Symbol.SysPoint) ;},	
                lineStroke:  'transparent', 
                fill: function fill(d) {return theme_buy;} 
            }));
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.SellEntry - (+Symbol.SellTP * Symbol.SysPoint), strokeWidth : 1,      stroke: theme_buy,     label: ""}));    
        }    
	    parameters.push (React.createElement(EdgeIndicator, {
            itemType: "last", 
            orient: "left", 
            edgeAt: "left",    
            fontSize: 10, 
            fontFamily:"sans-serif", 
            displayFormat: d3.format(",." + Symbol.Digits +"f"), 
            yAccessor: function yAccessor(d) {return +Symbol.SellEntry;},	
            lineStroke:  "green", 
            fill: function fill(d) {return theme_sell;}
         }));
        parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue:+Symbol.SellEntry, strokeWidth : 1,      stroke: theme_sell,      label: ""}));   
    }
  
//LEVELS

    if (symbolcanvas.Levels) {
        for (var i = period; i < sPeriodName.length; i++) {
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: Symbol.UpLevel[i] ,   strokeWidth : 1, stroke: theme_bull,   labelpos : i, labelcolor: 'white', label: sPeriodName[i]}));    
            parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: Symbol.DownLevel[i] , strokeWidth : 1, stroke: theme_bear,   labelpos: i,  labelcolor: 'white', label: sPeriodName[i]}));      
        }
    }            
    
/*    
<ClickCallback
						onMouseMove={ (moreProps, e) => { console.log("onMouseMove", moreProps, e); } }
						onMouseDown={ (moreProps, e) => { console.log("onMouseDown", moreProps, e); } }
						onClick={ (moreProps, e) => { console.log("onClick", moreProps, e); } }
						onDoubleClick={ (moreProps, e) => { console.log("onDoubleClick", moreProps, e); } }
						onContextMenu={ (moreProps, e) => { console.log("onContextMenu", moreProps, e); } }
						onPan={ (moreProps, e) => { console.log("onPan", moreProps, e); } }
						onPanEnd={ (moreProps, e) => { console.log("onPanEnd", moreProps, e); } }
					/>
*/					  
//	parameters.push (React.createElement(ClickCallback,     {enabled: true,  /*onClick : onclick_chartcanvas,*/ onContextMenu : OnRClickCanvasChart, onDoubleClick : onclick_chartcanvas}));
/*
    if (!alldeleted) {
        parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.Trends, init : {trends: []}, subtype : "trendline", enabled: (symbolcanvas.Selection == 'trendline'),  type: "XLINE" , snap: false, strokeWidth : 1, onStart: onTrendLineStart, onComplete : onTrendLineComplete, stroke: "yellow"}));    
    
        parameters.push (React.createElement(FibonacciRetracement , {ref : "fib", retracements: symbolcanvas.Retracements, init : {retracements: []}, enabled: (symbolcanvas.Selection == 'fiblines'),  type: "BOUND" , onStart: onFibStart, onComplete : onFibComplete, strokeWidth : 1, stroke: "yellow"}));    
    
        if (symbolcanvas.HLines.length != 0) 
            parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.HLines, init : {trends: symbolcanvas.HLines}, subtype : "horizontal", enabled: false, type: "LINE", strokeWidth : 1, stroke: "Magenta", onStart: onTrendLineStart, onComplete : onTrendLineComplete}));    
    
        if (symbolcanvas.VLines.length != 0) 
            parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.VLines, init : {trends: symbolcanvas.VLines}, subtype : "vertical", enabled: false, type: "LINE", strokeWidth : 1, stroke: "Magenta", onStart: onTrendLineStart, onComplete : onTrendLineComplete}));    
    }

    for (var i = 0; i < symbolcanvas.Marks.length; i++) {
        parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: symbolcanvas.Marks[i] , stroke: "yellow", strokeDasharray:"ShortDash"}));    

    }

    
    for (var i = 0; i < symbolcanvas.Lines.length; i++) {
        parameters.push (React.createElement(TrendLine , {trends: symbolcanvas.Lines[i].trends, enabled: symbolcanvas.Lines[i].enabled,  recid : i, subtype : symbolcanvas.Lines[i].subtype, type:  symbolcanvas.Lines[i].type , onStart: onTrendLineStart, onComplete : onTrendLineComplete, stroke: symbolcanvas.Lines[i].stroke}));
    }
*/
/*        
    for (var i = 0; i < symbolcanvas.Lines.length; i++) {
        parameters.push (React.createElement(StraightLine , {type: "horizontal",  yValue: symbolcanvas.Lines[i] , stroke: "tomato", strokeDasharray:"ShortDash"}));    
//        parameters.push (React.createElement(InteractiveYCoordinate , {ref: saveInteractiveNodes("InteractiveYCoordinate", 1), enabled: state.enableInteractiveObject, onDragComplete: onDragComplete, onDelete: onDelete, yCoordinateList: state.yCoordinateList_1 }));          

    }
*/
// Cursor
    parameters.push (React.createElement(CrossHairCursor, {strokeDasharray: "Solid",  snapX: snapx, stroke: 'gray'}));


	var properties = {xMargin: xmargin, yMargin: ymargin,  id: 10, height: height, yExtents: yExtents};

    parameters.unshift (MyChart, properties);
    
    return React.createElement.apply (null, parameters);
}

//-----------------------------------------------------------------------------------------------------------------------------------




var volume = function (yorigin) {
    var smaVolume50     = sma().id(3).windowSize(10).sourcePath("volume").merge(function (d, c) {d.smaVolume50 = c;}).accessor(function (d) {return d.smaVolume50;});
	
	var elt = React.createElement(
	MyChart,

	{ id: 2, height: 150, yExtents: [function (d) {return d.volume;}, smaVolume50.accessor()],  origin: function origin(w, h) {return [0, h - yorigin];}},

	React.createElement(YAxis,            {axisAt: "left", orient: "left", ticks: 5, tickFormat: d3.format(".0s"), ...yGrid,  fontSize: 10, fontFamily: "sans-serif", stroke:axiscolor, tickStroke:axiscolor }),
	React.createElement(MouseCoordinateY, {at: "left",	orient: "left",	displayFormat: d3.format(".4s") , fontSize: 10, fontFamily:"sans-serif" }),
	React.createElement(BarSeries,        {yAccessor: function yAccessor(d) {return d.volume;}, fill: function fill(d) {return d.close > d.open ? "#6BA583" : "#FF0000";} }),
	React.createElement(AreaSeries,       {yAccessor: smaVolume50.accessor(), stroke: smaVolume50.stroke(), fill: smaVolume50.fill() })
    );
    return elt;
}


var ContractValueAccessor  = function (d, props, contract, dataset) {

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;
    
    var symbol = symbolcanvas.CurrentSymbol; 

    var lastdate = new Date (); //props.fullData[props.fullData.length - 1].date;
    var lastprice = symbol.Last; //props.fullData[props.fullData.length - 1].close;

	var x =  props.mouseXY[0];
	var bardate =  (lastdate > props.xScale.invert(x) ? lastdate : props.xScale.invert(x));
	var y = props.mouseXY[1] - props.chartConfig.origin[1];

	var price      = (lastdate > props.xScale.invert(x) ? lastprice : props.chartConfig.yScale.invert(y));
    var expiry     = contract.summary.expiry;

    var volatility =  parseFloat(contract.value.impliedVolatility);
    var strike     = contract.summary.strike;
    var dividend   = CurrentDividend;
    var rate       = CurrentRate;    
    var nbrdays    = GetDaysToExpiration (expiry, bardate);
    var theorical_price = 0;
    var delta = 0;

    if (volatility == 0) volatility = 100;

    if (contract.summary.right == 'P') {
        label = 'PUT ';
        var put_price_greeks  = getCRROptionPriceAndGreeks(price,strike, volatility/100,rate/100, nbrdays/365, steps, dividend/100,true);
        theorical_price  = RoundTo(put_price_greeks[0],  1000);
        delta = RoundTo(put_price_greeks[1], 100000)
    }
    else {
        label = 'CALL';
        var call_price_greeks = getCRROptionPriceAndGreeks(price,strike,volatility/100,rate/100, nbrdays/365, steps, dividend/100,false);
        theorical_price = RoundTo(call_price_greeks[0], 1000);
        delta = RoundTo(call_price_greeks[1], 100000)
    }

    return contract.summary.right+  ': ' + theorical_price; //.toFixed(symbol.Digits)
}


var OptionAccessor  = function (d, props, contract, dataset) {

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;
    
    var symbol = symbolcanvas.CurrentSymbol; 
    var lastdate = new Date (); //props.fullData[props.fullData.length - 1].date;
    var lastprice = props.fullData[props.fullData.length - 1].close;

	var x =  props.mouseXY[0];
	var bardate =  (lastdate > props.xScale.invert(x) ? lastdate : props.xScale.invert(x));
	var y = props.mouseXY[1] - props.chartConfig.origin[1];

	var price      = (lastdate > props.xScale.invert(x) ? lastprice : props.chartConfig.yScale.invert(y));
    var expiry     = contract.summary.expiry;

    var volatility =  parseFloat(contract.value.impliedVolatility)/100;
    var strike     = contract.summary.strike;
    var dividend   = CurrentDividend;
    var rate       = CurrentRate;    
    var nbrdays    = GetDaysToExpiration (expiry, bardate);
    var theorical_price = 0;
    var delta = 0;

    volatility = 85 /100;

    if (contract.summary.right == 'P') {
        label = 'PUT ';
        var put_price_greeks  = getCRROptionPriceAndGreeks(price,strike, volatility, rate/100, nbrdays/365, steps, dividend/100,true);
        theorical_price  = RoundTo(put_price_greeks[0],  1000); 
        delta = RoundTo(put_price_greeks[1], 100000)
    }
    else {
        label = 'CALL';
        var call_price_greeks = getCRROptionPriceAndGreeks(price,strike, volatility, rate/100, nbrdays/365, steps, dividend/100,false);
        theorical_price = RoundTo(call_price_greeks[0], 1000); 
        delta = RoundTo(call_price_greeks[1], 100000)
    }

    return ' Days: ' +  nbrdays + ', Delta: ' + delta +  ', Volatility: ' + volatility + ' %, Price: ' + theorical_price; //.toFixed(symbol.Digits)
}


var ProgressAccessor = function (d, props, object, dataset) {
    var tracevalue = "";
    if (dataset) {

    	var length = dataset.length;
        
        if (length <= 0) return;
        var endindex    = dataset[length-1].idx.index;
        var startindex  = dataset[0].idx.index;
                
        if (d.idx.index < startindex || d.idx.index > endindex) {
            return;
        }
        startindex = (length - 1) - (endindex - d.idx.index);


        for (var i = startindex; i >= 0; i--) {
//            if (dataset[i].progress_BUY || dataset[i].progress_SELL) {// || dataset[i].progress_EXIT_BUY || dataset[i].progress_EXIT_SELL) {
                if (dataset[i].progress_BUY         && dataset[i].progress_BUY == 1) 	        tracevalue += "BUY" + "\n";
                if (dataset[i].progress_SELL        && dataset[i].progress_SELL == 1) 	        tracevalue += "SELL" + "\n";
                if (dataset[i].progress_EXIT_BUY    && dataset[i].progress_EXIT_BUY == 1) 	    tracevalue += "EXIT_BUY" + "\n";
                if (dataset[i].progress_EXIT_SELL   && dataset[i].progress_EXIT_SELL == 1) 	    tracevalue += "EXIT_SELL" + "\n";
  //              break;
  //          }
        }    
    }
    return tracevalue;
}




const dateFormat = d3.timeFormat("%Y-%m-%d");
const numberFormat = d3.format(".2f");




engines_react = function (properties) {
    let symbol   = properties.symbol;  
    let period   = properties.period;  
    let engine   = properties.object;  
    let yorigin   = properties.height;  
    let showaxes = properties.showaxes;
    let canvas   = properties.canvas;  
    let xGrid    = properties.xgrid;   
    let yGrid    = properties.ygrid;   

    let enginename = engine.Name;
    var parameters = [];     

        
    for (var i = 0; i < canvas.Marks.length; i++) {
        parameters.push (React.createElement(StraightLine , {type: "vertical",  xValue: canvas.Marks[i] , stroke: "blue", strokeDasharray:"ShortDash"}));    
    }               
    
    parameters.unshift ( 
    	MyChart,
    	{ id: 100,  height: Indicator_Height, yExtents: [function (d) {return eval ('Math.abs (d.' + enginename + ');')}],  origin: function origin(w, h) {return [0, h - yorigin];}},
    	React.createElement(YAxis, {axisAt: "right", orient: "right", ticks: 5, tickFormat: d3.format(".0f"), ...yGrid, fontSize: 10, fontFamily: "sans-serif", stroke:axiscolor, tickStroke:axiscolor }),
        React.createElement(MouseCoordinateY, {	at: "right", orient: "right",	displayFormat: d3.format(".4f") , fontSize: 10, fontFamily:"sans-serif" }),

        React.createElement(YAxis, {axisAt: "left", orient: "left", showTicks: false, outerTickSize: 0, tickFormat: d3.format("." + symbol.Digits + "f"), ...yGrid, fontSize: 10, fontFamily: "sans-serif", stroke:axiscolor, tickStroke:axiscolor }),


        React.createElement(BarSeries, {yAccessor: function yAccessor(d) {return eval ('Math.abs (d.' + enginename + ')')}, stroke:   "lime" , fill: function fill(d) {return eval ('d.' + enginename + '  >= 0 ? theme_chart_bullbody : theme_chart_bearbody');} }),
        React.createElement(SingleValueTooltip, {origin: [4, 10], yAccessor: function yAccessor(d) {return eval ('d.' + enginename)}, yLabel: enginename,   yDisplayFormat: d3.format(".0f"),  valueStroke:axiscolor,  onClick: function onClick(e) {} , onClose : function onClose (e) {engineclose (e, enginename)}}),
        React.createElement(XAxis,    {axisAt: "bottom", orient: "bottom", showDomain : true, showTicks : showaxes, outerTickSize: 0, ...xGrid, fontSize: 10, fontFamily: "sans-serif", stroke:axiscolor, tickStroke:axiscolor }),
        showaxes ? React.createElement(MouseCoordinateX,   {at: "bottom", orient: "bottom", displayFormat: returnperiodformat(period)  , fontSize: 10, fontFamily:"sans-serif"}) : ''
    );
    return React.createElement.apply (null, parameters);
}

markers_react = function (properties) {
    
    let symbol   = properties.symbol;  
    let period   = properties.period;  
    let marker   = properties.object;  
    let yorigin  = properties.height;  
    let showaxes = properties.showaxes;
    let canvas   = properties.canvas;  
    let xGrid    = properties.xgrid;   
    let yGrid    = properties.ygrid;   
    let showleftaxis = properties.showleftaxis;  

    var parameters = [];     
    var symbolcanvas = solution.GetCanvasFromTerminal ();   
        
    let markername = marker.Name;
    let markerperiod = '(';
    
    for (var i = 0; i < marker.Periods.length; i++) {
        if (i != 0) markerperiod += ', '
        markerperiod += PeriodName[marker.Periods[i]]
    }
    markerperiod += ')';

           
    parameters.unshift ( 
    	MyChart,
    	{ id: marker.Id, height: Indicator_Height, yExtents: [function (d) {return eval ('Math.abs (d.' + markername + ');')}],  origin: function origin(w, h) {return [0, h - yorigin];}},
    	React.createElement(YAxis, {axisAt: "right", orient: "right", ticks: 5, tickFormat: d3.format("." + symbol.Digits + "f"), ...yGrid, fontSize: 10, fontFamily: "sans-serif", stroke:axiscolor, tickStroke:axiscolor }),
        React.createElement(MouseCoordinateY, {at: "right", orient: "right",	displayFormat: d3.format(",." + symbol.Digits +"f") , fontSize: 10, fontFamily:"sans-serif" }),
    )
    
    
    if (showleftaxis) {
         parameters.push (React.createElement(YAxis,            {axisAt: "left", orient: "left", ticks: 5, showTicks: true, tickFormat: d3.format(",." + symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}),
                          React.createElement(MouseCoordinateY, {at: "left", orient: "left", displayFormat: d3.format(",." + symbol.Digits +"f") , fontSize: 10, fontFamily:"sans-serif"}));
     } else {
         parameters.push (React.createElement(YAxis,            {axisAt: "left", orient: "left", showTicks: false, tickFormat: d3.format(",." + symbol.Digits +"f"), outerTickSize: 20, ...yGrid, fontSize:10, fontFamily:"sans-serif", stroke:axiscolor, tickStroke:axiscolor}));
     }

     parameters.push ( 
    	React.createElement(BarSeries, 
            {
                yAccessor: function yAccessor(d) {return eval ('Math.abs (d.' + markername + ')')}, 
                opacity:   1,
                fill:      function fill(d)      {return eval ('d.' + markername + '  >= 0 ? theme_chart_bullbody : theme_chart_bearbody');} 
            }),
        
        React.createElement(SingleValueTooltip, {origin: [4, 10], yAccessor: function yAccessor(d) {return eval ('d.' + markername)}, yLabel: markername + markerperiod,   yDisplayFormat: d3.format(".4f"),  valueStroke:axiscolor,  onClick: function onClick(e) {} , onClose : function onClose (e) {markerclose (e, markername)}}),
        React.createElement(XAxis,    {axisAt: "bottom", orient: "bottom", showDomain : true, showTicks : showaxes, outerTickSize: 0, ...xGrid, fontSize: 10, fontFamily: "sans-serif", stroke:axiscolor, tickStroke:axiscolor }),
        showaxes ? React.createElement(MouseCoordinateX,   {at: "bottom", orient: "bottom", displayFormat: returnperiodformat(period)  , fontSize: 10, fontFamily:"sans-serif"}) : ''
    );
    return React.createElement.apply (null, parameters);
};



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var PROFIT_calculate = function (data) {
    for (var z = 0; z <	solution.CurrentTerminal.PG.Engines.length; z++) {
        var enginename = solution.CurrentTerminal.PG.Engines[z].Name;
        for (var i = 0; i < data.length; i++) {
            eval ('data[' + i + '].' + enginename + ' = ' + 0 + ';');
        }
        CalculateProfit (z, data);
    }
    return data;
}

var  CalculateProfit = function (engineindex, data) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;
    

    var profitdata = symbolcanvas.CurrentSymbol.profitData[engineindex];
    var enginename = solution.CurrentTerminal.PG.Engines[engineindex].Name;
    for (var i = 0; i < profitdata.length; i++) {
        SetProfit (enginename, profitdata[i].startdate, profitdata[i].enddate, profitdata[i].profit, data);
    }
    
}

var  SetProfit= function (enginename, starttime, endtime, profit, data) {
   
    var fbarindex = FindIdxDataFromTime (starttime, data);                
    if (fbarindex < 0) return data;
    
    var tbarindex = FindIdxDataFromTime (endtime, data);                
    if (tbarindex < 0) return data;

    for (var i = fbarindex; i <= tbarindex; i++) {
        eval ('data[' + i + '].' + enginename + ' = ' + profit + ';');
    }
}

    
function CCI_Indicator (dataset, period, apply) {
    var open = [];
    var low = [];
    var high = [];
    var close = [];
    
    var line = new Array();
    
    for(var i = 0; i < dataset.length; i++ ) {
        open.push (dataset[i].open);
        low.push (dataset[i].low);
        high.push (dataset[i].high);
        close.push (dataset[i].close);

    }
    var result = CCI.calculate({period : period, open : open, low : low, high : high, close : close})
    var skip = dataset.length - result.length;
    
    for (var i = 0; i < result.length; i++ ) {
            line.push ({value: result[i],  date: dataset[i + skip].date});
    }
    return line;
}   


function MA_Indicator (dataset, period, apply) {
    var linedata = [];
    var line = new Array();
    
    for(var i = 0; i < dataset.length; i++ ) {
        linedata.push (dataset[i].close);
    }
    var result = SMA.calculate({period : period, values : linedata})
    var skip = dataset.length - result.length;
    
    for (var i = 0; i < result.length; i++ ) {
            line.push ({value: result[i],  date: dataset[i + skip].date});
    }
    return line;
}

var dateincontracts = function (Expiries, date) {
    for (var i = 0; i <  Expiries.length; i++) {
        if (date.getTime() == d3.timeParse("%Y%m%d:%H%M")(Expiries[i] + ':2200').getTime())
            return true;
        }
    return false;
}

//-------------------------------------------------------------- REACT TO CHART --------------------------------------------------------


function RetreiveDaySeperators(Symbol, Period) {
    var data = Symbol.plotData;
    Symbol.periodSeperatorData[Period].length = 0;
    for (i = 1; i < data.length; i++) {
        if (Period == P_D1) {
           if (data[i].date.getWeek() != data[i-1].date.getWeek()) {
                 Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "turquoise", linedash: 3});
            }  
            if (data[i-1].date.getMonth() != data[i].date.getMonth()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value:  data[i].idx.index}, strokestyle: "gray", linedash: 4});
            }              
            if (data[i].date.getYear() != data[i-1].date.getYear()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "yellow", linedash: 1});
            }
        } else
        if (Period == P_W1) {
            if (data[i-1].date.getMonth() != data[i].date.getMonth()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value:  data[i].idx.index}, strokestyle: "gray", linedash: 4});
            }  
            if (data[i].date.getYear() != data[i-1].date.getYear()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "yellow", linedash: 1});
            }
        } else
        if (Period == P_MN) {
            if (data[i].date.getYear() != data[i-1].date.getYear()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "yellow", linedash: 1});
            }
        } else  {
            if (data[i].date.getDay() != data[i-1].date.getDay()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "gray", linedash: 2});
            }  
            if (data[i].date.getWeek() != data[i-1].date.getWeek()) {
                Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "turquoise", linedash: 3});
            }  
            if (data[i-1].date.getMonth() != data[i].date.getMonth()) {
               Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value:  data[i].idx.index}, strokestyle: "gray", linedash: 4});
            }              
            if (data[i].date.getYear() != data[i-1].date.getYear()) {
               Symbol.periodSeperatorData[Period].push({start: {date: data[i].date, value: data[i].idx.index}, strokestyle: "yellow", linedash: 1});
            }
        }
    }
}

var B_DrawAGraphics = function (ctx, props, moreProps, candleData) {

    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;

    var period          = symbolcanvas.CurrentPeriod;
    var symbol          = symbolcanvas.CurrentSymbol;  
    var discontinuous   = symbolcanvas.Discontinuous;

    if (!symbol) return;

	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData,
	    xAccessor = moreProps.xAccessor;

    symbol.plotData = plotData;
    symbol.moreProps = moreProps;

    if (plotData.length == 0)
        return;

//RESOLVE    
    if (solution.get('ui').currentplatform_pname == 'option') {
        ctx.beginPath();
        ctx.font = '900 16px "Font Awesome 6 Free"';        
        Draw_OptionOrders(symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData);
        ctx.closePath();
    }
    
    if (symbolcanvas.Seperator) {
        RetreiveDaySeperators(symbol, period);
 
        for (var i = 0; i <  symbol.periodSeperatorData[period].length; i++) {
            var x = xScale(discontinuous ? symbol.periodSeperatorData[period][i].start.value : symbol.periodSeperatorData[period][i].start.date);
            var y = 0;
            ctx.beginPath();
            ctx.strokeStyle = symbol.periodSeperatorData[period][i].strokestyle;
            ctx.setLineDash([symbol.periodSeperatorData[period][i].linedash]);
            ctx.lineWidth = 0.5;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 2000);
            ctx.stroke();
        }
        ctx.setLineDash([0]);    
        
    }   

    if (!candleData) return;

    Draw_RESISTANCE(symbolcanvas, ctx, moreProps, xAccessor, xScale, yScale, plotData);
    Draw_SUPPORT(symbolcanvas, ctx, moreProps, xAccessor, xScale, yScale, plotData);
    Draw_Markers(symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData, candleData);
//RESOLVE     
    if (solution.get('ui').currentplatform_pname == 'tradedesk') {
        var PG = solution.CurrentTerminal.PG;
        ctx.beginPath();
        ctx.font = '900 16px "Font Awesome 6 Free"';

        Draw_Orders(symbolcanvas, PG.Orders, ctx, props, xAccessor, xScale, yScale, plotData);
        Draw_Orders(symbolcanvas, PG.EOrders, ctx, props, xAccessor, xScale, yScale, plotData);
        Draw_PROGRESS(symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData);        
        
        ctx.closePath();
    }
//RESOLVE    
    if (solution.get('ui').currentplatform_pname == 'option') {
        var PG = solution.CurrentOptionTerminal.PG;
        Draw_AB(symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData);        
    }

    Draw_Alerts(symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData);

    if (!TestMode) return;
    for (var i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] === false) {
            B_DrawGraphics(i, ctx, moreProps, xAccessor, xScale, yScale, plotData);
        }    
    }
}

var B_DrawGraphics = function (session, ctx, moreProps, xAccessor, xScale, yScale, plotData) {
    if (!GraphicMode) return 0;
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas || symbolcanvas.CurrentSymbol.plotData.length == 0) return;    
    
    symbolcanvas.CurrentSymbol.plotData.length
    
    
    var borderboxcolor;
    var borderboxwidth;
    var sellaveragecolor = theme_sell;
    var buyaveragecolor = 'deepskyblue';
    var orders;
    var lx,
        rx,
        ty,
        by;

// START STRATEGY
    var startdate = new Date(B_StartDate[session] * 1000);
    var Idx = FindIdxDataFromTime(startdate, plotData);
    if (Idx >= 0) {
        lx = plotData[Idx].idx.index;
    }
    else {
        lx = 0;
    }
    rx = Math.round(CurrentEngine.Data[symbolcanvas.CurrentPeriod].length - 1);
  
    ctx.beginPath();
    ctx.lineWidth = 1;                
    ctx.strokeStyle = '#2a486a';
    ctx.moveTo(xScale(lx), 0);
    ctx.lineTo(xScale(lx), 5000);
    ctx.stroke();
    ctx.font = "10px Arial";
    ctx.fillStyle = "lime";
    ctx.fillText("START",  xScale(lx) - 10, 20);

// HISTORY
    ctx.setLineDash([5]);
    ctx.lineWidth = 0.5;
    
    orders = OrdersHistory;
    
    for (var i = 0; i < orders.length; i++) {
        var color;
        
        var x  = xScale(Math.round(orders[i].openidx[symbolcanvas.CurrentPeriod - CurrentEngine.CurrentPeriod]));
        var x1 = xScale(Math.round(orders[i].closeidx[symbolcanvas.CurrentPeriod - CurrentEngine.CurrentPeriod]));
        
        var y  = yScale(orders[i].OpenPrice);
        var y1 = yScale(orders[i].ClosePrice);
        
        var color = orders[i].Type == OP_BUY ? theme_buy : theme_sell;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.font = '900 16px "Font Awesome 6 Free"';
        ctx.fillStyle = color;
        ctx.fillText('\uf35a', x  - 8, y + 8);
        ctx.fillText('\uf0a8', x1 - 8, y1 + 8);
    
        ctx.font = "10px Arial";
        ctx.fillStyle = "lightgray";
        ctx.fillText(orders[i].Lots.toString(),  x - 30, y + 4);
    }

    ctx.setLineDash([0]);

    orders = []; 
    findOrders(Orders, session, orders);

    if (orders.length == 0) {
        return;
    } else {
// FIND MINMAX
        var minmax = findMinMaxDatePrice(orders);        
        ty = minmax[2].OpenPrice;
        by = minmax[3].OpenPrice;
    }

// Get the lx of the whole session 

    var lastorder = orders[orders.length - 1];
    var lastindex  = lastorder.openidx[symbolcanvas.CurrentPeriod - CurrentEngine.CurrentPeriod];
   
    var plotlenth     = symbolcanvas.CurrentSymbol.plotData.length;    
    var lastplotindex = symbolcanvas.CurrentSymbol.plotData[plotlenth - 1].idx.index;
   
       
    
// ORDERS    
 
    for (var i = 0; i < orders.length; i++) {
        var color = orders[i].Type == OP_BUY ? theme_buy : theme_sell;        
        var x = xScale(Math.round(orders[i].openidx[symbolcanvas.CurrentPeriod - CurrentEngine.CurrentPeriod]));
        var y = yScale(orders[i].OpenPrice);
        ctx.font = '900 16px "Font Awesome 6 Free"';
        ctx.fillStyle = color;
        ctx.fillText('\uf35a', x - 8, y + 8);

        ctx.font = "10px Arial";
        ctx.fillText(orders[i].Lots.toFixed(2).toString(),  x - 30, y + 4);

// SL TP        
        if (orders[i].Type == OP_BUY) {
            if (B_BuyLotSL[session] != 0) {
                var sly = yScale(orders[i].OpenPrice - B_BuyLotSL[session] * SYS_POINT);
                ctx.beginPath();
                ctx.lineWidth = 2;                
                ctx.strokeStyle = theme_sell;
                ctx.moveTo(x - 10, sly);
                ctx.lineTo(x + 10, sly);
                ctx.stroke();
            }
            if (B_BuyLotTP[session] != 0) {
                var tpy = yScale(orders[i].OpenPrice + B_BuyLotTP[session] * SYS_POINT);
                ctx.beginPath();
                ctx.lineWidth = 2;                
                ctx.strokeStyle = theme_buy;
                ctx.moveTo(x - 10, tpy);
                ctx.lineTo(x + 10, tpy);
                ctx.stroke();
            }
        }
        else
        if (orders[i].Type == OP_SELL) {
            if (B_SellLotSL[session] != 0) {
                var sly = yScale(orders[i].OpenPrice + B_SellLotSL[session] * SYS_POINT);
                ctx.beginPath();
                ctx.lineWidth = 2;                
                ctx.strokeStyle = theme_sell;
                ctx.moveTo(x - 10, sly);
                ctx.lineTo(x + 10, sly);
                ctx.stroke();
            }
            if (B_SellLotTP[session] != 0) {
                var tpy = yScale(orders[i].OpenPrice - B_SellLotTP[session] * SYS_POINT);
                ctx.beginPath();
                ctx.lineWidth = 2;                
                ctx.strokeStyle = theme_buy;
                ctx.moveTo(x - 10, tpy);
                ctx.lineTo(x + 10, tpy);
                ctx.stroke();
            }
        }  
    }
// HEDGE LINE
    if (B_Hedged[session] == true) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.moveTo(xScale(lx),   yScale(B_HedgeLine[session]));
        ctx.lineTo(xScale(rx),   yScale(B_HedgeLine[session]));
        ctx.stroke();
        ctx.fillText("Hedge Average (" + B_HedgeLine[session].toFixed(symbolcanvas.CurrentSymbol.Digits) + ")", xScale(lx) + (xScale(rx) - xScale(lx)) / 2,  yScale(B_HedgeLine[session]) - 3);
        
/*
        ObjectSet("hedgelinetext" + session, OBJPROP_PRICE1, B_HedgeLine[session]);
        ObjectSet("hedgelinetext" + session, OBJPROP_TIME1, Time[25]);
        ObjectSetText("hedgelinetext" + session, "(" + DoubleToString(B_HedgeLine[session], _Digits) + ")", 7, "Arial", Red);
*/        
    } 
// PIPSTEPS TIMESTEPS
    var up, down = 0;
    var ygrid;
    var directionstring = "";


    if (B_DirectionType[session] == DT_MINMAX) {
        up   = by;
        down = ty;
        directionstring = "Direction Type: MINMAX";
    }
    else {
        up   = lastorder.OpenPrice;
        down = lastorder.OpenPrice;
        directionstring = "Direction Type: LEVEL";
    }
    
    ctx.beginPath();  
    ctx.strokeStyle = 'yellow';
//    ctx.setLineDash([2]);    
    ctx.lineWidth = 0.5;

    if (B_PipStep[session] != 0) {
        ygrid = up + (B_PipStep[session] * SYS_POINT);        
        ctx.font = "10px Arial";


        ctx.fillText("Pip Step: " + B_PipStep[session], xScale(lastindex) - 70 , yScale(ygrid) + 5);   


        ctx.moveTo(xScale(lastindex), yScale(ygrid));
        ctx.lineTo(20000, yScale(ygrid));
        ctx.stroke();        

        ygrid = down - (B_PipStep[session] * SYS_POINT);

        ctx.fillText("Pip Step: " + B_PipStep[session], xScale(lastindex) - 70 , yScale(ygrid) + 5);   

        ctx.moveTo(xScale(lastindex), yScale(ygrid));
        ctx.lineTo(2000, yScale(ygrid));
        ctx.stroke();        

        up   += (B_PipStep[session] * SYS_POINT);
        down -= (B_PipStep[session] * SYS_POINT);
        
    }
    
    if (B_TimeStep[session] != 0) {
        var xgrid = lastindex;
        
        for (var i = lastindex; xgrid < lastplotindex; i++) {
            ctx.moveTo(xScale(xgrid), yScale(ty));
            ctx.lineTo(xScale(xgrid), yScale(ty));
            ctx.stroke();        
            xgrid += B_TimeStep[session]; 
        }
    }
    
    ctx.closePath()    
    ctx.setLineDash([0]);    
// RECTANGLE + FILL
    

    if (B_Operation[session] == OP_BUY) borderboxcolor = 'turquoise';
    else
    if (B_Operation[session] == OP_SELL) borderboxcolor = 'pink';
    else
    if (B_OrderType[session] == OT_HEDGE) borderboxcolor = 'gold';
    else borderboxcolor = '#e2d64240';

    
    if (B_KeepBuySell[session] == true) {
        borderboxwidth = 4;
    } else {
        borderboxwidth = 1;
    }
    

    if (B_Direction[session] == D_BACKWARD) {
        ctx.font = "10px Arial";

        ctx.fillText("Direction: BACKWARD", xScale(rx), 20);   
        ctx.fillText("Direction: BACKWARD", xScale(rx), moreProps.height - 20); 
        ctx.fillText(directionstring, xScale(rx), 30);   
        ctx.fillText(directionstring, xScale(rx), moreProps.height - 10); 
        
        ctx.fillStyle = 'rgba(155, 0, 0, 0.4)';    
        ctx.fillRect(xScale(lastindex), yScale(up), 2000, -2000);
        ctx.fillStyle = 'rgba(0, 79, 0, 0.4)';
        ctx.fillRect(xScale(lastindex), yScale(down), 2000, 2000);
    }
    else 
    if (B_Direction[session] == D_FORWARD) {
        ctx.font = "10px Arial";

        ctx.fillText("Direction: FORWARD", xScale(rx), 20);   
        ctx.fillText("Direction: FORWARD", xScale(rx), moreProps.height - 20);   
        ctx.fillText(directionstring, xScale(rx), 30);   
        ctx.fillText(directionstring, xScale(rx), moreProps.height - 10);        
        
        ctx.fillStyle = 'rgba(0, 79, 0, 0.4)';        
        ctx.fillRect(xScale(lastindex), yScale(up), 2000, -2000);
        ctx.fillStyle = 'rgb(155, 0, 0, 0.4)';
        ctx.fillRect(xScale(lastindex), yScale(down), 2000, 2000);

    }
    ctx.fillStyle = '#928a2d17';   
    ctx.rect(xScale(lx), yScale(ty), xScale(rx) - xScale(lx), yScale(by) - yScale(ty));
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.stroke();


// AVERAGE

    var blots = 0;
    var slots = 0;
    var distance = 10 * SYS_POINT;

    if (B_SellProfit[session] < 0) {
        slots = ((B_SellAveragePoint[session] - Bid + distance) * B_SellNbrLots[session]) / -distance;
    }
    if (B_BuyProfit[session] < 0) {
        blots = ((B_BuyAveragePoint[session] - Ask - distance) * B_BuyNbrLots[session]) / distance;
    }

    ctx.font = "10px Arial";

    ctx.lineWidth = 0.5;
    
    ctx.fillText(RuleName[B_StartOnRule[session]] + " - " + OperationName[B_Operation[session]] + " (" + B_SellAveragePoint[session].toFixed(symbolcanvas.CurrentSymbol.Digits) + " -- " + slots.toFixed(2).toString() + ")", xScale(lx) + (xScale(rx) - xScale(lx)) / 2, yScale(B_SellAveragePoint[session]) - 3);
    ctx.beginPath();    
    ctx.strokeStyle = sellaveragecolor;
    ctx.moveTo(xScale(lx), yScale(B_SellAveragePoint[session]));
    ctx.lineTo(xScale(rx), yScale(B_SellAveragePoint[session]));
    ctx.stroke();
    ctx.closePath();

    ctx.fillText(RuleName[B_StartOnRule[session]] + " - " + OperationName[B_Operation[session]] + " (" + B_BuyAveragePoint[session].toFixed(symbolcanvas.CurrentSymbol.Digits) + " -- " + blots.toFixed(2) + ")", xScale(lx) + (xScale(rx) - xScale(lx)) / 2, yScale(B_BuyAveragePoint[session]) - 3);

// Average Text line  
    ctx.beginPath();   
    ctx.strokeStyle = buyaveragecolor;
    ctx.moveTo(xScale(lx), yScale(B_BuyAveragePoint[session]));
    ctx.lineTo(xScale(rx), yScale(B_BuyAveragePoint[session]));
    ctx.stroke();
    ctx.closePath();

    return 1;
}


var Draw_Alerts = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData) {

    if (!symbolcanvas.Alerts) {
        return;
    }    

    var widthRatio = props.widthRatio;
    var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));
    var cw = width / (plotData.length - 1) * widthRatio;
    var candleWidth = Math.round(cw);

    var offset = candleWidth === 1 ? 0 : 0.5 * cw;
    var d = symbolcanvas.Alerts.pos;
    
    var x = Math.round(xScale(xAccessor(d)) - 0);
    var y = yScale(Math.max(d.open, d.close));
    var height = Math.abs(yScale(d.open) - yScale(d.close));
    
    ctx.beginPath();
    ctx.font = '900 16px "Font Awesome 6 Free"';         
    ctx.fillStyle = symbolcanvas.Alerts.color;
    ctx.fillText('\uf0a7', x-4, yScale(d.high) - 26);
    ctx.closePath();
}

var Draw_Orders = function (symbolcanvas, orders, ctx, props, xAccessor, xScale, yScale, plotData) {
    
    ctx.font = '900 16px "Font Awesome 6 Free"';

    for (var i = 0; i < orders.length; i++) {
        if (orders[i].Symbol != symbolcanvas.CurrentSymbol.Name) continue;
        
        var Idx = FindIdxDataFromTime(orders[i].Time, plotData);
        if (Idx < 0) continue;
        Idx = plotData[Idx].idx.index;
        var x = xScale(Idx);
        var y = yScale(orders[i].OPrice);
        if (orders[i].DataType != 0) { // 1 = history
            var Idx = FindIdxDataFromTime(orders[i].CTime, plotData);
            if (Idx < 0) continue;
            Idx = plotData[Idx].idx.index
            var x1 = xScale(Idx);
            var y1 = yScale(orders[i].CPrice);
            ctx.beginPath();
            ctx.setLineDash([3]);
            if (orders[i].Type == OP_BUY) ctx.strokeStyle = theme_buy;
            else ctx.strokeStyle = theme_sell;
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.setLineDash([0]);
            ctx.closePath();
        }
        if (orders[i].DataType != 0) {
            if (orders[i].Type == OP_BUY || orders[i].Type == OP_BUYSTOP - 15 || orders[i].Type == OP_BUYLIMIT - 15) {
                ctx.fillStyle = theme_buy; //buy color
                ctx.fillText('\uf359', x1 - 8, y1 + 6);
            } else {
                ctx.fillStyle = theme_sell;
                ctx.fillText('\uf359', x1 - 8, y1 + 6);
            }
        }
        ctx.setLineDash([3]);

        if (orders[i].Type == OP_BUY || orders[i].Type == OP_BUYSTOP - 15 || orders[i].Type == OP_BUYLIMIT - 15) {
            ctx.fillStyle = theme_buy; //buy color
            if (orders[i].Type == OP_BUY) {
                ctx.fillText('\uf35a', x - 8, y + 6);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = theme_buy;
                ctx.moveTo(x - 10000, y);
                ctx.lineTo(x + 10000, y);
                ctx.stroke();
                ctx.fillText('\uf35a', x - 8, y + 6);
                ctx.closePath();
            }
        } else {  //draw sell a little transition
            ctx.fillStyle = theme_sell;
            if (orders[i].Type == OP_SELL) {
                ctx.fillText('\uf35a', x - 10, y + 6);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = theme_sell;
                ctx.moveTo(x - 10000, y);
                ctx.lineTo(x + 100000, y);
                ctx.stroke();
                ctx.fillText('\uf35a', x - 10, y + 6);
                ctx.closePath();
            }
        }
        ctx.setLineDash([0]);

        // Stop Loss Take Profit
        if (parseInt(orders[i].SL) != 0) {
            var sly = yScale(orders[i].SL);
            ctx.beginPath();
            ctx.strokeStyle = theme_sell;
            ctx.moveTo(x - 10, sly);
            ctx.lineTo(x + 10, sly);
            ctx.stroke();
            ctx.closePath();
        }
        if (parseInt(orders[i].TP) != 0) {
            var tpy = yScale(orders[i].TP);
            ctx.beginPath();
            ctx.strokeStyle = theme_buy;
            ctx.moveTo(x - 10, tpy);
            ctx.lineTo(x + 10, tpy);
            ctx.stroke();
            ctx.closePath();
        }
    }    
        // SESSIONS        
    var sellaveragecolor = theme_sell;
    var buyaveragecolor = 'deepskyblue';
        

    for (var j = 0; j < symbolcanvas.Sessions.length; j++) {
        var Session = symbolcanvas.Sessions[j];
        var SessionNumber = Session.SessionNumber;
        
        var Symbol = solution.CurrentTerminal.PG.GetSymbolFromName(Session.Symbol);
        if (!Symbol || Symbol != symbolcanvas.CurrentSymbol) continue;
        
        var enginename = solution.CurrentTerminal.PG.GetEngineNameFromRule(RuleName[Session.StartRule]);
        

        var Idx = FindIdxDataFromTime(Session.StartDate, plotData);
        var xstart = (Idx >= 0 ? xScale(plotData[Idx].idx.index) : 0);
        var ystart = yScale(Session.MinPoint);
        var xend = xScale(plotData[plotData.length - 1].idx.index);
        var yend = yScale(Session.MaxPoint);

        ctx.font = '900 16px "Font Awesome 6 Free"';
        ctx.fillStyle = "#928a2d17";
        ctx.fillText('\uf30b', xstart - 20, ystart + 6);
        ctx.strokeStyle = "#928a2d";
        ctx.rect(xstart, ystart, xend - xstart, yend - ystart);
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.stroke();

      // AVERAGE
    
        ctx.font = "10px Arial";
        ctx.fillStyle = theme_color;
        ctx.lineWidth = 0.5;
        
        ctx.fillText(enginename + " (" + Session.SellAveragePoint.toFixed(symbolcanvas.CurrentSymbol.Digits) + " -- " + Session.SellLot.toFixed(2).toString() + ")", (xstart + (xend - xstart) / 2) - 40, yScale(Session.SellAveragePoint) - 3);
        ctx.beginPath();    
        ctx.strokeStyle = sellaveragecolor;
        ctx.moveTo(xstart, yScale(Session.SellAveragePoint));
        ctx.lineTo(xend, yScale(Session.SellAveragePoint));
        ctx.stroke();
        ctx.closePath();
    
        ctx.fillText(enginename + " (" + Session.BuyAveragePoint.toFixed(symbolcanvas.CurrentSymbol.Digits) + " -- " + Session.BuyLot.toFixed(2) + ")", (xstart + (xend - xstart) / 2) - 40, yScale(Session.BuyAveragePoint) - 3);
    
    // Average Text line  
        ctx.beginPath();   
        ctx.strokeStyle = buyaveragecolor;
        ctx.moveTo(xstart, yScale(Session.BuyAveragePoint));
        ctx.lineTo(xend, yScale(Session.BuyAveragePoint));
        ctx.stroke();
        ctx.closePath();
    }
}

var Draw_OptionOrders = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData) {
    
    let orders = symbolcanvas.PG.Orders;

    for (var i = 0; i < orders.length; i++) {
        if (orders[i].MSymbol != symbolcanvas.CurrentSymbol.Name) continue;

        var recid = orders[i].Number;
        var right; 
        var expiry;
        var strike;

        var x = xScale(new Date (+orders[i].Time));
        var y;

        if (orders[i].MSymbol == orders[i].Symbol) { // STOCK
            y = yScale(orders[i].OPrice);
        }            
        else {
            right = recid.charAt(0);
            expiry = recid.substring (recid.length - 8);
            strike = +recid.substring (1, recid.length - 8);
            y = yScale(strike);
        }
        
        if (+orders[i].DataType != 0) { // 1 = history
            var x1 = xScale(new Date (+orders[i].CTime));
            var y1 = y; //yScale(+orders[i].CPrice);
            ctx.beginPath();
            ctx.setLineDash([3]);
            if (+orders[i].Type == OP_BUY) ctx.strokeStyle = "blue";
            else ctx.strokeStyle = theme_sell;
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.setLineDash([0]);
            if (+orders[i].Type == OP_BUY || +orders[i].Type == OP_BUYSTOP - 15 || +orders[i].Type == OP_BUYLIMIT - 15) {
                ctx.fillStyle = 'rgba(153, 217, 234, 0.8)'; //buy color
                ctx.fillText('\uf359', x1 - 8, y1 + 6);
            } else {
                ctx.fillStyle = 'rgba(255, 128, 128, 0.8)';
                ctx.fillText('\uf359', x1 - 8, y1 + 6);
            }
        }
        if (+orders[i].Type == OP_BUY || +orders[i].Type == OP_BUYSTOP - 15 || +orders[i].Type == OP_BUYLIMIT - 15) {
            ctx.fillStyle = 'rgba(153, 217, 234, 0.8)'; //buy color
            if (+orders[i].Type == OP_BUY) {
                ctx.fillText('\uf35a', x - 8, y + 6);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = theme_buy;
                ctx.setLineDash([3]);
                ctx.moveTo(x - 10000, y);
                ctx.lineTo(x + 10000, y);
                ctx.stroke();
                ctx.setLineDash([0]);
                ctx.fillText('\uf35a', x - 8, y + 6);
            }
        } else {
            ctx.fillStyle = 'rgba(255, 128, 128, 0.8)';
            if (+orders[i].Type == OP_SELL) {
                ctx.fillText('\uf35a', x - 8, y + 6);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = theme_sell;
                ctx.setLineDash([3]);
                ctx.moveTo(x - 10000, y);
                ctx.lineTo(x + 100000, y);
                ctx.stroke();
                ctx.setLineDash([0]);
                ctx.fillText('\uf35a', x - 8, y + 6);
            }
        }
        // Stop Loss Take Profit
        if (parseInt(+orders[i].SL) != 0) {
            var sly = yScale(+orders[i].SL);
            ctx.beginPath();
            ctx.strokeStyle = theme_sell;
            ctx.moveTo(x - 10, sly);
            ctx.lineTo(x + 10, sly);
            ctx.stroke();
        }
        if (parseInt(+orders[i].TP) != 0) {
            var tpy = yScale(+orders[i].TP);
            ctx.beginPath();
            ctx.strokeStyle = theme_buy;
            ctx.moveTo(x - 10, tpy);
            ctx.lineTo(x + 10, tpy);
            ctx.stroke();
        }
    }
}

var Draw_Markers = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData, candleData) {
    if (!symbolcanvas.Markers.length) {
        return;
    }    
    ctx.beginPath();
    ctx.font = '900 16px "Font Awesome 6 Free"';        

    for (var j = 0; j < symbolcanvas.Markers.length; j++) {
        let markername = symbolcanvas.Markers[j];        
        let marker = symbolcanvas.PG.GetMarkerFromName(markername)
        
        if (!marker || 
             marker.Type != 'Boolean' || 
             marker.Symbol != symbolcanvas.CurrentSymbol || 
             marker.CurrentPeriod != symbolcanvas.CurrentPeriod)  {
            continue;
        }    
        

        for (var i = 0; i < plotData.length; i++) {

            let low     = yScale(plotData[i].low);
            let high    = yScale(plotData[i].high); 
            let x       = props.className == "react-stockcharts-candlestick" ? candleData[i].x : candleData.bars[i].openX2;
            let width   = props.className == "react-stockcharts-candlestick" ? (candleData[i].width/2) - 4 : -10

            if (plotData[i][markername]) {

                
                ctx.strokeStyle = MarkerColors[marker.Id];
                ctx.fillStyle = MarkerColors[marker.Id];
              //  ctx.globalAlpha = 0.1;
                ctx.rect(x, high, candleData[i].width, low - high);
             //   ctx.fill();
                ctx.stroke();
                
                ctx.globalAlpha = 1;
                switch (marker.Id) {
                    case 0 :
                        ctx.fillText('\uf0d7', x +  width, high - 8);                         
                    break;
                    case 1 :
                        ctx.fillText('\uf0d8', x +  width, low + 18);                      
                    break;
                    case 2 :
                        ctx.fillText('\uf0d7', x +  width, high - 18);                           
                    break;
                    case 3 :
                        ctx.fillText('\uf0d8', x +  width, low + 28);        
                    break;

                }     
            }
        }
    }
    ctx.closePath();    
}


var Draw_RESISTANCE = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData) {
    if (!symbolcanvas.GetIndicator (RESISTANCE)) {
        return;
    }

    var lastresistance = null;
    for (var i = 0; i < plotData.length - 1; i++) {
        if (plotData[i].RESISTANCE != undefined && plotData[i].RESISTANCE != lastresistance) {
            var Price1 = plotData[i].RESISTANCE[0][0];
            if (Price1 == undefined) continue;
            var Price2 = plotData[i].RESISTANCE[1][0];
            var Time1  = plotData[i].RESISTANCE[0][1]; 
            var Time2  = plotData[i].RESISTANCE[1][1]; 

         
//RESOLVE       
//          if (solution.get('ui').currentplatform_pname == 'option') {
//              var x = xScale(props.fullData[Time1].date);
//              var x1 = xScale(props.fullData[Time2].date);
//          
//          }
//          else {
                var x = xScale(Time1);
                var x1 = xScale(Time2);
//            }

            var y = yScale(Price1);
            var y1 = yScale(Price2);

            ctx.beginPath();
            ctx.strokeStyle = theme_buy;
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.closePath();
            lastresistance = plotData[i].RESISTANCE;
        }  
    }
}

var Draw_SUPPORT = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData) {

    if (!symbolcanvas.GetIndicator (SUPPORT)) {
        return;
    }

    var lastsupport = null;    
    for (var i = 0; i < plotData.length - 1; i++) {
        if (plotData[i].SUPPORT != undefined && plotData[i].SUPPORT != lastsupport) {
            var Price1 = plotData[i].SUPPORT[0][0];
            if (Price1 == undefined) continue;
            var Price2 = plotData[i].SUPPORT[1][0];
            var Time1  = plotData[i].SUPPORT[0][1]; 
            var Time2  = plotData[i].SUPPORT[1][1]; 

//RESOLVE                       
//            if (solution.get('ui').currentplatform_pname == 'option') {
//                var x = xScale(props.fullData[Time1].date);
//                var x1 = xScale(props.fullData[Time2].date);
//            }
//            else {
                var x = xScale(Time1);
                var x1 = xScale(Time2);
//            }

            var y = yScale(Price1);
            var y1 = yScale(Price2);

            ctx.beginPath();
            ctx.strokeStyle = theme_sell;
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.closePath();
            lastsupport = plotData[i].SUPPORT;            
        }
    }
}

var Draw_PROGRESS = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData) {

    if (!symbolcanvas.GetIndicator (PROGRESS)) {
        return;
    }    
    
    var widthRatio = (props.widthRatio) ? props.widthRatio : 1;
    var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));
    
    var cw = width / (plotData.length - 1) * widthRatio;
    var candleWidth = Math.round(cw);
    var offset = candleWidth === 1 ? 0 : 0.5 * cw;
    
    for (var i = 0; i < plotData.length; i++) {
        if (plotData[i].progress_BUY == 1 || plotData[i].progress_SELL == 1 || plotData[i].progress_EXIT_SELL == 1 || plotData[i].progress_EXIT_BUY == 1) {
            
            var x = Math.round(xScale(xAccessor(plotData[i])) - 0);
            
            var y = yScale(Math.max(plotData[i].open, plotData[i].close));
            var height = Math.abs(yScale(plotData[i].open) - yScale(plotData[i].close));
            var bullcolor = theme_bull; 
            var bearcolor = theme_bear; 
            ctx.beginPath();
            if (plotData[i].progress_BUY == 1) {

                ctx.fillStyle = "lime";
                ctx.font = '900 16px "Font Awesome 6 Free"';
                ctx.fillText('\uf0a6', x-4, yScale(plotData[i].low) + 26);

                ctx.fillStyle = "lime";
                ctx.font = "10px Arial";                
                ctx.fillText('BUY', x-6, yScale(plotData[i].low) + 42);

                ctx.fillStyle = 'lime';                
          //      ctx.fillRect(x - offset, y, candleWidth, height);

            };
            if (plotData[i].progress_SELL == 1) {
               
                ctx.fillStyle = "red";
                ctx.font = '900 16px "Font Awesome 6 Free"';                
                ctx.fillText('\uf0a7', x-4, yScale(plotData[i].high) - 26);

                ctx.fillStyle = "red";
                ctx.font = "10px Arial";                      
                ctx.fillText('SELL', x-10, yScale(plotData[i].high) - 47);

                ctx.fillStyle = 'red';                
          //      ctx.fillRect(x - offset, y, candleWidth, height);
            };

            if (plotData[i].progress_EXIT_BUY == 1) {
           
                ctx.fillStyle = bearcolor;
                ctx.font = '900 16px "Font Awesome 6 Free"';
                ctx.fillText('\uf0a7', x-4, yScale(plotData[i].high) - 26);

                ctx.fillStyle = bearcolor;
                ctx.font = "10px Arial";                
                ctx.fillText('EXIT_BUY', x-20, yScale(plotData[i].high) - 47);

                ctx.fillStyle = bearcolor;                
            //    ctx.fillRect(x - offset, y, candleWidth, height);
                  
            };


            if (plotData[i].progress_EXIT_SELL == 1) {
                  
                ctx.fillStyle = bullcolor;
                ctx.font = '900 16px "Font Awesome 6 Free"';                
                ctx.fillText('\uf0a6', x-4, yScale(plotData[i].low) + 26);

                ctx.fillStyle = bullcolor;
                ctx.font = "10px Arial";                      
                ctx.fillText('EXIT_SELL', x-20, yScale(plotData[i].low) + 42);

                ctx.fillStyle = bullcolor;
          //      ctx.fillRect(x - offset, y, candleWidth, height);
            };

            ctx.closePath();
        }
    }
}

var Draw_AB = function (symbolcanvas, ctx, props, xAccessor, xScale, yScale, plotData) {
    var widthRatio = (props.widthRatio) ? props.widthRatio : 1;
    var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));
    
    var cw = width / (plotData.length - 1) * widthRatio;
    
    var candleWidth = Math.round(cw);
    
    var offset = candleWidth === 1 ? 0 : 0.5 * cw;
    

    for (var i = 0; i < plotData.length; i++) {
        if (plotData[i].americanbull_BUY == 1 || plotData[i].americanbull_SELL == 1 || plotData[i].americanbull_SHORT == 1) {
            
            var x = Math.round(xScale(xAccessor(plotData[i])) - 0);
            
            var y = yScale(Math.max(plotData[i].open, plotData[i].close));
            var height = Math.abs(yScale(plotData[i].open) - yScale(plotData[i].close));
            var bullcolor = theme_bull; 
            var bearcolor = theme_bear; 
            ctx.beginPath();
            if (plotData[i].americanbull_BUY == 1) {

                ctx.fillStyle = "lime";
                ctx.font = '900 16px "Font Awesome 6 Free"';
                ctx.fillText('\uf0a6', x-4, yScale(plotData[i].low) + 26);

                ctx.fillStyle = "lime";
                ctx.font = "10px Arial";                
                ctx.fillText('BUY', x-6, yScale(plotData[i].low) + 42);

                ctx.fillStyle = 'lime';                
          //      ctx.fillRect(x - offset, y, candleWidth, height);

            };
            if (plotData[i].americanbull_SELL == 1) {
               
                ctx.fillStyle = "red";
                ctx.font = '900 16px "Font Awesome 6 Free"';                
                ctx.fillText('\uf0a7', x-4, yScale(plotData[i].high) - 26);

                ctx.fillStyle = "red";
                ctx.font = "10px Arial";                      
                ctx.fillText('SELL', x-10, yScale(plotData[i].high) - 47);

                ctx.fillStyle = 'red';                
          //      ctx.fillRect(x - offset, y, candleWidth, height);
            };

            if (plotData[i].americanbull_SHORT == 1) {
           
                ctx.fillStyle = "red";
                ctx.font = '900 16px "Font Awesome 6 Free"';                
                ctx.fillText('\uf0a7', x-4, yScale(plotData[i].high) - 26);

                ctx.fillStyle = "red";
                ctx.font = "10px Arial";                      
                ctx.fillText('SHORT', x-10, yScale(plotData[i].high) - 47);

                ctx.fillStyle = 'red';                
          //      ctx.fillRect(x - offset, y, candleWidth, height);
                  
            };
            ctx.closePath();
        }
    }
}

function RemoveChartIndicator(symbolcanvas, selection) {
    switch (selection) {
        case "-1":
            symbolcanvas.Indicators = [];
            symbolcanvas.CurrentSymbol.SelectedContracts = [];
            symbolcanvas.SetPivot(symbolcanvas, symbolcanvas.Pivot);
            DrawChart();    
            break;
        }
}

function MarkersPanel (chartid, nbr) {
    var content = ''; 
    
    for (var i = 0; i < nbr; i++) {
        content +=   
        '<div class="progress" id= "progress_' + chartid + '">' + 
        '   <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" id="progress-bar' + i + '" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">' +
        '   </div>' + 
        '</div>';
    }
    return content;
}

function  MarkersPanel_Update (marker, complete, color) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    var chartid = symbolcanvas.ID;
    
    if (color)  {
        $('#progress_' + chartid + ' #progress-bar' + marker.Id).css ("background-color",  color);  
    } else {
        $('#progress_' + chartid + ' #progress-bar' + marker.Id).css ("width", complete + '%');  
    }
}
