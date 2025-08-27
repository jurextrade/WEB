//------------------------------------------------------------ STRATEGY PROPERTIES PANEL ----------------------------------------------------------

var gsemodegroup = {
    id:'modegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_right',    
    toggle: true,                         
    items:
        [ 
            {id: 'nodemode_horizontal',  icon: 'fas fa-sitemap',            type:'link',    title: 'Horizontal',  events: {onclick:'onclick_gsemodegroup(this, event)'}},  
            {id: 'nodemode_vertical',    icon: 'fas fa-sitemap rotate90',   class:'checked', type:'link',    title: 'Vertival',    events: {onclick:'onclick_gsemodegroup(this, event)'}},           
            {id: 'linemode_normal',      icon: 'fas fa-code-branch',    type:'link',    title: 'Normal',      events: {onclick:'onclick_gsemodegroup(this, event)'}}                 
        ]    
}

var gsestylenodegroup = {
    id:'stylenodegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',
    toggle: true,
    items:
        [ 
            {id: 'nodemode_rectangle',   icon: 'fas fa-square',  type:'link',  class:'sb_right',   title: 'Node Rectangle',  events: {onclick:'onclick_gsestylenodegroup(this, event)'}},  
            {id: 'nodemode_circle',      icon: 'fas fa-circle',  type:'link',  class:'sb_right',   title: 'Node Circle',     events: {onclick:'onclick_gsestylenodegroup(this, event)'}},  
        ]    
}

var gsestylelinegroup = {
    id:'stylelinegroup',
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',
    toggle: true,
    items:
        [ 
            {id: 'linemode_normal',      icon: 'fas fa-slash',    type:'link',    title: 'Link Normal',     events: {onclick:'onclick_gsestylelinegroup(this, event)'}},                 
            {id: 'linemode_net',         icon: 'fas fa-list-ul',  type:'link',    title: 'Link Net Style',  events: {onclick:'onclick_gsestylelinegroup(this, event)'}},                 
        ],
}

var gsecanvas  = (pname =>  {return { 
    id: 'gsecanvas_'+ pname, 
    type: 'html',
    container: 'canvas', 
    catchresize: true,
    resizefunction: 'platform_gse_refresh("gsecanvas_' + pname + '")',
}})

var gsemain  = (pname =>  {return { 
    id: 'gsemain_'+ pname, 
    type: 'panel',
    class: 'gsemain sb_panel sb_pane',
    items : 
    [
        gsecanvas(pname),
    ]
}})

var gsebar  = (pname =>  {return {    
    id: 'gsebar_' + pname, 
    type: 'bar',  
    class: 'gsebar',  
    items: [gsemodegroup, gsestylenodegroup, gsestylelinegroup]
}})

var gsepanel  = (pname =>  {return {    
    id: 'gsepanel_'+ pname, 
    type: 'panel',
    class: 'gsepanel sb_panel sb_left',
    items : 
    [
        gsebar(pname),
        gsemain(pname),
    ]
}})
