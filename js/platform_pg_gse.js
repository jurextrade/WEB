/////////////////////////////////////////////////////////////////////////////////////////
///                                 ENGINE PANEL EDITOR                               ///
/////////////////////////////////////////////////////////////////////////////////////////

var CurrentContainer            = null;      // project main container
var CurrentTContainer           = null;      // terminal main container
var CurrentCContainer           = null;      // condition container

//---------------------------------------------------- gse panels ---------------------------------------------   

var STRATEGY_GSE_ID         = 'gsecanvas_strategy';
var SESSION_GSE_ID          = 'gsecanvas_session';
var CONDITION_GSE_ID        = 'gsecanvas_condition';


const pgcontainer_default_options = {
    ondragover:     ondragover_GSE,
    ondragenter:    ondragenter_GSE,
    ondrop:         ondrop_GSE,
    onmousemove:    onmousemove_GSE,
    ondblclick:     ondblclick_GSE,
    oncontextmenu:  oncontextmenu_GSE,
    onmouseenter:   onmouseenter_GSE,
    onmouseleave:   onmouseleave_GSE,
    onmousedown:    onmousedown_GSE, 
    onmouseup:      onmouseup_GSE
}

function pg_gse_init (canvas_id) {
    var objgse = new gse();
    objgse.CreateApplication("RULES");
    objgse.CreateSpace("RULES", "ACTION");
    objgse.CreateSpace("RULES", "ATOM");
    objgse.CreateLinkType("RULES", "SESSIONLINK");
    objgse.DomainLinkType("RULES", "SESSIONLINK", objgse.GSEFROMSPACE, "ACTION");
    objgse.DomainLinkType("RULES", "SESSIONLINK", objgse.GSETOSPACE, "ACTION");
    objgse.DomainLinkType("RULES", "SESSIONLINK", objgse.GSETOSPACE, "ATOM");

    var objcontainer = new gsecontainer(objgse, pgcontainer_default_options);
    objcontainer.SetDrawMode(objgse.GSEHORIZONTAL, objgse.GSEDIRECTLINK);
    objcontainer.SetNodeMode(objgse.GSEROUND);
    objcontainer.setCanvasId(canvas_id);
    return objcontainer;
}

//--------------------------------------------------------------------------- ondragover_gsecontainer

function ondragover_GSE (event, container) {  //allow drop

    event.preventDefault();    

    var pl = PL;

	var px = event.offsetX; 
	var py = event.offsetY; 

	
	var dragstring = container.DragObject;
	if (!dragstring)
	    return;
	
	var FromName = dragstring.split (" ")[0];
	
	if (FromName.startsWith ("("))
	    FromName = FromName.substring (1);
	    
    if (FromName.substring(5, 14) == 'condition') {
        FromName = FromName.substring(15);
    }
	    
	container.InvertObject = null;


    event.dataTransfer.dropEffect = "default";
    
	var ToObject = container.FindObject("RULES", px, py);
	

	
	if (ToObject && ToObject != container.RootNode)  {
		var NbrPar =  ToObject.Inherit.length;
		
		var pToEntity = ToObject.UserField;	
		if (pToEntity.Type == 'PLOPERATOR') {

			var pAction = pToEntity.Val;
			
			var ToName =  pAction.ActionClass.Name;
			
			if (pl.WCI (ToName, FromName)) 	{
			    
			    container.InvertObject = ToObject;
                event.dataTransfer.dropEffect = "move";
               
			}
			else
                event.dataTransfer.dropEffect = "no-drop";					    
			
		}
		else
            event.dataTransfer.dropEffect = "no-drop";					    
	}
	else
	{
		if (pl.IsIfStatement (FromName) || pl.IsAction(FromName)) {		
            container.InvertObject = container.RootNode;		    
            event.dataTransfer.dropEffect = "pointer";		            
		}
	}
    container.Refresh (event);	
}

//--------------------------------------------------------------------------- ondragenter_gsecontainer

function ondragenter_GSE(event, container) {
}

//--------------------------------------------------------------------------- ondrop_gsecontainer

