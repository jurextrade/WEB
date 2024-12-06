const contextdef = `
    let SignalTab           = [];
    let BSignalTab          = [];
    let TSignalTab          = [];
    let BeforeSignalTab     = [];
    let BeforeSignalTickTab = [];
    let SignalTabValue      = [];
    let SignalTabTime       = [];
    let SignalTabPrice      = [];
    let BeforeSignalTabValue = [];
    let BeforeSignalTabTime = [];
    let BeforeSignalTabPrice = [];
    
    let SignalFilterTab     = [];
    let SignalFilterTabTime = []; // interval in seconds

    let LastHigh            = []; //[NBR_SHIFT][NBR_PERIODS];
    let LastLow             = [];
    let LastOpen            = [];
    let LastClose           = [];
    let PivotPoints         = []; //[9][NBR_PERIODS];
    let PrevPivotPoints     = []; //[9][NBR_PERIODS];

    let TimeOpenBar         = [];

    let LastUpFractals      = [];
    let LastDownFractals    = [];

    let AlertDistance       = [];
    let SignalVisible       = [];

    let Bid                 = -1;   //close current bar
    let Ask                 = -1;
    let Point;
    let Digits;
    let CurrentPeriod;
    let CurrentTime;
    let Symbol;

    let Time                = -1;   //date  current bar   
    let CurrentItem         = -1;   // bar treated by signals
    let CurrentItemIndex    = -1;   // index of this bar in chart
    let Data                = [];
    InitSignals ();

    function Init (symbol, period, data) {
        Symbol          = symbol;
        CurrentPeriod   = period;
        Data            = data;
        Point           = symbol.Point;
        Digits          = symbol.Digits;
        InitIndicators(symbol.SysPoint);
    }
   
    function execute (str) {
        eval(str);
    }
    function addfunction (str) {
        eval(str);
    }

    function SetHigh (value, period) {
        LastHigh[0][period]  = value;
    }
    function SetLow (value, period) {
        LastLow[0][period]   = value;  
    }
    function SetClose (value, period) {
        LastClose[0][period] = value; 
    }
    function SetOpen (value, period) {
        LastOpen[0][period]  = value;
    }
    function GetHigh (period) {
        return LastHigh[0][period];
    }
    function GetLow (period) {
        return LastLow[0][period];  
    }
    function GetClose (period) {
        return LastClose[0][period]; 
    }
    function GetOpen (period) {
        return LastOpen[0][period];
    }

    function SetTime (value, period) {
        TimeOpenBar[period]  = value;
    }
    function GetTime (period) {
        return TimeOpenBar[period];
    }

    function InitIndicators (syspoint) {
        
        for (var x = 0; x < NBR_PERIODS; x++) {
            if (x < P_M15)      AlertDistance[x] = 3  * syspoint;
            else if (x < P_H1)  AlertDistance[x] = 5  * syspoint;
            else if (x < P_H4)  AlertDistance[x] = 10 * syspoint;
            else                AlertDistance[x] = 15 * syspoint;
            
            LastHigh[1][x] = 0;
            LastClose[1][x] = 0;
            LastUpFractals[x] = 0;
            LastDownFractals[x] = 0;
            TimeOpenBar[x] = 0;
        }
        for (var i = 0; i < NBR_SIGNALS; i++) {
            SignalVisible[i] = 1;
        }
    }
    function InitSignals  () {

        for (var i = 0; i < NBR_OBJECTS; i++) {
            SignalTab[i] = new Array();
            BSignalTab[i] = new Array();
            TSignalTab[i] = new Array();
            BeforeSignalTab[i] = new Array();
            BeforeSignalTickTab[i] = new Array();
            SignalTabValue[i] = new Array();
            SignalTabTime[i] = new Array();
            SignalTabPrice[i] = new Array();
            BeforeSignalTabValue[i] = new Array();
            BeforeSignalTabTime[i] = new Array();
            BeforeSignalTabPrice[i] = new Array();
            SignalFilterTab[i] = new Array();
            SignalFilterTabTime[i] = new Array();
            for (var j = 0; j < NBR_SIGNALS; j++) {
                SignalTabValue[i][j] = new Array();
                SignalTabTime[i][j] = new Array();
                SignalTabPrice[i][j] = new Array();
                BeforeSignalTabValue[i][j] = new Array();
                BeforeSignalTabTime[i][j] = new Array();
                BeforeSignalTabPrice[i][j] = new Array();
                SignalFilterTab[i][j] = new Array();
                SignalFilterTabTime[i][j] = new Array();
            }
        }
        for (var i = 0; i < NBR_SHIFT; i++) {
            LastHigh[i] = new Array(); //[NBR_SHIFT][NBR_PERIODS];
            LastLow[i] = new Array();
            LastOpen[i] = new Array();
            LastClose[i] = new Array();
        }
        for (var i = 0; i < 9; i++) {
            PivotPoints[i] = new Array(); //[9][NBR_PERIODS];
            PrevPivotPoints[i] = new Array();
        }
    }
    function SetPreviousSignals (array_objectid, signals) {
        var lobjects = (array_objectid == null ? NBR_OBJECTS : array_objectid.length);
        var lsignals = (signals == null ? NBR_SIGNALS : signals.length);
        var  i, j;

        for (var a = 0; a < lobjects; a++) {
            i = (array_objectid ? array_objectid[a] : a);
            for (var b = 0; b < lsignals; b++) {
                j = (signals ? signals[b] : b);
                BSignalTab[i][j] = SignalTab[i][j] & ~BeforeSignalTab[i][j];
                TSignalTab[i][j] = SignalTab[i][j] & ~BeforeSignalTickTab[i][j];
            }
        }
    }

    function ResetSignals (array_objectid, signals, periods, bartime, first) {
        switch (arguments.length) {
            case 3:
                first = -1;
        }

        CurrentTime = bartime;

        var  i, j , k;
        var lobjects = (array_objectid == null ? NBR_OBJECTS : array_objectid.length);
        var lsignals = (signals == null ? NBR_SIGNALS : signals.length);
        var lperiods = (periods == null ? NBR_PERIODS : periods.length);
    
        for (var a = 0; a < lobjects; a++) {
            i = (array_objectid ? array_objectid[a] : a);
            for (var b = 0; b < lsignals; b++) {
                j = (signals ? signals[b] : b);
                
                for (var c= 0;  c < lperiods; c++) {
                    k = (periods ? periods[c] : c);
                   
                    if (first === 1) {
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
                        
                        if (AndS(i, j, k) !== 0) BeforeSignalTickTab[i][j] |= (1 << k);
                        else BeforeSignalTickTab[i][j] &= ~(1 << k);
                        
                        if (TimeOpenBar[k] !== bartime) {
                            if (AndS(i, j, k) !== 0) BeforeSignalTab[i][j] |= (1 << k);
                            else BeforeSignalTab[i][j] &= ~(1 << k);
                            BeforeSignalTabValue[i][j][k] = SignalTabValue[i][j][k];
                            BeforeSignalTabTime[i][j][k]  = SignalTabTime[i][j][k];
                            BeforeSignalTabPrice[i][j][k] = SignalTabPrice[i][j][k];
                        }
                    }
                }
                SignalTab[i][j] = 0;
            }
        }
    }        
    function ResetSignalFilters (array_objectid) {
        
        var lobjects = (array_objectid == null ? NBR_OBJECTS : array_objectid.length);

        for (var a = 0; a < lobjects; a++) {
            let i = (array_objectid ? array_objectid[a] : a);            
            for (var j = 0; j < NBR_SIGNALS; j++) {
                for (var x = 0; x < NBR_PERIODS; x++) {
                    SignalFilterTab[i][j][x] = 0;
                }
            }
        }
    }
    function MaxV (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = -EMPTY_VALUE;
        if (period !== -1) result = SValue(Object, signaltype, period);
        if (period1 !== -1) result = Math.max(result, SValue(Object, signaltype, period1));
        if (period2 !== -1) result = Math.max(result, SValue(Object, signaltype, period2));
        if (period3 !== -1) result = Math.max(result, SValue(Object, signaltype, period3));
        if (period4 !== -1) result = Math.max(result, SValue(Object, signaltype, period4));
        if (period5 !== -1) result = Math.max(result, SValue(Object, signaltype, period5));
        if (period6 !== -1) result = Math.max(result, SValue(Object, signaltype, period6));
        if (period7 !== -1) result = Math.max(result, SValue(Object, signaltype, period7));
        if (period8 !== -1) result = Math.max(result, SValue(Object, signaltype, period8));
        return result;
    }
    function MinV (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = EMPTY_VALUE;
        if (period !== -1) result = SValue(Object, signaltype, period);
        if (period1 !== -1) result = Math.min(result, SValue(Object, signaltype, period1));
        if (period2 !== -1) result = Math.min(result, SValue(Object, signaltype, period2));
        if (period3 !== -1) result = Math.min(result, SValue(Object, signaltype, period3));
        if (period4 !== -1) result = Math.min(result, SValue(Object, signaltype, period4));
        if (period5 !== -1) result = Math.min(result, SValue(Object, signaltype, period5));
        if (period6 !== -1) result = Math.min(result, SValue(Object, signaltype, period6));
        if (period7 !== -1) result = Math.min(result, SValue(Object, signaltype, period7));
        if (period8 !== -1) result = Math.min(result, SValue(Object, signaltype, period8));
        return result;
    }
    function MaxPV (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = -EMPTY_VALUE;
        if (period !== -1) result = SPValue(Object, signaltype, period);
        if (period1 !== -1) result = Math.max(result, SPValue(Object, signaltype, period1));
        if (period2 !== -1) result = Math.max(result, SPValue(Object, signaltype, period2));
        if (period3 !== -1) result = Math.max(result, SPValue(Object, signaltype, period3));
        if (period4 !== -1) result = Math.max(result, SPValue(Object, signaltype, period4));
        if (period5 !== -1) result = Math.max(result, SPValue(Object, signaltype, period5));
        if (period6 !== -1) result = Math.max(result, SPValue(Object, signaltype, period6));
        if (period7 !== -1) result = Math.max(result, SPValue(Object, signaltype, period7));
        if (period8 !== -1) result = Math.max(result, SPValue(Object, signaltype, period8));
        return result;
    }
    function MinPV (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = EMPTY_VALUE;
        if (period !== -1) result = SPValue(Object, signaltype, period);
        if (period1 !== -1) result = Math.min(result, SPValue(Object, signaltype, period1));
        if (period2 !== -1) result = Math.min(result, SPValue(Object, signaltype, period2));
        if (period3 !== -1) result = Math.min(result, SPValue(Object, signaltype, period3));
        if (period4 !== -1) result = Math.min(result, SPValue(Object, signaltype, period4));
        if (period5 !== -1) result = Math.min(result, SPValue(Object, signaltype, period5));
        if (period6 !== -1) result = Math.min(result, SPValue(Object, signaltype, period6));
        if (period7 !== -1) result = Math.min(result, SPValue(Object, signaltype, period7));
        if (period8 !== -1) result = Math.min(result, SPValue(Object, signaltype, period8));
        return result;
    }
    function AndS_G (Object1, Object2, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object1, signaltype, period) > SValue(Object2, signaltype, period));
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = (SValue(Object1, signaltype, period1) > SValue(Object2, signaltype, period1));
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = (SValue(Object1, signaltype, period2) > SValue(Object2, signaltype, period2));
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = (SValue(Object1, signaltype, period3) > SValue(Object2, signaltype, period3));
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = (SValue(Object1, signaltype, period4) > SValue(Object2, signaltype, period4));
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = (SValue(Object1, signaltype, period5) > SValue(Object2, signaltype, period5));
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = (SValue(Object1, signaltype, period6) > SValue(Object2, signaltype, period6));
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = (SValue(Object1, signaltype, period7) > SValue(Object2, signaltype, period7));
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = (SValue(Object1, signaltype, period8) > SValue(Object2, signaltype, period8));
            if (result) rperiod |= (1 << period8);
        }
        return (result) ? rperiod : 0;
    }
    function AndS_L (Object1, Object2, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object1, signaltype, period) < SValue(Object2, signaltype, period));
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = (SValue(Object1, signaltype, period1) < SValue(Object2, signaltype, period1));
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = (SValue(Object1, signaltype, period2) < SValue(Object2, signaltype, period2));
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = (SValue(Object1, signaltype, period3) < SValue(Object2, signaltype, period3));
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = (SValue(Object1, signaltype, period4) < SValue(Object2, signaltype, period4));
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = (SValue(Object1, signaltype, period5) < SValue(Object2, signaltype, period5));
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = (SValue(Object1, signaltype, period6) < SValue(Object2, signaltype, period6));
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = (SValue(Object1, signaltype, period7) < SValue(Object2, signaltype, period7));
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = (SValue(Object1, signaltype, period8) < SValue(Object2, signaltype, period8));
            if (result) rperiod |= (1 << period8);
        }
        return (result) ? rperiod : 0;
    }
    function AndS_G_AndPS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) > SPValue(Object, signaltype, period));
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = (SValue(Object, signaltype, period1) > SPValue(Object, signaltype, period1));
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = (SValue(Object, signaltype, period2) > SPValue(Object, signaltype, period2));
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = (SValue(Object, signaltype, period3) > SPValue(Object, signaltype, period3));
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = (SValue(Object, signaltype, period4) > SPValue(Object, signaltype, period4));
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = (SValue(Object, signaltype, period5) > SPValue(Object, signaltype, period5));
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = (SValue(Object, signaltype, period6) > SPValue(Object, signaltype, period6));
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = (SValue(Object, signaltype, period7) > SPValue(Object, signaltype, period7));
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = (SValue(Object, signaltype, period8) > SPValue(Object, signaltype, period8));
            if (result) rperiod |= (1 << period8);
        }
        return (result) ? rperiod : 0;
    }
    function AndS_L_AndPS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) < SPValue(Object, signaltype, period));
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = (SValue(Object, signaltype, period1) < SPValue(Object, signaltype, period1));
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = (SValue(Object, signaltype, period2) < SPValue(Object, signaltype, period2));
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = (SValue(Object, signaltype, period3) < SPValue(Object, signaltype, period3));
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = (SValue(Object, signaltype, period4) < SPValue(Object, signaltype, period4));
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = (SValue(Object, signaltype, period5) < SPValue(Object, signaltype, period5));
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = (SValue(Object, signaltype, period6) < SPValue(Object, signaltype, period6));
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = (SValue(Object, signaltype, period7) < SPValue(Object, signaltype, period7));
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = (SValue(Object, signaltype, period7) < SPValue(Object, signaltype, period8));
            if (result) rperiod |= (1 << period8);
        }
        return (result) ? rperiod : 0;
    }
    function AndV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) === value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SValue(Object, signaltype, period1) === value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SValue(Object, signaltype, period2) === value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SValue(Object, signaltype, period3) === value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SValue(Object, signaltype, period4) === value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SValue(Object, signaltype, period5) === value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SValue(Object, signaltype, period6) === value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SValue(Object, signaltype, period7) === value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SValue(Object, signaltype, period8) === value);
            if (result) rperiod |= (1 << period8);
        }
        return (result) ? rperiod : 0;
    }
    function AndV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) < value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SValue(Object, signaltype, period1) < value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SValue(Object, signaltype, period2) < value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SValue(Object, signaltype, period3) < value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SValue(Object, signaltype, period4) < value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SValue(Object, signaltype, period5) < value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SValue(Object, signaltype, period6) < value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SValue(Object, signaltype, period7) < value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SValue(Object, signaltype, period8) < value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) <= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SValue(Object, signaltype, period1) <= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SValue(Object, signaltype, period2) <= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SValue(Object, signaltype, period3) <= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SValue(Object, signaltype, period4) <= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SValue(Object, signaltype, period5) <= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SValue(Object, signaltype, period6) <= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SValue(Object, signaltype, period7) <= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SValue(Object, signaltype, period8) <= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) > value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SValue(Object, signaltype, period1) > value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SValue(Object, signaltype, period2) > value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SValue(Object, signaltype, period3) > value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SValue(Object, signaltype, period4) > value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SValue(Object, signaltype, period5) > value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SValue(Object, signaltype, period6) > value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SValue(Object, signaltype, period7) > value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SValue(Object, signaltype, period8) > value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) >= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SValue(Object, signaltype, period1) >= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SValue(Object, signaltype, period2) >= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SValue(Object, signaltype, period3) >= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SValue(Object, signaltype, period4) >= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SValue(Object, signaltype, period5) >= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SValue(Object, signaltype, period6) >= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SValue(Object, signaltype, period7) >= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SValue(Object, signaltype, period8) >= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndPV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) === value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SPValue(Object, signaltype, period1) === value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SPValue(Object, signaltype, period2) === value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SPValue(Object, signaltype, period3) === value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SPValue(Object, signaltype, period4) === value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SPValue(Object, signaltype, period5) === value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SPValue(Object, signaltype, period6) === value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SPValue(Object, signaltype, period7) === value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SPValue(Object, signaltype, period8) === value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndPV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) < value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SPValue(Object, signaltype, period1) < value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SPValue(Object, signaltype, period2) < value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SPValue(Object, signaltype, period3) < value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SPValue(Object, signaltype, period4) < value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SPValue(Object, signaltype, period5) < value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SPValue(Object, signaltype, period6) < value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SPValue(Object, signaltype, period7) < value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SPValue(Object, signaltype, period8) < value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndPV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) <= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SPValue(Object, signaltype, period1) <= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SPValue(Object, signaltype, period2) <= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SPValue(Object, signaltype, period3) <= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SPValue(Object, signaltype, period4) <= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SPValue(Object, signaltype, period5) <= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SPValue(Object, signaltype, period6) <= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SPValue(Object, signaltype, period7) <= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SPValue(Object, signaltype, period8) <= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndPV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) > value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SPValue(Object, signaltype, period1) > value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SPValue(Object, signaltype, period2) > value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SPValue(Object, signaltype, period3) > value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SPValue(Object, signaltype, period4) > value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SPValue(Object, signaltype, period5) > value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SPValue(Object, signaltype, period6) > value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SPValue(Object, signaltype, period7) > value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SPValue(Object, signaltype, period8) > value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndPV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 1;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) >= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result && (SPValue(Object, signaltype, period1) >= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result && (SPValue(Object, signaltype, period2) >= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result && (SPValue(Object, signaltype, period3) >= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result && (SPValue(Object, signaltype, period4) >= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result && (SPValue(Object, signaltype, period5) >= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result && (SPValue(Object, signaltype, period6) >= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result && (SPValue(Object, signaltype, period7) >= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result && (SPValue(Object, signaltype, period8) >= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) === value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SValue(Object, signaltype, period1) === value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SValue(Object, signaltype, period2) === value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SValue(Object, signaltype, period3) === value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SValue(Object, signaltype, period4) === value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SValue(Object, signaltype, period5) === value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SValue(Object, signaltype, period6) === value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SValue(Object, signaltype, period7) === value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SValue(Object, signaltype, period8) === value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) < value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SValue(Object, signaltype, period1) < value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SValue(Object, signaltype, period2) < value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SValue(Object, signaltype, period3) < value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SValue(Object, signaltype, period4) < value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SValue(Object, signaltype, period5) < value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SValue(Object, signaltype, period6) < value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SValue(Object, signaltype, period7) < value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SValue(Object, signaltype, period8) < value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) <= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SValue(Object, signaltype, period1) <= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SValue(Object, signaltype, period2) <= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SValue(Object, signaltype, period3) <= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SValue(Object, signaltype, period4) <= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SValue(Object, signaltype, period5) <= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SValue(Object, signaltype, period6) <= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SValue(Object, signaltype, period7) <= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SValue(Object, signaltype, period8) <= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) > value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SValue(Object, signaltype, period1) > value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SValue(Object, signaltype, period2) > value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SValue(Object, signaltype, period3) > value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SValue(Object, signaltype, period4) > value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SValue(Object, signaltype, period5) > value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SValue(Object, signaltype, period6) > value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SValue(Object, signaltype, period7) > value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SValue(Object, signaltype, period8) > value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SValue(Object, signaltype, period) >= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SValue(Object, signaltype, period1) >= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SValue(Object, signaltype, period2) >= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SValue(Object, signaltype, period3) >= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SValue(Object, signaltype, period4) >= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SValue(Object, signaltype, period5) >= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SValue(Object, signaltype, period6) >= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SValue(Object, signaltype, period7) >= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SValue(Object, signaltype, period8) >= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrPV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) === value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SPValue(Object, signaltype, period1) === value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SPValue(Object, signaltype, period2) === value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SPValue(Object, signaltype, period3) === value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SPValue(Object, signaltype, period4) === value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SPValue(Object, signaltype, period5) === value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SPValue(Object, signaltype, period6) === value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SPValue(Object, signaltype, period7) === value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SPValue(Object, signaltype, period8) === value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrPV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) < value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SPValue(Object, signaltype, period1) < value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SPValue(Object, signaltype, period2) < value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SPValue(Object, signaltype, period3) < value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SPValue(Object, signaltype, period4) < value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SPValue(Object, signaltype, period5) < value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SPValue(Object, signaltype, period6) < value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SPValue(Object, signaltype, period7) < value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SPValue(Object, signaltype, period8) < value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrPV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) <= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SPValue(Object, signaltype, period1) <= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SPValue(Object, signaltype, period2) <= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SPValue(Object, signaltype, period3) <= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SPValue(Object, signaltype, period4) <= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SPValue(Object, signaltype, period5) <= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SPValue(Object, signaltype, period6) <= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SPValue(Object, signaltype, period7) <= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SPValue(Object, signaltype, period8) <= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrPV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) > value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SPValue(Object, signaltype, period1) > value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SPValue(Object, signaltype, period2) > value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SPValue(Object, signaltype, period3) > value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SPValue(Object, signaltype, period4) > value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SPValue(Object, signaltype, period5) > value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SPValue(Object, signaltype, period6) > value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SPValue(Object, signaltype, period7) > value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SPValue(Object, signaltype, period8) > value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function OrPV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        let result = 0;
        let rperiod = 0;
        if (period !== -1) {
            result = (SPValue(Object, signaltype, period) >= value);
            if (result) rperiod |= (1 << period);
        }
        if (period1 !== -1) {
            result = result || (SPValue(Object, signaltype, period1) >= value);
            if (result) rperiod |= (1 << period1);
        }
        if (period2 !== -1) {
            result = result || (SPValue(Object, signaltype, period2) >= value);
            if (result) rperiod |= (1 << period2);
        }
        if (period3 !== -1) {
            result = result || (SPValue(Object, signaltype, period3) >= value);
            if (result) rperiod |= (1 << period3);
        }
        if (period4 !== -1) {
            result = result || (SPValue(Object, signaltype, period4) >= value);
            if (result) rperiod |= (1 << period4);
        }
        if (period5 !== -1) {
            result = result || (SPValue(Object, signaltype, period5) >= value);
            if (result) rperiod |= (1 << period5);
        }
        if (period6 !== -1) {
            result = result || (SPValue(Object, signaltype, period6) >= value);
            if (result) rperiod |= (1 << period6);
        }
        if (period7 !== -1) {
            result = result || (SPValue(Object, signaltype, period7) >= value);
            if (result) rperiod |= (1 << period7);
        }
        if (period8 !== -1) {
            result = result || (SPValue(Object, signaltype, period8) >= value);
            if (result) rperiod |= (1 << period8);
        }
        if (result) return rperiod; else return 0;
    }
    function AndBV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndBV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndBV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndBV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndBV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrBV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrBV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrBV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrBV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrBV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    //TICK
    function AndTV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndTV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndTV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndTV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AndTV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return AndV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !AndPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrTV_Eq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_Eq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrTV_LEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_LEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrTV_L (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_L(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrTV_G (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_G(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function OrTV_GEq (Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 4:
                period1 = -1;
            case 5:
                period2 = -1;
            case 6:
                period3 = -1;
            case 7:
                period4 = -1;
            case 8:
                period5 = -1;
            case 9:
                period6 = -1;
            case 10:
                period7 = -1;
            case 11:
                period8 = -1;
        }
        return OrV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8) && !OrPV_GEq(Object, signaltype, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AngleAbove (Object, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        return AndV_G(Object, S_ANGLE, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AngleBelow (Object, value, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        return AndV_L(Object, S_ANGLE, value, period, period1, period2, period3, period4, period5, period6, period7, period8);
    }
    function AngleDivergence (Object, period) {
        return (AndS(Object, S_UP, period) && AngleBelow(Object, 0, period)) || (AndS(Object, S_DOWN, period) && AngleAbove(Object, 0, period));
    }
    function AndS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        if (period !== -1) result |= (1 << period);
        if (period1 !== -1) result |= (1 << period1);
        if (period2 !== -1) result |= (1 << period2);
        if (period3 !== -1) result |= (1 << period3);
        if (period4 !== -1) result |= (1 << period4);
        if (period5 !== -1) result |= (1 << period5);
        if (period6 !== -1) result |= (1 << period6);
        if (period7 !== -1) result |= (1 << period7);
        if (period8 !== -1) result |= (1 << period8);
        return (SignalTab[Object][signaltype] & result) === result ? SignalTab[Object][signaltype] & result : 0;
    }
    function AndPS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        if (period !== -1) result |= (1 << period);
        if (period1 !== -1) result |= (1 << period1);
        if (period2 !== -1) result |= (1 << period2);
        if (period3 !== -1) result |= (1 << period3);
        if (period4 !== -1) result |= (1 << period4);
        if (period5 !== -1) result |= (1 << period5);
        if (period6 !== -1) result |= (1 << period6);
        if (period7 !== -1) result |= (1 << period7);
        if (period8 !== -1) result |= (1 << period8);
        return (BeforeSignalTab[Object][signaltype] & result) === result ? BeforeSignalTab[Object][signaltype] & result : 0;
    }
    function AndPTS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        if (period !== -1) result |= (1 << period);
        if (period1 !== -1) result |= (1 << period1);
        if (period2 !== -1) result |= (1 << period2);
        if (period3 !== -1) result |= (1 << period3);
        if (period4 !== -1) result |= (1 << period4);
        if (period5 !== -1) result |= (1 << period5);
        if (period6 !== -1) result |= (1 << period6);
        if (period7 !== -1) result |= (1 << period7);
        if (period8 !== -1) result |= (1 << period8);
        return (BeforeSignalTickTab[Object][signaltype] & result) === result ? BeforeSignalTickTab[Object][signaltype] & result : 0;
    }
    function OrS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        if (period !== -1) result |= (1 << period);
        if (period1 !== -1) result |= (1 << period1);
        if (period2 !== -1) result |= (1 << period2);
        if (period3 !== -1) result |= (1 << period3);
        if (period4 !== -1) result |= (1 << period4);
        if (period5 !== -1) result |= (1 << period5);
        if (period6 !== -1) result |= (1 << period6);
        if (period7 !== -1) result |= (1 << period7);
        if (period8 !== -1) result |= (1 << period8);
        return (SignalTab[Object][signaltype] & result) !== 0 ? SignalTab[Object][signaltype] & result : 0;
    }
    function OrPS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        if (period !== -1) result |= (1 << period);
        if (period1 !== -1) result |= (1 << period1);
        if (period2 !== -1) result |= (1 << period2);
        if (period3 !== -1) result |= (1 << period3);
        if (period4 !== -1) result |= (1 << period4);
        if (period5 !== -1) result |= (1 << period5);
        if (period6 !== -1) result |= (1 << period6);
        if (period7 !== -1) result |= (1 << period7);
        if (period8 !== -1) result |= (1 << period8);
        return (BeforeSignalTab[Object][signaltype] & result) !== 0 ? BeforeSignalTab[Object][signaltype] & result : 0;
    }
    function OrPTS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = 0;
        if (period !== -1) result |= (1 << period);
        if (period1 !== -1) result |= (1 << period1);
        if (period2 !== -1) result |= (1 << period2);
        if (period3 !== -1) result |= (1 << period3);
        if (period4 !== -1) result |= (1 << period4);
        if (period5 !== -1) result |= (1 << period5);
        if (period6 !== -1) result |= (1 << period6);
        if (period7 !== -1) result |= (1 << period7);
        if (period8 !== -1) result |= (1 << period8);
        return (BeforeSignalTickTab[Object][signaltype] & result) !== 0 ? BeforeSignalTickTab[Object][signaltype] & result : 0;
    }
    function AndTS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = AndS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
        return (result && !AndPTS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0;
    }
    function AndBS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = AndS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
        return (result && !AndPS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0;
    }
    function OrTS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = OrS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
        return (result && !OrPTS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0;
    }
    function OrBS (Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8) {
        switch (arguments.length) {
            case 3:
                period1 = -1;
            case 4:
                period2 = -1;
            case 5:
                period3 = -1;
            case 6:
                period4 = -1;
            case 7:
                period5 = -1;
            case 8:
                period6 = -1;
            case 9:
                period7 = -1;
            case 10:
                period8 = -1;
        }
        let result = OrS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8);
        return (result && !OrPS(Object, signaltype, period, period1, period2, period3, period4, period5, period6, period7, period8)) ? result : 0;
    }
    function All (Object, signaltype, period1, period2, period3, period4, period5, period6) {
        switch (arguments.length) {
            case 2:
                period1 = -1;
            case 3:
                period2 = -1;
            case 4:
                period3 = -1;
            case 5:
                period4 = -1;
            case 6:
                period5 = -1;
            case 7:
                period6 = -1;
        }
        let result = (SignalTab[Object][signaltype] % 256);
        // month
        result = (result % 128);
        // week
        result = (result % 64);
        // day
        if (period1 !== -1) result = (result % period1);
        if (period2 !== -1) result = (result % period2);
        if (period3 !== -1) result = (result % period3);
        if (period4 !== -1) result = (result % period4);
        if (period5 !== -1) result = (result % period5);
        if (period6 !== -1) result = (result % period6);
        return result;
    }
    function All_s (Object, signaltype, period1, period2, period3) {
        switch (arguments.length) {
            case 2:
                period1 = -1;
            case 3:
                period2 = -1;
            case 4:
                period3 = -1;
        }
        let result = (SignalTab[Object][signaltype] % 256);
        // month
        result = (result % 128);
        result = (result % 64);
        result = (result % 32);
        result = (result % 16);
        result = (result % 8);
        if (period1 !== -1) result = (result % period1);
        if (period2 !== -1) result = (result % period2);
        if (period3 !== -1) result = (result % period3);
        return result;
    }
    function SETSIGNAL (shift, Object, signaltype, period, signal, value) {
        switch (arguments.length) {
            case 5:
                value = -1;
        }
        if (shift === 0) Set_Signal(Object, signaltype, period, signal, value);
        else Set_Previous_Signal(Object, signaltype, period, signal, value);
    }
    function Set_Signal (Object, signaltype, period, signal, value) {
        switch (arguments.length) {
            case 4:
                value = -1;
        }
        if (signal === P_SIGNAL) {
            SignalTab[Object][signaltype] |= (1 << period);
            if (!AndPTS(Object, signaltype, period)) {
                Set_Signal_Time(Object, signaltype, period,  Time);
                Set_Signal_Price(Object, signaltype, period, Bid);
            }
        } else {
            SignalTab[Object][signaltype] &= ~(1 << period);
            if (AndPTS(Object, signaltype, period)) {
                Set_Signal_Time(Object, signaltype, period, -1);
                Set_Signal_Price(Object, signaltype, period, -1);
            }
        }
        if (value !== -1) Set_Signal_Value(Object, signaltype, period, value);
    }
    function Get_Signal (Object, signaltype, period) {
        return SignalTab[Object][signaltype] & (1 << period);
    }
    function Set_Previous_Signal (Object, signaltype, period, signal, value) {
        switch (arguments.length) {
            case 4:
                value = -1;
        }
        if (signal === P_SIGNAL) BeforeSignalTab[Object][signaltype] |= (1 << period);
        else BeforeSignalTab[Object][signaltype] &= ~(1 << period);
        if (value !== -1) Set_Previous_Signal_Value(Object, signaltype, period, value);
    }
    function Get_Previous_Signal (Object, signaltype, period) {
        return BeforeSignalTab[Object][signaltype] & (1 << period);
    }
    function Set_Signal_Value (Object, signaltype, period, Value) {
        SignalTabValue[Object][signaltype][period] = Value;
    }
    function Set_Signal_Time (Object, signaltype, period, Value) {
        SignalTabTime[Object][signaltype][period] = Value;
    }
    function Set_Signal_Price (Object, signaltype, period, Value) {
        SignalTabPrice[Object][signaltype][period] = Value;
    }
    function Set_Previous_Signal_Value (Object, signaltype, period, Value) {
        BeforeSignalTabValue[Object][signaltype][period] = Value;
    }
    function SValue (Object, signaltype, period) {
        return SignalTabValue[Object][signaltype][period];
    }
    function SPValue (Object, signaltype, period) {
        return BeforeSignalTabValue[Object][signaltype][period];
    }
    function STime (Object, signaltype, period) {
        return SignalTabTime[Object][signaltype][period];
    }
    function SPTime (Object, signaltype, period) {
        return BeforeSignalTabTime[Object][signaltype][period];
    }
    function SPrice (Object, signaltype, period) {
        return SignalTabPrice[Object][signaltype][period];
    }
    function SPPrice (Object, signaltype, period) {
        return BeforeSignalTabPrice[Object][signaltype][period];
    }
    function SetSignalFilter (add, Object, signaltype, periode, interval) {
        switch (arguments.length) {
            case 4:
                interval = -1;
        }
        if (add === -1) {
            ResetSignalFilters();
            return;
        }
        if (add === -2) {
            ResetSignalFilters();
            add = 1;
        }
        if (periode === -1) {
            for (var x = 0; x < NBR_PERIODS; x++) {
                if (signaltype === -1)
                    for (var j = 0; j < NBR_SIGNALS; j++) {
                        SignalFilterTab[Object][j][x] = add;
                        if (interval === -1) SignalFilterTabTime[Object][j][x] = 5 * 60;
                        else SignalFilterTabTime[Object][j][x] = interval;
                    } else {
                        SignalFilterTab[Object][signaltype][x] = add;
                        if (interval === -1) SignalFilterTabTime[Object][signaltype][x] = 5 * 60;
                        else SignalFilterTabTime[Object][signaltype][x] = interval;
                    }
            }
        } else {
            if (signaltype === -1)
                for (j = 0; j < NBR_SIGNALS; j++) {
                    SignalFilterTab[Object][j][periode] = add;
                    if (interval === -1) SignalFilterTabTime[Object][j][periode] = 5 * 60;
                    else SignalFilterTabTime[Object][j][periode] = interval;
                } else {
                    SignalFilterTab[Object][signaltype][periode] = add;
                    if (interval === -1) SignalFilterTabTime[Object][signaltype][periode] = 5 * 60;
                    else SignalFilterTabTime[Object][signaltype][periode] = interval;
                }
        }
    }
    function GetSignalFilter (Object, signaltype, period) {
        return SignalFilterTab[Object][signaltype][period];
    }
    //---------------------------------------------------- INDICATORS SIGNALS TREATMENT --------------------------------------------------  
    function FindNothing (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }
        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }

        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;
    }
    //---------------------------------------------------- RETURN CURRENT ITEM --------------------------------------------------  
    function ReturnItemFromShift (data, currentitemindex, shift) {
        if (shift == 1) {
            if (currentitemindex - 1 < 0) {
                return null;
            }
            currentitemindex = currentitemindex - 1;
        }
        let currentitem          = data[currentitemindex];

        Time                = currentitem.date.getTime() / 1000;                  //date  current bar   
        Bid                 = currentitem.open;                                   //close current bar
        CurrentItemIndex    = currentitemindex;   
        CurrentItem         = currentitem;     
        return currentitem;        
    }
     //---------------------------------------------------- NOTHING --------------------------------------------------  
     function FindNothing (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }
        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }


    }
    //---------------------------------------------------- STOCHASTIC --------------------------------------------------  
    function FindStochastic (x, object, data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }

        var currentitem     =  CurrentItem;        
        var currentitemidx  =  CurrentItemIndex;

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;

        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];


        var trend;
        var ptrend;
        var pptrend;
        if (object.mode == 0) { //Mode Main
            trend       = currentitem[object.Name + ".D"];
            ptrend      = previousitem[object.Name + ".D"];
            pptrend     = ppreviousitem[object.Name + ".D"];
        } else { //Mode Signal
            trend       = currentitem[object.Name + ".K"];
            ptrend      = previousitem[object.Name + ".K"];
            pptrend     = ppreviousitem[object.Name + ".K"];
        }
        if (trend == undefined || ptrend == undefined || pptrend == undefined) return;
        if (trend > ptrend) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);
            if (ptrend <= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else
        if (trend < ptrend) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);
            if (ptrend >= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else {
            if (pptrend !== ptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
        }
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
        CheckLevels(x, object, trend, ptrend, shift);
    }
    //---------------------------------------------------- MACD --------------------------------------------------  
    function  FindMACD (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        var currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        


        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;

        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        var trend;
        var ptrend;
        var pptrend;
        if (object.Mode == 0) { //Mode Main
            trend       = currentitem[object.Name + ".macd"];
            ptrend      = previousitem[object.Name + ".macd"];
            pptrend     = ppreviousitem[object.Name + ".macd"];
        } else { //Mode Signal
            trend       = currentitem[object.Name + ".signal"];
            ptrend      = previousitem[object.Name + ".signal"];
            pptrend     = ppreviousitem[object.Name + ".signal"];
        }
        if (trend == undefined || ptrend == undefined || pptrend == undefined) return;
        if (trend > ptrend) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);
            if (ptrend <= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else
        if (trend < ptrend) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);
            if (ptrend >= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else {
            if (pptrend !== ptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
        }
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
        CheckLevels(x, object, trend, ptrend, shift);
    }
    //---------------------------------------------------- STOCHASTIC --------------------------------------------------  
    function SimpleSeperateAlgo (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        


        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        
        var trend       = currentitem[object.Name];
        var ptrend      = previousitem[object.Name];
        var pptrend     = ppreviousitem[object.Name];

        if (trend == undefined || ptrend == undefined || pptrend == undefined) return;
        if (trend > ptrend) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);
            if (ptrend <= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else
        if (trend < ptrend) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);
            if (ptrend >= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else {
            if (pptrend !== ptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
        }
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
        CheckLevels(x, object, trend, ptrend, shift);
    }
    function CheckLevels (x, object, trend, ptrend, shift) {
        var ObjectId = +object.Id;


        if (object.Level[DOWNLEVEL1][x] !== EMPTY_VALUE) {
            if (trend < object.Level[DOWNLEVEL1][x])
                if (object.LevelType === OVERBOUGHTOVERSOLD_LEVEL) SETSIGNAL(shift, ObjectId, S_EXT_OVERSOLD, x, P_SIGNAL);
                else SETSIGNAL(shift, ObjectId, S_VERYWEAK, x, P_SIGNAL);
        }
        if (object.Level[UPLEVEL1][x] !== EMPTY_VALUE) {
            if (trend > object.Level[UPLEVEL1][x])
                if (object.LevelType === OVERBOUGHTOVERSOLD_LEVEL) SETSIGNAL(shift, ObjectId, S_EXT_OVERBOUGHT, x, P_SIGNAL);
                else SETSIGNAL(shift, ObjectId, S_VERYSTRONG, x, P_SIGNAL);
        }
        if (object.Level[DOWNLEVEL][x] !== EMPTY_VALUE) {
            if (trend < object.Level[DOWNLEVEL][x])
                if (object.LevelType === OVERBOUGHTOVERSOLD_LEVEL) SETSIGNAL(shift, ObjectId, S_OVERSOLD, x, P_SIGNAL);
                else SETSIGNAL(shift, ObjectId, S_WEAK, x, P_SIGNAL);
        }
        if (object.Level[UPLEVEL][x] !== EMPTY_VALUE) {
            if (trend > object.Level[UPLEVEL][x])
                if (object.LevelType === OVERBOUGHTOVERSOLD_LEVEL) SETSIGNAL(shift, ObjectId, S_OVERBOUGHT, x, P_SIGNAL);
                else SETSIGNAL(shift, ObjectId, S_STRONG, x, P_SIGNAL);
        }
        if (object.Level[DOWNLEVEL][x] !== EMPTY_VALUE && object.Level[UPLEVEL][x] !== EMPTY_VALUE) {
            if (trend >= object.Level[DOWNLEVEL][x] && trend <= object.Level[UPLEVEL][x]) {
                if (object.LevelType === OVERBOUGHTOVERSOLD_LEVEL) SETSIGNAL(shift, ObjectId, S_RANGE, x, P_SIGNAL);
                else SETSIGNAL(shift, ObjectId, S_NEUTRAL, x, P_SIGNAL);
            }
        }
        if (object.Level[MIDLEVEL][x] !== EMPTY_VALUE) {
            if (trend < object.Level[MIDLEVEL][x]) SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
            else if (trend > object.Level[MIDLEVEL][x]) SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
            else SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL);
            if (ptrend < object.Level[MIDLEVEL][x] && trend > object.Level[MIDLEVEL][x]) SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL);
            if (ptrend > object.Level[MIDLEVEL][x] && trend < object.Level[MIDLEVEL][x]) SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL);
        }
    }
    //---------------------------------------------------- BOLLINGER --------------------------------------------------  
    function FindBB (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        
        
        
        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        var trend;
        var ptrend;
        var pptrend;
        var mode = "";
        if (object.Mode == 0) { //Mode Main
            mode = ".middle";
        } else 
        if (object.Mode == 1) { //Mode Upper
            mode = ".top";
        } else
        if (object.Mode == 2) { //Mode Lower
            mode = ".bottom";
        }
        trend   = currentitem[object.Name + mode];
        ptrend  = previousitem[object.Name + mode];
        pptrend = ppreviousitem[object.Name + mode];


        if (trend == undefined || ptrend == undefined || pptrend == undefined) return;
        if (currentitemidx - (2 * AngleShift) >= 0) {
            var angleshift = data[currentitemidx - AngleShift];
            var pangleshift = data[currentitemidx - (2 * AngleShift)];

            var angletrend  = angleshift[object.Name + mode];
            var pangletrend = pangleshift[object.Name + mode];
            
            if (angletrend == undefined || pangletrend == undefined) return;
            var dFactor = 3.14159 / 180.0;
            var mFactor = 10000.0;
            var ShiftDif = AngleShift;
            mFactor /= ShiftDif;
            SETSIGNAL(shift, ObjectId, S_ANGLE, x, P_SIGNAL, Math.atan(mFactor * (trend - angletrend)) / dFactor);
            SETSIGNAL(shift, ObjectId, S_PANGLE, x, P_SIGNAL, Math.atan(mFactor * (angletrend - pangletrend)) / dFactor);
        }
        if (trend > ptrend) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);
            if (ptrend <= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else if (trend < ptrend) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);
            if (ptrend >= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else {
            if (pptrend !== ptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
        }
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
        SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, currentitem.close - trend);
        if (currentitem.open < trend && currentitem.high > trend) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, trend);
        }
        if (currentitem.open > trend && currentitem.low < trend) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, trend);
        }
        if (Upper(currentitem.close, trend, 0)) {
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL, trend);
            if (Math.abs(currentitem.close - trend) < AlertDistance[x]) {
                SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, currentitem.close - trend);
            }
        } else
        if (Lower(currentitem.close, trend, 0)) {
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL, trend);
            if (Math.abs(currentitem.close - trend) < AlertDistance[x]) {
                SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, trend - currentitem.close);
            }
        } else {
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL, currentitem.close);
        }
    }
    //---------------------------------------------------- MA --------------------------------------------------  
    function MovingAverageAlgo (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        
        
      
        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];

        var trend   = currentitem[object.Name];
        var ptrend  = previousitem[object.Name];
        var pptrend = ppreviousitem[object.Name];

        if (trend == undefined || ptrend == undefined || pptrend == undefined) return;
        if (currentitemidx - (2 * AngleShift) >= 0) {
            var angleshift = data[currentitemidx - AngleShift];
            var pangleshift = data[currentitemidx - (2 * AngleShift)];
        
            var angletrend  = angleshift[object.Name];
            var pangletrend = pangleshift[object.Name];
        
            if (angletrend == undefined || pangletrend == undefined) return;
            var dFactor = 3.14159 / 180.0;
            var mFactor = 10000.0;
            var ShiftDif = AngleShift;
            mFactor /= ShiftDif;
            SETSIGNAL(shift, ObjectId, S_ANGLE, x, P_SIGNAL, Math.atan(mFactor * (trend - angletrend)) / dFactor);
            SETSIGNAL(shift, ObjectId, S_PANGLE, x, P_SIGNAL, Math.atan(mFactor * (angletrend - pangletrend)) / dFactor);
        }
        if (trend > ptrend) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, trend);
            if (ptrend <= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else if (trend < ptrend) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, trend);
            if (ptrend >= pptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
        } else {
            if (pptrend !== ptrend) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, ptrend);
            }
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, trend);
        }
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, trend);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, ptrend);
        SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, currentitem.close - trend);
        if (currentitem.open < trend && currentitem.high > trend) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, trend);
        }
        if (currentitem.open > trend && currentitem.low < trend) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, trend);
        }
        if (Upper(currentitem.close, trend, 0)) {
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL, trend);
            if (Math.abs(currentitem.close - trend) < AlertDistance[x]) {
                SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, currentitem.close - trend);
            }
        } else
        if (Lower(currentitem.close, trend, 0)) {
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL, trend);
            if (Math.abs(currentitem.close - trend) < AlertDistance[x]) {
                SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, trend - currentitem.close);
            }
        } else {
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL, currentitem.close);
        }
    }
    //---------------------------------------------------- SAR --------------------------------------------------  
    function SARAlgo (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        var currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        
        
      
        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var price   = currentitem[object.Name];
        var pprice  = previousitem[object.Name];
        
        if (price == undefined || pprice == undefined) return;
        
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, price);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, pprice);
        
        if (price < currentitem.close) {
            if (pprice > previousitem.close) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, currentitem.date.getTime() / 1000);
            }
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
        } else {
            if (pprice < previousitem.close) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, currentitem.date.getTime() / 1000);
            }
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
        }
        var NbrBars = 0;
        var i = currentitemidx;
        if (price < currentitem.close) {
            while (data[i] && i >= 0 && (data[i][object.Name] < data[i].close)) {
                NbrBars += 1;
                i--;
            }
        } else {
            while (data[i] && i >= 0 && (data[i][object.Name] > data[i].close)) {
                NbrBars += 1;
                i--;
            }
        }
        SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, currentitem.close - price);
        SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        return price;
    }
    //---------------------------------------------------- VOLUME -------------------------------------------------- 
    function FindVolume (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0) return;        
        var previousitem = data[currentitemidx - 1];

        var volume = currentitem.volume;
        var pvolume = previousitem.volume;
        SETSIGNAL(shift, VOLUME, S_CURRENT, x, P_SIGNAL, volume);
        SETSIGNAL(shift, VOLUME, S_PREVIOUS, x, P_SIGNAL, pvolume);

        if (volume > pvolume) {
            SETSIGNAL(shift, VOLUME, S_UP, x, P_SIGNAL, volume - pvolume);
            SETSIGNAL(shift, VOLUME, S_BULL, x, P_SIGNAL, volume);
        } else
        if (volume < pvolume) {
            SETSIGNAL(shift, VOLUME, S_DOWN, x, P_SIGNAL, pvolume - volume);
            SETSIGNAL(shift, VOLUME, S_BEAR, x, P_SIGNAL, volume);
        } else SETSIGNAL(shift, VOLUME, S_SIDEWAY, x, P_SIGNAL, 0);
    }
    //---------------------------------------------------- BAR -------------------------------------------------- 
    function FindBar (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0 || currentitemidx - 3 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        var pppreviousitem = data[currentitemidx - 3];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined || pppreviousitem == undefined) return;
        
        var Point = SymbolPoint (numDecimals(currentitem.open)); 
        
        var O = currentitem.open;
        var H = currentitem.high;
        var L = currentitem.low;
        var C = currentitem.close;
        
        
        
        
        var O1 = previousitem.open;
        var H1 = previousitem.high;
        var L1 = previousitem.low;
        var C1 = previousitem.close;
        var O2 = ppreviousitem.open;
        var H2 = ppreviousitem.high;
        var L2 = ppreviousitem.low;
        var C2 = ppreviousitem.close;
        var O3 = pppreviousitem.open;    
        var H3 = pppreviousitem.high;
        var L3 = pppreviousitem.low;
        var C3 = pppreviousitem.close;
        
        var CL = 0;
        var CLmin = 0;
        var CL1 = 0;
        var CL2 = 0;
        var BL = 0;
        var BLa = 0;
        var BL90 = 0;
        var BL1 = 0;
        var BL2 = 0;
        var UW = 0;
        var UWa = 0;
        var UW1 = 0;
        var UW2 = 0;
        var LW = 0;
        var LWa = 0;
        var LW1 = 0;
        var LW2 = 0;
        var BodyHigh = 0;
        var BodyLow = 0;
        var Doji_Star_Ratio = 0;
        var Doji_MinLength = 0;
        var Star_MinLength = 0;
        var Pointer_Offset = 0; // The offset value for the arrow to be located off the candle high or low point.
        var High_Offset = 0; // The offset value added to the high arrow pointer for correct plotting of the pattern label.
        var CumOffset = 0; // The counter value to be added to as more candle types are met.
        var CloseOpenShift = 3;
        var Star_Body_Length = 5;
        var Piercing_Line_Ratio = 0;
        var Piercing_Candle_Length = 0;
        var Engulfing_Length = 0;
        var Candle_WickBody_Percent =  0.9;
        var CandleLength = 0;
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
        BL = O - C;
        UW = H - BodyHigh;
        LW = BodyLow - L;
        BLa = Math.abs(BL);
        BL90 = BLa * Candle_WickBody_Percent;
        
        if (CL === 0) CL += Point;
        if (CL2 === 0) CL2 += Point;
        if (CL1 === 0) CL1 += Point;
        
        
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, C - O);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, C1 - O1);

        Set_Signal_Time(ObjectId, S_CURRENT, x, currentitem.date.getTime() / 1000); // A CORRIGER
        Set_Signal_Price(ObjectId, S_CURRENT, x, O);
        /*

            if (shift === 0 && TimeOpenBar[x] !== 0 && TimeOpenBar[x] !== Time)

                SETSIGNAL(shift, BAR, S_CHANGED, x, P_SIGNAL);

        */
        var NbrBars = 0;
        var i = currentitemidx;
        if (C > O) {
            if (C1 < O1) {
                SETSIGNAL(shift, ObjectId, S_REVERSE_UP, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].close > data[i].open)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else 
        if (C < O) {
            if (C1 >= O1) {
                SETSIGNAL(shift, ObjectId, S_REVERSE_DOWN, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].close < data[i].open)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else {
            while (data[i] && i > 0 && (data[i].close === data[i].open)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);
        }
        // Check for Doji
        if (C === O) {
            SETSIGNAL(shift, ObjectId, S_DOJI, x, P_SIGNAL);
        }
        // Bearish Patterns
        if (C3 > O3 && C2 >= O2 && C1 < O1 && C < O) {
            SETSIGNAL(shift, ObjectId, S_BEAR_QUAD, x, P_SIGNAL, Math.min (L3, L2));
        }
        // Check for Bearish Shooting ShootStar
        if ((H >= H1) && (H > H2) && (H > H3)) {
            if (((UW / 2) > LW) && (UW > (2 * BL90)) && (CL >= (CandleLength * Point)) && (O !== C) && ((UW / 3) <= LW) && ((UW / 4) <= LW)) {
                SETSIGNAL(shift, ObjectId, S_BEAR_SHOOTING_STAR, x, P_SIGNAL);
            }
            if (((UW / 3) > LW) && (UW > (2 * BL90)) && (CL >= (CandleLength * Point)) && (O !== C) && ((UW / 4) <= LW)) {
                SETSIGNAL(shift, ObjectId, S_BEAR_SHOOTING_STAR1, x, P_SIGNAL);
            }
            if (((UW / 4) > LW) && (UW > (2 * BL90)) && (CL >= (CandleLength * Point)) && (O !== C)) {
                SETSIGNAL(shift, ObjectId, S_BEAR_SHOOTING_STAR2, x, P_SIGNAL);
            }
        }

        // Check for Evening Star pattern
        if ((H >= H1) && (H1 > H2) && (H1 > H3)) {
            if ((BLa < (Star_Body_Length * Point)) && (C2 > O2) && (!O === C) && ((C2 - O2) / (CL2) > Doji_Star_Ratio) && (C1 > O1) && (O > C) && (CL >= (Star_MinLength * Point))) {
                SETSIGNAL(shift, ObjectId, S_BEAR_EVENING_STAR, x, P_SIGNAL);
            }
        }
        // Check for Evening Doji Star pattern
        if ((H >= H1) && (H1 > H2) && (H1 > H3)) {
            if ((O === C) && ((C2 > O2) && (C2 - O2) / (CL2) > Doji_Star_Ratio) && (C1 > O1) && (CL >= (Doji_MinLength * Point))) {
                SETSIGNAL(shift, ObjectId, S_BEAR_EVENING_DOJI_STAR, x, P_SIGNAL);
            }
        }
        // Check for a Dark Cloud Cover pattern
        if ((C1 > O1) && (((C1 + O1) / 2) > C) && (O > C) && (C > O1) && (BL / (0.001 + CL) > Piercing_Line_Ratio) && ((CL >= Piercing_Candle_Length * Point))) {
            SETSIGNAL(shift, ObjectId, S_BEAR_DARK_CLOUD_COVER, x, P_SIGNAL);
        }
        // Check for Bearish Engulfing pattern
        if ((C1 > O1) && (O > C) && (O >= C1) && (O1 >= C) && (BL > (C1 - O1)) && (CL >= (Engulfing_Length * Point))) {
            SETSIGNAL(shift, ObjectId, S_BEAR_ENGULFING, x, P_SIGNAL);
        }
        // Check for Bearish Harami pattern
        if ((C1 > O1) && (O > C) && (O <= C1) && (O1 <= C) && (BL < (C1 - O1))) {
            SETSIGNAL(shift, ObjectId, S_BEAR_HARAMI, x, P_SIGNAL);
        }
        // Check for Hanging Man
        if ((C1 > O1) && (CL > 3 * BL) && ((C - L) / CL >= 0.75) && ((O - L) / CL >= 0.75)) {
            SETSIGNAL(shift, ObjectId, S_BEAR_HANGING_MAN, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR_HANGING_MAN1, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR_HANGING_MAN2, x, P_SIGNAL);
        }
        // Check for Three Inside Down pattern
        if ((C2 > O2) && (O1 > C1) && (O1 <= C2) && (O2 <= C1) && ((O1 - C1) < (C2 - O2)) && (O > C) && (C < C1) && (O < O1)) {
            SETSIGNAL(shift, ObjectId, S_BEAR_THREE_INSIDE_DOWN, x, P_SIGNAL);
        }
        // Check for a Three Outside Down pattern
        if ((C2 > O2) && (O1 > C1) && (O1 >= C2) && (O2 >= C1) && ((O1 - C1) > (C2 - O2)) && (O > C) && (C < C1)) {
            SETSIGNAL(shift, ObjectId, S_BEAR_THREE_OUTSIDE_DOWN, x, P_SIGNAL);
        }
        // Check for Three Black Crows pattern
        if ((O > C ) && (O1 > C1 ) && (O2 > C2 ) && (C < C1) && (C1 < C2) && (O > C1) && (O < O1) && (O1 > C2) && (O1 < O2) && (((C - L) / CL) < 0.6) && (((C1 - L1) / CL1) < 0.6) && (((C2 - L2) / CL2) < 0.6)) {
            SETSIGNAL(shift, ObjectId, S_BEAR_THREE_BLACK_CROWS, x, P_SIGNAL);
        }
        // End of Bearish Patterns
        // Bullish Patterns
        if (C3 < O3 && C2 < O2 && C1 > O1 && C > O) {
            SETSIGNAL(shift, ObjectId, S_BULL_QUAD, x, P_SIGNAL, Math.max (H3, H2));
        }

        // Check for Bullish Hammer
        if ((L <= L1) && (L < L2) && (L < L3)) {
            if (((LW / 2) > UW) && (LW > BL90) && (CL >= (CandleLength * Point)) && (O !== C) && ((LW / 3) <= UW) && ((LW / 4) <= UW)) {
                SETSIGNAL(shift, ObjectId, S_BULL_HAMMER, x, P_SIGNAL);
            }
            if (((LW / 3) > UW) && (LW > BL90) && (CL >= (CandleLength * Point)) && (O !== C) && ((LW / 4) <= UW)) {
                SETSIGNAL(shift, ObjectId, S_BULL_HAMMER1, x, P_SIGNAL);
            }
            if (((LW / 4) > UW) && (LW > BL90) && (CL >= (CandleLength * Point)) && (O !== C)) {
                SETSIGNAL(shift, ObjectId, S_BULL_HAMMER2, x, P_SIGNAL);
            }
        }

        // Check for Morning Star
        if ((L <= L1) && (L1 < L2) && (L1 < L3)) {
            if ((BLa < (Star_Body_Length * Point)) && (!O === C) && ((O2 > C2) && ((O2 - C2) / (CL2) > Doji_Star_Ratio)) && (O1 > C1) && (C > O) && (CL >= (Star_MinLength * Point))) {
                SETSIGNAL(shift, ObjectId, S_BULL_MORNING_STAR, x, P_SIGNAL);
            }
        }
        // Check for Morning Doji Star
        if ((L <= L1) && (L1 < L2) && (L1 < L3)) {
            if ((O === C) && ((O2 > C2) && ((O2 - C2) / (CL2) > Doji_Star_Ratio)) && (O1 > C1) && (CL >= (Doji_MinLength * Point))) {
                SETSIGNAL(shift, ObjectId, S_BULL_MORNING_DOJI_STAR, x, P_SIGNAL);
            }
        }
        // Check for Piercing Line pattern
        if ((C1 < O1) && (((O1 + C1) / 2) < C) && (O < C) && (C < O1) && ((C - O) / (CL) > Piercing_Line_Ratio) && (CL >= (Piercing_Candle_Length * Point))) {
            SETSIGNAL(shift, ObjectId, S_BULL_PIERCING_LINE, x, P_SIGNAL);
        }
        // Check for Bullish Engulfing pattern
        if ((O1 > C1) && (C > O) && (C >= O1) && (O <= C1) && ((C - O) > (O1 - C1)) && (CL >= (Engulfing_Length * Point))) {
            SETSIGNAL(shift, ObjectId, S_BULL_ENGULFING, x, P_SIGNAL);
        }
        // Check for Inverted Hammer and Shooting Star
        if ((O1 > C1) && (CL > 3 * BL) && ((H - C) / CL >= 0.75) && ((H - O) / CL >= 0.75)) {
            SETSIGNAL(shift, ObjectId, S_BULL_INVERTED_HAMMER, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL_INVERTED_HAMMER1, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL_INVERTED_HAMMER2, x, P_SIGNAL);
        }
        // Check for Three Outside Up pattern
        if ((O2 > C2) && (C1 > O1) && (C1 >= O2) && (C2 >= O1) && ((C1 - O1) > (O2 - C2)) && (C > O) && (C > C1)) {
            SETSIGNAL(shift, ObjectId, S_BULL_THREE_OUTSIDE_UP, x, P_SIGNAL);
        }
        // Check for Bullish Harami pattern
        if ((O1 > C1) && (C > O) && (C <= O1) && (C1 <= O) && ((C - O) < (O1 - C1))) {
            SETSIGNAL(shift, ObjectId, S_BULL_HARAMI, x, P_SIGNAL);
        }
        // Check for Three Inside Up pattern
        if ((O2 > C2) && (C1 > O1) && (C1 <= O2) && (C2 <= O1) && ((C1 - O1) < (O2 - C2)) && (C > O) && (C > C1) && (O > O1)) {
            SETSIGNAL(shift, ObjectId, S_BULL_THREE_INSIDE_UP, x, P_SIGNAL);
        }
        // Check for Three White Soldiers pattern
        if ((C > O ) && (C1 > O1 ) && (C2 > O2 ) && (C > C1) && (C1 > C2) && (O < C1 && O > O1) && (O1 < C2 && O1 > O2) && (((H - C) / CL) < 0.6) && (((H1 - C1) / CL1) < 0.6) && (((H2 - C2) / CL2) < 0.6)) {
            SETSIGNAL(shift, ObjectId, S_BULL_THREE_WHITE_SOLDIERS, x, P_SIGNAL);
        }
        return 0;
    }
    //---------------------------------------------------- PIVOTS -------------------------------------------------- 
    function FindPivotPoints (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        var currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0 || currentitemidx - 3 < 0) return;
       
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined) return;
       
        var PivotChanged = [false, false, false, false, false, false, false, false, false];
        PivotChanged[x] = false;
        //    if (LastPivotPoint[shift + 1][x] != PivotPoint[x]) 
        //     PivotChanged[x] = true;  
        PivotPoints[0][x]     = currentitem["PIVOT_RESISTANCE2"]; 
        PivotPoints[1][x]     = currentitem["PIVOT_RESISTANCE1"]; 
        PivotPoints[2][x]     = currentitem["PIVOT_RESISTANCE"]; 
        PivotPoints[3][x]     = currentitem["PIVOT_HIGH"]; 
        PivotPoints[4][x]     = currentitem["PIVOT_POINT"]; 
        PivotPoints[5][x]     = currentitem["PIVOT_LOW"]; 
        PivotPoints[6][x]     = currentitem["PIVOT_SUPPORT"]; 
        PivotPoints[7][x]     = currentitem["PIVOT_SUPPORT1"]; 
        PivotPoints[8][x]     = currentitem["PIVOT_SUPPORT2"]; 
        PrevPivotPoints[0][x] = previousitem["PIVOT_RESISTANCE2"]; 
        PrevPivotPoints[1][x] = previousitem["PIVOT_RESISTANCE1"]; 
        PrevPivotPoints[2][x] = previousitem["PIVOT_RESISTANCE"]; 
        PrevPivotPoints[3][x] = previousitem["PIVOT_HIGH"]; 
        PrevPivotPoints[4][x] = previousitem["PIVOT_POINT"]; 
        PrevPivotPoints[5][x] = previousitem["PIVOT_LOW"]; 
        PrevPivotPoints[6][x] = previousitem["PIVOT_SUPPORT"]; 
        PrevPivotPoints[7][x] = previousitem["PIVOT_SUPPORT1"]; 
        PrevPivotPoints[8][x] = previousitem["PIVOT_SUPPORT2"]; 
        for (var i = PIVOT_RESISTANCE2; i <= PIVOT_SUPPORT2; i++) {
            SETSIGNAL(shift, i, S_DISTANCE, x, P_SIGNAL, currentitem.close - PivotPoints[i - PIVOT_RESISTANCE2][x]);
            if (Math.abs(currentitem.close - PivotPoints[i - PIVOT_RESISTANCE2][x]) < AlertDistance[x]) {
                SETSIGNAL(shift, i, S_ALERT, x, P_SIGNAL, currentitem.close - PivotPoints[i - PIVOT_RESISTANCE2][x]);
            }
            if (Equal(currentitem.close, PivotPoints[i - PIVOT_RESISTANCE2][x], 0)) {
                SETSIGNAL(shift, i, S_TOUCHED, x, P_SIGNAL, currentitem.close);
            }
            if (PrevPivotPoints[i - PIVOT_RESISTANCE2][x] < PivotPoints[i - PIVOT_RESISTANCE2][x]) SETSIGNAL(shift, i, S_UP, x, P_SIGNAL);
            if (PrevPivotPoints[i - PIVOT_RESISTANCE2][x] > PivotPoints[i - PIVOT_RESISTANCE2][x]) SETSIGNAL(shift, i, S_DOWN, x, P_SIGNAL);
            if (currentitem.open < PivotPoints[i - PIVOT_RESISTANCE2][x] && currentitem.high > PivotPoints[i - PIVOT_RESISTANCE2][x]) {
                SETSIGNAL(shift, i, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
            }
            if (currentitem.open > PivotPoints[i - PIVOT_RESISTANCE2][x] && currentitem.low < PivotPoints[i - PIVOT_RESISTANCE2][x]) {
                SETSIGNAL(shift, i, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            }
            if (Upper(currentitem.close, PivotPoints[i - PIVOT_RESISTANCE2][x], 0)) {
                SETSIGNAL(shift, i, S_ABOVE, x, P_SIGNAL, PivotPoints[i - PIVOT_RESISTANCE2][x]);
            } else
            if (Lower(currentitem.close, PivotPoints[i - PIVOT_RESISTANCE2][x], 0)) {
                SETSIGNAL(shift, i, S_BELOW, x, P_SIGNAL, PivotPoints[i - PIVOT_RESISTANCE2][x]);
            }
            if (currentitem.open > PivotPoints[i - PIVOT_RESISTANCE2][x] && currentitem.low < PivotPoints[i - PIVOT_RESISTANCE2][x] && currentitem.close > PivotPoints[i - PIVOT_RESISTANCE2][x]) {
                SETSIGNAL(shift, i, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
            }
            if (currentitem.open < PivotPoints[i - PIVOT_RESISTANCE2][x] && currentitem.high > PivotPoints[i - PIVOT_RESISTANCE2][x] && currentitem.close < PivotPoints[i - PIVOT_RESISTANCE2][x]) {
                SETSIGNAL(shift, i, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
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
        SETSIGNAL(shift, PIVOT_RESISTANCE2, S_CURRENT, x, P_SIGNAL, PivotPoints[0][x]);
        SETSIGNAL(shift, PIVOT_RESISTANCE1, S_CURRENT, x, P_SIGNAL, PivotPoints[1][x]);
        SETSIGNAL(shift, PIVOT_RESISTANCE, S_CURRENT, x, P_SIGNAL, PivotPoints[2][x]);
        SETSIGNAL(shift, PIVOT_HIGH, S_CURRENT, x, P_SIGNAL, PivotPoints[3][x]);
        SETSIGNAL(shift, PIVOT_POINT, S_CURRENT, x, P_SIGNAL, PivotPoints[4][x]);
        SETSIGNAL(shift, PIVOT_LOW, S_CURRENT, x, P_SIGNAL, PivotPoints[5][x]);
        SETSIGNAL(shift, PIVOT_SUPPORT, S_CURRENT, x, P_SIGNAL, PivotPoints[6][x]);
        SETSIGNAL(shift, PIVOT_SUPPORT1, S_CURRENT, x, P_SIGNAL, PivotPoints[7][x]);
        SETSIGNAL(shift, PIVOT_SUPPORT2, S_CURRENT, x, P_SIGNAL, PivotPoints[8][x]);
        SETSIGNAL(shift, PIVOT_RESISTANCE2, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[0][x]);
        SETSIGNAL(shift, PIVOT_RESISTANCE1, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[1][x]);
        SETSIGNAL(shift, PIVOT_RESISTANCE, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[2][x]);
        SETSIGNAL(shift, PIVOT_HIGH, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[3][x]);
        SETSIGNAL(shift, PIVOT_POINT, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[4][x]);
        SETSIGNAL(shift, PIVOT_LOW, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[5][x]);
        SETSIGNAL(shift, PIVOT_SUPPORT, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[6][x]);
        SETSIGNAL(shift, PIVOT_SUPPORT1, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[7][x]);
        SETSIGNAL(shift, PIVOT_SUPPORT2, S_PREVIOUS, x, P_SIGNAL, PrevPivotPoints[8][x]);
        var MS3 = PivotPoints[8][x] + ((PivotPoints[6][x] - PivotPoints[8][x]) / 2);
        if (Equal(currentitem.close, MS3, 0)) {
            SETSIGNAL(shift, PIVOT_SUPPORT2, S_MIDDLE, x, P_SIGNAL, MS3);
        }
        var MS2 = PivotPoints[7][x] + ((PivotPoints[6][x] - PivotPoints[7][x]) / 2);
        if (Equal(currentitem.close, MS2, 0)) {
            SETSIGNAL(shift, PIVOT_SUPPORT1, S_MIDDLE, x, P_SIGNAL, MS2);
        }
        var MS1 = PivotPoints[6][x] + ((PivotPoints[4][x] - PivotPoints[6][x]) / 2);
        if (Equal(currentitem.close, MS1, 0)) {
            SETSIGNAL(shift, PIVOT_SUPPORT, S_MIDDLE, x, P_SIGNAL, MS1);
        }
        MS1 = PivotPoints[5][x] + ((PivotPoints[4][x] - PivotPoints[5][x]) / 2);
        if (Equal(currentitem.close, MS1, 0)) {
            SETSIGNAL(shift, PIVOT_LOW, S_MIDDLE, x, P_SIGNAL, MS1);
        }
        var MR1 = PivotPoints[4][x] + ((PivotPoints[2][x] - PivotPoints[4][x]) / 2);
        if (Equal(currentitem.close, MR1, 0)) {
            SETSIGNAL(shift, PIVOT_RESISTANCE, S_MIDDLE, x, P_SIGNAL, MR1);
        }
        MR1 = PivotPoints[4][x] + ((PivotPoints[3][x] - PivotPoints[4][x]) / 2);
        if (Equal(currentitem.close, MR1, 0)) {
            SETSIGNAL(shift, PIVOT_HIGH, S_MIDDLE, x, P_SIGNAL, MR1);
        }
        var MR2 = PivotPoints[2][x] + ((PivotPoints[1][x] - PivotPoints[2][x]) / 2);
        if (Equal(currentitem.close, MR2, 0)) {
            SETSIGNAL(shift, PIVOT_RESISTANCE1, S_MIDDLE, x, P_SIGNAL, MR2);
        }
        var MR3 = PivotPoints[1][x] + ((PivotPoints[0][x] - PivotPoints[1][x]) / 2);
        if (Equal(currentitem.close, MR1, 0)) {
            SETSIGNAL(shift, PIVOT_RESISTANCE2, S_MIDDLE, x, P_SIGNAL, MR3);
        }
    }
    function FindMax (object, data, shift) {
        var value = -1;
        var i = shift;
        switch (object) {
            case OPEN:
                value = data[i].open;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.max(data[i].open, value);
                    i--;
                }
                return Math.max(data[i].open, value);
                break;
            case CLOSE:
                value = data[i].close;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.max(data[i].close, value);
                    i--;
                }
                return Math.max(data[i].close, value);
                break;
            case HIGH:
                value = data[i].high;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.max(data[i].high, value);
                    i--;
                }
                return Math.max(data[i].high, value);
                break;
            case LOW:
                value = data[i].low;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.max(data[i].low, value);
                    i--;
                }
                return Math.max(data[i].low, value);
                break;
        }
    }
    function FindMin (object, data, shift) {
        var value = -1;
        var i = shift;
        switch (object) {
            case OPEN:
                value = data[i].open;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.min(data[i].open, value);
                    i--;
                }
                return Math.min(data[i].open, value);
                break;
            case CLOSE:
                value = data[i].close;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.min(data[i].close, value);
                    i--;
                }
                return Math.min(data[i].close, value);
                break;
            case HIGH:
                value = data[i].high;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.min(data[i].high, value);
                    i--;
                }
                return Math.min(data[i].high, value);
                break;
            case LOW:
                value = data[i].low;
                while (i >= 0 && data[i].date.getHours() != 0) {
                    value = Math.min(data[i].low, value);
                    i--;
                }
                return Math.min(data[i].low, value);
                break;
        }
    }
    function FindFirstMaxMin (period, object, data, from, shift) {
        var i;
        var min_value;
        var max_value; 
        var init_value = -1; 

        switch (object) {
            case OPEN :
                init_value  = data[from].open;
            break;    
            case CLOSE :
                init_value  = data[from].close;
            break;    
            case HIGH :
                init_value = data[from].high;
            break;    
            case LOW :
                init_value = data[from].low;
            break;    
        }
        i = from;    
        max_value = Number.MIN_VALUE;
        min_value = Number.MAX_VALUE;
        while (i > 0 && (data[i].date.getDay() == data[i-1].date.getDay())) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);              
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);             
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);             
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);         
                    break;
            }        
            i--;
        }
        if (i >= 0) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);                    
                    Set_Signal_Value(object, S_FIRSTINDAY, period, data[i].open);         
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);                 
                    Set_Signal_Value(object, S_FIRSTINDAY, period, data[i].close);                   
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);                   
                    Set_Signal_Value(object, S_FIRSTINDAY, period, data[i].high);                   
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);                   
                    Set_Signal_Value(object, S_FIRSTINDAY, period, data[i].low); 
                    break;
            }
            Set_Signal_Value(object, S_MAXINDAY, period,  max_value);         
            Set_Signal_Value(object, S_MININDAY, period,  min_value); 
            if (init_value  == max_value) SETSIGNAL(shift, object, S_MAXINDAY, period, P_SIGNAL);
            if (init_value  == min_value) SETSIGNAL(shift, object, S_MININDAY, period, P_SIGNAL);            
        }
        i = from;    
        max_value = Number.MIN_VALUE;
        min_value = Number.MAX_VALUE;
        while (i > 0 && (data[i].date.getWeek() == data[i-1].date.getWeek())) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);              
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);             
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);             
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);         
                    break;
            }           
            i--;
        }
        if (i >= 0) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);                   
                    Set_Signal_Value(object, S_FIRSTINWEEK, period, data[i].open);         
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);                 
                    Set_Signal_Value(object, S_FIRSTINWEEK, period, data[i].close);                   
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);                 
                    Set_Signal_Value(object, S_FIRSTINWEEK, period, data[i].high);                   
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);                     
                    Set_Signal_Value(object, S_FIRSTINWEEK, period, data[i].low); 
                    break;
            }
            Set_Signal_Value(object, S_MAXINWEEK, period,  max_value);         
            Set_Signal_Value(object, S_MININWEEK, period,  min_value); 
            if (init_value  == max_value)  SETSIGNAL(shift, object, S_MAXINWEEK, period, P_SIGNAL);
            if (init_value  == min_value)  SETSIGNAL(shift, object, S_MININWEEK, period, P_SIGNAL);          
        }
        i = from;    
        max_value = Number.MIN_VALUE;
        min_value = Number.MAX_VALUE;

        while (i > 0 && (data[i].date.getMonth() == data[i-1].date.getMonth())) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);              
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);             
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);             
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);         
                    break;
            }           
            i--;
        }
        if (i > 0) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);                   
                    Set_Signal_Value(object, S_FIRSTINMONTH, period, data[i].open);         
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);                 
                    Set_Signal_Value(object, S_FIRSTINMONTH, period, data[i].close);                   
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);                 
                    Set_Signal_Value(object, S_FIRSTINMONTH, period, data[i].high);                   
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);                     
                    Set_Signal_Value(object, S_FIRSTINMONTH, period, data[i].low); 
                    break;
            }   
            Set_Signal_Value(object, S_MAXINMONTH, period,  max_value);         
            Set_Signal_Value(object, S_MININMONTH, period,  min_value); 
            if (init_value  == max_value)  SETSIGNAL(shift, object, S_MAXINMONTH, period, P_SIGNAL);
            if (init_value  == min_value)  SETSIGNAL(shift, object, S_MININMONTH, period, P_SIGNAL);        
        }    
        i = from;    
        max_value = Number.MIN_VALUE;
        min_value = Number.MAX_VALUE;

        while (i > 0 && (data[i].date.getYear() == data[i-1].date.getYear())) {
            //console.log (data[i].date.getMonth() + ' ' + data[i].date.getDate() + ' ' + data[i].date.getHours());
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);              
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);             
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);             
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);         
                    break;
            }           
            i--;
        }
        if (i > 0) {
            switch (object) {
                case OPEN:
                    max_value = Math.max(data[i].open, max_value);
                    min_value = Math.min(data[i].open, min_value);                   
                    Set_Signal_Value(object, S_FIRSTINYEAR, period, data[i].open);         
                    break;
                case CLOSE:
                    max_value = Math.max(data[i].close, max_value);
                    min_value = Math.min(data[i].close, min_value);                  
                    Set_Signal_Value(object, S_FIRSTINYEAR, period, data[i].close);                   
                    break;
                case HIGH:
                    max_value = Math.max(data[i].high, max_value);
                    min_value = Math.min(data[i].high, min_value);                 
                    Set_Signal_Value(object, S_FIRSTINYEAR, period, data[i].high);                   
                    break;
                case LOW:
                    max_value = Math.max(data[i].low, max_value);
                    min_value = Math.min(data[i].low, min_value);                     
                    Set_Signal_Value(object, S_FIRSTINYEAR, period, data[i].low); 
                    break;
            }
            Set_Signal_Value(object, S_MAXINYEAR, period,  max_value);         
            Set_Signal_Value(object, S_MININYEAR, period,  min_value); 
            if (init_value  == max_value)  SETSIGNAL(shift, object, S_MAXINYEAR, period, P_SIGNAL);
            if (init_value  == min_value)  SETSIGNAL(shift, object, S_MININYEAR, period, P_SIGNAL);          
        }
    }
    function FindProgress (x, object,  data, currentitemindex, shift) {

        var ObjectId = +object.Id;

        switch (arguments.length) {
            case 4 :
                shift = 0;
        }


        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        var i = currentitemidx;


        while (data[i] && i > 0) {
            if (data[i].progress_BUY && data[i].progress_BUY == 1) 	{
                SETSIGNAL(shift, ObjectId, S_BUY, x, P_SIGNAL);
                return;
            }
            if (data[i].progress_SELL  && data[i].progress_SELL == 1) 	 {
                SETSIGNAL(shift, ObjectId, S_SELL, x, P_SIGNAL);
                return;
            }
            if (data[i].progress_EXIT_BUY  && data[i].progress_EXIT_BUY == 1) {
                SETSIGNAL(shift, ObjectId, S_EXIT_BUY, x, P_SIGNAL);
                return;
            }
            if (data[i].progress_EXIT_SELL   && data[i].progress_EXIT_SELL == 1) {
                SETSIGNAL(shift, ObjectId, S_EXIT_SELL, x, P_SIGNAL);
                return;
            }
            i--;
        }

    }
    //---------------------------------------------------- OPEN -------------------------------------------------- 
    function FindOpen (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;

        switch (arguments.length) {
            case 4 :
                shift = 0;
        }


        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        


        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0 || currentitemidx - 3 < 0) return;
        
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined) return;
        //OPEN
        
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, previousitem.open);
    
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, currentitem.open);

        Set_Signal_Time(ObjectId, S_CURRENT, x,  currentitem.date.getTime() / 1000);
        Set_Signal_Price(ObjectId, S_CURRENT, x, currentitem.open);

        var NbrBars = 0;
        var i = currentitemidx;

        FindFirstMaxMin(x, ObjectId, data, i, shift);


        if (currentitem.open > previousitem.open) {
            if (previousitem.open < ppreviousitem.open) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].open > data[i - 1].open)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else if (currentitem.open < previousitem.open) {
            if (previousitem.open > ppreviousitem.open) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].open < data[i - 1].open)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else {
            while (data[i] && i > 0 && (data[i].open === data[i - 1].open)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        }
        if (currentitem.open < previousitem.open && currentitem.high > previousitem.open) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
            if (currentitem.close < previousitem.open) SETSIGNAL(shift, ObjectId, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
        }
        if (currentitem.open > previousitem.open && currentitem.low < previousitem.open) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            if (currentitem.close > previousitem.open) SETSIGNAL(shift, ObjectId, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
        }
        if (Upper(currentitem.close, previousitem.open, 0)) 
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
        else 
        if (Lower(currentitem.close, previousitem.open, 0)) 
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
        else 
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL);
    }
    //---------------------------------------------------- CLOSE -------------------------------------------------- 
    function FindClose (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0 || currentitemidx - 3 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined) return;
        
        
        //CLOSE
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, currentitem.close);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, previousitem.close);
        Set_Signal_Time(ObjectId, S_CURRENT, x, currentitem.date.getTime() / 1000);
        Set_Signal_Price(ObjectId, S_CURRENT, x, currentitem.close);
        
        var NbrBars = 0;
        var i = currentitemidx;

        FindFirstMaxMin(x, ObjectId, data, i, shift);
        

        if (currentitem.close > previousitem.close) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
            if (previousitem.close < ppreviousitem.close) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].close > data[i - 1].close)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else if (currentitem.close < previousitem.close) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
            if (previousitem.close > ppreviousitem.close) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].close < data[i - 1].close)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else {
            while (data[i] && i > 0 && (data[i].close === data[i - 1].close)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);
        }
        if (currentitem.open < previousitem.close && currentitem.high > previousitem.close) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
            if (currentitem.close < previousitem.close) SETSIGNAL(shift, ObjectId, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
        }
        if (currentitem.open > previousitem.close && currentitem.low < previousitem.close) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            if (currentitem.close > previousitem.close) SETSIGNAL(shift, ObjectId, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
        }
        if (Upper(currentitem.close, previousitem.close, 0)) 
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
        else 
        if (Lower(currentitem.close, previousitem.close, 0)) 
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
        else 
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL);
    }
    //---------------------------------------------------- HIGH -------------------------------------------------- 
    function FindHigh (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0 || currentitemidx - 3 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined) return;
        //HIGH
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, currentitem.high);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, previousitem.high);
        var NbrBars = 0;
        var i = currentitemidx;

        FindFirstMaxMin(x, ObjectId, data, i, shift);
        
        if (currentitem.high > previousitem.high) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
            if (previousitem.high < ppreviousitem.high) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].high > data[i - 1].high)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else if (currentitem.high < previousitem.high) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
            if (previousitem.high > ppreviousitem.high) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].high < data[i - 1].high)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else {
            while (data[i] && i > 0 && (data[i].high === data[i - 1].high)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);
        }
        if (currentitem.open < previousitem.high && currentitem.high > previousitem.high) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
            if (currentitem.close < previousitem.high) SETSIGNAL(shift, ObjectId, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
        }
        if (currentitem.open > previousitem.high && currentitem.low < previousitem.high) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            if (currentitem.close > previousitem.high) SETSIGNAL(shift, ObjectId, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
        }
        if (Upper(currentitem.close, previousitem.high, 0)) 
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
        else 
        if (Lower(currentitem.close, previousitem.high, 0)) 
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
        else 
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL);
    }
    //---------------------------------------------------- LOW -------------------------------------------------- 
    function FindLow (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0 || currentitemidx - 3 < 0) return;
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined) return;
        //LOW
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, currentitem.low);
        SETSIGNAL(shift, ObjectId, S_PREVIOUS, x, P_SIGNAL, previousitem.low);
        var NbrBars = 0;
        var i = currentitemidx;

        FindFirstMaxMin(x, ObjectId, data, i, shift);      
        

        if (currentitem.low > previousitem.low) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BULL, x, P_SIGNAL);
            if (previousitem.low < ppreviousitem.low) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].low > data[i - 1].low)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else if (currentitem.low < previousitem.low) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
            SETSIGNAL(shift, ObjectId, S_BEAR, x, P_SIGNAL);
            if (previousitem.low > ppreviousitem.low) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL);
            }
            while (data[i] && i > 0 && (data[i].low < data[i - 1].low)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        } else {
            while (data[i] && i > 0 && (data[i].low === data[i - 1].low)) {
                NbrBars += 1;
                i--;
            }
            SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);
        }
        if (currentitem.open < previousitem.low && currentitem.high > previousitem.low) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
            if (currentitem.close < previousitem.low) SETSIGNAL(shift, ObjectId, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
        }
        if (currentitem.open > previousitem.low && currentitem.low < previousitem.low) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            if (currentitem.close > previousitem.low) SETSIGNAL(shift, ObjectId, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
        }
        if (Lower(currentitem.close, previousitem.low, 0)) 
            SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL);
        else 
        if (Upper(currentitem.close, previousitem.low, 0)) 
            SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL);
        else 
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL);
    }
    function FindRS (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }

        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }
        
        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;        

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;
        
        var previousitem = data[currentitemidx - 1];
        var ppreviousitem = data[currentitemidx - 2];
        if (currentitem == undefined || previousitem == undefined || ppreviousitem == undefined) return;    
        
        if (ObjectId == RESISTANCE && currentitem.RESISTANCE == undefined || previousitem.RESISTANCE == undefined || ppreviousitem.RESISTANCE == undefined) return;
        if (ObjectId == SUPPORT    && currentitem.SUPPORT == undefined || previousitem.SUPPORT == undefined || ppreviousitem.SUPPORT == undefined) return;

        var down = LevelCalculate (currentitem.SUPPORT[0][0],    currentitem.SUPPORT[0][1],    currentitem.SUPPORT[1][0],    currentitem.SUPPORT[1][1],    currentitemidx);
        var up   = LevelCalculate (currentitem.RESISTANCE[0][0], currentitem.RESISTANCE[0][1], currentitem.RESISTANCE[1][0], currentitem.RESISTANCE[1][1], currentitemidx);

        var pdown = LevelCalculate (previousitem.SUPPORT[0][0],    previousitem.SUPPORT[0][1],    previousitem.SUPPORT[1][0],    previousitem.SUPPORT[1][1],    currentitemidx-1);
        var pup   = LevelCalculate (previousitem.RESISTANCE[0][0], previousitem.RESISTANCE[0][1], previousitem.RESISTANCE[1][0], previousitem.RESISTANCE[1][1], currentitemidx-1);

        var ppdown = LevelCalculate (ppreviousitem.SUPPORT[0][0],    ppreviousitem.SUPPORT[0][1],    ppreviousitem.SUPPORT[1][0],    ppreviousitem.SUPPORT[1][1],    currentitemidx-2);
        var ppup   = LevelCalculate (ppreviousitem.RESISTANCE[0][0], ppreviousitem.RESISTANCE[0][1], ppreviousitem.RESISTANCE[1][0], ppreviousitem.RESISTANCE[1][1], currentitemidx-2);


        if (previousitem.RESISTANCE !=  currentitem.RESISTANCE) {
            SETSIGNAL(shift, RESISTANCE, S_CHANGED, x, P_SIGNAL, pup);
        }
        if (previousitem.SUPPORT !=  currentitem.SUPPORT) {
            SETSIGNAL(shift, SUPPORT, S_CHANGED, x, P_SIGNAL, pdown);
        }


        if (Equal(currentitem.close, down + Math.abs(up - down) / 2, 0)) {
            Set_Signal(SUPPORT, S_MIDDLE, x, P_SIGNAL);
            Set_Signal(RESISTANCE, S_MIDDLE, x, P_SIGNAL);
        }
        
        if (up - down < 0) {
            SETSIGNAL(shift, SUPPORT,    S_RCROSSED, x, P_SIGNAL, up - down);
            SETSIGNAL(shift, RESISTANCE, S_RCROSSED, x, P_SIGNAL, up - down);
        }


        if ((ppreviousitem.open > ppdown || ppreviousitem.close >= ppdown) && ppreviousitem.open  < ppdown && previousitem.close <= pdown && currentitem.close < down) {
            SETSIGNAL(shift, SUPPORT, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
        } else
        if ((ppreviousitem.low  < ppup ||  ppreviousitem.close <= ppup)    &&  ppreviousitem.open > ppup && previousitem.close >= pup && currentitem.close > up) {
            SETSIGNAL(shift, RESISTANCE, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
        }

        
        if (ObjectId == RESISTANCE) {
            var NbrBars = 0;
            
            if (currentitem.close - up > 0) {        
                var i = currentitemidx;
                while (data[i] && i > 0 && (data[i].high >LevelCalculate (data[i].RESISTANCE[0][0], data[i].RESISTANCE[0][1], data[i].RESISTANCE[1][0], data[i].RESISTANCE[1][1], i))) {
                    NbrBars += 1;
                    i--;
                }
            }
            SETSIGNAL(shift, RESISTANCE, S_NBRBARS, x, P_SIGNAL, NbrBars);
            

            SETSIGNAL(shift, RESISTANCE, S_CURRENT,  x, P_SIGNAL,   up);
            SETSIGNAL(shift, RESISTANCE, S_DISTANCE, x, P_SIGNAL,   currentitem.close - up);
            SETSIGNAL(shift, RESISTANCE, S_PREVIOUS, x, P_SIGNAL,   pup);
            Set_Signal_Value(RESISTANCE, S_MIDDLE, x, down + Math.abs(up - down) / 2);
            
            if (Math.abs(SValue(RESISTANCE, S_DISTANCE, x)) < AlertDistance[x]) {
                SETSIGNAL(shift, RESISTANCE, S_ALERT, x, P_SIGNAL,  currentitem.close - up);
            }
            
            if (Equal(currentitem.close, up, 0)) {
                SETSIGNAL(shift, RESISTANCE, S_TOUCHED, x, P_SIGNAL, currentitem.close);
            }
            if (Lower(currentitem.close, up, 0)) {
                SETSIGNAL(shift, RESISTANCE, S_RANGE, x, P_SIGNAL);
        
            } else
            if (Upper(currentitem.close, up, 0)) {
                SETSIGNAL(shift, RESISTANCE, S_ABOVE, x, P_SIGNAL, up);
            }
            if (currentitem.open < up && currentitem.high > up) {
                SETSIGNAL(shift, RESISTANCE, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
        
            }
            if (currentitem.open > up && currentitem.low < up) {
                SETSIGNAL(shift, RESISTANCE, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            }        
        }
        if (ObjectId == SUPPORT) {
            var NbrBars = 0;
            if (down - currentitem.close  > 0) { 
                var i = currentitemidx;
                while (data[i] && i > 0 && (data[i].low < LevelCalculate (data[i].SUPPORT[0][0], data[i].SUPPORT[0][1], data[i].SUPPORT[1][0], data[i].SUPPORT[1][1], i))) {
                    NbrBars += 1;
                    i--;
                }
            }
            SETSIGNAL(shift, SUPPORT, S_NBRBARS, x, P_SIGNAL, NbrBars);        

            SETSIGNAL(shift, SUPPORT, S_CURRENT,  x, P_SIGNAL,      down);
            SETSIGNAL(shift, SUPPORT, S_DISTANCE, x, P_SIGNAL,      currentitem.close - down);
            SETSIGNAL(shift, SUPPORT, S_PREVIOUS, x, P_SIGNAL,      pdown);
            Set_Signal_Value(SUPPORT,    S_MIDDLE, x, down + Math.abs(up - down) / 2);

            if (Math.abs(SValue(SUPPORT, S_DISTANCE, x)) < AlertDistance[x]) {
            SETSIGNAL(shift, SUPPORT, S_ALERT, x, P_SIGNAL,  currentitem.close - down);
            }

        
            if (Equal(currentitem.close, down, 0)) {
                SETSIGNAL(shift, SUPPORT, S_TOUCHED, x, P_SIGNAL, currentitem.close);
            }
            if (Lower(currentitem.close, down, 0)) {
                SETSIGNAL(shift, SUPPORT, S_BELOW, x, P_SIGNAL, down);
            } else
            if (Upper(currentitem.close, down, 0)) {
                SETSIGNAL(shift, SUPPORT, S_RANGE, x, P_SIGNAL);
            }
            if (currentitem.open > down && currentitem.low  < down) {
                SETSIGNAL(shift, SUPPORT, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
            }
            if (currentitem.open < down && currentitem.high  > down) {
                SETSIGNAL(shift, SUPPORT, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
            }
        }


    }
    function FindFractals (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }
        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }

        var currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;

        if (currentitemidx - 1 < 0) return;
        

        var previousitem = data[currentitemidx - 1];
        var NbrBars = 0;
        var i = currentitemidx;
        
        while (data[i] && i > 0 && (data[i][object.Name] == data[i-1][object.Name])) {
            NbrBars += 1;
            i--;
        }
        SETSIGNAL(shift, ObjectId, S_NBRBARS, x, P_SIGNAL, NbrBars);
        
        
        var fractal = currentitem[object.Name];
        var bfractal = fractal;
        
        if (i > 0) {
            bfractal = data[i-1][object.Name];
        }
        Set_Signal_Value(ObjectId, S_PREVIOUS, x, bfractal);
        
        if (bfractal < fractal) {
            SETSIGNAL(shift, ObjectId, S_UP, x, P_SIGNAL);
        } else
        if (bfractal > fractal) {
            SETSIGNAL(shift, ObjectId, S_DOWN, x, P_SIGNAL);
        } 
        else {
            SETSIGNAL(shift, ObjectId, S_SIDEWAY, x, P_SIGNAL);
        }
        
        
        SETSIGNAL(shift, ObjectId, S_CURRENT, x, P_SIGNAL, fractal);
        SETSIGNAL(shift, ObjectId, S_DISTANCE, x, P_SIGNAL, currentitem.close - fractal);
        SETSIGNAL(shift, ObjectId, S_TARGET, x, P_SIGNAL, fractal);
        
        if (Math.abs(SValue(ObjectId, S_DISTANCE, x)) < AlertDistance[x]) {
            SETSIGNAL(shift, ObjectId, S_ALERT, x, P_SIGNAL, currentitem.close - fractal);
        }
        
        if (currentitem.open < fractal && currentitem.high > fractal) {
            SETSIGNAL(shift, ObjectId, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
        }
        
        if (currentitem.open > fractal && currentitem.low < fractal) {
            SETSIGNAL(shift, ObjectId, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
        }
        
        if (Equal(currentitem.close, fractal, 0)) {
            SETSIGNAL(shift, ObjectId, S_TOUCHED, x, P_SIGNAL, fractal);
        } else
        if (Lower(currentitem.close, fractal, 0)) {
            if (ObjectId == UPFRACTAL) 
                SETSIGNAL(shift, ObjectId, S_RANGE, x, P_SIGNAL);
            else {
                SETSIGNAL(shift, ObjectId, S_BELOW, x, P_SIGNAL, fractal);
                SETSIGNAL(shift, ObjectId, S_TARGET, x, P_SIGNAL, FindNextFractal(MODE_LOWER, data, currentitemidx)[0]);
            }
        } else
        if (Upper(currentitem.close, fractal, 0)) {
            if (ObjectId == DOWNFRACTAL) 
                SETSIGNAL(shift, ObjectId, S_RANGE, x, P_SIGNAL);
            else {
                SETSIGNAL(shift, ObjectId, S_ABOVE, x, P_SIGNAL, fractal);
                SETSIGNAL(shift, ObjectId, S_TARGET, x, P_SIGNAL, FindNextFractal(MODE_UPPER, data, currentitemidx)[0]);
            }
        }
        if (ObjectId == UPFRACTAL) {
            if (fractal != LastUpFractals[x]) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, fractal);
            }
            LastUpFractals[x] = fractal;
            if (previousitem.close >= fractal && currentitem.close < fractal) {
                SETSIGNAL(shift, ObjectId, S_REVERSE_DOWN, x, P_SIGNAL, currentitem.close);
            }
        } else {
            if (fractal != LastDownFractals[x]) {
                SETSIGNAL(shift, ObjectId, S_CHANGED, x, P_SIGNAL, fractal);
            }
            LastDownFractals[x] = fractal;
            if (previousitem.close < fractal && currentitem.close > fractal) {
                SETSIGNAL(shift, ObjectId, S_REVERSE_UP, x, P_SIGNAL, currentitem.close);
            }
        }
        var downfractal = currentitem.UPFRACTAL;
        var upfractal = currentitem.DOWNFRACTAL;
        //Up and Down    
        var middle = downfractal + (Math.abs(upfractal - downfractal) / 2);
        Set_Signal_Value(UPFRACTAL, S_MIDDLE, x, middle);
        Set_Signal_Value(DOWNFRACTAL, S_MIDDLE, x, middle);
        if (Equal(currentitem.close, middle, 0)) {
            SETSIGNAL(shift, UPFRACTAL, S_MIDDLE, x, P_SIGNAL);
            SETSIGNAL(shift, DOWNFRACTAL, S_MIDDLE, x, P_SIGNAL);
        }
    }
    //---------------------------------------------------- FIBO -------------------------------------------------- 
    function FindFiboPoints (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }
        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }

        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;

        var previousitem = data[currentitemidx - 1];
        var fibopoint = 0;
        var previousfibopoint = 0;
        if (currentitem.fibo_buy !== -1) {
            fibopoint = currentitem.fibo_buy;
            SETSIGNAL(shift, FIBOLEVEL, S_BULL, x, P_SIGNAL);
            SETSIGNAL(shift, FIBOSTOPLOSSLEVEL, S_BULL, x, P_SIGNAL);
        } else {
            fibopoint = currentitem.fibo_sell;
            SETSIGNAL(shift, FIBOLEVEL, S_BEAR, x, P_SIGNAL);
            SETSIGNAL(shift, FIBOSTOPLOSSLEVEL, S_BEAR, x, P_SIGNAL);
        }
        if (Upper(currentitem.close, fibopoint, 0)) SETSIGNAL(shift, FIBOLEVEL, S_ABOVE, x, P_SIGNAL);
        if (Lower(currentitem.close, fibopoint, 0)) SETSIGNAL(shift, FIBOLEVEL, S_BELOW, x, P_SIGNAL);
        if (Upper(currentitem.close, currentitem.fibo_stoploss, 0)) SETSIGNAL(shift, FIBOSTOPLOSSLEVEL, S_ABOVE, x, P_SIGNAL);
        if (Lower(currentitem.close, currentitem.fibo_stoploss, 0)) SETSIGNAL(shift, FIBOSTOPLOSSLEVEL, S_BELOW, x, P_SIGNAL);
        Set_Signal_Value(FIBOLEVEL, S_CURRENT, x, fibopoint);
        Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_CURRENT, x, currentitem.fibo_stoploss);
        Set_Signal_Value(FIBOLEVEL, S_DISTANCE, x, currentitem.close - fibopoint);
        Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_DISTANCE, x, currentitem.close - currentitem.fibo_stoploss);
        // AJOUT 
        if (previousitem.fibo_buy !== -1) {
            previousfibopoint = previousitem.fibo_buy;
        } else {
            previousfibopoint = previousitem.fibo_sell;
        }
        Set_Signal_Value(FIBOLEVEL, S_PREVIOUS, x, previousfibopoint);
        Set_Signal_Value(FIBOSTOPLOSSLEVEL, S_PREVIOUS, x, previousitem.fibo_stoploss);
        if ((currentitem.fibo_buy != -1 && previousitem.fibo_buy == -1) || (currentitem.fibo_sell != -1 && previousitem.fibo_sell == -1)) SETSIGNAL(shift, FIBOLEVEL, S_CHANGED, x, P_SIGNAL);
        /*    

            if (BeforeSignalTab[FIBOLEVEL][S_UP] !== SignalTab[FIBOLEVEL][S_UP])

                SETSIGNAL(shift, FIBOLEVEL, S_CHANGED, x, P_SIGNAL);

        */
        if (currentitem.open < fibopoint && currentitem.high > fibopoint) {
            SETSIGNAL(shift, FIBOLEVEL, S_CROSS_UP, x, P_SIGNAL, currentitem.close);
        }
        if (currentitem.open > fibopoint && currentitem.low < fibopoint) {
            SETSIGNAL(shift, FIBOLEVEL, S_CROSS_DOWN, x, P_SIGNAL, currentitem.close);
        }
        if (Math.abs(currentitem.close - fibopoint) < AlertDistance[x]) {
            SETSIGNAL(shift, FIBOLEVEL, S_ALERT, x, P_SIGNAL, currentitem.close - fibopoint);
        }
        if (Equal(currentitem.close, fibopoint, 0)) {
            SETSIGNAL(shift, FIBOLEVEL, S_TOUCHED, x, P_SIGNAL, currentitem.close);
        }
        if (Math.abs(currentitem.close - currentitem.fibo_stoploss) < AlertDistance[x]) {
            SETSIGNAL(shift, FIBOSTOPLOSSLEVEL, S_ALERT, x, P_SIGNAL, currentitem.close - currentitem.fibo_stoploss);
        }
        if (Equal(currentitem.close, currentitem.fibo_stoploss, 0)) {
            SETSIGNAL(shift, FIBOSTOPLOSSLEVEL, S_TOUCHED, x, P_SIGNAL, currentitem.close);
        }
    }
    //---------------------------------------------------- HEIKEN ASHI -------------------------------------------------- 
    function GetHeikenAshiClose (data, itemidx) {
        var item = data[itemidx];
        return (item.open + item.high + item.low + item.close) / 4;
    }
    function GetHeikenAshiOpen (data, itemidx, lookback) {
        //The higher you make this lookback the lower the error with the true Heiken Ashi Open)
        var open = GetHeikenAshiClose(data, itemidx - lookback);
        lookback--;
        for (var j = itemidx - lookback; j < itemidx; j++) {
            open = (open + GetHeikenAshiClose(data, j)) / 2;
        }
        return open;
    }
    function GetHeikenAshi (data, itemidx, lookback) {
        if (itemidx - lookback < 0) return undefined;
        var hopen  = GetHeikenAshiOpen(data, itemidx, lookback);
        var hclose = GetHeikenAshiClose(data, itemidx);
        if (hopen > hclose) return -1;
        else return 1;
    }
    function FindHeikenAshi (x, object,  data, currentitemindex, shift) {
        var ObjectId = +object.Id;
        switch (arguments.length) {
            case 4 :
                shift = 0;
        }
        if (!ReturnItemFromShift(data, currentitemindex, shift)) {
            return ;
        }

        let currentitem     =  CurrentItem;        
        let currentitemidx  =  CurrentItemIndex;

        if (currentitemidx - 1 < 0 || currentitemidx - 2 < 0) return;
        var i = shift;
        var AshiNbrBars = 0;
        if (GetHeikenAshi(data, currentitemidx, 11) > 0) {
            SETSIGNAL(shift, HEIKEN_ASHI, S_CURRENT, x, P_SIGNAL, 1);
            SETSIGNAL(shift, HEIKEN_ASHI, S_UP, x, P_SIGNAL);
            SETSIGNAL(shift, HEIKEN_ASHI, S_BULL, x, P_SIGNAL);
            if (GetHeikenAshi(data, currentitemidx - 1, 11) < 0) {
                SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 0);
                SETSIGNAL(shift, HEIKEN_ASHI, S_CHANGED, x, P_SIGNAL);
            } else SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 1);
            AshiNbrBars = 0;
            var i = currentitemidx;
            while (data[i] && i > 0 && (GetHeikenAshi(data, i, 11) > 0)) {
                AshiNbrBars += 1;
                i--;
            }
        } else {
            SETSIGNAL(shift, HEIKEN_ASHI, S_CURRENT, x, P_SIGNAL, 0);
            SETSIGNAL(shift, HEIKEN_ASHI, S_DOWN, x, P_SIGNAL);
            SETSIGNAL(shift, HEIKEN_ASHI, S_BEAR, x, P_SIGNAL);
            if (GetHeikenAshi(data, currentitemidx - 1, 11) > 0) {
                SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 1);
                SETSIGNAL(shift, HEIKEN_ASHI, S_CHANGED, x, P_SIGNAL);
            } else SETSIGNAL(shift, HEIKEN_ASHI, S_PREVIOUS, x, P_SIGNAL, 0);
            AshiNbrBars = 0;
            var i = currentitemidx;
            while (data[i] && i > 0 && (GetHeikenAshi(data, i, 11) < 0)) {
                AshiNbrBars += 1;
                i--;
            }
        }
        if (GetHeikenAshi(data, currentitemidx - 2, 11) > 0 && GetHeikenAshi(data, currentitemidx - 1, 11) < 0) SETSIGNAL(shift, HEIKEN_ASHI, S_REVERSE_DOWN, x, P_SIGNAL);
        if (GetHeikenAshi(data, currentitemidx - 2, 11) < 0 && GetHeikenAshi(data, currentitemidx - 1, 11) > 0) SETSIGNAL(shift, HEIKEN_ASHI, S_REVERSE_UP, x, P_SIGNAL);
        SETSIGNAL(shift, HEIKEN_ASHI, S_NBRBARS, x, P_SIGNAL, AshiNbrBars);
    }
    function GetSignalCallbackFromObject (object) {
        let type        = ObjectTypeName.indexOf (object.Type);        
        switch (type) 	{	
            case PREDEFINED_TYPE :
                switch (object.Name) 	{	
                    case "RESISTANCE":
                        return FindRS.name;      
                    break;   	    
                    case "SUPPORT":
                        return FindRS.name;    
                    break;
                    case "UPFRACTAL":
                        return FindFractals.name;                         
                    break;   	    
                    case "DOWNFRACTAL":
                        return FindFractals.name;    
                    break;                  
                    case "HEIKEN_ASHI":
                        return FindHeikenAshi.name;    
                    break;
                    case "VOLUME":
                        return FindVolume.name;    
                    break;
                    case "NEWS":
                        return FindNothing.name;    
                    break;    
                    case "PROGRESS":
                        return FindProgress.name;    
                    break;                    
                    case "FIBOLEVEL":
                        return FindFiboPoints.name;    
                    break;            
                    case "FIBOSTOPLOSSLEVEL":
                        return FindFiboPoints.name; 
                    break;    
                    case "PIVOT_RESISTANCE2":
                        return FindPivotPoints.name;                
                    break;                    
                    case "PIVOT_RESISTANCE1":
                        return FindPivotPoints.name;           	                
                    break;        
                    case "PIVOT_RESISTANCE":
                        return FindPivotPoints.name;   
                    break;    
                    case "PIVOT_HIGH":
                        return FindPivotPoints.name;   
                    break;   
                    case "PIVOT_POINT":
                        return FindPivotPoints.name;      
                    break;                   
                    case "PIVOT_LOW":
                        return FindPivotPoints.name;  
                    break;             
                    case "PIVOT_SUPPORT":
                        return FindPivotPoints.name;                                      
                    break;        
                    case "PIVOT_SUPPORT1":
                        return FindPivotPoints.name;                                      
                    break;        
                    case "PIVOT_SUPPORT2":
                        return FindPivotPoints.name;                                      
                    case "BAR" :
                        return FindBar.name;
                    break;        	    
                    case "OPEN":
                        return FindOpen.name;                
                    break;        	    
                    case "CLOSE":
                        return FindClose.name;               
                    break;        	    
                    case "LOW":
                        return FindLow.name;  
                    break;        	    
                    case "HIGH":
                        return FindHigh.name;  	 
                    break;        	 
                }
            break;
            case MA_TYPE:
                return MovingAverageAlgo.name;           
            break;
            case SAR_TYPE:
                return SARAlgo.name;  	    
            break;      
            case BOLLINGER_TYPE:  // period, deviation, apply, 
                return FindBB.name; 	
            case CUSTOM_TYPE: 	
            break;
            case CCI_TYPE:
                return SimpleSeperateAlgo.name;
            break;
            case ADX_TYPE:
                return SimpleSeperateAlgo.name;		    
            break;
            case WPR_TYPE:
                return SimpleSeperateAlgo.name;		    
            break;
            case ATR_TYPE:
                return SimpleSeperateAlgo.name;            
            break;
            case RSI_TYPE:
                return SimpleSeperateAlgo.name;
            break;
            case STOCHASTIC_TYPE:
                return FindStochastic.name;            
            break;
            case MACD_TYPE:
                return FindMACD.name;            
            break;	
        }
        return null;
    }`
