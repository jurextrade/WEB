function MXInit (mx, mode, name, appliname, port, ResourceFile) {
     
      var tp = new (TP);

      var ret = TPInit (tp, name, appliname);
      
      if (ret < 0)  {
            return ret;
      }
/*      var cgi = new (CGI)

      ret = CGIInit (cgi, NULL, NULL);
      if (ret < 0)  {
         return ret;
      }
*/
      mx.CGI              = null;
      mx.TP               = tp;
      mx.TP.Mode          = mode;
   
      if (mode == MXSERVER)  {
            if (name) {
               ret = TPListenToLocal (tp);
            }
            
            ret = MXAddPort (mx, port, IPPROTO_DG);
      }

      TPAddApplicationProcedure (tp, MXExecuteApplicationProcedures, mx);
      TPAddConnectionProcedure (tp, MXEstablishConnectionOn, mx);
      
      MXAddDGCommands  (mx);
      MXAddFTPCommands (mx);
      MXAddSMTPCommands (mx);
      MXAddPOPCommands (mx);
      MXAddTCPCommands (mx);
      MXAddMTCommands (mx);
      MXAddFIOPCommands(mx);
      MXAddHTTPCommands(mx);
      MXAddDNSCommands (mx);
      MXAddDBCommands (mx);

      mx.Manager = new(MXManager);

      if (ResourceFile) {
         MXLoadResourceFile (mx, ResourceFile);
      }

      if (appliname)   {
         mx.AppliName = appliname;
      }

      var machinename;
      var machineaddress;
      /*
      if (OSGetHostName (machinename, MXSizeName - 1) != -1)   {
            OSGetAddrFromName (machinename, machineaddress);
            mx.Manager.LocalMachineName  =  machinename;
            mx.Manager.LocalAddress      =  machineaddress;
      }
      */

      return ret;
}

function MXAddPort (mx, Port, Protocol) {

    mx.TP.Mode = MXSERVER;
    return TPListenToTCP (mx.TP, Port, Protocol);
}


function MXGetPort (com) {
    if (com.Client.OnPort) {
      return -1;
    } 

    return com.Client.OnPort.Port;
}


