const MILLISECONDS         = 3;
const SECONDS              = 2;
const MINUTES              = 1;

//================================================= PERIODS ==========================================

const NBR_PERIODS = 9;

const P_M1        = 0;
const P_M5        = 1;
const P_M15       = 2;
const P_M30       = 3;
const P_H1        = 4;
const P_H4        = 5;
const P_D1        = 6;
const P_W1        = 7;
const P_MN        = 8;

const PeriodName  = ["M1","M5","M15","M30","H1","H4","D1","W1","MN"];
const sPeriodName = ["m1","m5","m15","m30","h1","h4","d1","w1","mn"];

const PeriodsTab  = [P_M1, P_M5, P_M15, P_M30, P_H1, P_H4, P_D1, P_W1, P_MN];

//================================================= SYSTEMS ==========================================

const NBR_SIGNALS                 = 80;

const S_UP                        = 0; // indicator down
const S_DOWN                      = 1; // indicator up
const S_SIDEWAY                   = 2; // indicator is sideway (cloud, angle ...goes with UP DOWN) 
const S_ABOVE                     = 3; // point above
const S_BELOW                     = 4; // point below
const S_TOUCHED                   = 5; // point touched                                     
const S_ALERT                     = 6; // approaching    
const S_CROSS_UP                  = 7; // point cross
const S_CROSS_DOWN                = 8; // point cross down
const S_REVERSE_UP                = 9; // point reversing or indicator changing 
const S_REVERSE_DOWN              = 10; // point reversing 
const S_MIDDLE                    = 11; // point in middle (resistance support) 
const S_CHANGED                   = 12; // indicators changed up-> down  // resistance changed
const S_TARGET                    = 13; // Direction when crossed for Pivot 
const S_DISTANCE                  = 14; // distance point indicator
const S_CURRENT                   = 15; // current value
const S_PREVIOUS                  = 16; // previous value
const S_BULL                      = 17; // indicator is bull
const S_BEAR                      = 18; // indicator is bear
const S_RANGE                     = 19; // indicator is in range between levels 
const S_OVERBOUGHT                = 20; // indicator overbougth
const S_OVERSOLD                  = 21;
const S_EXT_OVERBOUGHT            = 22; // indicator overbougth
const S_EXT_OVERSOLD              = 23;
const S_VERYWEAK                  = 24; // market
const S_WEAK                      = 25;
const S_NEUTRAL                   = 26;
const S_STRONG                    = 27;
const S_VERYSTRONG                = 28;
const S_ANGLE                     = 29; // angle of indicator
const S_PANGLE                    = 30; // previous angle shift 6
const S_NBRBARS                   = 31;
const S_RCROSSED                  = 32; // indicators crossed   // resistance support are crossing
const S_BUY                       = 33; // buy signal
const S_SELL                      = 34; // sell signal
const S_EXIT_BUY                  = 35;
const S_EXIT_SELL                 = 36;
const S_DOJI                      = 37;
const S_BULL_QUAD                 = 38; // Consolidation
const S_BULL_HAMMER               = 39;
const S_BULL_HAMMER1              = 40;
const S_BULL_HAMMER2              = 41;
const S_BULL_ENGULFING            = 42;
const S_BULL_HARAMI               = 43;
const S_BULL_INVERTED_HAMMER      = 44;
const S_BULL_INVERTED_HAMMER1     = 45;
const S_BULL_INVERTED_HAMMER2     = 46;
const S_BULL_PIERCING_LINE        = 47;
const S_BULL_MORNING_STAR         = 48;
const S_BULL_MORNING_DOJI_STAR    = 49;
const S_BULL_THREE_WHITE_SOLDIERS = 50;
const S_BULL_THREE_INSIDE_UP      = 51;
const S_BULL_THREE_OUTSIDE_UP     = 52;
const S_BEAR_QUAD                 = 53; // Consolidation
const S_BEAR_HANGING_MAN          = 54;
const S_BEAR_HANGING_MAN1         = 55;
const S_BEAR_HANGING_MAN2         = 56;
const S_BEAR_ENGULFING            = 57;
const S_BEAR_HARAMI               = 58;
const S_BEAR_SHOOTING_STAR        = 59;
const S_BEAR_SHOOTING_STAR1       = 60;
const S_BEAR_SHOOTING_STAR2       = 61;
const S_BEAR_DARK_CLOUD_COVER     = 62;
const S_BEAR_EVENING_STAR         = 63;
const S_BEAR_EVENING_DOJI_STAR    = 64;
const S_BEAR_THREE_BLACK_CROWS    = 65;
const S_BEAR_THREE_INSIDE_DOWN    = 66;
const S_BEAR_THREE_OUTSIDE_DOWN   = 67;
const S_MAXINDAY                  = 68;
const S_MININDAY                  = 69;
const S_FIRSTINDAY                = 70;
const S_MAXINWEEK                 = 71;
const S_MININWEEK                 = 72;
const S_FIRSTINWEEK               = 73;
const S_MAXINMONTH                = 74;
const S_MININMONTH                = 75;
const S_FIRSTINMONTH              = 76;
const S_MAXINYEAR                 = 77;
const S_MININYEAR                 = 78;
const S_FIRSTINYEAR               = 79;

const SignalName = ["UP", "DOWN", "SIDEWAY", "ABOVE", "BELOW",
                    "TOUCHED", "ALERT", "CROSS_UP", "CROSS_DOWN", "REVERSE_UP", 
                    "REVERSE_DOWN", "MIDDLE", "CHANGED", "TARGET", "DISTANCE",
                    "CURRENT", "PREVIOUS", "BULL", "BEAR", "RANGE", 
                    "OVERBOUGHT", "OVERSOLD", "EXT_OVERBOUGHT", "EXT_OVERSOLD", "VERYWEAK", 
                    "WEAK", "NEUTRAL", "STRONG", "VERYSTRONG", "ANGLE", 
                    "PANGLE", "NBRBARS", "RCROSSED", "BUY", "SELL", 
                    "EXIT_BUY", "EXIT_SELL", "DOJI", "BULL_QUAD", "BULL_HAMMER",
                    "BULL_HAMMER1", "BULL_HAMMER2", "BULL_ENGULFING", "BULL_HARAMI", "BULL_INVERTED_HAMMER", 
                    "BULL_INVERTED_HAMMER1", "BULL_INVERTED_HAMMER2", "BULL_PIERCING_LINE", "BULL_MORNING_STAR", "BULL_MORNING_DOJI_STAR", 
                    "BULL_THREE_WHITE_SOLDIERS", "BULL_THREE_INSIDE_UP", "BULL_THREE_OUTSIDE_UP", "BEAR_QUAD", "BEAR_HANGING_MAN", 
                    "BEAR_HANGING_MAN1", "BEAR_HANGING_MAN2", "BEAR_ENGULFING", "BEAR_HARAMI", "BEAR_SHOOTING_STAR", 
                    "BEAR_SHOOTING_STAR1", "BEAR_SHOOTING_STAR2", "BEAR_DARK_CLOUD_COVER", "BEAR_EVENING_STAR", "BEAR_EVENING_DOJI_STAR", 
                    "BEAR_THREE_BLACK_CROWS", "BEAR_THREE_INSIDE_DOWN", "BEAR_THREE_OUTSIDE_DOWN", "MAXINDAY", "MININDAY", 
                    "FIRSTINDAY", "MAXINWEEK", "MININWEEK", "FIRSTINWEEK","MAXINMONTH", 
                    "MININMONTH", "FIRSTINMONTH", "MAXINYEAR", "MININYEAR", "FIRSTINYEAR"];

                    
const SignalBName =["Up","Down","Sideway","Above","Below",
                    "Touching","Approaching","Crossing up","Crossing Down","Reversing Up",
                    "Reversing Down", "In Between","Changed","Target","Distance",
                    "Current", "Previous","Bull", "Bear", "in Range",
                    "Over Bought", "Over Sold", "Extreme Over Bought", "Extreme Over Sold", "Very Weak",
                    "Weak", "Neutral", "Strong", "Very Strong", "Angle",
                    "Previous Angle", "Number of Bars", "Crossed","is giving a Buy Signal","is giving a Sell Signal", 
                    "giving an Exit Buy Signal","giving an Exit Sell Signal", "Doji", "Price Consolidation", "Bullish Hammer",
                    "Bullish Hammer", "Bullish Hammer","Bullish Engulfing","Bullish Harami", "Bullish Inverted Hammer",
                    "Bullish Inverted Hammer","Bullish Inverted Hammer","Bullish Piercing Line","Bullish Morning Star", "Bullish Morning Doji Star",
                    "Bullish Three White Soldiers","Bullish Three Inside Up","Bullish Three Outside Up","Bearish Price Consolidation", "Bearish Hanging Man",
                    "Bearish Hanging Man","Bearish Hanging Man","Bearish Engulfing","Bearish Harami", "Bearish Shooting Star",
                    "Bearish Shooting Star","Bearish Shooting Star","Bearish Dark Cloud Cover","Bearish Evening Star","Bearish Evening Doji Star",
					"Bearish Three Black Crows","Bearish Three Inside Down","Bearish Three Outside Down", "Maximum price of the day", "Minimum price of the day", 
                    "First price opening of the Day","Maximum price of the week","Minimum price of the week","First price opening of the week", "Maximum price of tmonth",
                    "Minimum price of the month", "First price opening of the month", "Maximum price of the year", "Minimum price of the year", "First price opening of the year"  
                ]; 


const SBoolean  = "Boolean";
const SNumeric  = "Numeric";
const SBoth     = "Any";

const SignalType = [SBoolean, SBoolean, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean, 
                   SBoolean, SBoth, SBoolean, SNumeric, SNumeric,
                   SNumeric, SNumeric, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SBoolean, SNumeric, 
                   SNumeric, SNumeric, SBoolean, SBoolean, SBoolean, 
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean, 
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean, 
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SBoolean, SBoolean,
                   SBoolean, SBoolean, SBoolean, SNumeric, SNumeric, 
                   SNumeric, SNumeric, SNumeric, SNumeric, SNumeric, 
                   SNumeric, SNumeric, SNumeric, SNumeric, SNumeric];


const SignalCode = [246, 248, 240, 221, 222, 
                   220, 164, 233, 234, 200, 
                   201, 214, 109, 81, 32, 
                   32, 32, 241, 242, 104, 
                   203, 204, 203, 204, 115, 
                   116, 139, 140, 141, 32, 
                   32, 32, 253, 233, 234, 
                   232, 231, 72, 72, 72, 
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72,
                   72, 72, 72, 72, 72
                    ];
const SignalColor = ['#01a781', '#e33192', '#FFD700', '#8FDB48', '#E06666',
                   '#FFD700', '#CC0814', '#00FFFF', '#FF0000', '#00FFFF', 
                   '#FF0000', '#AAAAAA', '#008000', '#D9EAD3', '#FFFFFF', 
                   '#FFFFFF', '#FFFFFF', '#01FD55', '#FF011B', '#C0C0C0', 
                   '#33FF00', '#CC0814', '#1E8509', '#99050C', '#CCFDFD', 
                   '#7EFAFA', '#0AEFEF', '#329696', '#086969',  '#FFFFFF', 
                   '#FFFFFF', '#FFFFFF', '#FFFF00', '#00FF00', '#FF0000', 
                   '#FFD700', '#FFD700', '#0000FF', '#93C47D', '#B6D7A8', 
                   '#B6D7A8', '#93C47D', '#3D85C6', '#3D85C6', '#9FC5E8', 
                   '#9FC5E8', '#CFE2F3', '#00FFFF', '#00FFFF', '#00FFFF', 
                   '#00FFFF', '#00FFFF', '#00FFFF', '#FF0000', '#FF0000', 
                   '#FF0000', '#FF0000', '#E06666', '#FF0000', '#FF0000', 
                   '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', 
                   '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', 
                   '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000', 
                   '#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000'];                    

//================================================= SYSTEMS ==========================================

const NBR_FIELDS              = 83;
const NBR_IOFIELDS            = 39;

const T_OPERATION             =  0;
const T_START                 =  1;   
const T_STATUS                =  2;    // OP_EXIT OP_EXIT_SELL OP_EXIT_BUY ATTRIBUTES 
const T_RULE                  =  3;    // rule to buysell on may be not the same that start
const T_KEEPBUYSELL           =  4;    // rule to buysell on may be not the same that start
const T_SUSPEND               =  5;
const T_MINPROFIT             =  6;    
const T_EXITMODE              =  7;    // OP_BUYSELL  ATTRIBUTES
const T_PIPSTEP               =  8;   
const T_TIMESTEP              =  9;
const T_ORDERTYPE             = 10;   //OP_BUYSELL Attr 
const T_DIRECTION             = 11;
const T_DIRECTIONTYPE         = 12;
const T_RECOVERYMODE          = 13;   // recovery numbers
const T_RECOVERYVALUE         = 14;
const T_ILOT                  = 15;   
const T_BUYLOT                = 16; 
const T_SELLLOT               = 17; 
const T_MAXLOT                = 18;
const T_MAXLOSS               = 19;
const T_MAXTIME               = 20;
const T_MAXCOUNT              = 21;   // IN OUT PARAMETER !!! engine can adjust ... 
const T_HEDGEMAGNITUDE        = 22;
const T_ONEORDERPERBAR        = 23;
const T_BUYLOTSL              = 24;   
const T_BUYLOTTP              = 25;
const T_BUYLOTTS              = 26;
const T_SELLLOTSL             = 27;   
const T_SELLLOTTP             = 28;
const T_SELLLOTTS             = 29;
const T_SL                    = 30;   
const T_TP                    = 31;
const T_TS                    = 32;
const T_BUYSL                 = 33;   
const T_BUYTP                 = 34;
const T_BUYTS                 = 35;
const T_SELLSL                = 36; 
const T_SELLTP                = 37;
const T_SELLTS                = 38;              // input output fields   end ----

const T_HMAX                  = 39;
const T_HMIN                  = 40;
const T_MAX                   = 41;
const T_MIN                   = 42;
const T_EXITBUY               = 43;
const T_EXITSELL              = 44;
const T_CLOSEBUY              = 45;
const T_CLOSESELL             = 46;
const T_PROFITBUY             = 47;
const T_PROFITSELL            = 48;
const T_PROFIT                = 49;
const T_LASTLOT               = 50;
const T_LASTBUYLOT            = 51;
const T_LASTSELLLOT           = 52;
const T_STARTTRADE            = 53;
const T_NEUTRALPOINT          = 54;
const T_BUYAVERAGEPOINT       = 55;
const T_SELLAVERAGEPOINT      = 56;
const T_HEDGELLINE            = 57;
const T_HEDGENBRLOTS          = 58;
const T_BUYHEDGENBRLOTS       = 59;
const T_SELLHEDGENBRLOTS      = 60;
const T_HEDGETYPE             = 61;
const T_HEDGED                = 62;
const T_HASBEENHEDGED         = 63;
const T_HEDGEPROFIT           = 64;
const T_HEDGEBUYPROFIT        = 65;
const T_HEDGESELLPROFIT       = 66;
const T_BUYNBRTRADE           = 67;
const T_SELLNBRTRADE          = 68;
const T_BUYNBRLOTS            = 69;
const T_SELLNBRLOTS           = 70;
const T_LASTORDEROPENTIME     = 71;     
const T_LASTORDERCLOSETIME    = 72;     
const T_LASTORDEROPENPRICE	  = 73;
const T_LASTORDERCLOSEPRICE   = 74;
const T_LASTORDERCLOSEPROFIT  = 75;    // order in history only ==> closed
const T_LASTORDERCLOSETYPE    = 76;    // order in history only ==> closed
const T_FIRSTORDEROPENTIME    = 77;    
const T_FIRSTORDERCLOSETIME   = 78;    
const T_FIRSTORDEROPENPRICE   = 79;    
const T_FIRSTORDERCLOSEPRICE  = 80;
const T_LEVELPOINT            = 81;
const T_LASTORDERTYPE         = 82;

const FieldName               = ["OPERATION", "START", "STATUS", "RULE", "KEEPBUYSELL",
                                 "SUSPEND", "MINPROFIT", "EXITMODE", "PIPSTEP", "TIMESTEP", 
                                 "ORDERTYPE", "DIRECTION", "DIRECTIONTYPE", "RECOVERYMODE", "RECOVERYVALUE",
                                 "ILOT", "BUYLOT", "SELLLOT", "MAXLOT", "MAXLOSS",
                                 "MAXTIME", "MAXCOUNT", "HEDGEMAGNITUDE", "ONEORDERPERBAR", "BUYLOTSL",
                                 "BUYLOTTP", "BUYLOTTS", "SELLLOTSL", "SELLLOTTP", "SELLLOTTS", 
                                 "SL", "TP", "TS", "BUYSL", "BUYTP", 
                                 "BUYTS", "SELLSL", "SELLTP", "SELLTS", "HMAX",
                                 "HMIN", "MAX", "MIN", "EXITBUY", "EXITSELL",
                                 "CLOSEBUY", "CLOSESELL", "PROFITBUY", "PROFITSELL", "PROFIT",
                                 "LASTLOT", "LASTBUYLOT", "LASTSELLLOT", "STARTTRADE", "NEUTRALPOINT",
                                 "BUYAVERAGEPOINT", "SELLAVERAGEPOINT", "HEDGELLINE", "HEDGENBRLOTS", "BUYHEDGENBRLOTS",
                                 "SELLHEDGENBRLOTS", "HEDGETYPE", "HEDGED", "HASBEENHEDGED", "HEDGEPROFIT",
                                 "HEDGEBUYPROFIT", "HEDGESELLPROFIT", "BUYNBRTRADE", "SELLNBRTRADE", "BUYNBRLOTS",
                                 "SELLNBRLOTS", "LASTORDEROPENTIME", "LASTORDERCLOSETIME", "LASTORDEROPENPRICE", "LASTORDERCLOSEPRICE",
                                 "LASTORDERCLOSEPROFIT", "LASTORDERCLOSETYPE", "FIRSTODEROPENTIME", "FIRSTODERCLOSETIME", "FIRSTORDEROPENPRICE",
                                 "FIRSTORDERCLOSEPRICE", "LEVELPOINT", "LASTORDERTYPE"];

//================================================= ENGINE ATTIBUTES =================================================================

const NBR_ATTRIBUTES      = 46;

const B_STARTAUTOMATIC    = 0;
const B_BUYSELLAUTOMATIC  = 1;
const B_EXITAUTOMATIC     = 2;
const B_HEDGEAUTOMATIC    = 3;
const B_DEHEDGEAUTOMATIC  = 4;
const B_OPERATION         = 5; // OP_BUYSELL, OP_BUY, OP_SELL
const B_STARTRULE         = 6; // MAIN RULE ... Parameters of engine is passed to this rule ..... (ENGINE REFERENCEvar B_BUYRULE            40;           // rule to buysell on may be not the same that start
const B_BUYRULE           = 7; // rule to buysell on may be not the same that start
const B_SELLRULE          = 8; // rule to buysell on may be not the same that start
const B_EXITBUYRULE       = 9;
const B_EXITSELLRULE      = 10;
const B_EXITRULE          = 11;
const B_ILOT              = 12; // Initial Lot size
const B_MAXLOT            = 13; // Initial Lot size
const B_MAXCOUNT          = 14;
const B_DIRECTION         = 15;
const B_DIRECTIONTYPE     = 16;
const B_RECOVERYMODE      = 17; // recovery numbers
const B_RECOVERYVALUE     = 18; // Recovery Value
const B_PIPSTEP           = 19; // PipStep
const B_TIMESTEP          = 20; // in minutes  max 69 days
const B_ORDERTYPE         = 21; // OP_BUYSELL Hedging orders              
const B_KEEPBUYSELL       = 22;
const B_EXITMODE          = 23; // OP_BUYSELL  ATTRIBUTES
const B_MAXTIME           = 24; // minutes
const B_HEDGEMAGNITUDE    = 25;
const B_MINPROFIT         = 26; // OP_EXIT OP_EXIB_SELL OP_EXIB_BUY ATTRIBUTES 
const B_BUYMINPROFIT      = 27; // OP_EXIT OP_EXIB_SELL OP_EXIB_BUY ATTRIBUTES 
const B_SELLMINPROFIT     = 28; // OP_EXIT OP_EXIB_SELL OP_EXIB_BUY ATTRIBUTES 
const B_TP                = 29; // Take Profit Session  
const B_TS                = 30; // Trailing Stop Session 
const B_SL                = 31; // Stop Loss Session
const B_BUYTP             = 32; // Buy Take Profit 
const B_BUYTS             = 33; // Buy Trailing Stop 
const B_BUYSL             = 34; // Buy Stop Loss
const B_SELLTP            = 35; // Sell Take Profit 
const B_SELLTS            = 36; // Sell Trailing Stop 
const B_SELLSL            = 37; // Sell Stop Loss
const B_BUYLOTTP          = 38; // takeprofit on a lot in pips
const B_BUYLOTTS          = 39; // trailing stop on a lot in pips ... 
const B_BUYLOTSL          = 40; // stop loss  on a lot in pips 
const B_SELLLOTTP         = 41; // takeprofit on a lot in pips
const B_SELLLOTTS         = 42; // trailing stop on a lot in pips ... 
const B_SELLLOTSL         = 43; // stop loss  on a lot in pips 
const B_LEVELPOINT        = 44;
const B_ONEORDERPERBAR    = 45;


