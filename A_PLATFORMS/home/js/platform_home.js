//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

const HOME_TRADING  = 0;
const HOME_EMV      = 1;
const HOME_NETPROG  = 2;
const HOME_OTHER    = 3;

function tester_widget_content () {
    content = 'Strategy can be tested locally before distributing it on the MT4 Terminal, this makes it very convenient while designing your  strategy' +
    '<br>Check the testing of a strategy example in DemoProject'
    return content;  
}

function onclick_home_trading_rightsection_1_0(elt, event) {
    event.stopPropagation();   
    event.preventDefault();    
    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#tradedesk_assistantpanel'), sb.toggle ($('#trading_maincarousel'), slideToggleCallback)); 
    }
    $('#trading_maincarousel').carousel(0);
}

function onclick_home_trading_rightsection_1_1 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();
    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#tradedesk_assistantpanel'), sb.toggle ($('#trading_maincarousel'), slideToggleCallback));
    }
    $('#trading_maincarousel').carousel(1);   
}

function onclick_home_trading_rightsection_1_2(elt, event) {
    event.stopPropagation();   
    event.preventDefault();    

    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#tradedesk_assistantpanel'), sb.toggle ($('#trading_maincarousel'), slideToggleCallback));
    }
    $('#trading_maincarousel').carousel(2);    
}


function onclick_home_trading_rightsection_1_0_0(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'project');

    if (platform.length == 0) {
        solution.add_module('project');     
    } 
    let ui  = solution.get('ui')        
    ui.platform_select(PROJECT_PLATFORM_PNAME)      
    
    let projectname = 'DemoProject';    
    selector_select('project_selectproject', projectname);
}

function onclick_home_trading_rightsection_1_1_0(event) {
    event.stopPropagation();   
    event.preventDefault();
    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        return;
    }        
    $('#trading_maincarousel').carousel(2);
     sb.toggle ($('#trading_maincarousel'), sb.toggle ($('#tradedesk_assistantpanel'), slideToggleCallback));
}


function onclick_home_trading_rightsection_1_1_1(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'tradedesk');

    if (platform.length == 0) {
        solution.add_module('tradedesk');     
    } 

    let ui  = solution.get('ui')        
    ui.platform_select(TRADEDESK_PLATFORM_PNAME)       

    let terminalname = "FP Markets MT4 Terminal";
    selector_select('tradedesk_selectterminal', terminalname);    
}


function onclick_home_trading_rightsection_1_2_0(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'option');

    if (platform.length == 0) {
        solution.add_module('option');     
    } 
    let ui  = solution.get('ui')        
    ui.platform_select(OPTION_PLATFORM_PNAME)       


    let projectname = 'DemoProject';        
    selector_select('option_selectproject', projectname);    
}

