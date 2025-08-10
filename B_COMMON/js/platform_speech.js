//---------------------------------------------------- RECOGNITION    ------------------------------------------------   

var recognition_editor;
var translation_editor;
var openai_editor;

var translation_lang = 'zh';
var recognition_lang = 'en';
var sound_lang       = 'en';
var openai_lang      = 'en'

var openai_completions = openai_version_curl + '/chat/completions';
var openai_model       = 'text-davinci-003'


class SpeechEditor {
    constructor (name, id) {
        this.name = name;
        this.init (id) 
    }    
    init (id) {
        this.input_init ('speech_input_' + id) 
        this.output_init('speech_output_' + id)    
    }
    update () {
        this.input_update ();
        this.output_update ();    
    }

    select () {
        this.input_select () 
    }
    
    input_setvalue (text, concatenate) {
        this.input.setValue(concatenate ? this.output.getValue() + text : text); 
        this.input.gotoEnd ();
    }
    
    output_setvalue (text, concatenate) {
        this.output.setValue(concatenate ? this.output.getValue() + text : text); 
        this.output.gotoEnd ();

    }
    input_getvalue (text, concatenate) {
        return this.input.getValue(); 
    }
    
    output_getvalue (text, concatenate) {
        return this.output.getValue(); 
    }

    input_update () {
        this.input.setMode();       
    }

    output_update () {
         this.output.setMode();              
    }

    input_select () {
    }

    input_init (id) {
        this.input = new aceeditor(id,  "ace/theme/nord_dark", "ace/mode/jsx");      
        this.input.setOptions( {
            useSoftTabs: false,
            showPrintMargin: false,
            wrap: true,         
            indentedSoftWrap: false,                
        });    
        this.input.addCommand({
            name: 'evalJS',
            bindKey: {
                win: 'Alt-E',
                mac: 'Alt-E',
                sender: 'editor|cli'
            },
            exec: (editor) => {
                this.input_oneval(this.input, this.output);
              }
            });
            this.input.setValue ('');                
    }
    output_init (id) {
        this.output = new aceeditor(id, "ace/theme/nord_dark", "ace/mode/jsx");      
        this.output .setOptions( {
            readOnly: true,        
            useSoftTabs: false,
            showPrintMargin: false,
            indentedSoftWrap: false,
            wrap: true,             
        });    

        this.output .addCommand({
            name: 'clearJS',
            bindKey: {
                win: 'Alt-C',
                mac: 'Alt-C',
                sender: 'editor|cli'
            },
            exec: (editor) => {
                this.output_clear();
              }
            });
            this.output.setValue ('');            
    }    
}


const essai_rules = '<command> = <action> <object>;' +
              '<action> = /10/ open |/2/ close |/1/ delete |/1/ move;' +
              '<object> = [the | a] (window | file | menu);' +
              '<startPolite> = (please | kindly | could you | oh  mighty  computer) *;' +
              '<endPolite> = [ please | thanks | thank you ];'

function speech_init () {
    let gsound          = solution.get('sound')
    let grecognition    = solution.get('recognition')
    let gopenai         = solution.get('openai')
    let gtranslation    = solution.get('translation')

    recognition_editor  = new SpeechEditor ('Recognition', 'recognition');
    translation_editor  = new SpeechEditor ('Translation', 'translation');
    openai_editor       = new SpeechEditor ('OpenAI', 'openai');


    let Grammar_Commands  = new recognition_grammar('essai', '<startPolite> <command> <endPolite>', essai_rules);
    
    grecognition.set_options (
        {
            lang: recognition_lang, 
            onendfunction:      recognition_endcallback, 
            onresultfunction:   recognition_resultcallback, 
            onstartfunction:    recognition_startcallback,
            onstopfunction:     recognition_stopcallback,            
            onabortfunction:    recognition_abortcallback,               
        }
    );
    grecognition.addgrammar(Grammar_Commands);

    gsound.set_options (
        {
            lang: sound_lang,
            onendfunction:      sound_endcallback, 
            onstartfunction:    sound_startcallback,
        }
    );
    gopenai.set_options (
        {
            modeltype:          'completion',
            onresultfunction:   openai_resultcallback,
            onerrorfunction:    openai_errorcallback,            
        }
    )    

    gtranslation.set_options (
        {
            modeltype:          'completion',
            onresultfunction:   translation_resultcallback,
            onerrorfunction:    translation_errorcallback,               
        }
    );


    let selectedvoice       = gsound.get_currentvoice();
    let selectedrecognition = grecognition.get_lang();
    let selectedtranslation = translation_lang;
    let selectedmodel       = gopenai.get_currentmodel()

    if (selectedvoice) {
        Update_VoicePanel('sound_voice', selectedvoice.lang.substring(0,2), selectedvoice.lang.substring(3))
    }

    if (selectedrecognition != -1) {
        let language     = solution.get_language (selectedrecognition);
        if (language != -1) {
            Update_LanguagePanel('recognition_lang', language.code, language.name);
        }
    }
    if (selectedtranslation) {
        let language     = solution.get_language (selectedtranslation);
        if (language != -1) {
            Update_LanguagePanel('translation_lang', language.code, language.name);
        }        
    }  

    if (selectedmodel) {
        Update_ModelPanel('model_name', selectedmodel)
    }         
    $('#trfromto').html (recognition_lang + '-' + sound_lang + '- tr: ' + translation_lang);         
}


