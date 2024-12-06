#include "Progress.h"
#include "PG_Objects.h"
#include "PG_Logicals.h"

/* ============================================================
STRATEGY : Singapore_Swing
RULE : W
DESCRIPTION
Name : Singapore Swing Forex Trading Strategy
Time Frame : 15 Minutes
Indicators : RSI (14), Forex Trend (20,20)
Strategy by : Analyst Navin Prithyani (UrbanForex.com)
Singapore Swing Trading
Singapore has grown over the years with its ability to make the right decisions at the right time. Looking at this conservative giant, I created this strategy that allows a trader to wait for the right time and capture a trend reversal.
Using this swing trading strategy
Load up any currency pair that has a low spread, preferably any of the majors, and set the trading time frame to 15 minutes.
Then proceed to attached the Trendline file which you have downloaded and the Relative Strength Index with the settings mentioned above. Place 70 and 30 levels onto your RSI settings.
Buy Scenario
Once the market is trending down / short, we need the RSI to cross below level 30.
Wait for the close of a candle above the 2 Red Lines.
Then confirm that the RSI went from below level 30 to above 30 as showed in the image.
At the opening of the next candle, a Long / Buy trade is opened. The stops can be kept at the swing low of the previous candle or at any level based on your risk appetite.
Sell Scenario
Once the market is trending up / long, we need the RSI to cross above level 70. Wait for the close of a candle below the 2 Blue Lines.  Then confirm that the RSI went from above level 70 to below 70 as showed in the image. At the opening of the next candle, a Short / Sell trade is opened. The stops can be kept at the swing high of the previous candle or at any level based on your risk appetite.
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



void R_RULE (W)
{
//
//
//------------------------------BUYSELL ENGINE ------------------------------
//
//
//--------------PROPERTIES ------------------------------
    Set_Rule(OP_BUYSELL, T_DIRECTION, R_W, P_SIGNAL, D_ANY);
    Set_Rule(OP_BUYSELL, T_DIRECTIONTYPE, R_W, P_SIGNAL, DT_LEVEL);
    Set_Rule(OP_BUYSELL, T_RECOVERYMODE, R_W, P_SIGNAL, M_C);
    Set_Rule(OP_BUYSELL, T_RECOVERYVALUE, R_W, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_ILOT, R_W, P_SIGNAL, 0.1);
    Set_Rule(OP_BUYSELL, T_MAXLOT, R_W, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_MAXCOUNT, R_W, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, R_W, P_SIGNAL, false);
    Set_Rule(OP_BUYSELL, T_EXITMODE, R_W, P_SIGNAL, EM_EXITANY);
    Set_Rule(OP_BUYSELL, T_PIPSTEP, R_W, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_TIMESTEP, R_W, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_MAXTIME, R_W, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_HEDGEMAGNITUDE, R_W, P_SIGNAL, 1);
    Set_Rule(OP_BUYSELL, T_BUYTS, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYTP, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYSL, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTS, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLTP, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SELLSL, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TS, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_TP, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_SL, R_W, P_SIGNAL, 0);
    Set_Rule(OP_BUYSELL, T_BUYLOTTS, R_W, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_BUYLOTTP, R_W, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_W, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_BUY, T_MINPROFIT, R_W, P_SIGNAL, -1);
    Set_Rule(OP_BUYSELL, T_SELLLOTTS, R_W, P_SIGNAL, 10);
    Set_Rule(OP_BUYSELL, T_SELLLOTTP, R_W, P_SIGNAL, 20);
    Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_W, P_SIGNAL, 20);
    Set_Rule(OP_EXIT_SELL, T_MINPROFIT, R_W, P_SIGNAL, -1);
    Set_Rule(OP_EXIT, T_MINPROFIT, R_W, P_SIGNAL, 20);
//--------------END PROPERTIES ------------------------------
//
//
//--------------ACTIONS ------------------------------
    Set_Rule(OP_EXIT, T_STATUS, R_W, P_SIGNAL);
//--------------END ACTIONS ------------------------------
    if ((!Trade_Buy_OnBar_H1 (OP_BUYSELL, R_W) && AndS(Singapore_Swing, S_SELL, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_W, P_SIGNAL);
        Set_Rule(OP_SELL, T_STATUS, R_W, P_SIGNAL);
    }
    if ((!Trade_Sell_OnBar_H1 (OP_BUYSELL, R_W) && AndS(Singapore_Swing, S_BUY, P_H1)))
    {
        Set_Rule(OP_BUYSELL, T_START, R_W, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_W, P_SIGNAL);
    }
}
