(START )
(IF (AND 
(AndS VOLUME S_UP CurrentPeriod )
(AndS VELOCITY S_OVERBOUGHT CurrentPeriod)
)
(BUY )
(CLOSE_SELL )
)
(IF (AND 
(AndS VOLUME S_UP CurrentPeriod )
    (AndPS VELOCITY S_OVERSOLD CurrentPeriod)
)
(SELL )
(CLOSE_BUY )
)
(EXIT)
(EXIT_BUY)
(EXIT_SELL)