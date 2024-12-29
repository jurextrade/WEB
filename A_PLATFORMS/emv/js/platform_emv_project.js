
class emvproject {
    constructor (pname, name, path) {
        this.pname                   = pname; 
        this.Folder                  = path;    
        this.Name                    = name;
        this.Path                    = path;
        this.EMV                     = new EMVManager()   
        this.Loaded                  = 0; 
        this.Server                 = solution.EMVRouter_Address;
        this.Port                   = solution.EMVRouter_Port;   
    
    }

    Create = function () {
        return SubmitProjectRequest(this.Folder, this.Name, '', 'php/create_project.php', SYNCHRONE);
    }

    Remove = function () {
        if (solution.UserId == "0") return;        
        return SubmitProjectRequest(this.Folder, this.Name, '', 'php/remove_project.php', SYNCHRONE);
    }

    Rename = function (newname) {
        if (solution.UserId == "0") return;        
   
        let content = JSON.stringify({name: newname, path: this.path}, null, 2)
        let user = solution.get('user')
        let rootproject = user.fileexplorer.Root + user.path + '/EMV/' + this.path + "/config/";        
       
        user.send ({Name: 'savefile', Values: [rootproject + 'emv.ini', content]}, true, 
                    function (content, values) {
                        DisplayOperation("Project Succesfully Renamed", true, 'operationpanel');                             
                    }, 
                    [this]);  
    }
    
    Save = function () {
        let cuser = solution.get('user')
        if (!cuser.is_registered()) {
            return;
        }
            
        let rootproject     = cuser.fileexplorer.Root + cuser.path + '/EMV/' + this.Folder + "/Files/";

        this.EMV.Save (rootproject + 'emvsolution.json');
        
    }
    Load = function () {
        let  site           = solution.get('site');        
        let  user           = solution.get('user')               
        
        let rootproject = site.address + user.path + '/EMV/' + this.Folder + "/Files/";

        this.EMV.Load (rootproject + 'emvsolution.json', ASYNCHRONE,  this.UpdateEMV, this);
       
    }

    UpdateEMV = function (response, par) {
        let project = par[0];
        project.EMV = JSON.parse(response)
        emv_project_update(project);
        project.Loaded = 1;    
    }
}


//------------------------------------------------------------ PROJECT FILE BAR ----------------------------------------------------------

function onclick_emv_projectclose () {
    emv_OnCloseProject (solution.emv_CurrentProject, emv_closeproject, solution.emv_CurrentProject);
}

function emv_OnCloseProject (project, callafter, project) {
    if (!project) return;

    emv_CloseProjectConfirm(project, callafter, project);
}

function emv_CloseProjectConfirm(project, callafter, param) {
   
    sb.confirm_modal('Exit Project ' + project.Name + ' ?').yes(function () {
        setTimeout(OnCloseEMV, 300, callafter, param);        
        $("#confirmmodal").modal('hide');      
    }).no(function () {})
}

