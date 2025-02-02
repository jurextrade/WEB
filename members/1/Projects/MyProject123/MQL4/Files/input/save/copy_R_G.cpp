#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Heiken
RULE : G
DESCRIPTION

=============================================================*/



void R_G_RULE ()
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_G, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_G, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_G, P_SIGNAL, M_M);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_G, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_ILOT, R_G, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_G, P_SIGNAL, 3.2);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_G, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_G, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_G, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_G, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_G, P_SIGNAL, 60);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_G, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_G, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_G, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_G, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_G, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_G, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_G, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
    if (Total_NbrTrades_0 (OP_BUYSELL, R_G))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_G, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((AndS(HEIKEN_ASHI, S_BULL, P_H4, P_D1) && AndPS(CLOSE, S_BULL, P_D1) && (RValue (OP_BUYSELL, T_BUYNBRLOTS, R_G) < RValue (OP_BUYSELL, T_SELLNBRLOTS, R_G))))
    {
        Set_Rule(OP_BUYSELL, T_BUYLOT, R_G, P_SIGNAL, (RValue (OP_BUYSELL, T_ILOT, R_G) * 2));
    }
    if ((AndS(HEIKEN_ASHI, S_BULL, P_H4, P_D1) && OrPS(HEIKEN_ASHI, S_BEAR, P_H4, P_D1)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_G, P_SIGNAL);
    }
    if ((AndS(HEIKEN_ASHI, S_BULL, P_H4, P_D1) && AndS(HIGH, S_BULL, P_H4) && AndS(CLOSE, S_BULL, P_H4) && (RValue (OP_BUYSELL, T_BUYNBRLOTS, R_G) == 0)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_G, P_SIGNAL);
    }
    if ((AndS(HEIKEN_ASHI, S_BULL, P_H4) && AndS(CLOSE, S_BEAR, P_H4) && AndS(LOW, S_BEAR, P_H4) && (RValue (OP_BUYSELL, T_PROFITBUY, R_G) > 0)))
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_G, P_SIGNAL);
    }
    if ((AndS(HEIKEN_ASHI, S_BEAR, P_H4, P_D1) && AndPS(CLOSE, S_BEAR, P_D1) && (RValue (OP_BUYSELL, T_SELLNBRLOTS, R_G) < RValue (OP_BUYSELL, T_BUYNBRLOTS, R_G))))
    {
        Set_Rule(OP_BUYSELL, T_SELLLOT, R_G, P_SIGNAL, (RValue (OP_BUYSELL, T_ILOT, R_G) * 2));
    }
    if ((AndS(HEIKEN_ASHI, S_BEAR, P_H4, P_D1) && OrPS(HEIKEN_ASHI, S_BULL, P_H4, P_D1)))
    {
        Set_Rule(OP_SELL, T_STATUS, R_G, P_SIGNAL);
    }
    if ((AndS(HEIKEN_ASHI, S_BEAR, P_H4, P_D1) && AndS(LOW, S_BEAR, P_H4) && AndS(CLOSE, S_BEAR, P_H4) && (RValue (OP_BUYSELL, T_SELLNBRLOTS, R_G) == 0)))
    {
        Set_Rule(OP_SELL, T_STATUS, R_G, P_SIGNAL);
    }
    if ((AndS(HEIKEN_ASHI, S_BEAR, P_H4) && AndS(CLOSE, S_BULL, P_H4) && AndS(HIGH, S_BULL, P_H4) && (RValue (OP_BUYSELL, T_PROFITSELL, R_G) > 0)))
    {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_G, P_SIGNAL);
    }
}
