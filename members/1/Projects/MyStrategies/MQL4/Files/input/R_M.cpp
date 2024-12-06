/* ============================================================
STRATEGY : RSI_CANDLE
RULE : M
=============================================================*/

void R_RULE (M)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);
if (((AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(RSI_Candles, S_ABOVE, P_D1)) && (AndBS(HEIKEN_ASHI, S_BULL, P_D1) || AndBS(HEIKEN_ASHI, S_BULL, P_W1) || AndBS(RSI_Candles, S_ABOVE, P_D1))))

{ Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);}

if (((AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(RSI_Candles, S_BELOW, P_D1)) && (AndBS(HEIKEN_ASHI, S_BEAR, P_D1) || AndBS(HEIKEN_ASHI, S_BEAR, P_W1) || AndBS(RSI_Candles, S_BELOW, P_D1))))

{ Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);}
}

