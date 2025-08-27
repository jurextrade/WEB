
const NULL = null;
const IPPROTO_FTP             = 21               
const IPPROTO_SMTP            = 25               
const IPPROTO_DNS             = 53               
const IPPROTO_HTTP            = 80               
const IPPROTO_POP             = 110               
const IPPROTO_BC              = 100              
const IPPROTO_DG              = 30000     
const IPPROTO_CB2A            = 30001   
const IPPROTO_MTT             = 2010               

const IPPROTO_IP              =  0
const IPPROTO_ICMP            =  1
const IPPROTO_IGMP            =  2
const IPPROTO_GGP             =  3
const IPPROTO_TCP             =  6
const IPPROTO_UDP             =  17
const IPPROTO_IDP             =  22
const IPPROTO_ND              =  77
const IPPROTO_RAW             =  255
const IPPROTO_MAX             =  256

const DBPROTO_ODBC            = 1021               
const DBPROTO_ORACLE          = 1025               
const DBPROTO_SQLDS           = 1053    

const IOPROTO_FTP             = -IPPROTO_FTP               
const IOPROTO_SMTP            = -IPPROTO_SMTP              
const IOPROTO_DNS             = -IPPROTO_DNS               
const IOPROTO_HTTP            = -IPPROTO_HTTP              
const IOPROTO_POP             = -IPPROTO_POP                
const IOPROTO_BC              = -IPPROTO_BC                 
const IOPROTO_STORE           = -IPPROTO_DG                   
const IOPROTO_MTT             = -IPPROTO_MTT                   
const IOPROTO_FIOP            = 10000




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function MXAssignDefaultDialogs (manager, dialogclasses) {
    
    for (var i= 0; i < dialogclasses.length; i++) {
        var dialog      = dialogclasses[i];
        var dialogclass = new MXDialogClass(dialog.Code, dialog.Name);

        interface_ArrayInsert(manager.DialogClasses, dialogclass);

        for (var j = 0; j < dialog.MessageClasses.length; j++) {
            var message      = dialog.MessageClasses[j];
            var messageclass = new MXMessageClass(message.Code, message.Name);

            messageclass.Class = dialogclass.Name;
            interface_ArrayInsert(dialogclass.MessageClasses, messageclass);

            for (var k = 0; k < message.Objects.length; k++) {
                var object      = message.Objects[k];
                var objectclass = new MXObject(object.Name, object.Type, object.Size);

                objectclass.Class = messageclass.Name;
                interface_ArrayInsert(messageclass.Objects, objectclass);
            }                    
        }
    }
}  
  
/*=========================================================================*/
/* DIALOG CLASS                                                            */
/*=========================================================================*/

function MXCreateDialogClass(mx, name, code) {

    var dialogclass =  interface_GetEntity (mx, 'DialogClasses', 'Name', name); 
    if (dialogclass) {
        interface_ArrayRemove (mx.DialogClasses, dialogclass);
    }

    dialogclass = interface_GetEntity (mx, 'DialogClasses', 'Name', name); 
    
    if (dialogclass)  {
        interface_ArrayRemove (mx.DialogClasses, dialogclass);
    }

    dialogclass = new MXDialogClass(name, code);
    dialogclass.MX = mx;

    interface_ArrayInsert(mx.DialogClasses, dialogclass);
    return dialogclass;
}


function MXCreateMessageClass(mx, dialogclass, name, code, objectsarray) {
   
    var messageclass = interface_GetEntity (dialogclass, 'MessageClasses', 'Name', name);

    if (messageclass) {
        interface_ArrayRemove (dialogclass, messageclass);        
    }

    messageclass = new MXMessageClass(code, name);
    messageclass.Class = dialogclass.Name;
    interface_ArrayInsert(dialogclass.MessageClasses, messageclass);  
    return messageclass;
}