const B_EXITBUY           = 70;
const B_EXITSELL          = 71;
    
//================================================= INDICATORS ==========================================

const NBR_OBJECTS         = 100;

const UPFRACTAL           = 0;
const DOWNFRACTAL         = 1;
const SUPPORT             = 2;
const RESISTANCE          = 3;
const PIVOT_RESISTANCE2   = 4;
const PIVOT_RESISTANCE1   = 5;
const PIVOT_RESISTANCE    = 6;
const PIVOT_HIGH          = 7;
const PIVOT_POINT         = 8;
const PIVOT_LOW           = 9;
const PIVOT_SUPPORT       = 10;
const PIVOT_SUPPORT1      = 11;
const PIVOT_SUPPORT2      = 12;
const HEIKEN_ASHI         = 13;
const OPEN                = 14;
const CLOSE               = 15;
const HIGH                = 16;
const LOW                 = 17;
const FIBOLEVEL           = 18;
const FIBOSTOPLOSSLEVEL   = 19;
const BAR                 = 20;
const NEWS                = 21;
const VOLUME              = 22;
const VOLUME_UP           = 23;
const VOLUME_DOWN         = 24;
const PROGRESS            = 25;

const ObjectPredefinedType = ['Fractal Up', 
                              'Fractal Down',
                              'Trend Line Support',
                              'Trend Line Resistance',
                              'Heiken Ashi', 
                              'Bar Open', 
                              'Bar Close', 
                              'Bar High',
                              'Bar Low', 
                              'Bar Action', 
                              'Pivot Resistance 2',
                              'Pivot Resistance 1', 
                              'Pivot Resistance', 
                              'Pivot High', 
                              'Pivot Point', 
                              'Pivot Low', 
                              'Pivot Support', 
                              'Pivot Support 1', 
                              'Pivvot Support 2', 
                              'Fibonacci Level', 
                              'Fibonacci Stop Loss Level', 
                              'Volume', 
                              'Volume Up', 
                              'Volume Down', 
                              'Progress', 
                              'News'];

var ObjectPredefinedName = ["UPFRACTAL","DOWNFRACTAL","SUPPORT","RESISTANCE", "PIVOT_RESISTANCE2","PIVOT_RESISTANCE1","PIVOT_RESISTANCE","PIVOT_HIGH","PIVOT_POINT","PIVOT_LOW",
                            "PIVOT_SUPPORT","PIVOT_SUPPORT1","PIVOT_SUPPORT2","HEIKEN_ASHI", "OPEN","CLOSE","HIGH","LOW","FIBOLEVEL","FIBOSTOPLOSSLEVEL", "BAR", "NEWS", "VOLUME","VOLUME_UP","VOLUME_DOWN"];
  
//================================================= INDICATORS TYPE ==========================================

const MA_TYPE             = 0;
const ADX_TYPE            = 1;
const CCI_TYPE            = 2;
const ICHIMOKU_TYPE       = 3;
const BOLLINGER_TYPE      = 4;
const SAR_TYPE            = 5;
const RSI_TYPE            = 6;
const MACD_TYPE           = 7;
const STOCHASTIC_TYPE     = 8;
const WPR_TYPE            = 9;
const ATR_TYPE            = 10;
const CUSTOM_TYPE         = 11;
const PREDEFINED_TYPE     = 12;
const SYSTEM_TYPE         = 13;

const SignalsSystemObject   = ["BUY", "SELL", "EXIT_BUY", "EXIT_SELL", "BULL", "BEAR"];    	

const ObjectType = ['Moving Average', 
                    'Average Directional Movement Index', 
                    'Commodity Channel Index', 
                    'Ichimoku Kinko Hyo', 
                    'Bollinger Bands', 
                    'Parabolic SAR', 
                    'Relative Strength Index', 
                    'MACD',  
                    'Stochastic Oscillator',  
                    'Williams\' Percent Range', 
                    'Average True Range', 
                    'Extern Indicator', 
                    'Predefined' , 
                    'System Indicator'];    

const ObjectTypeName = ["MA",
                        "ADX", 
                        "CCI", 
                        "ICHIMOKU", 
                        "BOLLINGER", 
                        "SAR", 
                        "RSI", 
                        "MACD",  
                        "STOCHASTIC",  
                        "WPR", 
                        "ATR", 
                        "CUSTOM", 
                        "PREDEFINED", 
                        "SYSTEM"];


//================================================= RULES ==========================================

const NBR_RULES = 25;  // automatic rule

const R_A       = 0;
const R_B       = 1;
const R_C       = 2;
const R_D       = 3;
const R_E       = 4;
const R_F       = 5;
const R_G       = 6;
const R_H       = 7;
const R_I       = 8;
const R_J       = 9;
const R_K       = 10;
const R_L       = 11;
const R_M       = 12;
const R_N       = 13;
const R_O       = 14;
const R_P       = 15;
const R_Q       = 16;
const R_R       = 17;
const R_S       = 18;
const R_T       = 19;
const R_U       = 20;
const R_V       = 21;
const R_W       = 22;
const R_X       = 23;
const R_Y       = 24;
const R_Z       = 25;

var RuleName    = ["A", "B", "C", "D", "E", 
                   "F", "G", "H", "I", "J", 
                   "K", "L", "M", "N", "O", 
                   "P", "Q", "R", "S", "T", 
                   "U", "V", "W", "X", "Y", 
                   "Z"];            // manual last one

const S_MANUAL  = "Z";
const R_MANUAL  = NBR_RULES;

const NBR_ENGINES   = 51;           // NBR_RULES * 2 + Manual
const EngineManual  = 50;           // Engine Manual index


const P_NOSIGNAL    = 0;
const P_SIGNAL      = 1;

//================================================= OPERATIONS ==========================================

const NBR_OPERATIONS        = 14;

const OP_BUY                = 0;
const OP_SELL               = 1;
const OP_BUYSELL            = 2;
const OP_EXIT_BUY           = 3;
const OP_EXIT_SELL          = 4;
const OP_EXIT               = 5;
const OP_HEDGE_BUY          = 6;
const OP_HEDGE_SELL         = 7;
const OP_CLOSE_HEDGE_BUY    = 8;
const OP_CLOSE_HEDGE_SELL   = 9;
const OP_CLOSE_HEDGE        = 10;
const OP_CLOSE_BUY          = 11;
const OP_CLOSE_SELL         = 12;
const OP_CLOSE              = 13;  // end of engine operations
const OP_WAIT               = 14;   
const OP_HOLD               = 15;
const OP_SUSPEND            = 16;

const OperationName         = ["BUY", "SELL", "BUYSELL", "EXIT_BUY", "EXIT_SELL",
                               "EXIT", "HEDGE_BUY", "HEDGE_SELL", "CLOSE_HEDGE_BUY", "CLOSE_HEDGE_SELL",
                               "CLOSE_HEDGE", "CLOSE_BUY", "CLOSE_SELL", "CLOSE",
                               "WAIT", "HOLD", "SUSPEND"];
const OrderName             = ["BUY", "SELL"];

//================================================= ORDERS OPERATIONS ==========================================

const OP_BUYLIMIT           = 17;
const OP_SELLLIMIT          = 18;
const OP_BUYSTOP            = 19;
const OP_SELLSTOP           = 20;

const OpName                = ["BUY", "SELL", "BUYLIMIT", "SELLLIMIT", "BUYSTOP", "SELLSTOP"];
//var	OpName              = ["buy", "sell", "buy limit", "sell limit", "buy stop","sell stop"];

//================================================= DIRECTION ==========================================

const D_BACKWARD            = 0;
const D_FORWARD             = 1;
const D_ANY                 = 2;

const DirectionName         = ["BACKWARD", "FORWARD", "ANY"];


//================================================= DIRECTON TYPE ==========================================

const DT_MINMAX             = 0;
const DT_LEVEL              = 1;

const DirectionTypeName     = ["MINMAX", "LEVEL"];



//================================================= EXIT TYPE ==========================================

const EM_EXITBUYFIRST       = 0;
const EM_EXITSELLFIRST      = 1;
const EM_EXITANY            = 2;

const ExitModeName          = ["EXITBUYFIRST", "EXITSELLFIRST", "EXITANY"];



//================================================= ORDER TYPE ==========================================

const OT_MONO               = 0;
const OT_HEDGE              = 1;

const OrderTypeName         = ["MONO", "HEDGE"];

	
//================================================= RECOVERY MODE ==========================================

const M_F = 0;
const M_D = 1;
const M_H = 2;
const M_S = 3;
const M_I = 4;
const M_M = 5;
const M_N = 6;
const M_J = 7;
const M_C = 8;
const M_O = 9;
const M_P = 10;
const M_Q = 11;
const M_A = 12;
const M_L = 13;
const M_K = 14;

const RecoveryModeName = ["F", "D", "H", "S", "I", 
                        "M", "N", "J", "C", "O",
                        "P", "Q", "A", "L", "K"];

//================================================= RULES TAB ==========================================

var RuleTab             = [];
var BeforeRuleTab       = [];
var RuleTabValue        = [];
var BeforeRuleTabValue  = [];
var RuleFilterTab       = [];

var RuleNbrBuy, RuleNbrSell, RuleNbrExitBuy, RuleNbrExitSell;


//====================================== TIME RELATED -------------------------------------------





//=============================================SCHEDULES========================================

const PANEL_ID          =   0;
const PANEL_FEED        =  -1;
const PANEL_SEPARATOR   =  -2;
const PANEL_PERIODS     =  -3;
const PANEL_END         =  -4;

const AngleShift = 2;

const TimeBetweenSession = 0;   //time to launch between sessions

var EndSessions = false; // don'tey  start sessions anymore after finish


var O_NbrObject = 0;
var O_NbrSysObject = 0;
var O_NbrVObject = 0;
var A_NbrAlert = 0;


var HedgeMagicNumber = 40;
var GraphicMode = true;

var ShellTrace = true;



var NBR_SHIFT = 5;




var TYPE_ERROR = 0;
var TYPE_WARNING = 1;
var TYPE_INFO = 2;
var NO_SEND = 3;


// ACCOUNT INFO
var AccountTotalProfit = 0;
var AccountProfit = 0;
var AccountTotalNbrLots = 0;
var AccountNbrLots = 0;

var AccountInitialBalance = 1000;
var AccountEquity = 0;

var AccountName = "XXXX";
var AccountNumber = "XXXX";
var AccountBalance = 0;
var AccountMinFreeMargin = '---';

var AveragePoint = 0;


// MONEY MANAGEMENT

var MMDailyTargetAmount         = 0;
var MMDailyStopLoss             = 0;
var MMDailyTargetReached        = false;
var MMDailyClosedProfit         = -1;
var MMDailySymbolTargetAmount   = -1;
var MMDailySymbolStopLoss       = -1;
var MMDailySymbolTargetReached  = false;
var MMDailySymbolClosedProfit   = -1;

//==================================================INDICATORS TYPE SAVINGS =========================================

const MODE_TRADES      = 0;
const MODE_HISTORY     = 1;

const TRENDLINE_TYPE            = 0;
const HISTOGRAM_TYPE            = 1;
const BULLBEAR_TYPE             = 2;

const MAIN_DISPLAY                = 0;
const SEPERATE_DISPLAY            = 1;


const OVERBOUGHTOVERSOLD_LEVEL  = 0;
const STRONGWEAK_LEVEL          = 1;

const UPTREND                   = 0;
const DOWNTREND                 = 1;

const SIDEWAYTREND              = 2;
const TREND                     = 3;

const UPLEVEL1                  = 0;
const UPLEVEL                   = 1;
const MIDLEVEL                  = 2;
const DOWNLEVEL                 = 3;
const DOWNLEVEL1                = 4;

const MODE_UPPER                = 1;
const MODE_LOWER                = 2;


var NormalizeDouble = function(number, digits) {
    var exp = Math.pow(10, digits)
    return (Math.round(number * exp) / exp);
}

function numDecimals(x) {
    return (x.toString().split('.')[1] || []).length;
}


var iTime = function(symbol, period, shift) {   //returns the last ticker value time
    
    if (!symbol) {
        let symbolcanvas = solution.GetCanvasFromTerminal();
        if (!symbolcanvas) {
            return 0;   
        }
        symbol = symbolcanvas.CurrentSymbol;
    }        

    let chartData;

    if (TestMode) {
        chartData = CurrentEngine.Data;
    } else {
        return -1;
    } 

    let lastindex = chartData[period].length - 1;
    let currentbarindex = lastindex - shift;

    return chartData[period][currentbarindex].date.getTime() / 1000;
}

var TimeCurrent = function() {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;     
   
    if (TestMode) {
        return iTime(null, CurrentEngine.CurrentPeriod, 0);
    } 
    return -1;
}

var Pips = function(value) {
    return (value / SYS_POINT);
}

var PipValue = function(pips) {
    return (pips * SYS_POINT);
}

var GetMonth = function(timecurrent) {
    var date = new Date();
    date.setTime(timecurrent * 1000)
    return date.getMonth();
}

var GetWeek = function(timecurrent) {
    var date = new Date();
    date.setTime(timecurrent * 1000)
    return date.getWeek();
}

var GetDay = function(timecurrent) {  //monday == 1
    var date = new Date();
    date.setTime(timecurrent * 1000)
    return date.getDay();
}

var GetHours = function(timecurrent) {
    var date = new Date();
    date.setTime(timecurrent * 1000)
    return date.getHours();
}

var GetMinutes = function(timecurrent) {
    var date = new Date();
    date.setTime(timecurrent * 1000)
    return date.getMinutes();
}

function ReturnTime(sTime) {
    var date = new Date(TimeCurrent() * 1000);
    var result = sTime.split(":");
    var sHour = result[0];
    var sMin = result[1];
    var sSec = result[2];
    date.setHours(+sHour);
    date.setMinutes(+sMin);
    date.setSeconds(+sSec);
    return date.getTime() / 1000;
}

var ReturnDate = function(sDate) {
    var date = new Date(sDate);
    return date.getTime() / 1000;
}

var ReturnDayOccurenceInMonth = function (timecurrent) {
    var date = new Date();
    date.setTime(timecurrent * 1000)
    
    var day = date.getDate();
    var oday = 1;

    while (day - 7 > 0) {
        oday++;
        day -= 7;
    }
    return (oday);
}

var TimeHour = function (stime)  {
    return parseInt(stime.substring (0, 2));
}

var TimeMinute = function (stime)  {
    return parseInt(stime.substring (3));  
}

var SeeIfRuleInSchedule = function(rule, Operation) {
    
    let CurrentTime   = TimeCurrent();
    let CurrentPeriod = CurrentEngine.CurrentPeriod;


    for (var k = 0; k < NBR_SCHEDULES; k++) {
        if (S_StartM[rule][Operation][k] === 0 && k === 0) return 1;
        // no schedule means all the time
        if (S_StartM[rule][Operation][k] === 0) return -1;
        // read all schedules and nothing corresponds
        if (S_StartM[rule][Operation][k] !== -1 && S_StartM[rule][Operation][k] > (GetMonth(CurrentTime) + 1)) continue;
        if (S_EndM[rule][Operation][k] !== -1 && S_EndM[rule][Operation][k] < (GetMonth(CurrentTime) + 1)) continue;
        if (S_StartM[rule][Operation][k] !== -1 && S_EndM[rule][Operation][k] !== -1 && S_StartM[rule][Operation][k] > S_EndM[rule][Operation][k]) {
            PG_Print(TYPE_ERROR, "Error in Month Format Start Month bigger than end Month : " + S_StartM[rule][Operation][k] + ", " + S_EndM[rule][Operation][k], NO_SEND);
            continue;
        }
        if (S_StartW[rule][Operation][k] !== -1 && S_StartW[rule][Operation][k] > ReturnDayOccurenceInMonth(CurrentTime)) continue;
        if (S_EndW[rule][Operation][k] !== -1 && S_EndW[rule][Operation][k] < ReturnDayOccurenceInMonth(CurrentTime)) continue;
        if (S_StartW[rule][Operation][k] !== -1 && S_EndW[rule][Operation][k] !== -1 && S_StartW[rule][Operation][k] > S_EndW[rule][Operation][k]) {
            PG_Print(TYPE_ERROR, "Error in Week Format Start Week bigger than end Week : " + S_StartW[rule][Operation][k] + ", " + S_EndW[rule][Operation][k], NO_SEND);
            continue;
        }
        if (S_StartD[rule][Operation][k] !== -1 && S_StartD[rule][Operation][k] > GetDay(CurrentTime)) continue;
        if (S_EndD[rule][Operation][k] !== -1 && S_EndD[rule][Operation][k] < GetDay(CurrentTime)) continue;
        if (S_StartD[rule][Operation][k] !== -1 && S_EndD[rule][Operation][k] !== -1 && S_StartD[rule][Operation][k] > S_EndD[rule][Operation][k]) {
            PG_Print(TYPE_ERROR, "Error in Day Format Start Day bigger than end Day : " + S_StartD[rule][Operation][k] + ", " + S_EndD[rule][Operation][k], NO_SEND);
            continue;
        }

        if (S_StartT[rule][Operation][k] != -1) {
        
            if (GetHours(CurrentTime) < TimeHour(S_StartT[rule][Operation][k])) continue;
            if (GetHours(CurrentTime) == TimeHour(S_StartT[rule][Operation][k]) &&  GetMinutes(CurrentTime) < TimeMinute(S_StartT[rule][Operation][k])) continue;
        }

        if (S_EndT[rule][Operation][k] != -1) {
            if (GetHours(CurrentTime) > TimeHour(S_EndT[rule][Operation][k])) continue;
            if (GetHours(CurrentTime) == TimeHour(S_EndT[rule][Operation][k]) && GetMinutes(CurrentTime) >= TimeMinute(S_EndT[rule][Operation][k])) continue;
        }

        if (S_StartT[rule][Operation][k] != -1 && S_EndT[rule][Operation][k] != -1) {
            if (TimeHour(S_StartT[rule][Operation][k]) > TimeHour(S_EndT[rule][Operation][k]) ||
                (TimeHour(S_StartT[rule][Operation][k]) == TimeHour(S_EndT[rule][Operation][k]) && TimeMinute(S_StartT[rule][Operation][k]) > TimeMinute(S_EndT[rule][Operation][k]))) {           
                PG_Print(TYPE_ERROR, "Error in Time Format Start Time bigger than End Time : " + S_StartT[rule][Operation][k] + ", " + S_EndT[rule][Operation][k], NO_SEND);
                continue;
            }                        
        }          
        
        if (S_OnSameBar[rule][Operation][k]!= -1 && OnSameBar (CurrentPeriod, S_LastCloseTime[rule][Operation])) continue;
        if (S_BetweenT[rule][Operation][k] !== -1 && CurrentTime - S_LastCloseTime[rule][Operation] < S_BetweenT[rule][Operation][k] * 60) continue;
        if (S_FrequencyD[rule][Operation][k] !== -1 && (S_FrequencyD[rule][Operation][k] === 0 || S_NbrRuleStartD[rule][Operation] >= S_FrequencyD[rule][Operation][k])) continue;
        return k;
    }
    return -1;
}

//=============================================RESET ALL ========================================

var Rule2Int = function(srule) {
    return RuleName.indexOf(srule);
}
var Mode2Int = function(smode) {
    return RecoveryModeName.indexOf(smode);
}
var Direction2Int = function(sdirection) {
    return DirectionName.indexOf(sdirection);
}
var DirectionType2Int = function(sdirection) {
    return DirectionTypeName.indexOf(sdirection);
}
var ExitMode2Int = function(sexit) {
    return ExitModeName.indexOf(sexit);
}
var OrderType2Int = function(stype) {
    return OrderTypeName.indexOf(stype);
}
var Operation2Int = function(soperation) {
    return OperationName.indexOf(soperation);
}
var Equal = function(value, Pos, Range) {
    return value <= (Pos + Range *  SYS_POINT) && NormalizeDouble(value + SYS_SPREAD, SYS_DIGITS) >= (Pos - Range *  SYS_POINT);
}
var Upper = function(value, Pos, Range) {
    return value > Pos + Range * SYS_POINT;
}
var Lower = function(value, Pos, Range) {
    return value < Pos - Range *  SYS_POINT;
}
var Fibonacci = function(n) {
    var a = 1;
    var b = 1;
    var c;
    if (n == 0) return (0);
    for (var i = 2; i <= n; i++) {
        c = b;
        b += a;
        a = c;
    }
    return (b);
}

