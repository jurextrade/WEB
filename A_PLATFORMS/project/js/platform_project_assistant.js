var explanationtab = [];
var explanationtab1 = [];

//----------------------------------------------------ASSISTANT STEPS------------------------------------------------

var STEP_PROJECTSELECTION   = 0;
var STEP_STRATEGYNAME       = 1;
var STEP_STRATEGYPROPERTIES = 2;
var STEP_STRATEGYPROFIT     = 3;
var STEP_STRATEGYEXIT       = 4;
var STEP_STRATEGYRULES      = 5;
var STEP_STRATEGYSCHEDULE   = 6;
var STEP_STRATEGYCOMPILE    = 7;

function SwitchStrategyView () {

    if (projectplatform.strategyview == STRATEGY_SIDE_VIEW) {
        projectplatform.strategyview = STRATEGY_TAB_VIEW;
    } else {
        projectplatform.strategyview = STRATEGY_SIDE_VIEW;
    }
    
    $('#strategyfiletab .sb_content #classicviewbox').html(StrategyPanel ());
    RefreshStrategy(CurrentStrategy);
}

function StrategyPanel () {
    var view =  projectplatform.strategyview;
    
    if (!defined (view)) {
        view = STRATEGY_TAB_VIEW;
    }  

    var content =  view == STRATEGY_TAB_VIEW ? sb.render(strategy_classicviewpanel) : sb.render(strategy_sideviewpanel) 

    return content;                             
}

function movehtml (fromid, toid) {
    var content = $("#" + fromid).html(); 
    $("#" + fromid).html(''); 
    $("#" + toid).html(content); 
}


function onclick_assistantmode (elt) {
    if ($(elt).hasClass("checked"))   {
        projectplatform.strategyview = STRATEGY_TAB_VIEW        
    }
    else {
        projectplatform.strategyview = STRATEGY_ASSISTANT_VIEW        
    }

    project_assistant_select (projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW);
}


function project_assistant_select (assistant) {
    console.log ('projectASSISTANT')
    let quilleditor = assistant ? '#assistantquillpanel' : '#strategyquillpanel';    
    
    if (assistant)  {
        $("#strategy_assistant_button").addClass("checked");
        $("#strategy_assistant_button").html('<label class="sb_label">Switch to Classic View</label>');
        $('#strategy_assistant_button').prop('title', 'Switch to Classic View'); 
        $('#classicviewbox').css ('display', 'none'); 
        $('#assistantviewbox').css ('display', 'flex'); 
       
        let fileeditor = $("#strategyfilepanel");
        fileeditor.appendTo("#assistant_fileppanel");


        let editor = $("#strategyquillpanel .ql-editor");
        let toolbar = $("#strategydescriptionpanel .ql-toolbar");
        editor.appendTo("#assistantquillpanel"); 
        toolbar.prependTo("#assistantdescriptionpanel"); 

    }
    else {
        $("#strategy_assistant_button").removeClass("checked")
        $("#strategy_assistant_button").html('<label class="sb_label">Switch to Assistant View</label>');
        $('#strategy_assistant_button').prop('title', 'Switch to Assistant View');         
        $('#classicviewbox').css ('display', 'flex'); 
        $('#assistantviewbox').css ('display', 'none'); 

        let fileeditor = $("#strategyfilepanel");
        fileeditor.appendTo("#role_tab_strategyfile");

   
        let editor = $("#assistantquillpanel .ql-editor");
        let toolbar = $("#assistantdescriptionpanel .ql-toolbar");
        editor.appendTo("#strategyquillpanel"); 
        toolbar.prependTo("#strategydescriptionpanel");    

    }
}


