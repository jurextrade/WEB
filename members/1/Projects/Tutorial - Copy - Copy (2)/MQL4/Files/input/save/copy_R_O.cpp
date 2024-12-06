#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : FRACTAL_CHANGED
RULE : O
DESCRIPTION

=============================================================*/



void R_RULE (O)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_O, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_O, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_O, P_SIGNAL, M_Q);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_O, P_SIGNAL, 2);
    Set_Rule(OP_BUYSELL, T_ILOT, R_O, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_O, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_O, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_O, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_O, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_O, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_O, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_O, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_O, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_O, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_O, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_O, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_O, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_O, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_O, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_O, P_SIGNAL, 10);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_O))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_O, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndS(UPFRACTAL, S_CHANGED, P_H1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_O, P_SIGNAL);
    }
    if (AndS(DOWNFRACTAL, S_CHANGED, P_H1))
    {
        Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);
    }
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_O, P_SIGNAL, ((RValue (OP_BUYSELL, T_LASTORDEROPENPRICE, R_O) - SValue(DOWNFRACTAL, S_CURRENT, P_H1)) / Point));
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_O, P_SIGNAL, ((SValue(UPFRACTAL, S_CURRENT, P_H1) - RValue (OP_BUYSELL, T_LASTORDEROPENPRICE, R_O)) / Point));
    if ((AndS(UPFRACTAL, S_ABOVE, P_H1) && (RValue (OP_BUYSELL, T_LASTORDERTYPE, R_O) == OP_SELL)))
    {
        Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);
    }
    if ((AndS(DOWNFRACTAL, S_BELOW, P_H1) && (RValue (OP_BUYSELL, T_LASTORDERTYPE, R_O) == OP_BUY)))
    {
        Set_Rule(OP_SELL, T_STATUS, R_O, P_SIGNAL);
    }
}
