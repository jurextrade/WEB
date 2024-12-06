


function MXAllocMessage (dialogclass, messageclass) {
    var message = new(MXMessage);
    var datetime = OSDateHour ();
    message.PDate = datetime.date;
    message.PHour = datetime.time;


    if (messageclass.Size != 0) {
        message.Values  = new ArrayBuffer(messageclass.Size * sizeof (int))
        message.Stream      = new ArrayBuffer(MXBUFVALUESIZE);
        message.StreamSize  = MXBUFVALUESIZE;
    }
    MXInitValues (message);
    return message;
}

function MXTraceMessage (message) {   
  
	var content = '';
    content +=  'Dialog : ', message.Class.Name + '\n';
	content +=  'Message : ', message.MessageClass.Name+ '\n';


    for (var j = 0; j < message.MessageClass.Objects.length; j++) {

		var object = message.MessageClass.Objects[j];
        var stype = MXReturnStringType(object.Type);

        for (var i = 0; i < object.Size; i++)  {
                content += stype + ' : ' + object.Name +  (object.Size > 1 ? ('[' + (i + 1) + ']') : '') +  object.SMXGetValue (message,  object.Name, i + 1) + '\n';
    	}
    }    

	content += 'Transfer Date : ' + message.TDate;
	content += 'Transfer Hour : ' + message.THour;
	content += 'Put Date : ' + message.PDate;
	content += 'Put Hour : ' + message.PHour;
	content += 'Departure Date : ' + message.DDate;
	content += 'Departure Hour : ' + message.DHour;
	content += 'Arrival Date : ' + message.ADate;
	content += 'Transfer Hour : ' + message.AHour;
}

function MXFreeMessage (mx, message) {
    if (!message) return;

	MXTraceMessage (message);
    
    if (message.Context) MXFreeContext (message.Context);
}

function MXInitMessage (message) {
    if (message.Complete && message.Context) {
	    message.Offset = 0;
        message.Part = 0;
        MXFreeContext (message.Context);
        message.Context = NULL;
    }
}

function MXInitValues (message) {
    var Range;
    
    for (var j = 0; j < message.MessageClass.Objects.length; j++) {

        object = message.MessageClass.Objects[j];
        switch (object.Type) {
            case MXSTRING :
                for (Range = 1; Range <= object.Size; Range++)
                    MXSetValue (message, object.Name, Range, "");
                break;
            case MXSHORT :
                {
                    SHORT value = 0;
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }
                break;
            case MXWORD :
                {
                    WORD value = 0;
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }
                break;
            case MXDWORD :
                {
                    DWORD value = 0;
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }
                break;
            case MXLONG :
                {
                    LONG value = 0;
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }
                break;
            case MXDOUBLE :
                {
                    DOUBLE value = 0;
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }
                break;
            case MXBYTE :
            case MXCHAR :
                {
                    char value[3000];
                    memset (value, ' ', object.Size );
                    memset (message.Stream + message.Offset, ' ', object.Size);
                }
                break;
            case MXFILE :
                {
                    FILEPARM value;
                    memset (&value, 0, sizeof(FILEPARM));
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }

                break;
            case MXBUFFER :
                {
                    BUFFERPARM value;
                    memset (&value, 0, sizeof(BUFFERPARM));
                    for (Range = 1; Range <= object.Size; Range++)
                        MXSetValue (message, object.Name, Range, &value);
                }

                break;
            }
    }
    return 1;
}


function MXGetDialogClassFromName (mx, name) {
    for (var i = 0; i < mx.DialogClasses.length; i++) {
       if (mx.Classes[i].Name == name) {
            return mx.Classes[i];
       }
    }
    return NULL;
}

function MXGetMessageClassFromName (dialogclass, name) {
    for (var i = 0; i < dialogclass.MessageClasses.length; i++) {
        if (dialogclass.MessageClasses[i].Name == name) {
            return dialogclass.MessageClasses[i];
       }
    }
    return NULL;        
}

