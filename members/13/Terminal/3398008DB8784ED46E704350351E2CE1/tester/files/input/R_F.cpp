/* ============================================================
STRATEGY : Follow_The_Candles
RULE : F
=============================================================*/

void R_RULE (F)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (AndS(BAR, S_BULL, P_H4, P_D1, P_W1, P_MN))

{ Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BEAR, P_H4, P_D1, P_W1, P_MN))

{ Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_F, P_SIGNAL);}

if (((GetDay(CurrentTime) == 6) && (CurrentTime >= ReturnTime("23:00:00")) && (RValue (OP_BUYSELL, T_PROFIT, R_F) >= 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_F) == 1) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_F) == 1) && (RValue (OP_BUYSELL, T_PROFIT, R_F) > 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BEAR, P_D1))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_F, P_SIGNAL);}

if (AndS(BAR, S_BULL, P_D1))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_F, P_SIGNAL);}
}

