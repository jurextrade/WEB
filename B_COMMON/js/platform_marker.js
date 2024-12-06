var markercontext;
var markerStartAsync;

//---------------------------------------------------------------- NARKER entry point ---------------------------------------------------------- 

function CreateMarker (name, content, type) {

    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;  
    
    let marker = symbolcanvas.PG.GetMarkerFromName(name);

    if (marker) {
        ClearMarkers(marker);         
        marker.Reset(symbolcanvas.CurrentSymbol, content);
    } else {
        marker          = new pgmarker(symbolcanvas.PG,  name, content);
        marker.Symbol   = symbolcanvas.CurrentSymbol;
        marker.Type     = type;
        symbolcanvas.PG.Markers.push (marker);
    }
    if (!symbolcanvas.GetMarker (marker.Name)) {
        marker.Id       = symbolcanvas.MarkerNbr;    
        MarkerColors[marker.Id] = '#' + Math.floor(Math.random()*16777215).toString(16);            
        symbolcanvas.MarkerNbr == 3 ? symbolcanvas.MarkerNbr = 0 : symbolcanvas.MarkerNbr++;        
        symbolcanvas.AddMarker (marker.Name);          
    }

    return marker;
}

var Marker_init = function(marker, symbol) {
    
    MarkersPanel_Update (marker, 0 , MarkerColors[marker.Id]);     
    
    GMTShift        = GetShiftGMT();
    
    markercontext.Init (symbol, marker.CurrentPeriod, marker.Data)     


    InitMarketInfo(symbol);
    InitRules();
    
    marker.FirstPass = 1;
    marker.SecondPass = 0;
 
    return (0);
}

var Marker_start = function(marker, symbol) {
    
     markercontext.ResetSignals(marker.Indicators, marker.Signals, marker.Periods, marker.iTime(symbol, marker.CurrentPeriod, 0), marker.FirstPass);
     ResetRules(marker.FirstPass);
     
     for (const i of marker.Periods) {
         MarketMovement(markercontext, marker, i, marker.Data[i], marker.Data[i].length - 1, marker.FirstPass);
     }
     
     if (marker.SecondPass == 1) {
         var result = 0;
         try {
                eval('result = markercontext.' + marker.Name + ' ()')
                eval ('symbol.chartData[marker.CurrentPeriod][marker.CurrentBar].' + marker.Name + ' =' + result );
         } catch (error) {
             Marker_Stop(marker);            
             Project_ParseError(error.message, -2);
             return;
         }
     }
      for (const i of marker.Periods) {
         markercontext.SetTime(marker.iTime(symbol, i, 0), i)
     }
 
 
     if (marker.FirstPass === 1) {
        marker.SecondPass = 1;
        marker.FirstPass = 0;
     }

     return 0;
}


var Marker_Run = function (marker) {
    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;    

    let symbol = symbolcanvas.CurrentSymbol;
    let period = symbolcanvas.CurrentPeriod;

    Marker_Stop ();
    
    MarkerEditor_Update(marker)
    
    try {
        solution.PL.ParseMarker(marker);        
    } catch (error) {
        Marker_ParseError(error.message, error.hash);      
        return;      
    }


    GenerateJSMarker(marker)

    window.eval(GenerateJSObjects(marker) +
                GenerateVariables(JS_GENERATION, GLOBAL_VARIABLE))


    if (marker.MinPeriod == null) {
        marker.MinPeriod = marker.MaxPeriod = period;
        marker.Periods.push(period);            
    } else {
        if (marker.MinPeriod > period) {
            marker.MinPeriod = period;
            marker.Periods.push(period);             
        }
    }     

    marker.CurrentPeriod = marker.MinPeriod;
    
    var terminal = solution.GetCurrentTerminal();
    if (!terminal) return;

    if (terminal == solution.CurrentProject) {
        ProjectSelectPeriod(solution.CurrentProject, symbol, marker.CurrentPeriod, true);
    }
    else
    if (terminal == solution.CurrentOptionTerminal) {
        OptionSelectPeriod(solution.CurrentOptionTerminal, symbol, marker.CurrentPeriod, true);
    } else {
        Symbol_Select(solution.CurrentTerminal, symbol, marker.CurrentPeriod, true, true);      
    }
    let all = Marker_ChartType('complete_marker') == true ? 1 : 0;
    markerStartAsync = setInterval(FindIdxStartBar, 1, marker, symbol, marker.CurrentPeriod, marker.MaxPeriod, MARKER_CONTEXT, all);
    return marker;
}

