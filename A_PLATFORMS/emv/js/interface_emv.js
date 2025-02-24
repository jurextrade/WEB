var EMV_ID              = "emv_root";
var EMV_PLATFORM_PNAME  = "emv";
var EMV_PLATFORM_NAME   = "EMV";





//-------------------------------------------------------------------------BOTTOM PANEL ------------------------------------------------------------------------

var emv_terminalpage = {
    id: "emv_terminalpage",
    type: "panel",
    class: "sb_row",
    items: [
   //     emv_TSIPanel, 
   //     emv_TVRPanel,
    ]
}

var emv_cardpage = {
    id: "emv_cardpage",
    type: "panel",
    class: "sb_row",
    items: [
      //  emv_AIPPanel, 
      //  emv_AUCPanel, 
      //  emv_IACDenialPanel,
      //  emv_IACOnlinePanel,
      //  emv_IACDefaultPanel,           
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
    tabevents: {ondblclick: "ondblclick_emvtabs(this, event)"}, 
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

var emv_topleftpanel = {
    id : 'emv_topleftpanel',
    type: 'panel',
    class: 'sb_panel sb_main',
    items: [
        emv_maintabs,
    ],
}

var emv_toprightpanel = {
    id : 'emv_toprightpanel',
    type: 'panel',
    class: 'sb_panel sb_row',
    style: "width:0px; flex:none",
    items: [

    ],
}

var emv_toppanel = {
    id : 'emv_toppanel',
    type: 'panel',
    class: 'sb_panel sb_main sb_row',
    items: [
        emv_topleftpanel,            
        {id: 'emv_toprightpanel_drag',  class: 'sb_none', type:'drag', direction:'vertical', dragid: 'emv_toprightpanel'},           
        emv_toprightpanel,
    ],
}


var emv_bottompanel = {
    id : 'emv_bottompanel',
    type: 'panel',
    class: 'sb_panel sb_column sb_top',
    style: "display:none",
    items: [
        emv_bottomtabs 
    ],
    bottomheight: 270,          
}

var emv_rightpanel = {
    id : 'emv_rightpanel',
    type: 'panel',
    class: 'sb_panel sb_row sb_left',
    items:
    [ 
         
    ],        
    rightwidth: 270,          
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
       
        {id: 'sidebarpanel_emvprojectmanager',class: 'sb_panel sb_main',   type: 'panel',  items: [emv_projects_headerpanel, emv_projects_sidepanel]},             
        {id: 'sidebarpanel_emvtestermanager', class: 'sb_panel sb_main',   type: 'panel',  items: [emv_tester_headerpanel,   emv_tester_sidepanel]},             
        {id: 'sidebarpanel_emvsettings',      class: 'sb_panel sb_pane',   type: 'panel',  items: [settingspanel('emv')]},                 
        {id: 'sidebarpanel_emvdatabase',      class: 'sb_panel sb_pane',   type: 'panel',  items: [emv_database_headerpanel, emv_database_sidepanel]},                 
        {id: 'sidebarpanel_emvtools',         class: 'sb_panel sb_pane',   type: 'panel',  items: [ emv_tools_headerpanel,   emv_tools_sidepanel]},                 

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
        {id: 'emv_rightpanel_drag',  class: 'sb_none', type:'drag', direction:'vertical', dragid: 'emv_rightpanel'},             
//       emv_rightpanel,        
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
    beforeunload: 'emv_beforeunload()'
           
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------