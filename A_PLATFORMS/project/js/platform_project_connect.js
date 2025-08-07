//----------------------------------------------------SERVERS PANEL------------------------------------------------ 


const DEPLOYSERVER           = "DEPLOYSERVER";
var project_DeployCom          = null;

function DeployConnect(adress, port, reconnection) {

    if (project_DeployCom && project_DeployCom.Socket.connected == true) 
        return;
//    console.log ('deply connect')
    project_DeployCom = new connect (adress, port, 
        {
            onconnectfunction:  function (com) {

                HighlightTerminal (DEPLOYSERVER, null, 1,  theme_on)


            },
            onmessagefunction: function (com, data) {
              //  let project = solution.GetProjectFromCom(com)
                TreatReception (solution.CurrentProject, data);
            },    
            ondisconnectfunction:     function (com, data) {HighlightTerminal(DEPLOYSERVER, null, 0); },
            onclosefunction:          function (com, data) {HighlightTerminal(DEPLOYSERVER, null, 0); },
            onerrorfunction:          function (com, data) {HighlightTerminal(DEPLOYSERVER, null, 0); },   
            onupdatefunction:         function (com, data) {HighlightTerminal(DEPLOYSERVER, null, 0); },
            onconnect_errorfunction:  function (com, data) {HighlightTerminal(DEPLOYSERVER, null, 0); },
            onconnect_failedfunction: function (com, data) {this.reconnection = false; HighlightTerminal(DEPLOYSERVER, null, 0); },   
            reconnection:             reconnection ? reconnection : false  

        }
    )

    return project_DeployCom.Socket;
}

//---------------------------------------------------- IP ADDRESS-----------------------------------------------   

function HighlightTerminal (origin, project, connect, color) {
    let elt = '';

    switch (origin) {
        case DEPLOYSERVER:
            $('#project_projects_headerpanel #button_server').css ('background', connect ? color : ''); 
            $('#project_projects_headerpanel #button_server').css ('color', connect ? '#000000' : '');            

        break;      
    }  
}    


function TreatReception (project, recmessage) {        
    if (!recmessage) return;
    
    if (recmessage.substring(0, 1) != ":") {
        console.log ("Receiveing strange on " + project.Name);
    }
 
    var index = recmessage.indexOf("*");
    var message = recmessage.substring(index + 1);
    var symbolname = recmessage.substring(1, index);
     
    project.LastRunningTime = Date.now();
   
    var output;
    var length = message.length;
 
    if (project.Buffer !== undefined) {
        if (message[length - 1] != "*") {
            reader.Buffer  = project.Buffer + message;
            return;
        } else {
            output = project.Buffer + message;
        }
    } else {
        project.Buffer = message;
        output = message;
    }

    if (project.Buffer) {
        project.Buffer = "";
    }

    var lines = output.split('*');
    length = lines.length;
    for (var j = 0; j < length; j++) {
        if (lines[j].length < 1) continue;
        var Line = lines[j];
        var values = Line.split('^');
        TreatCommand(project, Line, values);
    }
}

function TreatCommand(project, Line, values) {
    
    if (values[0] == "LOGIN") {
        TreatLogin(project, values);
    } else
    if (values[0] == "CONNECT") {
        TreatConnect(project, values);
    } else
    if (values[0] == "INIT") {
        TreatInit(project, values);
    } else
    if (values[0] == "COMPILE") {
        TreatCompile(project, values, Line);
    } else
    if (values[0] == "UPLOAD") {
        TreatUpload(project, values, Line);
    } 
}

//-------------------------------------------------- COMPILE PROJECT ---------------------------------------------


