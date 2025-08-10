const ID_MANUALSESSION         = 0;
const ID_DATASESSION           = 1;
const ID_SUSPENDSESSION        = 2;
const ID_RESTARTSESSION        = 3;
const ID_CLOSEBUYSESSION       = 4;
const ID_CLOSESELLSESSION      = 5;
const ID_CLOSESESSION          = 6;
const ID_KEEPBUYSELLSESSION    = 7;
const ID_RELEASEBUYSELLSESSION = 8;
const ID_EXITBUYSESSION        = 9;
const ID_EXITSELLSESSION       = 10;
const ID_EXITSESSION           = 11;
const ID_HEDGESESSIONBUY       = 12;
const ID_UNHEDGESESSIONBUY     = 13;
const ID_HEDGESESSIONSELL      = 14;
const ID_UNHEDGESESSIONSELL    = 15;
const ID_SPACE                 = 16;
const ID_SEPERATOR             = 17;

const SessionMenu = [
	{ id: ID_MANUALSESSION ,        text: "Inspect",        tooltip : 'Modify Strategy',  icon : 'fas fa-glasses '},
	{ id: ID_DATASESSION ,          text: "Orders",         tooltip : 'Visualize Orders'},
	{ id: ID_SUSPENDSESSION ,       text: "Suspend",        tooltip : 'Suspend Session'},
	{ id: ID_RESTARTSESSION ,       text: "Restart",        tooltip : 'Restart Session'},
	{ id: ID_CLOSEBUYSESSION ,      text: "Close Buy",      tooltip : 'Close Buy Orders'},
	{ id: ID_CLOSESELLSESSION ,     text: "Close Sell",     tooltip : 'Close Sell Orders'},
	{ id: ID_CLOSESESSION ,         text: "Close",          tooltip : 'Close Sell Orders'},
	{ id: ID_KEEPBUYSELLSESSION ,   text: "KeepBuySell",  tooltip : 'Keep BuySell Orders'},
	{ id: ID_RELEASEBUYSELLSESSION, text: "ReleaseBuySel", tooltip : 'Release BuySell Orders'},
	{ id: ID_EXITBUYSESSION ,       text: "Exit Buy",       tooltip : 'Exit Buy Orders'},
	{ id: ID_EXITSELLSESSION ,      text: "Exit Sell",      tooltip : 'Exit Sell Orders'},
	{ id: ID_EXITSESSION ,          text: "Exit",           tooltip : 'Exit Session'},
	{ id: ID_HEDGESESSIONBUY,       text: "Hedge Buy",      tooltip : 'Hedge Buy Orders'},
	{ id: ID_UNHEDGESESSIONBUY,     text: "DeHedge Buy",    tooltip : 'DeHedge Buy Orders'},
	{ id: ID_HEDGESESSIONSELL ,     text: "Hedge Sell",     tooltip : 'Hedge Sell Orders'},
	{ id: ID_UNHEDGESESSIONSELL,    text:  "DeHedge Sell", tooltip : 'DeHedge Sell Orders'},
	{ id: ID_SPACE ,                text: ""},
	{text:  "--"}	
];

const ID_CLOSEORDER            = 0;
const ID_MODIFYORDER           = 1;

const OrderMenu = [
	{ id: ID_CLOSEORDER ,       text: "Close",        tooltip : 'Close Order' },
	{ id: ID_MODIFYORDER ,      text: "Modify",       tooltip : 'Modify Order'},
];


TradedeskSettingsSignalsTable = {
    id: 'tradedesksettingssignalstable',
    columns :  ['Signal', 'Color', 'Display', 'Sound'],
    columnstitle : ['Signal', 'Color', 'Display', 'Sound'],
    rows : []
}

var TradedeskSettingsIndicatorsTable = {
    id: 'tradedesksettingsindicatortable',
    columns :  ['Indicator', 'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'],
    columnstitle : ['Indicator', '1 minute', '5 minutes', '15 minutes', '30 minutes', '1 hour', '4 hours', '1 day', '1 week', '1 month'],
    rows : [
        ['Up Fractals', '', '', '', '', '', '', '', '', ''], 
        ['Down Fractals', '', '', '', '', '', '', '', '', ''], 
        ['Up Fractals Target', '', '', '', '', '', '', '', '', ''], 
        ['Down Fractals Target', '', '', '', '', '', '', '', '', ''], 
        ['Resistance', '', '', '', '', '', '', '', '', ''], 
        ['Support' , '', '', '', '', '', '', '', '', ''],  
        ['Pivots Line', '', '', '', '', '', '', '', '', ''],  
        ['Fibo Line' , '', '', '', '', '', '', '', '', ''],  
        ['Patterns', '', '', '', '', '', '', '', '', '']       
    ] 
}  

var tradedesksettingsindicatorspanel = {
    id: 'tradedesksettingsindicatorspanel',
    type: 'html',
    class: 'sb_panel sb_column',
    content: 'TradedeskSettingIndicatorsPanel()',
}

var tradedesksettingsdisplaypanel = {
    id: 'tradedesksettingsdisplaypanel',
    type: 'html',
    class: 'sb_panel sb_row sb_right',
    content: 'TradedeskSettingsDisplayPanel()',
}
var tradedesksettingssignalspanel = {
    id: 'tradedesksettingssignalspanel',
    type: 'html',
    class: 'sb_panel sb_column',
    content: 'TradedeskSettingsSignalsPanel()',
}


