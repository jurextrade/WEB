#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : RSI_CANDLE1
RULE : R
DESCRIPTION

=============================================================*/



void R_RULE (R)
{
    double  RSI_20  =  0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_R, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_R, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_R, P_SIGNAL, M_M);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_R, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_ILOT, R_R, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_R, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_R, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_R, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_R, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_R, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_R, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_R, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_R, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_R, P_SIGNAL, 100);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_R, P_SIGNAL, 100);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_R, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_R, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_R, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_R, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_R, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_R, P_SIGNAL, 100);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_R, P_SIGNAL);
    if (((AndS(HEIKEN_ASHI, S_BULL, P_D1) && AndS(HEIKEN_ASHI, S_BULL, P_W1) && AndS(RSI_20, S_ABOVE, P_D1)) && (AndBS(HEIKEN_ASHI, S_BULL, P_D1) || AndBS(HEIKEN_ASHI, S_BULL, P_W1) || AndBS(RSI_20, S_ABOVE, P_D1))))
    {
        Set_Rule(OP_BUY, T_STATUS, R_R, P_SIGNAL);
    }
    if (((AndS(HEIKEN_ASHI, S_BEAR, P_D1) && AndS(HEIKEN_ASHI, S_BEAR, P_W1) && AndS(RSI_20, S_BELOW, P_D1)) && (AndBS(HEIKEN_ASHI, S_BEAR, P_D1) || AndBS(HEIKEN_ASHI, S_BEAR, P_W1) || AndBS(RSI_20, S_BELOW, P_D1))))
    {
        Set_Rule(OP_SELL, T_STATUS, R_R, P_SIGNAL);
    }
    if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_R) > 0) && (RValue (OP_BUYSELL, T_SELLNBRTRADE, R_R) > 0)))
    {
        Set_Rule(OP_BUYSELL, T_TS, R_R, P_SIGNAL, 100);
        Set_Rule(OP_BUYSELL, T_BUYTS, R_R, P_SIGNAL, 0);
        Set_Rule(OP_BUYSELL, T_SELLTS, R_R, P_SIGNAL, 0);
    }
}