function project_assistant_panel (strategy) {
    var strategyname = "";
    if (strategy) {
        strategyname = strategy.Name;    
    }
    var colsize   = 4;
    var inputsize = 8;
    var labelsize = 4;
    var content = 
//        sb.render (assistantbar) +
    '   <form  id="strategy_assistant_panel" class="assistant_panel">' +

//    '       <div><div> <a class="carousel-control-prev sb_right" href="#previous" role="button" data-slide="prev" style="display:none"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a></div></div>' +    
//    '       <div><div> <a class="carousel-control-next sb_left" href="#next"  role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div></div>' +    
    '       <h3>Project / Strategy</h3>' + 
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel(STEP_PROJECTSELECTION) +
    '               </div>' + 
    '               <div class="sb_column col-8">' +
    '                   <section class="section">' +
    '                       <div class="container-fluid">'+
    '                           <div class="sb_row">' +
    '                               <div class="col-md-12 middle-left-area" id="">' +     
    '                                   <div class="">' +
    '                                          <div class="no-padding" style="display:none" id= "strategy_assistant_video_panel">' +
    '                                               <iframe width="100%" height="100%" src="https://www.youtube.com/embed/03Lg83VcXUU"></iframe>' +
    '                                          </div>' + // body
    '                                   </div>' +
    '                               </div>' +
    '                           </div>' +
    '                       </div>' +
    '                   </section>' +    
    '                   <div id="projectpanelcontainer">' +
                            StrategyCreatorProjectPanel('') +
                            StrategyCreatorStrategyPanel() +
    '                   </div>' +    
    '                   <div class="popup_buttons sb_row">'+      
                            StrategyCreatorElementsPanel () +                                        
    '                   </div>' +
    '               </div>' +    
    '           </div>' +    
    '       </section>' + 
    '       <h3>Description</h3>' + 
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYNAME) +     
    '               </div>' +
    '               <div class="sb_column col-8">' +
    '                   <div id="strategy_assistant_generaldescripion" class="sb_column" >' + 
    '                       <label class="sb_widget-title"> General description</label>' +
                            StrategyAssistantStrategyName (strategy) +   
    '                       <div class="sb_formgroup" >' +
    '                           <label>Indicators</label>' +    
                                sb.render({id: 'indicators',        item: 'Existing Indicators',  type: 'button', class: 'sb_mbutton', icon: icon_sort, 
                                            events: {onclick: 'openPopupPickerIndicator(event, undefined, undefined, \'onclick_selectindicator(this, event);IndicatorSelect(this,event)\')'},   title: 'Add Existing Indicator to Chart'}) +
                                StrategyAssistantIndicators () +
    '                       </div>' +
    '                       <div class="sb_formgroup">' +
    '                           <label></label>' +    
    '                           <div id="strategy_assistant_addedindicators"></div>' +       
    '                       </div>' +  
    '                       <label class="sb_widget-title">Description</label>' +    
    '                       <div class="sb_formgroup sb_pane">' +
                                sb.render (assistantdescriptionpanel) +
    '                       </div>' +                                 
    '                   </div>' +
    '               </div>' +    
    '           </div>' +    
    '       </section>' +    
    '       <h3>Buy/Sell Properties</h3>' +
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYPROPERTIES) +     
    '               </div>' +
    '               <div class="col-8">' +
    '                   <div class="sb_widget">' + 
                            Init_strategypropertiesfield ('Specification', 'B_MAXCOUNT', 'B_ORDERTYPE') +     
                            Init_strategypropertiesfield ('Lots Size', 'B_ILOT', 'B_MAXLOT') +     
                            Init_strategypropertiesfield ('Recovery', 'B_RECOVERYMODE', 'B_RECOVERYVALUE') +     
    '                   </div>' +
    '                   <div class="sb_widget">' + 
                            Init_strategypropertiesfield ('Strategy Type', 'B_OPERATION', 'B_ONEORDERPERBAR') +      
                            Init_strategypropertiesfield ('Grid Trading', 'B_DIRECTION', 'B_DIRECTIONTYPE') +     
                            Init_strategypropertiesfield ('Trade Steps', 'B_PIPSTEP', 'B_TIMESTEP') +     
    '                   </div>' +
    '                   <div class="sb_widget">' + 
                            Init_strategypropertiesfield ('Hedging', 'B_HEDGEMAGNITUDE') +    
    '                   </div>' +
    '               </div>' +      
    '           </div>' +
    '       </section>' +
    '       <h3>Profit SL/TP</h3>' +
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYPROFIT) +     
    '               </div>' +
    '               <div class="col-8">' +
    '                   <div class="sb_widget">' +     
    '                       <label class="sb_widget-title"> Orders Profit/Loss <i>*in Pips*</i></label>' +    
    '                       <div class="sb_column" id = "stragegy_assistant_second_row">' +     
                                Init_strategypropertiesfields(1) +
    '                       </div>' +       
    '                       <label class="sb_widget-title"> Expert Global Profit/Loss <i>*in Account Currency</i></label>' +
    '                       <div class="sb_column" id = "stragegy_assistant_first_row">' +     
                                Init_strategypropertiesfields(2) +
    '                       </div>' +    
    '                   </div>' +    
    '               </div>' +     
    '           </div>' +        
    '       </section>' +    
    '       <h3>Exit Properties</h3>' +
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYEXIT) +     
    '               </div>' +
    '               <div class="col-8">' +
    '                   <div class="sb_widget">' + 
    '                       <label class="sb_widget-title"> Minimum Profit Exit the Strategy Actions : (EXIT) (EXIT_BUY) (EXIT_SELL)</label>' +     
                            Init_strategypropertiesfields(3) +
                            Init_strategypropertiesfields(4) +  
    '                   </div>' +
    '               </div>' +     
    '           </div>' +     
    '       </section>' +
    '       <h3>Actions</h3>' +
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYRULES) +     
    '               </div>' +
    '               <div id = "assistant_fileppanel", class="col-8">' +
                  //      TableRulePanel () +
                       // sb.render (strategyfilepanel) +
    '               </div>' +     
    '           </div>' +     
    '       </section>' +
    '       <h3>Schedule</h3>' +
    '       <section>' +
    '           <div class="sb_row">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYSCHEDULE) +     
    '               </div>' +
    '               <div class="col-8">' +
    '                   <div class="sb_widget">' +  
    '                       <label class="sb_widget-title">Schedule</label>' +
    '                       <div id= "strategyschedulepanel" class="sb_column">' + 
                                StrategyAssistantSchedulePanel() +
    '                       </div>' +   
    '                       <div id= "strategyschedulepanel" class="sb_column">' + 
                                StrategyAssistantSchedulePropertyPanel () +
    '                       </div>' +   
    '                   </div>' +         
    '               </div>' +     
    '           </div>' +       
    '       </section>' +
    '       <h3>Generate MQ4 Expert</h3>' +
    '       <section class="sb_column">' + 
    '           <div class="sb_row sb_main">' +
    '               <div class="card col-4 sb_right">' +
                        StrategyAssistantGuidePanel (STEP_STRATEGYCOMPILE) +     
    '               </div>' +
    '               <div class="col-8">' +
    '                   <div class="sb_row">'+      
                            StrategyCreatorCElementsPanel () +                                        
    '                   </div>' +
    '                   <div class="sb_row">'+   
                            StrategyCreatorCompilePanel() +
    '                   </div>' +        
    '               </div>' +     
    '           </div>' +       
    '       </section>' +
    '   </form>';
    return content;
}


function project_assistant_init() {

    var form = $("#strategy_assistant_panel").show();    

    form.steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        enableAllSteps : true,
        enableKeyNavigation :true,

        onInit : function (event, currentIndex) {
            $("#strategy_assistant_panel").find(".actions").css ("display", "none");   // DEfault Prev next Buttons of jquery step
        }, 

        onStepChanging: function (event, currentIndex, newIndex) {
            switch (newIndex) {
                case STEP_PROJECTSELECTION :   
                    if (solution.CurrentProject) {     
                        return false;
                    }
            }            

            switch (currentIndex) {
                case STEP_PROJECTSELECTION :
                    if (!solution.CurrentProject) {               
                        DisplayOperation("Please Select a Project or Create one", true, 'operationpanel', 'var(--theme-error-color)');
                        return null;
                    } else
                    if (!CurrentStrategy) {                
                        DisplayOperation("Please Select a Strategy or Create one", true, 'operationpanel', 'var(--theme-error-color)');
                        return null;
                    } else
                     return true;
                break;
                case STEP_STRATEGYNAME :
                break;
                case STEP_STRATEGYPROPERTIES:
                break;
                case STEP_STRATEGYPROFIT :
                break;
                case STEP_STRATEGYEXIT :
                break;
                case STEP_STRATEGYRULES :
                break;
                case STEP_STRATEGYSCHEDULE :   
                    //return StrategyAssistantCheckSchedule();
                break;
                case STEP_STRATEGYCOMPILE :              
                break;                
           }     
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
        },  

        onStepChanged: function (event, currentIndex, priorIndex) {
            $("#strategy_assistant_panel").find(".carousel-control-next").css ("display", "flex")
            $("#strategy_assistant_panel").find(".carousel-control-prev").css ("display", "flex")

//            if (currentIndex != STEP_PROJECTSELECTION && CurrentEngine)
//                StrategyAssistantRefreshGuidePanel(currentIndex, 0, CurrentEngine.GetDescriptionProperties(currentIndex));

            switch (currentIndex) {
                case STEP_PROJECTSELECTION : 
                    $("#strategy_assistant_panel").find(".carousel-control-prev").css ("display", "none");
                break;
                case STEP_STRATEGYNAME : 
                    $('#strategy_assistant_name').focus();
                break;
                case STEP_STRATEGYPROPERTIES : 
                break;
                case STEP_STRATEGYPROFIT : 
                break;
                case STEP_STRATEGYEXIT : 
                break;
                case STEP_STRATEGYRULES : 
                    UpdateActionsRule();                    
                break;
                case STEP_STRATEGYSCHEDULE : 
                break;
                case STEP_STRATEGYCOMPILE :              
                    $("#strategy_assistant_panel").find(".carousel-control-next").css ("display", "none")
                break;                   
            }
        },             
        onFinished: function (event, currentIndex) {
            return;
        },                
     });
     return;
}


//----------------------------------------------------ASSISTANT PANEL------------------------------------------------

function project_assistant_barpanel (){
    var content =     
'    <a id="strategy_assistant_title" class="nav-link active" data-bs-toggle="tab" data-bs-target="#strategyfiletabcontent" type="button" title="" onclick="onclick_StrategyTabItem(this)" aria-selected="true" role="tab">'+
'        <i class="fas fa-chess"></i>'+
'        <span class="sb_label"></span>'+
'    </a>';

    return content;
}