function MXCheckType2 (type) {

    if (type == 'SHORT')     return MXSHORT;
    if (type == 'WORD')      return MXWORD;
    if (type == 'DWORD')     return MXDWORD;
    if (type == 'DOUBLE')    return MXDOUBLE;
    if (type == 'BYTE')      return MXBYTE;
    if (type == 'FILE')      return MXFILE;
    if (type == 'STRING')    return MXSTRING;
    if (type == 'CHAR')      return MXCHAR;
    if (type == 'BUFFER')    return MXBUFFER;
    if (type == 'LONG')      return MXLONG;

    if (type == 'SHORT_T')   return MXSHORT+10;
    if (type == 'WORD_T')    return MXWORD+10;
    if (type == 'DWORD_T')   return MXDWORD+10;
    if (type == 'BYTE_T')    return MXBYTE+10;
    if (type == 'FILE_T')    return MXFILE+10;
    if (type == 'STRING_T')  return MXSTRING+10;
    if (type == 'CHAR_T')    return MXCHAR+10;
    if (type == 'BUFFER_T')  return MXBUFFER+10;
    if (type == 'LONG_T')    return MXLONG+10;
    
    return -1;
}

function MXReturnStringType (type) {
    if (type ==  MXSHORT)     return 'SHORT';
    if (type ==  MXWORD)      return 'WORD'; 
    if (type ==  MXDWORD)     return 'DWORD';
    if (type ==  MXDOUBLE)    return 'DOUBLE';
    if (type ==  MXBYTE)      return 'BYTE'; 
    if (type ==  MXFILE)      return 'FILE'; 
    if (type ==  MXSTRING)    return 'STRING';
    if (type ==  MXCHAR)      return 'CHAR'; 
    if (type ==  MXBUFFER)    return 'BUFFER';
    if (type ==  MXLONG)      return 'LONG'; 
}

function  MXAddGeneralCallBack (mx, classname, messname, mode, funct, applicationfield) {
    var dialogclass = MXGetDialogClassFromName (mx, classname);


    if (!dialogclass) {
        OSError ('TEDAG007', 'dialog class name not defined');
        return -1;
    }

    var messageclass = MXGetMessageClassFromName (dialogclass, messname);
    
    if (!messageclass) {
        /* accept dynamic messageclasses for DB and FIOP */
        if (dialogclass.Name != DB_SYS &&
            dialogclass.Name != FIOP_SYS) {
            OSError ('TEDAG008', 'dynamic message class not accepted for this dialog');
            return -1;
        }
        else {
            messageclass = MXCreateMessageClass(mx, dialogclass, messname, 100, []);
        }
    }

    if (mode == MXONSEND) {
        if (classname && messname) {
            if (MXFindGeneralCallBack (messageclass.ExecuteOutputs, funct, applicationfield) != NULL)
            return 1;
            }
        else {
            if (MXFindGeneralCallBack (mx.ExecuteOutputs, funct, applicationfield) != NULL)
            return 1;
        }
    }
    else
 
    if (mode == MXONRECV) {
        if (classname && messname) {
                return 1;
            }
            else {
            if (MXFindGeneralCallBack (mx.ExecuteInputs, funct, applicationfield) != NULL)
                return 1;
            }
        }
    else

    if (mode == MXONACK) {
        if (classname && messname) {
            if (MXFindGeneralCallBack (messageclass.ExecuteAck, funct, applicationfield) != NULL)
                return 1;
            }
            else {
                if (MXFindGeneralCallBack (mx.ExecuteAck, funct, applicationfield) != NULL)
                return 1;
            }
        }
    else return -1;

    var executeprocedure = mew(MXCallback);
    executeprocedure.ApplicationField = applicationfield;
    executeprocedure.ExecuteProcedure = funct;

    if (mode == MXONSEND)  {
        if (classname && messname)
            messageclass.ExecuteOutputs.push(executeprocedure);
        else
            mx.ExecuteOutputspush(executeprocedure);
        return 0;
    }
    if (mode == MXONRECV) {
        if (classname && messname)
            messageclass.ExecuteInputs.push(executeprocedure);
        else
            mx.ExecuteInputs.push(executeprocedure);
        return 0;
    }
    if (mode == MXONACK)  {
        if (classname && messname)
            messageclass.ExecuteAck.push( executeprocedure);
        else
            mx.ExecuteAck.push(executeprocedure);

        return 0;
    }
    
    OSError ('TEDAG009', '');
    return -1;
}

function MXFindGeneralCallBack (arrayproc, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct &&
            pexecuteprocedure.ApplicationField == applicationfield) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function MXFindCallBack (messageclass, ExecuteList, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct &&
            pexecuteprocedure.ApplicationField == applicationfield &&
            pexecuteprocedure.MessageClass == messageclass) {
            return arrayproc[i];
        }
    }
    return NULL;    
}

