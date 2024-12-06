#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : PivotLow Cross Line
RULE : P
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



void R_RULE (P)
{
    double  Distance_From_Low  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_P, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_P, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_P, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_P, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_P, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_P, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_P, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_P, P_SIGNAL, 15);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_P, P_SIGNAL, 120);
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
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_P, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_P, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_P, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_P, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_P, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_P, P_SIGNAL, 100);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_P, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Distance_From_Low = fabs((SValue(PIVOT_LOW, S_DISTANCE, P_D1) / Point));
    if ((!AndS(PIVOT_LOW, S_CROSS_DOWN, P_D1) && (Distance_From_Low <= 15) && AndPS(BAR, S_BEAR, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_P, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_P, P_SIGNAL);
    }
}
