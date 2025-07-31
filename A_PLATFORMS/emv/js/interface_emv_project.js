
var emv_treenodetagitem = ((tag, value, index, update) => {
    let tagitem = {
        id: 'emv_' + tag + '_' + index, 
        type: 'bar', 
        class: 'sb_panel',
        items: [
                {id: 'emv_' + tag + '_name',         type: 'label',    style: 'min-width:220px', item: gettagname (tag),  class: '', title: 'Tag: ' + tag},
                {id: 'emv_' + tag + '_value',        type: 'text',      icon: '', value: value, disabled: true,  style: 'min-width:150px', attributes: {placeholder: ""}, events: {onchange: "onchange_emv_treenode_value(this)"}, title: 'Tag Value'},  
                {id: 'emv_' + tag + '_tag',          type: 'label',    class: 'emv_button_show', item: tag, events :{onmousedown: "emv_searchtag('" + tag + "', event)",onclick: "event.stopPropagation()", onmouseup: " $('#overlay_tag').remove(); "

                } },                 
        ] 
    }
    if (update) { 
        tagitem.items.push (emv_tree_update)
    }
    return tagitem
}
)

var emv_treenodenameitem = ((name, value, index, update) => {
    let item = {
        id: 'emv_notag_' + index, 
        type: 'bar', 
        class: 'sb_panel',
        items: [
                {id: 'emv_' + 'notag' + '_name',     type: 'label',    style: 'min-width:220px', item : name,  class: '', title:name},
                {id: 'emv_' + 'notag' + '_value',        type: 'text',      icon: '', value: value, disabled: true,  style: 'min-width:150px', attributes: {placeholder: ""}, events: {onchange: "onchange_emv_treenode_value(this)"}, title: 'Tag Value'},  
        ] 
    }
    if (update) { 
        item.items.push (emv_tree_update)
    }
    return item
}
)

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

var emv_TCPanel1  = emv_bytepanel('TC',  '9F33', emv_TC)               //Terminal capabilities editable
var emv_ATCPanel1 = emv_bytepanel('ATC', '9F40', emv_ATC)              //Additional terminal capabilities editable
var emv_TTPanel1  = emv_ttpanel('TT');                                 //Terminal Type
var emv_TTQPanel1 = emv_bytepanel('TTQ', '9F66', emv_TTQ)              //TTQ
var emv_TSNPanel1 = emv_snpanel ('emv_TSNPanel')
var emv_TCCPanel1 = emv_ccpanel ('emv_TCCPanel')   

var emv_terminals_section = {
    id: 'emv_terminals_section', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_TSNPanel1,             
        emv_TCCPanel1,   
        emv_TTPanel1,        
        emv_TCPanel1,
        emv_ATCPanel1,
        emv_TTQPanel1,
    ] 
}

//------------------------------------------------------------ ACCEPETOR/MERCHANT PANEL ----------------------------------------------------------
var emv_MCCPanel = emv_mccpanel ('emv_MCCPanel');
var emv_MIPanel =  emv_mipanel ('emv_MIPanel');
var emv_MNLPanel = emv_mnlpanel ('emv_MNLPanel');
var emv_TIPanel =  emv_tipanel ('emv_TIPanel');



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

var emv_AIPanel  = emv_aipanel ('emv_AIPanel', {withbar: true});


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

