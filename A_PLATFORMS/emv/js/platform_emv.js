//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function emv_init () {

// market          
    let ui  = solution.get('ui')     
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 

    Tester = new emvtester();
    emv_solution()
    EMVConnect(solution.EMVRouter_Address, solution.EMVRouter_Port);     
    emv_home_init () ;

//    emv_loadproject()    
    emv_tester_init();

    emv_ServerPanel_Update();
    emv_TLVParserPanel_Update(); 
 
    setInterval(emv_timer, 300);         
}

function emv_end () {
    for (var i = 0; i < solution.emv_Projects.length; i++) {
        let project = solution.emv_Projects[i];    
        project.Com.Socket.close();     
    }   
}


function emv_beforeunload () {
    onclick_selectcancel();
}
//---------------------------------------------------------------------MODULE END -----------------------------------------------------------------------------//

function emv_select (name) {
    let ui  = solution.get('ui')    

// market          
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 

    ui.platform_expand(name, true);

    if (!solution.emv_CurrentProject) {
        onclick_sidebarmenu ('sidebar_emvprojectmanager', true);    
    }    
}


function emv_solution () {

    let  site           = solution.get('site');
    let  user           = solution.get('user')

    solution.emv_Projects       = [];
    solution.emv_CurrentProject = null;

    if (site.protocol == 'http:') {  //EMV = 5
        solution.EMVRouter_Address   = site.hostname;    
        solution.EMVRouter_Port     =  5080;     
    }
    else {
        solution.EMVRouter_Address   =  site.hostname;    
        solution.EMVRouter_Port     =  5443;    
    }

   // if (site.hostname != 'www.jurextrade.com') {
   //     solution.EMVRouter_Address   =  '127.0.0.1';    
   // }
    solution.emv_LoadProjects = function (Id, url, async, interfacecallback, par) {
        let param = {
            user_id :  (Id == "0" ? "1" : Id),
            platform_pname: EMV_PLATFORM_PNAME,
            platform_folder : 'EMV'             
        }

        let callback = function (responsetext, values) {
            let arraystructure =  JSON.parse(responsetext);
            for (var i = 0; i < arraystructure.length; i++) {
                let projectstruct = arraystructure[i];

                if (!projectstruct.Name || !projectstruct.Path) continue;
                if (this.userid == '0' && projectstruct.Name != "Demo_Project") continue;                    
                let project = new emvproject(EMV_PLATFORM_PNAME, projectstruct.Name, projectstruct.Path)
                project =  {...project, ...projectstruct}
                solution.emv_Projects.push(project);
            }
        }

        url_submit ('POST', url, param /*object {}*/, async, callback, [] , interfacecallback, par);
    }    
    solution.emv_GetProjectFromName = function (name) {
        for (var i = 0; i < this.emv_Projects.length; i++) {
            if (this.emv_Projects[i].Name == name) return this.emv_Projects[i];
        }
        return null;
    }
    solution.emv_UpdateProjects = function (solution) {
        let projects = [];
        
        for (var j = 0; j < solution.emv_Projects.length; j++) {
            let project = solution.emv_Projects[j];
            projects.push({
                id:'emv_' + project.Name, type: 'link', item: project.Name, icon: icon_project,
                attributes:{selector: 'emv_selectproject', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
                events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}        
            });
            sb.select_additem ('emv_projectselect', project.Name);        
        }
        sb.tree_additems ('emv_tree_projects', projects);
    }
    
    solution.emv_LoadProjects(user.id, site.address + "/php/read_projects.php",  SYNCHRONE, solution.emv_UpdateProjects, solution);

}


function emv_timer () {
    if (solution.emv_CurrentProject) {        
        $('#emv_projectsbar #emv_projectrename').css ('display', '');
        $('#emv_projectsbar #emv_projectremove').css ('display', '');
        $('#emv_projectsbar #emv_projectcompile').css ('display', '');
        $('#emv_projectsbar #emv_projectdistribute').css ('display', '');
        $('#emv_projectsbar #emv_projectclose').css ('display', '');
        if (Tester.Reader.Records.length != 0) {
            $('emv_tester_recordgroup').css ('display', 'flex');
        } else {
            $('emv_tester_recordgroup').css ('display', 'none');
        }
    }
    else {
        $('#emv_projectsbar #emv_projectrename').css ('display', 'none');
        $('#emv_projectsbar #emv_projectremove').css ('display', 'none');
        $('#emv_projectsbar #emv_projectcompile').css ('display', 'none');
        $('#emv_projectsbar #emv_projectdistribute').css ('display', 'none');
        $('#emv_projectsbar #emv_projectclose').css ('display', 'none');
        $('emv_tester_recordgroup').css ('display', 'none');
    }
}

