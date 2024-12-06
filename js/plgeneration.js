//////////////////////////////////////////////////////////////////// JS//////////////////////////////////////////////////////////
var generateproperties = false;

var ROOTNAME= 'RULES';

function GenerateJSMarker (marker) {
    let s = "";
    let sRule 			= "R_" + marker.StartRule;
	let operation 		= OperationName.indexOf (marker.Operation);
	let soutput 		= GenerateSections(JS_GENERATION, operation, sRule);   
	let variablesstring = GenerateVariables (JS_GENERATION, LOCAL_VARIABLE);    
    
    s += "function " + marker.Name + " ()\n{\n";
		s += variablesstring;
		
		s +=  "return " + soutput;    
    s += "\n}\n";    

	marker.JSContent = s;     
    return s;
}    

function GenerateCondition (type, condition) {
 	let s = "";   
	let soutput = GenerateSections (type, -1, "Rule", condition.Section);
   
	if (type == JS_GENERATION)
	    s += "function " + condition.Name + " (Operation, Rule)\n{\n"  + "return " + soutput  + ";\n} \n\n" ;	   
    else
    if (type == C_GENERATION) {
        s += "bool _" + condition.Name + " (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice, int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) \n{\n	return " + soutput  + ";\n} \n\n" ;	
    }
    else
    if (type == MQ4_GENERATION) {
        s += "bool " + condition.Name + "(int Operation, int Rule)\n{\n"  + "return " + soutput  + ";\n} \n\n" ;	
    }    
    return s;
}


function GenerateJSConditions (engine) {
    var s = "";
    for (var i = 0; i < engine.Conditions.length; i++) {
        var condition = engine.Conditions[i];
         s += "//--- " + condition.Name +  " -------------------------------------------\n\n";
        
        s+= GenerateCondition (JS_GENERATION, condition);
    }

    s += "\n\n";
    return s;
}


function GenerateJSObjects (engine) {
	var s = "";
    
    for (var i = 0; i < engine.Indicators.length; i++) {
        if ( engine.Indicators[i] >= engine.PG.NBR_DEFOBJECTS) {        
            var object = engine.PG.GetObjectFromId (engine.Indicators[i]);
            if (!object) continue;
            s = s + "var " + object.Name + " = " + object.Id + ";\n";
        }
        
    }
    return s;
}

function GenerateMQ4Conditions (engine) {
    var s = "";
    for (var i = 0; i < engine.Conditions.length; i++) {
        var condition = engine.Conditions[i];
         s += "//--- " + condition.Name +  " -------------------------------------------\n\n";
        
        s+= GenerateCondition (MQ4_GENERATION, condition);
    }

    s += "\n\n";
    return s;
}

function GenerateMQ4Objects (engine) {
	var s = "";
    
    for (var i = 0; i < engine.Indicators.length; i++) {
        if ( engine.Indicators[i] >= engine.PG.NBR_DEFOBJECTS) {        
            var object = engine.PG.GetObjectFromId (engine.Indicators[i]);
            if (!object) continue;
            s = s + "#define " + object.Name + " " + object.Id + "\n";
        }
    }
    return s;
}

function GenerateJSStrategy (strategy, working_engine) {
	var s = "";
	var engine;
	
	
    if (working_engine)
	    engine = working_engine;
	else
        engine = strategy.pBEngine	
	
	var sRule = engine.StartRule;
    
    var	GenerateActions = false;


	s += "function R_" + sRule + "_RULE ()\n{\n";

	s += GenerateVariables (JS_GENERATION, LOCAL_VARIABLE);


	if (generateproperties)
		s += GenerateProperties (engine);

	if (GenerateActions)
		s += GenerateActions (JS_GENERATION, engine);
    
    //Buy
	s += GenerateSections(JS_GENERATION, OperationName.indexOf (engine.Operation), "R_" + sRule);


	s += "}\n";

    engine.JSContent = s;
    return s;
}

//////////////////////////////////////////////////////////////////// MQ4//////////////////////////////////////////////////////////



function GenerateMQ4Strategy (strategy, working_engine) {
	var s = "";
	var engine;
	
	if (working_engine)
	    engine = working_engine;
	else
        engine = strategy.pBEngine
        
        
	var sRule = engine.StartRule;
   
    var	GenerateActions = false;




	s += "/* ============================================================\n";
	s += "STRATEGY : " +  strategy.Name + "\n";
 	s += "RULE : " + sRule + "\n";
//	s += "DESCRIPTION \n" + strategy.Description + "\n";
	s += "=============================================================*/\n";

    var sellistvariables = null;

    //Buy 

    try {
        solution.PL.ParseEngine(engine);       
    } catch (error) {
        Project_ParseError(error.message, error.hash);    
		return;        
    }    

   
    
	if (strategy.Operation == OP_BUY) {
    	strategy.pSEngine.SCContent = strategy.pSEngine.Code[CODE_SS];
        solution.PLSELL.ParseEngine (strategy.pSEngine);
        sellistvariables = solution.PLSELL.MainSection.Variables; // save variables for sell engine        
	}
    
    
	s += "\n";
	
	s += "void R_RULE_" +  sRule  + " ()\n{\n";

	s += GenerateVariables (MQ4_GENERATION, LOCAL_VARIABLE, sellistvariables);

	s += "\n";
	s += "//------------------------------" +  engine.Operation + " ENGINE ------------------------------\n";
	s += "\n";

	if (generateproperties)
		s += GenerateProperties (engine);

	if (GenerateActions)
		s += GenerateActions (MQ4_GENERATION, engine);
		

	s += GenerateSections(MQ4_GENERATION, OperationName.indexOf (engine.Operation), "R_" + sRule);
	
	
	if (strategy.Operation == OP_BUY) {
	    solution.PL = solution.PLSELL;

		s += "\n";
		s += "\n\n//------------------------------ SELL ENGINE ------------------------------\n";
		s += "\n";

		if (GenerateProperties)
			s += GenerateProperties (strategy.pSEngine);
		
		if (GenerateActions)
			s += GenerateActions (MQ4_GENERATION, strategy.pSEngine);
	//sell
		s += GenerateSections(MQ4_GENERATION, OperationName.indexOf (strategy.pSEngine.Operation), "R_" + sRule);
	}


	s += "}\n\n";

    strategy.MQ4Content = s;
    return s;
}



