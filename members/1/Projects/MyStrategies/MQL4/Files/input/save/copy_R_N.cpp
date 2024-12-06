#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : RSI8_CCI14
RULE : N
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



void R_RULE (N)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_N, P_SIGNAL, D_FORWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_N, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_N, P_SIGNAL, M_A);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_N, P_SIGNAL, 50);
    Set_Rule(OP_BUYSELL, T_ILOT, R_N, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_N, P_SIGNAL, 6);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_N, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_N, P_SIGNAL, true);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_N, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_N, P_SIGNAL, 50);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_N, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_N, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_N, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_N, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_N, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_N, P_SIGNAL, 10);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_N, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_N, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);
    if ((AndS(RSI_CCI, S_SELL, P_M5) && AndS(HEIKEN_ASHI, S_BEAR, P_M5)))
    {
        Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);
    }
    if ((AndS(RSI_CCI, S_BUY, P_M5) && AndS(HEIKEN_ASHI, S_BULL, P_M5)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);
    }
}
