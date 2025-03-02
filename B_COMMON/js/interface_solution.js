// we need sound package
// we nees recognition package

const S_Languages   = ['ar', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'zh']
const S_LCountries  = ['ar', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'th', 'zh']
var solution = null;

//----------------------------------------------------------------- DEFAULT UI  -------------------------------------------------------------------

const sb_icons = {
    icon_remove:        'fas fa-trash',
    icon_copy:          'far fa-copy',
    icon_cut:           'fas fa-cut',
    icon_rename:        'far fa-edit sb_baricon',
    icon_paste:         'fas fa-paste',
    icon_trash:         'far fa-trash-alt',
    icon_search:        'fa fa-search',
    icon_more:          'fas fa-ellipsis-h',
    icon_indicator:     'far fa-chart-bar',
    icon_signal:        'fas fa-signal', 
    icon_condition:     'fas fa-gavel', 
    icon_project:       'fas fa-project-diagram',
    icon_chart:         'fas fa-chart-line',
    icon_chart_bar:     'fas fa-chart-bar',
    icon_chart_area:    'fas fa-chart-area',
    icon_strategy:      'fas fa-chess',
    icon_mt4expert:     'fas fa-cogs',
    icon_film:          'fas fa-film',
    icon_helper:        'fas fa-info-circle',
    icon_automation:    'fas fa-cogs',
    icon_arrow_up:      'fas fa-caret-up',
    icon_arrow_down:    'fas fa-caret-down',
    icon_arrow_right:   'fas fa-caret-right',
    icon_arrow_left:    'fas fa-caret-left',
    icon_market:        'far fa-money-bill-alt',
    icon_news:          'fas fa-calendar-alt',
    icon_alerts:        'fa fa-bolt',
    icon_user:          'fas fa-user',
    icon_toggle:        'fas fa-align-left',
    icon_settings:      'fa fa-cog',
    icon_caretdown:     'fas fa-caret-down',
    icon_caretup:       'fas fa-caret-up',
    icon_sort:          'fas fa-sort',
    icon_maximize:      'fas fa-expand-arrows-alt',
    icon_minimize:      'fas fa-compress-arrows-alt',
    icon_times:         'fas fa-times',
    icon_windowclose:   'far fa-window-close',
    icon_close:         'fas fa-close',
    icon_s_caretrigh:   'fa-square-caret-right',
    icon_dice:          'fas fa-dice',                                  
    icon_track:         'fas fa-chess-knight',   
    icon_tradedesk:     'fas fa-chalkboard',   
    icon_terminal:      'fas fa-desktop',   
    icon_card:          'far fa-credit-card',              
    icon_file:          'fas fa-file-alt',
    icon_files:         'far fa-clone',
    icon_folder:        'far fa-folder',  
    icon_eye:           'far fa-eye',
    icon_play:          'fas fa-play',
    icon_stop:          'fas fa-stop',
    icon_pause:         'fas fa-pause',
    icon_forward:       'fas fa-forward',
    icon_backward:      'fas fa-backward',
    icon_repeat:        'fas fa-repeat',
    icon_forwardstep:   'fas fa-forward-step',
    icon_backwardstep:  'fas fa-backward-step',
    icon_settings1:     'far fa-sun',
    icon_graphic:       'fas fa-sitemap',
    icon_split:         'fas fa-grip-lines-vertical',
    icon_deploy:        'fas fa-cloud-download-alt',
    icon_upload:        'fas fa-upload',
    icon_download:      'fas fa-download',
    icon_export:        'fas fa-file-export',
    icon_compile:       'fas fa-wrench',
    icon_plus:          'fas fa-plus',
    icon_new:           'fa fa-plus-circle',
    icon_sound:         'fas fa-volume-off',
    icon_micro:         'fas fa-microphone',
    icon_history:       'fas fa-history',
    icon_inspect:       'fas fa-glasses',
    icon_arrowright:    'fas fa-chevron-right',
    icon_arrowdown:     'fas fa-chevron-down',
    icon_arrowleft:     'fas fa-chevron-left',
    icon_arrowup:       'fas fa-chevron-up',
    icon_check:         'fa-solid fa-check',
    icon_save:          'fas fa-save',
    icon_cancel:        'fas fa-rotate-left',
    icon_home:          'fas fa-house',
    icon_structure:     'fas fa-folder-tree',
    icon_siteview:      'fa-brands fa-connectdevelop',
    icon_manager:       'fas fa-layer-group',
    icon_site:          'fas fa-building',
    icon_machine:       'fas fa-desktop',
    icon_application:   'fas fa-tasks',
    icon_database:      'fas fa-database',
    icon_journal:       'far fa-file-lines',
    icon_queue:         'far fa-envelope',
    icon_connection:    'fas fa-circle-nodes',
    icon_record:        'fas fa-record-vinyl',
    icon_server:        'bi bi-filetype-js',
    icon_language:      'fas fa-language',
    icon_help:          'fas fa-hands-helping',
    icon_thanks:        'fas fa-fist-raised',
    icon_video:         'fas fa-video',
    icon_comment:       'fas fa-comment',
    icon_link:          'fas fa-link',
    icon_grip:          'fas fa-grip-lines',
    icon_swap:          'fas fa-arrow-right-arrow-left',
    icon_ellipsis:      'fas fa-ellipsis',
    icon_creditcard:    'fas fa-credit-card',
    icon_tags:          'fas fa-tags',
    icon_tag:           'fas fa-tag',
    icon_question:      'far fa-circle-question',
    icon_pin:           'fas fa-thumbtack',
    icon_check:         'fas fa-check',
}