function TreatCompile(project, values, Line) {
    values[5] = values[5].replace(/\u0000/g, '');    
 
    var terminaltype =  values[2];
    var compiletype =  values[3];
    StartCompilation = false;
    if (values[4] == "OK") {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("> FINISH COMPILATION OK FOR " + (compiletype == 'MQL4' ? "STRATEGY " : " PROJECT " + project.Name) + " : " + values[1], 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        
        DisplayOperation("Finish Compilation OK", true, 'project_operation');   
       
        
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("> FINISH COMPILATION WITH ERROR FOR " + (compiletype == 'MQL4' ? "STRATEGY " : " PROJECT " + project.Name) +  " : " + values[5], 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        DisplayOperation("Compilation Fails", true, 'project_operation', "coral");  
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("----------------- END PROCESS " + values[1] + " ON " + terminaltype + " INTERRUPTED -----------------", 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
    }
}


function TreatUpload(project, values, Line) {
    var compiletype =  values[3];   
  
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    FinishUploading = true;

    if (values[4] == "OK") {
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">" + (compiletype == 'MQL4' ? "STRATEGY " : "PROJECT ") + "SUCCESSFULLY UPLOADED " + values[1], 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);

        DisplayOperation("Finish Uploading OK", true, 'project_operation');  
        
        if (compiletype == 'MQL4') {
            var strategyname = values[1].split ('/')[3];
            if (!project.PG.GetExpertFromName(strategyname)) {
                project.PG.Experts.push (strategyname);
            }

            var item = {id:'expert_' + strategyname, type: 'link', item: strategyname, icon: icon_mt4expert,
                        attributes:{selector: 'selectexpert', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                        events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}                     
                        };
                
            sb.tree_additems ('project_tree_experts', [item])
            onclick_sidebarmenu('sidebar_deploy', 1);
            sb.box_toggle('project_boxexpertspanel', true);            
            sb.tree_selectitem ('project_tree_experts', strategyname);                
        }        
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">PROJECT FILE CAN NOT BE UPLOADED : " , 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        DisplayOperation("Uploading Fails", true, 'project_operation', "coral"); 

    }
}

//---------------------------------------------------- COMPILE PROJECT ---------------------------------------------- 

var StartCompilation = false;
var FinishUploading  = false;


function onclick_project_projectcompile(elt) {
    SelectCompileProject(solution.CurrentProject, 'C');
}

function SelectCompileProject (project, langtype) {
    if (!project)
        return;
    
    BottomPanel_Flat (projectplatform, false);         
    sb.tab_select(project_bottomtabs, 'tab-error');

  
    CompileProject(project,  langtype, 'Terminal');
    CompileProject(project,  langtype, 'Tester');
}

function CompileProject(project, langtype, terminaltype) {
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
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

    
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START COMPILATION OF PROJECT " + project.Name + " in " + langtype + " for " + terminaltype + "", 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    DisplayOperation("Compiling " + project.Name  + ' Please Wait', project.PG.OperationSound, 'operationpanel',  'var(--bg-strategycreator)');
    OnCompileProject(project, "Project", content, langtype, terminaltype);
}

function OnCompileProject(project, filename, content, langtype, terminaltype) {

    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    var sorder = "*COMPILE*" + project.Folder + "*" + filename + "*" + langtype + "*" + terminaltype + "*" + content;
    project_DeployCom.Send(solution.UserId + sorder);
}

//-------------------------------------------------- COMPILE STRATEGY ---------------------------------------------


function onclick_project_strategycompile(elt, event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;    
  //  BottomPanel_Flat(platform, false);    
    SelectCompileStrategy (solution.CurrentProject, CurrentStrategy, 'MQL4')
}

function SelectCompileStrategy (project, strategy, langtype) {
    if (!strategy)
        return;
               
    StartCompilation = true; 
    FinishUploading = false;
    
    if (projectplatform.strategyview == STRATEGY_ASSISTANT_VIEW) {
        $('#popupcompile_button').addClass ('disabled');
        loopBeginLoopComplete(strategy);
    }else {
        BottomPanel_Flat (projectplatform, false);         
        sb.tab_select(project_bottomtabs, 'tab-error');         
    }
    CompileStrategy(project, strategy, langtype);
}

function CompileStrategy(project, strategy, langtype) {
    
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
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

    

    TraceErrorEditor("----------------------------------------------------------------------------", 1);
    TraceErrorEditor("> START COMPILATION OF THE STRATEGY " + strategy.Name + " in " + langtype, 1);
    TraceErrorEditor("----------------------------------------------------------------------------", 1);

    DisplayOperation("Compiling " + strategy.Name + ' Please Wait', true, 'operationpanel', 'var(--bg-strategycreator)');

    OnCompileStrategy(project, strategy.Name, content, langtype);
}

function OnCompileStrategy (project, strategyname, content, langtype) {
   
    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
        return;
    }

    var sorder = "*COMPILE*" + project.Folder + "*" + strategyname + "*" + langtype + "*" + "Terminal" + "*" + content;
    project_DeployCom.Send(solution.UserId + sorder);
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



