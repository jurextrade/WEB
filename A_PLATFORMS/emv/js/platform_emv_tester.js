var Tester;

class emvtester {
    constructor () {
        this.Com    = null;   
        this.CardInput;
        this.TerminalInput;  
        this.init();
        this.Reader = new CardReader();       
    }
    card_init = function (id) {
        this.CardInput = new aceeditor('emv_testercardinput', "ace/theme/nord_dark", "ace/mode/jsx");      
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
        this.TerminalInput = new aceeditor('emv_tester_terminalinput' , "ace/theme/nord_dark", "ace/mode/jsx");      
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


//-------------------------------------------------------------------TESTER BARGROUP --------------------------------------------------------

function emv_tester_stepsgroup_selectstep (step) {

    //  $('#emv_tester_stepsgroup .EMVStep').removeClass ('selected');    
  
      let selected_element =  $('#emv_tester_stepsgroup .EMVStep').filter('#step_' +step)  
      if (selected_element.length != 0) {    
          selected_element.addClass ('selected')
      }
      return step;  
}

function  onclick_emv_tester_button (elt, event) {
    switch (elt.id) {
        case 'emv_tester_play_button':
            console.log('play')
            if (Tester.Reader.Statut == READER_PAUSED || Tester.Reader.Statut == READER_END) {
                if (Tester.Reader.Statut == READER_END) {
                  Tester.Reader.firststep ();  
                }
                Tester.Reader.play ();
                $('#emv_tester_play_button ' + 'i').attr('class', icon_pause);
            } else {
                if (Tester.Reader.Statut == READER_PLAYING) {            
                    Tester.Reader.pause ();
                    $('#emv_tester_play_button ' + 'i').attr('class', icon_play);                
                }
            }
        break;
        case 'emv_tester_start_button'  :
            Tester.Reader.firststep ();       
            $('#emv_tester_play_button ' + 'i').attr('class', icon_play);                   
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

function onclick_emv_tester_stepsgroup(elt, event) {
    let step = elt.id;
    let recordindex = Tester.Reader.find_record(step.replace ('step_', ''));
    if (recordindex != -1) {

        emv_tester_reset();
        Tester.Reader.reset();
        Tester.Reader.play (recordindex)
    }    
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
        case 'ignore_tsi':
            Tester.Reader.IgnoreTSI = !checked;
            break;                
        case 'ignore_tvr':
        Tester.Reader.IgnoreTVR = !checked;
        break;                
    }
}

function emv_tester_recordgroup_init () {
    $('#ignore_apdu').prop('checked',    !Tester.Reader.IgnoreApdu)  
    $('#ignore_step').prop('checked',    !Tester.Reader.IgnoreStep)  
    $('#ignore_trace').prop('checked',   !Tester.Reader.IgnoreTrace)   
    $('#ignore_tag').prop('checked',     !Tester.Reader.IgnoreTag)      
    $('#ignore_tvr').prop('checked',     !Tester.Reader.IgnoreTVR)      
    $('#ignore_tsi').prop('checked',     !Tester.Reader.IgnoreTSI)      
}

function emv_tester_Input_init () {
    Tester.terminal_clear();
    Tester.card_clear();  
}

function emv_tester_transactiontags_init () {
    $('#emv_transactiontags_table').DataTable(
        {
            fixedColumns: true,   
            autoWidth: false,                
            resizableColumns: true,    
            scrollY:        true,
            scrollX:        true,
            scrollCollapse: true,
            paging:         false,
            ordering: false
        }
    );
    $('#emv_transactiontags_table_filter .sb_search').detach().appendTo('#emv_transactiontags_searchgroup')   
    $('#emv_transactiontags_table_filter').remove();      
}


function emv_tester_transactiontags_reset () {
    $('#emv_transactiontags_table').DataTable().rows().remove().draw();    
}

function emv_tester_init () {
    emv_tester_recordgroup_init();
    emv_tester_Input_init();    
    emv_apdu_init ();    
    emv_tester_transactiontags_init();

    emv_bytepanel_init(emv_TVRPanel);        
    emv_bytepanel_init(emv_TSIPanel);        
    emv_bytepanel_init(emv_TACDenialPanel);  
    emv_bytepanel_init(emv_TACOnlinePanel);  
    emv_bytepanel_init(emv_TACDefaultPanel); 

    emv_bytepanel_init(emv_IACDenialPanel)
    emv_bytepanel_init(emv_IACOnlinePanel)
    emv_bytepanel_init(emv_IACDefaultPanel)
    emv_bytepanel_init(emv_AUCPanel);
    emv_bytepanel_init(emv_AIPPanel);    
    emv_selectstep('0');
    $('#emv_tester_leftpanel').on({
        click: function (event) {
            let psidebarpanel   = $('#emv_tester_sidebarpanel'); 
    
            if (!psidebarpanel.hasClass('pinned')) {    
                rightsidebarpanel_hide(psidebarpanel);
            }
        },
    });       
}

function emv_tester_reset () {
    emv_tester_Input_init();
    emv_apdu_init();
    emv_tester_transactiontags_reset();

    emv_bytepanel_init(emv_TVRPanel);        
    emv_bytepanel_init(emv_TSIPanel);        
    emv_bytepanel_init(emv_TACDenialPanel);  
    emv_bytepanel_init(emv_TACOnlinePanel);  
    emv_bytepanel_init(emv_TACDefaultPanel); 

    emv_bytepanel_init(emv_IACDenialPanel)
    emv_bytepanel_init(emv_IACOnlinePanel)
    emv_bytepanel_init(emv_IACDefaultPanel)    
    emv_bytepanel_init(emv_AUCPanel);
    emv_bytepanel_init(emv_AIPPanel);                


    emv_selectstep('0');
    $('#emv_tester_stepsgroup .EMVStep').removeClass ('selected');     
    emv_tester_stepsgroup_selectstep('0')   
    //emv_byte_init(emv_TCPanel);
    //emv_byte_init(emv_ATCPanel);    
    //sb.table_clear(emv_transactiontags_table) 
        
    $('.related-primary.Info').html ('');

}


const READER_START   = 0;
const READER_PLAYING = 1;
const READER_PAUSED  = 2;
const READER_END     = 3;



class CardReader {
    
    constructor () {
        this.Recording      = false; 
        this.RecordBuffer   = '';        
        this.Records        = [];
        this.RecordIndex    = 0;
        this.StepIndex      = 0;     
        this.CurrentStep    = 0;
        this.RAPDU          = [];   
        this.CAPDU          = [];
        this.IgnoreApdu     = false;
        this.IgnoreStep     = false;
        this.IgnoreTrace    = false;
        this.IgnoreTag      = false;
        this.IgnoreTVR      = false;
        this.IgnoreTSI      = false;
        this.TesterStartAsync = 0;
        this.Statut         = READER_START;
    }
    
    play (tillindex) {

        this.Statut = READER_PLAYING;
        let finalindex = tillindex ? tillindex + 1 : this.Records.length; // read the final till index

        this.TesterStartAsync = setInterval(function treat(reader, finalindex) {

            reader.nextstep(finalindex)    
        }, 10, this, finalindex);   // every milli second
    }
    
    pause () {
        this.Statut = READER_PAUSED;        
        clearInterval(this.TesterStartAsync);        
    }    
    
    reset () {
        this.RAPDU = [];
        this.CAPDU = [];     
        this.RecordIndex    = 0;   
        this.StepIndex = 0;        
        this.CurrentStep = 0;        
    }        

    start (fromrouter) {
        this.Statut = READER_START;        
        emv_tester_reset();
        this.reset();
    
        if (fromrouter) { 
            this.start_record ()                   
        }
    }

    end (fromrouter) {
        this.Statut = READER_END; 

        clearInterval(this.TesterStartAsync);   
     
        if (fromrouter) {
            this.stop_record();
            this.save_record();            
            this.save_transaction('last_transaction')
        }          
    }    
    firststep () {
        emv_tester_reset();
        this.reset();
        emv_selectstep(0, true)          
    }    
    nextstep (finalindex) {


        if (this.RecordIndex >= this.Records.length) {
            this.RecordIndex = this.Records.length;
            return;
        }
        console.log ('nextstep')
        let nextfound = true;

        for (var i = this.RecordIndex; i < this.Records.length; i++) {
            let nextfound   = true;
            let request     = this.Records[i];
            let origin      = request.origin;
            let line        = request.content;
            let values      = line.split('^');
            let commandtype = values[0];
            this.RecordIndex = i;        
            
            if (finalindex && this.RecordIndex == finalindex) {
                this.pause();
                return;
            }            

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
                    this.StepIndex = values[2];                    
                    if (this.IgnoreStep){
                        nextfound = false;
                    }
                    break;
                case "SETTSI":
                    if (this.IgnoreTSI){
                        nextfound = false;
                    }                    
                    break
                case "SETTVR":
                    if (this.IgnoreTVR){
                        nextfound = false;
                    }                    
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
            if (this.CurrentStep != this.StepIndex) {
                let stepvalues = ['STEP', '', this.StepIndex]
                emv_TreatStep(request.origin, this, stepvalues, 1)
            }
                 
            if (nextfound) {
                emv_TreatCommand(request.origin, this, request.content, values, 1);   
                break;
            }
        }
        this.RecordIndex += 1;             
        return 
    }
    record (buffer) {
        if (this.Recording ) {
            this.RecordBuffer += buffer;
        }
    }
    start_record () {
        this.RecordBuffer   = '';  
        this.Recording  = true;
    }

    stop_record () {
        this.Recording = false;
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
    find_record (step) {
        for (var i = 0; i < this.Records.length; i++) {
            let record = this.Records[i];
            if (record.origin == 'CARD') continue;
            if (record.content.startsWith("STEP")) {
                  let values = record.content.split ('^')
                  if (values[2] == step) {
                    return i;
                  }
            }
        }
        return -1;
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
        [name + '.trs']);  
    }
    
    load_transaction (){

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




//------------------------------------------------------------------- MAIN SIDEBAR---------------------------------------------------------------------