function onclick_home_trading_rightsection_2_0_0 (event) {
    let platform =  sb.get(main, 'pname', 'project');
//    LoaderDisplay(true);
    if (platform.length == 0) {
        solution.add_module('project');               
    } 
  
    let ui  = solution.get('ui')     
    ui.platform_select(PROJECT_PLATFORM_PNAME)   
    let project = selector_select('project_selectproject', 'DemoProject');
    if (!project) {
        return;
    }
    let strategyname = 'FRACTAL_CROSS';

    let timerId = setInterval((project, strategyname) => {
        if (project.Loaded) {
            clearInterval(timerId);
            selector_select('project_selectstrategy', strategyname);    

            onclick_sidebarmenu('sidebar_tester', 1)
            onclick_project_tester_commandgroup()    
        }    
    },  300, project,  strategyname); //5 minutes 300000	  


}
let widget;
    
    let trading_container = add_sectioncontainer (home_trading_rightsection, 'getstarted', 'Projects Template');
    widget = add_widget (trading_container, 'Algo Trading', icon_strategy);
    add_widgetdescription(widget, {type: 'html',  html: 'Create Trading Strategies'});
    add_widgetbutton (widget, 'see demo project', 'Launch Strategy Creator and load demo project')   


    widget = add_widget (trading_container, 'MT4 Terminal', icon_terminal);
    add_widgetdescription(widget, {type: 'html',  html:'Connect your MT4 Terminal'});
    add_widgetbutton (widget,'how to connect',  'How to connect Terminal platform with MT4 Terminal') 
    add_widgetbutton (widget,'see demo terminal',   'Launch Terminal platform') 

    widget = add_widget (trading_container, 'Yahoo Market', icon_terminal);
    add_widgetdescription(widget, {type: 'html',  html:'Inspect Stocks and options'});
    add_widgetbutton (widget, 'see yahoo terminal', 'Yahoo API not supported anymore') 

    trading_container = add_sectioncontainer (home_trading_rightsection, 'tester', 'Strayegy Tester');
    widget = add_widget (trading_container, 'Strategy Tester', icon_strategy);
    add_widgetdescription(widget, {type: 'html',  content: 'tester_widget_content ()'});
    add_widgetbutton (widget, 'see tester', 'Launch Strategy Creator Tester on a strategy of DemoProject')   

    trading_container = add_sectioncontainer (home_trading_rightsection, 'tools', 'Chart Tools');
    widget = add_widget (trading_container, 'Signals');
    add_widgetdescription(widget, {type: 'html',  html: "Indicators and Signals"});
    widget = add_widget (trading_container, 'Trackers');
    add_widgetdescription(widget, {type: 'html',  html: "Track your signals"});
    widget = add_widget (trading_container, 'Markers');
    add_widgetdescription(widget, {type: 'html',  html: "Mark composed signals"});

 //---------------------

function home_steps_diagram () {
    var content = '';

    content +=  '<ol class="process_diagram">';
    
    content += '<li>' +
    '               <div  id ="step_' +'0' + '" class= "EMVStep" onmousedown="onmousedown_emv_tree_step(this, event)" >' +
    '                   <div class="sb_widget-title">STEP ' + 0 + '</div>' +
    '                   <div>' + 'level 0' + '</div>' +
    '               </div>' +
    '           </li>';
    content += '<li><ul>';

    for (var i = 1; i < 3; i++) {
        content += '<li><ol>';
        content += '<li>' +
        '               <div id ="step_' +i + '" class= "EMVStep" onmousedown="onmousedown_emv_tree_step(this, event)" >' +
        '                   <div class="sb_widget-title">STEP ' + i + '</div>' +
        '                   <div >' + 'level 1' + '</div>' + 
        '               </div>' +
        '           </li>';
        for (var j = 0; j < 1; j++) {
            if (j == 0) {
                content += '<ul>';
            }
            content += '<li><div id ="step_' + j + '" class= "EMVSubStep" onmousedown="onmousedown_emv_tree_step(this, event)">' + 'level 2' + '</div></li>';
            if (j ==  0) {
                content += '</ul>';
            }
        }
        content += '</ol></li>';        
    }
    content += '</ul></li>'
    content += '</ol>'

    return content;
}


function emv_tester_widget_content () {
    content = 'To test your card emv payment you need to load EMV Terminal EMV Client and EMV Router and run them on your machine';

    return content;  
}

function emv_tester_widget_transaction () {
    content = 'Every EMV Transaction can be saved' +
    '<br>Check a Visa Transaction'
    return content;  
}

function onclick_emvwidget (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }    
 }
function onclick_home_emv_rightsection_1_0(elt, event) {
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }
    $('#emv_maincarousel').carousel(0);
}

function onclick_home_emv_rightsection_1_0_0(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'emv');

    if (platform.length == 0) {
        solution.add_module('emv');     
    } 
    let ui  = solution.get('ui')        
    ui.platform_select(EMV_PLATFORM_PNAME)       

    let projectname = 'DemoProject';   
    selector_select('emv_selectproject', projectname);
}


function onclick_home_emv_rightsection_1_1_0(elt, event) {
    SaveURIInFile('/EMV/Client/Client.zip', '')
}

function onclick_home_emv_rightsection_1_0_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/EMV/tree/main/Client", '_blank');
    win.focus();
}

