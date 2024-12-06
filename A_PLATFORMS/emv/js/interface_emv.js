var EMV_ID              = "emv_root";
var EMV_PLATFORM_PNAME  = "emv";
var EMV_PLATFORM_NAME   = "EMV";

//--------------------------------------------------------------------- TVR TSI ... PANEL  --------------------------------------------------------------------

var emv_TSIPanel = emv_bytepanel('TSI', '9B',   emv_TSI, 1)
var emv_TVRPanel = emv_bytepanel('TVR', '95',   emv_TVR, 1)

var emv_AUCPanel = emv_bytepanel('AUC', '9F07', emv_AUC, 1)
var emv_AIPPanel = emv_bytepanel('AIP', '82',   emv_AIP, 1)

var emv_IACDenialPanel = emv_bytepanel('IAC_Denial', '9F0E',   emv_TVR, 1)
var emv_IACOnlinePanel = emv_bytepanel('IAC_Online', '9F0F',   emv_TVR, 1)
var emv_IACDefaultPanel = emv_bytepanel('IAC_Default', '9F0D', emv_TVR, 1)

var emv_CTQPanel = emv_bytepanel('CTQ', '9F6C', emv_CTQ, 1)
var emv_CIDPanel = emv_bytepanel('CID', '9F27', emv_CID, 1)



//-------------------------------------------------------------------------BOTTOM PANEL ------------------------------------------------------------------------

var emv_terminalpage = {
    id: "emv_terminalpage",
    type: "panel",
    class: "sb_row",
    items: [
        emv_TSIPanel, 
        emv_TVRPanel,
    ]
}

var emv_cardpage = {
    id: "emv_cardpage",
    type: "panel",
    class: "sb_row",
    items: [
        emv_AIPPanel, 
        emv_AUCPanel, 
        emv_IACDenialPanel,
        emv_IACOnlinePanel,
        emv_IACDefaultPanel,           
    ]
}

var emv_mainbar = {
    id: 'emv_mainbar',    
    type: 'bar',
    class: 'sb_mainbar',
    items:
        [          
        ]
}    


//----------------------------------------------------------------<<< MAIN >>>-----------------------------------------------------------------------

var emv_maintabs = {
    id:'emv_maintabs',
    type: 'tabs',    
    class: 'sb_main',
    label : '',    
    items : [
        {id: 'emv_home_tab',   item: 'Home',      type:'link', in:  icon_home,       items: [emv_home_main], onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'Home',               events: {onclick:"onclick_emv_tab(this)"}},           
        {id: 'emv_tester_tab', item: 'EMV Tester',type:'link', icon:  icon_creditcard, items: [emv_tester_main],     onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'EMV',                events: {onclick:"onclick_emv_tab(this)"}},           
     //   {id: 'emv_tvr_tab',      item: 'TVR',       type:'link', icon:  icon_structure,  items: [emv_tvrpanel],              onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'TVR Structure',      events: {onclick:"onclick_emv_tab(this)"}},             
     //   {id: 'emv_tsi_tab',      item: 'TSI',       type:'link', icon:  icon_structure,  items: [emv_tsipanel],              onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'TSI Structure',      events: {onclick:"onclick_emv_tab(this)"}},             
      //  {id: 'emv_rapdu_tab',    item: 'R-APDU',    type:'link', icon:  icon_structure,  items: [emv_rapdupanel],            onclose: 'onclick="onclick_emv_tab_close(this, event)"',   title: 'R-APDU Structure',   events: {onclick:"onclick_emv_tab(this)"}},             
    ]
} 