//////////////////////////////////////////////////////////////////// C//////////////////////////////////////////////////////////


function GenerateCStrategy (strategy, working_engine) {
	var s = "";
	var engine;
	
	if (working_engine)
	    engine = working_engine;
	else
        engine = strategy.pBEngine;
        
        
	var sRule = engine.StartRule;
    var	GenerateActions = false;


	s += "/* ============================================================\n";
	s += "STRATEGY : " +  strategy.Name + "\n";
 	s += "RULE : " + sRule + "\n";
//	s += "DESCRIPTION \n" + strategy.Description + "\n";
	s += "=============================================================*/\n";


    //Buy or BuySell
	try {
		solution.PL.ParseEngine(engine);       
	} catch (error) {
		Project_ParseError(error.message, error.hash);   
		return;         
	}    
	s += "\n";
	
	s += "void R_RULE (" +  sRule  + ")\n{\n";

	s += GenerateVariables (C_GENERATION, LOCAL_VARIABLE);

	s += "\n";
	s += "//------------------------------" +  engine.Operation + " ENGINE ------------------------------\n";
	s += "\n";


	if (generateproperties)
		s += GenerateProperties (engine);

	if (GenerateActions)
		s += GenerateActions (C_GENERATION, engine);
    
  
	s += GenerateSections(C_GENERATION, OperationName.indexOf (engine.Operation), "R_" + sRule);
	
	
	if (strategy.Operation == OP_BUY)                       // BUY SELL STRATEGY
	{
	  	strategy.pSEngine.SCContent = strategy.pSEngine.Code[CODE_SS];
		try {
			solution.PL.ParseEngine(strategy.pSEngine);       
		} catch (error) {
			Project_ParseError(error.message, error.hash);  
			return;          
		}    
	  
        
		s += "\n";
		s += "\n\n//------------------------------ SELL ENGINE ------------------------------\n";
		s += "\n";
	
		if (GenerateProperties)
			s += GenerateProperties (strategy.pSEngine);
		
		if (GenerateActions)
			s += GenerateActions (C_GENERATION, strategy.pSEngine);
	//sell
        s += GenerateSections(C_GENERATION, OperationName.indexOf (strategy.pSEngine.Operation), "R_" + sRule);
	
	}


	s += "}\n\n";

    strategy.CContent = s;
    return s;
}


function GenerateCExternCondition (condition) {
 	var s = "";   

	s += "#define " + condition.Name + "(...) _"  + condition.Name + "(Ask, Bid, CurrentTime, CurrentPeriod, Symbol, Point, Digits, SignalTab, SignalTabValue, SignalTabTime,SignalTabPrice, BeforeSignalTab, BeforeSignalTabValue, BeforeSignalTabTime,BeforeSignalTabPrice,BeforeSignalTickTab, RuleTab, RuleTabValue, BeforeRuleTab, BeforeRuleTabValue,  ##__VA_ARGS__)\n";

    s += "extern bool _" + condition.Name + " (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule); \n\n" ;
    return s;
}




function GenerateCSystemObject (type, object) {
   
 	var s = "";  


//var SignalsSystemObject = ["BUY", "SELL", "EXIT_BUY", "EXIT_SELL", "BULL", "BEAR"]; 

    for (var i = 0; i < SignalsSystemObject.length; i++) {
    	if (object.Section[i] != null) {
    		s+= "//========================================== " + object.Name + " : " + SignalsSystemObject[i] + " SIGNAL ==============\n";
    
            var soutput = GenerateSections (C_GENERATION, -1, "Rule", object.Section[i][1], type);
    		s += "if (" + soutput + ")\rSet_Signal (" + object.Name + ", "  + "S_" + SignalsSystemObject[i]  + ", x, " + "P_SIGNAL);\n";
    	}
    }

	s += "\n\n";
	return s;
}


