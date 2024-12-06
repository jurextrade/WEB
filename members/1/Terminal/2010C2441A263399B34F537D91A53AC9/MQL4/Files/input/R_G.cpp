/* ============================================================
STRATEGY : FRACTAL_CROSS
RULE : G
=============================================================*/
void R_RULE(G) {
    //------------------------------BUYSELL ENGINE ------------------------------
    if (AndS(DOWNFRACTAL, S_CROSS_DOWN, CurrentPeriod)) {
        Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_G, P_SIGNAL);
    }
    if (AndS(UPFRACTAL, S_CROSS_UP, CurrentPeriod)) {
        Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_G, P_SIGNAL);
    }
    Set_Rule(OP_EXIT, T_STATUS, R_G, P_SIGNAL);
}