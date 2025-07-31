/* ============================================================
STRATEGY : ProgressSimple
RULE : A
=============================================================*/

void R_RULE (A)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(PROGRESS, S_BUY, P_H4) && AndS(PROGRESS, S_BUY, P_D1, P_W1)))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_A, P_SIGNAL);Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_A) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_A, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTP, R_A) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_A, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}
}

if ((AndS(PROGRESS, S_SELL, P_H4) && AndS(PROGRESS, S_SELL, P_D1, P_W1)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_A, P_SIGNAL);Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_A) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_A, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTP, R_A) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_A, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}
}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_A, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_A, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_A, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTP, R_A));Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_A, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTP, R_A));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_A, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_A));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_A, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_A));
if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_A) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_A) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);}
}

