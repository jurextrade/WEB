#ifndef  __CPROGRESS_H__
#define  __CPROGRESS_H__

#include <stdlib.h>
#include <iostream>
#include <string.h>
#include <stdio.h>
#include <math.h>
#include <time.h>


#define	MT4_EXPFUNC			__declspec(dllexport)
#define datetime			double

#define	EMPTY_VALUE			2147483647 
#ifndef Max
#define Max(a,b)			(((a) > (b)) ? (a) : (b))
#endif

#ifndef Min
#define Min(a,b)			(((a) < (b)) ? (a) : (b))
#endif


#define SYSTEM(X) SetSystemObjects (int x, double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, \
									  int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, \
									  int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,\
									  int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue)
  

#define R_RULE(x)	R_ ## x ## _RULE (double Ask, double Bid, datetime TimeCurrent, int CurrentPeriod, std::string Symbol, double Point, double Digits, \
									  int* SignalTab, double* SignalTabValue, datetime*	SignalTabTime, double* SignalTabPrice, \
									  int* BeforeSignalTab, double* BeforeSignalTabValue, datetime* BeforeSignalTabTime, double* BeforeSignalTabPrice,\
									  int* BeforeSignalTickTab, int* RuleTab, double* RuleTabValue, int* BeforeRuleTab, double* BeforeRuleTabValue)
 
#define       _RuleTab(operation, operationtype)   (*(RuleTab + (operation * NBR_FIELDS) + operationtype))
#define       _BeforeRuleTab(operation, operationtype)   (*(BeforeRuleTab + (operation * NBR_FIELDS) + operationtype))
#define       _RuleTabValue(operation, operationtype, rule)  (*(RuleTabValue + (operation * NBR_FIELDS * NBR_RULES) + (operationtype * NBR_RULES) + rule))
#define       _BeforeRuleTabValue(operation, operationtype, rule)  (*(BeforeRuleTabValue + (operation * NBR_FIELDS * NBR_RULES) + (operationtype * NBR_RULES) + rule))

#define       _RuleFilterTab(operation, operationtype, rule)  (*(RuleFilterTab + (operation * NBR_FIELDS * NBR_RULES) + (operationtype * NBR_RULES) + rule))





#define		_SignalTab(object, signal)              (*(SignalTab + (object * NBR_SIGNALS) + signal))
#define		_BeforeSignalTab(object, signal)        (*(BeforeSignalTab + (object * NBR_SIGNALS) + signal))
#define		_BeforeSignalTickTab(object, signal)     (*(BeforeSignalTickTab + (object * NBR_SIGNALS) + signal))

#define		_SignalTabValue(object, signal, period)  (*(SignalTabValue + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))
#define		_SignalTabTime(object, signal, period)   (*(SignalTabTime + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))
#define		_SignalTabPrice(object, signal, period)  (*(SignalTabPrice + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))

#define		_BeforeSignalTabValue(object, signal, period)  (*(BeforeSignalTabValue + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))
#define		_BeforeSignalTabTime(object, signal, period)   (*(BeforeSignalTabTime + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))
#define		_BeforeSignalTabPrice(object, signal, period)   (*(BeforeSignalTabPrice + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))

#define		_SignalFilterTab(object, signal, period)   (*(SignalFilterTab + (object * NBR_SIGNALS * NBR_PERIODS) + (signal * NBR_PERIODS) + period))

//=============================================SIGNALS==========================================

#define       P_NOSIGNAL         0  
#define       P_SIGNAL           1

#define       NBR_PERIODS        9
#define       NBR_OBJECTS        100 
#define       NBR_SIGNALS        68


#define       P_M1               0   
#define       P_M5               1
#define       P_M15              2
#define       P_M30              3
#define       P_H1               4
#define       P_H4               5
#define       P_D1               6
#define       P_W1               7
#define       P_MN               8

#define       UPFRACTAL          0
#define       DOWNFRACTAL        1
#define       SUPPORT            2
#define       RESISTANCE         3
#define       PIVOT_RESISTANCE2  4
#define       PIVOT_RESISTANCE1  5
#define       PIVOT_RESISTANCE   6
#define       PIVOT_HIGH         7
#define       PIVOT_POINT        8
#define       PIVOT_LOW          9
#define       PIVOT_SUPPORT      10
#define       PIVOT_SUPPORT1     11
#define       PIVOT_SUPPORT2     12



