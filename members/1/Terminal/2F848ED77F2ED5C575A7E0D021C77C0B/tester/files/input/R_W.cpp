/* ============================================================
STRATEGY : EMA Parabolic SAR
RULE : W
=============================================================*/

void R_RULE (W)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_W, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_W, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_W, P_SIGNAL);Set_Rule(OP_EXIT, T_STATUS, R_W, P_SIGNAL);}

