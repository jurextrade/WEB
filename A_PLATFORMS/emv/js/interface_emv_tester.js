//--------------------------------------------------------------------- SELECTED APPLICATION TERMINAL TVR TSI ... PANEL  --------------------------------------------------------------------

var emv_TSIPanel = emv_bytepanel('TSI', '9B',   emv_TSI, {editable:false})
var emv_TVRPanel = emv_bytepanel('TVR', '95',   emv_TVR, {editable:false})

var emv_TACDenialPanel = emv_bytepanel('TAC_Denial', 'DF57',   emv_TVR, {editable:false})
var emv_TACOnlinePanel = emv_bytepanel('TAC_Online', 'DF58',   emv_TVR, {editable:false})
var emv_TACDefaultPanel = emv_bytepanel('TAC_Default', 'DF56', emv_TVR, {editable:false})


var emv_TCPanel  = emv_bytepanel('TC',  '9F33', emv_TC, {editable:false})               //Terminal capabilities editable
var emv_ATCPanel = emv_bytepanel('ATC', '9F40', emv_ATC, {editable:false})              //Additional terminal capabilities editable
var emv_TTPanel  = emv_ttpanel('TT', {editable:false});                                 //Terminal Type
var emv_TTQPanel = emv_bytepanel('TTQ', '9F66', emv_TTQ, {editable:false})              //TTQ

var emv_AUCPanel = emv_bytepanel('AUC', '9F07', emv_AUC, {editable:false})
var emv_AIPPanel = emv_bytepanel('AIP', '82',   emv_AIP, {editable:false})

var emv_IACDenialPanel = emv_bytepanel('IAC_Denial', '9F0E',   emv_TVR, {editable:false})
var emv_IACOnlinePanel = emv_bytepanel('IAC_Online', '9F0F',   emv_TVR, {editable:false})
var emv_IACDefaultPanel = emv_bytepanel('IAC_Default', '9F0D', emv_TVR, {editable:false})

var emv_CTQPanel = emv_bytepanel('CTQ', '9F6C', emv_CTQ, {editable:false})

var emv_CIDPanel = emv_bytepanel('CID', '9F27', emv_CID, {editable:false, bytetable: emv_cidbytetable})

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
        let elt = {
            id: 'step_' + step.id ,
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
    style: 'border-top: 1px solid var(--theme-button-border-color)',    
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
            {id: 'inspect_button',  type:'link', icon: icon_eye,  style: (hidden ? 'display:none' : 'display:flex'), events: {onclick: "onclick_apdu_tree_inspect (this, event)"},  title: 'Inspect Value'},      
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

var emv_apdu_roottree = {
    id: 'emv_apdu_roottree',       
    type: 'tree',       
    class: 'treenode emv_apdutreeclass',
    item: 'APDU',
    attributes:{nodename: 'RootTag'},   
    arrow: true,
    closed: false,
    items:[
    ]
} 

var emv_apdutreepanel = {
    id: 'emv_apdutreepanel',
    type: 'panel',            
    class:'sb_panel',
    items : [
        emv_apdu_roottree,
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
    style: 'border-top: 1px solid var(--theme-button-border-color)',    
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
        emv_apdutreepanel,
    ]
}})

//--------------------------------------------------------------------------------------------------------------------------------------------------------

var emv_tester_commandgroup = {
    id: 'emv_tester_commandgroup',  
    class: 'sb_transform',
    type: 'group',
   // style: 'display:none',
    items:
        [    
            {id: 'emv_tester_upload_transaction',  icon: icon_download,  class: 'sb_right', item : 'Load Transaction', type:'link',  title: 'Load transaction',  events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},  
            {id: 'emv_tester_play_button' ,    /*item: 'Run',*/       icon: icon_play,      type:'button',  class: 'sb_sbutton', title: 'replay',  events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},            
            {id: 'emv_tester_start_button' ,   /*item: 'Start',*/     icon: icon_backward,    type:'button',  class: 'sb_sbutton', title: 'go to start',  events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},            
            {id: 'emv_tester_forward_button' , /*item: 'Forward',*/ icon: icon_forwardstep,   type:'button',  class: 'sb_sbutton', title: 'step Forward',   events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},            

//         {id: 'emv_tester_stop_button' ,    item: 'Stop',    icon: icon_stop,      type:'button',  class: 'sb_sbutton', title: 'stop',  events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},            
//         {id: 'emv_tester_back_button' ,    item: 'Back',    icon: icon_backwardstep,  type:'button',  class: 'sb_sbutton', title: 'step backward',  events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},            
//         {id: 'emv_tester_pause_button' ,   item: 'Pause',   icon: icon_pause,     type:'button',  class: 'sb_sbutton', title: 'pause',  events: {onclick:'onclick_emv_tester_commandgroup(this, event)'}},                        
    ]    
}

