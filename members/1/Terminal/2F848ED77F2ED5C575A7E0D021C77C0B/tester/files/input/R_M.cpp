/* ============================================================
STRATEGY : R_S
RULE : M
=============================================================*/

void R_RULE (M)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(SUPPORT, S_CROSS_DOWN, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);}

if (AndS(RESISTANCE, S_CROSS_UP, CurrentPeriod))

{ Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_M, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_M, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
if (AndS(UPFRACTAL, S_CHANGED, CurrentPeriod))

{}

if (AndS(DOWNFRACTAL, S_CHANGED, CurrentPeriod))

{}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_M) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_M) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_M, P_SIGNAL);}
}

