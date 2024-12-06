function TPInit (tp, name, appliname) {
    var os = new(OS);

    if (OSInit (os) < 0) {
        OSError ('TEDAG001', 'can not initialize os system');
        return -1;
    }

    tp.OS = os;
/*
    var xf = new(XF);
    if (XFInit (xf, XFLittleEndian, XFAscii) < 0)  {
        OSError ('TEDAG002', NULL);
    }
*/
    tp.XF = null;

/* BASECOM */
    OSCLEARBITS(tp.AllSockets);
    OSCLEARBITS(tp.AllClients);
    OSCLEARBITS(tp.AllFileClients);
    OSCLEARBITS(tp.AllBaseClients);
    OSCLEARBITS(tp.LastSelectMask);
    OSCLEARBITS(tp.ClientsWithInput);
    OSCLEARBITS(tp.ClientsWithOutput);
    OSCLEARBITS(tp.ClientsWithFileOutput);
    OSCLEARBITS(tp.ClientsWithFileInput);
    OSCLEARBITS(tp.ClientsWithBaseOutput);
    OSCLEARBITS(tp.ClientsWithBaseInput);
    OSCLEARBITS(tp.OutputPending);
    OSCLEARBITS(tp.InputPending);
    OSCLEARBITS(tp.SavedAllClients);
    OSCLEARBITS(tp.SavedAllSockets);
    OSCLEARBITS(tp.SavedClientsWithInput);
    OSCLEARBITS(tp.SavedClientsWithOutput);
    OSCLEARBITS(tp.SavedClientsWithFileInput);
    OSCLEARBITS(tp.SavedClientsWithFileOutput);
    OSCLEARBITS(tp.SavedClientsWithBaseInput);
    OSCLEARBITS(tp.SavedClientsWithBaseOutput);
    OSCLEARBITS(tp.ClientsWriteBlocked);
    OSCLEARBITS(tp.WellKnownConnections );
    OSCLEARBITS(tp.LocalListening );
    OSCLEARBITS(tp.DistantListening );
    OSCLEARBITS(tp.ConnectionPending );
    
    for (var i = 0; i < SOCKMAX; i++) {
        tp.ConnectionTranslation[i] = 0;
        tp.Clients[i] = NULL;
    }

    if (name) {
        tp.Name = name;
    }

    if (appliname) {
        tp.AppliName = appliname;
    }

    TPAddApplicationProcedure (tp, TPSendIfAnyOutput, NULL);
    TPAddApplicationProcedure (tp, TPRecvIfAnyInput, NULL);
    
    return 1;
}

function TPFindFdFromPort (tp, port) {
    for (var i = 0; i < tp.ListeningPorts.length; i++) {
        if (tp.ListeningPorts[i].Port == port) {
            return tp.ListeningPorts[i].fd;
        }
    }
    return -1;
}

function TPFindPortFromFd (tp, listenid) {

    for (var i = 0; i < tp.ListeningPorts.length; i++) {
        if (tp.ListeningPorts[i].fd == listenid) {
            return tp.ListeningPorts[i];
        }
    }
    return NULL;
}

function TPCreatePort (tp, socket, port) {
    port = new (TPPort);

    port.Port     = port;
    port.fd       = socket;
    port.Clients  = NULL;
    return port;
}

function TPListenToLocal (tp) {
    var  request;
    
    if ((request = OSOpenLocalSocket (tp.OS, tp.Name, tp.AppliName)) < 0)
        return TP_NOK;
    
    OSBITSET(tp.LocalListening    , request);
    OSBITSET(tp.WellKnownConnections, request);
    OSBITSET(tp.AllSockets, request);
    return request;
}

function TPListenToTCP (tp, Port, Protocol) {
    var request;
   
    if ((request = OSOpenTcpSocket (tp.OS, Port)) < 0) {
        return TP_NOK;
    }        

    var port = TPCreatePort (tp, request, Port);
    port.Protocol = Protocol;

    tp.ListeningPorts.push(port);
    tp.Mode = TPSERVER;

    OSBITSET(tp.DistantListening    , request);
    OSBITSET(tp.WellKnownConnections, request);
    OSBITSET(tp.AllSockets, request);
    return request;
}

