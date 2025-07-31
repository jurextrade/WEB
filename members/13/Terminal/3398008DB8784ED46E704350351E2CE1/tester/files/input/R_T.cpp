#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : FRACTALS_H4
RULE : T
DESCRIPTION

=============================================================*/



void R_RULE (T)
{
//
//
//------------------------------BUY ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUY, T_DIRECTION, R_T, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUY, T_DIRECTIONTYPE, R_T, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUY, T_RECOVERYMODE, R_T, P_SIGNAL, M_C);
    Set_Rule(OP_BUY, T_RECOVERYVALUE, R_T, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_ILOT, R_T, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_MAXLOT, R_T, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_MAXCOUNT, R_T, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_KEEPBUYSELL, R_T, P_SIGNAL, false);
    Set_Rule(OP_BUY, T_EXITMODE, R_T, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUY, T_PIPSTEP, R_T, P_SIGNAL, 10);
    Set_Rule(OP_BUY, T_TIMESTEP, R_T, P_SIGNAL, 10);
    Set_Rule(OP_BUY, T_MAXTIME, R_T, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_HEDGEMAGNITUDE, R_T, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_BUYTS, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYTP, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYSL, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TS, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TP, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_SL, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTS, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTP, R_T, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTSL, R_T, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_T, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_T, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    if ((AndBS(UPFRACTAL, S_ABOVE, P_H4) && AndPS(HIGH, S_UP, P_H4)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_T, P_SIGNAL);
        Set_Rule(OP_BUY, T_START, R_T, P_SIGNAL);
    }
    if ((Ask < SPValue(LOW, S_CURRENT, P_H4)))
    {
        Set_Rule(OP_EXIT_BUY, T_STATUS, R_T, P_SIGNAL);
    }
//
//
//------------------------------ SELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_SELL, T_DIRECTION, R_T, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_SELL, T_DIRECTIONTYPE, R_T, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_SELL, T_RECOVERYMODE, R_T, P_SIGNAL, M_C);
    Set_Rule(OP_SELL, T_RECOVERYVALUE, R_T, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_ILOT, R_T, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_MAXLOT, R_T, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_MAXCOUNT, R_T, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_KEEPBUYSELL, R_T, P_SIGNAL, false);
    Set_Rule(OP_SELL, T_EXITMODE, R_T, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_SELL, T_PIPSTEP, R_T, P_SIGNAL, 10);
    Set_Rule(OP_SELL, T_TIMESTEP, R_T, P_SIGNAL, 10);
    Set_Rule(OP_SELL, T_MAXTIME, R_T, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_HEDGEMAGNITUDE, R_T, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_SELLTS, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLTP, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLSL, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TS, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TP, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SL, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTS, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTP, R_T, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTSL, R_T, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_T, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_T, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    if ((AndBS(DOWNFRACTAL, S_BELOW, P_H4) && AndPS(LOW, S_DOWN, P_H4)))
    {
        Set_Rule(OP_SELL, T_STATUS, R_T, P_SIGNAL);
        Set_Rule(OP_SELL, T_START, R_T, P_SIGNAL);
    }
    if ((Bid > SPValue(HIGH, S_CURRENT, P_H4)))
    {
        Set_Rule(OP_EXIT_SELL, T_STATUS, R_T, P_SIGNAL);
    }
}