function MXAllocateContext () {

    var context = new(MXMessageContext);

    context.File = NULL;
    context.Stream = NULL;
    context.Buffer = NULL;
    context.Pos = 0;
    context.StreamPos = 0;
    context.StreamSize = 0;
    context.ObjectOffset = 0;
    context.SizeOffset = 0;
    context.StillToRead = 0;
    return context;
}

function MXFreeContext (context) {
/*    
    if (context.Stream)
        free ((BYTE*)context.Stream);
    free ((BYTE*)context);
*/    
}

function MXExtendValueBuffer (message, value) {
    
    if (value == 0) return 0;
    
    var newBuffer = new ArrayBuffer(message.StreamSize + value);
    new Uint8Array(newBuffer).set(message.Stream);

    message.Stream = newBuffer;
    message.StreamSize += value;

//    memset (message.Stream + message.StreamSize , (int)0, value);
    return message.StreamSize;
}

function  MXInitMessage (message) {

    if (message.Complete && message.Context)  {
	    message.Offset = 0;
        message.Part = 0;
        MXFreeContext (message.Context);
        message.Context = NULL;
    }
}

/* return the whole file size with its content if Content != 0*/
/* else it returns the file structure size that's all */

function MXGetBufferSize (fromstream, Content) {
    var bufsize = sizeof (DWORD) + sizeof (CHAR);

    if (Content)  {
        var contentsize;
        OSCopy4 (contentsize, fromstream);
        bufsize += contentsize;
    }
    return bufsize;
}

function MXGetFileSize (fromstream, Content) {
    var size = 0;
    var minsize;
    var filesize = 0;
    var filetype;
    var filelocal;
    var error = 0;

    /* open file for having its size */
    if (Content)   {

        filetype  = fromstream + (2 * FILENAMESIZE) + (2 * sizeof (CHAR));
        filelocal = fromstream + (2 * FILENAMESIZE);
        filesize = OSGetFileSize (fromstream, filetype, filelocal, error);

        if (filesize < 0 ||error != 0) {

            OSCopy4 (fromstream + (2 * FILENAMESIZE) + (3 * sizeof (CHAR)), filesize);
            OSCopy4 (fromstream + (2 * FILENAMESIZE) + sizeof (DWORD) + (3 * sizeof (CHAR)), error);
            filesize = 0;
        }

        OSCopy4 (fromstream + (2 * FILENAMESIZE) + (3 * sizeof (CHAR)), filesize);
    }
    /* minimum structure size without file content */
    minsize =  (2 * FILENAMESIZE) + (3 * sizeof (CHAR)) + sizeof (DWORD) + sizeof (LONG);

    if (Content)
        size += filesize;
    size += minsize;
    return size;
}

function MXGetMessageSize (message, WithFiles) {

    var size = 0;
    var type;
    var WithContent = 1;
    var stream;


    var messageclass = message.MessageClass;

    for (var i = 0; i < messageclass.Objects.length; i++) {
        var object = messageclass.Objects[i];

        type = object.Type;

        switch (type) {
            case MXSHORT :
                size += object.Size * sizeof (SHORT);
                break;
            case MXWORD :
                size += object.Size * sizeof (WORD);
                break;
            case MXDWORD :
            case MXLONG :
                size += object.Size * sizeof (DWORD);
                break;
            case MXDOUBLE :
                size += object.Size * sizeof (DOUBLE);
                break;
            case MXBYTE :
            case MXCHAR :
                size += object.Size * sizeof (BYTE);
                break;
            case MXFILE :
                for (var j = 0; j < object.Size; j++)  {
                    stream = message.Stream + message.Values[object.Offset + j];
                    size += MXGetFileSize (stream, WithFiles);
                }
                break;
            case MXBUFFER :
                for (var j = 0; j < object.Size; j++) {
                    stream = message.Stream + message.Values[object.Offset + j];
                    size += MXGetBufferSize (stream, WithContent);
                }
                break;
            case MXSTRING :
                for (var j = 0; j < object.Size; j++)     {
                    stream = message.Stream + message.Values[object.Offset + j];
                    if (stream)   size += strlen (stream) + 1;
                    else size++;   /* empty string  goes in in SendMessage*/
                }
                break;
            default:
                OSError ('TEDAG006', 'error message size');
                return -1;
        }
    }
    return size;
}

/*-----ADD PROCEDURES -------*/


/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to application procedures                                                    */
/*-----------------------------------------------------------------------------------------------*/

