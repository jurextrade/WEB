/* ============================================================
STRATEGY : PivotLow Cross Line
RULE : P
=============================================================*/

void R_RULE (P)
{

//------------------------------BUYSELL ENGINE ------------------------------

Distance_From_Low = fabs((SValue(PIVOT_LOW, S_DISTANCE, P_D1) / Point));
if (((AndPS(BAR, S_BEAR_SHOOTING_STAR, P_D1) || AndPS(BAR, S_BEAR_SHOOTING_STAR1, P_D1) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, P_D1) || AndPS(BAR, S_BEAR, P_D1)) && !AndS(PIVOT_LOW, S_CROSS_DOWN, P_D1) && AndS(PIVOT_LOW, S_ABOVE, P_D1) && (Distance_From_Low <= 150)))

{ Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_P, P_SIGNAL);}
}

