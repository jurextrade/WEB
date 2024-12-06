/* NetProg is an API in C language allowing an homogeneous programming of  */
/* communicating applications                                              */
/* Copyright (C) 2002,2003,2004,2005                                       */
/* Gabriel Jureidini                                                       */
/* Version 2.0 - 17 July 2005                                              */
/*-------------------------------------------------------------------------*/

function TCPCheckAndReturnMessage (mx, com, stream) {
    var message = NULL;
    message = MXCreateMessage (mx, TCP_SYS, 'Stream');
    message.Complete = 1;
    return message;
}

function TCPReceiveMessage (tp, client, buf, count) {
    var stream;
    var mx;
    var message;
    var ret;

    var executecomprocedure;
    var executeprocedure;


    var com = client.ApplicationField;
    mx = com.MX;

    if ((!com) || (!com.Client) || (!client.RequestBuffer))
        return -1;

    stream = buf;

    message = TCPCheckAndReturnMessage (mx, com, stream);
    if (!message)
        return -1;

    message.Com = com;

    if (com.TraceProcedure)  com.TraceProcedure (message, MXONRECV, buf, count);


    ret = TCPReadMessage (mx, message, stream, count, 1);

    if (ret < 0) {
        message.Complete = 1;     /*finish with this message */
    }

    TPSetBlockingMode (com.Client, message.MessageClass.BlockedOnInput);

    if (message.Complete) {

        TPSetBlockingMode (com.Client, MXNoBlock);
        
        interface_ArrayRemove(com.InputMessages, message);

        /* Commentaire */
        plist = mx.ExecuteInputs;

        for (var i = 0; i < mx.ExecuteInputs.length; i++) {        
            mx.ExecuteInputs[i].ExecuteProcedure (message, com, mx.ExecuteInputs[i].ApplicationField);
        }
        
            
        for (var i = 0; i < message.MessageClass.ExecuteInputs.length; i++) {        
            message.MessageClass.ExecuteInputs[i].ExecuteProcedure (message, com, message.MessageClass.ExecuteInputs[i].ApplicationField);
        }
    
        if (com.ComClass) {
            for (var i = 0; i < com.ComClass.ExecuteInputs.length; i++) {        
                if ((!com.Client) || (com.Closed)) return 1;
                if (com.ComClass.ExecuteInputs[i].MessageClass == message.MessageClass) {
                    com.ComClass.ExecuteInputs[i].ExecuteProcedure (message, com, com.ComClass.ExecuteInputs[i].ApplicationField);
                }
            }
        }
        for (var i = 0; i < com.ExecuteInputs.length; i++) {      
            if ((!com.Client) || (com.Closed)) return 1;      
            if (com.ExecuteInputs[i].MessageClass == message.MessageClass) {                    
                com.ExecuteInputs[i].ExecuteProcedure (message, com, com.ExecuteInputs[i].ApplicationField);
            }
        }
        MXFreeMessage (com.MX, message);
    }

    return ret;
}


