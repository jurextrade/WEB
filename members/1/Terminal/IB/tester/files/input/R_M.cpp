/* ============================================================
STRATEGY : RSI_20_HEIKEN
RULE : M
=============================================================*/

void R_RULE (M)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (RSI_20_HEIKEN_BULL (OP_BUYSELL, R_M))

{ Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);}

if (RSI_20_HEIKEN_BEAR (OP_BUYSELL, R_M))

{ Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);}

if (Trade_buy_and_sell (OP_BUYSELL, R_M))

{ Set_Rule(OP_BUYSELL, T_TS, R_M, P_SIGNAL, 100);Set_Rule(OP_BUYSELL, T_BUYTS, R_M, P_SIGNAL, 0);Set_Rule(OP_BUYSELL, T_SELLTS, R_M, P_SIGNAL, 0);}

if ((!RSI_20_HEIKEN_BULL (OP_BUYSELL, R_M) && !Trade_Buy_OnBar_H1 (OP_BUYSELL, R_M)))

{ Set_Rule(OP_CLOSE_BUY, T_STATUS, R_M, P_SIGNAL);}

if ((!RSI_20_HEIKEN_BEAR (OP_BUYSELL, R_M) && !Trade_Sell_OnBar_H1 (OP_BUYSELL, R_M)))

{ Set_Rule(OP_CLOSE_SELL, T_STATUS, R_M, P_SIGNAL);}
}

