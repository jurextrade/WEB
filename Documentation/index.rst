.. MT4-Progress documentation master file, created by
   sphinx-quickstart on Wed May 13 14:57:54 2020.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to MT4-Progress's Documentation!
========================================

.. toctree::
   :maxdepth: 2
   :caption: 
   
   introduction
   installation
   getting_started
   alerts
   panel
   project
   designer
   custom_objects
   system_objects
   conditions
   strategy
   example_1
   example_2
   reference
   architecture
   pl_language
   trade_functions
   math_functions
   market_logics
   market_input
   session_fields
   market_constants
   data_types
   recovery_types
   discussion_strategy
   how_to_start
   design



Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`


"""""""""""""""""
Document Title
"""""""""""""""""
...........
Subtitle
...........

.. contents:: Overview
   :depth: 3

===================
Section 1
===================

Text can be *italicized* or **bolded**  as well as ``monospaced``.
You can \*escape certain\* special characters.

----------------------
Subsection 1 (Level 2)
----------------------

Some section 2 text

Sub-subsection 1 (level 3)
--------------------------

Some more text.

=========
Examples
=========

--------
Comments
--------

.. This is a comment
   Special notes that are not shown but might come out as HTML comments

------
Images
------

Add an image with:

.. image:: screenshots/file.png
   :height: 100
   :width: 200
   :alt: alternate text

You can inline an image or other directive with the |customsub| command.

.. |customsub| image:: image/image.png
              :alt: (missing image text)

-----
Lists
-----

- Bullet are made like this
- Point levels must be consistent
    * Sub-bullets
        + Sub-sub-bullets
- Lists

Term
    Definition for term
Term2
    Definition for term 2

:List of Things:
    item1 - these are 'field lists' not bulleted lists
    item2
    item 3

:Something: single item
:Someitem: single item

-----------------
Preformatted text
-----------------

A code example prefix must always end with double colon like it's presenting something::

    Anything indented is part of the preformatted block
   Until
  It gets back to
 Allll the way left

Now we're out of the preformatted block.

------------
Code blocks
------------

There are three equivalents: ``code``, ``sourcecode``, and ``code-block``.

.. code:: python

   (Close_Sell)

   By calling this function all sell orders are instantly closed. No checking of the Sell Minimum profit. We can still sell orders in the session by calling the function SELL.



.. sourcecode::

  # Equivalent

.. code-block::

  # Equivalent

-----
Links
-----

Web addresses by themselves will auto link, like this: https://www.devdungeon.com

You can also inline custom links: `Google search engine <https://www.google.com>`_

This is a simple link_ to Google with the link defined separately.

.. _link: https://www.google.com

This is a link to the `Python website`_.

.. _Python website: http://www.python.org/

This is a link back to `Section 1`_. You can link based off of the heading name
within a document.

---------
Footnotes
---------

Footnote Reference [1]_

.. [1] This is footnote number one that would go at the bottom of the document.

Or autonumbered [#]

.. [#] This automatically becomes second, based on the 1 already existing.

-----------------
Lines/Transitions
-----------------

Any 4+ repeated characters with blank lines surrounding it becomes an hr line, like this.

====================================

------
Tables
------

+--------+--------+--------+
| Time   | Number | Value  |
+========+========+========+
| 12:00  | 42     | 2      |
+--------+--------+--------+
| 23:00  | 23     | 4      |
+--------+--------+--------+

----------------------
Preserving line breaks
----------------------

Normally you can break the line in the middle of a paragraph and it will
ignore the newline. If you want to preserve the newlines, use the ``|`` prefix
on the lines. For example:

| These lines will
| break exactly
| where we told them to.

- :ref:`Tutorial`
- :ref:`Introduction`
- :ref:`Installation`
- :ref:`Getting Started`
	* :ref:`Create a Project`
	* :ref:`Associate a Project to MT4`
	* :ref:`Set the Current Platform`
- :ref:`Alerts`
- :ref:`Panel`
- :ref:`Project`
	* :ref:`Designer`
	* :ref:`Custom Objects`
	* :ref:`System Objects`
	* :ref:`conditions`
	* :ref:`Strategies`
		+ :ref:`Examples`
		+ :ref:`PIVOT � Cross Line`
		+ :ref:`ANGLE � EMA 34`
- :ref:`Reference`
- :ref:`Architecture`
- :ref:`PL Language`
- :ref:`Trade Functions`
- :ref:`Math Functions`
- :ref:`Market Logics`
- :ref:`Market Input`
- :ref:`Session Fields`
- :ref:`Market Constants`
- :ref:`Data Types`
- :ref:`Recovery Types`