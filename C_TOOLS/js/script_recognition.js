function defined (value) {
    return value != undefined;
}

class video {
    constructor (options) {
        this.options = defined(options) ? {...this.options, ...options} : this.options;
        this.filters = [ "none", "blur", "grayscale", "invert", "sepia"]

        try {        
            this.mediadevices = navigator.mediaDevices; 
            this.mediadevices.addEventListener("devicechange", () => {
                this.devices = this.get_devices();
            })

            set_filter (this.filters[0])            
            this.get_devices();
        }
        catch(e) {
            alert("Media Devices not supported");
            return null;
        }    
    }  
    set_filter (name) {
        this.className =  name; //none
    }

}

class media {
    constructor (options) {
        this.options    = defined(options) ? {...this.options, ...options} : this.options;
        try {        
    
            this.mediadevices = navigator.mediaDevices; 
            this.mediadevices.addEventListener("devicechange", () => {
                this.devices = this.get_devices();
            })
            this.get_devices();
            this.video = null;
        }
        catch(e) {
            console.log("Media Devices not supported");
            return null;
        }    
    }  
    async get_devices() {
        let devices = await this.mediadevices.enumerateDevices();
        this.devices = devices;
        this.video_devices = devices.filter(device => device.kind === 'videoinput');
        this.audio_devices = devices.filter(device => device.kind === 'audioinput');

        return devices;
    }    
    get_video_devices() {
        return this.video_devices;
    }   
    set_video_device (device) {

    }
    get_audio_devices() {
        return this.audio_devices;
    }       
    set_audio_device (device) {

    }

