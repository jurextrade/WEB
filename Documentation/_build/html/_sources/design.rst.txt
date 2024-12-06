DESIGN
======

Step 5 : Indicators
In the example, four indicators are defined which are : EMA (moving average 34 exponential), RSI (relative strength index 20) and an external indicator which is TRIX that is a combination of 2 trend lines Fast trix and Slow Trix. TRIX is a custom indicator and in the video it shows how to integrate this indicator from an external executable file and work with it. All custom indicators can be integrated in this way.


Step 6 : System Objects
System Objects let you define Indicators with signals : Buy, Sell, Exit_Buy, Exit_Sell, Bull, Bear. Thus you are able to catch these signals for your model system. In the example I define a System Object which I called MySystem which gives me a Buy Signal when RSI_20 (that was defined in Indicators Section) is above the Middle Level and when the Moving Average EMA_34 (that was defined also in Indicators Section) has an angle greater than 15 and the price is above it.


Step 7 : Conditions
Conditions are boolean expressions that works on Objects as well as on strategies parameters.The purpose of creation of Conditions is for reusability when creating strategies. (You don’t have to create it in every strategy), for instance Number of Buy Trades or a bar is engulfing etc…. You can skip this section for the moment as it is not crucial to build your strategy at the beginning.


Step 8 : Buid your Strategies 1
Creation of a Strategy using the System Object MySystem explained in the previous section.A simple strategy that is scheduled to be launched once a day. Stop Loss of 20 for orders and a Trailing Stop of 10. It Exit when profit is greater or equal to 100 for an initial Lot of 1. In the next section we explain in depth how it works.