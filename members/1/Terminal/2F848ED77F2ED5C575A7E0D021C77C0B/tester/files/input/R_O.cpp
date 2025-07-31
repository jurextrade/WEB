var R_O_RULE = function() {
    if (((AndS(BAR, S_BEAR, CurrentPeriod) && AndPS(BAR, S_BULL, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && (Bid < SPValue(LOW, S_PREVIOUS, CurrentPeriod))) || (AndS(BAR, S_BEAR_QUAD, CurrentPeriod) && (Bid < SValue(BAR, S_BEAR_QUAD, CurrentPeriod))))) {
        Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_O, P_SIGNAL);
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_O, P_SIGNAL);
        if ((RValue(OP_BUYSELL, T_SELLLOTSL, R_O) == 0)) {
            Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));
        }
        if ((RValue(OP_BUYSELL, T_SELLLOTTP, R_O) == 0)) {
            Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));
        }
    }
    if (((AndS(BAR, S_BULL, CurrentPeriod) && AndPS(BAR, S_BEAR, CurrentPeriod) && (SPValue(BAR, S_NBRBARS, CurrentPeriod) > 1) && (Ask > SPValue(HIGH, S_PREVIOUS, CurrentPeriod))) || (AndS(BAR, S_BULL_QUAD, CurrentPeriod) && (Ask > SValue(BAR, S_BULL_QUAD, CurrentPeriod))))) {
        Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_O, P_SIGNAL);
        if ((RValue(OP_BUYSELL, T_BUYLOTSL, R_O) == 0)) {
            Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));
        }
        if ((RValue(OP_BUYSELL, T_BUYLOTTP, R_O) == 0)) {
            Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_O, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 1)));
        }
    }
    if (((RValue(OP_BUYSELL, T_SELLNBRTRADE, R_O) == 0) && (RValue(OP_BUYSELL, T_BUYNBRTRADE, R_O) == 0))) {
        Set_Rule(OP_EXIT, T_STATUS, R_O, P_SIGNAL);
    }
}