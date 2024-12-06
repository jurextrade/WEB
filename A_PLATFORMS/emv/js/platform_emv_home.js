function emv_home_init () {
    InitEMVAssistant();
}

//----------------------------------------------------   CAROUSEL PANEL    ------------------------------------------------   

function emv_MainCarouselPanel () {
    var content = 
        sb.render (emv_assistantpanel) +     
'       <div id="emv_maincarousel" class="featured carousel slide sb_panel" data-bs-ride="carousel">' +
'           <label class="sb_f_size12">Featured</label>' +

'           <div class="carousel-inner">' +
'               <div class="carousel-item active">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/emv/res/emv1.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                           CARD READER<img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">CARD READER - Step by Step  EMV</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">Complete</li>' +
'                                   <li class="card-text">Understand ICC Terminal Communication </li>' +
'                                   <li class="card-text">Demo Terminal</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/emv/res/emv2.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                               EMV TERMINAL' +
'                           </div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">CONFIGURE YOUR TERMINAL - Features</div>' +   
'                                <div class= "mb-3">' +    
'                                   <li class="card-text">Add AIDs to your terminal</li>' +
'                                   <li class="card-text">Configure Terminal Capabilities</li>' +
'                                   <li class="card-text">Configure TACS ...</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/emv/res/emv3.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                           EMV TESTER<img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">EMV TESTER</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">APDU</li>' +
'                                   <li class="card-text">TLV Parser </li>' +
'                                   <li class="card-text">Tags</li>' +
'                                   <li class="card-text">Authentification</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </div>' +
'           <div class="carousel-indicators bottomcarousel">' +
'               <button  class="sb_roundbutton active" type="button" data-bs-target="#emv_maincarousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#emv_maincarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#emv_maincarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>' +
'           </div>' +
'  </div>';
return content;
}

//---------------------------------------------------- PRESENTATION PANEL------------------------------------------------ 

function onclick_othertools (elt, event) { 
    event.preventDefault();
    window.open("./ExProject/index.php");
}

function emv_PresentationPanel () {
    var content =    
`   <label class="sb_f_size12">EMV</label>
    <div class="sb_row">
       <div class="presentation_image">
           <img src="/A_PLATFORMS/emv/res/emv.svg" > 
       </div>
       <div class="presentation_description">
           <p itemprop="description" class="description">
           The primary aim of this website is to offer a tutorial-style presentation focusing on the transaction profile of the EMV debit and credit payment application. 
           The goal is to facilitate a better understanding of the EMV payment method for individuals who lack the time to thoroughly read the complete specification. 
           <br><br>
           This presentation should be viewed as supplementary material that enables readers to quickly familiarize themselves with this payment technology. 
           It is important to emphasize that this site does not seek to replace the specifications, which should always be considered as the ultimate point of reference for specific details.
           <br><br>
           The main focus of the presentation is to analyze the protocol between the ICC and the terminal, rather than discussing the card and terminal elements separately.
           </p>
       </div>
   </div>
   <div class="sb_column">
       <div>This site is still under development</div> 
       <div>I can assist you in software developments</div> 
       <div>Please feel free to contact me</div> 
       <br><p>JUREXTRADE<br><span style="line-height: 1.5;">Gabriel Jureidini</span><br><span style="line-height: 1.5;">Paris-France</span></p>
       <label><i class="fas fa-envelope"></i> Email<br><span style="line-height: 1.5;">contact@jurextrade.com</span></label>
	</div>`;
    return content;
}

function emv_home_open () {
    if (!sb.tab_finditem(emv_maintabs, 'emv_home_tab')) { 
        let hometabitem  =         {id: 'emv_home_tab',     item: 'Home',  type:'link', icon:  icon_home,   items: [emv_home_main], onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'Home',  events: {onclick:"onclick_emv_tab(this)"}}
        sb.tab_additem(emv_maintabs, hometabitem, 1);
    } 
    sb.tab_select(emv_maintabs, 'emv_home_tab');
}

//----------------------------------------------------   WIDGETS PANEL    ------------------------------------------------   

function onclick_downloadcardreader(elt, event) {
    event.stopPropagation();   
    event.preventDefault();
        
    $('#emv_maincarousel').carousel(0);

    if ($('#emv_assistantpanel').is(':hidden')) {
        emv_AssistantPanel_Open ();    
    } else {
        emv_AssistantPanel_Close ();    
    }  
}

function onclick_emvconnect (elt, event) { 
    if (!$('#emv_assistantpanel').is(':hidden')) {
        emv_AssistantPanel_Close ();    
    }
    $('#emv_maincarousel').carousel(1);    
}

function onclick_emvtester(elt, event) {
    if (!$('#emv_assistantpanel').is(':hidden')) {
        emv_AssistantPanel_Close ();    
    }
    $('#emv_maincarousel').carousel(2);   
}

function onclick_emvdownload(elt, event) {
    SaveURIInFile('/EMV/Client/Client.zip', '')
}

