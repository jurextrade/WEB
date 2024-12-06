#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Follow
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
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_A, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_ILOT, R_A, P_SIGNAL, 0.01);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_A, P_SIGNAL, 3);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_A, P_SIGNAL, 400);
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
    Set_Rule(OP_EXIT, T_MINPROFIT, R_A, P_SIGNAL, 10);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_A, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_A, P_SIGNAL);
    if (AndS(BAR, S_CHANGED, P_M30))
    {
        if ((AndS(HEIKEN_ASHI, S_BULL, P_M30, P_D1, P_W1) && (SValue(EMA_34, S_ANGLE, P_M30) < 15) && (SValue(LOW, S_CURRENT, P_M30) > SValue(EMA_34, S_CURRENT, P_M30))))
        {
            Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);
            if ((RValue (OP_BUYSELL, T_PROFITSELL, R_A) > 0))
            {
                Set_Rule(OP_CLOSE_SELL, T_STATUS, R_A, P_SIGNAL);
            }
            else
            {
                Set_Rule(OP_HEDGE_SELL, T_STATUS, R_A, P_SIGNAL);
                if ((RValue (OP_BUYSELL, T_HEDGEBUYPROFIT, R_A) > 0))
                {
                    Set_Rule(OP_CLOSE_HEDGE_BUY, T_STATUS, R_A, P_SIGNAL);
                }
            }
        }
        if ((AndS(HEIKEN_ASHI, S_BEAR, P_M30, P_D1, P_W1) && (SValue(EMA_34, S_ANGLE, P_M30) > -15) && (SValue(HIGH, S_CURRENT, P_M30) < SValue(EMA_34, S_CURRENT, P_M30))))
        {
            Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);
            if ((RValue (OP_BUYSELL, T_PROFITBUY, R_A) > 0))
            {
                Set_Rule(OP_CLOSE_BUY, T_STATUS, R_A, P_SIGNAL);
            }
            else
            {
                Set_Rule(OP_HEDGE_BUY, T_STATUS, R_A, P_SIGNAL);
                if ((RValue (OP_BUYSELL, T_HEDGESELLPROFIT, R_A) > 0))
                {
                    Set_Rule(OP_CLOSE_HEDGE_SELL, T_STATUS, R_A, P_SIGNAL);
                }
            }
        }
        if (((SValue(EMA_34, S_ANGLE, P_M30) <= -15) || (SValue(EMA_34, S_ANGLE, P_M30) >= 15)))
        {
            if (AndS(HEIKEN_ASHI, S_BULL, P_M30, P_D1))
            {
                Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_A, P_SIGNAL, 10);
                Set_Rule(OP_BUY, T_STATUS, R_A, P_SIGNAL);
            }
            if (AndS(HEIKEN_ASHI, S_BEAR, P_M30, P_D1))
            {
                Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_A, P_SIGNAL, 10);
                Set_Rule(OP_SELL, T_STATUS, R_A, P_SIGNAL);
            }
        }
    }
    if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_A) > RValue (OP_BUYSELL, T_SELLNBRTRADE, R_A)) || (RValue (OP_BUYSELL, T_PROFITBUY, R_A) < RValue (OP_BUYSELL, T_PROFITSELL, R_A))))
    {
        Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_A, P_SIGNAL, 10);
    }
    if (((RValue (OP_BUYSELL, T_BUYNBRTRADE, R_A) < RValue (OP_BUYSELL, T_SELLNBRTRADE, R_A)) || (RValue (OP_BUYSELL, T_PROFITBUY, R_A) > RValue (OP_BUYSELL, T_PROFITSELL, R_A))))
    {
        Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_A, P_SIGNAL, 10);
    }
    if ((Bid > RValue (OP_BUYSELL, T_SELLAVERAGEPOINT, R_A)))
    {
        Set_Rule(OP_BUYSELL, T_SELLLOT, R_A, P_SIGNAL, (RValue (OP_BUYSELL, T_ILOT, R_A) * 2));
    }
    if ((Bid < RValue (OP_BUYSELL, T_BUYAVERAGEPOINT, R_A)))
    {
        Set_Rule(OP_BUYSELL, T_BUYLOT, R_A, P_SIGNAL, (RValue (OP_BUYSELL, T_ILOT, R_A) * 2));
    }
}
