(IF (AND (AndPS HIGH S_MININWEEK CurrentPeriod )
(AndPS HIGH S_MININDAY CurrentPeriod )
)
(START )
(BUY )
)
(IF (AND (AndPS HIGH S_MAXINWEEK CurrentPeriod )
(AndPS HIGH S_MAXINDAY CurrentPeriod )
(AND (NOT (AndS CLOSE S_MININDAY CurrentPeriod )
)
(AndS CLOSE S_MAXINDAY CurrentPeriod )
)
)
(SET T_BUYLOTSL (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
1.5 )
)
)
)
(IF (AND (AndPS LOW S_MININWEEK CurrentPeriod )
(AndPS LOW S_MININDAY CurrentPeriod )
)
(START )
(BUY )
)
(IF (AND (AndPS LOW S_MAXINWEEK CurrentPeriod )
(AndPS LOW S_MAXINDAY CurrentPeriod )
)
(SET T_SELLLOTSL (Pips (* (SValue ATR_14 S_CURRENT CurrentPeriod )
1.5 )
)
)
)
(SET T_SELLLOTSL T_SELLLOTSL )
(SET T_BUYLOTSL T_BUYLOTSL )
(EXIT )