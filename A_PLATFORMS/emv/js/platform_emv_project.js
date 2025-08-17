
var emv_manager = null;

class emvproject {
    constructor (pname, name, path) {
        this.pname                   = pname; 
        this.Folder                  = path;    
        this.Name                    = name;
        this.Path                    = path;
        this.Transactions            = [];
        this.Manager                 = new EMVManager()   
        this.Loaded                  = 0; 
    }

    Create = function () {
        let  user    = solution.get('user')      
        
        if (!cuser.is_registered()) {
            TreatInfo(register_needed_label, 'operationpanel', 'red');            
            return;                
        }
        
        return SubmitProjectRequest('EMV', this.Folder, this.Name, '', 'php/create_project.php', SYNCHRONE);
    }

    Remove = function () {
        let cuser = solution.get('user')
    
        if (!cuser.is_registered()) {
            TreatInfo(register_needed_label, 'operationpanel', 'red');      
            return;
        }
              
        return SubmitProjectRequest('EMV',this.Folder, this.Name, '', 'php/remove_project.php', SYNCHRONE);
    }

    Rename = function (newname) {
        let  user    = solution.get('user')      
        
        if (!cuser.is_registered()) {
            TreatInfo(register_needed_label, 'operationpanel', 'red');            
            return;                
        }
           
   
        let content = JSON.stringify({name: newname, path: this.path}, null, 2)

        let rootproject = user.fileexplorer.Root + user.path + '/EMV/' + this.path + "/config/";        
       
        user.send ({Name: 'savefile', Values: [rootproject + 'emv.ini', content]}, true, 
                    function (content, values) {
                        DisplayInfo("Project Succesfully Renamed", true, 'operationpanel');                             
                    }, 
                    [this]);  
    }
    
    UpdateEMV = function (response, par) {
        let project = par[0];
 
        try {
            project.Manager = JSON.parse(response)
        } catch(e) {
             return console.error(e); 
        }    
        emv_project_update(project.Manager);
        project.Loaded = 1;    
        emv_manager = project.Manager;        
    }

    Save  = function () {

        let cuser = solution.get('user')

        if (!cuser.is_registered()) {
            TreatInfo(register_needed_label, 'operationpanel', 'red');      
            return;
        }
        let rootproject     = cuser.fileexplorer.Root + cuser.path + '/EMV/' + this.Folder + "/Files/";   

        let url = rootproject + 'emvsolution.json';
        let content = JSON.stringify(this.Manager, null, 2)

        cuser.send ({Name: 'savefile', Values: [url, content]}, true, 
                    function (content, values) {
                        DisplayInfo("Project Saved", true, 'operationpanel');                             
                    }, 
                    ['emvsolution.json']);  
    }

    Load = function () {  
        let  site           = solution.get('site');        
        let  user           = solution.get('user')               
        
        this.LoadTransactions(user)
        let rootproject = site.address + user.path + '/EMV/' + this.Folder + "/Files/";
        let url = rootproject + 'emvsolution.json';
        solution.get_file(url, ASYNCHRONE,  this.UpdateEMV, [this]);
    }

    LoadTransactions = function (user) {

        let file_path        = user.path + '/EMV/' + solution.emv_CurrentProject.Folder

        user.send({Name: 'scandir_r',Values: [file_path  + '/Transactions', '.']}, false,  function (content, values) {
            let dirstruct;    
            let solution = values[1];
            let user = values[0];

            try {
                dirstruct = JSON.parse(content);
            } catch(e) {
                return console.error(e); 
            }                

            solution.Transactions = [];
            
            for (var i = 0; i < dirstruct.Values[0].Files.length; i++) {
                solution.Transactions.push (dirstruct.Values[0].Files[i].Name)
            }
            emv_tester_transactionselect_Update(solution.Transactions);
            }, 
            [user, this])  
    }
    LoadAcceptor= function () {				//SIT_D753.wp
    }

    LoadRangeBins= function () {			    //APB_D236.wp
    }

    LoadExceptionCards= function () {	//APL_D253.wp
    }

    LoadAuthorityPublicKeys= function () {	//EPK_D782.wp
    }

    LoadTerminals= function () {
        let terminal = new emv_Terminal("12345678", [0x02, 0x50], 0x22, [0x60, 0xB8, 0xC8], [0xC1, 0x00, 0xF0, 0xA0, 0x01], [0x26, 0x40, 0x40, 0x00]);
        this.AddTerminal(terminal)
    }
    LoadApplications = function () {			//EPV_D787.wp  a000000333010103
        let aid = new emv_aid ( " a000000333010103",
            //[0xA0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03, 0x03, 0x00, 0x01, 0x00, 0x01, 0x00, 0x03], 
                                                [0x00, 0x8C], 8, 1,  
                                                [0xC1, 0x00, 0xF0, 0xA0, 0x01],[0xC1, 0x00, 0xF0, 0xA0, 0x01],[0xC1, 0x00, 0xF0, 0xA0, 0x01])
        this.AddApplication(aid)                                                
    }
        
