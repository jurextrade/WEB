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
	this.PG = null;
	this.ListEntities = [];
	this.ListActions = [];
	this.ListWaitingActions = [];
	this.ListDoingActions = [];
	this.ListVariables = [];
	this.ListConditions = [];
	this.ListIndicators = [];
	
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
	this.SCContent = "";


	this.Parse = function (pg, content){
   
        this.PG = pg;
        
		this.MainSection.ListEntities = [];
		this.MainSection.ListVariables = [];			
		this.MainSection.ListConditions = [];
		this.MainSection.ListIndicators = [];
		this.MainSection.ListActions = [];

		this.MainSection.NbEntity = 0;
		this.MainSection.NbVariables = 0;

		this.ListSections   = [];
		this.section_global = this.MainSection;
		this.niveau         = 0;
		this.TabEntityAction = [];
        
		if (this.Clear != undefined)
		    this.Clear ();
		return (this.Parser.parse(content));
	}	

	
	this.ParseEngine = function (engine) {
	    var Error = [0];
        var StrErr = [""];
    	
    	engine.Indicators = [];
    	engine.Periods  = [];
    	engine.Actions = [];
    	engine.Signals  = [];
	    
	    var pg = engine.PG;

/*------------------------------ CALL TO PARSER ----------------------------------------*/	    
	    var result = this.Parse (pg, engine.SCContent);
        
        if (result == -1000) {
            Error[0] = 2;
            return;          
        }
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    
            

	    this.ParseSections (engine.Operation, null, Error, StrErr);
		
		if (Error[0] != 0) {
            StrErr.push (engine);
    	    Project_ParseError(StrErr);
	    }
	    else {
    	    Project_ParseError("", -1);
	    }

    	for (var i= 0; i < this.MainSection.ListIndicators.length; i++) {
    	    var entity = this.MainSection.ListIndicators[i];
    	    
    	    var object = entity.Val.Name.IsObjectName (this.PG);    
    
            if (!object) 
                continue;

    	    var periods = entity.ListPeriods;

            if (!engine.Indicators.includes (object.Id))    	        
        	    engine.Indicators.push (object.Id);

            if (entity.Signal) {
                var signalid =  pg.GetSignalIdFromName(entity.Signal.Val.Name.substring(2));
                
                if (signalid != null && !engine.Signals.includes (signalid)) {    
                    engine.Signals.push (signalid);
                    if (signalid == S_RCROSSED) {
                        if (!engine.Signals.includes (S_CURRENT))  
                            engine.Signals.push (S_CURRENT);
                        if (!engine.Signals.includes (S_PREVIOUS))  
                            engine.Signals.push (S_PREVIOUS);
                    }
                }
            }

    	    for (var j = 0; j < periods.length; j++)
                if (!engine.Periods.includes (eval (periods[j].Val.Name)))    	        
        	        engine.Periods.push (eval (periods[j].Val.Name));
    	}
    	
//actions 
        for (var i = 0; i < this.MainSection.ListActions.length; i++) {
            if (!engine.Actions.includes (this.MainSection.ListActions[i].Val.ActionClass.Name))
                engine.Actions.push (this.MainSection.ListActions[i].Val.ActionClass.Name);
        }

//condition
        for (var i = 0; i < this.MainSection.ListConditions.length; i++) {
            var conditionname = this.MainSection.ListConditions[i].Val.Val;
    	    var condition = pg.GetConditionFromName (conditionname);
      	    this.ParseCondition (condition);

            if (!engine.Conditions.includes (condition))    	        
        	    engine.Conditions.push (condition);

            for (var j= 0; j < condition.Conditions.length; j++) {
                if (!engine.Conditions.includes (condition.Conditions[j]))    	        
            	    engine.Conditions.push (condition.Conditions[j]);
			}


        	for (var j= 0; j < condition.Indicators.length; j++) {
                if (!engine.Indicators.includes (condition.Indicators[j]))    	        
            	    engine.Indicators.push (condition.Indicators[j]);
			}
				
        	for (var j= 0; j < condition.Signals.length; j++) {
                if (!engine.Signals.includes (condition.Signals[j])) { 	        
            	    engine.Signals.push (condition.Signals[j]);
                    if (condition.Signals[j] == S_RCROSSED) {
                        if (!condition.Signals.includes (S_CURRENT))  
                            condition.Signals[j].push (S_CURRENT);
                        if (!condition.Signals.includes (S_PREVIOUS))  
                            condition.Signals[j].push (S_PREVIOUS);
                    }
                }
			}
				
				
            for (var j = 0; j < condition.Periods.length; j++) {
                if (!engine.Periods.includes (condition.Periods[j]))    	        
        	        engine.Periods.push (condition.Periods[j]);				
            }
        }
        
        
        if (engine.Periods.length != 0) {
            engine.MinPeriod = Math.min.apply(null, engine.Periods);
            engine.MaxPeriod = Math.max.apply(null, engine.Periods);
        } else {
            engine.MinPeriod =  engine.MaxPeriod = null;
        }          
        return (Error[0]);
	}
	
    this.ParseMarker = function (marker) {
	    var Error = [0];
        var StrErr = ["", 0];
    	
    	marker.Indicators = [];
    	marker.Periods = [];
    	marker.Signals  = [];
    	

        var pg = marker.PG;
        
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    
        var result = this.Parse (pg, marker.SCContent);
        
        if (result == -1000) {
            Error[0] = 2;
            return;          
        }
/*------------------------------ CALL TO PARSER ----------------------------------------*/	    

        marker.Section = this.MainSection;
        
        this.ParseSections (marker.Operation, null, Error, StrErr);
		
		if (Error[0] != 0) {
            StrErr.push (marker);
    	    Marker_ParseError(StrErr);
	    }
	    else {
    	    Marker_ParseError("", -1);
	    }


    	for (var i= 0; i < marker.Section.ListIndicators.length; i++) {
            var entity = marker.Section.ListIndicators[i];
    	    var object = entity.Val.Name.IsObjectName (this.PG);      

            if (!object)
                continue;
                
    	    var periods = entity.ListPeriods;

    
            if (!marker.Indicators.includes (object.Id))    	        
        	    marker.Indicators.push (object.Id);

            if (entity.Signal) {
                var signalid =  pg.GetSignalIdFromName(entity.Signal.Val.Name.substring(2));
                if (signalid != null  && !marker.Signals.includes (signalid)) {	                 
                    marker.Signals.push (signalid);
                    if (signalid == S_RCROSSED) {
                        if (object.Cross != "") {
                            var cobject = pg.GetObjectFromName (object.Cross); 
                            if (cobject) {
                                if (!marker.Indicators.includes (cobject.Id))    	        
        	                        marker.Indicators.push (cobject.Id);
                            }    
                        }
                        if (!marker.Signals.includes (S_CURRENT))  
                            marker.Signals.push (S_CURRENT);
                        if (!marker.Signals.includes (S_PREVIOUS))  
                            marker.Signals.push (S_PREVIOUS);
                    }
                }
            }


    	    for (var j = 0; j < periods.length; j++)
                if (!marker.Periods.includes (eval(periods[j].Val.Name)))    	        
        	        marker.Periods.push (eval(periods[j].Val.Name));
    	}

        if (marker.Periods.length != 0) {
            marker.MinPeriod = Math.min.apply(null, marker.Periods);
            marker.MaxPeriod = Math.max.apply(null, marker.Periods);
        } else {
            marker.MinPeriod =  marker.MaxPeriod = null;
        }    
        
        
        return (Error[0]);
	}
	
	this.ParseCondition = function (condition) {
	    
	    var Error = [0];
        var StrErr = ["", 0];
    	
    	condition.Indicators = [];
    	condition.Periods = [];
    	condition.Signals = [];
    	
    	var pg = condition.PG;
    	
	    this.ParseSections (null, condition.Section, Error, StrErr);
		
		if (Error[0] != 0) {
    	    parser.yy.parseError(StrErr[0]);
	    }

    	for (var i= 0; i < condition.Section.ListIndicators.length; i++) {
            var entity = condition.Section.ListIndicators[i];
    	    var object = entity.Val.Name.IsObjectName (this.PG);      
    
            if (!object) 
                continue;


    	    var periods = entity.ListPeriods;

            if (!condition.Indicators.includes (object.Id))    	        
        	    condition.Indicators.push (object.Id);

            if (entity.Signal) {
                var signalid =  pg.GetSignalIdFromName(entity.Signal.Val.Name.substring(2));
                if (signalid != null  && !condition.Signals.includes (signalid)) {   	                
                    condition.Signals.push (signalid);
                    if (signalid == S_RCROSSED) {
                        
                        if (!condition.Signals.includes (S_CURRENT))  
                            condition.Signals.push (S_CURRENT);
                        if (!condition.Signals.includes (S_PREVIOUS))  
                            condition.Signals.push (S_PREVIOUS);
                    }
                }                    
            }



    	    for (var j = 0; j < periods.length; j++)
                if (!condition.Periods.includes (eval(periods[j].Val.Name)))    	        
        	        condition.Periods.push (eval(periods[j].Val.Name));
    	}
    
        for (var i = 0; i < condition.Section.ListConditions.length; i++) {
            var conditionname = condition.Section.ListConditions[i].Val.Val;
    	    var soncondition = pg.GetConditionFromName (conditionname);
      	    this.ParseCondition (soncondition);
            if (!condition.Conditions.includes (soncondition))    	        
        	    condition.Conditions.push (soncondition);
        }
    
        return (Error[0]);
	}
			

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
			entity.Type = 'PLVARIABLE';
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

	this.SCFromSection = function (section, no_defun) {
		let scstring = '';

		no_defun ? no_defun = no_defun : no_defun = false;

		if (no_defun == false) {
			scstring += '(defun ';
			scstring += section.Name  + ' () ';
		}	

		for (var j = 0; j < section.ListEntities.length; j++) {
			let entity = section.ListEntities[j];
			switch (entity.Type) {
				case 'PLOPERATOR':
					scstring += this.SCFromAction(entity.Val);
				break;
				case 'PLVARIABLE':
				case 'PLATOM':
					scstring += this.TraceEntity(entity);
				break;
				default:
					console.log ("???");
				break;
			}
		}
		if (no_defun == false) {		
			scstring += ')';	
		}
		return scstring;	
	}

	this.SCFromAction = function(action) {
		let scstring = '';
	    scstring += '(' + action.ActionClass.Name + ' ';
		
		for (var i = 0; i < action.ListParams.length; i++) {
			var entity = action.ListParams[i];

			if ((entity.Type == 'PLATOM') || (entity.Type == 'PLVARIABLE')){
				scstring += this.SCFromEntity(entity); 
				scstring += (i == action.ListParams.length - 1 ? '' : ' ');
			}
			else 
			if (entity.Type == 'PLOPERATOR') {
				scstring += this.SCFromAction(entity.Val);
			}

			else console.log ("????");
		}
		scstring += ')';
		return scstring;
	}
	
	this.SCFromEntity = function(entity) {
		if (entity.Type == 'PLATOM') {
			return entity.Val.Val;
		} else {
			return entity.Val.Name;
		}
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
    					InName = Value.Val;
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
    			InName = Entity.Val.Name;
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

    this.ReturnType = function (type, pVariable) {
    	var s = "";
    	var Value = null;
    
    	Value = pVariable.Value;
        if (!Value)  {
            return "?";
        }
        if (type == JS_GENERATION)
            return "var";
            
            
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
	    if (Variable.Name.IsValue ()) 	{
		    var Text = Variable.Name;
    		if (Text.toUpperCase() == "BID" || Text.toUpperCase() == "ASK" || Text.toUpperCase() == "POINT" || Text.toUpperCase() == "DIGITS")
    			return 'PLFLOAT';
    		else
    		if (Text.toUpperCase() == "SYMBOL")
    			return 'PLSTRING';
    		else
    		if (Text.toUpperCase() == "CURRENTTIME") 
    			return 'PLTIME';
    		else
    		if (Text.toUpperCase() == "CURRENTPERIOD") 
    			return 'PLINTEGER';
    	}	
    	else
    	if (Variable.Name.IsFieldName () ||
            Variable.Name.IsFieldConstantName ()) 	{
    		return 'PLFLOAT';
    	}	
    	else
    	if (Variable.Name.IsSignalName ()) {
    		return 'PLFLOAT';
    	}	
    	else
    	if (Variable.Name.IsObjectName (this.PG)) {
    		return 'PLFLOAT';
    	}	
    	if (Variable.Name.IsPeriodName ()){
    		return 'PLFLOAT';
    	}	
	    return 'PLNOTDEFINED';
    }

    this.ReturnVariableType = function(Variable) {
        
    	if (Variable.Name.IsValue (Variable.Name)) {
    		return 'PLVALUE';
    	}	
    	else
    	if (Variable.Name.IsFieldName ()) {
    		return 'PLFIELD';
    	}	
    	else
    	if (Variable.Name.IsFieldExitModeName ()) {
    		return 'PLFIELDEXITMODE';
    	}	
    	else
    	if (Variable.Name.IsFieldRecoveryModeName ()) {
    		return 'PLFIELDRECOVERYMODE';
    	}	
    	else
    	if (Variable.Name.IsFieldDirectionName ()) {
    		return 'PLFIELDDIRECTION';
    	}	
    	else
    	if (Variable.Name.IsFieldDirectionTypeName ()) {
    		return 'PLFIELDDIRECTIONTYPE';
    	}	
    	else
    	if (Variable.Name.IsFieldOrderTypeName ()) {
    		return 'PLFIELDORDERTYPE';
    	}	
    	else
    	if (Variable.Name.IsFieldOrderName ()) {
    		return 'PLFIELDORDER';
    	}	
    	else
    	if (Variable.Name.IsSignalName ()) {
    		return 'PLSIGNAL';
    	}	
    	else
    	if (Variable.Name.IsObjectName (this.PG))	{
    		return 'PLOBJECT';
    	}	
    	if (Variable.Name.IsPeriodName ()){
    		return 'PLPERIOD';
    	}	
    	return 'PLVARIABLE';
    }
    
    this.ParseRepairEntity = function (psection, pentity) {
    	if (pentity.Type == 'PLVARIABLE')	{
    		pentity.Type = this.ReturnVariableType (pentity.Val);
            if (pentity.Type != 'PLVARIABLE')	{
                var found = false;
    			if (pentity.Type == 'PLOBJECT') {
    				for (var i = 0; i < psection.ListIndicators.length; i++) { 
    					if (psection.ListIndicators[i].Val.Name == pentity.Val.Name) {
    						found = false;   // always push 
    						break;
    					}
    				}
    				if (!found) 
                        psection.ListIndicators.push (pentity);
    			}
    			else
    			if (pentity.Type == 'PLPERIOD') {
    	            if (pentity.FatherAction && (pentity.FatherAction.ActionClass.Name.IsObjectLogic () || pentity.FatherAction.ActionClass.Name.IsObjectInput ())) {
            	         pentity.FatherAction.ListParams[0].ListPeriods.push (pentity);
            	    }    		
    			}
    			else
    			if (pentity.Type == 'PLSIGNAL') {
    	            if (pentity.FatherAction && (pentity.FatherAction.ActionClass.Name.IsObjectLogic () || pentity.FatherAction.ActionClass.Name.IsObjectInput ())) {
            	         pentity.FatherAction.ListParams[0].Signal = pentity;
            	    }    		
    			}
    			
    			for (j = 0; j < psection.ListVariables.length; j++) {
                    if (psection.ListVariables[j].Name ==  pentity.Val.Name) {
                        psection.ListVariables.splice(j, 1);
                        break;
                    }
    			}
    		}		
	
    	}
    	else
    	if (pentity.Type == 'PLOPERATOR')	{
            var pAction = pentity.Val;
        	if (pAction.ActionClass.Name.IsAction() ) {
			
				var found = false;
			    for (var i = 0; i < psection.ListActions.length; i++) { 
					if (psection.ListActions[i].Val == pentity.Val) {
						found = false;
						break;
					}
				}
				if (!found)   
				    psection.ListActions.push (pentity);
        	} else             
        	if (pAction.ActionClass.Name == "EXECUTE") {
        			var pEntity = pAction.ListParams[0];
        			var pValue =  pEntity.Val;
        			var pLogical = this.PG.GetConditionFromName (pValue.Val);
        
        			if (pLogical) {
        				var found = false;
    				    for (var i = 0; i < psection.ListConditions.length; i++) { 
        					if (psection.ListConditions[i].Val.Val == pValue.Val) {
        						found = false;
        						break;
        					}
        				}
        				if (!found)   
        				    psection.ListConditions.push (pEntity);
        			}
    		}        
            for (var j = 0; j < pAction.ListParams.length; j++) 	{
    			var Entity = pAction.ListParams[j];
    			Entity.FatherAction = pAction;
    			this.ParseRepairEntity (psection, Entity);
    		}
    	}
    }    
    
    this.ParseRepair = function (pSection, type) {

        if (!pSection)
	        pSection =  this.MainSection;

        for (var j = 0; j < pSection.ListEntities.length; j++) 	{
    		this.ParseRepairEntity (pSection, pSection.ListEntities[j]);
        }
    }

	this.ParseSections = function (Operation, pSection, Error, StrErr) {

        if (!pSection)
	        pSection =  this.MainSection;
	        
	    this.ParseRepair (pSection);

        for (var j = 0; j <  pSection.ListEntities.length; j++) 	{
    		this.ParseEntity (Operation, pSection.ListEntities[j], Error, StrErr);
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
    				StrErr[0] =  ["Error (" + Error[0] + ") : (ERROR Obsolete Expression, )", pentity.LineNumber];
    			}
    		}
    		else
    		if (pentity.Type == 'PLATOM' && Value.Type == 'PLCHAR' && Value.Val == "") {
    			if (Error[0] == 0) {
    				Error[0] = 35;
    				pentity.FatherAction.Error = Error[0];
    				StrErr[0] =  ["Error (" + Error[0] + ") : (" + pentity.FatherAction.ActionClass.Name + " Empty Character, )", pentity.FatherAction.LineNumber];
    			}
    		}
    		return;
    	}
    	else {
    		var pAction    = pentity.Val;
    		var pSysAction = pAction.ActionClass;
    		InName =  pAction.ActionClass.Name;
    		
    	//ERROR EXECUTE
    
    		if (InName.IsLogical ()) {
    			
    			var pEntity = pAction.ListParams[0];
    			var pValue = pEntity.Val;
    			var pSection = this.GetSection (pValue.Val);
    			
    			if (pValue.Val == "Close")
    			{
    				pSysAction =  SCGetAddedAction (psc, "Close");
    				pAction.ActionClass = pSysAction;
    				InName =  pAction.ActionClass.Name;
    				//interface_ArrayRemove (&pAction.ListParams, pAction.ListParams.car);
     			}
    		}
    
    		if (InName.IsLogical ()) {
    			var pEntity = pAction.ListParams[0];
    			var pValue = pEntity.Val;
    			var pLogical = this.PG.GetConditionFromName (pValue.Val);
    			if (!pLogical) {
    				if (Error[0] == 0) {
    					Error[0] =21;
    					pAction.Error = Error[0];
        				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Condition not defined)", pAction.LineNumber];
    				}
    			}
    			else
    			if (pAction.NbParam != 1) {
    				if (Error[0] == 0)	{
    					Error[0] = 22;
    					pAction.Error = Error[0];
        				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Conditions don't support Parameters in this version)", pAction.LineNumber];
    				}
    			}
    
    		}