//------------------------------------------------------------ STRATEGY GLOBAL PANEL ----------------------------------------------------------

function onclick_strategyhelper(elt, event) { 
    if (!solution.CurrentProject) {     
        return false;
    }

    if ($('#overlay_strategyhelper').length == 0) {
        $(elt).addClass('checked')
        sb.overlay({
            id: 'overlay_strategyhelper',
            rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
            event: event,            
            pageX: event.pageX,
            pageY: event.pageY + 10,            
            keepopen: true,
            classes: '',
            style:'width:400px;height:500px;background:"red"',

            onshow : function () {
          //      PropertiesEditor.reset();
                RefreshStrategyPropertiesHelper(CurrentEngine);
            },        
            html: TextEditorPanel('propertiesdescription', 'sb_main sb_panel')
        }); 
    }
    else {
        $('#overlay_strategyhelper').remove();
        $(elt).removeClass('checked')

    }
}

function onclick_AssistantViewMQ4Files (elt, event) {
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('pname', 'project');     

    sidebarpanel_select(platform, 'sidebarpanel_files')
}

function onclick_AssistantViewChart (elt, parent) {
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('pname', 'project');     

    BottomPanel_Flat(platform, false, true);
    sb.tab_select(project_bottomtabs, 'tab-chart');        
}

function onclick_AssistantTester (elt, event) {
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('pname', 'project');     

    sidebarpanel_select(platform, 'sidebarpanel_tester')
}

function StrategyAssistantGuidePanel (step) {
    var bodycontent1 = '';
    var bodycontent = '';
    var content = '';

    switch (step) {
        case STEP_PROJECTSELECTION :
        bodycontent = 
        '   <div class="card-body">' +
        '       <div class="card-title">Project Creation</div>' +        
 
        '       <div class="card-text">To create customized Strategies, indicators, or conditions you will need to create a new workspace or open an existing one.<br>' +
        '       The creation of your customized workspace will enable you to run multiple strategies on the same chart.</div>' +
        '       <div class="card-text">You can create many strategies in a project</div>' +
        '       <br><br><br>' +
        '       <li class="card-text">Select the Demo project or Create One</li>' +
        '       <br><br><br>' +
        '   </div>';    

        bodycontent1 = 
        '   <div class="card-body">' +
        '        <div class="card-text">You can test independantly each strategy by generating an MQ4 File for each one.</div>' + 
        '        <div class="card-text">Here you can view the Generated MQ4 Files of your project' +
        '           <button class="assistant_button sb_button noactivate" title="View Generated MQ4 Files" type="button" onclick="onclick_AssistantViewMQ4Files(this, event)">' + 
        '           <i class=icon_mt4expert></i><label class="sb_label">MQ4 Expert Advisors</label></button>'+
        '        </div>' +
        '   </div>';       

            return bodycontent + bodycontent1;
        break;     
        case STEP_STRATEGYNAME :
            bodycontent = 
            '   <div class="card-body">' +   
            '       <div class="card-title">Strategy Initialisation</div>' +  

            '       <div class="card-text">A Strategy is Created with Default Values</div>' + 
            '       <br>' +                 
            '       <div class="card-text">Give the name of your Strategy</div>' +
            '       <br>' +            
            '       <div class="card-text">The Initial Balance is required for local testing. In case you do not precise the size of your orders in the strategy, the lot size is calculated as 2% of your account balance</div>' +
            '       <br>' +                        
            '       <div class="card-text">The Time Frame also is required for local testing, At any time during the creation of your strategy, you can see the behaviour of your strategy on the chart' +
            '       </div>' +
            '        <div class="card-text">Testing your strategy is done in the Tester Panel' +
            '           <button class="assistant_button sb_button noactivate" title="Tester" type="button" onclick="onclick_AssistantTester(this, event)">' + 
            '           <i class="' + icon_play + '"></i><label class="sb_label">Tester</label></button>'+
            '        </div>' +
            '       <br>' +  
            '       <div class="card-text">By default the chart draws the symbol EURUSD from history, you can precise a yahoo ticker in the tester Panel</div>' +
            '       <br>' +            
            '       <div class="card-text">Describe your strategy : Describing your strategy makes a faster realisation</div>' +
            '   </div>';                
            bodycontent1 = 
            '   <div class="card-body">' +               
            '       <div>You can precise Indicators to use in the strategy at any time or here</div>' +
            '       <br>' +             
            '       <div class="card-text">Drag and Drop your indicators on the chart using chart view' +
            '           <button class="assistant_button sb_button noactivate" title="Chart View"  type="button"  onclick="onclick_AssistantViewChart(this, event)">' +
            '           <i class="' + icon_chart + '"></i><label class="sb_label">Chart View</label></button>' +             
            '       </div>' +                    
            '       <div class="card-text">On the chart you can track signals for each indicator added to the chart' +
            '       <button class="assistant_button sb_button noactivate" title="Show Sinals Panel"  type="button" onclick="onclick_signalstutorial(this, event)">' +
            '        <i class="' + icon_signal + '"></i><label class="sb_label">Signals View</label></button></div>' +
            '       <div class="card-text">Double click in the Chart to spot the bar corresponding signals' +
            '           <button class="assistant_button sb_button noactivate" title="Tracker Panel"  type="button" onclick="onclick_trackerstutorial(this, event)">' +
            '           <i class="' + icon_track + '"></i><label class="sb_label">Tracker View</label></button>' +
            '       </div>' +
            '       <div class="card-text">In Tracker you can combine Signals with logical operators And Or and marks it on the chart. You can memorize the result as a condition for reusability</div>' +
            '       <div class="card-text">To see the created conditions' +
            '           <button class="assistant_button sb_button noactivate" title=""  type="button">' +
            '           <i class="' + icon_condition + '"></i><label class="sb_label">Condition View</label></button>' + 
            '       </div>' +
            '   </div>';                                  
            return bodycontent + bodycontent1;                           
        break;     
        case STEP_STRATEGYPROPERTIES :
            bodycontent =               
            '   <div class="card-body">' +
            '       <div class="card-title">Strategy Properties</div>' +        
                    RecoveryPanel(CurrentEngine) + (CurrentEngine ? CurrentEngine.GetDescriptionProperties () : '') +
            '   </div>';                                        
            bodycontent1 = '';

            return bodycontent + bodycontent1;
        break;     
        case STEP_STRATEGYPROFIT :
            bodycontent =   
            '   <div class="card-body">' +
            '       <div class="card-title">Strategy Profit</div>' +                  
            '       <div class="card-text">In this Section you can precise the Stop Loss,Take Profit and Trailing Stop Default Values</div>' +                
            '       <div class="card-text">This can be done on the whole strategy where the value is precised in amount or on each order and in this case it is precised in Pips</div>' +                
            '       <br>' +              
            '       <div class="card-text">For a variable amount like for instance the ATR value, it must be precised in Rules section</div>' +
            '       <br>' +              
            '       <div class="card-text">Check the Profit SL/strategy section in Properties View<button class="assistant_button sb_button noactivate" title=""  type="button"><i class="' + icon_helper + '"></i>Properties View</button></div>' +
            '   </div>';                       
           return bodycontent                      
        break;     
        case STEP_STRATEGYEXIT :
            bodycontent =   
            '   <div class="card-body">' +
            '       <div class="card-title">Strategy Exit Properties</div>' +               
            '       <div class="card-text">The Exit Properties are related to the actions : Exit, Exit Buy and Exit Sell</div>' +                
            '       <div class="card-text">Actions are described in the next section. Exit Action finish the strategy, all trades are closed, Exit Buy close all buy orders, no more buy trades can be performed. Same for Exit Sell</div>' +                
            '       <br>' +  
            '       <div class="card-text">When you precise the minimum profit, the exit action will no longer have any effect unless it has the profit that you precise here</div>' +               
            '   </div>';     
            return bodycontent                             
        break;     
        case STEP_STRATEGYRULES :
            bodycontent =   
            '   <div class="card-body">' +
            '       <div class="card-title">Strategy Actions</div>' +                 
            '       <div class="card-text"></div>' +                
            '       <br>' +  
            '       <div class="card-text">The system trading actions :</div>' +                
            '       <br>' +              
            '       <div class="card-text">Actions used in this strategy</div>' +
            '       <br><br>' +
                    StrategyAssistantActionsPanel() +                
            '   </div>';     
            return bodycontent        
        break;     
        case STEP_STRATEGYSCHEDULE :
            bodycontent =   
            '   <div class="card-body">' +
            '       <div class="card-title">Strategy Rules</div>' +              
            '       <div class="card-text">In this section you precise the starting date of the strategy</div>' +
            '       <div class="card-text">Frequency per Day :</div>' +  
            '       <div class="card-text">Delay :</div>' +  
            '       <div class="card-text">One Launch per Bar :</div>' +  
            '       <div class="card-text">Frequency per Day :</div>' +  
            '       <div class="card-text">Date Format :</div>' +                       
            '   </div>';     
            return bodycontent               
        break;     
        case STEP_STRATEGYCOMPILE :
            bodycontent =   
            '   <div class="card-body">' +
            '       <div class="card-title">Strategy Compilation</div>' +                  
            '       <div class="card-text">Ready to generate an MQ4 Expert of your strategy and test it on you MT4 Platform</div>' +  
            '       <br>' +                        
            '       <div class="card-text">To View the Generated MQ4 File of your strategy<button class="assistant_button sb_button noactivate" title=""  type="button"><i class=icon_mt4expert></i>MQ4 Expert Advisors</button></div>' +
            '   </div>';     
            return bodycontent        
        break;    
    }
}

