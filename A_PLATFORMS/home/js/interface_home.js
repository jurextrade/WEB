var homealertbar = {
    id : 'homealertbar', 
    type: 'bar',
    class:'sb_transform',
    items: 
        [
            { 
                type: 'group',                        
                position: 'sb_end',
                items :
                    [ 
                        {id: 'alertbar_add',    icon: icon_plus,   type:'link',  title: 'Add Alert',    events: {onclick: "FrontPageAddIndicator(this)"}}                 
                    ]
            }
        ]
} 

//---------------------------------------------------- GLOBAL NEWS PANEL     ------------------------------------------------   


var mt4assistantpanel = {
    id : 'mt4assistantpanel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    style: (assistant_mode ? 'display:block' : 'display:none'),
    content: 'MT4AssistantPanel()'    
}


//------------------------------------------------------------ MAIN PANELS----------------------------------------------------------

var home_leftsection = {
    id: 'home_leftsection', 
    type: 'panel',       
    class: 'home_leftsection sb_row', 
    items: [
        {
            id: 'presentation',   
            type: 'html',              
            class: 'sectioncontainer presentationpanel sb_column',   
            content: "PresentationPanel()"        
        },   
    ]
}

var home_rightsection = {
    id: 'home_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_main',      
    items: [
        {
            id: 'frontbar',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "MainCarouselPanel()"        
        },        
        {
            id: 'getstarted',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "GetStartedSection_Panel()"        
        },   
        {
            id: 'tools',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "ToolsSection_Panel()"        
        },   
    ],
}

var home_section = {
    id: 'home_section', 
    type: 'panel',       
    class: 'sb_panel sb_row home_section',
    items: [
        home_leftsection,
        home_rightsection,
    ] 
}

var home_mainbar = {
    id: 'home_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
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
//        home_mainbar,
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