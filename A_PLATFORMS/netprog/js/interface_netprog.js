const NETPROG_ID              = 'netprog_root';
const NETPROG_PLATFORM_PNAME  = 'netprog';
const NETPROG_PLATFORM_NAME   = 'NetProg';

const MXSystems_Menu = [ 
    {id: 'ID_UNIX',  text: 'UNIX'},
    {id: 'ID_WIN32', text: 'WIN32'},
    {id: 'ID_VM',    text: 'VM'},
    {id: 'ID_AS400', text: 'AS400'},
    {id: 'ID_VOS',   text: 'VOS'},
    {id: 'ID_OS2',   text: 'OS2'},
    {id: 'ID_HPUX',  text: 'HPUX'}
 ]


const MXProtocols_Menu     = [
    {id: IPPROTO_FTP , text: 'FTP'},
    {id: IPPROTO_SMTP, text: 'SMTP'},
    {id: IPPROTO_DNS , text: 'DNS'},
    {id: IPPROTO_HTTP, text: 'HTTP'},
    {id: IPPROTO_POP , text: 'POP'},
    {id: IPPROTO_BC  , text: 'BC'},
    {id: IPPROTO_DG  , text: 'DG'},
    {id: IPPROTO_CB2A, text: 'CB2A'},
    {id: IPPROTO_MTT , text: 'MTT'}, 
    {id: IPPROTO_IP  , text: 'IP '}, 
    {id: IPPROTO_ICMP, text: 'ICM'}, 
    {id: IPPROTO_IGMP, text: 'IGM'}, 
    {id: IPPROTO_GGP , text: 'GGP'}, 
    {id: IPPROTO_TCP , text: 'TCP'}, 
    {id: IPPROTO_UDP , text: 'UDP'}, 
    {id: IPPROTO_IDP , text: 'IDP'}, 
    {id: IPPROTO_ND  , text: 'ND '}, 
    {id: IPPROTO_RAW , text: 'RAW'}, 
    {id: IPPROTO_MAX , text: 'MAX'}, 
]

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var netprog_tree_add = {
    id: 'netprog_tree_add',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',      
    items:
        [
            {id: 'add_entity',     type:'link',       icon: icon_new,              events: {onclick: "onclick_treenode_add (this, event)"},  title: 'Create'},      
        ]
}

var netprog_tree_update = {
    id: 'netprog_tree_update',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',                        
    items: 
        [ 
            {id: 'tree_delete_entity', type:'link', icon: icon_remove,  style: "display:none", events: {onclick: "onclick_treenode_delete(this, event)"}, title: 'Delete'},             
            {id: 'tree_update_entity', type:'link', icon: icon_save,    style: "color: green; display:none", events: {onclick: "onclick_treenode_update(this, event)"}, title: 'Save'},  
            {id: 'tree_cancel_entity', type:'link', icon: icon_cancel,  style: "display:none", events: {onclick: "onclick_treenode_cancel(this, event)"}, title: 'Cancel'},  
            {id: 'tree_modify_entity', type:'link', icon: icon_eye,     style: "",             events: {onclick: "onclick_treenode_modify(this, event)"}, title: 'Update'},  
        ]
}

const netprog_default_node_events = {
    onclick:        'onclick_netprog_treenode(this, event)',  
    oncontextmenu:  'oncontextmenu_netprog_treenode(this, event)',
    ondragstart:    'ondragstart_netprog_treenode(this, event)',
}

