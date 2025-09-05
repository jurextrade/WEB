//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

const HOME_TRADING  = 0;
const HOME_EMV      = 1;
const HOME_NETPROG  = 2;
const HOME_OTHER    = 3;

const HOME_PLATFORM_PROJECT    = 'project';
const HOME_PLATFORM_NETPROG    = 'netprog';
const HOME_PLATFORM_EMV        = 'emv';
const HOME_PLATFORM_TRADEDESK  = 'tradedesk';

function slideToggleCallback () {
    sb.resize(body)
}


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

function onclick_home_trading_rightsection_1_0_0(elt, event) { 
    event.stopPropagation();

    let pname = HOME_PLATFORM_PROJECT;
    solution_module_load (pname, () => {
        let projectname = project_default_projectname;    
        selector_select('project_selectproject', projectname);
    })      
}

function onclick_home_trading_rightsection_1_1 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();
    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#tradedesk_assistantpanel'), sb.toggle ($('#trading_maincarousel'), slideToggleCallback));
    }
    $('#trading_maincarousel').carousel(1);   
}

function onclick_home_trading_rightsection_1_1_0(elt, event) { 
    event.stopPropagation();   
    event.preventDefault();
    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        return;
    }        
    $('#trading_maincarousel').carousel(2);
     sb.toggle ($('#trading_maincarousel'), sb.toggle ($('#tradedesk_assistantpanel'), slideToggleCallback));
}

function onclick_home_trading_rightsection_1_1_1(elt, event) { 
    event.stopPropagation();   

    let pname = HOME_PLATFORM_TRADEDESK;
    solution_module_load (pname, () => {
        let terminalname = tradedesk_default_terminalname;
        selector_select('tradedesk_selectterminal', terminalname);            
    })      
}

function onclick_home_trading_rightsection_1_2(elt, event) {
    event.stopPropagation();   
    event.preventDefault();    

    if ($('#tradedesk_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#tradedesk_assistantpanel'), sb.toggle ($('#trading_maincarousel'), slideToggleCallback));
    }
    $('#trading_maincarousel').carousel(2);    
}

function onclick_home_trading_rightsection_1_2_0(elt, event) { 
    event.stopPropagation();    

    let pname = OPTION_PLATFORM_PNAME;
    solution_module_load (pname, () => {
        let projectname = option_default_projectname;        
        selector_select('option_selectproject', projectname);          
    })     
}

function onclick_home_trading_rightsection_2_0 (elt, event) {
    onclick_home_trading_rightsection_1_0(elt, event)
}

function onclick_home_trading_rightsection_2_0_0 (elt, event) { 
    event.stopPropagation();    

    let pname = HOME_PLATFORM_PROJECT;
    solution_module_load (pname, () => {
        let project = selector_select('project_selectproject', project_default_projectname);
        let strategyname = 'FRACTAL_CROSS';
        
        LoaderDisplay(true);     
        let timerId = setInterval((project, strategyname) => {
            if (project.Loaded) {
                LoaderDisplay(false);                
                clearInterval(timerId);
                selector_select('project_selectstrategy', strategyname);    
                sidebarmenu_select('sidebar_tester', 1)
                onclick_project_tester_commandgroup()    
            }    
        },  300, project,  strategyname); 	 
    })         
 
}

function onclick_home_trading_rightsection_3_0 (elt, event) {
    onclick_home_trading_rightsection_1_0(elt, event)
}


function onclick_home_trading_rightsection_3_1 (elt, event) {
    onclick_home_trading_rightsection_1_0(elt, event)
}


function onclick_home_trading_rightsection_3_1_0 (elt, event) { 
    event.stopPropagation();    

    let pname = HOME_PLATFORM_PROJECT;
    solution_module_load (pname, () => {
       let indicatorname = 'BAR';
        onclick_projecttabs($('#tab-chart')[0], event);
        onclick_controlsbottompanel($('#fullscreen')[0], event);    
        Chart_AddIndicator('BAR');
        Chart_AddIndicator('DOWNFRACTAL');
        Chart_AddIndicator('UPFRACTAL');
        Chart_AddIndicator('PIVOT_POINT');    

        ChartSignalsPanel_Update(null, true);       
    })         
}

function onclick_home_trading_rightsection_3_2 (elt, event) {
    onclick_home_trading_rightsection_1_0(elt, event)
}


