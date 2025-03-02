var netprog_file_headerpanel = {
    id: 'netprog_file_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'File Manager',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}



var netprog_filemanager = {
    id: 'netprog_filemanager',       
    type: 'tree',       
    item: 'File Manager',

    icon: icon_folder,
    items:[
    ]
} 