function speech_resize(id) {
 
    let editor = GetEditorFromId(id);
    if (editor) {
        editor.resize();
    }
}

function onclick_eval_button (elt, event) {

    switch (elt.id.split ('_')[2]) {
        case 'recognition':
        break;
        case 'translation':
            let gtranslation    = solution.get('translation')            
            gtranslation.translate (translation_editor.input_getvalue ())
           // Translation_fromto (translation_editor.input_getvalue (), recognition_lang + '-' + translation_lang, true, translation_callback);    
        break;
        case 'openai':
            let gopenai         = solution.get('openai')            
            gopenai.ask(openai_editor.input_getvalue ());
        break;
    }
}

function onclick_reset_button (elt, event) {
    switch (elt.id.split ('_')[2]) {
        case 'recognition':
            recognition_editor.input_setvalue ('')
            recognition_editor.output_setvalue ('')
        break;
        case 'translation':
            translation_editor.input_setvalue ('')
            translation_editor.output_setvalue ('')
        break;
        case 'openai':
            openai_editor.input_setvalue ('')
            openai_editor.output_setvalue ('')
        break;
    }
}

function onclick_swap_button (elt, event) {
    let grecognition    = solution.get('recognition')
    let gtranslation    = solution.get('translation')

    let orig_lang  = recognition_lang;
    let orig_value = translation_editor.input_getvalue();
    
    if (orig_lang == translation_lang) {
        return;
    }
    recognition_lang = translation_lang;
    grecognition.set_lang(recognition_lang)  

    if (grecognition.ison ()) {   // we need to stop and start to get effect
        grecognition.stop()
        setTimeout(function(){ grecognition.start(); }, 400);
    }    

    translation_lang = orig_lang;
    gtranslation.set_to_lang (translation_lang)
    gtranslation.set_from_lang (recognition_lang)


    let language     = solution.get_language (recognition_lang);
    Update_LanguagePanel('recognition_lang', language.code, language.name);

    language         = solution.get_language (translation_lang);
    Update_LanguagePanel('translation_lang', language.code, language.name);


//switch content
    translation_editor.input_setvalue(translation_editor.output_getvalue())
    translation_editor.output_setvalue(orig_value)
}

function onclick_speechtogglepanel(elt, event) {
    let s_speechpanel = $(elt).closest('.speech')
    console.log ('resize')
    if (s_speechpanel.hasClass('toggled')) {
        s_speechpanel.removeClass('toggled');
     
        sb.resize(speechpanel);        
    }
    else {
        s_speechpanel.addClass('toggled');
      
        sb.resize(speechpanel);        
    }   
}

function onclick_openaimodelgroup (elt,event) {
    let gopenai         = solution.get('openai')

    gopenai.set_modeltype (elt.id.replace ('_button', ''))
    Update_ModelPanel('model_name', gopenai.get_currentmodel())
}

//---------------------------------------------------------- TRANSLATION CALLBACK ----------------------------------------------------------------------

