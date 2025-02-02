#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Angle_Divergence
RULE : D
DESCRIPTION

=============================================================*/



void R_D_RULE ()
{
    double  divergence  =  0.0;
    double  MA_200  =  0;
    double  MA_7  =  0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_D, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_D, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_D, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_D, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_D, P_SIGNAL, 27);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_D, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_D, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_D, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_D, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_D, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_D, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_D, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    divergence = (SValue(MA_200, S_CURRENT, P_M1) - SValue(MA_7, S_CURRENT, P_M1));
    if ((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_D) >= 3))
    {
        Set_Rule(OP_BUYSELL, T_TIMESTEP, R_D, P_SIGNAL, 2);
    }
    if ((AndS(MA_200, S_ABOVE, P_M1, P_H4) && (SValue(MA_200, S_ANGLE, P_M1) > 10) && (SValue(MA_200, S_ANGLE, P_H4) > 5)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);
        if ((AndS(MA_200, S_ABOVE, P_M1, P_H4) && (SValue(MA_200, S_ANGLE, P_M1) > 10) && (SValue(MA_200, S_ANGLE, P_M1) > 5)))
        {
            Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);
        }
    }
    if ((divergence <= (-30 + Point)))
    {
        Set_Rule(OP_EXIT_BUY, T_STATUS, R_D, P_SIGNAL);
    }
}
