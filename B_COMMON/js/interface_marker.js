var markereditor_input = (id =>  {return {
    id: 'markereditor_input_' + id,
    type: 'html',
    class: 'sb_panel markereditor_input',
    catchresize: true,
    resizefunction: 'markereditor_resize("markereditor_input_' + id + '")',  
}})

var markereditor_output = (id =>  {return {
    id: 'markereditor_output_' + id,
    type: 'html',
    class: 'sb_panel markereditor_output',   
    catchresize: true,
    resizefunction: 'markereditor_resize("markereditor_output_' + id + '")',      
}})

var markereditor_updategroup = (id =>  {return {
    id: 'markereditor_updategroup',  
   // position: 'sb_end',
    class: 'sb_transform sb_none',
    type: 'group',                        
    items: 
        [ 
            {id: 'delete_marker', type:'link', icon: icon_remove,  style: "", events: {onclick: "onclick_marker_delete(this, event)"}, title: 'Delete'},             
            {id: 'update_marker', type:'link', icon: icon_save,    style: "", events: {onclick: "onclick_marker_update(this, event)"}, title: 'Save'},  
            {id: 'cancel_marker', type:'link', icon: icon_cancel,  style: "", events: {onclick: "onclick_marker_cancel(this, event)"}, title: 'Cancel'},  
            {id: 'modify_marker', type:'link', icon: icon_eye,     style: "",             events: {onclick: "onclick_marker_modify(this, event)"}, title: 'Update'},  
        ]
}})

var markereditor_localfilegroup = (id =>  {return {
    id: 'markereditor_localfilegroup_' + id,
    type: 'group',     

    items:
        [ 

            {id: 'name_marker',      class: 'sb_right', item : 'Name', type:'text',  title: 'Marker Name',   events: {onclick:'onclick_markereditor_group(this, event)', onkeypress:'CheckChar(event)'}},          
            { 
                id:'',
                type: 'group',                   
                position: 'me-auto',
                items : 
                    [ 
                        {id: 'visible_marker_' + id,   item: 'Visible', type :'radio', class: 'visible_marker', attributes: {checked: true, name: "radio_complete_marker"},                 events: {onclick: "onclick_radiomarker(this, event)"}, title: 'Mark on the Visible part of the Chart'}, 
                        {id: 'complete_marker_' + id,  item: 'Chart',   type :'radio', class: '', attributes: {name: "radio_complete_marker"},  events: {onclick: "onclick_radiomarker(this, event)"}, title: 'Mark on the complete Chart'},
                    ]
            },                      
            {id: 'upload_marker',    icon: icon_download,  class: 'sb_right', type:'link',  title: 'load script from your local machine', events: {onclick:'onclick_markereditor_group(this, event)'}},
            {id: 'export_marker',    icon: icon_export,    class: 'sb_right', type:'link',  title: 'Save script on your local machine',   events: {onclick:'onclick_markereditor_group(this, event)'}},          
        ]    
}})


var markereditor_evalgroup = (id =>  {return {
    id: 'markereditor_evalgroup_' + id,
    type: 'group',     
    position: 'me-auto',
    class: 'sb_transform sb_right',    
    items:
        [ 
            {id: 'eval_marker',    icon: icon_play,    type:'button',  title: 'eval content', events: {onclick:'onclick_markereditor_group(this, event)'}},            
        ]    
    }})

var markereditor_bar  = (id =>  {return {
    id: 'markereditor_bar_' + id, 
    type: 'bar',    
    items:
     [
        markereditor_evalgroup(id),        
        markereditor_localfilegroup(id),
        markereditor_updategroup(id),
    ]
}})

var markereditor = (id =>  {return {
    id: 'markereditor_' + id,
    type: 'panel',
    class: 'sb_panel markereditor',
     items:
    [
   //     markereditor_bar(id),
        markereditor_input(id),
        markereditor_output(id),
    ]   
}})



var markerpanel = (id => {return {
    id: 'markerpanel_' + id,
    type: 'panel',
    class: 'sb_panel markerpanel',
    closed: true,
    items: [
        markereditor(id),
    ],
    catchresize: true,
    resizefunction: 'markereditor_resize()',      
}})

var boxmarkerpanel  = (id =>  {return {
    id: 'boxmarkerpanel_' + id,
    type: 'box',
    closed: true,
    header: {item: 'Markers',  control: {slide: true, onclick_slide: 'onclick_slidehideotherbox (this)', closed : true, orientation: sb.R_CONTROL} },  
    items: [markereditor(id)] 
}})