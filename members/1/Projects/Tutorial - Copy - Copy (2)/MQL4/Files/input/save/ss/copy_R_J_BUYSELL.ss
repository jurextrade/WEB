(START)
(IF (AND (NOT (Trade_Buy_OnBar_H1)
         )
     (Candle_Buy_Entry_D1)
     (Candle_Min_Size)
     (AndS BAR S_BULL P_H1)
    )
 (BUY)
)
(IF (AND (NOT (Trade_Sell_OnBar_H1)
         )
     (Candle_Sell_Entry_D1)
     (Candle_Min_Size)
     (AndS BAR S_BEAR P_H1 )
    )
 (SELL)
)
