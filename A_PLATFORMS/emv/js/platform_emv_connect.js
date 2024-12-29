//----------------------------------------------------SERVERS PANEL------------------------------------------------ 
//---------------------------------------------------- IP ADDRESS-----------------------------------------------   

const TERMINAL         = "TERMINAL";
const CARD             = "CARD";
const ROUTER           = "ROUTER";


function EMVConnect(project, adress, port) {

    if (project.Com && project.Com.Socket.connected == true) 
        return;

        project.Com = new connect (adress, port, 
        {
            onconnectfunction:  function (com) {

                HighlightReader (ROUTER, project, 1, theme_on)

                let cuser = solution.get('user')
                com.Send(cuser.id + '*LOGIN*');
            },
            onmessagefunction:        function (com, data) {
                emv_TreatReception (project, data);
            },    
            ondisconnectfunction:     function (com, data) { HighlightReader(ROUTER, null, 0); },
            onclosefunction:          function (com, data) { HighlightReader(ROUTER, null, 0); },
            onerrorfunction:          function (com, data) { HighlightReader(ROUTER, null, 0); },   
            onupdatefunction:         function (com, data) { HighlightReader(ROUTER, null, 0); },
            onconnect_errorfunction:  function (com, data) { HighlightReader(ROUTER, null, 0); },
            onconnect_failedfunction: function (com, data) { HighlightReader(ROUTER, null, 0); },    
        }
    )

    return project.Com.Socket;
}

function HighlightReader (origin, reader, connect, color) {
    let elt = '';

    switch (origin) {
        case CARD:
            $('#button_card').css ('background', connect ? color : ''); 
            $('#button_card').css ('color', connect ? '#000000' : ''); 
        break;
        case TERMINAL:
            $('#button_terminal').css ('background', connect ? color : ''); 
            $('#button_terminal').css ('color', connect ? '#000000' : '');             
        break;
        case ROUTER:
            $('#button_router').css ('background', connect ? color : ''); 
            $('#button_router').css ('color', connect ? '#000000' : '');            

            if (!connect) {
                $('#button_card').css ('background', ''); 
                $('#button_terminal').css ('background', ''); 
                $('#button_card').css ('color',  '');            
                $('#button_terminal').css ('color',  '');  
            }

        break;        
    }    
}

function emv_TreatTrace(origin, reader, values) {
    let result;

    switch (origin) {
        case CARD:

            Tester.card_write (values[1])
        break;
        case TERMINAL:
            Tester.terminal_write (values[2])
        break;
    }
}

function emv_TraceAPDU (data, dataSize, type, updateparserpanel) {
    let strace = "";
    strace =  type + ':\n';
	
    if (type ==  'R-APDU') {
        let sw1       = data.substring(data.length - 4, data.length - 2)
        let sw2       = data.substring(data.length - 2);        
        let sdata     = data.substring (0, data.length - 4)
        strace += '    Body (optional) : ' + sdata  + '\n';
		strace += '    Trailer (required) : SW1 ' + sw1 + ' SW2 ' + sw2 + '\n';
        
        if (updateparserpanel) {

            let rapdu = TLVParse(sdata)[0];
            if (rapdu == null) {
                rapdu = {}                
            }
            rapdu.sw1 = sw1;
            rapdu.sw2 = sw2;
            
            let rapdu_index = Tester.Reader.RAPDU.length;                
            Tester.Reader.RAPDU.push (rapdu);
            
            emv_apdu_closeall();            
            emv_rapdu_update(rapdu, rapdu_index, sdata, emv_apdu_tree)
            emv_rapduselect (rapdu, rapdu_index, 1)
        }
	} else {
        let capdu = {};
        capdu.cla       = data.substring(0,2);
        capdu.ins       = data.substring(2,4);
        capdu.p1        = data.substring(4,6);
        capdu.p2        = data.substring(6,8);
        capdu.lc        = data.substring(8,10);
        capdu.df        = data.substring(10);
        
        let lc          = parseInt(capdu.lc, 16)
        
        strace += '    Header (required) : CLA ' + capdu.cla + ' INS ' + capdu.ins + ' P1 ' + capdu.p1 + ' P2 ' + capdu.p2 + (lc == 0 ? '' : ' LC ' + capdu.lc) + '\n';
        strace += '    Body (optional) : ' + capdu.df  + '\n';      
          
        if (updateparserpanel) {
            let capdu_index = Tester.Reader.CAPDU.length;            
            Tester.Reader.CAPDU.push (capdu);    

            emv_apdu_closeall();            
            emv_capdu_update (capdu, capdu_index, emv_apdu_tree)
            emv_capduselect (capdu, capdu_index, 1)
        }
    }
	return strace;
}

