#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Jurex_HV
RULE : C
DESCRIPTION

=============================================================*/



void R_RULE (C)
{
    double  Force  =  0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_C, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_C, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_C, P_SIGNAL, M_M);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_C, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_C, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_C, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_C, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_C, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_C, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_C, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_C, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_C, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_C, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_C, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_TP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_C, P_SIGNAL, 100);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_C, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_C, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_C, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_C, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_C, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_C))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_C, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndBS(Force, S_EXT_OVERBOUGHT, P_M1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_C, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_C, P_SIGNAL);
    }
    if (AndBS(Force, S_EXT_OVERSOLD, P_M1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_C, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_C, P_SIGNAL);
    }
}
