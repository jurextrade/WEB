(IF (AND (AndS RSI_2 S_OVERBOUGHT CurrentPeriod )
(AndS MA_200 S_BELOW CurrentPeriod )
)
(START )
(SETQ ordertype OP_SELL )
)
(IF (AND (AndS RSI_2 S_OVERSOLD CurrentPeriod )
(AndS MA_200 S_ABOVE CurrentPeriod )
)
(START )
(SETQ ordertype OP_BUY )
)
(IF (AND (AndS SMA_5 S_CROSS_UP CurrentPeriod )
(AndS MA_200 S_ABOVE CurrentPeriod )
(= ordertype OP_BUY )
)
(BUY )
)
(IF (AND (AndS SMA_5 S_CROSS_DOWN CurrentPeriod )
(AndS MA_200 S_BELOW CurrentPeriod )
(= ordertype OP_SELL )
)
(SELL )
) 
(EXIT )