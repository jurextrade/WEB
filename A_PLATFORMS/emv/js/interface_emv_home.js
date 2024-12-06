//--------------------------------------------------------------------- HOME PANEL  --------------------------------------------------------------------

var emv_home_leftsection = {
    id: 'emv_home_leftsection', 
    type: 'panel',       
    class: 'home_leftsection sb_row',
    items: [
        {
            id: 'presentation',   
            type: 'html',              
            class: 'sectioncontainer presentationpanel sb_column', 
            content: "emv_PresentationPanel()"        
        },   
    ]
}

var emv_home_rightsection = {
    id: 'emv_home_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_main',    
    items: [
        {
            id: 'frontbar',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "emv_MainCarouselPanel()"        
        },        
        {
            id: 'getstarted',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "emv_GetStartedSection_Panel()"        
        },   
        {
            id: 'tools',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "emv_ToolsSection_Panel()"        
        },   
    ],
}

var emv_home_main = {
    id: 'emv_home_main', 
    type: 'panel',       
    class: 'sb_panel sb_row home_section',
    items: [
        emv_home_leftsection,
        emv_home_rightsection,
    ] 
}

var emv_assistantpanel = {
    id : 'emv_assistantpanel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    content: 'emv_AssistantPanel()'    
}