var Marker_Start = function(marker, symbol, period, startbar, endbar) {
    
    markercontext = new ExpertContext(marker.Name, marker.JSContent);

    
    marker.StartBar     = startbar; 
    marker.CurrentBar   = marker.StartBar
    marker.EndBar       = endbar  

    for (var i = 0; i < marker.Periods.length; i++) {
        marker.Data[marker.Periods[i]] = [];
    }
    for (var i = 0; i < marker.CurrentBar; i++) {
        marker.Data[period].push(Object.assign({}, symbol.chartData[period][i]));
    }

    Marker_init(marker, symbol);
    markerStartAsync = setInterval(MarkerAsync_Start, 1, markercontext, marker, symbol);
}


var MarkerAsync_Start = function(context, marker, symbol) {

    if (!marker) return;

    if (marker.CurrentBar == marker.EndBar + 1) {
        complete = 100;
        MarkersPanel_Update (marker, 100);        
        Marker_Stop(marker);
        return;
    }
    var bar  = symbol.chartData[marker.CurrentPeriod][marker.CurrentBar];
    var pbar = symbol.chartData[marker.CurrentPeriod][marker.CurrentBar-1];

    var date  = bar.date;
    var pdate = pbar.date;
    var complete =  Math.round ((marker.CurrentBar -  marker.StartBar) / (marker.EndBar -  marker.StartBar) * 100);
    
    MarkersPanel_Update (marker, complete);   
    
    
    for (const i of marker.Periods) {
        if (marker.FirstPass) {
            InsertBar(context, bar, i, marker.Data);
        } else {
            switch (+i) {
                case P_M1:
                    if (date.getMinutes() % 1 == 0) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_M5:
                    if (date.getMinutes() % 5 == 0) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_M15:
                    if (date.getMinutes() % 15 == 0) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_M30:
                    if (date.getMinutes() % 30 == 0) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_H1:
                    if (pdate.getHours() != date.getHours()) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_H4:
                    if (date.getHours() % 4 == 0) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_D1:
                    if (pdate.getDay() != date.getDay()) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_W1:
                    if (pdate.getWeek() != date.getWeek()) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
                case P_MN:
                    if (pdate.getMonth() != date.getMonth()) {
                        InsertBar(context, bar, i, marker.Data);
                    }
                break;
            }
        }
    }
    var nowbar = marker.Data[marker.CurrentPeriod][marker.Data[marker.CurrentPeriod].length - 1];
   
    for (const i of marker.Periods) {
        var copybar = marker.Data[i][marker.Data[i].length - 1];
        context.SetClose(nowbar.close, i);
        context.SetHigh(Math.max(context.GetHigh(i), nowbar.high), i);
        context.SetLow(Math.min(context.GetLow(i), nowbar.low), i)
    }

    Bid = nowbar.close;
    Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);
    Marker_start(marker, symbol);
    nowbar.high = bar.high
    nowbar.close = bar.high

    context.SetHigh(nowbar.high, marker.CurrentPeriod) 
    context.SetClose(nowbar.close, marker.CurrentPeriod) 
   
    for (const i of marker.Periods) {
        var copybar = marker.Data[i][marker.Data[i].length - 1];
        copybar.high = Math.max(context.GetHigh(i), nowbar.high);
        copybar.close = nowbar.close
        context.SetHigh(copybar.high, i)
        context.SetClose(copybar.close, i);
    }

    Bid = nowbar.close;
    Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);
    Marker_start(marker, symbol);
    nowbar.low = bar.low;    
    nowbar.close = bar.low;    
    context.SetLow(nowbar.low, marker.CurrentPeriod)
    context.SetClose(nowbar.close, marker.CurrentPeriod)
    
    for (const i of marker.Periods) {
        var copybar = marker.Data[i][marker.Data[i].length - 1];
        copybar.low = Math.min(context.GetLow(i), nowbar.low);      
        copybar.close = nowbar.close;          
        context.SetLow(copybar.low, i)
        context.SetClose(copybar.close, i)
    }

    Bid = nowbar.close;
    Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);
    Marker_start(marker, symbol);
    nowbar.close = bar.close;

    context.SetClose(nowbar.close, marker.CurrentPeriod) 
    
    for (const i of marker.Periods) {
        var copybar = marker.Data[i][marker.Data[i].length - 1];
        copybar.close = nowbar.close        
        context.SetClose(copybar.close, i);
    }

    Bid = nowbar.close;
    Ask = NormalizeDouble(Bid + SYS_SPREAD, SYS_DIGITS);
    Marker_start(marker, symbol);
   
    marker.CurrentBar++;
}

