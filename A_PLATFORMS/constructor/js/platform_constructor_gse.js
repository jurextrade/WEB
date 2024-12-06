/*------------------------------------------------------------------------- GSE ----------------------------------------------------------------------------*/
var constructor_gse_editor      = null;      // project main container
var constructor_InvertTag       = null;



function constructor_gse_init (id) {
    var spaces = [  'body', 
                    'header',
                    'main',
                    'footer',
                    'root',
                    'panel',
                    'html',  
                    'box',
                    'bar',
                    'group',
                    'tabs',
                    'table',
                    'tree',
                    'drag',
                    'modal',
                    'label',
                    'control',
                    'link',
                    'button',   
                    'checkbox',      
                    'switch',     
                    'radio',     
                    'select' ,    
                    'time',  
                    'int' , 
                    'float' ,
                    'text' ,
                    'ihtml' ,
                    'search' ,  
                    'range']      

///////////////////////////////  APPLI 1    
    var objgse = new gse();
    
    objgse.CreateApplication("CONSTRUCTOR");
    for (var i = 0; i < spaces.length; i++) {
        objgse.CreateSpace("CONSTRUCTOR", spaces[i]);                
    }
    objgse.CreateLinkType("CONSTRUCTOR", "TAGLINK");
    for (var i = 0; i < spaces.length; i++) {
        objgse.DomainLinkType("CONSTRUCTOR", "TAGLINK", objgse.GSEFROMSPACE, spaces[i]);
        if (spaces[i] != "body") {
            objgse.DomainLinkType("CONSTRUCTOR", "TAGLINK", objgse.GSETOSPACE, spaces[i]);        
        }
    }

///////////////////////////////  APPLI 2    
    objgse.CreateApplication("JSON");

    spaces = js_datatypes.concat (js_objectypes);

    for (var i = 0; i < spaces.length; i++) {
        objgse.CreateSpace("JSON", spaces[i]);                
    }

    objgse.CreateLinkType("JSON", "JSONLINK");
    for (var i = 0; i < spaces.length; i++) {
        objgse.DomainLinkType("JSON", "JSONLINK", objgse.GSEFROMSPACE, spaces[i]);
        objgse.DomainLinkType("JSON", "JSONLINK", objgse.GSETOSPACE, spaces[i]);
    }        
///////////////////////////////     

    constructor_gse_editor = new gsecontainer(objgse);
    constructor_gse_editor.SetDrawMode(objgse.GSEHORIZONTAL, objgse.GSEDIRECTLINK);
    constructor_gse_editor.SetNodeMode(objgse.GSEROUND);
    constructor_gse_editor.setCanvasId(id);
}


function constructor_GSEtreefromJSON (datakey, data) {
    let gse = constructor_gse_editor.GSE;
    var object = null;

    var datatype = typeof data;
    var objecttype = '';
       
    if (!js_datatypes.includes(datatype)) {
        console.log ('DATA TYPE UNDEFINED ' + datatype);
    } 
  
    switch (datatype) {

        case 'object': 
            objecttype = js_objecttype(data);

            if (!js_objectypes.includes(objecttype)) {
                console.log ('OBJECT TYPE IS A DEFINED CLASS ' + datatype + '  :  ' + objecttype);                
            }    
          
  
            var sonnode;
            switch (objecttype) {
                case 'Object':
                    object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + objecttype + (data.constructor.name != 'Object' ?  '(' +  data.constructor.name + ')' : ''));

                    var keys = Object.keys(data);
                    for (var index = 0; index < keys.length; index++) {
                        let key = keys[index];
                        gse.MakeLink ("JSON", "JSONLINK", object, constructor_GSEtreefromJSON(key, data[key]))
                        
                    }
                break;
                case 'Array':
                    object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + objecttype);

                    for (var i = 0; i < data.length; i++) {
                        gse.MakeLink ("JSON", "JSONLINK", object, constructor_GSEtreefromJSON('', data[i]))
                    }

                    break;
                case 'Date':
                    object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + objecttype);                    
                break;         
                case 'RegExp':
                    object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + objecttype);                    
                break;  
                case 'Null':
                    object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + objecttype);                    
                break;       
                case 'HTMLDocument':
                    object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + objecttype);                    
                break;                          
                default:
                    console.log ('What is this Object Type?');
                break;                   
            }
        break;
        case'string':
        case'number':
        case'bigint':
        case'boolean':
        case'object':
        case'symbol':
        case'undefined':
        case'function':
            object = gse.MakeNode("JSON", datatype, 0, datakey + ': ' + data);

        break;        
        default:
            console.log ('What is this Data Type?');
        break;     
    }      
    return object;        
}