function TCPSendMessage (tp, client, buf, size) {
    var ret;
    var mx;

    var message;
    var executecomprocedure;
    var executeprocedure;

    
    /* now hopinng that values are set */
    var com = client.ApplicationField;
    
    mx = com.MX;


    message = MXGetReadyOutputMessage (com);
    if (!message) return 0;

    if (message && (!MXReadyToSend (message))) return -3;

    message.Com = com;
    
    if (!message.Context) {

        for (var i = 0; i < mx.ExecuteOutputs.length; i++) {        
            mx.ExecuteOutputs[i].ExecuteProcedure (message, com, mx.ExecuteOutputs[i].ApplicationField);
        }
                
        for (var i = 0; i < message.MessageClass.ExecuteOutputs.length; i++) {        
            message.MessageClass.ExecuteOutputs[i].ExecuteProcedure (message, com, message.MessageClass.ExecuteOutputs[i].ApplicationField);
        }
    
        if (com.ComClass) {
            for (var i = 0; i < com.ComClass.ExecuteOutputs.length; i++) {        
                if ((!com.Client) || (com.Closed)) return 1;
                if (com.ComClass.ExecuteOutputs[i].MessageClass == message.MessageClass) {
                    com.ComClass.ExecuteOutputs[i].ExecuteProcedure (message, com, com.ComClass.ExecuteOutputs[i].ApplicationField);
                }
            }
        }
        for (var i = 0; i < com.ExecuteOutputs.length; i++) {      
            if ((!com.Client) || (com.Closed)) return 1;      
            if (com.ExecuteOutputs[i].MessageClass == message.MessageClass) {                    
                com.ExecuteOutputs[i].ExecuteProcedure (message, com, com.ExecuteOutputs[i].ApplicationField);
            }
        }
    }

    if (com.Closed) {
        MXFreeMessage (com.MX, message);
        return 1;
    }

    TPSetBlockingMode (com.Client, message.MessageClass.BlockedOnOutput);

    ret = TCPWriteMessage (mx, message, buf, size, 1); /*client.TransSize - tp header;*/

    if (ret < 0)  {
        interface_ArrayRemove(com.OutputMessages, message);
        MXFreeMessage (com.MX, message);
        return -1;
    }

    if (com.TraceProcedure) com.TraceProcedure (message, MXONSEND, buf, ret);

    if (message.Complete)  {

        TPSetBlockingMode (com.Client, MXNoBlock);
        interface_ArrayRemove (com.OutputMessages, message);

        if (!(message.Type & MXACK))
            MXFreeMessage (com.MX, message);
        else
            ListNewr (com.AckMessages, message);
    }

    return ret;
}

function TCPReadMessage (mx,  message, stream, streamsize, WithFileContent) {
    var object;
    var FirstTime = FALSE;
    var from = 0;
    var type;
    var isread = 0;          /* what is read in partmessage */
    var FromObjectOffset;
    var FromSizeOffset;
    var NbObjects;
    
    var xf;

    var fromstream;
    var bufferattributes;

    var messageclass    = message.MessageClass;
    var messagecontext  = message.Context;

    var State = 0;
    var i;

    if ((message.Com) && (message.Com.ComClass) && (message.Com.XF))
        xf = message.Com.XF;
    else xf = mx.TP.XF;


    if (!messagecontext)  {
        FirstTime = TRUE;
        messagecontext = MXAllocateContext();
        if (!messagecontext) {
            return -1;
        }
        message.Context = messagecontext;
    }

    fromstream = stream;

    from = 0;
    FromObjectOffset    = messagecontext.ObjectOffset;
    FromSizeOffset      = messagecontext.SizeOffset;
    
    NbObjects = messageclass.Objects.length;

    for (i = FromObjectOffset; i < NbObjects; i++) {
        
        object = messageclass.Objects[i];
        type = object.Type;
        switch (type)  {

            case MXBUFFER :  {

                var BufferSize;
                
                if (message.StreamSize < message.Offset + streamsize) {
                    if (MXExtendValueBuffer (message, streamsize) == 0) {
                         return -1;
                    }
                }

                bufferattributes = message.Stream + message.Values[object.Offset];
                
                OSCopy4(BufferSize, bufferattributes);
                
                BufferSize += streamsize;
                
               // memcpy (bufferattributes , (CHAR *)(&BufferSize) , sizeof (DWORD));
                
                messagecontext.Buffer = bufferattributes + sizeof (DWORD) + sizeof (CHAR);
                
               // memcpy ((char *)((DWORD)messagecontext.Buffer + messagecontext.Pos), fromstream , streamsize);
                
                messagecontext.Pos += streamsize;
                
                message.Offset += streamsize;

            }
            break;
            default:
                OSError ('TEDAG032', message.MessageClass.Name);
                return -1;
        }
    }

    MXInitMessage (message);
    return streamsize;
}


