function ThemePanel (id) {
    let content= '';
    content += 
    '   <h6 class="sb_sidebarheader">Themes</h6>' + 
        sb.render ({id: id +'_dark',      item: 'Dark (dark)',        type: 'radio', attributes: {name: 'theme_' + id, checked: true}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_light',     item: 'Light (light)',      type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_remix',     item: 'Remix (dark)',       type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_midcentury',item: 'Midcentury (light)', type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_candy',     item: 'Candy (light)',      type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_hackerowl', item: 'HackerOwl (dark)',   type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_cerulean',  item: 'Cerulean (light)',   type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_flatly',    item: 'Flatly (light)',     type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_spacelab',  item: 'Spacelab (light)',   type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}})+
        sb.render ({id: id +'_cyborg',    item: 'Cyborg (dark)',      type: 'radio', attributes: {name: 'theme_' + id}, events: {onclick: "onclick_theme(this, event)"}});
    return content;
}


function ThemePanel_Update () {
}

function onclick_theme (elt, event) {
    
    let themeid = elt.id.split('_')[1];
    let rootelt  = $(elt).closest ('.sb_root');    
    rootelt.attr('theme', themeid)
}

    //--------------------------------------------------------------------- ROUTER CONFIG ------------------------------------------------------------


    function modalserverpanel_hide () {
        let routerpanel = $('#modalserverpanel_' + solution.ui.currentplatform_pname);   
        let toresize     = routerpanel.hasClass ('pinned');    
        
        routerpanel.css ({'transition':''});
    
        routerpanel.removeClass('toggled')
    
        if (toresize) {
            sb.resize(sb.interface);        
        }
    }
    
    function modalserverpanel_select () {
        let routerpanel = $('#modalserverpanel_' + solution.ui.currentplatform_pname);   
        let toresize     = routerpanel.hasClass ('pinned');    

        routerpanel.addClass('toggled')
      
        if (toresize) {
            sb.resize(sb.interface);        
        }
    }
    
    
    function onclick_button_server (elt, event) {

        let show = !$('#modalserverpanel_' + solution.ui.currentplatform_pname).hasClass('toggled');   
   
        if (show == 1) {
            onclick_ResetServer(solution.ui.currentplatform_pname, elt, event)            
            modalserverpanel_select();    
        }    
        if (show == 0) {
            modalserverpanel_hide();            
        }
    }


//----------------------------------------------------   SERVER PANEL    ------------------------------------------------ 




function ServerPanel_Update (id) {
    let server, port, protocol, reconnection;

    switch (id) {

        case 'emv' :
             server         = solution.EMVRouter_Address;
             port           = solution.EMVRouter_Port;
             protocol       = solution.EMVRouter_Protocol;
             reconnection   = solution.EMVRouter_Reconnection;             
        break;
        case 'project' :
            server          = solution.DeployServer_Address;
            port            = solution.DeployServer_Port;
            protocol        = solution.DeployServer_Protocol;
            reconnection    = solution.DeployServer_Reconnection;                         
       break;
        case 'netprog' :
            server          = solution.NetProgServer_Address;
            port            = solution.NetProgServer_Port;
            protocol        = solution.NetProgServer_Protocol;
            reconnection    = solution.NetProgServer_Reconnection;             
        break;
        case 'tradedesk' :
            server          = solution.MT4Server_Address;
            port            = solution.MT4Server_Port;
            protocol        = solution.MT4Server_Protocol;
            reconnection    = solution.MT4Server_Reconnection;                         
        break;
    }
   

    $('#secureradio_'+ id).prop("checked",  protocol  == 'https:') ;
    $('#unsecureradio_'+ id).prop("checked",protocol  == 'http:');   
    document.getElementById('nodeserveradress_'+ id).value = server;
    document.getElementById('nodeserverport_'+ id).value =  port;
    reconnection  ? $('#reconnection_'+ id).prop ('checked', true) : $('#reconnection_'+ id).prop ('checked', false)
}

function onclick_ResetServer (id, elt, event) {
    ServerPanel_Update(id);
}

function onclick_CloseServer (id, elt, event) {
    onclick_button_server()    
}

