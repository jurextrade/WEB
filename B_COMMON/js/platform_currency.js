

const ForexCurrencies = [
    { id: 0,    Name : "ARS",   PName : "ARS",   SoundName : "",         Description: "Argentine Peso"},
    { id: 1,    Name : "AUD",   PName : "AUD",   SoundName : "",         Description: "Australian Dollar"},
    { id: 2,    Name : "BHD",   PName : "BHD",   SoundName : "",         Description: "Bahraini Dinar"},
    { id: 3,    Name : "BBD",   PName : "BBD",   SoundName : "",         Description: "Barbadian Dollar"},
    { id: 4,    Name : "BRL",   PName : "BRL",   SoundName : "",         Description: "Brazilian Real"},
    { id: 5,    Name : "GBP",   PName : "GBP",   SoundName : "",         Description: "British Pound"},
    { id: 6,    Name : "CAD",   PName : "CAD",   SoundName : "",         Description: "Canadian Dollar"},
    { id: 7,    Name : "XAF",   PName : "XAF",   SoundName : "",         Description: "Central African CFA franc   "},
    { id: 8,    Name : "CLP",   PName : "CLP",   SoundName : "",         Description: "Chilean Peso"},
    { id: 9,    Name : "CNY",   PName : "CNY",   SoundName : "",         Description: "Chinese Yuan"},
    { id: 10,   Name : "CYP",   PName : "CYP",   SoundName : "",         Description: "Cyprus Pound"},
    { id: 11,   Name : "CZK",   PName : "CZK",   SoundName : "",         Description: "Czech Koruna"},
    { id: 12,   Name : "DKK",   PName : "DKK",   SoundName : "",         Description: "Danish Krone"},
    { id: 13,   Name : "XCD",   PName : "XCD",   SoundName : "",         Description: "East Caribbean Dollar"},
    { id: 14,   Name : "EGP",   PName : "EGP",   SoundName : "",         Description: "Egyptian Pound"},
    { id: 15,   Name : "EEK",   PName : "EEK",   SoundName : "",         Description: "Estonian Kroon"},
    { id: 16,   Name : "EUR",   PName : "EUR",   SoundName : "",         Description: "Euro"},
    { id: 17,   Name : "HKD",   PName : "HKD",   SoundName : "",         Description: "Hong Kong Dollar"},
    { id: 18,   Name : "HUF",   PName : "HUF",   SoundName : "",         Description: "Hungarian Forint"},
    { id: 19,   Name : "ISK",   PName : "ISK",   SoundName : "",         Description: "Icelandic Krona"},
    { id: 20,   Name : "INR",   PName : "INR",   SoundName : "",         Description: "Indian Rupee"},
    { id: 21,   Name : "IDR",   PName : "IDR",   SoundName : "",         Description: "Indonesian Rupiah"},
    { id: 22,   Name : "ILS",   PName : "ILS",   SoundName : "",         Description: "Israeli Sheqel"},
    { id: 23,   Name : "JMD",   PName : "JMD",   SoundName : "",         Description: "Jamaican Dollar"},
    { id: 24,   Name : "JPY",   PName : "JPY",   SoundName : "",         Description: "Japanese Yen"},
    { id: 25,   Name : "JOD",   PName : "JOD",   SoundName : "",         Description: "Jordanian Dinar"},
    { id: 26,   Name : "KES",   PName : "KES",   SoundName : "",         Description: "Kenyan Shilling"},
    { id: 27,   Name : "LVL",   PName : "LVL",   SoundName : "",         Description: "Latvian Lats"},
    { id: 28,   Name : "LBP",   PName : "LBP",   SoundName : "",         Description: "Lebanese Pound"},
    { id: 29,   Name : "LTL",   PName : "LTL",   SoundName : "",         Description: "Lithuanian Litas"},
    { id: 30,   Name : "MYR",   PName : "MYR",   SoundName : "",         Description: "Malaysian Ringgit"},
    { id: 31,   Name : "MXN",   PName : "MXN",   SoundName : "",         Description: "Mexican Peso"},
    { id: 32,   Name : "MAD",   PName : "MAD",   SoundName : "",         Description: "Moroccan Dirham"},
    { id: 33,   Name : "NAD",   PName : "NAD",   SoundName : "",         Description: "Namibian Dollar"},
    { id: 34,   Name : "NPR",   PName : "NPR",   SoundName : "",         Description: "Nepalese Rupee"},
    { id: 35,   Name : "NZD",   PName : "NZD",   SoundName : "",         Description: "New Zealand Dollar"},
    { id: 36,   Name : "NOK",   PName : "NOK",   SoundName : "",         Description: "Norwegian Krone"},
    { id: 37,   Name : "OMR",   PName : "OMR",   SoundName : "",         Description: "Omani Rial"},
    { id: 38,   Name : "PKR",   PName : "PKR",   SoundName : "",         Description: "Pakistani Rupee"},
    { id: 39,   Name : "PAB",   PName : "PAB",   SoundName : "",         Description: "Panamanian Balboa"},
    { id: 40,   Name : "PHP",   PName : "PHP",   SoundName : "",         Description: "Philippine Peso"},
    { id: 41,   Name : "PLN",   PName : "PLN",   SoundName : "",         Description: "Polish Zloty"},
    { id: 42,   Name : "QAR",   PName : "QAR",   SoundName : "",         Description: "Qatari Riyal"},
    { id: 43,   Name : "RON",   PName : "RON",   SoundName : "",         Description: "Romanian Leu"},
    { id: 44,   Name : "RUB",   PName : "RUB",   SoundName : "",         Description: "Russian Rouble"},
    { id: 45,   Name : "SAR",   PName : "SAR",   SoundName : "",         Description: "Saudi Riyal"},
    { id: 46,   Name : "SGD",   PName : "SGD",   SoundName : "",         Description: "Singapore Dollar"},
    { id: 47,   Name : "ZAR",   PName : "ZAR",   SoundName : "",         Description: "South African Rand"},
    { id: 48,   Name : "KRW",   PName : "KRW",   SoundName : "",         Description: "South Korean Won"},
    { id: 49,   Name : "LKR",   PName : "LKR",   SoundName : "",         Description: "Sri Lankan Rupee"},
    { id: 50,   Name : "SEK",   PName : "SEK",   SoundName : "",         Description: "Swedish Krona"},
    { id: 51,   Name : "CHF",   PName : "CHF",   SoundName : "",         Description: "Swiss Franc"},
    { id: 52,   Name : "THB",   PName : "THB",   SoundName : "",         Description: "Thai Baht"},
    { id: 53,   Name : "TRY",   PName : "TRY",   SoundName : "",         Description: "Turkish Lira"},
    { id: 54,   Name : "AED",   PName : "AED",   SoundName : "",         Description: "United Arab Emirates Dirham"},
    { id: 55,   Name : "USD",   PName : "USD",   SoundName : "",         Description: "US Dollar"},
    { id: 56,   Name : "VEF",   PName : "VEF",   SoundName : "",         Description: "Venezuelan bolivar"},
    { id: 57,   Name : "XOF",   PName : "XOF",   SoundName : "",         Description: "West African CFA franc"},
    { id: 58 ,  Name:  "XAU",   PName : 'USD',   SoundName : 'gold',     Description: "Gold Spot"},
    { id: 59 ,  Name:  "XAG",   PName : 'USD',   SoundName : 'silver',   Description: "Silver Spot"},
    { id: 60 ,  Name:  "BTC",   PName : 'BTC',   SoundName : '',         Description: "Bit Coin"},
    { id: 61,   Name : "CNH",   PName : "CNH",   SoundName : "",         Description: "Chinese Yuan"}
];


