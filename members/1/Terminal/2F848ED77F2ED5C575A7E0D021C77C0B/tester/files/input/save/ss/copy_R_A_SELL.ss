(IF (AND (AndPS BAR S_BULL P_D1)
     (AndBS SAR S_BEAR P_H1)
    )
 (START)
 (SELL)
)
(IF (>= TimeCurrent 23:30:00)
 (SET T_MINPROFIT -1)
 (EXIT)
)
(IF (nbrtrades0)
 (EXIT_SELL)
)