function OnCloseEMV(callafter, param) {

    var project = param;
    if (!project) return;

    if (project.ShouldSave) {
        //SaveStrategyConfirm(callafter, strategy);
    } else {
        callafter(project);
    }
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

    if (solution.UserId == "0") {
        TreatOperation(register_needed_label, 'operationpanel', 'red');
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

    if (solution.UserId == "0") {
        TreatOperation(register_needed_label, 'operationpanel', 'red');
        return;
    }
    if ($('#emv_projectsbar .box-btn-slide').hasClass('rotate-180'))    
        $('#emv_projectsbar #slide').click ();   

    var returnvalue = project.Remove ();
    if (returnvalue != -1) {

        sb.tree_removeitem('emv_tree_projects', project.Name);
        sb.select_removeitem('emv_projectselect', project.Name);

        if (project == solution.emv_CurrentProject) 
            emv_closeproject(project);    
    }
}



function emv_project_update (project) {
//    emv_project_initaid ();
//    emv_project_updateaid ();    

    emv_project_updateapplications ();    

    emv_project_initterminal();          
    emv_project_updateterminals();     

    emv_project_initacceptor();          
    emv_project_updateacceptor();     

    emv_project_initacquirer();          
    emv_project_updateacquirer();   
}


//--------------------------------------------------------- APPLICATION PANEL  ---------------------------------------------------------------

const emv_type_leaf = ['AID', 'RID', 'TERMINAL', 'ACCEPTOR', 'ACQUIRER'];


function emv_iconfromclass (type) {
    switch (type) {
        case 'AID':                   return icon_manager;
        case 'RID':                   return icon_site;
        case 'TERMINAL':              return icon_machine;
        case 'ACCEPTOR':              return icon_database;
        case 'ACQUIRER':              return icon_journal;
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

function emv_project_initapplications () {
    for (var i = 0; i < solution.emv_CurrentProject.EMV.Applications.length; i++) {

    }
}

function emv_treenodeitem (classname, index, tag, value,  closed, rootitem) {
    let nodename = classname;
    let name     =  tag == "" ? value : undefined;
    let root =  tag == "" ? emv_tree_update : emv_treenodetagitem(tag, value, index);

    return {
        id:   'treenode-' + classname + '-' + index,
        type: 'tree',
        item: name,
        arrow: false,
        class: 'treenode',
        rootitem: root ,
        closed:  closed,
        items: [],
     //   icon: emv_iconfromclass (classname),
        attributes:{
                    nodename: nodename,
                    draggable: true
        },
        events: emv_default_node_events,   
    }    
}

function onchange_emv_treenode_input (elt) {
    console.log ('I am here')
    var nodetree = $(elt).closest('.treenode').find('span:first');
    nodetree.find('#tree_update_entity').css('display', '')
    nodetree.find('#tree_cancel_entity').css('display', '')       
}

function onclick_emv_treenode_modify (elt, event) {
  
    let nodeid   = $(elt.parentElement).closest('.sb_link').attr('id');
    let nodename = $('#' + nodeid).attr('nodename');

    let panelid     = nodeid.replace ('treenode', 'treepanel');
    let hidden      =  $('#' + panelid).css ('display') == 'none' ? true : false;    

    console.log ('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
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
    var nodetree    = $(elt).closest('.treenode').find('span:first');
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
    if ($('#' + panelid).hasClass('ttpanel')) {
        emv_tt_update(treepanel[0], prevvalue)    
    }
    if ($('#' + panelid).hasClass('aidpanel')) {
        emv_aid_update(treepanel[0], prevvalue)    
    }
    if ($('#' + panelid).hasClass('avnpanel')) {
        emv_avn_update(treepanel[0], array_to_int(prevvalue).toString())    
    }
    if ($('#' + panelid).hasClass('ccpanel')) {
        emv_cc_update(treepanel[0], prevvalue)    
    }
    if ($('#' + panelid).hasClass('snpanel')) {
        emv_sn_update(treepanel[0], prevvalue)    
    }


    nodetree.find('#tree_update_entity').css('display', 'none')
    nodetree.find('#tree_cancel_entity').css('display', 'none')        
    
    event.preventDefault();    
    event.stopPropagation();  
        
}

function update_treenode_value (elt, event) {
    let panelid    = $(elt).attr('id');
    let nodeid     = panelid.replace ('treepanel', 'treenode');

    $('#' + nodeid + ' input').val($(elt).attr('value'))
    $('#' + nodeid + ' input').trigger('change');
    console.log ('triggered')
}


function  emv_project_updateapplications () {
    for (var i = 0; i < solution.emv_CurrentProject.EMV.Applications.length; i++) {
        let application = solution.emv_CurrentProject.EMV.Applications[i];
        let nodeitem  = emv_treenodeitem('RID', i, '', application.RID.toUpperCase(), true);   
//        var panelitem = netprog_treepanelitem(manager, applicationclass, false);
        console.log ('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaapplications')
        sb.tree_add_item (emv_tree_applications, nodeitem);

        for (var index = 0; index < application.AID.length; index++) {  
            let aid =  application.AID[index]   

            let aid_treenode    = emv_treenodeitem('aid', index, '9F06',  aid.AID.toUpperCase(), true); 
            let aid_treepanel   = emv_aidpanel('treepanel-aid-'+ index, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});  
            sb.tree_add_item (nodeitem, aid_treenode);
            sb.tree_add_item (aid_treenode, aid_treepanel);            

            emv_aid_update(aid_treepanel, aid.AID.toUpperCase()); 

        
            let avn_treenode = emv_treenodeitem('avn', index, '9F09',  array_to_int(aid.ApplicationVersionNumber).toString (16).toUpperCase().padStart(4, '0'), true); 
            let avn_treepanel   = emv_avnpanel('treepanel-avn-'+ index, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});            
            sb.tree_add_item (aid_treenode, avn_treenode);
            sb.tree_add_item (avn_treenode, avn_treepanel);   
            
            emv_avn_update(avn_treepanel,array_to_int(aid.ApplicationVersionNumber).toString()); 

            let tacdenial  = emv_treenodeitem('tacdenial', index, 'DF57',  array_to_int(aid.TerminalActionCodeDenial).toString (16).toUpperCase().padStart(10, '0'), true); 
            let bytepanel  = emv_bytepanel('treepanel-tacdenial-'+ index, 'DF57',   emv_TVR, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});
            sb.tree_add_item (aid_treenode, tacdenial);
            sb.tree_add_item (tacdenial,  bytepanel);            

            emv_byte_update(bytepanel, array_to_int(aid.TerminalActionCodeDenial))     

            let taconline  = emv_treenodeitem('taconline', index, 'DF58',  array_to_int(aid.TerminalActionCodeOnline).toString (16).toUpperCase().padStart(10, '0'), true); 
            bytepanel = emv_bytepanel('treepanel-taconline-'+ index, 'DF58',   emv_TVR, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});
            sb.tree_add_item (aid_treenode, taconline);
            sb.tree_add_item (taconline,  bytepanel);            

            emv_byte_update(bytepanel, array_to_int(aid.TerminalActionCodeOnline))     

            let tacdefault = emv_treenodeitem('tacdefault', index, 'DF56',  array_to_int(aid.TerminalActionCodeDefault).toString (16).toUpperCase().padStart(10, '0'), true); 
            bytepanel = emv_bytepanel('treepanel-tacdefault-' + index, 'DF56', emv_TVR, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});
            sb.tree_add_item (aid_treenode, tacdefault);
            sb.tree_add_item (tacdefault, bytepanel);            

            emv_byte_update(bytepanel, array_to_int(aid.TerminalActionCodeDefault))                
        }
    }
}