#define       HEIKEN_ASHI        13
#define       OPEN               14
#define       CLOSE              15
#define       HIGH               16
#define       LOW                17
#define       FIBOLEVEL          18
#define       FIBOSTOPLOSSLEVEL  19
#define       BAR                20
#define       NEWS               21

#define       VOLUME             22
#define       VOLUME_UP          23
#define       VOLUME_DOWN        24
#define       PROGRESS           25

#define       S_UP               0       // indicator down
#define       S_DOWN             1       // indicator up
#define       S_SIDEWAY          2      // indicator is sideway (cloud, angle argsgoes with UP DOWN) 

#define       S_ABOVE            3       // point above
#define       S_BELOW            4       // point below
#define       S_TOUCHED          5       // point touched                                     
#define       S_ALERT            6       // approaching    
#define       S_CROSS_UP         7       // point cross
#define       S_CROSS_DOWN       8       // point cross down
#define       S_REVERSE_UP       9       // point reversing or indicator changing 
#define       S_REVERSE_DOWN     10       // point reversing 
#define       S_MIDDLE           11      // point in middle (resistance support) 
#define       S_CHANGED          12      // indicators changed up-> down  // resistance changed
#define       S_TARGET           13      // Direction when crossed for Pivot 
#define       S_DISTANCE         14      // distance point indicator
#define       S_CURRENT          15      // current value
#define       S_PREVIOUS         16      // previous value
#define       S_BULL             17      // indicator is bull
#define       S_BEAR             18      // indicator is bear

#define       S_RANGE            19      // indicator is in range between levels 
#define       S_OVERBOUGHT       20      // indicator overbougth
#define       S_OVERSOLD         21
#define       S_EXT_OVERBOUGHT   22      // indicator overbougth
#define       S_EXT_OVERSOLD     23

#define       S_VERYWEAK         24      // market
#define       S_WEAK             25
#define       S_NEUTRAL          26
#define       S_STRONG           27
#define       S_VERYSTRONG       28

#define       S_ANGLE            29      // angle of indicator
#define       S_PANGLE           30      // previous angle shift 6
#define       S_NBRBARS          31
#define       S_RCROSSED         32      // indicators crossed   // resistance support are crossing
#define       S_BUY              33      // buy signal
#define       S_SELL             34      // sell signal
#define       S_EXIT_BUY         35
#define       S_EXIT_SELL        36


//CANDLESTICK  SIGNALS ON OBJECT BAR

#define       S_DOJI                      37

#define       S_BULL_PTECZ                38      // Consolidation
#define       S_BULL_HAMMER               39
#define       S_BULL_HAMMER1              40
#define       S_BULL_HAMMER2              41
#define       S_BULL_ENGULFING            42
#define       S_BULL_HARAMI               43
#define       S_BULL_INVERTED_HAMMER      44
#define       S_BULL_INVERTED_HAMMER1     45
#define       S_BULL_INVERTED_HAMMER2     46
#define       S_BULL_PIERCING_LINE        47
#define       S_BULL_MORNING_STAR         48
#define       S_BULL_MORNING_DOJI_STAR    49
#define       S_BULL_THREE_WHITE_SOLDIERS 50
#define       S_BULL_THREE_INSIDE_UP      51
#define       S_BULL_THREE_OUTSIDE_UP     52
#define       S_BEAR_PTECZ                53    // Consolidation
#define       S_BEAR_HANGING_MAN          54
#define       S_BEAR_HANGING_MAN1         55
#define       S_BEAR_HANGING_MAN2         56
#define       S_BEAR_ENGULFING            57
#define       S_BEAR_HARAMI               58
#define       S_BEAR_SHOOTING_STAR        59
#define       S_BEAR_SHOOTING_STAR1       60
#define       S_BEAR_SHOOTING_STAR2       61
#define       S_BEAR_DARK_CLOUD_COVER     62
#define       S_BEAR_EVENING_STAR         63
#define       S_BEAR_EVENING_DOJI_STAR    64
#define       S_BEAR_THREE_BLACK_CROWS    65
#define       S_BEAR_THREE_INSIDE_DOWN    66
#define       S_BEAR_THREE_OUTSIDE_DOWN   67

