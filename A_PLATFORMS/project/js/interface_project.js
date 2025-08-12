const STRATEGY_TAB_VIEW         = 0;
const STRATEGY_SIDE_VIEW        = 1;
const STRATEGY_ASSISTANT_VIEW   = 2;

var revoverycommandgroup = {
    id: 'revoverycommandgroup',    
    type: 'group',         
    toggle : true,
    items :
        [        
        ]
}

var menucommandgroup = {
    id: 'menucommandgroup',    
    type: 'group',         
    toggle : true,
    items :
        [        
        ]
}



var codegroup = {
    id: 'codegroup',    
    type: 'group',    
    position: '',
    direction: 'row',
    toggle: true,    
    items:
        [     
            {id: 'generatec',    item: 'Generate C',        type: 'button',  class: 'checked', title: 'Generate C Code',   icon: icon_file,    events: {onclick: "onclick_generatecode (this," +  C_GENERATION   + ")"}}, 
            {id: 'generatemq4',  item: 'Generate MQ4',      type: 'button',  title: 'Generate MQ4 Code', icon: icon_file,    events: {onclick: "onclick_generatecode (this," +  MQ4_GENERATION + ")"}}, 
            {id: 'generatejs',   item: 'Generate JS',       type: 'button',  title: 'Generate C Code',   icon: icon_file,    events: {onclick: "onclick_generatecode (this," +  JS_GENERATION  + ")"}},  
        ]
}

var codebar = {
    id: 'codebar',   
    type: 'bar',    
    items: 
        [codegroup]
}


var ceditor = {
    id: 'ceditor',
    type: 'html',
    class: 'sb_main',
    events:  {ondrop: "OnDrop_Ace(event, this)"},
    catchresize: true,
    resizefunction: '{if (CEditor) CEditor.resize()}',         
}

var editorpanels = {
    id: 'editorpanels',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        codebar,
        ceditor
    ]
}

var error_comment = {
    id: 'error_comment',
    type: 'html',
    class: 'sb_main sb_panel',
    events: {oncontextmenu: 'OnContextMenuEditor (event, this)'},
    catchresize: true,
    resizefunction: '{if (ErrorEditor) ErrorEditor.resize()}',      
}

var strategy_helper = {
    id: 'strategy_helper',
    type: 'html',
    class: 'sb_main sb_panel',
    catchresize: true,
    resizefunction: '{if (PropertiesEditor) PropertiesEditor.resize()}',      
}




//------------------------------------------------------------ STRATEGY PROPERTIES PANEL ----------------------------------------------------------

var strategyfilebar = {
    id : 'strategyfilebar', 
    type: 'bar',            
    items: 
        [ 
            { 
                type: 'group',                        
                id:'strategyfilegroup',
                toggle: true,    
                class: 'sb_transform',             
                items:
                    [ 
                        {id: 'codeview',     icon: icon_file,     type:'link', title: 'Editor',      class:'checked', events: {onclick:'onclick_CodeView(this, event)'}},           
                        {id: 'graphicview',  icon: icon_structure,  type:'link', title: 'Graphic View', events: {onclick:'onclick_GraphicView(this, event)'}},  
                        {id: 'splitview',    icon: icon_split,    type:'link', title: 'Split View',  events: {onclick:'onclick_SplitView(this, event)'}}                 
                    ]
            },
            {
                position: 'me_auto',
                id: 'strategygroup',
                position: 'sb_end',
                type: 'group',                        
                direction:'row',
                items:
                    [     
            
                        {id: 'strategyother',   item: 'Properties', type: 'link', toggle: true, title: 'Strategy Properties',  class:'checked', events: {onclick:'onclick_strategyother(event)'}}, 
                    ]
            },
        ]
} 

var strategypropertiestable = {
    id: 'strategypropertiestable',
    type:'table',
    columns :  ['Property', 'Value'],
    columnstitle: ['Property', 'Value'],
    rows: [
    ] 
}

var strategyscheduletable = {
    id: 'strategyscheduletable',
    type:'table',    
    columns :  ['Property', 'Start', 'End'],
    columnstitle: ['Property', 'Start', 'End'],
    rows: [
    ] 
}