var emv_bottomtabs = {
    id:'emv_bottomtabs',
    type: 'tabs',    
    label: 'emvtabs',   
    events: {ondblclick: "ondblclick_emvtabs(this, event)"}, 
    items:
        [ 
            {id: 'tab-terminal',       item: 'Terminal',   type: 'link',  icon: icon_chart,        events: {onclick: "onclick_emvtabs(this, event)"}, items: [emv_terminalpage],  title: ''},           
            {id: 'tab-card',           item: 'Card',       type: 'link',  icon: icon_file,         events: {onclick: "onclick_emvtabs(this, event)"}, items: [emv_cardpage],  title: ''},           
        ],
    groupitems:
    [    
        {
            id: 'emvactions',    
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

var emv_toppanel = {
    id : 'emv_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
//        emv_mainbar,        
        emv_maintabs,
    ],
}


var emv_bottompanel = {
    id : 'emv_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    items: [
        emv_bottomtabs 
    ],
    bottomheight: 270,          
}

//----------------------------------------------------------------<<< PANEL >>>-----------------------------------------------------------------------

var emv_sidebaremenu = {
    id: 'emv_sidebaremenu',
    type: 'bar',
    class: 'sb_sidebarmenu sb_right',    
    direction: 'column',       
    items : 
    [
        {
            position: '',
            id: 'emv_sidebaremenu_maingroup',
            type: 'group',                    
            direction: 'column',
            toggle : false,
            items : 
            [
                {id: 'sidebar_emvprojectmanager',type: 'link',  icon:  icon_files,    events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Project File Workspace'},                           
                {id: 'sidebar_emvtestermanager', type: 'link',  icon:  icon_play,     events: {
                    onclick: "onclick_sidebarmenu(this.id); $('#emv_tester_tab').tab('show');"}, title: 'Tester'},                           
                {id: 'sidebar_emvdatabase',      type: 'link',  icon:  icon_database, events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'Data Base'},                           
                {id: 'sidebar_emvtools',         type: 'link',  icon:  icon_chart,    events: {onclick: "onclick_sidebarmenu(this.id)"}, title: 'EMV tools'},
            ]
        }, 
        settingsgroup('emv'),
    ]
}

var emv_sidebarpanel  = {
    id: 'emv_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_sidebarpanel sb_right',     
    items : 
    [
       
        {id: 'sidebarpanel_emvprojectmanager',class: 'sb_panel sb_main',   type: 'panel',  items: [emv_projects_sidepanel]},             
        {id: 'sidebarpanel_emvtestermanager', class: 'sb_panel sb_main',   type: 'panel',  items: [emv_tester_sidepanel]},             
        {id: 'sidebarpanel_emvsettings',      class: 'sb_panel sb_pane',   type: 'panel',  items: [settingspanel('emv')]},                 
        {id: 'sidebarpanel_emvdatabase',      class: 'sb_panel sb_pane',   type: 'panel',  items: [emv_database_sidepanel]},                 
        {id: 'sidebarpanel_emvtools',         class: 'sb_panel sb_pane',   type: 'panel',  items: [emv_tools_sidepanel]},                 

    ]
}

var emv_main = {
    id: 'emv_main', 
    type: 'panel',       
    class: 'sb_panel sb_main sb_column',
    items:[
        emv_toppanel,        
        {id: 'emv_mainpanel_drag',  class: 'sb_none', type:'drag', direction:'horizontal', dragid: 'emv_bottompanel'},             
        emv_bottompanel,        
    ]
}

var emvplatform = {
    id: EMV_ID,
    name: EMV_PLATFORM_NAME,
    pname: EMV_PLATFORM_PNAME,    
    type: "root",
    class: "sb_row",
    items: [
        emv_sidebaremenu, 
        emv_sidebarpanel, 
        {id: '', type:'drag', class:'sb_none', direction:'vertical', dragid: 'emv_sidebarpanel'},           
        emv_main],   
    brand: {
        title: 'EMV', 
        logo: '/A_PLATFORMS/emv/res/emv.svg',
        events: {onclick: "emv_home_open()"}
    },            
    select: 'emv_select(\'' + EMV_PLATFORM_NAME + '\')', 
    init: 'emv_init()',
    end:  'emv_end()',
           
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------