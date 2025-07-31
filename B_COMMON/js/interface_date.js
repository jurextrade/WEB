var date_tags =  [    
    {tag: 'gmttime',   format: '%utc_hours:%utc_minutes:%utc_seconds %gmt'},
    {tag: 'localtime', format: '%hours:%minutes:%seconds %pe'},
    {tag: 'localdate', format: '%month-%date-%fullyear'},
    {tag: 'dayname',   format: '%dayname'}            
]   

var datepanel = { 
    id: 'datepanel',
    pname: 'date',
    type: 'panel',
    class: 'sb_bargroup sb_marginleft',
    form: true,                     
    items :
        [ 
            {id: 'dayname',    class: 'sb_space',  type: 'ihtml',   attributes: {tag: 'dayname'},  title: 'day'},  
            {id: 'localdate',  class: 'sb_space',  type: 'ihtml',   attributes: {tag: 'localdate'}, title: 'date'},  
            {id: 'gmttime',    class: 'sb_space',  type: 'ihtml',   attributes: {tag: 'gmttime'},   title: 'gmt'},
            {id: 'localtime',  class: 'sb_space',  type: 'ihtml',   attributes: {tag: 'localtime'}, title: 'time'}  
        ],
    init: 'date_init()',        
}
