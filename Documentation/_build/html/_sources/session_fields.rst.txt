SESSION FIELDS
==============
 

PL Session Fields to access or to set a strategy session values.

Field	Description	Read	Modify
OPERATION	Operations that are allowed (BUY, SELL or BUYSELL). BUYSELL means that we combine the two trading types BUY and SELL in the same session.	Yes	Yes
BUYMINPROFIT	Minimum buy profit to exit from buy trades. -1 means no min profit	Yes	Yes
SELLMINPROFIT	Minimum sell profit to exit from sell trades. -1 means no min profit	Yes	Yes
RULE	Associating Start Rule	Yes	Yes
KEEPBUYSELL	Keep Combined Buy and Sell for a BUYSELL session with HEDGE as OrderType	Yes	Yes
SUSPEND	Suspend Buy or Sell Orders	Yes	Yes
MINPROFIT	Minimum profit for my session (buy sell combined) to exit from session. -1 it means no minimum is required	Yes	Yes
EXITMODE	Only in a BUYSELL operation mode. It tells if exit of the buy trades should be before sell trades, it can be EXITANY, EXITBUYFIRST or EXITSELLFIRST,	Yes	Yes
PIPSTEP	Minimum distance in pips between two trades. -1 means no distance is required,	Yes	Yes
TIMESTEP	Minimum time in minutes between two trades. -1 means no time,	Yes	Yes
ORDERTYPE	Only in a BUYSELL Operation. MONO: Trades are not hedged. HEDGE: Trades are coupled (buy, sell)	Yes	Yes
DIRECTION	Direction is the way we add trade depending on Direction Type	Yes	Yes
DIRECTIONTYPE	Determines the level of trades for BACWARD and FORWARD Direction	Yes	Yes
RECOVERYMODE	Way the volume of trades are calculated, see Recovery Constants	Yes	Yes
RECOVERYVALUE	Value associated to the Recovery Mode, if Recovery Mode is a multiplier M, the value can be 1.5 or 2 ….	Yes	Yes
ILOT	Initial Lot Size of the session	Yes	Yes
BUYLOT	Current Buy Lot Size of the session	Yes	Yes
SELLLOT	Current Sell Lot Size of the session	Yes	Yes
MAXLOT	Maximum Lots Size allowed to trade in the session	Yes	Yes
MAXLOSS	Maximum loss for the session	Yes	Yes
MAXTIME	Maximum time in minutes we allow a session to live. if it is -1 no time is applied. When MaxTime is reached the session exit automatically if the Profit is positif.	Yes	Yes
MAXCOUNT	Maximum number of trades allowed in the session, for BUYSELL Operation, Maxcount for buy and Maxcount for sell	Yes	Yes
HEDGEMAGNITUDE	Magnitude of hedging for Buy or Sell trades	Yes	Yes
BUYLOTSL	Stop Loss in pips for each Buy order. 0 means no Stop Loss : It closes the BUY orders with this loss	Yes	Yes
BUYLOTTP	Take profit in pips for each Buy order 0 means no Take Profit : It closes the BUY order with this profit	Yes	Yes
BUYLOTTS	Trailing stop in pips for each Buy order. 0 means no Trailing Stop,	Yes	Yes
SELLLOTSL	Stop Loss in pips for each Sell order. 0 means no Stop Stop : It closes the SELL order with this loss	Yes	Yes
SELLLOTTP	Take profit in pips for each Sell order. 0 means no Take Profit : It closes the SELL order with this profit	Yes	Yes
SELLLOTTS	Trailing stop in pips for each Sell order. 0 means no Trailing Stop	Yes	Yes
SL	Stop Loss for the whole session. 0 means no Stop Loss : It closes all orders but we don’t exit the session	Yes	Yes
TP	Take profit for the whole session. 0 means no Take Profit : It closes all orders but we don’t exit the session	Yes	Yes
TS	Trailing stop for the whole session. 0 means no Trailing Stop	Yes	Yes
BUYSL	Stop Loss for of all Buy Orders.0 means no Stop Loss	Yes	Yes
BUYTP	Take profit of all Buy Orders. 0 means no Take Profit : It closes all BUY orders but we don’t exit Buy the session	Yes	Yes
BUYTS	Trailing stop of all Buy Orders. 0 means no Trailing Stop,	Yes	Yes
SELLSL	Stop Loss for all Sell Orders. 0 means no Stop Loss : It closes all BUY orders but we don’t exit Buy the session,	Yes	Yes
SELLTP	Trailing stop of all Sell Orders. 0 means no Take profit : It closes all SELL orders but we don’t exit Sell the session	Yes	Yes
SELLTS	Trailing stop of all Sell Orders. 0 means no Trailing Stop	Yes	Yes
HMAX	Returns the Upper Maximum Value of all orders in the session. Closed Orders are also calculated	Yes	No
HMIN	Returns the Lower Minimum Value of all orders in the session. Closed Orders are also calculated	Yes	No
MAX	Returns the Upper Maximum Value of all active Price orders in the session. Closed Orders if any are not calculated. See Direction Type MINMAX	Yes	No
MIN	Returns the Lower Minimum Value of all active Price orders in the session. Closed Orders if any are not calculated. See Direction Type MINMAX	Yes	No
EXITBUY	Returns 1 when if the session has exited the Buy Orders otherwise 0, A call to Exit Buy has been called. No more Buy Orders can be performed in the session. If we want to still do Buy Orders after closing we should use Close Buy	Yes	No
EXITSELL	Returns 1 when if the session has exited the Sell Orders otherwise 0. A call to Exit Sell has been called. No more Sell Orders can be performed in the session. If we want to still do Sell Orders after closing use Close Sell,	Yes	No
CLOSEBUY	Returns 1 when the session is to Buy Orders or Close Buying Orders in process, returns 0 when all Buy orders have been closed,	Yes	No
CLOSESELL	Returns 1 when the session is to Sell Orders or Close Selling Orders in process, returns 0 when all Sell orders have been closed	Yes	No
PROFITBUY	Returns the Profit Value of all Active Buy Orders in the session. Closed Orders are not calculated.	Yes	No
PROFITSELL	Returns the Profit Value of all Active Sell Orders in the session. Closed Orders are not calculated.	Yes	No
PROFIT	Returns the Profit Value of all Active and History Orders in the session. All Orders are calculated.	Yes	No
LASTLOT	Returns the Lot value of the Last Buying or Selling Order	Yes	No
LASTBUYLOT	Returns the Lot value of the Last Buying Order	Yes	No
LASTSELLLOT	Returns the Lot value of the Last Selling Order	Yes	No
STARTTRADE	Returns the Start Date/Time of the session.	Yes	No
NEUTRALPOINT	Returns the Price which is the middle of T_MIN and T_MAX	Yes	No
BUYAVERAGEPOINT	Returns the Price value where All Active Buy Orders are averaged. Profit Buy to 0.,	Yes	No
SELLAVERAGEPOINT	Returns the Price value where All Active Sell Orders are averaged. Profit Sell to 0.,	Yes	No
HEDGELLINE	Returns the Average Price of All Active Hegde Orders. Hedge Profit 0,	Yes	No
HEDGENBRLOTS	Returns the Lot Size of All Active Hegde Orders	Yes	No
BUYHEDGENBRLOTS	Returns the Lot Size of All Buy Active Hegde Orders	Yes	No
SELLHEDGENBRLOTS	Returns the Lot Size of All Sell Active Hegde Orders	Yes	No
HEDGETYPE	Returns the Current Hedge Type : OP_BUY = 0, OP_SELL = 1 or OP_BUYSELL = 2. OP_BUYSELL means we are Hedging Buy Orders and Hedging Sell Orders in the session.,	Yes	No
HEDGED	Returns 1 if orders are hedged in the session otherwise 0.	Yes	No
HASBEENHEDGED	Returns 1 if hegde has been performed in the session since it started, even if we exited the hedge, 0 otherwise.	Yes	No
HEDGEPROFIT	Returns the Total Profit of all Active Hedge Orders in the session. Buy and Sell if any. History Orders are not calculated.	Yes	No
HEDGEBUYPROFIT	Returns the Total Profit of all Active Hedge Buy Orders in the session. History Orders are not calculated.	Yes	No
HEDGESELLPROFIT	Returns the Total Profit of all Active Hedge Sell Orders in the session. History Orders are not calculated.	Yes	No
BUYNBRTRADE	Returns the number of Active Buy Orders, for each order we increment the number by one independantly from the size. Closed Buy Orders are not calculated.	Yes	No
SELLNBRTRADE	Returns the number of Active Sell Orders, for each order we increment the number by one independantly from the size. Closed Sell Orders are not calculated.	Yes	No
BUYNBRLOTS	Returns the Sum of all Lots Size for Active Buy Orders. Closed Buy Orders are not calculated.	Yes	No
SELLNBRLOTS	Returns the Sum of all Lots Size for Active Sell Orders. Closed Buy Orders are not calculated.	Yes	No
LASTORDEROPENTIME	Returns the Open Time of the Last Order in the session. Last Order can be Active or Closed.	Yes	No
LASTORDERCLOSETIME	Returns the Close Time of the Last Order in the session.	Yes	No
LASTORDERCLOSEPROFIT	Returns the profit of the Last Closed Order in the session.	Yes	No
LASTORDERCLOSETYPE	Returns the type of the Last Closed Order in the session. Buy or Sell.	Yes	No
LASTORDEROPENPRICE	Returns the Open Price of the Last Order Opened in the session.	Yes	No
LASTORDERCLOSEPRICE	Returns the Close Price of the Last Order Closed in the session.	Yes	No
FIRSTORDEROPENTIME	Returns the Open Time of the First Order in the session. First Order can be Active or Closed.	Yes	No
FIRSTORDERCLOSETIME	Returns the Close Time of the First Order in the session.	Yes	No
FIRSTORDEROPENPRICE	Returns the Open Price of the First Order in the session. Active or Closed.	Yes	No
FIRSTORDERCLOSEPRICE	Returns the Close Price of the First Order Closed in the session.	Yes	No
LEVELPOINT	Returns the Open Price of the Last Order Opened in the session. Same as LASTORDEROPENPRICE	Yes	No
Example
To access a value in the session :
(IF (AND (= T_BUYNBRTRADE T_MAXCOUNT)
(= T_SELLNBRTRADE T_MAXCOUNT)
)
(CLOSE_BUY)
(CLOSE_SELL)
)
* if the number of buy trades is equal to maxcount defined for the session and the number of sell trades equal to maxcount, we close all buy orders and sell orders. 
To modify a field when it is modifiable (the column Modify is set to yes  in the table above) , we use the set function :
(SET T_BUYLOTSL (/  (- T_LASTORDEROPENPRICE (SPValue LOW S_CURRENT P_D1))     Point)
* We set the stop loss of all buy orders in the session to the distance between the last order open price and the low of the previous day. SPValue returns  the value of the previous bar., this is equivalent to (SValue LOW S_PREVIOUS P_D1)