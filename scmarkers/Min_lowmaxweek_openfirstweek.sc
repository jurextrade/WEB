(defun Min_lowmaxweek_openfirstweek()
    (setq a (Min a (- (SValue LOW S_MININWEEK CurrentPeriod) (SValue OPEN S_FIRSTINWEEK CurrentPeriod))))
)