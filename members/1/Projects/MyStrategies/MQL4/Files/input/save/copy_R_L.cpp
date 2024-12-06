#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Momentum
RULE : L
DESCRIPTION

=============================================================*/



void R_RULE (L)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_L, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_L, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_L, P_SIGNAL, M_L);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_L, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_ILOT, R_L, P_SIGNAL, 0.2);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_L, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_L, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_L, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_L, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_L, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_L, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_L, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_L, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_L, P_SIGNAL, 0);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_L, P_SIGNAL, 20);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_L, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);
    if (AndS(Momentum, S_UP, P_H1))
    {
        Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);
    }
    if (AndS(Momentum, S_DOWN, P_H1))
    {
        Set_Rule(OP_SELL, T_STATUS, R_L, P_SIGNAL);
    }
}