function MXAddObjectToMessageClass (messageclass, type, size, name) {

    var ret= MXCheckType2 (type);

    var typecode = (ret > 10) ? ret - 10 : ret;

    var object = new MXObject(name, type, size);

    object.Name   = name;
    object.Size   = size;    
    object.Type   = typecode;

    object.Offset = messageclass.Size;
    object.Class = messageclass.Name;

    switch (ret) {
        case MXObject_Type.SHORT :
            object.InternalType = OSSHORT;
            break;
        case MXObject_Type.LONG :
            object.InternalType = OSLONG;
            break;
        case MXObject_Type.WORD :
            object.InternalType = OSWORD;
            break;
        case MXObject_Type.DWORD :
            object.InternalType = OSDWORD;
            break;
        case MXObject_Type.DOUBLE :
            object.InternalType = OSDOUBLE;
            break;
        case MXObject_Type.BYTE :
            object.InternalType = OSBYTE;
            break;
        case MXObject_Type.FILE :
            object.InternalType = OSFILE;
            break;
        case MXObject_Type.STRING :
            object.InternalType = OSSTRING;
            break;
        case MXObject_Type.CHAR :
            object.InternalType = OSCHAR;
            break;
        case MXObject_Type.BUFFER :
            object.InternalType = OSBUFFER;
            break;
    }

    object.InternalLength = object.Size;
    object.InternalScale  = -1;
    
    messageclass.Size += object.Size;
    
    messageclass.Objects.push(object);
    return object;
}

/*=========================================================================*/
/* MESSAGE                                                                 */
/*=========================================================================*/

function MXGetMessageClassFromName (dialogclass, name) {
    return interface_GetEntity ('dialogclass', 'MessageClasses', 'Name', name)    
}

function MXCreateMessage (mx, ClassName, MessClassName) {

    var dialogclass = MXGetDialogClassFromName (pmx, ClassName);
    if (!dialogclass) {
        OSError ("TEDAG010", " (%s)", ClassName);
        return NULL;
    }
    var messageclass = MXGetMessageClassFromName (dialogclass, MessClassName);
    if (!messageclass) {
        OSError ("TEDAG011", " (%s)", MessClassName);
        return NULL;
    }
    return MXAllocMessage (dialogclass, messageclass);

}

function MXPutMessage (com, classname, messclassname) {

    var message = MXCreateMessage (com.MX, classname, messclassname);

    if (message) {
        message.Identity = com.MessagesId;
        /*time put */
        OSDateHour (message.PDate, message.PHour);
        com.MessagesId++;
        ListNewr (com.OutputMessages, message);
        return message;
    }
 
    return NULL;
}

/*=========================================================================*/
/* MANAGER                                                                 */
/*=========================================================================*/

function MXCreateManager (name) {
    return new MXManager (name);
}

/*=========================================================================*/
/* SITE                                                                    */
/*=========================================================================*/

function MXCreateSite (manager, name) {

    if (name == '') return NULL;

    var site =  interface_GetEntity (manager, 'Sites', 'Name', name);
    if (site) {
        console.log('Site already defined');
        return NULL
    }

    site = new(MXSite);
    site.Name =  name;

    interface_ArrayInsert(manager.Sites, site);

    return site;
}

function MXFreeSite (manager, site) {

    interface_ArrayRemove (manager.Sites, site);
}

/*=========================================================================*/
/* MACHINE                                                                 */
/*=========================================================================*/

/*
function MXAddMachineToSite (manager, MXSite* psite, MXMachine* machine)
{
    if (!machine) return NULL;

    if (machine.Site)
        interface_ArrayRemove (machine.Site.Machines, machine);
    machine.Site = psite;
    if (psite) interface_ArrayInsert (psite.Machines, machine);
    return machine;
}
*/


function MXCreateMachine (manager, name, system, ipadress, dname, site) {


    var machine = interface_GetEntity (manager, 'Machines', 'Name', name);
    
    if (machine) {
        console.log('Machine already defined');
        return NULL
    }

    machine = new MXMachine (name);
    machine.Name    = name;
    machine.System  = system;

    interface_ArrayInsert(manager.Machines, machine);

    if (site) {
        machine.Site    = site.Name;
        interface_ArrayInsert(site.Machines, machine);        
    }

    if (dname)     machine.AddrName = dname;

    if (ipadress)  machine.IPAddress = ipadress;
    else {
//        if (dname)
         //   url_submit ('GET', 'http://' + document.location.host + '/php/get_ip.php' , {address : machine.AddrName} , false, getIP, [machine]);  
         //   url_submit ('GET', 'http://' + document.location.host + '/php/load_url.php', {url: 'http://www.geoplugin.net/json.gp'} , false, getIP, [machine]);       
     
 //       OSGetAddrFromName (name, machine.IPAddress);

    }
    return machine;
}

function MXFreeMachine (manager, machine) {

    if (machine.Site) {
        interface_ArrayRemove (machine.Site.Machines, machine);
    }    
    interface_ArrayRemove (manager.Machines, machine);
}

