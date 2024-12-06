var tree_indicatortype = {
    id: 'tree_indicatortype',       
    type: 'tree',       
    class:'sb_right sb_pane',
    item: 'Indicators',
    icon: icon_indicator,
}  

/*----------------------------------------------------------- INDICATOR LEVELS PANEL -----------------------------------------------------*/


var indicatorlevelsbar  = {
    id: 'indicatorlevelsbar',
    type: 'bar',             

    direction: 'row',     
//    header : {title: 'Projects'},
    items: 
        [
            { 
                type: 'group',                
                position: 'me-auto',
                items:
                    [ 
                        {id: 'overboughtsold', item : 'Overbought/Oversold',    type:'checkbox',      events: {events: {onclick:'onclick_overboughtsold()'}}, title: 'Corresponding Signals: ExtOverbought, OverBougth, Range, OverSold, ExtOverSold'}, 
                        {id: 'strongweak',     item:'Strong/Weak',              type:'checkbox',      events: {events: {onclick:'onclick_strongweak()'}}, title: 'Corresponding Signals: VeryStrong, Strong, Neutral, Weak, VeryWeak'}  
                    ]
            },            
            { 
                type: 'group',                   
                position: 'sb_end',
                items:
                    [ 
                        {id: 'fillright',   item : 'Fill right', type:'link',  icon: 'fas fa-angle-double-right', events: {events: {onclick:'onclick_fillright()'}},   title: 'Same Values as M1 Column'},      
                        {id: 'filldown',    item : 'Fill Down',  type:'link',  icon: 'fas fa-angle-double-down',  events: {events: {onclick:'onclick_filldown ()'}},   title: 'Symetric Values To MEDIUM Level'},  
                        {id: 'clear',       item : 'Clear',      type:'link',  icon: icon_remove,                 events: {events: {onclick:'onclick_clear ()'}},      title: 'Clear Values'}              
                    ]
            }
        ]
}   

var indicatorlevelstable = {
    id: 'indicatorlevelstable',
    type: 'table',
    columns :  ['Level', 'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'],
    columnstitle: ['Level', '1 minute',  '5 minutes',  '15 minutes', '30 minutes', '1 hour', '4 hours', '1 day', '1 week', '1 month'],
  //  columnsstyle: ['padding-left:10px;', '', '', '', '', '', '', '', '', 'padding-right:10px;'],
    rows: [['UPPER', '', '', '', '', '', '', '', '', ''],
            ['UP', '', '', '', '', '', '', '', '', ''],
            ['MEDIUM', '', '', '', '', '', '', '', '', ''],
            ['LOW', '', '', '', '', '', '', '', '', ''],
            ['LOWER', '', '', '', '', '', '', '', '', ''],
           ] 
}