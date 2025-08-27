/*-------------------------------------------------------------------------*/
/*                    NETPROG (Network Programming)                        */
/* NetProg is an API in C language allowing an homogeneous programming of  */
/* communicating applications                                              */
/* Copyright (C) 2002,2003,2004,2005                                       */  
/* Gabriel Jureidini                                                       */
/* Version 2.0 - 17 July 2005                                              */
/*                                                                         */
/* This program is free software; you can redistribute it and/or modify it */
/* under the terms of the GNU General Public License as published by the   */
/* Free Software Foundation; either version 2 of the License, or (at your  */ 
/* option) any later  version.                                             */
/*                                                                         */
/* This program is distributed in the hope that it will be useful, but     */
/* WITHOUT ANY WARRANTY; without even the implied warranty of              */
/* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the GNU General */
/* Public License for more details.                                        */
/*                                                                         */
/* You should have received a copy of the GNU General Public License along */
/* with this program; if not, write to the Free Software Foundation, Inc., */
/* 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA                   */
/* Copy of GNU General Public License at: http://www.gnu.org/              */
/*                                                                         */
/* Source code home page: http://sourceforge.net/projects/netprog/         */
/* Contact author at: Gabriel_Jureidini@yahoo.com                          */
/*-------------------------------------------------------------------------*/
var MXONMACHINE        = 0;
var MXONLAD            = 1;

var MXSTORE            = 1;
var MXFIOP             = 0;


/* CARTO */
var MXSITE             = 1;
var MXLAD              = 2;
var MXMACHINE          = 3;
var MXAPPLICATION      = 4;

/* FILE TYPE */
const MXPROJFILE         = 0;
const MXSOURCEFILE       = 1;
const MXDIALOGFILE       = 2;
const MXSCRIPTFILE       = 3;
const MXMAKEFILE         = 4;
const MXTRANSCODFILE     = 5;
const MXINCLUDEFILE      = 6;
const MXOTHERFILE        = 7;

const MXCOMPILE_C         = 0;
const MXCOMPILE_JS        = 1;

const MXPROJEXTENSION    = 'vnad';
const MXJSEXTENSION      = 'js';
const MXCEXTENSION       = 'c';
const MXCPLUSEXTENSION   = 'cpp';
const MXINCLUDEEXTENSION = 'h';
const MXDIALOGEXTENSION  = 'mx';
const MXSCRIPTEXTENSION  = 'sc';
const MXTRANSCODEXTENSION= 'xf';
const MXRESOURCEEXTENSION= 'irc';
const MXENTITYEXTENSION  = 'pj';
const MXFILEEXTENSION    = 'fv';
const MXMAKEEXTENSION    = 'mk';
 
var   MXCODE              = 14;


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

function MXGetNextCode () {
    return MXCODE++;
}

class MXManager {
    constructor(name) {
        this.ClassName = "MXManager";
        this.Code = 0;
        this.Name = name;
        this.Sites = new Array();
        this.Machines = new Array();    
        this.Applications = new Array();
        this.Databases = new Array();
        this.Journals = new Array();
        this.Queues = new Array();
        this.Connections = new Array();
        this.ConnectionClasses = new Array();
        this.ApplicationClasses = new Array();
        this.DatabaseClasses = new Array();
        this.QueueClasses = new Array();
        this.JournalClasses = new Array();
        this.DialogClasses  = new Array();

        this.LocalMachineName='';
        this.LocalAddress='';
    }
}

/*----------------------------------------------------------------------------*/
/* BEGIN PHYSICAL ENTITIES                                                    */
/*----------------------------------------------------------------------------*/

class MXSite {
    constructor(name) {
        this.ClassName = "MXSite";        
        this.Code = MXGetNextCode ();     
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name = name;           
        this.AddrName= '';               
        this.IPPublic = '';             
        this.Machines = new Array();               
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
        ];
    }
}
/* SYSTEM */
const MXMachine_System = {
    UNIX:    'Linux',
    WIN32:   'Win32',
    VM:      'VM',
    AS400:   'AS400',
    VOS:     'VOS',
    OS2:     'OS/2',
    HPUX:    'HP-UX',
    ANDROID: 'Android',
    IPAD:    'iPad',
    IPHONE:  'iPhone',
}

