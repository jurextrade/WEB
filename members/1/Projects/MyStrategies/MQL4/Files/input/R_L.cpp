/* ============================================================
STRATEGY : Momentum
RULE : L
=============================================================*/

void R_RULE (L)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);
if (AndS(Momentum, S_UP, P_H1))

{ Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);}

if (AndS(MOMENTUM, S_DOWN, P_H1))

{ Set_Rule(OP_SELL, T_STATUS, R_L, P_SIGNAL);}
}