var tradedesksettingstabs = {
    id:'tradedesksettingstabs',
    label : 'tradedesksettingstabs',    
    items :
        [ 
            {id: 'tab_chart',    item: 'Chart',   icon: icon_chart,  items : [tradedesksettingsindicatorspanel],      title: 'Chart Indicators'},           
            {id: 'tab_panel',    item: 'Panel',   icon: icon_signal, items : [tradedesksettingsdisplaypanel],title: 'SIgnals to Display'},           
            {id: 'tab_signals',  item: 'Signals', icon: icon_alerts, items : [tradedesksettingssignalspanel], title: 'Configure Signals'}        
        ]
} 

var sessionscommandgroup = {
    position: 'me-auto',
    id: 'sessionscommandgroup',
    type: 'group',
    direction:'',
    toggle : false,
    items :
        [        
            {id: 'exitall',       item: 'Exit All',         type: 'button',  events: {onclick: "onclick_sessioncommand(this, event)"}, title: "Exit all strategies for all currencies",    icon: ""}, 
            {id: 'exitbuy',       item: 'Exit All Buy',     type: 'button',  events: {onclick: "onclick_sessioncommand(this, event)"}, title: "Exit all buy orders for all strategies and for all currencies",    icon: ""    }, 
            {id: 'exitsell',      item: 'Exit All Sell',    type: 'button',  events: {onclick: "onclick_sessioncommand(this, event)"}, title: "Exit all sell orders for all strategies and for all currencies",    icon: ""    }, 
            {id: 'closeall',      item: 'Close All',        type: 'button',  events: {onclick: "onclick_sessioncommand(this, event)"}, title: "Close all orders for allstrategies and for all currencies",   icon: "" }, 
            {id: 'closebuy',      item: 'Close All Buy',    type: 'button',  events: {onclick: "onclick_sessioncommand(this, event)"}, title: "Close all buy orders for all strategies and for all currencies",  icon: ""}, 
            {id: 'closesell',     item: 'Close All Sell',   type: 'button',  events: {onclick: "onclick_sessioncommand(this, event)"}, title: "Close all sell orders for all strategies and for all currencies",    icon: "" }
        ]
}


var sessionsbar = {
    id : 'sessionsbar', 
    type: 'bar',
    items: 
        [sessionscommandgroup]
} 

var sessionstable = {
    id: 'sessionstable',
    type: 'table',
    events: {ondblclick: "ondblclick_sessionsrow (this, event)", oncontextmenu: "oncontextmenu_sessionsrow(this, event)"},
    columns :  ['Strategy', 'Symbol', 'Session', 'Period', 'Profit', 'Buy Profit', 'Sell Profit', 'Session Profit', 'Buy Lots', 'Sell Lots', 'Buy Trade', 'Sell Trade', 'Buy Hedge Profit', 'Sell Hedge Profit', 'Start Date', 'Operation', 'Rule', 'Total Profit'],
    columnstitle : ['Strategy', 'Symbol', 'Session','Period', 'Profit', 'Buy Profit', 'Sell Profit', 'Session Profit', 'Buy Lots', 'Sell Lots', 'Buy Trade', 'Sell Trade', 'Buy Hedge Profit', 'Sell Hedge Profit', 'Start Date', 'Operation', 'Rule', 'Total Profit'],
    rows : [] 
}   

var sessionpropertiestable = {
    id: 'sessionpropertiestable',
    type: 'table',    
    columns :  ['Property', 'Value'],
    columnstitle : ['Property', 'Value'],
    //columnsstyle: ['width:150px;max-width:150px', ''],
    rows : [

    ] 
}
var sessionscheduletable = {
    id: 'sessionscheduletable',
    type: 'table',    
    columns :  ['Property', 'Start', 'End'],
    columnstitle : ['Property', 'Start', 'End'],
   // columnsstyle: ['width:150px;max-width:150px', '', ''],
    rows : [

    ] 
}

var sessionschedulepropertytable = {
    id: 'sessionschedulepropertytable',
    type: 'table',    
    columns :  ['Property', 'Value'],
    columnstitle : ['Property', 'Value'],
   // columnsstyle: ['width:150px;max-width:150px', ''],
    rows : [

    ] 
}

var orderscommandgroup = {
    id: 'orderscommandgroup',
    position: 'me-auto',
    type: 'group',    
    direction:'',
    toggle : false,
    items :
        [        
            {id: 'closeall',      item: 'Close All',        type: 'button',        events: {onclick: "onclick_ordercommand(this, event)"}, title: "Close all orders for all currencies",   icon: "" }, 
            {id: 'closebuy',      item: 'Close All Buy',    type: 'button',        events: {onclick: "onclick_ordercommand(this, event)"}, title: "Close all buy orders for all currencies",  icon: ""}, 
            {id: 'closesell',     item: 'Close All Sell',   type: 'button',        events: {onclick: "onclick_ordercommand(this, event)"}, title: "Close all sell orders for all currencies",    icon: "" }
        ]
}

var ordersbar = {
    id : 'ordersbar', 
    type: 'bar',
    items: 
        [orderscommandgroup]
} 



var orderstable = {
    id: 'orderstable',
    type: 'table',        
    events: {ondblclick: "ondblclick_ordersrow (this, event)", oncontextmenu: "oncontextmenu_ordersrow(this, event)"},
    columns :  ['Symbol',  'Strategy','Order', 'Type', 'Profit', 'Size', 'Open Price', 'Price', 'S/L', 'T/P', 'Open Time', 'Close Time', 'Commission', 'Swap', 'Mode', 'Status','Comment'],
    columnstitle : ['Symbol',  'Strategy','Order', 'Type', 'Profit', 'Size', 'Open Price', 'Price', 'S/L', 'T/P', 'Open Time', 'Close Time', 'Commission', 'Swap', 'Mode', 'Status','Comment'],
    rows : [] 
}  
var StrategiesBar = {
    id : 'strategiesbar',   
    type: 'bar',  
    header : {
        title : ''
    },
    items: 
        [
            { 
                id:'',                
                type: 'group',                    
                position: 'sb_end',
                items :
                    [ 
                    ]
            }
        ]
}

