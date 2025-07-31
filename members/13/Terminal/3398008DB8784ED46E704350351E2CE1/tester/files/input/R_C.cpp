/* ============================================================
STRATEGY : GRID
RULE : C
=============================================================*/

void R_RULE (C)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_C, P_SIGNAL);
if (((SValue(CLOSE, S_CURRENT, CurrentPeriod) > SPValue(HIGH, S_PREVIOUS, CurrentPeriod)) && (SValue(CLOSE, S_CURRENT, CurrentPeriod) > SValue(HIGH, S_PREVIOUS, CurrentPeriod)) && AndPS(LOW, S_DOWN, CurrentPeriod)))

{ Set_Rule(OP_BUY, T_STATUS, R_C, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_C, P_SIGNAL);}

if (((SValue(CLOSE, S_CURRENT, CurrentPeriod) < SPValue(LOW, S_PREVIOUS, CurrentPeriod)) && (SValue(CLOSE, S_CURRENT, CurrentPeriod) < SValue(LOW, S_PREVIOUS, CurrentPeriod)) && AndPS(HIGH, S_UP, CurrentPeriod)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_C, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_C, P_SIGNAL);}
Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);}