    LoadTacs = function () {					//EPT_D778.wp  
    }      

    AddTerminal = function (terminal) {
   
        this.Terminals.push(terminal);
        this.TerminalsCount++;
    }
    
    AddApplication = function (rid_name) {
        let application = new EMVApplication(rid_name)
        this.Manager.Applications.push(application);
        return application;
    }
    
    AddAid = function (application, aid_name) {
        let aid = new EMVAid (aid_name,
                               "008", 8, 1,  
                                "0010000000","d84004f800","d84000a800")

        application.AID.push(aid);
        return aid;
    }

    GetAidFromName = function (aid_name) {
        let rid_name = aid_name.substring(0, 10);
        let application = this.GetApplicationFromRid(rid_name)
        if (!application) {
            return null;
        }
        for (var i = 0; i < application.AID.length; i++) {
            if (application.AID[i].AID == aid_name) return application.AID[i];
        }
        return null;
    }

    GetApplicationFromRid = function (rid_name) {
        for (var i = 0; i < this.Manager.Applications.length; i++) {
            if (this.Manager.Applications[i].RID == rid_name) return this.Manager.Applications[i];
        }
        return null;

    }
  
}


//------------------------------------------------------------ PROJECT FILE BAR ----------------------------------------------------------

function onclick_emv_projectclose () {
    OnCloseProject (solution.emv_CurrentProject, emv_closeproject, solution.emv_CurrentProject);
}


function onclick_emv_projectcreate () {
  //  OnNewProject ();
}

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 

function onclick_emv_projectrename () {
    OnRenameProject (emv_RenameProject, solution.emv_CurrentProject);
}

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 


function emv_RenameProject (project, newname) {
    if (!project) return;

    if (solution.get('user').id == "0") {
        TreatInfo(register_needed_label, 'operationpanel', 'red');
        return;
    }
    if ($('#emv_projectsbar .box-btn-slide').hasClass('rotate-180'))    
        $('#emv_projectsbar #slide').click (); 


    var returnvalue = project.Rename (newname);
    if (returnvalue != -1) {

        sb.tree_renameitem('emv_tree_projects', project.Name, newname);
        sb.select_renameitem('emv_projectselect', project.Name, newname);        
        project.Name = newname;
    }
}

//---------------------------------------------------- REMOVE PROJECT ---------------------------------------------- 

function onclick_emv_projectremove() {
    OnRemoveProject (emv_RemoveProject, solution.emv_CurrentProject);
}

//---------------------------------------------------- REMOVE PROJECT ---------------------------------------------- 

function emv_RemoveProject (project) {
    if (!project) return;

    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    
    if ($('#emv_projectsbar .box-btn-slide').hasClass('rotate-180'))  {  
        $('#emv_projectsbar #slide').click ();   
    }

    var returnvalue = project.Remove ();
    
    if (returnvalue != -1) {

        sb.tree_removeitem('emv_tree_projects', project.Name);
        sb.select_removeitem('emv_projectselect', project.Name);

        if (project == solution.emv_CurrentProject) 
            emv_closeproject(project);    
    }
}



function emv_project_update (manager) {
//    emv_project_initaid ();
//    emv_project_updateaid ();    

    emv_project_updateapplications (manager);    
    emv_project_updateterminals(manager);     
    emv_project_create_treeacceptor(manager.Acceptor)    
    emv_project_create_treeacquirer(manager.Acquirer)    
}

//---------------------------------------------------- CREATE PROJECT ---------------------------------------------- 


function onclick_emv_t_projectcreate () {
    let name = "essai";
    sb.modal ({
        header: 'Create Working Project', 
        id: 'emvcreateprojectmodal',
        resizable: true,
        onopen :  function () {focusAndCursor(focuslabel)},
     
        body: sb.render ( 
            {
                id: name, 
                type: 'panel',  
                class: 'sb_column sb_right ccpanel editable',  
//                events : option.events,   
                items:[        
                    {id: 'emv_' + name + '_container', type: 'select',  value: '', menu: emv_Country_Code, events: {onchange:'onchange_emv_cc(this, event)'},  attributes: {minlength:"1", maxlength: "2"},   title : 'Terminal Country Code'},     
                 
                ]
            }
        ), 
        footer: '<button data-bs-dismiss="modal" class="sb_mbutton" onclick="no_callback()">Cancel</button>'
    })    
}

function onclick_emv_b_projectcreate (elt) {
    
    var projectname     = $('#newprojectname2').val();    

    if (projectname == "") {
         $('#newprojectname2').focus().val("");
         return null;
    }
    if (solution.project_GetProjectFromName(projectname)) {
        $('#newprojectname2').focus().val("").val(projectname);
        return null;
    }   
    $("#createprojectmodal").modal('hide');

    emv_project_newproject (projectname);
}

