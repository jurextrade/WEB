(START)
(IF (AND (AND (AndS HEIKEN_ASHI S_BULL P_D1)
          (AndS HEIKEN_ASHI S_BULL P_W1)
          (AndS RSI_Candles S_ABOVE P_D1)
         )
     (OR (AndBS HEIKEN_ASHI S_BULL P_D1)
      (AndBS HEIKEN_ASHI S_BULL P_W1)
      (AndBS RSI_Candles S_ABOVE P_D1)
     )
    )
 (BUY)
)
(IF (AND (AND (AndS HEIKEN_ASHI S_BEAR P_D1)
          (AndS HEIKEN_ASHI S_BEAR P_W1)
          (AndS RSI_Candles S_BELOW P_D1)
         )
     (OR (AndBS HEIKEN_ASHI S_BEAR P_D1)
      (AndBS HEIKEN_ASHI S_BEAR P_W1)
      (AndBS RSI_Candles S_BELOW P_D1)
     )
    )
 (SELL)
)