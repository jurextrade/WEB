//----------------------------------------------------SERVERS PANEL------------------------------------------------ 
//---------------------------------------------------- IP ADDRESS-----------------------------------------------   

const TERMINAL         = "TERMINAL";
const CARD             = "CARD";
const ROUTER           = "ROUTER";
var RouterCom          = null;

function EMVConnect(adress, port) {

    if (RouterCom && RouterCom.Socket.connected == true) 
        return;

        RouterCom = new connect (adress, port, 
        {
            onconnectfunction:  function (com) {

                HighlightReader (ROUTER, 1, theme_on)

                let cuser = solution.get('user')
                com.Send(cuser.id + '*LOGIN*');
            },
            onmessagefunction:        function (com, data) {
                emv_TreatReception (com, data);
            },    
            ondisconnectfunction:     function (com, data) { HighlightReader(ROUTER, 0); },
            onclosefunction:          function (com, data) { HighlightReader(ROUTER, 0); },
            onerrorfunction:          function (com, data) { HighlightReader(ROUTER, 0); },   
            onupdatefunction:         function (com, data) { HighlightReader(ROUTER, 0); },
            onconnect_errorfunction:  function (com, data) { HighlightReader(ROUTER, 0); },
            onconnect_failedfunction: function (com, data) { HighlightReader(ROUTER, 0); },    
        }
    )

    return RouterCom.Socket;
}

function HighlightReader (origin, connect, color) {
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


function emv_TreatDialogTrace (title, message) {
    sb.modal ({
        id: 'emv_card_modal', 
        header: title,
        resizable: true,
        body:  '<div class="emv_card_message">' + message + '</div>', 
        footer: '',
//            '<button class="sb_mbutton" onclick="onclick_exporttransaction_file()">Save</button>' +
//            '<button class="sb_mbutton" data-bs-dismiss="modal">Cancel</button>',                      
    });  
    
}

// CONNECT FROM SERVER RECEIVED WHEN READER CARD DISCONNECT OR CONNECT

function emv_TreatConnect(origin, reader, values) {
    let result = values[2];
    let connect = (result == "1");

    switch (origin) {
        case CARD:
            if (connect) {
                HighlightReader (origin, connect,  theme_on);
            } else {
                let cuser = solution.get('user')  
                reader.Send(cuser.id + '*LOGIN*');
            }    
        break;
        case TERMINAL:
            HighlightReader (origin, connect,  theme_on);
        break;
    }    
}

function emv_TreatLogin(origin, reader, values) {
    let result = values[1];
    let connect = (result == "OK");

    switch (origin) {
        case CARD:
            break;
            case TERMINAL:

            break;
    }            
    HighlightReader (origin, connect,  theme_on);
}

function emv_TreatInit(origin, reader, values, fromrouter) {
    let result = values[0];

    switch (origin) {
        case CARD:
            if (result == 'START') {
                Tester.Reader.start (fromrouter);        
            }            
        break;
        case TERMINAL:
            if (result == 'END') {
                Tester.Reader.end (fromrouter); 
                        
                if (fromrouter) {   
                    ExportFileConfirm('Do you want to save this Transaction in a File ?' , 'Tester.Reader.save_transaction')
                } else {
                    $('#emv_tester_play_button ' + 'i').attr('class', icon_repeat);                                 
                }
            }
        break;
    }            
}

function emv_TreatPlug (origin, reader, values, display, fromrouter) {
    let result;
    console.log ('treatplug')
    switch (origin) {
        case CARD:
            console.log(values[2])
            let cuser = solution.get('user')    
          
            if (!fromrouter) {
                return;
            }
            break;
        case TERMINAL:
            break;
        }
}

var selectTimeout = null;

function timeout_selectpanel () {
    let cuser = solution.get('user')       
    RouterCom.Send(cuser.id + '*ABORT*Time Out*');
    $("#emv_card_modal").modal('hide');    
    clearTimeout(selectTimeout);
}

function onclick_selectcancel () {
    let cuser = solution.get('user')       
    RouterCom.Send(cuser.id + '*ABORT*Cancelled by User*');
    $("#emv_card_modal").modal('hide');    
}

function onclick_selectbutton (elt, id) {
    let cuser       = solution.get('user')     
    let selection   = elt.id.substring(15, 17)
    RouterCom.Send(cuser.id + '*SELECT*' + selection + '*');
    $("#emv_card_modal").modal('hide');    
}

function emv_TreatSelect(origin, reader, values, display, fromrouter) {
    let result;

    switch (origin) {
        case CARD:
            let cuser = solution.get('user')    
            let menu = [];
            let j = 0;
            for (var i = 2; i < values.length; i++) {
                Tester.card_write (values[i] + '\n');                
                let labels = values[i].split('-');
                menu.push ({id: 'button_select_' + j,   item : labels[1], type: 'button', style: "width:100%", class: '',   events: {onclick: "onclick_selectbutton (this, event)"}, title:labels[0]})
                j++;
            }
            if (!fromrouter) {
                return;
            }
            let bodymodal = {
                id: 'select_bodymodal',
                type: 'bar',
                direction: 'column',       
                items :  menu,       
            }
            sb.modal ({
                id: 'emv_card_modal', 
                header: 'Select Application',
                resizable: true,
                static: true,                
                onopen:  function () {selectTimeout = setTimeout(timeout_selectpanel, 15000);
                                      $("#emv_card_modal .modal-close").css ('display', 'none')
                                    },
                body:  sb.render (bodymodal), 
                footer:  '<button class="sb_mbutton" onclick="onclick_selectcancel()">Cancel</button>',                      
            });       
            $("#emv_card_modal .modal-close").css ('display',  'none')                
         //   RouterCom.Send(cuser.id + '*ABORT*Cancelled by User*'); // + delta.lines[0]);     
//            RouterCom.Send(cuser.id + '*SELECT^1*'); // + delta.lines[0]);                   
        break;
        case TERMINAL:

        break;
    }
}

function emv_TreatInfo(origin, reader, values, display) {
    console.log ('treatinfo')
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let elt = {
                id: 'step_' + Tester.Reader.CurrentStep,
                type: "label",
                item: values[2],          
                class:  '', 
                events: {onmousedown: ""},            
            }            
            let content =  sb.render(elt);

            $('#step_' + Tester.Reader.CurrentStep + '_Info').append (content);            
        break;
    }
}

