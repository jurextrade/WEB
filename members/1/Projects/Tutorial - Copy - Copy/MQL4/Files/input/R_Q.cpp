#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : BuySell
RULE : Q
DESCRIPTION

=============================================================*/



void R_RULE (Q)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_Q, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_Q, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_Q, P_SIGNAL, M_D);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_Q, P_SIGNAL, 4);
    Set_Rule(OP_BUYSELL, T_ILOT, R_Q, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_Q, P_SIGNAL, 3.4);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_Q, P_SIGNAL, 8);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_Q, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_Q, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_Q, P_SIGNAL, 15);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_Q, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_Q, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_Q, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_Q, P_SIGNAL, 100);
    Set_Rule(OP_BUYSELL, T_TP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_Q, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_STATUS, R_Q, P_SIGNAL);
    Set_Rule(OP_SELL, T_STATUS, R_Q, P_SIGNAL);
    if (Trade_no (OP_BUYSELL, R_Q))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_Q, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndPS(Force, S_CROSS_UP, P_H1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);
        if (((RValue (OP_BUYSELL, T_PROFITSELL, R_Q) >= 10) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_Q) > 2)))
        {
            Set_Rule(OP_CLOSE_SELL, T_STATUS, R_Q, P_SIGNAL);
        }
    }
    if (AndPS(Force, S_CROSS_DOWN, P_H1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);
        if (((RValue (OP_BUYSELL, T_PROFITBUY, R_Q) >= 10) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_Q) > 2)))
        {
            Set_Rule(OP_CLOSE_BUY, T_STATUS, R_Q, P_SIGNAL);
        }
    }
}