function constructor_gse_update (jsonstruct) {
    if (jsonstruct == body) {
        constructor_gse_editor.GSE.Clear ("CONSTRUCTOR");    
        let rootgse = constructor_GSEtreefromSB(constructor_gse_editor, body);
        constructor_gse_editor.SetRootNode(rootgse);  
        constructor_gse_editor.Refresh();
        return;
    }
    constructor_gse_editor.GSE.Clear ("JSON");    
    let rootgse = constructor_GSEtreefromJSON('root', jsonstruct);
    constructor_gse_editor.SetRootNode(rootgse);  
    constructor_gse_editor.Refresh();
}

function constructor_gse_select () {
}

function constructor_gse_refresh (id) {
    if (constructor_gse_editor) {
        constructor_gse_editor.Refresh();  
    }
}

function onclick_stylegroup (elt, event) {
    

    switch (elt.id) {
        case 'nodemode_rectangle':
            constructor_gse_editor.SetDrawMode(null, null, constructor_gse_editor.GSE.GSERECT);
        break;      
        case 'nodemode_circle':
            constructor_gse_editor.SetDrawMode(null, null, constructor_gse_editor.GSE.GSEROUND);            
        break;
        case 'linemode_net':
            constructor_gse_editor.SetDrawMode(null, constructor_gse_editor.GSE.GSENETLINK, null);   
        break;
        case 'linemode_normal':    
            constructor_gse_editor.SetDrawMode(null, constructor_gse_editor.GSE.GSEDIRECTLINK, null);   
        break;
    }
    constructor_gse_editor.Refresh();      
}

function onclick_modegroup (elt, event) {

    switch (elt.id) {    
        case 'drawmode_vertical':  
            constructor_gse_editor.SetDrawMode(constructor_gse_editor.GSE.GSEVERTICAL);
        break;
        case 'nodemode_horizontal':
            constructor_gse_editor.SetDrawMode(constructor_gse_editor.GSE.GSEHORIZONTAL);
        break;
        case 'linemode_normal':
            constructor_gse_editor.SetDrawMode(constructor_gse_editor.GSE.GSENORMAL);
        break;
    }
    constructor_gse_editor.Refresh();         
}

function constructor_GSEtreefromSB (container, item) {
    let gse = container.GSE;

	var object = gse.MakeNode("CONSTRUCTOR", item.type, 0, item.type + ': ' + item.id);
    if (object == null) {
        console.log('SB : item with no type ' + item.type)
        return
    }
    if (defined (item.id) && item.id != '') {
        object.UserField = $('#' + item.id);
        object.item = item;
    }
    if (defined (item.items)) {
        for (var j = 0; j < item.items.length; j++) 
            gse.MakeLink ("CONSTRUCTOR", "TAGLINK", object, constructor_GSEtreefromSB(container, item.items[j]));
    }    
    return object;
}


function CanDrop (rootnode, dragnode, node) {
    return true;
}

function ondragover_constructor_gse_node (container, dragnode, event, px, py) {

    var node = container.FindObject("CONSTRUCTOR", px, py, dragnode);

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
                constructor_InvertTag  = node.UserField;                 
                constructor_InvertTag.css ('box-shadow', 'inset 0px 0px 0px 2px ' + gse_invertcolor);
            }
      
        }
        else {
            $("#" + container.CanvasId).css('cursor','default');				
            container.InvertObject = null;
            if (constructor_InvertTag) {
                constructor_InvertTag.css ('box-shadow', '');
            }
            constructor_InvertTag = null;            
        }
    }    
    container.Refresh (event);	
	return node;
}

function ondragover_constructor_gse (elt, event) {
}

function ondragenter_constructor_gse (elt, event) {
}


function ondrop_constructor_gse (elt, event) {
    const myJSON = JSON.stringify(body, null, 2);
}

function ondblclick_constructor_gse (elt, event) {

  
}

function onmousemove_constructor_gse (elt, event) {
  
    var container = constructor_gse_editor;  
   
	var node = ondragover_constructor_gse_node (container, container.BeginDrag, event, event.offsetX, event.offsetY);	    
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

function onmousedown_constructor_gse (elt, event) {

    var container = constructor_gse_editor;         

    var node = container.FindObject("CONSTRUCTOR", event.offsetX, event.offsetY);
    
    if (node && (node != container.SelectNode)) {
        container.Select (node);
        if (node.UserField) {    
            var jsonobject = JSON.stringify(node.item, null, 2);
            constructor_jsoneditor.setValue(jsonobject, -1);
        }
    }
   
    if (!node) {
        container.UnSelect();
        constructor_jsoneditor.setValue('', -1);
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

function onmouseup_constructor_gse (elt, event) {
    var onnode = null;
    var ShouldParse = false;
    
    var container = constructor_gse_editor;           

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

function oncontextmenu_constructor_gse (elt, event) {
} 

function onmouseenter_constructor_gse (elt, event) {
} 

function onmouseleave_constructor_gse(elt, event) {
} 


