var market_searchgroup = {
    id: 'market_searchgroup',
    type: 'group',
    items: [
        {id: 'search_quote',  type: 'search', item: 'Symbol',
            title: 'Search Yahoo Symbol',      
            attributes: {funcname: "SearchQuote", placeholder: "Yahoo Ticker",  autocomplete: "off"}, 
            events: {onkeypress: "onkeypress_searchquote(event, this)"},
            style: "text-transform:uppercase;",
            submit: "onclick_searchquote(this)",
        } 
    ]
}

var market_indicatorsgroup = {
    id: 'market_indicatorsgroup',
    type: 'group',
    items: [
        {id: 'indicators',  item: 'Indicators',     type: 'button', icon: icon_sort, events: {onclick: 'onclick_indicators(this, event)'},   title: 'Add Existing Indicator to Chart'},
        {id: 'indicatorCreate',       type: 'link',    icon: icon_new, events: {onclick: 'onclick_indicatorCreate(this)'},     title: 'Add New Indicator'},      
    ]
}

var market_markersgroup = {
    id: 'market_markersgroup',    
    type:'group',  
    class : 'sb_controls', 
    item: 'Markers',
    items :
        [  
            {id: 'Markers',  item: 'Markers',     type: 'link',  events: {onclick: 'onclick_markers(this, event)'},   title: 'Add Existing Indicator to Chart'},
            {id: 'slide',    type:'control',  class : 'box-btn-slide rotate-180',       events: {onclick: "onclick_markettogglepanel (this, event)"}, title: ''},  
        ]
}

/*--------------------------------------------------------- NEWS PANEL --------------------------------------------------------------*/

var market_newsgroup = {
    id: 'market_newsgroup',
    position: '',    
    type: 'group',   
    class: 'sb_marginleft', 
    items:
        [
            {id: 'newslink',    type: 'link', item:'', class: 'NewsLink', attributes: {readonly:''}, events: {onclick: 'onclick_newsLink(event)'}, title: 'Economic News of the week'}  
        ]
}   

var market_bar = {
    id : 'market_bar',
    type : 'bar',
    class: 'sb_bottom',
    items: [
        market_searchgroup,  
        market_indicatorsgroup,            
        market_markersgroup,
        market_newsgroup,
        {id: 'market_forexgroup',  class: 'sb_row sb_marginleft',  type: 'ihtml',   content: 'forexmarket_panel()'},   
        {id: 'USMARKETS',    class: 'marketschedule', type: 'text', disabled: true},   
        {id: 'slide',    type:'control',  class : 'box-btn-slide rotate-180',       events: {onclick: "onclick_tickertogglepanel (this, event)"}, title: 'Market Snapshot'},  
    ]
}

var tickerpanel = {
    id : 'tickerpanel',
    type : 'html',
    class: 'sb_row sb_main',    
}

var tickerbuttons = {
    id : 'tickerbuttons',
    type : 'html',
    class: 'sb_row assistant_buttons',
    content: "tickerbuttons_panel()",
}

var market_snapshot = {
    id : 'market_snapshot',
    type : 'panel',
    class: 'sb_row sb_bottom',
    items: [
        tickerpanel,
        tickerbuttons,
    ]

}

var toolspanel = {
    id : 'toolspanel',
    type : 'panel',
    class: 'sb_panel sb_row',
    items: [
        markerpanel('market'),       
        {id: '', type:'drag', class:'', direction:'vertical', dragid: 'markerpanel_market'},    
        trackerpanel('market'),          
    ]
}                

var tools_panel = {
    id : 'tools_panel',
    type : 'panel',
    class: 'sb_panel sb_tools_panel',
    items: [
        toolspanel,        
    ]    
}

var marketpanel = {
    id : 'marketpanel',
    pname: 'market',
    type : 'panel',
    class: 'sb_column',
    init: 'market_init()',
    end: 'market_end',
    items: [
        market_bar,
        market_snapshot,        
        tools_panel,         
    ]
}
