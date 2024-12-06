//--------------------------------------------------------------------- BYTES PANEL  --------------------------------------------------------------------

var emv_bytetable = (id =>  {return {
    id: 'emv_bytetable_' + id,
    type: 'table',            
    class:'emvbyte',
    events: {onclick: "onclick_emv_byte(this, event)"},
    columns :  ['b8', 'b7', 'b6', 'b5', 'b4', 'b3', 'b2', 'b1', 'description'],
    columnstitle : ['bit 8', 'bit 7', 'bit 6', 'bit 5', 'bit 4', 'bit 3', 'bit 2', 'bit 1', 'description'],
    rows : [
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
        [0,0,0,0,0,0,0,0,""],
    ] 
}})

var emv_byte = ((name, id, tabs) =>  {return {
    id: 'emv_byte_' + id,
    type: 'panel',            
    class:'sb_column',
    style: "padding:10px;overflow: hidden;",     
    items : [
        {id: 'emv_description_' + id,  type: 'label',  style: tabs ? 'display:none;' : '', item: 'BYTE ' + (id + 1),  class: 'tagheader'},    
        emv_bytetable(id),
    ] 
}})

var emv_bytepanel = ((name, tag, entity, tabs, editable, withoutbar) =>  {
    let items = [];
    let tabitems = [];

    for(var i= 0; i < entity.struct.length; i++) {
        items.push (emv_byte(name, i, tabs))
        tabitems.push ({id: name + '_bytetab_' + i,   item: 'BYTE ' + (i + 1),  type: 'link', items: [emv_byte(name, i, tabs)]}, )
    }
    let elts = tabs ? 
    {
        id: 'emv_' + name + 'bytetabs', 
        type: 'tabs',    
        class: 'bytepanel' + (editable ? ' editable' : ''),
        items : tabitems
    } :
    {
        id: 'emv_' + name + 'bytepanel', 
        type: 'panel',       
        class: 'sb_column bytepanel' + (editable ? ' editable' : ''),  
        items: items,
    } 

    let panel = {
        id: 'emv_' + name + 'Panel', 
        type: 'panel',  
        class: 'sb_column sb_right emvflattablepanel',  
        style: "padding:10px",          
        struct: entity.struct,        
        items:[        
            elts,            
        ]
    }
    if (!withoutbar) {
        panel.items.unshift (
            {
                id: 'emv_' + name + 'bar', 
                type: 'bar', 
                items: [
                    {id: 'emv_' + name + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname (tag),  class: 'sb_f_classic ', title: 'Tag: ' + tag},
                    {id: 'emv_' + name + 'type',         type: 'switch',   item: 'Flat', events: {onclick: "onclick_byteflatpanel (this, event)"}},
                ] 
            })
    }
    return panel;
})

//--------------------------------------------------------------------- TERMINAL PANEL  --------------------------------------------------------------------

var emv_ttpanel = ((name, editable) => {return {
    id: 'emv_' + name + 'Panel',   
    type: 'panel',  
    class: 'sb_column sb_right emvflattablepanel',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'TT' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'TT' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F35'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F35'},
                {id: 'emv_' + 'TT' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F35', events :{onmousedown: "emv_apdu_searchtag('9F35', event)"} },                       
            ] 
        },        
        {id: 'emv_tt_Panel', type: 'html',  style:"padding:10px", content: 'emv_tt_panel("' +  (editable ? 'editable' : '') + '")'},    
    ]
}
})

// country code

var emv_TCCPanel = {
    id: 'emv_TCCPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'TCC' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'TCC' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1A'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1A'},
                {id: 'emv_' + 'TCC' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F1A', events :{onmousedown: "emv_apdu_searchtag('9F1A', event)"} },                                
            ] 
        },        
        {id: 'emv_tccPanel', type: 'select',  value: '', menu: emv_Country_Code, events: {onchange:'onchange_ttcPanel(this, event)'},    title :'Terminal Country Code'},     
    ]
}

// serial number

var emv_TSNPanel = {
    id: 'emv_TSNPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'TSN' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'TSN' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1E'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1E'},
                {id: 'emv_' + 'TSN' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F1E', events :{onmousedown: "emv_apdu_searchtag('9F1E', event)"} },                
            ] 
        },        
        {id: 'emv_tsnPanel', type: 'text',   value: '', events: {onchange:'onchange_tsnPanel(this, event)'},    attributes: {maxlength: "8"}, title :'Terminal Interface Device (IFD) Serial Number'},     
    ]
}