const contextreturn =     
    `return {
        Init,
        execute,
        addfunction,
        SetHigh,
        SetLow, 
        SetClose,
        SetOpen,
        SetTime,
        GetHigh,
        GetLow, 
        GetClose,
        GetOpen,        
        GetTime,
        InitIndicators,
        InitSignals,   
        SetPreviousSignals,        
        ResetSignals,  
        ResetSignalFilters,                   
        MaxV,
        MinV,
        MaxPV,
        MinPV,
        AndS_G,
        AndS_L,
        AndS_G_AndPS,
        AndS_L_AndPS,
        AndV_Eq,
        AndV_L,
        AndV_LEq,
        AndV_G,
        AndV_GEq,
        AndPV_Eq,
        AndPV_L,
        AndPV_LEq,
        AndPV_G,
        AndPV_GEq,
        OrV_Eq,
        OrV_L,
        OrV_LEq,
        OrV_G,
        OrV_GEq,
        OrPV_Eq,
        OrPV_L,
        OrPV_LEq,
        OrPV_G,
        OrPV_GEq,
        AndBV_Eq,
        AndBV_LEq,
        AndBV_L,
        AndBV_G,
        AndBV_GEq,
        OrBV_Eq,
        OrBV_LEq,
        OrBV_L,
        OrBV_G,
        OrBV_GEq,
        AndTV_Eq,
        AndTV_LEq,
        AndTV_L,
        AndTV_G,
        AndTV_GEq,
        OrTV_Eq,
        OrTV_LEq,
        OrTV_L,
        OrTV_G,
        OrTV_GEq,
        AngleAbove,
        AngleBelow,
        AngleDivergence,
        AndS,
        AndPS,
        AndPTS,
        OrS,
        OrPS,
        OrPTS,
        AndTS,
        AndBS,
        OrTS,
        OrBS,
        All,
        All_s,
        SETSIGNAL,
        Set_Signal,
        Get_Signal,
        Set_Previous_Signal,
        Get_Previous_Signal,
        Set_Signal_Value,
        Set_Signal_Time,
        Set_Signal_Price,
        Set_Previous_Signal_Value,
        SValue,
        SPValue,
        STime,
        SPTime,
        SPrice,
        SPPrice,
        SetSignalFilter,
        GetSignalFilter,
        FindNothing,
        ReturnItemFromShift,
        FindStochastic,
        FindMACD,
        SimpleSeperateAlgo,
        CheckLevels,
        FindBB,
        MovingAverageAlgo,
        SARAlgo,
        FindVolume,
        FindBar,
        FindPivotPoints,
        FindMax,
        FindMin,
        FindFirstMaxMin,
        FindProgress,
        FindOpen,
        FindClose,
        FindHigh,
        FindLow,
        FindRS,
        FindFractals,
        FindFiboPoints,
        GetHeikenAshiClose,
        GetHeikenAshiOpen,
        GetHeikenAshi,
        FindHeikenAshi,
        GetSignalCallbackFromObject,
       `

    function evalcontext (functionname, functiondef) {
        return ('function EvalContext  () {' + contextdef + functiondef + contextreturn + functionname +'}}')
    }

    function ExpertContext (functionname, functiondef) {
        let functionstring  = evalcontext (functionname, functiondef)
        window.eval (functionstring)
        return new EvalContext();
    }