function MXAddApplicationProcedure (mx, funct, applicationfield) {

    MXApplicationProcedure* executeprocedure;

    if ((executeprocedure = MXFindApplicationProcedure (mx.ApplicationProcedures, funct, applicationfield)) != NULL)
        return 1;


    var executeprocedure = new(MXApplicationProcedure);

    executeprocedure.ApplicationField = applicationfield;
    executeprocedure.ExecuteProcedure = funct;
   
    mx.ApplicationProcedures.push(executeprocedure);

    return 1;
}

/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to ONCLOSE com variable procedures                                                    */
/*-----------------------------------------------------------------------------------------------*/

function MXAddEndingProcedure (com, funct, applicationfield) {
    MXComCallBack* endingprocedure;

    if (!com) return -1;

    if ((endingprocedure = MXFindComCallBack (com.EndingProcedures, funct, applicationfield)) != NULL)
        return 1;

    var endingprocedure = new(MXComCallBack);

    endingprocedure.ApplicationField = applicationfield;
    endingprocedure.ExecuteProcedure = funct;
   
    com.EndingProcedures.push(executeprocedure);    
    return 1;
}

/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to all connections MXONCLOSE and MXONCONNECT                                 */
/*-----------------------------------------------------------------------------------------------*/

function MXAddGeneralConnectCallBack (mx, mode, funct, applicationfield) {

    MXComCallBack* executeprocedure;

    if (mode == MXONCONNECT) {
        if (MXFindComCallBack (mx.ConnectionProcedures, funct, applicationfield) != NULL)
            return 1;
    }
    else
    if (mode == MXONCLOSE) {
        if (MXFindComCallBack (mx.EndingProcedures, funct, applicationfield) != NULL)
            return 1;
    }
    else {
        return -1;
    }

    var executeprocedure = new(MXComCallBack);

    executeprocedure.ApplicationField = applicationfield;
    executeprocedure.ExecuteProcedure = funct;

    if (mode == MXONCONNECT) {
        mx.ConnectionProcedures.push(executeprocedure);
        return 1;
    }

    if (mode == MXONCLOSE) {
        mx.EndingProcedures.push(executeprocedure);
        return 1;
    }
    return -1;
}

/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to all connections belonging to class CLASSNAME on MXONCLOSE and MXONCONNECT */
/*-----------------------------------------------------------------------------------------------*/

function MXAddConnectCallBack (mx, comclassname, mode, funct, applicationfield) {
    
    var comclass = MXGetComClassFromName (mx, comclassname);
    
    if (!comclass) {
        OSError ('TEDAG007', 'can not find ' + comclassname);
        return -1;
    }

    if (mode == MXONCONNECT) {
        if (MXFindComCallBack (comclass.ConnectionProcedures, funct, applicationfield) != NULL)
            return 1;
    }
    else {
        if (mode == MXONCLOSE) {
            if (MXFindComCallBack (comclass.EndingProcedures, funct, applicationfield) != NULL)
                return 1;
        }
        else {
            return -1;
        }
    }

    var executeprocedure = new(MXComCallBack);

    executeprocedure.ApplicationField = applicationfield;
    executeprocedure.ExecuteProcedure = funct;

    if (mode == MXONCONNECT) {
        comclass.ConnectionProcedures.push(executeprocedure);
        return 1;
    }

    if (mode == MXONCLOSE) {
        comclass.EndingProcedures.push(executeprocedure);
        return 1;
    }

    OSError ('TEDAG009', 'mode should be onclose or onconnect');
    return -1;
}

/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to com variable procedures MXONRECV, MXONSEND, MXONACK                      */
/*-----------------------------------------------------------------------------------------------*/

