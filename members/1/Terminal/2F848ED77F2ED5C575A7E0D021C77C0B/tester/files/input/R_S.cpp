/* ============================================================
STRATEGY : Pivot_Point_Cross
RULE : S
=============================================================*/

void R_RULE (S)
{

//------------------------------BUYSELL ENGINE ------------------------------

Distance_From_Pivot = fabs((SValue(PIVOT_POINT, S_DISTANCE, P_D1) / Point));
if ((AndS(PIVOT_POINT, S_BELOW, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && (Distance_From_Pivot <= 10)))

{ Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_S, P_SIGNAL);}

if ((AndS(PIVOT_POINT, S_ABOVE, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && (Distance_From_Pivot <= 10)))

{ Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_S, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_S) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_S) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_S, P_SIGNAL);}
}

