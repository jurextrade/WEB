const sb_default_theme = 'remix';
var options  = {}; 
function yes_callback() {
   
    options.yes_callback();
}
function no_callback() {
    
    options.no_callback();
}


function defined (value) {
    return value != undefined;
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
    

$(document).ready(function(){
    $(document).on('click', function(event){
        var overlays = $('.sb_overlay');
        $.each(overlays, function (index, overlay) {
            var overlay_options = $(overlay).data('options');  
            if (overlay_options && !overlay_options.keepopen)
                $(overlay).remove();      
        });
    });
    
    $(document).on('mouseup', function(event){
        var overlays = $('.sb_overlay');
        $.each(overlays, function (index, overlay) {
            var overlay_options = $(overlay).data('options');  
            if (overlay_options && !overlay_options.keepopen)
                $(overlay).remove();      
        });
    });  
    $(document).on("contextmenu", function(){
        let overlays = $('.sb_overlay');
        $.each(overlays, function (index, overlay) {
            var overlay_options = $(overlay).data('options');  
            if (overlay_options && !overlay_options.keepopen)
                $(overlay).remove();      
        });
    });
    
    $(document).on('keydown', function (event) {
        if (event.key == "Escape") {
            $(document).trigger('click')
            return;
        }   
        
        if (event.ctrlKey && event.keyCode == 9) {        
            console.log ('Ctrl Tab is pressed')
        }
    })

    window.addEventListener('resize', 
        function(event){
//            console.log ('resizin');
            sb.resize (body)
         }
     );
     
    $(document).on('click', '#slide', function(){
        $(this).toggleClass('rotate-180');
    });

    $(document).on('click', '.sb_tablerow', 
        function() {
            onclick_sb_tablerow (this);
        });

    $(document).on('click', '.box-btn-compressscreen', function(){
        $(this).parents('.sb_box').toggleClass('box-compressscreen').addClass('box-fullscreen');
    });

    $(document).on('click', '.box-btn-fullscreen', function(){
        $(this).parents('.sb_box').toggleClass('box-fullscreen').addClass('box-compressscreen')
    });

    $(".sb_link input").on("input", function(event){
        var elt = event.target;
        $(elt).trigger( "onchange" );  
        return;      

        var default_value;    

        if (elt.tagName.toLowerCase() == 'select') {
            default_value =  $('#' + elt.id + ' [selected="selected"]').val();  
        } else {
            default_value = $(elt).prop("defaultValue");        
        }
        
        if (default_value != $(elt).val()) {      
              $(elt).attr( "changed", 'true' );
              $(elt).trigger( "onchange" );              
        }
        else {
             $(elt).removeAttr( "changed" );
        }
    });
}); 

function onclick_sb_sortable (event) {
    let th = event.target;
    if (!th.classList.contains('sb_sortable')) {
        return
    }
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr) );
}    


function onchange_default_sb_item(elt){

    var default_value;    
    var element_value;

    if (elt.tagName.toLowerCase() == 'select') {
        default_value =  $('#' + elt.id + ' [selected="selected"]').val();  
        element_value = $(elt).val();
    } else {
        switch ($(elt).prop("type")) {
            case 'checkbox' :
            case 'radio' :                
               default_value = $(elt).prop("defaultChecked");    
               element_value = $(elt).prop("checked");  
            break;
            default:
                default_value = $(elt).prop("defaultValue");     
                element_value = $(elt).val();                                
            break;
        }
   
    }
    
    if (default_value != element_value) {      
          $(elt).attr( "changed", 'true' );
     //     console.log ('changed ' + element_value)
    }
    else {
         $(elt).removeAttr( "changed" );
    //     console.log ('notchanged')         
    }    

}

// orientation 0 left 1 right

function Selection_clear () {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else 
    if (document.selection) {
        document.selection.empty();    
    }
}

function ondblclick_sb_boxheader (elt) {
    Selection_clear ();
    $(elt).find('.box-btn-slide').click();           
}

function focusAndCursor(selector){
    var input = $(selector);

    setTimeout(function() {
      // this focus on last character if input isn't empty
      let tmp = input.val(); 
      
      input.focus().val("").blur().focus().val(tmp);
    }, 10);
}

function onclick_sb_tablerow (elt, event) {
    let children = $(elt).parent().children();
    $.each(children, function () {
        $(this).removeClass('active'); 
        });
    $(elt).addClass("active");
}

function onclick_default_slide (elt, event) {
    event.stopPropagation();
    $(elt).toggleClass('rotate-180').closest('.sb_box').find('.sb_boxbody').slideToggle();
}

function onclick_default_tab (elt, event) {
    event.stopPropagation();
    $('#' + CSS.escape(elt.id)).tab('show');
}

function onclick_default_tree (elt, event) {
    $(elt).find('> .tree-arrow-right').toggleClass('rotate-90');
    var treeelt = $(elt).closest('.sb_tree');
    
    $('#' + elt.id + '_ref').toggleClass('closed');
    $('#' + elt.id + '_ref').slideToggle();
}

function onclick_default_radio_item (elt, event) {
    const links = $(elt).parent ().parent().children ();
    $.each(links, function (index, link) {
        $(link.children[0]).prop("checked", false);
    });
    $(elt).prop("checked", true);
}

function onclick_default_item (elt, event) {
    $(elt).toggleClass("checked");    
}

function onclick_default_bargroup (elt, event) {
    event.preventDefault();

    if ($(elt).hasClass("checked"))
        return;
    
    const links = $(elt).parent ().children ();
    $.each(links, function (index, link) {
        $(link).removeClass("checked");
    });
    $(elt).addClass("checked");
}

function onclick_openaimodelgroup (elt, event) {
    switch(elt.id) {
        case 'completions_button':
            
        break;
        case 'chat_button':
        break;       
        case 'edit_button':
        break;       
        case 'image_button':
        break;      
        case 'audio_button':
        break;      
    }
}
function onmousedown_default_widget (elt, event) {
    var children = $(elt).parent().children();
    $.each(children, function () {
        $(this).removeClass('active'); 
        });
    $(elt).addClass("active");
}

function sb_widget_create (id, onclickcallback, icon, title, description, seehowcallback, seehowtitle) {

    var seehowbuttons = '';
    if (defined(seehowcallback)) {
        for (var i = 0; i < seehowcallback.length; i++) {
            seehowbuttons += '<button id="' + id + '_seehow" class="sb_sbutton seehowbutton" onclick="event.preventDefault();' + seehowcallback[i] + '">' + seehowtitle[i] + '</button>';  
        }
    }
    var content = 
'       <div id="' + id + '" class="sb_widget" onmousedown="onmousedown_default_widget (this,event);" onclick="' + onclickcallback + '">' +
'           <div class="sb_widget-icon">' +
'               <span class="sb_icon"><i aria-hidden="true"  class="' + icon + '"></i></span>' +
'           </div>' +
'           <div class="sb_widget-content">' +
'               <div class="sb_widget-title">' +
'                   <span>' + title + '</span>' +
'               </div>' +
'               <div class="sb_widget-description">' + description + '</div>' +
'               <div class="sb_widget-buttons">'  +
                    seehowbuttons +
'               </div>' +
'           </div>' +
'       </div>';
    return content;
}
//---------------------------------------------------- SB BODY  ------------------------------------------------  

const dragbar_v_defaultoptions = {
    axis:"x",
    containment: "parent",
    start: function (event, ui ) {
        this.startoffset = ui.offset.left;
    },
    drag: function (event, ui) { 
        var dragpanel = $('#' + $(event.target).attr("dragid"));               
        var minwidth    = parseInt($(dragpanel).css('min-width'));   
        if (!minwidth) {  // Nan return true
            return;
        }
        var dragpanel_loffset = dragpanel[0].offsetLeft;
        
        if (ui.offset.left < minwidth + dragpanel_loffset) {
            ui.position.left =   -(this.startoffset - (minwidth + dragpanel_loffset));
//            console.log (ui.position.left);            
        }    
         
    },
        
    stop: function(event, ui) {
        let dragelt = $(event.target);
        
        let previoussibling = $(event.target).prev()
        let nextsibling     = $(event.target).next()

        var dragpanel       = $('#' + dragelt.attr("dragid"));  
        var dragpanelwidth =  $(dragpanel).outerWidth();

        if (dragpanel.is(nextsibling)) {
            $(dragpanel).css ('width', (dragpanelwidth - ui.position.left) + 'px');
        }
        else {
            $(dragpanel).css ('width', (dragpanelwidth + ui.position.left) + 'px');
        }    
        dragelt.css ('left', '0px');

        
        if (previoussibling.length) {
            let prevsb_elts = sb.get(sb.interface, 'id', previoussibling.attr('id'));
            if (prevsb_elts.length != 0) {
                let prevsb_elt = prevsb_elts[0];
                sb.resize(prevsb_elt);

            }
        }
        if (nextsibling.length) {
            let nextsb_elts = sb.get(sb.interface, 'id', nextsibling.attr('id'));
            if (nextsb_elts.length != 0) {
                let nextsb_elt = nextsb_elts[0];
                sb.resize(nextsb_elt);
            }     
        }
    }
};

const dragbar_h_defaultoptions =  {
    axis:"y",
    containment: "parent",
    start: function( event, ui ) {
        startoffset = ui.offset.top;
    },
    drag: function(event, ui) { 
        var dragpanel = $('#' + $(event.target).attr("dragid"));          
        var minheight    = parseInt($(dragpanel).css('min-height')); 
        if (!minheight) {
            return;
        }
        var dragpanel_toffset = dragpanel[0].offsetTop;    
        var dragpanel_hoffset = dragpanel[0].offsetHeight;

        if (ui.offset.top > (dragpanel_toffset * minheight) / dragpanel_hoffset) {
        //    ui.position.top =  dragpanel_toffset + minheight - startoffset;
        }    
         
        
    },
        
    stop: function(event, ui) {
        let dragelt = $(event.target);

        let previoussibling = dragelt.prev()
        let nextsibling     = dragelt.next()

        var dragpanel = $('#' + $(event.target).attr("dragid"));   
        var dragpanelheight =  $(dragpanel).outerHeight();     
        
        
        if (dragpanel.is(nextsibling)) {
            $(dragpanel).css ('height', (dragpanelheight - ui.position.top) + 'px');
        }
        else {
            $(dragpanel).css ('height', (dragpanelheight + ui.position.top) + 'px');
        }   
        dragelt.css ('top', '0px');  

        if (previoussibling.length) {
            let prevsb_elts = sb.get(sb.interface, 'id', previoussibling.attr('id'));
            if (prevsb_elts.length != 0) {
                let prevsb_elt = prevsb_elts[0];
                sb.resize(prevsb_elt);
            }
        }
    

        if (nextsibling.length) {
            let nextsb_elts = sb.get(sb.interface, 'id', nextsibling.attr('id'));
            if (nextsb_elts.length != 0) {
                let nextsb_elt = nextsb_elts[0];
                sb.resize(nextsb_elt);
            }     
        }
    }
};

