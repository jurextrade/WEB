

var recognition         = null;
var CurrentRecognition  = false;
var recognition_lang    = 'en';

var Indicators1Menu = [];  
var Lex_colors          = ['aqua' , 'azure' , 'beige' , 'bisque' , 'black' , 'blue' , 'brown' , 'chocolate' , 'coral' , 'crimson' , 'cyan' , 'fuchsia' , 'ghostwhite' , 'gold' , 'goldenrod' , 'gray' , 'green' , 'indigo' , 'ivory' , 'khaki' , 'lavender' , 'lime' , 'linen' , 'magenta' , 'maroon' , 'moccasin' , 'navy' , 'olive' , 'orange' , 'orchid' , 'peru' , 'pink' , 'plum' , 'purple' , 'red' , 'salmon' , 'sienna' , 'silver' , 'snow' , 'tan' , 'teal' , 'thistle' , 'tomato' , 'turquoise' , 'violet' , 'white' , 'yellow'];
var Lex_Interface       = ['strategy creator' , 'trade desk' , 'yes' , 'no' , 'mute' , 'sound' , 'micro off','sound on', 'sound off', 'compile' , 'add strategy' , 'new strategy' , 'close strategy' , 'save strategy' , 'add indicator' , 'new indicator' , 'new project' , 'add project' , 'save project' , 'close project', 'close terminal'];
var Lex_Indicators      = Indicators1Menu.map(x => x.text.toLowerCase());
var Lex_IndicatorsType  = Indicators1Menu.map(x => x.grouptype.toLowerCase());
var Lex_Languages       = ['chinese translation', 'thai translation', 'arabic translation', 'french translation', 'english translation', 'switch', 'repeat'];

var grammar_colors               = '#JSGF V1.0; grammar colors;                 public <color> = ' + Lex_colors.join(' | ') + ' ;'
var grammar_indicators           = '#JSGF V1.0; grammar interfaces;             public <indicators> = ' + Lex_Indicators.join(' | ') + ' ;'
var grammar_indicators_type      = '#JSGF V1.0; grammar interfaces;             public <indicatorstype> = ' + Lex_IndicatorsType.join(' | ') + ' ;'
var grammar_interface            = '#JSGF V1.0; grammar interfaces;             public <interface> = ' + Lex_Interface.join(' | ') + ' ;'
var grammar_interface_incomplete = '#JSGF V1.0; grammar interfaces_incomplete;  public <interface_incomplete> = add | new | save | new;'