function emv_project_updateterminals (index) {
    for (var index = 0; index < solution.emv_CurrentProject.EMV.Terminals.length; index++) {
        let terminal = solution.emv_CurrentProject.EMV.Terminals[index];
        let nodeitem  = emv_treenodeitem('TERMINAL', index, '', 'Terminal ' + index, true);   

        console.log ('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttterminals')
        sb.tree_add_item (emv_tree_terminals, nodeitem);
 
        let ATC = terminal.AdditionalTerminalCapabilities;
        let TTQ = terminal.TTQ



        let sn_treenode = emv_treenodeitem('sn', index, '9F1E',  terminal.IFDSerialNumber , true); 
        let sn_treepanel = emv_snpanel('treepanel-sn-'+ index, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});        
        sb.tree_add_item (nodeitem, sn_treenode);
        sb.tree_add_item (sn_treenode, sn_treepanel);    
       
        emv_sn_update(sn_treepanel, terminal.IFDSerialNumber)                
    

        let cc_treenode = emv_treenodeitem('cc', index, '9F1A',  array_to_int(terminal.TerminalCountryCode).toString (16).toUpperCase().padStart(4, '0'), true); 
        let cc_treepanel = emv_ccpanel('treepanel-cc-'+ index, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});      
        sb.tree_add_item (nodeitem, cc_treenode);
        sb.tree_add_item (cc_treenode, cc_treepanel);     
       
        emv_cc_update(cc_treepanel, array_to_int(terminal.TerminalCountryCode).toString (16).toUpperCase().padStart(4, '0'));
    

        let tt_treenode  = emv_treenodeitem('tt', index, '9F35',  terminal.TerminalType.toString (16).toUpperCase().padStart(2, '0'), true); 
        let tt_treepanel  = emv_ttpanel('treepanel-tt-'+ index, {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}});
        sb.tree_add_item (nodeitem, tt_treenode);
        sb.tree_add_item (tt_treenode, tt_treepanel);            
       
        emv_tt_update(tt_treepanel, terminal.TerminalType.toString(16));	
        
        let tc_treenode  = emv_treenodeitem('tc', index, '9F33', array_to_int(terminal.TerminalCapabilities).toString (16).toUpperCase().padStart(6, '0'), true); 
        let tc_treepanel  = emv_bytepanel('treepanel-tc-' + index,  '9F33', emv_TC,  {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}}) 
        sb.tree_add_item (nodeitem, tc_treenode);
        sb.tree_add_item (tc_treenode,  tc_treepanel);            

        emv_byte_update(tc_treepanel, array_to_int(terminal.TerminalCapabilities))    


        let atc_treenode   = emv_treenodeitem('atc', index, '9F40', array_to_int(terminal.AdditionalTerminalCapabilities).toString (16).toUpperCase().padStart(10, '0'), true); 
        let atc_treepanel  = emv_bytepanel('treepanel-atc-' + index,  '9F40', emv_ATC,  {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}}) 
        sb.tree_add_item (nodeitem, atc_treenode);
        sb.tree_add_item (atc_treenode,  atc_treepanel);            
       
        emv_byte_update(atc_treepanel, array_to_int(terminal.AdditionalTerminalCapabilities))    

        let ttq_treenode   = emv_treenodeitem('ttq', index, '9F66', array_to_int(terminal.TTQ).toString (16).toUpperCase().padStart(8, '0'), true); 
        let ttq_treepanel  = emv_bytepanel('treepanel-ttq-' + index,  '9F66', emv_TTQ,  {class: 'treepanel', withbar:false, events: {onchange: "update_treenode_value(this, event)"}}) 
        sb.tree_add_item (nodeitem, ttq_treenode);
        sb.tree_add_item (ttq_treenode,  ttq_treepanel);            
       
        emv_byte_update(ttq_treepanel, array_to_int(terminal.TTQ))    
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