function MXAddDGCommands (mx) {

    MXDialogClass * dialogclass;


    dialogclass = MXCreateDialogClass(mx, DG_SYS, DG_SYS_CODE);

   MXCreateMessageClass(mx, dialogclass, 'SendFile',  1, 
      [ 
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['SHORT',  1, 'NbFiles'],
         ['SHORT',  1, 'NbFile'],
         ['FILE',   1, 'File']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'GetFiles',    2,
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'FileNames'],
         ['STRING', 1, 'LocalRepertory'],
         ['CHAR',   1, 'FileType'],
         ['CHAR',   1, 'LocalFileLoc'],
         ['CHAR',   1, 'DistantFileLoc']
      ]
    );
   MXCreateMessageClass(mx, dialogclass, 'GetFile',      3, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'FileName'],
         ['STRING', 1, 'DestName'],
         ['CHAR',   1, 'FileType'],
         ['CHAR',   1, 'LocalFileLoc'],
         ['CHAR',   1, 'DistantFileLoc']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'RemoveFiles', 4,  
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'FileNames'],
         ['CHAR',   1, 'FileLoc']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'RenameFile',  5, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'OldName'],
         ['STRING', 1, 'NewName'],
         ['CHAR',   1, 'FileLoc']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'FileReply',   6,
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'FileName'],
         ['SHORT',  1, 'NbFiles'],
         ['SHORT',  1, 'NbFile'],
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'ChangeDir',   7, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'NewDir'],
         ['CHAR',   1, 'FileLoc']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'MakeDir',     8,  
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Dir'],
         ['CHAR',   1, 'FileLoc']
      ]
   );           
   MXCreateMessageClass(mx, dialogclass, 'RemoveDir',   9, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Dir'],
         ['CHAR',   1, 'FileLoc']
      ]
   );   
   MXCreateMessageClass(mx, dialogclass, 'GetDir',      10, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['CHAR',   1, 'FileLoc']
      ]
   );   
   MXCreateMessageClass(mx, dialogclass, 'DirReply',    11, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Dir'],
         ['LONG',   1, 'Error']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'PutError',    12, 
      [
         ['STRING', 1, 'Param'],
         ['LONG',   1, 'Identity'],
         ['SHORT',  1, 'Stop'],
         ['LONG',   1, 'Error']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'AckMessage',  13, 
      [
         ['LONG',   1, 'Identity'],
         ['DWORD',  1, 'Date'],
         ['DWORD',  1, 'Hour'],
         ['LONG',   1, 'Error']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'SendClassConnection', 14, 
      [
         ['STRING',   1, 'Name'],
         ['WORD',     1, 'Port'],
         ['WORD',     1, 'Code'],
         ['STRING',   1, 'TableName'],
         ['BYTE',    1, 'FromTo']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'ReplyClassConnection', 15,
      [
         ['STRING',   1, 'Name'],
         ['LONG',     1, 'Error']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'List',      16, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Name'],
         ['CHAR',   1, 'FileLoc']
      ]
   );   
   MXCreateMessageClass(mx, dialogclass, 'ListReply',   17, 
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Name'],
         ['STRING', 1, 'Access'],
         ['STRING', 1, 'Date'],
         ['BYTE',   1, 'Type'],
         ['LONG',   1, 'Size'],
         ['SHORT',  1, 'NbFiles'],
         ['SHORT',  1, 'NbFile']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'Dir',     18, 
      [  
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Name'],
         ['CHAR',   1, 'FileLoc']
      ]
   );  
   MXCreateMessageClass(mx, dialogclass, 'GDirReply',   19,  
      [
         ['STRING', 1, 'Command'],
         ['LONG',   1, 'Identity'],
         ['BUFFER', 1, 'Buffer']
      ]
   );  

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
   MXAddGeneralCallBack(mx,  DG_SYS, 'PutError'        , MXONRECV, SYS_PutError,        NULL);
    return 1;
}


function MXAddFTPCommands (mx) {

   MXDialogClass * dialogclass;


   dialogclass = MXCreateDialogClass(mx, FTP_SYS, FTP_SYS_CODE);
   MXCreateMessageClass(mx, dialogclass, 'Command', 1 , 
      [ 
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Command_Reply', 2, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['LONG',   1, 'Code'],
         ['STRING', 1, 'Reply']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'dir',     3, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['STRING', 1, 'NetId'],
         ['LONG',   1, 'Port' ]
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'dir_reply',   4,
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['LONG',   1, 'Error'],
         ['STRING', 1, 'NetId'],
         ['LONG',   1, 'Port'],
         ['BUFFER', 1, 'Buffer']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'get',  5, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'FileName'],
         ['STRING', 1, 'DestName'],
         ['CHAR',   1, 'FileType'],
         ['STRING', 1, 'NetId'],
         ['LONG',   1, 'Port'] 
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'get_reply',  7, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['LONG',   1, 'Error'],
         ['STRING', 1, 'NetId'],
         ['LONG',   1, 'Port'],
         ['FILE',   1, 'File']
      ]
   );      
   MXCreateMessageClass(mx, dialogclass, 'put',   6, 
      [
         ['LONG',   1, 'Identity'],
         ['FILE',   1, 'File'],
         ['STRING', 1, 'NetId'],
         ['LONG',   1, 'Port']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'put_reply',  8, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['LONG',   1, 'Error'],
         ['STRING', 1, 'FileName'],
         ['STRING', 1, 'DestName'],
         ['STRING', 1, 'NetId'],
         ['LONG',   1, 'Port']
      ]
   );

   return 1;
}


function MXAddSMTPCommands (mx) {

   MXDialogClass * dialogclass;


   dialogclass = MXCreateDialogClass(mx, SMTP_SYS, SMTP_SYS_CODE);
   MXCreateMessageClass(mx, dialogclass, 'Command',      1 , 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Command_Reply',  2,
      [ 
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['LONG',   1, 'Code'],
         ['STRING', 1, 'Reply']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Send',   3,
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'From'],
         ['STRING', 1, 'To'],
         ['STRING', 1, 'Cc'],
         ['STRING', 1, 'Bcc'],
         ['STRING', 1, 'Object'],
         ['STRING', 1, 'Subject'],
         ['STRING', 1, 'Attachment']
      ]
   );

   return 1;
}


