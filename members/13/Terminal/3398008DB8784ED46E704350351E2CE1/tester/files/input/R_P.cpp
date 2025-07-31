/* ============================================================
STRATEGY : BAR_CORRECTION
RULE : P
=============================================================*/

void R_RULE (P)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((SValue(EMA_8, S_CURRENT, CurrentPeriod) > SValue(EMA_20, S_CURRENT, CurrentPeriod)))

{ 
if ((AndPS(LOW, S_DOWN, CurrentPeriod) && AndPS(HIGH, S_DOWN, CurrentPeriod) && AndS(HIGH, S_ABOVE, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_P, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTP, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}
}else 
{Set_Rule(OP_CLOSE_BUY, T_STATUS, R_P, P_SIGNAL);}

if ((SValue(EMA_8, S_CURRENT, CurrentPeriod) < SValue(EMA_20, S_CURRENT, CurrentPeriod)))

{ 
if ((AndPS(LOW, S_UP, CurrentPeriod) && AndPS(HIGH, S_UP, CurrentPeriod) && AndS(LOW, S_BELOW, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_P, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTP, R_P) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_P, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}
}else 
{Set_Rule(OP_CLOSE_SELL, T_STATUS, R_P, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTP, R_P));Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTP, R_P));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_P));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_P, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_P));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_P) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_P) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_P, P_SIGNAL);}
}

