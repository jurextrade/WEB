#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Alambex
RULE : J
DESCRIPTION

=============================================================*/



void R_RULE (J)
{
//
//
//------------------------------BUY ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUY, T_DIRECTION, R_J, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUY, T_DIRECTIONTYPE, R_J, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUY, T_RECOVERYMODE, R_J, P_SIGNAL, M_A);
    Set_Rule(OP_BUY, T_RECOVERYVALUE, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_ILOT, R_J, P_SIGNAL, 0.1);
    Set_Rule(OP_BUY, T_MAXLOT, R_J, P_SIGNAL, 3);
    Set_Rule(OP_BUY, T_MAXCOUNT, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_KEEPBUYSELL, R_J, P_SIGNAL, false);
    Set_Rule(OP_BUY, T_EXITMODE, R_J, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUY, T_PIPSTEP, R_J, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_TIMESTEP, R_J, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_MAXTIME, R_J, P_SIGNAL, -1);
    Set_Rule(OP_BUY, T_HEDGEMAGNITUDE, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUY, T_BUYTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYTP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYSL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_TP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_SL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUY, T_BUYLOTTP, R_J, P_SIGNAL, 10);
    Set_Rule(OP_BUY, T_BUYLOTSL, R_J, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_J, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_J, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_STATUS, R_J, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_START, R_J, P_SIGNAL);//
//
//------------------------------ SELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_SELL, T_DIRECTION, R_J, P_SIGNAL, D_ANY);
    Set_Rule(OP_SELL, T_DIRECTIONTYPE, R_J, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_SELL, T_RECOVERYMODE, R_J, P_SIGNAL, M_A);
    Set_Rule(OP_SELL, T_RECOVERYVALUE, R_J, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_ILOT, R_J, P_SIGNAL, 0.1);
    Set_Rule(OP_SELL, T_MAXLOT, R_J, P_SIGNAL, 3);
    Set_Rule(OP_SELL, T_MAXCOUNT, R_J, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_KEEPBUYSELL, R_J, P_SIGNAL, false);
    Set_Rule(OP_SELL, T_EXITMODE, R_J, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_SELL, T_PIPSTEP, R_J, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_TIMESTEP, R_J, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_MAXTIME, R_J, P_SIGNAL, -1);
    Set_Rule(OP_SELL, T_HEDGEMAGNITUDE, R_J, P_SIGNAL, 1);
    Set_Rule(OP_SELL, T_SELLTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLTP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLSL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_TP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_SELL, T_SELLLOTTP, R_J, P_SIGNAL, 10);
    Set_Rule(OP_SELL, T_SELLLOTSL, R_J, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_J, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_J, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_SELL, T_STATUS, R_J, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_SELL, T_START, R_J, P_SIGNAL);
}
