
const OPTION_BAR_VIEW           = 0;
const OPTION_MENU_VIEW          = 1;



var optionorderpanel = {
    id: 'optionorderpanel',
    type: 'html',
    class: 'sb_main sb_column sb_formcontainer',
    content: 'OptionOrderPanel()',
}

var optioncontractstable = {
    id: 'optioncontractstable',
    type: 'table',
    events: {ondblclick: "ondblclick_optioncontractsrow (this, event)"},
   
    columns :  ['C Symbol', 'C Volatility (in %)', 'C Volume', 'C Open Interest', 'C % Change', 'C Change', 'C Bid', 'C Ask', 'C Last', 'Strike', 'Expiry',
                'P Last', 'P Bid', 'P Ask', 'P Change', 'P % Change', 'P Open Interest', 'P Volume', 'P Volatility (in %)', 'P Symbol'],
    columnstitle : ['Symbol', 'Call Volatility (in %)', 'Call Volume', 'Call Open Interest', 'Call % Change', 'Call Change', 'Call Bid', 'Call Ask', 'Call Last', 'Strike', 'Expiry',
                    'Put Last', 'Put Bid', 'Put Ask', 'Put Change', 'Put % Change', 'Put Open Interest', 'Put Volume', 'Put Volatility (in %)', 'Put Symbol'],
    rows : [] 
}

var optiongreekstable = {
    id: 'optiongreekstable',
    type: 'table',            
    columns :  ['Symbol', 'Volatility (in %)', 'Rho', 'Vega', 'Theta', 'Gamma', 'Delta', 'Price', 'Strike', 'Expiry',
                'Price', 'Delta', 'Gamma', 'Theta', 'Vega', 'Rho', 'Volatility (in %)', 'Symbol'],
    columnstitle :  ['Symbol', 'Volatility (in %)', 'Rho', 'Vega', 'Theta', 'Gamma', 'Delta', 'Price', 'Strike', 'Expiry',
                'Price', 'Delta', 'Gamma', 'Theta', 'Vega', 'Rho', 'Volatility (in %)', 'Symbol'],
    rows : [] 
}  


var optionothergroup = {
    id: 'optionothergroup',    
    type: 'group',            
    position: '',
    class: 'sb_right',
    direction:'row',
    items :
        [     
            {id: 'setall',       item: 'Set All',   type: 'button',  title: 'Set all',          events: {onclick: 'onclick_optionexpirygroup(this, event)'}} ,                        
            {id: 'unsettall',    item: 'Unset All', type: 'button',  title: 'UnSet all',        events: {onclick: 'onclick_optionexpirygroup(this, event)'}} ,    
            {id: 'downmoney',                       type: 'float',   value: 4, min: 0, max: 20, step: 0.5, title: 'Down from Money'} ,              
            {id: 'setfrom',      item: 'Set',       type: 'button',  title: 'Select in interval', events: {onclick: 'onclick_optionexpirygroup(this, event)'}} ,    
            {id: 'upmoney',                         type: 'float',   value: 4, min: 0, max: 20, step: 0.5, title: 'Up from Money'} ,    
        ]

}

var optionstrikegroup = {
    id: 'optionstrikegroup',    
    type: 'group',            
    position: '',
    direction:'row',
    items :
        [     
        ]
}

var optionexpirygroup = {
    id: 'optionexpirygroup',    
    type: 'group',            
    position: '',
    direction:'row',
    items :
        [     
        ]
}

var optionstrikebar  = {
    id: 'optionstrikebar', 
    type: 'bar',    
    items: [
        optionothergroup,        
        optionstrikegroup,
    ],
}

var optionexpirybar  = {
    id: 'optionexpirybar', 
    type: 'bar',    
    items: [
        optionexpirygroup,
    ],
}