var emv_tester_stepsgroup = (steps => {
    let items = [];
    for (var i = 0; i < steps.length; i++) {
        items.push ({id: 'step_' + i,   type: 'button', class: 'sb_roundbutton EMVStep',   events: {onclick: "onclick_emv_tester_stepsgroup (this, event)"}, title: 'Step ' + i})
    }
    return {
    id:   'emv_tester_stepsgroup',  
    position: 'sb_distance',
    type: 'group',
    items: items

}})

var emv_tester_filtergroup = {
    id: 'emv_tester_filtergroup',  
    class: 'sb_transform',
    type: 'group',
    position: 'sb_end',
    items:
        [
            {id: 'ignore_apdu',    type: 'checkbox', item: 'APDU',     events: {onclick:'onclick_emv_tester_filtergroup(this, event)'}}, 
            {id: 'ignore_step',    type: 'checkbox', item: 'Step',     events: {onclick:'onclick_emv_tester_filtergroup(this, event)'}}, 
            {id: 'ignore_trace',   type: 'checkbox', item: 'Trace',    events: {onclick:'onclick_emv_tester_filtergroup(this, event)'}}, 
            {id: 'ignore_tag',     type: 'checkbox', item: 'Tag',      events: {onclick:'onclick_emv_tester_filtergroup(this, event)'}}, 
            {id: 'ignore_tvr',     type: 'checkbox', item: 'TVR',      events: {onclick:'onclick_emv_tester_filtergroup(this, event)'}}, 
            {id: 'ignore_tsi',     type: 'checkbox', item: 'TSI',      events: {onclick:'onclick_emv_tester_filtergroup(this, event)'}}, 
        ]
}

var emv_tester_recordgroup  = {
    id: 'emv_tester_recordgroup',
    type: 'bar',     
    position: '',
    class: 'sb_transform',    
    items:
        [ 
            emv_tester_commandgroup,
            emv_tester_stepsgroup(emv_Steps),
            emv_tester_filtergroup,  
        ]    
}



