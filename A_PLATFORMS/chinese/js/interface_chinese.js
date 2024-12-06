var CHINESE_ID = "chinese_root";
var CHINESE_PLATFORM_PNAME = "chinese";
var CHINESE_PLATFORM_NAME = "Learn Chinese";

var chinese_hsk_table = {
    id: 'chinese_hsk_table',
    type: 'table',            
    events: {onclick: "onclick_hskrow(this, event)"},         
    class: '',
    columns :  ['ID', 'CH', 'PIN', 'ENG', 'LEVEL', 'PIN_S', 'ENG_S', 'CH_S', 'ATTR'],
    columnstitle : ['ID', 'CH', 'PIN', 'ENG', 'LEVEL', 'PIN_S', 'ENG_S', 'CH_S', 'ATTR'],
    rows : [
    ] 
}

//----------------------------------------------------------------<<< PANEL >>>-----------------------------------------------------------------------

var chinese_sidebaremenu = {
    id: 'chinese_sidebaremenu',
    type: 'bar',
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',       
    items : 
    [
        {
            position: '',
            id: 'chinese_sidebaremenu_maingroup',
            type: 'group',                    
            direction: 'column',
            toggle : false,
            items : 
            [
            ]
        }, 
    ]
}

var chinese_sidebarpanel  = {
    id: 'chinese_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',     
    items : 
    [
       

    ]
}


var chinese_mainbar = {
    id: 'chinese_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [ 
            {id: 'chinese_hanzi_writer',     type: 'html'},            
        ]
}    


var chinese_toppanel = {
    id : 'chinese_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        chinese_mainbar,       
        chinese_hsk_table,
    ],
}

var chinese_bottompanel = {
    id : 'chinese_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    items: [
    ],
    bottomheight: 270,          
}

var chinese_main = {
    id: "chinese_main",
    type: "panel",
    class: "sb_panel sb_datatable sb_main sb_column",
  
    items: [
        chinese_toppanel,
     //   {id: 'chinese_mainpanel_drag',  class: 'sb_none', type:'drag', direction:'horizontal', dragid: 'chinese_bottompanel'},             
     //   chinese_bottompanel,        

    ]
};

var chineseplatform = {
    id: CHINESE_ID,
    name: CHINESE_PLATFORM_NAME,
    pname: CHINESE_PLATFORM_PNAME,

    type: "root",
    class: "sb_row",
    items: [
        chinese_sidebaremenu, 
        chinese_sidebarpanel, 
        {id: '', type:'drag', class:'sb_none', direction:'vertical', dragid: 'chinese_sidebarpanel'},           
        chinese_main],  
    select: 'chinese_select(\'' + CHINESE_PLATFORM_NAME + '\')',   
    init: 'chinese_init()',       
    end: 'chinese_end()',     
}