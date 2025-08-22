var Interval_loadproject        = 0;
var Interval_selectstrategy     = 0;
var Interval_selectchart        = 0;

var CurrentEngine           = null;
var CurrentStrategy         = null;

//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function project_init() {
    project_solution('project');
    project_editors_init('project');   
    project_gse_init(); 

    DeployConnect(solution.DeployServer_Address, solution.DeployServer_Port, solution.DeployServer_Reconnection);  


    project_assistant_select (projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW); 


    sidebarpanel_show(projectplatform, "sidebarpanel_files");       
    setInterval(project_timer, 300);         

}

function project_end () {
     project_DeployCom.Close ();
}

//---------------------------------------------------------------------MODULE END -----------------------------------------------------------------------------//


function project_select (name) {

//--- data ui platform update .............
    let ui  = solution.get('ui')           

// market    
    $('#marketpanel').css ('display', 'flex');        
    
    ui.platform_updatedata('project', solution.CurrentProject)

    ui.platform_expand(name, true);

    AnimationReset('animation')

    $("#home_root").parent().scrollTop(0);  
    SelectChart ();
    //DrawChart();

    if (!solution.CurrentProject) {
  //      sidebarmenu_select ('sidebar_files', true);    

        $('#newprojectname').focus();           
        if (!projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW) {
            AnimationDisplay ('project', 'Select or Create a Project to Start', 'project_toppanel');      
        } else {
        }
        TreatInfo("Select a project or create one");
    }
}


function project_solution (pname) {

    let  site           = solution.get('site');
    let  user           = solution.get('user')

    solution.Projects       = [];

    solution.CurrentProject = null;

    solution.DeployServer_Protocol      = site.protocol;    
    solution.DeployServer_Reconnection  = project_default_server_reconnection;        
    solution.DeployServer_Address       = project_default_server_name;   


    if (site.protocol == 'http:') {                                 //PROJECT=2
        solution.DeployServer_Port     =  project_default_server_port;     
    }
    else {
        solution.DeployServer_Port     =  project_default_server_sport;    
    }

    if (!solution.DefaultLoaded) {
        pg_solution ()
        solution.LoadPGDefault (pname);   
        solution.DefaultLoaded = true;            
    }  
    solution.UpdatePredefinedIndicators (pname);
    

    solution.NewProject = function (name) {
        if (!name) {
            name = this.ProjectFindName(name);
        }

        let project = new pgproject(PROJECT_PLATFORM_PNAME, name, name);
        project.Loaded = true;
        project.Folder = name;
        project.PG.Objects = this.Objects.slice(0);        

        solution.Projects.push(project);
        project.Save ();
        return project;
    }     

    solution.ProjectFindName = function (name) {
        if (!name || name == "") {
            var newname = "NewProject_";
            var i = 0;
            while (i >= 0) {
                if (this.project_GetProjectFromName(newname + i)) i++;
                else {
                    name = newname + i;
                    break;
                }
            }
        }
        return name;
    }

    solution.project_GetProjectFromName = function (name) {
        for (var i = 0; i < this.Projects.length; i++) {
            if (this.Projects[i].Name == name) return this.Projects[i];
        }
        return null;
    }

    solution.GetProjectFromFolder = function (folder) {
        for (var i = 0; i < this.Projects.length; i++) {
            if (this.Projects[i].Folder == folder) return this.Projects[i];
        }
        return null;
    }    
    solution.GetProjectFromCom = function (com) {  //running priority
     
        for (var i = 0; i < this.Projects.length; i++) {
            if (this.Projects[i].Com == com) {
                return this.Projects[i];
            };
        }        
        return null;
    }

    solution.project_LoadProjects = function (userid, url, async, interfacecallback, par) {

        let callback = function (responsetext, values) {
            let arraystructure;    
            try {
                arraystructure = JSON.parse(responsetext);
            } catch(e) {
                return console.error(e); 
            }  
            for (var i = 0; i < arraystructure.length; i++) {
                let projectstruct = arraystructure[i];

                if (!projectstruct.Name || !projectstruct.Path) continue;
                if (values[0].id == '0' && projectstruct.Name != project_default_projectname) continue;                    
                let project = new pgproject(PROJECT_PLATFORM_PNAME, projectstruct.Name, projectstruct.Path)

                project =  {...project, ...projectstruct}

                solution.Projects.push(project);
            }   
        }

        let param = {
            user_id :  (userid == "0" ? "1" : userid),
            platform_pname: PROJECT_PLATFORM_PNAME,
            platform_folder : 'Projects'             
        }

        url_submit ('POST', url, param /*object {}*/, async, callback, [solution.user] , interfacecallback, par);
    }

    solution.UpdateDistributeTerminals = function (solution) {
        DistributePanel_Update(solution);
    }

    solution.project_LoadTerminals = function (Id, url, async, interfacecallback, par) {
        if (!async) async = false;
        var params = 'user_id=' + (Id == "0" ? "1" : Id);

        var xhttp = new XMLHttpRequest();

        xhttp.solution = this;
        xhttp.userid = Id;

        xhttp.onreadystatechange = function () {

            let solution = xhttp.solution;

            if (this.readyState == 4 && this.status == 200) {
                let arraystructure =  JSON.parse(this.responseText);
                for (var i = 0; i < arraystructure.length; i++) {

                    let terminalstruct = arraystructure[i];

                    let pathElements = terminalstruct.DataPath.replace(/\/$/, '').split('/');
                    let sdatapath = pathElements[pathElements.length - 1];
                    
                    if (terminalstruct.Type == 'MT4') {   

                        if (solution.GetTerminalsFromName (terminalstruct.Name).length != 0) continue;
                        if (this.userid == '0' && terminalstruct.Name != tradedesk_default_terminalname) continue;

                        terminalstruct.Type = 'Terminal';
                        let realterminal   = new pgterminal(TRADEDESK_PLATFORM_PNAME, terminalstruct.Type);
                        realterminal =  {...realterminal, ...terminalstruct}
 
                        terminalstruct.Type = 'Tester';                        
                        let testerterminal  = new pgterminal(TRADEDESK_PLATFORM_PNAME, terminalstruct.Type);
                        testerterminal =  {...testerterminal, ...terminalstruct}
                        realterminal.Folder             = testerterminal.Folder = sdatapath;
                        solution.Terminals.push(realterminal);
                        solution.Terminals.push(testerterminal);
                    }
                }    
                if (interfacecallback)  interfacecallback (par);            
            }
        }
        
        xhttp.open('POST', url, async);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }

    solution.project_UpdateProjects = function (solution) {
        let projects = [];
        
        for (var j = 0; j < solution.Projects.length; j++) {
            let project = solution.Projects[j];
            projects.push({
                id:'project_' + project.Name, type: 'link', item: project.Name, icon: icon_project,
                attributes:{selector: 'project_selectproject', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
                events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}        
            });
            sb.select_additem ('project_projectselect', project.Name);        
        }
    
        sb.tree_additems ('project_tree_projects', projects);
        StrategyAssistantFillProjects ();     
    }
    solution.project_LoadTerminals(user.id, site.address  + "/php/read_terminals.php", SYNCHRONE, solution.UpdateDistributeTerminals, solution);    
    solution.project_LoadProjects(user.id, site.address + "/php/read_projects.php",  SYNCHRONE, solution.project_UpdateProjects, solution);
}

