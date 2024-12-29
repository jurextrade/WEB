
var emv_treenodetagitem = ((tag, value, index) => {return {
    id: 'emv_' + tag + '_' + index, 
    type: 'bar', 
    class: 'sb_panel',
    items: [
        {id: 'emv_' + tag + '_name',         type: 'label',    style: 'min-width:220px', item: gettagname (tag),  class: '', title: 'Tag: ' + tag},
        {id: 'emv_' + tag + '_value',        type: 'text',      icon: '', value: value, disabled: true,  style: 'min-width:150px', attributes: {placeholder: ""}, events: {onchange: "onchange_emv_treenode_input(this)"}, title: 'Tag Value'},  
        {id: 'emv_' + tag + '_tag',          type: 'label',    class: 'emv_button_show', item: tag, events :{onmousedown: "emv_apdu_searchtag('" + tag + "', event)"} },                 
        emv_tree_update,
    ] 
}   
})


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

var emv_AIDPanel = emv_aidpanel ('emv_AIDPanel', {withbar: true});
var emv_AVNPanel = emv_avnpanel ('emv_AVNPanel', {withbar: true});

var emv_TACDenialPanel  = emv_bytepanel('TAC_Denial', 'DF57',   emv_TVR, {withbar:false})
var emv_TACOnlinePanel  = emv_bytepanel('TAC_Online', 'DF58',   emv_TVR, {withbar:false})
var emv_TACDefaultPanel = emv_bytepanel('TAC_Default', 'DF56', emv_TVR,  {withbar:false})

var emv_application_section = {
    id: 'emv_application_section', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_AIPanel,
        emv_AVNPanel,
        emv_TACDenialPanel,
        emv_TACOnlinePanel,
        emv_TACDefaultPanel,    
    ] 
}

//------------------------------------------------------------ TERMINAL PANEL ----------------------------------------------------------

var emv_TCPanel  = emv_bytepanel('TC',  '9F33', emv_TC)              //Terminal capabilities editable
var emv_ATCPanel = emv_bytepanel('ATC', '9F40', emv_ATC)              //Additional terminal capabilities editable
var emv_TTPanel  = emv_ttpanel('TT');                                               //Terminal Type
var emv_TTQPanel = emv_bytepanel('TTQ', '9F66', emv_TTQ)              //TTQ
var emv_TSNPanel = emv_snpanel ('emv_TSNPanel')
var emv_TCCPanel = emv_ccpanel ('emv_TCCPanel')   

var emv_terminals_section = {
    id: 'emv_terminals_section', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_TSNPanel,             
        emv_TCCPanel,   
        emv_TTPanel,        
        emv_TCPanel,
        emv_ATCPanel,
        emv_TTQPanel,
    ] 
}

//------------------------------------------------------------ ACCEPETOR/MERCHANT PANEL ----------------------------------------------------------

var emv_acceptor_section = {
    id: 'emv_acceptor_section', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_MCCPanel,
        emv_MIPanel, 
        emv_MNLPanel,
        emv_TIPanel, 
    ] 
}

//------------------------------------------------------------ ACQUIRER PANEL ----------------------------------------------------------

var emv_acquirer_section = {
    id: 'emv_acquirer_section', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_AIPanel,
    ] 
}

//------------------------------------------------------------ PROJECT PANEL ----------------------------------------------------------

var emv_tree_projects = {
    id: 'emv_tree_projects',       
    type: 'tree',       
    class:'nav-pills',
    item: 'Projects',
    icon: icon_project,
    items:[]
} 

var emv_projectsbar = {
    id : 'emv_projectsbar', 
    type: 'bar',
    class: 'sb_main',
    direction: 'row',     
    items: 
        [ 
            { 
                position: 'me-auto',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items: 
                    [ 
                        {id: 'emv_projectselect',    type: 'select',   title: 'Select Project',      value: '--Select Project--', menu: [{text: '--Select Project--'}], events: {onchange: 'onchange_emv_projectselect (this, event)'}},
                    ]
            },

            { 
                position: 'sb_end',
                class: 'sb_transform',                
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'emv_projectrename',    type:'link',       icon: icon_rename,           events: {onclick: "onclick_emv_projectrename()"},  title: 'Rename Current Project'},  
                        {id: 'emv_projectremove',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_emv_projectremove()"},  title: 'Delete Current Project'},             
                        {id: 'emv_projectcreate',    type:'link',       icon: icon_new,              events: {onclick: "onclick_emv_projectcreate()"},  title: 'Create New Project'},      
                        {id: 'emv_projectclose',     type:'link', icon: icon_close,    class:'sb_close',  events: {onclick: "onclick_emv_projectclose()"}, title: 'Close Current Project'}
                    ]
            }
            
        ]
}   

var emv_projectsidepanel = {
    id: 'emv_projectsidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[emv_tree_projects]
}

var emv_boxprojectspanel = {
    id: 'emv_boxprojectspanel',
    type: 'box',
    closed: false, 
    header: {item: 'Projects', items: [emv_projectsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.L_CONTROL} },  
    items: [emv_projectsidepanel]    
}