function emv_loadedproject (project) {
    if (project.Loaded) {
        clearInterval(Interval_emv_loadproject);
        DisplayOperation("Project " + project.Name + " loaded", true, 'operationpanel');            
        LoaderDisplay(false);      
       // emv_project_updateterminal(project)           
        emv_drawproject(project, true);        
    }    
}

function emv_selectproject(project, forcedisplay) {
    if (!project) {
        return;
    }
    if (project == solution.emv_CurrentProject) {
        return project;
    }
    
//--- data ui platform update .............
    let ui  = solution.get('ui')       
    solution.emv_CurrentProject = project;
    ui.platform_updatedata('emv', solution.emv_CurrentProject)              

    emv_initproject()

    if (!project.Loaded) {
        LoaderDisplay(true);        
        DisplayOperation("Loading Project " + project.Name + "  ... Please wait", true, 'operationpanel',  'var(--theme-platform-color)');

        Interval_emv_loadproject = setInterval(emv_loadedproject, 300, project); //5 minutes 300000     
        project.Load();
   
    }
    else {
        DisplayOperation("Project " + project.Name + " loaded", true, 'operationpanel');      
      //  emv_project_updateterminal(project)              
        emv_drawproject(project, true);        
    }    
}

function emv_closeproject (project) {
    if (!project) {
        return;
    }
    
    if (project.ShouldSave) {
        SaveProjectConfirm(project);
    } else {
  
        
    }
   
    if (project == solution.emv_CurrentProject) {
        emv_initproject ();    
        emv_drawproject(project, false);

//--- data ui platform update .............
        let ui  = solution.get('ui')               
        solution.CurrentProject = null;   
        ui.platform_updatedata('emv', solution.emv_CurrentProject)                   
    }   
    return project;     
}

function emv_initproject () {
    sb.tree_removechildren ('emv_tree_applications');
    sb.tree_removechildren ('emv_tree_terminals');
    sb.tree_removechildren ('emv_tree_acceptor');
    sb.tree_removechildren ('emv_tree_acquirer');    

   // sb.tree_removechildren ('treenode-emvmanager-0');    
   // sb.tab_delete(emv_maintabs, 'emv_terminal_tab');    
    
}

function emv_drawproject(project, open) {
    if (!project) {
        return;
    }
    
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('name', EMV_PLATFORM_NAME);     
  
    if (open) {
        $("#emv_projectselect option[value='--Select Project--']").remove();   
        $('#emv_projectselect option[value="' + project.Name + '"]').prop('selected', true);
        sb.tree_selectitem ('emv_tree_projects', project.Name); 
        sb.box_toggle('emv_boxapplicationspanel', true);        


        emv_ServerPanel_Update();
  
    } else {
        solution.emv_CurrentProject = null; 
        $("#emv_projectselect option").eq(0).before($('<option>', {value: '--Select Project--', text: '--Select Project--'}));
        $("#emv_projectselect option[value='--Select Project--']").prop('selected', true);
        sb.tree_selectitem ('emv_tree_projects', '');
        sb.box_toggle('emv_boxapplicationspanel', false);      
        
     //   sb.tab_delete(emv_maintabs, 'emv_tester_tab');   

        emv_ServerPanel_Update();
        BottomPanel_Flat(platform, true, true);         
        AnimationDisplay('emv_main', 'Goodbye');             
    }   
}

