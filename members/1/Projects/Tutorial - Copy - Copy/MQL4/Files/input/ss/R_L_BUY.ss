(IF (>= TimeCurrent 23:00:00)
 (SET T_MINPROFIT -1)
 (EXIT)
 (ELSE (IF (AndTS BAR S_BULL_ENGULFING P_D1)
        (START)
        (BUY)
       )
 )
)