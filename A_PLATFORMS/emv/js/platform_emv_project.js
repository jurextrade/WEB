function onclick_terminal (elt, event) {
    //    return;
    if (!sb.tab_finditem(emv_maintabs, 'emv_terminal_tab')) { 
        let filetabitem    = {id: 'emv_terminal_tab',  item: 'Terminal',  type:'link', icon:  icon_terminal, items: [emv_terminal_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Terminal',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initterminal();         
    } 
    sb.tab_select(emv_maintabs, 'emv_terminal_tab');
    emv_project_updateterminal();        
}  

function onchange_tsnPanel (elt, event) {

}

function onchange_ttcPanel (elt, event) {

}

function emv_project_initterminal () {
    emv_tt_init(emv_TTPanel);           
    emv_byte_init(emv_TCPanel);
    emv_byte_init(emv_ATCPanel);   
    emv_byte_init(emv_TTQPanel); 
}

function emv_project_updateterminal () {
    let terminal = solution.emv_CurrentProject.EMV.Terminals[0];
    let ATC = terminal.AdditionalTerminalCapabilities;
    let TC  = terminal.TerminalCapabilities;
    let TTQ = terminal.TTQ
    let TSN = terminal.IFDSerialNumber 
    let TCC = terminal.TerminalCountryCode

    emv_tt_update(emv_TTPanel, terminal.TerminalType.toString(16));			
    emv_byte_update(emv_TCPanel,  (TC[0] << 16 | TC[1] << 8 | TC[2]).toString())			  
    emv_byte_update(emv_ATCPanel, array_to_int(ATC).toString(), 0, 3)
    emv_byte_update(emv_TTQPanel, array_to_int(TTQ).toString())    
    
    let ttc1hexastring = TCC[0].toString(16).length == 1 ?  "0" +  TCC[0].toString(16) : TCC[0].toString(16) 
    let ttc2hexastring = TCC[1].toString(16).length == 1 ?  "0" +  TCC[1].toString(16) : TCC[1].toString(16) 

    $('#emv_tccPanel').val(ttc1hexastring + ttc2hexastring)
    $('#emv_tsnPanel').val(TSN);
}

//--------------------------------------------------------------------- ACCEPTOR /MERCHANT PANEL  --------------------------------------------------------------------

function onclick_acceptor (elt, event) {
    //    return;
    if (!sb.tab_finditem(emv_maintabs, 'emv_acceptor_tab')) { 
        let filetabitem    = {id: 'emv_acceptor_tab',  item: 'Acceptor',  type:'link', icon:  icon_shop, items: [emv_acceptor_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Acceptor/Merchant',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initacceptor();         
    } 
    sb.tab_select(emv_maintabs, 'emv_acceptor_tab');
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
    //    return;
    if (!sb.tab_finditem(emv_maintabs, 'emv_acquirer_tab')) { 
        let filetabitem    = {id: 'emv_acquirer_tab',  item: 'Acquirer',  type:'link', icon:  icon_shop, items: [emv_acquirer_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Acquirer/Merchant',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initacquirer();         
    } 
    sb.tab_select(emv_maintabs, 'emv_acquirer_tab');
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

//--------------------------------------------------------- APPLICATION PANEL  ---------------------------------------------------------------

function onclick_application (elt, event) {
    //    return;
    if (!sb.tab_finditem(emv_maintabs, 'emv_application_tab')) { 
        let filetabitem    = {id: 'emv_application_tab',  item: 'Application',  type:'link', icon:  icon_shop, items: [emv_application_section], onclose: 'onclick="onclick_emv_tab_close(this, event)"',    title: 'Application',      events: {onclick:"onclick_emv_tab(this, event)"}}           
        sb.tab_additem(emv_maintabs, filetabitem);

        emv_project_initapplication();         
    } 
    sb.tab_select(emv_maintabs, 'emv_application_tab');
    emv_project_updateapplication();        
}  

function onchange_aidPanel (elt, event) {
    
}

function onchange_avnPanel (elt, event) {

}


function emv_project_initappllication (application) {
}

function emv_project_updateapplication (application) {
    let aid = application.AID;
   
    $('#emv_aiPanel').val(AI)
   
}
//-----------------------------------------------------------------------------------------------------------------------------------------

function onclick_emv_treenode(elt, event) {
    switch(elt.id) {
        case 'emv_treenode-terminal':
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
