/* ============================================================
STRATEGY : FRACTAL_CROSS_H4
RULE : G
=============================================================*/
void R_RULE(G) {
    //------------------------------BUYSELL ENGINE ------------------------------
    if (((Bid < (SValue(DOWNFRACTAL, S_CURRENT, CurrentPeriod) - PipValue(5))) && AndS(DOWNFRACTAL, S_BELOW, CurrentPeriod))) {
        if ((T_SELLLOTSL == 0)) {
            Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_G, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
        if ((T_SELLLOTTS == 0)) {
            Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_G, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
        Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_G, P_SIGNAL);
    }
    if (((Bid > (SValue(UPFRACTAL, S_CURRENT, CurrentPeriod) + PipValue(5))) && AndS(UPFRACTAL, S_ABOVE, CurrentPeriod))) {
        if ((T_BUYLOTSL == 0)) {
            Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_G, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
        if ((T_BUYLOTTS == 0)) {
            Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_G, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
        }
        Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_G, P_SIGNAL);
    }
    TT_BUYLOTTS
}