function onchange_emv_projectselect (elt, event) {
    let projectname= $('#' + elt.id + ' option:selected').val();
    let project = solution.emv_GetProjectFromName(projectname);
    if (project == solution.emv_CurrentProject) return;
    emv_selectproject(project);
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

function onclick_emv_tab(elt, event) {

}

function onclick_emv_tab_close (elt, event) {
    event.stopPropagation ();      

    let tabname     = $(elt.parentElement).attr('id');
   
    sb.tab_delete (emv_maintabs, tabname);    
}

//---------------------------------------------------------- APDU PANEL -----------------------------------------------------------------

function emv_apdu_panel () {
    var content;
    content = `<div></div>`;
    return content;
}

function onkeydown_emv_search_tag (event, elt) {
    resetStatus($(elt))    
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 32) {
        return false;
    }        
    if(keycode == '13'){
        validateInput($(elt), /^[0-9a-fA-F]{2,4}$/);    
        if (!$(elt).hasClass ('is-valid')){
            return;
        }
        
        var name = $(elt).val().toUpperCase();      

        var funcname =  $(elt).attr ("funcname"); 
        var fn = window[funcname];

        fn(name);        
    }
}

function onclick_emv_search_tag (elt) {
    var parent = $(elt).parent();
    var searchelt = $(parent).children()[0];
    validateInput($(searchelt), /^[0-9a-fA-F]{2,4}$/);    
    if (!$(searchelt).hasClass ('is-valid')){
        return;
    }
    var name = $(searchelt).val().toUpperCase();
    
    var funcname =  $(searchelt).attr ("funcname");
    var fn = window[funcname];

    fn(name);
}


function emv_searchtag (tag, event) {
/*    
    $('.emv_button_show').on('click', function(event){
        $('#overlay_tag').remove();        
        console.log ('click on button show')
        event.stopPropagation();
        event.preventDefault();
        return false;
    })
   
    event.preventDefault();  
    event.stopPropagation();
*/
    emv_table_searchtag(tag, event);
    emv_apdu_searchtag(tag, event);    
}


function emv_table_searchtag (tag, event) {
/*
    if ($('#zoom_tag_' + tag).length != 0) {
        event.stopPropagation();
        return;
    }
*/

    url_submit ('POST', document.location.protocol + '//' + document.location.host + '/php/get_table.php', {tablename: 'gtags', fieldname: 'Tag', valuename: tag} , false, 
        function(content, values) {
                sb.overlay({
                    id : 'overlay_tag',
                    rootelt: $('body'),
                    pageX: event.pageX,
                    pageY: event.pageY + 20,
                    event: event,                
                    keepopen: false,
                    classes: '',
                    style:'width:450px;height:325px; border: 1px solid #007aa6;',
                    onshow : function () {
                        let obj_response = JSON.parse(content);
                        let props = [
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'text', disabled:true},
                            {type: 'textarea', cols: 10, rows: 3, disabled:true},
                        ];
                      //  interface_ArrayMove(obj_response.data[0], 8, 1)
                        obj_response = obj_response.data[0];
                        obj_response.props = props;
                        console.log (content)
                        $('#zoom_tag_' + tag).append(sb.render (sb.panel_object(obj_response)))
                   
                    },        
                    html: '<div id="zoom_tag_' + tag + '" style="width: 100%;height: 100%;background: var(--theme-main-bg-color);"></div>'
                });     
            
            }
        )
    return;    

}

function emv_apdu_searchtag (name, event) {

    let tags = [];

    if (!name || name.length == 0) return;
    let labels = $('#emv_apdu_roottree_ref  .treeref .sb_label');
    
    for (var i =0; i < labels.length; i++) {
        if ($(labels[i]).html() == name) {
            tags.push ($(labels[i]).closest('span'));
        }
    }
    if (tags.length != 0) {
        $('#emv_apdu_roottree_ref *').removeClass ('searchtag');

        for (var i = 0; i < tags.length; i++) {
            let rapdu_tree    = tags[i].closest('.rapdu');
            let father_tree   = tags[i].closest('.treenode');

            let rapdu_span_id = rapdu_tree.children().first().children().first().attr('id');   // open root;
            sb.tree_open(rapdu_span_id);   // open rapdu

            while (rapdu_tree != father_tree && father_tree.length != 0) {
                let father_span_id  = father_tree.children().first().children().first().attr('id');
                sb.tree_open(father_span_id);
                father_tree = father_tree.parent().closest('.treenode');
            }
            $('#' + tags[i].attr('id')).addClass ('searchtag')
            sb.tree_open(tags[i].attr('id'));
        }
        $('#' + tags[0].attr('id'))[0].scrollIntoView(); 
    }
   // event.preventDefault();    
   // event.stopPropagation();   
    return false;   
}