var strategyschedulepropertytable = {
    id: 'strategyschedulepropertytable',
    type:'table',    
    columns :  ['Property', 'Value'],
    columnstitle: ['Property', 'Value'],
    rows: [
    ] 
}
   
var propertiesgroup = {
    id: 'propertiesgroup',
    type: 'group',            
    items: EngineFieldsItems
   }

var propertiesbar = {
    id : 'propertiesbar',
    type:'bar',    
    direction: 'column', 
    items: [propertiesgroup]
   } 




var sceditor = {
    id: 'sceditor',
    type: 'html',
    class: 'strategyscpanel sb_panel sb_main',   
    events:  {ondrop: "OnDrop_Ace(event, this)"},
    catchresize: true,
    resizefunction: '{if (SCEditor) SCEditor.resize()}',   
}

var strategymainpanel = {
    id: 'strategymainpanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_row',
    items: [
        sceditor,
        {id: 'strategy_filepanel_drag', type:'drag', direction:'vertical', dragid: 'gsepanel_strategy'},          
        gsepanel('strategy'),
    ]
}

var strategyfilepanel = {
    id: 'strategyfilepanel',
    type: 'panel',
    class: 'sb_panel strategyfilepanel',
    items: [
        strategyfilebar,
        strategymainpanel,
    ]
}   

var strategypropertiespanel = {
    id: 'strategypropertiespanel',
    type: 'html',
    class: 'strategypropertiespanel sb_column',
    content: 'StrategyPropertiesPanel()',
}   

var strategyschedulepanel = {
    id: 'strategyschedulepanel',
    type: 'html',
    class: 'strategychedulepanel',
    content: 'StrategySchedulePanel()',
}   


var strategyquillpanel = {
    id: 'strategyquillpanel',
    type: 'panel',
    class: 'sb_pane quill_editor ql-container ql-snow',
    items: [],    
}   

var assistantquillpanel = {
    id: 'assistantquillpanel',
    type: 'panel',
    class: 'sb_main  quill_editor ql-container ql-snow',
    items: [],    
}   

var strategydescriptionpanel = {
    id: 'strategydescriptionpanel',
    type: 'panel',
    class: 'sb_panel',
    items: [strategyquillpanel],    
}   

var assistantdescriptionpanel = {
    id: 'assistantdescriptionpanel',
    type: 'panel',
    class: 'sb_main sb_column',
    items: [assistantquillpanel],    
}   

var boxstrategypropertiespanel = {
    id: 'boxstrategypropertiespanel',
    type: 'box',
    closed: false, 
    header: {item: 'Properties', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL} },  
    items: [strategypropertiespanel]
}    

