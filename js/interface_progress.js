var FieldsItems = [];   // will be loaded  

//---------------------------------------------------------

const OperationMenu     = [
    { id: 2,   text:  'BUYSELL'},
    { id: 0,   text:  'BUY'}, 
    { id: 1,   text:  'SELL'} 
];

//---------------------------------------------------------

const DirectionDescription  = ["Price of Buy order should be less than the price of the previous Buy order. For Sell orders the price should be higher",
                               "Price of Buy order should be higher than the price of the previous Buy order. For Sell orders the price should be less",
                               "Orders can be placed anywhere"
];

const DirectionMenu     = [
    { id: 2, text: 'ANY',     tooltip: "Orders can be placed anywhere"},
    { id: 0, text: 'BACKWARD',tooltip: "Price of Buy order should be less than the price of the previous Buy order. For Sell orders the price should be higher"},
    { id: 1, text: 'FORWARD', tooltip: "Price of Buy order should be higher than the price of the previous Buy order. For Sell orders the price should be less"}
];

//---------------------------------------------------------

const DirectionTypeDescription  = ["Order is placed outside the mimimum and the maximum of the existing orders in the session",
                                   "Order is placed relatively to the previous order"];    

const DirectionTypeMenu = [
    { id: 1, text: 'LEVEL',   tooltip: "Order is placed relatively to the previous order"},                             
    { id: 0, text: 'MINMAX',  tooltip: "Order is placed outside the mimimum or maximum of the existing orders in the session"}
];

//---------------------------------------------------------

const RecoveryDescription= ["Lot size is the Fibonacci of the number of trades multiply Initial Lot. If Initial Lot is 0.1 than we have (0.1 0.1 0.2 0.3 0.5 0.8 ...) until MaxCount", 
                            "Lot size is doubled when the number of trades reached the value precised in Recovery Value. If Recovery Value is 3 and Initial Lot is 0.3 than we have (0.3 0.3 0.3 0.6 0.6 ...) until MaxCount", 
                            "1.1.2.4 Sequence", 
                            "1.1.3.3 Sequence", 
                            "Lot size is incremented with value indicated in Recovery Value if Recovery Value is 0.2 and Initial Lot is 0.1 we have (0.1 0.3 0.5 0.7 0.9 ....) until MaxCount", 
                            "Martingale with multiplier that is indicated in Recovery Value",  
                            "1.2.6 Sequence", 
                            "Martingale with multiplier after exit one side", 
                            "All lots have the same size which is Initial Lot size", 
                            "1.2.6.24 Sequence", 
                            "If in the sequence we have a loosing trade, the next trade size is Initial Lot until we have a gaining trade.Once we have a gaining trade the next trade size is the increment of the biggest lot in the session with Initial Lot. Until we have a loosing trade the lot size is Initial     Lot", 
                            "If Last lot is closed with lost we multiply next opposite lot by multiplier precised in Recovery Value, otherWise Next lot is Initial Lot ", 
                            "Alembex : If lost same lot else last cumulative lost", 
                            "Order Size Based on Leverage of Loss", 
                            "Leverage : An opposite Size Based on Leverage of Loss"
];                        

const RecoveryModeMenu = [
    { id : 10,   type: "C",   text: "C-Standard",                    tooltip :  "All lots have the same size which is Initial Lot size"},
    { id : 2,    type: "I",   text: "I-Increment",                   tooltip :  "Lot size is incremented with value indicated in Recovery Value if Recovery Value is 0.2 and Initial Lot is 0.1 we have (0.1 0.3 0.5 0.7 0.9 ....) until MaxCount"},
    { id : 11,   type: "P",   text: "P-Increment Max",               tooltip :  "If the last trade is closed with a lost, the following trade size will be Initial Lot. If the last trade is is closed with a gain, the next trade size will be the sum of the biggest lot size in the stragey with Initial Lot. Until we have a loosing trade the lot size will always be Initial Lot"}, 
    { id : 3,    type: "Q" ,  text: "Q-Average Opposite",            tooltip :   "If the last trade is closed with a lost, the following opposite trade size will be the size of the closed trade multiplied by the number precised in Recovery Value, otherWise Next trade size will be Initial Lot "},
    { id : 8,    type: "M" ,  text: "M-Martingale Classic",          tooltip :  "Martingale with multiplier that is indicated in Recovery Value"},  
    { id : 6,    type: "F" ,  text: "F-Martingale, Fibonacci",       tooltip:   "Lot size is the Fibonacci of the number of trades multiply Initial Lot. If Initial Lot is 0.1 than we have (0.1 0.1 0.2 0.3 0.5 0.8 ...) until MaxCount"},
    { id : 7,    type: "D" ,  text: "D-Martingale, Double",          tooltip:   "Lot size is doubled when the number of trades reached the value precised in Recovery Value. If Recovery Value is 3 and Initial Lot is 0.3 than we have (0.3 0.3 0.3 0.6 0.6 ...) until MaxCount"},
    { id : 9,    type: "J" ,  text: "J-Martingale One side Exit",    tooltip :  "Martingale with multiplier after exit one side"},
    { id : 1,    type: "A" ,  text: "A-Alembex",                     tooltip :  "If the last trade is closed with a lost, the following trade size will be the same, If the last trade is closed with a gain after one or more consecutive losses the following trade size will be the the accumulated size of the previous losses. After 2 consecutives gains the trade size will be the initial lot"},
    { id : 4,    type: "L" ,  text: "L-Leverage",                    tooltip :  "Order Size Based on Leverage of Loss"},
    { id : 5,    type: "K" ,  text: "K-Leverage Opposite Loss",      tooltip :  "Leverage : An opposite Size Based on the Loss. Example : If We have a Buy Loss the next Sell Lot Size will be calculated in order to recover the loss within the pips specified in Recovery Value"},
    { id : 12,   type: "H" ,  text: "H-Sequence 1.1.2.4",            tooltip :  "1.1.2.4 Sequence"},    
    { id : 13,   type: "S" ,  text: "S-Sequence 1.1.3.3",            tooltip :  "1.1.3.3 Sequence"},  
    { id : 14,   type: "N" ,  text: "N-Sequence 1.2.6",              tooltip :  "1.2.6 Sequence"},  
    { id : 15,   type: "O" ,  text: "O-Sequence 1.2.6.24",           tooltip :  "1.2.6.24 Sequence"}
    ];
//---------------------------------------------------------

const OrderTypeDescription  = ["Mono Orders",
                               "Coupled Buy Sell orders, (only in a BUYSELL session). Any order (buy or sel) will place 2 orders : one buy and one sell"
];

const OrderTypeMenu = [
    { id: OT_MONO, text: 'MONO'  ,  tooltip : "Mono Orders"},
    { id: OT_HEDGE, text: 'HEDGE',  tooltip : "Coupled Buy Sell orders, (only in a BUYSELL session). Any order (buy or sel) will place 2 orders : one buy and one sell"}
];

//---------------------------------------------------------

const KeepBuySellMenu = [
    { id: 0, text: 'FALSE'}, 
    { id: 1, text: 'TRUE'} 
 ];

//---------------------------------------------------------

const ExitModeDescription   = ["In a combined (buy, sell) BUYSELL Session, Buy orders should exit before Sell Orders even if an exit buy event is triggered before the exit sell orders event",
                                "In a combined (buy, sell) BUYSELL Session, Sell orders should exit before Sell Orders even if an exit sell event is triggered before the exit buy orders event",
                                "In a combined  (buy, sell) BUYSELL Session, no rule on exit is done"
];         

const ExitModeMenu = [
    { id: EM_EXITANY, text:  'EXITANY',      tooltip: "In a combined  (buy, sell) BUYSELL Session, no rule on exit is done"},
    { id: EM_EXITBUYFIRST, text:  'EXITBUYFIRST', tooltip: "In a combined (buy, sell) BUYSELL Session, Buy orders should exit before Sell Orders even if an exit buy event is triggered before the exit sell orders event"},
    { id: EM_EXITSELLFIRST, text:  'EXITSELLFIRST',tooltip: "In a combined (buy, sell) BUYSELL Session, Sell orders should exit before Sell Orders even if an exit sell event is triggered before the exit buy orders event"}
];