//----------------------------------------------------ASSISTANT PANEL EVENTS ------------------------------------------------

function StrategyAssistantRefreshPanel (step, number, content) {

    if (step > STEP_STRATEGYNAME)
        $('#strategy_assistant_box_content_' + step + '_' + number + ' .sb_boxbody').html (content);
    
    switch (step) {
        case STEP_PROJECTSELECTION :
            if (!solution.CurrentProject) {
                StrategyAssistantFillProjects();
            } else {
                StrategyAssistantFillStrategies(solution.CurrentProject);
            }
        break;
         case STEP_STRATEGYNAME :
            StrategyAssistantFillIndicators(solution.CurrentProject);
        break;    
    }    
}

function AssistantGoToStep(id, stepnumber) {
    var tablist_item = '#' + id + '-t-';
    $(tablist_item+stepnumber).trigger('click');
}



//----------------------------------------------------  STRATEGY PANEL  1 - CREATE PROJECT------------------------------------------------

function onclick_video (elt) {
    var $videopanel = $('#strategy_assistant_video_panel');

    $videopanel.toggleClass('active').slideToggle("slow");
}

function OnClickProject (elt) {

    if (solution.CurrentProject) {
        OnCloseProject(project_closeproject, solution.CurrentProject);
    } else {  
        var projectname     = $('#newprojectname').val();    
        if (projectname == "") {
             $('#newprojectname').focus().val("");
             return $("#strategy_assistant_panel").valid();
        }
        if (solution.project_GetProjectFromName(projectname)) {
            $('#newprojectname').focus().val("").val(projectname);
            return;
        }   
        NewProject(projectname);
    }
}

function OnClickStrategy (elt) {

    if (CurrentStrategy) {
        OnCloseStrategy(CloseStrategy, CurrentStrategy);
    } else {  
        var strategyname     = $('#newstrategyname').val();    
        if (strategyname == "") {
             $('#newstrategyname').focus().val("");
             return $("#strategy_assistant_panel").valid();
        }
        if (solution.CurrentProject.PG.GetStrategyFromName(strategyname)) {
            $('#newstrategyname').focus().val("").val(strategyname);
            return;
        }   
        OnCloseStrategy(NewStrategy, strategyname, StrategiesMenu[0])
    }
}

function StrategyCreatorElementsPanel () {
    var content = 

    sb_widget_create ('popupnewproject_button',  'OnClickProject(this)', icon_project,  'Create Project', '') +
    sb_widget_create ('popupnewstrategy_button', 'OnClickStrategy(this)', icon_strategy, 'Create Strategy', '') +
    sb_widget_create ('popupvideo_button',       'onclick_video (this)', icon_film, 'Video Tutorial', '') 

    return content;
}	

function onclick_AssistantProjectSelect (elt) {
    
    let selected_option = $('#assistantprojectselected option:selected');   
    let projectname = selected_option.text();
    let project = solution.project_GetProjectFromName(projectname);

    OnCloseStrategy(project_selectproject, project);
}

function StrategyAssistantFillProjects () {
    var projectscontent = '';
    for (var j = 0; j < solution.Projects.length; j++) {
        var project = solution.Projects[j];
        projectscontent += '<option>' + project.Name + '</option>';
    }    
    $('#assistantprojectselected').html(projectscontent);
    $('#assisttantprojectname').val(solution.ProjectFindName());
}

function onclick_AssistantProjectCreate (elt) {
  
    let projectname     = $('#assisttantprojectname').val(); 

    if (projectname == "") {
         $('#assisttantprojectname').focus().val("");
         return null;
    }
    if (solution.project_GetProjectFromName(projectname)) {
        $('#assisttantprojectname').focus().val("").val(projectname);
        return null;
    }   
    NewProject(projectname);

//;;;;;;;;;;;;

    let strategyname = solution.CurrentProject.PG.StrategyFindName(StrategiesMenu[0])
    OnCloseStrategy(NewStrategy, strategyname, StrategiesMenu[0]);    
    AssistantGoToStep ('strategy_assistant_panel', STEP_STRATEGYNAME);
}

