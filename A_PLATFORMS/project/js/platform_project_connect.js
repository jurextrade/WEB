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
            $('#project_root #button_server').css ('background', connect ? color : ''); 
            $('#project_root #button_server').css ('color', connect ? '#000000' : '');            

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
    if (values[0] == "DISTRIBUTE") {
        TreatDistribute(project, values, Line);
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
        
        DisplayInfo("Finish Compilation OK", true, 'project_operation');   
       
        
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("> FINISH COMPILATION WITH ERROR FOR " + (compiletype == 'MQL4' ? "STRATEGY " : " PROJECT " + project.Name) +  " : " + values[5], 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        DisplayInfo("Compilation Fails", true, 'project_operation', "coral");  
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("----------------- END PROCESS " + values[1] + " ON " + terminaltype + " INTERRUPTED -----------------", 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
    }
}


function TreatUpload(project, values, Line) {
    var compiletype =  values[3];   
  

    FinishUploading = true;

    if (values[4] == "OK") {
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">" + (compiletype == 'MQL4' ? "STRATEGY " : "PROJECT ") + "SUCCESSFULLY UPLOADED " + values[1], 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);

        DisplayInfo("Finish Uploading OK", true, 'project_operation');  
        
        if (compiletype == 'MQL4') {
            var strategyfilename = values[1].split ('/')[3];
            RefreshExperts();
            sb.tree_selectitem ('project_tree_experts', strategyfilename);                
        }        
        sidebarmenu_select('sidebar_deploy', 1);        
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">PROJECT FILE CAN NOT BE UPLOADED : " , 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        DisplayInfo("Uploading Fails", true, 'project_operation', "coral"); 

    }
}

function TreatDistribute(project, values, Line) {
    let filename = values[1];
    let tofilename = values[2];


    if (values[3] == "OK") {
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">STRATEGY FILE SUCCESSFULLY DOWNLOADED ON TERMINAL in folder " + tofilename, 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);

        DisplayInfo("Finish Downloading OK", true, 'project_operation');  
        
 
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">" + "STRATEGY FILE CAN NOT BE DOWNLOADED ON TERMINAL: "  + values[4] , 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        DisplayInfo("Downloading Fails", true, 'project_operation', "coral"); 

    }
}
