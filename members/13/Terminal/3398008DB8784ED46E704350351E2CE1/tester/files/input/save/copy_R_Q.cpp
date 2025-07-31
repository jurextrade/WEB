#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : PIVOT_LINE_APPROACH
RULE : Q
DESCRIPTION
COMBINED Buy Sell Session
==================

Stop loss are 10 Profit are 10 pipsteps

If HEIKEN_ASHI for the hour is BULL and price is below the Pivot of the day and price didn't cross the pivot in the day
, at a distance of 15 pipsteps
we START the session and BUY


If HEIKEN_ASHI for the hour is BEAR and price is above the Pivot of the day and price didn't cross the pivot in the day
, at a distance of 15 pipsteps we START the session and BUY

Session exit whenever no more trades in the session

=============================================================*/



void R_RULE (Q)
{
    double  Distance_From_Pivot  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_Q, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_Q, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_Q, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_Q, P_SIGNAL, 30);
    Set_Rule(OP_BUYSELL, T_ILOT, R_Q, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_Q, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_Q, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_Q, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_Q, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_Q, P_SIGNAL, 30);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_Q, P_SIGNAL, 120);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_Q, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_Q, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_Q, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_Q, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_Q, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_Q, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_Q, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_Q, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Total_NbrTrades_0 (OP_BUYSELL, R_Q))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_Q, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    Distance_From_Pivot = (SValue(PIVOT_POINT, S_DISTANCE, P_D1) / Point);
    if ((AndS(PIVOT_POINT, S_BELOW, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && (Distance_From_Pivot >= -8) && AndPS(BAR, S_BULL, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_Q, P_SIGNAL);
    }
    if ((AndS(PIVOT_POINT, S_ABOVE, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && (Distance_From_Pivot <= 8) && AndPS(BAR, S_BEAR, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_Q, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_Q, P_SIGNAL);
    }
    if ((AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) || AndS(PIVOT_POINT, S_CROSS_UP, P_D1)))
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_Q, P_SIGNAL);
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_Q, P_SIGNAL);
    }
}
