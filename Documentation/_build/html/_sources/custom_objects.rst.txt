CUSTOM OBJECTS
============== 

A custom Object represents any Indicator other than the predefined Indicators. One of the main strength of custom indicators is that you can integrate any custom indicator of MT4 that you can find on the net in your expert system without coding , these are the custon objects of type custom,  we will discuss this in the end of this section. In the first part we will explain how to integrate the known indicators like , Bollinger, Macd, Rsi. etc… .

When you Right-Click on the node Custom object, a menu appears with New Object Item.
Let’s select New Object.  A window as shown in the figure below appears, it represents the object to create.
Depending of the Type of the object, properties are displayed.

2014-10-24 10_26_52-Designer

Name is the name you give to your object.
Cross defines the crossing object for which you want a signal to be triggered. In this combo box only objects that are displayed in the same window with the same trendline type are enumerated.The other fields are the same as in MT4.
Let’s create an MACD  Main Mode Object. We will name it M_MACD and we press on the button Apply.
A node appears in the designer under custom objects.

2014-10-24 10_55_42-Object

Now let’s select again New Object by Right-Clicking again on the node Custom Objects, and choose Type MACD to create the MACD with the Mode Signal. You will notice that in the Cross Combo you will have the M_MACD Object that appears.
Set the Cross field to M_MACD and Name the object S_MACD.

By selecting the Cross Object, to M_MACD , this implies that whenever the signal trendline S_MACD crosses the Main M_MACD trendline, the signal RCROSS will be triggered.

Let’s name it S_MACD and we press on the button Apply.

2014-10-24 11_04_39-Object

In the designer Two Nodes appear that represents the two objects. By Double-clicking on the object node the Window display the
corresponding object properties. You can dispatch from an object to another in this way.

2014-10-24 11_19_06-Designer

 

Let’s define the levels of our MACD Object,
Select the Tab Levels Window.The figure beside is the Levels window. In the Levels Window, a list with predefined levels is shown. A value can be defined for every period. These levels represents the reference for some signals of this object.
Level Type represents the type of the level. It can be OverBought/OverSold or Strong/Weak. By defining the Level Type you precise the signals you want to trigger.

2014-10-24 11_16_36-Object

The table below shows the signals that are triggered whenever the value is bigger or lesser than the value given depending on Level Type, For the MEDIUM Level same signals are triggered which, if above the Medium Level, ABOVE Signal is triggered and if below the the Medium Level, BELOW Signal is triggered.

Level Type	OverBought/OverSold	Strong/Weak
UPPER	
EXT_OVERBOUGHT

VERY_STRONG,

UP	
OVERBOUGTH

STRONG

MEDIUM	
ABOVE/BELOW
CROSS_UP/CROSS_DOWN

ABOVE/BELOW
CROSS_UP/CROSS_DOWN

LOW	
OVERSOLD

WEAK

LOWER	
EXT_OVERSOLD

VERY_WEAK


The signals CROSS_UP and CROSS_DOWN mean that trendline is crossing the MEDIUM level up or down.In our example, we don’t precise any level Value for our MACD Objects except for the MEDIUM Level with the 0 value.
Double-Click on the field MEDIUM/M1 and type 0 then check All Same Value as M1 to fill the rest of the line in the list which means 0 level for all periods and press the Apply Button.

We do this for the two objects M_MADD and S_MACD.We keep Level Type to OverBougth/OverSold and we press the Apply Button.

Let’s create now an RSI Object again by selecting New Object in the designer again by a Right-Click on the Custom Objects

Node, in the window we select for Type RSI and we keep the Period value to 14 and finally Name it RSI_14.
Click on Levels Tab Window to fill the levels.

2014-10-24 12_03_42-Object

Double-Click on the UPPER/M1 field and type 100 value.Double-Click on the UP/M1 field and type 70 value.Double-Click on the MEDIUM/M1 field and type 50 value.Double-Click on the LOW/M1 field and type 30 value.Double-Click on the LOWER/M1 field and type 0 value.

As for RSI levels are the same for all periods,we check the All Same Value as M1 to fill the rest of the list as shown in the figure..

2014-10-24 12_31_11-2088819239_ MT4 Provided by MCG - [EURUSD,M1]

2014-10-24 12_03_58-Object

2014-10-24 12_38_57-Designer

