#include "Progress.h"
#include "PG_Objects.h"
void SYSTEM (x)
{
//========================================== GENESIS~BUY : BUY SIGNAL ==============
    if (((OrS(GANHILO, S_BULL, x) && OrS(T3_2, S_BULL, x) && OrS(TVI, S_BULL, x) && OrS(CCI, S_ABOVE, x)) && (OrPS(GANHILO, S_BEAR, x) || OrPS(T3_2, S_BEAR, x) || OrPS(TVI, S_BEAR, x) || OrPS(CCI, S_BELOW, x))))
    {
        Set_Signal (GENESIS, S_BUY, x, P_SIGNAL);
    }
//========================================== GENESIS~SELL : SELL SIGNAL ==============
    if (((OrS(GANHILO, S_BEAR, x) && OrS(T3_2, S_BEAR, x) && OrS(TVI, S_BEAR, x) && OrS(CCI, S_BELOW, x)) && (OrPS(GANHILO, S_BULL, x) || OrPS(T3_2, S_BULL, x) || OrPS(TVI, S_BULL, x) || OrPS(CCI, S_ABOVE, x))))
    {
        Set_Signal (GENESIS, S_SELL, x, P_SIGNAL);
    }
//========================================== GENESIS~BULL : BULL SIGNAL ==============
    if ((OrS(GANHILO, S_BULL, x) && OrS(T3_2, S_BULL, x) && OrS(TVI, S_BULL, x) && OrS(CCI, S_ABOVE, x)))
    {
        Set_Signal (GENESIS, S_BULL, x, P_SIGNAL);
    }
//========================================== GENESIS~BEAR : BEAR SIGNAL ==============
    if ((OrS(GANHILO, S_BEAR, x) && OrS(T3_2, S_BEAR, x) && OrS(TVI, S_BEAR, x) && OrS(CCI, S_BELOW, x)))
    {
        Set_Signal (GENESIS, S_BEAR, x, P_SIGNAL);
    }
//========================================== STO_BB~BUY : BUY SIGNAL ==============
    if ((OrPV_LEq(CLOSE, S_PREVIOUS, SPValue(BB_L, S_PREVIOUS, x), x) && OrPS(STOCHA_M, S_EXT_OVERSOLD, x) && OrPS(BAR, S_BULL, x) && OrS(BAR, S_BULL, x)))
    {
        Set_Signal (STO_BB, S_BUY, x, P_SIGNAL);
    }
//========================================== STO_BB~SELL : SELL SIGNAL ==============
    if ((OrPV_G(CLOSE, S_PREVIOUS, SPValue(BB_U, S_PREVIOUS, x), x) && OrPS(STOCHA_M, S_EXT_OVERBOUGHT, x) && OrPS(BAR, S_BEAR, x) && OrS(BAR, S_BEAR, x)))
    {
        Set_Signal (STO_BB, S_SELL, x, P_SIGNAL);
    }
//========================================== STO_SAR~BUY : BUY SIGNAL ==============
    if ((OrS(SAR, S_BULL, x) && OrS(STOCHA_M, S_OVERSOLD, x) && OrPS(STOCHA_M, S_RCROSSED, x) && OrPS(BAR, S_BULL, x)))
    {
        Set_Signal (STO_SAR, S_BUY, x, P_SIGNAL);
    }
//========================================== STO_SAR~SELL : SELL SIGNAL ==============
    if ((OrS(SAR, S_BEAR, x) && OrS(STOCHA_M, S_OVERBOUGHT, x) && OrPS(STOCHA_M, S_RCROSSED, x) && OrPS(BAR, S_BEAR, x)))
    {
        Set_Signal (STO_SAR, S_SELL, x, P_SIGNAL);
    }
//========================================== Singapore_Swing~BUY : BUY SIGNAL ==============
    if ((OrPS(Trendline1, S_CROSS_UP, x) && OrPS(Trendline2, S_CROSS_UP, x) && OrPV_G(CLOSE, S_CURRENT, SPValue(Trendline1, S_CURRENT, x), x) && OrPV_G(CLOSE, S_CURRENT, SPValue(Trendline2, S_CURRENT, x), x)))
    {
        Set_Signal (Singapore_Swing, S_BUY, x, P_SIGNAL);
    }
//========================================== Singapore_Swing~SELL : SELL SIGNAL ==============
    if ((OrPS(Trendline1, S_CROSS_DOWN, x) && OrPS(Trendline2, S_CROSS_DOWN, x) && OrPV_L(CLOSE, S_CURRENT, SPValue(Trendline1, S_CURRENT, x), x) && OrPV_L(CLOSE, S_CURRENT, SPValue(Trendline2, S_CURRENT, x), x)))
    {
        Set_Signal (Singapore_Swing, S_SELL, x, P_SIGNAL);
    }
}