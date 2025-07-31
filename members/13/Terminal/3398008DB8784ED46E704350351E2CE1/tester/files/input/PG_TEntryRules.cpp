#include "Progress.h"

extern "C" MT4_EXPFUNC void __cdecl MT4_TSetSystemObjects (double		_Ask, 
   													    double		_Bid, 
													    datetime	_TimeCurrent,
														int         _CurrentPeriod,
														int*         _Symbol,
														double		_Point,
														double		_Digits,
														int*		_SignalTab, 
														double*		_SignalTabValue, 
														datetime*	_SignalTabTime, 
														double*		_SignalTabPrice, 
														int*		_BeforeSignalTab, 
														double*		_BeforeSignalTabValue, 
														datetime*	_BeforeSignalTabTime, 
														double*		_BeforeSignalTabPrice, 
														int*		_BeforeSignalTickTab,
														int*		_RuleTab, 
														double*		_RuleTabValue, 
														int*		_BeforeRuleTab, 
														double*		_BeforeRuleTabValue)
{
	std::string	 Symbol =  std::string((char*)_Symbol);

	
	for (int i = (NBR_PERIODS -1); i >= P_M1; i--)    // we need bigger period for bob rules
		SetSystemObjects (i, _Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);

}

extern "C" MT4_EXPFUNC void __cdecl MT4_TSetEntryRules  (double		_Ask, 
   													    double		_Bid, 
													    datetime	_TimeCurrent,
														int         _CurrentPeriod,
														int*         _Symbol,
														double		_Point,
														double		_Digits,
														int*		_SignalTab, 
														double*		_SignalTabValue, 
														datetime*	_SignalTabTime, 
														double*		_SignalTabPrice, 
														int*		_BeforeSignalTab, 
														double*		_BeforeSignalTabValue, 
														datetime*	_BeforeSignalTabTime, 
														double*		_BeforeSignalTabPrice, 
														int*		_BeforeSignalTickTab,
														int*		_RuleTab, 
														double*		_RuleTabValue, 
														int*		_BeforeRuleTab, 
														double*		_BeforeRuleTabValue)
{
	
	std::string	 Symbol =  std::string((char*)_Symbol);

	R_A_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_B_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_C_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_D_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_E_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_F_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_G_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_H_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_I_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_J_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_K_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_L_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_M_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_N_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_O_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_P_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_Q_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_R_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_S_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_T_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_U_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_V_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_W_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_X_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
	R_Y_RULE (_Ask, _Bid, _TimeCurrent,_CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, 
			_BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
}