function StrategyCreatorProjectPanel (name) {
    var content =    
'   <div id="popupnewproject"  class="sb_column">'+    
'       <label>Project</label>' +
'       <div class="sb_formgroup">'+  
'           <div class="input-group mb-3">'+       
'              <button id = "projectcreator_createbutton" type="button" class="sb_buttonprepend sb_mbutton" onclick="onclick_AssistantProjectCreate(this)">Create</button> ' +
'              <input type="text" id="assisttantprojectname" name="' + name + '" class="required form-control"  value="' + name + '" autocomplete="off" onchange="onchange_default_sb_item(this)" onkeypress="return CheckChar(event)" autofocus>'+
'           </div>'+ 
'       </div>'+ 
'       <div class="sb_formgroup">'+  
'           <div class="input-group mb-3">'+       
'              <button id="projectcreator_selectbutton" class="sb_buttonprepend sb_mbutton" type="button" onclick="onclick_AssistantProjectSelect (this)" onmouseover= "$(\'#wrapper.toggled-2 #sidebar-wrapper\').css(\'width\', \'320px\');" onmouseout="$(\'#wrapper.toggled-2 #sidebar-wrapper\').css(\'width\', \'\');">Select</button> '+       
'              <select class="custom-select form-control custom-select" id="assistantprojectselected"  onchange="onchange_default_sb_item(this)" data-toggle="tooltip" data-placement="right" title="Project Name needed"></select>'+ 
'          </div>'+ 
'       </div>'+ 
'   </div>';
    return content 
}

function onclick_AssistantStrategyCreate (elt) {
    var strategyname     = $('#assistantstrategyname').val();    
    if (strategyname == "") {
         $('#assistantstrategyname').focus().val("");
         return null;
    }

    if (solution.CurrentProject.PG.GetStrategyFromName(strategyname)) {
        $('#assistantstrategyname').focus().val("").val(strategyname);
        return null;
    }   
    OnCloseStrategy(NewStrategy, strategyname, StrategiesMenu[0]);

    $("#strategy_assistant_name").val (strategyname);    
}

function onclick_AssistantStrategySelect (elt) {
    let selected_option = $('#assistantstrategiesselected option:selected');   
    let strategyname = selected_option.text();
    let strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyname);

    OnCloseStrategy(SelectStrategy, strategy);
}


function StrategyAssistantFillStrategies (project) {
    let PG = project.PG;
    let strategiescontent = '';

    for (var j = 0; j < PG.Strategies.length; j++) {
        var strategy = PG.Strategies[j];
        strategiescontent += '<option>' + strategy.Name + '</option>';
    }    

    $('#assistantstrategiesselected').html(strategiescontent);
    $('#assistantstrategyname').val(PG.StrategyFindName(StrategiesMenu[0]));
}

function StrategyCreatorStrategyPanel () {
    var name = '';

    var content =    
'   <div id="popupnewstrategy"  class="sb_column">'+     
'       <label>Strategy</label>' +
'       <div class="sb_formgroup">'+  
'           <div class="input-group mb-3">'+       
'              <button id = "strategycreator_createbutton" type="button" class="sb_buttonprepend sb_mbutton" onclick="onclick_AssistantStrategyCreate(this)">Create</button> ' +
'              <input type="text" id="assistantstrategyname" name="' + name + '" class="required form-control "  value="' + name + '" autocomplete="off"  onchange="onchange_default_sb_item(this)" onkeypress="return CheckChar(event)" autofocus>'+
'           </div>'+ 
'       </div>'+ 
'       <div class="sb_formgroup">'+  
'          <div class="input-group mb-3">'+       
'              <button id="strategycreator_selectbutton" class="sb_buttonprepend sb_mbutton" type="button" onclick="onclick_AssistantStrategySelect (this)" onmouseover= "$(\'#wrapper.toggled-2 #sidebar-wrapper\').css(\'width\', \'320px\');" onmouseout="$(\'#wrapper.toggled-2 #sidebar-wrapper\').css(\'width\', \'\');">Select</button> '+       
'              <select class="custom-select form-control" id="assistantstrategiesselected"  onchange="onchange_default_sb_item(this)" data-toggle="tooltip" data-placement="right" title="Project Name needed"></select>'+ 
'          </div>'+ 
'       </div>'+ 
'   </div>';
    return content 
}

//----------------------------------------------------  STRATEGY PANEL  2 - DESCRIPTION------------------------------------------------



function onchange_AssistantStrategyName (elt) {
  
    let strategyname    = $('#strategy_assistant_name').val();    

    if (strategyname == "") {
         $('#strategy_assistant_name').focus().val("");
         return null;
    }
    if (solution.CurrentProject.PG.GetStrategyFromName(strategyname)) {
        $('#assisttantprojectname').focus().val("").val(strategyname);
        return null;
    }   
    RenameStrategy(CurrentStrategy, strategyname)
}


function StrategyAssistantStrategyName (strategy) {
    let strategyname = strategy ? strategy.Name : ''
    var content =     
    '<div  class="sb_formgroup" >' +
    '   <label>Name*</label>' +
    '   <span class="sb_link">' + 
    '       <input id="strategy_assistant_name" type="text" name="strategyname" class="required form-control" value= "' + strategyname + '" autocomplete="off" onchange="onchange_default_sb_item(this); onchange_AssistantStrategyName(this)" onkeypress="return CheckChar(event)">' +
    '   </span>' +
    '</div>';
    return content;

}

//----------------------------------------------------  STRATEGY PANEL  3 - BUY/SELL PROPERTIES ------------------------------------------------

function Init_strategypropertiesfield (label, name, name1) {

    let index   = getmenuindexfromfield(EngineFieldsItems, name, 'name');    
    let index1;
    if (name1) {
        index1  = getmenuindexfromfield(EngineFieldsItems, name1, 'name');    
    }

    var content =    
    '<label class="sb_widget-title">' + label + '</label>' +       
    '<div class="sb_formgroup">' +
    '   <label style="cursor: pointer;" >' + EngineFieldsItems[index].item1 + '</label>' +    
        sb.item({...EngineFieldsItems[index],  ...{attributes: {propertyid: EngineFieldsItems[index].id}}}) + 
    '</div>';         
    if (name1) {    
        content += 
        '<div class="sb_formgroup">' +
            '<label style="cursor: pointer;" >' + EngineFieldsItems[index1].item1 + '</label>' +    
            sb.item({...EngineFieldsItems[index1],  ...{attributes: {propertyid: EngineFieldsItems[index1].id}}}) + 
        '</div>';          
    }
    return content;
}

function Init_strategypropertiesfields (level) {
    var from = 0;
    var to = 16;
    if (level == 1) {  // ORDERS PROFIT/LOSS *IN PIPS*
        from = 27;
        to = 27 + 6;
    }
    if (level == 2) { //EXPERT GLOBAL PROFIT/LOSS *IN ACCOUNT CURRENCY
        from = 18;
        to = 18+9;
    }
    if (level == 3) { //EXPERT GLOBAL PROFIT/LOSS *IN ACCOUNT CURRENCY
        from = 15;
        to = 18;
    }
    if (level == 4) { //EXPERT GLOBAL PROFIT/LOSS *IN ACCOUNT CURRENCY
        from = 11;
        to = 14;
    }        
    var j = 0;
    var content = '';
    for (var i = from; i < to; i++) {
        if ((to-i) % 3 == 0) {
            content += '<div class="sb_formgroup" >';
            j = 0;
        }
        content += '<label>' +  EngineFieldsItems[i].item1  + '</label>';
        j++;
        content += sb.item({...EngineFieldsItems[i],  ...{attributes: {propertyid: EngineFieldsItems[i].id}}})   
        if (j == 3) {
            content += '</div>';
        }
    }
    return content;
}

