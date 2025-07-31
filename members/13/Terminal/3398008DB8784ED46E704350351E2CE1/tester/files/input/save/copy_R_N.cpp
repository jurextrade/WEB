#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : RSI_CANDLE
RULE : N
DESCRIPTION

=============================================================*/



void R_RULE (N)
{
    double  RSI_Candles  =  0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_N, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_N, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_N, P_SIGNAL, M_M);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_N, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_ILOT, R_N, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_N, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_N, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_N, P_SIGNAL, 10);
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
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_N, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_N, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_N, P_SIGNAL, 100);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_N, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);
    if (((AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(RSI_Candles, S_ABOVE, P_D1)) && (AndBS(HEIKEN_ASHI, S_BULL, P_D1) || AndBS(HEIKEN_ASHI, S_BULL, P_W1) || AndBS(RSI_Candles, S_ABOVE, P_D1))))
    {
        Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);
    }
    if (((AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(RSI_Candles, S_BELOW, P_D1)) && (AndBS(HEIKEN_ASHI, S_BEAR, P_D1) || AndBS(HEIKEN_ASHI, S_BEAR, P_W1) || AndBS(RSI_Candles, S_BELOW, P_D1))))
    {
        Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);
    }
}
