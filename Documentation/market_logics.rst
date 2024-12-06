Market Logics
=============
 

PL functions intended for managing logical trading signals on Objects (Indicators). Returns True or False.

 

Function	Action
AndS	AND Period Logic operation for a signal occuring on an Object for the current Bar. Returns true/false
AndPS	AND Logic operation on Object (Indicator) for the Previous Bar(the Bar that precedes the current bar for the period).
AndBS	AND Period Logic operation for a signal occuring on an Object on a Bar while the previous bar is the contrary. Returns true/false.
AndTS	AND Period Logic operation for a signal occuring on an Object on a tick for the current Bar while the previous tick is the contrary. Returns true/false.
OrS	OR Period Logic operation for a signal occuring on an Object for the current Bar. Returns true/false
OrPS	OR Logic operation on Object (Indicator) for the Previous Bar(the Bar that precedes the current bar for the period). Define Signal and Periods.
OrBS	OR Period Logic operation for a signal occuring on an Object on a Bar while the previous bar is the contrary. Returns true/false.
OrTS	OR Period Logic operation for a signal occuring on an Object on a tick for the current Bar while the previous tick is the contrary. Returns true/false.