#define       P_M1               0   
#define       P_M5               1
#define       P_M15              2
#define       P_M30              3
#define       P_H1               4
#define       P_H4               5
#define       P_D1               6
#define       P_W1               7
#define       P_MN               8


#define       PERIOD_M1 1      //1 minute. 
#define       PERIOD_M5 5      //5 minutes. 
#define       PERIOD_M15 15    //15 minutes. 
#define       PERIOD_M30 30    //30 minutes. 
#define       PERIOD_H1 60     //1 hour. 
#define       PERIOD_H4 240    //4 hour. 
#define       PERIOD_D1 1440   //Daily. 
#define       PERIOD_W1 10080  //Weekly. 
#define       PERIOD_MN1 43200 //Monthly. 


#define       NBR_RULES            25
#define       NBR_OPERATIONS       14
#define       NBR_FIELDS           82

#define       R_A                  0
#define       R_B                  1
#define       R_C                  2
#define       R_D                  3
#define       R_E                  4
#define       R_F                  5
#define       R_G                  6
#define       R_H                  7
#define       R_I                  8
#define       R_J                  9
#define       R_K                  10
#define       R_L                  11
#define       R_M                  12
#define       R_N                  13
#define       R_O                  14
#define       R_P                  15
#define       R_Q                  16
#define       R_R                  17                        
#define       R_S                  18                        
#define       R_T                  19                        
#define       R_U                  20                      
#define       R_V                  21                        
#define       R_W                  22                       
#define       R_X                  23                       
#define       R_Y                  24                        
#define       R_Z                  25                        // manual rule

// OP_BUY OP_SELL (defined in mt4)
#define       OP_BUY	           0
#define       OP_SELL              1
#define       OP_BUYSELL           2
#define       OP_EXIT_BUY          3
#define       OP_EXIT_SELL         4
#define       OP_EXIT              5
#define       OP_HEDGE_BUY         6
#define       OP_HEDGE_SELL        7
#define       OP_CLOSE_HEDGE_BUY   8
#define       OP_CLOSE_HEDGE_SELL  9
#define       OP_CLOSE_HEDGE       10

#define       OP_CLOSE_BUY         11
#define       OP_CLOSE_SELL        12
#define       OP_CLOSE			   13

#define       OP_WAIT              14
#define       OP_HOLD              15
#define       OP_SUSPEND           16


#define       D_BACKWARD           0
#define       D_FORWARD            1
#define       D_ANY                2


#define       DT_MINMAX            0
#define       DT_LEVEL             1


#define       EM_EXITBUYFIRST      0
#define       EM_EXITSELLFIRST     1
#define       EM_EXITANY           2

#define       OT_MONO              0
#define       OT_HEDGE             1
// IN attributes
#define       T_OPERATION          0
#define       T_START              1   
#define       T_STATUS             2    // OP_EXIT OP_EXIT_SELL OP_EXIT_BUY ATTRIBUTES 
#define       T_RULE               3    // rule to buysell on may be not the same that start
#define       T_KEEPBUYSELL        4    // rule to buysell on may be not the same that start
#define       T_SUSPEND            5
#define       T_MINPROFIT          6    
#define       T_EXITMODE           7    // OP_BUYSELL  ATTRIBUTES
#define       T_PIPSTEP            8   
#define       T_TIMESTEP           9
#define       T_ORDERTYPE          10   //OP_BUYSELL Attr 
#define       T_DIRECTION          11
#define       T_DIRECTIONTYPE      12
#define       T_RECOVERYMODE       13   // recovery numbers
#define       T_RECOVERYVALUE      14
#define       T_ILOT               15 
#define       T_BUYLOT             16 
#define       T_SELLLOT            17 
#define       T_MAXLOT             18
#define       T_MAXLOSS            19
#define       T_MAXTIME            20
#define       T_MAXCOUNT           21   // IN OUT PARAMETER !!! engine can adjust args 
#define       T_HEDGEMAGNITUDE     22

