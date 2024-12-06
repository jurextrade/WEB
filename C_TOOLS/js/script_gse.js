/*
    --remix-bg-darker:#222336; 
    --remix-bg:    #2a2c3f;

    --remix-text:  #a2a3bd; 
    --remix-text1:  #959bad;
    
	--remix-text-dark: #babbcc;
    --remix-text-danger: #ff5858;
    --remix-text-success: #32ba89;
    --remix-text-warning: #ffb684;
    --remix-bg-warning:  #433337;
    --remix-border-warning: #5e4037;

    --remix-btn-bg : #007aa6;
    --remix-btn-border: #3f4455;
    --remix-border:  #3f4455;


    color: #ff8a8a;
    background: #402938;
    border: 1px solid #572c38;



	*/

var gse_font_family 		    = "nunito sans,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji";
var gse_font_size 			    = '12px'
var gse_node_background   		= '#2a2c3f';
var gse_node_textcolor	  		= '#a2a3bd';
var gse_node_bordercolor  		= '#595c76'; //#3f4455';
var gse_node_borderwidth  		= 1;
var gse_link_color 		  		= '#007aa6';
var gse_link_width		  		= 1.5;
var gse_invertcolor				= '#adff2f';
var gse_node_close_background 	= '#433337';
var gse_node_close_textcolor  	= '#ffb684'; 
var gse_node_close_bordercolor	= '#5e4037';
var gse_node_close_borderwidth	= 1;
var gse_node_select_background	= '#2a2c3f';
var gse_node_select_textcolor  	= '#a2a3bd'; 
var gse_node_select_bordercolor	= '#ff5858';
var gse_node_select_borderwidth	= 1;


CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
	if (width < 2 * radius) radius = width / 2;
	if (height < 2 * radius) radius = height / 2;
	this.beginPath();
	this.moveTo(x + radius, y);
	this.arcTo(x + width, y, x + width, y + height, radius);
	this.arcTo(x + width, y + height, x, y + height, radius);
	this.arcTo(x, y + height, x, y, radius);
	this.arcTo(x, y, x + width, y, radius);
	this.closePath();
	return this;
}

class application {
	constructor (name) {
		this.Name = name;
		this.Nodes = [];
		this.Links = [];
		this.LinkTypes = [];
		this.Spaces = [];
		this.FindSpace = function(space_name) {
			for (var i = 0; i < this.Spaces.length; i++) {
				if (this.Spaces[i].Name == space_name)
					return this.Spaces[i];

			}
			return null;		
		};
		this.FindLinkType = function(linktype_name) {
			for (var i = 0; i < this.LinkTypes.length; i++) {
				if (this.LinkTypes[i].Name == linktype_name)
					return this.LinkTypes[i];
			}
			return null;
			
		};
	}	
}

class space {
	constructor (name) {
		this.Name = name;
		this.Font = 0;

		this.Color       = gse_node_textcolor;    // text 
		this.Background  = gse_node_background;
		this.BorderWidth = gse_node_borderwidth;
		this.BorderColor = gse_node_bordercolor;

		this.Resource = 0;
		this.Code = 0;
		
		this.SetColor  = function (color) {
			this.Color = color;
		}
		this.SetBackground  = function (color) {
			this.Background = color;
		}
	}
}

class linktype {
	constructor(name) {
		this.Name = name;
		this.FromSpaces = [];
		this.ToSpaces = [];
		this.Style;

		this.Color   = gse_link_color;		
		this.Width   = gse_link_width;		
	}
}

class node {
	constructor(space, name) {
		this.Code = 1;
		this.Resource = 0;
		this.Type = 0;
		this.X = 200;
		this.Y = 100;
		this.Width = 100;
		this.Height = 6;
		this.Pattern = 0;
		this.Style = 0;
		this.Name = [ name ];
		this.Close  = 0;
		this.Select = 0;
		this.Mark = false;
		this.Modif = 0
		this.Fromherit = [];
		this.Inherit = [];
		this.Visible = true;
		this.Space     = space.Name;
		
		this.Color    	 = space.Color;      	  
		this.Background  = space.Background; 	
		this.BorderWidth = space.BorderWidth;					
		this.BorderColor = space.BorderColor;			

		this.Marker = null;
		
		this.SetTreeNodesMark = function(flag) {
			this.Mark = flag;
			for (var i = 0; i < this.Inherit.length; i++)
				this.Inherit[i].ToNode.SetTreeNodesMark(flag);
		}
	}	
}

class link{
	constructor(linktype, fromnode, tonode, afterlink) {
		this.LinkType = linktype.Name
		this.FromNode = fromnode;
		this.ToNode   = tonode;

		this.Color   = linktype.Color;		
		this.Width   = linktype.Width;	

		tonode.Fromherit.push(this);

		if (afterlink != null) {
			if (afterlink == 0) 
				fromnode.Inherit.splice(0, 0, this);
			else {	        
				var index =  fromnode.Inherit.indexOf (afterlink);
				if (index !== -1) 
					fromnode.Inherit.splice(index+1, 0, this)
				else
					fromnode.Inherit.push(this);
			}
		}
		else {
			fromnode.Inherit.push(this);
		}
	}
}

class gse {
	
	constructor () {
	
		this.Applications = [];
		this.Frames = [];

		this.GSEFROMSPACE = 0;
		this.GSETOSPACE = 1;
		this.MAXLEVELSIZE = 60;
		this.GSEDIRECTLINK = 1;
		this.GSENETLINK = 2;
		this.GSEHORIZONTAL = 1;
		this.GSEVERTICAL = 2;
		this.GSENORMAL = 3;

		this.GSERECT  = 1;
		this.GSEROUND = 2;
				
		
		this.Clear = function (appli_name) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return;
			appli.Nodes = [];
			appli.Links = [];
			return;
		}