const netprog_tree_machines      = {id: 'treenode-machines-2',     type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Machines',     arrow: true, icon:  icon_terminal,   title: 'Machines',               attributes: {nodename: 'Machines'},            events: netprog_default_node_events};
const netprog_tree_applications  = {id: 'treenode-applications-3', type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Applications', arrow: true, icon:  icon_application,title: 'Applications',           attributes: {nodename: 'Applications'},        events: netprog_default_node_events};
const netprog_tree_databases     = {id: 'treenode-databases-4',    type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Databases',    arrow: true, icon:  icon_database,   title: 'Databases',              attributes: {nodename: 'Databases'},           events: netprog_default_node_events};
const netprog_tree_journals      = {id: 'treenode-journals-5',     type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Journals',     arrow: true, icon:  icon_journal,    title: 'Journals',               attributes: {nodename: 'Journals'},            events: netprog_default_node_events};
const netprog_tree_queues        = {id: 'treenode-queues-6',       type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Queues',       arrow: true, icon:  icon_queue,      title: 'Queues',                 attributes: {nodename: 'Queues'},              events: netprog_default_node_events};
const netprog_tree_connections   = {id: 'treenode-connections-7',  type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Connections',  arrow: true, icon:  icon_connection, title: 'Connections',            attributes: {nodename: 'Connections'},         events: netprog_default_node_events};


var default_control = {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL}  

var netprog_tree_capplications = {id: 'treenode-capplications-8',type: 'tree', class: 'treenode', rootitem: netprog_tree_add, style:'display:none', item: 'Applications Classes',    arrow: true, icon:  icon_application,title: 'Applications Classes',   attributes:{nodename: 'ApplicationClasses'},  events: netprog_default_node_events};
var netprog_tree_cdatabases    = {id: 'treenode-cdatabases-9',   type: 'tree', class: 'treenode', rootitem: netprog_tree_add, style:'display:none', item: 'Databases Classes',       arrow: true, icon:  icon_database,   title: 'Databases Classes',      attributes:{nodename: 'DatabaseClasses'},     events: netprog_default_node_events};
var netprog_tree_cjournals     = {id: 'treenode-cjournals-10',   type: 'tree', class: 'treenode', rootitem: netprog_tree_add, style:'display:none', item: 'Journals Classes',        arrow: true, icon:  icon_journal,    title: 'Journals Classes',       attributes:{nodename: 'JournalClasses'},     events: netprog_default_node_events};
var netprog_tree_cqueues       = {id: 'treenode-cqueues-11',     type: 'tree', class: 'treenode', rootitem: netprog_tree_add, style:'display:none', item: 'Queues Classes',          arrow: true, icon:  icon_queue,      title: 'Queues Classes',         attributes:{nodename: 'QueueClasses'},       events: netprog_default_node_events};
var netprog_tree_cconnections  = {id: 'treenode-cconnections-12',type: 'tree', class: 'treenode', rootitem: netprog_tree_add, style:'display:none', item: 'Connections Classes',     arrow: true, icon:  icon_connection, title: 'Connections Classes',    attributes:{nodename: 'ConnectionClasses'},  events: netprog_default_node_events};
var netprog_tree_cdialogs      = {id: 'treenode-cdialogs-13',    type: 'tree', class: 'treenode', rootitem: netprog_tree_add, style:'display:none', item: 'Dialogs Classes',         arrow: true, icon:  icon_connection, title: 'Dialogs Classes',        attributes:{nodename: 'DialogClasses'},      events: netprog_default_node_events};

//var netprog_box_sites         = {id: 'box-sites-1',        type: 'box', closed: true, header: {item: 'Sites',               icon:  icon_site,        control: default_control},  attributes:{nodename: 'Sites:1'},               items: [netprog_tree_sites]};
//var netprog_box_machines      = {id: 'box-machines-2',     type: 'box', closed: true, header: {item: 'Machines',            icon:  icon_terminal,    control: default_control},  attributes:{nodename: 'Machines:2'},            items: [netprog_tree_machines]};
//var netprog_box_applications  = {id: 'box-applications-3', type: 'box', closed: true, header: {item: 'Applications',        icon:  icon_application, control: default_control},  attributes:{nodename: 'Applications:3'},        items: [netprog_tree_applications]};
//var netprog_box_databases     = {id: 'box-databases-4',    type: 'box', closed: true, header: {item: 'Databases',           icon:  icon_database,    control: default_control},  attributes:{nodename: 'Databases:4'},           items: [netprog_tree_databases]};
//var netprog_box_journals      = {id: 'box-journals-5',     type: 'box', closed: true, header: {item: 'Journals',            icon:  icon_journal,     control: default_control},  attributes:{nodename: 'Journals:5'},            items: [netprog_tree_journals]};
//var netprog_box_queues        = {id: 'box-queues-6',       type: 'box', closed: true, header: {item: 'Queues',              icon:  icon_queue,       control: default_control},  attributes:{nodename: 'Queues:6'},              items: [netprog_tree_queues]};
//var netprog_box_connections   = {id: 'box-connections-7',  type: 'box', closed: true, header: {item: 'Connections',         icon:  icon_connection,  control: default_control},  attributes:{nodename: 'Connections:7'},         items: [netprog_tree_connections]};
var netprog_box_capplications = {id: 'box-capplications-8',type: 'box', closed: true, header: {item: 'Applications',icon:  icon_application, control: default_control},  items: [netprog_tree_capplications]};
var netprog_box_cdatabases    = {id: 'box-cdatabases-9',   type: 'box', closed: true, header: {item: 'Databases',   icon:  icon_database,    control: default_control},  items: [netprog_tree_cdatabases]};
var netprog_box_cjournals     = {id: 'box-cjournals-10',   type: 'box', closed: true, header: {item: 'Journals',    icon:  icon_journal,     control: default_control},  items: [netprog_tree_cjournals]};
var netprog_box_cqueues       = {id: 'box-cqueues-11',     type: 'box', closed: true, header: {item: 'Queues',      icon:  icon_queue,       control: default_control},  items: [netprog_tree_cqueues]};
var netprog_box_cconnections  = {id: 'box-cconnections-12',type: 'box', closed: true, header: {item: 'Connections', icon:  icon_connection,  control: default_control},  items: [netprog_tree_cconnections]};
var netprog_box_cdialogs      = {id: 'box-cdialogs-13',    type: 'box', closed: true, header: {item: 'Dialogs',     icon:  icon_connection,  control: default_control},  items: [netprog_tree_cdialogs]};



var netprog_box_manager = {
    id: 'netprog_box_manager',       
    type: 'panel',      
    class: 'sb_panel', 
    icon: icon_manager,
    items:[
        netprog_box_capplications,
        netprog_box_cdatabases,
        netprog_box_cjournals,
        netprog_box_cqueues,
        netprog_box_cconnections ,       
        netprog_box_cdialogs,               

//        netprog_box_sites        ,
//        netprog_box_machines     ,

//        netprog_box_applications ,
//        netprog_box_databases    ,
//        netprog_box_journals     ,
//        netprog_box_queues       ,
//        netprog_box_connections  ,
    ]
} 

var netprog_connect = {
    id: 'netprog_connect',
    type: 'bar',
    items : 
    [
        {id: 'connect_machine',  type: 'select',  item: 'Machine',  icon: '', value: 'localhost', menu: [], title: 'Host'},  
        {id: 'connect_address',  type: 'text',    item: 'Address',  icon: '', value: '127.0.0.1', attributes: {placeholder: "xxx.xxx.xxx.xxx"}, title: 'IP Address'},  
        {id: 'connect_port',     type: 'int',     item: 'Port',     icon: '', value: 5000, min: 1, max: 50000, step: 1, title: 'Port'},                 
        {id: 'connect_protocol', type: 'select',  item: 'Protocol', icon: '', value: 'HTTP',  menu: MXProtocols_Menu, title: 'Protocol'},                 
        {id: 'stepregister',     type: 'button',  item: 'Connect',  class: 'sb_sbutton', events: {onclick: "onclick_netprog_connect (this, event)"}}
    ]
}

var netprog_program = {
    id: 'netprog_program',       
    type: 'tree',       
    item: 'Programs',
    icon: icon_files,

    items:[
        {
            id: 'netprog_applications', 
            item: 'Applications', 
            type: 'tree', 
            rootitem: netprog_connect,
            icon:  icon_application,  
            items: [
                {id: 'netprog_file',                      icon:  icon_file, type: 'text',  value:'lkfdlfkldkfld', events: {onclick: ""}, title: 'Project Workspace'},        
                {id: 'dropdown-toggle', item: 'dropdown', icon: icon_files, type:'dropdown-toggle'},  
                {id: 'link',            item: 'link',     icon: icon_files, type: 'link'},                           
                {id: 'checkbox1',       item: 'checkbox', icon: icon_files, type: 'checkbox'}, 
                {id: 'checkbox2',       item: 'checkbox', icon: icon_files, type: 'checkbox'},  
                {id: 'radio1',          item: 'radio1',   icon: icon_files, type: 'radio'},  
                {id: 'radio2',          item: 'radio2',   icon: icon_files, type: 'radio'},  
                {id: 'select',          item: 'select',   icon: icon_files, type: 'select',     value: 'UNIX',  menu: MXSystems_Menu},  
                {id: 'int',             item: 'int',      icon: icon_files, type: 'int',        value: 1,   min: 1,     max: 500, step: 1},
                {id: 'float',           item: 'float',    icon: icon_files, type: 'float',      value: 1,   min: 0.1,   max: 10,  step: 0.1},   
                {id: 'text',            item: 'text',     icon: icon_files, type: 'text',       value:'lkfdlfkldkfld'},
            
            ]
        },

    ]
} 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
var netprog_deploytable = {
    id: 'netprog_deploytable',
    type: 'table',            
    class:'',
    columns :  ['Type', 'Value'],
    columnstitle : ['Type', 'Value'],
    rows : [
        ['sldksldksl', 'sldkslkdlskd'],
        ['sldksldksl', 'sldkslkdlskd']
    ] 
}

var netprogbar  = {
    id: 'netprogbar', 
    type: 'bar',     
    item: 'Object', 
    class: '',
    header: {
        title: 'System', 
    },    
    items : [
        {id: 'objectname',      type: 'text',       events: {onclick: 'onclick_indicators(this, event)'},   title: 'Add Existing Indicator to Chart'},
        {id: 'objecttype',      item: 'System',     type: 'select',   menu:MXSystems_Menu,  events: {onclick: 'onclick_indicatorCreate(this)'},     title: 'Add New Indicator'},      
        {id: 'objectsize',      type: 'text',       events: {onclick: 'onclick_indicatorCreate(this)'},     title: 'Add New Indicator'},      
    ]
}

var netprog_tree1 = {
    id: 'netprog_tree_manager',       
    type: 'tree',       
    item: 'Netprog',
    icon: icon_strategy,
    items : [
        {id: 'applications',    item: 'Applications',     type: 'link', icon: icon_file,        events: {onclick: 'onclick_indicators(this, event)'},   title: 'Add Existing Indicator to Chart'},
        {id: 'applicationsadd', type: 'link',    icon: icon_new, events: {onclick: 'onclick_indicatorCreate(this)'},     title: 'Add New Indicator'},      
    ]
}


var netprog_objecttable = {
    id: 'netprog_objecttable',
    type: 'table',            
    class:'',
    columns :  ['Name', 'Type', 'Size'],
    columnstitle : ['Name', 'Type', 'Size'],
    rows : [
        ['session', 'STRING', 1],
        ['passwd1', 'STRING', 1]
    ] 
}

var netprog_messagetree = {
    id: 'netprog_messagetree', 
    item: 'retourconnexion', 
    type: 'tree', 
    icon:  icon_application,  
    items: [netprog_objecttable]
}

var netprog_dialogtree = {
    id: 'netprog_dialogtree', 
    item: 'edipharm', 
    type: 'tree', 
    icon:  icon_application,  
    items: [netprog_messagetree]
}

//------------------------------------------------------------ MAIN PANELS----------------------------------------------------------



var netprog_siteview_topbarmenu = {
    id: 'netprog_siteview_topbarmenu',
    type: 'bar',
    direction: 'row', 
    class: 'sb_bottom',      
    items : 
    [
        {id: 'topbar_netprogaddsite',        type: 'button',  item: 'Add Site',        class: 'sb_button', icon:  icon_site,        events: {onclick: "onclick_topbarmenu(this.id)"},  attributes: {actionname: 'AddSite'},       title: ''},                 
        {id: 'topbar_netprogaddmachine',     type: 'button',  item: 'Add Machine',     class: 'sb_button', icon:  icon_machine,     events: {onclick: "onclick_topbarmenu(this.id)"},  attributes: {actionname: 'AddMachine'},    title: ''},                 
        {id: 'topbar_netprogaddapplication', type: 'button',  item: 'Add Application', class: 'sb_button', icon:  icon_application, events: {onclick: "onclick_topbarmenu(this.id)"},  attributes: {actionname: 'AddApplication'},title: ''},                 
        {id: 'topbar_netprogadddatabase',    type: 'button',  item: 'Add Database',    class: 'sb_button', icon:  icon_database,    events: {onclick: "onclick_topbarmenu(this.id)"},  attributes: {actionname: 'AddDatabase'},   title: ''},                 

    ]
}  

var netprog_file = {
    id: 'netprog_file',
    type: 'html',
    class: 'sb_panel',  
    catchresize: true,
    resizefunction: 'netprog_fileditor.resize()',              
}

var netprog_siteview_panel = {
    id: 'netprog_siteview_panel', 
    type: 'panel',       
    class: 'sb_panel sb_column',
    items: [
        netprog_siteview_topbarmenu, gsepanel('netprog')
    ] 
}

//------------------------------------------------------------ PROJECT PANEL ----------------------------------------------------------

var netprog_tree_projects = {
    id: 'netprog_tree_projects',       
    type: 'tree',       
    class:'nav-pills',
    item: 'Projects',
    icon: icon_project,
    items:[]
} 

var netprog_projectsbar = {
    id : 'netprog_projectsbar', 
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
                        {id: 'netprog_projectselect',    type: 'select',   title: 'Select Project',      value: '--Select Project--', menu: [{text: '--Select Project--'}], events: {onchange: 'onchange_netprog_projectselect (this, event)'}}, 
//                        {id: 'netprog_projectcreate',    type:'link',       icon: icon_new,              events: {onclick: "onclick_netprog_projectcreate()"},  title: 'Create New Project'},      
//                        {id: 'netprog_projectrename',    type:'link',       icon: icon_rename,           events: {onclick: "onclick_netprog_projectrename()"},  title: 'Rename Current Project'},  
//                        {id: 'netprog_projectremove',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_netprog_projectremove()"},  title: 'Delete Current Project'}              
                    ]
            },
//            { 
//                position: 'sb_distance',
//                class: 'sb_transform',                
//                id:'',             
//                type: 'group',                           
//                items:
//                    [ 
//                        {id: 'netprog_projectcompile',   type:'link',  icon: 'far fa-file',               events: {onclick: "onclick_netprog_projectcompile()"},    title: 'Compile Current Project in C'},                 
//                        {id: 'netprog_projectdistribute',type:'link',  icon: 'fas fa-cloud-download-alt', events: {onclick: "onclick_netprog_projectdistribute()"}, title: 'Distribute Current Project on MT4 Terminal'},
//                    ]
//            },
            { 
                position: 'sb_end',
                class: 'sb_transform',                
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'netprog_projectcreate',    type:'link',       icon: icon_new,              events: {onclick: "onclick_netprog_projectcreate()"},  title: 'Create New Project'},      
                        {id: 'netprog_projectrename',    type:'link',       icon: icon_rename,           events: {onclick: "onclick_netprog_projectrename()"},  title: 'Rename Current Project'},  
                        {id: 'netprog_projectremove',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_netprog_projectremove()"},  title: 'Delete Current Project'},              
                        {id: 'netprog_projectclose',     type:'link', icon: icon_close,    class:'sb_close',  events: {onclick: "onclick_netprog_projectclose()"}, title: 'Close Current Project'}
                    ]
            }
            
        ]
}   

var netprog_projectssidepanel = {
    id: 'netprog_projectssidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[netprog_tree_projects]
}

var netprog_boxprojectspanel = {
    id: 'netprog_boxprojectspanel',
    type: 'box',
    closed: false, 
    header: {item: 'Projects', items: [netprog_projectsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.L_CONTROL} },  
    items: [netprog_projectssidepanel]    
}

//--------------------------

const netprog_tree_sites         = {id: 'treenode-sites-1',        type: 'tree', class: 'treenode', rootitem: netprog_tree_add, item: 'Sites',        arrow: true, icon:  icon_site,       title: 'Sites',                  attributes: {nodename: 'Sites'},               events: netprog_default_node_events};   

var netprog_tree_manager = {
    id: 'treenode-manager-0',       
    type: 'tree',       
    class: 'treenode',
    item: 'Manager',
    events: netprog_default_node_events,    
    attributes:{nodename: 'Manager'},   
    arrow: true,
    style: "display:none",
    icon: icon_manager,
    items:[
        netprog_tree_sites,  
    ]
} 

var netprog_managerbar = {
    id : 'netprog_managerbar', 
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
           //            {id: 'netprog_siteCreate',     type:'link',  icon: icon_new,      events: {onclick: "onclick_netprog_siteCreate()"},  title: ''},      
           //            {id: 'netprog_siteRename',     type:'link',  icon: icon_rename,   events: {onclick: "onclick_netprog_siteRename()"},  title: ''},  
           //            {id: 'netprog_siteDelete',     type:'link',  icon: icon_remove,   events: {onclick: "onclick_netprog_siteDelete()"},  title: ''}              
                   ]
            },
            { 
                position: 'sb_end',
                class: '',
                id:'',
                type: 'group',                        
                items:
                    [ 
           //             {id: 'netprog_siteCompile',    type:'link',  icon: icon_mt4expert,     events: {onclick: "onclick_netprog_siteCompile()"},  title: ''},      
                    ]
            }
        ]
}

