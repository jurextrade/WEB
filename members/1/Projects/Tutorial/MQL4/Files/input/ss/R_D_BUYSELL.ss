(IF (>= CurrentTime 23:00:00)
 (SET T_MINPROFIT 0)
 (EXIT)
 (ELSE (IF (AndS BAR S_BULL_ENGULFING P_D1)
        (START)
        (BUY)
       )
  (IF (AndS BAR S_BEAR_ENGULFING P_D1 )
   (START)
   (SELL)
  )
 )
)
(SET T_SELLLOTSL (/ (- (SPValue HIGH S_CURRENT P_D1)
                     T_LASTORDEROPENPRICE)
                    Point)
)
(SET T_BUYLOTSL (/ (- T_LASTORDEROPENPRICE (SPValue LOW S_CURRENT P_D1)
                   )
                   Point)
)