function onclick_emvconnectseehow (event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'emv');
    LoaderDisplay(true);
    setTimeout(function() { 
        if (platform.length == 0) {
            solution.add_module('emv');               
        } 
        let ui  = solution.get('ui')     
        ui.platform_select(EMV_PLATFORM_PNAME)   
        selector_select('emv_selectproject', 'Demo_Project');
        LoaderDisplay(false);        
    },5)
}

function onclick_emvtesterseehow (event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'emv');
    if (platform.length == 0) {
        solution.add_module('emv');               
    } 
    let ui  = solution.get('ui')     
    ui.platform_select(EMV_PLATFORM_PNAME)   
    selector_select('option_selectterminal', 'Yahoo Finance');
}

function emv_GetStartedSection_Panel () {
    var content = 
       '<label class="sb_f_size12">Get Started - Project Templates</label>' +
       '<div class="sb_row sb_widget-container">' +
            sb_widget_create ('downloadncardreader',  'onclick_downloadcardreader(this, event)', icon_download, 'Download ', 'Download Card Reader','onclick_emvdownload(event)', 'download') +
            sb_widget_create ('emvconnect',           'onclick_emvconnect(this, event)', icon_terminal, 'EMV Terminal','Configure your EMV Terminal','onclick_emvconnectseehow(event)', 'see demo terminal') +
            sb_widget_create ('emvtester',            'onclick_emvtester(this, event)', icon_terminal, 'EMV Tester','Test your card','onclick_emvtesterseehow(event)', 'see tester') +
       '</div>' 
    return content;
}

function emv_ToolsSection_Panel () {
    var content = 
       '<label class="sb_f_size12">EMV Tools</label>' +
       '<div class="sb_row sb_widget-container">' +
            sb_widget_create ('tlvparsertool',     'onclick_tlvparsertool(this, event)',    icon_strategy,  'TLV', "TLV Parser") +                
       '</div>' 
    return content;
}


function slideToggleCallback () {
    sb.resize(body)
}

//----------------------------------------------------ASSISTANT PANEL------------------------------------------------


function emv_AssistantPanel_Close() {
    assistant_login = false;    
    sb.toggle ($('#emv_maincarousel'), 1);
    sb.toggle ($('#emv_assistantpanel'), 0, slideToggleCallback);
}

function emv_AssistantPanel_Open() {
    sb.toggle ($('#emv_maincarousel'), 0);
    sb.toggle ($('#emv_assistantpanel'),1, slideToggleCallback);
}

function emv_assistant_register () {
    assistant_login = true;
    Register();
}
 

function onclick_emv_assistantclose(elt) {
    emv_AssistantPanel_Close();  
}

function onclick_emvcheckout (elt) {
    let ui  = solution.get('ui')     
    ui.platform_select(EMV_PLATFORM_PNAME)   
}


function emv_AssistantPanel () {
    var content = 
//'    <div id="mt4assistantpanel" class="" style="display:' + (assistant_mode ? 'block' : 'none') + '">' +
'       <label class="sb_f_size12">Connect to EMV Server</label>' +
'       <form  id="emvassistantform"  class="assistant_panel">' +
'           <div id="loginclose" onclick="onclick_emv_assistantclose(this)" ><svg class="installcheckmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36"></path></svg></div>   ' +  
'           <h3>Login or Register</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/emv/res/emv1.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">You need to Register to be able to connect the Card Reader</li>' +
'                               <li class="card-text">Memorize the name and the password, these will be used in Card Reader Program</li>' +
'                               <div class="sb_formgroup card-text">' +
'                                   <button class="assistant_button sb_button noactivate" title="" type="button" onclick="emv_assistant_register()"><i class="icon_mt4expert"></i>Login or Register</button>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' + 
'           <h3>Download Card Reader</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/emv/res/emv2.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">Download Card Reader on your local machine' + 
'                                   <button id="downloadbutton" class="sb_sbutton" onclick="event.preventDefault();SaveURIInFile(\'/EMV/Client/Client.zip\', \'\')">Download</button>' +
'                               </li>' +
'                               <li class="card-text">Unzip Card Reader' +
'                               </li>' +
'                               <li class="card-text">Open Data Folder Where you unzip the program</li>' +
'                               <li class="card-text">Go Client Folder</li>' +
'                               <li class="card-text">Execute Program</li>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' + 
'           <h3>Check Out</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/emv/res/emv3.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li class="card-text">You Should See ...</li>' +
'                               <li class="card-text">Press Checkout to see ...</li>' +
'                               <div class="sb_formgroup card-text">' +
'                                   <button id="checkout" class="assistant_button sb_button noactivate" onclick="onclick_emvcheckout(this)" title="" type="button">Check Out</button>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' +
'       </form>' +
'       <div id="emvassistantbuttons" class="sb_row assistant_buttons">' +
'             <a class="prev"         onclick= "onclick_assistant_nextprev(this, event)" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>' +
'             <a class="next sb_left" onclick= "onclick_assistant_nextprev(this, event)" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a>' +
'       </div>';  
//'   </div>'
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