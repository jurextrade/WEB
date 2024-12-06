EXAMPLE 2
=========


ANGLE – EMA 34
Strategy that works on Angles for the Moving Average M34
*This strategy is simply a part of the examples that explains how to write strategies.  

If the low of the bar is above EMA(34) for period M1 and H1 and if the angle EMA(34) for the period M1 is bigger than 15 and the angle of EMA(34) for the period H4 is bigger than 10 we Buy.
If the high of the bar is below EMA(34) for period M1 and H1 and if the angle EMA(34) for the period M1 is less than -15 and the angle of EMA(34) for the period H4 is less than -10 we Sell.
if Last Trade is different from the current trade,  and if the angle of EMA(34) for the period H4 is less or bigger than -15 or 15 we set the recovery mode to K and we increment MaxCount by 1
Direction : Any
Initial Lot : 0.01
Max Count : 30
PipStep : -1 (no distance required between trades)
TimeStep : 5 minutes (time between trades)
Recovery Mode : C and in some cases K
Recovery Value : 20
Profit : 10 $

2015-05-16 12_31_46-9648493_ Alpari-ECN-Demo - Demo Account - [EURUSD,M1 (visual)]

 Properties2015-05-16 12_04_10-

DOWNLOAD

2015-05-16 12_09_28-
 Actions
2015-05-16 12_05_41-
 Schedules
2015-05-09 19_22_31-
 Graph
2015-05-17 20_25_32-Terminal
 Editor

 2015-05-17 20_27_15-