var CalculateGAverage = function() {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    var cnt = 0;
    var total = 0;
    var price = 0;
    var profit = 0;
    var t_nbrlots = 0;
    total = OrdersTotal();
    if (total === 0) return;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderType() <= OP_SELL && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (OrderType() === OP_BUY) {
                t_nbrlots += OrderLots();
                price += OrderLots() * OrderOpenPrice();
            } else {
                t_nbrlots -= OrderLots();
                price -= OrderLots() * OrderOpenPrice();
            }
            profit += OrderProfit();
        }
    }
    if (t_nbrlots !== 0) {
        AveragePoint = price / t_nbrlots;
    } else AveragePoint = -1;
    AccountTotalProfit = profit;
    AccountTotalNbrLots = t_nbrlots;
    return;
}

var ReturnAccountNbrLots = function() {
    var nbrlots = 0;
    var xtotal = OrdersHistoryTotal();
    for (var cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderType() <= OP_SELL) {
            nbrlots += OrderLots();
        }
    }
    return nbrlots;
}
/*
var TreatMM = function() {

    MMDailyClosedProfit = ReturnClosedProfit(-1, -1, -1, 1, 1);
    MMDailySymbolClosedProfit = ReturnClosedProfit(-1, -1, -1, 1);

    if (!MMDailySymbolTargetReached) {
        if (MMDailySymbolTargetAmount !== -1) {
            if (MMDailySymbolClosedProfit + B_TotalProfit + B_TotalHedgeProfit >= MMDailySymbolTargetAmount) {
                MMDailySymbolTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily " + CurrentSymbol + " Target of " + MMDailySymbolTargetAmount + " is reached");
            }
        }
        if (MMDailySymbolStopLoss !== -1) {
            if (MMDailySymbolClosedProfit + B_TotalProfit + B_TotalHedgeProfit < -MMDailySymbolStopLoss) {
                MMDailySymbolTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily " + CurrentSymbol + " Stop Loss of " + MMDailySymbolStopLoss + " is reached");
            }
        }
    }
    if (!MMDailyTargetReached) {
        if (MMDailyTargetAmount !== 0) {
            if (MMDailyClosedProfit + mql4.accountProfit() >= MMDailyTargetAmount) {
                MMDailyTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily Target of " + MMDailyTargetAmount + " is reached");
            }
        }
        if (MMDailyStopLoss !== 0) {
            if (MMDailyClosedProfit + mql4.accountProfit() < -MMDailyStopLoss) {
                MMDailyTargetReached = true;
                ExitAll(OP_BUYSELL, 0, 1);
                Send_Operation("Daily Stop Loss of " + MMDailyStopLoss + " is reached");
            }
        }
    }
}
*/
//====================================== SIMULATION  ========================================

var GMTShift;

var GetShiftGMT = function() {
    var date = new Date().getTimezoneOffset() / 60;
    return (date * 60 * 60);
}

var SYS_DIGITS = 0;
var SYS_POINT = 0;
var SYS_SLIPPAGE = 0;
var SYS_MINLOT = 0.01;
var SYS_MAXLOT = 200;
var SYS_SPREAD = 0;


var InitMarketInfo = function(symbol) {
    var multiplier = 1;
    var i = 0;
    SYS_DIGITS      = +symbol.Digits;
    SYS_POINT       = symbol.SysPoint;
    SYS_SPREAD      = 0.0001; //1 pips
    if (SYS_DIGITS === 2 || SYS_DIGITS === 4) multiplier = 1;
    if (SYS_DIGITS === 3 || SYS_DIGITS === 5) multiplier = 10;
    if (SYS_DIGITS === 6) multiplier = 100;
    if (SYS_DIGITS === 7) multiplier = 1000;
    SYS_SLIPPAGE = symbol.Slippage * multiplier;
    return 0;
}

function RandomPrice(min, max) {  
    return NormalizeDouble(Math.random() * (max - min) + min, SYS_DIGITS); 
}  

//=============================================SESSIONS==========================================

var B_NbrSession = 0;
var B_IMagicNumber = 1 << 6;
var B_TotalClosedProfit = 0;
var B_ActualProfit = 0;
var B_MinPoint = 0;
var B_MaxPoint = 0;
var B_TotalProfit = 0;
var B_TotalBuyProfit = 0;
var B_TotalSellProfit = 0;
var B_TotalHedgeProfit = 0;
var B_TotalHedgeBuyProfit = 0;
var B_TotalHedgeSellProfit = 0;
var B_MaxSessions = 51 // NBR_Engine 
var B_InitSession = Array(B_MaxSessions).fill(false);
var B_FreeSession = Array(B_MaxSessions).fill(true);
var B_MagicNumber = Array(B_MaxSessions).fill(0);
var B_BuyNow = Array(B_MaxSessions).fill(0);
var B_SellNow = Array(B_MaxSessions).fill(0);
var B_BuySell = Array(B_MaxSessions).fill(0);
var B_Suspend = Array(B_MaxSessions).fill(0);
var B_Color = ["gray", "Sienna", "OrangeRed", "Purple", "Indigo", "Red", "MediumBlue", "DarkSlateGray"];
var B_MaxSession = 0;
// ==== > ENGINE =====> RULE Receive information from engine
var B_HMax = Array(B_MaxSessions).fill(0); // history session
var B_HMin = Array(B_MaxSessions).fill(0);
var B_Max = Array(B_MaxSessions).fill(0); // trade session
var B_Min = Array(B_MaxSessions).fill(0);
var B_ExitBuy = Array(B_MaxSessions).fill(0);
var B_ExitSell = Array(B_MaxSessions).fill(0);
var B_CloseBuy = Array(B_MaxSessions).fill(0);
var B_CloseSell = Array(B_MaxSessions).fill(0);
var B_ILot = Array(B_MaxSessions).fill(0);
var B_BuyLot = Array(B_MaxSessions).fill(0);
var B_SellLot = Array(B_MaxSessions).fill(0);
var B_LastLot = Array(B_MaxSessions).fill(0);
var B_LastBuyLot = Array(B_MaxSessions).fill(0);
var B_LastSellLot = Array(B_MaxSessions).fill(0);
var B_MaxLot = Array(B_MaxSessions).fill(0);
var B_SLost = Array(B_MaxSessions).fill(0); // Sum of Consecutive Lost Lots in a session
var B_SGain = Array(B_MaxSessions).fill(0); // Sum of Consecutive Gain Lots in a session
var B_LastOrderType = Array(B_MaxSessions).fill(0); //Last Order Type ... It can be closed or opened
var B_LastOrderCloseProfit = Array(B_MaxSessions).fill(0);
var B_LastOrderCloseType = Array(B_MaxSessions).fill(0);
var B_LastOrderOpenPrice = Array(B_MaxSessions).fill(0); //Last Order open price ... It can be closed or opened
var B_LastOrderClosePrice = Array(B_MaxSessions).fill(0);
var B_LastOrderOpenTime = Array(B_MaxSessions).fill(0); //Last Order time opened ... it can be closed or opened
var B_LastOrderCloseTime = Array(B_MaxSessions).fill(0); // Last order close time
var B_LastOrderCloseLot = Array(B_MaxSessions).fill(0);
var B_FirstOrderClosePrice = Array(B_MaxSessions).fill(0);
var B_FirstOrderOpenPrice = Array(B_MaxSessions).fill(0);
var B_FirstOrderOpenTime = Array(B_MaxSessions).fill(0); //First Order time opened ... it can be closed or opened
var B_FirstOrderCloseTime = Array(B_MaxSessions).fill(0); //First Order time Closed
var B_HasBeenHedged = Array(B_MaxSessions).fill(0);
var B_BuyNbrTrade = Array(B_MaxSessions).fill(0);
var B_SellNbrTrade = Array(B_MaxSessions).fill(0);
var B_BuyNbrLots = Array(B_MaxSessions).fill(0);
var B_SellNbrLots = Array(B_MaxSessions).fill(0);
var B_BuyProfit = Array(B_MaxSessions).fill(0);
var B_SellProfit = Array(B_MaxSessions).fill(0);
var B_Profit = Array(B_MaxSessions).fill(0);
var B_SessionProfit = Array(B_MaxSessions).fill(0);
var B_HedgeProfit = Array(B_MaxSessions).fill(0);
var B_SellHedgeProfit = Array(B_MaxSessions).fill(0);
var B_BuyHedgeProfit = Array(B_MaxSessions).fill(0);
var B_StartDate = Array(B_MaxSessions).fill(0);
var B_NeutralPoint = Array(B_MaxSessions).fill(0);
var B_SellAveragePoint = Array(B_MaxSessions).fill(0);
var B_BuyAveragePoint = Array(B_MaxSessions).fill(0);
var B_HedgeLine = Array(B_MaxSessions).fill(0);
var B_HedgeNbrLots = Array(B_MaxSessions).fill(0);
var B_SellHedgeNbrLots = Array(B_MaxSessions).fill(0);
var B_BuyHedgeNbrLots = Array(B_MaxSessions).fill(0);
var B_HedgeType = Array(B_MaxSessions).fill(0);
var B_Hedged = Array(B_MaxSessions).fill(0);
var B_Symbol = Array(B_MaxSessions).fill(0);
// === > RULE ==== > ENGINE receive information from rule if not manual ..... 
var B_Operation = Array(B_MaxSessions).fill(0);
var B_BuyMinProfit = Array(B_MaxSessions).fill(0); // min profit for all buy in session not include hedge
var B_SellMinProfit = Array(B_MaxSessions).fill(0); // min profit for all sell in session not include hedge
var B_MinProfit = Array(B_MaxSessions).fill(0); // min profit for the session include Hedge
var B_TakeProfit = Array(B_MaxSessions).fill(0); // session Take profit in money
var B_StopLoss = Array(B_MaxSessions).fill(0); // session Stop Loss in money
var B_TStopLoss = Array(B_MaxSessions).fill(0); // session Trailing Stop Loss in money
var B_TrailingStop = Array(B_MaxSessions).fill(0); // session Trailing Stop in money
var B_BuyTakeProfit = Array(B_MaxSessions).fill(0); // session Take profit in money for buy only for OP_BUY
var B_BuyStopLoss = Array(B_MaxSessions).fill(0); // session Stop Loss in money
var B_TBuyStopLoss = Array(B_MaxSessions).fill(0); // session Trailing Stop Loss in money
var B_BuyTrailingStop = Array(B_MaxSessions).fill(0); // session Trailing Stop in money
var B_SellTakeProfit = Array(B_MaxSessions).fill(0); // session Take profit in money for buy only for OP_BUY
var B_SellStopLoss = Array(B_MaxSessions).fill(0); // session Stop Loss in money
var B_TSellStopLoss = Array(B_MaxSessions).fill(0); // session Trailing Stop Loss in money
var B_SellTrailingStop = Array(B_MaxSessions).fill(0); // session Trailing Stop in money
var B_BuyLotSL = Array(B_MaxSessions).fill(0); // order stop loss in pips
var B_BuyLotTP = Array(B_MaxSessions).fill(0); // order Take profit in pips
var B_BuyLotTS = Array(B_MaxSessions).fill(0); // order trailing stop in pips
var B_SellLotSL = Array(B_MaxSessions).fill(0); // order stop loss in pips
var B_SellLotTP = Array(B_MaxSessions).fill(0); // order Take profit in pips
var B_SellLotTS = Array(B_MaxSessions).fill(0); // order trailing stop in pips
var B_OrderType = Array(B_MaxSessions).fill(0);
var B_Direction = Array(B_MaxSessions).fill(0);
var B_DirectionType = Array(B_MaxSessions).fill(0);
var B_MaxCount = Array(B_MaxSessions).fill(0);
var B_MaxTime = Array(B_MaxSessions).fill(0);
var B_RecoveryMode = Array(B_MaxSessions).fill(0);
var B_RecoveryValue = Array(B_MaxSessions).fill(0);
var B_LevelPoint = Array(B_MaxSessions).fill(0); // DT_LEVEL
var B_ExitMode = Array(B_MaxSessions).fill(0);
var B_HedgeMagnitude = Array(B_MaxSessions).fill(0);
var B_HedgeAutomatic = Array(B_MaxSessions).fill(0);
var B_DeHedgeAutomatic = Array(B_MaxSessions).fill(0);
var B_PipStep = Array(B_MaxSessions).fill(0);
var B_TimeStep = Array(B_MaxSessions).fill(0);
var B_BuySellAutomatic = Array(B_MaxSessions).fill(0); // buy sell auto... 
var B_ExitAutomatic = Array(B_MaxSessions).fill(0); // exit manual or auto
var B_StarttAutomatic = Array(B_MaxSessions).fill(0); // start manual or auto
var B_BiggestLot = Array(B_MaxSessions).fill(0);
var B_NoLost = Array(B_MaxSessions).fill(0);
var B_KeepBuySell = Array(B_MaxSessions).fill(0);
var B_OneOrderPerBar = Array(B_MaxSessions).fill(0);
var B_StartOnRule = Array(B_MaxSessions).fill(0);
var B_BuyOnRule = Array(B_MaxSessions).fill(0);
var B_SellOnRule = Array(B_MaxSessions).fill(0);
var B_ExitOnRule = Array(B_MaxSessions).fill(0);
var B_ExitBuyOnRule = Array(B_MaxSessions).fill(0);
var B_ExitSellOnRule = Array(B_MaxSessions).fill(0);
var Automatic = false;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ReadSessions = function() {
    B_MaxSession = 51;
    B_IMagicNumber = 1 << 6;
    for (var i = 0; i < B_MaxSessions; i++) {
        B_LoadSession(B_IMagicNumber, i);
    }
}
var B_LoadSession = function(magicNumber, session) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    var LastComment = "";
    var LastLot = 0;
    var LastBuyLot = 0;
    var LastSellLot = 0;
    var FirstLot = -1;
    var LastOrderOpened = 0;
    var FirstOrderOpened = 11111111111;
    var StillActive = false;
    var HedgeLine = -1;
    var HedgeType = -1;
    var BuySellType = -1;
    var LastOrderType = -1;
    B_FreeSession[session] = true;
    B_InitSession[session] = false;
    B_SellNbrTrade[session] = 0;
    B_BuyNbrTrade[session] = 0;
    var xtotal = OrdersTotal();
    if (xtotal === 0) return -1;


    for (var cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() !== magicNumber + session && OrderMagicNumber() !== magicNumber + session + HedgeMagicNumber) continue;
        if (OrderSymbol() !== symbolcanvas.CurrentSymbol.Name) continue;
        StillActive = true;
        if (OrderOpenTime() > LastOrderOpened) LastComment = OrderComment();
        if (OrderType() <= OP_SELL && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (OrderMagicNumber() === magicNumber + session) {
                BuySellType = 1;
                if (OrderType() === OP_BUY) B_BuyNbrTrade[session]++;
                else B_SellNbrTrade[session]++;
                if (OrderOpenTime() < FirstOrderOpened) {
                    FirstLot = OrderLots();
                    FirstOrderOpened = OrderOpenTime();
                }
                if (OrderOpenTime() > LastOrderOpened) {
                    LastLot = OrderLots();
                    if (OrderType() === OP_BUY) LastBuyLot = LastLot;
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
    if (!StillActive) return -1;
    B_init(session);
    if (BuySellType !== -1 || HedgeType !== -1) {
        B_LastLot[session] = LastLot;
        B_LastBuyLot[session] = LastBuyLot;
        B_LastSellLot[session] = LastSellLot;
        B_HedgeLine[session] = HedgeLine;
        B_HedgeType[session] = HedgeType;
        B_LastOrderOpenTime[session] = LastOrderOpened;
        B_LastOrderType[session] = LastOrderType;
        if (FirstLot !== -1) B_ILot[session] = FirstLot;
    }
    var saveinfo = LastComment;
    B_ReadInfo(session, saveinfo);
    var handle = mql4.throwNotSupportedFunction('FileOpen');
    if (handle !== -1 && mql4.throwNotSupportedFunction('FileSize') !== 0) {
        while (!mql4.throwNotSupportedFunction('FileIsEnding')) {
            var s_info = "";
            s_info = mql4.throwNotSupportedFunction('FileReadString');
            if (session !== mql4.toNumber(B_ReadSInfo(s_info, 0, 2))) continue;
            B_ReadInfo(session, s_info, 1);
            break;
        }
    }
    if (handle !== -1) mql4.throwNotSupportedFunction('FileClose');
    if (B_StartOnRule[session] !== R_MANUAL) {
        var engine = GetEngine(B_StartOnRule[session], B_Operation[session]);
        if (engine === -1) return session;
    } else {
        if (!B_BuySellAutomatic[session]) B_InitManualSession(session, true);
        else Automatic = true;
        return session;
    }
    // we should save all informations here instead of taking default values in case of changing manually values
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
    B_BuyOnRule[session] = EValue(engine, B_BUYRULE);
    B_SellOnRule[session] = EValue(engine, B_SELLRULE);
    B_ExitOnRule[session] = EValue(engine, B_EXITRULE);
    B_ExitBuyOnRule[session] = EValue(engine, B_EXITBUYRULE);
    B_ExitSellOnRule[session] = EValue(engine, B_EXITSELLRULE);
    SetRuleFilter(1, -1, -1, B_StartOnRule[session]);
    return session;
}
var ReturnAverage = function(MagicNumber, Operation) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    switch (arguments.length) {
        case 1:
            Operation = -1;
    }
    var cnt = 0;
    var total = 0;
    var average = 0;
    var t_nbrlots = 0;
    total = OrdersTotal();
    if (total === 0) return 0;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name)
            if (Operation === -1 || OrderType() === Operation) {
                t_nbrlots += OrderLots();
                average += OrderLots() * OrderOpenPrice();
            }
    }
    //
    if (t_nbrlots === 0) return 0;
    return average / t_nbrlots;
}
var ReturnClosedProfit = function(MagicNumber, rule, operation, intheday, allsymbol) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    switch (arguments.length) {
        case 0:
            MagicNumber = -1;
        case 1:
            rule = -1;
        case 2:
            operation = -1;
        case 3:
            intheday = -1;
        case 4:
            allsymbol = -1;
    }
    var myprofit = 0;
    var today = "";
    var timemidnight = new Date();
    var StartDate = new Date();
    var PStartDate = -1;
    var nbrrulestart = 0;
    var xtotal = OrdersHistoryTotal();
    if (intheday !== -1) {
        today = mql4.timeToString(TimeCurrent(), MQL4.TIME_DATE);
        timemidnight = mql4.stringToTime(today);
    }
    // operation is BUY, SELL, BUYSELL
    var sComment = "";
    var slpos = 0;
    var tppos = 0;
    var spos = 0;
    for (var cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        
        if (allsymbol === -1 && OrderSymbol() !== symbolcanvas.CurrentSymbol.Name) continue;
        
        if (((MagicNumber !== -1 && (OrderMagicNumber() === MagicNumber || OrderMagicNumber() === MagicNumber + HedgeMagicNumber)) || MagicNumber === -1) && OrderType() <= OP_SELL) {
            sComment = OrderComment();
            var OrderOperation = +B_ReadSInfo(OrderComment(), spos + 11, 1);
            var OrderRule = Rule2Int(B_ReadSInfo(OrderComment(), spos + 10, 1));
            if (rule === -1) {
                if (operation === -1) {
                    if (intheday === -1) myprofit += OrderProfit();
                    else {
                        if (OrderOpenTime() >= timemidnight) myprofit += OrderProfit();
                    }
                } else if (OrderOperation === operation) {
                    if (intheday === -1) myprofit += OrderProfit();
                    else {
                        if (OrderOpenTime() >= timemidnight) myprofit += OrderProfit();
                    }
                }
            } else {
                if (OrderRule === rule) {
                    if (operation === -1) {
                        if (intheday === -1) myprofit += OrderProfit();
                        else {
                            if (orderOpenTime() >= timemidnight) myprofit += OrderProfit();
                        }
                    } else if (+B_ReadSInfo(OrderComment(), spos + 11, 1) === operation) {
                        if (intheday === -1) {
                            myprofit += OrderProfit();
                        } else {
                            if (orderOpenTime() >= timemidnight) {
                                myprofit += OrderProfit();
                            }
                        }
                    }
                }
            }
        }
    }
    return myprofit;
}
var ReturnProfit = function(MagicNumber, Operation, intheday) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    switch (arguments.length) {
        case 1:
            Operation = -1;
        case 2:
            intheday = -1;
    }
    var myprofit = 0;
    var today = "";
    var timemidnight = new Date();
    var xtotal = OrdersTotal();
    /*
        if (intheday !== -1) {
            today = mql4.timeToString(CurrentTime, MQL4.TIME_DATE);
            timemidnight = mql4.stringToTime(today);
        }
    */
    for (var cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderType() <= OP_SELL && OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (Operation === -1)
                if (intheday === -1) myprofit += OrderProfit();
                else {
                    if (orderOpenTime() >= timemidnight) myprofit += OrderProfit();
                }
            else if (OrderType() === Operation)
                if (intheday === -1) myprofit += OrderProfit();
                else {
                    if (OrderOpenTime() >= timemidnight) myprofit += OrderProfit();
                }
        }
    }
    return myprofit;
}
var ReturnTradeNumber = function(MagicNumber, Operation) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    switch (arguments.length) {
        case 0:
            MagicNumber = -1;
        case 1:
            Operation = -1;
    }
    var cnt = 0;
    var total = 0;
    var xcnt = 0;
    total = OrdersTotal();
    if (total === 0) return 0;
    xcnt = 0;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (MagicNumber !== -1 && OrderMagicNumber() !== MagicNumber) continue;
        if (OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (Operation === -1) xcnt++;
            else if (OrderType() === Operation) xcnt++;
        }
    }
    // for
    return xcnt;
}
var ReturnNbrLots = function(MagicNumber, Operation) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    switch (arguments.length) {
        case 1:
            Operation = -1;
    }
    var nbrlots = 0;
    var xtotal = OrdersTotal();
    for (var cnt = 0; cnt < xtotal; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderType() <= OP_SELL && OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (Operation === -1) nbrlots += OrderLots();
            else if (OrderType() === Operation) nbrlots += OrderLots();
        }
    }
    return nbrlots;
}