//---------------------------------------------------- SB BODY  ------------------------------------------------  

class SB {
    
    constructor () {
        this.L_CONTROL = 0;
        this.R_CONTROL = 1;
        this.CLOSED_BOX = true;
        this.HEADER_HIDDEN = true;
        this.interface = null;
        this.theme = sb_default_theme;
    }
     //   this.observer= new ResizeObserver();
     drag_update = function () {                                                // mise a jour jquery pour draggable
                                                                                //DRAG  HTML ADDED                   
        $( ".dragbar_v" ).draggable(dragbar_v_defaultoptions);   
        $( ".dragbar_h" ).draggable(dragbar_h_defaultoptions);    
        $( ".sb_tab" ).sortable();   
        $( ".sb_tab" ).disableSelection()

     }

     itemswithtype = function (elt, field, type, arraytype) {
        let sfield = 'elt.' + field;
        try {
            if (eval(sfield) == type) {
                if (!arraytype.find(item => item.id == elt.id)){
                    arraytype.push(elt);            
                }
            }
        }
        catch (error) {
            return;
        }

        if (!defined(elt.items)) {
            return;
        }
        for (var i = 0; i < elt.items.length; i++) {
            this.itemswithtype(elt.items[i], field, type, arraytype);
        }
    }
    
    get = function (elt, field, type) { // field in string
        if (elt == null) {
            console.log ('Error : root not defined');
            return null;
        }
        var items = [];
        this.itemswithtype(elt, field, type, items);
        return items;
    }

    resize = function (item) {
        if(document.readyState == "loading") return;
        
        let resizables = sb.get(item, 'catchresize', true);
        for (var i= 0; i < resizables.length; i++) {
            if (defined(resizables[i].resizefunction)) {
                eval(resizables[i].resizefunction)
            }
        }
    }

    additem = function (fitem, item) {
        fitem.items.push (item)
    }

    update = function (item) {
        //let parent = $('#' + item.id).parent();
        $('#' + item.id).replaceWith (this.render(item));
    }

    body = function (body) {
        var content = '';
        if (this.interface != null) {
            console.log ('Error : body already rendered');
            return;
        }

        this.interface= body;

        for (var i = 0; i < body.items.length; i++) {
            content += this.render (body.items[i])
        }    
        var elt =  document.getElementsByTagName("body")[0];
        elt.classList.add("sb_body");
        elt.setAttribute('theme', this.theme)
// html update        
        elt.insertAdjacentHTML('afterbegin', content);   

        this.drag_update()
        
    }

    header = function (header) {
        var content ='<header id="' + header.id + '" class="sb_header ' +
                        (defined(header.class) ? header.class : '') + '" ' + 
                        (defined(header.style) ? 'style= "' + header.style + '" ' : ' ')  +  
                        (defined(header.attributes) ?  this.stringify(header.attributes) : '') +        
                        (defined(header.events) ? this.stringify(header.events) : '') + '>';

        content += this.bar_header (header.brand);

        for (var i = 0; i < header.items.length; i++) {
            content += this.render (header.items[i])
        }
                    
        content += '</header>';
        return content;                    
    }

    footer = function (footer) {
        var content ='<footer id="' + footer.id + '" class="sb_footer ' +
                        (defined(footer.class) ? footer.class : '') + '" ' +  
                        (defined(footer.style) ? 'style= "' + footer.style + '" ' : '')  +                        
                        '>';
        for (var i = 0; i < footer.items.length; i++) {
            content += this.render (footer.items[i])
        }
        content += '</footer>';
        return content;         
    }

    main = function (main) {
        var content ='<main id="' + main.id + '" class="sb_main ' +
                        (defined(main.class) ? main.class : '') + '" ' + 
                        (defined(main.style) ? 'style= "' + main.style + '" ' : '')  +                      
                        '>';
        for (var i = 0; i < main.items.length; i++) {
            content += this.render (main.items[i])
        }
        content += '</main>';
        return content;         
    }

    //---------------------------------------------------- SB ROOT  ------------------------------------------------  

    root = function (root) {
    
        var content ='<div id="' + root.id + '" class="sb_root ' +
                        (defined(root.class) ? root.class : '') + '" ' + 
                        (defined(root.style) ? 'style= "' + root.style + '" ' : '')  +                      
                        '>';

        for (var i = 0; i < root.items.length; i++) {
            content += this.render (root.items[i])
        }
        content += '</div>';
        return content;
    }

    //---------------------------------------------------- SB PANEL  ------------------------------------------------  

    panel = function (panel) {

        var content = '<' + 
        (defined(panel.container) ? panel.container : 'div') + ' id="' + panel.id + '" class="' +  
        (defined(panel.class) ? panel.class : '') + '" ' + 
        (defined(panel.attributes) ?  this.stringify(panel.attributes) : '') +    
        (defined(panel.events) ? this.stringify(panel.events) : '') +                                                   
        (defined(panel.style) ? 'style= "' + panel.style + '" ' : '') + '>';                         
        if (defined (panel.items) && panel.items.length != 0) {
            for (var i = 0; i < panel.items.length; i++) {
                content += this.render (panel.items[i])
            }
        }    
        content += '</' + (defined(panel.container) ? panel.container : 'div') + '>';
        return content;
    }        

    //---------------------------------------------------- SB HTML  ------------------------------------------------  

    html = function (html) {

        var content = '<' + 
        (defined(html.container) ? html.container : 'div') + ' id="' + html.id + '" class="' + 
        (defined(html.class) ? html.class : '') + '" ' + 
        (defined(html.style) ? 'style= "' + html.style + '" ' : ' ')  +  
        (defined(html.attributes) ?  this.stringify(html.attributes) : '') +        
        (defined(html.events) ? this.stringify(html.events) : '') + '>' + 

            (defined (html.content)  ?  eval(html.content) : ''); 
        
        content += '</' + (defined(html.container) ? html.container : 'div') + '>';

        return content;
    }
    //---------------------------------------------------- SB LABEL  ------------------------------------------------                      
    
    label = function (label) {

        var content = '<label'  + ' id="' + label.id + '" class="sb_label ' +  
        (defined(label.class) ? label.class : '') + '" ' + 
        (defined(label.style) ? 'style= "' + label.style + '" ' : ' ')  +  
        (defined(label.title) ? 'title= "' + label.title + '"' : ' ') +                
        (defined(label.attributes) ?  this.stringify(label.attributes) : '') +        
        (defined(label.events) ? this.stringify(label.events) : '') + '>' + 
        (defined(label.item)  ?  label.item : '') + 
        '</label>';

        return content;
    }

    //---------------------------------------------------- SB DRAG  ------------------------------------------------  

    drag = function (drag) {

        var dragclass   = (defined(drag.direction) && drag.direction == 'vertical' ?  'dragbar_v' : 'dragbar_h');
        var dragid      = (defined(drag.dragid)  ?  drag.dragid : '');
        
        var content = '<div ' + (defined(drag.id) ? 'id="' +  drag.id  + '"' : '') + ' class="' + dragclass +
                (defined(drag.class) ? ' ' + drag.class + '" ' : '" ') +    
                ' dragid="' + dragid + ' "' +
                (defined(drag.attributes) ?  drag.attributes : '') +    
                (defined(drag.events) ? this.stringify(drag.events) : '') +         
                (defined(drag.style) ? 'style= "' + drag.style + '"' : '')  + 
            '></div>';
        return content;
    }

    //---------------------------------------------------- SB GROUP  ------------------------------------------------  
    
    group = function (group) {
        var content = '';
        let grouptype = 'sb_bargroup '; 
        var togglefunction;

        if (defined(group.form)  && group.form == true) {
            grouptype = 'sb_formgroup ';
        }
        
        if (defined(group.toggle) && group.toggle == true) {
            togglefunction = 'onclick_default_bargroup(this, event)';
        }
        var groupclass = '';
        
        if (defined(group.class)) groupclass = group.class;
        
        content += (group.position == 'sb_end' ? '<div class="sb_end"></div>' : '');
        content += (group.position == 'sb_distance' ? '<div class="sb_distance"></div>' : '');
        
        content += '<div ' + (defined(group.id) ? 'id="' +  group.id  + '"' : '') + ' class="' + grouptype + groupclass + '" ' +
                    (defined(group.attributes) ?  group.attributes : '') +    
                    (defined(group.events) ? this.stringify(group.events) : '') +         
                    (defined(group.style) ? 'style= "' + group.style + '" ' : ' ')  + 
                '>';
        
        if (defined (group.items)) {
            for (var i = 0; i < group.items.length; i++) {
                var item = group.items[i];
                content += this.render (item, togglefunction); 
            }
        }
        content += '</div>';
        return content;
    }

    group_select = function (elt) {
        if ($(elt).hasClass("checked"))
        return;
        
        const links = $(elt).parent ().children ();
        $.each(links, function (index, link) {
            $(link).removeClass("checked");
        });
        $(elt).addClass("checked");
    }



    //---------------------------------------------------- SB BAR  ------------------------------------------------  

    bar = function (bar) {
        var content =  '<div id="' +  bar.id + '" class="sb_bar' +  
                            (defined(bar.class) ? ' ' + bar.class : '') +                                 
                            (bar.direction && bar.direction == 'column' ?  ' sb_column' : ' sb_row') + '"' +  
                            (defined(bar.style) ? ' style= "' + bar.style + '" ' : '')  + 
                            (defined(bar.attributes) ?  this.stringify(bar.attributes) : '') +    
                            (defined(bar.events) ? this.stringify(bar.events) : '') +                                                                       
                    '>' + 
                    (defined(bar.item)  ?  bar.item : '')                  ;

        content += this.bar_header (bar.header);

        if (defined (bar.items)) {
            for (var j= 0; j < bar.items.length; j++) {
                content += this.render (bar.items[j]);
            }                                 
        }    
        content +=  '</div>';
        return content; 
    }  