var Marker_Stop = function(marker) {

    clearInterval(markerStartAsync);
    DrawChart ();  // Display markers
}

function marker_update (signaltype, onclick) {

    var onitemclick = 'onclick_pickermarker(this)';
    if (defined (onclick)) {
        onitemclick = onclick;
    }
    var content = '';
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }
 
     for (var i = 0; i < PG.Markers.length; i++) {
         var marker = PG.Markers[i];
         content += '<li class="Marker" onclick="' + onitemclick + '"><a ><label>' +  PG.Markers[i].Name + '</label></a></li>';     
     }

     $('.PickerSubValuesPanel').css ("display", 'none');  
 
     $('.PickerValues').html (content);
     $('.RuleTitles .Items').removeClass('active');    
     $('.RuleTitles .Markers').addClass('active');    
     $('.PickerValuesPanel').css ("display", 'flex');  

     filterFunction (document.getElementById('ValuesSearch'), null, 1);
 }

 function onclick_selectMarker (elt, event) {
    event.stopPropagation();

    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    let markername  = $(elt).find('label').html();
    let editorelt   = $(elt).closest ('.markereditor');

    let marketpanel = 'market';
  //  $('#markereditor_' + platform.pname + ' #name_marker').val(markername); 

    $('#markereditor_' + marketpanel + ' #name_marker').val(markername);   
    let inputeditor = GetEditorFromId('markereditor_input_' + marketpanel);                   
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }
    let marker = PG.GetMarkerFromName (markername)
    if (!marker) {
        return;
    }
    tools_panel_select();    
    inputeditor.setValue(marker.SCContent)
    $(elt).closest('.sb_overlay').remove();
}

function openPopupPickerMarker (elt, event, rootid) {

    var markername = '';
    var signalname = '';
    var signaltype = "Numeric"; //"Numeric"

    let PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }
    if (PG.Markers.length == 0) {
        return;
    }
            
   sb.overlay({
        rootelt: rootid ? $('#' + rootid) : $(elt).closest('.sb_root'),
        event: event,            
        pageX: event.pageX,
        pageY: event.pageY,
        clickinside:true,
        onshow:  function () {
            if (markername != undefined) {
                marker_update (signaltype, 'onclick_selectMarker(this, event)');

            }
        },        
        html: PickerPanel('Marker')
    });    	
}

function onclick_markers (elt, event) {
    openPopupPickerMarker(elt, event, 'marketpanel');
}

function onclick_clearmarkers(elt, event) {
    ClearMarkers();
}

function input_getcontent (input) {
    let selected = input.getSelection();
    if (selected == '') {
        selected = input.getValue()
    }
    return selected;
}

function input_oneval (input, output) {
    if (!output) return;
    input_eval (input_getcontent (input), output);    
}

function markereditor_resize() {
    if (markereditor_market) {
        markereditor_market.resize();
    }
}

function onclick_radiomarker(elt, event) {

}