var TreatEngines = function() {
    B_start1();
}


var B_SaveInfo = function(session, withsessnbr) {
    switch (arguments.length) {
        case 1:
            withsessnbr = -1;
    }
    var save_info = "";
    var s = "";
    var i = 0;
    // maximum 27 characters
    if (withsessnbr !== -1) {
        s = s + session;
        for (i = s.length; i < 2; i++) {
            s = s + " ";
        }
        save_info = save_info + s;
    }
    s = B_StartDate[session].toString();
    // 10 characters
    for (i = s.length; i < 10; i++) {
        s = s + " ";
    }
    save_info = save_info + s;
    save_info = save_info + RuleName[B_StartOnRule[session]];
    // Rule 1 character
    save_info = save_info + B_Operation[session].toString();
    save_info = save_info + B_Direction[session].toString();
    s = B_PipStep[session].toString();
    // 3 characters
    for (i = s.length; i < 3; i++) {
        s = s + " ";
    }
    s = s.substring(0, 3 + 0);
    save_info = save_info + s;
    s = B_MaxCount[session].toString();
    // 2 characters
    for (i = s.length; i < 2; i++) {
        s = s + " ";
    }
    s = s.substring(0, 2 + 0);
    save_info = save_info + s;
    save_info = save_info + RecoveryModeName[B_RecoveryMode[session]];
    //1 char
    s = B_RecoveryValue[session].toString();
    // 3 characters
    for (i = s.length; i < 3; i++) {
        s = s + " ";
    }
    s = s.substring(0, 3 + 0);
    save_info = save_info + s;
    save_info = save_info + B_HedgeMagnitude[session].toString();
    save_info = save_info + B_OrderType[session].toString();
    save_info = save_info + (B_KeepBuySell[session] == true ? "1" : "0");
    save_info = save_info + B_ExitMode[session].toString();
    save_info = save_info + (B_ExitBuy[session] == true ? "1" : "0");
    save_info = save_info + (B_ExitSell[session] == true ? "1" : "0");
    // 5 characters
    var boolsave = 0;
    if (B_BuySellAutomatic[session]) boolsave |= (1 << B_BUYSELLAUTOMATIC);
    if (B_ExitAutomatic[session]) boolsave |= (1 << B_EXITAUTOMATIC);
    if (B_HedgeAutomatic[session]) boolsave |= (1 << B_HEDGEAUTOMATIC);
    if (B_DeHedgeAutomatic[session]) boolsave |= (1 << B_DEHEDGEAUTOMATIC);
    save_info = save_info + boolsave.toString();
    return save_info;
}
var B_FindInHistory = function(session) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    var smin = 10000;
    var smax = 0;
    var hmin = 10000;
    var hmax = 0;
    var LotMax = 0;
    var LastLot = 0;
    var LastBuyLot = 0;
    var LastSellLot = 0;
    var LastOrderType = -1;
    var FirstOrderCloseTime = 0;
    var FirstOrderOpenTime = 0;
    var FirstOrderOpenPrice = -1;
    var FirstOrderClosePrice = -1;
    var LastOrderCloseTime = 0;
    var LastOrderOpenTime = 0;
    var LastOrderOpenPrice = -1;
    var LastOrderClosePrice = -1;
    var LastOrderCloseLots = -1;
    var LastOrderCloseProfit = 0;
    var LastOrderCloseType = -1;
    // close trade
    var magicNumber = B_MagicNumber[session];
    var total = OrdersTotal();
    for (var cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() !== magicNumber && OrderMagicNumber() !== magicNumber + HedgeMagicNumber) continue;
        if (OrderMagicNumber() === magicNumber + HedgeMagicNumber) {
            B_HasBeenHedged[session] = true;
            continue;
        }
        if (OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            smin = Math.min(OrderOpenPrice(), smin);
            smax = Math.max(OrderOpenPrice(), smax);
            if (OrderOpenTime() >= LastOrderOpenTime) {
                LastOrderOpenTime = OrderOpenTime();
                LastOrderOpenPrice = OrderOpenPrice();
                LastLot = OrderLots();
                LastOrderType = OrderType();
                if (OrderType() === OP_BUY) LastBuyLot = LastLot;
                else LastSellLot = LastLot;
            }
            if (FirstOrderOpenPrice === -1) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            } else if (OrderOpenTime() < FirstOrderOpenTime) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            }
        }
    }
    var sComment = "";
    var slpos = 0;
    var tppos = 0;
    var spos = 0;
    total = OrdersHistoryTotal();
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderMagicNumber() !== magicNumber) continue;
        sComment = OrderComment();
        if (OrderSymbol() === symbolcanvas.CurrentSymbol.Name && B_ReadSInfo(OrderComment(), 0, 10) === B_StartDate[session].toString()) {
            hmin = Math.min(OrderOpenPrice(), smin);
            hmax = Math.max(OrderOpenPrice(), smax);
            LotMax = Math.max(OrderLots(), LotMax);
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
            if (OrderCloseTime() >= LastOrderCloseTime) {
                LastOrderCloseTime = OrderCloseTime();
                LastOrderCloseProfit = OrderProfit();
                LastOrderCloseType = OrderType();
                LastOrderClosePrice = OrderClosePrice();
                LastOrderCloseLots = OrderLots();
            }
            if (OrderOpenTime() >= LastOrderOpenTime) {
                LastOrderOpenTime = OrderOpenTime();
                LastOrderOpenPrice = OrderOpenPrice();
                LastLot = OrderLots();
                LastOrderType = OrderType();
                if (OrderType() === OP_BUY) LastBuyLot = LastLot;
                else LastSellLot = LastLot;
            }
            if (FirstOrderClosePrice === -1) {
                FirstOrderClosePrice = OrderClosePrice();
                FirstOrderCloseTime = OrderCloseTime();
            } else if (OrderCloseTime() <= FirstOrderCloseTime) {
                FirstOrderCloseTime = OrderCloseTime();
                FirstOrderClosePrice = OrderClosePrice();
            }
            if (FirstOrderOpenPrice === -1) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            } else if (OrderOpenTime() <= FirstOrderOpenTime) {
                FirstOrderOpenTime = OrderOpenTime();
                FirstOrderOpenPrice = OrderOpenPrice();
            }
            if (OrderProfit() < 0) {
                B_NoLost[session] = false;
            }
        }
    }
    if (smin === 10000) B_Min[session] = Ask;
    else B_Min[session] = smin;
    if (smax === 0) B_Max[session] = Ask;
    else B_Max[session] = smax;
    B_HMin[session] = Math.min(hmin, B_Min[session]);
    B_HMax[session] = Math.max(hmax, B_Max[session]);
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
var B_ReturnProfit = function(session) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      

    var Profit = 0;
    var magicNumber = B_MagicNumber[session];
    var total = OrdersTotal();
    for (var cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() !== magicNumber && OrderMagicNumber() !== magicNumber + HedgeMagicNumber) continue;
        if (OrderSymbol() === symbolcanvas.CurrentSymbol.Name) Profit += OrderProfit();
    }
    var sComment = "";
    var slpos = 0;
    var tppos = 0;
    var spos = 0;
    total = OrdersHistoryTotal();
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_HISTORY);
        if (OrderMagicNumber() !== magicNumber && OrderMagicNumber() !== magicNumber + HedgeMagicNumber) continue;
        sComment = OrderComment();
        if (B_ReadSInfo(OrderComment(), 0, 10) === B_StartDate[session].toString())
            if (OrderSymbol() === symbolcanvas.CurrentSymbol.Name) Profit += OrderProfit();
    }
    return Profit;
}

var B_HedgeSession = function(session, hedge, operation) {
    switch (arguments.length) {
        case 2:
            operation = OP_BUYSELL;
    }
    // hedge true ==>hedge   false unhedge operation to hedge BUY is sell
    var ret = -1;
    if ((B_Operation[session] === OP_BUY && operation === OP_SELL) || (B_Operation[session] === OP_SELL && operation === OP_BUY))
        return;

    if (hedge === 1) {
        if (operation === OP_SELL && B_SellNbrTrade[session] > 0)
            ret = B_HedgeProcessTrade(session, OP_SELL);
        else if (operation === OP_BUY && B_BuyNbrTrade[session] > 0)
            ret = B_HedgeProcessTrade(session, OP_BUY);

        if (ret < 0)
            return;

        B_HasBeenHedged[session] = true;
    } else {
        ret = B_HedgeCloseTrade(session, operation);
    }
}

var B_HedgeProcessTrade = function(session, operation, StopLoss) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    switch (arguments.length) {
        case 2:
            StopLoss = -1;
    }
    // operation = OP_BUY OP_SELL only
    var ticket = 0;
    var h_mode = 0;
    var nbrlots = 0;
    var price = 0;
    var comment = "";
    var SL = 0;
    var error = 0;
    
    if (operation === OP_BUY) {
        h_mode = OP_SELL;
        nbrlots = B_HedgeMagnitude[session] * (B_BuyNbrLots[session] - B_SellHedgeNbrLots[session]);
    } else 
    if (operation === OP_SELL) {
        h_mode = OP_BUY;
        nbrlots = B_HedgeMagnitude[session] * (B_SellNbrLots[session] - B_BuyHedgeNbrLots[session]);
    } 
    else return 0;
    
    if (nbrlots <= 0)
        return 0;

    comment = B_SaveInfo(session);
    // buy lots of 1 ...
    var tranche = 2;
    if (h_mode === OP_BUY) {
        price = Ask;
        if (StopLoss !== -1)
            SL = Ask - StopLoss * SYS_POINT;
    } else {
        price = Bid;
        if (StopLoss !== -1)
            SL = Bid + StopLoss * SYS_POINT;
    }
    ticket = OrderSend(symbolcanvas.CurrentSymbol, h_mode, nbrlots, price, SYS_SLIPPAGE, SL, 0, comment, B_MagicNumber[session] + HedgeMagicNumber, 0);

    if (ticket > 0) {
        PG_Print(TYPE_INFO, "Hedge order opened : " + OrderOpenPrice());
        nbrlots = 0;
    } else {
        PG_Print(TYPE_ERROR, "Error opening Hedge order : " + ErrorDescription(error));
        return -1;
    }

    B_HedgeType[session] = h_mode;

    return ticket;
}



var B_ProcessTrade = function(session, price, mode, Lots, B_BuyLotSL, B_BuyLotTP, B_SellLotSL, B_SellLotTP, otype) {
    switch (arguments.length) {
        case 8:
            otype = -1;
    }
    var h_mode = 0;
    var comment = "";
    var error = 0;
    var PipStopLoss = 0;
    var PipTakeProfit = 0;
    var h_PipStopLoss = 0;
    var h_PipTakeProfit = 0;
    comment = B_SaveInfo(session);
    //    PG_Print(TYPE_INFO, "Saving vcomment " + comment);
    
    
    if (mode === OP_BUY || mode === OP_BUYLIMIT || mode === OP_BUYSTOP) {
        price = Ask;
        PipStopLoss = B_BuyLotSL;
        PipTakeProfit = B_BuyLotTP;
        h_PipStopLoss = B_SellLotSL;
        h_PipTakeProfit = B_SellLotTP;
    } else {
        price = Bid;
        PipStopLoss = B_SellLotSL;
        PipTakeProfit = B_SellLotTP;
        h_PipStopLoss = B_BuyLotSL;
        h_PipTakeProfit = B_BuyLotTP;
    }
    
    error = OrderTrade(price, mode, Lots, comment, B_MagicNumber[session], PipStopLoss, PipTakeProfit);
    
    if (error !== 0 && error !== -1) //error == -1 means stoploss or take profit error
        return error;
    
    if (B_BuySell[session] === true && otype !== OT_MONO) {
        error = OrderTrade(price, mode == OP_BUY ? OP_SELL : OP_BUY, Lots, comment, B_MagicNumber[session], h_PipStopLoss, h_PipTakeProfit);
        if (error !== 0 && error !== -1) //error == -1 means stoploss or take profit error
            return error;
    }
    
    if (mode !== OP_BUY && mode !== OP_SELL) 
        return 0;
    // pending error finish treatment
    
    if (mode === OP_BUY) {
        B_LastOrderType[session] = OP_BUY;
        B_BuyNow[session] = false;
        B_LastBuyLot[session] = Lots;
    } else {
        B_LastOrderType[session] = OP_SELL;
        B_SellNow[session] = false;
        B_LastSellLot[session] = Lots;
    }
    B_LastLot[session] = Lots;
    B_LastOrderOpenTime[session] = TimeCurrent();
    return 0;
}

var B_ProcessTrailingStop = function(session, operation) {
    switch (arguments.length) {
        case 1:
            operation = -1;
    }
    if (operation === -1) {
        if (B_SessionProfit[session] > B_TrailingStop[session])
            if (B_TStopLoss[session] < B_SessionProfit[session] - B_TrailingStop[session]) {
                B_TStopLoss[session] = B_SessionProfit[session] - B_TrailingStop[session];
            }
    } else if (operation === OP_BUY) {
        if (B_BuyProfit[session] > B_BuyTrailingStop[session]) {
            if (B_TBuyStopLoss[session] < B_BuyProfit[session] - B_BuyTrailingStop[session]) B_TBuyStopLoss[session] = B_BuyProfit[session] - B_BuyTrailingStop[session];
        }
    } else if (operation === OP_SELL) {
        if (B_SellProfit[session] > B_SellTrailingStop[session])
            if (B_TSellStopLoss[session] < B_SellProfit[session] - B_SellTrailingStop[session]) B_TSellStopLoss[session] = B_SellProfit[session] - B_SellTrailingStop[session];
    }
}
var ProcessTPSL = function(MagicNumber) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    var cnt = 0;
    var total = 0;
    total = OrdersTotal();
    if (total === 0) return;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (OrderType() === OP_BUY) {
                if (OrderTakeProfit() !== 0 && Ask >= OrderTakeProfit()) {
                    OrderClose(OrderTicket(), OrderLots(), OrderTakeProfit(), SYS_SLIPPAGE);
                } else
                if (OrderStopLoss() !== 0 && Ask <= OrderStopLoss()) {
                    OrderClose(OrderTicket(), OrderLots(), OrderStopLoss(), SYS_SLIPPAGE);
                }
            } else
            if (OrderType() === OP_SELL) {
                if (OrderTakeProfit() !== 0 && Bid <= OrderTakeProfit()) {
                    OrderClose(OrderTicket(), OrderLots(), OrderTakeProfit(), SYS_SLIPPAGE);
                } else
                if (OrderStopLoss() !== 0 && Bid >= OrderStopLoss()) {
                    OrderClose(OrderTicket(), OrderLots(), OrderStopLoss(), SYS_SLIPPAGE);
                }
            }
        }
    }
    return;
}
var ProcessTrailingStop = function(MagicNumber, BTrailingStop, STrailingStop, TrailingStep, BreakEven) {
    
    switch (arguments.length) {
        case 3:
            TrailingStep = 1;
        case 4:
            BreakEven = -1;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    var cnt = 0;
    var total = 0;
    total = OrdersTotal();
    if (total === 0) return;
    if (TrailingStep === -1) TrailingStep = 1;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name)
            if (OrderType() === OP_BUY) {
                if (BreakEven > 0) {
                    if ((Bid - OrderOpenPrice()) > BreakEven * SYS_POINT) {
                        if ((OrderStopLoss() - OrderOpenPrice()) < 0) {
                            OrderModify(OrderTicket(), OrderOpenPrice(), OrderOpenPrice() + 0 * SYS_POINT, OrderTakeProfit(), 0);
                        }
                    }
                }
                if (BTrailingStop > 0) {
                    if ((Bid - OrderOpenPrice()) > BTrailingStop * SYS_POINT) {
                        if (OrderStopLoss() < Bid - (BTrailingStop + TrailingStep - 1) * SYS_POINT) {
                            OrderModify(OrderTicket(), OrderOpenPrice(), Bid - BTrailingStop * SYS_POINT, OrderTakeProfit(), 0);
                            return;
                        }
                    }
                }
            } else {
                if (BreakEven > 0) {
                    if ((OrderOpenPrice() - Ask) > BreakEven * SYS_POINT) {
                        if ((OrderOpenPrice() - OrderStopLoss()) < 0) {
                            OrderModify(OrderTicket(), OrderOpenPrice(), OrderOpenPrice() - 0 * SYS_POINT, OrderTakeProfit(), 0);
                        }
                    }
                }
                if (STrailingStop > 0) {
                    if (OrderOpenPrice() - Ask > STrailingStop * SYS_POINT) {
                        if (OrderStopLoss() > Ask + (STrailingStop + TrailingStep - 1) * SYS_POINT || OrderStopLoss() === 0) {
                            OrderModify(OrderTicket(), OrderOpenPrice(), Ask + STrailingStop * SYS_POINT, OrderTakeProfit(), 0);
                            return;
                        }
                    }
                }
            }
    }
    return;
}
var B_ReadSInfo = function(info, Pos, length) {
    return info.substring(Pos, length + Pos);
}
var CloseOrders = function(MagicNumber, Operation, NbrLots, FromPrice, Mode, Pending) {
    switch (arguments.length) {
        case 0:
            MagicNumber = -1;
        case 1:
            Operation = -1;
        case 2:
            NbrLots = -1;
        case 3:
            FromPrice = -1;
        case 4:
            Mode = -1;
        case 5:
            Pending = -1;
    }
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    var cnt = 0;
    var total = 0;
    var xcnt = 0;
    var nbrlots = 0;
    var ordertype = 0;
    total = OrdersTotal();
    if (total === 0) return 0;
    for (cnt = 0; cnt < total; cnt++) {
        if (OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES)) {
            if (MagicNumber !== -1 && OrderMagicNumber() !== MagicNumber) continue;
            if (OrderSymbol() !== symbolcanvas.CurrentSymbol.Name) continue;
            if (Pending === -1 && ordertype > OP_SELL) continue;
            if (FromPrice !== -1 && Mode === MODE_LOWER && OrderOpenPrice() >= FromPrice) continue;
            if (FromPrice !== -1 && Mode === MODE_UPPER && OrderOpenPrice() <= FromPrice) continue;
            ordertype = OrderType();
            if (NbrLots === -1) nbrlots = OrderLots();
            else nbrlots = NbrLots;
            if (Operation === -1) {
                if (ordertype <= OP_SELL) {
                    if (ordertype === OP_BUY) {
                        OrderClose(OrderTicket(), nbrlots, Bid, SYS_SLIPPAGE);
                    } else //OP_SELL
                        if (ordertype === OP_SELL) {
                            OrderClose(OrderTicket(), nbrlots, Ask, SYS_SLIPPAGE);
                        } else if (Pending !== -1 && (ordertype === OP_SELLLIMIT || ordertype === OP_SELLSTOP || ordertype === OP_BUYLIMIT || ordertype === OP_BUYSTOP)) {
                        OrderDelete(OrderTicket());
                    }
                }
            } else if (Operation === OP_BUY) {
                if (ordertype === OP_BUY) {
                    OrderClose(OrderTicket(), nbrlots, Bid, SYS_SLIPPAGE);
                } else if (Pending !== -1 && (ordertype === OP_BUYLIMIT || ordertype === OP_BUYSTOP)) {
                    OrderDelete(OrderTicket());
                }
            } else if (Operation === OP_SELL) {
                if (ordertype === OP_SELL) {
                    OrderClose(OrderTicket(), nbrlots, Ask, SYS_SLIPPAGE);
                } else if (Pending !== -1 && (ordertype === OP_SELLLIMIT || ordertype === OP_SELLSTOP)) {
                    OrderDelete(OrderTicket());
                }
            }
        }
    }
    // for
    return 0;
}
var OrderTrade = function(price, mode, Lots, comment, MagicNumber, PipStopLoss, PipTakeProfit) {
    switch (arguments.length) {
        case 5:
            PipStopLoss = 0;
        case 6:
            PipTakeProfit = 0;
    }
    var error = 0;
    var ticket = -1;
    var times = 5;
    var StopLoss = 0;
    var TakeProfit = 0;
    error = 0;
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    
    if (mode === OP_BUY || mode === OP_BUYLIMIT || mode === OP_BUYSTOP) {
        if (mode === OP_BUY) price = Ask;
        if (PipStopLoss !== 0)      StopLoss    = NormalizeDouble(price - (PipStopLoss * SYS_POINT), SYS_DIGITS);
        if (PipTakeProfit !== 0)    TakeProfit  = NormalizeDouble(price + (PipTakeProfit * SYS_POINT), SYS_DIGITS);
    } else
    if (mode === OP_SELL || mode === OP_SELLLIMIT || mode === OP_SELLSTOP) {
        if (mode === OP_SELL) price = Bid;
        if (PipStopLoss !== 0)      StopLoss    = NormalizeDouble(price + (PipStopLoss * SYS_POINT), SYS_DIGITS);
        if (PipTakeProfit !== 0)    TakeProfit   = NormalizeDouble(price - (PipTakeProfit * SYS_POINT), SYS_DIGITS);
    }
    if (ticket <= 0) ticket = OrderSend(symbolcanvas.CurrentSymbol, mode, Lots, price, SYS_SLIPPAGE, 0, 0, comment, MagicNumber, 0);
    if (ticket > 0) {
        PG_Print(TYPE_INFO, ticket + " " + OpName[mode] + "["  + Lots.toFixed(2)  + ", "  + price + "] Opened");
        if (StopLoss !== 0 || TakeProfit !== 0) {
            if (OrderSelect(ticket, SELECT_BY_TICKET) === false || OrderModify(OrderTicket(), OrderOpenPrice(), StopLoss, TakeProfit, 0) === false) {
                PG_Print(TYPE_ERROR, ticket + " OrderModify failed: " + OpName[mode] + " : " + ErrorDescription(error));
                error = -1;
            } else {
                PG_Print(TYPE_INFO, ticket + " " + OpName[mode] + " Modified : [SL:" + StopLoss + ", TP: " + TakeProfit + "]");
            }
        }
    } else {
        PG_Print(TYPE_ERROR, "Error opening order : " + OpName[mode] + " " + Lots);
    }
    return error;
}
var SetSLTP = function(MagicNumber, BuyPipStopLoss, BuyPipTakeProfit, SellPipStopLoss, SellPipTakeProfit) {
    switch (arguments.length) {
        case 1:
            BuyPipStopLoss = 0;
        case 2:
            BuyPipTakeProfit = 0;
        case 3:
            SellPipStopLoss = 0;
        case 4:
            SellPipTakeProfit = 0;
    }
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    var cnt = 0;
    var total = 0;
    if (BuyPipStopLoss === 0 && BuyPipTakeProfit === 0 && SellPipStopLoss === 0 && SellPipTakeProfit === 0) return;
    total = OrdersTotal();
    if (total === 0) return;
    var StopLoss = 0;
    var TakeProfit = 0;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            var price = OrderOpenPrice();
            if (OrderType() === OP_BUY) {
                if (BuyPipStopLoss !== 0) StopLoss = price - (BuyPipStopLoss * SYS_POINT);
                else StopLoss = OrderStopLoss();
                if (BuyPipTakeProfit !== 0) TakeProfit = price + (BuyPipTakeProfit * SYS_POINT);
                else TakeProfit = OrderTakeProfit();
            } else if (OrderType() === OP_SELL) {
                if (SellPipStopLoss !== 0) StopLoss = price + (SellPipStopLoss * SYS_POINT);
                else StopLoss = OrderStopLoss();
                if (SellPipTakeProfit !== 0) TakeProfit = price - (SellPipTakeProfit * SYS_POINT);
                else TakeProfit = OrderTakeProfit();
            }
            OrderModify(OrderTicket(), OrderOpenPrice(), StopLoss, TakeProfit, 0);
        }
    }
    return;
}
var CancelSLTP = function(MagicNumber, BuyPipStopLoss, BuyPipTakeProfit, SellPipStopLoss, SellPipTakeProfit) {
    switch (arguments.length) {
        case 1:
            BuyPipStopLoss = 1;
        case 2:
            BuyPipTakeProfit = 1;
        case 3:
            SellPipStopLoss = 1;
        case 4:
            SellPipTakeProfit = 1;
    }
    
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    var cnt = 0;
    var total = 0;
    var StopLoss = 1;
    var TakeProfit = 1;
    if (BuyPipStopLoss === 0 && BuyPipTakeProfit === 0 && SellPipStopLoss === 0 && SellPipTakeProfit === 0) return;
    total = OrdersTotal();
    if (total === 0) return;
    for (cnt = 0; cnt < total; cnt++) {
        OrderSelect(cnt, SELECT_BY_POS, MODE_TRADES);
        if (OrderMagicNumber() === MagicNumber && OrderSymbol() === symbolcanvas.CurrentSymbol.Name) {
            if (OrderType() === OP_BUY) {
                if (BuyPipTakeProfit === 0 && BuyPipStopLoss === 1) OrderModify(OrderTicket(), OrderOpenPrice(), 0, OrderTakeProfit(), 0);
                else if (BuyPipStopLoss === 0 && BuyPipTakeProfit === 1) OrderModify(OrderTicket(), OrderOpenPrice(), OrderStopLoss(), 0, 0);
                else if (BuyPipStopLoss === 1 && BuyPipTakeProfit === 1) OrderModify(OrderTicket(), OrderOpenPrice(), 0, 0, 0);
            } else if (OrderType() === OP_SELL) {
                if (SellPipTakeProfit === 0 && SellPipStopLoss === 1) OrderModify(OrderTicket(), OrderOpenPrice(), 0, OrderTakeProfit(), 0);
                else if (SellPipStopLoss === 0 && SellPipTakeProfit === 1) OrderModify(OrderTicket(), OrderOpenPrice(), OrderStopLoss(), 0, 0);
                else if (SellPipStopLoss === 1 && SellPipTakeProfit === 1) OrderModify(OrderTicket(), OrderOpenPrice(), 0, 0, 0);
            }
        }
    }
    return;
}
var B_ReturnFreeSession = function() {
    for (var i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] === true) {
            B_FreeSession[i] = false;
            return i;
        }
    }
    return -1;
}


