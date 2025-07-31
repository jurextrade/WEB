var netprog_home_leftsection = {
    id: 'netprog_home_leftsection presentationpanel', 
    type: 'panel',       
    class: 'home_leftsection',    
    items: [
        {
            id: 'presentation',   
            type: 'html',              
            class: 'sectioncontainer  sb_column',  
            content: "netprog_PresentationPanel()"        
        }, 
        {
            id: 'profile',   
            type: 'html',              
            class: 'sectioncontainer presentationpanel sb_column',   
            content: "ProfilePanel()"        
        },             
    ]
}

var netprog_home_rightsection = {
    id: 'netprog_home_rightsection', 
    type: 'panel',       
    class: 'home_rightsection sb_column sb_left sb_main',    
    items: [
        {
            id: 'frontbar',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "netprog_MainCarouselPanel()"        
        },        
        {
            id: 'getstarted',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "netprog_GetStartedSection_Panel()"        
        },   
        {
            id: 'tools',   
            type: 'html',              
            class: 'home_section1 sectioncontainer', 
            content: "netprog_ToolsSection_Panel()"        
        },   
    ],
}

var netprog_home_section = {
    id: 'home_section', 
    type: 'panel',       
    class: 'sb_panel sb_row home_section',
    items: [
        netprog_home_leftsection,
        netprog_home_rightsection,
    ] 
}
var netprog_home_panel = {
    id: 'netprog_home_panel',
    type: 'html',
    class: 'sb_panel',      
    content : 'Vue_netprog_Main("Machine")',
    events: {
        ondrop: "ondrop_home_panel(this, event)",
        ondragover:"{event.preventDefault()}",        
    }
}