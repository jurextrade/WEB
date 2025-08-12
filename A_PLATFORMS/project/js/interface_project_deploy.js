
//--------------------------


var project_deploy_headerbar = {
    id: 'project_deploy_headerbar',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    style:'z-index:6',      
    items : 
    [
        {id: '',                type: 'link',    item: 'DEPLOY PANEL',  class: 'sb_sidebarheadertitle'}, 
        {id: 'label_server',    item: 'Deploy Server', type: 'link',  icon: icon_connection, events: {onclick: "onclick_button_server (this, event)"}, title: 'DEPLOY SERVER'},
        {id: 'button_server',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_server (this, event)"}, title: 'Deploy Server'},        
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}


var project_deploy_headerpanel = {
    id: 'project_deploy_headerpanel',
    type : 'panel',
    class: 'sb_column',    
    style:'position:relative',      
    items : 
    [
        project_deploy_headerbar,
        modalserverpanel('project'),
    ]
}

//--------------------------

var project_tree_experts = {
    id: 'project_tree_experts',       
    type: 'tree',       
    item: 'MQ4 Experts',
    icon: icon_strategy,
    items:[]
} 

var project_tree_expertspanel = {
    id: 'project_tree_expertspanel',
    type : 'panel',
    class: 'sb_panel',    
    items : 
    [
        project_tree_experts
    ]    
}

var project_expertsbar = {
    id : 'project_expertsbar', 
    type: 'bar',            
    items: 
        [                    
            { 
                type: 'group',                        
                position: 'me-auto',
                class: 'sb_transform',
                items:
                    [ 
                        {id: 'expertDownload',    icon: icon_download,   type:'link',  title: 'Download MT4 Expert',     events: {onclick: "onclick_expertDownload(this)", style:"display:none"}}                 
                    ]
            }
        ]
}



var project_boxexpertspanel = {
    id: 'project_boxexpertspanel',
    type: 'box',
    closed: true, 
    header: {item: 'Expert Advisers', items: [project_expertsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [project_expertsidepanel]    
}

var distributetable =  {
    id: 'distributetable',
    type: 'table',            
    columns :  ['Terminal', 'Platform', 'Strategy Tester'],
    columnstitle : ['Terminal', 'Platform', 'Strategy Tester'],
  

    rows : [] 
}

var project_distributepanel = {
    id: 'project_distributepanel',
    type: 'panel',
    class: 'sb_formcontainer',
    items: [
            {id : 'distributebar', type : 'bar', items: [
                {id: 'd_terminals',  type: 'label',    item: 'MT4 Terminals',  class: 'sb_link', title: 'Terminals'},  
                {
                    id: 'd_commands',
                    type: 'group',                        
                    position: 'sb_end',
                    direction:'row',
                    items:[{id: 'd_refresh',   type: 'button', item: 'Refresh', class: 'sb_sbutton',   events: {onclick: "onclick_refresh_terminals (this, event)"}, title: 'Refresh'}]
                },
                ]
            },
            distributetable,
            { 
                id: "project_distributebuttons",
                type: 'panel',                        
                class: 'sb_row',
                items:
                    [ 
                        {id: 'distributeproject',   type: 'button', item: 'Deploy Project', class: 'sb_sbutton',   events: {onclick: "onclick_distributeproject (this, event)"}, title: 'Distribute on selected Terminals'},
                        {id: 'distributeexpert',   type: 'button', item: 'Deploy Expert File', class: 'sb_sbutton',   events: {onclick: "onclick_distributeexpert (this, event)"}, title: 'Copy the selected file in the selected MT4 Terminal Experts Folder'},
                    ]
            }            

    ],     
}

var project_expertsidepanel = {
    id: 'project_expertsidepanel',
    type: 'panel',
    class: 'sb_column sb_main sb_formcontainer',
    items:[
          {id : 'expertsbar', type : 'bar', items: [
                {id: 'd_experts',  type: 'label',    item: 'MQ4 Experts Folder',  class: 'sb_link', title: 'Compiled Experts that can be tested on your MT4 Terminal'},  
                {
                    id: 'd_commands',
                    type: 'group',                        
                    position: 'sb_end',
                    direction:'row',
                    items:[{id: 'd_refresh',   type: 'button', item: 'Refresh', class: 'sb_sbutton',   events: {onclick: "onclick_refresh_experts (this, event)"}, title: 'Refresh'}]
                },
                ]
            },
        project_tree_expertspanel,
        ]
    }
//var deploypanel = {
//    id: 'deploypanel',
//    type: 'html',
//    class: 'sb_panel sb_main sb_column',
//    content: "DistributePanel ('project_distributepanel', 'sb_column sb_bargroup sb_formcontainer')"
//}

var deploypanel = {
    id: 'deploypanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items:[
        project_distributepanel,
        project_expertsidepanel        
//        project_boxexpertspanel,        
    ],
}