function emv_TreatAPDU(origin, reader, values) {
    
    let result, trace_hexa;
    let type    = values[0];

    switch (origin) {
        case CARD:
            result      = values[1]
            trace_hexa  = emv_TraceAPDU(result, result.length, type);
            Tester.card_write (trace_hexa)
        break;
        case TERMINAL:
            result      = values[2]
            trace_hexa  = emv_TraceAPDU(result, result.length, type, 1);
            Tester.terminal_write (trace_hexa)
        break;
    }    
}

function emv_TreatTLV(origin, reader, values) {
    
    let result, trace_hexa;
    let type    = values[0];
    return;
    switch (origin) {
        case CARD:
 
        break;
        case TERMINAL:
            result      = values[2]
            var tags    = TLVParse(result);       
            for (var i = 0; i < tags.length; i++) {

                console.log ('--------------------------------------- TAG : ' + tags[i].tag)
                let isascii    = true;
                let valuetext  = '';
                let asciivalue = '';

                let tagname = gettagname (tags[i].tag);
                if (tagname == "") {
                    console.log ('NAME : not found');
                } else {
                    console.log ('NAME : ' + gettagname (tags[i].tag))
                }

                asciivalue = hexa_to_ascii(tags[i].value);
                isascii = /^[\x20-\x7F]+$/.test(asciivalue);   // ascii printable

                if (isascii) {
                    console.log ('ASCII : ' + asciivalue)
                } else {
                    asciivalue = '';
                }

                valuetext = gettagvalue_text(tags[i]) ;
                
                if (valuetext) {
                    console.log('HTML yes')
                }  
            //    sb.table_addrow(emv_transactiontags_table, [tags[i].tag, tagname, tags[i].value, asciivalue, 'valuetext'])    
            }

        break;
    }    
}


function emv_TreatTAG(origin, reader, values) {
    
    let result, trace_hexa;
    let type    = values[0];

    switch (origin) {
        case CARD:
 
        break;
        case TERMINAL:
            result      = values[2]
            var tags    = TLVParse(result);       
            for (var i = 0; i < tags.length; i++) {

             //   console.log ('--------------------------------------- TAG : ' + tags[i].tag)
                let isascii    = true;
                let valuetext  = '';
                let asciivalue = '';

                let tagname = gettagname (tags[i].tag);
                if (tagname == "") {
                    console.log ('NAME : not found ' + tags[i].tag);
                } else {
               //     console.log ('NAME : ' + gettagname (tags[i].tag))
                }

                asciivalue = hexa_to_ascii(tags[i].value);
                isascii = /^[\x20-\x7F]+$/.test(asciivalue);   // ascii printable

                if (isascii) {
              //      console.log ('ASCII : ' + asciivalue)
                } else {
                    asciivalue = '';
                }

                valuetext = gettagvalue_text(tags[i]) ;
                
                if (valuetext) {
               //     console.log('HTML yes')
                }  
                var t = $('#emv_transactiontags_table').DataTable();
                let row = t.row.add([tags[i].tag, tagname, tags[i].value, asciivalue, 'valuetext'])
                row.draw(); 
                let rownode = row.node();
                $(rownode)[0].scrollIntoView();
            }

        break;
    }    
}

function emv_TreatStep(origin, reader, values) {
        
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let step = values[2];            
            emv_selectstep(step, 1);
        break;
    }    
}

function emv_TreatSetTSI(origin, reader, values) {
        
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b =  parseInt(values[2]);            
            emv_byte_select(emv_TSIPanel, b, 1);
        break;
    }    
}

