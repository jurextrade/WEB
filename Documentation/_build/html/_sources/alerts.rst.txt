ALERTS
======


Alerts are defined by clicking on the Alerts Menu.

Alerts allows to trigger a signal when a pattern occurs for the current currency. Every currency has a its  list of alerts.
On each alert we can associate a sound, a mail, an MT4 window alert or a graphic symbol on the window chart of that currency.
When you choose the object, the signal and the period the button Add is enabled. By clicking on Add Button it you add the line corresponding to your alert.

In our example we add the two alerts related to the BAR Object. A BAR is BULL whenever the close price is above the Open value of the bar, and BEAR in the opposite case. Here we take a simple example on the predefined object BAR.  In our case we defined two alerts. One alert whenever we have a Bull value for the period D1 and the other one whenever we have a Bear Value for the period D1.

2014-10-22 21_54_25-Progress Trading Station [MT4 Provided by MCG] Strategy Tester

Once the line is added you can modify it by double-clicking on every field.

By double-clicking on the Object Field a menu appears with all objects created in the current project. In ou example as we didn’t create objects yet we can see only the predefined objects.

By double clicking on the Signal Field we have a signal menu that shows the associated signals of the object.

The fields Not, Prev, Type and Op are very important to understand once for all.  Here is an explanation.
Let’s try to understand the BAR BULL D1 alert. (first line)

 

Not : When X is displayed it means Not signal (the opposite). In our case the BAR is not BULL.	2014-10-23 17_43_24-Alerts	2014-10-23 17_45_08-2088819239_ MT4 Provided by MCG - [EURUSD,M1 (visual)]
Prev : When X is displayed it means that the signal is valid for the previous bar for the corresponding periods. In our case the previous bar is BULL for the period D1.	2014-10-23 17_44_47-Alerts	2014-10-23 17_43_46-2088819239_ MT4 Provided by MCG - [EURUSD,M1 (visual)]
Type : It can be T, B or nothing.  This field is activated only for the current signal. If Prev is activated the T or B Type are desactivated.
T Type means that the alert is triggered when the signal is valid on a tick while the previous tick was not. This assure an alert only on the start of the signal. In our example that means that we receive an alert when BAR becomes BULL on the first tick while it was BEAR.
 

2014-10-23 17_28_03-Alerts	2014-10-23 17_34_16-2088819239_ MT4 Provided by MCG - [EURUSD,M1 (visual)]
B Type means that the alert is triggered during the current bar while its preceding BAR the signal was not valid. In our example this means that we receive alerts on the current BULL BAR while the bar just before was BEAR.	2014-10-23 17_29_15-Alerts	2014-10-23 17_26_10-2088819239_ MT4 Provided by MCG - [EURUSD,M1 (visual)]
Empty Type means we receive alerts all the time (on every tick) a BAR is BULL. Not to have a large quantity of sound signals a 20 seconds interval between alerts.	2014-10-23 17_35_30-Alerts	2014-10-23 17_35_51-2088819239_ MT4 Provided by MCG - [EURUSD,M1 (visual)]
 

Op : The Op Field represents the logical operator of the periods M1, M5,…. The value is And or Or. (see explanation on periods fields below)

VOp: Some signals like CURRENT, PREVIOUS, DISTANCE, NBR_BARS returns a value. The VOp represents the operator that is used for the Value to check. VOp can be >,<,=,>=,<=.

Value : The value of the signal to check.

The periods fields (M1, M5, M15, M30, H1, H4, D1, W1, MN) can be combined by selecting/deselecting. The Or/And is represented in the Op Field.

By double clicking on the periods fields you have the period displayed When it is displayed it means the period is defined for the alert.

Periods can be combined with Or Operator or And Operator depending of the value of Op field. In our example Op Field is Or, so we receive alerts whenever we have the BAR BULL for the period D1 or H1. If the Op field was And, we receive an alert when we have a BULL BAR for the periods D1 and H1.
Let’s associate the signal CROSS_UP for the period D1. This means the bar is crossing the well known Daily Pivot Line. Here what we have :

2014-10-22 21_54_46-Alerts 2014-10-22 21_55_07-Alerts

 

For the moment no signals are triggered as we didn’t associate the type of signal for these alerts.

For every Alert you can define the signals you want to trigger by clicking on the Property Button . A window on the right side is expanded as you see below.

 

 

SIGNAL TYPE SELECTION
The property window is a four tabs window. The first Tab Activate indicates what kind of signal we want to associate for the alert. By double-clicking on the field we activate/desactivate the signal by On/Off. Let’s start by activating the Graphic Signal for our three alerts. For every row we have three tabs : Sound that determines the sound of the alert. MT4 where you indicate the graphic and the alert text for your signal and a Mail window.
2014-10-22 21_55_28-2014-10-22 21_57_24-Alerts

GRAPHIC
2014-10-22 21_55_47- 2014-10-22 21_56_26-Alerts

 

MAIL
 

2014-10-22 21_56_44-Alerts

 

SOUND