#define       T_BUYLOTSL           23   
#define       T_BUYLOTTP           24
#define       T_BUYLOTTS           25
#define       T_SELLLOTSL          26   
#define       T_SELLLOTTP          27
#define       T_SELLLOTTS          28

#define       T_SL                 29   
#define       T_TP                 30
#define       T_TS                 31

#define       T_BUYSL              32   
#define       T_BUYTP              33
#define       T_BUYTS              34

#define       T_SELLSL             35 
#define       T_SELLTP             36
#define       T_SELLTS             37




// OUT attributes
#define       T_HMAX               38
#define       T_HMIN               39
#define       T_MAX                40
#define       T_MIN                41
#define       T_EXITBUY            42
#define       T_EXITSELL           43
#define       T_CLOSEBUY           44
#define       T_CLOSESELL          45
#define       T_PROFITBUY          46
#define       T_PROFITSELL         47
#define       T_PROFIT             48
#define       T_LASTLOT            49
#define       T_LASTBUYLOT         50
#define       T_LASTSELLLOT        51

#define       T_STARTTRADE         52
#define       T_NEUTRALPOINT       53
#define       T_BUYAVERAGEPOINT    54
#define       T_SELLAVERAGEPOINT   55

#define       T_HEDGELLINE         56
#define       T_HEDGENBRLOTS       57
#define       T_BUYHEDGENBRLOTS    58
#define       T_SELLHEDGENBRLOTS   59

#define       T_HEDGETYPE          60
#define       T_HEDGED             61
#define       T_HASBEENHEDGED      62
#define       T_HEDGEPROFIT        63

#define       T_HEDGEBUYPROFIT     64
#define       T_HEDGESELLPROFIT    65

#define       T_BUYNBRTRADE        66
#define       T_SELLNBRTRADE       67
#define       T_BUYNBRLOTS         68
#define       T_SELLNBRLOTS        69

#define       T_LASTORDEROPENTIME  70    // 
#define       T_LASTORDERCLOSETIME  71    // 

#define       T_LASTORDEROPENPRICE	72
#define       T_LASTORDERCLOSEPRICE 73

#define       T_LASTORDERCLOSEPROFIT    74    // order in history only ==> closed
#define       T_LASTORDERCLOSETYPE      75    // order in history only ==> closed

#define       T_FIRSTORDEROPENTIME      76   // 
#define       T_FIRSTORDERCLOSETIME      77   // 
#define       T_FIRSTORDEROPENPRICE      78   // 
#define       T_FIRSTORDERCLOSEPRICE   79


#define       T_LEVELPOINT          80
#define       T_LASTORDERTYPE      81  // 



#define       M_F     0
#define       M_D     1
#define       M_H     2
#define       M_S     3
#define       M_I     4
#define       M_M     5
#define       M_N     6
#define       M_J     7
#define       M_C     8
#define       M_O     9
#define       M_P     10
#define       M_Q     11
#define       M_A     12
#define       M_L     13
#define       M_K     14

/////////////////////////////////////////////////////////////////////////////////////////////////
#define AndR(...) iAndR (RuleTab,  ##__VA_ARGS__)
#define OrR(...) iOrR (RuleTab,  ##__VA_ARGS__)
#define AndCR(...) iAndCR (RuleTab,  ##__VA_ARGS__)
#define OrCR(...) iOrCR (RuleTab,  ##__VA_ARGS__)
#define Set_Rule(...) iSet_Rule (RuleTab, RuleTabValue,  ##__VA_ARGS__)
#define Get_Rule(...) iGet_Rule (RuleTab,  ##__VA_ARGS__)

#define Set_Rule_Value(...) iSet_Rule_Value (RuleTabValue,  ##__VA_ARGS__)
#define Get_Previous_Rule(...) iGet_Previous_Rule (BeforeRuleTab,  ##__VA_ARGS__)
#define RValue(...) iRValue (RuleTabValue,  ##__VA_ARGS__)