function emv_apdu_searchcommand (classname, event) {
    console.log ('emv_apdu_searchcommand')
    let commands = [];

    if (!classname || classname.length == 0) return;
    let ul   = $('#emv_apdu_roottree_ref  .treenode.' + classname);
    
    for (var i =0; i < ul.length; i++) {
        commands.push ($(ul[i]).find ('span').first());
    }

    if (commands.length != 0) {
        $('#emv_apdu_roottree_ref *').removeClass ('searchtag');

        for (var i = 0; i < commands.length; i++) {
            sb.tree_open(commands[i].attr('id'));   // open rapdu
            commands[i].addClass ('searchtag')

        }
        $('#' + commands[0].attr('id'))[0].scrollIntoView(); 
    }
    return false;   
}


function onclick_apdu_treenode (elt, event) {

    let nodetree    = elt.closest('.sb_tree');
    if ($(nodetree).hasClass ('treenode')) {   
        let closed      = $('#' + elt.id + '_ref').hasClass("closed") ? true : false;
        let group    = $(elt).find('#emv_apdu_bargroup');      
        if (closed) {
            group.find('#inspect_button').css ('display', 'flex')        
        } else {
            group.find('#inspect_button').css ('display', 'none') 
        }            
    }    
    
    let eltname = $(elt).find('.sb_label').html();
  //  sb.tree_selectitem ('emv_rapdu_tree', eltname);   
}

function onclick_apdu_tree_inspect (elt, event) {
    let node        = $(elt.parentElement).closest('.sb_link');
    let nodetree    = node.closest('.sb_tree');

    if (nodetree.hasClass ('treenode')) {    
        let nodeid      = node.attr('id');
        let panelid     = nodeid.replace ('treenode', 'treepanel');
        if (nodeid == panelid) {
            //it is a capadu
            event.stopPropagation();              
            return
        }
        let hidden      =  $('#' + panelid).css ('display') == 'none' ? true : false;    


        if (hidden) {
            $('#' + panelid).css ('display', 'block')
        } else {
            $('#' + panelid).css ('display', 'none')
        }
        event.stopPropagation();  
    }
}

function emv_apdu_init () {
    sb.tree_removechildren ('emv_apdu_roottree');
}

function emv_apdu_closeall () {
    let children = $('#emv_apdu_roottree_ref > li span')
    for (var i= 0; i < children.length; i++) {
        let id = children[i].id
        if (id) {
            sb.tree_close(id)
        }
    }
}

function emv_capdu_treepanelitem (ins, lc, df, index, hidden) {

    return {
        id: 'capdupanel-' + ins + '_' + index,
        type: 'panel',
        class: 'sb_formcontainer',
        events: {onclick: "event.stopPropagation()"},        
        style: defined(hidden) ? (hidden == true ? 'display:none' : '') : '',
        items: [
            {id: 'lc', item: 'LC',  class: 'sb_formgroup',  type: 'text',  disabled: true, value: lc},
            {id: 'df', item: 'DF',  class: 'sb_formgroup',  type: 'text',  disabled: true, value: df},
        ]
    }    
}
function essai_panel (subvalue) {
    var content = '';
    if (subvalue) {
        content += '<div>' +  subvalue + '</div>';
    }
    return content;
}

function emv_rapdu_treepanelitem (tag, value, subvalue, index, hidden) {

    return {
        id: 'treepanel-'+ tag + '_' + index,
        type: 'panel',
        class: 'sb_formcontainer',
        events: {onclick: "event.stopPropagation()"},        
        style: defined(hidden) ? (hidden == true ? 'display:none' : '') : '',
        items: [

            {id: 'tagvalue', item: 'Value',     class: 'sb_formgroup',  type: 'text',  disabled: true, value: value},
            {id: 'taghex',   item: 'Value_ext', class: 'sb_formgroup  tagextension',  type: 'ihtml', 
                content: subvalue ? "essai_panel(`" + subvalue + "`)" : '',                 
                style: subvalue ? '' : 'display:none'
            },

        ]
    }    
}

function emv_capduselect (command, index, scroll) {

    emv_apdu_closeall();     
    let ins      = command.ins;
   
    let id = 'capdu' + '_' + index;

    sb.tree_expand(id)
   
   
    $('#emv_apdu_roottree_ref  > li > ul >li > span').removeClass('selected')
    $('#capdu' + '_' + index).addClass ('selected')  
    if (scroll) {
        $('#capdu' + '_' + index)[0].scrollIntoView();   
    }      
}

