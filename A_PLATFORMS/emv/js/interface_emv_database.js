var emv_database_tree_add = {
    id: 'emv_database_tree_add',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',      
    items:
        [
            {id: 'add_entity',     type:'link',       icon: icon_new,              events: {onclick: "onclick_treenode_add (this, event)"},  title: 'Create'},      
        ]
}

var emv_database_tree_update = {
    id: 'emv_database_tree_update',  
    position: 'sb_end',
    class: 'sb_transform',
    type: 'group',                        
    items: 
        [ 
            {id: 'tree_delete_entity', type:'link', icon: icon_remove,  style: "display:none", events: {onclick: "onclick_treenode_delete(this, event)"}, title: 'Delete'},             
            {id: 'tree_update_entity', type:'link', icon: icon_save,    style: "display:none", events: {onclick: "onclick_treenode_update(this, event)"}, title: 'Save'},  
            {id: 'tree_cancel_entity', type:'link', icon: icon_cancel,  style: "display:none", events: {onclick: "onclick_treenode_cancel(this, event)"}, title: 'Cancel'},  
            {id: 'tree_modify_entity', type:'link', icon: icon_eye,     style: "",             events: {onclick: "onclick_treenode_modify(this, event)"}, title: 'Update'},  
        ]
}

const emv_database_default_node_events = {
    onclick:        'onclick_emv_database_treenode(this, event)',  
    oncontextmenu:  'oncontextmenu_emv_database_treenode(this, event)',
    ondragstart:    'ondragstart_emv_database_treenode(this, event)',
}

const emv_database_tree_aid         = {id: 'emv_database_tree_aid',          type: 'link', class: 'treenode', rootitem: emv_database_tree_add, item: 'AID',           arrow: true, icon:  icon_site,       title: 'Sites',                  attributes: {nodename: 'Sites'},               events: emv_database_default_node_events};   
const emv_database_tree_tags        = {id: 'emv_database_tree_tags',         type: 'link', class: 'treenode', rootitem: emv_database_tree_add, item: 'TAGS',          arrow: true, icon:  icon_terminal,   title: 'Machines',               attributes: {nodename: 'Machines'},            events: emv_database_default_node_events};
const emv_database_tree_apdu        = {id: 'emv_database_tree_apdu',         type: 'link', class: 'treenode', rootitem: emv_database_tree_add, item: 'APDU',          arrow: true, icon:  icon_application,title: 'Applications',           attributes: {nodename: 'Applications'},        events: emv_database_default_node_events};
const emv_database_tree_bankcode    = {id: 'emv_database_tree_bankcode',     type: 'link', class: 'treenode', rootitem: emv_database_tree_add, item: 'Bank Codes',    arrow: true, icon:  icon_database,   title: 'Databases',              attributes: {nodename: 'Databases'},           events: emv_database_default_node_events};
const emv_database_tree_currencycode= {id: 'emv_database_tree_currencycode', type: 'link', class: 'treenode', rootitem: emv_database_tree_add, item: 'Currency Codes',arrow: true, icon:  icon_journal,    title: 'Journals',               attributes: {nodename: 'Journals'},            events: emv_database_default_node_events};


var emv_database_root = {
    id: 'emv_database_root',       
    type: 'tree',       
    class: 'treenode',
    item: 'EMV Database',
//    events: emv_database_default_node_events,    
    arrow: true,
    icon: icon_manager,
    items:[
        emv_database_tree_aid,         
        emv_database_tree_tags,        
        emv_database_tree_apdu,        
        emv_database_tree_bankcode,    
        emv_database_tree_currencycode,
    ]    
}


var emv_database_headerpanel = {
    id: 'emv_database_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',   item: 'Site Manager',  class: 'sb_sidebarheadertitle', events: {onclick: 'onclick_emv_database_headerpanel(this, event)'}},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var emv_database_sidepanel = {
    id: 'emv_database_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items:
         [
          emv_database_root
        ]
}

//---------------------------------------------------------------------------- TAGS PANEL -----------------------------------------------------------------------------------

var emv_tags_table = {
    id: 'emv_tags_table',
    type: 'table',            
    class: '',
    columns :  ['Tag', 'Name', 'Origin', 'Description', 'Template', 'Format', 'Length(min)', 'Length(max)', 'P/C'],
    columnstitle : ['Tag', 'Name', 'Origin', 'Description', 'Template', 'Format', 'Length(min)', 'Length(max)', 'P/C'],
    rows : [
    ] 
}


var emv_tagspanel = {
    id: "emv_tagspanel",
    type: "panel",
    class: "sb_panel sb_datatable sb_main",
    items: [
  //      {id: 'emv_description_TAGS',  type: 'label',    item: 'TAGS LISTING',  class: 'tagheader', title: 'Tags'},         
        emv_tags_table,
    ]
}

//--------------------------------------------------------------------- AIDS PANEL --------------------------------------------------------------------

var emv_aids_table = {
    id: 'emv_aids_table',
    type: 'table',            
    class: '',
    columns :  ['AID', 'RID', 'PIX', 'Vendor', 'Type', 'Name', 'Country', 'Description'],
    columnstitle :  ['AID', 'RID', 'PIX', 'Vendor', 'Type', 'Name', 'Country', 'Description'],
    rows : [
    ] 
}

var emv_aidspanel = {
    id: "emv_aidspanel",
    type: "panel",
    class: "sb_panel sb_datatable sb_main sb_column",
    items: [
    //    {id: 'emv_description_AID',  type: 'label',    item: 'APPLICATION INDENTFIER (AID)',  class: 'tagheader', title: 'Tag 9F06'},         
        emv_aids_table,
    ]
};

//--------------------------------------------------------------------- ADPU COMMANDS + SW1 SW2 --------------------------------------------------------------------

var emv_capdu_table = {
    id: 'emv_capdu_table',
    type: 'table',            
    class: '',
    columns :  ['CLA', 'INS', 'P1', 'P2', 'LC', 'LE', 'Name'],
    columnstitle : ['', '', '', '', '', '', 'Command Name'],
    rows : [
    ] 
}


var emv_capdupanel = {
    id: "emv_capdupanel",
    type: "panel",
    class: "sb_panel sb_datatable sb_main sb_right",
    items: [
     //   {id: 'emv_CAPDU',  type: 'label', item: 'C-APDU',  class: 'tagheader', title: 'APDU COMMANDS'},         
        emv_capdu_table,
    ]
};

var emv_sw1sw2_table = {
    id: 'emv_sw1sw2_table',
    type: 'table',            
    class: 'sb_datatable',
    columns :  ['SW1', 'SW2', 'Info', 'Description'],
    columnstitle : ['', '', '', 'Error Description'],
    rows : [
    ] 
}

var emv_sw1sw2panel = {
    id: "emv_sw1sw2panel",
    type: "panel",
    class: "sb_panel sb_datatable sb_main",
    items: [
     //   {id: 'emv_RAPDU',  type: 'label', item: 'R-APDU',  class: 'tagheader', title: 'APDU RESULTS'},              
        emv_sw1sw2_table,
    ]
};

var emv_apdumainpanel = {
    id: "emv_apdumainpanel",
    type: "panel",
    class: "sb_panel sb_row",
    items: [emv_capdupanel,
            {id: '', type:'drag', direction:'vertical', dragid: 'emv_capdupanel'},    
            emv_sw1sw2panel,
    ],
}
