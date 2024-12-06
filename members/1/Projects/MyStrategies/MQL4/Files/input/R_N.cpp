/* ============================================================
STRATEGY : RSI8_CCI14
RULE : N
=============================================================*/

void R_RULE (N)
{

//------------------------------BUYSELL ENGINE ------------------------------

Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);
if ((AndS(RSI_CCI, S_SELL, P_M5) && AndS(HEIKEN_ASHI, S_BEAR, P_M5)))

{ Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);}

if ((AndS(RSI_CCI, S_BUY, P_M5) && AndS(HEIKEN_ASHI, S_BULL, P_M5)))

{ Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);}
}

