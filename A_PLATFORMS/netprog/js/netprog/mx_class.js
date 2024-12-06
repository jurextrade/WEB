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


const MXSizeExtension      = 100;
const MXSizeAddress        = 16;

const MXAccessSize         = 30; 
const MXDateSize           = 30;


const MXAppliSizeName      = 32;
const MXSizeName           = 100;
const MXSizeDescription    = 500;
const MXSizeFileName       = 250;


const MXMaxMessages         = 50;
const MXMaxClasses          = 50;
const MXMaxObjects          = 150;

const MXNumberComInHistory  = TPNumberClientInHistory;
const MXMessageHeaderSize   = 12;
const MXMessageStatutSize   = 25;

const MXBUFVALUESIZE   = 4096;       /* values without file contents       */
const MXBUFFILESIZE    = MAXBUFSIZE;

const MXONRECV      = 1;
const MXONSEND      = 2;
const MXONACK       = 3;
const MXONSTORE     = 4;
const MXONREAD      = 5; 
const MXONWRITE     = 6; 
const MXONPUT       = 7; 
const MXONGET       = 8; 

const MXONCONNECT   = 9;
const MXONCLOSE     = 10; 
const MXONBROKEN    = 11; 
const MXONRECEIVING = 12;
const MXONSENDING   = 13;

const MXNORMAL      = 0;
const MXACK         = 1;

const MXSHORT       = 1;
const MXLONG        = 2;
const MXWORD        = 3;
const MXDWORD       = 4;
const MXBYTE        = 5;
const MXFILE        = 6;
const MXSTRING      = 7;
const MXCHAR        = 8;
const MXBUFFER      = 9;
const MXDOUBLE      = 10;

/* del with communication */

const MXMaxCom       = TPMaxClients;
const MXBlock        = TRUE;
const MXNoBlock      = FALSE;

const MXFROM         = 0;
const MXTO           = 1;

const MXSERVER       = TPSERVER;
const MXCLIENT       = TPCLIENT;

function MXFileProcessing(message)                    {return message.Context.File}
function MXBufferProcessing(message)                  {return message.Context.Buffer}
function MXGetComFromMessage(pmessage)                {return pmessage.Com}
function MXGetSize(pmessage)                          {return pmessage.Size}
function MXGETMODE(mx)                                {return mx.Mode}
function MXIsServer(mx)                               {return (mx.TP.Mode == MXSERVER)}
function MXGetSendSize(com)                           {return com.Client.TransferSize}
function MXGetRecSize(com)                            {return com.Client.ReceiptSize}
function MXSetTraceProcedure(com, proc)               {com.TraceProcedure = proc}
function MXSetComApplicationField(com, appfield)      {com.ApplicationField = appfield}
function MXSetConnectingProcedure(mx, proc, appfield) {mx.ConnectingProcedure = proc; mx.ConnectingField = appfield}
function MXGetWithUserOnCom(com)                      {return com.Client.WithUserId}
function MXGetWithNameOnCom(com)                      {return com.Client.WithName}
function MXGetApplicationField(com)                   {return com.ApplicationField}
function MXGetEstablish(com)                          {return com.Client.Connect}
function MXComIsBlocked(com)                          {return TPClientIsBlocked(com.Client)}
function MXGetNbrObjects(pmessage)                    {return pmessage.MessageClass.Objects.length}
function MXGetNbrRows(pmessage)                       {return pmessage.NbrRows}

const DG_SYS            = 'DG';  
const CB2A_SYS          = 'CB2A'; 
const FTP_SYS           = 'FTP';                  
const TCP_SYS           = 'TCP';
const MT_SYS            = 'MT';
const POP_SYS           = 'POP';                  
const SMTP_SYS          = 'SMTP';                   
const HTTP_SYS          = 'HTTP';                   
const DNS_SYS           = 'DNS';                   
const FIOP_SYS          = 'FIOP';                   
const DB_SYS            = 'DB';                 
const DL_SYS            = 'SC';                 

const FTP_SYS_CODE      = 21;
const TCP_SYS_CODE      = 0;
const MT_SYS_CODE       = 2010;
const POP_SYS_CODE      = 110;
const SMTP_SYS_CODE     = 25;
const HTTP_SYS_CODE     = 80;
const DNS_SYS_CODE      = 53;
const FIOP_SYS_CODE     = 10000;
const DG_SYS_CODE       = 30000;
const DB_SYS_CODE       = 30001;
const DL_SYS_CODE       = 30002;
const CB2A_SYS_CODE     = 30003;

