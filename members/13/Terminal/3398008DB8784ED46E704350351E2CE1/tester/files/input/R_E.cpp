/* ============================================================
STRATEGY : strategy_L_0
RULE : E
=============================================================*/

void R_RULE (E)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(MA_200, S_ABOVE, P_H1) && AndS(RSI_2, S_OVERSOLD, P_H1)))

{ Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_E, P_SIGNAL);
if ((RValue (OP_EXIT, T_MINPROFIT,R_E) == 0))

{ Set_Rule(OP_EXIT, T_MINPROFIT, R_E, P_SIGNAL, (Pips((SValue(ATR_14, S_CURRENT, P_H1) * 1.5)) * (10 * RValue (OP_BUYSELL, T_ILOT, R_E))));}

if ((RValue (OP_BUYSELL, T_PIPSTEP, R_E) == 0))

{ Set_Rule(OP_BUYSELL, T_PIPSTEP, R_E, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H1) * 2)));}
}

if ((AndS(MA_200, S_BELOW, P_H1) && AndS(RSI_2, S_OVERBOUGHT, P_H1)))

{ Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_E, P_SIGNAL);
if ((RValue (OP_EXIT, T_MINPROFIT,R_E) == 0))

{ Set_Rule(OP_EXIT, T_MINPROFIT, R_E, P_SIGNAL, (Pips((SValue(ATR_14, S_CURRENT, P_H1) * 1.5)) * (10 * RValue (OP_BUYSELL, T_ILOT, R_E))));}

if ((RValue (OP_BUYSELL, T_PIPSTEP, R_E) == 0))

{ Set_Rule(OP_BUYSELL, T_PIPSTEP, R_E, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H1) * 2)));}
}

if ((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_E) == 1))

{ Set_Rule(OP_SELL, T_STATUS, R_E, P_SIGNAL);}

if ((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_E) == 1))

{ Set_Rule(OP_BUY, T_STATUS, R_E, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_E) == 1) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_E) == 1)))

{ 
if ((RValue (OP_BUYSELL, T_LASTORDERTYPE, R_E) == OP_BUY))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_E, P_SIGNAL);}

if ((RValue (OP_BUYSELL, T_LASTORDERTYPE, R_E) == OP_SELL))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_E, P_SIGNAL);}
}
Set_Rule(OP_EXIT, T_MINPROFIT, R_E, P_SIGNAL, RValue (OP_EXIT, T_MINPROFIT,R_E));Set_Rule(OP_BUYSELL, T_PIPSTEP, R_E, P_SIGNAL, RValue (OP_BUYSELL, T_PIPSTEP, R_E));Set_Rule(OP_EXIT, T_STATUS, R_E, P_SIGNAL);}

