//+------------------------------------------------------------------+
//|                                                PG_EntryRules.mq4 |
//|                        Copyright 2014, MetaQuotes Software Corp. |
//|                                        http://www.metaquotes.net |
//+------------------------------------------------------------------+
#property copyright "Copyright 2012, MetaQuotes Software Corp."
#property link      "http://www.metaquotes.net"
/*
#import "PG_EntryRules.dll"
void     MT4_SetSystemObjects (double ask, double bid, double timecurrent, int currentperiod, int& symbol[], double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][], 
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],            double& b_ruletabvalue[][][]); 
void     MT4_SetEntryRules (double ask, double bid, double timecurrent,  int currentperiod, int& symbol[],double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][],  
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],             double& b_ruletabvalue[][][]); 



#import "PG_TEntryRules.dll"
void     MT4_TSetSystemObjects (double ask, double bid, double timecurrent, int currentperiod, int& symbol[], double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][], 
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],            double& b_ruletabvalue[][][]); 
void     MT4_TSetEntryRules (double ask, double bid,     double timecurrent, int currentperiod, int& symbol[],double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][],  
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],             double& b_ruletabvalue[][][]); 

#import
*/

#import "PG_ExtFunctions.dll"
typedef void(*TMT4_SetSystemObjects)(double ask, double bid, double timecurrent, int currentperiod, int& symbol[], double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][], 
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],            double& b_ruletabvalue[][][]);
                                 
                                 
typedef void(*TMT4_SetEntryRules) (double ask, double bid, double timecurrent,  int currentperiod, int& symbol[],double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][],  
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],             double& b_ruletabvalue[][][]); 



typedef void(*TMT4_TSetSystemObjects) (double ask, double bid, double timecurrent, int currentperiod, int& symbol[], double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][], 
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],            double& b_ruletabvalue[][][]); 
typedef void(*TMT4_TSetEntryRules) (double ask, double bid,     double timecurrent, int currentperiod, int& symbol[],double point, double digits, 
                                 int& signaltab[][],      double& signaltabvalue[][][],   double& SignalTabTime[][][],   double& SignalTabPrice[][][],  
                                 int& b_signaltab[][],    double& b_signaltabvalue[][][], double& b_SignalTabTime[][][], double& b_SignalTabPrice[][][],  
                                 int& b_signalticktab[][],int& ruletab[][],               double& ruletabvalue[][][],      int& b_ruletab[][],             double& b_ruletabvalue[][][]);  
                                 
TMT4_TSetSystemObjects MT4_TSetSystemObjects;
TMT4_SetSystemObjects MT4_SetSystemObjects;                                                               

TMT4_SetEntryRules MT4_SetEntryRules;
TMT4_TSetEntryRules MT4_TSetEntryRules; 

 