function GenerateCObjects (type, engine) {
	var s = "";
    
    for (var i = 0; i < engine.Indicators.length; i++) {
        var object = engine.PG.GetObjectFromId (engine.Indicators[i]);

    
        if (!object) continue;
        s = s + "var " + object.Name + " = " + object.Id + ";\n";
        
    }
    return s;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function GenerateActions(type, engine) {

	var s = "";
	var sRule = "R_" + engine.StartRule;
	var operation = OperationName.indexOf (engine.Operation);
	var error = 0;

	s  = "//--------------ACTIONS ------------------------------\n\n\n";


	s += GenerateSections(type, operation, sRule, type);

	s  += "\n//--------------END ACTIONS ------------------------------\n\n\n";

	return s;
}



function GenerateProperties (engine) {
	var s = "";
	var sRule = "R_" + engine.StartRule;
	var operation = OperationName.indexOf (engine.Operation);

	s += "//--------------PROPERTIES ------------------------------\n\n";

	s += "	Set_Rule(OP_" + engine.Operation + ", T_DIRECTION, "      + sRule +  ", P_SIGNAL, " + ((engine.Direction == "BACKWARD")  ? "D_BACKWARD" : ((engine.Direction == "FORWARD") ? "D_FORWARD" : "D_ANY")) + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_DIRECTIONTYPE, "  + sRule +  ", P_SIGNAL, " + ((engine.DirectionType ==  "MINMAX") ? "DT_MINMAX" : "DT_LEVEL") + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_RECOVERYMODE, "   + sRule +  ", P_SIGNAL, " +  "M_" + engine.RecoveryMode + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_RECOVERYVALUE, "  + sRule +  ", P_SIGNAL, " +  engine.RecoveryValue    + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_ILOT, "			  + sRule +  ", P_SIGNAL, " +  engine.ILot			  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_MAXLOT, "		  + sRule +  ", P_SIGNAL, " +  engine.MaxLot			  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_MAXCOUNT, "		  + sRule +  ", P_SIGNAL, " +  engine.MaxCount		  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_KEEPBUYSELL, "	  + sRule +  ", P_SIGNAL, " +  ((engine.KeepBuySell, "FALSE")  ? "false" : "true" ) + ");\n";  
	s += "	Set_Rule(OP_" + engine.Operation + ", T_EXITMODE, "		  + sRule +  ", P_SIGNAL, " +  ((engine.ExitMode == "EXITBUYFIRST")  ? "EM_EXITBUYFIRST" : ((engine.ExitMode == "EXITSELLFIRST") ? "EM_EXITSELLFIRST" : "EM_EXITANY")) + ");\n";  

	s += "	Set_Rule(OP_" + engine.Operation + ", T_PIPSTEP, "		  + sRule +  ", P_SIGNAL, " +  engine.PipStep		  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_TIMESTEP, "		  + sRule +  ", P_SIGNAL, " +  engine.TimeStep		  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_MAXTIME, "		  + sRule +  ", P_SIGNAL, " +  engine.MaxTime		  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_HEDGEMAGNITUDE, " + sRule +  ", P_SIGNAL, " +  engine.HedgeMagnitude   + ");\n"; 
	if (operation == OP_BUY || operation == OP_BUYSELL)	{
		s += "	Set_Rule(OP_" + engine.Operation + ", T_BUYTS, "		 + sRule +  ", P_SIGNAL, " +  engine.BuyTS            + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_BUYTP, "		 + sRule +  ", P_SIGNAL, " +  engine.BuyTP            + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_BUYSL, "		 + sRule +  ", P_SIGNAL, " +  engine.BuySL			  + ");\n"; 
	}
	if (operation == OP_SELL || operation == OP_BUYSELL) {
		s += "	Set_Rule(OP_" + engine.Operation + ", T_SELLTS, "		 + sRule +  ", P_SIGNAL, " +  engine.SellTS            + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_SELLTP, "		 + sRule +  ", P_SIGNAL, " +  engine.SellTP            + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_SELLSL, "		 + sRule +  ", P_SIGNAL, " +  engine.SellSL			  + ");\n"; 
	}
	s += "	Set_Rule(OP_" + engine.Operation + ", T_TS, "			     + sRule +  ", P_SIGNAL, " +  engine.TS				  + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_TP, "			     + sRule +  ", P_SIGNAL, " +  engine.TP               + ");\n"; 
	s += "	Set_Rule(OP_" + engine.Operation + ", T_SL, "			     + sRule +  ", P_SIGNAL, " +  engine.SL               + ");\n"; 

	if (operation == OP_BUY || operation == OP_BUYSELL)	{
		s += "	Set_Rule(OP_" + engine.Operation + ", T_BUYLOTTS, "		 + sRule +  ", P_SIGNAL, " +  engine.BuyLotTS         + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_BUYLOTTP, "		 + sRule +  ", P_SIGNAL, " +  engine.BuyLotTP         + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_BUYLOTSL, "		 + sRule +  ", P_SIGNAL, " +  engine.BuyLotSL		  + ");\n"; 
		s += "	Set_Rule(OP_EXIT_BUY, T_MINPROFIT, " + sRule +  ", P_SIGNAL, " +  engine.BuyMinProfit + ");\n"; 
	}
	if (operation == OP_SELL || operation == OP_BUYSELL) {
		s += "	Set_Rule(OP_" + engine.Operation + ", T_SELLLOTTS, "		 + sRule +  ", P_SIGNAL, " +  engine.SellLotTS         + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_SELLLOTTP, "		 + sRule +  ", P_SIGNAL, " +  engine.SellLotTP         + ");\n"; 
		s += "	Set_Rule(OP_" + engine.Operation + ", T_SELLLOTSL, "		 + sRule +  ", P_SIGNAL, " +  engine.SellLotSL		  + ");\n"; 
		s += "	Set_Rule(OP_EXIT_SELL, T_MINPROFIT, "	 + sRule +  ", P_SIGNAL, " +  engine.SellMinProfit     + ");\n"; 
	}

	s += "	Set_Rule(OP_EXIT," + " T_MINPROFIT, "	 + sRule + ", P_SIGNAL, " +  engine.MinProfit   + ");\n\n"; 

	s += "//--------------END PROPERTIES ------------------------------\n\n";

	return s;
}



