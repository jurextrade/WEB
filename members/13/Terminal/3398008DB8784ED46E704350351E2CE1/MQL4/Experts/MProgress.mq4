//+---------------------------------------------------------------------------------------------------------------+
//|                                                 Progress.mq4     |
//|                      Copyright © 2014, MetaQuotes Software Corp. |
//|                                        http://www.metaquotes.net |
//+---------------------------------------------------------------------------------------------------------------+
#property copyright   "Copyright 2021,Gabriel Jureidini"
#property link        "http://www.mt4-progress.com"
#property version     "500.000"                                                      // Version
#property description "Running Expert Advisors created in MT4-Progress Software." // Description (line 1)
#property description "Interactive Monitoring of Strategies"         // Description (line 2)
#property icon        "\\Images\\Progress.ico";   

  
                                 // A file with the product icon
#include <Progress.mqh>
#include <stdlib.mqh>

//+------------------------------------------------------------------+ CONNECTION
			

//+------------------------------------------------------------------+ CONNECTION


int    AngleShift         = 2;
int    TimeBetweenSession = 0;
bool   CloseNowBuy        = false;
bool   CloseNowSell       = false;
bool   CloseNowAll        = false;
bool   SuspendAll         = false;
bool   ResumeAll          = false;
bool   EndSessions        = false;    // don'tey  start sessions anymore after finish
int           E_NbrEngine                  = 0;
int           O_NbrObject                  = 0;
int           O_NbrSysObject	           = 0;
int           O_NbrVObject                 = 0;
int           A_NbrAlert                   = 0;


int           CurrentPeriod      = 0;
datetime      CurrentTime        = 0;

int           ShouldExit           = 0;
int           FirstPass          = -1;
int           SecondPass         = 0;


double        SYS_DIGITS;
double        SYS_POINT;
int           SYS_SLIPPAGE;
double        SYS_SPREAD;
double        SYS_LOTSIZE,
              SYS_LOTSTEP,
              SYS_MINLOT,
              SYS_MAXLOT,
              SYS_STOPLEVEL;
string        SYS_SYMBOL;



bool          C_COMPILE          = false;
//#define       NBR_RULES            1
bool          GlobalComment      = true;

//================================================= RULES ==========================================
int           RuleTab[NBR_OPERATIONS][NBR_FIELDS];
int           BeforeRuleTab[NBR_OPERATIONS][NBR_FIELDS];
double        RuleTabValue[NBR_OPERATIONS][NBR_FIELDS][NBR_RULES];
double        BeforeRuleTabValue[NBR_OPERATIONS][NBR_FIELDS][NBR_RULES];
int           RuleFilterTab[NBR_OPERATIONS][NBR_FIELDS][NBR_RULES];


int           RuleNbrBuy, RuleNbrSell, RuleNbrExitBuy, RuleNbrExitSell;
int           RuleObjFilter[NBR_OBJECTS];
int           RuleOrder[NBR_RULES];

 //================================================= SIGNALS ==========================================
int           SignalTab[NBR_OBJECTS][NBR_SIGNALS];

int           BSignalTab[NBR_OBJECTS][NBR_SIGNALS];
int           TSignalTab[NBR_OBJECTS][NBR_SIGNALS];

int           BeforeSignalTab[NBR_OBJECTS][NBR_SIGNALS];
int           BeforeSignalTickTab[NBR_OBJECTS][NBR_SIGNALS];

double        SignalTabValue[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
double        SignalTabTime[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
double        SignalTabPrice[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];

double        BeforeSignalTabValue[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
double        BeforeSignalTabTime[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];
double        BeforeSignalTabPrice[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];


int           SignalFilterTab[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];

datetime      SignalFilterTabTime[NBR_OBJECTS][NBR_SIGNALS][NBR_PERIODS];   // interval in seconds

//=============================================ENGINES==========================================

string        EngineName[NBR_ENGINES] ;
int           EngineTab[NBR_ENGINES][2];
double        EngineTabValue[NBR_ENGINES][NBR_ATTRIBUTES];
int           EngineStartRule[NBR_ENGINES];
//======================================
datetime      TimeOpenBar[NBR_PERIODS];
//=============================================SCHEDULES========================================

double        S_StartM[NBR_RULES][3][NBR_SCHEDULES];  // this should be set to 0 when not used
double        S_StartW[NBR_RULES][3][NBR_SCHEDULES];
double        S_StartD[NBR_RULES][3][NBR_SCHEDULES];
datetime      S_StartT[NBR_RULES][3][NBR_SCHEDULES];
double        S_EndM[NBR_RULES][3][NBR_SCHEDULES];
double        S_EndW[NBR_RULES][3][NBR_SCHEDULES];
double        S_EndD[NBR_RULES][3][NBR_SCHEDULES];
datetime      S_EndT[NBR_RULES][3][NBR_SCHEDULES];
double        S_FrequencyD[NBR_RULES][3][NBR_SCHEDULES];
double        S_OnSameBar[NBR_RULES][3][NBR_SCHEDULES];


double        S_BetweenT[NBR_RULES][3][NBR_SCHEDULES];
double        S_TimeZone[NBR_RULES][3][NBR_SCHEDULES];

double        S_NbrRuleStart[NBR_RULES + 1][3];
double        S_NbrRuleStartW[NBR_RULES + 1][3];
double        S_NbrRuleStartD[NBR_RULES + 1][3];
double        S_LastCloseTime[NBR_RULES + 1][3];
//=============================================OBJECTS========================================


#define		  NBR_SYSOBJECTS     45  // level = 5 * nbr_periods = 9


bool		  ObjUsed[NBR_OBJECTS];
int           ObjId[NBR_OBJECTS];
string        ObjName[NBR_OBJECTS];  
int           ObjType[NBR_OBJECTS];
int           ObjMethod[NBR_OBJECTS];
int           ObjApply[NBR_OBJECTS];
int           ObjMode[NBR_OBJECTS];
int           ObjShift[NBR_OBJECTS];
int           ObjPeriod[NBR_OBJECTS];
int           ObjDeviations[NBR_OBJECTS];
string        ObjProgName[NBR_OBJECTS];
double        ObjStep[NBR_OBJECTS];
double        ObjMaximum[NBR_OBJECTS];
string        ObjCross[NBR_OBJECTS];
int           ObjDisplayType[NBR_OBJECTS];
int           ObjDisplay[NBR_OBJECTS];
int           ObjLevelType[NBR_OBJECTS];
int           ObjValue[NBR_OBJECTS][4];    // values trend = 3 up = 0 down = 1 sideway = 2
double        ObjLevel[NBR_OBJECTS][5][NBR_PERIODS];    // mid level 0 up level = 1 downlevel = 2 ex up = 3 ex down = 4
string        P_ObjName[NBR_OBJECTS];             
int           P_ObjOrder[NBR_OBJECTS];
string        SysObjName[NBR_OBJECTS];             
string        SysObjDependency[NBR_OBJECTS][NBR_SYSOBJECTS];

//======================================
//minutes

int    NewsAlertTime      = 360;    // 6 hours

bool   AlertOnStartRule   = false;
bool   ShellTrace         = true;
bool   FileTrace          = false;



// MONEY MANAGEMENT
double        MMDailyTargetAmount  = 0;
double        MMDailyStopLoss      = 0;
double        MMDailyPercentTargetAmount  = 0;
double        MMDailyPercentStopLoss      = 0;
bool          MMDailyTargetReached = false;
double        MMDailyClosedProfit  = -1;

double        MMDailySymbolTargetAmount  = -1;
double        MMDailySymbolStopLoss      = -1;
bool          MMDailySymbolTargetReached = false;
double        MMDailySymbolClosedProfit  = -1;

double        MMWeeklyTargetAmount  = 0;
double        MMWeeklyStopLoss      = 0;
double        MMWeeklyPercentTargetAmount  = 0;
double        MMWeeklyPercentStopLoss      = 0;

bool          MMWeeklyTargetReached = false;
double        MMWeeklyClosedProfit  = -1;

double        MMWeeklySymbolTargetAmount  = -1;
double        MMWeeklySymbolStopLoss      = -1;
bool          MMWeeklySymbolTargetReached = false;
double        MMWeeklySymbolClosedProfit  = -1;


//+------------------------------------------------------------------+ GENERAL

bool          TestMode           = false;
bool          GraphicMainPanel   = false;
bool          News               = false;
bool          MarketOpening      = false;
bool          NewsSound          = false;
bool          OperationSound     = true;
bool          SystemSound        = false;
bool          AlertsSound        = false;

bool          GraphicMode        = true; 
bool          ProgressIndicator  = true;

bool          Automatic          = false;


int           HedgeMagicNumber   = 40;
int           Slippage           = 3;
int           TerminalBuffer[400];
int           SymbolBuffer[20];


#define       NEWSSOUND          0
#define       ALERTSOUND         1
#define       OPERATIONSOUND     2
#define       SYSTEMSOUND        3
#define       NBRMAXSHIFT        25000


datetime      StartDate          = 0;
datetime      GMTShift;
int           DayInMinutes       = 1440;

int           Sound              = 0;

double        AccountMinFreeMargin      = 50000000;

double        AccountNbrLots     = 0;
double        AveragePoint       = 0;
double        AccountTotalProfit = 0;
double        AccountTotalNbrLots       = 0;

double        Lots               = -5;                // if Lots are negative means the percent of free margin used
double        Risk               = 1;


#define       TYPE_ERROR		   0
#define       TYPE_WARNING	      1
#define       TYPE_INFO		      2
#define       NO_SEND            3


int           SymbolRunning;



//=============================================SYSTEM==========================================



//=============================================SIGNALS==========================================

string        ObjTypeName[]      = {"MA", "ADX", "CCI", "ICHIMOKU", "BOLLINGER", "SAR", "RSI", "MACD", "STOCHASTIC", "WPR", "ATR", "CUSTOM", "PREDEFINED", "SYSTEM"};
string        SignalName[]       =  {"UP","DOWN","SIDEWAY","ABOVE","BELOW", "TOUCHED", "ALERT", "CROSS_UP", "CROSS_DOWN", "REVERSE_UP", "REVERSE_DOWN",           
         								"MIDDLE", "CHANGED","TARGET", "DISTANCE","CURRENT","PREVIOUS","BULL","BEAR","RANGE","OVERBOUGHT","OVERSOLD",
         								"EXT_OVERBOUGHT","EXT_OVERSOLD","VERYWEAK","WEAK","NEUTRAL","STRONG","VERYSTRONG",
         								"ANGLE","PANGLE","NBRBARS","RCROSSED","BUY","SELL","EXIT_BUY","EXIT_SELL","DOJI",         								 
         								"BULL_QUAD", "BULL_HAMMER", "BULL_HAMMER1", "BULL_HAMMER2", "BULL_ENGULFING", "BULL_HARAMI",
         								"BULL_INVERTED_HAMMER", "BULL_INVERTED_HAMMER1", "BULL_INVERTED_HAMMER2", "BULL_PIERCING_LINE", "BULL_MORNING_STAR", "BULL_MORNING_DOJI_STAR", 
         								"BULL_THREE_WHITE_SOLDIERS", "BULL_THREE_INSIDE_UP", "BULL_THREE_OUTSIDE_UP", 
         								"BEAR_QUAD", "BEAR_HANGING_MAN", "BEAR_HANGING_MAN1", "BEAR_HANGING_MAN2", "BEAR_ENGULFING", "BEAR_HARAMI", 
         								"BEAR_SHOOTING_STAR", "BEAR_SHOOTING_STAR1", "BEAR_SHOOTING_STAR2", "BEAR_DARK_CLOUD_COVER", "BEAR_EVENING_STAR", "BEAR_EVENING_DOJI_STAR", 
         								"BEAR_THREE_BLACK_CROWS","BEAR_THREE_INSIDE_DOWN", "BEAR_THREE_OUTSIDE_DOWN", 
         								"MAXINDAY", "MININDAY", "FIRSTINDAY", "MAXINWEEK", "MININWEEK", "FIRSTINWEEK","MAXINMONTH", "MININMONTH", "FIRSTINMONTH", "MAXINYEAR", "MININYEAR", "FIRSTINYEAR"};  
       								



								             								
int           SignalVisible[NBR_SIGNALS];
         								
string        PeriodName[]       = {"M1","M5","M15","M30","H1","H4","D1","W1","MN"};
int           PeriodIndex[]           = {PERIOD_M1,PERIOD_M5,PERIOD_M15,PERIOD_M30,PERIOD_H1,PERIOD_H4,PERIOD_D1,PERIOD_W1,PERIOD_MN1};

string        DirectionName[]      = {"BACKWARD", "FORWARD", "ANY"};
string        DirectionTypeName[]  = {"MINMAX", "LEVEL"};
string        ExitModeName[]       = {"EXITBUYFIRST", "EXITSELLFIRST", "EXITANY"};
string        OrderTypeName[]      = {"MONO", "HEDGE"};

//================================================= SYSTEMS ==========================================

string        RecoveryModeName[] = {"F", "D", "H", "S", "I", "M", "N", "J", "C", "O", "P", "Q", "A", "L", "K"};

//=============================================ALERTS==========================================

#define       NBR_ALERTS   100

#define		  FROM_BID          0
#define		  FROM_HIGH         1
#define       FROM_LOW          2

#define       OR_OP				  0
#define       AND_OP		      1
#define       ORVALUE_OP  		  2
#define       ANDVALUE_OP  		  3

#define		  LESSEQ_OP			  0
#define		  LESS_OP			  1
#define		  EQ_OP				  2
#define		  BIG_OP			  3
#define		  BIGEQ_OP			  4
#define		  ANDOR_OP			  5
#define		  NOT_OP			  1
#define		  PREV_OP			  1

#define       TYPE_NORMAL		  0	
#define       TYPE_BAR			  1	
#define       TYPE_TICK			  2	

//=============================================RULES==========================================

string  	  OpName[]   = {"BUY", "SELL", "BUYLIMIT", "SELLLIMIT", "BUYSTOP","SELLSTOP"};
string        RuleName[]      = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O","P", "Q", "R", "S", "T", "U", "V", "W","X", "Y", "Z"};
string  	  OperationName[]   = {"BUY", "SELL", "BUYSELL",  "EXIT_BUY", "EXIT_SELL", "EXIT", "HEDGE_BUY", "HEDGE_SELL", "CLOSE_HEDGE_BUY", "CLOSE_HEDGE_SELL","CLOSE_HEDGE", "CLOSE_BUY", "CLOSE_SELL", "CLOSE", "WAIT", "HOLD", "SUSPEND"};
string        FieldName[]      = {"OPERATION","START","STATUS","RULE","KEEPBUYSELL","SUSPEND","MINPROFIT","EXITMODE","PIPSTEP","TIMESTEP","ORDERTYPE","DIRECTION","RECOVERYMODE"
,"RECOVERYVALUE","ILOT","BUYLOT","SELLLOT","MAXLOT","MAXLOSS","MAXTIME","MAXCOUNT", "HEDGEMAGNITUDE", "ONEORDERPERBAR","BUYLOTSL","BUYLOTTP","BUYLOTTS"
,"SELLLOTSL","SELLLOTTP","SELLLOTTS","SL","TP","TS","BUYSL","BUYTP","BUYTS","SELLSL","SELLTP","SELLTS","HMAX","HMIN","MAX","MIN","EXITBUY","EXITSELL","CLOSEBUY","CLOSESELL","PROFITBUY"
,"PROFITSELL","PROFIT","LASTLOT","LASTBUYLOT","LASTSELLLOT","STARTTRADE","NEUTRALPOINT","BUYAVERAGEPOINT","SELLAVERAGEPOINT","HEDGELLINE","HEDGENBRLOTS","BUYHEDGENBRLOTS","SELLHEDGENBRLOTS","HEDGETYPE"
,"HEDGED","HASBEENHEDGED","HEDGEPROFIT","HEDGEBUYPROFIT","HEDGESELLPROFIT","BUYNBRTRADE","SELLNBRTRADE","BUYNBRLOTS","SELLNBRLOTS"
,"LASTORDEROPENTIME","LASTORDERCLOSETIME","LASTORDEROPENPRICE", "LASTORDERCLOSEPRICE", "LASTORDERCLOSEPROFIT","T_LASTORDERCLOSETYPE"
,"FIRSTODEROPENTIME", "FIRSTODERCLOSETIME", "FIRSTORDEROPENPRICE", "FIRSTORDERCLOSEPRICE", "LEVELPOINT", "LASTORDERTYPE"};


//=============================================SESSIONS==========================================

#define       B_MaxSessions         51   // NBR_Engine 

int           B_IMagicNumber    = 1 << 6;
int           B_NbrSession       = 0;
double        B_TotalClosedProfit  = 0;

double        B_ActualProfit     = 0;
double        B_MinPoint         = 0;
double        B_MaxPoint         = 0;
double        B_TotalProfit      = 0;
double        B_TotalBuyProfit   = 0;
double        B_TotalSellProfit  = 0;
double        B_TotalHedgeProfit = 0;
double        B_TotalHedgeBuyProfit   = 0;
double        B_TotalHedgeSellProfit  = 0;



bool          B_InitSession[B_MaxSessions];
bool          B_FreeSession[B_MaxSessions];
int           B_MagicNumber[B_MaxSessions];
bool          B_BuyNow[B_MaxSessions];
bool          B_SellNow[B_MaxSessions];
bool          B_BuySell[B_MaxSessions];
bool          B_Suspend[B_MaxSessions];

int           B_Color[]          = {C'150,150,150',  C'150,150,150',  C'150,150,150', Sienna, OrangeRed, Purple, Indigo, Red, MediumBlue, DarkSlateGray};
int           B_MaxSession       = 0;



// ==== > ENGINE =====> RULE Receive information from engine
double        B_HMax[B_MaxSessions];   // history session
double        B_HMin[B_MaxSessions];


double        B_Max[B_MaxSessions];    // trade session
double        B_Min[B_MaxSessions];

bool          B_ExitBuy[B_MaxSessions];  
bool          B_ExitSell[B_MaxSessions];
bool          B_CloseBuy[B_MaxSessions];  
bool          B_CloseSell[B_MaxSessions];
double        B_ILot[B_MaxSessions]; 
double        B_BuyLot[B_MaxSessions]; 
double        B_SellLot[B_MaxSessions]; 
double        B_LastLot[B_MaxSessions];
double        B_LastBuyLot[B_MaxSessions];
double        B_LastSellLot[B_MaxSessions];
double        B_MaxLot[B_MaxSessions];
double        B_SLost[B_MaxSessions];     // Sum of Consecutive Lost Lots in a session
double        B_SGain[B_MaxSessions];     // Sum of Consecutive Gain Lots in a session


int           B_LastOrderType[B_MaxSessions];       //Last Order Type ... It can be closed or opened


double        B_LastOrderCloseProfit[B_MaxSessions];
int           B_LastOrderCloseType[B_MaxSessions];

double        B_LastOrderOpenPrice[B_MaxSessions];  //Last Order open price ... It can be closed or opened
double        B_LastOrderClosePrice[B_MaxSessions];
datetime      B_LastOrderOpenTime[B_MaxSessions];   //Last Order time opened ... it can be closed or opened
datetime      B_LastOrderCloseTime[B_MaxSessions];  // Last order close time
double        B_LastOrderCloseLot[B_MaxSessions];

double        B_FirstOrderClosePrice[B_MaxSessions];
double        B_FirstOrderOpenPrice[B_MaxSessions];  
datetime      B_FirstOrderOpenTime[B_MaxSessions];   //First Order time opened ... it can be closed or opened
datetime      B_FirstOrderCloseTime[B_MaxSessions];   //First Order time Closed


bool          B_HasBeenHedged[B_MaxSessions];
int           B_BuyNbrTrade[B_MaxSessions]; 
int           B_SellNbrTrade[B_MaxSessions];
double        B_BuyNbrLots[B_MaxSessions];
double        B_SellNbrLots[B_MaxSessions];
double        B_BuyProfit[B_MaxSessions]; 
double        B_SellProfit[B_MaxSessions];
double        B_Profit[B_MaxSessions];
double        B_SessionProfit[B_MaxSessions];
double        B_HedgeProfit[B_MaxSessions];
double        B_SellHedgeProfit[B_MaxSessions];
double        B_BuyHedgeProfit[B_MaxSessions];

datetime      B_StartDate[B_MaxSessions];
double        B_NeutralPoint[B_MaxSessions];
double        B_SellAveragePoint[B_MaxSessions];
double        B_BuyAveragePoint[B_MaxSessions];
double        B_HedgeLine[B_MaxSessions];
double        B_HedgeNbrLots[B_MaxSessions];
double        B_SellHedgeNbrLots[B_MaxSessions];
double        B_BuyHedgeNbrLots[B_MaxSessions];

int           B_HedgeType[B_MaxSessions]; 
bool          B_Hedged[B_MaxSessions];
string		  B_Symbol[B_MaxSessions];


// === > RULE ==== > ENGINE receive information from rule if not manual ..... 

int           B_Operation[B_MaxSessions];

double        B_BuyMinProfit[B_MaxSessions];       // min profit for all buy in session not include hedge
double        B_SellMinProfit[B_MaxSessions];      // min profit for all sell in session not include hedge
double        B_MinProfit[B_MaxSessions];          // min profit for the session include Hedge

double        B_TakeProfit[B_MaxSessions];         // session Take profit in money
double        B_StopLoss[B_MaxSessions];           // session Stop Loss in money
double        B_TStopLoss[B_MaxSessions];           // session Trailing Stop Loss in money

double        B_TrailingStop[B_MaxSessions];       // session Trailing Stop in money

double        B_BuyTakeProfit[B_MaxSessions];      // session Take profit in money for buy only for OP_BUY
double        B_BuyStopLoss[B_MaxSessions];        // session Stop Loss in money
double        B_TBuyStopLoss[B_MaxSessions];       // session Trailing Stop Loss in money
double        B_BuyTrailingStop[B_MaxSessions];    // session Trailing Stop in money

double        B_SellTakeProfit[B_MaxSessions];     // session Take profit in money for buy only for OP_BUY
double        B_SellStopLoss[B_MaxSessions];       // session Stop Loss in money
double        B_TSellStopLoss[B_MaxSessions];      // session Trailing Stop Loss in money
double        B_SellTrailingStop[B_MaxSessions];   // session Trailing Stop in money

double        B_BuyLotSL[B_MaxSessions];  // order stop loss in pips
double        B_BuyLotTP[B_MaxSessions];  // order Take profit in pips
double        B_BuyLotTS[B_MaxSessions];  // order trailing stop in pips

double        B_SellLotSL[B_MaxSessions];  // order stop loss in pips
double        B_SellLotTP[B_MaxSessions];  // order Take profit in pips
double        B_SellLotTS[B_MaxSessions];  // order trailing stop in pips

int           B_OrderType[B_MaxSessions];
int           B_Direction[B_MaxSessions];
int           B_DirectionType[B_MaxSessions];
int           B_MaxCount[B_MaxSessions]; 
int           B_MaxTime[B_MaxSessions]; 
int           B_RecoveryMode[B_MaxSessions];
double        B_RecoveryValue[B_MaxSessions];
double        B_LevelPoint[B_MaxSessions];   // DT_LEVEL

int           B_ExitMode[B_MaxSessions];

int           B_HedgeMagnitude[B_MaxSessions];
bool          B_HedgeAutomatic[B_MaxSessions];
bool          B_DeHedgeAutomatic[B_MaxSessions];


 
int           B_PipStep[B_MaxSessions];  
int           B_TimeStep[B_MaxSessions];  


bool          B_BuySellAutomatic[B_MaxSessions];       // buy sell auto... 
bool          B_ExitAutomatic[B_MaxSessions];   // exit manual or auto
bool          B_StarttAutomatic[B_MaxSessions]; // start manual or auto
double        B_BiggestLot[B_MaxSessions];
bool          B_NoLost[B_MaxSessions];

bool          B_KeepBuySell[B_MaxSessions];
int           B_OneOrderPerBar[B_MaxSessions];       
int           B_StartOnRule[B_MaxSessions];
int           B_BuyOnRule[B_MaxSessions];   
int           B_SellOnRule[B_MaxSessions];   
int           B_ExitOnRule[B_MaxSessions];   
int           B_ExitBuyOnRule[B_MaxSessions];   
int           B_ExitSellOnRule[B_MaxSessions];   


double		  B_RecoveryTab[NBR_ENGINES][B_MaxSessions];


//============================================= GENERAL ==========================================

// SIGNALS    for signals and rules 


double        AlertDistance[NBR_PERIODS];



// FRACTALS

int           UpFractals[NBR_PERIODS];                 
int           DownFractals[NBR_PERIODS];
int           NextUpFractals[NBR_PERIODS];              
int           NextDownFractals[NBR_PERIODS];
double        BeforeUpFractals[NBR_PERIODS];              
double        BeforeDownFractals[NBR_PERIODS];
double        LastUpFractals[NBR_PERIODS];              
double        LastDownFractals[NBR_PERIODS];


// RESISTANCE
int           Last2UpFractals[2][NBR_PERIODS];  
int           Last2DownFractals[2][NBR_PERIODS];
double        Before2UpFractals[2][NBR_PERIODS];              
double        Before2DownFractals[2][NBR_PERIODS];
double        SupportLevels[NBR_PERIODS];
double        ResistanceLevels[NBR_PERIODS];
double        BeforeSupportLevels[NBR_PERIODS];
double        BeforeResistanceLevels[NBR_PERIODS];


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

#define       NBR_SHIFT       5 

double        Pivots[11];
double        Fractals[14];
double        PivotPoint[NBR_PERIODS];
int           LastPivotDay= 0;
double        PivotPoints[9][NBR_PERIODS];
double        PrevPivotPoints[9][NBR_PERIODS];

double        LastHigh[NBR_SHIFT][NBR_PERIODS];
double        LastLow[NBR_SHIFT][NBR_PERIODS];
double        LastOpen[NBR_SHIFT][NBR_PERIODS];
double        LastClose[NBR_SHIFT][NBR_PERIODS]; 

double        LastResistance2[NBR_SHIFT][NBR_PERIODS];
double        LastResistance1[NBR_SHIFT][NBR_PERIODS];
double        LastResistance[NBR_SHIFT][NBR_PERIODS];
double        LastPivotPoint[NBR_SHIFT][NBR_PERIODS];
double        LastSupport[NBR_SHIFT][NBR_PERIODS];
double        LastSupport1[NBR_SHIFT][NBR_PERIODS];
double        LastSupport2[NBR_SHIFT][NBR_PERIODS];

//============================================= NEWS ==========================================

#define       MAXNBRNEWS          100

int           NewsNbrToday       = 0;     
int           NewsAlertBefore    = 300; 
int           NewsMax            = 0;

     
datetime      DateNewsToday[MAXNBRNEWS];
string        DescNewsToday[MAXNBRNEWS];
string        CurrNewsToday[MAXNBRNEWS];
string        ImportanceNewsToday[MAXNBRNEWS];
string        ActualNewsToday[MAXNBRNEWS];
string        ForecastNewsToday[MAXNBRNEWS];
string        PreviousNewsToday[MAXNBRNEWS];
color         ColorNewsToday[MAXNBRNEWS];


//============================================= NEWS ==========================================


string        SlopeObject      = "PG_Slope";
string        VelocityObject   = "PG_TPO_Velocity";
string        CoralObject      = "PG_THV_Coral";
string        TVIObject        = "PG_TVI";
string        ExtremeObject    = "PG_TMA_ExtremeSpike";
string        TrixObject       = "PG_THV_Trix";



double _Ask;   
double _Bid;



//=============================================RESET ALL ========================================

void ResetAll(int first = -1) {
    ResetSignals(first);
    ResetRules(first);
    ResetSignalFilters();
    ResetEngines(first);
    ResetSchedules();
}

void ResetSignals(int first = -1) {
    int i;
    for (int z = 0; z < O_NbrObject; z++) {
        i = ObjId[z];
        for (int j = 0; j < NBR_SIGNALS; j++) {
            for (int k = 0; k < NBR_PERIODS; k++) {
                if (first == 1) {
                    SignalTabTime[i][j][k] = -1;
                    SignalTabPrice[i][j][k] = -1;
                    SignalTabValue[i][j][k] = -1;
                    BeforeSignalTabValue[i][j][k] = -1;
                    BeforeSignalTabTime[i][j][k] = -1;
                    BeforeSignalTabPrice[i][j][k] = -1;

                    SignalTab[i][j] = 0;
                    BeforeSignalTab[i][j] = 0;
                    BeforeSignalTickTab[i][j] = 0;
                } else {
                    if (AndS(i, j, k) != 0)
                        BeforeSignalTickTab[i][j] |= (1 << k);
                    else
                        BeforeSignalTickTab[i][j] &= ~(1 << k);

                    if (TimeOpenBar[k] != iTime(NULL, PeriodIndex[k], 0)) {
                        if (AndS(i, j, k) != 0)
                            BeforeSignalTab[i][j] |= (1 << k);
                        else
                            BeforeSignalTab[i][j] &= ~(1 << k);
                        BeforeSignalTabValue[i][j][k] = SignalTabValue[i][j][k];
                        BeforeSignalTabTime[i][j][k] = SignalTabTime[i][j][k];
                        BeforeSignalTabPrice[i][j][k] = SignalTabPrice[i][j][k];
                    }
                }
            }
            SignalTab[i][j] = 0;
        }
        if (first == 1) RuleObjFilter[i] = 1;
    }
}

void ResetRules(int first = -1) // only status is reset
{
    for (int i = 0; i < NBR_OPERATIONS; i++)
        for (int j = 0; j < NBR_FIELDS; j++) {
            BeforeRuleTab[i][j] = RuleTab[i][j];
            RuleTab[i][j] = 0;
            if (first == 1)
                for (int k = 0; k < NBR_RULES; k++)
                    if (j == T_BUYNBRTRADE || j == T_SELLNBRTRADE)
                        RuleTabValue[i][j][k] = 0;
                    else
                        RuleTabValue[i][j][k] = 0;
        }
}

void ResetSignalFilters() {
    int i;

    for (int z = 0; z < O_NbrObject; z++) {
        i = ObjId[z];
        for (int j = 0; j < NBR_SIGNALS; j++)
            for (int x = 0; x < NBR_PERIODS; x++)
                SignalFilterTab[i][j][x] = 0;
    }
}

void ResetEngines(int first = -1) {
    for (int i = 0; i < NBR_ENGINES; i++) {
        EngineTab[i][0] = 0;
        EngineTab[i][1] = 0;

        for (int k = 0; k < NBR_ATTRIBUTES; k++) //SHIFT!!! 31
        {
            Set_Engine(i, k, P_SIGNAL);
/*
            if (k == B_STARTAUTOMATIC) {
                Set_Engine(i, k, P_NOSIGNAL);
            }
*/            
            if (first == 1)
                EngineTabValue[i][k] = -1;
        }
    }
}



//=============================================INIT ========================================
string GetTextPeriod(int period, int format = -1) {
    string sresult = "";
    if (format == -1)
        return (DoubleToString(period, 0));

    for (int i = 0; i < NBR_PERIODS; i++) {
        if (period & (1 << i)) {
            sresult = sresult + PeriodName[i] + " ";
        }
    }
    return (sresult);
}

double Pips (double value) {
	return (value / SYS_POINT);
}

double PipValue (double pips) {
	return (pips * SYS_POINT);
}
	
int GetMonth (datetime TimeCurrent) {
	return TimeMonth (TimeCurrent);
}

int GetWeek (datetime TimeCurrent) {

    int day = TimeDay (TimeCurrent);

    int oday = 1;

    while (day - 7 > 0) {
        oday++;
        day -= 7;
    }
    return (oday);

}

int GetDay (datetime TimeCurrent) {
   
	return TimeDay (TimeCurrent);
}

int GetHours (datetime TimeCurrent) {
   
	return TimeHour (TimeCurrent);
}

int GetMinutes (datetime TimeCurrent) {
   
	return TimeMinute (TimeCurrent);;
}

datetime ReturnTime (string sTime) {
    return 0;
}


datetime ReturnDate (string sDate) {
    return 0;
}



void InitEngines() {

    int k = 0;
    for (k = 0; k < NBR_RULES; k++)
        RuleOrder[k] = -1;

    k = 0;
    int lastrule = -1;
    for (int i = 0; i < E_NbrEngine; i++) {
        if (EValue(i, B_STARTRULE) != lastrule) {
            RuleOrder[k] = EValue(i, B_STARTRULE);
            lastrule = RuleOrder[k];
            k++;
        }
    }

}

void InitIndicators(double point) {
    for (int x = 0; x < NBR_PERIODS; x++) {
        if (x < P_M15) AlertDistance[x] = 3 * point;
        else
        if (x < P_H1) AlertDistance[x] = 5 * point;
        else
        if (x < P_H4) AlertDistance[x] = 10 * point;
        else AlertDistance[x] = 15 * point;
        LastHigh[1][x] = 0;
        LastClose[1][x] = 0;
        BeforeUpFractals[x] = 0;
        BeforeDownFractals[x] = 0;
        LastUpFractals[x] = 0;
        LastDownFractals[x] = 0;

        TimeOpenBar[x] = 0;
    }
    for (int i = 0; i < NBR_SIGNALS; i++) SignalVisible[i] = 1;
}
bool StringToBoolean(string Value) {
    if (Value == "true" || Value == "TRUE") return (true);
    else return (false);
}

string BooleanToString(bool Value) {
    if (Value == true) return ("true");
    else return ("false");
}

bool Equal(double Pos, int Range) {
    return (_Bid <= (Pos + Range * SYS_POINT) && _Ask >= (Pos - Range * SYS_POINT));
}

bool Upper(double Pos, int Range) {
    return (_Bid > Pos + Range * SYS_POINT);
}

bool Lower(double Pos, int Range) {
    return (_Bid < Pos - Range * SYS_POINT);
}

double IncreaseFactor(int count, double level) {
    double factor = 0;

    for (int i = 1; i < count + 1; i++)
        factor += (i - level);

    return (factor);
}

int Fibonacci(int n) {
    int a = 1;
    int b = 1;
    int c;
    if (n == 0) return (0);
    for (int i = 2; i <= n; i++) {
        c = b;
        b += a;
        a = c;
    }
    return (b);
}

datetime GetShiftGMT() {
    double d = (TimeCurrent() - TimeGMT());
    return (-3600 * MathRound(d / 3600));
}

void Send_Operation(string reply) {
    Print(reply);
}


void PG_Print(int Type, string s, int nowarning = -1) {
    if (FileTrace) {
        int handle = FileOpen("PG_Trace_" + SYS_SYMBOL + ".txt", FILE_READ | FILE_WRITE, " ");
        if (handle != -1) {
            FileSeek(handle, 0, SEEK_END);
            FileWrite(handle, s);
            FileClose(handle);
        }
    }
    if (ShellTrace == true) Print(s);

}

int InitMarketInfo() {
    double multiplier = 1;
    string s = _Symbol; // take off strange char
    int i = 0;
    SYS_SYMBOL = "";
    while (i < StringLen(s)) {
        if (StringGetCharacter(s, i) != StringGetCharacter(":", 0))
            SYS_SYMBOL = SYS_SYMBOL + CharToString(StringGetCharacter(s, i));
        i++;
    }
    SYS_LOTSIZE = MarketInfo(_Symbol, MODE_LOTSIZE);
    SYS_MINLOT = MarketInfo(_Symbol, MODE_MINLOT);
    SYS_MAXLOT = MarketInfo(_Symbol, MODE_MAXLOT);
    SYS_LOTSTEP = MarketInfo(_Symbol, MODE_LOTSTEP);
    SYS_SPREAD = MarketInfo(_Symbol, MODE_SPREAD);
    SYS_STOPLEVEL = MarketInfo(_Symbol, MODE_STOPLEVEL);
    SYS_DIGITS = MarketInfo(_Symbol, MODE_DIGITS);

    SYS_POINT = _Point;
    SYS_SLIPPAGE = Slippage;

    if (_Digits == 2 || _Digits == 4) multiplier = 1;
    if (_Digits == 3 || _Digits == 5) multiplier = 10;
    if (_Digits == 6) multiplier = 100;
    if (_Digits == 7) multiplier = 1000;

    SYS_POINT = _Point * multiplier;
    SYS_SLIPPAGE = Slippage * multiplier; // pips is the 4 digit so we need this///    
    SYS_SPREAD = NormalizeDouble(((_Ask - _Bid) / _Point) / 10, 1);

    return (0);
}

//=============================================INIT  ========================================


int init() {

    PG_Print(TYPE_INFO, "________________________________________________________________________   START INITIALISATION  ________________________________________________________________________");

    PG_Print(TYPE_INFO, "________________________________________________________________________           Running in " + ((C_COMPILE == true) ? " C MODE " : " MQ4 MODE ") + "          ________________________________________________________________________");

    ShouldExit = 0;
    FirstPass = -1;
    SecondPass = 0;

    
    SymbolRunning = FileOpen("Lock" + _Symbol, FILE_WRITE | FILE_BIN);
    if (SymbolRunning == -1) {
        Print("Expert is running already on symbol " + SYS_SYMBOL);
        return (INIT_FAILED);
    }

    if (MQLInfoInteger(MQL_TESTER) == 1)
        TestMode = true;

    CurrentTime = TimeCurrent();
    GMTShift = GetShiftGMT();
    StartDate = ReturnStartDate();
    CurrentPeriod = Period2Int(_Period);

    InitMarketInfo();

    ResetAll(1);
    InitIndicators(SYS_POINT);


    end_init();

    return 0;

}

int end_init() {

    if (LoadProject() < 0) {
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR LOAD PROJECT  ________________________________________________________________________");
    }
    ReadSessions(); // init sessions && load
    InitEngines();


    PG_Print(TYPE_INFO, "________________________________________________________________________ PROGRESS END INITIALISATION  ________________________________________________________________________");

    return (0);
}

int start() {

    if (ShouldExit == 1) {
    //    ExpertRemove ();
        return 0;
    }

    if (FirstPass == -1) {
        FirstPass = 1;
        PG_Print(TYPE_INFO, "________________________________________________________________________ PROGRESS START PROCESSING  ________________________________________________________________________");
        Send_Operation("PROGRESS START PROCESSING OK ON CURRENCY " + _Symbol);
    }

    int i = 0;
    GMTShift = GetShiftGMT();

    _Bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    _Ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);

    if (SymbolRunning == -1) {
        Print("Expert is running already on symbol " + SYS_SYMBOL);
        return (-1);
    }


    AccountMinFreeMargin = MathMin(AccountFreeMargin(), AccountMinFreeMargin);

    CurrentTime = TimeCurrent();


    ResetSignals();
    ResetRules(1);

//    AlertNews();


 //   IfShouldClose();

    for (i = (NBR_PERIODS - 1); i >= P_M1; i--)
        MarketMovement(i, FirstPass);

  
    //////////////////////////////////////////////////////////// MT4 Passage de parametres //////////////////////////////////////////////////////////////      

    for (i = (NBR_PERIODS - 1); i >= P_M1; i--)
        SetSystemObjects(i);

    //////////////////////////////////////////////////////////// MT4 Passage de parametres //////////////////////////////////////////////////////////////      

    AccountNbrLots = ReturnAccountNbrLots();
    
    TreatInRules();                     // engine to rule

    if (SecondPass) {
        TreatSystemRules();           // rules
    }

    TreatOutRules();                  // rules to engine  
    TreatEngines();

    if (GlobalComment)
        PG_Comment();

    for (i = 0; i < NBR_PERIODS; i++)
        TimeOpenBar[i] = iTime(NULL, PeriodIndex[i], 0);

    if (FirstPass == 0)
        SecondPass = 1;

    FirstPass = 0;

    return (0);
}

//+------------------------------------------------------------------+ END 

int deinit() {
    printf("PROGRESS END PROCESSING BYE BYE  **********************************************************************");
    PG_Print(TYPE_INFO, "________________________________________________________________________ PROGRESS END PROCESSING  ________________________________________________________________________");
    Send_Operation("PROGRESS END PROCESSING ON CURRENCY " + _Symbol);
    
    
    if (SymbolRunning != -1)
        FileClose(SymbolRunning);
    
    return (0);
}

int B_LoadSession(int magicNumber, int session) {

    B_FreeSession[session] = true;
    B_InitSession[session] = false;

    B_SellNbrTrade[session] = 0;
    B_BuyNbrTrade[session] = 0;
  
    return (session);
}

void ReadSessions() {
    for (int i = 0; i < B_MaxSessions; i++)
        B_LoadSession(B_IMagicNumber, i);
}
//=============================================LOGICAL  ========================================

int And(int a, int b = -1, int c = -1, int d = -1, int e = -1, int f = -1, int g = -1) {
    int result = 0;
    result |= (1 << a);
    if (b != -1) result |= (1 << b);
    if (c != -1) result |= (1 << c);
    if (d != -1) result |= (1 << d);
    if (e != -1) result |= (1 << e);
    if (f != -1) result |= (1 << f);
    if (g != -1) result |= (1 << g);
    return (result);
}

int Period2Int(int TmPeriod) {
    for (int i = 0; i < ArraySize(PeriodIndex); i++)
        if (PeriodIndex[i] == TmPeriod) return (i);
    return (0);
}

int SysObject2Index(string sobject) {
    for (int i = 0; i < O_NbrSysObject; i++)
        if (SysObjName[i] == StringTrimRight(sobject)) return (i);
    return (-1);
}

int IdObject2Index(int ObjectId) {
    for (int i = 0; i < O_NbrObject; i++)
        if (ObjId[i] == ObjectId) return (i);
    return (-1);
}

int Object2Id(string sobject) {
    for (int i = 0; i < O_NbrObject; i++)
        if (ObjName[i] == StringTrimRight(sobject)) return (ObjId[i]);
    return (-1);
}

int Object2Index(string sobject) {
    for (int i = 0; i < O_NbrObject; i++)
        if (ObjName[i] == StringTrimRight(sobject)) return (i);
    return (-1);
}

int ObjType2Int(string sobjtype) {
    for (int i = 0; i < ArraySize(ObjTypeName); i++)
        if (StringFind(ObjTypeName[i], StringTrimRight(sobjtype)) != -1) return (i);
    return (-1);
}

string ObjectId2Name(int objid) {
    for (int i = 0; i < O_NbrObject; i++)
        if (ObjId[i] == objid) return (ObjName[i]);
    return ("");
}

int Signal2Int(string ssignal) {
    for (int i = 0; i < ArraySize(SignalName); i++)
        if (StringFind(SignalName[i], StringTrimRight(ssignal)) != -1) return (i);
    return (-1);
}

int Mode2Int(string smode) {
    for (int i = 0; i < ArraySize(RecoveryModeName); i++)
        if (RecoveryModeName[i] == StringTrimRight(smode)) return (i);
    return (-1);
}

int Rule2Int(string srule) {
    for (int i = 0; i < ArraySize(RuleName); i++)
        if (RuleName[i] == StringTrimRight(srule)) return (i);
    return (-1);
}

int Direction2Int(string sdirection) {
    for (int i = 0; i < ArraySize(DirectionName); i++)
        if (DirectionName[i] == StringTrimRight(sdirection)) return (i);
    return (-1);
}
int DirectionType2Int(string sdirection) {
    for (int i = 0; i < ArraySize(DirectionTypeName); i++)
        if (DirectionTypeName[i] == StringTrimRight(sdirection)) return (i);
    return (-1);
}

int ExitMode2Int(string sexit) {
    for (int i = 0; i < ArraySize(ExitModeName); i++)
        if (ExitModeName[i] == StringTrimRight(sexit)) return (i);
    return (-1);
}

int Operation2Int(string soperation) {
    for (int i = 0; i < ArraySize(OperationName); i++)
        if (OperationName[i] == StringTrimRight(soperation)) return (i);
    return (-1);
}

int Op2Int(string soperation) {
    for (int i = 0; i < ArraySize(OpName); i++)
        if (OpName[i] == StringTrimRight(soperation)) return (i);
    return (-1);
}

int OrderType2Int(string stype) {
    for (int i = 0; i < ArraySize(OrderTypeName); i++)
        if (OrderTypeName[i] == StringTrimRight(stype)) return (i);
    return (-1);
}

//=========================================RULES FUNCTIONS============================================================

bool AndR(int Operation, int OperationType, int rule, int rule1 = -1, int rule2 = -1, int rule3 = -1, int rule4 = -1, int rule5 = -1) {
    int result = 0;
    result |= (1 << rule);
    if (rule1 != -1) result |= (1 << rule1);
    if (rule2 != -1) result |= (1 << rule2);
    if (rule3 != -1) result |= (1 << rule3);
    if (rule4 != -1) result |= (1 << rule4);
    if (rule5 != -1) result |= (1 << rule5);
    return ((RuleTab[Operation][OperationType] & result) == result);
}

bool OrR(int Operation, int OperationType, int rule, int rule1 = -1, int rule2 = -1, int rule3 = -1, int rule4 = -1, int rule5 = -1) {
    int result = 0;
    result |= (1 << rule);
    if (rule1 != -1) result |= (1 << rule1);
    if (rule2 != -1) result |= (1 << rule2);
    if (rule3 != -1) result |= (1 << rule3);
    if (rule4 != -1) result |= (1 << rule4);
    if (rule5 != -1) result |= (1 << rule5);
    return ((RuleTab[Operation][OperationType] & result) != 0);
}

bool AndCR(int Operation, int OperationType, int rule) {
    return ((RuleTab[Operation][OperationType] & rule) == rule);
}

bool OrCR(int Operation, int OperationType, int rule) {
    return ((RuleTab[Operation][OperationType] & rule) != 0);
}

int Get_Rule(int Operation, int OperationType, int rule) {
    return (RuleTab[Operation][OperationType] & (1 << rule));
}

int Get_Previous_Rule(int Operation, int OperationType, int rule) {
    return (BeforeRuleTab[Operation][OperationType] & (1 << rule));
}

double Get_Previous_Filter_Value(int Operation, int OperationType, int rule) {
    return (BeforeRuleTabValue[Operation][OperationType][rule]);
}

void SetRuleFilter(int add, int Operation, int OperationType, int rule) {
    int i, j;
    if (rule == -1)
        for (int x = 0; x < NBR_RULES; x++)
            if (OperationType == -1)
                if (Operation == -1)
                    for (i = 0; i < NBR_OPERATIONS; i++)
                        for (j = 0; j < NBR_FIELDS; j++)
                            RuleFilterTab[i][j][x] = add;
                else
                    for (j = 0; j < NBR_FIELDS; j++)
                        RuleFilterTab[Operation][j][x] = add;
    else
    if (Operation == -1)
        for (i = 0; i < NBR_OPERATIONS; i++)
            RuleFilterTab[i][OperationType][x] = add;
    else
        RuleFilterTab[Operation][OperationType][x] = add;
    else
    if (OperationType == -1)
        if (Operation == -1)
            for (i = 0; i < NBR_OPERATIONS; i++)
                for (j = 0; j < NBR_FIELDS; j++)
                    RuleFilterTab[i][j][rule] = add;
        else
            for (j = 0; j < NBR_FIELDS; j++)
                RuleFilterTab[Operation][j][rule] = add;
    else
        RuleFilterTab[Operation][OperationType][rule] = add;
}

void ResetRuleFilters() {
    for (int i = 0; i < NBR_OPERATIONS; i++)
        for (int j = 0; j < NBR_FIELDS; j++)
            for (int x = 0; x < NBR_RULES; x++)
                RuleFilterTab[i][j][x] = 0;
}

int GetRuleFilter(int Operation, int OperationType, int rule) {
    return (RuleFilterTab[Operation][OperationType][rule]);
}

//========================================SIGNALS FUNCTIONS============================================================

int AndS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) export {
    int result = 0;
    if (period != -1) result |= (1 << period);
    if (period1 != -1) result |= (1 << period1);
    if (period2 != -1) result |= (1 << period2);
    if (period3 != -1) result |= (1 << period3);
    if (period4 != -1) result |= (1 << period4);
    if (period5 != -1) result |= (1 << period5);
    if (period6 != -1) result |= (1 << period6);
    if (period7 != -1) result |= (1 << period7);
    if (period8 != -1) result |= (1 << period8);

    return ((SignalTab[Object][signaltype] & result) == result ? SignalTab[Object][signaltype] & result : 0);
}

int AndPS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) export {
    int result = 0;
    if (period != -1) result |= (1 << period);
    if (period1 != -1) result |= (1 << period1);
    if (period2 != -1) result |= (1 << period2);
    if (period3 != -1) result |= (1 << period3);
    if (period4 != -1) result |= (1 << period4);
    if (period5 != -1) result |= (1 << period5);
    if (period6 != -1) result |= (1 << period6);
    if (period7 != -1) result |= (1 << period7);
    if (period8 != -1) result |= (1 << period8);

    return ((BeforeSignalTab[Object][signaltype] & result) == result ? BeforeSignalTab[Object][signaltype] & result : 0);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
double RValue(int Operation, int OperationType, int rule) {
    return (RuleTabValue[Operation][OperationType][rule]);
}

void Set_Rule_Value(int Operation, int OperationType, int rule, double Value) {
    RuleTabValue[Operation][OperationType][rule] = Value;
}

void Set_Rule(int Operation, int OperationType, int rule, int signal, double value = -1) {
    if (signal == P_SIGNAL)
        RuleTab[Operation][OperationType] |= (1 << rule);
    else
        RuleTab[Operation][OperationType] &= ~(1 << rule);

    Set_Rule_Value(Operation, OperationType, rule, value);
}

double SValue(int Object, int signaltype, int period) {
    return (SignalTabValue[Object][signaltype][period]);
}

/////////////////////////////////////////////////////  VALUE //////////////////////////////////////////////////////////////////////

double MaxV(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    double result = -EMPTY_VALUE;
    if (period != -1) result = SValue(Object, signaltype, period);
    if (period1 != -1) result = MathMax(result, SValue(Object, signaltype, period1));
    if (period2 != -1) result = MathMax(result, SValue(Object, signaltype, period2));
    if (period3 != -1) result = MathMax(result, SValue(Object, signaltype, period3));
    if (period4 != -1) result = MathMax(result, SValue(Object, signaltype, period4));
    if (period5 != -1) result = MathMax(result, SValue(Object, signaltype, period5));
    if (period6 != -1) result = MathMax(result, SValue(Object, signaltype, period6));
    if (period7 != -1) result = MathMax(result, SValue(Object, signaltype, period7));
    if (period8 != -1) result = MathMax(result, SValue(Object, signaltype, period8));

    return (result);

}

double MinV(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    double result = EMPTY_VALUE;
    if (period != -1) result = SValue(Object, signaltype, period);
    if (period1 != -1) result = MathMin(result, SValue(Object, signaltype, period1));
    if (period2 != -1) result = MathMin(result, SValue(Object, signaltype, period2));
    if (period3 != -1) result = MathMin(result, SValue(Object, signaltype, period3));
    if (period4 != -1) result = MathMin(result, SValue(Object, signaltype, period4));
    if (period5 != -1) result = MathMin(result, SValue(Object, signaltype, period5));
    if (period6 != -1) result = MathMin(result, SValue(Object, signaltype, period6));
    if (period7 != -1) result = MathMin(result, SValue(Object, signaltype, period7));
    if (period8 != -1) result = MathMin(result, SValue(Object, signaltype, period8));

    return (result);

}

double MaxPV(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    double result = -EMPTY_VALUE;
    if (period != -1) result = SPValue(Object, signaltype, period);
    if (period1 != -1) result = MathMax(result, SPValue(Object, signaltype, period1));
    if (period2 != -1) result = MathMax(result, SPValue(Object, signaltype, period2));
    if (period3 != -1) result = MathMax(result, SPValue(Object, signaltype, period3));
    if (period4 != -1) result = MathMax(result, SPValue(Object, signaltype, period4));
    if (period5 != -1) result = MathMax(result, SPValue(Object, signaltype, period5));
    if (period6 != -1) result = MathMax(result, SPValue(Object, signaltype, period6));
    if (period7 != -1) result = MathMax(result, SPValue(Object, signaltype, period7));
    if (period8 != -1) result = MathMax(result, SPValue(Object, signaltype, period8));

    return (result);

}
double MinPV(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    double result = EMPTY_VALUE;
    if (period != -1) result = SPValue(Object, signaltype, period);
    if (period1 != -1) result = MathMin(result, SPValue(Object, signaltype, period1));
    if (period2 != -1) result = MathMin(result, SPValue(Object, signaltype, period2));
    if (period3 != -1) result = MathMin(result, SPValue(Object, signaltype, period3));
    if (period4 != -1) result = MathMin(result, SPValue(Object, signaltype, period4));
    if (period5 != -1) result = MathMin(result, SPValue(Object, signaltype, period5));
    if (period6 != -1) result = MathMin(result, SPValue(Object, signaltype, period6));
    if (period7 != -1) result = MathMin(result, SPValue(Object, signaltype, period7));
    if (period8 != -1) result = MathMin(result, SPValue(Object, signaltype, period8));

    return (result);

}

int AndS_G(int Object1, int Object2, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object1, signaltype, period) > SValue(Object2, signaltype, period));
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = (SValue(Object1, signaltype, period1) > SValue(Object2, signaltype, period1));
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = (SValue(Object1, signaltype, period2) > SValue(Object2, signaltype, period2));
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = (SValue(Object1, signaltype, period3) > SValue(Object2, signaltype, period3));
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = (SValue(Object1, signaltype, period4) > SValue(Object2, signaltype, period4));
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = (SValue(Object1, signaltype, period5) > SValue(Object2, signaltype, period5));
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = (SValue(Object1, signaltype, period6) > SValue(Object2, signaltype, period6));
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = (SValue(Object1, signaltype, period7) > SValue(Object2, signaltype, period7));
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = (SValue(Object1, signaltype, period8) > SValue(Object2, signaltype, period8));
        if (result) rperiod |= (1 << period8);
    }
    return ((result) ? rperiod : 0);
}

int AndS_L(int Object1, int Object2, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object1, signaltype, period) < SValue(Object2, signaltype, period));
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = (SValue(Object1, signaltype, period1) < SValue(Object2, signaltype, period1));
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = (SValue(Object1, signaltype, period2) < SValue(Object2, signaltype, period2));
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = (SValue(Object1, signaltype, period3) < SValue(Object2, signaltype, period3));
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = (SValue(Object1, signaltype, period4) < SValue(Object2, signaltype, period4));
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = (SValue(Object1, signaltype, period5) < SValue(Object2, signaltype, period5));
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = (SValue(Object1, signaltype, period6) < SValue(Object2, signaltype, period6));
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = (SValue(Object1, signaltype, period7) < SValue(Object2, signaltype, period7));
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = (SValue(Object1, signaltype, period8) < SValue(Object2, signaltype, period8));
        if (result) rperiod |= (1 << period8);
    }
    return ((result) ? rperiod : 0);
}

int AndS_G_AndPS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) > SPValue(Object, signaltype, period));
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = (SValue(Object, signaltype, period1) > SPValue(Object, signaltype, period1));
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = (SValue(Object, signaltype, period2) > SPValue(Object, signaltype, period2));
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = (SValue(Object, signaltype, period3) > SPValue(Object, signaltype, period3));
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = (SValue(Object, signaltype, period4) > SPValue(Object, signaltype, period4));
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = (SValue(Object, signaltype, period5) > SPValue(Object, signaltype, period5));
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = (SValue(Object, signaltype, period6) > SPValue(Object, signaltype, period6));
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = (SValue(Object, signaltype, period7) > SPValue(Object, signaltype, period7));
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = (SValue(Object, signaltype, period8) > SPValue(Object, signaltype, period8));
        if (result) rperiod |= (1 << period8);
    }
    return ((result) ? rperiod : 0);
}

int AndS_L_AndPS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) < SPValue(Object, signaltype, period));
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = (SValue(Object, signaltype, period1) < SPValue(Object, signaltype, period1));
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = (SValue(Object, signaltype, period2) < SPValue(Object, signaltype, period2));
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = (SValue(Object, signaltype, period3) < SPValue(Object, signaltype, period3));
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = (SValue(Object, signaltype, period4) < SPValue(Object, signaltype, period4));
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = (SValue(Object, signaltype, period5) < SPValue(Object, signaltype, period5));
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = (SValue(Object, signaltype, period6) < SPValue(Object, signaltype, period6));
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = (SValue(Object, signaltype, period7) < SPValue(Object, signaltype, period7));
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = (SValue(Object, signaltype, period7) < SPValue(Object, signaltype, period8));
        if (result) rperiod |= (1 << period8);
    }
    return ((result) ? rperiod : 0);
}

int AndV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) == value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SValue(Object, signaltype, period1) == value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SValue(Object, signaltype, period2) == value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SValue(Object, signaltype, period3) == value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SValue(Object, signaltype, period4) == value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SValue(Object, signaltype, period5) == value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SValue(Object, signaltype, period6) == value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SValue(Object, signaltype, period7) == value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SValue(Object, signaltype, period8) == value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) < value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SValue(Object, signaltype, period1) < value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SValue(Object, signaltype, period2) < value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SValue(Object, signaltype, period3) < value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SValue(Object, signaltype, period4) < value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SValue(Object, signaltype, period5) < value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SValue(Object, signaltype, period6) < value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SValue(Object, signaltype, period7) < value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SValue(Object, signaltype, period8) < value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) <= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SValue(Object, signaltype, period1) <= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SValue(Object, signaltype, period2) <= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SValue(Object, signaltype, period3) <= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SValue(Object, signaltype, period4) <= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SValue(Object, signaltype, period5) <= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SValue(Object, signaltype, period6) <= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SValue(Object, signaltype, period7) <= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SValue(Object, signaltype, period8) <= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) > value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SValue(Object, signaltype, period1) > value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SValue(Object, signaltype, period2) > value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SValue(Object, signaltype, period3) > value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SValue(Object, signaltype, period4) > value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SValue(Object, signaltype, period5) > value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SValue(Object, signaltype, period6) > value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SValue(Object, signaltype, period7) > value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SValue(Object, signaltype, period8) > value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) >= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SValue(Object, signaltype, period1) >= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SValue(Object, signaltype, period2) >= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SValue(Object, signaltype, period3) >= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SValue(Object, signaltype, period4) >= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SValue(Object, signaltype, period5) >= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SValue(Object, signaltype, period6) >= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SValue(Object, signaltype, period7) >= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SValue(Object, signaltype, period8) >= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int AndPV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) == value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SPValue(Object, signaltype, period1) == value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SPValue(Object, signaltype, period2) == value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SPValue(Object, signaltype, period3) == value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SPValue(Object, signaltype, period4) == value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SPValue(Object, signaltype, period5) == value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SPValue(Object, signaltype, period6) == value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SPValue(Object, signaltype, period7) == value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SPValue(Object, signaltype, period8) == value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndPV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) < value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SPValue(Object, signaltype, period1) < value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SPValue(Object, signaltype, period2) < value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SPValue(Object, signaltype, period3) < value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SPValue(Object, signaltype, period4) < value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SPValue(Object, signaltype, period5) < value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SPValue(Object, signaltype, period6) < value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SPValue(Object, signaltype, period7) < value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SPValue(Object, signaltype, period8) < value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndPV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) <= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SPValue(Object, signaltype, period1) <= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SPValue(Object, signaltype, period2) <= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SPValue(Object, signaltype, period3) <= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SPValue(Object, signaltype, period4) <= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SPValue(Object, signaltype, period5) <= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SPValue(Object, signaltype, period6) <= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SPValue(Object, signaltype, period7) <= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SPValue(Object, signaltype, period8) <= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndPV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) > value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SPValue(Object, signaltype, period1) > value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SPValue(Object, signaltype, period2) > value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SPValue(Object, signaltype, period3) > value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SPValue(Object, signaltype, period4) > value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SPValue(Object, signaltype, period5) > value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SPValue(Object, signaltype, period6) > value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SPValue(Object, signaltype, period7) > value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SPValue(Object, signaltype, period8) > value);
        if (result) rperiod |= (1 << period8);
    } {}
    return ((result) ? rperiod : 0);
}

int AndPV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 1;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) >= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result && (SPValue(Object, signaltype, period1) >= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result && (SPValue(Object, signaltype, period2) >= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result && (SPValue(Object, signaltype, period3) >= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result && (SPValue(Object, signaltype, period4) >= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result && (SPValue(Object, signaltype, period5) >= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result && (SPValue(Object, signaltype, period6) >= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result && (SPValue(Object, signaltype, period7) >= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result && (SPValue(Object, signaltype, period8) >= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int OrV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) == value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SValue(Object, signaltype, period1) == value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SValue(Object, signaltype, period2) == value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SValue(Object, signaltype, period3) == value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SValue(Object, signaltype, period4) == value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SValue(Object, signaltype, period5) == value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SValue(Object, signaltype, period6) == value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SValue(Object, signaltype, period7) == value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SValue(Object, signaltype, period8) == value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int OrV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) < value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SValue(Object, signaltype, period1) < value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SValue(Object, signaltype, period2) < value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SValue(Object, signaltype, period3) < value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SValue(Object, signaltype, period4) < value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SValue(Object, signaltype, period5) < value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SValue(Object, signaltype, period6) < value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SValue(Object, signaltype, period7) < value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SValue(Object, signaltype, period8) < value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int OrV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) <= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SValue(Object, signaltype, period1) <= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SValue(Object, signaltype, period2) <= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SValue(Object, signaltype, period3) <= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SValue(Object, signaltype, period4) <= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SValue(Object, signaltype, period5) <= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SValue(Object, signaltype, period6) <= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SValue(Object, signaltype, period7) <= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SValue(Object, signaltype, period8) <= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int OrV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) > value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SValue(Object, signaltype, period1) > value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SValue(Object, signaltype, period2) > value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SValue(Object, signaltype, period3) > value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SValue(Object, signaltype, period4) > value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SValue(Object, signaltype, period5) > value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SValue(Object, signaltype, period6) > value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SValue(Object, signaltype, period7) > value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SValue(Object, signaltype, period8) > value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int OrV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SValue(Object, signaltype, period) >= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SValue(Object, signaltype, period1) >= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SValue(Object, signaltype, period2) >= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SValue(Object, signaltype, period3) >= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SValue(Object, signaltype, period4) >= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SValue(Object, signaltype, period5) >= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SValue(Object, signaltype, period6) >= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SValue(Object, signaltype, period7) >= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SValue(Object, signaltype, period8) >= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int OrPV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) == value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SPValue(Object, signaltype, period1) == value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SPValue(Object, signaltype, period2) == value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SPValue(Object, signaltype, period3) == value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SPValue(Object, signaltype, period4) == value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SPValue(Object, signaltype, period5) == value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SPValue(Object, signaltype, period6) == value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SPValue(Object, signaltype, period7) == value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SPValue(Object, signaltype, period8) == value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int OrPV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) < value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SPValue(Object, signaltype, period1) < value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SPValue(Object, signaltype, period2) < value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SPValue(Object, signaltype, period3) < value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SPValue(Object, signaltype, period4) < value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SPValue(Object, signaltype, period5) < value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SPValue(Object, signaltype, period6) < value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SPValue(Object, signaltype, period7) < value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SPValue(Object, signaltype, period8) < value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int OrPV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) <= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SPValue(Object, signaltype, period1) <= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SPValue(Object, signaltype, period2) <= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SPValue(Object, signaltype, period3) <= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SPValue(Object, signaltype, period4) <= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SPValue(Object, signaltype, period5) <= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SPValue(Object, signaltype, period6) <= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SPValue(Object, signaltype, period7) <= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SPValue(Object, signaltype, period8) <= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int OrPV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) > value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SPValue(Object, signaltype, period1) > value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SPValue(Object, signaltype, period2) > value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SPValue(Object, signaltype, period3) > value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SPValue(Object, signaltype, period4) > value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SPValue(Object, signaltype, period5) > value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SPValue(Object, signaltype, period6) > value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SPValue(Object, signaltype, period7) > value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SPValue(Object, signaltype, period8) > value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}
int OrPV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    bool result = 0;
    int rperiod = 0;
    if (period != -1) {
        result = (SPValue(Object, signaltype, period) >= value);
        if (result) rperiod |= (1 << period);
    }
    if (period1 != -1) {
        result = result || (SPValue(Object, signaltype, period1) >= value);
        if (result) rperiod |= (1 << period1);
    }
    if (period2 != -1) {
        result = result || (SPValue(Object, signaltype, period2) >= value);
        if (result) rperiod |= (1 << period2);
    }
    if (period3 != -1) {
        result = result || (SPValue(Object, signaltype, period3) >= value);
        if (result) rperiod |= (1 << period3);
    }
    if (period4 != -1) {
        result = result || (SPValue(Object, signaltype, period4) >= value);
        if (result) rperiod |= (1 << period4);
    }
    if (period5 != -1) {
        result = result || (SPValue(Object, signaltype, period5) >= value);
        if (result) rperiod |= (1 << period5);
    }
    if (period6 != -1) {
        result = result || (SPValue(Object, signaltype, period6) >= value);
        if (result) rperiod |= (1 << period6);
    }
    if (period7 != -1) {
        result = result || (SPValue(Object, signaltype, period7) >= value);
        if (result) rperiod |= (1 << period7);
    }
    if (period8 != -1) {
        result = result || (SPValue(Object, signaltype, period8) >= value);
        if (result) rperiod |= (1 << period8);
    }

    return ((result) ? rperiod : 0);
}

int AndBV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndBV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndBV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndBV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndBV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}

bool OrBV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrBV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrBV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrBV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrBV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}

//TICK
bool AndTV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndTV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndTV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndTV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool AndTV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !AndPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}

bool OrTV_Eq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrTV_LEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrTV_L(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrTV_G(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
bool OrTV_GEq(int Object, int signaltype, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (OrV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) &&
        !OrPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}

int AngleAbove(int Object, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_G(Object, S_ANGLE, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}

int AngleBelow(int Object, double value, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    return (AndV_L(Object, S_ANGLE, value, period, period1, period2, period3, period4, period5, period6, period7, period8));
}
int AngleDivergence(int Object, int period) {
    return ((AndS(Object, S_UP, period) && AngleBelow(Object, 0, period)) ||
        (AndS(Object, S_DOWN, period) && AngleAbove(Object, 0, period)));
}

////////////////////////////////////////////////////////// END VALUE ///////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////BOOLEAN ////////////////////////////////////////////////////

int AndPTS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = 0;
    if (period != -1) result |= (1 << period);
    if (period1 != -1) result |= (1 << period1);
    if (period2 != -1) result |= (1 << period2);
    if (period3 != -1) result |= (1 << period3);
    if (period4 != -1) result |= (1 << period4);
    if (period5 != -1) result |= (1 << period5);
    if (period6 != -1) result |= (1 << period6);
    if (period7 != -1) result |= (1 << period7);
    if (period8 != -1) result |= (1 << period8);

    return ((BeforeSignalTickTab[Object][signaltype] & result) == result ? BeforeSignalTickTab[Object][signaltype] & result : 0);
}

int OrS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = 0;
    if (period != -1) result |= (1 << period);
    if (period1 != -1) result |= (1 << period1);
    if (period2 != -1) result |= (1 << period2);
    if (period3 != -1) result |= (1 << period3);
    if (period4 != -1) result |= (1 << period4);
    if (period5 != -1) result |= (1 << period5);
    if (period6 != -1) result |= (1 << period6);
    if (period7 != -1) result |= (1 << period7);
    if (period8 != -1) result |= (1 << period8);

    return ((SignalTab[Object][signaltype] & result) != 0 ? SignalTab[Object][signaltype] & result : 0);
}

int OrPS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = 0;
    if (period != -1) result |= (1 << period);
    if (period1 != -1) result |= (1 << period1);
    if (period2 != -1) result |= (1 << period2);
    if (period3 != -1) result |= (1 << period3);
    if (period4 != -1) result |= (1 << period4);
    if (period5 != -1) result |= (1 << period5);
    if (period6 != -1) result |= (1 << period6);
    if (period7 != -1) result |= (1 << period7);
    if (period8 != -1) result |= (1 << period8);

    return ((BeforeSignalTab[Object][signaltype] & result) != 0 ? BeforeSignalTab[Object][signaltype] & result : 0);
}

int OrPTS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = 0;
    if (period != -1) result |= (1 << period);
    if (period1 != -1) result |= (1 << period1);
    if (period2 != -1) result |= (1 << period2);
    if (period3 != -1) result |= (1 << period3);
    if (period4 != -1) result |= (1 << period4);
    if (period5 != -1) result |= (1 << period5);
    if (period6 != -1) result |= (1 << period6);
    if (period7 != -1) result |= (1 << period7);
    if (period8 != -1) result |= (1 << period8);

    return ((BeforeSignalTickTab[Object][signaltype] & result) != 0 ? BeforeSignalTickTab[Object][signaltype] & result : 0);
}

int AndTS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = AndS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
    return ((result && !AndPTS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0);
}

int AndBS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = AndS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
    return ((result && !AndPS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0);
}

int OrTS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = OrS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
    return ((result && !OrPTS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0);
}

int OrBS(int Object, int signaltype, int period, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1, int period7 = -1, int period8 = -1) {
    int result = OrS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
    return ((result && !OrPS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0);
}

int All(int Object, int signaltype, int period1 = -1, int period2 = -1, int period3 = -1, int period4 = -1, int period5 = -1, int period6 = -1) {
    int result = MathMod(SignalTab[Object][signaltype], 256); // month
    result = MathMod(result, 128); // week
    result = MathMod(result, 64); // day

    if (period1 != -1) result = MathMod(result, period1);
    if (period2 != -1) result = MathMod(result, period2);
    if (period3 != -1) result = MathMod(result, period3);
    if (period4 != -1) result = MathMod(result, period4);
    if (period5 != -1) result = MathMod(result, period5);
    if (period6 != -1) result = MathMod(result, period6);

    return (result);
}

int All_s(int Object, int signaltype, int period1 = -1, int period2 = -1, int period3 = -1) {
    int result = MathMod(SignalTab[Object][signaltype], 256); // month
    result = MathMod(result, 128);
    result = MathMod(result, 64);
    result = MathMod(result, 32);
    result = MathMod(result, 16);
    result = MathMod(result, 8);

    if (period1 != -1) result = MathMod(result, period1);
    if (period2 != -1) result = MathMod(result, period2);
    if (period3 != -1) result = MathMod(result, period3);
    return (result);
}

void SETSIGNAL(int shift, int Object, int signaltype, int period, int signal, double value = -1) {
    if (shift == 0)
        Set_Signal(Object, signaltype, period, signal, value);
    else
        Set_Previous_Signal(Object, signaltype, period, signal, value);
}

void Set_Signal(int Object, int signaltype, int period, int signal, double value = -1) {
    if (signal == P_SIGNAL) {
        SignalTab[Object][signaltype] |= (1 << period);
        if (!AndPTS(Object, signaltype, period)) {
            Set_Signal_Time(Object, signaltype, period, TimeCurrent());
            Set_Signal_Price(Object, signaltype, period, _Bid);
        }
    } else {
        SignalTab[Object][signaltype] &= ~(1 << period);
        if (AndPTS(Object, signaltype, period)) {
            Set_Signal_Time(Object, signaltype, period, -1);
            Set_Signal_Price(Object, signaltype, period, -1);
        }
    }
    if (value != -1)
        Set_Signal_Value(Object, signaltype, period, value);
}

int Get_Signal(int Object, int signaltype, int period) {
    return (SignalTab[Object][signaltype] & (1 << period));
}

void Set_Previous_Signal(int Object, int signaltype, int period, int signal, double value = -1) {
    if (signal == P_SIGNAL)
        BeforeSignalTab[Object][signaltype] |= (1 << period);
    else
        BeforeSignalTab[Object][signaltype] &= ~(1 << period);
    if (value != -1)
        Set_Previous_Signal_Value(Object, signaltype, period, value);
}

int Get_Previous_Signal(int Object, int signaltype, int period) {
    return (BeforeSignalTab[Object][signaltype] & (1 << period));
}

void Set_Signal_Value(int Object, int signaltype, int period, double Value) {
    SignalTabValue[Object][signaltype][period] = Value;
}

void Set_Signal_Time(int Object, int signaltype, int period, double Value) {
    SignalTabTime[Object][signaltype][period] = Value;
}

void Set_Signal_Price(int Object, int signaltype, int period, double Value) {
    SignalTabPrice[Object][signaltype][period] = Value;
}

void Set_Previous_Signal_Value(int Object, int signaltype, int period, double Value) {
    BeforeSignalTabValue[Object][signaltype][period] = Value;
}

double SPValue(int Object, int signaltype, int period) {
    return (BeforeSignalTabValue[Object][signaltype][period]);
}

datetime STime(int Object, int signaltype, int period) {
    return (SignalTabTime[Object][signaltype][period]);
}

datetime SPTime(int Object, int signaltype, int period) {
    return (BeforeSignalTabTime[Object][signaltype][period]);
}

double SPrice(int Object, int signaltype, int period) {
    return (SignalTabPrice[Object][signaltype][period]);
}

double SPPrice(int Object, int signaltype, int period) {
    return (BeforeSignalTabPrice[Object][signaltype][period]);
}

void SetSignalFilter(int add, int Object, int signaltype, int periode, datetime interval = -1) {
    int j;
    if (add == -1) {
        ResetSignalFilters();
        return;
    }
    if (add == -2) {
        ResetSignalFilters();
        add = 1;
    }
    if (periode == -1) {
        for (int x = 0; x < NBR_PERIODS; x++)
            if (signaltype == -1)
                for (j = 0; j < NBR_SIGNALS; j++) {
                    SignalFilterTab[Object][j][x] = add;
                    if (interval == -1) SignalFilterTabTime[Object][j][x] = 5 * 60; // seconds
                    else SignalFilterTabTime[Object][j][x] = interval;
                }
        else {
            SignalFilterTab[Object][signaltype][x] = add;
            if (interval == -1) SignalFilterTabTime[Object][signaltype][x] = 5 * 60; // seconds
            else SignalFilterTabTime[Object][signaltype][x] = interval;
        }
    } else {
        if (signaltype == -1)
            for (j = 0; j < NBR_SIGNALS; j++) {
                SignalFilterTab[Object][j][periode] = add;
                if (interval == -1) SignalFilterTabTime[Object][j][periode] = 5 * 60; // seconds
                else SignalFilterTabTime[Object][j][periode] = interval;

            }
        else {
            SignalFilterTab[Object][signaltype][periode] = add;
            if (interval == -1) SignalFilterTabTime[Object][signaltype][periode] = 5 * 60; // seconds
            else SignalFilterTabTime[Object][signaltype][periode] = interval;

        }
    }
}

int GetSignalFilter(int Object, int signaltype, int period) {
    return (SignalFilterTab[Object][signaltype][period]);
}

//////////////////////////////////////////////////////////////// INDICATORS /////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////////SOUND



///////////////////////////////////////////////////////////////////////////////////////////////////////END SOUND

void IfShouldClose() {
    int i;
    int engine;
    int operation = -2;

    if (CloseNowAll == true) {
        operation = -1;
        CloseNowAll = false;
    } else
    if (CloseNowBuy == true) {
        operation = OP_BUY;
        CloseNowBuy = false;
    } else
    if (CloseNowSell == true) {
        operation = OP_SELL;
        CloseNowSell = false;
    }
    if (operation != -2)
        for (i = 0; i < B_MaxSessions; i++)
            if (B_FreeSession[i] == false) {
                B_ExitSession(i, operation);
                if (B_Operation[i] == OP_BUYSELL || operation == B_Operation[i]) {
                    engine = GetEngine(B_StartOnRule[i], B_Operation[i]);
                    Set_Engine(engine, B_STARTAUTOMATIC, P_NOSIGNAL); // if we close something no session get started automatically
                }
            }

    if (SuspendAll == true) {
        SuspendAllEngines(1);
        SuspendAll = false;
    }
    if (ResumeAll == true) {
        SuspendAllEngines(0);
        ResumeAll = false;
    }
}

//+------------------------------------------------------------------+


void MarketMovement(int x, int shift = 0) {
    //USED OBJECT

    FindHistoryBars(x); // before FindPivotPoints          
    FindPivotPoints(x, shift);
    FindVolume(x);
    FindHeikenAshi(x, shift);
    FindOpen(x, shift);
    FindClose(x, shift);
    FindHigh(x, shift);
    FindLow(x, shift);
    FindBar(x, shift);
    FindFractals(x);
    FindRS(x);
    FindFiboPoints(x);
    progress (x,  shift);

    for (int i = 0; i < O_NbrObject; i++) {

        //USED OBJECT

        if (TestMode && !ObjUsed[i]) continue;

        switch (ObjType[i]) {
        case MA_TYPE:
            ma(x, i, shift);
            break;
        case BOLLINGER_TYPE:
            bb(x, i, shift);
            break;
        case RSI_TYPE:
            rsi(x, i, shift);
            break;
        case CCI_TYPE:
            cci(x, i, shift);
            break;
        case ADX_TYPE:
            adx(x, i, shift);
            break;
        case WPR_TYPE:
            wpr(x, i, shift);
            break;
        case SAR_TYPE:
            sar(x, i, shift);
            break;
        case ATR_TYPE:
            atr(x, i, shift);
            break;
        case ICHIMOKU_TYPE:
            ichimoku(x, i);
            break;
        case MACD_TYPE:
            macd(x, i, shift);
            break;
        case STOCHASTIC_TYPE:
            stochastic(x, i, shift);
            break;
        case CUSTOM_TYPE:
            custom(x, i, shift);
            break;
        case PREDEFINED_TYPE:
            break;
        }
    }
    for (i = 0; i < O_NbrObject; i++) {
        for (int j = 0; j < NBR_SIGNALS; j++) {
            BSignalTab[ObjId[i]][j] = SignalTab[ObjId[i]][j] & ~BeforeSignalTab[ObjId[i]][j];
            TSignalTab[ObjId[i]][j] = SignalTab[ObjId[i]][j] & ~BeforeSignalTickTab[ObjId[i]][j];
        }

        //USED OBJECT
        if (TestMode && !ObjUsed[i]) continue;

        if (ObjCross[i] == "") continue;

        int CObjId = Object2Id(ObjCross[i]);
        if (CObjId == -1) continue;
        if (shift == 0) {
            if (SValue(ObjId[i], S_PREVIOUS, x) < SValue(CObjId, S_PREVIOUS, x) &&
                SValue(ObjId[i], S_CURRENT, x) > SValue(CObjId, S_CURRENT, x)) {
                SETSIGNAL(shift, ObjId[i], S_RCROSSED, x, P_SIGNAL, 1);
            } else
            if (SValue(ObjId[i], S_PREVIOUS, x) > SValue(CObjId, S_PREVIOUS, x) &&
                SValue(ObjId[i], S_CURRENT, x) < SValue(CObjId, S_CURRENT, x)) {
                SETSIGNAL(shift, ObjId[i], S_RCROSSED, x, P_SIGNAL, 0);
            }
        } else {
            if (SPValue(ObjId[i], S_PREVIOUS, x) < SPValue(CObjId, S_PREVIOUS, x) &&
                SPValue(ObjId[i], S_CURRENT, x) > SPValue(CObjId, S_CURRENT, x)) {
                SETSIGNAL(shift, ObjId[i], S_RCROSSED, x, P_SIGNAL, 1);
            } else
            if (SPValue(ObjId[i], S_PREVIOUS, x) > SPValue(CObjId, S_PREVIOUS, x) &&
                SPValue(ObjId[i], S_CURRENT, x) < SPValue(CObjId, S_CURRENT, x)) {
                SETSIGNAL(shift, ObjId[i], S_RCROSSED, x, P_SIGNAL, 0);
            }
        }

    }

}

//****************************************************************************************************************************************

void B_InitGraphics(int session) {
    ObjectCreate("box" + session, OBJ_RECTANGLE, 0, B_StartDate[session], B_Max[session], Time[0], B_Min[session]);
    ObjectSet("box" + session, OBJPROP_SCALE, 1.0);
    ObjectSet("box" + session, OBJPROP_BACK, true);
    ObjectSet("box" + session, OBJPROP_COLOR, C'35,35,35');

    ObjectCreate("borderbox" + session, OBJ_RECTANGLE, 0, B_StartDate[session], B_Max[session], Time[0], B_Min[session]);
    ObjectSet("borderbox" + session, OBJPROP_SCALE, 1.0);
    ObjectSet("borderbox" + session, OBJPROP_COLOR, Turquoise);
    ObjectSet("borderbox" + session, OBJPROP_BACK, false);

    ObjectCreate("smartline" + session, OBJ_TREND, 0, B_StartDate[session], 0);
    ObjectSet("smartline" + session, OBJPROP_COLOR, Pink);
    ObjectSet("smartline" + session, OBJPROP_WIDTH, 1);
    ObjectSet("smartline" + session, OBJPROP_RAY, false);

    ObjectCreate("sellaverageline" + session, OBJ_TREND, 0, B_StartDate[session], 0, Time[0], 0);
    ObjectSet("sellaverageline" + session, OBJPROP_COLOR, Tomato);
    ObjectSet("sellaverageline" + session, OBJPROP_WIDTH, 1);
    ObjectSet("sellaverageline" + session, OBJPROP_RAY, false);
    ObjectCreate("sellaveragelinetext" + session, OBJ_TEXT, 0, 0, 0, 0, 0);

    ObjectCreate("buyaverageline" + session, OBJ_TREND, 0, B_StartDate[session], 0, Time[0], 0);
    ObjectSet("buyaverageline" + session, OBJPROP_COLOR, DeepSkyBlue);
    ObjectSet("buyaverageline" + session, OBJPROP_WIDTH, 1);
    ObjectSet("buyaverageline" + session, OBJPROP_RAY, false);

    ObjectCreate("buyaveragelinetext" + session, OBJ_TEXT, 0, 0, 0, 0, 0);
    ObjectSet("buyaveragelinetext" + session, OBJPROP_BACK, false);

    ObjectCreate("hedgeline" + session, OBJ_TREND, 0, B_StartDate[session], 0);
    ObjectSet("hedgeline" + session, OBJPROP_COLOR, Red);
    ObjectSet("hedgeline" + session, OBJPROP_WIDTH, 2);
    ObjectSet("hedgeline" + session, OBJPROP_RAY, false);

    ObjectCreate("hedgelinetext" + session, OBJ_TEXT, 0, 0, 0, 0, 0);
}

int B_DrawGraphics(int session) {
    if (!GraphicMode) return 0;

    if (B_Operation[session] == OP_BUY)
        ObjectSet("borderbox" + session, OBJPROP_COLOR, Turquoise);
    else
    if (B_Operation[session] == OP_SELL)
        ObjectSet("borderbox" + session, OBJPROP_COLOR, Pink);
    else
    if (B_OrderType[session] == OT_HEDGE)
        ObjectSet("borderbox" + session, OBJPROP_COLOR, Gold);
    else
        ObjectSet("borderbox" + session, OBJPROP_COLOR, Lime);

    if (B_Hedged[session] == true) {
        ObjectSet("hedgeline" + session, OBJPROP_PRICE1, B_HedgeLine[session]);
        ObjectSet("hedgeline" + session, OBJPROP_TIME1, B_StartDate[session]);
        ObjectSet("hedgeline" + session, OBJPROP_PRICE2, B_HedgeLine[session]);
        ObjectSet("hedgeline" + session, OBJPROP_TIME2, Time[0]);

        ObjectSet("hedgelinetext" + session, OBJPROP_PRICE1, B_HedgeLine[session]);
        ObjectSet("hedgelinetext" + session, OBJPROP_TIME1, Time[25]);
        ObjectSetText("hedgelinetext" + session, "(" + DoubleToString(B_HedgeLine[session], _Digits) + ")", 7, "Arial", Red);
    } else {
        ObjectSet("hedgeline" + session, OBJPROP_PRICE2, 0);
        ObjectSet("hedgeline" + session, OBJPROP_PRICE1, 0);
        ObjectSet("hedgeline" + session, OBJPROP_TIME2, 0);
        ObjectSet("hedgelinetext" + session, OBJPROP_PRICE1, 0);
        ObjectSet("hedgelinetext" + session, OBJPROP_TIME1, 0);
    }

    ObjectSet("box" + session, OBJPROP_TIME2, Time[0]);
    ObjectSet("box" + session, OBJPROP_TIME1, B_StartDate[session]);
    ObjectSet("box" + session, OBJPROP_PRICE2, B_Min[session]);
    ObjectSet("box" + session, OBJPROP_PRICE1, B_Max[session]);
    ObjectSet("borderbox" + session, OBJPROP_TIME2, Time[0]);
    ObjectSet("borderbox" + session, OBJPROP_TIME1, B_StartDate[session]);
    ObjectSet("borderbox" + session, OBJPROP_PRICE2, B_Min[session]);
    ObjectSet("borderbox" + session, OBJPROP_PRICE1, B_Max[session]);

    if (B_KeepBuySell[session] == true)
        ObjectSet("box" + session, OBJPROP_WIDTH, 4);
    else
        ObjectSet("box" + session, OBJPROP_WIDTH, 1);

    if (!B_BuySellAutomatic[session]) {
        //        ObjectSet("box" + session, OBJPROP_COLOR, Red);
    }
    double lots;
    double distance = 0;

    if (B_SellProfit[session] < 0) {
        distance = -10 * SYS_POINT;
        lots = ((B_SellAveragePoint[session] - _Bid - distance) * B_SellNbrLots[session]) / distance;
    }

    ObjectSet("sellaverageline" + session, OBJPROP_PRICE2, B_SellAveragePoint[session]);
    ObjectSet("sellaverageline" + session, OBJPROP_PRICE1, B_SellAveragePoint[session]);
    ObjectSet("sellaverageline" + session, OBJPROP_TIME2, Time[0]);
    ObjectSet("sellaverageline" + session, OBJPROP_TIME1, B_StartDate[session]);

    ObjectSet("sellaveragelinetext" + session, OBJPROP_PRICE1, B_SellAveragePoint[session]);
    ObjectSet("sellaveragelinetext" + session, OBJPROP_TIME1, B_StartDate[session] + (Time[0] - B_StartDate[session]) / 2);
    ObjectSetText("sellaveragelinetext" + session, RuleName[B_StartOnRule[session]] + " - " + OperationName[B_Operation[session]] + " (" + DoubleToString(B_SellAveragePoint[session], _Digits) + " -- " + DoubleToString(lots, 2) + ")", 7, "Arial", LightGray);

    if (B_BuyProfit[session] < 0) {
        distance = 10 * SYS_POINT;
        lots = ((B_BuyAveragePoint[session] - _Ask - distance) * B_BuyNbrLots[session]) / distance;

    }

    ObjectSet("buyaverageline" + session, OBJPROP_PRICE2, B_BuyAveragePoint[session]);
    ObjectSet("buyaverageline" + session, OBJPROP_PRICE1, B_BuyAveragePoint[session]);
    ObjectSet("buyaverageline" + session, OBJPROP_TIME2, Time[0]);
    ObjectSet("buyaverageline" + session, OBJPROP_TIME1, B_StartDate[session]);

    ObjectSet("buyaveragelinetext" + session, OBJPROP_PRICE1, B_BuyAveragePoint[session]);
    ObjectSet("buyaveragelinetext" + session, OBJPROP_TIME1, B_StartDate[session] + (Time[0] - B_StartDate[session]) / 2);
    ObjectSetText("buyaveragelinetext" + session, RuleName[B_StartOnRule[session]] + " - " + OperationName[B_Operation[session]] + " (" + DoubleToString(B_BuyAveragePoint[session], _Digits) + " -- " + DoubleToString(lots, 2) + ")", 7, "Arial", LightGray);
    return 1;
}


    
string B_SaveInfo(int session, int withsessnbr = -1) {
    string save_info = "";
    string s = "";
    int i;
    // maximum 27 characters

    if (withsessnbr != -1) {
        s = s + session;
        for (i = StringLen(s); i < 2; i++) s = s + " ";
        save_info = save_info + s;
    }

    s = B_StartDate[session];    for (i = StringLen(s); i < 10; i++) s = s + " ";
    save_info = save_info + s;
    save_info = save_info + RuleName[B_StartOnRule[session]]; // Rule 1 character                         
    save_info = save_info + B_Operation[session];
    save_info = save_info + B_Direction[session];

    s = B_PipStep[session];     for (i = StringLen(s); i < 3; i++) s = s + " ";    s = StringSubstr(s, 0, 3);
    save_info = save_info + s;

    s = B_MaxCount[session];    for (i = StringLen(s); i < 2; i++) s = s + " ";    s = StringSubstr(s, 0, 2);
    save_info = save_info + s;
    save_info = save_info + RecoveryModeName[B_RecoveryMode[session]]; //1 char

    s = DoubleToString(B_RecoveryValue[session], 1);    for (i = StringLen(s); i < 3; i++) s = s + " ";    s = StringSubstr(s, 0, 3);
    save_info = save_info + s;
    save_info = save_info + B_HedgeMagnitude[session];
    save_info = save_info + B_OrderType[session];
    save_info = save_info + B_KeepBuySell[session];
    save_info = save_info + B_ExitMode[session];
    save_info = save_info + B_ExitBuy[session];
    save_info = save_info + B_ExitSell[session]; // 5 characters

    int boolsave = 0;

    if (B_BuySellAutomatic[session]) boolsave |= (1 << B_BUYSELLAUTOMATIC);
    if (B_ExitAutomatic[session]) boolsave |= (1 << B_EXITAUTOMATIC);
    if (B_HedgeAutomatic[session]) boolsave |= (1 << B_HEDGEAUTOMATIC);
    if (B_DeHedgeAutomatic[session]) boolsave |= (1 << B_DEHEDGEAUTOMATIC);

    save_info = save_info + boolsave;

    return (save_info); //32 char !!!! COMMENT DON'T FIT IT
}    

void B_ReadRemainingInfo(int session, string saveinfo, int start) {
    int from = start;           //30
    int i = 0;

    
    from = from + i;  i = 5; B_ILot[session] =               StrToDouble(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_MaxLot[session] =             StrToDouble(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_TimeStep[session] =           StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1; B_DirectionType[session] =      StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 1; B_OneOrderPerBar[session] =     StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 5; B_MaxTime[session] =            StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 5; B_MinProfit[session] =          StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_BuyMinProfit[session] =       StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_SellMinProfit[session] =      StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_TakeProfit[session] =         StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_TrailingStop[session] =       StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_StopLoss[session] =           StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_BuyTakeProfit[session] =      StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_BuyTrailingStop[session] =    StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_BuyStopLoss[session] =        StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_SellTakeProfit[session] =     StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_SellTrailingStop[session] =   StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 5; B_SellStopLoss[session] =       StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 3; B_BuyLotTP[session] =           StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 3; B_BuyLotTS[session] =           StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 3; B_BuyLotSL[session] =           StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 3; B_SellLotTP[session] =          StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 3; B_SellLotTS[session] =          StrToInteger(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 3; B_SellLotSL[session] =          StrToInteger(B_ReadSInfo(saveinfo, from, i));
}
string B_SaveRemainingInfo(int session) {
    string save_info = "";
    string s = "";    
    int j; 
    int i;
    
    i = 5; s = DoubleToString(B_ILot[session]);   for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s;  
    i = 5; s = DoubleToString(B_MaxLot[session]); for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s;   
    i = 5; s = B_TimeStep[session];               for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s;  
    i = 1; s = B_DirectionType[session];          for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s;  
    i = 1; s = B_OneOrderPerBar[session];         for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_MaxTime[session];                for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_MinProfit[session];              for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_BuyMinProfit[session];           for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_SellMinProfit[session];          for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_TakeProfit[session];             for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_TrailingStop[session];           for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_StopLoss[session];               for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_BuyTakeProfit[session];          for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_BuyTrailingStop[session];        for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_BuyStopLoss[session];            for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_SellTakeProfit[session];         for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_SellTrailingStop[session];       for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 5; s = B_SellStopLoss[session];           for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 3; s = B_BuyLotTP[session];               for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 3; s = B_BuyLotTS[session];               for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 3; s = B_BuyLotSL[session];               for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 3; s = B_SellLotTP[session];              for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 3; s = B_SellLotTS[session];              for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    i = 3; s = B_SellLotSL[session];              for (j = StringLen(s); j < i; j++) s = s + " ";   s = StringSubstr(s, 0, i);      save_info = save_info + s; 
    return (save_info);    
}
  


string B_ReadSInfo(string info, int Pos, int length) {
    return (StringSubstr(info, Pos, length));
}

int B_ProcessTrade(int session, double price, int mode, double Lots, double B_BuyLotSL, double B_BuyLotTP, double B_SellLotSL, double B_SellLotTP, int otype = -1) {
    int h_mode;
    string comment = "";
    int error;
    double PipStopLoss = 0;
    double PipTakeProfit = 0;
    double h_PipStopLoss = 0;
    double h_PipTakeProfit = 0;

    comment = B_SaveInfo(session);
    // Print ("saving vcomment : " + comment); 

    if (mode == OP_BUY ||
        mode == OP_BUYLIMIT ||
        mode == OP_BUYSTOP) {
        PipStopLoss = B_BuyLotSL;
        PipTakeProfit = B_BuyLotTP;
        h_PipStopLoss = B_SellLotSL;
        h_PipTakeProfit = B_SellLotTP;
    } else {
        PipStopLoss = B_SellLotSL;
        PipTakeProfit = B_SellLotTP;
        h_PipStopLoss = B_BuyLotSL;
        h_PipTakeProfit = B_BuyLotTP;
    }

    error = OrderTrade(price, mode, Lots, comment, B_MagicNumber[session], PipStopLoss, PipTakeProfit);
    if (error != 0 && error != -1) //error == -1 means stoploss or take profit error 
        return (error);

    if (B_BuySell[session] == true && otype != OT_MONO) {
        error = OrderTrade(price, !mode, Lots, comment, B_MagicNumber[session], h_PipStopLoss, h_PipTakeProfit);
        if (error != 0 && error != -1) //error == -1 means stoploss or take profit error 
            return (error);
    }

    if (mode != OP_BUY && mode != OP_SELL) return 0; // pending error finish treatment

    if (mode == OP_BUY) {
        B_LastOrderType[session] = OP_BUY;
        B_BuyNow[session] = false;
        B_LastBuyLot[session] = Lots;
    } else {
        B_LastOrderType[session] = OP_SELL;
        B_SellNow[session] = false;
        B_LastSellLot[session] = Lots;
    }
    B_LastLot[session] = Lots;
    B_LastOrderOpenTime[session] = CurrentTime;

    return (0);
}

int B_HedgeProcessTrade(int session, int operation, double StopLoss = -1) // operation = OP_BUY OP_SELL only
{
    int ticket, h_mode;
    double nbrlots = 0;
    double price;
    string comment = "";
    double SL = 0;
    int error;

    if (operation == OP_BUY) {
        h_mode = OP_SELL;
        nbrlots = B_HedgeMagnitude[session] * (B_BuyNbrLots[session] - B_SellHedgeNbrLots[session]);
    } else
    if (operation == OP_SELL) {
        h_mode = OP_BUY;
        nbrlots = B_HedgeMagnitude[session] * (B_SellNbrLots[session] - B_BuyHedgeNbrLots[session]);

    } else
        return (0);

    if (nbrlots <= 0) return (0);

    comment = B_SaveInfo(session);

    // buy lots of 1 ... 
    double tranche = 2;
    while (nbrlots > 0.00001) {
        if (h_mode == OP_BUY) {
            price = _Ask;
            if (StopLoss != -1)
                SL = _Ask - StopLoss * SYS_POINT;
        } else {
            price = _Bid;
            if (StopLoss != -1)
                SL = _Bid + StopLoss * SYS_POINT;
        }

        if (nbrlots >= tranche)
            ticket = OrderSend(_Symbol, h_mode, tranche, price, SYS_SLIPPAGE, SL, 0, comment, B_MagicNumber[session] + HedgeMagicNumber, 0, Green);
        else
            ticket = OrderSend(_Symbol, h_mode, nbrlots, price, SYS_SLIPPAGE, SL, 0, comment, B_MagicNumber[session] + HedgeMagicNumber, 0, Green);
        if (ticket > 0) {
            PG_Print(TYPE_INFO, "Hedge order opened : " + OrderOpenPrice());
            if (nbrlots >= tranche)
                nbrlots = nbrlots - tranche;
            else
                nbrlots = 0;
        } else {
            error = GetLastError();
            PG_Print(TYPE_ERROR, "Error opening Hedge order : " + ErrorDescription(error));
            if (error == 134) return (-1);
        }
        RefreshRates();
    }
    B_HedgeType[session] = h_mode;
    return (ticket);
}

int B_HedgeCloseTrade(int session, int operation = -1) // operation = OP_BUY, OP_SELL, OP_BUYSELL
{
    int ticket, h_mode;
    double nbrlots;

    if (operation == OP_BUY) h_mode = OP_SELL;
    else
    if (operation == OP_SELL) h_mode = OP_BUY;
    else
        h_mode = -1;

    nbrlots = ReturnNbrLots(B_MagicNumber[session] + HedgeMagicNumber, h_mode);

    while (nbrlots > 0.000001) {
        CloseOrders(B_MagicNumber[session] + HedgeMagicNumber, h_mode);
        nbrlots = ReturnNbrLots(B_MagicNumber[session] + HedgeMagicNumber, h_mode);
        RefreshRates();
    }
    return (ticket);
}

void B_InitManualSession(int session, bool headerread) {
    if (!headerread) {
        B_StartOnRule[session] = R_MANUAL;
        B_ExitMode[session] = EM_EXITANY;
        B_KeepBuySell[session] = 0;
        B_OneOrderPerBar[session] = 0;       // buy sell auto... 
        B_Operation[session] = OP_BUYSELL;
        B_Direction[session] = D_ANY;
        B_DirectionType[session] = DT_LEVEL;
        B_PipStep[session] = 0;
        B_MaxCount[session] = 30;
        B_RecoveryMode[session] = M_C;
        B_RecoveryValue[session] = 1;
        B_HedgeMagnitude[session] = 1;
        B_OrderType[session] = OT_MONO;
    }

    B_ILot[session] = 0.1;
    B_MaxLot[session] = 8;
    B_MaxTime[session] = 0;
    B_OneOrderPerBar[session] = 0;
    B_TimeStep[session] = 0;
    B_TrailingStop[session] = 0;
    B_StopLoss[session] = 0;
    B_TStopLoss[session] = 0;
    B_TakeProfit[session] = 0;
    B_BuyTrailingStop[session] = 0;
    B_BuyStopLoss[session] = 0;
    B_TBuyStopLoss[session] = 0;
    B_BuyTakeProfit[session] = 0;
    B_SellTakeProfit[session] = 0;
    B_SellTrailingStop[session] = 0;
    B_SellStopLoss[session] = 0;
    B_TSellStopLoss[session] = 0;
    B_MinProfit[session] = 0;
    B_BuyMinProfit[session] = 0;
    B_SellMinProfit[session] = 0;
    B_BuyLotSL[session] = 0;
    B_BuyLotTP[session] = 0;
    B_BuyLotTS[session] = 0;
    B_SellLotSL[session] = 0;
    B_SellLotTP[session] = 0;
    B_SellLotTS[session] = 0;

    B_BuySellAutomatic[session] = false;
    B_ExitAutomatic[session] = false;
    B_HedgeAutomatic[session] = false;
    B_DeHedgeAutomatic[session] = false;
}


int B_ReturnFreeSession() {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == true) {
            B_FreeSession[i] = false;
            return (i);
        }
    return (-1);
}

int B_ReturnSession(int rule, int Operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            if (B_Operation[i] == Operation && B_StartOnRule[i] == rule) {
                return i;
            }
    return -1;
}

bool B_ReturnNbrHedgeSession() {
    int nbr = 0;
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false && B_HedgeLine[i] != 0) nbr++;
    return (nbr);
}

int B_ReturnNbrActiveSession() {
    int nbr = 0;
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false) nbr++;
    return (nbr);
}

int B_ReturnFirstActiveSession() {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            return (i);
    return (-1);
}

int B_StartNewSession() {
    int new_session;

    if (B_NbrSession >= B_MaxSessions) return (-1);

    new_session = B_ReturnFreeSession();
    if (new_session != -1) {
        B_StartDate[new_session] = TimeCurrent();
        B_init(new_session);
    }
    return (new_session);
}

void B_ExitSession(int session, int operation = -1) {
    if (operation == OP_BUY) B_ExitBuy[session] = true;
    else
    if (operation == OP_SELL) B_ExitSell[session] = true;
    else {
        B_ExitBuy[session] = true;
        B_ExitSell[session] = true;
        B_HedgeCloseTrade(session);
    }
}

void B_CloseSession(int session, int operation = -1) {
    if (operation == OP_BUY) B_CloseBuy[session] = true;
    else
    if (operation == OP_SELL) B_CloseSell[session] = true;
    else {
        B_CloseBuy[session] = true;
        B_CloseSell[session] = true;
        //     B_HedgeCloseTrade (session);
    }
}

void B_HedgeSetMagnitude(int session, int value) {
    if (value <= 0) return;
    if (B_Hedged[session] == true) return;
    else B_HedgeMagnitude[session] = value;
}

void B_SuspendSessions(int rule, int Operation, int operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            if (B_Operation[i] == Operation && B_StartOnRule[i] == rule) {
                if (operation == 1) B_BuySellAutomatic[i] = false; // suspended
                else B_BuySellAutomatic[i] = true;
            }
}

void B_AutoExitSession(int i, int operation) {
    int engine = GetEngine(B_StartOnRule[i], B_Operation[i]);
    B_ExitAutomatic[i] = operation;
    if (operation == 0) {
        B_BuyLotSL[i] = 0;
        B_BuyLotTP[i] = 0;
        B_BuyLotTS[i] = 0;
        B_SellLotSL[i] = 0;
        B_SellLotTP[i] = 0;
        B_SellLotTS[i] = 0;

        CancelSLTP(B_MagicNumber[i]);
    } else {
        B_BuyLotSL[i] = EValue(engine, B_BUYLOTSL);
        B_BuyLotTP[i] = EValue(engine, B_BUYLOTTP);
        B_BuyLotTS[i] = EValue(engine, B_BUYLOTTS);

        B_SellLotSL[i] = EValue(engine, B_SELLLOTSL);
        B_SellLotTP[i] = EValue(engine, B_SELLLOTTP);
        B_SellLotTS[i] = EValue(engine, B_SELLLOTTS);
        SetSLTP(B_MagicNumber[i], B_BuyLotSL[i], B_BuyLotTP[i], B_SellLotSL[i], B_SellLotTP[i]);
    }
}

void B_AutoExitSessions(int rule, int Operation, int operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            if (B_Operation[i] == Operation && B_StartOnRule[i] == rule) {
                B_AutoExitSession(i, operation);
                int engine = GetEngine(B_StartOnRule[i], B_Operation[i]);
                B_ExitAutomatic[i] = operation;
            }
}

void B_ProcessTrailingStop(int session, int operation = -1) {
    if (operation == -1) {
        if (B_SessionProfit[session] > B_TrailingStop[session])
            if (B_TStopLoss[session] < B_SessionProfit[session] - B_TrailingStop[session]) {
                B_TStopLoss[session] = B_SessionProfit[session] - B_TrailingStop[session];
            }
    } else
    if (operation == OP_BUY) {
        if (B_BuyProfit[session] > B_BuyTrailingStop[session]) {
            if (B_TBuyStopLoss[session] < B_BuyProfit[session] - B_BuyTrailingStop[session])
                B_TBuyStopLoss[session] = B_BuyProfit[session] - B_BuyTrailingStop[session];
        }
    } else
    if (operation == OP_SELL) {
        if (B_SellProfit[session] > B_SellTrailingStop[session])
            if (B_TSellStopLoss[session] < B_SellProfit[session] - B_SellTrailingStop[session])
                B_TSellStopLoss[session] = B_SellProfit[session] - B_SellTrailingStop[session];
    }
}

void B_AutoHedgeSessions(int rule, int Operation, int operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            if (B_Operation[i] == Operation && B_StartOnRule[i] == rule) B_HedgeAutomatic[i] = operation;
}

void B_AutoDeHedgeSessions(int rule, int Operation, int operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            if (B_Operation[i] == Operation && B_StartOnRule[i] == rule) B_DeHedgeAutomatic[i] = operation;
}

void B_KeepBuySessions(int operation, int rule) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            if (B_StartOnRule[i] == rule) B_KeepBuySellSession(i, operation);
}

void B_SuspendSession(int session, int operation) {
    if (operation == 1) B_BuySellAutomatic[session] = false; // suspended
    else B_BuySellAutomatic[session] = true;
}

void B_KeepBuySellSession(int session, int operation) {
    if (B_Operation[session] == OP_BUYSELL && B_OrderType[session] == OT_HEDGE && B_ExitSell[session] == false && B_ExitBuy[session] == false)
        B_KeepBuySell[session] = operation;
}

void B_HedgeSession(int session, int hedge, int operation = OP_BUYSELL) // hedge true ==>hedge   false unhedge operation to hedge BUY is sell
{
    int ret = -1;

    if ((B_Operation[session] == OP_BUY && operation == OP_SELL) ||
        (B_Operation[session] == OP_SELL && operation == OP_BUY))
        return;

    if (hedge == 1) {
        if (operation == OP_SELL && B_SellNbrTrade[session] > 0)
            ret = B_HedgeProcessTrade(session, OP_SELL); // Hedge sell operations 
        else
        if (operation == OP_BUY && B_BuyNbrTrade[session] > 0)
            ret = B_HedgeProcessTrade(session, OP_BUY); // Hedge buy operations
        //    else
        //    {
        //       ret = B_HedgeProcessTrade (session, OP_BUY);  // Hedge buy operations
        //       ret = B_HedgeProcessTrade (session, OP_SELL);  // Hedge sell operations 
        //    }
        if (ret < 0) return;
        B_HasBeenHedged[session] = true;
    } else {
        ret = B_HedgeCloseTrade(session, operation);
    }
}


void B_ReturnAll (int sessionnumber) {
    int cnt, total;
    double buynbrlots = 0;
    double sellnbrlots = 0;
    double buyprofit = 0;
    double sellprofit = 0;
    double buyaverage = 0;
    double sellaverage = 0;    
    int buynbrtrade = 0;
    int sellnbrtrade = 0;
    
    
    double buyhedgenbrlots = 0;
    double sellhedgenbrlots = 0;
    double buyhedgeprofit = 0;
    double sellhedgeprofit = 0;
    double buyhedgeaverage = 0;
    double sellhedgeaverage = 0;      
    int buyhedgenbrtrade = 0;
    int sellhedgenbrtrade = 0;
    
    int MagicNumber = B_MagicNumber[sessionnumber];
    total = OrdersTotal();

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);    
        if (OrderSymbol() != _Symbol) continue;
        if (OrderMagicNumber() == MagicNumber ) {
            if (OrderType() == OP_BUY) {
                buynbrlots += OrderLots();
                buynbrtrade++;
                buyprofit += OrderProfit();
                buyaverage += OrderLots() * OrderOpenPrice();
            }
            else 
            if (OrderType() == OP_SELL) {
                sellnbrlots += OrderLots();
                sellnbrtrade++;
                sellprofit += OrderProfit();
                sellaverage += OrderLots() * OrderOpenPrice();                

            }
        }
        if (OrderMagicNumber() == MagicNumber + HedgeMagicNumber) {
            if (OrderType() == OP_BUY) {
                buyhedgenbrlots += OrderLots();
                buyhedgenbrtrade++;
                buyhedgeprofit += OrderProfit();
                buyhedgeaverage += OrderLots() * OrderOpenPrice();                

            }
            else 
            if (OrderType() == OP_SELL) {
                sellhedgenbrlots += OrderLots();
                sellhedgenbrtrade++;
                sellhedgeprofit += OrderProfit();
                sellhedgeaverage += OrderLots() * OrderOpenPrice();                
            }
        }

    }
    B_BuyHedgeNbrLots[sessionnumber]    = buyhedgenbrlots;
    B_SellHedgeNbrLots[sessionnumber]   = sellhedgenbrlots;
    B_BuyNbrLots[sessionnumber]         = buynbrlots;
    B_SellNbrLots[sessionnumber]        = sellnbrlots;
    B_BuyNbrTrade[sessionnumber]        = buynbrtrade;
    B_SellNbrTrade[sessionnumber]       = sellnbrtrade;
    B_BuyProfit[sessionnumber]          = buyprofit;
    B_SellProfit[sessionnumber]         = sellprofit;
    B_BuyHedgeProfit[sessionnumber]     = buyhedgeprofit;
    B_SellHedgeProfit[sessionnumber]    = sellhedgeprofit;
            
    B_HedgeNbrLots[sessionnumber]       = B_BuyHedgeNbrLots[sessionnumber] + B_SellHedgeNbrLots[sessionnumber];
    B_Profit[sessionnumber]             = B_BuyProfit[sessionnumber] + B_SellProfit[sessionnumber] + B_HedgeProfit[sessionnumber];

    
    B_BuyAveragePoint[sessionnumber]    = (buynbrlots == 0 ? 0 : buyaverage / buynbrlots);    
    B_SellAveragePoint[sessionnumber]   = (sellnbrlots == 0 ? 0 : sellaverage / sellnbrlots);
    
    if (B_HedgeNbrLots[sessionnumber] > 0.000001) {
        B_Hedged[sessionnumber] = true;
        B_HasBeenHedged[sessionnumber] = true;
    } else 
        B_Hedged[sessionnumber] = false;
    
    if (B_BuyHedgeNbrLots[sessionnumber] > 0) {
        if (B_SellHedgeNbrLots[sessionnumber] > 0)
            B_HedgeType[sessionnumber] = OP_BUYSELL;
        else
            B_HedgeType[sessionnumber] = OP_BUY;
    } else
    if (B_SellHedgeNbrLots[sessionnumber] > 0) {
        B_HedgeType[sessionnumber] = OP_SELL;
    }
    else 
        B_HedgeType[sessionnumber] = -1;
    
    
    
    if (B_Hedged[sessionnumber]) {
        if (B_HedgeType[sessionnumber] == OP_BUY)
            B_HedgeLine[sessionnumber] = (buyhedgenbrlots == 0 ? 0 : buyhedgeaverage / buyhedgenbrlots); 
        else
        if (B_HedgeType[sessionnumber] == OP_SELL)
            B_HedgeLine[sessionnumber] = (sellhedgenbrlots == 0 ? 0 : sellhedgeaverage / sellhedgenbrlots);
        else
            B_HedgeLine[sessionnumber] = (buyhedgenbrlots + sellhedgenbrlots == 0 ? 0 : (buyhedgeaverage + sellhedgeaverage) / (buyhedgenbrlots + sellhedgenbrlots));

    }    
    
    
}

void B_FindInHistory(int session) {
    double smin = 10000;
    double smax = 0;
    double hmin = 10000;
    double hmax = 0;

    double LotMax = 0;
    double LastLot = 0;
    double LastBuyLot = 0;
    double LastSellLot = 0;
    int LastOrderType = -1;

    datetime FirstOrderCloseTime = 0;
    datetime FirstOrderOpenTime = 0;
    double FirstOrderOpenPrice = -1;
    double FirstOrderClosePrice = -1;

    datetime LastOrderCloseTime = 0;
    datetime LastOrderOpenTime = 0;
    double LastOrderOpenPrice = -1;
    double LastOrderClosePrice = -1;
    double LastOrderCloseLots = -1;
    double LastOrderCloseProfit = 0;
    int LastOrderCloseType = -1; // close trade

    int magicNumber = B_MagicNumber[session];
    int total = OrdersTotal();

    for (int cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() != magicNumber && OrderMagicNumber() != magicNumber + HedgeMagicNumber)
            continue;
        if (OrderMagicNumber() == magicNumber + HedgeMagicNumber) {
            B_HasBeenHedged[session] = true;
            continue;
        }
        if (OrderSymbol() == _Symbol) {
            smin = MathMin(OrderOpenPrice(), smin);
            smax = MathMax(OrderOpenPrice(), smax);
            if (OrderOpenTime() > LastOrderOpenTime) {
                LastOrderOpenTime = OrderOpenTime();
                LastOrderOpenPrice = OrderOpenPrice();
                LastLot = OrderLots();
                LastOrderType = OrderType();

                if (OrderType() == OP_BUY) LastBuyLot = LastLot;
                else LastSellLot = LastLot;
            }
            if (FirstOrderOpenPrice == -1) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            } else
            if (OrderOpenTime() < FirstOrderOpenTime) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            }
        }
    }
    string sComment = "";
    int slpos, tppos, spos;

    total = OrdersHistoryTotal();
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderMagicNumber() != magicNumber)
            continue;

        sComment = OrderComment();
        slpos = StringFind(sComment, "[sl]");
        tppos = StringFind(sComment, "[tp]");
        spos = 0;

        if (slpos == 0 || tppos == 0) {
            spos = 4;
            while (StringGetCharacter(sComment, spos) == ' ') spos++;
        }
        if (OrderSymbol() == _Symbol && B_ReadSInfo(OrderComment(), spos, 10) == DoubleToString(B_StartDate[session], 0)) {
            hmin = MathMin(OrderOpenPrice(), smin);
            hmax = MathMax(OrderOpenPrice(), smax);
            LotMax = MathMax(OrderLots(), LotMax);

            if (OrderProfit() < 0) {
                if (LastOrderCloseProfit < 0) {
                    B_SLost[session] += OrderLots();
                } else {
                    B_SLost[session] = OrderLots();
                }
            } else {
                if (LastOrderCloseProfit >= 0) {
                    B_SGain[session] += OrderLots();
                } else {
                    B_SGain[session] = OrderLots();
                }
            }
            if (OrderCloseTime() > LastOrderCloseTime) {
                LastOrderCloseTime = OrderCloseTime();
                LastOrderCloseProfit = OrderProfit();
                LastOrderCloseType = OrderType();
                LastOrderClosePrice = OrderClosePrice();
                LastOrderCloseLots = OrderLots();
            }
            if (OrderOpenTime() > LastOrderOpenTime) {
                LastOrderOpenTime = OrderOpenTime();
                LastOrderOpenPrice = OrderOpenPrice();
                LastLot = OrderLots();
                LastOrderType = OrderType();

                if (OrderType() == OP_BUY) LastBuyLot = LastLot;
                else LastSellLot = LastLot;

            }
            if (FirstOrderClosePrice == -1) {
                FirstOrderClosePrice = OrderClosePrice();
                FirstOrderCloseTime = OrderCloseTime();
            } else
            if (OrderCloseTime() < FirstOrderCloseTime) {
                FirstOrderCloseTime = OrderCloseTime();
                FirstOrderClosePrice = OrderClosePrice();
            }

            if (FirstOrderOpenPrice == -1) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            } else
            if (OrderOpenTime() < FirstOrderOpenTime) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            }
            if (OrderProfit() < 0) {
                B_NoLost[session] = false;
            }
        }
    }
    if (smin == 10000) B_Min[session] = _Ask;
    else B_Min[session] = smin;

    if (smax == 0) B_Max[session] = _Ask;
    else B_Max[session] = smax;

    B_HMin[session] = MathMin(hmin, B_Min[session]);
    B_HMax[session] = MathMax(hmax, B_Max[session]);

    B_BiggestLot[session] = LotMax;
    B_LastOrderOpenPrice[session] = LastOrderOpenPrice;
    B_LastOrderClosePrice[session] = LastOrderClosePrice;

    B_LastOrderOpenTime[session] = LastOrderOpenTime;
    B_LastOrderCloseTime[session] = LastOrderCloseTime;

    B_FirstOrderOpenPrice[session] = FirstOrderOpenPrice;
    B_FirstOrderClosePrice[session] = FirstOrderClosePrice;

    B_FirstOrderOpenTime[session] = FirstOrderOpenTime;
    B_FirstOrderCloseTime[session] = FirstOrderCloseTime;

    B_LastOrderCloseProfit[session] = LastOrderCloseProfit;
    B_LastOrderCloseType[session] = LastOrderCloseType;
    B_LastOrderCloseLot[session] = LastOrderCloseLots;

    B_LastLot[session] = LastLot;
    B_LastBuyLot[session] = LastBuyLot;
    B_LastSellLot[session] = LastSellLot;
    B_LastOrderType[session] = LastOrderType;

}

double B_ReturnProfit(int session) {
    double Profit = 0;
    int magicNumber = B_MagicNumber[session];
    int total = OrdersTotal();

    for (int cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() != magicNumber &&
            OrderMagicNumber() != magicNumber + HedgeMagicNumber)
            continue;
        if (OrderSymbol() == _Symbol)
            Profit += OrderProfit();

    }
    string sComment = "";
    int slpos, tppos, spos;
    total = OrdersHistoryTotal();
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderMagicNumber() != magicNumber &&
            OrderMagicNumber() != magicNumber + HedgeMagicNumber)
            continue;

        sComment = OrderComment();
        slpos = StringFind(sComment, "[sl]");
        tppos = StringFind(sComment, "[tp]");
        spos = 0;

        if (slpos == 0 || tppos == 0) {
            spos = 4;
            while (StringGetCharacter(sComment, spos) == ' ') spos++;
        }

        if (B_ReadSInfo(OrderComment(), spos, 10) == DoubleToString(B_StartDate[session], 0))
            if (OrderSymbol() == _Symbol) Profit += OrderProfit();
    }
    return (Profit);
}

//+------------------------------------------------------------------+ INIT

int B_init(int session) {

    B_FreeSession[session] = false;
    B_InitSession[session] = true;
    B_MagicNumber[session] = B_IMagicNumber + session;
    B_BuySellAutomatic[session] = true;
    B_KeepBuySell[session] = false;
    B_OneOrderPerBar[session] = 0;
    B_CloseBuy[session] = false;
    B_CloseSell[session] = false;

    B_ExitBuy[session] = false;
    B_ExitSell[session] = false;
    B_SessionProfit[session] = 0;
    B_Profit[session] = 0;
    B_BuyNow[session] = false;
    B_SellNow[session] = false;
    B_BuySell[session] = false;
    B_Hedged[session] = false;
    B_HedgeLine[session] = 0;
    B_HedgeNbrLots[session] = 0;
    B_SellHedgeNbrLots[session] = 0;
    B_BuyHedgeNbrLots[session] = 0;
    B_HedgeType[session] = -1;
    B_HedgeProfit[session] = 0;
    B_MaxLot[session] = 3.2;

    B_HasBeenHedged[session] = false;
    B_Max[session] = _Ask;
    B_Min[session] = _Ask;

    B_Suspend[session] = false;
    B_LastOrderType[session] = -1;

    B_LastLot[session] = 0;
    B_LastBuyLot[session] = 0;
    B_LastSellLot[session] = 0;

    B_LastOrderOpenTime[session] = 0; // current trade or history
    B_LastOrderCloseTime[session] = 0; // current trade or history

    B_FirstOrderOpenTime[session] = 0; // current trade or history
    B_FirstOrderCloseTime[session] = 0; // current trade or history

    B_LastOrderCloseProfit[session] = 0; // closed 
    B_LastOrderCloseType[session] = -1;
    B_LastOrderOpenPrice[session] = -1;
    B_LastOrderClosePrice[session] = -1;
    B_LastOrderCloseLot[session] = -1;

    B_FirstOrderOpenPrice[session] = -1;
    B_FirstOrderClosePrice[session] = -1;

    B_BiggestLot[session] = 0;
    B_NoLost[session] = true;
    B_SLost[session] = 0;
    B_SGain[session] = 0;

    B_StartOnRule[session] = -1;
    B_BuyOnRule[session] = -1;
    B_SellOnRule[session] = -1;
    B_ExitOnRule[session] = -1;
    B_ExitBuyOnRule[session] = -1;
    B_ExitSellOnRule[session] = -1;

    B_BuyMinProfit[session] = B_TakeProfit[session] * B_ILot[session]; //B_SessionProfit * B_ILot[session];
    B_SellMinProfit[session] = B_TakeProfit[session] * B_ILot[session]; //B_SessionProfit * B_ILot[session];

    PG_Print(TYPE_INFO, "************************************************************************    Start Session " + session + "     ************************************************************************ ");

    B_InitGraphics(session);
    B_NbrSession += 1;
    return (0);
}

//+------------------------------------------------------------------+ START

void B_SetRecoveryMode(int session, double & bLot, double & sLot) {
    // recovery MODE

    string RecoveryMode = RecoveryModeName[B_RecoveryMode[session]];

    if (RecoveryMode == "C") // Constant
    {
        // nothing
    } else
    if (RecoveryMode == "I") // Increment
    {
        if (B_BuyNbrTrade[session] == 0)
            bLot = B_ILot[session];
        else
            bLot = B_ILot[session] + B_LastBuyLot[session];
        if (B_SellNbrTrade[session] == 0)
            sLot = B_ILot[session];
        else
            sLot = B_ILot[session] + B_LastSellLot[session];
    } else
    if (RecoveryMode == "M") // Martingale on multiplier
    {
        if (B_BuyNbrTrade[session] == 0)
            bLot = B_ILot[session];
        else
            bLot = NormalizeDouble(B_RecoveryValue[session] * B_LastBuyLot[session], 2);

        if (B_SellNbrTrade[session] == 0)
            sLot = B_ILot[session];
        else
            sLot = NormalizeDouble(B_RecoveryValue[session] * B_LastSellLot[session], 2);

    } else
    if (RecoveryMode == "J") // multiplier after close one side
    {
        if (B_Operation[session] != OP_BUYSELL || B_ExitSell[session] == true || B_ExitBuy[session] == true) {
            bLot = NormalizeDouble(B_RecoveryValue[session] * B_LastBuyLot[session], 2);
            sLot = NormalizeDouble(B_RecoveryValue[session] * B_LastSellLot[session], 2);
        }
    } else
    if (RecoveryMode == "P") // if lost we begin lot ... else increment  
    {
        if (B_BiggestLot[session] != 0 && !B_NoLost[session]) {
            if (B_LastOrderCloseProfit[session] > 0) {
                bLot = B_BiggestLot[session] + B_ILot[session];
                sLot = B_BiggestLot[session] + B_ILot[session];
            }
        }
    } else
    if (RecoveryMode == "A") // Alembex : if lost same lot else last cumulative lost
    {
        if (B_LastOrderCloseProfit[session] >= 0) {

            if (B_SGain[session] > B_SLost[session]) {
                bLot = B_ILot[session];
                sLot = B_ILot[session];

            } else {
                bLot = B_SLost[session];
                sLot = B_SLost[session];
            }
        } else {
            bLot = B_LastLot[session];
            sLot = B_LastLot[session];
        }

    } else
    if (RecoveryMode == "Q") // if lost we multiply lot by multiplier and change type 
    {
        if (B_LastOrderCloseProfit[session] < 0) {
            if (B_LastOrderCloseType[session] == OP_BUY)
                sLot = NormalizeDouble(B_RecoveryValue[session] * B_LastOrderCloseLot[session], 2);
            else
            if (B_LastOrderCloseType[session] == OP_SELL)
                bLot = NormalizeDouble(B_RecoveryValue[session] * B_LastOrderCloseLot[session], 2);
        }
    } else
    if (RecoveryMode == "F") // Fibonacci
    {
        if (B_BuyNbrTrade[session] > 0)
            bLot = Fibonacci(B_BuyNbrTrade[session]) * B_ILot[session];

        if (B_SellNbrTrade[session] > 0)
            sLot = Fibonacci(B_SellNbrTrade[session]) * B_ILot[session];
    } else
    if (RecoveryMode == "D") // Double starting from counttodouble
    {
        if (B_BuyNbrTrade[session] >= B_RecoveryValue[session])
            bLot = 2 * B_ILot[session];

        if (B_SellNbrTrade[session] >= B_RecoveryValue[session])
            sLot = 2 * B_ILot[session];
    } else
    if (RecoveryMode == "H") // Steve Hopwood 1.1.2.4   /maxcount is 4 
    {
        if (B_BuyNbrTrade[session] == 2) bLot = 2 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] == 3) bLot = 4 * B_ILot[session];

        if (B_SellNbrTrade[session] == 2) sLot = 2 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] == 3) sLot = 4 * B_ILot[session];

    } else
    if (RecoveryMode == "S") // Steve Hopwood 1.1.3.3   /maxcount is 4 
    {
        if (B_BuyNbrTrade[session] >= 2) bLot = 3 * B_ILot[session];

        if (B_SellNbrTrade[session] >= 2) sLot = 3 * B_ILot[session];
    } else
    if (RecoveryMode == "N") // Steve Hopwood 1.2.6   /maxcount is 3
    {
        if (B_BuyNbrTrade[session] == 1) bLot = 2 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] >= 2) bLot = 6 * B_ILot[session];

        if (B_SellNbrTrade[session] == 1) sLot = 2 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] >= 2) sLot = 6 * B_ILot[session];
    } else
    if (RecoveryMode == "O") // Steve Hopwood 1.2.6.24   /maxcount is 4
    {
        if (B_BuyNbrTrade[session] == 1) bLot = 2 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] == 2) bLot = 6 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] == 3) bLot = 24 * B_ILot[session];

        if (B_SellNbrTrade[session] == 1) sLot = 2 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] == 2) sLot = 6 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] == 3) sLot = 24 * B_ILot[session];
    } else
    if (RecoveryMode == "U") // Steve Hopwood 1.2.6.24   /maxcount is 4
    {
        bLot = B_RecoveryTab[B_BuyNbrTrade[session]][session] * B_ILot[session];
        sLot = B_RecoveryTab[B_SellNbrTrade[session]][session] * B_ILot[session];
    } else
    if (RecoveryMode == "L") // Leverage
    {
        double distance;

        if (B_SellProfit[session] < 0) {
            distance = -B_RecoveryValue[session] * SYS_POINT;
            sLot = ((B_SellAveragePoint[session] - _Bid - distance) * B_SellNbrLots[session]) / distance;
        }

        if (B_BuyProfit[session] < 0) {
            distance = B_RecoveryValue[session] * SYS_POINT;
            bLot = ((B_BuyAveragePoint[session] - _Ask - distance) * B_BuyNbrLots[session]) / distance;

        }
    } else
    if (RecoveryMode == "K") // Opposite Leverage
    {

        if (B_BuyProfit[session] < 0) {
            distance = -B_RecoveryValue[session] * SYS_POINT;
            sLot = (((_Bid + distance) * (B_BuyNbrLots[session] - B_SellNbrLots[session]) +
                (B_SellAveragePoint[session] * B_SellNbrLots[session] - B_BuyAveragePoint[session] * B_BuyNbrLots[session])) / distance);
          //  Print ("sLot " + sLot);
        }
        if (B_SellProfit[session] < 0) {
            distance = B_RecoveryValue[session] * SYS_POINT;
            bLot = (((_Ask + distance) * (B_SellNbrLots[session] - B_BuyNbrLots[session]) +
                (B_BuyAveragePoint[session] * B_BuyNbrLots[session] - B_SellAveragePoint[session] * B_SellNbrLots[session])) / distance);
//            Print ("bLot " + bLot);
        }
    }

    if (bLot <= 0 || bLot > B_MaxLot[session]) bLot = B_ILot[session];
    if (sLot <= 0 || sLot > B_MaxLot[session]) sLot = B_ILot[session];
}

int B_start(int session) {
    int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);

    int PipStep = B_PipStep[session];
    int traderesult = 0;

    //---------------------------------------- 
    // CLOSING AND EXITING IN SESSION
    //---------------------------------------- 

    if (B_CloseBuy[session] == true && B_BuyNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "************************************************************************   CLOSE BUY SESSION  : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_BuyProfit[session] + "  ************************************************************************");
        CloseOrders(B_MagicNumber[session], OP_BUY);
        return (0);
    }

    if (B_CloseSell[session] == true && B_SellNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "************************************************************************   CLOSE SELL SESSION  : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_SellProfit[session] + "  ************************************************************************");
        CloseOrders(B_MagicNumber[session], OP_SELL);
        return (0);
    }

    if (B_ExitBuy[session] == true && B_BuyNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "************************************************************************   EXIT BUY SESSION : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_BuyProfit[session] + "  ************************************************************************");
        CloseOrders(B_MagicNumber[session], OP_BUY, -1, -1, -1, 1);
        return (0);
    }

    if (B_ExitSell[session] == true && B_SellNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "************************************************************************   EXIT SELL SESSION   : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_SellProfit[session] + "  ************************************************************************");
        CloseOrders(B_MagicNumber[session], OP_SELL, -1, -1, -1, 1);
        return (0);
    }

    if (B_ExitBuy[session] == true && B_ExitSell[session] == true &&
        B_HedgeNbrLots[session] + B_BuyNbrTrade[session] + B_SellNbrTrade[session] == 0) {
        PG_Print(TYPE_INFO, "************************************************************************ End Session " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_SessionProfit[session] + " Time Elapsed : " + TimeToString(TimeCurrent() - B_StartDate[session] + "  ************************************************************************", TIME_MINUTES));
        B_NbrSession -= 1;
        B_deinit(session);
        return (0);
    }

    //---------------------------------------- 
    // TRAILING STOP FOR BUY SELL AND SESSION
    //---------------------------------------- 

    if (B_BuyLotTS[session] != 0 || B_SellLotTS[session] != 0)
        ProcessTrailingStop(B_MagicNumber[session], B_BuyLotTS[session], B_SellLotTS[session]);

    if (B_TrailingStop[session] != 0) {
        B_ProcessTrailingStop(session);
    }
    if (B_Operation[session] != OP_SELL && B_BuyTrailingStop[session] != 0)
        B_ProcessTrailingStop(session, OP_BUY);

    if (B_Operation[session] != OP_BUY && B_SellTrailingStop[session] != 0)
        B_ProcessTrailingStop(session, OP_SELL);

    //---------------------------------------- 
    // BUY SELL IN SESSION
    //----------------------------------------   

    if (AccountFreeMargin() < AccountEquity() / 10 && (B_BuyNow[session] == true || B_SellNow[session] == true)) {
        PG_Print(TYPE_WARNING, "Check Account : Free Margin = " + AccountFreeMargin() + "  Equity : " + AccountEquity());
        Send_Operation("Check Account : Free Margin =" + AccountFreeMargin() + "  Equity : " + AccountEquity());
    } else {
        if (B_Operation[session] == OP_BUYSELL) {
            if (B_OrderType[session] == OT_HEDGE && B_ExitSell[session] == false && B_ExitBuy[session] == false)
                B_BuySell[session] = true;
            else
                B_BuySell[session] = false;
        } else
            B_BuySell[session] = false;

        if (B_BuyNow[session] == true) {
            if (B_BuyLot[session] < SYS_MINLOT || B_BuyLot[session] > SYS_MAXLOT || (B_MaxLot[session] != 0 && B_MaxLot[session] > 0 && B_BuyLot[session] > B_MaxLot[session])) {
                PG_Print(TYPE_ERROR, "Buy Lots : " + B_BuyLot[session] + " not in Range for the symbol  : " + _Symbol + " in Session : " + session);
                B_BuyNow[session] = false;
            } else {
                if (engine == -1) {
                    if (B_StartOnRule[session] == R_MANUAL)
                        if (B_BuySellAutomatic[session]) {
                            Send_Manual(_Symbol, session, OP_BUY, B_BuyLot[session], B_BuyLotSL[session], B_BuyLotTP[session], 1);
                            B_BuyNow[session] = false;
                        }
                    else
                        B_BuyNow[session] = true;
                } else {
                    traderesult = B_ProcessTrade(session, 0, OP_BUY, B_BuyLot[session], B_BuyLotSL[session], B_BuyLotTP[session], B_SellLotSL[session], B_SellLotTP[session]);
                    if (traderesult != 0) { 
                        PG_Print(TYPE_ERROR, "Buy Lots : " + B_BuyLot[session] + " Can not execute Order for symbol  : " + _Symbol);
                    }
                    else {
                       return (traderesult);
                   }
                }
            }
        } else {
            if (engine == -1) {
                if (B_StartOnRule[session] == R_MANUAL)
                    if (B_BuySellAutomatic[session])
                        Send_Manual(_Symbol, session, OP_BUY, B_BuyLot[session], B_BuyLotSL[session], B_BuyLotTP[session], 0);
            }
        }
        if (B_SellNow[session] == true) {
            if (B_SellLot[session] < SYS_MINLOT || B_SellLot[session] > SYS_MAXLOT || (B_MaxLot[session] != 0 && B_MaxLot[session] > 0 && B_SellLot[session] > B_MaxLot[session])) {
                PG_Print(TYPE_ERROR, "Sell Lots : " + B_SellLot[session] + " not in Range for the symbol  : " + _Symbol);
                B_SellNow[session] = false;
            } else {
                if (engine == -1) {
                    if (B_StartOnRule[session] == R_MANUAL)
                        if (B_BuySellAutomatic[session]) {
                            Send_Manual(_Symbol, session, OP_SELL, B_SellLot[session], B_SellLotSL[session], B_SellLotTP[session], 1);
                            B_SellNow[session] = false;
                        }
                    else
                        B_SellNow[session] = true;

                } else {
                    traderesult = B_ProcessTrade(session, 0, OP_SELL, B_SellLot[session], B_BuyLotSL[session], B_BuyLotTP[session], B_SellLotSL[session], B_SellLotTP[session]); 
                    if (traderesult != 0) { 
                        PG_Print(TYPE_ERROR, "Sell Lots : " + B_SellLot[session] + " Can not execute Order for symbol  : " + _Symbol);
                    }
                    else {
                       return (traderesult);
                   }
                }
            }
        } else {
            if (engine == -1) {
                if (B_StartOnRule[session] == R_MANUAL)
                    if (B_BuySellAutomatic[session])
                        Send_Manual(_Symbol, session, OP_SELL, B_SellLot[session], B_SellLotSL[session], B_SellLotTP[session], 0);
            }
        }

    }

    //---------------------------------------- 
    // FIRST BUY SELL IN SESSION
    //---------------------------------------- 

    if (B_LastLot[session] == 0) {
        if (!B_BuySellAutomatic[session] || B_Suspend[session])
            return (0);

        if (B_Operation[session] == OP_BUYSELL) {
            if (B_OrderType[session] == OT_HEDGE) {
                if (B_BuyRule(session) || B_SellRule(session))
                    B_BuyNow[session] = true;
            } else {
                if (B_BuyRule(session)) B_BuyNow[session] = true;
                if (B_SellRule(session)) B_SellNow[session] = true;
            }
        } else
        if (B_Operation[session] == OP_BUY && B_BuyRule(session))
            B_BuyNow[session] = true;
        else
        if (B_Operation[session] == OP_SELL && B_SellRule(session))
            B_SellNow[session] = true;
        return (0);
    }

    //----------------------------------------   
    // DEHEDGE AUTOMATIC  
    //---------------------------------------- 

    if (B_DeHedgeAutomatic[session]) {
        if (B_Hedged[session] == true) {
            if (B_CloseHedgeBuyRule(session)) {
                B_HedgeSession(session, 0, OP_BUY);
                return (0);
            }
            if (B_CloseHedgeSellRule(session)) {
                B_HedgeSession(session, 0, OP_SELL);
                return (0);
            }
            if (B_CloseHedgeRule(session)) {
                B_HedgeSession(session, 0, OP_SELL);
                B_HedgeSession(session, 0, OP_BUY);
                return 0;
            }
        }
    }

    //----------------------------------------  
    // EXIT AUTOMATIC    BUY SELL AND SESSION 
    //---------------------------------------- 

    if (B_ExitAutomatic[session]) {
        if (B_ExitRule(session)) {
            Print("Should Exit ! ");
            B_ExitSession(session);
            return (0);
        }

        if (B_Operation[session] != OP_BUYSELL || !B_KeepBuySell[session]) {
            if (!B_ExitBuy[session] && B_ExitBuyRule(session)) // && (!B_Hedged[session] || (B_Hedged[session] && B_HedgeType[session] == OP_BUY)))         // exit buy
            {
                if (B_Operation[session] == OP_BUYSELL && !B_ExitSell[session] && B_RecoveryMode[session] == M_J)
                    B_MaxCount[session] += (B_BuyNbrTrade[session] - 1); // adjust recovery count

                B_ExitBuy[session] = true;
                return (0);
            }

            if (!B_ExitSell[session] && B_ExitSellRule(session)) //&& (!B_Hedged[session] || (B_Hedged[session] && B_HedgeType[session] == OP_SELL)))      // exit sell
            {
                if (B_Operation[session] == OP_BUYSELL && !B_ExitBuy[session] && B_RecoveryMode[session] == M_J)
                    B_MaxCount[session] += (B_SellNbrTrade[session] - 1); // adjust recovery count

                B_ExitSell[session] = true;
                return (0);
            }
        }

        if ((!B_CloseSell[session] || !B_CloseBuy[session]) && B_CloseRule(session)) {
            B_CloseSession(session);
            return (0);
        }

        if (!B_CloseBuy[session] && B_CloseBuyRule(session)) {
            B_CloseSession(session, OP_BUY);
            return (0);
        }

        if (!B_CloseSell[session] && B_CloseSellRule(session)) {
            B_CloseSession(session, OP_SELL);
            return (0);
        }

    } // Automatic Exit    

    //---------------------------------------- 
    // HEDGE AUTOMATIC   
    //---------------------------------------- 

    if (B_HedgeAutomatic[session] && !B_Suspend[session]) // hedge Automatic          
    {
        if (B_HedgeBuyRule(session)) {
            B_HedgeSession(session, 1, OP_BUY);
            return (0);
        }
        if (B_HedgeSellRule(session)) {
            B_HedgeSession(session, 1, OP_SELL);
            return (0);
        }
    }

    //---------------------------------------- 
    // BUY SELL AUTOMATIC
    //---------------------------------------- 

    if (B_BuySellAutomatic[session] && !B_Suspend[session]) {
        if (B_BuyRule(session)) B_BuyNow[session] = true;
        if (B_SellRule(session)) B_SellNow[session] = true;
    }

    return (0);
}

//+------------------------------------------------------------------+ DEINIT

int B_deinit(int session) {

    B_ExitBuy[session] = false;
    B_ExitSell[session] = false;
    B_CloseBuy[session] = false;
    B_CloseSell[session] = false;

    B_Max[session] = _Ask;
    B_Min[session] = _Ask;
    B_BuyNow[session] = false;
    B_SellNow[session] = false;
    B_FreeSession[session] = true;
    B_InitSession[session] = false;
    B_PipStep[session] = 0;
    B_BuySellAutomatic[session] = 1;
    B_KeepBuySell[session] = false;
    B_OneOrderPerBar[session] = 0;
    B_Hedged[session] = false;
    ObjectDelete("box" + session);
    ObjectDelete("borderbox" + session);
    ObjectDelete("smartline" + session);
    ObjectDelete("sellaverageline" + session);
    ObjectDelete("buyaverageline" + session);
    ObjectDelete("sellaveragelinetext" + session);
    ObjectDelete("buyaveragelinetext" + session);
    ObjectDelete("linearlinetext" + session);
    ObjectDelete("hedgeline" + session);
    ObjectDelete("hedgelinetext" + session);

    return (0);
}

//+------------------------------------------------------------------+ INIT

double B_ReturnClosedProfitFromRule(int session) {
    double profit = 0;
    for (int i = 0; i < B_MaxSessions; i++)
        profit += ReturnClosedProfit(B_IMagicNumber + i, B_StartOnRule[session], B_Operation[session]);
    return (profit);
}

int B_start1() {
    B_TotalClosedProfit = 0;
    B_TotalProfit = 0;
    B_TotalBuyProfit = 0;
    B_TotalSellProfit = 0;
    B_TotalHedgeProfit = 0;
    B_TotalHedgeBuyProfit = 0;
    B_TotalHedgeSellProfit = 0;
    B_MaxPoint = 0;
    B_MinPoint = 1000;

    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == false) {

            if (B_StartOnRule[i] == R_MANUAL)
                B_BuySellAutomatic[i] = Automatic;

            //==================================================================================      
            int result = B_start(i);
            if (result != 0)
                Send_Operation("Trade Operation for Currency : " + SYS_SYMBOL + " failed because " + ErrorDescription(result));
            //==================================================================================      
/*
            B_BuyHedgeNbrLots[i]    = ReturnNbrLots(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
            B_SellHedgeNbrLots[i]   = ReturnNbrLots(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
            B_HedgeNbrLots[i]       = B_BuyHedgeNbrLots[i] + B_SellHedgeNbrLots[i];
            B_BuyNbrLots[i]         = ReturnNbrLots(B_MagicNumber[i], OP_BUY);
            B_SellNbrLots[i]        = ReturnNbrLots(B_MagicNumber[i], OP_SELL);
            B_BuyNbrTrade[i]        = ReturnTradeNumber(B_MagicNumber[i], OP_BUY);
            B_SellNbrTrade[i]       = ReturnTradeNumber(B_MagicNumber[i], OP_SELL);
            B_BuyProfit[i]          = ReturnProfit(B_MagicNumber[i], OP_BUY);
            B_SellProfit[i]         = ReturnProfit(B_MagicNumber[i], OP_SELL);
            B_BuyHedgeProfit[i]     = ReturnProfit(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
            B_SellHedgeProfit[i]    = ReturnProfit(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
            B_HedgeProfit[i]        = B_BuyHedgeProfit[i] + B_SellHedgeProfit[i];
            B_Profit[i]             = B_BuyProfit[i] + B_SellProfit[i] + B_HedgeProfit[i];
            B_SellAveragePoint[i]   = ReturnAverage(B_MagicNumber[i], OP_SELL);
            B_BuyAveragePoint[i]    = ReturnAverage(B_MagicNumber[i], OP_BUY);

            if (B_HedgeNbrLots[i] > 0.000001) {
                B_Hedged[i] = true;
                B_HasBeenHedged[i] = true;
            } else B_Hedged[i] = false;
            if (B_BuyHedgeNbrLots[i] > 0)
                if (B_SellHedgeNbrLots[i] > 0)
                    B_HedgeType[i] = OP_BUYSELL;
                else
                    B_HedgeType[i] = OP_BUY;
            else
            if (B_SellHedgeNbrLots[i] > 0)
                B_HedgeType[i] = OP_SELL;
            else B_HedgeType[i] = -1;

            if (B_Hedged[i]) {
                if (B_HedgeType[i] == OP_BUY)
                    B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
                else
                if (B_HedgeType[i] == OP_SELL)
                    B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
                else
                    B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber);

            }            
  */          
            B_ReturnAll (i);
            B_TotalHedgeBuyProfit   += B_BuyHedgeProfit[i];
            B_TotalHedgeSellProfit  += B_SellHedgeProfit[i];
            B_TotalBuyProfit        += B_BuyProfit[i];
            B_TotalSellProfit       += B_SellProfit[i];            
            
            B_SessionProfit[i]      = B_ReturnProfit(i); // with history
            B_FindInHistory(i);
            B_NeutralPoint[i] = B_Min[i] + (B_Max[i] - B_Min[i]) / 2;
            B_MaxPoint = MathMax(B_HMax[i], B_MaxPoint);
            B_MinPoint = MathMin(B_HMin[i], B_MinPoint);



            // some adjustment in case ....


            if (B_ExitSell[i] == true || B_ExitBuy[i] == true || B_OrderType[i] != OT_HEDGE || B_Operation[i] != OP_BUYSELL)
                B_KeepBuySell[i] = false;
            if (B_Operation[i] != OP_BUYSELL) B_OrderType[i] = OT_MONO;
            if (B_CloseSell[i] == true && B_SellNbrTrade[i] == 0) B_CloseSell[i] = false;
            if (B_CloseBuy[i] == true && B_BuyNbrTrade[i] == 0) B_CloseBuy[i] = false;

            if (B_TrailingStop[i] == 0) B_TStopLoss[i] = 0;
            if (B_BuyTrailingStop[i] == 0) B_TBuyStopLoss[i] = 0;
            if (B_SellTrailingStop[i] == 0) B_TSellStopLoss[i] = 0;

            //     if (B_Hedged[i]) B_BuySellAutomatic[i] = true;
            // end some adjustment 



            B_DrawGraphics(i);

            //=============================  
            /// Next Lot is calculated here 
            //=============================  
            double bLot = B_ILot[i];
            double sLot = B_ILot[i];

            B_SetRecoveryMode(i, bLot, sLot);

            B_BuyLot[i] = bLot;
            B_SellLot[i] = sLot;
            //=============================                  
        }
        B_TotalClosedProfit +=  ReturnClosedProfit(B_IMagicNumber + i);
        B_TotalProfit = B_TotalBuyProfit + B_TotalSellProfit;
        B_TotalHedgeProfit = B_TotalHedgeBuyProfit + B_TotalHedgeSellProfit;
    }
    return (0);
}

bool B_FindSession(int rule, int way = -1) {
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == false) {
            if (B_StartOnRule[i] == rule && (way == -1 || B_Operation[i] == way))
                return (true);
        }
    }
    return (false);
}

void B_CloseSuspendedSessions() {
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == true) continue;
        if (!B_BuySellAutomatic[i]) B_ExitSession(i);
    }
}

void B_CloseKeepBuySessions() {
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == true) continue;
        if (B_KeepBuySell[i] == true) B_ExitSession(i);
    }
}

void B_CloseHedgedSessions(int operation = -1) {
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == true) continue;
        if (B_Hedged[i] && (operation == -1 || (B_HedgeType[i] == operation)))
            B_ExitSession(i);
    }
}

//****************************************************************************************************************************************





// ---------------------------------------------------------------------------------------NEWS-----------------------------------

int AlertNews(int sound = 0) // minutes
{
    int news_found = 0;
    int offset = 0;
    bool first = true;
    datetime time;

    for (int j = 0; j < NewsNbrToday; j++) {
        if (CurrentTime > DateNewsToday[j]) {
            j++;
            continue;
        }

        if (CurrentTime <= DateNewsToday[j] && CurrentTime > DateNewsToday[j] - (NewsAlertTime * 60) &&
            (ImportanceNewsToday[j] == "High" || ImportanceNewsToday[j] == "HIGH")) {
            time = DateNewsToday[j];
            for (int i = 0; i < NBR_PERIODS; i++) {
                Set_Signal(NEWS, S_ALERT, i, P_SIGNAL);
                Set_Signal_Value(NEWS, S_ALERT, i, DateNewsToday[j] - CurrentTime);
            }

            //    if (sound != 0)
            //      Send_News (TimeToString(DateNewsToday[j]), DescNewsToday[j], CurrNewsToday[j], ImportanceNewsToday[j], ActualNewsToday[j],  ForecastNewsToday[j], PreviousNewsToday[j]);  
            news_found = 1;
            return news_found;
        }
        offset -= 10;
    }
    return (news_found);
}


//+------------------------------------------------------------------+
//| return error description                                         |
//+------------------------------------------------------------------+

//////////////////////////////////TRADE FUNCTIONS

double UseLots() {
    int mm = -1;
    double lots;
    if (mm < 0) {
        lots = MathCeil(AccountFreeMargin() * Risk / 715) / 10 - 0.1;
        if (lots < 0.1) lots = 0.1;
    }
    if (mm > 0) {
        lots = MathCeil(AccountEquity() * Risk / 100) / 10 - 1;
        if (lots > 1) lots = MathCeil(lots);
        if (lots < 1) lots = 1;
    }
    if (lots > 5) lots = 5;
    return (lots);
}

double LotsOptimized(double Lots, int m_period = -1) {
    double lot = Lots;
    int orders = HistoryTotal(); // history orders total
    int losses = 0; // number of losses orders without a break
    double MaximumRisk = 0.02;
    double DecreaseFactor = 3;

    //---- select lot size
    lot = NormalizeDouble(AccountFreeMargin() * MaximumRisk / 1000.0, 1);
    //---- calcuulate number of losses orders without a break

    if (DecreaseFactor > 0) {
        for (int i = orders - 1; i >= 0; i--) {
            if (OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) == false) {
                PG_Print(TYPE_ERROR, "Error in history!");
                break;
            }
            if (OrderSymbol() != _Symbol || OrderType() > OP_SELL) continue;
            //----
            if (OrderProfit() > 0) break;
            if (OrderProfit() < 0) losses++;
        }
        if (losses > 1) lot = NormalizeDouble(lot - lot * losses / DecreaseFactor, 1);
    }
    if (lot < 0.1) lot = 0.1;
    return (lot * 1.8 * m_period + 1);
}

double ReturnAccountNbrLots() {
    double nbrlots = 0;
    int xtotal = OrdersHistoryTotal();

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderType() <= OP_SELL) {
            nbrlots += OrderLots();
        }
    }
    return (nbrlots);
}

double ReturnNbrLots(int MagicNumber, int Operation = -1) {
    double nbrlots = 0;
    int xtotal = OrdersTotal();

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderType() <= OP_SELL && OrderMagicNumber() == MagicNumber && OrderSymbol() == _Symbol) {
            if (Operation == -1) nbrlots += OrderLots();
            else
            if (OrderType() == Operation) nbrlots += OrderLots();
        }
    }
    return (nbrlots);
}
double ReturnAverage(int MagicNumber, int Operation = -1) {
    int cnt, total;
    double average = 0;
    double t_nbrlots = 0;
    total = OrdersTotal();

    if (total == 0)
        return (0);

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() == MagicNumber && OrderSymbol() == _Symbol)
            if (Operation == -1 || OrderType() == Operation) {
                t_nbrlots += OrderLots();
                average += OrderLots() * OrderOpenPrice();
            }
    } //
    if (t_nbrlots == 0) return (0);
    return (average / t_nbrlots);
}



int ReturnTradeNumber(int MagicNumber = -1, int Operation = -1) {
    int cnt, total, xcnt;

    total = OrdersTotal();

    if (total == 0)
        return (0);
    xcnt = 0;

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (MagicNumber != -1 && OrderMagicNumber() != MagicNumber) continue;
        if (OrderSymbol() == _Symbol) {
            if (Operation == -1) xcnt++;
            else if (OrderType() == Operation) xcnt++;
        }
    } // for
    return (xcnt);
}

double ReturnProfit(int MagicNumber, int Operation = -1, int inperiod = -1) {
    double myprofit = 0;
    string today;
    datetime starttime;

    int xtotal = OrdersTotal();
    if (inperiod != -1) {
        starttime = iTime(NULL,inperiod,0);          
    }

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderType() <= OP_SELL && OrderMagicNumber() == MagicNumber && OrderSymbol() == _Symbol) {
            if (Operation == -1)
                if (inperiod == -1)
                    myprofit += OrderProfit();
                else {
                    if (OrderOpenTime() >= starttime)
                        myprofit += OrderProfit();
                }
            else
            if (OrderType() == Operation)
                if (inperiod == -1)
                    myprofit += OrderProfit();
                else {
                    if (OrderOpenTime() >= starttime)
                        myprofit += OrderProfit();
                }
        }
    }
    return (myprofit);
}




double ReturnClosedProfit(int MagicNumber = -1, int rule = -1, int operation = -1, int inperiod = -1, int allsymbol = -1) {
    double myprofit = 0;
    string today;
    datetime starttime;
    datetime StartDate;
    datetime PStartDate = -1;
    int nbrrulestart = 0;
    datetime mthstart=iTime(NULL,PERIOD_MN1,0);
    datetime wkstart =iTime(NULL,PERIOD_W1,0);    

    int xtotal = OrdersHistoryTotal();
    if (inperiod != -1) {
        starttime = iTime(NULL,inperiod,0);  
    }

    // operation is BUY, SELL, BUYSELL

    string sComment = "";
    int slpos, tppos, spos;

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (allsymbol == -1 && OrderSymbol() != _Symbol) continue;
        if (((MagicNumber != -1 && (OrderMagicNumber() == MagicNumber || OrderMagicNumber() == MagicNumber + HedgeMagicNumber)) ||
                MagicNumber == -1) &&
            OrderType() <= OP_SELL) {

            sComment = OrderComment();
            slpos = StringFind(sComment, "[sl]");
            tppos = StringFind(sComment, "[tp]");
            spos = 0;

            if (slpos == 0 || tppos == 0) {
                spos = 4;
                while (StringGetCharacter(sComment, spos) == ' ') spos++;
            }

            int OrderOperation = StrToInteger(B_ReadSInfo(OrderComment(), spos + 11, 1));
            int OrderRule = Rule2Int(B_ReadSInfo(OrderComment(), spos + 10, 1));

            if (rule == -1) {
                if (operation == -1) {
                    if (inperiod == -1)
                        myprofit += OrderProfit();
                    else {
                        if (OrderOpenTime() >= starttime)
                            myprofit += OrderProfit();
                    }
                } else
                if (OrderOperation == operation) {
                    if (inperiod == -1)
                        myprofit += OrderProfit();
                    else {
                        if (OrderOpenTime() >= starttime)
                            myprofit += OrderProfit();
                    }
                }
            } else {
                if (OrderRule == rule) {
                    if (operation == -1) {
                        if (inperiod == -1)
                            myprofit += OrderProfit();
                        else {
                            if (OrderOpenTime() >= starttime)
                                myprofit += OrderProfit();
                        }
                    } else
                    if (StrToInteger(B_ReadSInfo(OrderComment(), spos + 11, 1)) == operation) {

                        if (inperiod == -1) {
                            myprofit += OrderProfit();
                        } else {
                            if (OrderOpenTime() >= starttime) {
                                myprofit += OrderProfit();
                            }
                        }
                    }
                }
            }
        }
    }
    return (myprofit);
}

int ReturnNumberRuleStarted(int rule, int operation) {
    double myprofit = 0;
    string today;
    datetime timemidnight;
    datetime StartDate;
    datetime LastOrderCloseTime = 0;
    datetime PStartDate = -1;
    int nbrrulestart = 0;
    int nbrrulestartd = 0;

    today = TimeToString(CurrentTime, TIME_DATE);
    timemidnight = StrToTime(today);

    S_NbrRuleStart[rule][operation] = 0;
    S_NbrRuleStartD[rule][operation] = 0;

    string sComment = "";
    int slpos, tppos, spos;

    int xtotal = OrdersHistoryTotal();

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderType() <= OP_SELL && OrderSymbol() == _Symbol) {

            sComment = OrderComment();
            slpos = StringFind(sComment, "[sl]");
            tppos = StringFind(sComment, "[tp]");
            spos = 0;

            if (slpos == 0 || tppos == 0) {
                spos = 4;
                while (StringGetCharacter(sComment, spos) == ' ') spos++;
            }

            int OrderOperation = StrToInteger(B_ReadSInfo(OrderComment(), spos + 11, 1));
            int OrderRule = Rule2Int(B_ReadSInfo(OrderComment(), spos + 10, 1));

            if (OrderRule == rule) {
                if (OrderOperation == operation) {
                    if (OrderCloseTime() > LastOrderCloseTime)
                        LastOrderCloseTime = OrderCloseTime();

                    S_LastCloseTime[rule][OrderOperation] = LastOrderCloseTime;

                    StartDate = StrToDouble(B_ReadSInfo(OrderComment(), 0, 10));

                    if (PStartDate != StartDate) {
                        nbrrulestart++;
                        PStartDate = StartDate;
                        S_NbrRuleStart[rule][OrderOperation] = nbrrulestart;

                        if (StartDate >= timemidnight) {
                            nbrrulestartd++;
                            S_NbrRuleStartD[rule][OrderOperation] = nbrrulestartd;
                        }
                    }
                }
            }
        }
    }
    return (nbrrulestart);
}

double ReturnClosedComission() {
    double comission = 0;
    int xtotal = OrdersHistoryTotal();

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderType() <= OP_SELL && OrderSymbol() == _Symbol) {
            comission += OrderCommission();
        }

    }
    return (comission);
}

double ReturnClosedSwap() {
    double swap = 0;
    int xtotal = OrdersHistoryTotal();

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderType() <= OP_SELL && OrderSymbol() == _Symbol) {
            swap += OrderSwap();
        }

    }
    return (swap);
}


void ProcessTrailingStop(int MagicNumber, double BTrailingStop, double STrailingStop, double TrailingStep = 1, double BreakEven = -1) {
    int cnt, total;
    total = OrdersTotal();

    if (total == 0)
        return;

    if (TrailingStep == -1) TrailingStep = 1;

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() == MagicNumber && OrderSymbol() == _Symbol)
            if (OrderType() == OP_BUY) {
                if (BreakEven > 0) {
                    if ((_Bid - OrderOpenPrice()) > BreakEven * SYS_POINT) {
                        if ((OrderStopLoss() - OrderOpenPrice()) < 0) {
                            OrderModify(OrderTicket(), OrderOpenPrice(), OrderOpenPrice() + 0 * SYS_POINT, OrderTakeProfit(), 0, CLR_NONE);
                        }
                    }
                }
                if (BTrailingStop > 0) {
                    if ((_Bid - OrderOpenPrice()) > BTrailingStop * SYS_POINT) {
                        if (OrderStopLoss() < _Bid - (BTrailingStop + TrailingStep - 1) * SYS_POINT) {
                            OrderModify(OrderTicket(), OrderOpenPrice(), _Bid - BTrailingStop * SYS_POINT, OrderTakeProfit(), 0, CLR_NONE);
                            return;
                        }
                    }

                }
            }
        else {
            if (BreakEven > 0) {
                if ((OrderOpenPrice() - _Ask) > BreakEven * SYS_POINT) {
                    if ((OrderOpenPrice() - OrderStopLoss()) < 0) {
                        OrderModify(OrderTicket(), OrderOpenPrice(), OrderOpenPrice() - 0 * SYS_POINT, OrderTakeProfit(), 0, CLR_NONE);
                    }
                }
            }
            if (STrailingStop > 0) {
                if (OrderOpenPrice() - _Ask > STrailingStop * SYS_POINT) {
                    if (OrderStopLoss() > _Ask + (STrailingStop + TrailingStep - 1) * SYS_POINT || OrderStopLoss() == 0) {
                        OrderModify(OrderTicket(), OrderOpenPrice(), _Ask + STrailingStop * SYS_POINT, OrderTakeProfit(), 0, CLR_NONE);
                        return;
                    }
                }

            }
        }
    }
    return;
}

void CancelSLTP(int MagicNumber, int BuyPipStopLoss = 1, int BuyPipTakeProfit = 1, int SellPipStopLoss = 1, int SellPipTakeProfit = 1) {
    int cnt, total;

    double StopLoss = 1;
    double TakeProfit = 1;

    if (BuyPipStopLoss == 0 && BuyPipTakeProfit == 0 && SellPipStopLoss == 0 && SellPipTakeProfit == 0)
        return;

    total = OrdersTotal();

    if (total == 0)
        return;

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() == MagicNumber && OrderSymbol() == _Symbol) {
            if (OrderType() == OP_BUY) {
                if (BuyPipTakeProfit == 0 && BuyPipStopLoss == 1)
                    OrderModify(OrderTicket(), OrderOpenPrice(), 0, OrderTakeProfit(), 0);
                else
                if (BuyPipStopLoss == 0 && BuyPipTakeProfit == 1)
                    OrderModify(OrderTicket(), OrderOpenPrice(), OrderStopLoss(), 0, 0);
                else
                if (BuyPipStopLoss == 1 && BuyPipTakeProfit == 1)
                    OrderModify(OrderTicket(), OrderOpenPrice(), 0, 0, 0);
            } else
            if (OrderType() == OP_SELL) {
                if (SellPipTakeProfit == 0 && SellPipStopLoss == 1)
                    OrderModify(OrderTicket(), OrderOpenPrice(), 0, OrderTakeProfit(), 0);
                else
                if (SellPipStopLoss == 0 && SellPipTakeProfit == 1)
                    OrderModify(OrderTicket(), OrderOpenPrice(), OrderStopLoss(), 0, 0);
                else
                if (SellPipStopLoss == 1 && SellPipTakeProfit == 1)
                    OrderModify(OrderTicket(), OrderOpenPrice(), 0, 0, 0);
            }
        }
    }
    return;
}

void SetSLTP(int MagicNumber, double BuyPipStopLoss = 0, double BuyPipTakeProfit = 0, double SellPipStopLoss = 0, double SellPipTakeProfit = 0) {
    int cnt, total;

    if (BuyPipStopLoss == 0 && BuyPipTakeProfit == 0 && SellPipStopLoss == 0 && SellPipTakeProfit == 0)
        return;

    total = OrdersTotal();

    if (total == 0)
        return;

    double StopLoss = 0;
    double TakeProfit = 0;

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() == MagicNumber && OrderSymbol() == _Symbol) {
            double price = OrderOpenPrice();
            if (OrderType() == OP_BUY) {
                if (BuyPipStopLoss != 0) StopLoss = price - (BuyPipStopLoss * SYS_POINT);
                else StopLoss = OrderStopLoss();
                if (BuyPipTakeProfit != 0) TakeProfit = price + (BuyPipTakeProfit * SYS_POINT);
                else TakeProfit = OrderTakeProfit();
            } else
            if (OrderType() == OP_SELL) {
                if (SellPipStopLoss != 0) StopLoss = price + (SellPipStopLoss * SYS_POINT);
                else StopLoss = OrderStopLoss();
                if (SellPipTakeProfit != 0) TakeProfit = price - (SellPipTakeProfit * SYS_POINT);
                else TakeProfit = OrderTakeProfit();
            }
            OrderModify(OrderTicket(), OrderOpenPrice(), StopLoss, TakeProfit, 0);
        }
    }
    return;
}

bool ModifyOrder(int OrderId, double StopLoss = -1, double TakeProfit = -1) {
    int cnt, total;

    total = OrdersTotal();

    if (total == 0)
        return false;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderTicket() == OrderId && OrderSymbol() == _Symbol) {
            double price = OrderOpenPrice();
            return OrderModify(OrderId, price, StopLoss, TakeProfit, 0);
        }
    }
    return true;
}



int CloseOrders(int MagicNumber = -1, int Operation = -1, double NbrLots = -1, double FromPrice = -1, int Mode = -1, int Pending = -1) {
    int cnt, total;
    double nbrlots;
    int ordertype;

    total = OrdersTotal();

    if (total == 0) return (0);

    for (cnt = 0; cnt < total; cnt++) {
        if (OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES)) {
            if (MagicNumber != -1 && OrderMagicNumber() != MagicNumber) continue;

            if (OrderSymbol() != _Symbol) continue;

            if (Pending == -1 && ordertype > OP_SELL) continue;

            if (FromPrice != -1 && Mode == MODE_LOWER && OrderOpenPrice() >= FromPrice) continue;
            if (FromPrice != -1 && Mode == MODE_UPPER && OrderOpenPrice() <= FromPrice) continue;

            ordertype = OrderType();

            if (NbrLots == -1) nbrlots = OrderLots();
            else nbrlots = NbrLots;

            if (Operation == -1) {
                if (ordertype <= OP_SELL) {
                    if (ordertype == OP_BUY) {
                        OrderClose(OrderTicket(), nbrlots, _Bid, SYS_SLIPPAGE, Violet);
                    } else //OP_SELL
                        if (ordertype == OP_SELL) {
                            OrderClose(OrderTicket(), nbrlots, _Ask, SYS_SLIPPAGE, Violet);
                        }
                    else
                    if (Pending != -1 && (ordertype == OP_SELLLIMIT || ordertype == OP_SELLSTOP || ordertype == OP_BUYLIMIT || ordertype == OP_BUYSTOP)) {
                        OrderDelete(OrderTicket());
                    }
                }
            } // if ordertype
            else
            if (Operation == OP_BUY) {
                if (ordertype == OP_BUY) {
                    OrderClose(OrderTicket(), nbrlots, _Bid, SYS_SLIPPAGE, Violet);
                } else
                if (Pending != -1 && (ordertype == OP_BUYLIMIT || ordertype == OP_BUYSTOP)) {
                    OrderDelete(OrderTicket());
                }
            } else
            if (Operation == OP_SELL) {
                if (ordertype == OP_SELL) {
                    OrderClose(OrderTicket(), nbrlots, _Ask, SYS_SLIPPAGE, Violet);
                } else
                if (Pending != -1 && (ordertype == OP_SELLLIMIT || ordertype == OP_SELLSTOP)) {
                    OrderDelete(OrderTicket());
                }
            }
        }
    } // for
    return (0);
}

int OrderTrade(double price, int mode, double Lots, string comment, int MagicNumber, double PipStopLoss = 0, double PipTakeProfit = 0) {
    int error = 0;
    int ticket = -1;
    int times = 5;
    double StopLoss = 0;
    double TakeProfit = 0;

    while (times > 0) {
        error = 0;
        if (mode == OP_BUY || mode == OP_BUYLIMIT || mode == OP_BUYSTOP) {
            if (mode == OP_BUY) price = _Ask;
            if (PipStopLoss != 0) StopLoss = price - (PipStopLoss * SYS_POINT);
            if (PipTakeProfit != 0) TakeProfit = price + (PipTakeProfit * SYS_POINT);
        } else
        if (mode == OP_SELL || mode == OP_SELLLIMIT || mode == OP_SELLSTOP) {
            if (mode == OP_SELL) price = _Bid;
            if (PipStopLoss != 0) StopLoss = price + (PipStopLoss * SYS_POINT);
            if (PipTakeProfit != 0) TakeProfit = price - (PipTakeProfit * SYS_POINT);
        }

        //ECN Mode Watch SL & TP
        if (ticket <= 0)
            ticket = OrderSend(_Symbol, mode, Lots, price, SYS_SLIPPAGE, 0, 0, comment, MagicNumber, 0, Green);
        if (ticket > 0) {
            if (StopLoss != 0 || TakeProfit != 0) {
                if (OrderSelect(ticket, SELECT_BY_TICKET) == false ||
                    OrderModify(OrderTicket(), OrderOpenPrice(), StopLoss, TakeProfit, 0) == false) {
                    error = GetLastError();
                    PG_Print(TYPE_ERROR, "OrderModify failed: " + OpName[mode] + " : " + ErrorDescription(error));
                    error = -1;
                    break;
                } else {
                    PG_Print(TYPE_INFO, OpName[mode] + " order modified : " + StopLoss + " " + TakeProfit);
                    break;
                }
            } else {
                PG_Print(TYPE_INFO, OpName[mode] + " order opened : " + price);
                break;
            }
        } else {
            error = GetLastError();
            PG_Print(TYPE_ERROR, "Error opening order : " + OpName[mode] + " " + Lots + " : " + ErrorDescription(error));
            //if(error == 134, 131  || occurence == -1) break;
            if (error == 131 || error == 134 || error == 4051 || error == 4109) break;
            //         if(error == ERR_NOT_ENOUGH_MONEY || error = ERR_INVALID_TRADE_VOLUME) break;

            RefreshRates();
        }
        times--;
    }
    return (error);
}


/////////////////////////////////// ENGINE ////////////////////////////////

bool AndE(int Engine, int attribute) {
    int index = attribute >> 5;
    int result = 0;

    result |= (1 << (attribute & 31));

    return ((EngineTab[Engine][index] & result) == result);
}

bool OrE(int Engine, int attribute) {
    int result = 0;
    int index = attribute >> 5;

    result |= (1 << (attribute & 31));

    return ((EngineTab[Engine][index] & result) != 0);
}

void Set_Engine(int Engine, int attribute, int signal, double value = -1) //if automatic  0 else 1  
{
    if (Engine == -1) return;
    int index = attribute >> 5;

    if (signal == P_SIGNAL)
        EngineTab[Engine][index] |= (1 << (attribute & 31));
    else
        EngineTab[Engine][index] &= ~(1 << (attribute & 31));

    if (value != -1)
        Set_Engine_Value(Engine, attribute, value);
}

int Get_Engine(int Engine, int attribute) {
    int index = attribute >> 5;
    return (EngineTab[Engine][index] & (1 << (attribute & 31)));
}

double Set_Engine_Value(int Engine, int attribute, double Value) {
    EngineTabValue[Engine][attribute] = Value;
    return (Value);
}

double EValue(int Engine, int attribute) {
    return (EngineTabValue[Engine][attribute]);
}


void ReloadFilters() {
    ResetSignalFilters();
    int result = LoadFilters();
    if (result == -1)
        Send_Operation("Filters can not be reloaded");
    else {
        Send_Operation("Signals for Filter are set");
    }
}

int hexToInteger(string str) {
    int result = 0;
    int power = 0;
    for (int pos = StringLen(str) - 1; pos >= 0; pos--) {

        int c = StringGetCharacter(str, pos);
        int value = 0;
        if (c >= '0' && c <= '9')
            value = c - '0';
        else if (c >= 'a' && c <= 'f')
            value = c - 'a' + 10;
        else if (c >= 'A' && c <= 'F')
            value = c - 'A' + 10;

        result += value * MathPow(16.0, power);
        power++;
    }
    return (result);
}

int LoadRuleFilters() {
    DownloadFile("PG_RuleFilters.csv");
    int file = FileOpen("PG_RuleFilters.csv", FILE_READ | FILE_CSV, ',');

    if (file == -1) {
        return (-1);
    }
    if (FileSize(file) == 0) {
        FileClose(file);
        return (1);
    }

    //skip 1 first lines
    int i = 0;
    while (i < 3) {
        FileReadString(file);
        i++;
    }
    while (!FileIsEnding(file)) {
        int Operation = Operation2Int(FileReadString(file));
        int Field = StrToInteger(FileReadString(file));
        int Rule = Rule2Int(FileReadString(file));
        SetRuleFilter(1, Operation, -1, Rule);
    }
    FileClose(file);
    return (1);

}

int LoadUsedObjects() {
    // USED OBJECTS 

    DownloadFile("PG_UObjects.csv");
    int file = FileOpen("PG_UObjects.csv", FILE_SHARE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_INFO, "UObjects file doesnt exit ", NO_SEND);
        return (-1);
    }

    for (int i = 0; i < NBR_OBJECTS; i++)
        ObjUsed[i] = false;

    if (FileSize(file) == 0) {
        FileClose(file);
        return 0;
    }
    i = 0;
    while (!FileIsEnding(file)) {
        string sobject = FileReadString(file);
        int ind = Object2Index(sobject);
        ObjUsed[ind] = true;
    }

    FileClose(file);
    return (1);
}


int NextEntrySchedule(int rule, int operation) {
    int i = 0;
    while (i < NBR_SCHEDULES)
        if (S_StartM[rule][operation][i] == 0) return (i);
        else i++;
    return (-1);
}



void ResetSchedules() {
    for (int i = 0; i < NBR_RULES; i++)
        for (int k = 0; k < NBR_SCHEDULES; k++)
            for (int j = 0; j < 3; j++) {
                S_StartM[i][j][k] = 0;
                S_StartW[i][j][k] = -1;
                S_StartD[i][j][k] = -1;
                S_StartT[i][j][k] = -1;
                S_EndM[i][j][k] = -1;
                S_EndW[i][j][k] = -1;
                S_EndD[i][j][k] = -1;
                S_EndT[i][j][k] = -1;
                S_FrequencyD[i][j][k] = -1;
                S_OnSameBar[i][j][k] = -1;

            }
}


bool OnSameBar (int period, datetime time) {
 //   printf ("Function on same bar");
 //   printf ("period : %d, currenttime %d, time %d, hour/4 : %d, timehour/4 %d", period, CurrentTime,  time, Hour(), TimeHour(time));
    switch (period) {
        case P_M1 :
        if (CurrentTime - time < 60 && Minute() == TimeMinute(time))
            return true;     
        break;
        case P_M5 :
         if (CurrentTime - time < 60 * 5 && Minute() / 5 == TimeMinute(time) / 5)
        break;
        case P_M15 :
            if (CurrentTime - time < 60 * 15 && Minute() / 15 == TimeMinute(time) / 15)
                return true;
        break;
        case P_M30 :
            if (CurrentTime - time < 60 * 30 && Minute() / 30 == TimeMinute(time) / 30)
                return true;
        break;
        case P_H1 :
            if (CurrentTime - time < 60 * 60 && Hour() == TimeHour(time))       
                return true;
        break;
        case P_H4 :
            if (CurrentTime - time < 60 * 60 * 4 && Hour() / 4 == TimeHour(time) / 4)       
                return true;
        break;
        case P_D1 :
            if (DayOfYear() == TimeDayOfYear(time))       
                return true;
        break;
        case P_W1 :
            if (DayOfWeek() == TimeDayOfWeek(time))       
                return true;
        break;
        case P_MN :
            if (Month() == TimeMonth(time))       
                return true;
        break;
        }
    return false;        
}


int SeeIfRuleInSchedule(int rule, int Operation) {
    bool OnSameBar = true;
    for (int k = 0; k < NBR_SCHEDULES; k++) {
/*   
       if (k == 0) {
                printf ("schedule-----------------------");
                Print(Hour() + " " +  TimeHour(S_StartT[rule][Operation][k]));                
                Print(Hour() + " " +  TimeHour(S_EndT[rule][Operation][k]));                
                }
 */      

        if (S_StartM[rule][Operation][k] == 0 && k == 0) return (1); // no schedule means all the time
        
        if (S_StartM[rule][Operation][k] == 0) return (-1); // read all schedules and nothing corresponds

        if (S_StartM[rule][Operation][k] != -1 && S_StartM[rule][Operation][k] > Month()) continue;

        if (S_EndM[rule][Operation][k] != -1 && S_EndM[rule][Operation][k] < Month()) continue;

        if (S_StartM[rule][Operation][k] != -1 && S_EndM[rule][Operation][k] != -1 && S_StartM[rule][Operation][k] > S_EndM[rule][Operation][k]) {
            PG_Print(TYPE_ERROR, "Error in Month Format Start Month bigger than end Month : " + S_StartM[rule][Operation][k] + ", " + S_EndM[rule][Operation][k], NO_SEND);
            continue;
        }

        if (S_StartW[rule][Operation][k] != -1 && S_StartW[rule][Operation][k] > ReturnDayOccurenceInMonth()) continue;

        if (S_EndW[rule][Operation][k] != -1 && S_EndW[rule][Operation][k] < ReturnDayOccurenceInMonth()) continue;

        if (S_StartW[rule][Operation][k] != -1 && S_EndW[rule][Operation][k] != -1 && S_StartW[rule][Operation][k] > S_EndW[rule][Operation][k]) {
            PG_Print(TYPE_ERROR, "Error in Week Format Start Week bigger than end Week : " + S_StartW[rule][Operation][k] + ", " + S_EndW[rule][Operation][k], NO_SEND);
            continue;
        }

        if (S_StartD[rule][Operation][k] != -1 && S_StartD[rule][Operation][k] > DayOfWeek()) continue;

        if (S_EndD[rule][Operation][k] != -1 && S_EndD[rule][Operation][k] < DayOfWeek()) continue;

        if (S_StartD[rule][Operation][k] != -1 && S_EndD[rule][Operation][k] != -1 && S_StartD[rule][Operation][k] > S_EndD[rule][Operation][k]) {
            PG_Print(TYPE_ERROR, "Error in Day Format Start Day bigger than end Day : " + S_StartD[rule][Operation][k] + ", " + S_EndD[rule][Operation][k], NO_SEND);
            continue;
        }

        if (S_StartT[rule][Operation][k] != -1) {
        
            if (Hour() < TimeHour(S_StartT[rule][Operation][k])) continue;
            if (Hour() == TimeHour(S_StartT[rule][Operation][k])&& Minute() < TimeMinute(S_StartT[rule][Operation][k])) continue;
        }

        if (S_EndT[rule][Operation][k] != -1) {
            if (Hour() > TimeHour(S_EndT[rule][Operation][k])) continue;
            if (Hour() == TimeHour(S_EndT[rule][Operation][k]) && Minute() >= TimeMinute(S_EndT[rule][Operation][k])) continue;
        }

        if (S_StartT[rule][Operation][k] != -1 && S_EndT[rule][Operation][k] != -1) {
            if (TimeHour(S_StartT[rule][Operation][k]) > TimeHour(S_EndT[rule][Operation][k]) ||
                (TimeHour(S_StartT[rule][Operation][k]) == TimeHour(S_EndT[rule][Operation][k]) && TimeMinute(S_StartT[rule][Operation][k]) > TimeMinute(S_EndT[rule][Operation][k]))) {           
                PG_Print(TYPE_ERROR, "Error in Time Format Start Time bigger than End Time : " + S_StartT[rule][Operation][k] + ", " + S_EndT[rule][Operation][k], NO_SEND);
                continue;
            }                        
        }  
        if (S_OnSameBar[rule][Operation][k]!= -1 && OnSameBar (CurrentPeriod, S_LastCloseTime[rule][Operation])) continue;
              
       
        if (S_BetweenT[rule][Operation][k] != -1 && CurrentTime - S_LastCloseTime[rule][Operation] < S_BetweenT[rule][Operation][k] * 60) continue;

        if (S_FrequencyD[rule][Operation][k] != -1 && (S_FrequencyD[rule][Operation][k] == 0 || S_NbrRuleStartD[rule][Operation] >= S_FrequencyD[rule][Operation][k])) continue;

        return (k);
    }
    return -1;
}

int GetEngine(int startrule, int operation) {
    for (int i = 0; i < E_NbrEngine; i++)
        if (EValue(i, B_STARTRULE) == startrule && EValue(i, B_OPERATION) == operation)
            return (i);
    return (-1);
}

void ReadEngineFlag(int Engine, string saveinfo1, string saveinfo2) {
    int flags1 = StrToInteger(saveinfo1);
    int flags2 = StrToInteger(saveinfo2);

    EngineTab[Engine][0] = flags1;
    EngineTab[Engine][1] = flags2;

}

string SaveEngineFlag(int Engine) {
    return (DoubleToString(EngineTab[Engine][0], 0) + "*" + DoubleToString(EngineTab[Engine][1], 0) + "*");
}

//////////////////////////////// ENGINES TCP

void CloseAll(int operation, int closeoperation) {
    bool noclose;
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == true) continue;
        noclose = false;

        if (operation == OP_BUYSELL) // buy and sell 
        {

            if (closeoperation == 0) B_CloseSession(i, -1); // close all sessions 
            else
            if (closeoperation == -1 && B_SessionProfit[i] < 0) B_CloseSession(i, -1); // close all sessions with negatif result           
            else
            if (closeoperation == 1 && B_SessionProfit[i] > 0) B_CloseSession(i, -1); // close all sessions with positif results
            else noclose = true;
        } else
        if (operation == OP_BUY) // closing buy 
        {
            if (closeoperation == 0) B_CloseSession(i, OP_BUY); // close all buy in sessions 
            else
            if (closeoperation == -1 && B_BuyProfit[i] < 0) B_CloseSession(i, OP_BUY); // close all sessions with negatif result           
            else
            if (closeoperation == 1 && B_BuyProfit[i] > 0) B_CloseSession(i, OP_BUY); // close all sessions with positif results
            else noclose = true;
        } else
        if (operation == OP_SELL) // closing sell
        {

            if (closeoperation == 0) B_CloseSession(i, OP_SELL); // close all sell in sessions 
            else
            if (closeoperation == -1 && B_SellProfit[i] < 0) B_CloseSession(i, OP_SELL); // close all sessions with negatif result           
            else
            if (closeoperation == 1 && B_SellProfit[i] > 0) B_CloseSession(i, OP_SELL); // close all sessions with positif results
            else noclose = true;
        }

    }
}

void ExitAll(int operation, int closeoperation, int StopTrading = 0) {
    bool noclose;
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == true) continue;
        //		if (B_StartOnRule[i] == R_MANUAL)   continue;

        int engine = GetEngine(B_StartOnRule[i], B_Operation[i]);
        if (engine == -1) {
            engine = EngineManual;
        }

        noclose = false;
        if (operation == OP_BUYSELL) // buy and sell 
        {

            if (closeoperation == 0) B_ExitSession(i, -1); // close all sessions 
            else
            if (closeoperation == -1 && B_SessionProfit[i] < 0) B_ExitSession(i, -1); // close all sessions with negatif result           
            else
            if (closeoperation == 1 && B_SessionProfit[i] > 0) B_ExitSession(i, -1); // close all sessions with positif results
            else noclose = true;
        } else
        if (operation == OP_BUY) // closing buy 
        {
            if (closeoperation == 0) B_ExitSession(i, OP_BUY); // close all buy in sessions 
            else
            if (closeoperation == -1 && B_BuyProfit[i] < 0) B_ExitSession(i, OP_BUY); // close all sessions with negatif result           
            else
            if (closeoperation == 1 && B_BuyProfit[i] > 0) B_ExitSession(i, OP_BUY); // close all sessions with positif results
            else noclose = true;
        } else
        if (operation == OP_SELL) // closing sell
        {

            if (closeoperation == 0) B_ExitSession(i, OP_SELL); // close all sell in sessions 
            else
            if (closeoperation == -1 && B_SellProfit[i] < 0) B_ExitSession(i, OP_SELL); // close all sessions with negatif result           
            else
            if (closeoperation == 1 && B_SellProfit[i] > 0) B_ExitSession(i, OP_SELL); // close all sessions with positif results
            else noclose = true;
        }

        if (!noclose && !StopTrading) // don't let automatic start for sessions ended ... 
            Set_Engine(engine, B_STARTAUTOMATIC, P_NOSIGNAL); // if we close something no session get started automatically

    }
}

void HedgeAll(int operation, int hedgeoperation) {
    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == true) continue;
        if (operation == OP_BUYSELL) {
            B_HedgeSession(i, hedgeoperation, OP_BUY);
            B_HedgeSession(i, hedgeoperation, OP_SELL);
        } else
            B_HedgeSession(i, hedgeoperation, operation);

        B_HedgeAutomatic[i] = false;
        B_DeHedgeAutomatic[i] = false;
    }
}

void SuspendEngine(int enginenumber, bool operation) {
    if (enginenumber == -1) {
        for (int i = 0; i < E_NbrEngine; i++) {
            B_SuspendSessions(EValue(i, B_STARTRULE), EValue(i, B_OPERATION), operation);
            Set_Engine(i, B_BUYSELLAUTOMATIC, !operation);
        }
        if (operation == 1) Send_Operation("OK Suspend all engines" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Resume all engines" + " for Currency : " + SYS_SYMBOL);
    } else {
        B_SuspendSessions(EValue(enginenumber, B_STARTRULE), EValue(enginenumber, B_OPERATION), operation);
        Set_Engine(enginenumber, B_BUYSELLAUTOMATIC, !operation);
        if (operation == 1) Send_Operation("OK Suspend for " + EngineName[enginenumber] + " engine");
        else Send_Operation("OK Resume for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
    }
}

void AutoHedgeEngine(int enginenumber, int operation) {
    if (enginenumber == -1) {
        for (int i = 0; i < E_NbrEngine; i++) {
            B_AutoHedgeSessions(EValue(i, B_STARTRULE), EValue(i, B_OPERATION), operation);
            Set_Engine(i, B_HEDGEAUTOMATIC, operation);
        }
        if (operation == 1) Send_Operation("OK Automatic Hedge for all engines" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Hedge for all engines" + " for Currency : " + SYS_SYMBOL);
    } else {
        B_AutoHedgeSessions(EValue(enginenumber, B_STARTRULE), EValue(enginenumber, B_OPERATION), operation);
        Set_Engine(enginenumber, B_HEDGEAUTOMATIC, operation);
        if (operation == 1) Send_Operation("OK Automatic Hedge for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Hedge for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
    }
}

void AutoDeHedgeEngine(int enginenumber, int operation) {
    if (enginenumber == -1) {
        for (int i = 0; i < E_NbrEngine; i++) {
            B_AutoDeHedgeSessions(EValue(i, B_STARTRULE), EValue(i, B_OPERATION), operation);
            Set_Engine(i, B_DEHEDGEAUTOMATIC, operation);
        }
        if (operation == 1) Send_Operation("OK Automatic Dehedge for all engines" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Dehedge for all engines" + " for Currency : " + SYS_SYMBOL);
    } else {
        B_AutoDeHedgeSessions(EValue(enginenumber, B_STARTRULE), EValue(enginenumber, B_OPERATION), operation);
        Set_Engine(enginenumber, B_DEHEDGEAUTOMATIC, operation);
        if (operation == 1) Send_Operation("OK Automatic Dehedge for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Dehedge for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
    }
}

void AutoExitEngine(int enginenumber, int operation) {
    if (enginenumber == -1) {
        for (int i = 0; i < E_NbrEngine; i++) {
            B_AutoExitSessions(EValue(i, B_STARTRULE), EValue(i, B_OPERATION), operation);
            Set_Engine(i, B_EXITAUTOMATIC, operation);
        }
        if (operation == 1) Send_Operation("OK Automatic Close for all engines" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Close for all engines" + " for Currency : " + SYS_SYMBOL);
    } else {
        B_AutoExitSessions(EValue(enginenumber, B_STARTRULE), EValue(enginenumber, B_OPERATION), operation);
        Set_Engine(enginenumber, B_EXITAUTOMATIC, operation);
        if (operation == 1) Send_Operation("OK Automatic Close for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Close for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
    }
}

void AutoStartEngine(int enginenumber, int operation) {
    if (enginenumber == -1) {
        for (int i = 0; i < E_NbrEngine; i++) {
            Set_Engine(i, B_STARTAUTOMATIC, operation);
        }
        if (operation == 1) Send_Operation("OK Automatic Start for all engines" + " for Currency : " + SYS_SYMBOL);
        else Send_Operation("OK Manual Start for all engines" + " for Currency : " + SYS_SYMBOL);
    } else {
        Set_Engine(enginenumber, B_STARTAUTOMATIC, operation);
        if (operation == 1)
            Send_Operation("OK Automatic Start for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
        else
            Send_Operation("OK Manual Start for " + EngineName[enginenumber] + " engine" + " for Currency : " + SYS_SYMBOL);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

void SuspendAllEngines(bool operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            B_SuspendSession(i, operation);
}


void TreatEngines() {
    B_start1();
}
/////////////////////////////////////////////////// INDICATOR FILE 

void custom(int x, int Object, int shift = 0) {
    CheckCustomTrend(x, Object, shift);

}

int log2(int x) {
    int i = 0;
    while ((x / 2) >= 1) {
        x = x / 2;
        i++;
    }
    return (i);
}

void CheckCustomTrend(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double uptrend = 0;
    double downtrend = 0;

    double puptrend = 0;
    double pdowntrend = 0;

    double trend = 0;
    double ptrend = 0;
    double pptrend = 0;

    double sidewaytrend = 0;
    double psidewaytrend = 0;

    double angleshift;
    double pangleshift;

    int i = 0;

    double dFactor = 3.14159 / 180.0;
    double mFactor = 10000.0;

    int ShiftDif = AngleShift;
    mFactor /= ShiftDif;

    int valueuptrend = log2(ObjValue[Object][UPTREND]);
    int valuedowntrend = log2(ObjValue[Object][DOWNTREND]);
    int valuesidewaytrend = log2(ObjValue[Object][SIDEWAYTREND]);
    int valuetrend = log2(ObjValue[Object][TREND]);

    switch (ObjDisplayType[Object]) {
    case TRENDLINE_TYPE:
    case HISTOGRAM_TYPE:
        if (ObjValue[Object][UPTREND] != 0) {
            uptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valueuptrend, shift);
            puptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valueuptrend, shift + 1);
        }
        if (ObjValue[Object][DOWNTREND] != 0) {
            downtrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuedowntrend, shift);
            pdowntrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuedowntrend, shift + 1);
        }
        if (ObjValue[Object][SIDEWAYTREND] != 0) {
            sidewaytrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuesidewaytrend, shift);
            psidewaytrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuesidewaytrend, shift + 1);
        }
        if (ObjValue[Object][TREND] != 0) {

            trend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuetrend, shift);
            ptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuetrend, shift + 1);
            pptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuetrend, shift + 2);

            if (ObjDisplayType[Object] == TRENDLINE_TYPE) {
                angleshift = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuetrend, AngleShift + shift);
                pangleshift = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], valuetrend, 2 * AngleShift + shift);
                SETSIGNAL(shift, ObjectId, S_ANGLE, x, P_SIGNAL, MathArctan(mFactor * (trend - angleshift)) / dFactor);
                SETSIGNAL(shift, ObjectId, S_PANGLE, x, P_SIGNAL, MathArctan(mFactor * (angleshift - pangleshift)) / dFactor);
            }
            SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
            SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
        }
        // UP
        if (ObjValue[Object][UPTREND] != 0) {
            if (uptrend != EMPTY_VALUE && uptrend != 0) {
                SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, uptrend);
                SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL, uptrend);                
                SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, uptrend);
                trend = uptrend;
                //               if (Object == 69 && x == 0) Print ("ARROW uptrend" + uptrend);

            }
            if (puptrend != EMPTY_VALUE && puptrend != 0) {
                SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, puptrend);
                if (uptrend == EMPTY_VALUE && uptrend != 0) {
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, puptrend);
                }
                ptrend = puptrend;
            }
        } else
        if (ObjValue[Object][TREND] != 0) {
            if (trend > ptrend) {
                SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);
                SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL, trend);
                if (pptrend <= ptrend) {
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
                }
            }
        }
        /// DOWN         
        if (ObjValue[Object][DOWNTREND] != 0) {
            if (downtrend != EMPTY_VALUE && downtrend != 0) {
                SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, downtrend);
                SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL, downtrend);                
                SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, downtrend);
                trend = downtrend;
                //             if (Object == 69 && x == 0) Print ("ARROW downtrend" + downtrend);

            }
            if (pdowntrend != EMPTY_VALUE && pdowntrend != 0) {
                SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, pdowntrend);
                if (downtrend == EMPTY_VALUE && downtrend != 0) {
                    Set_Signal(ObjectId, S_CHANGED, x, P_SIGNAL, pdowntrend);
                }
                ptrend = pdowntrend;
            }

        } else
        if (ObjValue[Object][TREND] != 0) {
            if (trend < ptrend) {
                SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);
                SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL, downtrend);                
                if (pptrend >= ptrend) {
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
                }
            }
        }
        // SIDEWAY         
        if (ObjValue[Object][SIDEWAYTREND] != 0) {
            if (sidewaytrend != EMPTY_VALUE && sidewaytrend != 0) {
                SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, sidewaytrend);
                SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, sidewaytrend);
                trend = sidewaytrend;
            }
            if (psidewaytrend != EMPTY_VALUE && psidewaytrend != 0) {
                SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, psidewaytrend);
                if (sidewaytrend == EMPTY_VALUE && sidewaytrend != 0) {
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
                }
                ptrend = psidewaytrend;
            }

        } else
        if (ObjValue[Object][TREND] != 0) {
            if (pptrend != ptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
            if (ptrend == trend) {
                SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
            }
        }
        CheckTrendAbove(x, Object, trend, ptrend, shift);
        break;
    case BULLBEAR_TYPE:

        if (ObjValue[Object][UPTREND] != 0) {
            for (i = 0; i <= 7; i++) {
                if (ObjValue[Object][UPTREND] & (1 << (i))) {
                    double cuptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], i, shift);
                    if (cuptrend == EMPTY_VALUE) cuptrend = 0;

                    uptrend = cuptrend || uptrend;

                    int cpuptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], i, shift + 1);
                    if (cpuptrend == EMPTY_VALUE) cpuptrend = 0;

                    puptrend = cpuptrend || puptrend;
                }
            }

            if (uptrend != 0) {

                SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
                if (puptrend == 0)
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
                trend = uptrend;
            }
        }
        if (ObjValue[Object][DOWNTREND] != 0) {
            for (i = 0; i <= 7; i++) {
                if (ObjValue[Object][DOWNTREND] & (1 << (i))) {
                    double cdowntrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], i, shift);
                    if (cdowntrend == EMPTY_VALUE) cdowntrend = 0;

                    downtrend = cdowntrend || downtrend;

                    int cpdowntrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], i, shift + 1);
                    if (cpdowntrend == EMPTY_VALUE) cpdowntrend = 0;

                    pdowntrend = cpdowntrend || pdowntrend;
                }
            }
            if (downtrend != 0) {
                SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
                if (pdowntrend == 0)
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
                trend = downtrend;

            }

        }
        if (ObjValue[Object][TREND] != 0) {
            for (i = 0; i <= 7; i++) {

                if (ObjValue[Object][TREND] & (1 << (i))) {
                    int ctrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], i, shift);
                    if (ctrend == EMPTY_VALUE) ctrend = 0;

                    trend = ctrend || trend;

                    int cptrend = iCustom(NULL, PeriodIndex[x], ObjProgName[Object], i, shift + 1);
                    if (cptrend == EMPTY_VALUE) cptrend = 0;

                    ptrend = cptrend || ptrend;

                }
            }
            if (trend < 0) {
                if (ptrend > 0)
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
                SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
            } else
            if (trend > 0) {
                if (ptrend < 0)
                    SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
                SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
            }
        }
        break;

    }

}

void CheckTrendAbove(int x, int Object, double trend, double ptrend, int shift = 0) {
    int ObjectId = ObjId[Object];

    switch (ObjDisplay[Object]) {
    case MAIN_DISPLAY:
        SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, LastClose[shift][x] - trend);

        if (iOpen(NULL, PeriodIndex[x], shift) < trend && iHigh(NULL, PeriodIndex[x], shift) > trend) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, trend);
        }

        if (iOpen(NULL, PeriodIndex[x], shift) > trend && iLow(NULL, PeriodIndex[x], shift) < trend) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, trend);
        }

        if (Upper(trend, 0)) {
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL, trend);
            if (MathAbs(LastClose[shift][x] - trend) < AlertDistance[x]) {
                SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, LastClose[shift][x] - trend);
            }
        } else
        if (Lower(trend, 0)) {
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL, trend);;
            SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, LastClose[shift][x] - trend);
            if (MathAbs(LastClose[shift][x] - trend) < AlertDistance[x]) {
                SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, trend - LastClose[shift][x]);
            }
        } else {
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL, LastClose[shift][x]);
        }
        break;
    case SEPERATE_DISPLAY:
        CheckLevels(x, Object, trend, ptrend, shift);
        break;
    }
}

void CheckLevels(int x, int Object, double trend, double ptrend, int shift = 0) {
    int ObjectId = ObjId[Object];

    if (ObjLevel[Object][DOWNLEVEL1][x] != EMPTY_VALUE) {
        if (trend < ObjLevel[Object][DOWNLEVEL1][x])
            if (ObjLevelType[Object] == OVERBOUGHTOVERSOLD_LEVEL)
                SETSIGNAL(shift, ObjectId, S_EXT_OVERSOLD, x, P_SIGNAL);
            else
                SETSIGNAL(shift, ObjectId, S_VERYWEAK, x, P_SIGNAL);
    }
    if (ObjLevel[Object][UPLEVEL1][x] != EMPTY_VALUE) {
        if (trend > ObjLevel[Object][UPLEVEL1][x])
            if (ObjLevelType[Object] == OVERBOUGHTOVERSOLD_LEVEL)
                SETSIGNAL(shift, ObjectId, S_EXT_OVERBOUGHT, x, P_SIGNAL);
            else
                SETSIGNAL(shift, ObjectId, S_VERYSTRONG, x, P_SIGNAL);
    }

    if (ObjLevel[Object][DOWNLEVEL][x] != EMPTY_VALUE) {
        if (trend < ObjLevel[Object][DOWNLEVEL][x])
            if (ObjLevelType[Object] == OVERBOUGHTOVERSOLD_LEVEL)
                SETSIGNAL(shift, ObjectId, S_OVERSOLD, x, P_SIGNAL);
            else
                SETSIGNAL(shift, ObjectId, S_WEAK, x, P_SIGNAL);
    }
    if (ObjLevel[Object][UPLEVEL][x] != EMPTY_VALUE) {
        if (trend > ObjLevel[Object][UPLEVEL][x])
            if (ObjLevelType[Object] == OVERBOUGHTOVERSOLD_LEVEL)
                SETSIGNAL(shift, ObjectId, S_OVERBOUGHT, x, P_SIGNAL);
            else
                SETSIGNAL(shift, ObjectId, S_STRONG, x, P_SIGNAL);
    }

    if (ObjLevel[Object][DOWNLEVEL][x] != EMPTY_VALUE &&
        ObjLevel[Object][UPLEVEL][x] != EMPTY_VALUE) {
        if (trend >= ObjLevel[Object][DOWNLEVEL][x] &&
            trend <= ObjLevel[Object][UPLEVEL][x]) {
            if (ObjLevelType[Object] == OVERBOUGHTOVERSOLD_LEVEL)
                SETSIGNAL(shift, ObjectId, S_RANGE, x, P_SIGNAL);
            else
                SETSIGNAL(shift, ObjectId, S_NEUTRAL, x, P_SIGNAL);
        }
    }

    if (ObjLevel[Object][MIDLEVEL][x] != EMPTY_VALUE) {
        if (trend < ObjLevel[Object][MIDLEVEL][x])
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
        else
        if (trend > ObjLevel[Object][MIDLEVEL][x])
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
        else
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL);

        if (ptrend < ObjLevel[Object][MIDLEVEL][x] && trend > ObjLevel[Object][MIDLEVEL][x])
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL);
        if (ptrend > ObjLevel[Object][MIDLEVEL][x] && trend < ObjLevel[Object][MIDLEVEL][x])
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL);
    }
}

double ma(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double trend = iMA(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], ObjMethod[Object], ObjApply[Object], shift);
    double angleshift = iMA(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], ObjMethod[Object], ObjApply[Object], AngleShift + shift);
    double pangleshift = iMA(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], ObjMethod[Object], ObjApply[Object], 2 * AngleShift + shift);

    double ptrend = iMA(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], ObjMethod[Object], ObjApply[Object], shift + 1);
    double pptrend = iMA(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], ObjMethod[Object], ObjApply[Object], shift + 2);

    double dFactor = 3.14159 / 180.0;
    double mFactor = 10000.0;
    int ShiftDif = AngleShift;

    mFactor /= ShiftDif;

    SETSIGNAL(shift, ObjectId, S_ANGLE, x, P_SIGNAL, MathArctan(mFactor * (trend - angleshift)) / dFactor);
    SETSIGNAL(shift, ObjectId, S_PANGLE, x, P_SIGNAL, MathArctan(mFactor * (angleshift - pangleshift)) / dFactor);

    if (trend > ptrend) {
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);

        if (pptrend <= ptrend) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
        }
    } else
    if (trend < ptrend) {
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);

        if (pptrend >= ptrend) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);

        }
    } else {
        if (pptrend != ptrend) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
        }
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
    }

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
    SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, LastClose[shift][x] - trend);

    if (iOpen(NULL, PeriodIndex[x], shift) < trend && iHigh(NULL, PeriodIndex[x], shift) > trend) {
        SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, trend);
    }

    if (iOpen(NULL, PeriodIndex[x], shift) > trend && iLow(NULL, PeriodIndex[x], shift) < trend) {
        SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, trend);
    }

    if (Upper(trend, 0)) {

        SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL, trend);
        if (MathAbs(LastClose[shift][x] - trend) < AlertDistance[x]) {
            SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, LastClose[shift][x] - trend);
        }
    } else
    if (Lower(trend, 0)) {
        SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL, trend);
        if (MathAbs(LastClose[shift][x] - trend) < AlertDistance[x]) {
            SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, trend - LastClose[shift][x]);
        }
    } else {
        SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL, LastClose[shift][x]);
    }
}

void bb(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    if (ObjMode[Object] == MODE_MAIN) return (ma(x, Object, shift));

    double trend = iBands(NULL, PeriodIndex[x], ObjPeriod[Object], ObjDeviations[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], shift);
    double angleshift = iBands(NULL, PeriodIndex[x], ObjPeriod[Object], ObjDeviations[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], AngleShift + shift);
    double pangleshift = iBands(NULL, PeriodIndex[x], ObjPeriod[Object], ObjDeviations[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], 2 * AngleShift + shift);

    double ptrend = iBands(NULL, PeriodIndex[x], ObjPeriod[Object], ObjDeviations[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], shift + 1);
    double pptrend = iBands(NULL, PeriodIndex[x], ObjPeriod[Object], ObjDeviations[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], shift + 2);
    double dFactor = 3.14159 / 180.0;
    double mFactor = 10000.0;
    int ShiftDif = AngleShift;

    mFactor /= ShiftDif;

    SETSIGNAL(shift, ObjectId, S_ANGLE, x, P_SIGNAL, MathArctan(mFactor * (trend - angleshift)) / dFactor);
    SETSIGNAL(shift, ObjectId, S_PANGLE, x, P_SIGNAL, MathArctan(mFactor * (angleshift - pangleshift)) / dFactor);

    if (trend > ptrend) {
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);

        if (pptrend <= ptrend) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
        }
    } else
    if (trend < ptrend) {
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);

        if (pptrend >= ptrend) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);

        }
    } else {
        if (pptrend != ptrend) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
        }
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
    }

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
    SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, LastClose[shift][x] - trend);

    if (iOpen(NULL, PeriodIndex[x], shift) < trend && iHigh(NULL, PeriodIndex[x], shift) > trend) {
        SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, trend);
    }

    if (iOpen(NULL, PeriodIndex[x], shift) > trend && iLow(NULL, PeriodIndex[x], shift) < trend) {
        SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, trend);
    }

    if (Upper(trend, 0)) {

        SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL, trend);
        if (MathAbs(LastClose[shift][x] - trend) < AlertDistance[x]) {

            SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, LastClose[shift][x] - trend);
        }
    } else
    if (Lower(trend, 0)) {

        SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL, trend);

        if (MathAbs(LastClose[shift][x] - trend) < AlertDistance[x]) {
            SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, trend - LastClose[shift][x]);
        }
    } else {
        SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL, LastClose[shift][x]);
    }

}

void cci(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double cci = iCCI(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], shift);
    double ccip = iCCI(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], shift + 1);

    int CCI_Limit = 75;

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, cci);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ccip);

    if (cci > ccip) {
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    } else
    if (cci < ccip)
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);

    CheckLevels(x, Object, cci, ccip, shift);

}

// WPR======================================

void wpr(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double sig_buy = iWPR(NULL, PeriodIndex[x], ObjPeriod[Object], shift);
    double psig_buy = iWPR(NULL, PeriodIndex[x], ObjPeriod[Object], shift + 1);

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, sig_buy);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, psig_buy);

    if (psig_buy < sig_buy)
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);

    if (sig_buy > -50)
        SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);

    CheckLevels(x, Object, sig_buy, psig_buy, shift);

}

// ADX======================================

void adx(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double adx = iADX(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], ObjMode[Object], shift);
    double prevadx = iADX(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], ObjMode[Object], shift + 1);

    double di_p = iADX(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], MODE_PLUSDI, 0); // DI+ 1 min
    double di_m = iADX(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], MODE_MINUSDI, 0); // DI- 1 min

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, adx);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, prevadx);

    if (adx < prevadx)
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
    else
    if (adx > prevadx)
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);

    CheckLevels(x, Object, adx, prevadx, shift);

    return;
}

// ATR======================================

double atr(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double Atr = iATR(NULL, PeriodIndex[x], ObjPeriod[Object], shift);
    double AtrPrev = iATR(NULL, PeriodIndex[x], ObjPeriod[Object], shift + 1);

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, Atr);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, AtrPrev);

    if (AtrPrev < Atr)
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    else
    if (AtrPrev > Atr)
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);

    CheckLevels(x, Object, Atr, AtrPrev, shift);

}

void stochastic(int x, int Object, int shift = 0) {
    int slowing = ObjValue[Object][0];
    int ObjectId = ObjId[Object];

    double trend = iStochastic(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], slowing, ObjMethod[Object], ObjApply[Object], ObjMode[Object], shift);
    double ptrend = iStochastic(NULL, PeriodIndex[x], ObjPeriod[Object], ObjShift[Object], slowing, ObjMethod[Object], ObjApply[Object], ObjMode[Object], shift + 1);

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);

    if (ptrend < trend)
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    else
    if (ptrend > trend)
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);

    CheckLevels(x, Object, trend, ptrend, shift);
    return;
}

void macd(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double trend = iMACD(_Symbol, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], shift);
    double ptrend = iMACD(_Symbol, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjShift[Object], ObjApply[Object], ObjMode[Object], shift + 1);

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);

    if (ptrend < trend)
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    else
    if (ptrend > trend)
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);

    CheckLevels(x, Object, trend, ptrend, shift);
    return;

}

void rsi(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double trend = iRSI(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], shift);
    double ptrend = iRSI(NULL, PeriodIndex[x], ObjPeriod[Object], ObjApply[Object], shift + 1);

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);

    if (ptrend < trend)
        SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
    else
    if (ptrend > trend)
        SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
    else
        SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);

    CheckLevels(x, Object, trend, ptrend, shift);
    return;
}

double sar(int x, int Object, int shift = 0) {
    int ObjectId = ObjId[Object];

    double price = iSAR(_Symbol, PeriodIndex[x], ObjStep[Object], ObjMaximum[Object], shift);
    double pprice = iSAR(_Symbol, PeriodIndex[x], ObjStep[Object], ObjMaximum[Object], shift + 1);

    SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, price);
    SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, pprice);

    if (price < _Bid) {
        if (pprice > LastClose[1][x]) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, iTime(NULL, PeriodIndex[x], shift));
        }
        SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
        SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
    } else {
        if (pprice < LastClose[1][x] ) {
            SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, iTime(NULL, PeriodIndex[x], shift));
        }
        SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
        SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
    }
    SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, GetSarNbrBars(x, Object, shift));
    return (price);
}


int GetSarNbrBars(int x, int Object, int from = 0) {

    double price = iSAR(_Symbol, PeriodIndex[x], ObjStep[Object], ObjMaximum[Object], from);

    int i = from;
    int SarNbrBars = 0;

    if (price < _Bid)
        while (price < iClose(NULL, PeriodIndex[x], i)) {
            SarNbrBars += 1;
            i++;
            price = iSAR(_Symbol, PeriodIndex[x], ObjStep[Object], ObjMaximum[Object], i);
        }
    else
        while (price > iClose(NULL, PeriodIndex[x], i)) {
            SarNbrBars += 1;
            i++;
            price = iSAR(_Symbol, PeriodIndex[x], ObjStep[Object], ObjMaximum[Object], i);
        }
    return (SarNbrBars);
}



void ichimoku(int x, int Object) {
    int ObjectId = ObjId[Object];

    double spana = iIchimoku(NULL, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjApply[Object], MODE_SENKOUSPANA, 0);
    double spanb = iIchimoku(NULL, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjApply[Object], MODE_SENKOUSPANB, 0);

    double upper = MathMax(spana, spanb);
    double lower = MathMin(spana, spanb);

    int i = 1;
    double b_spana = iIchimoku(NULL, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjApply[Object], MODE_SENKOUSPANA, i);
    double b_spanb = iIchimoku(NULL, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjApply[Object], MODE_SENKOUSPANB, i);

    double p_upper = MathMax(b_spana, b_spanb);
    double p_lower = MathMin(b_spana, b_spanb);

    while (iClose(NULL, PeriodIndex[x], i) < p_upper && iClose(NULL, PeriodIndex[x], i) > p_lower) {
        b_spana = iIchimoku(NULL, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjApply[Object], MODE_SENKOUSPANA, i);
        b_spanb = iIchimoku(NULL, PeriodIndex[x], ObjPeriod[Object], ObjMethod[Object], ObjApply[Object], MODE_SENKOUSPANB, i);
        p_upper = MathMax(b_spana, b_spanb);
        p_lower = MathMin(b_spana, b_spanb);
        i++;
    }
    //          // we're under the cloud...
    if (Upper(upper, 0)) {
        Set_Signal(ObjectId, S_ABOVE, x, P_SIGNAL);
        Set_Signal_Value(ObjectId, S_ABOVE, x, MathMax(spana, spanb));
        Set_Signal_Value(ObjectId, S_DISTANCE, x, LastClose[0][x] - upper);

        if (iLow(NULL, PeriodIndex[x], i) < p_lower) {
            Set_Signal(ObjectId, S_CROSS_UP, x, P_SIGNAL);
            Set_Signal_Value(ObjectId, S_CROSS_UP, x, p_lower);

        } else {
            Set_Signal(ObjectId, S_REVERSE_UP, x, P_SIGNAL);
            Set_Signal_Value(ObjectId, S_REVERSE_UP, x, p_upper);

        }
        if (MathAbs(SValue(ObjectId, S_DISTANCE, x)) < AlertDistance[x]) {
            Set_Signal(ObjectId, S_ALERT, x, P_SIGNAL);
            Set_Signal_Value(ObjectId, S_ALERT, x, LastClose[0][x] - upper);
        }
    } else
    if (Lower(lower, 0)) {
        Set_Signal(ObjectId, S_BELOW, x, P_SIGNAL);
        Set_Signal_Value(ObjectId, S_BELOW, x, MathMin(spana, spanb));
        Set_Signal_Value(ObjectId, S_DISTANCE, x, LastClose[0][x] - lower);
        if (iClose(NULL, PeriodIndex[x], i) > p_upper) {
            Set_Signal(ObjectId, S_CROSS_DOWN, x, P_SIGNAL);
            Set_Signal_Value(ObjectId, S_CROSS_DOWN, x, p_upper);

        } else {
            Set_Signal(ObjectId, S_REVERSE_DOWN, x, P_SIGNAL);
            Set_Signal_Value(ObjectId, S_REVERSE_DOWN, x, p_lower);

        }

        if (MathAbs(SValue(ObjectId, S_DISTANCE, x)) < AlertDistance[x]) {
            Set_Signal(ObjectId, S_ALERT, x, P_SIGNAL);
            Set_Signal_Value(ObjectId, S_ALERT, x, lower - LastClose[0][x]);
        }
    } else {
        Set_Signal(ObjectId, S_SIDEWAY, x, P_SIGNAL);
        Set_Signal_Value(ObjectId, S_SIDEWAY, x, LastClose[0][x]);
        Set_Signal(ObjectId, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(ObjectId, S_TOUCHED, x, LastClose[0][x]);
        Set_Signal_Value(ObjectId, S_DISTANCE, x, LastClose[0][x] - (upper - lower) / 2);
    }
}


int FindUpDownTrixFrom(int x, int i, double ExtremeValue) {
    int shift;

    if (ExtremeValue == 1.0) {
        shift = i;
        while (shift >= 0) {
            double FastRed = iCustom(_Symbol, PeriodIndex[x], TrixObject, 3, shift);
            double SlowRed = iCustom(_Symbol, PeriodIndex[x], TrixObject, 1, shift);
            if (FastRed != EMPTY_VALUE && SlowRed != EMPTY_VALUE) {
                // sell
                return (shift);
            }
            shift--;
        }
    } else
    if (ExtremeValue == -1.0) {
        shift = i;
        while (shift >= 0) {
            double FastGreen = iCustom(_Symbol, PeriodIndex[x], TrixObject, 2, shift);
            double SlowGreen = iCustom(_Symbol, PeriodIndex[x], TrixObject, 0, shift);
            if (FastGreen != EMPTY_VALUE && SlowGreen != EMPTY_VALUE) {
                //buy
                return (shift);
            }
            shift--;
        }
    }
    return (-1);
}

int FindMajorMinorExtreme(int x, int & Extreme, int & Minor, int shift = 0) {
    // TVI 

    int i = shift;
    int j = shift;

    // EXTREME 
    double MinorValue = 0.0;
    double ExtremeValue1 = 0.0;
    double ExtremeValue2 = 0.0;
    double PaintValue = 0.0;

    while (i >= shift) {
        if (iTime(NULL, PeriodIndex[x], i) == 0) return -1;          

        ExtremeValue1 = iCustom(NULL, PeriodIndex[x], ExtremeObject, 0, i);
        ExtremeValue2 = iCustom(NULL, PeriodIndex[x], ExtremeObject, 1, i);
        PaintValue = iCustom(NULL, PeriodIndex[x], ExtremeObject, 3, i);

        if ((ExtremeValue1 != 0 || ExtremeValue2 != 0) && PaintValue == 0) break;
        i++;
    }
   
    while (j >= shift) {
        if (iTime(NULL, PeriodIndex[x], i) == 0) return -1;          
        MinorValue = iCustom(NULL, PeriodIndex[x], ExtremeObject, 4, j);
        PaintValue = iCustom(NULL, PeriodIndex[x], ExtremeObject, 3, j);
        if (MinorValue != 0 && PaintValue == 0) break;
        j++;

    }
   
    if (j < i) {
        if (MinorValue == 1.0) {
            Minor = 1;
            return j;
        }
        else
        if (MinorValue == -1.0) {
            Minor = -1;
            return j;
        }
    } else {
        if (ExtremeValue1 == 1.0) {
            Extreme = 1;
            Minor = 1;
            return i;
        }
        else
        if (ExtremeValue2 == -1.0) {
            Extreme = -1;
            Minor = -1;
            return i;
        }
    }
    return -1;
}

void progress(int x, int shift = 0) {
    int i = shift;
    int foundpos = 0;
    double ExtremeValue1;
    double ExtremeValue2;
    double PaintValue;
    int minor_extreme = 0;
    int extreme = 0;

    while (i >= shift) {
        if (iTime(NULL, PeriodIndex[x], i) == 0) break;
           
        ExtremeValue1 = iCustom(NULL, PeriodIndex[x], ExtremeObject, 1, i); // up
        ExtremeValue2 = iCustom(NULL, PeriodIndex[x], ExtremeObject, 0, i); // down      
        PaintValue = iCustom(NULL, PeriodIndex[x], ExtremeObject, 3, i);

        if (PaintValue == 0) {
            if (ExtremeValue1 == -1.0) {
                foundpos = FindUpDownTrixFrom(x, i, ExtremeValue1);

                if (foundpos != -1) {
                    SETSIGNAL(shift, PROGRESS, S_BUY, x, P_SIGNAL);
                    Set_Signal_Time(PROGRESS, S_BUY, x, iTime(NULL, PeriodIndex[x], foundpos));
                    Set_Signal_Price(PROGRESS, S_BUY, x, iOpen(NULL, PeriodIndex[x], foundpos));
                    break;
                }
            } else
            if (ExtremeValue2 == 1.0) {
                foundpos = FindUpDownTrixFrom(x, i, ExtremeValue2);

                if (foundpos != -1) {
                    SETSIGNAL(shift, PROGRESS, S_SELL, x, P_SIGNAL);
                    Set_Signal_Time(PROGRESS, S_SELL, x, iTime(NULL, PeriodIndex[x], foundpos));
                    Set_Signal_Price(PROGRESS, S_SELL, x, iOpen(NULL, PeriodIndex[x], foundpos));
                    break;
                }

            }
        }
        i++;
    }

    // now find exit rule 

    int minorpos = FindMajorMinorExtreme(x, extreme, minor_extreme, shift);
    if (minorpos == -1)
        return;

    double StrixUp = iCustom(NULL, PeriodIndex[x], TrixObject, 0, shift);
    double StrixDown = iCustom(NULL, PeriodIndex[x], TrixObject, 1, shift);
    double FtrixUp = iCustom(NULL, PeriodIndex[x], TrixObject, 2, shift);
    double FtrixDown = iCustom(NULL, PeriodIndex[x], TrixObject, 3, shift);
    double FtrixDivUp = iCustom(NULL, PeriodIndex[x], TrixObject, 4, shift);
    double FtrixDivDown = iCustom(NULL, PeriodIndex[x], TrixObject, 5, shift);


    if (FtrixUp != EMPTY_VALUE)
        SETSIGNAL(shift, PROGRESS, S_BULL, x, P_SIGNAL);
    
    if (FtrixDown != EMPTY_VALUE)
        SETSIGNAL(shift, PROGRESS, S_BEAR, x, P_SIGNAL);

    
    if ((shift == 0 && AndS(PROGRESS, S_BUY, x)) || (shift == 1 && AndPS(PROGRESS, S_BUY, x))) {
        if ((extreme == 1 && FtrixDown != EMPTY_VALUE) ||
            (minor_extreme == 1 && FtrixDown != EMPTY_VALUE && StrixDown != EMPTY_VALUE)) {

            SETSIGNAL(shift, PROGRESS, S_BUY, x, P_NOSIGNAL);
            Set_Signal_Time(PROGRESS, S_BUY, x, -1);                  


            SETSIGNAL(shift, PROGRESS, S_EXIT_BUY, x, P_SIGNAL);
            Set_Signal_Time(PROGRESS, S_EXIT_BUY, x, iTime(NULL, PeriodIndex[x], shift));
            Set_Signal_Price(PROGRESS, S_EXIT_BUY, x, iOpen(NULL, PeriodIndex[x], shift));

            SETSIGNAL(shift, PROGRESS, S_CHANGED, x, P_SIGNAL);
            
            return;
        }
    }

    if ((shift == 0 && AndS(PROGRESS, S_SELL, x)) || (shift == 1 && AndPS(PROGRESS, S_SELL, x))) {
        if ((extreme == -1 && FtrixUp != EMPTY_VALUE) ||
            (minor_extreme == -1 && FtrixUp != EMPTY_VALUE && StrixUp != EMPTY_VALUE)) {

            SETSIGNAL(shift, PROGRESS, S_SELL, x, P_NOSIGNAL);
            Set_Signal_Time(PROGRESS, S_SELL, x, -1);           

            SETSIGNAL(shift, PROGRESS, S_EXIT_SELL, x, P_SIGNAL);
            Set_Signal_Time(PROGRESS, S_EXIT_SELL, x, iTime(NULL, PeriodIndex[x], shift));
            Set_Signal_Price(PROGRESS, S_EXIT_SELL, x, iOpen(NULL, PeriodIndex[x], shift));

            SETSIGNAL(shift, PROGRESS, S_CHANGED, x, P_SIGNAL);

            return;
        }
    }

    if (shift == 0) {
        if (AndS(PROGRESS, S_SELL, x) && AndPS(PROGRESS, S_BUY, x)) {
            SETSIGNAL(shift, PROGRESS, S_BUY, x, P_NOSIGNAL);
            SETSIGNAL(shift, PROGRESS, S_SELL, x, P_NOSIGNAL);
            Set_Signal_Time(PROGRESS, S_SELL, x, -1);  
            Set_Signal_Time(PROGRESS, S_BUY, x, -1);  
            
            SETSIGNAL(shift, PROGRESS, S_CHANGED, x, P_SIGNAL);

            Set_Signal(PROGRESS, S_EXIT_BUY, x, P_SIGNAL);
            return;
        }
        if (AndS(PROGRESS, S_BUY, x) && AndPS(PROGRESS, S_SELL, x)) {
            SETSIGNAL(shift, PROGRESS, S_BUY, x, P_NOSIGNAL);
            SETSIGNAL(shift, PROGRESS, S_SELL, x, P_NOSIGNAL);
            Set_Signal_Time(PROGRESS, S_SELL, x, -1);  
            Set_Signal_Time(PROGRESS, S_BUY, x, -1);  


            SETSIGNAL(shift, PROGRESS, S_CHANGED, x, P_SIGNAL);

            Set_Signal(PROGRESS, S_EXIT_SELL, x, P_SIGNAL);
            return;
        }
    }

}






//VOLUME  
void FindVolume(int x) {

    int v_period = PeriodIndex[x];
    int Threshold = 1 * SYS_POINT; //pip threshold for volatility   
    double h, l;
    static double volu[NBR_PERIODS], vold[NBR_PERIODS];
    double vol0u, vol1u, vol0d, vol1d, volume, pvolume;
    double ob, exob, ld_0;

    if (x == 0) {ld_0 = 20000;        ob = 30000;        exob = 50000;    }
    if (x == 1) {ld_0 = 20;        ob = 20;        exob = 30;    }
    if (x == 2) {ld_0 = 30;        ob = 30;        exob = 40;    }
    if (x == 3) {ld_0 = 40;        ob = 40;        exob = 60;    }
    if (x == 4) {ld_0 = 50;        ob = 50;        exob = 70;    }
    if (x == 5) {ld_0 = 80;        ob = 80;        exob = 100;    }
    if (x == 6) {ld_0 = 100;        ob = 100;        exob = 150;    }
    if (x == 7) {ld_0 = 500;        ob = 500;        exob = 800;    }
    if (x == 8) {ld_0 = 1500;        ob = 1500;        exob = 2000;    }

    if (TimeOpenBar[0] != iTime(0, PERIOD_M1, 0)) {

        Set_Signal_Value(VOLUME, S_PREVIOUS, x, SValue(VOLUME, S_CURRENT, x));
        Set_Signal_Value(VOLUME_DOWN, S_PREVIOUS, x, SValue(VOLUME_DOWN, S_CURRENT, x));
        Set_Signal_Value(VOLUME_UP, S_PREVIOUS, x, SValue(VOLUME_UP, S_CURRENT, x));

        vol1u = 0;
        vol1d = 0;
        for (int i = v_period + 1; i <= v_period << 1; i++) {   //v_period << 1 = double tthe timer period on M1
            h = iClose(NULL, PERIOD_M1, i);
            l = iOpen(NULL, PERIOD_M1, i);
            if (h > l + Threshold)
                vol1u += iVolume(NULL, PERIOD_M1, i);
            else
            if (l > h + Threshold)
                vol1d += iVolume(NULL, PERIOD_M1, i);
        }
        pvolume = (vol1d + vol1u); ///v_period;     

        volu[x] = 0;
        vold[x] = 0;

        for (i = 1; i <= v_period; i++) {
            h = iClose(NULL, PERIOD_M1, i);
            l = iOpen(NULL, PERIOD_M1, i);
            if (h > l + Threshold)
                volu[x] += iVolume(NULL, PERIOD_M1, i);
            else
            if (l > h + Threshold)
                vold[x] += iVolume(NULL, PERIOD_M1, i);
        }
    }
    vol0u = volu[x];
    vol0d = vold[x];
    volume = vol0d + vol0u;

    Set_Signal_Value(VOLUME, S_CURRENT, x, volume);
    if (vol0d > vol0u) {
        Set_Signal(VOLUME, S_BEAR, x, P_SIGNAL);
    } else {
        Set_Signal(VOLUME, S_BULL, x, P_SIGNAL);
    }

    Set_Signal_Value(VOLUME_DOWN, S_CURRENT, x, vol0d);
    Set_Signal_Value(VOLUME_UP, S_CURRENT, x, vol0u);

    if (volume > SValue(VOLUME, S_PREVIOUS, x)) {
        Set_Signal(VOLUME, S_UP, x, P_SIGNAL);
        Set_Signal_Value(VOLUME, S_UP, x, volume - SValue(VOLUME, S_PREVIOUS, x));
    } else
    if (volume < SValue(VOLUME, S_PREVIOUS, x)) {
        Set_Signal(VOLUME, S_DOWN, x, P_SIGNAL);
        Set_Signal_Value(VOLUME, S_DOWN, x, SValue(VOLUME, S_PREVIOUS, x) - volume);
    } else
        Set_Signal(VOLUME, S_SIDEWAY, x, P_SIGNAL);

    if (vol0u > SValue(VOLUME_UP, S_PREVIOUS, x)) {
        Set_Signal(VOLUME_UP, S_UP, x, P_SIGNAL);
        Set_Signal_Value(VOLUME_UP, S_UP, x, vol0u - SValue(VOLUME_UP, S_PREVIOUS, x));
    } else
    if (vol0u < SValue(VOLUME_UP, S_PREVIOUS, x)) {
        Set_Signal(VOLUME_UP, S_DOWN, x, P_SIGNAL);
        Set_Signal_Value(VOLUME_UP, S_DOWN, x, SValue(VOLUME_UP, S_PREVIOUS, x) - vol0u);
    } else
        Set_Signal(VOLUME_UP, S_SIDEWAY, x, P_SIGNAL);

    if (vol0d > SValue(VOLUME_DOWN, S_PREVIOUS, x)) {
        Set_Signal(VOLUME_DOWN, S_UP, x, P_SIGNAL);
        Set_Signal_Value(VOLUME_DOWN, S_UP, x, vol0d - SValue(VOLUME_UP, S_PREVIOUS, x));
    } else
    if (vol0d < SValue(VOLUME_DOWN, S_PREVIOUS, x)) {
        Set_Signal(VOLUME_DOWN, S_DOWN, x, P_SIGNAL);
        Set_Signal_Value(VOLUME_DOWN, S_DOWN, x, SValue(VOLUME_UP, S_PREVIOUS, x) - vol0d);
    } else
        Set_Signal(VOLUME_DOWN, S_SIDEWAY, x, P_SIGNAL);
}

//HEIKEN ASHI

bool HH(int x, int i) {
    return (iHigh(NULL, PeriodIndex[x], i) > iHigh(NULL, PeriodIndex[x], i + 1));
}

bool LL(int x, int i) {
    return (iLow(NULL, PeriodIndex[x], i) < iLow(NULL, PeriodIndex[x], i + 1));
}

bool HL(int x, int i) {
    return (iLow(NULL, PeriodIndex[x], i) > iLow(NULL, PeriodIndex[x], i + 1));
}

bool LH(int x, int i) {
    return (iHigh(NULL, PeriodIndex[x], i) < iHigh(NULL, PeriodIndex[x], i + 1));
}

double GetHeikenAshiClose(int x, int i) {
    return ((iOpen(NULL, PeriodIndex[x], i) + iHigh(NULL, PeriodIndex[x], i) + iLow(NULL, PeriodIndex[x], i) + iClose(NULL, PeriodIndex[x], i)) / 4);
}

double GetHeikenAshiOpen(int x, int i) {
    //The higher you make this lookback the lower the error with the true Heiken Ashi Open)
    int lookback = 11;
    double open = GetHeikenAshiClose(x, i + lookback);
    lookback--;
    for (int j = i + lookback; j > i; j--) {
        open = (open + GetHeikenAshiClose(x, j)) / 2;
    }
    return (open);
}

int GetHeikenAshi(int x, int i) {
    double hopen = GetHeikenAshiOpen(x, i);
    double hclose = GetHeikenAshiClose(x, i);
    
    if (hopen > hclose)
        return (-1);
    else
        return (1);
}

void FindHeikenAshi(int x, int shift = 0) {
    int i = shift;
    int AshiNbrBars = 0;

    if (GetHeikenAshi(x, shift) > 0) {
        SETSIGNAL(shift, HEIKEN_ASHI, S_CURRENT, x, P_SIGNAL, 1);
        SETSIGNAL(shift, HEIKEN_ASHI, S_UP, x, P_SIGNAL);
        SETSIGNAL(shift, HEIKEN_ASHI, S_BULL, x, P_SIGNAL);

        if (GetHeikenAshi(x, shift + 1) < 0) {
            SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 0);
            SETSIGNAL(shift, HEIKEN_ASHI, S_CHANGED, x, P_SIGNAL);
        }
        if (!TestMode) {
            while (GetHeikenAshi(x, i) > 0) {
                AshiNbrBars += 1;
                i++;
            }
        }
    } else {
        SETSIGNAL(shift, HEIKEN_ASHI, S_CURRENT, x, P_SIGNAL, 0);
        SETSIGNAL(shift, HEIKEN_ASHI, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, HEIKEN_ASHI, S_BEAR, x, P_SIGNAL);

        if (GetHeikenAshi(x, shift + 1) > 0) {
            SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 1);
            SETSIGNAL(shift, HEIKEN_ASHI, S_CHANGED, x, P_SIGNAL);
        }
        if (!TestMode) {
            while (GetHeikenAshi(x, i) < 0) {
                AshiNbrBars += 1;
                i++;
            }
        }
    }

    if (GetHeikenAshi(x, shift + 2) > 0 && GetHeikenAshi(x, shift + 1) < 0)
        SETSIGNAL(shift, HEIKEN_ASHI, S_REVERSE_DOWN, x, P_SIGNAL);

    if (GetHeikenAshi(x, shift + 2) < 0 && GetHeikenAshi(x, shift + 1) > 0)
        SETSIGNAL(shift, HEIKEN_ASHI, S_REVERSE_UP, x, P_SIGNAL);

    SETSIGNAL(shift, HEIKEN_ASHI, S_NBRBARS, x, P_SIGNAL, AshiNbrBars);
}

///// FIBO----------------------------------------------------------------------------------------------

void FindFiboPoints(int x) {

    double FiboPointSell = -1;
    double FiboPointBuy = -1;
    double FiboStopLoss;
    double FiboTakeProfit1;
    double FiboTakeProfit2;
    double FiboTakeProfit3;


    double pFiboPointBuy = -1;
    double pFiboPointSell = -1;
    double pFiboStopLoss;
    
   
    if (LastClose[1][x] > LastOpen[2][x]) {
        pFiboPointBuy = LastHigh[1][x] - (LastHigh[1][x] - LastLow[1][x]) * 0.382;
        pFiboStopLoss = LastHigh[1][x] - (LastHigh[1][x] - LastLow[1][x]) * 0.618;      

    } else {
        pFiboPointSell = LastLow[1][x] + (LastHigh[1][x] - LastLow[1][x]) * 0.382;
        pFiboStopLoss  = LastLow[1][x] + (LastHigh[1][x] - LastLow[1][x]) * 0.618;
    }
   
   
   
    if (LastClose[0][x] > LastOpen[1][x]) {
        FiboPointBuy = LastHigh[0][x] - (LastHigh[0][x] - LastLow[0][x]) * 0.382;
        FiboStopLoss = LastHigh[0][x] - (LastHigh[0][x] - LastLow[0][x]) * 0.618;

        FiboTakeProfit1 = FiboPointBuy + (LastHigh[0][x] - LastLow[0][x]) * 0.618;
        FiboTakeProfit2 = FiboPointBuy + (LastHigh[0][x] - LastLow[0][x]) * 1;
        FiboTakeProfit3 = FiboPointBuy + (LastHigh[0][x] - LastLow[0][x]) * 1.618;

    } else {
        FiboPointSell = LastLow[0][x] + (LastHigh[0][x] - LastLow[0][x]) * 0.382;
        FiboStopLoss = LastLow[0][x] + (LastHigh[0][x] - LastLow[0][x]) * 0.618;

        FiboTakeProfit1 = FiboPointSell + (LastLow[0][x] - LastHigh[0][x]) * 0.618;
        FiboTakeProfit2 = FiboPointSell + (LastLow[0][x] - LastHigh[0][x]) * 1;
        FiboTakeProfit3 = FiboPointSell + (LastLow[0][x] - LastHigh[0][x]) * 1.618;

    }
    double fibopoint;
    if (FiboPointBuy != -1) {
        fibopoint = FiboPointBuy;
        Set_Signal(FIBOLEVEL, S_BULL, x, P_SIGNAL);
        Set_Signal(FIBOSTOPLOSSLEVEL, S_BULL, x, P_SIGNAL);

    } else {
        fibopoint = FiboPointSell;
        Set_Signal(FIBOLEVEL, S_BEAR, x, P_SIGNAL);
        Set_Signal(FIBOSTOPLOSSLEVEL, S_BEAR, x, P_SIGNAL);

    }

    if (Upper(fibopoint, 0))
        Set_Signal(FIBOLEVEL, S_ABOVE, x, P_SIGNAL);

    if (Lower(fibopoint, 0))
        Set_Signal(FIBOLEVEL, S_BELOW, x, P_SIGNAL);

    if (Upper(FiboStopLoss, 0))
        Set_Signal(FIBOSTOPLOSSLEVEL, S_ABOVE, x, P_SIGNAL);

    if (Lower(FiboStopLoss, 0))
        Set_Signal(FIBOSTOPLOSSLEVEL, S_BELOW, x, P_SIGNAL);
        

    Set_Signal_Value(FIBOLEVEL, S_CURRENT, x, fibopoint);
    Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_CURRENT, x, FiboStopLoss);

    Set_Signal_Value(FIBOLEVEL, S_DISTANCE, x, _Bid - fibopoint);
    Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_DISTANCE, x, _Bid - FiboStopLoss);

    double pfibopoint;

    if (pFiboPointBuy != -1) {
        pfibopoint = pFiboPointBuy;
    } else {
        pfibopoint = pFiboPointSell;
    }

    Set_Signal_Value(FIBOLEVEL, S_PREVIOUS, x, pfibopoint);
    Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_PREVIOUS, x, pFiboStopLoss);

     if ((FiboPointBuy != -1 && pFiboPointBuy == -1) ||
         (FiboPointSell != -1 && pFiboPointSell == -1))
        Set_Signal(FIBOLEVEL, S_CHANGED, x, P_SIGNAL);

    if (LastOpen[0][0] < fibopoint && LastHigh[0][0] > fibopoint) {
        Set_Signal(FIBOLEVEL, S_CROSS_UP, x, P_SIGNAL);
        Set_Signal_Value(FIBOLEVEL, S_CROSS_UP, x, _Bid);
    }
    if (LastOpen[0][0] > fibopoint && LastLow[0][0] < fibopoint) {
        Set_Signal(FIBOLEVEL, S_CROSS_DOWN, x, P_SIGNAL);
        Set_Signal_Value(FIBOLEVEL, S_CROSS_DOWN, x, _Bid);
    }

    if (MathAbs(_Bid - fibopoint) < AlertDistance[x]) {
        Set_Signal(FIBOLEVEL, S_ALERT, x, P_SIGNAL);
        Set_Signal_Value(FIBOLEVEL, S_ALERT, x, _Bid - fibopoint);
    }

    if (Equal(fibopoint, 0)) {
        Set_Signal(FIBOLEVEL, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(FIBOLEVEL, S_TOUCHED, x, _Bid);
    }

    if (MathAbs(_Bid - FiboStopLoss) < AlertDistance[x]) {
        Set_Signal(FIBOSTOPLOSSLEVEL, S_ALERT, x, P_SIGNAL);
        Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_ALERT, x, _Bid - FiboStopLoss);
    }
    if (Equal(FiboStopLoss, 0)) {
        Set_Signal(FIBOSTOPLOSSLEVEL, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_TOUCHED, x, _Bid);
    }
}

//// PIVOT----------------------------------------------------------------------------------------------


void GetFiboPivots(string symbol, int daybefore) {
    int day = TimeDay(Time[0]);

    if (day != LastPivotDay) {
        //---- 
        double FH = iHigh(symbol, PERIOD_D1, daybefore);
        double FL = iLow(symbol, PERIOD_D1, daybefore);
        double CL = iClose(symbol, PERIOD_D1, daybefore);
        double RANGE = FH - FL;

        Pivots[5] = NormalizeDouble((FH + FL + CL) / 3.0, _Digits);

        Pivots[0] = Pivots[5] + (2.618033 * RANGE);
        Pivots[1] = Pivots[5] + (1.618033 * RANGE);
        Pivots[2] = Pivots[5] + (1 * RANGE);
        Pivots[3] = Pivots[5] + (0.618033 * RANGE);
        Pivots[4] = Pivots[5] + (0.382 * RANGE);

        Pivots[6] = Pivots[5] - (0.382 * RANGE);
        Pivots[7] = Pivots[5] - (0.618033 * RANGE);
        Pivots[8] = Pivots[5] - (1 * RANGE);
        Pivots[9] = Pivots[5] - (1.618033 * RANGE);
        Pivots[10] = Pivots[5] - (2.618033 * RANGE); // Support 5

        LastPivotDay = day;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void FindPivotPoints(int x, int shift = 0) {
    bool PivotChanged[NBR_PERIODS];

    PivotChanged[x] = false;
    if (LastPivotPoint[shift + 1][x] != PivotPoint[x])
        PivotChanged[x] = true;

    PivotPoints[0][x] = LastResistance2[shift + 1][x];
    PivotPoints[1][x] = LastResistance1[shift + 1][x];
    PivotPoints[2][x] = LastResistance[shift + 1][x];
    PivotPoints[3][x] = LastHigh[shift + 1][x];
    PivotPoints[4][x] = LastPivotPoint[shift + 1][x];
    PivotPoints[5][x] = LastLow[shift + 1][x];
    PivotPoints[6][x] = LastSupport[shift + 1][x];
    PivotPoints[7][x] = LastSupport1[shift + 1][x];
    PivotPoints[8][x] = LastSupport2[shift + 1][x];
    PrevPivotPoints[0][x] = LastResistance2[shift + 2][x];
    PrevPivotPoints[1][x] = LastResistance1[shift + 2][x];
    PrevPivotPoints[2][x] = LastResistance[shift + 2][x];
    PrevPivotPoints[3][x] = LastHigh[shift + 2][x];
    PrevPivotPoints[4][x] = LastPivotPoint[shift + 2][x];
    PrevPivotPoints[5][x] = LastLow[shift + 2][x];
    PrevPivotPoints[6][x] = LastSupport[shift + 2][x];
    PrevPivotPoints[7][x] = LastSupport1[shift + 2][x];
    PrevPivotPoints[8][x] = LastSupport2[shift + 2][x];

    for (int i = PIVOT_RESISTANCE2; i <= PIVOT_SUPPORT2; i++) {
        SETSIGNAL(shift, i, S_DISTANCE, x, P_SIGNAL, _Bid - PivotPoints[i - PIVOT_RESISTANCE2][x]);
        if (MathAbs(_Bid - PivotPoints[i - PIVOT_RESISTANCE2][x]) < AlertDistance[x]) {
            SETSIGNAL(shift, i, S_ALERT, x, P_SIGNAL, _Bid - PivotPoints[i - PIVOT_RESISTANCE2][x]);
        }
        if (Equal(PivotPoints[i - PIVOT_RESISTANCE2][x], 0)) {
            SETSIGNAL(shift, i, S_TOUCHED, x, P_SIGNAL, _Bid);
        }
        if (PrevPivotPoints[i - PIVOT_RESISTANCE2][x] < PivotPoints[i - PIVOT_RESISTANCE2][x])
            SETSIGNAL(shift, i, S_UP, x, P_SIGNAL);

        if (PrevPivotPoints[i - PIVOT_RESISTANCE2][x] > PivotPoints[i - PIVOT_RESISTANCE2][x])
            SETSIGNAL(shift, i, S_DOWN, x, P_SIGNAL);

        if (LastOpen[shift][x] < PivotPoints[i - PIVOT_RESISTANCE2][x] && LastHigh[shift][x] > PivotPoints[i - PIVOT_RESISTANCE2][x]) {
            SETSIGNAL(shift, i, S_CROSS_UP, x, P_SIGNAL, _Bid);
        }
        if (LastOpen[shift][x] > PivotPoints[i - PIVOT_RESISTANCE2][x] && LastLow[shift][x] < PivotPoints[i - PIVOT_RESISTANCE2][x]) {
            SETSIGNAL(shift, i, S_CROSS_DOWN, x, P_SIGNAL, _Bid);
        }

        if (Upper(PivotPoints[i - PIVOT_RESISTANCE2][x], 0)) {
            SETSIGNAL(shift, i, S_ABOVE, x, P_SIGNAL, PivotPoints[i - PIVOT_RESISTANCE2][x]);
        } else
        if (Lower(PivotPoints[i - PIVOT_RESISTANCE2][x], 0)) {
            SETSIGNAL(shift, i, S_BELOW, x, P_SIGNAL, PivotPoints[i - PIVOT_RESISTANCE2][x]);
        }

        if (LastOpen[shift][x] > PivotPoints[i - PIVOT_RESISTANCE2][x] && LastLow[shift][x] < PivotPoints[i - PIVOT_RESISTANCE2][x] &&
            _Bid > PivotPoints[i - PIVOT_RESISTANCE2][x]) {
            SETSIGNAL(shift, i, S_REVERSE_UP, x, P_SIGNAL, _Bid);
        }

        if (LastOpen[shift][x] < PivotPoints[i - PIVOT_RESISTANCE2][x] && LastHigh[shift][x] > PivotPoints[i - PIVOT_RESISTANCE2][x] &&
            _Bid < PivotPoints[i - PIVOT_RESISTANCE2][x]) {
            SETSIGNAL(shift, i, S_REVERSE_DOWN, x, P_SIGNAL, _Bid);
        }
    }
    if (PivotChanged[x] == true) {
        SETSIGNAL(shift, PIVOT_HIGH, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_RESISTANCE, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_RESISTANCE1, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_RESISTANCE2, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_POINT, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_SUPPORT, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_SUPPORT1, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_SUPPORT2, S_CHANGED, x, P_SIGNAL);
        SETSIGNAL(shift, PIVOT_LOW, S_CHANGED, x, P_SIGNAL);
        PivotPoint[x] = LastPivotPoint[shift + 1][x];
    }

    SETSIGNAL(shift, PIVOT_HIGH, S_CURRENT, x, P_SIGNAL, LastHigh[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_RESISTANCE, S_CURRENT, x, P_SIGNAL, LastResistance[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_RESISTANCE1, S_CURRENT, x, P_SIGNAL, LastResistance1[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_RESISTANCE2, S_CURRENT, x, P_SIGNAL, LastResistance2[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_POINT, S_CURRENT, x, P_SIGNAL, LastPivotPoint[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_SUPPORT, S_CURRENT, x, P_SIGNAL, LastSupport[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_SUPPORT1, S_CURRENT, x, P_SIGNAL, LastSupport1[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_SUPPORT2, S_CURRENT, x, P_SIGNAL, LastSupport2[shift + 1][x]);
    SETSIGNAL(shift, PIVOT_LOW, S_CURRENT, x, P_SIGNAL, LastLow[shift + 1][x]);

    SETSIGNAL(shift, PIVOT_HIGH, S_PREVIOUS, x, P_SIGNAL, LastHigh[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_RESISTANCE, S_PREVIOUS, x, P_SIGNAL, LastResistance[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_RESISTANCE1, S_PREVIOUS, x, P_SIGNAL, LastResistance1[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_RESISTANCE2, S_PREVIOUS, x, P_SIGNAL, LastResistance2[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_POINT, S_PREVIOUS, x, P_SIGNAL, LastPivotPoint[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_SUPPORT, S_PREVIOUS, x, P_SIGNAL, LastSupport[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_SUPPORT1, S_PREVIOUS, x, P_SIGNAL, LastSupport1[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_SUPPORT2, S_PREVIOUS, x, P_SIGNAL, LastSupport2[shift + 2][x]);
    SETSIGNAL(shift, PIVOT_LOW, S_PREVIOUS, x, P_SIGNAL, LastLow[shift + 2][x]);

    double MS3 = LastSupport2[shift + 1][x] + ((LastSupport1[shift + 1][x] - LastSupport2[shift + 1][x]) / 2);

    if (Equal(MS3, 0)) {
        SETSIGNAL(shift, PIVOT_SUPPORT2, S_MIDDLE, x, P_SIGNAL, MS3);
    }

    double MS2 = LastSupport1[shift + 1][x] + ((LastSupport[shift + 1][x] - LastSupport1[shift + 1][x]) / 2);

    if (Equal(MS2, 0)) {
        SETSIGNAL(shift, PIVOT_SUPPORT1, S_MIDDLE, x, P_SIGNAL, MS2);
    }

    double MS1 = LastSupport[shift + 1][x] + ((LastPivotPoint[shift + 1][x] - LastSupport[shift + 1][x]) / 2);

    if (Equal(MS1, 0)) {
        SETSIGNAL(shift, PIVOT_SUPPORT, S_MIDDLE, x, P_SIGNAL, MS1);
    }

    MS1 = LastLow[shift + 1][x] + ((LastPivotPoint[shift + 1][x] - LastLow[shift + 1][x]) / 2);

    if (Equal(MS1, 0)) {
        SETSIGNAL(shift, PIVOT_LOW, S_MIDDLE, x, P_SIGNAL, MS1);
    }

    double MR1 = LastPivotPoint[shift + 1][x] + ((LastResistance[shift + 1][x] - LastPivotPoint[shift + 1][x]) / 2);

    if (Equal(MR1, 0)) {
        SETSIGNAL(shift, PIVOT_RESISTANCE, S_MIDDLE, x, P_SIGNAL, MR1);
    }

    MR1 = LastPivotPoint[shift + 1][x] + ((LastHigh[shift + 1][x] - LastPivotPoint[shift + 1][x]) / 2);

    if (Equal(MR1, 0)) {
        SETSIGNAL(shift, PIVOT_HIGH, S_MIDDLE, x, P_SIGNAL, MR1);
    }

    double MR2 = LastResistance[shift + 1][x] + ((LastResistance1[shift + 1][x] - LastResistance[shift + 1][x]) / 2);

    if (Equal(MR2, 0)) {
        SETSIGNAL(shift, PIVOT_RESISTANCE1, S_MIDDLE, x, P_SIGNAL, MR2);
    }

    double MR3 = LastResistance1[shift + 1][x] + ((LastResistance2[shift + 1][x] - LastResistance1[shift + 1][x]) / 2);

    if (Equal(MR1, 0)) {
        SETSIGNAL(shift, PIVOT_RESISTANCE2, S_MIDDLE, x, P_SIGNAL, MR3);
    }
}

///////////////////////////////////////////////////////////////////////////////////

double ReturnBestPoint(int x) {
    if (iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x]) - iHigh(NULL, PeriodIndex[x], Last2UpFractals[1][x]) != 0)
        return (iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x]) *
            (iTime(NULL, PeriodIndex[x], Last2UpFractals[0][x]) - iTime(NULL, PeriodIndex[x], Last2UpFractals[1][x])) /
            (iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x]) - iHigh(NULL, PeriodIndex[x], Last2UpFractals[1][x])));
    else return (iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x]));
}

double ResistanceLevel(int m_period, int shift) {
    datetime time1, time2;
    double price1, price2;

    price1 = iHigh(NULL, PeriodIndex[m_period], Last2UpFractals[1][m_period]);
    price2 = iHigh(NULL, PeriodIndex[m_period], Last2UpFractals[0][m_period]);
    time2 = Last2UpFractals[1][m_period];
    time1 = Last2UpFractals[0][m_period];
    return (LevelCalculate(price1, time1, price2, time2, time2 + time1 - shift));
}

double SupportLevel(int m_period, int shift) {
    datetime time1, time2;
    double price1, price2;

    price1 = iLow(NULL, PeriodIndex[m_period], Last2DownFractals[1][m_period]);
    price2 = iLow(NULL, PeriodIndex[m_period], Last2DownFractals[0][m_period]);
    time2 = Last2DownFractals[1][m_period];
    time1 = Last2DownFractals[0][m_period];
    return (LevelCalculate(price1, time1, price2, time2, time2 + time1 - shift));
}

double LevelCalculate(double Price1, double Time1, double Price2, double Time2, double NewTime) {
    double level;
    double a;
    double b;

    if (Time2 != Time1) // Just in case, to avoid zero divide.
    {
        a = (Price2 - Price1) / (Time2 - Time1);
        b = Price1 - (a * Time1);
        level = (a * NewTime) + b;
    } else {
        return (Price2);
    }
    return (level);
}

void FindSupportResistanceLevels(int x) {
    if (TimeOpenBar[x] != iTime(NULL, PeriodIndex[x], 0)) {
        BeforeSupportLevels[x] = SupportLevels[x];
        BeforeResistanceLevels[x] = ResistanceLevels[x];

        SupportLevels[x] = NormalizeDouble(SupportLevel(x, 0), _Digits);
        ResistanceLevels[x] = NormalizeDouble(ResistanceLevel(x, 0), _Digits);

        int shift = 0;
        int ResistanceBrokenBar = 0;
        if (_Bid - ResistanceLevels[x] > 0) {
            while (iHigh(NULL, PeriodIndex[x], shift) > ResistanceLevel(x, shift))
                shift++;
            ResistanceBrokenBar = shift - 1;
            Set_Signal_Value(RESISTANCE, S_NBRBARS, x, ResistanceBrokenBar);
        }
        shift = 0;

        int SupportBrokenBar = 0;
        if (SupportLevels[x] - _Bid > 0) {
            while (iLow(NULL, PeriodIndex[x], shift) <= SupportLevel(x, shift))
                shift++;
            SupportBrokenBar = shift - 1;
            Set_Signal_Value(SUPPORT, S_NBRBARS, x, SupportBrokenBar);
        }
    }
}

void FindRS(int x) {
    if (TimeOpenBar[x] != iTime(NULL, PeriodIndex[x], 0)) {
        Last2UpFractals[0][x] = UpFractals[x];
        Last2DownFractals[0][x] = DownFractals[x];
        Last2UpFractals[1][x] = FindNextFractal(PeriodIndex[x], MODE_UPPER, Last2UpFractals[0][x]);
        Last2DownFractals[1][x] = FindNextFractal(PeriodIndex[x], MODE_LOWER, Last2DownFractals[0][x]);

        if (Before2UpFractals[0][x] != iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x])) {
            Set_Signal(RESISTANCE, S_CHANGED, x, P_SIGNAL);
            Set_Signal_Value(RESISTANCE, S_CHANGED, x, Before2UpFractals[0][x]);
            Before2DownFractals[0][x] = iLow(NULL, PeriodIndex[x], Last2DownFractals[0][x] + 1);
            Before2DownFractals[1][x] = iLow(NULL, PeriodIndex[x], Last2DownFractals[1][x] + 1);
        }
        if (Before2DownFractals[0][x] != iLow(NULL, PeriodIndex[x], Last2DownFractals[0][x])) {
            Set_Signal(SUPPORT, S_CHANGED, x, P_SIGNAL);
            Set_Signal_Value(SUPPORT, S_CHANGED, x, Before2DownFractals[0][x]);
            Before2UpFractals[0][x] = iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x] + 1);
            Before2UpFractals[1][x] = iHigh(NULL, PeriodIndex[x], Last2UpFractals[1][x] + 1);
        }
    }

    FindSupportResistanceLevels(x);

    double down = SupportLevels[x];
    double up = ResistanceLevels[x];

    Set_Signal_Value(RESISTANCE, S_CURRENT, x, up);
    Set_Signal_Value(SUPPORT, S_CURRENT, x, down);
    Set_Signal_Value(RESISTANCE, S_PREVIOUS, x, BeforeResistanceLevels[x]);
    Set_Signal_Value(SUPPORT, S_PREVIOUS, x, BeforeSupportLevels[x]);
    Set_Signal_Value(SUPPORT, S_DISTANCE, x, _Bid - down);
    Set_Signal_Value(RESISTANCE, S_DISTANCE, x, _Bid - up);

    if (Equal(up, 0)) {
        Set_Signal(RESISTANCE, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_TOUCHED, x, _Bid);
    }

    if (Lower(up, 0)) {
        Set_Signal(RESISTANCE, S_RANGE, x, P_SIGNAL);

    } else
    if (Upper(up, 0)) {
        Set_Signal(RESISTANCE, S_ABOVE, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_ABOVE, x, up);
    }

    if (Equal(down, 0)) {
        Set_Signal(SUPPORT, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_TOUCHED, x, _Bid);
    }
    if (Lower(down, 0)) {
        Set_Signal(SUPPORT, S_BELOW, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_BELOW, x, down);
    } else
    if (Upper(down, 0)) {
        Set_Signal(SUPPORT, S_RANGE, x, P_SIGNAL);
    }

    if (LastOpen[0][x] < up && LastHigh[0][x] > up) {
        Set_Signal(RESISTANCE, S_CROSS_UP, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_CROSS_UP, x, _Bid);
    }
    if (LastOpen[0][x] > up && LastLow[0][x] < up) {
        Set_Signal(RESISTANCE, S_CROSS_DOWN, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_CROSS_DOWN, x, _Bid);
    }

    if (LastOpen[0][x] > down && LastLow[0][x] < down) {
        Set_Signal(SUPPORT, S_CROSS_DOWN, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_CROSS_DOWN, x, _Bid);
    }
    if (LastOpen[0][x] < down && LastHigh[0][x] > down) {
        Set_Signal(SUPPORT, S_CROSS_UP, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_CROSS_UP, x, _Bid);
    }

    Set_Signal_Value(SUPPORT, S_MIDDLE, x, down + MathAbs(up - down) / 2);
    Set_Signal_Value(RESISTANCE, S_MIDDLE, x, down + MathAbs(up - down) / 2);

    if (Equal(down + MathAbs(up - down) / 2, 0)) {
        Set_Signal(SUPPORT, S_MIDDLE, x, P_SIGNAL);
        Set_Signal(RESISTANCE, S_MIDDLE, x, P_SIGNAL);
    }

    if (up - down < 0) {
        Set_Signal(SUPPORT, S_RCROSSED, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_RCROSSED, x, up - down);
        Set_Signal(RESISTANCE, S_RCROSSED, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_RCROSSED, x, up - down);
    }
    if (MathAbs(SValue(RESISTANCE, S_DISTANCE, x)) < AlertDistance[x]) {
        Set_Signal(RESISTANCE, S_ALERT, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_ALERT, x, _Bid - up);
    }
    if (MathAbs(SValue(SUPPORT, S_DISTANCE, x)) < AlertDistance[x]) {
        Set_Signal(SUPPORT, S_ALERT, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_ALERT, x, _Bid - down);
    }

    double downbefore2 = NormalizeDouble(SupportLevel(x, 2), _Digits);
    double upbefore2 = NormalizeDouble(ResistanceLevel(x, 2), _Digits);

    if ((LastHigh[2][x] > downbefore2 || LastClose[2][x] >= downbefore2) &&
        LastOpen[2][x] < downbefore2 && LastClose[1][x] <= BeforeSupportLevels[x] && _Bid < down) {
        Set_Signal(SUPPORT, S_REVERSE_DOWN, x, P_SIGNAL);
        Set_Signal_Value(SUPPORT, S_REVERSE_DOWN, x, _Bid);
    } else
    if ((LastLow[2][x] < upbefore2 || LastClose[2][x] <= upbefore2) &&
        LastOpen[2][x] > upbefore2 && LastClose[1][x] >= BeforeResistanceLevels[x] && _Bid > up) {
        Set_Signal(RESISTANCE, S_REVERSE_UP, x, P_SIGNAL);
        Set_Signal_Value(RESISTANCE, S_REVERSE_UP, x, _Bid);
    }
}

int FindNextFractal(int period, int mode, int shift) {
    int i = shift + 1;
    double next_fractal;

    double actual_fractal = iFractals(NULL, period, mode, shift);

    if (actual_fractal == 0)
        actual_fractal = _Bid;

    next_fractal = iFractals(NULL, period, mode, i);

    if (mode == MODE_LOWER)
        while ((next_fractal == 0) || (actual_fractal <= next_fractal)) {
            i++;
            next_fractal = iFractals(NULL, period, mode, i);
            if (i > NBRMAXSHIFT) return (shift);
        }
    else
        while ((next_fractal == 0) || (actual_fractal >= next_fractal)) {
            i++;
            next_fractal = iFractals(NULL, period, mode, i);
            if (i > NBRMAXSHIFT) return (shift);
        }
    return (i);
}

int FindLastFractal(int period, int mode, int shift) {
    int i = shift + 1;
    double next_fractal = 0;

    next_fractal = iFractals(NULL, period, mode, i);

    while (next_fractal == 0) {
        next_fractal = iFractals(NULL, period, mode, i);
        i++;
        if (i > NBRMAXSHIFT) {
            return (0);
        }
    }
    return (i - 1);
}

void FindFractals(int x) {

    if (TimeOpenBar[x] != iTime(NULL, PeriodIndex[x], 0)) {

        UpFractals[x] = FindLastFractal(PeriodIndex[x], MODE_UPPER, 0);
        DownFractals[x] = FindLastFractal(PeriodIndex[x], MODE_LOWER, 0);

        BeforeUpFractals[x] = FindLastFractal(PeriodIndex[x], MODE_UPPER, UpFractals[x]);
        BeforeDownFractals[x] = FindLastFractal(PeriodIndex[x], MODE_LOWER, DownFractals[x]);

        if (LastUpFractals[x] == 0) LastUpFractals[x] = iHigh(NULL, PeriodIndex[x], UpFractals[x]);
        if (LastDownFractals[x] == 0) LastDownFractals[x] = iLow(NULL, PeriodIndex[x], DownFractals[x]);

        if (LastUpFractals[x] != iHigh(NULL, PeriodIndex[x], UpFractals[x])) {
            Set_Signal(UPFRACTAL, S_CHANGED, x, P_SIGNAL);
            Set_Signal_Value(UPFRACTAL, S_CHANGED, x, iHigh(NULL, PeriodIndex[x], UpFractals[x]));
            Set_Signal_Value(UPFRACTAL, S_PREVIOUS, x, iHigh(NULL, PeriodIndex[x], UpFractals[x]));
            LastUpFractals[x] = iHigh(NULL, PeriodIndex[x], UpFractals[x]);

        }

        if (LastDownFractals[x] != iLow(NULL, PeriodIndex[x], DownFractals[x])) {
            Set_Signal(DOWNFRACTAL, S_CHANGED, x, P_SIGNAL);
            Set_Signal_Value(DOWNFRACTAL, S_CHANGED, x, iLow(NULL, PeriodIndex[x], DownFractals[x]));
            Set_Signal_Value(DOWNFRACTAL, S_PREVIOUS, x, iLow(NULL, PeriodIndex[x], DownFractals[x]));
            LastDownFractals[x] = iLow(NULL, PeriodIndex[x], DownFractals[x]);
        }
    }

    double upfractal = iHigh(NULL, PeriodIndex[x], UpFractals[x]);
    double downfractal = iLow(NULL, PeriodIndex[x], DownFractals[x]);

    double bupfractal = iHigh(NULL, PeriodIndex[x], BeforeUpFractals[x]);
    double bdownfractal = iLow(NULL, PeriodIndex[x], BeforeDownFractals[x]);

    if (bupfractal > upfractal) {
        Set_Signal(UPFRACTAL, S_DOWN, x, P_SIGNAL);
    } else
    if (bupfractal < upfractal) {
        Set_Signal(UPFRACTAL, S_UP, x, P_SIGNAL);
    } else
        Set_Signal(UPFRACTAL, S_SIDEWAY, x, P_SIGNAL);

    if (bdownfractal < downfractal) {
        Set_Signal(DOWNFRACTAL, S_UP, x, P_SIGNAL);
    } else
    if (bdownfractal > downfractal) {
        Set_Signal(DOWNFRACTAL, S_DOWN, x, P_SIGNAL);
    } else
        Set_Signal(DOWNFRACTAL, S_SIDEWAY, x, P_SIGNAL);

    Set_Signal_Value(UPFRACTAL, S_CURRENT, x, upfractal);
    Set_Signal_Value(DOWNFRACTAL, S_CURRENT, x, downfractal);

    Set_Signal_Value(UPFRACTAL, S_NBRBARS, x, UpFractals[x]);
    Set_Signal_Value(DOWNFRACTAL, S_NBRBARS, x, DownFractals[x]);

    if (!TestMode) {
        NextUpFractals[x] = FindNextFractal(PeriodIndex[x], MODE_UPPER, 0);
        NextDownFractals[x] = FindNextFractal(PeriodIndex[x], MODE_LOWER, 0);
    }

    double middle = downfractal + (MathAbs(upfractal - downfractal) / 2);

    Set_Signal_Value(UPFRACTAL, S_MIDDLE, x, middle);
    Set_Signal_Value(DOWNFRACTAL, S_MIDDLE, x, middle);

    if (Equal(middle, 0)) {
        Set_Signal(UPFRACTAL, S_MIDDLE, x, P_SIGNAL);
        Set_Signal(DOWNFRACTAL, S_MIDDLE, x, P_SIGNAL);
    }

    Set_Signal_Value(UPFRACTAL, S_DISTANCE, x, _Bid - upfractal);
    Set_Signal_Value(DOWNFRACTAL, S_DISTANCE, x, _Bid - downfractal);

    Set_Signal_Value(UPFRACTAL, S_TARGET, x, upfractal);
    Set_Signal_Value(DOWNFRACTAL, S_TARGET, x, downfractal);

    if (MathAbs(SValue(UPFRACTAL, S_DISTANCE, x)) < AlertDistance[x]) {
        Set_Signal(UPFRACTAL, S_ALERT, x, P_SIGNAL);
        Set_Signal_Value(UPFRACTAL, S_ALERT, x, _Bid - upfractal);
    }

    if (MathAbs(SValue(DOWNFRACTAL, S_DISTANCE, x)) < AlertDistance[x]) {
        Set_Signal(DOWNFRACTAL, S_ALERT, x, P_SIGNAL);
        Set_Signal_Value(DOWNFRACTAL, S_ALERT, x, _Bid - downfractal);
    }

    if (LastClose[1][x] >= upfractal && _Bid < upfractal) {
        Set_Signal(UPFRACTAL, S_REVERSE_DOWN, x, P_SIGNAL);
        Set_Signal_Value(UPFRACTAL, S_REVERSE_DOWN, x, _Bid);
    }
    if (LastClose[1][x] < downfractal && _Bid > downfractal) {
        Set_Signal(DOWNFRACTAL, S_REVERSE_UP, x, P_SIGNAL);
        Set_Signal_Value(DOWNFRACTAL, S_REVERSE_UP, x, _Bid);
    }

    if (iOpen(_Symbol, PeriodIndex[x], 0) < upfractal && iHigh(_Symbol, PeriodIndex[x], 0) > upfractal) {
        Set_Signal(UPFRACTAL, S_CROSS_UP, x, P_SIGNAL);
        Set_Signal_Value(UPFRACTAL, S_CROSS_UP, x, _Bid);
    }
    if (iOpen(_Symbol, PeriodIndex[x], 0) > upfractal && iLow(_Symbol, PeriodIndex[x], 0) < upfractal) {
        Set_Signal(UPFRACTAL, S_CROSS_DOWN, x, P_SIGNAL);
        Set_Signal_Value(UPFRACTAL, S_CROSS_DOWN, x, _Bid);
    }
    if (iOpen(_Symbol, PeriodIndex[x], 0) < downfractal && iHigh(_Symbol, PeriodIndex[x], 0) > downfractal) {
        Set_Signal(DOWNFRACTAL, S_CROSS_UP, x, P_SIGNAL);
        Set_Signal_Value(DOWNFRACTAL, S_CROSS_UP, x, _Bid);
    }

    if (iOpen(_Symbol, PeriodIndex[x], 0) > downfractal && iLow(_Symbol, PeriodIndex[x], 0) < downfractal) {
        Set_Signal(DOWNFRACTAL, S_CROSS_DOWN, x, P_SIGNAL);
        Set_Signal_Value(DOWNFRACTAL, S_CROSS_DOWN, x, _Bid);
    }

    if (Equal(upfractal, 0)) {
        Set_Signal(UPFRACTAL, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(UPFRACTAL, S_TOUCHED, x, upfractal);

    } else
    if (Lower(upfractal, 0)) {
        Set_Signal(UPFRACTAL, S_RANGE, x, P_SIGNAL);

    } else
    if (Upper(upfractal, 0)) {
        Set_Signal(UPFRACTAL, S_ABOVE, x, P_SIGNAL);
        Set_Signal_Value(UPFRACTAL, S_ABOVE, x, upfractal);
        Set_Signal_Value(UPFRACTAL, S_TARGET, x, iHigh(NULL, PeriodIndex[x], NextUpFractals[x]));
    }

    if (Equal(downfractal, 0)) {
        Set_Signal(DOWNFRACTAL, S_TOUCHED, x, P_SIGNAL);
        Set_Signal_Value(DOWNFRACTAL, S_TOUCHED, x, downfractal);

    } else
    if (Lower(downfractal, 0)) {
        Set_Signal(DOWNFRACTAL, S_BELOW, x, P_SIGNAL);
        Set_Signal_Value(DOWNFRACTAL, S_BELOW, x, downfractal);
        Set_Signal_Value(DOWNFRACTAL, S_TARGET, x, iLow(NULL, PeriodIndex[x], NextDownFractals[x]));

    } else
    if (Upper(downfractal, 0)) {
        Set_Signal(DOWNFRACTAL, S_RANGE, x, P_SIGNAL);

    }
}


////////////////////////////////////////////////////////////RULES//////////////////////////////////////

void SetRuleFilters() {
    /*
    //    SetRuleFilter (1, -1, -1,   R_A);    // NANINGBOB D1 
    //    SetRuleFilter (1, -1, -1,   R_B);    // NANINGBOB H4
        SetRuleFilter (1, -1, -1,   R_C);    // NANINGBOB H1
    //D

        SetRuleFilter (1, -1, -1,   R_D);    // BUYSELL ON NANINGBOB D1
    //    SetRuleFilter (1, -1, -1,   R_E);    // TMA PROGRESS M30
        SetRuleFilter (1, -1, -1,   R_F);    // TMA PROGRESS H1

       SetRuleFilter (1, -1, -1,   R_G);    // ANGLE M1
       SetRuleFilter (1, -1, -1,   R_H);    // ANGLE M5


        SetRuleFilter (1, -1, -1,   R_I);    // BOLINGER
        SetRuleFilter (1, -1, -1,   R_J);    // BUYSELL
        SetRuleFilter (1, -1, -1,   R_K);    // BUYSELL ON CLOSE J

        SetRuleFilter (1, -1, -1,   R_M);    // PROGRESS H1    
        SetRuleFilter (1, -1, -1,   R_N);    // PROGRESS D1   
    //    SetRuleFilter (1, -1, -1,   R_O);    // STOPLOSS 
    //    SetRuleFilter (1, -1, -1,   R_P);    // STOPLOSS     
        SetRuleFilter (1, -1, -1,   R_R);    // MANUAL

    */
    //    SetRuleFilter (1, -1, -1,   R_D);    // BUYSELL ON NANINGBOB D1 
    SetRuleFilter(1, -1, -1, R_G); // 
    SetRuleFilter(1, -1, -1, R_H); // 
    SetRuleFilter(1, -1, -1, R_I); // BOLINGER
    SetRuleFilter(1, -1, -1, R_N); // PROGRESS D1   
    SetRuleFilter(1, -1, -1, R_J); // BUYSELL
    SetRuleFilter(1, -1, -1, R_F); // TMA PROGRESS H1
}

void AdjustFilters(int Operation) {
    int sell, buy;

    if (Operation == OP_BUY) {
        sell = 0;
        buy = 1;
    } else
    if (Operation == OP_SELL) {
        sell = 1;
        buy = 0;
    } else
    if (Operation == OP_BUYSELL) {
        buy = 1;
        sell = 1;
    } else
        return;
    SetRuleFilter(buy, OP_BUY, T_STATUS, -1);
    SetRuleFilter(sell, OP_SELL, T_STATUS, -1);
}

/////////////////////////////////RULES////////////////////////////////



void TreatOutRules() {
    for (int i = 0; i < NBR_OPERATIONS; i++)
        for (int j = 0; j < NBR_FIELDS; j++)
            for (int x = 0; x < NBR_RULES; x++) {
                int rule = RuleOrder[x];
                if (rule != -1)
                    TreatRule(i, j, rule, RValue(i, j, rule));
            }
}

void TreatRule(int Operation, int OperationType, int rule, double value) {
    int session;
    int engine = -1;
    double Value;

    if (Operation == OP_BUY || Operation == OP_SELL || Operation == OP_BUYSELL) {

        if (OperationType == T_RULE) {
            for (int i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule) {
                        engine = GetEngine(rule, B_Operation[i]);
                        if (engine == -1) continue;

                        if (Operation == OP_BUY && AndE(engine, B_BUYRULE))
                            if (AndR(Operation, OperationType, rule)) {
                                B_BuyOnRule[i] = value;
                            }
                        else
                            B_BuyOnRule[i] = EValue(engine, B_BUYRULE);

                        if (Operation == OP_SELL && AndE(engine, B_SELLRULE))
                            if (AndR(Operation, OperationType, rule)) {
                                B_SellOnRule[i] = value;
                            }
                        else
                            B_SellOnRule[i] = EValue(engine, B_SELLRULE);
                    }
            }
            return;
        }

        engine = GetEngine(rule, Operation);
        if (engine == -1)
            return;

        if (OperationType == T_START) {

            ReturnNumberRuleStarted(rule, Operation);

            if (SeeIfRuleInSchedule(rule, Operation) == -1) return;

            if (AndR(Operation, OperationType, rule) && AndE(engine, B_STARTAUTOMATIC)) {
                if (B_StartNewSessionRule(TimeBetweenSession, rule, Operation)) {
                    for (int j = B_STARTRULE + 1; j < NBR_ATTRIBUTES; j++) Set_Engine(engine, j, P_SIGNAL); // put everything to automatic from B_ILOT
                    session = B_StartNewSession();

                    InitSessionFromEngine(session, engine);
                }
            }
            return;
        } else
        if (OperationType == T_BUYLOT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation) // && AndE(engine, B_BUYLOT))
                        if (AndR(Operation, OperationType, rule)) B_BuyLot[i] = value;
            return;
        } else
        if (OperationType == T_SELLLOT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation) // && AndE(engine, B_SELLLOT))
                        if (AndR(Operation, OperationType, rule)) B_SellLot[i] = value;
            return;
        } else
        if (OperationType == T_KEEPBUYSELL) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_KEEPBUYSELL))
                        if (AndR(Operation, OperationType, rule)) B_KeepBuySell[i] = value;
                        else B_KeepBuySell[i] = EValue(engine, B_KEEPBUYSELL);
            return;
        } else
        if (OperationType == T_ONEORDERPERBAR) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_ONEORDERPERBAR))
                        if (AndR(Operation, OperationType, rule)) B_OneOrderPerBar[i] = value;
                        else B_OneOrderPerBar[i] = EValue(engine, B_ONEORDERPERBAR);
            return;
        } else        
        if (OperationType == T_TIMESTEP) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_TIMESTEP))
                        if (AndR(Operation, OperationType, rule)) B_TimeStep[i] = value;
                        else B_TimeStep[i] = EValue(engine, B_TIMESTEP);
            return;
        } else
        if (OperationType == T_PIPSTEP) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_PIPSTEP))
                        if (AndR(Operation, OperationType, rule)) { 
                            B_PipStep[i] = value;
                            }
                        else {
                            B_PipStep[i] = EValue(engine, B_PIPSTEP);
                            }
            return;
        } else
        if (OperationType == T_ORDERTYPE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_ORDERTYPE))
                        if (AndR(Operation, OperationType, rule)) B_OrderType[i] = value;
                        else B_OrderType[i] = EValue(engine, B_ORDERTYPE);
            return;
        } else
        if (OperationType == T_DIRECTION) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_DIRECTION))
                        if (AndR(Operation, OperationType, rule)) B_Direction[i] = value;
                        else B_Direction[i] = EValue(engine, B_DIRECTION);
            return;
        } else
        if (OperationType == T_DIRECTIONTYPE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_DIRECTIONTYPE))
                        if (AndR(Operation, OperationType, rule)) B_DirectionType[i] = value;
                        else B_DirectionType[i] = EValue(engine, B_DIRECTIONTYPE);
            return;
        } else
        if (OperationType == T_LEVELPOINT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_LEVELPOINT))
                        if (AndR(Operation, OperationType, rule)) B_LevelPoint[i] = value;
                        else B_LevelPoint[i] = EValue(engine, B_LEVELPOINT);
            return;
        } else
        if (OperationType == T_MAXCOUNT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_MAXCOUNT))
                        if (AndR(Operation, OperationType, rule)) B_MaxCount[i] = value;
                        else B_MaxCount[i] = EValue(engine, B_MAXCOUNT);
            return;
        } else
        if (OperationType == T_HEDGEMAGNITUDE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_HEDGEMAGNITUDE))
                        if (!B_Hedged[i])
                            if (AndR(Operation, OperationType, rule)) B_HedgeMagnitude[i] = value;
                            else B_HedgeMagnitude[i] = EValue(engine, B_HEDGEMAGNITUDE);
            return;
        } else
        if (OperationType == T_MAXTIME) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_MAXTIME))
                        if (AndR(Operation, OperationType, rule)) B_MaxTime[i] = value;
                        else B_MaxTime[i] = EValue(engine, B_MAXTIME);
            return;
        } else
        if (OperationType == T_RECOVERYMODE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_RECOVERYMODE))
                        if (AndR(Operation, OperationType, rule)) B_RecoveryMode[i] = value;
                        else B_RecoveryMode[i] = EValue(engine, B_RECOVERYMODE);
            return;
        } else
        if (OperationType == T_RECOVERYVALUE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_RECOVERYVALUE))
                        if (AndR(Operation, OperationType, rule)) B_RecoveryValue[i] = value;
                        else B_RecoveryValue[i] = EValue(engine, B_RECOVERYVALUE);
            return;
        } else
        if (OperationType == T_ILOT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_ILOT))
                        if (AndR(Operation, OperationType, rule)) B_ILot[i] = value;
                        else B_ILot[i] = (EValue(engine, B_ILOT) == 0) ? NormalizeDouble(AccountEquity()/10000,2)  : EValue(engine, B_ILOT);
            return;
        } else
        if (OperationType == T_MAXLOT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_MAXLOT))
                        if (AndR(Operation, OperationType, rule)) B_MaxLot[i] = value;
                        else B_MaxLot[i] = (EValue(engine, B_MAXLOT) == 0) ? SYS_MAXLOT : EValue(engine, B_MAXLOT);
            return;
        } else // only in exit automatic
            if (OperationType == T_BUYLOTTP) {
                for (i = 0; i < B_MaxSessions; i++)
                    if (B_FreeSession[i] == false)
                        if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_BUYLOTTP)) {
                            if (AndE(engine, B_EXITAUTOMATIC)) {
                                if (AndR(Operation, OperationType, rule))
                                    Value = value;
                                else
                                    Value = EValue(engine, B_BUYLOTTP);

                                if (B_BuyLotTP[i] != Value) {
                                    if (Value == 0)
                                        CancelSLTP(B_MagicNumber[i], 0, 1, 0, 0);
                                    else
                                        SetSLTP(B_MagicNumber[i], 0, Value, 0, 0);
                                    B_BuyLotTP[i] = Value;
                                }
                            } else {
                                if (B_BuyLotTP[i] != 0) CancelSLTP(B_MagicNumber[i], 0, 1, 0, 0);
                                B_BuyLotTP[i] = 0;
                            }

                        }
                return;
            }
        else
        if (OperationType == T_BUYLOTSL) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_BUYLOTSL)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule))
                                Value = value;
                            else
                                Value = EValue(engine, B_BUYLOTSL);

                            if (B_BuyLotSL[i] != Value) {
                                if (Value == 0)
                                    CancelSLTP(B_MagicNumber[i], 1, 0, 0, 0);
                                else
                                    SetSLTP(B_MagicNumber[i], Value, 0, 0, 0);
                                B_BuyLotSL[i] = Value;
                            }
                        } else {
                            if (B_BuyLotSL[i] != 0) CancelSLTP(B_MagicNumber[i], 1, 0, 0, 0);
                            B_BuyLotSL[i] = 0;
                        }
                    }
            return;
        } else
        if (OperationType == T_BUYLOTTS) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_BUYLOTTS)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule))
                                Value = value;
                            else
                                Value = EValue(engine, B_BUYLOTTS);
                            B_BuyLotTS[i] = Value;

                        } else
                            B_BuyLotTS[i] = 0;

                    }
            return;
        } else // only in exit automatic
            if (OperationType == T_SELLLOTTP) {
                for (i = 0; i < B_MaxSessions; i++)
                    if (B_FreeSession[i] == false)
                        if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SELLLOTTP)) {
                            if (AndE(engine, B_EXITAUTOMATIC)) {
                                if (AndR(Operation, OperationType, rule))
                                    Value = value;
                                else
                                    Value = EValue(engine, B_SELLLOTTP);

                                if (B_SellLotTP[i] != Value) {
                                    if (Value == 0)
                                        CancelSLTP(B_MagicNumber[i], 0, 0, 0, 1);
                                    else
                                        SetSLTP(B_MagicNumber[i], 0, 0, 0, Value);
                                    B_SellLotTP[i] = Value;
                                }
                            } else {
                                if (B_SellLotTP[i] != 0) CancelSLTP(B_MagicNumber[i], 0, 0, 0, 1);
                                B_SellLotTP[i] = 0;
                            }

                        }
                return;
            }
        else
        if (OperationType == T_SELLLOTSL) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SELLLOTSL)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule))
                                Value = value;
                            else
                                Value = EValue(engine, B_SELLLOTSL);

                            if (B_SellLotSL[i] != Value) {
                                if (Value == 0)
                                    CancelSLTP(B_MagicNumber[i], 0, 0, 1, 0);
                                else
                                    SetSLTP(B_MagicNumber[i], 0, 0, Value, 0);
                                B_SellLotSL[i] = Value;
                            }
                        } else {
                            if (B_SellLotSL[i] != 0) CancelSLTP(B_MagicNumber[i], 0, 0, 1, 0);
                            B_SellLotSL[i] = 0;
                        }
                    }
            return;
        } else
        if (OperationType == T_SELLLOTTS) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SELLLOTTS)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule))
                                Value = value;
                            else
                                Value = EValue(engine, B_SELLLOTTS);

                            B_SellLotTS[i] = Value;

                        } else
                            B_SellLotTS[i] = 0;
                    }
            return;
        } else
        if (OperationType == T_TP) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_TP))
                        if (AndR(Operation, OperationType, rule)) B_TakeProfit[i] = value;
                        else B_TakeProfit[i] = EValue(engine, B_TP);
            return;
        } else
        if (OperationType == T_TS) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_TS))
                        if (AndR(Operation, OperationType, rule)) B_TrailingStop[i] = value;
                        else B_TrailingStop[i] = EValue(engine, B_TS);
            return;
        } else

        if (OperationType == T_SL) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SL))
                        if (AndR(Operation, OperationType, rule)) B_StopLoss[i] = value;
                        else {
                            if (B_HedgeNbrLots[i] + B_BuyNbrTrade[i] + B_SellNbrTrade[i] == 0) B_StopLoss[i] = EValue(engine, B_SL);
                        }
            return;
        } else
        if (OperationType == T_BUYTP) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_BUYTP))
                        if (AndR(Operation, OperationType, rule)) B_BuyTakeProfit[i] = value;
                        else B_BuyTakeProfit[i] = EValue(engine, B_BUYTP);
            return;
        } else
        if (OperationType == T_BUYTS) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_BUYTS))
                        if (AndR(Operation, OperationType, rule)) B_BuyTrailingStop[i] = value;
                        else B_BuyTrailingStop[i] = EValue(engine, B_BUYTS);
            return;
        } else

        if (OperationType == T_BUYSL) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_BUYSL))
                        if (AndR(Operation, OperationType, rule)) B_BuyStopLoss[i] = value;
                        else if (B_BuyNbrTrade[i] == 0) B_BuyStopLoss[i] = EValue(engine, B_BUYSL);
            return;
        } else
        if (OperationType == T_SELLTP) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SELLTP))
                        if (AndR(Operation, OperationType, rule)) B_SellTakeProfit[i] = value;
                        else B_SellTakeProfit[i] = EValue(engine, B_SELLTP);
            return;
        } else
        if (OperationType == T_SELLTS) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SELLTS))
                        if (AndR(Operation, OperationType, rule)) B_SellTrailingStop[i] = value;
                        else B_SellTrailingStop[i] = EValue(engine, B_SELLTS);
            return;
        } else

        if (OperationType == T_SELLSL) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_SELLSL))
                        if (AndR(Operation, OperationType, rule) && !AndR(Operation, T_SELLSL, rule)) B_SellStopLoss[i] = value;
                        else if (B_SellNbrTrade[i] == 0) B_SellStopLoss[i] = EValue(engine, B_SELLSL);

            return;
        } else
        if (OperationType == T_SUSPEND) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation)
                        if (AndR(Operation, OperationType, rule))
                            B_Suspend[i] = true;
                        else B_Suspend[i] = false;
            return;
        } else
        if (OperationType == T_EXITMODE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule && B_Operation[i] == Operation && AndE(engine, B_EXITMODE))
                        if (AndR(Operation, OperationType, rule))
                            B_ExitMode[i] = value;
                        else B_ExitMode[i] = EValue(engine, B_EXITMODE);
            return;
        } else return;
    } else
    if (Operation == OP_EXIT_BUY || Operation == OP_EXIT_SELL || Operation == OP_EXIT) {

        if (OperationType == T_MINPROFIT) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule) {
                        engine = GetEngine(rule, B_Operation[i]);
                        if (engine == -1) continue;

                        if (Operation == OP_EXIT && AndE(engine, B_MINPROFIT))
                            if (AndR(Operation, OperationType, rule)) {
                                B_MinProfit[i] = value;
                                }
                            else {
                                B_MinProfit[i] = EValue(engine, B_MINPROFIT);
                            }
                        if (Operation == OP_EXIT_SELL && AndE(engine, B_SELLMINPROFIT))
                            if (AndR(Operation, OperationType, rule))
                                B_SellMinProfit[i] = value;
                            else
                                B_SellMinProfit[i] = EValue(engine, B_SELLMINPROFIT);

                        if (Operation == OP_EXIT_BUY && AndE(engine, B_BUYMINPROFIT))
                            if (AndR(Operation, OperationType, rule))
                                B_BuyMinProfit[i] = value;
                            else
                                B_BuyMinProfit[i] = EValue(engine, B_BUYMINPROFIT);

                    }
            return;
        } else
        if (OperationType == T_RULE) {
            for (i = 0; i < B_MaxSessions; i++)
                if (B_FreeSession[i] == false)
                    if (B_StartOnRule[i] == rule) {
                        engine = GetEngine(rule, B_Operation[i]);
                        if (engine == -1) continue;

                        if (Operation == OP_EXIT_BUY && AndE(engine, B_EXITBUYRULE))
                            if (AndR(Operation, OperationType, rule))
                                B_ExitBuyOnRule[i] = value;
                            else
                                B_ExitBuyOnRule[i] = EValue(engine, B_EXITBUYRULE);

                        if (Operation == OP_EXIT_SELL && AndE(engine, B_EXITSELLRULE))
                            if (AndR(Operation, OperationType, rule))
                                B_ExitSellOnRule[i] = value;
                            else
                                B_ExitSellOnRule[i] = EValue(engine, B_EXITSELLRULE);

                        if (Operation == OP_EXIT && AndE(engine, B_EXITRULE))
                            if (AndR(Operation, OperationType, rule))
                                B_ExitOnRule[i] = value;
                            else
                                B_ExitOnRule[i] = EValue(engine, B_EXITRULE);

                    }
            return;
        }
    } else
    if (Operation == OP_HEDGE_BUY || Operation == OP_HEDGE_SELL) {
        if (OperationType == T_STATUS) {

        }

    }
}

void InitSessionFromEngine(int session, int engine) {
    B_StartOnRule[session] = EValue(engine, B_STARTRULE);
    B_BuyOnRule[session] = EValue(engine, B_BUYRULE);
    B_SellOnRule[session] = EValue(engine, B_SELLRULE);
    B_ExitOnRule[session] = EValue(engine, B_EXITRULE);
    B_ExitBuyOnRule[session] = EValue(engine, B_EXITBUYRULE);
    B_ExitSellOnRule[session] = EValue(engine, B_EXITSELLRULE);

    B_HedgeMagnitude[session] = EValue(engine, B_HEDGEMAGNITUDE);
    B_Operation[session] = EValue(engine, B_OPERATION);
    B_RecoveryMode[session] = EValue(engine, B_RECOVERYMODE);

    B_ILot[session] = (EValue(engine, B_ILOT) == 0) ? NormalizeDouble(AccountEquity()/10000,2) : EValue(engine, B_ILOT);
    B_MaxLot[session] = (EValue(engine, B_MAXLOT) == 0) ? SYS_MAXLOT : EValue(engine, B_MAXLOT);

    B_MaxCount[session] = EValue(engine, B_MAXCOUNT);
    B_RecoveryValue[session] = EValue(engine, B_RECOVERYVALUE);
    B_OrderType[session] = EValue(engine, B_ORDERTYPE);
    B_Direction[session] = EValue(engine, B_DIRECTION);
    B_DirectionType[session] = EValue(engine, B_DIRECTIONTYPE);
    B_LevelPoint[session] = -1;
    B_KeepBuySell[session] = EValue(engine, B_KEEPBUYSELL);
    B_OneOrderPerBar[session] = EValue(engine, B_ONEORDERPERBAR);    
    B_MaxTime[session] = EValue(engine, B_MAXTIME);
    B_PipStep[session] = EValue(engine, B_PIPSTEP);
    B_TimeStep[session] = EValue(engine, B_TIMESTEP);
    B_TrailingStop[session] = EValue(engine, B_TS);
    B_StopLoss[session] = EValue(engine, B_SL);
    B_TakeProfit[session] = EValue(engine, B_TP);
    B_BuyTrailingStop[session] = EValue(engine, B_BUYTS);
    B_BuyStopLoss[session] = EValue(engine, B_BUYSL);
    B_BuyTakeProfit[session] = EValue(engine, B_BUYTP);
    B_SellTakeProfit[session] = EValue(engine, B_SELLTP);
    B_SellTrailingStop[session] = EValue(engine, B_SELLTS);
    B_SellStopLoss[session] = EValue(engine, B_SELLSL);
    B_MinProfit[session] = EValue(engine, B_MINPROFIT);
    B_BuyMinProfit[session] = EValue(engine, B_BUYMINPROFIT);
    B_SellMinProfit[session] = EValue(engine, B_SELLMINPROFIT);

    B_ExitMode[session] = EValue(engine, B_EXITMODE);
    B_BuyLotSL[session] = EValue(engine, B_BUYLOTSL);
    B_BuyLotTP[session] = EValue(engine, B_BUYLOTTP);
    B_BuyLotTS[session] = EValue(engine, B_BUYLOTTS);
    B_SellLotSL[session] = EValue(engine, B_SELLLOTSL);
    B_SellLotTP[session] = EValue(engine, B_SELLLOTTP);
    B_SellLotTS[session] = EValue(engine, B_SELLLOTTS);

    B_BuySellAutomatic[session] = AndE(engine, B_BUYSELLAUTOMATIC);
    B_ExitAutomatic[session] = AndE(engine, B_EXITAUTOMATIC);
    B_HedgeAutomatic[session] = AndE(engine, B_HEDGEAUTOMATIC);
    B_DeHedgeAutomatic[session] = AndE(engine, B_DEHEDGEAUTOMATIC);
}

void SetSessionValue(int session, int attribute, string value) {
    int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);

    int signal = P_NOSIGNAL;
    switch (attribute) {
    case B_OPERATION:
        Set_Engine(engine, B_OPERATION, signal);
        B_Operation[session] = Operation2Int(value);
        break;
    case B_STARTRULE:
        Set_Engine(engine, B_STARTRULE, signal);
        B_StartOnRule[session] = Rule2Int(value);
        break;
    case B_BUYRULE:
        Set_Engine(engine, B_BUYRULE, signal);
        B_BuyOnRule[session] = Rule2Int(value);
        break;
    case B_SELLRULE:
        Set_Engine(engine, B_SELLRULE, signal);
        B_SellOnRule[session] = Rule2Int(value);
        break;
    case B_EXITBUYRULE:
        Set_Engine(engine, B_EXITBUYRULE, signal);
        B_ExitBuyOnRule[session] = Rule2Int(value);
        break;
    case B_EXITSELLRULE:
        Set_Engine(engine, B_EXITSELLRULE, signal);
        B_ExitSellOnRule[session] = Rule2Int(value);
        break;
    case B_EXITRULE:
        Set_Engine(engine, B_EXITRULE, signal);
        B_ExitOnRule[session] = Rule2Int(value);
        break;

    case B_ILOT:
        Set_Engine(engine, B_ILOT, signal);
        B_ILot[session] = StrToDouble(value);
        break;
    case B_MAXLOT:
        Set_Engine(engine, B_MAXLOT, signal);
        B_MaxLot[session] = StrToDouble(value);
        break;

    case B_MAXCOUNT:
        Set_Engine(engine, B_MAXCOUNT, signal);
        B_MaxCount[session] = StrToInteger(value);
        break;
    case B_DIRECTION:
        Set_Engine(engine, B_DIRECTION, signal);
        B_Direction[session] = Direction2Int(value);
        break;
    case B_DIRECTIONTYPE:
        Set_Engine(engine, B_DIRECTIONTYPE, signal);
        B_DirectionType[session] = DirectionType2Int(value);
        break;
    case B_RECOVERYMODE:
        Set_Engine(engine, B_RECOVERYMODE, signal);
        B_RecoveryMode[session] = Mode2Int(value);
        break;
    case B_RECOVERYVALUE:
        Set_Engine(engine, B_RECOVERYVALUE, signal);
        B_RecoveryValue[session] = StrToDouble(value);
        break;

    case B_ORDERTYPE:
        Set_Engine(engine, B_ORDERTYPE, signal);
        B_OrderType[session] = OrderType2Int(value);
        break;

    case B_PIPSTEP:
        Set_Engine(engine, B_PIPSTEP, signal);
        B_PipStep[session] = StrToInteger(value);
        break;

    case B_TIMESTEP:
        Set_Engine(engine, B_TIMESTEP, signal);
        B_TimeStep[session] = StrToInteger(value);
        break;

    case B_KEEPBUYSELL:
        Set_Engine(engine, B_KEEPBUYSELL, signal);
        B_KeepBuySell[session] = StringToBoolean(value);
        break;
 
    case B_ONEORDERPERBAR:
        Set_Engine(engine, B_ONEORDERPERBAR, signal);
        B_OneOrderPerBar[session] = StringToBoolean(value);
        break;       
    case B_EXITMODE:
        Set_Engine(engine, B_EXITMODE, signal);
        B_ExitMode[session] = ExitMode2Int(value);
        break;
    case B_MAXTIME:
        Set_Engine(engine, B_MAXTIME, signal);
        B_MaxTime[session] = StrToInteger(value);
        break;
    case B_HEDGEMAGNITUDE:
        Set_Engine(engine, B_HEDGEMAGNITUDE, signal);
        B_HedgeMagnitude[session] = StrToInteger(value);
        break;

    case B_MINPROFIT:
        Set_Engine(engine, B_MINPROFIT, signal);
        B_MinProfit[session] = StrToDouble(value);
        break;
    case B_BUYMINPROFIT:
        Set_Engine(engine, B_BUYMINPROFIT, signal);
        B_BuyMinProfit[session] = StrToDouble(value);
        break;
    case B_SELLMINPROFIT:
        Set_Engine(engine, B_SELLMINPROFIT, signal);
        B_SellMinProfit[session] = StrToDouble(value);
        break;

    case B_TS:
        Set_Engine(engine, B_TS, signal);
        B_TrailingStop[session] = StrToDouble(value);
        break;
    case B_TP:
        Set_Engine(engine, B_TP, signal);
        B_TakeProfit[session] = StrToDouble(value);
        break;
    case B_SL:
        Set_Engine(engine, B_SL, signal);
        B_StopLoss[session] = StrToDouble(value);
        break;
    case B_BUYTP:
        Set_Engine(engine, B_BUYTP, signal);
        B_BuyTakeProfit[session] = StrToDouble(value);
        break;
    case B_BUYTS:
        Set_Engine(engine, B_BUYTS, signal);
        B_BuyTrailingStop[session] = StrToDouble(value);
        break;
    case B_BUYSL:
        Set_Engine(engine, B_BUYSL, signal);
        B_BuyStopLoss[session] = StrToDouble(value);
        break;

    case B_SELLTP:
        Set_Engine(engine, B_SELLTP, signal);
        B_SellTakeProfit[session] = StrToDouble(value);
        break;
    case B_SELLTS:
        Set_Engine(engine, B_SELLTS, signal);
        B_SellTrailingStop[session] = StrToDouble(value);
        break;
    case B_SELLSL:
        Set_Engine(engine, B_SELLSL, signal);
        B_SellStopLoss[session] = StrToDouble(value);
        break;

    case B_BUYLOTTP:
        Set_Engine(engine, B_BUYLOTTP, signal);
        B_BuyLotTP[session] = StrToInteger(value);
        if (B_BuyLotTP[session] == 0) CancelSLTP(B_MagicNumber[session], 0, 1, 0, 0);
        else SetSLTP(B_MagicNumber[session], 0, B_BuyLotTP[session], 0, 0);
        break;
    case B_BUYLOTTS:
        Set_Engine(engine, B_BUYLOTTS, signal);
        B_BuyLotTS[session] = StrToInteger(value);
        break;
    case B_BUYLOTSL:
        Set_Engine(engine, B_BUYLOTSL, signal);
        B_BuyLotSL[session] = StrToInteger(value);
        if (B_BuyLotSL[session] == 0) CancelSLTP(B_MagicNumber[session], 1, 0, 0, 0);
        else SetSLTP(B_MagicNumber[session], B_BuyLotSL[session], 0, 0, 0);
        break;

    case B_SELLLOTTP:
        Set_Engine(engine, B_SELLLOTTP, signal);
        B_SellLotTP[session] = StrToInteger(value);
        if (B_SellLotTP[session] == 0) CancelSLTP(B_MagicNumber[session], 0, 0, 0, 1);
        else SetSLTP(B_MagicNumber[session], 0, 0, 0, B_SellLotTP[session]);

        break;
    case B_SELLLOTTS:
        Set_Engine(engine, B_SELLLOTTS, signal);
        B_SellLotTS[session] = StrToInteger(value);
        break;
    case B_SELLLOTSL:
        Set_Engine(engine, B_SELLLOTSL, signal);
        B_SellLotSL[session] = StrToInteger(value);
        if (B_SellLotSL[session] == 0) CancelSLTP(B_MagicNumber[session], 0, 0, 1, 0);
        else SetSLTP(B_MagicNumber[session], 0, 0, B_SellLotSL[session], 0);
        break;
    }

}

void TreatInRules() {
    for (int session = 0; session < B_MaxSessions; session++) {
        if (B_FreeSession[session] == true) continue;
        int Rule = B_StartOnRule[session];
        int Operation = B_Operation[session];

        if (Rule >= NBR_RULES) continue;

        Set_Rule(Operation, T_HMAX, Rule, P_NOSIGNAL, B_HMax[session]);
        Set_Rule(Operation, T_HMIN, Rule, P_NOSIGNAL, B_HMin[session]);
        Set_Rule(Operation, T_MAX, Rule, P_NOSIGNAL, B_Max[session]);
        Set_Rule(Operation, T_MIN, Rule, P_NOSIGNAL, B_Min[session]);
        Set_Rule(Operation, T_EXITBUY, Rule, P_NOSIGNAL, B_ExitBuy[session]);
        Set_Rule(Operation, T_EXITSELL, Rule, P_NOSIGNAL, B_ExitSell[session]);
        Set_Rule(Operation, T_CLOSEBUY, Rule, P_NOSIGNAL, B_CloseBuy[session]);
        Set_Rule(Operation, T_CLOSESELL, Rule, P_NOSIGNAL, B_CloseSell[session]);
        Set_Rule(Operation, T_LASTLOT, Rule, P_NOSIGNAL, B_LastLot[session]);
        Set_Rule(Operation, T_LASTBUYLOT, Rule, P_NOSIGNAL, B_LastBuyLot[session]);
        Set_Rule(Operation, T_LASTSELLLOT, Rule, P_NOSIGNAL, B_LastSellLot[session]);

        Set_Rule(Operation, T_LASTORDEROPENTIME, Rule, P_NOSIGNAL, B_LastOrderOpenTime[session]);
        Set_Rule(Operation, T_LASTORDERCLOSETIME, Rule, P_NOSIGNAL, B_LastOrderCloseTime[session]);
        Set_Rule(Operation, T_LASTORDEROPENPRICE, Rule, P_NOSIGNAL, B_LastOrderOpenPrice[session]);
        Set_Rule(Operation, T_LASTORDERCLOSEPRICE, Rule, P_NOSIGNAL, B_LastOrderClosePrice[session]);

        Set_Rule(Operation, T_FIRSTORDEROPENTIME, Rule, P_NOSIGNAL, B_FirstOrderOpenTime[session]);
        Set_Rule(Operation, T_FIRSTORDERCLOSETIME, Rule, P_NOSIGNAL, B_FirstOrderCloseTime[session]);

        Set_Rule(Operation, T_FIRSTORDEROPENPRICE, Rule, P_NOSIGNAL, B_FirstOrderOpenPrice[session]);
        Set_Rule(Operation, T_FIRSTORDERCLOSEPRICE, Rule, P_NOSIGNAL, B_FirstOrderClosePrice[session]);

        Set_Rule(Operation, T_LASTORDERTYPE, Rule, P_NOSIGNAL, B_LastOrderType[session]);
        Set_Rule(Operation, T_LASTORDERCLOSETYPE, Rule, P_NOSIGNAL, B_LastOrderCloseType[session]);
        Set_Rule(Operation, T_LASTORDERCLOSEPROFIT, Rule, P_NOSIGNAL, B_LastOrderCloseProfit[session]);

        Set_Rule(Operation, T_HASBEENHEDGED, Rule, P_NOSIGNAL, B_HasBeenHedged[session]);
        Set_Rule(Operation, T_BUYNBRTRADE, Rule, P_NOSIGNAL, B_BuyNbrTrade[session]);
        Set_Rule(Operation, T_SELLNBRTRADE, Rule, P_NOSIGNAL, B_SellNbrTrade[session]);
        Set_Rule(Operation, T_BUYNBRLOTS, Rule, P_NOSIGNAL, B_BuyNbrLots[session]);
        Set_Rule(Operation, T_SELLNBRLOTS, Rule, P_NOSIGNAL, B_SellNbrLots[session]);
        Set_Rule(Operation, T_PROFITBUY, Rule, P_NOSIGNAL, B_BuyProfit[session]);
        Set_Rule(Operation, T_PROFITSELL, Rule, P_NOSIGNAL, B_SellProfit[session]);
        Set_Rule(Operation, T_PROFIT, Rule, P_NOSIGNAL, B_SessionProfit[session]);

        Set_Rule(Operation, T_HEDGEPROFIT, Rule, P_NOSIGNAL, B_HedgeProfit[session]);
        Set_Rule(Operation, T_HEDGEBUYPROFIT, Rule, P_NOSIGNAL, B_BuyHedgeProfit[session]);
        Set_Rule(Operation, T_HEDGESELLPROFIT, Rule, P_NOSIGNAL, B_SellHedgeProfit[session]);

        Set_Rule(Operation, T_STARTTRADE, Rule, P_NOSIGNAL, B_StartDate[session]);
        Set_Rule(Operation, T_NEUTRALPOINT, Rule, P_NOSIGNAL, B_NeutralPoint[session]);
        Set_Rule(Operation, T_SELLAVERAGEPOINT, Rule, P_NOSIGNAL, B_SellAveragePoint[session]);
        Set_Rule(Operation, T_BUYAVERAGEPOINT, Rule, P_NOSIGNAL, B_BuyAveragePoint[session]);
        Set_Rule(Operation, T_HEDGELLINE, Rule, P_NOSIGNAL, B_HedgeLine[session]);
        Set_Rule(Operation, T_HEDGENBRLOTS, Rule, P_NOSIGNAL, B_HedgeNbrLots[session]);
        Set_Rule(Operation, T_BUYHEDGENBRLOTS, Rule, P_NOSIGNAL, B_BuyHedgeNbrLots[session]);
        Set_Rule(Operation, T_SELLHEDGENBRLOTS, Rule, P_NOSIGNAL, B_SellHedgeNbrLots[session]);

        Set_Rule(Operation, T_HEDGETYPE, Rule, P_NOSIGNAL, B_HedgeType[session]);
        Set_Rule(Operation, T_HEDGED, Rule, P_NOSIGNAL, B_Hedged[session]);
        Set_Rule(Operation, T_MAXCOUNT, Rule, P_NOSIGNAL, B_MaxCount[session]);
        Set_Rule(Operation, T_SUSPEND, Rule, P_NOSIGNAL, B_Suspend[session]);

        // comportemental change of session ... this can be  applied again .. 
        Set_Rule(Operation, T_EXITMODE, Rule, P_NOSIGNAL, B_ExitMode[session]);
        Set_Rule(Operation, T_HEDGEMAGNITUDE, Rule, P_NOSIGNAL, B_HedgeMagnitude[session]);
        Set_Rule(Operation, T_OPERATION, Rule, P_NOSIGNAL, B_Operation[session]);
        Set_Rule(Operation, T_RECOVERYMODE, Rule, P_NOSIGNAL, B_RecoveryMode[session]);
        Set_Rule(Operation, T_ILOT, Rule, P_NOSIGNAL, B_ILot[session]);
        Set_Rule(Operation, T_MAXLOT, Rule, P_NOSIGNAL, B_MaxLot[session]);

        Set_Rule(Operation, T_BUYLOT, Rule, P_NOSIGNAL, B_BuyLot[session]);
        Set_Rule(Operation, T_SELLLOT, Rule, P_NOSIGNAL, B_SellLot[session]);
        Set_Rule(Operation, T_BUYLOTSL, Rule, P_NOSIGNAL, B_BuyLotSL[session]);
        Set_Rule(Operation, T_BUYLOTTP, Rule, P_NOSIGNAL, B_BuyLotTP[session]);
        Set_Rule(Operation, T_BUYLOTTS, Rule, P_NOSIGNAL, B_BuyLotTS[session]);
        Set_Rule(Operation, T_SELLLOTSL, Rule, P_NOSIGNAL, B_SellLotSL[session]);
        Set_Rule(Operation, T_SELLLOTTP, Rule, P_NOSIGNAL, B_SellLotTP[session]);
        Set_Rule(Operation, T_SELLLOTTS, Rule, P_NOSIGNAL, B_SellLotTS[session]);
        Set_Rule(Operation, T_MAXCOUNT, Rule, P_NOSIGNAL, B_MaxCount[session]);
        Set_Rule(Operation, T_RECOVERYVALUE, Rule, P_NOSIGNAL, B_RecoveryValue[session]);
        Set_Rule(Operation, T_ORDERTYPE, Rule, P_NOSIGNAL, B_OrderType[session]);
        Set_Rule(Operation, T_DIRECTION, Rule, P_NOSIGNAL, B_Direction[session]);
        Set_Rule(Operation, T_DIRECTIONTYPE, Rule, P_NOSIGNAL, B_DirectionType[session]);
        Set_Rule(Operation, T_KEEPBUYSELL, Rule, P_NOSIGNAL, B_KeepBuySell[session]);
        Set_Rule(Operation, T_ONEORDERPERBAR, Rule, P_NOSIGNAL, B_OneOrderPerBar[session]);

        Set_Rule(Operation, T_MAXTIME, Rule, P_NOSIGNAL, B_MaxTime[session]);
        Set_Rule(Operation, T_PIPSTEP, Rule, P_NOSIGNAL, B_PipStep[session]);
        Set_Rule(Operation, T_TIMESTEP, Rule, P_NOSIGNAL, B_TimeStep[session]);
        Set_Rule(Operation, T_TS, Rule, P_NOSIGNAL, B_TrailingStop[session]);
        Set_Rule(Operation, T_TP, Rule, P_NOSIGNAL, B_TakeProfit[session]);
        Set_Rule(Operation, T_SL, Rule, P_NOSIGNAL, B_StopLoss[session]);
        Set_Rule(Operation, T_BUYTS, Rule, P_NOSIGNAL, B_BuyTrailingStop[session]);
        Set_Rule(Operation, T_BUYTP, Rule, P_NOSIGNAL, B_BuyTakeProfit[session]);
        Set_Rule(Operation, T_BUYSL, Rule, P_NOSIGNAL, B_BuyStopLoss[session]);
        Set_Rule(Operation, T_SELLTS, Rule, P_NOSIGNAL, B_SellTrailingStop[session]);
        Set_Rule(Operation, T_SELLTP, Rule, P_NOSIGNAL, B_SellTakeProfit[session]);
        Set_Rule(Operation, T_SELLSL, Rule, P_NOSIGNAL, B_SellStopLoss[session]);
        
        Set_Rule(OP_EXIT, T_MINPROFIT, Rule, P_NOSIGNAL, B_MinProfit[session]);
        Set_Rule(OP_EXIT_BUY, T_MINPROFIT, Rule, P_NOSIGNAL, B_BuyMinProfit[session]);
        Set_Rule(OP_EXIT_SELL, T_MINPROFIT, Rule, P_NOSIGNAL, B_SellMinProfit[session]);
        

    }
}

void TreatSystemRules() {

    //////////////////////////////////////////////////////////// MT4 Passage de parametres //////////////////////////////////////////////////////////////    
    SetEntryRules();
    //////////////////////////////////////////////////////////// MT4 Passage de parametres //////////////////////////////////////////////////////////////      

}

bool B_StartNewSessionRule(int time, int rule, int operation) // minutes
{
    bool found = false;
    bool allhedged = false;
    datetime LastTrade = -1;
    int nbrhedged = 0;
    int nbrsession = 0;
    bool divsession = false;

    if (EndSessions == true)
        return (false);

    if (AccountFreeMargin() < AccountEquity() / 10) {
        PG_Print(TYPE_WARNING, "Check Account : Free Margin = " + DoubleToString(AccountFreeMargin(), 2));
        return (false);
    }
    // MONEY MANAGEMENT   

    if (MMDailyTargetReached || MMDailySymbolTargetReached) return false;
    if (MMWeeklyTargetReached || MMWeeklySymbolTargetReached) return false;

    for (int i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] == false) {
            LastTrade = MathMax(B_StartDate[i], LastTrade);
            if (!B_Hedged[i]) allhedged = false;
            else nbrhedged++;
            nbrsession++;
            if (B_StartOnRule[i] == rule && B_Operation[i] == operation) {
                found = true;
            }
        }
    }
    if (nbrsession >= B_MaxSessions) return (false);
    if (time != 0 && LastTrade != -1 && TimeCurrent() - LastTrade < time * 60) return (false);

    if (!found) {
        int engine = GetEngine(rule, operation);
        if (engine != -1) {
            Send_Operation("Session started for strategy : " + EngineName[engine] + " Currency " + _Symbol);
            if (AlertOnStartRule)
                Alert(_Symbol, " Session started : " + EngineName[engine], "", "");
        }

        return (true);
    }

    return (false);
}

bool B_BuyRule(int session) {
    if (B_CloseBuy[session] || B_ExitBuy[session] || B_Operation[session] == OP_SELL) return (false);

    if (B_BuyNbrTrade[session] >= B_MaxCount[session]) return (false);

    if (B_OneOrderPerBar[session] != 0 && B_LastOrderOpenTime[session] != 0 && OnSameBar (CurrentPeriod, B_LastOrderOpenTime[session])) {
      //  printf ("On Same Bar %d", B_LastOrderOpenTime[session]);
        return (false);
        }

    if (B_TimeStep[session] != 0 && B_LastOrderOpenTime[session] != 0 && (TimeCurrent() - B_LastOrderOpenTime[session]) < B_TimeStep[session] * 60)
        return (false);

    if (B_BuyOnRule[session] != -1 && !AndR(OP_BUY, T_STATUS, B_BuyOnRule[session]))

        return (false);

    if (B_PipStep[session] == 0) // forward is ignored but time or bar step should be set....  
        return (true);


    if (B_BuyNbrTrade[session] == 0 && B_SellNbrTrade[session] == 0) return (true); // nothing in session


    double level = B_PipStep[session] * SYS_POINT;
    double Min, Max;
    
    if (B_DirectionType[session] == DT_MINMAX) {
        Min = B_Min[session];
        Max = B_Max[session];
    } else {
        B_LevelPoint[session] = B_LastOrderOpenPrice[session];
        Min = B_LevelPoint[session];
        Max = B_LevelPoint[session];
        if (Min == -1) return (false); //Nothing is opened !!! 
    }

    if (B_Direction[session] == D_BACKWARD && _Ask <= Min - level) return (true);
    if (B_Direction[session] == D_FORWARD && _Ask >= Max + level) return (true);
    if (B_Direction[session] == D_ANY && (_Ask >= Max + level || _Ask <= Min - level)) return (true);

    return (false);
}

bool B_SellRule(int session) {

    if (B_CloseSell[session] || B_ExitSell[session] || B_Operation[session] == OP_BUY) return (false);

    if (B_SellNbrTrade[session] >= B_MaxCount[session]) return (false);

    if (B_OneOrderPerBar[session] != 0 && B_LastOrderOpenTime[session] != 0 && OnSameBar (CurrentPeriod, B_LastOrderOpenTime[session])) {
//        printf ("On Same Bar %d", B_LastOrderOpenTime[session]);
        return (false);
    }
    if (B_TimeStep[session] != 0 && B_LastOrderOpenTime[session] != 0 && (TimeCurrent() - B_LastOrderOpenTime[session]) < B_TimeStep[session] * 60)
        return (false);
    if (B_SellOnRule[session] != -1 && !AndR(OP_SELL, T_STATUS, B_SellOnRule[session]))
        return (false);

    if (B_PipStep[session] == 0) // forward is ignored ....  
        return (true);

    if (B_BuyNbrTrade[session] == 0 && B_SellNbrTrade[session] == 0) return (true); // nothing in session


    double level = B_PipStep[session] * SYS_POINT;
    double Min, Max;

    if (B_DirectionType[session] == DT_MINMAX) {
        Min = B_Min[session];
        Max = B_Max[session];
    } else  {                       // DT_LEVEL
        B_LevelPoint[session] = B_LastOrderOpenPrice[session];
        Min = B_LevelPoint[session];
        Max = B_LevelPoint[session];
        if (Min == -1) return (false); //Nothing is closed

        if (B_Direction[session] == D_BACKWARD && _Bid >= Max + level) return (true);
        if (B_Direction[session] == D_FORWARD && _Bid <= Min - level) return (true);
        if (B_Direction[session] == D_ANY && (_Ask <= Min - level || _Ask >= Max + level)) return (true); // just put _Ask here in case we are in BUYSELL operation
    }

    return (false);
}

bool B_ExitBuyRule(int session) {
    if (B_ExitBuy[session] == true) return (false);

    if (B_ExitSell[session] == true) {
        if (B_BuyNbrTrade[session] == 0 && B_Operation[session] == OP_SELL) return (true);
    } else {
        if (B_Operation[session] == OP_BUYSELL && B_ExitMode[session] == OP_SELL && B_SellNbrTrade[session] != 0) return (false);
    }

    if (B_Operation[session] == OP_SELL) return (false);

    if ((B_BuyMinProfit[session] == 0 || B_BuyProfit[session] > B_BuyMinProfit[session]) &&
        (B_ExitBuyOnRule[session] == -1 || AndR(OP_EXIT_BUY, T_STATUS, B_ExitBuyOnRule[session])))
        return (true);

    return (false);
}

bool B_ExitSellRule(int session) {
    if (B_ExitSell[session] == true) return (false);

    if (B_ExitBuy[session] == true) {
        if (B_SellNbrTrade[session] == 0 && B_Operation[session] == OP_BUY) return (true);
    } else {
        if (B_Operation[session] == OP_BUYSELL && B_ExitMode[session] == OP_BUY && B_BuyNbrTrade[session] != 0) return (false);
    }

    if (B_Operation[session] == OP_BUY) return (false);

    if ((B_SellMinProfit[session] == 0 || B_SellProfit[session] > B_SellMinProfit[session]) &&
        (B_ExitSellOnRule[session] == -1 || AndR(OP_EXIT_SELL, T_STATUS, B_ExitSellOnRule[session])))
        return (true);

    return (false);
}

bool B_CloseBuyRule(int session) {
    if (B_CloseBuy[session] == true) return (false);
    if (B_BuyNbrTrade[session] == 0) return (false);

    if (B_Operation[session] == OP_SELL) return (false);

    if (B_BuyStopLoss[session] != 0 && B_BuyProfit[session] <= -B_BuyStopLoss[session]) {
        B_BuyStopLoss[session] = 0;
        return (true);
    }
    if (B_TBuyStopLoss[session] != 0 && B_BuyProfit[session] <= B_TBuyStopLoss[session]) {
        B_TBuyStopLoss[session] = 0;
        return (true);
    }

    if (B_BuyTakeProfit[session] != 0 && B_BuyProfit[session] >= B_BuyTakeProfit[session])
        return (true);

    if (AndR(OP_CLOSE_BUY, T_STATUS, B_StartOnRule[session]))
        return (true);

    return (false);
}

bool B_CloseSellRule(int session) {
    if (B_CloseSell[session] == true) return (false);
    if (B_SellNbrTrade[session] == 0) return (false);

    if (B_Operation[session] == OP_BUY) return (false);

    if (B_SellStopLoss[session] != 0 && B_SellProfit[session] <= -B_SellStopLoss[session]) {
        B_SellStopLoss[session] = 0;
        return (true);
    }
    if (B_TSellStopLoss[session] != 0 && B_SellProfit[session] <= B_TSellStopLoss[session]) {
        B_TSellStopLoss[session] = 0;
        return (true);
    }
    if (B_SellTakeProfit[session] != 0 && B_SellProfit[session] >= B_SellTakeProfit[session])
        return (true);

    if (AndR(OP_CLOSE_SELL, T_STATUS, B_StartOnRule[session]))
        return (true);

    return (false);
}

bool B_CloseRule(int session) {

    if (B_CloseSell[session] == true && B_CloseBuy[session] == true) return (false);
    if (B_SellNbrTrade[session] == 0 && B_BuyNbrTrade[session] == 0) return (false);

    if (AndR(OP_CLOSE, T_STATUS, B_StartOnRule[session]))
        return (true);

    return (false);
}

bool B_HedgeBuyRule(int session) {
    int Operation = B_Operation[session];

    if (Operation == OP_SELL) return (false);

    if (B_Hedged[session] == true) {
        if (B_BuyNbrLots[session] - B_SellHedgeNbrLots[session] <= 0.00001) return (false);
    }

    if (AndR(OP_HEDGE_BUY, T_STATUS, B_StartOnRule[session]) && B_BuyNbrTrade[session] > 0)
        return (true);

    return (false);
}

bool B_HedgeSellRule(int session) {
    int Operation = B_Operation[session];

    if (Operation == OP_BUY) return (false);

    if (B_Hedged[session] == true) {
        if (B_SellNbrLots[session] - B_BuyHedgeNbrLots[session] <= 0.00001) return (false); // ok done
    }

    if (AndR(OP_HEDGE_SELL, T_STATUS, B_StartOnRule[session]) && B_SellNbrTrade[session] > 0)
        return (true);

    return (false);
}

bool B_CloseHedgeBuyRule(int session) {
    if (B_Hedged[session] == false) return (false);

    int Operation = B_Operation[session];

    if (Operation == OP_BUY || Operation == OP_BUYSELL) {
        if (AndR(OP_CLOSE_HEDGE_BUY, T_STATUS, B_StartOnRule[session]) && B_SellHedgeNbrLots[session] > 0.00001)
            return (true);
    }
    return (false);

}

bool B_CloseHedgeSellRule(int session) {
    if (B_Hedged[session] == false) return (false);

    int Operation = B_Operation[session];

    if (Operation == OP_SELL || Operation == OP_BUYSELL) {
        if (AndR(OP_CLOSE_HEDGE_SELL, T_STATUS, B_StartOnRule[session]) && B_BuyHedgeNbrLots[session] > 0.00001)
            return (true);
    }
    return (false);

}

bool B_CloseHedgeRule(int session) {
    if (B_Hedged[session] == false) return (false);

    if (AndR(OP_CLOSE_HEDGE, T_STATUS, B_StartOnRule[session]))
        return (true);

    return (false);
}

bool B_ExitRule(int session) {
    double profit = 0;

    if (B_StopLoss[session] != 0 && B_SessionProfit[session] <= -B_StopLoss[session]) {
        B_StopLoss[session] = 0;
        return (true);
    }

    if (B_TStopLoss[session] != 0 && B_SessionProfit[session] <= B_TStopLoss[session]) {
        B_TStopLoss[session] = 0;
        return (true);
    }
    if (B_TakeProfit[session] != 0 && B_SessionProfit[session] >= B_TakeProfit[session]) {
        return (true);
    }

    if (B_MaxTime[session] != 0 && (TimeCurrent() - B_StartDate[session]) > B_MaxTime[session] * 60 &&
        B_SessionProfit[session] >= 0) {
        return (true);
    }
    

    if (B_MinProfit[session] == 0 || B_SessionProfit[session] > B_MinProfit[session]) {

        if (B_ExitOnRule[session] == -1 || AndR(OP_EXIT, T_STATUS, B_ExitOnRule[session])) {

            return (true);
        }
    }

    return (false);
}



string GetEngineNameFromSession(int session) {

    int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);
    string senginename = (engine == -1 ? "Manual" : EngineName[engine]);
    return senginename;
}












////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   PREDEFINED INDICATORS



void FindHistoryBars(int x) {
    int daybefore = 1;
    int startdate;

    if (TimeDayOfWeek(TimeCurrent()) == 1) {
        // skip sunday
        if (TimeDayOfWeek(iTime(NULL, PeriodIndex[P_D1], 1)) == 0)
            daybefore = 2;
        else daybefore = 1;
    }

    if (x == P_D1) {
        startdate = daybefore;
        GetFiboPivots(_Symbol, daybefore);
    } else startdate = 1;

    for (int i = 1; i < NBR_SHIFT; i++) {
        LastClose[i][x] = iClose(NULL, PeriodIndex[x], startdate);
        LastOpen[i][x] = iOpen(NULL, PeriodIndex[x], startdate);
        LastHigh[i][x] = iHigh(NULL, PeriodIndex[x], startdate);
        LastLow[i][x] = iLow(NULL, PeriodIndex[x], startdate);

        LastPivotPoint[i][x] = (LastHigh[i][x] + LastClose[i][x] + LastLow[i][x]) / 3;

        LastSupport[i][x] = 2 * LastPivotPoint[i][x] - LastHigh[i][x];
        LastSupport1[i][x] = LastPivotPoint[i][x] - (LastHigh[i][x] - LastLow[i][x]);
        LastSupport2[i][x] = 2 * LastPivotPoint[i][x] - ((2 * LastHigh[i][x]) - LastLow[i][x]);

        LastResistance[i][x] = 2 * LastPivotPoint[i][x] - LastLow[i][x];
        LastResistance1[i][x] = LastPivotPoint[i][x] + (LastHigh[i][x] - LastLow[i][x]);
        LastResistance2[i][x] = 2 * LastPivotPoint[i][x] + (LastHigh[i][x] - (2 * LastLow[i][x]));
        startdate++;
    }

    LastClose[0][x] = iClose(NULL, PeriodIndex[x], 0);
    LastOpen[0][x] = iOpen(NULL, PeriodIndex[x], 0);
    LastHigh[0][x] = iHigh(NULL, PeriodIndex[x], 0);
    LastLow[0][x] = iLow(NULL, PeriodIndex[x], 0);
    LastPivotPoint[0][x] = (LastHigh[0][x] + LastClose[0][x] + LastLow[0][x]) / 3;
    LastResistance[0][x] = 2 * LastPivotPoint[0][x] - LastLow[0][x];
    LastSupport[0][x] = 2 * LastPivotPoint[0][x] - LastHigh[0][x];
    LastResistance1[0][x] = LastPivotPoint[0][x] + (LastResistance[0][x] - LastSupport[0][x]);
    LastSupport1[0][x] = LastPivotPoint[0][x] - (LastResistance[0][x] - LastSupport[0][x]);
}


void FindBar(int x, int shift = 0) {

    // BAR

    SETSIGNAL(shift, BAR, S_CURRENT, x, P_SIGNAL, LastClose[shift][x] - LastOpen[shift][x]);
    SETSIGNAL(shift, BAR, S_PREVIOUS, x, P_SIGNAL, LastClose[shift + 1][x] - LastOpen[shift + 1][x]);

    Set_Signal_Time(BAR, S_CURRENT, x, iTime(NULL, PeriodIndex[x], shift));
    Set_Signal_Price(BAR, S_CURRENT, x, LastOpen[shift][x]);

    int NbrBars = 0;
    int i = shift;

    if (shift == 0 && TimeOpenBar[x] != 0 && TimeOpenBar[x] != iTime(NULL, PeriodIndex[x], 0))
        Set_Signal(BAR, S_CHANGED, x, P_SIGNAL);

    if (LastClose[shift][x] > LastOpen[shift][x]) {
        SETSIGNAL(shift, BAR, S_UP, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BULL, x, P_SIGNAL);
        if (LastClose[shift + 1][x] < LastOpen[shift + 1][x]) {
            SETSIGNAL(shift, BAR, S_REVERSE_UP, x, P_SIGNAL);
        }

        while (iTime(NULL, PeriodIndex[x], i) != 0 && iClose(NULL, PeriodIndex[x], i) > iOpen(NULL, PeriodIndex[x], i)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, BAR, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else
    if (LastClose[shift][x] < LastOpen[shift][x]) {
        SETSIGNAL(shift, BAR, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BEAR, x, P_SIGNAL);
        if (LastClose[shift + 1][x] >= LastOpen[shift + 1][x]) {
            SETSIGNAL(shift, BAR, S_REVERSE_DOWN, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iClose(NULL, PeriodIndex[x], i) < iOpen(NULL, PeriodIndex[x], i)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, BAR, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else {
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iClose(NULL, PeriodIndex[x], i) == iOpen(NULL, PeriodIndex[x], i)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, BAR, S_NBRBARS, x, P_SIGNAL, NbrBars);

        SETSIGNAL(shift, BAR, S_SIDEWAY, x, P_SIGNAL);
    }

    FindPatterns(x, shift);

}

void FindFirstMaxMin (int x, int object, int from) {
    double min_value = -1;
    double max_value = -1; 
    int i = from;  

    switch (object) {
        case OPEN :
            max_value =  min_value = iOpen(NULL, PeriodIndex[x], i);
        break;    
        case CLOSE :
            max_value =  min_value = iClose(NULL, PeriodIndex[x], i);
        break;    
        case HIGH :
            max_value =  min_value = iHigh(NULL, PeriodIndex[x], i);
        break;    
        case LOW :
            max_value =  min_value = iLow(NULL, PeriodIndex[x], i);
        break;    
    }

    while (iTime(NULL, PeriodIndex[x], i) != 0 && TimeHour(iTime(NULL, PeriodIndex[x], i)) != 0 || (x < P_H1 && TimeMinute(iTime(NULL, PeriodIndex[x], i)) != 0)) {
        switch (object) {
            case OPEN :
                max_value = MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case CLOSE :
                max_value = MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iClose(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case HIGH :
                max_value = MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case LOW :
                max_value = MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            break;    
        }        
        i++;
    }
    

    switch (object) {
        case OPEN :
            max_value =  MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);
            Set_Signal_Value(object, S_FIRSTINDAY, x, iOpen(NULL, PeriodIndex[x], i));         
            Set_Signal_Value(object, S_MAXINDAY, x, max_value);         
            Set_Signal_Value(object, S_MININDAY, x, min_value); 
            if (LastOpen[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINDAY, x, P_SIGNAL);
            if (LastOpen[from][x]  == min_value)  SETSIGNAL(from, object, S_MININDAY, x, P_SIGNAL);                    

        break;    
        case CLOSE :
            max_value =  MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iClose(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINDAY, x, iClose(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINDAY, x,  max_value);         
            Set_Signal_Value(object, S_MININDAY, x,  min_value); 
            if (LastClose[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINDAY, x, P_SIGNAL);
            if (LastClose[from][x]  == min_value)  SETSIGNAL(from, object, S_MININDAY, x, P_SIGNAL);                      
        break;    
        case HIGH :
            max_value =  MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);         
            Set_Signal_Value(object, S_FIRSTINDAY, x, iHigh(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINDAY, x,  max_value);         
            Set_Signal_Value(object, S_MININDAY, x,  min_value);         
            if (LastHigh[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINDAY, x, P_SIGNAL);
            if (LastHigh[from][x]  == min_value)  SETSIGNAL(from, object, S_MININDAY, x, P_SIGNAL);  
        break;    
        case LOW :
            max_value =  MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iLow(NULL, PeriodIndex[x], i), min_value);         
            Set_Signal_Value(object, S_FIRSTINDAY, x, iLow(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINDAY, x,  max_value);         
            Set_Signal_Value(object, S_MININDAY, x,  min_value);         
            if (LastLow[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINDAY, x, P_SIGNAL);
            if (LastLow[from][x]  == min_value)  SETSIGNAL(from, object, S_MININDAY, x, P_SIGNAL);  
        break;  
    }  
    
    i = from;
    while (iTime(NULL, PeriodIndex[x], i) != 0 && x <= P_D1  && (TimeDayOfWeek(iTime(NULL, PeriodIndex[x], i)) != 1 || TimeHour(iTime(NULL, PeriodIndex[x], i)) != 0 || (x < P_H1 && TimeMinute(iTime(NULL, PeriodIndex[x], i)) != 0))) {
        switch (object) {
            case OPEN :
                max_value = MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case CLOSE :
                max_value = MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iClose(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case HIGH :
                max_value = MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case LOW :
                max_value = MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            break;    
        }       
        i++;
    }
    switch (object) {
        case OPEN :
            max_value =  MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINWEEK, x, iOpen(NULL, PeriodIndex[x], i));         
            Set_Signal_Value(object, S_MAXINWEEK, x,  max_value);         
            Set_Signal_Value(object, S_MININWEEK, x,  min_value);         
            if (LastOpen[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINWEEK, x, P_SIGNAL);
            if (LastOpen[from][x]  == min_value)  SETSIGNAL(from, object, S_MININWEEK, x, P_SIGNAL);  
        break;    
        case CLOSE :
            max_value =  MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iClose(NULL, PeriodIndex[x], i), min_value);          
            Set_Signal_Value(object, S_FIRSTINWEEK, x, iClose(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINWEEK, x,  max_value);         
            Set_Signal_Value(object, S_MININWEEK, x,  min_value);         
            if (LastClose[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINWEEK, x, P_SIGNAL);
            if (LastClose[from][x]  == min_value)  SETSIGNAL(from, object, S_MININWEEK, x, P_SIGNAL);  
        break;    
        case HIGH :
            max_value =  MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);           
            Set_Signal_Value(object, S_FIRSTINWEEK, x, iHigh(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINWEEK, x,  max_value);         
            Set_Signal_Value(object, S_MININWEEK, x,  min_value);         
            if (LastHigh[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINWEEK, x, P_SIGNAL);
            if (LastHigh[from][x]  == min_value)  SETSIGNAL(from, object, S_MININWEEK, x, P_SIGNAL);  
        break;    
        case LOW :
            max_value =  MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINWEEK, x, iLow(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINWEEK, x,  max_value);         
            Set_Signal_Value(object, S_MININWEEK, x,  min_value);         
            if (LastLow[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINWEEK, x, P_SIGNAL);
            if (LastLow[from][x]  == min_value)  SETSIGNAL(from, object, S_MININWEEK, x, P_SIGNAL);          
        break;  
    }  
    
    i = from;
    while (iTime(NULL, PeriodIndex[x], i) != 0 && x < P_MN && (TimeDay(iTime(NULL, PeriodIndex[x], i)) != 1 || TimeHour(iTime(NULL, PeriodIndex[x], i)) != 0 || (x < P_H1 && TimeMinute(iTime(NULL, PeriodIndex[x], i)) != 0))) {
        switch (object) {
            case OPEN :
                max_value = MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case CLOSE :
                max_value = MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iClose(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case HIGH :
                max_value = MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case LOW :
                max_value = MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            break;    
        }           
        i++;
    }
    switch (object) {
        case OPEN :
            max_value =  MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINMONTH, x, iOpen(NULL, PeriodIndex[x], i));         
            Set_Signal_Value(object, S_MAXINMONTH, x,  max_value);         
            Set_Signal_Value(object, S_MININMONTH, x,  min_value);         
            if (LastOpen[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINMONTH, x, P_SIGNAL);
            if (LastOpen[from][x]  == min_value)  SETSIGNAL(from, object, S_MININMONTH, x, P_SIGNAL);          
        break;    
        case CLOSE :
            max_value =  MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iClose(NULL, PeriodIndex[x], i), min_value);          
            Set_Signal_Value(object, S_FIRSTINMONTH, x, iClose(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINMONTH, x,  max_value);         
            Set_Signal_Value(object, S_MININMONTH, x,  min_value);         
            if (LastClose[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINMONTH, x, P_SIGNAL);
            if (LastClose[from][x]  == min_value)  SETSIGNAL(from, object, S_MININMONTH, x, P_SIGNAL);          
        break;    
        case HIGH :
            max_value =  MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);           
            Set_Signal_Value(object, S_FIRSTINMONTH, x, iHigh(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINMONTH, x,  max_value);         
            Set_Signal_Value(object, S_MININMONTH, x,  min_value);         
            if (LastHigh[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINMONTH, x, P_SIGNAL);
            if (LastHigh[from][x]  == min_value)  SETSIGNAL(from, object, S_MININMONTH, x, P_SIGNAL);          
        break;    
        case LOW :
            max_value =  MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINMONTH, x, iLow(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINMONTH, x,  max_value);         
            Set_Signal_Value(object, S_MININMONTH, x,  min_value);         
            if (LastLow[from][x]  == max_value)  SETSIGNAL(from, OPEN, S_MAXINMONTH, x, P_SIGNAL);
            if (LastLow[from][x]  == min_value)  SETSIGNAL(from, OPEN, S_MININMONTH, x, P_SIGNAL);          
        break;  
    }  
    
    i = from;
    while (iTime(NULL, PeriodIndex[x], i) != 0  && (TimeMonth(iTime(NULL, PeriodIndex[x], i)) != 1 || TimeDay(iTime(NULL, PeriodIndex[x], i)) != 1 || TimeHour(iTime(NULL, PeriodIndex[x], i)) != 0 || (x < P_H1 && TimeMinute(iTime(NULL, PeriodIndex[x], i)) != 0))) {
        switch (object) {
            case OPEN :
                max_value = MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case CLOSE :
                max_value = MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iClose(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case HIGH :
                max_value = MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);        
            break;    
            case LOW :
                max_value = MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
                min_value = MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            break;    
        }          
        i++;
    }
    switch (object) {
        case OPEN :
            max_value =  MathMax(iOpen(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iOpen(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINYEAR, x, iOpen(NULL, PeriodIndex[x], i));    
            Set_Signal_Value(object, S_MAXINYEAR, x,  max_value);         
            Set_Signal_Value(object, S_MININYEAR, x,  MathMin(iOpen(NULL, PeriodIndex[x], i), min_value));         
            if (LastOpen[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINYEAR, x, P_SIGNAL);
            if (LastOpen[from][x]  == min_value)  SETSIGNAL(from, object, S_MININYEAR, x, P_SIGNAL);          
        break;    
        case CLOSE :
            max_value =  MathMax(iClose(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iClose(NULL, PeriodIndex[x], i), min_value);          
            Set_Signal_Value(object, S_FIRSTINYEAR, x, iClose(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINYEAR, x,  max_value);         
            Set_Signal_Value(object, S_MININYEAR, x,  min_value);         
            if (LastClose[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINYEAR, x, P_SIGNAL);
            if (LastClose[from][x]  == min_value)  SETSIGNAL(from, object, S_MININYEAR, x, P_SIGNAL);          
        break;    
        case HIGH :
            max_value =  MathMax(iHigh(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iHigh(NULL, PeriodIndex[x], i), min_value);           
            Set_Signal_Value(object, S_FIRSTINYEAR, x, iHigh(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINYEAR, x,  max_value);         
            Set_Signal_Value(object, S_MININYEAR, x,  min_value);         
            if (LastHigh[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINYEAR, x, P_SIGNAL);
            if (LastHigh[from][x]  == min_value)  SETSIGNAL(from, object, S_MININYEAR, x, P_SIGNAL);          
        break;    
        case LOW :
            max_value =  MathMax(iLow(NULL, PeriodIndex[x], i), max_value);
            min_value =  MathMin(iLow(NULL, PeriodIndex[x], i), min_value);        
            Set_Signal_Value(object, S_FIRSTINYEAR, x, iLow(NULL, PeriodIndex[x], i));  
            Set_Signal_Value(object, S_MAXINYEAR, x,  max_value);         
            Set_Signal_Value(object, S_MININYEAR, x,  min_value);         
            if (LastLow[from][x]  == max_value)  SETSIGNAL(from, object, S_MAXINYEAR, x, P_SIGNAL);
            if (LastLow[from][x]  == min_value)  SETSIGNAL(from, object, S_MININYEAR, x, P_SIGNAL);          
        break;  
    }         
}



void FindOpen(int x, int shift = 0) {
    //OPEN
    SETSIGNAL(shift, OPEN, S_CURRENT, x, P_SIGNAL, LastOpen[shift][x]);
    SETSIGNAL(shift, OPEN, S_PREVIOUS, x, P_SIGNAL, LastOpen[shift + 1][x]);

    Set_Signal_Time(OPEN, S_CURRENT, x, iTime(NULL, PeriodIndex[x], shift));
    Set_Signal_Price(OPEN, S_CURRENT, x, LastOpen[shift][x]);

    int NbrBars = 0;
    int i = shift;
    
  

    FindFirstMaxMin(x, OPEN, i);
    
    if (LastOpen[shift][x] > LastOpen[shift + 1][x]) {
        SETSIGNAL(shift, OPEN, S_UP, x, P_SIGNAL);
        SETSIGNAL(shift, OPEN, S_BULL, x, P_SIGNAL);
        if (LastOpen[shift + 1][x] < LastOpen[shift + 2][x]) {
            SETSIGNAL(shift, OPEN, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iOpen(NULL, PeriodIndex[x], i) > iOpen(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, OPEN, S_NBRBARS, x, P_SIGNAL, NbrBars);

    } else
    if (LastOpen[shift][x] < LastOpen[shift + 1][x]) {
        SETSIGNAL(shift, OPEN, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, OPEN, S_BEAR, x, P_SIGNAL);
        if (LastOpen[shift + 1][x] > LastOpen[shift + 2][x]) {
            SETSIGNAL(shift, OPEN, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iOpen(NULL, PeriodIndex[x], i) < iOpen(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, OPEN, S_NBRBARS, x, P_SIGNAL, NbrBars);

    } else {
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iOpen(NULL, PeriodIndex[x], i) == iOpen(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, OPEN, S_NBRBARS, x, P_SIGNAL, NbrBars);
        SETSIGNAL(shift, OPEN, S_SIDEWAY, x, P_SIGNAL);
    }

    if (LastOpen[shift][x] < LastOpen[shift + 1][x] && LastHigh[shift][x] > LastOpen[shift + 1][x]) {
        SETSIGNAL(shift, OPEN, S_CROSS_UP, x, P_SIGNAL, _Bid);
        if (_Bid < LastOpen[shift + 1][x])
            SETSIGNAL(shift, OPEN, S_REVERSE_DOWN, x, P_SIGNAL, _Bid);
    }
    if (LastOpen[shift][x] > LastOpen[shift + 1][x] && LastLow[shift][x] < LastOpen[shift + 1][x]) {
        SETSIGNAL(shift, OPEN, S_CROSS_DOWN, x, P_SIGNAL, _Bid);
        if (_Bid > LastOpen[shift + 1][x])
            SETSIGNAL(shift, OPEN, S_REVERSE_UP, x, P_SIGNAL, _Bid);
    }
    if (Upper(LastOpen[shift + 1][x], 0))
        SETSIGNAL(shift, OPEN, S_ABOVE, x, P_SIGNAL);
    else
    if (Lower(LastOpen[shift + 1][x], 0))
        SETSIGNAL(shift, OPEN, S_BELOW, x, P_SIGNAL);
    else
        SETSIGNAL(shift, OPEN, S_TOUCHED, x, P_SIGNAL);

}

void FindClose(int x, int shift = 0) {
    //CLOSE

    SETSIGNAL(shift, CLOSE, S_CURRENT, x, P_SIGNAL, LastClose[shift][x]);
    SETSIGNAL(shift, CLOSE, S_PREVIOUS, x, P_SIGNAL, LastClose[shift + 1][x]);

    Set_Signal_Price(CLOSE, S_CURRENT, x, LastClose[shift][x]);

    int NbrBars = 0;
    int i = shift;

    FindFirstMaxMin(x, CLOSE, i);
    

    if (LastClose[shift][x] > LastClose[shift + 1][x]) {
        SETSIGNAL(shift, CLOSE, S_UP, x, P_SIGNAL);
        SETSIGNAL(shift, CLOSE, S_BULL, x, P_SIGNAL);
        if (LastClose[shift + 1][x] < LastClose[shift + 2][x]) {
            SETSIGNAL(shift, CLOSE, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iClose(NULL, PeriodIndex[x], i) > iClose(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, CLOSE, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else
    if (LastClose[shift][x] < LastClose[shift + 1][x]) {
        SETSIGNAL(shift, CLOSE, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, CLOSE, S_BEAR, x, P_SIGNAL);
        if (LastClose[shift + 1][x] > LastClose[shift + 2][x]) {
            SETSIGNAL(shift, CLOSE, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iClose(NULL, PeriodIndex[x], i) < iClose(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, CLOSE, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else {
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iClose(NULL, PeriodIndex[x], i) == iClose(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, CLOSE, S_NBRBARS, x, P_SIGNAL, NbrBars);
        SETSIGNAL(shift, CLOSE, S_SIDEWAY, x, P_SIGNAL);

    }
    if (LastOpen[shift][x] < LastClose[shift + 1][x] && LastHigh[shift][x] > LastClose[shift + 1][x]) {
        SETSIGNAL(shift, CLOSE, S_CROSS_UP, x, P_SIGNAL, _Bid);
        if (_Bid < LastClose[shift + 1][x])
            SETSIGNAL(shift, CLOSE, S_REVERSE_DOWN, x, P_SIGNAL, _Bid);
    }
    if (LastOpen[shift][x] > LastClose[shift + 1][x] && LastLow[shift][x] < LastClose[shift + 1][x]) {
        SETSIGNAL(shift, CLOSE, S_CROSS_DOWN, x, P_SIGNAL, _Bid);
        if (_Bid > LastClose[shift + 1][x])
            SETSIGNAL(shift, CLOSE, S_REVERSE_UP, x, P_SIGNAL, _Bid);

    }

    if (Upper(LastClose[shift + 1][x], 0))
        SETSIGNAL(shift, CLOSE, S_ABOVE, x, P_SIGNAL);
    else
    if (Lower(LastClose[shift + 1][x], 0))
        SETSIGNAL(shift, CLOSE, S_BELOW, x, P_SIGNAL);
    else
        SETSIGNAL(shift, CLOSE, S_TOUCHED, x, P_SIGNAL);

}

void FindHigh(int x, int shift = 0) {
    //HIGH

    SETSIGNAL(shift, HIGH, S_CURRENT, x, P_SIGNAL, LastHigh[shift][x]);
    SETSIGNAL(shift, HIGH, S_PREVIOUS, x, P_SIGNAL, LastHigh[shift + 1][x]);
    int NbrBars = 0;
    int i = shift;

    FindFirstMaxMin(x, HIGH, i);    

    if (LastHigh[shift][x] > LastHigh[shift + 1][x]) {
        SETSIGNAL(shift, HIGH, S_UP, x, P_SIGNAL);
        SETSIGNAL(shift, HIGH, S_BULL, x, P_SIGNAL);

        if (LastHigh[shift + 1][x] < LastHigh[shift + 2][x]) {
            SETSIGNAL(shift, HIGH, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iHigh(NULL, PeriodIndex[x], i) > iHigh(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, HIGH, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else
    if (LastHigh[shift][x] < LastHigh[shift + 1][x]) {
        SETSIGNAL(shift, HIGH, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, HIGH, S_BEAR, x, P_SIGNAL);

        if (LastHigh[shift + 1][x] > LastHigh[shift + 2][x]) {
            SETSIGNAL(shift, HIGH, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iHigh(NULL, PeriodIndex[x], i) < iHigh(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, HIGH, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else {
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iHigh(NULL, PeriodIndex[x], i) > iHigh(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, HIGH, S_NBRBARS, x, P_SIGNAL, NbrBars);
        SETSIGNAL(shift, HIGH, S_SIDEWAY, x, P_SIGNAL);

    }
    if (LastOpen[shift][x] < LastHigh[shift + 1][x] && LastHigh[shift][x] > LastHigh[shift + 1][x]) {
        SETSIGNAL(shift, HIGH, S_CROSS_UP, x, P_SIGNAL, _Bid);
        if (_Bid < LastHigh[shift + 1][x])
            SETSIGNAL(shift, HIGH, S_REVERSE_DOWN, x, P_SIGNAL, _Bid);

    }
    if (LastOpen[shift][x] > LastHigh[shift + 1][x] && LastLow[shift][x] < LastHigh[shift + 1][x]) {
        SETSIGNAL(shift, HIGH, S_CROSS_DOWN, x, P_SIGNAL, _Bid);
        if (_Bid > LastHigh[shift + 1][x])
            SETSIGNAL(shift, HIGH, S_REVERSE_UP, x, P_SIGNAL, _Bid);
    }

    if (Upper(LastHigh[shift + 1][x], 0))
        SETSIGNAL(shift, HIGH, S_ABOVE, x, P_SIGNAL);
    else
    if (Lower(LastHigh[shift + 1][x], 0))
        SETSIGNAL(shift, HIGH, S_BELOW, x, P_SIGNAL);
    else
        SETSIGNAL(shift, HIGH, S_TOUCHED, x, P_SIGNAL);
}

void FindLow(int x, int shift = 0) {

    //LOW   

    SETSIGNAL(shift, LOW, S_CURRENT, x, P_SIGNAL, LastLow[shift][x]);
    SETSIGNAL(shift, LOW, S_PREVIOUS, x, P_SIGNAL, LastLow[shift + 1][x]);
    int NbrBars = 0;
    int i = shift;
    
    FindFirstMaxMin(x, LOW, i);    
        
           
        
    if (LastLow[shift][x] > LastLow[shift + 1][x]) {
        SETSIGNAL(shift, LOW, S_UP, x, P_SIGNAL);
        SETSIGNAL(shift, LOW, S_BULL, x, P_SIGNAL);

        if (LastLow[shift + 1][x] < LastLow[shift + 2][x]) {
            SETSIGNAL(shift, LOW, S_CHANGED, x, P_SIGNAL);
        }
            while (iTime(NULL, PeriodIndex[x], i) != 0 && iLow(NULL, PeriodIndex[x], i) > iLow(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, LOW, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else
    if (LastLow[shift][x] < LastLow[shift + 1][x]) {
        SETSIGNAL(shift, LOW, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, LOW, S_BEAR, x, P_SIGNAL);
        if (LastLow[shift + 1][x] > LastLow[shift + 2][x]) {
            SETSIGNAL(shift, LOW, S_CHANGED, x, P_SIGNAL);
        }
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iLow(NULL, PeriodIndex[x], i) < iLow(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, LOW, S_NBRBARS, x, P_SIGNAL, NbrBars);

    } else {
        while (iTime(NULL, PeriodIndex[x], i) != 0 && iLow(NULL, PeriodIndex[x], i) == iLow(NULL, PeriodIndex[x], i + 1)) {
            NbrBars += 1;
            i++;
        }
        SETSIGNAL(shift, LOW, S_NBRBARS, x, P_SIGNAL, NbrBars);
        SETSIGNAL(shift, LOW, S_SIDEWAY, x, P_SIGNAL);
    }
    if (LastOpen[shift][x] < LastLow[shift + 1][x] && LastHigh[shift][x] > LastLow[shift + 1][x]) {
        SETSIGNAL(shift, LOW, S_CROSS_UP, x, P_SIGNAL, _Bid);
        if (_Bid < LastLow[shift + 1][x])
            SETSIGNAL(shift, LOW, S_REVERSE_DOWN, x, P_SIGNAL, _Bid);

    }
    if (LastOpen[shift][x] > LastLow[shift + 1][x] && LastLow[shift][x] < LastLow[shift + 1][x]) {
        SETSIGNAL(shift, LOW, S_CROSS_DOWN, x, P_SIGNAL, _Bid);
        if (_Bid > LastLow[shift + 1][x])
            SETSIGNAL(shift, LOW, S_REVERSE_UP, x, P_SIGNAL, _Bid);
    }

    if (Lower(LastLow[shift + 1][x], 0))
        SETSIGNAL(shift, LOW, S_BELOW, x, P_SIGNAL);
    else
    if (Upper(LastLow[shift + 1][x], 0))
        SETSIGNAL(shift, LOW, S_ABOVE, x, P_SIGNAL);
    else
        SETSIGNAL(shift, LOW, S_TOUCHED, x, P_SIGNAL);

}

void FindPatterns(int x, int shift) {
    int Star_Body_Length = 5;
    double Range, AvgRange;
    int counter, setalert;
    int shift1;
    int shift2;
    int shift3;
    int shift4;
    string pattern, speriod;
    int setPattern = 0;
    int alert = 0;
    int arrowShift;
    int textShift;
    double O, O1, O2, O3, C, C1, C2, C3, L, L1, L2, L3, H, H1, H2, H3;
    double CL, CLmin, CL1, CL2, CL3, BL, BLa, BL90, BL1, BL2, UW, UWa, UW1, UW2, LW, LWa, LW1, LW2, BodyHigh, BodyLow;
    BodyHigh = 0;
    BodyLow = 0;
    double Doji_Star_Ratio = 0;
    double Doji_MinLength = 0;
    double Star_MinLength = 0;
    int Pointer_Offset = 0; // The offset value for the arrow to be located off the candle high or low point.
    int High_Offset = 0; // The offset value added to the high arrow pointer for correct plotting of the pattern label.
    int CumOffset = 0; // The counter value to be added to as more candle types are met.

    double Piercing_Line_Ratio = 0;
    int Piercing_Candle_Length = 0;
    int Engulfing_Length = 0;
    double Candle_WickBody_Percent = 0.9;
    int CandleLength = 0;

    switch (x) {
    case P_M1:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 10;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 15;
        break;
    case P_M5:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 10;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 15;
        break;
    case P_M15:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 0;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 15;
        break;
    case P_M30:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 15;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 15;
        break;
    case P_H1:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 25;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 20;
        break;
    case P_H4:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 20;
        CandleLength = 12;
        Pointer_Offset = 20;
        High_Offset = 40;
        break;
    case P_D1:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 30;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 80;
        break;
    case P_W1:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 40;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 35;
        break;
    case P_MN:
        Doji_Star_Ratio = 0;
        Piercing_Line_Ratio = 0.5;
        Piercing_Candle_Length = 10;
        Engulfing_Length = 50;
        CandleLength = 12;
        Pointer_Offset = 9;
        High_Offset = 45;
        break;
    }

    CumOffset = 0;
    setalert = 0;
    counter = shift;
    Range = 0;
    AvgRange = 0;

    for (counter = shift; counter <= shift + 9; counter++) {
        AvgRange = AvgRange + MathAbs(iHigh(NULL, PeriodIndex[x], counter) - iLow(NULL, PeriodIndex[x], counter));
    }

    Range = AvgRange / 10;
    shift1 = shift + 0;
    shift2 = shift + 1;
    shift3 = shift + 2;
    shift4 = shift + 3;

    O = LastOpen[shift1][x];
    O1 = LastOpen[shift2][x];
    O2 = LastOpen[shift3][x];
    O3 = LastOpen[shift4][x];    
    H = LastHigh[shift1][x];
    H1 = LastHigh[shift2][x];
    H2 = LastHigh[shift3][x];
    H3 = LastHigh[shift4][x];
    L = LastLow[shift1][x];
    L1 = LastLow[shift2][x];
    L2 = LastLow[shift3][x];
    L3 = LastLow[shift4][x];
    C = LastClose[shift1][x];
    C1 = LastClose[shift2][x];
    C2 = LastClose[shift3][x];
    C3 = LastClose[shift4][x];

    if (O > C) {
        BodyHigh = O;
        BodyLow = C;
    } else {
        BodyHigh = C;
        BodyLow = O;
    }
    CL = H - L;
    CL1 = H1 - L1;
    CL2 = H2 - L2;
    CL3 = H3 - L3;
    BL = O - C;
    UW = H - BodyHigh;
    LW = BodyLow - L;
    BLa = MathAbs(BL);
    BL90 = BLa * Candle_WickBody_Percent;
    if (CL == 0)  CL += _Point;
    if (CL2 == 0) CL2 += _Point;
    if (CL1 == 0) CL1 += _Point;
    if (CL3 == 0) CL3 += _Point;
    
    // Check for Doji

    if (C == O) {
        SETSIGNAL(shift, BAR, S_DOJI, x, P_SIGNAL);
    }

    // Bearish Patterns  

    if (C3 > O3 && C2 >= O2 && C1 < O1 && C < O) {
        SETSIGNAL(shift, BAR, S_BEAR_QUAD, x, P_SIGNAL, MathMin (L3, L2));
    }

    // Check for Bearish Shooting ShootStar
    if ((H >= H1) && (H > H2) && (H > H3)) {
        if (((UW / 2) > LW) && (UW > (2 * BL90)) && (CL >= (CandleLength * _Point)) && (O != C) && ((UW / 3) <= LW) && ((UW / 4) <= LW) /*&&(L>L1)&&(L>L2)*/ ) {
            SETSIGNAL(shift, BAR, S_BEAR_SHOOTING_STAR, x, P_SIGNAL);
        }
        if (((UW / 3) > LW) && (UW > (2 * BL90)) && (CL >= (CandleLength * _Point)) && (O != C) && ((UW / 4) <= LW) /*&&(L>L1)&&(L>L2)*/ ) {
            SETSIGNAL(shift, BAR, S_BEAR_SHOOTING_STAR1, x, P_SIGNAL);
        }
        if (((UW / 4) > LW) && (UW > (2 * BL90)) && (CL >= (CandleLength * _Point)) && (O != C) /*&&(L>L1)&&(L>L2)*/ ) {
            SETSIGNAL(shift, BAR, S_BEAR_SHOOTING_STAR2, x, P_SIGNAL);
        }
    }

    // Check for Inverted Hammer and Shooting Star

    if ((O1 > C1) && (CL > 3 * BLa) && ((H - C) / CL >= 0.75) && ((H - O) / CL >= 0.75)) {
        SETSIGNAL(shift, BAR, S_BULL_INVERTED_HAMMER, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BULL_INVERTED_HAMMER1, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BULL_INVERTED_HAMMER2, x, P_SIGNAL);

    }

    // Check for Evening Star pattern
    if ((H >= H1) && (H1 > H2) && (H1 > H3)) {
        if ( /*(L>O1)&&*/ (BLa < (Star_Body_Length * _Point)) && (C2 > O2) && (!O == C) && ((C2 - O2) / ( /*0.001+*/ CL2) > Doji_Star_Ratio) /*&&(C2<O1)*/ && (C1 > O1) /*&&((H1-L1)>(3*(C1-O1)))*/ && (O > C) && (CL >= (Star_MinLength * _Point))) {
            SETSIGNAL(shift, BAR, S_BEAR_EVENING_STAR, x, P_SIGNAL);
        }
    }

    // Check for Evening Doji Star pattern
    if ((H >= H1) && (H1 > H2) && (H1 > H3)) {
        if ( /*(L>O1)&&*/ (O == C) && ((C2 > O2) && (C2 - O2) / ( /*0.001+*/ CL2) > Doji_Star_Ratio) /*&&(C2<O1)*/ && (C1 > O1) /*&&((H1-L1)>(3*(C1-O1)))*/ && (CL >= (Doji_MinLength * _Point))) {
            SETSIGNAL(shift, BAR, S_BEAR_EVENING_DOJI_STAR, x, P_SIGNAL);
        }
    }

    // Check for a Dark Cloud Cover pattern
    if ((C1 > O1) && (((C1 + O1) / 2) > C) && (O > C) /*&&(O>C1)*/ && (C > O1) && (BL / ( /*0.001+*/ CL) > Piercing_Line_Ratio) && ((CL >= Piercing_Candle_Length * _Point))) {
        SETSIGNAL(shift, BAR, S_BEAR_DARK_CLOUD_COVER, x, P_SIGNAL);
    }

    // Check for Bearish Engulfing pattern
    if ((C1 > O1) && (O > C) && (O >= C1) && (O1 >= C) && (BL > (C1 - O1)) && (CL >= (Engulfing_Length * _Point))) {
        SETSIGNAL(shift, BAR, S_BEAR_ENGULFING, x, P_SIGNAL);
    }

    // Check for Bearish Harami pattern
    if ((C1 > O1) && (O > C) && (O <= C1) && (O1 <= C) && (BL < (C1 - O1))) {
        SETSIGNAL(shift, BAR, S_BEAR_HARAMI, x, P_SIGNAL);
    }

    // Check for Hanging Man
    if ((C1 > O1) && (CL > 3 * BLa) && ((C - L) / CL >= 0.75) && ((O - L) / CL >= 0.75)) {
        SETSIGNAL(shift, BAR, S_BEAR_HANGING_MAN, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BEAR_HANGING_MAN1, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BEAR_HANGING_MAN2, x, P_SIGNAL);

    }

    // Check for Three Inside Down pattern

    if ((C2 > O2) && (O1 > C1) && (O1 <= C2) && (O2 <= C1) && ((O1 - C1) < (C2 - O2)) && (O > C) && (C < C1) && (O < O1)) {
        SETSIGNAL(shift, BAR, S_BEAR_THREE_INSIDE_DOWN, x, P_SIGNAL);
    }

    // Check for a Three Outside Down pattern
    if ((C2 > O2) && (O1 > C1) && (O1 >= C2) && (O2 >= C1) && ((O1 - C1) > (C2 - O2)) && (O > C) && (C < C1)) {
        SETSIGNAL(shift, BAR, S_BEAR_THREE_OUTSIDE_DOWN, x, P_SIGNAL);
    }

    // Check for Three Black Crows pattern

    if ((O > C) && (O1 > C1 ) && (O2 > C2 ) && (C < C1) && (C1 < C2) && (O > C1) && (O < O1) && (O1 > C2) && (O1 < O2) && (((C - L) / CL) < 0.6) && (((C1 - L1) / CL1) < 0.6) && (((C2 - L2) / CL2) < 0.6)) {
        SETSIGNAL(shift, BAR, S_BEAR_THREE_BLACK_CROWS, x, P_SIGNAL);
    }

    // End of Bearish Patterns

    // Bullish Patterns
    if (C3 < O3 && C2 < O2 && C1 > O1 && C > O) {
  //  if (C1 < O1 && C1 <= C && C <= O1) {
        SETSIGNAL(shift, BAR, S_BULL_QUAD, x, P_SIGNAL, MathMax (H3, H2));
    }

    // Check for Bullish Hammer   

    if ((L <= L1) && (L < L2) && (L < L3)) {
        if (((LW / 2) > UW) && (LW > BL90) && (CL >= (CandleLength * _Point)) && (O != C) && ((LW / 3) <= UW) && ((LW / 4) <= UW) /*&&(H<H1)&&(H<H2)*/ ) {
            SETSIGNAL(shift, BAR, S_BULL_HAMMER, x, P_SIGNAL);
        }
        if (((LW / 3) > UW) && (LW > BL90) && (CL >= (CandleLength * _Point)) && (O != C) && ((LW / 4) <= UW) /*&&(H<H1)&&(H<H2)*/ ) {
            SETSIGNAL(shift, BAR, S_BULL_HAMMER1, x, P_SIGNAL);
        }
        if (((LW / 4) > UW) && (LW > BL90) && (CL >= (CandleLength * _Point)) && (O != C) /*&&(H<H1)&&(H<H2)*/ ) {
            SETSIGNAL(shift, BAR, S_BULL_HAMMER2, x, P_SIGNAL);
        }

    }

    // Check for Morning Star

    if ((L <= L1) && (L1 < L2) && (L1 < L3)) {
        if ( /*(H1<(BL/2))&&*/ (BLa < (Star_Body_Length * _Point)) && (!O == C) && ((O2 > C2) && ((O2 - C2) / ( /*0.001+*/ CL2) > Doji_Star_Ratio)) /*&&(C2>O1)*/ && (O1 > C1) /*&&((H1-L1)>(3*(C1-O1)))*/ && (C > O) && (CL >= (Star_MinLength * _Point))) {
            SETSIGNAL(shift, BAR, S_BULL_MORNING_STAR, x, P_SIGNAL);
        }
    }

    // Check for Morning Doji Star

    if ((L <= L1) && (L1 < L2) && (L1 < L3)) {
        if ( /*(H1<(BL/2))&&*/ (O == C) && ((O2 > C2) && ((O2 - C2) / ( /*0.001+*/ CL2) > Doji_Star_Ratio)) /*&&(C2>O1)*/ && (O1 > C1) /*&&((H1-L1)>(3*(C1-O1)))*/ && (CL >= (Doji_MinLength * _Point))) {
            SETSIGNAL(shift, BAR, S_BULL_MORNING_DOJI_STAR, x, P_SIGNAL);
        }
    }
    // Check for Piercing Line pattern

    if ((C1 < O1) && (((O1 + C1) / 2) < C) && (O < C) /*&&(O<C1)*/ && (C < O1) && ((C - O) / ( /*0.001+*/ CL) > Piercing_Line_Ratio) && (CL >= (Piercing_Candle_Length * _Point))) {
        SETSIGNAL(shift, BAR, S_BULL_PIERCING_LINE, x, P_SIGNAL);
    }

    // Check for Bullish Engulfing pattern

    if ((O1 > C1) && (C > O) && (C >= O1) && (O <= C1) && ((C - O) > (O1 - C1)) && (CL >= (Engulfing_Length * _Point))) {
        SETSIGNAL(shift, BAR, S_BULL_ENGULFING, x, P_SIGNAL);
    }

    // Check for Inverted Hammer and Shooting Star

    if ((O1 > C1) && (CL > 3 * BLa) && ((H - C) / CL >= 0.75) && ((H - O) / CL >= 0.75)) {
        SETSIGNAL(shift, BAR, S_BULL_INVERTED_HAMMER, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BULL_INVERTED_HAMMER1, x, P_SIGNAL);
        SETSIGNAL(shift, BAR, S_BULL_INVERTED_HAMMER2, x, P_SIGNAL);

    }

    // Check for Three Outside Up pattern

    if ((O2 > C2) && (C1 > O1) && (C1 >= O2) && (C2 >= O1) && ((C1 - O1) > (O2 - C2)) && (C > O) && (C > C1)) {
        SETSIGNAL(shift, BAR, S_BULL_THREE_OUTSIDE_UP, x, P_SIGNAL);
    }

    // Check for Bullish Harami pattern

    if ((O1 > C1) && (C > O) && (C <= O1) && (C1 <= O) && ((C - O) < (O1 - C1))) {
        SETSIGNAL(shift, BAR, S_BULL_HARAMI, x, P_SIGNAL);
    }

    // Check for Three Inside Up pattern

    if ((O2 > C2) && (C1 > O1) && (C1 <= O2) && (C2 <= O1) && ((C1 - O1) < (O2 - C2)) && (C > O) && (C > C1) && (O > O1)) {
        SETSIGNAL(shift, BAR, S_BULL_THREE_INSIDE_UP, x, P_SIGNAL);
    }

    // Check for Three White Soldiers pattern

    if ((C > O * 0.001) && (C1 > O1 * 0.001) && (C2 > O2 * 0.001) && (C > C1) && (C1 > C2) && (O < C1 && O > O1) && (O1 < C2 && O1 > O2) && (((H - C) / CL) < 0.6) && (((H1 - C1) / CL1) < 0.6) && (((H2 - C2) / CL2) < 0.6)) {
        SETSIGNAL(shift, BAR, S_BULL_THREE_WHITE_SOLDIERS, x, P_SIGNAL);
    }
    return (0);

}

string FormatDateTime(int nYear, int nMonth, int nDay, int nHour, int nMin, int nSec) {
    string sMonth, sDay, sHour, sMin, sSec;
    //----
    sMonth = 100 + nMonth;
    sMonth = StringSubstr(sMonth, 1);
    sDay = 100 + nDay;
    sDay = StringSubstr(sDay, 1);
    sHour = 100 + nHour;
    sHour = StringSubstr(sHour, 1);
    sMin = 100 + nMin;
    sMin = StringSubstr(sMin, 1);
    sSec = 100 + nSec;
    sSec = StringSubstr(sSec, 1);
    //----
    return (StringConcatenate(nYear, ".", sMonth, ".", sDay, " ", sHour, ":", sMin, ":", sSec));
}
//+------------------------------------------------------------------+


datetime ToDate(string stDate, string stTime) {
    string syear = StringSubstr(stDate, 6, 4);

    string smonth;

    string SMonth = StringSubstr(stDate, 0, 2);
    smonth= SMonth;

    if (SMonth == "01") smonth = "1";
    if (SMonth == "02") smonth = "2";
    if (SMonth == "03") smonth = "3";
    if (SMonth == "04") smonth = "4";
    if (SMonth == "05") smonth = "5";
    if (SMonth == "06") smonth = "6";
    if (SMonth == "07") smonth = "7";
    if (SMonth == "08") smonth = "8";
    if (SMonth == "09") smonth = "9";

    string sday = StringSubstr(stDate, 3, 2);
    string stime = syear + "." + smonth + "." + sday + " " + stTime;
    return (StrToTime(stime));
}


string ReturnElapsedTime(datetime time) {
    string s = "";

    int day = time / (24 * 60 * 60);
    int remain = time % (24 * 60 * 60);
    int hour = remain / (60 * 60);
    int minute = remain % (60 * 60) / 60;

    s = "     Elapsed  : " + day + " Day(s), " + hour + " Hour(s), and " + minute + " Minutes (s).";
    return (s);
}

datetime ReturnStartDate() {
    datetime starttime = TimeCurrent();
    datetime objecttime;

    int total = OrdersHistoryTotal();

    for (int cnt = 0; cnt < total; cnt++) {
        if (OrderType() != OP_BUY && OrderType() != OP_SELL) continue;
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        objecttime = OrderOpenTime();
        if (starttime > objecttime) starttime = objecttime;
    }
    return (starttime);
}






int ReturnWeekOfMonth() {

    datetime StartMonthDate = StrToTime(Year() + "." + Month() + ".1");
    int WeekDay = TimeDayOfWeek(StartMonthDate);

    int AddOn = 8 - WeekDay;
    int Week1 = AddOn;
    int Week2 = Week1 + 7;
    int Week3 = Week2 + 7;
    int Week4 = Week3 + 7;
    int Week5 = Week4 + 7;
    int Week6 = Week5 + 7;

    int CurrentDay = Day();

    if (CurrentDay < Week1) return (1);
    if (CurrentDay < Week2) return (2);
    if (CurrentDay < Week3) return (3);
    if (CurrentDay < Week4) return (4);
    if (CurrentDay < Week5) return (5);
    else return (6);

    return (-1);

}

int ReturnDayOccurenceInMonth() {

    int day = Day();

    int oday = 1;

    while (day - 7 > 0) {
        oday++;
        day -= 7;
    }
    return (oday);
}

//----------------------------------------------------------------------------MONEY MANAGEMENT----------------------------------------------------------------------------------
void ReloadMM() {

    int result = LoadMM();
    if (result != -1)
        Send_Operation("Money Management is set");
}

void SaveMM() {
    int file = FileOpen("PG_Money" + SYS_SYMBOL, FILE_WRITE | FILE_BIN);
    if (file == -1) return;

    string s = "-1," + MMDailyTargetAmount + "," + MMDailyStopLoss + "," + + MMWeeklyTargetAmount + "," + MMWeeklyStopLoss;
    FileWriteString(file, s, StringLen(s));
    FileClose(file);
}

void SetMM(string s) {
    int i = 0;
    string symbol = "";
    string Target = "";
    string SL = "";
    string WTarget = "";
    string WSL = "";

    string PercentTarget = "";
    string PercentSL = "";
    string PercentWTarget = "";
    string PercentWSL = "";


    string slmessage = " is set";
    string targetmessage = "";

    int length = StringLen(s); //"abc" = 3;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            symbol = symbol + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["
        while (StringGetCharacter(s, i) != 32) {
            Target = Target + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++; // skip blank
        while (StringGetCharacter(s, i) != 32) {
            SL = SL + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        while (StringGetCharacter(s, i) != 32) {
            WTarget = WTarget + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        while (StringGetCharacter(s, i) != 32) {
            WSL = WSL + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        while (StringGetCharacter(s, i) != 32) {
            PercentTarget = PercentTarget + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++; // skip blank
        while (StringGetCharacter(s, i) != 32) {
            PercentSL = PercentSL + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        while (StringGetCharacter(s, i) != 32) {
            PercentWTarget = PercentWTarget + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            PercentWSL = PercentWSL + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
         i++; // skip "] "       

    }

    MMDailyTargetAmount = StrToDouble(Target);
    MMDailyStopLoss = StrToDouble(SL);

    MMWeeklyTargetAmount = StrToDouble(WTarget);
    MMWeeklyStopLoss = StrToDouble(WSL);

    MMDailyPercentTargetAmount = StrToDouble(PercentTarget);
    MMDailyStopLoss = StrToDouble(PercentSL);

    MMWeeklyTargetAmount = StrToDouble(PercentWTarget);
    MMWeeklyStopLoss = StrToDouble(PercentWSL);

    
    ReloadMM();
    Send_Operation("Money Management : " + targetmessage + slmessage);
    return;
}



//+------------------------------------------------------------------+

//////////////////////////////// LOAD FILES ///////////////////////////////////////////////////////

void DownloadFile(string filename, string tofilename = NULL) {

}

void DownloadIndicator(string filename) {

}

int DownloadLibrary(string filename, string tofilename = NULL) {


}



int LoadProject() {
    LoadObjects(ObjectString);
    LoadEngines(EngineString); // loadengines
    LoadSchedules(ScheduleString); // loadengines    
    return 1;
}


string StringReadString (string Tab[], int& pos) {
    string selt = Tab[pos];
    pos++;
    return selt;
}

int LoadObjects(string to_split) {
    O_NbrObject = 0;

    string sep=",";                
    ushort u_sep;                  
    string TabString[];               

    u_sep = StringGetCharacter(sep,0);
    int nbr = StringSplit(to_split, u_sep, TabString);

    //skip  first line
    int i = 0;
    int pos = 61;

    int file = 2;
    string par1;
    string par2;
    string par3;
    string par4;
    string par5;
    int nbr_sysobj = 0;
    while (pos < nbr) {
        ObjUsed[i] = true;
        ObjId[i] = StrToInteger(StringReadString(TabString, pos));
        ObjName[i] = StringReadString(TabString, pos);
        ObjType[i] = ObjType2Int(StringReadString(TabString, pos));
        ObjCross[i] = StringReadString(TabString, pos);

        par1 = StringReadString(TabString, pos);
        par2 = StringReadString(TabString, pos);
        par3 = StringReadString(TabString, pos);
        par4 = StringReadString(TabString, pos);
        par5 = StringReadString(TabString, pos);
        ObjDisplayType[i] = StrToInteger(StringReadString(TabString, pos));
        ObjDisplay[i] = StrToInteger(StringReadString(TabString, pos));
        ObjLevelType[i] = StrToInteger(StringReadString(TabString, pos));
        for (int k = 0; k < 4; k++)
            ObjValue[i][k] = StrToInteger(StringReadString(TabString, pos));
        for (int l = 0; l < 5; l++)
            for (k = 0; k < NBR_PERIODS; k++) {
                string str = StringReadString(TabString, pos);
                if (str == "--")
                    ObjLevel[i][l][k] = EMPTY_VALUE;
                else
                    ObjLevel[i][l][k] = StrToDouble(str);
            }
        if (ObjType[i] == SYSTEM_TYPE) {
            SysObjName[nbr_sysobj] = ObjName[i];
            nbr_sysobj++;
        }

        if (ObjType[i] == MA_TYPE || ObjType[i] == ICHIMOKU_TYPE || ObjType[i] == STOCHASTIC_TYPE || ObjType[i] == MACD_TYPE) {
            ObjPeriod[i] = StrToInteger(par1);
            ObjMethod[i] = StrToInteger(par2);
            ObjApply[i] = StrToInteger(par3);
            ObjShift[i] = StrToInteger(par4);
            ObjMode[i] = StrToInteger(par5);
        } else
        if (ObjType[i] == ADX_TYPE || ObjType[i] == CCI_TYPE || ObjType[i] == RSI_TYPE) {
            ObjPeriod[i] = StrToInteger(par1);
            ObjApply[i] = StrToInteger(par3);
        } else
        if (ObjType[i] == WPR_TYPE || ObjType[i] == ATR_TYPE) {
            ObjPeriod[i] = StrToInteger(par1);
        } else
        if (ObjType[i] == SAR_TYPE) {
            ObjStep[i] = StrToDouble(par1);
            ObjMaximum[i] = StrToDouble(par2);
        } else
        if (ObjType[i] == BOLLINGER_TYPE) {
            ObjPeriod[i] = StrToInteger(par1);
            ObjDeviations[i] = StrToInteger(par2);
            ObjApply[i] = StrToInteger(par3);
            ObjShift[i] = StrToInteger(par4);
            ObjMode[i] = StrToInteger(par5);
            ObjMethod[i] = 0;
        } else
        if (ObjType[i] == CUSTOM_TYPE || ObjType[i] == PREDEFINED_TYPE || ObjType[i] == SYSTEM_TYPE) {
            ObjProgName[i] = par1;
        }

        i++;
    }

    O_NbrObject = i;
    O_NbrSysObject = nbr_sysobj;
    Print ("NBR OBJECTS = " + O_NbrObject); 
    return (i);
}


int LoadEngines(string to_split) {
    E_NbrEngine = 0;
    int Engine = 0;


    string sep=",";                
    ushort u_sep;                  
    string TabString[];               

    u_sep = StringGetCharacter(sep,0);
    int nbr = StringSplit(to_split, u_sep, TabString);


    int pos = NBR_ATTRIBUTES - 5;


    while (pos < nbr) {
        EngineName[Engine] = StringReadString(TabString, pos);
        // Print (EngineName[Engine]);
        Set_Engine_Value(Engine, B_OPERATION, Operation2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_STARTRULE, Rule2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYRULE, Rule2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLRULE, Rule2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_EXITBUYRULE, Rule2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_EXITSELLRULE, Rule2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_EXITRULE, Rule2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_ILOT, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_MAXLOT, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_MAXCOUNT, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_DIRECTION, Direction2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_DIRECTIONTYPE, DirectionType2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_RECOVERYMODE, Mode2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_RECOVERYVALUE, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_PIPSTEP, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_TIMESTEP, StrToInteger(StringReadString(TabString, pos)));

        Set_Engine_Value(Engine, B_ORDERTYPE, OrderType2Int(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_KEEPBUYSELL, StringToBoolean(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_ONEORDERPERBAR, StringToBoolean(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_EXITMODE, ExitMode2Int(StringReadString(TabString, pos)));

        Set_Engine_Value(Engine, B_MAXTIME, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_HEDGEMAGNITUDE, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_MINPROFIT, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYMINPROFIT, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLMINPROFIT, StrToDouble(StringReadString(TabString, pos)));

        Set_Engine_Value(Engine, B_TP, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_TS, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SL, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYTP, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYTS, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYSL, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLTP, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLTS, StrToDouble(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLSL, StrToDouble(StringReadString(TabString, pos)));

        Set_Engine_Value(Engine, B_BUYLOTTP, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYLOTTS, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_BUYLOTSL, StrToInteger(StringReadString(TabString, pos)));

        Set_Engine_Value(Engine, B_SELLLOTTP, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLLOTTS, StrToInteger(StringReadString(TabString, pos)));
        Set_Engine_Value(Engine, B_SELLLOTSL, StrToInteger(StringReadString(TabString, pos)));

        Engine++;
    }


    E_NbrEngine = Engine;
    Print ("NBR ENGINES = " + E_NbrEngine);     
    return (Engine);
}




int LoadSchedules(string to_split) {

    string sep=",";                
    ushort u_sep;                  
    string TabString[];               

    u_sep = StringGetCharacter(sep,0);
    int nbr = StringSplit(to_split, u_sep, TabString);
    
    
    //skip  first lines
    int i = 0;
    int pos = 15;

      
    while (pos < nbr) {
        int Rule = Rule2Int(StringReadString(TabString, pos));
        int Operation = Operation2Int(StringReadString(TabString, pos));
        string SSymbol = StringReadString(TabString, pos);

        if (SSymbol != _Symbol && SSymbol != "") {
            i = 3;
            while (i < 14) {
                StringReadString(TabString, pos);
                i++;
            }
        } else {
            int k = NextEntrySchedule(Rule, Operation);
            if (k == -1) {
                i = 3;
                while (i < 14) {
                    StringReadString(TabString, pos);
                    i++;
                }
                continue;
            }


            S_StartM[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));

            S_StartW[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));
            S_StartD[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));

            string stime = StringReadString(TabString, pos);
            if (stime == "-1")
                S_StartT[Rule][Operation][k] = StrToInteger(stime);
            else
                S_StartT[Rule][Operation][k] = StrToTime( stime);
            
            S_EndM[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));
            S_EndW[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));
            S_EndD[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));

            string etime = StringReadString(TabString, pos);
            if (etime == "-1")
                S_EndT[Rule][Operation][k] = StrToInteger(etime);
            else
                S_EndT[Rule][Operation][k] = StrToTime(etime);            

            S_FrequencyD[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));
            S_OnSameBar[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));

            S_BetweenT[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));
            S_TimeZone[Rule][Operation][k] = StrToInteger(StringReadString(TabString, pos));
            if (S_TimeZone[Rule][Operation][k] == 1) {
                S_StartT[Rule][Operation][k] = S_StartT[Rule][Operation][k] - GMTShift;
                S_EndT[Rule][Operation][k] = S_EndT[Rule][Operation][k] - GMTShift;
            }
        }
    }

    return (1);
}



int ReloadIndicators() {
    for (int i = 0; i < O_NbrObject; i++)
        if (ObjType[i] == CUSTOM_TYPE)
            DownloadIndicator(ObjProgName[i]);
}

int LoadIndicators() {

    DownloadIndicator("PG_Engine");
    DownloadIndicator("PG_Panel");
    DownloadIndicator("PG_System");
    DownloadIndicator("PG_THV_Trix");
    DownloadIndicator("PG_TMA_ExtremeSpike");
    for (int i = 0; i < O_NbrObject; i++)
        if (ObjType[i] == CUSTOM_TYPE)
            DownloadIndicator(ObjProgName[i]);
}

int LoadNews() {
    int i = 0;
    double incr = 0.0005;
    string font;

    if (TestMode)
        return;


    DownloadFile("PG_News.csv", "PG_News" + SYS_SYMBOL);

    int file = FileOpen("PG_News" + SYS_SYMBOL, FILE_READ | FILE_CSV, ',');

    if (file == -1 || FileSize(file) == 0) {
        PG_Print(TYPE_ERROR, "COULD NOT OPEN NEWS FILE", NO_SEND);
        return (-1);
    }

    NewsNbrToday = 0;


    datetime date = 0;
    int offset = 0;
    int j = 0;

    while (!FileIsEnding(file)) {
        string stDate = FileReadString(file);
        string stTime = FileReadString(file);
        string stCurrency = FileReadString(file);
        string stDescription = FileReadString(file);
        string stImportance = FileReadString(file);
        string stActual = FileReadString(file);
        string stForecast = FileReadString(file);
        string stPrevious = FileReadString(file);

        datetime GMTDate = ToDate(stDate, stTime);

        datetime Date = GMTDate - GMTShift; // local


        if (Day() == TimeDay(Date)) {
            DateNewsToday[NewsNbrToday] = Date;
            DescNewsToday[NewsNbrToday] = stDescription;
            CurrNewsToday[NewsNbrToday] = stCurrency;
            ImportanceNewsToday[NewsNbrToday] = stImportance;
            ActualNewsToday[NewsNbrToday] = stActual;
            ForecastNewsToday[NewsNbrToday] = stForecast;
            PreviousNewsToday[NewsNbrToday] = stPrevious;

            NewsNbrToday++;

        }
        i++;
    }

    NewsMax = i;

    FileClose(file);
    return (0);
}






int LoadFilters() {
    string filterfile = "PG_Filters_" + SYS_SYMBOL;

    int file = FileOpen(filterfile, FILE_READ | FILE_CSV, ',');
    if (file == -1) {
        return (-1);
    }

    if (FileSize(file) == 0) {
        FileClose(file);
        return (0);
    }
    while (!FileIsEnding(file)) {
        string sobject = FileReadString(file);
        int ObjectId = Object2Id(sobject);
        SetSignalFilter(1, ObjectId, -1, -1, 0);
    }
    FileClose(file);
    return (1);
}

int LoadMM() {

    string moneyfile = "PG_Money_" + SYS_SYMBOL;
    DownloadFile("PG_Money.csv", moneyfile);

    int file = FileOpen(moneyfile, FILE_READ | FILE_CSV, ',');
    if (file == -1) {
        return (-1);
    }
    if (FileSize(file) == 0) {
        FileClose(file);
        return (1);
    }

    MMDailyTargetAmount = 0;
    MMDailyTargetReached = false;

    MMWeeklyTargetAmount = 0;
    MMWeeklyTargetReached = false;    

    string Currency = FileReadString(file);

    MMDailyTargetAmount = StrToDouble(FileReadString(file));
    MMDailyStopLoss = StrToDouble(FileReadString(file));
    MMWeeklyTargetAmount = StrToDouble(FileReadString(file));
    MMWeeklyStopLoss = StrToDouble(FileReadString(file));

    MMDailyPercentTargetAmount = StrToDouble(FileReadString(file));
    MMDailyPercentStopLoss = StrToDouble(FileReadString(file));
    MMWeeklyPercentTargetAmount = StrToDouble(FileReadString(file));
    MMWeeklyPercentStopLoss = StrToDouble(FileReadString(file));

    FileClose(file);
    return (1);
}


void SetSystemObjects (int x)
{

}

void PG_Comment() {
    string legend = "";
    int engine;

//    if (CSocket != -1) legend = legend + "CONNECTED ";
//    else legend = legend + "NOT CONNECTED ";
    legend = legend + "Account Name = " + AccountName() + " Account Number = " + AccountNumber() + " Spread : " + DoubleToString(SYS_SPREAD, _Digits) + " Slippage : " + DoubleToString(SYS_SLIPPAGE, 0) + " Account Balance = " + DoubleToString(AccountBalance(), 2) + " NbrLots Treated = " + DoubleToString(AccountNbrLots, 2) + " ";
    legend = legend + "Account Free Margin = " + DoubleToString(AccountFreeMargin(), 2) + " Min Free Margin = " + DoubleToString(AccountMinFreeMargin, 2) + "  Account Profit = " + DoubleToString(AccountProfit(), 2) + " ";
    legend = legend + "Comission = " + DoubleToString(ReturnClosedComission(), 2) + " " + "Swap = " + DoubleToString(ReturnClosedSwap(), 2) + "\n";
      legend = legend + "Start Date = " + TimeToString(StartDate) + " Current Date = " + TimeToString(CurrentTime) + ReturnElapsedTime(CurrentTime - StartDate) + "  ";
    legend = legend + "Total _Point (min, max) = (" + DoubleToString(B_MinPoint, 4) + ", " + DoubleToString(B_MaxPoint, 4) + ")\n";
    legend = legend + "Daily Target Amount : ";
    legend = legend + (MMDailyTargetAmount == 0 ? "Not Set" : MMDailyTargetAmount) + " Total : " + DoubleToString(MMDailyClosedProfit, 2) + ", " + _Symbol + " : " + DoubleToString(MMDailySymbolClosedProfit, 2) + "  ";
    legend = legend + "Weekly Target Amount : ";
    legend = legend + (MMWeeklyTargetAmount == 0 ? "Not Set" : MMWeeklyTargetAmount) + " Total : " + DoubleToString(MMWeeklyClosedProfit, 2) + ", " + _Symbol + " : " + DoubleToString(MMWeeklySymbolClosedProfit, 2) + "\n";

    if (MMDailyTargetReached)
        legend = legend + "Daily Target Amount is reached\n";
    if (MMDailySymbolTargetReached)
        legend = legend + "Symbol Daily Target Amount is reached\n";
    if (MMWeeklyTargetReached)
        legend = legend + "Weekly Target Amount is reached\n";
    if (MMWeeklySymbolTargetReached)
        legend = legend + "Symbol Weekly Target Amount is reached\n";

    for (int i = 0; i < B_MaxSessions; i++) {

        if (B_FreeSession[i] == true) continue;

        engine = GetEngine(B_StartOnRule[i], B_Operation[i]);

        legend = legend + (engine == -1 ? "Manual" : EngineName[engine]) + "  SD: " + TimeToString(B_StartDate[i]) + " (min, max)=(" + DoubleToString(B_Min[i], 4) + ", " + DoubleToString(B_Max[i], 4) + ")";
        legend = legend + " ";

        if (B_Operation[i] == OP_BUY) legend = legend + "BUY ,";
        else
        if (B_Operation[i] == OP_SELL) legend = legend + "SELL ,";
        else legend = legend + "BUYSELL , ";

        legend = legend + "R: " + RuleName[B_StartOnRule[i]] + " , ";
        legend = legend + "D: " + DirectionName[B_Direction[i]] + ", ";
        legend = legend + "DT: " + DirectionTypeName[B_DirectionType[i]] + ", ";
        legend = legend + "T:   " +  OrderTypeName[B_OrderType[i]] + ", ";
        legend = legend + "M: " + RecoveryModeName[B_RecoveryMode[i]] + ", ";
        legend = legend + "V: " + DoubleToString(B_RecoveryValue[i], 1) + ", ";
        legend = legend + "IL: " + DoubleToString(B_ILot[i], 2) + ", ";
        legend = legend + "MC: " + B_MaxCount[i] + ", ";
        legend = legend + "PS: " + B_PipStep[i] + ", ";
        legend = legend + "TS: " + B_TimeStep[i] + ", ";
        legend = legend + "EB: " + B_ExitBuy[i] + ", ";
        legend = legend + "ES: " + B_ExitSell[i] + ", ";
        legend = legend + "LBL: " + DoubleToString(B_LastBuyLot[i], 2) + ", ";
        legend = legend + "LSL: " + DoubleToString(B_LastSellLot[i], 2) + ", ";
        legend = legend + "BLTP: " + DoubleToString(B_BuyLotTP[i], 2) + ", ";
        legend = legend + "BLTS: " + DoubleToString(B_BuyLotTS[i], 2) + ", ";
        legend = legend + "BLSL: " + DoubleToString(B_BuyLotSL[i], 2) + ", ";
        legend = legend + "SLTP: " + DoubleToString(B_SellLotTP[i], 2) + ", ";
        legend = legend + "SLTS: " + DoubleToString(B_SellLotTS[i], 2) + ", ";
        legend = legend + "SLSL: " + DoubleToString(B_SellLotSL[i], 2);
        legend = legend + "TP: " + DoubleToString(B_TakeProfit[i], 2) + ", ";
        legend = legend + "TS: " + DoubleToString(B_TrailingStop[i], 2) + ", ";
        legend = legend + "SL: " + DoubleToString(B_StopLoss[i], 2) + ", ";
        legend = legend + "BTP: " + DoubleToString(B_BuyTakeProfit[i], 2) + ", ";
        legend = legend + "BTS: " + DoubleToString(B_BuyTrailingStop[i], 2) + ", ";
        legend = legend + "BSL: " + DoubleToString(B_BuyStopLoss[i], 2) + ", ";
        legend = legend + "STP: " + DoubleToString(B_SellTakeProfit[i], 2) + ", ";
        legend = legend + "STS: " + DoubleToString(B_SellTrailingStop[i], 2) + ", ";
        legend = legend + "SSL: " + DoubleToString(B_SellStopLoss[i], 2) + ", ";


        legend = legend + "\n";

        legend = legend + "(Min Profit, Buy Min Profit, Sell Min Profit) = (" + DoubleToString(B_MinProfit[i],2) + ", " + DoubleToString(B_BuyMinProfit[i],2) + ", " + DoubleToString(B_SellMinProfit[i], 2) + ")  ";

        legend = legend + "\n";

        legend = legend + "BUY Profit/Loss = (" + B_PipStep[i] + ", " + B_BuyNbrTrade[i] + ", " + DoubleToString(B_BuyProfit[i], 2) + "   " + DoubleToString(B_BuyNbrLots[i], 2) + ")  ";
        legend = legend + "SELL Profit/Loss = (" + B_PipStep[i] + ", " + B_SellNbrTrade[i] + ", " + DoubleToString(B_SellProfit[i], 2) + "   " + DoubleToString(B_SellNbrLots[i], 2) + ")  ";
        legend = legend + "Total Profit/Loss = " + DoubleToString(B_SessionProfit[i], 2) + "         ";

        legend = legend + "\n";
        if (B_Suspend[i]) legend = legend + "Suspended ";
        if (!B_BuySellAutomatic[i]) legend = legend + "Manual Buy/Sell ";
        if (B_KeepBuySell[i]) legend = legend + "KeepBuySell ";
        if (B_Hedged[i]) legend = legend + "Hedged + Profit/Loss = (" + DoubleToString(B_BuyHedgeNbrLots[i], 2) + " " + DoubleToString(B_BuyHedgeProfit[i], 2) + "," + DoubleToString(B_SellHedgeNbrLots[i], 2) + " " + DoubleToString(B_SellHedgeProfit[i], 2) + ") " + DoubleToString(B_HedgeProfit[i], 2) + "\n";
        if (B_Suspend[i] || !B_BuySellAutomatic[i] || B_KeepBuySell[i] || B_Hedged[i]) legend = legend + "\n";
    }

    legend = legend + "\n\n";

    double profit;

    for (int j = 0; j < NBR_RULES; j++) {
        profit = ReturnClosedProfit(-1, j);

        int bengine = GetEngine(j, OP_BUY);
        int sengine = GetEngine(j, OP_BUY);
        int bsengine = GetEngine(j, OP_BUYSELL);

        if (bengine == -1 && sengine == -1 && bsengine == -1) continue;

        string enginename;
        if (bengine != -1) enginename = EngineName[bengine];
        else
        if (sengine != -1) enginename = EngineName[sengine];
        else enginename = EngineName[bsengine];

        legend = legend + enginename + " =   " + DoubleToString(profit, 2);

        if (bengine != -1) legend = legend + " Buy  (" + DoubleToString(S_NbrRuleStart[j][OP_BUY], 0) + "," + DoubleToString(S_NbrRuleStartD[j][OP_BUY], 0) + ")";
        if (sengine != -1) legend = legend + " Sell  (" + DoubleToString(S_NbrRuleStart[j][OP_SELL], 0) + "," + DoubleToString(S_NbrRuleStartD[j][OP_SELL], 0) + ")";
        if (bsengine != -1) legend = legend + " BuySell  (" + DoubleToString(S_NbrRuleStart[j][OP_BUYSELL], 0) + "," + DoubleToString(S_NbrRuleStartD[j][OP_BUYSELL], 0) + ")";
        legend += "\n";
    }

    Comment(legend);
}


