#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : martingale
RULE : C
DESCRIPTION

=============================================================*/



void R_RULE (C)
{
//
//
//------------------------------BUY ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUY, T_DIRECTION, R_C, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUY, T_DIRECTIONTYPE, R_C, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUY, T_RECOVERYMODE, R_C, P_SIGNAL, M_M);
    Set_Rule(OP_BUY, T_RECOVERYVALUE, R_C, P_SIGNAL, 2);
    Set_Rule(OP_BUY, T_ILOT, R_C, P_SIGNAL, 0.1);
    Set_Rule(OP_BUY, T_MAXLOT, R_C, P_SIGNAL, 2);
    Set_Rule(OP_BUY, T_MAXCOUNT, R_C, P_SIGNAL, 5);
    Set_Rule(OP_BUY, T_KEEPBUYSELL, R_C, P_SIGNAL, false);
    Set_Rule(OP_BUY, T_EXITMODE, R_C, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUY, T_PIPSTEP, R_C, P_SIGNAL, 10);
    Set_Rule(OP_BUY, T_TIMESTEP, R_C, P_SIGNAL, 10);
    Set_Rule(OP_BUY, T_MAXTIME, R_C, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_HEDGEMAGNITUDE, R_C, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_BUYTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_SL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_C, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_C, P_SIGNAL, 20);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_START, R_C, P_SIGNAL);
    if (Candle_Buy_Entry_H1 (OP_BUY, R_C))
    {
        Set_Rule(OP_BUY, T_STATUS, R_C, P_SIGNAL);
    }
    Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);
//--------------END ACTIONS ------------------------------
//
//
//------------------------------ SELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_SELL, T_DIRECTION, R_C, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_SELL, T_DIRECTIONTYPE, R_C, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_SELL, T_RECOVERYMODE, R_C, P_SIGNAL, M_M);
    Set_Rule(OP_SELL, T_RECOVERYVALUE, R_C, P_SIGNAL, 2);
    Set_Rule(OP_SELL, T_ILOT, R_C, P_SIGNAL, 0.1);
    Set_Rule(OP_SELL, T_MAXLOT, R_C, P_SIGNAL, 2);
    Set_Rule(OP_SELL, T_MAXCOUNT, R_C, P_SIGNAL, 5);
    Set_Rule(OP_SELL, T_KEEPBUYSELL, R_C, P_SIGNAL, false);
    Set_Rule(OP_SELL, T_EXITMODE, R_C, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_SELL, T_PIPSTEP, R_C, P_SIGNAL, 10);
    Set_Rule(OP_SELL, T_TIMESTEP, R_C, P_SIGNAL, 10);
    Set_Rule(OP_SELL, T_MAXTIME, R_C, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_HEDGEMAGNITUDE, R_C, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_SELLTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_C, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_C, P_SIGNAL, 20);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_SELL, T_START, R_C, P_SIGNAL);
    if (Candle_Sell_Entry_H1 (OP_SELL, R_C))
    {
        Set_Rule(OP_SELL, T_STATUS, R_C, P_SIGNAL);
    }
    Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);
//--------------END ACTIONS ------------------------------
}
