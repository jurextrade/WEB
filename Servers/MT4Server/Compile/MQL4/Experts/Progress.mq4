//+---------------------------------------------------------------------------------------------------------------+
//|                                                 Progress.mq4     |
//|                      Copyright © 2014, MetaQuotes Software Corp. |
//|                                        http://www.metaquotes.net |
//+---------------------------------------------------------------------------------------------------------------+
#property copyright   "Copyright 2025,JurexTrade Author: Gabriel Jureidini"
#property link        "http://www.jurextrade.com"
#property version     "700.000"                                                      // Version
#property description "Running Expert Advisors created in Strategy Creator" // Description (line 1)
#property description "Interactive Monitoring of Strategies"         // Description (line 2)
#property icon        "\\Images\\Progress.ico";   

  
                                 // A file with the product icon
#include <PG_TCPFunctions.mqh>
#include <WinUser32.mqh>
#include <PG_WinUser32Ext.mqh>                                   
#include <Progress.mqh>

 

//+------------------------------------------------------------------+ CONNECTION

extern string UserName          = "";
extern string UserPassword      = "";
extern string NodeServer        = "127.0.0.1"; 
extern string HTTPServerName    = "jurextrade.com";   
extern string FTPServerName     = "jurextrade.com";     //"ftp.mt4-progress.com";   //ssh.mt4-progress.com
extern bool   FTPMODE           = false;

bool          C_COMPILE         = true;

string        FTPUserName       = "uk4ibca5";           //"mt4-progress.com";   //Your username for a ftp session
string        FTPPassword       = "]!42fksf14)]";       //Your password for a ftp session //jurex456 sftp
int           FTPPort           = 21;                   //22



bool   TestModeGraphic          = true;
bool   TestModeToSend           = true;


int    NodePort                 = 2007;                 // Listening Port for Node Server Only me
string CServer                  = "127.0.0.1";          // Command Server and Port
int    RPort                    = 2008;                 // Listening Port for Real Platform on MT4 Software
int    SPort                    = 2009;                 // Listening Port for Simulated Platform on MT4 Software
bool   LaunchOnStart            = false;       



//+------------------------------------------------------------------+ CONNECTION
        

int             AngleShift               = 2;
int             TimeBetweenSession       = 0;
bool            CloseNowBuy              = false;
bool            CloseNowSell             = false;
bool            CloseNowAll              = false;
bool            SuspendAll               = false;
bool            ResumeAll                = false;
bool            EndSessions              = false;    // don'tey  start sessions anymore after finish

int           E_NbrEngine       = 0;
int           O_NbrObject       = 0;
int           O_NbrSysObject    = 0;
int           O_NbrVObject      = 0;
int           A_NbrAlert        = 0;


int           CurrentPeriod     = 0;
datetime      CurrentTime       = 0;

int           ShouldExit        = 0;
int           FirstPass         = -1;
int           SecondPass        = 0;

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



int           NewsKeepTime       = 30;      //30 minutes
int           NewsAlertTime      = 360;    // 6 hours


string        UserPath           = "";
string        DataFolder         = "";
string        MembersPath        = "/members/";
bool          DistantTrace       = false;




//======================================
datetime      TimeOpenBar[NBR_PERIODS];


//======================================
//minutes

bool          AlertOnStartRule   = false;
bool          ShellTrace         = true;
bool          FileTrace          = false;

//+------------------------------------------------------------------+ GENERAL

bool          TestMode           = false;
bool          GraphicMainPanel   = false;
bool          GlobalComment      = false;
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


int           CPort;             
int           LPort               = -1;             



int           CSocket              = -1;    //connection with MT4 Software
int           NodeSocket           = -1;    //connection with Node

bool          SendSignals          = true;

int           SymbolRunning;

static double Old_Price          = -1;
static color  FontColor;

//============================================MARKET DATE==========================================

double        TIME_SydneyOpen   = 22;
double        TIME_SydneyClose  = 7;

double        TIME_TokyoOpen    = 0;
double        TIME_TokyoClose   = 9;

double        TIME_LondonOpen   = 8;
double        TIME_LondonClose  = 17;

double        TIME_NYOpen       = 13;
double        TIME_NYClose      = 22;


#define       PANEL_ID            0 
#define       PANEL_FEED         -1 
#define       PANEL_SEPARATOR    -2
#define       PANEL_PERIODS      -3
#define       PANEL_END          -4


								             								
int           SignalVisible[NBR_SIGNALS];
         								
string        PeriodName[]       = {"M1","M5","M15","M30","H1","H4","D1","W1","MN"};
int           PeriodIndex[]           = {PERIOD_M1,PERIOD_M5,PERIOD_M15,PERIOD_M30,PERIOD_H1,PERIOD_H4,PERIOD_D1,PERIOD_W1,PERIOD_MN1};

string        DirectionName[]      = {"BACKWARD", "FORWARD", "ANY"};
string        DirectionTypeName[]  = {"MINMAX", "LEVEL"};
string        ExitModeName[]       = {"EXITBUYFIRST", "EXITSELLFIRST", "EXITANY"};
string        OrderTypeName[]      = {"MONO", "HEDGE"};

//================================================= SYSTEMS ==========================================

int           SymbolCode_NOSIGNAL      = 110;  

int           SymbolCode_ALERT         = 108;
int           SymbolCode_TOUCHED       = 110;
int           SymbolCode_ABOVE         = 110;               
int           SymbolCode_BELOW         = 110;               
             
int           SymbolCode_SIDEWAY       = 240;     
int           SymbolCode_OVERSOLD      = 172;    
int           SymbolCode_OVERBOUGHT    = 172;    
int           SymbolCode_EXT_OVERSOLD  = 172;    
int           SymbolCode_EXT_OVERBOUGHT = 172;  
int           SymbolCode_RANGE         = 110;    

int           SymbolCode_BEAR          = 110;    
int           SymbolCode_BULL          = 110;    
int           SymbolCode_VERYWEAK      = 110;      // market
int           SymbolCode_WEAK          = 110; 
int           SymbolCode_NEUTRAL       = 110; 
int           SymbolCode_STRONG        = 110; 
int           SymbolCode_VERYSTRONG    = 110; 
int           SymbolCode_MIDDLE        = 110; 
int           SymbolCode_BUY           = 110;    
int           SymbolCode_SELL          = 110;    
int           SymbolCode_BUYSELL       = 110;      // market

int           SymbolCode_REVERSE_UP    = 200;  
int           SymbolCode_REVERSE_DOWN  = 201;
int           SymbolCode_CROSS_UP      = 241;    
int           SymbolCode_CROSS_DOWN    = 242;    
color         SymbolCode_RCROSSED      = 253; 
         
int           SymbolCode_UP            = 110; //246;               
int           SymbolCode_DOWN          = 110; //248;               

color         SignalColor_ABOVE        = Green;      
color         SignalColor_BULL         = Green; 
color         SignalColor_UP           = Green;      
color         SignalColor_BELOW        = FireBrick;      
color         SignalColor_BEAR         = FireBrick; 
color         SignalColor_DOWN         = FireBrick;  

color         SignalColor_BUY          = Lime;      
color         SignalColor_SELL         = Red;  
color         SignalColor_BUYSELL      = Orange;  
color         SignalColor_EXIT_BUY     = Gold;      
color         SignalColor_EXIT_SELL    = Gold;  
color         SignalColor_NOSIGNAL     = DarkGray;
color         SignalColor_DTOUCHED     = Yellow;   
color         SignalColor_UTOUCHED     = Yellow;   
color         SignalColor_MIDDLE       = Gainsboro;  
color         SignalColor_ALERT        = Red;      
color         SignalColor_CROSS_UP     = Black; 
color         SignalColor_CROSS_DOWN   = Black; 
color         SignalColor_REVERSE_UP   = Black; 
color         SignalColor_REVERSE_DOWN = Black; 
color         SignalColor_SIDEWAY      = Gold; 
color         SignalColor_RCROSSED     = Turquoise; 

color         SignalColor_VERYSTRONG  = C'5,150,150' ;
color         SignalColor_STRONG      = C'5,246,246' ;      
color         SignalColor_NEUTRAL     = C'10,239,239' ;
color         SignalColor_WEAK        = C'126,250,250';    
color         SignalColor_VERYWEAK    = C'204,253,253';

color         SignalColor_OVERBOUGHT      = Lime;            
color         SignalColor_OVERSOLD        = DeepPink; 
color         SignalColor_EXT_OVERBOUGHT  = LawnGreen;            
color         SignalColor_EXT_OVERSOLD    = Red; 

color         SignalColor_MAX             = LawnGreen;            
color         SignalColor_MIN             = Red; 

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
int           AlertId[NBR_ALERTS];
int           AlertObject[NBR_ALERTS];
int           AlertSignal[NBR_ALERTS];
int           AlertPeriod[NBR_ALERTS];
int           AlertSound[NBR_ALERTS];
int           AlertMail[NBR_ALERTS];
int           AlertDialog[NBR_ALERTS];
int           AlertGraphic[NBR_ALERTS];

int           AlertType[NBR_ALERTS];  
int           AlertLogic[NBR_ALERTS];  
int           AlertNot[NBR_ALERTS];    
int           AlertPrev[NBR_ALERTS];    
int           AlertOp[NBR_ALERTS];   
double        AlertValue[NBR_ALERTS]; 


int			  AlertGraphicCode[NBR_ALERTS];
double		  AlertGraphicColor[NBR_ALERTS];
int			  AlertGraphicFrom[NBR_ALERTS];
int			  AlertGraphicSize[NBR_ALERTS];
int			  AlertGraphicDistance[NBR_ALERTS];
string		  AlertSoundText[NBR_ALERTS];
string        AlertAlertText[NBR_ALERTS];
string        AlertMailFromName[NBR_ALERTS];
string        AlertMailFromAdress[NBR_ALERTS];
string        AlertMailToAdress[NBR_ALERTS];
string        AlertMailCcAdress[NBR_ALERTS];
string        AlertMailSubject[NBR_ALERTS];
string	      AlertMailContent[NBR_ALERTS];   

datetime      AlertTime[NBR_ALERTS];
datetime      AlertMinTime[NBR_ALERTS];
int           AlertLast[NBR_ALERTS];



//=============================================PANEL==========================================

#define		  NBR_POBJECTS			    13



#define       P_UPFRACTAL				0
#define		  P_DOWNFRACTAL				1
#define       P_UPFRACTAL_TARGET		2
#define		  P_DOWNFRACTAL_TARGET		3
#define		  P_RESISTANCE				4
#define		  P_SUPPORT					5
#define		  P_PIVOT					6
#define		  P_FIBO					7
#define		  P_PATTERN					8
#define		  P_PROGRESS				9
#define		  P_ORIENTATION				10
#define		  P_SHARP_ANGLE				11
#define		  P_TMA_EXTREME				12

int			  Panel_Graphic[NBR_POBJECTS];


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


//// END ENGINES RELATED

string PropertyName[] = {"CloseNowAll",	"CloseNowBuy",	"CloseNowSell", "SuspendNowAll",	"B_EndSessions", "TRIX_Engine", "B_ILot", "B_IPipStep", "B_IMaxSession",	
                         "B_IMaxCount", "B_IModeRecovery", "B_ICountToDouble", "B_ISmartGain", "B_IProportionalGain",      
	                      "B_SessionProfit", "B_SessionLoss", "GraphicMode", "GraphicMainPanel", "GraphicCS", "GraphicFractals", "GraphicSR", "GraphicPivot", "FileTrace", "DistantTrace", "ShellTrace", 
                         "Port", "Server"};

int           RS_Buy             = 0;
int           RS_Sell            = 0;

//=============================================INDICATORS==========================================

bool          AllowTrading       = false;



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
// Fibo Pivots 
double        Pivots[11];
double        Fractals[14];

double        PivotPoint[NBR_PERIODS];
int           LastPivotDay= 0;
double        PivotThreshold = 10; 

// HL Pivots

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

// END PIVOT

#define       VER                "MT4-PROGRESS"                                          
#define       EA                 " Gabriel Jureidini"


string        IndicatorFont            = "Arial";
int           IndicatorFontSize        = 7;
color         IndicatorTextColor       = White; 
color         IndicatorBackColor       = Blue;
color         IndicatorSymbolCode      = 110; 
color         MainPanelSeperatorColor  = White;
color         MainPanelBckColor        =  C'15,15,15';
           
int           PanelFontSize      = 7;
int           PanelSFontSize     = 6;
string        PanelFont          = "Arial";
string        PanelBFont         = "Arial Black";

color         PanelTextColor     = Gray;
int           Panel_originX      = 10;
int           Panel_originY      = 10;
int           Panel_offsetX      = 10;
int           Panel_offsetY      = 10;
int           Panel_scaleX       = 10;
int           Panel_scaleY       = 10;

int           PanelOriginParameters = 1400;
int           PanelOriginTargets    = 600;
int           PanelWidthTargets     = 120;
int           PanelOriginAngles     = 990;    
int           PanelOriginNews       = 10;

int           System_originX      = 10;
int           System_originY      = 10;
int           System_offsetX      = 10;
int           System_offsetY      = 10;

int           Engine_offsetX = 0;
int           Engine_offsetY = 0;

int           Engine_originX = 10;
int           Engine_originY = 10;


int           AssistantFontSize  = 8;
string        AssistantFont      = "Arial";
color         AssistantTextColor = Gray;
int           Assistant_originX  = 0;
int           Assistant_originY  = 5;
int           Assistant_offsetX  = 0;
int           Assistant_offsetY  = 10;
int           Assistant_scaleX   = 440;
int           Assistant_scaleY   = 10;


string        fontname           = "Arial Black";
int           fontsize           = 8;      

int           MiniOrientationFontSize = 8;   
int           MiniObjectFontSize = 12;              

int           OrientationFontSize = 12;
int           ObjectFontSize     = 20,
              corner             = 2,
              right_up_corner    = 1,
              corner2            = 3;

int           originY            = 70;
int           originX            = 0;
int           scaleX             = 20,
              scaleY             = 20,
              offsetX            = 35,
              offsetY            = 25;

int           PG_originY         = 0;
int           PG_originX         = 0;                           
int           PG_scaleX          = 20,
              PG_scaleY          = 20,
              PG_offsetX         = 35,
              PG_offsetY         = 25; 
              

int           Width[]            = {1, 1, 1, 1, 1, 1, 1, 2, 2};
int           Style[]            = {STYLE_DASH, STYLE_DASH, STYLE_DASH, STYLE_DASH, STYLE_SOLID, STYLE_SOLID, STYLE_SOLID, STYLE_SOLID, STYLE_SOLID};
int           HStyle[]           = {STYLE_DOT, STYLE_DOT, STYLE_DOT, STYLE_DOT, STYLE_SOLID, STYLE_SOLID, STYLE_SOLID, STYLE_SOLID, STYLE_SOLID};
color         ResistanceColor    = Turquoise;
color         SupportColor       = OrangeRed;         




int           Panel_Window       = 0;
int           Panel_Corner       = 2;



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

color         NeutralColor     = LightGray;
color         BullColor        = MediumSeaGreen;
color         ExtremeBullColor = Lime;
color         BearColor        = Red;
color         ExtremeBearColor = Red;

bool          Display_Bearish_Engulfing = true;
bool          Display_Hanging_Man_Hammer = true;
bool          Display_Three_Outside_Down = true;
bool          Display_Three_Inside_Down = true;
bool          Display_Dark_Cloud_Cover = true;
bool          Display_Evening_Doji_Star = true;
bool          Display_Three_Black_Crows = true;
bool          Display_Bullish_Engulfing = true;
bool          Display_I_Hammer_S_Star = true;
bool          Display_Three_Outside_Up = true;
bool          Display_Three_Inside_Up = true;
bool          Display_Piercing_Line = true;
bool          Display_Three_White_Soldiers = true;
bool          Display_Doji = true;
bool          Display_Abandon_Baby = true;
bool          Display_Stars = true;
bool          Display_Harami = false;
bool          Display_ShootStar_2 = true;
bool          Display_ShootStar_3 = true;
bool          Display_ShootStar_4 = true;
bool          Display_Hammer_2 = true;
bool          Display_Hammer_3 = true;
bool          Display_Hammer_4 = true;
bool          Display_Bear_Quad = true;
bool          Display_Bull_Quad = true;



//=============================================BROKERSS==========================================

string        ExtremeObject    = "PG_TMA_ExtremeSpike";
string        TrixObject       = "PG_THV_Trix";



#define NBR_BROKERS     20

string BrokerName[NBR_BROKERS]; 
int    BrokerPort[NBR_BROKERS]; 

#define NBR_SYMBOLS     20

string CurrencyName[NBR_SYMBOLS]; 
string CurrencyPName[NBR_SYMBOLS]; 
int    CurrencyPort[NBR_SYMBOLS]; 


double _Ask;   
double _Bid;

const int INVALID_USER         = -1;
const int CONNECTION_FAILED    = -5;
const int CONNECTION_SUCCEED   = 1;

bool INIT_DONE          = false;
bool NO_TIMER           = false;
datetime AttemptToReconnect     = 0;



void TimerFunction () {
    if (NodeSocket == -1 && (NO_TIMER == false || (TimeCurrent() - AttemptToReconnect) > 60))
    {
        PG_Print(TYPE_ERROR, "Connection closed with MT4 Server Reconnecting with timer", NO_SEND);
    
       int result = ConnectNodeServer();
   
       if (result ==  CONNECTION_FAILED) {
           PG_Print(TYPE_ERROR, "Server is not running or incorrect server parameters MT4 Server ", NO_SEND);
           PG_Print(TYPE_INFO, "__________________________________________________ERROR IDENTIFICATION SERVER WILL CONNECT EVERY SECOND ________________________________________________________________________");
           return;         
       }       
       if (!NO_TIMER) {
         EventKillTimer(); 
         }
    
       if (!INIT_DONE) {              // it is not a reconnection
          end_init();
       }
    }
}

void OnTimer () {
    TimerFunction ();
}


int OnInit() {

    PG_Print(TYPE_INFO, "________________________________________________________________________  PROGRESS START INITIALISATION  ________________________________________________________________________");

    PG_Print(TYPE_INFO, "________________________________________________________________________           Running in " + ((C_COMPILE == true) ? " C MODE " : " MQ4 MODE ") + "          ________________________________________________________________________");
/*
    for (int i = 0; i < NBR_PERIODS; i++) {
    	while(!IsStopped()) {
            ResetLastError();
            int n = iBars(_Symbol, PeriodIndex[i]);
            bool error = is_error();
            if(!error && n > 0)
            break;
        }
    }
 */   
    bool eventresult = EventSetTimer(1); 
    
    if (!eventresult) {
      Print("Failed to set timer, error: ",GetLastError());
      NO_TIMER = true;
    }
    
    
    ShouldExit = 0;
    FirstPass = -1;
    SecondPass = 0;

    DataFolder = ExtractDataFolder(TerminalInfoString(TERMINAL_DATA_PATH));

    SymbolRunning = FileOpen("Lock" + _Symbol, FILE_WRITE | FILE_BIN);
    if (SymbolRunning == -1) {
        Print("Expert is running already on symbol " + SYS_SYMBOL);
        ExpertRemove ();        
        return (INIT_FAILED);
    }

    if (MQLInfoInteger(MQL_TESTER) == 1)
        TestMode = true;

    CurrentTime = TimeCurrent();
    GMTShift = GetShiftGMT();
    StartDate = ReturnStartDate();
    
     Print("Expert is running on chart period " + _Period);
    
    CurrentPeriod = Period2Int(_Period);
     Print("Expert is running on CurrentPeriod " + CurrentPeriod);
    InitMarketInfo();

    str2struct(TerminalBuffer, ArraySize(TerminalBuffer) << 18, TerminalPath());
    str2struct(SymbolBuffer, ArraySize(SymbolBuffer) << 18, SYS_SYMBOL);
    ResetAll(1);

    InitIndicators(SYS_POINT);


    if (TCP_init() < 0) {
        ShouldExit = 1;
        ExpertRemove ();
        PG_Print(TYPE_ERROR, "Client: WSAStartup() failed with error ", NO_SEND);
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR TCP START INIT END INITIALISATION  ________________________________________________________________________");
        return (INIT_FAILED);
    }
    
    int result = ConnectNodeServer();

    if (result ==  CONNECTION_FAILED) {
       
        AttemptToReconnect = true;   
        PG_Print(TYPE_ERROR, "Server is not running or incorrect server parameters MT4 Server ", NO_SEND);
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR IDENTIFICATION SERVER  ________________________________________________________________________");
        return 0;
    }    
       
    if (result ==  INVALID_USER) {
        ShouldExit = 1;
        ExpertRemove ();
        PG_Print(TYPE_ERROR, "Invalid User/Password ", NO_SEND);
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR IDENTIFICATION FAILED  ________________________________________________________________________");
        return (INIT_FAILED);
    }   



    return  end_init();
}

int end_init() {
   int result;
   
   if (C_COMPILE) {
      PG_Print(TYPE_INFO, "______________________________________________________________  PROGRESS  WAITING FOR DOWNLOADING EXT_FUNCIONS DLL IN START INITIALISATION     ________________________________________________________");
      Send_Operation("PROGRESS  WAITING FOR DOWNLOADING EXTENSION ON CURRENCY " + _Symbol);
     
      result = Load_WinExtension_DLL("PG_ExtFunctions.dll");
      if (result < 0) {
        ShouldExit = 1;
        ExpertRemove ();
        PG_Print(TYPE_ERROR, "Loading PG_ExtFunctions Failed", NO_SEND);
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR IDENTIFICATION FAILED  ________________________________________________________________________");
        return (INIT_FAILED);
      }

      PG_Print(TYPE_INFO, "______________________________________________________________  PROGRESS  WAITING FOR DOWNLOADING ENTRY RULES DLL IN START INITIALISATION    ________________________________________________________");
      Send_Operation("PROGRESS WAITING FOR DOWNLOADING ENTRY RULES ON CURRENCY " + _Symbol);
      result == LoadEntryRulesDLL();
      if (result < 0) {
        ShouldExit = 1;
        ExpertRemove ();
        PG_Print(TYPE_ERROR, "Loading Entry Rules Faied", NO_SEND);
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR IDENTIFICATION FAILED  ________________________________________________________________________");
        return (INIT_FAILED);
      }
     
    }   
    if (LoadProject() < 0) {
        PG_Print(TYPE_INFO, "________________________________________________________________________ ERROR LOAD PROJECT  ________________________________________________________________________");
        ShouldExit = 1;
        ExpertRemove ();
        return (INIT_FAILED);
    }
    
    ReadFlagEngines(); // properties Automatic or manual     
    ReadSessions(); // init sessions && load
    InitEngines();
   
    
  
    if (!TestMode || TestModeGraphic) {
   
        InitGraphics();
    }
   
    PG_Print(TYPE_INFO, "________________________________________________________________________ PROGRESS END INITIALISATION  ________________________________________________________________________");

    PG_Print(TYPE_INFO, "________________________________________________________________________ PROGRESS START PROCESSING  ________________________________________________________________________");
    Send_Operation("PROGRESS START PROCESSING OK ON CURRENCY " + _Symbol);
    
    FirstPass = 1;
  
    
    INIT_DONE = true;
    
    return (0);
}

void start() {


    if (NO_TIMER && AttemptToReconnect == 0) {    // this is for tester we don't have a timer
        TimerFunction();
        return 0;
    }
     
    int i = 0;
    GMTShift = GetShiftGMT();

    _Bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    _Ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);

    if (SymbolRunning == -1) {
        Print("Expert is running already on symbol " + SYS_SYMBOL);
        return (-1);
    }

    if (TestMode)
        Send_Symbol(_Symbol, CurrentPeriod);
    else
        Send_Symbol(_Symbol, P_M1);

    AccountMinFreeMargin = MathMin(AccountFreeMargin(), AccountMinFreeMargin);

    CurrentTime = TimeCurrent();

    if (_Bid > Old_Price) FontColor = LawnGreen;
    if (_Bid < Old_Price) FontColor = Red;

    Old_Price = _Bid;

    ResetSignals();
    ResetRules(1);

    AlertNews();

    if (!TestMode || TestModeToSend) {

        if (CSocket != -1)
            PG_Recv(CSocket);

        if (NodeSocket != -1)
            PG_Recv(NodeSocket);
        
        if (NodeSocket == -1) {
            if (NO_TIMER ) {
               AttemptToReconnect = 0;               
            } else {
              EventSetTimer(1);
            }
        }
    }

    IfShouldClose();

    for (i = (NBR_PERIODS - 1); i >= P_M1; i--)
        MarketMovement(i, FirstPass);

    // once a day
    if (TimeOpenBar[P_D1] != iTime(NULL, PeriodIndex[P_D1], 0)) {
        LoadNews();
        MMDailySymbolTargetReached = false;
        MMDailyTargetReached = false;
    }
    if (TimeOpenBar[P_W1] != iTime(NULL, PeriodIndex[P_W1], 0)) {
        MMWeeklySymbolTargetReached = false;
        MMWeeklyTargetReached = false;
    }

    //////////////////////////////////////////////////////////// MT4 Passage de parametres //////////////////////////////////////////////////////////////      

    if (C_COMPILE) {

        MT4_SetSystemObjects(_Ask, _Bid, TimeCurrent(), CurrentPeriod, SymbolBuffer, SYS_POINT, SYS_DIGITS,
            SignalTab, SignalTabValue, SignalTabTime, SignalTabPrice,
            BeforeSignalTab, BeforeSignalTabValue, BeforeSignalTabTime, BeforeSignalTabPrice,
            BeforeSignalTickTab, RuleTab, RuleTabValue, BeforeRuleTab, BeforeRuleTabValue);
            
    } else {
        for (i = (NBR_PERIODS - 1); i >= P_M1; i--)
            SetSystemObjects(i);
    }

    //////////////////////////////////////////////////////////// MT4 Passage de parametres //////////////////////////////////////////////////////////////      

    if (!TestMode || TestModeGraphic) {

        MainPanel_DrawGraphics();
        Panel_DrawGraphics();
        DrawGraphics();
    }

 
    AccountNbrLots = ReturnAccountNbrLots();


    TreatMM();

    if (SecondPass) TreatAlerts();
    TreatSignals();
    TreatInRules(); // engine to rule

    if (SecondPass) {
        TreatSystemRules(); // rules
    }

    TreatOutRules(); // rules to engine  
    TreatEngines();

    Send_EngineFlags();
    Send_RuleFlags();
    Send_MM();

    
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

int OnDeinit() {

    printf("PROGRESS END PROCESSING BYE BYE  **********************************************************************");
    PG_Print(TYPE_INFO, "________________________________________________________________________ PROGRESS END PROCESSING  ________________________________________________________________________");
    Send_Operation("PROGRESS END PROCESSING ON CURRENCY " + _Symbol);

    ObjectsDeleteAll();

    if (CSocket > 0)
        closesocket(CSocket);

    if (NodeSocket > 0)
        closesocket(NodeSocket);

    NodeSocket = -1;
    CSocket = -1;

    Panel_Window = 0;

    if (SymbolRunning != -1)
        FileClose(SymbolRunning);

    return (0);
}

//============================================= TCP MAIN ========================================

void PG_Recv(int& socket) {
    string receive_buffer;

    if (TCP_recv(socket, receive_buffer) > 0) {
        TreatRecv(socket, receive_buffer);
	}
}

void PG_Send(int& socket, string s) {
    if (socket == -1) return;
    TCP_send(socket, s, 0);
}

void PG_SendBuffer(int & socket, char buffer[], int buffersize) {
    TCP_sendBuffer(socket, buffer, buffersize, 0);
}

int ConnectNodeServer() {
    if (NodeSocket == -1) {

        NodeSocket = TCP_connect(NodeServer, NodePort);
        if (NodeSocket < 0) {
            PG_Print(TYPE_ERROR, "NO SYNCHRONISATION WITH NODE CENTER ON PORT : " + NodePort, NO_SEND);
            AttemptToReconnect = 0;
            return CONNECTION_FAILED;
        } else {
            PG_Print(TYPE_ERROR, "SUCCEEDED SYNCHRONISATION WITH NODE CENTER ON PORT : " + NodePort, NO_SEND);
            TCP_SetBlockingMode(NodeSocket, 1);
            Send_Login(NodeSocket, NodePort);

            string receive_buffer;
            int ret = TCP_recv(NodeSocket, receive_buffer);
            if (ret <= 0) {
                PG_Print(TYPE_ERROR, "IDENTIFICATION FAILED  : Please Register on site", NO_SEND);
                closesocket(NodeSocket);
                NodeSocket = -1;
                return INVALID_USER;
            }
            if (FTPMODE) {
                UserPath = MembersPath + receive_buffer + "/Terminal/" + DataFolder;
            }
            else {
                UserPath = MembersPath + receive_buffer + "/Terminal/" + DataFolder;
            }
            
//            HTTPUploadHistoryFile(_Symbol, 0);
//            Reload_EntryRules_DLL ("PG_EntryRules.dll");
            TCP_SetBlockingMode(NodeSocket, 0);
            Send_Init(NodeSocket, NodePort);
        }
    }
    AttemptToReconnect = TimeCurrent();        
    return CONNECTION_SUCCEED;
}


//=============================================RESET ALL ========================================

void ResetAll(int first = -1) {
    ResetSignals(first);
    ResetRules(first);
    ResetSignalFilters();
    ResetEngines(first);
    ResetSchedules();
}