var StrategiesTable = {
    id: 'strategiestable',
    type: 'table',       
    columns :  ['Symbol',  'Period','Buy', 'Sell'],
    columnstitle : ['Symbol',  'Period','Buy', 'Sell'],
    rows : [] 
}  

var sessionpanel = {
    id: 'sessionspanel',
    type: 'html',
    class: 'sb_panel sb_column',
    content: 'SessionsPanel()'
}

var orderspanel = {
    id: 'orderspanel',
    type: 'html',
    class: 'sb_panel sb_column',
    content: 'OrdersPanel()'
}
var strategiespanel = {
    id: 'strategiespanel',
    type: 'html',
    class: 'sb_panel sb_column',
    content: 'StrategiesPanel()'
}

var TradedeskSettingsDisplayFromTable = {
    id: 'tradedesksettingsdisplayfromtable',
    type: 'table',    
    columns :  ['Indicator'],
    columnstitle : ['Indicator'],
    rows : []
}

var TradedeskSettingsDisplayToTable = {
    id: 'tradedesksettingsdisplaytotable',
    type: 'table',    
    columns :  ['Indicator', 'Name'],
    columnstitle : ['Indicator', 'Name'],
    rows : []
}
   
var TradedeskSettingsDisplayButtonsBar  = {
    id: 'tradedesksettingsdisplaybuttonsbar', 
    panelid: '',  
    direction: 'column',      
    items: 
        [
          {
            id: 'tradedesksettingsdisplaybuttonsgroup',
            type: 'group',
            direction:'column',
            toggle : false,
            items :  [
                {id: 'settings_addindicator',    type: 'button',  icon:  'far fa-hand-point-right', title: 'Add Indicator to MT4 Terminal',      onclick: 'sidebarmenu_select(this.id)'},
                {id: 'settings_removeindicator', type: 'button',  icon:  'far fa-hand-point-left',  title: 'Remove Indicator from MT4 Terminal', onclick: 'sidebarmenu_select(this.id)'}
            ]              
          }  
        ]
}

var TradedeskSettingsDisplayButtonsUpBar  = {
    id: 'tradedesksettingsdisplaybuttonsupbar', 
    panelid: '',  
    direction: 'row',      
    items: 
        [/*
          {
            id: 'tradedesksettingsdisplaybuttonsupgroup',
            direction:'row',
            toggle : false,
            items :  [
                {id: 'settings_upindicator',    type: 'button',  icon:  'far fa-hand-point-up', title: 'Move Indicator Up',      onclick: 'sidebarmenu_select(this.id)'},
                {id: 'settings_downindicator', type: 'button',  icon:  'far fa-hand-point-down',  title: 'Move Indicator Down', onclick: 'sidebarmenu_select(this.id)'}
            ]              
          }  
          */
        ]
}

var tradedeskcurrenciestable = {
    id: 'tradedeskcurrenciestable',
    type: 'table',
    events: {onclick: "onclick_tradedeskcurrenciesrow(this, event)", ondblclick: "ondblclick_tradedeskcurrenciesrow(this, event)"},    
    columns :  ['Symbol', 'Bid', 'Ask','Connected', 'Period', 'Buy', 'Sell', 'Spread', 'Pip Value'],
    columnstitle : ['Symbol',   'Bid', 'Ask', 'Connected', 'Period', 'Buy', 'Sell', 'Spread', 'Pip Value'],
    rows : [] 
}  

var sessionfilebar = {
    id : 'sessionfilebar', 
    type: 'bar',    
  
    items: 
        [
            { 
                id:'',
                type: 'group',                    
                toggle: true,    
                class: 'sb_transform',                                
                items :
                    [ 
                        {id: 'codeview',    icon: icon_file,     type:'link', title: 'Editor',      class:'checked', events: {onclick: 'onclick_CodeView(this, event)'}},           
                        {id: 'graphicview', icon: icon_graphic,  type:'link', title: 'Graphic View', events: {onclick: 'onclick_GraphicView(this, event)'}},  
                        {id: 'splitview',   icon: icon_split,    type:'link', title: 'Split View',   events: {onclick: 'onclick_SplitView(this, event)'}}                 
                    ]
            },   
        ]
} 

//------------------------------------------------------------------ SESSION ORDERS PANEL ------------------------------------------------------------

var SessionOrdersBar = {
    id : 'SessionOrdersBar', 
    type: 'bar',    
    header : {title : ''},
    items:
        [
            {
                type: 'group',                    
                position: 'sb_end', 
                id:'', 
                items : []}
        ]
} 

var SessionOrdersTable = {
    id: 'SessionOrdersTable',
    type: 'table',
    columns :  ['Symbol', 'Order', 'Type', 'Profit', 'Size', 'Open Price', 'Price', 'S/L', 'T/P', 'Open Time', 'Close Time', 'Commission', 'Swap', 'Mode', 'Status','Comment'],
    columnstitle : ['Symbol', 'Order', 'Type', 'Profit', 'Size', 'Open Price', 'Price', 'S/L', 'T/P', 'Open Time', 'Close Time', 'Commission', 'Swap', 'Mode', 'Status','Comment'],

    rows : [] 
}  

var alertssettingsbar = {
    id : 'alertssettingsbar', 
    type: 'bar',    
    items: 
        [
            { 
                type: 'group',                    
                position: '',
                items :
                    [ 
                        {id: 'alertsettingsbar_add', item: 'Select Signal', icon: icon_plus,   type:'button',  title: 'Add Alert',    events: {onclick: 'onclick_alertsettingsbar_add(this, event)'}}                 
                    ]
            }
        ]
} 

