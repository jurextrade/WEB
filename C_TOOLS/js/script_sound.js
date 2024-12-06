function defined (value) {
    return value != undefined;
}
///////////////////////////////////////////////////////////////////////////// VOICE SpeechSynthesisUtterance //////////////////////////////////////////////////////////////////////////// 

const sound_default_options = {
    pitch: 1,
    rate:  1,
    tracefunction:   function (result) {
      //  console.log(result)
    },
    onstartfunction: function (event) {},
    onendfunction:   function (event) {},   
}

class sound {
    constructor (options) {
        this.options        = sound_default_options;
        this.options    = defined(options) ? {...this.options, ...options} : this.options;
     
        
        this.utterances     = [];
        this.voices         = [];
        this.utterspeaking  = false;
        this.utterance      = null;
        this.synthesis      = null;
        try {        
    
            this.synthesis = window.speechSynthesis; 
            this.synthesis.addEventListener("voiceschanged", () => {
                this.get_voices();
                this.set_options (this.options);
            })

            this.utterance = new SpeechSynthesisUtterance();
            this.utterance.ison             = false;
            this.utterances.push(this.utterance);

            this.utterance.onstart = function(event) {
                this.tracefunction('We have started uttering this transcript: ' + event.utterance.text);                
                this.onstartfunction (event);             

                this.utterspeaking = true;
            }
            
            this.utterance.onend = function(event) {
                this.tracefunction('Utterance has finished being spoken after ' + event.elapsedTime + ' seconds.');
                this.onendfunction (event);

                this.utterspeaking = false;
            }   
            
            this.utterance.onerror = function(event) {
                this.tracefunction('utterance.onerror');
            }       

            this.utterance.onmark = function(event) {
                this.tracefunction('utterance.onmark');
            }       

            this.utterance.onpause = function(event) {
                this.tracefunction('utterance.onpause');
            }                      

            this.utterance.onresume = function(event) {
                this.tracefunction('utterance.onresume');
            }                                           

        }        
        catch(e) {
            alert("Sound API not supported");
            return null;
        }    
    }  
    start = function () {
        if (this.utterance.ison == true) {
            this.utterance.tracefunction('sound already on')
            return;
        }            
        this.utterance.ison = true;
    }

    stop = function () {
        if (this.utterance.ison == false) {
            this.utterance.tracefunction('sound already stopped')
            return;
        }
        this.utterance.ison = false;
    }

    abort = function () {
        this.synthesis.cancel()
    }

    ison = function () {
        return this.utterance.ison;
    }

    speak = function (transcript) {
        if (this.utterance.ison) {
            this.utterance.text  = transcript;
            this.synthesis.speak(this.utterance);
        }
    }

    pause = function (transcript) {
        this.synthesis.pause();
    }

    resume = function (transcript) {
        this.synthesis.resume();
    }       

    set_lang = function (lang) {         // lang 2 char  return voice
        let l_voices = this.get_voicesinlang (lang)
        if (l_voices.length) {   // choose default
            let dl_voices = l_voices.filter ((x) => x.default == true);
            return  this.set_voice (dl_voices.length ? dl_voices[0] : l_voices[0]);
        } else {
            this.utterance.tracefunction('langage ' + lang + ' not supported');
            return null;
        }
    }

    get_lang = function () {
        return this.lang
    }
    set_voice = function (voice) {
        this.utterance.voiceURI  = voice.voiceURI;        
        this.utterance.voice     = voice;                
        this.utterance.lang      = voice.lang;  
        this.lang                = voice.lang.substring(0,2)    // lang 2 char  
        return voice;
    }
    
    get_voices = function () {

        this.voices = this.synthesis.getVoices().sort(function (a, b) {
            const aname = a.lang.toUpperCase(), 
                  bname = b.lang.toUpperCase();
            if (aname < bname ) return -1;
            else if (aname == bname) return 0;
            else return +1;
        });
    }

    get_voicesinlang = function (lang) {   // lang 2 char
        if (this.voices.length == 0) {
            return -1;
        }
        return this.voices.filter(function(x) {return x.lang.substring(0,2) == lang});
    }
            
    get_currentvoice = function () {
        return  this.utterance.voice ;
    }
    
    get_defaultvoice = function () {
        if (this.voices.length == 0) {
            return [];
        }        
        return this.voices.filter(function(x) {return x.default == true});
    }
    set_options = function (options) {
        this.options    = defined(options) ? {...this.options, ...options} : this.options;
        
        this.utterance.pitch            = this.options.pitch          
        this.utterance.rate             = this.options.rate           
                
        this.utterance.tracefunction    = this.options.tracefunction  
        this.utterance.onstartfunction  = this.options.onstartfunction
        this.utterance.onendfunction    = this.options.onendfunction

        if (defined (this.options.lang)) {
            this.utterance.lang             = this.options.lang                    
            this.set_lang(this.utterance.lang)  
            return;
        } 
                                                
        let l_voices = this.get_defaultvoice ();                //put default language if not defined  
        if (l_voices.length) {   
            this.set_voice (l_voices[0]);
            return;
        }
        this.utterance.voiceURI = 'native';                     // else return to native
    }   
}