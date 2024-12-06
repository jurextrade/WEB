/* ============================================================
STRATEGY : FRACTAL_CHANGED_H4
RULE : E
=============================================================*/
void R_RULE(E) {
    //------------------------------BUYSELL ENGINE ------------------------------
    //--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_E, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_E, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_E, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_E, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_E, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_E, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_E, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_E, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_E, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_E, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_E, P_SIGNAL, 10);
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
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_E, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_E, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_E, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_E, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_E, P_SIGNAL, 0);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_E, P_SIGNAL, 0);
    //--------------END PROPERTIES ------------------------------
    if (AndS(UPFRACTAL, S_CHANGED, P_H4)) {
        Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_E, P_SIGNAL);
    }
    if (AndS(DOWNFRACTAL, S_CHANGED, P_H4)) {
        Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_E, P_SIGNAL);
    }
    if (((0 == RValue(OP_BUYSELL, T_BUYNBRTRADE, R_E)) && (0 == RValue(OP_BUYSELL, T_SELLNBRTRADE, R_E)))) {
        Set_Rule(OP_EXIT, T_STATUS, R_E, P_SIGNAL);
    }
}