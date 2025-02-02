/* ============================================================
STRATEGY : strategy_C_0
RULE : A
=============================================================*/

void R_RULE (A)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);}

