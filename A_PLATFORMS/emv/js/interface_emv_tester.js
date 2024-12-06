//--------------------------------------------------------------------- EMV TREE Steps Panel --------------------------------------------------------------------

var emv_tree_steps = {
    id: "emv_tree_steps",
    type: "html",
    class: "sb_panel sb_main",
    content: 'emv_steps_diagram("emv_steps_diagram")',
};

var emv_tree_steps_panel = {
    id: 'emv_tree_steps_panel',
    type: 'panel',
    class: 'sb_panel',
    items: [
   //     {id: 'emv_steps_label',  type: 'label',    item: 'EMV Steps',  class: 'tagheader'}, 
   emv_tree_steps,
    ] 
}


//--------------------------------------------------------------------- EMV Presentation Panel --------------------------------------------------------------------

var emv_tree_steps_bar = {
    id: 'emv_tree_steps_bar',
    type: 'group',

    items: [
        {id: 'emv_tree_steps_button',  type: 'link',  toggle: true, icon: icon_structure, title: 'Show or Hide Tree Steps', events: {onclick: "onclick_tree_step_button(this, event)"}},   
    ]
}

var emv_presentation_steps_bar = ((emv_Steps) => {
    let items = [];    
    for(var i= 0; i <emv_Steps.length; i++) {    
        let step = emv_Steps[i];
        elt =  {id: 'emv_stepbar-' + i,  type: 'button', class: i == 0 ? 'checked' : '', item: 'Step ' + i,  title: step.item, events: {onclick: "onclick_presentation_step(this, event)"}};   
        items.push (elt)      
    }
    return {
        id: 'emv_presentation_steps_bar',
        type: 'group',
        toggle: true,
        position: 'sb_distance',        
        class: 'sb_main',
        items: items,
    }
})

var emv_presentation_bar = ((emv_Steps) => {
    let items = [];    
    return {
        id: 'emv_presentation_bar',
        type: 'bar',
        items: [
            emv_tree_steps_bar,            
            emv_presentation_steps_bar(emv_Steps),
        ],
    }
})

var emv_presentation_steps_panel = ((emv_Steps) =>  {
    let items = [];
    
    for(var i= 0; i <emv_Steps.length; i++) {

        let step = emv_Steps[i];
        elt = {
            id: step.id ,
            type: "html",
           
            class: "sb_pane card EMVStep " +  (i != 0 ? "sb_none" : ""),
            content: "emv_presentation_form(" + i + ")",        
        }
        items.push (elt)
    }
    return {
        id: "emv_presentation_steps_panel",
        type: "panel",
        class: "sb_panel sb_main",
        items: items
    }
})

var emv_presentation_panel = {
    id: 'emv_presentation_panel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items: [
        emv_presentation_bar(emv_Steps),
        {
            id: 'emv_presentation_steppanels',
            type: "panel",            
            class: 'sb_panel sb_main sb_row',
            items: [
                
        //     {id: 'emv_presentation_label',  type: 'label',    item: 'EMV Presentation',  class: 'sb_f_size12'}, 
                emv_tree_steps_panel,   
                emv_presentation_steps_panel(emv_Steps),
            ] 
        }
    ]
}

//---------------------------------------------------------------------------- TESTER SIDEPANEL PANEL -----------------------------------------------------------------------------------

