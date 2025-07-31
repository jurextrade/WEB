/* ============================================================
STRATEGY : BAR_PCTEZ
RULE : O
=============================================================*/

void R_RULE (O)
{

//------------------------------BUYSELL ENGINE ------------------------------


if (((SValue(EMA_8, S_CURRENT, CurrentPeriod) < SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndPS(BAR, S_BEAR_PTECZ, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_O, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_O, P_SIGNAL);}

if (((SValue(EMA_8, S_CURRENT, CurrentPeriod) < SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndS(BAR, S_BEAR_PTECZ, CurrentPeriod) && (Bid < SValue(BAR, S_BEAR_PTECZ, CurrentPeriod))))

{ Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_O, P_SIGNAL);Set_Rule(OP_CLOSE_BUY, T_STATUS, R_O, P_SIGNAL);}

if (((SValue(EMA_8, S_CURRENT, CurrentPeriod) > SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndPS(BAR, S_BULL_PTECZ, CurrentPeriod)))

{ Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_O, P_SIGNAL);}

if (((SValue(EMA_8, S_CURRENT, CurrentPeriod) > SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndS(BAR, S_BULL_PTECZ, CurrentPeriod) && (Ask > SValue(BAR, S_BULL_PTECZ, CurrentPeriod))))

{ Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);Set_Rule(OP_CLOSE_SELL, T_STATUS, R_O, P_SIGNAL);}

if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_O) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_O) == 0)))

{ Set_Rule(OP_EXIT, T_STATUS, R_O, P_SIGNAL);}
}

