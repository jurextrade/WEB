/* ============================================================
STRATEGY : Engulfing_H4
RULE : F
=============================================================*/

void R_RULE (F)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(BAR, S_BEAR_ENGULFING, P_H4))

{ Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BULL_ENGULFING, P_H4))

{ Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_F, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_F) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_F) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);}
}

