#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : CROSS_CLOSE_D1
RULE : I
DESCRIPTION

=============================================================*/



void R_RULE (I)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_I, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_I, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_I, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_I, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_I, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_I, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_I, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_I, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_I, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_I, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_I, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_I, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_I, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_I, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_I, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_I, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_I, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_I, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_I, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_I, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_I, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Total_NbrTrades_0 (OP_BUYSELL, R_I))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_I, P_SIGNAL);
    }
    if (Time_More_2340 (OP_BUYSELL, R_I))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_I, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (CROSS_DOWN_CLOSE_D1_PREVIOUS_BEAR (OP_BUYSELL, R_I))
    {
        Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_I, P_SIGNAL);
    }
    if (CROSS_UP_CLOSE_D1_PREVIOUS_BULL (OP_BUYSELL, R_I))
    {
        Set_Rule(OP_BUYSELL, T_START, R_I, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_I, P_SIGNAL);
    }
}