function project_timer () {
    var shouldDisable = true;
   
    
    if (solution.CurrentProject) {        
       
//project
        $('#project_projectsbar #project_projectrename').css ('display', '');
        $('#project_projectsbar #project_projectremove').css ('display', '');
        $('#project_projectsbar #project_projectdeploygroup').css ('display', '');
        $('#project_projectsbar #project_projectclose').css ('display', '');
        $('#project_strategiesbar #project_strategycreate').css ('display', '');
 
        $('#project_conditionsbar #conditionCreate').css ('display', '');       
        $("#project_distributebuttons").css ('visibility', '');            
        $("#projectselectstrategypanel").css ('display', '');  
        $('#project_root #indicatorCreate').css ('display', '');   
    }
    else {
//project
        $('#project_projectsbar #project_projectrename').css ('display', 'none');
        $('#project_projectsbar #project_projectremove').css ('display', 'none');
        $('#project_projectsbar #project_projectdeploygroup').css ('display', 'none');
        $('#project_projectsbar #project_projectclose').css ('display', 'none');
             

        $('#project_strategiesbar #' + 'project_strategycreate').css ('display', 'none');        
        $('#project_strategiesbar #' + 'project_strategyrename').css ('display', 'none');
        $('#project_strategiesbar #' + 'project_strategyremove').css ('display', 'none');  
   
        $('#assistantbar *').css ('display', 'none');
        $('#project_conditionsbar #' + 'conditionCreate').css ('display', 'none');    
        $('#overlay_strategyhelper').remove();     
        
        $("#project_distributebuttons").css ('visibility', 'hidden');          
        $("#projectselectstrategypanel").css ('display', 'none');  
        
        $('#project_root #indicatorCreate').css ('display', 'none');            
    }
    if (CurrentStrategy) {
        $('#projectstrategyfileaction').css ('display', '');            

        $('#project_strategiesbar #project_strategyrename').css ('display', '');
        $('#project_strategiesbar #project_strategyremove').css ('display', '');
    
        $('#assistantbar *').css ('display', '');
        $('#project_strategydeploygroup').css ('display', ''); 
        
    }    
    else {
        $('#projectstrategyfileaction').css ('display', 'none');
        $('#project_strategiesbar #project_strategyrename').css ('display', 'none');
        $('#project_strategiesbar #project_strategyremove').css ('display', 'none');    
        $('#overlay_strategyhelper').remove();        

        $('#assistantbar *').css ('display', 'none'); 
        $('#project_strategydeploygroup').css ('display', 'none');               
    }    
}



function project_home_open  (event) {
    let platform =  sb.get(main, 'pname', 'home');
    //    LoaderDisplay(true);
    if (platform.length == 0) {
        solution.add_module('home');               
    } 
  
    let ui  = solution.get('ui')     
    ui.platform_select(HOME_PLATFORM_PNAME)   
    onclick_home_mainbar ($('#home_mainbar_trading')[0], event)      
}

function project_loadedproject (project) {
    if (project.Loaded) {
        clearInterval(Interval_loadproject);
        TreatInfo("Project " + project.Name + " loaded");            
        LoaderDisplay(false);         
        project_drawproject(project, true);        
    }
    return project;
}

function project_selectproject(project, forcedisplay) {
  
    if (!project) {
        return null;
    }
    if (project == solution.CurrentProject) {
        return project;
    }
    
//--- data ui platform update .............
    let ui  = solution.get('ui')       
    solution.CurrentProject = project;
    ui.platform_updatedata('project', solution.CurrentProject)              

    project_initproject()

    if (!project.Loaded) {
        LoaderDisplay(true);        
        TreatInfo("Loading Project " + project.Name + "  ... Please wait");

        Interval_loadproject = setInterval(project_loadedproject, 300, project); //5 minutes 300000     
        project.Load();
    }
    else {
        project_updateengines (project);
        solution.UpdateIndicators(project);
        solution.UpdateSchedules (project);        
        project_updateexperts(project);
        project_updateconditions(project);   

        TreatInfo("Project " + project.Name + " loaded");            
        project_drawproject(project, true);        
    }
    return project;
}

function project_closeproject(project) {
    if (!project) {
        return;
    }
    
    if (project.ShouldSave) {
        SaveProjectConfirm(project);
    } else {
  
        project_closestrategy (); 
    }
   
    if (project == solution.CurrentProject) {
        project_initproject ();    
        project_drawproject(project, false);

//--- data ui platform update .............
        let ui  = solution.get('ui')               
        solution.CurrentProject = null;   
        ui.platform_updatedata('project', solution.CurrentProject)                   
    }   
    return project; 
}

function project_initproject () {

    solution.CurrentProject.CurrentStrategy = null;
    CurrentStrategy = null;
    CurrentEngine = null;

    sb.tree_removechildren ('project_tree_createdindicators');
    sb.tree_removechildren ('project_tree_conditions');
    sb.tree_removechildren ('project_tree_experts');
    sb.tree_removechildren ('project_tree_strategies');
 
    sb.tab_clear (strategyfiletab, 'project_home_tab');      
    $('#projectstrategyselect').html('');     
    $('#project_tester_stop_button').attr('disabled',true);    
    $('#project_tester_play_button').attr('disabled',true);      
}

function project_drawproject(project, open) {
    if (!project) {
        return;
    }
    
    let ui       = solution.get('ui') 
    let platform = ui.platform_get ('name', PROJECT_PLATFORM_NAME);     


    if (open) {

        clearInterval(Interval_selectchart);
        Interval_selectchart = setInterval(SelectChart, 300); //5 minutes 300000	 
    
        $("#project_projectselect option[value='--Select Project--']").remove();   
        $('#project_projectselect option[value="' + project.Name + '"]').prop('selected', true);
        sb.tree_selectitem ('project_tree_projects', project.Name);  
        sb.box_toggle('project_boxstrategiespanel', true);

        $('#popupnewproject').css ('display', 'none');
        $('#popupnewstrategy').css ('display', 'block');

        StrategyAssistantFillIndicators(project);
        StrategyAssistantFillStrategies (project); 
        AssistantGoToStep ('strategy_assistant_panel', STEP_PROJECTSELECTION);

        project_editors_update()
//        AnimationDisplay ('project', 'Select a strategy or create one');    
    } else {
        solution.CurrentProject = null; 
        $("#project_projectselect option").eq(0).before($('<option>', {value: '--Select Project--', text: '--Select Project--'}));
        $("#project_projectselect option[value='--Select Project--']").prop('selected', true);
        sb.tree_selectitem ('project_tree_projects', '');

        sb.box_toggle('boxindicatorspanel', false);
        sb.box_toggle('project_boxconditionspanel', false);

        $('#popupnewproject').css ('display', 'block');
        $('#popupnewstrategy').css ('display', 'none');
 
        
        StrategyAssistantFillProjects();
        AssistantGoToStep ('strategy_assistant_panel', STEP_PROJECTSELECTION);

        BottomPanel_Flat(platform, true, true);         

        AnimationDisplay('project_main', 'Goodbye', 'project_toppanel');             
    }    
}

function onchange_project_projectselect (elt, event) {
    let projectname= $('#' + elt.id + ' option:selected').val();
    let project = solution.project_GetProjectFromName(projectname);
    if (project == solution.CurrentProject) return;
    project_selectproject(project);
}

function project_saveproject(project) {
    if (!project) return;
    if (solution.get('user').id == "0") {
        TreatInfo("Project can not be saved, You are not registered");
        return;
    }
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START SAVING " + project.Name, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TreatInfo("Saving Project " + project.Name );            

    project_savestrategy (project.CurrentStrategy)
    project.Save();


    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> FINISH SAVING " + project.Name, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TreatInfo("Project " + project.Name + " Saved ");            
}

//------------------------------------------------------------ PROJECT STRATEGY ----------------------------------------------------------

function project_savestrategy (strategy) {

    if (CurrentEngine) {
        strategy.pBEngine.Copy(CurrentEngine);
        var original = strategy.pBEngine.Code[CODE_SS];
        var modified = strategy.pBEngine.SCContent;
        strategy.pBEngine.Code[CODE_SS] = strategy.pBEngine.SCContent;
        strategy.CContent = CEditor.getValue();
//Generate C File if nothing inside

        if (strategy.CContent == "") {
            strategy.CContent = GenerateCStrategy(strategy);
            CEditor.setValue(strategy.CContent);
        }
        strategy.Code[CODE_CPP] = strategy.CContent;
     //   strategy.Description = projectplatform.strategyquilleditor;

        // for buttons to be ok saved

        CurrentEngine.Code[CODE_SS] = CurrentEngine.SCContent;
        strategy.ShouldSave = false;
        strategy.Created = false;
    }

//    project_saveproject(solution.CurrentProject);
}