    async open_video(minwidth, minheight) {

       let videodevices =  this.get_video_devices();

       const constraints = {
         //       'audio':  {'echoCancellation': true ,  noiseSuppression: true,   sampleRate: 44100},
                'video': {
                    'deviceId': videodevices[0].deviceId,
                //    'width': {'min': minwidth},
                //    'height': {'min': minheight}
                    }
        }
        let stream =  await this.mediadevices.getUserMedia(constraints);
        return stream;
    }
    async get_video () {
        this.video =  await this.open_video ();
  
        return this.video;
    }
   
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/*var Lex_colors          = {name: 'colors', array: ['aqua' , 'azure' , 'beige' , 'bisque' , 'black' , 'blue' , 'brown' , 'chocolate' , 'coral' , 'crimson' , 'cyan' , 'fuchsia' , 'ghostwhite' , 'gold' , 'goldenrod' , 'gray' , 'green' , 'indigo' , 'ivory' , 'khaki' , 'lavender' , 'lime' , 'linen' , 'magenta' , 'maroon' , 'moccasin' , 'navy' , 'olive' , 'orange' , 'orchid' , 'peru' , 'pink' , 'plum' , 'purple' , 'red' , 
                                            'salmon' , 'sienna' , 'silver' , 'snow' , 'tan' , 'teal' , 'thistle' , 'tomato' , 'turquoise' , 'violet' , 'white' , 'yellow']}
var Lex_Interface       = {name: 'interfaces', array: ['strategy creator' , 'trade desk' , 'yes' , 'no' , 'mute' , 'sound' , 'micro off','sound on', 'sound off', 'compile' , 'add strategy' , 
                                             'new strategy' , 'close strategy' , 'save strategy' , 'add indicator' , 'new indicator' , 'new project' , 'add project' , 'save project' , 'close project', 'close terminal']}
var Lex_Languages       = {name: 'languages', 
                           array: ['chinese translation', 'thai translation', 'arabic translation', 'french translation', 'english translation', 'switch', 'repeat'],
                        callback: lex_result}
let Lex_Commands        = {name: 'seperatewords', array: ['continuous', 'interim', 'switch']};




var grammar_colors               = '#JSGF V1.0; grammar colors;                 public <color> = ' + Lex_colors.array.join(' | ') + ' ;'
var grammar_interface            = '#JSGF V1.0; grammar interfaces;             public <interface> = ' + Lex_Interface.array.join(' | ') + ' ;'
var grammar_languages            = '#JSGF V1.0; grammar languages;              public <interface> = ' + Lex_Languages.array.join(' | ') + ' ;'
var grammar_interface_incomplete = '#JSGF V1.0; grammar interfaces_incomplete;  public <interface_incomplete> = add | new | save | new;'*/

/*---------------------------------------------------------------- RECOGNITION -------------------------------------------------------------------------*/
const recognition_default_options = {
    continuous: true,
    interimResults: true,
    lang: 'en',
    tracefunction:   function (result) {/*console.log(result)}*/},
    onstartfunction: function (event) {},
    onstopfunction: function (event) {},    
    onabortfunction: function (event) {},    
    onendfunction:   function (result) {},   
    onerrorfunction: function (result) {},
    onresultfunction:function (event) {},
    onspeechstartfunction:function (event) {},    
}
const entryrule = '<startPolite> <command> <endPolite>';

const rules = '<command> = <action> <object>;' + 
              '<action> = /10/ open |/2/ close |/1/ delete |/1/ move;' + 
              '<object> = [the | a] (window | file | menu);'


class recognition_lex {
    constructor (array, callback) {
        this.name     = ''
        this.array    = array;
        this.callback = defined(callback) ? callback  : function(result) { console.log(result)};
    }
}

class recognition_rule {
    constructor (name, content) {
        this.name     = name
        this.string   = content;
    }

}

class recognition_grammar {
    constructor (name, entry, rules) {
        this.name       = name;
        this.entry      = entry;
        this.rules      = rules
 
        this.string     = '#JSGF V1.0; grammar ' + this.name + '; public <' + this.name + '> = ' + this.entry + ';' + (this.rules ? this.rules : '') 
    }
/*        
        this.lex        = lex;

        for (var i = 0; i < this.rules.length; i++) {
            this.string += this.rules[i].string + ';'
        }  
    }
    add_rule ()
*/
}


class recognition {
    constructor (options) {
        this.options    = defined(options) ? {...recognition_default_options, ...options} : recognition_default_options;
        try {
            var SpeechRecognition    = SpeechRecognition || webkitSpeechRecognition;
            var SpeechGrammarList    = SpeechGrammarList || webkitSpeechGrammarList;

            this.recognition                = new SpeechRecognition();
            this.recognition.grammars       = new SpeechGrammarList();
            this.recognition.ison           = false;
            this.recognition.ismuted        = false;            
            this.recognition.grammars_obj   = [];   // defined by caller
            this.recognition.transcript     = '';

            this.set_options (this.options);
           
            this.recognition.onresult = function(event) {
                this.error      = false;
                let results     = event.results;
                var last_result = event.results[event.results.length -1];
                this.transcript = last_result[0].transcript;



                if (event.results.length != 1) {
                    for (var i= 0; i < event.results.length - 1; i++) {
                        this.tracefunction('recognition.onresult: PREVIOUS [*' +  event.results[i][0].transcript + '* conf: ' + event.results[i][0].confidence + '] ' + (event.results[i].isFinal ? 'FINAL' : 'INTERIM'), 1);
                    }
                }

                this.tracefunction('recognition.onresult: [*' + this.transcript + '* conf: ' + last_result[0].confidence + '] ' + (last_result.isFinal ? 'FINAL' : 'INTERIM'), 1);
          
                if (last_result.isFinal) {
                    this.tracefunction('Final: <!' + this.transcript + '!>');
                    this.onresultfunction (this.transcript);                    
                }
                
                if (!last_result.isFinal) {
                    return;        
                }
          
                
                var sentence =  this.transcript.trimRight(" ").trimLeft(" ").toLowerCase();
/*                
                var grammars =  this.grammars_obj  

                for (var i = 0; i < grammars.length; i++) {
                    let lexarray = grammars[i].lex.array;
                    
                    if (lexarray.includes(sentence)) {
                        if (defined(grammars[i].lex.callback)) {
                            grammars[i].lex.callback(sentence)
                        }
                    }
                }    
*/                
            }

            this.recognition.onstop = function(event) {
                this.tracefunction('recognition.onstop');

                this.onstopfunction (event);
            }        
                 
            this.recognition.onabort = function(event) {
                this.tracefunction('recognition.onabort');

                this.onabortfunction (event);
            }       

            this.recognition.onstart = function(event) {
                this.tracefunction('recognition.onstart');

                this.onstartfunction (event);
            }        
         
            this.recognition.onend = function(event) {
  
                this.tracefunction('recognition.onend');
      

                if (!this.error && this.transcript != "") {
                    this.tracefunction ('recognition ended with Final: <!' + this.transcript + '!>')
                    this.onendfunction (this.transcript);
                }

                if (this.ison) {
                    this.start(); 
                }
            }        
                        
            this.recognition.onnomatch = function(event) {
                this.tracefunction('recognition.onnomatch');
            }
       
            this.recognition.onerror = function(event) {
                this.tracefunction('recognition.onerror Error: <!' + event.error + '!>');
                this.onerrorfunction (event.error);
                this.error = true;
            }
                 
            this.recognition.onaudiostart = function(event) {
                if (this.ismuted)  {
                    return;
                }                
                this.tracefunction('recognition.onaudiostart');
            }        

            this.recognition.onaudioend = function(event) {
                this.tracefunction('recognition.onaudioend');
            }

            this.recognition.onsoundstart = function(event) {
                this.tracefunction('recognition.onsoundstart');
            }        

            this.recognition.onsoundend = function(event) {
                this.tracefunction('recognition.onsoundend');
            }
        
            this.recognition.onspeechstart = function(event) {
                this.transcript = '';                   
                this.tracefunction('recognition.onspeechstart');
                this.onspeechstartfunction (event);
               
            }   

            this.recognition.onspeechend = function(event) {
                this.tracefunction('recognition.onspeechend');
            }

        }
        catch(e) {
            alert("speech recognition API not supported");
            return null;
        }      
    }   
    start = function () {
        if (!defined(this.recognition)) {
            return -1;
        }        
        if (this.recognition.ison == true) {
            this.recognition.tracefunction('recognition already started')
            return;
        }
        this.recognition.ison = true;
        this.recognition.start();
    }

