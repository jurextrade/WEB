


//------------------------------------------------------------------- HEADER BAR ---------------------------------------------------------------------

function onclick_headerlogo (elt, event) {
    
}

function onclick_headerbaritems (elt, event) {
    let attr     = $(elt).attr('rootpname');
    let ui       = solution.get('ui')

    let platform = ui.platform_get('pname', attr);
    ui.platform_select (platform.pname);
}

function onclick_rightsidebarmenu (id, show) {
    if (show == undefined) {   //toggle
        if ($('#' + id).hasClass('checked')) {
            show = 0;
        }
        else {
            show = 1;
        }
    }
    let panelid = id.replace("sidebar", "sidebarpanel");
    let psidebarpanel   =  $('#' + panelid).parent ();    

    if (show == 1) {
        rightsidebarpanel_select(psidebarpanel, id);    
    } else    
    if (show == 0) {
        rightsidebarpanel_hide(psidebarpanel);            
    }
}


function rightsidebarpanel_hide (psidebarpanel) {
    let psidebarmenu    = psidebarpanel.next(); 
    let toresize        = psidebarpanel.hasClass('pinned')

    psidebarpanel.css ({'transition':''});

    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        if (index != 0) {
            $(panel).removeClass("sb_active");
            $(panel).addClass("sb_none");        
        }
    });

    let sbmenus  = psidebarmenu.find('.sb_link');

    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    psidebarpanel.removeClass('toggled')

    if (toresize) {0
        sb.resize(sb.interface);        
    }
}


function rightsidebarpanel_select (psidebarpanel, id) {
    let sidebarmenu         = $('#' + id);    
    let psidebarmenu    = psidebarpanel.next(); 
    let toresize        = psidebarpanel.hasClass ('pinned')

        
    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        if (index != 0) {
            $(panel).removeClass("sb_active");
            $(panel).addClass("sb_none");        
        }
    });
    
    let sidebarpanel   =  $('#' + id.replace("sidebar", "sidebarpanel"));  
    sidebarpanel.removeClass("sb_none");    
    sidebarpanel.addClass("sb_active");    
 
    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    sidebarmenu.addClass("checked");

    psidebarpanel.addClass('toggled')

    if (toresize) {
        sb.resize(sb.interface);        
    }
}

//------------------------------------------------------------------- MAIN SIDEBAR---------------------------------------------------------------------

function sidebarmenu_select (id, show) {
    let ui  = solution.get('ui') 

    let rootelt = $('#' + id).closest('.sb_root');
    let rootid = rootelt[0].id;
    let platform = ui.platform_get ('id', rootid);  
        
    if (show == undefined) {   //toggle
        if ($('#' + id).hasClass('checked')) {
            show = 0;
        }
        else {
            show = 1;
        }
    }
    if (show == 1) {
        sidebarpanel_show(platform, id.replace("sidebar", "sidebarpanel"));    
    }    
    if (show == 0) {
        sidebarpanel_hide(platform, id.replace("sidebar", "sidebarpanel"));            
    }
}

function sidebarpanel_show (platform, id) {
    let sidebarpanel    =  $('#' + id);
    let psidebarpanel   = sidebarpanel.parent ();
    let drageltv        = psidebarpanel.next();  
    let toresize        = !psidebarpanel.hasClass ('toggled')

        
    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        $(panel).removeClass("sb_active");
        $(panel).addClass("sb_none");        
    });

    drageltv.removeClass('sb_none');    
    sidebarpanel.removeClass("sb_none");    

    sidebarpanel.addClass("sb_active");    
    


    let sidebarmenu     = $('#' + id.replace("sidebarpanel", "sidebar"))
    
    let psidebarmenu    = sidebarmenu.closest('.sb_sidebarmenu'); 
    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });

    sidebarmenu.addClass("checked");

    if (toresize) {
        psidebarpanel.addClass('toggled')
        sb.resize(platform);
    }
}

function sidebarpanel_hide (platform) {
    let psidebarmenu    = $('#' + platform.id + ' .sb_sidebarmenu'); 
    let psidebarpanel   = $('#' + platform.id + ' .sb_sidebarpanel'); 
    let drageltv        = psidebarpanel.next();  
    let toresize        = psidebarpanel.hasClass('toggled')


    let sbpanels = psidebarpanel.children ();
    $.each(sbpanels, function (index, panel) {
        $(panel).removeClass("sb_active");
        $(panel).addClass("sb_none");        
    });

    drageltv.addClass('sb_none');

    let sbmenus         = psidebarmenu.find('.sb_link');
    $.each(sbmenus, function (index, menu) {
        $(menu).removeClass("checked");
    });


    if (toresize) {
        psidebarpanel.removeClass('toggled')
        sb.resize(platform);
    }
}