		this.ClearMarkers = function (appli_name, index) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return;	   
			for (var i = 0; i < appli.Nodes.length; i++) {
				var node = 	 appli.Nodes[i];

				if (index && node.Marker == index) {
					node.Marker = 0;                
				}
				else {
					node.Marker = 0;                
				}
			}
		}

		this.FindApplication = function(appli_name) {
			for (var i = 0; i < this.Applications.length; i++) {
				if (this.Applications[i].Name == appli_name)
					return this.Applications[i];
			}
			return null;
		}

		this.CreateApplication = function(appli_name) {
			var appli  = this.FindApplication(appli_name);
			if (appli == null){ 
				appli = new application(appli_name);
				this.Applications.push(appli);
			}	
			return appli;
		}

		this.CreateSpace = function(appli_name, space_name) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return null;

			var ispace = appli.FindSpace(space_name);
			if (ispace != null)
				return space;
			
			
			ispace = new space(space_name);
			appli.Spaces.push(ispace);
		
			return space;
		}

		this.CreateLinkType = function(appli_name, linktype_name) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return null;

			var lktype = appli.FindLinkType(linktype_name);
			if (lktype != null)
				return lktype;
			
			lktype = new linktype(linktype_name);
			appli.LinkTypes.push(lktype);

			return lktype;
		}

		this.DomainLinkType = function(appli_name, linktype_name, type, space_name) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return null;

			var lktype = appli.FindLinkType(linktype_name);
			if (lktype == null)
				return null;

			var space = appli.FindSpace(space_name);
			if (space == null)
				return null;

			if (type == this.GSEFROMSPACE)
				lktype.FromSpaces.push(space);
			
			if (type == this.GSETOSPACE)
				lktype.ToSpaces.push(space);
		};

		this.LinkExist = function(from_node, to_node, lktype) {

			for (var i = 0; i < from_node.Inherit.length; i++) {
				if (from_node.Inherit[i].ToNode === to_node	&& 
					from_node.Inherit[i].LinkType === lktype)
					return true;
			}
			return false;
		}

		this.Contains = function(spaces, space) {
			for (var i = 0; i < spaces.length; i++) {
				if (spaces[i] === space)
					return true;
			}
			return false;
		}

		this.MakeLink = function(appli_name, linktype_name, from_node, to_node, afterlink) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return null;

			var lktype = appli.FindLinkType(linktype_name);
			if (lktype == null)
				return null;

			if (from_node == null || to_node == null)
				return null;
				
				
			var clink = null;
			var from_space = appli.FindSpace(from_node.Space);
			var to_space   = appli.FindSpace(to_node.Space);

			if (from_node != to_node
				&& this.LinkExist(from_node, to_node, lktype) == false
				&& this.Contains(lktype.FromSpaces, from_space)
				&& this.Contains(lktype.ToSpaces, to_space)) {

					clink = new link(lktype, from_node, to_node, afterlink);
					appli.Links.push(clink);
			}
			return clink;
		}

		this.MakeNode = function(appli_name, space_name, code, label) {
			var appli = this.FindApplication(appli_name);
			if (appli == null)
				return null;

			var space = appli.FindSpace(space_name);
			if (space == null)
				return null;
			
			var obj = new node(space, label);
			appli.Nodes.push(obj);
			return obj;
		}

		this.RemoveNode = function (application_name, object) {
			
			var appli = this.FindApplication(application_name);
			
			if (appli == null) {
				console.log ('application not recgnized')
				return false;
			}	
				   

			while (object.Inherit.length) {        
				this.RemoveLink (application_name, object.Inherit[0]);
			}
		
			while (object.Fromherit.length) {        
				this.RemoveLink (application_name, object.Fromherit[0]);
			}
			var index = appli.Nodes.indexOf (object);
			
			if (index !== -1)         
				appli.Nodes.splice(index, 1);
		
			return ;
		}	
		
		this.RemoveLink = function (appli_name, link) {
			var appli = this.FindApplication(appli_name);
			
			if (appli == null) {
				console.log ('application not recgnized')
				return false;
			}	
			
		
			let linkindex = appli.Links.indexOf (link);
			if (linkindex == -1) {
				console.log ('can not find link')
				return false;
			}

			let from_object = link.FromNode;
			let to_object   = link.ToNode;

			let fromobjindex = from_object.Inherit.indexOf (link);
			if (fromobjindex !== -1) {
				console.log ('can not find from object of link')
				return false;		
			}
			let toobjindex = to_object.Fromherit.indexOf (link);
			if (toobjindex !== -1)  {
				console.log ('can not find to object of link')
				return false;			
			}   
			appli.Links.splice(linkindex, 1);
			from_object.Inherit.splice(fromobjindex, 1);			    
			to_object.Fromherit.splice(toobjindex, 1);
			return true
		}

		this.RemoveTreeNode = function (application_name, obj) {
			
			if (!obj) return;
			
			while (obj.Inherit.length) {        
				var l = obj.Inherit[0];
				var to_object = l.ToNode;
				this.RemoveTreeNode (application_name, to_object);
			}
			this.RemoveNode (application_name, obj); 
		}


		this.modif_node1_h = function(node, modifier_sum, delta_x, delta_y,  total_width, act_width, vector_width, dist_x)	{
			if (!node.Mark) return;

			node.Mark = false;
			node.Y = node.Y + modifier_sum[0] + delta_y;
			node.X = total_width[0] + (vector_width[act_width[0]] / 2)	+ delta_x;

			if (node.Inherit.length != 0 && node.Close == 0) {
				total_width[0] = total_width[0] + dist_x + vector_width[act_width[0]];
				act_width[0] += 1;

				if (node.Modif != 0.)
					modifier_sum[0] = modifier_sum[0] + node.Modif;
		
				for (var i = 0; i < node.Inherit.length; i++) {
					node.Inherit[i].ToNode.Tag = node.Tag + "." + i.toString();
					this.modif_node1_h(node.Inherit[i].ToNode, modifier_sum,delta_x, delta_y, total_width, act_width, vector_width, dist_x);
				}	

				act_width[0] -= 1;
				total_width[0] = total_width[0]	- (dist_x + vector_width[act_width[0]]);

				if (node.Modif != 0.) {
					modifier_sum[0] = modifier_sum[0] - node.Modif;
					node.Modif = 0.;
				}
			}
		}

		this.modif_node1_v = function (node, modifier_sum, delta_x, delta_y, total_height, act_height, vector_height, dist_y) {
			if (!node.Mark) return;

			node.Mark = false;
			node.X = node.X + modifier_sum[0] + delta_x;
			node.Y = total_height[0] + (vector_height[act_height[0]] / 2) + delta_y;
		

			
			if (node.Inherit.length != 0 && node.Close == 0) {

				total_height[0] = total_height[0] + dist_y + vector_height[act_height[0]];
				act_height[0] += 1;

				if (node.Modif != 0.)
					modifier_sum[0] = modifier_sum[0] + node.Modif;

				for (var i = 0; i < node.Inherit.length; i++) {
					node.Inherit[i].ToNode.Tag = node.Tag + "." + i.toString();
					this.modif_node1_v(node.Inherit[i].ToNode, modifier_sum, delta_x, delta_y, total_height, act_height, vector_height, dist_y);
				}			
			
				act_height[0] -= 1;
				total_height[0] = total_height[0] - (dist_y + vector_height[act_height[0]]);

				if (node.Modif != 0.) {
					modifier_sum[0] = modifier_sum[0] - node.Modif;
					node.Modif = 0.;
				}
			}
		}

		this.gmng = function(node, vector_height, root_x, root_y, dist_y){

			let modifier_sum =  new Array(1);
			let total_height =  new Array(1);
			let act_height =  new Array(1);
			let delta_y = 0;
			let delta_x = 0;
			
			modifier_sum[0] = 0.;
			total_height[0] = dist_y;

			act_height[0] = 1;

			if (root_y != 0)
				delta_y = root_y - (dist_y + (vector_height[act_height[0]] / 2));
	
			
			if (root_x != 0)
				delta_x = root_x - node.X;


			node.Tag = "0";
			this.modif_node1_v(node, modifier_sum, delta_x, delta_y, total_height, act_height, vector_height, dist_y);
	
		}

		this.gmnhg = function(node, vector_width, root_x, root_y, dist_x) {

			let modifier_sum = new Array(1);
			let total_width = new Array(1);
			let act_width = new Array(1);
			let delta_y = 0;
			let delta_x = 0;
			
			modifier_sum[0] = 0.0;
			total_width[0] = dist_x;

			act_width[0] = 1;

			if (root_x != 0)
				delta_x = root_x - (dist_x + (vector_width[act_width[0]] / 2));

				if (root_y != 0)
				delta_y = root_y - node.Y;
			
			node.Tag = "0";
			this.modif_node1_h(node, modifier_sum, delta_x, delta_y, total_width, act_width, vector_width, dist_x);

		}

		this.GTTDHG = function(node, root_x, root_y, dist_x, dist_y) {

			let y_final = new Array(1);
			let y_first = new Array(1);
			let place = new Array(1);
			let act_width = new Array(1);
			let son_not_marked = new Array(1);
			let j = new Array(1);
			let modifier = new Array(this.MAXLEVELSIZE);
			let next_pos = new Array(this.MAXLEVELSIZE);
			let width_level = new Array(this.MAXLEVELSIZE);

			act_width[0] = 1;
			j[0] = -1;
			son_not_marked[0] = true;
			y_final[0] = y_first[0] = 0.0;

			for (var i = 0; i < this.MAXLEVELSIZE; i++) {
				next_pos[i] = dist_x;
				modifier[i] = 0.;
				width_level[i] = 0.;
			}

			this.find_fields_h(node, width_level, modifier, next_pos, y_final, place,
					act_width, j, y_first, dist_y, son_not_marked);

			this.gmnhg(node, width_level, root_x, root_y, dist_x);
			
			node.SetTreeNodesMark(false);
		}
		
		this.GTTDG = function (node, root_x, root_y, dist_x, dist_y) {
			var x_final = new Array(1);
			var x_first = new Array(1);
			var place = new Array(1);
			
			
			
			var act_height = new Array(1);
			var son_not_marked = new Array(1);
			var j = new Array(1);

			var modifier = new Array(this.MAXLEVELSIZE);
			var next_pos = new Array(this.MAXLEVELSIZE);
			var height_level = new Array(this.MAXLEVELSIZE);
			
			act_height[0] = 1;
			j[0] = -1;
			son_not_marked[0] = true;
			x_final[0] = x_first[0] = 0.0;

			for (var i = 0; i < this.MAXLEVELSIZE; i++) {
				next_pos[i] = dist_x;
				modifier[i] = 0.;
				height_level[i] = 0.;
			}
		
			this.find_fields_v(node, height_level, modifier, next_pos, x_final, place, act_height, j, x_first, dist_x, son_not_marked);
			
			this.gmng(node, height_level, root_x, root_y, dist_y);
			
			node.SetTreeNodesMark(false);

		}
		this.find_fields_h = function(node, width_level, modifier, next_pos, y_final, place, act_width, j, y_first, dist_y, son_not_marked) {
			if (!node.Mark) {
				
				node.Mark = true;
				son_not_marked[0] = false;
				j[0] += 1;

				if (width_level[act_width[0]] == 0.0)
					width_level[act_width[0]] = node.Width * 2;
				else
					width_level[act_width[0]] = Math.max(width_level[act_width[0]],	(node.Width * 2));

				
			
				if (node.Inherit != null && node.Close == 0) {
					var ly_first = new Array(1);
					var lson_not_marked = new Array(1);
					var lj = new Array(1);

					lj[0] = -1;
					lson_not_marked[0] = true;

					act_width[0] += 1;

					
		
					
					for (var i = 0; i < node.Inherit.length; i++)
						this.find_fields_h(node.Inherit[i].ToNode, width_level, modifier, next_pos, y_final, place, act_width, lj, ly_first, dist_y, lson_not_marked);

				
					act_width[0] -= 1;

					if (lson_not_marked[0])
						place[0] = node.Height + next_pos[act_width[0]];
					else {
							place[0] = ((ly_first[0] + y_final[0]) / 2);
							modifier[act_width[0]] = Math.max(modifier[act_width[0]], ((node.Height + next_pos[act_width[0]]) - place[0]));
							place[0] = place[0] + modifier[act_width[0]];
						}
					
					
				} /* end of if */
				
				


				if (node.Close == 1 || node.Inherit == null){
					place[0] = node.Height + next_pos[act_width[0]];
				}
				node.X = 0.;
				node.Y = place[0];
				node.Modif = modifier[act_width[0]];
				if (j[0] == 0)
					y_first[0] = place[0];
				y_final[0] = place[0];
				next_pos[act_width[0]] = place[0] + dist_y + node.Height;
			}
		}	
		this.find_fields_v = function (node, height_level, modifier, next_pos,	x_final, place, act_height, j, x_first, dist_x,	son_not_marked)	{
			if (!node.Mark) {
				node.Mark = true;
				son_not_marked[0] = false;
				j[0] += 1;

				if (height_level[act_height[0]] == 0.0)
					height_level[act_height[0]] = node.Height * 2;
				else
					height_level[act_height[0]] = Math.max(height_level[act_height[0]], (node.Height * 2));

				if (node.Inherit != null && node.Close == 0) {
					var lx_first = new Array(1);
					var lson_not_marked = new Array(1);
					var lj = new Array(1);

					lj[0] = -1;
					lson_not_marked[0] = true;

					act_height[0] += 1;

					for (var i = 0; i < node.Inherit.length; i++)
						this.find_fields_v(node.Inherit[i].ToNode, height_level, modifier, next_pos, x_final, place,	act_height, lj, lx_first, dist_x, lson_not_marked);

					act_height[0] -= 1;

					if (lson_not_marked[0])
						place[0] = node.Width + next_pos[act_height[0]];
					else {
						place[0] = ((lx_first[0] + x_final[0]) / 2);
						modifier[act_height[0]] = Math.max(modifier[act_height[0]],
								((node.Width + next_pos[act_height[0]]) - place[0]));
						place[0] = place[0] + modifier[act_height[0]];
					}
				} /* end of if */

				if (node.Close == 1 || node.Inherit == null){
					place[0] = node.Width + next_pos[act_height[0]];
				}
				node.X = place[0];
				node.Y = 0.;
				node.Modif = modifier[act_height[0]];
				if (j[0] == 0)
					x_first[0] = place[0];
				x_final[0] = place[0];
				next_pos[act_height[0]] = place[0] + dist_x + node.Width;
			}
		}	
	}
}