function ondrop_GSE (event, container) {
    event.preventDefault();
    event.stopPropagation();
      

    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }          
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    var data = event.dataTransfer.getData("text");
  

	if (!container.InvertObject) return;

	if (container.InvertObject == container.RootNode) 
	    container.InvertObject = null;
  
    var plstring = container.DragObject.substring (1, container.DragObject.length - 1);
    

    if (data.substring(5, 14) == 'indicator') {
        var symbol = symbolcanvas.CurrentSymbol;
        var found = false;
        var objectname = data.substring(15);
        for (var i = 0; i < Menu_Indicators.length; i++) {
            if (Menu_Indicators[i].id == 'indicator_' + objectname) {
                found = true; 
                break;
            }
        }
        if (found) {
                openPopupIndicator(IndicatorsMenu[i]);
        }
        return;
    } else
    if (data.substring(5, 14) == 'condition') {
        var symbol = symbolcanvas.CurrentSymbol;
        var found = false;
        var conditionname = data.substring(15);
        var condition = PG.GetConditionFromName(conditionname);
        if (!condition)
            return;
        plstring = conditionname;
    }
    
	    
    var childobject = solution.PL.Insert (container, container.InvertObject, plstring);

	if (childobject) {
	    UpdateEditor (container);
	}
	
	container.DragObject = null;
	container.InvertObject   = null;

  //  container.CloseFirstLevel(container.InvertObject.Fromherit[0].FromObject, container.DragObject);
    container.Refresh (event);
}

//--------------------------------------------------------------------------- onmousemove_gsecontainer

function onmousemove_GSE (event, container) {
    
    event.preventDefault();    
    
    var PG;
    var terminal;

    let elt = event.target;
    
    if (elt.id == STRATEGY_GSE_ID || elt.id == CONDITION_GSE_ID) {
        terminal = solution.CurrentProject;
    }
    else {
        terminal = solution.CurrentTerminal;          
    }
    if (!terminal)
        return;
        
    PG= terminal.PG;
    
	var node = ondragover_Node (PG, container, container.BeginDrag, event, event.offsetX, event.offsetY);	    

    var sresult = "";

    if (node) {
     
        var entity = node.UserField;
        if (!entity) return;   // root
	    if (entity.Type == 'PLOPERATOR')	{
			var action = entity.Val;            

			if (action.ActionClass.Name.IsObjectLogic () ||
                action.ActionClass.Name.IsObjectLogicInput () ||
            	action.ActionClass.Name.IsObjectInput ())  {

                    if (action.ListParams.length < 2)
                        return;
                        
    			    var nbrperiods = action.ListParams.length - 2;
    			    var objectname = action.ListParams[0].Val.Name;
    			    var signalname = action.ListParams[1].Val.Name;
    			    var periodnames = [];

                    var object = PG.GetObjectFromName (objectname);
                    if (!object) return;
                    if (object.Type != "PREDEFINED")
                        objectname = object.Type;
                        
    			    for (var j = 0; j < nbrperiods; j++) 
    			        periodnames.push (action.ListParams[2 + j].Val.Name);
    			    var sresult1 = action.UserField.Name;       
                    sresult = GetSignalDescriptionFromObjectType (objectname, signalname.substring(2));
			}
			else {
			    if (action.ActionClass.Name.IsAction ()) {
                    sresult = GetActionDescriptionFromName (action.ActionClass.Name);
			        
			    }
			    
			}
	    }
	    else 
	    if (entity.Type == 'PLFIELD')	{
             var fieldname = entity.Val.Name;
             var field = solution.GetFieldFromName (fieldname);
	         sresult = field.Description;
	    }
	    var margin_top =  node.Y  - 4;
	    var margin_left = node.X;
    }
    if (node) {
        $("#" + elt.id).css('cursor','pointer')    	
        showTag("#" + elt.id, margin_left, margin_top, sresult);
    }
    else {
        $("#" + elt.id).css('cursor','auto')    	
        showTag("#" + elt.id, margin_left, margin_top, "");
    }  
}

//--------------------------------------------------------------------------- ondblclick_gsecontainer

