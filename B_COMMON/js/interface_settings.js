var settingsgroup= (id =>  {return {
    id: id + '_sidebarmenu_settingsgroup',
    type: 'group',                    
    position: 'sb_end',
    direction: 'column',
    toggle : false,
    style: "display:none",
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

var serverpanel_addressgroup = (id =>  {return {
    id: 'project_strategygroup',
    type: 'group',
    form: true,
    items: [
        {id: '', type: 'label', item: 'Address'},
        {id: 'nodeserveradress_' + id ,  type: 'text',  title: 'Server Address', value: ''},
    ]
}})

var serverpanel_portgroup = (id =>  {return {
    id: 'project_strategygroup',
    type: 'group',
    form: true,
    items: [
        {id: '', type: 'label', item: 'Port'},
        {id: 'nodeserverport_' + id ,  type: 'text',  title: 'Server Port', value: ''},
    ]
}})

var serverpanel_container = (id =>  {return {
    id: 'project_tester_strategy_panel',
    type: 'panel',
    class:'sb_formcontainer',
    items: [
        serverpanel_addressgroup(id),             
        serverpanel_portgroup(id),
           
    ]
}})


var serverpanel_reconnectiongroup = (id =>  {return {
    id: 'serverpanel_reconnectiongroup',  
    class: 'sb_transform',
    type: 'group', 
    position: 'sb_end',    
    items : 
        [ 
            {id: 'reconnection_'+ id,    type: 'checkbox', item: 'Reconnection'}, 
        ]

}})

var serverpanel_httpgroup = (id =>  {return {
    id: 'serverpanel_httpgroup_' + id,
    type: 'group',                   
    position: 'me-auto',
    class:'sb_formcontainer serverpanel_httpgroup',    
    items : 
        [ 
            {id: 'secureradio_' + id, item: 'https', type :'radio', class: '', attributes: {checked: '', name: "radio_http"}, events: {onclick: "onclick_RadioServer('" + id + "', \'secure\')"}},
            {id: 'unsecureradio_' + id, item: 'http',  type :'radio', class: '', attributes: { name: "radio_http"}, events: {onclick: "onclick_RadioServer('" + id + "', \'unsecure\'))"}}, 
        ]

}})

var serverpanel_buttonsgroup = (id =>  {return {
    id:'serverpanel_buttonsgroup_' + id,
    type: 'panel',
    class:'sb_formcontainer serverpanel_buttonsgroup',
    items : 
        [
            
            {id: 'reset_' + id, item: 'Reset', type :'button',  class: 'sb_button',  events: {onclick: "onclick_ResetServer('" + id +  "' , this, event)"}},
            {id: 'apply_' + id, item: 'Apply',  type :'button', class: 'sb_button',  events: {onclick: "onclick_ApplyServer('" + id + "' , this, event)"}}, 
        ]

}})  


var serverpanel = ((id)  =>  {
    let label;
    switch (id) {
            case 'tradedesk' :
                label = 'MT4 Server';
            break;
            case 'emv' :
                label = 'EMV Router Server';  
            break;
            case 'project' :
                label = 'Deploy Server';  
            break;
            case 'netprog' :
                label = 'NetProg Server';  
            break;
        }    
    
    
    return {
    id: 'serverpanel_' + id,
    type: 'panel',
    class: 'serverpanel',
    items: [  
        {id: '', type: 'label', class: "sb_f_style_h6", item: label},                 
        {
            id : 'serverpanel_close', 
            type: 'bar',
            direction: 'row',  
            class: "sb_column",
            items: [
                {id: '', title: 'Close', type :'button', class: 'sb_sbutton',  icon:icon_times,  events: {onclick: "onclick_CloseServer('" + id + "', this, event)"}},

            ]
        },         
        {
            id : 'serverpanel_bar', 
            type: 'bar',
            direction: 'row',  
            items: [
                serverpanel_httpgroup(id),
                serverpanel_reconnectiongroup(id),                
            ]
        },
        serverpanel_container(id),         
        serverpanel_buttonsgroup(id)                
    ]

}})


var settingspanel = (id =>  {return {
    id:'settingspanel_' + id,
    type: 'panel',
    class: 'sb_panel',
    items: [
        themepanel(id),
        //serverpanel(id),
    ]
}})

var modalserverpanel = (id =>  {return {
    id: 'modalserverpanel_' + id,    
    type : 'panel',
    class: 'sb_panel modalserverpanel',
    items: [
        serverpanel(id)
    ]
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