function MXAddComCallBack (mx, com, classname, messname, mode, funct, applicationfield) {
    /* verify existence */

    var dialogclass = MXGetDialogClassFromName (mx, classname);

    if (!dialogclass)  {
        OSError ('TEDAG007', 'undefined dialog class for ' + classname);
        return -1;
    }


    var messageclass = MXGetMessageClassFromName (dialogclass, messname);

    if (!messageclass) {
        /* accept dynamic messageclasses for DB and FIOP */
        if (dialogclass.Name != DB_SYS &&
            dialogclass.Name != FIOP_SYS) {
            OSError ('TEDAG008', 'dynamic message class not accepted for this dialog');
            return -1;
        }
        else {
            messageclass = MXCreateMessageClass(mx, dialogclass, messname, 1, 0);
        }
    }

    if (mode == MXONSEND)  {
        if (MXFindCallBack (messageclass, com.ExecuteOutputs, funct, applicationfield) != NULL)
            return 1;
    } else
    if (mode == MXONSENDING) {
        if (MXFindCallBack (messageclass, com.ExecuteOutputStream, funct, applicationfield) != NULL)
            return 1;
    } else
    if (mode == MXONRECV) {
        if (MXFindCallBack (messageclass, com.ExecuteInputs, funct, applicationfield) != NULL)
            return 1;
    } else
    if (mode == MXONRECEIVING) {
        if (MXFindCallBack (messageclass, com.ExecuteInputStream, funct, applicationfield) != NULL)
            return 1;
    } else
    if (mode == MXONACK) {
        if (MXFindCallBack (messageclass, com.ExecuteAck, funct, applicationfield) != NULL)
            return 1;
    } else {
        return -1;
    }
                    
    var executeprocedure = new(MXCallBack);
    executeprocedure.ApplicationField   = applicationfield;
    executeprocedure.MessageClass       = messageclass;
    executeprocedure.ExecuteProcedure   = funct;

    if (mode == MXONSEND) {
        com.ExecuteOutputs.push(executeprocedure);
        return 1;
    }
    if (mode == MXONRECV) {
        com.ExecuteInputs.push(executeprocedure);
        return 1;
    }
    if (mode == MXONSENDING) {
        com.ExecuteOutputStream.push(executeprocedure);
        return 1;
    }
    if (mode == MXONRECEIVING) {
        com.ExecuteInputStream.push(executeprocedure);
        return 1;
    }
    if (mode == MXONACK) {
        com.ExecuteAck.push(executeprocedure);
        return 1;
    }
    OSError ('TEDAG009', 'mode should be onsend or onrecv or onsending or onreceiving or onack');
    return -1;
}


/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to com Class Name and Message Name MXONRECV, MXONSEND, MXONACK              */
/*-----------------------------------------------------------------------------------------------*/


function MXAddCallBack (mx, comclassname, classname, messname, mode, funct, applicationfield) {
    /* verify com class existence */

    var comclass = MXGetComClassFromName (mx, comclassname);

    if (!comclass) {
        OSError ('TEDAG007', 'undefined com class for ' + comclassname);
        return -1;
    }


    /* verify class existence */

    var dialogclass = MXGetDialogClassFromName (mx, classname);

    if (!dialogclass) {
        OSError ('TEDAG007', ' (%s)', classname);
        return -1;
    }
    
    var messageclass = MXGetMessageClassFromName (dialogclass, messname);

    if (!messageclass) {
        /* accept dynamic messageclasses for DB and FIOP */
        if (dialogclass.Name != DB_SYS &&
            dialogclass.Name != FIOP_SYS) {
            OSError ('TEDAG008', 'dynamic message class not accepted for this dialog');
            return -1;
        }
        else {
            messageclass = MXCreateMessageClass(mx, dialogclass, messname, 1, 0);
        }
    }

    if (mode == MXONSEND) {
        if (MXFindCallBack (messageclass, comclass.ExecuteOutputs, funct, applicationfield) != NULL)
            return 1;
    } else
    if (mode == MXONRECV) {
        if (MXFindCallBack (messageclass, comclass.ExecuteInputs, funct, applicationfield) != NULL)
            return 1;
    } else
    if (mode == MXONACK) {
        if (MXFindCallBack (messageclass, comclass.ExecuteAck, funct, applicationfield) != NULL)
            return 1;
    } else {
        return -1;
    }

    var executeprocedure = new(MXCallBack);
    executeprocedure.ApplicationField   = applicationfield;
    executeprocedure.MessageClass       = messageclass;
    executeprocedure.ExecuteProcedure   = funct;

    if (mode == MXONSEND) {
        comclass.ExecuteOutputs.push(executeprocedure);
        return 1;
    }
    if (mode == MXONRECV) {
        comclass.ExecuteInputs.push(executeprocedure);
        return 1;
    }
    if (mode == MXONACK) {
        comclass.ExecuteAck.push(executeprocedure);
        return 1;
    }

    OSError ('TEDAG009', 'mode should be onsend or onrecv or onsending or onreceiving or onack');
    return -1;
}

/*-----------------------------------------------------------------------------------------------*/
/* CallBack related to all messages independantly from com   MXONRECV, MXONSEND, MXONACK         */
/*-----------------------------------------------------------------------------------------------*/

