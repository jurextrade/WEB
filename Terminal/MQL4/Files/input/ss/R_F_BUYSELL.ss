(IF (AndS BAR S_BULL P_H4 P_D1 P_W1 P_MN )
(START )
(BUY )
)
(IF (AndS BAR S_BEAR P_H4 P_D1 P_W1 P_MN )
(START )
(SELL )
)
(IF (AND (= (GetDay CurrentTime )
6 )
(>= CurrentTime 23:00:00 )
(>= T_PROFIT 0 )
)
(EXIT )
)
(IF (AND (= T_BUYNBRTRADE 1 )
(= T_SELLNBRTRADE 1 )
(> T_PROFIT 0 )
)
(EXIT )
)
(IF (AndS BAR S_BEAR P_D1 )
(CLOSE_BUY )
)
(IF (AndS BAR S_BULL P_D1 )
(CLOSE_SELL )
)