var R_Q_RULE = function() {
    if ((AndPS(BAR, S_BULL, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && AndS(BAR, S_BEAR, CurrentPeriod) && AndS(LOW, S_BELOW, CurrentPeriod) && AndV_LEq(EMA_20, S_ANGLE, -20, CurrentPeriod))) {
        Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_Q, P_SIGNAL);
        if ((RValue(OP_BUYSELL, T_SELLLOTSL, R_Q) == 0)) {
            Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_Q, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
        console.log ('start');
    }
    if ((AndPS(BAR, S_BEAR, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && AndS(BAR, S_BULL, CurrentPeriod) && AndS(HIGH, S_ABOVE, CurrentPeriod) && AndV_GEq(EMA_20, S_ANGLE, 20, CurrentPeriod))) {
        Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_Q, P_SIGNAL);
        if ((RValue(OP_BUYSELL, T_BUYLOTSL, R_Q) == 0)) {
            Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_Q, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
    }
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_Q, P_SIGNAL, RValue(OP_BUYSELL, T_SELLLOTSL, R_Q));
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_Q, P_SIGNAL, RValue(OP_BUYSELL, T_BUYLOTSL, R_Q));
    if (((RValue(OP_BUYSELL, T_SELLNBRTRADE, R_Q) == 0) && (RValue(OP_BUYSELL, T_BUYNBRTRADE, R_Q) == 0))) {
        Set_Rule(OP_EXIT, T_STATUS, R_Q, P_SIGNAL);
    }
}