//---------------------------------------------------------

const OneOrderPerBarMenu = [
    { id: 0, text: 'FALSE'}, 
    { id: 1, text: 'TRUE'} 
];

//---------------------------------------------------------

const EngineFieldsItems = [
    //{id: B_STARTAUTOMATIC   , recid: -1,  property: '',                             value:  ' '},       
    //{id: B_BUYSELLAUTOMATIC , recid: -1,  property: '',                             value:  ' '},       
    //{id: B_EXITAUTOMATIC    , recid: -1,  property: '',                             value:  ' '},       
    //{id: B_HEDGEAUTOMATIC   , recid: -1,  property: '',                             value:  ' '}, 
    //{id: B_DEHEDGEAUTOMATIC , recid: -1,  property: '',                             value:  ' '},    

    {id: B_OPERATION,       name: 'B_OPERATION',      item1: 'Operation',         type: 'select',  value: 'BUYSELL',menu: OperationMenu,    title:  "Orders that are allowed in the strategy. BUY : Only Buy Orders, SELL : Only Sell Orders, BUYSELL : Sell and Buy Orders can be executed"},
    
    //{id: B_STARTRULE        , recid: -1,  property: '',                             value:  ' '},     
    //{id: B_BUYRULE          , recid: -1,  property: '',                             value:  ' '},       
    //{id: B_SELLRULE         , recid: -1,  property: '',                             value:  ' '},       
    //{id: B_EXITBUYRULE      , recid: -1,  property: '',                             value:  ' '},       
    //{id: B_EXITSELLRULE     , recid: -1,  property: '',                             value:  ' '}, 
    //{id: B_EXITRULE         , recid: -1,  property: '',                             value:  ' '}, 

    {id: B_ILOT,            name: 'B_ILOT',          item1: 'Initial Lot',        type: 'float', value: 0.1, min: 0, max: 200, step: 0.01,  title:  "Initial Lot Size of the strategy, If the value is 0, the initial value will be calculated as 2 % of your current account Equity"},
    {id: B_MAXLOT,          name: 'B_MAXLOT',        item1: 'Max Lot',            type: 'float', value: 1,   min: 0, max: 200, step: 0.01,  title:  "Maximum Lots Size allowed to trade in the strategy, If the value is 0 no maximum is applied, it will be the platform max size"},
    {id: B_MAXCOUNT,        name: 'B_MAXCOUNT',      item1: 'Max Count',          type: 'int',   value: 1,   min: 1, max: 500, step: 1,     title:  "Maximum number of not closed trades in the strategy, Example : if this number is 4 we can have a maximum of 4 active Sell Trades and 4 active Buy Trades simultaneously. An active Trade is a trade which has not been closed"},
    {id: B_DIRECTION,       name: 'B_DIRECTION',     item1: 'Direction',          type: 'select',value: 'ANY',   menu: DirectionMenu,       title:  "Direction indicates the placement that is allowed on orders depending on Direction Type"},
    {id: B_DIRECTIONTYPE,   name: 'B_DIRECTIONTYPE', item1: 'Direction Type',     type: 'select',value: 'LEVEL', menu: DirectionTypeMenu,   title:  "Determines the level of trades when the Direction is precised as BACWARD or FORWARD Direction"},
    {id: B_RECOVERYMODE,    name: 'B_RECOVERYMODE',  item1: 'Recovery Mode',      type: 'select',value: 'C',     menu: RecoveryModeMenu,    title:  "Way the volume of trades are calculated"},
    {id: B_RECOVERYVALUE,   name: 'B_RECOVERYVALUE', item1: 'Recovery Value',     type: 'float', value: 1,   min: 0, max: 200,              title:  "Value associated to the Recovery Mode, if Recovery Mode is a multiplier M, the value can be 1.5 or 2 ..."},
    {id: B_PIPSTEP,         name: 'B_PIPSTEP',       item1: 'Pip Step',           type: 'int',   value: 10 ,min: 0, max: 5000,  step: 1,    title:  "Minimum distance in pips between the opening of two consecutive trades. If the value is 0 means no distance is required"}, 
    {id: B_TIMESTEP,        name: 'B_TIMESTEP',      item1: 'Time Step',          type: 'int',   value: 10 ,min: 0, max: 5000,  step: 1,    title:  "Minimum time in minutes between the opening of two consecutive trades. If the value is 0, no time is applied"},    
    {id: B_ORDERTYPE,       name: 'B_ORDERTYPE',     item1: 'Order Type',         type: 'select',value: 'MONO',  menu: OrderTypeMenu,       title:  "Only in a BUYSELL Operation. If the value is HEDGE, any sell or any buy Order will be hedged : A Buy and Sell Order will be done instantly. Related Actions BUY, SELL"},  
    {id: B_KEEPBUYSELL,     name: 'B_KEEPBUYSELL',   item1: 'KeepBuySell',        type: 'select',value: 'FALSE', menu: KeepBuySellMenu,     title:  "Keep Combined Buy and Sell orders for hedged orders (specified in  Orders Type Property). If the value is TRUE it will not exit Buy trades when action Exit Buy is called and will not Exit Sell Trades when Exit Sell is called. Related Actions: EXIT_BUY, EXIT_SELL"},     
    {id: B_EXITMODE,        name: 'B_EXITMODE',      item1: 'Exit Mode',          type: 'select',value: 'EXITANY', menu: ExitModeMenu,      title:  "Only in a BUYSELL operation mode. It tells if exit of the buy trades should be before sell trades, it can be EXITANY, EXITBUYFIRST or EXITSELLFIRST. <br>Related Actions : EXIT_BUY, EXIT_SELL"},      
    {id: B_MAXTIME,         name: 'B_MAXTIME',       item1: 'Max Time',           type: 'int',   value: 0, min: 0, max: 25000,  step: 1,    title:  "Maximum time in minutes we allow a strategy to live. if it is 0 no time is applied. When MaxTime is reached the strategy exit automatically if the Profit is positif"},
    {id: B_HEDGEMAGNITUDE,  name: 'B_HEDGEMAGNITUDE',item1: 'Hedge Weight',       type: 'float', value: 1,min: 0.1,max: 10,  step: 0.1,     title:  "Magnitude of hedging for Buy or Sell trades"},   
    {id: B_MINPROFIT,       name: 'B_MINPROFIT',     item1: 'Min Profit',         type: 'float', value: 100, min: 0,  max: 32756,           title:  "Minimum Global Profit (buy sell combined) for the strategy to exit. 0 means no minimum is required.Related Action: EXIT"},   
    {id: B_BUYMINPROFIT,    name: 'B_BUYMINPROFIT',  item1: 'Buy Min Profit',     type: 'float', value: 100, min: 0,  max: 32756,           title:  "Minimum Global Buy Orders Profit for the strategy to exit all buy trades. 0  means no min profit. Related Action: EXIT_BUY"},   
    {id: B_SELLMINPROFIT,   name: 'B_SELLMINPROFIT', item1: 'Sell Min Profit',    type: 'float', value: 100, min: 0,  max: 32756,           title:  "Minimum Global Sell Orders Profit for the strategy to exit all sell trades. 0  means no min profit. Related Action: EXIT_SELL"},    
    {id: B_TP,              name: 'B_TP',            item1: 'Take Profit',        type: 'float', value: 0, min: 0,  max: 32756,             title:  "Take profit Amount for the strategy. 0 means no Take Profit : When this amount is reached, it closes all trades"},               
    {id: B_TS,              name: 'B_TS',            item1: 'Trailing Stop',      type: 'float', value: 0, min: 0,  max: 32756,             title:  "Trailing stop Amount for the strategy. 0 means no Trailing Stop : When this amount is reached, it closes all trades"},      
    {id: B_SL,              name: 'B_SL',            item1: 'Stop Loss',          type: 'float', value: 0, min: -32756,   max: 0,           title:  "Stop Loss Amount for the  strategy. 0 means no Stop Loss : When this amount is reached, it closes all trades"},     
    {id: B_BUYTP,           name: 'B_BUYTP',         item1: 'Buy Take Profit',    type: 'float', value: 0, min: 0,  max: 32756,             title:  "Take profit Amount of all Buy Orders for the strategy. 0 means no Buy Take Profit : When this amount is reached, it closes all buy trades"},          
    {id: B_BUYTS,           name: 'B_BUYTS',         item1: 'Buy Trailing Stop',  type: 'float', value: 0, min: 0,  max: 32756,             title:  "Trailing stop for all Buy Ordersof the strategy. 0 means no Trailing Stop : When this amount is reached , it closes all buy trades"},        
    {id: B_BUYSL,           name: 'B_BUYSL',         item1: 'Buy Stop Loss',      type: 'float', value: 0, min: -32756,   max: 0,           title:  "Stop Loss Amount for of all Buy Orders.0 means no Buy Stop Loss : When this amount is reached, it closes all buy trades"},     
    {id: B_SELLTP,          name: 'B_SELLTP',        item1: 'Sell Take Profit',   type: 'float', value: 0, min: 0,  max: 32756,             title:  "Take profit Amount of all Sell Orders for the stragey. 0 means no Sell Take Profit : When this amount is reached, it closes all sell trades"},           
    {id: B_SELLTS,          name: 'B_SELLTS',        item1: 'Sell Trailing Stop', type: 'float', value: 0, min: 0, max: 32756,              title:  "Trailing stop for all Sell Orders. 0 means no Trailing Stop : When this amount is reached, it closes all Sell trades"},           
    {id: B_SELLSL,          name: 'B_SELLSL',        item1: 'Sell Stop Loss',     type: 'float', value: 0, min: -32756,   max: 0,           title:  "Stop Loss Amount for of all Sell Orders.0 means no Sell Stop Loss : When this amount is reached, it closes all sell trades"},           
    {id: B_BUYLOTTP,        name: 'B_BUYLOTTP',      item1: 'Buy  Orders TP',     type: 'int',   value: 0, min: 0, max: 1000,  step: 1,     title:  "Take profit in pips for each Buy order. 0 means no Take Profit : Value in Pips and applied to all buy orders"},  
    {id: B_BUYLOTTS,        name: 'B_BUYLOTTS',      item1: 'Buy  Orders TS',     type: 'int',   value: 0, min: 0, max: 1000,  step: 1,     title:  "Trailing stop in pips for each Buy order. 0 means no Trailing Stop : Value in Pips and applied to all buy orders"},  
    {id: B_BUYLOTSL,        name: 'B_BUYLOTSL',      item1: 'Buy  Orders SL',     type: 'int',   value: 0, min: 0, max: 1000,  step: 1,     title:  "Stop Loss in pips for each Buy order. 0 means no Stop Loss  : Value in Pips and applied to all buy orders"},  
    {id: B_SELLLOTTP,       name: 'B_SELLLOTTP',     item1: 'Sell Orders TP',     type: 'int',   value: 0, min: 0, max: 1000,  step: 1,     title:  "Take profit in pips for each Sell order. 0 means no Take Profit : Value in Pips and applied to all Sell orders"},  
    {id: B_SELLLOTTS,       name: 'B_SELLLOTTS',     item1: 'Sell Orders TS',     type: 'int',   value: 0, min: 0, max: 1000,  step: 1,     title:  "Trailing stop in pips for each Sell order. 0 means no Trailing Stop : Value in Pips and applied to all Sell orders"},     
    {id: B_SELLLOTSL,       name: 'B_SELLLOTSL',     item1: 'Sell Orders SL',     type: 'int',   value: 0, min: 0, max: 1000,  step: 1,     title:  "Stop Loss in pips for each Sell order. 0 means no Stop Stop : Value in Pips and applied to all sell orders"},

   // {id: B_LEVELPOINT       , recid: -1,  property: 'Level Point',                  value:  ' '}
    
    {id: B_ONEORDERPERBAR,  name: 'B_ONEORDERPERBAR',item1: 'One Order PerBar',   type: 'select',value: 'FALSE',  menu: OneOrderPerBarMenu, title:  "Only one order can be opened on a bar in the expert Time Frame even if the previous order is Opened and Closed on this bar"},   
]