function onclick_home_emv_rightsection_1_0 (event) {
    event.stopPropagation();   
    event.preventDefault();

    if ($('#emv_assistantpanel').css('display') != 'none') {
        return;
    }        
    $('#emv_maincarousel').carousel(2);
     sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback));
}

//------------------------------emv server

function onclick_home_emv_rightsection_1_1 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }

    $('#emv_maincarousel').carousel(0); 
}

function onclick_home_emv_rightsection_1_1_0(elt, event) {
    SaveURIInFile('/EMV/Client/Client.zip', '')
}

function onclick_home_emv_rightsection_1_1_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/EMV/tree/main/Server", '_blank');
    win.focus();
}



//------------------------------emv router

function onclick_home_emv_rightsection_1_2 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }
    $('#emv_maincarousel').carousel(1); 
}

function onclick_home_emv_rightsection_1_2_0(elt, event) {
    SaveURIInFile('/EMV/Servers/EMVRouter.js', '')
}

function onclick_home_emv_rightsection_1_2_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/Servers/blob/main/EMVRouter.js", '_blank');
    win.focus();
}


function onclick_home_emv_rightsection_2_0(elt, event) {
    if (!$('#emv_assistantpanel').is(':hidden')) {
        emv_AssistantPanel_Close ();    
    }
    $('#emv_maincarousel').carousel(2);   
}


function onclick_home_emv_rightsection_2_0_0 (event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'emv');

    if (platform.length == 0) {
        solution.add_module('emv');     
    } 
    let ui  = solution.get('ui')        
    ui.platform_select(EMV_PLATFORM_PNAME)       
    let projectname = 'DemoProject';   
    selector_select('emv_selectproject', projectname);

    onclick_sidebarmenu('sidebar_emvtestermanager', 1)
 }

function onclick_home_emv_rightsection_2_1_0 (event) {
    event.stopPropagation();    

    let platform =  sb.get(main, 'pname', 'emv');

    if (platform.length == 0) {
        solution.add_module('emv');     
    } 
    let ui  = solution.get('ui')        
    ui.platform_select(EMV_PLATFORM_PNAME)       
    let project = selector_select('emv_selectproject', 'DemoProject');
    if (!project) {
        return;
    }
    let transactionfile = "Visa.trs";

    let timerId = setInterval((project, transactionfile) => {
        if (project.Loaded) {
            clearInterval(timerId);
            onclick_sidebarmenu('sidebar_emvtestermanager', 1)
            $('#emv_tester_tab').tab('show');    
            Tester.Reader.load_transaction(transactionfile);
            onclick_emv_tester_commandgroup($('#emv_tester_play_button')[0])
       }    
    },  300, project, transactionfile); //5 minutes 300000	  
}



    let emv_container = add_sectioncontainer (home_emv_rightsection, 'projectsection', 'Project Templates');
    
    widget = add_widget (emv_container, 'EMV Platform', icon_card);
    add_widgetdescription(widget, {type: 'html',  html: 'Test EMV Cards on web'});
    add_widgetbutton (widget, 'see demo' , 'Launch EMV Platform and load demo project')   

    widget = add_widget (emv_container, 'EMV Client', icon_download);
    add_widgetdescription(widget, {type: 'html',  html: 'Card Reader'});
    add_widgetbutton (widget, 'download' , '')   
    add_widgetbutton (widget, 'github' , '')  
    add_widgetbutton (widget, 'how to insall' , '')      

    widget = add_widget (emv_container, 'EMV Server', icon_terminal);
    add_widgetdescription(widget, {type: 'html',  html: 'EMV Server'});
    add_widgetbutton (widget, 'download' , '')   
    add_widgetbutton (widget, 'github' , '')      

    widget = add_widget (emv_container, 'EMV Router', icon_terminal);
    add_widgetdescription(widget, {type: 'html',  html: 'Controls Communication for internet Testing'});
    add_widgetbutton (widget, 'download' , '')   
    add_widgetbutton (widget, 'github' , '')      
    
    emv_container = add_sectioncontainer (home_emv_rightsection, 'testersection', 'Tester');
    
    widget = add_widget (emv_container, 'EMV Tester', icon_terminal);
    add_widgetdescription(widget, {type: 'html',  content: 'emv_tester_widget_content ()'});
    add_widgetbutton (widget, 'see tester' , '')   
    
    widget = add_widget (emv_container, 'EMV Transactions', icon_terminal);
    add_widgetdescription(widget, {type: 'html',  content: 'emv_tester_widget_transaction ()'});
    add_widgetbutton (widget, 'Run CB/Visa Card example' , '')  
    
    emv_container = add_sectioncontainer (home_emv_rightsection, 'toolssection', 'EMV Tools');
    widget = add_widget (emv_container, 'TLV');
    add_widgetdescription(widget, {type: 'html',  html: 'LV Parser'});

    
