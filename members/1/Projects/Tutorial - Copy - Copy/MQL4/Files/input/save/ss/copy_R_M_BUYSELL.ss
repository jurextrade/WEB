(IF (AND (AND (AndS HEIKEN_ASHI S_BULL P_W1)
          (AndS HEIKEN_ASHI S_BULL P_D1)
          (AndS RSI_20 S_ABOVE P_D1)
         )
     (OR (AndBS HEIKEN_ASHI S_BULL P_D1)
      (AndBS RSI_20 S_ABOVE P_D1)
     )
    )
 (START)
 (BUY)
)
(IF (AND (AND (AndS HEIKEN_ASHI S_BEAR P_W1)
          (AndS HEIKEN_ASHI S_BEAR P_D1)
          (AndS RSI_20 S_BELOW P_D1)
         )
     (OR (AndBS HEIKEN_ASHI S_BEAR P_D1)
      (AndBS RSI_20 S_BELOW P_D1)
     )
    )
 (START)
 (SELL)
)
(IF (Trade_buy_and_sell)
 (SET T_TS 100)
 (SET T_BUYTS 0)
 (SET T_SELLTS 0)
)
(IF (NOT (AND (AndS HEIKEN_ASHI S_BULL P_W1)
          (AndS HEIKEN_ASHI S_BULL P_D1)
          (AndS RSI_20 S_ABOVE P_D1)
         )
    )
 (CLOSE_BUY)
)
(IF (NOT (AND (AndS HEIKEN_ASHI S_BEAR P_W1)
          (AndS HEIKEN_ASHI S_BEAR P_D1)
          (AndS RSI_20 S_BELOW P_D1 )
         )
    )
 (CLOSE_SELL)
)