function  MXAddPOPCommands (mx) {

   var dialogclass = MXCreateDialogClass(mx, POP_SYS, POP_SYS_CODE);

   MXCreateMessageClass(mx, dialogclass, 'Command',   1 ,
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Command_Reply',  2, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['LONG',   1, 'Code'],
         ['STRING', 1, 'Reply']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'List_Reply',    3,  
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['STRING', 1, 'Reply'],
         ['LONG',   1, 'Code'],
         ['LONG',   60, 'Number'],
         ['LONG',   60, 'Size'],
         ['LONG',   1, 'TotalNumber'],
         ['LONG',   1, 'TotalSize']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Stat_Reply',    4, 
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['STRING', 1, 'Reply'],
         ['LONG',   1, 'Code'],
         ['LONG',   1, 'TotalNumber'],
         ['LONG',   1, 'TotalSize']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Retr_Reply',   5,
      [
         ['LONG',   1, 'Identity'],
         ['STRING', 1, 'Value'],
         ['STRING', 1, 'Par'],
         ['STRING', 1, 'Reply'],
         ['LONG',   1, 'Code'],
         ['LONG',   1, 'Size'],
         ['STRING', 1, 'Date'],
         ['STRING', 1, 'From'],
         ['STRING', 200, 'To'],
         ['STRING', 200, 'Cc'],
         ['STRING', 200, 'Bcc'],
         ['STRING', 1, 'Subject'],
         ['STRING', 1, 'Body'],
         ['STRING', 1, 'Attachment']
      ]
   );

   return 1;
}

function MXAddFIOPCommands (mx) {

   var dialogclass = MXCreateDialogClass(mx, FIOP_SYS, FIOP_SYS_CODE);
    return 1;
}

function MXAddTCPCommands (mx) {

   var dialogclass = MXCreateDialogClass(mx, TCP_SYS, TCP_SYS_CODE);

   MXCreateMessageClass(mx, dialogclass, 'Stream', 1,
      [
         ['BUFFER', 1, 'Buffer']
      ]
   );
   
   return 1;
}

function MXAddMTCommands (mx) {

   var dialogclass = MXCreateDialogClass(mx, MT_SYS, MT_SYS_CODE);

   MXCreateMessageClass(mx, dialogclass, 'Stream', 1,
      [
         ['BUFFER', 1, 'Buffer']
      ]
   );
   
   return 1;
}