var AccountEquity = function () {
    return AccountInitialBalance - AccountTotalProfit;
}


var AccountFreeMargin = function () {
    return 10000;
}


var B_StartNewSessionRule = function(time, rule, operation) {
    // minutes
    var found = false;
    var allhedged = false;
    var LastTrade = -1;
    var nbrhedged = 0;
    var nbrsession = 0;
    var divsession = false;
    if (EndSessions === true) return false;
    /*

        if (accountFreeMargin() < accountEquity() / 10) {

            PG_Print(TYPE_WARNING, "Check Account : Free Margin = " + accountFreeMargin());

            return false;

        }

        

        // MONEY MANAGEMENT

        if (MMDailyTargetReached || MMDailySymbolTargetReached)

            return false;

    */
    for (var i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] === false) {
            LastTrade = Math.max(B_StartDate[i], LastTrade);
            if (!B_Hedged[i]) allhedged = false;
            else nbrhedged++;
            nbrsession++;
            if (B_StartOnRule[i] === rule && B_Operation[i] === operation) {
                found = true;
            }
        }
    }
    if (nbrsession >= B_MaxSessions) return false;

    if (time !== 0 && LastTrade !== -1 && timeCurrent() - LastTrade < time * 60)
        return false;

    if (!found) {
        var engine = GetEngine(rule, operation);
        if (engine !== -1) {
            /*            

                        Send_Operation("Session started for strategy : " + EngineName[engine] + " Currency " + symbolcanvas.CurrentSymbol);

                        if (AlertOnStartRule)

                            console.log('Mt4 Alert :' + symbolcanvas.CurrentSymbol + " Session started : " + EngineName[engine] + "" + "");

             */
        } else return false;
        return true;
    }
    return false;
}

