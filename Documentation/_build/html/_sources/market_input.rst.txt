MARKET INPUT
============
 

PL functions returning value of trading signals.

Function	Action
SValue	Returns Signal Value for an Object on a Period for the Current Bar.
SPValue	Returns Signal Value for an Object on a Period for the Previous Bar.
AndV	AND Period Logic Value operation for a signal occuring on an Object for the Current Bar. Must be used only with < > <= >= = Operators.
Example (> (AndV RSI S_CURRENT P_M5 P_M5) 10)
AndPV	AND Period Logic Value operation for a signal occuring on an Object for the Previous Bar. Must be used only with < > <= >= = Operators.
Example (> (AndPV RSI S_CURRENT P_M5 P_M5) 10)
AndBV	AND Period Logic Value operation for a signal occuring on an Object for the Current Bar while Not occuring on the Previous One. Must be used only with < > <= >= = Operators.
Example (> (AndBV RSI S_CURRENT P_M5 P_M5) 10)
OrV	OR Period Logic Value operation for a signal occuring on an Object for the Current Bar. Must be used only with < > <= >= = Operators.
Example (> (OrV RSI S_CURRENT P_M5 P_M5) 10)
OrPV	OR Period Logic Value operation for a signal occuring on an Object for the Previous Bar. Must be used only with < > <= >= = Operators.
Example (> (OrPV RSI S_CURRENT P_M5 P_M5) 10)
OrBV	OR Period Logic Value operation for a signal occuring on an Object for the Current Bar while Not occuring on the Previous One. Must be used only with < > <= >= = Operators.
Example (> (OrBV RSI S_CURRENT P_M5 P_M5) 10)