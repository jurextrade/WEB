#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Pivot Cross M15
RULE : K
DESCRIPTION
COMBINED Buy Sell Session
==================

If open price of the day is above the pivot point line and
the price touches the middle between the pivot line and pivot high we START the session
if the open price is below the middle between the pivot line and the pivot high we  SELL if not we BUY

If open price of the day is below the pivot point line and
the price touches the middle between the pivot line and pivot low we START the session
if the open price is below the middle between the pivot line and the pivot low we  BUY if not we SELL

Session exit whenever prices is at alert distance from Pivot point or Pivot High or Pivot Sell




=============================================================*/



void R_RULE (K)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_K, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_K, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_K, P_SIGNAL, M_K);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_K, P_SIGNAL, 50);
    Set_Rule(OP_BUYSELL, T_ILOT, R_K, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_K, P_SIGNAL, 6);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_K, P_SIGNAL, 12);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_K, P_SIGNAL, true);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_K, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_K, P_SIGNAL, 50);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_K, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_K, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_K, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_K, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_K, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_K, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_K, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_K, P_SIGNAL, 10);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Total_NbrTrades_0 (OP_BUYSELL, R_K))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_K, P_SIGNAL);
    Set_Rule(OP_BUY, T_STATUS, R_K, P_SIGNAL);
    Set_Rule(OP_SELL, T_STATUS, R_K, P_SIGNAL);
    if ((AndS(PIVOT_POINT, S_CROSS_DOWN, P_M15) && (RValue (OP_BUYSELL, T_PROFITBUY, R_K) >= 10)))
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_K, P_SIGNAL);
    }
    if ((AndS(PIVOT_POINT, S_CROSS_UP, P_M15) && (RValue (OP_BUYSELL, T_PROFITSELL, R_K) >= 10)))
    {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_K, P_SIGNAL);
    }
    if ((AndS(PIVOT_RESISTANCE1, S_TOUCHED, P_D1) || AndS(PIVOT_SUPPORT1, S_TOUCHED, P_D1)))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);
    }
    if (((TimeCurrent >= ReturnTime("23:28:22")) && (RValue (OP_BUYSELL, T_PROFIT, R_K) >= 0)))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_K, P_SIGNAL);
    }
}