function translation_resultcallback (result) {
    let gopenai         = solution.get('openai')
    let gsound          = solution.get('sound')
    let gtranslation    = solution.get('translation')

    let pinyinresponse = '';
    
    let from_lang  = gtranslation.get_from_lang()
    var trans_lang = gtranslation.get_to_lang()        

    let sound_lang = gsound.get_lang()
    
    if (sound_lang != trans_lang) {
        let voice = gsound.set_lang (trans_lang);
        if (voice) {
            Update_VoicePanel('sound_voice', gsound.lang, voice.lang.substring(3))
        }
    }    

    result = result.replace(/\r+|\n+|^\?\s*|^\s+|\s+$/gm,'');

    if (trans_lang == 'zh') {
        pinyinresponse = '\r\n' + hanzipinyin (result);
    } else 
    if (from_lang == 'zh') {
    }
    console.log ('..................................translation_result\n' + result)  


    translation_editor.output_setvalue (result  + pinyinresponse)

    gsound.speak(result);
   
    if (gopenai.ison()) {
        console.log ('..................................openai_started\n' + result)     
        openai_editor.input_setvalue(result)       
        gopenai.ask(result);
    }
}

function translation_errorcallback (strerror) {
    console.log ('..................................translation_result\n' + strerror)  
    translation_editor.output_setvalue(strerror)     
}



//---------------------------------------------------------- RECOGNITION CALLBACK ----------------------------------------------------------------------

function recognition_resultcallback (result) {
    let gsound          = solution.get('sound')
    let gopenai         = solution.get('openai')
    let gtranslation    = solution.get('translation')
    let grecognition    = solution.get('recognition')

    let recog_lang = grecognition.get_lang()
    let pinyinresponse = ''

    if (recog_lang == 'zh') {
        pinyinresponse = ' (' + hanzipinyin (result) + ')';
    }
 
    recognition_editor.output_setvalue(result[0] == ' ' ? result : (recognition_editor.output_getvalue() == '' ? '' : '\n')  + result + pinyinresponse, 1)

    console.log ('..................................recognition_result \n' + result)

    if (gtranslation.ison()) {
        console.log ('..................................translation_started\n' + result)                
        if (recognition_lang == translation_lang) {
            translation_editor.input_setvalue(result)            
        //    translation_callback(result, result,  recognition_lang + '-' + translation_lang)    
            translation_resultcallback(result)

        } else {
            translation_editor.input_setvalue(result)
           // Translation_fromto (result, recognition_lang + '-' + translation_lang, true, translation_callback);
           gtranslation.translate (result)
        }
    }else
    if (gopenai.ison()) {
        let sound_lang = gsound.get_lang()
    
        if (sound_lang != recognition_lang) {
            let voice = gsound.set_lang (recognition_lang);
            if (voice) {
                Update_LanguagePanel('sound_voice', gsound.lang, voice.lang.substring(3))
            }
        }            
        console.log ('..................................openai_started\n' + result)    
        openai_editor.input_setvalue(result)                     
        gopenai.ask(result);
    }
}    

function recognition_startcallback (result) {
    console.log ('..................................recognition_started')        
}

function recognition_endcallback (result) {
    console.log ('..................................recognition_ended')
}

function recognition_stopcallback () {
    console.log ('..................................recognition_stopped')
}


function recognition_abortcallback () {
    console.log ('..................................recognition_aborted')
}

//---------------------------------------------------------- SOUND CALLBACK ----------------------------------------------------------------------

function sound_startcallback (result) {
    console.log ('..................................sound_started')    
//    Recognition_set(false, true, true)
}


function sound_endcallback (result) {
    console.log ('...................................sound_ended')
//    Recognition_set(true, true, true)
}

//---------------------------------------------------------- OPEN AI CALLBACK ----------------------------------------------------------------------

function openai_resultcallback (result) {
    let gsound          = solution.get('sound')
        
    console.log ('..................................openai_result\n' + result)  
    openai_editor.output_setvalue(result)      
    gsound.speak(result);
}

function openai_errorcallback (strerror) {
    console.log ('..................................openai_result\n' + strerror)  
    openai_editor.output_setvalue(strerror)     
}
//---------------------------------------------------------- ----------------------------------------------------------------------------------------

var lex_result = function  (sentence) {
    let gsound          = solution.get('sound')
    let grecognition    = solution.get('recognition')

    console.log ('lex_result --------------- = ' + sentence);

    if (sentence == 'switch'){
        let trans_lang      = translation_lang;
        translation_lang    = recognition_lang;
        recognition_lang    = trans_lang;
        
        grecognition.set_lang (recognition_lang);
        gsound.set_lang (translation_lang);
    }
    if (sentence == '1'){
        gsound.utterance.pitch = Math.min (2,  gsound.utterance.pitch + 0.3);
    }    
    if (sentence == '2'){
        gsound.utterance.pitch = Math.max (0,  gsound.utterance.pitch - 0.3); 
    }    
    if (sentence == '3'){
        gsound.utterance.rate = Math.min (10,  gsound.utterance.rate + 1); 
    }    
    if (sentence == '4'){
        gsound.utterance.rate = Math.max (0.1,  gsound.utterance.rate - 1); 
    }    
    $('#trfromto').html (recognition_lang + '-' + sound_lang + '- tr: ' + translation_lang);     
}



