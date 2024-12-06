/* ============================================================
STRATEGY : BuySell
RULE : B
=============================================================*/

void R_RULE (B)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);
if (AndS(PROGRESS, S_BULL, P_H1))

{ 
if ((RValue (OP_BUYSELL, T_PROFITSELL, R_B) >= 10))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_B, P_SIGNAL);}
}

if (AndS(PROGRESS, S_BEAR, P_H1))

{ 
if ((RValue (OP_BUYSELL, T_PROFITBUY, R_B) >= 10))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_B, P_SIGNAL);}
}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_B) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_B) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_B, P_SIGNAL);}
}

