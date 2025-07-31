/* ============================================================
STRATEGY : HIGH_LOW_OF_DAY
RULE : R
=============================================================*/

void R_RULE (R)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((!AndS(CLOSE, S_MININDAY, CurrentPeriod) && AndS(CLOSE, S_MAXINDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_R, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_R, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTTS, R_R) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_R, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}

if ((!AndS(CLOSE, S_MAXINDAY, CurrentPeriod) && AndS(CLOSE, S_MININDAY, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_R, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTTS, R_R) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_R, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
Set_Rule(OP_SELL, T_STATUS, R_R, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_R, P_SIGNAL, 0);Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_R, P_SIGNAL, 0);
if (((GetDay(CurrentTime) == 6) && (CurrentTime >= ReturnTime("23:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_R, P_SIGNAL);}
}