function GenerateVariables (type, vartype, SellListVariables) {
	var s = "";
    
    if (vartype == STATIC_VARIABLE)
        return s;
	var ListVariables = solution.PL.MainSection.ListVariables;
	
	for (var j = 0; j < ListVariables.length; j++)  {
        var pVariable = ListVariables[j];
		var pValue  = pVariable.Value;
		if (pVariable.Name == "this" || pVariable.Type != vartype)  continue;
		

		s += solution.PL.ReturnType (type, pVariable) + "  " + pVariable.Name + "  =  " +  solution.PL.ReturnValue (pValue) + ";\r\n"; 
	}
	
	if (SellListVariables)	{
    	for (var i = 0; i < SellListVariables.length; i++)  {
            var pVariable = SellListVariables[i];
    		var pValue    = pVariable.Value;
		    if (pVariable.Name == "this" || pVariable.Type != vartype)  continue;    		
    		var found = false;
    		for (var k = 0; k < ListVariables.length; k++) {
    		    if (pVariable.Name  ==  ListVariables[k].Name) {
    		            found = true;
    		            break;
    		    }
    		}
			if (found)  continue;
			s += solution.PL.ReturnType (type, pVariable) + "  " + pVariable.Name + "  =  " + CReturnValue (pValue) + ";\r\n"; 
		}
	}
	
	return s;
}



function GenerateSections (type, Operation, sRule, section) {
	var s = "";
    var entity;
    var ListEntities;

    var Section = solution.PL.MainSection;

	if (section) 
	    Section = section;
	let tempstr;

	ListEntities = Section.ListEntities;
	for (var j = 0; j < ListEntities.length; j++) {
        entity =  ListEntities[j];
        switch (entity.Type) {
            case  'PLOPERATOR':
                tempstr  = GenerateAction (type, entity.Val, Operation, sRule);
            break;
    		default:
                tempstr  = GenerateEntity (type, entity, Operation, sRule);
            break;
        }
		s += tempstr;

/*		if (j == ListEntities.length -1 && type == JS_GENERATION) {
			s += 'return ' + tempstr;
		} else {
			s += tempstr;
		}
*/		
    }
	return s;
}

function GetOperatorFromType (type, operator) {
    switch (operator) {
        case "ABS" :
            if (type == C_GENERATION)
                return "fabs";
            else
            if (type == MQ4_GENERATION)
                return "MathAbs";
            else
            if (type == JS_GENERATION)
                return "Math.abs";
            return "";    
        break;
        case "MAX" :
            if (type == C_GENERATION)
                return "max";
            else
            if (type == MQ4_GENERATION)
                return "MathMax";
            else
            if (type == JS_GENERATION)
                return "Math.max";
            return "";    
        break;
        case "MIN" :
            if (type == C_GENERATION)
                return "min";
            else
            if (type == MQ4_GENERATION)
                return "MathMin";
            else
            if (type == JS_GENERATION)
                return "Math.min";
            return "";    
        break;				
    }            
}

function GenerateEntity (type, entity, Operation, sRule) {
	var Value;
	var s = "";
	var sOperation;	
		
	if (Operation == OP_BUY) sOperation = "OP_BUY";
	else
	if (Operation == OP_SELL) sOperation = "OP_SELL";
	else
	if (Operation == OP_BUYSELL) sOperation = "OP_BUYSELL";
	else
	if (Operation == -1) sOperation = "Operation";


    if (entity.Type ==  'PLATOM')  {
        Value = entity.Val;
        s = solution.PL.ReturnValue (Value);
	}
    else {
		var sField = entity.Val.Name;
		
		if (entity.Type != 'PLVARIABLE')	{
			var MakeUpper = true;

			if (entity.Type == 'PLOBJECT') {
				if (ObjectPredefinedName.indexOf (entity.Val.Name.toUpperCase()) != -1) {
				    entity.Val.Name = entity.Val.Name.toUpperCase();
				}
				MakeUpper = false;
			}
			if (entity.Type == 'PLVALUE')	
					MakeUpper = false;
			
			if (MakeUpper) 
				sField = sField.toUpperCase();

			if (entity.Type == 'PLFIELD') {
				
				if (sField == "T_BUYMINPROFIT")
					s = "RValue (OP_EXIT_BUY, T_MINPROFIT,"  + sRule + ")";
				else
				if (sField == "T_MINPROFIT")
					s = "RValue (OP_EXIT, T_MINPROFIT,"  + sRule + ")";
				else
				if (sField == "T_SELLMINPROFIT")
					s = "RValue (OP_EXIT_SELL, T_MINPROFIT,"  + sRule + ")";
				else
					s = "RValue (" + sOperation + ", " +sField + ", " + sRule + ")";
			}	
			else
				s = sField;
		}
		else {
    	    s = sField;
		}
	}
    return s;
}