/*    		
    		if (!(this.IsAction (InName) || this.IsIfStatement (InName)) && 
    			  (pentity.FatherAction == null))	{           // && m_Type == T_EDITOR)
    			if (Error[0] == 0)	{
    				Error[0] = 23;
    				pAction.Error = Error[0];
    				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Conditions don't support Parameters in this version)", pAction.LineNumber];
    			}
    		}
    		else
*/    		
    		if ((InName.toUpperCase() == "BUY"       ||
    			InName.toUpperCase() == "EXIT_BUY"  ||
    			InName.toUpperCase() == "CLOSE_BUY" ||
    			InName.toUpperCase() == "HEDGE_BUY" ||
    			InName.toUpperCase() == "HEDGE_CLOSE_BUY") &&
    			(Operation && Operation == OP_SELL)) {
    			if (Error[0] == 0) {
    				Error[0] = 24;
    				pAction.Error = Error[0];
    				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Using BUY Action in an SELL Operation Session)", pAction.LineNumber];
    			}
    		}
    		else
    		if((InName.toUpperCase () == "SELL"  ||
    			InName.toUpperCase () == "EXIT_SELL"   ||
    			InName.toUpperCase () == "CLOSE_SELL"  ||
    			InName.toUpperCase () == "HEDGE_SELL"  ||
    			InName.toUpperCase () == "HEDGE_CLOSE_SELL") &&
    			(Operation && Operation == OP_BUY)) {
    			if (Error[0] == 0) {
    				Error[0] = 25;
    				pAction.Error = Error[0];
    				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Using SELL Action in an BUY Operation Session)", pAction.LineNumber];

    			}
    		}
    		
    		if (pSysAction.NbrPar != -1) {
    			if (pAction.NbParam != pSysAction.NbrPar) {
    				if (Error[0] == 0) {
    					Error[0] = 26;
    					pAction.Error = Error[0];
        				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Number of Parameters)", pAction.LineNumber];
    				}
    			}
    		}
    		else {
    			if (pSysAction.MinPar != -1) {
    				if (pAction.NbParam < pSysAction.MinPar) {
    					if (Error[0] == 0){
    						Error[0] = 27;
    						pAction.Error = Error[0];
            				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Minimum Number of Parameters)", pAction.LineNumber];
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
            				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Maximum Number of Parameters)", pAction.LineNumber];
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
            				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " First Parameter must be either a Variable or Session Field)", pAction.LineNumber];
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
            				StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " First Parameter must be a Variable)", pAction.LineNumber];
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
    		if (InName.IsObjectLogicInput ())	{
    			var pFatherAction = pentity.FatherAction;
                if (!pFatherAction) return;
                
    			if (!pFatherAction.ActionClass.Name.IsBasic2Logic ()) {
    				if (Error[0] == 0) 	{		
    					Error[0] = 36;
    					pAction.Error = Error[0];
                    	StrErr[0] =  ["Error (" + Error[0] + ") : (" + pFatherAction.ActionClass.Name + " Invalid Parameters AndV or OrV. (With AndV and OrV only comparaisons are allowed)", pAction.LineNumber];
    				}
    			}			
    			var pParameters = pFatherAction.ListParams;
    
    		  for (var i = 0; i < pFatherAction.ListParams.length; i++)	{
    				Entity = pFatherAction.ListParams[i];
    				if (Entity != pentity && Entity.Type == 'PLOPERATOR' &&  Entity.Val.ActionClass.Name.IsObjectLogicInput ())
    				if (Error[0] == 0) {		
    					Error[0] = 30;
    					pAction.Error = Error[0];
                    	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Logic comparaison between 2 AndV or OrV )", pAction.LineNumber];
    				}
    			}
    
    		}
    		else
    		if (InName.IsStatement ()) {

    			var nbrcond = 0;
    			var nbrparam = 0;
    			var elsepos = -1;
    			var LastAction = null;
    			var FirstBoolean = false;
	            for (var i = 0; i < pAction.ListParams.length; i++)	{

    				Entity = pAction.ListParams[i];
    				nbrparam++;
    				if (Entity.Type == 'PLOPERATOR') {
    					if (Entity.Val.ActionClass.Name.IsObjectLogic () || 
                        Entity.Val.ActionClass.Name.IsLogic ())
    					 nbrcond++;
    					else
    					if (Entity.Val.ActionClass.Name.IsLogical ()) {
    						var pEntity = Entity.Val.ListParams[0];
    						var pValue = pEntity.Val;
    
    						pLogical = this.PG.GetConditionFromName (pValue.Val);
    						if (pLogical)
    							nbrcond++;
    					}
    					else
    					if (InName.IsStatement () && Entity.Val.ActionClass.Name.IsElseStatement ())
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
    					
    					if (!InName.IsIfStatement () || FirstBoolean == false)	{
    						if (Error[0] == 0) {		
    							Error[0] = 37;
    							pAction.Error = Error[0];
    	                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid parameter)", pAction.LineNumber];
    						}
    					}
    					else
    					if (nbrparam > 1)	{
    						if (Error[0] == 0) {		
    							Error[0] = 38;
    							pAction.Error = Error[0];
    	                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Parameter: Must be a an action or a statement)", pAction.LineNumber];
    						}
    					}
    				}
    				if (Error[0] == 0 && (InName.IsIfStatement () && nbrcond > 1))	{		
    					Error[0] = 31;
    					pAction.Error = Error[0];
                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Statement: More than one condition in Statement, Use And or Or between conditions)", pAction.LineNumber];
    				}
    				if (Error[0] == 0 && (InName.IsElseStatement () && nbrcond > 0))				
    				{		
    					Error[0] = 39;
    					pAction.Error = Error[0];
                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Statement: Condition not allowed in Statement)", pAction.LineNumber];
    				}
    
    				if (Error[0] == 0 && (InName.IsIfStatement () && FirstBoolean == false && nbrcond != 1))
    				{		
    					Error[0] = 32;
    					pAction.Error = Error[0];
                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Statement: First parameter must return a Boolean (true, false)", pAction.LineNumber];
    				}
    			}
    			
    			if (Error[0] == 0 && (elsepos != -1  && elsepos != nbrparam))
    			{		
    				Error[0] = 3;
    				LastAction.Error = Error[0];
                  	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Statement: Invalid Last Parameter after Else Statement)", pAction.LineNumber];
    			}
    
    
    		}
    		else
    		if (InName.IsBasic2Logic () || InName.IsMath ()) {
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
/*            GLOBAL VARIABLES NOT TRUE    			
    			if (type1 == 'PLPOINTER')	{
    				if (Error[0] == 0)	{		
    					Error[0] = 33;
    					pAction.Error = Error[0];
                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Variable Undefined. Initialisation Setq must precede current expression)", pAction.LineNumber];
    				}
    			}
    
    			if (nbparam > 1 && !this.CompatibleTypes (type1, type2))	{
    				if (Error[0] == 0)	{		
    					Error[0] = 34;
    					pAction.Error = Error[0];
                      	StrErr[0] =  ["Error (" + Error[0] + ") : (" + InName + " Invalid Type parameters)", pAction.LineNumber];
    				}
    			}
*/    			
    		}
            for (var i = 0; i < pAction.ListParams.length; i++)	{
    			var Entity = pAction.ListParams[i];
    			Entity.FatherAction = pAction;
    			this.ParseEntity (Operation, Entity, Error, StrErr);
    		}
    	}
    }
	
	
    this.WCI = function (ToName, FromName)  {
        if (ToName.IsActionSet()) 
    	{
    		return (
    	  	 (FromName.IsConditionName(this.PG) && ToName.toUpperCase() != "SETQ") ||
    		 (FromName.IsFieldConstantName () && ToName.toUpperCase() != "SET") || 
    		 FromName.IsValue () ||
    		 FromName.IsMath ()  ||
    		 (FromName.IsInput () && !FromName.IsObjectLogic()));
    	}
    	else        
    	if (ToName.IsAction ())
    	{
	        return (
	        thisFromName.IsFieldName ()		||	            
    		FromName.IsLogic ()		||
    		FromName.IsObjectLogic() ||
    		FromName.IsConditionName(this.PG));    	    
    	}
    	else
    	if (ToName.IsObjectLogic ())
    	{
            return false;
    	}
    	else
    	if(ToName.IsBasic1Logic ())
    	{
    		return (
                FromName.IsFieldName ()		||	    		    
                FromName.IsLogic ()		||
                FromName.IsObjectLogic() ||
                FromName.IsConditionName(this.PG));
    	}
    	else
    	if (ToName.IsBasic2Logic())
    	{
    		return (
                FromName.IsFieldName ()		||	
                FromName.IsObjectLogicInput()	||	
                FromName.IsObjectInput()	||	
                FromName.IsValue ()		  ||	
                FromName.IsMath ()		  ||
    		(FromName.IsInput () && !FromName.IsObjectLogic()));
    	}
    	else
    	if (ToName.IsObjectInput ())
    	{
    		return false;
    	}
    	else
    	if (ToName.IsMath())
    	{
    		return (
                FromName.IsFieldName ()		||	    		    
                FromName.IsMath () || 
                FromName.IsValue () ||
    		(FromName.IsInput () && !FromName.IsObjectLogic()));
    
    	}
    	else
    	if (ToName.IsStatement ())
    	{
    		return (
                FromName.IsStatement () ||
                FromName.IsAction ()		 ||
                FromName.IsFieldName ()		||	            
                FromName.IsIfStatement () && (FromName.IsConditionName(this.PG) || FromName.IsLogic() || FromName.IsObjectLogic()))
    
    	}
    	else
    		return false;
    }


    this.Insert  = function (container, pObj, Text)  {
       
        var pChildObject = null;
        var FromObject	= pObj;
        var ToName = Text.ReturnTrueName ();
    

    	if (pObj) {

    		if (pObj.Close) pObj.Close = 0; //OnOpenObject();

    		if (pObj.Space.Name  == "ATOM") 	{
    		}
    		else {		
    			if (ToName.IsInput () && !ToName.IsObjectInput ()) {
    				if (ToName == "Float")
    				 ToName =  "0.000";
    				else
    				if (ToName == "Numeric")
    				 ToName =  "0";
    				else
    				if (ToName == "True/False")	
    				 ToName =  "TRUE";
    				else
    				if (ToName == "String")	
    				 ToName =  "\"\"";
    				else
    				if (ToName == "Char")	
    				 ToName = "''";
    				else
    				if (ToName == "Time") {
/*    				    
    					time_t timenow =  time (NULL);
    					struct tm* ltime  = localtime (&timenow);
    				    sprintf(ToName, "%2.2d:%2.2d:%2.2d", ltime.tm_hour, ltime.tm_min, ltime.tm_sec);				 
*/  
    				}
    				else
    				if (ToName == "Date") {
/*    				    
    					time_t timenow =  time (NULL);
    					struct tm* ltime  = localtime (&timenow);
    					sprintf(ToName, "%02d/%02d/%02d", ltime.tm_mday, ltime.tm_mon + 1, ltime.tm_year + 1900 );
*/  
    				}
    				else
    				if (ToName == "Field") {
    				 ToName =  "T_____________";
    				}
    				else
    				if (ToName == "Direction") {
    				 ToName =  "D_____________";
    				}
    				else
    				if (ToName == "Direction Type") {
    				 ToName =  "DT_____________";
    				}
    				else
    				if (ToName == "Order") {
    				 ToName =  "OP_____________";
    				}
    				else
    				if (ToName == "Order Type") {
    				 ToName =  "OT_____________";
    				}
    				else
    				if (ToName == "Recovery Mode") {
    				 ToName =  "M_____________";
    				}
    				else
    				if (ToName == "Exit Mode") {
    				 ToName =  "EM_____________";
    				}
    				else
    				if (ToName == "Variable")
    				 ToName =  "V_____________";
    			
    				pChildObject =  gse.MakeNode("RULES", "ATOM", 0, ToName);
    				
    			}
    			else
    			if (ToName.IsValue () || ToName.IsFieldName ())
    				pChildObject =  container.GSE.MakeNode("RULES", "ATOM", 0, ToName);
    			else
    			{
    				pChildObject = container.GSE.MakeNode("RULES", "ACTION", 0, ToName);
    			}	
    		}
    	}
    	
    	else
    	
    	if (ToName.IsLogic () || ToName.IsObjectLogic()  || ToName.IsAction() ||ToName.IsIfStatement ()) {		
    		pChildObject =  container.GSE.MakeNode("RULES", "ACTION", 0, ToName);
    		FromObject = container.RootNode;
    	}
    

    	if (pChildObject) {
    		this.InsertObject (container, FromObject, pChildObject);

        	if (FromObject != container.RootNode) container.SelectNode = FromObject;
        	else container.SelectNode = pChildObject;    	
    	}

    	return pChildObject;
    }	
    
    
	this.RemoveObject = function (container, FromObject, ObjectToDelete) {
        container.GSE.RemoveTreeNode ("RULES", ObjectToDelete);	    //remove node
	    
    	var FromName  = FromObject.Name[0].split (" ")[0];
	    if (FromName.IsBasic1Logic ())  {             // check number of children 
            
	        if (FromObject.Inherit.length  == 0) {  //operator with no child  we remove it
                container.GSE.RemoveNode ("RULES", FromObject);	    //remove node
	        }
            else	        
	        if (FromObject.Inherit.length  == 1) {  //delete father and connect the other child to it's father
	            var OtherChild  = FromObject.Inherit[0].ToNode ;
                var	FatherObj	= FromObject.Fromherit[0].FromNode;                

            	container.GSE.MakeLink ("RULES", "SESSIONLINK", FatherObj, OtherChild , 0);
                container.GSE.RemoveNode ("RULES", FromObject);	    //remove operator
	        }
	    }
	}
    
    this.InsertObject = function (container, FromObject, ObjectToInsert)   {

    	var NameToInsert  = ObjectToInsert.Name[0].split (" ")[0];
    	var OnName  = FromObject.Name[0];
    	var FName;
    	
    	
    	var ToEntity = ObjectToInsert.UserField;	
    	if (ToEntity && ToEntity.Type == 'PLOPERATOR')	{
    		Action = ToEntity.Val;
    		NameToInsert = Action.ActionClass.Name;
    	}
    		

    	if (OnName.IsAction ())	{
    		var Link = FromObject.Fromherit[0];    // first link

    		if (NameToInsert.IsLogic () || NameToInsert.IsObjectLogic () || NameToInsert.IsConditionName (this.PG))    // check first argument
    		{

    		    if (Link.FromNode == container.RootNode || Link.FromNode.Name[0].IsElseStatement ()) {
    			    var insertnode = container.GSE.MakeNode("RULES", "ACTION", 0, "IF");

                	
                	container.GSE.MakeLink ("RULES", "SESSIONLINK", Link.FromNode, insertnode, Link);
                	container.GSE.MakeLink ("RULES", "SESSIONLINK", insertnode, FromObject);
                    container.GSE.RemoveLink("RULES", Link);                	

    		        FromObject = insertnode;
    		        OnName = "IF";
    		    }
                else {  
        			FromObject = Link.FromNode;
                    // hope is an if                    		    
        			var ToEntity = Link.FromNode.UserField;	
    				if (ToEntity.Type == 'PLOPERATOR')
    				{
    					OnName = ToEntity.Val.ActionClass.Name;
    				}
    				else
    				{	
    					OnName = FromObject.Name[0];          // name
    				}	
                }
    		}
    	}
    	if (OnName.IsIfStatement ())	{
    		var Link = FromObject.Inherit[0];    // first link
    
    		if (NameToInsert.IsLogic () || NameToInsert.IsObjectLogic () || NameToInsert.IsConditionName (this.PG))    // check first argument
    		{
    			if (!Link)  // No arguments so insert link
    			{
    				container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert);
    			}
    			else
    			{
    				var ToEntity = Link.ToNode.UserField;	
    				if (ToEntity.Type == 'PLOPERATOR') {
    					FName = ToEntity.Val.ActionClass.Name;
    				}
    				else {	
    				                // see if it is condition 
    				    if (ToEntity.Val.Val.IsConditionName ())
    				        FName = ToEntity.Val.Val;
				        else
					        FName = FromObject.Name[0];          // name
    				}
    				if (!FName.IsLogic () && !FName.IsObjectLogic () &&  !FName.IsConditionName (this.PG))   // first argument is not logic so insert at first
    				{
    					container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, 0);
    				}
    				else
    				if (NameToInsert.IsBasic1Logic ())                 // first argument is logic and we insert AND OR NOT
    				{
    				    
                        container.GSE.RemoveLink("RULES", Link);
                    	container.GSE.MakeLink ("RULES", "SESSIONLINK", Link.FromNode, ObjectToInsert, 0);
	                    container.GSE.MakeLink ("RULES", "SESSIONLINK", ObjectToInsert, Link.ToNode, 0);    				    
    					//container.GSE.InsertObjectAfter (pObjectToInsert, Link, NULL);      
    				}
    				else
    				if (FName.IsBasic1Logic ())                 // first argument is logic and we insert Logic so put it inside son unless the object has no children
    				{
    				    if (Link.ToNode.Inherit.length == 0) {
                    	    container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, 0);
                            container.GSE.RemoveLink("RULES", Link);
                    	    
    				    }
    				    else {
                    	    container.GSE.MakeLink ("RULES", "SESSIONLINK", Link.ToNode, ObjectToInsert, 0);
    				    }
    				}
    				else
    				if (FName.IsObjectLogic () || FName.IsBasic2Logic () || FName.IsConditionName (this.PG))                 // first argument is object logic or operator value or condition and we insert Logic so add and and insert
    				{
    				    var insertnode = container.GSE.MakeNode("RULES", "ACTION", 0, "AND");
                        container.GSE.RemoveLink("RULES", Link);
                    	
                    	container.GSE.MakeLink ("RULES", "SESSIONLINK", Link.FromNode, insertnode, 0);
                    	container.GSE.MakeLink ("RULES", "SESSIONLINK", insertnode, Link.ToNode, 0);
                    	container.GSE.MakeLink ("RULES", "SESSIONLINK", insertnode, ObjectToInsert, 0);
    				}

    				else
    				{
    					container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, 0);  // insert at beginning 
    				}
    			}
    		}
      		else
    		if (NameToInsert.IsElseStatement ()) {
    			var Link = FromObject.Inherit[FromObject.Inherit.length - 1];                   // .length - 1last link
    			container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, Link);
    		}
    		else	{
    		    
    			var LastlinK = Link;
		    	
		    	for (var i = 0; i < FromObject.Inherit.length; i++)	{
    				var linK = FromObject.Inherit[i];
    				FName =  FromObject.Inherit[i].ToNode.Name[0];          // name
    				if (FName.IsElseStatement ())                           //Insert before Else if any
    				{
    					container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert, LastlinK != Link ? LastlinK : null);
    					return;
    				}
    				LastlinK = linK;
    			}
    			container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert);
    		}
    	}
    	else
    		container.GSE.MakeLink ("RULES", "SESSIONLINK", FromObject, ObjectToInsert);

    }
	
	this.Init();
}





function plsection(name) {
	this.Name = name;
	this.ListVariables = [];
	this.ListConditions = [];
	this.ListIndicators = [];
	this.NbVariables = 0;
	this.ListEntities = [];
	this.NbEntity = 0;
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
    this.ListPeriods = [];
    this.Signal = null;
    this.Recid  = null;   //application field
    

}

function plvariable(name) {
	this.Name = name;
	this.Sharable = null;
	this.Exportable = null;
	this.Value = new plvalue(null, 'PLPOINTER');
	this.SetEntity = null;
	this.LineNumber;
	this.Type = GLOBAL_VARIABLE;  
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
                                                                                "PL.MainSection.NbVariables++;} else  PL.Parser.parseError ('Not a ssssssssssvariable', ''); "],
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