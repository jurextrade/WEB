#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : ENGULFING_H4
RULE : F
DESCRIPTION

=============================================================*/



void R_RULE (F)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_F, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_F, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_F, P_SIGNAL, M_K);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_F, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_F, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_F, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_F, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_F, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_F, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_F, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_F, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_F, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_F, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_F, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_F, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_F, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Total_NbrTrades_0 (OP_BUYSELL, R_F))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndS(BAR, S_BEAR_ENGULFING, P_H4))
    {
        Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_F, P_SIGNAL);
    }
    if (AndS(BAR, S_BULL_ENGULFING, P_H4))
    {
        Set_Rule(OP_BUYSELL, T_START, R_F, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_F, P_SIGNAL);
    }
    if (((RValue (OP_BUYSELL, T_SELLNBRTRADE, R_F) == 0) && (RValue (OP_BUYSELL, T_BUYNBRTRADE, R_F) == 0)))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_F, P_SIGNAL);
    }
}
