var netprog_manager = null;
var Interval_netprog_loadproject        = 0;
//---------------------------------------------------------------------MODULE START -----------------------------------------------------------------------------//

function netprog_init () {

// market          
    let ui  = solution.get('ui')     
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 

    netprog_solution();
    //netprog_loadproject ();
    netprog_jsoneditor_init('netprog_jsoneditor');    
    netprog_jseditor_init ('netprog_jseditor_input', 'netprog_jseditor_output');
    netprog_gse_init('gsecanvas_netprog');
    netprog_filemanager_init();

    sidebarpanel_select(netprogplatform, "sidebarpanel_netprogsiteview");   

    setInterval(netprog_timer, 300);     
}

function netprog_end () {
    
}

//---------------------------------------------------------------------MODULE END -----------------------------------------------------------------------------//

function netprog_select (name) {
    let ui  = solution.get('ui')    

// market          
    let marketpanel =  ui.sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        $('#marketpanel').css ('display', 'none')   
    } 

    ui.platform_expand(name, true);

    if (!solution.netprog_CurrentProject) {
        DisplayOperation("Select a project or create one", true, 'operationpanel');        
   //     onclick_sidebarmenu ('sidebar_netprogsiteview', true);    
    }
}

class npproject {
    constructor(pname, name, path) {
        this.pname                   = pname; 
        this.Folder                  = path;    
        this.Name                    = name;
        this.Path                    = path;
        this.Manager                 = null;   
        this.Loaded                  = 0; 
        this.Server                 = solution.NetProgServer_Address;
        this.Port                   = solution.NetProgServer_Port;    
    }
    Create = function () {
        return SubmitProjectRequest('NetProg',this.Folder, this.Name, '', 'php/create_project.php', SYNCHRONE);
    }

    Remove = function () {
        if (solution.UserId == "0") {
            return;        
        }

        return SubmitProjectRequest('NetProg',this.Folder, this.Name, '', 'php/remove_project.php', SYNCHRONE);
    }

    Rename = function (newname) {
        if (solution.UserId == "0") {
            return;            
        }
        return SubmitProjectRequest('NetProg',this.Folder, newname, '', 'php/rename_project.php', SYNCHRONE);
    }
    
    Save = function () {
        if (solution.UserId == "0") {
            DisplayOperation ("Saving not for possible.. Should register", true, 'operationpanel', 'var(--bg-optionterminal)')           
            return;
        }
        let  user           = solution.get('user')   

        let content = JSON.stringify(this.Manager, null, 2)
   
        user.send ({Name: 'savefile', Values: [user.fileexplorer.Root + user.path + "/NetProg/DemoProject/Files/sitemanager.json", content]}, true, 
                function (content, values) {
                    console.log (values[0] + ' saved : ' + content)
                }, 
                ['']);  
       
    }
    Load = function () {
        let  site           = solution.get('site');            
        let  user           = solution.get('user')   

        var rootproject = user.path + '/NetProg/' + this.Folder + "/Files/";
        solution.get_file(site.address + rootproject + 'sitemanager.json', true, this.UpdateSites, [this]);       
    }

    UpdateSites = function (response, par) {
        let project = par[0];
        try {
             project.Manager = JSON.parse(response);
        } catch(e) {
            return console.error(e); 
        }           

// we need to correct the JSON parse structure to have same objects in case of modifying
        MXUpdate (project.Manager);        
        netprog_update(project.Manager);
        project.Loaded = 1;    
        netprog_manager = project.Manager;        
    }
}

function netprog_solution () {

    let  site           = solution.get('site');
    let  user           = solution.get('user')

    solution.netprog_Projects       = [];
    solution.netprog_CurrentProject = null;

    solution.NetprogServers = [];
    solution.NetprogServer_Protocol   = site.protocol;            

    if (site.protocol == 'http:') {  //EMV = 5
        solution.NetprogServer_Address   = site.hostname;    
        solutionNetprogServer_Port     =  4080;     
    }
    else {
        solution.NetprogServer_Address   =  site.hostname;    
        solution.NetprogServer_Port     =  4443;    
    }

    solution.Files   = [];
    solution.Folders = [];
    solution.NPCODE  = 0;

    solution.GetFileFromCName = function (cname) {
        for (var i = 0; i < this.Files.length; i++) {
            if (this.Files[i].CName == cname) return this.Files[i];
        }
        return null;
    }
    solution.GetFolderFromCName = function (cname) {
        for (var i = 0; i < this.Folders.length; i++) {
            if (this.Folders[i].CName == cname) return this.Folders[i];
        }
        return null;
    }    
    solution.GetServerFromName = function (name) {
        for (var i = 0; i < this.NetprogServers.length; i++) {
            if (this.NetprogServers[i].Entity.Name == name) return this.NetprogServers[i];
        }
        return null;
    }    

    solution.GetServerFromCom = function (com) {
        for (var i = 0; i < this.NetprogServers.length; i++) {
            if (this.NetprogServers[i].Com == com) return this.NetprogServers[i];
        }
        return null;
    }    
    solution.GetServerFromMachine = function (machine) {
        for (var i = 0; i < this.NetprogServers.length; i++) {
            if (this.NetprogServers[i].Entity.Machine == machine) return this.NetprogServers[i];
        }
        return null;
    }        
    solution.GetServerFromId  = function (id) {
        for (var i = 0; i < this.NetprogServers.length; i++) {
            if (this.NetprogServers[i].Id == id) return this.NetprogServers[i];
        }
        return null;
    }

    solution.netprog_GetProjectFromName = function (name) {
        for (var i = 0; i < this.netprog_Projects.length; i++) {
            if (this.netprog_Projects[i].Name == name) return this.netprog_Projects[i];
        }
        return null;
    }

    solution.netprog_LoadProjects = function (Id, url, async, interfacecallback, par) {
        
        let param = {
            user_id :  (Id == "0" ? "1" : Id),
            platform_pname: NETPROG_PLATFORM_PNAME,
            platform_folder : 'NetProg'             
        }

        let callback = function (responsetext, values) {
            let arraystructure;    
            try {
                arraystructure = JSON.parse(responsetext);
            } catch(e) {
                return console.error(e); 
            }      

            for (var i = 0; i < arraystructure.length; i++) {
                let projectname = arraystructure[i].name;
                let projectpath = arraystructure[i].path;
                if (values[0].userid == '0' && projectname != netprog_default_projectname) continue;
                solution.netprog_Projects.push(new npproject(NETPROG_PLATFORM_PNAME, projectname, projectpath));
            } 
        }

        url_submit ('POST', url, param /*object {}*/, async, callback, [solution.user] , interfacecallback, par);

    }

    solution.netprog_UpdateProjects = function (solution) {

        let projects = [];
        
        for (var j = 0; j < solution.netprog_Projects.length; j++) {
            let project = solution.netprog_Projects[j];


            projects.push({
                id:'netprog_' + project.Name, type: 'link', item: project.Name, icon: icon_project,
                attributes:{selector: 'netprog_selectproject', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'}, 
                events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}        
            });
            sb.select_additem ('netprog_projectselect', project.Name);        
        }
        sb.tree_additems ('netprog_tree_projects', projects);
       
    }

    solution.netprog_LoadProjects(user.id, site.address + "/php/read_projects.php",  SYNCHRONE, solution.netprog_UpdateProjects, solution);
    return solution;   
}


function netprog_timer () {

    if (solution.netprog_CurrentProject) {        
            $('#netprog_projectsbar #netprog_projectrename').css ('display', '');
            $('#netprog_projectsbar #netprog_projectremove').css ('display', '');
            $('#netprog_projectsbar #netprog_projectcompile').css ('display', '');
            $('#netprog_projectsbar #netprog_projectdistribute').css ('display', '');
            $('#netprog_projectsbar #netprog_projectclose').css ('display', '');
        }
        else {
            $('#netprog_projectsbar #netprog_projectrename').css ('display', 'none');
            $('#netprog_projectsbar #netprog_projectremove').css ('display', 'none');
            $('#netprog_projectsbar #netprog_projectcompile').css ('display', 'none');
            $('#netprog_projectsbar #netprog_projectdistribute').css ('display', 'none');
            $('#netprog_projectsbar #netprog_projectclose').css ('display', 'none');
        }
}

function netprog_home_open (event) {
    let platform =  sb.get(main, 'pname', 'home');
    //    LoaderDisplay(true);
    if (platform.length == 0) {
        solution.add_module('home');               
    } 
  
    let ui  = solution.get('ui')     
    ui.platform_select(HOME_PLATFORM_PNAME)    
    onclick_home_mainbar ($('#home_mainbar_netprog')[0], event)      
}


function netprog_update (manager) {
    netprog_update_localsite(manager);
    netprog_update_localmachine(manager); 

    netprog_siteview_update(manager);
    netprog_gse_update(manager)
    netprog_jsoneditor_update(manager);
    netprog_jseditor_update(manager);
    netprog_filemanager_update();  
    netprog_file_update ();
    netprog_netprogservers_check(manager);    
}

function netprog_loadedproject (project) {
    if (project.Loaded) {
        clearInterval(Interval_netprog_loadproject);
        DisplayOperation("Project " + project.Name + " loaded", true, 'operationpanel');            
        LoaderDisplay(false);         
        netprog_drawproject(project, true);        
    }
  }

