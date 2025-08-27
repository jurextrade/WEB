function onclick_gsestylelinegroup (elt, event) {
    
    var canvas = $(elt).closest ('.gsepanel').find ('canvas');
    var container = platform_gse_container (canvas[0].id);

    switch (elt.id) {

        case 'linemode_net':
            container.SetDrawMode(null, container.GSE.GSENETLINK, null);   
        break;
        case 'linemode_normal':    
            container.SetDrawMode(null, container.GSE.GSEDIRECTLINK, null);   
        break;
    }
    container.Refresh();      
}

function onclick_gsestylenodegroup (elt, event) {
    
    var canvas = $(elt).closest ('.gsepanel').find ('canvas');
    var container = platform_gse_container (canvas[0].id);

    switch (elt.id) {
        case 'nodemode_rectangle':
            container.SetDrawMode(null, null, container.GSE.GSERECT);
            
        break;      
        case 'nodemode_circle':
            container.SetDrawMode(null, null, container.GSE.GSEROUND);            
        break;
    }
    container.Refresh();      
}

function onclick_gsemodegroup (elt, event) {
    var canvas = $(elt).closest ('.gsepanel').find ('canvas');
    var container = platform_gse_container (canvas[0].id);

    switch (elt.id) {    
        case 'nodemode_vertical':  
            container.SetDrawMode(container.GSE.GSEVERTICAL);
        break;
        case 'nodemode_horizontal':
            container.SetDrawMode(container.GSE.GSEHORIZONTAL);
        break;
        case 'linemode_normal':
            container.SetDrawMode(container.GSE.GSENORMAL);
        break;
    }
    container.Refresh();         
}

function platform_gse_container (id) {
    return document.getElementById(id).container;
}

function platform_gse_refresh (id) {
    let elt = document.getElementById(id);
    if (elt) {
        let container = elt.container;
        if (container) {
            container.Refresh();      
        }
    }
}