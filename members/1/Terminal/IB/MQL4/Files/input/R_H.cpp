/* ============================================================
STRATEGY : HIGH_LOW_H4_BOX
RULE : H
=============================================================*/
void R_RULE(H) {
    //------------------------------BUYSELL ENGINE ------------------------------
    Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);
    if ((lowofweek == 0)) {
        lowofweek = SValue(LOW, S_FIRSTINWEEK, CurrentPeriod);
    }
    if ((highofweek == 0)) {
        highofweek = SValue(HIGH, S_FIRSTINWEEK, CurrentPeriod);
    }
    if ((Bid > (highofweek + PipValue(5)))) {
        if ((nobuy == 0)) {
            Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);
        }
        Set_Rule(OP_CLOSE_SELL, T_STATUS, R_H, P_SIGNAL);
    }
    if ((Bid < (lowofweek - PipValue(5)))) {
        if ((nosell == 0)) {
            Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);
        }
        Set_Rule(OP_CLOSE_BUY, T_STATUS, R_H, P_SIGNAL);
    }
    if ((AndPS(HIGH, S_MAXINWEEK, CurrentPeriod) && AndPS(CLOSE, S_MAXINWEEK, CurrentPeriod) && AndPS(LOW, S_MAXINWEEK, CurrentPeriod))) {
        highofweek = SValue(HIGH, S_CURRENT, CurrentPeriod);
        lowofweek = SValue(LOW, S_CURRENT, CurrentPeriod);
        nobuy = 1;
        nosell = 1;
    } else {
        nobuy = 0;
        nosell = 0;
    }
    if ((AndPS(CLOSE, S_MININWEEK, CurrentPeriod) && AndPS(LOW, S_MININWEEK, CurrentPeriod) && AndPS(HIGH, S_MININWEEK, CurrentPeriod))) {
        highofweek = SValue(HIGH, S_CURRENT, CurrentPeriod);
        lowofweek = SValue(LOW, S_CURRENT, CurrentPeriod);
        nobuy = 1;
        nosell = 1;
    } else {
        nobuy = 0;
        nosell = 0;
    }
    if (((GetDay(CurrentTime) == 6) && (CurrentTime >= ReturnTime("23:00:00")))) {
        nobuy = 0;
        nosell = 0;
        Set_Rule(OP_EXIT, T_STATUS, R_H, P_SIGNAL);
    }
}