function ondblclick_GSE (event, container) {
    let elt = event.target;

    event.preventDefault();        
    
    
    var node = container.FindObject("RULES", event.offsetX, event.offsetY);
    if (!node) return;
    
    
    var margin_bottom = -(elt.height - node.Y)  + node.Height - 2;
    var margin_left = node.X - node.Width;    
   
    SelectedNode (node);   
   
    var nodename = node.Name[0].split(" ")[0]; 

    var openvaluetype = undefined;
    
    if (nodename.IsAction ()) {
        sb.overlay({
            rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
            event: event,            
            pageX:   event.pageX,
            pageY:   event.pageY,
            clickinside: true,            
            onshow:  function () {
                if (nodename != undefined) {
                    PickerActionsPanel_Update ();
                    PickerValue_Select (nodename);
                }
            },        
            html: PickerPanel(openvaluetype)
        });    	   

    }
    else
   
    if (nodename.IsBasic1Logic ()) {
        sb.overlay({
            rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
            event: event,            
            pageX:   event.pageX,
            pageY:   event.pageY,
            clickinside:true,            
            onshow:  function () {
                if (nodename != undefined) {
                    PickerLogicPanel_Update (Basic1LogicMenu, 'Basic1Logic');
                    PickerValue_Select (nodename);
                }
            },        
            html: PickerPanel(openvaluetype)
        });    	   
  

    }
    else    
    if (nodename.IsBasic2Logic ()) {
        sb.overlay({
            rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
            event: event,            
            pageX:   event.pageX,
            pageY:   event.pageY,
            clickinside:true,            
            onshow:  function () {
                if (nodename != undefined) {
                    PickerLogicPanel_Update (Basic2LogicMenu, 'Basic2Logic');
                    PickerValue_Select (nodename);
                }
            },        
            html: PickerPanel(openvaluetype)
        });    	   
  	   

    }
    else
    if (nodename.IsIfStatement ()) {
        node.Close = !node.Close;
        ChangeLabelsOnClose (node, node, node.Close);   
    }
    else
    
    if (nodename.IsObjectLogic () || nodename.IsObjectLogicInput () || nodename.IsObjectInput ()){
        var entity = node.UserField;
 		var action = entity.Val;            
        if (action.ListParams.length < 2)
           return;
	    var nbrperiods = action.ListParams.length - 2;
	    var objectname = action.ListParams[0].Val.Name;
	    var signalname = action.ListParams[1].Val.Name.substring(2);


        if (nodename.IsObjectLogic ())
            openvaluetype = "Boolean";
        else    
            openvaluetype = "Numeric";
        
        openPopupPickerIndicatorSignal (event, undefined, objectname, signalname, 'onclickgsesignal()')            
    }
    else
    
    if (nodename.IsFieldName ()){
        var entity = node.UserField;
        var fieldname = entity.Val.Name;        


       sb.overlay({
            rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
            event: event,            
            pageX: event.pageX,
            pageY: event.pageY,
            clickinside:true,            
            onshow:  function () {
                if (fieldname != undefined) {
                    PickerFieldsPanel_Update ();
                    PickerValue_Select (fieldname);
                }
            },        
            html: PickerPanel(openvaluetype)
        });    	   
    }
    
    else { 
    	var condition = solution.CurrentProject.PG.GetConditionFromName (node.Name[0]);
        if (condition && node.Inherit.length == 0) {
        	for (var z = 0; z < condition.Section.ListEntities.length; z++) 
                container.GSE.MakeLink ("RULES", "SESSIONLINK", node, TreeEntity(solution.PL, container.GSE, condition.Section.ListEntities[z]));
        }   
        node.Close = !node.Close;
    }      

    container.Refresh (event);
}

//--------------------------------------------------------------------------- oncontextmenu_gsecontainer

