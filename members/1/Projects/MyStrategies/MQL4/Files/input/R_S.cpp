/* ============================================================
STRATEGY : strategy_Q_0
RULE : S
=============================================================*/

void R_RULE (S)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_S, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_S, P_SIGNAL);}

