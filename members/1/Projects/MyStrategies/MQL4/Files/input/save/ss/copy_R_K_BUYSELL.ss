(START)
(BUY)
(SELL)
(IF (AND (AndS PIVOT_POINT S_CROSS_DOWN P_M15)
     (>= T_PROFITBUY 10)
    )
 (CLOSE_BUY)
)
(IF (AND (AndS PIVOT_POINT S_CROSS_UP P_M15 )
     (>= T_PROFITSELL 10)
    )
 (CLOSE_SELL)
)
(IF (OR (AndS PIVOT_RESISTANCE1 S_TOUCHED P_D1)
     (AndS PIVOT_SUPPORT1 S_TOUCHED P_D1)
    )
 (EXIT)
)
(IF (AND (>= TimeCurrent 23:28:22)
     (>= T_PROFIT 0)
    )
 (EXIT)
)
