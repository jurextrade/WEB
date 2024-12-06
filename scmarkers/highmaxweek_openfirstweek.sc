(defun highmaxweek_openfirstweek()
    (- (SValue HIGH S_MAXINWEEK CurrentPeriod) (SValue OPEN S_FIRSTINWEEK CurrentPeriod))
)    