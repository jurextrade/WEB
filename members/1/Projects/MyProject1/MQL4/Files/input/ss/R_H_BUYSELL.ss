(IF (OR (AndS RSI_20 S_CROSS_UP P_H1)
     (AndS RSI_20 S_CROSS_DOWN P_H1)
    )
 (START)
 (IF (OR (Trade_only_buy)
      (Trade_only_sell)
     )
  (CLOSE_BUY)
  (CLOSE_SELL)
 )
)
(IF (AND (AndS RSI_20 S_RANGE P_H1)
     (AndPS RSI_20 S_OVERSOLD P_H1)
     (Trade_buy_and_sell)
    )
 (IF (>= T_PROFITSELL 10)
  (CLOSE_SELL)
 )
)
(IF (AND (AndS RSI_20 S_RANGE P_H1)
     (AndPS RSI_20 S_OVERBOUGHT P_H1)
     (Trade_buy_and_sell)
    )
 (IF (>= T_PROFITBUY 10)
  (CLOSE_BUY)
 )
)