/*=========================================================================*/
/* APPLICATION                                                             */
/*=========================================================================*/

function  MXCreateApplication (manager, applicationclass, name, machine) {

    var appli = interface_GetEntity (manager, 'Applications', 'Name', name);

    if (!appli) {
        appli = new MXApplication(name);
        interface_ArrayInsert(manager.Applications, appli);        
    }
    else {
        if (appli.Machine) {
            var machine = interface_GetEntity (manager, 'Machines', 'Name', appli.Machine);
            interface_ArrayRemove (machine.Applications, appli);
        }
        let appliclass = interface_GetEntity (manager, 'ApplicationClasses', 'Name', appli.ClassName)        
        interface_ArrayRemove (appliclass.Applications, appli);
    }

    appli.Name        = name;
    appli.NetType     = applicationclass.NetType;
    appli.Type        = applicationclass.Type;
    appli.Class       = applicationclass.Name;
    appli.Machine     = machine.Name;

    interface_ArrayInsert(applicationclass.Applications, appli);        
    interface_ArrayInsert(machine.Applications, appli);        

    return appli;
}

/*=========================================================================*/
/* APPLICATION CLASS                                                       */
/*=========================================================================*/

function MXCreateApplicationClass (manager, name, nettype, type) {

    var appliclass = interface_GetEntity (manager, 'ApplicationClasses', 'Name', name);

    if (appliclass) {
        console.log('Application class already defined');
        return NULL
    }

    appliclass = new(MXApplicationClass);

    appliclass.Name      = name;
    appliclass.NetType   = nettype;
    appliclass.Type      = type;
    interface_ArrayInsert(manager.ApplicationClasses, appliclass);        

    return appliclass;
}

/*=========================================================================*/
/* DATABASE                                                                */
/*=========================================================================*/

function MXCreateDatabase (manager, databaseclass, name, machine) {

    var database = interface_GetEntity (manager, 'Databases', 'Name', name);
    
    if (!database) {
        database = new(MXDatabase);
        interface_ArrayInsert(manager.Databases, database);        
    }
    else {
        if (database.Machine) {
            interface_ArrayRemove (database.Machine.Databases, database);
        }
        let dbclass = interface_GetEntity (manager, 'DatabaseClasses', 'Name', database.Class)               
        interface_ArrayRemove (dbclass.Databases, database);
    }


    database.Name     = name;
    database.Type     = databaseclass.Type;
    database.Class    = databaseclass.Name;
    database.Machine  = machine.Name;
    database.AddrName = machine.AddrName;

    interface_ArrayInsert(databaseclass.Databases, database);       
    interface_ArrayInsert(machine.Databases, database);       

    return database;
}

/*=========================================================================*/
/* DATABASE CLASS                                                          */
/*=========================================================================*/

function MXCreateDatabaseClass  (manager, name, type) {

    var databaseclass = interface_GetEntity (manager, 'DatabaseClasses', 'Name', name);

    if (databaseclass) {
        console.log('Database class already defined');
        return NULL
    }
 
    databaseclass = new(MXDatabaseClass);
    
    databaseclass.Name  = name;
    databaseclass.Type  = type;    
    
    interface_ArrayInsert(manager.DatabaseClasses, databaseclass);     

    return databaseclass;
}

/*=========================================================================*/
/* CONNECTION CLASS                                                        */
/*=========================================================================*/

