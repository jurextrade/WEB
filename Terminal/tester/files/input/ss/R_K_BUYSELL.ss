(IF (AND (AndS MA_200 S_ABOVE CurrentPeriod )
(AndS RSI_2 S_OVERSOLD CurrentPeriod )
)
(START )
(BUY )

(IF (= T_MINPROFIT 0 )
(SET T_MINPROFIT (* (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
1.5 )
)
(* 10 T_ILOT )
)
)
)


(IF (= T_PIPSTEP 0 )
(SET T_PIPSTEP (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
)
)
(IF (AND (AndS MA_200 S_BELOW CurrentPeriod )
(AndS RSI_2 S_OVERBOUGHT CurrentPeriod )
)
(START )
(SELL )
(IF (= T_MINPROFIT 0 )
(SET T_MINPROFIT (* (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
1.5 )
)
(* 10 T_ILOT )
)
)
)
(IF (= T_PIPSTEP 0 )
(SET T_PIPSTEP (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
)
)
(if (= T_BUYNBRTRADE 1) (SELL))
(if (= T_SELLNBRTRADE 1) (BUY))
(if (and (= T_BUYNBRTRADE 1)(= T_SELLNBRTRADE 1))
    (if (= T_LASTORDERTYPE OP_BUY) (CLOSE_SELL))
    (if (= T_LASTORDERTYPE OP_SELL) (CLOSE_BUY))
    
)


(SET T_MINPROFIT T_MINPROFIT )
(SET T_PIPSTEP T_PIPSTEP )

(exit)