var optionmenubar = {
    id : 'optionmenubar', 
    type: 'bar',
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
                        {id: 'expiryselect',  item: 'Expiries', type: 'button',  icon: icon_sort,  title: 'Select Expiries to visualize', events: {onclick: 'onclick_ExpiriesMenu(this, event)'}} ,                        
                        {id: 'strikeselect',  item: 'Strikes',  type: 'button',  icon: icon_sort,  title: 'Select Strikes to visualize',  events: {onclick: 'onclick_StrikesMenu(this, event)'}} ,                        
                    ]
            },      
           
        ]
}      

var optiontoolbarspanel = {
    id: 'optiontoolbarspanel',
    type: 'panel',
    class: 'sb_column',
    items:[
        optionstrikebar,
        optionexpirybar,
        optionmenubar,        
    ],
}

var optioncontractspanel = {
    id: 'optioncontractspanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_pane',
    items:[
        optioncontractstable,
        optiongreekstable,
    ],
}


var righttabs = {
    id:'righttabs',
    type: 'tabs',  
    class: 'sb_main',  
    items :
        [ 
            {id: 'tab_optioncontracts', item: 'Option Chain',   type: 'link', roleid: 'optionconctractcontent', items: [optioncontractspanel], icon: icon_chart_bar,   events: {onclick: "onclick_righttabs(this, event)"}, title: ''},           
            {id: 'tab_optiongreeks',    item: 'Option Greeks',  type: 'link', roleid: 'optionconctractcontent', items: [optioncontractspanel], icon: icon_chart_area,  events: {onclick: "onclick_righttabs(this, event)"}, title: ''},           

        ],
 
}

var contractspanel = {
    id: 'contractspanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items:[
        optiontoolbarspanel,         
        righttabs,
    ],
}


var optionmainpanel = {
    id : 'optionmainpanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        chartpanel(OPTION_PLATFORM_PNAME), 
       // {id: 'optionmainpanel_sidebarpanel_drag', type:'drag', direction:'horizontal', dragid: 'contractspanel'},               
       // contractspanel,
     ], 
}

var optioncontracttab = {
    id:'optioncontracttab',
    type: 'tabs',    
    class : 'sb_main sb_column',    
    items : [],
    groupitems: [
        {
            id: 'optionfileaction',    
            type: 'group',
            items:
                [  
                    {id: 'option_more',   type: 'link',  icon:  icon_more,    events: {onclick: "onclick_OptionTabMenu(event)"},  title: 'More Actions...'}
                ]
        }    
    ]    
} 

var optionordersbar = {
    id : 'optionordersbar', 
    type: 'bar',    
    header : {title : ''},

    items: 
    [
            {
                type: 'group',
                class: 'sb_transform',                        
                position: 'sb_end', 
                id:'', 
                items : []
            }
        ]
}

var optionorderstable = {
    id: 'optionorderstable',
    type: 'table',
    events: {ondblclick: "ondblclick_optionordersrow (this, event)"},    
    columns :  ['Symbol', 'MSymbol', 'Type', 'Right', 'Strike', 'Expiry', 'Size', 'Value', 'Profit',  'Open Price', 'Price', 'Open Time',  'Close Time', 'Commission'],
    columnstitle : ['Contract Symbol', 'Underlying Symbol', 'Type', 'Right', 'Strike', 'Expiry', 'Size',  'Value', 'Profit',  'Open Price', 'Price', 'Open Time',  'Close Time', 'Commission'],
    rows : [] 
}

var optionorderspanel = {
    id: 'optionorderspanel',
    type: 'panel',
    class: 'sb_panel sb_column',
    items:[
        optionordersbar,
        optionorderstable,
    ]
}



var optionordertab = {
    id:'optionordertab',  
    type: 'tabs',            
    class : 'sb_main sb_column',    
    items : []
} 

var boxoptionorderpanel = {
    id: 'boxoptionorderpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Order', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [optionordertab]        
}

var siteamericanbulltable = {
    id: 'siteamericanbulltable',
    type: 'table',
    columns :  ['Date', 'Price', 'Signal', 'Change', 'Profit'],
    columnstitle : ['Date', 'Price', 'Signal', 'Change %', 'Profit'],
    rows : [] 
}