function TPListenToTCP (tp, Port, Protocol) {
    var request;
    
    if ((request = OSOpenTcpSocket (tp.OS, Port)) < 0) {
        return TP_NOK;
    }

    var port = TPCreatePort (tp, request, Port);
    port.Protocol = Protocol;
    
    tp.ListeningPorts.push(port);
    tp.Mode = TPSERVER;

    OSBITSET(tp.DistantListening    , request);
    OSBITSET(tp.WellKnownConnections, request);
    OSBITSET(tp.AllSockets, request);
    
    return request;
}

function TPSendIfAnyOutput (tp, par) {
   
    var ClientsWithOutput = new Uint32Array(MaskCount);
    
    var client;
    var TimeToYield = 5;
    var returnvalue = 0;

    if (TPClientsWithOutput(tp)) {

        OSCOPYBITS(tp.ClientsWithOutput, ClientsWithOutput);
        while ((OSANYSET(ClientsWithOutput)) &&
                ((client = TPGetClient(tp, TPGetNextDescriptor(tp, ClientsWithOutput))) != NULL))
        {
            OSBITCLEAR(tp.ClientsWithOutput, client.Pipe.fd);
            if ((returnvalue = TPDispatchOutput (tp, client, TimeToYield)) < 0)
                if ((returnvalue != -3) && (!TPIsServer(tp)) && (TPNoMoreClient(tp))) break;
        }
    }

    if (TPClientsWithFileOutput(tp))  {

        OSCOPYBITS(tp.ClientsWithFileOutput, ClientsWithOutput);
        while ((OSANYSET(ClientsWithOutput)) &&
                ((client = tp.Clients[TPGetNextDescriptor(tp, ClientsWithOutput) - 1]) != NULL))
        {
            OSBITCLEAR(tp.ClientsWithFileOutput, client.Index + 1);
            if ((returnvalue = TPDispatchOutput (tp, client, TimeToYield)) < 0)
                if ((returnvalue != -3) && (!TPIsServer(tp)) && (TPNoMoreClient(tp))) break;
        }
    }

    if (TPClientsWithBaseOutput(tp)) {

        OSCOPYBITS(tp.ClientsWithBaseOutput, ClientsWithOutput);
        while ((OSANYSET(ClientsWithOutput)) &&
                ((client = tp.Clients[TPGetNextDescriptor(tp, ClientsWithOutput) - 1]) != NULL))
        {
            OSBITCLEAR(tp.ClientsWithBaseOutput, client.Index + 1);
            if ((returnvalue = TPDispatchOutput (tp, client, TimeToYield)) < 0)
                if ((returnvalue != -3) && (!TPIsServer(tp)) && (TPNoMoreClient(tp))) break;
        }
    }

    if ((returnvalue == -3) ||
            (TPClientsWithOutput (tp)) ||
            (TPClientsWithFileOutput (tp)) ||
            (TPClientsWithBaseOutput (tp)))
        return 1;
    else {
        return 0;
    }
}


function TPRecvIfAnyInput (tp, par) {

    var client;
    var TimeToYield = 5;
    var returnvalue = 0;

    var ClientsWithInput = new Uint32Array(MaskCount);    

    if (TPClientsWithBaseInput(tp)) {

        OSCOPYBITS(tp.ClientsWithBaseInput, ClientsWithInput);
        while ((OSANYSET(ClientsWithInput)) &&
               ((client = tp.Clients[TPGetNextDescriptor(tp, ClientsWithInput) - 1]) != NULL)) {

            if ((returnvalue = TPDispatchInput (tp, client, TimeToYield)) < 0)
                if ((returnvalue != -3) && (!TPIsServer(tp)) && (TPNoMoreClient(tp))) break;
        }
    }
    if ((returnvalue == -3) ||
        (TPClientsWithBaseInput (tp)))
        return 1;
    else {
        return 0;
    }
}

