/* ============================================================
STRATEGY : RSI_CANDLE1
RULE : R
=============================================================*/

void R_RULE (R)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_R, P_SIGNAL);
if (((AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(RSI_20, S_ABOVE, P_D1)) && (AndBS(HEIKEN_ASHI, S_BULL, P_D1) || AndBS(HEIKEN_ASHI, S_BULL, P_W1) || AndBS(RSI_20, S_ABOVE, P_D1))))

{ Set_Rule(OP_BUY, T_STATUS, R_R, P_SIGNAL);}

if (((AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(RSI_20, S_BELOW, P_D1)) && (AndBS(HEIKEN_ASHI, S_BEAR, P_D1) || AndBS(HEIKEN_ASHI, S_BEAR, P_W1) || AndBS(RSI_20, S_BELOW, P_D1))))

{ Set_Rule(OP_SELL, T_STATUS, R_R, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_R) > 0) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_R) > 0)))

{ Set_Rule(OP_BUYSELL, T_TS, R_R, P_SIGNAL, 100);Set_Rule(OP_BUYSELL, T_BUYTS, R_R, P_SIGNAL, 0);Set_Rule(OP_BUYSELL, T_SELLTS, R_R, P_SIGNAL, 0);}
}

