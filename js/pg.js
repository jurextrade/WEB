
var CODE_SS             = 0;
var CODE_CPP            = 1;





function pg_solution () {
    let  site           = solution.get('site');
    let  user           = solution.get('user')
    

    solution.UserName       = user.name;
    solution.UserMail       = user.mail;
    solution.get('user').id         = user.id;
    solution.UserUrl        = solution.get('user').id != 0 ? 'Hello ' + solution.UserName : '';
    solution.UserAdmin      = solution.get('user').id != 1 ? false : true;

    solution.PG             = null;
    solution.PL             = null;
    solution.PLSELL         = null;
    

// pl parser

    solution.Terminals      = [];
    solution.DefaultLoaded  = false;

//    solution.tradedesk_PG  = new pg ('tradedesk');
//    solution.project_PG    = new pg ('project');
  //  solution.option_PG     = new pg ('option');
    

    solution.LoadProfile = function (async, interfacecallback, par) {
        if (!async) async = false;
        let  user           = solution.get('user')

        var url = user.path + "/";

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                var i = 0;
                solution.LastProjectName = lines[i];
                i++;
                solution.LastStrategyName = lines[i];
                i++;
                solution.LastTerminalType = lines[i];
                i++;
                solution.LastTerminalName = lines[i];
                i++;
                solution.LastPlatform = lines[i];
                i++;
                solution.LastTerminalLeftBar = lines[i];
                i++;
                solution.LastTerminalRightBar = lines[i];
                i++;
    
                if (interfacecallback)  interfacecallback (par);            
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Load Profile ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }                    
        };
        xhttp.open("GET", url + "PG_Profile.txt", async);
   //     xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.send();
    }  


    solution.LoadObjects = function (url, async, interfacecallback, par) {
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();
       
        xhttp.onreadystatechange = function () {
            solution.PG.Objects = [];
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                var headings = lines[0].split(','); // Splice up the first row to get the headings
                var pobject = null;
                for (var j = 1; j < lines.length; j++) {
                    if (lines[j] == "") continue;
                    var values = lines[j].split(','); // Split up the comma seperated values
                    //pgobject (id, name, type, cross, period, method, apply, shift, mode, displaytype, display, leveltype, value, levels) {
                    pobject = new pgobject(values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], [values[12], values[13], values[14], values[15]]);
                    if (pobject.Type == "CUSTOM" || pobject.Type == "PREDEFINED") {
                        pobject.ProgName = values[4];
                    } else {
                        if (pobject.Type == "SAR") pobject.Step = values[4];
                        else pobject.Period = values[4];
                    }
                    k = 1;
                    for (var a = 0; a < 5; a++)
                        for (i = 0; i < NBR_PERIODS; i++) {
                            pobject.Level[a][i] = values[15 + k] == "--" ? EMPTY_VALUE : +values[15 + k];
                            k = k + 1;
                        }
                    solution.PG.Objects.push(pobject);
                }
                if (interfacecallback)  interfacecallback (par);            
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadObjects ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }                    
        };
        xhttp.open("GET", url, async);
        
        xhttp.send();
    }

    solution.LoadFields = function (url, async, interfacecallback, par) {
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();

        FieldsItems = [];
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                var headings = lines[0].split(','); // Splice up the first row to get the headings
                var objname = "";
                var object = null;
                var i = 0;
                for (var j = 1; j < lines.length; j++) {
                    if (lines[j] == "") continue;
                    var values = lines[j].split(',');
                    solution.PG.Fields.push({
                        recid: 500 + i,
                        Type: values[0],
                        name: values[1],
                        CName: values[2],
                        Description: values[3]
                    });
                    FieldsItems.push({
                        recid: 500 + i,
                        Type: values[0],
                        name: values[1],
                        CName: values[2],
                        Description: values[3],
                        //w2ui: {style: "color: black; background-color: DarkKhaki"}
                        w2ui: {style: 'color: ' + (values[0] == "io" ? 'black' : 'yellow') + '; background-color: ' + 'DarkKhaki'}                        
                    });
                    ActionDescription.push({
                        id: 500 + i,
                        text: values[3]
                    });
                    i++;
                }
                if (interfacecallback)  interfacecallback (par);            
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadFields ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }                    
        }
        xhttp.open("GET", url, async);
        xhttp.send();
    }
    
    solution.LoadSignals = function (url, async, interfacecallback, par) {
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
    
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                var headings = lines[0].split(','); // Splice up the first row to get the headings
                var objname = "";
                var object = null;
                var i = 0;
    
                for (var j = 1; j < lines.length; j++) {
                    if (lines[j] == "") continue;
                    var values = lines[j].split(',');
    
                    if (objname != values[0]) {
                        i = 0;
                        object = {objectname: values[0], signals: []};
                        solution.PG.ObjectSignals.push(object);
                        objname = values[0];
                    }
                    object.signals.push({recid: i, text: values[1], type: SignalType[SignalName.indexOf(values[1])], description: values[2]});
                    i++;
                }
                if (interfacecallback)  interfacecallback (par);            
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadSignals ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }                    
        }
        xhttp.open("GET", url, async);
        xhttp.send();
    }  

    solution.LoadPGDefault = function (pname) {
        let  site           = solution.get('site');     
  //      console.log ('Loading SOLUTION PG')
        var interfacecallback = null;
        this.LoadSignals(site.address + "/Terminal/MQL4/Files/PG_Signals.csv",   ASYNCHRONE, interfacecallback, null);
        this.LoadFields(site.address + "/Terminal/MQL4/Files/PG_Fields.csv",     ASYNCHRONE, interfacecallback, null);
        this.LoadObjects(site.address + "/Terminal/MQL4/Files/PG_Objects.csv",   SYNCHRONE, null, pname);

    }
   
    solution.UpdateObjects = function (pname) {
       solution.PG.Objects  = solution.Objects;
    }

    solution.UpdatePredefinedIndicators = function (pname) {
        let menu = [];
        for (var j = 0; j < solution.PG.Objects.length; j++) {
            menu.push({
                id:'indicator_' + solution.PG.Objects[j].Name, type: 'link', item: solution.PG.Objects[j].Name, icon: icon_indicator,
                attributes:{selector: 'selectindicator', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}                         
            });
        }        
        sb.tree_additems (pname + '_tree_predefinedindicators', menu);  
    }

 // project    
    solution.UpdateIndicators = function (pararray) {
        let terminal = pararray[0];
        let pname    = terminal.pname;
        let PG       = terminal.PG;     
        
        let tree_items = [];
        for (var j = 0; j < PG.Objects.length; j++) {
            if (PG.Objects[j].Type == 'PREDEFINED') {
                continue;
            } else
            if (PG.Objects[j].Type == 'SYSTEM') {
                tree_items.push({id:'indicator_' + PG.Objects[j].Name, type: 'link', item: PG.Objects[j].Name, icon: icon_indicator,
                    attributes:{selector: 'selectindicator', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}        
                    });
            } else {
    
                tree_items.push({id:'indicator_' + PG.Objects[j].Name, type: 'link', item: PG.Objects[j].Name, icon: icon_indicator,
                    attributes:{selector: 'selectindicator', draggable: 'true', ondragstart: 'ondragstart_treeitem(this, event)'},
                    events:{onclick: 'onclick_treeitem(this)',  oncontextmenu:'oncontextmenu_treeitem(this, event)'}    
                    });
            }
        }
        sb.tree_additems (pname + '_tree_createdindicators', tree_items);    
        $('#' + pname + '_tree_createdindicators').addClass('show');    
    }
    
    solution.UpdateStrategies = function (terminal) {
        terminal.Loaded = 1;    
    }

    solution.UpdateSchedules = function (terminal) {
        var PG = terminal.PG;         
        for (var j = 0; j < PG.Schedules.length; j++) {
            var schedule = PG.Schedules[j];
            var engine = PG.GetEngineFromRuleOperation(schedule.StartRule, schedule.Operation, );
            if (!engine) continue;
            engine.Schedules.push(schedule);
        }
    }    
    solution.GetCurrentTerminal = function (pname) {
        if (pname == undefined){
            return this.ui.currentplatform ? this.ui.currentplatform.data : null;
        }
        let platform = this.ui.platform_get ('pname', pname)

        return platform ? platform.data : null
    }

    solution.GetPGFromTerminal  = function (terminal) {

        if (terminal) {
            return terminal.PG;
        }
        terminal = this.GetCurrentTerminal ();

        if (terminal) {
            return terminal.PG;
        }
        else {
            return this.PG;
        }                
    }

    solution.GetCanvasFromTerminal = function (terminal) {
        var PG = this.GetPGFromTerminal (terminal);
        return (PG ? PG.Canvas : null);
    }

    solution.GetTerminalsFromDataPath = function (datapath) {  // data path [//yahoo for option, //Main for home, ... ]
        let terminals = [];
        for (var i = 0; i < this.Terminals.length; i++) {
            if (this.Terminals[i].DataPath == datapath) terminals.push(this.Terminals[i]);
        }
        return terminals;
    }

    solution.GetTerminalsFromName = function (name) {
        let terminals = [];
        for (var i = 0; i < this.Terminals.length; i++) {
            if (this.Terminals[i].Name == name) terminals.push(this.Terminals[i]);
        }
        return terminals;
    }

    solution.GetTerminalsFromType = function (type) {  // terminals type [ Terminal, Tester, Yahoo, IB]
        let terminals = [];        
        for (var i = 0; i < this.Terminals.length; i++) {
            if (this.Terminals[i].Type == type) terminals.push(this.Terminals[i]);
        }
        return terminals;
    }
  // option
    solution.GetFieldFromName = function (fieldname) {
        for (var i = 0; i < this.PG.Fields.length; i++) {
            if (this.PG.Fields[i].name == fieldname) return this.PG.Fields[i];
        }
        return null;
    }
    solution.AddYahooTerminal = function (accountnumber, accountname, terminalname, terminaltype, datapath) {
        let  site           = solution.get('site');        
        var http = new XMLHttpRequest();
        var url =   site.address + '/wp-login1.php?action=add&' + 'user_login=' + this.get('user').name +  '&accountnumber=' + accountnumber + '&accountname=' + accountname + '&terminalname=' + terminalname + '&datapath=' + datapath + '&terminaltype=' + terminaltype;
        http.open('GET', url, false);
    	http.onreadystatechange = function() {//Call a function when the state chan
    	    if(http.readyState == 4 && http.status == 200) {
    		var userid = 0;
    		if (http.responseText == '0')  {
    			}
    			else {
    				userid = http.responseText;
    			}
    		}
    	}
        http.send(null);
    }

    solution.InitPG = function () {
            solution.PG = new pg('project');
            solution.PG.ObjectSignals  = [];
            solution.PG.Fields         = [];
       
        }
 
    solution.InitPL = function () {
        solution.PL = new pl(parser);
        solution.PL.Trace = function (text) {
       //     console.log (text);
        };
        solution.PL.Clear = function (text) {
            var textarea = $('#error');
            if (textarea) textarea.val("");
        }
        solution.PLSELL = new pl(parser);
        solution.PLSELL.Trace = function (text) {
       //     console.log (text);
        };
        solution.PLSELL.Clear = function (text) {
            var textarea = $('#error');
            if (textarea) textarea.val("");
        }
    }
    
    solution.InitPL();
    solution.InitPG()
   // AnimationInit(); 
}


var asynchronous = false;
var serverlink;


var     TRADE_STOCK     = 2;
var TRADE_PUT       = 3;
var TRADE_CALL      = 4;


var TRADE_VOLUME = 0;
var TRADE_RISK = 1;

var PIPS_SLTP = 0;
var ATR_SLTP = 1;

const ENTRY_SPOT        = 0;
const ENTRY_PRECISE     = 1;

const TRADE_ENTRY_MENU = [{id: ENTRY_SPOT, text: 'Spot'}, {id: ENTRY_PRECISE, text: 'Set Price'}];

const VOLUME_PIPS       = 0;
const VOLUME_RISK       = 1;
const TRADE_VOLUME_MENU = [{id: VOLUME_PIPS, text: 'Volume'}, {id: VOLUME_RISK, text: 'Account %'}]

const SLTP_PIPS         = 0;
const SLTP_ATR          = 1;
const TRADE_SLTP_MENU = [{id: SLTP_PIPS, text: 'PIPS'}, {id: SLTP_ATR, text: 'ATR (14)'}]


const EMPTY_VALUE = 0x7FFFFFFF;

var DefaultStrategyDescription = '<h3 id="desc_description">DESCRIPTION</h3><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><h3 id="desc_indicators">INDICATORS</h3><p><br></p><p><br></p><h3><br></h3><h3 id="desc_periods">PERIOD</h3><p><br></p><h3><br></h3><h3 id="desc_buy">BUY</h3><p><br></p><p><br></p><p><br></p><h3 id="desc_sell">SELL</h3><p><br></p><p><br></p><h3 id="desc_stoploss">STOP LOSS</h3><p><br></p><p><br></p><h3 id="desc_takeprofit">TAKE PROFIT</h3><p><br></p><p><br></p><h3 id="desc_exit">EXIT</h3><p><br></p><p><br></p>';



function UpdateTerminals (solution) {
    UpdateMT4Terminals(solution)
    UpdateOptionTerminals(solution)
}

function pguser() {
    this.AccountName = '';
    this.AccountNumber = '';
    this.AccountEquity = '';
    this.AccountBalance = '';
    this.AccountFreeMargin = '';
    this.AccountMargin = '';
    this.AccountLeverage = '';
    this.AccountProfit = '';
    this.AccountTotalProfit = '';
    this.AccountNbrLots = '';
    this.AccountStartDate = 0;
    this.AccountActualDate = '';
    this.AccountCurrency = '';
    this.Terminal = null;
    this.TerminalTimeShift = '';
};

function pgcurrency(name, pname, soundname, description) {
    
}

function pgtradeorders (symbol)  {
    this.buyorder  = new pgtradeorder(symbol, OP_BUY);
    this.sellorder = new pgtradeorder(symbol, OP_SELL);
    this.operation = null;

    this.reset  = function (type) {
        if (type == OP_BUY) {
            this.buyorder.Init(); 
        } else
        if (type == OP_SELL) {
            this.sellorder.Init(); 
        } 
    } 
    this.getorder = function (type) {
        if (type == OP_BUY) {
            return this.buyorder; 
        } else
        if (type == OP_SELL) {
            return this.sellorder; 
        } 
        return null;
    }    
}

function pgtradeorder (symbol, type)  {
    this.type             = type;
    this.Init = function () {
        this.tradeentry_type  =  TRADE_ENTRY_MENU[ENTRY_SPOT].id;
        this.tradeentry_value =  [{value: symbol.Bid, fields: {min: '0', max: '', step:  symbol.Point}},  {value: symbol.Bid, fields: {min: '0', max: '', step:  symbol.Point}}];
        this.tradesize_type   =  TRADE_VOLUME_MENU[VOLUME_PIPS].id;
        this.tradesize_value  =  [{value: symbol.MinLot, fields: {min: symbol.AdjustSLTPPips, max: symbol.MaxLot, step: symbol.LotStep}},  {value:'2.0', value_a : symbol.MinLot, fields: {min:'0.1', max:'100', step: '0.50'}}];       
        this.stoploss_type    =  TRADE_SLTP_MENU[SLTP_PIPS].id;
        this.stoploss_value   =  [{value:'0', fields: {min: '0', max: '', step: '0.5'}}, {value: '0', value_a: '0', fields: {min: '0', max: '10', step: '0.1'}}];  
        this.takeprofit_type  =  TRADE_SLTP_MENU[SLTP_PIPS].id;
        this.takeprofit_value = [{value:'0', fields: {min: '0', max: '', step: '0.5'}}, {value: '0', value_a: '0', fields: {min: '0', max: '10', step: '0.1'}}];       
    }
    this.get_tradeentry_value = function () {
        return +this.tradeentry_value[this.tradeentry_type].value;
    }
    this.get_tradesize_value = function () {
        return this.tradesize_type == VOLUME_RISK ? +this.tradesize_value[this.tradesize_type].value_a : +this.tradesize_value[this.tradesize_type].value;
    }
    this.get_stoploss_value = function () {
        return this.stoploss_type == SLTP_ATR ? +this.stoploss_value[this.stoploss_type].value_a : +this.stoploss_value[this.stoploss_type].value;
    }
    this.get_takeprofit_value = function () {
        return this.takeprofit_type == SLTP_ATR ? +this.takeprofit_value[this.takeprofit_type].value_a : +this.takeprofit_value[this.takeprofit_type].value;
    }
    this.Init ()
}

