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
            modalserverpanel_select();    
        }    
        if (show == 0) {
            modalserverpanel_hide();            
        }
    }

    function serverPanel (id) {

        switch (id) {
            case 'tradedesk' :
                return tradedesk_PlatformsPanel();   
            break;
            case 'emv' :
                return ServerPanel(id, 'EMV Router Server');  
            break;
            case 'project' :
                return ServerPanel(id, 'Deploy Server');  
            break;
            case 'netprog' :
                return ServerPanel(id, 'NetProg Server');  
            break;
        }
        return '';
    }
//----------------------------------------------------   SERVER PANEL    ------------------------------------------------ 




function ServerPanel_Update (id) {
    let server, port, protocol;

    switch (id) {

        case 'emv' :
             server   = solution.EMVRouter_Address;
             port     = solution.EMVRouter_Port;
             protocol = solution.EMVRouter_Protocol;
        break;
        case 'project' :
            server   = solution.DeployServer_Address;
            port     = solution.DeployServer_Port;
            protocol = solution.DeployServer_Protocol;
       break;
        case 'netprog' :
            server   = solution.NetProgServer_Address;
            port     = solution.NetProgServer_Port;
            protocol = solution.NetProgServer_Protocol;
        break;
    }
   
    
    $('#secureradio_'+ id).prop("checked",  protocol  == 'https:') ;
    $('#unsecureradio_'+ id).prop("checked",protocol  == 'http:');   
    $('#nodeserveradress_'+ id).val(server);
    $('#nodeserverport_'+ id).val(port);
}

function onclick_ResetServer (id, elt, event) {
    ServerPanel_Update(id);
}

function onclick_ApplyServer (id, elt, event) {
    let newadress   =   $('#nodeserveradress_'+ id).val();
    let newport     =   $('#nodeserverport_'+ id).val();
    let protocol    =  $('#secureradio_'+ id).prop("checked") ? 'https:' : 'http:';



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
            RouterCom.Close ();
            EMVConnect(protocol + '//' + newadress, newport);
        
        break;
        case 'project' :
            solution.DeployServer_Address   = newadress;
            solution.DeployServer_Port      = newport;
            solution.DeployServer_Protocol  = protocol;
            DeployCom.Close ();
            DeployConnect(protocol + '//' + newadress, newport);
        
       break;
        case 'netprog' :
            solution.NetProgServer_Address  = newadress;
            solution.NetProgServer_Port     = newport;
            solution.NetProgServer_Protocol = protocol;
        break;
    }

    onclick_button_server()    
}

function onclick_RadioServer(id, http) {
    let port, sport
    switch (id) {

        case 'emv' :
            port = 5080;
            sport = 5440;
        
        break;
        case 'project' :
            port = 2080;
            sport = 2443;
        
       break;
        case 'netprog' :
            port = 4080;
            sport = 4440;
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



function ServerPanel (id, name) {
    var content = '';

    
    content = 
   `<div id="serverpanel_${id}"  class="">       		            
        <div class="sb_f_style_h6">${name}</div>
        <div id="" class="sb_bargroup ">
        <span class="sb_check  custom-control custom-radio ">
            <input id="secureradio_${id}" type="radio" class="custom-control-input" checked="" name="radio_http" onclick="onclick_RadioServer('${id}', \'secure\'); onclick_default_radio_item(this,event)" onchange="onchange_default_sb_item(this);" oninput="onchange_default_sb_item(this);">
            <label class="sb_label custom-control-label" for="secureradio_${id}">https</label>
        </span>
        <span class="sb_check  custom-control custom-radio ">
            <input id="unsecureradio_${id}" type="radio" class="custom-control-input" name="radio_http" onclick="onclick_RadioServer('${id}', \'unsecure\'); onclick_default_radio_item(this,event)" onchange="onchange_default_sb_item(this);" oninput="onchange_default_sb_item(this);">
            <label class="sb_label custom-control-label" for="unsecureradio_${id}">http</label>
        </span>
        </div>
        <div class="sb_formgroup">
        <label>Address</label>
        <input id ="nodeserveradress_${id}" class="form-control" value=""/>
        </div>     
        <div class="sb_formgroup">
        <label>Port</label>
        <input id ="nodeserverport_${id}" class="form-control" readonly value=""/>
        </div>   
        <div class="sb_buttongroup">
        <button class="sb_button"  type="button" onclick="onclick_ResetServer('${id}', this, event)">Reset</button>        
        <button class="sb_button"  type="button" onclick="onclick_ApplyServer('${id}', this, event)">Apply</button>
        </div>    
    </div>`;

    return content
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
