
#define       NBR_OPERATIONS       14



//=============================================SIGNALS==========================================

#define       P_NOSIGNAL         0  
#define       P_SIGNAL           1

#define       NBR_RULES            25
#define       NBR_FIELDS           83
#define       NBR_PERIODS          9
#define       NBR_OBJECTS          100 
#define       NBR_SIGNALS          80
#define       NBR_ENGINES          51        // NBR_RULES * 2 + Manual
#define       NBR_ATTRIBUTES       46        // for the moment we have 32 for shift problem ... 
#define       NBR_SCHEDULES        3   // nbr schedule by rule, operation

#define       EngineManual         50        // Engine Manual

//================================================= SYSTEMS ==========================================
#define       P_M1               0   
#define       P_M5               1
#define       P_M15              2
#define       P_M30              3
#define       P_H1               4
#define       P_H4               5
#define       P_D1               6
#define       P_W1               7
#define       P_MN               8

//================================================= SYSTEMS ==========================================
#define       S_UP               0       // indicator down
#define       S_DOWN             1       // indicator up
#define       S_SIDEWAY          2      // indicator is sideway (cloud, angle ...goes with UP DOWN); 
#define       S_ABOVE            3       // point above
#define       S_BELOW            4       // point below
#define       S_TOUCHED          5       // point touched                                     
#define       S_ALERT            6       // approaching    
#define       S_CROSS_UP         7       // point cross
#define       S_CROSS_DOWN       8       // point cross down
#define       S_REVERSE_UP       9       // point reversing or indicator changing 
#define       S_REVERSE_DOWN     10       // point reversing 
#define       S_MIDDLE           11      // point in middle (resistance support); 
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
#define       S_DOJI                      37
#define       S_BULL_QUAD                38      // Consolidation
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
#define       S_BEAR_QUAD                53    // Consolidation
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
#define       S_MAXINDAY                  68
#define       S_MININDAY                  69
#define       S_FIRSTINDAY                70
#define       S_MAXINWEEK                 71
#define       S_MININWEEK                 72
#define       S_FIRSTINWEEK               73
#define       S_MAXINMONTH                74
#define       S_MININMONTH                75
#define       S_FIRSTINMONTH              76
#define       S_MAXINYEAR                 77
#define       S_MININYEAR                 78
#define       S_FIRSTINYEAR               79


//================================================= SYSTEMS ==========================================
//=============================================ENGINES==========================================


#define       B_STARTAUTOMATIC     0
#define       B_BUYSELLAUTOMATIC   1 
#define       B_EXITAUTOMATIC      2
#define       B_HEDGEAUTOMATIC     3
#define       B_DEHEDGEAUTOMATIC   4

#define       B_OPERATION          5   // OP_BUYSELL, OP_BUY, OP_SELL
#define       B_STARTRULE          6   // MAIN RULE ... Parameters of engine is passed to this rule ..... (ENGINE REFERENCE#define       B_BUYRULE            40   // rule to buysell on may be not the same that start
#define       B_BUYRULE            7   // rule to buysell on may be not the same that start
#define       B_SELLRULE           8   // rule to buysell on may be not the same that start
#define       B_EXITBUYRULE        9     
#define       B_EXITSELLRULE       10     
#define       B_EXITRULE           11    

#define       B_ILOT               12   // Initial Lot size
#define       B_MAXLOT             13   // Initial Lot size
#define       B_MAXCOUNT           14
#define       B_DIRECTION          15
#define       B_DIRECTIONTYPE      16
#define       B_RECOVERYMODE       17   // recovery numbers
#define       B_RECOVERYVALUE      18   // Recovery Value

#define       B_PIPSTEP            19   // PipStep
#define       B_TIMESTEP           20   // in minutes  max 69 days

#define       B_ORDERTYPE          21   // OP_BUYSELL Hedging orders              
#define       B_KEEPBUYSELL        22
#define       B_EXITMODE           23   // OP_BUYSELL  ATTRIBUTES
#define       B_MAXTIME            24   // minutes

#define       B_HEDGEMAGNITUDE     25   

#define       B_MINPROFIT          26   // OP_EXIT OP_EXIB_SELL OP_EXIB_BUY ATTRIBUTES 
#define       B_BUYMINPROFIT       27   // OP_EXIT OP_EXIB_SELL OP_EXIB_BUY ATTRIBUTES 
#define       B_SELLMINPROFIT      28   // OP_EXIT OP_EXIB_SELL OP_EXIB_BUY ATTRIBUTES 

