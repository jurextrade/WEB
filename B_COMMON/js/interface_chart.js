//-------------------------------------------------SEARCH PANEL ------------------------------------------------ 
  
var barstylemenu = [ 
    {id: 'candle',    text: 'Candles'},         
    {id: 'heikenashi',text: 'Heiken Ashi'},
    {id: 'ohlc',      text: 'Bars'}
 ]


var chartgroup = {
    position: '',
    id: 'chartgroup',
    type: 'group',         
    direction:'row',
    items : [
   //         {id: 'indicators',  item: 'Indicators',     type: 'button', icon: icon_sort, events: {onclick: 'onclick_indicators(this, event)'},   title: 'Add Existing Indicator to Chart'},
   //         {id: 'indicatorCreate',       type: 'link',    icon: icon_new, events: {onclick: 'onclick_indicatorCreate(this)'},     title: 'Add New Indicator'},      
            {id: 'barstyle',    item: '',               type: 'select',                  events: {onchange:'onchange_barstyle(this, event)'},    title :'Bar Style', value: 'Candles', menu: barstylemenu},    
            {id: 'grid',        item: 'Grid',           type: 'button',   toggle:true,   events: {onclick: 'onclick_grid(this, event)'},         title: 'Display Grid'},             
            {id: 'seperator',   item: 'Seperators',     type: 'button',   toggle:true,   events: {onclick: 'onclick_seperator(this, event)'},    title: 'Period Seperator'},         
            {id: 'levels',      item: 'Fractal Levels', type: 'button',   toggle:true,   events: {onclick: 'onclick_levels(this, event)'},       title: 'Fractal Levels'},           
            {id: 'pivot',       item: 'D1 Pivot',       type: 'button',   toggle:true,   events: {onclick: 'onclick_pivot(this, event)'},        title: 'Pivots Lines'},             
        ]
}

var panelgroup = {
    id: 'panelgroup',
    type: 'group',         
    class: 'sb_marginleft',
    position: 'sb_space',
    items :
        [        
            {id: 'shiftend',    item: 'Shift End',      type: 'button',                  events: {onclick: 'onclick_shiftend(this, event)'},     title: 'Shift to end of the chart'},
            {id: 'm_signalpanel',     item: 'Signals Panel',   icon: icon_signal, type: 'button',   toggle:true,   events: {onclick: 'onclick_signalpanel(this, event)'},    title: 'Show Indicators Signals'},  
       //     {id: 'm_markerpanel',     item: 'Markers Panel',   type: 'button',   toggle:true,   events: {onclick: 'onclick_markerpanel(this, event)'},    title: 'Show Markers'},  
        ]
}


var periodgroup = {
    position: 'sb_space',
    id: 'periodgroup',
    type: 'group',         
    toggle : true,
    items :
        [        
            {id: '0',     item: 'M1',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '1 minute'}, 
            {id: '1',     item: 'M5',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '5 minutes'}, 
            {id: '2',     item: 'M15',      type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '15 minutes'}, 
            {id: '3',     item: 'M30',      type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '30 minutes'}, 
            {id: '4',     item: 'H1',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '1 hour'}, 
            {id: '5',     item: 'H4',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '4 hours'}, 
            {id: '6',     item: 'D1',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '1 day'}, 
            {id: '7',     item: 'W1',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '1 week'}, 
            {id: '8',     item: 'MN',       type: 'button',   events: {onclick: 'onclick_period(this)'},   title: '1 month'} 
        ]
}

var pricegroup = {
    id: 'pricegroup',
    type: 'group',         
    class : '', 
    direction:'',
    items :
        [     
            {id: 'tabname',       item: '',        type: 'html',     title: ''} , 
            {id: 'tabperiod',     item: '',        type: 'html',     title: ''} , 
            {id: 'tabprice',      item: '',        type: 'html',     title: ''} , 
            {id: 'tabchange',     item: '',        type: 'html',     title: ''} 
        ]
}

var chart  = (pname =>  {return {           //react
    id:  pname + '_chart',
    type: 'panel',
    class: 'sb_panel chartcanvas',     
    events: {
            ondragover:   "allowDrop(event)", 
            ondrop:       "ondrop_chartcanvas (this, event)",
            },     
    items:[],
    catchresize: true,
    resizefunction: 'DrawChart("' + pname + '")',
}})

var chartspinner = (pname =>  {return {
    id: 'chartspinner_' + pname,
    type: 'html',
    class: 'spinner-border chartspinner',
}})

var markerspanel = (pname =>  {return {
    id: 'markerspanel_' + pname,
    type: 'html',
    class: 'chartmarkers',    
    content: 'MarkersPanel ("' + pname + '_chart", 4)',
}})

var signaleditor = (pname =>  {return {
    id: 'signaleditor_' + pname,
    type: 'panel',
    class: 'sb_panel signaleditor',   
}})