var emv_testerpanel_buttongroup = ((toggled) =>  {return {
    id: 'emv_testerpanel_buttongroup',
    type: 'group',
    items: [

       {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen',     events: {onclick: "onclick_testerfspanel (this, event)"}, title: ''}, 
       {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_testercspanel (this, event)"}, title: ''}, 
       {id: 'slide', type:'control',  class : 'box-btn-slide' + (toggled ? '' : ' rotate-180'), events: {onclick: "onclick_testertogglepanel(this,event)"},  title: ''}

    ]
}})

//---------------------------------------------------------------------------- TRANSACTION TAGS PANEL -----------------------------------------------------------------------------------

var emv_transactiontags_searchgroup = ((toggled) =>  {return {
    id: 'emv_transactiontags_searchgroup',
    type: 'group',
    position:'sb_end',
    items: [
       // {id: 'emv_transactiontags_search',  type: 'search', item: 'Search:',
       //     title: 'Search Tag',      
       //     attributes: {'aria-controls': "emv_transactiontags_table", placeholder: "TAG",  autocomplete: "off", maxlength:4}, 
       //     style: "text-transform:uppercase;"
       // } 
    ]
}})

var emv_transactiontagsbar = ((toggled) =>  {return {
    id: 'emv_transactiontagsbar',
    type: 'bar',     
    class: 'sb_transform',    
    items:
        [ 
           {id: 'emv_description_TTAGS',  type: 'link',    icon: icon_tags, item: 'TAGS Used in Transaction',  class: '', title: 'Transaction Tags'},         
           emv_transactiontags_searchgroup(toggled),
           emv_testerpanel_buttongroup(toggled),           
        ]    
}})

var emv_transactiontags_table = {
    id: 'emv_transactiontags_table',
    type: 'table',            
    class: '',
    style: "padding:10px",
    columns :  ['Tag', 'Name', 'Value', 'Value_Ext', 'Representation'],
    columnstitle : ['Tag', 'Name', 'Value', 'Value_Ext', 'Representation'],
    rows : [
    ] 
}

var emv_transactiontags_tablepanel = {
    id: "emv_transactiontags_tablepanel",
    type: "panel",
    class: 'sb_panel sb_datatable',
    items: [
        emv_transactiontags_table,
    ]
}

var emv_transactiontagspanel  = ((toggled) =>  {return {
    id: "emv_transactiontagspanel",
    type: "panel",
    class: 'sb_panel sb_top' + (toggled ? ' toggled' : ''),
    items: [
        emv_transactiontagsbar(toggled),        
        emv_transactiontags_tablepanel,
    ]
}})

//--------------------------------------------------------------------- EMV ADPU --------------------------------------------------------------------

const apdu_default_node_events = {
    onclick: 'onclick_apdu_treenode(this, event)',  
}

var emv_apdu_bargroup = (hidden => {return {
    id: 'emv_apdu_bargroup',  

    class: 'sb_transform',
    type: 'group',      
    items:
        [
            {id: 'inspect_button',  type:'link', icon: icon_eye,  style: (hidden ? 'display:none' : 'display:block'), events: {onclick: "onclick_apdu_tree_inspect (this, event)"},  title: 'Inspect'},      
        ]
}})

var emv_apdu_tree_bar = ((tag, value, hidden) =>  {return {
    id: 'emv_apdu_tree_bar',

    class: 'sb_transform',
    type: 'group',     
    items : 
    [
        {id: 'treenode-' + tag + '-value',  disabled: true, type: 'link',  item: value},
        emv_apdu_bargroup(hidden),
    ]
}})

var emv_apdu_tree = {
    id: 'emv_apdu_tree',       
    type: 'tree',       
    class: 'treenode emvapdutree',
    item: 'APDU',
    attributes:{nodename: 'RootTag'},   
    arrow: true,
    closed: false,
    items:[
    ]
} 

var emv_apdu = {
    id: 'emv_apdu',
    type: 'panel',            
    class:'sb_panel',
    items : [
        emv_apdu_tree,
    ] 
}

var emv_apdu_searchgroup  = ((toggled) =>  {return {
    id: 'emv_apdu_searchgroup',
    type: 'group',
    position:'sb_end',
    items: [
        {id: 'emv_search_tag',  type: 'search', item: 'Search:',
            title: 'Search Tag',      
            attributes: {funcname: "emv_apdu_searchtag", placeholder: "TAG",  autocomplete: "off", maxlength:4}, 
            events: {onkeydown: "onkeydown_emv_search_tag(event, this)"},
            style: "text-transform:uppercase;",
      //      submit: "onclick_emv_search_tag(this)",
        }, 
    ]
}})

var emv_apdu_bar  = ((toggled) =>  {return {
    id: 'emv_apdu_bar',
    type: 'bar',
    items: [
        {id: 'emv_APDU',  type: 'link', icon: icon_exchange, item: 'APDU Exchange',  class: 'sb_fsclassic ', title: 'APPLICATION PROTOCOL DATA UNIT'}, 
        emv_apdu_searchgroup(toggled),
        emv_testerpanel_buttongroup(toggled)                 
    ]
}})


var emv_apdupanel  = ((toggled) =>  {return {
    id: 'emv_apdupanel',
    type: 'panel',
    class: 'sb_panel' + (toggled ? ' toggled' : '') + (toggled ? ' toggled' : ''),
    items: [
        emv_apdu_bar(toggled),
        emv_apdu,
    ]
}})

//--------------------------------------------------------------------------------------------------------------------------------------------------------

var emv_tester_recordbargroup = {
    id: 'emv_tester_recordbargroup',  
    class: 'sb_transform',
    type: 'group',
    position: 'sb_end',
    items:
        [
            {id: 'ignore_apdu',    type: 'checkbox', item: 'APDU',     events: {onclick:'onclick_emv_tester_recordbargroup(this, event)'}}, 
            {id: 'ignore_step',    type: 'checkbox', item: 'Step',     events: {onclick:'onclick_emv_tester_recordbargroup(this, event)'}}, 
            {id: 'ignore_trace',   type: 'checkbox', item: 'Trace',    events: {onclick:'onclick_emv_tester_recordbargroup(this, event)'}}, 
            {id: 'ignore_tag',     type: 'checkbox', item: 'Tag',      events: {onclick:'onclick_emv_tester_recordbargroup(this, event)'}}, 
        ]
}

var emv_tester_stepsbargroup = (emv_Steps => {
    let items = [];
    for (var i = 0; i < emv_Steps.length; i++) {
        items.push ({id: i,   type: 'button', class: 'sb_roundbutton EMVStep',   events: {onclick: "onclick_emv_tester_stepsbargroup (this, event)"}, title: 'Step ' + i})
    }
    return {
    id:   'emv_tester_stepsbargroup',  
    position: 'sb_end',
    type: 'group',
    items: items

}})

var emv_tester_recordgroup  = {
    id: 'emv_tester_recordgroup',
    type: 'bar',     
    position: '',
    class: 'sb_transform',    
    items:
        [ 
            {id: 'emv_tester_play_button' ,    item: 'Run',       icon: icon_play,      type:'button',  class: 'sb_button', title: 'replay',  events: {onclick:'onclick_emv_tester_button(this, event)'}},            
            {id: 'emv_tester_start_button' ,   item: 'Start',     icon: icon_backward,    type:'button',  class: 'sb_button', title: 'go to start',  events: {onclick:'onclick_emv_tester_button(this, event)'}},            
   //         {id: 'emv_tester_stop_button' ,    item: 'Stop',    icon: icon_stop,      type:'button',  class: 'sb_sbutton', title: 'stop',  events: {onclick:'onclick_emv_tester_button(this, event)'}},            
   //         {id: 'emv_tester_back_button' ,    item: 'Back',    icon: icon_backwardstep,  type:'button',  class: 'sb_sbutton', title: 'step backward',  events: {onclick:'onclick_emv_tester_button(this, event)'}},            
            {id: 'emv_tester_forward_button' , item: 'Forward', icon: icon_forwardstep,   type:'button',  class: 'sb_button', title: 'step Forward',   events: {onclick:'onclick_emv_tester_button(this, event)'}},            
  //         {id: 'emv_tester_pause_button' ,   item: 'Pause',   icon: icon_pause,     type:'button',  class: 'sb_sbutton', title: 'pause',  events: {onclick:'onclick_emv_tester_button(this, event)'}},            
            emv_tester_stepsbargroup(emv_Steps),
            emv_tester_recordbargroup,  
        ]    
}

var emv_tester_headerpanel = {
    id: 'emv_tester_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'EMV Tester',  class: 'sb_sidebarheadertitle'},      
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

//-------------------------------------------------------------------- TESTER CARD INPUT OUTPUT ---------------------------------------------------------------

var emv_tester_cardbuttonbar = {
    id: 'emv_tester_cardbuttonbar',
    type: 'group',         
    class: '',
    items : [
        {id: 'label_card',  item: 'Card Reader', type: 'link',  icon: icon_creditcard, title: 'Card Reader'},
        {id: 'button_card',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_card (this, event)"}, title: 'Card Reader'},
    ]
}

var emv_tester_cardevalbar = ((toggled) =>  {return {
    id: 'emv_tester_cardevalbar',
    type: 'group',     
    position: 'sb_end',
    class: 'sb_transform',    
    items:
        [ 
            {id: 'emv_testercardreset_button',    icon: icon_trash,   type:'button',  title: 'Clear Console',  events: {onclick:'onclick_emv_resetcardinput(this, event)'}},            
        ]    
}})

var emv_tester_cardbar  = ((toggled) =>  {return {

    
    id: 'emv_tester_cardbar', 
    type: 'bar',    
    items:
     [
        emv_tester_cardbuttonbar,
        emv_tester_cardevalbar(toggled),    
        emv_testerpanel_buttongroup(toggled)                 
      ]
}})

var emv_card_input = {
    id: 'emv_card_input',
    type: 'html',
    class: 'sb_panel sb_main sb_top sb_top', 
}

var emv_tester_cardpanel  = ((toggled) =>  {return {
    id: 'emv_tester_cardpanel',
    type: 'panel',
    class: 'sb_panel sb_column' + (toggled ? ' toggled' : ''),
    items:[
        emv_tester_cardbar(toggled),
        emv_card_input,
    ],
    catchresize: true,
    resizefunction: "cardinputresize()"        
}})


//-------------------------------------------------------------------- TESTER TERMINAL INPUT OUTPUT --------------------------------------------------------------

var emv_tester_terminalbuttonbar = {
    id: 'emv_tester_terminalbuttonbar',
    type: 'group',         
    class: '',
    items : [
        {id: 'label_terminal',  item: 'EMV Terminal', type: 'link',  icon: icon_terminal, title: 'EMV Terminal'},
        {id: 'button_terminal',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_terminal_card (this, event)"}, title: 'EMV Terminal'},
    ]
}

var emv_tester_terminalevalbar = ((toggled) =>  {return {
    id: 'emv_tester_terminalevalbar',
    type: 'group',     
    position: 'sb_end',
    class: 'sb_transform',    
    items:
        [ 
            {id: 'emv_testerterminalreset_button',    icon: icon_trash,   type:'button',  title: 'Clear Console',  events: {onclick:'onclick_emv_resetterminalinput(this, event)'}},            
        ]    
}})

var emv_tester_terminalbar = ((toggled) =>  {return {
    id: 'emv_tester_terminalbar', 
    type: 'bar',    
    items:
     [
        emv_tester_terminalbuttonbar,
        emv_tester_terminalevalbar(toggled),    
        emv_testerpanel_buttongroup(toggled)                 
      ]
}})

var emv_terminal_input = {
    id: 'emv_terminal_input',
    type: 'html',
    class: 'sb_panel sb_main', 
}

var emv_tester_terminalpanel = ((toggled) =>  {return {
    id: 'emv_tester_terminalpanel',
    type: 'panel',
    class: 'sb_panel sb_column' + (toggled ? ' toggled' : ''),
    items:[
        emv_tester_terminalbar(toggled),
        emv_terminal_input,
    ],
    catchresize: true,
    resizefunction: "terminalinputresize()"    
}})

//-------------------------------------------------------------------------EMV TESTER MAIN PANEL ------------------------------------------------------------------------

var emv_testerleft_panel = {
    id : 'emv_testerleft_panel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items: [
        emv_presentation_panel,        
        emv_tester_recordgroup,          

    ],
}

var emv_testerright_panel = {
    id : 'emv_testerright_panel',
    type: 'panel',
    class: 'sb_column sb_main',
    items: [
        emv_apdupanel(true),        
        {id: '',  type:'drag', direction:'horizontal', dragid: 'emv_transactiontagspanel'},            
        emv_transactiontagspanel
    ],    
    
}

//-------------------------------------------------------------------- TESTER SIDEBAR PANEL --------------------------------------------------------------

var emv_tester_sidepanel = {
    id: 'emv_tester_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items:[
        emv_tester_headerpanel,         
        emv_tester_cardpanel(true),
//        {id: '',  type:'drag', direction:'horizontal', dragid: 'emv_tester_cardpanel'},            
        emv_tester_terminalpanel(true),   
//        {id: '',  type:'drag', direction:'horizontal', dragid: 'emv_testerright_panel'},            
//        emv_testerright_panel        
        emv_apdupanel(true),        
        emv_transactiontagspanel(true)        
    ],
}

//---------------------------------------------------------------------EMV MAIN PANEL --------------------------------------------------------------------

var emv_tester_main = {
    id: "emv_tester_main",
    type: "panel",
    class: "sb_main sb_panel sb_row",
    events: { ondragover: "allowDrop(event)", ondrop: "ondrop_mainpage(event)" },    
    items: [
        emv_testerleft_panel,
  //      {id: '', type:'drag', direction:'vertical', dragid: 'emv_testerright_panel'},             
//  //      emv_testerright_panel,
    //    emv_apdupanel(true),        
    ]
}
