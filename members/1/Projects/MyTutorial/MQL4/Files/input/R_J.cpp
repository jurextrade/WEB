/* ============================================================
STRATEGY : PIVOT_PINBAR
RULE : J
=============================================================*/

void R_RULE (J)
{

//------------------------------BUYSELL ENGINE ------------------------------

phigh = SValue(HIGH, S_PREVIOUS, P_H1);plow = SValue(LOW, S_PREVIOUS, P_H1);bSL = plow;sSL = phigh;
if ((Prev_Bear_PinBar (OP_BUYSELL, R_J) && Prev_Bar_Intersect_Upper_Pivots (OP_BUYSELL, R_J)))

{ Set_Rule(OP_BUYSELL, T_START, R_J, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_J, P_SIGNAL);}

if ((Prev_Bull_PinBar (OP_BUYSELL, R_J) && Prev_Bar_Intersect_Lower_Pivots (OP_BUYSELL, R_J)))

{ Set_Rule(OP_BUYSELL, T_START, R_J, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_J, P_SIGNAL);}
}