var emv_tree_addapplication = {
    id: 'emv_tree_addapplication',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',      
    items:
        [
            {id: 'emv_addapplication',     type:'link',       icon: icon_new,              events: {onclick: "onclick_emv_t_addapplication (this, event)"},  title: 'Add'},      
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




const   emv_tree_applications  = {id: 'emv_tree_applications', type: 'tree', class: 'treenode', closed: false, rootitem: emv_tree_addapplication,     items:[], item: 'Applications', arrow: true,  icon:  icon_application,title: 'Applications',           attributes: {nodename: 'Applications'},        events: emv_default_node_events};
const   emv_tree_terminals     = {id: 'emv_tree_terminals',    type: 'tree', class: 'treenode', closed: false, rootitem: emv_tree_help,    items:[], item: 'Terminals',    arrow: true, icon:  icon_terminal,   title: 'Terminal',              attributes: {tag: 'Terminal', nodename: 'Terminals'},            events: emv_default_node_events};   
const   emv_tree_acceptor      = {id: 'emv_tree_acceptor',     type: 'tree', class: 'treenode', closed: false, rootitem: emv_tree_help,    items:[], item: 'Acceptor',     arrow: false, icon:  icon_site,       title: 'Acceptor',                  attributes: {tag: 'Acceptor', nodename: 'Acceptor'},            events: emv_default_node_events};   
const   emv_tree_acquirer      = {id: 'emv_tree_acquirer',     type: 'tree', class: 'treenode', closed: false, rootitem: emv_tree_help,    items:[], item: 'Acquirer',     arrow: false, icon:  icon_site,       title: 'Acquirer',                  attributes: {tag: 'Acquirer', nodename: 'Acquirer'},            events: emv_default_node_events};   


var emv_tree_manager = {
    id: 'treenode-emvmanager-0',       
    type: 'tree',       
    class: 'treenode',
    item: 'Project Name',
    attributes:{nodename: 'Manager:0'},   
    arrow: true,
    style: 'display:none',
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

//------------------------------------------------------------------------------- ACCEPTOR -------------------------------------------------------

var emv_acceptorsidepanel = {
    id: 'emv_acceptorsidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[emv_tree_acceptor]
}

var emv_boxacceptorpanel = {
    id: 'emv_boxacceptorpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Acceptor', items: [], control: {slide: true, closed : true, orientation: sb.R_CONTROL} },  
    items: [emv_acceptorsidepanel]    
}

//------------------------------------------------------------------------------- ACQUIRER -------------------------------------------------------

var emv_acquirersidepanel = {
    id: 'emv_acquirersidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[emv_tree_acquirer]
}

var emv_boxacquirerpanel = {
    id: 'emv_boxacquirerpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Acquirer', items: [], control: {slide: true, closed : true, orientation: sb.R_CONTROL} },  
    items: [emv_acquirersidepanel]    
}

//------------------------------------------------------------------------------- TERMINALS -------------------------------------------------------

var emv_terminalssidepanel = {
    id: 'emv_applicationssidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[emv_tree_terminals]
}

var emv_boxterminalspanel = {
    id: 'emv_boxterminalsspanel',
    type: 'box',
    closed: true, 
    header: {item: 'Terminals', items: [], control: {slide: true, closed : true, orientation: sb.R_CONTROL} },  
    items: [emv_terminalssidepanel]    
}

//------------------------------------------------------------------------------- APPLCIATIONS -------------------------------------------------------

var emv_applicationsbar = {
    id : 'emv_applicationsbar', 
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
                        {id: 'emv_applicationcreate',     type:'link',  icon: icon_new,      events: {onclick: "onclick_ApplicationCreate()"},  title: 'Create New Strategy'},      
                        {id: 'emv_applicationrename',     type:'link',  icon: icon_rename,   events: {onclick: "onclick_ApplicationRename()"}, title: 'Rename Current Strategy'},  
                        {id: 'emv_applicationremove',     type:'link',  icon: icon_remove,   events: {onclick: "onclick_ApplicationDelete()"},  title: 'Delete Current Strategy'}              
                    ]
            },
            { 
                position: 'sb_distance',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'project_strategycompile',    type:'link',  icon: icon_file, style:'color:green',    events: {onclick: "onclick_project_strategycompile(this, event)"},  title: 'Generate MQ4 Expert for the Current Strategy'},      
                    ]
            }
        ]
}

var emv_applicationssidepanel = {
    id: 'emv_applicationssidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[emv_tree_applications]
}

var emv_boxapplicationspanel = {
    id: 'emv_boxapplicationspanel',
    type: 'box',
    closed: true, 
    header: {item: 'Applications', items: [], control: {slide: true, closed : true, orientation: sb.R_CONTROL} },  
    items: [emv_applicationssidepanel]    
}



var emv_projects_headerpanel = {
    id: 'emv_projects_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'TERMINALS EXPLORER',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var emv_projects_sidepanel = {
    id: 'emv_projects_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items: [
        emv_boxprojectspanel,  
        emv_boxapplicationspanel,   
        emv_boxterminalspanel,   
        emv_boxacceptorpanel,   
        emv_boxacquirerpanel,   
    ]
}