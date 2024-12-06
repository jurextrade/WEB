#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : RSI_20_HEIKEN
RULE : M
DESCRIPTION
LONG TERM ORIENTATION
=================



BUY


HEIKEN_ASHI BULL FOR D1 AND W1

RSI Period 20 ABOVE



SELL



HEIKEN_ASHI BEAR FOR D1 AND W1

RSI Period 20 BELOW





=============================================================*/







void R_RULE (M)

{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_M, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_M, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_M, P_SIGNAL, M_S);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_M, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_M, P_SIGNAL, 0.2);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_M, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_M, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_M, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_M, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_M, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_M, P_SIGNAL, 800);
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
    Set_Rule(OP_EXIT, T_MINPROFIT, R_M, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_M))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_M, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(RSI_20, S_ABOVE, P_D1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_M, P_SIGNAL);
    }
    if ((AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(RSI_20, S_BELOW, P_D1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_M, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_M, P_SIGNAL);
    }
    if (Trade_buy_and_sell (OP_BUYSELL, R_M))
    {
        Set_Rule(OP_BUYSELL, T_TS, R_M, P_SIGNAL, 100);
        Set_Rule(OP_BUYSELL, T_BUYTS, R_M, P_SIGNAL, 0);
        Set_Rule(OP_BUYSELL, T_SELLTS, R_M, P_SIGNAL, 0);
    }
    if ((!(AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(RSI_20, S_ABOVE, P_D1)) && !Trade_Buy_OnBar_H1 (OP_BUYSELL, R_M)))
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_M, P_SIGNAL);
    }
    if ((!(AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(RSI_20, S_BELOW, P_D1)) && !Trade_Sell_OnBar_H1 (OP_BUYSELL, R_M)))
    {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_M, P_SIGNAL);
    }
}