/*return value < 0 :
    -1 : error in message but comm can persist 
    -2 : error in comm we should close communication 
    -3 : there is blockinq write on com
  return value = 0 we can't write anymore on comm (either notihing to write or blocking mode)
  return value > 0 we can write but time yield */


function TPDispatchOutput (tp, client, TimeToYield) {
    var  ret;
    var  ret1 = 0;
    var i;

    for (i = 0; i < TimeToYield; i++) {

        if ((ret = client.SendFunction(tp, client, client.TransBuffer, client.TransSize)) <= 0)
            break;  /* if it returns 0 it means output is not set anymore in Dispatch */


        if (client.ClientGone) return 0;
        ret1 = client.WriteFunction (tp, client, client.TransBuffer, ret);
        if ((ret1 < 0) || (ret1 < ret))
            break;
    }

    if (ret1 < 0) {
        if (!client.ClientGone) TPCloseDownClient (tp, client);
        return -2;
    }

    if (ret == -3) return -3;
    if (ret < 0) return -1;
    if ((ret == 0) || (ret1 < ret)) return 0;
    
    return ret;
}
  
/* return -2 if communication is to be closed */
/* returns -1 if an error occurs in message    */
/* returns > 0 if evrything is OK             */
/* returns 0 if stop reading */

function TPDispatchInput (tp, client, TimeToYield) {
    var ret;
    var ret1;
    var i;


    for (i = 0; i < TimeToYield; i++) {

        ret = client.ReadFunction (tp, client);
        if (ret <= 0)
            break;

        else ret1 = client.ReceiveFunction (tp, client, client.RequestBuffer, ret);
        /* IF COM IS CLOSED BY A MESSAGE RECEPTION it closes the client OK...*/
        if (client.ClientGone) {
            return 0;
        }
    }
    if (ret < 0) {
        if (!client.ClientGone) TPCloseDownClient (tp, client);
        return -2;
    }
    if (ret == 0) return ret;
    if (ret1 < 0) return -1;
    return ret1;
}

function TPDispatchEvents (tp, microseconds) {
    var client;
    var ret = 0;
    var Every = TRUE;
    var DontBlock;
    var connection;
    var time = microseconds;
    var TimeToYield = 5;

    while (Every) {

        if (microseconds) Every = FALSE;

        DontBlock = TPExecuteApplicationProcedures (tp);


        if ((!TPIsServer(tp)) && (TPNoMoreClient(tp)))
            break;

        if (!microseconds)
            if (DontBlock)  time = 1;                   /* 0 means blocking mode   */
            else            time = microseconds;       /* return to blocking mode;*/

        if (TPIsServer(tp) || OSANYSET(tp.AllClients)) {
            if ((ret = TPWaitForSomething (tp, time)) <= 0)
                if (((ret == 0) && (microseconds != 0)) ||
                        (ret < 0))
                    break;

            if (TPIsServer(tp))
            {
                while (TPConnectionPending(tp))
                {
                    connection = TPNextConnectionPending(tp) ;
                    client = TPEstablishConnectionOn(tp, connection) ;
                }
            }
        }

        while ((TPInputPending (tp)) && ((client = TPNextInputPending (tp)) != NULL)) {
            if ((ret = TPDispatchInput (tp, client, TimeToYield)) < 0)
                if ((!TPIsServer(tp)) && (TPNoMoreClient(tp)))
                    break;
        }
        while ((TPClientsWithInput(tp)) && ((client = TPNextClientWithInput(tp)) != NULL)) {
            if ((ret = TPDispatchInput (tp, client, TimeToYield)) < 0)
                if ((!TPIsServer(tp)) && (TPNoMoreClient(tp)))
                    break;
        }
        while ((TPOutputPending(tp)) && ((client = TPNextOutputPending(tp)) != NULL)) {
            if ((ret = TPFlushClient(tp, client)) < 0)
                TPCloseDownClient (tp, client);
            if ((!TPIsServer(tp)) && (TPNoMoreClient(tp)))
                break;
        }

        if ((!TPIsServer(tp)) && (TPNoMoreClient(tp)))
            break;
    }
    return ret;
}
  
  
function  TPWaitForConnections (tp) {
    var client;
    var connection;
    var ret;

    if (TPIsServer(tp) || OSANYSET(tp.AllClients)) {
        if ((ret = TPWaitForSomething (tp, 0)) <= 0)
            if (ret < 0)
                return -1;

        if (TPIsServer(tp))
        {
            while (TPConnectionPending(tp))
            {
                connection = TPNextConnectionPending(tp) ;
                client = TPEstablishConnectionOn(tp, connection) ;
            }
        }
    }
    return 1;
}


