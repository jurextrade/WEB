var Tester;
var testerStartAsync;

function emv_tester_init () {
 
    $('#ignore_apdu').prop('checked',    !Tester.Reader.IgnoreApdu)  
    $('#ignore_step').prop('checked',    !Tester.Reader.IgnoreStep)  
    $('#ignore_trace').prop('checked',   !Tester.Reader.IgnoreTrace)   
    $('#ignore_tag').prop('checked',     !Tester.Reader.IgnoreTag)      

    emv_byte_init(emv_TVRPanel);
    emv_byte_init(emv_TSIPanel);
        
    emv_byte_init(emv_TACDenialPanel)
    emv_byte_init(emv_TACOnlinePanel)
    emv_byte_init(emv_TACDefaultPanel)

    emv_byte_init(emv_IACDenialPanel)
    emv_byte_init(emv_IACOnlinePanel)
    emv_byte_init(emv_IACDefaultPanel)

    emv_byte_init(emv_AUCPanel);
    emv_byte_init(emv_AIPPanel);    

    emv_apdu_init ();      
    $('#emv_transactiontags_table').DataTable(
        {
            fixedColumns: true,   
            autoWidth: false,                
            resizableColumns: true,    
            scrollY:        true,
            scrollX:        true,
            scrollCollapse: true,
            paging:         false,
        }
    );
    $('#emv_transactiontags_table_filter .sb_search').detach().appendTo('#emv_transactiontags_searchgroup')   
    $('#emv_transactiontags_table_filter').remove();      
    emv_selectstep('0');
}

function emv_tester_reset () {
    emv_apdu_init();

    emv_byte_init(emv_TVRPanel);
    emv_byte_init(emv_TSIPanel);

    //emv_byte_init(emv_TCPanel);
    //emv_byte_init(emv_ATCPanel);

    emv_byte_init(emv_TACDenialPanel)
    emv_byte_init(emv_TACOnlinePanel)
    emv_byte_init(emv_TACDefaultPanel)    

    emv_byte_init(emv_IACDenialPanel)
    emv_byte_init(emv_IACOnlinePanel)
    emv_byte_init(emv_IACDefaultPanel)    

    emv_byte_init(emv_AUCPanel);
    emv_byte_init(emv_AIPPanel);                
    //sb.table_clear(emv_transactiontags_table) 
    $('#emv_transactiontags_table').DataTable().rows().remove().draw();    
         
    Tester.terminal_clear();
    Tester.card_clear();          
     
}

function  onclick_emv_tester_button (elt, event) {
    switch (elt.id) {
        case 'emv_tester_play_button':
            Tester.Reader.play ();
        break;
        case 'emv_tester_start_button'  :
            Tester.Reader.start ();            
        break;
        case 'emv_tester_forward_button' :
            Tester.Reader.nextstep()
        break;
        case 'emv_tester_stop_button':
        break;

        case 'emv_tester_back_button':
        break;
        case 'emv_tester_pause_button'   :
        break;
    }

}

class CardReader {
    