function MXAddGeneralCallBack (mx, classname, messname, mode, funct, applicationfield) {

    var messageclass;

    if ((!classname && messname) || (classname && !messname)) {
        OSError ('TEDAG007', ' (%s)', classname);
        return -1;
    }

    if (classname && messname) {
        var dialogclass = MXGetDialogClassFromName (mx, classname);

        if (!dialogclass) {
            OSError ('TEDAG007', ' (%s)', classname);
            return -1;
        }

        messageclass = MXGetMessageClassFromName (dialogclass, messname);

        if (!messageclass) {
            /* accept dynamic messageclasses for DB and FIOP */
            if (dialogclass.Name != DB_SYS &&
                dialogclass.Name != FIOP_SYS) {
                OSError ('TEDAG008', 'dynamic message class not accepted for this dialog');
                return -1;
            }
            else {
                messageclass = MXCreateMessageClass(mx, dialogclass, messname, 1, 0);
            }
        }
    }

    if (mode == MXONSEND) {
        if (classname && messname) {
            if ((executeprocedure = MXFindGeneralCallBack (messageclass.ExecuteOutputs, funct, applicationfield)) != NULL)
                return 1;
        }
        else {
            if ((executeprocedure = MXFindGeneralCallBack (mx.ExecuteOutputs, funct, applicationfield)) != NULL)
                return 1;
        }
    } else
    if (mode == MXONRECV) {
        if (classname && messname) {
            if ((executeprocedure = MXFindGeneralCallBack (messageclass.ExecuteInputs, funct, applicationfield)) != NULL)
                return 1;
        }
        else
        {
            if ((executeprocedure = MXFindGeneralCallBack (mx.ExecuteInputs, funct, applicationfield)) != NULL)
                return 1;
        }
    } else
    if (mode == MXONACK) {
        if (classname && messname) {
            if ((executeprocedure = MXFindGeneralCallBack (messageclass.ExecuteAck, funct, applicationfield)) != NULL)
                return 1;
        }
        else
        {
            if ((executeprocedure = MXFindGeneralCallBack (mx.ExecuteAck, funct, applicationfield)) != NULL)
                return 1;
        }

    } else {
        return -1;
    }

    var executeprocedure = new(MXCallBack);
    executeprocedure.ApplicationField = applicationfield;
    executeprocedure.ExecuteProcedure = funct;

    if (mode == MXONSEND) {
        if (classname && messname)
            messageclass.ExecuteOutputs.push(executeprocedure);
        else
            mx.ExecuteOutputs.push(executeprocedure);
        return 0;
    }

    if (mode == MXONRECV) {
        if (classname && messname)
            messageclass.ExecuteInputs.push(executeprocedure);
        else
            mx.ExecuteInputs.push(executeprocedure);
        return 0;
    }

    if (mode == MXONACK) {
        if (classname && messname)
            messageclass.ExecuteAck.push(executeprocedure);
        else
            mx.ExecuteAck.push(executeprocedure);

        return 0;
    }

    OSError ('TEDAG009', 'mode should be onsend or onrecv or onack');
    return -1;
}

/*-----FIND PROCEDURES -------*/

function MXFindApplicationProcedure (arrayproc, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct &&
            arrayproc[i].ApplicationField == applicationfield) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function MXFindComCallBack (arrayproc, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct &&
            arrayproc[i].ApplicationField == applicationfield) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function MXFindGeneralCallBack (arrayproc, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct &&
            arrayproc[i].ApplicationField == applicationfield) {
            return arrayproc[i];
        }
    }
    return NULL;
}

function MXFindCallBack (messageclass, arrayproc, funct, applicationfield) {
    for (var i = 0; i < arrayproc.length; i++) {
        if (arrayproc[i].ExecuteProcedure == funct &&
            arrayproc[i].ApplicationField == applicationfield &&
            arrayproc[i].MessageClass     == messageclass) {
            return arrayproc[i];
        }
    }
    return NULL;    
}

/*-----REMOVE PROCEDURES -------*/

function MXRemoveApplicationProcedure (mx, funct, applicationfield) {
    for (var i = 0; i < mx.ApplicationProcedures.length; i++) {
        if (mx.ApplicationProcedures[i].ExecuteProcedure == funct &&
            mx.ApplicationProcedures[i].ApplicationField == applicationfield) {
                mx.ApplicationProcedures.splice (i, 1);
                return 1;
        }
    }
    return 1;
}