function onclick_home_netprog_rightsection_1_1_1 (elt, event) {
    var win = window.open("https://github.com/jurextrade/NetProg", '_blank');
    win.focus();
}

function onclick_home_netprog_rightsection_1_0_0(event) {
    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'netprog');

    if (platform.length == 0) {
        solution.add_module('netprog');     
    } 
    let ui  = solution.get('ui')        
    ui.platform_select(NETPROG_PLATFORM_PNAME)       

    let projectname = 'DemoProject';   
    selector_select('netprog_selectproject', projectname);
}

    let netprog_container = add_sectioncontainer (home_netprog_rightsection, 'projectsection', 'Get Started - Project Templates');
    widget = add_widget (netprog_container, 'NetProg Platform', icon_download);
    add_widgetdescription(widget, {type: 'html',  html: 'Web  application'});
    add_widgetbutton (widget, 'see demo' , 'Launch NetProg Platform and load demo project')       

    widget = add_widget (netprog_container, 'Download', icon_download);
    add_widgetdescription(widget, {type: 'html',  html: 'Download NetProg Library'});
    add_widgetbutton (widget, 'download' , '')      
    add_widgetbutton (widget, 'github' , '')  


function home_init () {

    home_solution('home');    
    home_tradedesk_init_assistance();    

   
}

function home_end () {

}

//---------------------------------------------------------------------MODULE END -----------------------------------------------------------------------------//

function home_select (name) {
    
    //--- data ui platform update .............
    let ui  = solution.get('ui')    
    
// market          
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 
    ui.platform_expand(name, true);
    
    AnimationReset('animation')
    
// main
        $('#header').css ('display', '');
}

function home_solution (pname) {
    let  site           = solution.get('site');
    let  user           = solution.get('user')
    solution.HomePage   = HOME_TRADING;
}

function home_timer () {

}


//----------------------------------------------------   HOME MAIN BAR     ------------------------------------------------

function onclick_home_mainbar (elt, event) {
    switch (elt.id) {
        case "home_mainbar_trading":
            if (solution.HomePage != HOME_TRADING) {

                home_section.items= [home_trading_leftsection, home_trading_rightsection]
                
                $('#home_section').replaceWith(sb.render (home_section));
                home_tradedesk_init_assistance();   
                solution.HomePage = HOME_TRADING;                             
            }
            break;
        case "home_mainbar_emv":
            if (solution.HomePage != HOME_EMV) {
                home_section.items= [home_emv_leftsection, home_emv_rightsection]

                $('#home_section').replaceWith(sb.render (home_section));
                home_emv_init_assistance();
                solution.HomePage = HOME_EMV;
            }    
            break;
        case "home_mainbar_netprog":
            if (solution.HomePage != HOME_NETPROG) {
                home_section.items= [home_netprog_leftsection, home_netprog_rightsection]

                $('#home_section').replaceWith(sb.render (home_section));
                solution.HomePage = HOME_NETPROG;     
            }            
            break;
        case "home_mainbar_other":
            if (solution.HomePage != HOME_OTHER) {
                solution.HomePage = HOME_OTHER;                     
            }            
            break;                                    

    }    
}

//----------------------------------------------------  TRADE PANEL    ------------------------------------------------   

