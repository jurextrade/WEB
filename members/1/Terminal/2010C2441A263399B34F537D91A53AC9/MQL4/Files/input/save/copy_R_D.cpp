#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : ENGULFING_D1
RULE : D
DESCRIPTION
ENGULFING D1
==========

BUY or SELL on tick only


Set Stop Loss on  Previous Bar Low or High

=============================================================*/



void R_RULE (D)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_D, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_D, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_D, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_D, P_SIGNAL, 0.5);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_D, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_D, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_D, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_D, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_D, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_D, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_D, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_D))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_D, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((TimeCurrent >= ReturnTime("23:00:00")))
    {
        Set_Rule(OP_EXIT, T_MINPROFIT, R_D, P_SIGNAL, -1);
        Set_Rule(OP_EXIT, T_STATUS, R_D, P_SIGNAL);
    }
    else
    {
        if (AndS(BAR, S_BULL_ENGULFING, P_D1))
        {
            Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
            Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);
        }
        if (AndS(BAR, S_BEAR_ENGULFING, P_D1))
        {
            Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
            Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);
        }
    }
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, ((SPValue(HIGH, S_CURRENT, P_D1) - RValue (OP_BUYSELL, T_LASTORDEROPENPRICE, R_D)) / Point));
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, ((RValue (OP_BUYSELL, T_LASTORDEROPENPRICE, R_D) - SPValue(LOW, S_CURRENT, P_D1)) / Point));
}
