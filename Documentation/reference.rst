REFERENCE
=========
In this section we describe the architecture of the software, the concepts  used (Sessions, Properties, Rules, …) and the Progress Language (PL) for writing your strategies.

It is very important to understand the architecutre of MT4-Progress, to be able to write your strategies. Once you understand it, you will see how simple it is and you can build your strategy in few minutes. 

The simplicity of writing strategies in MT4-Progress is related to it’s architecture based on signals and rules. To fully undestand, the best way to start  is with an example.

Let’s write  a buy scale strategy :  (A scale strategy is for instance to buy a 0.1 lot every 10 pips backwards till we reach 1 lot. We exit once we reach a 100 dollars profit).

This can be written on 3 lines in PL Language :

(START)
(BUY)
(EXIT)

Yes ! these are the only statements you write in PL language. Here is why.  On every tick these statements are called. The call marks  a flag  to each type of action to be executed : In our example,  it marks a flag to start the strategy, it marks a flag to buy an order, and it marks a flag to exit the session.  As we call them without any conditional statement, the three actions are all marked. Remember that nothing is executed yet.

Once this is done,  the Progress expert that runs on the MT4 terminal  sequentially and on every tick do globally 3 things  : First treats the (start) action then  the (Buy/Sell) actions and if no trades are performed,  it treats in last the (close/exit) actions.

In our example it sees a flag to start the strategy,   if there is no session already running for this strategy, it starts a session,  in the case there is already a session  started for this strategy,  it ignores this flag.  Afterwards the EA check the buy and sell flags, as  in our case the buy flag is set, it checks the properties of the strategy (initial lot, maximum number of trades, the recovery mode , the distance between orders, the time between orders, etc…) to see if a buy order can be done. If a buy order can be done it executes the trade in MT4.  Finally if no orders are started,  it checks the close or exit flags. In our example as the exit flag is set, the EA checks the exit properties (minimum profit, sell minimum profit, stop loss for the session, etc) to see if a close or an exit can be done.

Once finished  it reset all the flags for all the actions to 0 . The same thing starts again on the next tick.

For this reason the order in which  you write the statements in PL does not matter.  The following suite :

(BUY)
(EXIT)
(START)

will run in the same manner.

To finish writing our strategy we need to set the value of some of the properties of our strategy :

Minimum profit :100 (Account currency)
Initial lot : 0.1 (first lot to trade)
Recovery :  C (Constant as we want all trades the same size)
Direction : Backwards (we want to buy when the price is less than the previous price)
Direction Type : Level (it means the distance of the next order to buy is the previous order price)
MaxCount : 10 (10 X 0.1 lots to make a lot)
PipStep: 10 (we want 10 pipsteps between orders)
We keep the default value for the other properties.

Our example of scale strategy is completely designed.

To write a Buy martingale the only things that you change is
the Recovery property which will be M instead of C and the
Recovery Value : 2 or 1.5 …  as the default value is always 1.

Now let’s go a little deeper in our example. When we set the defaults property values of our strategy, these values are set each time by the EA before running the actions.  Let’s suppose we want to change the initial lot in our file PL file, so here how this is done :

(SET T_INITIALLOT 0.2)
(START)
(BUY)
(EXIT)

Remember, this PL Script runs on every tick.

As the EA set first the default values of our strategy before running the PL script, the initial lot here  is 0.1 which is the default value, after executing the PL script, the SET action  overrides the default value by the new value which is 0.2. For the SET action the order is important because if any set on the same property comes after, it will override the previous one. In our example the initial lot will be 0.2 and all the other lots will be 0.2.

Now let’s suppose we want to add this scenario : When the RSI of the period H1 is oversold , we want the buy size order to be 0.4 instead of 0.1. Here how we write it :

(IF (ANDS RSI S_OVERSOLD P_H1) (SET T_LOT 0.4))
(START)
(BUY)
(EXIT)

In our example the default value of every lot is equal to initial lot as the recovery is of type constant,  in this case when the condition of oversold is met the lot size property is set to 0.4. A sequence of our strategy can look like this on a EURUSD:

1.1532  buy 0.1
1.1522 buy 0.1
1.1512 buy 0.1
1.1502 buy 0.4 (here RSI is oversold for the period H1)
1.1498 buy 0.1 (RSI is not oversold anymore)

1.1520 exit (100 profit)

Instead of exiting all lots once a profit of 100  dollars is done, we want that for every lot we take profit at 10 pips above the buy level, which in our case is the level of the previous order. Here how we write it :

(IF (ANDS RSI S_OVERSOLD P_H1) (SET T_LOT 0.4))
(START)
(BUY)
(EXIT)
(SET T_BUYLOTTP  10)

Notice again that the order of all actions statements in our PL file is not important  as nothing is executed except the SET action which overrides the last value of any previous SET call on the same property. In this case when the sum of all the take profit on orders is 100, it exit the session.

A schema of the EA MT4-Progress diagram and the different steps (numbers representing the sequence) is shown below. This is done on each tick of the MT4 Terminal.

 

2016-04-09 02_13_28-START.docx - Microsoft Word