var InitSessionFromEngine = function(session, engine) {
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
    B_MaxLot[session] = EValue(engine, B_MAXLOT);
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
var B_init = function(session) {

    PG_Print(TYPE_INFO, "B_Init " + session);
    
    B_FreeSession[session] = false;
    B_InitSession[session] = true;
    B_MagicNumber[session] = B_IMagicNumber + session;
    B_BuySellAutomatic[session] = true;
    B_KeepBuySell[session] = false;
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
    B_Max[session] = Ask;
    B_Min[session] = Ask;

    B_Suspend[session] = false;
    B_LastOrderType[session] = -1;

    B_LastLot[session] = 0;
    B_LastBuyLot[session] = 0;
    B_LastSellLot[session] = 0;
   
    B_BuyNbrTrade[session] = 0;
    B_SellNbrTrade[session] = 0;
   
    B_LastOrderOpenTime[session] = 0;    // current trade or history
    B_LastOrderCloseTime[session] = 0;    // current trade or history

    B_FirstOrderOpenTime[session] = 0;    // current trade or history
    B_FirstOrderCloseTime[session] = 0;    // current trade or history

    B_LastOrderCloseProfit[session] = 0;    // closed
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

    B_BuyMinProfit[session] = B_TakeProfit[session] * B_ILot[session];    //B_SessionProfit * B_ILot[session];
    B_SellMinProfit[session] = B_TakeProfit[session] * B_ILot[session];    //B_SessionProfit * B_ILot[session];

    PG_Print(TYPE_INFO, "***************************************************    Start Session " + session);

    B_InitGraphics(session);
    B_NbrSession += 1;
    return 0;
}


var B_StartNewSession = function() {
    var new_session;
    if (B_NbrSession >= B_MaxSessions) return (-1);
    new_session = B_ReturnFreeSession();
    if (new_session != -1) {
        B_StartDate[new_session] = TimeCurrent();
        B_init(new_session);
    }
    return (new_session);
}


var B_ExitSession = function(session, operation) {
    switch (arguments.length) {
        case 1:
            operation = -1;
    }
    if (operation === OP_BUY) B_ExitBuy[session] = true;
    else if (operation === OP_SELL) B_ExitSell[session] = true;
    else {
        B_ExitBuy[session] = true;
        B_ExitSell[session] = true;
        B_HedgeCloseTrade(session);
    }
}
var B_HedgeCloseTrade = function(session, operation) {
    switch (arguments.length) {
        case 1:
            operation = -1;
    }
    // operation = OP_BUY, OP_SELL, OP_BUYSELL
    var ticket = 0;
    var h_mode = 0;
    var nbrlots = 0;
    if (operation === OP_BUY) h_mode = OP_SELL;
    else if (operation === OP_SELL) h_mode = OP_BUY;
    else h_mode = -1;
    nbrlots = ReturnNbrLots(B_MagicNumber[session] + HedgeMagicNumber, h_mode);
    while (nbrlots > 0.000001) {
        CloseOrders(B_MagicNumber[session] + HedgeMagicNumber, h_mode);
        nbrlots = ReturnNbrLots(B_MagicNumber[session] + HedgeMagicNumber, h_mode);
    }
    return ticket;
}
var B_CloseSession = function(session, operation) {
    switch (arguments.length) {
        case 1:
            operation = -1;
    }
    if (operation === OP_BUY) B_CloseBuy[session] = true;
    else if (operation === OP_SELL) B_CloseSell[session] = true;
    else {
        B_CloseBuy[session] = true;
        B_CloseSell[session] = true;
    }
}
var B_start1 = function() {
    B_TotalClosedProfit = 0;
    B_TotalProfit = 0;
    B_TotalBuyProfit = 0;
    B_TotalSellProfit = 0;
    B_TotalHedgeProfit = 0;
    B_TotalHedgeBuyProfit = 0;
    B_TotalHedgeSellProfit = 0;
    B_MaxPoint = 0;
    B_MinPoint = 1000;
    for (var i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] === false) {
            if (B_StartOnRule[i] === R_MANUAL) B_BuySellAutomatic[i] = Automatic;
            //=============================
            B_start(i);
            //=============================
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
            B_SessionProfit[i] = B_ReturnProfit(i);
            // with history
            if (B_HedgeNbrLots[i] > 0.000001) {
                B_Hedged[i] = true;
                B_HasBeenHedged[i] = true;
            } else B_Hedged[i] = false;
            if (B_BuyHedgeNbrLots[i] > 0)
                if (B_SellHedgeNbrLots[i] > 0) B_HedgeType[i] = OP_BUYSELL;
                else B_HedgeType[i] = OP_BUY;
            else if (B_SellHedgeNbrLots[i] > 0) B_HedgeType[i] = OP_SELL;
            else B_HedgeType[i] = -1;
            B_FindInHistory(i);
            B_NeutralPoint[i] = B_Min[i] + (B_Max[i] - B_Min[i]) / 2;
            B_SellAveragePoint[i] = ReturnAverage(B_MagicNumber[i], OP_SELL);
            B_BuyAveragePoint[i] = ReturnAverage(B_MagicNumber[i], OP_BUY);
            B_TotalHedgeBuyProfit += B_BuyHedgeProfit[i];
            B_TotalHedgeSellProfit += B_SellHedgeProfit[i];
            B_TotalBuyProfit += B_BuyProfit[i];
            B_TotalSellProfit += B_SellProfit[i];
            B_MaxPoint = Math.max(B_HMax[i], B_MaxPoint);
            B_MinPoint = Math.min(B_HMin[i], B_MinPoint);
            // some adjustment in case ....
            if (B_ExitSell[i] === true || B_ExitBuy[i] === true || B_OrderType[i] !== OT_HEDGE || B_Operation[i] !== OP_BUYSELL) B_KeepBuySell[i] = false;
            if (B_Operation[i] !== OP_BUYSELL) B_OrderType[i] = OT_MONO;
            if (B_CloseSell[i] === true && B_SellNbrTrade[i] === 0) B_CloseSell[i] = false;
            if (B_CloseBuy[i] === true && B_BuyNbrTrade[i] === 0) B_CloseBuy[i] = false;
            if (B_TrailingStop[i] === 0) B_TStopLoss[i] = 0;
            if (B_BuyTrailingStop[i] === 0) B_TBuyStopLoss[i] = 0;
            if (B_SellTrailingStop[i] === 0) B_TSellStopLoss[i] = 0;
            //     if (B_Hedged[i]) B_BuySellAutomatic[i] = true;
            // end some adjustment
            if (B_Hedged[i]) {
                if (B_HedgeType[i] === OP_BUY) B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber, OP_BUY);
                else if (B_HedgeType[i] === OP_SELL) B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber, OP_SELL);
                else B_HedgeLine[i] = ReturnAverage(B_MagicNumber[i] + HedgeMagicNumber);
            }
            //            B_DrawGraphics(i);
            //=============================
            /// Next Lot is calculated here
            //=============================
            var Lot = [B_ILot[i], B_ILot[i]];
            B_SetRecoveryMode(i, Lot);
            B_BuyLot[i] = Lot[0];
            B_SellLot[i] = Lot[1];
        }
        B_TotalClosedProfit += ReturnClosedProfit(B_IMagicNumber + i);
        B_TotalProfit = B_TotalBuyProfit + B_TotalSellProfit;
        B_TotalHedgeProfit = B_TotalHedgeBuyProfit + B_TotalHedgeSellProfit;
    }
    //    B_SaveSessions();
    //    SaveFlagEngines();
    return 0;
}
var B_start = function(session) {
    var symbolcanvas = solution.GetCanvasFromTerminal();
    if (!symbolcanvas) return;      
    
    
    var engine = GetEngine(B_StartOnRule[session], B_Operation[session]);
    var PipStep = B_PipStep[session];
    //----------------------------------------
    // CLOSING AND EXITING IN SESSION
    //----------------------------------------
    if (B_CloseBuy[session] === true && B_BuyNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "++++++++++++++++++++++++++++++++++++++++++   CLOSE BUY SESSION  : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_BuyProfit[session].toFixed(2));
        CloseOrders(B_MagicNumber[session], OP_BUY);
        return 0;
    }
    if (B_CloseSell[session] === true && B_SellNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "+++++++++++++++++++++++++++++++++++++++++++   CLOSE SELL SESSION  : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_SellProfit[session].toFixed(2));
        CloseOrders(B_MagicNumber[session], OP_SELL);
        return 0;
    }
    if (B_ExitBuy[session] === true && B_BuyNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "++++++++++++++++++++++++++++++++++++++++++   EXIT BUY SESSION : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_BuyProfit[session].toFixed(2));
        CloseOrders(B_MagicNumber[session], OP_BUY, -1, -1, -1, 1);
        return 0;
    }
    if (B_ExitSell[session] === true && B_SellNbrTrade[session] > 0) {
        PG_Print(TYPE_INFO, "+++++++++++++++++++++++++++++++++++++++++++   EXIT SELL SESSION   : " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_SellProfit[session].toFixed(2));
        CloseOrders(B_MagicNumber[session], OP_SELL, -1, -1, -1, 1);
        return 0;
    }
    if (B_ExitBuy[session] === true && B_ExitSell[session] === true && B_HedgeNbrLots[session] + B_BuyNbrTrade[session] + B_SellNbrTrade[session] === 0) {
        PG_Print(TYPE_INFO, "************************************************ End Session " + session + " Rule " + RuleName[B_StartOnRule[session]] + " profit : " + B_SessionProfit[session].toFixed(2) + " Time Elapsed : " + TimeCurrent() - B_StartDate[session]);
        B_NbrSession -= 1;
        B_deinit(session);
        return 0;
    }
    //----------------------------------------
    // TRAILING STOP FOR BUY SELL AND SESSION
    //----------------------------------------
    if (B_BuyLotTS[session] !== 0 || B_SellLotTS[session] !== 0) ProcessTrailingStop(B_MagicNumber[session], B_BuyLotTS[session], B_SellLotTS[session]);
    if (B_TrailingStop[session] !== 0) {
        B_ProcessTrailingStop(session);
    }
    if (B_Operation[session] !== OP_SELL && B_BuyTrailingStop[session] !== 0) B_ProcessTrailingStop(session, OP_BUY);
    if (B_Operation[session] !== OP_BUY && B_SellTrailingStop[session] !== 0) B_ProcessTrailingStop(session, OP_SELL);
    //----------------------------------------
    // BUY SELL IN SESSION
    //----------------------------------------
    /*    

        if (accountFreeMargin() < accountEquity() / 10 && (B_BuyNow[session] === true || B_SellNow[session] === true)) {

            PG_Print(TYPE_WARNING, "Check Account : Free Margin = " + accountFreeMargin() + "  Equity : " + accountEquity());

            Send_Operation("Check Account : Free Margin =" + accountFreeMargin() + "  Equity : " + accountEquity());

        } else */
    {
        if (B_Operation[session] === OP_BUYSELL) {
            if (B_OrderType[session] === OT_HEDGE && B_ExitSell[session] === false && B_ExitBuy[session] === false) B_BuySell[session] = true;
            else B_BuySell[session] = false;
        } else B_BuySell[session] = false;
        if (B_BuyNow[session] === true) {
            if ((B_BuyLot[session] < SYS_MINLOT || B_BuyLot[session] > SYS_MAXLOT) || (B_MaxLot[session] != 0 && B_BuyLot[session] > B_MaxLot[session])) {
                PG_Print(TYPE_ERROR, "Buy Lots : " + B_BuyLot[session] + " not in Range for the symbol  : " + symbolcanvas.CurrentSymbol + " in Session : " + session);
                B_BuyNow[session] = false;
            } else {
                if (engine === -1) {
                    if (B_StartOnRule[session] === R_MANUAL)
                        if (B_BuySellAutomatic[session]) {
                            Send_Manual(symbolcanvas.CurrentSymbol, session, OP_BUY, B_BuyLot[session], B_BuyLotSL[session], B_BuyLotTP[session], 1);
                            B_BuyNow[session] = false;
                        } else B_BuyNow[session] = true;
                } else return B_ProcessTrade(session, 0, OP_BUY, B_BuyLot[session], B_BuyLotSL[session], B_BuyLotTP[session], B_SellLotSL[session], B_SellLotTP[session]);
            }
        } else {
            if (engine === -1) {
                if (B_StartOnRule[session] === R_MANUAL)
                    if (B_BuySellAutomatic[session]) Send_Manual(symbolcanvas.CurrentSymbol, session, OP_BUY, B_BuyLot[session], B_BuyLotSL[session], B_BuyLotTP[session], 0);
            }
        }
        if (B_SellNow[session] === true) {
            if ((B_SellLot[session] < SYS_MINLOT || B_SellLot[session] > SYS_MAXLOT) || (B_MaxLot[session] != 0 && B_SellLot[session] > B_MaxLot[session])) {
                PG_Print(TYPE_ERROR, "Sell Lots : " + B_SellLot[session]  + " not in Range for the symbol  : " + symbolcanvas.CurrentSymbol);
                B_SellNow[session] = false;
            } else {
                if (engine === -1) {
                    if (B_StartOnRule[session] === R_MANUAL)
                        if (B_BuySellAutomatic[session]) {
                            Send_Manual(symbolcanvas.CurrentSymbol, session, OP_SELL, B_SellLot[session], B_SellLotSL[session], B_SellLotTP[session], 1);
                            B_SellNow[session] = false;
                        } else B_SellNow[session] = true;
                } else return B_ProcessTrade(session, 0, OP_SELL, B_SellLot[session], B_BuyLotSL[session], B_BuyLotTP[session], B_SellLotSL[session], B_SellLotTP[session]);
            }
        } else {
            if (engine === -1) {
                if (B_StartOnRule[session] === R_MANUAL)
                    if (B_BuySellAutomatic[session]) Send_Manual(symbolcanvas.CurrentSymbol, session, OP_SELL, B_SellLot[session], B_SellLotSL[session], B_SellLotTP[session], 0);
            }
        }
    }
    //----------------------------------------
    // FIRST BUY SELL IN SESSION
    //----------------------------------------
    if (B_LastLot[session] === 0) {
        if (!B_BuySellAutomatic[session] || B_Suspend[session]) return 0;
        if (B_Operation[session] === OP_BUYSELL) {
            if (B_OrderType[session] === OT_HEDGE) {
                if (B_BuyRule(session) || B_SellRule(session)) B_BuyNow[session] = true;
            } else {
                if (B_BuyRule(session)) B_BuyNow[session] = true;
                if (B_SellRule(session)) B_SellNow[session] = true;
            }
        } else if (B_Operation[session] === OP_BUY && B_BuyRule(session)) B_BuyNow[session] = true;
        else if (B_Operation[session] === OP_SELL && B_SellRule(session)) B_SellNow[session] = true;
        return 0;
    }
    //----------------------------------------
    // DEHEDGE AUTOMATIC
    //----------------------------------------
    if (B_DeHedgeAutomatic[session]) {
        if (B_Hedged[session] === true) {
            if (B_CloseHedgeBuyRule(session)) {
                B_HedgeSession(session, 0, OP_BUY);
                return 0;
            }
            if (B_CloseHedgeSellRule(session)) {
                B_HedgeSession(session, 0, OP_SELL);
                return 0;
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
    //Ajout Simulation
    ProcessTPSL(B_MagicNumber[session]);
    if (B_ExitAutomatic[session]) {
        if (B_ExitRule(session)) {
            console.log("Should Exit ! ");
            B_ExitSession(session);
            return 0;
        }
        if (B_Operation[session] !== OP_BUYSELL || !B_KeepBuySell[session]) {
            if (!B_ExitBuy[session] && B_ExitBuyRule(session)) {
                // && (!B_Hedged[session] || (B_Hedged[session] && B_HedgeType[session] == OP_BUY)))         // exit buy
                if (B_Operation[session] === OP_BUYSELL && !B_ExitSell[session] && B_RecoveryMode[session] === M_J) B_MaxCount[session] += (B_BuyNbrTrade[session] - 1);
                // adjust recovery count
                B_ExitBuy[session] = true;
                return 0;
            }
            if (!B_ExitSell[session] && B_ExitSellRule(session)) {
                //&& (!B_Hedged[session] || (B_Hedged[session] && B_HedgeType[session] == OP_SELL)))      // exit sell
                if (B_Operation[session] === OP_BUYSELL && !B_ExitBuy[session] && B_RecoveryMode[session] === M_J) B_MaxCount[session] += (B_SellNbrTrade[session] - 1);
                // adjust recovery count
                B_ExitSell[session] = true;
                return 0;
            }
        }
        if ((!B_CloseSell[session] || !B_CloseBuy[session]) && B_CloseRule(session)) {
            B_CloseSession(session);
            return 0;
        }
        if (!B_CloseBuy[session] && B_CloseBuyRule(session)) {
            B_CloseSession(session, OP_BUY);
            return 0;
        }
        if (!B_CloseSell[session] && B_CloseSellRule(session)) {
            B_CloseSession(session, OP_SELL);
            return 0;
        }
    }
    // Automatic Exit
    //----------------------------------------
    // HEDGE AUTOMATIC
    //----------------------------------------
    if (B_HedgeAutomatic[session] && !B_Suspend[session]) {
        // hedge Automatic
        if (B_HedgeBuyRule(session)) {
            B_HedgeSession(session, 1, OP_BUY);
            return 0;
        }
        if (B_HedgeSellRule(session)) {
            B_HedgeSession(session, 1, OP_SELL);
            return 0;
        }
    }
    //----------------------------------------
    // BUY SELL AUTOMATIC
    //----------------------------------------
    if (B_BuySellAutomatic[session] && !B_Suspend[session]) {
        if (B_BuyRule(session)) B_BuyNow[session] = true;
        if (B_SellRule(session)) B_SellNow[session] = true;
    }
    return 0;
}
//+------------------------------------------------------------------+ INIT
var B_deinit = function(session) {
    PG_Print(TYPE_INFO, "B_deinit" + session);
    B_ExitBuy[session] = false;
    B_ExitSell[session] = false;
    B_CloseBuy[session] = false;
    B_CloseSell[session] = false;
    B_Max[session] = Ask;
    B_Min[session] = Ask;
    B_BuyNow[session] = false;
    B_SellNow[session] = false;
    B_FreeSession[session] = true;
    B_InitSession[session] = false;
    B_PipStep[session] = -1;
    B_BuySellAutomatic[session] = 1;
    B_KeepBuySell[session] = false;
    B_Hedged[session] = false;
    return (0);
}
//+------------------------------------------------------------------+ START
var B_SetRecoveryMode = function(session, Lot) {
    // recovery MODE
    var RecoveryMode = RecoveryModeName[B_RecoveryMode[session]];
    if (RecoveryMode == "C") // Constant
    {
        // nothing
    } else
    if (RecoveryMode == "I") // Increment
    {
        if (B_BuyNbrTrade[session] == 0) Lot[0] = B_ILot[session];
        else Lot[0] = B_RecoveryValue[session] + B_LastBuyLot[session];
        if (B_SellNbrTrade[session] == 0) Lot[1] = B_ILot[session];
        else Lot[1] = B_RecoveryValue[session] + B_LastSellLot[session];
    } else
    if (RecoveryMode == "M") // Martingale on multiplier
    {
        if (B_BuyNbrTrade[session] == 0) Lot[0] = B_ILot[session];
        else Lot[0] = Math.round(B_RecoveryValue[session] * B_LastBuyLot[session] * 100) / 100;
        if (B_SellNbrTrade[session] == 0) Lot[1] = B_ILot[session];
        else Lot[1] = Math.round(B_RecoveryValue[session] * B_LastSellLot[session] * 100) / 100;
    } else
    if (RecoveryMode == "J") // multiplier after close one side
    {
        if (B_Operation[session] != OP_BUYSELL || B_ExitSell[session] == true || B_ExitBuy[session] == true) {
            Lot[0] = Math.round(B_RecoveryValue[session] * B_LastBuyLot[session] * 100) / 100;
            Lot[1] = Math.round(B_RecoveryValue[session] * B_LastSellLot[session] * 100) / 100;
        }
    } else
    if (RecoveryMode == "P") // if lost we begin lot ... else increment  
    {
        if (B_BiggestLot[session] != 0 && !B_NoLost[session]) {
            if (B_LastOrderCloseProfit[session] > 0) {
                Lot[0] = B_BiggestLot[session] + B_ILot[session];
                Lot[1] = B_BiggestLot[session] + B_ILot[session];
            }
        }
    } else
    if (RecoveryMode == "A") // Alembex : if lost same lot else last cumulative lost
    {
        if (B_LastOrderCloseProfit[session] >= 0) {
            if (B_SGain[session] > B_SLost[session]) {
                Lot[0] = B_ILot[session];
                Lot[1] = B_ILot[session];
            } else {
                Lot[0] = B_SLost[session];
                Lot[1] = B_SLost[session];
            }
        } else {
            Lot[0] = B_LastLot[session];
            Lot[1] = B_LastLot[session];
        }
    } else
    if (RecoveryMode == "Q") // if lost we multiply lot by multiplier and change type 
    {
        if (B_LastOrderCloseProfit[session] < 0) {
            if (B_LastOrderCloseType[session] == OP_BUY) Lot[1] = Math.round(B_RecoveryValue[session] * B_LastOrderCloseLot[session] * 100) / 100;
            else
            if (B_LastOrderCloseType[session] == OP_SELL) Lot[0] = Math.round(B_RecoveryValue[session] * B_LastOrderCloseLot[session] * 100) / 100;
        }
    } else
    if (RecoveryMode == "F") // Fibonacci
    {
        if (B_BuyNbrTrade[session] > 0) Lot[0] = Fibonacci(B_BuyNbrTrade[session]) * B_ILot[session];
        if (B_SellNbrTrade[session] > 0) Lot[1] = Fibonacci(B_SellNbrTrade[session]) * B_ILot[session];
    } else
    if (RecoveryMode == "D") // Double starting from counttodouble
    {
        if (B_BuyNbrTrade[session] >= B_RecoveryValue[session]) Lot[0] = 2 * B_ILot[session];
        if (B_SellNbrTrade[session] >= B_RecoveryValue[session]) Lot[1] = 2 * B_ILot[session];
    } else
    if (RecoveryMode == "H") // Steve Hopwood 1.1.2.4   /maxcount is 4 
    {
        if (B_BuyNbrTrade[session] == 2) Lot[0] = 2 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] == 3) Lot[0] = 4 * B_ILot[session];
        if (B_SellNbrTrade[session] == 2) Lot[1] = 2 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] == 3) Lot[1] = 4 * B_ILot[session];
    } else
    if (RecoveryMode == "S") // Steve Hopwood 1.1.3.3   /maxcount is 4 
    {
        if (B_BuyNbrTrade[session] >= 2) Lot[0] = 3 * B_ILot[session];
        if (B_SellNbrTrade[session] >= 2) Lot[1] = 3 * B_ILot[session];
    } else
    if (RecoveryMode == "N") // Steve Hopwood 1.2.6   /maxcount is 3
    {
        if (B_BuyNbrTrade[session] == 1) Lot[0] = 2 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] >= 2) Lot[0] = 6 * B_ILot[session];
        if (B_SellNbrTrade[session] == 1) Lot[1] = 2 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] >= 2) Lot[1] = 6 * B_ILot[session];
    } else
    if (RecoveryMode == "O") // Steve Hopwood 1.2.6.24   /maxcount is 4
    {
        if (B_BuyNbrTrade[session] == 1) Lot[0] = 2 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] == 2) Lot[0] = 6 * B_ILot[session];
        else
        if (B_BuyNbrTrade[session] == 3) Lot[0] = 24 * B_ILot[session];
        if (B_SellNbrTrade[session] == 1) Lot[1] = 2 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] == 2) Lot[1] = 6 * B_ILot[session];
        else
        if (B_SellNbrTrade[session] == 3) Lot[1] = 24 * B_ILot[session];
    } else
        /*   if (RecoveryMode == "U")                                                    // Steve Hopwood 1.2.6.24   /maxcount is 4

           {

               Lot[0]    = B_RecoveryTab[B_BuyNbrTrade[session]][session] * B_ILot[session];

               Lot[1]    = B_RecoveryTab[B_SellNbrTrade[session]][session] * B_ILot[session];

           }

           else

        */
    if (RecoveryMode == "L") // Leverage
    {
        var distance;
        if (B_SellProfit[session] < 0) {
            distance = -B_RecoveryValue[session] * SYS_POINT;
            Lot[1] = ((B_SellAveragePoint[session] - Bid - distance) * B_SellNbrLots[session]) / distance;
        }
        if (B_BuyProfit[session] < 0) {
            distance = B_RecoveryValue[session] * SYS_POINT;
            Lot[0] = ((B_BuyAveragePoint[session] - Ask - distance) * B_BuyNbrLots[session]) / distance;
        }
    } else
    if (RecoveryMode == "K") // Opposite Leverage
    {
        if (B_BuyProfit[session] < 0) {
            distance = -B_RecoveryValue[session] * SYS_POINT;
            Lot[1] = (((Bid + distance) * (B_BuyNbrLots[session] - B_SellNbrLots[session]) + (B_SellAveragePoint[session] * B_SellNbrLots[session] - B_BuyAveragePoint[session] * B_BuyNbrLots[session])) / distance);
            //Print ("Lot[1] " + Lot[1]);
        }
        if (B_SellProfit[session] < 0) {
            distance = B_RecoveryValue[session] * SYS_POINT;
            Lot[0] = (((Ask + distance) * (B_SellNbrLots[session] - B_BuyNbrLots[session]) + (B_BuyAveragePoint[session] * B_BuyNbrLots[session] - B_SellAveragePoint[session] * B_SellNbrLots[session])) / distance);
            //Print ("Lot[0] " + Lot[0]);
        }
    }
    if (Lot[0] <= 0 || Lot[0] > B_MaxLot[session]) Lot[0] = B_ILot[session];
    if (Lot[1] <= 0 || Lot[1] > B_MaxLot[session]) Lot[1] = B_ILot[session];
}


var B_BuyRule = function(session) {
    if (B_CloseBuy[session] || B_ExitBuy[session] || B_Operation[session] === OP_SELL) return false;
    
    if (B_BuyNbrTrade[session] >= B_MaxCount[session]) return false;
    
    if (B_OneOrderPerBar[session] != 0 && B_LastOrderOpenTime[session] != 0 && OnSameBar (CurrentEngine.CurrentPeriod, B_LastOrderOpenTime[session])) {
        return (false);
        }
    
    if (B_TimeStep[session] !== 0 && B_LastOrderOpenTime[session] !== 0 && (TimeCurrent() - B_LastOrderOpenTime[session]) < B_TimeStep[session] * 60) return false;
    
    if (B_BuyOnRule[session] !== -1 && !AndR(OP_BUY, T_STATUS, B_BuyOnRule[session])) return false;
    
    if (B_PipStep[session] === 0)
        // forward is ignored but time or bar step should be set....
        return true;
    else {
        var level = B_PipStep[session] * SYS_POINT;
        var Min = 0;
        var Max = 0;
        if (B_DirectionType[session] === DT_MINMAX) {
            if (B_BuyNbrTrade[session] === 0 && B_SellNbrTrade[session] === 0) return true;
            // nothing in session
            Min = B_Min[session];
            Max = B_Max[session];
        } else {
            if (B_BuyNbrTrade[session] === 0 && B_SellNbrTrade[session] === 0) return true;
            // nothing in session
            B_LevelPoint[session] = B_LastOrderOpenPrice[session];
            Min = B_LevelPoint[session];
            Max = B_LevelPoint[session];
            if (Min === -1) return false;
        }
        if (B_Direction[session] === D_BACKWARD && Ask <= Min - level) return true;
        if (B_Direction[session] === D_FORWARD && Ask >= Max + level) return true;
        if (B_Direction[session] === D_ANY && (Ask >= Max + level || Ask <= Min - level)) return true;
    }
    return false;
}


var B_SellRule = function(session) {
    if (B_CloseSell[session] || B_ExitSell[session] || B_Operation[session] === OP_BUY) return false;
   
    if (B_SellNbrTrade[session] >= B_MaxCount[session]) return false;
   
     if (B_OneOrderPerBar[session] != 0 && B_LastOrderOpenTime[session] != 0 && OnSameBar (CurrentEngine.CurrentPeriod, B_LastOrderOpenTime[session])) {
        return (false);
    }
    
    if (B_TimeStep[session] !== 0 && B_LastOrderOpenTime[session] !== 0 && (TimeCurrent() - B_LastOrderOpenTime[session]) < B_TimeStep[session] * 60) return false;
   
    if (B_SellOnRule[session] !== -1 && !AndR(OP_SELL, T_STATUS, B_SellOnRule[session])) return false;
   
    if (B_PipStep[session] === 0)
        // forward is ignored ....
        return true;
    else {
        var level = B_PipStep[session] * SYS_POINT;
        var Min = 0;
        var Max = 0;
        if (B_DirectionType[session] === DT_MINMAX) {
            if (B_BuyNbrTrade[session] === 0 && B_SellNbrTrade[session] === 0) return true;
            // nothing in session
            Min = B_Min[session];
            Max = B_Max[session];
        } else {
            // DT_LEVEL
            if (B_BuyNbrTrade[session] === 0 && B_SellNbrTrade[session] === 0) return true;
            // nothing in session
            B_LevelPoint[session] = B_LastOrderOpenPrice[session];
            Min = B_LevelPoint[session];
            Max = B_LevelPoint[session];
            if (Min === -1) return false;
        }
        if (B_Direction[session] === D_BACKWARD && Bid >= Max + level) return true;
        if (B_Direction[session] === D_FORWARD && Bid <= Min - level) return true;
        if (B_Direction[session] === D_ANY && (Ask <= Min - level || Ask >= Max + level)) return true;
    }
    return false;
}


var B_ExitBuyRule = function(session) {
    if (B_ExitBuy[session] === true) return false;
    if (B_ExitSell[session] === true) {
        if (B_BuyNbrTrade[session] === 0 && B_Operation[session] === OP_SELL) return true;
    } else {
        if (B_Operation[session] === OP_BUYSELL && B_ExitMode[session] === OP_SELL && B_SellNbrTrade[session] !== 0) return false;
    }
    if (B_Operation[session] === OP_SELL) return false;
    if ((B_BuyMinProfit[session] === 0 || B_BuyProfit[session] > B_BuyMinProfit[session]) && 
        (B_ExitBuyOnRule[session] === -1 || AndR(OP_EXIT_BUY, T_STATUS, B_ExitBuyOnRule[session]))) return true;
    return false;
}


var B_ExitSellRule = function(session) {
    if (B_ExitSell[session] === true) return false;
    if (B_ExitBuy[session] === true) {
        if (B_SellNbrTrade[session] === 0 && B_Operation[session] === OP_BUY) return true;
    } else {
        if (B_Operation[session] === OP_BUYSELL && B_ExitMode[session] === OP_BUY && B_BuyNbrTrade[session] !== 0) return false;
    }
    if (B_Operation[session] === OP_BUY) return false;
    if ((B_SellMinProfit[session] === 0 || B_SellProfit[session] > B_SellMinProfit[session]) && 
        (B_ExitSellOnRule[session] === -1 || AndR(OP_EXIT_SELL, T_STATUS, B_ExitSellOnRule[session]))) return true;
    return false;
}


var B_CloseBuyRule = function(session) {
    if (B_CloseBuy[session] === true) return false;
    if (B_BuyNbrTrade[session] === 0) return false;
    if (B_Operation[session] === OP_SELL) return false;
    if (B_BuyStopLoss[session] !== 0 && B_BuyProfit[session] <= B_BuyStopLoss[session]) {
        B_BuyStopLoss[session] = 0;
        return true;
    }
    if (B_TBuyStopLoss[session] !== 0 && B_BuyProfit[session] <= B_TBuyStopLoss[session]) {
        B_TBuyStopLoss[session] = 0;
        return true;
    }
    if (B_BuyTakeProfit[session] !== 0 && B_BuyProfit[session] >= B_BuyTakeProfit[session]) return true;
    if (AndR(OP_CLOSE_BUY, T_STATUS, B_StartOnRule[session])) return true;
    return false;
}


var B_CloseSellRule = function(session) {
    if (B_CloseSell[session] === true) return false;
    if (B_SellNbrTrade[session] === 0) return false;
    if (B_Operation[session] === OP_BUY) return false;
    if (B_SellStopLoss[session] !== 0 && B_SellProfit[session] <= B_SellStopLoss[session]) {
        B_SellStopLoss[session] = 0;
        return true;
    }
    if (B_TSellStopLoss[session] !== 0 && B_SellProfit[session] <= B_TSellStopLoss[session]) {
        B_TSellStopLoss[session] = 0;
        return true;
    }
    if (B_SellTakeProfit[session] !== 0 && B_SellProfit[session] >= B_SellTakeProfit[session]) return true;
    if (AndR(OP_CLOSE_SELL, T_STATUS, B_StartOnRule[session])) return true;
    return false;
}

var B_CloseRule = function(session) {
    if (B_CloseSell[session] === true && B_CloseBuy[session] === true) return false;
    if (B_SellNbrTrade[session] === 0 && B_BuyNbrTrade[session] === 0) return false;
    if (AndR(OP_CLOSE, T_STATUS, B_StartOnRule[session])) return true;
    return false;
}

