(START)
(IF (AND (AndS PROGRESS S_BUY P_H1)
     (AndS PROGRESS S_BULL P_H1)
     (= T_SELLNBRTRADE 0)
    )
 (BUY)
)
(IF (AND (AndS PROGRESS S_SELL P_H1)
     (AndS PROGRESS S_BEAR P_H1)
     (= T_BUYNBRTRADE 0)
    )
 (SELL)
)
