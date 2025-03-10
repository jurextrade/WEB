#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : PIVOT_PINBAR
RULE : J
DESCRIPTION

=============================================================*/



void R_RULE (J)
{
    double  phigh  =  0.0;
    double  plow  =  0.0;
    double  bSL  =  0.0;
    double  sSL  =  0.0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_J, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_J, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_J, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_J, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_J, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_J, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_J, P_SIGNAL, 60);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_J, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_J, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_J, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_J, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_J, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_J, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_J, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
//--------------END ACTIONS ------------------------------
    phigh = SValue(HIGH, S_PREVIOUS, P_H1);
    plow = SValue(LOW, S_PREVIOUS, P_H1);
    bSL = plow;
    sSL = phigh;
    if ((Prev_Bear_PinBar (OP_BUYSELL, R_J) && Prev_Bar_Intersect_Upper_Pivots (OP_BUYSELL, R_J)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_J, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_J, P_SIGNAL);
    }
    if ((Prev_Bull_PinBar (OP_BUYSELL, R_J) && Prev_Bar_Intersect_Lower_Pivots (OP_BUYSELL, R_J)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_J, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_J, P_SIGNAL);
    }
}
