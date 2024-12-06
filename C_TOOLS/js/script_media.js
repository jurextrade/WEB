/*---------------------------------------------------------------- RECOGNITION -------------------------------------------------------------------------*/

var getUserMedia = navigator.getUserMedia || 
    navigator.mozGetUserMedia || 
    navigator.webkitGetUserMedia;
 
// make sure it's supported and bind to navigator
if (getUserMedia) {
    getUserMedia = getUserMedia.bind(navigator);
} else {
    // have to figure out how to handle the error somehow
}
 
// then deal with a weird, positional error handling API
getUserMedia(
    // media constraints
    {video: true, audio: true}, 
    // success callback
    function (stream) {
        // gets stream if successful
    }, 
    // error callback
    function (error) {
        // called if failed to get media
    }
)


// Set up the AudioContext.
//const audioCtx = new AudioContext();

// Top-level variable keeps track of whether we are recording or not.
let recording = false;

// Ask user for access to the microphone.
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {

    // Instantiate the media recorder.
    const mediaRecorder = new MediaRecorder(stream);

    // Create a buffer to store the incoming data.
    let chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    }

    // When you stop the recorder, create a empty audio clip.
    mediaRecorder.onstop = (event) => {
      const audio = new Audio();
      audio.setAttribute("controls", "");
      $("#sound-clip").append(audio);
      $("#sound-clip").append("<br />");

      // Combine the audio chunks into a blob, then point the empty audio clip to that blob.
      const blob = new Blob(chunks, {"type": "audio/ogg; codecs=opus"});
      audio.src = window.URL.createObjectURL(blob);

      // Clear the `chunks` buffer so that you can record again.
      chunks = [];
    };

    // Set up event handler for the "Record" button.
    $("#record").on("click", () => {
      if (recording) {
        mediaRecorder.stop();
        recording = false;
        $("#record").html("Record");
      } else {
        mediaRecorder.start();
        recording = true;
        $("#record").html("Stop");
      }
    });

  }).catch((err) => {
    // Throw alert when the browser is unable to access the microphone.
    alert("Oh no! Your browser cannot access your computer's microphone.");
  });
} else {
  // Throw alert when the browser cannot access any media devices.
  alert("Oh no! Your browser cannot access your computer's microphone. Please update your browser.");
}

const media_default_options = {
    video: true, 
    audio: true,    
    tracefunction:   function (result) {console.log(result)},
    onstartfunction: function (event) {},
    onendfunction:   function (result) {console.log(result)},   
    onerrorfunction: function (result) {console.log(result)},
    onresultfunction:function (event) {},
    onaudiostartfunction:function (event) {},    
}


class media {
    constructor (options) {
        this.options    = media_default_options;
        this.options    = defined(options) ? {...this.options, ...options} : this.options;

        this.start = function () {
            if (this.recognition.ison == true) {
                this.recognition.tracefunction('recognition already started')
                return;
            }
            this.recognition.start();
            this.recognition.ison = true;
        }

        this.stop = function () {
            if (this.recognition.ison == false) {
                this.recognition.tracefunction('recognition already stopped')
                return;
            }
            this.recognition.stop();
            this.recognition.ison = false;

        }

        this.abort = function () {
            this.recognition.abort();
        }

        this.ison = function () {
            return this.recognition.ison;
        }

        this.set_options = function (options) {
            this.options    = defined(options) ? {...this.options, ...options} : this.options;

            this.recognition.continuous           = this.options.continuous;
            this.recognition.lang                 = this.options.lang;
            this.recognition.interimResults       = this.options.interimResults;
            this.recognition.tracefunction        = this.options.tracefunction;
            this.recognition.onstartfunction      = this.options.onstartfunction;
            this.recognition.onendfunction        = this.options.onendfunction;
            this.recognition.onerrorfunction      = this.options.onerrorfunction;
            this.recognition.onresultfunction     = this.options.onresultfunction;
            this.recognition.onspeechstartfunction= this.options.onspeechstartfunction;
        }   
        try {

            this.media = async (constraints) => {
                return await navigator.mediaDevices.getUserMedia(constraints);
            }
            
            try {
                const stream = openMediaDevices({'video':true,'audio':true});
                console.log('Got MediaStream:', stream);
            } catch(error) {
                console.error('Error accessing media devices.', error);
            }
            this.recognition.onresult = function(event) {
                this.error      = false;
                let results     = event.results;
                var last_result = event.results[event.results.length -1];
                this.transcript = last_result[0].transcript;

                this.onresultfunction (event);

                if (event.results.length != 1) {
                    for (var i= 0; i < event.results.length - 1; i++) {
                        this.tracefunction('recognition.onresult: PREVIOUS [*' +  event.results[i][0].transcript + '* conf: ' + event.results[i][0].confidence + '] ' + (event.results[i].isFinal ? 'FINAL' : 'INTERIM'), 1);
                    }
                }

                this.tracefunction('recognition.onresult: [*' + this.transcript + '* conf: ' + last_result[0].confidence + '] ' + (last_result.isFinal ? 'FINAL' : 'INTERIM'), 1);
          
                if (last_result.isFinal) {
                    this.tracefunction('Final: <!' + this.transcript + '!>');
                }
                
                if (!last_result.isFinal) {
                    return;        
                }
          
                
                var sentence =  this.transcript.trimRight(" ").trimLeft(" ").toLowerCase();
                var grammars =  this.grammars_obj  

                for (var i = 0; i < grammars.length; i++) {
                    let lexarray = grammars[i].lex.array;
                    
                    if (lexarray.includes(sentence)) {
                        if (defined(grammars[i].lex.callback)) {
                            grammars[i].lex.callback(sentence)
                        }
                    }
                }    
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
}