function MX() {
   this.AppliName = '';           /* char    Application Name                 */
   this.DialogClasses= [];        /* List*                                    */
   this.ComClasses= [];           /* List*                                    */
   this.Communications= [];       /* List*                                    */
   this.ComHistoryNumber= 0;      /* int     number of com in hist            */
   this.ComHistory= [];           /* List*                                    */
   this.ApplicationProcedures= [];/* List*   Application Procedures           */
   this.ConnectionProcedures= []; /* List*   General Connect  Callbacks       */
   this.EndingProcedures= [];     /* List*   General Ending   Callbacks       */
   this.ExecuteOutputs= [];       /* List*                                    */
   this.ExecuteInputs= [];        /* List*                                    */
   this.ExecuteAck= [];           /* List*                                    */
   this.TP = null;                /* TP*     transport protocol               */
   this.CGI = null;               /* CGI*                                     */
   this.Manager = null;           /* struct _MXManager*                       */
/*
   this.MXInit = MXinit;
   this.MXEnd  = function(){};
   this.MXOpenTCP  (machiname, port, protocol, user, appliname, block);  // returns MXCom;
   this.MXOpenBase (databasename, username, password, protocol, block);
   this.MXOpenFile (filename, mode, protocol, loc, size);   
*/   
}

/*----------------------------------------------------------------------------*/
/* BEGIN DIALOG ENTITIES                                                      */
/*----------------------------------------------------------------------------*/

function MXObject() {
   this.Name = '';           /* char   ATTRIBUT may be optional               */
   this.Type;                /* BYTE   code INT, WORD, DWORD, STRING,...      */
   this.Size;                /* WORD   in case of ARRAYS                      */
   this.Offset;              /* DWORD  Offset in the stream we find values    */
   this.InternalType;        /* SHORT  type for Database                      */
   this.InternalLength;      /* LONG   size for Database                      */
   this.InternalScale;       /* LONG   scale forDataBase                      */
   this.MessageClass;        /* struct _MXMessageClass*                       */
}


function MXMessageClass() {
   this.Name;                /* char   ATTRIBUT or message name               */
   this.Objects = [];        /* List*  list of MXObjects                      */
   this.Code;                /* WORD   code of the message                    */
   this.Size;                /* DWORD  check size who knows ?                 */
   this.ExecuteOutputs = []; /*List*                                          */
   this.ExecuteInputs = [];  /*List*                                          */
   this.ExecuteAck = [];     /*List*                                          */
   this.BlockedOnOutput;     /*BOOL                                           */
   this.BlockedOnInput;      /*BOOL                                           */
   this.Class;               /*struct _MXDialogClass*                         */
}


function MXDialogClass() {
   this.Name;                /*char   ATTRIBUT or dialog name                 */
   this.MessageClasses = []; /*List*  list of all messages                    */
   this.Code;                /*WORD   code of the class                       */
   this.MX;                  /*struct _MX*                                    */
}

/*----------------------------------------------------------------------------*/
/* END PHYSICAL ENTITIES                                                      */
/*----------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------*/
/* END DIALOG ENTITIES                                                        */
/*----------------------------------------------------------------------------*/

function MXComClass() {
   this.Name;                      /* ATTRIBUT or dialog name                */
   this.Objects;                   /* list of MXObjects                      */
   this.Code;                      /* code of the class                      */
   this.Port;
   this.TableName;
   this.FromToTranscod;            /* which side of com transcoding...       */
   this.Protocol;
   this.FileName;
   this.FileAttributes;
   this.UserName;                  /* User Name Database                     */
   this.PassWord;                  /* User Name Database                     */
   this.ExecuteOutputs = [];
   this.ExecuteInputs = [];
   this.ExecuteAck = [];
   this.ConnectionProcedures = []; /* General Connect Callbacks              */
   this.EndingProcedures = [];     /* General Ending  Callbacks              */
}

/*  Communication */

function MXCom() {
   this.MX;
   this.XF;
   this.Protocol;
   this.Closed;
   this.OutputMessages = [];
   this.InputMessages = [];
   this.AckMessages = [];
   this.ActiveInputMessages = [];
   this.ActiveOutputMessages = [];
   this.CloseTime;                 /* time closing com                        */
   this.OpenTime;                  /* time opening com                        */
   this.InputHistory = [];         /* input messages in history               */
   this.OutputHistory = [];        /* output messages in history              */
   this.ExecuteOutputs = [];
   this.ExecuteInputs = [];
   this.ExecuteOutputStream = [];
   this.ExecuteInputStream = [];
   this.ExecuteAck = [];
   this.EndingProcedures = [];     /* related to com CallBacks                */
   this.InternalField;
   this.ApplicationField;
   this.MessagesId;
   this.ComClass;
   // this.Client;     TP Client
   this.TraceProcedure; //= funtion (pmessage, type, stream, size);
   this.OMessageClass;             /* Only for file reading _MXMessageClass*/
}

