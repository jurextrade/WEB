(IF (AND (AndS VELOCITY S_OVERSOLD P_M5 ) (AndPS VELOCITY S_DOWN P_M5))
(START )
(SELL )
)

(IF (AND (AndS VELOCITY S_OVERBOUGHT P_M5 ) (AndPS VELOCITY S_UP P_M5))
(START )
(BUY )
)

(IF (AndS VELOCITY S_OVERSOLD P_M5 )
    (SET T_SELLLOTSL 0)
    (ELSE 
        (IF (< T_PROFITSELL -100)
            (CLOSE_SELL)
        )
    )
)

(IF (AndS VELOCITY S_OVERBOUGHT P_M5 )
    (SET T_BUYLOTSL 0)
    (ELSE 
        (IF (< T_PROFITBUY -100)
            (CLOSE_BUY) 
        )   
    )
)   

(IF (AND (= T_SELLNBRTRADE 0 )
(= T_BUYNBRTRADE 0 )
)
(EXIT )
)

 
