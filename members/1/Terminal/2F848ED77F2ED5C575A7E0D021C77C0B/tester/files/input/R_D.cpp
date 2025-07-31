/* ============================================================
STRATEGY : VELOCITY_M5
RULE : D
=============================================================*/
void R_RULE_D() {
    //------------------------------BUYSELL ENGINE ------------------------------
    if ((AndS(VELOCITY, S_OVERSOLD, P_M5) && AndPS(VELOCITY, S_DOWN, P_M5))) {
        Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);
    }
    if ((AndS(VELOCITY, S_OVERBOUGHT, P_M5) && AndPS(VELOCITY, S_UP, P_M5))) {
        Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);
    }
    if (AndPS(VELOCITY, S_DOWN, P_M5)) {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_D, P_SIGNAL);
    }
    if (AndPS(VELOCITY, S_UP, P_M5)) {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_D, P_SIGNAL);
    }
}