const MarketCurrencies = [
    { id: 0,   Name : "US Dollar ",     PName : "DX-Y.NYB", SoundName : "",         Description: "US Dollar Index"},
    { id: 1,   Name : "Gold ",          PName : "GC=F",     SoundName : "",         Description: "Gold Future e Dec 20"},
    { id: 2,   Name : "Silver ",        PName : "SI=F",     SoundName : "",         Description: "Silver Future e Dec 20"},
    { id: 3,   Name : "Oil|Crude",      PName : "CL=F",     SoundName : "",         Description: "Crude Oil Future Dec 20"},
    { id: 3,   Name : "Bitcoin",        PName : "BTCUSD",   SoundName : "",         Description: "Bitcoin US Dollar"}
    
];




function GetCurrencyPair (symbolname) {
    var fromname = symbolname.substring(0, 3);  // first 3 char
    var toname = symbolname.substring(3);       // last 3 char
    var Pair = [];
    for (var i = 0; i < ForexCurrencies.length; i++) {
        if (fromname == ForexCurrencies[i].Name) {
            if (Pair.length == 1) Pair.unshift(ForexCurrencies[i])
            else Pair.push(ForexCurrencies[i]);
        }
        if (toname == ForexCurrencies[i].Name) {
            Pair.push(ForexCurrencies[i]);
        }
        if (Pair.length == 2) return Pair;
    }
    return Pair;
}   

function onclick_currencyrow(elt, event) {
    let rows = elt.id.split ('_');
    let rowindex = rows[rows.length -1];
    let terminal = solution.GetCurrentTerminal();
    let PG = terminal.PG;
    let symbol = PG.Symbols[rowindex];

    if (terminal == solution.CurrentOptionTerminal) {    
        Option_SelectSymbol (symbol);
    } else {
        Home_SelectSymbol (symbol);
    }
}

function ondblclick_currencyrow(elt, event) {
    let rows = elt.id.split ('_');
    let rowindex = rows[rows.length -1];
    let terminal = solution.GetCurrentTerminal();
    let PG = terminal.PG;
    var symbol = PG.Symbols[rowindex];

    if (terminal == solution.CurrentOptionTerminal) {    
        Option_SelectSymbol (symbol);    
        OrderPanel_Update(symbol, {value : "Stock"})    
    }
}

