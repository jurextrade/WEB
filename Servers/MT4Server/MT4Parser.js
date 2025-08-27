var Parser = require("jison").Parser;
var fs = require('fs');





function pl(parser) {
	

	var InStringRemote;
	var StringRemote;
	var InRemoteList;
	var InModeDefun;      /* pour la gestion de variables */
	var ReturnParseSection;
	var sysaction_global;
	var section_global;
	var MainSection;
	var entity_global;
	var action_global;
	var variable_global;	
	
	
	var TabEntityAction = [];
	var niveau = 0;
	
	
	this.MX;
	this.Com;
	this.ListEntities = [];
	this.ListActions = [];
	this.ListWaitingActions = [];
	this.ListDoingActions = [];
	this.ListVariables = [];
	this.ListSystemActions = [];
	this.ListAddedActions = [];
	this.ListSections = [];
	this.ListComFunctions = [];
	this.ListClientFunctions = [];
	this.Communications = [];
	this.Clients = [];
	this.BreakPoints = [];
	this.NbSections;
	this.LastError;
	this.CurrentSection;
	this.LastActionIdentity = 0;
	this.CurrentFileName;
	this.ApplicationField;
	this.TraceProcedure;
	this.EndingProcedure;
	this.Version;
	this.MainSection;
	this.InteractiveSection;
	this.Parser = parser;
	this.Content = "";
	

	this.AddEntityToList = function (entity)
	{
	    if ((this.niveau - 1) < 0)
	    {
	        this.section_global.ListEntities.push (entity);
	        this.section_global.NbEntity++;
	    }
	    else
	    {
	        var action = this.TabEntityAction[this.niveau - 1].entity.Val;
	        action.ListParams.push (entity);
	        action.NbParam++;
	    }
	}
		
    this.FindVariableInList = function (psection, Name) {

    	for (var j = 0; j < psection.ListVariables.length; j++) {
            var variable = psection.ListVariables[j];
            if (variable.Name == Name)
                return variable;
        }
        return null;
    }
		
		
	this.CreateEntityAction = function () {
		return new plentityaction ();
		}
	
	
	this.Init = function() {
		this.CreateMainSection();
		this.CreateInteractiveSection();
		this.AddSystemActions();
		this.CreateVariable("this");

	}

	this.Parse = function (content){
   
		this.MainSection.ListEntities = [];
		this.MainSection.ListVariables = [];		
		this.MainSection.NbEntity = 0;
		this.ListSections = [];
		this.section_global = this.MainSection;
		this.niveau = 0;
		this.TabEntityAction = [];
		if (this.Clear != undefined)
		    this.Clear ();
		this.Parser.parse(content);
	}	
	
	
	
	
	
	this.CreateSection = function(name) {

		for (var i = 0; i < this.ListSections.length; i++)
			if (this.ListSections[i].Name == name)
				return null;

		section = new plsection(name);
		this.CurrentSection = section;
		this.ListSections.push(section);
		this.NbSections++;
		return section;
	}
	
	
	this.CreateMainSection = function() {
		return this.MainSection = this.CreateSection("MAIN");
	}
	
	this.CreateInteractiveSection = function() {
		return this.InteractiveSection = this.CreateSection("INTERACTIVE");
	}

	this.CreateAction = function(section, name) {
		sysaction = this.GetSysAction(name);
		if (!sysaction)
			return null;

		action = new plaction(section, sysaction, sysaction.Block);
		if (!action)
			return null;
		action.Identity = this.LastActionIdentity++;
		
		return action;
	}

	this.CreateVariable = function(Name) {
		var variable = new plvariable(Name);
		this.ListVariables.push(variable);
		return variable;
	}

	this.CreateEntity = function(val, type) {
		entity = new plentity (val, type);
		switch (type) {
		case 'PLOPERATOR' :
	        entity.Type = type;
	        entity.Val = val;
	        break;		
		case 'PLVARIABLE_BYNAME':
			entity.Type = 'PLVARIABLE';
			entity.Val = new plvariable(val);
			break;
		case 'PLVARIABLE_BYVAL':
			this.Type = 'PLVARIABLE';
			entity.Val = val;
			break;
		default:
			entity.Type = 'PLATOM';
			entity.Val = new plvalue(val, type);
			entity.Val.Defined = 'PLDEFINED'; /* atom is always defined */
			break;
		}
		return entity;
	}
	
	this.GetSection = function(name) {
		for (var i = 0; i < this.ListSections.length; i++) {
			if (this.ListSections[i].Name == name)
				return this.ListSections[i];
		}
		return null;

	}

	this.GetSysAction = function(name) {
		for (var i = 0; i < this.ListSystemActions.length; i++) {
			if (this.ListSystemActions[i].Name.toUpperCase() == name.toUpperCase())
				return this.ListSystemActions[i];
		}
		return null;

	}

	this.FindTypeFromVar = function(text) {
		var str = text.trim();
		if (this.GetSysAction(str)) {
			if (str.toUpperCase() == "DEFUN")
				return 'PLOPERATORDEFUN';
			else if (str.toUpperCase() == "REMOTE")
				return 'PLOPERATORREMOTE';
			else
				return 'PLOPERATOR';
		} else
			return 'PLVARIABLE';
	}

	this.AddSystemActions = function() {
		var ListSystemActions = this.ListSystemActions;

		ListSystemActions.push(new plsysaction("DEFUN",             'PLNoBlock',    function() {}, 1,   1,   1,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("EXECUTE",           'PLNoBlock',    function() {}, 1,  -1,  -1,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("SETQ",              'PLNoBlock',    function() {}, 2,   2,   2,  'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("IF",                'PLBlock',      function() {}, 2,  -1,  -1,  'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("NOT",               'PLNoBlock',    function() {}, 1,   1,   1,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("AND",               'PLNoBlock',    function() {}, 2,  -1,  -1,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("OR",                'PLNoBlock',    function() {}, 2,  -1,  -1,  'PLBOOLEAN'));
    	ListSystemActions.push(new plsysaction("=",                 'PLNoBlock',    function() {}, 2,   2,   2,   'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction(">",                 'PLNoBlock',    function() {}, 2,   2,   2,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("<",                 'PLNoBlock',    function() {}, 2,   2,   2,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction(">=",                'PLNoBlock',    function() {}, 2,   2,   2,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("<=",                'PLNoBlock',    function() {}, 2,   2,   2,  'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("+",                 'PLNoBlock',    function() {}, 2,  -1,  -1,  'PLFLOAT'));
		ListSystemActions.push(new plsysaction("-",                 'PLNoBlock',    function() {}, 2,  -1,  -1,  'PLFLOAT'));
		ListSystemActions.push(new plsysaction("*",                 'PLNoBlock',    function() {}, 2,  -1,  -1,  'PLFLOAT'));
		ListSystemActions.push(new plsysaction("/",                 'PLNoBlock',    function() {}, 2,  -1,  -1,  'PLFLOAT'));
		ListSystemActions.push(new plsysaction("Max",               'PLNoBlock',    function() {}, 2,   2,   2,  'PLFLOAT'));
		ListSystemActions.push(new plsysaction("Min",               'PLNoBlock',    function() {}, 2,   2,   2,  'PLFLOAT'));
		        
		// ADDED        
		ListSystemActions.push(new plsysaction("GetMonth",          'PLBlock',      function() {}, 1,  1,  1, 'PLINTEGER'));
		ListSystemActions.push(new plsysaction("GetWeek",           'PLBlock',      function() {}, 1,  1,  1, 'PLINTEGER'));
		ListSystemActions.push(new plsysaction("GetDay",            'PLBlock',      function() {}, 1,  1,  1, 'PLINTEGER'));
		ListSystemActions.push(new plsysaction("GetHours",          'PLBlock',      function() {}, 1,  1,  1, 'PLINTEGER'));
		ListSystemActions.push(new plsysaction("GetMinutes",        'PLBlock',      function() {}, 1,  1,  1, 'PLINTEGER'));

		ListSystemActions.push(new plsysaction("Pips",              'PLBlock',      function() {}, 1,  1,  1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("PipValue",          'PLBlock',      function() {}, 1,  1,  1, 'PLFLOAT'));

		
		ListSystemActions.push(new plsysaction("ELSE",              'PLBlock',      function() {}, 1,  -1,  -1, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("abs",               'PLNoBlock',    function() {}, 1,   1,   1, 'PLFLOAT'));
        
		ListSystemActions.push(new plsysaction("AndS",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
	    ListSystemActions.push(new plsysaction("AndPS",             'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("AndPTS",            'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("AndBS",             'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("AndTS",             'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
                
		ListSystemActions.push(new plsysaction("OrS",               'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("OrPS",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("OrPTS",             'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("OrBS",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
		ListSystemActions.push(new plsysaction("OrTS",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLBOOLEAN'));
                
		ListSystemActions.push(new plsysaction("SValue",            'PLNoBlock',    function() {}, 3,   3,   3, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("SPValue",           'PLNoBlock',    function() {}, 3,   3,   3, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("AndV",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("AndPV",             'PLNoBlock',    function() {}, 3,   11, -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("AndBV",             'PLNoBlock',    function() {}, 3,   11, -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("OrV",               'PLNoBlock',    function() {}, 3,   11, -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("OrPV",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("OrBV",              'PLNoBlock',    function() {}, 3,   11, -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("STime",             'PLNoBlock',    function() {}, 3,   3,   3, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("SPTime",            'PLNoBlock',    function() {}, 3,   3,   3, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("SPrice",            'PLNoBlock',    function() {}, 3,   3,  -1, 'PLFLOAT'));
		ListSystemActions.push(new plsysaction("SPPrice",           'PLNoBlock',    function() {}, 3,   3,  -1, 'PLFLOAT'));
        
		ListSystemActions.push(new plsysaction("SET",               'PLNoBlock',    function() {}, 2,   2,  2, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("START",             'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("BUY",               'PLNoBlock',    function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("SELL",              'PLNoBlock',    function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("EXIT_BUY",          'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("EXIT_SELL",         'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("EXIT",              'PLNoBlock',    function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("CLOSE_BUY",         'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("CLOSE_SELL",        'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("CLOSE",             'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("HEDGE_BUY",         'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("HEDGE_SELL",        'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("CLOSE_HEDGE_SELL",  'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("CLOSE_HEDGE_BUY",   'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
		ListSystemActions.push(new plsysaction("CLOSE_HEDGE",       'PLNoBlock',	function() {}, 0,   0,  0, 'PLNOTDEFINED'));
	}
	

	// TRACE

	this.Trace = function(text) {
		console.log (text);
	}

	this.TraceSections = function(lsection) {
		this.Trace("------ Debut Trace Arbre ------\n");
		var i;
		var j;
		ListSections = lsection;
		for (i = 0; i < lsection.length; i++) 
			this.TraceSection (lsection[i]);

		this.Trace("------ Fin Trace Arbre ------\n");
	};

	this.TraceSection = function (section) {
		this.Trace("Section [" + section.Name + "]");

		this.Trace("Nb Var.(" + section.NbVariables + ") = (");

		for (var j = 0; j < section.ListVariables.length; j++)
			this.Trace(section.ListVariables[j].Name);

		this.Trace(")\n");

		for (var j = 0; j < section.ListEntities.length; j++) {
			entity = section.ListEntities[j];
			switch (entity.Type) {
			case 'PLOPERATOR':
				this.TraceAction(entity.Val);
				break;
			case 'PLVARIABLE':
			case 'PLATOM':
				this.TraceEntity(entity);
				break;
			default:
			console.log ("???");
				break;
			}
		}
	}

	this.TraceAction = function(action) {

		this.Trace("PLOPERATOR [" + action.ActionClass.Name + " Nbr Parameters:" + action.NbParam + "]\n");

		for (var i = 0; i < action.ListParams.length; i++) {
			var entity = action.ListParams[i];

			if ((entity.Type == 'PLATOM') || (entity.Type == 'PLVARIABLE'))
				this.TraceEntity(entity);
			else if (entity.Type == 'PLOPERATOR')
				this.TraceAction(entity.Val);
			else console.log ("????");
		}
		return;
	}
	
	this.TraceEntity = function(entity) {
		var Value;

		if ((entity.Type == 'PLATOM') || (entity.Type == 'PLVARIABLE'))
			Value = entity.Val;

		if (entity.Type == 'PLATOM') {
			switch (Value.Type) {
			case 'PLNULL':
				this.Trace("PLATOM NULL\n", ind, ch);
				break;
			case 'PLINTEGER':
				this.Trace("PLATOM INTEGER [" + Value.Val + "]\n");
				break;
			case 'PLLONG':
				this.Trace("PLATOM LONG [" + Value.Val + "]\n");
				break;
			case 'PLFLOAT':
				this.Trace("PLATOM FLOAT [" + Value.Val + "]\n");
				break;
			case 'PLPOINTER':
				this.Trace("PLATOM POINTER [" + Value.Val + "]\n");
				break;
			case 'PLBOOLEAN':
				this.Trace("PLATOM BOOLEAN [" + Value.Val + "]\n");
				break;
			case 'PLDATE':
				this.Trace("PLATOM DATE [" + Value.Val + "]\n");
				break;
			case 'PLTIME':
				this.Trace("PLATOM TIME [" + Value.Val + "]\n");
				break;
			case 'PLSTRING':
				this.Trace("PLATOM STRING [" + Value.Val + "]\n");
				break;
			case 'PLCHAR':
				this.Trace("PLATOM CHAR [" + Value.Val + "]\n");
				break;
			default:
				break;
			}
		} else
			this.Trace("PLVARIABLE [" + Value.Name + " " + Value.Value.Type + "]\n");
	}
	
    this.IsValue = function (text) {
	if (text.toUpperCase() == "BID" ||
		text.toUpperCase() == "ASK" ||
		text.toUpperCase() == "POINT" ||
		text.toUpperCase() == "DIGITS" ||
		text.toUpperCase() == "SYMBOL" ||
	    text.toUpperCase() == "TIMECURRENT" ||
		text.toUpperCase() == "PERIOD")
		return true;
	return false;
    }
    
    
    this.IsVariable = function (text) {
	if (text.toUpperCase() == "Variable")
		return true;
	return false;
    }

    this.IsLogic  = function(text) {
    	if (text.toUpperCase() == "AND"  ||
    		text.toUpperCase() == "OR"   ||
    		text.toUpperCase() == "NOT"  ||
    		text.toUpperCase() == "="  ||
    		text.toUpperCase() == ">"  ||
    		text.toUpperCase() == ">="  ||
    		text.toUpperCase() == "<"  ||
    		text.toUpperCase() == "<=")
    		return  true;
    	return false;
    }
    
    this.IsBasic1Logic   = function(text) {
    	if (text.toUpperCase() == "AND"  ||
    		text.toUpperCase() == "OR"   ||
    		text.toUpperCase() == "NOT")
    		return true;
    	return false;
    }
    
    this.IsBasic2Logic   = function(text) {
    	if (text.toUpperCase() == "="  ||
    		text.toUpperCase() == ">"  ||
    		text.toUpperCase() == ">="  ||
    		text.toUpperCase() == "<"  ||
    		text.toUpperCase() == "<=")
    		return true;
    	return false;
    }
    
    
    
    this.IsMath  = function(text) {
    	if (text.toUpperCase() == "+"	|| 
    		text.toUpperCase() == "-"	||
    		text.toUpperCase() == "*"	||
    		text.toUpperCase() == "/"		||
    		text.toUpperCase() == "ABS"	||
    		text.toUpperCase() == "MIN"	||
    		text.toUpperCase() == "MAX")
    		return true;
    	return false;
    }
    
    this.IsInput  = function(text) {
    	if (text.toUpperCase() == "NUMERIC"	|| 
    		text.toUpperCase() == "TRUE/FALSE"	||
    		text.toUpperCase() == "STRING"	||
    		text.toUpperCase() == "CHAR"	||
    		text.toUpperCase() == "DATE"	||
    		text.toUpperCase() == "FIELD"	||
    		text.toUpperCase() == "VARIABLE"	||
    		text.toUpperCase() == "TIME"  ||
    		this.IsObjectInput (text))
    		return true;
    	return false;
    }
    
    this.IsNumericInput  = function(text) {
    	if (text.toUpperCase() == "NUMERIC")
    		return true;
    	return false;
    }
    
    this.IsBooleanInput   = function(text) {
    	if (text.toUpperCase() == "BOOLEAN")
    		return true;
    	return false;
    }
    
    
    
    this.IsDateInput  = function(text) {
    	if (text.toUpperCase() == "DATE" ||
    		text.toUpperCase() == "TIME")
    		return true;
    	return false;
    }
    
    this.IsFieldInput   = function(text) {
    	if (text.toUpperCase() == "FIELD")
    		return true;
    	return false;
    }
    
    this.IsLogical  = function(text) {
    	if (text.toUpperCase() == "EXECUTE")
    		return true;
    	return false;
    }
    
    
    this.IsAction  = function(text) {
	    if (text.toUpperCase() == "START"  ||
    		text.toUpperCase() == "BUY"  ||
    		text.toUpperCase() == "SELL"  ||
    		text.toUpperCase() == "EXIT_BUY"  ||
    		text.toUpperCase() == "EXIT_SELL"  ||
    		text.toUpperCase() == "EXIT"  ||
    		text.toUpperCase() == "CLOSE_BUY"  ||
    		text.toUpperCase() == "CLOSE_SELL"  ||
    		text.toUpperCase() == "CLOSE"  ||
    		text.toUpperCase() == "HEDGE_BUY"  ||
    		text.toUpperCase() == "HEDGE_SELL"  ||
    		text.toUpperCase() == "CLOSE_HEDGE_SELL"  ||
    		text.toUpperCase() == "CLOSE_HEDGE_BUY"  ||
    		text.toUpperCase() == "CLOSE_HEDGE"  ||	
    		text.toUpperCase() == "SETQ"  ||	
    		text.toUpperCase() == "SET")
		return true;
	return false;
    }
    
    this.IsActionSet  = function(text) {
    	if (text.toUpperCase() == "SETQ" ||	
    		text.toUpperCase() == "SET")
    		return true;
    	return false;
    }
    
    
    this.IsFunction = function(text) {
    	if (text.toUpperCase() == "DEFUN")
    		return true;
    	return false;
    }
    
    this.IsStatement = function(text) {
    	if (text.toUpperCase() == "IF" ||
    		text.toUpperCase() == "ELSE")
    		return true;
    	return false;
    }
    
    this.IsIfStatement = function(text) {
    	if (text.toUpperCase() == "IF")
    		return true;
    	return false;
    }
    
    this.IsElseStatement  = function(text) {
    	if (text.toUpperCase() == "ELSE")
    		return true;
    	return false;
    }
    
    this.IsFunction = function(text) {
		if (text.toUpperCase() == "DEFUN")
			return true;
		return false;
	}
		
	this.IsObjectLogic = function(text) {
		if (text.toUpperCase() == "ANDS" 
			    || text.toUpperCase() == "ANDPS"
				|| text.toUpperCase() == "ANDBS"
				|| text.toUpperCase() == "ANDTS"
				|| text.toUpperCase() == "ORS"
				|| text.toUpperCase() == "ORBS"
				|| text.toUpperCase() == "ORTS"
				|| text.toUpperCase() == "ORPS")
			return true;
		return false;
	}

    this.IsObjectLogicInput = function(text) {
    	if (text.toUpperCase() == "ANDV" 
        		|| text.toUpperCase() == "ANDPV"
        		|| text.toUpperCase() == "ANDBV"
        		|| text.toUpperCase() == "ORV"
        		|| text.toUpperCase() == "ORPV"
        		|| text.toUpperCase() == "ORBV")
    		return true;
    	return false;
    }
    
	this.IsObjectInput = function(text) {
		if (text.toUpperCase() == "SVALUE" 
			    || text.toUpperCase() == "SPVALUE"
				|| text.toUpperCase() == "STIME"
				|| text.toUpperCase() == "SPTIME"
				|| text.toUpperCase() == "SPRICE"
				|| text.toUpperCase() == "SPPRICE"
				|| text.toUpperCase() == "ANDV"
				|| text.toUpperCase() == "ANDPV"
				|| text.toUpperCase() == "ANDBV"
				|| text.toUpperCase() == "ORV"
				|| text.toUpperCase() == "ORPV"
				|| text.toUpperCase() == "ORBV")
			return true;
		return false;
	}
	
	
	this.IsSignalName = function(text) {
		for (var i = 0; i < SignalName.length; i++)
			if (text == "S_" + SignalName[i]) 
				return true;
		return false;
	}

	this.IsPeriodName = function(text) {
		for (var i = 0; i < PeriodName.length; i++)
			if (text == "P_" + PeriodName[i])
				return true;
		return false;
	}
	

    this.IsFieldOrderName = function(text) {
	    if (text.toUpperCase() == "OP_____________") 
	        return true;
	    for (var i = 0; i < OrderName.length; i++)
		    if (text.toUpperCase() == "OP_" + OrderName[i]) 
		        return true;
	return false;
    }


    this.IsFieldDirectionName = function(text) {
	    if (text.toUpperCase() == "D_____________") return true;
	    for (var i = 0; i < DirectionName.length; i++)
		    if (text.toUpperCase() == "D_" + DirectionName[i]) 
		        return true;
	return false;
    }

    this.IsFieldDirectionTypeName = function(text) {
	    if (text.toUpperCase() == "DT_____________") 
	        return true;
	    for (var i = 0; i < DirectionTypeName.length; i++)
		    if (text.toUpperCase() == "DT_" + DirectionTypeName[i]) 
		        return true;
	return false;
    }
    
    
    this.IsFieldOrderTypeName = function(text) {
	    if (text.toUpperCase() == "OT_____________")
	        return true;
	
	    for (var i = 0; i <  OrderTypeName.length; i++)
		    if (text.toUpperCase() == "OT_" + OrderTypeName[i]) 
		        return true;
	return false;
    }

    this.IsFieldRecoveryModeName = function(text) {
	    if (text.toUpperCase() == "M_____________") 
	        return true;
	
	    for (var i = 0; i < RecoveryModeName.length; i++)
		    if (text.toUpperCase() == "M_" + RecoveryModeName[i]) 
	    	    return true;
	return false;
    }
    
    
    this.IsFieldExitModeName = function(text) {
    	if (text.toUpperCase() == "EM_____________") 
	        return true;
	
	for (var i = 0; i < ExitModeName.length; i++)
		if (text.toUpperCase() == "EM_" + ExitModeName[i])
		return true;
	return false;

    }

    this.IsFieldConstantName = function(text) {
    	if (text.toUpperCase() == "DIRECTION" ||
    		text.toUpperCase() == "DIRECTION TYPE" ||
    		text.toUpperCase() == "ORDER TYPE" ||
    		text.toUpperCase() == "ORDER" ||
    		text.toUpperCase() == "RECOVERY MODE" ||
    		text.toUpperCase() == "EXIT MODE")
    		return true;
    	return (this.IsFieldDirectionName (text)     || this.IsFieldOrderName (text) ||
    		    this.IsFieldDirectionTypeName (text) || this.IsFieldOrderTypeName (text) ||
    		    this.IsFieldRecoveryModeName (text)  || this.IsFieldExitModeName (text));
    }

    this.IsConditionName = function (Text) {
    	return false;
}


    this.IsFieldName = function(text) {
    	if (text.toUpperCase() == "T_____________") 
    	return true;
    	for (var i = 0; i < FieldName.length; i++)
    		if (text.toUpperCase() == "T_" + FieldName[i])
    		return true;
        return false;
    }	
	
   
    
    this.IsObjectName = function (name) {
	    return (PG.GetObjectFromName (name));
    }


	this.CompatibleTypes = function (type1, type2) {

    	if (type1 == type2) return true;
    	else
    	if ((type1 == 'PLINTEGER' || type1 == 'PLLONG' || type1 == 'PLFLOAT') &&
    		(type2 == 'PLINTEGER' || type2 == 'PLLONG' || type2 == 'PLFLOAT'))
    		return true;
    	else
    	if ((type1 == 'PLDATE' || type1 == 'PLTIME') &&
    		(type2 == 'PLDATE' || type2 == 'PLTIME'))
    		return true;
    
    	else
    		return false;
    }
	
     this.ReturnIsNameFromObject = function  (Entity) {
    	
    	var InName = "";
    	if (!Entity) return InName;
    
    	if (Entity.Type == 'PLOPERATOR') {
    		Action = Entity.Val;
    		InName = Action.ActionClass.Name;
    		if (InName == "EXECUTE")
    		    return InName;
    //			return ((GSELabel *)pObject.Name.car).Name;
    		return (InName);
    	}
    	else {
    
    		Value = Entity.Val;
    		if (Entity.Type == 'PLATOM') {	
    			switch (Value.Type) {
    				case 'PLINTEGER' :
    				case 'PLLONG' :
    				case 'PLFLOAT' :
    					InName = "Numeric";
    				break;
    				case 'PLBOOLEAN' :
    					InName = "True/False";
    				break;
    				case 'PLDATE'   :
    					InName = "Date";
    				break;
    				case 'PLTIME'   :
    					InName = "Time";
    				break;
    				case 'PLSTRING' :
    					InName = "Text";
    				break;
    				case 'PLCHAR'   :
    					InName = "Char";
    				break;
    				default :
    				break;
    			}
    		}
    		else
    		if (Entity.Type == 'PLFIELD')
    			InName = "Field";
    		else
    		if (Entity.Type == 'PLVARIABLE')
    			InName = "Variable";
    	}
    	return InName;
    }	

	

    this.ReturnValue = function (Value) {
    	var s = "";
        
    	if (!Value.Defined)   {
            s =  "0";
            return s;
        }
        
        switch (Value.Type) {
            
    		case 'PLNULL' :
    			s = "null";
    		break;
    		
    		case 'PLINTEGER' :
    		case 'PLLONG' :
    			s = (Value.Val ? Value.Val : "0");
    		break;
    
    		case 'PLFLOAT' :
    			s = (Value.Val ? Value.Val : "0.0");
    		break;
    		case 'PLPOINTER' :
    			s = Value.Val;
    		break;
    		
    		case 'PLBOOLEAN' :
    			if (Value.Val)
    				s = "true";
    			else
    				s = "false";
    		break;
    		
    		case 'PLTIME' :
    			s = "ReturnTime(\"" + (Value.Val ? Value.Val : "00:00:00")  + "\")";
    		break;
    		
    		case 'PLDATE'   :
    			s = "ReturnDate(\"" + (Value.Val ? Value.Val : "01/01/1970") + "\")";
    		break;
    		
    		case 'PLSTRING'   :
    			s =  "\"" + (Value.Val ? Value.Val : "") + "\"";
    		break;
    		
    		case 'PLCHAR'   :
    			s =  "\'" + (Value.Val ? Value.Val : "") + "\'";
    		break;
        }
        return s;
    }

    this.ReturnType = function (pVariable) {
    	var s = "";
    	var Value = null;
    
    	Value = pVariable.Value;
        if (!Value)  {
            return "?";
        }
        if (!Value.Defined)   {
            s =  "double";
            return s;
        }
        switch (Value.Type) 	{
    		case 'PLNULL' :
    			s= "null";
    		break;
    		case 'PLINTEGER' :
    		case 'PLLONG' :
    		case 'PLFLOAT' :
    			s = "double";
    		break;
    		case 'PLPOINTER' :
    			s = "Pointer";
    		break;
    		case 'PLBOOLEAN' :
    			 s = "bool";
    		break;
    		case 'PLSTRING' :
    			 s = "std::string";
    		break;
     		case 'PLDATE'   :
     		case 'PLTIME'   :
    			s = "datetime";
    		break;
     		case 'PLCHAR'   :
    			s="char";
    		break;
    	}
        return s;
    }
    
	

    this.ReturnVariableValueType = function (Variable) {
	    if (this.IsValue (Variable.Name)) 	{
		    var Text = Variable.Name;
    		if (Text.toUpperCase() == "BID" || Text.toUpperCase() == "ASK" || Text.toUpperCase() == "POINT" || Text.toUpperCase() == "DIGITS")
    			return 'PLFLOAT';
    		else
    		if (Text.toUpperCase() == "SYMBOL")
    			return 'PLSTRING';
    		else
    		if (Text.toUpperCase() == "TIMECURRENT") 
    			return 'PLTIME';
    		else
    		if (Text.toUpperCase() == "PERIOD") 
    			return 'PLINTEGER';
    	}	
    	else
    	if (this.IsFieldName (Variable.Name) ||
    		this.IsFieldConstantName (Variable.Name)) 	{
    		return 'PLFLOAT';
    	}	
    	else
    	if (this.IsSignalName (Variable.Name)) {
    		return 'PLFLOAT';
    	}	
    	else
    	if (this.IsObjectName (Variable.Name)) {
    		return 'PLFLOAT';
    	}	
    	if (this.IsPeriodName (Variable.Name)){
    		return 'PLFLOAT';
    	}	
	    return 'PLNOTDEFINED';
    }


    this.ReturnVariableType = function(Variable) {
        
    	if (this.IsValue (Variable.Name)) {
    		return 'PLVALUE';
    	}	
    	else
    	if (this.IsFieldName (Variable.Name)) {
    		return 'PLFIELD';
    	}	
    	else
    	if (this.IsFieldExitModeName (Variable.Name)) {
    		return 'PLFIELDEXITMODE';
    	}	
    	else
    	if (this.IsFieldRecoveryModeName (Variable.Name)) {
    		return 'PLFIELDRECOVERYMODE';
    	}	
    	else
    	if (this.IsFieldDirectionName (Variable.Name)) {
    		return 'PLFIELDDIRECTION';
    	}	
    	else
    	if (this.IsFieldDirectionTypeName (Variable.Name)) {
    		return 'PLFIELDDIRECTIONTYPE';
    	}	
    	else
    	if (this.IsFieldOrderTypeName (Variable.Name)) {
    		return 'PLFIELDORDERTYPE';
    	}	
    	else
    	if (this.IsFieldOrderName (Variable.Name)) {
    		return 'PLFIELDORDER';
    	}	
    	else
    	if (this.IsSignalName (Variable.Name)) {
    		return 'PLSIGNAL';
    	}	
    	else
    	if (this.IsObjectName (Variable.Name))	{
    		return 'PLOBJECT';
    	}	
    	if (this.IsPeriodName (Variable.Name)){
    		return 'PLPERIOD';
    	}	
    	return 'PLVARIABLE';
    }
	
	    
    
    this.ParseRepairEntity = function (pentity) {
	if (pentity.Type == 'PLVARIABLE')	{
		pentity.Type = PL.ReturnVariableType (pentity.Val);
	}
	else
	if (pentity.Type == 'PLOPERATOR')
	{
        var pAction = pentity.Val;
        for (var j = 0; j < pAction.ListParams.length; j++) 	{
			var Entity = pAction.ListParams[j];
			Entity.FatherAction = pAction;
			this.ParseRepairEntity (Entity);
		}
	}
}    
    
    this.ParseRepair = function (pSection, type) {

        var pentity;
    	var ListEntities;
    
    	if (pSection) 
    		ListEntities =  pSection.ListEntities;
    	else
    		ListEntities =  PL.MainSection.ListEntities;
    /*
    	if (type == 0 || type == IDIC_OBJECT)
    		m_Dependencies.RemoveAll ();
    	if (type == 0 || type == IDIC_CONDITION)
    		m_LDependencies.RemoveAll ();
    */
        for (var j = 0; j < ListEntities.length; j++) 	{
            pentity = ListEntities[j];
    		this.ParseRepairEntity (pentity);
        }
    }
    

	this.ParseSections = function (Operation, pSection, Error, StrErr) {

	    this.ParseRepair (pSection);

        var pentity;
    	var ListEntities;
    
    	if (pSection) 
    		ListEntities =  pSection.ListEntities;
    	else
    		ListEntities =  PL.MainSection.ListEntities;
    
        for (var j = 0; j < ListEntities.length; j++) 	{
    		this.ParseEntity (Operation, ListEntities[j], Error, StrErr);
        }
    }


    this.ParseEntity = function (Operation, pentity, Error, StrErr) {
        var Entity;
        var Value;
    	var InName = "";
    
    
    	if (pentity.Type != 'PLOPERATOR') {
    		var Value = pentity.Val;
    		if (pentity.FatherAction == null) {
    			if (Error[0] == 0)	{
    				Error[0] = 36;
    				StrErr[0] =  "[line :" +  pentity.LineNumber + "] Error (" + Error[0] + ") str (ERROR Obsolete Expression)";
    			}
    		}
    		else
    		if (pentity.Type == 'PLATOM' && Value.Type == 'PLCHAR' && Value.Val == "") {
    			if (Error[0] == 0) {
    				Error[0] = 35;
    				pentity.FatherAction.Error = Error[0];
    				StrErr[0] =  "[line :" + pentity.FatherAction.LineNumber + "] Error (" + Error[0] + ") str (" + pentity.FatherAction.ActionClass.Name + " Empty Character)";
    			}
    		}
    		return;
    	}
    	else {
    		var pAction    = pentity.Val;
    		var pSysAction = pAction.ActionClass;
    		InName =  pAction.ActionClass.Name;
    		

    	//ERROR EXECUTE
    
    		if (this.IsLogical (InName)) {
    			
    			var pEntity = pAction.ListParams[0];
    			var pValue = pEntity.Val;
    			var pSection = this.GetSection (pValue.Val);
    			
    			if (pValue.Val == "Close")
    			{
    				pSysAction =  SCGetAddedAction (psc, "Close");
    				pAction.ActionClass = pSysAction;
    				InName =  pAction.ActionClass.Name;
    				//ListRemove (&pAction.ListParams, pAction.ListParams.car);
     			}
    		}
    
    		if (PL.IsLogical (InName)) {
    			var pEntity = pAction.ListParams[0];
    			var pValue = pEntity.Val;
    			var pLogical = PG.GetConditionFromName (pValue.Val);
    			if (!pLogical) {
    				if (Error[0] == 0) {
    					Error[0] =21;
    					pAction.Error = Error[0];
        				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Condition not defined)";
    				}
    			}
    			else
    			if (pAction.NbParam != 1) {
    				if (Error[0] == 0)	{
    					Error[0] = 22;
    					pAction.Error = Error[0];
        				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Conditions don't support Parameters in this version)";
    				}
    			}
    
    		}	
    		if (!(PL.IsAction (InName) || PL.IsIfStatement (InName)) && 
    			  (pentity.FatherAction == null))	{           // && m_Type == T_EDITOR)
    			if (Error[0] == 0)	{
    				Error[0] = 23;
    				pAction.Error = Error[0];
    				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Conditions don't support Parameters in this version)";
    			}
    		}
    		else
    		if ((InName.toUpperCase() == "BUY"       ||
    			InName.toUpperCase() == "EXIT_BUY"  ||
    			InName.toUpperCase() == "CLOSE_BUY" ||
    			InName.toUpperCase() == "HEDGE_BUY" ||
    			InName.toUpperCase() == "HEDGE_CLOSE_BUY") &&
    			Operation == OP_SELL) {
    			if (Error[0] == 0) {
    				Error[0] = 24;
    				pAction.Error = Error[0];
    				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Using BUY Action in an SELL Operation Session)";
    			}
    		}
    		else
    		if((InName.toUpperCase () == "SELL"  ||
    			InName.toUpperCase () == "EXIT_SELL"   ||
    			InName.toUpperCase () == "CLOSE_SELL"  ||
    			InName.toUpperCase () == "HEDGE_SELL"  ||
    			InName.toUpperCase () == "HEDGE_CLOSE_SELL") &&
    			Operation == OP_BUY) {
    			if (Error[0] == 0) {
    				Error[0] = 25;
    				pAction.Error = Error[0];
    				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Using SELL Action in an BUY Operation Session)";

    			}
    		}
    		
    		if (pSysAction.NbrPar != -1) {
    			if (pAction.NbParam != pSysAction.NbrPar) {
    				if (Error[0] == 0) {
    					Error[0] = 26;
    					pAction.Error = Error[0];
        				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Number of Parameters)";
    				}
    			}
    		}
    		else {
    			if (pSysAction.MinPar != -1) {
    				if (pAction.NbParam < pSysAction.MinPar) {
    					if (Error[0] == 0){
    						Error[0] = 27;
    						pAction.Error = Error[0];
            				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Minimum Number of Parameters)";
    					}
    				}
    			}
    			if (pSysAction.MaxPar != -1)
    			{
    				if (pAction.NbParam > pSysAction.MaxPar)
    				{
    					if (Error[0] == 0)
    					{		
    						Error[0] = 28;
    						pAction.Error = Error[0];
            				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Maximum Number of Parameters)";
    					}
    				}
    			}
    		}
    		if (InName.toUpperCase () == "SET") {

    			if (pAction.ListParams.length != 0) {
    				var Entity =  pAction.ListParams[0];
    				if (Entity.Type != 'PLVARIABLE' && Entity.Type != 'PLFIELD') {
    					if (Error[0] == 0)	{		
    						Error[0] = 29;
    						pAction.Error = Error[0];
            				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " First Parameter must be either a Variable or Session Field)";
    					}
    				}
    			}
    
    		}
    		else
    		if (InName.toUpperCase () == "SETQ") {

    			if (pAction.ListParams.length != 0) {
    				var Entity =  pAction.ListParams[0];
    				if (Entity.Type != 'PLVARIABLE') {
    					if (Error[0] == 0)	{		
    						Error[0] = 29;
    						pAction.Error = Error[0];
            				StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " First Parameter must be a Variable)";
    					}
    				}
    				else	{
    					var pVariable = Entity.Val;
    					var pValue = pVariable.Value;
    					if (pAction.ListParams.length > 1)  {
    	
    						var sEntity =  pAction.ListParams[1];
    						if (sEntity.Type == 'PLATOM')	{
    							var sValue = sEntity.Val;
    							pValue.Type = sValue.Type;
    							pValue.Defined = 1;
    						}
    						else
    						if (sEntity.Type == 'PLVARIABLE') {
    							var pVariable1 = sEntity.Val;
    							var pValue1 = pVariable1.Value;
    							pValue.Type = pValue1.Type;
    							pValue.Defined = pValue1.Defined;
    
    						}
    						else
    						if (sEntity.Type == 'PLOPERATOR')
    						{
    							var pAction = sEntity.Val;
    							pValue.Type	= pAction.ActionClass.ReturnType;
    							pValue.Defined = 1;
    
    						}
    						else   // SCFIELD SCVALUE .....
    						{
    							var pVariable1 = sEntity.Val;
    							var Type = this.ReturnVariableValueType (pVariable1);
    							pValue.Type = Type;
    							pValue.Defined = 1;
    						}
    					}
    				}
    			}
    		}
    		else
    		if (this.IsObjectLogicInput (InName))	{
    			var pFatherAction = pentity.FatherAction;
    
    			if (!this.IsBasic2Logic (pFatherAction.ActionClass.Name)) {
    				if (Error[0] == 0) 	{		
    					Error[0] = 36;
    					pAction.Error = Error[0];
                    	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + pFatherAction.ActionClass.Name + " Invalid Parameters AndV or OrV. (With AndV and OrV only comparaisons are allowed)";
    				}
    			}			
    			var pParameters = pFatherAction.ListParams;
    
    			while (pParameters) 	{
    				Entity = pParameters.car;
    				if (Entity != pentity && Entity.Type == 'PLOPERATOR' &&  this.IsObjectLogicInput (Entity.Val.ActionClass.Name))
    				if (Error[0] == 0) {		
    					Error[0] = 30;
    					pAction.Error = Error[0];
                    	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Logic comparaison between 2 AndV or OrV )";
    				}
    
    				pParameters = pParameters.cdr;
    			}
    
    		}
    		else
    		if (PL.IsStatement (InName)) {

    			var nbrcond = 0;
    			var nbrparam = 0;
    			var elsepos = -1;
    			var LastAction = null;
    			var FirstBoolean = false;
	            for (var i = 0; i < pAction.ListParams.length; i++)	{

    				Entity = pAction.ListParams[i];
    				nbrparam++;
    				if (Entity.Type == 'PLOPERATOR') {
    					if (this.IsObjectLogic (Entity.Val.ActionClass.Name) || 
    						this.IsLogic (Entity.Val.ActionClass.Name))
    					 nbrcond++;
    					else
    					if (this.IsLogical (Entity.Val.ActionClass.Name)) {
    						var pEntity = Entity.Val.ListParams[0];
    						var pValue = pEntity.Val;
    
    						pLogical = PG.GetConditionFromName (pValue.Val);
    						if (pLogical)
    							nbrcond++;
    					}
    					else
    					if (this.IsStatement (InName) && this.IsElseStatement (Entity.Val.ActionClass.Name))
    						elsepos = nbrparam;
    					LastAction = Entity.Val;
    				}
    				else {
    					var pValue = Entity.Val;
    					if (Entity.Type == 'PLVARIABLE') {
    						var pVariable1 = pValue;
    						pValue = pVariable1.Value;
    					}	
    					if (pValue.Type == 'PLBOOLEAN' && nbrparam == 1) 
    					    FirstBoolean = true;
    					
    					if (!this.IsIfStatement (InName) || FirstBoolean == false)	{
    						if (Error[0] == 0) {		
    							Error[0] = 37;
    							pAction.Error = Error[0];
    	                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid parameter)";
    						}
    					}
    					else
    					if (nbrparam > 1)	{
    						if (Error[0] == 0) {		
    							Error[0] = 38;
    							pAction.Error = Error[0];
    	                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Parameter: Must be a an action or a statement)";
    						}
    					}
    				}
    				if (Error[0] == 0 && (this.IsIfStatement (InName) && nbrcond > 1))	{		
    					Error[0] = 31;
    					pAction.Error = Error[0];
                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Statement: More than one condition in Statement, Use And or Or between conditions)";
    				}
    				if (Error[0] == 0 && (this.IsElseStatement (InName) && nbrcond > 0))				
    				{		
    					Error[0] = 39;
    					pAction.Error = Error[0];
                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Statement: Condition not allowed in Statement)";
    				}
    
    				if (Error[0] == 0 && (this.IsIfStatement (InName) && FirstBoolean == false && nbrcond != 1))
    				{		
    					Error[0] = 32;
    					pAction.Error = Error[0];
                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Statement: First parameter must return a Boolean (true, false)";
    				}
    			}
    			
    			if (Error[0] == 0 && (elsepos != -1  && elsepos != nbrparam))
    			{		
    				Error[0] = 3;
    				LastAction.Error = Error[0];
                  	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Statement: Invalid Last Parameter after Else Statement)";
    			}
    
    
    		}
    		else
    		if (this.IsBasic2Logic (InName) || this.IsMath (InName)) {
    			var type1;
    			var type2;
    			var nbparam = 0;
	            for (var i = 0; i < pAction.ListParams.length; i++)	{
	                
    				var Entity = pAction.ListParams[i];
    				if (Entity.Type == 'PLATOM')	{
    					var pValue = Entity.Val;
    					if (nbparam == 0) type1 = pValue.Type;
    					else type2 = pValue.Type;
    				}
    				else
    				if (Entity.Type == 'PLVARIABLE')	{
    				    var pVariable = Entity.Val;
    					var pValue = pVariable.Value;
    					if (nbparam == 0) type1 = pValue.Type;
    					else type2 = pValue.Type;
    				}
    				else
    				if (Entity.Type == 'PLOPERATOR')	{
    					var pAction = Entity.Val;
    					if (nbparam == 0) type1 = pAction.ActionClass.ReturnType;
    					else type2 = pAction.ActionClass.ReturnType;
    				}
    				else   // SCFIELD SCVALUE .....
    				{
    					var pVariable = Entity.Val;
    					var Type = this.ReturnVariableValueType (pVariable);
    					if (nbparam == 0) type1 = Type;
    					else type2 = Type;
    				}
    				nbparam++;
    			}
    			if (type1 == 'PLPOINTER')	{
    				if (Error[0] == 0)	{		
    					Error[0] = 33;
    					pAction.Error = Error[0];
                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Variable Undefined. Initialisation Setq must precede current expression)";
    				}
    			}
    
    			if (nbparam > 1 && !this.CompatibleTypes (type1, type2))	{
    				if (Error[0] == 0)	{		
    					Error[0] = 34;
    					pAction.Error = Error[0];
                      	StrErr[0] =  "[line :" +  pAction.LineNumber + "] Error (" + Error[0] + ") str (" + InName + " Invalid Type parameters)";
    				}
    			}
    		}
            for (var i = 0; i < pAction.ListParams.length; i++)	{
    			var Entity = pAction.ListParams[i];
    			Entity.FatherAction = pAction;
    			this.ParseEntity (Operation, Entity, Error, StrErr);
    		}
    	}
    }
	
	
    this.WCI = function (ToName, FromName)  {
    	if (this.IsObjectLogic (ToName))
    	{
    		return false;
    	}
    	else
    	if(this.IsBasic1Logic (ToName))
    	{
    		return (
    		this.IsLogic (FromName)		||
    		this.IsObjectLogic(FromName) ||
    		this.IsConditionName(FromName));
    	}
    	else
    	if (this.IsBasic2Logic(ToName))
    	{
    		return (
    		this.IsObjectLogic(FromName) || 
    		this.IsValue (FromName)			  ||	
    		this.IsMath (FromName)			  ||
    		(this.IsInput (FromName) && !this.IsObjectLogic(FromName)));
    	}
    	else
    	if (this.IsObjectInput (ToName))
    	{
    		return false;
    	}
    	else
    	if (this.IsMath(ToName))
    	{
    		return (
    		this.IsMath (FromName) || 
    		this.IsValue (FromName) ||
    		(this.IsInput (FromName) && !this.IsObjectLogic(FromName)));
    
    	}
    	else
    	if (this.IsActionSet(ToName)) 
    	{
    		return (
    	  	 (this.IsConditionName(FromName) && ToName.toUpperCase() != "SETQ") ||
    		 (this.IsFieldConstantName (FromName) && ToName.toUpperCase() != "SET") || 
    		 this.IsValue (FromName) ||
    		 this.IsMath (FromName)  ||
    		 (this.IsInput (FromName) && !this.IsObjectLogic(FromName)));
    	}
    	else
    	if (this.IsStatement (ToName))
    	{
    		return (
             (this.IsConditionName(FromName) && this.IsIfStatement (ToName)) ||
    		 this.IsStatement (FromName) ||
    		 this.IsAction (FromName)		 ||
    		 this.IsLogic (FromName)		 ||
    		 this.IsObjectLogic(FromName));
    
    	}
    	else
    		return false;
    }
	
    this.InsertObject = function (gse, FromObject, ObjectToInsert)   {
    	
    	var NameToInsert  = ObjectToInsert.Name[0];
    	var OnName  = FromObject.Name[0];
    	var FName;
    	
    	
    	var ToEntity = ObjectToInsert.UserField;	
    	if (ToEntity && ToEntity.Type == 'PLOPERATOR')	{
    		Action = ToEntity.Val;
    		NameToInsert = Action.ActionClass.Name;
    	}
    		
    	if (this.IsIfStatement (OnName))	{
    		var Link = FromObject.Inherit[0];    // first link
    
    		if (this.IsLogic (NameToInsert) || this.IsObjectLogic (NameToInsert) || this.IsConditionName (NameToInsert))    // check first argument
    		{
    			if (!Link)  // No arguments so insert link
    			{
    				gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert);
    			}
    			else
    			{
    				var ToEntity = Link.ToNode.UserField;	
    				if (ToEntity.Type == 'PLOPERATOR')
    				{
    					FName = ToEntity.Val.ActionClass.Name;
    				}
    				else
    				{	
    					FName = FromObject.Name[0];          // name
    				}
    				if (!this.IsLogic (FName) && !this.IsObjectLogic (FName))  // first argument is not logic so insert at first
    				{
    					gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, 0);
    				}
    				else
    				if (this.IsBasic1Logic (NameToInsert))                 // first argument is logic and we insert AND OR NOT
    				{
    				    
                        gse.RemoveLink("RULES", Link);
                    	gse.MakeLink ("RULES", "SESSIONLINK", Link.FromNode, ObjectToInsert);
	                    gse.MakeLink ("RULES", "SESSIONLINK", ObjectToInsert, Link.ToNode);    				    
    					//gse.InsertObjectAfter (pObjectToInsert, Link, NULL);      
    				}
    				else
    				{
    					gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, 0);  // insert at beginning 
    				}
    			}
    		}
    		else
    		if (this.IsElseStatement (NameToInsert)) {
    			var Link = FromObject.Inherit[FromObject.Inherit.length - 1];                   // .length - 1last link
    			gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, Link);
    		}
    		else	{
    		    
    			var LastlinK = Link;
		    	
		    	for (var i = 0; i < FromObject.Inherit.length; i++)	{
    				var linK = FromObject.Inherit[i];
    				FName =  FromObject.Inherit[i].ToNode.Name[0];          // name
    				if (this.IsElseStatement (FName))                           //Insert before Else if any
    				{
    					gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, LastlinK != Link ? LastlinK : null);
    					return;
    				}
    				LastlinK = linK;
    			}
    			gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert);
    		}
    	}
    	else
    		gse.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert);

    }
	
//////////////////////////////////GENERATE SS CODE FROM TREE ////////////////////////////////////////////////////////////////////////////////////
	
	this.SSFromTree = function (container, Object) {

        
    	if (!Object) return;
    
    
    	if (Object != container.RootNode) {
    		if (Object.Space.Name == "ACTION") {
    			this.Content = this.Content + "("; 
    		}
    		this.Content = this.Content + Object.Name[0];
    	}
    
    	for (var i = 0; i < Object.Inherit.length; i++)	{
    		this.Content += " ";
            this.SSFromTree (container, Object.Inherit[i].ToNode);
        }
        
    	if (Object != container.RootNode) {
    		if (Object.Space.Name == "ACTION")	{
    			this.Content = this.Content + ")\n"; 
    		}
    	}
    }

	this.Init();
}





function plsection(name) {
	this.Name = name;
	this.ListEntities = [];
	this.NbEntity = 0;
	this.ListVariables = []; /* list of variables located in section */
	this.NbVariables = 0;
	this.FileName = "";
	this.LineNumber = 0;
}

function plsysaction(name, blockmode, actionfunction, minpar, maxpar, nbrpar, returntype) {
	this.PL;
	this.Name = name;
	this.Block = blockmode;
	this.ExecuteBefore;
	this.ExecuteWhenDone;
	this.MinPar = minpar;
	this.MaxPar = maxpar;
	this.NbrPar = nbrpar;
	this.ReturnType = returntype;
	this.ActionProcedure = actionfunction;
}

function plaction(section, actionclass, block) {
	this.Section = section;
	this.ActionClass = actionclass;
	this.ExecCondition = null;
	this.Identity;
	this.Persistency = false;
	this.Block = block;
	this.ListParams = [];
	this.NbParam = 0;
	this.State = 'PLNOTTODO';
	this.Error =	0;
	this.Value =  new plvalue(null, 'PLPOINTER');
	this.ExecuteBefore = null;
	this.ExecuteWhenDone = null;
	this.ExecuteCondition = null; /* WHEN WHILE repeat actions */
	this.Com;
	this.LineNumber;
	this.UserField;
}
function plentityaction() {
	
	this.entity = null;
	this.remoteaction = false;
};

function pldependency() {
	this.Identity;
	this.Persistency;
	this.Com;
}

function plentity(val, type) {
	this.Type = type; /* PLVARIABLE PLACTION PLATOM */
	this.Val = val; /* pointer to Value type */
	this.RootAction = null;
	this.FatherAction = null; /* may be null */
	this.LineNumber;


}

function plvariable(name) {
	this.Name = name;
	this.Sharable = null;
	this.Exportable = null;
	this.Value = new plvalue(null, 'PLPOINTER');
	this.SetEntity = null;
	this.LineNumber;
}

function plvalue(val, type) {
	this.Type = 'PLPOINTER';
	this.Defined = 'PLNOTDEFINED';
	this.Size = 0; /* atom size */
	this.Val = null; /* atom value */
	this.Dependency = [];

	this.PutValue = function(val, type) {
		this.Type = type;
		switch (type) {
		case 'PLNULL': {
			this.Val = null;
			this.Size = 0;
		}
			break;
		case 'PLINTEGER':
		case 'PLLONG':
		case 'PLFLOAT': {
			this.Val = val;
			this.size = 4;
		}
			break;
		case 'PLPOINTER':
			this.Val = val;
			this.Size = 4;
			break;
		case 'PLBOOLEAN': {

			if (val.toLocaleUpperCase() == "FALSE")
				this.Val = 0;
			else
				this.Val = 1;
			this.Size = 4;
		}
			break;

		case 'PLSTRING':
		case 'PLDATE':
		case 'PLTIME':
		case 'PLCHAR':

			if (val) {
				this.Val = val;
				this.Size = this.Val.length + 1;
			}
			break;

		}
		return this.Val;
	}
	this.PutValue(val, type);
}
function generatefile(filename) {
    var parserSource = parser.generate();
    fs.writeFile(filename, parserSource, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var grammar = {
    "comment": "PL Parser",
    "author": "Gabriel Jureidini",

    "lex": {
        "macros": {
            "sign": "[-]",
            "exp": "[eE]",
            "dec": "[0-9]",
            "var1": "[a-zA-Z_][~a-zA-Z0-9_]*",
            "var2": "[<>][=]*",
            "var3": "[/*+-=]",
            "com": "//.*",
            "string": "[\"][^\"]*[\"]",
            "char": "['][^']*[']",
            "null": "null|NULL",
            "true": "true|TRUE",
            "false": "false|FALSE",
            "dd": "({dec}{2})",
            "dddd": "({dec}{4})",
            "int": "{sign}?{dec}+",
            "long": "{sign}?{dec}+[L]",
            "float": "({sign}?({dec}{1,9})[.]({dec}{1,9})({exp}{sign}?({dec}{1,2}))?)",
            "time": "{dd}:{dd}:{dd}",
            "date": "{dd}[/]{dd}[/]{dddd}",
            "var": "{var1}|{var2}|{var3}",
            "openpar": "[(]",
            "closepar": "[)]",
            "operatordefun": "defun|DEFUN",
            "operatorremote": "remote|REMOTE"

        },
        "rules": [
	            	["{operatordefun}", "{ PL.Trace('>Lex  : defun ' + yytext); 	    return 'PLOPERATORDEFUN';}"],
	    			["{operatorremote}", "{ PL.Trace('>Lex  : remote '+ yytext); 	    return 'PLOPERATORREMOTE';}"],
	    			["{com}", "{ PL.Trace('>Lex  : commentaire '); }"],
	    			["{string}", "{ PL.Trace('>Lex  : string '+ yytext); 	    return 'PLSTRING';}"],
	    			["{char}", "{ PL.Trace('>Lex  : char '+ yytext);   	        return 'PLCHAR';}"],
	    			["{time}", "{ PL.Trace('>Lex  : time '+ yytext); 		    return 'PLTIME';}"],
	    			["{date}", "{ PL.Trace('>Lex  : date '+ yytext); 		    return 'PLDATE';}"],
	    			["{float}", "{ PL.Trace('>Lex  : float '+ yytext); 	        return 'PLFLOAT';}"],
	    			["{long}", "{ PL.Trace('>Lex  : long '+ yytext); 	 	    return 'PLLONG';}"],
	    			["{int}", "{ PL.Trace('>Lex  : integer '+ yytext);          return 'PLINTEGER';}"],
	    			["{null}", "{ PL.Trace('>Lex  : null '+ yytext); 		    return 'PLNULL';}"],
	    			["{true}", "{ PL.Trace('>Lex  : true '+ yytext); 		    return 'PLBOOLEAN';}"],
	    			["{false}", "{ PL.Trace('>Lex  : false '+ yytext); 	        return 'PLBOOLEAN';}"],
	    			["{var}", "{ var a; PL.Trace('>Lex  : var '+ yytext + ' ' +  (a = PL.FindTypeFromVar (yytext))); return a;}"],
	    			["{openpar}", "{ PL.Trace('>Lex  : OP '+ yytext); 	        return 'PLOPENPAR';}"],
	    			["{closepar}", "{ PL.Trace('>Lex  : CP '+ yytext); 	        return 'PLCLOSEPAR';}"],
	    			["[ \\n\\t\\r]", "{  	}"],
	    			[".", "{ PL.Trace('>Lex  : error ' +  yytext + yylineno);   return 'PLERROR';}"]
	    			]
    },
    "tokens": "PLCOMMENT PLSTRING PLCHAR PLINTEGER PLLONG PLFLOAT PLNULL PLBOOLEAN PLDATE PLTIME PLVAR PLOPENPAR PLCLOSEPAR PLERROR PLOPERATORREMOTE PLOPERATORDEFUN PLOPERATOR",

    "bnf": {
        "program": [
					["", ""],
					["program object", "{PL.Trace ('--- Yacc --- object ' + $2);        PL.MainSection.ListEntities.push (PL.entity_global); PL.MainSection.NbEntity++; PL.section_global = PL.MainSection;}"],
					["program statement", "{PL.Trace ('--- Yacc --- statement ' + $2);  PL.MainSection.ListEntities.push (PL.entity_global); PL.MainSection.NbEntity++; PL.section_global = PL.MainSection;}"],
					["program function", "{PL.Trace ('--- Yacc --- function ' + $2);    PL.section_global.ListEntities.push (PL.entity_global);}"]
					         	],

        "function": [
					["PLOPENPAR operator_defun PLOPENPAR PLCLOSEPAR funclist PLCLOSEPAR", "{PL.Trace ('>Yacc : FUNCTION DEFINED '+ $2);} "],
					["PLOPENPAR operator_defun PLOPENPAR paramlist PLCLOSEPAR funclist PLCLOSEPAR", "{PL.Trace ('>Yacc : FUNCTION DEFINED '+ $2);}" ]
					           	 ],

        "operator_defun": [
					["PLOPERATORDEFUN operator_defun_name",                 "PL.section_global = PL.CreateSection ($2, PL.CurrentFileName);" +
                                                                            "PL.InModeDefun = 1;"]
					                  ],

        "paramlist": ["object_var_local",
						  		  "paramlist object_var_local"],

        "funclist": [
					["object",                                              "{PL.AddEntityToList (PL.entity_global);PL.Trace('ajout a la liste object avec niveau ' + PL.niveau);}"],
					["statement",                                           "{PL.AddEntityToList (PL.entity_global);PL.Trace('ajout a la liste stqtement avec niveau ' + PL.niveau);}"],
					["funclist object",                                     "{PL.AddEntityToList (PL.entity_global);PL.Trace('ajout a la liste  niveau ' + PL.niveau);}"],
					["funclist statement",                                  "{PL.AddEntityToList (PL.entity_global);PL.Trace('jout a la liste  niveau ' + PL.niveau);}"],
								 ],
                                
        "statement": [
					["PLOPENPAR operator PLCLOSEPAR",                       "{PL.Trace ('>Yacc : PLOPENPAR operator PLCLOSEPAR ' + $1 + $2 + $3); " +
					               											"PL.niveau--; " +
						  		   											"PL.entity_global = PL.TabEntityAction[PL.niveau].entity;}"],

					
                    ["PLOPENPAR operator statlist PLCLOSEPAR",              "{PL.Trace ('>Yacc : PLOPENPAR operator statlist PLCLOSEPAR ' + $1 + $2 + $3 + $4); " +
						  		   									        "PL.niveau--; " +
						  		   									        "PL.entity_global = PL.TabEntityAction[PL.niveau].entity;}"],
					
                    ["PLOPENPAR operator_remote object_var remotelist PLCLOSEPAR", ""],
					["PLOPENPAR operator_remote statement remotelist PLCLOSEPAR", ""],
						  		 ],


        "operator": [
					["operator_defun_name",                                 "{PL.Trace ('>Yacc : PLUSERACTION ' + $1); }"],
					
                    ["PLOPERATOR",                                          "{PL.Trace ('>Yacc : PLSYSACTION ' + $1);" +
					      		  											"PL.action_global = PL.CreateAction (PL.section_global, $1);" +
					      		   											"PL.action_global.LineNumber = yylineno;" +
 				      		   												"PL.entity_global = PL.CreateEntity(PL.action_global, 'PLOPERATOR');" +
					                        								"PL.TabEntityAction[PL.niveau] = PL.CreateEntityAction();" +
					                        								"PL.TabEntityAction[PL.niveau].entity       = PL.entity_global;" +
																			"PL.TabEntityAction[PL.niveau].actionremote  = false;" +
																			"PL.niveau++;}"
					]
					      		 ],
        "operator_defun_name": [
					["PLVARIABLE",                                          "{PL.Trace ('>Yacc : FUNCTION NAME ' + $1);" +
					                        								"PL.action_global = PL.CreateAction (PL.section_global, 'EXECUTE');" +
					                        								"PL.action_global.LineNumber = yylineno;" +
					                        								"PL.entity_global = PL.CreateEntity($1, 'PLSTRING');" +
					                        								"PL.action_global.ListParams.push (PL.entity_global);" +
					                        								"PL.action_global.NbParam++;" +
					                        								"PL.entity_global = PL.CreateEntity(PL.action_global, 'PLOPERATOR');" +
					                        								"PL.TabEntityAction[PL.niveau] = PL.CreateEntityAction();" +
																			"PL.TabEntityAction[PL.niveau].entity       = PL.entity_global;" +
																			"PL.TabEntityAction[PL.niveau].actionremote  = false;" +
																			"PL.niveau++;}"
			        ]
					                      ],
        "operator_remote": [
                    ["PLOPERATORREMOTE", "{ }"]
					              ],

        "remotelist": [
					["object",                                              "{InRemoteList--;}"],
					["statement",                                           "{InRemoteList--;}"],
					["function",                                            "{InRemoteList--;}"],
					["remotelist object",                                   "{InRemoteList--;}"],
					["remotelist statement",                                "{InRemoteList--;}"],
					["remotelist function",                                 "{InRemoteList--;}"]
								 ],

        "statlist": [
					["object",                                              "{PL.AddEntityToList (PL.entity_global);}"],
					["statement",                                           "{PL.AddEntityToList (PL.entity_global);}"],
					["statlist object",                                     "{PL.AddEntityToList (PL.entity_global);}"],
					["statlist statement",                                  "{PL.AddEntityToList (PL.entity_global);}"]
								 ],
        "object": [
				    ["object_var", "{PL.Trace ('>Yacc : object_var ' + $1);}"],
				    ["PLINTEGER",  "{PL.Trace ('>Yacc : PLINTEGER ' + $1);PL.entity_global = PL.CreateEntity($1, 'PLINTEGER');$$ =  PL.entity_global;}"],
				    ["PLLONG",     "{PL.Trace ('>Yacc : PLLONG ' + $1);   PL.entity_global = PL.CreateEntity($1, 'PLLONG');   $$ =  PL.entity_global;}"],
				    ["PLFLOAT",    "{PL.Trace ('>Yacc : PLFLOAT ' + $1);  PL.entity_global = PL.CreateEntity($1, 'PLFLOAT');  $$ =  PL.entity_global;}"],
				    ["PLBOOLEAN",  "{PL.Trace ('>Yacc : PLTRUE ' + $1);   PL.entity_global = PL.CreateEntity($1, 'PLBOOLAN'); $$ =  PL.entity_global;}"],
				    ["PLSTRING",   "{PL.Trace ('>Yacc : PLSTRING ' + $1); PL.entity_global = PL.CreateEntity($1, 'PLSTRING'); $$ =  PL.entity_global;}"],
				    ["PLCHAR",     "{PL.Trace ('>Yacc : PLCHAR ' + $1);   PL.entity_global = PL.CreateEntity($1, 'PLCHAR');   $$ =  PL.entity_global;}"],
				    ["PLTIME",     "{PL.Trace ('>Yacc : PLTIME ' + $1);   PL.entity_global = PL.CreateEntity($1, 'PLTIME');   $$ =  PL.entity_global;}"],
				    ["PLDATE",     "{PL.Trace ('>Yacc : PLDATE ' + $1);   PL.entity_global = PL.CreateEntity($1, 'PLDATE');   $$ =  PL.entity_global;}"],
				    ["PLNULL",     "{PL.Trace ('>Yacc : PLNULL ' + $1);   PL.entity_global = PL.CreateEntity($1, 'PLNULL');   $$ =  PL.entity_global;}"],
					         	  ],
        "object_var": [
                    ["PLOPERATOR",                                              "if (($1).toUpperCase() == 'CLOSE') " +
                                                                                "{PL.Trace ('>Yacc : PLVARIABLE ' + $1);" +
                                                                                "PL.entity_global = PL.CreateEntity ($1, 'PLVARIABLE_BYNAME');" +
                                                                                "PL.entity_global.LineNumber = yylineno;" +
                                                                                "PL.MainSection.ListVariables.push(PL.entity_global.Val);" +
                                                                                "PL.MainSection.NbVariables++;}  "],
                    ["PLVARIABLE",                                          "{PL.Trace ('>Yacc : PLVARIABLE ' + $1);" +
					              											"var variable = PL.FindVariableInList (PL.section_global, $1);" +
																			"if (!variable) {" +
    					              											"PL.entity_global = PL.CreateEntity ($1, 'PLVARIABLE_BYNAME');" +
    					               											"PL.entity_global.LineNumber = yylineno;" +
    					               											"PL.section_global.ListVariables.push(PL.entity_global.Val);" +
    					               											"PL.section_global.NbVariables++;}" +
    					               										"else {" +
        					               										"PL.entity_global = PL.CreateEntity (variable, 'PLVARIABLE_BYVAL');" +
                                                            					"PL.entity_global.LineNumber = yylineno;}}"]
					             ],

        "object_var_local": ["PLVARIABLE"]
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var parser = new Parser(grammar);
PL = new pl(parser);



//PL.Parse("(defun Breakout_Big_Candle_M15_Bear () (AND (> (abs (SValue BAR S_PREVIOUS P_M15)) (* (SValue ATR_14 S_PREVIOUS P_M15) 1.7)) (< (SValue LOW S_CURRENT P_M15) (SValue LOW S_PREVIOUS P_M15))))");
PL.Parse("(setq a 2) (if (< c 2) (setq b 5))");
//PL.TraceSection (PL.ListSections[0]);

//PL.Parse("(setq a 2)");
PL.TraceSection (PL.MainSection);

generatefile ("plparser.js");