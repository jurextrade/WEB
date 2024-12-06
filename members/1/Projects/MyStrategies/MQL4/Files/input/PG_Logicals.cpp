#include "Progress.h"
#include "PG_Objects.h"



bool _Total_NbrTrades_0 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((0 == RValue (Operation, T_BUYNBRTRADE, Rule)) && (0 == RValue (Operation, T_SELLNBRTRADE, Rule)));
}
bool _Engulfing_BULL_H1_H4_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return OrS(BAR, S_BULL_ENGULFING, P_H1, P_H4, P_D1);
}
bool _Engulfing_BEAR_H1_H4_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return OrS(BAR, S_BEAR_ENGULFING, P_H1, P_H4, P_D1);
}
bool _Momentum_BULL (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (SValue(Momentum, S_CURRENT, P_H1) > 100.5);
}
bool _Momentum_BEAR (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (SValue(Momentum, S_CURRENT, P_H1) < 99.5);
}
bool _Velocity_Bear (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return AndS(VELOCITY, S_OVERSOLD, P_M5);
}
bool _Velocity_Bull (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return AndS(VELOCITY, S_OVERBOUGHT, P_M5);
}
bool _Trades_Sell_And_Buy (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!(RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && !(RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Prev_SS_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BEAR_SHOOTING_STAR, P_D1) || AndPS(BAR, S_BEAR_SHOOTING_STAR1, P_D1) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, P_D1));
}
bool _Prev_Hammer_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BULL_HAMMER, P_D1) || AndPS(BAR, S_BULL_HAMMER1, P_D1) || AndPS(BAR, S_BULL_HAMMER2, P_D1));
}
bool _Time_More_2340 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (TimeCurrent > ReturnTime("23:40:59"));
}
bool _CROSS_UP_CLOSE_D1_PREVIOUS_BULL (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BULL, P_D1) && AndS(CLOSE, S_CROSS_UP, P_D1));
}
bool _CROSS_DOWN_CLOSE_D1_PREVIOUS_BEAR (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BEAR, P_D1) && AndS(CLOSE, S_CROSS_DOWN, P_D1));
}
bool _REVERSE_UP_CLOSE (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return AndS(CLOSE, S_REVERSE_UP, P_M1);
}
bool _angle_up_15_10 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (((SValue(LOW, S_CURRENT, P_M1) > SValue(EMA_34, S_CURRENT, P_M1)) && (SValue(LOW, S_CURRENT, P_H1) > SValue(EMA_34, S_CURRENT, P_H1))) && (SValue(EMA_34, S_ANGLE, P_M1) > 15) && (SValue(EMA_34, S_ANGLE, P_H1) > 10));
}
bool _angle_down_15_10 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (((SValue(HIGH, S_CURRENT, P_M1) < SValue(EMA_34, S_CURRENT, P_M1)) && (SValue(HIGH, S_CURRENT, P_H1) < SValue(EMA_34, S_CURRENT, P_H1))) && (SValue(EMA_34, S_ANGLE, P_M1) < -15) && (SValue(EMA_34, S_ANGLE, P_H1) < -10));
}
bool _Trade_no (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Trade_no1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Trade_no12 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Trade_no123 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Trade_no1234 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