function emv_project_newproject (name) {

    if (solution.get('user').id == "0") {
        TreatInfo('As you are not registered the project will not be saved', 'operationpanel');
    }

    project_closeproject (solution.CurrentProject);
    
    if (!name)
        name = solution.ProjectFindName(name);

    var project = solution.NewProject(name);

//--- data ui platform update .............
    let ui  = solution.get('ui')           
    solution.CurrentProject = project;
    ui.platform_updatedata('project', solution.CurrentProject)         
    
    sb.tree_additems ('project_tree_projects', [{id:'project_' +project.Name, type: 'link', item: project.Name, icon: icon_project,
                    attributes:{selector: 'project_selectproject', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}     
                    }]);
   
    sb.select_additem ('project_projectselect', project.Name);
    UpdateProjectEngines (project);
    solution.UpdateIndicators(project);         

    project_drawproject(project, true);
}

//--------------------------------

function onclick_emv_t_addapplication (elt, event) {
    event.preventDefault();    
    event.stopPropagation();  
    emv_project_addpplication();
}
 
function emv_project_addpplication () {
    let name = "application_modal";
    sb.modal ({
        header: 'Choose AID', 
        id: 'emvcreateapplicationmodal',
        resizable: true,
      //  onopen :  function () {focusAndCursor(focuslabel)},
     
        body: sb.render ( 
            {
                id: name, 
                type: 'panel',  
                class: 'sb_column sb_right ccpanel editable',  
//                events : option.events,   
                items:[        
                    {id: 'emv_' + name + '_container',  type: 'select',  value: '', menu: emv_AID, events: {onchange:'onchange_emv_aid(this, event)'},  attributes: {minlength:"1", maxlength: "2"},   title :'Application Identifier (AID) Terminal'},     
                ]
            }
        ), 
        footer: '<button  id = "emvcreateapplicationmodal_button" type="button" class="sb_buttonprepend sb_mbutton" onclick="emv_project_addpplication_b_create(this);">Create</button> ' +
                '<button data-bs-dismiss="modal" class="sb_mbutton" onclick="no_callback()">Cancel</button>'
         
    })  

}

function emv_project_addpplication_b_create (elt) {
    
    $("#emvcreateapplicationmodal").modal('hide');    

    let aid_name = $('#' + 'emv_application_modal_container').val();
    let aid = solution.emv_CurrentProject.GetAidFromName(aid_name);
    console.log ('add application')
    if (aid == null) {
        let rid_name = aid_name.substring(0, 10);
        let application = solution.emv_CurrentProject.GetApplicationFromRid(rid_name)
        let nodeitem;

        if (!application) {
            application = solution.emv_CurrentProject.AddApplication (rid_name);
            nodeitem  = emv_treenodeitem(application, {value:application.RID, closed:true});   
            sb.tree_add_item (emv_tree_applications, nodeitem);
        } else {
            nodeitem = sb.get (emv_tree_applications, 'id', 'treenode-' + application.ClassName + '-' + application.Code)[0]
        }

        aid = solution.emv_CurrentProject.AddAid(application, aid_name);
        emv_project_create_treeaid(application, aid);
    } else {
        
    }
    sb.tree_compress('emv_treenode-applications')      
    sb.tree_selectitem ('emv_treenode-applications',  aid_name);

    $('#emv_treenode-applications_ref .treenode').removeClass('selected');
  
    sb.tree_open ('treenode-EMVAid-' + aid.Code)       
    $('#treenode-EMVAid-' + aid.Code).closest ('.treenode').addClass ('selected')    
        
}

//--------------------------------------------------------- APPLICATION PANEL  ---------------------------------------------------------------
const emv_type_leaf = ['EMVApplication', 'EMVAid', 'EMVTerminal'];


function emv_iconfromclass (type) {
    switch (type) {
        case 'EMVAid':                   return icon_manager;
        case 'EMVApplication':           return icon_site;
        case 'EMVTerminal':              return icon_terminal;
        case 'EMVAcceptor':              return icon_database;
        case 'EMVAcquirer':              return icon_journal;
        break;    
    }
}

function emv_entityfatherclass (entity) {
    // return emv_classfromtype (type) + 's';
     switch (entity) {
         case 'EMVManager':              return ''; 
         case 'EMVApplication':          return 'Applications';                
         case 'EMVTerminal':             return 'Terminals';
         case 'EMVAid':                  return 'AID';         
         case 'avn':                     return 'EMVAid';
         case 'tacdenial':               return 'EMVAid';        
         case 'taconline':               return 'EMVAid';
         case 'tacdefault':              return 'EMVAid';
         case 'sn':                      return 'EMVTerminal';
         case 'cc':                      return 'EMVTerminal';
         case 'tt':                      return 'EMVTerminal';
         case 'tc':                      return 'EMVTerminal';
         case 'atc':                     return 'EMVTerminal';  
         case 'ttq':                     return 'EMVTerminal';
         break;  
         default:
             return 'EMVManager';  
     }
 }


