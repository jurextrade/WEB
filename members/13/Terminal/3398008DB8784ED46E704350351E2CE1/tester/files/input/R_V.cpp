#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : FORCE_2
RULE : V
DESCRIPTION

=============================================================*/



void R_RULE (V)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_V, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_V, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_V, P_SIGNAL, M_M);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_V, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_V, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_V, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_V, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_V, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_V, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_V, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_V, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_V, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_V, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_V, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_TP, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_V, P_SIGNAL, 100);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_V, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_V, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_V, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_V, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_V, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_V, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    if (AndBS(Force, S_EXT_OVERBOUGHT, P_M1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_V, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_V, P_SIGNAL);
    }
    if (AndBS(Force, S_EXT_OVERSOLD, P_M1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_V, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_V, P_SIGNAL);
    }
}