function project_selectstrategy(strategy) {

    if (!strategy || strategy == CurrentStrategy) {
        return;
    }
    
    if (TestMode) {
        Engine_Stop(CurrentEngine);
    }
    
    PausedSimulator = 0;
    let shouldinitialize = false; 
    
    let strategypanelcontent = $('#strategypaneltabcontent');
    if (strategypanelcontent.length == 0) {
        shouldinitialize = true;
    }

    if (!sb.tab_finditem (strategyfiletab, strategy.Name)) {
        var strategyfiletabitem  = {id: strategy.Name,   icon: icon_strategy, item: strategy.Name,  type: 'link', roleid: 'strategypaneltabcontent',   
                                    onclose:'onclick="onclick_StrategyCloseTabItem(this, event)"', 
                                    items: [strategypanel],  events: {onclick: "onclick_StrategyTabItem(this)"}}
        sb.tab_additem (strategyfiletab, strategyfiletabitem);
    }
    if (shouldinitialize) {

        project_assistant_init ();
        if (projectplatform.strategyview != STRATEGY_ASSISTANT_VIEW) {
            $('#classicviewbox').css ('display', 'flex'); 
            $('#assistantviewbox').css ('display', 'none'); 
        }        
        else {
            $('#classicviewbox').css ('display', 'none'); 
            $('#assistantviewbox').css ('display', 'flex');             
        }        
    }
    sb.tab_select (strategyfiletab,   strategy.Name);

    project_savestrategy(CurrentStrategy);
    var engine = strategy.pBEngine.Clone();

 
    if (engine.Schedules.length == 0) {
        var schedule = new pgschedule(engine.StartRule, engine.Operation, '', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '0');
        engine.Schedules.push(schedule);
        solution.CurrentProject.PG.Schedules.push(schedule);
    }

    ParseEngine(engine);

    for (var i = 0; i < engine.Indicators.length; i++) {
        if (!strategy.UsedIndicators.includes(engine.Indicators[i])) {        
            strategy.UsedIndicators.push (engine.Indicators[i]);
        }
    }

    var symbolcanvas = solution.GetCanvasFromTerminal(solution.CurrentProject);
    if (!symbolcanvas) return;  
   
    symbolcanvas.Indicators = [];
    
    for (var i = 0; i < strategy.UsedIndicators.length; i++) {
        var object = solution.CurrentProject.PG.GetObjectFromId (strategy.UsedIndicators[i]);    
        symbolcanvas.AddIndicator(object.Id);
    }

    var strategyperiod = null;

    if (strategy.Created)    {
        strategyperiod = P_M1;
    }
    else {
        if (engine.Periods.length != 0) {
            strategyperiod = Math.min.apply(null, engine.Periods);
        } 
    }

    solution.CurrentProject.CurrentStrategy = strategy;
    CurrentStrategy = strategy;
    CurrentEngine = engine;


    RefreshStrategy(strategy);
    DrawStrategy(strategy, true);

    SelectChart(strategyperiod); 
    return strategy;

}

function project_closestrategy(strategy) {
    if (!strategy) return null;

    sb.tab_delete (strategyfiletab, strategy.Name);    

    if (strategy == solution.CurrentProject.CurrentStrategy ) {
        
        CurrentStrategy = null;
        solution.CurrentProject.CurrentStrategy = null; 
        CurrentEngine = null;

        if (TestMode) Engine_Stop(CurrentEngine);
        PausedSimulator = 0;
        
        DrawStrategy(null, false);
    }
}

//---------------------------------------------------- CLOSE ALL STRATEGIES ------------------------------------------------ 

function CloseAllStrategies() {
    for (var i= strategyfiletab.items.length - 1; i >= 0; i--) {
        let strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyfiletab.items[i].item);
        if (strategy) {
            project_closestrategy(strategy);
        }
    }
}

function CloseSavedStrategies() {
    for (var i= strategyfiletab.items.length - 1; i >= 0; i--) {
        let strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyfiletab.items[i].item);
        if (strategy && !strategy.ShouldSave) {
            project_closestrategy(strategy);
        }
    }
}

//---------------------------------------------------- DISTRIBUTE STRATEGY ---------------------------------------------- 

function onclick_project_strategydistribute (elt, event) {

}

function onclick_project_strategycompile(elt, event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;    
  //  BottomPanel_Flat(platform, false);    
    SelectCompileStrategy (solution.CurrentProject, CurrentStrategy, 'MQL4')
}
//---------------------------------------------------- DISTRIBUTE PROJECT ---------------------------------------------- 

function onclick_project_projectdistribute () {
    sidebarmenu_select('sidebar_deploy', 1);
    TreatInfo("Select Terminal you want to deploy the project");       
}

function onclick_project_projectcompile(elt) {
    SelectCompileProject(solution.CurrentProject, 'C');
}

//---------------------------------------------------- CLOSE PROJECT ---------------------------------------------- 

function onclick_project_projectclose () {
    OnCloseProject (solution.CurrentProject, project_closeproject, solution.CurrentProject);
}

function SelectCloseProject () {
    OnCloseProject(solution.CurrentProject, OnCloseStrategy, project_closeproject, solution.CurrentProject);
}
//---------------------------------------------------- CREATE PROJECT ---------------------------------------------- 

function onclick_project_t_projectcreate () {
    openPopupNewProject(solution.ProjectFindName(), 'Create Project', "#newprojectname2");
}


function onclick_project_b_projectcreate (elt) {
    
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

    NewProject (projectname);
}

function NewProject (name) {

    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
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
    project_updateengines (project);
    solution.UpdateIndicators(project);         

    project_drawproject(project, true);
}

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 

function onclick_project_projectrename () {
    OnRenameProject (RenameProject, solution.CurrentProject);
}

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 


function RenameProject (project, newname) {
    if (!project) return;

    let cuser = solution.get('user')
        
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }


    if ($('#project_projectsbar .box-btn-slide').hasClass('rotate-180'))    
        $('#project_projectsbar #slide').click (); 


    var returnvalue = project.Rename (newname);
    if (returnvalue != -1) {

        sb.tree_renameitem('project_tree_projects', project.Name, newname);
        sb.select_renameitem('project_projectselect', project.Name, newname);        
        project.Folder = newname;
        project.Name = newname;
    }
}

//---------------------------------------------------- REMOVE PROJECT ---------------------------------------------- 

function onclick_project_projectremove() {
    OnRemoveProject (RemoveProject, solution.CurrentProject);
}

//---------------------------------------------------- REMOVE PROJECT ---------------------------------------------- 

function RemoveProject (project) {
    if (!project) return;

    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    if ($('#project_projectsbar .box-btn-slide').hasClass('rotate-180'))    
        $('#project_projectsbar #slide').click ();   

    var returnvalue = project.Remove ();
    if (returnvalue != -1) {

        sb.tree_removeitem('project_tree_projects', project.Name);
        sb.select_removeitem('project_projectselect', project.Name);

        if (project == solution.CurrentProject) 
            project_closeproject(project);    
    }
}


//--------------------------------------------------------------------------------------------------------------------------------------------

function project_gse_init () {
    CurrentContainer  = pg_gse_init('gsecanvas_strategy');
    CurrentCContainer = pg_gse_init('gsecanvas_condition');
}

var Menu_Conditions = [];
var Menu_Indicators = [];  // not initialized !
var Menu_Strategies = [];
var StrategyAssistantDescriptionQuill = null;

//-------------------------------------------------------------- PROJECT ACE EDITORS ------------------------------------------------------

var ProjectSignalEditor     = null;
var PropertiesEditor        = null;
var DescriptionEditor       = null;

var ErrorEditor             = null;
var ExpertEditor            = null;
var CommentEditor           = null;
var SCEditor                = null;
var CEditor                 = null;





function UpdateGSE(engine) {
    if (!engine) return;
    let PL = solution.PL;


    try {
        PL.ParseEngine(engine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);      
        return;      
    }    

    ResetActionButtons();

    for (var i = 0; i < engine.Actions.length; i++) {
        $('.strategy_assistant_actions [name=' +  engine.Actions[i] +']').removeClass ("noactivate")
    }

    CurrentContainer.SetRootNode(TreeFromSS(PL, CurrentContainer.GSE));
    CurrentContainer.Refresh();
   
}

