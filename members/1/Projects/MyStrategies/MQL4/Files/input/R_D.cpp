/* ============================================================
STRATEGY : ENGULFING_D1
RULE : D
=============================================================*/

void R_RULE (D)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(BAR, S_BEAR_ENGULFING, P_D1))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);}

if (AndS(BAR, S_BULL_ENGULFING, P_D1))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);}
}

