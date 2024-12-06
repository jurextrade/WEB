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
    content: "ServerPanel('" + id + "')",
}})

var settingspanel = (id =>  {return {
    id:'settingspanel_' + id,
    type: 'panel',
    class: 'sb_panel',
    items: [
      //  themepanel(id),
        serverpanel(id),
    ]
}})
