
//------------------------------------------------------------ TERMINAL PANEL ----------------------------------------------------------

var emv_TCPanel  = emv_bytepanel('TC',  '9F33', emv_TC,  1, 1)              //Terminal capabilities editable
var emv_ATCPanel = emv_bytepanel('ATC', '9F40', emv_ATC, 1, 1)              //Additional terminal capabilities editable
var emv_TTPanel  = emv_ttpanel('TT', 1);                                    //Terminal Type
var emv_TTQPanel = emv_bytepanel('TTQ', '9F66', emv_TTQ, 1, 1)              //TTQ

var emv_terminal_section = {
    id: 'emv_terminal_section', 
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


//------------------------------------------------------------ APPLICATIONANEL ----------------------------------------------------------

var emv_TACDenialPanel = emv_bytepanel('TAC_Denial', 'DF57',   emv_TVR, 1, 1)
var emv_TACOnlinePanel = emv_bytepanel('TAC_Online', 'DF58',   emv_TVR, 1, 1)
var emv_TACDefaultPanel = emv_bytepanel('TAC_Default', 'DF56', emv_TVR, 1, 1)

var emv_application_section = {
    id: 'emv_application_section', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        emv_AIDPanel,
        emv_AVNPanel,
        emv_TACDenialPanel,
        emv_TACOnlinePanel,
        emv_TACDefaultPanel,    
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
                        {id: 'emv_projectcreate',    type:'link',       icon: icon_new,              events: {onclick: "onclick_emv_projectcreate()"},  title: 'Create New Project'},      
                        {id: 'emv_projectrename',    type:'link',       icon: icon_rename,           events: {onclick: "onclick_emv_projectrename()"},  title: 'Rename Current Project'},  
                        {id: 'emv_projectremove',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_emv_projectremove()"},  title: 'Delete Current Project'}              
                    ]
            },

            { 
                position: 'sb_end',
                class: 'sb_transform',                
                id:'',
                type: 'group',                        
                items:
                    [ 
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
const emv_default_node_events = {
    onclick:        'onclick_emv_treenode(this, event)',  
    oncontextmenu:  'oncontextmenu_emv_treenode(this, event)',
    ondragstart:    'ondragstart_emv_treenode(this, event)',
}

const   emv_tree_terminal      = {id: 'emv_treenode-terminal',     type: 'tree', class: 'treenode', rootitem: emv_tree_help,    items:[emv_terminal_section], item: 'Terminal',     arrow: false, icon:  icon_terminal,   title: 'Terminal',                  attributes: {tag: 'Terminal'},            events: emv_default_node_events};   
const   emv_tree_acceptor      = {id: 'emv_treenode-acceptor',     type: 'tree', class: 'treenode', rootitem: emv_tree_help,    items:[emv_acceptor_section], item: 'Acceptor',     arrow: false, icon:  icon_site,       title: 'Acceptor',                  attributes: {tag: 'Acceptor'},            events: emv_default_node_events};   
const   emv_tree_acquirer      = {id: 'emv_treenode-acquirer',     type: 'tree', class: 'treenode', rootitem: emv_tree_help,    items:[emv_acquirer_section], item: 'Acquirer',     arrow: false, icon:  icon_site,       title: 'Acquirer',                  attributes: {tag: 'Acquirer'},            events: emv_default_node_events};   
const   emv_tree_applications  = {id: 'emv_treenode-applications', type: 'tree', class: 'treenode', rootitem: emv_tree_add,     items:[emv_application_section], item: 'Applications', arrow: true,  icon:  icon_application,title: 'Applications',           attributes: {nodename: 'Applications'},        events: emv_default_node_events};

var emv_tree_manager = {
    id: 'treenode-emv_projectmanager-0',       
    type: 'tree',       
    class: 'treenode',
    item: 'Project Name',
    attributes:{nodename: 'Manager'},   
    arrow: true,
    icon: icon_manager,
    items:[
        emv_tree_terminal,
        emv_tree_acceptor,
        emv_tree_acquirer,
        emv_tree_applications,        
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
        emv_projects_headerpanel,      
        emv_boxprojectspanel,  
        emv_boxmanagerpanel,      
    ]
}