function netprog_selectproject(project, forcedisplay) {
  
    if (!project) {
        return null;
    }
    if (project == solution.netprog_CurrentProject) {
        return project;
    }
    
//--- data ui platform update .............
    let ui  = solution.get('ui')       
    solution.netprog_CurrentProject = project;
    ui.platform_updatedata('netprog', solution.netprog_CurrentProject)              

    netprog_initproject()

    if (!project.Loaded) {
        LoaderDisplay(true);        
        DisplayOperation("Loading Project " + project.Name + "  ... Please wait", true, 'operationpanel',  'var(--theme-platform-color)');

        Interval_netprog_loadproject = setInterval(netprog_loadedproject, 300, project); //5 minutes 300000     
        project.Load();
    }
    else {
        DisplayOperation("Project " + project.Name + " loaded", true, 'operationpanel');            
        netprog_drawproject(project, true);        
    }
    return project;
}

function netprog_closeproject (project) {
    if (!project) {
        return;
    }
    
    if (project.ShouldSave) {
        SaveProjectConfirm(project);
    } else {
  
        
    }
   
    if (project == solution.netprog_CurrentProject) {
        netprog_initproject ();    
        netprog_drawproject(project, false);

//--- data ui platform update .............
        let ui  = solution.get('ui')               
        solution.netprog_CurrentProject = null;   
        ui.platform_updatedata('netprog', solution.netprog_CurrentProject)                                 
    }   
    return project;       
 
}

function netprog_initproject () {
    $('#netprog_managersidepanel').addClass('sb_none')    
 //   sb.tab_clear (netprog_maintabs);      
}

function netprog_drawproject(project, open) {
  if (!project) {
      return;
  }
  
  let ui       = solution.get('ui') 
  let platform = ui.platform_get ('name', NETPROG_PLATFORM_NAME);     


  if (open) {
      $("#netprog_projectselect option[value='--Select Project--']").remove();   
      $('#netprog_projectselect option[value="' + project.Name + '"]').prop('selected', true);
      sb.tree_selectitem ('netprog_tree_projects', project.Name);  
      $('#netprog_managersidepanel').removeClass('sb_none')
      sb.box_toggle('netprog_boxmanagerpanel', true);

  } else {
      solution.netprog_CurrentProject = null; 
      $("#netprog_projectselect option").eq(0).before($('<option>', {value: '--Select Project--', text: '--Select Project--'}));
      $("#netprog_projectselect option[value='--Select Project--']").prop('selected', true);
      sb.tree_selectitem ('netprog_tree_projects', '');
      BottomPanel_Flat(platform, true, true);         

      AnimationDisplay('netprog', 'Goodbye', 'netprog_toppanel');             
  }    
}

