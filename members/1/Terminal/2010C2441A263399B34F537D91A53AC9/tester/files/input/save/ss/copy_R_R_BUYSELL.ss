(START)
(IF (AND (AndS RSI_CCI S_SELL P_M5)
     (AndS HEIKEN_ASHI S_BEAR P_M5)
    )
 (SELL)
)
(IF (AND (AndS RSI_CCI S_BUY P_M5)
     (AndS HEIKEN_ASHI S_BULL P_M5)
    )
 (BUY)
)
