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

function emv_tester_transactionselect_Update (transactions) {
    var elt1 = document.getElementById('emv_tester_transactionselect'); 
    elt1.innerHTML = ' <option value="' + '--Select Transaction--' + '">' + '--Select Transaction--' + '</option>';  
    
   for (var j = 0; j < transactions.length; j++) {
       elt1.insertAdjacentHTML('beforeend','<option value="' + transactions[j] + '">' + transactions[j] + '</option>');   
   }        
}

function onchange_emv_tester_transactionselect (elt, event) {
    let transactionfile = $("#emv_tester_transactionselect option:selected").val();
    Tester.Reader.load_transaction(transactionfile);
}

//-----------------------------------------------------------------command group

function  onclick_emv_tester_commandgroup (elt, event) {
    switch (elt.id) {
        case 'emv_tester_play_button':
       //     console.log('play')
            if (Tester.Reader.Statut != READER_PLAYING) {
                let silentmode = false;
                if (Tester.Reader.RecordIndex ==  Tester.Reader.Records.length) {
                    Tester.Reader.firststep();
                }
                Tester.Reader.play (silentmode);
                $('#emv_tester_play_button').removeAttr('disabled');                     
                $('#emv_tester_play_button ' + 'i').attr('class', icon_pause);
                $('#emv_tester_play_button ' + 'i').attr('title', 'Pause');                   
            } else {
                Tester.Reader.pause ();
                $('#emv_tester_play_button ' + 'i').attr('class', icon_play);   
                $('#emv_tester_play_button ' + 'i').attr('title', 'Run');   
            }
            
        break;
        case 'emv_tester_start_button'  :
            
            Tester.Reader.firststep ();       
            
            $('#emv_tester_play_button ' + 'i').attr('class', icon_play);
            $('#emv_tester_play_button ' + 'i').attr('title', 'Run');         
            $('#emv_tester_recordbar #emv_tester_play_button').removeAttr('disabled');      
            $('#emv_tester_recordbar #emv_tester_forward_button').removeAttr('disabled');       
            $('#emv_tester_recordbar #emv_tester_start_button').attr('disabled', true);                      



        break;
        case 'emv_tester_forward_button' :

            let silentmode = false;
            Tester.Reader.nextstep(silentmode)
            
        break;
        case 'emv_tester_stop_button':
        break;

        case 'emv_tester_back_button':
        break;
        case 'emv_tester_pause_button'   :
        break;
        case 'emv_tester_upload_transaction' :

            if (!solution.emv_CurrentProject) {
                TreatInfo('Load a project to see related transactions')
            //    sidebarmenu_select ('sidebar_emvprojectmanager', true);                  
                return;
            }
            let cuser = solution.user;

            let file_path        = cuser.path + '/EMV/' + solution.emv_CurrentProject.Folder

            cuser.send({Name: 'scandir_r',Values: [file_path  + '/Transactions', '.']}, false,  function (content, values) {
                let dirstruct;    
                try {
                    dirstruct = JSON.parse(content);
                } catch(e) {
                    return console.error(e); 
                }                

                let menu = [];
                
                for (var i = 0; i < dirstruct.Values[0].Files.length; i++) {
                    menu.push ({id: i,     text: dirstruct.Values[0].Files[i].Name})
                }
                if (dirstruct.Values[0].Files.length == 0) {
                    return;
                }
                sb.overlay({
                    rootelt: $(elt).closest('.sb_root'),
                    event: event,        
                    pageX:   event.pageX,
                    pageY:   event.pageY + 20,
                    par: menu,
                    onselect:function (elt, par) {
                        
                        let menu = this.par;
                        Tester.Reader.load_transaction(menu[elt.id].text)
                    },
                    html: sb.menu (menu)
                })}, 
                [cuser])            
        break;
    }
}

//-----------------------------------------------------------------steps group

