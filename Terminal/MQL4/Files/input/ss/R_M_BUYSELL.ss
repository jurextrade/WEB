(IF (And (AndS SUPPORT S_CROSS_DOWN CurrentPeriod )
(Ands SUPPORT S_BELOW CurrentPeriod))

(START )
(SELL )
(CLOSE_BUY )
(IF (= T_BUYLOTSL 0 )
(SET T_BUYLOTSL (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
)
(IF (= T_BUYLOTTP 0 )
(SET T_BUYLOTTP (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
)
)
(IF (AND (AndS RESISTANCE S_CROSS_UP CurrentPeriod )
    (Ands RESISTANCE S_ABOVE CurrentPeriod))

(START )
(BUY )
(CLOSE_SELL )
(IF (= T_BUYLOTSL 0 )
(SET T_BUYLOTSL (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
)
(IF (= T_BUYLOTTP 0 )
(SET T_BUYLOTTP (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
)
)
(IF (AndS UPFRACTAL S_CHANGED CurrentPeriod )
(CLOSE_BUY )
)
(IF (AndS DOWNFRACTAL S_CHANGED CurrentPeriod )
(CLOSE_SELL )
)
(SET T_BUYLOTTS (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
(SET T_SELLLOTTS (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
2 )
)
)
(SET T_BUYLOTTP T_BUYLOTTP )
(SET T_SELLLOTTP T_SELLLOTTP )
(SET T_SELLLOTSL T_SELLLOTSL )
(SET T_BUYLOTSL T_BUYLOTSL )
(IF (AND (= T_SELLNBRTRADE 0 )
(= T_BUYNBRTRADE 0 )
)
(EXIT )
)