function oncontextmenu_GSE(event, container) {
    let elt = event.target;

    event.preventDefault();   

    var PG = solution.GetPGFromTerminal ();
    if (!PG) {
        return;
    }          

    var node = container.FindObject("RULES", event.offsetX, event.offsetY);
    
    if (!node) return;

     
    var OnName  = node.Name[0].split (" ")[0];
    
    var margin_bottom = -(elt.height - node.Y)  + node.Height - 2;
    var margin_left = node.X - node.Width;
    
    var menu = [];

/*   
    if (node.Inherit.length != 0)
        node.Close = !node.Close;
*/ 

    if (solution.PL.IsLogic (OnName) || solution.PL.IsObjectLogic (OnName)) {
	    menu.push ({ id: 7 ,    text: "Mark on Chart",    tooltip : 'Mark Condition on Chart',   icon : icon_eye});
    	menu.push ({ id: 6 ,    text: ""});

        if (elt.id == STRATEGY_GSE_ID) {
    	    menu.push ({ id: 8 ,    text: "Set as Condition", tooltip : 'Makes a Reusable Condition',icon : "fas fa-marker"});
    	    menu.push ({ id: 6 ,    text: ""});
        }

    }
    
    
    if (OnName.IsIfStatement ()) {
        if (elt.id == STRATEGY_GSE_ID) {
    	    menu.push ({ id: 8 ,    text: "Set as Rule", tooltip : 'Makes a Reusable Rule',icon : "fas fa-marker"});
    	    menu.push ({ id: 6 ,    text: ""});
        }
    }    



    if (!node.Close) {
	    menu.push ({ id: 7 ,    text: "Close Node",    tooltip : 'Hide Node SubTree',   icon : "fas fa-compress-arrows-alt"});
    }
    else {
	    menu.push ({ id: 7 ,    text: "Expand Node",    tooltip : 'Show Node Subtree',   icon : "fas fa-expand-arrows-alt"});
    }

    if (elt.id == STRATEGY_GSE_ID) {
    	menu.push ({ id: 2 ,    text: "Copy",          tooltip : 'Copy',  icon : icon_copy});

        menu.push ({ id: 1 ,    text: "Remove",        tooltip : 'Delete',icon : icon_trash});
    	menu.push ({ id: 3 ,    text: "Cut",           tooltip : 'Cut',   icon : icon_cut});    
        if (solution.Clipboard)
        	menu.push ({ id: 4 ,    text: "Paste",           tooltip : 'Paste',   icon : icon_paste});    
    }

    sb.overlay({
        rootelt: $('#' + event.currentTarget.id).closest('.sb_root'),
        event: event,        
        pageX:   event.pageX,
        pageY:   event.pageY + 20,

        onselect:function (elt, par) {
                       
            switch ($(elt).find('.sb_label').html()) {
                case 'Mark on Chart':
                    OnMarkObjectOnChart (PG, container, node);
                break;                 	
                case 'Set as Condition':
                    OnSetCondition (container, node);
                break;    
                case 'Set as Rule':
                    OnSetRule (container, node);
                break;                 
                case 'Copy':
                    OnCopyObject (container, node);
                break;                 	
                case 'Close Node':
                    node.Close = !node.Close;
                    container.Refresh (event);                        
                break;                 	
                case 'Expand Node':
                    node.Close = !node.Close;
                    container.Refresh (event);                    
                break;                 	

                case 'Cut':
                    OnCutObject (container, node);
                break;                 	
                case 'Remove' :
                    OnDeleteObject (container, node);
// BUG                    
                    if (node == container.RootNode) {
                        container.Refresh (event);
                    }                    
                    
                break;        
                case 'Paste' :
                    OnPasteObject (container, node);                    
                break; 
            }          
        },
        html: sb.menu (menu)
    });  
}

//--------------------------------------------------------------------------- onmouseenter_gsecontainer

function onmouseenter_GSE (event, container) {
    if (slasterror != "") {
       RefreshHelpAssistant (slasterror, 'tomato');       	
    }
}

//--------------------------------------------------------------------------- onmouseeleave_gsecontainer

function onmouseleave_GSE (event, container) {
    let elt = event.target;

    RefreshHelpAssistant ("");
    showTag("#" + elt.id, 0, 0, "");
}

//--------------------------------------------------------------------------- onmousedown_gsecontainer

