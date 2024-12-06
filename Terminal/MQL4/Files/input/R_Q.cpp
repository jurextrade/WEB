/* ============================================================
STRATEGY : BAR_TOPPED
RULE : Q
=============================================================*/

void R_RULE (Q)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_Q, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_Q, P_SIGNAL);Set_Rule(OP_EXIT, T_STATUS, R_Q, P_SIGNAL);}

