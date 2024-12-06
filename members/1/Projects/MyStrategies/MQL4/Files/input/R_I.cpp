/* ============================================================
STRATEGY : CROSS_CLOSE_D1
RULE : I
=============================================================*/

void R_RULE (I)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (CROSS_DOWN_CLOSE_D1_PREVIOUS_BEAR (OP_BUYSELL, R_I))

{ Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_I, P_SIGNAL);}

if (CROSS_UP_CLOSE_D1_PREVIOUS_BULL (OP_BUYSELL, R_I))

{ Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_I, P_SIGNAL);}
}