function emv_entityfromnodename (nodename) {

    let values = nodename.split('.');


    if (values.length == 1) {  // other than aid
        values              = nodename.split(':');


        let entityclass     = values[0]; 
        let entitycode      = values[1]; 
        let fatherclassname = emv_entityfatherclass (entityclass);      

        let entity = interface_GetEntity (emv_manager, fatherclassname, 'Code', entitycode);

        return {type: 'Object', object: entity, field: null, nodetype: entityclass, fathernodetype: fatherclassname}    

    }


    if (values.length == 2) {

        let fvalues         = values[0].split(':');
        let evalues         = values[1].split(':');

        let fatherclass     = fvalues[0]; 
        let entityclass     = evalues[0];

        let fathercode     = fvalues[1]; 
        let entitycode     = evalues[1];
        
        let fatherfclassname = emv_entityfatherclass (fatherclass);      
        let father = interface_GetEntity (emv_manager, fatherfclassname, 'Code', fathercode);
        
        let entityfclassname = emv_entityfatherclass (entityclass);   
        let entity = interface_GetEntity (father, entityfclassname, 'Code', entitycode);
        
        return {type: 'Object', object: entity, field: null, nodetype: entityclass, fathernodetype: fatherclass}    
    }
    
/*
    if (entity == NULL) {   // check if it is new entity
        if (new_entity == NULL) {
            console.log ('emv_entityfromnodename : error in nodename : ' + nodename);
            return {type: 'Object', object: null, field: null}
        }
        else {    // check if same code
            if (new_entity.Code != entitycode) {
                console.log ('emv_entityfromnodename : error in nodename : ' + nodename);
                return {type: 'Object', object: null, field: null}   
            }
            entity = new_entity;
        }
    }
*/
}

function onclick_emv_treenode (elt, event) {
    let nodename = $(elt).attr("nodename");  
    let eltname = $(elt).find('.sb_label').html();

  //  sb.tree_selectitem ('treenode-emvmanager-0', eltname);   


    if (nodename.split('.').length == 2) {    //field no delete no node open
        event.stopPropagation();  
        event.preventDefault();          
        return;
    }

    
   // let node  = emv_entityfromnodename(nodename);
   // let fieldname = node.field;
   // let entity    = node.object;
   // let type      = node.type;
   // let nodetype  = node.nodetype;
//
   // if (entity == NULL) {
   //     console.log ('onclick_emv_treenode : Error in nodename : ' + nodename);
   //     return;
   // }
    
    let group  = $(elt).find('#emv_tree_update');  
    let closed = $('#' + elt.id + '_ref').hasClass("closed") ? true : false;

    if (true) {//emv_type_leaf.includes (nodetype)) {
   
        if (closed) {
            group.find('#tree_delete_entity').css ('display', 'flex')        
        } else {
            group.find('#tree_delete_entity').css ('display', 'none') 
        }
    } else {
        group.css('display', closed ? '' : 'none')
    }

    //emv_jsoneditor_update(entity);
}
    

function emv_treenodeitem (entity, option) {
    
    let classname       = entity.ClassName; 
    let nodename =  classname + ':' + entity.Code ;    

    if (option.fathernodename) {
        nodename = option.fathernodename + '.' + nodename;
    }

    let node =
    {
        id:   'treenode-' + classname + '-' + entity.Code,
        type: 'tree',
   
        arrow: emv_type_leaf.includes (classname) ? true : false,
        class: 'treenode',
        rootitem: option.tag ? emv_treenodetagitem(option.tag, option.value, entity.Code, true) : emv_tree_update, 
        closed: option.closed,
        icon: emv_iconfromclass (classname),
        items:[],
        attributes:{
                    nodename: nodename,
                    draggable: true
        },
        events: emv_default_node_events   
    }    
    if (option.name) {
        node.item = option.name  
    }
    return node;
}

function emv_treefielditem (entity, fieldname, option) {

 
    let nodename =  entity.ClassName + ':' + entity.Code + '.' + fieldname;    
    if (option.fathernodename) {
        nodename = option.fathernodename + '.' + nodename;
    }

    return {
        id: 'treenode-'  +  fieldname + '-' + entity.Code,        
        type: 'tree',
     //   item: option.value,
        arrow: emv_type_leaf.includes (fieldname) ? true : false,
        class: 'treenode',
        rootitem: option.tag ? emv_treenodetagitem(option.tag, option.value, entity.Code) : emv_treenodenameitem (option.name, option.value, entity.Code, true) , 
        closed:  option.closed,
        items: [],
        attributes:{
            nodename: nodename,
        },        
        events: emv_default_node_events,   
    }    
}


//-------------------------------------------------------------MENU TREE UPDATE-----------------------------------------------------------------