function MXCreateConnectionClass (manager, name, protocol, fromclassname, toclassname, fromto, tablename,) {

    var toentityclass= NULL;

    var fromapplicationclass =  interface_GetEntity (manager, 'ApplicationClasses', 'Name', fromclassname);
    if (!fromapplicationclass)
        return NULL;

    switch (protocol) {
        case DBPROTO_ORACLE :
        case DBPROTO_ODBC   :
        case DBPROTO_SQLDS  :
            toentityclass = interface_GetEntity (manager, 'DatabaseClasses', 'Name', toclassname);
            if (!toentityclass)
                return NULL;
        break;
        case IOPROTO_STORE  :
        case IOPROTO_FIOP  :
            toentityclass = interface_GetEntity (manager, 'JournalClasses', 'Name', toclassname);
            if (!toentityclass)
                return NULL;
        break;
        case IPPROTO_ICMP :
        case IPPROTO_IP   :
        case IPPROTO_TCP  :
        case IPPROTO_DG   :
        case IPPROTO_CB2A :
        case IPPROTO_UDP  :
        case IPPROTO_DNS  :
        case IPPROTO_HTTP :
        case IPPROTO_FTP  :
        case IPPROTO_MTT  :
        case IPPROTO_SMTP :
        case IPPROTO_POP  :
        case IPPROTO_BC   :
            toentityclass = interface_GetEntity (manager, 'ApplicationClasses', 'Name', toclassname);
            if (!toentityclass)
                return NULL;
        break;
        default :
            return NULL;
        break;
    }

    var connectionclass = interface_GetEntity (manager, 'ConnectionClasses', 'Name', name); 
    if (!connectionclass)  {
        connectionclass =  new (MXConnectionClass);
        interface_ArrayInsert(manager.ConnectionClasses, connectionclass);     
    }

    if (tablename){
        connectionclass.TableName = tablename;
    }

    connectionclass.Name                 = name;
    connectionclass.Protocol             = protocol;
    connectionclass.FromToTranscod       = fromto;

    connectionclass.FromApplicationClass = fromclassname;
    connectionclass.ToEntityClass        = toclassname;
    
    return connectionclass;
}

/*=========================================================================*/
/* CONNECTION                                                              */
/*=========================================================================*/

function MXCreateConnection (manager, name, connectionclass, fromappliname, toentityname) {
   
    var toentity = NULL;
   

    var fromapplication = interface_GetEntity (manager, 'Applications', 'Name', fromappliname);
    if (!fromapplication)
        return NULL;
    
    var protocol = connectionclass.Protocol;
    
    switch (protocol) {
        case DBPROTO_ORACLE :
        case DBPROTO_ODBC   :
        case DBPROTO_SQLDS  :
            toentity = interface_GetEntity (manager, 'Databases', 'Name', toentityname);
            if (!toentity)
                return NULL;
        break;
        case IOPROTO_STORE  :
        case IOPROTO_FIOP  :
            toentity = interface_GetEntity (manager, 'Journals', 'Name', toentityname);
            if (!toentity)
                return NULL;
        break;
        case IPPROTO_ICMP :
        case IPPROTO_IP   :
        case IPPROTO_TCP  :
        case IPPROTO_DG   :
        case IPPROTO_CB2A :
        case IPPROTO_UDP  :
        case IPPROTO_DNS  :
        case IPPROTO_HTTP :
        case IPPROTO_FTP  :
        case IPPROTO_MTT  :
        case IPPROTO_SMTP :
        case IPPROTO_POP  :
        case IPPROTO_BC   :
            toentity = interface_GetEntity (manager, 'Applications', 'Name', toentityname);
            if (!toentity)
                return NULL;
        break;
        default :
            return NULL;
        break;
    }

    var Connection = interface_GetEntity (manager, 'Connections', 'Name', name);

    if (!Connection) {
        Connection = new(MXConnection);
    }
    else
        interface_ArrayRemove (manager.Connections, Connection);

    Connection.Name = name;
    
    Connection.FromApplication  = fromapplication.Name;
    Connection.ToEntity         = toentity.Name;

    Connection.FileData  = NULL;
    Connection.Connected = false;
    Connection.Class = connectionclass.Name;
    interface_ArrayInsert(manager.Connections, Connection);     

    return Connection;
}

/*
MXAddGeneralCallBack(mx,  DG_SYS, 'SendClassConnection', MXONRECV, SYS_SendClassConnection, NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'ReplyClassConnection', MXONRECV, SYS_ReplyClassConnection, NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'AckMessage'      , MXONRECV, SYS_AckMessage,      NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'GetFiles'        , MXONRECV, SYS_GetFiles,        NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'GetFile'         , MXONRECV, SYS_GetFile,         NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'SendFile'        , MXONRECV, SYS_SendFile,        NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'List'            , MXONRECV, SYS_List,            NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'Dir'             , MXONRECV, SYS_Dir,             NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'RemoveFiles'     , MXONRECV, SYS_RemoveFiles,     NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'RenameFile'      , MXONRECV, SYS_RenameFile,      NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'ChangeDir'       , MXONRECV, SYS_ChangeDir,       NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'GetDir'          , MXONRECV, SYS_GetDir,          NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'MakeDir'         , MXONRECV, SYS_MakeDir,         NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'RemoveDir'       , MXONRECV, SYS_RemoveDir,       NULL);
MXAddGeneralCallBack(mx,  DG_SYS, 'PutError'        , MXONRECV, SYS_PutError,        NULL);*/


