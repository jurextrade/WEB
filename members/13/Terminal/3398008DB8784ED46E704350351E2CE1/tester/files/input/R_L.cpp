/* ============================================================
STRATEGY : Moving_Average_12
RULE : L
=============================================================*/

void R_RULE (L)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((SPValue(OPEN, S_CURRENT, CurrentPeriod) >= SValue(MA_12, S_CURRENT, CurrentPeriod)) && (SPValue(CLOSE, S_CURRENT, CurrentPeriod) <= SValue(MA_12, S_CURRENT, CurrentPeriod)) && AndS(SUPPORT, S_BELOW, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_L, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_L, P_SIGNAL);}

if (((SPValue(OPEN, S_CURRENT, CurrentPeriod) <= SValue(MA_12, S_CURRENT, CurrentPeriod)) && (SPValue(CLOSE, S_CURRENT, CurrentPeriod) >= SValue(MA_12, S_CURRENT, CurrentPeriod)) && AndS(RESISTANCE, S_ABOVE, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_L, P_SIGNAL);}
}

