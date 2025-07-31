/* ============================================================
STRATEGY : EMA20_SAR
RULE : V
=============================================================*/

void R_RULE (V)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_V) == 0) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_V) == 0)))

{ Set_Rule(OP_BUYSELL, T_ORDERTYPE, R_V, P_SIGNAL, OT_HEDGE);}

if ((AndS(SAR, S_BULL, CurrentPeriod) && AndS(EMA_20, S_ABOVE, CurrentPeriod) && AndS(SAR, S_CHANGED, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_V, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_V, P_SIGNAL);}

if ((AndS(SAR, S_BEAR, CurrentPeriod) && AndS(EMA_20, S_BELOW, CurrentPeriod) && AndS(SAR, S_CHANGED, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_V, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_V, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_PROFIT, R_V) > 5) && AndS(SAR, S_BEAR, CurrentPeriod)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_V, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_PROFIT, R_V) > 5) && AndS(SAR, S_BULL, CurrentPeriod)))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_V, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_V) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_V) == 0)))

{ Set_Rule(OP_EXIT, T_MINPROFIT, R_V, P_SIGNAL, 0);}
Set_Rule(OP_EXIT, T_STATUS, R_V, P_SIGNAL);}

