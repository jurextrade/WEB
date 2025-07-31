/* ============================================================
STRATEGY : HIGH_LOW_OF_WEEK
RULE : B
=============================================================*/

void R_RULE (B)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((!AndS(CLOSE, S_MININWEEK, CurrentPeriod) && AndS(CLOSE, S_MAXINWEEK, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_B, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTTS, R_B) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_B, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
}

if ((!AndS(CLOSE, S_MAXINWEEK, CurrentPeriod) && AndS(CLOSE, S_MININWEEK, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTTS, R_B) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_B, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));}
Set_Rule(OP_SELL, T_STATUS, R_B, P_SIGNAL);}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_B, P_SIGNAL, 0);Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_B, P_SIGNAL, 0);
if (((GetDay(CurrentTime) == 6) && (CurrentTime >= ReturnTime("23:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_B, P_SIGNAL);}
}

