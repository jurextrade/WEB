function ondblclick_header () {
 //   return
    if (!solution) return;
    let ui  = solution.get('ui')    
    //ui.platform_expand ();
}

function onclick_headerbrand (elt, event) {
    let ui  = solution.get('ui')    
    let platformpname = ui.currentplatform_pname;

    switch (platformpname) {
        case 'netprog' :
            if (!sb.tab_finditem(netprog_maintabs, 'netprog_home_tab')) { 
                let filetabitem    = {id: 'netprog_home_tab',     item: 'Home',      type:'link', icon:  icon_home,       items: [netprog_home_section], onclose: 'onclick="onclick_netprog_tab_close(this, event)"',    title: 'Home',      events: {onclick:"onclick_netprog_tab(this, event)"}}           
                sb.tab_additem(netprog_maintabs, filetabitem);
            } 
            sb.tab_select(netprog_maintabs, 'netprog_home_tab');
        break;
        case 'emv' :
            if (!sb.tab_finditem(emv_maintabs, 'emv_home_tab')) { 
                let filetabitem    = {id: 'emv_home_tab',     item: 'Home',      type:'link', icon:  icon_home,       items: [emv_home_main], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Home',      events: {onclick:"onclick_emv_tab(this, event)"}}
                sb.tab_additem(emv_maintabs, filetabitem);
            } 
            sb.tab_select(emv_maintabs, 'emv_home_tab');
        break;

    }    
}

function UserProfileName  () {
    let cuser          = solution.get('user')   
    let registered  = cuser.is_registered();   
    if (registered) {
        return '<div>Hello ' + cuser.name + '</div>';
    }          
    return '<div></div>';
}

function onclick_menutheme (elt, event) {
    let themeelt = $(elt).find('input');
    let themeid = themeelt.attr('id');
    themeelt.prop ('checked', true)
    event.stopPropagation ()

    
  //  themeelt.trigger('click')

    let ui          = solution.get('ui')  
    ui.update_theme(themeid);
}
    
function onclick_switchrecognition  (event) {
    event.stopPropagation();
    event.preventDefault();      
    if (event.target.id != 'switchrecognition') {
        $('#switchrecognition').trigger( "click" )        
        return;
    }    
    let checked = $('#switchrecognition').prop('checked');
    Recognition_set (checked, false, true); 
    $('#button_recognition').toggleClass ('checked')    
}

function onclick_switchsound (event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.id != 'switchsound') {
        $('#switchsound').trigger( "click" )        
        return;
    }
    let checked = $('#switchsound').prop('checked');
    Sound_set (checked, false, true); 
    $('#button_sound').toggleClass ('checked')
}

function UserProfileMenu () {
    let cuser          = solution.get('user')        
    let notregistered  = !cuser.is_registered();

    let userurl         = (notregistered ? '' : cuser.name)
    let loginfunc       = (notregistered ? 'onclick="SignIn()"' : 'onclick="SignOut()"');    
    let signinlabel     = (notregistered ? '<a class="dropdown-item"' + loginfunc +'>Sign In</a><a class="dropdown-item"  onclick="Register()">Join Now</a>' : '');
    let signoutlabel    = (notregistered ? '' :  '<a class="dropdown-item"' + loginfunc +'>Sign Out</a>');

    var content =     

'       <a class="sb_link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
'           <i class="' + icon_user + '" ></i>' +

'       </a>' +
'       <div id="profiledropdown" class="dropdown-menu" ondblclick="event.stopPropagation()">' +
            signinlabel +
            signoutlabel +                
'           <div class="dropdown-divider"></div>';
            
            platforms   = sb.get(sb.interface, 'type', 'root');    
            
            for (var i= 0; i < platforms.length; i++) {
              content += '<a class="dropdown-item" onclick="{let ui  = solution.get(\'ui\'); ui.platform_select(\'' + platforms[i].pname + '\')}">' + platforms[i].name + '</a>';
            }

            let attributes;

            if (platforms.length != 0) {
                content += '           <div class="dropdown-divider"></div>';   
            }
            content += 
'           <a class="dropdown-item" onclick="onclick_switchsound (event);"      ><div class="form-switch"><input type="checkbox" class="form-check-input" id="switchsound">      <label class="form-check-label"  for="switchsound">Sound On</label>      </div></a>' +
'           <a class="dropdown-item" onclick="onclick_switchrecognition (event);"><div class="form-switch"><input type="checkbox" class="form-check-input" id="switchrecognition"><label class="form-check-label"  for="switchrecognition">Micro On</label></div></a>' +
'           <li>' +
'               <a class="dropdown-item" style = "background: var(--theme-bg-color);">Theme</a>' +
//'                   <div class="dropdown-menu dropdown-submenu">' +
'                   <div class="">' +

'                       <a class="dropdown-item" onclick="onclick_menutheme(this, event)">';
                        attributes = sb.theme == 'dark' ? {...{name: 'theme'}, ...{checked:true}} : {name: 'theme'};
                        content += sb.render ({id: 'dark',  item: 'Dark (dark)',   type: 'radio', attributes: attributes, events: {}})+
'                       </a>' +
'                       <a class="dropdown-item" onclick="onclick_menutheme(this, event)">';
                        attributes = sb.theme == 'light' ? {...{name: 'theme'}, ...{checked:true}} : {name: 'theme'};
                        content += sb.render ({id: 'light', item: 'Light (light)', type: 'radio', attributes: attributes,  events: {}})+
'                       </a>' +
'                       <a class="dropdown-item" onclick="onclick_menutheme(this, event)">';
                        attributes = sb.theme == 'remix' ? {...{name: 'theme'}, ...{checked:true}} : {name: 'theme'};
                        content += sb.render ({id: 'remix', item: 'Remix (dark)',  type: 'radio', attributes: attributes, events: {}})+
'                       </a>' +
'                   </div>' +
'           </li>' +
'           <div class="dropdown-divider"></div>' +
'           <a class="dropdown-item" onclick="onclick_solution_settings(event)">Settings</a>' +
'       </div>';

    return content;
}