var emv_tester_headerbar = {
    id: 'emv_tester_headerbar',
    type: 'bar',
    class: 'sb_sidebarheader ', 
    style:'z-index:10',        
    items : 
    [
        {id: '',                type: 'link',    item: 'EMV Tester',  class: 'sb_sidebarheadertitle'},     
        {id: 'label_router',    item: 'Router', type: 'link',  icon: icon_connection, events: {onclick: "onclick_button_server  (this, event)"}, title: 'ROUTER'},
        {id: 'button_router',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_server  (this, event)"}, title: 'ROUTER'},
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}




var emv_tester_headerpanel = {
    id: 'emv_tester_headerpanel',
    type : 'panel',
    class: 'sb_column',  
    style:'position:relative',  
    items : 
    [
        emv_tester_headerbar,
        modalserverpanel('emv'),
    ]
}

//-------------------------------------------------------------------- TESTER CARD INPUT OUTPUT ---------------------------------------------------------------

var emv_tester_cardbuttonbar = {
    id: 'emv_tester_cardbuttonbar',
    type: 'group',         
    class: '',
    events: {onclick: 'onclick_emv_tester_reader(this, event)'},    
    items : [
        {id: 'label_card',  item: 'Card Reader', type: 'link',  icon: icon_creditcard, title: 'Card Reader'},
        {id: 'button_card',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_card (this, event)"}, title: 'Card Reader'},
    ]
}

var emv_tester_cardvalbar = ((toggled) =>  {return {
    id: 'emv_tester_cardvalbar',
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
    style: 'border-top: 1px solid var(--theme-button-border-color)',
    items:
     [
        emv_tester_cardbuttonbar,
        emv_tester_cardvalbar(toggled),    
        emv_testerpanel_buttongroup(toggled)                 
      ]
}})

var emv_testercardinput = {
    id: 'emv_testercardinput',
    type: 'html',
    class: 'sb_panel sb_main sb_top sb_top', 
}

var emv_tester_cardpanel  = ((toggled) =>  {return {
    id: 'emv_tester_cardpanel',
    type: 'panel',
    class: 'sb_panel sb_column' + (toggled ? ' toggled' : ''),
    items:[
        emv_tester_cardbar(toggled),
        emv_testercardinput,
    ],
    catchresize: true,
    resizefunction: "cardinputresize()"        
}})


//-------------------------------------------------------------------- TESTER TERMINAL INPUT OUTPUT --------------------------------------------------------------

var emv_tester_terminalbuttonbar = {
    id: 'emv_tester_terminalbuttonbar',
    type: 'group',         

    events: {onclick: 'onclick_emv_tester_terminal(this, event)'},
    items : [
        {id: 'label_terminal',  item: 'EMV Server', type: 'link',  icon: icon_terminal, title: 'EMV Terminal'},
        {id: 'button_terminal',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_terminal_card (this, event)"}, title: 'EMV Terminal'},
    ]
}

var emv_tester_terminalvalbar = ((toggled) =>  {return {
    id: 'emv_tester_terminalvalbar',
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
    style: 'border-top: 1px solid var(--theme-button-border-color)',    
    items:
     [
        emv_tester_terminalbuttonbar,
        emv_tester_terminalvalbar(toggled),    
        emv_testerpanel_buttongroup(toggled)                 
      ]
}})

var emv_tester_terminalinput = {
    id: 'emv_tester_terminalinput',
    type: 'html',
    class: 'sb_panel sb_main', 
}

var emv_tester_terminalpanel = ((toggled) =>  {return {
    id: 'emv_tester_terminalpanel',
    type: 'panel',
    class: 'sb_panel sb_column' + (toggled ? ' toggled' : ''),
    items:[
        emv_tester_terminalbar(toggled),
        emv_tester_terminalinput,
    ],
    catchresize: true,
    resizefunction: "terminalinputresize()"    
}})



//-------------------------------------------------------------------- TESTER SIDEBAR PANEL --------------------------------------------------------------

var emv_tester_sidepanel = {
    id: 'emv_tester_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items:[        emv_tester_recordgroup,                 
        {
            id: 'emv_tester_panel',
            type: 'panel',
            class: 'sb_panel sb_main sb_column',
            items:[        
                emv_tester_cardpanel(true),
                emv_tester_terminalpanel(true),   
                emv_apdupanel(true),        
                emv_transactiontagspanel(true)        
            ]
        }
    ],
}
    //        {id: '',  type:'drag', direction:'horizontal', dragid: 'emv_testerright_panel'},            
    //        emv_testerright_panel        
    //        {id: '',  type:'drag', direction:'horizontal', dragid: 'emv_tester_cardpanel'},            



var emv_tester_terminalinfo = {
    id: 'emv_tester_terminalinfo', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_TTPanel,        
        emv_TCPanel,
        emv_ATCPanel,
        emv_TTQPanel,
    ] 
}

var emv_tester_tacpanel = {
    id: "emv_tester_tacpanel",
    type: "panel",
    class: "sb_column",
     items: [
        emv_TACDenialPanel,
        emv_TACOnlinePanel,
        emv_TACDefaultPanel,            
    ]
}

var emv_tester_iacpanel = {
    id: "emv_tester_iacpanel",
    type: "panel",
    class: "sb_column",
    style: "",    
    items: [
        emv_IACDenialPanel,
        emv_IACOnlinePanel,
        emv_IACDefaultPanel,           
    ]
}

var emv_tester_denialpanel = {
    id: "emv_tester_denialpanel",
    type: "panel",
    class: "sb_column",
    style: "",    
    items: [
        emv_IACDenialPanel,
        emv_TACDenialPanel,
    ]
}

var emv_tester_onlinepanel = {
    id: "emv_tester_onlinepanel",
    type: "panel",
    class: "sb_column",
    style: "",    
    items: [
        emv_IACOnlinePanel,
        emv_TACOnlinePanel,
    ]
}

var emv_tester_defaultpanel = {
    id: "emv_tester_defaultpanel",
    type: "panel",
    class: "sb_column",
    style: "",    
    items: [
        emv_IACDefaultPanel,
        emv_TACDefaultPanel,
    ]
}


var emv_tester_cardbyteinfo = {
    id: "emv_tester_cardbyteinfo",
    type: "panel",
    class: "sb_column",
    style: "",    
    items: [
        emv_AIPPanel, 
        emv_AUCPanel, 
        emv_CIDPanel,        
    ]
}

var emv_tester_cardbyteinfobar = {
    id: 'emv_tester_cardbyteinfobar', 
    type: 'bar', 
    items: [
        {
            position: '',
            id: 'emv_tester_carbar_maingroup', 
            type: 'group',                    
            direction: 'row',
            toggle : false,
            items : 
            [
                {id: 'emv_tester_cardbar_description',  type: 'label',    style: 'margin-right:20px', item: "CURRENT CARD",  class: ' ', title: 'Selected Card'},
            ]
        } 
    ] 
}
    
var emv_tester_terminalbyteinfobar = {
    id: 'emv_tester_terminalbyteinfobar', 
    type: 'bar', 
    items: [
        {
            position: '',
            id: 'emv_tester_terminalbar_maingroup', 
            type: 'group',                    
            direction: 'row',
            toggle : false,
            items : 
            [
                {id: 'emv_tester_terminalbar_description',  type: 'label',    style: 'margin-right:20px', item: "CURRENT APPLICATION",  class: '', title: 'Selected Application'},
            ]
        } 
    ] 
}
 
var emv_tester_terminalbyteinfo = {
    id: "emv_tester_terminalbyteinfo",
    type: "panel",
    class: "sb_column",
    items: [
        emv_TVRPanel,
        emv_TSIPanel, 
    ]
}



var emv_tester_sidebarpanel_terminal = {
    id: "emv_tester_sidebarpanel_terminal",
    type: "panel",
    class: "sb_panel sb_column tester_sidebar",
    style: "overflow:auto",   
    items: [
     //   emv_tester_terminalbyteinfobar,        
        emv_tester_terminalbyteinfo,
        emv_tester_terminalinfo        
    ]
}

var emv_tester_sidebarpanel_card = {
    id: "emv_tester_sidebarpanel_card",
    type: "panel",
    class: "sb_panel sb_column tester_sidebar",
    style: "overflow:auto",    
    items: [
     //   emv_tester_cardbyteinfobar,        
        emv_tester_cardbyteinfo,

    ]
}    

var emv_tester_sidebarpanel_actioncode = {
    id : 'emv_tester_sidebarpanel_actioncode',
    type: 'panel',
    class: 'sb_panel sb_column tester_sidebar',
    style: "overflow:auto",   
    items: [
//        emv_tester_iacpanel,
//        emv_tester_tacpanel,          
        emv_tester_denialpanel,          
        emv_tester_onlinepanel,     
        emv_tester_defaultpanel,     
    ],
}


var emv_tester_sidebarheader = {
    id: 'emv_tester_sidebarheader',
    type: 'bar',
    class: 'sb_rightsidebarheader ',    
    items : 
    [
        {id: '',                  type: 'link',  item: 'Selected Application',  class: 'sb_fs-12 sb_sidebarheadertitle'},                           
//        {id: 'right_sidebarsave', type: 'button', item:'Save',  class: 'sb_none',  icon:  sb_icons['icon_save'], events: {onclick: "onclick_right_sidebarsave(this, event)"}, title: 'Save Configuration'},                 
        {id: 'right_sidebarpin',  type: 'link',   toggle: true, class: 'sb_rightsidebarpin',   icon:  sb_icons['icon_pin'],  events: {onclick: "onclick_tright_sidebarpin(this, event)"}, title: 'Pin Window'},                 
    ]
}

var emv_tester_sidebarpanel  = {
    id: 'emv_tester_sidebarpanel',
    type: 'panel',
    class: 'sb_panel emv_tester_sidebarpanel sb_left',     
    items : 
    [
        emv_tester_sidebarheader,        
        emv_tester_sidebarpanel_terminal,                 
        emv_tester_sidebarpanel_card,
        emv_tester_sidebarpanel_actioncode,
      //  {id: 'rightsidebarpanel_solution',         type: 'panel',    class: 'sb_panel sb_main', items: [solutionpanel]},
    ]
}

var emv_tester_sidebar = {
    id:'emv_tester_sidebar',
    type: 'bar',
    class: 'sb_sidebarmenu sb_left',  
    direction: 'column',    
    items : 
    [
        {
            id: 'emv_tester_rightbar_maingroup',
            type: 'group',                    
            direction: 'column',
            items : [
                
                {id: 'emv_tester_sidebar_terminal',   type: 'link', icon:  sb_icons['icon_terminal'], events: {onclick: "onclick_rightsidebarmenu(this.id)"}, title: 'Selected Terminal'},                 
                {id: 'emv_tester_sidebar_card',       type: 'link', icon:  sb_icons['icon_card'],     events: {onclick: "onclick_rightsidebarmenu(this.id)"}, title: 'Current Card'},                 
                {id: 'emv_tester_sidebar_actioncode', type: 'link', icon:  sb_icons['icon_settings'], events: {onclick: "onclick_rightsidebarmenu(this.id)"}, title: 'Action Codes'},                 
            ]
        }, 
   ]
}

//-------------------------------------------------------------------------EMV TESTER MAIN PANEL ------------------------------------------------------------------------

var emv_tester_toprightpanel = {
    id : 'emv_tester_toprightpanel',
    type: 'panel',
    class: 'sb_panel sb_row sb_left',
    items: [
        emv_tester_sidebarpanel_terminal,           
        emv_tester_sidebarpanel_card,  
    ],
}


var emv_tester_leftpanel = {
    id : 'emv_tester_leftpanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    style:"flex:1",
    items: [
        emv_presentation_panel,        
    ],
}


var emv_tester_rightpanel = {
    id : 'emv_tester_rightpanel',
    type: 'panel',
    class: 'sb_column sb_main',
    style: "width:360px; flex:none",
    items: [
        emv_tester_toprightpanel
    ],    
    
}
    
var emv_tester_bottompanel = {
    id:'emv_tester_bottompanel',
    type: 'tabs',    
    label: 'emvtabs',   

    tabevents: {ondblclick: "ondblclick_testertabs(this, event)"}, 
    items:
        [ 
           // {id: 'tester-tab-terminal',       item: 'Terminal',   type: 'link',  icon: icon_terminal,        events: {onclick: "onclick_testertabs(this, event)"}, items: [emv_tester_sidebarpanel_terminal],  title: ''},           
           // {id: 'tester-tab-card',           item: 'Card',       type: 'link',  icon: icon_card,         events: {onclick: "onclick_testertabs(this, event)"}, items: [emv_tester_sidebarpanel_card],  title: ''},           
           // {id: 'tester-tab-actioncode',     item: 'Action Code /Terminal-Card',  type: 'link',  icon: icon_settings,        events: {onclick: "onclick_testertabs(this, event)"}, items: [emv_tester_sidebarpanel_actioncode],  title: ''},           
        ],
    groupitems:
    [    
        {
            id: 'emvactions',    
            type: 'group',            
            class:'sb_controls',               
            items:
                [  
                    {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen sb_none',     events: {onclick: "onclick_controlstesterbottompanel (this)"}, title: ''}, 
                    {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_controlstesterbottompanel (this)"}, title: ''}, 
                    {id: 'slide',         type:'control',  class : 'box-btn-slide rotate-180' ,      events: {onclick: "onclick_controlstesterbottompanel (this)"}, title: ''},  
                ]
        }        
    ],
    bottomheight: 270,   
} 



//---------------------------------------------------------------------EMV MAIN PANEL --------------------------------------------------------------------

var emv_tester_maintop = {
    id: 'emv_tester_maintop', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_row',
    items:[
        emv_tester_leftpanel,
/*        {id: '', type:'drag', direction:'vertical', dragid: 'emv_tester_rightpanel'},             
        emv_tester_rightpanel, */
        emv_tester_sidebarpanel,        
        emv_tester_sidebar,        
    ]
}

var emv_tester_main = {
    id: "emv_tester_main",
    type: "panel",
    class: "sb_main sb_panel sb_column",
    events: { ondragover: "allowDrop(event)", ondrop: "ondrop_mainpage(event)" },  

    items: [
        emv_tester_maintop,
//       {id: '',  class: '', type:'drag', direction:'horizontal', dragid: 'emv_tester_bottompanel'},             
//        emv_tester_bottompanel
    ]
}
