TRADE FUNCTIONS
===============
 

PL functions intended for managing trading activities.

 

Function	Action
Start	Start a strategy Session.
Buy	Buy Order, Trade is dependent of the session properties.
Sell	Sell Order, Trade is dependent of the session properties.
Exit_Buy	Close all Buy orders in the session. Once Exit no more Buy orders can be performed in the session.
Exit_Sell	Close all Sell orders in the session. Once Exit no more Sell orders can be performed in the session.
Exit	Close all orders and Exit from session.
Close_Buy	Close all Buy orders in the session. Once called Buy orders still can be performed in the session.
Close_Sell	Close all Sell orders in the session.  Once called Sell orders still can be performed in the session.
Close	Close all orders in the session. Session stays alive unless we explicitly call Exit function.
Hedge_Buy	Hedge Buy Orders. Hedges the sum of all Sell orders in the session.
Hedge_Sell	Hedge Sell Orders. Hedges the sum of all Buy orders in the session.
Close_Hedge_Buy	Close the Buy Hedging in the session.
Close_Hedge_Sell	Close the Sell Hedging in the session.
Close_Hedge	Close all hedging in the session.
Set	Set a session attribute to a value