function Recognition_init () {
    try {
        var SpeechRecognition    = window.SpeechRecognition || window.webkitSpeechRecognition;
        window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      
    
        recognition                 = new SpeechRecognition();
        recognition.grammars        = new SpeechGrammarList();
        
        recognition.continuous      = false;
        recognition.lang            = recognition_lang;
        recognition.interimResults  = true;
        let importance              = 1;                                 // value from 0.0 to 1.0


        recognition.grammars.addFromString(grammar_colors, 1);        
        recognition.grammars.addFromString(grammar_interface, 1);        
        recognition.grammars.addFromString(grammar_indicators, 1);   
        recognition.grammars.addFromString(grammar_indicators_type, 1);    
        
        
        recognition.result = '';

        recognition.onresult = function(event) {

            this.error      = false;
            var item        = event.results.length -1;    
            var result      = event.results[item][0].transcript;
       
      //      TraceSpeechEditor('recognition.onresult: [' + event.results[item][0].transcript + '] ' + (event.results[item].isFinal ? 'FINAL' : 'INTERIM'), 1);
      
            if (event.results[item].isFinal)
                TraceSpeechEditor(event.results[item][0].transcript + ' ', 1);
            
            if (!event.results[item].isFinal) 
            return;
           
            
            result = result.trimRight(" ");
            result = result.trimLeft(" ");
            result = result.toLowerCase();


            if (Lex_IndicatorsType.includes (result)) {
                var index = getmenuindexfromfield (IndicatorsMenu, result, 'grouptype');
                SelectAddIndicator();
                this.command = true;
            }
            else
            if (Lex_Indicators.includes (result)) {
                var index = getmenuindexfromfield (IndicatorsMenu, result, 'text');
                SelectIndicator (IndicatorsMenu[index].name)
                this.command = true;
            }
            else
            if (Lex_colors.includes (result)) {
                document.documentElement.style.setProperty('--theme-bg-color', result); 
                this.command = true;
            }
            else
            if (Lex_Languages.includes (result)) {
                switch (result) {
                    case 'chinese translation' :
                        translation_lang = 'zh';
                        gsound.speak('Chinese Translation is set');
                    break;    
                    case 'thai translation' :
                        translation_lang = 'th';
                        gsound.speak('thai Translation is set');

                    break;    
                    case 'arabic translation' :
                        translation_lang = 'ar';
                        gsound.speak('arabic Translation is set');

                    break;    
                    case 'french translation' :
                        translation_lang = 'fr';
                        gsound.speak('french Translation is set');
                    break;    
                    case 'english translation' :
                        translation_lang = 'en';
                        gsound.speak('english Translation is set');
                    break;    
                    case 'switch' :
                        var tl = translation_lang;
                        translation_lang = recognition_lang;
                        recognition_lang = tl;
                        recognition.lang = recognition_lang;


                        var tlid = $('#recognitionid').text();

                        $('#recognitionid').text($('#translationid').text());                           
                        $('#translationid').text(tlid);
                        gsound.speak('switch recognition is set');
                    break;    
                    case 'repeat' :
                        Translation_fromto (this.prevresult, recognition_lang, translation_lang);
                    break;    
                }
                $('#trfromto').html (recognition_lang + '-' + translation_lang);                
                this.command = true;
            }
            else

            if (Lex_Interface.includes (result)) {
                switch (result) {
                    case 'strategy creator' :
                        platform_select (PROJECT_PLATFORM_PNAME);
                    break;
                    case  TRADEDESK_PLATFORM_NAME :
                        platform_select (TRADEDESK_PLATFORM_PNAME);
                    break;    
                    case 'mute' :
                    case 'sound off' :
                        Sound_set (false);
                    break;
                    case 'sound' :
                    case 'sound on' :
                        Sound_set (true);
                    break;    
                    case 'micro off' :
                        Recognition_set (false);                        
                    break;  
                    case 'add strategy' :
                    case 'new strategy' :
                        SelectNewStrategy("C");
                    break;    
                    case 'close strategy' :
                        SelectCloseStrategy();
                    break;    
                    case 'save strategy' :
                        SelectSaveStrategy();
                    break;    
                    
                    case 'close terminal':
                        SelectCloseTerminal();
                    break;
    
                    case 'add project' :
                    case 'new project' :
                        SelectNewProject();
                    break;    
    
                    case 'close project':
                        SelectCloseProject();
                    break;
                
                    case 'yes':
                        if (w2popup.status == 'open') {                
                            $('#w2ui-popup .w2ui-popup-btn#Yes').click(); // no need fo click as enter will do click
                            w2popup.close();
                        }
                    break;
                    case 'no' :
                        if (w2popup.status == 'open') {                
                            $('#w2ui-popup .w2ui-popup-btn#No').click()
                            w2popup.close();
                        }
                    break;
                }
                this.command = true;
            }
            else {
                this.command = false;
                this.result = result;            
            }
            
        };

        recognition.onerror = function(event) {
       //     TraceSpeechEditor("recognition.onerror", 1);
            this.error = true;
        };
        
        recognition.onaudiostart = function(event) {
      //    TraceSpeechEditor('recognition.onaudiostart', 1);
        }        
        recognition.onaudioend = function(event) {
      //    TraceSpeechEditor('recognition.onaudioend', 1);
        }

        recognition.onspeechstart = function(event) {
      //    TraceSpeechEditor('recognition.onspeechstart', 1);
      //      TraceSpeechEditor('\r\n', 1);
          if (utterspeaking) {
            if (CurrentRecognition) {
              TraceSpeechEditor('ABORTING', 1);
              this.abort();
            }
          } else {
              this.result = '';  
          }
        }        
        recognition.onspeechend = function(event) {
      //    TraceSpeechEditor('recognition.onspeechend', 1);
      TraceSpeechEditor('\r\n', 1);
        }

        recognition.onstart = function(event) {
      //    TraceSpeechEditor('recognition.onstart', 1);
        }        

        recognition.onend = function(event) {
     //       TraceSpeechEditor("recognition.onend", 1);


            if (CurrentTranslation) {
                if (!this.command && !this.error && this.result != "") {
                    this.prevresult = this.result;
                    $('#translationid').text('');            
                    $('#recognitionid').text(this.result);   
                    if (recognition_lang == 'zh') {
                        hanzistroke ('hanzi_writer', this.result);
                    }
                    Translation_fromto (this.result, recognition_lang, translation_lang);
                }
            }
            if (CurrentRecognition) {
                this.start(); 
            }
        };           
  
    }
    catch(e) {
//        alert("speech recognition API not supported");
    }
    return recognition;      
}


function Recognition_set (on) {
    if (on == undefined) {
        $('#switchrecognition').prop('checked', !CurrentRecognition);  
        on = !CurrentRecognition;
    }      
    if (on) {
        if (CurrentRecognition)   return; 
        CurrentRecognition = on;        
        TreatOperation("Microphone is on ");
        $('#button_recognition').css ('display', 'block', 'operationpanel', 'red');

    }
    else {
        if (!CurrentRecognition) return;
        CurrentRecognition = on;  
        TreatOperation("Microphone is off ", 'operationpanel', 'red');      
        $('#button_recognition').css ('display', '');  
        $('#overlay_recognition').remove();
        $('#button_recognition').removeClass('checked');

    }
    
    if (CurrentRecognition) recognition.start();
    else recognition.stop();
}

/////////////////////////////////////////////////////////////////////////////////// TRANSLATION ////////////////////////////////////////////////////////





//https://api.au-syd.language-translator.watson.cloud.ibm.com/instances/094abd24-aeb7-4dd6-9ed7-fba9fb0d47ca