function Recognition_set (on, switchcheck, buttoncheck) {
    let grecognition    = solution.get('recognition')
  
    if (on == undefined) {
        on = !grecognition.ison();
        $('#switchrecognition').prop('checked', on);    
        on ? $('#button_recognition').addClass ('checked') :  $('#button_recognition').removeClass ('checked')
    }      
    if (on) {
        setTimeout(function(){ grecognition.start(); }, 400); 
        TreatInfo("Microphone is on ", 'operationpanel', 'green');

        if (switchcheck) {
            $('#switchrecognition').prop('checked', true);    
        }
        if (buttoncheck) {
            $('#button_recognition').addClass ('checked')          
        }
    }
    else {
        grecognition.abort()
        grecognition.stop();
        TreatInfo("Microphone is off ", 'operationpanel', 'red');      

        if (switchcheck) {
            $('#switchrecognition').prop('checked', false); 
        }   
        if (buttoncheck) {
            $('#button_recognition').removeClass ('checked')         
        }
    }
}

function Sound_set (on, switchcheck, buttoncheck) {
    let gsound          = solution.get('sound')

    if (on == undefined) {
        on = !gsound.ison();
        $('#switchsound').prop('checked', on);    
        on ? $('#button_sound').addClass ('checked') :  $('#button_sound').removeClass ('checked')
    }

    if (on == true) {
        gsound.start();   
        TreatInfo("You ask to put sound on .... Hello ", 'operationpanel', 'green');
        if (switchcheck) {
            $('#switchsound').prop('checked', true);    
        }
        if (buttoncheck) {
            $('#button_sound').addClass ('checked')          
        }        
    }   
    else {
        gsound.abort();        
        gsound.stop();   
        TreatInfo("You ask to cut sound ", 'operationpanel', 'red');
        if (switchcheck) {
            $('#switchsound').prop('checked', false); 
        }   
        if (buttoncheck) {
            $('#button_sound').removeClass ('checked')         
        }        
    }
}

function OpenAI_set (on, buttoncheck) {
    let gopenai         = solution.get('openai')

    if (on == undefined) {
        on = !gopenai.ison();
        on ? $('#button_openai').addClass ('checked') :  $('#button_openai').removeClass ('checked')
    }

    if (on == true) {
        gopenai.start();   
        TreatInfo("Open AI started", 'operationpanel', 'green');

        if (buttoncheck) {
            $('#button_openai').addClass ('checked')          
        }        
    }   
    else {
        gopenai.stop();   
        TreatInfo("Open AI is stopped ", 'operationpanel', 'red');

        if (buttoncheck) {
            $('#button_openai').removeClass ('checked')         
        }        
    }
}

function Translation_set (on, buttoncheck) {
    let gtranslation    = solution.get('translation')    

    if (on == undefined) {
        on = !gtranslation.ison();
        on ? $('#button_translation').addClass ('checked') :  $('#button_openai').removeClass ('checked')
    }

    if (on == true) {
        gtranslation.start();   
        TreatInfo("Translation started", 'operationpanel', 'green');

        if (buttoncheck) {
            $('#button_translation').addClass ('checked')          
        }        
    }   
    else {
        gtranslation.stop();   
        TreatInfo("Translation is stopped ", 'operationpanel', 'red');

        if (buttoncheck) {
            $('#buttobutton_translationn_openai').removeClass ('checked')         
        }        
    }
}



function onchange_sound_pitch(elt, event) {
    let gsound          = solution.get('sound')       
    let value = elt.valueAsNumber;
    gsound.utterance.pitch = value;        
}

function onchange_sound_rate(elt, event) {
    let gsound          = solution.get('sound')       
    let value = elt.valueAsNumber;
    gsound.utterance.rate = value;    
}

function onclick_sound(elt, event) {
    let checked = $(elt).hasClass('checked');    
    $('#switchsound').prop('checked', !checked);     
    Sound_set (!checked);
}