var B_HedgeBuyRule = function(session) {
    var Operation = B_Operation[session];
    if (Operation === OP_SELL) return false;
    if (B_Hedged[session] === true) {
        if (B_BuyNbrLots[session] - B_SellHedgeNbrLots[session] <= 0.00001) return false;
    }
    if (AndR(OP_HEDGE_BUY, T_STATUS, B_StartOnRule[session]) && B_BuyNbrTrade[session] > 0) return true;
    return false;
}


var B_HedgeSellRule = function(session) {
    var Operation = B_Operation[session];
    if (Operation === OP_BUY) return false;
    if (B_Hedged[session] === true) {
        if (B_SellNbrLots[session] - B_BuyHedgeNbrLots[session] <= 0.00001) return false;
    }
    if (AndR(OP_HEDGE_SELL, T_STATUS, B_StartOnRule[session]) && B_SellNbrTrade[session] > 0) return true;
    return false;
}


var B_CloseHedgeBuyRule = function(session) {
    if (B_Hedged[session] === false) return false;
    var Operation = B_Operation[session];
    if (Operation === OP_BUY || Operation === OP_BUYSELL) {
        if (AndR(OP_CLOSE_HEDGE_BUY, T_STATUS, B_StartOnRule[session]) && B_SellHedgeNbrLots[session] > 0.00001) return true;
    }
    return false;
}


var B_CloseHedgeSellRule = function(session) {
    if (B_Hedged[session] === false) return false;
    var Operation = B_Operation[session];
    if (Operation === OP_SELL || Operation === OP_BUYSELL) {
        if (AndR(OP_CLOSE_HEDGE_SELL, T_STATUS, B_StartOnRule[session]) && B_BuyHedgeNbrLots[session] > 0.00001) return true;
    }
    return false;
}


var B_CloseHedgeRule = function(session) {
    if (B_Hedged[session] === false) return false;
    if (AndR(OP_CLOSE_HEDGE, T_STATUS, B_StartOnRule[session])) return true;
    return false;
}


var B_ExitRule = function(session) {
    var profit = 0;
    if (B_StopLoss[session] !== 0 && B_SessionProfit[session] <= B_StopLoss[session]) {
        B_StopLoss[session] = 0;
        return true;
    }
    if (B_TStopLoss[session] !== 0 && B_SessionProfit[session] <= B_TStopLoss[session]) {
        B_TStopLoss[session] = 0;
        return true;
    }
    if (B_TakeProfit[session] !== 0 && B_SessionProfit[session] >= B_TakeProfit[session]) {
        return true;
    }
    if (B_MaxTime[session] !== 0 && (TimeCurrent() - B_StartDate[session]) > B_MaxTime[session] * 60 && B_SessionProfit[session] >= 0) {
        console.log(B_MaxTime[session]);
        return true;
    }
    if (B_MinProfit[session] === 0 || B_SessionProfit[session] > B_MinProfit[session]) {
        if (B_ExitOnRule[session] === -1 || AndR(OP_EXIT, T_STATUS, B_ExitOnRule[session])) {
            return true;
        }
    }
    return false;
}


var B_InitGraphics = function(session) {}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var TreatInRules = function() {
    for (var session = 0; session < B_MaxSessions; session++) {
        if (B_FreeSession[session] === true) continue;
        var Rule = B_StartOnRule[session];
        var Operation = B_Operation[session];
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




var TreatOutRules = function() {
    for (var i = 0; i < NBR_OPERATIONS; i++) {
        for (var j = 0; j < NBR_IOFIELDS; j++) {                    //OPTIMIZED
            for (var x = 0; x < NBR_RULES; x++) {
                var rule = RuleOrder[x];
                if (rule !== -1) TreatRule(i, j, rule, RValue(i, j, rule));
            }
        }
    }
}
var TreatRule = function(Operation, OperationType, rule, value) {
    var session = 0;
    var engine = -1;
    var Value = 0;
    if (Operation === OP_BUY || Operation === OP_SELL || Operation === OP_BUYSELL) {
        if (OperationType === T_RULE) {
            for (var i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule) {
                        engine = GetEngine(rule, B_Operation[i]);
                        if (engine === -1) continue;
                        if (Operation === OP_BUY && AndE(engine, B_BUYRULE))
                            if (AndR(Operation, OperationType, rule)) {
                                B_BuyOnRule[i] = value;
                            } else B_BuyOnRule[i] = EValue(engine, B_BUYRULE);
                        if (Operation === OP_SELL && AndE(engine, B_SELLRULE))
                            if (AndR(Operation, OperationType, rule)) {
                                B_SellOnRule[i] = value;
                            } else B_SellOnRule[i] = EValue(engine, B_SELLRULE);
                    }
            }
            return;
        }
        engine = GetEngine(rule, Operation);
        if (engine === -1) return;
        if (OperationType === T_START) {
            
//            ReturnNumberRuleStarted(rule, Operation);

            if (SeeIfRuleInSchedule(rule, Operation) === -1)
                return;

            if (AndR(Operation, OperationType, rule) && AndE(engine, B_STARTAUTOMATIC)) {
                if (B_StartNewSessionRule(TimeBetweenSession, rule, Operation)) {
                    for (var j = B_STARTRULE + 1; j < NBR_ATTRIBUTES; j++) {
                        Set_Engine(engine, j, P_SIGNAL);
                    }
                    // put everything to automatic from B_ILOT
                    session = B_StartNewSession();
                    InitSessionFromEngine(session, engine);
                }
            }
            return;
        } else if (OperationType === T_BUYLOT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation)
                        // && AndE(engine, B_BUYLOT))
                        if (AndR(Operation, OperationType, rule)) B_BuyLot[i] = value;
            }
            return;
        } else if (OperationType === T_SELLLOT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation)
                        // && AndE(engine, B_SELLLOT))
                        if (AndR(Operation, OperationType, rule)) B_SellLot[i] = value;
            }
            return;
        } else if (OperationType === T_KEEPBUYSELL) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_KEEPBUYSELL))
                        if (AndR(Operation, OperationType, rule)) B_KeepBuySell[i] = value;
                        else B_KeepBuySell[i] = EValue(engine, B_KEEPBUYSELL);
            }
            return;
        } else if (OperationType === T_ONEORDERPERBAR) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_ONEORDERPERBAR))
                        if (AndR(Operation, OperationType, rule)) B_OneOrderPerBar[i] = value;
                        else B_OneOrderPerBar[i] = EValue(engine, B_ONEORDERPERBAR);
            }
            return;
            
        } else if (OperationType === T_TIMESTEP) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_TIMESTEP))
                        if (AndR(Operation, OperationType, rule)) B_TimeStep[i] = value;
                        else B_TimeStep[i] = EValue(engine, B_TIMESTEP);
            }
            return;
        } else if (OperationType === T_PIPSTEP) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_PIPSTEP))
                        if (AndR(Operation, OperationType, rule)) B_PipStep[i] = value;
                        else B_PipStep[i] = EValue(engine, B_PIPSTEP);
            }
            return;
        } else if (OperationType === T_ORDERTYPE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_ORDERTYPE))
                        if (AndR(Operation, OperationType, rule)) B_OrderType[i] = value;
                        else B_OrderType[i] = EValue(engine, B_ORDERTYPE);
            }
            return;
        } else if (OperationType === T_DIRECTION) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_DIRECTION))
                        if (AndR(Operation, OperationType, rule)) B_Direction[i] = value;
                        else B_Direction[i] = EValue(engine, B_DIRECTION);
            }
            return;
        } else if (OperationType === T_DIRECTIONTYPE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_DIRECTIONTYPE))
                        if (AndR(Operation, OperationType, rule)) B_DirectionType[i] = value;
                        else B_DirectionType[i] = EValue(engine, B_DIRECTIONTYPE);
            }
            return;
        } else if (OperationType === T_LEVELPOINT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_LEVELPOINT))
                        if (AndR(Operation, OperationType, rule)) B_LevelPoint[i] = value;
                        else B_LevelPoint[i] = EValue(engine, B_LEVELPOINT);
            }
            return;
        } else if (OperationType === T_MAXCOUNT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_MAXCOUNT))
                        if (AndR(Operation, OperationType, rule)) B_MaxCount[i] = value;
                        else B_MaxCount[i] = EValue(engine, B_MAXCOUNT);
            }
            return;
        } else if (OperationType === T_HEDGEMAGNITUDE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_HEDGEMAGNITUDE))
                        if (!B_Hedged[i])
                            if (AndR(Operation, OperationType, rule)) B_HedgeMagnitude[i] = value;
                            else B_HedgeMagnitude[i] = EValue(engine, B_HEDGEMAGNITUDE);
            }
            return;
        } else if (OperationType === T_MAXTIME) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_MAXTIME))
                        if (AndR(Operation, OperationType, rule)) B_MaxTime[i] = value;
                        else B_MaxTime[i] = EValue(engine, B_MAXTIME);
            }
            return;
        } else if (OperationType === T_RECOVERYMODE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_RECOVERYMODE))
                        if (AndR(Operation, OperationType, rule)) B_RecoveryMode[i] = value;
                        else B_RecoveryMode[i] = EValue(engine, B_RECOVERYMODE);
            }
            return;
        } else if (OperationType === T_RECOVERYVALUE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_RECOVERYVALUE))
                        if (AndR(Operation, OperationType, rule)) B_RecoveryValue[i] = value;
                        else B_RecoveryValue[i] = EValue(engine, B_RECOVERYVALUE);
            }
            return;
        } else if (OperationType === T_ILOT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_ILOT))
                        if (AndR(Operation, OperationType, rule)) B_ILot[i] = value;
                         else B_ILot[i] = (EValue(engine, B_ILOT) == 0) ? NormalizeDouble(AccountEquity()/10000,2)  : EValue(engine, B_ILOT);
            }
            return;
        } else if (OperationType === T_MAXLOT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_MAXLOT))
                        if (AndR(Operation, OperationType, rule)) B_MaxLot[i] = value;
                        else B_MaxLot[i] = (EValue(engine, B_MAXLOT) == 0) ? SYS_MAXLOT : EValue(engine, B_MAXLOT);
            }
            return;
        } else // only in exit automatic
            if (OperationType === T_BUYLOTTP) {
                for (i = 0; i < B_MaxSessions; i++) {
                    if (B_FreeSession[i] === false)
                        if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_BUYLOTTP)) {
                            if (AndE(engine, B_EXITAUTOMATIC)) {
                                if (AndR(Operation, OperationType, rule)) Value = value;
                                else Value = EValue(engine, B_BUYLOTTP);
                                if (B_BuyLotTP[i] !== Value) {
                                    if (Value === 0) CancelSLTP(B_MagicNumber[i], 0, 1, 0, 0);
                                    else SetSLTP(B_MagicNumber[i], 0, Value, 0, 0);
                                    B_BuyLotTP[i] = Value;
                                }
                            } else {
                                if (B_BuyLotTP[i] !== 0) CancelSLTP(B_MagicNumber[i], 0, 1, 0, 0);
                                B_BuyLotTP[i] = 0;
                            }
                        }
                }
                return;
            } else if (OperationType === T_BUYLOTSL) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_BUYLOTSL)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule)) Value = value;
                            else Value = EValue(engine, B_BUYLOTSL);
                            if (B_BuyLotSL[i] !== Value) {
                                if (Value === 0) CancelSLTP(B_MagicNumber[i], 1, 0, 0, 0);
                                else SetSLTP(B_MagicNumber[i], Value, 0, 0, 0);
                                B_BuyLotSL[i] = Value;
                            }
                        } else {
                            if (B_BuyLotSL[i] !== 0) CancelSLTP(B_MagicNumber[i], 1, 0, 0, 0);
                            B_BuyLotSL[i] = 0;
                        }
                    }
            }
            return;
        } else if (OperationType === T_BUYLOTTS) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_BUYLOTTS)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule)) Value = value;
                            else Value = EValue(engine, B_BUYLOTTS);
                            B_BuyLotTS[i] = Value;
                        } else B_BuyLotTS[i] = 0;
                    }
            }
            return;
        } else // only in exit automatic
            if (OperationType === T_SELLLOTTP) {
                for (i = 0; i < B_MaxSessions; i++) {
                    if (B_FreeSession[i] === false)
                        if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SELLLOTTP)) {
                            if (AndE(engine, B_EXITAUTOMATIC)) {
                                if (AndR(Operation, OperationType, rule)) Value = value;
                                else Value = EValue(engine, B_SELLLOTTP);
                                if (B_SellLotTP[i] !== Value) {
                                    if (Value === 0) CancelSLTP(B_MagicNumber[i], 0, 0, 0, 1);
                                    else SetSLTP(B_MagicNumber[i], 0, 0, 0, Value);
                                    B_SellLotTP[i] = Value;
                                }
                            } else {
                                if (B_SellLotTP[i] !== 0) CancelSLTP(B_MagicNumber[i], 0, 0, 0, 1);
                                B_SellLotTP[i] = 0;
                            }
                        }
                }
                return;
            } else if (OperationType === T_SELLLOTSL) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SELLLOTSL)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule)) Value = value;
                            else Value = EValue(engine, B_SELLLOTSL);
                            if (B_SellLotSL[i] !== Value) {
                                if (Value === 0) CancelSLTP(B_MagicNumber[i], 0, 0, 1, 0);
                                else SetSLTP(B_MagicNumber[i], 0, 0, Value, 0);
                                B_SellLotSL[i] = Value;
                            }
                        } else {
                            if (B_SellLotSL[i] !== 0) CancelSLTP(B_MagicNumber[i], 0, 0, 1, 0);
                            B_SellLotSL[i] = 0;
                        }
                    }
            }
            return;
        } else if (OperationType === T_SELLLOTTS) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SELLLOTTS)) {
                        if (AndE(engine, B_EXITAUTOMATIC)) {
                            if (AndR(Operation, OperationType, rule)) Value = value;
                            else Value = EValue(engine, B_SELLLOTTS);
                            B_SellLotTS[i] = Value;
                        } else B_SellLotTS[i] = 0;
                    }
            }
            return;
        } else if (OperationType === T_TP) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_TP))
                        if (AndR(Operation, OperationType, rule)) B_TakeProfit[i] = value;
                        else B_TakeProfit[i] = EValue(engine, B_TP);
            }
            return;
        } else if (OperationType === T_TS) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_TS))
                        if (AndR(Operation, OperationType, rule)) B_TrailingStop[i] = value;
                        else B_TrailingStop[i] = EValue(engine, B_TS);
            }
            return;
        } else if (OperationType === T_SL) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SL))
                        if (AndR(Operation, OperationType, rule)) B_StopLoss[i] = value;
                        else {
                            if (B_HedgeNbrLots[i] + B_BuyNbrTrade[i] + B_SellNbrTrade[i] === 0) B_StopLoss[i] = EValue(engine, B_SL);
                        }
            }
            return;
        } else if (OperationType === T_BUYTP) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_BUYTP))
                        if (AndR(Operation, OperationType, rule)) B_BuyTakeProfit[i] = value;
                        else B_BuyTakeProfit[i] = EValue(engine, B_BUYTP);
            }
            return;
        } else if (OperationType === T_BUYTS) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_BUYTS))
                        if (AndR(Operation, OperationType, rule)) B_BuyTrailingStop[i] = value;
                        else B_BuyTrailingStop[i] = EValue(engine, B_BUYTS);
            }
            return;
        } else if (OperationType === T_BUYSL) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_BUYSL))
                        if (AndR(Operation, OperationType, rule)) B_BuyStopLoss[i] = value;
                        else if (B_BuyNbrTrade[i] === 0) B_BuyStopLoss[i] = EValue(engine, B_BUYSL);
            }
            return;
        } else if (OperationType === T_SELLTP) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SELLTP))
                        if (AndR(Operation, OperationType, rule)) B_SellTakeProfit[i] = value;
                        else B_SellTakeProfit[i] = EValue(engine, B_SELLTP);
            }
            return;
        } else if (OperationType === T_SELLTS) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SELLTS))
                        if (AndR(Operation, OperationType, rule)) B_SellTrailingStop[i] = value;
                        else B_SellTrailingStop[i] = EValue(engine, B_SELLTS);
            }
            return;
        } else if (OperationType === T_SELLSL) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_SELLSL))
                        if (AndR(Operation, OperationType, rule) && !AndR(Operation, T_SELLSL, rule)) B_SellStopLoss[i] = value;
                        else if (B_SellNbrTrade[i] === 0) B_SellStopLoss[i] = EValue(engine, B_SELLSL);
            }
            return;
        } else if (OperationType === T_SUSPEND) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation)
                        if (AndR(Operation, OperationType, rule)) B_Suspend[i] = true;
                        else B_Suspend[i] = false;
            }
            return;
        } else if (OperationType === T_EXITMODE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule && B_Operation[i] === Operation && AndE(engine, B_EXITMODE))
                        if (AndR(Operation, OperationType, rule)) B_ExitMode[i] = value;
                        else B_ExitMode[i] = EValue(engine, B_EXITMODE);
            }
            return;
        } else return;
    } else if (Operation === OP_EXIT_BUY || Operation === OP_EXIT_SELL || Operation === OP_EXIT) {
        if (OperationType === T_MINPROFIT) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule) {
                        engine = GetEngine(rule, B_Operation[i]);
                        if (engine === -1) continue;
                        if (Operation === OP_EXIT && AndE(engine, B_MINPROFIT))
                            if (AndR(Operation, OperationType, rule)) B_MinProfit[i] = value;
                            else B_MinProfit[i] = EValue(engine, B_MINPROFIT);
                        if (Operation === OP_EXIT_SELL && AndE(engine, B_SELLMINPROFIT))
                            if (AndR(Operation, OperationType, rule)) B_SellMinProfit[i] = value;
                            else B_SellMinProfit[i] = EValue(engine, B_SELLMINPROFIT);
                        if (Operation === OP_EXIT_BUY && AndE(engine, B_BUYMINPROFIT))
                            if (AndR(Operation, OperationType, rule)) B_BuyMinProfit[i] = value;
                            else B_BuyMinProfit[i] = EValue(engine, B_BUYMINPROFIT);
                    }
            }
            return;
        } else if (OperationType === T_RULE) {
            for (i = 0; i < B_MaxSessions; i++) {
                if (B_FreeSession[i] === false)
                    if (B_StartOnRule[i] === rule) {
                        engine = GetEngine(rule, B_Operation[i]);
                        if (engine === -1) continue;
                        if (Operation === OP_EXIT_BUY && AndE(engine, B_EXITBUYRULE))
                            if (AndR(Operation, OperationType, rule)) B_ExitBuyOnRule[i] = value;
                            else B_ExitBuyOnRule[i] = EValue(engine, B_EXITBUYRULE);
                        if (Operation === OP_EXIT_SELL && AndE(engine, B_EXITSELLRULE))
                            if (AndR(Operation, OperationType, rule)) B_ExitSellOnRule[i] = value;
                            else B_ExitSellOnRule[i] = EValue(engine, B_EXITSELLRULE);
                        if (Operation === OP_EXIT && AndE(engine, B_EXITRULE))
                            if (AndR(Operation, OperationType, rule)) B_ExitOnRule[i] = value;
                            else B_ExitOnRule[i] = EValue(engine, B_EXITRULE);
                    }
            }
            return;
        }
    } else if (Operation === OP_HEDGE_BUY || Operation === OP_HEDGE_SELL) {
        if (OperationType === T_STATUS) {}
    }
}

var LoadAllFiles = function() {
    LoadEngines(); // LoadEngines
}

var LoadEngines = function() {
    for (var i = 0; i < solution.CurrentProject.PG.Engines.length; i++) {
        var engine = solution.CurrentProject.PG.Engines[i];
        LoadEngine(engine);
        LoadSchedule(engine);
    }
    return (E_NbrEngine);
}


//---------------------------------------------------- MARKET MOVEMENT --------------------------------------------------  

//entity can be engine if a tester or marker if a marker

