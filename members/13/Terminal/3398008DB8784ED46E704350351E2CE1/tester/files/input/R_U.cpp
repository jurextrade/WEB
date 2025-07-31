#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : VELOCITY_5WPR_14
RULE : U
DESCRIPTION

=============================================================*/



void R_RULE (U)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_U, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_U, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_U, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_U, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_U, P_SIGNAL, 0.5);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_U, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_U, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_U, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_U, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_U, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_U, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_U, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_U, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_U, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_U, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_U, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_U, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_U, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_U, P_SIGNAL, 100);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_U, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    if ((volume_up (OP_BUYSELL, R_U) && AndS(VELOCITY, S_OVERBOUGHT, P_M5) && AndS(WPR_14, S_OVERBOUGHT, P_M1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_U, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_U, P_SIGNAL);
        if ((RValue (OP_BUYSELL, T_PROFITBUY, R_U) > 0))
        {
            Set_Rule(OP_CLOSE_BUY, T_STATUS, R_U, P_SIGNAL);
        }
        if ((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_U) == 0))
        {
            Set_Rule(OP_BUYSELL, T_DIRECTION, R_U, P_SIGNAL, D_ANY);
        }
    }
    if ((volume_down (OP_BUYSELL, R_U) && AndS(VELOCITY, S_OVERSOLD, P_M5) && AndS(WPR_14, S_OVERSOLD, P_M1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_U, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_U, P_SIGNAL);
        if ((RValue (OP_BUYSELL, T_PROFITSELL, R_U) > 0))
        {
            Set_Rule(OP_CLOSE_SELL, T_STATUS, R_U, P_SIGNAL);
        }
        if ((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_U) == 0))
        {
            Set_Rule(OP_BUYSELL, T_DIRECTION, R_U, P_SIGNAL, D_ANY);
        }
    }
}
