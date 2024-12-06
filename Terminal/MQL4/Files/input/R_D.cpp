/* ============================================================
STRATEGY : VELOCITY_M5
RULE : D
=============================================================*/
void R_RULE(D) {
    //------------------------------BUYSELL ENGINE ------------------------------
    if (AndS(VELOCITY, S_OVERBOUGHT, CurrentPeriod)) {
        Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);
    }
    if (AndS(VELOCITY, S_OVERSOLD, CurrentPeriod)) {
        Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);
    }
    if ((RValue(OP_BUYSELL, T_BUYLOTTP, R_D) == 0)) {
        Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 4)));
        Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
    }
    if ((RValue(OP_BUYSELL, T_SELLLOTTP, R_D) == 0)) {
        Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 4)));
        Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
    }
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_D, P_SIGNAL, Pips((SValue(ATR_14, S_CURRENT, CurrentPeriod) * 2)));
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_D, P_SIGNAL, RValue(OP_BUYSELL, T_SELLLOTTP, R_D));
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_D, P_SIGNAL, RValue(OP_BUYSELL, T_BUYLOTTP, R_D));
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, RValue(OP_BUYSELL, T_SELLLOTSL, R_D));
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, RValue(OP_BUYSELL, T_BUYLOTSL, R_D));
    if (((RValue(OP_BUYSELL, T_SELLNBRTRADE, R_D) == 0) && (RValue(OP_BUYSELL, T_BUYNBRTRADE, R_D) == 0))) {
        Set_Rule(OP_EXIT, T_STATUS, R_D, P_SIGNAL);
    }
}