/*------------------------------------------------------------------------- GSE ----------------------------------------------------------------------------*/
var netprog_gse_editor = null;      // project main container

const netprog_gse_default_options = {
    ondragover:     ondragover_netprog_gse_node,
    ondrop:         ondrop_netprog_gse,
    onmousemove:    onmousemove_netprog_gse,
    oncontextmenu:  oncontextmenu_netprog_gse,
    onmousedown:    onmousedown_netprog_gse, 
    onmouseup:      onmouseup_netprog_gse
}

function netprog_gse_init (id) {
    var spaces = ['manager', 'site', 'machine', 'application', 'database', 'journal', 'queue', 'connection', 'capplication', 'cdatabase',  
                  'cjournal', 'cqueue', 'cconnection'];

    var objgse = new gse();

    objgse.CreateApplication("NETPROG");

    for (var i = 0; i < spaces.length; i++) {
        objgse.CreateSpace("NETPROG", spaces[i]);                
    }

    objgse.CreateLinkType("NETPROG", "CONNECTIONLINK");
    for (var i = 0; i < spaces.length; i++) {
        objgse.DomainLinkType("NETPROG", "CONNECTIONLINK", objgse.GSEFROMSPACE, spaces[i]);
        if (spaces[i] != "manager") {
            objgse.DomainLinkType("NETPROG", "CONNECTIONLINK", objgse.GSETOSPACE, spaces[i]);        
        }
    }
    netprog_gse_editor = new gsecontainer(objgse, netprog_gse_default_options);
    netprog_gse_editor.SetDrawMode(objgse.GSEVERTICAL, objgse.GSEDIRECTLINK);
    netprog_gse_editor.SetNodeMode(objgse.GSERECTANGLE);
    netprog_gse_editor.setCanvasId(id);
}

function netprog_gse_update (mxmanager) {
    netprog_gse_editor.GSE.Clear ("NETPROG");    
    let rootgse = netprog_gse_treefromManager(netprog_gse_editor, mxmanager);
    netprog_gse_editor.SetRootNode(rootgse);  
    netprog_gse_editor.Refresh();    
}

function netprog_gse_select () {
}

function netprog_gse_treefromManager  (container, entity) {

    let gse          = container.GSE
    let name         = entity.ClassName; //.substring(2)
    let spacename    = netprog_typefromclass(name)
	let object       = gse.MakeNode("NETPROG", spacename, 0, (name == 'MXManager' ? 'Sites' : entity.Name));
    
    object.UserField = entity;
    
    if (name == 'MXManager') { 
        for (var j = 0; j < entity.Sites.length; j++) {
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", object, netprog_gse_treefromManager(container, entity.Sites[j]));
        }    
    } else 
    if (name == 'MXSite') { 
        for (var j = 0; j < entity.Machines.length; j++) {
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", object, netprog_gse_treefromManager(container, entity.Machines[j]));
        }    
    } else 
    if (name == 'MXMachine') { 
        for (var j = 0; j < entity.Applications.length; j++) {
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", object, netprog_gse_treefromManager(container, entity.Applications[j]));
        }      
        for (var j = 0; j < entity.Databases.length; j++) {
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", object, netprog_gse_treefromManager(container, entity.Databases[j]));
        }      
        for (var j = 0; j < entity.Journals.length; j++) {
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", object, netprog_gse_treefromManager(container, entity.Journals[j]));
        }      
        for (var j = 0; j < entity.Queues.length; j++) {
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", object, netprog_gse_treefromManager(container, entity.Queues[j]));
        }      

    }  
    return object;
}

function netprog_gse_push (array, entity) {
    let gse          = netprog_gse_editor.GSE
    let name         = entity.ClassName; // .substring(2)
    let spacename    = netprog_typefromclass(name)
	let node         = gse.MakeNode("NETPROG", spacename, 0, entity.Name);
    
    node.UserField = entity;
    switch (name) {
        case 'Site': {
            let fathernode = netprog_gse_editor.FindNodeFromUserField ("NETPROG", netprog_manager);
            gse.MakeLink ("NETPROG", "CONNECTIONLINK", fathernode, node);
        }    
    
    }    
    netprog_gse_editor.Refresh()    
}

function netprog_gse_refresh (id) {
    if (netprog_gse_editor) {
        netprog_gse_editor.Refresh();  
    }
}

