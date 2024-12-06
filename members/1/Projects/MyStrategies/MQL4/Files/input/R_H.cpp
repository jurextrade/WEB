/* ============================================================
STRATEGY : ProgressSimple
RULE : H
=============================================================*/

void R_RULE (H)
{

//------------------------------BUYSELL ENGINE ------------------------------


if ((AndS(PROGRESS, S_BUY, P_H1) && AndPS(Force, S_ABOVE, P_H1)))

{ Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);Set_Rule(OP_BUY, T_STATUS, R_H, P_SIGNAL);}else 
{Set_Rule(OP_CLOSE_BUY, T_STATUS, R_H, P_SIGNAL);}

if ((AndS(PROGRESS, S_SELL, P_H1) && AndPS(FORCE, S_BELOW, P_H1)))

{ Set_Rule(OP_BUYSELL, T_START, R_H, P_SIGNAL);Set_Rule(OP_SELL, T_STATUS, R_H, P_SIGNAL);}else 
{Set_Rule(OP_CLOSE_SELL, T_STATUS, R_H, P_SIGNAL);}
}