function SelectAssistantRecovery (value) {
    var index = getmenuindexfromfield (RecoveryModeMenu, value, 'type');
    var text = RecoveryModeMenu[index].text.substring (5);

    const links =$('.strategy_assistant_recovery').children ();    

    $.each(links, function (index, link) {
        if ($(link).html () == text) {
            $(link).removeClass("noactivate");
        }
        else {
            $(link).addClass("noactivate");
        }
    });
    for (var p in RecoveryModeMenu) {
        if (RecoveryModeMenu[p].type == value) {
            var explanation = RecoveryModeMenu[p].tooltip;
            $('#strategy_assistant_recoverymode').html(explanation);

            break;
        }
    }  
}

function OnStrategyRecoveryChange (elt) { 

    var noactivate = $(elt).hasClass("checked");
    if (noactivate) return;   // already selected
    let value = $(elt.children[0]).html();

    for (var p in RecoveryModeMenu) {
        if (RecoveryModeMenu[p].text.substring (2) == value) {
   //         $('#strategy_assistant_panel-p-1 #propertyid_24').val(RecoveryModeMenu[p].text).change();
            var explanation = RecoveryModeMenu[p].tooltip;
            $('#strategy_assistant_recoverymode').html('<p>' + value + '</p>' + explanation);

            break;
        }
    }
    InitStrategyWithRecovery ( RecoveryModeMenu[p].type);
}

function onclick_recoverybutton (elt, event) {
    OnStrategyRecoveryChange (elt); 
}

function RecoveryPanel(engine) {
    let items = [];
    for (var i = 0; i < RecoveryModeMenu.length; i++) {
        items.push({id:'', type: 'button', item: RecoveryModeMenu[i].text.substring (2), class: "strategy_assistant_recoverybuttons", events: {onclick: 'onclick_recoverybutton(this, event)'}, title: RecoveryModeMenu[i].tooltip})
    }
    revoverycommandgroup.items = items
    var content = '<div class="card-title">Recovery Mode</div>'; 

    content += '<div class="strategy_assistant_recovery">';
    content +=      sb.render (revoverycommandgroup); 
    content += '</div>';
    content += '<div class="card-title">Description</div>'
    content += '<div id="strategy_assistant_recoverymode">';
    content += '    <br><br>' +
               '    <i>*A strategy type describes the way sequential trades are calculated,  by selecting a type some defaults properties are generated for your strategy, you can modify the values later in this assistant. During the whole creation process you can inspect the behaviour by testing your strategy in chart view</i>' +
               '    <p>For Grid Trading explanations useful link is here </p> <a href="https://forexop.com/" target="new"> <button class="assistant_button sb_button noactivate" title=""   type="button">ForexOp</button></a>' +
               '</div>';

    return content;

}

//----------------------------------------------------  STRATEGY PANEL  6 - RULES -------------------------------------------------------

function onclick_menubutton (elt, event) {
    OnStrategyActionChange (event); 
}

function MenuPanel (menu) {
    let items = [];
    for (var i = 0; i < menu.length; i++) {
        items.push({id:'', type: 'button', item: menu[i].name, class: "strategy_assistant_actionsbuttons", events: {onclick: 'onclick_menubutton(this, event)'}, title: menu[i].tooltip})
    }
    menucommandgroup.items = items

    var content = '<div class="card-title">Actions</div>'; 

    content += '<div class="strategy_assistant_recovery">';
    content += sb.render (menucommandgroup); 
    content += '</div>';
    return content;
}
 

function StrategyAssistantActionsPanel () {
    return (MenuPanel(OperationItems));
}

function OnStrategyActionChange (event) {
/*
    UpdateActionsRule ();
    
    B_BuySellAutomatic[0]   = AndE(0, B_BUYSELLAUTOMATIC);
    B_ExitAutomatic[0]      = AndE(0, B_EXITAUTOMATIC);
    B_HedgeAutomatic[0]     = AndE(0, B_HEDGEAUTOMATIC);
    B_DeHedgeAutomatic[0]   = AndE(0, B_DEHEDGEAUTOMATIC);

    
    CurrentEngine.SCContent = ReturnSCActionButtons();
    ParseEngine(solution.CurrentProject.PG, CurrentEngine); // for dependency
    CurrentContainer.Refresh ();    
    window.eval(GenerateJSObjects(CurrentEngine));
    window.eval(GenerateJSConditions(CurrentEngine));
    window.eval(GenerateVariables(JS_GENERATION, GLOBAL_VARIABLE));
    window.eval(GenerateJSStrategy(CurrentStrategy, CurrentEngine));    
*/    
}    

function ResetActionButtons () {
    const links =$('.strategy_assistant_actions').children ();
    $.each(links, function (index, link) {
        if (!$(link).hasClass("noactivate")) { 
             $(link).toggleClass("noactivate");
        }
    });                
}

function ReturnSCActionButtons () {
    const links =$('.strategy_assistant_actions').children ();
    var scstring = "";
    $.each(links, function (index, link) {
        if (!$(link).hasClass("noactivate")) { 
            scstring += '(' + $(link).html () + ')\n'
        }
    }); 
    return scstring;
}

function TableRulePanel () {
    var content = 
    '<div id="RulesTitle">Rules</div>'+  
    '<div class="mg-blog-category" style="display: inline-block;margin-left: 15px;"> <a class="" onclick="OnClickAddRule ();" alt="View all posts in Features"> <i class="fa fa-plus"></i> Add</a></div>' +
    '<div class="RulesTable">' +
        '<table class="table RuleTable">' +
            '<tbody>' +    // RulePanel(rulenumber)
            '</tbody>' +
        '</table>' +
    '</div>';
    
    return content;
}

//----------------------------------------------------  STRATEGY PANEL  7 - SCHEDULE ------------------------------------------------

function StrategyAssistantSchedulePanel() {
    var content = '';
    var j = 0;

    for (var i = 0; i < ScheduleMenu.length; i++) {
        if (i % 2 == 0) {
            content += '<div class="sb_formgroup" >';
            j = 0;
        }
        content += '<label>' +  ScheduleMenu[i].item1  + '</label>';
        j++;
        
        content += sb.item({...ScheduleMenu[i],  ...{attributes: {scheduleid:  ScheduleMenu[i].id}}})
        if (j == 2) {
            content += '</div>';
        }
    }
    return content;
}

function StrategyAssistantSchedulePropertyPanel() {
    let content = '';
    for (var i = 0; i < SchedulePropertyMenu.length; i++) {
        content += '<div class="sb_formgroup" >';
        content += '<label>' +  SchedulePropertyMenu[i].item1  + '</label>';
        content += sb.item({...SchedulePropertyMenu[i],  ...{attributes: {scheduleid:  SchedulePropertyMenu[i].id}}})
        content += '</div>';
    }
    return content;
}

function StrategyAssistantRefreshLabels () {
    StrategyAssistantRefreshError(11);
    StrategyAssistantRefreshError(12);
    StrategyAssistantRefreshError(13);
}

function StrategyAssistantCheckSchedule () {
    if (StrategyAssistantUpdateScheduleField (11) == -1 ||
        StrategyAssistantUpdateScheduleField (12) == -1 ||
        StrategyAssistantUpdateScheduleField (13) == -1)
        return false;
    return true;
}

