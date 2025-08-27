//----------------------------------------------------SERVERS PANEL------------------------------------------------ 

const DEPLOYSERVER           = "DEPLOYSERVER";
var project_DeployCom          = null;

function project_highlightserver (origin, project, connect, color) {
    let elt = '';

    switch (origin) {
        case DEPLOYSERVER:
            $('#project_root #button_server').css ('background', connect ? color : ''); 
            $('#project_root #button_server').css ('color', connect ? '#000000' : '');            

        break;      
    }  
}    


function DeployConnect(adress, port, reconnection) {

    if (project_DeployCom && project_DeployCom.Socket.connected == true) 
        return;

    project_DeployCom = new connect (adress, port, 
        {
            onconnectfunction:  function (com) {

                project_highlightserver (DEPLOYSERVER, null, 1,  theme_on)


            },
            onmessagefunction: function (com, data) {
              //  let project = solution.GetProjectFromCom(com)
                TreatReception (com, data);
            },    
            ondisconnectfunction:     function (com, data) {project_highlightserver(DEPLOYSERVER, null, 0); },
            onclosefunction:          function (com, data) {project_highlightserver(DEPLOYSERVER, null, 0); },
            onerrorfunction:          function (com, data) {project_highlightserver(DEPLOYSERVER, null, 0); },   
            onupdatefunction:         function (com, data) {project_highlightserver(DEPLOYSERVER, null, 0); },
            onconnect_errorfunction:  function (com, data) {project_highlightserver(DEPLOYSERVER, null, 0); },
            onconnect_failedfunction: function (com, data) {this.reconnection = false; project_highlightserver(DEPLOYSERVER, null, 0); },   
            reconnection:             reconnection ? reconnection : false  

        }
    )
    project_DeployCom.Name = DEPLOYSERVER;
    return project_DeployCom.Socket;
}

//---------------------------------------------------- IP ADDRESS-----------------------------------------------   


function TreatReception (com, recmessage) {        
    

    if (!recmessage) return;
    
    if (recmessage.substring(0, 1) != ":") {
        console.log ("Receiveing strange on " + com.Name);
    }
 
    var index = recmessage.indexOf("*");
    var message = recmessage.substring(index + 1);
    var symbolname = recmessage.substring(1, index);
     
   
    var output;
    var length = message.length;
 
    if (com.Buffer !== undefined) {
        if (message[length - 1] != "*") {
            com.Buffer  = com.Buffer + message;
            return;
        } else {
            output = com.Buffer + message;
        }
    } else {
        com.Buffer = message;
        output = message;
    }

    com.Buffer = "";
    

    var lines = output.split('*');
    length = lines.length;
    for (var j = 0; j < length; j++) {
        if (lines[j].length < 1) continue;
        var Line = lines[j];
        var values = Line.split('^');
        TreatCommand(Line, values);
    }
}

function TreatCommand(Line, values) {
    let project = solution.CurrentProject;
    if (!project) {
        return;
    }

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
    let filename        = values[1];
    let projectname     = values[2];
    let compiletype     = values[3];
    let responsestate   = values[4];    
    let response        = values[5].replace(/\u0000/g, '');    


    StartCompilation = false;
    
    if (responsestate == "OK") {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("> FINISH COMPILATION OK FOR " + (compiletype == 'MQL4' ? "STRATEGY " : " PROJECT " + projectname) + " : " + filename, 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        
        TreatInfo("Finish Compilation OK");   
       
        
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("> FINISH COMPILATION WITH ERROR FOR " + (compiletype == 'MQL4' ? "STRATEGY " : " PROJECT " + projectname) +  " : " + response, 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        TreatInfo("Compilation Fails");  
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor("----------------- END PROCESS " + filename + " OF " + projectname + " INTERRUPTED -----------------", 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
    }
}


function TreatUpload(project, values, Line) {
    let compiletype     = values[3];   
    let responsestate   = values[4];   

    FinishUploading = true;

    if (responsestate == "OK") {
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">" + (compiletype == 'MQL4' ? "STRATEGY " : "PROJECT ") + "SUCCESSFULLY UPLOADED " + values[1], 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);

        TreatInfo("Finish Uploading OK");  
        
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
        TreatInfo("Uploading Fails"); 

    }
}

function TreatDistribute(project, values, Line) {
    let filename        = values[1];
    let tofilename      = values[2];
    let responsestate   = values[3];     


    if (responsestate == "OK") {
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">STRATEGY FILE SUCCESSFULLY DOWNLOADED ON TERMINAL in folder " + tofilename, 1);
        TraceErrorEditor("----------------------------------------------------------------------------", 1);

        TreatInfo("Finish Downloading OK");  
        
 
    } else {
        
        TraceErrorEditor("----------------------------------------------------------------------------", 1);
        TraceErrorEditor(">" + "STRATEGY FILE CAN NOT BE DOWNLOADED ON TERMINAL: "  + values[4] , 1);
        TraceErrorEditor("-----------------------------------------------------------", 1);
        TreatInfo("Downloading Fails"); 

    }
}
