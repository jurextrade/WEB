/* ============================================================
STRATEGY : RSI_2P_H1
RULE : K
=============================================================*/
void R_RULE(K) {
    //------------------------------BUYSELL ENGINE ------------------------------
    if ((AndS(MA_200, S_ABOVE, CurrentPeriod) && AndS(RSI_2, S_OVERSOLD, CurrentPeriod))) {
        Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_K, P_SIGNAL);
        if ((RValue(OP_EXIT, T_MINPROFIT, R_K) == 0)) {
            Set_Rule(OP_EXIT, T_MINPROFIT, R_K, P_SIGNAL, (Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1.5)) * (10 * RValue(OP_BUYSELL, T_ILOT, R_K))));
        }
        if ((RValue(OP_BUYSELL, T_PIPSTEP, R_K) == 0)) {
            Set_Rule(OP_BUYSELL, T_PIPSTEP, R_K, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
    }
    if ((AndS(MA_200, S_BELOW, CurrentPeriod) && AndS(RSI_2, S_OVERBOUGHT, CurrentPeriod))) {
        Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_K, P_SIGNAL);
        if ((RValue(OP_EXIT, T_MINPROFIT, R_K) == 0)) {
            Set_Rule(OP_EXIT, T_MINPROFIT, R_K, P_SIGNAL, (Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1.5)) * (10 * RValue(OP_BUYSELL, T_ILOT, R_K))));
        }
        if ((RValue(OP_BUYSELL, T_PIPSTEP, R_K) == 0)) {
            Set_Rule(OP_BUYSELL, T_PIPSTEP, R_K, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
    }
    if ((RValue(OP_BUYSELL, T_BUYNBRTRADE, R_K) == 1)) {
        Set_Rule(OP_SELL, T_STATUS, R_K, P_SIGNAL);
    }
    if ((RValue(OP_BUYSELL, T_SELLNBRTRADE, R_K) == 1)) {
        Set_Rule(OP_BUY, T_STATUS, R_K, P_SIGNAL);
    }
    if (((RValue(OP_BUYSELL, T_BUYNBRTRADE, R_K) == 1) && (RValue(OP_BUYSELL, T_SELLNBRTRADE, R_K) == 1))) {
        if ((RValue(OP_BUYSELL, T_LASTORDERTYPE, R_K) == OP_BUY)) {
            Set_Rule(OP_CLOSE_SELL, T_STATUS, R_K, P_SIGNAL);
        }
        if ((RValue(OP_BUYSELL, T_LASTORDERTYPE, R_K) == OP_SELL)) {
            Set_Rule(OP_CLOSE_BUY, T_STATUS, R_K, P_SIGNAL);
        }
    }
    Set_Rule(OP_EXIT, T_MINPROFIT, R_K, P_SIGNAL, RValue(OP_EXIT, T_MINPROFIT, R_K));
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_K, P_SIGNAL, RValue(OP_BUYSELL, T_PIPSTEP, R_K));
    Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);
}