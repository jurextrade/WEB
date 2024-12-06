#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

bool _volume_up (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(VOLUME, S_BULL, P_M5) && (SValue(VOLUME, S_CURRENT, P_M5) > 200));
}

bool _volume_down (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(VOLUME, S_BEAR, P_M5) && (SValue(VOLUME, S_CURRENT, P_M5) > 200));
}
bool _Trade_only_buy (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) > 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Trade_only_sell (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_SELLNBRTRADE, Rule) > 0) && (RValue (Operation, T_BUYNBRTRADE, Rule) == 0));
}
bool _Trade_buy_profit_positif (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (RValue (Operation, T_PROFITBUY, Rule) >= 0);
}
bool _Trade_sell_profit_positif (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (RValue (Operation, T_PROFITSELL, Rule) >= 0);
}
bool _Trade_buy_and_sell (double Ask, double Bid, datetime CurrentTime, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) > 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) > 0));
}