function onclick_emv_treenode_modify (elt, event) {
  
    let nodeid   = $(elt.parentElement).closest('.sb_link').attr('id');
    let nodename = $('#' + nodeid).attr('nodename');

    let panelid     = nodeid.replace ('treenode', 'treepanel');
    let hidden      =  $('#' + panelid).css ('display') == 'none' ? true : false;    

    let group    = $(elt).closest('#emv_tree_update');

    if (hidden) {
        $('#' + panelid).slideToggle()
        $(group).find('#tree_delete_entity').css ('display', 'flex')        
    } else {
        $('#' + panelid).slideToggle()
        $(group).find('#tree_delete_entity').css ('display', 'none') 
    }
        
    event.stopPropagation();  
}


function onclick_emv_treenode_cancel(elt, event){

    let nodetrees    = $(elt).closest('.treenode').find('.treenode').children();
    let nodetree;
    
    for (var i = 0; i < nodetrees.length; i++) {
         nodetree    = $(nodetrees[i]).find('span:first');
    
    
    
        let nodeid      = nodetree.attr('id');
        
        let input       = nodetree.find('input');  //$('#' + nodeid + ' input'); 
        let prevvalue   = input.prop("defaultValue")



        input.val(prevvalue)
        input.removeAttr('changed');    
        

        let panelid     = nodeid.replace ('treenode', 'treepanel');
        let treepanel   = sb.get(emv_tree_manager, 'id', panelid)

        if ($('#' + panelid).hasClass('bytepanel')) {
            emv_byte_update(treepanel[0], hexa_to_int(prevvalue))    
        }

//application                
        if ($('#' + panelid).hasClass('aidpanel')) {
            emv_aid_update(treepanel[0], prevvalue)    
        }        
        if ($('#' + panelid).hasClass('avnpanel')) {
            emv_avn_update(treepanel[0], hexa_to_int(prevvalue))    
        }       

//terminal        
        if ($('#' + panelid).hasClass('snpanel')) {
            emv_sn_update(treepanel[0], prevvalue)    
        }
        if ($('#' + panelid).hasClass('ccpanel')) {
            emv_cc_update(treepanel[0], prevvalue)    
        }
        if ($('#' + panelid).hasClass('ttpanel')) {
            emv_tt_update(treepanel[0], prevvalue)    
        }

//acceptor
        if ($('#' + panelid).hasClass('mccpanel')) {
            emv_mcc_update(treepanel[0], prevvalue)    
        }
        if ($('#' + panelid).hasClass('mipanel')) {
            emv_mi_update(treepanel[0], prevvalue)    
        }
        if ($('#' + panelid).hasClass('mnlpanel')) {
            emv_mnl_update(treepanel[0], prevvalue)    
        }
        if ($('#' + panelid).hasClass('tipanel')) {
            emv_ti_update(treepanel[0], prevvalue)    
        }
//acquirer
        if ($('#' + panelid).hasClass('aipanel')) {
            emv_ai_update(treepanel[0], prevvalue)    
        }

    }
    nodetree    = $(elt).closest('.treenode').find('span:first');
    nodetree.find('#tree_update_entity').css('display', 'none')
    nodetree.find('#tree_cancel_entity').css('display', 'none')        
    
    event.preventDefault();    
    event.stopPropagation();  
}


function onclick_emv_treenode_update(elt, event){
    event.preventDefault();    
    event.stopPropagation();  

    var nodeid    = $(elt).closest('.treenode').find('span:first').attr('id');
    var panelid   = nodeid.replace ('treenode', 'treepanel');
    var nodename  = $('#' + nodeid).attr('nodename');

    emv_update_platform(nodename);
    
    $('#' + nodeid + ' [changed="true"]').removeAttr('changed');


    $('[nodename=\'' + nodename + '\']').find('#tree_update_entity').css('display', 'none')
    $('[nodename=\'' + nodename + '\']').find('#tree_cancel_entity').css('display', 'none')    
   

    solution.emv_CurrentProject.Save();
}

function emv_update_platform (nodename) {
    let i_entity  = emv_entityfromnodename(nodename);

    let fieldname = i_entity.field;
    let entity    = i_entity.object;
    let type      = i_entity.type;    
    let keys      = Object.keys(entity);
    
    let fnodename      = entity.ClassName + ':' + entity.Code;
     
    for (var index = 0; index < keys.length; index++) {
        let key = keys[index];
        let elt = $('[nodename=\'' + fnodename + '.' + key + '\'] input' );

        if (defined(elt) && elt.length != 0) {
            entity[key] = elt.val();
            elt.prop("defaultValue", elt.val())
        }
    }
}

function onchange_emv_treenode_value (elt) {
    var nodetree = $(elt).closest('.treenode').parent().closest('.treenode').find('span:first');
    nodetree.find('#tree_update_entity').css('display', '')
    nodetree.find('#tree_cancel_entity').css('display', '')       
}

function emv_update_treenode_value (elt, event) {
    let panelid    = $(elt).attr('id');
    let nodeid     = panelid.replace ('treepanel', 'treenode');

    $('#' + nodeid + ' input').val($(elt).attr('value'))
    $('#' + nodeid + ' input').trigger('change');
}