var alertssettingstable = {
    id: 'alertssettingstable',
    type: 'table',    
    class:'trackertable',        
    columns :  ['', 'Indicator',  'Signal', 'Vop', 'Value', 'Prev', 'Type', 'Logic',  'M1',  'M5',  'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN',  'EP', ''],
    columnstitle : ['', 'Indicator', 'Signal',  'Operation On Value', 'Value', 'Signal occuring on the previous Bar', 'Type of Search', 'Time Frames Combination',  '1 minute',  '5 minutes',  '15 minutes', '30 minutes', '1 hour', '4 hours', '1 day', '1 week', '1 month',  'Time Frame in which expert is running', 
    'Delete Alert'],
    rows : [] 
}

var alertssettingspanel = {
    id: 'alertssettingspanel',
    type: 'panel',    
    class:'trackerpanel',    
    items: [
        alertssettingsbar,
        alertssettingstable,
    ]   
}

var tradedesksettingsbargroup = {
    position: 'sb_end',
    type: 'group',    
    id: 'tradedesksettingsbargroup',
    direction: 'column',
    toggle : false,
    items :
        [     
            {id: 'sidebar_terminalsettings',  type: 'link',  panelid: 'serverspanel',   icon:  icon_settings,      title: 'Settings',     content: "ServersPanel('serverspanel', 'container h-100 d-flex flex-column')",  events: {onclick: 'sidebarmenu_select(this.id)'}}                                
        ]           
}

//------------------------------------------------------------ TRADEDESK PANELS----------------------------------------------------------

//--------------------------

var tree_terminals = {
    id: 'tree_terminals',       
    type: 'tree',       
    item: 'Terminals',
    icon: icon_terminal,
    items:[]
} 

var tradesksidebar = {
    id: 'tradesksidebar',
    type: 'panel',
    class: 'sb_panel',
    items:[tree_terminals]
}

var tradedesk_terminalsbar = {
    id : 'tradedesk_terminalsbar', 
    type: 'bar',
    class: 'sb_main',      
    direction: 'row',     
    items: 
        [
            { 
                id:'',
                type: 'group',                   
                class: '',
                position: 'me-auto',
                items : 
                    [ 
                        {id: 'tradedesk_terminalselect',  type: 'select',  value:  '--Select Terminal--', menu: [{text: '--Select Terminal--'}],  title: 'Select Terminal', events: {onchange: 'onchange_tradedesk_terminalselect (this, event)'}},                        
                    ]
            },      
            { 
                id:'',
                type: 'group',                   
                position: 'me-auto',
                items : 
                    [ 
                        {id: 'terminalradio', item: 'Terminal',         type :'radio', class: '', attributes: {checked: '', name: "radio_terminaltype"}, events: {onclick: "onclick_tradedesktype(\'Terminal\')"}},
                        {id: 'testerradio',   item: 'Strategy Tester',  type :'radio', class: '',  attributes: { name: "radio_terminaltype"}, events: {onclick: "onclick_tradedesktype(\'Tester\')"}}, 
                    ]
            },                                 
            { 
                id:'',
                type: 'group',                   
                class: 'sb_transform',                
                position: 'sb_end',
                items :
                    [ 
                        {id: 'tradedesk_close',   type:'link',  title: 'Close Terminal', icon: icon_close,  class:'sb_close',     events: {onclick: "OnCloseTerminal (tradedesk_closeterminal, solution.CurrentTerminal)"},title: 'Close Terminal'}
                    ]
            }
            
        ]
}   

var boxtradedeskpanel  = {
    id: 'boxtradedeskpanel',
    type: 'box',
    closed: false, 
    header: {item: 'Terminals', items:[tradedesk_terminalsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.L_CONTROL} },  
    items: [tradesksidebar]    
}

//--------------------------

var saccountpanel = {
    id: 'saccountpanel',
    type: 'bar',
    class: 'sb_formcontainer sb_transform',
    items: [
        {id: 'menuequity',         type: 'text',   title: 'Equity' , atributes: {readonly:''}},                 
        {id: 'menubalance',        type: 'text',   title: 'Balance' , atributes: {readonly:''}},   
        {id: 'accounttotalprofit', type: 'ihtml',   title: 'Total Profit' , content: "SAccountPanel()"},          

//        {id: 'menutotalprofit',    type: 'text',   title: 'Total Profit' , atributes: {readonly:''}},          
//        {id: 'closepositions',     type:'link',   title: 'Close Positions', icon: icon_close,   events: {onclick: "onclick_closepositions(this)"}},
    ]
}


var accountpanel = {
    id: 'accountpanel',
    type: 'html',
    class: 'sb_formcontainer',
    content: 'AccountPanel()',    
}

var boxaccountpanel  = {
    id: 'boxaccountpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Account',  items:[saccountpanel], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [accountpanel]
}

//--------------------------
var tradedeskordertab = {
    id:'tradedeskordertab', 
    type: 'tabs',
    label: '',    
    items: []
} 
var boxorderpanel  = {
    id: 'boxorderpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Order', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [tradedeskordertab]    
}

//--------------------------

var tsyssignalsbar = {
    id : 'tsyssignalsbar', 
    type: 'bar',
    items: 
        [
            {
                type: 'group',                        
                position: 'sb_end',
                items :[ {id: 'tsyssignals_select',  type: 'html',   title: 'Select Indicator',  content: "TSysSignalsSelectPanel('tsyssignalsselectpanel', 'sb_row')"}]
            }
        ]
} 



var tsyssignalstable = {
    id: 'tsyssignalstable',
    type: 'table', 
    events: {onclick: "onclick_tsyssignalsrow(this, event)", ondblclick: "ondblclick_tsyssignalsrow(this, event)"},
    columns :  ['Symbol',  'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN'],
    columnstitle : ['Symbol', 'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN'],
    rows : [] 
}  