function onchange_netprog_projectselect (elt, event) {
    let projectname= $('#' + elt.id + ' option:selected').val();
    let project = solution.netprog_GetProjectFromName(projectname);
    if (project == solution.netprog_CurrentProject) return;
    netprog_selectproject(project);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

function netprog_update_localsite (manager) {

   
    let localsite = interface_GetEntity( manager, 'Sites', 'Name', 'Local');
    if (!localsite) {
        console.log ('local site not existent')
        return;
    }
    url_submit ('GET', 'http://www.geoplugin.net/json.gp?ip=', {} , false, 
        function(content, values) {
            values[0].Information = JSON.parse (content); 
            values[0].IPPublic = values[0].Information.geoplugin_request;
            return values[0].IPPublic
        },
        [localsite]); 

    url_submit ('GET', document.location.protocol + '//' + document.location.host + '/php/get_dname.php',{ipaddress: localsite.IPPublic} , false, 
        function (content, values) {
            localsite.AddrName = content.replace(/[\t\r\n]/gm, '');
        },
        []);      
}

function netprog_update_localmachine (manager) {
    let localmachine        = interface_GetEntity(manager, 'Machines', 'IPAddress', '127.0.0.1');
    if (!localmachine) {
        console.log ('local machine not existent')
        return;
    }

    getIPLocal(localmachine);
    getUserIP(onip, localmachine);

}

function netprog_loadproject () {
    let site = solution.get('site');

    netprog_manager = MXCreateManager ('netprog_manager') ;
    MXAssignDefaultDialogs (netprog_manager, DialogClasses)    
    
    let manager = netprog_manager;

    var localsite           = MXCreateSite (manager, 'Local');
    
    
    url_submit ('GET', 'http://www.geoplugin.net/json.gp?ip=', {} , false, 
        function(content, values) {
            values[0].Information = JSON.parse (content); 
            values[0].IPPublic = values[0].Information.geoplugin_request;
            return values[0].IPPublic
        },
        [localsite]); 

    url_submit ('GET', site.protocol + '//' + document.location.host + '/php/get_dname.php',{ipaddress: localsite.IPPublic} , false, 
        function (content, values) {
            localsite.AddrName = content.replace(/[\t\r\n]/gm, '');
        },
        []);  

    var localmachine        = MXCreateMachine (manager, 'localmachine', window.navigator.platform, '127.0.0.1', 'localhost', localsite); 


    getIPLocal(localmachine);
    getUserIP(onip, localmachine);

    //  url_submit ('GET', 'http://www.geoplugin.net/json.gp?ip=', {} , false, getMachineInfo, [localmachine]); 
    //  url_submit ('GET', 'http://' + document.location.host + '/php/get_info.php', {ipaddress: localmachine.IPAddress} , false, getMachineInfo, [localmachine]); 
    //  url_submit ('GET', 'http://' + document.location.host + '/php/get_dname.php',{ipaddress: localmachine.IPAddress} , false, getDname, [localmachine]); 

    // WEB NAVIGATOR

    var webnavigatorclass   = MXCreateApplicationClass (manager, "Class:WebNavigator", MXApplicationClass_NetType.CLIENT, MXApplicationClass_Type.EXTERNAL);
    var webnavigator        = MXCreateApplication (manager, webnavigatorclass, 'WebNavigator', localmachine)    
    webnavigator.Cookies    = decodeURIComponent(document.cookie);
    webnavigator.Information = document;

    // WEB SERVER
    var webservermachine;
    var webserverclass;  
    var webserver ;
    var localip;
    if (document.location.host == '127.0.0.1' || document.location.host == 'localhost') {                //check if web server running on local machine
        webserverclass      = MXCreateApplicationClass (manager, "Class:WebServer", MXApplicationClass_NetType.SERVER, MXApplicationClass_Type.EXTERNAL);
        webserver           = MXCreateApplication (manager, webserverclass, 'WebServer', localmachine);
        webservermachine    = localmachine;
    } else {
        var website  = MXCreateSite (manager, 'Web Site');
        var ip = url_submit ('GET', 'http://' + document.location.host + '/php/get_info.php', {} , false, function(content, values) {values[0].Information = JSON.parse (content); values[0].IPPublic = values[0].Information.geoplugin_request; return values[0].IPPublic}, [website]); 
        
        var webservermachine = interface_GetEntity(netprog_manager, 'Machines', 'IPAddress', ip);    
        if (!webservermachine) {
            webservermachine = MXCreateMachine (manager, 'Web Machine', 'Win32', ip, '', website); 
        } 
        webserverclass  = MXCreateApplicationClass (manager, "Class:WebServer", MXApplicationClass_NetType.SERVER, MXApplicationClass_Type.EXTERNAL);
        webserver       = MXCreateApplication (manager, webserverclass, 'WebServer', webservermachine);
        url_submit ('GET', site.protocol + '//' +  document.location.host + '/php/get_dname.php',{ipaddress: webservermachine.IPAddress} , false, getDname, [manager, webservermachine]);                 
    }   
    let csite = solution.get('site')
    
    webserver.Ports = [csite.port];
    webserver.Repertory = csite.host;

    // Database WEB SERVER

    var webdatabaseclass   = MXCreateDatabaseClass (manager, "Class:WebDatabase", MXDatabaseClass_Type.MYSQL, MXApplicationClass_Type.EXTERNAL);
    var webdatabase        = MXCreateDatabase (manager, webdatabaseclass, 'WebDatabase', webservermachine)    
    webdatabase.Ports      = [3306];

    // MT4 Machine

    var serversite          = MXCreateSite (manager, 'Amen VM');    
    var servermachine       = MXCreateMachine (manager, 'VP Machine', MXMachine_System.WIN32, '217.112.89.92', '', serversite);   
    url_submit ('GET', 'http://' + document.location.host + '/php/get_info.php', {ipaddress: servermachine.IPAddress} , false, getMachineInfo, [manager, servermachine]);
    url_submit ('GET', 'http://' + document.location.host + '/php/get_dname.php',{ipaddress: servermachine.IPAddress} , false, getDname, [manager, servermachine]);      

    servermachine.AddrName = 'mt4server.jurextrade.com'
    // EMV Client

    //local
    let emvclientclass          = MXCreateApplicationClass (manager, "Class:EMVClient",  MXApplicationClass_NetType.CLIENT, MXApplicationClass_Type.INTERNAL);
    let emvclient               = MXCreateApplication (manager, emvclientclass, 'EMVClient', localmachine)    
    emvclient.Repertory         = 'C:/PROJECTS/EMV/Client';
    emvclient.ExecRepertory     = 'C:/PROJECTS/EMV/Client/Debug';
    emvclient.ExecCommand       = 'Client.exe';
    emvclient.ExecParameters    = '127.0.0.1 127.0.0.1 127.0.0.1';    // router emvserver loginserver
    emvclient.Language          = 'C';        
    //local

    // EMV Server

    //distant
    let emvserverclass          = MXCreateApplicationClass (manager, "Class:EMVServer",  MXApplicationClass_NetType.SERVER, MXApplicationClass_Type.INTERNAL);
    let emvserver               = MXCreateApplication (manager, emvserverclass, 'EMVServer', servermachine)    
    emvserver.Ports             = [2000];
    emvserver.Repertory         = 'C:/EMV/libemv-master';
    emvserver.ExecRepertory     = 'C:/EMV/libemv-master/Debug';
    emvserver.ExecCommand       = 'libemv.exe';
    emvserver.ExecParameters    = '';    
    emvserver.Language          = 'C';      

    //local
    emvserver                   = MXCreateApplication (manager, emvserverclass, 'local_EMVServer', localmachine)    
    emvserver.Ports             = [2000];
    emvserver.Repertory         = 'C:/PROJECTS/EMV/libemv-master';
    emvserver.ExecRepertory     = 'C:/PROJECTS/EMV/libemv-master/Debug';
    emvserver.ExecCommand       = 'libemv.exe';
    emvserver.ExecParameters    = '127.0.0.1 127.0.0.1';        // router loginserver
    emvserver.Language          = 'C';      
    // MT4 Server
    let mt4serverclass          = MXCreateApplicationClass (manager, "Class:MT4Server",  MXApplicationClass_NetType.SERVER, MXApplicationClass_Type.INTERNAL);

    //distant
    let mt4server               = MXCreateApplication (manager, mt4serverclass, 'MT4Server', servermachine)    
    mt4server.Ports             = [2007, 2008, 2080, 2443];
    mt4server.Repertory         = 'C:/newweb/Servers/MT4Server';
    mt4server.ExecRepertory     = 'C:/newweb/Server/MT4Server';
    mt4server.ExecCommand       = 'node';
    mt4server.ExecParameters    = 'MT4Server.js';    
    //local
    mt4server                   = MXCreateApplication (manager, mt4serverclass, 'local_MT4Server', localmachine)    
    mt4server.Ports             = [2007, 2008, 2080, 2443];
    mt4server.Repertory         = 'C:/PROJECTS_CROSS/MT4Progress/newweb/Servers/MT4Server';
    mt4server.ExecRepertory     = 'C:/PROJECTS_CROSS/MT4Progress/newweb/Servers/MT4Server';
    mt4server.ExecCommand       = 'node';
    mt4server.ExecParameters    = 'MT4Server.js';


    // NetProg Server
    let netprogserverclass      = MXCreateApplicationClass (manager, "Class:NetProgServer",  MXApplicationClass_NetType.SERVER, MXApplicationClass_Type.INTERNAL);
    //distant
    let netprogserver           = MXCreateApplication (manager, netprogserverclass, 'NetProgServer', servermachine)    
    netprogserver.Ports         = [4080,4443];
    netprogserver.Repertory     = 'C:/Servers';
    netprogserver.ExecRepertory = 'C:/Servers';
    netprogserver.ExecCommand   = 'node';
    netprogserver.ExecParameters= 'NetProgServer.js';
    //local
    netprogserver               = MXCreateApplication (manager, netprogserverclass, 'local_NetProgServer', localmachine)    
    netprogserver.Ports         = [4080,4443];
    netprogserver.Repertory     = 'C:/PROJECTS_CROSS/MT4Progress/newweb/Servers';
    netprogserver.ExecRepertory = 'C:/PROJECTS_CROSS/MT4Progress/newweb/Servers';
    netprogserver.ExecCommand   = 'node';
    netprogserver.ExecParameters= 'NetProgServer.js';

    //EMVRouter Server
    let emvrouterclass              = MXCreateApplicationClass (manager, "Class:EMVRouter",  MXApplicationClass_NetType.SERVER, MXApplicationClass_Type.INTERNAL);   
    //distant
        let emvrouter               = MXCreateApplication (manager, emvrouterclass, 'EMVRouter', servermachine)    
        emvrouter.Ports             = [5080,5443];
        emvrouter.Repertory         = 'C:/Servers';
        emvrouter.ExecRepertory     = 'C:/Servers';
        emvrouter.ExecCommand       = 'node';
        emvrouter.ExecParameters    = 'EMVRouter.js';
    
    //local
    emvrouter                   = MXCreateApplication (manager, emvrouterclass, 'local_EMVRouter', localmachine)    
    emvrouter.Ports             = [5080,5443];
    emvrouter.Repertory         = 'C:/PROJECTS_CROSS/MT4Progress/newweb/Servers';
    emvrouter.ExecRepertory     = 'C:/PROJECTS_CROSS/MT4Progress/newweb/Servers';
    emvrouter.ExecCommand       = 'node';
    emvrouter.ExecParameters    = 'EMVRouter.js';

    let netprogserverconnectionclass = MXCreateConnectionClass (manager, "Class:NetProgConnection", IPPROTO_HTTP, 'Class:WebNavigator', 'Class:NetProgServer');
  // manager.Sites.push(netprog_gse_push, netprog_siteview_push);

    let content = JSON.stringify(netprog_manager, null, 2)
    let cuser = solution.get('user')
   
    cuser.send ({Name: 'savefile', Values: [cuser.fileexplorer.Root + cuser.path + "/NetProg/DemoProject/Files/sitemanager.json", content]}, true, 
                function (content, values) {
                    console.log (values[0] + ' saved : ' + content)
                }, 
                ['netprog.ini']);  
    return manager;
}


//------------------------------------------------------------ PROJECT FILE BAR ----------------------------------------------------------

function onclick_netprog_projectclose () {
    OnCloseProject (solution.netprog_CurrentProject, netprog_closeproject, solution.netprog_CurrentProject);
}

function onclick_netprog_projectcreate () {
  //  OnNewProject ();
}

function onclick_netprog_projectrename () {
   // OnRenameProject (RenameProject, solution.CurrentProject);
}

function onclick_netprog_projectremove() {
    OnRemoveProject (netprog_RemoveProject, solution.netprog_CurrentProject);
}


function netprog_RemoveProject (project) {
    if (!project) return;

    let cuser = solution.get('user')
    
    if (!cuser.is_registered()) {
        TreatOperation(register_needed_label, 'operationpanel', 'red');      
        return;
    }
    if ($('#emv_projectsbar .box-btn-slide').hasClass('rotate-180'))    
        $('#emv_projectsbar #slide').click ();   

    var returnvalue = project.Remove ();
    if (returnvalue != -1) {

        sb.tree_removeitem('netrog_tree_projects', project.Name);
        sb.select_removeitem('netprog_projectselect', project.Name);

        if (project == solution.netprog_CurrentProject) 
            netprog_closeproject(project);    
    }
}

function onclick_netprog_projectcompile() {
    //SelectCompileProject(solution.CurrentProject, 'C');
}

function onclick_netprog_projectdistribute() {

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------


const netprog_type_leaf = ['MXApplication', 'MXApplicationClass', 'MXDatabase', 'MXDatabaseClass', 'MXJournal', 'MXJournalClass' ,
                           'MXQueue', 'MXQueueClass',  'MXConnection', 'MXConnectionClass', 'MXDialogClass', 'MXMessageClass', 'MXObject'];


function netprog_iconfromclass (type) {
    switch (type) {
        case 'MXManager':             return icon_manager;
        case 'MXSite':                return icon_site;
        case 'MXMachine':             return icon_machine;
        case 'MXApplication':         return icon_application;
        case 'MXDatabase':            return icon_database;
        case 'MXjournal':             return icon_journal;
        case 'MXQueue':               return icon_queue;
        case 'MXConnection':          return icon_connection;  
        case 'MXApplicationClass':    return icon_application;
        case 'MXDatabaseClass':       return icon_database;
        case 'MXjournalClass':        return icon_journal;
        case 'MXQueueClass':          return icon_queue;
        case 'MXConnectionClass':     return icon_connection;   
        case 'MXDialogClass':         return icon_terminal;       
        case 'MXMessageClass':        return icon_terminal;                 
        case 'MXObject':              return icon_terminal;                 
        break;    
    }
}

function netprog_classfromtype (type) {
    switch (type) {
        case 'manager':             return 'MXManager';
        case 'site':                return 'MXSite';
        case 'machine':             return 'MXMachine';
        case 'application':         return 'MXApplication';
        case 'database':            return 'MXDatabase';
        case 'journal':             return 'MXjournal';
        case 'queue':               return 'MXQueue';
        case 'connection':          return 'MXConnection';  
        case 'capplication':        return 'MXApplicationClass';
        case 'cdatabase':           return 'MXDatabaseClass';
        case 'cjournal':            return 'MXjournalClass';
        case 'cqueue':              return 'MXQueueClass';
        case 'cconnection':         return 'MXConnectionClass';   
        case 'cdialog':             return 'MXDialogClass';    
        case 'cmessageclass':       return 'MXMessageClass';       
        case 'object':              return 'MXObject'          
        break;    
    }
}

function netprog_typefromclass (classname) {
    switch (classname) {
        case 'MXManager':                       return 'manager';    
        case 'MXSite':                          return 'site';       
        case 'MXMachine':                       return 'machine';    
        case 'MXApplication':                   return 'application';
        case 'MXDatabase':                      return 'database';   
        case 'MXjournal':                       return 'journal';    
        case 'MXQueue':                         return 'queue';      
        case 'MXConnection':                    return 'connection'; 
        case 'MXApplicationClass':              return 'capplication';
        case 'MXDatabaseClass':                 return 'cdatabase';  
        case 'MXjournalClass':                  return 'cjournal';   
        case 'MXQueueClass':                    return 'cqueue';     
        case 'MXConnectionClass':               return 'cconnection';
        case 'MXDialogClass':                   return 'cdialog';        
        case 'MXMessageClass':                  return 'cmessageclass';    
        case 'MXObject':                        return 'object';                 
        break;    
    }
}
function netprog_entityfatherclass (entity) {
   // return netprog_classfromtype (type) + 's';
    switch (entity) {
        case 'MXManager':             return '';
        case 'MXSites':               return 'Manager';        
        case 'MXSite':                return 'Sites';
        case 'MXMachine':             return 'Machines';
        case 'MXApplication':         return 'Applications';
        case 'MXDatabase':            return 'Databases';
        case 'MXjournal':             return 'journals';
        case 'MXQueue':               return 'Queues';
        case 'MXConnection':          return 'Connections';  
        case 'MXApplicationClass':    return 'ApplicationClasses';
        case 'MXDatabaseClass':       return 'DatabaseClasses';
        case 'MXjournalClass':        return 'journalClasses';
        case 'MXQueueClass':          return 'QueueClasses';
        case 'MXConnectionClass':     return 'ConnectionClasses';   
        case 'MXDialogClass':         return 'DialogClasses';  
        case 'MXMessageClass':        return 'MessageClasses';   
        case 'MXObject':              return 'Objects';                    
        break;  
        default:
            return 'MXManager';  
    }
}

function netprog_siteview_push (array, entity) {
    let classname       = entity.ClassName; //.substring(2);  //get off with MX
    let fatherclasstype = array.NodeName;

    let nodeitem  = netprog_treenodeitem(entity, false);
    let panelitem = netprog_treepanelitem(netprog_manager, entity, classname, classname + ':' + entity.Code, true);
    let id        = netprog_idfromnodename(fatherclasstype)


    sb.tree_additem (id, nodeitem);
    sb.tree_additem (nodeitem.id, panelitem);
}
                           

function netprog_treenodeitem (entity, closed) {
    
    let classname       = entity.ClassName; 
    let nodename        = classname + ':' + entity.Code;

    return {
        id:   'treenode-' + classname + '-' + entity.Code,
        type: 'tree',
        item: entity.Name , 
        arrow: netprog_type_leaf.includes (classname) ? false : true,
        class: 'treenode',
        rootitem: netprog_tree_update,
        closed:  closed,
        icon: netprog_iconfromclass (classname),
        items:[],        
        attributes:{
                    nodename: nodename,
                    draggable: true
        },
        events: netprog_default_node_events   
    }    
}

function netprog_panelfyentity (fatherentity, fieldname, name){

    
    let entity = interface_GetEntity(fatherentity, fieldname, 'Name', name);         
  
    return sb.panelfyobject(entity)
}

function netprog_treepanelitem (fatherentity, entity, hidden) {

    let classname       = entity.ClassName; 
    let nodename        = classname + ':' + entity.Code;
    
    let fatherclasstype = netprog_entityfatherclass(classname);

    return {
        id: 'treepanel-' + classname + '-' + entity.Code,
        type: 'panel',
        items: [sb.panel_object(entity)],                           //'netprog_panelfyentity ("' + fatherentity + '", "' + fatherclasstype + '", "' +  entity.Name + '")',
        class: 'treepanel',
        events: {onclick: "event.stopPropagation()"},        
        style: defined(hidden) ? (hidden == true ? 'display:none' : '') : '',
        attributes:{nodename: nodename},
    }    
}

function ondragstart_netprog_treenode (elt, event) {
    var nodename = $(elt).attr("nodename");  
    event.dataTransfer.setData("text/plain", nodename);
}

function netprog_closebargroup (elt) {

    let tree        = elt.closest ('.sb_tree')
    let spans       = tree.find('.treenode').find('span.sb_link:first')
    for (var i = 0; i < spans.length; i++) {
        let elt = $(spans[i]);
        let nodename = elt.attr('nodename');
        let node  = netprog_entityfromnodename(nodename);

        let fieldname = node.field;
        let entity    = node.object;
        let type      = node.type;
        let nodetype  = node.nodetype;     
        if (netprog_type_leaf.includes (nodetype)) {
            elt.find('#tree_delete_entity').css ('display', 'none')   
        } else {
            elt.find('#netprog_tree_update').css ('display', 'none')  
        }        
    }   
} 

function netprog_adjustbargroup (elt, open) {
    let treeref = elt.closest ('.treeref')
    while (treeref.length != 0) {
        let elt = treeref.closest('.sb_tree')
        let fatherspan = elt.find('.sb_link:first');
        let nodename = fatherspan.attr('nodename');
        let node  = netprog_entityfromnodename(nodename);

        let fieldname = node.field;
        let entity    = node.object;
        let type      = node.type;
        let nodetype  = node.nodetype;     
        if (open) {
            if (netprog_type_leaf.includes (nodetype)) {
                fatherspan.find('#tree_delete_entity').css ('display', 'flex')   
            } else {
                fatherspan.find('#netprog_tree_update').css ('display', '')  
            }          
        } else {
            if (netprog_type_leaf.includes (nodetype)) {
                fatherspan.find('#tree_delete_entity').css ('display', 'none')   
            } else {
                fatherspan.find('#netprog_tree_update').css ('display', 'none')  
            }          
        }        
        treeref = elt.closest ('.treeref');                                  
    }                  
}

function netprog_selecttreepanel (nodename) {
    $('#treenode-manager-0').closest ('.sb_tree').find('.treepanel').removeClass ('selected')
    if (!nodename) {
        return;
    }    
    let node  = netprog_entityfromnodename(nodename);
    let fieldname = node.field;
    let entity    = node.object;
    let type      = node.type;
    let nodetype  = node.nodetype;

    if (nodetype == 'Manager') {
        return;
    }

    let elt       = $('[nodename=\'' + nodename + '\'].sb_link'); 
    let eltid     = elt.attr('id');  
    let panelid   = eltid.replace ('treenode', 'treepanel');
    $('#' + panelid).addClass ('selected')    
}

function netprog_showtreepanel (nodename) {
    let node  = netprog_entityfromnodename(nodename);
    let fieldname = node.field;
    let entity    = node.object;
    let type      = node.type;
    let nodetype  = node.nodetype;

    if (nodetype == 'Manager') {
        return;
    }

    let elt       = $('[nodename=\'' + nodename + '\'].sb_link'); 
    let eltid     = elt.attr('id');
    let eltname   = $(elt).find('.sb_label').html();    

    let group  = elt.find('#netprog_tree_update');  
    let closed    = $('#' + eltid + '_ref').hasClass("closed") ? true : false;

    let panelid   = eltid.replace ('treenode', 'treepanel');

    if (entity == NULL) {
        console.log ('onclick_netprog_treenode : Error in nodename : ' + nodename);
        return;
    }

    sb.tree_selectitem ('treenode-manager-0', eltname);
    netprog_adjustbargroup(elt, true)
       

    if (netprog_type_leaf.includes (nodetype)) {
        if (closed) {
            group.find('#tree_delete_entity').css ('display', 'flex')   
            sb.tree_open(elt.attr('id'))                 
        } else {
            return;
            group.find('#tree_delete_entity').css ('display', 'none') 
        }
    } else {
        if (closed) {
            group.css('display','')
            sb.tree_open(elt.attr('id'))               
        } else {
//            return;
//            group.css('display','none')
        }        
        let hidden      =  $('#' + panelid).css ('display') == 'none' ? true : false;          
        if (hidden) {
            $('#' + panelid).css ('display', 'block')
            $(group).find('#tree_delete_entity').css ('display', 'flex')        
        } else {
            return;
            $('#' + panelid).css ('display', 'none')
            $(group).find('#tree_delete_entity').css ('display', 'none') 
        }        
    }    
}

function onclick_netprog_treenode (elt, event) {
    let nodename = $(elt).attr("nodename");  
    let eltname = $(elt).find('.sb_label').html();
    
    sb.tree_selectitem ('treenode-manager-0', eltname);   
    
    let node  = netprog_entityfromnodename(nodename);
    let fieldname = node.field;
    let entity    = node.object;
    let type      = node.type;
    let nodetype  = node.nodetype;

    if (entity == NULL) {
        console.log ('onclick_netprog_treenode : Error in nodename : ' + nodename);
        return;
    }
    
    let group  = $(elt).find('#netprog_tree_update');  
    let closed = $('#' + elt.id + '_ref').hasClass("closed") ? true : false;

    if (netprog_type_leaf.includes (nodetype)) {
   
        if (closed) {
            group.find('#tree_delete_entity').css ('display', 'flex')        
        } else {
            group.find('#tree_delete_entity').css ('display', 'none') 
        }
    } else {
        group.css('display', closed ? '' : 'none')
    }

    netprog_jsoneditor_update(entity);
}
    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function onclick_netprog_header (elt, event) {
    if (!sb.tab_finditem(netprog_maintabs, 'netprog_siteview_tab')) { 
        filetabitem    =     {id: 'netprog_siteview_tab', item: 'Site View', type:'link', icon:  icon_siteview,   items: [netprog_siteview_topbarmenu, netprog_gse_main],   onclose: 'onclick="onclick_netprog_tab_close(this, event)"',    title: 'Scenario',  events: {onclick:"onclick_netprog_tab(this, event)"}},           
        sb.tab_additem(netprog_maintabs, filetabitem);
    } 
    sb.tab_select(netprog_maintabs, 'netprog_siteview_tab');
    netprog_gse_editor.Refresh();      
}

function netprog_siteview_update (manager) {
    let hidden = true;

    for (var j = 0; j < interface_ArrayLength(manager.Sites); j++) {
        var site      = manager.Sites[j]; 
       
        var siteitem  = netprog_treenodeitem(site, false);
        var panelitem = netprog_treepanelitem(manager, site, hidden);

        sb.tree_additem ('treenode-sites-1', siteitem);
        sb.tree_additem (siteitem.id, panelitem);

        for (var i= 0; i < interface_ArrayLength(site.Machines); i++) {
            var machine   = site.Machines[i];

            var machineitem  = netprog_treenodeitem(machine, false);
            var panelitem    = netprog_treepanelitem(manager, machine, hidden);

            sb.tree_additem (siteitem.id, machineitem);
            sb.tree_additem (machineitem.id, panelitem);

            for (var k= 0; k < interface_ArrayLength(machine.Applications); k++) {
                var application =  machine.Applications[k];
                var nodeitem    =  netprog_treenodeitem(application, true);
                var panelitem   =  netprog_treepanelitem(manager, application, false);                
                
                sb.tree_additem (machineitem.id, nodeitem);
                sb.tree_additem (nodeitem.id, panelitem);
            }    

            for (var k= 0; k < interface_ArrayLength(machine.Databases); k++) {
                var database  = machine.Databases[k];
                var nodeitem  = netprog_treenodeitem(database, true);
                var panelitem = netprog_treepanelitem(manager, database, false);                
                
                sb.tree_additem (machineitem.id, nodeitem);
                sb.tree_additem (nodeitem.id, panelitem);
            }    
        }        
    }
    for (var j = 0; j < interface_ArrayLength(manager.ApplicationClasses); j++) {
        var applicationclass = manager.ApplicationClasses[j];
        var nodeitem  = netprog_treenodeitem(applicationclass, true);   
        var panelitem = netprog_treepanelitem(manager, applicationclass, false);
        sb.tree_additem ('treenode-capplications-8', nodeitem);
        sb.tree_additem (nodeitem.id, panelitem);    
    }

    for (var j = 0; j < interface_ArrayLength(manager.DatabaseClasses); j++) {
        var databaseclass = manager.DatabaseClasses[j];
        var nodeitem  = netprog_treenodeitem(databaseclass, true)
        var panelitem = netprog_treepanelitem(manager, databaseclass, false);
        sb.tree_additem ('treenode-cdatabases-9', nodeitem);
        sb.tree_additem (nodeitem.id, panelitem); 
    }
    for (var j = 0; j < interface_ArrayLength(manager.ConnectionClasses); j++) {
        var connectionclass = manager.ConnectionClasses[j];
        var nodeitem  = netprog_treenodeitem(connectionclass, true)
        var panelitem = netprog_treepanelitem(manager, connectionclass, false);
        sb.tree_additem ('treenode-cconnections-12', nodeitem);
        sb.tree_additem (nodeitem.id, panelitem); 
    }
    for (var j = 0; j < interface_ArrayLength(manager.DialogClasses); j++) {
        var dialogclass = manager.DialogClasses[j];
        var dialogitem  = netprog_treenodeitem(dialogclass, true)
        var panelitem   = netprog_treepanelitem(manager, dialogclass, false);

        sb.tree_additem ('treenode-cdialogs-13', dialogitem);
        sb.tree_additem (dialogitem.id, panelitem); 
        
        for (var i= 0; i < interface_ArrayLength(dialogclass.MessageClasses); i++) {
            var messageclass = dialogclass.MessageClasses[i];
            var messageitem  = netprog_treenodeitem(messageclass, true);
            var panelitem    = netprog_treepanelitem(manager.DialogClasses[j], messageclass, false);

            sb.tree_additem (dialogitem.id, messageitem);
            sb.tree_additem (messageitem.id, panelitem);
/*            
            for (var k= 0; k < interface_ArrayLength(message.Objects); k++) {
                var object      =  message.Objects[k];
                var objectitem  =  netprog_treenodeitem(object,  'Object', 'Object:' + object.Code, false);
                var panelitem   =  netprog_treepanelitem('netprog_manager.DialogClasses[' + j + '].MessageClasses[' + i + ']', object, 'Object', 'Object:' + object.Code, hidden);                
                
                sb.tree_additem (messageitem.id, objectitem);
                sb.tree_additem (objectitem.id, panelitem);
            }    
*/            
        }    
    }
/*
    var menu = [];
    for (var j = 0; j < interface_ArrayLength(manager.Databases); j++) {
        var database = manager.Databases[j];
        menu.push(netprog_treenodeitem(database, 'Database', 'Database:' + database.Code));
    }
    sb.tree_additems ('treenode-databases-4', menu);     

    menu = [];
    for (var j = 0; j < interface_ArrayLength(manager.Machines); j++) {
        var machine = manager.Machines[j];
        sb.tree_additem ('treenode-machines-2', netprog_treenodeitem(machine, 'Machine', 'Machine:' + machine.Code, true));
//        sb.select_additem ('connect_machine', machine.IPAddress);           
    }
        
    menu = [];
    for (var j = 0; j < interface_ArrayLength(manager.Applications); j++) {
        var application = manager.Applications[j];
        menu.push(netprog_treenodeitem(application, 'Application', 'Application:' + application.Code, true));
    }
    sb.tree_additems ('treenode-applications-3', menu);    
    */
}
/*
function Application_Launch (name){     

    console.log ('Launch application')
    let netprogappli  = interface_GetEntity (netprog_manager, 'Applications', 'Name', name);
    let servermachine = interface_GetEntity (netprog_manager, 'Machines',     'Name', netprogappli.Machine);       
    let port          = netprogappli.Ports[0];
    let address       = servermachine.IPAddress;
    let server        = solution.GetServerFromMachine(netprogappli.Machine);
    
    let execrepertory = netprogappli.ExecRepertory;
    let execcommand   = netprogappli.ExecCommand;
    let execparameters= netprogappli.ExecParameters;
    let repertory     = netprogappli.Repertory;
 
    let command = 
    `process.chdir('${repertory}')
    require('child_process').exec('start cmd.exe /K ${execrepertory + '/' + execcommand} ${execparameters}')`
    
    server.sendmessage (command)
}
*/

function Application_Launch (name){     

    console.log ('Launch application')
    let netprogappli  = interface_GetEntity (netprog_manager, 'Applications', 'Name', name);
    let servermachine = interface_GetEntity (netprog_manager, 'Machines',     'Name', netprogappli.Machine);       
    let port          = netprogappli.Ports[0];
    let address       = servermachine.IPAddress;
    let server        = solution.GetServerFromMachine(netprogappli.Machine);
    
    let execrepertory = netprogappli.ExecRepertory;
    let execcommand   = netprogappli.ExecCommand;
    let execparameters= netprogappli.ExecParameters;
    let repertory     = netprogappli.Repertory;
    let language      = netprogappli.Language;
    let command       =``;

    if (language == 'Javascript') {
        command =  `process.chdir('${execrepertory}') 
        require('child_process').exec('start cmd.exe /K ${execcommand} ${execparameters}')`
    } else {
        command =  `process.chdir('${repertory}') 
        require('child_process').exec('start cmd.exe /K ${execrepertory + '/' + execcommand} ${execparameters}')`
    }    
    server.sendmessage (command)
}

//---------------------------------------------------- NETPROG TABS AND  MENU  --------------------------------------------------------   

const MENU_SITEVIEW_LAUNCH_ID     = 1;
const MENU_SITEVIEW_NEWMACHINE_ID = 2;


function oncontextmenu_netprog_treenode (elt, event) {

    let nodename        = $(elt).attr("nodename");  
    let node            = netprog_entityfromnodename(nodename);
    let type            = node.type;   // Object or Field
    let entity          = node.object;
    let nodetype        = node.nodetype;
    let fathernodetype  = node.fathernodetype
    let fieldname       = node.field;

    if (entity == NULL) {
        console.log ('oncontextmenu_netprog_treenode: Error in nodename : ' + nodename);
        return;
    }
    
    var menu = [];

    switch (nodetype) {
        case 'MXManager':             return '';
        case 'MXSites':               return 'Manager';        
//        case 'Site':                return 'Sites';
        case 'MXMachine':             return 'Machines';
//        case 'Application':         return 'Applications';
        case 'MXDatabase':            return 'Databases';
        case 'MXjournal':             return 'journals';
        case 'MXQueue':               return 'Queues';
        case 'MXConnection':          return 'Connections';  
        case 'MXApplicationClass':    return 'ApplicationClasses';
        case 'MXDatabaseClass':       return 'DatabaseClasses';
        case 'MXjournalClass':        return 'journalClasses';
        case 'MXQueueClass':          return 'QueueClasses';
        case 'MXConnectionClass':     return 'ConnectionClasses';   
        case 'MXDialogClass':         return 'DialogClasses';  
        case 'MXMessageClass':        return 'MessageClasses';   
        case 'MXObject':              return 'Objects';                    
        break;          
        
        case 'MXApplication' :
            var machine = interface_GetEntity(netprog_manager, 'Machines', 'Name', entity.Machine);  
            if (machine == NULL) {
                return;
            }
            switch (entity.Type) {
                case MXApplicationClass_Type.INTERNAL :
                break;
                case MXApplicationClass_Type.EXTERNAL :
                break;
            }

            switch (entity.NetType) {
                case MXApplicationClass_NetType.SERVER :
                    if (!defined(entity.Ports) || entity.Ports.length == 0) {
                        return;  
                    }
                break;
            }
            menu.push ({id: MENU_SITEVIEW_LAUNCH_ID,     text: "Launch",   tooltip : 'Launch Application'});
        break;    
        case 'MXSite' :
            menu.push ({id: MENU_SITEVIEW_NEWMACHINE_ID, text: "New Machine",    tooltip : 'New Machine'});
        break;     
        default:
            return;          
    }
    
    sb.overlay({
        rootelt: $(elt).closest('.sb_root'),
        event: event,        
        pageX:   event.pageX,
        pageY:   event.pageY + 20,
        par : entity,

        onselect:function (elt, par) {
       
            let entity = this.par;    
            switch (parseInt(elt.id)) {
                case MENU_SITEVIEW_LAUNCH_ID :
                    Application_Launch (entity.Name)
                break;
                case MENU_SITEVIEW_NEWMACHINE_ID:
                    var machine = MXCreateMachine (netprog_manager, 'newmachine', 'Win32', '', '');
          //          netprog_vue_data.netprog_vue_manager.Machines.push (machine);   
                break;
                case 'Connect':
                    var host = machine.IPAddress;
                    var port = entity.Ports[0];                    
                    Connect(entity, host, port);
                break;
            }          
        },
        html: sb.menu (menu)
    });  
}
//////////////////////////////////////////////////////////////// PANEL BAR ///////////////////////////////////////////////////////

var new_entity = null;

function netprog_add_platform (nodename) {
    var node = netprog_entityfromnodename(nodename);
    var isnewentity = false;

    var entity    = node.object;

    if (entity == NULL) {    // must be new entity
        console.log ('onclick_paneladdentity : Error in nodename : ' + nodename);
        return NULL;
    }
    var name      = entity.ClassName; //.substring(2);  //get off with MX

    netprog_update_platform(nodename);

    if (interface_GetEntity (netprog_manager, netprog_entityfatherclass(name), 'Code', node.code) == NULL) {
        isnewentity = true;
    }
    if (isnewentity) {
        interface_ArrayInsert(netprog_manager[netprog_entityfatherclass(name)], entity);
    }
    return entity;
}

function onclick_treenode_modify (elt, event) {
  
    let nodeid   = $(elt.parentElement).closest('.sb_link').attr('id');
    let nodename = $('#' + nodeid).attr('nodename');
    let node = netprog_entityfromnodename(nodename);
    let nodetype = node.nodetype;

    if (!netprog_type_leaf.includes (nodetype)) {
        let panelid     = nodeid.replace ('treenode', 'treepanel');
        let hidden      =  $('#' + panelid).css ('display') == 'none' ? true : false;    

        let group    = $(elt).closest('#netprog_tree_update');

        if (hidden) {
       //     $('#' + panelid).css ('display', 'block')
            $('#' + panelid).slideToggle()
            $(group).find('#tree_delete_entity').css ('display', 'flex')        
        } else {
//            $('#' + panelid).css ('display', 'none')
            $('#' + panelid).slideToggle()            
            $(group).find('#tree_delete_entity').css ('display', 'none') 
        }
        event.stopPropagation();  
    }
}

function onclick_paneldlg_add(nodename) {
    if (netprog_add_platform (nodename) != NULL) {
        $("#modal_addentity").modal('hide');   
    }
}

function onclick_treenode_add (elt, event) {
    event.preventDefault();    
    event.stopPropagation();    

    var nodeid  = $(elt.parentElement).closest('.sb_link').attr('id');
    var nodename = $('#' + nodeid).attr('nodename');

    var node  = netprog_entityfromnodename(nodename);
    var fieldname   = node.field;
    var entity      = node.object;
    var nodetype    = node.nodetype;   
  

    var header, entity;
  
    switch (nodetype) {
        case 'Sites' :
            header = 'Site';
            entity = new(MXSite);
        break;
        case 'Machines' :
            header = 'Machine';     
            entity = new(MXMachine);        
        break;
        case 'ApplicationClasses' :
            header = 'Application';  
            entity = new(MXApplicationClass);    
        break;
        case 'DatabaseClasses' :
            header = 'Database';  
            entity = new(MXDatabaseClass);    
        break;
        case 'QueueClasses' :
            header = 'Database';  
            entity = new(MXQueueClass);                
        break;
        case 'JournalClasses' :
            header = 'Journal';  
            entity = new(MXJournalClass);               
        break;
        case 'ConnectionClasses' :
            header = 'Connection';                    
            entity = new(MXConnectionClass);    
        break;
        default: return;
    }

    new_entity = entity;
    sb.modal ({
        id: 'modal_addentity', 
        header: header, 

        resizable: true,
        body: sb.panelfyobject(entity), 
        footer: 
            '<button class="sb_mbutton" onclick="onclick_paneldlg_add(\'' + header + ':' + entity.Code + '\'); ">Add</button>' +
            '<button class="sb_mbutton" data-bs-dismiss="modal">Cancel</button>',                      
    });  
}

function onclick_paneldlg_delete (nodename) {
    if (netprog_remove_platform(nodename) != NULL) {
        $("#confirmmodal").modal('hide');
    }
}

function onclick_treenode_delete(elt, event){
    event.preventDefault();    
    event.stopPropagation();  

    var nodeid    = $(elt.parentElement).closest('.sb_link').attr('id');
    var nodename  = $('#' + nodeid).attr('nodename');

    var node  = netprog_entityfromnodename(nodename);
    var fieldname = node.field;
    var entity    = node.object;
    var type      = node.type;    

    netprog_confirmModal('Are you sure to delete '   + entity.Name + ' ?', 
                         'Delete ' + entity.ClassName.substring(2)).yes(function () {
        onclick_paneldlg_delete (nodename);
       }).no(function () {})    
}

function onchange_treenode_input (elt) {
    let nodename = $(elt).attr('nodename');
    let node = netprog_entityfromnodename(nodename);
    let fieldname = node.field;
    let entity    = node.object;
    let type      = node.type;

    if (entity == NULL) {
        console.log ('onchange_treenode_input: Error in nodename : ' + nodename);
        return;
    }
    if (type == 'Object') {
        console.log (entity.ClassName + ' : ' +  entity.Name + ' has changed');
    } else {
        console.log (entity.ClassName + ' Field ' + fieldname + ' of ' +  entity.Name + ' has changed');
    }

    var nodetree = $(elt).closest('.treenode').find('span:first');
    if (nodetree.length != 0) {                
     //   $('#' + nodeid + ' span:first')
        // panel is in tree
        var nodeid  = nodetree.attr('id');
        var panelid = nodeid.replace ('treenode', 'treepanel');
        if ($('#' + panelid + ' [changed="true"]').length != 0) {
            var entitynodename = nodename.split('.')[0];  
            $('[nodename=\'' + entitynodename + '\']').find('#tree_update_entity').css('display', '')
            $('[nodename=\'' + entitynodename + '\']').find('#tree_cancel_entity').css('display', '')    
        }
    } 
}


function onclick_treenode_update(elt, event){
    event.preventDefault();    
    event.stopPropagation();  

    var nodeid    = $(elt.parentElement).closest('.sb_link').attr('id');
    var panelid   = nodeid.replace ('treenode', 'treepanel');
    var nodename  = $('#' + nodeid).attr('nodename');

    netprog_update_platform(nodename);
    
    $('#' + panelid + ' [changed="true"]').removeAttr('changed');


    $('[nodename=\'' + nodename + '\']').find('#tree_update_entity').css('display', 'none')
    $('[nodename=\'' + nodename + '\']').find('#tree_cancel_entity').css('display', 'none')    
   

   
    solution.netprog_CurrentProject.Save();
    console.log ('I ENTER HERE')
    
}

function onclick_treenode_cancel(elt, event){
    event.preventDefault();    
    event.stopPropagation();  
    
    var nodeid    = $(elt.parentElement).closest('.sb_link').attr('id');
    var panelid   = nodeid.replace ('treenode', 'treepanel');
    var nodename  = $('#' + nodeid).attr('nodename');

    netprog_update_object(nodename);
    
    $('#' + panelid + ' [changed="true"]').removeAttr('changed');
    $('[nodename=\'' + nodename + '\']').find('#tree_update_entity').css('display', 'none')
    $('[nodename=\'' + nodename + '\']').find('#tree_cancel_entity').css('display', 'none')        
}



//---------------------------------------------------- NETPROG TABS AND  MENU  --------------------------------------------------------   

const MENU_FILE_CLOSEALL_ID   = 1;
const MENU_FILE_CLOSESAVED_ID = 2;

function netprog_moremenu () {
    var menu = [];

    menu.push({id: MENU_FILE_CLOSEALL_ID,    text: "Close All",       tooltip: 'Close All files',        icon:'' });
    menu.push({id: MENU_FILE_CLOSESAVED_ID,  text: "Close Saved",     tooltip: 'Close Saved Files',         icon: ''});
    return menu;
}

function netprog_closeallfiles () {
    while (netprog_maintabs.items.length != 0) {
        sb.tab_delete (netprog_maintabs, netprog_maintabs.items[0].id);    
    }
}

function netprog_closesavedfiles () {

}

function onclick_netprog_more (event) {
  
    var menu = netprog_moremenu ();
    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),     
        event: event,                    
        pageX: event.pageX,
        pageY: event.pageY,

        onselect: function (elt, par) {

            switch (parseInt(elt.id)) {
                case MENU_FILE_CLOSEALL_ID :
                    netprog_closeallfiles();
                break;
                case MENU_FILE_CLOSESAVED_ID :
                    netprog_closesavedfiles();
                break;
            }
        },        
        html: sb.menu (menu)
    });    	
}    

