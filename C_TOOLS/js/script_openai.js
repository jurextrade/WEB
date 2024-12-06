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



/*
Gabriel Jureidini
python adjustment of a short strangle option strategy
To adjust a short strangle option strategy in Python, you can use the following steps:

Identify the current positions of the short strangle strategy, including the strike prices and expiration dates of the options.

Determine the reason for the adjustment. For example, if the stock price has moved against the short strangle position, you may want to adjust the strike prices to reduce the potential loss.

Modify the strike prices of the short strangle options to adjust the position. You can use Python libraries such as numpy to perform mathematical calculations. For example, if the stock price has moved lower and the short put strike is at risk of being assigned, you can roll the put option to a lower strike price.

Adjust the expiration dates of the options if necessary. If the expiration date of the options is approaching and the stock price has not moved in the desired direction, you may want to roll the options to a later expiration date to give the position more time to work.

Check the new risk/reward profile of the adjusted position. You can use Python libraries such as pandas and matplotlib to visualize the new position and assess its potential risk and reward.

Here's an example Python code snippet that demonstrates how to adjust a short strangle position by rolling the short put to a lower strike price:

python
Copy code
import numpy as np

# current position
short_call_strike = 50
short_put_strike = 40
expiration_date = '2023-03-17'

# stock price has moved lower
new_short_put_strike = 35

# calculate the credit received from the new position
new_credit = np.abs(short_call_strike - new_short_put_strike)

# output the new position
print(f'New position: Short {expiration_date} {short_call_strike} Call and Short {expiration_date} {new_short_put_strike} Put for a total credit of {new_credit}.')
This code snippet assumes that the original short strangle position had a short call option with a strike price of 50 and a short put option with a strike price of 40, expiring on March 17th, 2023. The code then calculates the new strike price for the short put option at 35, and outputs the new position with the new credit received.




Gabriel Jureidini
javascript code readjustment of a short strangle option strategy using black-scholes
To adjust a short strangle option strategy using Black-Scholes model in JavaScript, you can use the following steps:

Install the jstat package, which provides functions for calculating Black-Scholes option values.

Copy code
npm install jstat
Identify the current positions of the short strangle strategy, including the strike prices and expiration dates of the options.

Determine the reason for the adjustment. For example, if the stock price has moved against the short strangle position, you may want to adjust the strike prices to reduce the potential loss.

Modify the strike prices of the short strangle options to adjust the position. You can use the Black-Scholes model to calculate the new option prices. For example, if the stock price has moved lower and the short put strike is at risk of being assigned, you can roll the put option to a lower strike price.

Adjust the expiration dates of the options if necessary. If the expiration date of the options is approaching and the stock price has not moved in the desired direction, you may want to roll the options to a later expiration date to give the position more time to work.

Check the new risk/reward profile of the adjusted position. You can use console.log statements to print out the new position and assess its potential risk and reward.

Here's an example JavaScript code snippet that demonstrates how to adjust a short strangle position by rolling the short put to a lower strike price using Black-Scholes model:

javascript
Copy code
const jstat = require('jstat');

// current position
let shortCallStrike = 50;
let shortPutStrike = 40;
let expirationDate = new Date('2023-03-17');
let stockPrice = 45;
let riskFreeRate = 0.02;
let volatility = 0.3;

// stock price has moved lower
let newShortPutStrike = 35;

// calculate the credit received from the new position
let newCredit = Math.abs(shortCallStrike - newShortPutStrike);

// calculate the new put option price using Black-Scholes model
let newPutPrice = jstat.black_scholes('p', stockPrice, newShortPutStrike, riskFreeRate, expirationDate, volatility);

// calculate the new strangle position value
let newStrangleValue = newCredit - jstat.black_scholes('c', stockPrice, shortCallStrike, riskFreeRate, expirationDate, volatility) + newPutPrice;

// output the new position value
console.log(`New position value: ${newStrangleValue}`);
This code snippet assumes that the original short strangle position had a short call 
option with a strike price of 50 and a short put option with a strike price of 40, expiring on
 March 17th, 2023. The code then calculates the new strike price for the short put option at 35, 
 and uses the Black-Scholes model to calculate the new put option price and the new strangle position value. The output is the new position value.

*/