function project_editors_init (id){
    ProjectSignalEditor  = new aceeditor('signaleditor_' + id, 'ace/theme/sc_on_dark', 'ace/mode/lisp');      
    ProjectSignalEditor.setOptions({
        fontFamily: "sans-serif",
        fontSize: 10,
        readOnly: true,
        showPrintMargin: false,
        showGutter: false,
        highlightActiveLine: false, 
        highlightGutterLine: false        
    });

    SCEditor             = new aceeditor('sceditor',       "ace/theme/sc_on_dark", "ace/mode/lisp");      
    SCEditor.currentSession.on("change", function (a) {
        if (a.action == "remove" && SCEditor.programchanged == 1) {
            SCEditor.programchanged = 0;
            return;
        }
        if (a.lines[0].startsWith ('project_selectstrategy')) {
            return;
        }
        SCEditor.programchanged = 0;
        let content = SCEditor.getValue();
        if (content !== CurrentEngine.SCContent) {
            CurrentEngine.SCContent = content;
            UpdateGSE(CurrentEngine);
        }
    });

    SCEditor.setOptions( {
        useSoftTabs: true,
        showPrintMargin: false
    });    
    SCEditor.addCommand({
        name: 'Ace_Save',
        bindKey: {
            win: 'Ctrl-S',
            mac: 'Command-S',
            sender: 'editor|cli'
        },
        exec: function (env, args, request)  {
            project_savestrategy(CurrentStrategy);
        }
        });
    SCEditor.addCommand({
        name: 'Ace_Shift',
        bindKey: {
            win: 'Shift-Tab',
            mac: 'Shift-Tab',
            sender: 'editor|cli'
        },
        exec: function (env, args, reques)  {
            if (solution.CurrentProject && CurrentStrategy) { 
                let tabs      = strategyfiletab.items;
                let ctabitem  = sb.tab_finditem(strategyfiletab, CurrentStrategy.Name);
                let ctabindex = tabs.indexOf(ctabitem);
                let ntabindex = ctabindex == strategyfiletab.items.length - 1 ? 0 : ctabindex + 1;
                project_selectstrategy (solution.CurrentProject.PG.GetStrategyFromName(strategyfiletab.items[ntabindex].id))                
            }
        }});

    CEditor              = new aceeditor('ceditor',          "ace/theme/sc_on_dark", "ace/mode/lisp"); 
    CEditor.setOptions( {
        useSoftTabs: true,
        showPrintMargin: false
    });        
    ExpertEditor         = new aceeditor('expert_comment',    "ace/theme/sc_on_dark", "ace/mode/lisp");
    ExpertEditor.setOptions({
        showPrintMargin: false,        
        readOnly: true,        
        showLineNumbers: false,
        showGutter: false,
        highlightActiveLine: false, 
        highlightGutterLine: false         
    });
    CommentEditor        = new aceeditor("strategy_comment",       "ace/theme/sc_on_dark", "ace/mode/lisp");
    CommentEditor.setOptions({
        showPrintMargin: false,        
        readOnly: true,        
        showLineNumbers: false,
        showGutter: false
    });    
    ErrorEditor          = new aceeditor("error_comment",    "ace/theme/nord_dark", "ace/mode/c_cpp"); 
    ErrorEditor.setOptions({
        showPrintMargin: false,        
        readOnly: true,        
        showLineNumbers: false,
        showGutter: false
    });

    PropertiesEditor     = new aceeditor("strategy_helper",  "ace/theme/nord_dark", "ace/mode/lisp");      
    PropertiesEditor.setOptions({
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: 11,
        readOnly: true,
        showPrintMargin: false,
        showGutter: false,
        useSoftTabs: false,
      
    });
}

function project_editors_update () {
    ProjectSignalEditor.setMode(); //highlights update
    SCEditor.setMode();
    CEditor.setMode();
    PropertiesEditor.setMode();
}

//---------------------------------------------------- PROJECT TOP PANEL  --------------------------------------------------------   

const MENU_STRATEGY_CLOSEALL_ID   = 1;
const MENU_STRATEGY_CLOSESAVED_ID = 2;
const MENU_STRATEGY_TABVIEW_ID    = 3;

function ReturnStrategyTabMenu () {
    var menu = [];

    menu.push({id: MENU_STRATEGY_CLOSEALL_ID,    text: "Close All",       tooltip: 'Close All files',        icon:'' });
    menu.push({id: MENU_STRATEGY_CLOSESAVED_ID,  text: "Close Saved",     tooltip: 'Close Saved Files',      icon: ''});
 //   menu.push({id: 0,     text: ""});
 //   menu.push({id: MENU_STRATEGY_TABVIEW_ID,     text: (projectplatform.strategyview == STRATEGY_SIDE_VIEW ? 'Enable Tab View' : 'Enable Side View'), tooltip: 'Switch Strategy View',         icon: ''});
    return menu;
}

function onclick_StrategyTabMenu (event) {
  
    var menu = ReturnStrategyTabMenu ();
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),     
        event: event,                    
        pageX: event.pageX,
        pageY: event.pageY,

        onselect: function (elt, par) {

            switch (parseInt(elt.id)) {
                case MENU_STRATEGY_CLOSEALL_ID :
                    CloseAllStrategies();
                break;
                case MENU_STRATEGY_CLOSESAVED_ID :
                    CloseSavedStrategies();
                break;
                case MENU_STRATEGY_TABVIEW_ID :
                    SwitchStrategyView();
                break;                
            }
        },        
        html: sb.menu (menu)
    });    	
}    

//------------------------------------------------------------ SC FILE PANEL ----------------------------------------------------------



function Strategy_GenerateCode (strategy, engine, type) {
    let beautifyoptions = {
        indent_size: 4,
        brace_style: 'collapse',
        max_preserve_newlines: -1
    };
    
    if (!strategy || !engine) return;
    
    var content= '';
    
    switch (type) {
        case SC_GENERATION:
            content = '';
        break;
        case C_GENERATION:
            content = GenerateCStrategy(strategy, engine);            
        break;
        case MQ4_GENERATION:
            content = GenerateMQ4Strategy(strategy, engine);            
        break;
        case JS_GENERATION:
            content = GenerateJSObjects(engine) + 
                      GenerateJSConditions(engine) + 
                      GenerateVariables(JS_GENERATION, GLOBAL_VARIABLE) + 
                      GenerateJSStrategy(strategy, engine);           
        break;            

    }
    content = js_beautify(content, beautifyoptions);
    CEditor.setValue(content, -1);    
    return content;
}


function Strategy_SetCode (strategy, content, type) {
    if (!strategy) return;


    switch (type) {
        case SC_GENERATION:
            content = '';
        break;
        case C_GENERATION:
            strategy.CContent = content;                
        break;
        case MQ4_GENERATION:
            strategy.MQ4Content = content;               
        break;
        case JS_GENERATION:
            strategy.JSContent = content;             
        break;            
    }    

}

function onclick_generatecode (elt, type) {
    var content = Strategy_GenerateCode (CurrentStrategy, CurrentEngine, type);
    Strategy_SetCode(CurrentStrategy, content, type);
}

function onclick_projecttabs(elt, event) {
    event.stopPropagation();
    switch (elt.id) {
        case 'tab-chart':
            Chart_Draw(solution.CurrentProject)
        break;
    }
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    BottomPanel_Flat (platform, false ,true);
} 

function ondblclick_projecttabs(elt, event) {
    event.stopPropagation();    
    
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    } 


    let dragelth    = $('#' + platform.id + ' .dragbar_h');   
    let bottomelt = dragelth[0].nextElementSibling; 
    
    if ($(bottomelt).find('.sb_tabcontainer .box-btn-fullscreen').css('display') != 'none') {
        BottomPanel_Expand (platform, true);
    } else 
    if ($(bottomelt).find('.sb_tabcontainer .box-btn-compressscreen').css('display')  != 'none') {
        BottomPanel_Expand (platform, false);
    } else {
        BottomPanel_Flat (platform, undefined, true);
    }
} 

function onclick_conditionCreate (elt) {
    if (!solution.CurrentProject) return;
    openPopupCondition();
}


//------------------------------------------------------------ STRATEGY BAR ----------------------------------------------------------

function onclick_strategyCreate() {
    OnNewStrategy(solution.CurrentProject, NewStrategy, StrategiesMenu[0]);
}     

function onclick_strategyRename () {
    var project = solution.CurrentProject;
    var strategy = project ? project.CurrentStrategy : null;

    OnRenameStrategy (project, RenameStrategy, strategy);
} 

function onclick_strategyDelete() {
    var project = solution.CurrentProject;
    var strategy = project ? project.CurrentStrategy : null;
    
    OnDeleteStrategy(project, DeleteStrategy, strategy);
}     

//---------------------------------------------------------   PROJECT MAIN PANEL    ------------------------------------------------------   

 function SCFilePanel (editorid, classnames) {
    var content = 
'   <div class="strategyscpanel ' + (classnames ? classnames : '') + '">' +    
        CodeEditorPanel(editorid, '', 'SC') +     
'   </div>'       
    return content; 
}


function CodeEditorPanel(id, classnames, type) {
    var content = '';
    if (type == 'SC') 
        content = '<div id="' + id + '" class=" ' + (classnames ? classnames : '') + '" ondragover="allowDrop(event)" ondrop="OnDrop_Ace(event, this)"></div>';
    else 
        content = '<div id="' + id + '" class=" ' + (classnames ? classnames : '') + '" ondrop="OnDrop_Ace(event, this)"></div>';
    return content;
}

//---------------------------------------------------------- PROJECT MENUS  --------------------------------------------------------   

var MENU_PROJECT_RENAME_ID  = 10;
var MENU_PROJECT_REMOVE_ID  = 11;