const gsecontainer_default_options = {
	ondragover:     ondragover_gsecontainer,
	ondragenter:    ondragenter_gsecontainer,
	ondrop:         ondrop_gsecontainer,
	onmousemove:    onmousemove_gsecontainer, 
	ondblclick:     ondblclick_gsecontainer, 
	oncontextmenu:  oncontextmenu_gsecontainer , 
	onmouseenter:   onmouseenter_gsecontainer , 
	onmouseleave:   onmouseleave_gsecontainer, 
	onmousedown:    onmousedown_gsecontainer, 
	onmouseup:      onmouseup_gsecontainer   
}

class gsecontainer {
	constructor (gse, options) {

		this.options        = defined(options) ? options : gsecontainer_default_options;
		this.CanvasId = 0;
		this.Canvas;

		this.Ratio_x = 1;
		this.Ratio_y = 1;
		this.Ratio_r = 1;
		this.Scroll_x = 0;
		this.Scroll_y = 0;

		this.Root_x = 0;
		this.Root_y = 0;

		this.Mode     = gse.GSEHORIZONTAL;
		this.LineMode = gse.GSENETLINK;
		this.NodeMode = gse.GSERECT;

		this.Viewport = 0;
		this.Visible = true;
		this.Context = null;
		

		this.GSE = gse;
		this.Width = 0;
		this.Height = 0;


		this.RootNode = null;
		this.SelectNode = null;
		this.InvertObject = null;
		this.BeginDrag = null;
		this.DragPoint_x= 0;
		this.DragPoint_y = 0;
		this.DragObject = null;
		this.xScroll = 0;
		this.yScroll = 0;
		


		this.UpdateTags = function(node) {
			for (var i = 0; i < node.Inherit.length; i++) {
				node.Inherit[i].ToNode.Tag = node.Tag + "." + i.toString();
				this.UpdateTags(node.Inherit[i].ToNode);
			}	
		}

		this.FindObject = function (appli_name, px, py, except_object) {
			
			var appli = this.GSE.FindApplication(appli_name);
			if (appli == null)
				return;	   
			
			var node;
			var foundnodes = [];
			
			for (var i = 0; i < appli.Nodes.length; i++) {
				let node = 	 appli.Nodes[i];
				let x = node.X;
				let y = node.Y;
				let width = node.Width;
				let height = node.Height;
		
				let lx = this.view_x(x - width);
				let ty = this.view_y(y - height);
				let rx = this.view_x(x + width);
				let by = this.view_y(y + height);

				if (this.in_rectangle (px, py, lx, by, rx, ty)) { 
					if (node.Visible && except_object != node) {
						foundnodes.unshift(node)
					}
				}
			}
			return (foundnodes.length != 0 ? foundnodes[0] : null);  //last element found
 		}

		this.FindNodeFromUserField = function (appliname,  userfield) {
			var appli = this.GSE.FindApplication(appliname);
			if (appli == null)
				return;	   
			
			var node;
			var foundnodes = [];
			
			for (var i = 0; i < appli.Nodes.length; i++) {
				let node = 	 appli.Nodes[i];
				if (node.UserField == userfield) {
					foundnodes.unshift(node)
				}
			}
			return (foundnodes.length != 0 ? foundnodes[0] : null);  //last element found
 		}

		this.FindNode = function (px, py) {
			var foundnodes = [];

			for (var i = 0; i < this.GSE.Applications.length; i++) {
				let appli = this.GSE.Applications[i];
				let node = this.FindObject (appli.Name, px, py);
				if (node != null) {
					foundnodes.unshift(node)
				}
			}
			return (foundnodes.length != 0 ? foundnodes[0] : null);  //last element found			
		}	
		this.UnSelect = function () {
			if (this.SelectNode) {        
				this.SelectNode.Select = 0;
				this.SelectNode = null;
			}
		}
		this.Select = function (node) {
			if (node && (node != this.SelectNode)) {
				if (this.SelectNode)
					this.SelectNode.Select = 0;
				this.SelectNode = node;
				node.Select = 1;	    
			}
		}
		
		this.SetDrawMode = function(drawmode, lineMode, nodemode) {
			if (drawmode)  this.Mode = drawmode;
			
			if (lineMode != null) this.LineMode = lineMode;

			if (nodemode != null) this.NodeMode = nodemode;
		}

		this.SetNodeMode = function(mode) {
			this.NodeMode = mode;
		}

		this.SetRootNode = function(node) {
			this.RootNode = node;
		}

		this.SetRootXY = function(x,y) {
			this.Root_x = x;
			this.Root_y = y;
		}

		
		this.view_x = function(world_x) {
			return ((world_x - this.Scroll_x) * this.Ratio_x);
		}

		this.view_y = function(world_y) {
			return ((world_y - this.Scroll_y) * this.Ratio_y);
		}

		this.view_r = function(world_r) {
			return (world_r * this.Ratio_r);
		}

		this.world_x = function(view_x) {
			return ((view_x / this.Ratio_x) + this.Scroll_x);
		}

		this.world_y = function(view_y) {
			return ((view_y / this.Ratio_y) + this.Scroll_y);
		}

		this.world_r = function(view_r) {
			return view_r / this.Ratio_r;
		}

		this.in_seg = function(x, lx, rx) {
			return x >= lx && x <= rx;
		};

		this.in_rectangle = function(x, y, lx, by, rx, ty) {
			return this.in_seg(x, lx, rx) && this.in_seg(y, ty, by);
		}

		this.inter_seg = function(lx, rx, lx1, rx1) {
			return this.in_seg(lx, lx1, rx1) || this.in_seg(lx1, lx, rx);
		}

		this.inter_rect = function(lx, ty, rx, by, lx1, ty1, rx1, by1) {
			return this.inter_seg(lx, rx, lx1, rx1) && this.inter_seg(ty, by, ty1, by1);
		}
		
		
		this.ResizeNodes = function(node, cx) {
			if (!node) return;    

			var metrics = 0;

			for (var i = 0; i < node.Name.length; i++) {
				metrics = Math.max (cx.measureText(node.Name[i]).width, metrics);
			}	
			node.Width = metrics / 2 + 8;
			
			node.Height = 10; //cx.measureText('M').width / 2 ;
			node.Height = node.Height * node.Name.length ;
			
			for (var i = 0; i < node.Inherit.length; i++) {
				let l = node.Inherit[i];
				let to_object = l.ToNode;
				this.ResizeNodes(to_object, cx);

			}
		}
		this.ReturnSize = function (node) {

			this.Width =  Math.max (this.Width, this.view_y(node.X + node.Width));
			this.Heigth = Math.max (this.Height, this.view_y(node.Y + node.Height));
		
			for (var i = 0; i < node.Inherit.length; i++) {    
				let l = node.Inherit[i];
				let to_object = l.ToNode;
				this.ReturnSize(to_object);
			}
		}

		this.ReturnGSize = function () {
			this.Canvas.width  = 0;
			this.Canvas.height = 0;

			for (var i = 0; i < this.GSE.Applications.length; i++) {
				let appli = this.GSE.Applications[i];
				for (var k = 0; k < appli.Nodes.length; k++) {
					let node = 	 appli.Nodes[k];
					this.Canvas.width =  Math.max (this.Canvas.width, this.view_y(node.X + node.Width));
					this.Canvas.height = Math.max (this.Canvas.height, this.view_y(node.Y + node.Height));					
				}
			}

		}


		this.MoveNode = function (node, delta_x, delta_y) {
			node.X += delta_x;
			node.Y += delta_y;
			
			for (var i = 0; i < node.Inherit.length; i++) {
				var l = node.Inherit[i];
				this.MoveNode (l.ToNode, delta_x, delta_y);       
			}
		}
		
		this.DragNode = function(canvas, cx, event) {
			var node = this.BeginDrag;
			
			if (!node)
				return;
			if (!event || event.srcElement != canvas)
				return;
			var x = event.offsetX - this.DragPoint_x;  //  		ccontainer.SelectNode.X - event.offsetX
			var y = event.offsetY - this.DragPoint_y;

			this.MoveNode (node, x, y);

			
			return;
			var width = node.Width;
			var height = node.Height;

			var lx = this.view_x(x - width);
			var ty = this.view_y(y - height);
			var rx = this.view_x(x + width);
			var by = this.view_y(y + height);
			var centerx = this.view_x(x);
			var centery = this.view_y(y + 4);

			if (node.Close) {
				cx.shadowBlur = 5;
				cx.strokeStyle =  '#1a73e8'; 
				cx.lineWidth = 3;            
			}
			else {
				cx.shadowBlur = 0;
				cx.strokeStyle =  '#2a486a';            

			}

			if (node.Select && !node.Marker) {
			//   cx.fillStyle = IsObjectBSelected;
				cx.fillStyle = node.Background;         
				cx.strokeStyle =  'white'; 
				cx.lineWidth = 2;
			}
			else {
				if (node == this.InvertObject) {
					cx.fillStyle = gse_invertcolor;

				}
				else 
				if (node.Marker) {    
					cx.fillStyle = node.Background;          
					cx.strokeStyle =  node.Marker; 
					cx.lineWidth = 2;               
				}
				else {
					cx.fillStyle = node.Background;
				}
			}        
			

			
			
	//       cx.shadowColor = '#ffa500';
	//       cx.shadowBlur = 5;
	//       cx.shadowOffsetX = 2;
	//       cx.shadowOffsetY = 2;
			cx.shadowColor = node.Color;
	
			if (this.NodeMode == this.GSE.GSEROUND) {
				cx.roundRect(lx, ty, rx - lx, by - ty, 20);
				cx.fill();
				cx.stroke();
			}
			else {
				cx.fillRect(lx, ty, rx - lx, by - ty);
				cx.strokeRect(lx, ty, rx - lx, by - ty);
			}
			
			cx.textAlign="center"; 
			
			if (node.Select) {   
			//  cx.fillStyle = IsObjectTSelected;
				cx.fillStyle = node.Color;          
			}
			else {
				cx.fillStyle = node.Color;
			}		
			cx.fillText(node.Name[0], centerx, centery);
			
		}

		this.DrawNode = function(node, cx) {
			if (!node.Visible) return;
			var x = node.X;
			var y = node.Y;
			var width = node.Width;
			var height = node.Height;

			var lx = this.view_x(x - width);
			var ty = this.view_y(y - height);
			var rx = this.view_x(x + width);
			var by = this.view_y(y + height);
			var centerx = this.view_x(x);
			var centery = this.view_y(y + 4);
			

//       cx.shadowColor = '#ffa500';
	//       cx.shadowBlur = 5;
	//       cx.shadowOffsetX = 2;
	//       cx.shadowOffsetY = 2;
	//		cx.shadowColor = node.Color;

	
			cx.fillStyle 	= node.Background; 
			cx.strokeStyle  = node.BorderColor;				        
			cx.lineWidth 	= node.BorderWidth;
			cx.textAlign 	= "center"; 

			if (node.Close) {
	   		    cx.fillStyle 	= gse_node_close_background; 
				cx.strokeStyle  = gse_node_close_bordercolor;
				cx.lineWidth 	= gse_node_close_borderwidth;
			}

			if (node.Select) {
				if (!node.Close) cx.fillStyle 	= gse_node_select_background; 
				cx.strokeStyle  = gse_node_select_bordercolor;
				cx.lineWidth 	= gse_node_select_borderwidth;
			}

			if (node.Marker) {    
				cx.fillStyle   = node.Background;          
				cx.strokeStyle =  node.Marker; 
				cx.lineWidth = 2;  
			}

			if (node == this.InvertObject) {
				cx.fillStyle = gse_invertcolor;
			}
	
	
			if (this.NodeMode == this.GSE.GSEROUND) {
				cx.roundRect(lx, ty, rx - lx, by - ty, 20);
				cx.fill();
				cx.roundRect(lx-0.5, ty-0.5, rx - lx + 1, by - ty + 1, 20);
				cx.stroke();
			}
			else {
				//cx.fillStyle = cx.strokeStyle
				//cx.fillRect(lx-1, ty-1, rx - lx + 2, by - ty + 2);
				//cx.fillStyle 	= node.Background; 
				
				cx.fillRect(lx, ty, rx - lx, by - ty);
				cx.strokeRect(lx-0.5, ty-0.5, rx - lx + 1, by - ty + 1);
			}

			cx.fillStyle   = node.Color; 			

			if (node.Close) {
				cx.fillStyle 	= gse_node_close_textcolor; 

		 	}
			if (node.Select) {
				if (!node.Close) cx.fillStyle 	= gse_node_select_textcolor; 
			}
		
			if (node.Name.length == 1) {
				cx.fillText(node.Name[0], centerx, centery);
			}
			else {
				for (var i = 0; i < node.Name.length; i++) {
					cx.fillText(node.Name[i], centerx, ty + 13);
					ty += 20;			
				}
			}


		}
		this.DrawLink = function(link, cx) {
				let from_object = link.FromNode;
			let to_object = link.ToNode;
			let f_w = from_object.Width;
			let t_w = to_object.Width;
			let f_h = from_object.Height;
			let t_h = to_object.Height;
			let first_x = 0;
			let first_y = 0;
			let last_x  = 0;
			let last_y  = 0;

			cx.strokeStyle = link.Color;	
			cx.lineWidth   = link.Width;

			if (from_object.Visible && to_object.Visible)
				switch (this.Mode) {
				case this.GSE.GSEHORIZONTAL:
					if (this.LineMode == this.GSE.GSEDIRECTLINK) {
						first_x = this.view_x(from_object.X);
						first_y = this.view_y(from_object.Y);
						last_x = this.view_x(to_object.X);
						last_y = this.view_y(to_object.Y);
						cx.beginPath();
						cx.moveTo(first_x, first_y);
						cx.lineTo(last_x, last_y);
						cx.stroke();
					} else if (this.LineMode == this.GSE.GSENETLINK) {
						first_x = this.view_x(from_object.X + f_w);
						first_y = this.view_y(from_object.Y);
						last_x = this.view_x(to_object.X - t_w);
						last_y = this.view_y(to_object.Y);
						cx.beginPath();
						cx.moveTo(first_x, first_y);
						cx.lineTo(first_x + 5, first_y);
						cx.stroke();
						cx.beginPath();
						cx.moveTo(first_x + 5, last_y);
						cx.lineTo(last_x, last_y);
						cx.stroke();
					}
					break;
				case this.GSE.GSEVERTICAL:
					if (this.LineMode == this.GSE.GSEDIRECTLINK) {
						first_x = this.view_x(from_object.X);
						first_y = this.view_y(from_object.Y);
						last_x = this.view_x(to_object.X);
						last_y = this.view_y(to_object.Y);
						cx.beginPath();
						cx.moveTo(first_x, first_y);
						cx.lineTo(last_x, last_y);
						cx.stroke();
					} else if (this.LineMode == this.GSE.GSENETLINK) {
						first_x = this.view_x(from_object.X);
						first_y = this.view_y(from_object.Y + f_h);
						last_x = this.view_x(to_object.X);
						last_y = this.view_y(to_object.Y - t_h);
						cx.beginPath();
						cx.moveTo(first_x, first_y);
						cx.lineTo(first_x, first_y + (last_y - first_y) / 2);
						cx.stroke();
						cx.beginPath();
						cx.moveTo(last_x, first_y + (last_y - first_y) / 2);
						cx.lineTo(last_x, last_y);
						cx.stroke();
					}
					break;
				case this.GSE.GSENORMAL:
					first_x = this.view_x(from_object.X);
					first_y = this.view_y(from_object.Y);
					last_x = this.view_x(to_object.X);
					last_y = this.view_y(to_object.Y);
					cx.beginPath();
					cx.moveTo(first_x, first_y);
					cx.lineTo(last_x, last_y);
					cx.stroke();
					break;
				}

		}
		this.DrawTreeLinks = function(node, cx) {
			if (!node.Mark) {

				var first_object = null;
				var last_object  = null;;
				node.Mark = true;

				for (var i = 0; i < node.Inherit.length; i++) {
					
					var l = node.Inherit[i];
					var to_object = l.ToNode;

					if (i == 0)  first_object = to_object;
					last_object = to_object;

					
					if (node.Close == 0) {
					//	to_object.Visible = true;
						this.DrawLink(l, cx);
						this.DrawTreeLinks(to_object, cx);
					}
					//to_object.Visible = false;
				}
				/*
				cx.strokeStyle = l.Color;
				cx.lineWidth = l.Color;
				*/
				
				if (this.LineMode == this.GSE.GSENETLINK) {
					
					var first_x, first_y, last_x, last_y;
					if (!(first_object == last_object) && node.Close == 0)
						switch (this.Mode) {
							case this.GSE.GSEHORIZONTAL: 
								first_x = this.view_x(node.X + node.Width);
								first_y = this.view_y(first_object.Y);
								last_x  = this.view_x(last_object.X - last_object.Width);
								last_y  = this.view_y(last_object.Y);
								cx.beginPath();
								cx.moveTo(first_x + 5, first_y);
								cx.lineTo(first_x + 5, last_y);
								cx.strokeStyle = gse_link_color;  
								cx.lineWidth   = gse_link_width;								  						
								cx.stroke();
							break;
							case this.GSE.GSEVERTICAL: 
								first_x = this.view_x(first_object.X);
								first_y = this.view_y(node.Y + node.Height);
								last_x = this.view_x(last_object.X);
								last_y = this.view_y(last_object.Y - last_object.Height);
								cx.beginPath();
								cx.moveTo(first_x, first_y + 5);
								cx.lineTo(last_x, first_y + 5);
								cx.strokeStyle = gse_link_color;    
								cx.lineWidth   = gse_link_width;						
								cx.stroke();
							break;
					}
				}
			}
		}

		this.DrawTreeNodes = function(node, cx) {
			if (!node.Mark) {
				node.Mark = true;
				this.DrawNode(node, cx);

				for (var i = 0; i < node.Inherit.length; i++) {
					let l = node.Inherit[i];
					let to_object = l.ToNode;

/*
					if (node.Close == 0 && node.Visible)
						to_object.Visible = true;
					else
						to_object.Visible = false;
*/
					if (node.Close == 0)  {	
						this.DrawTreeNodes(to_object, cx);
					}
				}
			}
		}

		this.DrawAllLinks = function(cx) {

			switch (this.Mode) {
				case this.GSE.GSEHORIZONTAL:
				case this.GSE.GSEVERTICAL:
					if (this.RootNode != null) {

						this.DrawTreeLinks(this.RootNode, cx);
						this.RootNode.SetTreeNodesMark(false);
					}
					break;
				case this.GSE.GSENORMAL:
					for (var i = 0; i < this.GSE.Applications.length; i++) {
						let appli = this.GSE.Applications[i];
						for (var j = 0; j < appli.Links.length; j++) {
							this.DrawLink (appli.Links[j], cx);
						}
					}
					break;
			}
		}

		this.DrawAllNodes = function(cx) {
			switch (this.Mode) {
				case this.GSE.GSEHORIZONTAL:
				case this.GSE.GSEVERTICAL:
					if (this.RootNode != null) {

						this.DrawTreeNodes(this.RootNode, cx);
						this.RootNode.SetTreeNodesMark(false);
					}
				break;
				case this.GSE.GSENORMAL:
					for (var i = 0; i < this.GSE.Applications.length; i++) {
						let appli = this.GSE.Applications[i];
						for (var j = 0; j < appli.Nodes.length; j++) {
							this.DrawNode (appli.Nodes[j], cx);
						}
					}
				break;
			}
		}
		this.CloseNode = function (node) {
			node.Close = (node.Inherit.length != 0);
		}
		
		this.CloseFirstLevel = function (node, exceptnode) {
			for (var i = 0; i < node.Inherit.length; i++) {
				let l = node.Inherit[i];
				
				let to_object = l.ToNode;
				
				if (to_object != exceptnode) {

					this.CloseNode(to_object);
				}
			}
		}
		
		this.CloseAll = function (node) {              // leaf nodes are not closed
			for (var i = 0; i < node.Inherit.length; i++) {
				let l = node.Inherit[i];
			
				let to_object = l.ToNode;
			
				this.CloseNode(to_object);
				this.CloseAll (to_object)
			}
		}

		this.setCanvasId = function(id) {
			this.CanvasId = id;
		}		

		this.ondragover 	= function (event) {
            this.options.ondragover = defined(options) && defined(options.ondragover) ? options.ondragover  : gsecontainer_default_options.ondragover;
			this.options.ondragover(event, event.target.container);
		};
		this.ondragenter 	= function (event) {
            this.options.ondragenter = defined(options) && defined(options.ondragenter) ? options.ondragenter  : gsecontainer_default_options.ondragenter;
			this.options.ondragenter(event, event.target.container);

		};
		this.ondrop 		= function (event) {
            this.options.ondrop = defined(options) && defined(options.ondrop) ? options.ondrop  : gsecontainer_default_options.ondrop;
			this.options.ondrop(event, event.target.container);

		};
		this.onmousemove 	= function (event) {
            this.options.ondragover = defined(options) && defined(options.onmousemove) ? options.onmousemove  : gsecontainer_default_options.onmousemove;
			this.options.onmousemove(event, event.target.container);

		};
		this.ondblclick 	= function (event) {
            this.options.ondblclick = defined(options) && defined(options.ondblclick) ? options.ondblclick  : gsecontainer_default_options.ondblclick;
			this.options.ondblclick(event, event.target.container);

		};
		this.oncontextmenu 	= function (event) {
            this.options.oncontextmenu = defined(options) && defined(options.oncontextmenu) ? options.ondraoncontextmenugover  : gsecontainer_default_options.oncontextmenu;
			this.options.oncontextmenu(event, event.target.container);

		};
		this.onmouseenter 	= function (event) {
            this.options.onmouseenter = defined(options) && defined(options.onmouseenter) ? options.onmouseenter  : gsecontainer_default_options.onmouseenter;
			this.options.onmouseenter(event, event.target.container);

		};
		this.onmouseleave 	= function (event) {
            this.options.onmouseleave = defined(options) && defined(options.onmouseleave) ? options.onmouseleave  : gsecontainer_default_options.onmouseleave;
			this.options.onmouseleave(event, event.target.container);

		};
		this.onmousedown 	= function (event) {
            this.options.onmousedown = defined(options) && defined(options.onmousedown) ? options.onmousedown  : gsecontainer_default_options.onmousedown;
			this.options.onmousedown(event, event.target.container);

		};
		this.onmouseup 		= function (event) {
            this.options.onmouseup = defined(options) && defined(options.onmouseup) ? options.onmouseup  : gsecontainer_default_options.onmouseup;
			this.options.onmouseup(event, event.target.container);

		};
		
		this.Refresh = function(event) {

			if (!this.CanvasId)
				return;
			let newcanvas =  document.getElementById(this.CanvasId);
			
			if (!this.Canvas || this.Canvas != newcanvas) {
				this.Canvas = newcanvas;
				if (!this.Canvas) {
					//console.log ('id Dom elt not found')
					return ;
				}
				this.Canvas.container = this;
				this.Canvas.classList.add("canvas_GSE");	
			
				this.Canvas.addEventListener("dragover", function (event) {this.container.ondragover(event)}) 
				this.Canvas.addEventListener("dragenter", function (event) {this.container.ondragenter(event)})  
				this.Canvas.addEventListener("drop", function (event) {this.container.ondrop(event)})   
				this.Canvas.addEventListener("mousemove", function (event) {this.container.onmousemove(event)})   
				this.Canvas.addEventListener("dblclick", function (event) {this.container.ondblclick(event)})     
				this.Canvas.addEventListener("contextmenu", function (event) {this.container.oncontextmenu(event)})  
				this.Canvas.addEventListener("mouseenter", function (event) {this.container.onmouseenter(event)})  
				this.Canvas.addEventListener("mouseleave", function (event) {this.container.onmouseleave(event)})  
				this.Canvas.addEventListener("mousedown", function (event) {this.container.onmousedown(event)})  
				this.Canvas.addEventListener("mouseup", function (event) {this.container.onmouseup(event)})    				
			}	


			var container = this.Canvas.parentElement;
			if (!container) return;	

	//		canvas.width  = canvas.clientWidth;
	//		canvas.height = canvas.clientHeight;

			this.SetContext(this.Canvas.getContext("2d"));

			if (this.Context == null)
				return;

			if (!this.Visible)
				return;

			if (this.RootNode == null)
				return;
			
			this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

			this.Context.font = gse_font_family;
			this.Context.fontSize  = gse_font_size;

			this.ResizeNodes(this.RootNode, this.Context);

			if (this.Mode == this.GSE.GSEHORIZONTAL) {
				this.GSE.GTTDHG(this.RootNode, this.Root_x, this.Root_y, 10., 10.);
			} else if (this.Mode == this.GSE.GSEVERTICAL) {
				this.GSE.GTTDG(this.RootNode, this.Root_x, this.Root_y, 10., 10.);
			}

			this.ReturnGSize();

			let parent = this.Canvas.parentNode;
			let parentwidth = parent.clientWidth;
			let parentheight = parent.clientHeight;


			this.Canvas.width  = Math.max (this.Canvas.width, parentwidth   - 5);
			this.Canvas.height = Math.max (this.Canvas.height, parentheight - 5);		


/*			
			this.ReturnSize (this.RootNode);
			parentwidth = parent.offsetWidth ;
			parentheight = parent.offsetHeight ;

			parentwidth = parent.getBoundingClientRect().width ;
			parentheight = parent.getBoundingClientRect().height ;

			this.Canvas.width  = Math.max (this.Width + 50, container.parentNode.clientWidth);
			this.Canvas.height = Math.max (this.Heigth+ 50, container.parentNode.clientHeight) +30;		
*/
	/*
			this.xScroll = Math.max (this.xScroll,  container.parentNode.scrollLeft);
			this.yScroll = Math.max (this.yScroll,  container.parentNode.scrollTop);

			container.parentNode.scrollLeft = this.xScroll; 
			container.parentNode.scrollTop = this.yScroll; 


			container.parentNode.scrollHeight = 246;
			container.parentNode.scrollLeft = 0;
			container.parentNode.scrollTop = 0;
			container.parentNode.scrollWidth = 392;
	*/
			this.DragNode(this.Canvas, this.Context, event);		

			this.DrawAllLinks(this.Context);
			this.DrawAllNodes(this.Context);

		}
		this.SetContext = function(cx) {
			this.Context = cx;
		}
		this.CopyNode = function (node) {
			var plabel = node.Name[0];
			var copynode = null;
			
			if (node.Space ==  "ACTION")
				copynode = this.GSE.MakeNode("RULES", "ACTION", 0, plabel);
			else
				copynode = this.GSE.MakeNode("RULES", "ATOM", 0, plabel);
		
			for (var i = 0; i < node.Inherit.length; i++) {
				var son_node = node.Inherit[i].ToNode;
				this.GSE.MakeLink ("RULES", "SESSIONLINK", copynode, this.CopyNode(son_node));
			}
			return copynode;
		}	
		
	}
}

function ondragover_gsecontainer (event, container) {
}
function ondragenter_gsecontainer (event, container) {
}
function ondrop_gsecontainer (event, container) {
}
function onmousemove_gsecontainer (event, container) { 
}

function ondblclick_gsecontainer (event, container) { 
    var node = container.FindNode(event.offsetX, event.offsetY);
   
	if (node == null) {
        return;
    }
    
	if (container.Mode == container.GSE.GSENORMAL) {
		return;
	}

	if (node.Close) {
		node.Close = false
	} else {

		container.CloseNode(node)
	}
   
	container.Refresh (event);    	
}


function oncontextmenu_gsecontainer  (event, container) { 
}
function onmouseenter_gsecontainer  (event, container) { 
}
function onmouseleave_gsecontainer (event, container) { 
}

function onmousedown_gsecontainer (event, container) { 

    var node = container.FindNode(event.offsetX, event.offsetY);
    
    if (node) {
		if  (node != container.SelectNode) {
        	container.Select (node);
			if (node.UserField) {           

			}
		}
    } else {
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

function onmouseup_gsecontainer (event, container) {
}  