    stop = function () {
        if (!defined(this.recognition)) {
            return -1;
        }        
        if (this.recognition.ison == false) {
            this.recognition.tracefunction('recognition already stopped')
            return;
        }
        this.recognition.ison = false;
        this.recognition.stop();
        this.recognition.onstop ()
    }

    abort = function () {
        if (!defined(this.recognition)) {
            return -1;
        }        
        this.recognition.abort();
        this.recognition.onabort ()        
    }
    mute = function (muted) {
        if (!defined(this.recognition)) {
            return -1;
        }        
        this.recognition.ismuted = muted;
    }
    ison = function () {
        if (!defined(this.recognition)) {
            return -1;
        }        
        return this.recognition.ison;
    }

    set_lang = function (lang) {
        if (!defined(this.recognition)) {
            return -1;
        }        
        this.recognition.lang = lang;
    }
    
    get_lang = function () {
        if (!defined(this.recognition)) {
            return -1;
        }        
        return this.recognition.lang
    }
    
    set_continuous = function (continuous) {           //true or false   
        if (!defined(this.recognition)) {
            return -1;
        }        
        this.recognition.continuous = continuous;
    }

    set_interimResults = function (interimResults) {   //true or false   
        if (!defined(this.recognition)) {
            return -1;
        }        
        this.recognition.interimResults = interimResults;
    }

    addgrammar = function (grammar) {
        if (!defined(this.recognition)) {
            return -1;
        }        
        this.recognition.grammars.addFromString(grammar.string, grammar.importance);                  
        this.recognition.grammars_obj.push (grammar)
    }

    set_options = function (options) {
        this.options    = defined(options) ? {...this.options, ...options} : this.options;
        if (!defined(this.recognition)) {
            return -1;
        }
        this.recognition.continuous           = this.options.continuous;
        this.recognition.lang                 = this.options.lang;
        this.recognition.interimResults       = this.options.interimResults;
        this.recognition.tracefunction        = this.options.tracefunction;
        this.recognition.onstartfunction      = this.options.onstartfunction;
        this.recognition.onendfunction        = this.options.onendfunction;
        this.recognition.onerrorfunction      = this.options.onerrorfunction;
        this.recognition.onresultfunction     = this.options.onresultfunction;
        this.recognition.onspeechstartfunction= this.options.onspeechstartfunction;
        this.recognition.onstopfunction       = this.options.onstopfunction;
        this.recognition.onabortfunction       = this.options.onabortfunction;        
    }       
}