    bar_header = function (brand) {
        var content = '';
        if (brand) {                    
            content +=
            '       <div class="sb_brand navbar-header"'  + 
                        (defined(brand.style) ? ' style= "' + brand.style + '" ' : '')  + '>' +                
            '           <a class="navbar-brand" ' + (defined(brand.events) ? this.stringify(brand.events) : '') + '>' +
                            (defined(brand.logo) ? '<img  class="d-inline-block sb_sitelogo" src="' + brand.logo + '" alt="">' : '') +        
            '               <span class="d-inline-block sb_bartitle">'+ (defined(brand.title) ? brand.title : '')  + '</span>' +
            '           </a>' +
            '       </div>';     
        }
        return content;
    }

    bar_select = function (id) {
        $(id).click();
    }

    bar_disable = function (barid, id) {
        $('#' + barid + ' #' + id).prop('disabled', true);
    }

    bar_enable = function (barid, id) {
        $('#' + barid + ' #' + id).prop('disabled', false);
    }

    bar_nav_group = function (group) {
        var content = '';
        
        content += '<ul class="navbar-nav ' + group.position + '" id="' +  group.id  + '">';
        for (var i = 0; i < group.items.length; i++) {
            var item = group.items[i];

            if (item.type) {
                switch (item.type) {
                    case 'link' :
                        content +=  '<a id="' + item.id + '" class="nav-link ' + item.icon + '" title="' + item.title + '"' + 
                                (defined(item.events) ?  this.stringify(item.events)  : '')  + '>' + item.item + '</a>'; 
                    break;
                    case 'html' :
                        content += '<span  class="' + (defined(item.class) ? item.class : '') + '" title="' + item.title + '">' +  
                                                    (defined(item.content) ?   eval(item.content) : '') +  '</span>';                     
                    break;

                }
            } else {
                content +=  '<a id="' + item.id + '" class="nav-link ' + item.icon + '" title="' + item.title + '"' + 
                                    (defined(item.events) ?  this.stringify(item.events)  : '')  + '>' + item.item + '</a>'; 
            }
        }
        content += '</ul>';
        return content;
    }

    nav_bar = function (menu) {
        var content = 
        '<nav id="' +  menu.id + '" class="sb_bar navbar navbar-expand">' +
            '<div class="container-fluid">';
                        
        content += this.bar_header (menu.header);
        for (var j= 0; j < menu.groups.length; j++) {
            content += this.render (menu.groups[j]);
        }
        
        content +=  '</div></nav>'; 
        return content; 
    }

    //---------------------------------------------------- SB TAB  ------------------------------------------------  