function MXRemoveEndingProcedure (com, funct, applicationfield) {
    for (var i = 0; i < com.EndingProcedures.length; i++) {
        if (com.EndingProcedures[i].ExecuteProcedure == funct &&
            com.EndingProcedures[i].ApplicationField == applicationfield) {
                com.EndingProcedures.splice (i, 1);
                return 1;
        }
    }
    return 1;
}

function MXRemoveGeneralConnectCallBack (mx, mode, funct, applicationfield) {
    if (mode == MXONCONNECT) {
        for (var i = 0; i < mx.ConnectionProcedures.length; i++) {
            if (mx.ConnectionProcedures[i].ExecuteProcedure == funct &&
                mx.ConnectionProcedures[i].ApplicationField == applicationfield) {
                    mx.ConnectionProcedures.splice (i, 1);
                    return 1;
            }
        }        
    }
    if (mode == MXONCLOSE) {
        for (var i = 0; i < mx.EndingProcedures.length; i++) {
            if (mx.EndingProcedures[i].ExecuteProcedure == funct &&
                mx.EndingProcedures[i].applicationfield == applicationfield) {
                    mx.EndingProcedures.splice (i, 1);
                    return 1;
            }
        }           
    }
    return 1;
}

function MXRemoveConnectCallBack (mx, comclassname, mode, funct, applicationfield) {

    var executeprocedure;

    var comclass = MXGetComClassFromName (mx, comclassname);
    if (!comclass) {
        OSError ('TEDAG007', 'undefined com class for ' + comclassname);
        return -1;
    }


    if (mode == MXONCONNECT) {
        if ((executeprocedure = MXFindComCallBack (comclass.ConnectionProcedures, funct, applicationfield)) != NULL) {
            interface_ArrayRemove (comclass.ConnectionProcedures, executeprocedure);
            return 1;
        }
    }
    if (mode == MXONCLOSE) {
        if ((executeprocedure = MXFindComCallBack (comclass.EndingProcedures, funct, applicationfield)) != NULL)  {
            interface_ArrayRemove (comclass.EndingProcedures, executeprocedure);
            return 1;
        }
    }
    return -1;
}

