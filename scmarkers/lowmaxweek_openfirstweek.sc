(defun lowmaxweek_openfirstweek()
    (- (SValue LOW S_MININWEEK CurrentPeriod) (SValue OPEN S_FIRSTINWEEK CurrentPeriod))
)