function onclick_netprog_tab (elt, event) {

    switch (elt.id) {
        case 'netprog_home_tab':
            return;
        break
        case 'netprog_siteview_tab':
            netprog_gse_editor.Refresh();  
            return;
        break
        case 'netprog_json_tab':
            return;
        break;            

    }
    let filename = $(elt).attr('filename')
    let fullpathname = $(elt).attr('fullpathname')
    
    if (defined(fullpathname)) {
        let file = solution.GetFileFromCName(fullpathname)
        if (!file) {
            return;
        }
        solution.CurrentFile = file;
        netprog_fileditor.setValue(file.Content);
        sb.tree_selectitem(netprog_filemanager.id, file.Name);           
    }
}

function onclick_netprog_tab_close (elt, event) {
    event.stopPropagation ();      

    let tabname     = $(elt.parentElement).attr('id');
   
    let tabindex = sb.tab_delete (netprog_maintabs, tabname);    
    if (tabindex < 0) {
        solution.CurrentFile = null;
    } else {
        let fullname = netprog_maintabs.items[tabindex].cname;
        let file = solution.GetFileFromCName (fullname);
        
        solution.CurrentFile = file;
        netprog_fileditor.setValue(file.Content);        
        sb.tree_selectitem(netprog_filemanager.id, file.Name);   
    }
}

