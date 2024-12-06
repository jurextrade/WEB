//here you define what you want

(IF  (and (AndS ADX_14 S_STRONG CurrentPeriod)  (AndBS S_TRIX S_UP CurrentPeriod ) )
(START )
(BUY )
)
(IF (and (AndS ADX_14 S_STRONG CurrentPeriod)  (AndBS S_TRIX S_DOWN CurrentPeriod )) 
(START )
(SELL )
)


(IF (AndS S_TRIX S_DOWN CurrentPeriod)
(CLOSE_BUY )
)

(IF (AndS  S_TRIX S_UP CurrentPeriod )
(CLOSE_SELL )
)

(IF (AND (= T_SELLNBRTRADE 0 )
(= T_BUYNBRTRADE 0 )
)
(EXIT )
)
