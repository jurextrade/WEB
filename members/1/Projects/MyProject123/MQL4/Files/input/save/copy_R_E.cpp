#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Martingale
RULE : E
DESCRIPTION

=============================================================*/



void R_E_RULE ()
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_E, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_E, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_E, P_SIGNAL, M_M);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_E, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_ILOT, R_E, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_E, P_SIGNAL, 4);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_E, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_E, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_E, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_E, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_E, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_E, P_SIGNAL, -1);
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
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_E, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_E, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_E, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_E, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_E, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_E, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_E, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_E, P_SIGNAL, 9);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_E, P_SIGNAL);
    Set_Rule(OP_EXIT, T_STATUS, R_E, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_BUYLOT, R_E, P_SIGNAL, (RValue (OP_BUYSELL, T_RECOVERYVALUE, R_E) * Max(RValue (OP_BUYSELL, T_ILOT, R_E), Max(RValue (OP_BUYSELL, T_LASTBUYLOT, R_E), RValue (OP_BUYSELL, T_LASTSELLLOT, R_E)))));
    Set_Rule(OP_BUYSELL, T_SELLLOT, R_E, P_SIGNAL, (RValue (OP_BUYSELL, T_RECOVERYVALUE, R_E) * Max(RValue (OP_BUYSELL, T_ILOT, R_E), Max(RValue (OP_BUYSELL, T_LASTBUYLOT, R_E), RValue (OP_BUYSELL, T_LASTSELLLOT, R_E)))));
}
