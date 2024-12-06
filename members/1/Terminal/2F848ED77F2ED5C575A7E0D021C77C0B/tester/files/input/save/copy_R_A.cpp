#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : CANDLE_H1
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
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_A, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_A, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_A, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_A, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_A, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_A, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_A, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_A, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_A, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_A, P_SIGNAL, -1);
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
    Set_Rule(OP_EXIT, T_MINPROFIT, R_A, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_A))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((!Trade_Buy_OnBar_H1 (OP_BUYSELL, R_A) && !FractalUp_Approaching (OP_BUYSELL, R_A) && !Pivot_Up_Approaching_D1 (OP_BUYSELL, R_A) && Candle_Buy_Entry_D1 (OP_BUYSELL, R_A) && Candle_Buy_Entry_H1 (OP_BUYSELL, R_A)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);
    }
    if ((!Trade_Sell_OnBar_H1 (OP_BUYSELL, R_A) && !FractalDown_Approaching (OP_BUYSELL, R_A) && !Pivot_Down_Approaching_D1 (OP_BUYSELL, R_A) && Candle_Sell_Entry_D1 (OP_BUYSELL, R_A) && Candle_Sell_Entry_H1 (OP_BUYSELL, R_A)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);
    }
    if (Candle_Buy_Exit_H1 (OP_BUYSELL, R_A))
    {
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_A, P_SIGNAL);
    }
    if (Candle_Sell_Exit_H1 (OP_BUYSELL, R_A))
    {
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_A, P_SIGNAL);
    }
    if (ShouldExit (OP_BUYSELL, R_A))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);
    }
}
