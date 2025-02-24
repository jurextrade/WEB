const OPENAI_API_KEY            = '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';

const openai_curl               = 'https://api.openai.com/';
const openai_version            = 'v1';

const openai_version_curl       = openai_curl + openai_version;



const openai_completions_curl      = openai_version_curl + '/completions';
const openai_chatcompletions_curl  = openai_version_curl + '/chat/completions';
const openai_models_curl           = openai_version_curl + '/models';

const openai_edits_curl            = openai_version_curl + '/edits';
const openai_engines_curl          = openai_version_curl + '/engines';
const openai_classifications_curl  = openai_version_curl + '/classifications';
const openai_moderations_curl      = openai_version_curl + '/moderations';
const openai_transcriptions_curl   = openai_version_curl + '/audio/transcriptions';
const openai_translations_curl     = openai_version_curl + '/audio/translations';
const openai_files_curl            = openai_version_curl + '/files';
const openai_finetunes_curl        = openai_version_curl + '/fine-tunes';
const openai_answers_curl          = openai_version_curl + '/answers';
const openai_images_curl           = openai_version_curl + '/images';
const openai_embeddings_curl       = openai_version_curl + '/embeddings';


const openai_default_engine             = 'davinci-002'
const openai_default_completionmodel    = 'gpt-3.5-turbo-instruct'
const openai_default_chatmodel          = 'gpt-3.5-turbo'
const openai_default_editmodel          = 'gpt-4'
const openai_default_audiomodel         = 'whisper-1'

const openai_model_types = ['completion', 'chat', 'edit', 'image', 'audio']
const openai_default_modeltype          = 'completion'

const openai_default_options = {
    engine:         openai_default_engine,
    modeltype:      openai_default_modeltype,
    max_tokens:     2000,
    tracefunction:  function (result) {
        console.log(result)
    },
    
    onresultfunction: function (response_data) {
        console.log ('..................................openai_result\n')  
        if (response_data.error) {
            console.log (response_data.error.message);
            return        
        } else {
            console.log (response_data.choices[0].text)
        }
    },
    onerrorfunction: function (result) {
        console.log(result)
    }
}