function emv_rapduselect (roottag, index, scroll) {

    emv_apdu_closeall();        
    let tag      = roottag.tag;

    let id = 'rapdu' + '_' + index;
    sb.tree_expand(id)

    
    $('#emv_apdu_roottree_ref  > li > ul >li > span').removeClass('selected')
    $('#rapdu' + '_' + index).addClass ('selected')  

    if (scroll) {
        $('#rapdu' + '_' + index)[0].scrollIntoView();   
    }      
}

function emv_capdu_update (capdu, index, item) {
    let cla     = capdu.cla;    
    let ins     = capdu.ins;
    let p1      = capdu.p1;
    let p2      = capdu.p2;
    let df      = capdu.df;

    let lc   = parseInt(capdu.lc, 16)
    
    
    let nodeitem  = {id: 'capdu' + '_' + index, item: 'C-APDU', type: 'tree',  class: 'capdu treenode ' + getcommandclassname(ins),  arrow: (lc == 0 ? false : true), events: apdu_default_node_events, closed: true,
                    rootitem: emv_apdu_tree_bar(cla, getcommandname (ins) + ' CLA: ' + cla + ' INS: ' + ins + ' P1: ' + p1 + ' P2: ' + p2,  true)};        
    
    sb.tree_additem (item.id, nodeitem);
    
    if (lc != 0) {
        sb.tree_additem (nodeitem.id,  emv_capdu_treepanelitem(ins, capdu.lc, df, index, false));    
    }
}

function emv_rapdu_update (rapdu, index, value, item) {
    let sw1 = rapdu.sw1;    
    let sw2 = rapdu.sw2;
    let error = (sw1 != '90' || sw2 != '00')

    let nodeitem  = {id: 'rapdu' + '_' + index, item: 'R-APDU', type: 'tree',  class: 'rapdu treenode ' + gettagclassname(rapdu.tag) + (error ? ' rapduerror' : ''),  arrow: (error == true ? false : true), events: apdu_default_node_events, closed: true,
                    rootitem: emv_apdu_tree_bar(sw2,  gettagname(rapdu.tag) + ' SW1: ' + sw1 + ' SW2: ' + sw2,  true)};        
    
    sb.tree_additem (item.id, nodeitem);

    let subvalue = gettagvalue_text(rapdu);


    sb.tree_additem (nodeitem.id, emv_rapdu_treepanelitem('response', value, subvalue, index, false));    

    if (!error) {
        emv_rapdu_update_tree(rapdu, index, nodeitem)
    }
}

function emv_rapdu_update_tree (rapdu, index, item) {
    if (rapdu.length == 0) {
        return;
    }

    let tag      = rapdu.tag;
    let value    = rapdu.value;
    let name     = gettagname(rapdu.tag); //rapdu.value;
    let children = rapdu.child;
    let subvalue = gettagvalue_text(rapdu);
    var nodeitem;

    if (!defined(children)) {
    
        nodeitem  = {id: 'treenode-' + tag + '_' + index,  item: tag, type: 'tree',  arrow: false, events: apdu_default_node_events, closed: true, 
                     rootitem: emv_apdu_tree_bar(tag, name, false)};
    
        sb.tree_additem (item.id, nodeitem);
        sb.tree_additem (nodeitem.id, emv_rapdu_treepanelitem(tag, value, subvalue, index, false));        
        return;
    
    }
    else {
        nodeitem  = {id: 'treenode-' + tag + '_' + index, item: tag, type: 'tree',  class: 'treenode',  arrow: true, events: apdu_default_node_events, closed: true,
                     rootitem: emv_apdu_tree_bar(tag, name, true)};        
    
        sb.tree_additem (item.id, nodeitem);
        sb.tree_additem (nodeitem.id, emv_rapdu_treepanelitem(tag, value, subvalue, index, true));


        for (var i = 0; i < children.length; i++) {
            emv_rapdu_update_tree(children[i],  index, nodeitem)
        }
    }
}

//----------------------------------------------------  EMV STEPS PANEL    ------------------------------------------------   

function emv_returnmainstep (step) {
    let step_id;
    let substep_id = step;

    if (parseInt(step) < 14) {
        step_id = step;
    }
    else {
        step_id = step.substring(0, step.length - 2);
    }
    return step_id
}

