//--------------------------------------------------------------------- EMV PARSER PANEL --------------------------------------------------------------------

var emv_tlvparserpanel = {
    id: "emv_tlvparserpanel",
    type: "html",
    class: "sb_column sb_formcontainer",
    content: "emv_tlvparser_panel()",
}


var emv_box_tlvparser = {
    id: 'emv_box_tlvparser',
    type: 'box',
    closed: false, 
    header: {item: 'TLV Parser',  control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : false, orientation: sb.R_CONTROL} },  
    items: [emv_tlvparserpanel]        
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------

var emv_tools_headerpanel = {
    id: 'emv_tools_headerpanel',
    type: 'bar',
    class: 'sb_sidebarheader ',    
    items : 
    [
        {id: '',                type: 'link',    item: 'EMV TOOLS',  class: 'sb_sidebarheadertitle'},      
        {id: 'header_load',     type: 'link',   class: 'sb_sidebarheaderinfo',   icon:  icon_file,  events: {onclick: "onclick_jsonloadfile(this, event)"}, title: 'link to documentation'},                 
    ]
}

var emv_tools_sidepanel = {
    id: 'emv_tools_sidepanel',
    type: 'panel',
    class: 'sb_sidepanel sb_panel sb_main sb_column',
    items:[
        emv_tools_headerpanel,         
        emv_box_tlvparser  
    ],
}