var card_waiting_response = 0;

function emv_TreatTrace(origin, reader, values, display) {
    let result;
    //if (card_waiting_response) {
    //    $("#emv_card_modal").modal('hide');    
    //    card_waiting_response = 0;          
    //}

    switch (origin) {
        case CARD:
            switch (values[2]) {
                case  "Insert Card\n" :
                case "System Problem Remove Card\n" :
                case "Transaction Completed please Remove Card\n" :
                    TreatOperation(values[2], 'operationpanel');
//                    emv_TreatDialogTrace('Card', values[1]);
//                    card_waiting_response = 1;
                    break;   
            }
            Tester.card_write (values[2])
        break;
        case TERMINAL:
            Tester.terminal_write (values[2])
        break;
    }
}

function emv_TraceAPDU (data, dataSize, type, updateparserpanel, display) {
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
            emv_rapdu_update(rapdu, rapdu_index, sdata, emv_apdu_roottree)
            emv_rapduselect (rapdu, rapdu_index, display)
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
            emv_capdu_update (capdu, capdu_index, emv_apdu_roottree)
            emv_capduselect (capdu, capdu_index, display)
        }
    }
	return strace;
}

function emv_TreatAPDU(origin, reader, values, display, router) {
    
    let result, trace_hexa;
    let type    = values[0];

    switch (origin) {
        case CARD:
            result      = values[2]
            trace_hexa  = emv_TraceAPDU(result, result.length, type, 0, display);
        //    emv_TreatTrace(origin, reader, trace_hexa)
            if (!router && !Tester.Reader.IgnoreTrace) {
                Tester.card_write (trace_hexa)
            }
        break;
        case TERMINAL:
            result      = values[2]
            trace_hexa  = emv_TraceAPDU(result, result.length, type, 1, display);
            if (!router && !Tester.Reader.IgnoreTrace) {
                Tester.terminal_write (trace_hexa)
            }
        break;
    }    
}