function ondragover_netprog_gse_node (container, dragnode, event, px, py) {

    var node = container.FindObject("NETPROG", px, py, dragnode);

    if (dragnode) {
        if (node != null) {                                                  //  && node != dragnode.Fromherit[0].FromObject) {
            $("#" + container.CanvasId).css('cursor','pointer');  						
            container.InvertObject = node;
        }
        else {
            $("#" + container.CanvasId).css('cursor','default');				
            container.InvertObject = null;
        }

    }
    else {

        if (node != null) {                                                  //  && node != dragnode.Fromherit[0].FromObject) {
            $("#" + container.CanvasId).css('cursor','pointer');  						
            container.InvertObject = node;
            if (node.UserField) {           
            }
      
        }
        else {
            $("#" + container.CanvasId).css('cursor','default');				
            container.InvertObject = null;
        }
    }    
    container.Refresh (event);	
	return node;
}

function ondrop_netprog_gse (event, container) {
    const myJSON = JSON.stringify(body, null, 2);
}

function onmousemove_netprog_gse (event, container) {

    
	var node = ondragover_netprog_gse_node (container, container.BeginDrag, event, event.offsetX, event.offsetY);	    

    var sresult = "";

    if (node) {
     
        var entity = node.UserField;
        if (!entity) return;   // root
	   
    }
    if (node) {
        $("#" + container.CanvasId).css('cursor','pointer')    	
    }
    else {
        $("#" + container.CanvasId).css('cursor','auto')    	
    }  
    
}

function onmousedown_netprog_gse (event, container) {
 

    var node = container.FindObject("NETPROG", event.offsetX, event.offsetY);
    
    if (node && (node != container.SelectNode)) {
        container.Select (node);
        if (node.UserField) {       
            let name         = node.UserField.ClassName; // .substring(2)
		  	let nodename     = name + ':' +  node.UserField.Code;
            let elt          = $('#treenode-sites-1'); 

            sb.tree_compress('treenode-sites-1')            
            netprog_closebargroup (elt)

            if (nodename == "MXManager:0"){
                sb.tree_open('treenode-sites-1')  
                return;
            }   

            netprog_showtreepanel(nodename);
            netprog_selecttreepanel(nodename)         

        }
    }
   
    if (!node) {
        container.UnSelect();
        netprog_selecttreepanel();        
    }

    if (event.which == 1) {   // right click
        if (container.SelectNode != null && container.BeginDrag == null && container.SelectNode != container.RootNode) {
            container.BeginDrag = node;
            container.DragPoint_x = container.view_x (event.offsetX);
    		container.DragPoint_y = container.view_y (event.offsetY);
        }
    }
    container.Refresh (event);    
} 

function onmouseup_netprog_gse (event, container) {
    var onnode = null;
    var ShouldParse = false;
    
    $("#" + container.CanvasId).css('cursor','auto');
	
	if (container.BeginDrag == null)
	    return;
    
    if (container.InvertObject && container.InvertObject != container.BeginDrag) {
	}
	else {
	}

	container.BeginDrag = null;
	container.InvertObject   = null;
    container.Refresh (event);
}    

function oncontextmenu_netprog_gse (event, container) {

    
    var node = container.FindObject("NETPROG", event.offsetX, event.offsetY);
    if (!node) return;

    event.preventDefault();   
    
    var OnName  = node.Name[0].split (" ")[0];
    
    var margin_bottom = -(container.Canvas.height - node.Y)  + node.Height - 2;
    var margin_left = node.X - node.Width;
    
    var menu = [];

/*   
    if (node.Inherit.length != 0)
        node.Close = !node.Close;
*/ 
    let entity      = node.UserField;
    let classname   = entity.ClassName; // .substring(2);

    switch (classname) {
        case 'Manager':
            return;
        break;
        case 'Site':
            return;

        break;
        case 'Machine':
            return;

        break;
        case 'Application':
            menu.push ({ id: 1 ,    text: "Connect",    tooltip : 'Connect',   icon : icon_connection});
            menu.push ({ id: 1 ,    text: "See",    tooltip : 'Connect',   icon : icon_connection});
            menu.push ({ id: 6 ,    text: ""});

            menu.push ({ id: 1 ,    text: "Modify",    tooltip : 'Connect',   icon : icon_connection});
            menu.push ({ id: 1 ,    text: "Delete",    tooltip : 'Connect',   icon : icon_connection});
            menu.push ({ id: 1 ,    text: "anything",    tooltip : 'Connect',   icon : icon_connection});

        break;
    }
    
    sb.overlay({
        rootelt: $('body'),
        event: event,        
        pageX:   event.pageX,
        pageY:   event.pageY + 20,

        onselect:function (elt, par) {
                       
            switch ($(elt).find('.sb_label').html()) {
                case 'Connect':
                break;                 	
                case 'See':
                break;    
                case 'Modify':
                break;                 	
                case 'Delete':
                break;                 	
                case 'anything':
                break;                 	
                case 'Remove' :
                break;        
            }          
        },
        html: sb.menu (menu)
    });      
} 

