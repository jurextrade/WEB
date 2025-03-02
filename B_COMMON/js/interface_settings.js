var settingsgroup= (id =>  {return {
    id: 'settingsgroup',
    type: 'group',                    
    position: 'sb_end',
    direction: 'column',
    toggle : false,
    items :
        [     
            {id: 'sidebar_' + id  + 'settings',  type: 'link',  icon:  icon_settings,   events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Settings'}                                
        ]           
}})

var themepanel = (id =>  {return {
    id: 'themepanel_' + id,
    type: 'html',
    class: 'themepanel',
    content: "ThemePanel('" + id + "')",
}})


var serverpanel = (id =>  {return {
    id: 'serverpanel_' + id,
    type: 'html',
    class: 'serverpanel',
    content: "serverPanel('" + id + "')",
}})

var settingspanel = (id =>  {return {
    id:'settingspanel_' + id,
    type: 'panel',
    class: 'sb_panel',
    items: [
        themepanel(id),
        serverpanel(id),
    ]
}})

var modalserverpanel = (id =>  {return {
    id: 'modalserverpanel_' + id,    
    type : 'html',
    class: 'sb_panel modalserverpanel',
    content: "serverPanel('" + id + "')",
}})


var serverstable  = {
    id: 'serverstable',
    type: 'panel',
    items: [
        {id: '', type: 'label',  class:'sb_f_style_h6', item: 'NetProg Server'},
        {id: '', type: 'group',  form: true, 
         items: [
            {id: 'solution_configurationtitle', type: 'label', item: 'Adress'},
            {id: 'anythig', type: 'text'}
         ] 
        },
        {id: '', type: 'group',  form: true, 
         items: [
            {id: 'solution_configurationtitle', type: 'label', item: 'Port'},
            {id: 'netprogserverport', type: 'text'}
         ] 
        },
        {id: '', type: 'group',  form: true,  class: "sb_buttongroup",
         items: [
            {id: 'solution_configurationtitle', type: 'button',  class: 'sb_button', item: 'Reset', events: { onclick: "onclick_ResetNetProgServer(this, event)"}},
            {id: 'netprogserverport',           type: 'button',  class: 'sb_button', item: 'Apply', events: { onclick: "onclick_ResetNetProgServer(this, event)"}}
         ] 
        },
    ] 
}

var solution_serverpanel = {
    id: 'solution_serverpanel',
    type: 'html',
    content: "solution_serverpanel()",
}
