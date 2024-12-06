

var headerbar_user = { 
    id: 'headerbar_user',    
    position: 'sb_end',
    type: 'group',     
          
    items:
        [ 
            {id: 'username',        type:'ihtml',  content: 'UserProfileName()'},
            {id: 'userprofilemenu', type: 'html', class: 'sb_profilemenu sb_bar sb_left sb_column dropdown',  content : 'UserProfileMenu ()', title: ''}  
        ]
}       


var headerbar_items = { 
    id: 'headerbar_items',    
    type: 'group',
    position: 'me-auto',
    toggle: true,                
    items: [],
}

var header = {
    id: 'header',
    type:'header',
    class: '',
    events: {ondblclick: 'ondblclick_header()'},    
    brand: {
        title: 'YOUR SITE', 
        logo: '/res/UnderCon_black.png',
        events: {onclick: ""}
    },    
    items: [         
        headerbar_user,
    ]    
}

var main = {
    id:'main',
    type: 'main',
    class: 'sb_column',  
    items: []
}

var right = {
    id:'right',
    type: 'panel',
    class: 'sb_row',  
    items: [
      
    ]
}

var left = {
    id:'left',
    type: 'panel',
    class: 'sb_row',  
    items: [
    ]
 }


var Main = {
    id:'Main',
    type: 'panel',
    class: 'sb_main sb_row',  
    items: [
        left, 
        main, 
        right, 
        ]
  }    

var footer = {
    id:'footer',
    type: 'footer',
    class:'sb_row',
    items: [
    ]
}

var body = {
    id: 'body',    
    type: 'body',
    items : [header, Main, footer]
 }