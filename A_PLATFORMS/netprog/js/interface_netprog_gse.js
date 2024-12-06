var netprog_gse = {
    id: 'netprog_gse',
    type: 'html',
    container: 'canvas', 
    catchresize: true,
    resizefunction: 'netprog_gse_refresh("netprog_gse")',

    events: {
       ondragover:     'ondragover_netprog_gse(this, event)',
       ondragenter:    'ondragenter_netprog_gse(this, event)',
       ondrop:         'ondrop_netprog_gse(this, event)',
       onmousemove:    'onmousemove_netprog_gse(this, event)',
       ondblclick:     'ondblclick_netprog_gse(this, event)',
       oncontextmenu:  'oncontextmenu_netprog_gse(this, event)',
       onmouseenter:   'onmouseenter_netprog_gse(this, event)',
       onmouseleave:   'onmouseleave_netprog_gse(this, event)',
       onmousedown:    'onmousedown_netprog_gse(this, event)', 
       onmouseup:      'onmouseup_netprog_gse(this, event)',
    }
}

var netprog_gse_modegroup = {
    id:'netprog_gse_modegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'drawmode_vertical',    icon: 'fas fa-sitemap', type:'link',    title: 'Vertival',    events: {onclick:'onclick_netprog_gse_modegroup(this, event)'}},           
            {id: 'nodemode_horizontal',  icon: 'fas fa-sitemap rotate90',  type:'link',    title: 'Horizontal',  events: {onclick:'onclick_netprog_gse_modegroup(this, event)'}},  
            {id: 'linemode_normal',      icon: 'fas fa-code-branch',    type:'link',    title: 'Normal',      events: {onclick:'onclick_netprog_gse_modegroup(this, event)'}}                 
        ]    
}

var netprog_gse_stylenodegroup = {
    id:'netprog_gse_stylenodegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',
    toggle: true,
    items:
        [ 
            {id: 'nodemode_rectangle',   icon: 'fas fa-square',  type:'link',  class:'sb_right',   title: 'Node Rectangle',  events: {onclick:'onclick_netprog_gse_stylegroup(this, event)'}},  
            {id: 'nodemode_circle',      icon: 'fas fa-circle',  type:'link',  class:'sb_right',   title: 'Node Circle',     events: {onclick:'onclick_netprog_gse_stylegroup(this, event)'}},  
        ]    
}

var netprog_gse_stylelinegroup = {
    id:'netprog_gse_stylelinegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',
    toggle: true,
    items:
        [ 
            {id: 'linemode_normal',      icon: 'fas fa-slash',    type:'link',    title: 'Link Normal',     events: {onclick:'onclick_netprog_gse_stylegroup(this, event)'}},                 
            {id: 'linemode_net',         icon: 'fas fa-list-ul',  type:'link',    title: 'Link Net Style',  events: {onclick:'onclick_netprog_gse_stylegroup(this, event)'}},                 
        ]    
}

var netprog_gse_bar  = {
    id: 'netprog_gse_bar', 
    type: 'bar',    
    items: [netprog_gse_modegroup, netprog_gse_stylenodegroup, netprog_gse_stylelinegroup]
}

var netprog_gse_panel = {
    id: 'netprog_gse_panel', 
    type: 'panel',
    class: 'sb_panel sb_pane',
    items : 
    [
        netprog_gse,
    ],
}

var netprog_gse_main = {
    id: 'netprog_gse_main', 
    type: 'panel',
    class: 'sb_panel',
    items : 
    [
        netprog_gse_bar,
        netprog_gse_panel
    ]
}