    constructor () {
        this.Recording      = false; 
        this.RecordBuffer   = '';        
        this.Records        = [];
        this.RecordIndex    = 0;
        this.StepIndex      = 0;     
        this.RAPDU          = [];   
        this.CAPDU          = [];
        this.IgnoreApdu     = false;
        this.IgnoreStep     = false;
        this.IgnoreTrace    = false;
        this.IgnoreTag      = false;
     //   EMVConnect(this, solution.EMVRouter_Address, solution.EMVRouter_Port);
    }
    play () {
        clearInterval(testerStartAsync);        
        emv_tester_reset();
        this.reset();
        testerStartAsync = setInterval(function treat(reader) {
            if (reader.RecordIndex == reader.Records.length) {
                clearInterval(testerStartAsync);
                return;
            }
            reader.nextstep()    
        }, 1, this);   // every milli second
    }
    reset () {
        this.RAPDU = [];
        this.CAPDU = [];     
        this.RecordIndex    = 0;   
   
    }        
    start () {
        emv_tester_reset();
        this.reset();
        emv_selectstep(0, true)          
    }
    nextstep () {
        this.RecordIndex += 1;            
        if (this.RecordIndex >= this.Records.length) {
            this.RecordIndex = this.Records.length;
            return;
        }
        let nextfound = true;

        for (var i = this.RecordIndex; i < this.Records.length; i++) {
            let nextfound   = true;
            let request     = this.Records[i];
            let origin      = request.origin;
            let line        = request.content;
            let values      = line.split('^');
            let commandtype = values[0];
            switch (commandtype) {
                case "TRACE":
                    if (this.IgnoreTrace) {
                        nextfound = false;
                        break;
                    }
                case "TLV":
                    break;
                case "TAG":
                    if (this.IgnoreTag) {
                        nextfound = false;
                    }
                    break;
                case "R-APDU":
                    if (this.IgnoreApdu) {
                        nextfound = false;
                    }
                    break;
                case "C-APDU":
                    if (this.IgnoreApdu) {
                        nextfound = false;
                    }
                    break;
                case "STEP":
                    if (this.IgnoreStep){
                        nextfound = false;
                    }
                    break;
                case "SETTSI":
                    break
                case "SETTVR":
                    break
                case "AIP":
                    break
                case "AUC":
                    break
                case "CTQ":
                    break
                case "CID":
                    break
                case "CRYPTO":
                    break
                case "SERVICECODE":
                    break
                case "TT":
                    break
                case "TC":
                    break
                case "CVM":
                    break;                
            }
            if (nextfound) {
                this.RecordIndex = i;
         //       request.origin == TERMINAL ?  Tester.terminal_write (values + '\n')  : Tester.card_write (values + '\n') 
                emv_TreatCommand(request.origin, this, request.content, values);                  
                return;
            }
        }
        return 

    }
    record (buffer) {
        if (this.Recording ) {
            this.RecordBuffer += buffer;
        }
    }
    start_record () {
        this.reset()
        this.RecordBuffer   = '';  
        this.Recording  = true;
    }
    stop_record () {
        this.Recording = false;
        this.save_record();
        this.save_transaction('essai')
    }

    save_record () {
        this.Records = [];               
        var cardrequests =  this.RecordBuffer.split (':CARD*');

        for (var i = 0; i < cardrequests.length; i++) {
            if (cardrequests[i] == '') continue;
            var terminalrequests =  cardrequests[i].split (':TERMINAL*');  // TERMINAL CARD ....
            for (var k = 0; k < terminalrequests.length; k++) {
                var lines = terminalrequests[k].split('*');
                length = lines.length;
                for (var j = 0; j < length; j++) {
                    if (lines[j].length < 1) continue;
                    var Line = lines[j];
                    this.Records.push ({origin: k == 0 ? 'CARD' : 'TERMINAL', content: Line});
                }
            }    
        }
    }
    save_transaction (name) {
        console.log ('save transacation')
        let cuser = solution.get('user')
        if (!cuser.is_registered()) {
            return;
        }
        let path        = cuser.path + '/EMV/' + solution.emv_CurrentProject.Folder

        cuser.send({Name: 'makedir',  Values: [path, 'Transactions']}, false, function (content, values) {}, [this])

        let transactionfile     = cuser.fileexplorer.Root +  path + "/Transactions/"  + name + '.trs';


        cuser.send ({Name: 'savefile', Values: [transactionfile,  this.RecordBuffer]}, true, 
            function (content, values) {
                DisplayOperation("Transaction " + values[0] + " Saved", true, 'operationpanel');                             
            }, 
        [name + 'trs']);  
    }
    load_transaction (){

    }
   
}

