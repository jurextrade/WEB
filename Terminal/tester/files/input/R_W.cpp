/* ============================================================
STRATEGY : Singapore_Swing
RULE : W
=============================================================*/
void R_RULE(W) {
    //------------------------------BUYSELL ENGINE ------------------------------
    if ((!Trade_Buy_OnBar_H1(OP_BUYSELL, R_W) && AndS(Singapore_Swing, S_SELL, P_H1))) {
        Set_Rule(OP_BUYSELL, T_START, R_W, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_W, P_SIGNAL);
    }
    if ((!Trade_Sell_OnBar_H1(OP_BUYSELL, R_W) && AndS(Singapore_Swing, S_BUY, P_H1))) {
        Set_Rule(OP_BUYSELL, T_START, R_W, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_W, P_SIGNAL);
    }
}