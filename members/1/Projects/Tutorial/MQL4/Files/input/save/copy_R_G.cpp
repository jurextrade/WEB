#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : RSI_2P_H1
RULE : G
DESCRIPTION

=============================================================*/



void R_RULE (G)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_G, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_G, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_G, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_G, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_G, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_G, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_G, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_G, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_G, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_G, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_G, P_SIGNAL, 10);
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
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_G, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_G, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_G, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_G, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_G, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_G, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_G, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_G, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_G))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_G, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((AndS(RSI_2, S_OVERSOLD, P_H1) && AndS(MA_200, S_ABOVE, P_H1) && !AndS(VELOCITY, S_OVERSOLD, P_M5)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_G, P_SIGNAL);
    }
    if ((AndS(RSI_2, S_OVERBOUGHT, P_H1) && AndS(MA_200, S_BELOW, P_H1) && !AndS(VELOCITY, S_OVERBOUGHT, P_M5)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_G, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_G, P_SIGNAL);
    }
}
