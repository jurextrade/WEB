ARCHITECTURE
============
 

The basic entities that the system refers very often are  :

OBJECT : The term object in MT4-Progress refers to an indicator.
SIGNAL : signals related to OBJECTS (S_CROSS_UP, S_ABOVE, S_BULL, S_OVERBOUGTH, S_ALERT, S_DISTANCE, … etc)
RULE: represents the behaviour of a strategy, when it starts , when it buys, when it exists and how it works.
ENGINE :  is the property representation of a strategy.  (Recovery mode, Maxcount, PipStep, TimeStep, …).
SESSION: is the instance of an ENGINE . (The session that runs in the MT4 platform).
The advanced architecture of MT4-Progress will not be discussed deeply here as it is not important to fully uderstand it to use the software.  However for advanced projects  integrating artificial intelligence and advanced techniques for their strategies, the architecture based on rules, and lisp language is very adapted.

R_Architecture