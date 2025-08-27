//----------------------------------------------------SERVERS PANEL------------------------------------------------ 

const NETPROGSERVER           = "NETPROGSERVER";
var netprog_NetprogCom          = null;


function netprog_highlightserver (origin, project, connect, color) {
    let elt = '';

    switch (origin) {
        case NETPROGSERVER:
            $('#netprog_root #button_server').css ('background', connect ? color : ''); 
            $('#netprog_root #button_server').css ('color', connect ? '#000000' : '');            

        break;      
    }  
}    


function NetprogConnect(adress, port, reconnection) {

    if (netprog_NetprogCom && netprog_NetprogCom.Socket.connected == true) 
        return;

    netprog_NetprogCom = new connect (adress, port, 
        {
            onconnectfunction:  function (com) {

                netprog_highlightserver (NETPROGSERVER, null, 1,  theme_on)


            },
            onmessagefunction: function (com, data) {
              //  let project = solution.GetProjectFromCom(com)
        //        TreatReception (com, data);
            },    
            ondisconnectfunction:     function (com, data) {netprog_highlightserver(NETPROGSERVER, null, 0); },
            onclosefunction:          function (com, data) {netprog_highlightserver(NETPROGSERVER, null, 0); },
            onerrorfunction:          function (com, data) {netprog_highlightserver(NETPROGSERVER, null, 0); },   
            onupdatefunction:         function (com, data) {netprog_highlightserver(NETPROGSERVER, null, 0); },
            onconnect_errorfunction:  function (com, data) {netprog_highlightserver(NETPROGSERVER, null, 0); },
            onconnect_failedfunction: function (com, data) {this.reconnection = false; netprog_highlightserver(NETPROGSERVER, null, 0); },   
            reconnection:             reconnection ? reconnection : false  

        }
    )
    netprog_NetprogCom.Name = NETPROGSERVER;
    return netprog_NetprogCom.Socket;
}

class npserver {
    constructor (entity) {
        this.Entity = entity;
        this.Com    = null;   
        this.Id     = entity.Code;             
        this.Input;
        this.Output;  
        this.input_init(this.Id);
        this.output_init(this.Id);
    }
    input_init = function (id) {

        this.Input = new aceeditor('netprog_server_input_' + id, "ace/theme/nord_dark", "ace/mode/jsx");      
        this.Input.setOptions( {
            useSoftTabs: true,
            showPrintMargin: false
        });    
        this.Input.addCommand({
            name: 'sendMessage',
            bindKey: {
                win: 'Alt-E',
                mac: 'Alt-E',
                sender: 'editor|cli'
            },
            exec: this.oneval
        });   
    }   
    output_init = function (id) {
        this.Output = new aceeditor('netprog_server_output_' +  id, "ace/theme/nord_dark", "ace/mode/jsx");      
        this.Output.setOptions( {
            showPrintMargin: false,        
            readOnly: true,        
            showLineNumbers: false,
            showGutter: false
        });    
    
        this.Output.addCommand({
            name: 'clearJS',
            bindKey: {
                win: 'Alt-C',
                mac: 'Alt-C',
                sender: 'editor|cli'
            },
            exec: this.Output
            });
    }    
    init = function (inputid, outputid) {
        input_init (inputid) 
        output_init(outputid)    
    }
    input_getcontent = function () {
        var selected = this.Input.getSelection();
        if (selected == '') {
            selected = this.Input.getValue()
        }
        return selected;
    }    
    sendmessage = function (nodecontent) {
        try {
            this.output_clear();        
            let nodemessage = JSON.stringify ({command: nodecontent}, null, 2)
            this.Com.Send(nodemessage); 
        } catch (error) {
                this.Output.setValue('com on mannnn : ' + error.message);            
              //  throw error;
        }
    }    
    output_clear = function () {
        this.Output.setValue('');  
    
    }
    oneval (env, args, request) {
        if (defined (env)) {
            var start = env.curOp.selectionBefore.start;
            var end   = env.curOp.selectionBefore.end;
        }
        this.sendmessage (this.input_getcontent ());    
    }
    resize () {
        this.Output.resize();
        this.Input.resize();
    }
}

function netprog_server_resize (id) {
    let server = solution.GetServerFromId(id);
    if (!server) {
        return;
    }
    server.resize();
}

function filenamepanel () {
    return `<span class="sb_link sb_formgroup" title=""> 
            <label class="sb_label">File Name</label>
            <input id="export_filename" type="text" class="form-control" value="script_.js">
            </span>`
}

