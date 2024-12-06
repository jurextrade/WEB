CONDITIONS
==========


A condition is an Expression that returns True or False. Conditions are created once for all in the project and can be used in Strategies to simplify the creation. Conditions are thus made for reusability in all strategies.

To Create a condition Click on the right-Button in Conditions Section in the Designer Window as shown in the figure below

c1

A Empty Condition Window Appears.

c2

Now we are ready to create our condition. Let’s suppose we want a condition that returns true whenever we are close to  either PIVOT_POINT , PIVOT_HIGH or PIVOT_LOW for the period D1.
This means we want an alert signal when Price approaches either one of these levels.

Click on the button OR in Blue .

c3

An OR Node Appears in the window above.

The black rectangles means that Node is selected. Buttons that are enabled in the dialog box tells what operations can be performed on the node.
The Object List Entities are enabled.
Let’s search for the object PIVOT_HIGH in the list and the signal ALERT and we press the button ADD OBJECT.

c4

The picture below shows the Window after we added the object. We do the same for PIVOT_LOW and PIVOT_POINT. We give a name Alert_On_Pivots  to our condition and we Press the Button Apply.

The figure below show us the result

c5

In the Designer we can see the Condition created .

c6

We can create conditions at any time and as many as we want.