function onclick_emv_tester_stepsgroup(elt, event) {
    let stepid = elt.id;
    let step = stepid.replace ('step_', '')
    let recordindex = Tester.Reader.find_record(step);
  
    if (recordindex != -1) {
        console.log ('silentmode')
        emv_tester_reset();
        Tester.Reader.reset();

        
        let silentmode = true;
        let display    = false;
        let fromrouter = false;
        for (var j = 0; j <= recordindex; j++) {
            let request     = Tester.Reader.Records[j];
            let origin      = request.origin;
            let line        = request.content;
            let values      = line.split('^');
            let commandtype = values[0];            
            emv_TreatCommand(origin, Tester.Reader, line, values, silentmode, display, fromrouter);
        }
        Tester.Reader.RecordIndex = recordindex;   

        Tester.card_write (Tester.Reader.CTRACE)
        Tester.terminal_write (Tester.Reader.TTRACE)
   
        let table   = $('#emv_transactiontags_table').DataTable();
        table.rows.add(Tester.Reader.TAGS).draw()    

        $('#emv_apdutreepanel').html(sb.render (emv_apdu_roottree))
        emv_selectstep(step, true);

        $('#emv_tester_recordbar #emv_tester_start_button').removeAttr('disabled');
        $('#emv_tester_recordbar #emv_tester_forward_button').removeAttr('disabled');
        $('#emv_tester_play_button ' + 'i').attr('class', icon_play);      
        $('#emv_tester_play_button ' + 'i').attr('title', 'Run');                     


        //   Tester.Reader.play (silentmode, recordindex)
     //   $('#emv_tester_play_button ' + 'i').attr('class', icon_pause);        
    }    
}

function emv_tester_stepsgroup_selectstep (step) {

    //  $('#emv_tester_stepsgroup .EMVStep').removeClass ('selected');    
  
      let selected_element =  $('#emv_tester_stepsgroup .EMVStep').filter('#step_' +step)  
      if (selected_element.length != 0) {    
          selected_element.addClass ('selected')
      }
      return step;  
}

//-----------------------------------------------------------------filter group

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