class MXMachine {
    constructor(name, site) {
        this.ClassName = "MXMachine";             
        this.Code = MXGetNextCode ();      
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name = name;          
        this.Name = name;  
        this.AddrName ='';                  
        this.IPAddress ='';                 
        this.IPLocal = '';    
        this.Repertory = '.';
        this.System = MXMachine_System.WIN32;                  
        this.Site = site ? site.Name  : '';     
        this.SupportTCP;                 
        this.Applications =[];
        this.Databases =[];
        this.Journals =[];
        this.Queues =[];
        this.Connections =[];           
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'select'},
            {type: 'text', disabled:true},
        ];
    }  
}

/* APPLICATION NET TYPE */
const MXApplicationClass_Type = {
    EXTERNAL:  'External',
    INTERNAL:  'Internal',
}

/* APPLICATION TYPE */
const MXApplicationClass_NetType = {
    SERVER:  'Server',
    CLIENT:  'Client',
}

class MXApplicationClass {
    constructor(name) {
        this.ClassName = "MXApplicationClass";            
        this.Code = MXGetNextCode ();      
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name = name;
        this.NetType = MXApplicationClass_NetType.SERVER;    
        this.Type = MXApplicationClass_Type.INTERNAL;              
        this.Applications=[];
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'select'},
            {type: 'select'},
        ];       
    }
}

const MXApplication_Language = {
    JS:  'Javascript',
    C:   'C',
}

class MXApplication {
    constructor(name, machinename) {
        this.ClassName = "MXApplication";            
        this.Code = MXGetNextCode ();     
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name = name;  
        this.Language = MXApplication_Language.JS;
        this.Ports = [];
        this.Repertory = name;               // from machine repertory
        this.ExecRepertory = name;      // from appli repertory
        this.ExecCommand = 'node';
        this.ExecParameters= name + '.js';
        this.ReceiveRepertory='';
        this.SendRepertory='';
        this.Machine  = machinename ? machinename : '';   
        this.Class   = '';                      
        this.Folders=[];
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'select'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text', disabled:true},
            {type: 'text', disabled:true},
        ];       
    }
}

/* DATABASE TYPE    */
const MXDatabaseClass_Type = {
    ORACLE:     'Oracle',
    MYSQL:      'MySQL',
    SQLSERVER:  'Sql Server',
    POSTGRESQL: 'PostgreSQL',
    MONGODB:    'MongoDB',
    MSACCESS:   'Microsoft Access',
}

class MXDatabaseClass {
    constructor(name) {
        this.ClassName = "MXDatabaseClass";        
        this.Code = MXGetNextCode ();   
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 

        this.Name = name;
        this.Type = MXDatabaseClass_Type.MYSQL;                    
        this.Databases =[];
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'select'},
        ];   
    }
}

class MXDatabase {
    constructor(name) {
        this.ClassName = "MXDatabase";           
        this.Code = MXGetNextCode ();   

        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;
        this.AddrName='';               
        this.Ports = [];    
        this.Machine = null;    
        this.Class = '';                     
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'text', disabled:true},                        
            {type: 'text', disabled:true},                        
        ];           
    }
}

const MXConnectionClass_Protocol = {
    DBPROTO_ORACLE: 'ORACLE',
    DBPROTO_ODBC:   'ODBC',
    DBPROTO_SQLDS:  'SQLDS',
    IOPROTO_STORE:  'STORE',
    IOPROTO_FIOP:   'FIOP',
    IPPROTO_ICMP:   'ICMP',
    IPPROTO_IP:     'IP',
    IPPROTO_TCP:    'TCP',
    IPPROTO_DG:     'DG',
    IPPROTO_CB2A:   'CB2A',
    IPPROTO_UDP:    'UDP',
    IPPROTO_DNS:    'DNS',
    IPPROTO_HTTP:   'HTTP',
    IPPROTO_FTP:    'FTP',
    IPPROTO_MTT:    'MTT',
    IPPROTO_SMTP:   'SMTTP',
    IPPROTO_POP:    'POP',
    IPPROTO_BC:     'BC',
}


class MXConnectionClass {
    constructor(name) {
        this.ClassName = "MXConnectionClass";                   
        this.Code = MXGetNextCode ();   
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;

        this.FromApplicationClass = '';      
        this.ToEntityClass= '';  
        this.Protocol= MXConnectionClass_Protocol.IPPROTO_HTTP;                 
        this.Objects=[];                
        this.TableName='';
        this.FromToTranscod= '';            
        this.FileName='';
        this.FileAttributes='';
        this.UserName='';               
        this.PassWord='';               
        this.ComClass= '';                  
        this.Connections=[];
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {type: 'text'},
            {type: 'text'},
            {type: 'select'},                        
        ];           
     
    }
}