extern bool iAndR (int* RuleTab, int Operation, int OperationType, int rule, int rule1= -1, int rule2 = -1, int rule3 = -1, int rule4 = -1, int rule5 = -1);
extern bool iOrR (int* RuleTab, int Operation, int OperationType, int rule, int rule1= -1, int rule2 = -1, int rule3 = -1, int rule4 = -1, int rule5 = -1);
extern bool iAndCR (int* RuleTab, int Operation, int OperationType, int rule);
extern bool iOrCR (int* RuleTab, int Operation, int OperationType, int rule);
extern void iSet_Rule (int* RuleTab, double* RuleTabValue,  int Operation, int OperationType, int rule, int signal, double value = -1);
extern int iGet_Rule (int* RuleTab, int Operation, int OperationType, int rule);

extern void iSet_Rule_Value (double* RuleTabValue, int Operation, int OperationType, int rule, double Value);
extern int iGet_Previous_Rule (int* BeforeRuleTab, int Operation, int OperationType, int rule);
extern double iRValue (double* RuleTabValue, int Operation, int OperationType, int rule);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

#define AndS(...) iAndS (SignalTab, ##__VA_ARGS__)  
#define AndPS(...) iAndPS (BeforeSignalTab, ##__VA_ARGS__)  
#define AndPTS(...) iAndPTS (BeforeSignalTickTab, ##__VA_ARGS__)  
#define OrS(...) iOrS (SignalTab, ##__VA_ARGS__)  
#define OrPS(...) iOrPS (BeforeSignalTab, ##__VA_ARGS__)  
#define OrPTS(...) iOrPTS (BeforeSignalTickTab, ##__VA_ARGS__)  
#define AndBS(...) iAndBS (SignalTab, BeforeSignalTab, ##__VA_ARGS__)  
#define AndTS(...) iAndTS (SignalTab, BeforeSignalTickTab, ##__VA_ARGS__) 
#define OrTS(...) iOrTS (SignalTab, BeforeSignalTickTab, ##__VA_ARGS__)  
#define OrBS(...) iOrBS (SignalTab, BeforeSignalTab, ##__VA_ARGS__)  
#define All(...) iAll (SignalTab, ##__VA_ARGS__)  
#define All_s(...) iAll_s (SignalTab, ##__VA_ARGS__)  

#define Get_Signal(...) iGet_Signal (SignalTab,##__VA_ARGS__)  
#define Get_Previous_Signal(...) iGet_Previous_Signal (BeforeSignalTab,##__VA_ARGS__)  
#define SValue(...) iSValue (SignalTabValue,##__VA_ARGS__)  
#define SPValue(...) iSPValue (BeforeSignalTabValue,##__VA_ARGS__)  
#define STime(...) iSTime (SignalTabTime,##__VA_ARGS__)  
#define SPTime(...) iSPTime (BeforeSignalTabTime,##__VA_ARGS__)  
#define SPrice(...) iSPrice (SignalTabPrice,##__VA_ARGS__)  
#define SPPrice(...) iSPPrice (BeforeSignalTabPrice,##__VA_ARGS__)  

#define Set_Signal_Value(...) iSet_Signal_Value (SignalTabValue,##__VA_ARGS__)  
#define Set_Signal_Time(...) iSet_Signal_Time (SignalTabTime,##__VA_ARGS__)  
#define Set_Signal_Price(...) iSet_Signal_Price (SignalTabPrice,##__VA_ARGS__)  
#define Set_Previous_Signal_Value(...) iSet_Previous_Signal_Value (BeforeSignalTabValue,##__VA_ARGS__)  

#define Set_Signal(...) iSet_Signal (SignalTab, BeforeSignalTickTab, SignalTabValue, SignalTabTime, SignalTabPrice, TimeCurrent, Bid, ##__VA_ARGS__)  
#define Set_Previous_Signal(...) iSet_Previous_Signal (BeforeSignalTab, BeforeSignalTabValue,##__VA_ARGS__)  




