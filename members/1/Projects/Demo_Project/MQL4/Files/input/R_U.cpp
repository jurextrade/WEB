/* ============================================================
STRATEGY : Volume_Bull_Bear
RULE : U
=============================================================*/
void R_RULE(U) {
    //------------------------------BUYSELL ENGINE ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_U, P_SIGNAL);
    if ((AndS(VOLUME, S_UP, CurrentPeriod) && AndS(VELOCITY, S_OVERBOUGHT, CurrentPeriod))) {
        Set_Rule(OP_BUY, T_STATUS, R_U, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_U, P_SIGNAL);
    }
    if ((AndS(VOLUME, S_UP, CurrentPeriod) && AndPS(VELOCITY, S_OVERSOLD, CurrentPeriod))) {
        Set_Rule(OP_SELL, T_STATUS, R_U, P_SIGNAL);
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_U, P_SIGNAL);
    }
    Set_Rule(OP_EXIT, T_STATUS, R_U, P_SIGNAL);
    Set_Rule(OP_EXIT_BUY, T_STATUS, R_U, P_SIGNAL);
    Set_Rule(OP_EXIT_SELL, T_STATUS, R_U, P_SIGNAL);
}