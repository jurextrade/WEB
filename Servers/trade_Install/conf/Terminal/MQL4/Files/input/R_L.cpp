/* ============================================================
STRATEGY : MA_BULL_BEAR
RULE : L
=============================================================*/
void R_RULE(L) {
    //------------------------------BUYSELL ENGINE ------------------------------
    if (((SValue(EMA_20, S_ANGLE, CurrentPeriod) < 0) && (SPValue(OPEN, S_CURRENT, CurrentPeriod) >= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && (SPValue(CLOSE, S_CURRENT, CurrentPeriod) <= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndPS(BAR, S_BEAR, CurrentPeriod))) {
        Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_L, P_SIGNAL);
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_L, P_SIGNAL);
    }
    if (((SValue(EMA_20, S_ANGLE, CurrentPeriod) > 0) && (SPValue(OPEN, S_CURRENT, CurrentPeriod) <= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && (SPValue(CLOSE, S_CURRENT, CurrentPeriod) >= SValue(EMA_20, S_CURRENT, CurrentPeriod)) && AndPS(BAR, S_BULL, CurrentPeriod))) {
        Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_L, P_SIGNAL);
    }
    if ((SPValue(LOW, S_CURRENT, CurrentPeriod) > SValue(EMA_20, S_CURRENT, CurrentPeriod))) {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_L, P_SIGNAL);
    }
    if ((SPValue(HIGH, S_CURRENT, CurrentPeriod) < SValue(EMA_20, S_CURRENT, CurrentPeriod))) {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_L, P_SIGNAL);
    }
}