function GenerateAction (type, action, Operation, sRule, InsidePar, InsideOperator) {
    var entity;
    var pvalue;
    var ListParams;
	var s = "";
	var sOperation;	
	var WhichPar = 0;
	
	var sname = action.ActionClass.Name;
		
	if (Operation == OP_BUY) sOperation = "OP_BUY";
	else
	if (Operation == OP_SELL) sOperation = "OP_SELL";
	else
	if (Operation == OP_BUYSELL) sOperation = "OP_BUYSELL";
	else
	if (Operation == -1) sOperation = "Operation";


	if (sname.toUpperCase() == "START")  {
		s += "Set_Rule(" + sOperation + ", " + "T_START, " + sRule + ", P_SIGNAL);"; 
	}
	else
	if (sname.toUpperCase() == "BUY" ||
		sname.toUpperCase() == "SELL" ||
		sname.toUpperCase() == "EXIT_BUY" ||
		sname.toUpperCase() == "EXIT_SELL" ||
		sname.toUpperCase() == "EXIT" ||
		sname.toUpperCase() == "CLOSE_BUY" ||
		sname.toUpperCase() == "CLOSE_SELL" ||
		sname.toUpperCase() == "CLOSE" ||
		sname.toUpperCase() == "HEDGE_BUY" ||
		sname.toUpperCase() == "HEDGE_SELL" ||
		sname.toUpperCase() == "CLOSE_HEDGE_BUY" ||
		sname.toUpperCase() == "CLOSE_HEDGE_SELL" ||
		sname.toUpperCase() == "CLOSE_HEDGE") {
		s += "Set_Rule(OP_" + sname + ", " + "T_STATUS, " + sRule + ", P_SIGNAL);"; 
	}
	else
	if (sname.toUpperCase() == "ELSE") 	{
		var par = 0;
		s += "}else \n{";
		

		for (var i = 0; i < action.ListParams.length; i++)	{
			entity = action.ListParams[i];		    
			pvalue  = entity.Val;
			
			if (entity.Type ==  'PLOPERATOR')
				s += GenerateAction (type, entity.Val, Operation, sRule);
			else				
				s += GenerateEntity (type, entity, Operation, sRule);

			par++;
		}
		s+= "}\n";
	}
	else
	if (sname.toUpperCase() == "IF") {
		var par = 0;
        var containselse = false;


		s += "\nif ";

		for (var i = 0; i < action.ListParams.length; i++)	{

			entity = action.ListParams[i];

			if (par == 0) s += "(";
			if (par == 1) s += "\n{ ";
		    			
			pvalue  = entity.Val;

			if (entity.Type ==  'PLOPERATOR') {
			    
				var psonaction = entity.Val;
				sname =  psonaction.ActionClass.Name;
				
				if (sname.toUpperCase() == "ELSE")  
				    containselse = true;
				s += GenerateAction (type, entity.Val, Operation, sRule);
			}
			else				
				s += GenerateEntity(type, entity, Operation, sRule);
			
			if (par == 0) s += ")\n";

			par++;
		}
		
		if (par <= 1) 			
		    s+= "\n{}\n";
		else 
		if (!containselse)
			s+= "}\n";
	}
	else
	if (sname.toUpperCase() == "SET") {

		var par = 0;

		for (var i = 0; i < action.ListParams.length; i++)	{
			entity = action.ListParams[i];
			
			if (par == 0) {
				var sField = entity.Val.Name;
				
				if (entity.Type == 'PLFIELD') {
					sField = sField.toUpperCase();
					
					if (sField == "T_BUYMINPROFIT")
						s += "Set_Rule(OP_EXIT_BUY, T_MINPROFIT, " +  sRule + ", P_SIGNAL, "; 
					else
					if (sField == "T_MINPROFIT")
						s += "Set_Rule(OP_EXIT, T_MINPROFIT, "  + sRule + ", P_SIGNAL, "; 
					else
					if (sField == "T_SELLMINPROFIT")
						s += "Set_Rule(OP_EXIT_SELL, T_MINPROFIT,  "   + sRule + ", P_SIGNAL, "; 
					else
						s += "Set_Rule(" + sOperation + ", " + sField + ", " +  sRule + ", P_SIGNAL, ";
				}
				else
					s += "Set_Rule(" + sOperation + ", " + sField + ", " +  sRule + ", P_SIGNAL, ";
			}
			else {
			    
				if ((entity.Type ==  'PLATOM') ||(entity.Type == 'PLVARIABLE') || (entity.Type == 'PLFIELD') ||
					entity.Type == 'PLFIELDDIRECTION' || entity.Type == 'PLFIELDDIRECTIONTYPE'  || entity.Type == 'PLFIELDEXITMODE' ||
					entity.Type == 'PLFIELDORDER' ||entity.Type == 'PLFIELDORDERTYPE' || entity.Type == 'PLFIELDRECOVERYMODE') 	{
					s += GenerateEntity(type, entity, Operation, sRule);
				}
				else {
					if (entity.Type ==  'PLOPERATOR')	{
						s += GenerateAction (type, entity.Val, Operation, sRule);
					}
				}
			}
			
			par++;
		}
		s += ");";
	}
	else
	if (sname.toUpperCase() == "SETQ") 	{

		var par = 0;

		for (var i = 0; i < action.ListParams.length; i++)	{
			entity =  action.ListParams[i];

			if (par == 1) s += " = ";
		
						
			pvalue  =  entity.Val;
			
			if (entity.Type ==  'PLOPERATOR')
				s += GenerateAction (type, entity.Val, Operation, sRule);
			else {
                if (par == 0) {
        		    var pVariable = entity.Val;
        		    var vartype = solution.PL.ReturnType (type, pVariable);

        		    if (pVariable.Type == STATIC_VARIABLE) {
                        s += "static " + vartype + " ";   
        		    }
                }			    
				s += GenerateEntity (type, entity, Operation, sRule);
			}
			par++;
		}
		s += ";";
	}
	else
	if ((sname.toUpperCase() == ">" ||
		 sname.toUpperCase() == ">=" ||
		 sname.toUpperCase() == "="  ||
		 sname.toUpperCase() == "<"  ||
		 sname.toUpperCase() == "<=")  &&
		 action.NbParam >= 2 &&
		 (WhichPar = OneParIsObjectLogicInput(action))) {

		ListParams = action.ListParams;
		
		var Firstentity  = null;
		var Secondentity = null;
		var Firstpvalue   = null;
		var Secondpvalue  = null;

		Firstentity  = ListParams[0];
		Secondentity = ListParams[1];

		Secondpvalue = Secondentity.Val;
		Firstpvalue  = Firstentity.Val;
		
		
		if (WhichPar == 1) 	{
			if (Secondentity.Type ==  'PLOPERATOR')
				s += GenerateAction (type, Firstentity.Val, Operation, sRule, GenerateAction (type, Secondentity.Val, Operation, sRule), sname);
			else
				s += GenerateAction (type, Firstentity.Val, Operation, sRule, GenerateEntity (type, Secondentity, Operation, sRule), sname);
		}
		else {
			var sOp = sname;

			if (sname.toUpperCase() == "<")  sOp = ">";
			else
			if (sname.toUpperCase() == "<=")  sOp = ">=";
			else
			if (sname.toUpperCase() == ">")  sOp = "<";
			else
			if (sname.toUpperCase() == ">=")  sOp = "<=";
			else
				sOp = "=";


			if (Firstentity.Type ==  'PLOPERATOR')
				s += GenerateAction (type, Secondentity.Val, Operation, sRule, GenerateAction (type, Firstentity.Val, Operation, sRule), sOp);
			else
				s += GenerateAction (type, Secondentity.Val, Operation, sRule, GenerateEntity (type, Firstentity, Operation, sRule), sOp);
		}
		//ignore other param;
	}
	else {
		if (sname.toUpperCase() == "AND" ||
			sname.toUpperCase() == "OR"  || 
			sname.toUpperCase() == "-"   ||
			sname.toUpperCase() == "+"   ||
			sname.toUpperCase() == "/"   ||
			sname.toUpperCase() == "*"   ||
			sname.toUpperCase() == "="   ||
			sname.toUpperCase() == ">" 	 ||
			sname.toUpperCase() == ">="  ||
			sname.toUpperCase() == "<" 	 ||
			sname.toUpperCase() == "<=") 
		{
			s += "(";
		}
		else
		if (sname.toUpperCase() == "NOT") 
		{
			s += "!";
		}
		else
		if (sname.IsObjectLogicInput())
		{
			if (InsideOperator == ">") s += sname + "_G" + "("; else
			if (InsideOperator == "<") s += sname + "_L" + "("; else
			if (InsideOperator == "<=") s += sname + "_LEq" + "(";else
			if (InsideOperator == ">=") s += sname + "_GEq" + "("; else
			if (InsideOperator == "=") s += sname + "_Eq" + "("; else
				s += "SValue" + "(";
		}
		else
		if (sname.toUpperCase() == "ABS" || sname.toUpperCase() == "MIN" || sname.toUpperCase() == "MAX") {
			s += GetOperatorFromType (type, sname.toUpperCase()) + "(";
		}
		else
		if (sname.toUpperCase() == "EXECUTE") {

			var entity = action.ListParams[0];
			var pValue =  entity.Val;
			s +=  pValue.Val + " (" + sOperation + ", " + sRule + ")";
			return s;
		}

		else {
			s += sname + "(";
			
		}

		var par = 0;
		for (var i = 0; i < action.ListParams.length; i++)	{
		
			entity =  action.ListParams[i];
			pvalue =  entity.Val;
		
			if (entity.Type ==  'PLOPERATOR')
				s += GenerateAction (type, entity.Val, Operation, sRule);
			else				
				s += GenerateEntity(type, entity, Operation, sRule);

			if (sname.toUpperCase() == "AND") 
			{
				if (action.ListParams.length == i + 1) s += ")";
				else s += " && ";
			}
			else
			if (sname.toUpperCase() == "OR") 
			{
				if (action.ListParams.length == i + 1) s += ")";
				else s += " || ";
			}
			else
			if (sname.toUpperCase() == "="    ||
				sname.toUpperCase() == "SETQ" ||
				sname.toUpperCase() == "-"    ||
				sname.toUpperCase() == "+"    ||
				sname.toUpperCase() == "*"    ||
				sname.toUpperCase() == "/"    ||
				sname.toUpperCase() == ">" 	  ||
				sname.toUpperCase() == ">="   ||
				sname.toUpperCase() == "<" 	  ||
				sname.toUpperCase() == "<=")  {
    				if (action.ListParams.length == i + 1) s += ")";
    				else 
    				{
    					if (sname.toUpperCase() == "=") 
    						s +=  " == " ;
    					else
    					if (sname.toUpperCase() == "SETQ") 
    						s +=  " = " ;
    					else
    					if (sname.toUpperCase() == "-") 
    						s +=  " - " ;
    					else
    					if (sname.toUpperCase() == "+") 
    						s +=  " + " ;
    					else
    					if (sname.toUpperCase() == "*") 
    						s +=  " * " ;
    					else
    					if (sname.toUpperCase() == "/") 
    						s +=  " / " ;
    					else
    						s +=  " " + sname + " ";
    				}
			}
			else
			if (sname.toUpperCase() == "ORPTS" ||
				sname.toUpperCase() == "ORS"   || 
				sname.toUpperCase() == "ANDPS" ||
				sname.toUpperCase() == "ORPS"  ||
				sname.toUpperCase() == "ANDTS" ||
				sname.toUpperCase() == "ORTS") {
				if (action.ListParams.length != i + 1) s += ", ";
				else s += ")";
			}
			else
			if (sname.IsObjectLogicInput ()) {
				if (par == 1 && InsidePar != "")  s+= ", " + InsidePar; 
				if (action.ListParams.length != i + 1) s += ", ";
				else s += ")";
			}
			else
			if (sname.toUpperCase() == "NOT") {
			}
			else {
				if (action.ListParams.length != i + 1) s += ", ";
				else s += ")";
			}
			par++;
		}
	}

    return s;
}