function emv_project_create_treeaid (application, aid) {
    
    let nodeitem = sb.get (emv_tree_applications, 'id', 'treenode-' + application.ClassName + '-' + application.Code)
    if (nodeitem.length == 0) {

    }else {
        nodeitem = nodeitem[0]
    }
    let fathernodename = application.ClassName + ':' + application.Code;

    let aid_treenode    = emv_treenodeitem(aid, {tag: '9F06',  value: aid.AID.toUpperCase(), fathernodename: fathernodename, closed:true}); 
    let aid_treepanel   = emv_aidpanel('treepanel-'+ aid.ClassName + '-' + aid.Code, {class: 'treepanel', withbar:false, style: 'display:none', events: {onchange: "emv_update_treenode_value(this, event)"}});  
    sb.tree_add_item (nodeitem, aid_treenode);
    sb.tree_add_item (aid_treenode, aid_treepanel);            

    emv_aid_update(aid_treepanel, aid.AID.toUpperCase()); 


    let avn_treenode = emv_treefielditem(aid, 'ApplicationVersionNumber', {tag: '9F09',   value: aid.ApplicationVersionNumber.toUpperCase().padStart(4, '0'), closed:true});  
    let avn_treepanel   = emv_avnpanel('treepanel-avn-' + aid.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});            
    sb.tree_add_item (aid_treenode, avn_treenode);
    sb.tree_add_item (avn_treenode, avn_treepanel);   
    
    emv_avn_update(avn_treepanel,hexa_to_int(aid.ApplicationVersionNumber).toString()); 


    let ap_treenode = emv_treefielditem(aid, 'ApplicationPriority', {tag: null,  name: 'Application Priority', value: aid.Priority, closed:true});  
    let ap_treepanel   = emv_avnpanel('treepanel-ap-' + aid.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});            
    sb.tree_add_item (aid_treenode, ap_treenode);
    sb.tree_add_item (ap_treenode, ap_treepanel);   
    
    emv_avn_update(ap_treepanel ,aid.Priority); 


    let tacdenial  = emv_treefielditem(aid, 'TerminalActionCodeDenial', {tag: 'DF57',   value: aid.TerminalActionCodeDenial.toUpperCase().padStart(10, '0'), closed:true}); 
    let bytepanel  = emv_bytepanel('treepanel-TerminalActionCodeDenial-' + aid.Code, 'DF57',   emv_TVR, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});
    sb.tree_add_item (aid_treenode, tacdenial);
    sb.tree_add_item (tacdenial,  bytepanel);            

    emv_byte_update(bytepanel, hexa_to_int(aid.TerminalActionCodeDenial))     

    let taconline  = emv_treefielditem(aid, 'TerminalActionCodeOnline', {tag: 'DF58',  value: aid.TerminalActionCodeOnline.toUpperCase().padStart(10, '0'), closed:true}); 
    bytepanel = emv_bytepanel('treepanel-TerminalActionCodeOnline-' + aid.Code, 'DF58',   emv_TVR, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});
    sb.tree_add_item (aid_treenode, taconline);
    sb.tree_add_item (taconline,  bytepanel);            

    emv_byte_update(bytepanel, hexa_to_int(aid.TerminalActionCodeOnline))     

    let tacdefault = emv_treefielditem(aid, 'TerminalActionCodeDefault', {tag: 'DF56',   value: aid.TerminalActionCodeDefault.toUpperCase().padStart(10, '0'), closed:true}); 
    bytepanel = emv_bytepanel('treepanel-TerminalActionCodeDefault-'  + aid.Code, 'DF56', emv_TVR, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});
    sb.tree_add_item (aid_treenode, tacdefault);
    sb.tree_add_item (tacdefault, bytepanel);            

    emv_byte_update(bytepanel, hexa_to_int(aid.TerminalActionCodeDefault))                
    return nodeitem;
}

