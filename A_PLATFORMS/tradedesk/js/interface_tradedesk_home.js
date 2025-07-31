


var tradedesk_assistant_panel = {
    id : 'tradedesk_assistant_panel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    style: (assistant_mode ? 'display:block' : 'display:none'),
    content: 'tradedesk_AssistantPanel()'    
}

//--------------------------------------------------------------------- HOME PANEL  --------------------------------------------------------------------

var tradedesk_home_leftsection = {
    id: 'tradedesk_home_leftsection', 
    type: 'panel',       
    class: 'home_leftsection presentationpanel',
    items: [
        {
            id: 'presentation',   
            type: 'html',              
            class: 'sectioncontainer  sb_column', 
            content: "tradedesk_PresentationPanel()"        
        },   
        {
            id: 'profile',   
            type: 'html',              
            class: 'sectioncontainer  sb_column',   
            content: "ProfilePanel()"        
        },           
    ]
}

var tradedesk_home_rightsection = {
    id: 'tradedesk_home_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_main',    
    items: [
        {
            id: 'frontbar',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "tradedesk_MainCarouselPanel()"        
        },        
        {
            id: 'getstarted',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "tradedesk_GetStartedSection_Panel()"        
        },   
        {
            id: 'tools',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "tradedesk_ToolsSection_Panel()"        
        },   
    ],
}

var tradedesk_home_main = {
    id: 'tradedesk_home_main', 
    type: 'panel',       
    class: 'sb_panel sb_row home_section',
    items: [
        tradedesk_home_leftsection,
        tradedesk_home_rightsection,
    ] 
}

var tradedesk_assistantpanel = {
    id : 'tradedesk_assistantpanel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    content: 'tradedesk_AssistantPanel()'    
}
