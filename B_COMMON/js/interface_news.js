//---------------------------------------------------- NEXT NEWS PANEL     ------------------------------------------------   

var news_calendartable = {
    id: 'news_calendartable',
    type: 'table', 
    class :'newsclass',
    columns :  ['Day', 'Date', 'GMT', 'Currency', 'Event', 'Importance',  'Forecast', 'Previous'],
    columnstitle : ['Day', 'Date', 'GMT', 'Currency', 'Event', 'Importance', 'Forecast', 'Previous'],
    rows : [] 
}

var news_calendarbox = {
    id: 'news_calendarbox',
    type: 'box',
    closed: true, 
    header: {item: 'Weekly Calendar', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [news_calendartable]
}    


var news_forextable = {
    id: 'news_forextable',
    type: 'table',
    events: {onclick: "onclick_forexnewsrow(this, event)"},
    columns : ['Latest Forex News', 'Chart'],
    columnstitle : ['Latest Forex News', 'Chart'],
  //  columnsstyle: ['max-width:300px;padding-left:10px;', 'padding-right:10px;text-align:center;min-width:50px;width:50px;'],
    rows : [] 
}

var news_forexbox = {
    id: 'news_forexbox',
    type: 'box',
    closed: false, 
    header: {item: 'Forex News', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL} },  
    items: [news_forextable]
}    

var news_nextcalendartable = {
    id: 'news_nextcalendartable',
    type: 'table',    
    class: 'newsclass',
    columns :  ['Day', 'Date', 'GMT', 'Currency', 'Event', 'Importance',  'Forecast', 'Previous'],
    columnstitle : ['Day', 'Date', 'GMT', 'Currency', 'Event', 'Importance', 'Forecast', 'Previous'],
    rows : [] 
}

var news_nextcalendarbox = {
    id: 'news_nextcalendarbox',
    type: 'box',
    closed: true, 
    header: {item: 'Next News', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [news_nextcalendartable]
}    

var newspanel = {
    id: 'newspanel',
    pname: 'news',    
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items: [
        news_nextcalendarbox,
        news_forexbox,
        news_calendarbox,        
    ],
    init: 'news_init()',   
    end:  'news_end()',          
}