function OneParIsObjectLogicInput (action) {
	var par = 1;
	for (var i = 0; i < action.ListParams.length; i++)	{
		var pentity = action.ListParams[i];
		var pvalue  = pentity.Val;
		if (pentity.Type == 'PLOPERATOR' && pentity.Val.ActionClass.Name.IsObjectLogicInput ()) {
			return par;
		}
		par++;
	}
	return 0;
}

//////////////////////////////////GENERATE SS CODE FROM TREE ////////////////////////////////////////////////////////////////////////////////////
	
function SSFromNode (PG, markstring,  containerrootnode, Object, level, expand) {

	if (!Object) return "";

    if (expand) {
        var entity = Object.UserField;
  
        if (entity.FatherAction && entity.FatherAction.ActionClass.Name == "EXECUTE")  {
        	var condition = PG.GetConditionFromName (Object.Name[0]);
        	markstring = markstring + condition.SCContent;
        	return markstring;
        }
    }
    var tabstring = "";

	if (Object != containerrootnode) {
		if (Object.Space == "ACTION") {
			markstring = markstring + "("; 
			switch (Object.Name[0]) {
				case 'IF' :
					markstring = markstring + Object.Name[0] + "\n";
					level ++;
				break;
				default :	
					markstring = markstring + Object.Name[0] + " ";
				break;
			}
		}
		else {
			markstring = markstring + Object.Name[0] + " ";
		}
	}

	for (var i = 0; i < Object.Inherit.length; i++)	{
	    markstring = SSFromNode (PG, markstring, containerrootnode, Object.Inherit[i].ToNode, level, expand);
    }
    
	if (Object != containerrootnode) {
		if (Object.Space == "ACTION")	{
			markstring = markstring.substring(0, markstring.length -1) + ")\n";
			switch (Object.Name[0]) {
				case 'IF' :
					markstring += "\n";
				break;
			}				
			
		}
	}

	return markstring;
}	