//------------------------------------------------------------------- RIGHT SIDEBAR---------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var solution_tree = {
    id: 'solution_tree',       
    type: 'tree',       
    item: 'Solution',
    icon: sb_icons.icon_files,
    items:  [  ]
}
var solution_treepanel = {
    id: 'solution_treepanel',       
    type: 'panel',   
    class:'sb_pane',    
    items:
    [
        solution_tree
    ]
}

var solution_configurationtable  = (placement =>  {return {
    id: 'solution_configurationtable_' + placement,
    type: 'table',           
    class: 'solution_configurationtable',     
    columns : ['Module', 'Type', 'Placement', 'Load', 'Active', 'Loaded'],
    columnstitle : ['Module', 'Type', 'Placement', 'Load', 'Active', 'Loaded'],
    rows : [] 
}})

var solution_configurationpanel= (placement =>  {return {
    id: 'solution_configurationpanel_' + placement,
    type: 'panel',
    class: 'sb_panel solution_configurationpanel',
    items: [
        {id: 'solution_configurationtitle', type: 'label',  class:'sb_f_style_h6', item: 'Solution ' + placement},
        solution_configurationtable(placement),
    ]
}})





var  solution_headerPanel   = solution_configurationpanel('header');
var  solution_leftPanel     = solution_configurationpanel('left');
var  solution_mainPanel     = solution_configurationpanel('main');
var  solution_rightPanel    = solution_configurationpanel('right');
var  solution_footerPanel   = solution_configurationpanel('footer');



var solutionpanel = {
    id : 'solutionpanel',
    pname: 'solution',
    type : 'panel',
    class: 'sb_panel',
    init: 'solution_init()',
    items: [
   //     solution_treepanel,
        solution_headerPanel,
        solution_leftPanel,  
        solution_mainPanel,  
        solution_rightPanel, 
        solution_footerPanel,
     //   solution_serverpanel,
     //serverstable        
    ]
}

const default_rightsidebar_solution = {
    id: 'rightsidebar_solution',         
    type: 'link',  
    icon:  sb_icons['icon_settings'],   
    events: {onclick: "onclick_rightsidebarmenu(this.id)"}, 
    title: 'Solution Settings'
} 

const default_right_settingsgroup =  {
    id: 'right_settingsgroup',
    type: 'group',                    
    position: 'sb_end',
    direction: 'column',
    toggle : false,
    items :
        [
            default_rightsidebar_solution,
        ]           
}

const default_right_sidebarheader = {
    id: 'right_sidebarheader',
    type: 'bar',
    class: 'sb_rightsidebarheader ',    
    items : 
    [
        {id: '',                  type: 'link',  item: 'General',  class: 'sb_fs-12 sb_sidebarheadertitle'},                           
        {id: 'right_sidebarsave', type: 'button', item:'Save',  class: 'sb_none',  icon:  sb_icons['icon_save'], events: {onclick: "onclick_right_sidebarsave(this, event)"}, title: 'Save Configuration'},                 
        {id: 'right_sidebarpin',  type: 'link',   toggle: true, class: 'sb_rightsidebarpin',   icon:  sb_icons['icon_pin'],  events: {onclick: "onclick_right_sidebarpin(this, event)"}, title: 'Pin Window'},                 
    ]
}

const default_right_sidebarmenu = {
    id:'right_sidebarmenu',
    type: 'bar',
    class: 'sb_sidebarmenu sb_left',  
    direction: 'column',    
    items : 
    [
        {
            id: 'right_sidebarmenu_maingroup',
            type: 'group',                    
            direction: 'column',
            items : []
        }, 
        default_right_settingsgroup,
   ]
}

const default_right_sidebarpanel  = {
    id: 'right_sidebarpanel',
    type: 'panel',
    class: 'sb_panel sb_rightsidebarpanel sb_left',     
    items : 
    [
        default_right_sidebarheader,                 
        {id: 'rightsidebarpanel_solution',         type: 'panel',    class: 'sb_panel sb_main', items: [solutionpanel]},
    ]
}