#define       B_TP                 29   // Take Profit Session  
#define       B_TS                 30   // Trailing Stop Session 
#define       B_SL                 31   // Stop Loss Session
#define       B_BUYTP              32   // Buy Take Profit 
#define       B_BUYTS              33   // Buy Trailing Stop 
#define       B_BUYSL              34   // Buy Stop Loss

#define       B_SELLTP             35   // Sell Take Profit 
#define       B_SELLTS             36   // Sell Trailing Stop 
#define       B_SELLSL             37   // Sell Stop Loss

#define       B_BUYLOTTP           38   // takeprofit on a lot in pips
#define       B_BUYLOTTS           39   // trailing stop on a lot in pips ... 
#define       B_BUYLOTSL           40   // stop loss  on a lot in pips 

#define       B_SELLLOTTP          41   // takeprofit on a lot in pips
#define       B_SELLLOTTS          42   // trailing stop on a lot in pips ... 
#define       B_SELLLOTSL          43   // stop loss  on a lot in pips 

#define       B_LEVELPOINT         44
#define       B_ONEORDERPERBAR     45
//=============================================ENGINES==========================================
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


//================================================= SYSTEMS ==========================================

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

#define       R_MANUAL             NBR_RULES
#define       S_MANUAL              "Z"

//================================================= SYSTEMS ==========================================

// OP_BUY OP_SELL (defined in mt4);

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
#define       OP_CLOSE	           13
#define       OP_WAIT              14
#define       OP_HOLD              15
#define       OP_SUSPEND           16
//================================================= SYSTEMS ==========================================
#define       D_BACKWARD           0
#define       D_FORWARD            1
#define       D_ANY                2

//================================================= SYSTEMS ==========================================
#define       DT_MINMAX            0
#define       DT_LEVEL             1

//================================================= SYSTEMS ==========================================
#define       EM_EXITBUYFIRST      0
#define       EM_EXITSELLFIRST     1
#define       EM_EXITANY           2
//================================================= SYSTEMS ==========================================
#define       OT_MONO              0
#define       OT_HEDGE             1
//================================================= SYSTEMS ==========================================
// IN attributes
#define       T_OPERATION               0
#define       T_START                   1   
#define       T_STATUS                  2    // OP_EXIT OP_EXIT_SELL OP_EXIT_BUY ATTRIBUTES 
#define       T_RULE                    3    // rule to buysell on may be not the same that start
#define       T_KEEPBUYSELL             4    // rule to buysell on may be not the same that start
#define       T_SUSPEND                 5
#define       T_MINPROFIT               6    
#define       T_EXITMODE                7    // OP_BUYSELL  ATTRIBUTES
#define       T_PIPSTEP                 8   
#define       T_TIMESTEP                9
#define       T_ORDERTYPE               10   //OP_BUYSELL Attr 
#define       T_DIRECTION               11
#define       T_DIRECTIONTYPE           12
#define       T_RECOVERYMODE            13   // recovery numbers
#define       T_RECOVERYVALUE           14
#define       T_ILOT                    15   
#define       T_BUYLOT                  16 
#define       T_SELLLOT                 17 
#define       T_MAXLOT                  18
#define       T_MAXLOSS                 19
#define       T_MAXTIME                 20
#define       T_MAXCOUNT                21   // IN OUT PARAMETER !!! engine can adjust ... 
#define       T_HEDGEMAGNITUDE          22
#define       T_ONEORDERPERBAR          23
#define       T_BUYLOTSL                24   
#define       T_BUYLOTTP                25
#define       T_BUYLOTTS                26
#define       T_SELLLOTSL               27   
#define       T_SELLLOTTP               28
#define       T_SELLLOTTS               29
#define       T_SL                      30   
#define       T_TP                      31
#define       T_TS                      32
#define       T_BUYSL                   33   
#define       T_BUYTP                   34
#define       T_BUYTS                   35
#define       T_SELLSL                  36 
#define       T_SELLTP                  37
#define       T_SELLTS                  38
#define       T_HMAX                    39
#define       T_HMIN                    40
#define       T_MAX                     41
#define       T_MIN                     42
#define       T_EXITBUY                 43
#define       T_EXITSELL                44
#define       T_CLOSEBUY                45
#define       T_CLOSESELL               46
#define       T_PROFITBUY               47
#define       T_PROFITSELL              48
#define       T_PROFIT                  49
#define       T_LASTLOT                 50
#define       T_LASTBUYLOT              51
#define       T_LASTSELLLOT             52
#define       T_STARTTRADE              53
#define       T_NEUTRALPOINT            54
#define       T_BUYAVERAGEPOINT         55
#define       T_SELLAVERAGEPOINT        56
#define       T_HEDGELLINE              57
#define       T_HEDGENBRLOTS            58
#define       T_BUYHEDGENBRLOTS         59
#define       T_SELLHEDGENBRLOTS        60
#define       T_HEDGETYPE               61
#define       T_HEDGED                  62
#define       T_HASBEENHEDGED           63
#define       T_HEDGEPROFIT             64
#define       T_HEDGEBUYPROFIT          65
#define       T_HEDGESELLPROFIT         66
#define       T_BUYNBRTRADE             67
#define       T_SELLNBRTRADE            68
#define       T_BUYNBRLOTS              69
#define       T_SELLNBRLOTS             70
#define       T_LASTORDEROPENTIME       71     
#define       T_LASTORDERCLOSETIME      72     
#define       T_LASTORDEROPENPRICE	    73
#define       T_LASTORDERCLOSEPRICE     74
#define       T_LASTORDERCLOSEPROFIT    75    // order in history only ==> closed
#define       T_LASTORDERCLOSETYPE      76    // order in history only ==> closed
#define       T_FIRSTORDEROPENTIME      77    
#define       T_FIRSTORDERCLOSETIME     78    
#define       T_FIRSTORDEROPENPRICE     79    
#define       T_FIRSTORDERCLOSEPRICE    80
#define       T_LEVELPOINT              81
#define       T_LASTORDERTYPE           82   

