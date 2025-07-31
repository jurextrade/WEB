


var project_assistant_panel = {
    id : 'project_assistant_panel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    style: (assistant_mode ? 'display:block' : 'display:none'),
    content: 'project_AssistantPanel()'    
}

//--------------------------------------------------------------------- HOME PANEL  --------------------------------------------------------------------

var project_home_leftsection = {
    id: 'project_home_leftsection', 
    type: 'panel',       
    class: 'home_leftsection presentationpanel',
    items: [
        {
            id: 'presentation',   
            type: 'html',              
            class: 'sectioncontainer  sb_column', 
            content: "project_PresentationPanel()"        
        },   
        {
            id: 'profile',   
            type: 'html',              
            class: 'sectioncontainer  sb_column',   
            content: "ProfilePanel()"        
        },           
    ]
}

var project_home_rightsection = {
    id: 'project_home_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_main',    
    items: [
        {
            id: 'frontbar',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "project_MainCarouselPanel()"        
        },        
        {
            id: 'getstarted',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "project_GetStartedSection_Panel()"        
        },   
        {
            id: 'tools',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "project_ToolsSection_Panel()"        
        },   
    ],
}

var project_home_main = {
    id: 'project_home_main', 
    type: 'panel',       
    class: 'sb_panel sb_row home_section',
    items: [
        project_home_leftsection,
        project_home_rightsection,
    ] 
}

var project_assistantpanel = {
    id : 'project_assistantpanel',
    type : 'html',
    class: 'sb_column home_assistantpanel',
    content: 'project_AssistantPanel()'    
}
