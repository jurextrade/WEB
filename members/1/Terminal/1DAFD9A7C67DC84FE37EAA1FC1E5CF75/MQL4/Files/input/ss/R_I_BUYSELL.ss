(IF (AND (= (SVALUE BAR S_NBRBARS P_D1) 2) 
        (AndS BAR S_BULL P_D1 )
(AndS HIGH S_UP P_D1 ))
(START )
(BUY )


(IF (= T_BUYLOTSL 0 )
(SET T_BUYLOTSL (Pips (* (SValue ATR_14 S_CURRENT P_D1 )
1 )
)
)
)
(IF (= T_BUYLOTTP 0 )
(SET T_BUYLOTTP (Pips (* (SValue ATR_14 S_CURRENT P_D1 )
1 )
)
)
)
)
(IF (AND (= (SVALUE BAR S_NBRBARS P_D1) 2)(AndS BAR S_BEAR P_D1 )
(AndS LOW S_DOWN P_D1 )
)
(START)

(SELL)
(IF (= T_SELLLOTSL 0 )
(SET T_SELLLOTSL (Pips (* (SValue ATR_14 S_CURRENT P_D1 )
1 )
)
)
)
(IF (= T_SELLLOTTP 0 )
(SET T_SELLLOTTP (Pips (* (SValue ATR_14 S_CURRENT P_D1 )
1 )
)
)
)
)


(SET T_BUYLOTTS (Pips (* (SValue ATR_14 S_CURRENT P_D1 )
1 )
)
)
(SET T_SELLLOTTS (Pips (* (SValue ATR_14 S_CURRENT P_D1 )
1)
)
)


(SET T_SELLLOTTS T_SELLLOTTS )
(SET T_BUYLOTTS T_BUYLOTTS )
(SET T_SELLLOTTP T_SELLLOTTP )
(SET T_BUYLOTTP T_BUYLOTTP )
(SET T_SELLLOTSL T_SELLLOTSL )
(SET T_BUYLOTSL T_SELLLOTSL)

(IF (AND (= T_SELLNBRTRADE 0 )
(= T_BUYNBRTRADE 0 )
)
(EXIT )
)