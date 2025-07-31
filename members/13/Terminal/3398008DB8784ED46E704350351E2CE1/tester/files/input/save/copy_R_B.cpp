#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : PIVOT_APPROACH
RULE : B
DESCRIPTION

=============================================================*/



void R_RULE (B)
{
    double  Bid_P  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_B, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_B, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_B, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_B, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_B, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_B, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_B, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_B, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_B, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_B, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_B, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_B, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_B, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_B, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_B, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_B, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_B, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_B, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_B, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_B, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    Bid_P = (fabs(SValue(PIVOT_POINT, S_DISTANCE, P_D1)) / Point);
    if (((Bid_P < 10) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1)))
    {
        if ((AndS(PIVOT_POINT, S_BELOW, P_D1) && AndPS(BAR, S_BEAR, P_D1) && AndS(BAR, S_BULL, P_H1)))
        {
            Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);
            Set_Rule(OP_BUY, T_STATUS, R_B, P_SIGNAL);
        }
        if ((AndS(PIVOT_POINT, S_ABOVE, P_D1) && AndPS(BAR, S_BULL, P_D1) && AndS(BAR, S_BEAR, P_H1)))
        {
            Set_Rule(OP_BUYSELL, T_START, R_B, P_SIGNAL);
            Set_Rule(OP_SELL, T_STATUS, R_B, P_SIGNAL);
        }
    }
}