//--------------------------------------------------------------------- ACCEPTOR/MERCHANT PANEL  --------------------------------------------------------------------

var emv_MCCPanel = {
    id: 'emv_MCCPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'MCC' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'MCC' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F15'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F15'},
                {id: 'emv_' + 'MCC' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F15', events :{onmousedown: "emv_apdu_searchtag('9F15', event)"} },
            ] 
        },        
        {id: 'emv_mccPanel', type: 'text',   value: '', events: {onchange:'onchange_mccPanel(this, event)'},    attributes: {maxlength: "4"}, title :'Merchant Category Code'},     
    ]
}


var emv_MIPanel = {
    id: 'emv_MIPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'MI' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'MI' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F16'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F16'},
                {id: 'emv_' + 'MI' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F16',  events :{onmousedown: "emv_apdu_searchtag('9F16', event)"} },
            ] 
        },        
        {id: 'emv_miPanel', type: 'text',   value: '', events: {onchange:'onchange_miPanel(this, event)'},    attributes: {maxlength: "15"}, title :'Merchant Identifier'},     
    ]
}

var emv_MNLPanel = {
    id: 'emv_MNLPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'MNL' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'MNL' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F4E'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F4E'},
                {id: 'emv_' + 'MNL' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F4E',  events :{onmousedown: "emv_apdu_searchtag('9F4E', event)"} },
            ] 
        },        
        {id: 'emv_mnlPanel', type: 'text',   value: '', events: {onchange:'onchange_mnlPanel(this, event)'},    attributes: {maxlength: "40"}, title :'Merchant Name and Location'},     
    ]
}

var emv_TIPanel = {
    id: 'emv_TIPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'TI' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'TI' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F1C'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F1C'},
                {id: 'emv_' + 'TI' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F1C', events :{onmousedown: "emv_apdu_searchtag('9F1C', event)"} },                
            ] 
        },        
        {id: 'emv_tiPanel', type: 'text',   value: '', events: {onchange:'onchange_tiPanel(this, event)'},    attributes: {maxlength: "8"}, title :'Terminal Identification'},     
    ]
}


//--------------------------------------------------------------------- ACQUIRER PANEL  --------------------------------------------------------------------


var emv_AIPanel = {
    id: 'emv_AIPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'AI' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'AI' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F01'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F01'},
                {id: 'emv_' + 'AI' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F01', events :{onmousedown: "emv_apdu_searchtag('9F01', event)"} },                                
            ] 
        },        
        {id: 'emv_aiPanel', type: 'text',   value: '', events: {onchange:'onchange_aiPanel(this, event)'},    attributes: {minlength:"6", maxlength: "11"}, title :'Acquirer Identifier'},     
    ]
}

//--------------------------------------------------------------------- APPLICATION PANEL  --------------------------------------------------------------------

// country code

var emv_AIDPanel = {
    id: 'emv_AIDPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'AID' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'AID' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F06'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F06'},
                {id: 'emv_' + 'AID' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F06', events :{onmousedown: "emv_apdu_searchtag('9F06', event)"} },                                                
            ] 
        },        
        {id: 'emv_aidPanel', type: 'select',  value: '', menu: emv_AID, events: {onchange:'onchange_aidPanel(this, event)'},  attributes: {minlength:"1", maxlength: "2"},   title :'Application Identifier (AID) Terminal'},     
    ]
}

var emv_AVNPanel = {
    id: 'emv_AVNPanel',   
    type: 'panel',  
    class: 'sb_column sb_right',  
    style: "padding:10px",   
    items: [
        {
            id: 'emv_' + 'AVN' + 'bar', 
            type: 'bar', 
            items: [
                {id: 'emv_' + 'AVN' + 'description',  type: 'label',    style: 'margin-right:20px', item: gettagname ('9F09'),  class: 'sb_f_classic ', title: 'Tag: ' + '9F09'},
                {id: 'emv_' + 'AVN' + 'tag',          type: 'label',    class: 'emv_button_show', item: '9F09', events :{onmousedown: "emv_apdu_searchtag('9F09', event)"} },                 
            ] 
        },        
        {id: 'emv_avnPanel', type: 'text',  value: '', events: {onchange:'onchange_avnPanel(this, event)'},    title : 'Application Version Number'},     
    ]
}