function trading_MainCarouselPanel () {
    var content = 
        sb.render (tradedesk_assistantpanel) +     
'       <div id="trading_maincarousel" class="featured carousel slide sb_panel" data-bs-ride="carousel">' +
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
'               <button  class="sb_roundbutton active" type="button" data-bs-target="#trading_maincarousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#trading_maincarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#trading_maincarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>' +
'           </div>' +
'  </div>';
return content;
}

//---------------------------------------------------- CONTACT PANEL------------------------------------------------ 






//----------------------------------------------------   WIDGETS PANEL    ------------------------------------------------   




//----------------------------------------------------ASSISTANT PANEL------------------------------------------------

function slideToggleCallback () {
    sb.resize(body)
}

function MT4AssistantRegister () {
    assistant_login = true;
    Register();
}
 
function onclick_checkout (event) {

    event.stopPropagation();    
    let platform =  sb.get(main, 'pname', 'tradedesk');
    LoaderDisplay(true);
    setTimeout(function() { 
        if (platform.length == 0) {
            solution.add_module('tradedesk');     
        } 
        let ui  = solution.get('ui')        
        ui.platform_select(TRADEDESK_PLATFORM_PNAME)       
     //   selector_select('project_selectproject', 'DemoProject');
        LoaderDisplay(false);        
    },5)
}

function onclick_tradedesk_assistantclose(elt) {
    sb.toggle ($('#tradedesk_assistantpanel'), sb.toggle ($('#trading_maincarousel'), slideToggleCallback));
}