function ReturnProjectMenu () {
    var menu = [];
  
    menu.push({id: MENU_PROJECT_RENAME_ID,  text: "Rename",  tooltip: 'Rename Project',   icon: icon_rename});
    menu.push({id: MENU_PROJECT_REMOVE_ID,  text: "Delete",  tooltip: 'Delete Project',  icon: icon_remove});
    return menu;
}

const MENU_STRATEGY_RENAME_ID = 0;
const MENU_STRATEGY_REMOVE_ID = 1;
const MENU_STRATEGY_COPY_ID   = 2;
const MENU_STRATEGY_CUT_ID    = 3;
const MENU_STRATEGY_PASTE_ID  = 7;
const MENU_STRATEGY_EXPORT_ID = 5;



function ReturnStrategyMenu () {
    var menu = [];
  
    menu.push({id: MENU_STRATEGY_RENAME_ID, text: "Rename",   tooltip: 'Rename Strategy',              icon: icon_rename});
    menu.push({id: MENU_STRATEGY_REMOVE_ID, text: "Delete",   tooltip: 'Delete Strategy from Project', icon: icon_remove});
    menu.push({id: 0,   text: ""});
    menu.push({id: MENU_STRATEGY_COPY_ID,   text: "Copy",     tooltip: 'Copy Strategy',                icon: icon_copy});
    menu.push({id: MENU_STRATEGY_CUT_ID,    text: "Cut",      tooltip: 'Cut Strategy',                 icon: icon_cut});

    if (solution.StrategyClipBoard) 
        menu.push({id: MENU_STRATEGY_PASTE_ID,  text: "Paste",    tooltip: 'Paste Strategy',               icon: icon_paste});
    
    menu.push({id: 0,   text: ""});
    menu.push({id: MENU_STRATEGY_EXPORT_ID, text: "Export",   tooltip: 'Export Strategy to another Project', icon: icon_export});
    return menu;
}



//------------------------------------------------------------ PROJECT MAIN PANEL ----------------------------------------------------------
//---------------------------------------------------- DROP PROJECT ---------------------------------------------- 
function OnDrop_page_main (event) {             //layout_page_panel_main"
    
    event.preventDefault();
    var data = event.dataTransfer.getData("text");

    if (solution.get('ui').currentplatform_pname == TRADEDESK_PLATFORM_PNAME) {
    
        var terminal = solution.GetTerminalFromNameType(data, 'Terminal');
            tradedesk_selectterminal(terminal);
            return;
    }    

    if (solution.get('ui').currentplatform_pname == PROJECT_PLATFORM_PNAME) {
    
        var project = solution.project_GetProjectFromName(data);
        if (project) {
            OnCloseStrategy(project_selectproject, project);
            return;
        }
        if (!solution.CurrentProject)
            return;        
        
        var PG = solution.CurrentProject.PG;        

        var strategy = PG.GetStrategyFromName(data);
        if (strategy) {
            OnCloseStrategy(project_selectstrategy, strategy);
            return;
        }
        
        for (var i = 0; i < PG.Objects.length; i++) {
            if (PG.Objects[i].Name == data) {
                UpdateAssistantDependency (PG.Objects[i]);        
                break;
            }
        }       
        
    }    
//    ExecuteActionFromData (data);    
}


function ondrop_project_main(event) {
    event.preventDefault();
    event.stopPropagation();
    
    var data = event.dataTransfer.getData("text");

    var symbolcanvas = solution.GetCanvasFromTerminal(solution.CurrentProject);
    
    if (data.startsWith('project_selectstrategy')) {
        var strategyname = data.replace ('project_selectstrategy_', '');
        var strategy = symbolcanvas.PG.GetStrategyFromName(strategyname);
        project_selectstrategy(strategy);
        return;
    } else 
    if (data.startsWith('project_selectproject')) {
        var projectname = data.replace ('project_selectproject_', '');
        var project = solution.project_GetProjectFromName(projectname);
        project_selectproject(project);
    }        
    

/*

    var terminalid = event.toElement.id;
    var terminal = null;
    var terminalname, terminaltype;

    if (data.substring(5, 12) == 'project') {
        var project = solution.project_GetProjectFromName(data.substring(13));
        if (terminalid.substring(5, 13) == 'terminal') {
            if (terminalid.substring(14, 22) == 'Terminal') {
                terminalname = terminalid.substring(23);
                terminal = solution.GetTerminalFromNameType(terminalname, 'Terminal');
                DistributeProjectOnTerminal(project, terminal, 'Terminal');
                return;
            } else
            if (terminalid.substring(14, 20) == 'Tester') {
                terminalname = terminalid.substring(21);
                terminal = solution.GetTerminalFromNameType(terminalname, 'Tester');
                DistributeProjectOnTerminal(project, terminal, 'Tester');
                return;
            } else {
                terminalname = terminalid.substring(14);
                var terminals = solution.GetTerminalsFromName(terminalname);
                if (project && terminals) {
                    var menu = [];
                    menu.push({
                        id: 0,
                        text: "Terminal",
                        tooltip: 'Distribute on Terminal',
                        icon : icon_tradedesk
                    });
                    menu.push({
                        id: 1,
                        text: "Strategy Tester",
                        tooltip: 'Distribute on Strategy Tester',
                        icon: 'tester-icon'
                    });
                    $(this).w2menu({
                        items: menu,
                        onSelect: function (event) {
                            switch (event.item.text) {
                            case 'Terminal':
                                DistributeProjectOnTerminal(project, terminal, 'Terminal');
                                break;
                            case 'Strategy Tester':
                                DistributeProjectOnTerminal(project, terminal, 'Tester');
                                break;
                            }
                        },
                        pageX: event.pageX,
                        pageY: event.pageY,
                        width: 150
                    });
                }
            }
        }
    }
    */
}

//------------------------------------------------------------ PROJECT BOTTOM PANEL ----------------------------------------------------------

function onclick_slideindicatorbox (elt) {
    if (sb_box_closed ('boxindicatorspanel') && !sb_box_closed ('project_boxstrategiespanel')) {
        sb.box_toggle ('project_boxstrategiespanel', false);
    }
}

function ShowChart () {

    bottompanel_select (projectplatform,'tab-chart')        
    //sb.tab_select (project_bottomtabs, 'tab-chart');  
 
    //if ($('#project_mainbottompanel .box-btn-slide').hasClass('rotate-180')) {
    //    $('#project_mainbottompanel #slide').click ();    
    //}    
}  

//------------------------------------------------------------ STRATEGY FILE PANEL ----------------------------------------------------------


function onclick_strategyother (event) {
    bottompanel_select(projectplatform,  'tab-helper')
}


function OnClickSwitchLevel(elt, event) {
    var gsecanvas = $(elt).closest('.sbpanel').find('.canvas_GSE');    
    var container = platform_gse_container(gsecanvas.attr('id'));

    container.CloseFirstLevel(container.RootNode, null);
    container.Refresh();      
}


function OnClickActions(elt, event) {
}

//------------------------------------------------------------ TESTER PANEL ----------------------------------------------------------


//    $("#tester_initialbalance").val (CurrentStrategy.InitialBalance == "" ? "1000" : CurrentStrategy.InitialBalance);
//    $("#tester_timeframe").val (CurrentStrategy.TimeFrame == "" ? "ANY" : CurrentStrategy.TimeFrame);


function onchange_project_tester_initialbalance (elt) {
    AccountInitialBalance =    parseInt(elt.value);
    CurrentStrategy.InitialBalance = elt.value;
}


function onchange_project_tester_timeframe (elt) {
    CurrentStrategy.TimeFrame = elt.value;
  
   
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;                

    if (elt.value != 'ANY') {
        clearInterval(Interval_selectchart);
        Interval_selectchart = setInterval(SelectChart, 300, PeriodName.indexOf(elt.value));   
    }
}

function onchange_strategyselect(elt, event) {
    var strategyname= $("#projectstrategyselect option:selected").val();
    var strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyname);
    if (strategy == solution.CurrentProject.CurrentStrategy) return;

    project_selectstrategy(strategy);
}	

function onclick_project_tester_pausegroup(elt, event) {

    $('#project_tester_pause_panel .pause_group').addClass('sb_none')  
    $('#project_tester_pausesession_group_' + elt.id.slice(-1)).removeClass('sb_none');
}   

function onclick_project_tester_commandgroup(elt, event) {
    if (TestMode) {
        Engine_Pause(CurrentEngine, !PausedSimulator);
    } else {
        bottompanel_select (projectplatform,'tab-chart')    
       // sb.tab_select (project_bottomtabs, 'tab-chart');    
       // $('#tab-chart').click();

        ExpertEditor.setValue("");
        CommentEditor.setValue("");             
    
        AccountTotalProfit = 0;
        AccountProfit = 0;
        AccountTotalNbrLots = 0;
        AccountNbrLots = 0;
        AccountInitialBalance =  $("#tester_initialbalance").val ();
        
        Engine_Run(CurrentEngine);
    }
}

