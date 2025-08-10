/* ============================================================
STRATEGY : H_L_H4_BOX
RULE : H
=============================================================*/

void R_RULE (H)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);
if ((Bid > (SValue(HIGH, S_FIRSTINWEEK, P_H4) + PipValue(5))))

{ Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_BUYLOTSL, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}

if ((RValue (OP_BUYSELL, T_BUYLOTTS, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}
}
sdsds
if ((Bid < (SValue(LOW, S_FIRSTINWEEK, P_H4) - PipValue(5))))

{ Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
if ((RValue (OP_BUYSELL, T_SELLLOTSL, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}

if ((RValue (OP_BUYSELL, T_SELLLOTTS, R_H) == 0))

{ Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_H, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, P_H4) * 2)));}
}
Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTTS, R_H));Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTTS, R_H));Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_SELLLOTSL, R_H));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_H, P_SIGNAL, RValue (OP_BUYSELL, T_BUYLOTSL, R_H));
if (((GetDay(CurrentTime) == 6) && (CurrentTime >= ReturnTime("23:00:00"))))

{ Set_Rule(OP_EXIT, T_STATUS, R_H, P_SIGNAL);}
}

