
//------------------------------------------------------------ DISTRIBUTE PANEL ----------------------------------------------------------
function onclick_refresh_terminals(elt) {
    RefreshTerminals();
}


function RefreshTerminals () {
    let  site        = solution.get('site');
    let  user        = solution.get('user')
    let  url         = site.address  + "/php/read_terminals.php"

    solution.project_LoadTerminals(user.id, url, SYNCHRONE, solution.UpdateDistributeTerminals, solution);    
}
 

function DeployHeaderPanel () {
    var content =     
    '<span class="togglesidebar ' + icon_toggle + '" onclick="OnToggle(PROJECT_ID, this);"></span>' +     
    '<div class="sb_sidebarheader sb_bar">' +
            '<div class="sb_sidebarheadertitle">DEPLOY PROJECT</div>' +
            '<button id="distributerefresh" class="sb_button"  type="button" onclick="onclick_refresh(this)">Refresh</button>' +             
            '<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>' +
    '</div>';
    return content;
}



function DistributePanel_Update (solution) {
    var tcontent = '';
    let  user        = solution.get('user')

    if (user.id == 0) {
          $('#project_distributepanel').html(sb.render(ReturnWarningALert('You should Register to see your Terminals')))
          return;
    }

    distributetable.rows = [];

    if (solution.Terminals.length == 0) {
        $('#project_distributepanel').html(sb.render(ReturnWarningALert('You do not have any MT4 Platform Configured with MT4 Terminal')))
        return ;
    }
    let j = 0;
    for (var i = 0; i < solution.Terminals.length; i++) {
        let terminal = solution.Terminals[i];        
        if (terminal.Type == 'Terminal') {        
            j
            distributetable.rows.push ([
                    '<i class="fas fa-landmark"></i><span id="terminalname" class="terminalname"+ title="' + terminal.Folder +'">' +  terminal.Name + '</span>',
                    sb.render({id: 'terminalcheck_'+ j + '_0', type: 'checkbox', class: 'terminalcheck'}) ,               
                    sb.render({id: 'strategytestercheck_'+ j + '_1', type: 'checkbox', class: 'terminalcheck'}) ,               
            ])
            j++;
        }
    }
    sb.table_setrows (distributetable, distributetable.rows)
}

//'       <div class="labelexplain">' +
//'           <p>WARNING : If an Existing Project is already running on the terminal, it will close all existing orders and it will start a new session with this project. Assure You stopped all your strategies before.</p>' +
//'       </div>' +

//---------------------------------------------------- DISTRIBUTE PROJECT ---------------------------------------------- 

function onclick_distributeproject (elt) {

    let terminalchecked = false;      
    let strategytesterchecked = false;    
    let deploy = false;

    let strategyname;
    for (var i = 0; i < distributetable.rows.length; i++) {

        let terminal = solution.GetTerminalsFromName ($('#distributetable_' + i + '_0 #terminalname').html())[0];

        terminalchecked         = $('#terminalcheck' + '_' + i + '_0').prop('checked');    
        strategytesterchecked   = $('#strategytestercheck' + '_' + i + '_1').prop('checked');   
        deploy = (terminalchecked || strategytesterchecked)  ? true : deploy;

        if (terminalchecked)        project_projectdistribute(solution.CurrentProject, terminal, 'Terminal');            
        if (strategytesterchecked)  project_projectdistribute(solution.CurrentProject, terminal,  'Tester'); 
    }
    if (!deploy) {
        DisplayInfo("Select Terminal you want to deploy the project", true, 'project_operation', "coral");                  
    }
}