function onclick_home_trading_rightsection_3_2_0 (elt, event) { 
    onclick_home_trading_rightsection_3_1_0(elt, event);

    tools_panel_pin(1)    
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

    widget = add_widget (trading_container, 'Trackers');
    add_widgetdescription(widget, {type: 'html',  html: "Track your signals"});
    add_widgetdescription(widget, {type: 'html',  html: "Indicators and the corresponding Signals added on your chart can be tracked"});
    add_widgetbutton (widget, 'indicator example', 'Track signals of the BAR, Fractals and PIVOT day indicator')      

    widget = add_widget (trading_container, 'Markers');
    add_widgetdescription(widget, {type: 'html',  html: "Markers"});
    add_widgetdescription(widget, {type: 'html',  html: "While Tracking your signals by double clicking on the chart you can mark all the signals"});
    add_widgetbutton (widget, 'Marker Panel', 'See Markers')     

 //---------------------

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

function onclick_home_emv_rightsection_1_0_0(elt, event) { 
    event.stopPropagation();    

    let pname = HOME_PLATFORM_EMV;
    solution_module_load (pname, () => {
        let projectname = emv_default_projectname;   
        selector_select('emv_selectproject', projectname); 
    })         
}

//------------------------------emv cards reader

function onclick_home_emv_rightsection_1_1 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }

    $('#emv_maincarousel').carousel(0); 
}

function onclick_home_emv_rightsection_1_1_0(elt, event) {
    SaveURIInFile('/EMV/Client/EMVClient64.exe', '')
}

function onclick_home_emv_rightsection_1_1_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/EMV/tree/main/Client", '_blank');
    win.focus();
}

function onclick_home_emv_rightsection_1_1_2(elt, event) {
    event.stopPropagation();   
    event.preventDefault();

    if ($('.emv_assistant_cardreader').length != 0) {
        if ($('#emv_assistantpanel').css('display') != 'none') {
            return;
        } else {
            sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
        }         
    } else {
        $('#emv_assistantpanel').html(emv_AssistantPanel('cardreader'));
        home_emv_init_assistance();
        if ($('#emv_assistantpanel').css('display') != 'none') {
    //        sb.toggle ($('.emv_assistant_emvserver'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
        }    
        else {
            sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
        }
    }
    if ($('.emv_assistant_cardreader').css('display') != 'none') {
        return;
    }        
    $('#emv_maincarousel').carousel(2);
    $('#emv_assistantpanel').html(emv_AssistantPanel('cardreader'));
    home_emv_init_assistance();

    sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
}

//------------------------------emv server

function onclick_home_emv_rightsection_1_2 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }

    $('#emv_maincarousel').carousel(1); 
}

function onclick_home_emv_rightsection_1_2_0(elt, event) {
    SaveURIInFile('/EMV/Server/EMVServer64.exe', '')
}

function onclick_home_emv_rightsection_1_2_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/EMV/tree/main/Server", '_blank');
    win.focus();
}

function onclick_home_emv_rightsection_1_2_2(elt, event) {
    event.stopPropagation();   
    event.preventDefault();
    
    if ($('.emv_assistant_emvserver').length != 0) {
        if ($('#emv_assistantpanel').css('display') != 'none') {
            return;
        } else {
            sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
        }         
    } else {
        $('#emv_assistantpanel').html(emv_AssistantPanel('emvserver'));
        home_emv_init_assistance();
        if ($('#emv_assistantpanel').css('display') != 'none') {
         //   sb.toggle ($('.emv_assistant_cardreader'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
        }    
        else {
            sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback)); 
        }
    }
}

//------------------------------emv router

function onclick_home_emv_rightsection_1_3 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }
    $('#emv_maincarousel').carousel(1); 
}

function onclick_home_emv_rightsection_1_3_0(elt, event) {
    SaveURIInFile('/EMV/Servers/EMVRouter.js', '')
}

function onclick_home_emv_rightsection_1_3_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/Servers/blob/main/EMVRouter.js", '_blank');
    win.focus();
}

function onclick_home_emv_rightsection_1_3_2(elt, event) {
    event.stopPropagation();   
    event.preventDefault();
    if ($('#emv_assistantpanel').css('display') != 'none') {
        return;
    }        
    $('#emv_maincarousel').carousel(1);
     sb.toggle ($('#emv_maincarousel'), sb.toggle ($('#emv_assistantpanel'), slideToggleCallback));
}

function onclick_home_emv_rightsection_1_3 (elt, event) { 
    event.stopPropagation();   
    event.preventDefault();    
}

