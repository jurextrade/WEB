//---------------------------------------------------- NETPROG PRESENTATION PANEL------------------------------------------------ 

function onclick_othertools (elt, event) { 
    event.preventDefault();
    window.open("./ExProject/index.php");
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


function netprog_home_open () {
    if (!sb.tab_finditem(netprog_maintabs, 'netprog_home_tab')) { 
        let hometabitem  = {id: 'netprog_home_tab',     item: 'Home',      type:'link', icon:  icon_home,       items: [netprog_home_section], onclose: 'onclick="onclick_netprog_tab_close(this, event)"',    title: 'Home',      events: {onclick:"onclick_netprog_tab(this, event)"}};
        
        sb.tab_additem(netprog_maintabs, hometabitem, 1);
    } 
    sb.tab_select(netprog_maintabs, 'netprog_home_tab');
}

//----------------------------------------------------   WIDGETS PANEL    ------------------------------------------------   


function onclick_downloadnetprog (elt, event) {
  
}

function onclick_netprogdownload (elt, event) {
   // window.location.href = "https://github.com/jurextrade/NetProg"  
    var win = window.open("https://github.com/jurextrade/NetProg", '_blank');
    win.focus();
}

function netprog_GetStartedSection_Panel () {
    var content = 
       '<label class="sb_f_size12">Get Started - Project Templates</label>' +
       '<div class="sb_row sb_widget-container">' +
            sb_widget_create ('downloadnetprog',  'onclick_downloadnetprog(this, event)',    icon_download, 'Download ', 'Download NetProg Library', ['onclick_netprogdownload(event)'], ['GitHub']) +
     //       sb_widget_create ('tradedeskconnect',  'onclick_connectMT4Terminal(this, event)', icon_terminal, 'MT4 Terminal',    'Connect your MT4 Terminal') +
     //       sb_widget_create ('optionstutorial',   'onclick_optionstutorial(this, event)',    icon_strategy, 'Options',         'Yahoo Options') +                
       '</div>' 
    return content;
}

function netprog_ToolsSection_Panel () {
    return "";
    var content = 
       '<label class="sb_f_size12">Chart Tools</label>' +
       '<div class="sb_row sb_widget-container">' +
            sb_widget_create ('signalstutorial',   'onclick_signalstutorial(this, event)',  icon_strategy,  'Signals', "Indicators and Signals") +                
            sb_widget_create ('trackersstutorial', 'onclick_trackerstutorial(this, event)', icon_strategy,  'Trackers',"Track your signals") +                
            sb_widget_create ('markerstutorial',   'onclick_markerstutorial(this, event)',  icon_strategy,  'Markers', "Mark composed signals") +
       '</div>' 
    return content;
}
