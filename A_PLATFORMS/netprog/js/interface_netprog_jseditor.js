var netprog_jseditor_input = {
    id: 'netprog_jseditor_input',
    type: 'html',
    class: 'sb_panel netprog_jseditor_input',     
    catchresize: true,
    resizefunction: 'netprog_jseditor_input_resize("netprog_jseditor_input")',        
}

var netprog_jseditor_output = {
    id: 'netprog_jseditor_output',
    type: 'html',
    class: 'sb_panel netprog_jseditor_output',   
    catchresize: true,
    resizefunction: 'netprog_jseditor_output_resize("netprog_jseditor_output")',          
}

var netprog_jseditor_localfilegroup = {
    id:'netprog_jseditor_localfilegroup',
    type: 'group',     
    position: 'sb_distance',
//    class: 'sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'export_marker',    icon: icon_export,    class: 'sb_right', item : 'Local Export', type:'link',  title: 'Save script on your local machine',   events: {onclick:'onclick_netprog_jseditor_group(this, event)'}},           
            {id: 'upload_marker',     icon: icon_download,  class: 'sb_right', item : 'Local Import', type:'link',  title: 'load script from your local machine',  events: {onclick:'onclick_netprog_jseditor_group(this, event)'}},  
        ]    
}

var netprog_jseditor_evalgroup = {
    id:'netprog_jseditor_evalgroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'eval_marker',    icon: icon_play,    type:'link',  title: 'eval content',   events: {onclick:'onclick_netprog_jseditor_group(this, event)'}},           
        ]    
}

var netprog_jseditor_bar  = {
    id: 'netprog_jseditor_bar', 
    type: 'bar',    
    items:
     [
        netprog_jseditor_evalgroup,        
        netprog_jseditor_localfilegroup,
    ]
}

var netprog_jseditor = {
    id: 'netprog_jseditor',
    type: 'panel',
    class: 'sb_panel',
    items:
    [
        netprog_jseditor_bar,
        netprog_jseditor_input,
        netprog_jseditor_output,
    ]   
}
