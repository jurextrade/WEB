/* ============================================================
STRATEGY : Pivot_Cross 
RULE : K
=============================================================*/

void R_RULE (K)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_K, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_K, P_SIGNAL);
if ((AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && (RValue (OP_BUYSELL, T_PROFITBUY, R_K) >= 10)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_K, P_SIGNAL);}

if ((AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && (RValue (OP_BUYSELL, T_PROFITSELL, R_K) >= 10)))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_K, P_SIGNAL);}

if ((AndS(PIVOT_RESISTANCE1, S_TOUCHED, P_D1) || AndS(PIVOT_SUPPORT1, S_TOUCHED, P_D1)))

{ Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);}

if (((TimeCurrent >= ReturnTime("23:28:22")) && (RValue (OP_BUYSELL, T_PROFIT, R_K) >= 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);}
}