function emv_TreatSetTVR(origin, reader, values) {
        
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = parseInt(values[2]);            
            emv_byte_select(emv_TVRPanel, b, 1);
        break;
    }    
}

function emv_TreatTT(origin, reader, values) {             // terminal type
    return;
    let byteint = parseInt(values[2]);
    emv_tt_update(emv_TTPanel, byteint.toString(16), 1) 
}

function emv_TreatTC(origin, reader, values) {             //terminal capabilities
    return;
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);            
            emv_byte_update(emv_TCPanel, b, 1);
        break;
    }    
}

function emv_TreatATC(origin, reader, values) {              //additional terminal capabilities
    return;
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);             
            emv_byte_update(emv_ATCPanel, b, 1, 3);
        break;
    }    
}

function emv_TreatAUC(origin, reader, values) {
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);    
            console.log('AUC')        
            emv_byte_update(emv_AUCPanel, b, 1);
        break;
    }    
}    

function emv_TreatTVR(origin, reader, values) {
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let type = values[0]
            let b = BigInt(values[2]);      
            switch (type) {
                case "IAC_Denial":
                    emv_byte_update(emv_IACDenialPanel, b, 1);                    
                    break;
                case "IAC_Online":
                    emv_byte_update(emv_IACOnlinePanel, b, 1);                    
                    break;
                case "IAC_Default":
                    emv_byte_update(emv_IACDefaultPanel, b, 1);                    
                    break;
                case "TAC_Denial":
                    emv_byte_update(emv_TACDenialPanel, b, 1);                    
                    break;
                case "TAC_Online":
                    emv_byte_update(emv_TACOnlinePanel, b, 1);                    
                    break;
                case "TAC_Default":
                    emv_byte_update(emv_TACDefaultPanel, b, 1);                    
                    break;
    
            }
            break;
    }
}           
               
function emv_TreatAUC(origin, reader, values) {
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);              
            emv_byte_update(emv_AUCPanel, b, 1);
        break;
    }    
}    

function emv_TreatAIP(origin, reader, values) {      
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);            
            emv_byte_update(emv_AIPPanel, b, 1);
        break;
    }    
}

function emv_TreatCTQ(origin, reader, values) {    
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);           
            emv_byte_update(emv_CTQPanel, b, 1);
        break;
    }    
}

function emv_TreatCID(origin, reader, values) {
        console.log ('CID ' + values[2])
}

function emv_TreatCRYPTO(origin, reader, values) {
    console.log ('Crypto Type ' + values[2])
}

function emv_TreatSC(origin, reader, values) {
    console.log ('Service Code ' + values[2])
}


function emv_TreatCVM(origin, reader, values) {
    console.log ('CVM ' + values[2])
}

// CONNECT FROM SERVER RECEIVED WHEN READER CARD DISCONNECT OR CONNECT

function emv_TreatConnect(origin, reader, values) {
    let result = values[2];
    let connect = (result == "1");

    console.log ('treat connect ' + origin + ' connect: ' + connect)
    switch (origin) {
        case CARD:
            if (connect) {
                HighlightReader (origin, reader, connect,  theme_on);
            } else {
                let cuser = solution.get('user')  
                reader.Com.Send(cuser.id + '*LOGIN*');
            }    
        break;
        case TERMINAL:
            HighlightReader (origin, reader, connect,  theme_on);
        break;
    }    
}

function emv_TreatLogin(origin, reader, values) {
    let result = values[1];
    let connect = (result == "OK");
    console.log ('treat login ' + origin + ' connect: ' + connect)
    switch (origin) {
        case CARD:
            break;
            case TERMINAL:

            break;
    }            
    HighlightReader (origin, reader, connect,  theme_on);
}

function emv_TreatInit(origin, reader, values) {
    let result = values[0];

    switch (origin) {
        case CARD:
            if (result == 'START') {
                emv_tester_reset();  
                Tester.Reader.start_record ();                
            }            
        break;
        case TERMINAL:
            if (result == 'END') {
                Tester.Reader.stop_record ();                
            }
        break;
    }            
}