function onclick_project_tester_stop (elt) {
    Engine_Stop(CurrentEngine, true);
}


function onclick_projecttogglepanel(elt, event, panel) {
    let s_testerpanel = $(elt).closest('.sb_panel');

    if (s_testerpanel.hasClass('toggled')) {
        s_testerpanel.removeClass('toggled');
        sb.resize(panel);        
    }
    else {
        s_testerpanel.addClass('toggled');
        sb.resize(panel);        
    }   
}

function project_tester_fullscreenpanel (idpanel, sidepanel) {
    let panel = $('#' + idpanel);
    project_tester_toggle_all (0)    
    if (!panel.hasClass('toggled')) {
        panel.addClass('toggled')
        panel.find('.box-btn-slide').addClass('rotate-180')          
    }
    sb.resize(sidepanel); 
}


function onclick_projectfspanel (elt, event, panel) {
    let parentpanel        = $(elt.parentElement.parentElement.parentElement);
    project_tester_fullscreenpanel (parentpanel.attr('id'), panel);     
}

function onclick_projectcspanel (elt, event, panel) {
    
}

function project_tester_toggle_all (open) {
    let panel_array = [ $('#project_tester_expertpanel'),  $('#project_tester_strategypanel')]
    for (var i = 0; i < panel_array.length; i++) {
        let s_testerpanel = panel_array[i];
        if (open)  {
            s_testerpanel.addClass('toggled')
        } 
        else {
            s_testerpanel.removeClass('toggled'); 
            s_testerpanel.find('.box-btn-slide').removeClass('rotate-180')  
        }
    }
}

function TextEditorPanel(id, classnames) {
    var content = '<div id="' + id + '" class=" ' + (classnames ? classnames : '')  +  '" oncontextmenu="OnContextMenuEditor (event, this)"></div>';
    return content;
}


function ProjectSelectStrategyPanel_Update (engines) {
    var elt1 = document.getElementById('projectstrategyselect'); 
    elt1.innerHTML = ' <option value="' + '--Select Strategy--' + '">' + '--Select Strategy--' + '</option>';  
    for (var j = 0; j < engines.length; j++) {
        var engine = engines[j];
        elt1.insertAdjacentHTML('beforeend','<option value="' + engines[j].Name + '">' + engines[j].Name + '</option>');   
    }        
} 

function expertinputresize() {
    if (ExpertEditor) ExpertEditor.resize()
}

function strategyinputresize() { 
    if (CommentEditor) CommentEditor.resize()
}

function onclick_clean_comment_button (elt, event) {
    ExpertEditor.setValue('')
}


//---------------------------------------------------- SELECT PROJECT ---------------------------------------------- 

function project_updateengines (pararray) {
    let project = pararray[0];
    let PG = project.PG;     
    
    Menu_Strategies = [];
    for (var j = 0; j < PG.Engines.length; j++) {
        var engine = PG.Engines[j];
        Menu_Strategies.push({
            id:'strategy_' + engine.Name, 
            type: 'link', 
            item: engine.Name, 
            icon: icon_strategy, 
            attributes:{selector: 'project_selectstrategy', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
            events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}
        });
    }

    sb.tree_additems ('project_tree_strategies', Menu_Strategies);
    ProjectSelectStrategyPanel_Update (PG.Engines);
/*
    Sortable.create(project_tree_strategies, { 
        onEnd: function (evt) {
    		var itemEl = evt.item;
            var PG    = solution.GetPGFromTerminal ();
            var nbrstrategies =  PG.Strategies.length;
            movearray (PG.Strategies, evt.oldIndex + nbrstrategies, evt.newIndex + nbrstrategies);    	            
        }        
    });        
*/
}


function project_updateconditions (pararray) {
    let project = pararray[0];
    let PG = project.PG;     
    
    
    let GConditionMenu = [];

    Menu_Conditions = [{id: 0, text: '-----'}];

    for (var i = 0; i < PG.Conditions.length; i++) {
        var node_root = TreeFromSS(solution.PL, CurrentContainer.GSE, PG.Conditions[i].Section);
        
        PG.Conditions[i].SCContent = SSFromNode(PG, "", node_root, node_root, 0, false);
        
        Menu_Conditions.push({id: i + 1, text: PG.Conditions[i].Name});

        GConditionMenu.push({id:'condition_' + PG.Conditions[i].Name, type: 'link', item: PG.Conditions[i].Name, icon: icon_condition,
            attributes:{selector: 'selectcondition', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
            events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}    
        });
    }
    
    var TabToAdd = [];                    
    for (var i = 0; i < PG.Conditions.length; i++) {
        var recid = i + 1;
        elt = {recid: recid, condition:  PG.Conditions[i].Name, not: false,   description: PG.Conditions[i].SCContent}
        TabToAdd.push(elt);
    }
    
    sb.tree_additems ('project_tree_conditions', GConditionMenu);   
    $("#project_tree_conditions").addClass('show');    



    /*        tradedesk_MT4Com.
    Sortable.create(project_tree_conditions, { 
        onEnd: function (evt) {
    		var itemEl = evt.item; 
            var PG    = solution.GetPGFromTerminal ();
            movearray (PG.Conditions, evt.oldIndex, evt.newIndex);    		
	    }        
    });   
    */
}


function RefreshProjectName(project) {
    if (!project) {
        $('#projectname').val ('');        
    } else {
        $('#projectname').val (project.Name);        
    }
}



function project_updateexperts (project) {
    var PG = project.PG;    
    
    let items = [];
    let strategies = [];    
    
    sb.tree_removechildren ('project_tree_experts');
    
    for (var j = 0; j < PG.Experts.length; j++) {
       let strategyname = PG.Experts[j].substr(0,  PG.Experts[j].length - 4);
        if (strategies.includes (strategyname)) {
            continue;
        }
        
        items.push({
            id:'expert_' + strategyname, 
            type: 'tree', 
            item: strategyname, 
            icon: icon_folder, 
       //     style: !PG.GetStrategyFromName (strategyname) ? "color:red" : "",
        });
        strategies.push (strategyname);
    }
    sb.tree_additems ('project_tree_experts', items);   

    for (var j = 0; j < PG.Experts.length; j++) {
        let strategyname = PG.Experts[j].substr(0, PG.Experts[j].length - 4);
        sb.tree_additem( 'expert_' + strategyname, {id:'expert_' + PG.Experts[j], type: 'link', item: PG.Experts[j], icon: icon_file,
            attributes:{selector: 'selectexpert', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
            events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}                
        });        
    }
   
    $("#project_tree_experts").addClass('show');       

}    



function OnReloadProject(terminal, terminalname, terminaltype) {

    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    for (var i = 0; i < PG.Symbols.length; i++) {
        var sorder = "*RELOADPROJECT*" + PG.Symbols[i].Name + '*' + terminalname + '*' + terminaltype;
        tradedesk_MT4Com.Send(solution.get('user').id + sorder);
    }
}


//---------------------------------------------------- SAVE PROJECT ---------------------------------------------- 

function onclick_project_projectsave () {
    project_saveproject(solution.CurrentProject);
}

function SaveProjectConfirm (project) {
   
    sb.confirm_modal('Save Project ' + project.Name + ' ?').yes(function () {
        project_saveproject(project);
    }).no(function () {})
}

function SelectSaveProject (namecommand) {
    project_saveproject();   
}


//---------------------------------------------------- NEW PROJECT ---------------------------------------------- 

function OnClickProjectSelect (elt) {
    
    var selected_option = $('#projectselected option:selected');   
    var projectname = selected_option.text();
    
    var project = solution.project_GetProjectFromName(projectname);
    OnCloseStrategy(project_selectproject, project);
}