var boxtsignalspanel  = {
    id: 'boxtsignalspanel',
    type: 'box',
    closed: true, 
    header: {item: 'Signals for', items:[tsyssignalsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [tsyssignalstable]    
}

//--------------------------
var percentchangetable = {
    id: 'percentchangetable',
    type: 'table',     
    events: {onclick: "onclick_percentchangetablerow(this, event)", ondblclick: "ondblclick_percentchangetablerow(this, event)"},
    columns :  ['Symbol',  'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN'],
    columnstitle : ['Symbol', 'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN'],
    rows : [] 
}  

var boxpercentchangepanel  = {
    id: 'boxpercentchangepanel',
    type: 'box',
    closed: true, 
    header: {item: 'Percent Change', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [percentchangetable]    
}
//--------------------------

var automationtable = {
    id: 'automationtable',
    events: {onclick:"onclick_automationrow(this, event)", ondblclick: "ondblclick_automationrow(this, event)", oncontextmenu: "oncontextmenu_automationrow(this, event)"},
    columns :  ['Strategy', 'Operation'],
    columnstitle : ['Strategy', 'Operation'],
    rows : [] 
}  

var automationpanel = {
    id: 'automationpanel',
    type: 'html',
    content: '',    
}

var boxautomationpanel  = {
    id: 'boxautomationpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Strategies', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [automationpanel]    
}

//--------------------------

var targetsbar = {
    id : 'targetsbar', 
    type: 'bar',     
    class: 'sb_transform',
    items: 
        [
            { 
                type: 'group',                         
                position: 'sb_end',
                items :
                    [ 
                        {id: 'targetsbar_settings',    icon: icon_settings,   type:'link',  title: 'Configure Target',     events: {onclick: "onclick_targetsbar_settings(this)"}}                 
                    ]
            }
        ]
}

var DailyTargetsBar = {
    id : 'dailytargetsbar', 
    type: 'bar',
    header : {title : 'Daily Target'},    
} 

var DailyTargetsTable = {
    id: 'dailytargetstable',
    type: 'table',
    columns :  ['Symbol', 'Closed', 'Profit', 'Target', 'Stop Loss', 'Reached',  'Weight'], 
    columnstitle : ['Symbol', 'Closed', 'Profit', 'Target', 'Stop Loss', 'Reached',  'Weight'], 
    rows : [] 
}  

var WeeklyTargetsBar = {
    id : 'weeklytargetsbar', 
    type: 'bar',    
    header : {title : 'Weekly Target'},
} 

var WeeklyTargetsTable = {
    id: 'weeklytargetstable',
    type: 'table',    
    columns :  ['Symbol', 'Closed', 'Profit', 'Target', 'Stop Loss', 'Reached',  'Weight'], 
    columnstitle : ['Symbol', 'Closed', 'Profit', 'Target', 'Stop Loss', 'Reached',  'Weight'], 
    rows : [] 
}  

var dailytargetpanel = {
    id: '',
    type: 'panel',
    class: '',
    items: [
        DailyTargetsBar, 
        DailyTargetsTable, 
        WeeklyTargetsBar, 
        WeeklyTargetsTable],
}

var boxtargetpanel  = {
    id: 'boxtargetpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Target', items: [targetsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [dailytargetpanel]    
}

//--------------------------




var terminalinfopanel = {
    id: 'terminalinfopanel',
    type: 'panel',
    class: 'sb_formcontainer',
    items: [
        {id: '', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'Name'},
            {id: 'terminalname', type: 'text', disabled: true}
         ] 
        },
        {id: '', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'Company'},
            {id: 'terminalcompany', type: 'text', disabled: true}
         ] 
        },
        {id: '', type: 'group',  form: true, 
         items: [
            {id: 'infotable_id', type: 'label', item: 'DataPath'},
            {id: 'terminaldatapath', type: 'text', disabled: true}
         ] 
        },
        {id: '', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'Path'},
            {id: 'terminalpath', type: 'text', disabled: true}
         ] 
        },                        
        {id: '', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'TimeShift'},
            {id: 'terminaltimeshift', type: 'text', disabled: true},
            {id: 'infotable_id', type: 'label', item: 'Build', class: 'right-inline'},
            {id: 'terminalbuild', type: 'text', disabled: true}            
         ] 
        },
        {id: '', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'Running'},
            {id: 'terminalrunning', type: 'text', disabled: true},
            {id: 'infotable_id', type: 'label', item: 'Server', class: 'right-inline'},
            {id: 'terminalserver', type: 'text', disabled: true}            
         ] 
        },        
    ] 
}

