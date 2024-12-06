/* ============================================================
STRATEGY : BAR_ONLY
RULE : E
=============================================================*/
void R_RULE(E) {
    //------------------------------BUYSELL ENGINE ------------------------------
    //--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_E, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_E, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_E, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_E, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_ILOT, R_E, P_SIGNAL, 0.3);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_E, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_E, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_E, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_E, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_E, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_E, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_E, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_E, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_E, P_SIGNAL, 0);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_E, P_SIGNAL, 50);
    //--------------END PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);
    if ((AndPS(BAR, S_BEAR_PTECZ, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN1, CurrentPeriod) || AndPS(BAR, S_BEAR_HANGING_MAN2, CurrentPeriod) || AndPS(BAR, S_BEAR_ENGULFING, CurrentPeriod) || AndPS(BAR, S_BEAR_HARAMI, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR1, CurrentPeriod) || AndPS(BAR, S_BEAR_SHOOTING_STAR2, CurrentPeriod) || AndPS(BAR, S_BEAR_DARK_CLOUD_COVER, CurrentPeriod) || AndPS(BAR, S_BEAR_EVENING_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_EVENING_DOJI_STAR, CurrentPeriod) || AndPS(BAR, S_BEAR_THREE_BLACK_CROWS, CurrentPeriod))) {
        Set_Rule(OP_SELL, T_STATUS, R_E, P_SIGNAL);
    }
    if ((AndPS(BAR, S_BULL_PTECZ, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER1, CurrentPeriod) || AndPS(BAR, S_BULL_HAMMER2, CurrentPeriod) || AndPS(BAR, S_BULL_ENGULFING, CurrentPeriod) || AndPS(BAR, S_BULL_HARAMI, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER1, CurrentPeriod) || AndPS(BAR, S_BULL_INVERTED_HAMMER2, CurrentPeriod) || AndPS(BAR, S_BULL_PIERCING_LINE, CurrentPeriod) || AndPS(BAR, S_BULL_MORNING_STAR, CurrentPeriod) || AndPS(BAR, S_BULL_MORNING_DOJI_STAR, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_WHITE_SOLDIERS, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_INSIDE_UP, CurrentPeriod) || AndPS(BAR, S_BULL_THREE_OUTSIDE_UP, CurrentPeriod))) {
        Set_Rule(OP_BUY, T_STATUS, R_E, P_SIGNAL);
    }
    Set_Rule(OP_EXIT, T_STATUS, R_E, P_SIGNAL);
}