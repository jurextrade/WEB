/* ============================================================
STRATEGY : PivotHigh Cross Line
RULE : O
=============================================================*/
void R_RULE_O() {
    //------------------------------BUYSELL ENGINE ------------------------------
    Distance_From_High = MathAbs((SValue(PIVOT_HIGH, S_DISTANCE, P_D1) / Point));
    if ((!AndS(PIVOT_HIGH, S_CROSS_UP, P_D1) && AndS(PIVOT_HIGH, S_BELOW, P_D1) && (Distance_From_High <= 10))) {
        Set_Rule(OP_BUYSELL, T_START, R_O, P_SIGNAL);
        Set_Rule(OP_BUY, T_STATUS, R_O, P_SIGNAL);
    }
}