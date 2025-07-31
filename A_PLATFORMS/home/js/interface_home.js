

//---------------------------------------------------- GLOBAL NEWS PANEL     ------------------------------------------------   


var tradedesk_assistantpanel = {
    id : 'tradedesk_assistantpanel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    style: (assistant_mode ? 'display:block' : 'display:none'),
    content: 'tradedesk_AssistantPanel()'    
}

var emv_assistantpanel = {
    id : 'emv_assistantpanel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    content: 'emv_AssistantPanel()'    
}
//------------------------------------------------------------ MAIN PANELS----------------------------------------------------------

var home_trading_leftsection = {
    id: 'home_trading_leftsection', 
    type: 'panel',       
    class: 'home_leftsection presentationpanel sb_column sb_left', 
    items: [
        {id: 'presentation', type: 'html',  class: 'sectioncontainer sb_column', content: "trading_PresentationPanel()"},   
        {id: 'profile',      type: 'html',  class: 'sb_column',                  content: "ProfilePanel()"     },   
    ]
}

var home_trading_rightsection = {
    id: 'home_trading_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_panel sb_main',      
    items: [
        {id: 'frontbar',   type: 'html',  class: 'sectioncontainer',  content: "trading_MainCarouselPanel()" },        
        ],
}

var home_emv_leftsection = {
    id: 'home_emv_leftsection', 
    type: 'panel',       
    class: 'home_leftsection presentationpanel sb_column sb_left', 
    items: [
        {id: 'presentation', type: 'html',  class: 'sectioncontainer sb_column', content: "emv_PresentationPanel()"},   
        {id: 'profile',      type: 'html',  class: 'sb_column',                  content: "ProfilePanel()"     },   
    ]
}

var home_emv_tree_steps = {
    id: "home_emv_tree_steps",
    type: "html",
    class: "sb_panel sb_main",
    content: 'home_steps_diagram()',
};


var home_emv_rightsection = {
    id: 'home_emv_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_panel sb_main',      
    items: [
        {id: 'frontbar',   type: 'html',  class: 'sectioncontainer',  content: "emv_MainCarouselPanel()" },        
        ],
}

var home_netprog_leftsection = {
    id: 'home_netprog_leftsection', 
    type: 'panel',       
    class: 'home_leftsection presentationpanel sb_column sb_left',     
    items: [
        {id: 'presentation', type: 'html',  class: 'sectioncontainer sb_column', content: "netprog_PresentationPanel()"},   
        {id: 'profile',      type: 'html',  class: 'sb_column',                  content: "ProfilePanel()"     },           
    ]
}


var home_netprog_rightsection = {
    id: 'home_netprog_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_main',    
    items: [
    {id: 'frontbar',   type: 'html',  class: 'sectioncontainer',  content: "netprog_MainCarouselPanel()" },            

    ],
}



var home_section = {
    id: 'home_section', 
    type: 'panel',       
    class: 'sb_panel sb_row home_section',
    items: [
        home_trading_leftsection,
        home_trading_rightsection,
        home_emv_tree_steps        
    ] 
}
var home_projects_group = {
    id: 'home_projects_group',
    type: 'group',         
    toggle : true,
    items :
        [        
        {id: 'home_mainbar_trading', type: 'button',  item: 'Trading',   class: 'sb_mbutton checked',  events: {onclick: "onclick_home_mainbar(this, event)"},  title: 'Trading Projects'},                 
        {id: 'home_mainbar_emv',     type: 'button',  item: 'EMV',       class: 'sb_mbutton',  events: {onclick: "onclick_home_mainbar(this, event)"},  title: 'EMV Project'},                 
        {id: 'home_mainbar_netprog', type: 'button',  item: 'NetProg',   class: 'sb_mbutton',  events: {onclick: "onclick_home_mainbar(this, event)"},  title: 'NetProg Project '},                 
        {id: 'home_mainbar_other',   type: 'button',  item: 'Other',     class: 'sb_mbutton',  events: {onclick: "onclick_home_mainbar(this, event)"},  title: 'Other Projects'},        
        ]
}

var home_mainbar = {
    id: 'home_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
            home_projects_group
        ]
}    

//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------

var home_sidebarmenu  = {
    id: 'home_sidebarmenu', 
    type: 'bar',
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',      
    items: 
    [
        {
            position: '',
            id: 'home_sidebar',
            type: 'group',
            direction:'column',
            toggle : false,
            items :  
                [
                    {id: 'sidebar_home',     type: 'link', icon:  icon_files, title: 'Home',    events: {onclick: "onclick_sidebarmenu(this.id)"}},
                ]
            }, 
            settingsgroup(HOME_PLATFORM_PNAME),
    ]
}



var home_main = {
    id: 'home_main', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_column',
    events: {ondragover: "allowDrop(event)", ondrop: "ondrop_home_main(event)"},      
    items: [
        home_mainbar,
        home_section,
       // {id: 'home_section_drag', type:'drag', direction:'horizontal', dragid: 'home_section'},            
    ],
}

var homeplatform = {
    id : HOME_ID,
    name : HOME_PLATFORM_NAME, 
    pname: HOME_PLATFORM_PNAME,

    type: 'root',
    class: 'sb_column',  
    items: [
        {
            id:'',
            type: 'panel',
            class: 'sb_panel sb_row sb_main',           
            items:[
                home_main
            ]
        }, 
        
    ],      
    brand: {
        title: 'JUREXTRADE', 
        logo: '/A_PLATFORMS/home/res/home.svg',
        events: {onclick: "openPopupContact()"}
    },        
    select: 'home_select(\'' + HOME_PLATFORM_PNAME + '\')',
    init:     'home_init()',    
  };

//--------------------------------------------------------------------------------------------------------------------------------------------------------