function TCPWriteMessage (mx, message, stream, maxcount, WithFileContent) {

    var object;
    var FirstTime = FALSE;
    var from = 0;
    var type;
    var NoContent = 0;
    var size;
    var written = 0;
    var FromObjectOffset;
    var FromSizeOffset;
    var NbObjects;
    
    var xf;
    var tostream;
    var bufferattributes;



    var messageclass = message.MessageClass;
    var messagecontext = message.Context;
    var State = 0;
    var j, i;


    if ((message.Com) && (message.Com.ComClass) && (message.Com.XF))
        xf = message.Com.XF;
    else xf = mx.TP.XF;

    /* set part message value */

    message.Part++;

    /* if no context related to this message this means the first time */
    if (!messagecontext) {
        FirstTime = TRUE;
        message.Size = MXGetMessageSize (message, WithFileContent);
        
        var datetime = OSDateHour ();
        message.DDate = datetime.date;
        message.DHour = datetime.time;

        messagecontext = MXAllocateContext ();

        message.Context = messagecontext;
        messagecontext.StillToRead = message.Size;
    }

    tostream = stream;

    FromObjectOffset = messagecontext.ObjectOffset;
    FromSizeOffset = messagecontext.SizeOffset;
    NbObjects = ListNbElt (messageclass.Objects);

    for (i = FromObjectOffset; i < NbObjects; i++) {
        
        object = messageclass.Objects[i];
        from = 0;
        type = object.Type;
        switch (type) {
            case MXBUFFER :
                for (j = FromSizeOffset; j < object.Size; j++, from = 0) {

                    bufferattributes = message.Stream + message.Values[object.Offset + j];
                    size = MXWriteBufferContent (mx, messagecontext, tostream,  bufferattributes, maxcount - written);
                    
                    if (size < 0) {                  /* something strange */
                    
                        /*We should stop the message */
                        return -1;
                    }

                    /* if I am here it means I can't write anymore  or buffer is read completely*/

                    tostream += size;
                    messagecontext.StillToRead -= size;
                    written += size;

                    if (MXBufferProcessing(message)) {   /* still to read in buffer */
                        State = 1;
                        break;
                    }
                }
                break;
            default:
                OSError ('TEDAG035',  message.MessageClass.Name);
                return -1;
        }
        if (State == 1)  {  /* here we got a break can't write anymore  */

            if (messagecontext.StillToRead == 0) {           /* something is strange but send it anyway*/
                OSError ('TEDAG036',  message.MessageClass.Name);
                message.Complete = 1;
                message.Part++;
            }

            messagecontext.SizeOffset = j;
            messagecontext.ObjectOffset = i;
            break;   /* we should return now */
        }
    }

    if (State != 1) {             /* evrything is written */
        message.Complete = 1;  /* add \r\n */
    }

    MXInitMessage (message);
    return written ;
}


function TCPSend (mx,com, message) {
    var ret, ret1;

    var  executecomprocedure;
    var  executeprocedure;


    if ((!com) || (!com.Client) || (com.Client.ClientGone))
        return -1;

    if (!message) return -1;

    message.Com = com;

    if (!message.Context)  {


        for (var i = 0; i < mx.ExecuteOutputs.length; i++) {        
            mx.ExecuteOutputs[i].ExecuteProcedure (message, com, mx.ExecuteOutputs[i].ApplicationField);
        }
                
        for (var i = 0; i < message.MessageClass.ExecuteOutputs.length; i++) {        
            message.MessageClass.ExecuteOutputs[i].ExecuteProcedure (message, com, message.MessageClass.ExecuteOutputs[i].ApplicationField);
        }
    
        if (com.ComClass) {
            for (var i = 0; i < com.ComClass.ExecuteOutputs.length; i++) {        
                if ((!com.Client) || (com.Closed)) return 1;
                if (com.ComClass.ExecuteOutputs[i].MessageClass == message.MessageClass) {
                    com.ComClass.ExecuteOutputs[i].ExecuteProcedure (message, com, com.ComClass.ExecuteOutputs[i].ApplicationField);
                }
            }
        }
        for (var i = 0; i < com.ExecuteOutputs.length; i++) {      
            if ((!com.Client) || (com.Closed)) return 1;      
            if (com.ExecuteOutputs[i].MessageClass == message.MessageClass) {                    
                com.ExecuteOutputs[i].ExecuteProcedure (message, com, com.ExecuteOutputs[i].ApplicationField);
            }
        }
    }

    if (com.Closed)
    {
        return -1;
    }


    TPSetBlockingMode (com.Client, TRUE);
    while (1)
    {
        ret = TCPWriteMessage (mx, message, com.Client.TransBuffer, com.Client.TransSize - 2, 1);

        if (ret < 0)
        {
            TPSetBlockingMode (com.Client, FALSE);
            /*!!!!!! A REVOIR LA LIBERATION DES MESSAGES EN BLOQUANT */
            interface_ArrayRemove(com.OutputMessages, message);
            return -1;
        }
        if (com.Closed) return -1;

        if (com.TraceProcedure) com.TraceProcedure (message, MXONSEND, com.Client.TransBuffer, ret);

        ret1 = com.Client.WriteFunction (mx.TP, com.Client, com.Client.TransBuffer, ret);
        if (ret1 < 0)
        {
            if (!com.Client.ClientGone) MXCloseCom (mx, com);
            return -1;
        }
        if (message.Complete) {
            interface_ArrayRemove (com.OutputMessages, message);
            if (message.Type & MXACK)
                com.AckMessages.push(message);
            break;
        }
    }
    TPSetBlockingMode (com.Client, FALSE);

    return ret1;
}