function emv_TreatCommand(origin, reader, Line, values) {

    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
        break;
        case ROUTER:
        break;
    }
 
    if (values[0] == "LOGIN") {
        emv_TreatLogin(origin, reader, values);
    } else
    if (values[0] == "CONNECT") {

        emv_TreatConnect(origin, reader, values);
    } else
    if (values[0] == "START" || values[0] == "END") {
        emv_TreatInit(origin, reader, values);
    } else
    if (values[0] == "TRACE") {
        emv_TreatTrace(origin, reader, values);
    } else
    if (values[0] == "TLV") {
        emv_TreatTLV(origin, reader, values);
    } else
    if (values[0] == "TAG") {
        emv_TreatTAG(origin, reader, values);
    } else    
    if (values[0] == "R-APDU" || values[0] == "C-APDU") {
        emv_TreatAPDU(origin, reader, values);
    } else
    if (values[0] == "STEP") {
        emv_TreatStep(origin, reader, values);
    } else
    if (values[0] == "SETTSI") {
        emv_TreatSetTSI(origin, reader, values);
    } else
    if (values[0] == "SETTVR") {
        emv_TreatSetTVR(origin, reader, values);
    } else         
    if (values[0] == "AIP") {
        emv_TreatAIP(origin, reader, values);
    } else         
    if (values[0] == "AUC") {
        emv_TreatAUC(origin, reader, values);
    } else         
    if (values[0] == "IAC_Denial") {
        emv_TreatTVR(origin, reader, values);
    } else  
    if (values[0] == "IAC_Online") {
        emv_TreatTVR(origin, reader, values);
    } else  
    if (values[0] == "IAC_Default") {
        emv_TreatTVR(origin, reader, values);
    } else          
    if (values[0] == "TAC_Denial") {
     //   emv_TreatTVR(origin, reader, values);
    } else  
    if (values[0] == "TAC_Online") {
  //      emv_TreatTVR(origin, reader, values);
    } else  
    if (values[0] == "TAC_Default") {
 //       emv_TreatTVR(origin, reader, values);
    } else          

    if (values[0] == "CTQ") {
        emv_TreatCTQ(origin, reader, values);
    } else         
    if (values[0] == "CID") {
        emv_TreatCID(origin, reader, values);
    } else         
    if (values[0] == "CRYPTO") {
        emv_TreatCRYPTO(origin, reader, values);
    } else   
    if (values[0] == "SERVICECODE") {                      // service code
        emv_TreatSC(origin, reader, values);
    } else 
    if (values[0] == "TT") {                               //terminal type
        emv_TreatTT(origin, reader, values);
    } else          
    if (values[0] == "TC") {                               //terminal capabilities
        emv_TreatTC(origin, reader, values);
    } else          
    if (values[0] == "ATC") {                               //terminal capabilities
        emv_TreatATC(origin, reader, values);
    } else          
    if (values[0] == "CVM") {
        emv_TreatCVM(origin, reader, values);
    }        

    
}


function emv_TreatReception (reader, recmessage) {        
    if (!recmessage) return;
    
    if (Tester.Reader) {
        Tester.Reader.record (recmessage);
    }

    if (recmessage.substring(0, 1) != ":") {
        Tester.CardInput.setValue ("Receiving strange on " + reader);
    }
    let index   = recmessage.indexOf("*");
    let message = recmessage.substring(index + 1);
    let length  = message.length;
    let origin  = recmessage.substring(1, index); 
     
    let output;
    
    if (reader.Buffer !== undefined) {
        if (message[length - 1] != "*") {
            reader.Buffer  = reader.Buffer + message;
            return;
        } else {
            output = reader.Buffer + message;
        }
    } else {
        reader.Buffer = message;
        output = message;
    }

    if (reader.Buffer) {
        reader.Buffer = "";
    }

    let lines = output.split('*');

    length = lines.length;

    for (var j = 0; j < length; j++) {
        if (lines[j].length < 1) continue;
        var Line = lines[j];
        var values = Line.split('^');
        emv_TreatCommand(origin, reader, Line, values);
    }
}