function onchange_tsnPanel (elt, event) {

}

function onchange_ttcPanel (elt, event) {

}

function emv_project_initterminal (index) {

}



//--------------------------------------------------------------------- ACCEPTOR /MERCHANT PANEL  --------------------------------------------------------------------

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


function onchange_mccPanel (elt, event) {

}

function onchange_miPanel (elt, event) {

}

function onchange_mnlPanel (elt, event) {

}

function onchange_tiPanel (elt, event) {

}

function emv_project_initacceptor () {
}

function emv_project_updateacceptor () {
    let acceptor = solution.emv_CurrentProject.EMV.Acceptor;
    
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

function onclick_acquirer (elt, event) {
    /*  
    if (!sb.tab_finditem(emv_maintabs, 'emv_acquirer_tab')) { 
        let filetabitem    = {id: 'emv_acquirer_tab',  item: 'Acquirer',  type:'link', icon:  icon_shop, items: [emv_acquirer_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Acquirer/Merchant',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initacquirer();         
    } 
    sb.tab_select(emv_maintabs, 'emv_acquirer_tab');
    */    
    emv_project_updateacquirer();        
}  

function onchange_aiPanel (elt, event) {

}

function emv_project_initacquirer () {
}

function emv_project_updateacquirer () {
    let acquirer = solution.emv_CurrentProject.EMV.Acquirer;
    
    let AI = acquirer.AcquirerIdentifier;	

    
    $('#emv_aiPanel').val(AI)
   
}


//-----------------------------------------------------------------------------------------------------------------------------------------

function onclick_emv_treenode(elt, event) {
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



