var constructor_gse = {
    id: 'constructor_gse',
    type: 'html',
    container: 'canvas', 
    catchresize: true,
    resizefunction: 'constructor_gse_refresh("constructor_gse")',
    events: {
       ondragover:     'ondragover_constructor_gse(this, event)',
       ondragenter:    'ondragenter_constructor_gse(this, event)',
       ondrop:         'ondrop_constructor_gse(this, event)',
       onmousemove:    'onmousemove_constructor_gse(this, event)',
       ondblclick:     'ondblclick_constructor_gse(this, event)',
       oncontextmenu:  'oncontextmenu_constructor_gse(this, event)',
       onmouseenter:   'onmouseenter_constructor_gse(this, event)',
       onmouseleave:   'onmouseleave_constructor_gse(this, event)',
       onmousedown:    'onmousedown_constructor_gse(this, event)', 
       onmouseup:      'onmouseup_constructor_gse(this, event)',
    }
}

var modegroup = {
    id:'modegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'nodemode_horizontal',  icon: 'fas fa-sitemap',  type:'link',    title: 'Horizontal',  events: {onclick:'onclick_modegroup(this, event)'}},  
            {id: 'nodemode_vertical',    icon: 'fas fa-sitemap rotate90', type:'link',    title: 'Vertival',    events: {onclick:'onclick_modegroup(this, event)'}},           
            {id: 'linemode_normal',      icon: 'fas fa-code-branch',    type:'link',    title: 'Normal',      events: {onclick:'onclick_modegroup(this, event)'}}                 
        ]    
}

var stylenodegroup = {
    id:'stylenodegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',
    toggle: true,
    items:
        [ 
            {id: 'nodemode_rectangle',   icon: 'fas fa-square',  type:'link',  class:'sb_right',   title: 'Node Rectangle',  events: {onclick:'onclick_stylegroup(this, event)'}},  
            {id: 'nodemode_circle',      icon: 'fas fa-circle',  type:'link',  class:'sb_right',   title: 'Node Circle',     events: {onclick:'onclick_stylegroup(this, event)'}},  
        ]    
}

var stylelinegroup = {
    id:'stylelinegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',
    toggle: true,
    items:
        [ 
            {id: 'linemode_normal',      icon: 'fas fa-slash',    type:'link',    title: 'Link Normal',     events: {onclick:'onclick_stylegroup(this, event)'}},                 
            {id: 'linemode_net',         icon: 'fas fa-list-ul',  type:'link',    title: 'Link Net Style',  events: {onclick:'onclick_stylegroup(this, event)'}},                 
        ]    
}


var constructor_gse_bar  = {
    id: 'constructor_gse_bar', 
    type: 'bar',    
    items: [modegroup, stylenodegroup, stylelinegroup]
}

var constructor_gse_panel = {
    id: 'constructor_gse_panel', 
    type: 'panel',
    class: 'sb_panel sb_pane',
    items : 
    [
        constructor_gse,
    ]
}

var constructor_gse_main = {
    id: 'constructor_gse_main', 
    type: 'panel',
    class: 'sb_panel', 
    items : 
    [
        constructor_gse_bar,
        constructor_gse_panel
    ]
}