function project_projectdistribute (project, terminal, terminaltype) {
    if (!terminal || !project)
        return;
   
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    if (!project_DeployCom || project_DeployCom.Socket.connected == false) { 
        DisplayInfo("Deploy Server is not connected  check Deploy Server", true, 'operationpanel',  'var(--bg-strategycreator)'); 
        sidebarmenu_select ('sidebar_deploy', 1);
        modalserverpanel_select();                   
        return;
    }

    bottompanel_select (projectplatform,'tab-error') 
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START DISTRIBUTION " + project.Name + " ON " + terminal.Name + " " +  terminaltype, 1);
    TraceErrorEditor("-----------------------------------------------------------", 1);
    
    DisplayInfo("Start Distribution " + project.Name + " ON " + terminal.Name + ' ' + terminaltype, true, 'operationpanel',  'var(--bg-strategycreator)');
    
    
    project.Distribute(terminal.Folder, terminaltype);   // Synchrone
    
    
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> FINISH DISTRIBUTION " + project.Name + (returnvalue.length != 0 ? " with Error " : " OK ") +  " ON " + terminal.Name + ' ' + terminaltype, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    
    DisplayInfo("Finish Distribution" + project.Name + " ON " + terminal.Name + ' ' + terminaltype, true, 'operationpanel', 'var(--bg-strategycreator)');
    
    if (returnvalue.length != 0)
        return;
/*        
        
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START RELOADING PROJECT " + project.Name + " ON " + terminal.Name + ' ' + terminaltype, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    
    DisplayInfo("Reloading Project " + project.Name + " on " + terminal.Name + ' ' + terminaltype, true, 'operationpanel',  'var(--bg-strategycreator)');
    
    OnReloadProject(terminal, terminal.Name, terminaltype);
    
    
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> FINISH RELOADING PROJECT " + project.Name + " ON " + terminal.Name + ' ' + terminaltype + " OK -----------------", 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    
    DisplayInfo("Finish Reloading Project " + project.Name + " on " + terminal.Name + ' ' + terminaltype , true, 'operationpanel',  'var(--bg-strategycreator)');
    
    
    
    var terminal = solution.GetTerminalFromNameType(terminal.Name, terminaltype);
    terminal.Loaded = 0;
    if (terminal == solution.CurrentTerminal) {
        tradedesk_selectterminal(terminal, true);
    }
        */
}
//-------------------------------------------------  DISTRIBUTE STRATEGY ---------------------------------------------- 
function DownloadExpertConfirm (callafter, expertfile) {

    sb.confirm_modal('Download Expert Advisor ' + expertfile + ' ?').yes(function () {
        callafter (expertfile);
        $("#confirmmodal").modal('hide');        

    }).no(function () {})
}


function OnDownloadExpert (callafter, expertfile) {
    DownloadExpertConfirm (callafter, expertfile);
}

function onclick_expertDownload (elt) {
    var expertfile = object.children[1].innerHTML;    

 //   OnDownloadExpert (DownloadStrategy, expertfile)
}


function DownloadStrategy(strategyfile) {
    let  site           = solution.get('site');            
    let  user           = solution.get('user')    

    var url = user.path + '/Projects/' + solution.CurrentProject.Folder + "/MQL4/Experts/" + strategyfile;
    SaveURIInFile (url, '')    
}

function onclick_refresh_experts (elt,event) {
    if (!solution.CurrentProject) {
        return;
    }
    RefreshExperts();    
}

function RefreshExperts () {
    sb.tree_removechildren ('project_tree_experts');
    let  site           = solution.get('site');     
    solution.CurrentProject.PG.LoadExperts(solution,  site.address + "/php/read_experts.php", solution.CurrentProject.Folder,  SYNCHRONE, UpdateProjectExperts, solution.CurrentProject);    
}

function onclick_distributeexpert (elt) {

    let terminalchecked = false;      
    let strategytesterchecked;  
    let deploy = false;  


    let expertnode = $('#project_tree_expertspanel .active label');
    if (expertnode.length == 0) {
        DisplayInfo("Select expert file you want to deploy", true, 'project_operation', "coral");   
        return;
    }  
    let strategyfile = expertnode.html();
    let strategyname = strategyfile.substr(0, strategyfile.length -4);
    let strategy = solution.CurrentProject.PG.GetStrategyFromName (strategyname);
    
    if (!strategy) {
        DisplayInfo("Unknow strategy " + strategyname, true, 'project_operation', "coral");   
    }

    for (var i = 0; i < distributetable.rows.length; i++) {

        let terminal = solution.GetTerminalsFromName ($('#distributetable_' + i + '_0 #terminalname').html())[0];

        terminalchecked         = $('#terminalcheck' + '_' + i + '_0').prop('checked');    
//        strategytesterchecked   = $('#strategytestercheck' + '_' + i + '_1').prop('checked');   
        deploy = terminalchecked ? true : deploy;
        if (terminalchecked)        {
            project_strategydistribute(solution.CurrentProject, strategyfile, terminal);            
        }
    }

    if (!deploy) {
            DisplayInfo("Select a Terminal on which you want to deploy", true, 'project_operation', "coral");      
    }        
}