function emv_selectstep (step, scroll) {
    let mainstep_id = emv_returnmainstep (step);
    emv_tree_step_selectstep(mainstep_id, scroll);   
    emv_presentation_selectstep(mainstep_id, true);  
    
    emv_tree_step_selectsubstep(step, scroll);   
    emv_presentation_selectsubstep(step, true);  
}

//----------------------------------------------------  EMV DIAGRAM PANEL    ------------------------------------------------ 

function onclick_tree_step_button (elt, event) {
    if ($('#emv_tree_steps_panel').hasClass('sb_none')) {
        $('#emv_tree_steps_panel').removeClass('sb_none') 
    } else {
        $('#emv_tree_steps_panel').addClass('sb_none')
    }
}

function onmousedown_emv_tree_step (elt, event) {
    console.log ('sssssssssssssssssss')
    let step = elt.id.replace("step_", "");
    emv_selectstep(step); 
}

function emv_tree_step_selectstep (step, scroll) {
    let step_id = emv_returnmainstep (step);

    $('#emv_tree_steps .EMVStep').removeClass ('selected');    
    let selected_element = $('#emv_tree_steps .EMVStep').filter('#step_' + step_id)
    if (selected_element.length != 0) {
        selected_element.addClass ('selected')
        if (scroll) {
            selected_element[0].scrollIntoView();   
        }
    }
    return step_id;    
}

function emv_tree_step_selectsubstep (substep, scroll) {

    $('#emv_tree_steps .EMVSubStep').removeClass ('selected');        
    let selected_element = $('#emv_tree_steps .EMVSubStep').filter('#step_' + substep)
    if (selected_element.length != 0) {
        selected_element.addClass ('selected')
        if (scroll) {
            selected_element[0].scrollIntoView();   
        }
    }
}

function emv_steps_diagram (id) {
    var content = '';

    content +=  '<ol class="process_diagram">';
    
    content += '<li>' +
    '               <div  id ="step_' + emv_Steps[0].id + '" class= "EMVStep" onmousedown="onmousedown_emv_tree_step(this, event)" >' +
    '                   <div class="sb_widget-title">STEP ' + 0 + '</div>' +
    '                   <div>' + emv_Steps[0].item + '</div>' +
    '               </div>' +
    '           </li>';
    content += '<li><ul>';

    for (var i = 1; i < emv_Steps.length; i++) {
        content += '<li><ol>';
        content += '<li>' +
        '               <div id ="step_' + emv_Steps[i].id + '" class= "EMVStep" onmousedown="onmousedown_emv_tree_step(this, event)" >' +
        '                   <div class="sb_widget-title">STEP ' + i + '</div>' +
        '                   <div >' + emv_Steps[i].item + '</div>' + 
        '               </div>' +
        '           </li>';
        for (var j = 0; j < emv_Steps[i].substeps.length; j++) {
            if (j == 0) {
                content += '<ul>';
            }
            content += '<li><div id ="step_' + emv_Steps[i].substeps[j].id + '" class= "EMVSubStep" onmousedown="onmousedown_emv_tree_step(this, event)">' + emv_Steps[i].substeps[j].item + '</div></li>';
            if (j ==  emv_Steps[i].substeps[j].length - 1) {
                content += '</ul>';
            }
        }
        content += '</ol></li>';        
    }
    content += '</ul></li>'
    content += '</ol>'

    return content;
}

//----------------------------------------------------  EMV PRESENTATION PANEL    ------------------------------------------------ 

function emv_presentation_selectstep(step, scroll) {
    let step_id = emv_returnmainstep (step);

    $('#emv_presentation_steps_panel .EMVStep').removeClass ('selected');    
    $('#emv_presentation_steps_panel .EMVStep').addClass ('sb_none');
   
    let selected_element =  $('#emv_presentation_steps_panel .EMVStep').filter('#step_' + step_id)
    if (selected_element.length != 0) {    
        selected_element.addClass ('selected')
        selected_element.removeClass ('sb_none')
        if (scroll) {
            selected_element.scrollTop(0);  
        }  
    }
//bar    
    $('#emv_presentation_bar .sb_link').removeClass ('checked');    
    $('#emv_stepbar-' + step).addClass ('checked')
    return step_id;
 }

 function emv_presentation_selectsubstep(substep, scroll) {
    $('#emv_presentation_steps_panel .EMVSubStep').removeClass ('selected');        
    
    let selected_element =    $('#emv_presentation_steps_panel .EMVSubStep').filter('#step_' + substep)
    if (selected_element.length != 0) {        
        selected_element.addClass ('selected')
        if (scroll) {
            selected_element[0].scrollIntoView(true);   
        } 
    }         
}

