#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Angle_EMA
RULE : A
DESCRIPTION

=============================================================*/



void R_RULE (A)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_A, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_A, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_A, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_A, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_ILOT, R_A, P_SIGNAL, 0.01);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_A, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_A, P_SIGNAL, 30);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_A, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_A, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_A, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_A, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_A, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_A, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_A, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_A, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_A, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_A, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_A, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_A, P_SIGNAL, 10);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);
    Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    if ((((SValue(LOW, S_CURRENT, P_M1) > SValue(EMA_34, S_CURRENT, P_M1)) && (SValue(LOW, S_CURRENT, P_H1) > SValue(EMA_34, S_CURRENT, P_H1))) && (SValue(EMA_34, S_ANGLE, P_M1) > 15) && (SValue(EMA_34, S_ANGLE, P_H4) > 10)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);
        if (((RValue (OP_BUYSELL, T_LASTORDERTYPE, R_A) == OP_SELL) && (SValue(EMA_34, S_ANGLE, P_H4) > -15)))
        {
            Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_A, P_SIGNAL, M_K);
            Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_A, P_SIGNAL, (RValue (OP_BUYSELL, T_MAXCOUNT, R_A) + 1));
        }
    }
    if ((((SValue(HIGH, S_CURRENT, P_M1) < SValue(EMA_34, S_CURRENT, P_M1)) && (SValue(HIGH, S_CURRENT, P_H1) < SValue(EMA_34, S_CURRENT, P_H1))) && (SValue(EMA_34, S_ANGLE, P_M1) < -15) && (SValue(EMA_34, S_ANGLE, P_H4) < -10)))
    {
        Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);
        if (((RValue (OP_BUYSELL, T_LASTORDERTYPE, R_A) == OP_BUY) && (SValue(EMA_34, S_ANGLE, P_H4) < -10)))
        {
            Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_A, P_SIGNAL, M_K);
            Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_A, P_SIGNAL, (RValue (OP_BUYSELL, T_MAXCOUNT, R_A) + 1));
        }
    }
}