var boxaterminalinfopanel  = {
    id: 'boxaterminalinfopanel',
    type: 'box',
    closed: true, 
    header: {item: 'Terminal', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [terminalinfopanel]    
}

var currenciespanel = {
    id: 'currenciespanel',
    type: 'panel',
    class: '',    
    items: [
        tradedeskcurrenciestable,
    ],
}

//--------------------------

var tradedesk_terminals_headerbar = {
    id: 'tradedesk_terminals_headerbar',
    type: 'bar',
    class: 'sb_sidebarheader ',
    style:'z-index:10',            
    items : 
    [
        {id: '',                type: 'link',    item: 'MT4 TERMINAL',  class: 'sb_sidebarheadertitle'},   
        {id: 'label_server',    item: 'MT4 Server', type: 'link',  icon: icon_connection, events: {onclick: "onclick_button_server (this, event)"}, title: 'MT4 SERVER'},
        {id: 'button_server',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_server (this, event)"}, title: 'MT4 SERVER'},
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var tradedesk_terminals_headerpanel = {
    id: 'tradedesk_terminals_headerpanel',
    type : 'panel',
    class: 'sb_column',    
    style:'position:relative',      
    items : 
    [
        tradedesk_terminals_headerbar,
        modalserverpanel('tradedesk'),
    ]
}


var tradedesk_terminals_sidepanel = {
    id: 'tradedesk_terminals_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_column',
    items:[
        boxtradedeskpanel,
        boxaccountpanel,
        currenciespanel,
        boxautomationpanel,
        boxorderpanel,
        boxtsignalspanel,
        boxpercentchangepanel,
        boxtargetpanel,
        boxaterminalinfopanel,
    ]    
}
//--------------------------

var tsignalsbar = {
    id : 'tsignalsbar', 
    type: 'bar',     
    class: 'sb_transform',   
    items: 
        [
            { 
                id:'',             
                type: 'group',                           
                position: 'sb_end',
                items :
                    [ 
                        {id: 'tsignals_settings',    icon: icon_settings,   type:'link',  title: 'Configure Panel',     events: {onclick: "onclick_tsignals_settings(this)"}}
                    ]
            }
        ]
} 

var tsignalstable = {
    id: 'tsignalstable',
    type: 'table',
    columns :  ['Indicator',  'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN'],
    columnstitle : ['Indicator', 'M1','M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1','MN'],
    rows : [] 
}  

var tradedesksignalstab = {
    id:  'tradedesksignalstab',     
    type: 'tabs',  
    label : '',
    items : []
} 

var boxsignalsspanel  = {
    id: 'boxsignalsspanel',
    type: 'box',
    closed: false, 
    header: {item: 'MT4 Panel', items:[tsignalsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL} },  
    items: [tradedesksignalstab]    
}

//--------------------------

var alertsbar = {
    id : 'alertsbar', 
    type: 'bar',
    class: 'sb_transform',   
    items: 
        [
            { 
                id:'',             
                type: 'group',                           
                position: 'sb_end',
                items :
                    [ 
                        {id: 'alerts_settings',    icon: icon_settings,   type:'link',  title: 'Configure Alerts',     events: {onclick: "onclick_alerts_settings(this)"}}
                    ]
            }
        ]
} 

var alertstable = {
    id: 'alertstable',
    type: 'table',             
    events : {ondblclick: "ondblclick_alertstablerow(event, this)", oncontextmenu: "oncontextmenu_alertstablerow(this, event)"},
    columns :  ['Symbol',  'Time', 'Indicator', 'Signal', 'Period', 'Not', 'Prev', 'Type', 'Op', 'VOp', 'Value'],
    columnstitle : ['Symbol',  'Time','Indicator', 'Signal', 'Period', 'Not', 'Prev', 'Type', 'Op', 'VOp', 'Value'],
    rows : [] 
}  

var alertspanel = {
    id: 'alertspanel',
    type: 'panel',  
    class: 'sb_panel sb_column',
    items: [
        alertstable,
    ]           
}

var boxalertspanel  = {
    id: 'boxalertspanel',
    type: 'box',
    closed: false, 
    header: {item: 'MT4 Alerts', items:[alertsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL} },  
    items: [alertspanel]    
}

var tradedesk_signals_headerpanel = {
    id: 'tradedesk_signals_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'MT4 SIGNALS & ALERTS',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
        //<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>
    ]
}

var tradedesk_signals_sidepanel = {
    id: 'tradedesk_signals_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_column',
    items:[
        boxsignalsspanel,
        boxalertspanel,
    ]    
}


var tradedeskeditor = {
    id: 'tradedeskeditor',
    type: 'html',
    class: 'strategyscpanel sb_panel sb_main',   
}

var sessionmainpanel = {
    id: 'sessionmainpanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_row',
    items: [
        tradedeskeditor,
        gsepanel('session'),
    ]
}

var sessionfilepanel = {
    id: 'sessionfilepanel',
    type: 'panel',
    class: 'sb_panel strategyfilepanel',
    items: [
        sessionfilebar,
        sessionmainpanel,
    ]
}   

var sessionpropertiespanel = {
    id: 'sessionpropertiespanel',
    type: 'html',
    class: 'strategypropertiespanel sb_panel sb_column',
    content: 'SessionPropertiesPanel()',
}   

var sessionschedulepanel = {
    id: 'sessionschedulepanel',
    type: 'html',
    class: 'strategychedulepanel sb_panel',
    content: 'SessionSchedulePanel()',
}   

var sessiondescriptionpanel = {
    id: 'sessiondescriptionpanel',
    type: 'panel',
    class: 'sb_panel quill_editor',
    items: [],    
}   

var sessiontabs = {
    id:'sessiontabs',
    type: 'tabs',
    panelid : 'father',    
    label : 'sessiontabs',    
    items :
        [ 
            {id: 'tab_sessionfile',         type: 'link',    item: 'File',           items : [sessionfilepanel],       title: ''},           
            {id: 'tab_sessionproperties',   type: 'link',    item: 'Properties',     items : [sessionpropertiespanel],  title: ''},           
            {id: 'tab_sessionschedule',     type: 'link',    item: 'Schedule',       items : [sessionschedulepanel],     title: ''},
            {id: 'tab_sessiondescription',  type: 'link',    item: 'Description',    items : [sessiondescriptionpanel],   title: ''},            
        ]
} 

var tradedeskstrategypanel = {
    id: 'tradedeskstrategypanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column strategypanel',
    items: [
        sessiontabs,
    ],
}

var enginelookpanel = {
    id: 'enginelookpanel',
    type: 'panel',
    class: 'sb_formcontainer',
    items: [
        {id: 'tradedeskprojectnamepanel', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'Project'},
            {id: 'tradedeskprojectname', type: 'text', disabled: true, events: {onclick: "GoToProject(this)"}, title: 'Open the Project in Strategy Creator'}
         ] 
        },
        {id: 'tradedeskselectstrategypanel', type: 'group',  form: true, 
         items: [
            {id: '', type: 'label', item: 'Strategy'},
            {id: 'tradedeskstrategyselect', type: 'select'}
         ] 
        },
    ]
}

//--------------------------


var tradedesk_enginelook_headerpanel = {
    id: 'tradedesk_enginelook_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'INSPECT STRATEGY',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
        //<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>
    ]
}