function ProjectPickerPanel (name) {
    var projectscontent = '';
    for (var j = 0; j < solution.Projects.length; j++) {
        var project = solution.Projects[j];
        projectscontent += '<option>' + project.Name + '</option>';
    }

    var content =    
'       <div class="sb_confirmation">'+    
'           <div class="sb_row" id="colprojectname">'+           	        	    
'               <div class="input-group mb-3">'+       
'                  <button  id = "projectcreator_createbutton" type="button" class="sb_buttonprepend sb_mbutton" onclick="onclick_project_b_projectcreate(this);window.speechSynthesis.cancel();">Create</button> ' +
'                  <input type="text" id="newprojectname2" name="' + name + '" class="required form-control error"  value="' + name + '" autocomplete="off" onkeypress="return CheckChar(event)">'+
'               </div>'+ 
'           </div>'+      
'           <div class="sb_row" id="colproject">'+   
'               <div class="input-group mb-3">'+       
'                  <button  id="projectcreator_selectbutton" class="sb_buttonprepend sb_mbutton" type="button" onclick="OnClickProjectSelect (this.value)" onmouseover= "$(\'#wrapper.toggled-2 #sidebar-wrapper\').css(\'width\', \'320px\');" onmouseout="$(\'#wrapper.toggled-2 #sidebar-wrapper\').css(\'width\', \'\');">Select</button> '+       
'                  <select class="form-control custom-select" id="projectselected" onclick=""  onchange="OnChangeProjectSelect (this)" data-toggle="tooltip" data-placement="right" title="Project Name needed">' + projectscontent + '</select>'+ 
'               </div>'+ 
'           </div>'+
'           <div class="labelexplain">' +
'               <p>To create customized Strategies, indicators, or conditions you will need to create a new workspace or open an existing one.<br>The creation of your customized workspace will enable you to run multiple strategies on the same chart.</p>' +
'           </div>' +
'       </div>'+
'   </div>';
    
    return content 
} 

function openPopupNewProject (name, funcname, focuslabel) {

    var functionname = (funcname ? funcname :  "Create Strategy");    
    sb.modal ({
        header: 'Create or Select Working Project', 
        id: 'createprojectmodal',
        resizable: true,
        onopen :  function () {focusAndCursor(focuslabel)},
        functionname: functionname,
        body: ProjectPickerPanel(name), 
        
        footer: '<button data-bs-dismiss="modal" class="sb_mbutton" onclick="no_callback()">Cancel</button>'
    })
}

function SelectNewProject(projectname) {
    OnCloseStrategy(NewProject, projectname);
}

//---------------------------------------------------- NEW STRATEGY ----------------------------------------------  


function OnNewStrategy(project, callafter, param) {
    if (!project) {
        openPopupNewProject(solution.ProjectFindName(), 'Create Project', "#newprojectname2");
    } else {
        NewStrategyConfirm(project, NewStrategy, param);
    } 
}

function NewStrategyConfirm(project, callafter, param) {

    var content = '<input  type="text" id="newstrategyname1" class="required form-control error" value="' + project.PG.StrategyFindName () + '" autocomplete="off" onkeypress="return CheckChar(event)">';
    sb.confirm_modal(content , "Create New Strategy",  function() {focusAndCursor("#newstrategyname1")},  true).yes(function () {
        var newname      = $('#newstrategyname1').val();
        var strategytype = param;
        var strategy = callafter(newname, strategytype);
        if (strategy) {
            $("#confirmmodal").modal('hide');
        }

    }).no(function () {})
}

function SelectNewStrategy(strategyname, strategytype) {
    if (solution.CurrentProject == null) {
        openPopupNewProject(solution.ProjectFindName(), 'Create Project', "#newprojectname");                        
        return;
    }    
    if (!strategytype)
        strategytype = StrategiesMenu[0];

    if (!strategyname)
        strategyname = solution.CurrentProject.PG.StrategyFindName (strategytype);
        
    OnCloseStrategy(NewStrategy, strategyname, strategytype);                
}

function NewStrategy(strategyname, strategytype) {
    if (solution.CurrentProject == null) {
        return null;
    }

    var strategy = solution.CurrentProject.NewStrategy(strategyname, strategytype);
    if (!strategy) return null;

    sb.tree_additems ('project_tree_strategies', [{id:'strategy_' + strategyname, type: 'link', item: strategyname, icon: icon_strategy,
                    attributes:{selector: 'project_selectstrategy', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}
                }]);    
    sb.select_additem ('projectstrategyselect', strategyname);  

    project_selectstrategy(strategy);

    return strategy;
}

//---------------------------------------------------- RENAME STRATEGY ------------------------------------------------  


function OnRenameStrategy(project, callafter, param) {

    if (!project) {
        openPopupNewProject(solution.ProjectFindName(), 'Create Project', "#newprojectname2");
    } else {
        RenameStrategyConfirm(callafter, param);
    } 
}

function RenameStrategyConfirm(callafter, param) {
    var strategy = param;
    if (!strategy) return;

    var content = '<input  type="text" id="renamestrategyname" class="required form-control error" value="' + strategy.Name + '" autocomplete="off" onkeypress="return CheckChar(event)">';
    sb.confirm_modal(content , "Rename Strategy",  function() {focusAndCursor("#renamestrategyname")},  true).yes(function () {
        var newname = $('#renamestrategyname').val();
        
        var strategy = callafter(param, newname);
        if (strategy) {
            $("#confirmmodal").modal('hide');
        }        

    }).no(function () {})
}


function RenameStrategy(strategy, newname) {

    sb.tree_renameitem('project_tree_strategies', strategy.Name, newname); 
    sb.select_renameitem ('projectstrategyselect', strategy.Name, newname);

    sb.tab_renameitem (strategyfiletab, strategy.Name, newname);    
    $("#strategy_assistant_name").val (newname);  
    $('#strategy_assistant_title span').html(newname)  

    strategy.Name = newname;
    strategy.pBEngine.Name = newname;
    strategy.pSEngine.Name = newname;

    return strategy;
}
//---------------------------------------------------- DELETE STRATEGY ------------------------------------------------  


function OnDeleteStrategy(project, callafter, param) {
    if (!project) {
        openPopupNewProject(solution.ProjectFindName(), 'Create Project', "#newprojectname2");
    } else {
        DeleteStrategyConfirm(callafter, param);
    } 
}   

function DeleteStrategyConfirm (callafter, param) {
    var strategy = param;
    if (!strategy) return;

    sb.confirm_modal('Are you sure to delete '   + strategy.Name + ' ?', 'Delete Current Strategy',  null, true).yes(function () {
        strategy = callafter(param);
        if (strategy) {
            $("#confirmmodal").modal('hide');
        }                

    }).no(function () {})
}

function DeleteStrategy(strategy) {

    if (!strategy) return null;
    
    sb.tree_removeitem ('project_tree_strategies', strategy.Name);
    sb.select_removeitem ('projectstrategyselect', strategy.Name);
    
    var tabindex = sb.tab_delete (strategyfiletab, strategy.Name);    
    if (tabindex < 0) {
        project_closestrategy (strategy);
    } else {
        project_selectstrategy(solution.CurrentProject.PG.GetStrategyFromName (strategyfiletab.items[tabindex].item))
    }
    
    for (var i = solution.CurrentProject.PG.Engines.length; i--;) {
        if (solution.CurrentProject.PG.Engines[i] === strategy.pBEngine || solution.CurrentProject.PG.Engines[i] === strategy.pSEngine) {
            solution.CurrentProject.PG.Engines.splice(i, 1);
        }
    }
    for (var i = solution.CurrentProject.PG.Strategies.length; i--;) {
        if (solution.CurrentProject.PG.Strategies[i] == strategy) {
            solution.CurrentProject.PG.Strategies.splice(i, 1);
        }
    }
    return strategy;
}

//---------------------------------------------------- CLOSE STRATEGY ------------------------------------------------  

function SaveStrategyConfirm(strategy, callafter, param, param1) {

    sb.confirm_modal('Save Strategy ' + strategy.Name + ' ?', "Confirmation", null, true).yes(function () {
        OnSaveStrategy();
        callafter(param, param1);

    }).no(function () {
        OnCancelStrategy();
        callafter(param, param1);
    })
}

function OnClickCloseStrategy() {
    var project = solution.CurrentProject;
    var strategy = project ? project.CurrentStrategy : null;
    
    OnCloseStrategy(project_closestrategy, strategy);
}     


function OnCloseStrategy(callafter, param, param1) {

    var strategy = param;
    if (!strategy) return;

    if (strategy.ShouldSave) {
        SaveStrategyConfirm(callafter, strategy);
    } else {
        callafter(strategy, param1);
    }
}   


function SelectCloseStrategy() {
    OnCloseStrategy(project_closestrategy);
}
//---------------------------------------------------- SAVE STRATEGY ------------------------------------------------  

function SelectSaveStrategy() {
    OnSaveStrategy();
}