var MarketMovement = function(context, entity, x, data, currentitemidx, shift) {
    
    var objects    =  entity.Indicators.map(x => entity.PG.GetObjectFromId(x));    

    for (var i = 0; i < objects.length; i++) {
        let object = objects[i];
      
        if (!object) continue;
       
             
        var IndicatorLayout = object.Indicator;
        if (IndicatorLayout.calculator) IndicatorLayout.calculator(data);
        
        let signalscallbackname = context.GetSignalCallbackFromObject(object);
        if (signalscallbackname != null) {

            eval('context.' + signalscallbackname + '(x, object, data, currentitemidx, shift)');
        }
    }

    for (var i = 0; i < entity.Indicators.length; i++) {
        var objectid = entity.Indicators[i];
        var object = entity.PG.GetObjectFromId (objectid);      
        if (!object.Cross || object.Cross == "")
            continue;

        var CObject = entity.PG.GetObjectFromName (object.Cross); 
        
        if (!CObject)
            continue;

        var cObjjectid = CObject.Id;

        if (shift === 0) {
            if (context.SValue(objectid, S_PREVIOUS, x) < context.SValue(cObjjectid, S_PREVIOUS, x) && 
                context.SValue(objectid, S_CURRENT, x) > context.SValue(cObjjectid, S_CURRENT, x)) {
                context.SETSIGNAL(shift,objectid, S_RCROSSED, x, P_SIGNAL, 1);
            } else 
            if (context.SValue(objectid, S_PREVIOUS, x) > context.SValue(cObjjectid, S_PREVIOUS, x) && 
                context.SValue(objectid, S_CURRENT, x) < context.SValue(cObjjectid, S_CURRENT, x)) {
                context.SETSIGNAL(shift, objectid, S_RCROSSED, x, P_SIGNAL, 0);
            }

        } else {
            if (context.SPValue(objectid, S_PREVIOUS, x) < context.SPValue(cObjjectid, S_PREVIOUS, x) && 
                context.SPValue(objectid, S_CURRENT, x) > context.SPValue(cObjjectid, S_CURRENT, x)) {
                context.SETSIGNAL(shift, objectid, S_RCROSSED, x, P_SIGNAL, 1);
            } else 
            if (context.SPValue(objectid, S_PREVIOUS, x) > context.SPValue(cObjjectid, S_PREVIOUS, x) && 
                context.SPValue(objectid, S_CURRENT, x) < context.SPValue(cObjjectid, S_CURRENT, x)) {
                context.SETSIGNAL(shift, objectid, S_RCROSSED, x, P_SIGNAL, 0);
            }
        }
    }
    context.SetPreviousSignals(entity.Indicators, entity.Signals);          

}

//---------------------------------------------------- SYSTEM RULES --------------------------------------------------  

var MT4_SetSystemObjects = function(_Ask, _Bid, _TimeCurrent, _CurrentPeriod, _Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, _BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue) {
    for (var i = (NBR_PERIODS - 1); i >= P_M1; i--) // we need bigger period for bob rules
        SetSystemObjects(i, _Ask, _Bid, _TimeCurrent, _CurrentPeriod, Symbol, _Point, _Digits, _SignalTab, _SignalTabValue, _SignalTabTime, _SignalTabPrice, _BeforeSignalTab, _BeforeSignalTabValue, _BeforeSignalTabTime, _BeforeSignalTabPrice, _BeforeSignalTickTab, _RuleTab, _RuleTabValue, _BeforeRuleTab, _BeforeRuleTabValue);
}

//---------------------------------------------------- FRACTALS --------------------------------------------------  
var Equal = function(value, Pos, Range) {
    return value <= (Pos + Range *  SYS_POINT) && NormalizeDouble(value + SYS_SPREAD, SYS_DIGITS) >= (Pos - Range *  SYS_POINT);
}
var Upper = function(value, Pos, Range) {
    return value > Pos + Range * SYS_POINT;
}
var Lower = function(value, Pos, Range) {
    return value < Pos - Range *  SYS_POINT;
}

var FindNextFractal = function (mode, data, currentitemidx) {
    var i = currentitemidx - 1;
    
    var next_fractal = undefined;
    var next_fractal_date = undefined;
    
    
    if (mode == MODE_LOWER) {
        var actual_fractal = data[currentitemidx].DOWNFRACTAL;
        while (data[i] && i >= 0 && (data[i].DOWNFRACTAL >=  actual_fractal)) {
            i--;
        
        }
        if (i >= 0) { 
            var foundfractal = data[i].DOWNFRACTAL;
            while (data[i] && i >= 0 && (data[i].DOWNFRACTAL ==  foundfractal)) {
                i--;
            }
            if (i >= 0) {    
                next_fractal = foundfractal;
                next_fractal_date = i+1;
            }
        }
    }
    else {
        var actual_fractal = data[currentitemidx].UPFRACTAL;
        while (data[i] && i >= 0 && (data[i].UPFRACTAL  <=  actual_fractal)) {
            i--;
        }
        if (i >= 0) { 
            var foundfractal = data[i].UPFRACTAL;
            while (data[i] && i >= 0 && (data[i].UPFRACTAL ==  foundfractal)) {
                i--;
            }
            if (i >= 0) {
                next_fractal = foundfractal;
                next_fractal_date = i+1;
            }
        }
    }
    return ([next_fractal, next_fractal_date]);
}




//===================================================ORDERS MT4 STYLE=======================================================================================
var Orders = [];
var OrdersHistory = [];
var SOrders;

const   SELECT_BY_POS           = 0;
const   SELECT_BY_TICKET        = 1;

var CurrentOrderPos = 0;
var TICKETID = 0;



function findOrders(Orders, session, orders) {
    for (var i = 0; i < Orders.length; i++) {
        if (Orders[i].MagicNumber == B_MagicNumber[session]) orders.push(Orders[i]);
    }
}

function findMinMaxDatePrice(data) {
    let min = data[0],
        max = data[0],
        minp = data[0],
        maxp = data[0];
    for (let i = 1, len = data.length; i < len; i++) {
        let v = data[i];
        min = (v.OpenTime < min.OpenTime) ? v : min;
        max = (v.OpenTime > max.OpenTime) ? v : max;
        minp = (v.OpenPrice < minp.OpenPrice) ? v : minp;
        maxp = (v.OpenPrice > maxp.OpenPrice) ? v : maxp;
    }
    return [min, max, minp, maxp];
}

function Order(symbol, mode, lots, comment, price, magicnumber, stoploss, takeprofit) {
    this.Type = mode;
    this.Lots = lots;
    this.Symbol = symbol;
    this.OpenPrice = price;
    this.OpenTime = TimeCurrent(); //add one millisecond for trade same bar
    this.CloseTime = null;
    this.ClosePrice = null;
    this.StopLoss = NormalizeDouble(stoploss, SYS_DIGITS);
    this.TakeProfit = NormalizeDouble(takeprofit, SYS_DIGITS);
    this.MagicNumber = magicnumber;
    this.Profit = 0;
    this.Comment = comment;
    this.Ticket = ++TICKETID;
    this.expiration = 0;
    this.openidx = [];
    this.closeidx = [];
    this.removed = 0;

    for (const i of CurrentEngine.Periods) {
        this.openidx.push(CurrentEngine.Data[i].length - 1);
    }
}

var OrderClose = function(ticket, lots, price, slippage) {
    var index = OrderReturn(ticket);
    if (index != -1) {
        var profit;
        
        for (const i of CurrentEngine.Periods) {
            Orders[index].closeidx.push(CurrentEngine.Data[i].length - 1);
        }

        if (order.Type == OP_BUY) {
            profit = (price - order.OpenPrice) * order.Lots * 100000;
        }    
        else {
            profit = (order.OpenPrice - price) * order.Lots * 100000;
        }

        Orders[index].CloseTime = TimeCurrent();
        Orders[index].ClosePrice = price;
        Orders[index].removed = 1;
        OrdersHistory.push(Orders[index]);
       // Orders.splice(index, 1);
        PG_Print(TYPE_INFO, ticket + " Close ["  + order.Lots.toFixed(2)  + ", "  + price + "]  Profit : " + profit.toFixed(2));
        return true;

    } else {
        PG_Print(TYPE_INFO, "order  closed : " + "Error");
        return false;
    }
}

var OrderReturn = function(ticket) {
    for (var i = 0; i < Orders.length; i++) {
        if (Orders[i].Ticket == ticket) return i;
    }
    return -1;
}

var OrderDelete = function(ticket) {
    var index = OrderReturn(ticket);
    if (index != -1) {
        Orders[index].removed = 2;
    }
    return false;
}

var OrderSend = function(symbol, operation, lots, price, slippage, stoploss, takeprofit, comment, magicnumber, expiration) {
    switch (arguments.length) {
        case 6:
            comment = null;
        case 7:
            magicnumber = -1;
        case 8:
            expiration = 0;
    }
    order = new Order(symbol, operation, lots, comment, price, magicnumber, stoploss, takeprofit);
    Orders.push(order);
    return order.Ticket;
}

var OrderModify = function(ticket, price, stoploss, takeprofit, expiration, color) {
    var index = OrderReturn(ticket);
    if (index != -1) {
        Orders[index].TakeProfit = takeprofit;
        Orders[index].StopLoss = stoploss;
        Orders[index].Expiration = expiration;
        return true;
    }
    return false;
}

var OrdersTotal = function() {
    for (var i = Orders.length;  i--;) {
        if (Orders[i].removed)
            Orders.splice(i, 1);
    }       
    CurrentOrderPos = 0;
    return Orders.length;
}

var OrdersHistoryTotal = function() {
    CurrentOrderPos = 0;
    return OrdersHistory.length;
}

var OrderSelect = function(cnt, select_type, select_mode) {
 
    
    if (select_type == SELECT_BY_TICKET) {
        SOrders = Orders;
        var index = OrderReturn(cnt);
        if (index != -1) {
            CurrentOrderPos = index;
            return true;
        } else return false;
    }
    if (select_mode == MODE_TRADES) {
        CurrentOrderPos = cnt;
        SOrders = Orders;
        return true;
    } else
    if (select_mode == MODE_HISTORY) {
        CurrentOrderPos = cnt;
        SOrders = OrdersHistory;
        return true;
    }
}

var OrderTicket = function() {
    return SOrders[CurrentOrderPos].Ticket;
}

var OrderType = function() {
    return SOrders[CurrentOrderPos].Type;
}

var OrderLots = function() {
    return SOrders[CurrentOrderPos].Lots;
}

var OrderOpenPrice = function() {
    return SOrders[CurrentOrderPos].OpenPrice;
}

var OrderClosePrice = function() {
    return SOrders[CurrentOrderPos].ClosePrice;
}

var OrderComment = function() {
    return SOrders[CurrentOrderPos].Comment;
}

var OrderOpenTime = function() {
    return SOrders[CurrentOrderPos].OpenTime;
}

var OrderCloseTime = function() {
    return SOrders[CurrentOrderPos].CloseTime;
}

var OrderProfit = function() {
    var order = SOrders[CurrentOrderPos];
    var closeprice 
    if (order.Type == OP_BUY) {
        closeprice = (order.ClosePrice ? order.ClosePrice : Bid);
        return (closeprice - order.OpenPrice) * order.Lots * 100000;
    }
    else {
        closeprice = (order.ClosePrice ? order.ClosePrice : Ask);        
        return (order.OpenPrice - closeprice) * order.Lots * 100000;
    }
}

var OrderSymbol = function() {
    return SOrders[CurrentOrderPos].Symbol.Name;
}

var OrderMagicNumber = function() {
    return SOrders[CurrentOrderPos].MagicNumber;
}

var OrderTakeProfit = function() {
    return SOrders[CurrentOrderPos].TakeProfit;
}

var OrderStopLoss = function() {
    return SOrders[CurrentOrderPos].StopLoss;
}

//===================================================TRACE MT4 STYLE=======================================================================================

var GlobalComment               = true;
var ExpandComment               = true;

function TraceExpertEditor(value, add, up) {
    var sadd = (up ? value + (add == 1 ? "\r\n" + ExpertEditor.getValue() : "") : (add == 1 ? ExpertEditor.getValue()  + "\r\n"  : "") + value);
    ExpertEditor.setValue(sadd, -1);
    if (!up && ExpertEditor.aceEditor)
        ExpertEditor.aceEditor.renderer.scrollToLine(Number.POSITIVE_INFINITY)
}

var PG_Print = function(Type, s, concat) {
    let engine = CurrentEngine;

    switch (arguments.length) {
        case 2:
            nowarning = -1;
    }
    var sdate =  d3.timeFormat("%Y.%m.%d %H:%M:%S")(engine.Data[engine.CurrentPeriod][engine.Data[engine.CurrentPeriod].length - 1].date.getTime() );
    var fs =  sdate + " " + s;
    if (ShellTrace === true) TraceExpertEditor(fs, 1, false);
}

function TraceCommentEditor(value, add) {
    CommentEditor.setValue(value + (add == 1 ? "\r\n" + CommentEditor.getValue() : ""), -1);
}

var PG_Comment = function() {
    
    var symbolcanvas = solution.GetCanvasFromTerminal(solution.CurrentProject);
    if (!symbolcanvas) return;      
    let PG = symbolcanvas.PG;

    var legend = "";


    
    var startdate = new Date(StartDate * 1000);
    legend +=  "Start Tester Date = " + startdate.toString() + "\n";

    var nowdate = new Date(TimeCurrent() * 1000);
    legend +=  "Current Date = " + nowdate.toString() + "\n";
    
    legend +=  ReturnElapsedTime(TimeCurrent() * 1000 - StartDate * 1000) + "\n";
   
    var profit = 0;
//    for (var j = 0; j < NBR_RULES; j++) {  // OPTIMIZED
    
        var j = RuleOrder[0];
        
        profit       = ReturnClosedProfit(-1, j);
        var bengine  = GetEngine(j, OP_BUY);
        var sengine  = GetEngine(j, OP_BUY);
        var bsengine = GetEngine(j, OP_BUYSELL);
    
        if (bengine === -1 && sengine === -1 && bsengine === -1) 
            return;
        
        let enginename = "";

        if (bengine !== -1)         enginename = PG.Engines[bengine].Name;
        else 
        if (sengine !== -1)         enginename = PG.Engines[sengine].Name;
        else 
        enginename = PG.Engines[bsengine].Name;

        legend = legend + enginename + " =   " + profit.toFixed(2);
        if (bengine !== -1) legend = legend + " Buy  (" + S_NbrRuleStart[j][OP_BUY].toString() + "," + S_NbrRuleStartD[j][OP_BUY].toString() + ")";
        if (sengine !== -1) legend = legend + " Sell  (" + S_NbrRuleStart[j][OP_SELL].toString() + "," + S_NbrRuleStartD[j][OP_SELL].toString() + ")";
        if (bsengine !== -1) legend = legend + " BuySell  (" + S_NbrRuleStart[j][OP_BUYSELL].toString() + "," + S_NbrRuleStartD[j][OP_BUYSELL].toString() + ")";
        legend += "\n";
//    }
  
  
    legend += "\n";    
    let engine;

    if (ExpandComment) {
        legend += "----------------------------------------------" + "\n";
/*        
        legend += "Account Name: "          + AccountName   + "\n";
        legend += "Account Number: "        + AccountNumber + "\n"; 
        legend += "Account Initial Balance: "+ AccountInitialBalance + "\n"; 
        legend += "Account Profit: "        + AccountProfit + "\n"; 
        legend += "Account Total Profit: "  + AccountTotalProfit.toFixed(2) + "\n"; 
        legend += "Account Balance: "       + AccountBalance + "\n";
        legend += "Account Min Free Margin: "+ AccountMinFreeMargin + "\n"; 
        legend += "Account Free Margin: "   + AccountFreeMargin() + "\n"; 
        legend += "NbrLots: "               + AccountNbrLots.toFixed(2) + "\n"; 
    
        legend += "Total Point (min, max) = (" + B_MinPoint.toFixed(symbolcanvas.CurrentSymbol.Digits) + ", " + B_MaxPoint.toFixed(symbolcanvas.CurrentSymbol.Digits) + ")\n";
  
        legend = legend + "\n\n";   
 */       
        for (var i = 0; i < B_MaxSessions; i++) {
            if (B_FreeSession[i] === true) continue;
            engine = GetEngine(B_StartOnRule[i], B_Operation[i]);

            legend += "Strategy Name: " + (engine === -1 ? "Manual": PG.Engines[engine].Name) + "\n";
            legend += "Rule: "                  + RuleName[B_StartOnRule[i]] + "\n";
            legend += "Operation:"              + OperationName[B_Operation[i]] + "\n";
    
            legend += "Direction: "             + DirectionName[B_Direction[i]] + "\n";
            legend += "Direction Type: "        + DirectionTypeName[B_DirectionType[i]] + "\n";
            legend += "Order Type: "            + OrderTypeName[B_OrderType[i]] + "\n";
            legend += "Recovery Mode: "         + RecoveryModeName[B_RecoveryMode[i]] + "\n";
            legend += "Recovery Value: "        + B_RecoveryValue[i] + "\n";
            legend += "Initial Lot: "           + B_ILot[i].toFixed(2) + "\n";
            legend += "Maximum Lot: "           + B_MaxLot[i].toFixed(2) + "\n";
            legend += "Max Count: "             + B_MaxCount[i] + "\n";
            legend += "Pip Step: "              + B_PipStep[i] + "\n";
            legend += "Time Step: "             + B_TimeStep[i] + "\n";
    
            legend += "TP: "                    + B_TakeProfit[i].toFixed(2) + "\n";
            legend += "TS: "                    + B_TrailingStop[i].toFixed(2) + "\n";
            legend += "SL: "                    + B_StopLoss[i].toFixed(2) + "\n";
            legend += "B TP: "                  + B_BuyTakeProfit[i].toFixed(2) + "\n";
            legend += "B TS: "                  + B_BuyTrailingStop[i].toFixed(2) + "\n";
            legend += "B SL: "                  + B_BuyStopLoss[i].toFixed(2) + "\n";
            legend += "S TP: "                  + B_SellTakeProfit[i].toFixed(2) + "\n";
            legend += "S TS: "                  + B_SellTrailingStop[i].toFixed(2) + "\n";
            legend += "S SL: "                  + B_SellStopLoss[i].toFixed(2) + "\n";
            legend += "B LotTP: "               + B_BuyLotTP[i].toFixed(2) + "\n";
            legend += "B LotTS: "               + B_BuyLotTS[i].toFixed(2) + "\n";
            legend += "B LotSL: "               + B_BuyLotSL[i].toFixed(2) + "\n";
            legend += "S LotTP: "               + B_SellLotTP[i].toFixed(2) + "\n";
            legend += "S LotTS: "               + B_SellLotTS[i].toFixed(2) + "\n";
            legend += "S LotSL: "               + B_SellLotSL[i].toFixed(2) + "\n";
    
        }    
    }    
    for (var i = 0; i < B_MaxSessions; i++) {
        if (B_FreeSession[i] === true) continue;
        engine = GetEngine(B_StartOnRule[i], B_Operation[i]);


        var startdate = new Date(B_StartDate[i] * 1000);
         
      //  legend += "Strategy Name: " + (engine === -1 ? "Manual": EngineName[engine]) + "\n";

        legend += "Last Buy Lot: "            + B_LastBuyLot[i].toString() + "\n";
        legend += "Last Sell Lot: "           + B_LastSellLot[i].toString() + "\n";
        legend += "Exit Buy: "              + (B_ExitBuy[i] ? "YES": "NO") + "\n";
        legend += "Exit Sell: "             + (B_ExitSell[i] ? "YES": "NO") + "\n";

        legend += "\n";
        legend += "Point (min, max) = (" + B_Min[i].toFixed(symbolcanvas.CurrentSymbol.Digits) + ", " + B_Max[i].toFixed(symbolcanvas.CurrentSymbol.Digits) + ")" + "\n";
        legend += "\n";

        legend += "START Date: " + startdate.toString() + "\n"; 
        legend += "BUY   Profit/Loss = (" + B_BuyProfit[i].toFixed(2)   + ", Nbr: " +  + B_BuyNbrTrade[i] + ", Lots: " + B_BuyNbrLots[i].toFixed(2)  + ")"   + "\n";
        legend += "SELL  Profit/Loss = (" + B_SellProfit[i].toFixed(2)  + ", Nbr: " +  + B_SellNbrTrade[i] + ", Lots: " + B_SellNbrLots[i].toFixed(2) + ")"  + "\n";
        if (!B_Hedged[i] && B_HasBeenHedged[i]) legend += "Hedged Performed on Strategy" + "\n";       
        legend += "Total Profit/Loss = " + B_SessionProfit[i].toFixed(2) + "\n"; 
        legend += "\n";
        
        if (B_Suspend[i]) legend = legend + "Suspended ";
        if (!B_BuySellAutomatic[i]) legend = legend + "Manual Buy/Sell ";
        if (B_KeepBuySell[i]) legend = legend + "KeepBuySell ";
        if (B_Hedged[i]) {
            legend += "HEDGE_SELL Profit/Loss = (" + B_BuyHedgeProfit[i].toFixed(2)  + ", Lots: " + B_BuyHedgeNbrLots[i].toFixed(2)  +  ")" + "\n";
            legend += "HEDGE_BUY  Profit/Loss = (" + B_SellHedgeProfit[i].toFixed(2) + ", Lots: " + B_SellHedgeNbrLots[i].toFixed(2) +  ")" + "\n";
        }

        if (B_Suspend[i] || !B_BuySellAutomatic[i] || B_KeepBuySell[i] || B_Hedged[i]) legend = legend + "\n";
    }
    legend = legend + "\n";
    TraceCommentEditor(legend);
}