var boxstrategychedulepanel = {
    id: 'boxstrategychedulepanel',
    type: 'box',
    closed: true, 
    header: {item: 'Schedule', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [strategyschedulepanel]
}    

var boxstrategydescriptionpanel = {
    id: 'boxstrategydescriptionpanel',
    type: 'box',
    closed: true, 
    header: {item: 'Description', control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [strategydescriptionpanel]
}   

var strategy_sideviewpanel = {
    id: 'strategy_sideviewpanel',
    type: 'panel',
    class: 'sb_panel',
    items: [
        {
            type: 'panel',            
            id: 'strategymainpanel',
            class: 'sb_main sb_row sb_panel',
            items: [
                {
                    id: 'strategyotherpanel',
                    type: 'panel',
                    class: 'strategyotherpanel sb_column',
                    items: [
                         strategypropertiespanel,
                         strategyschedulepanel,
              //          boxstrategydescriptionpanel,
                    ],    
                },
                {id: 'project_sideview_drag',  type:'drag', direction:'vertical', dragid: 'strategyotherpanel'},               

                {
                    id:'strategy_sideviewtabpanel',
                    type:'tabs',    
                    class: 'sb_main sb_column',
                    items:
                        [ 
                            {id: 'tab_strategyfile',        item: 'File',        type: 'link',  items : [strategyfilepanel],       title: ''},           
                            {id: 'tab_strategydescription', item: 'Description', type: 'link',  items : [strategydescriptionpanel],   title: ''},
                        ],
                }                 
            ]
        }
    ]    
}

var strategy_classicviewpanel = {
    id:'strategy_classicviewpanel',
    type:'tabs',    
    class: 'sb_main sb_column',
    items:
        [ 
            {id: 'tab_strategyfile',        item: 'File',        type: 'link',  items : [strategyfilepanel],       title: ''},           
            {id: 'tab_strategyproperties',  item: 'Properties',  type: 'link',  items : [strategypropertiespanel],  title: ''},           
            {id: 'tab_strategyschedule',    item: 'Schedule',    type: 'link',  items : [strategyschedulepanel],     title: ''},
            {id: 'tab_strategydescription', item: 'Description', type: 'link',  items : [strategydescriptionpanel],   title: ''},
        ],
} 

var strategyhelper =  {
    id: 'strategyhelper',    
    type: 'group',      
    items:
        [  
            {id: 'tab_strategyhelper',   type: 'button',  toggle: false, icon:  icon_helper,   events: {onclick:'onclick_strategyhelper(this, event)'},  title: 'Properties Explained...'}                           
        ]
}    
       
var assistantbar  = {
    id: 'assistantbar',
    type: 'bar',             
    direction: 'row',     
   
    items: 
        [
            { 
                type: 'group',                   
                items:
                    [ 
                        {id: 'essai',    class: 'sb_space',  type: 'ihtml',   title: '', content: 'project_assistant_barpanel()'},                      
                    ]
            },               
            strategyhelper,            
        ]
}   

var strategyfiletab = {
    id:'strategyfiletab',
    type: 'tabs',    
    class: 'sb_main',
    items: [
 //       {id: 'project_home_tab',   item: 'Home',      type:'link', in:  icon_home,       items: [project_home_main], onclose: 'onclick="onclick_StrategyCloseTabItem(this, event)"',   title: 'Home',               events: {onclick:"onclick_project_tab(this)"}},           

    ],
    groupitems: [
        {
            id: 'projectstrategyfileaction',    
            type: 'group',
            style:'display:none',
            items:
                [  
                    {id: 'strategy_assistant_button',  type: 'button',   item: 'Switch to Assistant View',  class: 'assistant_button', 
//                        icon:  icon_thanks,  
                     events: {onclick: "onclick_assistantmode (this)"},  title: 'Switch to Assistant View',                 
                    },         
                    {id: 'project_more',   type: 'link',  icon:  icon_more,    events: {onclick: "onclick_StrategyTabMenu(event)"},  title: 'More Actions...'}
                ]
        }    
    ]
} 

var classicviewbox = {
    id : 'classicviewbox',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        strategy_sideviewpanel,
        //strategy_classicviewpanel,        
    ]
}

var assistantviewbox = {
    id : 'assistantviewbox',
    type: 'html',
    class: 'sb_main sb_panel',
    content: 'project_assistant_panel ()',
}

var strategypanel = {
    id: 'strategypanel',
    type: 'panel',
    class: 'strategypanel sb_panel sb_main sb_row',
    items: [
            classicviewbox,
            assistantviewbox,
    ],        
}


//------------------------------------------------------------ TESTER----------------------------------------------------------

var project_tester_commandgroup = {
    position: 'me-auto',
    id: 'project_tester_commandgroup',
    type: 'group',                        
    direction:'row',
    toggle : false,
    class: 'sb_formcontainer sb_transform ',
    items:
        [        
            {id: 'project_tester_play_button',    type: 'button',  icon: icon_play, toggle: false,   events: {onclick: "onclick_project_tester_commandgroup (this)"},  attributes: {disabled:true}, title: 'Start Tester'}, 
            {id: 'project_tester_stop_button',      type: 'button',  icon: icon_stop,  toggle: false,   events: {onclick: "onclick_project_tester_stop (this)"},   attributes: {disabled:true},title: 'Stop Tester'} ,
            {id: 'project_tester_velocity_slider',  type: 'range',   value: '1000',  min: '600',  max: '1000', step: '10',  events: {onchange:"onchange_strategy_velocity (this)"}, title: 'Velocity'}, 
        ]
}


  
var project_tester_pausesession_group =  ((idgroup, visible, grouparray) =>  {
    let checkitems = [];
    if (idgroup != 2) {
        for (var i = 0; i < OperationItems.length; i++) {
            if (grouparray.includes(OperationItems[i].name)) {
                checkitems.push ({id: 'pause_' + OperationItems[i].name,    type: 'checkbox',  item: OperationItems[i].name, title: OperationItems[i].tooltip});
            }
        }
    }    
    else {
        checkitems = [
            {id: 'pause_buy',    type: 'checkbox',  item: 'Buy'}, 
            {id: 'pause_sell',    type: 'checkbox', item: 'Sell'}, 
            {id: 'pause_close_buy',   type: 'checkbox', item: 'Close Buy'}, 
            {id: 'pause_close_sell',   type: 'checkbox', item: 'Close Sell'}, 
        ]        
    }
    return {
        id: 'project_tester_pausesession_group_' + idgroup,  
        class: 'pause_group sb_transform' + (visible == 0  ? ' sb_none' : ''),
        type: 'group',
        items: checkitems,
    }
})


var project_tester_pausetab = {
    id: 'project_tester_pausetab',  
    type: 'group', 
    toggle: true,     
    items: [        
            {id: 'project_tester_pause_action_0',type: 'button',  item: 'Pause main', class:'sb_checked checked', events: {onclick: "onclick_project_tester_pausegroup(this, event)"},   title: 'Pause on Actions'}, 
            {id: 'project_tester_pause_action_1',type: 'button',  item: 'Pause close', events: {onclick: "onclick_project_tester_pausegroup(this, event)"},   title: 'Pause on Actions'}, 
            {id: 'project_tester_pause_action_2',type: 'button',  item: 'Pause orders',  events: {onclick: "onclick_project_tester_pausegroup(this, event)"},   title: 'Pause on Orders'}, 
    ]
}


var project_tester_bar  = {
    id: 'project_tester_bar', 
    type: 'bar',            
    items: 
        [
            project_tester_commandgroup,
            {
                id: 'project_tester_pause_panel', 
                type: 'panel', 
                class: "sb_column",           
                items:[
                    {id: 'project_tester_pausebar',  type: 'bar', items: [project_tester_pausetab]},
                    project_tester_pausesession_group(0, 1, ['START', 'EXIT', 'BUY', 'EXIT_BUY', 'SELL', 'EXIT_SELL', 'HEDGE_BUY', 'HEDGE_SELL']),
                    project_tester_pausesession_group(1, 0, ['CLOSE', 'CLOSE_HEDGE', 'CLOSE_BUY', 'CLOSE_HEDGE_BUY', 'CLOSE_SELL','CLOSE_HEDGE_SELL']),
                    project_tester_pausesession_group(2, 0),
                  ]
            }
        ]   
}
  
var project_tester_headerpanel = {
    id: 'project_tester_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'STRATEGY TESTER',  class: 'sb_sidebarheadertitle'},                           
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var periodmenu = [
    { id: 0, text: "M1"},
    { id: 1, text: "M5"},
    { id: 2, text: "M5"},
    { id: 3, text: "M30"},
    { id: 4, text: "H1"},
    { id: 5, text: "H4"},
    { id: 6, text: "D1"},
    { id: 7, text: "W1"},
    { id: 8, text: "MN"},
    { id: 9, text: "ANY"}         
]


var project_tester_initialbalance = {
    id: 'project_tester_initialbalance',
    type: 'group',
    form: true,    
    items: [
       {id: 'tester_lInitialbalance', type: 'label', item: 'Initial balance*'},
       {id: 'tester_initialbalance', type: 'int', min: '100',  step: '100', value: '1000', class:"required", attributes: {autocomplete: 'off'}, events: {onchange:"onchange_project_tester_initialbalance (this)"}, 
        title: "The Initial Balance is required in case you do not precise the size of your orders for your strategy, it will be 2% of your account balance"},
    ] 
}

var project_tester_timeframe = {
    id: 'project_tester_timeframe',
    type: 'group',
    form: true,    
    items: [
       {id: 'tester_ltimeframe', type: 'label', item: 'Time Frame'},
       {id: 'tester_timeframe', type: 'select', value: 'ANY', events: {onchange:"onchange_project_tester_timeframe (this)"}, menu: periodmenu},
    ] 
}

var project_searchgroup = {
    id: 'project_searchgroup',
    type: 'group',
    form: true,
    items: [
        {id: 'tester_symbol', type: 'label', item: 'Symbol'},
        {id: 'search_quote',  type: 'search', 
            title: 'Search Yahoo Symbol',      
            attributes: {funcname: "SearchQuote", placeholder: "Yahoo Ticker",  autocomplete: "off"}, 
            events: {onkeypress: "onkeypress_searchquote(event, this)"},
            style: "text-transform:uppercase;",
            submit: "onclick_searchquote(this)",
        } 
    ]
}

var project_strategygroup = {
    id: 'project_strategygroup',
    type: 'group',
    form: true,
    items: [
        {id: 'tester_strategyselect', type: 'label', item: 'Strategy'},
        {id: 'projectstrategyselect',  type: 'select',   title: 'Select Strategy', events: {onchange: "onchange_strategyselect(event, this)"},value: '--Select Strategy--', menu: []}, 
    ]
}

var project_tester_strategy_panel = {
    id: 'project_tester_strategy_panel',
    type: 'panel',
    class:'sb_formcontainer',
    items: [
        project_strategygroup,             
        project_searchgroup,
        project_tester_initialbalance,   
        project_tester_timeframe,             
    ]
}

var projectselectstrategypanel = {
    id: 'projectselectstrategypanel',
    type: 'html',
    class: 'sb_formgroup',
    content:'ProjectSelectStrategyPanel()', 
}


var project_tester_buttongroup = ((toggled) =>  {return {
    id: 'project_tester_buttongroup',
    type: 'group',
    class:'',
    position:'sb_end',        
    items: [

       {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen',     events: {onclick: "onclick_projectfspanel (this, event, project_tester_comments_pamel)"}, title: ''}, 
       {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_projectcspanel (this, event)"}, title: ''}, 
       {id: 'slide', type:'control',  class : 'box-btn-slide' + (toggled ? '' : ' rotate-180'), events: {onclick: "onclick_projecttogglepanel(this,event, project_tester_comments_pamel)"},  title: ''}

    ]
}})

var project_tester_expertbuttonbar = {
    id: 'project_tester_expertbuttonbar',
    type: 'group',         
    class: '',
    
    events: {onclick: 'onclick_emv_tester_reader(this, event)'},    
    items : [
        {id: 'label_card',  item: 'Expert Comment', type: 'link',   title: 'Expert Comment'},
    ]
}

var project_tester_expertbar  = ((toggled) =>  {return {
    id: 'project_tester_expertbar', 
    type: 'bar',   
    style: 'border-top: 1px solid var(--theme-button-border-color)',
    items:
     [
        project_tester_expertbuttonbar,
        project_tester_buttongroup(toggled)                 
      ]
}})

var expert_comment = {
    id: 'expert_comment',
    type: 'html',
    class: 'sb_panel sb_main',
}


var project_tester_expertpanel = ((toggled) =>  {return {
    id: 'project_tester_expertpanel',
    type: 'panel',
    class: 'sb_panel sb_column' + (toggled ? ' toggled' : ''),
    items:[
        project_tester_expertbar(toggled),
        expert_comment,
    ],
    catchresize: true,
    resizefunction: "expertinputresize()"    
}})


var project_tester_strategytbuttonbar = {
    id: 'project_tester_strategytbuttonbar',
    type: 'group',         
    class: '',
    events: {onclick: 'onclick_emv_tester_reader(this, event)'},    
    items : [
        {id: 'label_card',  item: 'Strategy Comment', type: 'link',   title: 'Strategy Comment'},
    ]
}



var project_tester_strategybar  = ((toggled) =>  {return {
    id: 'project_tester_strategybar', 
    type: 'bar',   
    style: 'border-top: 1px solid var(--theme-button-border-color)',
    items:
     [
        project_tester_strategytbuttonbar,
        project_tester_buttongroup(toggled)                 
      ]
}})

var strategy_comment = {
    id: 'strategy_comment',
    type: 'html',
    class: 'sb_panel sb_main', 
}


var project_tester_strategypanel = ((toggled) =>  {return {
    id: 'project_tester_strategypanel',
    type: 'panel',
    class: 'sb_panel sb_column' + (toggled ? ' toggled' : ''),
    items:[
        project_tester_strategybar(toggled),
        strategy_comment,
    ],
    catchresize: true,
    resizefunction: "strategyinputresize()"    
}})




var project_tester_comments_pamel = {
    id: 'project_tester_comments_pamel',
    type: 'panel',    
    class: 'sb_main sb_panel sb_column',
    items: [
        project_tester_strategypanel(true), 
        project_tester_expertpanel(true)
    ]
}


var testerpanel = {
    id: 'testerpanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items:[
        project_tester_strategy_panel,
        project_tester_bar,
        project_tester_comments_pamel,
    ],
}

var project_mainbar = {
    id: 'project_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
        ]
}   

//--------------------------

var project_tree_conditions = {
    id: 'project_tree_conditions',       
    type: 'tree',       
    item: 'Conditions',
    icon: icon_condition,
    items:[]
} 

var project_conditionsbar = {
    id : 'project_conditionsbar', 
    type: 'bar',
    items: 
        [                      
            { 
                type: 'group',                        
                position: 'me-auto',
                class: 'sb_transform',
                items:
                    [ 
                        {id: 'conditionCreate',    icon: icon_new,   type:'link',  title: 'Add Condition',     events: {onclick: "onclick_conditionCreate(this)"}}                 
                    ]
            }
        ]
}

var project_conditionssidepanel = {
    id: 'project_conditionssidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[project_tree_conditions]
}

var project_boxconditionspanel = {
    id: 'project_boxconditionspanel',
    type: 'box',
    closed: true, 
    header: {item: 'Conditions', items: [project_conditionsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [project_conditionssidepanel]    
}


//------------------------------------------------------------ PROJECT PANEL ----------------------------------------------------------

var project_tree_projects = {
    id: 'project_tree_projects',       
    type: 'tree',       
    class:'nav-pills',
    item: 'Projects',
    icon: icon_project,
    items:[]
} 

var project_projectsbar = {
    id : 'project_projectsbar', 
    type: 'bar',
    class: 'sb_main',    
    direction: 'row',     
    items: 
        [ 
            { 
                position: 'me-auto',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items: 
                    [ 
                        {id: 'project_projectselect',    type: 'select',   title: 'Select Project',      value: '--Select Project--', menu: [{text: '--Select Project--'}], events: {onchange: 'onchange_project_projectselect (this, event)'}},  
                    ]
            }, 
            { 
                position: 'sb_distance',
                class: 'sb_transform',                
                id:'project_projectdeploygroup',             
                type: 'group',                           
                items:
                    [ 
                        {id: 'project_projectcompile',   type:'link',  icon: icon_settings,  events: {onclick: "onclick_project_projectcompile(this)"},    title: 'Compile Current Project in C'},                 
                        {id: 'project_projectdistribute',type:'link',  icon: icon_deploy,    events: {onclick: "onclick_project_projectdistribute(this)"}, title: 'Distribute Current Project on MT4 Terminal'},
                    ]
            },
            { 
                position: 'sb_end',
                class: 'sb_transform',                
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'project_projectsave',      type:'link',       icon: icon_save,           events: {onclick: "onclick_project_projectsave(this)"},  title: 'Save Current Project'},  
                        {id: 'project_projectrename',    type:'link',       icon: icon_rename,          events: {onclick: "onclick_project_projectrename(this)"},  title: 'Rename Current Project'},  
                        {id: 'project_projectremove',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_project_projectremove(this)"},  title: 'Delete Current Project'},              
                        {id: 'project_projectcreate',    type:'link',       icon: icon_new,              events: {onclick: "onclick_project_t_projectcreate(this)"},   title: 'Create New Project'},      
                        {id: 'project_projectclose',     type:'link',       icon: icon_close,    class:'sb_close',  events: {onclick: "onclick_project_projectclose()"}, title: 'Close Current Project'}
                    ]
            }
            
        ]
}   

var project_projectsidepanel = {
    id: 'project_projectsidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[project_tree_projects]
}

var project_boxprojectspanel = {
    id: 'project_boxprojectspanel',
    type: 'box',
    closed: false, 
    header: {item: 'Projects', items: [project_projectsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.L_CONTROL} },  
    items: [project_projectsidepanel]    
}

//--------------------------

var project_tree_strategies = {
    id: 'project_tree_strategies',       
    type: 'tree',       
    item: 'Strategies',
    icon: icon_strategy,
    items:[]
}

var project_strategiesbar = {
    id : 'project_strategiesbar', 
    type: 'bar',            
    direction: 'row',     
    items: 
        [                    
            { 
                position: 'me-auto',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items: 
                    [ 
                        {id: 'project_strategyselect',    type: 'select',   title: 'Select Strategy',      value: '--Select Strategy--', style: "visibility:hidden", menu: [{text: '--Select Strategy--'}], events: {onchange: 'onchange_project_strategyselect (this, event)'}},  
                    ]
            }, 
            { 
                position: 'sb_distance',
                class: 'sb_transform ',
                id:'project_strategydeploygroup',
                type: 'group',                        
                items:
                    [ 
                        {id: 'project_strategycompile',    type:'link',  icon: icon_settings,  events: {onclick: "onclick_project_strategycompile(this, event)"},  title: 'Generate MQ4 Expert for the Current Strategy'},      
                        {id: 'project_strategydistribute', type:'link',  icon: icon_deploy,    events: {onclick: "onclick_project_strategydistribute(this)"},      title: 'Distribute Current Strategy MT4 Terminal'},

                    ]
            },
            { 
                position: 'sb_end',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'project_strategyrename',     type:'link',  icon: icon_rename,   events: {onclick: "onclick_strategyRename()"}, title: 'Rename Current Strategy'},  
                        {id: 'project_strategyremove',     type:'link',  icon: icon_remove,   events: {onclick: "onclick_strategyDelete()"},  title: 'Delete Current Strategy'},
                        {id: 'project_strategycreate',     type:'link',  icon: icon_new,      events: {onclick: "onclick_strategyCreate()"},  title: 'Create New Strategy'},      
                    ]
            },            
        ]
}

var project_strategiessidepanel = {
    id: 'project_strategiessidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[project_tree_strategies]
}

var project_boxstrategiespanel = {
    id: 'project_boxstrategiespanel',
    type: 'box',
    closed: true, 
    header: {item: 'Strategies', items: [project_strategiesbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [project_strategiessidepanel]    
}

// ---------------------------------

var project_projects_headerpanel = {
    id: 'project_projects_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    style:'z-index:6',           
    items : 
    [
        {id: '',                type: 'link',    item: 'PROJECTS EXPLORER',  class: 'sb_sidebarheadertitle'}, 
//        {id: 'label_server',    item: 'Deploy Server', type: 'link',  icon: icon_connection, events: {onclick: "onclick_button_server (this, event)"}, title: 'DEPLOY SERVER'},
//        {id: 'button_server',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_server (this, event)"}, title: 'DEPLOY SERVER'},
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
        //<a href="/Documentation/_build/html/" title="link to documentation" target="_blank" class="sb_sidebarheaderinfo"><i aria-hidden="true" class="fas fa-book"></i></a>
    ]
}


var project_projects_sidepanel = {
    id: 'project_projects_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items:[
        project_boxprojectspanel,
        project_boxstrategiespanel,
        project_boxconditionspanel,

    ]    
}

//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------



var project_bottomtabs = {
    id:'project_bottomtabs',
    type: 'tabs',    
    label: 'project_bottomtabs',   
    tabevents: {ondblclick: "ondblclick_projecttabs(this, event)"}, 
    items:
        [ 
            {id: 'tab-chart',            item: 'Chart',   type: 'link',  icon: icon_chart,        events: {onclick: "onclick_projecttabs(this, event)"}, items: [chartpanel('project')],  title: ''},           
            {id: 'tab-editor',           item: 'Editor',  type: 'link',  icon: icon_file,         events: {onclick: "onclick_projecttabs(this, event)"}, items: [editorpanels],  title: ''},           
            {id: 'tab-error',            item: 'Feed',    type: 'link',  icon: icon_file,         events: {onclick: "onclick_projecttabs(this, event)"}, items: [error_comment], title: ''},          
            {id: 'tab-helper',           item: 'Strategy Helper',   type: 'link',  icon: icon_file,         events: {onclick: "onclick_projecttabs(this, event)"}, items: [strategy_helper], title: ''},           
        ],
    groupitems:
    [    
        {
            id: 'projectactions',    
            type: 'group',            
            class:'sb_controls',               
            items:
                [  
                    {id: 'fullscreen',    type:'control',  class : 'box-btn-fullscreen sb_none',     events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                    {id: 'compressscreen',type:'control',  class : 'box-btn-compressscreen sb_none', events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''}, 
                    {id: 'slide',         type:'control',  class : 'box-btn-slide rotate-180' ,      events: {onclick: "onclick_controlsbottompanel (this)"}, title: ''},  
                ]
        }        
    ],

} 

var project_toppanel = {
    id : 'project_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        strategyfiletab
    ],
    catchresize: true,
    resizefunction: '{if (SCEditor) SCEditor.resize(); if (CurrentContainer) CurrentContainer.Refresh()}',          
}

var project_bottompanel = {
    id : 'project_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    items: [
        project_bottomtabs 
    ],
    catchresize: true,
    resizefunction: '{if (ProjectSignalEditor) ProjectSignalEditor.resize();}', 
    bottomheight: 400,          
}

//----------------------------------------------------------------<<< PANEL >>>-----------------------------------------------------------------------

var project_sidebarmenu  = {
    id: 'project_sidebarmenu', 
    type: 'bar',    
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',      
    items: 
    [
        {
            position: '',
            id: 'project_sidebar',
            type: 'group',                    
            direction:'column',
            toggle : false,
            items: 
            [
                {id: 'sidebar_files',   type: 'link',  icon:  icon_files,    events: {onclick: "sidebarmenu_select(this.id)"}, title: 'Project Workspace'},                           
                {id: 'sidebar_tester',  type: 'link',  icon:  icon_play,     events: {onclick: "sidebarmenu_select(this.id)"}, title: 'Test Project or Strategy'},                 
                {id: 'sidebar_deploy',  type: 'link',  icon:  icon_deploy,   events: {onclick: "sidebarmenu_select(this.id)"}, title: 'Compile and Deploy Project on Terminals'}
            ]
        },
        charttoolsgroup('project'),
        settingsgroup('project'),
    ]
}

var project_sidebarpanel  = {
    id: 'project_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',   
    items: 
        [
            {id: 'sidebarpanel_files',              type: 'panel',     class: 'sb_panel',             items: [project_projects_headerpanel, project_projects_sidepanel]},        
            {id: 'sidebarpanel_tester',             type: 'panel',     class: 'sb_panel sb_main',     items: [project_tester_headerpanel, testerpanel]},                     
            {id: 'sidebarpanel_deploy',             type: 'panel',      class: 'sb_panel',             items: [project_deploy_headerpanel,  deploypanel]},
            {id: 'sidebarpanel_projectcharttools',  type: 'panel',class: 'sb_panel',               items: [charttools_header_panel, charttoolspanel('project')]},                  
            {id: 'sidebarpanel_projectsettings',    type: 'panel', class: 'sb_panel',              items: [settingspanel('project')]},                    
        ]
}

var project_main = {
    id: 'project_main', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_column',    
    events: {ondragover: "allowDrop(event)", ondrop: "ondrop_project_main(event)"},
    items: [
        project_toppanel,
        {id: 'project_mainpanel_drag',  class: 'sb_none', type:'drag', direction:'horizontal', dragid: 'project_bottompanel'},             
        project_bottompanel,
    ],
}

var projectplatform = {
    id :    PROJECT_ID,    
    name :  PROJECT_PLATFORM_NAME, 
    pname:  PROJECT_PLATFORM_PNAME,    
    type:   'root',
    class:  'sb_row',    
    items: [
        project_sidebarmenu, 
        project_sidebarpanel,
        {id: 'project_sidebarpanel_drag',  class:'sb_none', type:'drag', direction:'vertical', dragid: 'project_sidebarpanel'},               
        project_main
    ],  
    brand: {
        title: 'JUREXTRADE', 
        logo: '/A_PLATFORMS/project/res/project.svg',
        events: {onclick: "project_home_open(event)"}
    },      
    select:                         'project_select(\'' + PROJECT_PLATFORM_NAME + '\')', 
    init:                           'project_init()',     
    end:                            'project_end()', 
    chart:                          project_chart,
    strategyview:                   STRATEGY_SIDE_VIEW,
    strategyselection :             'file',
    strategysideselected :          true,
    strategypropertiestable :       strategypropertiestable,
    strategyscheduletable :         strategyscheduletable,
    strategyschedulepropertytable : strategyschedulepropertytable,
    strategyquilleditor :           null,
    strategyquillbuffer :           null,
  }
  
//--------------------------------------------------------------------------------------------------------------------------------------------------------