function StrategyAssistantRefreshError (id) {
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ( 'pname',ui.currentplatform_pname); 

    $('[scheduleid="' + id + '"]').val(value)
  //  $('#' +platform.items[3].id + ' .' + 'scheduleid_' + id + ' .form-control').val(value); 

    switch (id) {
        case 11:
        case 21:
            $('#strategyschedulepanel #' + 11).parent().children().eq(2).remove();        
            $('#strategyschedulepanel #' + 21).parent().children().eq(2).remove();        
        break;
        case 12:
        case 22:
            $('#strategyschedulepanel #' + 12).parent().children().eq(2).remove();        
            $('#strategyschedulepanel #' + 22).parent().children().eq(2).remove();        
        break;
        case 13:
        case 23:
            $('#strategyschedulepanel #' + 13).parent().children().eq(2).remove();        
            $('#strategyschedulepanel #' + 23).parent().children().eq(2).remove();        
        break;               
    }
    
    if (StrategyAssistantUpdateScheduleField (id) == -1) {
        var error = '';
        switch (id) {
            case 11:
            case 21:
                error = 'Error in Month Format Start Month bigger than end Month';
            break;
            case 12:
            case 22:
                error = 'Error in Month Format Start Month bigger than end Month';
            break;
            case 13:
            case 23:
                error = 'Error in Day Format Start Day bigger than end Day';
            break;               
        }
        var errorlabel = '<label id="strategy_assistant_name-error" class="error" for="strategy_assistant_addedindicators">' + error + '</label>';
        $('#strategyschedulepanel #' + id).parent().append(errorlabel);
    }       
}

function StrategyAssistantUpdateScheduleField (id) {
    var startmenuindex, endmenuindex;
    var end;     
    var start;     

    switch (id) {
        case 11:
        case 21:
            start   = $('#strategyschedulepanel #' + 11).val ();
            startmenuindex = getmenufromname(MonthsMenu, start, 'text').id; 

            end     = $('#strategyschedulepanel #' + 21).val ();
            endmenuindex = getmenufromname(MonthsMenu, end, 'text').id; 

            if (endmenuindex != 0 && startmenuindex != 0 && startmenuindex >endmenuindex) {
                return -1; 
            }
        break;
        case 12:
        case 22:
            start = $('#strategyschedulepanel #' + 12).val ();
            startmenuindex    = getmenufromname(WeeksMenu, start, 'text').id;             

            end = $('#strategyschedulepanel #' + 22).val ();
            endmenuindex = getmenufromname(WeeksMenu, end, 'text').id; 
            
            if (endmenuindex != 0 && startmenuindex != 0 && startmenuindex >endmenuindex) {
                return -1; 
            }            
        break;
        case 13:
        case 23:

            start = $('#strategyschedulepanel #' + 13).val ();
            startmenuindex    = getmenufromname(DaysMenu, start, 'text').id;             

            end = $('#strategyschedulepanel #' + 23).val ();
            endmenuindex = getmenufromname(DaysMenu, end, 'text').id;

            if (endmenuindex != 0 && startmenuindex != 0 && startmenuindex >endmenuindex) {
                return -1; 
            }            
            break;               
    }
    return 1;
}

function StrategyAssistantClearTime (id) {
    $('#' + id).val ('');      
    onchange_strategyschedule(id, ''); 
}

//----------------------------------------------------  COMPILE PANEL------------------------------------------------

function StrategyCreatorCompilePanel () {
    var name = '';

    var content =    
'   <div id="popupcompile"  class="row">'+     
'		<div class="row flex-grow-1">' +
'           <div id="strategyassistantelement" class="col-12 createtassistantelement">' +
'               <div class="demo-content loopBegin-loopComplete-demo">' +
'                   <div class="logs">' +
'                       <input class="log loopBegin-log" value="">' +
'                       <input class="log loopComplete-log" value="">' +
'                   </div>' +
'                   <div class="circle shadow"></div>' +
'                   <div class="circle el"></div>' +
'               </div>' +
'           </div>' +
'       </div>'+
'   </div>';
    return content 
}

function StrategyCreatorCElementsPanel () {
    var content = 
'       <div id="popupcompile_button" class="sb_widget col"  onclick="onclick_project_strategycompile(this, event)">' +
'           <div class="sb_widget-container">' +
'               <div class="sb_widget-wrapper"  >' +
'                   <div class="sb_widget-icon">' +
'                       <span class="sb_icon"><i aria-hidden="true"  class="' + icon_mt4expert + '"></i></span>' +
'                   </div>' +
'                   <div class="sb_widget-content">' +
'                       <div class="sb_widget-title">' +
'                           <span>Generate MQ4 Expert</span>' +
'                       </div>' +
'                       <div class="sb_widget-description"></div>' +
'                   </div>' +
'               </div>' +
'           </div>' +
'       </div>';
    return content;
}

//----------------------------------------------------ASSISTANT GUIDE PANEL ------------------------------------------------

function OpenCloseGuidePanel (step, number, open) {
    if ( $('#strategy_assistant_box_content_' + step + '_' + number + ' .box-btn-slide').hasClass ('rotate-180')) {
        if (open) return;        
        $('#strategy_assistant_box_content_' + step + '_' + number + ' .box-btn-slide').trigger('click');        
    } else {
        if (!open) return;        
        $('#strategy_assistant_box_content_' + step + '_' + number + ' .box-btn-slide').trigger('click');
    }
}

function returncontent (bodycontent) {
    var content = bodycontent;
    return content;
}

function StrategyAssisantBoxContent (step, number, title, bodycontent, closed) {
    var content =   sb.render ({id: 'strategy_assistant_box_content_' + step + '_' + number, 
                                type: 'box',  closed: closed, 
                                header: {item: title,  control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : closed, orientation: sb.R_CONTROL}},
                                items: [
                                            {id: 'content',  type: 'html',  content: "returncontent('" + bodycontent + "')"},
                                       ]
                                }) 
    return content;
}

function OnClickAssistantCommand (event) {
    var value = $(event.target)[0].innerText; 
    var activate = $(event.target).hasClass("noactivate");
 //   if (!activate) return;
    
    const links = $(event.target).parent ().children ();
    $.each(links, function (index, link) {
        $(link).addClass("noactivate");
    });

    switch (value) {
        case 'Login or Register':
            Register();
        break;

        case 'Project View':
           

        break;
      
        case 'Condition View':
          

        break;
      
       case 'MQ4 Expert Advisors':
           
        break;
        case 'Properties View':
          
        break;
        case 'Create Indicator':
            openPopupIndicator();
        break;
        case 'Chart View':
            ShowChart ();
        break;
        case 'Signals View':
            ShowChart ();
            DrawSignalsPanel (w2ui.strategychartpanel, true);
        break;
        case 'Tracker View':
            DrawStrategyTrackPanel (true);
        break;    
        case 'Create Strategy':
            var strategyname = solution.CurrentProject.PG.StrategyFindName ();
            OnCloseStrategy(NewStrategy, strategyname, StrategiesMenu[0]);
        break;
        case 'Assistant View':
        break;
        case 'Video Tutorial':
        break;

    }
}

