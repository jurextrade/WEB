function tradedesk_home_init () {
   // InitEMVAssistant();
}

//----------------------------------------------------   CAROUSEL PANEL    ------------------------------------------------   

function tradedesk_MainCarouselPanel () {
    var content = 
        sb.render (tradedesk_assistant_panel) +     
'       <div id="tradedesk_maincarousel" class="featured carousel slide sb_panel" data-bs-ride="carousel">' +
'           <label class="sb_f_size12">Featured</label>' +

'           <div class="carousel-inner">' +
'               <div class="carousel-item active">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/home/res/home1.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                           STRATEGY CREATOR<img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">STRATEGY CREATOR - Algo Trading</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">You have an idea of a strategy and You do not know how to program it ? </li>' +
'                                   <li class="card-text">Strategy Creator allows you to realize and test your strategy </li>' +
'                                   <li class="card-text">You can test your idea in minutes</li>' +
'                                   <li class="card-text">A wizard will help you to do it</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/home/res/home2.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                               MT4 PLATFORM' +
'                           </div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">CONNECT TO YOUR MT4 PLATFORM - Features</div>' +   
'                                <div class= "mb-3">' +    
'                                   <li class="card-text">Fully take control on your MT4 experts</li>' +
'                                   <li class="card-text">Launch more than one expert on the same chart</li>' +
'                                   <li class="card-text">Change the behavior of your Strategies during run time</li>' +
'                                   <li class="card-text">Distinguish orders related to your running strategies</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/home/res/home3.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                           OPTION TRACKER<img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">STOCK AND OPTION TRACKER ON YAHOO</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">Stocks</li>' +
'                                   <li class="card-text">Option Calculator </li>' +
'                                   <li class="card-text">Option Greeks</li>' +
'                                   <li class="card-text">Option Chain</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </div>' +
'           <div class="carousel-indicators bottomcarousel">' +
'               <button  class="sb_roundbutton active" type="button" data-bs-target="#maincarousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#maincarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#maincarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>' +
'           </div>' +
'  </div>';
return content;
}

//---------------------------------------------------- PRESENTATION PANEL------------------------------------------------ 

function onclick_othertools (elt, event) { 
    event.preventDefault();
    window.open("./ExProject/index.php");
}

function tradedesk_PresentationPanel () {
    var content =    
'	<label class="sb_f_size12">Strategy Creator</label>' +
'   <div class="sb_row">' +
'       <div class="presentation_image">' +
'           <img src="/A_PLATFORMS/home/res/home.svg" >' + 
'       </div>' +
'       <div class="presentation_description">' +
'           Wide range of tools available to traders that can help them identify potential trading opportunities and make informed decisions' +
'       </div>' +
'   </div>';

    return content;
}

function tradedesk_home_open () {
    return;
    if (!sb.tab_finditem(strategyfiletab, 'tradedesk_home_tab')) { 
        let hometabitem  = {id: 'tradedesk_home_tab',   item: 'Home',      type:'link', in:  icon_home,       items: [tradedesk_home_main], onclose: 'onclick="onclick_StrategyCloseTabItem(this, event)"',   title: 'Home',               events: {onclick:"onclick_tradedesk_tab(this)"}};

        sb.tab_additem(strategyfiletab, hometabitem, 1);
        tradedesk_home_init();        
    } 
    sb.tab_select(strategyfiletab, 'tradedesk_home_tab');
}

//----------------------------------------------------   WIDGETS PANEL    ------------------------------------------------   

//----------------------------------------------------   WIDGETS PANEL    ------------------------------------------------   
function onclick_strategytutorial(elt, event) {
    if (!$('#tradedesk_assistantpanel').is(':hidden')) {
        MT4AssistantPanel_Close ();    
    }

    $('#maincarousel').carousel(0);
}

function onclick_connectMT4Terminal2 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();
        
    $('#maincarousel').carousel(1);

    if ($('#tradedesk_assistantpanel').is(':hidden')) {
        MT4AssistantPanel_Open ();    
    } else {
        MT4AssistantPanel_Close ();    
    }
}

function onclick_optionstutorial2(elt, event) {
    if (!$('#tradedesk_assistantpanel').is(':hidden')) {
        MT4AssistantPanel_Close ();    
    }
    $('#maincarousel').carousel(2);    
}