function TPExecuteApplicationProcedures (tp) {

    var DontBlock = FALSE;

    for (var i = 0; i < tp.ApplicationProcedures.length; i++) {
        if (tp.ApplicationProcedures[i].ExecuteProcedure(tp, tp.ApplicationProcedures[i].ApplicationField) != 0)
        DontBlock = TRUE;      
    }  
    return DontBlock;
}



function TPAddApplicationProcedure (tp, funct, applicationfield) {

    var applicationprocedure = new(TPApplicationProcedure);

    applicationprocedure.ApplicationField = applicationfield;
    applicationprocedure.ExecuteProcedure = funct;
    tp.ApplicationProcedures.push(applicationprocedure);
    return applicationprocedure;
}

function TPRemoveApplicationProcedure (tp, funct, applicationfield) {
    for (var i = 0; i < tp.ApplicationProcedures.length; i++) {
        if (tp.ApplicationProcedures[i].ExecuteProcedure == funct) {
            tp.ApplicationProcedures.splice (i, 1);
            return 1;
        }
    }
    return -1;
}

function TPFindApplicationProcedure (arrayproc, funct) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function TPAddConnectionProcedure (tp, funct, applicationfield) {

    var connectionprocedure = new(TPConnectionProcedure);

    connectionprocedure.ApplicationField = applicationfield;
    connectionprocedure.ExecuteProcedure = funct;

    tp.ConnectionProcedures.push(connectionprocedure);
    return connectionprocedure;
}



function TPRemoveConnectionProcedure (tp, funct, applicationfield) {

    for (var i = 0; i < tp.ConnectionProcedures.length; i++) {
        if (tp.ConnectionProcedures[i].ExecuteProcedure == funct) {
            tp.ConnectionProcedures.splice (i, 1);
            return 1;
        }
    }
    return -1;
}

function TPFindConnectionProcedure (arrayproc, funct) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function TPAddEndingProcedure (client, funct, applicationfield) {
    var endingprocedure = new(TPEndingProcedure);

    endingprocedure.ApplicationField = applicationfield;
    endingprocedure.ExecuteProcedure = funct;

    tp.endingprocedure.push(endingprocedure);
    return endingprocedure;    
}

function TPFindEndingProcedure (arrayproc, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].EndingProcedure == funct &&
            arrayproc[i].ApplicationField == applicationfield) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function TPRemoveEndingProcedure (client, funct, applicationfield) {

    for (var i = 0; i < tp.EndingProcedures.length; i++) {
        if (tp.EndingProcedures[i].ExecuteProcedure == funct&&
            arrayproc[i].ApplicationField == applicationfield) {
            tp.EndingProcedures.splice (i, 1);
            return 1;
        }
    }
    return -1;
}

function TPSetApplicationField(client, applicationfield) {
    if (!client) return -1;
    client.ApplicationField = applicationfield;
    return 1;
}

function TPSetEndingProcedure(client, funct) {
    if (!client) return -1;
    TPAddEndingProcedure (client, funct, client.ApplicationField);
    return 1;
}

function TPFindConnectionProcedure (arrayproc, funct) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct) {
            return arrayproc[i];
        }
    }
    return NULL;
}