In this part of this section, we will create Custom Objects with Custom Type. It is very important to understand the custom type. The purpose of creating Custom Type Objects is to link external indicators which are usually in binary format without having to go in the source code.
In our example we will choose two type of objects. One that displays in the main window (in the Chart Window of your MT4 platform) and the other in a secondary window which is displayed in a separate window like the RSI indicator.
Right-Click again on the Custom Objects in the designer to create a new Custom Object. When the Object Dialog Window appears, choose the Type CUSTOM to display the Parameters properties. The window should appear as in the figure.

2014-10-24 13_03_50-Object

Display Field represents the location of the indicator. It may be in the Main Window or in a Separate Window.

Type Field can be Trendline, Histogram or Bull/Bear.

Browse button to select the external indicator File. Usually you downloaded it and you may already test it so you should know the location of this
file.

Cross Field which is the same as in the other objects. (see MACD example above).In our example we choose an indicator that you may already know the THV Trix.

We suppose in this example that you stored it somewhere on your computer in its binary format .ex4. The appearance of this indicator on the MT4 platform looks like the figure down.

2014-10-24 13_30_27-2088819239_ MT4 Provided by MCG - [EURUSD,M1]

The thick line is called Slow Trix and the thin line Fast Trix.
Click on the Browse Button and select this file from the folder where you store it.
In our example the file is called PG_THV_Trix.ex4, so in Prog Name Field we get the file name without the extension.
As we see the indicator runs in a separate window so we choose Display field as Separate, and as it is a trendline, we choose the Type Field as Trendline.

Now we need to tell the system which and how values are set. Usually custom indicators are documented with an explanation for the different values.

In MT4 custom indicators we can have a maximum of 8 values.

Let’s suppose we don’t have the corresponding values, so let’s see how we can find out the corresponding values for this indicator.

In the MT4 platform Right-Click on the line of PG_THV_Trix indicator to get its properties.

2014-10-24 20_31_08-2088819239_ MT4 Provided by MCG - [EURUSD,M1]

The window indicator properties appears.
We select the Colors Tab.
You can see that the value 0 and 1 corresponds to the thick trendline which is the Slow trix.

2014-10-24 20_36_01-Custom Indicator - PG_THV_Trix

The value 0 with the Green color corresponds to the up values of this trend line and the value 1 with the Crimson color corresponds to the down values.

The value 2 and 3 correspond to the Up and Down Value for the Fast Trix trend line.

Now let’s fill the values of our window object.
Double-Click in the Value Field of the 0 line and select in the menu the Up Value item, then in the 1 index line, select the Down Value item.

2014-10-24 13_18_12-Object

Finally let’s call this object STRIX and press the Apply Button.

The Object STRIX is created and corresponds to Slow Trix.

2014-10-24 20_40_04-Object

Now let’s create a New Object again by Right-Clicking on the Custom Objects Node in the designer window. We do exactly the same steps as in the STRIX Object except that the field values are set to Up Value for the index 2 and Down Value for the
index 3 and in the Cross Field we select the object STRIX to have the signal RCROSSED triggered which means that the Fast Trix is crossing the Slow Trix.
Finally we name it FTRIX and we press the Apply Button.

2014-10-24 21_14_50-Object

Our designer tree should look like this.

2014-10-24 21_25_58-Designer

In the next example we choose an external indicator that is displayed in the Main window.
From the THV System we have the Coral indicator that is delivered in an .ex4 file. The appearance of this indicator is shown in the figure below.

2014-10-24 21_46_09-2088819239_ MT4 Provided by MCG - [EURUSD,M1]

Red Line means we have a down trend, Green line represents an up trend and the yellow line a sideway trend.

Again to guess the values for this indicator we display its properties and then we select the Colors Tab Window. As you can see the sideway trend corresponds to the index 0, the up trend to the index 1 and the down trend to the index 2.

2014-10-24 21_45_50-Custom Indicator - PG_THV_Coral

Now let’s create the object CORAL.
Display Field is set to Main that means the main window,
Type is set to TrendLine. Now we fill the corresponding value fields with the appropriate Values.

Press on the Apply Button to valid this new Object.

In Cross Menu we have all objects of type Trendline that are displayed in the Main Window like MA (Moving average) Type. In our case we didn’t define any as this is the first one so the Menu is empty.

2014-10-24 21_41_38-Object

 