function onclick_ApplyServer (id, elt, event) {
    let newadress    =  $('#nodeserveradress_'+ id).val();
    let newport      =  $('#nodeserverport_'+ id).val();
    let protocol     =  $('#secureradio_'+ id).prop("checked") ? 'https:' : 'http:';
    let reconnection =  $('#reconnection_'+ id).prop("checked");


    if (newadress.startsWith("http://")) {
        newadress.replace ("http://", "")
    } 
    if (newadress.startsWith("https://")) {
        newadress.replace ("https://", "")
    }
    switch (id) {

        case 'emv' :
            solution.EMVRouter_Address  = newadress;
            solution.EMVRouter_Port     = newport;
            solution.EMVRouter_Protocol = protocol;
            solution.EMVRouter_Reconnection   = reconnection;          
            emv_RouterCom.Close ();
            EMVConnect(protocol + '//' + newadress, newport, reconnection);
        
        break;
        case 'project' :
            solution.DeployServer_Address   = newadress;
            solution.DeployServer_Port      = newport;
            solution.DeployServer_Protocol  = protocol;
            solution.DeployServer_Reconnection   = reconnection;               
            project_DeployCom.Close ();
            DeployConnect(protocol + '//' + newadress, newport, reconnection);
        
       break;
        case 'netprog' :
            solution.NetProgServer_Address  = newadress;
            solution.NetProgServer_Port     = newport;
            solution.NetProgServer_Protocol = protocol;
            solution.NetProgServer_Reconnection   = reconnection;                    
        break;
        case 'tradedesk' :
            solution.MT4Server_Address   = newadress;
            solution.MT4Server_Port      = newport;
            solution.MT4Server_Protocol  = protocol;
            solution.MT4Server_Reconnection   = reconnection;   
            tradedesk_MT4Com.Close ();
            MT4Connect(protocol + '//' + newadress, newport, reconnection)     
        break;        
    }

    onclick_button_server()    
}

function onclick_RadioServer(id, http) {
    let port, sport
    switch (id) {

        case 'project' :
            port = 3080;
            sport = 3443;
        
       break;
        case 'tradedesk' :
            port = 2080;
            sport = 2443;
        break;        
        case 'netprog' :
            port = 4080;
            sport = 4443;
        break;
        case 'emv' :
            port = 5080;
            sport = 5443;
        break;
    }    
    switch (http) {
        case 'secure' :
            $('#nodeserverport_'+ id).val(sport);            
        break;
        case 'unsecure' :
            $('#nodeserverport_' + id).val(port);            
        break;
    }
}


//------------------------------------------------------------ NETPROG SETTINGS PANEL ----------------------------------------------------------

function netprog_ServerPanel () {
    var content = '';
    
    content = 
    '<div id="serverstable" class="">'+       		            
    '   <div class="sb_f_style_h6">NetProg Server</div>' +
    '   <div class="sb_formgroup">' +
    '       <label>Address</label>' +
    '       <input id ="c" class="form-control" value=""/>' +
    '   </div>' +     
    '   <div class="sb_formgroup">' +
    '       <label>Port</label>' +
    '       <input id ="netprogserverport" class="form-control" value=""/>' +
    '   </div>' +   
    '   <div class="sb_buttongroup">' +
    '       <button class="sb_button"  type="button" onclick="onclick_ResetNetProgServer(this, event)">Reset</button>' +        
    '       <button class="sb_button"  type="button" onclick="onclick_ApplyNetProgServer(this, event)">Apply</button>' +
    '   </div>' +      
    '</div>';
    return content
}

function netprog_ServerPanel_Update () {
    let protocol = solution.get('site').protocol + '//';

    $('#netprogserveradress').val(solution.MT4Server_Address);
    $('#netprogserverport').val(solution.MT4Server_Port);
}

function onclick_ResetNetProgServer (elt, event) {
    $('#netprogserveradress').val(solution.MT4Server_Address);
    $('#netprogserverport').val(solution.MT4Server_Port);
}

function onclick_ApplyNetProgServer (elt, event) {
    let newadress  =   $('#netprogserveradress').val();
    let newport    =   $('#netprogserverport').val();
//    Tester.Reader.Com.Close ();
//    EMVConnect(Tester.Reader, newadress, newport);

}

function solution_serverpanel () {
    var content = '';
    
    content = 
    '<div id="serverstable" class="">'+       		            
    '   <h6 class="sb_sidebarheader">NetProg Server</h6>' +
    '   <div class="sb_formgroup">' +
    '       <label>Adress</label>' +
    '       <input id ="c" class="form-control" value=""/>' +
    '   </div>' +     
    '   <div class="sb_formgroup">' +
    '       <label>Port</label>' +
    '       <input id ="netprogserverport" class="form-control" value=""/>' +
    '   </div>' +   
    '   <div class="sb_buttongroup">' +
    '       <button class="sb_button"  type="button" onclick="onclick_ResetNetProgServer(this, event)">Reset</button>' +        
    '       <button class="sb_button"  type="button" onclick="onclick_ApplyNetProgServer(this, event)">Apply</button>' +
    '   </div>' +      
    '</div>';
    return content
}
