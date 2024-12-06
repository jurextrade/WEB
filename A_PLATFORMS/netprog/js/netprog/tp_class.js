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


const TPMaxClients                = SOCKMAX;
const TPNumberClientInHistory     = 10;
const TP_OK                       =  0;
const TP_NOK                      = -1;
const TPSERVER                    =  1;
const TPCLIENT                    =  0;
const TPBUFOUTPUTSIZE             =  BUFSIZE ;        /* max size of transmission  TP - 2    */


function TPOutputPending(tp)              { return (OSANYSET(tp.OutputPending))}
function TPInputPending(tp)               { return (OSANYSET(tp.InputPending))}
function TPConnectionPending(tp)          { return (OSANYSET(tp.ConnectionPending))}
function TPClientsWithInput(tp)           { return (OSANYSET(tp.ClientsWithInput))}
function TPClientsWithOutput(tp)          { return (OSANYSET(tp.ClientsWithOutput))}
function TPClientsWithFileInput(tp)       { return (OSANYSET(tp.ClientsWithFileInput))}
function TPClientsWithFileOutput(tp)      { return (OSANYSET(tp.ClientsWithFileOutput))}
function TPClientsWithBaseInput(tp)       { return (OSANYSET(tp.ClientsWithBaseInput))}
function TPClientsWithBaseOutput(tp)      { return (OSANYSET(tp.ClientsWithBaseOutput))}
function TPGetClient(ptp, s)              { return (tp.Clients[tp.ConnectionTranslation[s]])}

function TPNextClientWithOutput(tp)       {return TPGetClient(ptp, TPGetNextDescriptor(ptp, tp.ClientsWithOutput))}
function TPNextClientWithInput(tp)        {return TPGetClient(ptp, TPGetNextDescriptor(ptp, tp.ClientsWithInput))}
function TPNextInputPending(tp)           {return TPGetClient(ptp, TPGetNextDescriptor(ptp, tp.InputPending))}
function TPNextOutputPending(tp)          {return TPGetClient(ptp, TPGetNextDescriptor(ptp, tp.OutputPending))}
function TPNoMoreTCPClient(tp)            { return (!OSANYSET(tp.AllClients))} 
function TPNoMoreClient(tp)               { return (!OSANYSET(tp.AllClients) && !OSANYSET(tp.AllFileClients) && !OSANYSET(tp.AllBaseClients))}
function TPClientIsBlocked(client)        { return (OSGETBIT(client.TP.ClientsWriteBlocked, client.Pipe.fd) ? 1 : 0)}
function TPClientWithOutput(client)       { return (OSGETBIT(client.TP.ClientsWithOutput, client.Pipe.fd) ? 1 : 0)}
function TPClientWithFileOutput(client)   { return (OSGETBIT(client.TP.ClientsWithFileOutput, client.Index + 1) ? 1 : 0)}
function TPClientWithBaseOutput(client)   { return (OSGETBIT(client.TP.ClientsWithBaseOutput, client.Index + 1) ? 1 : 0)}
function TPGetUserField(client)           { return (client).UserField}
function TPSetUserField(client,pfield)    { return ((client).UserField = pfield)}
function TPGetApplicationField(client)    { return (client).ApplicationField}
function TPSetPointerField(client,pfield) { return ((client).PointerField = pfield)}
function TPIsServer(tp)                   { return (tp.Mode == TPSERVER)}




function TPRequest() {
    this.Size;
}


function TPPort() {
    this.fd;
    this.Port;
    this.Protocol;
    this.Clients = [];
}


function TPbuf() {
    this.Buf;
    this.Count;
}