extern int iAndS (int* SignalTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	
extern int iAndPS (int* BeforeSignalTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	
extern int iAndPTS (int* BeforeSignalTickTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	

extern int iOrS (int* SignalTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	
extern int iOrPS (int* BeforeSignalTab, int Object, int SignalType, int period,  int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	
extern int iOrPTS (int* BeforeSignalTickTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	

extern int iAndTS (int* SignalTab, int* BeforeSignalTickTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern int iAndBS (int* SignalTab, int* BeforeSignalTab, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

extern int iOrTS (int* SignalTab, int* BeforeSignalTickTab,int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern int iOrBS (int* SignalTab, int* BeforeSignalTab,int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);


extern int	iAll (int* SignalTab, int Object, int SignalType, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1);
extern int	iAll_s (int* SignalTab, int Object, int SignalType,  int period1= -1, int period2 = -1, int period3 = -1);

extern int	iGet_Signal (int* SignalTab, int Object, int SignalType, int period);
extern int	iGet_Previous_Signal (int* BeforeSignalTab, int Object, int SignalType, int period);

extern double iSValue (double* SignalTabValue, int Object, int SignalType, int period);
extern double iSPValue (double* BeforeSignalTabValue, int Object, int SignalType, int period);

extern datetime iSTime (datetime* SignalTabTime, int Object, int SignalType, int period);
extern datetime iSPTime (datetime* BeforeSignalTabTime, int Object, int SignalType, int period);

extern double iSPrice (double* SignalTabPrice, int Object, int SignalType, int period);
extern double iSPPrice (double* BeforeSignalTabPrice, int Object, int SignalType, int period);

extern void iSet_Signal_Value (double* SignalTabValue,  int Object, int SignalType, int period, double Value);
extern void iSet_Signal_Time (datetime* SignalTabTime, int Object, int SignalType, int period, datetime Value);
extern void iSet_Signal_Price (double* SignalTabPrice, int Object, int SignalType, int period, double Value);
extern void iSet_Previous_Signal_Value (double* BeforeSignalTabValue, int Object, int SignalType, int period, double Value);

extern void iSet_Signal (int* SignalTab, int* BeforeSignalTickTab, double* SignalTabValue, datetime* SignalTabTime, double* SignalTabPrice, datetime TimeCurrent, double Bid, int Object, int SignalType, int period, int signal,double value = -1);
extern void iSet_Previous_Signal (int* BeforeSignalTab, double* BeforeSignalTabValue, int Object, int SignalType, int period, int signal, double value = -1);



/////////////////////////////////////////////////////////////////////////////////////////////////

extern bool iAbove (double* SignalTabValue, int Object1, int Object2, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iBelow (double* SignalTabValue, int Object1, int Object2, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

extern bool iAngleUp (double* SignalTabValue, int Object,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAngleDown (double* SignalTabValue, int Object, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAngleAbove (double* SignalTabValue, int Object, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAngleBelow (double* SignalTabValue, int Object, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndAngle (int* SignalTab, int Object, int SignalType, double value,  int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);	
extern bool iAngleDivergence (int* SignalTab, double* SignalTabValue, int Object, int period);

/////////////////////////////////////////////////////////////////////////////////////////////////

#define MaxV(...) iMaxV (SignalTabValue,##__VA_ARGS__)  
#define MinV(...) iMinV (SignalTabValue,##__VA_ARGS__)  
#define AndV_Eq(...) iAndV_Eq (SignalTabValue,##__VA_ARGS__)  
#define AndV_L(...) iAndV_L (SignalTabValue,##__VA_ARGS__)  
#define AndV_LEq(...) iAndV_LEq (SignalTabValue,##__VA_ARGS__)  
#define AndV_G(...) iAndV_G (SignalTabValue,##__VA_ARGS__)  
#define AndV_GEq(...) iAndV_GEq (SignalTabValue,##__VA_ARGS__)  
#define OrV_Eq(...) iOrV_Eq (SignalTabValue,##__VA_ARGS__)  
#define OrV_L(...) iOrV_L (SignalTabValue,##__VA_ARGS__)  
#define OrV_LEq(...) iOrV_LEq (SignalTabValue,##__VA_ARGS__)  
#define OrV_G(...) iOrV_G (SignalTabValue,##__VA_ARGS__)  
#define OrV_GEq(...) iOrV_GEq (SignalTabValue,##__VA_ARGS__)  

#define MaxPV(...) iMaxPV (BeforeSignalTabValue,##__VA_ARGS__)  
#define MinPV(...) iMinPV (BeforeSignalTabValue,##__VA_ARGS__)  
#define AndPV_Eq(...) iAndPV_Eq (BeforeSignalTabValue,##__VA_ARGS__)  
#define AndPV_L(...) iAndPV_L (BeforeSignalTabValue,##__VA_ARGS__)  
#define AndPV_LEq(...) iAndPV_LEq (BeforeSignalTabValue,##__VA_ARGS__)  
#define AndPV_G(...) iAndPV_G (BeforeSignalTabValue,##__VA_ARGS__)  
#define AndPV_GEq(...) iAndPV_GEq (BeforeSignalTabValue,##__VA_ARGS__)  
#define OrPV_Eq(...) iOrPV_Eq (BeforeSignalTabValue,##__VA_ARGS__)  
#define OrPV_L(...) iOrPV_L (BeforeSignalTabValue,##__VA_ARGS__)  
#define OrPV_LEq(...) iOrPV_LEq (BeforeSignalTabValue,##__VA_ARGS__)  
#define OrPV_G(...) iOrPV_G (BeforeSignalTabValue,##__VA_ARGS__)  
#define OrPV_GEq(...) iOrPV_GEq (BeforeSignalTabValue,##__VA_ARGS__)  





extern double iMaxV (double* SignalTabValue, int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern double iMinV (double* SignalTabValue, int Object, int SignalType,int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

extern bool iAndV_Eq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndV_L (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndV_LEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndV_G (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndV_GEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrV_Eq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrV_L (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrV_LEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrV_G (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrV_GEq (double* SignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

extern double iMaxPV (double* BeforeSignalTabValue,int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern double iMinPV (double* BeforeSignalTabValue,int Object, int SignalType, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

extern bool iAndPV_Eq (double* BeforeSignalTabValue, int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndPV_L (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndPV_LEq (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndPV_G (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndPV_GEq (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrPV_Eq (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrPV_L (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrPV_LEq (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrPV_G (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrPV_GEq (double* BeforeSignalTabValue,int Object, int SignalType, double value,  int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

#define AndBV_Eq(...) iAndBV_Eq (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define AndBV_LEq(...) iAndBV_LEq (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define AndBV_L(...) iAndBV_L (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define AndBV_G(...) iAndBV_G (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define AndBV_GEq(...) iAndBV_GEq (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define OrBV_Eq(...) iOrBV_Eq (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define OrBV_LEq(...) iOrBV_LEq (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define OrBV_L(...) iOrBV_L (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define OrBV_G(...) iOrBV_G (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  
#define OrBV_GEq(...) iOrBV_GEq (SignalTabValue, BeforeSignalTabValue,##__VA_ARGS__)  

extern bool iAndBV_Eq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndBV_LEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndBV_L (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndBV_G (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iAndBV_GEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrBV_Eq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrBV_LEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrBV_L (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrBV_G (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
extern bool iOrBV_GEq (double* SignalTabValue, double* BeforeSignalTabValue, int Object, int SignalType, double value, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);

#define ReturnTime(stime) _ReturnTime (TimeCurrent, stime)
extern datetime _ReturnTime (datetime TimeCurrent, const char sTime[]);
extern datetime ReturnDate (const char sDate[]);


extern void R_RULE (A);
extern void R_RULE (B);
extern void R_RULE (C);
extern void R_RULE (D);
extern void R_RULE (E);
extern void R_RULE (F);
extern void R_RULE (G);
extern void R_RULE (H);
extern void R_RULE (I);
extern void R_RULE (J);
extern void R_RULE (K);
extern void R_RULE (L);
extern void R_RULE (M);
extern void R_RULE (N);
extern void R_RULE (O);
extern void R_RULE (P);
extern void R_RULE (Q);
extern void R_RULE (R);
extern void R_RULE (S);
extern void R_RULE (T);
extern void R_RULE (U);
extern void R_RULE (V);
extern void R_RULE (W);
extern void R_RULE (X);
extern void R_RULE (Y);
///////////////////////////////////////////////


extern void SYSTEM (X);
///////////////////////////////////////////////






#endif