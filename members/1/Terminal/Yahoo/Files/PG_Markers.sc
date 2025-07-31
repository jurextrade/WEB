(defun highmaxweek_openfirstweek () (-(SValue HIGH S_MAXINWEEK CurrentPeriod)(SValue OPEN S_FIRSTINWEEK CurrentPeriod)))
(defun lowmaxweek_openfirstweek () (-(SValue LOW S_MININWEEK CurrentPeriod)(SValue OPEN S_FIRSTINWEEK CurrentPeriod)))
(defun Max_highmaxweek_openfirstweek () (SETQ a(Max a(-(SValue HIGH S_MAXINWEEK CurrentPeriod)(SValue OPEN S_FIRSTINWEEK CurrentPeriod)))))
(defun Min_lowmaxweek_openfirstweek () (SETQ a(Min a(-(SValue LOW S_MININWEEK CurrentPeriod)(SValue OPEN S_FIRSTINWEEK CurrentPeriod)))))
