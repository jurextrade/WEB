/* ============================================================
STRATEGY : Fractal_Changed
RULE : E
=============================================================*/

void R_RULE (E)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(UPFRACTAL, S_CHANGED, P_H4))

{ Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_E, P_SIGNAL);}

if (AndS(DOWNFRACTAL, S_CHANGED, P_H4))

{ Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_E, P_SIGNAL);}

if (((0 == RValue (OP_BUYSELL, T_BUYNBRTRADE, R_E)) && (0 == RValue (OP_BUYSELL, T_SELLNBRTRADE, R_E))))

{ Set_Rule(OP_EXIT, T_STATUS, R_E, P_SIGNAL);}
}