function project_strategydistribute (project, strategyfile, terminal) {
    if (!terminal || !project)
        return;
   
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    if (!project_DeployCom || project_DeployCom.Socket.connected == false) { 
        DisplayInfo("Deploy Server is not connected  check Deploy Server", true, 'operationpanel',  'var(--bg-strategycreator)'); 
        sidebarmenu_select ('sidebar_deploy', 1);
        modalserverpanel_select();                   
        return;
    }    

    OnDistributeStrategy (project, strategyfile , 'MQ4', terminal.DataPath)

    bottompanel_select (projectplatform,'tab-error')        
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START DISTRIBUTION " + strategyfile + " ON " + terminal.Name, 1);
    TraceErrorEditor("-----------------------------------------------------------", 1);
    
    DisplayInfo("Start Distribution " + strategyfile + " ON " + terminal.Name , true, 'operationpanel',  'var(--bg-strategycreator)');
}

function OnDistributeStrategy (project, strategyfile, langtype, terminalpath) {
   
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    var sorder = "*DISTRIBUTE*" + project.Folder + "*" + strategyfile + "*" + langtype + "*" + terminalpath;
    project_DeployCom.Send(solution.get('user').id + sorder);
}

//---------------------------------------------------- COMPILE PROJECT ---------------------------------------------- 

var StartCompilation = false;
var FinishUploading  = false;


function SelectCompileProject (project, langtype) {
    if (!project)
        return;
    CompileProject(project,  langtype, 'Terminal');
    CompileProject(project,  langtype, 'Tester');
}

function CompileProject(project, langtype, terminaltype) {
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    
    if (!project_DeployCom || project_DeployCom.Socket.connected == false) { 
        DisplayInfo("Deploy Server is not connected  check Deploy Server", true, 'operationpanel',  'var(--bg-strategycreator)'); 
        sidebarmenu_select ('sidebar_deploy', 1);
        modalserverpanel_select();                   
        return;
    }

    let sfiles = ["", "", ""];
    let content;
   
    if (langtype == "C") {
        content = project.GenerateCFile(sfiles);
    } else {
        content = project.GenerateMQ4File();
    }

    let cconditionfile = project.GenerateCConditionFile();

    OnCompileProject(project, "Project", content, langtype, terminaltype);

    bottompanel_select (projectplatform,'tab-error')    
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START COMPILATION OF PROJECT " + project.Name + " in " + langtype + " for " + terminaltype + "", 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    DisplayInfo("Compiling " + project.Name  + ' Please Wait', project.PG.OperationSound, 'operationpanel',  'var(--bg-strategycreator)');
}

function OnCompileProject(project, filename, content, langtype, terminaltype) {

    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var sorder = "*COMPILE*" + project.Folder + "*" + filename + "*" + langtype + "*" + terminaltype + "*" + content;
    project_DeployCom.Send(solution.get('user').id + sorder);
}




//-------------------------------------------------- COMPILE STRATEGY ---------------------------------------------




function SelectCompileStrategy (project, strategy, langtype) {
    if (!strategy)
        return;
               
    StartCompilation = true; 
    FinishUploading = false;
    
    if (projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW) {
        $('#popupcompile_button').addClass ('disabled');
        loopBeginLoopComplete(strategy);
    }else {
       
    }
    CompileStrategy(project, strategy, langtype);
}