function onmousedown_GSE (event, container) {

    var node = container.FindObject("RULES", event.offsetX, event.offsetY);
    
    if (node && (node != container.SelectNode)) {
        
        container.Select (node);

        
        var entity = node.UserField;
        if (entity && entity.Type == 'PLOPERATOR') {
    		var action = entity.Val;
/*    		
    		if (solution.PL.IsObjectLogic (action.ActionClass.Name) ||
                solution.PL.IsObjectLogicInput (action.ActionClass.Name) ||
            	solution.PL.IsObjectInput (action.ActionClass.Name))  {
                    SelectStrategyDependency (action.ListParams[0].Recid);
            	}
*/            	
    	}
    }
    
    if (!node) {
        container.UnSelect();
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

//--------------------------------------------------------------------------- onmouseup_gsecontainer

function onmouseup_GSE (event, container) {
    var onnode = null;
    var ShouldParse = false;
    
    let elt = event.target;

    document.getElementById(elt.id).style.cursor = "default";		  
	
	if (container.BeginDrag == null)
	    return;
    
    if (container.InvertObject && container.InvertObject != container.BeginDrag)
	{
		Obj		    = container.BeginDrag;
		FatherObj	= container.InvertObject;
		var Link	= container.BeginDrag.Fromherit[0];

		container.GSE.RemoveLink("RULES", Link);
		
		solution.PL.InsertObject (container, FatherObj, Obj);
  		ShouldParse = true;
	}
	else {

		var px = event.offsetX; 
		var py = event.offsetY; 
		var samelink = false;

		var Obj		    = container.BeginDrag;
		var FatherObj	= null;
		var Link		= null;
		var FindObj	    = null;
		var FindLink	= null;	   	
		var Links		= Obj.Fromherit;

	    container.BeginDrag      = null;
		container.InvertObject   = null;	
		
		if (Links.length != 0)	{  //not rootnode
		    
			Link		= Links[0];
			FatherObj  = Link.FromNode;
			var obj = null;
			var link; 

	        for (var i = 0; i < FatherObj.Inherit.length; i++) {			
				var x,y;
				link = FatherObj.Inherit[i];
				obj  = link.ToNode;
				x = container.view_x(obj.X);
				y = container.view_y(obj.Y);
				if (py >= y) {
					FindLink = link;
					FindObj =  obj;
				}
				else {
					if (obj == Obj)  
						samelink = true;
					break;
				}
			}
		    if (!samelink)	{
				if (!FindObj) {
					FindLink = 0;
					FindObj =  obj;
				}
				if (FindObj && FindObj != Obj)	{
				    container.GSE.RemoveLink("RULES", Link);
  					container.GSE.MakeLink ("RULES", "SESSIONLINK", FatherObj, Obj, FindLink);
  					ShouldParse = true;
				}
			}
		}
	}

	if (ShouldParse) {
	    container.UpdateTags(container.RootNode);
	    var nodetag = Obj.Tag;
    	UpdateEditor(container);
     //   container.Select (FindNode (container, nodetag));        	
	
	}
	container.BeginDrag = null;
	container.InvertObject   = null;
    container.Refresh (event);
}

function ondragover_Node (pg, container, dragnode, event, px, py) {

    if (!dragnode || !dragnode.UserField) return;

	container.InvertObject = null;
    document.getElementById(container.CanvasId).style.cursor = "default";


    var node = container.FindObject("RULES", px, py, dragnode);
    
	if (node != null  && node != dragnode.Fromherit[0].FromObject) {

    	if (CanDrop (pg, container.RootNode, dragnode, node)) {
			container.InvertObject = node;
            document.getElementById(container.CanvasId).style.cursor = "pointer";					
		} else {
           document.getElementById(container.CanvasId).style.cursor = "no-drop";				
		}
	}


	container.Refresh (event);	
	return node;
}


function OnSetCondition (container, node) {

    var markstring = "";
    var entity = node.UserField;

    markstring = SSFromNode (solution.CurrentProject.PG, "", container.RootNode, node, 0, true);


    var PG = solution.CurrentProject.PG;
    
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    
    var result = solution.PL.Parse (PG, markstring);
    if (result == -1000) {
        return;          
    }    
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    
  
    var condition = new pgcondition (PG, solution.CurrentProject.PG.ConditionFindName (), solution.PL.MainSection);
    PG.Conditions.push (condition);

    condition.SCContent = markstring; 
    PasteCondition (condition);
}

function OnSetRuleSS (container, node) {

    var markstring = "";
    var entity = node.UserField;

    markstring = SSFromNode (solution.CurrentProject.PG, "", container.RootNode, node, 0, true);


    var PG = solution.CurrentProject;
    
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    
    var result = solution.PL.Parse (PG, markstring);
    if (result == -1000) {
        return;          
    }    
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    

}

function OnSetRule (container, node) {

    var htmlstring = "";
    var entity = node.UserField;

    htmlstring = HTMLFromNode (solution.CurrentProject.PG, "", container.RootNode, node, false, true);

}

function SelectedNode (obj) {
    
    var entity = obj.UserField;
	if (!entity) return;
	
	if (entity.Type == 'PLATOM')   {
		var value = entity.Val;
		switch (value.Type) {
			case 'PLNULL' :
			case 'PLINTEGER' :
			case 'PLLONG' :
			case 'PLNULL' :
			case 'PLBOOLEAN' :
			case 'PLDATE'   :
			case 'PLTIME'   :
			case 'PLCHAR'   :
            break;
			case 'PLSTRING' :
            break;
			default :
			break;
		}

	}
	else
	if (entity.Type == 'PLVARIABLE') {
	}
	else
	if (entity.Type == 'PLVALUE') {
	}
	else
	if (entity.Type == 'PLFIELD') {
	}
	else
	if (entity.Type == 'PLPERIOD') {
	}
	else
	if (entity.Type == 'PLOBJECT') {
	}

	else
	if (entity.Type == 'PLOPERATOR') {
		var action = entity.Val;
		var InName = action.ActionClass.Name;
		
		if (InName.IsBasic1Logic()) {
		}
		else
		if (InName.IsBasic2Logic ()) {
		}
		else
		if(InName.IsActionSet()) {
		}
		else
		if (InName.IsAction()) {
		}
		else
		if (InName.IsMath()) {
		}
		else
		if (InName.IsObjectLogic()) {
		}
		else
		if (InName.IsObjectInput()) {
		}
		else
		if (InName.IsInput()) {
		}
		else
		if (InName.IsElseStatement()) {
		}
		else
		if (InName.IsIfStatement())	{
		}
		else
		if (InName.IsStatement()) {
		}
		else //must be a condition
		{
		}
	}

}

function OnCopyObject (container, node) {
    solution.Clipboard = container.CopyNode (node);
}

function OnCutObject (container, node) {
	if (!node) return;

	OnCopyObject (container, node);
/*
	GSEObject* obj = GSEGetDownObject (pgse, SelectObj, "RULES", GSEWindow);
	if (obj) 
	   	SelectObj = obj;      
	else
	{
		obj = GSEGetUpObject (pgse, SelectObj, "RULES", GSEWindow);
		if (obj)
		   	SelectObj = obj;
		else
		{
			obj = GSEGetLeftObject (pgse, SelectObj, "RULES", GSEWindow);
			if (obj && obj != container.RootNode) 
		   		SelectObj = obj;
			else
		   		SelectObj = NULL;
		}
	}
*/	
	container.GSE.RemoveTreeNode ("RULES", node);
	UpdateEditor(container);
}

function OnPasteObject (container, node) {
	
	if (!node) 
		node = container.RootNode;	

	if (solution.Clipboard)	{
		var pCopy = container.CopyNode (solution.Clipboard);
		if (pCopy.Name[0] == container.RootNode.Name[0]) {
            for (var i = 0; i < pCopy.Inherit.length; i++) {
                var son_node = pCopy.Inherit[i].ToNode;
    //            this.GSE.MakeLink ("RULES", "SESSIONLINK", node, son_node);
        		solution.PL.InsertObject (container, node, son_node);

            }
		}
		else {
    		solution.PL.InsertObject (container, node, pCopy);
		}
		UpdateEditor(container);
	}
}

function OnDeleteObject (container, node) {
	container.m_BeginDrag = null;
	
	if (!node) 
	    return;
    var Links		= node.Fromherit;
	
	if (Links.length == 0)   // not rootnode
        return;
        
   
	var	FatherObj		= Links[0].FromNode;
	
    solution.PL.RemoveObject (container, FatherObj, node);  
	UpdateEditor(container);
   
}

function ChangeLabelsOnClose (node, fromnode,  Close) {

	if (!Close)	{
	    node.Name.length = 1
	}
	else {
        for (var i = 0; i < fromnode.Inherit.length; i++) {			
            var nodeson  = fromnode.Inherit[i].ToNode;
            if (nodeson.Name[0].IsAction ()) {
                node.Name.push (nodeson.Name[0])
            } 
            ChangeLabelsOnClose (node, nodeson, Close);
        }
	}        
}

function OnMarkObjectOnChart (PG, container, node) {

    var markstring = "";
    var entity = node.UserField;
    
    markstring = SSFromNode (PG, "", container.RootNode, node, 0, true);
//    Marker_Run (CreateMarker (markstring));	
}	

function UpdateEditor (container) {
    let PG = solution.CurrentProject.PG;
	if (!PG) return;
	   
    var scstring = SSFromNode (PG, "", container.RootNode, container.RootNode, 0, false);

	if (container != CurrentContainer) return;    

    var Range = ace.require('ace/range').Range;	
	var range = new Range(0, 0, SCEditor.currentSession.getLength(), 0);
/*    
    SCEditor.currentSession.selection.setRange(range);
    var position = {row:0, column:0};    
    SCEditor.currentSession.insert(position, scstring);    
*/        

    SCEditor.currentSession.replace(range, scstring);    
    
//     SCEditor.aceEditor.clearSelection(); 
          
}

function showTag(id, x, y, text) {
    //        $(id).w2tag(text,  {position : 'top', style :"margin-left: " + x + "px; margin-top: " + y + "px;"});		  
    }
    
    var FindNode = function(container, tag) {
        if (!container.RootNode) return;
        
        var tabtag = tag.split(".");
        var tabstring = "this.RootNode";
    
        for (var i = 1; i < tabtag.length; i++) {
            tabstring += '.Inherit[' + tabtag[i] + '].ToNode'     
        }
    
        return eval (tabstring);
    }	


    
function SetColor (obj)	{
    let BackColor           = 'Turquoise';
	let TextColor           = 'gray';
	let ErrorColor			= 'tomato';
	
    
    let entity = obj.UserField;

	if (!entity) return;
	
	if (entity.Type == 'PLATOM')   {
		var value = entity.Val;
		switch (value.Type) 
		{
			case 'PLNULL' :
			case 'PLINTEGER' :
			case 'PLLONG' :
			case 'PLNULL' :
			case 'PLBOOLEAN' :
			case 'PLDATE'   :
			case 'PLTIME'   :
			case 'PLCHAR'   :
        		BackColor = IsInputBColor;
        		TextColor = IsInputTColor;
            break;
			case 'PLSTRING' :
			    if (entity.FatherAction && entity.FatherAction.ActionClass.Name == "EXECUTE") {
    	        	BackColor = IsConditionBColor;
            		TextColor = IsConditionTColor;
			    }
			    else {
            		BackColor = IsInputBColor;
            		TextColor = IsInputTColor;
			    }
			    
            break;

			default :
			break;
		}

	}
	else
	if (entity.Type == 'PLVARIABLE')
	{
		BackColor = IsVariableBColor;
		TextColor = IsVariableTColor;
	}
	else
	if (entity.Type == 'PLVALUE')
	{
		BackColor = IsValueBColor;
		TextColor = IsValueTColor;
	}
	else
	if (entity.Type == 'PLFIELD')
	{
		BackColor = IsFieldInputBColor;
		TextColor = IsFieldInputTColor;
	}
	else
	if (entity.Type == 'PLPERIOD')
	{
		BackColor = IsPeriodNameBColor;
		TextColor = IsPeriodNameTColor;
	}
	else
	if (entity.Type == 'PLOBJECT')
	{
		BackColor = 'black';
		TextColor = 'black';
	}

	else
	if (entity.Type == 'PLOPERATOR')
	{
		var action = entity.Val;
		var InName = action.ActionClass.Name;
		
		if (InName.IsBasic1Logic ())
		{
			BackColor = IsBasic1LogicBColor;	
			TextColor = IsBasic1LogicTColor;
		}
		else
		if (InName.IsBasic2Logic ())
		{
			BackColor =  IsBasic2LogicBColor;	
			TextColor =  IsBasic2LogicTColor;
		}
		else

		if(InName.IsActionSet ())
		{
			BackColor = IsSetqBColor;
			TextColor = IsSetqTColor;

		}
		else
		if (InName.IsAction ())
		{
			BackColor = IsActionBColor;
			TextColor = IsActionTColor;
		}
		else
		if (InName.IsMath ())
		{
			BackColor = IsMathBColor;
			TextColor = IsMathTColor;
		}
		else
		if (InName.IsObjectLogic ())
		{
			BackColor = IsObjectLogicBColor;
			TextColor = IsObjectLogicTColor;
		}
		else
		if (InName.IsObjectInput ())
		{
			BackColor = IsObjectInputBColor;
			TextColor = IsObjectInputTColor;
		}
		
		else
		if (InName.IsInput ())
		{
			BackColor = IsInputBColor;
			TextColor = IsInputTColor;
		}
		else
		if (InName.IsElseStatement ())
		{
			BackColor = IsElseStatementBColor;
			TextColor = IsElseStatementTColor;
		}
		else
		if (InName.IsIfStatement ())
		{
			BackColor = IsIfStatementBColor;
			TextColor = IsIfStatementTColor;
		}

		else
		if (InName.IsStatement ())
		{
			BackColor = IsIfStatementBColor;	
			TextColor = IsIfStatementTColor;
		}
		else //must be a condition
		{
			BackColor = IsConditionBColor;
		}

		if (action.Error) 
			BackColor = ErrorColor;

	}

	if (obj.Close)
	{
		BackColor = 'black';
		TextColor = 'gray';
	}
	obj.Color       = TextColor;
	obj.Background  = BackColor;
}