/*----------------------------------------------------------------------------*/
/* A message can be transmitted in several parts each part has the following  */
/* format : <RequestSize1><MessageHeadder1><Stream1>   ...                    */
/* for a message, MessageHeader is the same except the Part Value             */
/* Every Message have a unique identity                                       */
/*----------------------------------------------------------------------------*/


function MXMessageHeader() {
   this.Identity;                  /*!< identity of the message                */
   this.Size;                      /*!< size of the whole message              */
   this.ClassCode;                 /*!< Class Code                             */
   this.MessageCode;               /*!< message Code                           */
   this.Part;                      /*!< Message sent in several parts          */
}


function MXMessageStatut() {
   this.Type;                      /*!< NORMAL, ACK, STORE                     */
   this.TDate;                     /*!< Transfer Date                          */
   this.THour;                     /*!< Transfer Time                          */
   this.PDate;                     /*!< Put Date                               */
   this.PHour;                     /*!< Put Hour                               */
   this.DDate;                     /*!< Departure Date                         */
   this.DHour;                     /*!< Departure Hour                         */
   this.ADate;                     /*!< Arrival Date in case of ACK            */
   this.AHour;                     /*!< Arrival Hour in case of ACK            */
}

/* Warning : compiling mx.cpp in medium model won't work because we call       */
/* fopen functions which work on near pointers. we should have opening         */
/* file functions that are supported by windows API                            */


function MXMessageContext() {
    /* I/O context */
   this.File;                      /*!< this is the case of I/O files           */
   this.Buffer;                    /*!< this is the case of I/O Buffer          */
   this.Pos;                       /*!< position in the file or in the buffer   */
   this.Stream;                    /*!< buffer file or buffer stream            */
   this.StreamPos;                 /*!< Position in FileBuffer                  */
   this.StreamSize;                /*!< Size of FileBuffer                      */
   this.ObjectOffset;              /*!< this can be object range in the message */
   this.SizeOffset;                /*!< this is the size offset in the object   */
   this.StillToRead;               /*!< what is left to read for this message   */
};

function MXMessage() {
   this.Class;                     /*!< points to MX Class  MXDialogClass       */
   this.MessageClass;              /*!< points to Message Class  MessageClass   */
   this.Context = NULL;            /*!< MXMessageContextmessage isseveral parts */
   this.Com = NULL;                /*!< To which com it belongs MXCom           */
   this.InternalField = NULL;      /*!< For internal purposes                   */ 
   this.Part = 0;                  /*!< part of the message                     */
   this.Stream = NULL;             /*!< stream contains values of objects       */
   this.StreamSize = 0;            /*!< size of stream                          */
   this.Values = NULL;             /*!< values is an array  to offset in stream */
   this.Offset = 0;                /*!< offset in the Stream of values          */
   this.Size = 0;                  /*!< Size of the message with it values      */
   this.Complete = 0;              /*!< whole message is received or sent       */
   this.Identity = 0;              /*!< message Identity                        */
   this.Statut = 0;                /*!< 0, 1                                    */
   this.Type = MXNORMAL;           /*!< NORMAL, ACK, STORE                      */
   this.NbrRows = 1;               /*!< Nbr of columns in objects of the message*/
   this.EndChar;                   /*!< End reading special char                */
   this.TDate = 0;                 /*!< Transfer Date                           */
   this.THour = 0;                 /*!< Transfer Time                           */
   this.PDate = 0;                 /*!< Put Date                                */
   this.PHour = 0;                 /*!< Put Hour                                */
   this.DDate = 0;                 /*!< Departure Date                          */
   this.DHour = 0;                 /*!< Departure Hour                          */
   this.ADate = 0;                 /*!< Arrival Date in case of ACK             */
   this.AHour = 0;                 /*!< Arrival Hour in case of ACK             */
};



function MXCallBack() {
   this.ApplicationField;
   this.MessageClass;
   this.ExecuteProcedure;    // (MXMessage* pmessage, MXCom* com, void* papp);
}


function MXApplicationProcedure() {
   this.ApplicationField;
   this.ExecuteProcedure;          //MX* mx, void* papp);
}

function MXComCallBack() {
    this.ApplicationField;
    this.ExecuteProcedure;          //MXCom* com, void* pappfield);
}




 
 