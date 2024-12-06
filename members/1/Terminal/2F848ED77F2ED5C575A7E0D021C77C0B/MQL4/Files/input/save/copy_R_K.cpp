#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Gap
RULE : K
DESCRIPTION

=============================================================*/



void R_RULE (K)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_K, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_K, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_K, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_K, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_K, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_K, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_K, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_K, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_K, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_K, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_K, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_K, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_K, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_K, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_K, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_K, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    if ((Gap_Down_D1 (OP_BUYSELL, R_K) && AndS(BAR, S_BULL, P_H1) && AndS(CLOSE, S_BELOW, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_K, P_SIGNAL);
    }
    if ((Gap_Up_D1 (OP_BUYSELL, R_K) && AndS(BAR, S_BEAR, P_H1) && AndS(CLOSE, S_ABOVE, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_K, P_SIGNAL);
    }
    if ((AndS(CLOSE, S_CROSS_DOWN, P_D1) || AndS(CLOSE, S_CROSS_UP, P_D1)))
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_K, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_K, P_SIGNAL);
    }
}