function onclick_home_emv_rightsection_1_3_1(elt, event) {
    var win = window.open("https://github.com/jurextrade/Servers/blob/main/EMVRouter.js", '_blank');
    win.focus();
}

function onclick_home_emv_rightsection_2_0(elt, event) {
    event.stopPropagation();   
    event.preventDefault();    
    
    if ($('#emv_assistantpanel').css('display') != 'none') {
        sb.toggle ($('#emv_assistantpanel'), sb.toggle ($('#emv_maincarousel'), slideToggleCallback)); 
    }
    $('#emv_maincarousel').carousel(2);   
}

function onclick_home_emv_rightsection_2_0_0 (elt, event) { 
    event.stopPropagation();    

    let pname = HOME_PLATFORM_EMV;
    solution_module_load (pname, () => {
        let projectname = emv_default_projectname;   
        selector_select('emv_selectproject', projectname);

        sidebarmenu_select('sidebar_emvtestermanager', 1)        
    })         
 }

function onclick_home_emv_rightsection_2_1_0 (elt, event) { 
    event.stopPropagation();    

    let pname = HOME_PLATFORM_EMV;
    solution_module_load (pname, () => {
        let project = selector_select('emv_selectproject', emv_default_projectname);
        let transactionfile = "visa.trs";
        
        LoaderDisplay(true);     
        let timerId = setInterval((project, transactionfile) => {
            if (project.Loaded) {
                LoaderDisplay(false);                 
                clearInterval(timerId);
                sidebarmenu_select('sidebar_emvtestermanager', 1)
                $('#emv_tester_tab').tab('show');    
                Tester.Reader.load_transaction(transactionfile);
                onclick_emv_tester_commandgroup($('#emv_tester_play_button')[0])
        }    
        },  300, project, transactionfile);         
    })         
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
    add_widgetbutton (widget, 'how to insall' , '')      

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

function onclick_home_netprog_rightsection_1_0_0(elt, event) { 
    event.stopPropagation();    

    let pname = HOME_PLATFORM_NETPROG;
    solution_module_load (pname, () => {
        let projectname = netprog_default_projectname;   
        selector_select('netprog_selectproject', projectname);        
    })         
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


//----------------------------------------------------ASSISTANT PANEL------------------------------------------------


function MT4AssistantRegister () {
    assistant_login = true;
    Register();
}
 
function onclick_checkout (event) {
    event.stopPropagation();    
        let pname = HOME_PLATFORM_TRADEDESK;
        solution_module_load (pname, () => {
    })
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
        startIndex : solution.get('user').id == "0" ? STEP_LOGIN : STEP_DOWNLOAD,

        onInit : function (event, currentIndex) {

            if (solution.get('user').id == "0") {  
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
                 /*   if (solution.get('user').id != "0") {                 
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
        sb.render (emv_assistantpanel('cardreader')) +     
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
'                               <div class="card-title">EMV SERVER - Configure your terminal</div>' +   
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
'   </div>';
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


function emv_AssistantPanel (id) {
    var content =  (id == 'cardreader') ?
'       <label class="sb_f_size12">Install Card Reader</label>' +
'       <form  id="emvassistantform"  class="assistant_panel emv_assistant_' + id + '">' +
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
'                               <li> </li>' +
'                               <li class="card-text">You need to Register to be able to connect the Card Reader to EMV Terminal via the EMV Router.</li>' +
'                               <li class="card-text">Memorize the name and the password, these will be used as first step in Card Reader Program</li>' +
'                               <div class="sb_formgroup sb_buttongroup card-text">' +
'                                   <button class="assistant_button sb_mbutton noactivate" title="" type="button" onclick="emv_assistant_register()"><i class="icon_mt4expert"></i>Login or Register</button>' +
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
'                               <li> </li>' +
'                               <li class="card-text">Download Card Reader Program on your local machine (to download source files check github in home page).' + 
'                                   <button id="downloadbutton" class="sb_mbutton" onclick="event.preventDefault();SaveURIInFile(\'/EMV/Client/EmvClient64.exe\', \'\')">Download</button>' +
'                               </li>' +
'                               <li class="card-text">Create Client Folder on your machine and copy the program you downloaded </li>' +
'                               <li class="card-text">Execute Program EMVClient64.exe <i>&lt;EMVRouter_address = localhost&gt; &lt;EMVServer_address = localhost&gt; &lt;Login_Server = www.jurextrade.com &gt;</i></li>' +
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
'                               <li class="card-text">Card Reader will ask you to login to Router Server that you should install on your machine</li>' +
'                               <li class="card-text">You enter the name and the password that you used to this site</li>' +
'                               <li class="card-text">Press Checkout you should see the card connected and ready to run ...</li>' +
'                               <div class="sb_formgroup sb_buttongroup card-text">' +
'                                   <button id="checkout" class="assistant_button sb_mbutton noactivate" onclick="onclick_emvcheckout(this)" title="" type="button">Check Out</button>' +
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
'       </div>' :


'       <label class="sb_f_size12">Install EMV Server</label>' +
'       <form  id="emvassistantform"  class="assistant_panel emv_assistant_' + id + '">' +
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
'                               <li> </li>' +
'                               <li class="card-text">You need to Register to be able to connect the Card Reader to EMV Terminal via the EMV Router.</li>' +
'                               <li class="card-text">Memorize the name and the password, these will be used as first step in Card Reader Program</li>' +
'                               <div class="sb_formgroup sb_buttongroup card-text">' +
'                                   <button class="assistant_button sb_mbutton noactivate" title="" type="button" onclick="emv_assistant_register()"><i class="icon_mt4expert"></i>Login or Register</button>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </section>' + 
'           <h3>Download EMV Server</h3>' + 
'           <section>' + 
'               <div class="sb_row sb_panel">' +
'                   <img src="/A_PLATFORMS/emv/res/emv2.jpg" alt=""></img>' +
'                   <div class="card col9">' +
'                       <div class="card-header"> <img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                       <div class="card-body">' +
'                           <div class="card-title"></div>' +
'                           <div class= "mb-3">' +    
'                               <li> </li>' +
'                               <li class="card-text">Download EMV Server Program on your local machine (to download source files check github in home page)' + 
'                                   <button id="downloadbutton" class="sb_mbutton" onclick="event.preventDefault();SaveURIInFile(\'/EMV/Server/EmvServer64.exe\', \'\')">Download</button>' +
'                               </li>' +
'                               <li class="card-text">Create Server Folder on your machine and copy the program you downloaded </li>' +
'                               <li class="card-text">Execute Program EMVServer64.exe <i>&lt;EMVRouter_address = localhost&gt; &lt;Login_Server = www.jurextrade.com &gt;</i></li>' +
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
'                               <li class="card-text">Card Reader will ask you to login to Router Server that you should install on your machine</li>' +
'                               <li class="card-text">You enter the name and the password that you used to this site</li>' +
'                               <li class="card-text">Press Checkout you should see the card connected and ready to run ...</li>' +
'                               <div class="sb_formgroup sb_buttongroup card-text">' +
'                                   <button id="checkout" class="assistant_button sb_mbutton noactivate" onclick="onclick_emvcheckout(this)" title="" type="button">Check Out</button>' +
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
        startIndex : solution.get('user').id == "0" ? STEP_LOGIN : STEP_DOWNLOAD,

        onInit : function (event, currentIndex) {

            if (solution.get('user').id == "0") {  
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
                 /*   if (solution.get('user').id != "0") {                 
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
'                           <div class="card-body">' +
'                               <div class="card-title">Strong Points</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">Profit of 80 % of time and means in developments of communicating applications multi-platforms on TCP/IP </li>' +
'                                   <li class="card-text">API multi-platforms: UNIX, Windows, IBM,...</li>' +
'                                   <li class="card-text">Transcoding of  characters</li>' +
'                                   <li class="card-text">Newspaper of  transfers allowing to index the transfers carried out with mechanisms of recovery</li>' +
'                                   <li class="card-text">Interpreted language allowing instantaneous programming of orders distributed on the various machines</li>' +
'                                   <li class="card-text">Connections to data bases</li>' +
'                                   <li class="card-text">Synchronous or asynchronous communication</li>' +

'                               </div>' +

'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel" style="overflow:auto">' +
                      sb.render (home_netprog_protocols) +
'                   </div>' +
'               </div>' +
'           </div>' +
'           <div class="carousel-indicators bottomcarousel">' +
'               <button  class="sb_roundbutton active" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>' +

'           </div>' +
'   </div>';
    return content;
}

function add_sectioncontainer (section, id, label) {
    let index       = section.items[1].items.length + 1; //frontbar at index 0;    
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
          section.items[1].items.push (container)
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
    widget.buttons.push ({callback: 'onclick_' + widget.id + '_' + index + '(this, event)', name: name, title : (title ? title : '')});
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