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