function emv_TreatTLV(origin, reader, values, display) {
    
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

function emv_updatebarname (content, values) {
    let obj_response = JSON.parse(content);
    obj_response = obj_response.data[0];
    let vendor = obj_response.Vendor;
    let cardname = obj_response.Name;
    let id = values[0];
    $('#' + id).html (vendor + '--' + cardname)
}

function emv_TreatTAG(origin, reader, values, display) {
    
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
                if (tags[i].tag == "9F06") {
                    emv_table_search_aidtable(tags[i].value, 'AID', emv_updatebarname, ['emv_tester_terminalbar_description'])
                    console.log ('Application Selected')

                }   
            }

        break;
    }    
}

function emv_TreatStep(origin, reader, values, display, router) {
        
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let step = values[2];            
            Tester.Reader.CurrentStep = step;            
            emv_selectstep(step, display);
            if (!router) {
                emv_tester_stepsgroup_selectstep(step)
            }
        break;
    }    
}

function emv_TreatSetTSI(origin, reader, values, display) {
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b =  parseInt(values[2]);            
            emv_byte_select(emv_TSIPanel, b, display);
        break;
    }    
}

function emv_TreatSetTVR(origin, reader, values, display) {
    console.log ('TVR');
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = parseInt(values[2]);            
            emv_byte_select(emv_TVRPanel, b, display);
        break;
    }    
}

function emv_TreatTT(origin, reader, values, display) {             // terminal type
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = parseInt(values[2]);    
            emv_tt_update(emv_TTPanel, b.toString(16), display) 
            break;
    }              
}

function emv_TreatTC(origin, reader, values, display) {             //terminal capabilities

    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);                 
            emv_byte_update(emv_TCPanel, b, display);
        break;
    }    
}

function emv_TreatATC(origin, reader, values, display) {              //additional terminal capabilities
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);             
            emv_byte_update(emv_ATCPanel, b, display);
        break;
    }    
}

function emv_TreatTTQ(origin, reader, values, display) {              //additional terminal capabilities
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);             
            emv_byte_update(emv_TTQPanel, b, display);
        break;
    }    
}


function emv_TreatTVR(origin, reader, values, display) {
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let type = values[0]
            let b = BigInt(values[2]);      
            switch (type) {
                case "IAC_Denial":
                    emv_byte_update(emv_IACDenialPanel, b, display);                    
                    break;
                case "IAC_Online":
                    emv_byte_update(emv_IACOnlinePanel, b, display);                    
                    break;
                case "IAC_Default":
                    emv_byte_update(emv_IACDefaultPanel, b, display);                    
                    break;
                case "TAC_Denial":
                    emv_byte_update(emv_TACDenialPanel, b, display);                    
                    break;
                case "TAC_Online":
                    emv_byte_update(emv_TACOnlinePanel, b, display);                    
                    break;
                case "TAC_Default":
                    emv_byte_update(emv_TACDefaultPanel, b, display);                    
                    break;
    
            }
            break;
    }
}           

function emv_TreatAUC(origin, reader, values, display) {
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);    
            console.log('AUC')        
            emv_byte_update(emv_AUCPanel, b, display);
        break;
    }    
}
               

function emv_TreatAIP(origin, reader, values, display) {      
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);            
            emv_byte_update(emv_AIPPanel, b, display);
        break;
    }    
}

function emv_TreatCTQ(origin, reader, values, display) {    
    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
            let b = BigInt(values[2]);           
            emv_byte_update(emv_CTQPanel, b, display);
        break;
    }    
}

function emv_TreatCID(origin, reader, values, display) {
        console.log ('CID ' + values[2])
}

function emv_TreatCRYPTO(origin, reader, values, display) {
    console.log ('Crypto Type ' + values[2])
}

function emv_TreatSC(origin, reader, values, display) {
    console.log ('Service Code ' + values[2])
}


function emv_TreatCVM(origin, reader, values, display) {
    console.log ('CVM ' + values[2])
}



function onclick_exporttransaction_file() {
    Tester.Reader.save_transaction($('#export_filename').val())
   $("#exportserver_filename").modal('hide');      
}