function onclick_export_file() {
    let cuser = solution.user;

    let project_folder = solution.netprog_CurrentProject.Folder;
    let file_path      = cuser.fileexplorer.Root + cuser.path  + '/NetProg/' + project_folder  + '/Script_Server/' ;


    let netprogserver  = solution.GetServerFromName('NetProgServer');   

    cuser.send ({Name: 'savefile',  Values: [file_path + $('#export_filename').val(), netprogserver.Input.getValue()]},
                false,  
                function (content, values) {
                    let message;    
                    try {
                        message = JSON.parse(content);
                    } catch(e) {
                        return console.error(e); 
                    }                        

                    $("#exportserver_filename").modal('hide');                       
                },
                [this])
    netprog_filemanager_update()
}


function netprog_netprogservers_check (manager) {
    let netprogserverclass = interface_GetEntity (manager, 'ApplicationClasses', 'Name', 'Class:NetProgServer');
 //   let netprogconclass    = interface_GetEntity (manager, 'ConnectionClasses',  'Name', 'Class:NetProgConnection');    
    let  website          = solution.get('site');   

    let applications      = netprogserverclass.Applications;
    for (var i = 0; i < applications.length; i++) {
        let netprogappli  = interface_GetEntity (manager, 'Applications', 'Name', applications[i].Name);
        let servermachine = interface_GetEntity (manager, 'Machines',     'Name', netprogappli.Machine);   
        let site          = interface_GetEntity (manager, 'Sites',        'Name', servermachine.Site);       
        let port          = website.protocol == 'http:' ? 4080 : 4443; //netprogappli.Ports[0];
        let address       = servermachine.AddrName;
        let server        = solution.GetServerFromName(netprogappli.Name);

        netprogappli.Ports[0] = port;   // update port
        
        if (!server) {
            server = new npserver(netprogappli);                        
            solution.NetprogServers.push(server);
        }

        server.Com = new connect (address, port, 
            {
                reconnection:      address == "127.0.0.1" ? false : false,                        
                
                onconnectfunction: function (com) {
                    let server = solution.GetServerFromCom(com);
                    let appli  = server.Entity;

                    $('#netprog_root ' + '[nodename=\'' + 'MXApplication:' + appli.Code + '\'] label').first().css('color', '#aeff04');
                    $('#netprog_root ' + '[nodename=\'' + 'MXApplication:' + appli.Code + '\'].treepanel').css('border','1px solid #aeff04');
                  
                  
                    if (!sb.tab_finditem (netprog_bottomtabs, appli.Name)) {
                        let tabitem = {id: appli.Name, item: appli.Name,  type:'link', icon: icon_server,  events: {onclick: "onclick_netprogtabs(event)"}, items: [netprog_server(appli.Code)]}           
                        sb.tab_additem (netprog_bottomtabs, tabitem);
                    }
                    bottompanel_select (netprogplatform, appli.Name)
                  //  sb.tab_select (netprog_bottomtabs,   appli.Name);
                    server.Output.setValue('ok connect')
                    server.Input.setValue('');  

                },

                ondisconnectfunction: function (com, data) {
                    let server = solution.GetServerFromCom(com);
                    let appli  = server.Entity;
                    $('#netprog_root ' + '[nodename=\'' + 'MXApplication:' + appli.Code + '\'] label').first().css('color', '');
                    $('#netprog_root ' + '[nodename=\'' + 'MXApplication:' + appli.Code + '\']').css('border', '');                    
                    server.Output.setValue('couldnt connect')
                    server.Input.setValue('')
                },

                onmessagefunction:    function (com, data) {
                    let server = solution.GetServerFromCom(com);
                    let appli  = server.Entity;                    
                 //   sb.tab_select(netprog_bottomtabs, appli.Name)
                    bottompanel_select (netprogplatform, appli.Name)
                    server.Output.setValue(data)
                },    
                onclosefunction:          function (com, data) {server.Output.setValue('close')},
                onerrorfunction:          function (com, data) {server.Output.setValue('error ' + data)},   
                onupdatefunction:         function (com, data) {server.Output.setValue('update')},
                onconnect_errorfunction:  function (com, data) {server.Output.setValue('onconnect_error')},
                onconnect_failedfunction: function (com, data) {server.Output.setValue('onconnect_failed')},    
            }
        );            
    }
}