//--------------------------------------------------------------------- EMV TERMINAL MANAGER PANEL  --------------------------------------------------------------------

var emv_tree_help = {
    id: 'emv_tree_help',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',      
    items:
        [
            {id: 'help_entity',     type:'link',       icon: icon_question,            events: {onclick: "onclick_emv_tree_help (this, event)"},  title: 'Explanation'},      
        ]
}

var emv_tree_add = {
    id: 'emv_tree_add',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',      
    items:
        [
            {id: 'add_entity',     type:'link',       icon: icon_new,              events: {onclick: "onclick_emv_tree_add (this, event)"},  title: 'Add'},      
        ]
}

var emv_tree_update = {
    id: 'emv_tree_update',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',                        
    items: 
        [ 
            {id: 'tree_delete_entity', type:'link', icon: icon_remove,  style: "display:none", events: {onclick: "onclick_emv_treenode_delete(this, event)"}, title: 'Delete'},             
            {id: 'tree_update_entity', type:'link', icon: icon_save,    style: "color: green; display:none", events: {onclick: "onclick_emv_treenode_update(this, event)"}, title: 'Save'},  
            {id: 'tree_cancel_entity', type:'link', icon: icon_cancel,  style: "display:none", events: {onclick: "onclick_emv_treenode_cancel(this, event)"}, title: 'Cancel'},  
            {id: 'tree_modify_entity', type:'link', icon: icon_eye,     style: "",             events: {onclick: "onclick_emv_treenode_modify(this, event)"}, title: 'Update'},  
        ]
}



const emv_default_node_events = {
    onclick:        'onclick_emv_treenode(this, event)',  
    oncontextmenu:  'oncontextmenu_emv_treenode(this, event)',
    ondragstart:    'ondragstart_emv_treenode(this, event)',
}




const   emv_tree_applications  = {id: 'emv_treenode-applications', type: 'tree', class: 'treenode', closed: true, rootitem: emv_tree_add,     items:[], item: 'Applications', arrow: true,  icon:  icon_application,title: 'Applications',           attributes: {nodename: 'Applications'},        events: emv_default_node_events};
const   emv_tree_terminals     = {id: 'emv_treenode-terminals',    type: 'tree', class: 'treenode', closed: true, rootitem: emv_tree_help,    items:[], item: 'Terminals',    arrow: true, icon:  icon_terminal,   title: 'Terminal',              attributes: {tag: 'Terminal'},            events: emv_default_node_events};   
const   emv_tree_acceptor      = {id: 'emv_treenode-acceptor',     type: 'tree', class: 'treenode', closed: true, rootitem: emv_tree_help,    items:[emv_acceptor_section], item: 'Acceptor',     arrow: false, icon:  icon_site,       title: 'Acceptor',                  attributes: {tag: 'Acceptor'},            events: emv_default_node_events};   
const   emv_tree_acquirer      = {id: 'emv_treenode-acquirer',     type: 'tree', class: 'treenode', closed: true, rootitem: emv_tree_help,    items:[emv_acquirer_section], item: 'Acquirer',     arrow: false, icon:  icon_site,       title: 'Acquirer',                  attributes: {tag: 'Acquirer'},            events: emv_default_node_events};   

var emv_tree_manager = {
    id: 'treenode-emv_projectmanager-0',       
    type: 'tree',       
    class: 'treenode',
    item: 'Project Name',
    attributes:{nodename: 'Manager'},   
    arrow: true,
    icon: icon_manager,
    items:[
        emv_tree_applications,                
        emv_tree_terminals,
        emv_tree_acceptor,
        emv_tree_acquirer,
    ]
} 

var emv_managerbar = {
    id : 'emv_managerbar', 
    type: 'bar',            
    direction: 'row',     
    items: 
        [              
            { 
                position: 'me-auto',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items:
                    [ 
                    ]
            },
            { 
                position: 'sb_end',
                class: '',
                id:'',
                type: 'group',                        
                items:
                    [ 
                    ]
            }
        ]
}

var emv_managersidepanel = {
    id: 'emv_managersidepanel',
    type: 'panel',
    class: 'sb_panel sb_none',
    items:[emv_tree_manager]
}

var emv_boxmanagerpanel = {
    id: 'emv_boxmanagerpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Manager', items: [emv_managerbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [emv_managersidepanel]    
}

var emv_projects_headerpanel = {
    id: 'emv_projects_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'TERMINALS EXPLORER',  class: 'sb_sidebarheadertitle'},                           
        {id: 'label_router',    item: 'Router', type: 'link',  icon: icon_connection, title: 'ROUTER'},
        {id: 'button_router',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_router (this, event)"}, title: 'ROUTER'},
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var emv_projects_sidepanel = {
    id: 'emv_projects_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items: [
        emv_boxprojectspanel,  
        emv_boxmanagerpanel,      
    ]
}