class emvtester {
    constructor () {
        this.Com    = null;   
        this.CardInput;
        this.TerminalInput;  
        this.init();
        this.Reader = new CardReader();       
    }
    card_init = function (id) {
        this.CardInput = new aceeditor('emv_card_input', "ace/theme/nord_dark", "ace/mode/jsx");      
        this.CardInput.setOptions( {
            showPrintMargin: false,        
            readOnly: true,        
            showLineNumbers: false,
            showGutter: false,
            highlightActiveLine: false, 
            highlightGutterLine: false  
        });    
    }   
    terminal_init = function (id) {
        this.TerminalInput = new aceeditor('emv_terminal_input' , "ace/theme/nord_dark", "ace/mode/jsx");      
        this.TerminalInput.setOptions( {
            showPrintMargin: false,        
            readOnly: true,        
            showLineNumbers: false,
            showGutter: false
        });    
    }    
    init = function () {
        this.card_init () 
        this.terminal_init()    
        this.card_clear();
        this.terminal_clear();
    }
    resize () {
        this.CardInput.resize();
        this.TerminalInput.resize();
    }        
    card_clear = function () {
        this.CardInput.setValue('');  
    }
    terminal_clear = function () {
        this.TerminalInput.setValue('');  
    }

    oneval (env, args, request) {
        if (defined (env)) {
            var start = env.curOp.selectionBefore.start;
            var end   = env.curOp.selectionBefore.end;
        }
        this.sendmessage (this.input_getcontent ());    
    }
    card_write (content) {
        Tester.CardInput.setValue (Tester.CardInput.getValue() + content);
        Tester.CardInput.gotoEnd (); 
    }
    terminal_write (content) {
        Tester.TerminalInput.setValue (Tester.TerminalInput.getValue() + content);
        Tester.TerminalInput.gotoEnd (); 
   }

}

function cardinputresize() {
    if (Tester) Tester.CardInput.resize()
}

function terminalinputresize() { 
    if (Tester) Tester.TerminalInput.resize()
}

function onclick_emv_tester_filtergroup(elt, event) {
    var checked = $(elt).prop('checked');    
    $(elt).prop('checked', checked);    
    
    switch (elt.id) {
        case 'ignore_apdu': 
            Tester.Reader.IgnoreApdu = !checked;
            break;
        case 'ignore_step':
            Tester.Reader.IgnoreStep = !checked;
            break;
        case 'ignore_trace':
            Tester.Reader.IgnoreTrace = !checked;
            break;
        case 'ignore_tag':
            Tester.Reader.IgnoreTag = !checked;
            break;                
    }
}


function onclick_emv_tester_reader(elt, event) {

}

function onclick_emv_tester_terminal(elt, event) {

}



function emv_command_container(id) {
    var content = '<input type="range" id="' + id + '" class="form-range" value="999" min="1" max="1000" step="0.1"  onchange="">';
    return content;
}

function onclick_emv_resetcardinput(elt, event) {
    Tester.card_clear();
}

function onclick_emv_resetterminalinput(elt, event) {
    Tester.terminal_clear();
}


function onclick_testertogglepanel(elt, event) {

    let s_testerpanel = $(elt).closest('.sb_panel');

    console.log ('resize')
    if (s_testerpanel.hasClass('toggled')) {
        s_testerpanel.removeClass('toggled');
        sb.resize(emv_tester_sidepanel);        
    }
    else {
        s_testerpanel.addClass('toggled');
        sb.resize(emv_tester_sidepanel);        
    }   
}


function onclick_testerfspanel (elt, event) {
    let parentpanel        = $(elt.parentElement.parentElement.parentElement);
     emv_tester_toggle_all (0)
     parentpanel.addClass('toggled')
     parentpanel.find('.box-btn-slide').addClass('rotate-180')       
     sb.resize(emv_tester_sidepanel);        
}

function onclick_testercspanel (elt, event) {
    
}

function emv_tester_toggle_all (open) {
    let panel_array = [ $('#emv_tester_terminalpanel'),  $('#emv_tester_cardpanel'), $('#emv_apdupanel'), $('#emv_transactiontagspanel') ]
    for (var i = 0; i < panel_array.length; i++) {
        let s_testerpanel = panel_array[i];
        if (open)  {
            s_testerpanel.addClass('toggled')
        } 
        else {
            s_testerpanel.removeClass('toggled'); 
            s_testerpanel.find('.box-btn-slide').removeClass('rotate-180')  
        }
    }
}