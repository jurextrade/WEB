#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : PivotHigh Cross Line
RULE : O
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



void R_RULE (O)
{
    double  Distance_From_High  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_O, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_O, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_O, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_O, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_O, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_O, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_O, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_O, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_O, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_O, P_SIGNAL, 15);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_O, P_SIGNAL, 120);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_O, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_O, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_O, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_O, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_O, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_O, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_O, P_SIGNAL, 100);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_O, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Distance_From_High = fabs((SValue(PIVOT_HIGH, S_DISTANCE, P_D1) / Point));
    if (((AndPS(BAR, S_BULL_HAMMER, P_D1) || AndPS(BAR, S_BULL_HAMMER1, P_D1) || AndPS(BAR, S_BULL_HAMMER2, P_D1) || AndPS(BAR, S_BULL, P_D1)) && !AndS(PIVOT_HIGH, S_CROSS_UP, P_D1) && AndS(PIVOT_HIGH, S_BELOW, P_D1) && (Distance_From_High <= 15)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);
    }
}
