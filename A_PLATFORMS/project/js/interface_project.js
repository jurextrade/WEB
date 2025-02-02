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
    class: 'strategypropertiespanel sb_panel sb_column',
    content: 'StrategyPropertiesPanel()',
}   

var strategyschedulepanel = {
    id: 'strategyschedulepanel',
    type: 'html',
    class: 'strategychedulepanel sb_panel',
    content: 'StrategySchedulePanel()',
}   

var strategydescriptionpanel = {
    id: 'strategydescriptionpanel',
    type: 'panel',
    class: 'sb_panel quill_editor',
    items: [],    
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
                        boxstrategypropertiespanel,
                        boxstrategychedulepanel,
                        boxstrategydescriptionpanel,
                    ],    
                },
                strategyfilepanel,
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
    items: [],
    groupitems: [
        {
            id: 'projectstrategyfileaction',    
            type: 'group',
            items:
                [  
                    {id: 'strategy_assistant',  type: 'button',   item: 'Classic View',  class: 'assistant_button', icon:  icon_thanks,  
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
        strategy_classicviewpanel,        
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

//--------------------------

var distributetable =  {
    id: 'distributetable',
    type: 'table',            
    columns :  ['Terminal', 'Platform', 'Strategy Tester'],
    columnstitle : ['Terminal', 'Platform', 'Strategy Tester'],
    rows : [] 
}

var deploypanel = {
    id: 'deploypanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items:[
    ],
}



//------------------------------------------------------------ ROOT----------------------------------------------------------


var testerbar  = {
    id: 'testerbar', 
    type: 'bar',            
    items: 
        [
            {
                position: 'me-auto',
                id: 'testergroup',
                type: 'group',                        
                direction:'row',
                toggle : false,
                class: 'sb_formcontainer',
                items:
                    [        
                        {id: 'strategy_tester',    type: 'button',  class: 'sb_button', item: 'Run', icon: icon_play, toggle: true,   events: {onclick: "onclick_tester (this)"},  tooltip: 'Test Strategy'}, 
                        {id: 'strategy_velocity',  type: 'range',   value: '800',  min: '600',  max: '1000', step: '10',  events: {onchange:"onchange_strategy_velocity (this)"}, title: 'Velocity'}, 
                        {id: 'strategy_stop',      type: 'button',  class: 'sb_button', item: 'Stop', icon: icon_stop,  toggle: false,   events: {onclick: "onclick_stoptester (this)"},  tooltip: 'Stop Strategy'} 
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


var project_initialbalancegroup = {
    id: 'project_initialbalancegroup',
    type: 'group',
    form: true,    
    items: [
       {id: 'tester_Initialbalance', type: 'label', item: 'Initial balance*'},
       {id: 'strategy_assistant_initialbalance', type: 'int', min: '100',  step: '100', class:"required", attributes: {autocomplete: 'off'}, 
        title: "The Initial Balance is required in case you do not precise the size of your orders for your strategy, it will be 2% of your account balance"},
    ] 
}

var project_timeframegroup = {
    id: 'project_timeframegroup',
    type: 'group',
    form: true,    
    items: [
       {id: 'tester_timeframe', type: 'label', item: 'Time Frame'},
       {id: 'strategy_assistant_timeframe', type: 'select', events: {onchange:"OnStrategyTimeFrameChange (this)"}, menu: periodmenu},
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

var project_strategytester_panel = {
    id: 'project_strategytester_panel',
    type: 'panel',
    class:'sb_formcontainer',
    items: [
        project_strategygroup,             
        project_searchgroup,
   
        project_initialbalancegroup,   
        project_timeframegroup,             
    ]
}

var projectselectstrategypanel = {
    id: 'projectselectstrategypanel',
    type: 'html',
    class: 'sb_formgroup',
    content:'ProjectSelectStrategyPanel()', 
}

var expert_comment = {
    id: 'expert_comment',
    type: 'html',
    class: 'sb_panel sb_main',
}

var strategy_comment = {
    id: 'strategy_comment',
    type: 'html',
    class: 'sb_panel sb_main', 
}

var terminalpanel = {
    id: 'terminalpanel',
    type: 'panel',    
    class: 'sb_main sb_panel sb_column',
    items: [expert_comment, strategy_comment]
}


var testerpanel = {
    id: 'testerpanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_column',
    items:[
        project_strategytester_panel,
        testerbar,
        terminalpanel,
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

//--------------------------

var project_tree_experts = {
    id: 'project_tree_experts',       
    type: 'tree',       
    item: 'Experts',
    icon: icon_mt4expert,
    items:[]
} 

var project_expertsbar = {
    id : 'project_expertsbar', 
    type: 'bar',            
    items: 
        [                    
            { 
                type: 'group',                        
                position: 'me-auto',
                class: 'sb_transform',
                items:
                    [ 
                        {id: 'expertDownload',    icon: icon_download,   type:'link',  title: 'Download MT4 Expert',     events: {onclick: "onclick_expertDownload(this)"}}                 
                    ]
            }
        ]
}

var project_expertsidepanel = {
    id: 'project_expertsidepanel',
    type: 'panel',
    class: 'sb_panel',
    items:[project_tree_experts]
}

var project_boxexpertspanel = {
    id: 'project_boxexpertspanel',
    type: 'box',
    closed: true, 
    header: {item: 'MT4 Experts', items: [project_expertsbar], control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [project_expertsidepanel]    
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
          //              {id: 'project_projectcreate',    type:'link',       icon: icon_new,              events: {onclick: "onclick_project_projectcreate(this)"},   title: 'Create New Project'},      
          //              {id: 'project_projectrename',    type:'link',       icon: icon_rename,           events: {onclick: "onclick_project_projectrename(this)"},  title: 'Rename Current Project'},  
          //              {id: 'project_projectremove',    type:'link',       icon: icon_remove,           events: {onclick: "onclick_project_projectremove(this)"},  title: 'Delete Current Project'}              
                    ]
            }, 
            { 
                position: 'sb_distance',
                class: 'sb_transform',                
                id:'',             
                type: 'group',                           
                items:
                    [ 
                        {id: 'project_projectcompile',   type:'link',  icon: icon_file,   style: 'color:green',             events: {onclick: "onclick_project_projectcompile(this)"},    title: 'Compile Current Project in C'},                 
                        {id: 'project_projectdistribute',type:'link',  icon: icon_deploy, events: {onclick: "onclick_project_projectdistribute(this)"}, title: 'Distribute Current Project on MT4 Terminal'},
                    ]
            },
            { 
                position: 'sb_end',
                class: 'sb_transform',                
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'project_projectrename',    type:'link',       icon: icon_rename,           events: {onclick: "onclick_project_projectrename(this)"},  title: 'Rename Current Project'},  
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
                        {id: 'project_strategycreate',     type:'link',  icon: icon_new,      events: {onclick: "onclick_strategyCreate()"},  title: 'Create New Strategy'},      
                        {id: 'project_strategyrename',     type:'link',  icon: icon_rename,   events: {onclick: "onclick_strategyRename()"}, title: 'Rename Current Strategy'},  
                        {id: 'project_strategyremove',     type:'link',  icon: icon_remove,   events: {onclick: "onclick_strategyDelete()"},  title: 'Delete Current Strategy'}              
                    ]
            },
            { 
                position: 'sb_distance',
                class: 'sb_transform',
                id:'',
                type: 'group',                        
                items:
                    [ 
                        {id: 'project_strategycompile',    type:'link',  icon: icon_file, style:'color:green',    events: {onclick: "onclick_project_strategycompile(this, event)"},  title: 'Generate MQ4 Expert for the Current Strategy'},      
                    ]
            }
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
    items : 
    [
        {id: '',                type: 'link',    item: 'PROJECTS EXPLORER',  class: 'sb_sidebarheadertitle'}, 
        {id: 'label_server',    item: 'Deploy Server', type: 'link',  icon: icon_connection, title: 'DEPLOY SERVER'},
        {id: 'button_server',   type: 'button', class: 'sb_roundbutton',   events: {onclick: "onclick_button_server (this, event)"}, title: 'DEPLOY SERVER'},
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
        project_boxexpertspanel,
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
                {id: 'sidebar_files',   type: 'link',  icon:  icon_files,    events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Project Workspace'},                           
                {id: 'sidebar_tester',  type: 'link',  icon:  icon_play,     events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Test Project or Strategy'},                 
                {id: 'sidebar_deploy',  type: 'link',  icon:  icon_deploy,   events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Compile and Deploy Project on Terminals'}
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
            {id: 'sidebarpanel_files',           type: 'panel',     class: 'sb_panel',             items: [project_projects_headerpanel, project_projects_sidepanel]},        
            {id: 'sidebarpanel_tester',          type: 'panel',     class: 'sb_panel sb_main',     items: [project_tester_headerpanel, testerpanel]},                     
            {id: 'sidebarpanel_deploy',          type: 'html',      class: 'sb_panel', content: "DeployPanel('deploypanel', 'sb_main sb_column')"},
            {id: 'sidebarpanel_projectcharttools',  type: 'panel',class: 'sb_panel',               items: [charttools_header_panel, charttoolspanel('project')]},                  
            {id: 'sidebarpanel_projectsettings',    type: 'panel', class: 'sb_panel',              items: [settingspanel('project')]},                    
        ]
}

var project_mainpanel = {
    id: 'project_mainpanel', 
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
    class:  'sb_column',    
    items: [
//        project_mainbar,
        {
            id: 'essai',
            class:  'sb_panel sb_row',    
            type:   'panel',
            items: [
                project_sidebarmenu, 
                project_sidebarpanel,
                {id: 'project_sidebarpanel_drag',  class:'sb_none', type:'drag', direction:'vertical', dragid: 'project_sidebarpanel'},               
                project_mainpanel
            ],  
        }  
    ],
    brand: {
        title: 'JUREXTRADE', 
        logo: '/A_PLATFORMS/project/res/project.svg',
        events: {onclick: "openPopupContact()"}
    },      
    select:                         'project_select(\'' + PROJECT_PLATFORM_NAME + '\')', 
    init:                           'project_init()',     
    end:                            'project_end()', 
    chart:                          project_chart,
    strategyview:                   STRATEGY_TAB_VIEW,
    strategyselection :             'file',
    strategysideselected :          true,
    strategypropertiestable :       strategypropertiestable,
    strategyscheduletable :         strategyscheduletable,
    strategyschedulepropertytable : strategyschedulepropertytable,
    strategyquilleditor :           null,
    strategyquillbuffer :           null,
  }
  
//--------------------------------------------------------------------------------------------------------------------------------------------------------