function onclick_recognition (elt, event) {
    let checked = $(elt).hasClass('checked');    
    Recognition_set (!checked, true, false);

}

function onclick_openai(elt, event) {
    let checked = $(elt).hasClass('checked');    
    OpenAI_set(!checked)
}

function onclick_translation (elt, event) {
    let checked = $(elt).hasClass('checked');    
    Translation_set(!checked)
}

//---------------------------------------------------------- PANELS ----------------------------------------------------------------------


function get_lang_in_table (table, selectedlang) {

    let languages = solution.languages;
    let rowselected = -1;    
    let langtable = [];


    table.rows= [];         

    for (var i= 0; i < languages.length; i++) {
        let isolang     = languages[i].code;
        let namelang    = languages[i].name
            langtable.push (namelang)
            if (isolang == selectedlang) {
                rowselected = i;
            }
            table.rows.push (['<span>' + isolang+ '-' + namelang + '</span>']);

    }

    return rowselected;
}

function onclick_recognition_lang(elt, event) {
    let grecognition    = solution.get('recognition')

    let currentlang = grecognition.get_lang();  
    let rowselected = get_lang_in_table (recognitionlanguagestable, currentlang);

    sb.overlay({
        id : 'overlay_recognition',
        rootelt: $('body'),
        pageX: event.pageX,
        pageY: event.pageY + 10,
        event: event,                
        keepopen: false,
        classes: '',
        style:'width:120px;height:300px;background:"red"',
        onshow : function () {
            sb.table_rowselect (recognitionlanguagestable,  rowselected); 
        },        
        html: SpeechMenu ('recognition_selectmenu', 'sb_pane sb_panel', recognitionlanguagestable)
    }); 
}

function onclick_recognitionrow (elt, event) {
    let grecognition    = solution.get('recognition')

    let rows            = elt.id.split ('_');
    let rowindex        = rows[rows.length -1];
    let recognitionlang = elt.innerText.substring(0,2)

    console.log ('sssssssssssssssssssssssssssssssssssss')

    grecognition.set_lang (recognitionlang);
    recognition_lang = recognitionlang;  

    if (grecognition.ison ()) {   // we need to stop and start to get effect
        grecognition.stop()
        setTimeout(function(){ grecognition.start(); }, 400);
    }

    sb.table_rowselect (recognitionlanguagestable,  rowindex);   

    let language        = solution.get_language (recognition_lang);
    if (language != -1) {
        Update_LanguagePanel('recognition_lang', language.code, language.name);
    }

    $('#overlay_recognition').remove();

    $('#trfromto').html (recognition_lang + '-' + sound_lang + '- tr: ' + translation_lang);     
}

function onclick_translation_lang (elt, event) {
    let width = $(elt).css('width')
    let currentlang = translation_lang;  
    let rowselected = get_lang_in_table (translationlanguagestable, currentlang);

    sb.overlay({
            id : 'overlay_translation',
            rootelt: $('body'),
            pageX: event.pageX,
            pageY: event.pageY + 10,
            event: event,                
            keepopen: false,
            classes: '',
            style:'width:120px;height:300px;background:"red"',
            onshow : function () {
                sb.table_rowselect (translationlanguagestable,  rowselected); 
              //  $('#translation_lang').('text')
            },        
            html: SpeechMenu ('translation_selectmenu', 'sb_pane sb_panel', translationlanguagestable)
        }); 
 }
 
 function onclick_translationrow (elt, event) {
    let gtranslation    = solution.get('translation')    

    let rows            = elt.id.split ('_');
    let rowindex        = rows[rows.length -1];
    let translang       = elt.innerText.substring(0,2)

    gtranslation.set_to_lang (translang);
    translation_lang = translang;  

    sb.table_rowselect (translationlanguagestable,  rowindex); 
    
    let language     = solution.get_language (translation_lang);
    if (language != -1) {
        Update_LanguagePanel('translation_lang', language.code, language.name);
    }    

    $('#overlay_translation').remove();

    $('#trfromto').html (recognition_lang + '-' + sound_lang + '- tr: ' + translation_lang);     
}

