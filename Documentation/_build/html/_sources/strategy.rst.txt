STRATEGY
========



Here is the most important part of the project. In the process of designing a strategy, the model must be very clear in your head. This helps to go fast and without hesitation. That means you should be able to explain it precisely when to buy when to exit and how to buy or sell…. etc
A strategy is something you run on your Platform that has a start point and an end point. The result is a profit which may be positif or negative.  Once a strategy finishes from running the result is not considered when you run it again at another time.

Between the start point and the end point , Orders are performed, and here we must define what type of orders (Buy or Sell) , how and when orders are performed, relations between the orders, etc….

Let’s start with an example . My strategy that I want to create is that one :  It works on Pivot Lines.

If open price of the day is above the pivot point line and the price touches the middle between the pivot line and pivot high,
Here I check if the open price is below the middle  I SELL , if not I BUY.
If open price of the day is below the pivot point line and the price touches the middle between the pivot line and pivot low, here I check if the open price is below the middle  I BUY if not I SELL
I exit whenever price is at alert distance from Pivot point or Pivot High or Pivot Sell.
My Lot Size will be 1. I can do a Maximum of one Buy Order and a one Sell Order. Now as this strategy is designed, we can’t have a at the same tine a buy and a sell order.

Let’s create it.

In the window designer click the right button of the mouse in the strategies section

s1

 

The strategy window appears.

s2

 

Briefly :
On the left side we have the properties of the Strategy.
In the top main we have actions with conditions
In the middle the graphic window where we will create our strategy.
On the top we have

s3

Name is the name of strategy.
Operation can be BUY or SELL or BUYSELL .

BUY or SELL means that our strategy is divided in 2 Engines. One Performs buy orders and the other only Sell orders.
BUYSELL means that our strategy is a one engine that can perform combined Buy/Sell Orders.
In our Example we will choose BUYSELL.
Let’s check the properties window .  I will not explain the fields here but later in the tutorial.
I choose Initial Lot as 1.
Recovery Mode is C that means constant (all lots have the same size)., but here the field has no impact  on our strategy because Max Count is 1 that means I can do only one Buy Order and One Sell Order.
I set Max Count to 1.
Order Type Mono that means orders are not hedged.

The other fields are left as it is as it has no impact on our strategy again because I perform only one order.

s4

Now click on the Editor Tab to start creating it. The figure below shows a kind of Tree Menu that represents the entities we wil drag ans drop in the Main window.

s5

Let’s start .
I put again the text I wrote that describes my strategy.
If open price of the day is above the pivot point line and the price touches the middle between the pivot line, and I check if the open price is below the middle  I SELL , if not I BUY.

I put in Bold the entities that we will drag and drop in the main window.

First I drop If entity from the Statement Menu on the Main Window.
In the Math Menu I drop on If the AND entity.
Again in the Math menu I drop on AND the > entity.

As the open price is a value and the pivot line is a value and we want to compare these entities. We go to Market Input Menu.

s6

SValue returns the value of an object.
We drag and drop on > the SValue

The figure below show the result of our main window.

s7

The Box SValue is Editable this is where I will define my Open Day Value of the Day.
Double Click on it.

s8

A bigger Box Appears showing the Fields Object (which is the indicator) Signal (the signal) the Operator (SValue) and in the down part the Period for the value.

Choose the OPEN  Field in the Objects box.
Choose the CURRENT Field in the Signals box.
Double Click on the D1 Period.

Your window should look like this

s9

Now let’s drag and drop another AndS Entity on > and we fill it in the same way by choosing the object PIVOT_POINT which represents the pivot line.

s10

The Middle between the Pivot High and the Pivot line is returned by the signal MIDDLE for Pivot High, the signal returns true or false. In the Market Logic Menu,  we drog and Drop on AND the AndS Entity

s11

We choose PIVOT_HIGH as Object , the Signal MIDDLE and the operator AndS which returns a Boolean.

Market Input Menu returns values. Market Logic menu returns boolean. The AndS Operator is explained in annexe.

We double click on the period which in our case is D1. Notice in this case we can combine periods for the And operator. In our example we choose only D1.

s12

Let’s  write again our strategy to let you more understand :
If open price of the day is above the pivot point line and the price touches the middle between the pivot line,
I check if the open price is below the middle  I SELL , if not I BUY.

What is underlined is what we have done till now.
Now let’s add the if the open price is below the middle :
I Drag and Drop again the If Entity on the If Node
I Drop the < on the If Entity
I Drop the SValue on the < and I fill the box
Another SValue on the < and I fill the box

The result is :

s13

If open price of the day is above the pivot point line and the price touches the middle between the pivot line, I check if the open price is below the middle  I SELL , if not I BUY.

Now I need to say to SELL in this case , otherwise I Buy
In the Menu Market Actions we have all Actions related to orders.
We Drop the Buy Entity on If Node.

s14

And we finish with the else statement;
Drag and Drop the else Entity from the Statement Menu on If Node

s15

s16

And We Drag and Drop the Sell Entity on Else Node.

s17

If open price of the day is above the pivot point line and the price touches the middle between the pivot line, I check if the open price is below the middle  I SELL , if not I BUY.

First Part of my strategy is created. Press On the Apply Button to save. The second part is the same as the first one except PIVOT_HIGH is replaced by PIVOT_LOW. The result is shown in the figure below.

s18

Let’s do the last part.
I exit whenever price is at alert distance from Pivot point or Pivot High or Pivot Sell.

2 ways of writing it . In condition Section of the tutorial we created the Alert_On_Pivot Condition. Either we choose it or we do it again.

We Drag an If Statement in the Main Window  then In the Menu Conditions Section, we select the Alerts_On_Pivots and we Drop it on If

s19

By double-clicking on the if Statement I graphically close the node. I do it just to let you see la suite.

s20

In this case I Exit. So I go again in Market Action and I drop the Exit Entity on the If Node.

The Final Result is :

s21

We finished. Press On the Apply Button to save.