function pgsymbol(name, pname, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize, tester, period) {

    this.CalculateLotValue = function (accountequity, percent) {
        let digits = numDecimals(this.MinLot);
        let value = (+accountequity  * percent / 1000000).toFixed(digits);    
        return value;
    }
    this.CalcultatePipValue = function (accountcurrency) {
        if (this.PipValue != 0) {
            return -1;  // already calculated;
        }
        // calculate PIP VALUE     
        let currencypair = GetCurrencyPair(this.Name);
        if (currencypair.length != 2) {
            console.log ('currency pair not found')
            this.PipValue = -2;
            return -2;
        }
    
        this.FCurrency = currencypair[0];
        this.TCurrency = currencypair[1];
        if (this.TCurrency.Name == accountcurrency) {
            this.PipValue = (this.SysPoint * this.LotSize).toFixed(2);
        } else
        if (this.FCurrency.Name == accountcurrency) {
            this.PipValue = ((this.SysPoint * this.LotSize) / this.Ask).toFixed(2);
        }
    }
    this.Set = function (name, pname, minlot, maxlot, lotstep, spread, stoplevel, point, digits, lotsize, tester, period) {
        this.Name = name;
        this.PName = pname;
        this.MinLot = +minlot;
        this.MaxLot = +maxlot;
        this.LotStep = +lotstep;
        this.Spread = +spread;
        this.StopLevel = +stoplevel;
        this.Point = +point;
        this.Digits = +digits;
        this.LotSize = +lotsize;
        this.Tester = +tester;
        this.Period = +period;
        var multiplier = 1;
        if (digits == 2 || digits == 4) multiplier = 1;
        if (digits == 3 || digits == 5) multiplier = 10;
        if (digits == 6) multiplier = 100;
        if (digits == 7) multiplier = 1000;
        this.SysPoint = point * multiplier;
        this.Contracts = [];
        this.Expiries = [];
        this.Strikes = [];   
        this.SelectedContracts = [];    
        this.NbrContracts = 0;
        this.NbrContractRead = 0;
        this.Order = new pgtradeorders(this); // BUY OR SELL      
        for (var i = 0; i < PeriodName.length; i++) {
            this.chartData[i] = [];
            this.WaitHistory[i] = false;
            this.NbrCandles[i] = 0;
            this.periodSeperatorData[i] = [];
            this.xextents[i] = null;
        };                  

    }
    
    this.Name = name;
    this.PName = "";
    this.Connected = false;
    this.FCurrency = null;
    this.TCurrency = null;
    this.Quote;
    this.PriceChange = '';
    this.PriceChangePercent = null;
    this.ReqId = -1;
    this.Ticker;
    this.PipValue = 0;
    this.Slippage;
    
    this.Description;
    this.TimeCurrent;
  
    this.Ask = 0;
    this.Bid = 0;
    this.Last = 0;
    this.ATR = [];
     
    this.TradeOrder = -1; // BUY OR SELL        
    this.BuyEntry = 0;    //price
    this.SellEntry = 0;
    this.BuyTP = 0;
    this.BuySL = 0;
    this.SellTP = 0;
    this.SellSL = 0;
    this.BuyVolume = 0;
    this.SellVolume = 0;
    this.RightType = TRADE_STOCK;  // can be also put or call
    this.BuyNbrLots = 0;
    this.SellNbrLots = 0;
    this.BuyProfit = 0;
    this.SellProfit = 0;
    this.Profit = 0;
    this.Weight = 0;
    this.ordersData = [];
    this.UpLevel = [];
    this.DownLevel = [];
    this.Output = "";
    this.plotData = null;
    this.chartData = [];
    this.profitData = [];
    this.WaitHistory = [];
    this.NbrCandles = [];
    this.periodSeperatorData = [];
    this.xextents = [];
    this.Contracts = [];  
    this.Strikes = [];
    this.Expiries = [];
    this.SelectedContracts = [];    


    this.AddContract = function (recid) {
        for (var i = 0; i < this.SelectedContracts.length; i++)
            if (this.SelectedContracts[i].Recid == recid) return false;

        var right  = recid.charAt(0);
        var expiry = recid.substring (recid.length - 8);
        var strike = +recid.substring (1, recid.length - 8);

        binaryInsert2fields({Strike:strike, Expiry:expiry, Right: right, Recid: recid} ,'Strike', 'Expiry', this.SelectedContracts, false);
        return true;
    }

    this.RemoveContract = function (recid) {
        for (var i = 0; i < this.SelectedContracts.length; i++) {
            if (this.SelectedContracts[i].Recid == recid) {
                this.SelectedContracts.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    this.GetContract = function (right, strike, expiry) {
        for (var i = 0; i < this.Contracts.length; i++) {
            if (this.Contracts[i].summary.strike == strike && this.Contracts[i].summary.expiry == expiry && this.Contracts[i].summary.right == right) 
                return this.Contracts[i];
        }            
        return null;
    }
    this.GetContractFromName = function (name) {
        for (var i = 0; i < this.Contracts.length; i++) {
            if (this.Contracts[i].summary.localSymbol == name) 
                return this.Contracts[i];
        }            
        return null;
    }

};

function pgproject (pname, name, path) {
    this.pname                   = pname; 
    this.Folder                  = path;    
    this.Name                    = name;
    this.Path                    = path;

   
    this.Loaded                  = 0; 
    this.Server                  = solution.DeployServer_Address;
    this.Port                    = solution.DeployServer_Port;    
    this.Com                     = null;

    this.PG                      = new pg(this.pname);
    this.PG.Canvas.ShowLeftAxis  = false;          

    this.CurrentStrategy         = null;

    this.Create = function () {
        return SubmitProjectRequest('Projects',this.Folder, this.Name, '', 'php/create_project.php', SYNCHRONE);
    }

    this.Remove = function () {
        if (solution.get('user').id == "0") return;        
        return SubmitProjectRequest('Projects',this.Folder, this.Name, '', 'php/remove_project.php', SYNCHRONE);
    }

    this.Rename = function (newname) {
        if (solution.get('user').id == "0") return;        
        return SubmitProjectRequest('Projects',this.Folder, newname, '', 'php/rename_project.php', SYNCHRONE);
    }
    
    this.Save = function () {
        if (solution.get('user').id == "0") return;

        let  user           = solution.get('user')        
        
        var rootproject = user.path + '/Projects/' + this.Folder + "/MQL4/Files/";
        
        
        this.Create();
        
        this.PG.SaveObjects(this.Folder);
        this.PG.SaveEngines(this.Folder);
        this.PG.SaveStrategies(this.Folder, this.Name);
        
        this.PG.SaveSchedules(this.Folder);
    	this.PG.SaveConditions(this.Folder);
        this.PG.SaveMarkers (this, 'project');        
        

        /*    	
                this.PG.SaveAlerts(solution.SiteAdress + rootproject + "input/ss/PG_Alerts.ss", this.Folder);	 
            	this.PG.SaveSystemObjects (this, solution.SiteAdress + rootproject + "input/ss/PG_SystemObjects.ss");
        */
    }
    this.Load = function () {
        let  site           = solution.get('site');
        let  user           = solution.get('user')          
        this.PG.Clear();

        var rootproject = user.path + '/Projects/' + this.Folder + "/MQL4/Files/";
        
        this.PG.G_Load(rootproject + 'PG_Objects.csv', ASYNCHRONE,  this.PG.LoadObjects, [this], solution.UpdateIndicators, [this]);
        this.PG.G_Load(rootproject + 'PG_Engines.csv', ASYNCHRONE,  this.PG.LoadEngines, [this, rootproject] , project_updateengines, [this]);
        this.PG.G_Load(rootproject + 'input/ss/' + 'PG_Logicals.ss', ASYNCHRONE, this.PG.LoadConditions, [this], project_updateconditions, [this]);
        this.PG.G_Load(rootproject + 'PG_Alerts.scv',  ASYNCHRONE, this.PG.LoadAlerts, [this]);
        this.PG.G_Load(rootproject + 'PG_Markers.sc',  ASYNCHRONE, this.PG.LoadMarkers, [this]);        
        this.PG.LoadExperts(solution,  site.address + "/php/read_experts.php",this.Folder,       ASYNCHRONE, project_updateexperts, this);

    }

    this.Distribute = function (terminalfolder, terminaltype) {
        SubmitDistributeRequest(this.Folder, '/php/distribute_project.php', terminalfolder, terminaltype);
    }

    this.GenerateObjects = function (type) {
        var s = "";
        for (var i = 0; i < this.PG.Objects.length; i++) {
            if (this.PG.Objects[i].Id >= this.PG.NBR_DEFOBJECTS)
                if (type == JS_GENERATION) s = s + "var " + object.Name + " = " + object.Id + ";\n";
                else s += '#define ' + this.PG.Objects[i].Name + ' ' + this.PG.Objects[i].Id + '\n';
        }
        return s;
    }
    this.GenerateCSystemObjectFile = function () {
        var s = "";
        s += "#include \"Progress.h\"\n";
        s += "#include \"PG_Objects.h\"\n";
        s += "#include \"PG_Logicals.h\"\n\n";
        s += "//--------------------------------- SYSTEM OBJECTS ARE HERE  -------------------------------------------\n\n";
        s += "void SYSTEM (x)\n{\n";
        for (var i = 0; i < this.PG.Objects.length; i++) {
            var object = this.PG.Objects[i];
            if (object.Type != "SYSTEM") continue;
            s += "//--- " + object.Name + " -------------------------------------------\n\n";
            s += GenerateCSystemObject(C_GENERATION, object);
        }
        s += "\n\n";
        return s;
    }
    
    this.GenerateCConditionFile = function () {
        var s = "";
        s += "#include \"Progress.h\"\n";
        s += "#include \"PG_Objects.h\"\n";
        s += "#include \"PG_Logicals.h\"\n\n";
        s += "//--------------------------------- CONDITIONS ARE HERE  -------------------------------------------\n\n";
        for (var i = 0; i < this.PG.Conditions.length; i++) {
            var condition = this.PG.Conditions[i];
            s += "//--- " + condition.Name + " -------------------------------------------\n\n";
            s += GenerateCondition(C_GENERATION, condition);
        }
        s += "\n\n";
        return s;
    }

    this.GenerateMQ4EntryRules  = function (strategy) {
        var s = "";
        s += "void SetEntryRules  ()\n";
        s += "{\n";
        if (!strategy) {
            for (var i = 0; i < this.PG.Strategies.length; i++) {
                s += "  R_RULE_" + this.PG.Strategies[i].pBEngine.StartRule + " ();\n";
            }
        }
        else {
            s += "  R_RULE_" + strategy.pBEngine.StartRule + " ();\n";
        }
        s += "}\n\n";  
        return s;
    }

    this.GenerateMQ4File = function () {
        var s = "";
                

        s += "//---------------------------------  GENERATE OBJECT FILE       -------------------------------------------\n\n";
        s = "\nstring ObjectString = " + this.PG.SaveObjectsInString() + ";\n";        

        s += "//---------------------------------  GENERATE ENGINE FILE       -------------------------------------------\n\n";
        s += "\nstring EngineString = " + this.PG.SaveEnginesInString() + ";\n";        

        s += "//---------------------------------  GENERATE SCHEDULE FILE       -------------------------------------------\n\n";
        s += "\nstring ScheduleString = " + this.PG.SaveSchedulesInString() + ";\n";  

        s += "//---------------------------------  GENERATE DEFINE       -------------------------------------------\n\n";
        s += this.GenerateObjects(MQ4_GENERATION);
        s += "\n\n";


        s += "//--------------------------------- STRATEGIES Rules -------------------------------------------\n\n";
        
        for (var i = 0; i < this.PG.Strategies.length; i++) {
            var s_strategy = GenerateMQ4Strategy(this.PG.Strategies[i]);
            s += GenerateVariables(MQ4_GENERATION, GLOBAL_VARIABLE);
            s += s_strategy;
        }
        s += "\n\n";

        s += "//--------------------------------- GENERATE ENTRY Rules -------------------------------------------\n\n";
        
        s += this.GenerateMQ4EntryRules ();

        s += "\n\n";

        return s;
    }    
    
    this.GenerateCFile = function (sfile) {
        var s = "";
        s += "#include \"Progress.h\"\n";
//        s += "#include \"PG_Objects.h\"\n";
//        s += "#include \"PG_Logicals.h\"\n\n";
        
        
        s += "//---------------------------------  GENERATE DEFINE       -------------------------------------------\n\n";
        s += this.GenerateObjects(C_GENERATION);
        s += "\n\n";
        s += "//--------------------------------- CONDITIONS ARE HERE  -------------------------------------------\n\n";
        
        
        s += "//********************************  CONDITION DEFINE + EXTERN *****************************************\n\n";
        for (var i = 0; i < this.PG.Conditions.length; i++) {
            var condition = this.PG.Conditions[i];
            s += GenerateCExternCondition(condition);
        }
        s += "\n\n";
        s += "//--------------------------------- SYSTEM OBJECTS ARE HERE  -------------------------------------------\n\n";
        s += "void SYSTEM (x)\n{\n";
        for (var i = 0; i < this.PG.Objects.length; i++) {
            var object = this.PG.Objects[i];
            if (object.Type != "SYSTEM") continue;
            s += "//--- " + object.Name + " -------------------------------------------\n\n";
            s += GenerateCSystemObject(C_GENERATION, object);
        }
        s += "}";
        s += "\n\n";
        s += "//********************************  CONDITION FUNCTIONS      *****************************************\n\n";
        for (var i = 0; i < this.PG.Conditions.length; i++) {
            var condition = this.PG.Conditions[i];
            s += "//--- " + condition.Name + " -------------------------------------------\n\n";
            s += GenerateCondition(C_GENERATION, condition);
        }
        s += "\n\n";
        s += "//--------------------------------- STRATEGIES Rules -------------------------------------------\n\n";
        for (var i = 0; i < this.PG.Strategies.length; i++) {
            var s_strategy = GenerateCStrategy(this.PG.Strategies[i]);
            s += GenerateVariables(C_GENERATION, GLOBAL_VARIABLE);
            s += s_strategy;
        }
        s += "\n\n";
        s += "//--------------------------------- Not Called Strategies Rules -------------------------------------------\n\n";
        for (var i = 0; i < NBR_RULES; i++)
            if (!this.PG.ReturnEngineFromRule(RuleName[i])) s += "void R_RULE (" + RuleName[i] + ")\n{};\n";
        return s;
    }
    
    this.NewStrategy = function (name, strategytype) {
        var RuleId = this.PG.ReturnNextRuleId();
        if (RuleId == -1) {
            return null;
        }
/*new engine*/
        var engine = pgengine_s(this.PG, OP_BUYSELL, RuleId);
        engine.RecoveryMode = strategytype.name;
        engine.Name = name;
        engine.Schedules[0] = new pgschedule(engine.StartRule, engine.Operation, '', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1');
        
        this.PG.Engines.push(engine);
        

/*new strategy*/
        var strategy = new pgstrategy();
        strategy.Name = engine.Name;
        strategy.Rule = RuleId;
        strategy.Operation = OP_BUYSELL;
        strategy.ShouldSave = true;
        strategy.Created = true;
        
        
        this.PG.Strategies.push(strategy);
        
        if (engine.Operation == "BUY" || engine.Operation == "BUYSELL") strategy.pBEngine = engine;
        
        if (engine.Operation == "BUYSELL") engine.SCContent = "(START)\n(BUY)\n(SELL)\n(EXIT)\n ";
        
        if (engine.Operation == "BUY") engine.SCContent = "(START)\n(BUY)\n(EXIT)\n ";
        
        if (engine.Operation == "SELL") {
            strategy.pSEngine = engine;
            strategy.Operation = OP_BUY;
            engine.SCContent = "(START)\n(SELL)\n(EXIT)\n ";
        }

        var project = this;
        for (var i = 0; i < project.PG.Strategies.length; i++) {
            if (project.PG.Strategies[i].pBEngine == null) {
                project.PG.Strategies[i].pBEngine = new pgengine(project.PG, OP_BUY, RuleName[RuleId]);
                project.PG.Strategies[i].pBEngine.Name = project.PG.Strategies[i].pSEngine.Name;
                project.PG.Engines.push(PG.Strategies[i].pBEngine);
            }
            if (project.PG.Strategies[i].pSEngine == null) {
                project.PG.Strategies[i].pSEngine = new pgengine(project.PG, OP_SELL, RuleName[RuleId]);
                project.PG.Strategies[i].pSEngine.Name == project.PG.Strategies[i].pBEngine.Name;
            }
        }
        return strategy;
    }
    this.PasteStrategy = function (fromstrategy) {
        var strategy = fromstrategy.Clone();
        var name = strategy.Name;
        var rule = strategy.Rule;
        if (this.PG.GetStrategyFromName(name)) {
            var newname = name;
            var i = 0;
            while (i >= 0) {
                if (this.PG.GetStrategyFromName(newname + i)) i++;
                else {
                    name = newname + i;
                    break;
                }
            }
        }
        if (this.PG.ReturnStrategyFromRule(rule)) {
            rule = this.PG.ReturnNextRuleId();
            if (rule == -1) {
                AfxMessageBox("Create new Strategy : Max Reached", MB_ICONEXCLAMATION);
                return null;
            }
        }
        strategy.pBEngine.StartRule = RuleName[rule];
        strategy.pBEngine.BuyRule = RuleName[rule];
        strategy.pBEngine.SellRule = RuleName[rule];
        strategy.pBEngine.ExitBuyRule = RuleName[rule];
        strategy.pBEngine.ExitSellRule = RuleName[rule];
        strategy.pBEngine.ExitRule = RuleName[rule];
        strategy.pSEngine.StartRule = RuleName[rule];
        strategy.pSEngine.BuyRule = RuleName[rule];
        strategy.pSEngine.SellRule = RuleName[rule];
        strategy.pSEngine.ExitBuyRule = RuleName[rule];
        strategy.pSEngine.ExitSellRule = RuleName[rule];
        strategy.pSEngine.ExitRule = RuleName[rule];
        this.PG.Engines.push(strategy.pBEngine);
        if (strategy.Operation == OP_BUY) {
            this.PG.Engines.push(strategy.pSEngine);
        }
        this.PG.Strategies.push(strategy);
        strategy.pBEngine.Name = name;
        strategy.pSEngine.Name = name;
        strategy.Name = name;
        strategy.Rule = rule;
        return strategy;
    }
  //  DeployConnect(this, this.Server, this.Port)
}

function pgterminal (pname, type, main) {

    this.pname          = pname;
    this.PG             = new pg(this.pname);    

    this.Name           = '';
    this.Path           = '---';
    this.Folder         = '';    
    this.Loaded         = 0; //we do a load on this terminal
    this.Server         = solution.MT4Server_Address;                   //MT4 Server
    this.Port           = solution.MT4Server_Port;
    this.Reconnection   = solution.MT4Server_Reconnection;
    this.Com            = null;
    this.User           = new pguser();
    
    this.DataPath = '---';
    this.Build = '---';
    this.Company = '---';
    this.TimeShift = '---';
    this.Type = type; // Tester running = 1

    this.Periods = []; // Periods on which expert is running    

    this.DailyTargetProfit = 0;
    this.DailyTargetStopLoss = 0;
    this.DailyTargetReached = 0;
    this.WeeklyTargetProfit = 0;
    this.WeeklyTargetStopLoss = 0;
    this.WeeklyTargetReached = 0;
    this.PercentDailyTargetProfit = 0;
    this.PercentDailyTargetStopLoss = 0;
    this.PercentWeeklyTargetProfit = 0;
    this.PercentWeeklyTargetStopLoss = 0;

    
    this.InitDone = false;
    this.Running = false;

    this.Load = function () {
        
        this.PG.Clear();
        let  site           = solution.get('site');        
        let  user           = solution.get('user')              
         if (this.Type == 'Terminal' || this.Type == 'Tester') {

            let rootterminal = this.Type == 'Terminal' ? user.path + "/Terminal/" + this.Folder + "/MQL4/Files/" : user.path + "/Terminal/" + this.Folder + "/tester/files/";
            this.PG.G_Load(rootterminal + 'PG_Objects.csv', ASYNCHRONE,  this.PG.LoadObjects, [this], solution.UpdateIndicators, [this]);        
            this.PG.G_Load(rootterminal + 'PG_Engines.csv', ASYNCHRONE,  this.PG.LoadEngines, [this, rootterminal] , tradedesk_updateengines, [this]);  
            this.PG.G_Load(rootterminal + 'input/ss/' + 'PG_Logicals.ss', ASYNCHRONE, this.PG.LoadConditions, [this]);                     
            this.PG.G_Load(rootterminal + 'PG_Alerts.csv',  ASYNCHRONE, this.PG.LoadAlerts, [this], tradedesk_updatealerts, [this]);
            this.PG.G_Load(rootterminal + 'PG_Markers.sc',  ASYNCHRONE, this.PG.LoadMarkers, [this]);             


            this.PG.LoadPanel(site.address + rootterminal,    ASYNCHRONE,   UpdatePanel,    this);

       //     this.PG.LoadProfile(site.address + rootterminal,  ASYNCHRONE,   UpdateProfile,  this);
       //     this.PG.LoadSystemObjects(site.address + rootterminal + "input/ss/", true);

         }
         else {  // must be yahoo
            let rootterminal = user.path + "/Terminal/" + this.Folder + "/Files/" ;
            this.PG.G_Load(rootterminal + 'PG_Objects.csv', ASYNCHRONE, this.PG.LoadObjects, [this], solution.UpdateIndicators, [this]);   
            this.PG.LoadSymbols (site.address + rootterminal,     ASYNCHRONE, UpdateSymbols, this);
            this.PG.G_Load(rootterminal + 'PG_Alerts.csv',  ASYNCHRONE, this.PG.LoadAlerts, [this], UpdateAlerts, [this]);            

            this.PG.LoadProfile(site.address + rootterminal, ASYNCHRONE, UpdateProfile,   this);
            this.PG.G_Load(rootterminal + 'PG_Markers.sc',  ASYNCHRONE, this.PG.LoadMarkers, [this]);      

            if (this.Folder != "Main") {
                this.PG.LoadOrders (site.address + rootterminal,   ASYNCHRONE, UpdateOrders, this);
            }
         }    
    }


    this.Save = function () {
  
        if (solution.get('user').id == "0") {
            return;
        }
 
        let  user           = solution.get('user')     

        if (this.Type == 'Terminal' || this.Type == 'Tester') {
            var rootproject = this.Type == 'Terminal' ? user.path + "/Terminal/" + this.Folder + "/MQL4/Files/" : user.path + "/Terminal/" + this.Folder + "/tester/files/";
            this.PG.SaveProfile(this);            
            this.PG.SaveMarkers (this);                   
        }
        else {
            var rootterminal = user.path + "/Terminal/" + this.Folder + "/Files/" ;

            if (this.Folder != "Main")
                this.PG.SaveOrders(this);

            //this.PG.SaveAlerts(this);
            this.PG.SaveSymbols(this);
            //this.PG.SaveTObjects(this);
            this.PG.SaveProfile(this);         
            this.PG.SaveMarkers (this);                   
        }    
    }    
 
    this.Set = function (path, datapath, build, name, company, timeshift, symbol, tester, period) {
        this.Path = path;
        this.DataPath = datapath;
        this.Build = build;
        this.Name = name;
        this.Company = company;
        this.TimeShift = timeshift;
        this.Type = tester;
        this.Periods.push(period);
//        this.Symbols.push(symbol);
    }
    this.Clear = function () {
        this.PG     = solution.option_PG;     //new pg(this.pname);    
        this.User   = new pguser();

        this.Path = '---';
        this.DataPath = '---';
        this.Build = '---';
        this.Name = 'NO TERMINAL';
        this.Company = '---';
        this.TimeShift = '---';

        this.Symbols = []; // Symbols on which expert is running on this terminal
        this.Periods = []; // Periods on which expert is running    
        this.Loaded = 0; //we do a load on this terminal        
    }
}

function pg (pname) {

    this.Canvas             = new pgsymbolcanvas(this, pname);

    this.GraphicMainPanel = 0;
    this.GlobalComment = 0;

    this.MarketOpening = 0;
    this.OperationSound = 0;
    this.AlertsSound = 0;
    this.NewsSound = 0;
    
    this.ProjectName = "";
    this.Strategies = [];
    this.Engines = [];
    this.Symbols = [];
    this.Sessions = [];
    this.Connections = [];

    this.ManualHistory = null;
    this.Alerts = [];
    this.Orders = [];
    this.EOrders = [];
    this.Objects = [];
    this.Schedules = [];
    this.Variables = [];
    this.Conditions = [];
    this.Markers = [];
    this.Experts = [];  //Compiled MQ4 Experts

    this.Panel_Signals = [];
    this.Panel_Graphic = [];
    this.Panel_Objects = [];

    // MODIFY
    this.CreatedObjects = [];
    this.DeletedObjects = [];
    this.NBR_DEFOBJECTS = 50;   // next indicator id
  


    this.AddSymbol = function (Symbol) {
        var existsymbol = this.GetSymbolFromName(Symbol.Name);
        
        if (!existsymbol) {
            this.Symbols.push(Symbol);
        }
        else Symbol = existsymbol;
        
        for (var i = 0; i < this.Engines.length; i++) {
            Symbol.profitData[i] = [];
        }
/*
        CurrencyPair = GetCurrencyPair(Symbol.Name);
        if (CurrencyPair.length != 2) return;
        
        Symbol.FCurrency = CurrencyPair[0];
        Symbol.TCurrency = CurrencyPair[1];
        if (Symbol.TCurrency.Name == this.User.AccountCurrency) {
            Symbol.PipValue = (Symbol.SysPoint * Symbol.LotSize).toFixed(2);
        }
        if (Symbol.FCurrency.Name == this.User.AccountCurrency) {
            Symbol.PipValue = ((Symbol.SysPoint * Symbol.LotSize) / Symbol.Ask).toFixed(2);
        }
*/        
    }
    this.RemoveSymbol = function (symbol) {
        for (var i = 0; i < this.Symbols.length; i++) {
            if (this.Symbols[i].Name == symbol.Name) {
                this.Symbols.splice(i, 1);
                return true;
            }
        }
        return false;
    }
     
    this.ObjectFindName = function (objecttype) {
        var i = 0;
        var name = ObjectTypeName[objecttype] + '_';
        for (i = 0; i < 100; i++) {
            if (!this.GetObjectFromName(name + i) && !this.GetCreatedObjectFromName(name + i)) 
                break;
        }
        return name + i;
    }

    this.ConditionFindName = function() {
        var i = 0;
        var name = 'Condition' + '_';
        for (i = 0; i < 100; i++) {
            if (!this.GetConditionFromName(name + i)) 
                break;
        }
        return name + i;
     }

    this.StrategyFindName = function() {
        var name = 'strategy' + "_";
        var i = 0;
        while (i >= 0) {
            if (this.GetStrategyFromName(name + i)) i++;
            else {
                break;
            }
        }
        return name + i;
    }

    
    this.GetAlertFromId = function (id) {
        for (var i = 0; i < this.Alerts.length; i++) {
            if (this.Alerts[i].Id == id) return this.Alerts[i];
        }
        return null;
    }
    this.GetConditionFromName = function (name) {
        for (var i = 0; i < this.Conditions.length; i++) {
            if (this.Conditions[i].Name == name) return this.Conditions[i];
        }
        return null;
    }
    this.GetSignalIdFromName = function (name) {
        for (var i = 0; i < SignalName.length; i++) {
            if (SignalName[i] == name) return i;
        }
        return null;
    }


    this.GetSignalFromName = function (name) {
        for (var i = 0; i < this.Panel_Signals.length; i++) {
            if (this.Panel_Signals[i].Name == name) return this.Panel_Signals[i];
        }
        return null;
    }
    this.GetMarkerFromName = function (name) {
        for (var i = 0; i < this.Markers.length; i++) {
            if (this.Markers[i].Name == name) return this.Markers[i];
        }
        return null;
    }

    this.GetContractFromStrikeExpiry = function (symbol, right, strike, expiry) {
        for (var i = 0; i < symbol.Contracts.length; i++) {
            var contract = symbol.Contracts[i];
            if (contract.summary.strike == strike && contract.summary.expiry == expiry && contract.summary.right == right)
                return contract;
        }
        return null;
    }
    this.GetSymbolFromName = function (name) {
        for (var i = 0; i < this.Symbols.length; i++) {
            if (this.Symbols[i].Name == name) return this.Symbols[i];
        }
        return null;
    }
    this.GetStrategyFromEngine = function (engine) {
        for (var i = 0; i < this.Strategies.length; i++)
            if (this.Strategies[i].pBEngine == engine || this.Strategies[i].pSEngine == engine) return this.Strategies[i];
        return null;
    }
    this.GetSymbolIndexFromName = function (name) {
        for (var i = 0; i < this.Symbols.length; i++) {
            if (this.Symbols[i].Name == name) return i;
        }
        return -1;
    }
    this.GetOrderFromNumber = function (number) {
        for (var i = 0; i < this.Orders.length; i++) {
            if (this.Orders[i].Number == number) return this.Orders[i];
        }
        return null;
    }
    this.GetEOrderFromNumber = function (number) {
        for (var i = 0; i < this.EOrders.length; i++) {
            if (this.EOrders[i].Number == number) return this.EOrders[i];
        }
        return null;
    }
    this.GetOrdersFromMSymbol = function (name) {
        let Orders = []
        for (var i = 0; i < this.Orders.length; i++) {
            if (this.Orders[i].MSymbol == name) Orders.push(this.Orders[i]);
        }
        return Orders;
    }
    this.GetSessionFrom = function (symbol, operation, enginerule) {
        for (var i = 0; i < this.Sessions.length; i++) {
            if (this.Sessions[i].Operation == operation && this.Sessions[i].Symbol == symbol && this.Sessions[i].StartRule == enginerule) return this.Sessions[i];
        }
        return null;
    }
    this.ReturnSession = function (symbol, sessionnbr, date) {
        for (var i = 0; i < this.Sessions.length; i++) {
            if (this.Sessions[i].SessionNumber == sessionnbr && (date == undefined || this.Sessions[i].StartDate == date) && this.Sessions[i].Symbol == symbol) return this.Sessions[i];
        }
        return null;
    }
    this.GetSession = function (symbolname, enginename) {
        for (var i = 0; i < this.Sessions.length; i++) {
            if (this.Sessions[i].Engine == enginename && this.Sessions[i].Symbol == symbolname) return this.Sessions[i];
        }
        return null;
    }
    this.GetVariableFromName = function (name) {
        for (var i = 0; i < this.Variables.length; i++) {
            if (this.Variables[i].Name == name) return this.Variables[i];
        }
        return null;
    }
    this.GetExpertFromName = function (name) {
        for (var i = 0; i < this.Experts.length; i++) {
            if (this.Experts[i] == name) return this.Experts[i];
        }
        return null;
    }
    this.GetObjectFromId = function (Id) {
        for (var i = 0; i < this.Objects.length; i++) {
            if (this.Objects[i].Id == Id) return this.Objects[i];
        }
        return null;
    }
    this.GetObjectFromName = function (name) {
        for (var i = 0; i < this.Objects.length; i++) {
            if (this.Objects[i].Name == name) return this.Objects[i];
        }
        return null;
    }
    this.GetCreatedObjectFromName = function (name) {
        for (var i = 0; i < this.CreatedObjects.length; i++) {
            if (this.CreatedObjects[i].Name == name) return this.CreatedObjects[i];
        }
        return null;
    }
    this.GetObjectFromType = function (type) {
        for (var i = 0; i < this.Objects.length; i++) {
            if (this.Objects[i].Type == type) return this.Objects[i];
        }
        return null;
    }
    this.GetEngineFromNameOperation = function (name, operation) {
        for (var i = 0; i < this.Engines.length; i++) {
            if (this.Engines[i].Name == name && this.Engines[i].Operation == operation) return this.Engines[i];
        }
        return null;
    }
    this.GetEngineIdxFromNameOperation = function (name, operation) {
        for (var i = 0; i < this.Engines.length; i++) {
            if (this.Engines[i].Name == name && this.Engines[i].Operation == operation) return i;
        }
        return -1;
    }
    this.GetEngineNameFromRule  = function (rule) {
        for (var i = 0; i < this.Engines.length; i++) {
            if (this.Engines[i].StartRule == rule) return this.Engines[i].Name;
        }
    }

    this.GetEngineFromRuleOperation = function (rule, operation) {
        for (var i = 0; i < this.Engines.length; i++) {
            if (this.Engines[i].StartRule == rule && this.Engines[i].Operation == operation) return this.Engines[i];
        }
        return null;
    }
    this.GetStringPeriods = function (Period) {
        var j = 0;
        var s = "";
        for (var i = 0; i < NBR_PERIODS; i++)
            if (Period & (1 << i)) {
                if (j != 0) s += " ";
                s += PeriodName[i];
                j++;
            }
        return s;
    }
    this.GetTabPeriods = function (Period) {
        var tab = []
        for (var i = 0; i < NBR_PERIODS; i++)
            if (Period & (1 << i)) {
                tab.push(i);
            }
        return tab;
    }
    this.GetStrategyFromName = function (sName, pOther) {
        for (var i = 0; i < this.Strategies.length; i++) {
            if (this.Strategies[i].Name == sName && (pOther == null || (this.Strategies[i] != pOther))) return this.Strategies[i];
        }
        return null;
    }
    this.GetStrategyFromRule = function (sRule, pOther) {
        for (var i = 0; i < this.Strategies.length; i++) {
            if (this.Strategies[i].Rule == this.Rule2Int(sRule) && (pOther == null || (this.Strategies[i] != pOther))) return this.Strategies[i];
        }
        return null;
    }
    this.Rule2Int = function (srule) {
        for (var i = 0; i <= NBR_RULES; i++)
            if (RuleName[i] == srule) return (i);
        return (-1);
    }
    this.RecoveryMode2Int = function (srecovery) {
        for (var i = 0; i < RecoveryModeName.length; i++)
            if (RecoveryModeName[i] == srecovery) return (i);
        return (-1);
    }
    this.Period2Int = function (speriod) {
        for (var i = 0; i < PeriodName.length; i++)
            if (PeriodName[i] == speriod) return (i);
        return (-1);
    }
    this.Clear = function () {
        this.Strategies = [];
        this.Engines = [];
        this.Sessions = [];
        this.Alerts = [];
        this.Objects = [];
        this.Schedules = [];
        this.Conditions = [];
        this.ProjectName = "";
    }
    this.ReturnStrategyFromRule = function (rule) {
        for (var i = 0; i < this.Strategies.length; i++) {
            if (this.Strategies[i].Rule != rule) continue;
            return this.Strategies[i];
        }
        return null;
    }
    this.ReturnEngineFromRule = function (rule) {
        for (var i = 0; i < this.Engines.length; i++) {
            if (this.Engines[i].StartRule != rule) continue;
            return this.Engines[i];
        }
        return null;
    }
    this.ReturnNextRuleId = function () {
        for (var i = 0; i < NBR_RULES; i++)
            if (!this.ReturnEngineFromRule(RuleName[i])) return i;
        return -1;
    }
    this.ReturnNextObjectId = function () {
        var TabIndex = [];
        for (var i = 0; i < this.NBR_DEFOBJECTS; i++) TabIndex[i] = -1;

        for (var i = 0; i < this.Objects.length; i++) {
            if (this.Objects[i].Id >= this.NBR_DEFOBJECTS) TabIndex[this.Objects[i].Id - this.NBR_DEFOBJECTS] = 0;
        }
        for (var i = 0; i < this.NBR_DEFOBJECTS; i++)
            if (TabIndex[i] == -1) return i + this.NBR_DEFOBJECTS;
        return (-1);
    }


    this.LoadOrders = function (url, async, interfacecallback, par) {
        if (!async) async = false;

        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;

        xhttp.onreadystatechange = function () {
            var PG = this.PG;
            var terminal = this.terminal;
            PG.Orders = [];

            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                if (interfacecallback)  interfacecallback (par, data);              
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadOrders ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }                
        };
        xhttp.open("GET", url + "PG_Orders.csv", async);
        xhttp.send();
    }

    this.LoadSymbols = function (url, async, interfacecallback, par) {
        if (!async) async = false;

        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;
        xhttp.onreadystatechange = function () {
            var PG = this.PG;
    
            PG.Symbols = [];
           
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                if (interfacecallback)  interfacecallback (par, data);                    
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadSymbols ' + this.readyState);
                //no symbols so load mainsymbols
                if (interfacecallback)  interfacecallback (par, '');                    
            }                   
        };
        xhttp.open("GET", url + "PG_Symbols.csv", async);
        xhttp.send();
    }    

    this.G_Load = function (filename, async, callback, callback_par, updatecallback, updatecallback_par ) {
         solution.get_file  (filename, async, callback, callback_par, updatecallback, updatecallback_par);
    }

    this.LoadObjects = function (response, arraypar) {        // no depends
        let data = response;        
        let PG = arraypar[0].PG;
        
        PG.Objects = solution.PG.Objects.slice(0);
        
        let nextid = PG.ReturnNextObjectId ();
   

        let lines = data.split(/\r\n|\n/);
        let headings = lines[0].split(','); // Splice up the first row to get the headings
        let pobject = null;
        
        for (var j = 1; j < lines.length; j++) {
            if (lines[j] == "") continue;

            var values = lines[j].split(','); // Split up the comma seperated values

            pobject = PG.GetObjectFromName(values[1]);

            if (!pobject) {
                pobject = new pgobject(nextid, values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], [values[12], values[13], values[14], values[15]]);
                PG.Objects.push(pobject);
                nextid++;
            }
            else continue;
            
            if (pobject.Type == "CUSTOM" || pobject.Type == "PREDEFINED") {
                var n = values[4].lastIndexOf(".");
                pobject.ProgName = (n > -1 ? values[4] :  values[4] + '.ex4') ;
            } else {
                if (pobject.Type == "SAR") pobject.Step = values[4];
                else pobject.Period = values[4];
            }
            k = 1;
            for (a = 0; a < 5; a++)
                for (i = 0; i < NBR_PERIODS; i++) {
                    pobject.Level[a][i] = values[15 + k] == "--" ? EMPTY_VALUE : +values[15 + k];
                    k = k + 1;
                }
        }
    }    

    this.LoadEngines = function (response, arraypar) {   
        let data = response;     
        let PG  = arraypar[0].PG;
        let url = arraypar[1];

        PG.Engines = [];
        PG.Strategies = [];

        let lines = data.split(/\r\n|\n/);
        for (var j = 1; j < lines.length; j++) {
            if (lines[j] == "") continue;
            var values = lines[j].split(',');
            var engine = new pgengine(PG, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[14], values[15], values[16], values[17], values[18], values[19], values[20], values[21], values[22], values[23], values[24], values[25], values[26], values[27], values[28], values[29], values[30], values[31], values[32], values[33], values[34], values[35], values[36], values[37], values[38], values[39], values[40]);
            PG.Engines.push(engine);
            
            
            var strategy = PG.GetStrategyFromRule(engine.StartRule);
            if (!strategy) {
                strategy = new pgstrategy();
                strategy.Name = engine.Name;
                strategy.Rule = PG.Rule2Int(engine.StartRule);
                strategy.Operation = OP_BUYSELL;
                PG.Strategies.push(strategy);
            }
            if (engine.Operation == "BUY" || engine.Operation == "BUYSELL") strategy.pBEngine = engine;
            if (engine.Operation == "SELL") {
                strategy.pSEngine = engine;
                strategy.Operation = OP_BUY;
            }
        }
        for (var i = 0; i < PG.Strategies.length; i++) {
            if (PG.Strategies[i].pBEngine == null) {
                PG.Strategies[i].pBEngine = pgengine_s(PG, OP_BUY, PG.Strategies[i].Rule);
                PG.Strategies[i].pBEngine.Name = PG.Strategies[i].pSEngine.Name;
                PG.Engines.push(PG.Strategies[i].pBEngine);
            }
            if (PG.Strategies[i].pSEngine == null) {
                PG.Strategies[i].pSEngine = pgengine_s(PG, OP_SELL, PG.Strategies[i].Rule);
                PG.Strategies[i].pSEngine.Name == PG.Strategies[i].pBEngine.Name;
            }
            PG.Strategies[i].Load(url, ASYNCHRONE);
        }
        PG.LoadStrategies (url, ASYNCHRONE, solution.UpdateStrategies, arraypar[0]);
        PG.LoadSchedules(url, ASYNCHRONE, solution.UpdateSchedules, arraypar[0]);              
    }


    this.LoadConditions = function (response, arraypar) {   
        let data = response;                
        let PG = arraypar[0].PG;

        PG.Conditions = [];

        let PL       = solution.PL;
        let no_defun = true;

        PL.Parse(PG, data);
        
        for (var i = 0; i < PL.ListSections.length; i++) {
            let sccontent = PL.SCFromSection(PL.ListSections[i], no_defun); 
            sccontent = js_beautify(sccontent,  {
                                    indent_size: 4,
                                    brace_style: 'collapse',
                                    max_preserve_newlines: -1
                                });                     
            let condition = new pgcondition(PG, PL.ListSections[i].Name, sccontent, PL.ListSections[i]);
            PG.Conditions.push(condition);
        }
    }    


    this.LoadAlerts = function (response, arraypar) {   
        let data = response;                
        let PG = arraypar[0].PG;

        PG.Alerts = [];
            
            
        var lines = data.split(/\r\n|\n/);
        for (var j = 0; j < lines.length; j++) {
            if (lines[j] == "") continue;
            var values = lines[j].split('#');
            var Alert = new pgalert(values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[15]);
            PG.Alerts.push(Alert);
            Alert.OnOff = [values[10], values[11], values[12], values[13]];
            Alert.Graphic_code = values[14];
            Alert.Graphic_color = values[15];
            Alert.Graphic_from = values[16];
            Alert.Graphic_size = values[17];
            Alert.Graphic_distance = values[18];
            Alert.Sound_Text = values[19];
            Alert.Alert_Text = values[20];
            Alert.Mail_FromName = values[21];
            Alert.Mail_FromAdress = values[22];
            Alert.Mail_ToAdress = values[23];
            Alert.Mail_CcAdress = values[24];
            Alert.Mail_Subject = values[25];
            Alert.Mail_Content = values[26];
        }
    }

    this.LoadMarkers = function (response, arraypar) {   
        let data = response;                
        let PG = arraypar[0].PG;
      
        PG.Markers = [];
        

        let PL       = solution.PL;
        let no_defun = true;

        PL.Parse(PG, data);

        for (var i = 0; i < PL.ListSections.length; i++) {
            let sccontent =  PL.SCFromSection(PL.ListSections[i], no_defun);  
            sccontent = js_beautify(sccontent,  {
                                indent_size: 4,
                                brace_style: 'collapse',
                                max_preserve_newlines: -1
                            });
            let marker = new pgmarker(PG, PL.ListSections[i].Name, sccontent, PL.ListSections[i]);
            PG.Markers.push(marker);
        }
    }

    this.LoadStrategies = function (url, async, interfacecallback, par) {           //depends engine
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;
        xhttp.onreadystatechange = function () {
            var PG = this.PG;
            var url = this.url;
            
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                var Strategy = null;
                var NewStrategy = null;
                //first line project name
                PG.ProjectName = lines[0];
                for (var j = 1; j < lines.length; j++) {
                    var values = lines[j].split('#'); // Split up the comma seperated values
                    NewStrategy = PG.GetStrategyFromName(values[0]);
                    if (NewStrategy) {
                        Strategy                = NewStrategy;
                        Strategy.Description    = "";
                        Strategy.InitialBalance = (values[1] == "" ? "1000" : values[1]);
                        Strategy.TimeFrame      = (values[2] ? "ANY" : values[2]);
                        Strategy.UsedIndicators = []; 
                        if (values[3]) {
                            var indicators = values[3].split(','); 
                            for (var k = 0; k < indicators.length; k++) {
                                Strategy.UsedIndicators.push (parseInt(indicators[k]));
                            }
                        }

                    } else {
                        if (Strategy) Strategy.Description += values[0]; // + "\n";
                    }
                }
                if (interfacecallback) interfacecallback (par);                      
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadStrategies ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }            
        };
        xhttp.open("GET", url + "PG_Strategies.csv", async);
        xhttp.send();
    }    

    this.SaveStrategies = function (projectfolder, projectname) {
        var line = "";
        // first line project name        
        line += projectname;
        line += "\n";
        var strategy;
        for (var i = 0; i < this.Strategies.length; i++) {
            strategy = this.Strategies[i];
            line += strategy.Name + "#" + strategy.InitialBalance + "#" + strategy.TimeFrame +  "#";
            
            for (var j = 0; j < strategy.UsedIndicators.length; j++) {
                line += strategy.UsedIndicators[j] + (j != strategy.UsedIndicators.length - 1 ? "," : "");
            }
            
            if (strategy.Operation == OP_BUY || strategy.Operation == OP_BUYSELL) {
                if (strategy.pBEngine.Code[CODE_SS] != -1) 
                    SubmitFileRequest(strategy.pBEngine.Code[CODE_SS], 'php/save_file.php', solution.CurrentProject.Folder, CODE_SS, strategy.Operation, strategy.pBEngine.StartRule);
            }
            
            if (strategy.Operation == OP_BUY) {
                var count;
                for (var j = 0; j < NBR_OPERATIONS; j++) {
                    count = strategy.SLogicals[j].length;
                    for (var k = 0; k < count; k++) {
                        var m_Name = strategy.SLogicals[j][k];
                        line += strategy.pSEngine.Operation + "::" + OperationName[j] + "~" + m_Name + "#";
                    }
                }
                if (strategy.pSEngine.Code[CODE_SS] != -1)                 
                    SubmitFileRequest(strategy.pSEngine.Code[CODE_SS], 'php/save_file.php', solution.CurrentProject.Folder, CODE_SS, OP_SELL, strategy.pSEngine.StartRule);
            }
            if (strategy.Code[CODE_CPP] != -1)             
                SubmitFileRequest(strategy.Code[CODE_CPP], 'php/save_file.php', solution.CurrentProject.Folder, CODE_CPP, strategy.Operation, strategy.pBEngine.StartRule);
            line += "\n";
            line += strategy.Description + "\n";
        }
        SubmitProjectRequest('Projects',projectfolder, null, line, 'php/save_strategies.php', ASYNCHRONE);
        return line;
    }     

    this.LoadSchedules = function (url, async, interfacecallback, par) {            //depends engine
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;
        xhttp.onreadystatechange = function () {
            var PG = this.PG;
            var url = this.url;
            
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                //  RULE,OPERATION,SYMBOL,STARTMONTH,OCCURENCEDAYINWEEK,STARTDAY,STARTTIME,ENDMONTH,ENDOCCURENCEDAYINWEEK,ENDDAY,ENDTIME,FREQDAY,SAMEBAR, TIMEBETWEENSESSION, TIMEZONE
                var headings = lines[0].split(',');
                for (var j = 1; j < lines.length; j++) {
                    if (lines[j] == "") continue;
                    var values = lines[j].split(','); // Split up the comma seperated values
                    var schedule = new pgschedule(values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[14]);
                    PG.Schedules.push(schedule);
                }
                if (interfacecallback) interfacecallback (par);                
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadSchedules ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }             
        }
        xhttp.open("GET", url + "PG_Schedules.csv", async);
        xhttp.send();
    }

    this.LoadSystemObjects = function (url, async) {            //depends object
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;
        xhttp.onreadystatechange = function () {
            let PL       = solution.PL;            
            let PG       = this.PG;
            let url      = this.url;
            
            PG.SystemObjects = [];
            
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                PL.Parse(PG, data);
                //var SignalsSystemObject = ["BUY", "SELL", "EXIT_BUY", "EXIT_SELL", "BULL", "BEAR"];    			
                for (var i = 0; i < PL.ListSections.length; i++) {
                    var word = PL.ListSections[i].Name.split("~");
                    if (!word) continue;
                    var objectname = word[0];
                    var signal = word[1];
                    var object = PG.GetObjectFromName(objectname);
                    if (!object || object.Type != 'SYSTEM') continue;
                }
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadSystemObjects ' + this.readyState);
            }              
        };
        xhttp.open("GET", url + "PG_SystemObjects.ss", async);
     //   xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.send();
    }

    this.LoadPanel = function (url, async, interfacecallback, par) {            //no depends
        if (!async) async = false;
        
        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url
        xhttp.onreadystatechange = function () {
            var PG = this.PG;
            var url = this.url;
            PG.GraphicMainPanel = 0;
            PG.GlobalComment = 0;
            PG.MarketOpening = 0;
            PG.OperationSound = 0;
            PG.AlertsSound = 0;
            PG.NewsSound = 0;
            PG.Panel_Signals = [];
            PG.Panel_Objects = [];
            PG.Panel_Graphic = [];
            
            
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(/\r\n|\n/);
                var values = lines[0].split(',');
                PG.GraphicMainPanel = (values[0] == "false") ? 0 : 1;
                PG.GlobalComment = (values[1] == "false") ? 0 : 1;
                PG.MarketOpening = (values[3] == "false") ? 0 : 1;
                values = lines[1].split(',');
                PG.OperationSound = (values[0] == "false") ? 0 : 1;
                PG.AlertsSound = (values[1] == "false") ? 0 : 1;
                PG.NewsSound = (values[2] == "false") ? 0 : 1;
                var k = 0; //lines
                var j = 0; //panel graphic
                var h = 0; //panel objects
                var nextind = 0;
                var lastind = -1;
                var NotPanelEnd = true;
                for (i = 2; i < lines.length; i++) {
                    values = lines[i].split(',');
                    if (k < NBR_SIGNALS) {
                        var color = values[1];
                        var signal = new pgsignal(+values[0], color, +values[2], values[3]);
                        PG.Panel_Signals.push(signal);
                    } else
                    if (k < NBR_SIGNALS + 9) {
                        PG.Panel_Graphic[j] = +values[1];
                        j++;
                    } else {
                        if (!NotPanelEnd) {
                            var sysobject = PG.GetObjectFromName(values[0]);
                            if (!sysobject || sysobject.Type != 'SYSTEM') continue;
                            sysobject.Dependencies.push(values[1]);
                        } else {
                            var lineprop = [];
                            for (var h = 0; h < 3; h++) {
                                lineprop.push(values[h]);
                            }
                            PG.Panel_Objects.push(lineprop);
                            if (+values[0] == PANEL_END) NotPanelEnd = false;
                            h++;
                        }
                    }
                    k++;
                }
            if (interfacecallback) interfacecallback (par);
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadPanel ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }
        };
        xhttp.open("GET", url + "PG_Panel.csv", async);
    //    xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.send();
    }    
    this.SaveProfile = function (terminal) {
        if (solution.get('user').id == "0") {
            return;
        }
        if (!terminal) return;

        var symbolcanvas = this.Canvas;
        var line =  
                    (symbolcanvas.CurrentSymbol ?  symbolcanvas.CurrentSymbol.Name : '') + "\n" + 
                    symbolcanvas.CurrentPeriod + "\n" + 
                    symbolcanvas.nbr_candles + "\n" + 
                    symbolcanvas.Seperator + "\n" + 
                    symbolcanvas.Levels + "\n" + 
                    symbolcanvas.SignalPanel + "\n" + 
                    symbolcanvas.MarkerPanel + "\n" + 
                    symbolcanvas.Pivot + "\n" + 
                    symbolcanvas.Grid + "\n" + 
                    JSON.stringify(symbolcanvas.BarType) + "\n" + 
                    JSON.stringify(symbolcanvas.Marks) + "\n" + 
                    JSON.stringify(symbolcanvas.VLines) + "\n" + 
                    JSON.stringify(symbolcanvas.HLines) + "\n" + 
                    JSON.stringify(symbolcanvas.Retracements) + "\n" + 
                    JSON.stringify(symbolcanvas.Markers) + "\n" + 
                    JSON.stringify(symbolcanvas.Trends) + "\n" + 
                    JSON.stringify(symbolcanvas.Indicators) + "\n";
        
        SubmitProfileRequest(terminal.Folder, terminal.Type, line, '/php/save_profile.php', true);
    }    
     
    this.LoadProfile = function (url, async, interfacecallback, par) {
        if (!async) async = false;
        
        
        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;
      
        xhttp.onreadystatechange = function () {
            var PG = this.PG;
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                if (data =='') return;
                var lines = data.split(/\r\n|\n/);
                var i = 0;
                var symbolcanvas = PG.Canvas;
                symbolcanvas.CurrentSymbol  = PG.GetSymbolFromName(lines[i]); i++;
                symbolcanvas.CurrentPeriod  = JSON.parse(lines[i]); i++;
                symbolcanvas.nbr_candles    = JSON.parse(lines[i]); i++;
                symbolcanvas.Seperator      = JSON.parse(lines[i]); i++;
                symbolcanvas.Levels         = JSON.parse(lines[i]); i++;
                symbolcanvas.SignalPanel    = JSON.parse(lines[i]); i++;
                symbolcanvas.MarkerPanel    = JSON.parse(lines[i]); i++;
                symbolcanvas.Pivot          = JSON.parse(lines[i]); i++;
                symbolcanvas.Grid           = JSON.parse(lines[i]); i++;
                symbolcanvas.BarType        = JSON.parse(lines[i]); i++;
                symbolcanvas.Marks          = JSON.parse(lines[i]); i++;
                symbolcanvas.VLines         = JSON.parse(lines[i]);
                for (var j = 0; j < symbolcanvas.VLines.length; j++) {
                    var line = symbolcanvas.VLines[j];
                    line.start[0] = new Date (line.start[0]);
                    line.end[0] = line.start[0];
                }
                
                i++;
                symbolcanvas.HLines         = JSON.parse(lines[i]); i++;
                symbolcanvas.Retracements   = JSON.parse(lines[i]); i++;
                symbolcanvas.Markers        = JSON.parse(lines[i]); i++;
                symbolcanvas.Trends         = JSON.parse(lines[i]); i++;
                symbolcanvas.Indicators     = JSON.parse(lines[i]);
                symbolcanvas.Indicators     = symbolcanvas.Indicators.filter(x => PG.GetObjectFromId(x) != null);
                symbolcanvas.Markers =[];
                if (interfacecallback) interfacecallback (par);
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadProfile ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }
            
        };
        xhttp.open("GET", url + "PG_Profile.txt", async);
     //   xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.send();
    }
    this.LoadExperts = function (solution, url, projectfolder, async, interfacecallback, par) {
        if (!async) async = false;        
        var xhttp = new XMLHttpRequest();
        xhttp.PG = this;
        xhttp.url = url;
    
        var params = 'user_id=' + (solution.get('user').id == "0" ? "1" : solution.get('user').id ) + '&project_folder=' + projectfolder;    
    
        xhttp.onreadystatechange = function () {
            var PG = this.PG;
            PG.Experts = [];
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                var lines = data.split(',');
                for (var j = 0; j < lines.length; j++) {
                    if (lines[j] == "") continue;                    
                    PG.Experts.push (lines[j]);
                }
                if (interfacecallback) interfacecallback (par);                
            }
            if (this.readyState == 4 && this.status == 404) {
                console.log ('Erreur in Reading Request LoadExperts ' + this.readyState);
                if (interfacecallback)  interfacecallback (par, '');                 
            }            
        };
        xhttp.open('POST', url, async);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);        
    }    
    this.SaveAlerts = function (terminal) {
        var line = "";
    
        for (var i = 0; i < this.Alerts.length; i++) {
            var alert = this.Alerts[i];
            if (!alert) continue;
      
            line += ""  + alert.Id;
            line += "#" + alert.Object;
            line += "#" + alert.Signal;
            line += "#" + alert.Periods;
            line += "#" + alert.Operator;  //AND or OR operator
            line += "#" + alert.Not;
            line += "#" + alert.Previous;
            line += "#" + alert.Type;      // ANY BAR , FIRST BAR , FIRST TICK
            line += "#" + alert.OpValue;
            line += "#" + alert.Value;
            
            line += "#" + alert.OnOff[0];
            line += "#" + alert.OnOff[1];
            line += "#" + alert.OnOff[2];
            line += "#" + alert.OnOff[3];
            
            line += "#" + alert.Graphic_code;
            line += ""  + alert.Graphic_color;  // no #

            line += "#" + alert.Graphic_from;
            line += "#" + alert.Graphic_size;
            line += "#" + alert.Graphic_distance;

            line += "#" + alert.Sound_Text;
            line += "#" + alert.Alert_Text;
            line += "#" + alert.Mail_FromName;
            line += "#" + alert.Mail_FromAdress;
            line += "#" + alert.Mail_ToAdress;
            line += "#" + alert.Mail_CcAdress;
            line += "#" + alert.Mail_Subject;
            line += "#" + alert.Mail_Content;
            
            line += "\n";
        }     
        SubmitTerminalRequest(terminal.Folder, terminal.Type, line, 'php/save_alerts.php', ASYNCHRONE);
    }
    
    
    this.SaveTObjects = function (terminal) {
        var line = "ID,NAME,TYPE,CROSS,PERIOD,METHOD,APPLY,SHIFT,MODE,DISPLAY_TYPE, DISPLAY, LEVELTYPE, VALUE1, VALUE2, VALUE3, VALUE4,LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9";
        
        
        line += "\n";
        
        
        
        for (var k = 0; k < this.Objects.length; k++) {
            var object = this.Objects[k];
            if (!object) continue;
            var sline = "";
            

            sline += object.Id + "," + object.Name + "," + object.Type + "," + object.Cross + ",";
            if (object.Type == "CUSTOM" || object.Type == "PREDEFINED") {
                var n = object.ProgName.lastIndexOf(".");
                sline += (n > -1 ? object.ProgName.substr(0, n) :  object.ProgName) + ",";
            } else {
                if (object.Type == "SAR") {
                    sline += object.Step + ",";
                } else {
                    sline += object.Period + ",";
                }
            }
            if (object.Type == "SAR") {
                sline += object.Maximum + ",";
            } else {
                sline += object.Method + ",";
            }
            sline += object.Apply + ",";
            sline += object.Shift + ",";
            sline += object.Mode + ",";
            sline += object.DisplayType + ",";
            sline += object.Display + ",";
            sline += object.LevelType + ",";
            for (var i = 0; i < 4; i++) {
                sline += object.Value[i] + ",";
            }
            for (var i = 0; i < 5; i++) {
                for (var p = 0; p < NBR_PERIODS; p++) {
                    if (object.Level[i][p] == EMPTY_VALUE) sline += "--";
                    else sline += object.Level[i][p];
                    if (p == 8 && i == 4) {
                        sline += "";
                    }
                    else sline += ",";
                }
            }
            line += sline + "\n";

        }
        SubmitTerminalRequest(terminal.Folder, terminal.Type, line, 'php/save_tobjects.php', ASYNCHRONE);
    }      
    
    this.SaveSymbols = function (terminal) {
        var line = "";
        for (var k = 0; k < this.Symbols.length; k++) {
            var symbol = this.Symbols[k];
            if (!symbol) continue;

            var sline = "";

            sline += symbol.Name + ",";
            sline += symbol.PName + ",";
            sline += symbol.MinLot + ",";
            sline += symbol.MaxLot + ",";
            sline += symbol.LotStep + ",";
            sline += symbol.Spread + ",";
            sline += symbol.StopLevel + ",";
            sline += symbol.Point + ",";
            sline += symbol.Digits + ",";
            sline += symbol.LotSize + ",";
            sline += symbol.Tester + ",";
            sline += symbol.Period + ",";
            line += sline + "\n";
        }
        SubmitTerminalRequest(terminal.Folder, terminal.Type, line, 'php/save_symbols.php', ASYNCHRONE);
        return line;
    }    

    this.SaveOrders = function (terminal) {
        var line = "SESSIONNUMBER,NUMBER,DATATYPE,MAGICNUMBER,TIME,TYPE,SIZE,SYMBOL,OPRICE,SL, TP, CTIME, CPRICE, COMISSION, SWAP, PROFIT,COMMENT,MSYMBOL";
        line += "\n";

        for (var k = 0; k < this.Orders.length; k++) {
            var order = this.Orders[k];
            if (!order) continue;
            var sline = "";

            sline += order.SessionNumber  + ",";
            sline += order.Number + ",";
            sline += order.DataType + ",";
            sline += order.MagicNumber + ",";
            sline += order.Time + ",";
            sline += order.Type + ",";
            sline += order.Size + ",";
            sline += order.Symbol + ",";
            sline += order.OPrice + ",";
            sline += order.SL + ",";
            sline += order.TP + ",";
            sline += order.CTime + ",";
            sline += order.CPrice + ",";
            sline += order.Commission + ",";
            sline += order.Swap + ",";
            sline += order.Profit + ",";
            sline += order.Comment + ",";            
            sline += order.MSymbol + ",";
            line += sline + "\n";
        }
        SubmitTerminalRequest(terminal.Folder, terminal.Type, line, 'php/save_orders.php', ASYNCHRONE);
        return line;
    }       
    this.SaveMarkers = function (terminal, terminaltype) {
        var line= "";
        for (var k = 0; k < this.Markers.length; k++) {
            let marker = this.Markers[k];
            if (!marker) continue;
            line += '(defun ' + marker.Name + ' () ' + marker.SCContent + ')\n';
        }
        SubmitProjectRequest('Projects',terminal.Folder, terminaltype ? terminaltype : terminal.Type, line, 'php/save_markers.php', ASYNCHRONE);
        return line;
    }
      
    this.SaveEngineInString = function (engine) {
        var line = '';
            line += engine.Name + ',';
            line += engine.Operation + ',';
            line += engine.StartRule + ',';
            line += engine.BuyRule + ',';
            line += engine.SellRule + ',';
            line += engine.ExitBuyRule + ',';
            line += engine.ExitSellRule + ',';
            line += engine.ExitRule + ',';
            line += engine.ILot + ',';
            line += engine.MaxLot + ',';
            line += engine.MaxCount + ',';
            line += engine.Direction + ',';
            line += engine.DirectionType + ',';
            line += engine.RecoveryMode + ',';
            line += engine.RecoveryValue + ',';
            line += engine.PipStep + ',';
            line += engine.TimeStep + ',';
            line += engine.OrderType + ',';
            line += engine.KeepBuySell + ',';
            line += engine.OneOrderPerBar + ',';
            line += engine.ExitMode + ',';
            line += engine.MaxTime + ',';
            line += engine.HedgeMagnitude + ',';
            line += engine.MinProfit + ',';
            line += engine.BuyMinProfit + ',';
            line += engine.SellMinProfit + ',';
            line += engine.TP + ',';
            line += engine.TS + ',';
            line += engine.SL + ',';
            line += engine.BuyTP + ',';
            line += engine.BuyTS + ',';
            line += engine.BuySL + ',';
            line += engine.SellTP + ',';
            line += engine.SellTS + ',';
            line += engine.SellSL + ',';
            line += engine.BuyLotTP + ',';
            line += engine.BuyLotTS + ',';
            line += engine.BuyLotSL + ',';
            line += engine.SellLotTP + ',';
            line += engine.SellLotTS + ',';
            line += engine.SellLotSL + '';
            return line;
    }            
    
    this.SaveEnginesInString = function () {
       
        var StringEngines = '';
        for (var k = 0; k < this.Engines.length; k++) {
            var engine = this.Engines[k];

            var line = SaveEngineInString (engine);
            
            StringEngines +=  '," + \n"' + line +   '';             
            
        }
        return StringEngines + '"';
    }    
    
    this.SaveObjectsInString = function (indicators) {

        var StringObjects = '';
        for (var k = 0; k < this.Objects.length; k++) {
            var object = this.Objects[k];
            if (!object) continue;
            
            if (indicators) {
                if (object.Type != "PREDEFINED" && !indicators.includes(object.Name))  continue;
            }

            var sline = '';
            

            sline += object.Id + ',' + object.Name + ',' + object.Type + ',' + object.Cross + ',';
            if (object.Type == 'CUSTOM' || object.Type == 'PREDEFINED') {
                var n = object.ProgName.lastIndexOf(".");
                sline += (n > -1 ? object.ProgName.substr(0, n) :  object.ProgName) + ',';
            } else {
                if (object.Type == 'SAR') {
                    sline += object.Step + ',';
                } else {
                    sline += object.Period + ',';
                }
            }
            if (object.Type == 'SAR') {
                sline += object.Maximum + ',';
            } else {
                sline += object.Method + ',';
            }
            sline += object.Apply + ',';
            sline += object.Shift + ',';
            sline += object.Mode + ',';
            sline += object.DisplayType + ',';
            sline += object.Display + ',';
            sline += object.LevelType + ',';
            for (var i = 0; i < 4; i++) {
                sline += object.Value[i] + ',';
            }
            for (var i = 0; i < 5; i++) {
                for (var p = 0; p < NBR_PERIODS; p++) {
                    if (object.Level[i][p] == EMPTY_VALUE) sline += '--';
                    else sline += object.Level[i][p];
                    if (p == 8 && i == 4) {
                        sline += '';
                    }
                    else sline += ',';
                }
            }
            //line += sline + '\n';
            StringObjects += '," + \n"' + sline +   '';               
        }
        return StringObjects + '"';
    }       
    this.SaveSchedulesInString = function (targetengine) {
        
        var StringSchedules = '';

        for (var k = 0; k < this.Engines.length; k++) {
            var engine = this.Engines[k];
            if (!engine) continue;
            if (targetengine && targetengine != engine) continue;
            
            var schedule = engine.Schedules[0];
            if (!schedule) continue;
            var line = '';            
            line += schedule.StartRule + ',';
            line += schedule.Operation + ',';
            line += schedule.Currency + ',';
            line += schedule.StartMonth + ',';
            line += schedule.FromOccurenceWeek + ',';
            line += schedule.StartDay + ',';
            line += schedule.StartTime + ',';
            line += schedule.EndMonth + ',';
            line += schedule.ToOccurenceWeek + ',';
            line += schedule.EndDay + ',';
            line += (schedule.EndTime == '' ? '-1' : schedule.EndTime) + ',';
            line += (schedule.FrequencyDay == 0 ? '-1' : schedule.FrequencyDay) + ',';
            line += schedule.OnSameBar + ',';
            line += (schedule.TimeBetweenSession == 0 ? '-1' : schedule.TimeBetweenSession) + ',';
            line += schedule.TimeZone;
            StringSchedules += '," + \n"' + line +   '';                 
            
        }
        return StringSchedules + '"';
    } 
    
    this.SaveObjects = function (projectfolder) {
        var line = "ID,NAME,TYPE,CROSS,PERIOD,METHOD,APPLY,SHIFT,MODE,DISPLAY_TYPE, DISPLAY, LEVELTYPE, VALUE1, VALUE2, VALUE3, VALUE4,LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9";
        
        line += "\n";
        
        for (var k = 0; k < this.Objects.length; k++) {
            var object = this.Objects[k];
            if (!object) continue;
            var sline = "";
            

            sline += object.Id + "," + object.Name + "," + object.Type + "," + object.Cross + ",";
            if (object.Type == "CUSTOM" || object.Type == "PREDEFINED") {
                var n = object.ProgName.lastIndexOf(".");
                sline += (n > -1 ? object.ProgName.substr(0, n) :  object.ProgName) + ",";
            } else {
                if (object.Type == "SAR") {
                    sline += object.Step + ",";
                } else {
                    sline += object.Period + ",";
                }
            }
            if (object.Type == "SAR") {
                sline += object.Maximum + ",";
            } else {
                sline += object.Method + ",";
            }
            sline += object.Apply + ",";
            sline += object.Shift + ",";
            sline += object.Mode + ",";
            sline += object.DisplayType + ",";
            sline += object.Display + ",";
            sline += object.LevelType + ",";
            for (var i = 0; i < 4; i++) {
                sline += object.Value[i] + ",";
            }
            for (var i = 0; i < 5; i++) {
                for (var p = 0; p < NBR_PERIODS; p++) {
                    if (object.Level[i][p] == EMPTY_VALUE) sline += "--";
                    else sline += object.Level[i][p];
                    if (p == 8 && i == 4) {
                        sline += "";
                    }
                    else sline += ",";
                }
            }
            line += sline + "\n";

        }

        SubmitProjectRequest('Projects',projectfolder, null, line, 'php/save_objects.php', ASYNCHRONE);
        return line;
    }
    
    
    this.SaveEngines = function (projectfolder) {
       
        var line = "B_NAME,B_OPERATION,B_STARTRULE,B_BUYRULE,B_SELLRULE,B_EXITBUYRULE,B_EXITSELLRULE,B_EXITRULE,B_ILOT,B_MAXLOT,B_MAXCOUNT,B_DIRECTION, B_DIRECTIONTYPE, B_RECOVERYMODE,B_RECOVERYVALUE,B_PIPSTEP,B_TIMESTEP,B_ORDERTYPE,B_KEEPBUYSELL,B_ONEORDERPERBAR,B_EXITMODE,B_MAXTIME,B_HEDGEMAGNITUDE,B_MINPROFIT,B_BUYMINPROFIT,B_SELLMINPROFIT,B_TP,B_TS,B_SL,B_BUYTP,B_BUYTS,B_BUYSL,B_SELLTP,B_SELLTS,B_SELLSL,B_BUYLOTTP,B_BUYLOTTS,B_BUYLOTSL,B_SELLLOTTP,B_SELLLOTTS,B_SELLLOTSL\n";
        for (var k = 0; k < this.Engines.length; k++) {
            var engine = this.Engines[k];
            if (!engine) continue;
            line += engine.Name + ",";
            line += engine.Operation + ",";
            line += engine.StartRule + ",";
            line += engine.BuyRule + ",";
            line += engine.SellRule + ",";
            line += engine.ExitBuyRule + ",";
            line += engine.ExitSellRule + ",";
            line += engine.ExitRule + ",";
            line += engine.ILot + ",";
            line += engine.MaxLot + ",";
            line += engine.MaxCount + ",";
            line += engine.Direction + ",";
            line += engine.DirectionType + ",";
            line += engine.RecoveryMode + ",";
            line += engine.RecoveryValue + ",";
            line += engine.PipStep + ",";
            line += engine.TimeStep + ",";
            line += engine.OrderType + ",";
            line += engine.KeepBuySell + ",";
            line += engine.OneOrderPerBar + ",";
            line += engine.ExitMode + ",";
            line += engine.MaxTime + ",";
            line += engine.HedgeMagnitude + ",";
            line += engine.MinProfit + ",";
            line += engine.BuyMinProfit + ",";
            line += engine.SellMinProfit + ",";
            line += engine.TP + ",";
            line += engine.TS + ",";
            line += engine.SL + ",";
            line += engine.BuyTP + ",";
            line += engine.BuyTS + ",";
            line += engine.BuySL + ",";
            line += engine.SellTP + ",";
            line += engine.SellTS + ",";
            line += engine.SellSL + ",";
            line += engine.BuyLotTP + ",";
            line += engine.BuyLotTS + ",";
            line += engine.BuyLotSL + ",";
            line += engine.SellLotTP + ",";
            line += engine.SellLotTS + ",";;
            line += engine.SellLotSL + "\n";
        }
          
        SubmitProjectRequest('Projects',projectfolder, null, line, 'php/save_engines.php', ASYNCHRONE);
        return line;
    }
         
    
    this.SaveSchedules = function (projectname) {
        var line = "RULE,OPERATION,SYMBOL,STARTMONTH,OCCURENCEDAYINWEEK,STARTDAY,STARTTIME,ENDMONTH,ENDOCCURENCEDAYINWEEK,ENDDAY,ENDTIME,FREQDAY,SAMEBAR,TIMEBETWEENSESSION, TIMEZONE\n";
        for (var k = 0; k < this.Engines.length; k++) {
            var schedule = this.Engines[k].Schedules[0];
            if (!schedule) continue;
            line += schedule.StartRule + ",";
            line += schedule.Operation + ",";
            line += schedule.Currency + ",";
            line += schedule.StartMonth + ",";
            line += schedule.FromOccurenceWeek + ",";
            line += schedule.StartDay + ",";
            line += schedule.StartTime + ",";
            line += schedule.EndMonth + ",";
            line += schedule.ToOccurenceWeek + ",";
            line += schedule.EndDay + ",";
            line += (schedule.EndTime == "" ? "-1" : schedule.EndTime) + ",";
            line += (schedule.FrequencyDay == 0 ? "-1" : schedule.FrequencyDay) + ",";
            line += schedule.OnSameBar + ",";
            line += (schedule.TimeBetweenSession == 0 ? "-1" : schedule.TimeBetweenSession) + ",";
            line += schedule.TimeZone + "\n";
        }
        SubmitTerminalRequest("", projectname, line, 'php/save_schedules.php', ASYNCHRONE);
        return line;
    } 


    this.SaveConditions = function (projectfolder) {
        var line= "";
        for (var k = 0; k < this.Conditions.length; k++) {
            var condition = this.Conditions[k];
            if (!condition) continue;
            line += '(defun ' + condition.Name + ' () ' + condition.SCContent + ')\n';
        }
        SubmitProjectRequest('Projects',projectfolder, null, line, 'php/save_conditions.php', ASYNCHRONE);
        return line;
    }
}    


