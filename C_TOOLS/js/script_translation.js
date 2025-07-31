
function Translation_fromto (text, modelid, async, callback) {
   var url = "https://api.au-syd.language-translator.watson.cloud.ibm.com/instances/094abd24-aeb7-4dd6-9ed7-fba9fb0d47ca/v3/translate?version=2018-05-01";

   if (!async) async = false;   
   var callbackreturn = null;    //case synchrone

   var xhr = new XMLHttpRequest();
   xhr.open("POST", url, async);

   xhr.setRequestHeader("Content-Type", "application/json");
   xhr.setRequestHeader("Authorization", "Basic YXBpa2V5OlNCbERzbzl6NVU3d2tMcG9WNVA1eU44VDlaRUFVdG5UMkpQb0hPaG9wZDgw");
    
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response;    
        try {
            response = JSON.parse(this.responseText);
        } catch(e) {
            return console.error(e); 
        }          

        var stranslation = response.translations[0].translation;

          if (callback)   {callbackrconsole.erroreturn = callback (text, stranslation, modelid);}          
       }
      if (this.readyState == 4 && this.status == 404) {
         console.log ('Erreur in Reading Translation Request');
      }            
      
   }
   var data = '{"text": ["'+ text + '"], "model_id":"' + modelid +'"}';    
   xhr.send(data);
}
function translation_callback (request, result, modelid) {
   let pinyinresponse = '';

   let modelfromto = modelid.split('-');
   
   let from_lang  = modelfromto[0];
   var trans_lang = modelfromto[1];        

   let sound_lang = gsound.get_lang()
  
   if (sound_lang != trans_lang) {
       let voice = gsound.set_lang (trans_lang);
       if (voice) {
           Update_LanguagePanel('sound_voice', gsound.lang, voice.lang.substring(3))
       }
   }

   
   if (trans_lang == 'zh') {
       hanzistroke ('hanzi_writer', result);
       pinyinresponse = ' (' + hanzipinyin (result) + ')';
   } else 
   if (from_lang == 'zh') {
       hanzistroke ('hanzi_writer', request);
   }

   console.log ('..................................translation_result\n' + result) 


   translation_editor.output_setvalue (result + pinyinresponse)

   gsound.speak(result);
  
   if (gopenai.ison()) {
       console.log ('..................................openai_started\n' + result)     
       openai_editor.input_setvalue(result)       
       gopenai.ask(result);
   }
}

// using openai for translation

class translation extends openai {
   constructor (options) {
      super(options);
      this.from_lang = 'en';
      this.to_lang   = 'zh'

   }
   translate = function (whatever) {
      this.ask ('Translate this into ' +  this.to_lang + '\n\n' + whatever)
         //model="text-davinci-003",
         //prompt="Translate this into 1. French, 2. Spanish and 3. Japanese:\n\nWhat rooms do you have available?\n\n1.",
         //temperature=0.3,
         //max_tokens=100,
         //top_p=1.0,
         //frequency_penalty=0.0,
         //presence_penalty=0.0
  }
   set_from_lang (lang) {
      this.from_lang = lang;
   }
   get_from_lang () {
      return this.from_lang;
   }
   set_to_lang (lang) {
      this.to_lang = lang;
   }
   get_to_lang () {
      return this.to_lang;
   }  
}
