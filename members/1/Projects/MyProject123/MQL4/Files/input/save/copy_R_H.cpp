#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : ProgressSimple
RULE : H
DESCRIPTION

=============================================================*/



void R_H_RULE ()
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_H, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_H, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_H, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_H, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_H, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_H, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_H, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_H, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_H, P_SIGNAL, -200);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_H, P_SIGNAL, 100);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_H, P_SIGNAL, 100);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_H, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT_BUY, T_STATUS, R_H, P_SIGNAL);
    Set_Rule(OP_EXIT_SELL, T_STATUS, R_H, P_SIGNAL);
    if (Total_NbrTrades_0 (OP_BUYSELL, R_H))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_H, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndS(PROGRESS, S_BUY, P_H1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_H, P_SIGNAL);
    }
    else
    {
        Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
    }
    if (AndS(PROGRESS, S_SELL, P_H1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_H, P_SIGNAL);
    }
    else
    {
        Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
    }
}
