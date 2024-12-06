#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Pivot Point Cross Line
RULE : M
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



void R_M_RULE ()
{
    static double  Distance_From_Pivot  =  0.0;
    static double  nbrtrade  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_M, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_M, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_M, P_SIGNAL, M_K);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_M, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_ILOT, R_M, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_M, P_SIGNAL, 4);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_M, P_SIGNAL, 6);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_M, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_M, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_M, P_SIGNAL, 15);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_M, P_SIGNAL, 120);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_M, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_M, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_M, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_M, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_M, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_M, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_M, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_M, P_SIGNAL, 10);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_M, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Distance_From_Pivot = fabs((SValue(PIVOT_POINT, S_DISTANCE, P_D1) / Point));
    nbrtrade = (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_M) + RValue (OP_BUYSELL, T_SELLNBRTRADE, R_M));
    if ((!AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && !AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && AndS(PIVOT_POINT, S_BELOW, P_D1) && (Distance_From_Pivot <= 15)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);
    }
    if ((!AndS(PIVOT_POINT, S_CROSS_DOWN, P_D1) && !AndS(PIVOT_POINT, S_CROSS_UP, P_D1) && AndS(PIVOT_POINT, S_ABOVE, P_D1) && (Distance_From_Pivot <= 15)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);
    }
    if ((nbrtrade > 0))
    {
        if ((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_M) >= RValue (OP_BUYSELL, T_SELLNBRTRADE, R_M)))
        {
            Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);
        }
        if ((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_M) <= RValue (OP_BUYSELL, T_SELLNBRTRADE, R_M)))
        {
            Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);
        }
    }
}