function onclick_projectseehow(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'project');
    LoaderDisplay(true);
    setTimeout(function() { 
        if (platform.length == 0) {
            solution.add_module('project');     
        } 
        let ui  = solution.get('ui')        
        ui.platform_select(PROJECT_PLATFORM_PNAME)       
        selector_select('tradedesk_selectproject', 'DemoProject');
        onclick_sidebarmenu('sidebar_files', 1)        
        LoaderDisplay(false);        
    },5)
}


function onclick_optionsseehow(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'option');
    LoaderDisplay(true);
    setTimeout(function() { 
        if (platform.length == 0) {
            solution.add_module('option');               
        } 
        let ui  = solution.get('ui')     
        ui.platform_select(OPTION_PLATFORM_PNAME)   
        selector_select('option_selectterminal', 'Yahoo Finance');
        LoaderDisplay(false);        
    },5)
}

function onclick_signalstutorial(elt, event) {
    let terminal = solution.GetCurrentTerminal()    
    ChartSignalsPanel_Update(terminal,true, true);   
}

function onclick_trackerstutorial(elt, event) {
    let terminal = solution.GetCurrentTerminal() 
    MarkerPanel_Update(terminal, true, true);   
    tracker_update(terminal, true, true);   
}

function onclick_markerstutorial(elt, event) {
    let terminal = solution.GetCurrentTerminal()        
    MarkerPanel_Update(terminal,true, true);   
}

function tradedesk_GetStartedSection_Panel () {
    var content = 
       '<label class="sb_f_size12">Get Started - Project Templates</label>' +
       '<div class="sb_row sb_widget-container">' +
            sb_widget_create ('strategytutorial',  'onclick_strategytutorial(this, event)',   icon_strategy, 'Algo Trading', 'Create Trading Strategies', ['onclick_projectseehow(event)'], ['see demo project']) +
            sb_widget_create ('tradedeskconnect',  'onclick_connectMT4Terminal(this, event)', icon_terminal, 'MT4 Terminal', 'Connect your MT4 Terminal', ['onclick_tradedeskseehow(event)'], ['see demo terminal']) +
            sb_widget_create ('optionstutorial',   'onclick_optionstutorial(this, event)',    icon_strategy, 'Yahoo Market', 'Inspect Stocks and options',['onclick_optionsseehow(event)'], ['see yahoo terminal']) +                
       '</div>' 
    return content;
}

function tradedesk_ToolsSection_Panel () {
    var content = 
       '<label class="sb_f_size12">Chart Tools</label>' +
       '<div class="sb_row sb_widget-container">' +
            sb_widget_create ('signalstutorial',   'onclick_signalstutorial(this, event)',  icon_strategy,  'Signals', "Indicators and Signals") +                
            sb_widget_create ('trackersstutorial', 'onclick_trackerstutorial(this, event)', icon_strategy,  'Trackers',"Track your signals") +                
            sb_widget_create ('markerstutorial',   'onclick_markerstutorial(this, event)',  icon_strategy,  'Markers', "Mark composed signals") +
       '</div>' 
    return content;
}

function tradeskslideToggleCallback () {
    sb.resize(body)
}

//----------------------------------------------------ASSISTANT PANEL------------------------------------------------


function tradedesk_AssistantPanel_Close() {
    assistant_login = false;    
    sb.toggle ($('#tradedesk_maincarousel'), 1);
    sb.toggle ($('#tradedesk_assistantpanel'), 0, tradeskslideToggleCallback);
}

function tradedesk_AssistantPanel_Open() {
    sb.toggle ($('#tradedesk_maincarousel'), 0);
    sb.toggle ($('#tradedesk_assistantpanel'),1, tradeskslideToggleCallback);
}

function tradedesk_assistant_register () {
    assistant_login = true;
    Register();
}
 

function onclick_tradedesk_assistantclose(elt) {
    tradedesk_AssistantPanel_Close();  
}




