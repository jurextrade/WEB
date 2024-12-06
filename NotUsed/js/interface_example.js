var EXAMPLE_ID              = 'example_root';
var EXAMPLE_PLATFORM_PNAME  = 'example';
var EXAMPLE_PLATFORM_NAME   = 'YouTube Example';


var example_main = {
    id: 'example_main', 
    type: 'html',       
    class: 'sb_main sb_column sb_pane',
    events: {ondragover: "allowDrop(event)", ondrop: "ondrop_home_main(event)"},      
    content: "ExampleApp('app')",
    resize: "",
   
}

var exampleplatform = {
    id : EXAMPLE_ID,    
    name : EXAMPLE_PLATFORM_NAME, 
    pname: EXAMPLE_PLATFORM_PNAME,

    type: 'root',
    class: 'sb_row',
    items: [example_main],    
    select: 'example_select(\'' + EXAMPLE_PLATFORM_NAME + '\')', 
    init: 'example_init()',  
}