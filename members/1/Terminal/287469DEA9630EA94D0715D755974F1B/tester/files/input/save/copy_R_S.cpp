#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Velocity
RULE : S
DESCRIPTION

=============================================================*/



void R_RULE (S)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_S, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_S, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_S, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_S, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_S, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_S, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_S, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_S, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_S, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_S, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_S, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_S, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_S, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_S, P_SIGNAL, -200);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_S, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_S, P_SIGNAL, 50);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_S, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_S, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_S, P_SIGNAL, 50);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_S, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT_BUY, T_STATUS, R_S, P_SIGNAL);
    Set_Rule(OP_EXIT_SELL, T_STATUS, R_S, P_SIGNAL);
    if (Total_NbrTrades_0 (OP_BUYSELL, R_S))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_S, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((SValue(VELOCITY, S_CURRENT, P_M5) > 12))
    {
        Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_S, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_S, P_SIGNAL);
    }
    else
    {
        Set_Rule(OP_SELL, T_STATUS, R_S, P_SIGNAL);
    }
    if ((SValue(VELOCITY, S_CURRENT, P_M5) < -12))
    {
        Set_Rule(OP_BUYSELL, T_START, R_S, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_S, P_SIGNAL);
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_S, P_SIGNAL);
    }
    else
    {
        Set_Rule(OP_BUY, T_STATUS, R_S, P_SIGNAL);
    }
}