var tradedesk_enginelook_sidepanel = {
    id: 'tradedesk_enginelook_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_column',
    items:[
        enginelookpanel,
        tradedeskstrategypanel,        
    ]    
}
//--------------------------

var historybar = {
    id : 'historybar', 
    type: 'bar',
    header : {title : 'History'},
    items:
    [
        { 
            id:'',             
            type: 'group',                
            position: 'sb_end',                
            items : [ 
                    {id: 'historybar_export',   icon: icon_export,   type:'link',  title: 'Export Table',    events: {onclick: "onclick_historyexport(this)"}}
                    ]
        }
    ]
} 

var historytable = {
    id: 'historytable',
    type: 'table',
    columns :  ['Strategy',  'Symbol Name', 'Start Date', 'End Date', 'Elapsed (Minutes)', 'Profit', 'Buy Profit', 'Sell Profit', 
                'Buy Nbr Lots', 'Sell Nbr Lots', 'Buy Nbr Trade','Sell Nbr Trade','Operation','Rule'],
    columnstitle : ['Strategy',  'Symbol Name', 'Start Date', 'End Date', 'Elapsed (Minutes)', 'Profit', 'Buy Profit', 'Sell Profit', 
                'Buy Nbr Lots', 'Sell Nbr Lots', 'Buy Nbr Trade','Sell Nbr Trade','Operation','Rule'],
    rows : [] 
}  

var statementbar = {
    id : 'statementbar',  
    type: 'bar',
    header : {title : 'Statement'},
    items:
    [
        { 
            id:'',     
            type: 'group',                              
            position: 'sb_end', 
            items : [ 
                    {id: 'statementbar_export',   icon: icon_export,   type:'link',  title: 'Export Table',    events: {onclick: "onclick_statementexport(this)"}}
                    ]
        }
    ]
} 

var statementtable = {
    id: 'statementtable',
    type: 'table',
    columns : ['Strategy', 'Profit', 'Buy Profit', 'Sell Profit', 'Nbr Launch', 'Nbr Gain', 'Nbr Loose', 'Nbr BuyLot', 'Nbr SellLot', 
                    'Nbr BuyTrade', 'Nbr SellTrade'],
    columnstitle : ['Strategy', 'Profit', 'Buy Profit', 'Sell Profit', 'Nbr Launch', 'Nbr Gain', 'Nbr Loose', 'Nbr BuyLot', 'Nbr SellLot', 
                    'Nbr BuyTrade', 'Nbr SellTrade'],
    rows : [] 
} 


var historyorderpanel = {
    id: 'historyorderpanel',
    type: 'html',    
    class : 'sb_column',
    content: 'HistoryOrderPanel()',
}


var historypanel = {
    id: 'historypanel',
    type: 'panel',    
    class: 'sb_panel sb_main sb_pane',
    items: [
        historybar,
        historytable,
    ]
}

var statementpanel = {
    id: 'statementpanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_pane',
    items: [
        statementbar,
        statementtable,
    ]
}

var tradedesk_history_headerpanel = {
    id: 'tradedesk_history_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'EXECUTION HISTORY',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
        //<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>
    ]
}

var tradedesk_history_sidepanel = {
    id: 'tradedesk_history_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel',
    items: [
        historyorderpanel,
        historypanel,
        statementpanel,
    ]
}


var orderpanel = {
    id: 'orderpanel',
    type: 'html',
    class: 'sb_main sb_column sb_formcontainer',
    content: 'OrderPanel()',
}


//------------------------------------------------------------ ROOT----------------------------------------------------------

var tradedesk_mainbar = {
    id: 'tradedesk_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
        ]
}   

//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------

var tradedesk_bottomtabs = {
    id:'tradedesk_bottomtabs',
    type: 'tabs',       
    tabevents: {ondblclick: "ondblclick_tradedesktabs(this, event)"},         
    items :
        [ 
            {id: 'tab_sessions',      item: 'Sessions',   type: 'link', icon: icon_file,         events: {onclick: "onclick_tradedesktabs(event)"}, items : [sessionpanel],        title: ''},           
            {id: 'tab_orders',        item: 'Orders',     type: 'link', icon: icon_file,         events: {onclick: "onclick_tradedesktabs(event)"}, items : [orderspanel],            title: ''},           
            {id: 'tab_strategies',    item: 'Strategies', type: 'link', icon: icon_strategy,     events: {onclick: "onclick_tradedesktabs(event)"}, items : [strategiespanel],    title: ''},
        ],
        groupitems:
        [
            {
                id: 'tradedeskactions',  
                type: 'group',  
                class:'sb_controls',               
                items :
                    [  
                        {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen sb_none',     events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                        {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                        {id: 'slide',         type:'control',  class : 'box-btn-slide rotate-180',       events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''},  
                    ]
            }        
        ]        
} 


var tradedesk_maintabs = {
    id:'tradedesk_maintabs',
    type: 'tabs',
    label : '',    
    class: 'sb_main sb_column',
    items : [
    //    {id: 'tradedesk_home_tab',   item: 'Home',      type:'link', in:  icon_home,       items: [tradedesk_home_main], onclose: 'onclick="onclick_StrategyCloseTabItem(this, event)"',   title: 'Home',               events: {onclick:"onclick_project_tab(this)"}},           

    ]
} 

var tradedesk_toppanel = {
    id : 'tradedesk_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    catchresize: true,
    resizefunction: '{if (TradedeskSignalEditor) TradedeskSignalEditor.resize();}',      
    items: [
        tradedesk_maintabs,
     ],
}

var tradedesk_bottompanel = {
    id : 'tradedesk_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    items: [
        tradedesk_bottomtabs 
    ],
    bottomheight: 200,    
}