function MXUpdate (manager) {
   //this.ClassName = "MXManager";
   //this.Code = 0;
   //this.Name = name;
   //this.Sites = new Array();
   //this.Machines = new Array();
   //this.Applications = new Array();
   //this.Databases = new Array();
   //this.Journals = new Array();
   //this.Queues = new Array();
   //this.Connections = new Array();
   //this.ConnectionClasses = new Array();
   //this.ApplicationClasses = new Array();
   //this.DatabaseClasses = new Array();
   //this.QueueClasses = new Array();
   //this.JournalClasses = new Array();
   //this.DialogClasses  = new Array();

   //this.LocalMachineName='';
   //this.LocalAddress='';

    MXAssignDefaultDialogs (manager, DialogClasses) ;        


// correct classes 
    let carray = [];
    for (var i = 0; i < manager.ConnectionClasses.length; i++) {
        carray = [];        
        for (var j = 0; j < manager.ConnectionClasses[i].Connections.length; j++) {        
            let elt  =  interface_GetEntity (manager, 'Connections', 'Name', manager.ConnectionClasses[i].Connections[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.ConnectionClasses[i].Connections[j] = carray;
    }

    for (var i = 0; i < manager.ApplicationClasses.length; i++) {
        carray = [];        
        for (var j = 0; j < manager.ApplicationClasses[i].Applications.length; j++) {        
            let elt  =  interface_GetEntity (manager, 'Applications', 'Name', manager.ApplicationClasses[i].Applications[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.ApplicationClasses[i].Applications = carray;
         
    }

    for (var i = 0; i < manager.DatabaseClasses.length; i++) {
        carray = [];        
        for (var j = 0; j < manager.DatabaseClasses[i].Databases.length; j++) {        
            let elt  =  interface_GetEntity (manager, 'Databases', 'Name', manager.DatabaseClasses[i].Databases[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.DatabaseClasses[i].Databases = carray;        
    }

    carray = [];
    for (var i = 0; i < manager.QueueClasses.length; i++) {
        carray = [];        
        for (var j = 0; j < manager.QueueClasses[i].Queues.length; j++) {          
            let elt  =  interface_GetEntity (manager, 'Queues', 'Name', manager.QueueClasses[i].Queues[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.QueueClasses[i].Queues = carray;
    }

    for (var i = 0; i < manager.JournalClasses.length; i++) {
        carray = [];        
        for (var j = 0; j < manager.JournalClasses[i].Journals.length; j++) {                  
            let elt  =  interface_GetEntity (manager, 'Journals', 'Name', manager.JournalClasses[i].Journals[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.JournalClasses[i].Journals = carray;
    }

// correct Machines

    for (var i = 0; i < manager.Machines.length; i++) {
        carray = [];
        for (var j = 0; j < manager.Machines[i].Connections.length; j++) {
            let elt  =  interface_GetEntity (manager, 'Connections', 'Name', manager.Machines[i].Connections[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.Machines[i].Connections = carray;

        carray = [];
        for (var j = 0; j < manager.Machines[i].Applications.length; j++) {
            let elt  =  interface_GetEntity (manager, 'Applications', 'Name', manager.Machines[i].Applications[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.Machines[i].Applications = carray;

        carray = [];
        for (var j = 0; j < manager.Machines[i].Databases.length; j++) {
            let elt  =  interface_GetEntity (manager, 'Databases', 'Name', manager.Machines[i].Databases[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.Machines[i].Databases = carray;

        carray = [];
        for (var j = 0; j < manager.Machines[i].Queues.length; j++) {
            let elt  =  interface_GetEntity (manager, 'Queues', 'Name', manager.Machines[i].Queues[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.Machines[i].Queues = carray;

        carray = [];
        for (var j = 0; j < manager.Machines[i].Journals.length; j++) {
            let elt  =  interface_GetEntity (manager, 'Journals', 'Name', manager.Machines[i].Journals[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.Machines[i].Journals = carray;

    }    
// correct sites

    for (var i = 0; i < manager.Sites.length; i++) {
        carray = [];
        for (var j = 0; j < manager.Sites[i].Machines.length; j++) {
            let elt  =  interface_GetEntity (manager, 'Machines', 'Name', manager.Sites[i].Machines[j].Name);
            interface_ArrayInsert (carray, elt)
        }
        manager.Sites[i].Machines = carray;
    }    
}