function ExportFileConfirm(title, callafter) {
    sb.modal ({
        id: 'exportserver_filename', 
        header: title,
        resizable: true,
        body: sb.render ({id: 'export_filename', item: 'File Name', type:'text',   class: "sb_formgroup", value:"Transaction_1"}),
        footer: 
            '<button class="sb_mbutton" onclick="onclick_exporttransaction_file()">Save</button>' +
            '<button class="sb_mbutton" data-bs-dismiss="modal">Cancel</button>',                      
    });  
}



function emv_TreatCommand(origin, reader, Line, values, display, router) {

    switch (origin) {
        case CARD:
        break;
        case TERMINAL:
        break;
        case ROUTER:
        break;
    }
    if (values[0] == "CONNECT") {

        emv_TreatConnect(origin, reader, values);
    } else
    if (values[0] == "LOGIN") {
        emv_TreatLogin(origin, reader, values);
    } else
    if (values[0] == "START" || values[0] == "END") {
        emv_TreatInit(origin, reader, values, router);
    } else
    if (values[0] == "SELECT") {
        emv_TreatSelect(origin, reader, values, display, router);
    } else    
    if (values[0] == "PLUG") {
        emv_TreatPlug(origin, reader, values, display, router);
    } else    
    if (values[0] == "INFO") {
        emv_TreatInfo(origin, reader, values, display);
    } else
    if (values[0] == "TRACE") {
        emv_TreatTrace(origin, reader, values, display);
    } else
    if (values[0] == "TLV") {
        emv_TreatTLV(origin, reader, values, display);
    } else
    if (values[0] == "TAG") {
        emv_TreatTAG(origin, reader, values, display);

    } else    
    if (values[0] == "R-APDU" || values[0] == "C-APDU") {
        emv_TreatAPDU(origin, reader, values, display, router);
    } else
    if (values[0] == "STEP") {
        emv_TreatStep(origin, reader, values, display, router);
    } else
    if (values[0] == "SETTSI") {
        emv_TreatSetTSI(origin, reader, values, display);
    } else
    if (values[0] == "SETTVR") {
        emv_TreatSetTVR(origin, reader, values, display);
    } else         
    if (values[0] == "AIP") {
        emv_TreatAIP(origin, reader, values, display);
    } else         
    if (values[0] == "AUC") {
        emv_TreatAUC(origin, reader, values, display);
    } else         
    if (values[0] == "IAC_Denial") {
        emv_TreatTVR(origin, reader, values, display);
    } else  
    if (values[0] == "IAC_Online") {
        emv_TreatTVR(origin, reader, values, display);
    } else  
    if (values[0] == "IAC_Default") {
        emv_TreatTVR(origin, reader, values, display);
    } else          
    if (values[0] == "TAC_Denial") {
        emv_TreatTVR(origin, reader, values, display);
    } else  
    if (values[0] == "TAC_Online") {
        emv_TreatTVR(origin, reader, values, display);
    } else  
    if (values[0] == "TAC_Default") {
        emv_TreatTVR(origin, reader, values, display);
    } else          

    if (values[0] == "CTQ") {
        emv_TreatCTQ(origin, reader, values, display);
    } else         
    if (values[0] == "CID") {
        emv_TreatCID(origin, reader, values, display);
    } else         
    if (values[0] == "CRYPTO") {
        emv_TreatCRYPTO(origin, reader, values, display);
    } else   
    if (values[0] == "SERVICECODE") {                      // service code
        emv_TreatSC(origin, reader, values, display);
    } else 
    if (values[0] == "TT") {                               //terminal type
        emv_TreatTT(origin, reader, values), display;
    } else          
    if (values[0] == "TC") {                               //terminal capabilities
        emv_TreatTC(origin, reader, values, display);
    } else          
    if (values[0] == "ATC") {                               //Additionalterminal capabilities
        emv_TreatATC(origin, reader, values, display);
    } else    
    if (values[0] == "TTQ") {                               //Additionalterminal capabilities
        emv_TreatTTQ(origin, reader, values, display);
    } else              
    if (values[0] == "CVM") {
        emv_TreatCVM(origin, reader, values, display);
    }        

    
}


function emv_TreatReception (reader, recmessage) {     
    let fromrouter = 1;

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
        emv_TreatCommand(origin, reader, Line, values, 0, fromrouter);
    }
}