function emv_tester_filtergroup_init () {
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
    Tester = new emvtester();    
    emv_tester_filtergroup_init();
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
    emv_cidbytepanel_init(emv_CIDPanel)    
    emv_selectstep('0');
    $('#emv_tester_leftpanel').on({
        mouseup: function (event) {
            let psidebarpanel   = $('#emv_tester_sidebarpanel'); 
            $('#emv_tester_sidebarpanel .sb_tablerow ').removeClass('marked')

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
    emv_cidbytepanel_init(emv_CIDPanel); 

    emv_selectstep('0');
    $('#emv_tester_stepsgroup .EMVStep').removeClass ('selected');    
    $('#emv_tester_sidebarheader label').html ('') 
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
        this.TesterStartAsync = 0;
        this.Statut         = READER_START;

        this.IgnoreApdu     = false;
        this.IgnoreStep     = false;
        this.IgnoreTrace    = false;
        this.IgnoreTag      = false;
        this.IgnoreTVR      = false;
        this.IgnoreTSI      = false;

        this.CONNECT        = [];           //emv_TreatConnect(origin, reader, values);
        this.LOGIN          = [];           // emv_TreatLogin(origin, reader, values);
        this.START          = [];
        this.END            = [];           //emv_TreatInit(origin, reader, values, router);
        this.SELECT         = [];           //emv_TreatSelect(origin, reader, values, display, router);
        this.PLUG           = [];           //emv_TreatPlug(origin, reader, values, display, router);
        this.INFO           = [];           //emv_TreatInfo(origin, reader, values, display);
        this.CTRACE         = "";           //emv_TreatTrace(origin, reader, values, display);
        this.TTRACE         = "";           //emv_TreatTrace(origin, reader, values, display);
        this.TAGS            = [];           //emv_TreatTAG(origin, reader, values, display);
        this.RAPDU          = [];
        this.CAPDU          = [];           //emv_TreatAPDU(origin, reader, values, display, router);
        this.STEP           = [];           //emv_TreatStep(origin, reader, values, display, router);
        this.SETTSI         = [];           //emv_TreatSetTSI(origin, reader, values, display);
        this.SETTVR         = [];           //emv_TreatSetTVR(origin, reader, values, display);
        this.AIP            = [];           //emv_TreatAIP(origin, reader, values, display);
        this.AUC            = [];           //emv_TreatAUC(origin, reader, values, display);
        this.IAC_Denial     = [];           //emv_TreatTVR(origin, reader, values, display);
        this.IAC_Online     = [];           //emv_TreatTVR(origin, reader, values, display);
        this.IAC_Default    = [];           //emv_TreatTVR(origin, reader, values, display);
        this.TAC_Denial     = [];           //emv_TreatTVR(origin, reader, values, display);
        this.TAC_Online     = [];           //emv_TreatTVR(origin, reader, values, display);
        this.TAC_Default    = [];           //emv_TreatTVR(origin, reader, values, display);
        this.CTQ            = [];           //emv_TreatCTQ(origin, reader, values, display);
        this.CID            = [];           //emv_TreatCID(origin, reader, values, display);
        this.CRYPTO         = [];           //emv_TreatCRYPTO(origin, reader, values, display);
        this.SERVICECODE    = [];           // service code         emv_TreatSC(origin, reader, values, display);
        this.TT             = [];           //terminal type         emv_TreatTT(origin, reader, values), display;
        this.TC             = [];           //terminal capabilities emv_TreatTC(origin, reader, values, display);
        this.ATC            = [];           //Additionalterminal capabilities    emv_TreatATC(origin, reader, values, display);
        this.TTQ            = [];           // emv_TreatTTQ(origin, reader, values, display);
        this.CVM            = [];           //emv_TreatCVM(origin, reader, values, display);
    }
    
    play (silentmode, tillindex) {

        this.Statut = READER_PLAYING;
        let finalindex = tillindex ? tillindex + 1 : this.Records.length; // read the final till index

        this.TesterStartAsync = setInterval(function treat(reader, silentmode, finalindex) {
            
            reader.nextstep(silentmode, finalindex)    
        }, 10, this, silentmode, finalindex);   // every milli second
    }
    
    pause () {
        this.Statut = READER_PAUSED;        
        clearInterval(this.TesterStartAsync);        
    }    
    
    reset () {
        
        this.CTRACE         = "";           //emv_TreatTrace(origin, reader, values, display);
        this.TTRACE         = "";           //emv_TreatTrace(origin, reader, values, display);
        this.TAGS           = [];           //emv_TreatTAG(origin, reader, values, display);
        this.RAPDU          = [];
        this.CAPDU          = [];     

        this.RecordIndex    = 0;   
        this.StepIndex      = 0;        
        this.CurrentStep    = 0;        
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
    
    nextstep (silentmode, finalindex) {
        let fromrouter = false;
        let display    = true;


        this.Statut == READER_PLAYING
        
        if (this.RecordIndex >= this.Records.length) {
            this.RecordIndex = this.Records.length;
            return;
        }
    //    console.log ('nextstep')
        let nextfound = true;
    // find last step in records from i
        this.StepIndex = 0;



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
  
            for (var j = this.RecordIndex; j >= 0; j--) {
                let request     = this.Records[j];
                let values      = request.content.split('^');
                if (values[0] == "STEP") {
                    this.StepIndex = values[2]; 
                    break;      
                }
            }
            if (this.CurrentStep != this.StepIndex) {
                let stepvalues = ['STEP', '', this.StepIndex]
                emv_TreatStep(TERMINAL, this, stepvalues, 1)
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

                 
            if (nextfound) {
                emv_TreatCommand(request.origin, this, request.content, values, silentmode, display, fromrouter);   
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

        let cuser = solution.get('user')
        if (!cuser.is_registered()) {
            TreatInfo(register_needed_label, 'operationpanel', 'red');               
            return;
        }

        let path        = cuser.path + '/EMV/' + solution.emv_CurrentProject.Folder

        cuser.send({Name: 'makedir',  Values: [path, 'Transactions']}, false, function (content, values) {

            let message = JSON.parse (content);   
            if (message.Error) {
                console.log (message.Name  + values[0]  + message.Values[0]);
            }   
                                             
        }, ['Transactions'])
        
        let transactionfile     = '../' +  path + "/Transactions/"  + name + '.trs';
        
        cuser.send ({Name: 'savefile', Values: [transactionfile,  this.RecordBuffer]}, true, 
            function (content, values) {
                let message = JSON.parse (content);   
                if (message.Error) {
                    console.log (message.Name + ' ' + message.Values[0]);
                    return;
                }   
                TreatInfo("Transaction " + values[0] + " Saved");                             
                          
            }, 
        [name + '.trs']);  
    }
    
    load_transaction (filename)    {
        let cuser = solution.get('user'); 
        let file_path        = cuser.path + '/EMV/' + solution.emv_CurrentProject.Folder
        $("#emv_tester_transactionselect option[value='--Select Transaction--']").remove();       
        $('#emv_tester_transactionselect option[value="' + filename + '"]').prop('selected', true);        
        
        let path        = cuser.path + '/EMV/' + solution.emv_CurrentProject.Folder

        cuser.send ({Name: 'readfile', Values: ['./../' + file_path + '/Transactions/' + filename]}, false, 
                    function (content, values) {
                        
                        let message = JSON.parse (content);
                        if (message.Error) {
                            console.log (message.Name + ' ' + message.Values[0]);
                            return;
                        }    

                        Tester.Reader.RecordBuffer = message.Values[0].Content
                        Tester.Reader.save_record();
                        Tester.Reader.firststep();
                        $('#emv_tester_play_button ' + 'i').attr('class', icon_play); 
                        $('#emv_tester_play_button ' + 'i').attr('title', 'Run');   
                        
                        $('#emv_tester_recordbar #emv_tester_play_button').removeAttr('disabled');      
                        $('#emv_tester_recordbar #emv_tester_forward_button').removeAttr('disabled');       
                        $('#emv_tester_recordbar #emv_tester_start_button').attr('disabled', true);                           
                                                
                    }, 
        []);      
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


function onclick_testertogglepanel(elt, event, panel) {
    let s_testerpanel = $(elt).closest('.sb_panel');

    if (s_testerpanel.hasClass('toggled')) {
        s_testerpanel.removeClass('toggled');
        sb.resize(panel);        
    }
    else {
        s_testerpanel.addClass('toggled');
        sb.resize(panel);        
    }   
}

function emv_tester_fullscreenpanel (idpanel, sidepanel) {
    let panel = $('#' + idpanel);
    emv_tester_toggle_all (0)    
    if (!panel.hasClass('toggled')) {
        panel.addClass('toggled')
        panel.find('.box-btn-slide').addClass('rotate-180')          
    }
    sb.resize(sidepanel); 
}


function onclick_testerfspanel (elt, event, panel) {
    let parentpanel        = $(elt.parentElement.parentElement.parentElement);
    emv_tester_fullscreenpanel (parentpanel.attr('id'), panel);     
}

function onclick_testercspanel (elt, event, panel) {
    
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


function onclick_tright_sidebarpin(elt, event) {
    let $rightsidebarpanel;    
    if ($(elt).hasClass ('checked')) {
        $rightsidebarpanel = $(elt).closest('.emv_tester_sidebarpanel') ;
        $rightsidebarpanel.css ({'transition':'none'});
        rightsidebarpanel_hide($rightsidebarpanel);
        $rightsidebarpanel.removeClass ('pinned')
        
    } else {
        $rightsidebarpanel = $(elt).closest('.emv_tester_sidebarpanel') ;
        $rightsidebarpanel.addClass ('pinned')
        sb.resize(sb.interface);        
    }
}

function trightsidebarpanel_hide (psidebarpanel) {
    let psidebarmenu    = psidebarpanel.next(); 
    let toresize        = psidebarpanel.hasClass('pinned')
    console.log ('tester hide right');
    psidebarpanel.css ({'transition':''});

    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        if (index != 0) {
            $(panel).removeClass("sb_active");
            $(panel).addClass("sb_none");        
        }
    });

    let sbmenus  = psidebarmenu.find('.sb_link');

    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    psidebarpanel.removeClass('toggled')

    if (toresize) {0
        sb.resize(sb.interface);        
    }
}


function trightsidebarpanel_select (psidebarpanel, id) {
    let sidebarmenu         = $('#' + id);    
    let psidebarmenu    = psidebarpanel.next(); 
    let toresize        = psidebarpanel.hasClass ('pinned')

        
    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        if (index != 0) {
            $(panel).removeClass("sb_active");
            $(panel).addClass("sb_none");        
        }
    });

    if (psidebarpanel.hasClass ('toggled')) {

    } else {
        psidebarpanel.addClass('toggled')
    }

    let sidebarpanel   =  $('#' + id.replace("sidebar", "sidebarpanel"));  
    sidebarpanel.removeClass("sb_none");    
    sidebarpanel.addClass("sb_active");    
 
    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    sidebarmenu.addClass("checked");

    if (toresize) {
        sb.resize(sb.interface);        
    }
}



