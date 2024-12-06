Recovery Types
==============
 

 
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
| Recovery Type |   Recovery Value   | 	Explanation	Strategies                                                                                                                                 |
+===============+====================+=========================================================================================================================================================+
|     C			|		—       	 |	Lots have the same size, and the Recovery Value is not used																							   |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     I			|					 |	Lot size is incremented with value indicated in Recovery Value if Recovery Value is 0.2 and ax Count	                                               |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     M			|					 |	Martingale with multiplier that is indicated in Recovery Value	                                                                                       |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     D			|					 |	Lots have the same size and are doubled when the number of trades reached the value precised in Recovery Value. If Recovery Value is 3 and Initial Lot |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     A	 		|		—			 |	Alembex : If lost same lot else last cumulative lots. for instance we lose 0.1 0.1 0.1 and we gain 0.1 the next lot will be 0.3. If we win the last    |                                                                                                       |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     J			|					 |	multiplier after close one side	                                                                                                                       |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     N	 		|		—			 |	1.2.6 Sequence, if Max Count is for instance 5 and Initial Lot is 0.1 we will have (0.1 0.2 0.6 0.1 0.2)	                                           |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     H	 		|		—  			 |	1.1.2.4 Sequence, if Max Count is for instance 6 and Initial Lot is 0.1 we will have (0.1 0.1 0.2 0.4 0.1 0.2)	                                       |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     S	 		|		—			 |	1.1.3.3 Sequence, if Max Count is for instance 5 and Initial Lot is 0.1 we will have (0.1 0.1 0.3 0.3 0.1)	                                           |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     O	 		|		—			 |	1.2.6.24 Sequence, if Max Count is for instance 5 and Initial Lot is 0.1 we will have (0.1 0.2 0.6 0.24 0.1)	                                       |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     P	 		|		—			 |	If in the sequence we have a loosing trade, the next trade size is Initial Lot until we have a gaining trade. Once we have a gaining trade the next tra|
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     Q			|					 |	If Last lot is closed with lost we multiply next lot by multiplier precised in Recovery Value. OtherWise Next lot is Initial Lot	                   |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     L			|					 |	Lot Order Size Based on Leverage of Loss for an opposite distance in pips indicated in Recovery Value	                                               |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     K			|					 |	Leverage : An opposite Size Based on Leverage of Loss for an opposite distance in pips indicated in Recovery Value	                                   |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+
|     F	 		|		-			 |	Lot size is the Fibonacci of the number of trades multiply Initial Lot. If Initial Lot is 0.1 than we have (0.1 0.1 0.2 0.3 0.5 0.8 …) until Max Count |
+---------------+--------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+



 The Recovey Type built-in  supported in MT4-Progress :
 Recovery Type	Recovery Value	Explanation	Strategies
C	—	Lots have the same size, and the Recovery Value is not used	
I		Lot size is incremented with value indicated in Recovery Value if Recovery Value is 0.2 and Initial Lot is 0.1 we have (0.1 0.3 0.5 0.7 0.9 ….) until Max Count	
M		Martingale with multiplier that is indicated in Recovery Value	
D		Lots have the same size and are doubled when the number of trades reached the value precised in Recovery Value. If Recovery Value is 3 and Initial Lot is 0.3 than  we have (0.3 0.3 0.3 0.6 0.6 …) until Max Count	
A	 —	Alembex : If lost same lot else last cumulative lots. for instance we lose 0.1 0.1 0.1 and we gain 0.1 the next lot will be 0.3. If we win the last lot we will start with 0.1, if not we continue with 0.3 lot size and so on	
J		multiplier after close one side	
N	 —	1.2.6 Sequence, if Max Count is for instance 5 and Initial Lot is 0.1 we will have (0.1 0.2 0.6 0.1 0.2)	
H	 —	1.1.2.4 Sequence, if Max Count is for instance 6 and Initial Lot is 0.1 we will have (0.1 0.1 0.2 0.4 0.1 0.2)	
S	 —	1.1.3.3 Sequence, if Max Count is for instance 5 and Initial Lot is 0.1 we will have (0.1 0.1 0.3 0.3 0.1)	
O	 —	1.2.6.24 Sequence, if Max Count is for instance 5 and Initial Lot is 0.1 we will have (0.1 0.2 0.6 0.24 0.1)	
P	 —	If in the sequence we have a loosing trade, the next trade size is Initial Lot until we have a gaining trade. Once we have a gaining trade the next trade size is the increment of the biggest lot in the session with Initial Lot.	
Q		If Last lot is closed with lost we multiply next lot by multiplier precised in Recovery Value. OtherWise Next lot is Initial Lot	
L		Lot Order Size Based on Leverage of Loss for an opposite distance in pips indicated in Recovery Value	
K		Leverage : An opposite Size Based on Leverage of Loss for an opposite distance in pips indicated in Recovery Value	
F	 —	Lot size is the Fibonacci of the number of trades multiply Initial Lot. If Initial Lot is 0.1 than we have (0.1 0.1 0.2 0.3 0.5 0.8 …) until Max Count