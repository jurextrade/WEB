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
  // console.log ('project assitant init')
  //project_assistant_init ();
    project_assistant_select (projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW); 
  //console.log ('project init')
    
    DistributePanel_Update();    
    setInterval(project_timer, 300);         

}

function project_end () {

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
    
    DrawChart();

    if (!solution.CurrentProject) {
        onclick_sidebarmenu ('sidebar_files', true);    

        $('#newprojectname').focus();           
        if (!projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW) {
            AnimationDisplay ('project_mainpanel', 'Select or Create a Project to Start');      
        } else {
        }
        DisplayOperation("Select a project or create one", true, 'operationpanel', 'var(--bg-strategycreator)');
    }
}

function project_solution (pname) {

    let  site           = solution.get('site');
    let  user           = solution.get('user')

    solution.Projects       = [];
    solution.CurrentProject = null;

    if (site.protocol == 'http:') { //PROJECT=2
        solution.DeployServer_Address   = site.hostname;   
        solution.DeployServer_Port     =  2080;     
    }
    else {
        solution.DeployServer_Address   = site.hostname;
        solution.DeployServer_Port     =  2443;    
    }

    if (!solution.DefaultLoaded) {
        pg_solution ()
        solution.LoadPGDefault (pname);   
        solution.DefaultLoaded = true;            
    } else {   
        solution.UpdatePredefinedIndicators (pname);
    }

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
    solution.project_LoadProjects = function (Id, url, async, interfacecallback, par) {
        let param = {
            user_id :  (Id == "0" ? "1" : Id),
            platform_pname: PROJECT_PLATFORM_PNAME,
            platform_folder : 'Projects'             
        }

        let callback = function (responsetext, values) {
            let arraystructure =  JSON.parse(responsetext);
            for (var i = 0; i < arraystructure.length; i++) {
                let projectstruct = arraystructure[i];

                if (!projectstruct.Name || !projectstruct.Path) continue;
                if (this.userid == '0' && projectstruct.Name != "Demo_Project") continue;                    
                let project = new pgproject(PROJECT_PLATFORM_PNAME, projectstruct.Name, projectstruct.Path)

                project =  {...project, ...projectstruct}

                solution.Projects.push(project);
            }   
        }
        url_submit ('POST', url, param /*object {}*/, async, callback, [] , interfacecallback, par);
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
    solution.project_LoadProjects(user.id, site.address + "/php/read_projects.php",  SYNCHRONE, solution.project_UpdateProjects, solution);
}

function project_timer () {
    var shouldDisable = true;
   
    
    if (solution.CurrentProject) {        
//project
        $('#project_projectsbar #project_projectrename').css ('display', '');
        $('#project_projectsbar #project_projectremove').css ('display', '');
        $('#project_projectsbar #project_projectcompile').css ('display', '');
        $('#project_projectsbar #project_projectdistribute').css ('display', '');
        $('#project_projectsbar #project_projectclose').css ('display', '');
            

//strategy
        $('#project_strategiesbar #project_strategycreate').css ('display', '');

        if (CurrentStrategy) {
         //   $('#strategyfiletab').css ('display', '');
            $('#project_strategiesbar #project_strategyrename').css ('display', '');
            $('#project_strategiesbar #project_strategyremove').css ('display', '');
            $('#testerbar').css ('display', '');            
            $('#assistantbar *').css ('display', '');
            $('#project_strategycompile').css ('display', ''); 
            
        }    
        else {
       //     $('#strategyfiletab').css ('display', 'none'); 
            $('#project_strategiesbar #project_strategyrename').css ('display', 'none');
            $('#project_strategiesbar #project_strategyremove').css ('display', 'none');    
            $('#overlay_strategyhelper').remove();        
            $('#testerbar').css ('display', 'none');        
            $('#assistantbar *').css ('display', 'none'); 
            $('#project_strategycompile').css ('display', 'none');               
        }
 
        $('#project_conditionsbar #conditionCreate').css ('display', '');       
        
        $("#distributepanel").css ('display', '');            
        $("#projectselectstrategypanel").css ('display', '');  

        $('#project_root #indicatorCreate').css ('display', '');              
                 
/*        
/*
        $("#SaveStrategy .w2ui-tb-caption").prop( "disabled", shouldDisable);
        $("#CancelStrategy .w2ui-tb-caption").prop( "disabled", shouldDisable);

        if (document.getElementById('strategyname') && document.getElementById('strategyname').value != CurrentStrategy.Name) {
            shouldDisable = false;
        }
        if (CurrentEngine.SCContent != CurrentEngine.Code[CODE_SS]) shouldDisable = false;
        if (projectplatform.strategyquillbuffer != CurrentStrategy.Description)     shouldDisable = false;;

        if (shouldDisable) {
      //      if (w2ui['strategyactions'].getChanges().length > 0 || w2ui['strategyschedules'].getChanges().length > 0 || w2ui['strategyproperty'].getChanges().length > 0) 
      //          shouldDisable = false;
        }
        CurrentStrategy.ShouldSave = !shouldDisable;        
*/        
    }
    else {

 
//project
        $('#project_projectsbar #project_projectrename').css ('display', 'none');
        $('#project_projectsbar #project_projectremove').css ('display', 'none');
        $('#project_projectsbar #project_projectcompile').css ('display', 'none');
        $('#project_projectsbar #project_projectdistribute').css ('display', 'none');
        $('#project_projectsbar #project_projectclose').css ('display', 'none');
             

//strategy
//        $('#strategyfiletab').css ('display', 'none');
        $('#project_strategiesbar #' + 'project_strategycreate').css ('display', 'none');        
        $('#project_strategiesbar #' + 'project_strategyrename').css ('display', 'none');
        $('#project_strategiesbar #' + 'project_strategyremove').css ('display', 'none');  

        $('#testerbar').css ('display', 'none');            
        $('#assistantbar *').css ('display', 'none');
        $('#project_strategycompile').css ('display', 'none'); 

        $('#project_conditionsbar #' + 'conditionCreate').css ('display', 'none');    
        $('#overlay_strategyhelper').remove();     
        
        $("#distributepanel").css ('display', 'none');          
        $("#projectselectstrategypanel").css ('display', 'none');  
        
        $('#project_root #indicatorCreate').css ('display', 'none');            
    }
}

function project_loadedproject (project) {
    if (project.Loaded) {
        clearInterval(Interval_loadproject);
        DisplayOperation("Project " + project.Name + " loaded", true, 'operationpanel');            
        LoaderDisplay(false);         
        project_drawproject(project, true);        
    }
}

function project_selectproject(project, forcedisplay) {
  
    if (!project) {
        return;
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
        DisplayOperation("Loading Project " + project.Name + "  ... Please wait", true, 'operationpanel',  'var(--bg-strategycreator)');

        Interval_loadproject = setInterval(project_loadedproject, 300, project); //5 minutes 300000     
        project.Load();
    }
    else {
        UpdateProjectEngines (project);
        solution.UpdateIndicators(project);
        solution.UpdateSchedules (project);        
        UpdateProjectExperts(project);
        UpdateProjectConditions(project);   

        DisplayOperation("Project " + project.Name + " loaded", true, 'operationpanel');            
        project_drawproject(project, true);        
    }
}

function project_closeproject(project) {
    if (!project) {
        return;
    }
    
    if (project.ShouldSave) {
        SaveProjectConfirm(project);
    } else {
  
        CloseStrategy (); 
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

    sb.tree_removechildren ('tree_createdindicators');
    sb.tree_removechildren ('project_tree_conditions');
    sb.tree_removechildren ('project_tree_experts');
    sb.tree_removechildren ('project_tree_strategies');
    sb.tab_clear (strategyfiletab);      
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
//        AnimationDisplay ('project_mainpanel', 'Select a strategy or create one');    
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

        AnimationDisplay('project_mainpanel', 'Goodbye');             
    }    
}

function onchange_project_projectselect (elt, event) {
    let projectname= $('#' + elt.id + ' option:selected').val();
    let project = solution.project_GetProjectFromName(projectname);
    if (project == solution.CurrentProject) return;
    project_selectproject(project);
}



//------------------------------------------------------------ PROJECT FILE BAR ----------------------------------------------------------

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
        TreatOperation('As you are not registered the project will not be saved', 'operationpanel');  
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

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 

function onclick_project_projectrename () {
    OnRenameProject (RenameProject, solution.CurrentProject);
}

//---------------------------------------------------- RENAME PROJECT ---------------------------------------------- 


function RenameProject (project, newname) {
    if (!project) return;

    let cuser = solution.get('user')
        
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
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
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
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


//---------------------------------------------------- DISTRIBUTE PROJECT ---------------------------------------------- 

function onclick_project_projectdistribute () {
}

//---------------------------------------------------- DISTRIBUTE PROJECT ---------------------------------------------- 

function SelectDistribute () {
   
}

function DistributeProject (project, terminal) {
    if (!terminal || !project)
        return;

    BottomPanel_Flat (projectplatform, false);         
    sb.tab_select(project_bottomtabs, 'tab-error');       
    
    DistributeProjectOnTerminal(project, terminal);
}

function DistributeProjectOnTerminal(project, terminal) {
   
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START DISTRIBUTION " + project.Name + " ON " + terminal.Name + " " +  terminal.Type, 1);
    TraceErrorEditor("-----------------------------------------------------------", 1);
    
    DisplayOperation("Start Distribution " + project.Name + " ON " + terminal.Name + ' ' + terminal.Type, true, 'operationpanel',  'var(--bg-strategycreator)');
    
    
    project.Distribute(terminal.Folder, terminal.Type);
    
    
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> FINISH DISTRIBUTION " + project.Name + (returnvalue.length != 0 ? " with Error " : " OK ") +  " ON " + terminal.Name + ' ' + terminal.Type, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    
    DisplayOperation("Finish Distribution" + project.Name + " ON " + terminal.Name + ' ' + terminal.Type, true, 'operationpanel', 'var(--bg-strategycreator)');
    
    if (returnvalue.length != 0)
        return;
        
        
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START RELOADING PROJECT " + project.Name + " ON " + terminal.Name + ' ' + terminal.Type, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    
    DisplayOperation("Reloading Project " + project.Name + " on " + terminal.Name + ' ' + terminal.Type, true, 'operationpanel',  'var(--bg-strategycreator)');
    
    OnReloadProject(terminal, terminal.Name, terminal.Type);
    
    
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> FINISH RELOADING PROJECT " + project.Name + " ON " + terminal.Name + ' ' + terminal.Type + " OK -----------------", 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    
    DisplayOperation("Finish Reloading Project " + project.Name + " on " + terminal.Name + ' ' + terminal.Type , true, 'operationpanel',  'var(--bg-strategycreator)');
    
    
    
    var terminal = solution.GetTerminalFromNameType(terminal.Name, terminal.Type);
    terminal.Loaded = 0;
    if (terminal == solution.CurrentTerminal) {
        tradedesk_selectterminal(terminal, true);
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


function SaveEditor(env, args, request) {
    OnSaveStrategy();
}

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
        name: 'saveFile',
        bindKey: {
            win: 'Ctrl-S',
            mac: 'Command-S',
            sender: 'editor|cli'
        },
        exec: SaveEditor
        });


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

    PropertiesEditor     = new aceeditor("propertiesdescription",  "ace/theme/nord_dark", "ace/mode/lisp");      
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
    menu.push({id: 0,     text: ""});
    menu.push({id: MENU_STRATEGY_TABVIEW_ID,     text: (projectplatform.strategyview == STRATEGY_SIDE_VIEW ? 'Enable Tab View' : 'Enable Side View'), tooltip: 'Switch Strategy View',         icon: ''});
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

//------------------------------------------------------------ CONDITION BAR ----------------------------------------------------------

function DownloadExpertConfirm (callafter, expertfile) {

    sb.confirm_modal('Download Expert Advisor ' + expertfile + ' ?').yes(function () {
        callafter (expertfile);
        $("#confirmmodal").modal('hide');        

    }).no(function () {})
}

function onclick_conditionCreate (elt) {
    if (!solution.CurrentProject) return;
    openPopupCondition();
}

function OnDownloadExpert (callafter, expertfile) {
    DownloadExpertConfirm (callafter, expertfile);
}


function onclick_expertDownload (elt) {
    var expertfile = object.children[1].innerHTML;    

    OnDownloadExpert (DownloadStrategy, expertfile)
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




//------------------------------------------------------------ DISTRIBUTE SIDEBAR PANELS ----------------------------------------------------------
      
function DeployHeaderPanel () {
    var content =     
    '<span class="togglesidebar ' + icon_toggle + '" onclick="OnToggle(PROJECT_ID, this);"></span>' +     
    '<div class="sb_sidebarheader sb_bar">' +
            '<div class="sb_sidebarheadertitle">DEPLOY PROJECT</div>' +
             
            '<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>' +
    '</div>';
    return content;
}

function onclick_distribute (elt) {
    let j = 0;
    let terminalchecked;      
    let strategytesterchecked;    
    let strategyname;
    for (var i = 0; i < distributetable.rows.length; i = i + 2) {
        terminalchecked         = $('#terminalcheck' + j).is(":checked");    
        strategytesterchecked   = $('#strategytestercheck'+ j).is(":checked");   
        terminalname            = $('#terminalname'+ j).html();

        if (terminalchecked)        DistributeProject(solution.CurrentProject, solution.GetTerminalFromNameType(terminalname, 'Terminal'));            
        if (strategytesterchecked)  DistributeProject(solution.CurrentProject, solution.GetTerminalFromNameType(terminalname, 'Tester')); 
        j++;
    }        
    
}

function DistributePanel (id, classnames) {

    let content = 
'   <div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 

'       <div id="distributetable" class="">'+       		            
'               <table class="sb_table table" >' +
'                   <thead>' +
'                       <tr>' +
'                           <th title="" style="">Terminal</th>' +
'                           <th title="" style="text-align: center;">Platform</th>' +
'                           <th title="" style="text-align: center;">Strategy Tester</th>' +
'                       </tr>' +
'                   </thead>' +
'                   <tbody>' +
'                   </tbody>' +
'               </table>' + 
'       </div>'+

'       <button id="distributeselect" class="sb_button"  type="button" onclick="onclick_distribute (this)">Distribute</button>' +

'       <div class="labelexplain">' +
'           <p>WARNING : If an Existing Project is already running on the terminal, it will close all existing orders and it will start a new session with this project. Assure You stopped all your strategies before.</p>' +
'       </div>' +

'   </div>';
    return content
}

function DistributePanel_Update () {
    var tcontent = '';
    var j = 0;    
    distributetable.rows = [];

    let terminals = solution.GetTerminalsFromType('Terminal')

    if (terminals.length == 0) {
        $('#deploypanel').html(sb.render(ReturnWarningALert('MT4 Terminal interface is not active')))
        return ;
    }

    for (var i = 0; i < terminals.length; i++) {
        let terminal = terminals[i];
        distributetable.rows.push ([
                '<i class="fas fa-landmark"></i><span id="terminalname' + j + '" class="terminalname" >' +  terminal.Name + '</span>',
                '<div class="sb_check custom-control custom-checkbox terminalcheck">' + 
                '   <input id="terminalcheck' + j + '" class="custom-control-input" type="checkbox"/>' + 
                '   <label for="terminalcheck' + j + '" class="custom-control-label"></label>' +                        
                '</div>',
                '<div class="sb_check custom-control custom-checkbox terminalcheck">' + 
                '   <input id="strategytestercheck' + j + '" class="custom-control-input " type="checkbox"/>' + 
                '   <label for="strategytestercheck' + j + '" class="custom-control-label"></label>' +                        
                '</div>'                
        ])
    }
    sb.table_setrows (distributetable, distributetable.rows)
}


function DeployPanel (id, classnames) {
    var content     = '';
    content += DeployHeaderPanel() +

'   <div  id="' + id + '" class="' + (classnames ? classnames : '')  + '">' + 
        DistributePanel ('distributepanel', 'sb_column sb_bargroup sb_formcontainer') + 
'   </div>' ;   
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
            OnCloseStrategy(SelectStrategy, strategy);
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

    var symbolcanvas = solution.CurrentProject.PG.Canvas;
    
    if (data.startsWith('project_selectstrategy')) {
        var strategyname = data.replace ('project_selectstrategy_', '');
        var strategy = symbolcanvas.PG.GetStrategyFromName(strategyname);
        SelectStrategy(strategy);
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
    sb.tab_select (project_bottomtabs, 'tab-chart');  
    if ($('#project_mainbottompanel .box-btn-slide').hasClass('rotate-180')) {
        $('#project_mainbottompanel #slide').click ();    
    }    
}  

//------------------------------------------------------------ STRATEGY FILE PANEL ----------------------------------------------------------


function onclick_strategyother (event) {
    var display = $('#projectpanel_other').css ('display');
    switch (display) {
        case 'none' :
            $('#projectpanel_other').css ('display', 'flex');
        break;
        default :
            $('#projectpanel_other').css ('display', 'none');
        break;
    }
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

function onchange_strategyselect(elt, event) {
    var strategyname= $("#projectstrategyselect option:selected").val();
    var strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyname);
    if (strategy == solution.CurrentProject.CurrentStrategy) return;
    SelectStrategy(strategy);
}	

function onclick_tester (elt) {
    if (TestMode) {
        Engine_Pause(CurrentEngine, !PausedSimulator);
    } else {
        
        sb.tab_select (project_bottomtabs, 'tab-chart');    
        $('#tab-chart').click();
        ExpertEditor.setValue("");
        CommentEditor.setValue("");             

        Engine_Run(CurrentEngine);
    }
}

function onclick_stoptester (elt) {
    Engine_Stop(CurrentEngine, true);
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

//---------------------------------------------------- SELECT PROJECT ---------------------------------------------- 

function GoToProject(elt) {
    let ui  = solution.get('ui')     
    ui.platform_select(PROJECT_PLATFORM_PNAME)   
   
    
    var project = solution.project_GetProjectFromName($(elt).val());
    if (project) {
        OnCloseStrategy(project_selectproject, project);
    }
}

function RefreshProjectName(project) {
    if (!project) {
        $('#projectname').val ('');        
    } else {
        $('#projectname').val (project.Name);        
    }
}

function UpdateProjectEngines (project) {
    var PG = project.PG;     
    
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
        sb.select_additem ('projectstrategyselect', engine.Name);           
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

function UpdateProjectExperts (project) {
    var PG = project.PG;    
    
    let items = [];
    for (var j = 0; j < PG.Experts.length; j++) {
        items.push({id:'expert_' + PG.Experts[j], type: 'link', item: PG.Experts[j], icon: icon_mt4expert,
            attributes:{selector: 'selectexpert', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
            events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}                
        });        
    }

    sb.tree_additems ('project_tree_experts', items);   
    $("#project_tree_experts").addClass('show');       

}    

function UpdateProjectConditions (project) {
    var PG = project.PG;     
    
    
   var GConditionMenu = [];

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
/*
    Sortable.create(project_tree_conditions, { 
        onEnd: function (evt) {
    		var itemEl = evt.item; 
            var PG    = solution.GetPGFromTerminal ();
            movearray (PG.Conditions, evt.oldIndex, evt.newIndex);    		
	    }        
    });   
    */
}


function OnReloadProject(terminal, terminalname, terminaltype) {

    var terminal = solution.GetTerminalFromNameType(terminalname, terminaltype);
    var PG = terminal.PG;
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    for (var i = 0; i < PG.Symbols.length; i++) {
        var sorder = "*RELOADPROJECT*" + PG.Symbols[i].Name + '*' + terminalname + '*' + terminaltype;
        terminal.Com.Send(solution.UserId + sorder);
    }
}


//---------------------------------------------------- SAVE PROJECT ---------------------------------------------- 

function SaveProjectConfirm (project) {
   
    sb.confirm_modal('Save Project ' + project.Name + ' ?').yes(function () {
        SaveProject(project);
    }).no(function () {})
}


function SelectSaveProject (namecommand) {
    SaveProject();   
}


function SaveProject(project) {
    if (!project) return;
    if (solution.UserId == "0") {
        DisplayOperation("Project can not be saved, You are not registered", true, 'operationpanel', "coral");
        return;
    }
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START SAVING " + project.Name, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    DisplayOperation("Saving Project " + project.Name + "", true, 'operationpanel');            
    project.Save();
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> FINISH SAVING " + project.Name, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    DisplayOperation("Project " + project.Name + " Saved ", true, 'operationpanel');            
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

    SelectStrategy(strategy);

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
    
    sb_tree_removeitem ('project_tree_strategies', strategy.Name);
    sb_select_removeitem ('projectstrategyselect', strategy.Name);
    
    var tabindex = sb.tab_delete (strategyfiletab, strategy.Name);    
    if (tabindex < 0) {
        CloseStrategy (strategy);
    } else {
        SelectStrategy(solution.CurrentProject.PG.GetStrategyFromName (strategyfiletab.items[tabindex].item))
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
    
    OnCloseStrategy(CloseStrategy, strategy);
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

function CloseStrategy(strategy) {
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
    while (strategyfiletab.items.length != 0) {
        var strategy = solution.CurrentProject.PG.GetStrategyFromName(strategyfiletab.items[0].item);
        CloseStrategy(strategy);
    }
}

function CloseSavedStrategies() {

}

function SelectCloseStrategy() {
    OnCloseStrategy(CloseStrategy);
}
//---------------------------------------------------- SAVE STRATEGY ------------------------------------------------  

function SelectSaveStrategy() {
    OnSaveStrategy();
}

function OnSaveStrategy(event) {

    if (solution.UserId == "0") {
        DisplayOperation("Strategy can not be saved, You are not registered", true, 'operationpanel', "coral");
        return;
    }

    if (CurrentStrategy) {

        var new_strategyname = document.getElementById('strategyname').value;

        if (new_strategyname == "") {
            DisplayOperation("Strategy Name can not be empty " + new_strategyname, true, 'operationpanel', 'var(--bg-strategycreator)');    
            $('#strategyname').focus();
            return;
        }

        if (CurrentStrategy.Created) {

            var strategy = solution.CurrentProject.PG.GetStrategyFromName(new_strategyname, CurrentStrategy);
            if (strategy) {
                DisplayOperation("Strategy Name already exists " + new_strategyname, true, 'operationpanel', 'var(--bg-strategycreator)');    
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
        DisplayOperation("Saving Strategy " + new_strategyname, true, 'operationpanel', 'var(--bg-strategycreator)');    
    
        w2ui['strategyschedules'].save();
        w2ui['strategyproperty'].save();
        w2ui['strategyactions'].save();
    } else {
         DisplayOperation("Saving Project " + solution.CurrentProject.Name, true, 'operationpanel', 'var(--bg-strategycreator)');    
    }        
    setTimeout(SaveStrategy, 300, CurrentStrategy);        

}

function SaveStrategy(strategy) {

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
        strategy.Description = StrategyQuillBuffer;

        // for buttons to be ok saved

        CurrentEngine.Code[CODE_SS] = CurrentEngine.SCContent;
        strategy.ShouldSave = false;
        strategy.Created = false;
    }

    SaveProject(solution.CurrentProject);
}


//---------------------------------------------------- SELECT STRATEGY ------------------------------------------------  

function _StrategySelect (project, strategyname) {
    if (project.Loaded) {
        clearInterval(Interval_selectstrategy);
        var strategy = project.PG.GetStrategyFromName(strategyname);        
        if (!strategy) return;
        SelectStrategy (strategy);
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



function onclick_StrategyTabItem (elt) {
    var strategy = solution.CurrentProject.PG.GetStrategyFromName ($(elt)[0].innerText);
    SelectStrategy (strategy);
}

function onclick_StrategyCloseTabItem (elt, event) {
    event.stopPropagation ();      

    let strategyname    = $(elt).parent()[0].innerText;
    let strategy        = solution.CurrentProject.PG.GetStrategyFromName (strategyname);

    let tabindex = sb.tab_delete (strategyfiletab, strategyname);    

    if (tabindex < 0) {
        CloseStrategy (strategy);
    } else {
        strategyname = strategyfiletab.items[tabindex].item;
        strategy = solution.CurrentProject.PG.GetStrategyFromName (strategyname);
        SelectStrategy(strategy)
    }
}

function SelectStrategy(strategy) {

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
    }

    sb.tab_select (strategyfiletab,   strategy.Name);

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

    var symbolcanvas = solution.CurrentProject.PG.Canvas;
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

    clearInterval(Interval_selectchart);
    Interval_selectchart = setInterval(SelectChart, 300, strategyperiod); //5 minutes 300000	     


    solution.CurrentProject.CurrentStrategy = strategy;
    CurrentStrategy = strategy;
    CurrentEngine = engine;


    RefreshStrategy(strategy);
    DrawStrategy(strategy, true);

}

function DrawStrategy(strategy, open) {

    if (open) {
 
        $("#projectstrategyselect option[value='--Select Strategy--']").remove();   
        $('#projectstrategyselect option[value="' + strategy.Name + '"]').prop('selected', true); 
        sb.tree_selectitem ('project_tree_strategies', strategy.Name);                              
      
        DisplayOperation("Strategy : " + strategy.Name , true, 'operationpanel', 'var(--bg-strategycreator)');          
      
        AssistantGoToStep ('strategy_assistant_panel', Math.max ($("#strategy_assistant_panel").steps("getCurrentIndex"),STEP_STRATEGYNAME));

    } else {
        
        sb.tree_selectitem ('project_tree_strategies', '');         
        $("#projectstrategyselect option").eq(0).before($('<option>', {value: '--Select Strategy--', text: '--Select Strategy--'}));
        $("#projectstrategyselect option[value='--Select Strategy--']").prop('selected', true);
       
        DisplayOperation("" , true, 'operationpanel'); 

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

//---------------------------------------------------- DOWNLOAD STRATEGY ----------------------------------------------  

function DownloadStrategy(strategyfile) {
    let  site           = solution.get('site');            
    let  user           = solution.get('user')    

    var url = site.address + user.path + '/Projects/' + solution.CurrentProject.Folder + "/MQL4/Experts/" + strategyfile;

    var fileName = "//MQL4//Experts//" + strategyfile;
    var strategyname = strategyfile.split(".ex4")[0];
    var strategy = solution.CurrentProject.PG.GetStrategyFromName (strategyname);
    
    if (strategy) {
        SelectStrategy (strategy);
    }
    var sterminal = solution.GetTerminalFromType ('Terminal');
    if (sterminal) {
        fileName = sterminal.DataPath + fileName; 
    }
    fileName = strategyfile;
    let a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

//-----------------------------------------------------------------------------------------------------------------------  

function ProjectSelectPeriod (terminal, Symbol, Period, async) {
    if (!terminal || !Symbol) return;

    if (async == undefined)
        async = true;    
    var symbolcanvas = solution.CurrentProject.PG.Canvas;
    if (!symbolcanvas) return;      
    var rootid = rootid_fromcanvas(symbolcanvas.ID);

    
    if (symbolcanvas.CurrentPeriod != null && symbolcanvas.CurrentPeriod != Period) {
        Symbol.xextents[Period] = null;
    }        
    //sb.group_select('#' + rootid + ' .chartpanel  #' + Period);     

    symbolcanvas.CurrentPeriod = Period;
    GChartPanel_UpdatePeriod (symbolcanvas, symbolcanvas.CurrentPeriod);
    

    if (!Symbol.WaitHistory[Period] && Symbol.chartData[Period].length == 0) {
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

    if (!solution.CurrentProject) 
        return;
    
    var symbolcanvas = solution.CurrentProject.PG.Canvas;
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
        var symbolname = "EURUSD";
        Symbol = new pgsymbol('EURUSD'); //   (name, port, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize)
        Symbol.Set('EURUSD', 0, "0.01", "100", "0.2", "1", 5, 0.00001, 0, 6); //   (name, port, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize)
        symbolcanvas.CurrentSymbol = Symbol;
        solution.CurrentProject.PG.Symbols.push(Symbol);
    }
    ProjectSelectPeriod (solution.CurrentProject, Symbol, period, true);
    ChartPanel_Update (symbolcanvas);
}

//--------------------------------------------------------------- STRATEGY PARSE ERROR ------------------------------------------------------------------------------



function TracePropertiesEditor(value) {
    PropertiesEditor.setValue(value, -1);
}