function TP() {
    this.WellKnownConnections = new Uint32Array(MaskCount);          /*!< All Listening sockets          */
    this.LocalListening = new Uint32Array(MaskCount);                /*!< local listening sockets        */
    this.DistantListening = new Uint32Array(MaskCount);              /*!< distant listening sockets      */
    this.ConnectionPending = new Uint32Array(MaskCount);             /*!< Any connection pending ?       */
    this.AllSockets = new Uint32Array(MaskCount);                    /*!< all sockets listen & comm      */
    this.AllClients = new Uint32Array(MaskCount);                    /*!< all comm                       */
    this.AllFileClients = new Uint32Array(MaskCount);                /*!< all files                      */
    this.AllBaseClients = new Uint32Array(MaskCount);                /*!< all bases                      */
    this.LastSelectMask = new Uint32Array(MaskCount);                /*!< mask for listen & read         */
    this.ClientsWithInput = new Uint32Array(MaskCount);              /*!< still input not processed      */
    this.ClientsWithOutput = new Uint32Array(MaskCount);             /*!< still output not processed     */
    this.ClientsWithFileInput = new Uint32Array(MaskCount);          /*!< still file input not processed */
    this.ClientsWithFileOutput = new Uint32Array(MaskCount);         /*!< still file output not processed*/
    this.ClientsWithBaseInput = new Uint32Array(MaskCount);          /*!< still base input not processed */
    this.ClientsWithBaseOutput = new Uint32Array(MaskCount);         /*!< still base output not processed*/
    this.ClientsWriteBlocked = new Uint32Array(MaskCount);           /*!< all comm  blocked in output    */
    this.OutputPending = new Uint32Array(MaskCount);                 /*!< all comm not blocked in output */
    this.InputPending = new Uint32Array(MaskCount);                  /*!< all comm with input not read   */
    this.SavedAllClients = new Uint32Array(MaskCount);
    this.SavedAllSockets = new Uint32Array(MaskCount);
    this.SavedClientsWithInput = new Uint32Array(MaskCount);
    this.SavedClientsWithOutput = new Uint32Array(MaskCount);
    this.SavedClientsWithFileInput = new Uint32Array(MaskCount);
    this.SavedClientsWithFileOutput = new Uint32Array(MaskCount);
    this.SavedClientsWithBaseInput = new Uint32Array(MaskCount);
    this.SavedClientsWithBaseOutput = new Uint32Array(MaskCount);
    this.CurrentMaxClients = 0;
    this.NextFreeClientId  = 0;
    this.GrabInProgress = FALSE;
    this.AnyClientsWriteBlocked = FALSE;                              /*!< any comm blocked in output ?   */
    this.Clients = [];                                                /*!< all clients struct  struct _TPClient**/
    this.ConnectionTranslation = [];
    this.Name = '';
    this.AppliName = '';
    this.Mode = TPCLIENT;                                             /*!< server or client               */
    this.History = [];
    this.ClientHistoryNumber = 0;                                     /*!< number of client in hist       */
    this.ListeningPorts = [];
    this.ApplicationProcedures = [];
    this.ConnectionProcedures = [];
    this.XF;                                                          /*!< syntax         XF*                */
    this.OS;                                                          /*  OS**/
}

function TPClient() {
    this.TP;
    this.Index;
    this.Type;                         /*!< local or distant or file      */
    this.ClientGone;
    this.NoClientException;
    this.ErrorIndex;                   /*!< zero means no error            */
    this.WithUserId;               /*!< the peer adress                */
    this.WithName;
    this.Pipe;
    this.RequestBuffer;                /*!< the last request received      */
    this.RequestSize;
    this.TransBuffer;
    this.TransSize;
    this.ApplicationField;             /*!< connect to a higher level      */
    this.EndingProcedures = [];
    this.ReadFunction    = function (tp, client) {};
    this.WriteFunction   = function (tp, client, buf, Count) {};
    this.SendFunction    = function (tp, client, buf, bufsize) {};
    this.ReceiveFunction = function (tp, client, buf, Count) {};
    this.ReceiptSize;
    this.TransferSize;
    this.CommunicationTime;
    this.Blocked;                      /*!< client is in blocking mode     */
    this.Connect;                      /*!< should be TCP                  */
    this.Protocol;
    this.OnPort;                       /*!< on which port it was connected */
    this.UserField = [];                    /*!< user field for programming     */
    this.PointerField;                 /*!< user field for programming     */
}



function TPApplicationProcedure() {
    this.ApplicationField;
    this.ExecuteProcedure;             // (tp, app);
}


function TPConnectionProcedure() {
    this.ApplicationField;
    this.ExecuteProcedure;             // (client, app);
}