function OnSaveStrategy(event) {

    if (solution.get('user').id == "0") {
        TreatInfo("Strategy can not be saved, You are not registered");
        return;
    }

    if (CurrentStrategy) {

        var new_strategyname = document.getElementById('strategyname').value;

        if (new_strategyname == "") {
            TreatInfo("Strategy Name can not be empty " + new_strategyname);    
            $('#strategyname').focus();
            return;
        }

        if (CurrentStrategy.Created) {

            var strategy = solution.CurrentProject.PG.GetStrategyFromName(new_strategyname, CurrentStrategy);
            if (strategy) {
                TreatInfo("Strategy Name already exists " + new_strategyname);    
                $('#strategyname').focus();
                return;
            }

            CurrentEngine.Name   = new_strategyname;
            CurrentStrategy.Name = new_strategyname;        

            sb.tree_additems ('project_tree_strategies', [{id:'strategy_' + CurrentStrategy.Name, type: 'link', item: CurrentStrategy.Name, icon: icon_strategy,
                        attributes:{selector: 'project_selectstrategy', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
                        events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}            
                    }]);
            sb.tree_selectitem ('project_tree_strategies', CurrentStrategy.Name); 
            Menu_Strategies.push(item);

        }
        else {
            if (CurrentStrategy.Name != new_strategyname) {
                sb_tree_renameitem ('project_tree_strategies', CurrentStrategy.Name, new_strategyname);

                CurrentEngine.Name   = new_strategyname;
                CurrentStrategy.Name = new_strategyname;        
            }
        }
        TreatInfo("Saving Strategy " + new_strategyname, true, 'operationpanel', 'var(--bg-strategycreator)');    
    
        w2ui['strategyschedules'].save();
        w2ui['strategyproperty'].save();
        w2ui['strategyactions'].save();
    } else {
         TreatInfo("Saving Project " + solution.CurrentProject.Name);    
    }        
    setTimeout(project_savestrategy, 300, CurrentStrategy);        

}



//---------------------------------------------------- SELECT STRATEGY ------------------------------------------------  

function _StrategySelect (project, strategyname) {
    if (project.Loaded) {
        clearInterval(Interval_selectstrategy);
        var strategy = project.PG.GetStrategyFromName(strategyname);        
        if (!strategy) return;
        project_selectstrategy (strategy);
    }    
}

function _GoToStrategy (project, strategyname) {
    project_selectproject (project);
    clearInterval(Interval_selectstrategy);
    Interval_selectstrategy = setInterval(_StrategySelect, 300, project, strategyname); //5 minutes 300000	      
    

}

function GoToStrategy(elt) {
    let ui  = solution.get('ui')     
    ui.platform_select(PROJECT_PLATFORM_PNAME)   
   
    
    var project = solution.project_GetProjectFromName(solution.CurrentTerminal.PG.ProjectName);
    if (project) {
        OnCloseStrategy(_GoToStrategy, project, $(elt).html());
    }
}


function ParseEngine(engine) {
    let PL = solution.PL;

    try {
        PL.ParseEngine(engine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);   
        return;         
    }    

    CurrentContainer.SetRootNode(TreeFromSS(PL, CurrentContainer.GSE));
    SCEditor.setValue(engine.SCContent, -1);

    //UpdateRules(engine);    

    return 0;
}

function onclick_project_tab(elt, event) {

}


function onclick_StrategyTabItem (elt) {
    var strategy = solution.CurrentProject.PG.GetStrategyFromName ($(elt)[0].innerText);
    project_selectstrategy (strategy);
}

function onclick_StrategyCloseTabItem (elt, event) {
    event.stopPropagation ();      
    let strategyname    = $(elt).parent()[0].id;
    let tabindex = sb.tab_delete (strategyfiletab, strategyname)

    if (!solution.CurrentProject) { // project is closed must be home page that is deleted
        return;
    } 

    let strategy        = solution.CurrentProject.PG.GetStrategyFromName (strategyname);
    
    if (tabindex < 0) {
        project_closestrategy (strategy);
    } else {
        strategyname = strategyfiletab.items[tabindex].item;
        strategy = solution.CurrentProject.PG.GetStrategyFromName (strategyname);
        project_selectstrategy(strategy)
    }
}



function DrawStrategy(strategy, open) {

    if (open) {
 
        $("#projectstrategyselect option[value='--Select Strategy--']").remove();   
        $('#projectstrategyselect option[value="' + strategy.Name + '"]').prop('selected', true); 
        $('#project_tester_play_button').removeAttr('disabled') 

        sb.tree_selectitem ('project_tree_strategies', strategy.Name);                              
      
      //  TreatInfo("Strategy : " + strategy.Name );          
      
        AssistantGoToStep ('strategy_assistant_panel', Math.max ($("#strategy_assistant_panel").steps("getCurrentIndex"),STEP_STRATEGYNAME));

    } else {
        
        sb.tree_selectitem ('project_tree_strategies', '');         
        $("#projectstrategyselect option").eq(0).before($('<option>', {value: '--Select Strategy--', text: '--Select Strategy--'}));
        $("#projectstrategyselect option[value='--Select Strategy--']").prop('selected', true);
        $('#project_tester_stop_button').attr('disabled',true);    
        $('#project_tester_play_button').attr('disabled',true);           

        TreatInfo("" ); 

        StrategyAssistantFillStrategies(solution.CurrentProject);
        AssistantGoToStep ('strategy_assistant_panel', STEP_PROJECTSELECTION);
    }    
}




//---------------------------------------------------- CANCEL STRATEGY ------------------------------------------------  

function CancelGridChanges(grid) {
    var changes = grid.getChanges();
    for (var c = 0; c < changes.length; c++) {
        var record = grid.get(changes[c].recid);
        if (record.w2ui) delete record.w2ui.changes;
    }
}

function OnCancelStrategy(event) {
    CancelGridChanges(w2ui['strategyschedules']);
    CancelGridChanges(w2ui['strategyproperty']);
    CancelGridChanges(w2ui['strategyactions']);
    CancelStrategy();
}

function CancelStrategy() {
    if (!CurrentStrategy)
        return;
    
    CurrentEngine = CurrentStrategy.pBEngine.Clone();
    
    ParseEngine(CurrentEngine);
    
    CurrentStrategy.CContent = CurrentStrategy.Code[CODE_CPP];

    RefreshStrategy(CurrentStrategy);
}


//-----------------------------------------------------------------------------------------------------------------------  

function ProjectSelectPeriod (terminal, Symbol, Period, async) {
    if (!Symbol) return;

    if (async == undefined)
        async = true;    

    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
    if (!symbolcanvas) return;      
    var rootid = rootid_fromcanvas(symbolcanvas.ID);

    
    if (symbolcanvas.CurrentPeriod != null && symbolcanvas.CurrentPeriod != Period) {
        Symbol.xextents[Period] = null;
    }        
    //sb.group_select('#' + rootid + ' .chartpanel  #' + Period);     

    symbolcanvas.CurrentPeriod = Period;
    GChartPanel_UpdatePeriod (symbolcanvas, symbolcanvas.CurrentPeriod);
    

    if (!Symbol.WaitHistory[Period] && 
        Symbol.chartData[Period].length == 0) {
        OnGetHistory(terminal, Symbol, Period, Symbol.NbrCandles[Period], Symbol.NbrCandles[Period] + CANDLES_TOLOAD, async);
    } else {
        if (TestMode) {
            Symbol.xextents[symbolcanvas.CurrentPeriod] = null;
            return;
        }
        Chart_Draw(terminal)   
    }    
}

function SelectChart (period) {

    clearInterval(Interval_selectchart);

 //  if (!solution.CurrentProject) 
 //      return;
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      


    if (period == undefined) {
        period = symbolcanvas.CurrentPeriod;
        if (period == null) {
            period = P_H1;
        }
    }
    //console.log ('select chart')
    var Symbol = symbolcanvas.CurrentSymbol;

    if (!Symbol) {
        let symbolname = "EURUSD";
        Symbol = new pgsymbol(symbolname); //   (name, port, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize)
        Symbol.Set(symbolname, symbolname, 0, "0.01", "100", "0.2", "1", 5, 0.00001, 0, 6); //   (name, port, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize)
        symbolcanvas.CurrentSymbol = Symbol;
        solution.GetPGFromTerminal ().Symbols.push(Symbol);
        Symbol.Last = '';
    }
    ProjectSelectPeriod (solution.CurrentProject, Symbol, period, true);
    ChartPanel_Update (symbolcanvas);
    PriceGroup_Update (symbolcanvas, Symbol);   

}

//--------------------------------------------------------------- STRATEGY PARSE ERROR ------------------------------------------------------------------------------



function TracePropertiesEditor(value) {
    PropertiesEditor.setValue(value, -1);
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------

