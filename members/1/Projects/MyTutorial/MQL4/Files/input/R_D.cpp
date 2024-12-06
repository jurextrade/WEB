/* ============================================================
STRATEGY : ENGULFING_D1
RULE : D
=============================================================*/

void R_RULE (D)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((TimeCurrent >= ReturnTime("23:00:00")))

{ Set_Rule(OP_EXIT, T_MINPROFIT, R_D, P_SIGNAL, 0);Set_Rule(OP_EXIT, T_STATUS, R_D, P_SIGNAL);}else 
{
if (AndS(BAR, S_BULL_ENGULFING, P_D1))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_D, P_SIGNAL);}

if (AndS(BAR, S_BEAR_ENGULFING, P_D1))

{ Set_Rule(OP_BUYSELL, T_START, R_D, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_D, P_SIGNAL);}
}
Set_Rule(OP_BUYSELL, T_SELLLOTSL, R_D, P_SIGNAL, ((SPValue(HIGH, S_CURRENT, P_D1) - RValue (OP_BUYSELL, T_LASTORDEROPENPRICE, R_D)) / Point));Set_Rule(OP_BUYSELL, T_BUYLOTSL, R_D, P_SIGNAL, ((RValue (OP_BUYSELL, T_LASTORDEROPENPRICE, R_D) - SPValue(LOW, S_CURRENT, P_D1)) / Point));}

