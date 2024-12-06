/* ============================================================
STRATEGY : BAR_ONLY
RULE : N
=============================================================*/
void R_RULE(N) {
    //------------------------------BUYSELL ENGINE ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);
    if (AndS(BAR, S_BEAR_ENGULFING, CurrentPeriod)) {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_N, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);
    } else {
        if (AndS(BAR, S_BULL_ENGULFING, CurrentPeriod)) {
            Set_Rule(OP_CLOSE_SELL, T_STATUS, R_N, P_SIGNAL);
            Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);
        } else {
            if ((AndPS(BAR, S_BEAR_PTECZ, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN1, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN2, CurrentPeriod) || AndPS(BAR, S_BEAR_HARAMI, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR1, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, CurrentPeriod) || AndPS(BAR, S_BEAR_DARK_CLOUD_COVER, CurrentPeriod) || AndPS(BAR, S_BEAR_EVENING_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_EVENING_DOJI_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_BLACK_CROWS, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_INSIDE_DOWN, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_OUTSIDE_DOWN, CurrentPeriod))) {
                Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);
                Set_Rule(OP_CLOSE_BUY, T_STATUS, R_N, P_SIGNAL);
            }
            if ((AndPS(BAR, S_BULL_PTECZ, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER1, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER2, CurrentPeriod) || AndPS(BAR, S_BULL_HARAMI, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER1, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER2, CurrentPeriod) || AndPS(BAR, S_BULL_PIERCING_LINE, CurrentPeriod) || AndPS(BAR, S_BULL_MORNING_STAR, CurrentPeriod) || AndPS(BAR, S_BULL_MORNING_DOJI_STAR, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_WHITE_SOLDIERS, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_INSIDE_UP, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_OUTSIDE_UP, CurrentPeriod))) {
                Set_Rule(OP_CLOSE_SELL, T_STATUS, R_N, P_SIGNAL);
                Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);
            }
        }
    }
}