var chartmain = (pname => {return {
    id: 'chartmain_' + pname,
    type: 'panel',
    class: 'chartmain sb_row sb_main',    
    events: {
        onmouseenter: "onmouseenter_chartmain(this, event)",
        onmouseleave: "onmouseleave_chartmain(this, event)",      
        onmouseover:  "onmouseover_chartmain(this, event)",      
    },
    items: [
        {
           id: 'basicchartmain_' + pname,
           type: 'panel',
           class: 'sb_panel sb_main chart',
           style: "justify-content:center; align-items:center",
           items: [
                chart(pname),
                chartspinner(pname),
                markerspanel(pname),                
           ] 
        },
        signaleditor(pname),             
    ]
}})

var chartcontainer  = (pname =>  {return {
    id: 'chartcontainer_' + pname,
    type: 'panel',
    class: 'chartcontainer sb_row sb_main',    

    items: [
        chartmain(pname),
    ]
}})

var chartbar = (pname =>  {return {
    id: 'chartbar_' + pname, 
    type: 'bar',    
    class: 'chartbar',      
    items: 
        [pricegroup, chartgroup, periodgroup, panelgroup]
}})


var chartpanel = (pname =>  {return {
    id: 'chartpanel_' + pname,
    type: 'panel',
    class: 'sb_panel chartpanel sb_main',
    items: [
        chartbar(pname),
        chartcontainer(pname),
    ], 
}})

//------------------------------------------ Indicators

var indicatorbar ={
    id : 'indicatorbar', 
    type: 'bar',            
    items: 
        [                     
            { 
                type: 'group',                        
                position: 'me-auto',
                class: 'sb_transform',
                items:
                    [ 
                        {id: 'indicatorCreate',    icon: icon_new,   type:'link',  title: 'Add Indicator',     events: {onclick: "onclick_indicatorCreate(this)"}}                 
                    ]
            }
        ]
}

var tree_indicators = (id =>  {return {
    id: 'tree_indicators_' + id,       
    type: 'tree',       
    class:'rootindicators',
    item: 'Indicators',
    icon: icon_indicator,
    items:[
        {
            id: 'tree_createdindicators_' + id,       
            type: 'tree',       
            arrow: true,             
            item: 'Created Indicators',
            icon: icon_indicator,
            items:[
            ]

        },
        {
            id: 'tree_predefinedindicators_' + id,       
            type: 'tree',
            arrow: true,                    
            item: 'Predefined Indicators',
            icon: icon_indicator,
            items:[
            ]
        }
    ]
}})

var indicatorssidebar = (id =>  {return {
    id: 'indicatorssidebar_' + id, 
    type: 'panel',
    class: 'sb_panel',
    items:[tree_indicators(id)]
}})

var boxindicatorspanel = (id =>  {return {
    id: 'boxindicatorspanel_' + id, 
    type: 'box',
    closed: true, 
    header: {item: 'Indicators', items: [indicatorbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [indicatorssidebar(id)]    
}})



/////////////////////////////////////////////////


var alertssettingstable = {
    id: 'alertssettingstable',
    type: 'table',    
    class:'trackertable',        
    columns :  ['', 'Indicator',  'Signal', 'Vop', 'Value', 'Prev', 'Type', 'Logic',  'M1',  'M5',  'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN',  'EP', ''],
    columnstitle : ['', 'Indicator', 'Signal',  'Operation On Value', 'Value', 'Signal occuring on the previous Bar', 'Type of Search', 'Time Frames Combination',  '1 minute',  '5 minutes',  '15 minutes', '30 minutes', '1 hour', '4 hours', '1 day', '1 week', '1 month',  'Time Frame in which expert is running', 
    'Delete Alert'],
    rows : [] 
}



/////////////////////////////////////////////////

var charttoolsgroup= (id =>  {return {
    id: 'charttoolsgroup',
    type: 'group',                    
    direction: 'column',
    toggle : false,
    items :
        [     
            {id: 'sidebar_' + id  + 'charttools',  type: 'link',  icon:  icon_chart,   events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Chart tools'}                                
        ]           
}})

var charttools_header_panel = {
    id: 'charttools_header_panel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'Chart Tools',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var boxtrackerpanel  = (id =>  {return {
    id: 'boxtrackerpanel_' + id,
    type: 'box',
    closed: true,
    header: {item: 'Tracker',  control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL}},  
    items: [
        {
            id: 'nowork',
            type: 'panel',  
            class: 'sb_panel',
            items: [
                trackerpanel(id),
                markerpanel(id)
            ]
        },             
    ]     
}})

var charttoolspanel = (id =>  {return {
    id:'charttoolspanel_' + id,
    type: 'panel',
    class: 'sb_sidepanel sb_panel',
    items: [
            boxindicatorspanel(id),
//            boxtrackerpanel(id),
    ]
}})
