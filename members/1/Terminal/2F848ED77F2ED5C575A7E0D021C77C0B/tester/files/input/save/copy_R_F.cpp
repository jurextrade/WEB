#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : PIVOT
RULE : F
DESCRIPTION

=============================================================*/



void R_RULE (F)
{
    double  Bid_P  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_F, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_F, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_F, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_F, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_F, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_F, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_F, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_F, P_SIGNAL, 120);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_F, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_F, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_F, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_F, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_F, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_F, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_F, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_F, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_F))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    Bid_P = (fabs(SValue(PIVOT_POINT, S_DISTANCE, P_D1)) / Point);
    if (((Bid_P < 6) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1)))
    {
        if ((AndS(PIVOT_POINT, S_BELOW, P_D1) && AndPS(BAR, S_BEAR, P_D1) && AndS(BAR, S_BULL, P_H1)))
        {
            Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);
            Set_Rule(OP_BUY, T_STATUS, R_F, P_SIGNAL);
        }
        if ((AndS(PIVOT_POINT, S_ABOVE, P_D1) && AndPS(BAR, S_BULL, P_D1) && AndS(BAR, S_BEAR, P_H1)))
        {
            Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);
            Set_Rule(OP_SELL, T_STATUS, R_F, P_SIGNAL);
        }
    }
}