var netprog_managersidepanel = {
    id: 'netprog_managersidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[netprog_tree_manager]
}

var netprog_boxmanagerpanel = {
    id: 'netprog_boxmanagerpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Manager', items: [netprog_managerbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [netprog_managersidepanel]    
}

//--------------------------


var netprog_projects_headerbar = {
    id: 'netprog_projects_headerbar',
    type: 'bar',
    class: 'sb_sidebarheader ',
    style:'z-index:10',            
    items : 
    [
        {id: '',                type: 'link',   item: 'Site Manager',  class: 'sb_sidebarheadertitle', events: {onclick: 'onclick_netprog_header(this, event)'}},                           
        {id: 'label_server',    item: 'Netprog Server', type: 'link',  icon: icon_connection, events: {onclick: "onclick_button_server (this, event)"}, title: 'NETPROG SERVER'},
        {id: 'button_server',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_server (this, event)"}, title: 'NETPROG SERVER'},
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var netprog_projects_headerpanel = {
    id: 'netprog_projects_headerpanel',
    type : 'panel',
    class: 'sb_column',    
    style:'position:relative',      
    items : 
    [
        netprog_projects_headerbar,
        modalserverpanel('netprog'),
    ]
}


var netprog_projects_sidepanel = {
    id: 'netprog_projects_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items: [
        netprog_boxprojectspanel, 
        netprog_boxmanagerpanel,                 
    ]
}
var netprog_mainbar = {
    id: 'netprog_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
        ]
}   

//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------

var netprog_maintabs = {
    id:'netprog_maintabs',
    type: 'tabs',    
    class: 'sb_main',
    label : '',    
    items : [
     //   {id: 'netprog_home_tab',     item: 'Home',      type:'link', icon:  icon_home,       items: [netprog_home_section], onclose: 'onclick="onclick_netprog_other_tab_close(this, event)"',    title: 'Home',      events: {onclick:"onclick_netprog_tab(this, event)"}},           
        {id: 'netprog_siteview_tab', item: 'Site View', type:'link', icon:  icon_siteview,   items: [netprog_siteview_panel],   onclose: 'onclick="onclick_netprog_other_tab_close(this, event)"',    title: 'Scenario',  events: {onclick:"onclick_netprog_tab(this, event)"}},           
        {id: 'netprog_json_tab',     item: 'JSON',      type:'link', icon:  icon_structure,  items: [netprog_jsoneditor], onclose: 'onclick="onclick_netprog_tab_close(this, event)"',    title: 'Structure', events: {onclick:"onclick_netprog_tab(this, event)"}},             
    ],
    groupitems: [
        {
            id: 'netprog_maintabs_fileaction',    
            type: 'group',
            items:
                [  
                    {id: 'netprog_maintabs_more',   type: 'link',  icon:  icon_more,    events: {onclick: "onclick_netprog_more(event)"},  title: 'More Actions...'}
                ]
        }    
    ]
} 

var netprog_bottomtabs = {
    id:'netprog_bottomtabs',
    type: 'tabs',    
    tabevents: {ondblclick: "ondblclick_netprogtabs(this, event)"},   
    items :
        [ 
            {id: 'tab_javasript',     item: 'JS Console',     type:'link', icon: icon_file,      events: {onclick: "onclick_netprogtabs(event)"}, items: [netprog_jseditor], title: ''},           
         //   {id: 'tab_netprogserver', item: 'NetProg Server', type:'link', icon: icon_server,    events: {onclick: ""}, items: [netprog_server],   title: ''},           

        ],
    groupitems:
        [
            {
                id: 'netprogactions',  
                type: 'group',  
                class:'sb_controls',               
                items :
                    [  
                        {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen sb_none',     events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                        {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                        {id: 'slide',         type:'control',  class : 'box-btn-slide rotate-180',       events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''},  
                    ]
            }        
        ]          
} 

var netprog_toppanel = {
    id : 'netprog_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
    //    netprog_mainbar,
        netprog_maintabs,
    ],
}

var netprog_bottompanel = {
    id : 'netprog_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    items: 
    [
        netprog_bottomtabs 
    ],
    bottomheight: 270,
}

//----------------------------------------------------------------<<< PANEL >>>-----------------------------------------------------------------------

var netprog_sidebaremenu = {
    id: 'netprog_sidebaremenu',
    type: 'bar',
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',       
    items : 
    [
        {
            position: '',
            id: 'netprog_sidebaremenu_maingroup',
            type: 'group',                    
            direction: 'column',
            toggle : false,
            items : 
            [
                {id: 'sidebar_netprogsiteview',    type: 'link',  icon:  icon_siteview, events: {onclick: "sidebarmenu_select(this.id)"}, title: 'Site View'},                 
                {id: 'sidebar_netprogmanager',     type: 'link',  icon:  icon_inspect,  events: {onclick: "sidebarmenu_select(this.id)"}, title: 'Project Manager'},                           
                {id: 'sidebar_netprogfilemanager', type: 'link',  icon:  icon_files,    events: {onclick: "sidebarmenu_select(this.id)"}, title: 'Project File Workspace'},                           
            ]
        }, 
        settingsgroup('netprog'),
   ]
}

var netprog_sidebarpanel  = {
    id: 'netprog_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',     
    items : 
    [
        {id: 'sidebarpanel_netprogsiteview',    class: 'sb_panel sb_main',  type: 'panel',  items: [netprog_projects_headerpanel,  netprog_projects_sidepanel]},      
        {id: 'sidebarpanel_netprogmanager',     class: 'sb_panel sb_main',   type: 'panel',  items: [netprog_box_manager, netprog_program]},             
        {id: 'sidebarpanel_netprogfilemanager', class: 'sb_panel sb_main',   type: 'panel',  items: [netprog_file_headerpanel, netprog_filemanager]},             
        {id: 'sidebarpanel_netprogsettings',    class: 'sb_panel sb_pane',   type: 'panel',  items: [settingspanel('netprog')]},             
    ]
}

var netprog_main = {
    id: 'netprog_main', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_column',
    items:[
        netprog_toppanel,
        {id: 'netprog_mainpanel_drag', type:'drag', direction:'horizontal', dragid: 'netprog_bottompanel'},        
        netprog_bottompanel        
    ]
}

var netprogplatform = {
    id : NETPROG_ID,    
    name : NETPROG_PLATFORM_NAME, 
    pname: NETPROG_PLATFORM_PNAME,

    type: 'root',
    class: 'sb_row',
    items: [
        netprog_sidebaremenu, 
        netprog_sidebarpanel, 
        {id: 'netprog_sidebarpanel_drag', type:'drag',  class:'sb_none', direction:'vertical', dragid: 'netprog_sidebarpanel'},           
        netprog_main
    ],    
    brand: {
        title: 'NetProg', 
        logo: '/A_PLATFORMS/netprog/res/netprog.svg',
        events: {onclick: "netprog_home_open(event)"}
    },            
    
    select:'netprog_select(\'' + NETPROG_PLATFORM_NAME + '\')',   
    init:  'netprog_init()',          
    end:   'netprog_end()',            
  }

//--------------------------------------------------------------------------------------------------------------------------------------------------------