function tradedesk_AssistantPanel () {
     var content = 
//'    <div id="tradedesk_assistantpanel" class="" style="display:' + (assistant_mode ? 'block' : 'none') + '">' +
'       <label class="sb_f_size12">Connect your MT4 Terminal</label>' +
'       <form  id="tradedesk_assistantform"  class="assistant_panel">' +
'           <div id="loginclose" onclick="onclick_tradedesk_assistantclose(this)" ><svg class="installcheckmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36"></path></svg></div>   ' +  
'           <h3>Login or Register</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/home/res/home1.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">You need to Register to be able to connect to your  MT4 Platform</li>' +
'                               <li class="card-text">Memorize the name and the password, these will be used in the Expert Advisor</li>' +
'                               <div class="sb_formgroup card-text">' +
'                                   <button class="assistant_button sb_button noactivate" title="" type="button" onclick="tradedesk_assistant_register()"><i class="icon_mt4expert"></i>Login or Register</button>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' + 
'           <h3>Download Expert</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/home/res/home1.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">Download Expert on your local machine' + 
'                                   <button id="downloadbutton" class="sb_sbutton" onclick="event.preventDefault();SaveURIInFile(\'/Terminal/MQL4/Experts/Progress.ex4\', \'\')">Download</button>' +
'                               </li>' +
'                               <li class="card-text">Launch your MT4 Platform' +
'                                   <button id="launchmt4btn" class="sb_sbutton" onclick="event.preventDefault();SaveURIInFile(\'mql4buy://\', \'\')">MT4 Terminal</button>' +
'                               </li>' +
'                               <li class="card-text">Open Data Folder of your MT4 Platform</li>' +
'                               <li class="card-text">Go to MQL4/Experts Folder</li>' +
'                               <li class="card-text">Copy Downloaded Expert Progress.exe in MQL4/Experts Folder</li>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' + 
'           <h3>Launch Expert</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/home/res/home1.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">In Menu Tools>Options: In Tab Expert Advisors Select Allow DLL Imports</li>' +
'                               <li class="card-text">Drag and Drop Progress Expert in your terminal chart </li>' +
'                               <li class="card-text">In Expert Properties: Fill the UserName and Password (same the one you registered on this site)</li>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' + 
'           <h3>Check Out</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/home/res/home1.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">You Should See a Expert running with Demo Project</li>' +
'                               <li class="card-text">Press Checkout to see the Expert running in Internet Explorer</li>' +
'                               <div class="sb_formgroup card-text">' +
'                                   <button id="checkout" class="assistant_button sb_button noactivate" onclick="onclick_checkout(this)" title="" type="button">Check Out</button>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' +
'       </form>' +
'       <div id="mt4assistantbuttons" class="sb_row assistant_buttons">' +
'             <a class="prev"         onclick= "onclick_assistant_nextprev(this, event)" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span></a>' +
'             <a class="next sb_left" onclick= "onclick_assistant_nextprev(this, event)" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span></a>' +
'       </div>'; 
    return content;
}

//----------------------------------------------------MT4 ASSISTANT STEPS------------------------------------------------

var STEP_LOGIN              = 0;
var STEP_DOWNLOAD           = 1;
var STEP_SETUP              = 2;
var STEP_CHECKOUT           = 3;

function InitEMVAssistant() {

    var form = $("#emvassistantform");    

    form.steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        enableAllSteps : true,
        enableKeyNavigation :true,
        startIndex : solution.UserId == "0" ? STEP_LOGIN : STEP_DOWNLOAD,

        onInit : function (event, currentIndex) {

            if (solution.UserId == "0") {  
                AssistantGoToStep ('emvassistantform', STEP_LOGIN);
            }
            else {
                AssistantGoToStep ('emvassistantform', STEP_DOWNLOAD);
            }
            $("#emvassistantform").find(".actions").css ("display", "none");   // DEfault Prev next Buttons of jquery step
        }, 

        onStepChanging: function (event, currentIndex, newIndex) {
            switch (newIndex) {
                case STEP_LOGIN :
                 /*   if (solution.UserId != "0") {                 
                        return null;   
                    }                 
                 */      
                break;
                case STEP_DOWNLOAD :
                break;
                case STEP_SETUP:
                break;
                case STEP_CHECKOUT :
                break;
           }     
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
        },  

        onStepChanged: function (event, currentIndex, priorIndex) {
            $("#emvassistantform").find(".carousel-control-next").css ("display", "flex")
            $("#emvassistantform").find(".carousel-control-prev").css ("display", "flex")


            switch (currentIndex) {
                case STEP_LOGIN : 
                    $("#emvassistantform").find(".carousel-control-prev").css ("display", "none");
                break;
                case STEP_DOWNLOAD : 
                break;
                case STEP_STRATEGYPROPERTIES : 
                break;
                case STEP_SETUP : 
                break;
                case STEP_CHECKOUT : 
                break;
            }
        },             
        onFinished: function (event, currentIndex) {
            return;
        },                
     });
     return;
}