function TCPRecv (mx, com) {
    var ret;
    var stream;
    var message = NULL;
    var executecomprocedure;
    var executeprocedure;




    if ((!com) || (!com.Client) || (com.Client.ClientGone))
        return NULL;

    TPSetBlockingMode (com.Client, TRUE);
    while (1) {
        
        while ((ret  = com.Client.ReadFunction (mx.TP, com.Client)) == 0);
        if (ret < 0) {
            if (!com.Client.ClientGone) MXCloseCom (mx, com);
            if (message) MXFreeMessage (com.MX, message);
            return NULL;
        }

        stream = com.Client.RequestBuffer;

        message = TCPCheckAndReturnMessage (mx, com, stream);
        
        if (!message)  {
            TPSetBlockingMode (com.Client, FALSE);
            return NULL;
        }

        message.Com = com;
        if (com.TraceProcedure) com.TraceProcedure (message, MXONRECV, stream, ret);
      
        ret = TCPReadMessage (mx, message, stream, ret, 1);
        
        if (ret < 0) {
            TPSetBlockingMode (com.Client, FALSE);
            
            interface_ArrayRemove(com.InputMessages, message);
            
            MXFreeMessage(com.MX, message);
            return NULL;
        }

        if (message.Complete) {
            interface_ArrayRemove(com.InputMessages, message);


            for (var i = 0; i < mx.ExecuteInputs.length; i++) {        
                mx.ExecuteInputs[i].ExecuteProcedure (message, com, mx.ExecuteInputs[i].ApplicationField);
            }
            
                
            for (var i = 0; i < message.MessageClass.ExecuteInputs.length; i++) {        
                message.MessageClass.ExecuteInputs[i].ExecuteProcedure (message, com, message.MessageClass.ExecuteInputs[i].ApplicationField);
            }
        
            if (com.ComClass) {
                for (var i = 0; i < com.ComClass.ExecuteInputs.length; i++) {        
                    if ((!com.Client) || (com.Closed)) return 1;
                    if (com.ComClass.ExecuteInputs[i].MessageClass == message.MessageClass) {
                        com.ComClass.ExecuteInputs[i].ExecuteProcedure (message, com, com.ComClass.ExecuteInputs[i].ApplicationField);
                    }
                }
            }
            for (var i = 0; i < com.ExecuteInputs.length; i++) {      
                if ((!com.Client) || (com.Closed)) return 1;      
                if (com.ExecuteInputs[i].MessageClass == message.MessageClass) {                    
                    com.ExecuteInputs[i].ExecuteProcedure (message, com, com.ExecuteInputs[i].ApplicationField);
                }
            }
            break;

        }

    }
    if (!com.Closed) TPSetBlockingMode (com.Client, FALSE);
    return message;
}