function onclick_sound_voice (elt, event) {
    let gsound          = solution.get('sound')    

    let voices          = gsound.voices;
    let rowselected     = -1;
    let currentvoice    = gsound.get_currentvoice();  

    soundvoicestable.rows= []; 
    for (var i= 0; i < voices.length; i++) {
        if (voices[i].voiceURI == currentvoice.voiceURI) {
            rowselected = i;
        }
        soundvoicestable.rows.push ([voices[i].voiceURI,  '<span class="flag-icon flag-icon-' + voices[i].lang.substring(3).toLowerCase() + ' me-1"></span><span>' + voices[i].lang + '</span>', voices[i].default]);
    }
    sb.overlay({
        id : 'overlay_voices',
        rootelt: $('body'),
        pageX: event.pageX,
        pageY: event.pageY + 10,
        event: event,                
        keepopen: false,
        classes: '',
        style:'width:400px;height:500px;background:"red"',
        onshow : function () {
            sb.table_rowselect (soundvoicestable,  rowselected); 
        },        
        html: SpeechMenu ('sound_selectmenu', 'sb_pane sb_panel', soundvoicestable)
    }); 
}

 function onclick_voicerow (elt, event) {
    let gsound          = solution.get('sound')

    let rows = elt.id.split ('_');
    let rowindex = rows[rows.length -1];
    let voice =  gsound.voices[rowindex];

    gsound.set_voice(voice);
    sound_lang = gsound.lang;  

    TreatInfo('You selected ' + voice.name + ' ', 'operationpanel', 'gold');    
    
    sb.table_rowselect (soundvoicestable,  rowindex);   

    let selectedlang = $('#' + elt.id + '_' + 1).find ('.flag-icon').next().html();
    Update_VoicePanel('sound_voice', selectedlang.substring(0,2), selectedlang.substring(3))


    $('#overlay_voices').remove();

    $('#trfromto').html (recognition_lang + '-' + sound_lang + '- tr: ' + translation_lang);     
}

function get_openaimodels_in_table () {
    let gopenai         = solution.get('openai')

    var models = gopenai.models;
    let rowselected = -1;    
    let modeltable = [];
    let currentmodel = gopenai.get_currentmodel();

    openaimodelstable.rows= []; 

    for (var i= 0; i < models.length; i++) {
        let model      = models[i].id;
        let createdate = new Date(models[i].created);
        let ownedby    = models[i].owned_by;

        if (model == currentmodel) {
            rowselected = i;
        }
        openaimodelstable.rows.push (
            [
                model,  
             //   createdate.toTimeString(), 
                ownedby
            ]);
    }
    return rowselected;
}

function onclick_model_name (elt, event) {

    var rowselected = get_openaimodels_in_table();

    sb.overlay({
        id : 'overlay_models',
        rootelt: $('body'),
        pageX: event.pageX,
        pageY: event.pageY + 10,
        event: event,                
        keepopen: false,
        classes: '',
        style:'width:400px;height:500px;background:"red"',
        onshow : function () {
            sb.table_rowselect (openaimodelstable,  rowselected); 
        },        
        html: SpeechMenu ('openai_selectmenu', 'sb_pane sb_panel', openaimodelstable)
    }); 
}

function onclick_modelrow (elt, event) {
    let gopenai         = solution.get('openai')
    let gsound          = solution.get('sound')

    let rows = elt.id.split ('_');
    let rowindex = rows[rows.length -1];
    let model =  gopenai.models[rowindex];

    gopenai.set_model(model.id);
    gsound.speak ('You selected ' + model.id + ' ');
    
    sb.table_rowselect (openaimodelstable,  rowindex);   

    Update_ModelPanel('model_name', model.id)

    $('#overlay_models').remove();
}

function TraceSpeechEditor(value, add) {
    SpeechEditor.setValue((add == 1 ? SpeechEditor.getValue() : "") + value , -1);
}

function TraceSpeechEditor(value, add) {
    return;
}

function SpeechMenu (id, classnames, table) {
    var content = 
    '<div id="' + id + '" class=" ' + (classnames ? classnames : '')  +  '" oncontextmenu="OnContextMenuEditor (event, this)">' +
        sb.render(table) +
    '</div>';
    return content;
}

function Update_LanguagePanel (id, isolang, namelang){
    $('#' + id).html ('<span>' + (defined(isolang) ? isolang + '-' + namelang : '') + '</span>')
}

function Update_VoicePanel (id, isolang, lang) {
    $('#' + id).html ('<span class="flag-icon flag-icon-' + (defined(lang) ? lang.toLowerCase() : '') + ' me-1"></span><span>' + (defined(isolang) ? isolang : '') + '</span>')
}

function Update_ModelPanel (id, name) {
    $('#' +id).html(name)
}