function SSFromTree (pl, containerrootnode, Object) {

  
	if (!Object) return "";


	if (Object != containerrootnode) {
		if (Object.Space == "ACTION") {
			pl.SCContent = pl.SCContent + "("; 
		}
		pl.SCContent = pl.SCContent + Object.Name[0];
	}

	for (var i = 0; i < Object.Inherit.length; i++)	{
		if (i !=  Object.Inherit.length -1) pl.SCContent += " ";
        SSFromTree (pl, container, Object.Inherit[i].ToNode);
    }
    
	if (Object != containerrootnode) {
		if (Object.Space == "ACTION")	{
			pl.SCContent = pl.SCContent + ")\n"; 
		}
	}
	return pl.SCContent;
}


//////////////////////////// GENERATE TREE FROM SS //////////////////////////////////
	
function TreeFromSS  (pl, gse, section)	{
    
    var Section = pl.MainSection;
    var rootname = ROOTNAME;
    
	if (section) 
	    Section = section;
	
	gse.Clear ("RULES");
	var object = gse.MakeNode("RULES", "ACTION", 0, rootname);
	
	for (var j = 0; j < Section.ListEntities.length; j++) 
        gse.MakeLink ("RULES", "SESSIONLINK", object, TreeEntity(pl, gse, Section.ListEntities[j]));
	
    return object;
}
	
