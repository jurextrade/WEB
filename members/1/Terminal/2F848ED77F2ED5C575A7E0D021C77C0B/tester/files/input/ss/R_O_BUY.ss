(SETQ Distance_From_High (/ (SValue PIVOT_RESISTANCE S_DISTANCE P_D1)
                            Point)
)
(IF (AND (NOT (AndS PIVOT_RESISTANCE S_CROSS_UP P_D1)
         )
     (>= Distance_From_High -8)
     (AndPS BAR S_BULL P_H1)
    )
 (START)
 (BUY)
)