function onclick_netprog_server_group (elt, event) {
    let netprog_manager = solution.netprog_CurrentProject.Manager;    
    let servereditor  = $(elt).closest ('.npservereditor');
    let leditorid     = servereditor.attr ('id');
    let serverid      = leditorid.replace ('netprog_server_', '')
    let server        = solution.GetServerFromId(serverid);
    let website       = solution.get('site');    
    if (!serverid) {
        return;
    }

    switch (elt.id) {
        case 'connect_serverjscript':
            let netprogserver = interface_GetEntity (netprog_manager, 'Applications', 'Name', 'local_NetProgServer');
            let servermachine = interface_GetEntity (netprog_manager, 'Machines', 'Name', netprogserver.Machine);
            let conclass      = interface_GetEntity (netprog_manager, 'ConnectionClasses', 'Name', 'Class:NetProgConnection');
            let port          = website.protocol == 'http:' ? 4080 : 4443; //netprogserver.Ports[0];
            let address       = servermachine.AddrName;

            netprogserver.Ports[0] = port;   // update port
            let connection    = interface_GetEntity (netprog_manager, 'Connections', 'Name', 'NetProgConnection');
            if (!connection) { 
                connection    = MXCreateConnection (netprog_manager, 'NetProgConnection', conclass, 'WebNavigator', 'NetProgServer');
            }
            if (connection.Com) {
                if (connection.Com.Socket && connection.Com.Socket.connected == true) {
                    server.Output.setValue('ALREADY CONNECTED').
                    return;
                }
            }
            connection.Com = new connect ( address, port, 
                {
                    onconnectfunction:        function (com, data) {netprog_server_output.setValue('ok connect')},
                    ondisconnectfunction:     function (com, data) {netprog_server_output.setValue('disconnect')},
                    onmessagefunction:        function (com, data) {netprog_server_output.setValue(data)},    
                    onclosefunction:          function (com, data) {netprog_server_output.setValue('close')},
                    onerrorfunction:          function (com, data) {netprog_server_output.setValue('error ' + data)},   
                    onupdatefunction:         function (com, data) {netprog_server_output.setValue('update')},
                    onconnect_errorfunction:  function (com, data) {netprog_server_output.setValue('onconnect_error')},
                    onconnect_failedfunction: function (com, data) {netprog_server_output.setValue('onconnect_failed')},    
                }
                        
            );     
            server.Input.connection = connection;                           
        break;    
        case 'disconnect_serverjscript':
            server.Com.Close();
        break;        
        case 'eval_serverjsscript': 
            server.oneval();
        break;     
        case 'exportlocal_serverjsscript':
            saveAs_LocalFile ('text/javascript', server.Input.getValue())
        break;
        case 'uploadlocal_serverjscript':     
            read_LocalFile('text/javascript', function (file, content) {
                server.Input.setValue(content)
            })
        break;
        case 'exportserver_serverjsscript':
            if (!solution.user.is_registered()) {
                TreatInfo(register_needed_label, 'operationpanel', 'red');            
                return;                
            }                
            sb.modal ({
                id: 'exportserver_filename', 
                header: 'Export File in Workspace', 
                resizable: true,
                body: sb.render ({id: 'export_filename', item: 'File Name', type:'text',   class: "sb_formgroup", value:"script_.js"}),
                footer: 
                    '<button class="sb_mbutton" onclick="onclick_export_file(); ">Save</button>' +
                    '<button class="sb_mbutton" data-bs-dismiss="modal">Cancel</button>',                      
            });  
/*

            sb.overlay({
                rootelt: $('body'),
                keepopen: false,                
                event: event,                  
                pageX: event.pageX,
                pageY: event.pageY + 10,
                html:  sb.render({id: 'script_filename', type: 'html', content: 'filenamepanel()'})
            }); 
*/            
        break;
        case 'uploadserver_serverjscript':  
            let cuser = solution.user;

            if (!cuser.is_registered()) {
                TreatInfo(register_needed_label, 'operationpanel', 'red');            
                return;                
            }        

            let project_folder = solution.netprog_CurrentProject.Folder;
            let file_path      = cuser.fileexplorer.Root + cuser.path  + '/NetProg/' + project_folder  + '/Script_Server/' ;           

            cuser.send({Name: 'scandir_r',Values: [cuser.path  + '/NetProg/' + project_folder  + '/Script_Server', '.']}, false,  function (content, values) {
                let dirstruct = JSON.parse (content);
                let menu = [];
                
                for (var i = 0; i < dirstruct.Values[0].Files.length; i++) {
                    menu.push ({id: i,     text: dirstruct.Values[0].Files[i].Name})
                }
                if (dirstruct.Values[0].Files.length == 0) {
                    return;
                }
                sb.overlay({
                    rootelt: $(elt).closest('.sb_root'),
                    event: event,        
                    pageX:   event.pageX,
                    pageY:   event.pageY + 20,
                    par: menu,
                    onselect:function (elt, par) {
                        console.log ('select')
                        let menu = this.par;
                        cuser.send ({Name: 'readfile', Values: [file_path + menu[elt.id].text]}, false, 
                                    function (content, values) {
                                        let message;    
                                        try {
                                            message = JSON.parse(content);
                                        } catch(e) {
                                            return console.error(e); 
                                        }      
                                        server.Output.setValue(message.Values[0].Content)
             
                                    }, 
                                    []);                          
                    },
                    html: sb.menu (menu)
                })}, 
                [cuser])
        break;        
    }
}

