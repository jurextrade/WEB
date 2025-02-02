#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : BuySell
RULE : H
DESCRIPTION

=============================================================*/



void R_RULE (H)
{
    double  RSI_20  =  0;
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_H, P_SIGNAL, D_BACKWARD);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_H, P_SIGNAL, DT_MINMAX);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_H, P_SIGNAL, M_D);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_H, P_SIGNAL, 4);
    Set_Rule(OP_BUYSELL, T_ILOT, R_H, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_H, P_SIGNAL, 3.4);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_H, P_SIGNAL, 8);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_H, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_H, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_H, P_SIGNAL, 15);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_H, P_SIGNAL, 15);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_H, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_H, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_H, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_H, P_SIGNAL, 0);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_H, P_SIGNAL, 0);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_H, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
    Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
    if (Trade_no (OP_BUYSELL, R_H))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_H, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if ((AndS(RSI_20, S_CROSS_UP, P_H1) || AndS(RSI_20, S_CROSS_DOWN, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);
        if ((Trade_only_buy (OP_BUYSELL, R_H) || Trade_only_sell (OP_BUYSELL, R_H)))
        {
            Set_Rule(OP_CLOSE_BUY, T_STATUS, R_H, P_SIGNAL);
            Set_Rule(OP_CLOSE_SELL, T_STATUS, R_H, P_SIGNAL);
        }
    }
    if ((AndS(RSI_20, S_RANGE, P_H1) && AndPS(RSI_20, S_OVERSOLD, P_H1) && Trade_buy_and_sell (OP_BUYSELL, R_H)))
    {
        if ((RValue (OP_BUYSELL, T_PROFITSELL, R_H) >= 10))
        {
            Set_Rule(OP_CLOSE_SELL, T_STATUS, R_H, P_SIGNAL);
        }
    }
    if ((AndS(RSI_20, S_RANGE, P_H1) && AndPS(RSI_20, S_OVERBOUGHT, P_H1) && Trade_buy_and_sell (OP_BUYSELL, R_H)))
    {
        if ((RValue (OP_BUYSELL, T_PROFITBUY, R_H) >= 10))
        {
            Set_Rule(OP_CLOSE_BUY, T_STATUS, R_H, P_SIGNAL);
        }
    }
}