//----------------------------------------------------------------<<< PANEL >>>-----------------------------------------------------------------------

var tradedesk_sidebarmenu  = {
    id: 'tradedesk_sidebarmenu',
    type: 'bar',     
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',      
    items: 
    [
        {
            id: 'tradedesk_sidebar',
            type: 'group',                   
            direction:'column',
            toggle : false,
            items :  
                [
                    {id: 'sidebar_terminals',     type: 'link', icon:  icon_files,   title: 'Terminals',            events: {onclick: "sidebarmenu_select(this.id)"}},
                    {id: 'sidebar_signals',       type: 'link', icon:  icon_signal,  title: 'Signals',              events: {onclick: "sidebarmenu_select(this.id)"}},
                    {id: 'sidebar_enginelook',    type: 'link', icon:  icon_project, title: 'Inspect Strategy',     events: {onclick: "sidebarmenu_select(this.id)"}},
                    {id: 'sidebar_history',       type: 'link', icon:  icon_history, title: 'History of Trades',    events: {onclick: "sidebarmenu_select(this.id)"}},
//                    {id: 'sidebar_news',          type: 'link', icon:  icon_news,    title: 'Weekly News',          events: {onclick: "sidebarmenu_select(this.id)"}},
                    {id: 'sidebar_video',         type: 'link', icon:  icon_comment, title: 'Community..',          events: {onclick: "sidebarmenu_select(this.id)"}},
                ]
        },
        charttoolsgroup('tradedesk'),
        settingsgroup('tradedesk'),
    ]
}

var tradedesk_sidebarpanel  = {
    id: 'tradedesk_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',     
    items :  
        [
            {id: 'sidebarpanel_terminals',         type: 'panel',    class: 'sb_panel',                 items: [tradedesk_terminals_headerpanel, tradedesk_terminals_sidepanel]},
            {id: 'sidebarpanel_signals',           type: 'panel',    class: 'sb_panel',                 items: [tradedesk_signals_headerpanel, tradedesk_signals_sidepanel]},
            {id: 'sidebarpanel_enginelook',        type: 'panel',    class: 'sb_panel',                 items: [tradedesk_enginelook_headerpanel, tradedesk_enginelook_sidepanel]},
            {id: 'sidebarpanel_history',           type: 'panel',    class: 'sb_panel',                 items: [tradedesk_history_headerpanel, tradedesk_history_sidepanel]},
        //    {id: 'sidebarpanel_news',              type: 'panel',    class: 'sb_panel', items: [newssidebarpanel]},
            {id: 'sidebarpanel_video',             type: 'panel',    class: 'sb_panel',                 items: [tradedesk_media_sidepanel]},
            {id: 'sidebarpanel_tradedeskcharttools',  type: 'panel', class: 'sb_panel',                 items: [charttools_header_panel, charttoolspanel('tradedesk')]},                        
            {id: 'sidebarpanel_tradedesksettings',    type: 'panel', class: 'sb_panel',                 items: [settingspanel('tradedesk')]},                  
        ],
        catchresize: true,
        resizefunction: '{if (TradedeskSCEditor) TradedeskSCEditor.resize(); if (CurrentTContainer) CurrentTContainer.Refresh()}',        
}


var tradedesk_main = {
    id: 'tradedesk_main', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_column',
    events: {ondragover: "allowDrop(event)", ondrop: "ondrop_tradedesk_main(event)"},
    items: [
//        tradedesk_mainbar,        
        tradedesk_toppanel,
        {id: 'tradedesk_mainpanel_drag',  class: 'sb_none', type:'drag', direction:'horizontal', dragid: 'tradedesk_bottompanel'},             
        tradedesk_bottompanel,
    ],    
}

var tradedeskplatform = {
    id:    TRADEDESK_ID,    
    name:  TRADEDESK_PLATFORM_NAME, 
    pname: TRADEDESK_PLATFORM_PNAME,

    type: 'root',
    class: 'sb_row',    
    items: [
        tradedesk_sidebarmenu, 
        tradedesk_sidebarpanel, 
        {id: 'tradedesk_sidebarpanel_drag', type:'drag',  class:'sb_none', direction:'vertical', dragid: 'tradedesk_sidebarpanel'},
        tradedesk_main
    ],        
    brand: {
        title: 'JUREXTRADE', 
        logo: '/A_PLATFORMS/tradedesk/res/tradedesk.svg',
        events: {onclick: "tradedesk_home_open(event)"}
    },      
    select:                        'tradedesk_select(\'' + TRADEDESK_PLATFORM_NAME + '\')',
    init:                          'tradedesk_init()',    
    end:                           'tradedesk_end()',     
    chart:                          tradedesk_chart,
    strategyselection :             'file',    
    strategysideselected :          true,    
    strategypropertiestable:        sessionpropertiestable,
    strategyscheduletable:          sessionscheduletable,
    strategyschedulepropertytable:  sessionschedulepropertytable,
    strategyquilleditor:            null,
    strategyquillbuffer:            null,    
    project_strategiesbar:                    sessionfilebar,
  }

  //--------------------------------------------------------------------------------------------------------------------------------------------------------