function emv_project_create_treeterminal (terminal) {

    let nodeitem  = emv_treenodeitem(terminal, {name: 'Terminal ' + terminal.Code, closed:true});   

    sb.tree_add_item (emv_tree_terminals, nodeitem);

    let sn_treenode = emv_treefielditem(terminal, 'IFDSerialNumber', {tag: '9F1E',  value: terminal.IFDSerialNumber ,closed:true}); 
    let sn_treepanel = emv_snpanel('treepanel-IFDSerialNumber-' + terminal.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});        
    sb.tree_add_item (nodeitem, sn_treenode);
    sb.tree_add_item (sn_treenode, sn_treepanel);    
   
    emv_sn_update(sn_treepanel, terminal.IFDSerialNumber)                


    let cc_treenode = emv_treefielditem(terminal, 'TerminalCountryCode', {tag: '9F1A',  value: terminal.TerminalCountryCode.toUpperCase().padStart(4, '0'), closed:true}); 
    let cc_treepanel = emv_ccpanel('treepanel-TerminalCountryCode-' + terminal.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});      
    sb.tree_add_item (nodeitem, cc_treenode);
    sb.tree_add_item (cc_treenode, cc_treepanel);     
   
    emv_cc_update(cc_treepanel, terminal.TerminalCountryCode.toUpperCase().padStart(4, '0'));


    let tt_treenode  = emv_treefielditem(terminal, 'TerminalType', {tag: '9F35',  value: terminal.TerminalType.toUpperCase().padStart(2, '0'), closed:true}); 
    let tt_treepanel  = emv_ttpanel('treepanel-TerminalType-' + terminal.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});
    sb.tree_add_item (nodeitem, tt_treenode);
    sb.tree_add_item (tt_treenode, tt_treepanel);            
   
    emv_tt_update(tt_treepanel, terminal.TerminalType.toUpperCase().padStart(2, '0'));	
    
    let tc_treenode  = emv_treefielditem(terminal, 'TerminalCapabilities', {tag: '9F33', value: terminal.TerminalCapabilities.toUpperCase().padStart(6, '0'), closed:true}); 
    let tc_treepanel  = emv_bytepanel('treepanel-TerminalCapabilities-'  + terminal.Code,  '9F33', emv_TC,  {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}}) 
    sb.tree_add_item (nodeitem, tc_treenode);
    sb.tree_add_item (tc_treenode,  tc_treepanel);            

    emv_byte_update(tc_treepanel, hexa_to_int(terminal.TerminalCapabilities))    


    let atc_treenode   = emv_treefielditem(terminal, 'AdditionalTerminalCapabilities', {tag: '9F40', value: terminal.AdditionalTerminalCapabilities.toUpperCase().padStart(10, '0'), closed:true}); 
    let atc_treepanel  = emv_bytepanel('treepanel-AdditionalTerminalCapabilities-'  + terminal.Code,  '9F40', emv_ATC,  {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}}) 
    sb.tree_add_item (nodeitem, atc_treenode);
    sb.tree_add_item (atc_treenode,  atc_treepanel);            
   
    emv_byte_update(atc_treepanel, hexa_to_int(terminal.AdditionalTerminalCapabilities))    

    let ttq_treenode   = emv_treefielditem(terminal, 'TTQ',  {tag: '9F66', value: terminal.TTQ.toUpperCase().padStart(8, '0'), closed:true}); 
    let ttq_treepanel  = emv_bytepanel('treepanel-TTQ-'  + terminal.Code,  '9F66', emv_TTQ,  {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}}) 
    sb.tree_add_item (nodeitem, ttq_treenode);
    sb.tree_add_item (ttq_treenode,  ttq_treepanel);            
   
    emv_byte_update(ttq_treepanel, hexa_to_int(terminal.TTQ))    
    return nodeitem;
}

function emv_updateridname (content, values) {
    let appliitem = values[0];    
    let rid       = values[1];    
    try {
        let obj_response = JSON.parse(content);
        obj_response = obj_response.data[0];
        let vendor = obj_response.Vendor;
        appliitem.item = rid + '    --    ' +  vendor;        
    } catch (e) {
        let rid       = values[1];        
        appliitem.item = rid;           
    }
}

function  emv_project_updateapplications (manager) {
    for (var i = 0; i < manager.Applications.length; i++) {
        let application = manager.Applications[i];
        let nodeitem  = emv_treenodeitem(application, {value:application.RID, closed:true});  

        emv_table_search_aidtable(application.RID.toUpperCase(), 'RID', emv_updateridname, [nodeitem, application.RID])        

        sb.tree_add_item (emv_tree_applications, nodeitem);

        for (var index = 0; index < application.AID.length; index++) {  
            let aid =  application.AID[index]   
            emv_project_create_treeaid(application, aid)
        }
    }
}


function emv_project_updateterminals (manager) {
    for (var index = 0; index < manager.Terminals.length; index++) {
        let terminal = manager.Terminals[index];
        emv_project_create_treeterminal (terminal)

    }
}

//-----------------------------------------------------------------------------------------------------------------------------------------

function onclick_terminal (elt, event) {

    /*    
    if (!sb.tab_finditem(emv_maintabs, 'emv_terminal_tab')) { 
        let filetabitem    = {id: 'emv_terminal_tab',  item: 'Terminal',  type:'link', icon:  icon_terminal, items: [emv_terminals_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Terminal',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initterminal();         
    } 
    sb.tab_select(emv_maintabs, 'emv_terminal_tab'); 
    emv_project_updateterminal();        

    */
}  


//--------------------------------------------------------------------- ACCEPTOR /MERCHANT PANEL  --------------------------------------------------------------------