function tradedesk_AssistantPanel () {
    var content = 
//'    <div id="tradedesk_assistantpanel" class="" style="display:' + (assistant_mode ? 'block' : 'none') + '">' +
'       <label class="sb_f_size12">Connect your MT4 Terminal</label>' +
'       <form  id="mt4assistantform"  class="assistant_panel">' +
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
'                                   <button class="assistant_button sb_button noactivate" title="" type="button" onclick="MT4AssistantRegister()"><i class="icon_mt4expert"></i>Login or Register</button>' +
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
'                                   <button id="checkout" class="assistant_button sb_button noactivate" onclick="onclick_checkout(event)" title="" type="button">Check Out</button>' +
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

//----------------------------------------------------ASSISTANT PANEL------------------------------------------------


function home_tradedesk_init_assistance() {

    var form = $("#mt4assistantform");    

    form.steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        enableAllSteps : true,
        enableKeyNavigation :true,
        startIndex : solution.UserId == "0" ? STEP_LOGIN : STEP_DOWNLOAD,

        onInit : function (event, currentIndex) {

            if (solution.UserId == "0") {  
                AssistantGoToStep ('mt4assistantform', STEP_LOGIN);
            }
            else {
                AssistantGoToStep ('mt4assistantform', STEP_DOWNLOAD);
            }
            $("#mt4assistantform").find(".actions").css ("display", "none");   // DEfault Prev next Buttons of jquery step
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
            $("#mt4assistantform").find(".carousel-control-next").css ("display", "flex")
            $("#mt4assistantform").find(".carousel-control-prev").css ("display", "flex")


            switch (currentIndex) {
                case STEP_LOGIN : 
                    $("#mt4assistantform").find(".carousel-control-prev").css ("display", "none");
                break;
                case STEP_DOWNLOAD : 
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

function trading_PresentationPanel () {
    var content =    
'	<label class="sb_f_size12">Tools for trading analysis</label>' +
'   <div class="sb_row">' +
'       <div class="presentation_image">' +
'           <img src="/A_PLATFORMS/home/res/home.svg" >' + 
'       </div>' +
'       <div class="presentation_description">' +
'           Wide range of tools available to traders that can help them identify potential trading opportunities and make informed decisions' +
'       </div>' +
'   </div>';
//'   <div class="sb_end"></div>' +

    return content;
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
   </div>`
    return content;
}


function netprog_PresentationPanel () {
    var content =    
'   <label class="sb_f_size12">Netprog</label>' +
'   <div class="sb_row">' +
'       <div class="presentation_image">' +
'           <img src="/A_PLATFORMS/netprog/res/netprog.svg" >' + 
'       </div>' +
'       <div class="presentation_description">' +
'           <p itemprop="description" class="description">NetProg is an API in C language allowing an homogeneous programming of communicating applications on many operating systems.<br><br>'+
'           It covers all the need for applications that requires complex way of exchanging data in synchronous or asynchronous mode.<br><br>' +
'           Based on messages for exchanging data between clients and servers, it, moreover, access databases or files with the same message modelling.<br></p>' +
'       </div>' +
'   </div>';
    return content;
}


//----------------------------------------------------   WIDGETS PANEL    ------------------------------------------------   

//------------------------------platform





//----------------------------------------------------   TOOLS WIDGETS PANEL    ------------------------------------------------   


function emvslideToggleCallback () {
    sb.resize(body)
}

//----------------------------------------------------ASSISTANT PANEL------------------------------------------------


function emv_AssistantPanel_Close() {
    assistant_login = false;    
    sb.toggle ($('#emv_maincarousel'), 1);
    sb.toggle ($('#emv_assistantpanel'), 0, emvslideToggleCallback);
}

function emv_AssistantPanel_Open() {
    sb.toggle ($('#emv_maincarousel'), 0);
    sb.toggle ($('#emv_assistantpanel'),1, emvslideToggleCallback);
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
//'    <div id="tradedesk_assistantpanel" class="" style="display:' + (assistant_mode ? 'block' : 'none') + '">' +
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
'                               <li class="card-text">You need to Register to be able to connect the Card Reader to EMV Terminal via the EMV Router.</li>' +
'                               <li class="card-text">Memorize the name and the password, these will be used as first step in Card Reader Program</li>' +
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

//----------------------------------------------------EMV ASSISTANT STEPS------------------------------------------------



function home_emv_init_assistance() {

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


//----------------------------------------------------  NETPROG CAROUSEL PANEL    ------------------------------------------------   

function netprog_MainCarouselPanel () {
    var content = 
//        sb.render (tradedesk_assistantpanel) +     
'       <div id="netprog_maincarousel" class="featured carousel slide sb_panel" data-bs-ride="carousel">' +
'           <label class="sb_f_size12">Featured</label>' +

'           <div class="carousel-inner">' +
'               <div class="carousel-item active">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/netprog/res/netprog1.jpg" alt=""></img>' +
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
'                       <img src="/A_PLATFORMS/netprog/res/netprog2.jpg" alt=""></img>' +
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
'                       <img src="/A_PLATFORMS/netprog/res/netprog3.jpg" alt=""></img>' +
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
'               <button  class="sb_roundbutton active" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>' +
'           </div>' +
'  </div>';
return content;
}


function add_sectioncontainer (section, id, label) {
    let index       = section.items.length; //frontbar at index 0;    
    let sectionid = section.id + '_' + index;
    let container = {id: sectionid + 'father', type: 'panel', class: 'sectioncontainer',  
            items: [
                {id: sectionid + '_h', type: 'label', class: "sb_f_size12", item: label},                
                {
                    id: sectionid, 
                    type: 'panel',       
                    class: 'sb_row sb_widget-container', 
                    items: []
                }
            ]  
          } 
          section.items.push (container)
          return container.items[1];
}

function add_widget (container, heading, icon) {
    let index       = container.items.length;
    let widgetid    = container.id + '_' + index;
    let widget      = {id: widgetid, type: 'widget',  heading: heading,  events: {onclick: 'onclick_' + widgetid + '(this, event)'}, icon : (icon ? icon : ''),
                      items:[], buttons: []};    
    container.items.push (widget);
    return widget;
}

function add_widgetdescription (widget, properties) {
    let index       = widget.items.length;
    let descid    = widget.id + '_description';
    let description = properties;
    description.id = descid;
    widget.items.push (description);
    return description;        
}

function add_widgetbutton (widget, name, title) {
    let index       = widget.buttons.length;
    widget.buttons.push ({callback: 'onclick_' + widget.id + '_' + index + '(event)', name: name, title : (title ? title : '')});
}


/*
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
    */