class MXConnection {
    constructor(name) {
        this.ClassName = "MXConnection";    
        this.Code = MXGetNextCode ();   
        
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;
        this.UserName='';
        this.PassWord='';
        this.FileName='';
        this.Port;
        this.ReadMode='';
        this.Connected;
        this.Parameters;               
        this.DistantRepertory='';
        this.System='';
        this.FileData;                 
        this.FromApplication = '';          
        this.ToEntity = '';                 
        this.Com = null;                      
        this.Class = '';                    
       
    }
}

class MXConnectionPar {
    constructor() {
        this.UserName='';
        this.PassWord='';
        this.Port;
        this.FHostName='';
        this.FUserName='';
        this.FPassWord='';
        this.FPort;
        this.LogonType;               
        this.TransType;               
    }
}

class MXJournalClass {
    constructor(name) {
        this.ClassName = "MXJournalClass";           
        this.Code = MXGetNextCode ();   
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;
        this.Type;       
        this.props;
        this.Length;
        this.Journals=[];
        this.MessageClasses=[];
       
    }
}

class MXJournal {
    constructor(name) {
        this.ClassName = "MXJournal";                  
        this.Code = MXGetNextCode ();   
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;
        this.Type;                      
        this.Repertory='';              
        this.Class = '';                     
        this.Machine;                   
        
    }    
}

class MXQueueClass {
    constructor(name) {
        this.ClassName = "MXQueueClass";                       
        this.Code = MXGetNextCode ();   
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;
        this.Type;                    
        this.Queues=[];
        this.Machines=[];   
      
    }
}

class MXQueue {
    constructor(name) {
        this.ClassName = "MXQueue";            
        this.Code = MXGetNextCode ();   
        name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;
        this.Type;                      
        this.Class = '';                     
        this.Machine;                   
    }
}

class MXDialogClass {
    constructor(code, name) {   
        this.ClassName = "MXDialogClass";                
        this.Code = code;     
         name = name ? name : netprog_typefromclass(this.ClassName) + '_' + this.Code; 
        this.Name= name;

        this.MessageClasses = [];    
        this.MX = null;
        this.props = [
            {visible: 0},
            {type: 'text'},
        ];           
    }
}

class MXMessageClass {
    constructor(code, name) {   
        this.ClassName = "MXMessageClass";                
        this.Code = code;     
        this.Name = name;
        this.Size = 0;                      /* check size who knows ?                 */
        this.Objects = [];                   /* list of MXObjects                      */
        this.ExecuteOutputs=[];
        this.ExecuteInputs=[];
        this.ExecuteAck=[];
        this.BlockedOnOutput = false;
        this.BlockedOnInput = false
        this.Class = '';
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},
            {visible: 0},
            {type: 'group'},                        
        ];           

    }
}

const MXObject_Type = {
    SHORT : 'SHORT',
    LONG  : 'LONG',
    WORD  : 'WORD',
    DWORD : 'DWORD',
    BYTE  : 'BYTE',
    FILE  : 'FILE',
    STRING: 'STRING',
    CHAR  : 'CHAR',
    BUFFER: 'BUFFER',
    DOUBLE: 'DOUBLE',
}

class MXObject {
    constructor(name, type, size) {    
        this.ClassName = "MXObject";             
        this.Code = MXGetNextCode ();      
        this.Name = name;                 /* ATTRIBUT may be optional               */
        this.Type= type; 
        this.Size = size;                      /* in case of ARRAYS                      */
        this.Offset = 0;                    /* Offset in the stream we find values    */
        this.InternalType = 0;              /* type for DataBase                      */
        this.InternalLength = 0;            /* size for DataBase                      */
        this.InternalScale = 0;             /* scale forDataBase                      */
        this.Class = '';
        this.props = [
            {visible: 0},
            {visible: 0},
            {type: 'text'},            
            {type: 'select'},
            {type: 'int', step:1},
        ];           

    }
}

/*----------------------------------------------------------------------------*/
/* A message can be transmitted in several parts each part has the following  */
/* format : <RequestSize1><MessageHeadder1><Stream1>   ...                    */
/* for a message, MessageHeader is the same except the Part Value             */
/* Every Message have a unique identity                                       */
/*----------------------------------------------------------------------------*/

class MXMessageHeader {
    constructor() {          
        this.Identity;                  /*!< identity of the message                 */
        this.Size;                      /*!< size of the whole message               */
        this.ClassCode;                 /*!< Class Code                              */
        this.MessageCode;               /*!< message Code                            */
        this.Part;                      /*!< Message sent in several parts           */
    }
}

