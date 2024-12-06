/* ============================================================
STRATEGY : TRIX_CROSS
RULE : L
=============================================================*/

void R_RULE (L)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndPS(HIGH, S_MININWEEK, CurrentPeriod) && AndPS(HIGH, S_MININDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);}

if ((AndPS(HIGH, S_MAXINWEEK, CurrentPeriod) && AndPS(HIGH, S_MAXINDAY, CurrentPeriod) && (!AndS(CLOSE, S_MININDAY, CurrentPeriod) && AndS(CLOSE, S_MAXINDAY, CurrentPeriod))))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_L, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1.5)));}

if ((AndPS(LOW, S_MININWEEK, CurrentPeriod) && AndPS(LOW, S_MININDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);}

if ((AndPS(LOW, S_MAXINWEEK, CurrentPeriod) && AndPS(LOW, S_MAXINDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_L, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1.5)));}
Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_L, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_L));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_L, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_L));Set_Rule(OP_EXIT, T_STATUS, R_L, P_SIGNAL);}

