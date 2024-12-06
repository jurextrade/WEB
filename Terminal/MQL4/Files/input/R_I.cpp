/* ============================================================
STRATEGY : Daily_Green_red_Candle
RULE : I
=============================================================*/

void R_RULE (I)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((SValue(BAR, S_NBRBARS, P_D1) == 2) && AndS(BAR, S_BULL, P_D1) && AndS(HIGH, S_UP, P_D1)))

{ Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_I, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTP, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}
}

if (((SValue(BAR, S_NBRBARS, P_D1) == 2) && AndS(BAR, S_BEAR, P_D1) && AndS(LOW, S_DOWN, P_D1)))

{ Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_I, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTP, R_I) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));}
}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_I, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_D1) * 1)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTS, R_I));Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTS, R_I));Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTP, R_I));Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTP, R_I));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_I));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_I, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_I));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_I) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_I) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_I, P_SIGNAL);}
}