class MXMessageStatut {
    constructor() {          
        this.Type;                      /*!< NORMAL, ACK, STORE                      */
        this.TDate;                     /*!< Transfer Date                           */
        this.THour;                     /*!< Transfer Time                           */
        this.PDate;                     /*!< Put Date                                */
        this.PHour;                     /*!< Put Hour                                */
        this.DDate;                     /*!< Departure Date                          */
        this.DHour;                     /*!< Departure Hour                          */
        this.ADate;                     /*!< Arrival Date in case of ACK             */
        this.AHour;                     /*!< Arrival Hour in case of ACK             */
    }
}

/* Warning : compiling mx.cpp in medium model won't work because we call       */
/* fopen functions which work on near pointers. we should have opening         */
/* file functions that are supported by windows API                            */

class MXMessageContext {
    constructor() {      
        this.File;                     /*!< this is the case of I/O files           */
        this.Buffer;                    /*!< this is the case of I/O Buffer          */
        this.Pos;                       /*!< position in the file or in the buffer   */
        this.Stream;                    /*!< buffer file or buffer stream            */
        this.StreamPos;                 /*!< Position in FileBuffer                  */
        this.StreamSize;                /*!< Size of FileBuffer                      */
        this.ObjectOffset;              /*!< this can be object range in the message */
        this.SizeOffset;                /*!< this is the size offset in the object   */
        this.StillToRead;               /*!< what is left to read for this message   */
    }
}

const MXMessage_Type = {
    NORMAL: 'NORMAL',
    ACK:    'ACK',
}

class MXMessage {
    constructor() {      
        this.Class = '';                     /*!< points to MX Class                      */
        this.MessageClass;              /*!< points to Message Class                 */
        this.Context;                   /*!< context means message is  several parts */
        this.Com;                       /*!< To which com it belongs                 */
        this.InternalField;             /*!< For internal purposes                   */ 
        this.Part;                      /*!< part of the message                     */
        this.Stream;                    /*!< stream contains values of objects       */
        this.StreamSize;                /*!< size of stream                          */
        this.Values;                    /*!< values is an array  to offset in stream */
        this.Offset;                    /*!< offset in the Stream of values          */
        this.Size;                      /*!< Size of the message with it values      */
        this.Complete;                  /*!< whole message is received or sent       */
        this.Identity;                  /*!< message Identity                        */
        this.Statut;                    /*!< 0, 1                                    */
        this.Type;                      /*!< NORMAL, ACK, STORE                      */
        this.NbrRows;                   /*!< Nbr of columns in objects of the message*/
        this.EndChar = '';              /*!< End reading special char                */
        this.TDate;                     /*!< Transfer Date                           */
        this.THour;                     /*!< Transfer Time                           */
        this.PDate;                     /*!< Put Date                                */
        this.PHour;                     /*!< Put Hour                                */
        this.DDate;                     /*!< Departure Date                          */
        this.DHour;                     /*!< Departure Hour                          */
        this.ADate;                     /*!< Arrival Date in case of ACK             */
        this.AHour;                     /*!< Arrival Hour in case of ACK             */
    }
}

class MXCallBack {
    constructor() {         
        this.ApplicationField;
        this.MessageClass;
        this.ExecuteProcedure; //(MXMessage* pmessage, MXCom* pcom, void* papp);
    }
}

class MXApplicationProcedure {
    constructor() {         
        this.ApplicationField;
        this.ExecuteProcedure;  //(MX* pmx, void* papp);
    }
}

class MXComCallBack {
    constructor() {         
        this.ApplicationField;
        this.ExecuteProcedure;  //(MXCom* pcom, void* pappfield);
    }
}

/*----------------------------------------------------------------------------*/
/* BEGIN FOLDER FILES                                                         */
/*----------------------------------------------------------------------------*/

class MXFileData {
    constructor() {
        this.Name='';
        this.OnlyName='';
        this.Type;                          
        this.Size;
        this.Access='';
        this.Date='';
        this.Children=[];
        this.Expanded;                
        this.InvalidName;
    }
}

class MXFolder {
    constructor() {
        this.Name='';                 
        this.Type;                    
        this.Extension='';
        this.Repertory='';
        this.Files=[];                
    }
}

class MXFile { 
    constructor() {
        this.Name='';                 
        this.Type;                    
        this.Folder;                  
        this.Application;             
    }
}