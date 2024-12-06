(defun Max_highmaxweek_openfirstweek()
    (setq a (max a (- (SValue HIGH S_MAXINWEEK CurrentPeriod) (SValue OPEN S_FIRSTINWEEK CurrentPeriod))))
)