class openai {
    constructor (options) {
        this.options    = openai_default_options;
        this.set_options(options)
        this.set_modelfrommodeltype(this.options.modeltype)
        this.models     = [];
        this.on         = false;
        this.get_models();
        this.chatmessages = [];
        this.prompttypeanswer = 'sarcastic';
    }
    get_models  = function () {
        let par = this;
        fetch(openai_models_curl, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization:  `Bearer ${OPENAI_API_KEY}`,
            },
        })
        .then(
            function (response) {
                return response.json()  
            } 
        )
        .then (
            function (response_data) {
                if (response_data.error) {
                    par.onerrorfunction (response_data.error.message);
                } else {
                    par.models = response_data.data.sort(function (a, b) {
                        const aname = a.id.toUpperCase(), 
                              bname = b.id.toUpperCase();
                        if (aname < bname ) return -1;
                        else if (aname == bname) return 0;
                        else return +1;
                    })
                }
            }
        )   
    }        
    set_modeltype = function (modeltype) {
        this.modeltype = modeltype;
        this.set_modelfrommodeltype(modeltype);
    }

    set_modelfrommodeltype = function (modeltype) {
       
        switch (modeltype) {
            case 'completion':
                this.model = openai_default_completionmodel
            break; 
            case 'chat':
                this.model = openai_default_chatmodel
            break; 
            case 'edit':
                this.model = openai_default_editmodel
            break; 
            case 'image':
                this.model =  ''
            break; 
            case 'audio':
                this.model = openai_default_audiomodel
            break;
        }
    }
    set_model = function (model) {
        this.model  = model;        
        return model;
    }
    get_currentmodel = function () {
        return this.model;
    }
    translate = function (whatever, lang) {
        this.ask ('Translate this into ' +  lang + '\n\n' + whatever)
           //model="text-davinci-003",
           //prompt="Translate this into 1. French, 2. Spanish and 3. Japanese:\n\nWhat rooms do you have available?\n\n1.",
           //temperature=0.3,
           //max_tokens=100,
           //top_p=1.0,
           //frequency_penalty=0.0,
           //presence_penalty=0.0
                  
    }
    sarcastic (whatever) {
        this.ask ('Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou:' + prompt + '\nMarv:')
    }
    ask = function (whatever) {
        switch (this.modeltype) {
            case 'completion':
                this.prompt(whatever)
            break; 
            case 'chat':
                this.chat(whatever)
            break; 
            case 'edit':
                this.edit(whatever)
            break; 
            case 'image':
                this.image(whatever)
            break; 
            case 'audio':
                this.audio(whatever, file)
            break;
        }
    }
    prompt = function (prompt) {
        if (!this.ison()) {
            console.log ('openai is off')
            return;
        }
        let par = this;        
        fetch(openai_completions_curl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify ({
                'prompt':       prompt,
                'max_tokens':   this.options.max_tokens,
                'model':        this.model,
            })
        })
        .then(
            function (response) {
                return response.json()  
            } 
        )
        .then (
            function (response_data) {
                par.tracefunction ('..................................openai_result\n')  
                if (response_data.error) {
                    par.onerrorfunction (response_data.error.message);
                } else {
                    if (par.on) {
                        par.onresultfunction (response_data.choices[0].text)
                    } else {
                        par.onerrorfunction ('chat aborted Open AI is off');
                    }
                }
            }
        )   
    }
    chat = function (message) {
        if (!this.ison()) {
            console.log ('openai is off')
            return;
        }
        let par = this;    
        this.chatmessages.push({'role': "user", 'content': message})    
        
        fetch(openai_chatcompletions_curl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify ({
                'messages':         this.chatmessages,
                'temperature':      0.9,
                'max_tokens':       150,
                'frequency_penalty':0,
                'presence_penalty': 0,
                'model':            this.model,
            })
        })
        .then(
            function (response) {
                return response.json()  
            } 
        )
        .then (
            function (response_data) {
                par.tracefunction ('..................................openai_result\n')  
                if (response_data.error) {
                    par.onerrorfunction (response_data.error.message);
                } else {
                    if (par.on) {
                        par.chatmessages.push (response_data.choices[0].message)
                        par.onresultfunction (response_data.choices[0].message.content)
                    } else {
                        par.onerrorfunction ('chat aborted Open AI is off');
                    }
                }
            }
        )   
    }
    edit = function (message) {
        if (!this.ison()) {
            console.log ('openai is off')
            return;
        }
        let par = this;    
        fetch(openai_chatcompletions_curl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  `Bearer ${OPENAI_API_KEY}`,
            }

        })
        .then(
            function (response) {
                return response.json()  
            } 
        )
        .then (
            function (response_data) {
                par.tracefunction ('..................................openai_result\n')  
                if (response_data.error) {
                    par.onerrorfunction (response_data.error.message);
                } else {
                    if (par.on) {
                        par.chatmessages.push (response_data.choices[0].message)
                        par.onresultfunction (response_data.choices[0].message.content)
                    } else {
                        par.onerrorfunction ('chat aborted Open AI is off');
                    }
                }
            }
        )   
    }    
    image = function (message) {
        if (!this.ison()) {
            console.log ('openai is off')
            return;
        }
        let par = this;    
        fetch(openai_chatcompletions_curl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  `Bearer ${OPENAI_API_KEY}`,
            }

        })
        .then(
            function (response) {
                return response.json()  
            } 
        )
        .then (
            function (response_data) {
                par.tracefunction ('..................................openai_result\n')  
                if (response_data.error) {
                    par.onerrorfunction (response_data.error.message);
                } else {
                    if (par.on) {
                        par.chatmessages.push (response_data.choices[0].message)
                        par.onresultfunction (response_data.choices[0].message.content)
                    } else {
                        par.onerrorfunction ('chat aborted Open AI is off');
                    }
                }
            }
        )   
    }    
    audio = function (message) {
        if (!this.ison()) {
            console.log ('openai is off')
            return;
        }
        let par = this;    
        fetch(openai_chatcompletions_curl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization:  `Bearer ${OPENAI_API_KEY}`,
            }

        })
        .then(
            function (response) {
                return response.json()  
            } 
        )
        .then (
            function (response_data) {
                par.tracefunction ('..................................openai_result\n')  
                if (response_data.error) {
                    par.onerrorfunction (response_data.error.message);
                } else {
                    if (par.on) {
                        par.chatmessages.push (response_data.choices[0].message)
                        par.onresultfunction (response_data.choices[0].message.content)
                    } else {
                        par.onerrorfunction ('chat aborted Open AI is off');
                    }
                }
            }
        )   
    }    

    start = function () {
        this.on = true;
    }
    stop  = function () {
        this.on = false;
    }
    ison = function () {
        return this.on;
    }
    chat_reset = function () {
        this.chatmessages = [];
    }
   
    set_options = function (options) {
        this.options          = defined(options) ? {...this.options, ...options} : this.options;
        this.modeltype        = this.options.modeltype     
        this.tracefunction    = this.options.tracefunction  
        this.onresultfunction = this.options.onresultfunction
        this.onerrorfunction  = this.options.onerrorfunction        
    }           
}