function MXAddDNSCommands (mx) {


   var dialogclass = MXCreateDialogClass(mx, DNS_SYS, DNS_SYS_CODE);

   MXCreateMessageClass(mx, dialogclass, 'Query',  1,
      [
         ['LONG',   1, 'Identity'],
         ['WORD',   1, 'Operation'],
         ['WORD',   1, 'QClass'],
         ['WORD',   1, 'QType'],
         ['STRING', 1, 'Domain'],
         ['BUFFER', 1, 'RecordData']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'Reply',  1,
      [
         ['LONG',   1, 'Identity'],
         ['WORD',   1, 'Operation'],
         ['WORD',   1, 'QClass'],
         ['WORD',   1, 'QType'],
         ['STRING', 1, 'Domain'],
         ['WORD',   1, 'Code'],
         ['WORD',   1, 'AnswerCount'],
         ['WORD',   1, 'AuthorityCount'],
         ['WORD',   1, 'AdditionalCount'],
         ['WORD',   60,'Section'],
         ['STRING', 60,'Name'],
         ['WORD',   60,'Type'],
         ['STRING', 60,'Value']
      ]
   );
   return 1;
}


function MXAddDBCommands (mx) {


   var dialogclass = MXCreateDialogClass(mx, DB_SYS, DB_SYS_CODE);


   MXCreateMessageClass(mx, dialogclass, 'ExecuteQuery',       1,  
      [
         ['LONG',    1, 'Identity'],
         ['STRING',  1, 'Name'],
         ['STRING',  1, 'SqlStatement'],
         ['DWORD',   1, 'Every'],
         ['DWORD',   1, 'MaxRows'],
         ['STRING',  1, 'IdentStatic']
      ]
);
   MXCreateMessageClass(mx, dialogclass, 'ExecuteUpdate',   2,  
      [
         ['STRING',  1, 'IdentStatic'],
         ['STRING',  1, 'SqlStatement'],
         ['BYTE',    1, 'Commit']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'ResultHeader',  3,
      [
         ['STRING',    1, 'ClassName'],
         ['STRING',  1, 'QueryName']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'ResultSet',           4, 
      [
         ['LONG',    1, 'RowsNumber'],
         ['BUFFER',  1, 'Buffer'],
         ['BYTE',    1, 'LastContext']
      ]
   );   
   MXCreateMessageClass(mx, dialogclass, 'AckStatement',    5,
      [
         ['LONG',    1, 'Identity'],
         ['LONG',    1, 'RowsProcessed'],
         ['LONG',    1, 'SqlCode'],
         ['STRING',  1, 'SqlErrMsg'],
         ['STRING',  1, 'SqlStatement'],
         ['SHORT',   1, 'Print'],
         ['SHORT',   1, 'Stop']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'DisconnectClient',    6,
      [
         ['BYTE',       1, 'Commit']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'CommitOrRollback',    7,
      [  
         ['BYTE',       1, 'Commit']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'CancelStatement',     8, 
      [
      ]
   );   
   MXCreateMessageClass(mx, dialogclass, 'AskShow',     9,
      [  
         ['STRING',  1, 'SqlStatement'],
         ['BYTE',       1, 'StorageType']
      ]
   );
   MXCreateMessageClass(mx, dialogclass, 'ReceiveShowBuffer',   10,
      [ 
         ['BUFFER',  1, 'Buffer'],
         ['BYTE',       1, 'LastContext']
      ]     
   );
   return 1;
}


function  MXAddHTTPCommands (mx) {
   var dialogclass = MXCreateDialogClass(mx, HTTP_SYS, HTTP_SYS_CODE);

   var messageclass = MXCreateMessageClass(mx, dialogclass, 'Request',    1, 
      [
         ['STRING',   1,     'Request-Line'],
         ['STRING',   1,     'Cache-Control'],
         ['STRING',   1,     'Connection'],
         ['STRING',   1,     'Date'],
         ['STRING',   1,     'Pragma'],
         ['STRING',   1,     'Trailer'],
         ['STRING',   1,     'Transfer-Encoding'],
         ['STRING',   1,     'Upgrade'],
         ['STRING',   1,     'Via'],
         ['STRING',   1,     'Warning'],
         ['STRING',   1,     'Accept'],
         ['STRING',   1,     'Accept-Charset'],
         ['STRING',   1,     'Accept-Encoding'],
         ['STRING',   1,     'Accept-Language'],
         ['STRING',   1,     'Authorization'],
         ['STRING',   1,     'Expect'],
         ['STRING',   1,     'From'],
         ['STRING',   1,     'Host'],
         ['STRING',   1,     'If-Match'],
         ['STRING',   1,     'If-Modified-Since'],
         ['STRING',   1,     'If-None-Match'],
         ['STRING',   1,     'If-Range'],
         ['STRING',   1,     'If-Unmodified-Since'],
         ['STRING',   1,     'Max-Forwards'],
         ['STRING',   1,     'Proxy-Authorzation'],
         ['STRING',   1,     'Range'],
         ['STRING',   1,     'Referer'],
         ['STRING',   1,     'TE'],
         ['STRING',   1,     'User-Agent']
      ]
   );
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Allow');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-Encoding');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-Language');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-Length');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-Location');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-MD5');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-Range');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Content-Type');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Expires');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Last-Modified');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Proxy-Connection');
   MXAddObjectToMessageClass  (messageclass, 'STRING',   1,     'Cookie');
   MXAddObjectToMessageClass  (messageclass, 'BUFFER',   1,     'Content');


   MXCreateMessageClass(mx, dialogclass, 'Response',  2,
      [
         ['STRING',   1,     'Status-Line'],
         ['STRING',   1,     'Cache-Control'],
         ['STRING',   1,     'Connection'],
         ['STRING',   1,     'Date'],
         ['STRING',   1,     'Pragma'],
         ['STRING',   1,     'Trailer'],
         ['STRING',   1,     'Transfer-Encoding'],
         ['STRING',   1,     'Upgrade'],
         ['STRING',   1,     'Via'],
         ['STRING',   1,     'Warning'],
         ['STRING',   1,     'Accept-Ranges'],
         ['STRING',   1,     'Age'],
         ['STRING',   1,     'Etag'],
         ['STRING',   1,     'Location'],
         ['STRING',   1,     'Proxy-Connection'],
         ['STRING',   1,     'Retry-After'],
         ['STRING',   1,     'Server'],
         ['STRING',   1,     'Vary'],
         ['STRING',   1,     'WWW-Authenticate'],
         ['STRING',   1,     'Allow'],
         ['STRING',   1,     'Content-Encoding'],
         ['STRING',   1,     'Content-Language'],
         ['STRING',   1,     'Content-Length'],
         ['STRING',   1,     'Content-Location'],
         ['STRING',   1,     'Content-MD5'],
         ['STRING',   1,     'Content-Range'],
         ['STRING',   1,     'Content-Type'],
         ['STRING',   1,     'Expires'],
         ['STRING',   1,     'Last-Modified'],
         ['STRING',   1,     'P3P'],
         ['BUFFER',   1,     'Content']
      ]
   );
   return 1;
}

export  { 
   MXInit,
   MXEnd, 
   MXCreateDialogClass,
   MXFreeDialogClass,
   MXCreateMessageClass,
   MXFreeMessageClass,
   MXCreateComClass, 
   MXFreeComClassFromName,
   MXFreeComClass ,
   MXCreateMessage,
   MXFreeMessage,
   MXFreeObject,
   MXFreeCom,
   MXAddObjectToMessageClass ,
   MXFreeObjectsFromMessageClass ,
   MXGetPort,
   MXAddPort ,
   MXLoadResourceFile ,
   MXDispatchEvents ,
   MXSetValue ,
   MXGetValue,
   MXSetRangeValue,
   MXGetRangeValue,
   MXGetName,
   MXGetType,
   MXGetInternalType,
   MXGetInternalLength,
   MXGetInternalScale,
   MXSetMessageStatut,
   MXSetMessageDateHour,
   MXOpenTCP,
   MXOpenBase,
   MXOpenFile,
   MXCloseCom,
   MXFlushCom,
   MXPutMessage,
   MXPutThisMessage,
   MXJoinCom,
   MXGetComFromClient,
   MXAddDGCommands,
   MXAddFTPCommands,
   MXAddPOPCommands,
   MXAddSMTPCommands,
   MXAddTCPCommands,
   MXAddMTCommands,
   MXAddDBCommands,
   MXAddFIOPCommands,
   MXAddHTTPCommands,
   MXAddDNSCommands,
   MXCopyMessage ,
   MXTranferOutputQueue,
   MXGetComClassFromName,
   MXGetComClassFromCode,
   MXGetDialogClassFromName,
   MXGetDialogClassFromCode,
   MXGetMessageClassFromName,
   MXGetMessageClassFromCodes,
   MXGetMessageClassFromNames,
   MXGetObjectFromName,
   MXGetProtocolFromName,
   MXSetComProtocol,
   MXReadyToSend,
   MXGetReadyOutputMessage,
   MXGetReadyInputMessage ,
   MXFindIncompleteMessage,
   MXCheckType2,
   MXFreeContext,
   MXAllocateContext,
   MXExtendValueBuffer,
   MXGetMessageSize,
   MXGetMessageClassSize,
   MXSetIOMessageClass,
   MXSetIOSize,
   MXGetFileSize,
   MXGetBufferSize ,
   MXEstablishConnectionOn ,
   MXSetCom,
   MXExecuteApplicationProcedure,
   MXReadMessageStatut,
   MXWriteBufferContent,
   MXFindMessage ,
   MXReadFileContent,
   MXReadBufferContent,
   MXWriteFileContent,
   MXCreateMessageFromCodes,
   MXAllocMessage,
   MXInitValues,
   MXSetMode,
   MXSend,
   MXRecv,
   MXInitMessage ,
   MXFreeAndMoveComIn ,
   MXSetFileValue ,
   MXSetBufferValue ,
   MXSetStringValue ,
   MXFindApplicationProcedure,
   MXFindCallBack,
   MXFindGeneralCallBack,
   MXFindComCallBack,
   MXAddGeneralCallBack,
   MXRemoveGeneralCallBack,
   MXAddApplicationProcedure,
   MXRemoveApplicationProcedure,
   MXAddGeneralConnectCallBack,
   MXRemoveGeneralConnectCallBack,
   MXAddConnectCallBack,
   MXRemoveConnectCallBack,
   MXAddCallBack,
   MXRemoveCallBack,
   MXAddComCallBack,
   MXRemoveComCallBack ,
   MXAddEndingProcedure ,
   MXRemoveEndingProcedure,
   MXSetCGIFile
}