function RemoveSymbolConfirm(callafter, param) {
    var symbol = param;

    sb.confirm_modal('Are you sure you want to delete '   + symbol.Name + ' ?', 'Delete Current Symbol',  null, true).yes(function () {
        callafter(param);
        $("#confirmmodal").modal('hide');   
 
    }).no(function () {
    })
}

function OnRemoveSymbol(callafter, param) {
    let symbol = param;
    
    if (!symbol) return;

    RemoveSymbolConfirm(callafter, symbol);
}

function onclick_currencyremove (elt, event) {

    let terminal        = solution.GetCurrentTerminal();
    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];

    let recs    = sb.table_getselection (currencytable)
    
    if (recs.length == 0) {
        return;
    }
    let rowindex    = recs[0];
    let symbol      = terminal.PG.Symbols[rowindex];
    if (terminal == solution.CurrentOptionTerminal) {    
        OnRemoveSymbol (OptionRemoveSymbol, symbol);
    } else {
        OnRemoveSymbol (HomeRemoveSymbol, symbol);
    }
}

function currency_selectsymbol(terminal, symbol) {
    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];

    var index = sb.table_getrowfromcolumn(currencytable, 'Ticker', symbol.Name);
    if (index < 0) return;

    sb.table_select (currencytable,  index);
    
    var trchildren = $( '#' + currencytable.id +  ' tbody').children();
    $(trchildren[index])[0].scrollIntoViewIfNeeded();
}

function currency_addsymbol (terminal, symbol) {
    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];

    sb.table_addrow (currencytable, [symbol.PName, symbol.Quote.quoteType.substring (0,3), symbol.Name, '---', '---', '---']); 
    sb.table_addrowclass(currencytable, currencytable.rows.length -1, symbol.Quote.quoteType);

// market        
    let marketpanel =  sb.get(main, 'pname', 'market');
    if (marketpanel.length != 0) {
        market_addsymbol(terminal, symbol)         
    }            
}

function currency_updatesymbol (terminal, symbol) {

    //var index = terminal.PG.GetSymbolIndexFromName(Symbol.Name)


    let platform        = solution.ui.platform_get ('pname', terminal.pname);            
    let currencytable   = sb.get (platform, 'id', terminal.pname + '_currencytable')[0];

    if (!currencytable) {
        return;
    }
    var index = sb.table_getrowfromcolumn(currencytable, 'Ticker', symbol.Name);
    if (index < 0) {
        return;
    }
    
    var symbolcanvas = solution.GetCanvasFromTerminal(terminal);
   

    var symbolcontent = ""; 
    var symbolchange = "";
    var symbolchangepercent = "";
    var color;
    var symbolsign = '+';

    if (symbol.PriceChangePercent >= 0) {
        symbolarrow = '<i class="fa fa-arrow-up"></i>';
        symbolchange = symbol.PriceChange.toFixed(2);
        symbolchangepercent = '(+' + symbol.PriceChangePercent.toFixed(2)  + '%)';

        symbolcontent = '+' + symbolchange + ' ' + symbolchangepercent; 
        color = theme_bull            
    
    } else {
        symbolarrow = '<i class="fa fa-arrow-down"></i>';
        symbolchange =  -symbol.PriceChange.toFixed(2);
        symbolchangepercent =  '(' + symbol.PriceChangePercent.toFixed(2) + '%)';
        symbolsign = '-';
        symbolcontent = symbolchange + ' ' + symbolchangepercent;   
        color = theme_bear;          
    }
    symbol.Color = color;
    sb.table_setcellchildcontent (currencytable, index, 'Symbol',      symbol.PName);     
    sb.table_setcellchildcontent (currencytable, index, 'Ticker',      symbol.Name);               
    sb.table_setcellchildcontent (currencytable, index, 'Last Price',  symbol.Last);
    sb.table_setcellchildcontent (currencytable, index, 'Change',      symbolarrow + symbolchange);
    sb.table_setcellchildcontent (currencytable, index, '% Change',    symbolchangepercent);
    sb.table_setcellchildcolor   (currencytable, index, 'Change',      color);
    sb.table_setcellchildcolor   (currencytable, index, '% Change',    color);

// market        
    let market =  sb.get(main, 'pname', 'market');
    if (market.length != 0) {
        market_updatesymbol (terminal, symbol, symbolchange, symbolchangepercent, color); 
    }         

    if (terminal == solution.CurrentOptionTerminal) {

        if (symbolcanvas && symbol == symbolcanvas.CurrentSymbol)   { 
            setField('optiontabprice', symbol.Bid + "  /  " + symbol.Ask, false, true);
            setField('optiontabchange', +symbol.Quote.regularMarketChange.toFixed(2), true, true);
            if (+symbol.Quote.regularMarketChangePercent.toFixed(2) >= 0)                
                setfield('optiontabchangepercent', "+" + +symbol.Quote.regularMarketChangePercent.toFixed(2)  + "%", theme_bull, false, true);
            else
                setfield('optiontabchangepercent', "" + +symbol.Quote.regularMarketChangePercent.toFixed(2)  + "%", theme_bear, false, true);
        }
    }
}    