function onclick_markereditor_group (elt, event) {
    let editorelt    = $(elt).closest ('.markereditor');
    let aceeditors   = editorelt.find ('.aceeditor') 
    let inputelt     = editorelt.find ('.markereditor_input') 
    let outputelt    = editorelt.find ('.markereditor_output') 

    let inputeditor  = GetEditorFromId(inputelt.attr('id'));
    let outputeditor = GetEditorFromId(outputelt.attr('id'));    
    

    
    switch (elt.id) {
        case 'export_marker':
            let name =  $('#' + editorelt[0].id + ' #name_marker').val();

            saveAs_LocalFile ('text/scscript', '(defun ' + name  + ' ()\n' + inputeditor.getValue() + '\n)')
        break;      
        case 'upload_marker':
            read_LocalFile('text/scscript', function (file, content, container) {
                let PG = solution.GetPGFromTerminal ();
                if (!PG) {
                    return;
                }                
                let no_defun = true;
                solution.PL.Parse (PG, content);
                for (var i = 0; i < solution.PL.ListSections.length; i++) {
                    let sccontent =  solution.PL.SCFromSection(solution.PL.ListSections[i], no_defun);  
                    sccontent = js_beautify(sccontent,  {
                                        indent_size: 4,
                                        brace_style: 'collapse',
                                        max_preserve_newlines: -1
                                    });
                    $('#' + editorelt[0].id + ' #name_marker').val(solution.PL.ListSections[i].Name);                
                    container.setValue(sccontent)
                }
            }, inputeditor);
        break;     
        case 'eval_marker':
        
          let markername = $('#' + editorelt[0].id + ' #name_marker').val();      
          if (markername == '') {
            return;
          }        
          input_eval (markername, input_getcontent (inputeditor), outputeditor);   
//MARKET
//          tools_panel_remove();          

        break;              
    }
}

function input_eval (markername, jscontent, output) {
    Marker_Run (CreateMarker (markername, jscontent, 'Numeric'));        
}

function Marker_ParseError  (str, hash) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }  
    
    let markereditor = null;
    markereditor = markereditor_market;     
/*
    if (platform) {
        switch (platform.pname) {
            case 'option':
                markereditor = markereditor_option;        
            break;
            case 'home':
                markereditor = markereditor_home;        
            break;
            case 'tradedesk':
                markereditor = markereditor_tradedesk;
            break;
            case 'project':
                markereditor = markereditor_project;        
            break;                     
        }
    }     
    */
    var textarea = "\n";

    var textarea = "";
    var linenumber;
    
    if (hash == -1) { // no error
        return;
    }
    if (hash == -2) { // simulator error

        markereditor.output.setValue(str, 1);
        return;
    }
    if (hash == -1000) {
        markereditor.output.setValue("");
        return;
    }
    if (hash) {                                                //parser error
        let location = hash.loc;
        let first_column = location.first_column;
        let last_column  = location.last_column;
        let first_line   = location.first_line - 1;
        let last_line    = location.last_line - 1;

        markereditor.input.addMarker(first_line, first_column, last_line, last_column);

        linenumber = hash.line ;
        var colnumber = str = "[line :" + linenumber + "] Error (" + hash.loc.last_column + ") str (Parse ERROR)";
    } else {
        linenumber = str[1] + 1;
        str = (str[1].Name ? str[1].Name + ': ' : '')  + "line [" + linenumber + "] " + str[0];
    }
    markereditor.output.setValue(str, 1);
}

function MarkerEditor_Update (marker) {
    
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    
    let markereditor = null;
    markereditor = markereditor_market;    
/*    
    if (platform) {
        switch (platform.pname) {
            case 'option':
                markereditor = markereditor_option;        
            break;
            case 'home':
                markereditor = markereditor_home;        
            break;
            case 'tradedesk':
                markereditor = markereditor_tradedesk;
            break;
            case 'project':
                markereditor = markereditor_project;        
            break;                     
        }
    }      
*/    
    if (markereditor) {
        markereditor.input.removeAllMarkers ();        
        $('#markereditor_' + markereditor.id + ' #name_marker').val(marker.Name);                
        markereditor.input.setValue (marker.SCContent);    
        markereditor.output.setValue ('');   
    }       
}

function Marker_ChartType (id) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    
    let markereditor = null;
    markereditor = markereditor_market;    
/*    
    if (platform) {
        switch (platform.pname) {
            case 'option':
                markereditor = markereditor_option;        
            break;
            case 'home':
                markereditor = markereditor_home;        
            break;
            case 'tradedesk':
                markereditor = markereditor_tradedesk;
            break;
            case 'project':
                markereditor = markereditor_project;        
            break;                     
        }
    }
*/      
     return $('#markereditor_' + markereditor.id + ' #' + id + '_' +  markereditor.id).prop('checked')       
}