function TreeEntity (pl, gse, entity) {
    var object;
	var InName;

	if (entity.Type == 'PLATOM' || entity.Type == 'PLVARIABLE' || entity.Type == 'PLOBJECT')  {	// we should not have PLOBJECT but if ( missing)
        var Name = "";
		var Value = entity.Val;
		
        if (entity.Type == 'PLATOM')
        {
            switch (Value.Type) {

             case 'PLNULL' :
				InName = "NULL";                        
            break;
            case 'PLINTEGER' :
            case 'PLLONG' :
            case 'PLFLOAT' :
                {
                    InName = Value.Val;
                    Name = InName;
                }
				break;
            case 'PLBOOLEAN' :
                {
	                if (Value.Val == 0)
					{
						InName = "FALSE";                        
						Name = "FALSE";
					}
                    else     
					{
						InName = "TRUE";                        
						Name = "TRUE";
					}
                }
                break;
            case 'PLDATE'   :
            case 'PLTIME'   :
				InName = Value.Val;                        
                break;
            case 'PLSTRING' :
				InName = "\\" + Value.Val +  "\\";                        
                break;
            case 'PLCHAR'   :
				InName = "'" + Value.Val + "'";                        
                break;
            default :
                break;
            }
        }
        else 
			InName = entity.Val.Name;  

		object = gse.MakeNode ("RULES", "ATOM", 0, InName);
		object.UserField = entity;
		SetColor (object);
		return object;
	}
	else
    if (entity.Type == 'PLFIELD' || entity.Type == 'PLPERIOD'  || entity.Type == 'PLSIGNAL' || 
		entity.Type == 'PLFIELDDIRECTION' || entity.Type == 'PLFIELDDIRECTIONTYPE'  || entity.Type == 'PLFIELDEXITMODE' ||
		entity.Type == 'PLFIELDORDER' || entity.Type == 'PLFIELDORDERTYPE' || entity.Type == 'PLFIELDRECOVERYMODE')
    {
		var sName = entity.Val.Name;
		sName.toUpperCase();
		InName = sName;  
		object = gse.MakeNode ("RULES", "ATOM", 0, InName);
		object.UserField = entity;
		SetColor (object);
		return object;
	}
	else
    if (entity.Type == 'PLVALUE')
    {
		var sName = entity.Val.Name;
		InName = sName;  
		object = gse.MakeNode ("RULES", "ATOM", 0, InName);
		object.UserField = entity;
		SetColor (object);
		return object;
	}
	else
    if (entity.Type == 'PLOPERATOR')
    {
    	
		var action = entity.Val;
		InName = action.ActionClass.Name;
		action.UserField = null;

		// ERROR EXECUTE
		if (action.ActionClass.Name.IsLogical ()) 	{	
			var entity = action.ListParams[0];
			var value = entity.Val;

			object = gse.MakeNode ("RULES", "ACTION", 0, value.Val);
			object.UserField = entity;
			action.UserField = object;
			SetColor (object);
			
			
			object.Close = 1;
            return object;
		}	
		else
		if (InName.IsFunction ())
		{
			var pSection = action.Section;
			var pFirstentity = pSection.ListEntities[0];
			return object;


		}
		else
		if (InName.IsObjectLogic () || InName.IsObjectInput ())
		{
	// ERROR

			var s;
			s = InName;
            var Entity = entity;
			for (var i = 0; i < action.ListParams.length; i++) 
			{
				var entity = action.ListParams[i];
				
				if (entity.Type == 'PLVARIABLE')
				{
					InName =  " " + entity.Val.Name; 
					s += InName;
				}
				else
				if (entity.Type == 'PLFIELD' || entity.Type == 'PLVALUE' || entity.Type == 'PLPERIOD'  || entity.Type == 'PLSIGNAL')
				{
					InName =  " " +  entity.Val.Name; 
					s += InName;
				}
				else
				if (entity.Type == 'PLOPERATOR')
				{
					var action = entity.Val;
					strerr = "[line : " + action.LineNumber + "] Erreur (20) str (" + "Action in AndS Function)";
					InName = " " + "ACTION";    
					s += InName;
				}
				else
			    if (entity.Type == 'PLATOM')
				{
					InName =  " " + entity.Val.Val;    
					s += InName;
				}
				else
				{
					InName =  " " + entity.Val.Name; 
					s += InName;
				}
			}
			object = gse.MakeNode ("RULES", "ACTION", 0, s);
			object.UserField = Entity;
			action.UserField = object;
			SetColor (object);
			return object;	
		}

		object = gse.MakeNode ("RULES", "ACTION", 0, InName);
		object.UserField = entity;
		action.UserField = object;
		SetColor (object);
        
		for (var j = 0; j < action.ListParams.length; j++) 
			gse.MakeLink ("RULES", "SESSIONLINK", object, TreeEntity (pl, gse, action.ListParams[j]));
    }
	return object;
}