function CompileStrategy(project, strategy, langtype) {
    
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    if (!project_DeployCom || project_DeployCom.Socket.connected == false) { 
        DisplayInfo("Deploy Server is not connected  check Deploy Server", true, 'operationpanel',  'var(--bg-strategycreator)');      
        sidebarmenu_select ('sidebar_deploy', 1)  
        modalserverpanel_select();
        return;
    }

    var content = "";
    
    try {
        solution.PL.ParseEngine(CurrentEngine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);     
        return;       
    }    
    
    content +=  GenerateMQ4Objects (CurrentEngine);
    content +=  GenerateMQ4Conditions(CurrentEngine);    
    content +=  GenerateVariables(MQ4_GENERATION, GLOBAL_VARIABLE);
    content +=  GenerateMQ4Strategy(strategy, CurrentEngine);

    
    content += project.GenerateMQ4EntryRules(strategy);    
    
    var ObjectStringHeader = '"ID,NAME,TYPE,CROSS,PERIOD,METHOD,APPLY,SHIFT,MODE,DISPLAY_TYPE, DISPLAY, LEVELTYPE, VALUE1, VALUE2, VALUE3, VALUE4,LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9';

    var EngineStringHeader = '"B_NAME,B_OPERATION,B_STARTRULE,B_BUYRULE,B_SELLRULE,B_EXITBUYRULE,B_EXITSELLRULE,B_EXITRULE,B_ILOT,B_MAXLOT,B_MAXCOUNT,B_DIRECTION, B_DIRECTIONTYPE, B_RECOVERYMODE,B_RECOVERYVALUE,B_PIPSTEP,B_TIMESTEP,B_ORDERTYPE,B_KEEPBUYSELL,B_ONEORDERPERBAR,B_EXITMODE,B_MAXTIME,B_HEDGEMAGNITUDE,B_MINPROFIT,B_BUYMINPROFIT,B_SELLMINPROFIT,B_TP,B_TS,B_SL,B_BUYTP,B_BUYTS,B_BUYSL,B_SELLTP,B_SELLTS,B_SELLSL,B_BUYLOTTP,B_BUYLOTTS,B_BUYLOTSL,B_SELLLOTTP,B_SELLLOTTS,B_SELLLOTSL';
    
    var ScheduleStringHeader = '"RULE,OPERATION,SYMBOL,STARTMONTH,OCCURENCEDAYINWEEK,STARTDAY,STARTTIME,ENDMONTH,ENDOCCURENCEDAYINWEEK,ENDDAY,ENDTIME,FREQDAY,SAMEBAR,TIMEBETWEENSESSION, TIMEZONE';

    var UsedIndicators = [];
    for (i = 0; i < CurrentEngine.Indicators.length; i++) {
        var object =  project.PG.GetObjectFromId (CurrentEngine.Indicators[i]);
        if (object && !UsedIndicators.includes(object.Name)) {
            UsedIndicators.push (object.Name);
        }
    }

    content += '\nstring EngineString   = ' + EngineStringHeader  + '," + \n"' + project.PG.SaveEngineInString(CurrentEngine)  + '";\n';        
    content += '\nstring ObjectString   = ' + ObjectStringHeader   + project.PG.SaveObjectsInString(UsedIndicators) + ';\n';        
    content += '\nstring ScheduleString = ' + ScheduleStringHeader + project.PG.SaveSchedulesInString(CurrentEngine) + ';\n';        

    
    OnCompileStrategy(project, strategy.Name, content, langtype);

    bottompanel_select (projectplatform,'tab-error')      
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START COMPILATION OF THE STRATEGY " + strategy.Name + " in " + langtype, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);

    DisplayInfo("Compiling " + strategy.Name + ' Please Wait', true, 'operationpanel', 'var(--bg-strategycreator)');


}

function OnCompileStrategy (project, strategyname, content, langtype) {
   
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatInfo(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    var sorder = "*COMPILE*" + project.Folder + "*" + strategyname + "*" + langtype + "*" + "Terminal" + "*" + content;
    project_DeployCom.Send(solution.get('user').id + sorder);
}

var loopBeginLoopComplete = function(strategy) {

    var beginLogEl = document.querySelector('.loopBegin-log');
    var completeLogEl = document.querySelector('.loopComplete-log');
    
    beginLogEl.value = '';
    completeLogEl.value = '';
    
    /*DEMO*/
    var loopBegan = 0;
    var loopCompleted = 0;
    
      anime({
      targets: '.loopBegin-loopComplete-demo .el',
      translateX: $('#popupcompile #strategyassistantelement').width() - 20,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutCirc',
      loopBegin: function(anim) {
        if (StartCompilation) {  
            beginLogEl.value = 'Compiling: ' + strategy.Name;
        }
      },
      loopComplete: function(anim) {
         if (!StartCompilation) {
            beginLogEl.value = 'Compiling: ' + strategy.Name + ' Finish Compilation';
            completeLogEl.value = 'Uploading: '  + strategy.Name;
            if (FinishUploading) {
                completeLogEl.value = 'Uploading: ' + strategy.Name + ' Finish Uploading';                
                resetDemo();         
                $('#popupcompile_button').removeClass('disabled');
            }
         }
      }
    });
}