void ResetEngines(int first = -1) {
    for (int i = 0; i < NBR_ENGINES; i++) {
        EngineTab[i][0] = 0;
        EngineTab[i][1] = 0;

        for (int k = 0; k < NBR_ATTRIBUTES; k++) //SHIFT!!! 31
        {
            Set_Engine(i, k, P_SIGNAL);

            if (k == B_STARTAUTOMATIC) {
                Set_Engine(i, k, P_NOSIGNAL);
            }
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
bool StringToBoolean(string Value) {
    if (Value == "true" || Value == "TRUE") return (true);
    else return (false);
}

string BooleanToString(bool Value) {
    if (Value == true) return ("true");
    else return ("false");
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
    if (NoConnection()) return;
    string s;
    s = "*OPERATION";
    s = s + "^";
    s = s + reply;
    s = s + "*";
    PG_Send(NodeSocket, s);
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
    if (DistantTrace && CSocket != -1) {
        if (nowarning == -1)
            PG_Send(CSocket, "*MESSAGE " + "Time = [" + TimeToString(CurrentTime) + "] " + DoubleToString(Type, 0) + " = [" + s + "] *");
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
int Load_WinExtension_DLL(string filename) {
     string LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Libraries\\" + filename;

     int HMOD = GetModuleHandleW(LocalFile);
     // Handle to DLL
     if (HMOD != 0) {

         Print("Library " +  filename + " ALREADY Loaded");
         return 1;
     }
     
     Print("NEED EXTENSION LIBRARY ********************************************");

     int returnvalue = DownloadLibrary(filename);

     if (returnvalue < 0) {
         Print("CAN NOT GET DLL " + filename);

         return -1;
     } else
         Print("GET DLL SUCCEED " + filename);
     

     int ret = MessageBoxW (0, "Running Progress For the first time ,  You need to restart your terminal", "PROGRESS INITIALISATION", MB_YESNO|MB_ICONQUESTION|MB_TOPMOST); 
     if (ret == IDYES) {                   
         string terminalpath = TerminalPath() + "\\terminal.exe";

         PostMessageA (GetParent(GetParent(GetParent(WindowHandle(Symbol(), Period())))), WM_CLOSE, 0, 0);
         int r = WinExec (terminalpath , 0);
         return 1;
     } else {  
         ExpertRemove ();
         return 1;
     }
     int hDLL = LoadLibraryW(LocalFile);

     if (!hDLL) {
         Print("CAN NOT LOAD DLL " + filename);

         return -1;
     } else {
         Print("LOAD DLL  SUCCEED " + filename);
     }
    return 1;
}

int LoadEntryRulesDLL() {

  
   string dllfile = "";
   
   if (!TestMode)
      dllfile = "PG_EntryRules.dll";
   else
      dllfile = "PG_TEntryRules.dll";
   
   if (Reload_EntryRules_DLL(dllfile) < 0) {
      return (-1);
   }
   return 1;
}

int Load_EntryRules_DLL1(string filename) {
    
    printf("MT4_LoadDLL before***************************************************************, %s", filename);
  
    int HMOD = GetModuleHandleW(filename);
    // Handle to DLL
    if (HMOD == 0) {
          HMOD = LoadLibraryW(filename);
          if (HMOD != 0) {
			    Print("CAN NOT LOAD LIBRARY " + filename);              
			    return -2;
			 } else {
             int returnvalue = MT4_GetProcAddress(HMOD, TestMode);
             printf("MT4_LoadDLL after***************************************************************, %d", returnvalue);
           }
    } else {
          printf("Library STILLLLLLL Loaded  **********************************************************************, %s", filename);
    }
    return returnvalue;
}

int Load_EntryRules_DLL(string filename) {
    
    Print("START loading EntryRules_DLL " +  filename);
  //  int hDLL = LoadLibraryW(LocalFile);
    int hModule = MT4_LoadDLL(filename, TestMode);
    printf("MT4_LoadDLL after***************************************************************, %d", hModule);

    return hModule;
}

int Reload_EntryRules_DLL(string filename) {
    string LocalFile = "";
    string tofilename = "";
    int returnvalue;
    
   
    if (!TestMode)
        tofilename = "PG_EntryRules_" + SYS_SYMBOL + ".dll";
    else
        tofilename = "PG_TEntryRules_" + SYS_SYMBOL + ".dll";
    
    
    LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Libraries\\" + tofilename;
        
        
    int HMOD = GetModuleHandleW(LocalFile);
    // Handle to DLL
    if (HMOD != 0) {
    
        Print("Library ALREADY Loaded : Action Free Library " +  LocalFile);
    
        returnvalue = FreeLibrary(HMOD);
    
        if (returnvalue) {
            Print("Library Free OK " + LocalFile);
    
        } else {
            Print("Library Free ERROR " + LocalFile);;
            return -1;
        }
    }

     returnvalue = DownloadLibrary(filename, tofilename);
 
     if (returnvalue < 0) {
         Print("GET DLL ERROR " +  filename);
         return 1;
     } else
         Print("GET DLL OK " + filename);

    return Load_EntryRules_DLL(LocalFile);

}

int ReloadProject(string s) {

    int length = StringLen(s); //"abc" = 3;
    int i = 0;
    string platform = "";

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        platform = platform + CharToString(StringGetCharacter(s, i));
        i++;
    }

    PG_Print(TYPE_INFO, "Reload Project " + platform, NO_SEND);


    string dllfile = "";

    if ((platform == "Tester" && !TestMode) ||
        (platform == "Terminal" && TestMode))
        return;

    if (TestMode)
        dllfile = "PG_TEntryRules.dll";
    else
        dllfile = "PG_EntryRules.dll";

    ExitAll(OP_BUYSELL, 0, 1);


    if (Reload_EntryRules_DLL(dllfile) < 0)
        return -1;


    DeleteGraphics();

    ReloadObjects();
    ReloadEngines(); // loadengines
    ReloadIndicators();
    LoadPanel();
    InitGraphics();

    LoadAlerts();
    LoadSchedules();
    LoadFilters();
    LoadMM();

	return 1;
}

string ExtractDataFolder (string stringfile) {
    int pos = 0;
    int last_pos = -1;

    while(pos>=0)    {
        pos = StringFind(stringfile,"\\",pos+1);
        if(pos>=0)
            last_pos = pos;
        else
            break;
    }  
    if (last_pos >= 0) {
        return StringSubstr(stringfile,last_pos + 1, 0);
    }
    return "";
}

bool is_error(){
    if(GetLastError() != ERR_NO_ERROR){
        Sleep(10);
        return true;
    }
    return false;
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



//////////////////////////////////////////////////////////////// INDICATORS /////////////////////////////////////////////////////////////////


void MarketResistance(int start_period, int period1, int exit_period) {
    bool Bull = false;
    bool Bear = false;

    RS_Buy = 0;
    RS_Sell = 0;

    if ((AndS(RESISTANCE, S_ABOVE, start_period) != 0 &&
            AndS(RESISTANCE, S_ABOVE, period1) != 0 &&
            AndS(RESISTANCE, S_ABOVE, exit_period) != 0) ||
        (AndS(RESISTANCE, S_ABOVE, start_period) != 0 &&
            AndS(RESISTANCE, S_ABOVE, exit_period) != 0)) {
        Bull = true;
    }
    if ((AndS(SUPPORT, S_BELOW, start_period) != 0 &&
            AndS(SUPPORT, S_BELOW, period1) != 0 &&
            AndS(SUPPORT, S_BELOW, exit_period) != 0) ||
        (AndS(SUPPORT, S_BELOW, start_period) != 0 &&
            AndS(SUPPORT, S_BELOW, exit_period) != 0))

    {
        Bear = true;
    }

    if (Bull == true && Bear == true) {
        return;
    }

    if (Bull == true)
        RS_Buy = 1;
    else
        RS_Buy = 0;

    if (Bear == true)
        RS_Sell = 1;
    else
        RS_Sell = 0;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////SOUND

int TreatSoundFlag(int sound) {
    if ((sound & (1 << NEWSSOUND)) != 0)
        NewsSound = 1;
    else
        NewsSound = 0;

    if ((sound & (1 << ALERTSOUND)) != 0)
        AlertsSound = 1;
    else
        AlertsSound = 0;

    if ((sound & (1 << OPERATIONSOUND)) != 0)
        OperationSound = 1;
    else
        OperationSound = 0;

    if ((sound & (1 << SYSTEMSOUND)) != 0)
        SystemSound = 1;
    else
        SystemSound = 0;

    return (sound);
}

int GetSoundValue() {
    int sound = 0;

    if (NewsSound == true)
        sound |= (1 << NEWSSOUND);

    if (AlertsSound == true)
        sound |= (1 << ALERTSOUND);

    if (OperationSound == true)
        sound |= (1 << OPERATIONSOUND);

    if (SystemSound == true)
        sound |= (1 << SYSTEMSOUND);

    return (sound);
}

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

int LoadBrokers() {
    InitBrokers();
    DownloadFile("PG_Brokers.csv");
    int file = FileOpen("PG_Brokers.csv", FILE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_ERROR, "COULD NOT OPEN PG_Brokers.csv ", NO_SEND);
        return (-1);
    }
    if (FileSize(file) == 0)
        return (0);

    int terminal = 0;
    int i = 0;

    while (!FileIsEnding(file)) {
        BrokerName[terminal] = FileReadString(file);
        BrokerPort[terminal] = StrToInteger(FileReadString(file));
        terminal++;
    }
    FileClose(file);
    return (terminal);
}

int AddBroker(string terminalname) {
    int file = FileOpen("PG_Brokers.csv", FILE_WRITE | FILE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_ERROR, "COULD NOT OPEN PG_Brokers.csv ", NO_SEND);
        return (-1);
    }
    FileSeek(file, 0, SEEK_END);

    int i = 0;
    int port = CPort;

    while (BrokerPort[i] != -1) {
        port = MathMax(BrokerPort[i], port);
        i++;
    }
    //add 1 to maximum port
    if (i > 0)
        port++;
    BrokerName[i] = terminalname;
    BrokerPort[i] = port;

    FileWrite(file, BrokerName[i], BrokerPort[i]);
    FileClose(file);
    return (port);
}

int AddSymbol(string symbolname, string symbolpname) {
    int i = 0;
    int port;

    port = CPort + NBR_SYMBOLS + 1;

    if (CPort == RPort) //2008   //29
        port = CPort + NBR_SYMBOLS + 1;
    else
        port = SPort + 1; //2010

    while (CurrencyPort[i] != -1) {
        port = MathMax(CurrencyPort[i], port);
        i++;
    }
    //add 1 to maximum port
    if (i > 0)
        port++;

    CurrencyName[i] = symbolname;
    CurrencyPName[i] = symbolpname;
    CurrencyPort[i] = port;

    int file = FileOpen("PG_Symbols.csv", FILE_WRITE | FILE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_ERROR, "COULD NOT OPEN PG_Symbols.csv ", NO_SEND);
        return (-1);
    }

    FileSeek(file, 0, SEEK_END);

    FileWrite(file, symbolname, symbolpname, port, SYS_MINLOT, SYS_MAXLOT, SYS_LOTSTEP, SYS_SPREAD, SYS_STOPLEVEL, _Point, SYS_DIGITS, SYS_LOTSIZE);
    FileClose(file);
    return (i);
}

int GetPortFromTerminalName(string name) {
    for (int i = 0; i < ArraySize(BrokerName); i++)
        if (name == BrokerName[i])
            return (BrokerPort[i]);
    return (-1);
}

int GetIndexFromSymbolName(string name) {
    for (int i = 0; i < ArraySize(CurrencyName); i++)
        if (name == CurrencyName[i])
            return (i);
    return (-1);

}



bool NewDay() {
    if (TimeHour(TimeCurrent()) == 0 &&
        TimeMinute(TimeCurrent()) < 10)
        return (true);
    return (false);
}

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

void ResetGraphics() {

    if (GraphicMainPanel == true)
        MainPanel_InitGraphics(right_up_corner);
    else
        MainPanel_DeleteGraphics();

    if (GlobalComment == false)
        Comment("");

    if (MarketOpening)
        MarketOpening_InitGraphics();
    else
        MarketOpening_DeleteGraphics();

    for (int k = 0; k < NBR_PERIODS; k++) {
        Pivots_DeleteGraphics(k);
        Fibo_DeleteGraphics(k);
        Fractals_DeleteGraphics(k, 1);
        Fractals_DeleteGraphics(k, 0);
        SR_DeleteGraphics(k, 1);
        SR_DeleteGraphics(k, 0);
        FractalsTarget_DeleteGraphics(k, 1);
        FractalsTarget_DeleteGraphics(k, 0);
        Patterns_DeleteGraphics(k);

        if (Panel_Graphic[P_PIVOT] & (1 << k))
            Pivots_InitGraphics(k);
        if (Panel_Graphic[P_FIBO] & (1 << k))
            Fibo_InitGraphics(k);
        if (Panel_Graphic[P_UPFRACTAL] & (1 << k))
            Fractals_InitGraphics(k, 1);
        if (Panel_Graphic[P_DOWNFRACTAL] & (1 << k))
            Fractals_InitGraphics(k, 0);
        if (Panel_Graphic[P_SUPPORT] & (1 << k))
            SR_InitGraphics(k, 0);
        if (Panel_Graphic[P_RESISTANCE] & (1 << k))
            SR_InitGraphics(k, 1);
        if (Panel_Graphic[P_UPFRACTAL_TARGET] & (1 << k))
            FractalsTarget_InitGraphics(k, 1);
        if (Panel_Graphic[P_DOWNFRACTAL_TARGET] & (1 << k))
            FractalsTarget_InitGraphics(k, 0);
        if (Panel_Graphic[P_PATTERN] & (1 << k))
            Patterns_InitGraphics(k);
    }
}

void DrawGraphics() {
    if (MarketOpening)
        MarketOpening_DrawGraphics();
    for (int k = 0; k < NBR_PERIODS; k++) {
        if (Panel_Graphic[P_PIVOT] & (1 << k))
            Pivots_DrawGraphics(k);
        if (Panel_Graphic[P_FIBO] & (1 << k))
            Fibo_DrawGraphics(k);
        if (Panel_Graphic[P_UPFRACTAL] & (1 << k))
            Fractals_DrawGraphics(k, 1);
        if (Panel_Graphic[P_DOWNFRACTAL] & (1 << k))
            Fractals_DrawGraphics(k, 0);
        if (Panel_Graphic[P_SUPPORT] & (1 << k))
            SR_DrawGraphics(k, 0);
        if (Panel_Graphic[P_RESISTANCE] & (1 << k))
            SR_DrawGraphics(k, 1);
        if (Panel_Graphic[P_UPFRACTAL_TARGET] & (1 << k))
            FractalsTarget_DrawGraphics(k, 1);
        if (Panel_Graphic[P_DOWNFRACTAL_TARGET] & (1 << k))
            FractalsTarget_DrawGraphics(k, 0);
        if (Panel_Graphic[P_PATTERN] & (1 << k))
            Patterns_DrawGraphics(k);
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

int B_LoadSession(int magicNumber, int session) {
    string LastComment = "";
    double LastLot = 0;
    double LastBuyLot = 0;
    double LastSellLot = 0;
    double FirstLot = -1;
    datetime LastOrderOpened = 0;
    datetime FirstOrderOpened = 11111111111;
    bool StillActive = false;
    double HedgeLine = -1;
    int HedgeType = -1;
    int BuySellType = -1;
    int LastOrderType = -1;

    B_FreeSession[session] = true;
    B_InitSession[session] = false;

    B_SellNbrTrade[session] = 0;
    B_BuyNbrTrade[session] = 0;

    int xtotal = OrdersTotal();
    if (xtotal == 0) return (-1);

    for (int cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() != magicNumber + session &&
            OrderMagicNumber() != magicNumber + session + HedgeMagicNumber)
            continue;
        if (OrderSymbol() != _Symbol) continue;

        StillActive = true;

        if (OrderOpenTime() > LastOrderOpened)
            LastComment = OrderComment();

        if (OrderType() <= OP_SELL && OrderSymbol() == _Symbol) {
            if (OrderMagicNumber() == magicNumber + session) {
                BuySellType = 1;

                if (OrderType() == OP_BUY) B_BuyNbrTrade[session]++;
                else B_SellNbrTrade[session]++;

                if (OrderOpenTime() < FirstOrderOpened) {
                    FirstLot = OrderLots();
                    FirstOrderOpened = OrderOpenTime();
                }
                if (OrderOpenTime() > LastOrderOpened) {
                    LastLot = OrderLots();
                    if (OrderType() == OP_BUY) LastBuyLot = LastLot;
                    else LastSellLot = LastLot;

                    LastOrderOpened = OrderOpenTime();
                    LastOrderType = OrderType();
                }
            } else {
                HedgeType = OrderType();
                HedgeLine = OrderOpenPrice();
                // A CORRIGER LastOrderOpened mais pas hedge 
                if (OrderOpenTime() > LastOrderOpened) {
                    LastOrderOpened = OrderOpenTime();
                }
            }
        }
    }

    if (!StillActive)
        return (-1);

    B_init(session);

    if (BuySellType != -1 || HedgeType != -1) {
        B_LastLot[session] = LastLot;
        B_LastBuyLot[session] = LastBuyLot;
        B_LastSellLot[session] = LastSellLot;
        B_HedgeLine[session] = HedgeLine;
        B_HedgeType[session] = HedgeType;
        B_LastOrderOpenTime[session] = LastOrderOpened;
        B_LastOrderType[session] = LastOrderType;

        if (FirstLot != -1)
            B_ILot[session] = FirstLot;
    }
    string saveinfo = LastComment;
    B_ReadInfo(session, saveinfo);

    int handle = FileOpen("PG_Sessions_" + SYS_SYMBOL, FILE_READ | FILE_CSV, "*");

    if (handle != -1 && FileSize(handle) != 0) {
        while (!FileIsEnding(handle)) {
            string s_info = "";
            s_info = FileReadString(handle);
            if (session != StrToInteger(B_ReadSInfo(s_info, 0, 2)))
                continue;
            int size = B_ReadInfo(session, s_info, 1);
            if (size >= StringLen (s_info)) continue;
            B_ReadRemainingInfo(session, s_info, size);
            break;
        }
    }
    if (handle != -1)
        FileClose(handle);

    if (B_StartOnRule[session] != R_MANUAL) {
        int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);
        if (engine == -1) return (session);
    } else {
        if (!B_BuySellAutomatic[session])
            B_InitManualSession(session, true);
        else
            Automatic = true;
        return (session);
    }

    // we should save all informations here instead of taking default values in case of changing manually values 
/*
    B_OneOrderPerBar[session] = EValue (engine, B_ONEORDERPERBAR);
    B_TimeStep[session] = EValue(engine, B_TIMESTEP);
    B_MaxLot[session] = EValue(engine, B_MAXLOT);

    B_TakeProfit[session] = EValue(engine, B_TP);
    B_TrailingStop[session] = EValue(engine, B_TS);
    B_StopLoss[session] = EValue(engine, B_SL);

    B_BuyTakeProfit[session] = EValue(engine, B_BUYTP);
    B_BuyTrailingStop[session] = EValue(engine, B_BUYTS);
    B_BuyStopLoss[session] = EValue(engine, B_BUYSL);

    B_SellTakeProfit[session] = EValue(engine, B_SELLTP);
    B_SellTrailingStop[session] = EValue(engine, B_SELLTS);
    B_SellStopLoss[session] = EValue(engine, B_SELLSL);

    B_MinProfit[session] = EValue(engine, B_MINPROFIT);
    B_BuyMinProfit[session] = EValue(engine, B_BUYMINPROFIT);
    B_SellMinProfit[session] = EValue(engine, B_SELLMINPROFIT);
*/
    B_BuyOnRule[session] = EValue(engine, B_BUYRULE);
    B_SellOnRule[session] = EValue(engine, B_SELLRULE);
    B_ExitOnRule[session] = EValue(engine, B_EXITRULE);
    B_ExitBuyOnRule[session] = EValue(engine, B_EXITBUYRULE);
    B_ExitSellOnRule[session] = EValue(engine, B_EXITSELLRULE);

    SetRuleFilter(1, -1, -1, B_StartOnRule[session]);

    return (session);
}

void ReadSessions() {
    for (int i = 0; i < B_MaxSessions; i++)
        B_LoadSession(B_IMagicNumber, i);
}

void B_SaveSessions() {
    int handle = FileOpen("PG_Sessions_" + SYS_SYMBOL, FILE_WRITE | FILE_BIN);
    if (handle == -1) return;

    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false) {
            string s_sinfo = B_SaveInfo(i, 1);
            string s_rinfo = B_SaveRemainingInfo (i);
            string s_info = s_sinfo + s_rinfo;
            FileWriteString(handle, s_info, StringLen(s_info));
        }
    FileClose(handle);
}

int B_ReadInfo(int session, string saveinfo, int withsessnbr = -1) {
    int from = 0;
    int i = 0;
    int flags = 0;
    if (withsessnbr != -1) i = 2;

    from = from + i;  i = 10; B_StartDate[session] =        StrToDouble(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1;  B_StartOnRule[session] =      Rule2Int(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 1;  B_Operation[session] =        StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1;  B_Direction[session] =        StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 3;  B_PipStep[session] =          StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 2;  B_MaxCount[session] =         StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1;  B_RecoveryMode[session] =     Mode2Int(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 3;  B_RecoveryValue[session] =    StrToDouble(B_ReadSInfo(saveinfo, from, i));
    from = from + i;  i = 1;  B_HedgeMagnitude[session] =   StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1;  B_OrderType[session] =        StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1;  B_KeepBuySell[session] =      StrToInteger(B_ReadSInfo(saveinfo, from, i)); 
    from = from + i;  i = 1;  B_ExitMode[session] =         StrToInteger(B_ReadSInfo(saveinfo, from, i));     // ATTENTION need to watch these two flags .... database is better we check at least if close sell is consistent with nbr trades !
    from = from + i;  i = 1;  B_ExitBuy[session] =          ((StrToInteger(B_ReadSInfo(saveinfo, from, i)) != 0) && B_BuyNbrTrade[session] == 0);
    from = from + i;  i = 1;  B_ExitSell[session] =         ((StrToInteger(B_ReadSInfo(saveinfo, from, i)) != 0) && B_SellNbrTrade[session] == 0);
    from = from + i;  i = 2;  flags =                       StrToInteger(B_ReadSInfo(saveinfo, from, i));
    
    B_BuySellAutomatic[session] = (flags & (1 << B_BUYSELLAUTOMATIC)) != 0;
    B_ExitAutomatic[session] = (flags & (1 << B_EXITAUTOMATIC)) != 0;
    B_HedgeAutomatic[session] = (flags & (1 << B_HEDGEAUTOMATIC)) != 0;
    B_DeHedgeAutomatic[session] = (flags & (1 << B_DEHEDGEAUTOMATIC)) != 0;
    from = from + i;
    return from;
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

int B_HedgeProcessTrade(int session, int operation, double StopLoss = -1) { // operation = OP_BUY OP_SELL only
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

int B_HedgeCloseTrade(int session, int operation = -1) { // operation = OP_BUY, OP_SELL, OP_BUYSELL
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

void B_HedgeSession(int session, int hedge, int operation = OP_BUYSELL) {  // hedge true ==>hedge   false unhedge operation to hedge BUY is sell
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

    B_BuyNbrTrade[session] = 0;
    B_SellNbrTrade[session] = 0;
    
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

            B_BuyHedgeNbrLots[i] = ReturnNbrLots(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
            B_SellHedgeNbrLots[i] = ReturnNbrLots(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
            B_HedgeNbrLots[i] = B_BuyHedgeNbrLots[i] + B_SellHedgeNbrLots[i];
            B_BuyNbrLots[i] = ReturnNbrLots(B_MagicNumber[i], OP_BUY);
            B_SellNbrLots[i] = ReturnNbrLots(B_MagicNumber[i], OP_SELL);
            B_BuyNbrTrade[i] = ReturnTradeNumber(B_MagicNumber[i], OP_BUY);
            B_SellNbrTrade[i] = ReturnTradeNumber(B_MagicNumber[i], OP_SELL);
            B_BuyProfit[i] = ReturnProfit(B_MagicNumber[i], OP_BUY);
            B_SellProfit[i] = ReturnProfit(B_MagicNumber[i], OP_SELL);
            B_BuyHedgeProfit[i] = ReturnProfit(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
            B_SellHedgeProfit[i] = ReturnProfit(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
            B_HedgeProfit[i] = B_BuyHedgeProfit[i] + B_SellHedgeProfit[i];
            B_Profit[i] = B_BuyProfit[i] + B_SellProfit[i] + B_HedgeProfit[i];
            B_SessionProfit[i] = B_ReturnProfit(i); // with history

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

            B_FindInHistory(i);

            B_NeutralPoint[i] = B_Min[i] + (B_Max[i] - B_Min[i]) / 2;

            B_SellAveragePoint[i] = ReturnAverage(B_MagicNumber[i], OP_SELL);
            B_BuyAveragePoint[i] = ReturnAverage(B_MagicNumber[i], OP_BUY);

            B_TotalHedgeBuyProfit += B_BuyHedgeProfit[i];
            B_TotalHedgeSellProfit += B_SellHedgeProfit[i];
            B_TotalBuyProfit += B_BuyProfit[i];
            B_TotalSellProfit += B_SellProfit[i];
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

            if (B_Hedged[i]) {
                if (B_HedgeType[i] == OP_BUY)
                    B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
                else
                if (B_HedgeType[i] == OP_SELL)
                    B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
                else
                    B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber);

            }

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
        B_TotalClosedProfit += ReturnClosedProfit(B_IMagicNumber + i);
        B_TotalProfit = B_TotalBuyProfit + B_TotalSellProfit;
        B_TotalHedgeProfit = B_TotalHedgeBuyProfit + B_TotalHedgeSellProfit;
    }
    B_SaveSessions();
    SaveFlagEngines();
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

double FindNextSupport(int m_period, int type = -1) {
    double Sell_Target;
    double MinTarget = -100;

    if (_Bid >= LastPivotPoint[1][P_D1]) MinTarget = MathMax(LastPivotPoint[1][P_D1], MinTarget);
    if (_Bid >= LastSupport[1][P_D1]) MinTarget = MathMax(LastSupport[1][P_D1], MinTarget);
    if (_Bid >= LastLow[1][P_D1]) MinTarget = MathMax(LastLow[1][P_D1], MinTarget);
    if (_Bid >= LastResistance[1][P_D1]) MinTarget = MathMax(LastResistance[1][P_D1], MinTarget);
    if (_Bid >= LastHigh[1][P_D1]) MinTarget = MathMax(LastHigh[1][P_D1], MinTarget);

    if (type == -1) {
        for (int i = m_period; i < NBR_PERIODS; i++) {
            Sell_Target = iLow(NULL, PeriodIndex[i], NextDownFractals[i]);
            if (_Bid >= Sell_Target)
                Sell_Target = MathMax(Sell_Target, MinTarget);
            MinTarget = Sell_Target;
        }
    }
    return (Sell_Target);
}

datetime ReturnBestTime(int from_period, int c_period, int mode, int index) {
    int bar = 0;
    datetime time;
    double fractal;
    double high_low;

    if (mode == MODE_UPPER) {
        high_low = iHigh(NULL, PeriodIndex[c_period], Last2UpFractals[index][c_period]);
        time = iTime(NULL, PeriodIndex[c_period], Last2UpFractals[index][c_period]);
    } else {
        high_low = iLow(NULL, PeriodIndex[c_period], Last2DownFractals[index][c_period]);
        time = iTime(NULL, PeriodIndex[c_period], Last2DownFractals[index][c_period]);
    }
    return (time);
    if (from_period == c_period) return (time);
    bar = iBarShift(NULL, PeriodIndex[from_period], time, true);
    if (bar == -1) return (time);
    fractal = iFractals(NULL, PeriodIndex[from_period], mode, bar);
    while ((fractal == 0) || (fractal != high_low)) {
        bar--;
        fractal = iFractals(NULL, PeriodIndex[from_period], mode, bar);
        if (bar <= 0) break;
    }

    return (iTime(NULL, PeriodIndex[from_period], bar));
}

//---------------------------------------------------------------------MARKET OPENING--------------------------------------------
int MarketOpening_InitGraphics() {

    color c;

    ObjectCreate("Sydney", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("Sydney1", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("Tokyo", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("Tokyo1", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("London", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("London1", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("NY", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectCreate("NY1", OBJ_RECTANGLE, 0, 0, 0, 0, 0);
    ObjectSet("Sydney", OBJPROP_BACK, true);
    ObjectSet("Sydney1", OBJPROP_BACK, true);
    ObjectSet("Tokyo", OBJPROP_BACK, true);
    ObjectSet("London", OBJPROP_BACK, true);
    ObjectSet("Tokyo1", OBJPROP_BACK, true);
    ObjectSet("London1", OBJPROP_BACK, true);

    ObjectSet("NY", OBJPROP_BACK, true);
    ObjectSet("NY1", OBJPROP_BACK, true);

    c = Green;
    ObjectSet("Sydney", OBJPROP_COLOR, c);
    ObjectSet("Sydney1", OBJPROP_COLOR, c);
    ObjectCreate("SydneyOpen", OBJ_VLINE, 0, 0, 0);
    ObjectSet("SydneyOpen", OBJPROP_COLOR, c);
    ObjectSet("SydneyOpen", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("SydneyOpen", OBJPROP_BACK, true);
    ObjectSetText("SydneyOpen", "Sydney Open " + IntegerToString(TIME_SydneyOpen) + "h GMT", 8);
    ObjectSetInteger(0, "SydneyOpen", OBJPROP_SELECTABLE, false);

    ObjectCreate("SydneyClose", OBJ_VLINE, 0, 0, 0);
    ObjectSet("SydneyClose", OBJPROP_COLOR, c);
    ObjectSet("SydneyClose", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("SydneyClose", OBJPROP_BACK, true);
    ObjectSetText("SydneyClose", "Sydney Close" + IntegerToString(TIME_SydneyClose) + "h GMT", 8);
    ObjectSetInteger(0, "SydneyClose", OBJPROP_SELECTABLE, false);

    c = Yellow;
    ObjectSet("Tokyo", OBJPROP_COLOR, c);
    ObjectSet("Tokyo1", OBJPROP_COLOR, c);
    ObjectCreate("TokyoOpen", OBJ_VLINE, 0, 0, 0);
    ObjectSet("TokyoOpen", OBJPROP_COLOR, c);
    ObjectSet("TokyoOpen", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("TokyoOpen", OBJPROP_BACK, true);
    ObjectSetText("TokyoOpen", "Tokyo Open " + IntegerToString(TIME_TokyoOpen) + "h GMT", 8);
    ObjectSetInteger(0, "TokyoOpen", OBJPROP_SELECTABLE, false);

    ObjectCreate("TokyoClose", OBJ_VLINE, 0, 0, 0);
    ObjectSet("TokyoClose", OBJPROP_COLOR, c);
    ObjectSet("TokyoClose", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("TokyoClose", OBJPROP_BACK, true);
    ObjectSetText("TokyoClose", "Tokyo Close " + IntegerToString(TIME_TokyoClose) + "h GMT", 8);
    ObjectSetInteger(0, "TokyoClose", OBJPROP_SELECTABLE, false);

    c = Blue;

    ObjectSet("London", OBJPROP_COLOR, c);
    ObjectSet("London1", OBJPROP_COLOR, c);
    ObjectCreate("LondonOpen", OBJ_VLINE, 0, 0, 0);
    ObjectSet("LondonOpen", OBJPROP_COLOR, c);
    ObjectSet("LondonOpen", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("LondonOpen", OBJPROP_BACK, true);
    ObjectSetText("LondonOpen", "London Open " + IntegerToString(TIME_LondonOpen) + "h GMT", 8);
    ObjectSetInteger(0, "LondonOpen", OBJPROP_SELECTABLE, false);

    ObjectCreate("LondonClose", OBJ_VLINE, 0, 0, 0);
    ObjectSet("LondonClose", OBJPROP_COLOR, c);
    ObjectSet("LondonClose", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("LondonClose", OBJPROP_BACK, true);
    ObjectSetText("LondonClose", "London Close " + IntegerToString(TIME_LondonClose) + "h GMT", 8);
    ObjectSetInteger(0, "LondonClose", OBJPROP_SELECTABLE, false);

    c = Red;
    ObjectSet("NY", OBJPROP_COLOR, c);
    ObjectSet("NY1", OBJPROP_COLOR, c);
    ObjectCreate("NYOpen", OBJ_VLINE, 0, 0, 0);
    ObjectSet("NYOpen", OBJPROP_COLOR, c);
    ObjectSet("NYOpen", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("NYOpen", OBJPROP_BACK, true);
    ObjectSetText("NYOpen", "NY Open " + IntegerToString(TIME_NYOpen) + "h GMT", 8);
    ObjectSetInteger(0, "NYOpen", OBJPROP_SELECTABLE, false);

    ObjectCreate("NYClose", OBJ_VLINE, 0, 0, 0);
    ObjectSet("NYClose", OBJPROP_COLOR, c);
    ObjectSet("NYClose", OBJPROP_STYLE, STYLE_SOLID);
    ObjectSet("NYClose", OBJPROP_BACK, true);
    ObjectSetText("NYClose", "NY Close " + IntegerToString(TIME_NYClose) + "h GMT", 8);
    ObjectSetInteger(0, "NYClose", OBJPROP_SELECTABLE, false);
}
bool Draw_Lines = false;
int MarketOpening_DrawGraphics() {

    string today = TimeToString(CurrentTime, TIME_DATE);
    datetime timemidnight = StrToTime(today);
    datetime endday = timemidnight + (24 * 3600);
    if (Draw_Lines) {
        timemidnight -= GMTShift;
        ObjectMove("NYClose", 0, timemidnight + TIME_NYClose * 3600, Close[0]);
        ObjectMove("NYOpen", 0, timemidnight + TIME_NYOpen * 3600, Close[0]);
        ObjectMove("LondonClose", 0, timemidnight + TIME_LondonClose * 3600, Close[0]);
        ObjectMove("LondonOpen", 0, timemidnight + TIME_LondonOpen * 3600, Close[0]);
        ObjectMove("TokyoOpen", 0, timemidnight + TIME_TokyoOpen * 3600, Close[0]);
        ObjectMove("TokyoClose", 0, timemidnight + TIME_TokyoClose * 3600, Close[0]);
        ObjectMove("SydneyClose", 0, timemidnight + TIME_SydneyClose * 3600, Close[0]);
        ObjectMove("SydneyOpen", 0, timemidnight + (TIME_SydneyOpen * 3600), Close[0]);
    }
    double bottom = WindowPriceMin();
    int x, y;

    datetime time;
    double nytop, sydneytop, tokyotop, londontop;
    int window;

    y = ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS, 0);

    datetime NYOpen = timemidnight + TIME_NYOpen * 3600 - GMTShift;
    datetime NYClose = timemidnight + TIME_NYClose * 3600 - GMTShift;

    datetime LondonOpen = timemidnight + TIME_LondonOpen * 3600 - GMTShift;
    datetime LondonClose = timemidnight + TIME_LondonClose * 3600 - GMTShift;

    datetime TokyoOpen = timemidnight + TIME_TokyoOpen * 3600 - GMTShift;
    datetime TokyoClose = timemidnight + TIME_TokyoClose * 3600 - GMTShift;

    datetime SydneyOpen = timemidnight + TIME_SydneyOpen * 3600 - GMTShift;
    datetime SydneyClose = timemidnight + TIME_SydneyClose * 3600 - GMTShift;

    ChartXYToTimePrice(0, 0, y - 10, window, time, nytop);
    ObjectSet("NY1", OBJPROP_TIME1, -1);

    if (NYOpen > timemidnight) {
        if (NYOpen < endday)
            ObjectSet("NY", OBJPROP_TIME1, NYOpen);
        else
            ObjectSet("NY1", OBJPROP_TIME1, timemidnight + NYOpen - endday);
    } else
        ObjectSet("NY1", OBJPROP_TIME1, timemidnight);

    if (NYClose <= endday)
        ObjectSet("NY", OBJPROP_TIME2, NYClose);
    else {
        ObjectSet("NY", OBJPROP_TIME2, endday);
        ObjectSet("NY1", OBJPROP_TIME1, timemidnight);
        ObjectSet("NY1", OBJPROP_TIME2, timemidnight + NYClose - endday);

    }

    ObjectSet("NY", OBJPROP_PRICE1, nytop);
    ObjectSet("NY", OBJPROP_PRICE2, bottom);
    ObjectSet("NY1", OBJPROP_PRICE1, nytop);
    ObjectSet("NY1", OBJPROP_PRICE2, bottom);

    ChartXYToTimePrice(0, 0, y - 20, window, time, londontop);
    ObjectSet("London1", OBJPROP_TIME1, -1);
    if (LondonOpen > timemidnight)
        ObjectSet("London", OBJPROP_TIME1, LondonOpen);
    else
        ObjectSet("London", OBJPROP_TIME1, timemidnight);
    if (LondonClose <= endday)
        ObjectSet("London", OBJPROP_TIME2, LondonClose);
    else {
        ObjectSet("London", OBJPROP_TIME2, endday);
        ObjectSet("London1", OBJPROP_TIME1, timemidnight);
        ObjectSet("London1", OBJPROP_TIME2, timemidnight + LondonClose - endday);

    }
    ObjectSet("London", OBJPROP_PRICE1, londontop);
    ObjectSet("London", OBJPROP_PRICE2, nytop);
    ObjectSet("London1", OBJPROP_PRICE1, londontop);
    ObjectSet("London1", OBJPROP_PRICE2, nytop);

    ChartXYToTimePrice(0, 0, y - 30, window, time, tokyotop);
    ObjectSet("Tokyo1", OBJPROP_TIME1, -1);
    if (TokyoOpen > timemidnight)
        ObjectSet("Tokyo", OBJPROP_TIME1, TokyoOpen);
    else
        ObjectSet("Tokyo", OBJPROP_TIME1, timemidnight);
    if (TokyoClose <= endday)
        ObjectSet("Tokyo", OBJPROP_TIME2, TokyoClose);
    else {
        ObjectSet("Tokyo", OBJPROP_TIME2, endday);
        ObjectSet("Tokyo1", OBJPROP_TIME1, timemidnight);
        ObjectSet("Tokyo1", OBJPROP_TIME2, timemidnight + TokyoClose - endday);

    }
    ObjectSet("Tokyo", OBJPROP_PRICE1, tokyotop);
    ObjectSet("Tokyo", OBJPROP_PRICE2, londontop);
    ObjectSet("Tokyo1", OBJPROP_PRICE1, tokyotop);
    ObjectSet("Tokyo1", OBJPROP_PRICE2, londontop);

    ChartXYToTimePrice(0, 0, y - 40, window, time, sydneytop);
    ObjectSet("Sydney1", OBJPROP_TIME1, -1);
    if (SydneyOpen > timemidnight) {
        if (SydneyOpen < endday)
            ObjectSet("Sydney", OBJPROP_TIME1, SydneyOpen);
        else
            ObjectSet("Sydney1", OBJPROP_TIME1, timemidnight + SydneyOpen - endday);
    } else
        ObjectSet("Sydney", OBJPROP_TIME1, timemidnight);

    if (SydneyClose < endday) {
        if (SydneyClose > timemidnight)
            ObjectSet("Sydney", OBJPROP_TIME1, SydneyClose);
    } else {
        ObjectSet("Sydney1", OBJPROP_TIME1, timemidnight);
        ObjectSet("Sydney1", OBJPROP_TIME2, timemidnight + SydneyClose - endday);

    }
    ObjectSet("Sydney", OBJPROP_PRICE1, sydneytop);
    ObjectSet("Sydney", OBJPROP_PRICE2, tokyotop);
    ObjectSet("Sydney1", OBJPROP_PRICE1, sydneytop);
    ObjectSet("Sydney1", OBJPROP_PRICE2, tokyotop);

}

int MarketOpening_DeleteGraphics() {
    ObjectDelete("NY");
    ObjectDelete("NY1");
    ObjectDelete("London");
    ObjectDelete("London1");
    ObjectDelete("Sydney");
    ObjectDelete("Sydney1");
    ObjectDelete("Tokyo");
    ObjectDelete("Tokyo1");
    ObjectDelete("NYClose");
    ObjectDelete("NYOpen");
    ObjectDelete("LondonClose");
    ObjectDelete("LondonOpen");
    ObjectDelete("TokyoOpen");
    ObjectDelete("TokyoClose");
    ObjectDelete("SydneyClose");
    ObjectDelete("SydneyOpen");
}

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

void AlertText(int j, int k, int offset) {
    int OriginX = 640;
    int OriginY = 15;
    int corner = 0;

    static string lastfont = "Arial";

    if (Panel_Window == 0) return;

    if (lastfont == "Arial") lastfont = "Arial Black";
    else lastfont = "Arial";

    if (ObjectFind("CalendarDate" + k) != Panel_Window) {
        ObjectCreate("CalendarDate" + k, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("CalendarDate" + k, OBJPROP_CORNER, corner);
        ObjectSet("CalendarDate" + k, OBJPROP_XDISTANCE, OriginX);
        ObjectSet("CalendarDate" + k, OBJPROP_YDISTANCE, OriginY - offset);
        ObjectSetText("CalendarDate" + k, TimeToString(DateNewsToday[j] + GMTShift) + " GMT", PanelFontSize, lastfont, ColorNewsToday[j]);
        ObjectSetInteger(0, "CalendarDate" + k, OBJPROP_SELECTABLE, false);

        ObjectDelete("CalendarDesc" + k);
        ObjectCreate("CalendarDesc" + k, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("CalendarDesc" + k, OBJPROP_CORNER, corner);
        ObjectSet("CalendarDesc" + k, OBJPROP_XDISTANCE, OriginX + 100);
        ObjectSet("CalendarDesc" + k, OBJPROP_YDISTANCE, OriginY - offset);
        ObjectSetText("CalendarDesc" + k, DescNewsToday[j], PanelFontSize, lastfont, ColorNewsToday[j]);
        ObjectSetInteger(0, "CalendarDesc" + k, OBJPROP_SELECTABLE, false);

        ObjectCreate("CalendarCurr" + k, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("CalendarCurr" + k, OBJPROP_CORNER, corner);
        ObjectSet("CalendarCurr" + k, OBJPROP_XDISTANCE, OriginX + 300);
        ObjectSet("CalendarCurr" + k, OBJPROP_YDISTANCE, OriginY - offset);
        ObjectSetText("CalendarCurr" + k, CurrNewsToday[j], PanelFontSize, lastfont, ColorNewsToday[j]);
        ObjectSetInteger(0, "CalendarCurr" + k, OBJPROP_SELECTABLE, false);

        ObjectCreate("CalendarImport" + k, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("CalendarImport" + k, OBJPROP_CORNER, corner);
        ObjectSet("CalendarImport" + k, OBJPROP_XDISTANCE, OriginX + 350);
        ObjectSet("CalendarImport" + k, OBJPROP_YDISTANCE, OriginY - offset);
        ObjectSetText("CalendarImport" + k, ImportanceNewsToday[j], PanelFontSize, lastfont, ColorNewsToday[j]);
        ObjectSetInteger(0, "CalendarImport" + k, OBJPROP_SELECTABLE, false);
    } else {
        ObjectDelete("CalendarImport" + k);
        ObjectDelete("CalendarCurr" + k);
        ObjectDelete("CalendarDesc" + k);
        ObjectDelete("CalendarDate" + k);
    }
}

void AlertNextNews() {
    datetime date = 0;

    for (int i = 0; i < NewsNbrToday; i++) {

        if ((CurrentTime <= DateNewsToday[i] && date == 0) || DateNewsToday[i] == date) {
            date = DateNewsToday[i];
            Send_News(TimeToString(DateNewsToday[i]), DescNewsToday[i], CurrNewsToday[i], ImportanceNewsToday[i], ActualNewsToday[i], ForecastNewsToday[i], PreviousNewsToday[i]);
        }
    }
    return;
}

string ReturnActualCalendar() {
    datetime now = TimeCurrent();

    datetime sunday = now - TimeDayOfWeek(TimeCurrent()) * 24 * 60 * 60;

    string ssunday = TimeToString(sunday, TIME_DATE);
    string file = "Calendar-" + StringSubstr(ssunday, 5, 2) + "-" + StringSubstr(ssunday, 8, 2) + "-" + StringSubstr(ssunday, 0, 4) + ".csv";
    return (file);
}

void TreatRecvProperty(string s) {
    int i = 0;
    string Value;
    string Variable;
    int length = StringLen(s); //"abc" = 3;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        Value = "";
        Variable = "";
        while (StringGetCharacter(s, i) != 32) {
            Variable = Variable + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["
        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            Value = Value + CharToString(StringGetCharacter(s, i));
            i++;
        }

        PG_Print(TYPE_INFO, " Variable = " + Variable + " Value = " + Value);
        SetProperty(Variable, Value);
        i++;
        i++; // skip "] "
        //InitGraphics ();
    }
    // Send_CProperties ();
    AllowTrading = true;
    return;
}

void SetSignal(string s) {
    int i = 0;
    string Value = "";
    string Variable = "";
    int length = StringLen(s); //"abc" = 3;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            Variable = Variable + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["
        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            Value = Value + CharToString(StringGetCharacter(s, i));
            i++;
        }

        PG_Print(TYPE_INFO, " Value = " + Value + " Variable = " + Variable + "i is " + i + " Length is " + length);
        if (Value == "1") SendSignals = true;
        else SendSignals = false;
        i++;
        i++; // skip "] "
        //InitGraphics ();
    }
    if (length != i) i++;
    //   TreatRecv (StringSubstr(s, i)); 
    return;
}

void TreatSession(string s, int attribute) {
    int i = 0;
    string Value = "";
    string Operation = "";
    string Variable = "";
    int length = StringLen(s); //"abc" = 3;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            Variable = Variable + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        if (attribute == COM_HEDGE || attribute == COM_EXITRULE) {
            while (StringGetCharacter(s, i) != 32) {
                Operation = Operation + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++; // skip blank
        }

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            Value = Value + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "

        PG_Print(TYPE_INFO, " Value = " + Value + " Variable = " + Variable + "   i is " + i + " Length is " + length);

        int session;

        if (attribute == COM_EXITRULE)
            session = B_ReturnSession(StrToInteger(Variable), StrToInteger(Operation));
        else
            session = StrToInteger(Variable);

        if (attribute == COM_AUTOMANUAL) {
            if (StrToInteger(Value) == 1)
                Automatic = true;
            else
                Automatic = false;

            if (Automatic) {
                session = B_ReturnSession(R_MANUAL, OP_BUYSELL);

                if (session == -1) {
                    if (B_StartNewSessionRule(0, R_MANUAL, OP_BUYSELL)) {
                        session = B_StartNewSession();
                        if (session != -1) {
                            B_InitManualSession(session, false);
                        }
                    }
                }
            }
            Send_Operation("OK Predefined Manual session ");
            return;
        }

        if (session == -1) return;

        int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);
        if (engine == -1) {
            Send_Operation("OK to exit Manual session " + B_StartOnRule[session]);
            if (B_StartOnRule[session] != R_MANUAL)
                return;
            Send_Operation("OK engine ok ");
        }

        if (attribute == COM_VALUES) {
            Send_Session(session);
        } else
        if (attribute == COM_START) {
            //B_StartNewSession ();
        } else
        if (attribute == COM_DATA) {
            Send_Data(session, StrToInteger(Value), engine);
        } else
        if (attribute == COM_EXITRULE) {
            int operation = StrToInteger(Value);
            B_ExitSession(session, operation);
            Set_Engine(engine, B_STARTAUTOMATIC, P_NOSIGNAL); // if we close something no session get started automatically
            if (operation == OP_BUY) Send_Operation("OK Exit BUY trades for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else
            if (operation == OP_SELL) Send_Operation("OK Exit SELL trades for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else
                Send_Operation("OK Exit engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_EXIT) {
            operation = StrToInteger(Value);
            B_ExitSession(session, operation);
            Set_Engine(engine, B_STARTAUTOMATIC, P_NOSIGNAL); // if we close something no session get started automatically
            if (operation == OP_BUY) Send_Operation("OK Exit BUY trades for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else
            if (operation == OP_SELL) Send_Operation("OK Exit SELL trades for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else
                Send_Operation("OK Exit engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_CLOSE) {
            operation = StrToInteger(Value);
            B_CloseSession(session, operation);
            if (operation == OP_BUY) Send_Operation("OK Close BUY trades for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else
            if (operation == OP_SELL) Send_Operation("OK Close SELL trades for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else
                Send_Operation("OK Close engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_BUYSELLAUTOMATIC) {
            if (StrToInteger(Value) == 1) B_BuySellAutomatic[session] = false;
            if (StrToInteger(Value) == 0) B_BuySellAutomatic[session] = true;
            if (StrToInteger(Value) == 1) Send_Operation("OK Suspend for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else Send_Operation("OK Resume for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_EXITAUTOMATIC) {
            B_AutoExitSession(session, StrToInteger(Value));
            if (StrToInteger(Value) == 1) Send_Operation("OK Automatic Exit for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else Send_Operation("OK Manual Exit for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_DEHEDGEAUTOMATIC) {
            if (StrToInteger(Value) == 0) B_DeHedgeAutomatic[session] = false;
            if (StrToInteger(Value) == 1) B_DeHedgeAutomatic[session] = true;
            if (StrToInteger(Value) == 1) Send_Operation("OK Automatic DeHedge for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else Send_Operation("OK Manual DeHedge for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_HEDGEAUTOMATIC) {
            if (StrToInteger(Value) == 0) B_HedgeAutomatic[session] = false;
            if (StrToInteger(Value) == 1) B_HedgeAutomatic[session] = true;
            if (StrToInteger(Value) == 1) Send_Operation("OK Automatic Hedge for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else Send_Operation("OK Manual Hedge for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
        } else
        if (attribute == COM_HM) {
            B_HedgeSetMagnitude(session, StrToInteger(Value));
            Set_Engine(engine, B_HEDGEMAGNITUDE, P_NOSIGNAL);

        } else
        if (attribute == COM_KBS) {
            B_KeepBuySellSession(session, StrToInteger(Value));
            Set_Engine(engine, B_KEEPBUYSELL, P_NOSIGNAL);
            if (StrToInteger(Value) == 1) Send_Operation("OK Keep Buy Sell for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else Send_Operation("OK Release Keep Buy Sell for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);

        } else
        if (attribute == COM_HEDGE) {
            B_HedgeSession(session, StrToInteger(Value), StrToInteger(Operation));
            // When we release a hedge or hedge we must put hedge and dehedge to non automatic to avoid a loop 
            B_HedgeAutomatic[session] = false;
            B_DeHedgeAutomatic[session] = false;
            if (StrToInteger(Value) == 1) Send_Operation("OK Hedge " + OperationName[StrToInteger(Operation)] + " orders for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);
            else Send_Operation("OK DeHedge " + OperationName[StrToInteger(Operation)] + " orders for engine " + GetEngineNameFromSession(session) + " for Currency : " + SYS_SYMBOL);

        }
    }
    return;
}

void Treat_CloseOrder(string s) {
    int i = 0;
    string Size = "";
    string Order = "";
    string Session = "";
    string Type = "";

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            Session = Session + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        int session = StrToInteger(Session);

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            while (StringGetCharacter(s, i) != 32) {
                Order = Order + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;
            while (StringGetCharacter(s, i) != 32) {
                Size = Size + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;
            while (StringGetCharacter(s, i) != 32) {
                Type = Type + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;
            if (StrToInteger(Type) == OP_BUY)
                OrderClose(StrToInteger(Order), StrToDouble(Size), _Bid, SYS_SLIPPAGE, Violet);
            else
            if (StrToInteger(Type) == OP_SELL)
                OrderClose(StrToInteger(Order), StrToDouble(Size), _Ask, SYS_SLIPPAGE, Violet);
            else
                OrderDelete(StrToInteger(Order));

            Order = "";
            Size = "";
            Type = "";
        }
        i++; // skip "]"
    }
    Send_Operation("OK Close Selected Orders for engine " + GetEngineNameFromSession(Session) + " for Currency : " + SYS_SYMBOL);
    //	int engine = GetEngine (B_StartOnRule[session], B_Operation[session]);
    //    if (engine != -1) Send_Data (session, -1);  	
    return;
}

void Treat_ModifyOrder(string s) {
    int i = 0;
    string tp = "";
    string Order = "";
    string Session = "";
    string sl = "";
    int error = 0;
    bool AnyError = false;
    bool NoError = false;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            Session = Session + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        int session = StrToInteger(Session);

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            while (StringGetCharacter(s, i) != 32) {
                Order = Order + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;
            while (StringGetCharacter(s, i) != 32) {
                sl = sl + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;

            while (StringGetCharacter(s, i) != 32) {
                tp = tp + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;

            if (ModifyOrder(StrToInteger(Order), StrToDouble(sl), StrToDouble(tp)) == false) {
                error = GetLastError();
                Send_OrderModifyResult(session, Order, error, "OrderModify failed for Order : " + ErrorDescription(error));
                AnyError = true;
            } else {
                NoError = true;
                Send_OrderModifyResult(session, Order, error, "");
            }
            Order = "";
            tp = "";
            sl = "";
        }

        i++; // skip "]"
    }
    if (NoError && !AnyError) Send_Operation("OK Modify Selected Orders for engine " + GetEngineNameFromSession(Session) + " for Currency : " + SYS_SYMBOL);
    else
    if (NoError && AnyError) Send_Operation("OK Modify for some Selected Orders for engine " + GetEngineNameFromSession(Session) + " for Currency : " + SYS_SYMBOL);

    return;
}

void TreatProfit(string s) {
    int i = 0;

    string sfromdate = "";
    string stodate = "";
    string srule;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            srule = srule + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        while (StringGetCharacter(s, i) != 32) {
            sfromdate = sfromdate + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            stodate = stodate + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "

    }
    int rule = StrToInteger(srule);
    int count = NBR_RULES + 2;
    int from = 0;

    if (rule != -1) {
        from = rule;
        count = rule + 1;
    }

    for (int j = from; j < count; j++) {
        Send_Profits(j, OP_BUY, StrToTime(sfromdate), StrToTime(stodate) + 86400);
        Send_Profits(j, OP_SELL, StrToTime(sfromdate), StrToTime(stodate) + 86400);
        Send_Profits(j, OP_BUYSELL, StrToTime(sfromdate), StrToTime(stodate) + 86400);

    }
    s = "*PROFIT ";
    s = s + "Rule";
    s = s + " = [";
    s = s + -1;
    s = s + "] ";
    s = s + "*";
    Print("Finish Sending " + _Symbol);
    PG_Send(NodeSocket, s);
}

void TreatRuleData(string s) {
    int i = 0;

    string sfromdate = "";
    string soperation = "";
    string srule;

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            srule = srule + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        while (StringGetCharacter(s, i) != 32) {
            soperation = soperation + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            sfromdate = sfromdate + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "

    }
    int rule = Rule2Int(srule);
    int operation = Operation2Int(soperation);
    datetime fromdate = StrToTime(sfromdate);
    Send_Data_From_Rule(rule, operation, fromdate);
}

void TreatPivot(string s) {
    int i = 0;
    string count = "";
    string symbol = "";
    string x = "";

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            symbol = symbol + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            x = x + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "
    }
    Send_Pivot(symbol, StrToInteger(x));
}

void TreatExpert(string s) {
    int i = 0;
    string count = "";
    string expertfile = "";


    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        expertfile = expertfile + CharToString(StringGetCharacter(s, i));
        i++;
    }
    FTPDownloadExpert(expertfile);
}


void TreatInit(string s) {
    Send_Init(CSocket, CPort);
}

void TreatHistoryFile (string s) {
    int i = 0;
    string symbol = "";
    string period = "";


    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            symbol = symbol + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            period = period + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;    
        i++; // skip "] "    
    }

    Send_HistoryFile(symbol, StrToInteger(period));            
}

void TreatHistory(string s) {
    int i = 0;
    string to = "";
    string from = "";

    string symbol = "";
    string period = "";

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
            period = period + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        while (StringGetCharacter(s, i) != 32) {
            from = from + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            to = to + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "

    }
    Send_History(symbol, StrToInteger(period), StrToInteger(from), StrToInteger(to));

}

void TreatFilter(string s) {
    int i = 0;
    string add = "";
    string object = "";
    string signal = "";

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            object = object + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        while (StringGetCharacter(s, i) != 32) {
            signal = signal + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            add = add + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "

    }
    int ObjectId = Object2Id(object);
    if (ObjectId == -1) return;

    int SignalId = Signal2Int(signal);
    SignalId = -1;
    int command = StrToInteger(add); //1 add ; 0 remove ; -1 reset; -2 reset + add

    SetSignalFilter(command, ObjectId, SignalId, -1, 0);
}

void TreatCommand(string s, int operation) {
    int i = 0;
    string Value = "";
    string Variable = "";

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            Variable = Variable + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        int engine = StrToInteger(Variable);

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            Value = Value + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++; // skip "] "

        if (operation == COM_STARTAUTOMATIC) {
            AutoStartEngine(engine, StrToInteger(Value));
        } else
        if (operation == COM_BUYSELLAUTOMATIC) {
            SuspendEngine(engine, StrToInteger(Value));
        } else
        if (operation == COM_EXITAUTOMATIC) {
            AutoExitEngine(engine, StrToInteger(Value));
        } else
        if (operation == COM_HEDGEAUTOMATIC) {
            AutoHedgeEngine(engine, StrToInteger(Value));
        } else
        if (operation == COM_DEHEDGEAUTOMATIC) {
            AutoDeHedgeEngine(engine, StrToInteger(Value));
        }
        if (operation == COM_HEDGEALL) {
            HedgeAll(engine, StrToInteger(Value)); //nasty engine = optype == OP_BUY, OP_SELL, OP_BUYSELL
            if (StrToInteger(Value) == 1) Send_Operation("OK Hedge " + OperationName[engine] + " orders for all sessions" + " for Currency : " + SYS_SYMBOL);
            else if (StrToInteger(Value) == 0) Send_Operation("OK DeHedge " + OperationName[engine] + " orders for all sessions" + " for Currency : " + SYS_SYMBOL);
        } else
        if (operation == COM_EXITALL) {
            ExitAll(engine, StrToInteger(Value)); //nasty engine = optype == OP_BUY, OP_SELL, OP_BUYSELL and Value -1 < 0 , 1 > 0 and 0 all
        } else
        if (operation == COM_CLOSEALL) {
            CloseAll(engine, StrToInteger(Value)); //nasty engine = optype == OP_BUY, OP_SELL, OP_BUYSELL and Value -1 < 0 , 1 > 0 and 0 all
        }

    }
    return;
}

void TreatFlags(string s) {
    int i = 0;
    string Value = "";
    string Variable = "";
    string Attribute = "";

    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            Variable = Variable + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["

        int session = StrToInteger(Variable);
        int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);

        if (engine == -1) {
            if (B_StartOnRule[session] != R_MANUAL)
                return;
        } else
            for (int j = B_ILOT; j < NBR_ATTRIBUTES; j++) Set_Engine(engine, j, P_SIGNAL); // put everything to automatic from B_ILOT

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            while (StringGetCharacter(s, i) != 32) {
                Attribute = Attribute + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;
            while (StringGetCharacter(s, i) != 32) {
                Value = Value + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;
            SetSessionValue(session, StrToInteger(Attribute), Value);

            Value = "";
            Attribute = "";
        }
        i++; // skip "]"
    }
    return;
}

void TreatOperation(string s) {
    int i = 0;
    int result;
    string sPrice = "";
    string sVolume = "";
    string sStopLoss = "";
    string sTakeProfit = "";
    string sSession = "";
    string sOperation = "";
    double TakeProfit, StopLoss;
    double Vol;
    double Price;
    int session;
    int Operation;
    bool Manual = false;

    // MONEY MANAGEMENT      
    if (MMDailyTargetReached || MMDailySymbolTargetReached) {
        Send_Operation("You can't perform orders as daily Target is Reached");
        return;
    }
    if (MMWeeklyTargetReached || MMWeeklySymbolTargetReached) {
        Send_Operation("You can't perform orders as weekly Target is Reached");
        return;
    }


    while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
        while (StringGetCharacter(s, i) != 32) {
            sSession = sSession + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;
        i++;
        i++;
        i++; // skip " = ["
        session = StrToInteger(sSession);
        if (session == -1) {
            Manual = true;
            if (B_StartNewSessionRule(0, R_MANUAL, OP_BUYSELL)) {
                session = B_StartNewSession();
                if (session != -1) {
                    B_InitManualSession(session, false);
                }
            } else {
                session = B_ReturnSession(R_MANUAL, OP_BUYSELL);
                B_ExitBuy[session] = 0;
                B_ExitSell[session] = 0;
            }
            if (session == -1) return;
        }

        while (StringGetCharacter(s, i) != StringGetCharacter("]", 0)) {
            sPrice = "";
            while (StringGetCharacter(s, i) != 32) {
                sPrice = sPrice + CharToString(StringGetCharacter(s, i));
                i++;
            }
            i++;

            sOperation = "";
            while (StringGetCharacter(s, i) != 32) {
                sOperation = sOperation + CharToString(StringGetCharacter(s, i));
                i++;
            }
            Operation = Op2Int(sOperation);
            i++;

            sVolume = "";
            while (StringGetCharacter(s, i) != 32) {
                sVolume = sVolume + CharToString(StringGetCharacter(s, i));
                i++;
            }
            Vol = StrToDouble(sVolume);
            i++;

            sStopLoss = "";
            while (StringGetCharacter(s, i) != 32) {
                sStopLoss = sStopLoss + CharToString(StringGetCharacter(s, i));
                i++;
            }
            StopLoss = StrToDouble(sStopLoss);
            i++;

            sTakeProfit = "";
            while (StringGetCharacter(s, i) != 32) {
                sTakeProfit = sTakeProfit + CharToString(StringGetCharacter(s, i));
                i++;
            }
            TakeProfit = StrToDouble(sTakeProfit);
            i++;

            if (Operation == OP_BUY || Operation == OP_SELL) Price = 0;
            else Price = StrToDouble(sPrice);

            result = B_ProcessTrade(session, Price, Operation, Vol, StopLoss, TakeProfit, StopLoss, TakeProfit, (B_BuySellAutomatic[session]) ? B_OrderType[session] : OT_MONO);

            if (result != 0)
                Send_Operation("Manual " + OpName[Operation] + " for Currency : " + SYS_SYMBOL + " failed because " + ErrorDescription(result));
            else
                Send_Operation("OK Manual " + OpName[Operation] + " of " + sVolume + " Lots" + " for Currency : " + SYS_SYMBOL);
        }
        i++; // skip "]"
    }
    return;
}

void TreatRecv(int socket, string s) {

    string Command;

    int length = StringLen(s); //"abc" = 3;

    int i = 0;

    PG_Print(TYPE_INFO, s + " BUFFER SIZE = : " + length);

    if (length == 0) return;

    int stilltoread = length;
    while (stilltoread) {
        if (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) return;
        i++;

        Command = "";
        while (StringGetCharacter(s, i) != 32 && StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
            Command = Command + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        PG_Print(TYPE_INFO, "Command = _______________________________ " + Command);

        int commandsize = StringLen(Command);

        string request = "";
        while (StringGetCharacter(s, i) != StringGetCharacter("*", 0)) {
            request = request + CharToString(StringGetCharacter(s, i));
            i++;
        }
        i++;

        request = request + "*";

        TreatCommand(Command, request);

        int requestsize = StringLen(request);

        stilltoread = length - (requestsize + commandsize + 2);

    }

}
void doPauseTest(){
   int hmain;
   if (IsTesting() && IsVisualMode()){
      hmain = GetAncestor(WindowHandle(_Symbol, _Period), 2 /* GA_ROOT */);
      PostMessageA(hmain, WM_COMMAND, 0x57a, 0);
   }
}
void TreatCommand(string Command, string request) {
    if (Command == "GET_EXPERT") {
        TreatExpert(request);
    } else
    if (Command == "GET_PIVOT") {
        TreatPivot(request);
    } else
    if (Command == "GET_DATARULE") {
        TreatRuleData(request);
    } else
    if (Command == "GET_PROFIT") {
        TreatProfit(request);
    } else
    if (Command == "SETFILTER") {
        TreatFilter(request);
    } else
    if (Command == "ADDFILTER") {
        TreatFilter(request);
    } else
    if (Command == "SETFLAG") {
        TreatFlags(request);
    } else
    if (Command == "GET_NEWS") {
        AlertNextNews();
    } else
    if (Command == "RELOADALERTFILE") {
        ReloadAlerts();
    } else
    if (Command == "RELOADFILTERFILE") {
        ReloadFilters();
    } else
    if (Command == "RELOADPANELFILE") {
        ReloadPanel();
    } else
    if (Command == "RELOADMONEYFILE") {
        ReloadMM();
    } else
    if (Command == "RELOADSCHEDULEFILE") {
        ReloadSchedules(); // loadengines
    } else
    if (Command == "RELOADPROJECT") {
        ReloadProject(request);
    } else
    if (Command == "RELOADENGINEFILE") {
        ReloadEngines();
    } else
    if (Command == "RELOADOBJECTFILE") {
        ReloadObjects();
    } else
    if (Command == "SETMM") {
        SetMM(request);
    } else
    if (Command == "ORDER") {
        TreatOperation(request);
    } else
    if (Command == "SET_PROPERTIES") {
        TreatRecvProperty(request);
    } else
    if (Command == "SET_SIGNAL") {
        SetSignal(request);
    } else
    if (Command == "ALLOWTRADING") {
        AllowTrading = true;
    } else
    if (Command == "GET_HISTORY") {
        TreatHistory(request);
    } else
    if (Command == "GET_HISTORYFILE") {
        TreatHistoryFile(request);
    } else
    if (Command == "PAUSE") {
        doPauseTest ();
    } else
    if (Command == "GET_INIT") {
        TreatInit(request);
    } else
    if (Command == "EXITENGINE") {
        TreatCommand(request, COM_EXIT);
    } else
        // ENGINES  	
        if (Command == "HEDGEAENGINE") {
            TreatCommand(request, COM_HEDGEAUTOMATIC);
        }
    else
    if (Command == "DEHEDGEAENGINE") {
        TreatCommand(request, COM_DEHEDGEAUTOMATIC);
    } else
    if (Command == "EXITAENGINE") {
        TreatCommand(request, COM_EXITAUTOMATIC);
    } else
    if (Command == "STARTAENGINE") {
        TreatCommand(request, COM_STARTAUTOMATIC);
    } else
    if (Command == "SUSPENDENGINE") {
        TreatCommand(request, COM_BUYSELLAUTOMATIC);
    } else
    if (Command == "HEDGEALLENGINE") {
        TreatCommand(request, COM_HEDGEALL);
    } else
    if (Command == "EXITALLENGINE") {
        TreatCommand(request, COM_EXITALL);
    } else
    if (Command == "CLOSEALLENGINE") {
        TreatCommand(request, COM_CLOSEALL);
    } else

        /// SESSIONS  
        if (Command == "AUTOMANUALSESSION") {
            TreatSession(request, COM_AUTOMANUAL);
        }
    else
    if (Command == "VALUESSESSION") {
        TreatSession(request, COM_VALUES);
    } else
    if (Command == "EXITSESSION") {
        TreatSession(request, COM_EXIT);
    } else
    if (Command == "EXITRULE") {
        TreatSession(request, COM_EXITRULE);
    } else
    if (Command == "CLOSESESSION") {
        TreatSession(request, COM_CLOSE);
    } else
    if (Command == "SUSPENDSESSION") {
        TreatSession(request, COM_BUYSELLAUTOMATIC);
    } else
    if (Command == "EXITASESSION") {
        TreatSession(request, COM_EXITAUTOMATIC);
    } else
    if (Command == "HEDGEASESSION") {
        TreatSession(request, COM_HEDGEAUTOMATIC);
    } else
    if (Command == "DEHEDGEASESSION") {
        TreatSession(request, COM_DEHEDGEAUTOMATIC);
    } else
    if (Command == "KBSSESSION") {
        TreatSession(request, COM_KBS);
    } else
    if (Command == "HEDGESESSION") {
        TreatSession(request, COM_HEDGE);
    } else
    if (Command == "STARTSESSION") {
        TreatSession(request, COM_START);
    } else
    if (Command == "HMSESSION") {
        TreatSession(request, COM_HM);
    } else
    if (Command == "GET_PROPERTIES") {
        Send_Properties();
    } else
    if (Command == "DATASESSION") {
        TreatSession(request, COM_DATA);
    } else
    if (Command == "CLOSEORDER") {
        Treat_CloseOrder(request);
    } else
    if (Command == "MODIFYORDER") {
        Treat_ModifyOrder(request);
    }
}

// ---------------------------------------- COMMAND Sending 

bool NoConnection() {
    return (CSocket < 0 && NodeSocket < 0);
}



void Send_Login(int socket, int port) {
    if (NoConnection()) return;

    string s = "*LOGIN";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";
    s = s + HTTPServerName;    
    s = s + "^";
    s = s + UserName;
    s = s + "^";
    s = s + UserPassword;
    s = s + "^";
    s = s + AccountNumber();    
    s = s + "^";
    s = s + AccountName();
    s = s + "^";
    s = s + TerminalName();
    s = s + "^";
    s = s + TerminalInfoString(TERMINAL_DATA_PATH);
    s = s + "^";
    s = s + TestMode;
    s = s + "*";
    PG_Send(socket, s);
}
void Send_Connect(int socket) {
    if (NoConnection()) return;

    string s = "*CONNECT";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";
    s = s + SYS_SYMBOL;
    s = s + "^";
    s = s + SYS_MINLOT;
    s = s + "^";
    s = s + SYS_MAXLOT;
    s = s + "^";
    s = s + SYS_LOTSTEP;
    s = s + "^";
    s = s + SYS_SPREAD;
    s = s + "^";
    s = s + SYS_STOPLEVEL;
    s = s + "^";
    s = s + _Point;
    s = s + "^";
    s = s + SYS_DIGITS;
    s = s + "^";
    s = s + SYS_LOTSIZE;
    s = s + "^";
    s = s + TestMode;
    s = s + "^";
    s = s + CurrentPeriod;
    s = s + "*";
    PG_Send(socket, s);
}

void Send_Init(int socket, int port) {
    if (NoConnection()) return;
    string s = "*INIT";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";
    s = s + SYS_SYMBOL;
    s = s + "^";
    s = s + SYS_MINLOT;
    s = s + "^";
    s = s + SYS_MAXLOT;
    s = s + "^";
    s = s + SYS_LOTSTEP;
    s = s + "^";
    s = s + SYS_SPREAD;
    s = s + "^";
    s = s + SYS_STOPLEVEL;
    s = s + "^";
    s = s + _Point;
    s = s + "^";
    s = s + SYS_DIGITS;
    s = s + "^";
    s = s + SYS_LOTSIZE;
    s = s + "^";
    s = s + TestMode;
    s = s + "^";
    s = s + CurrentPeriod;
    s = s + "^";
    s = s + AccountNumber();
    s = s + "^";
    s = s + AccountCurrency();     
    s = s + "^";
    s = s + DoubleToString(StartDate, 0);
    s = s + "^";
    s = s + TerminalInfoInteger(TERMINAL_BUILD);
    s = s + "^";
    s = s + DoubleToString(-GMTShift, 0);
    s = s + "^";
    s = s + AccountName();
    s = s + "^";
    s = s + TerminalCompany();
    s = s + "^";
    s = s + TerminalName();
    s = s + "^";
    s = s + TerminalPath();
    s = s + "^";
    s = s + TerminalInfoString(TERMINAL_DATA_PATH);
    s = s + "*";
    PG_Send(socket, s);
}

void Send_Signal(int Object, int signaltype, int type = 0) {

    if (NoConnection()) return;

    if (Object == -1) return;

    string s = "*SIGNAL";
    s = s + "^";
    s = s + SYS_SYMBOL;
    s = s + "^";
    s = s + ObjectId2Name(Object);
    s = s + "^";
    s = s + SignalName[signaltype];
    s = s + "^";
    if (type == 0)
        s = s + DoubleToString(SignalTab[Object][signaltype], 0);
    else
    if (type == 1)
        s = s + DoubleToString(BSignalTab[Object][signaltype], 0);
    else
        s = s + DoubleToString(TSignalTab[Object][signaltype], 0);
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_Signal_Value(int Object, int signaltype, int digits = -1) {
    if (NoConnection()) return;

    if (Object == -1) return;

    string s = "*SIGNAL";
    s = s + "^";
    s = s + SYS_SYMBOL;
    s = s + "^";
    s = s + ObjectId2Name(Object);
    s = s + "^";
    s = s + SignalName[signaltype];

    for (int k = 0; k < NBR_PERIODS; k++) {
        s = s + "^";
        if (digits != -1)
            s = s + DoubleToString(SValue(Object, signaltype, k), digits);
        else
            s = s + DoubleToString(SValue(Object, signaltype, k));
    }
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_Signal_Time(int Object, int signaltype) {
    if (NoConnection()) return;

    if (Object == -1) return;

    string s = "*SIGNALTIME";
    s = s + "^";
    s = s + SYS_SYMBOL;
    s = s + "^";
    s = s + ObjectId2Name(Object);
    s = s + "^";
    s = s + SignalName[signaltype];
    for (int k = 0; k < NBR_PERIODS; k++) {
        s = s + "^";        
        s = s + DoubleToString(STime(Object, signaltype, k));
    }
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_Symbol(string symbol, int x) {

    if (NoConnection()) return;
    string s = "*SYMBOL";
    s = s + "^";
    s = s + symbol;
    s = s + "^";
    s = s + x;
    s = s + "^";
    s = s + DoubleToString(_Ask, _Digits);
    s = s + "^";
    s = s + DoubleToString(_Bid, _Digits);
    s = s + "^";
    s = s + DoubleToString(iTime(symbol, PeriodIndex[x], 0));
    s = s + "^";
    s = s + DoubleToString(iOpen(symbol, PeriodIndex[x], 0), _Digits);
    s = s + "^";
    s = s + DoubleToString(iHigh(symbol, PeriodIndex[x], 0), _Digits);
    s = s + "^";
    s = s + DoubleToString(iLow(symbol, PeriodIndex[x], 0), _Digits);
    s = s + "^";
    s = s + DoubleToString(iClose(symbol, PeriodIndex[x], 0), _Digits);
    s = s + "^";
    s = s + DoubleToString(iVolume(symbol, PeriodIndex[x], 0), 0);

    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_HistoryFile (string symbol, int x) {
    string LocalFile = symbol + PeriodIndex[x] + ".hst";

    int handle = FileOpenHistory(LocalFile, FILE_BIN|FILE_READ);

    if (handle < 1) {
        Print("Cannot open file " +  LocalFile);
        return;
    }
    int    filesize = FileSize(handle);
    string content = "*HISTORYFILE";
    content = content + "^";
    content = content + symbol;
    content = content + "^";
    content = content + x;
    content = content + "^";
    content = content + filesize;
    content = content + "^";    
    
 
    int    totalsize = filesize + StringLen(content) + 1;
    
    char   filecontent[]; 
    ArrayResize(filecontent, totalsize);

	Print (ArraySize(filecontent));
    Print ("Sending History File " + LocalFile);


	StringToCharArray(content, filecontent, 0, StringLen(content));
	
    if (FileReadArray (handle, filecontent, StringLen(content)) != filesize) {
         FileClose(handle);
         Print("Error reading the file \""+ LocalFile + "\"");
         return;
    }
    FileClose(handle);
	filecontent[totalsize -1] = "*";
	
    PG_SendBuffer(CSocket, filecontent, filesize + StringLen(content));
  //  PG_Send(NodeSocket, "*");
}

void Send_History(string symbol, int x, int from, int to) {
    if (NoConnection()) return;
    
    int error = 0;
    string s = "";
    int k = 0;
    double time = iTime(symbol, PeriodIndex[x], 0);
    
    for (int i = to - 1; i >= from; i--) {
        time = iTime(symbol, PeriodIndex[x], i);
        if (time == 0) {
           error = GetLastError();
         //  Print ("error after gethistory " + x + " bar " + i + " " + error);        
           continue;
        }
        s = s + "^";
        s = s + DoubleToString(time, 0);
        s = s + "^";
        s = s + DoubleToString(iOpen(symbol, PeriodIndex[x], i), _Digits);
        s = s + "^";
        s = s + DoubleToString(iHigh(symbol, PeriodIndex[x], i), _Digits);
        s = s + "^";
        s = s + DoubleToString(iLow(symbol, PeriodIndex[x], i), _Digits);
        s = s + "^";
        s = s + DoubleToString(iClose(symbol, PeriodIndex[x], i), _Digits);
        s = s + "^";
        s = s + DoubleToString(iVolume(symbol, PeriodIndex[x], i), 0);
        k++;
    }

    s = s + "*";
    string content = "*HISTORY";
    content = content + "^";
    content = content + symbol;
    content = content + "^";
    content = content + x;
    content = content + "^";
    content = content + from ;
    content = content + "^";
    content = content + k ;
    
    PG_Send(NodeSocket, content + s);
}

void Send_Alert(string symbol, int AlertId, int AlertPeriod) {

    if (NoConnection()) return;
    string s = "*ALERT";
    s = s + "^";
    s = s + symbol;
    s = s + "^";
    s = s + AlertId;
    s = s + "^";    
    s = s + DoubleToString(TimeCurrent(), 0);
    s = s + "^";    
    s = s + AlertPeriod;
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_MM() {
    if (NoConnection()) return;
    string s = "*MM";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";    
    s = s + DoubleToString(MMDailyTargetAmount, 2);
    s = s + "^";
    s = s + DoubleToString(MMDailyStopLoss, 2);
    s = s + "^";
    s = s + MMDailyTargetReached;
    s = s + "^";
    s = s + DoubleToString(MMDailyClosedProfit, 2);
    s = s + "^";
    s = s + DoubleToString(MMDailySymbolTargetAmount, 2);
    s = s + "^";
    s = s + DoubleToString(MMDailySymbolStopLoss, 2);
    s = s + "^";
    s = s + MMDailySymbolTargetReached;
    s = s + "^";
    s = s + DoubleToString(MMDailySymbolClosedProfit, 2);
    s = s + "^";
    s = s + DoubleToString(MMWeeklyTargetAmount, 2);
    s = s + "^";
    s = s + DoubleToString(MMWeeklyStopLoss, 2);
    s = s + "^";
    s = s + MMWeeklyTargetReached;
    s = s + "^";
    s = s + DoubleToString(MMWeeklyClosedProfit, 2);
    s = s + "^";
    s = s + DoubleToString(MMWeeklySymbolTargetAmount, 2);
    s = s + "^";
    s = s + DoubleToString(MMWeeklySymbolStopLoss, 2);
    s = s + "^";
    s = s + MMWeeklySymbolTargetReached;
    s = s + "^";
    s = s + DoubleToString(MMWeeklySymbolClosedProfit, 2);
    s = s + "^";
    s = s + DoubleToString(MMDailyPercentTargetAmount, 2);
    s = s + "^";
    s = s + DoubleToString(MMDailyPercentStopLoss, 2);
    s = s + "^";
    s = s + DoubleToString(MMWeeklyPercentTargetAmount, 2);
    s = s + "^";
    s = s + DoubleToString(MMWeeklyPercentStopLoss, 2);
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_EngineFlags() {
    if (NoConnection()) return;
    string s = "*ENGINEFLAGS";
    s = s + "^";    
    s = s + _Symbol ;

    for (int i = 0; i < E_NbrEngine; i++) {
        s = s + "^";        
        s = s + EngineTab[i][0];
        s = s + "/";
        s = s + EngineTab[i][1];
    }
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_RuleFlags() {
    if (NoConnection()) return;
    string s = "*RULEFLAGS";
    s = s + "^";    
    s = s + _Symbol;
    for (int i = OP_BUY; i <= OP_BUYSELL; i++) {
        s = s + "^";    
        s = s + RuleTab[i][T_START];
    }

    for (i = OP_BUY; i <= OP_CLOSE; i++) {
        s = s + "^";    
        s = s + RuleTab[i][T_STATUS];
    }
    s = s + "*";
    PG_Send(NodeSocket, s);
}

string ns2(double a) {
    return (DoubleToString(a, 2));
}




void Send_Command(int number, int sessionnumber, int engine, int start, double buyprofit, double sellprofit, double profit, double totalprofit, int nbrbuy, int nbrsell, double buylot, double selllot, int hedgetype, double hedgebuyprofit, double hedgesellprofit, double buyaverage, double sellaverage, double min, double max) {
    if (NoConnection()) return;
    string s = "*ENGINE";
    s = s + "^";    
    s = s + _Symbol;
    s = s + "^";
    s = s + number;
    s = s + "^";
    if (sessionnumber != -1) {

        s = s + sessionnumber;
        s = s + "^";
        s = s + DoubleToString(B_StartDate[sessionnumber], 0);
        s = s + "^";
        s = s + engine;
        s = s + "^";
        if (start == 1)
            s = s + "Auto";
        else
            s = s + "Manual";
        s = s + "^";
        s = s + DoubleToString(buylot, 2);
        s = s + "^";
        s = s + DoubleToString(selllot, 2);
        s = s + "^";
        s = s + nbrbuy;
        s = s + "^";
        s = s + nbrsell;
        s = s + "^";
        s = s + DoubleToString(buyprofit, 2);
        s = s + "^";
        s = s + DoubleToString(sellprofit, 2);
        s = s + "^";
        s = s + DoubleToString(profit, 2);
        s = s + "^";
        s = s + DoubleToString(totalprofit, 2);
        s = s + "^";
        s = s + hedgetype;
        s = s + "^";
        s = s + DoubleToString(hedgebuyprofit, 2);
        s = s + "^";
        s = s + DoubleToString(hedgesellprofit, 2);
        s = s + "^";
        s = s + DoubleToString(buyaverage, 4);
        s = s + "^";
        s = s + DoubleToString(sellaverage, 4);
        s = s + "^";
        s = s + DoubleToString(min, 4);
        s = s + "^";
        s = s + DoubleToString(max, 4);
        s = s + "^";
        s = s + B_SaveInfo(sessionnumber);
    } else {
        s = s + engine;
        s = s + "^";
        s = s + ns2(AccountEquity());
        s = s + "^";
        s = s + ns2(AccountBalance());
        s = s + "^";
        s = s + ns2(AccountFreeMargin());
        s = s + "^";
        s = s + ns2(AccountMargin());
        s = s + "^";
        s = s + ns2(AccountLeverage());
        s = s + "^";
        s = s + DoubleToString(profit, 2);
        s = s + "^";
        s = s + ns2(AccountProfit());
        s = s + "^";
        s = s + ns2(AccountNbrLots);
        s = s + "^";
        s = s + AccountCurrency();        
    }
    s = s + "*";
    PG_Send(NodeSocket, s);
}
void Send_Session(int i) {
    if (NoConnection()) return;
    string s = "*SESSION";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";
    s = s + i;
    s = s + "^";
    s = s + B_Operation[i];
    s = s + "^";
    s = s + B_StartOnRule[i];
    s = s + "^";
    s = s + B_BuyOnRule[i];
    s = s + "^";
    s = s + B_SellOnRule[i];
    s = s + "^";
    s = s + B_ExitBuyOnRule[i];
    s = s + "^";
    s = s + B_ExitSellOnRule[i];
    s = s + "^";
    s = s + B_ExitOnRule[i];
    s = s + "^";
    s = s + DoubleToString(B_ILot[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_MaxLot[i], 2);
    s = s + "^";
    s = s + B_MaxCount[i];
    s = s + "^";
    s = s + B_Direction[i];
    s = s + "^";
    s = s + B_DirectionType[i];
    s = s + "^";
    s = s + B_RecoveryMode[i];
    s = s + "^";
    s = s + DoubleToString(B_RecoveryValue[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_PipStep[i], 2);
    s = s + "^";
    s = s + B_TimeStep[i];
    s = s + "^";
    s = s + B_OrderType[i];
    s = s + "^";
    s = s + B_KeepBuySell[i];
    s = s + "^";
    s = s + B_OneOrderPerBar[i];
    s = s + "^";
    s = s + B_ExitMode[i];
    s = s + "^";
    s = s + B_MaxTime[i];
    s = s + "^";
    s = s + B_HedgeMagnitude[i];
    s = s + "^";
    s = s + DoubleToString(B_MinProfit[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyMinProfit[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellMinProfit[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_TakeProfit[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_TrailingStop[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_StopLoss[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyTakeProfit[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyTrailingStop[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyStopLoss[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellTakeProfit[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellTrailingStop[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellStopLoss[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyLotTP[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyLotTS[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_BuyLotSL[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellLotTP[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellLotTS[i], 2);
    s = s + "^";
    s = s + DoubleToString(B_SellLotSL[i], 2);
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_Data(int session = -1, int mode = -1, int engine = -1) {
    if (NoConnection()) return;
    int total;
    int MagicNumber = -1;
    if (session != -1)
        MagicNumber = B_MagicNumber[session];

    total = OrdersTotal();

    int sent = 0;
    string s;
    if (engine == -1)
        s = "*DATA";
    else
        s = "*SDATA";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";
    s = s + session;

    if (mode == MODE_TRADES || mode == -1)
        for (int cnt = 0; cnt < total; cnt++) {
            OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
            if (OrderSymbol() != _Symbol) continue;

            if (MagicNumber != -1 &&
                OrderMagicNumber() != MagicNumber &&
                OrderMagicNumber() != MagicNumber + HedgeMagicNumber)
                continue;
            s = s + "^";
            s = s + OrderTicket();
            s = s + "^";
            s = s + MODE_TRADES;
            s = s + "^";
            s = s + OrderMagicNumber();
            s = s + "^";
            s = s + OrderOpenTime();
            s = s + "^";
            s = s + OrderType();
            s = s + "^";
            s = s + DoubleToString(OrderLots(), 2);
            s = s + "^";
            s = s + OrderSymbol();
            s = s + "^";
            s = s + DoubleToString(OrderOpenPrice(), _Digits);
            s = s + "^";
            s = s + DoubleToString(OrderStopLoss(), _Digits);
            s = s + "^";
            s = s + DoubleToString(OrderTakeProfit(), _Digits);
            s = s + "^";
            s = s + OrderCloseTime();
            s = s + "^";
            s = s + DoubleToString(_Bid, _Digits);
            s = s + "^";
            s = s + DoubleToString(OrderCommission(), 2);
            s = s + "^";
            s = s + DoubleToString(OrderSwap(), 2);
            s = s + "^";
            s = s + DoubleToString(OrderProfit(), 2);
            s = s + "^";
            s = s + OrderComment();
            sent = 1;
        }

    string sComment = "";
    int slpos, tppos, spos;

    total = OrdersHistoryTotal();

    if (mode == MODE_HISTORY || mode == -1)
        for (cnt = 0; cnt < total; cnt++) {
            OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
            if (OrderSymbol() != _Symbol) continue;

            if (MagicNumber != -1 &&
                OrderMagicNumber() != MagicNumber &&
                OrderMagicNumber() != MagicNumber + HedgeMagicNumber)
                continue;
            sComment = OrderComment();
            slpos = StringFind(sComment, "[sl]");
            tppos = StringFind(sComment, "[tp]");
            spos = 0;

            if (slpos == 0 || tppos == 0) {
                spos = 4;
                while (StringGetCharacter(sComment, spos) == ' ') spos++;
            }
            if (session == -1 || B_ReadSInfo(OrderComment(), spos, 10) == DoubleToString(B_StartDate[session], 0)) {
                StringReplace(sComment, "]", ")");
                s = s + "^";
                s = s + OrderTicket();
                s = s + "^";
                s = s + MODE_HISTORY;
                s = s + "^";
                s = s + OrderMagicNumber();
                s = s + "^";
                s = s + OrderOpenTime();
                s = s + "^";
                s = s + OrderType();
                s = s + "^";
                s = s + DoubleToString(OrderLots(), 2);
                s = s + "^";
                s = s + OrderSymbol();
                s = s + "^";
                s = s + DoubleToString(OrderOpenPrice(), _Digits);
                s = s + "^";
                s = s + DoubleToString(OrderStopLoss(), _Digits);
                s = s + "^";
                s = s + DoubleToString(OrderTakeProfit(), _Digits);
                s = s + "^";
                s = s + OrderCloseTime();
                s = s + "^";
                s = s + DoubleToString(OrderClosePrice(), _Digits);
                s = s + "^";
                s = s + DoubleToString(OrderCommission(), 2);
                s = s + "^";
                s = s + DoubleToString(OrderSwap(), 2);
                s = s + "^";
                s = s + DoubleToString(OrderProfit(), 2);
                s = s + "^";
                s = s + sComment;
                sent = 1;
            }
        }
    s = s + "*";
    PG_Send(NodeSocket, s); // for
    return;
}

void Send_Profit(int rule, int operation, datetime RuleStartDate, datetime RuleEndDate, double RuleProfit, double RuleBuyProfit, double RuleSellProfit, double RuleBuyNbrLots, double RuleSellNbrLots, int RuleBuyNbrTrade, int RuleSellNbrTrade) {
    if (NoConnection()) return;
    string s = "*PROFIT";
    s = s + "^";
    s = s + _Symbol;
    s = s + "^";
    s = s + rule;
    s = s + "^";
    s = s + operation;
    s = s + "^";
    s = s + DoubleToString(RuleStartDate, 0);
    s = s + "^";
    s = s + DoubleToString(RuleEndDate, 0);
    s = s + "^";
    s = s + DoubleToString(RuleBuyNbrLots, 2);
    s = s + "^";
    s = s + DoubleToString(RuleSellNbrLots, 2);
    s = s + "^";
    s = s + RuleBuyNbrTrade;
    s = s + "^";
    s = s + RuleSellNbrTrade;
    s = s + "^";
    s = s + DoubleToString(RuleBuyProfit, 2);
    s = s + "^";
    s = s + DoubleToString(RuleSellProfit, 2);
    s = s + "^";
    s = s + DoubleToString(RuleProfit, 2);
    s = s + "*";
    PG_Send(NodeSocket, s);
}
void Send_Data_From_Rule(int rule, int operation, datetime fromdate, int closed = 1) {
    if (NoConnection()) return;
    int total;
    int sent = 0;
    string s = "*DATARULE ";

    string sComment = "";
    int slpos, tppos, spos;

    s = s + _Symbol + " = ";

    total = OrdersHistoryTotal();

    for (int cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderSymbol() != _Symbol) continue;

        sComment = OrderComment();
        slpos = StringFind(sComment, "[sl]");
        tppos = StringFind(sComment, "[tp]");
        spos = 0;

        if (slpos == 0 || tppos == 0) {
            spos = 4;
            while (StringGetCharacter(sComment, spos) == ' ') spos++;
        }
        if (Rule2Int(B_ReadSInfo(sComment, spos + 10, 1)) == rule && StrToInteger(B_ReadSInfo(sComment, spos + 11, 1)) == operation &&
            StrToDouble(B_ReadSInfo(sComment, spos, 10)) == fromdate) {
            StringReplace(sComment, "]", ")");
            s = s + "[";
            s = s + rule;
            s = s + " ";
            s = s + operation;
            s = s + " ";
            s = s + fromdate;
            s = s + " ";
            s = s + OrderMagicNumber();
            s = s + " ";
            s = s + OrderTicket();
            s = s + " ";
            s = s + OrderOpenTime();
            s = s + " ";
            s = s + OrderType();
            s = s + " ";
            s = s + DoubleToString(OrderLots(), 2);
            s = s + " ";
            s = s + OrderSymbol();
            s = s + " ";
            s = s + DoubleToString(OrderOpenPrice(), _Digits);
            s = s + " ";
            s = s + DoubleToString(OrderStopLoss(), _Digits);
            s = s + " ";
            s = s + DoubleToString(OrderTakeProfit(), _Digits);
            s = s + " ";
            s = s + OrderCloseTime();
            s = s + " ";
            s = s + DoubleToString(OrderClosePrice(), _Digits);
            s = s + " ";
            s = s + DoubleToString(OrderCommission(), 2);
            s = s + " ";
            s = s + DoubleToString(OrderSwap(), 2);
            s = s + " ";
            s = s + DoubleToString(OrderProfit(), 2);
            s = s + " ";
            s = s + sComment;
            s = s + "] ";
            sent = 1;
        }
    }
    if (sent == 0) s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s); // for
    return;
}



void Send_Mail(int Object, int Signal, int period, string sFrom, string sTo, string sCc, string sBcc, string sSubject, string sMessage) {

    if (NoConnection()) return;
    string s = "*MAIL ";
    s = s + " = [";
    s = s + Object;
    s = s + "#" + Signal;
    s = s + "#" + period;
    s = s + "#" + sFrom;
    s = s + "#" + sTo;
    s = s + "#" + sCc;
    s = s + "#" + sBcc;
    s = s + "#" + sSubject;
    s = s + "#" + sMessage;
    s = s + "] ";
    s = s + "*";

    PG_Send(NodeSocket, s);
}

void Send_Sound(string symbol, int Object, int Signal, int period, string sSound) {

    if (NoConnection()) return;
    string s = "*SOUND ";
    s = s + symbol;
    s = s + " = [";
    s = s + Object;
    s = s + "#" + Signal;
    s = s + "#" + period;
    s = s + "#" + sSound;
    s = s + "] ";
    s = s + "*";

    PG_Send(NodeSocket, s);
}
void Send_Pivot(string symbol, int period) {
    if (NoConnection()) return;
    string s = "*PIVOT ";
    s = s + symbol + " " + period + " " + DoubleToString(TimeCurrent(), 0);
    s = s + " = [";

    for (int i = 1; i < 4; i++) {
        s = s + DoubleToString(LastHigh[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastResistance[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastResistance1[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastResistance2[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastPivotPoint[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastSupport[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastSupport1[i][P_D1], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastSupport2[i][period], _Digits);
        s = s + " ";
        s = s + DoubleToString(LastLow[i][period], _Digits);
        s = s + " ";
    }
    s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s);
}
void Send_News(string DateNewsToday, string DescNewsToday, string CurrNewsToday, string ImportanceNewsToday, string ActualNewsToday, string ForecastNewsToday, string PreviousNewsToday) {

    if (NoConnection()) return;
    string snews;
    string scurrency = "Currency : ";

    if (CurrNewsToday == "CAD") scurrency = scurrency + "Canadian dollar";
    else if (CurrNewsToday == "CHF") scurrency = scurrency + "Swiss Franc";
    else if (CurrNewsToday == "EUR") scurrency = scurrency + "Euro";
    else if (CurrNewsToday == "GBP") scurrency = scurrency + "Sterling";
    else if (CurrNewsToday == "JPY") scurrency = scurrency + "Yen";
    else if (CurrNewsToday == "NZD") scurrency = scurrency + "New Zealand dollar";
    else if (CurrNewsToday == "USD") scurrency = scurrency + "US dollar";
    else if (CurrNewsToday == "AUD") scurrency = scurrency + "Aussie dollar";
    else scurrency = CurrNewsToday;
    snews = "News of importance : " + ImportanceNewsToday + ". At " + DateNewsToday + ". " + scurrency + "," + DescNewsToday + ".";

    if (ForecastNewsToday != "")
        snews = snews + "Forecasting : " + ForecastNewsToday + " .";

    if (ActualNewsToday != "")
        snews = snews + " Actually : " + ActualNewsToday + " .";

    string s = "*NEWS ";
    s = s + "Description";
    s = s + " = [";
    s = s + snews;
    s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_CProperties() {
    if (NoConnection()) return;

    string s = "*SET_PROPERTIES ";

    s = s + "Sound";
    s = s + " = [";
    s = s + Get_Property("Sound");
    s = s + "] ";
    s = s + "News";
    s = s + " = [";
    s = s + Get_Property("News");
    s = s + "] ";
    s = s + "GraphicSR";
    s = s + " = [";
    s = s + Get_Property("GraphicSR");
    s = s + "] ";
    s = s + "GraphicFractals";
    s = s + " = [";
    s = s + Get_Property("GraphicFractals");
    s = s + "] ";
    s = s + "GraphicPivotD1";
    s = s + " = [";
    s = s + Get_Property("GraphicPivotD1");
    s = s + "] ";
    s = s + "GraphicPivotW1";
    s = s + " = [";
    s = s + Get_Property("GraphicPivotW1");
    s = s + "] ";
    s = s + "GraphicPivotM1";
    s = s + " = [";
    s = s + Get_Property("GraphicPivotM1");
    s = s + "] ";
    s = s + "GraphicFiboD1";
    s = s + " = [";
    s = s + Get_Property("GraphicFiboD1");
    s = s + "] ";
    s = s + "GraphicFiboW1";
    s = s + " = [";
    s = s + Get_Property("GraphicFiboW1");
    s = s + "] ";
    s = s + "GraphicFiboM1";
    s = s + " = [";
    s = s + Get_Property("GraphicFiboM1");
    s = s + "] ";
    s = s + "GraphicMainPanel";
    s = s + " = [";
    s = s + Get_Property("GraphicMainPanel");
    s = s + "] ";
    s = s + "Comment";
    s = s + " = [";
    s = s + Get_Property("Comment");
    s = s + "] ";
    s = s + "GraphicCS";
    s = s + " = [";
    s = s + Get_Property("GraphicCS");
    s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s);
}



int Send_Manual(string symbol, int session, int operation, double nbrlots, double SL, double TP, int Flag) {
    if (NoConnection()) return;
    string s = "*MANUAL ";
    s = s + "Symbol";
    s = s + " = [";
    s = s + symbol;
    s = s + "] ";
    s = s + "Session";
    s = s + " = [";
    s = s + session;
    s = s + "] ";
    s = s + "Operation";
    s = s + " = [";
    s = s + operation;
    s = s + "] ";
    s = s + "Lots";
    s = s + " = [";
    s = s + DoubleToString(nbrlots, 2);
    s = s + "] ";
    s = s + "SL";
    s = s + " = [";
    s = s + DoubleToString(SL, 2);
    s = s + "] ";
    s = s + "TP";
    s = s + " = [";
    s = s + DoubleToString(TP, 2);
    s = s + "] ";
    s = s + "Flag";
    s = s + " = [";
    s = s + Flag;
    s = s + "] ";

    s = s + "*";
    PG_Send(NodeSocket, s);
    return 1;
}

void Send_OrderModifyResult(int Session, int Order, int Error, string Description) {
    if (NoConnection()) return;
    string s;
    s = "*ORDERMODIFYRESULT ";
    s = s + "Session";
    s = s + " = [";
    s = s + Session;
    s = s + "] ";
    s = s + "Order";
    s = s + " = [";
    s = s + Order;
    s = s + "] ";
    s = s + "Error";
    s = s + " = [";
    s = s + Error;
    s = s + "] ";
    s = s + "Code";
    s = s + " = [";
    s = s + Description;
    s = s + " ";
    s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_System(string reply) {
    if (NoConnection()) return;
    string s;
    s = "*SYSTEM ";
    s = s + "Code";
    s = s + " = [";
    s = s + reply;
    s = s + " ";
    s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_Download(string file) {
    if (NoConnection()) return;
    string s = "*DOWNLOAD ";
    s = s + "file";
    s = s + " = [";
    s = s + file;
    s = s + " ";
    s = s + "] ";
    s = s + "*";
    PG_Send(NodeSocket, s);
}


void Send_Profits(int rule, int operation, datetime fromdate, datetime todate) {

    if (NoConnection()) return;
    if (fromdate > todate) todate = CurrentTime;

    datetime StartDate;
    datetime LastOrderCloseTime = 0;
    datetime PStartDate = -1;

    int xtotal = OrdersHistoryTotal();

    datetime RuleEndDate = 0;
    double RuleProfit = 0;
    double RuleBuyProfit = 0;
    double RuleSellProfit = 0;
    double RuleBuyNbrLots = 0;
    double RuleSellNbrLots = 0;
    int RuleBuyNbrTrade = 0;
    int RuleSellNbrTrade = 0;
    string sComment = "";
    int slpos, tppos, spos;

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

            if (Rule2Int(B_ReadSInfo(sComment, spos + 10, 1)) == rule && StrToInteger(B_ReadSInfo(sComment, spos + 11, 1)) == operation) {

                StartDate = StrToDouble(B_ReadSInfo(sComment, spos, 10));
                if (StartDate < fromdate || StartDate > todate) continue;

                if (PStartDate != StartDate) {
                    if (PStartDate != -1) {
                        Send_Profit(rule, operation, PStartDate, LastOrderCloseTime, RuleProfit, RuleBuyProfit, RuleSellProfit, RuleBuyNbrLots, RuleSellNbrLots, RuleBuyNbrTrade, RuleSellNbrTrade);
                        LastOrderCloseTime = 0;
                        RuleProfit = 0;
                        RuleBuyProfit = 0;
                        RuleSellProfit = 0;
                        RuleBuyNbrLots = 0;
                        RuleSellNbrLots = 0;
                        RuleBuyNbrTrade = 0;
                        RuleSellNbrTrade = 0;

                    }
                    PStartDate = StartDate;
                }

                if (OrderCloseTime() > LastOrderCloseTime)
                    LastOrderCloseTime = OrderCloseTime();

                RuleProfit += OrderProfit();

                if (OrderType() == OP_BUY) {
                    RuleBuyNbrTrade++;
                    RuleBuyNbrLots += OrderLots();
                    RuleBuyProfit += OrderProfit();
                } else
                if (OrderType() == OP_SELL) {
                    RuleSellNbrTrade++;
                    RuleSellNbrLots += OrderLots();
                    RuleSellProfit += OrderProfit();
                }

            }
        }
    }
    if (LastOrderCloseTime != 0)
        Send_Profit(rule, operation, PStartDate, LastOrderCloseTime, RuleProfit, RuleBuyProfit, RuleSellProfit, RuleBuyNbrLots, RuleSellNbrLots, RuleBuyNbrTrade, RuleSellNbrTrade);

}

void Send_Properties() {

    if (NoConnection()) return;
    string s = "*SET_PROPERTIES ";
    for (int i = 0; i < ArraySize(PropertyName); i++) {
        s = s + PropertyName[i];
        s = s + " = [";
        s = s + Get_Property(PropertyName[i]);
        s = s + "] ";
    }
    s = s + "*";
    PG_Send(NodeSocket, s);
}

void Send_Close() {

    if (NoConnection()) return;
    string s = "*CLOSE *";
    PG_Send(NodeSocket, s);
}

void SetProperty(string Name, string Value) {
    int result = Set_Property(Name, Value);

    if (Name != "News")
        if (result == 0)
            Send_Operation(Name + " set to " + Value);
        else
            Send_Operation("Property " + Name + " not found !");
    else {
        if (StringToBoolean(Value) == false && result == 0)
            Send_Operation("Property " + Name + " set to " + Value);
    }
}

int Set_Property(string Name, string Value) {
    //	if (Name == "News")                { News       = StringToBoolean (Value);  if (News == true) return (LoadNews()); else {if (!Panel_Window) News_DeleteGraphics(NewsMax); return(0);} }              
    //   if (Name == "Sound")               { Sound      = TreatSoundFlag (StrToInteger (Value)); Print (Value);   return(0);}

    if (Name == "GraphicMode") {
        GraphicMode = StringToBoolean(Value);
        if (GraphicMode == true) InitGraphics();
        else DeleteGraphics();
        return (0);
    }
    if (Name == "GraphicMainPanel") {
        GraphicMainPanel = StringToBoolean(Value);
        if (GraphicMainPanel == true) MainPanel_InitGraphics(right_up_corner);
        else MainPanel_DeleteGraphics();
        return (0);
    }
    if (Name == "Comment") {
        GlobalComment = StringToBoolean(Value);
        if (GlobalComment == false) Comment("");
        return (0);
    }

    if (Name == "SuspendAll") {
        SuspendAll = StringToBoolean(Value);
        return (0);
    }
    if (Name == "ResumeAll") {
        ResumeAll = StringToBoolean(Value);
        return (0);
    }

    if (Name == "CloseNowAll") {
        CloseNowAll = StringToBoolean(Value);
        return (0);
    }
    if (Name == "CloseNowBuy") {
        CloseNowBuy = StringToBoolean(Value);
        return (0);
    }
    if (Name == "CloseNowSell") {
        CloseNowSell = StringToBoolean(Value);
        return (0);
    }

    if (Name == "FileTrace") {
        FileTrace = StringToBoolean(Value);
        return (0);
    }
    if (Name == "DistantTrace") {
        DistantTrace = StringToBoolean(Value);
        return (0);
    }
    if (Name == "ShellTrace") {
        ShellTrace = StringToBoolean(Value);
        return (0);
    }
    if (Name == "Port") {
        CPort = StrToInteger(Value);
        return (0);
    }
    if (Name == "Server") {
        CServer = Value;
        return (0);
    }
    if (Name == "Lots") {
        Lots = StrToDouble(Value);
        return (0);
    }

    if (Name == "B_EndSessions") {
        EndSessions = StringToBoolean(Value);
        return (0);
    }
    return (-1);
}

string Get_Property(string Name) {

    if (Name == "News") {
        return (BooleanToString(News));
    }
    if (Name == "Sound") {
        return (DoubleToString(GetSoundValue(), 0));
    }

    if (Name == "GraphicMode") {
        return (BooleanToString(GraphicMode));
    }
    if (Name == "GraphicMainPanel") {
        return (BooleanToString(GraphicMainPanel));
    }
    if (Name == "Comment") {
        return (BooleanToString(GlobalComment));
    }

    if (Name == "CloseNowAll") {
        return (BooleanToString(CloseNowAll));
    }
    if (Name == "CloseNowBuy") {
        return (BooleanToString(CloseNowBuy));
    }
    if (Name == "CloseNowSell") {
        return (BooleanToString(CloseNowSell));
    }

    if (Name == "FileTrace") {
        return (BooleanToString(FileTrace));
    }
    if (Name == "DistantTrace") {
        return (BooleanToString(DistantTrace));
    }
    if (Name == "ShellTrace") {
        return (BooleanToString(ShellTrace));
    }
    if (Name == "Port") {
        return (DoubleToString(CPort, 0));
    }
    if (Name == "Server") {
        return (CServer);
    }
    if (Name == "Lots") {
        return (DoubleToString(Lots, 2));
    }

    if (Name == "B_EndSessions") {
        return (BooleanToString(EndSessions));
    }
    return "";
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

void CalculateGAverage() {
    int cnt, total;
    double price = 0;
    double profit = 0;
    double t_nbrlots = 0;

    total = OrdersTotal();

    if (total == 0)
        return;

    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);

        if (OrderType() <= OP_SELL && OrderSymbol() == _Symbol) {
            if (OrderType() == OP_BUY) {
                t_nbrlots += OrderLots();
                price += OrderLots() * OrderOpenPrice();
            } else {
                t_nbrlots -= OrderLots();
                price -= OrderLots() * OrderOpenPrice();
            }
            profit += OrderProfit();
        }
    }
    if (t_nbrlots != 0) {

        AveragePoint = price / t_nbrlots;
    } else
        AveragePoint = -1;
    AccountTotalProfit = profit;
    AccountTotalNbrLots = t_nbrlots;
    return;
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

int CloseOrders(int MagicNumber = -1, int Operation = -1, double NbrLots = -1, double FromPrice = -1, int Mode = -1, int Pending = -1) {
    int cnt, total, xcnt;
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

void ReloadAlerts() {
    int result = LoadAlerts();
    if (result == -1)
        Send_Operation("Alerts can not be reloaded");
    else {
        A_NbrAlert = result;
        Send_Operation("Alerts Filter is set");
    }
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

void ReloadSchedules() {
    ResetSchedules();
    int result = LoadSchedules(); // loadengines
    if (result == -1)
        Send_Operation("Engines Scheduler can not be reloaded");
    else
        Send_Operation("Engines Scheduler is set");
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

void ReadFlagEngines() {
    int engine = 0;
    int operation = 0;

    int file = FileOpen("PG_EngineFlags_" + SYS_SYMBOL, FILE_READ | FILE_CSV, "*");
    if (file == -1) return;

    if (FileSize(file) != 0) {
        while (!FileIsEnding(file)) {
            string s_info = "";
            string s_info1 = "";
            s_info = FileReadString(file);
            s_info1 = FileReadString(file);

            ReadEngineFlag(engine, s_info, s_info1);
            engine++;
            if (engine == E_NbrEngine) break;
        }
    }
    FileClose(file);
}

void SaveFlagEngines() {
    int file = FileOpen("PG_EngineFlags_" + SYS_SYMBOL, FILE_WRITE | FILE_BIN);
    if (file == -1) return;

    for (int i = 0; i < E_NbrEngine; i++) {
        string s_info = SaveEngineFlag(i);
        FileWriteString(file, s_info, StringLen(s_info));
    }
    FileClose(file);
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



void SuspendAllEngines(bool operation) {
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false)
            B_SuspendSession(i, operation);
}

void TreatEngines() {
    B_start1();

    int k = 0;
    bool startauto;
    for (int i = 0; i < B_MaxSessions; i++)
        if (B_FreeSession[i] == false) {
            int engine = GetEngine(B_StartOnRule[i], B_Operation[i]);
            if (engine == -1) {
                engine = EngineManual;
                startauto = false;
                Send_Data(i, -1);
            } else {
                startauto = AndE(engine, B_STARTAUTOMATIC);
                Send_Data(i, -1, engine);
            }

            Send_Command(k, i, engine, startauto, B_BuyProfit[i], B_SellProfit[i], B_SessionProfit[i], B_ReturnClosedProfitFromRule(i), B_BuyNbrTrade[i], B_SellNbrTrade[i], B_BuyNbrLots[i] + B_BuyHedgeNbrLots[i], B_SellNbrLots[i] + B_SellHedgeNbrLots[i],
                B_HedgeType[i], B_BuyHedgeProfit[i], B_SellHedgeProfit[i], B_BuyAveragePoint[i], B_SellAveragePoint[i], B_Min[i], B_Max[i]);
            Send_Session(i);
            k++;
        }
    Send_Command(k, -1, -1, 0, 0, 0, B_TotalProfit + B_TotalHedgeProfit, B_TotalClosedProfit, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); // finished
    //Send_Data ();

}
////////////////////////////////////////////////////////////////////////////////////////////////////////

void TreatSignal(int Object, int Signal, int periode, double Value) {
    double elapsed_time = TimeCurrent() - STime(Object, Signal, periode);

    if (SignalFilterTabTime[Object][Signal][periode] == 0) return;
    if ((Object == UPFRACTAL && Signal == S_TARGET && Get_Signal(UPFRACTAL, S_ABOVE, periode)) ||
        (Object == DOWNFRACTAL && Signal == S_TARGET && Get_Signal(DOWNFRACTAL, S_BELOW, periode))) {
        if (elapsed_time == 0 || elapsed_time >= SignalFilterTabTime[Object][Signal][periode])
            if (MathMod(elapsed_time, SignalFilterTabTime[Object][Signal][periode]) == 0)
                Send_Signal_Value(Object, Signal);
    } else
    if (Signal != S_TARGET) {
        if (elapsed_time == 0 || elapsed_time >= SignalFilterTabTime[Object][Signal][periode])
            if (MathMod(elapsed_time, SignalFilterTabTime[Object][Signal][periode]) == 0) {
                Send_Signal_Value(Object, Signal);
            }
    }
}

void TreatSignals() {
    for (int i = 0; i < O_NbrObject; i++) {
        int j = ObjId[i];
        if (GetSignalFilter(j, 0, 0) == 1) {
            switch (ObjType[i]) {
            case CUSTOM_TYPE:
                {
                     if (ObjDisplayType[i] == BULLBEAR_TYPE) {
                        Send_Signal(j, S_BEAR);
                        Send_Signal(j, S_BULL);
                    } else {
                        Send_Signal_Value(j, S_CURRENT, _Digits);
                        Send_Signal(j, S_ABOVE);
                        Send_Signal(j, S_BELOW);
                        Send_Signal(j, S_TOUCHED);
                        Send_Signal(j, S_UP);
                        Send_Signal(j, S_DOWN);
                        Send_Signal(j, S_SIDEWAY);
                    }
                }
                break;
            case MA_TYPE:
                {
                    Send_Signal_Value(j, S_ANGLE, 2);
                    Send_Signal(j, S_ABOVE);
                    Send_Signal(j, S_BELOW);
                    Send_Signal(j, S_TOUCHED);
                    Send_Signal(j, S_UP);
                    Send_Signal(j, S_DOWN);
                    Send_Signal(j, S_SIDEWAY);
                }
                break;
            case BOLLINGER_TYPE:
            case RSI_TYPE:
            case CCI_TYPE:
            case ADX_TYPE:
            case WPR_TYPE:
            case STOCHASTIC_TYPE:
            case ATR_TYPE:
            case MACD_TYPE:
            case SAR_TYPE:
            case ICHIMOKU_TYPE:
                {
                    Send_Signal_Value(j, S_CURRENT, _Digits);
                    Send_Signal(j, S_ABOVE);
                    Send_Signal(j, S_BELOW);
                    Send_Signal(j, S_TOUCHED);
                    Send_Signal(j, S_UP);
                    Send_Signal(j, S_DOWN);
                    Send_Signal(j, S_SIDEWAY);
                }
                break;
            case PREDEFINED_TYPE:
                if (j == PROGRESS) {
                    Send_Signal(j, S_BUY);
                    Send_Signal(j, S_SELL);
                    Send_Signal(j, S_EXIT_BUY);
                    Send_Signal(j, S_EXIT_SELL);
                    Send_Signal_Time(j, S_EXIT_BUY);
                    Send_Signal_Time(j, S_EXIT_SELL);
                    Send_Signal_Time(j, S_BUY);
                    Send_Signal_Time(j, S_SELL);                    
                    Send_Signal(j, S_BEAR);
                    Send_Signal(j, S_BULL);
                } else
                if (j == HEIKEN_ASHI) {
                    Send_Signal_Value(j, S_NBRBARS);
                    Send_Signal(j, S_BEAR);
                    Send_Signal(j, S_BULL);
                } else
                if (j == UPFRACTAL || j == DOWNFRACTAL || j == RESISTANCE || j == SUPPORT) {
                    Send_Signal_Value(j, S_NBRBARS);
                    Send_Signal_Value(j, S_TARGET, _Digits);
                    Send_Signal(j, S_ABOVE);
                    Send_Signal(j, S_BELOW);
                    Send_Signal(j, S_TOUCHED);
                    Send_Signal(j, S_RANGE);
                    Send_Signal(j, S_UP);
                    Send_Signal(j, S_DOWN);
                    Send_Signal(j, S_SIDEWAY);
                } else
                if (j == PIVOT_RESISTANCE2 || j == PIVOT_RESISTANCE1 || j == PIVOT_RESISTANCE || j == PIVOT_POINT ||
                    j == PIVOT_SUPPORT2 || j == PIVOT_SUPPORT1 || j == PIVOT_SUPPORT || j == PIVOT_LOW || j == PIVOT_HIGH) {
                    Send_Signal_Value(j, S_DISTANCE,_Digits);
                    Send_Signal(j, S_ABOVE);
                    Send_Signal(j, S_BELOW);
                    Send_Signal(j, S_TOUCHED);
                    Send_Signal(j, S_CROSS_UP);
                    Send_Signal(j, S_CROSS_DOWN);
                    Send_Signal(j, S_REVERSE_UP);
                    Send_Signal(j, S_REVERSE_DOWN);
                } else
                if (j == FIBOLEVEL || j == FIBOSTOPLOSSLEVEL) {
                    Send_Signal_Value(j, S_DISTANCE,_Digits);
                    Send_Signal(j, S_BEAR);
                    Send_Signal(j, S_BULL);
                    Send_Signal(j, S_CROSS_UP);
                    Send_Signal(j, S_CROSS_DOWN);
                } else
                if (j == HIGH || j == OPEN || j == LOW || j == CLOSE) {
                    Send_Signal_Value(j, S_NBRBARS);
                    Send_Signal(j, S_ABOVE);
                    Send_Signal(j, S_BELOW);
                    Send_Signal(j, S_TOUCHED);
                    Send_Signal(j, S_UP);
                    Send_Signal(j, S_DOWN);
                    Send_Signal(j, S_SIDEWAY);
                    Send_Signal(j, S_CROSS_UP);
                    Send_Signal(j, S_CROSS_DOWN);
                    Send_Signal(j, S_REVERSE_UP);
                    Send_Signal(j, S_REVERSE_DOWN);

                } else
                if (j == NEWS) {
                    Send_Signal(j, S_ALERT);
                    Send_Signal_Value(j, S_ALERT);
                } else
                if (j == BAR) {
                    Send_Signal(j, S_BULL_HAMMER);
                    Send_Signal(j, S_BULL_HAMMER1);
                    Send_Signal(j, S_BULL_HAMMER2);
                    Send_Signal(j, S_BULL_ENGULFING);
                    Send_Signal(j, S_BULL_HARAMI);
                    Send_Signal(j, S_BULL_INVERTED_HAMMER);
                    Send_Signal(j, S_BULL_INVERTED_HAMMER1);
                    Send_Signal(j, S_BULL_INVERTED_HAMMER2);
                    Send_Signal(j, S_BULL_PIERCING_LINE);
                    Send_Signal(j, S_BULL_MORNING_STAR);
                    Send_Signal(j, S_BULL_MORNING_DOJI_STAR);
                    Send_Signal(j, S_BULL_THREE_WHITE_SOLDIERS);
                    Send_Signal(j, S_BULL_THREE_INSIDE_UP);
                    Send_Signal(j, S_BULL_THREE_OUTSIDE_UP);
                    Send_Signal(j, S_BEAR_HANGING_MAN);
                    Send_Signal(j, S_BEAR_HANGING_MAN1);
                    Send_Signal(j, S_BEAR_HANGING_MAN2);
                    Send_Signal(j, S_BEAR_ENGULFING);
                    Send_Signal(j, S_BEAR_HARAMI);
                    Send_Signal(j, S_BEAR_SHOOTING_STAR);
                    Send_Signal(j, S_BEAR_SHOOTING_STAR1);
                    Send_Signal(j, S_BEAR_SHOOTING_STAR2);
                    Send_Signal(j, S_BEAR_DARK_CLOUD_COVER);
                    Send_Signal(j, S_BEAR_EVENING_STAR);
                    Send_Signal(j, S_BEAR_EVENING_DOJI_STAR);
                    Send_Signal(j, S_BEAR_THREE_BLACK_CROWS);
                    Send_Signal(j, S_BEAR_THREE_INSIDE_DOWN);
                    Send_Signal(j, S_BEAR_THREE_OUTSIDE_DOWN);
                    Send_Signal(j, S_BEAR);
                    Send_Signal(j, S_BULL);
                    Send_Signal(j, S_SIDEWAY);
                } else
                if (j == VOLUME || j == VOLUME_DOWN || j == VOLUME_UP) {
                    Send_Signal_Value(j, S_CURRENT);
                    Send_Signal(j, S_UP);
                    Send_Signal(j, S_DOWN);
                    Send_Signal(j, S_SIDEWAY);
                    Send_Signal(j, S_BEAR);
                    Send_Signal(j, S_BULL);
                } else {
                    Send_Signal_Value(j, S_CURRENT);
                }
                break;
            case SYSTEM_TYPE:
                {
                    Send_Signal(j, S_EXIT_BUY);
                    Send_Signal(j, S_EXIT_SELL);
                    Send_Signal(j, S_BUY);
                    Send_Signal(j, S_SELL);
                    Send_Signal(j, S_BEAR);
                    Send_Signal(j, S_BULL);

                }
                break;

            }
        }
    }

    /*
       for (int i = 0; i < O_NbrObject; i++)
          for (int j = 0; j < NBR_SIGNALS; j++)   
             for (int x = 0; x < NBR_PERIODS; x++)
                if (GetSignalFilter(i, j, x) == 1 && AndS(i, j, x) != 0)
                {
                   TreatSignal (i, j, x, SValue (i, j, x));
                }
     */
}
void TreatAlerts() {
    double pos;
    int periods[NBR_PERIODS];
    bool flag;
    int AlertResult = 0;

    for (int i = 0; i < A_NbrAlert; i++) {
        int AlertId     = AlertId[i];
        int Logical     = AlertLogic[i];
        int periode     = AlertPeriod[i];
        int Object      = AlertObject[i];
        int Signal      = AlertSignal[i];
        int Not         = AlertNot[i];
        int Prev        = AlertPrev[i];
        int Type        = AlertType[i];
        int Op          = AlertOp[i];
        double Value    = AlertValue[i];

        int cperiod = CurrentPeriod;
        int cbar = 0;
        int vperiod;

        flag = false;
        AlertResult = 0;

        for (int k = 0; k < NBR_PERIODS; k++) {
            if (periode & (1 << k)) {
                vperiod = k;
                periods[k] = k;
                cperiod = MathMax(cperiod, k);
            }
            else periods[k] = -1;
       }

        if (Logical == AND_OP) {
            string sfor = " for Periods ";
            switch (Op) {
                case ANDOR_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = AndPS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                            else {
                                if (!(AlertResult = AndS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            } 
                        else
                            if (Prev) {
                                if (AlertResult = AndPS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                                    flag = true;
                            } 
                            else {
                                if (AlertResult = AndS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                                    flag = true;
                            } 
                    else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = AndBS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndBS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } 
                    else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = AndTS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndTS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
                break;
                case LESSEQ_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = AndPV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = AndV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = AndPV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = AndV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = AndBV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndBV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = AndTV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndTV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                    break;
                case LESS_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = AndPV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = AndV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = AndPV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = AndV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = AndBV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndBV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = AndTV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndTV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case EQ_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = AndPV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = AndV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = AndPV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = AndV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = AndBV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndBV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = AndTV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndTV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case BIG_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = AndPV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = AndV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = AndPV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = AndV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = AndBV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndBV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = AndTV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndTV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case BIGEQ_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = AndPV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = AndV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = AndPV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = AndV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = AndBV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndBV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = AndTV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = AndTV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
            }

        } else
        if (Logical == OR_OP) {

            sfor = " Periods ";
            switch (Op) {

                case ANDOR_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = OrPS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = OrS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = OrPS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = OrS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = OrBS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrBS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = OrTS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrTS(Object, Signal, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
                break;
                case LESSEQ_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = OrPV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = OrV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = OrPV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = OrV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
    
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = OrBV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrBV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = OrTV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrTV_LEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case LESS_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = OrPV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = OrV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = OrPV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = OrV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = OrBV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrBV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = OrTV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrTV_L(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case EQ_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = OrPV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = OrV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = OrPV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = OrV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = OrBV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrBV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = OrTV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrTV_Eq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case BIG_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = OrPV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = OrV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = OrPV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = OrV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = OrBV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrBV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = OrTV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrTV_G(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
    
                break;
                case BIGEQ_OP:
                    if (Type == TYPE_NORMAL)
                        if (Not)
                            if (Prev) {
                                if (!(AlertResult = OrPV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                    flag = true;
                                    AlertResult = periode;
                                }
                            }
                    else {
                        if (!(AlertResult = OrV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                            flag = true;
                            AlertResult = periode;
                        }
                    } else
                    if (Prev) {
                        if (AlertResult = OrPV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else {
                        if (AlertResult = OrV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_BAR)
                        if (Not) {
                            if (!(AlertResult = OrBV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrBV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    } else
                    if (Type == TYPE_TICK)
                        if (Not) {
                            if (!(AlertResult = OrTV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))) {
                                flag = true;
                                AlertResult = periode;
                            }
                        }
                    else {
                        if (AlertResult = OrTV_GEq(Object, Signal, Value, periods[0], periods[1], periods[2], periods[3], periods[4], periods[5], periods[6], periods[7], periods[8]))
                            flag = true;
                    }
                break;
            }

        }

        if (!flag) {
            AlertTime[i] = 0;
            AlertMinTime[i] = 0;
            AlertLast[i] = 0;
            continue;
        }
        
        if (AlertGraphic[i]) {

            if (AlertGraphicFrom[i] == FROM_BID) pos = LastClose[cbar][cperiod] + (AlertGraphicDistance[i] * SYS_POINT);
            else
            if (AlertGraphicFrom[i] == FROM_HIGH) pos = LastHigh[cbar][cperiod] + (AlertGraphicDistance[i] * SYS_POINT);
            else
                pos = LastLow[cbar][cperiod] + (AlertGraphicDistance[i] * SYS_POINT);

            string ObjName = ObjectId2Name(Object);
            ObjectCreate("Alert_" + ObjName + "_ " + SignalName[Signal] + periode + Op, OBJ_TEXT, 0, 0, 0, 0);
            ObjectSet("Alert_" + ObjName + "_ " + SignalName[Signal] + periode + Op, OBJPROP_PRICE1, pos + (AlertGraphicDistance[i] * SYS_POINT));
            ObjectSet("Alert_" + ObjName + "_ " + SignalName[Signal] + periode + Op, OBJPROP_TIME1, Time[cbar]);
            ObjectSetText("Alert_" + ObjName + "_ " + SignalName[Signal] + periode + Op, CharToString(AlertGraphicCode[i]), AlertGraphicSize[i], "WingDings", AlertGraphicColor[i]);
        }

      
        if (AlertLast[i] != AlertResult) {
            AlertMinTime[i] = 0;
            AlertLast[i] = AlertResult;            
        }
        

        double elapsed_time = TimeCurrent() - AlertTime[i];

        if (elapsed_time >= AlertMinTime[i]) {
            AlertTime[i] = TimeCurrent();
            Send_Alert(_Symbol, AlertId, AlertResult);

            if (AlertResult & P_M1) AlertMinTime[i]  = PERIOD_M1 * 60;  //60 Seconds
            else
            if (AlertResult & P_M5) AlertMinTime[i]  = PERIOD_M5 * 60;
            else
            if (AlertResult & P_M15) AlertMinTime[i] = PERIOD_M15 * 60;
            else
            if (AlertResult & P_M30) AlertMinTime[i] = PERIOD_M30 * 60;
            else
                AlertMinTime[i] = PERIOD_H1 * 60;                          // 1 hour !!!

            if (AlertMail[i])
                Send_Mail(Object, Signal, k, AlertMailFromName[i], AlertMailFromAdress[i], AlertMailToAdress[i], AlertMailCcAdress[i], AlertMailSubject[i], AlertMailContent[i]);

            if (AlertDialog[i])
                Alert(_Symbol, " " + AlertAlertText[i], sfor, GetTextPeriod(periode, 1));
        }
    }
}

/////////////////////////////////////////////////// INDICATOR FILE 

void InitBrokers() {
    for (int i = 0; i < NBR_BROKERS; i++) {
        BrokerName[i] = "";
        BrokerPort[i] = -1;
    }
}

void InitSymbols() {
    for (int i = 0; i < NBR_SYMBOLS; i++) {
        CurrencyName[i] = "";
        CurrencyPName[i] = "";
        CurrencyPort[i] = -1;
    }
}

double divergence(int x, int Method, int F_Period, int S_Period, int F_Price, int S_Price, int mypos) {
    int D_FastPeriod = 7;
    int D_SlowPeriod = 88;

    double maF1, maF2, maS1, maS2;
    double dv1, dv2;

    maF1 = iMA(_Symbol, PeriodIndex[x], F_Period, 0, Method, F_Price, mypos);
    maS1 = iMA(_Symbol, PeriodIndex[x], S_Period, 0, Method, S_Price, mypos);

    dv1 = (maF1 - maS1);

    maF2 = iMA(_Symbol, PeriodIndex[x], F_Period, 0, Method, F_Price, mypos + 1);
    maS2 = iMA(_Symbol, PeriodIndex[x], S_Period, 0, Method, S_Price, mypos + 1);

    dv2 = (maF2 - maS2);

    return (dv1);
}

double MAAngleZero(int EMAPeriod, int shift = 0) {
    int EMAMethod = MODE_SMA; //  MODE_EMA
    int EMAPriceApplied = PRICE_OPEN; // PRICE_MEDIAN
    double AngleTreshold = 0.2;
    int StartEMAShift = 6;
    int EndEMAShift = 0;
    double fEndMA, fStartMA;
    double fAngle, mFactor, dFactor;
    int ShiftDif;

    dFactor = 3.14159 / 180.0;
    mFactor = 10000.0;

    ShiftDif = StartEMAShift - EndEMAShift;
    mFactor /= ShiftDif;

    fEndMA = iMA(NULL, 0, EMAPeriod, shift, EMAMethod, EMAPriceApplied, EndEMAShift);
    fStartMA = iMA(NULL, 0, EMAPeriod, shift, EMAMethod, EMAPriceApplied, StartEMAShift);

    fAngle = mFactor * (fEndMA - fStartMA);

    if (fAngle > AngleTreshold)
        return (fAngle);
    else if (fAngle < -AngleTreshold)
        return (fAngle);
    else return (0);
}

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
         while (iTime(NULL, PeriodIndex[x], 0) && GetHeikenAshi(x, i) > 0) {
             AshiNbrBars += 1;
             i++;
         }
    } else {
        SETSIGNAL(shift, HEIKEN_ASHI, S_CURRENT, x, P_SIGNAL, 0);
        SETSIGNAL(shift, HEIKEN_ASHI, S_DOWN, x, P_SIGNAL);
        SETSIGNAL(shift, HEIKEN_ASHI, S_BEAR, x, P_SIGNAL);

        if (GetHeikenAshi(x, shift + 1) > 0) {
            SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 1);
            SETSIGNAL(shift, HEIKEN_ASHI, S_CHANGED, x, P_SIGNAL);
        }

         while (iTime(NULL, PeriodIndex[x], 0) &&  GetHeikenAshi(x, i) < 0) {
             AshiNbrBars += 1;
             i++;
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
    double ri, re1, re2, re3, ra1, ra2, ra3;
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

double getNearestPivotDistance(int & level) {
    int index = 0;
    double minDistance = 999999;

    for (int i = 0; i < ArraySize(Pivots); i++) {
        if (MathAbs(Close[0] - Pivots[i]) < minDistance) {
            minDistance = MathAbs(Close[0] - Pivots[i]);
            index = i;
        }
    }
    double distance = Close[0] - Pivots[index];
    level = index;
    return (distance);
}

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

void GetFractals() {
    //---- 
    int i = 0;
    for (int j = NBR_PERIODS - 1; j >= P_M15; j--) {
        Fractals[i] = SValue(UPFRACTAL, S_TARGET, j);
        i++;
    }
    for (j = P_M15; j < NBR_PERIODS; j++) {
        Fractals[i] = SValue(DOWNFRACTAL, S_TARGET, j);
        i++;
    }
}

double getNearestFractalDistance(int & level) {
    int index = 0;
    double minDistance = 999999;

    for (int i = 0; i < ArraySize(Fractals); i++) {
        if (MathAbs(Close[0] - Fractals[i]) < minDistance) {
            minDistance = MathAbs(Close[0] - Fractals[i]);
            index = i;
        }
    }
    double distance = Close[0] - Fractals[index];
    level = index;
    return (distance);
}

double getNearestDPivotDistance(double & array[], int & level, int x) {
    int index = 0;
    double minDistance = 999999;

    for (int i = 0; i < 9; i++) {
        if (MathAbs(Close[0] - array[i]) < minDistance) {
            minDistance = MathAbs(Close[0] - array[i]);
            index = i;
        }
    }
    double distance = Close[0] - array[index];
    level = index;
    return (distance);
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

/////////////////////////////////////////////////////GRAPHIC FILE 

void DrawPeriodLabels(int window, int corner, int origin) {
    for (int x = 0; x < NBR_PERIODS; x++) {
        ObjectCreate("period_label" + x + origin, OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("period_label" + x + origin, OBJPROP_CORNER, corner);
        ObjectSet("period_label" + x + origin, OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + 2);
        ObjectSet("period_label" + x + origin, OBJPROP_YDISTANCE, origin);
        if (CurrentPeriod == x)
            ObjectSetText("period_label" + x + origin, PeriodName[x], IndicatorFontSize, IndicatorFont, Red);
        else
            ObjectSetText("period_label" + x + origin, PeriodName[x], IndicatorFontSize, IndicatorFont, IndicatorTextColor);
        ObjectSetInteger(0, "period_label" + x + origin, OBJPROP_SELECTABLE, false);

    }
}

void DeletePeriodLabels() {
    for (int i = ObjectsTotal() - 1; i >= 0; i--) {
        string n = ObjectName(i);
        if (ObjectType(n) != OBJ_LABEL) continue;

        if (StringFind(n, "period_label") != -1) {
            ObjectDelete(n);
        }
    }
}

void DrawSeperators(int window, int corner, int origin) {
    ObjectCreate("separator" + origin, OBJ_LABEL, window, 0, 0, 0, 0);
    ObjectSet("separator" + origin, OBJPROP_CORNER, corner);
    ObjectSet("separator" + origin, OBJPROP_XDISTANCE, 1);
    ObjectSet("separator" + origin, OBJPROP_YDISTANCE, origin);
    ObjectSetText("separator" + origin, "________________________________________________", 7, "Arial", MainPanelSeperatorColor);
    ObjectSetInteger(0, "separator" + origin, OBJPROP_SELECTABLE, false);

}

void DeleteSeperators() {
    for (int i = ObjectsTotal() - 1; i >= 0; i--) {
        string n = ObjectName(i);
        if (ObjectType(n) != OBJ_LABEL) continue;
        if (StringFind(n, "separator") != -1) {
            ObjectDelete(n);
        }
    }
}

void MainPanel_InitGraphics(int corner1) {
    int CurrentPeriod = Period2Int(_Period);

    if (!GraphicMode) return;
    if (!GraphicMainPanel) return;
    // Border Band

    ObjectCreate("system", OBJ_LABEL, 0, 0, 0, 0, 0);
    ObjectSet("system", OBJPROP_CORNER, corner1);
    ObjectSet("system", OBJPROP_XDISTANCE, 58);
    ObjectSet("system", OBJPROP_YDISTANCE, 1);
    ObjectSetInteger(0, "system", OBJPROP_SELECTABLE, false);
    ObjectSetText("system", VER, 12, "Arial Black", White);
    /*  
       ObjectCreate("author", OBJ_LABEL,0,0,0,0,0);
       ObjectSet("author", OBJPROP_CORNER,corner1);
       ObjectSet("author", OBJPROP_XDISTANCE, 73);
       ObjectSet("author", OBJPROP_YDISTANCE, 18);
       ObjectSetText("author", "© By  " +  EA , 8, "Arial", White);
    */
    ObjectCreate("authorline", OBJ_LABEL, 0, 0, 0, 0, 0);
    ObjectSet("authorline", OBJPROP_CORNER, corner1);
    ObjectSet("authorline", OBJPROP_XDISTANCE, 1);
    ObjectSet("authorline", OBJPROP_YDISTANCE, 70);
    ObjectSetInteger(0, "authorline", OBJPROP_SELECTABLE, false);

    ObjectSetText("authorline", "________________________________________________", 7, "Arial", MainPanelSeperatorColor);
    // panel 

    int originy = originY;
    int Y = 0;

    int window = 0;

    for (int x = 0; x < NBR_PERIODS; x++) // position
    {
        originy = originY;
        Y = 0;

        for (int k = 0; k < O_NbrVObject; k++) {
            int y = P_ObjOrder[k];
            if (y == PANEL_END) break;
            if (y == PANEL_SEPARATOR) {
                DrawSeperators(window, corner1, Y * scaleY + offsetY + originy);
                Y++;
                continue;
                // seperator
            }
            if (y == PANEL_FEED) {
                Y++;
                continue;
            }
            if (y == PANEL_PERIODS) {
                DrawPeriodLabels(window, corner1, Y * scaleY + offsetY + 10 + originy);
                Y++;
                continue;
                // periods
            }

            ObjectCreate(ObjName[y] + x, OBJ_LABEL, window, 0, 0, 0, 0);
            ObjectSet(ObjName[y] + x, OBJPROP_CORNER, corner1);
            ObjectSet(ObjName[y] + x, OBJPROP_BACK, true);
            ObjectSet(ObjName[y] + x, OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + originX);
            ObjectSet(ObjName[y] + x, OBJPROP_YDISTANCE, Y * scaleY + offsetY + originy);
            ObjectSetText(ObjName[y] + x, CharToString(IndicatorSymbolCode), ObjectFontSize, "Wingdings", IndicatorBackColor);
            ObjectSetInteger(0, ObjName[y] + x, OBJPROP_SELECTABLE, false);

            ObjectCreate("i" + ObjName[y] + x, OBJ_LABEL, window, 0, 0, 0, 0);
            ObjectSet("i" + ObjName[y] + x, OBJPROP_CORNER, corner1);
            ObjectSet("i" + ObjName[y] + x, OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + originX + 4);
            ObjectSet("i" + ObjName[y] + x, OBJPROP_YDISTANCE, Y * scaleY + offsetY + originy + 5);
            ObjectSetText("i" + ObjName[y] + x, "", ObjectFontSize, "Wingdings", IndicatorBackColor);
            ObjectSetInteger(0, "i" + ObjName[y] + x, OBJPROP_SELECTABLE, false);

            if (ObjType[y] == SAR_TYPE || (ObjType[y] == PREDEFINED_TYPE &&
                    (ObjName[y] == "SUPPORT" || ObjName[y] == "RESISTANCE" || ObjName[y] == "UPFRACTAL" || ObjName[y] == "DOWNFRACTAL" || ObjName[y] == "HEIKEN_ASHI" ||
                        ObjName[y] == "HIGH" || ObjName[y] == "LOW" || ObjName[y] == "CLOSE" || ObjName[y] == "OPEN"))) {
                ObjectCreate(ObjName[y] + x + "NbrBar", OBJ_LABEL, window, 0, 0, 0, 0);
                ObjectSet(ObjName[y] + x + "NbrBar", OBJPROP_CORNER, corner1);
                ObjectSet(ObjName[y] + x + "NbrBar", OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + 7 + originX);
                ObjectSet(ObjName[y] + x + "NbrBar", OBJPROP_YDISTANCE, ObjectGet(ObjName[y] + x, OBJPROP_YDISTANCE) + 7);
                ObjectSetText(ObjName[y] + x + "NbrBar", "0", 8, "Tahoma", White);
                ObjectSetInteger(0, ObjName[y] + x + "NbrBar", OBJPROP_SELECTABLE, false);

            }

            Y++;
        }

    }

    originy = originY;

    // labels
    Y = 0;
    for (k = 0; k < O_NbrVObject; k++) {
        y = P_ObjOrder[k];
        if (y == PANEL_END) break;
        if (y < 0) {
            Y++;
            continue;
        }
        ObjectCreate("object_label_" + y, OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("object_label_" + y, OBJPROP_CORNER, corner1);
        ObjectSet("object_label_" + y, OBJPROP_XDISTANCE, offsetX - 30 + originX);
        ObjectSet("object_label_" + y, OBJPROP_YDISTANCE, Y * scaleY + offsetY + 8 + originy);
        ObjectSetText("object_label_" + y, P_ObjName[y], IndicatorFontSize, IndicatorFont, IndicatorTextColor);
        ObjectSetInteger(0, "object_label_" + y, OBJPROP_SELECTABLE, false);

        Y++;
    }
    /*    
       int h = 1;
       int height1 = 1;
       for (int b = 0; b < 8; b++)
       {  
          ObjectCreate("z1background_v" + b, OBJ_LABEL,0,0,0,0,0);
          ObjectSet("z1background_v"+ b, OBJPROP_CORNER,corner1);
          ObjectSet("z1background_v"+ b, OBJPROP_XDISTANCE, 1);
          ObjectSet("z1background_v"+ b, OBJPROP_YDISTANCE, h);
          ObjectSet("z1background_v"+ b, OBJPROP_BACK, true);
          ObjectSetText("z1background_v"+ b, "g" , 180, "Webdings", MainPanelBckColor);
          h += 200;
       }      
    */

}

void MainPanel_ShowiObject(int y, int x, bool show) {
    if (show) {
        ObjectSet("i" + ObjName[y] + x, OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + originX + 4);
    } else {
        ObjectSet("i" + ObjName[y] + x, OBJPROP_XDISTANCE, 2000);
    }

}

void MainPanel_ShowObject(int y, int x, bool show) {
    if (show) {
        ObjectSet(ObjName[y] + x, OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + originX);
    } else {
        ObjectSet(ObjName[y] + x, OBJPROP_XDISTANCE, 2000);
    }
}

void MainPanel_DrawGraphics() // cross is different for every period we will work only on M1;
{
    if (!GraphicMode) return;

    // INFO INDICATOR    
    Info_DrawGraphics(0, 1);

    for (int x = 0; x < NBR_PERIODS; x++) {
        for (int z = 0; z < O_NbrVObject; z++) {
            int k = P_ObjOrder[z];
            if (k < 0) continue;
            int i = ObjId[k];
            if (AndS(i, S_EXT_OVERBOUGHT, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_EXT_OVERBOUGHT]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_EXT_OVERBOUGHT), ObjectFontSize, "Wingdings", SignalColor[S_EXT_OVERBOUGHT]);
            } else
            if (AndS(i, S_EXT_OVERSOLD, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_EXT_OVERSOLD]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_EXT_OVERSOLD), ObjectFontSize, "Wingdings", SignalColor[S_EXT_OVERSOLD]);
            } else
            if (AndS(i, S_OVERBOUGHT, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_OVERBOUGHT]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_OVERBOUGHT), ObjectFontSize, "Wingdings", SignalColor[S_OVERBOUGHT]);
            } else
            if (AndS(i, S_OVERSOLD, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_OVERSOLD]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_OVERSOLD), ObjectFontSize, "Wingdings", SignalColor[S_OVERSOLD]);
            } else
            if (AndS(i, S_TOUCHED, x) != 0) {

                MainPanel_ShowObject(k, x, SignalVisible[S_TOUCHED]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_TOUCHED), ObjectFontSize, "Wingdings", SignalColor[S_TOUCHED]);
            } else
            if (AndS(i, S_ABOVE, x) != 0) {

                MainPanel_ShowObject(k, x, SignalVisible[S_ABOVE]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_ABOVE), ObjectFontSize, "Wingdings", SignalColor[S_ABOVE]);
            } else
            if (AndS(i, S_BELOW, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_BELOW]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_BELOW), ObjectFontSize, "Wingdings", SignalColor[S_BELOW]);
            } else
            if (AndS(i, S_MIDDLE, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_MIDDLE]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_MIDDLE), ObjectFontSize, "Wingdings", SignalColor[S_MIDDLE]);
            } else
            if (AndS(i, S_ALERT, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_ALERT]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_ALERT), ObjectFontSize, "Wingdings", SignalColor[S_ALERT]);
            } else
            if (AndS(i, S_BEAR, x) != 0) {

                MainPanel_ShowObject(k, x, SignalVisible[S_BEAR]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_BEAR), ObjectFontSize, "Wingdings", SignalColor[S_BEAR]);
            } else
            if (AndS(i, S_BULL, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_BULL]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_BULL), ObjectFontSize, "Wingdings", SignalColor[S_BULL]);
            } else
            if (AndS(i, S_VERYSTRONG, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_VERYSTRONG]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_VERYSTRONG), ObjectFontSize, "Wingdings", SignalColor[S_VERYSTRONG]);
            } else
            if (AndS(i, S_STRONG, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_STRONG]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_STRONG), ObjectFontSize, "Wingdings", SignalColor[S_STRONG]);
            } else
            if (AndS(i, S_NEUTRAL, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_NEUTRAL]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_NEUTRAL), ObjectFontSize, "Wingdings", SignalColor[S_NEUTRAL]);
            } else
            if (AndS(i, S_WEAK, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_WEAK]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_WEAK), ObjectFontSize, "Wingdings", SignalColor[S_WEAK]);
            } else
            if (AndS(i, S_VERYWEAK, x) != 0) {
                MainPanel_ShowObject(k, x, SignalVisible[S_VERYWEAK]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_VERYWEAK), ObjectFontSize, "Wingdings", SignalColor[S_VERYWEAK]);
            } else {
                MainPanel_ShowObject(k, x, false);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_NOSIGNAL), ObjectFontSize, "Wingdings", SignalColor_NOSIGNAL);
            }

            //////////////////////////////////////////////////////////////////////////////          
            if (AndS(i, S_RANGE, x) != 0 && SignalVisible[S_RANGE]) {

                MainPanel_ShowObject(k, x, SignalVisible[S_RANGE]);
                ObjectSetText(ObjName[k] + x, CharToString(SymbolCode_RANGE), ObjectFontSize, "Wingdings", SignalColor[S_RANGE]);
            }

            /// ///////////////////////////////////////////////////////////////////////////////         
            if (AndS(i, S_RCROSSED, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_RCROSSED]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_RCROSSED), OrientationFontSize, "Wingdings", SignalColor[S_RCROSSED]);
            } else
            if (AndS(i, S_CROSS_UP, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_CROSS_UP]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_CROSS_UP), OrientationFontSize, "Wingdings", SignalColor[S_CROSS_UP]);
            } else
            if (AndS(i, S_CROSS_DOWN, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_CROSS_DOWN]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_CROSS_DOWN), OrientationFontSize, "Wingdings", SignalColor[S_CROSS_DOWN]);
            } else
            if (AndS(i, S_REVERSE_UP, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_REVERSE_UP]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_REVERSE_UP), OrientationFontSize, "Wingdings", SignalColor[S_REVERSE_UP]);
            } else
            if (AndS(i, S_REVERSE_DOWN, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_REVERSE_DOWN]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_REVERSE_DOWN), OrientationFontSize, "Wingdings", SignalColor[S_REVERSE_DOWN]);
            } else
            if (AndS(i, S_UP, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_UP]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_UP), OrientationFontSize, "Wingdings", SignalColor[S_UP]);
            } else
            if (AndS(i, S_DOWN, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_DOWN]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_DOWN), OrientationFontSize, "Wingdings", SignalColor[S_DOWN]);
            } else
            if (AndS(i, S_BUY, x) != 0 || AndS(i, S_SELL, x) != 0) {
                if (AndS(i, S_BUY, x) != 0 && AndS(i, S_SELL, x) != 0) {

                    MainPanel_ShowiObject(k, x, (SignalVisible[S_BUY] || SignalVisible[S_SELL]));
                    ObjectSetText("i" + ObjName[k] + x, "BS", 8, "Tahoma", SignalColor[S_SIDEWAY]);
                } else
                if (AndS(i, S_BUY, x) != 0) {
                    MainPanel_ShowiObject(k, x, SignalVisible[S_BUY]);
                    ObjectSetText("i" + ObjName[k] + x, "B", 8, "Tahoma", SignalColor[S_BUY]);
                } else
                if (AndS(i, S_SELL, x) != 0) {
                    MainPanel_ShowiObject(k, x, SignalVisible[S_SELL]);
                    ObjectSetText("i" + ObjName[k] + x, "S", 8, "Tahoma", SignalColor[S_SELL]);
                }
            } else
            if (AndS(i, S_EXIT_BUY, x) != 0 || AndS(i, S_EXIT_SELL, x) != 0) {
                if (AndS(i, S_EXIT_BUY, x) != 0 && AndS(i, S_EXIT_SELL, x) != 0) {

                    MainPanel_ShowiObject(k, x, (SignalVisible[S_EXIT_BUY] || SignalVisible[S_EXIT_SELL]));
                    ObjectSetText("i" + ObjName[k] + x, "EBS", 8, "Tahoma", SignalColor[S_SIDEWAY]);
                } else
                if (AndS(i, S_EXIT_BUY, x) != 0) {
                    MainPanel_ShowiObject(k, x, SignalVisible[S_EXIT_BUY]);
                    ObjectSetText("i" + ObjName[k] + x, "EB", 8, "Tahoma", SignalColor[S_BUY]);
                } else
                if (AndS(i, S_EXIT_SELL, x) != 0) {
                    MainPanel_ShowiObject(k, x, SignalVisible[S_EXIT_SELL]);
                    ObjectSetText("i" + ObjName[k] + x, "ES", 8, "Tahoma", SignalColor[S_EXIT_SELL]);
                }
            } else
            if (AndS(i, S_SIDEWAY, x) != 0) {
                MainPanel_ShowiObject(k, x, SignalVisible[S_SIDEWAY]);
                ObjectSetText("i" + ObjName[k] + x, CharToString(SymbolCode_SIDEWAY), OrientationFontSize, "Wingdings", SignalColor[S_SIDEWAY]);
            } else {
                MainPanel_ShowiObject(k, x, false);
            }
            if (ObjType[k] == SAR_TYPE || (ObjType[k] == PREDEFINED_TYPE &&
                    (ObjName[k] == "SUPPORT" || ObjName[k] == "RESISTANCE" || ObjName[k] == "HEIKEN_ASHI" ||
                        ObjName[k] == "UPFRACTAL" || ObjName[k] == "DOWNFRACTAL" ||
                        ObjName[k] == "HIGH" || ObjName[k] == "LOW" || ObjName[k] == "CLOSE" || ObjName[k] == "OPEN"))) {

                if (SignalVisible[S_NBRBARS]) {
                    if (StringLen(DoubleToString(SValue(i, S_NBRBARS, x), 0)) == 2)
                        ObjectSet(ObjName[k] + x + "NbrBar", OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + 5);
                    else
                        ObjectSet(ObjName[k] + x + "NbrBar", OBJPROP_XDISTANCE, ((NBR_PERIODS - 1) - x) * scaleX + offsetX + 7);
                    if (SValue(i, S_NBRBARS, x) >= 0)
                        ObjectSetText(ObjName[k] + x + "NbrBar", DoubleToString(SValue(i, S_NBRBARS, x), 0), 8, "Tahoma", SignalColor[S_NBRBARS]);
                } else
                    ObjectSet(ObjName[k] + x + "NbrBar", OBJPROP_XDISTANCE, 2000);

            }
        }
    }
}

void MainPanel_DeleteGraphics() {
    for (int b = 0; b < 8; b++) {
        ObjectDelete("z1background_v" + b);
    }
    ObjectDelete("system");
    ObjectDelete("author");
    ObjectDelete("authorline");

    for (int x = 0; x < NBR_PERIODS; x++) {
        for (int z = 0; z < NBR_OBJECTS; z++) {
//            int y = P_ObjOrder[z];
//            if (y < 0) continue;
            int y = z;    
            ObjectDelete(ObjName[y] + x);
            ObjectDelete("i" + ObjName[y] + x);
            if (ObjType[y] == SAR_TYPE || (ObjType[y] == PREDEFINED_TYPE &&
                    (ObjName[y] == "SUPPORT" || ObjName[y] == "RESISTANCE" || ObjName[y] == "HEIKEN_ASHI" ||
                        ObjName[y] == "UPFRACTAL" || ObjName[y] == "DOWNFRACTAL" ||
                        ObjName[y] == "HIGH" || ObjName[y] == "LOW" || ObjName[y] == "CLOSE" || ObjName[y] == "OPEN")))
                ObjectDelete(ObjName[y] + x + "NbrBar");
        }
    }
    for (y = 0; y < O_NbrObject; y++)
        ObjectDelete("object_label_" + y);
    DeletePeriodLabels();
    DeleteSeperators();
}


color AssignAnalyseColor(int Analyse) {
    if (Analyse == OP_WAIT)
        return (DeepSkyBlue);
    else return (White);
}

void Patterns_InitGraphics(int x) {

}

void Panel_InitGraphics() {
    int i = 0;
    int CurrentPeriod = Period2Int(_Period);
    if (Panel_Window == 0) return;

    Panel_InitTargets(PanelOriginTargets, 0);
    Panel_InitNews(PanelOriginNews);

}

void Panel_InitNews(int OriginX) {
    int OriginY = 15;
    int corner = 0;
    int offsetX = 0;
    int offset = 0;

    int h = 1;
    string x = "News";
    for (int b = 0; b < 3; b++) {
        ObjectCreate("Panel_line" + b + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("Panel_line" + b + x, OBJPROP_CORNER, 2);
        ObjectSet("Panel_line" + b + x, OBJPROP_XDISTANCE, PanelOriginTargets);
        ObjectSet("Panel_line" + b + x, OBJPROP_YDISTANCE, h);
        ObjectSet("Panel_line" + b + x, OBJPROP_ANGLE, 90);
        ObjectSetText("Panel_line" + b + x, "________________________", 18, "Arial", White);
        ObjectSetInteger(0, "Panel_line" + b + x, OBJPROP_SELECTABLE, false);
        h += 160;
    }

    ObjectCreate("CalendarDate_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarDate_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarDate_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarDate_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarDate_t", "Date", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarDate_t", OBJPROP_SELECTABLE, false);

    offsetX += 80;

    ObjectCreate("CalendarCurr_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarCurr_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarCurr_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarCurr_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarCurr_t", "Currency", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarCurr_t", OBJPROP_SELECTABLE, false);

    offsetX += 50;

    ObjectCreate("CalendarDesc_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarDesc_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarDesc_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarDesc_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarDesc_t", "Description", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarDesc_t", OBJPROP_SELECTABLE, false);

    offsetX += 250;
    ObjectCreate("CalendarImport_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarImport_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarImport_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarImport_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarImport_t", "Importance", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarImport_t", OBJPROP_SELECTABLE, false);

    offsetX += 55;
    ObjectCreate("CalendarActual_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarActual_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarActual_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarActual_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarActual_t", "Actual", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarActual_t", OBJPROP_SELECTABLE, false);

    offsetX += 40;
    ObjectCreate("CalendarForecast_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarForecast_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarForecast_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarForecast_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarForecast_t", "Forecast", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarForecast_t", OBJPROP_SELECTABLE, false);

    offsetX += 40;
    ObjectCreate("CalendarPrevious_t", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("CalendarPrevious_t", OBJPROP_CORNER, corner);
    ObjectSet("CalendarPrevious_t", OBJPROP_XDISTANCE, OriginX + offsetX);
    ObjectSet("CalendarPrevious_t", OBJPROP_YDISTANCE, OriginY - offset);
    ObjectSetText("CalendarPrevious_t", "Previous", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "CalendarPrevious_t", OBJPROP_SELECTABLE, false);

}

void Panel_InitTargets(int origin, int corner = 1) {
    Panel_originY = 15;

    int h = 1;
    string x = "Targets";
    for (int b = 0; b < 3; b++) {
        ObjectCreate("Panel_line" + b + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("Panel_line" + b + x, OBJPROP_CORNER, 2);
        ObjectSet("Panel_line", OBJPROP_BACK, true);
        ObjectSet("Panel_line" + b + x, OBJPROP_XDISTANCE, origin + 3 * PanelWidthTargets);
        ObjectSet("Panel_line" + b + x, OBJPROP_YDISTANCE, h);
        ObjectSet("Panel_line" + b + x, OBJPROP_ANGLE, 90);
        ObjectSetText("Panel_line" + b + x, "________________________", 18, "Arial", White);
        ObjectSetInteger(0, "Panel_line" + b + x, OBJPROP_SELECTABLE, false);

        h += 160;
    }
    origin += Panel_offsetX;
    ObjectCreate("panel_dpivot", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("panel_dpivot", OBJPROP_BACK, true);
    ObjectSet("panel_dpivot", OBJPROP_CORNER, corner);
    ObjectSet("panel_dpivot", OBJPROP_XDISTANCE, origin + 2 * PanelWidthTargets);
    ObjectSet("panel_dpivot", OBJPROP_YDISTANCE, Panel_originY);
    ObjectSetText("panel_dpivot", "D1 Pivot", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "panel_dpivot", OBJPROP_SELECTABLE, false);

    ObjectCreate("panel_wpivot", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("panel_wpivot", OBJPROP_BACK, true);
    ObjectSet("panel_wpivot", OBJPROP_CORNER, corner);
    ObjectSet("panel_wpivot", OBJPROP_XDISTANCE, origin + PanelWidthTargets);
    ObjectSet("panel_wpivot", OBJPROP_YDISTANCE, Panel_originY);
    ObjectSetText("panel_wpivot", "W1 Pivot", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "panel_wpivot", OBJPROP_SELECTABLE, false);

    ObjectCreate("panel_mpivot", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("panel_mpivot", OBJPROP_BACK, true);
    ObjectSet("panel_mpivot", OBJPROP_CORNER, corner);
    ObjectSet("panel_mpivot", OBJPROP_XDISTANCE, origin);
    ObjectSet("panel_mpivot", OBJPROP_YDISTANCE, Panel_originY);
    ObjectSetText("panel_mpivot", "MN Pivot", PanelFontSize, PanelFont, PanelTextColor);
    ObjectSetInteger(0, "panel_mpivot", OBJPROP_SELECTABLE, false);

}

void Panel_DrawFiboLevel(int x, double fblevel, int origin, int level, int corner) {
    string sname;
    color co;

    if (AndS(FIBOLEVEL, S_BULL, x)) {
        co = PaleGreen;
        sname = "Buy L";
    } else {
        co = Pink;
        sname = "Sell L";
    }

    ObjectDelete("fibo_level_t" + x);
    ObjectCreate("fibo_level_t" + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("fibo_level_t" + x, OBJPROP_BACK, true);
    ObjectSet("fibo_level_t" + x, OBJPROP_CORNER, corner);
    ObjectSet("fibo_level_t" + x, OBJPROP_XDISTANCE, origin);
    ObjectSet("fibo_level_t" + x, OBJPROP_YDISTANCE, level);
    ObjectSetText("fibo_level_t" + x, sname, PanelFontSize, PanelFont, co);
    ObjectSetInteger(0, "fibo_level_t" + x, OBJPROP_SELECTABLE, false);

    ObjectDelete("fibo_level" + x);
    ObjectCreate("fibo_level" + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("fibo_level" + x, OBJPROP_BACK, true);
    ObjectSet("fibo_level" + x, OBJPROP_CORNER, corner);
    ObjectSet("fibo_level" + x, OBJPROP_XDISTANCE, origin + 20 + Panel_offsetX);
    ObjectSet("fibo_level" + x, OBJPROP_YDISTANCE, level);
    ObjectSetText("fibo_level" + x, DoubleToString(fblevel, _Digits), PanelFontSize, PanelFont, co);
    ObjectSetInteger(0, "fibo_level" + x, OBJPROP_SELECTABLE, false);

}

void Panel_DrawFiboStopLoss(int x, double fbstoploss, int origin, int level, int corner) {
    string sname;
    color co;

    if (AndS(FIBOLEVEL, S_BULL, x)) {
        co = PaleGreen;
        sname = "SL";
    } else {
        co = Pink;
        sname = "SL";
    }

    ObjectDelete("fibo_stoploss_t" + x);
    ObjectCreate("fibo_stoploss_t" + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("fibo_stoploss_t" + x, OBJPROP_BACK, true);
    ObjectSet("fibo_stoploss_t" + x, OBJPROP_CORNER, corner);
    ObjectSet("fibo_stoploss_t" + x, OBJPROP_XDISTANCE, origin);
    ObjectSet("fibo_stoploss_t" + x, OBJPROP_YDISTANCE, level);
    ObjectSetText("fibo_stoploss_t" + x, sname, PanelFontSize, PanelFont, co);
    ObjectSetInteger(0, "fibo_stoploss_t" + x, OBJPROP_SELECTABLE, false);

    ObjectDelete("fibo_stoploss" + x);
    ObjectCreate("fibo_stoploss" + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
    ObjectSet("fibo_stoploss" + x, OBJPROP_BACK, true);
    ObjectSet("fibo_stoploss" + x, OBJPROP_CORNER, corner);
    ObjectSet("fibo_stoploss" + x, OBJPROP_XDISTANCE, origin + 20 + Panel_offsetX);
    ObjectSet("fibo_stoploss" + x, OBJPROP_YDISTANCE, level);
    ObjectSetText("fibo_stoploss" + x, DoubleToString(fbstoploss, _Digits), PanelFontSize, PanelFont, co);
    ObjectSetInteger(0, "fibo_stoploss" + x, OBJPROP_SELECTABLE, false);

}

void Panel_DrawDTargets(int x, int nearestpos, int ypos, int origin, int corner, int dist) {
    Panel_originY = ypos;
    Panel_offsetY = 10;
    Panel_offsetX = 10;

    int nearestlevel;

    int level = 0;
    double PPoint[NBR_PERIODS];

    string sname = "";
    color co;
    static int onoffw1 = 0;
    static int onoffmn = 0;
    static int onoffd1 = 0;
    for (int k = 0; k < NBR_PERIODS; k++)
        PPoint[k] = PivotPoints[k][x];

    ArraySort(PPoint, WHOLE_ARRAY, 0, MODE_DESCEND);

    double distance = getNearestDPivotDistance(PPoint, nearestlevel, x);

    bool sl = false;
    bool lv = false;
    double fblevel = SValue(FIBOLEVEL, S_CURRENT, x);
    double fbstoploss = SValue(FIBOSTOPLOSSLEVEL, S_CURRENT, x);

    k = 0;
    for (int i = nearestlevel; i < 9; i++) {
        Panel_originX = origin + dist;

        if (i < 4) {
            if (PPoint[i] == LastHigh[1][x]) {
                if (x == P_D1) sname = "DH";
                else
                if (x == P_W1) sname = "WH";
                else
                if (x == P_MN) sname = "MH";
                co = Green;
            } else {
                if (PPoint[i] == LastResistance[1][x])
                    sname = "Res 1";
                else
                if (PPoint[i] == LastResistance1[1][x])
                    sname = "Res 2";
                else
                if (PPoint[i] == LastResistance2[1][x])
                    sname = "Res 3";
                //             sname = "Res " + DoubleToString(4 - i, 0);
                co = Turquoise;
            }
        } else
        if (i > 4) {
            if (PPoint[i] == LastLow[1][x]) {
                if (x == P_D1) sname = "DL";
                else
                if (x == P_W1) sname = "WL";
                else
                if (x == P_MN) sname = "ML";
                co = Green;
            } else {
                if (PPoint[i] == LastSupport[1][x])
                    sname = "Sup 1";
                else
                if (PPoint[i] == LastSupport1[1][x])
                    sname = "Sup 2";
                else
                if (PPoint[i] == LastSupport2[1][x])
                    sname = "Sup 3";

                //            sname = "Sup " + DoubleToString (i - 4, 0);
                co = Red;
            }
        } else {
            co = Yellow;
            sname = "Pivot";
        }

        ObjectDelete("panel_pivot_t" + x + i);
        ObjectCreate("panel_pivot_t" + x + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_BACK, true);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_CORNER, corner);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_XDISTANCE, Panel_originX);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_YDISTANCE, Panel_originY + level * Panel_offsetY);
        ObjectSetText("panel_pivot_t" + x + i, sname, PanelFontSize, PanelFont, co);
        ObjectSetInteger(0, "panel_pivot_t" + x + i, OBJPROP_SELECTABLE, false);

        Panel_originX += 20;
        ObjectDelete("panel_pivot" + x + i);
        ObjectCreate("panel_pivot" + x + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("panel_pivot" + x + i, OBJPROP_BACK, true);
        ObjectSet("panel_pivot" + x + i, OBJPROP_CORNER, corner);
        ObjectSet("panel_pivot" + x + i, OBJPROP_XDISTANCE, Panel_originX + Panel_offsetX);
        ObjectSet("panel_pivot" + x + i, OBJPROP_YDISTANCE, Panel_originY + level * Panel_offsetY);
        ObjectSetInteger(0, "panel_pivot" + x + i, OBJPROP_SELECTABLE, false);

        if (nearestlevel == i) {
            color c;
            if (distance > 0 && distance < PivotThreshold)
                c = ExtremeBullColor;
            else
            if (distance > 0)
                c = BullColor;
            else
            if (distance < 0 && distance < (-1) * PivotThreshold)
                c = ExtremeBearColor;
            else
            if (distance < 0)
                c = BearColor;
            else
                c = NeutralColor;

            ObjectDelete("panel_pivot_dist" + x);
            ObjectCreate("panel_pivot_dist" + x, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("panel_pivot_dist" + x, OBJPROP_BACK, true);
            ObjectSet("panel_pivot_dist" + x, OBJPROP_CORNER, corner);
            ObjectSet("panel_pivot_dist" + x, OBJPROP_XDISTANCE, Panel_originX + Panel_offsetX + 45);
            ObjectSet("panel_pivot_dist" + x, OBJPROP_YDISTANCE, Panel_originY + level * Panel_offsetY);
            ObjectSetText("panel_pivot_dist" + x, DoubleToString(distance / SYS_POINT, MathMin(_Digits, 0)), PanelFontSize, PanelFont, c);
            ObjectSetInteger(0, "panel_pivot_dist" + x, OBJPROP_SELECTABLE, false);

            if (onoffw1 == 0 && x == P_W1) {
                ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelFont, co);
                onoffw1 = 1;

            } else
            if (onoffw1 == 1 && x == P_W1) {
                ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelBFont, co);
                onoffw1 = 0;
            } else
            if (onoffmn == 0 && x == P_MN) {
                ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelFont, co);
                onoffmn = 1;

            } else
            if (onoffmn == 1 && x == P_MN) {
                ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelBFont, co);
                onoffmn = 0;
            } else
            if (onoffd1 == 0 && x == P_D1) {
                ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelFont, co);
                onoffd1 = 1;

            } else
            if (onoffd1 == 1 && x == P_D1) {
                ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelBFont, co);
                onoffd1 = 0;
            }

        } else
            ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelFont, co);
        level++;
        if (fbstoploss > fblevel) {
            if (((i == 8 || fbstoploss > PPoint[i + 1]) && fbstoploss < PPoint[i]) && !sl) {
                Panel_DrawFiboStopLoss(x, fbstoploss, origin + dist, Panel_originY + level * Panel_offsetY, corner);
                level++;
                sl = true;
            }
            if (((i == 8 || fblevel > PPoint[i + 1]) && fblevel < PPoint[i]) && !lv) {
                Panel_DrawFiboLevel(x, fblevel, origin + dist, Panel_originY + level * Panel_offsetY, corner);
                level++;
                lv = true;
            }
        } else {
            if (((i == 8 || fblevel > PPoint[i + 1]) && fblevel < PPoint[i]) && !lv) {
                Panel_DrawFiboLevel(x, fblevel, origin + dist, Panel_originY + level * Panel_offsetY, corner);
                level++;
                lv = true;
            }
            if (((i == 8 || fbstoploss > PPoint[i + 1]) && fbstoploss < PPoint[i]) && !sl) {
                Panel_DrawFiboStopLoss(x, fbstoploss, origin + dist, Panel_originY + level * Panel_offsetY, corner);
                level++;
                sl = true;
            }
        }
    }

    level = 1;
    for (i = nearestlevel - 1; i >= 0; i--) {
        if (fbstoploss < fblevel) {
            if ((fbstoploss > PPoint[i + 1] && fbstoploss < PPoint[i]) && !sl) {
                Panel_DrawFiboStopLoss(x, fbstoploss, origin + dist, Panel_originY - level * Panel_offsetY, corner);
                level++;
                sl = true;
            }
            if ((fblevel > PPoint[i + 1] && fblevel < PPoint[i]) && !lv) {
                Panel_DrawFiboLevel(x, fblevel, origin + dist, Panel_originY - level * Panel_offsetY, corner);
                level++;
                lv = true;
            }
        } else {
            if ((fblevel > PPoint[i + 1] && fblevel < PPoint[i]) && !lv) {
                Panel_DrawFiboLevel(x, fblevel, origin + dist, Panel_originY - level * Panel_offsetY, corner);
                level++;
                lv = true;
            }
            if ((fbstoploss > PPoint[i + 1] && fbstoploss < PPoint[i]) && !sl) {
                Panel_DrawFiboStopLoss(x, fbstoploss, origin + dist, Panel_originY - level * Panel_offsetY, corner);
                level++;
                sl = true;
            }
        }
        Panel_originX = origin + dist;

        if (i < 4) {
            if (PPoint[i] == LastHigh[1][x]) {
                if (x == P_D1) sname = "DH";
                else
                if (x == P_W1) sname = "WH";
                else
                if (x == P_MN) sname = "MH";
                co = Green;
            } else {
                if (PPoint[i] == LastResistance[1][x])
                    sname = "Res 1";
                else
                if (PPoint[i] == LastResistance1[1][x])
                    sname = "Res 2";
                else
                if (PPoint[i] == LastResistance2[1][x])
                    sname = "Res 3";

                //              sname = "Res " + DoubleToString(4 - i, 0);
                co = Turquoise;
            }
        } else
        if (i > 4) {
            if (PPoint[i] == LastLow[1][x]) {
                if (x == P_D1) sname = "DL";
                else
                if (x == P_W1) sname = "WL";
                else
                if (x == P_MN) sname = "ML";
                co = Green;
            } else {
                if (PPoint[i] == LastSupport[1][x])
                    sname = "Sup 1";
                else
                if (PPoint[i] == LastSupport1[1][x])
                    sname = "Sup 2";
                else
                if (PPoint[i] == LastSupport2[1][x])
                    sname = "Sup 3";

                //            sname = "Sup " + DoubleToString (i - 4, 0);
                co = Red;
            }
        } else {
            co = Yellow;
            sname = "Pivot";
        }

        ObjectDelete("panel_pivot_t" + x + i);
        ObjectCreate("panel_pivot_t" + x + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_BACK, true);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_CORNER, corner);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_XDISTANCE, Panel_originX);
        ObjectSet("panel_pivot_t" + x + i, OBJPROP_YDISTANCE, Panel_originY - level * Panel_offsetY);
        ObjectSetText("panel_pivot_t" + x + i, sname, PanelFontSize, PanelFont, co);
        ObjectSetInteger(0, "panel_pivot_t" + x + i, OBJPROP_SELECTABLE, false);

        Panel_originX += 20;
        ObjectDelete("panel_pivot" + x + i);
        ObjectSet("panel_pivot" + x + i, OBJPROP_BACK, true);
        ObjectCreate("panel_pivot" + x + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("panel_pivot" + x + i, OBJPROP_CORNER, corner);
        ObjectSet("panel_pivot" + x + i, OBJPROP_XDISTANCE, Panel_originX + Panel_offsetX);
        ObjectSet("panel_pivot" + x + i, OBJPROP_YDISTANCE, Panel_originY - level * Panel_offsetY);
        ObjectSetText("panel_pivot" + x + i, DoubleToString(PPoint[i], _Digits), PanelFontSize, PanelFont, co);
        ObjectSetInteger(0, "panel_pivot" + x + i, OBJPROP_SELECTABLE, false);

        level++;
    }
}

void Panel_DrawTargets(int x, int origin, int corner = 1) {
    Panel_originY = 30;
    Panel_offsetY = 10;
    Panel_offsetX = 10;

    int nearestlevel;
    int levelpos;
    color c, co;

    int level = 0;
    string sname = "";
    origin += (2 * PanelWidthTargets);
    origin += Panel_offsetX;

    Panel_DrawDTargets(P_D1, nearestlevel, 90, origin, corner, 0);
    levelpos = Panel_originY + nearestlevel * Panel_offsetY;
    Panel_DrawDTargets(P_W1, nearestlevel, levelpos, origin, corner, -PanelWidthTargets);
    Panel_DrawDTargets(P_MN, nearestlevel, levelpos, origin, corner, -(2 * PanelWidthTargets));
}

void Panel_DrawFractals(int nearestpos, int ypos, int origin, int corner, int dist) {
    Panel_originY = ypos;
    Panel_offsetY = 10;
    Panel_offsetX = 10;

    int nearestlevel;
    color c, co;

    int level = 0;
    string sname = "";
    bool sl = false;
    bool lv = false;

    double distance = getNearestFractalDistance(nearestlevel);

    for (int i = nearestlevel; i < ArraySize(Fractals); i++) {
        Panel_originX = origin + dist;
        ObjectDelete("fractal_t" + i);
        ObjectCreate("fractal_t" + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("fractal_t" + i, OBJPROP_CORNER, corner);
        ObjectSet("fractal_t" + i, OBJPROP_XDISTANCE, Panel_originX);
        ObjectSet("fractal_t" + i, OBJPROP_YDISTANCE, Panel_originY + level * Panel_offsetY);
        if (i < NBR_PERIODS - P_M15) {
            co = Turquoise;
            ObjectSetText("fractal_t" + i, PeriodName[NBR_PERIODS - i - 1], PanelFontSize, PanelFont, co);
        } else
        if (i >= NBR_PERIODS - P_M15) {
            co = Red;
            ObjectSetText("fractal_t" + i, PeriodName[i - (NBR_PERIODS - P_M15) + P_M15], PanelFontSize, PanelFont, co);
        }
        Panel_originX -= 50;
        ObjectDelete("fractal" + i);
        ObjectCreate("fractal" + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("fractal" + i, OBJPROP_CORNER, corner);
        ObjectSet("fractal" + i, OBJPROP_XDISTANCE, Panel_originX + Panel_offsetX);
        ObjectSet("fractal" + i, OBJPROP_YDISTANCE, Panel_originY + level * Panel_offsetY);

        if (nearestlevel == i) {
            if (distance > 0 && distance < PivotThreshold)
                c = ExtremeBullColor;
            else
            if (distance > 0)
                c = BullColor;
            else
            if (distance < 0 && distance < (-1) * PivotThreshold)
                c = ExtremeBearColor;
            else
            if (distance < 0)
                c = BearColor;
            else
                c = NeutralColor;

            ObjectDelete("fractal_dist");
            ObjectCreate("fractal_dist", OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("fractal_dist", OBJPROP_CORNER, corner);
            ObjectSet("fractal_dist", OBJPROP_XDISTANCE, Panel_originX + Panel_offsetX - 50);
            ObjectSet("fractal_dist", OBJPROP_YDISTANCE, Panel_originY + level * Panel_offsetY);
            ObjectSetText("fractal_dist", DoubleToString(distance, MathMin(_Digits, 4)) + " < ", PanelFontSize, PanelFont, c);
            ObjectSetText("fractal" + i, DoubleToString(Fractals[i], _Digits), PanelFontSize, PanelBFont, co);
        } else
            ObjectSetText("fractal" + i, DoubleToString(Fractals[i], _Digits), PanelFontSize, PanelFont, co);
        level++;
    }

    for (i = nearestlevel - 1; i >= 0; i--) {
        Panel_originX = origin + dist;
        ObjectDelete("fractal_t" + i);
        ObjectCreate("fractal_t" + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("fractal_t" + i, OBJPROP_CORNER, corner);
        ObjectSet("fractal_t" + i, OBJPROP_XDISTANCE, Panel_originX);
        ObjectSet("fractal_t" + i, OBJPROP_YDISTANCE, Panel_originY - (nearestlevel - i) * Panel_offsetY);
        if (i < NBR_PERIODS - P_M15) {
            co = Turquoise;
            ObjectSetText("fractal_t" + i, PeriodName[NBR_PERIODS - i - 1], PanelFontSize, PanelFont, co);
        } else
        if (i >= NBR_PERIODS - P_M15) {
            co = Red;
            ObjectSetText("fractal_t" + i, PeriodName[i - (NBR_PERIODS - P_M15) + P_M15], PanelFontSize, PanelFont, co);
        }

        Panel_originX -= 50;
        ObjectDelete("fractal" + i);
        ObjectCreate("fractal" + i, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
        ObjectSet("fractal" + i, OBJPROP_CORNER, corner);
        ObjectSet("fractal" + i, OBJPROP_XDISTANCE, Panel_originX + Panel_offsetX);
        ObjectSet("fractal" + i, OBJPROP_YDISTANCE, Panel_originY - (nearestlevel - i) * Panel_offsetY);
        ObjectSetText("fractal" + i, DoubleToString(Fractals[i], _Digits), PanelFontSize, PanelFont, co);
    }
}

void Panel_DrawGraphics() {
    int i = 0;

    PanelTextColor = White;

    if (Panel_Window == 0) return;
    
    Panel_DrawTargets(P_D1, PanelOriginTargets, 0);
   
}

void Panel_DeleteGraphics() {
    ObjectsDeleteAll(Panel_Window);
}


void News_DeleteLineGraphics(int NewsMax) {
    for (int i = 0; i < NewsMax; i++) {
        ObjectDelete("NewsLine" + i);
    }
}

void News_DeleteGraphics(int NewsMax) {
    for (int i = 0; i < NewsMax; i++) {
        ObjectDelete("NewsLine" + i);
        ObjectDelete("CalendarDate" + i);
        ObjectDelete("CalendarDesc" + i);
        ObjectDelete("CalendarCurr" + i);
        ObjectDelete("CalendarImport" + i);
        ObjectDelete("CalendarActual" + i);
        ObjectDelete("CalendarForecast" + i);
        ObjectDelete("CalendarPrevious" + i);

    }
}

////////////////////////////////////////////////////////////RULES//////////////////////////////////////


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

void GetNbrRules(int & nbr_buy, int & nbr_sell, int & nbr_exit_buy, int & nbr_exit_sell) {
    nbr_buy = 0;
    nbr_sell = 0;
    nbr_exit_buy = 0;
    nbr_exit_sell = 0;
    for (int x = 0; x < NBR_RULES; x++) {
        if (AndR(OP_BUY, T_STATUS, x)) nbr_buy++;
        if (AndR(OP_SELL, T_STATUS, x)) nbr_sell++;
        if (AndR(OP_EXIT_BUY, T_STATUS, x)) nbr_exit_buy++;
        if (AndR(OP_EXIT_SELL, T_STATUS, x)) nbr_exit_sell++;
    }
}

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
    int session;


    if (C_COMPILE) {
        MT4_SetEntryRules(_Ask, _Bid, TimeCurrent(), CurrentPeriod, SymbolBuffer, SYS_POINT, SYS_DIGITS,
            SignalTab, SignalTabValue, SignalTabTime, SignalTabPrice,
            BeforeSignalTab, BeforeSignalTabValue, BeforeSignalTabTime, BeforeSignalTabPrice,
            BeforeSignalTickTab, RuleTab, RuleTabValue, BeforeRuleTab, BeforeRuleTabValue);
    } else {
        SetEntryRules();
    }
   
    GetNbrRules(RuleNbrBuy, RuleNbrSell, RuleNbrExitBuy, RuleNbrExitSell);

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
//        PG_Print(TYPE_WARNING, "Check Account : Free Margin = " + DoubleToString(AccountFreeMargin(), 2));
//        return (false);
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

void Info_DrawGraphics(int window, int corner) {
    // PRICE
    if (ObjectFind("bid_ask") != window) {
        ObjectDelete("bid_ask");
        ObjectCreate("bid_ask", OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("bid_ask", OBJPROP_CORNER, corner);
        ObjectSet("bid_ask", OBJPROP_XDISTANCE, 74);
        ObjectSet("bid_ask", OBJPROP_YDISTANCE, 26);
        ObjectSetInteger(0, "bid_ask", OBJPROP_SELECTABLE, false);

    }
    ObjectSetText("bid_ask", DoubleToString(MarketInfo(_Symbol, MODE_BID), _Digits), 20, "Arial Black", FontColor);

    //Time 

    if (ObjectFind("time") != window) {
        ObjectDelete("time");
        ObjectCreate("time", OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("time", OBJPROP_CORNER, corner);
        ObjectSet("time", OBJPROP_XDISTANCE, 60);
        ObjectSet("time", OBJPROP_YDISTANCE, 57);
        ObjectSetInteger(0, "time", OBJPROP_SELECTABLE, false);
    }

    ObjectSetText("time", "GMT : " + TimeToString(TimeCurrent() + GMTShift, TIME_SECONDS), 12, "Arial Black", White);
    //spread

    if (ObjectFind("spread") != window) {
        ObjectDelete("spread");
        ObjectCreate("spread", OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("spread", OBJPROP_CORNER, corner);
        ObjectSet("spread", OBJPROP_XDISTANCE, 27);
        ObjectSet("spread", OBJPROP_YDISTANCE, 33);
        ObjectSetInteger(0, "spread", OBJPROP_SELECTABLE, false);

    }
    ObjectSetText("spread", DoubleToString(NormalizeDouble(((_Ask - _Bid) / _Point) / 10, 1), 1), 8, "Arial Black", DarkGray);

    // Symbol

    if (ObjectFind("symbol") != window) {
        ObjectDelete("symbol");
        ObjectCreate("symbol", OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("symbol", OBJPROP_CORNER, corner);
        ObjectSet("symbol", OBJPROP_XDISTANCE, 12);
        ObjectSet("symbol", OBJPROP_YDISTANCE, 44);
        ObjectSetInteger(0, "symbol", OBJPROP_SELECTABLE, false);

    }
    ObjectSetText("symbol", _Symbol, 8, "Arial Black", DarkGray);

    string sconnection = "";

   // if (CSocket != -1) sconnection = "CONNECTED ";
   // else sconnection = "NOT CONNECTED ";

    
      if (NodeSocket == -1) sconnection += "NOT CONNECTED ";
      else sconnection += "CONNECTED ";

    if (ObjectFind("connection") != window) {
        ObjectDelete("connection");
        ObjectCreate("connection", OBJ_LABEL, window, 0, 0, 0, 0);
        ObjectSet("connection", OBJPROP_CORNER, corner);
        ObjectSet("connection", OBJPROP_YDISTANCE, 21);
        ObjectSetInteger(0, "connection", OBJPROP_SELECTABLE, false);

    }
    if (sconnection == "CONNECTED ") {
        ObjectSet("connection", OBJPROP_XDISTANCE, 75);
        ObjectSetText("connection", sconnection, 8, "Arial Black", DeepSkyBlue);

    } else {
        ObjectSet("connection", OBJPROP_XDISTANCE, 64);
        ObjectSetText("connection", sconnection, 8, "Arial Black", PaleGreen);
    }

}

string GetEngineNameFromSession(int session) {

    int engine = GetEngine(B_StartOnRule[session], B_Operation[session]);
    string senginename = (engine == -1 ? "Manual" : EngineName[engine]);
    return senginename;
}

void PG_Comment() {
    string legend = "";
    int engine;

    if (CSocket != -1) legend = legend + "CONNECTED ";
    else legend = legend + "NOT CONNECTED ";
    legend = legend + "Account Name = " + AccountName() + " Account Number = " + AccountNumber() + " Spread : " + DoubleToString(SYS_SPREAD, _Digits) + " Slippage : " + DoubleToString(SYS_SLIPPAGE, 0) + " Account Balance = " + DoubleToString(AccountBalance(), 2) + " NbrLots Treated = " + DoubleToString(AccountNbrLots, 2) + " ";
    legend = legend + "Account Free Margin = " + DoubleToString(AccountFreeMargin(), 2) + " Min Free Margin = " + DoubleToString(AccountMinFreeMargin, 2) + "  Account Profit = " + DoubleToString(AccountProfit(), 2) + " ";
    legend = legend + "Comission = " + DoubleToString(ReturnClosedComission(), 2) + " " + "Swap = " + DoubleToString(ReturnClosedSwap(), 2)  + "\n";;
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   PREDEFINED INDICATORS

//---- buffers
double upArrow[3];
double downArrow[3];
string PatternText[5000];


bool UseExtraDigit = false;

color Color_Doji = Red;
color Color_Star = Red;
color Color_DarkCC = Red;
color Color_Piercing_Line = Turquoise;
color Color_Bullish_Engulfing = Turquoise;
color Color_Bearish_Engulfing = Red;
color Color_ShootStar = Red;
color Color_Hammer = Turquoise;

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

    while (i > 0 && iTime(NULL, PeriodIndex[x], i) != 0 && (TimeDay(iTime(NULL, PeriodIndex[x], i)) ==  TimeDay(iTime(NULL, PeriodIndex[x], i-1)))) {
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
    while (i > 0 && iTime(NULL, PeriodIndex[x], i) != 0 && (TimeMonth(iTime(NULL, PeriodIndex[x], i)) == TimeMonth(iTime(NULL, PeriodIndex[x], i-1)))) {
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
    while (i > 0 && iTime(NULL, PeriodIndex[x], i) != 0  && (TimeYear(iTime(NULL, PeriodIndex[x], i)) ==TimeYear(iTime(NULL, PeriodIndex[x], i)))) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iOpen(NULL, PeriodIndex[x], i) > iOpen(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iOpen(NULL, PeriodIndex[x], i) < iOpen(NULL, PeriodIndex[x], i + 1)) {
                NbrBars += 1;
                i++;
            }
            SETSIGNAL(shift, OPEN, S_NBRBARS, x, P_SIGNAL, NbrBars);

    } else {
            while (iTime(NULL, PeriodIndex[x], 0) && iOpen(NULL, PeriodIndex[x], i) == iOpen(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iClose(NULL, PeriodIndex[x], i) > iClose(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iClose(NULL, PeriodIndex[x], i) < iClose(NULL, PeriodIndex[x], i + 1)) {
                NbrBars += 1;
                i++;
            }
            SETSIGNAL(shift, CLOSE, S_NBRBARS, x, P_SIGNAL, NbrBars);


    } else {
            while (iTime(NULL, PeriodIndex[x], 0) && iClose(NULL, PeriodIndex[x], i) == iClose(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iHigh(NULL, PeriodIndex[x], i) > iHigh(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iHigh(NULL, PeriodIndex[x], i) < iHigh(NULL, PeriodIndex[x], i + 1)) {
                NbrBars += 1;
                i++;
            }
            SETSIGNAL(shift, HIGH, S_NBRBARS, x, P_SIGNAL, NbrBars);
    } else {
            while (iTime(NULL, PeriodIndex[x], 0) && iHigh(NULL, PeriodIndex[x], i) > iHigh(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) &&  iLow(NULL, PeriodIndex[x], i) > iLow(NULL, PeriodIndex[x], i + 1)) {
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
            while (iTime(NULL, PeriodIndex[x], 0) && iLow(NULL, PeriodIndex[x], i) < iLow(NULL, PeriodIndex[x], i + 1)) {
                NbrBars += 1;
                i++;
            }
            SETSIGNAL(shift, LOW, S_NBRBARS, x, P_SIGNAL, NbrBars);

    } else {
            while (iTime(NULL, PeriodIndex[x], 0) && iLow(NULL, PeriodIndex[x], i) == iLow(NULL, PeriodIndex[x], i + 1)) {
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

//-------------------------------------------------------------BEGIN PANEL DRAWING------------------------------------------------------------------------

int InitGraphics() {
    MainPanel_InitGraphics(right_up_corner);
    Panel_InitGraphics();
    return (0);
}

void DeleteGraphics() {
    MainPanel_DeleteGraphics();
    News_DeleteGraphics(100);
    Panel_DeleteGraphics();

}
//PATTERNS



void SObjectCreate(string Name, datetime time, double price, color Color, int x) {
    int size = 8;
    if (x >= P_D1) size = 10;

    ObjectCreate(Name, OBJ_TEXT, 0, time, price);
    ObjectSet(Name, OBJPROP_PRICE1, price);
    ObjectSet(Name, OBJPROP_TIME1, time);
    ObjectSetText(Name, Name, size, "Times New Roman", Color);
    ObjectSetInteger(0, Name, OBJPROP_SELECTABLE, false);

}

string GetName(string aName, int period) {
    return (PeriodName[period] + " " + aName);
}

void Draw_Patterns(int x, int & CumOffset) {
    int Pointer_Offset = 0; // The offset value for the arrow to be located off the candle high or low point.
    int High_Offset = 0; // The offset value added to the high arrow pointer for correct plotting of the pattern label.
    //  int  CumOffset = 0;              // The counter value to be added to as more candle types are met.
    int IncOffset = 0; // The offset value that is added to a cummaltive offset value for each pass through the routine so any 

    switch (PeriodIndex[x]) {
    case 1:
        Pointer_Offset = 20;
        High_Offset = 15;
        IncOffset = 16;
        break;
    case 5:
        Pointer_Offset = 40;
        High_Offset = 15;
        IncOffset = 16;
        break;
    case 15:
        Pointer_Offset = 60;
        High_Offset = 15;
        IncOffset = 16;
        break;
    case 30:
        Pointer_Offset = 80;
        High_Offset = 15;
        IncOffset = 16;
        break;
    case 60:
        Pointer_Offset = 100;
        High_Offset = 20;
        IncOffset = 16;
        break;
    case 240:
        Pointer_Offset = 120;
        High_Offset = 40;
        IncOffset = 16;
        break;
    case 1440:
        Pointer_Offset = 140;
        High_Offset = 80;
        IncOffset = 16;
        break;
    case 10080:
        Pointer_Offset = 160;
        High_Offset = 35;
        IncOffset = 16;
        break;
    case 43200:
        Pointer_Offset = 180;
        High_Offset = 45;
        IncOffset = 16;
        break;
    }

    int shift1 = 1;
    //    CumOffset = 0;
    Pointer_Offset = 20;

    if (AndPS(BAR, S_DOJI, x) && Display_Doji == true) {
        SObjectCreate(GetName("Doji", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Doji", x));

    // Bearish Patterns  

    if (AndPS(BAR, S_BEAR_QUAD, x) && Display_Bear_Quad == true) {
        SObjectCreate(GetName("Bear Quad", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Bear Quad", x));

    if (AndPS(BAR, S_BEAR_SHOOTING_STAR, x) && Display_ShootStar_2 == true) {
        SObjectCreate(GetName("Shooting Star", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Shooting Star", x));

    if (AndPS(BAR, S_BEAR_SHOOTING_STAR1, x) && Display_ShootStar_3 == true) {
        SObjectCreate(GetName("Shooting Star 1", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Shooting Star 1", x));

    if (AndPS(BAR, S_BEAR_SHOOTING_STAR2, x) && Display_ShootStar_4 == true) {
        SObjectCreate(GetName("Shooting Star 2", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Shooting Star 2", x));

    if (AndPS(BAR, S_BEAR_EVENING_STAR, x) && Display_Stars == true) {
        SObjectCreate(GetName("Evening Star", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Evening Star", x));

    if (AndPS(BAR, S_BEAR_EVENING_DOJI_STAR, x) && Display_Doji == true) {
        SObjectCreate(GetName("Evening Doji Star", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Evening Doji Star", x));

    if (AndPS(BAR, S_BEAR_DARK_CLOUD_COVER, x) && Display_Dark_Cloud_Cover == true) {
        SObjectCreate(GetName("Dark Cloud Cover", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Dark Cloud Cover", x));

    if (AndPS(BAR, S_BEAR_ENGULFING, x) && Display_Bearish_Engulfing == true) {
        SObjectCreate(GetName("Bear Engulfing", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Bear Engulfing", x));

    if (AndPS(BAR, S_BEAR_HARAMI, x) && Display_Harami == true) {
        SObjectCreate(GetName("Bear Harami", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Bear Harami", x));

    if (AndPS(BAR, S_BEAR_HANGING_MAN2, x) && Display_Hanging_Man_Hammer == true) {
        SObjectCreate(GetName("Hangin Man", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Hangin Man", x));

    if (AndPS(BAR, S_BEAR_THREE_INSIDE_DOWN, x) && Display_Three_Inside_Down == true) {
        SObjectCreate(GetName("3 Inside Down", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("3 Inside Down", x));

    if (AndPS(BAR, S_BEAR_THREE_OUTSIDE_DOWN, x) && Display_Three_Outside_Down == true) {
        SObjectCreate(GetName("3 Outside Down", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("3 Outside Down", x));

    if (AndPS(BAR, S_BEAR_THREE_BLACK_CROWS, x) && Display_Three_Black_Crows == true) {
        SObjectCreate(GetName("3 Black Crows", x), Time[shift1], High[shift1] + (Pointer_Offset + CumOffset) * SYS_POINT, Red, x);
        CumOffset = CumOffset + IncOffset;
        downArrow[shift1] = High[shift1] + (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("3 Black Crows", x));

    // End of Bearish Patterns

    // Bullish Patterns
    if (AndPS(BAR, S_BULL_QUAD, x) && Display_Bull_Quad == true) {
        SObjectCreate(GetName("Bull Quad", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Bull Quad", x));

    if (AndPS(BAR, S_BULL_HAMMER, x) && Display_Hammer_2 == true) {
        SObjectCreate(GetName("Hammer", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Hammer", x));

    if (AndPS(BAR, S_BULL_HAMMER1, x) && Display_Hammer_3 == true) {
        SObjectCreate(GetName("Hammer 1", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Hammer 1", x));

    if (AndPS(BAR, S_BULL_HAMMER2, x) && Display_Hammer_4 == true) {
        SObjectCreate(GetName("Hammer 2", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Hammer 2", x));

    if (AndPS(BAR, S_BULL_MORNING_STAR, x) && Display_Stars == true) {
        SObjectCreate(GetName("Morning Star", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Morning Star", x));

    if (AndPS(BAR, S_BULL_MORNING_DOJI_STAR, x) && Display_Doji == true) {
        SObjectCreate(GetName("Morning Doji", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Morning Doji", x));

    if (AndPS(BAR, S_BULL_PIERCING_LINE, x) && Display_Piercing_Line == true) {
        SObjectCreate(GetName("Piercing Line", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Piercing Line", x));

    if (AndPS(BAR, S_BULL_ENGULFING, x) && Display_Bullish_Engulfing) {
        SObjectCreate(GetName("Bull Engulfing", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Bull Engulfing", x));

    if (AndPS(BAR, S_BULL_INVERTED_HAMMER, x) && Display_I_Hammer_S_Star) {
        SObjectCreate(GetName("Inverted Hammer", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Inverted Hammer", x));

    if (AndPS(BAR, S_BULL_THREE_OUTSIDE_UP, x) && Display_Three_Outside_Up == true) {
        SObjectCreate(GetName("3 Outside Up", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("3 Outside Up", x));

    if (AndPS(BAR, S_BULL_HARAMI, x) && Display_Harami == true) {
        SObjectCreate(GetName("Bull Harami", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("Bull Harami", x));

    if (AndPS(BAR, S_BULL_THREE_INSIDE_UP, x) && Display_Three_Inside_Up == true) {
        SObjectCreate(GetName("3 Inside Up", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("3 Inside Up", x));

    if (AndPS(BAR, S_BULL_THREE_WHITE_SOLDIERS, x) && Display_Three_White_Soldiers == true) {
        SObjectCreate(GetName("3 White Soldiers", x), Time[shift1], Low[shift1] - (Pointer_Offset + CumOffset) * SYS_POINT, Turquoise, x);
        CumOffset = CumOffset + IncOffset;
        upArrow[shift1] = Low[shift1] - (Pointer_Offset * SYS_POINT);
    } else
        ObjectDelete(GetName("3 White Soldiers", x));

    return (0);
}

void Patterns_DrawGraphics(int x) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    //   if (CurrentPeriod > x) return;
    int CumOffset = 0;
    Draw_Patterns(x, CumOffset);
}

void Patterns_DeleteGraphics(int x) {
    int CumOffset = 0;
    ObjectDelete(GetName("Doji", x));

    ObjectDelete(GetName("Shooting Star 1", x));
    ObjectDelete(GetName("Shooting Star 2", x));
    ObjectDelete(GetName("Shooting Star", x));
    ObjectDelete(GetName("Evening Star", x));
    ObjectDelete(GetName("Evening Doji Star", x));
    ObjectDelete(GetName("Dark Cloud Cover", x));
    ObjectDelete(GetName("Bear Engulfing", x));
    ObjectDelete(GetName("Bear Harami", x));
    ObjectDelete(GetName("Hangin Man", x));
    ObjectDelete(GetName("3 Inside Down", x));
    ObjectDelete(GetName("3 Outside Down", x));
    ObjectDelete(GetName("3 Black Crows", x));

    ObjectDelete(GetName("Hammer", x));
    ObjectDelete(GetName("Hammer 1", x));
    ObjectDelete(GetName("Hammer 2", x));
    ObjectDelete(GetName("Morning Star", x));
    ObjectDelete(GetName("Morning Doji", x));
    ObjectDelete(GetName("Piercing Line", x));
    ObjectDelete(GetName("Bull Engulfing", x));
    ObjectDelete(GetName("Bull Harami", x));
    ObjectDelete(GetName("Inverted Hammer", x));
    ObjectDelete(GetName("3 Outside Up", x));
    ObjectDelete(GetName("3 Inside Up", x));
    ObjectDelete(GetName("3 White Soldiers", x));

    ObjectDelete(GetName("Bear Quad", x));
    ObjectDelete(GetName("Bull Quad", x));
}

// SR GRAPHICS

void SR_InitGraphics(int x, int up) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;
    if (CurrentPeriod > x) return;
    if (up) {
        ObjectCreate("FractalResistanceLine" + "," + PeriodName[x], OBJ_TREND, 0, 0, 0);
        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_STYLE, Style[x]);
        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_WIDTH, Width[x]);
        ObjectSetInteger(0, "FractalResistanceLine" + "," + PeriodName[x], OBJPROP_SELECTABLE, false);

        ObjectCreate("FractalResistanceText" + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0, 0);
        ObjectSet("FractalResistanceText" + "," + PeriodName[x], OBJPROP_CORNER, 1);
        ObjectSetText("FractalResistanceText" + "," + PeriodName[x], PeriodName[x], 8, "Tahoma", ResistanceColor);
        ObjectSetInteger(0, "FractalResistanceText" + "," + PeriodName[x], OBJPROP_SELECTABLE, false);

    } else {
        ObjectCreate("FractalSupportText" + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0, 0);
        ObjectSet("FractalSupportText" + "," + PeriodName[x], OBJPROP_CORNER, 1);
        ObjectSetText("FractalSupportText" + "," + PeriodName[x], PeriodName[x], 8, "Tahoma", SupportColor);
        ObjectSetInteger(0, "FractalSupportText" + "," + PeriodName[x], OBJPROP_SELECTABLE, false);

        ObjectCreate("FractalSupportLine" + "," + PeriodName[x], OBJ_TREND, 0, 0, 0);
        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_STYLE, Style[x]);
        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_WIDTH, Width[x]);
        ObjectSetInteger(0, "FractalSupportLine" + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
    }
    return;
}

void SR_DrawGraphics(int x, int up) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    if (CurrentPeriod > x) return;
    if (up) {
        datetime rtime1 = ReturnBestTime(CurrentPeriod, x, MODE_UPPER, 1);
        datetime rtime0 = ReturnBestTime(CurrentPeriod, x, MODE_UPPER, 0);
        double rprice1 = iHigh(NULL, PeriodIndex[x], Last2UpFractals[1][x]);
        double rprice0 = iHigh(NULL, PeriodIndex[x], Last2UpFractals[0][x]);

        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_PRICE1, rprice1);
        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_TIME1, rtime1);
        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_PRICE2, rprice0);
        ObjectSet("FractalResistanceLine" + "," + PeriodName[x], OBJPROP_TIME2, rtime0);
    } else {
        datetime stime1 = ReturnBestTime(CurrentPeriod, x, MODE_LOWER, 1);
        datetime stime0 = ReturnBestTime(CurrentPeriod, x, MODE_LOWER, 0);
        double sprice1 = iLow(NULL, PeriodIndex[x], Last2DownFractals[1][x]);
        double sprice0 = iLow(NULL, PeriodIndex[x], Last2DownFractals[0][x]);

        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_PRICE1, sprice1);
        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_TIME1, stime1);
        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_PRICE2, sprice0);
        ObjectSet("FractalSupportLine" + "," + PeriodName[x], OBJPROP_TIME2, stime0);

        ObjectSet("FractalResistanceText" + "," + PeriodName[x], OBJPROP_PRICE1, ResistanceLevel(x, 0));
        ObjectSet("FractalResistanceText" + "," + PeriodName[x], OBJPROP_TIME1, iTime(NULL, PeriodIndex[CurrentPeriod], 0));
        ObjectSet("FractalSupportText" + "," + PeriodName[x], OBJPROP_PRICE1, SupportLevel(x, 0));
        ObjectSet("FractalSupportText" + "," + PeriodName[x], OBJPROP_TIME1, iTime(NULL, PeriodIndex[CurrentPeriod], 0));
    }
}

void SR_DeleteGraphics(int x, int up) {
    if (up) {
        ObjectDelete("FractalResistanceText" + "," + PeriodName[x]);
        ObjectDelete("FractalResistanceLine" + "," + PeriodName[x]);
    } else {
        ObjectDelete("FractalSupportText" + "," + PeriodName[x]);
        ObjectDelete("FractalSupportLine" + "," + PeriodName[x]);
    }
    return;
}

void FractalsTarget_InitGraphics(int x, int up) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    //	if (CurrentPeriod > x) return;
    if (up) {
        ObjectCreate("UpFractalTarget," + PeriodName[x] + " " + x, OBJ_ARROW, 0, 0, 0);
        ObjectSet("UpFractalTarget," + PeriodName[x] + " " + x, OBJPROP_ARROWCODE, SYMBOL_LEFTPRICE);
        ObjectSet("UpFractalTarget," + PeriodName[x] + " " + x, OBJPROP_COLOR, ResistanceColor);
    } else {
        ObjectCreate("DownFractalTarget," + PeriodName[x] + " " + x, OBJ_ARROW, 0, 0, 0);
        ObjectSet("DownFractalTarget," + PeriodName[x] + " " + x, OBJPROP_ARROWCODE, SYMBOL_LEFTPRICE);
        ObjectSet("DownFractalTarget," + PeriodName[x] + " " + x, OBJPROP_COLOR, SupportColor);
    }

}

void FractalsTarget_DrawGraphics(int x, int up) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    //  if (CurrentPeriod > x) return;

    if (up && AndS(UPFRACTAL, S_ABOVE, x) != 0) {
        ObjectSet("UpFractalTarget," + PeriodName[x] + " " + x, OBJPROP_TIME1, iTime(NULL, PeriodIndex[CurrentPeriod], 0));
        ObjectSet("UpFractalTarget," + PeriodName[x] + " " + x, OBJPROP_PRICE1, iHigh(NULL, PeriodIndex[x], NextUpFractals[x]));
    } else
    if (!up && AndS(DOWNFRACTAL, S_BELOW, x) != 0) {
        ObjectSet("DownFractalTarget," + PeriodName[x] + " " + x, OBJPROP_TIME1, iTime(NULL, PeriodIndex[CurrentPeriod], 0));
        ObjectSet("DownFractalTarget," + PeriodName[x] + " " + x, OBJPROP_PRICE1, iLow(NULL, PeriodIndex[x], NextDownFractals[x]));
    } else {
        if (up) {
            ObjectSet("UpFractalTarget," + PeriodName[x] + " " + x, OBJPROP_TIME1, 0);
            ObjectSet("UpFractalTarget," + PeriodName[x] + " " + x, OBJPROP_PRICE1, 0);
        } else {
            ObjectSet("DownFractalTarget," + PeriodName[x] + " " + x, OBJPROP_TIME1, 0);
            ObjectSet("DownFractalTarget," + PeriodName[x] + " " + x, OBJPROP_PRICE1, 0);
        }
    }
}

void FractalsTarget_DeleteGraphics(int x, int up) {
    if (up) {
        ObjectDelete("UpFractalTarget," + PeriodName[x] + " " + x);
    } else {
        ObjectDelete("DownFractalTarget," + PeriodName[x] + " " + x);
    }
    return;
}

void Fractals_InitGraphics(int x, int up) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    //if (CurrentPeriod > x) return;
    int width = 1;

    if (x >= P_D1) width = 3;

    if (up) {
        ObjectCreate("FractalUpLine" + "," + PeriodName[x], OBJ_HLINE, 0, 0, 0);
        ObjectSet("FractalUpLine" + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("FractalUpLine" + "," + PeriodName[x], OBJPROP_STYLE, HStyle[x]);
        ObjectSet("FractalUpLine" + "," + PeriodName[x], OBJPROP_WIDTH, width);
        ObjectCreate("FractalUpText" + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0, 0);
        ObjectSetText("FractalUpText" + "," + PeriodName[x], PeriodName[x], 10, "Arial", ResistanceColor);
        ObjectSetInteger(0, "FractalUpText" + "," + PeriodName[x], OBJPROP_SELECTABLE, false);

    } else {

        ObjectCreate("FractalDownLine" + "," + PeriodName[x], OBJ_HLINE, 0, 0, 0);
        ObjectSet("FractalDownLine" + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("FractalDownLine" + "," + PeriodName[x], OBJPROP_STYLE, HStyle[x]);
        ObjectSet("FractalDownLine" + "," + PeriodName[x], OBJPROP_WIDTH, width);
        ObjectCreate("FractalDownText" + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0, 0);
        ObjectSetText("FractalDownText" + "," + PeriodName[x], PeriodName[x], 10, "Arial", SupportColor);
        ObjectSetInteger(0, "FractalDownText" + "," + PeriodName[x], OBJPROP_SELECTABLE, false);

    }
    return;
}

void Fractals_DrawGraphics(int x, int up) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    //  if (CurrentPeriod > x) return;
    if (up && UpFractals[x] != -1) {
        ObjectSet("FractalUpLine" + "," + PeriodName[x], OBJPROP_PRICE1, iHigh(NULL, PeriodIndex[x], UpFractals[x]));
        ObjectSet("FractalUpText" + "," + PeriodName[x], OBJPROP_PRICE1, iHigh(NULL, PeriodIndex[x], UpFractals[x]));
        ObjectSet("FractalUpText" + "," + PeriodName[x], OBJPROP_TIME1, Time[0] + 360);
    } else
    if (!up && DownFractals[x] != -1) {
        ObjectSet("FractalDownLine" + "," + PeriodName[x], OBJPROP_PRICE1, iLow(NULL, PeriodIndex[x], DownFractals[x]));
        ObjectSet("FractalDownText" + "," + PeriodName[x], OBJPROP_PRICE1, iLow(NULL, PeriodIndex[x], DownFractals[x]));
        ObjectSet("FractalDownText" + "," + PeriodName[x], OBJPROP_TIME1, Time[0] + 360);
    }
}

void Fractals_DeleteGraphics(int x, int up) {
    if (up) {
        ObjectDelete("FractalUpText" + "," + PeriodName[x]);
        ObjectDelete("FractalUpLine" + "," + PeriodName[x]);
    } else {
        ObjectDelete("FractalDownLine" + "," + PeriodName[x]);
        ObjectDelete("FractalDownText" + "," + PeriodName[x]);
    }
    return;
}

// PIVOTS GRAPHICS

void Pivots_InitGraphics(int x) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    if (CurrentPeriod > x) return;
    int Nbr = 3;

    int linewidth = 1;

    if (x > P_D1) linewidth = 2;

    //   if (x >= P_D1) Nbr = 3;
    for (int shift = 1; shift <= Nbr; shift++) {
        ObjectCreate("PivotHighLine" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotHighLine" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, LimeGreen);
        ObjectSet("PivotHighLine" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotHighLine" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotHighLine" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotHighLineR" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotHighLineR" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, LimeGreen);
        ObjectSet("PivotHighLineR" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotHighLineR" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotHighLineR" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotLowLine" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotLowLine" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, LimeGreen);
        ObjectSet("PivotLowLine" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotLowLine" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotLowLine" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotLowLineR" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotLowLineR" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, LimeGreen);
        ObjectSet("PivotLowLineR" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotLowLineR" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotLowLineR" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotLine" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotLine" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, Yellow);
        ObjectSet("PivotLine" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotLine" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotLine" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotLineR" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotLineR" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, Yellow);
        ObjectSet("PivotLineR" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotLineR" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotLineR" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotResistanceLine" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotResistanceLine" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("PivotResistanceLine" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotResistanceLine" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotResistanceLine" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotResistanceLineR" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotResistanceLineR" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("PivotResistanceLineR" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotResistanceLineR" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotResistanceLineR" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotResistanceLine1" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotResistanceLine1" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("PivotResistanceLine1" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotResistanceLine1" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotResistanceLine1" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotResistanceLine2" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotResistanceLine2" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("PivotResistanceLine2" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotResistanceLine2" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotResistanceLine2" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, ResistanceColor);
        ObjectSet("PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotSupportLine" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotSupportLine" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("PivotSupportLine" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotSupportLine" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotSupportLine" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotSupportLineR" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotSupportLineR" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("PivotSupportLineR" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotSupportLineR" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotSupportLineR" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotSupportLine1" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotSupportLine1" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("PivotSupportLine1" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotSupportLine1" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotSupportLine1" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotSupportLine1R" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotSupportLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("PivotSupportLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotSupportLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotSupportLine1R" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotSupportLine2" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotSupportLine2" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("PivotSupportLine2" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotSupportLine2" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotSupportLine2" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotSupportLine2R" + " " + shift + "," + PeriodName[x], OBJ_TREND, 0, 0, 0, 0, 0);
        ObjectSet("PivotSupportLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_COLOR, SupportColor);
        ObjectSet("PivotSupportLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_WIDTH, linewidth);
        ObjectSetInteger(0, "PivotSupportLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotSupportLine2R" + " " + shift + "," + PeriodName[x], OBJPROP_RAY_RIGHT, false);

        ObjectCreate("PivotTextLow" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotTextHigh" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotText" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0);
        ObjectCreate("PivotTextResistance" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotTextSupport" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotTextResistance1" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotTextSupport1" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotTextResistance2" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectCreate("PivotTextSupport2" + " " + shift + "," + PeriodName[x], OBJ_TEXT, 0, 0, 0, 0);
        ObjectSetInteger(0, "PivotTextLow" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextHigh" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotText" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextResistance" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextSupport" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextResistance1" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextSupport1" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextResistance2" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
        ObjectSetInteger(0, "PivotTextSupport2" + " " + shift + "," + PeriodName[x], OBJPROP_SELECTABLE, false);
    }
}

void Pivots_DrawGraphics(int x) {
    string timeframe_prefix = "";
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    if (CurrentPeriod > x) return;

    if (x == P_D1) timeframe_prefix = "D1 ";
    else
    if (x == P_W1) timeframe_prefix = "W1 ";
    else
    if (x == P_MN) timeframe_prefix = "MN ";
    else
    if (x == P_H4) timeframe_prefix = "H4 ";
    else
    if (x == P_H1) timeframe_prefix = "H1 ";
    else
    if (x == P_M30) timeframe_prefix = "M30 ";
    else
    if (x == P_M15) timeframe_prefix = "M15 ";
    else
    if (x == P_M5) timeframe_prefix = "M5 ";
    else
    if (x == P_M1) timeframe_prefix = "M1 ";

    int Nbr = 3;
    double totime, fromtime;

    if (x >= P_D1) Nbr = 3;

    for (int shift = 1; shift <= Nbr; shift++) {
        if (shift == 1) {
            totime = Time[0];
            fromtime = iTime(NULL, PeriodIndex[x], 0);
        } else
        if (shift == 2) {
            totime = iTime(NULL, PeriodIndex[x], 0) - PeriodIndex[CurrentPeriod];
            fromtime = iTime(NULL, PeriodIndex[x], 1);
        } else
        if (shift == 3) {
            totime = iTime(NULL, PeriodIndex[x], 1) - PeriodIndex[CurrentPeriod];
            fromtime = iTime(NULL, PeriodIndex[x], 2);
        }

        ObjectMove("PivotHighLine" + " " + shift + "," + PeriodName[x], 1, fromtime, LastHigh[shift][x]);
        ObjectMove("PivotLowLine" + " " + shift + "," + PeriodName[x], 1, fromtime, LastLow[shift][x]);
        ObjectMove("PivotLine" + " " + shift + "," + PeriodName[x], 1, fromtime, LastPivotPoint[shift][x]);
        ObjectMove("PivotResistanceLine" + " " + shift + "," + PeriodName[x], 1, fromtime, LastResistance[shift][x]);
        ObjectMove("PivotSupportLine" + " " + shift + "," + PeriodName[x], 1, fromtime, LastSupport[shift][x]);
        ObjectMove("PivotResistanceLine1" + " " + shift + "," + PeriodName[x], 1, fromtime, LastResistance1[shift][x]);
        ObjectMove("PivotSupportLine1" + " " + shift + "," + PeriodName[x], 1, fromtime, LastSupport1[shift][x]);
        ObjectMove("PivotResistanceLine2" + " " + shift + "," + PeriodName[x], 1, fromtime, LastResistance2[shift][x]);
        ObjectMove("PivotSupportLine2" + " " + shift + "," + PeriodName[x], 1, fromtime, LastSupport2[shift][x]);

        ObjectMove("PivotHighLine" + " " + shift + "," + PeriodName[x], 0, totime, LastHigh[shift][x]);
        ObjectMove("PivotLowLine" + " " + shift + "," + PeriodName[x], 0, totime, LastLow[shift][x]);
        ObjectMove("PivotLine" + " " + shift + "," + PeriodName[x], 0, totime, LastPivotPoint[shift][x]);
        ObjectMove("PivotResistanceLine" + " " + shift + "," + PeriodName[x], 0, totime, LastResistance[shift][x]);
        ObjectMove("PivotSupportLine" + " " + shift + "," + PeriodName[x], 0, totime, LastSupport[shift][x]);
        ObjectMove("PivotResistanceLine1" + " " + shift + "," + PeriodName[x], 0, totime, LastResistance1[shift][x]);
        ObjectMove("PivotSupportLine1" + " " + shift + "," + PeriodName[x], 0, totime, LastSupport1[shift][x]);
        ObjectMove("PivotResistanceLine2" + " " + shift + "," + PeriodName[x], 0, totime, LastResistance2[shift][x]);
        ObjectMove("PivotSupportLine2" + " " + shift + "," + PeriodName[x], 0, totime, LastSupport2[shift][x]);
        if (shift != 1) {

            ObjectMove("PivotHighLineR" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastHigh[shift - 1][x]);
            ObjectMove("PivotLowLineR" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastLow[shift - 1][x]);
            ObjectMove("PivotLineR" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastPivotPoint[shift - 1][x]);
            ObjectMove("PivotResistanceLineR" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastResistance[shift - 1][x]);
            ObjectMove("PivotSupportLineR" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastSupport[shift - 1][x]);
            ObjectMove("PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastResistance1[shift - 1][x]);
            ObjectMove("PivotSupportLine1R" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastSupport1[shift - 1][x]);
            ObjectMove("PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastResistance2[shift - 1][x]);
            ObjectMove("PivotSupportLine2R" + " " + shift + "," + PeriodName[x], 0, totime + PeriodIndex[CurrentPeriod], LastSupport2[shift - 1][x]);

            ObjectMove("PivotHighLineR" + " " + shift + "," + PeriodName[x], 1, totime, LastHigh[shift][x]);
            ObjectMove("PivotLowLineR" + " " + shift + "," + PeriodName[x], 1, totime, LastLow[shift][x]);
            ObjectMove("PivotLineR" + " " + shift + "," + PeriodName[x], 1, totime, LastPivotPoint[shift][x]);
            ObjectMove("PivotResistanceLineR" + " " + shift + "," + PeriodName[x], 1, totime, LastResistance[shift][x]);
            ObjectMove("PivotSupportLineR" + " " + shift + "," + PeriodName[x], 1, totime, LastSupport[shift][x]);
            ObjectMove("PivotResistanceLine1R" + " " + shift + "," + PeriodName[x], 1, totime, LastResistance1[shift][x]);
            ObjectMove("PivotSupportLine1R" + " " + shift + "," + PeriodName[x], 1, totime, LastSupport1[shift][x]);
            ObjectMove("PivotResistanceLine2R" + " " + shift + "," + PeriodName[x], 1, totime, LastResistance2[shift][x]);
            ObjectMove("PivotSupportLine2R" + " " + shift + "," + PeriodName[x], 1, totime, LastSupport2[shift][x]);
        }

        ObjectMove("PivotTextResistance" + " " + shift + "," + PeriodName[x], 0, fromtime, LastResistance[shift][x]);
        ObjectMove("PivotTextSupport" + " " + shift + "," + PeriodName[x], 0, fromtime, LastSupport[shift][x]);
        ObjectMove("PivotTextResistance1" + " " + shift + "," + PeriodName[x], 0, fromtime, LastResistance1[shift][x]);
        ObjectMove("PivotTextSupport1" + " " + shift + "," + PeriodName[x], 0, fromtime, LastSupport1[shift][x]);
        ObjectMove("PivotTextResistance2" + " " + shift + "," + PeriodName[x], 0, fromtime, LastResistance2[shift][x]);
        ObjectMove("PivotTextSupport2" + " " + shift + "," + PeriodName[x], 0, fromtime, LastSupport2[shift][x]);
        ObjectMove("PivotTextLow" + " " + shift + "," + PeriodName[x], 0, fromtime, LastLow[shift][x]);
        ObjectMove("PivotTextHigh" + " " + shift + "," + PeriodName[x], 0, fromtime, LastHigh[shift][x]);
        ObjectMove("PivotText" + " " + shift + "," + PeriodName[x], 0, fromtime, LastPivotPoint[shift][x]);

        ObjectSetText("PivotTextResistance2" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Res3 " + DoubleToString(LastResistance2[shift][x], _Digits) + " (" + DoubleToString((LastResistance2[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", ResistanceColor);
        ObjectSetText("PivotTextResistance1" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Res2 " + DoubleToString(LastResistance1[shift][x], _Digits) + " (" + DoubleToString((LastResistance1[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", ResistanceColor);
        ObjectSetText("PivotTextResistance" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Res1 " + DoubleToString(LastResistance[shift][x], _Digits) + " (" + DoubleToString((LastResistance[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", ResistanceColor);
        ObjectSetText("PivotTextHigh" + " " + shift + "," + PeriodName[x], timeframe_prefix + "High " + DoubleToString(LastHigh[shift][x], _Digits) + " (" + DoubleToString((LastHigh[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", LimeGreen);
        ObjectSetText("PivotText" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Pivot " + DoubleToString(LastPivotPoint[shift][x], _Digits) + " (" + DoubleToString((LastPivotPoint[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", Yellow);
        ObjectSetText("PivotTextLow" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Low " + DoubleToString(LastLow[shift][x], _Digits) + " (" + DoubleToString((LastLow[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", LimeGreen);
        ObjectSetText("PivotTextSupport" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Sup1 " + DoubleToString(LastSupport[shift][x], _Digits) + " (" + DoubleToString((LastSupport[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", SupportColor);
        ObjectSetText("PivotTextSupport1" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Sup2 " + DoubleToString(LastSupport1[shift][x], _Digits) + " (" + DoubleToString((LastSupport1[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", SupportColor);
        ObjectSetText("PivotTextSupport2" + " " + shift + "," + PeriodName[x], timeframe_prefix + "Sup3 " + DoubleToString(LastSupport2[shift][x], _Digits) + " (" + DoubleToString((LastSupport2[shift][x] - Close[0]) / SYS_POINT, 1) + " pts)", 7, "Arial", SupportColor);
    }
}

void Pivots_DeleteGraphics(int x) {
    int Nbr = 3;

    if (x >= P_D1) Nbr = 3;
    for (int shift = 1; shift <= Nbr; shift++) {
        ObjectDelete("PivotHighLine" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotLowLine" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotLine" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotResistanceLine" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotSupportLine" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotResistanceLine1" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotSupportLine1" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotResistanceLine2" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotSupportLine2" + " " + shift + "," + PeriodName[x]);

        ObjectDelete("PivotHighLineR" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotLowLineR" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotLineR" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotResistanceLineR" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotSupportLineR" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotResistanceLine1R" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotSupportLine1R" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotResistanceLine2R" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotSupportLine2R" + " " + shift + "," + PeriodName[x]);

        ObjectDelete("PivotTextLow" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextHigh" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotText" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextResistance" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextSupport" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextResistance1" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextSupport1" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextResistance2" + " " + shift + "," + PeriodName[x]);
        ObjectDelete("PivotTextSupport2" + " " + shift + "," + PeriodName[x]);
    }
    return;
}
// END PIVOTS_GRAPHICS

// FIBO GRAPHICS

void Fibo_InitGraphics(int x) {

}

void Fibo_DrawGraphics(int x) {
    int CurrentPeriod = Period2Int(_Period);
    if (!GraphicMode) return;

    if (CurrentPeriod > x) return;

    double FiboLevel = SValue(FIBOLEVEL, S_CURRENT, x);
    double FiboStopLossLevel = SValue(FIBOSTOPLOSSLEVEL, S_CURRENT, x);

    color c;
    string s;

    if (AndS(FIBOLEVEL, S_BEAR, x)) {
        c = Pink;
        s = " Sell Level " + PeriodName[x];
    } else {
        c = PaleGreen;
        s = " Buy Level " + PeriodName[x];
    }

    if (ObjectFind("fl" + x) != 0) {
        ObjectCreate("fl" + x, OBJ_TEXT, 0, Time[0] - _Period * 1700, FiboLevel);
        ObjectSetText("fl" + x, s, 7, "Arial", c);
        ObjectSetInteger(0, "fl" + x, OBJPROP_SELECTABLE, false);

    } else {
        ObjectSet("fl" + x, OBJPROP_TIME1, Time[0] - _Period * 1700);
        ObjectSet("fl" + x, OBJPROP_PRICE1, FiboLevel);
        ObjectSet("fl" + x, OBJPROP_COLOR, c);
        ObjectSetText("fl" + x, s, 7, "Arial", c);
    }
    //----
    if (ObjectFind("fl Line" + x) != 0) {
        ObjectCreate("fl Line" + x, OBJ_TREND, 0, Time[0], FiboLevel, Time[1], FiboLevel);
        ObjectSet("fl Line" + x, OBJPROP_STYLE, STYLE_DASHDOT);
        ObjectSet("fl Line" + x, OBJPROP_COLOR, c);
        ObjectSetInteger(0, "fl Line" + x, OBJPROP_SELECTABLE, false);

    } else {
        ObjectMove("fl Line" + x, 0, Time[0], FiboLevel);
        ObjectMove("fl Line" + x, 1, Time[1], FiboLevel);
        ObjectSet("fl Line" + x, OBJPROP_COLOR, c);
    }

    if (ObjectFind("fsl" + x) != 0) {
        ObjectCreate("fsl" + x, OBJ_TEXT, 0, Time[0] - _Period * 1700, FiboStopLossLevel);
        ObjectSetText("fsl" + x, " StopLoss Level " + PeriodName[x], 7, "Arial", c);
        ObjectSetInteger(0, "fsl" + x, OBJPROP_SELECTABLE, false);

    } else {
        ObjectSet("fsl" + x, OBJPROP_TIME1, Time[0] - _Period * 1700);
        ObjectSet("fsl" + x, OBJPROP_PRICE1, FiboStopLossLevel);
        ObjectSet("fsl" + x, OBJPROP_COLOR, c);
    }

    if (ObjectFind("fsl Line" + x) != 0) {
        ObjectCreate("fsl Line" + x, OBJ_TREND, 0, Time[0], FiboStopLossLevel, Time[1], FiboStopLossLevel);
        ObjectSet("fsl Line" + x, OBJPROP_STYLE, STYLE_DASHDOT);
        ObjectSet("fsl Line" + x, OBJPROP_COLOR, c);
        ObjectSetInteger(0, "fsl Line" + x, OBJPROP_SELECTABLE, false);

    } else {
        ObjectMove("fsl Line" + x, 0, Time[0], FiboStopLossLevel);
        ObjectMove("fsl Line" + x, 1, Time[1], FiboStopLossLevel);
        ObjectSet("fsl Line" + x, OBJPROP_COLOR, c);
    }

    /*
      if (ObjectFind("tp1") != 0)
      {
         ObjectCreate("tp1", OBJ_TEXT, 0, Time[0], FiboTakeProfit1);
         ObjectSet("tp1", OBJPROP_COLOR, c);
         ObjectSetText("tp1", " PROFIT TARGET 1", 8, "Arial");
		 ObjectSetInteger(0,"tp1" ,OBJPROP_SELECTABLE,false);

      }
      else
      {
         ObjectSet("tp1",    OBJPROP_TIME1,   Time[0]);
         ObjectSet("tp1",    OBJPROP_PRICE1,  FiboTakeProfit1);
         ObjectSet("tp1", OBJPROP_COLOR, c);
      }
         //---
      if (ObjectFind("tp1 Line") != 0)
      {
         ObjectCreate("tp1 Line", OBJ_HLINE, 0, Time[0],FiboTakeProfit1);
         ObjectSet("tp1 Line", OBJPROP_STYLE, STYLE_DASHDOTDOT);
         ObjectSet("tp1 Line", OBJPROP_COLOR, c );
		 ObjectSetInteger(0,"tp1 Line" ,OBJPROP_SELECTABLE,false);

      }
      else
      {
         ObjectMove("tp1 Line",0, Time[0],FiboTakeProfit1 );
         ObjectSet("tp1 Line", OBJPROP_COLOR, c);
      }
         //----
      if(ObjectFind("tp2") != 0)
      {
         ObjectCreate("tp2", OBJ_TEXT, 0, Time[0], FiboTakeProfit2);
         ObjectSet("tp2", OBJPROP_COLOR, c);
         ObjectSetText("tp2", " PROFIT TARGET 2", 8, "Arial");
		 ObjectSetInteger(0,"tp2" ,OBJPROP_SELECTABLE,false);

      }
      else
      {
         ObjectSet("tp2",    OBJPROP_TIME1,   Time[0]);
         ObjectSet("tp2",    OBJPROP_PRICE1,  FiboTakeProfit2);
         ObjectSet("tp2", OBJPROP_COLOR, c);

      }
      if (ObjectFind("tp2 Line") != 0)
      {
         ObjectCreate("tp2 Line", OBJ_HLINE, 0, Time[0],FiboTakeProfit2);
         ObjectSet("tp2 Line", OBJPROP_STYLE, STYLE_DASHDOTDOT);
         ObjectSet("tp2 Line", OBJPROP_COLOR, c );
		 ObjectSetInteger(0,"tp2 Line" ,OBJPROP_SELECTABLE,false);

      }
      else
      {
          ObjectMove("tp2 Line",0, Time[0],FiboTakeProfit2);
          ObjectSet("tp2 Line", OBJPROP_COLOR, c);
      }
         //----
      if (ObjectFind("tp3") != 0)
      {
         ObjectCreate("tp3", OBJ_TEXT, 0, Time[0], FiboTakeProfit3);
         ObjectSet("tp3", OBJPROP_COLOR, c);
         ObjectSetText("tp3", " PROFIT TARGET 3", 8, "Arial");
		 ObjectSetInteger(0,"tp3" ,OBJPROP_SELECTABLE,false);

      }
      else
      {
         ObjectSet("tp3",    OBJPROP_TIME1,   Time[0]);
         ObjectSet("tp3",    OBJPROP_PRICE1,  FiboTakeProfit3);
         ObjectSet("tp3", OBJPROP_COLOR, c);    
      }
         //----
      if (ObjectFind("tp3 Line") != 0)
      {
         ObjectCreate("tp3 Line", OBJ_HLINE, 0, Time[0],FiboTakeProfit3);
         ObjectSet("tp3 Line", OBJPROP_STYLE, STYLE_DASHDOTDOT);
         ObjectSet("tp3 Line", OBJPROP_COLOR, c );
		 ObjectSetInteger(0,""tp3 Line" ,OBJPROP_SELECTABLE,false);
      }
      else
      {
         ObjectMove("tp3 Line",0, Time[0],FiboTakeProfit3);
         ObjectSet("tp3 Line", OBJPROP_COLOR, c);
      }
   */
}

void Fibo_DeleteGraphics(int x) {
    ObjectDelete("fl" + x);
    ObjectDelete("fl Line" + x);
    ObjectDelete("fsl" + x);
    ObjectDelete("fsl Line" + x);
    /*   ObjectDelete("tp3");
       ObjectDelete("tp3 Line");
       ObjectDelete("tp2");
       ObjectDelete("tp2 Line");
       ObjectDelete("tp1");
       ObjectDelete("tp1 Line");
       ObjectDelete("fb");
       ObjectDelete("fb Line");
    */
}





//-------------------------------------------------------------END PANEL DRAWING------------------------------------------------------------------------

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

datetime GetTimeLocal() {
    int TimeArray[4];
    int nYear, nMonth, nDay, nHour, nMin, nSec;

    GetLocalTime(TimeArray);

    nYear = TimeArray[0] & 0x0000FFFF;
    nMonth = TimeArray[0] >> 16;
    nDay = TimeArray[1] >> 16;
    nHour = TimeArray[2] & 0x0000FFFF;
    nMin = TimeArray[2] >> 16;
    nSec = TimeArray[3] & 0x0000FFFF;

    string st = FormatDateTime(nYear, nMonth, nDay, nHour, nMin, nSec);
    datetime d = StrToTime(st);
    return (d);
}
datetime GetTimeGMT() {
    int TimeArray[4];
    int nYear, nMonth, nDay, nHour, nMin, nSec;
    int TZInfoArray[43];
    /*
       
       GetLocalTime(TimeArray);

       nYear=TimeArray[0]&0x0000FFFF;
       nMonth=TimeArray[0]>>16;
       nDay=TimeArray[1]>>16;
       nHour=TimeArray[2]&0x0000FFFF;
       nMin=TimeArray[2]>>16;
       nSec=TimeArray[3]&0x0000FFFF;
       
       string st = FormatDateTime(nYear,nMonth,nDay,nHour,nMin,nSec);
       datetime d = StrToTime(st);
    */

    int gmt_shift = 0;
    int ret = GetTimeZoneInformation(TZInfoArray);
    if (ret != 0) gmt_shift = TZInfoArray[0];
    if (ret == 2) gmt_shift += TZInfoArray[42];
    return (CurrentTime + gmt_shift * 60);
}

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

string ReturnTextMonth(int m) {
    string r;
    switch (m) {
    case 1:
        r = "January";
        break;
    case 2:
        r = "February";
        break;
    case 3:
        r = "March";
        break;
    case 4:
        r = "April";
        break;
    case 5:
        r = "May";
        break;
    case 6:
        r = "June";
        break;
    case 7:
        r = "July";
        break;
    case 8:
        r = "August";
        break;
    case 9:
        r = "September";
        break;
    case 10:
        r = "October";
        break;
    case 11:
        r = "November";
        break;
    case 12:
        r = "December";
        break;
    default:
        r = "---";
    }
    return (r);
}

datetime ReturnStartMonth(datetime dt, int shift = 0) {
    int i, y, m;

    if (dt == 0) dt = TimeCurrent();

    y = TimeYear(dt);
    m = TimeMonth(dt);

    while (shift != 0) {
        if (shift > 0) {
            shift--;
            m++;
            if (m > 12) {
                m = 1;
                y++;
            }
        }
        if (shift < 0) {
            shift++;
            m--;
            if (m < 1) {
                m = 12;
                y--;
            }
        }
    }

    dt = StrToTime(y + "." + m + ".1");

    return (dt);
}

datetime ReturnStartWeek(datetime dt, int shift = 0) {
    datetime r;

    r = dt + shift * PERIOD_W1 * 60;

    r = r / (PERIOD_D1 * 60);
    r = r * (PERIOD_D1 * 60); // - çäåñü ïîëó÷èëè âðåìÿ íà÷àëà äíÿ

    switch (TimeDayOfWeek(r)) {
    case 1:
        break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
        r = r - (PERIOD_D1 * 60) * (TimeDayOfWeek(r) - 1);
        break;
    case 0:
        r = r - (PERIOD_D1 * 60) * 6;
        break;
    }
    return (r);
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
    MMDailyPercentStopLoss = StrToDouble(PercentSL);

    MMWeeklyPercentTargetAmount = StrToDouble(PercentWTarget);
    MMWeeklyPercentStopLoss = StrToDouble(PercentWSL);

    
    ReloadMM();
    Send_Operation("Money Management : " + targetmessage + slmessage);
    return;
}

void TreatMM() {

    // MONEY MANAGEMENT

    MMDailyClosedProfit = ReturnClosedProfit(-1, -1, -1, PERIOD_D1, 1);
    MMDailySymbolClosedProfit = ReturnClosedProfit(-1, -1, -1, PERIOD_D1);
    double dailystartequity = AccountEquity() - (MMDailyClosedProfit + AccountProfit());;
    double weeklystartequity =  AccountEquity() - (MMWeeklyClosedProfit + AccountProfit());
    
    if (MMDailyPercentTargetAmount != 0) {
        MMDailyTargetAmount = dailystartequity * MMDailyPercentTargetAmount/100;
    }    
    if (MMWeeklyPercentTargetAmount!= 0) {
        MMWeeklyTargetAmount = weeklystartequity * MMWeeklyPercentTargetAmount/100;
    }

    if (MMDailyStopLoss != 0){
        MMDailyTargetAmount = dailystartequity * MMDailyPercentStopLoss/100;
    }    
    
    if (MMWeeklyStopLoss != 0){
        MMWeeklyTargetAmount = weeklystartequity * MMWeeklyPercentStopLoss/100;
    }

    if (!MMDailySymbolTargetReached) {
        if (MMDailySymbolTargetAmount != -1) {
            if (MMDailySymbolClosedProfit + B_TotalProfit + B_TotalHedgeProfit >= MMDailySymbolTargetAmount) {
                MMDailySymbolTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily " + _Symbol + " Target of " + MMDailySymbolTargetAmount + " is reached");
            }
        }
        if (MMDailySymbolStopLoss != -1) {
            if (MMDailySymbolClosedProfit + B_TotalProfit + B_TotalHedgeProfit < -MMDailySymbolStopLoss) {
                MMDailySymbolTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily " + _Symbol + " Stop Loss of " + MMDailySymbolStopLoss + " is reached");
            }
        }
    }
    if (!MMDailyTargetReached) {
        if (MMDailyTargetAmount != 0) {
            if (MMDailyClosedProfit + AccountProfit() >= MMDailyTargetAmount) {
                MMDailyTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily Target of " + MMDailyTargetAmount + " is reached");
            }
        }
        if (MMDailyStopLoss != 0) {
            if (MMDailyClosedProfit + AccountProfit() < -MMDailyStopLoss) {
                MMDailyTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily Stop Loss of " + MMDailyStopLoss + " is reached");
            }
        }
    }

    MMWeeklyClosedProfit = ReturnClosedProfit(-1, -1, -1, PERIOD_W1, 1);
    MMWeeklySymbolClosedProfit = ReturnClosedProfit(-1, -1, -1, PERIOD_W1);
    
    
    if (!MMWeeklySymbolTargetReached) {
        if (MMWeeklySymbolTargetAmount != -1) {
            if (MMWeeklySymbolClosedProfit + B_TotalProfit + B_TotalHedgeProfit >= MMWeeklySymbolTargetAmount) {
                MMWeeklySymbolTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Weekly " + _Symbol + " Target of " + MMWeeklySymbolTargetAmount + " is reached");
            }
        }
        if (MMWeeklySymbolStopLoss != -1) {
            if (MMWeeklySymbolClosedProfit + B_TotalProfit + B_TotalHedgeProfit < -MMWeeklySymbolStopLoss) {
                MMWeeklySymbolTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Weekly " + _Symbol + " Stop Loss of " + MMWeeklySymbolStopLoss + " is reached");
            }
        }
    }
    if (!MMWeeklyTargetReached) {
        if (MMWeeklyTargetAmount != 0) {
            if (MMWeeklyClosedProfit + AccountProfit() >= MMWeeklyTargetAmount)   { 
                MMWeeklyTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Weekly Target of " + MMWeeklyTargetAmount + " is reached");
            }
        }
        if (MMWeeklyStopLoss != 0) {
            if (MMWeeklyClosedProfit + AccountProfit() < -MMWeeklyStopLoss) {
                MMWeeklyTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Weekly Stop Loss of " + MMWeeklyStopLoss + " is reached");
            }
        }
    }


    // MONEY MANGEMENT END
}

//+------------------------------------------------------------------+

int hSession(int Direct) {
    string InternetAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; Q312461)";

    int hSession_IEType = InternetOpenW(InternetAgent, Direct, "0", "0", 0);

    return (hSession_IEType);
}
//HTTP

/////////////////////
// FTP

void FTPDownloadNews(string filename, string tofilename = NULL) {
    int hIntObj, hIntObjConn;
    bool success = false;
    string LocalFile;
    string ServerFile;

    ServerFile = "/Terminal/" + "/MQL4/Files/" + filename;

    if (TestMode)
        LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\tester\\Files\\" + ((tofilename != NULL) ? tofilename : filename);
    else
        LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Files\\" + ((tofilename != NULL) ? tofilename : filename);

    hIntObj = hSession(true);

    if (hIntObj > 0) {
        hIntObjConn = InternetConnectW(hIntObj, FTPServerName, FTPPort, FTPUserName, FTPPassword, INTERNET_SERVICE_FTP, 0, 0);
        if (hIntObjConn > 0) {
            success = FtpGetFileW(hIntObjConn, ServerFile, LocalFile, false, 128, INTERNET_FLAG_RELOAD, NULL);
        } else
            printf("login failed. %d", GetLastError());
    }
    InternetCloseHandle(hIntObj);
    if (success == false)
        printf("Downloading error. %d + %s --- %s", GetLastError(), LocalFile, ServerFile);
}

void FTPDownloadExpert(string filename, string tofilename = NULL) {
    int hIntObj, hIntObjConn;
    bool success = false;
    string LocalFile;
    string ServerFile;

    ServerFile = UserPath + "/MQL4/Experts/" + filename;
    LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Experts\\Market\\" + ((tofilename != NULL) ? tofilename : filename);

    hIntObj = hSession(true);

    if (hIntObj > 0) {
        hIntObjConn = InternetConnectW(hIntObj, FTPServerName, FTPPort, FTPUserName, FTPPassword, INTERNET_SERVICE_FTP, 0, 0);
        if (hIntObjConn > 0) {
            success = FtpGetFileW(hIntObjConn, ServerFile, LocalFile, false, 128, INTERNET_FLAG_RELOAD, NULL);
        } else
            printf("login failed. %d", GetLastError());
    }
    InternetCloseHandle(hIntObj);
    if (success == false)
        printf("Downloading Expert error. %d + %s --- %s", GetLastError(), LocalFile, ServerFile);
}

void FTPDownloadFile(string filename, string tofilename = NULL) {
    int hIntObj, hIntObjConn;
    bool success = false;
    string LocalFile;
    string ServerFile;

    if (!TestMode)
        ServerFile = UserPath + "/MQL4/Files/" + filename;
    else
        ServerFile = UserPath + "/tester/files/" + filename;

    if (TestMode)
        LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\tester\\files\\" + ((tofilename != NULL) ? tofilename : filename);
    else
        LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Files\\" + ((tofilename != NULL) ? tofilename : filename);

    hIntObj = hSession(true);

    if (hIntObj > 0) {
        hIntObjConn = InternetConnectW(hIntObj, FTPServerName, FTPPort, FTPUserName, FTPPassword, INTERNET_SERVICE_FTP, 0, 0);
        if (hIntObjConn > 0) {
            success = FtpGetFileW(hIntObjConn, ServerFile, LocalFile, false, 128, INTERNET_FLAG_RELOAD, NULL);
        } else
            printf("login failed. %d", GetLastError());
    }
    InternetCloseHandle(hIntObj);
    if (success == false)
        printf("Downloading error. %d + %s --- %s", GetLastError(), "", ServerFile);
}
////

void FTPDownloadExperts() {
    int hIntObj, hIntObjConn;
    bool success = false;
    string ServerDirectory = UserPath + "/MQL4/Experts/";
    string LocalDirectory = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Experts\\Markets";

    string data = "";

    hIntObj = hSession(true);
    if (hIntObj > 0) {
        hIntObjConn = InternetConnectW(hIntObj, FTPServerName, FTPPort, FTPUserName, FTPPassword, INTERNET_SERVICE_FTP, 0, 0);
        if (hIntObjConn > 0) {

            success = FtpSetCurrentDirectoryW(hIntObjConn, ServerDirectory);
            if (success == true) {
                int read = 500;
                uchar Buffer[500];
                string sresult = "";

                while (FtpGetCurrentDirectoryW(hIntObjConn, Buffer, read)) {
                    if (success == false || read <= 0) break;
                    sresult = sresult + CharArrayToString(Buffer, 0, read);
                    printf("Result Directory : %s length %d", sresult, read);
                }

                if (success == true) {
                    printf("Experts Directory : %s", ServerDirectory);
                    printf("Result Directory : %s length %d", sresult, read);
                } else {
                    printf("FtpGetCurrentDirectoryW %d", GetLastError());
                }
            }
        } else
            printf("login failed. %d", hIntObjConn);
    }
    InternetCloseHandle(hIntObj);

    if (success == false)
        printf("Downloading Experts error");

}

void FTPDownloadIndicator(string filename) {
    int hIntObj, hIntObjConn;
    bool success = false;
    int ret;
    string ServerFile = UserPath + "/MQL4/Indicators/" + filename + ".ex4";
    string IndicatorPath = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Indicators\\";
    string LocalFile = IndicatorPath + filename + ".ex4";

    iCustom(NULL, 0, filename, 0, 0);
    ret = GetLastError();

    if (ret != ERR_INDICATOR_CANNOT_LOAD)
        return;

    hIntObj = hSession(true);

    if (hIntObj > 0) {
        hIntObjConn = InternetConnectW(hIntObj, FTPServerName, FTPPort, FTPUserName, FTPPassword, INTERNET_SERVICE_FTP, 0, 0);
        if (hIntObjConn > 0) {
            success = FtpGetFileW(hIntObjConn, ServerFile, LocalFile, false, 128, INTERNET_FLAG_RELOAD, NULL);
        } else
            printf("login failed. %d", hIntObjConn);
    }

    InternetCloseHandle(hIntObj);
    if (success == false)
        printf("Downloading error. %s", LocalFile);

}

int FTPDownloadLibrary(string filename, string tofilename = NULL) {
    int hIntObj, hIntObjConn;
    bool success = false;
    string ServerFile;
    string LocalFile;

    ServerFile = UserPath + "/MQL4/Libraries/" + filename;
    LocalFile  = TerminalInfoString(TERMINAL_DATA_PATH) +  "\\MQL4\\Libraries\\" + ((tofilename != NULL) ? tofilename : filename);

    hIntObj = hSession(true);
    if (hIntObj > 0) {
        hIntObjConn = InternetConnectW(hIntObj, FTPServerName, FTPPort, FTPUserName, FTPPassword, INTERNET_SERVICE_FTP, 0, 0);
        if (hIntObjConn > 0) {
            success = FtpGetFileW(hIntObjConn, ServerFile, LocalFile, FALSE, 128, FTP_TRANSFER_TYPE_BINARY, NULL);
        } else
            printf("login failed. %d", hIntObjConn);
    }
    InternetCloseHandle(hIntObj);

    if (success == false) {
        printf("Downloading error. %s %d ", ServerFile, GetLastError());
        return -1;
    }
    return 1;

}


// HTTP
void HTTPUploadHistoryFile(string symbol, int period) {

    if (TestMode) {
        return;
    }
    string url      = "/php/save_history.php";
   
    string LocalFile = symbol + PeriodIndex[period] + ".hst";

    int handle = FileOpenHistory(LocalFile, FILE_BIN|FILE_READ);

    if (handle < 1) {
        Print("Cannot open file " +  LocalFile);
        return -1;
    }

    char   filecontent[]; 
    if (FileReadArray (handle, filecontent) != FileSize(handle)) {
         FileClose(handle);
         Print("Error reading the file \""+ LocalFile + "\"");
         return -1;
    }

    FileClose(handle);

    Print ("UPLOADIND ", LocalFile);

    int handler     = hSession(1);

    int hIntObjConn = InternetConnectW(handler, HTTPServerName, 80, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 1);
      
    if (hIntObjConn == 0) {
        InternetCloseHandle(handler);        
        return -1;
    }
    
    string acceptTypes[1] = {"*/*"};    
    int hRequest    = HttpOpenRequestW(hIntObjConn, "POST", url, NULL, NULL, acceptTypes, 0, 1);

    if (hRequest == 0) {
        InternetCloseHandle(handler);        
        InternetCloseHandle(hIntObjConn);     
        return -1;
    }

    string headers  = "Content-Type: application/x-www-form-urlencoded";
   
    string params   = "content=" + CharArrayToString(filecontent) + "&userpath=" + UserPath + "&filename=" + LocalFile;


    int response    = HttpSendRequestW(hRequest, headers, StringLen(headers),  params,  StringLen(params));
    if (!response) {
        InternetCloseHandle(handler);        
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(hRequest); 
        return -1;
    }
    
    uchar TabChar[128];
    int dwBytes;
    int BytesWritten[1] = {0};

    while (InternetReadFile(hRequest, TabChar, 128, dwBytes)) {
        if (dwBytes <= 0) break;
        Print ("OOOOOOOOOOOOOOOOOOOO " + CharArrayToString(TabChar, 0, dwBytes));
    }


    InternetCloseHandle(handler);    
    InternetCloseHandle(hIntObjConn);      
    InternetCloseHandle(hRequest);
    InternetCloseHandle(response);
    
    Print ("Uploading OK ", LocalFile);
    return 1;
}

void HTTPDownloadFile(string filename, string tofilename = NULL) {
    string LocalFile;
    string ServerFile;

    if (!TestMode)
        ServerFile =  UserPath + "/MQL4/Files/" + filename;
    else
        ServerFile =  UserPath + "/tester/files/" + filename;

    if (TestMode)
        LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\tester\\files\\" + ((tofilename != NULL) ? tofilename : filename);
    else
        LocalFile = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Files\\" + ((tofilename != NULL) ? tofilename : filename);

    
    Print("DOWNLOADING ", ServerFile);
    string headers = "Content-Type: application/x-www-form-urlencoded";
    int handler     = hSession(1);

    
    int hIntObjConn = InternetConnectW(handler, HTTPServerName, 80, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
      
    if (hIntObjConn == 0) {
        InternetCloseHandle(handler);        
        return -1;
    }
    string acceptTypes[1] = {"*/*"};    
    int hRequest    = HttpOpenRequestW(hIntObjConn, "POST", "/php/load_file.php?file=" + ServerFile, NULL, NULL, acceptTypes, INTERNET_FLAG_RELOAD | INTERNET_FLAG_PRAGMA_NOCACHE | INTERNET_FLAG_DONT_CACHE, 0);
    if (hRequest == 0) {
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        return -1;
    }

    int response    = HttpSendRequestW(hRequest, headers, StringLen(headers), NULL, 0);
    if (response == 0) {
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        InternetCloseHandle(hRequest); 
        return -1;
    }

  
//    int response     = InternetOpenUrlW(handler, ServerFile, headers,StringLen(headers), INTERNET_FLAG_NEED_FILE | INTERNET_FLAG_RELOAD | INTERNET_FLAG_RESYNCHRONIZE |INTERNET_FLAG_KEEP_CONNECTION |INTERNET_FLAG_PRAGMA_NOCACHE |INTERNET_FLAG_NO_CACHE_WRITE );

    int file_handle = CreateFileW(LocalFile, 0x40000000 /* GENERIC_WRITE */, 0, 0,  2 /* CREATE_ALWAYS */, 0, 0); 
    if (file_handle == -1) {
        Print("Downloading error ", LocalFile);
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        InternetCloseHandle(hRequest); 
        InternetCloseHandle(response); 
        return -1;
    }

    uchar TabChar[128];
    int dwBytes;
    int BytesWritten[1] = {0};
    while (InternetReadFile(hRequest, TabChar, 128, dwBytes)) {
        if (dwBytes <= 0) break;
        WriteFile(file_handle, TabChar, dwBytes, BytesWritten, 0);
    }
    InternetCloseHandle(hIntObjConn);      
    InternetCloseHandle(hRequest);
    InternetCloseHandle(response);
    InternetCloseHandle(handler);
    CloseHandle (file_handle);
    Print("Downloaded OK ");
    return 1;
}

int HTTPDownloadLibrary(string filename, string tofilename = NULL) {
    string ServerFile;
    string LocalFile;

   
   
    ServerFile  = UserPath + "/MQL4/Libraries/" + filename;
    LocalFile   = TerminalInfoString(TERMINAL_DATA_PATH) +  "\\MQL4\\Libraries\\" + ((tofilename != NULL) ? tofilename : filename);

    //string url      = "/php/load_file.php?file=" + ServerFile;
   
    

    Print("DOWNLOADING ", ServerFile);
    string headers = "Content-Type: application/x-www-form-urlencoded";
    int handler     = hSession(1);

    
    int hIntObjConn = InternetConnectW(handler, HTTPServerName, 80, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
     
    if (hIntObjConn == 0) {
        InternetCloseHandle(handler);        
        return -1;
    }
    string acceptTypes[1] = {"*/*"};    
    int hRequest    = HttpOpenRequestW(hIntObjConn, "POST", "/php/load_file.php?file=" + ServerFile, NULL, NULL, acceptTypes, INTERNET_FLAG_RELOAD | INTERNET_FLAG_PRAGMA_NOCACHE | INTERNET_FLAG_DONT_CACHE, 0);
    if (hRequest == 0) {
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        return -1;
    }

    int response    = HttpSendRequestW(hRequest, headers, StringLen(headers), NULL, 0);
    if (response == 0) {
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        InternetCloseHandle(hRequest); 
        return -1;
    }

  
//    int response     = InternetOpenUrlW(handler, ServerFile, headers,StringLen(headers), INTERNET_FLAG_NEED_FILE | INTERNET_FLAG_RELOAD | INTERNET_FLAG_RESYNCHRONIZE |INTERNET_FLAG_KEEP_CONNECTION |INTERNET_FLAG_PRAGMA_NOCACHE |INTERNET_FLAG_NO_CACHE_WRITE );

    int file_handle = CreateFileW(LocalFile, 0x40000000 /* GENERIC_WRITE */, 0, 0,  2 /* CREATE_ALWAYS */, 0, 0); 
    
    if (file_handle == -1) {
        Print("Downloading error ", LocalFile);
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        InternetCloseHandle(hRequest); 
        InternetCloseHandle(response); 
        return -1;
    }

    uchar TabChar[128];
    int dwBytes;
    int BytesWritten[1] = {0};
    
    string httpresponse = "";
    
    while (InternetReadFile(hRequest, TabChar, 128, dwBytes)) {
        if (dwBytes <= 0) break;
//        httpresponse = CharArrayToString(TabChar, 0, dwBytes);       
        WriteFile(file_handle, TabChar, dwBytes, BytesWritten, 0);
    }
    InternetCloseHandle(hIntObjConn);      
    InternetCloseHandle(hRequest);
    InternetCloseHandle(response);
    InternetCloseHandle(handler);
    CloseHandle (file_handle);
    Print("Downloaded OK");
    return 1;
}

void HTTPDownloadIndicator(string filename) {
    string ServerFile    = UserPath + "/MQL4/Indicators/" + filename + ".ex4";
    string IndicatorPath = TerminalInfoString(TERMINAL_DATA_PATH) + "\\MQL4\\Indicators\\";
    string LocalFile = IndicatorPath + filename + ".ex4";
    int ret;

    iCustom(NULL, 0, filename, 0, 0);
    ret = GetLastError();

    if (ret != ERR_INDICATOR_CANNOT_LOAD)
        return;

    Print("DOWNLOADING ", ServerFile);
    string headers = "Content-Type: application/x-www-form-urlencoded";
    int handler     = hSession(1);

    
    int hIntObjConn = InternetConnectW(handler, HTTPServerName, 80, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
     
    if (hIntObjConn == 0) {
        InternetCloseHandle(handler);        
        return -1;
    }
    string acceptTypes[1] = {"*/*"};    
    int hRequest    = HttpOpenRequestW(hIntObjConn, "POST", "/php/load_file.php?file=" + ServerFile, NULL, NULL, acceptTypes, INTERNET_FLAG_RELOAD | INTERNET_FLAG_PRAGMA_NOCACHE | INTERNET_FLAG_DONT_CACHE, 0);
    if (hRequest == 0) {
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        return -1;
    }

    int response    = HttpSendRequestW(hRequest, headers, StringLen(headers), NULL, 0);
    if (response == 0) {
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        InternetCloseHandle(hRequest); 
        return -1;
    }

  
//    int response     = InternetOpenUrlW(handler, ServerFile, headers,StringLen(headers), INTERNET_FLAG_NEED_FILE | INTERNET_FLAG_RELOAD | INTERNET_FLAG_RESYNCHRONIZE |INTERNET_FLAG_KEEP_CONNECTION |INTERNET_FLAG_PRAGMA_NOCACHE |INTERNET_FLAG_NO_CACHE_WRITE );

    int file_handle = CreateFileW(LocalFile, 0x40000000 /* GENERIC_WRITE */, 0, 0,  2 /* CREATE_ALWAYS */, 0, 0); 
    if (file_handle == -1) {
        Print("Downloading error ", LocalFile);
        InternetCloseHandle(hIntObjConn);     
        InternetCloseHandle(handler);        
        InternetCloseHandle(hRequest); 
        InternetCloseHandle(response); 
        return -1;
    }

    uchar TabChar[128];
    int dwBytes;
    int BytesWritten[1] = {0};
    while (InternetReadFile(hRequest, TabChar, 128, dwBytes)) {
        if (dwBytes <= 0) break;
        WriteFile(file_handle, TabChar, dwBytes, BytesWritten, 0);
    }
    InternetCloseHandle(hIntObjConn);      
    InternetCloseHandle(hRequest);
    InternetCloseHandle(response);
    InternetCloseHandle(handler);
    CloseHandle (file_handle);
    Print("Downloaded OK");
    return 1;

}

//////////////////////////////// LOAD FILES ///////////////////////////////////////////////////////

void DownloadFile(string filename, string tofilename = NULL) {
    if (FTPMODE)
        FTPDownloadFile(filename, tofilename);
    else
        HTTPDownloadFile(filename, tofilename);
}

void DownloadIndicator(string filename) {
    if (FTPMODE)
        FTPDownloadIndicator(filename);
    else
        HTTPDownloadIndicator(filename);
}

int DownloadLibrary(string filename, string tofilename = NULL) {
    if (FTPMODE)
        return FTPDownloadLibrary(filename, tofilename);
    else
        return HTTPDownloadLibrary(filename, tofilename);

}

int LoadProject() {

    LoadObjects();
    LoadEngines(); // loadengines
    LoadPanel();
    LoadAlerts();
    LoadSchedules(); // loadengines   
    LoadFilters();
    LoadMM();
    LoadIndicators();
    return 1;
}

int ReloadObjects() {
    int result = LoadObjects();
    if (result == -1) {
        Send_Operation("Objects can not be reloaded");

    }
}

int LoadObjects() {
    O_NbrObject = 0;

    DownloadFile("PG_Objects.csv", "PG_Objects_" + SYS_SYMBOL);

    int file = FileOpen("PG_Objects_" + SYS_SYMBOL, FILE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_INFO, "Objects file doesnt exit ", NO_SEND);
        return (-1);
    }
    if (FileSize(file) == 0) {
        FileClose(file);
        return 0;
    }
    //skip  first line
    int i = 0;
    while (i < 61) {
        FileReadString(file);
        i++;
    }
    i = 0;

    string par1;
    string par2;
    string par3;
    string par4;
    string par5;
    int nbr_sysobj = 0;
    while (!FileIsEnding(file)) {
        ObjUsed[i] = true;
        ObjId[i] = StrToInteger(FileReadString(file));
        ObjName[i] = FileReadString(file);
        ObjType[i] = ObjType2Int(FileReadString(file));
        ObjCross[i] = FileReadString(file);

        par1 = FileReadString(file);
        par2 = FileReadString(file);
        par3 = FileReadString(file);
        par4 = FileReadString(file);
        par5 = FileReadString(file);
        ObjDisplayType[i] = StrToInteger(FileReadString(file));
        ObjDisplay[i] = StrToInteger(FileReadString(file));
        ObjLevelType[i] = StrToInteger(FileReadString(file));
        for (int k = 0; k < 4; k++)
            ObjValue[i][k] = StrToInteger(FileReadString(file));
        for (int l = 0; l < 5; l++)
            for (k = 0; k < NBR_PERIODS; k++) {
                string str = FileReadString(file);
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
    FileClose(file);
    O_NbrObject = i;
    O_NbrSysObject = nbr_sysobj;

    return (i);
}

void ReloadEngines() {
    ResetEngines(1);
    LoadEngines(); // loadengines
    Send_Operation("Engines File reloaded");
}

int LoadEngines() {
    E_NbrEngine = 0;
    int Engine = 0;

    DownloadFile("PG_Engines.csv", "PG_Engines_" + SYS_SYMBOL);

    int file = FileOpen("PG_Engines_" + SYS_SYMBOL, FILE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_INFO, "No Engine is defined ", NO_SEND);
        file = FileOpen("PG_Engines_" + SYS_SYMBOL, FILE_WRITE | FILE_CSV, ','); // just open an empty file
        FileClose(file);
        return (0);
    }
    if (FileSize(file) == 0) {
        FileClose(file);
        return (Engine);
    }
    //skip  first lines
    int i = 0;
    while (i < (NBR_ATTRIBUTES - 5)) {
        FileReadString(file);
        i++;
    }
    i = 0;

    while (!FileIsEnding(file)) {
        EngineName[Engine] = FileReadString(file);
        // Print (EngineName[Engine]);
        Set_Engine_Value(Engine, B_OPERATION, Operation2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_STARTRULE, Rule2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYRULE, Rule2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLRULE, Rule2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_EXITBUYRULE, Rule2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_EXITSELLRULE, Rule2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_EXITRULE, Rule2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_ILOT, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_MAXLOT, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_MAXCOUNT, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_DIRECTION, Direction2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_DIRECTIONTYPE, DirectionType2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_RECOVERYMODE, Mode2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_RECOVERYVALUE, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_PIPSTEP, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_TIMESTEP, StrToInteger(FileReadString(file)));

        Set_Engine_Value(Engine, B_ORDERTYPE, OrderType2Int(FileReadString(file)));
        Set_Engine_Value(Engine, B_KEEPBUYSELL, StringToBoolean(FileReadString(file)));
        Set_Engine_Value(Engine, B_ONEORDERPERBAR, StringToBoolean(FileReadString(file)));
        Set_Engine_Value(Engine, B_EXITMODE, ExitMode2Int(FileReadString(file)));

        Set_Engine_Value(Engine, B_MAXTIME, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_HEDGEMAGNITUDE, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_MINPROFIT, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYMINPROFIT, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLMINPROFIT, StrToDouble(FileReadString(file)));

        Set_Engine_Value(Engine, B_TP, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_TS, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_SL, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYTP, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYTS, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYSL, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLTP, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLTS, StrToDouble(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLSL, StrToDouble(FileReadString(file)));

        Set_Engine_Value(Engine, B_BUYLOTTP, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYLOTTS, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_BUYLOTSL, StrToInteger(FileReadString(file)));

        Set_Engine_Value(Engine, B_SELLLOTTP, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLLOTTS, StrToInteger(FileReadString(file)));
        Set_Engine_Value(Engine, B_SELLLOTSL, StrToInteger(FileReadString(file)));

        Engine++;
    }

    FileClose(file);
    E_NbrEngine = Engine;
    return (Engine);
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
    double y;
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

    News_DeleteGraphics(NewsMax);
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

        color c = Green;
        font = PanelFont;

        if (stImportance == "Low" || stImportance == "LOW") c = Yellow;
        else
        if (stImportance == "Medium" || stImportance == "MEDIUM") c = Orange;
        else
        if (stImportance == "High" || stImportance == "HIGH") {
            c = Red;
            font = PanelBFont;
        }

        if (Day() == TimeDay(Date)) {
            DateNewsToday[NewsNbrToday] = Date;
            DescNewsToday[NewsNbrToday] = stDescription;
            CurrNewsToday[NewsNbrToday] = stCurrency;
            ImportanceNewsToday[NewsNbrToday] = stImportance;
            ActualNewsToday[NewsNbrToday] = stActual;
            ForecastNewsToday[NewsNbrToday] = stForecast;
            PreviousNewsToday[NewsNbrToday] = stPrevious;
            ColorNewsToday[NewsNbrToday] = c;
            NewsNbrToday++;

        }

        // 10 last news
        if (CurrentTime <= Date + (NewsKeepTime * 60) && j < 10) {

            if (NewsNbrToday > 0 && ColorNewsToday[NewsNbrToday - 1] == Red && News) {
                int OriginY = 80;
                int OriginX = 1;

                ObjectCreate("NewsLine" + j, OBJ_VLINE, 0, Date, Close[0]);
                ObjectSet("NewsLine" + j, OBJPROP_COLOR, c);
                ObjectSet("NewsLine" + j, OBJPROP_STYLE, STYLE_DOT);
                ObjectSet("NewsLine" + j, OBJPROP_BACK, true);
                ObjectSetText("NewsLine" + j, stDate + " " + stTime + " - " + stDescription, 8);
                ObjectSetInteger(0, "NewsLine" + j, OBJPROP_SELECTABLE, false);
            }
            if (Panel_Window <= 0) continue;
            OriginX = PanelOriginNews;
            OriginY = 30;
            corner = 0;

            int offsetX = 0;
            ObjectCreate("CalendarDate" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarDate" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarDate" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarDate" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarDate" + j, TimeToString(GMTDate) + " GMT", PanelFontSize, PanelFont, c);
            ObjectSetInteger(0, "CalendarDate" + j, OBJPROP_SELECTABLE, false);

            offsetX += 100;

            ObjectCreate("CalendarCurr" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarCurr" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarCurr" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarCurr" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarCurr" + j, stCurrency, PanelFontSize, PanelFont, c);
            ObjectSetInteger(0, "CalendarCurr" + j, OBJPROP_SELECTABLE, false);

            offsetX += 30;

            ObjectCreate("CalendarDesc" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarDesc" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarDesc" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarDesc" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarDesc" + j, StringSubstr(stDescription, 0, 250), PanelFontSize, font, c);
            ObjectSetInteger(0, "CalendarDesc" + j, OBJPROP_SELECTABLE, false);

            offsetX += 250;
            ObjectCreate("CalendarImport" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarImport" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarImport" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarImport" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarImport" + j, stImportance, PanelFontSize, font, c);
            ObjectSetInteger(0, "CalendarImport" + j, OBJPROP_SELECTABLE, false);

            offsetX += 55;
            ObjectCreate("CalendarActual" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarActual" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarActual" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarActual" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarActual" + j, stActual, PanelFontSize, PanelFont, c);
            ObjectSetInteger(0, "CalendarActual" + j, OBJPROP_SELECTABLE, false);

            offsetX += 40;
            ObjectCreate("CalendarForecast" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarForecast" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarForecast" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarForecast" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarForecast" + j, stForecast, PanelFontSize, PanelFont, c);
            ObjectSetInteger(0, "CalendarForecast" + j, OBJPROP_SELECTABLE, false);

            offsetX += 40;
            ObjectCreate("CalendarPrevious" + j, OBJ_LABEL, Panel_Window, 0, 0, 0, 0);
            ObjectSet("CalendarPrevious" + j, OBJPROP_CORNER, corner);
            ObjectSet("CalendarPrevious" + j, OBJPROP_XDISTANCE, OriginX + offsetX);
            ObjectSet("CalendarPrevious" + j, OBJPROP_YDISTANCE, OriginY - offset);
            ObjectSetText("CalendarPrevious" + j, stPrevious, PanelFontSize, PanelFont, c);
            ObjectSetInteger(0, "CalendarPrevious" + j, OBJPROP_SELECTABLE, false);

            offset -= 10;
            j++;
        }
        i++;
    }

    NewsMax = i;

    FileClose(file);
    return (0);
}

int LoadSymbols() {
    InitSymbols();
    DownloadFile("PG_Symbols.csv");

    int file = FileOpen("PG_Symbols.csv", FILE_SHARE_READ | FILE_CSV, ',');

    if (file == -1) {
        PG_Print(TYPE_ERROR, "COULD NOT OPEN PG_Symbols.csv ", NO_SEND);

        return (-1);
    }
    if (FileSize(file) == 0) {
        FileClose(file);
        return (0);
    }
    int symbol = 0;

    while (!FileIsEnding(file)) {
        CurrencyName[symbol] = FileReadString(file);
        CurrencyPName[symbol] = FileReadString(file);
        CurrencyPort[symbol] = StrToInteger(FileReadString(file));

        for (int i = 0; i < 8; i++) FileReadString(file);
        symbol++;
    }
    FileClose(file);
    return (symbol);
}

void ReloadPanel() {

    int result = LoadPanel();
    if (result == -1) {
        Send_Operation("Panel can not be reloaded");

    } else {
        MainPanel_DeleteGraphics();
        MainPanel_InitGraphics(right_up_corner);

        Send_Operation("Panel Filter is set");
    }
}

int LoadPanel() {
    O_NbrVObject = 0;
    ResetSignalFilters();

    DownloadFile("PG_Panel.csv", "PG_Panel_" + SYS_SYMBOL);

    int file = FileOpen("PG_Panel_" + SYS_SYMBOL, FILE_READ | FILE_CSV, ',');
    if (file == -1) {
        return (-1);
    }

    if (FileSize(file) == 0) {
        FileClose(file);
        return (0);
    }

    GraphicMainPanel = StringToBoolean(FileReadString(file));
    GlobalComment = StringToBoolean(FileReadString(file));
    News = StringToBoolean(FileReadString(file));
    MarketOpening = StringToBoolean(FileReadString(file));

    OperationSound = StringToBoolean(FileReadString(file));
    AlertsSound = StringToBoolean(FileReadString(file));
    NewsSound = StringToBoolean(FileReadString(file));

    int k = 0;
    int z = 0;

    for (int i = 0; i < NBR_OBJECTS; i++) {
        for (int j = 0; j < NBR_SYSOBJECTS; j++)
            SysObjDependency[i][j] = "";
    }

    for (i = 0; i < NBR_POBJECTS; i++)
        Panel_Graphic[i] = 0;

    j = 0;
    int nextind = 0;
    int lastind = -1;

    bool NotPanelEnd = true;
    while (!FileIsEnding(file)) {

        if (k < NBR_SIGNALS) {
            int SignalId = StrToInteger(FileReadString(file));

            string hexacolor = FileReadString(file);

            string nsR = CharToString(hexacolor[1]) + CharToString(hexacolor[2]);
            string nsG = CharToString(hexacolor[3]) + CharToString(hexacolor[4]);
            string nsB = CharToString(hexacolor[5]) + CharToString(hexacolor[6]);

            int nR = hexToInteger(nsR);
            int nG = hexToInteger(nsG);
            int nB = hexToInteger(nsB);

            SignalColor[SignalId] = StringToColor(IntegerToString(nR) + "," + IntegerToString(nG) + "," + IntegerToString(nB));
            SignalVisible[SignalId] = StrToInteger(FileReadString(file));
            FileReadString(file);

        } else
        if (k < NBR_SIGNALS + 9) {
            int PObject = StrToInteger(FileReadString(file));
            Panel_Graphic[j] = StrToInteger(FileReadString(file));
            j++;
        } else
        if (NotPanelEnd) {
            int id = StrToInteger(FileReadString(file));
            if (id == 0) {
                string sobject = FileReadString(file);
                int ind = Object2Index(sobject);
                if (ind != -1) {
                    P_ObjOrder[z] = ind;
                    string pname = FileReadString(file);
                    P_ObjName[ind] = pname;
                    SetSignalFilter(1, Object2Id(sobject), -1, -1, 0);
                    z++;
                }
                else
                    FileReadString(file);

            } else {
                if (id == PANEL_END)
                    NotPanelEnd = false;
                P_ObjOrder[z] = id;
                z++;
            }

        } else {
            sobject = FileReadString(file);
            if (sobject != "") {
                //Print (sobject);
                ind = SysObject2Index(sobject);

                //Print (ind);
                if (ind != lastind) {
                    lastind = ind;
                    nextind = 0;
                }
            }
            string sdobject = FileReadString(file);
            //Print (sdobject);
            if (ind != -1) {
                SysObjDependency[ind][nextind] = sdobject;
                nextind++;
            }
        }
        k++;
    }

    ResetGraphics();
    O_NbrVObject = z;
    FileClose(file);
    return (z);
}

int LoadAlerts() {
    A_NbrAlert = 0;

    DownloadFile("PG_Alerts.csv", "PG_Alert_" + SYS_SYMBOL);

    int file = FileOpen("PG_Alert_" + SYS_SYMBOL, FILE_READ | FILE_CSV, '#');

    if (file == -1) {
        return (-1);
    }

    if (FileSize(file) == 0) {
        FileClose(file);
        return (0);
    }

    int k = 0;
    int i = 0;
    while (!FileIsEnding(file)) {

        AlertId[k] = StrToInteger(FileReadString(file));

        // objects  
        string SObject = FileReadString(file);
        int Object = Object2Id(SObject);
        if (Object == -1) {
            PG_Print("Unknow Object name : " + SObject, NO_SEND);
            i = 0;
            while (i < 11) {
                FileReadString(file);
                i++;
            }
            continue;
        }

        string SSignal = FileReadString(file);
        int Signal = Signal2Int(SSignal);

        if (Signal == -1) {
            PG_Print("Unknow Signal name : " + SSignal, NO_SEND);
            i = 0;
            while (i < 10) {
                FileReadString(file);
                i++;
            }
            continue;
        }
        int periode = StrToInteger(FileReadString(file));
        AlertTime[k] = 0;
        AlertMinTime[k] = 0;
        AlertLast[k] = 0;

        AlertObject[k] = Object;
        AlertSignal[k] = Signal;
        AlertPeriod[k] = periode;

        AlertLogic[k] = StrToInteger(FileReadString(file));
        AlertNot[k] = StrToInteger(FileReadString(file));
        AlertPrev[k] = StrToInteger(FileReadString(file));
        AlertType[k] = StrToInteger(FileReadString(file));
        AlertOp[k] = StrToInteger(FileReadString(file));
        AlertValue[k] = StrToDouble(FileReadString(file));

        AlertSound[k] = StrToInteger(FileReadString(file));
        AlertGraphic[k] = StrToInteger(FileReadString(file));
        AlertDialog[k] = StrToInteger(FileReadString(file));
        AlertMail[k] = StrToInteger(FileReadString(file));

        AlertGraphicCode[k] = StrToInteger(FileReadString(file));
        AlertGraphicColor[k] = StrToDouble(FileReadString(file));
        AlertGraphicFrom[k] = StrToInteger(FileReadString(file));
        AlertGraphicSize[k] = StrToInteger(FileReadString(file));
        AlertGraphicDistance[k] = StrToInteger(FileReadString(file));

        AlertSoundText[k] = FileReadString(file);
        AlertAlertText[k] = FileReadString(file);
        AlertMailFromName[k] = FileReadString(file);
        AlertMailFromAdress[k] = FileReadString(file);
        AlertMailToAdress[k] = FileReadString(file);
        AlertMailCcAdress[k] = FileReadString(file);
        AlertMailSubject[k] = FileReadString(file);
        AlertMailContent[k] = FileReadString(file);
        k++;
    }
    FileClose(file);
    A_NbrAlert = k;
    return (k);
}

int LoadSchedules() {

    string schedulefile = "PG_Schedules_" + SYS_SYMBOL;

    DownloadFile("PG_Schedules.csv", schedulefile);

    int file = FileOpen(schedulefile, FILE_READ | FILE_CSV, ',');
    if (file == -1) {
        return (-1);
    }

 

    if (FileSize(file) == 0) {
        FileClose(file);
        return (1);
    }

    //skip  first lines
    int i = 0;
    while (i < 15) {
        FileReadString(file);
        i++;
    }
    
      
    while (!FileIsEnding(file)) {
        int Rule = Rule2Int(FileReadString(file));
        int Operation = Operation2Int(FileReadString(file));
        string SSymbol = FileReadString(file);

        if (SSymbol != _Symbol && SSymbol != "") {
            i = 3;
            while (i < 14) {
                FileReadString(file);
                i++;
            }
        } else {
            int k = NextEntrySchedule(Rule, Operation);
            if (k == -1) {
                i = 3;
                while (i < 14) {
                    FileReadString(file);
                    i++;
                }
                continue;
            }


            S_StartM[Rule][Operation][k] = StrToInteger(FileReadString(file));

            S_StartW[Rule][Operation][k] = StrToInteger(FileReadString(file));
            S_StartD[Rule][Operation][k] = StrToInteger(FileReadString(file));

            string stime = FileReadString(file);
            if (stime == "-1")
                S_StartT[Rule][Operation][k] = StrToInteger(stime);
            else
                S_StartT[Rule][Operation][k] = StrToTime( stime);
            
            S_EndM[Rule][Operation][k] = StrToInteger(FileReadString(file));
            S_EndW[Rule][Operation][k] = StrToInteger(FileReadString(file));
            S_EndD[Rule][Operation][k] = StrToInteger(FileReadString(file));

            string etime = FileReadString(file);
            if (etime == "-1")
                S_EndT[Rule][Operation][k] = StrToInteger(etime);
            else
                S_EndT[Rule][Operation][k] = StrToTime(etime);            

            S_FrequencyD[Rule][Operation][k] = StrToInteger(FileReadString(file));
            S_OnSameBar[Rule][Operation][k] = StrToInteger(FileReadString(file));

            S_BetweenT[Rule][Operation][k] = StrToInteger(FileReadString(file));
            S_TimeZone[Rule][Operation][k] = StrToInteger(FileReadString(file));
            if (S_TimeZone[Rule][Operation][k] == 1) {
                S_StartT[Rule][Operation][k] = S_StartT[Rule][Operation][k] - GMTShift;
                S_EndT[Rule][Operation][k] = S_EndT[Rule][Operation][k] - GMTShift;
            }
//---
/*            
            printf ("schedule FROM FILE-----------------------");
            Print(TimeHour(S_StartT[Rule][Operation][k]));      
            Print(TimeHour(S_EndT[Rule][Operation][k]));


            Print(S_StartM[Rule][Operation][k]);
            Print(S_StartW[Rule][Operation][k]);
            Print(S_StartD[Rule][Operation][k]);
            Print(S_EndM[Rule][Operation][k]);
            Print(S_EndW[Rule][Operation][k]);
            Print(S_EndD[Rule][Operation][k]);

            Print(S_FrequencyD[Rule][Operation][k]);
            Print(S_BetweenT[Rule][Operation][k]);
            Print(S_TimeZone[Rule][Operation][k]); 
 */ 
        }
    }

    FileClose(file);

    return (1);
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


void SetExitRules() {
    // General Rule
    for (int x = 0; x < NBR_RULES; x++) {
        Set_Rule(OP_EXIT, T_RULE, x, P_SIGNAL, x);
        Set_Rule(OP_EXIT, T_MINPROFIT, x, P_SIGNAL, 0);
    }

    if (AndS(NEWS, S_ALERT, Period2Int(NewsAlertTime))) {
        for (x = 0; x < NBR_RULES; x++) {
            Set_Rule(OP_EXIT, T_STATUS, x, P_SIGNAL);
        }
    }

}

void SetPropertyRules() {
    if (AndS(NEWS, S_ALERT, Period2Int(NewsAlertTime)))
        for (int x = 0; x < NBR_RULES; x++)
            Set_Rule(OP_BUYSELL, T_KEEPBUYSELL, x, P_SIGNAL);
}

void SetSuspendRules() {
    if (AndS(NEWS, S_ALERT, Period2Int(NewsAlertTime))) {
        for (int x = 0; x < NBR_RULES; x++) {
            Set_Rule(OP_BUY, T_SUSPEND, x, P_SIGNAL);
            Set_Rule(OP_SELL, T_SUSPEND, x, P_SIGNAL);
            Set_Rule(OP_BUYSELL, T_SUSPEND, x, P_SIGNAL);
        }
    }
}

void SetHedgeRules() {
    if (AndS(NEWS, S_ALERT, Period2Int(NewsAlertTime))) {}

    int hedgemag;
    for (int x = 0; x < NBR_RULES; x++) {
        if (x != R_N) continue;
        hedgemag = 1;

    }

}

void SetEntryRules  ()
{
}

void SetSystemObjects (int x)
{

}
