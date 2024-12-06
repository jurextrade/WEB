/* ============================================================
STRATEGY : TRIX_CROSS
RULE : D
=============================================================*/

void R_RULE (D)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(F_TRIX, S_RCROSSED, CurrentPeriod) && (SValue(F_TRIX, S_RCROSSED, CurrentPeriod) == 1)))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_D) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1.5)));}
}

if ((AndS(F_TRIX, S_RCROSSED, CurrentPeriod) && (SValue(F_TRIX, S_RCROSSED, CurrentPeriod) == 0)))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_D) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1.5)));}
}
Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_D));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_D));Set_Rule(OP_EXIT, T_STATUS, R_D, P_SIGNAL);}