const PredefinedIndicatorsItems= [
    {id : UPFRACTAL        , text:  "Up Fractal for the corresponding Period, Bearish Reversal"},
    {id : DOWNFRACTAL      , text:  "Down Fractal for the corresponding Period. Bullish Reversal"},
    {id : SUPPORT          , text:  "Trendline between the two last Down Fractals. Check if the line is the same as the visual one"},
    {id : RESISTANCE       , text:  "Trendline between the two last Up Fractals. Check if the line is the same as the visual one"},
    {id : PIVOT_RESISTANCE2, text:  "Represents the third Pivot Resistance Line, the upper one. The formula is : 2 * Pivot Line + (High - (2 * Low)).  Tells if price is above or below, crossed the line"},
    {id : PIVOT_RESISTANCE1, text:  "Represents the second Pivot Resistance Line. The formula is : Pivot Line + (High - Low).  Tells if price is above or below, crossed the line"},
    {id : PIVOT_RESISTANCE , text:  "Represents the first Pivot Resistance Line. The formula is : 2 * Pivot Line  - Low.  Tells if price is above or below, crossed the line"},
    {id : PIVOT_HIGH       , text:  "Represents the Previous High of the period. Tells if price is above or below, crossed the line"},
    {id : PIVOT_POINT      , text:  "Represents the Pivot Line for the period. The formula is : (High + Close + Low)/3.  Tells if price is above or below, crossed the line"},
    {id : PIVOT_LOW        , text:  "Represents the Previous Low of the period. Tells if price is above or below, crossed the line"},
    {id : PIVOT_SUPPORT    , text:  "Represents the first Pivot Support Line. The formula is : 2 * Pivot Line  - High.  Tells if price is above or below, crossed the line"},
    {id : PIVOT_SUPPORT1   , text:  "Represents the second Pivot Support Line. The formula is : Pivot Line - (High - Low).  Tells if price is above or below, crossed the line"},
    {id : PIVOT_SUPPORT2   , text:  "Represents the third Pivot Support Line, the lower one. The formula is : 2 * Pivot Line + Low - (2 * High).  Tells if price is above or below, crossed the line"},
    {id : HEIKEN_ASHI      , text:  "The well known Heiken Ashi indicator"},
    {id : OPEN             , text:  "Describes the opening of the bar, its status compared to the opening of its previous bar or to the actual price. Tells how much consecutive bars are in the same opening condition"},
    {id : CLOSE            , text:  "Describes the closing of the bar (also the Bid Price), its status compared to the closing of the previous bar. Tells how much consecutive bars are in the same closing condition"},
    {id : HIGH             , text:  "Describes the high value of the bar, its status compared to the high of its previous bar or to the actual price. Tells how much consecutive bars are in the same condition"},
    {id : LOW              , text:  "Describes the low value of the bar, its status compared to the low of its previous bar or to the actual price. Tells how much consecutive bars are in the same condition"},
    {id : FIBOLEVEL        , text:  "When Price is above the Open Price for the corresponding period this indicator is calculated as follow : High  - (High -  Low) * 0.382, When price is below the Open Price it is : Low + (High - Low) * 0.382"}, 
    {id : FIBOSTOPLOSSLEVEL, text:  "When Price is above the Open Price for the corresponding period this indicator is calculated as follow : High  - (High -  Low) * 0.618, When price is below the Open Price it is : Low + (High - Low) *  0.618"},
    {id : BAR              , text:  "Represents the Bar properties for the corresponding Period. Price Action Signals are performed on this object. Check Signals"},
    {id : NEWS             , text:  "Gives an alert when Important news is imminent (5 minutes before)"},    
    {id : VOLUME           , text:  "Represents the volume for the corresponding Period"},
    {id : VOLUME_UP        , text:  "Represents the volume on up ticks, this indicator is important to see if the volume on up ticks is increasing or decreasing. VOLUME_DOWN + VOLUME_UP = VOLUME"},
    {id : VOLUME_DOWN      , text:  "Represents the volume on down ticks, this indicator is important to see if the volume on down ticks is increasing or decreasing. VOLUME_DOWN + VOLUME_UP = VOLUME"},
    {id : PROGRESS         , text:  "Represents the progress predefined System indicator for the corresponding Period. This Indicator relies on trix Indicator and Extreme Spike to determine Buy, Sell, Exit Buy or Exit Sell signals"},
];   

