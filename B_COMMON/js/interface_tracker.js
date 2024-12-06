var trackertable = (id =>  {return {
    id: 'trackertable_' + id,
    type: 'table',            
    class:'trackertable sb_pane',    
    events:{onmouseover: "onmouseover_trackertable(this, event)"},   //events are on rows
    columns :  [
//        sb.controls ({close: true, onclick_close: 'onclick_closetrackerpanel (this)'}), 
        '',
        'Indicator', 
        'Signal', 'Vop', 'Value', 'Prev', 'Type', 
        'Logic',  'M1',  'M5',  'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN',  'EP', ''],
    columnstitle : ['Mark on Chart', 'Indicator', 'Signal',  'Operation On Value', 'Value', 'Signal occuring on the previous Bar', 'Type of Search', 'Time Frames Combination',  '1 minute',  '5 minutes',  '15 minutes', '30 minutes', '1 hour', '4 hours', '1 day', '1 week', '1 month',  'Time Frame in which expert is running', 
    'Delete Row'],
    rows : [] 
}})


var trackerbar = {
    id : 'trackerbar', 
    type: 'bar',
    class:'sb_transform',
    items: 
        [
            { 
                type: 'group',                        
                items :
                    [ 
                        {id: 'trackerbar_addsignal', item: 'Select Signal', icon: icon_plus,  type:'button',  title: 'Select Signal',                   events: {onclick: 'onclick_tracker_selectindicator(this, event)'}},                 
                        {id: 'trackerbar_addindicator',       item: 'Add Indicator', icon: icon_new,   type:'button',  title: 'Add Signal From new Indicator',   events: {onclick: "onclick_tracker_addindicator(this, event)"}}                 
                    ]
            },
            { 
                type: 'group',   
                position: 'sb_end',                                     
                items :
                    [ 
                        {id: 'trackerbar_reset',    icon: icon_trash,   type:'button',  title: 'clear content',  events: {onclick:'onclick_tracker_reset(this, event)'}},         
                        {id: 'toolspanelheader_pin',  type: 'button',   toggle: true, class: '',   icon: sb_icons['icon_pin'],  events: {onclick: "onclick_toolspanelheaderpin(this, event)"}, title: 'Pin Window'},                 
                    ]
            }

        ]
} 

var trackerpanel  = (id =>  {return {
    id: 'trackerpanel_' + id,
    type: 'panel',  
    class: 'sb_panel trackerpanel sb_main',
    items: [
        trackerbar,        
        trackertable(id),
    ],
}})