function MXRemoveComCallBack (mx, com, classname, messname, mode, funct, applicationfield) {

    var executeprocedure;

    var dialogclass = MXGetDialogClassFromName (mx, classname);

    if (!dialogclass)  {
        OSError ('TEDAG007', 'undefined dialog class for ' + classname);
        return -1;
    }
    var messageclass = MXGetMessageClassFromName (dialogclass, messname);
    if (!messageclass) {
        OSError ('TEDAG008', 'message class undefined ' + messname);
        return -1;
    }

    if (mode == MXONSEND)  {
        if ((executeprocedure = MXFindCallBack (messageclass, com.ExecuteOutputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (com.ExecuteOutputs, executeprocedure);
        return 1;
    }
    if (mode == MXONSENDING) {
        if ((executeprocedure = MXFindCallBack (messageclass, com.ExecuteOutputStream, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (com.ExecuteOutputStream, executeprocedure);
        return 1;
    }
    if (mode == MXONRECV)
    {
        if ((executeprocedure = MXFindCallBack (messageclass, com.ExecuteInputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (com.ExecuteInputs, executeprocedure);
        return 1;
    }

    if (mode == MXONRECEIVING)  {
        if ((executeprocedure = MXFindCallBack (messageclass, com.ExecuteInputStream, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (com.ExecuteInputStream, executeprocedure);
        return 1;
    }

    if (mode == MXONACK) {
        if ((executeprocedure = MXFindCallBack (messageclass, com.ExecuteAck, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (com.ExecuteAck, executeprocedure);
        return 1;
    }

    return -1;
}

function MXRemoveCallBack (mx, comclassname, classname, messname, mode, funct, applicationfield) {

    var executeprocedure;

    /* verify com class existence */

    var comclass = MXGetComClassFromName (mx, comclassname);

    if (!comclass) {
        OSError ('TEDAG007', 'undefined com class for ' + comclassname);
        return -1;
    }


    var dialogclass = MXGetDialogClassFromName (mx, classname);

    if (!dialogclass) {
        OSError ('TEDAG007', 'undefined dialog class for ' + classname);
        return -1;
    }
    var messageclass = MXGetMessageClassFromName (dialogclass, messname);
    
    if (!messageclass) {
        OSError ('TEDAG008', 'message class undefined ' + messname);
        return -1;
    }

    if (mode == MXONSEND) {
        if ((executeprocedure = MXFindCallBack (messageclass, comclass.ExecuteOutputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (comclass.ExecuteOutputs, executeprocedure);
        return 1;
    }

    if (mode == MXONRECV) {
        if ((executeprocedure = MXFindCallBack (messageclass, comclass.ExecuteInputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (comclass.ExecuteInputs, executeprocedure);
        return 1;
    }
    if (mode == MXONACK) {
        if ((executeprocedure = MXFindCallBack (messageclass, comclass.ExecuteAck, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (comclass.ExecuteAck, executeprocedure);
        return 1;
    }

    return -1;
}

function MXRemoveGeneralCallBack (mx, classname, messname,mode, funct, applicationfield) {
    
    var executeprocedure;

    var dialogclass = MXGetDialogClassFromName (mx, classname);

    if (!dialogclass) {
        OSError ('TEDAG007', 'undefined dialog class for ' + classname);
        return -1;
    }
    
    var messageclass = MXGetMessageClassFromName (dialogclass, messname);
    
    if (!messageclass) {
        OSError ('TEDAG008', 'message class undefined ' + messname);
        return -1;
    }

    if (mode == MXONSEND) {
        if ((executeprocedure = MXFindGeneralCallBack (messageclass.ExecuteOutputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (messageclass.ExecuteOutputs, executeprocedure);
        return 1;
    }

    if (mode == MXONRECV) {
        if ((executeprocedure = MXFindGeneralCallBack (messageclass.ExecuteInputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (messageclass.ExecuteInputs, executeprocedure);
        return 1;
    }

    if (mode == MXONACK) {
        if ((executeprocedure = MXFindGeneralCallBack (messageclass.ExecuteInputs, funct, applicationfield)) == NULL)
            return 1;

        interface_ArrayRemove (messageclass.ExecuteAck, executeprocedure);
        return 1;
    }

    return -1;
}

function MXGetDialogClassFromName (mx, name) {
    for (var i = 0; i < mx.Classes.length; i++) {
        if (mx.Classes[i].Name == name) {
            return mx.Classes[i];
        }
    }
    return NULL;
}

function MXGetDialogClassFromCode (mx, ClassCode) {
    for (var i = 0; i < mx.Classes.length; i++) {
        if (mx.Classes[i].Code == ClassCode) {
            return mx.Classes[i];
        }
    }
    return NULL;    
}

function MXGetMessageClassFromName (dialogclass, name) {
    for (var i = 0; i < dialogclass.MessageClasses.length; i++) {
        if (dialogclass.MessageClasses[i].Name == name) {
            return dialogclass.MessageClasses[i];
        }
    }
    return NULL;
}

function MXGetMessageClassFromCode (mx, dialogclass, MessageClassCode) {
    for (var i = 0; i < dialogclass.MessageClasses.length; i++) {
        if (dialogclass.MessageClasses[i].Code == MessageClassCode) {
            return dialogclass.MessageClasses[i];
        }
    }
    return NULL;    
 
}

function MXGetMessageClassFromNames (mx, classname, messname) {

    var dialogclass = MXGetDialogClassFromName (mx, classname);
    if (!dialogclass) return NULL;

    var pmessageclass = MXGetMessageClassFromName (dialogclass, messname);

    return pmessageclass;
}

function MXGetMessageClassFromCodes (mx, ClassCode, MessageClassCode) {


    var dialogclass = MXGetDialogClassFromCode (mx, ClassCode);
    if (!dialogclass) return NULL;

    var pmessageclass = MXGetMessageClassFromCode (mx, dialogclass, MessageClassCode);

    return pmessageclass;
}

function MXGetObjectFromName (messageclass, name) {
    for (var i = 0; i < messageclass.Objects.length; i++) {
        if (messageclass.Objects[i].Name == name) {
            return messageclass.Objects[i];
        }
    }
    return NULL;    
}

function MXGetComClassFromName (mx, Name) {

    for (var i = 0; i < mx.ComClasses.length; i++) {
        if (mx.ComClasses[i].Name == Name) {
            return mx.ComClasses[i];
        }
    }
    return NULL;    
  
}

function MXGetComClassFromCode (mx, Code) {
    for (var i = 0; i < mx.ComClasses.length; i++) {
        if (mx.ComClasses[i].CodeCode == Code) {
            return mx.ComClasses[i];
        }
    }
    return NULL;    
}