//================================================= SYSTEMS ==========================================

#define       M_F                       0
#define       M_D                       1
#define       M_H                       2
#define       M_S                       3
#define       M_I                       4
#define       M_M                       5
#define       M_N                       6
#define       M_J                       7
#define       M_C                       8
#define       M_O                       9
#define       M_P                       10
#define       M_Q                       11
#define       M_A                       12
#define       M_L                       13
#define       M_K                       14
//================================================= SYSTEMS ==========================================
//====================================================================================================
#define       MA_TYPE                   0
#define       ADX_TYPE                  1
#define       CCI_TYPE                  2
#define       ICHIMOKU_TYPE             3
#define       BOLLINGER_TYPE            4
#define       SAR_TYPE                  5
#define       RSI_TYPE                  6
#define       MACD_TYPE                 7
#define       STOCHASTIC_TYPE           8
#define       WPR_TYPE                  9
#define       ATR_TYPE                  10
#define       CUSTOM_TYPE               11
#define       PREDEFINED_TYPE           12
#define       SYSTEM_TYPE		        13
//================================================= SYSTEMS ==========================================

#define       TRENDLINE_TYPE   0
#define       HISTOGRAM_TYPE   1
#define       BULLBEAR_TYPE    2


#define       MAIN_DISPLAY       0
#define       SEPERATE_DISPLAY   1

#define       OVERBOUGHTOVERSOLD_LEVEL 0
#define       STRONGWEAK_LEVEL   1

#define       UPTREND            0
#define       DOWNTREND          1
#define       SIDEWAYTREND       2
#define       TREND              3

#define       UPLEVEL1           0
#define       UPLEVEL            1
#define       MIDLEVEL           2
#define       DOWNLEVEL          3
#define       DOWNLEVEL1         4


#define			SBoolean				0
#define			SNumeric				1
#define			SBoth					2

//===============================================STRUCTURE============================================================
/*
extern struct PG {
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
};

#import "progresslib.ex4"
int AndS (int Object, int signaltype, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);
int AndPS (int Object, int signaltype, int period, int period1= -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1);


void Set_Rule (int Operation, int OperationType, int rule, int signal, double value = -1);
void Set_Rule_Value (int Operation, int OperationType, int rule, double Value);
double RValue (int Operation, int OperationType, int rule);
double SValue (int Object, int signaltype, int period);


#import

#import "R_O.ex4" 
void          R_O_RULE ();   
#import
*/