function emv_project_create_treeacceptor (acceptor) {

    let nodeitem = emv_tree_acceptor;

    let mcc_treenode = emv_treefielditem(acceptor, 'MerchantCategoryCode', {tag: '9F15',  value: acceptor.MerchantCategoryCode.toUpperCase().padStart(4, '0'), closed:true}); 
    let mcc_treepanel = emv_mccpanel('treepanel-MerchantCategoryCode-' + acceptor.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});      
    sb.tree_add_item (nodeitem, mcc_treenode);
    sb.tree_add_item (mcc_treenode, mcc_treepanel);     
   
    emv_mcc_update(mcc_treepanel, acceptor.MerchantCategoryCode.toUpperCase().padStart(4, '0'));

    let mi_treenode = emv_treefielditem(acceptor, 'MerchantIdentifier', {tag: '9F16',  value: acceptor.MerchantIdentifier ,closed:true}); 
    let mi_treepanel = emv_mipanel('treepanel-MerchantIdentifier-' + acceptor.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});        
    sb.tree_add_item (nodeitem, mi_treenode);
    sb.tree_add_item (mi_treenode, mi_treepanel);    
   
    emv_mi_update(mi_treepanel, acceptor.MerchantIdentifier)      
    
    let mnl_treenode = emv_treefielditem(acceptor, 'MerchantNameAndLocation', {tag: '9F4E',  value: acceptor.MerchantNameAndLocation ,closed:true}); 
    let mnl_treepanel = emv_mnlpanel('treepanel-MerchantNameAndLocation-' + acceptor.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});        
    sb.tree_add_item (nodeitem, mnl_treenode);
    sb.tree_add_item (mnl_treenode, mnl_treepanel);    
   
    emv_mnl_update(mnl_treepanel, acceptor.MerchantNameAndLocation)
    
    let ti_treenode = emv_treefielditem(acceptor, 'TerminalIdentification', {tag: '9F1C',  value: acceptor.TerminalIdentification ,closed:true}); 
    let ti_treepanel = emv_tipanel('treepanel-TerminalIdentification-' + acceptor.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});        
    sb.tree_add_item (nodeitem, ti_treenode);
    sb.tree_add_item (ti_treenode, ti_treepanel);    
   
    emv_ti_update(ti_treepanel, acceptor.TerminalIdentification)

}

function onclick_acceptor (elt, event) {
    /*  
    if (!sb.tab_finditem(emv_maintabs, 'emv_acceptor_tab')) { 
        let filetabitem    = {id: 'emv_acceptor_tab',  item: 'Acceptor',  type:'link', icon:  icon_shop, items: [emv_acceptor_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Acceptor/Merchant',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initacceptor();         
    } 
    sb.tab_select(emv_maintabs, 'emv_acceptor_tab');
    */

    emv_project_updateacceptor();        
}  


function emv_project_updateacceptor (manager) {
    let acceptor = manager.Acceptor;
    
    let MCC = acceptor.MerchantCategoryCode;	
    let MI  = acceptor.MerchantIdentifier;	
    let MNL = acceptor.MerchantNameAndLocation;
    let TI  = acceptor.TerminalIdentification;
    
    $('#emv_mccPanel').val(MCC)
    $('#emv_miPanel').val(MI);
    $('#emv_mnlPanel').val(MNL)
    $('#emv_tiPanel').val(TI);    
}

//--------------------------------------------------------------------- ACQUIRER PANEL  --------------------------------------------------------------------

function emv_project_create_treeacquirer (acquirer) {
    let nodeitem = emv_tree_acquirer;

    let ai_treenode = emv_treefielditem(acquirer, 'AcquirerIdentifier', {tag: '9F01',  value: acquirer.AcquirerIdentifier.toUpperCase().padStart(4, '0'), closed:true}); 
    let ai_treepanel = emv_aipanel('treepanel-AcquirerIdentifier-' + acquirer.Code, {class: 'treepanel', withbar:false, style: '', events: {onchange: "emv_update_treenode_value(this, event)"}});      
    sb.tree_add_item (nodeitem, ai_treenode);
    sb.tree_add_item (ai_treenode, ai_treepanel);         
    emv_ai_update(ai_treepanel, acquirer.AcquirerIdentifier)

}

//-----------------------------------------------------------------------------------------------------------------------------------------


function onclick_emv_treenode1(elt, event) {
    switch(elt.id) {
        case 'emv_treenode-terminals':
            onclick_terminal(elt, event)
        break;
        case 'emv_treenode-acceptor':
            onclick_acceptor(elt, event)
        break;            
        case 'emv_treenode-acquirer':
            onclick_acquirer(elt, event)
        break;            
        case 'emv_treenode-issuer':
            onclick_issuer(elt, event)
        break;         
        case 'emv_treenode-applications':
            onclick_application(elt, event)
        break;             

    }
}
function onclick_application (elt, event) {
    /*
    if (!sb.tab_finditem(emv_maintabs, 'emv_application_tab')) { 
        let filetabitem    = {id: 'emv_application_tab',  item: 'Application',  type:'link', icon:  icon_shop, items: [emv_application_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Application',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initaid();         
    } 
    sb.tab_select(emv_maintabs, 'emv_application_tab');
    */    
  //  emv_project_updateapplication();        
}  

function onchange_aidPanel (elt, event) {
    
}

function onchange_avnPanel (elt, event) {

}


function emv_project_initaid (index) {

}



