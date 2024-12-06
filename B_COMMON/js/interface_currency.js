//------------------------------------------------------------ SEARCH SYMBOL PANEL ----------------------------------------------------------

var currencysearchgroup = {
    id: 'currencysearchgroup',
    type: 'group',
    position:'sb_end',
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

var currencybar  = (pname =>  {return {  
    id:  pname + '_currencybar', 
    type: 'bar',    
    direction: 'row',     
    items: [currencysearchgroup,
            {id: 'currency_delete',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_currencyremove()"},  title: 'Delete Current Symbol'},              
    ], 
}})

var currencytable  = (pname =>  {return {  
    id:  pname + '_currencytable',
    type: 'table',  
    sortable: "market_updatesymbols()",          
    events: {onclick: "onclick_currencyrow(this, event)", ondblclick: "ondblclick_currencyrow(this, event)"},
    columns :  ['Symbol', 'Type', 'Ticker', 'Last Price', 'Change','% Change'],
    columnstitle : ['Symbol', 'Type', 'Ticker', 'Last Price', 'Change','% Change'],
    rows : [] 
}})


var currencybox  = (pname =>  {return {  
    id: pname + '_currencybox',
    type: 'box',
    pname: 'currency',
    closed: false, 
    header: {id: 'currency_slide',  item: 'market',  items:[currencybar(pname)], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL}},  
    items: [currencytable(pname)]   
}})

var currencypanel  = (pname =>  {return {  
    id: pname + '_currencypanel',
    type: 'panel',
    class: 'sb_main sb_pane currencypanel',
    items: [currencytable(pname)]   
}})