function onclick_presentation_step (elt, event) {
    let step = elt.id.replace ('emv_stepbar-', '')

    emv_selectstep(step, 1)

}


function emv_presentation_form (stepnbr) {
    var content = ''; 
    let step = emv_Steps[stepnbr];

    content +=
        '<div class="card-body sb_column">' +
        '   <div class="card-title sb_f_size12">' +  step.item + '</div>' + 
        '   <div class="card-text">';
                content += step.description;
                content += sb.render(emv_presentation_flags(stepnbr, 'Info', ['']));

                for (var j = 0; j < step.substeps.length; j++) {
                    content += '<div id ="step_' + step.substeps[j].id + '" class= "card EMVSubStep" >' + 
                            '    <div class="card-body">' +
                            '        <div class="card-title">' +  step.substeps[j].item + '</div>' + 
                            '        <div class="sb_main card-text">';
                    content += step.substeps[j].description;
                    content += sb.render(emv_presentation_flags(step.substeps[j].id , 'Info', ['']));                    
                    content += '        </div>' +
                            '    </div>' +  
                            '</div>'; 
                }        
    content += 
    '      </div>' +    
    '   </div>';

    return content;
} 


//----------------------------------------------------   SERVER PANEL    ------------------------------------------------ 

function emv_ServerPanel_Update () {
    let server = solution.EMVRouter_Address;
    let port   = solution.EMVRouter_Port;

    if (solution.emv_CurrentProject) {
        server = solution.emv_CurrentProject.Server;
        port   = solution.emv_CurrentProject.Port;
    }


    $('#nodeserveradress').val(server);
    $('#nodeserverport').val(port);
}

function onclick_ResetEMVServer (elt, event) {
    let server = solution.EMVRouter_Address;
    let port   = solution.EMVRouter_Port;

    if (solution.emv_CurrentProject) {
        server = solution.emv_CurrentProject.Server;
        port   = solution.emv_CurrentProject.Port;
    }

    $('#nodeserveradress').val(server);
    $('#nodeserverport').val(port);
}

function onclick_ApplyEMVServer (elt, event) {
    let newadress  =   $('#nodeserveradress').val();
    let newport    =   $('#nodeserverport').val();
    RouterCom.Com.Close ();
    
    EMVConnect(newadress, newport);

}

function emv_ServerPanel () {
    var content = '';
    
    content = 
'   <div id="serverstable" class="">'+       		            
'   <div class="sb_f_style_h6">EMV Router Server</div>' +
'   <div class="sb_formgroup">' +
    '       <label>Address</label>' +
    '       <input id ="nodeserveradress" class="form-control" value=""/>' +
    '   </div>' +     
    '   <div class="sb_formgroup">' +
    '       <label>Port</label>' +
    '       <input id ="nodeserverport" class="form-control" value=""/>' +
    '   </div>' +   
    '   <div class="sb_buttongroup">' +
    '       <button class="sb_button"  type="button" onclick="onclick_ResetEMVServer(this, event)">Reset</button>' +        
    '       <button class="sb_button"  type="button" onclick="onclick_ApplyEMVServer(this, event)">Apply</button>' +
    '   </div>' +       
'   </div>';

    return content
}

//------------------------------------------------------------ EMV BOTTOM PANEL ----------------------------------------------------------

function onclick_emvtabs(event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    BottomPanel_Flat (platform, false, true);
} 

function ondblclick_emvtabs(elt, event) {
    event.stopPropagation();
    event.preventDefault();        
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    BottomPanel_Flat (platform, undefined, true);
} 


function emv_table_search_aidtable (fieldvalue, field, callback, tabvalue) {


    url_submit ('POST', document.location.protocol + '//' + document.location.host + '/php/get_table.php', {tablename: 'aids', fieldname: field, valuename: fieldvalue} , false, 
        callback,
        tabvalue
    )
    return;    
}