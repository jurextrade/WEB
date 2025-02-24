var netprog_server_localfilegroup = {
    id:'netprog_server_localfilegroup',
    type: 'group',     
    position: 'sb_distance',
   // class: 'sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'exportlocal_serverjsscript',    icon: icon_export,      class: 'sb_right', item : 'Local Export', type:'link',  title: 'Save script on your local machine',   events: {onclick:'onclick_netprog_server_group(this, event)'}},           
            {id: 'uploadlocal_serverjscript',     icon: icon_download,    class: 'sb_right', item : 'Local Import', type:'link',  title: 'Load script from your local machine',  events: {onclick:'onclick_netprog_server_group(this, event)'}},  
        ]    
}

var netprog_server_serverfilegroup = {
    id:'netprog_server_serverfilegroup',
    type: 'group',     
    position: 'sb_distance',
   // class: 'sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'exportserver_serverjsscript',    icon: icon_export,      class: 'sb_right', item : 'Server Export', type:'link',  title: 'Save script in your workspace',   events: {onclick:'onclick_netprog_server_group(this, event)'}},           
            {id: 'uploadserver_serverjscript',     icon: icon_download,    class: 'sb_right', item : 'Server Import', type:'link',  title: 'Load script from your workspace',  events: {onclick:'onclick_netprog_server_group(this, event)'}},  
        ]    
}

var netprog_server_connectgroup = {
    id:'netprog_server_connectgroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'connect_serverjscript',    icon: icon_connection, type:'link',  title: 'connect to NetProg Server',       events: {onclick:'onclick_netprog_server_group(this, event)'}},           
            {id: 'disconnect_serverjscript', icon: icon_close,      type:'link',  title: 'disconnect from NetProg Server',  events: {onclick:'onclick_netprog_server_group(this, event)'}},           
        ]    
}

var netprog_server_evalgroup = {
    id:'netprog_server_evalgroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'eval_serverjsscript', icon: icon_play,    type:'link',  title: 'eval content',   events: {onclick:'onclick_netprog_server_group(this, event)'}},           
        ]    
}

var netprog_server_bar  = {
    id: 'netprog_server_bar', 
    type: 'bar',    
    items:
     [
        netprog_server_connectgroup, 
        netprog_server_evalgroup,       
        netprog_server_localfilegroup,
        netprog_server_serverfilegroup,
    ]
}

var netprog_server_input = (id =>  {return {
    id: 'netprog_server_input_' + id,
    type: 'html',
    class: 'sb_panel netprog_server_input', 
}})


var netprog_server_output = (id =>  {return {
    id: 'netprog_server_output_' + id,
    type: 'html',
    class: 'sb_panel netprog_server_output',    
}})

var netprog_server = (id =>  {return {
    id: 'netprog_server_' + id,
    type: 'panel',
    class: 'sb_panel npservereditor',
    items:
    [
        netprog_server_bar,
        netprog_server_input(id),
        netprog_server_output(id),
    ],   
    catchresize: true,
    resizefunction: 'netprog_server_resize(' + id + ')',
}})
