#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : FORCEINDEX
RULE : P
DESCRIPTION

=============================================================*/



void R_RULE (P)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_P, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_P, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_P, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_P, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_P, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_P, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_P, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_P, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_P, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_P, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_P, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_P, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_P, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_P, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_P, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_P))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_P, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndS(Force, S_OVERSOLD, P_H1))
    {
        if (AndS(Force, S_BELOW, P_M30))
        {
            Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);
            Set_Rule(OP_SELL, T_STATUS, R_P, P_SIGNAL);
        }
    }
    else
    {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_P, P_SIGNAL);
    }
    if (AndS(Force, S_OVERBOUGHT, P_M30, P_H1))
    {
        if (AndS(Force, S_ABOVE, P_M30))
        {
            Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);
            Set_Rule(OP_BUY, T_STATUS, R_P, P_SIGNAL);
        }
    }
    else
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_P, P_SIGNAL);
    }
}
