#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : MyStrategy
RULE : X
DESCRIPTION

=============================================================*/



void R_RULE (X)
{
    double  MySytem  =  0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_X, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_X, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_X, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_X, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_X, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_X, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_X, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_X, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_X, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_X, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_X, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_X, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_X, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_X, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_X, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_X, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_X, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_X, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_X, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_X, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_X, P_SIGNAL, 100);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_X, P_SIGNAL);
    Set_Rule(OP_EXIT, T_STATUS, R_X, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    if (AndS(MySytem, S_BUY, P_H1))
    {
        Set_Rule(OP_BUY, T_STATUS, R_X, P_SIGNAL);
    }
    if (AndS(MySytem, S_SELL, P_H1))
    {
        Set_Rule(OP_SELL, T_STATUS, R_X, P_SIGNAL);
    }
    if ((TimeCurrent > ReturnTime("23:30:35")))
    {
        Set_Rule(OP_EXIT, T_MINPROFIT, R_X, P_SIGNAL, -1);
    }
}