class MarkerEditor {
    constructor (id) {
        this.id = id;        
        this.input_init ('markereditor_input_' + id) 
        this.output_init('markereditor_output_' + id)   
    }    

    onexport () {
        saveAs_LocalFile ('text/sccript', this.input.getValue())
    }

    onupload () {
        read_LocalFile('text/scscript', function (file, content, container) {
            let filename = file.name.split('.')[0];
            $('#name_marker').val(filename);
            container.setValue(content)
        }, this.input);
    }

    oneval () {
        this.input_oneval();
    }
    
    resize () {
        this.input.resize();
        this.output.resize();
    }
    
    update () {
        this.input_update ();
        this.output_update ();    
    }

    select () {
        this.input_select () 
    }

    input_init (id) {
        this.input = new aceeditor(id,  "ace/theme/sc_on_dark", "ace/mode/lisp");      
        this.input.setOptions( {
            useSoftTabs: true,
            showPrintMargin: false
        });    
        this.input.addCommand({
            name: 'evalJS',
            bindKey: {
                win: 'Alt-E',
                mac: 'Alt-E',
                sender: 'editor|cli'
            },
            exec: (editor) => {
                this.input_oneval(this.input, this.output);
              }
            });
            this.input.setValue ('');                
    }
    input_getcontent (input) {
        let selected = input.getSelection();
        if (selected == '') {
            selected = input.getValue()
        }
        return selected;
    }
    
    input_update () {
       this.input.setMode();       
    }

    input_select () {
    }

    output_init (id) {
        this.output = new aceeditor(id, "ace/theme/sc_on_dark", "ace/mode/jsx");      
        this.output .setOptions( {
            readOnly: true,        
            useSoftTabs: true,
            showPrintMargin: false
        });    

        this.output .addCommand({
            name: 'clearJS',
            bindKey: {
                win: 'Alt-C',
                mac: 'Alt-C',
                sender: 'editor|cli'
            },
            exec: (editor) => {
                this.output_clear();
              }
            });
            this.output.setValue ('');            
    }
    output_clear () {
        this.output.setValue('');  
    }
    output_update () {
        this.output.setMode();              
    }
}



var ClearMarkers = function (marker) {
    
    let container;

    let symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;   

    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }   
    
    let panelid         = $('#' + platform.id + ' .trackerpanel').attr('id');    

    let chartid = symbolcanvas.ID;
    let symbol  = symbolcanvas.CurrentSymbol;
    let period  = symbolcanvas.CurrentPeriod;    
    
    if (solution.get('ui').currentplatform_pname == TRADEDESK_PLATFORM_PNAME) {
        container = CurrentTContainer;
    } else {
        container = CurrentContainer;
    }
  
    if (!marker) {
 
        Marker_Stop ();
                    
        for (var j = 0; j < symbolcanvas.Markers.length; j++) {
            let markername  = symbolcanvas.Markers[j];
            let marker      = symbolcanvas.PG.GetMarkerFromName (markername)
           
            if (!marker || marker.CurrentPeriod == null) {
                continue;
            }
           
            let length = symbol.chartData[marker.CurrentPeriod].length;
            for (var i = 0; i < length; i++) {            
                eval('symbol.chartData[marker.CurrentPeriod][i].' + markername + ' = 0');
            }
        } 

        symbolcanvas.MarkerNbr = 0;
        symbolcanvas.Markers= [];

        $('#' + panelid +' td:nth-child(1)').css('color', '')
        $('#' + panelid +' td:nth-child(1)').css('background', '')
        
        $('#progress_' + chartid + ' .progress-bar').css ("width", '0%');  
        if (container) { 
            container.GSE.ClearMarkers("RULES");
        }



    } else {
        if (marker.CurrentPeriod == null) {
            return;
        }
        for (var i = 0; i < symbol.chartData[marker.CurrentPeriod].length; i++) {
            symbol.chartData[marker.CurrentPeriod][i][marker.Name] = 0;            
        }
        MarkersPanel_Update (marker, 0); 
    }

    DrawChart();
    if (container) { 
        container.Refresh();
    }
}

function onclick_marker_delete(elt, event) {

}

function onclick_marker_update(elt, event) {

}

function onclick_marker_cancel(elt, event) {

}

function onclick_marker_modify(elt, event) {
    
}