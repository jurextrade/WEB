#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Mumbai
RULE : N
DESCRIPTION
Name : The Mumbai Forex Scalper Strategy
Time Frame : 15 minutes and above
Indicators : Parabolic SAR (0.02, 0.2) , Stochastic Oscillator (5, 3, 3)
Strategy by : Analyst Navin Prithyani on UrbanForex.com
The Mumbai Scalper
During my travel to India, I got a chance to visit Mumbai and experience the hustle and bustle of this financial juggernaut of India.
The pace is very fast and everyone is trying to make a quick buck - very similar to our scalpers in the Forex industry.
This is the reason why I've called this strategy The Mumbai Forex Scalper Strategy.
Using this scalping strategy
We can start off by opening a 15 minute chart on your desired pair, preferably forex pair with low spreads.
Attach the Parabolic SAR with the settings mentioned above The Parabolic SAR can be used by giving us a sense of direction similar to a moving average.
Once we find a trend in the market, we want to keep an look out for a cross in the Stochastic Oscillator to confirm the entry.
Sell Scenario
If the Parabolic SAR is in a downtrend we need to wait for a confirmation of the Stochastic Oscillator to cross above the 70 level.
Once these two criterias are confirmed, we would enter at the opening of the next candle. The stops can be kept on the high of the previous candle or can be adjusted/tweeked as per your risk appetite.

Buy Scenario
If the Parabolic SAR is in a uptrend we need to wait for a confirmation of the Stochastic Oscillator to cross below the 30 level.
Once these two criterias are confirmed, we would enter at the opening of the next candle. The stops can be kept on the low of the previous candle or can be adjusted/tweeked as per your risk appetite.

Exit Strategies

Option 1
1:1 Risk to reward. If your stop is -12 pips your limit should be +12 pips.

Option 2
Open 2 lots. If your stop is at -10 pips, once your trades goes in your favor and you’re at +10 pips, close 1 lot and let the other one run. Exit at Support and Resistance levels.

Option 3
Exit at the nearest 50 or 00 level. These are psychological levels. (make sure your exit is at least the same number of pips as your stop, otherwise dont enter the trade)

Option 4
Trailing Stop. Once in a trade, at the close of each candle, place your stop 1 pip below the low (if in a buy trade). Vise versa for sell trade.

=============================================================*/



void R_RULE (N)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_N, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_N, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_N, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_N, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_N, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_N, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_N, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_N, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_N, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_N, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_N, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_N, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_N, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_N, P_SIGNAL, 5);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_N, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_N, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_N, P_SIGNAL, 5);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_N, P_SIGNAL, 5);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_N, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_N, P_SIGNAL, -1);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    if (Trade_no (OP_BUYSELL, R_N))
    {
        Set_Rule(OP_EXIT, T_STATUS, R_N, P_SIGNAL);
    }
//--------------END ACTIONS ------------------------------
    if (AndS(STO_SAR, S_SELL, P_M15))
    {
        Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_N, P_SIGNAL);
    }
    if (AndS(STO_SAR, S_BUY, P_M15))
    {
        Set_Rule(OP_BUYSELL, T_START, R_N, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_N, P_SIGNAL);
    }
}