function pgvariable (name, initvalue, type) {
    this.Name = name;
    this.Type = type;
    this.InitValue = initvalue;
}



function pgsymbolcanvas (pg, pname) {
    this.PG = pg;




    this.Init = function (pname) {
        this.ID = pname + '_chart';
        this.CurrentPeriod = null; //H1
        this.CurrentSymbol = null;
        this.CurrentEngine = null;

        this.MarkerNbr  = 0;
        this.Sessions   = [];
        this.TrackObjects = [];
        
        this.nbr_candles= 72;
        
        this.Seperator      = false;
        this.Levels         = false;
        this.Shift          = false;

        this.Pivot          = false;
        this.Variation      = false;
        this.Selection      = 'cursor';
        this.BarType        = Bar_Candle;
        this.Marks          = []; //ok horizontal lines
        this.HLines         = []; // ok horizontal lines
        this.VLines         = []; // ok vertival lines
        this.Retracements   = [];
        this.Markers        = [];
        this.Trends         = [];
        this.Indicators     = [];
        this.Engines        = [];
        this.Alerts         = null;
        this.Grid           = false;
        this.Hover          = false;
        this.Updated        = false;
        this.Container      = null;        
        this.Discontinuous  = true;
        this.ShowLeftAxis   = true;
        this.SignalPanel    = false;
        this.MarkerPanel    = false;
        if (pname == 'home' || pname == 'project') {
            this.ShowLeftAxis = false;
        } 
    /*    if (pname == 'option') {
            this.Discontinuous = false;
        }        
        */
    }

    this.AddEngine = function (enginename) {
        for (var i = 0; i < this.Engines.length; i++)
            if (this.Engines[i] == enginename) return false;
        this.Engines.push(enginename);
        return true;
    }

    this.RemoveEngine = function (enginename) {
        for (var i = 0; i < this.Engines.length; i++) {
            if (this.Engines[i] == enginename) {
                this.Engines.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    this.AddIndicator = function (objectid) {
        if (!this.Indicators.includes(objectid)) {
            this.Indicators.push(objectid);
            if (objectid == HEIKEN_ASHI) 
                this.SetBarType(Bar_HeikenAshi);
        }
    }
    this.RemoveIndicator = function (objectid) {
        for (var i = 0; i < this.Indicators.length; i++) {
            if (this.Indicators[i] == objectid) {
                this.Indicators.splice(i, 1);
                if (objectid == HEIKEN_ASHI) this.SetBarType(Bar_Candle);                
                return true;
            }
        }
        return false;
    }
    this.GetIndicator = function (objectid) {
        for (var i = 0; i < this.Indicators.length; i++) {
            if (this.Indicators[i] == objectid) {
                return true;
            }
        }
        return false;
    } 
    this.GetMarker = function (markername) {
        for (var i = 0; i < this.Markers.length; i++) {
            if (this.Markers[i] == markername) {
                return true;
            }
        }
        return false;
    } 
    this.RemoveMarker = function (markername) {
        for (var i = 0; i < this.Markers.length; i++) {
            if (this.Markers[i] == markername) {
                this.Markers.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    this.AddMarker = function (markername) {
        if (!this.Markers.includes(markername)) {
            this.Markers.push(markername);
        }
    }    
    this.SetBarType = function (bartype) {
        if (this.BarType == bartype) return;    
    
        if (bartype == Bar_HeikenAshi) this.AddIndicator(HEIKEN_ASHI)
        else this.RemoveIndicator(HEIKEN_ASHI)        
        this.BarType = bartype;
    }
    this.SetPivot = function (pivot) {
        if (pivot) {
            this.AddIndicator(PIVOT_POINT);
            this.AddIndicator(PIVOT_RESISTANCE);
            this.AddIndicator(PIVOT_RESISTANCE1);
            this.AddIndicator(PIVOT_RESISTANCE2);
            this.AddIndicator(PIVOT_SUPPORT);
            this.AddIndicator(PIVOT_SUPPORT1);
            this.AddIndicator(PIVOT_SUPPORT2);
            this.AddIndicator(PIVOT_HIGH);
            this.AddIndicator(PIVOT_LOW);
        } else {
            this.RemoveIndicator(PIVOT_POINT);
            this.RemoveIndicator(PIVOT_RESISTANCE);
            this.RemoveIndicator(PIVOT_RESISTANCE1);
            this.RemoveIndicator(PIVOT_RESISTANCE2);
            this.RemoveIndicator(PIVOT_SUPPORT);
            this.RemoveIndicator(PIVOT_SUPPORT1);
            this.RemoveIndicator(PIVOT_SUPPORT2);
            this.RemoveIndicator(PIVOT_HIGH);
            this.RemoveIndicator(PIVOT_LOW);
        }
    }
    this.Init(pname);
};

function pgorder(sessionnumber, number, datatype, magicnumber, time, type, size, symbol, oprice, sl, tp, ctime, cprice, comission, swap, profit, comment, msymbol) {
    this.Number         = number;
    this.SessionNumber  = sessionnumber;
    this.DataType       = datatype;
    this.MagicNumber    = magicnumber;
    this.Time           = time;
    this.Type           = type;
    this.Size           = size;
    this.Symbol         = symbol;
    this.OPrice         = oprice;
    this.SL             = sl;
    this.TP             = tp;
    this.CTime          = ctime;
    this.CPrice         = cprice;
    this.Commission     = comission;
    this.Swap           = swap;
    this.Profit         = profit;
    this.Comment        = comment;
    this.Active;
    this.Operation;
//options 
    this.MSymbol = (msymbol ? msymbol : symbol);
    this.MPrice;
    this.IV;


    this.Mark = 0;
    this.Set = function (datatype, magicnumber, time, type, size, symbol, oprice, sl, tp, ctime, cprice, comission, swap, profit, comment) {
        this.DataType = datatype;
        this.MagicNumber = magicnumber;
        this.Time = time;
        this.Type = type;
        this.Size = size;
        this.Symbol = symbol;
        this.OPrice = oprice;
        this.SL = sl;
        this.TP = tp;
        this.CTime = ctime;
        this.CPrice = cprice;
        this.Commission = comission;
        this.Swap = swap;
        this.Profit = profit;
        this.Comment = comment;
    }
};

function pgindicator() {
    this.Object = null;
    this.Periods = [];
};

function pgobject(id, name, type, cross, period, method, apply, shift, mode, displaytype, display, leveltype, value, levels) {
    this.Valid = 1;
    this.Id = +id;
    this.Name = name;
    this.BName;
    this.PName;
    this.Cross = cross
    this.Sound;
    this.ProgName;
    this.Type = type;
    this.POrder;
    this.PVisible = 0;
    this.PNext = 0;
    this.Period = +period;
    this.Method = +method;
    this.Apply = +apply;
    this.Shift = +shift;
    this.Mode = +mode;
    this.Step = 0;
    this.Maximum = 0;
    this.Dependencies = [];
    this.DisplayType = +displaytype;
    this.Display = +display;
    this.LevelType = +leveltype;
    this.Value = value;
    this.Level = Array(5);
    this.Signals = [];
    this.Section = Array(6); // buy, sell, exit_buy, exit_sell, bull, bear 
    if (this.Type == "SYSTEM" || this.Type == "PREDEFINED") this.ProgName = period;
    else
    if (this.Type == "SAR") {
        this.Step = +period;
        this.Maximum = +method;
    }
    this.Indicator = new IndicatorLayout(this);
    for (i = 0; i < 5; i++) {
        this.Level[i] = new Array(NBR_PERIODS);
        for (k = 0; k < NBR_PERIODS; k++) this.Level[i][k] = 0;
    }
    this.ReturnObjectTypeName = function () {
        if (this.Type == "PREDEFINED") return this.Name;
        else return this.Type;
    }
    this.ReturnLevels = function (period) {
        var values = [];
        for (var i = 0; i < 5; i++) {
            values.push(this.Level[i][period] == EMPTY_VALUE ? -1 : this.Level[i][period]);
        }
        return values;
    }
};

function pgsignal(id, color, visible, sound) {
    this.Id = id;
    this.Type;
    this.Name = SignalName[id];
    this.BName;
    this.Sound = sound == '' ? SignalBName[id] : sound;
    this.Visible = visible;
    this.bValue;
    this.Color = color == '' ? SignalColor[id] : color;
    this.Description;
};


function pgsession(sessionnumber, enginename, symbol, startdate, engineindex, engineoperation, enginerule, bnbrlot, snbrlot, bnbrtrade, snbrtrade, bprofit, sprofit, hedgetype, bhprofit, shprofit, profit, tprofit, baverage, saverage, minpoint, maxpoint) {
    this.StartAutomatic;
    this.BuySellAutomatic;
    this.ExitAutomatic;
    this.HedgeAutomatic;
    this.DeHedgeAutomatic;
    this.Operation = engineoperation;
    this.StartRule = enginerule;
    this.BuyRule;
    this.SellRule;
    this.ExitBuyRule;
    this.ExitSellRule;
    this.ExitRule;
    this.ILot;
    this.MaxLot;
    this.MaxCount;
    this.Direction;
    this.DirectionType;
    this.RecoveryMode;
    this.RecoveryValue;
    this.PipStep;
    this.TimeStep;
    this.OrderType;
    this.KeepBuySell;
    this.OneOrderPerBar;
    this.ExitMode;
    this.MaxTime;
    this.HedgeMagnitude;
    this.MinProfit;
    this.BuyMinProfit;
    this.SellMinProfit;
    this.TP;
    this.TS;
    this.SL;
    this.BuyTP;
    this.BuyTS;
    this.BuySL;
    this.SellTP;
    this.SellTS;
    this.SellSL;
    this.BuyLotTP;
    this.BuyLotTS;
    this.BuyLotSL;
    this.SellLotTP;
    this.SellLotTS;
    this.SellLotSL;
    this.ExitBuy;
    this.ExitSell;
    // OUTPUT
    this.Active = 0;
    this.Number;
    this.Engine = enginename;
    this.SessionNumber = sessionnumber;
    this.Symbol = symbol;
    this.EngineIndex = engineindex;
    this.StartDate = startdate;
    this.NbrLots;
    this.BuyLot = bnbrlot;
    this.SellLot = snbrlot;
    this.BuyNbrTrade = bnbrtrade;
    this.SellNbrTrade = snbrtrade;
    this.HedgeNbrLots;
    this.SellProfit = sprofit;
    this.BuyProfit = bprofit;
    this.HedgeType = hedgetype;
    this.HasBeenHedged;
    this.HedgeBuyProfit = bhprofit;
    this.HedgeSellProfit = shprofit;
    this.HedgeProfit;
    this.Profit = profit;
    this.TotalProfit = tprofit;
    this.TakeProfitBuy;
    this.TakeProfitSell;
    this.Hedged;
    this.Symbol;
    this.Type;
    this.Property = [];
    this.Bid;
    this.Ask;
    this.Lots;
    this.HedgePoint;
    this.BuyAveragePoint = baverage;
    this.SellAveragePoint = saverage;
    this.MinPoint = minpoint;
    this.MaxPoint = maxpoint;
    this.boxData = [];
    this.Orders = [];
    this.Set = function (bnbrlot, snbrlot, bnbrtrade, snbrtrade, bprofit, sprofit, hedgetype, bhprofit, shprofit, profit, tprofit, baverage, saverage, minpoint, maxpoint) {
        this.BuyLot = bnbrlot;
        this.SellLot = snbrlot;
        this.BuyNbrTrade = bnbrtrade;
        this.SellNbrTrade = snbrtrade;
        this.SellProfit = sprofit;
        this.BuyProfit = bprofit;
        this.HasBeenHedged;
        this.HedgeType = hedgetype;        
        this.HedgeBuyProfit = bhprofit;
        this.HedgeSellProfit = shprofit;
        this.Profit = profit;
        this.TotalProfit = tprofit;
        this.BuyAveragePoint = baverage;
        this.SellAveragePoint = saverage;
        this.MinPoint = minpoint;
        this.MaxPoint = maxpoint;
    }
};

function pgalert(id, objectname, signalname, periods, operator, notname, previous, type, opvalue, value, color) {
    this.Id = id;
    this.Object = objectname;
    this.Signal = signalname;
    this.Periods = periods;
    this.Operator = operator;
    this.Not = notname;
    this.Previous = previous;
    this.Type = type;
    this.OpValue = opvalue;
    this.Value = value;

    this.OnOff = [0,0,0,0];
    this.Graphic_code = 233;
    this.Graphic_color = color;
    this.Graphic_from = 0;
    this.Graphic_size = 20;
    this.Graphic_distance = 0;
    this.Sound_Text = '';
    this.Alert_Text = '';
    this.Mail_FromName = 'PROGRESS SIGNAL';
    this.Mail_FromAdress = 'administrator@mt4-progress.com';
    this.Mail_ToAdress = '';
    this.Mail_CcAdress = '';
    this.Mail_Subject = '* ' + objectname + ' ' + signalname;
    this.Mail_Content = '';
    this.SCContent = "";    
    this.Set = function (onoff, code, color, from, size, distance, soundtext, alerttext, mailfromname, mailfromadress, mailtoadress, mailccadress, mailsubject, mailcontent) {
        this.OnOff = onoff;
        this.Graphic_code = code;
        this.Graphic_color = color;
        this.Graphic_from = from;
        this.Graphic_size = size;
        this.Graphic_distance =distance;
        this.Sound_Text = soundtext;
        this.Alert_Text = alerttext;
        this.Mail_FromName = mailfromname;
        this.Mail_FromAdress = mailfromadress;
        this.Mail_ToAdress = mailtoadress;
        this.Mail_CcAdress = mailccadress;
        this.Mail_Subject = mailsubject;
        this.Mail_Content = mailcontent;
    }    
};

function pgconnection(symbol, socket) {
    this.SymbolName = id;
    this.Socket = socket;
};

function pgenginehistory() {
    this.Profit = 0;
    this.BuyProfit = 0;
    this.SellProfit = 0;
    this.NbrLaunch = 0;
    this.NbrGain = 0;
    this.NbrLoose = 0;
    this.NbrBuyLot = 0;
    this.NbrSellLot = 0;
    this.NbrBuyTrade = 0;
    this.NbrSellTrade = 0;
}


function pgtester(pg, number, name, operation, rule, content) {
    this.PG = pg;    
    this.Id = number;
    this.Type = 'boolean',  // can be value
    this.Name = name;
    this.Operation = operation;
    this.StartRule = rule;
    this.Section;
    this.Indicators = [];
    this.SCContent = content;
    this.JSContent = "";
    this.StartAsync = 0;
    this.CurrentBar = 0;
    this.StartBar = 0;
    this.EndBar = 0;    
    this.Periods = [];
    this.Signals = [];
    this.MinPeriod = null;
    this.MaxPeriod = null;
    this.CurrentPeriod = null;
    this.Data = [];

}

function pgcondition(pg, name, sccontent, section) {
    this.PG = pg;    
    this.Name = name;
    this.Section = section;
    this.Conditions = [];
    this.Indicators = [];
    this.Periods = [];
    this.Signals = [];
    this.SCContent = sccontent;
}
function pgmarker(pg, name, sccontent, section) {
    this.PG = pg;    
    this.Name = name;
    this.Section = section;
    this.Indicators = [];
    this.Periods = [];
    this.Signals = [];    
    this.SCContent = sccontent;    
    this.Symbol = null;
    this.Id = '';
    this.Type = 'Numeric',  // can be value

    this.Operation = "BUYSELL";
    this.StartRule = "A";
    this.JSContent = "";
    this.StartAsync = 0;
    this.CurrentBar = 0;
    this.StartBar = 0;
    this.EndBar = 0;    
    this.MinPeriod = null;
    this.MaxPeriod = null;
    this.CurrentPeriod = null;
    this.Data = [];
    this.Reset = function (symbol, content) {
        this.MinPeriod = null;
        this.MaxPeriod = null;
        this.CurrentPeriod = null;
        this.Periods = [];  
        this.SCContent = content;  
        this.Symbol = symbol;                   
    }
    this.iTime = function(symbol, period, shift) {   //returns the last ticker value time
        if (!symbol) {
            let symbolcanvas = solution.GetCanvasFromTerminal();
            if (!symbolcanvas) {
                return 0;   
            }
            symbol = symbolcanvas.CurrentSymbol;
        }        
    
        if (!this.Data[period] || this.Data[period].length == 0) {
            return 0;
        }
    
        let lastindex = this.Data[period].length - 1;
        let currentbarindex = lastindex - shift;
    
        return this.Data[period][currentbarindex].date.getTime() / 1000;
    }
    
    this.TimeCurrent = function() {
        return iTime(null, this.CurrentPeriod, 0);
    }    
}

function pgengine(pg, name, operation, startrule, buyrule, sellrule, exitbuyrule, exitsellrule, exitrule, ilot, maxlot, maxcount, direction, directiontype, recoverymode, recoveryvalue, pipstep, timestep, ordertype, keepbuysell, oneorderperbar, exitmode, maxtime, hedgemagnitude, minprofit, buyminprofit, sellminprofit, tp, ts, sl, buytp, buyts, buysl, selltp, sellts, sellsl, buylottp, buylotts, buylotsl, selllottp, selllotts, selllotsl) {
    this.PG = pg;    
    this.Name = name;
    this.Operation = operation;
    this.StartRule = startrule;
    this.BuyRule = buyrule;
    this.SellRule = sellrule;
    this.ExitBuyRule = exitbuyrule;
    this.ExitSellRule = exitsellrule;
    this.ExitRule = exitrule;
    this.ILot = ilot;
    this.MaxLot = maxlot;
    this.MaxCount = maxcount;
    this.Direction = direction;
    this.DirectionType = directiontype;
    this.RecoveryMode = recoverymode;
    this.RecoveryValue = recoveryvalue;
    this.PipStep = pipstep;
    this.TimeStep = timestep;
    this.OrderType = ordertype;
    this.KeepBuySell = keepbuysell;
    this.OneOrderPerBar = oneorderperbar;
    this.ExitMode = exitmode;
    this.MaxTime = maxtime;
    this.HedgeMagnitude = hedgemagnitude;
    this.MinProfit = minprofit;
    this.BuyMinProfit = buyminprofit;
    this.SellMinProfit = sellminprofit;
    this.TP = tp;
    this.TS = ts;
    this.SL = sl;
    this.BuyTP = buytp;
    this.BuyTS = buyts;
    this.BuySL = buysl;
    this.SellTP = selltp;
    this.SellTS = sellts;
    this.SellSL = sellsl;
    this.BuyLotTP = buylottp;
    this.BuyLotTS = buylotts;
    this.BuyLotSL = buylotsl;
    this.SellLotTP = selllottp;
    this.SellLotTS = selllotts;
    this.SellLotSL = selllotsl;
    this.Code = [-1, -1];
    this.SCContent = "";
    this.JSContent = "var R_" + startrule + "_RULE  = function () {};";
    this.Schedules = [];
    this.Conditions = [];
    this.Indicators = [];
    this.Signals = [];
    this.Actions = [];
    this.Periods = [];
    this.MinPeriod = null;
    this.MaxPeriod = null;    
    
    this.History = null;
    this.Copy = function (engine) {
        this.Name = engine.Name;
        this.Operation = engine.Operation;
        this.StartRule = engine.StartRule;
        this.BuyRule = engine.BuyRule;
        this.SellRule = engine.SellRule;
        this.ExitBuyRule = engine.ExitBuyRule;
        this.ExitSellRule = engine.ExitSellRule;
        this.ExitRule = engine.ExitRule;
        this.ILot = engine.ILot;
        this.MaxLot = engine.MaxLot;
        this.MaxCount = engine.MaxCount;
        this.Direction = engine.Direction;
        this.DirectionType = engine.DirectionType;
        this.RecoveryMode = engine.RecoveryMode;
        this.RecoveryValue = engine.RecoveryValue;
        this.PipStep = engine.PipStep;
        this.TimeStep = engine.TimeStep;
        this.OrderType = engine.OrderType;
        this.KeepBuySell = engine.KeepBuySell;
        this.OneOrderPerBar = engine.OneOrderPerBar;
        this.ExitMode = engine.ExitMode;
        this.MaxTime = engine.MaxTime;
        this.HedgeMagnitude = engine.HedgeMagnitude;
        this.MinProfit = engine.MinProfit;
        this.BuyMinProfit = engine.BuyMinProfit;
        this.SellMinProfit = engine.SellMinProfit;
        this.TP = engine.TP;
        this.TS = engine.TS;
        this.SL = engine.SL;
        this.BuyTP = engine.BuyTP;
        this.BuyTS = engine.BuyTS;
        this.BuySL = engine.BuySL;
        this.SellTP = engine.SellTP;
        this.SellTS = engine.SellTS;
        this.SellSL = engine.SellSL;
        this.BuyLotTP = engine.BuyLotTP;
        this.BuyLotTS = engine.BuyLotTS;
        this.BuyLotSL = engine.BuyLotSL;
        this.SellLotTP = engine.SellLotTP;
        this.SellLotTS = engine.SellLotTS;
        this.SellLotSL = engine.SellLotSL;
        this.Code = engine.Code.slice(0);
        this.SCContent = engine.SCContent;
        this.JSContent = engine.JSContent;
        this.Schedules = [];
        for (var i = 0; i < engine.Schedules.length; i++) {
            this.Schedules.push({...engine.Schedules[i]});
        }
    }
    this.Clone = function () {
        var engine = new pgengine();
        engine.PG = this.PG;
        engine.Name = this.Name;
        engine.Operation = this.Operation;
        engine.StartRule = this.StartRule;
        engine.BuyRule = this.BuyRule;
        engine.SellRule = this.SellRule;
        engine.ExitBuyRule = this.ExitBuyRule;
        engine.ExitSellRule = this.ExitSellRule;
        engine.ExitRule = this.ExitRule;
        engine.ILot = this.ILot;
        engine.MaxLot = this.MaxLot;
        engine.MaxCount = this.MaxCount;
        engine.Direction = this.Direction;
        engine.DirectionType = this.DirectionType;
        engine.RecoveryMode = this.RecoveryMode;
        engine.RecoveryValue = this.RecoveryValue;
        engine.PipStep = this.PipStep;
        engine.TimeStep = this.TimeStep;
        engine.OrderType = this.OrderType;
        engine.KeepBuySell = this.KeepBuySell;
        engine.OneOrderPerBar = this.OneOrderPerBar;
        engine.ExitMode = this.ExitMode;
        engine.MaxTime = this.MaxTime;
        engine.HedgeMagnitude = this.HedgeMagnitude;
        engine.MinProfit = this.MinProfit;
        engine.BuyMinProfit = this.BuyMinProfit;
        engine.SellMinProfit = this.SellMinProfit;
        engine.TP = this.TP;
        engine.TS = this.TS;
        engine.SL = this.SL;
        engine.BuyTP = this.BuyTP;
        engine.BuyTS = this.BuyTS;
        engine.BuySL = this.BuySL;
        engine.SellTP = this.SellTP;
        engine.SellTS = this.SellTS;
        engine.SellSL = this.SellSL;
        engine.BuyLotTP = this.BuyLotTP;
        engine.BuyLotTS = this.BuyLotTS;
        engine.BuyLotSL = this.BuyLotSL;
        engine.SellLotTP = this.SellLotTP;
        engine.SellLotTS = this.SellLotTS;
        engine.SellLotSL = this.SellLotSL;
        engine.Code = this.Code.slice(0);
        engine.SCContent = this.SCContent;
        engine.JSContent = this.JSContent;
        engine.Schedules = [];
        for (var i = 0; i < this.Schedules.length; i++) {
            engine.Schedules.push({
                ...this.Schedules[i]
            });
        }
        engine.Conditions = [];
        for (var i = 0; i < this.Conditions.length; i++) {
            engine.Conditions.push({
                ...this.Conditions[i]
            });
        }
        return engine;
    }
    this.Load = function (rootobject, async) {
        if (!async) async = false;
       
        var url = rootobject + "input/ss/R_" + this.StartRule + "_" + this.Operation + ".ss";
        var xhttp = new XMLHttpRequest();
        xhttp.engine = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                this.engine.Code[CODE_SS] = data;
                this.engine.SCContent = data;
            }
        };
        xhttp.open("GET", url, async);
    //    xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.send();
    }
    this.ScheduleSave = function () {
    }
    
    this.Save = function () {
        this.ScheduleSave(); // no matter with no schedule
        var line = "B_NAME,B_OPERATION,B_STARTRULE,B_BUYRULE,B_SELLRULE,B_EXITBUYRULE,B_EXITSELLRULE,B_EXITRULE,B_ILOT,B_MAXLOT,B_MAXCOUNT,B_DIRECTION, B_DIRECTIONTYPE, B_RECOVERYMODE,B_RECOVERYVALUE,B_PIPSTEP,B_TIMESTEP,B_ORDERTYPE,B_KEEPBUYSELL,B_ONEORDERPERBAR,B_EXITMODE,B_MAXTIME,B_HEDGEMAGNITUDE,B_MINPROFIT,B_BUYMINPROFIT,B_SELLMINPROFIT,B_TP,B_TS,B_SL,B_BUYTP,B_BUYTS,B_BUYSL,B_SELLTP,B_SELLTS,B_SELLSL,B_BUYLOTTP,B_BUYLOTTS,B_BUYLOTSL,B_SELLLOTTP,B_SELLLOTTS,B_SELLLOTSL\n";
        line += this.Name = name + ",";
        line += this.Operation + ",";
        line += this.StartRule + ",";
        line += this.BuyRule + ",";
        line += this.SellRule + ",";
        line += this.ExitBuyRule + ",";
        line += this.ExitSellRule + ",";
        line += this.ExitRule + ",";
        line += this.ILot + ",";
        line += this.MaxLot + ",";
        line += this.MaxCount + ",";
        line += this.Direction + ",";
        line += this.DirectionType + ",";
        line += this.RecoveryMode + ",";
        line += this.RecoveryValue + ",";
        line += this.PipStep + ",";
        line += this.TimeStep + ",";
        line += this.OrderType + ",";
        line += this.KeepBuySell + ",";
        line += this.OneOrderPerBar + ",";
        line += this.ExitMode + ",";
        line += this.MaxTime + ",";
        line += this.HedgeMagnitude + ",";
        line += this.MinProfit + ",";
        line += this.BuyMinProfit + ",";
        line += this.SellMinProfit + ",";
        line += this.TP + ",";
        line += this.TS + ",";
        line += this.SL + ",";
        line += this.BuyTP + ",";
        line += this.BuyTS + ",";
        line += this.BuySL + ",";
        line += this.SellTP + ",";
        line += this.SellTS + ",";
        line += this.SellSL + ",";
        line += this.BuyLotTP + ",";
        line += this.BuyLotTS + ",";
        line += this.BuyLotSL + ",";
        line += this.SellLotTP + ",";
        line += this.SellLotTS + ",";;
        line += this.SellLotSL + "\n";
        return line;
    }
    this.ObjetsSave = function () {
        var line = "ID,NAME,TYPE,CROSS,PERIOD,METHOD,APPLY,SHIFT,MODE,DISPLAY_TYPE, DISPLAY, LEVELTYPE, VALUE1, VALUE2, VALUE3, VALUE4,LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9, LEVEL1, LEVEl2, LEVEL3, LEVEL4, LEVEL5, LEVEL6, LEVEL7, LEVEL8, LEVEL9\n";
        for (var k = 0; k < this.Indicators.length; k++) {
            var object = PG.GetObjectFromName(this.Indicators[k].Val.Name);
            if (!object) continue;
            line += object.Id + "," + object.Name + "," + object.Type + "," + object.Cross + ",";
            if (object.Type == "CUSTOM" || object.Type == "PREDEFINED") {
                line += object.ProgName + ",";
            } else {
                if (object.Type == "SAR") {
                    line += object.Step + ",";
                } else {
                    line += object.Period + ",";
                }
            }
            if (object.Type == "SAR") {
                line += object.Maximum + ",";
            } else {
                line += object.Method + ",";
            }
            line += object.Apply + ",";
            line += object.Shift + ",";
            line += object.Mode + ",";
            line += object.DisplayType + ",";
            line += object.Display + ",";
            line += object.LevelType + ",";
            for (var i = 0; i < 4; i++) {
                line += object.Value[i] + ",";
            }
            for (var i = 0; i < 5; i++)
                for (var p = 0; p < NBR_PERIODS; p++) {
                    if (object.Level[i][p] == EMPTY_VALUE) line += "--";
                    else line += object.Level[i][p];
                    if (p == 8 && i == 4) line += "\n";
                    else line += ",";
                }
        }
        return line;
    }
  
    this.GetDescriptionProperties = function (step) {
        var s = '';
                
        var s_STRATEGYNAME ='2 - NAME / DESCRIPTION '  + '\r\n----------------------------\r\n' + 
            
                '\r\n    Name :    ' + this.Name;
                
        s += s_STRATEGYNAME + '\r\n\r\n';

        var s_STRATEGYPROPERTIES ='3 - Buy/Sell Properties ' + '\r\n---------------------\r\n' + 
            
                '\r\n    Operation : ' + this.Operation + ' ' + ((this.Operation == "BUY") ? ' (only Buy Orders)' : ((this.Operation == "SELL") ? '  (only Sell Orders)' : ' (Buy and Sell Orders)')) + 
                '\r\n    Order Type : ' + this.OrderType +                   
                '\r\n    Initial Lot : ' + (this.ILot == 0 ? '2% of the current account' : this.ILot)  + 
                '\r\n    Max Lot : '  + (this.MaxLot == 0 ? 'not set (Terminal Max)' : this.MaxLot) + 
                '\r\n    Recovery Mode : ' + this.RecoveryMode + ' : ' + getmenufromname(RecoveryModeMenu, this.RecoveryMode, 'type').tooltip + 
                '\r\n    Recovery Value : ' + this.RecoveryValue +                 
                '\r\n    Max Count : ' + this.MaxCount + ' trades allowed simultaneously' + 
                '\r\n    OneOrderPerBar : ' + this.OneOrderPerBar +  ((this.OneOrderPerBar == "TRUE") ? ' One Order can be placed on each bar of the Expert Time Frame' : ' Orders can be placed on the same bar of the Expert Time Frame') +                 

                '\r\n    Direction : ' + this.Direction + ' ' + ((this.Direction == "BACKWARD") ? ' Orders are possible if price is below or Above the previous order for Buy or Sell respectively ' : ((this.Direction == "FORWARD") ? ' Orders are possible if price is Above or Below the previous order for Buy or Sell respectively (Trend direction)' : ' Orders can be done anywhere')) +
                '\r\n    Direction Type : ' + this.DirectionType + ' that means ' +  ((this.DirectionType == "MINMAX") ? DirectionTypeDescription[0] : DirectionTypeDescription[1]) +               
                ((this.PipStep == "0") ? (
                '\r\n    Pip Step : No minimum pipsteps between two consecutive trades ') : (
                '\r\n    Pip Step : ' + this.PipStep + ' pipsteps is required between two consecutive trades')) + 
                ((this.TimeStep == "0") ? (
                '\r\n    Time Step : No minimum time is required between two consecutive trades') : (
                '\r\n    Time Step : ' + this.TimeStep + ' minutes is required between two consecutive trades')) + 
                '\r\n    HedgeMagnitude : HedgeMagnitude ' + this.HedgeMagnitude;             
        
        s += s_STRATEGYPROPERTIES + '\r\n\r\n';

        
        var s_STRATEGYPROFIT = '4 - Profit SL/TP' + '\r\n--------------------------------------\r\n' + 

                '\r\n   - Orders Profit/Loss *in Pips* ' + '\r\n--------------------------------------\r\n' +         
            
                (this.BuyLotTP != "0" ? (
                '\r\n    Take profit of ' + this.BuyLotTP + ' is placed on all buy trades') : '') + 
                ((this.BuyLotSL != "0" ? (
                '\r\n    Stop Loss of ' + this.BuyLotSL + ' is placed on all buy trades') : '')) + 
                ((this.BuyLotTS != "0" ? (
                '\r\n    Trailing Stop of ' + this.BuyLotTS + ' is placed on all buy trades') : '')) + 
                ((this.SellLotTP != "0") ? (
                '\r\n    Take profit of ' + this.SellLotTP + ' is placed on all sell trades') : '') + 
                ((this.SellLotSL != "0") ? (
                '\r\n    Stop Loss of ' + this.SellLotSL + ' is placed on all sell trades') : '') + 
                ((this.SellLotTS != "0") ? (
                '\r\n    Trailing Stop of ' + this.SellLotTS + ' is placed on all sell trades') : '') + 
            
                '\r\n   - Expert Global Profit/Loss *in Account Currency' + '\r\n  -----------------\r\n' + 
                
                ((this.TP == "0") ? (
                '\r\n    No Take profit for the session') : (
                '\r\n    Take Profit of ' + this.TP + '  to close all orders in the session')) + 
                ((this.TS == "0") ? (
                '\r\n    No Trailing Stop for the session') : (
                '\r\n    Trailing Stop of ' + this.TS + ' for the session')) + 
                ((this.SL == "0") ? (
                '\r\n    No Stop Loss for the session') : (
                '\r\n    Stop Loss of ' + this.SL + '  to close all orders in the session')) + 
                ((this.BuyTP == "0") ? (
                '\r\n    No Take profit for buy orders in the session') : (
                '\r\n    Take Profit of ' + this.BuyTP + '  to close all buy orders in the session')) + 
                ((this.BuyTS == "0") ? (
                '\r\n    No Trailing Stop for buy orders in the session') : (
                '\r\n    Trailing Stop of ' + this.BuyTS + ' for all buy orders in the session')) + 
                ((this.BuySL == "0") ? (
                '\r\n    No Stop Loss for buy orders in the session') : (
                '\r\n    Stop Loss of ' + this.BuySL + '  to close all buy orders in the session')) + 
                ((this.SellTP == "0") ? (
                '\r\n    No Take profit for sell orders in the session') : (
                '\r\n    Take Profit of ' + this.SellTP + '  to close all sellorders in the session')) + 
                ((this.SellTS == "0") ? (
                '\r\n    No Trailing Stop for sell orders in the session') : (
                '\r\n    Trailing Stop of ' + this.SellTS + ' for all sell orders the session')) + 
                ((this.SellSL == "0") ? (
                '\r\n    No Stop Loss for sell orders in the session') : (
                '\r\n    Stop Loss of ' + this.SellSL + '  to close all sell orders in the session')); 
                
        s += s_STRATEGYPROFIT + '\r\n\r\n';      
         
        var s_STRATEGYEXIT ='5 - Exit Properties ' + '\r\n---------------------\r\n' + 

                '\r\n    Exit Mode : Exit Mode ' + this.ExitMode +                  
                '\r\n    Max Time : ' + (this.MaxTime !=0 ?  'The Stragegy will exit after ' +  this.MaxTime + ' minutes whenever the profit is positive' : '0 means Not Applied') +                  
                '\r\n    KeepBuySell : KeepBuySell ' + this.KeepBuySell +                   
        
                '\r\n\r\n  - Minimum Profit' + '\r\n  -------------------\r\n' + 
                
                ((this.MinProfit == -1) ? (
                '\r\n    No minimum profit is required to exit the session') : (
                '\r\n    A minimum of ' + this.MinProfit + ' is required to exit the session')) + 
                ((this.BuyMinProfit == -1) ? (
                '\r\n    No minimum profit is required to exit buy orders in the session') : (
                '\r\n    A minimum of ' + this.BuyMinProfit + ' is required to exit buy orders in the session')) + 
                ((this.SellMinProfit == -1) ? (
                '\r\n    No minimum profit is required to exit sell orders in the session') : (
                '\r\n    A minimum of ' + this.SellMinProfit + ' is required to exit sell orders in the session')) + 
                '\r\n\r\n          *When Exit Buy is performed no more BUY trades can be placed in the session, same for Exit Sell';
        
        s += s_STRATEGYEXIT + '\r\n\r\n';      
                
                
        var s_STRATEGYRULES = '6 - Rules' + '\r\n--------------------------------------\r\n'; 
        
        s += s_STRATEGYRULES + '\r\n\r\n';    
        
        var schedule = this.Schedules[0];   

        var s_STRATEGYSCHEDULE = '7 - Schedule' + '\r\n--------------------------------------\r\n\r\n' +

            (this.Schedules.length != 0 ?  

                '        Start Month : '            +  (schedule.StartMonth != -1 ?            MonthsMenu[schedule.StartMonth - 1].text : 'Not Set' ) +   '\r\n' +  
                '        End   Month : '            +  (schedule.EndMonth  != -1 ?             MonthsMenu[schedule.EndMonth - 1].text   : 'Not Set' )  +   '\r\n' +  
                '        Start Week  : '            +  (schedule.FromOccurenceWeek  != -1 ?    WeeksMenu[schedule.FromOccurenceWeek - 1].text   : 'Not Set' ) +   '\r\n' +  
                '        End   Week  : '            +  (schedule.ToOccurenceWeek  != -1 ?      WeeksMenu[schedule.ToOccurenceWeek - 1].text   : 'Not Set' ) +   '\r\n' +  
                '        Start Day   : '            +  (schedule.StartDay  != -1 ?             DaysMenu[schedule.StartDay - 1].text   : 'Not Set' ) +   '\r\n' +  
                '        End   Day   : '            +  (schedule.EndDay  != -1 ?               DaysMenu[schedule.EndDay - 1].text   : 'Not Set' ) +   '\r\n' +  
                '        Start Time  : '            +  (schedule.StartTime  != -1 ?            schedule.StartTime   : 'Not Set' ) +   '\r\n' +  
                '        End   Time  : '            +  (schedule.EndTime  != -1 ?              schedule.EndTime   : 'Not Set' ) +   '\r\n' +  
                '        Frequency   : '            +  (schedule.FrequencyDay  != -1 ?         schedule.FrequencyDay   : 'Not Set' ) +   '\r\n' +  
                '        One Launch Per Bar     : ' +  (schedule.OnSameBar  != -1 ?            schedule.OnSameBar   : 'Not Set' ) +   '\r\n' +  
                '        Time Between Session   : ' +  (schedule.TimeBetweenSession  != -1 ?   schedule.TimeBetweenSession   : 'Not Set' ) +   '\r\n' +  
                '        Time Zone   : '            +  (schedule.TimeZone  != -1 ?             schedule.TimeZone   : 'Not Set' ) +   '\r\n'  
            :
                s += 'NO SCHEDULE SET FOR THIS STRATEGY        ' +   '\r\n')  

        s += s_STRATEGYSCHEDULE + '\r\n\r\n'; 
        
        if (!step) return s;

        switch (step) {
            case STEP_STRATEGYNAME :
                return s_STRATEGYNAME;
            case STEP_STRATEGYPROPERTIES :
                return s_STRATEGYPROPERTIES;
            case STEP_STRATEGYPROFIT :
                return s_STRATEGYPROFIT;
            case STEP_STRATEGYEXIT :
                return s_STRATEGYEXIT;
            case STEP_STRATEGYRULES :
                return s_STRATEGYRULES;
            case STEP_STRATEGYSCHEDULE :
                return s_STRATEGYSCHEDULE;
        }
    }
}


function pgengine_s(pg, Operation, Rule) {
    var engine = new pgengine(pg, '', Operation, Rule);
    var rule = RuleName[Rule];
    engine.Name = ""
    engine.Operation = OperationName[Operation];
    engine.StartRule = rule;
    engine.BuyRule = rule;
    engine.SellRule = rule;
    engine.ExitBuyRule = rule;
    engine.ExitSellRule = rule;
    engine.ExitRule = rule;
    engine.ILot = "0.1";
    engine.MaxLot = "1";
    engine.MaxCount = "1";
    engine.Direction = "ANY";
    engine.DirectionType = "LEVEL";
    engine.RecoveryMode = "C";
    engine.RecoveryValue = "1";
    engine.PipStep = "10";
    engine.TimeStep = "10";
    engine.OrderType = "MONO";
    engine.KeepBuySell = "FALSE";
    engine.OneOrderPerBar = "FALSE";
    engine.ExitMode = "EXITANY"
    engine.MaxTime = "0";
    engine.HedgeMagnitude = "1";
    engine.MinProfit = "100";
    engine.BuyMinProfit = "100";
    engine.SellMinProfit = "100";
    engine.TP = "0";
    engine.TS = "0";
    engine.SL = "0";
    engine.BuyTP = "0";
    engine.BuyTS = "0";
    engine.BuySL = "0";
    engine.SellTP = "0";
    engine.SellTS = "0";
    engine.SellSL = "0";
    engine.BuyLotTP = "0";
    engine.BuyLotTS = "0";
    engine.BuyLotSL = "0";
    engine.SellLotTP = "0";
    engine.SellLotTS = "0";
    engine.SellLotSL = "0";
    engine.Code = [-1, -1];
    engine.SCContent = "";
    engine.JSContent = "var R_" + rule + "_RULE  = function () {};";
    return engine;
};
function pgstrategy() {
    this.Name;
    this.Rule;
    
    this.Description = DefaultStrategyDescription;
    this.InitialBalance = "1000";
    this.TimeFrame = "ANY";                   //M1
    this.UsedIndicators = [];


    this.Operation;                         //BUYSELL = 2 or BUY or SELL = 0
    this.Dependencies = [];                 //object dependency
    this.LDependencies = [];                //condition dependency
    this.pBEngine;
    this.pSEngine;
    this.Code = [-1, -1];
    this.CContent = "";
    this.MQ4Content = "";
    this.Schedules = [];
    this.BLogicals = [[],[],[],[],[],[],[],[],[],[],[],[],[],[] ];
    this.SLogicals = [[],[],[],[],[],[],[],[],[],[],[],[],[],[] ];
    this.ShouldSave = false;
    this.Created = false;
    
    
    this.Load = function (rootobject, async) {
        if (!async) async = false;
            
        var engine = this.pBEngine;
        
        if (engine.Operation == "BUYSELL" || engine.Operation == "BUY") {
            engine = this.pBEngine;
            if (engine.Code[CODE_SS] == -1) 
                engine.Load(rootobject, async);
        }
        
        if (engine.Operation != "BUYSELL") {
            engine = this.pSEngine;
            if (engine.Code[CODE_SS] == -1) 
                engine.Load(rootobject, async);
        }
        
        if (this.Code[CODE_CPP] != -1) return;
        
        var url = rootobject + "input/R_" + this.pBEngine.StartRule + ".cpp";

        
        var xhttp = new XMLHttpRequest();
        xhttp.strategy = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = this.responseText;
                this.strategy.Code[CODE_CPP] = data;
                this.strategy.CContent = data;
            }
        };
        xhttp.open("GET", url, async);
      //  xhttp.setRequestHeader('Cache-Control', 'no-cache');
        xhttp.send();
    }
    this.Clone = function () {
        var strategy = new pgstrategy();
        strategy.Name       = this.Name;
        strategy.Rule       = this.Rule;
        strategy.Description= this.Description;
        strategy.Operation  = this.Operation;
        strategy.Dependencies= this.Dependencies.slice(0);
        strategy.LDependencies= this.LDependencies.slice(0);
        strategy.pBEngine   = this.pBEngine.Clone();
        strategy.pSEngine   = this.pSEngine.Clone();
        strategy.Code       = this.Code.slice(0);
        strategy.CContent   = this.CContent;
        strategy.MQ4Content = this.MQ4Content;
        strategy.Schedules  = this.Schedules.slice(0);
        strategy.BLogicals  = this.BLogicals.slice(0);
        strategy.SLogicals  = this.SLogicals.slice(0);
        strategy.ShouldSave = this.ShouldSave;
        strategy.Created    = this.Created;        
        return strategy;
    }
    this.AddCondition = function (operationtype, operation, Logical) {
        var OperationType = OperationName.indexOf(operationtype);
        var Operation = OperationName.indexOf(operation);
        if (OperationType == OP_BUY || OperationType == OP_BUYSELL) {
            this.BLogicals[Operation].push(Logical);
        } else {
            this.SLogicals[Operation].push(Logical);
        }
    }
    this.SetType = function (recoverymode) {
        
    }
    /*	
    	void UpdateLogicals  (CString NewName, CString OldName);
    	void ResetLogicals (int OperationType);
    	void AddLogical(int OperationType, int Operation, CLogical* pLogical);
    	void RemoveLogical(int OperationType, int Operation, CLogical* pLogical);

    */
};

function pgschedule(startrule, operation, currency, startmonth, fromoccurenceweek, startday, starttime, endmonth, tooccurenceweek, enday, endtime, freqday, samebar, timebetsession, timezone) {
    this.StartRule = startrule;
    this.Operation = operation;
    this.Currency = currency;
    this.StartMonth = startmonth;
    this.FromOccurenceWeek = fromoccurenceweek;
    this.StartDay = startday;
    this.StartTime = starttime;
    this.EndMonth = endmonth;
    this.ToOccurenceWeek = tooccurenceweek;
    this.EndDay = enday;
    this.EndTime = endtime;
    this.FrequencyDay = freqday;
    this.OnSameBar = samebar;
    this.TimeBetweenSession = timebetsession;
    this.TimeZone = (timezone != "1" ? "0" : "1");
};


function isCyclic(obj) {
    var keys = [];
    var stack = [];
    var stackSet = new Set();
    var detected = false;

    function detect(obj, key) {
        if (obj && typeof obj != 'object') {
            return;
        }
        if (stackSet.has(obj)) { // it's cyclic! Print the object and its locations.
            var oldindex = stack.indexOf(obj);
            var l1 = keys.join('.') + '.' + key;
            var l2 = keys.slice(0, oldindex + 1).join('.');
            console.log('CIRCULAR: ' + l1 + ' = ' + l2 + ' = ' + obj);
            console.log(obj);
            detected = true;
            return;
        }
        keys.push(key);
        stack.push(obj);
        stackSet.add(obj);
        for (var k in obj) { //dive on the object's childrenpg
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                detect(obj[k], k);
            }
        }
        keys.pop();
        stack.pop();
        stackSet.delete(obj);
        return;
    }
    detect(obj, 'obj');
    return detected;
}