var sitespanel = {
    id: 'sitespanel',
    type: 'panel',
    class: 'sb_column sb_panel sb_pane',
    events: {onpaste: 'onpaste_sitesidebarpanel(this, event)'},
//    content: "FramePanel('https://finance.yahoo.com/')",
}

var option_mainbar = {
    id: 'option_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
        ]
}   

//------------------------------------------------------------ TERMINAL PANEL ----------------------------------------------------------

var option_tree_terminals = {
    id: 'option_tree_terminals',       
    type: 'tree',       
    class:'nav-pills',
    item: 'Terminals',
    icon: icon_terminal,
    items:[]
} 

var option_terminalsbar = {
    id : 'option_terminalsbar', 
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
                        {id: 'option_terminalselect',  type: 'select',  value:  '--Select Terminal--', menu: [{text: '--Select Terminal--'}],  title: 'Select Terminal', events: {onchange: 'onchange_option_terminalselect (this, event)'}},                        
                    ]
            },                  
            { 
                position: 'sb_end',
                class: 'sb_transform',                
                id:'',
                type: 'group',                        
                items :
                    [ 
                        {id: 'option_close',   type:'link', icon: icon_close,    class:'sb_close',  events: {onclick: "OnCloseTerminal (option_closeterminal, solution.CurrentOptionTerminal)"},title: 'Close Terminal'}
                    ]
            }
            
        ]
}   

var option_terminalssidepanel = {
    id: 'option_terminalssidepanel',
    type: 'panel',  
    class: 'sb_panel',
    items: [
        option_tree_terminals,
    ]           
}

var option_boxterminalspanel = {
    id: 'option_boxterminalspanel',
    type: 'box',
    closed: false, 
    header: {item: 'Terminals', items: [option_terminalsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.L_CONTROL} },  
    items: [option_terminalssidepanel]    
}


var project_terminals_headerpanel = {
    id: 'project_terminals_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'OPTION TRACKER',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

//--------------------------

var summary_header_panel = {
    id: 'summary_header_panel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: 'summary_symbolname',  type: 'link',   item: '',  class: 'sb_sidebarheadertitle'},                           
        {id: 'summary_symbolprice',  type: 'link',  item: '',  class: 'sb_f_classic  sb_marginright'},                           
    ]
}

var summarytable = {
    id: 'summarytable',
    type: 'table',    
    columns :  ['Property', 'Value' ],
    columnstitle : ['Property', 'Value' ],
    rows : [] 
}


var summarypanel = {
    id: 'summarypanel',
    type: 'panel',  
    class: 'sb_pane sb_column',
    items: [
        summarytable,
    ]      
}

var option_summarypanel = {
    id: 'option_summarypanel',
    type: 'panel',  
    class: 'sb_column',
    items: [
        summary_header_panel,  
        summarypanel,
    ]      
}

var option_terminal_sidepanel = {
    id: 'option_terminal_sidepanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items: [
        project_terminals_headerpanel,        
        option_boxterminalspanel,        
        {
            id: 'option_symbolspanel',
            type: 'panel',  
            class: 'sb_main sb_panel',
            items: [ 
                currencypanel('option'),        
                {id: 'option_symbolspanel_drag', type:'drag',  direction:'horizontal', dragid: 'option_summarypanel'},       
                option_summarypanel,
            ]
        }
        //boxoptionorderpanel,
    ]
}

//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------