const IndicatorsMenu = [
    { id : 26, text: 'Average Directional Movement Index', name: "ADX",                type: ADX_TYPE,         grouptype: 'Trend',        icon:icon_indicator, tooltip:   "Average Directional Movement Index, helps to determine if there is a price trend. To catch all signals , you need to create an indicator for every mode : Main, PlusDI and MinusDI"},
    { id : 27, text: 'Average True Range',                 name: "ATR",                type: ATR_TYPE,         grouptype: 'Oscillators',  icon:icon_indicator, tooltip:   "Average True Range Technical Indicator, shows volatility of the market"},
    { id : BAR, text: 'Bar Action',                        name: "BAR",                type: PREDEFINED_TYPE,  grouptype: 'Price Action', icon:icon_indicator, tooltip :  "Represents the Bar properties for the corresponding Period. Price Action Signals are performed on this object. Check Signals"},  
    { id : CLOSE, text: 'Bar Close',                       name: "CLOSE",              type: PREDEFINED_TYPE,  grouptype: 'Price Action', icon:icon_indicator, tooltip :  "Describes the closing of the bar (also the Bid Price), its status compared to the closing of the previous bar. Tells how much consecutive bars are in the same closing condition"},  
    { id : HIGH , text: 'Bar High',                        name: "HIGH",               type: PREDEFINED_TYPE,  grouptype: 'Price Action', icon:icon_indicator, tooltip :  "Describes the high value of the bar, its status compared to the high of its previous bar or to the actual price. Tells how much consecutive bars are in the same condition"},  
    { id : LOW  , text: 'Bar Low',                         name: "LOW",                type: PREDEFINED_TYPE,  grouptype: 'Price Action', icon:icon_indicator, tooltip :  "Describes the low value of the bar, its status compared to the low of its previous bar or to the actual price. Tells how much consecutive bars are in the same condition"},  
    { id : OPEN, text: 'Bar Open',                         name: "OPEN",               type: PREDEFINED_TYPE,  grouptype: 'Price Action', icon:icon_indicator, tooltip :  "Describes the opening of the bar, its status compared to the opening of its previous bar or to the actual price. Tells how much consecutive bars are in the same opening condition"},  
    { id : 28, text: 'Bollinger Bands',                    name: "BOLLINGER",          type: BOLLINGER_TYPE,   grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Bollinger Bands, define the upper and the lower margins of the price range"},
    { id : 29, text: 'Commodity Channel Index',            name: "CCI",                type: CCI_TYPE,         grouptype: 'Oscillators',  icon:icon_indicator, tooltip :  "Commodity Channel Index, measures the deviation of the commodity price from its average statistical price"},
    { id : 30, text: 'External Indicator',                 name: "CUSTOM",             type: CUSTOM_TYPE,      grouptype: 'External',     icon:icon_indicator, tooltip :  "External defined Custom indicator only in MT4, allows to associate signals to a custom indicator"},
    { id : FIBOLEVEL, text: 'Fibonacci Level',                    name: "FIBOLEVEL",          type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "When Price is above the Open Price for the corresponding period this indicator is calculated as follow : High  - (High -  Low) * 0.382, When price is below the Open Price it is : Low + (High - Low) * 0.382"}, 
    { id : FIBOSTOPLOSSLEVEL, text: 'Fibonacci Stop Loss Level',  name: "FIBOSTOPLOSSLEVEL",  type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "When Price is above the Open Price for the corresponding period this indicator is calculated as follow : High  - (High -  Low) * 0.618, When price is below the Open Price it is : Low + (High - Low) *  0.618"},
    { id : DOWNFRACTAL,text: 'Fractal Down',               name: "DOWNFRACTAL",        type: PREDEFINED_TYPE,  grouptype: 'Bill Williams',icon:icon_indicator, tooltip :  "Down Fractal for the corresponding Period. Bullish Reversal"},
    { id : UPFRACTAL,  text: 'Fractal Up',                 name: "UPFRACTAL",          type: PREDEFINED_TYPE,  grouptype: 'Bill Williams',icon:icon_indicator, tooltip :  "Up Fractal for the corresponding Period, Bearish Reversal"},
    { id : HEIKEN_ASHI, text: 'Heiken Ashi',               name: "HEIKEN_ASHI",        type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Heiken Ashi indicator"}, 
    { id : 31, text: 'Ichimoku Kinko Hyo',                 name: "ICHIMOKU",           type: ICHIMOKU_TYPE,    grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Ichimoku Kinko Hyo, characterize the market Trend, Support and Resistance Levels, helps generate signals of buying and selling. This indicator works best at weekly and daily charts"},
    { id : 32, text: 'MACD',                               name: "MACD",               type: MACD_TYPE,        grouptype: 'Oscillators',  icon:icon_indicator, tooltip :  "Moving Average Convergence/Divergence, indicates the correlation between two Moving Averages of a price"},
    { id : 33, text: 'Moving Average',                     name: "MA",                 type: MA_TYPE,          grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Moving Average, shows the mean instrument price value for a certain period of time"},
    { id : NEWS, text: 'News',                             name: "NEWS",               type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Gives an alert when Important news is imminent (5 minutes before)"},
    { id : 34, text: 'Parabolic SAR',                      name: "SAR",                type: SAR_TYPE,         grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Parabolic SAR, providing exit points. Long positions should be closed when the price sinks below the SAR line, short positions should be closed when the price rises above the SAR line"},
    { id : PIVOT_HIGH,  text: 'Pivot High',                name: "PIVOT_HIGH",         type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the Previous High of the period. Tells if price is above or below, crossed the line"},
    { id : PIVOT_LOW, text: 'Pivot Low',                   name: "PIVOT_LOW",          type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the Previous Low of the period. Tells if price is above or below, crossed the line"},    
    { id : PIVOT_POINT,  text: 'Pivot Point',              name: "PIVOT_POINT",        type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the Pivot Line for the period. The formula is : (High + Close + Low)/3.  Tells if price is above or below, crossed the line.."},
    { id : PIVOT_RESISTANCE,  text: 'Pivot Resistance',    name: "PIVOT_RESISTANCE",   type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the first Pivot Resistance Line. The formula is : 2 * Pivot Line  - Low.  Tells if price is above or below, crossed the line"},
    { id : PIVOT_RESISTANCE1,  text: 'Pivot Resistance 1', name: "PIVOT_RESISTANCE1",  type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the second Pivot Resistance Line. The formula is : Pivot Line + (High - Low).  Tells if price is above or below, crossed the line"},
    { id : PIVOT_RESISTANCE2,  text: 'Pivot Resistance 2', name: "PIVOT_RESISTANCE2",  type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the third Pivot Resistance Line, the upper one. The formula is : 2 * Pivot Line + (High - (2 * Low)).  Tells if price is above or below, crossed the line"},
    { id : PIVOT_SUPPORT, text: 'Pivot Support',           name: "PIVOT_SUPPORT",      type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the first Pivot Support Line. The formula is : 2 * Pivot Line  - High.  Tells if price is above or below, crossed the line"},
    { id : PIVOT_SUPPORT1, text: 'Pivot Support 1',        name: "PIVOT_SUPPORT1",     type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the second Pivot Support Line. The formula is : Pivot Line - (High - Low).  Tells if price is above or below, crossed the line"},
    { id : PIVOT_SUPPORT2, text: 'Pivot Support 2',        name: "PIVOT_SUPPORT2",     type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Represents the third Pivot Support Line, the lower one. The formula is : 2 * Pivot Line + Low - (2 * High).  Tells if price is above or below, crossed the line"},
    { id : 40, text: 'Progress',                           name: "PROGRESS",           type: PREDEFINED_TYPE,  grouptype: 'System',       icon:icon_indicator, tooltip :  "Internal System Indicator"},
    { id : 35, text: 'Relative Strength Index',            name: "RSI",                type: RSI_TYPE,         grouptype: 'Oscillators',  icon:icon_indicator, tooltip :  "Relative Strength Index Technical Indicator, determines divergence (failure swing) or  overbought/oversold condtion"},
    { id : 36, text: 'Stochastic Oscillator',              name: "STOCHASTIC",         type: STOCHASTIC_TYPE,  grouptype: 'Oscillators',  icon:icon_indicator, tooltip :  "Stochastic Oscillator Technical Indicator"}, 
    { id : 37, text: 'System Indicator',                   name: "SYSTEM",             type: SYSTEM_TYPE,      grouptype: 'System',       icon:icon_indicator, tooltip:   "System Indicators can be defined by combining multiple basic indicators "},
    { id : RESISTANCE,  text: 'Trend Line Resistance',     name: "RESISTANCE",         type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Trendline between the two last Up Fractals. Check if the line is the same as the visual one"},
    { id : SUPPORT,  text: 'Trend Line Support',           name: "SUPPORT",            type: PREDEFINED_TYPE,  grouptype: 'Trend',        icon:icon_indicator, tooltip :  "Trendline between the two last Down Fractals. Check if the line is the same as the visual one"},
    { id : VOLUME     , text: 'Volume',                    name: "VOLUME",             type: PREDEFINED_TYPE,  grouptype: 'Volumes',      icon:icon_indicator, tooltip :  "Represents the volume for the corresponding Period"},
    { id : VOLUME_UP  , text: 'Volume Up',                 name: "VOLUME_UP",          type: PREDEFINED_TYPE,  grouptype: 'Volumes',      icon:icon_indicator, tooltip :  "Represents the volume on down ticks, this indicator is important to see if the volume on down ticks is increasing or decreasing. VOLUME_DOWN + VOLUME_UP = VOLUME"},
    { id : VOLUME_DOWN, text: 'Volume Down',               name: "VOLUME_DOWN",        type: PREDEFINED_TYPE,  grouptype: 'Volumes',      icon:icon_indicator, tooltip :  "Represents the volume on up ticks, this indicator is important to see if the volume on up ticks is increasing or decreasing. VOLUME_DOWN + VOLUME_UP = VOLUME"},
    { id : 38, text: 'Williams Percent Range',             name: "WPR",                type: WPR_TYPE,         grouptype: 'Oscillators',  icon:icon_indicator, tooltip :  "Williams Percent Range Technical Indicator, determines whether the market is overbought/oversold. It can be used also as a Momentum Indicator"}
];

//================================================= OPERATIONS ==========================================

const OperationItems = [
    { id:21, text: 'Start',              name: 'START',            tooltip :  "Start the Session"},
    { id:26, text: 'Exit',               name: 'EXIT',             tooltip :  "Exit all orders (Buy and Sell). Exit the session"},
    { id:22, text: 'Buy',                name: 'BUY',              tooltip :  "Buy Execution"},    
    { id:23, text: 'Sell',               name: 'SELL',             tooltip :  "Sell Execution"},    
    { id:24, text: 'Exit Buy',           name: 'EXIT_BUY',         tooltip :  "Exit all buy orders. No more Buy orders can be performed in the session"},    
    { id:25, text: 'Exit Sell',          name: 'EXIT_SELL',        tooltip :  "Exit all sell orders. No more Sell orders can be performed in the session"},   

    { id:29, text: 'Close',              name: 'CLOSE',            tooltip :  "Close all orders. Session is still alive. Orders can be performed"},
    { id:214,text: 'Close Hedge',        name: 'CLOSE_HEDGE',      tooltip :  "Close all Hedges for the session (Buy and Sell)"},
    { id:27, text: 'Close Buy',          name: 'CLOSE_BUY',        tooltip :  "Close all buy orders. Buy orders can still be performed"},
    { id:212,text: 'Close Hedge Buy',    name: 'CLOSE_HEDGE_BUY',  tooltip :  "Close Hedge Buy: Close the sell Order correponding to the the buy orders that were hedged"},    
    { id:28, text: 'Close Sell',         name: 'CLOSE_SELL',       tooltip :  "Close all sell orders. Sell orders can still be performed"},
    { id:213,text: 'Close Hedge Sell',   name: 'CLOSE_HEDGE_SELL', tooltip :  "Close Hedge Sell:Close the buy Order correponding to the the sell orders that were hedged"},  
    { id:210,text: 'Hedge Buy',          name: 'HEDGE_BUY',        tooltip :  "Hedge Buy Orders for the session. Hedge is done on the sum of all buy lots"},    
    { id:211,text: 'Hedge Sell',         name: 'HEDGE_SELL',       tooltip :  "Hedge Sell Orders for the session. Hedge is done on the sum of all sell lots"},    
]; 

//------------------------------------------------------------- INDICATOR PANEL --------------------------------------------------------------------

const  ApplyTo  = [
                {id:'Close',    text: 'Close'},
                {id:'Open', text: 'Open'},
                {id:'High', text: 'High'},
                {id:'Low',  text: 'Low'},
                {id:'Median Price (HL/2)'   , text: 'Median Price (HL/2)'},
                {id:'Typical Price (HLC/3)' , text: 'Typical Price (HLC/3)'},
                {id:'Weighted Close (HLCC/4)', text: 'Weighted Close (HLCC/4)'}, 
];

const  MaMethod = [
                {id:'Simple',          text: 'Simple'},   
                {id:'Exponential',     text: 'Exponential'},
                {id:'Smoothed',        text: 'Smoothed'}, 
                {id:'Linear Weighted',  text: 'Linear Weighted'} 
];

const  ModeDI = [
                {id: 'Main',    text: 'Main'},   
                {id: 'PlusDI',  text: 'PlusDI'},       
                {id: 'MinusDI', text: 'MinusDI'}
];

const  ModeUL = [
                {id:'Main',   text: 'Main'}, 
                {id:'Upper',  text: 'Upper'},
                {id:'Lower',  text: 'Lower'}
]

const  ModeMS = [
                {id:'Main',   text: 'Main'},
                {id:'Signal',  text: 'Signal'}
];

const  PriceField = [
                    {id:'Low/High', text: 'Low/High'},
                    {id:'Close/Close',text: 'Close/Close'}
];

var Display = [
            {id:'Main', text: 'Main'},
            {id:'Seperate',text: 'Seperate'}
];

const DisplayType = [
                    {id:'Trendline', text:'Trendline'}, 
                    {id:'Histogram', text: 'Histogram'},
                    {id:'Bull/Bear',text: 'Bull/Bear'}
];

const TrueFalseMenu = [
    { id: 0, text:  'false'}, 
    { id: 1, text:  'true'} 
];

const CustomLevelsMenu = [
    { id: 0, text: 'Up Value',      tooltip: "Field that returns the up value of the indicator"},
    { id: 1, text: 'Down Value',    tooltip: "Field that returns the down value of the indicator"},
    { id: 2, text: 'Sideway Value', tooltip: "Field that returns the sideway value of the indicator"},
    { id: 3, text: 'Value',         tooltip: "Field that returns the value of the indicator"},                             
    { id: 4, text: '----- ',        tooltip: "Field with no value"}
    ];


const IndicatorsTypeMenu = [
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0},
    {levels : [40, 30, 25, 20, 10],     leveltype: STRONGWEAK_LEVEL,            display: SEPERATE_DISPLAY,  displaytype: 0},
    {levels : ["", 100, 0, -100, ""],   leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: SEPERATE_DISPLAY,  displaytype: 0},    
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0},
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0},
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0},
    {levels : [80, 70, 50, 30, 20],     leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: SEPERATE_DISPLAY,  displaytype: 0},
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: SEPERATE_DISPLAY,  displaytype: 0},
    {levels : ["", 80, 50, 20, ""],     leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: SEPERATE_DISPLAY,  displaytype: 0},
    {levels : ["", -20, -50, -80, ""],  leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: SEPERATE_DISPLAY,  displaytype: 0},
    {levels : ["", 0.0016, 0.0012, 0.0006, ""],  leveltype: STRONGWEAK_LEVEL,    display: SEPERATE_DISPLAY,      displaytype: 0},
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0},
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0},
    {levels : [],                       leveltype: OVERBOUGHTOVERSOLD_LEVEL,    display: MAIN_DISPLAY,      displaytype: 0}
]
    
    
const IndicatorsFieldMenu = [
    //MA
    [
        {field: 'period',   property: 'Period',     editable: {default:6,        type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,     html: {column: 0}},
        {field: 'shift',    property: 'Shift',      editable: {default:0,        type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,     html: {column: 1}}, 
        {field: 'applyto',  property: 'Apply To',   editable: {default:'Close',  type: 'select', items: ApplyTo},     required: true,     html: {column: 0}},  
        {field: 'mamethod', property: 'Ma Method',  editable: {default:'Simple', type: 'select', items: MaMethod},    required: true,     html: {column: 1}},   
        {field: 'cross',    property: 'Cross',      editable: {default:'',       type: 'select', items: []},          required: false,    html: {column: 0}},   
    ],    
    //ADX
    [
        {field: 'period',   property: 'Period',     editable: {default:14,       type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,     html: {column: 0}},
        {field: 'mode',     property: 'Mode',       editable: {default:'Main',   type: 'select', items: ModeDI},required: true,     html: {column: 1}},     
        {field: 'applyto',  property: 'Apply To',   editable: {default:'Close',  type: 'select', items: ApplyTo},                     required: true,     html: {column: 0}},         
        {field: 'cross',    property: 'Cross',      editable: {default:'',       type: 'select', items: []},                          required: false,    html: {column: 1}},         
    ],    
    //CCI
    [
        {field: 'period',   property: 'Period',    editable: {default:14,        type: 'int',  min: 0, max: 5000, spin: true, step: 1},     required: true,          html: {column: 0}},
        {field: 'applyto',  property: 'Apply To',  editable: {default:'Typical Price (HLC/3)', type: 'select', items: ApplyTo},        required: true,          html: {column: 1}},   
        {field: 'cross',    property: 'Cross',     editable: {default:'',         type: 'select', items: []},             required: false,         html: {column: 0}},   
    ],   
    //ICHIMOKU    
    [
        {field: 'tenkansen',  property: 'Tenkan-Sen',   editable: {default:9,     type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,  html: {column: 0}}, 
        {field: 'kijunsen',   property: 'Kijun-Sen',    editable: {default:26,    type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,  html: {column: 1}}, 
        {field: 'senkouspanb',property: 'Senkou Span B',editable: {default:52,    type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,  html: {column: 0}}, 
    ],    
    //BOLLINGER
    [
        {field: 'period',   property: 'Period',     editable: {default:20,          type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,   html: {column: 0}},
        {field: 'shift',    property: 'Shift',      editable: {default:0,           type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,   html: {column: 1}}, 
        {field: 'dev',      property: 'Dev',        editable: {default:2,           type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,   html: {column: 0}}, 
        {field: 'mode',     property: 'Mode',       editable: {default:'Main',      type: 'select',  items: ModeUL},           required: true,          html: {column: 1}}, 
        {field: 'applyto',  property: 'Apply To',   editable: {default:'Close',     type: 'select',  items: ApplyTo},          required: true,          html: {column: 0}}, 
        {field: 'cross',    property: 'Cross',      editable: {default:'',          type: 'select',  items: []},               required: false,         html: {column: 1}},
    ],    
    //SAR    
    [
        {field: 'step',     property: 'Step',       editable: {default:'0.02',      type: 'float',   min: 0,  max: 32756},  required: true,   html: {column: 0}}, 
        {field: 'maximum',  property: 'Maximum',    editable: {default:'0.2',       type: 'float',   min: 0,  max: 32756} ,  required: true,   html: {column: 1}}, 
    ],    
    //RSI    
    [
        {field: 'period',   property: 'Period',     editable: {default:14,            type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,       html: {column: 0}},
        {field: 'applyto',  property: 'Apply To',   editable: {default:'Close',       type: 'select', items: ApplyTo}, required: true,          html: {column: 1}}, 
        {field: 'cross',    property: 'Cross',      editable: {default:'',            type: 'select', items: []},      required: false,         html: {column: 0}}
    ],
    //MACD
    [
        {field: 'fastema',  property: 'Fast EMA',   editable: {default:12,          type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,    html: {column: 0}}, 
        {field: 'slowema',  property: 'Slow EMA',   editable: {default:25,          type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,    html: {column: 1}},
        {field: 'sma',      property: 'SMA',        editable: {default:9,           type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,    html: {column: 0}}, 
        {field: 'mode',     property: 'Mode',       editable: {default:'Main',      type: 'select', items: ModeMS},   required: true,        html: {column: 1}},
        {field: 'applyto',  property: 'Apply To',   editable: {default:'Close',     type: 'select', items: ApplyTo},  required: true,        html: {column: 0}}, 
        {field: 'cross',    property: 'Cross',      editable: {default:'',          type: 'select', items: []},        required: false,       html: {column: 1}}, 
    ],
    //STOCHASTIC        
    [
        {field: 'percentkperiod', property: '%K Period',  editable: {default:14,    type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,     html: {column: 0}},
        {field: 'percentdperiod', property: '%D Period',  editable: {default:3,     type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,    html: {column: 1}},
        {field: 'mode',     property: 'Mode',       editable: {default:'Main',      type: 'select', items: ModeMS},     required: true,       html: {column: 1}}, 
        {field: 'pricefield',property: 'Price Field',editable: {default:'Low/High',  type: 'select', items: PriceField}, required: true,        html: {column: 0}}, 
        {field: 'slowing',  property: 'Slowing',    editable: {default:3,           type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,      html: {column: 0}},
        {field: 'mamethod', property: 'Ma Method',  editable: {default:'Simple',    type: 'select',items: MaMethod}, required: true,          html: {column: 1}}, 
        {field: 'cross',    property: 'Cross',      editable: {default:'',          type: 'select',items: []},       required: false,         html: {column: 0}}, 
    ],   
    //WPR    
    [
        {field: 'period',   property: 'Period',     editable: {default:14,              type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,    html: {column: 0}} ,
        {field: 'cross',    property: 'Cross',      editable: {default:'',              type: 'select', items: []},   required: false,            html: {column: 1}}, 
    ],    
    //ATR    
    [
        {field: 'period',   property: 'Period',     editable: {default:14,              type: 'int',  min: 0, max: 5000, spin: true, step: 1},    required: true,     html: {column: 0}},
        {field: 'cross',    property: 'Cross',      editable: {default:'',              type: 'select', items: []}, required: false,             html: {column: 1}},
    ],    
    //CUSTOM    
    [
        {field: 'file',     property: 'File',       editable: {default:'',              type: 'file',   max: 1}, required: true,                  html: {column: 0}}, 
        {field: 'display',  property: 'Display',    editable: {default:'Main',      type: 'select',  items: Display},    required: true,      html: {column: 0}}, 
        {field: 'displaytype',property: 'DisplayType',editable: {default: 'Trendline',    type: 'select',  items: DisplayType},required: false,     html: {column: 0}}, 
        {field: 'cross',    property: 'Cross',      editable: {default:'',              type: 'select',  items: []},         required: false,     html: {column: 0}},
        {field: 'custom',   property:'Levels',      editable: {default:'',              type: 'custom'},   required: false,                       html: {column: 1}}
    ],
    //PREDEFINED
    [],
    //SYSTEM    
    []
]
    
var Basic1LogicMenu      = [
    { id:1, text: 'And',             name: 'AND',          tooltip :  "And Logical Operator. Number of Parameters : Variable"},    
    { id:2, text: 'Or',              name: 'OR',           tooltip :  "Or Logical Operator. Number of Parameters : Variable"},    
    { id:3, text: 'Not',             name: 'NOT',          tooltip :  "Not Logical Operator. Number of Parameters : 1"}  
]

var Basic2LogicMenu      = [
    { id:1, text: '=',               name: '=',            tooltip :  "Equality between 2 entities. Number of Parameters : 2"},  
    { id:2, text: '>',               name: '>',            tooltip :  "Greater Operator. Between Numeric. Number of Parameters : 2"},    
    { id:3, text: '>=',              name: '>=',           tooltip :  "Greater or Equal Operator. Between Numeric. Number of Parameters : 2"},    
    { id:4, text: '<',               name: '<',            tooltip :  "Lesser Operator. Between Numeric. Number of Parameters : 2"},    
    { id:5, text: '<=',              name: '<=',           tooltip :  "Lesser or Equal Operator. Between Numeric. Number of Parameters : 2"}
]

//---------------------------------------------------- schedule PROPERTIES PANEL --------------------------------------------------------   
var DaysMenu = [
    { id :0,  text:  '-----'},    
    { id: 1, text:  'Monday'}, 
    { id: 2, text:  'Tuesday'}, 
    { id: 3, text:  'Wednesday'},
    { id: 4, text:  'Thursday'},
    { id: 5, text:  'Friday'}
];
    
var WeeksMenu = [
    { id :0,  text:  '-----'},    
    { id: 1, text:  '1st Week'}, 
    { id: 2, text:  '2nd Week'}, 
    { id: 3, text:  '3rd Week'},
    { id: 4, text:  '4th Week'},
    { id: 5, text:  '5th Week'}
];
    
var MonthsMenu = [
    { id :0,  text:  '-----'},    
    { id :1,   text:  "January"},
    { id :2,   text:  "February"},
    { id :3,   text:  "March"},
    { id :4,   text:  "April"},
    { id :5,   text:  "May"},
    { id :6,   text:  "June"},
    { id :7,   text:  "July"},
    { id :8,   text:  "August"},
    { id :9,   text:  "September"},
    { id :10,  text:  "October"},
    { id :11,  text:  "November"},
    { id :12,  text:  "December"}    
];

var ScheduleMenu = [
    {id :11, name : 'S_MONTH',   item1:'From Month',  value: '-----' ,  type: 'select',  menu: MonthsMenu,   events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "Start Month for strategy to be launched" },                                  
    {id :21, name : 'E_MONTH',   item1:'To Month',  value: '-----' ,    type: 'select',  menu: MonthsMenu,   events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "End Month for strategy to be launched" },                                  
    {id :12, name : 'S_WEEK',    item1:'From Week',   value: '-----' ,  type: 'select',  menu: WeeksMenu,    events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "Start Week of the month from where strategy can be launched"},
    {id :22, name : 'E_WEEK',    item1:'To Week',   value: '-----' ,    type: 'select',  menu: WeeksMenu,    events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "End Week of the month from where strategy can be launched"},
    {id :13, name : 'S_DAY',     item1:'From Day',    value: '-----' ,  type: 'select',  menu: DaysMenu,     events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "Start Day in the week, from where strategy can be launched"},
    {id :23, name : 'E_DAY',     item1:'To Day',    value: '-----' ,    type: 'select',  menu: DaysMenu,     events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "End Day in the week, from where strategy can be launched"},
    {id :14, name : 'S_TIME',    item1:'From Time',          type: 'time',   format: 'h24',       events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "Start Time in the day from where strategy can be launched"},  
    {id :24, name : 'E_TIME',    item1:'To Time',               type: 'time',   format: 'h24',       events: {onchange: 'onchange_strategyschedule (this, event)'}, title :  "End Time in the day from where strategy can be launched"},  
];

var SchedulePropertyMenu = [
    {id :2,  name : 'D_FREQUENCY',      item1:'Frequency (per Day)', value: 0 , type: 'int',    min: 0,  max: 40, step: 1,title :  "Maximum number of times the strategy can be launched every day. 0 means not specified"},
    {id :4,  name : 'D_DELAY',          item1:'Delay (minutes)',     value: 0 , type: 'int',    min: 0,  max: 5000,  step: 1,    title :  "Delay between two launches for the strategy. 0 means not specified"},  
    {id :3,  name : 'D_ONELAUNCHPERBAR',item1:'One Launch per Bar',  value: 'FALSE' , type: 'select', menu: TrueFalseMenu, title :  "Only One Session can be started on each bar of the Expert running period. After Exiting it waits the next bar"},  
    {id :5,  name : 'D_GMT',            item1:'GMT',                 value: 'FALSE' , type: 'select', menu: TrueFalseMenu, title :  "Time expressed in GMT"},     
//    {id :6,  name : 'D_SPREAD',         item1:'',                    value:  , type: 'float',  min: 0,  max: 32756,    title :  "Maximum Spread Pips where strategy can be launched"},     
];    

var StrategiesMenu = [
    { id : 10,  text: 'Standard',                name: "C",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "All lots have the same size which is Initial Lot size"},
    { id : 2,   text: 'Increment',               name: "I",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "Lot size is incremented with value indicated in Recovery Value if Recovery Value is 0.2 and Initial Lot is 0.1 we have (0.1 0.3 0.5 0.7 0.9 ....) until MaxCount"},
    { id : 11,  text: 'Increment Max',           name: "P",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "If in the sequence we have a loosing trade, the next trade size is Initial Lot until we have a gaining trade.Once we have a gaining trade the next trade size is the increment of the biggest lot in the session with Initial Lot. Until we have a loosing trade the lot size is Initial Lot"}, 
    { id : 8,   text: 'Martingale Classic',      name: "M",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "Martingale with multiplier that is indicated in Recovery Value"},  
    { id : 6,   text: 'Martingale, Fibonacci',   name: "F",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip:   "Lot size is the Fibonacci of the number of trades multiply Initial Lot. If Initial Lot is 0.1 than we have (0.1 0.1 0.2 0.3 0.5 0.8 ...) until MaxCount"},
    { id : 7,   text: 'Martingale, Double',      name: "D",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip:   "Lot size is doubled when the number of trades reached the value precised in Recovery Value. If Recovery Value is 3 and Initial Lot is 0.3 than we have (0.3 0.3 0.3 0.6 0.6 ...) until MaxCount"},
    { id : 9,   text: 'Martingale One side Exit',name: "J",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "Martingale with multiplier after exit one side"},
    { id : 1 ,  text: 'Alembex',                 name: "A",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "Alembex : If lost same lot else last cumulative lost"},
    { id : 4,   text: 'Leverage',                name: "L",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "Order Size Based on Leverage of Loss"},
    { id : 3,   text: 'Leverage Opposite',       name: "Q",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "If Last lot is closed with lost we multiply next opposite lot by multiplier precised in Recovery Value, otherWise Next lot is Initial Lot "},
    { id : 5,   text: 'Leverage Opposite Loss',  name: "K",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "Leverage : An opposite Size Based on the Loss. Example : If We have a Buy Loss the next Sell Lot Size will be calculated in order to recover the loss within the pips specified in Recovery Value"},
    { id : 12,  text: 'Sequence 1.1.2.4',       name: "H",       type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "1.1.2.4 Sequence"},    
    { id : 13,  text: 'Sequence 1.1.3.3',       name: "S",       type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "1.1.3.3 Sequence"},  
    { id : 14,  text: 'Sequence 1.2.6',         name: "N",       type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "1.2.6 Sequence"},  
    { id : 15,  text: 'Sequence 1.2.6.24',       name: "O",      type: PREDEFINED_TYPE,  icon:'fas fa-project-diagram',  tooltip :  "1.2.6.24 Sequence"}
];


const ActionDescription = [
    {id: 1,   text :  "Condition to Insert"},	
    {id: 11,  text :  "If Statement\n syntax : (IF (LOGIC) (ACTION ACTION1 ...) (ELSE (ACTION ACTION1 ....))"},
    {id: 12,  text :  "Else Statement, In If Statement  syntax : (ACTION ACTION1 ...)"},
    {id: 2,   text :  "Market Execution"},	
    {id: 21,  text :  "Start the Session"},
    {id: 22,  text :  "Buy Execution"},    
    {id: 23,  text :  "Sell Execution"},    
    {id: 24,  text :  "Exit all buy orders. No more Buy orders can be performed in the session"},    
    {id: 25,  text :  "Exit all sell orders. No more Sell orders can be performed in the session"},   
    {id: 26,  text :  "Exit all orders (Buy and Sell). Exit the session"},
    {id: 27,  text :  "Close all buy orders. Buy orders can still be performed"},
    {id: 28,  text :  "Close all sell orders. Sell orders can still be performed"},
    {id: 29,  text :  "Close all orders. Session is still alive. Orders can be performed"},
    {id: 210, text :  "Hedge Buy Orders for the session. Hedge is done on the sum of all buy lots"},    
    {id: 211, text :  "Hedge Sell Orders for the session. Hedge is done on the sum of all sell lots"},    
    {id: 212, text :  "Close Hedge Buy"},    
    {id: 213, text :  "Close Hedge Sell"},  
    {id: 214, text :  "Close all Hedges for the session"},
    {id: 215, text :  "Affet a value to the session Field"},
    {id: 3,   text :  "Logic returns TRUE/FALSE"},	
    {id: 31,  text :  "AND Period Logic operation for a signal occuring on an Object for the current Bar. Returns true/false"},  
    {id: 32,  text :  "AND Period Logic operation for a signal occuring on an Object on a tick start for the current Bar. Returns true/false"},   
    {id: 33,  text :  "AND Period Logic operation for a signal occuring on an Object on a Bar when the previous bar is the contrary. Returns true/false"},    
    {id: 34,  text :  "AND Logic operation on Object (Indicator) for the Previous Bar(the Bar that precedes the current bar for the period). Define Signal and Periods"},      
    {id: 35,  text :  "OR Period Logic operation for a signal occuring on an Object for the current Bar. Returns true/false"},  
    {id: 36,  text :  "OR Period Logic operation for a signal occuring on an Object on a tick start for the current Bar. Returns true/false"},   
    {id: 37,  text :  "OR Period Logic operation for a signal occuring on an Object on a Bar when the previous bar is the contrary. Returns true/false"},    
    {id: 38,  text :  "OR Logic operation on Object (Indicator) for the Previous Bar(the Bar that precedes the current bar for the period). Define Signal and Periods"},      
    {id: 4,   text :  "Logic returns TRUE/FALSE"},	
    {id: 41,  text :  "Returns Signal Value for an Object on a Period for the Current Bar"},   
    {id: 42,  text :  "Returns Signal Value for an Object on a Period for the Previous Bar"},
    {id: 43,  text :  "Returns Signal Time for an Object on a Period for the Current Bar"},   
    {id: 44,  text :  "Returns Signal Time for an Object on a Period for the Previous Bar"},
    {id: 45,  text :  "Returns Signal Price for an Object on a Period for the Current Bar"},   
    {id: 46,  text :  "Returns Signal Price for an Object on a Period for the Previous Bar"},
    {id: 47,  text :  "AND Period Logic Value operation for a signal occuring on an Object for the Current Bar. Must be used only with < > <= >= = Operators. Example (> (AndV RSI S_CURRENT P_M5 P_M5) 10)"},    
    {id: 48,  text :  "AND Period Logic Value operation for a signal occuring on an Object for the Previous Bar. Must be used only with < > <= >= = Operators. Example (> (AndPV RSI S_CURRENT P_M5 P_M5) 10)"},    
    {id: 49,  text :  "AND Period Logic Value operation for a signal occuring on an Object for the Current Bar while Not occuring on the Previous One. Must be used only with < > <= >= = Operators. Example (> (AndBV RSI S_CURRENT P_M5 P_M5) 10)"},    
    {id: 50,  text :  "OR Period Logic Value operation for a signal occuring on an Object for the Current Bar. Must be used only with < > <= >= = Operators. Example (> (OrV RSI S_CURRENT P_M5 P_M5) 10)"},    
    {id: 51,  text :  "OR Period Logic Value operation for a signal occuring on an Object for the Previous Bar. Must be used only with < > <= >= = Operators. Example (> (OrPV RSI S_CURRENT P_M5 P_M5) 10)"},    
    {id: 52,  text :  "OR Period Logic Value operation for a signal occuring on an Object for the Current Bar while Not occuring on the Previous One. Must be used only with < > <= >= = Operators. Example (> (OrBV RSI S_CURRENT P_M5 P_M5) 10)"},             
    {id: 5,   text :  "Session Field Value"},   
    {id: 51,  text :  "Input"},    
    {id: 52,  text :  "Output"},    
    {id: 53,  text :  "Logic on Objects. (Indicator)"},	
    {id: 6,   text :  "Market Data"},	
    {id: 61,  text :  "Current Bid Price for the underlying Currency"},    
    {id: 62,  text :  "Current Ask Price for the underlying Currency"},    
    {id: 63,  text :  "Point of the Current Currency"},   
    {id: 64,  text :  "Digits of the Current Currency"},   
    {id: 65,  text :  "Symbol of the Current Currency"},   
    {id: 66,  text :  "Current Platform Time"},    
    {id: 67,  text :  "Time Frame in which Expert is Running"},    
    {id: 7,   text :  "Mathematics"},	
    {id: 71,  text :  "Logic Operators"},	
    {id: 72,  text :  "And Logical Operator. Number of Parameters : Variable"},    
    {id: 73,  text :  "Or Logical Operator. Number of Parameters : Variable"},    
    {id: 74,  text :  "Not Logical Operator. Number of Parameters : 1"},  
    {id: 75,  text :  "Equality between 2 entities. Number of Parameters : 2"},  
    {id: 76,  text :  "Greater Operator. Between Numeric. Number of Parameters : 2"},    
    {id: 77,  text :  "Greater or Equal Operator. Between Numeric. Number of Parameters : 2"},    
    {id: 78,  text :  "Lesser Operator. Between Numeric. Number of Parameters : 2"},    
    {id: 79,  text :  "Lesser or Equal Operator. Between Numeric. Number of Parameters : 2"},
    {id: 8,   text :  "Math Operations"},	
    {id: 81,  text :  "Plus Operator. Number of Parameters : Variable"},    
    {id: 82,  text :  "Minus Operator. Number of Parameters : Variable"},     
    {id: 83,  text :  "Multiply Operator. Number of Parameters : Variable"},    
    {id: 84,  text :  "Dvide Operator. Number of Parameters : Variable"},    
    {id: 85,  text :  "Minimum between 2 numeric. Number of Parameters : 2"},    
    {id: 86,  text :  "Maximum between 2 numeric. Number of Parameters : 2"},   	
    {id: 87,  text :  "Set a Value to a Variable"},    
    {id: 9,   text :  "Input Value"},	
    {id: 81,  text :  "Numeric Value can be float or Integer"},    
    {id: 82,  text :  "Boolean returns True or False"},    
    {id: 83,  text :  "String Value. Example \"EURUSD\""},    
    {id: 84,  text :  "Char Value. One Character"},    
    {id: 85,  text :  "Date Value. Format 00/00/0000 : Day/Month/Year"},    
    {id: 86,  text :  "Time Value. Format 00/00/00 : Hour/Minutes/Seconds"},    
    {id: 87,  text :  "Variable"},	
    {id: 10,  text :  "Conditions defined in Project"}	
  ];