function TPEndingProcedure() {
    this.ApplicationField;
    this.EndingProcedure;              // (com, app);                    /* close call this */
}
/*
    extern int       TPInit (TP* tpp, char* name, char* appliname);
    extern int       TPSendIfAnyOutput (TP* ptp, void* par) ;
    extern int       TPRecvIfAnyInput  (TP* ptp, void* par) ;
    extern BOOL      TPExecuteApplicationProcedures (TP* ptp);



    extern int       TPListenToLocal (TP* tpp);
    extern int       TPListenToTCP (TP* tpp, int Port, int protocol);

    extern TPPort*   TPFindPortFromFd (TP* ptp, int listenid);

    extern TPClient* TPEstablishConnectionWith (TP* tpp, char* machinname, int port, int protocol, char* user, char* appli, BOOL Block);
    extern TPClient* TPOpenFile (TP* ptp, char* filename, char* mode, int protocol, char loc, int Size);
    extern TPClient* TPOpenBase (TP* ptp, char* databasename, char* username, char* password, int protocol);

    extern TPClient* TPCreateClientWithFd (TP* ptp, int fd);
    extern TPClient* TPCreateClientWithFileId (TP* ptp, FILEID* fileid);
    extern TPClient* TPEstablishConnectionOn (TP* ptp, int listenid);
    extern TPClient* TPTakeConnection (TP* ptp, char* name, char* subtaskname, int from);
    extern TPClient* TPNextAvailableClient (TP* ptp);
    extern TPClient* TPCreateInetClient (TP*ptp, int type);
    extern int       TPEstablishAllNewConnections (TP* ptp);
    extern int       TPGiveConnection (TP* ptp, TPClient* client, char* name);
    extern void      TPCloseDownConnection (TP* ptp, TPClient* client);
    extern void      TPCloseDownClient (TP* ptp, TPClient* client);
    extern void      TPKillAllClients (TP* ptp);
    extern void      TPCloseDamagedConnections (TP* ptp);
    extern int       TPCheckConnection (TP* ptp, TPClient* client);
    extern void      TPOnlyListenToOneClient (TP* ptp, TPClient* client);
    extern void      TPListenToAllClients (TP* ptp);
    extern void      TPIgnoreClient (TP* ptp, TPClient* client);
    extern void      TPAttendClient (TP* ptp, TPClient* client);
    extern int       TPFlushClient (TP* ptp, TPClient* client);
    extern int       TPWaitForSomething (TP* ptp, DWORD milliseconds);
    extern int       TPWaitForConnections (TP* ptp);
    extern void      TPCloseListeningConnections (TP* ptp);

    extern int       TPGetNextDescriptor (TP* ptp, long* mask);
    extern int       TPNextConnectionPending (TP* ptp);

    extern void      TPSetClientProtocol (TP* ptp, TPClient* client, int protocol);

    extern int       TPReadRequestFromClient (TP* ptp, TPClient* client);
    extern int       TPWriteRequestToClient (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadIcmpFromClient (TP* ptp, TPClient* client);
    extern int       TPWriteIcmpToClient (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadIpFromClient (TP* ptp, TPClient* client);
    extern int       TPWriteIpToClient (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadUdpFromClient (TP* ptp, TPClient* client);
    extern int       TPWriteUdpToClient (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadTcpFromClient (TP* ptp, TPClient* client);
    extern int       TPWriteTcpToClient (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadDNSFromClient (TP* ptp, TPClient* client);
    extern int       TPWriteDNSToClient (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadRequestFromFile (TP* ptp, TPClient* client);
    extern int       TPWriteRequestToFile (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadStreamFromFile (TP* ptp, TPClient* client);
    extern int       TPWriteStreamToFile (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPWriteStreamToBase (TP* ptp, TPClient* client, char* buf, int size);
    extern int       TPReadStreamFromFile(TP* ptp, TPClient* client);
    extern int       TPReadStreamFromBase(TP* ptp, TPClient* client);


    extern int       TPRead (TP* ptp, TPClient* client);
    extern int       TPWrite (TP* ptp, TPClient* client, char* buffer , int size);
    extern LONG      TPDispatchOutput (TP* ptp, TPClient* client, int TimeToYield);
    extern LONG      TPFlushClientOutput (TP* ptp, TPClient* client);
    extern LONG      TPDispatchInput (TP* ptp, TPClient* client, int TimeToYield);
    extern LONG      TPDispatchEvents (TP* ptp, DWORD milliseconds);

    extern LONG      TPDefaultSend (TP* ptp, TPClient* client, char* buf, int bufsize);
    extern LONG      TPDefaultReceive (TP* ptp, TPClient* client, char* buf, int count);

    extern LONG      TPReceiveBuf (TP* ptp, TPClient* client, char* buf, int count);
    extern LONG      TPSendBuf (TP* ptp, TPClient* client, char* buf, int count);

    extern TPBuf*    TPAllocBuf (char* buf, int count);
    extern int       TPJoinClients (TP* ptp, TPClient* client, TPClient* pclient1);




    extern int       TPSetBlockingMode (TPClient* client, BOOL blocking);
    extern void      TPConnectionOK (TP* ptp, TPClient* client);
    extern void      TPSetReadFunction (TP* ptp, TPClient* client,int (*proc) (TP* ptp, TPClient* client));
    extern void      TPSetWriteFunction (TP* ptp, TPClient* client, int (*proc) (TP* ptp, TPClient* client,char* buf, int Count));

    extern void      TPSetSendFunction (TP* ptp, TPClient* client,LONG (*proc) (TP* ptp, TPClient* client, char* buf, int size));
    extern void      TPSetReceiveFunction (TP* ptp, TPClient* client, LONG (*proc) (TP* ptp, TPClient* client,char* buf, int Count));



    extern WORD      TPGetRequestLength (char* buffer);
    extern WORD      TPGetIpLength (char* buffer);
    extern WORD      TPGetIpHeaderLength (char* buffer);

    extern void      TPSetRequestLength (char* buffer, WORD size);
    extern void      TPSetIpLength (char* buffer, WORD size);
    extern void      TPSetIpHeaderLength (char* buffer, WORD size);

    extern WORD      TPGetIcmpLength (char* buffer);
    extern void      TPSetIcmpLength (char* buffer, WORD size);

    extern WORD      TPGetDNSLength (char* buffer);
    extern void      TPSetDNSLength (char* buffer, WORD size);


    extern BYTE      TPGetIpProtocol (char* buffer);
    extern void      TPSetIpProtocol (char* buffer, BYTE protocol);


    extern DWORD     TPGetIpSourceAddress (char* buffer);
    extern DWORD     TPGetIpDestinationAddress (char* buffer);

    extern void      TPSetIpSourceAddress (char* buffer, DWORD ipadress);
    extern void      TPSetIpDestinationAddress (char* buffer, DWORD ipadress);


    extern WORD      TPGetTcpSourcePort (char* buffer);
    extern void      TPSetTcpSourcePort (char* buffer, WORD SourcePort);

    extern WORD      TPGetTcpDestinationPort (char* buffer);
    extern void      TPSetTcpDestinationPort (char* buffer, WORD DestPort);

    extern int       TPAddApplicationProcedure (TP* ptp, int (*funct)(TP*, void*), void* applicationfield);
    extern int       TPRemoveApplicationProcedure (TP* ptp, int (*funct)(TP*, void*), void* applicationfield);

    extern TPApplicationProcedure* TPFindApplicationProcedure (List* ExecuteList, int (*funct)(TP*, void*));
    extern int       TPAddConnectionProcedure (TP* ptp, int (*funct)(TPClient*, void*), void* applicationfield);
    extern int       TPRemoveConnectionProcedure (TP* ptp, int (*funct)(TPClient*, void*), void* applicationfield);
    extern TPConnectionProcedure* TPFindConnectionProcedure (List* ExecuteList, int (*funct)(TPClient*, void*));
    extern int       TPRemoveEndingProcedure (TPClient* pcmlient, int (*funct)(TPClient* ,void*), void* appfield);
    extern TPEndingProcedure* TPFindEndingProcedure (List* ExecuteList, int (*funct)(TPClient*, void*), void* appfield);
    extern int       TPAddEndingProcedure (TPClient* client, int (*funct)(TPClient* , void*), void* appfield);
    extern int       TPSetEndingProcedure(TPClient* client, int (*funct) (TPClient*, void*));
    extern int       TPSetApplicationField(TPClient* client, void* pfield);
    extern LONG      TPReceiveBuf (TP* ptp, TPClient* client, char* buf, int count);
    extern LONG      TPSendBuf (TP* ptp, TPClient* client, char* buf, int count);



    extern int       TPLoadResourceFile(TP* ptp, char* Filename);

    extern void      TPEnd (TP* ptp);
*/