var option_bottomtabs = {
    id:'option_bottomtabs',
    type: 'tabs',    
    events: {ondblclick: "ondblclick_optiontabs(this, event)"},     
    items:
        [ 
            {id: 'tab_optionorders',    item: 'Orders',   type: 'link', icon: icon_file,    events: {onclick: "onclick_optiontabs(event)"}, items: [optionorderspanel],  title: ''},           
            {id: 'tab_optioncontracts', item: 'Contracts',type: 'link', icon: icon_file,    events: {onclick: "onclick_optiontabs(event)"}, items: [contractspanel],  title: ''},           

        ],
    groupitems:
    [    
        {
            id: 'optionactions',    
            type: 'group',                        
            class:'sb_controls',               
            items :
                [  
                    {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen sb_none',     events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                    {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                    {id: 'slide',         type:'control',  class : 'box-btn-slide rotate-180',       events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                ]
        }          
    ],
}

var option_toppanel = {
    id : 'option_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        optioncontracttab,
     ],
}

var option_bottompanel = {
    id : 'option_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    items: [
        option_bottomtabs 
    ],
    catchresize: true,
    resizefunction: '{if (OptionSignalEditor) OptionSignalEditor.resize()}',     
    bottomheight: 400,         
}

//----------------------------------------------------------------<<< PANEL >>>-----------------------------------------------------------------------

var option_sidebarmenu  = {
    id: 'option_sidebarmenu', 
    type: 'bar',    
    class: 'sb_sidebarmenu sb_right',
    direction: 'column',      
    items: 
    [
        {
            position: '',
            id: 'option_sidebar',
            type: 'group',                    
            direction: 'column',
            toggle : false,
            items : 
            [
                {id: 'sidebar_optionterminals',  type: 'link',  icon:  icon_files,                   events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Market' },           
                {id: 'sidebar_optionsummary',    type: 'link',  icon: 'far fa-list-alt',             events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Stock Summary'},       
                {id: 'sidebar_site',             type: 'link',  icon:  icon_link, title: 'Site',     events: {onclick: "onclick_sidebarmenu(this.id)"}},

            ]
        },
        charttoolsgroup('option'),
        settingsgroup('option'),
    ]
}

var option_sidebarpanel  = {
    id: 'option_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',   
    items : 
    [
        {id: 'sidebarpanel_optionterminals',type: 'panel',  class: 'sb_panel',  items: [option_terminal_sidepanel]},           
        {id: 'sidebarpanel_optionsummary',  type: 'panel',  class: 'sb_panel',  items: []},           
        {id: 'sidebarpanel_site',           type: 'panel',  class: 'sb_panel',  items: [sitespanel]},     
        {id: 'sidebarpanel_optioncharttools',  type: 'panel',class: 'sb_panel',    items: [charttoolspanel('option'), boxoptioncalculatorpanel,]},                           
        {id: 'sidebarpanel_optionsettings', type: 'panel',  class: 'sb_panel',  items: [settingspanel('option')]},                     
    ]
}

var option_main = {
    id: 'option_main', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_column',
    events: {ondragover: "allowDrop(event)", ondrop: "ondrop_option_main(event)"},
    items: [
    //    option_mainbar,        
        option_toppanel,
        {id: 'option_mainpanel_drag', class: 'sb_none', type:'drag', direction:'horizontal', dragid: 'option_bottompanel'},             
        option_bottompanel,
    ],    
}

var optionplatform = {
    id :   OPTION_ID,    
    name : OPTION_PLATFORM_NAME, 
    pname: OPTION_PLATFORM_PNAME,    
    
    type: 'root',
    class: 'sb_row',
    items: [
            option_sidebarmenu,
            option_sidebarpanel,                 
            {id: 'option_sidebarpanel_drag', type:'drag',  class:'sb_none', direction:'vertical', dragid: 'option_sidebarpanel'},       
            option_main
    ],    
    brand: {
        title: 'JUREXTRADE', 
        logo: '/A_PLATFORMS/option/res/option.svg',
        events: {onclick: "openPopupContact()"}
    },      
    select:        'option_select(\'' + OPTION_PLATFORM_NAME + '\')',
    init:          'option_init()',
    end:           'option_end()', 
    chart:          option_chart,  
    optionview:     OPTION_BAR_VIEW,
  }

//--------------------------------------------------------------------------------------------------------------------------------------------------------