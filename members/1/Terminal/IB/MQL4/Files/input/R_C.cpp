/* ============================================================
STRATEGY : strategy_K_PIVOT_GRID
RULE : C
=============================================================*/

void R_RULE (C)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_C, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_C, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_C, P_SIGNAL);
if ((AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && (RValue (OP_BUYSELL, T_PROFITBUY, R_C) >= 10)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_C, P_SIGNAL);}

if ((AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && (RValue (OP_BUYSELL, T_PROFITSELL, R_C) >= 10)))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_C, P_SIGNAL);}

if ((AndS(PIVOT_RESISTANCE1, S_CROSS_UP, P_D1) || AndS(PIVOT_SUPPORT1, S_CROSS_DOWN, P_D1)))

{ Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);}

if (((CurrentTime >= ReturnTime("23:28:22")) && (RValue (OP_BUYSELL, T_PROFIT, R_C) >= 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);}
}

