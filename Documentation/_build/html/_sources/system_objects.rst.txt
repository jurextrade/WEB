SYSTEM OBJECTS
==============
 

A System Object is a logical combination of other objects. Signals that are associated to system objects are BUY, SELL, EXIT_BUY, EXIT_SELL, BULL and BEAR.

Here is an example of how to create a system object. In our previous example we define CUSTOM Objects : FTRIX, STRIX and CORAL. Let’s define our new system object  with the combination of these three objects.The system that we will define here is very simple, suppose we want to have :

2014-10-25 06_55_46-2088819239_ MT4 Provided by MCG - [EURUSD,Daily]	
BUY	SELL	EXIT_BUY	EXIT_SELL
STRIX is Up
FTRIX is Up
Price is above the CORAL trendLine	STRIX is Down
FTRIX is Down
Price is below the CORAL trendLine	FTRIX is Down	FTRIX is Up
To do this we have to create a system object that we will call for instance THV that supports the conditions enumerated above. Here how we do it :

Right-Click on the Node System Objects. A menu appears with New System Object item.  Select the item.

2014-10-25 06_20_14-Designer

An empty system Object window appears. This window contains six Tab windows. Each window corresponds to the configuration of the signal named in the Tab.

2014-10-25 07_08_24-System Object

In the Buy Tab Window, Double-Click on the field Object, a menu appears containing all the objects of the project TestProject.
Let’s select the FTRIX Object.Double-Click on the field Signal, a menu appears containing all the signals associated to the FTRIX Object.
We select the UP Signal.The next fields Not, Op, Type, OpVal and Val are the same as the one described in the Alert Dialog above.Log, Log1 and Log2 represents the logical operators.

Double-Click in the field Log, AND/OR appears sequentially and a new line is displayed.

2014-10-25 14_26_26-Progress Trading Station [MT4 Provided by MCG] Strategy Tester

We set the AND value.
In the second line, we Double-Click again in the Field Object to select the STRIX Object. In the Signal Field we select the UP Value and we Double-Click again in the Log Field to set the AND Value. A new line is Displayed.

2014-10-25 14_32_49-Progress Trading Station [MT4 Provided by MCG] Strategy Tester

In this third line we select the CORAL Object and the ABOVE Signal. Finally we give a name to our Object in the Name Field, let’s call it THV and we press on the Apply Button. The Object THV is created and displayed in the System Objects Tree Node.

2014-10-25 14_39_02-System Object

We still need to fill the Sell, Exit Buy and Exit Sell windows. An easy way to fill the Sell Window is to have a way to generate the opposite of the Buy Logical combination. We press on the Generate Sell Button. We go to the Sell Tab Window and we can see the list has been correctly filled.

2014-10-25 14_58_58-System Object

 

We still need to define the Exit Buy Signal for THV Object. Go to the Exit Buy Window and select FTRIX in the menu of the Object Field and select DOWN in the Signal Field. Our window is in the figure below.

2014-10-25 14_59_38-System Object

By Pressing on the Generate Exit Sell Button, we fill the Tab Window Exit Sell with the opposite declaration. see figure

2014-10-25 15_00_02-System Object

Our THV Object has been completely defined.

We press on the Apply Button to save it.

The Delete Selected Button delete the selected lines in the list of the current Tab Window.

The Code Button opens a window in which we can visualize the code generated. We will explain this later in the document in the Strategy
creation section.

The Reset Button reset the list for the current Tab Window.If we look at the Designer, our project looks like the figure beside.

2014-10-25 15_30_59-Designer

 

Double-Click on the THV Object in the Tree Designer.
Let’s change our BUY Signal, instead of having STRIX UP we want that the fast trix crosses the Slow Trix.
In the System Object Window, Double-Click in the Object Field on STRIX then in the Menu that appears select the FTRIX Object. Double-Click in the Signal Field on UP and we select the RCROSSED Signal.We Press the Generat Sell Button to correctly fill the Sell Window. Finally press the Apply Button to save it.Our THV Object has been modified.
2014-10-25 15_46_44-System Object


The fields Log1, Log2, Log3 represents the logical fields of our combination. We can have three levels.
Log represents the first logical level.
Log1 is the second level and
Log2 the third.

That means that when we choose Log1 as an operator the logical combination will join the next line to form a result.

In the figure here we have STRIX is up AND FTRIX is up OR CORAL is above. The result of the statement here is not clear because the result is true if we only have CORAL above.In this figure the statement means that we have STRIX is up AND (FTRIX is up OR CORAL is above).The result of our statement here is clear. We should have STRIX up and either FTRIX is up or CORAL is above.

2014-10-29 09_13_42-

2014-10-29 09_16_08-

Edit