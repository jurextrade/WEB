#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Alambex
RULE : H
DESCRIPTION

=============================================================*/



void R_RULE (H)
{
//
//
//------------------------------BUY ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUY, T_DIRECTION, R_H, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUY, T_DIRECTIONTYPE, R_H, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUY, T_RECOVERYMODE, R_H, P_SIGNAL, M_A);
    Set_Rule(OP_BUY, T_RECOVERYVALUE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_ILOT, R_H, P_SIGNAL, 0.1);
    Set_Rule(OP_BUY, T_MAXLOT, R_H, P_SIGNAL, 3);
    Set_Rule(OP_BUY, T_MAXCOUNT, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_KEEPBUYSELL, R_H, P_SIGNAL, false);
    Set_Rule(OP_BUY, T_EXITMODE, R_H, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUY, T_PIPSTEP, R_H, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_TIMESTEP, R_H, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_MAXTIME, R_H, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_HEDGEMAGNITUDE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_BUYTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_SL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTP, R_H, P_SIGNAL, 10);
    Set_Rule(OP_BUY, T_BUYLOTSL, R_H, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_H, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_H, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_START, R_H, P_SIGNAL);//
//
//------------------------------ SELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_SELL, T_DIRECTION, R_H, P_SIGNAL, D_ANY);
    Set_Rule(OP_SELL, T_DIRECTIONTYPE, R_H, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_SELL, T_RECOVERYMODE, R_H, P_SIGNAL, M_A);
    Set_Rule(OP_SELL, T_RECOVERYVALUE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_ILOT, R_H, P_SIGNAL, 0.1);
    Set_Rule(OP_SELL, T_MAXLOT, R_H, P_SIGNAL, 3);
    Set_Rule(OP_SELL, T_MAXCOUNT, R_H, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_KEEPBUYSELL, R_H, P_SIGNAL, false);
    Set_Rule(OP_SELL, T_EXITMODE, R_H, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_SELL, T_PIPSTEP, R_H, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_TIMESTEP, R_H, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_MAXTIME, R_H, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_HEDGEMAGNITUDE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_SELLTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTP, R_H, P_SIGNAL, 10);
    Set_Rule(OP_SELL, T_SELLLOTSL, R_H, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_H, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_H, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_SELL, T_START, R_H, P_SIGNAL);
}
