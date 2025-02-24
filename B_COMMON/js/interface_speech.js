var recognitiongroup = {
    id: 'recognitiongroup',
    type: 'group',         
    class: '',
    items : [
        {id: 'button_recognition', item: 'Recognition', type: 'button', toggle: true, icon: icon_micro,   events: {onclick: "onclick_recognition (this, event)"}, title: 'Recognition'},
        {id: 'recognition_lang',   type: 'ihtml', class:'form-control',    events: {onclick: "onclick_recognition_lang (this, event)"},  title :'Recognition Language', },    
    ]
}

var translationgroup = {
    id: 'translationgroup',
    type: 'group',         
    class: '',
    items : [
        {id: 'translation_button', item: 'Translation', type: 'button', toggle: true, icon: icon_language,events: {onclick: "onclick_translation (this, event)"}, title: 'Translation', },
        {id: 'translation_lang',   type: 'ihtml',   class:'form-control',events: {onclick: "onclick_translation_lang (this, event)"}, title :'Translation Language'},    
        {id: 'translation_swap_button',  type:'button', icon: icon_swap, title: 'swap languages',  events: {onclick:'onclick_swap_button(this, event)'}},                    
    ]
}

var openaimodelgroup = {
    id: 'openaimodelgroup',
    type: 'group',
    class: 'sb_marginleft',
    position: 'sb_space',
    toggle: true,       
    items:[
        {id: 'completion_button',     item: 'complete', type:'button',  class: 'sb_sbutton, checked',  title: 'completion for the prompt', events: {onclick:'onclick_openaimodelgroup(this, event)'}},            
        {id: 'chat_button',           item: 'chat',     type:'button',  class: 'sb_sbutton',  title: 'chat conversation model',   events: {onclick:'onclick_openaimodelgroup(this, event)'}},             
        {id: 'edit_button',           item: 'edit',     type:'button',  class: 'sb_sbutton',  title: 'edit model',                events: {onclick:'onclick_openaimodelgroup(this, event)'}},     
        {id: 'image_button',          item: 'image',    type:'button',  class: 'sb_sbutton',  title: 'edit image',                events: {onclick:'onclick_openaimodelgroup(this, event)'}},             
        {id: 'audio_button',          item: 'audio',    type:'button',  class: 'sb_sbutton',  title: 'audio model',               events: {onclick:'onclick_openaimodelgroup(this, event)'}},       
    ]    
}

var openaigroup = {
    id: 'openaigroup',
    type: 'group',         
    class: '',
    items : [
        {id: 'button_openai', item: 'OpenAI', type: 'button', iconfile: '/res/openai.svg', toggle: true, events: {onclick: "onclick_openai (this, event)"}, title: 'OpenAI', },
        {id: 'model_name',    type: 'ihtml',  class:'form-control', events: {onclick: "onclick_model_name(this, event)"}, title :'OpenAI Model'},    
    ]
}


var soundvoicestable = {
    id: 'soundvoicestable',    
    type: 'table',
    events: {onclick: 'onclick_voicerow (this, event)'},
    columns: ['voiceURI', 'lang',  'default'],
    columnstitle: ['voiceURI', 'lang',  'default'],
    rows : [
    ] 
}

var openaimodelstable = {
    id: 'openaimodelstable',    
    type: 'table',
    events: {onclick: 'onclick_modelrow (this, event)'},
    columns: ['Model',  'Owned by'],
    columnstitle: ['Model', 'Owned by'],
    rows : [
    ] 
}

var translationlanguagestable = {
    id: 'translationlanguagestable',    
    type: 'table',
    events: {onclick: 'onclick_translationrow (this, event)'},
    columns: ['lang'],
    columnstitle: ['lang'],
    rows : [
    ] 
}

var recognitionlanguagestable = {
    id: 'recognitionlanguagestable',    
    type: 'table',
    events: {onclick: 'onclick_recognitionrow (this, event)'},
    columns: ['lang'],
    columnstitle: ['lang'],
    rows : [
    ] 
}

//--------------------------  EDITOR

