#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"



bool _Prev_Narrow_day (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (((SValue(PIVOT_HIGH, S_CURRENT, P_D1) - SValue(PIVOT_LOW, S_CURRENT, P_D1)) / Point) <= 10);
}
bool _Breakout_Big_Candle_M15_Bull (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((fabs(SValue(BAR, S_PREVIOUS, P_M15)) > (SValue(ATR_14, S_PREVIOUS, P_M15) * 1.7)) && (SValue(HIGH, S_CURRENT, P_M15) > SValue(HIGH, S_PREVIOUS, P_M15)));
}
bool _Breakout_Big_Candle_M15_Bear (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((fabs(SValue(BAR, S_PREVIOUS, P_M15)) > (SValue(ATR_14, S_PREVIOUS, P_M15) * 1.7)) && (SValue(LOW, S_CURRENT, P_M15) < SValue(LOW, S_PREVIOUS, P_M15)));
}
bool _Trade_no (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) == 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _velocity_up (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(VELOCITY, S_ABOVE, P_M5) && AndS(VELOCITY, S_UP, P_M5));
}
bool _velocity_down (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(VELOCITY, S_BELOW, P_M5) && AndS(VELOCITY, S_DOWN, P_M5));
}
bool _volume_up (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(VOLUME, S_BULL, P_M5) && (SValue(VOLUME, S_CURRENT, P_M5) > 200));
}
bool _Momentum_is_bull (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(WPR_14, S_OVERBOUGHT, P_M1) || AndS(RSI_2, S_OVERBOUGHT, P_M1) || AndS(STOCHA_S, S_OVERBOUGHT, P_M1) || AndS(STOCHA_M, S_OVERBOUGHT, P_M1) || AndS(VELOCITY, S_OVERBOUGHT, P_M1));
}
bool _Momentum_is_bear (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(WPR_14, S_OVERSOLD, P_M1) || AndS(RSI_2, S_OVERSOLD, P_M1) || AndS(STOCHA_S, S_OVERSOLD, P_M1) || AndS(STOCHA_M, S_OVERSOLD, P_M1) || AndS(VELOCITY, S_BEAR, P_M1));
}
bool _volume_down (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(VOLUME, S_BEAR, P_M5) && (SValue(VOLUME, S_CURRENT, P_M5) > 200));
}
bool _Trade_only_buy (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) > 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) == 0));
}
bool _Trade_only_sell (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_SELLNBRTRADE, Rule) > 0) && (RValue (Operation, T_BUYNBRTRADE, Rule) == 0));
}
bool _Trade_buy_profit_positif (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (RValue (Operation, T_PROFITBUY, Rule) >= 0);
}
bool _Trade_sell_profit_positif (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (RValue (Operation, T_PROFITSELL, Rule) >= 0);
}
bool _Trade_buy_and_sell (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_BUYNBRTRADE, Rule) > 0) && (RValue (Operation, T_SELLNBRTRADE, Rule) > 0));
}
bool _RSI_20_HEIKEN_BULL (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(RSI_20, S_ABOVE, P_D1));
}
bool _RSI_20_HEIKEN_BEAR (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(RSI_20, S_BELOW, P_D1));
}
bool _CROSS_DOWN_CLOSE_PREVIOUS_BEAR (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BEAR, P_H1) && AndTS(CLOSE, S_CROSS_DOWN, P_H1));
}
bool _CROSS_UP_CLOSE_PREVIOUS_BULL (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BULL, P_H1) && AndTS(CLOSE, S_CROSS_UP, P_H1));
}
bool _Pivots_Alert (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(PIVOT_POINT, S_ALERT, P_D1) || AndS(PIVOT_HIGH, S_ALERT, P_D1) || AndS(PIVOT_LOW, S_ALERT, P_D1));
}
bool _Pivots_Touch (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(PIVOT_POINT, S_TOUCHED, P_D1) || AndS(PIVOT_HIGH, S_TOUCHED, P_D1) || AndS(PIVOT_LOW, S_TOUCHED, P_D1));
}
bool _Candle_Buy_Entry_H4 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndTS(BAR, S_BULL_ENGULFING, P_H4) || (AndPS(BAR, S_BULL, P_H4) && AndTS(CLOSE, S_CROSS_UP, P_H4)) || ((fabs(SValue(BAR, S_CURRENT, P_H4)) > (SValue(ATR_14, S_CURRENT, P_H4) * 1.3)) && AndS(BAR, S_BULL, P_H4) && AndS(HIGH, S_ABOVE, P_H4)));
}
bool _Candle_Sell_Entry_H4 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndTS(BAR, S_BEAR_ENGULFING, P_H4) || (AndPS(BAR, S_BEAR, P_H4) && AndTS(CLOSE, S_CROSS_DOWN, P_H4)) || ((fabs(SValue(BAR, S_CURRENT, P_H4)) > (SValue(ATR_14, S_CURRENT, P_H4) * 1.3)) && AndS(BAR, S_BEAR, P_H4) && AndS(LOW, S_BELOW, P_H4)));
}
bool _Candle_Buy_Exit_H4 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && ((AndS(BAR, S_CHANGED, P_H4) && AndPS(LOW, S_DOWN, P_H4)) || AndS(LOW, S_BELOW, P_H4) || ((((SValue(HIGH, S_CURRENT, P_H4) - SValue(CLOSE, S_CURRENT, P_H4)) / Point) > 10) && AndTS(BAR, S_BEAR, P_H4))));
}
bool _Candle_Sell_Exit_H4 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && ((AndS(BAR, S_CHANGED, P_H4) && AndPS(HIGH, S_UP, P_H4)) || AndS(HIGH, S_ABOVE, P_H4) || ((((SValue(LOW, S_CURRENT, P_H4) - SValue(CLOSE, S_CURRENT, P_H4)) / Point) < -10) && AndTS(BAR, S_BULL, P_H4))));
}
bool _Candle_Buy_Entry_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndTS(BAR, S_BULL_ENGULFING, P_H1) || (AndPS(BAR, S_BULL, P_H1) && AndTS(CLOSE, S_CROSS_UP, P_H1)) || ((fabs(SValue(BAR, S_CURRENT, P_H1)) > (SValue(ATR_14, S_CURRENT, P_H1) * 1.0)) && AndS(BAR, S_BULL, P_H1) && AndS(HIGH, S_ABOVE, P_H1)));
}
bool _Candle_Sell_Entry_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndTS(BAR, S_BEAR_ENGULFING, P_H1) || (AndPS(BAR, S_BEAR, P_H1) && AndTS(CLOSE, S_CROSS_DOWN, P_H1)) || ((fabs(SValue(BAR, S_CURRENT, P_H1)) > (SValue(ATR_14, S_CURRENT, P_H1) * 1.0)) && AndS(BAR, S_BEAR, P_H1) && AndS(LOW, S_BELOW, P_H1)));
}
bool _Candle_Buy_Exit_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && (Candle_Bear_Changed_H1 (Operation, Rule) || AndS(LOW, S_BELOW, P_H1)));
}
bool _Candle_Sell_Exit_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && (Candle_Bull_Changed_H1 (Operation, Rule) || AndS(HIGH, S_ABOVE, P_H1)));
}
bool _Candle_Buy_Entry_M30 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndTS(BAR, S_BULL_ENGULFING, P_M30) || (AndPS(BAR, S_BULL, P_M30) && AndTS(CLOSE, S_CROSS_UP, P_M30)) || ((fabs(SValue(BAR, S_CURRENT, P_M30)) > (SValue(ATR_14, S_CURRENT, P_M30) * 1.3)) && AndS(BAR, S_BULL, P_M30) && AndS(HIGH, S_ABOVE, P_M30)));
}
bool _Candle_Sell_Entry_M30 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndTS(BAR, S_BEAR_ENGULFING, P_M30) || (AndPS(BAR, S_BEAR, P_M30) && AndTS(CLOSE, S_CROSS_DOWN, P_M30)) || ((fabs(SValue(BAR, S_CURRENT, P_M30)) > (SValue(ATR_14, S_CURRENT, P_M30) * 1.3)) && AndS(BAR, S_BEAR, P_M30) && AndS(LOW, S_BELOW, P_M30)));
}
bool _Candle_Buy_Exit_M30 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && ((AndS(BAR, S_CHANGED, P_M30) && AndPS(LOW, S_DOWN, P_M30)) || AndS(LOW, S_BELOW, P_M30) || ((((SValue(HIGH, S_CURRENT, P_M30) - SValue(CLOSE, S_CURRENT, P_M30)) / Point) > 10) && AndTS(BAR, S_BEAR, P_M30))));
}
bool _Candle_Sell_Exit_M30 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && ((AndS(BAR, S_CHANGED, P_M30) && AndPS(HIGH, S_UP, P_M30)) || AndS(HIGH, S_ABOVE, P_M30) || ((((SValue(LOW, S_CURRENT, P_M30) - SValue(CLOSE, S_CURRENT, P_M30)) / Point) < -10) && AndTS(BAR, S_BULL, P_M30))));
}
bool _Trade_Buy_Candle (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_LASTORDERTYPE, Rule) == 0) && (RValue (Operation, T_LASTORDEROPENPRICE, Rule) > SValue(OPEN, S_CURRENT, P_H4)) && (RValue (Operation, T_LASTORDERCLOSEPROFIT, Rule) > 0));
}
bool _FractalUp_Approaching_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((SValue(UPFRACTAL, S_DISTANCE, P_H1) > (-5 * Point)) && (SValue(UPFRACTAL, S_DISTANCE, P_H1) < 0));
}
bool _Candle_Buy_Entry_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(BAR, S_BULL_ENGULFING, P_D1) || (AndPS(BAR, S_BULL, P_D1) && (AndS(CLOSE, S_REVERSE_UP, P_D1) || (!AndS(CLOSE, S_REVERSE_DOWN, P_D1) && AndS(CLOSE, S_CROSS_UP, P_D1)))) || ((fabs(SValue(BAR, S_CURRENT, P_D1)) > (SValue(ATR_14, S_CURRENT, P_D1) * 1.3)) && AndS(BAR, S_BULL, P_D1) && AndS(HIGH, S_ABOVE, P_D1)));
}
bool _Candle_Buy_Exit_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && (Candle_Sell_Entry_D1 (Operation, Rule) || AndS(LOW, S_BELOW, P_D1) || ((((SValue(HIGH, S_CURRENT, P_D1) - SValue(CLOSE, S_CURRENT, P_D1)) / Point) > 10) && AndTS(BAR, S_BEAR, P_D1))));
}
bool _Candle_Sell_Entry_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(BAR, S_BEAR_ENGULFING, P_D1) || (AndPS(BAR, S_BEAR, P_D1) && (AndS(CLOSE, S_REVERSE_DOWN, P_D1) || (!AndS(CLOSE, S_REVERSE_UP, P_D1) && AndS(CLOSE, S_CROSS_DOWN, P_D1)))) || ((fabs(SValue(BAR, S_CURRENT, P_D1)) > (SValue(ATR_14, S_CURRENT, P_D1) * 1.3)) && AndS(BAR, S_BEAR, P_D1) && AndS(LOW, S_BELOW, P_D1)));
}
bool _Candle_Sell_Exit_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (!Trade_no (Operation, Rule) && (Candle_Buy_Entry_D1 (Operation, Rule) || AndS(HIGH, S_ABOVE, P_D1) || ((((SValue(LOW, S_CURRENT, P_D1) - SValue(CLOSE, S_CURRENT, P_D1)) / Point) < -10) && AndTS(BAR, S_BULL, P_D1))));
}
bool _FractalDown_Approaching_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((SValue(DOWNFRACTAL, S_DISTANCE, P_H1) < (5 * Point)) && (SValue(DOWNFRACTAL, S_DISTANCE, P_H1) > 0));
}
bool _FractalUp_Approaching_H4 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((SValue(UPFRACTAL, S_DISTANCE, P_H4) > (-5 * Point)) && (SValue(UPFRACTAL, S_DISTANCE, P_H4) < 0));
}
bool _FractalDown_Approaching_H4 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((SValue(DOWNFRACTAL, S_DISTANCE, P_H4) < (5 * Point)) && (SValue(DOWNFRACTAL, S_DISTANCE, P_H4) > 0));
}
bool _FractalDown_Approaching_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((SValue(DOWNFRACTAL, S_DISTANCE, P_D1) < (5 * Point)) && (SValue(DOWNFRACTAL, S_DISTANCE, P_D1) > 0));
}
bool _FractalUp_Approaching_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((SValue(UPFRACTAL, S_DISTANCE, P_D1) > (-5 * Point)) && (SValue(UPFRACTAL, S_DISTANCE, P_D1) < 0));
}
bool _FractalUp_Approaching (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (FractalUp_Approaching_H1 (Operation, Rule) || FractalUp_Approaching_H4 (Operation, Rule) || FractalUp_Approaching_D1 (Operation, Rule));
}
bool _FractalDown_Approaching (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (FractalDown_Approaching_H1 (Operation, Rule) || FractalDown_Approaching_H4 (Operation, Rule) || FractalDown_Approaching_D1 (Operation, Rule));
}
bool _Gap_Down_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (SValue(OPEN, S_CURRENT, P_D1) < (SValue(CLOSE, S_PREVIOUS, P_D1) - (5 * Point)));
}
bool _Gap_Up_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (SValue(OPEN, S_CURRENT, P_D1) > (SValue(CLOSE, S_PREVIOUS, P_D1) + (5 * Point)));
}
bool _Candle_Bull_Changed_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((((SValue(LOW, S_CURRENT, P_H1) - SValue(CLOSE, S_CURRENT, P_H1)) / Point) < -5) && AndTS(BAR, S_BULL, P_H1));
}
bool _Candle_Bear_Changed_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((((SValue(HIGH, S_CURRENT, P_H1) - SValue(CLOSE, S_CURRENT, P_H1)) / Point) > 5) && AndTS(BAR, S_BEAR, P_H1));
}
bool _Pivot_Up_Approaching_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (((SValue(PIVOT_HIGH, S_DISTANCE, P_D1) > (-5 * Point)) && (SValue(PIVOT_HIGH, S_DISTANCE, P_D1) < 0)) || ((SValue(PIVOT_RESISTANCE, S_DISTANCE, P_D1) > (-5 * Point)) && (SValue(PIVOT_RESISTANCE, S_DISTANCE, P_D1) < 0)));
}
bool _Pivot_Down_Approaching_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (((SValue(PIVOT_LOW, S_DISTANCE, P_D1) < (5 * Point)) && (SValue(PIVOT_LOW, S_DISTANCE, P_D1) > 0)) || ((SValue(PIVOT_SUPPORT, S_DISTANCE, P_D1) < (5 * Point)) && (SValue(PIVOT_SUPPORT, S_DISTANCE, P_D1) > 0)));
}
bool _Trade_Buy_OnBar_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_LASTORDEROPENTIME, Rule) > STime(BAR, S_CURRENT, P_H1)) && (RValue (Operation, T_LASTORDERTYPE, Rule) == 0));
}
bool _Trade_Sell_OnBar_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((RValue (Operation, T_LASTORDEROPENTIME, Rule) > STime(BAR, S_CURRENT, P_H1)) && (RValue (Operation, T_LASTORDERTYPE, Rule) == 1));
}
bool _Candle_Min_Size (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((fabs(SValue(BAR, S_CURRENT, P_H1)) / Point) > 5);
}
bool _ShouldExit (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (TimeCurrent > ReturnTime("22:00:00"));
}
bool _ShouldStart (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return ((TimeCurrent < ReturnTime("22:00:00")) && (TimeCurrent > ReturnTime("02:00:00")));
}
bool _Fractal_Up_Zone (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return OrS(UPFRACTAL, S_ALERT, P_M30, P_H1, P_H4, P_D1);
}
bool _Fractal_Down_Zone (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return OrS(DOWNFRACTAL, S_ALERT, P_M30, P_H1, P_H4, P_D1);
}
bool _Pivot_Down_Zone (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (OrS(PIVOT_LOW, S_ALERT, P_D1) || OrS(PIVOT_SUPPORT, S_ALERT, P_D1) || OrS(PIVOT_SUPPORT1, S_ALERT, P_D1) || OrS(PIVOT_SUPPORT2, S_ALERT, P_D1));
}
bool _Pivot_Up_Zone (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (OrS(PIVOT_HIGH, S_ALERT, P_D1) || OrS(PIVOT_RESISTANCE, S_ALERT, P_D1) || OrS(PIVOT_RESISTANCE1, S_ALERT, P_M30, P_D1) || OrS(PIVOT_RESISTANCE2, S_ALERT, P_D1));
}
bool _Candle_Hammer_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(BAR, S_BULL_HAMMER1, P_D1) || AndS(BAR, S_BULL_HAMMER2, P_D1));
}
bool _Candle_ShootingStar_D1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndS(BAR, S_BEAR_SHOOTING_STAR1, P_D1) || AndS(BAR, S_BEAR_SHOOTING_STAR2, P_D1));
}
bool _Candle_Hammer_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BULL_HAMMER1, P_H1) || AndPS(BAR, S_BULL_HAMMER2, P_H1) || AndPS(BAR, S_BULL_HAMMER, P_H1));
}
bool _Candle_ShootingStar_H1 (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue, int Operation, int Rule) 
{
	return (AndPS(BAR, S_BEAR_SHOOTING_STAR1, P_H1) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, P_H1) || AndPS(BAR, S_BEAR_SHOOTING_STAR, P_H1));
}
