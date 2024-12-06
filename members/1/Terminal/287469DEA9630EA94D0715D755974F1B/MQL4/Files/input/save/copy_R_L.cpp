#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : 10_Pips_Per_Day
RULE : L
DESCRIPTION
Name : 10 Pips Per Day Scalping Strategy
Time Frame : 5 to 15 Minute Charts
Indicators : Bollinger Bands (20, 0, 2) and Stochastic Oscillator (5, 3, 3)
Strategy By : Analyst Navin Prithyani (urbanforex.com)

How to make 10 pips per day in Forex

First you want to setup your charts as the image above. If you want the Stochastic indicator like mine, you can find it in the forums. Now the key is not to earn 10 pips in one shot or in one trade. If the trade skyrockets and gives you 10 pips, so be it. Otherwise, take what you can get. I will post a video tutorial on this also to make it easier to understand. The risk to reward ratio on this strategy is bad but has a higher accuracy rate. So please trade at your own discretion.

Steps to look for to scalp your 10 pips

- Look only on the major pairs. (EURUSD, USDJPY, GBPUSD, USDCHF)
- A close must happen outside the Bollinger Band indicator
- Stochastic Oscillator indicator must be in a oversold (below 20) or overbought area (above 80).
- If market is in a uptrend, look for a red candle. If market is in a downtrend look for a green candle.
- We will call these the “Signal Candles”
- Once you see your signal candle, enter in that same direction and scalp your pips.
- Stops are hard kept at 20 pips.
Tags: 10 pips per day scalping strategy, forex strategies, forex trading system, scalping
=============================================================*/



void R_RULE (L)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_L, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_L, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_L, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_L, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_L, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_L, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_L, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_L, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_L, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_L, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_L, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_L, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_L, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_L, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_L, P_SIGNAL, 5);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_L, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_L, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_L, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_L, P_SIGNAL, 5);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_L, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_L, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_L))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_L, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndS(STO_BB, S_SELL, P_M15))
    {
        Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_L, P_SIGNAL);
    }
    if (AndS(STO_BB, S_BUY, P_M15))
    {
        Set_Rule(OP_BUYSELL, T_START, R_L, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_L, P_SIGNAL);
    }
}
