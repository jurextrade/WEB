var CONSTRUCTOR_ID              = 'constructor_root';
var CONSTRUCTOR_PLATFORM_PNAME  = 'constructor';
var CONSTRUCTOR_PLATFORM_NAME   = 'Interface Constructor';


 /*---------------------------------------------------------------- JSON ----------------------------------------------------------------*/
var json_header_panel = {
    id: 'json_header_panel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'JSON EXPLORER',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'button',  item: 'Load Json File', class: 'sb_mbutton',   icon:  icon_download,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'Load JSON Structure'},                 
    
    ]
}
 var constructor_jsontree_editor = {
    id: 'constructor_jsontree_editor',       
    type: 'tree',       
    class: 'treenode sb_pane',
    item: 'JSON',
    attributes:{nodename: 'Root:0'},   
    arrow: true,
    items:[
    ]
}

var json_sidebarpanel = {
    id: 'json_sidebarpanel',
    type: 'panel',
    class: 'sb_panel',
    items : 
    [
        json_header_panel,
        constructor_jsontree_editor
    ]  
}


var constructor_mainbar = {
    id: 'constructor_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
        ]
}    

//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------

var constructor_sidebaremenu = {
    id: 'constructor_sidebaremenu',
    type: 'bar',
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',       
    items : 
    [
        {id: 'sidebar_jsonmanager',     type: 'link',  icon:  icon_structure, events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'JSON Structure'},                 
        {id: 'sidebar_htmlproperties',  type: 'link',  icon:  icon_files,     events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Project Workspace'},                           
    ]
}
  

var constructor_sidebarpanel  = {
    id: 'constructor_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',     
    items : 
    [
        {id: 'sidebarpanel_jsonmanager',     type: 'panel',  class: 'sb_panel', items:  [json_sidebarpanel]},           
        {id: 'sidebarpanel_htmlproperties',  type: 'panel',  class: 'sb_panel', items:[constructor_jsoneditor]},
    ]
}

var constructor_main = {
    id: 'constructor_main', 
    type: 'panel',       
    class: 'sb_panel',
    items:[
    //    constructor_mainbar,        
        constructor_gse_main
    ]
}

var constructorplatform = {
    id : CONSTRUCTOR_ID,   
    name : CONSTRUCTOR_PLATFORM_NAME, 
    pname: CONSTRUCTOR_PLATFORM_PNAME,     
    type: 'root',
    class: 'sb_row',
    items: 
        [
            constructor_sidebaremenu, 
            constructor_sidebarpanel, 
            {id: '', type:'drag', class:'sb_none', direction:'vertical', dragid: 'constructor_sidebarpanel'},           
            constructor_main
        ],    
    select: 'constructor_select(\'' + CONSTRUCTOR_PLATFORM_NAME + '\')', 
    init: 'constructor_init()',
    end:  'constructor_end()',
             
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------