//+------------------------------------------------------------------+
//|                                                           PG.mqh |
//|                        Copyright 2019, MetaQuotes Software Corp. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2019, MetaQuotes Software Corp."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict
#include <Progress.mqh>
class PG
  {
private:
   int           RuleTab[NBR_OPERATIONS][NBR_FIELDS];
   int           BeforeRuleTab[NBR_OPERATIONS][NBR_FIELDS];
   double        RuleTabValue[NBR_OPERATIONS][NBR_FIELDS][NBR_RULES];
   double        BeforeRuleTabValue[NBR_OPERATIONS][NBR_FIELDS][NBR_RULES];
   int           RuleFilterTab[NBR_OPERATIONS][NBR_FIELDS][NBR_RULES];
   
    
   int           SignalTab[NBR_OBJECTS][NBR_SIGNALS];
   int           BeforeSignalTab[NBR_OBJECTS][NBR_SIGNALS];
   int           BeforeSignalTickTab[NBR_OBJECTS][NBR_SIGNALS];
   
   double        SignalTabValue[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
   double        SignalTabTime[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
   double        SignalTabPrice[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
   
   double        BeforeSignalTabValue[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
   double        BeforeSignalTabTime[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
   double        BeforeSignalTabPrice[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
   
   
   int           SignalFilterTab[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
public:
                     PG();
                    ~PG();
  };
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
PG::PG()
  {
  }
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
PG::~PG()
  {
  }
//+------------------------------------------------------------------+