var speech_input = (id =>  {return {
    id: 'speech_input_' + id,
    type: 'html',
    class: 'sb_panel speech_input',
    catchresize: true,
    resizefunction: 'speech_resize("speech_input_' + id + '")',  
}})

var speech_output = (id =>  {return {
    id: 'speech_output_' + id,
    type: 'html',
    class: 'sb_panel speech_output sb_top',   
    catchresize: true,
    resizefunction: 'speech_resize("speech_output_' + id + '")',      
}})

var speech_evalgroup = (id =>  {return {
    id: 'speech_evalgroup_' + id,
    type: 'group',     
    position: 'sb_end',
    class: 'sb_transform',    
    items:
        [ 
            {id: 'eval_button_' + id,     icon: icon_play,    type:'button',  class: 'speecheval', title: 'eval content',  events: {onclick:'onclick_eval_button(this, event)'}},            
            {id: 'reset_button_' + id,    icon: icon_trash,   type:'button',  title: 'clear content',  events: {onclick:'onclick_reset_button(this, event)'}},            
        ]    
    }})

var speech_bar  = ((id, toggled) =>  {return {
    id: 'speech_bar_' + id, 
    type: 'bar',    
    items:
     [
        (id == 'recognition' ? recognitiongroup : (id == 'translation' ? translationgroup : (id == 'openai' ? openaigroup : ''))),
        (id == 'openai' ? openaimodelgroup : {}),
        speech_evalgroup(id),
        {id: 'slide', type:'control',  class : 'box-btn-slide' + (toggled ? '' : ' rotate-180'), events: {onclick: "onclick_speechtogglepanel(this,event)"},  title: ''},
    ]
}})

var speech = ((id, toggled) =>  {return {
    id: 'speech_' + id,
    type: 'panel',
    class: 'sb_panel speech'  + (toggled ? ' toggled' : ''),
     items:
    [
        speech_bar(id, toggled),
        {
            id: 'speechmain_' + id,
            type: 'panel',
            class: 'speechmain sb_panel',
            items:
            [
                speech_input(id),
                speech_output(id),
            ]                  
        }
    ]   
}})

var soundgroup = {
    id: 'soundgroup',
    type: 'group', 
     
    class: '',
    items : [
        {id: 'button_sound', item: 'Sound', type: 'button',  toggle: true, icon: icon_sound,    events: {onclick: "onclick_sound (this, event)"}, title: 'Sound...',  },
        {id: 'sound_voice',  type: 'ihtml',  class:'form-control',  events: {onclick: "onclick_sound_voice (this, event)"}, title :'Voice Language'},    
        {id: 'sound_pitch',  item: 'Pitch', type: 'range',   min: '0', max: '2', value: '1', step: '0.1', events: {onchange: "onchange_sound_pitch(this, event)"}, title: 'Sound Pitch',  },
        {id: 'sound_rate',   item: 'Rate',  type: 'range',   min: '0.5', max: '2', value: '1', step: '0.1', events: {onchange: "onchange_sound_rate(this, event)"}, title: 'Sound Rate',  },
    ]
}

var langgroup = {
    id: 'langgroup',
    type: 'group', 
    position: 'sb_end', 
    class: '',
    items : [
        {id: 'trfromto',  type: 'html'},
    ]
}

var speechbar = (toggled =>  {return {          
    id: 'speechbar',    
    type: 'bar',
    toggle: false,                
    items:
        [ 

            soundgroup, 
            langgroup,
//            {id: 'slide', type:'control',  class : 'box-btn-slide' + (toggled ? '' : ' rotate-180'), events: {onclick: "onclick_speechtogglepanel(this,event)"},  title: ''},
        ]
}})      

var speechmain = (toggled =>  {return {    
    id: 'speechmain',
    type: 'panel',
    class: 'sb_main sb_column ' + (toggled ? ' toggled' : ''),
    items:
        [
            speech('recognition', true),
            speech('translation', true),
            speech('openai', true),
        ]
}})   

var speechpanel = { 
    id: 'speechpanel',
    pname: 'speech',
    type: 'panel',
    class: 'sb_panel sb_column',
    items:
        [
            speechbar(true),
            speechmain(true),
        ],
    init: 'speech_init()',          
}   