function OnStrategyIndicatorSelect () {
    var value = $('#strategy_assistant_indicators').val ();
    var index = getmenuindexfromfield (IndicatorsMenu, value, 'text');
    if (index == -1) return;

    var indicatorname = IndicatorsMenu[index].name;
    openPopupIndicator (IndicatorsMenu[index], null, false);
    
}

function StrategyAssistantIndicators () {
    var content =     
    '<span class="sb_link">' + 
    '   <select  class="form-control custom-select" id="strategy_assistant_indicators" onchange= "OnStrategyIndicatorChange (this.value)"  data-toggle="tooltip" data-placement="right" title="you can precise it later">';    
    
        for (var j = 0; j < IndicatorsMenu.length; j++) {
            if (IndicatorsMenu[j].type != PREDEFINED_TYPE)
                content += '<option title="' + IndicatorsMenu[j].tooltip + '">' + IndicatorsMenu[j].text + '</option>'; 
        }
        content += '<option value=0 title="Choose Indicator" selected>--- New Indicator ----</option>'; 

    content += '</select></span>';
    return content;
}

function StrategyAssistantCreatedIndicators () {
    var content =     
    '<div class="">' +
    '   <label class="">Existing Indicators</label>' +
    '   <div class="sb_formgroup">' +
    '       <button id="selectindicator" class="sb_buttonprepend sb_mbutton" type="button" onclick="IndicatorSelect (this)" >Add</button>' +
    '       <select  class="form-control custom-select" id="createdindicatorsselected" onclick= ""  data-toggle="tooltip" data-placement="right" title="' + 'Created Indicators with the same Type' + '"></select>' +    
    '   </div>';
    content += '</div>';
    return content;
}

function IndicatorSelect (elt, event) {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }
 //   var objectname     = $('#createdindicatorsselected').val();    
    var objectname = $(elt).find('label').html();

    var object = PG.GetObjectFromName(objectname);    
    if (!object)
        return;
    UpdateAssistantDependency (object);      
}

function OnStrategyIndicatorChange () {
    var value = $('#strategy_assistant_indicators').val ();
    var index = getmenuindexfromfield (IndicatorsMenu, value, 'text');

    if (index == -1) return;
    
    $('#strategy_assistant_indicators option[value="0"]').prop('selected', true);

    var indicatorname = IndicatorsMenu[index].name;
    openPopupIndicator (IndicatorsMenu[index], null, false);
}

function GetHTMLFromObject (object) {
    var indicator = GetIndicatorTypeFromObject (object);
    
    return '<div>' + 
           '    <a class="link">' + 
           '        <title  role="button"  title="' + indicator.tooltip + '" onclick="openPopupObject (\'' + object.Name +'\')" style="color:var(--theme-indicator-color)">' + object.Name + '</title>' +
           '        <span  title="Delete Indicator" onclick="OnDeleteUsedIndicator(this)"><i class="fas fa-times-circle"></i> </span>' + 
           '    </a>' + 
           '</div>';
}

function OnDeleteUsedIndicator (elt) {
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }   
    var father = $(elt).parent();
    var objectname = $(father).children().eq(0).html();

    var symbolcanvas = PG.Canvas;    
    
    var object = PG.GetObjectFromName(objectname);    
    
    if (!object)
        return;
    if (!CurrentEngine.Indicators.includes(object.Id)) {

        father.parent().remove();

        symbolcanvas.RemoveIndicator(object.Id);

        for (var i = 0; i < CurrentStrategy.UsedIndicators.length; i++) {
            if (CurrentStrategy.UsedIndicators[i] == object.Id) {
                CurrentStrategy.UsedIndicators.splice(i, 1);
                break;
            }
        }        

        DrawChart();
    }
    else {
        var errorlabel = '<label id="strategy_assistant_name-error" class="error" for="strategy_assistant_addedindicators">Can not delete Indicator Used in the Strategy</label>';
        if ($('#strategy_assistant_addedindicators').parent().find ('#strategy_assistant_name-error').length == 0) {    
            $('#strategy_assistant_addedindicators').parent().append(errorlabel);
            setTimeout(function(){ $('#strategy_assistant_addedindicators').parent().children().eq(1).remove()}, 3000);        
        }
    }

}

function UpdateAssistantDependency (object, oldname) {
    if (!object) return;
    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }   
    var symbolcanvas = PG.Canvas;
    
    var htmlind =  $('#strategy_assistant_addedindicators').children ();
    for (var i = 0; i < htmlind.length; i++) {
        if (!oldname) {
            if ($(htmlind[i]).children().children().eq(0).html() == object.Name)
                return;
        } else {
            if ($(htmlind[i]).children().children().eq(0).html() == oldname) {
                $(htmlind[i]).html(GetHTMLFromObject (object));
                return;
            }
        }
    }
    var objecthtml = GetHTMLFromObject (object);
    $('#strategy_assistant_addedindicators').append (objecthtml);    
}

function StrategyAssistantFillIndicators (project) {
    let PG = project.PG;

    var content = '';
    for (var i = 0; i < PG.Objects.length; i++) {
        var indicator = GetIndicatorTypeFromObject(PG.Objects[i]);       
        content += '<option title="' + indicator.tooltip + '">' + PG.Objects[i].Name + '</option>'; 
    }    
    $("#createdindicatorsselected").html(content);
    
}

function InitStrategyWithRecovery (value) {
    if (!CurrentStrategy)
        return;
    var engine = CurrentEngine;
    engine.RecoveryMode = value;
    switch (value) {
        case "C" :
            engine.MaxCount = "1";    
        break;
        case "I" :
            engine.MaxCount = "4";  
            engine.RecoveryValue="0.1";
            engine.InitialLot = "0.1";
            engine.PipStep = "40";
            engine.TimeStep = "40";
            engine.DirectionType = "LEVEL";
            engine.Direction = "FORWARD";
            engine.SellLotSL = "0"; 
            engine.SellLotTP = "0";  
            engine.BuyLotSL = "0";  
            engine.BuyLotTP = "0";  

        break;
        case "P" :
        break;
        case "Q" :
        break;
        case "M" :
        break;
        case "F" :
            engine.MaxCount = "6";  
            engine.PipStep = "40";
            engine.TimeStep = "40";
            engine.DirectionType = "LEVEL";
            engine.Direction = "BACKWARD";            
            engine.SellLotSL = "0"; 
            engine.SellLotTP = "0";  
            engine.BuyLotSL = "0";  
            engine.BuyLotTP = "0";  
            
        break;
        case "D" :
        break;
        case "J" :
        break;
        case "A" :
            engine.MaxCount = "1";              
            engine.PipStep = "20";
            engine.TimeStep = "20";
            engine.SellLotSL = "10"; 
            engine.SellLotTP = "10";  
            engine.BuyLotSL = "10";  
            engine.BuyLotTP = "10";  
             
        break;
        case "L" :
        break;
        case "K" :
        break;
        case "H" :
        break;
        case "S" :
        break;
        case "N" :
        break;
        case "O" :
        break;
    }
    RefreshStrategyAssistantProperties (engine);  
    RefreshStrategyPropertiesHelper(CurrentEngine);    
}