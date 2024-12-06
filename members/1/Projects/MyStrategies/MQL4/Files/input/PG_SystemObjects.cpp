#include "Progress.h"
#include "PG_Objects.h"
void SYSTEM (x)
{
//========================================== THV~BUY : BUY SIGNAL ==============
    if ((OrS(PROGRESS, S_BULL, x) && OrS(HIGH, S_BULL, x)))
    {
        Set_Signal (THV, S_BUY, x, P_SIGNAL);
    }
//========================================== THV~SELL : SELL SIGNAL ==============
    if ((OrS(PROGRESS, S_BEAR, x) && OrS(LOW, S_BEAR, x)))
    {
        Set_Signal (THV, S_SELL, x, P_SIGNAL);
    }
//========================================== GENESIS~BUY : BUY SIGNAL ==============
    if ((OrS(GANHILO, S_BULL, x) && OrS(T3_2, S_BULL, x) && OrS(TVI, S_BULL, x) && OrS(CCI, S_ABOVE, x)))
    {
        Set_Signal (GENESIS, S_BUY, x, P_SIGNAL);
    }
//========================================== GENESIS~SELL : SELL SIGNAL ==============
    if ((OrS(GANHILO, S_BEAR, x) && OrS(T3_2, S_BEAR, x) && OrS(TVI, S_BEAR, x) && OrS(CCI, S_BELOW, x)))
    {
        Set_Signal (GENESIS, S_SELL, x, P_SIGNAL);
    }
//========================================== GENESIS~BULL : BULL SIGNAL ==============
    if (OrS(GENESIS, S_BUY, x))
    {
        Set_Signal (GENESIS, S_BULL, x, P_SIGNAL);
    }
//========================================== GENESIS~BEAR : BEAR SIGNAL ==============
    if (OrS(GENESIS, S_SELL, x))
    {
        Set_Signal (GENESIS, S_BEAR, x, P_SIGNAL);
    }
//========================================== RSI_CCI~BUY : BUY SIGNAL ==============
    if (((OrS(CCI_14, S_CROSS_UP, x) && OrS(RSI_8, S_ABOVE, x)) || (OrS(RSI_8, S_CROSS_UP, x) && OrS(CCI_14, S_ABOVE, x))))
    {
        Set_Signal (RSI_CCI, S_BUY, x, P_SIGNAL);
    }
//========================================== RSI_CCI~SELL : SELL SIGNAL ==============
    if (((OrS(CCI_14, S_CROSS_DOWN, x) && OrS(RSI_8, S_BELOW, x)) || (OrS(RSI_8, S_CROSS_DOWN, x) && OrS(CCI_14, S_BELOW, x))))
    {
        Set_Signal (RSI_CCI, S_SELL, x, P_SIGNAL);
    }
//========================================== RSI_CCI~BULL : BULL SIGNAL ==============
    if (OrS(RSI_CCI, S_BUY, x))
    {
        Set_Signal (RSI_CCI, S_BULL, x, P_SIGNAL);
    }
//========================================== RSI_CCI~BEAR : BEAR SIGNAL ==============
    if (OrS(RSI_CCI, S_SELL, x))
    {
        Set_Signal (RSI_CCI, S_BEAR, x, P_SIGNAL);
    }
//========================================== MySystem~BUY : BUY SIGNAL ==============
    if ((OrS(TDI_Green, S_RCROSSED, x) && OrV_G(TDI_Green, S_CURRENT, SValue(TDI_RL, S_CURRENT, x), x)))
    {
        Set_Signal (MySystem, S_BUY, x, P_SIGNAL);
    }
//========================================== MySystem~SELL : SELL SIGNAL ==============
    if ((OrS(TDI_Green, S_RCROSSED, x) && OrV_L(TDI_Green, S_CURRENT, SValue(TDI_RL, S_CURRENT, x), x)))
    {
        Set_Signal (MySystem, S_SELL, x, P_SIGNAL);
    }
//========================================== MySystem~EXIT_BUY : EXIT BUY SIGNAL ==============
    if (OrV_L(TDI_Green, S_CURRENT, SValue(TDI_RL, S_CURRENT, x), x))
    {
        Set_Signal (MySystem, S_EXIT_BUY, x, P_SIGNAL);
    }
//========================================== MySystem~EXIT_SELL : EXIT SELL SIGNAL ==============
    if (OrV_G(TDI_Green, S_CURRENT, SValue(TDI_RL, S_CURRENT, x), x))
    {
        Set_Signal (MySystem, S_EXIT_SELL, x, P_SIGNAL);
    }
//========================================== MySystem~BULL : BULL SIGNAL ==============
    if (OrV_L(TDI_Green, S_CURRENT, SValue(TDI_RL, S_CURRENT, x), x))
    {
        Set_Signal (MySystem, S_BULL, x, P_SIGNAL);
    }
//========================================== MySystem~BEAR : BEAR SIGNAL ==============
    if (OrV_G(TDI_Green, S_CURRENT, SValue(TDI_RL, S_CURRENT, x), x))
    {
        Set_Signal (MySystem, S_BEAR, x, P_SIGNAL);
    }
}