    tabs = function (tabs) { 
        var scontent = '';
//added     cname;
        
        for (var i = 0; i < tabs.items.length; i++) {
            var item    = tabs.items[i];
            let events  = defined(item.events) ? Object.assign({}, item.events) : {};            
            if (defined(events.onclick) ? events.onclick = 'onclick_default_tab(this,event); ' + events.onclick :  events.onclick = 'onclick_default_tab(this,event)'); 

            if (!defined(item.cname)) item.cname = item.id;   
            if (!defined(item.roleid)) item.roleid = 'role_' + item.id;        
            scontent +=     
            '<li class="nav-item">' +
                '<a id="' + item.id + '" class="sb_row nav-link'  + (i == 0 ? ' active' : '') + 
                (defined(item.class) ? ' ' + item.class : '') + 
                '" data-bs-toggle="sb_tab" data-bs-target="#' + item.roleid + '"' + 
                ' type="button" title="' + (defined(item.title) ? item.title : item.cname) + '"'  + 
                (defined(item.attributes) ?  this.stringify(item.attributes) : '') +                        
                this.stringify(events)  + '>' +
                (defined(item.icon) ? '<i class="' + item.icon + '"></i>' : '') +
                (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                 
                '<span class="sb_label">' + item.item  + '</span>' +
                (defined(item.onclose) ? '<span class="sb_close-tabs" ' + item.onclose + ' title="Close"><i class="fas fa-times" aria-hidden="true" ></i></span>' : '') +
                '</a>' +
            '</li> ';

        }
        var groupscontent = '';

        if (defined(tabs.groupitems)) {
            for (var j= 0; j < tabs.groupitems.length; j++) {
                groupscontent += this.render (tabs.groupitems[j]);
            }    
        }
        
        var content =   

    '   <div id="' +  tabs.id + '" class="sb_tabs sb_column ' + 
                            (defined(tabs.class) ? tabs.class : '') + '"' +    
                            (defined(tabs.attributes) ?  this.stringify(tabs.attributes) : '')  +
                            (defined(tabs.events) ?  ' ' + this.stringify(tabs.events) : '') + '>' +                              
    '       <div class="sb_transform sb_tabcontainer"' +    
                (defined(tabs.tabevents) ?  ' ' + this.stringify(tabs.tabevents) : '') + '>' +  
    '           <ul class="sb_tab nav nav-tabs">' +
                    scontent +
    '           </ul>' +
                groupscontent +
    '       </div>' +

    '       <div class="sb_content tab-content">';
        
        var roletab=[];

        for (var i = 0; i < tabs.items.length; i++) {
            var item = tabs.items[i]; 
            if (roletab.find(element => element == item.roleid) == undefined) {                          
                content +=                  
                '<div id="' + item.roleid + '" role="tabpanel" class="sb_pane' + (i == 0 ? ' active' : '') + '">';
                for (var j= 0; j < item.items.length; j++) {
                    content += this.render (item.items[j]);
                } 
                content += '</div>';        
            }
            roletab.push (item.roleid);
        }

        content += 
    '       </div>' +    
    '   </div>';
            
        return content;
    }    

    tab_additem = function (tab, item, position) {
        let events      = defined(item.events)     ?  Object.assign({}, item.events) : {};            
        if (defined(events.onclick) ? events.onclick += '; onclick_default_tab(this,event)' :  events.onclick = 'onclick_default_tab(this,event)'); 

        if (!defined(item.roleid)) item.roleid = 'role_' + item.id;
        if (!defined(item.cname))  item.cname  = item.id;  
        var scontent =
        '<li class="nav-item">' +
            '<a id="' + item.id + '" class="sb_row nav-link' + 
            (defined(item.class) ? ' ' + item.class : '') +                 
            '" data-bs-toggle="sb_tab" data-bs-target="#' + item.roleid + '"' + 
            ' type="button" title="' + (defined(item.title) ? item.title : item.cname) + '"'  + 
            (defined(item.attributes) ?  this.stringify(item.attributes) : '') +                        
            this.stringify(events)  +
            (defined(item.icon) ? '<i class="' + item.icon + '"></i>' : '') +
            (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +             
            '<span class="sb_label">' + item.item  + '</span>' +
            (defined(item.onclose) ? '<span class="sb_close-tabs" ' + item.onclose + '><i class="fas fa-times" aria-hidden="true" ></i></span>' : '') +
            '</a>' +
        '</li> ';
    
        if (position) {
            $('#' + tab.id + '> .sb_tabcontainer .sb_tab').prepend (scontent);
        } else {
            $('#' + tab.id + '> .sb_tabcontainer .sb_tab').append (scontent);
        }        

        if (tab.items.find(element => element.roleid == item.roleid) == undefined) {     
            var content = 
            '<div id="' + item.roleid + '" role="tabpanel" class="sb_pane active">';
            for (var j= 0; j < item.items.length; j++) {
                content += this.render (item.items[j]);
            } 
            content += '</div>';   
            $('#' + tab.id + '> .sb_content').append (content);
        }
        tab.items.push(item);

//DRAG  HTML ADDED            
        $( ".dragbar_v" ).draggable(dragbar_v_defaultoptions);   
        $( ".dragbar_h" ).draggable(dragbar_h_defaultoptions);                
    }

    tab_finditem = function (tab, cname) { 
        for (var i= 0; i < tab.items.length; i++) {
            if (tab.items[i].cname == cname) return tab.items[i];
        }
        return null;
    }

    tab_findattribute = function (tab, attrname, value) { 
        for (var i= 0; i < tab.items.length; i++) {
            if (tab.items[i].attribute) {
                if (eval('tab.items[i].attributes.' + attrname) == itemname) return tab.items[i];
            }
        }
        return null;
    }

    tab_renameitem = function (tab, cname, newitemname) { 
        var tabitem = this.tab_finditem(tab, cname);
        
        if (!tabitem)
            return;
        
        tabitem.item = newitemname;
        
        $('#' + tab.id + ' #' + CSS.escape(tabitem.id) + ' .sb_label').html (newitemname);
        $('#' + tab.id + ' #' + CSS.escape(tabitem.id)).attr('id', newitemname);

        tabitem.id = newitemname;
    }

    tab_select = function (tab, cname) {
        var tabitem = this.tab_finditem(tab, cname);
        
        if (!tabitem)
            return;
        $('#' + tab.id +  ' #' + CSS.escape(tabitem.id)).tab('show');
    }

    tab_clear = function (tab) {
        $('#' + tab.id + ' .sb_tab').html('');
        $('#' + tab.id + ' .sb_content').html ('');
        tab.items = [];
    }

    tab_swap = function (tab, fromitemname, toitemname) {
        var indexA, indexB;
        for (var i = 0; i < tab.items.length; i++) {
            if (tab.items[i].item == fromitemname) indexA = i;
            if (tab.items[i].item == toitemname) indexB = i;
        }
        var temp = tab.items[indexA];
        tab.items.splice(indexA, 1);
        tab.items.splice(indexB, 0, temp);
    }


    tab_delete = function (tab, tabid) {
        var indexA = -1;

        for (var i = 0; i < tab.items.length; i++) {
            if (tab.items[i].id == tabid) {
                indexA = i;
                break;
            }
        }

        if (indexA < 0) 
            return -1;

        let navlink =  $('#' + tab.id +  ' #' + CSS.escape(tab.items[indexA].id));                
        let active  = navlink.hasClass ('active')
        let roleid =  tab.items[indexA].roleid;

        
        navlink.parent().remove();   
        tab.items.splice(indexA, 1);

        if (tab.items.find(element => element.roleid == roleid) == undefined) { // remove content
            $('#' + tab.id + ' .sb_content #' + roleid).remove();
        }
        if (active) {
            if (indexA == 0 && tab.items.length != 0) {
                this.tab_select (tab, tab.items[0].cname);
                return 0;
            }
            else
            if ((indexA - 1) >= 0) {
                this.tab_select (tab, tab.items[indexA - 1].cname);
                return indexA - 1;
            }
        }
        return -1;
    }

    //---------------------------------------------------- SB TABLE  ------------------------------------------------  

    table = function (table) {

        let tableid      = table.id;
        let columns      = table.columns;
        let columnstitle = table.columnstitle;
        let sortable     = defined(table.sortable) ? table.sortable : false;
        var colcontent   = '<thead>';

        for (var i = 0; i < columns.length; i++) {
            if (i == 0) colcontent += '<tr>'; 
            colcontent += '<th' + (sortable ? ' class="sb_sortable" onclick= "onclick_sb_sortable(event); ' + sortable + '"' : '') + ' title= "' + columnstitle[i] + '">' + columns[i] + '</th>';
            if (i == columns.length - 1) colcontent += '</tr>';           
        }

        var colcontent = colcontent + '</thead>';
        var rowcontent = '<tbody>';

        rowcontent += this.table_returnrowscontent (table);

        var rowcontent = rowcontent + '</tbody>'
    
        var content =     
    '   <table  id= "' + tableid + '" class="sb_table table ' +
            (defined(table.class) ? table.class : '') + '"' + 
            (defined(table.style) ? ' style= "' + table.style + '"' : '')  +                 
            '>' +
            colcontent + rowcontent + 
    '	</table>'; 
    
        return content;    
    }

    table_addrow = function (table, row, id) {
        var tableid = table.id;
        var rowid = tableid + '_';    
        var rowindex = table.rows.length;
        var content = '';

        if(defined(id)) {
            rowindex = id;
        } 
        
        content += this.table_returnrowcontent (table, row, rowindex);
        $('#' + tableid + ' tbody').append (content);   
        table.rows.push (row) ;  

        return rowindex; 
    }

    table_removerow = function (table, rowindex, id) {
        var trid = (defined(id) ? '_' + id : '_' + rowindex);
        $( '#' + table.id +  trid).remove();
        table.rows.splice(rowindex, 1);
    }

    table_removechild = function (table, childindex) {
        var trchildren = $( '#' + table.id +  ' tbody').children();
        if (trchildren.length == 0) return;
        trchildren[childindex].remove();
    }

    table_getselection = function (table) {
        var trchildren = $( '#' + table.id +  ' tbody').children();
        var selected = [];

        for (var i= 0; i < trchildren.length; i++) {
            if ($(trchildren[i]).hasClass('active')) selected.push (i);
        }
        return selected;
    }

    table_selectnone = function (table) {
        var trchildren = $( '#' + table.id +  ' tbody').children();
    
        for (var i= 0; i < trchildren.length; i++) {
            if ($(trchildren[i]).hasClass('active')) 
                $(trchildren[i]).removeClass ('active');
        }
    }

    table_select = function (table, rowchild) {
        var trchildren = $( '#' + table.id +  ' tbody').children();
        if (rowchild >= trchildren.length)
            return;
        
        this.table_selectnone (table);
        for (var i= 0; i < trchildren.length; i++) {
            if (i == rowchild) $(trchildren[i]).addClass('active');
        }
    }  

    table_rowselect = function (table, rowindex) {
        var rowid = table.id + '_' + rowindex;    
        onclick_sb_tablerow ($('#' + table.id + '_' + rowindex))
    }  

    table_unshiftrow = function (table, row, style) {
        var tableid = table.id;
        var rowid = tableid + '_';   
        
        var rowindex = table.rows.length;
        var content = '';
        
        content += this.table_returnrowcontent (table, row, rowindex);
        
        $('#' + tableid + ' tbody').prepend (content);   
        
        table.rows.unshift (row) ;   
        this.table_setrowattr(table, rowindex, 'style', style);    
    }

    table_returnrowcontent = function (table, row, rowindex) {
        var tableid = table.id;
        var rowid = tableid + '_';
        var rowcontent = '';
        var cellid = rowid + rowindex + '_';   

        rowcontent += '<tr id= "' + rowid + rowindex + '" class="sb_tablerow"' + (defined (table.rowstitle) ? ' title ="' + table.rowstitle[rowindex]  + '"' : '')
                        + (table.events ? this.stringify(table.events) : '') + (defined (table.rowsstyle) ? ' style= "' + table.rowsstyle[rowindex]  + '"' : '')
                    + '>';     

        for (var j = 0; j < row.length; j++) {
            rowcontent += '<td id= "' + cellid + j + '"  class="sb_tablecell">' +  (row[j] == undefined ? '' : row[j]) + '</td>';
        }

        if (row.length < table.columns.length) {
            for (var j = row.length; j < table.columns.length; j++) {
                rowcontent += '<td id= "' + cellid + j + '"></td>';
            }
        } 
        rowcontent += '</tr>';

        return rowcontent;
    }

    table_returnrowscontent = function (table) {
        var tableid = table.id;    
        var rowid = tableid + '_';
        var content = '';

        for (var rowindex = 0; rowindex < table.rows.length; rowindex++) {
            content += this.table_returnrowcontent (table, table.rows[rowindex], rowindex);
        }    

        return content;
    }

    table_returncolumnscontent = function (table) {
        var content = '';
        
        content += '<tr>'; 
        for (var i = 0; i < table.columns.length; i++) {
            content += '<th title= "' + table.columnstitle[i] + '">' + table.columns[i] + '</th>';
        }
        content += '</tr>';          
        return content;
    }

    table_clear = function (table) {
        table.rows= [];
        $('#' + table.id + ' tbody').html('');
    }

    table_reset = function (table, fromindex) {
        table.columns.length = fromindex;
        table.columnstitle.length = fromindex;
        table.rows = [];

        $('#' + table.id + ' tbody').html(this.table_returnrowscontent (table)); 
        $('#' + table.id + ' thead').html(this.table_returncolumnscontent (table));      
    }

    table_find = function (table, colname, value) {
        var rows = [];
        var colindex = this.table_getcolindex(table, colname);
        if (colindex < 0) return rows;

        for (var i= 0; i < table.rows.length; i++) {
            if (table.rows[i][colindex] == value) rows.push (i);
        }
        return rows;
    }

    table_findfirst = function (table, colname, value) {

        var colindex = this.table_getcolindex(table, colname);
        if (colindex < 0) return -1;

        for (var i= 0; i < table.rows.length; i++) {
            if (table.rows[i][colindex] == value) return i;
        }
        return -1;
    }

    table_findfirst2 = function (table, colname, value, colname1, value1) {
        var colindex = this.table_getcolindex(table, colname);
        if (colindex < 0) return -1;
        
        var colindex1 = this.table_getcolindex(table, colname1);
        if (colindex1 < 0) return -1;

        for (var i= 0; i < table.rows.length; i++) {
            if (table.rows[i][colindex] == value && table.rows[i][colindex1] == value1) return i;
        }
        return -1;
    }

    table_getcolindex = function (table, colname) {
        return table.columns.indexOf(colname);
    }

    table_addcolumn = function (table, name, title, style) {
        var content = '';
        
        $('#' + table.id + ' thead tr').append ('<th title= "' + title + '" style="' + style + '">' + name + '</th>');
        
    
        /* add empty tr at td end for all rows*/
        var j = table.columns.length;
        
        var rowid = table.id + '_';

        for (var i = 0; i < table.rows.length; i++) {
            var cellid = rowid + i + '_';
            $('#' + rowid + i).append ('<td id= "' + cellid + j + '"></td>'); 
        }

        table.columns.push (name) ; 
        table.columnstitle.push (title) ; 
    }

    table_setheadercolstyle = function (table, colname, style) {
        var colindex = this.table_getcolindex(table, colname);
        if (colindex < 0) return;
        $('#' + table.id +' thead tr th:nth-child(' + (colindex + 1) + ')').attr ('style', style);
    }

    table_setcolstyle = function (table, colname, style){
        var colindex = this.table_getcolindex(table, colname);
        if (colindex < 0) return;

        for (var i= 0; i < table.rows.length; i++) {
            $('#' + table.id +'_' + i + '_' + colindex ).attr ('style', style);
        }    
    }

    table_setrows = function (table, rows) {
        var tableid = table.id;
        table.rows= rows;    

        $('#' + tableid + ' tbody').html(this.table_returnrowscontent (table));
    }

    table_setrowattr = function (table, rowindex, attr, attrvalue){
        $('#' + table.id +'_' + rowindex ).attr ( attr, attrvalue);
    }

    table_addrowclass = function (table, rowindex, classname){
        $('#' + table.id +'_' + rowindex ).addClass (classname);
    }

    table_getcellcontent = function (table, rowindex, colname) {
        return  $('#' + table.id +'_' + rowindex + '_' + table.columns.indexOf(colname)).html();
    }

    //-------------------------------------------

    table_setcellchildstyle = function (table, childindex, colname, style){
        var trchildren = $( '#' + table.id +  ' tbody').children();      
        if (trchildren.length == 0) return;

        $(trchildren[childindex].children[table.columns.indexOf(colname)]).css ('style', style);
    }

    table_setcellstyle = function (table, rowindex, colname, style){
        $('#' + table.id +'_' + rowindex + '_' + table.columns.indexOf(colname)).css ('style', style);
    }

    //-------------------------------------------

    table_getrowfromcolumn = function (table, colname, value) {
        var trchildren = $( '#' + table.id +  ' tbody').children();      
        if (trchildren.length == 0) return;
        
        for (var i = 0; i < trchildren.length; i++) {
            if ($(trchildren[i].children[table.columns.indexOf(colname)]).html() == value) {
                return i;
            }
        }
        return -1;
    }

    table_setcellchildcontent = function (table, childindex, colname, content){
        var trchildren = $( '#' + table.id +  ' tbody').children();      
        if (trchildren.length == 0) return;

        $(trchildren[childindex].children[table.columns.indexOf(colname)]).html(content);
    }

    table_setcellcontent = function (table, rowindex, colname, content){
        $('#' + table.id +'_' + rowindex + '_' + table.columns.indexOf(colname)).html(content);
    }

    //-------------------------------------------

    table_setcellchildcolor = function (table, childindex, colname, color){
        var trchildren = $( '#' + table.id +  ' tbody').children();      
        if (trchildren.length == 0) return;

        $(trchildren[childindex].children[table.columns.indexOf(colname)]).css ('color', color);
    }
    
    table_setcellcolor = function (table, rowindex, colname, color){
        $('#' + table.id +'_' + rowindex + '_' + table.columns.indexOf(colname)).css ('color', color);
    }
    
    //-------------------------------------------

    table_setcellchildbackground = function (table, childindex, colname, color){
        var trchildren = $( '#' + table.id +  ' tbody').children();      
        if (trchildren.length == 0) return;

        $(trchildren[childindex].children[table.columns.indexOf(colname)]).css ('background', color);
    }

    table_setcellbackground = function (table, rowindex, colname, color){
        $('#' + table.id +'_' + rowindex + '_' + table.columns.indexOf(colname)).css ('background', color);
    }

    //-------------------------------------------

    table_setcontentatcolindex = function (table, rowindex, colindex, content) {
        var cellid = table.id + '_' + rowindex + '_' + colindex;    
        $('#' + cellid).html(content);
    }

    //---------------------------------------------------- SB BOX  ------------------------------------------------  

    box_header = function (header) {
    
        var displayheader   = defined(header.display) ? (header.display == true ? 'flex' :'none') : 'flex';  
        var events          = defined(header.events) ?  header.events : {};    
        var title           = defined(header.item) ? header.item : '';
        var controlcontent  = defined(header.control) ? this.controls (header.control) : '';
        var orientation     = defined(header.control) && defined(header.control.orientation) ?  header.control.orientation : this.R_CONTROL;    

        events.ondblclick   = "ondblclick_sb_boxheader(this);" + (defined(events.ondblclick) ? events.ondblclick : '');
        events              = this.stringify(events);   

        var content = 
        '   <div class="sb_boxheader' + (defined(header.class) ? ' ' + header.class : '') + '" ' + events + 'style="display:' + displayheader + '">' +
                (orientation == this.L_CONTROL ? controlcontent : '') +
                (defined(header.icon) ? '<i class="' + header.icon + '"></i>' : '') +                        
                (defined(header.item) ? '<div class="sb_boxheadertitle">' + header.item + '</div>' : ''); 

                if (defined (header.items)) {
                    for (var j= 0; j < header.items.length; j++) {
                        content += this.render (header.items[j]);
                    }         
                } 
                content += (orientation == this.R_CONTROL ? controlcontent : '') +            
        '   </div>';     
    
        return content;
    }

    box1 = function (box) {
        
        var boxid       = defined(box.id) ? ' id="' + box.id + '"' : '';
        var boxclosed   = defined(box.closed) ? box.closed : false;
        var title       = defined(box.item) ? box.item : '';

        var content =  
        '   <div id="' +  box.id + '" class="sb_box' +  
                (defined(box.class) ? ' ' + box.class : '') + '">' +             
                (defined(box.header) ? this.box_header (box.header) : '') + 
        '	    <div class="sb_boxbody no-padding' + (defined(box.class) ? ' ' + box.class : '') + '" style="display:' + (boxclosed ? 'none' : 'block') + '">';
                    if (defined (box.items)) {
                        for (var j= 0; j < box.items.length; j++) {
                            content += this.render (box.items[j]);
                        }                                 
                    }    
        content +=
        '	    </div>' + 
        '   </div>';
        return content;     
    }

    box = function (id, title , headercontent, content, control, orientation, closed, notdisplayheader) {
        var displayheader = 'flex';    
        if (notdisplayheader)
            displayheader = 'none';

        var dblclickfunction = 'ondblclick="ondblclick_sb_boxheader(this)"';    

        if (orientation == this.L_CONTROL) {
            headercontent = control +  '<div class="sb_boxheadertitle">' + title +  '</div>' + headercontent +  '</div>';
        }
        else {
            headercontent = '<div class="sb_boxheadertitle">' + title +  '</div>' + headercontent + control +  '</div>';
        }
            
        var content =  
        '   <div id="' + id + '" class="sb_box">' +
        '	    <div class="sb_boxheader" ' +  dblclickfunction + ' style="display:' + displayheader + '">' +
                    headercontent +
        '	    <div class="sb_boxbody no-padding" style="display:' + (closed ? 'none': 'block') + '">' +
                    content +
        '	    </div>' + 
        '   </div>';
        return content;     
    }

    box_toggle = function (id, open) {
        var elts = $('#' + id + ' .box-btn-slide');
        if (elts.length == 0) return
        var elt = elts.eq(0)


        if (elt.hasClass ('rotate-180')) {
            if (!open) return;        
            elt.trigger('click');        
        } else {
            if (open) return;        
            elt.trigger('click');
        }
    }

    box_closed = function (id) {           // 1 closed , 0 opened
        var display = $('#' + id + ' .sb_boxbody').css ('display');
        return (display == 'none');
    }

    //---------------------------------------------------- SB MODAL  ------------------------------------------------  

    modal = function (modal, classnames) { 
        var content = ''; 
        content += 
    '   <div id="' + modal.id + '" class="sb_modal modal"' + (modal.static ? ' data-bs-backdrop="static"' : '') + ' fade tabindex="-1" role="dialog" aria-hidden="true">' + 
    '       <div class="modal-dialog' + (classnames ? classnames : '')  + '" style= "' + (modal.width ? 'max-width:' + modal.width + 'px;' : '')  + '">' +
    '           <div class="modal-content remixModalContent">' +
    '               <div class="modal-header">' +
                        modal.header +
    '                   <span class="modal-close" data-bs-dismiss="modal">' +
    '                       <i title="Close" class="fas fa-times" aria-hidden="true"></i>' +
    '                   <span class="sr-only">Close</span>' +
    '                  </span>' +                    
    '               </div>' +
    '               <div class="modal-body" style= "' + (modal.width ? 'width:' + modal.width + 'px;' : '') + (modal.height ? 'height:' + modal.height + 'px;' : '') + '">' +
                        modal.body +
    '               </div>' +
    '               <div class="modal-footer">' +
                        modal.footer +
    '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>';
        $('body').append (content);
        
//DRAG  HTML ADDED                       
        $( ".dragbar_v" ).draggable(dragbar_v_defaultoptions);   
        $( ".dragbar_h" ).draggable(dragbar_h_defaultoptions);    

        var modaldlg = new bootstrap.Modal('#' + modal.id);

        $('#' + modal.id).on('shown.bs.modal', function (event) {
            if (defined(modal.onopen)) { 
                modal.onopen();
            }         
        })

        $('#' + modal.id).on('show.bs.modal', function (event) {
            $(this).find('.modal-content')
            .css({
            })
            .resizable({
            minWidth: 300,
            minHeight: 300,
            handles: 'n, e, s, w, ne, sw, se, nw',
            })
            .draggable({
            handle: '.modal-header'
            });

        })

        $('#' + modal.id).on('hidden.bs.modal', function (event) {
            $(event.currentTarget).remove();
        })

        $('#' + modal.id).on('hide.bs.modal', function (event) {
        
        })    

    
        modaldlg.show();

        return content;
    }
    
    confirm_modal = function (content, header, func) {

        this.modal ({
            id: 'confirmmodal', 
            header: header ? header : 'Confirmation', 
            resizable: true,
            onopen: func,   
            body:  '<div class="sb_confirmation">' + content + '</div>', 
            footer: '<button data-bs-dismiss="modal"  class="sb_mbutton" onclick="' + 'no_callback()'  + '">Cancel</button>' +
                    '<button  class="modal-ok sb_mbutton"  onclick="' + 'yes_callback()'  + '">OK</button>' 
            });
            return {
            yes: function (fun) {
                options.yes_callback = fun;
                return this;
            },
            no: function (fun) {
                options.no_callback = fun;
                return this;
            }
        }     
    }

    //--------------------------------------------------  SB OVERLAY -----------------------------------------------

    overlay = function (options) {
        options.event.preventDefault();
        options.event.stopPropagation();

        if (!defined (options.rootelt)) {
            return;
        } 

        if (options.rootelt.length != 1) return;
    
        var overlays = $('.sb_overlay');
        $.each(overlays, function (index, overlay) {
            var overlay_options = $(overlay).data('options');  
            if (overlay_options && !overlay_options.keepopen)
                $(overlay).remove();      
        });


        var div1 = options.rootelt.append(
            '<div id="' + (defined(options.id) ? options.id : '') +  '" class="sb_overlay ' + (options.classes ? options.classes : '')  + '" style="display: none; position:absolute; left: 0px; top: 0px; '+ options.style +'"'+
            '        class="sb_overlay">'+
            '</div>'
        ).children("div:last-child");

        
        div1.html(options.html);
//DRAG  HTML ADDED                       
        $( ".dragbar_v" ).draggable(dragbar_v_defaultoptions);   
        $( ".dragbar_h" ).draggable(dragbar_h_defaultoptions); 


        var div2 = div1.find(' > div');

        var offset = {};
        
        div1.data('options', options)
            .data('position', offset.left + 'x' + offset.top)
            .fadeIn('fast')
            .on('mouseup', function (event) {
                    if (options.clickinside) {
                        event.stopPropagation();  
                        event.preventDefault();    
                    }                

                    if (defined(options.onselect)) {
                        var dropitem = $(event.target).closest ('.dropdown-item');
                        if (dropitem.length != 0)
                            options.onselect (dropitem[0], options.par); 
                    }
                }
            )
            .on('contextmenu', function (event) {
                if (options.clickinside) {
                    event.stopPropagation();      
                }                
                }
            )        
            .on('mousedown', function (event) {
                }
            )
            .on('mouseover', function (event) {
                }
            );
    

        div1.css ('top', options.pageY);
        div1.css ('left', options.pageX);

        var height =  options.pageY + div2.innerHeight();
        var width  =  options.pageX + div2.innerWidth();

        var wheight = window.innerHeight;
        var wwidth = window.innerWidth;

        if (height > wheight) {
            div1.css ('top', options.pageY - div2.innerHeight());
        }
        if (width > wwidth) {
            div1.css ('left', options.pageX - div2.innerWidth());
        }


        if (defined(options.onshow)) options.onshow();

        return $(this);
    }

    //--------------------------------------------------  SB MENU -----------------------------------------------

    menu = function (menu, classnames) {
        var scontent = '<div class="dropdown-menu show" class="' + (classnames ? classnames : '')  + '">';

        for (var i = 0; i < menu.length; i++) {
            var item = menu[i];
            if (item.text == '') 
                scontent += '<div class="dropdown-divider"></div>';
            else
                scontent += 
                '<a id="' + item.id + '" class="dropdown-item ' +
                (defined(item.disabled) ?   'disabled" ': '" ') +
                (defined(item.events) ?  this.stringify(item.events) : '') +
                (defined(item.tooltip) ? ' title="' + item.tooltip + '"' : '') + '>' + 
                    (defined(item.icon) ? '<i class="' + item.icon + '"></i>' : '') +
                    (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                    '<span class="sb_label">' + item.text  + '</span>' +            
                '</a>';
        }
        scontent += '</div>';
        return scontent;
    }    

    //---------------------------------------------------- SB CONTROLS  ------------------------------------------------  

    controls = function (options) {
        
        let closed          = (defined(options.closed) ? options.closed : false);
        let display_close   = (defined(options.close) ? options.close : false);
        let display_slide   = (defined(options.slide) ? options.slide : false);

        let display_maximize = (defined(options.maximize) ? options.maximize : false);    
        
        let close_func      = (defined(options.onclick_close) ? options.onclick_close : '');  
        let slide_func      = (defined(options.onclick_slide) ? options.onclick_slide + ';' : '') + 'onclick_default_slide(this, event)';  
        let maximize_func   = (defined(options.onclick_maximize) ? options.onclick_maximize : '');  
        
        let orientation     = (defined(options.orientation) ?  options.orientation : this.R_CONTROL);
        
        let classes         = (orientation == this.L_CONTROL ? 'sb_controls' : 'sb_controls sb_marginleft');

        let content = 
        '   <div class="' + classes + '">' +
                this.render({id: 'close',      type:'control',  class : 'box-btn-close',      style: (!display_close ? 'display:none' : ''),    events: {onclick: close_func},  title: ''}) + 
                this.render({id: 'fullscreen', type:'control',  class : 'box-btn-fullscreen', style: (!display_maximize ? 'display:none' : ''), events: {onclick: maximize_func},  title: ''})  +
                this.render({id: 'slide',      type:'control',  class : 'box-btn-slide' + (closed ? ' rotate-180' : ''),      style: (!display_slide ? 'display:none' : ''),    events: {onclick: slide_func},  title: ''}) + 
        '   </div>';
        return content;
    } 


    toggle = function (elt, open, callback) {
        var $panel = elt;

        if (open == undefined) {
            $panel.slideToggle("slow", "swing", callback);   
            return;
        }
        
        if (open && $panel.is(':hidden')) { 
            $panel.slideToggle("slow", "swing", callback);
        }      
        if (!open && !$panel.is(':hidden')) {
            $panel.slideToggle("slow", "swing", callback);
        }    
    }

    //---------------------------------------------------- SB ITEM  ------------------------------------------------  

    item = function (item, togglefunction) {
        let content     = '';
        let itemclass   = '';
        
        let events      = defined(item.events)     ?  Object.assign({}, item.events) : {};
        let attributes  = defined(item.attributes) ?  Object.assign({}, item.attributes) : {};

        defined(item.toggle) && item.toggle == true ?   (defined(events.onclick) ?  events.onclick += ';onclick_default_item(this, event)' : events.onclick='onclick_default_item(this, event)') : '';
        item.type == 'radio' ? (defined(events.onclick) ?  events.onclick += '; onclick_default_radio_item(this,event)' :  events.onclick = 'onclick_default_radio_item(this,event)') : ''; 
        togglefunction = defined(togglefunction) ?  (defined(events.onclick) ? events.onclick += ';' + togglefunction :  events.onclick = togglefunction) : '';

        events.onchange   = "onchange_default_sb_item(this);" + (defined(events.onchange) ? events.onchange : '');
        events.oninput    = events.onchange + (defined(events.oninput) ? ';' + events.oninput : '');

        events     = this.stringify(events);
        attributes = this.stringify(attributes);

        if (defined(item.class)) itemclass = item.class ;

        if (defined(item.type)) {

            switch (item.type) {

                case 'control' :
                    content += 
                    '<a id="' + item.id + '" class="sb_link ' + itemclass + '"' +
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        attributes +
                        events +
                        (defined(item.par) ?       ' par= "' + item.par + '"' : '') + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>' +              
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                    '</a>';        
                break;           

                case 'dropdown-toggle' :
                    if (!defined(item.roleid)) item.roleid = 'role_' + item.id;                         
                
                    content += 
                    '<span id="' + item.id + '" class="dropdown-toggle sb_link ' + itemclass + '"' + 
                        ' data-bs-toggle="collapse" aria-expanded="true" href="#' + item.roleid + '"' +
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        attributes +
                        events +
                        (defined(item.par) ?       ' par= "' + item.par + '"' : '') + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>' +              
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                    '</span>';        
                break;                                                   
                
                case 'link' :
                    content +=  
                    '<span id="' + item.id + '" class="sb_link ' + itemclass + '"' + 
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        attributes +                
                        events +
                        (defined(item.par) ?       ' par= "' + item.par + '"' : '') + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>' +
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +

                    '</span>'; 
                    break;

                case 'button' :   
                    content += 
                    '<button id="' + item.id + '" class="sb_sbutton sb_link ' + itemclass + '"' + 
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        attributes +                
                        events +
                        (defined(item.par) ?       ' par= "' + item.par + '"' : '') + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') +
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') +                 
                        '>' +
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') + 
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                    '</button>';    
                break;     

                case 'switch' :      //input   type='check'
                    content += 
                    '<span class="form-switch ' + itemclass + '"' + 
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        '<input id="' + item.id + '"  type="checkbox"  class="form-check-input"' + 
                        attributes +                
                        events +
                        (defined(item.par) ?  ' par= "' + item.par + '"' : '') +
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') +                 
                        '>' +  
                        '<label class="sb_label form-check-label" for="' + item.id + '">' + (defined(item.item) ? item.item : '') +'</label>' +
                    '</span>';                
                break;

                case 'checkbox' :      //input   type='check'
                    content += 
                    '<span class="sb_check custom-control custom-checkbox' + itemclass + '"' + 
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        '<input id="' + item.id + '"  type="checkbox"  class="custom-control-input"' + 
                        attributes +                
                        events +
                        (defined(item.par) ?  ' par= "' + item.par + '"' : '') +
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') +                 
                        '>' +  
                        '<label class="sb_label custom-control-label" for="' + item.id + '">' + (defined(item.item) ? item.item : '') +'</label>' +
                    '</span>';                
                break;

                case 'radio' :     //input   type='check'
                    content += 
                    '<span class="sb_check  custom-control custom-radio ' + itemclass + '"' + 
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        '<input id="' + item.id + '"  type="radio"  class="custom-control-input"' + 
                        attributes +                
                        events +
                        (defined(item.par) ?  ' par= "' + item.par + '"' : '') +
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') +                 
                        '>' +  
                        '<label class="sb_label custom-control-label" for="' + item.id + '">' + (defined(item.item) ? item.item : '') +'</label>' +
                    '</span>';           
                break;

                case 'ihtml' :  
                    content += 
                    '<span  id="' + item.id + '" class="sb_link ' + itemclass + '"' + 
                        attributes +
                        events +                    
                        (defined(item.style) ?     ' style= "' + item.style + '"' : '')  + 
                        (defined(item.title) ?     ' title="'  + item.title + '"' : '')  + '>' +
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item + '</label>' : '') +                
                        (defined(item.content) ?   eval(item.content) : '') +
                    '</span>'; 
                break;

                case 'select' :    //select
                    let menu  = defined(item.menu) ? item.menu : [];
                    let value = defined(item.value) ? item.value : '';
                    

                    content += 
                    '<span class="sb_link ' + itemclass + '"' + 

                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  +
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                        '<select  id="' + item.id +  '" class="custom-select form-control" ' + 
                            attributes +                
                            events +       
                            (defined(item.style) ?     ' style= "' + item.style + '"' : '')  +                             
                            (defined(item.disabled) && item.disabled == true ? ' disabled' : '') +                                    
                        '>';
                        let objecttype = js_objecttype(menu);
                        if (objecttype == 'Array') {
                            if (!value) {
                                value = menu.length != 0 ? menu[0].text  : '';    
                            }
        
                            for (var i = 0; i < menu.length; i++) {
                                var tooltip = '';
                                tooltip = menu[i].tooltip ? menu[i].tooltip : '';
                                content += '<option value="' + menu[i].text + '"' + (value == menu[i].text ? ' selected="selected"' : '' ) +   (defined(item.tooltip) ? ' title = "' + item.tooltip + '"' : '') +  '>' + menu[i].text +   '</option>';       
                            }
                        } else {
                            let keys         = Object.keys(menu);
                            for (var i = 0; i < keys.length; i++) {
                                let key = keys[i];
                                content += '<option value="' + key + '"' + (value == key ? ' selected="selected"' : '' )  +  ' title ="' + key + '">' + menu[key] +   '</option>';       
                            }
                        
                        }
                        content += '</select>';
                        content += '</span>';                          
                break;

                case 'time':      //  
                    content +=                
                    '<span class="sb_link ' + itemclass + '"' + 

                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                        '<input id="' + item.id + '"   type="time" class="sb_range"' +
                        attributes +                
                        events +                
                        (defined(item.style) ?    ' style= "' + item.style + '"' : '')  +                         
                        (defined(item.value) ?    ' value="' +  item.value   + '"' : '') +  
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') + 
                        '>' +
                    '</span>';                        
                break;
                
                case 'range' :      //input   type='check'
                    content += 
                    '<span class="sb_link ' + itemclass + '"' + 

                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                        '<input id="' + item.id + '"   type="range" class="sb_range"' +
                        attributes +                
                        events +                
                        (defined(item.style) ?    ' style= "' + item.style + '"' : '')  +                         
                        (defined(item.value) ?    ' value="' +  item.value   + '"' : '') +  
                        (defined(item.min) ?      ' min="'   +  item.min     + '"' : '') +  
                        (defined(item.max) ?      ' max="'   +  item.max     + '"' : '') +  
                        (defined(item.step) ?     ' step="'  +  item.step    + '"' : '') + 
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') + 
                        '>' +   
                    '</span>';                                
                break;                
                case 'int': 
                case 'float':        
                case 'text':                        
                    content +=                
                    '<span class="sb_link ' + itemclass + '"' + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                        '<input id="' + item.id + '"   type="' + (item.step  || item.type == 'int' || item.type == 'float' ? 'number' : 'text') + '" class="form-control"' +
                        attributes +                
                        events +                
                        (defined(item.style) ?    ' style= "' + item.style + '"' : '')  +                         
                        (defined(item.value) ?    ' value="' +  item.value   + '"' : '') +  
                        (defined(item.min) ?      ' min="'   +  item.min     + '"' : '') +  
                        (defined(item.max) ?      ' max="'   +  item.max     + '"' : '') +  
                        (defined(item.step) ?     ' step="'  +  item.step    + '"' : '') + 
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') + '>' +
                    '</span>';      
                break;
                case 'textarea' :
                    content +=                            
                    '<span class="sb_link ' + itemclass + '"' + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                        '<textarea id="' + item.id + '" class="form-control form-control-sm "' +
                        attributes +                
                        events +                
                        (defined(item.style) ?    ' style= "' + item.style + '"' : '')  +                         
                        (defined(item.cols) ?     ' cols="' +  item.cols   + '"' : '') +  
                        (defined(item.cols) ?     ' rows="' +  item.rows   + '"' : '') +  
                        (defined(item.maxlength) ? ' maxlength="'   +  item.maxlength     + '"' : '') +  
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') + '>' + 
                        (defined(item.value) ?  item.value   : '') +                         
                        '</textarea>' +
                    '</span>';      

                break;                
                case 'search':                        
                    content +=                
                    '<span class="sb_link sb_search ' + itemclass + '"' + 
                        (defined(item.title) ?     ' title= "' + item.title + '"' : '') + '>'  + 
                        (defined(item.icon) ?      ' <i class="' + item.icon + '"></i>' : '') + 
                        (defined(item.iconfile) ?  ' <img class="sb_iconfile" src="' + item.iconfile + '" ></img>' : '') +                     
                        (defined(item.item) ?      ' <label class="sb_label">' + item.item +'</label>' : '') +
                        '<input id="' + item.id + '"   type="text" class="form-control"' +
                        attributes +                
                        events +       
                        (defined(item.style) ?    ' style= "' + item.style + '"' : '')  +                                   
                        (defined(item.value) ?    ' value="' +  item.value   + '"' : '') +  
                        (defined(item.disabled) && item.disabled == true ? ' disabled' : '') + 
                        '>' +
                        (defined (item.submit) ? '<a type="submit" class="sb_link box-btn-search" onclick="'+ item.submit + '"></a>' : '') +                        
                    '</span>';      
            }
        } else {
            content +=  '<a id="' + item.id + '" class="sb_link ' + itemclass + ' ' + item.icon + '"' + 
            (defined(item.style) ? 'style= "' + item.style + '"' : '')  + 
            ' title="' + item.title + '"' + attributes +  events  + '>' + item.item + '</a>'; 
        }
        return content;
    }

    checkbox = function (id, checked, classnames) {
        var content = '';
        var itemclass=  classnames ? (' ' + classnames) : '';    
        content +=
        '<div class="sb_check custom-control custom-checkbox' + itemclass + '">' + 
        '   <input id="' + id  + '" class="custom-control-input" type="checkbox"' + (checked ? 'checked' : '') + '/>' + 
        '   <label for="' + id + '" class="custom-control-label"></label>' +                        
        '</div>';
        return content;
    }

    radio = function (id, checked, classnames) {
        var content = '';
        var itemclass=  classnames ? (' ' + classnames) : '';    
        content +=
        '<div class="sb_check custom-control custom-radio' + itemclass + '">' + 
        '   <input id="' + id  + '" class="custom-control-input" type="radio"' + (checked ? 'checked' : '') + '/>' + 
        '   <label for="' + id + '" class="custom-control-label"></label>' +                        
        '</div>';
        return content;
    }


    select = function (id, classnames, menu, initvalue) {
        var itemclass=  classnames ? (' ' + classnames) : '';
        if (!initvalue) initvalue = menu[0].text;    

        var content = 
        '    <select  id="' + id +  '" class="form-control' + itemclass + '">';

        for (var i = 0; i < menu.length; i++) {

            defined(menu[i].class) ? itemclass = menu[i].class : itemclass = '';
            
            var tooltip = '';
            tooltip = menu[i].tooltip ? menu[i].tooltip : '';
            content += '<option value="' + menu[i].text + '" class="' + itemclass + '"' +  (initvalue == menu[i].text ? ' selected' : '' ) +  ' title= "' + tooltip +  '">' + menu[i].text +   '</option>';       
        }
        content += '</select>';
        return content;
    }

    select_setmenu = function (selectid, menu, initvalue) {
        var content = '';            
        for (var i = 0; i < menu.length; i++) {
            var tooltip = '';
            tooltip = menu[i].tooltip ? menu[i].tooltip : '';
            content += '<option value="' + menu[i].text + '"' +  (initvalue == menu[i].text ? ' selected' : '' ) +  ' title= "' + tooltip +  '">' + menu[i].text +   '</option>';       
        }
        $('#' + selectid).html (content)
        return content;
    }

    select_additem = function (selectid, item) {
        if ($('#' + selectid + ' option[value="' + item + '"]').length != 0) {
            return;
        }
        var elt = document.getElementById(selectid);      
        
        
        elt.insertAdjacentHTML('beforeend','<option value="' + item + '">' + item + '</option>'); 
    }

    select_removeitem = function (selectid, item) {
        $('#' + selectid + ' option[value="' + item + "]").remove();
    }

    select_renameitem = function (selectid, oldname, newname) {
        $('#' + selectid + ' option[value="' + oldname + '"]').val(newname);
        $('#' + selectid + ' option[value="' + newname + '"]').text(newname);    
    }

    item_select = function (elt, value) {
        $(elt + ' option[value="' + value + '"]').prop('selected', true);
    }

    item_set = function (elt, check) {
        if (check && !$(elt).hasClass("checked"))
            $(elt).addClass("checked");
        else 
        if (!check && $(elt).hasClass("checked"))
            $(elt).removeClass("checked");
    }

    //---------------------------------------------------- SB TREE  ------------------------------------------------  


    tree = function (tree) {
        var events      = defined(tree.events)     ?  Object.assign({}, tree.events) : {};    
        var attributes  = defined(tree.attributes) ?  Object.assign({}, tree.attributes) : {};   
        var closed      = defined(tree.closed) ? tree.closed : false;     
        var witharrow   = defined (tree.arrow) ? tree.arrow  : false;
        var icon        = closed == false ? 'tree-arrow-right rotate-90' : 'tree-arrow-right';
        
    
        events.onclick = (defined(events.onclick) ? events.onclick + ';onclick_default_tree(this, event)' : 'onclick_default_tree(this, event)');
        attributes = this.stringify(attributes); 
        events     = this.stringify(events);   

        
        var content =  
    '   <ul class="sb_tree' +
//            (defined(tree.style) ? ' style= "' + tree.style + '"' : '')            
        (defined(tree.class) ? ' ' + tree.class : '') + '"'  + '>';  
                                
        content += 
    '        <li>' +
    '           <span  class="sb_link" ' +
                (defined(tree.id) ?     'id ="' +  tree.id + '" ' : '') +
                (defined(tree.style) ?  'style= "' + tree.style + '" ' : '')  +  
                attributes + 
                events + '>' +  
                    (witharrow == true ?  '<i class="' + icon + '"></i>' :  (defined(tree.icon) ? '<i class="' + tree.icon + '"></i>' : '')) +           
                //  (defined(tree.icon) ? '<i class="' + tree.icon + '"></i>' : '') +
                    (defined(tree.item) ? ' <label class="sb_label">' + tree.item +'</label>' : '') +
                    (defined(tree.rootitem) ? this.render (tree.rootitem)  : '') +                
    '           </span>';     
        content += '<ul id="' + tree.id + '_ref" class="treeref' + (closed == true ? ' closed"' : '"') + ' style="' + (closed == true ? 'display:none' : '') + '">';           
        
        if (defined(tree.items) && tree.items.length!= 0) {        
            for (var i = 0; i < tree.items.length; i++) {
                content += '<li>' + this.render (tree.items[i]) + '</li>';   
            }
    
        }
        content += '</ul>';     

        content +=              
    '       </li>' + 
    '  </ul>';

        return content;
    }
    
    tree_expand = function (treeid) {
        let elt = $('#' + treeid).closest('.sb_tree');

        $(elt).find('.tree-arrow-right').addClass('rotate-90');
        $(elt).find('.treeref').removeClass ('closed').css ('display', 'block')    
    }

    tree_compress = function (treeid) {
        let elt = $('#' + treeid).closest('.sb_tree');

        $(elt).find('.tree-arrow-right').removeClass('rotate-90');
        $(elt).find('.treeref').addClass ('closed').css ('display', 'none')    
    }
    tree_open = function (eltid) {
        $('#' + eltid).find('.tree-arrow-right').addClass('rotate-90');
        $('#' + eltid + '_ref').removeClass('closed');
        $('#' + eltid + '_ref').css ('display', 'block')        
    }

    tree_close = function (eltid) {
        $('#' + eltid).find('.tree-arrow-right').removeClass('rotate-90');
        $('#' + eltid + '_ref').addClass('closed');
        $('#' + eltid + '_ref').css ('display', 'none')   
    }

    tree_getitem = function (fatherid, text) {
        fatherid += '_ref';

        const links = $("#" + fatherid +" span");
        for (var i = 0; i < links.length; i++) {     
            let link = links[i];                       
            if ($(link).find('.sb_label').html() == text) {
                return $(link)
            }
        }         
        return null;
    }
    
    tree_selectitem = function (fatherid, text, off) {
        fatherid += '_ref';
        
        let selected_elts = [];

        const links = $("#" + fatherid +" span");
        for (var i = 0; i < links.length; i++) {
            let link = links[i];
            if ($(link).find('.sb_label').html() == text) {
                if (off) {
                    $(link).removeClass('active'); 
                }
                else {
                    $(link).addClass('active');
                    let treeref = $(link).closest ('.treeref')
                    while (treeref.length != 0) {
                        treeref.removeClass ('closed').css ('display', 'block')                                
                        let elt = treeref.closest('.sb_tree')
                        elt.find('.sb_link:first .tree-arrow-right').addClass('rotate-90');
                        treeref = elt.closest ('.treeref');                                  
                    }  
                }        
                selected_elts.push($(link));                   
            }
            else {
                $(link).removeClass('active');
            }
        };         
    }        

    tree_removeitem = function (fatherid, name) {
        let elt = this.tree_getitem(fatherid, name);
        $(elt).remove();    
    }

    tree_renameitem = function (fatherid, oldname, newname) {
        let elt = this.tree_getitem(fatherid, oldname);  
        let eltid = $(elt).attr('id');

        $('#' + eltid + ' label').html(newname);    
        $('#' + eltid).attr('id', eltid.replace(oldname,newname));        
    }

    tree_additem = function (treeid, item) {
        document.getElementById(treeid + '_ref').insertAdjacentHTML('beforeend', '<li>' + this.render (item) + '</li>');    
    }

    tree_add_item = function (tree, item) {
        tree.items.push(item)        
        this.tree_additem(tree.id, item)        

    }

    tree_additems = function (id, elements) {

        var elt = document.getElementById(id);

        for (var i = 0; i < elements.length; i++) {
            var item = elements[i].item;
            if (this.tree_existitem(id,  item)) continue;       
            
            if ($('#' + id).children('[name="' + item + '"]').length !== 0) continue;
            
            this.tree_additem(id, elements[i]);
        }
    }

    tree_existitem = function (fatherid, text) {
        fatherid += '_ref';

        const links = $("#" + fatherid + " li");
        for (var i = 0; i < links.length; i++) {
            let spans = $(links[i]).children();
            if (spans.length == 0) continue;
            let fspan = spans[0];
            let labels = $(fspan).find('label')
            if (labels.length == 0) continue;
            let flabel = labels[0];
            if ($(flabel) .html()== text) {
                return true;
            }
        }
        return false;
    }
    tree_getselection = function (fatherid) {
        fatherid += '_ref';
        const links = $("#" + fatherid +" span");
        for (var i = 0; i < links.length; i++) {
            if ($(links[i]).hasClass('active')) {
                return links[i];
            }
        }
        return null;
    }

    tree_removechildren = function (fatherid) {

        fatherid += '_ref';
        
        var elt = document.getElementById(fatherid);    
        if (!elt) return;
        var child = elt.lastElementChild;  
        while (child) { 
            elt.removeChild(child); 
            child = elt.lastElementChild; 
        }  
    }

    tree_setitemcolor = function (fatherid, text, style) {
        fatherid += '_ref';

        const links = $("#" + fatherid +" li");
        $.each(links, function (index, link) {
            if ($(link).find('.sb_label').html() == text) {
                $(this).find('span label').css("color", style);
                return;
            }
        });                
    }
    tree_getancestorlabels = function (fromelt) {
        let elt = $(fromelt);
        let label = '';
        let fathertree;
    
        let parents = elt.parents ('.sb_tree');
        
        for (var i = parents.length - 1; i >= 0; i--) {
            label   = label + '/' + $(parents[i]).find ('span').first().find ('label').html()    
        }
        return label;
    }
    //---------------------------------------------------- SB RENDER  ------------------------------------------------  

    render = function (component, togglefunction) {
        if (!defined (component)) 
            return ''; 
        if (typeof component == "string") {
            return (eval (component));
        }
        var content = '';

        switch (component.type) {
            case 'body':
                content = this.body(component);
                this.resize (body)    
            break;             
            case 'header':
                content = this.header(component);
            break;     
            case 'main':
                content = this.main(component);
            break;               
            case 'footer':
                content = this.footer(component);
            break;          

            case 'root':
                content = this.root(component);
            break;                                                   
            case 'panel':
                content = this.panel(component);
            break;           
            case 'html':  
                content = this.html(component);
            break;         
            case 'box':
                content = this.box1(component);
            break;      
            case 'bar':
                content = this.bar(component);
            break;      
            case 'group':
                content = this.group(component);
            break;    
            case 'tabs':
                content = this.tabs(component);
            break;      
            case 'table':
                content = this.table(component);
            break;      
            case 'tree':
                content = this.tree(component);
            break;       
            case 'drag':
                content = this.drag(component);
            break;              
            case 'modal':
                content = this.modal(component);
            break;      
            case 'label':
                content = this.label(component);
            break;
            case 'control':
            case 'link':
            case 'button':   
            case 'checkbox':      
            case 'switch':     
            case 'radio':     
            case 'select' :    
            case 'time' :      //  
            case 'int' : 
            case 'float' :
            case 'text' :
            case 'ihtml' :
            case 'search' :
            case 'textarea':  
            case 'range' :                               
                content = this.item(component, togglefunction)
            break;
        }
        return content;
    }

    stringify = function (events){
        var content = '';
        var keys = Object.keys(events);

        keys.forEach((key) => {
            content += key + (events[key] != '' ?  '="' + events[key] + '" ' : ' ');
            if (events[key] == 'undefined;') {
        //   console.log('error');
            }
        })

    // console.log (content)
        return content;
    }

    item_group = function (array) {
        let items = [];
        for (var i= 0; i < array.length; i++) {
            let object   = array[i];
            items.push(this.items_object(object, false));
        }
        return {
            type: 'group',
            form: true,
            items: items
        }
    }

    items_menu = function (object) {
        var menu = [];
        var keys = Object.keys(object);
        for (var index = 0; index < keys.length; index++) {
            let key = keys[index];
            menu.push ({id: index, text: object[key]})
        }
        return menu;
    }


    items_object = function (object, formgroup) {
        if (!object) return null;
        let items = [];
        
        let name         = defined(object.ClassName) ?  object.ClassName : 'field';//.substring(2);  //get off with MX
        let keys         = Object.keys(object);
        let array_format = object['props'];   
        let type         = '';
        let readmode     = false;
        var formgroup    = defined (formgroup) && formgroup == false ? '' : 'sb_formgroup';
    
        if (defined(array_format)) {
            for (var index = 0; index < keys.length; index++) {
                let key = keys[index];
    
                if (!defined(array_format[index])) continue;        
                if (defined(array_format[index].visible) && array_format[index].visible == 0) continue; 
                if (!defined(array_format[index].type)) continue;
                if (defined(array_format[index].disabled) && array_format[index].disabled == 1) readmode = true;
       
                type = array_format[index].type;
                if (type == 'group') {
                    items =  this.item_group (object[key]);
                }
                else {
                    items.push (    
                        {
                            ...{ 
                            id: name  + '_' + key + '_' + object.Code,
                            type:  type, 
                            class: formgroup,
                            item: key,  
                            menu: type == 'select' ? this.items_menu(eval (name + '_' + key)) : [],
                            step: type == 'int' ? array_format[index].step : 0,  
                            disabled: readmode,
                            value: object[key], 
                            attributes: {nodename: '' + name + ':' + object.Code + '.' + key + ''}, 
                            events: {onchange: "onchange_treenode_input(this)"}, 
                            title:'', 
                            },
                            ...array_format[index]
                        }
                    )
                }
            }
        }
        return items;
    }   

    panel_object = function (object) {
        let item = {
            id: 'panel_' + object.Code,
            type: 'panel',
            class: 'sb_formcontainer',
            items: this.items_object(object),
        }   
        return item;
    }

    stringfygroup = function (array) {
        let hcontent =     
            '{' +
                'type: \'group\', ' +
                'form: true,' +
                'items: [';
        let content = '';
    
        for (var i= 0; i < array.length; i++) {
            let object   = array[i];
            content += hcontent + sb.stringfyobject(object, false) + ']}, ';
        }
        return content;
    }

    
    stringfyobject = function (object, formgroup) {
    
        if (!object) return '';
        let content = '';
        
        
        let name         = object.ClassName; //.substring(2);  //get off with MX
        let keys         = Object.keys(object);
        let array_format = object['props'];   
        let type         = '';
        let readmode     = false;
        var formgroup    = defined (formgroup) && formgroup == false ? '' : 'sb_formgroup';
    
        if (defined(array_format)) {
            for (var index = 0; index < keys.length; index++) {
                let key = keys[index];
    
                if (!defined(array_format[index])) continue;        
                if (defined(array_format[index].visible) && array_format[index].visible == 0) continue; 
                if (!defined(array_format[index].type)) continue;
                if (defined(array_format[index].disabled) && array_format[index].disabled == 1) readmode = true;
       
                type = array_format[index].type;
                if (type == 'group') {
                    content += sb.stringfygroup (object[key]);
                }
                else {    
                    content +=  
                        '{' + 
                            'id: "' + name  + '_' + key + '_' + object.Code + '", ' +
                            'type: \'' +  type + '\', ' + 
                            'class: "' + formgroup + '", ' +                
                            'item: "' + key + '", ' + 
                            (type == 'select' ? 'menu: sb.menufyobject(' + name + '_' + key + '), ' : '')  +
                            (type == 'int' ?  'step: ' +  array_format[index].step  + ', ' : '')  +
                            'disabled: ' + readmode  + ', ' +
                            'value: "' + object[key] + '", ' + 
                            'attributes: {nodename: "' +  name + ':' + object.Code + '.' + key + '"}, ' + 
                            'events: {onchange: "onchange_treenode_input(this)"}, ' + 
                            'title:\'\'' + 
                        '}, ';
                }
            }
        }
        return content;
    }   


    panelfyobject = function (object) {
        let content = 
            '({' +
                'id: "panel_' + object.Code + '", ' +
                'type: \'panel\', ' +
                'class: "sb_formcontainer", ' +
                'items: [';
        content += this.stringfyobject(object);
        content += ']})'    
    
        return this.render (eval(content));
    }
}



const sb = new(SB)