function onclick_netprog_other_tab_close (elt, event) {
    event.stopPropagation ();   
    let tabname     = $(elt.parentElement).attr('id');
   
    let tabindex = sb.tab_delete (netprog_maintabs, tabname);         
}



function netprog_idfromnodename (nodename) {

    let elts = $('#netprog_root').find('[nodename=\'' + nodename + '\']');  
    if (elts.length > 0) {
        return elts[0].id
    } else {
        return elts.id
    } 
}

function netprog_entityfromnodename (nodename) {

    let values = nodename.split(':');

    if (values.length < 1) {

        console.log ('netprog_entityfromnodename : error in nodename : ' + nodename);
        return {type: null, object: null, field: null, nodetype: entityname, fathernodetype: null}        
    }
   
    let entityname  = values[0];   
    let fatherclassname = netprog_entityfatherclass (entityname);      
   
    if (values.length < 2) {                        //Manager or Sites

        console.log ('netprog_entityfromnodename : error in nodename : ' + nodename);
        if (entityname == 'Manager') {                                  // root node
            return {type: 'Object', object: netprog_manager, field: null, nodetype: entityname, fathernodetype: null}
        }
        if (entityname == 'Sites') {                                  // root node
            return {type: 'Object', object: netprog_manager[entityname], field: null, nodetype: entityname, fathernodetype: fatherclassname}
        }
    }
   
    var codefield   = values[1].split('.');   
    var size        = codefield.length;
    var entitycode  = codefield[0];
    var fieldname   = null;

    if (size == 2) {
        fieldname  = codefield[1];
    }

    var entity = interface_GetEntity (netprog_manager, fatherclassname, 'Code', entitycode);

    if (entity == NULL) {   // check if it is new entity
        if (new_entity == NULL) {
            console.log ('netprog_entityfromnodename : error in nodename : ' + nodename);
            return {type: 'Object', object: null, field: null}
        }
        else {    // check if same code
            if (new_entity.Code != entitycode) {
                console.log ('netprog_entityfromnodename : error in nodename : ' + nodename);
                return {type: 'Object', object: null, field: null}   
            }
            entity = new_entity;
        }
    }

    if (fieldname == null) {
        return {type: 'Object', object: entity, field: null, nodetype: entityname, fathernodetype: fatherclassname}
    } else {
        return {type: 'Field', object: entity, field: fieldname, nodetype: entityname, fathernodetype: fatherclassname}
    }
}
function netprog_inputfromtype (type, field) {
  //ip placeholder="xxx.xxx.xxx.xxx"
  // dname nowhite
  //type select
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function netprog_update_object (nodename) {
    var i_entity  = netprog_entityfromnodename(nodename);
    var fieldname = i_entity.field;
    var entity    = i_entity.object;
    var type      = i_entity.type;    

    var keys      = Object.keys(entity);
    var name      = entity.ClassName; //.substring(2);  //get off with MX
    var array_format = entity['props'];    
    
    var index = 0;

    for (var index = 0; index < keys.length; index++) {
        let key = keys[index];
        let elt = $('[nodename=\'' + nodename + '.' + key + '\']');

        if (defined(elt) && elt.length != 0) {
            elt.val(entity[key]);
        }
    }
}

function netprog_remove_platform (nodename) {
    var i_entity = netprog_entityfromnodename(nodename);
    var isnewentity = false;

    var entity    = i_entity.object;

    if (entity == NULL) {    // must be new entity
        console.log ('onclick_paneladdentity : Error in nodename : ' + nodename);
        return NULL;
    }
    var name      = entity.ClassName; //.substring(2);  //get off with MX

    return interface_RemoveEntity(netprog_manager, netprog_entityfatherclass(name), entity)
}

function netprog_update_platform (nodename) {
    var i_entity  = netprog_entityfromnodename(nodename);
    var fieldname = i_entity.field;
    var entity    = i_entity.object;
    var type      = i_entity.type;    
    var keys      = Object.keys(entity);
    var name      = entity.ClassName; //.substring(2);  //get off with MX
    var array_format = entity['props'];    
    
    var index = 0;
    for (var index = 0; index < keys.length; index++) {
        let key = keys[index];
        let elt = $('[nodename=\'' + nodename + '.' + key + '\']');

        if (defined(elt) && elt.length != 0) {
            entity[key] = elt.val();
            if (elt.is('select')) {
                $('#' + elt.attr('id') + ' [selected="selected"]').removeAttr('selected');               
                $('#' + elt.attr('id') + ' option').each(function() {
                    if ($(this).prop("selected") == true) {
                        $(this).attr('selected',"selected");
                    }
                })
            } else {
                elt.prop("defaultValue", elt.val())
            }
        }
    }    
    let elt       = $('[nodename=\'' + nodename + '\'].sb_link');     
    elt.find('.sb_label').html( entity['Name'])    
}

function getMachineInfo (content, values) {
    var manager = values[0];

    var root = JSON.parse (content);    
    var ip   = root.geoplugin_request;
    var machine;
    var site;

    if (values.length == 1) {  // discover the web server
        console.log ('getMachineInfo ' + 'error parameters')
        return;
    }

    machine =  values[1];    
    site = interface_GetEntity(netprog_manager, 'Sites', 'Name', machine.Site);

    site.Information  = root;
    site.IPPublic     = ip;
    machine.IPAddress = ip;    
    return machine;
}

function getIP (content, values) {
    var entity = values[0];
    entity.IPAddress    = content.replace(/[\t\r\n]/gm, '');
}

function getDname (content, values) {
    console.log ('get dname')
    var manager = values[0];
    var machine = values[1];
    var site = interface_GetEntity(netprog_manager, 'Sites', 'Name', machine.Site);    
    machine.AddrName  = content.replace(/[\t\r\n]/gm, '');
    site.AddrName = machine.AddrName;
}

function getIPLocal(machine) {
    var ip = false;
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;

    if (window.RTCPeerConnection) {
        ip = [];
        var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
        pc.createDataChannel('');
        pc.createOffer(pc.setLocalDescription.bind(pc), noop);

        pc.onicecandidate = function(event) {
            if (event && event.candidate && event.candidate.candidate)
            {
                var s = event.candidate.candidate.split('\n');
                ip.push(s[0].split(' ')[4]);
                machine.IPLocal = ip[0];
            }
        }
    }

 return ip;
}

function onip (ip, machine) {
    machine.IPLocal = ip;
}

function getUserIP(onNewIP, par) { //  onNewIp - your listener function for new IPs

    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

    var pc = new myPeerConnection({iceServers: []});
    var noop = function() {};
    var localIPs = {};
    var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
    var key;
  
    function iterateIP(ip) {
      if (!localIPs[ip]) {
        onNewIP(ip, par);
      }
      localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");
  
    // create offer and set local description
    pc.createOffer().then(
        function(sdp) {
            sdp.sdp.split('\n').forEach(
                function(line)  {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                }
            );
            pc.setLocalDescription(sdp, noop, noop);
        }
    ).catch(function(reason) {});                     // An error occurred, so handle the failure to connect
   
  
//listen for candidate events
    pc.onicecandidate = function(ice) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  }

function netprog_panelfy (entitytype, name){

    var entity = interface_GetEntity(netprog_manager, entitytype, 'Name', name);         
    
    var content = '<div  id="panel_' + entity.Code + '" class="sb_formcontainer">';      
    var keys = Object.keys(entity);
    var name = entity.ClassName; //.substring(2);  //get off with MX
   
    var i= 0;
    var item;
    keys.forEach((key) => {
        if (key != 'Code') {            
            content += (i % 2 == 0) ? '<div class="sb_formgroup">' : '';
            item = {id: name + '_' + key + '_' + entity.Code, item: key, type:'text', value:  entity[key] }
            content += sb.render (item);
/*            
    '           <label>' + key + ' </label>' +
    '           <input id ="' + name + '_' + key + '" class="form-control" value="' +   entity[key]  + '"/>';
*/    
            content += (i % 2 == 0) ? '</div>' : ''; 
        }    
    })
    content += '</div>' ;
    return content;
}

var options  = {};   


function yes_callback() {
    options.yes_callback();
}
function no_callback() {
    options.no_callback();
}


function netprog_confirmModal (content, header, func) {
    sb.modal ({
        id: 'confirmmodal', 
        header: header ? header : 'Confirmation', 
        resizable: true,
        onopen: func,   
        body:   '<div class="sb_confirmation">' + content + '</div>', 
        footer: '<button  class="modal-ok sb_mbutton"  onclick="' + 'yes_callback()'  + '">OK</button>' +
                '<button data-bs-dismiss="modal"  class="sb_mbutton" onclick="' + 'no_callback()'  + '">Cancel</button>',
     });
     return {
        yes: function (fun) {
            options.yes_callback = fun;
            return this;
        },
        no: function (fun) {
            options.no_callback = fun;
            return this;
        }
    };   
}
function PanelConnection (host, port) {
    this.Host = host;
    this.Port = port;
    this.InitDone = false;
    this.Running  = false;
    this.Socket = 0;
}


function onclick_netprog_connect (elt, event) {
    var hostname  = $('#connect_machine').val();
    var port      = $('#connect_port').val();
    var protocol  = $('#connect_protocol').val();
    var application = new PanelConnection(hostname, port);  
    Connect(application, hostname, port);
  }

function Vue_netprog_entityPanel (type) {

    var rootentity   = netprog_entityfatherclass(type);

    var content =        
'   <div class="sb_cardtitle">' +
'       {{entity.Name}}' +
'   </div>' +
'   <div class="sb_cardbody">' +
'       <i class="' + netprog_iconfromclass(type) + '"></i>' +
'       <form>' +
           netprog_panelfy(entity, name) +
'       </form>' +
'   </div>' +
'   <div class="sb_cardfooter">' +
'       <button @click="saveEntity(\'' + rootentity + '\', entity.Code,' + '\'' + type + '_\' + entity.Code)" class="btn btn-light">' +
'           Save' +
'       </button>' +
'   </div>';
    return content;
}  


function Vue_netprog_Main (type) {
   
   var rootentity   = netprog_entityfatherclass(type);

    var content =    
'   <div class="wrapper">' +
'      <div class="sb_cardcontainer">' +
'        <div v-for="(entity, i) in netprog_vue_manager.' + rootentity + '" :key= "entity.Code" ref="entity.Code" class="sb_card" :id="' + '\'' + type + '_\' +  entity.Code">' +
'          <div class="sb_cardtitle">' +
'            {{entity.Name}}' +
'          </div>' +
'          <div class="sb_cardbody">' +
'            <i class="' + netprog_iconfromclass(type) + '"></i>' +
'            <form>' +
                '<div v-html="getPanel(\'' + rootentity + '\', entity.Name)"></div>' +
'            </form>' +
'          </div>' +
'          <div class="sb_cardfooter">' +
'            <button @click="saveEntity(\'' + rootentity + '\', entity.Code,' + '\'' + type + '_\' + entity.Code)" class="btn btn-light">' +
'              Save' +
'            </button>' +
'          </div>' +
'        </div>' +
'      </div>' +
'   </div>';
    return content;
}

function ondrop_home_panel(elt, event) {
   var nodename = event.dataTransfer.getData("text");
   var i_entity  = netprog_entityfromnodename(nodename);
   var fieldname   = i_entity.field;
   var entity      = i_entity.object;
   var entitytype  = i_entity.type;      
   var nodetype     = i_entity.nodetype;
   var fathernodetype     = i_entity.fathernodetype;

   $('#netprog_home_panel').html(Vue_netprog_Main(nodetype));
}

function Vue_netprog_SideBar (type, nodename) {

    var content =    
    '<ul id="netprog_tree_manager" class="sb_tree"><li><span class="sb_link" onclick="onclick_defaultarrow(this, event);">' +
    '<i class="tree-arrow-right rotate-90"></i> ' +
    '<label class="sb_label">Manager</label></span>' +
    '<ul id="netprog_manager_ref" class="collapse show">' +
        
    ' <li>' +
    '    <ul id="netprog_' + 'machines" class="sb_tree">' +
    '        <li>' +
    '            <span class="sb_link" onclick="onclick_defaultarrow(this, event);">' +
    '            <i class="tree-arrow-right rotate-90"></i>' +
    '            <i class="' +  netprog_iconfromclass(type) + '"></i>' +
    '            <label class="sb_label">' + 'Machines' + '</label>' +
    '            </span>' +
    '            <ul id="netprog_' + 'machines_ref" class="collapse show">' +
    '                <li v-for="(entity, i) in netprog_vue_manager.' + 'Machines">' +
    '                    <span :id="' + '\'' + type + '_\' +  entity.Code" class="sb_link sb_group" :nodename="\'Machines:Machine:\' + entity.Code" ' +
    '                         onclick="onclick_netprog_treenode(this, event)" ' +
    '                         ondblclick="ondblclicknetprog_treenode(this, event)" ' +
    '                         oncontextmenu="oncontextmenu_netprog_treenode(this, event)"> ' +
    '                        <i class="fas fa-desktop"></i> ' +
    '                        <label class="sb_label"> {{entity.Name}}</label>' +
    '                    </span>' +
    '                </li>' +
    '            </ul>' +
    '        </li>' +
    '    </ul>' +
    '</li>';

    content += '</ul></ul>';
    return content;
}
/*
<select id="connect_machine" class="form-control">
    <option value="127.0.0.1">127.0.0.1</option>
    <option value="182.52.219.189">182.52.219.189</option>
    <option value="217.112.89.92">217.112.89.92</option>
    </select>
*/

function Vue_netprog_Select_Panel (type, field) {
    var rootentity   = netprog_entityfatherclass(type);    
    var content = 
    '   <select  class="custom_select form-control" id="essai" data-id="essai">' +
    '       <option v-for="(entity, i) in netprog_vue_manager.' + rootentity +'" value="{{entity.' + field + '}}">{{entity.' + field + '}}</option>' +
    '   </select>';

    return content;
}
/*import ReactFlow from 'react-flow-renderer';

const initialNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 250, y: 25 },
    },
  
    {
      id: '2',
      // you can also pass a React component as a label
      data: { label: <div>Default Node</div> },
      position: { x: 100, y: 125 },
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 250, y: 250 },
    },
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ];
  
  function Flow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
  
    return <ReactFlow nodes={nodes} edges={edges} fitView />;
  }
*/

//----------------------------------------------------   CAROUSEL PANEL    ------------------------------------------------   

function netprog_MainCarouselPanel1 () {

    var content = 
//        sb.render (tradedesk_assistantpanel) +     
'       <div id="netprog_maincarousel" class="featured carousel slide sb_panel" data-bs-ride="carousel">' +
'           <label class="sb_f_size12">Featured</label>' +

'           <div class="carousel-inner">' +
'               <div class="carousel-item active">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/netprog/res/netprog1.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                           STRATEGY CREATOR<img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">STRATEGY CREATOR - Algo Trading</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">You have an idea of a strategy and You do not know how to program it ? </li>' +
'                                   <li class="card-text">Strategy Creator allows you to realize and test your strategy </li>' +
'                                   <li class="card-text">You can test your idea in minutes</li>' +
'                                   <li class="card-text">A wizard will help you to do it</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/netprog/res/netprog2.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                               MT4 PLATFORM' +
'                           </div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">CONNECT TO YOUR MT4 PLATFORM - Features</div>' +   
'                                <div class= "mb-3">' +    
'                                   <li class="card-text">Fully take control on your MT4 experts</li>' +
'                                   <li class="card-text">Launch more than one expert on the same chart</li>' +
'                                   <li class="card-text">Change the behavior of your Strategies during run time</li>' +
'                                   <li class="card-text">Distinguish orders related to your running strategies</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'               <div class="carousel-item">' +
'                   <div class="sb_row sb_panel">' +
'                       <img src="/A_PLATFORMS/netprog/res/netprog3.jpg" alt=""></img>' +
'                       <div class="card col9">' +
'                           <div class="card-header">' +
'                           OPTION TRACKER<img src="/res/UnderCon_black.png" class="underconstruct" ></div> ' +
'                           <div class="card-body">' +
'                               <div class="card-title">STOCK AND OPTION TRACKER ON YAHOO</div>' +
'                               <div class= "mb-3">' +    
'                                   <li class="card-text">Stocks</li>' +
'                                   <li class="card-text">Option Calculator </li>' +
'                                   <li class="card-text">Option Greeks</li>' +
'                                   <li class="card-text">Option Chain</li>' +
'                               </div>' +
'                           </div>' +
'                       </div>' +
'                   </div>' +
'               </div>' +
'           </div>' +
'           <div class="carousel-indicators bottomcarousel">' +
'               <button  class="sb_roundbutton active" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="0" aria-current="true" aria-label="Slide 1"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>' +
'               <button  class="sb_roundbutton" type="button" data-bs-target="#netprog_maincarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>' +
'           </div>' +
'  </div>';
return content;
}

//------------------------------------------------------------ NETPROG BOTTOM PANEL ----------------------------------------------------------

function onclick_netprogtabs(event) {
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }
    BottomPanel_Flat (platform, false, true);
} 

function ondblclick_netprogtabs(elt, event) {
    event.stopPropagation();    
    let ui       = solution.get('ui') 
    let platform = ui.currentplatform;
    if (!platform) {
        return;
    }

    BottomPanel_Flat (platform, undefined, true);
} 

