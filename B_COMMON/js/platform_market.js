//----------------------------------------------------   MARKET PANEL    ------------------------------------------------   
var SYDNEY_CLOSE    = false;
var TOKYO_CLOSE     = false;
var LONDON_CLOSE    = false;
var NY_CLOSE        = false;
var NYSTOCKMARKET   = '';

var markereditor_market = null;
var market_intervalid   = null;


var MarketClosingDays = [
    {name: "Martin Luther King, Jr. Day",   date: 'Monday Jan. 17, 2022'},  // third monday of january
    {name: "President's Day	Monday",        date: 'Feb. 21, 2022'},
    {name: "Good Friday	Friday",            date: 'April 15, 2022 (bond markets close at 12p EST)'},
    {name: "Memorial Day",                  date: 'Monday, May 30, 2022'},  // last monday of may
    {name: "Juneteenth (observed)",         date: 'Monday, June 20, 2022'},
    {name: "Independence Day",              date: 'Monday, July 4, 2022'},
    {name: "Labor Day",                     date: 'Monday, Sept. 5, 2022'}, // first monday of septembre
    {name: "Thanksgiving Day",              date: 'Thursday, Nov. 24, 2022'}, // fourth thursday of novembre
    {name: "Black Friday",                  date: 'Friday, Nov. 25, 2022 (stock market closes at 2p EST)'},
    {name: "Christmas (observed)",          date: 'Monday, Dec. 26, 2022'}
]

$(document).ready(function(){
    $(document).on('click', function(event){

        let panel = $(event.target).closest('#marketpanel')        
        if (panel.length != 0) {
            return;
        }
        tools_panel_remove();    
    });
})

function market_init () {
 //   MarketPanel('marketpanel', 'sb_row');  

    market_intervalid = setInterval("market_time()", 1);       
    markereditor_market    = new MarkerEditor ('market');          
}

function market_end () {
    clearInterval(market_intervalid);   
}

//----------------------------------------------------   TOOLS PANEL    ------------------------------------------------   

function onclick_toolspanelheaderpin (elt, event) {
    let $marketmain = $('#marketmain');   

    if ($(elt).hasClass ('checked')) {
        $marketmain.removeClass ('pinned')
        $marketmain.css ({'transition':'none'});
        tools_panel_hide();
        
    } else {
        $marketmain.addClass ('pinned')
    }
    sb.resize(sb.interface);              
}

function onclick_markettogglepanel (elt, event) {

    
    let show = !$('#marketmain').hasClass('toggled');   
    if (show == 1) {
        tools_panel_select();    
    }    
    if (show == 0) {
        tools_panel_hide();            
    }
}

function tools_panel_select () {
    let marketmain = $('#marketmain');   
    let toresize     = marketmain.hasClass ('pinned');    
    
    marketmain.addClass('toggled')
  
    if (toresize) {
        sb.resize(sb.interface);        
    }
}

function tools_panel_hide () {
    let marketmain = $('#marketmain');   
    let toresize     = marketmain.hasClass ('pinned');    
    
    marketmain.css ({'transition':''});

    marketmain.removeClass('toggled')

    if (toresize) {
        sb.resize(sb.interface);        
    }
}

function tools_panel_remove () {
    let marketmain = $('#marketmain');   
    if (marketmain.hasClass ('pinned') || !marketmain.hasClass('toggled'))  {
        return;
    }    
    $('#marketpanel .box-btn-slide').click ()
}

//----------------------------------------------------   TICKER PANEL    ------------------------------------------------   

function onclick_ticker_nextprev(elt, event) {
    event.preventDefault(); 
    console.log ('aaaaaaaaaaaaaaaaaaaaaaaa')
    let tickerpanel = document.getElementById("tickerpanel");
    if ($(elt).hasClass ('next')) {
        tickerpanel.scrollBy({
            left: 300,
            behavior: "smooth",
          });      
    }
    else {
        tickerpanel.scrollBy({
            left: -300,
            behavior: "smooth",
          });      

    }
}

function tickerbuttons_panel () {
    var content = '';    
    content +=
    '   <a class="prev sb_right" onclick= "onclick_ticker_nextprev(this, event)" role="button" data-slide="prev">' +
    '      <span class="carousel-control-prev-icon" aria-hidden="true"></span></a>' +
    '   <a class="next" onclick= "onclick_ticker_nextprev(this, event)" role="button" data-slide="next">' +
    '       <span class="carousel-control-next-icon" aria-hidden="true"></span></a>';
    return content;
}

function onclick_tickertogglepanel (elt, event) {
    
    Selection_clear();    

    let show = $('#market_snapshot').css('display');   
    if (show == 'flex') {
        $('#market_snapshot').css('display', 'none')        
    } else  
    if (show == 'none') {
        $('#market_snapshot').css('display', 'flex')        
    }
    sb.resize(sb.interface);         
}

function onclick_markettickerrow (id, symbolname) {
    if (id == "mainmarket") {
        let ui  = solution.get('ui')     
        let platform =  ui.sb.get(main, 'pname', 'option');
        if (platform.length == 0) {
            solution.add_module('option');     
        } 

        ui.platform_select(OPTION_PLATFORM_PNAME)   

        var terminal = solution.CurrentOptionTerminal;
        if (!terminal) {
            selector_select('option_selectterminal', 'Yahoo Finance');
        }

        var PG = terminal.PG;
        var symbol = PG.GetSymbolFromName(symbolname);
        
        Option_SelectSymbol (symbol);
        return;
    }
    if (id == "news_forexbox") {
         var symbolname =  $('#' + id + i + '_1').html ();
        
        if (symbolname == "") return;
    
        OnSearchMainSymbol (symbolname);
    }
}

function market_updatesymbols () {
    let content = "";

    let tr = $('#option_currencytable tbody tr');
    if (tr.length == 0) {
        return;
    }

    let firstindex = 0;
    for (var i = 0; i < tr.length; i++) {
        let symbolindex = tr[i].id.replace("option_currencytable_", ""); 
        if (i == 0) {
            firstindex = symbolindex;
        }
        let tickerrow = $('#tickerrow_' + symbolindex);
        content += tickerrow.prop('outerHTML')
    }    
    
    $("#tickerpanel").html (content);
    $('#tickerrow_' + firstindex)[0].scrollIntoView()
}


function market_selectsymbol(termminal, symbol) {
}

function market_addsymbol (terminal, symbol) {
    
    var content = '';
    var i = terminal.PG.Symbols.length - 1;

    let quotetype = symbol.Quote.quoteType;
    content += '<a id = "tickerrow_' + i + '" class="' + quotetype + '" onclick="onclick_markettickerrow(\'mainmarket\', \'' +  symbol.Name + '\')">' + 
                    '<span class="mainsymbol">' + symbol.PName + '</span>' +
                    '<span id="mainsymbollast' +  i + '" class="mainsymbollast"></span>' + 
                    '<span id="mainsymbolchange' +  i + '" class="mainsymbolchange"></span>' + 
                '</a>';

    $("#tickerpanel").append (content);
}

function market_updatesymbol (terminal, symbol, schange, percentchange, color) {
    var index = terminal.PG.GetSymbolIndexFromName(symbol.Name)
    if (index < 0) return;

    if ($('#mainsymbollast'   + index).length == 0) {
        market_addsymbol (terminal, symbol)
    }

    $('#mainsymbollast'   + index).html (symbol.Last + '   ');
    $('#mainsymbolchange' + index).html (schange + ' ' + percentchange);
    $('#mainsymbolchange' + index).css('color', color); 
}


function forexmarket_panel(id, classnames) {
    var content = 
    '   <div class="forexcontent">' +
    '       <div class="sb_formgroup">' +
    '           <label class="marketlabel">London</label>' +
    '           <input id ="LONDON" class="form-control marketcontent" readonly value=""/>' +
    '       </div>' +   
    '       <div class="sb_formgroup">' +
    '           <label class="marketlabel">New York</label>' +
    '           <input id ="NY" class="form-control marketcontent" readonly value=""/>' +
    '       </div>' +         
    '   </div>' +  
    '   <div class="forexcontent">' +
    '       <div class="sb_formgroup">' +
    '           <label class="marketlabel">Sydney</label>' +
    '           <input id ="SYDNEY" class="form-control marketcontent" readonly value=""/>' +
    '       </div>' +     
    '       <div class="sb_formgroup">' +
    '           <label class="marketlabel">Tokyo</label>' +
    '           <input id ="TOKYO" class="form-control marketcontent" readonly value=""/>' +
    '       </div>' +         
    '   </div>';        
    return content;
}

function market_closed () {
    return (SYDNEY_CLOSE && TOKYO_CLOSE && LONDON_CLOSE && NY_CLOSE); 
}

function market_time() {
    var d = new Date();
    var hour    = d.getUTCHours(),
        minutes = d.getUTCMinutes(),
        seconds = d.getUTCSeconds(),
        day     = d.getUTCDay(),
        month   = d.getUTCMonth();
        year    = d.getUTCFullYear() ;
        date    = d.getUTCDate();
        var szTime = d.format('HH:mm:ss');

    let sunday      = 0;
    let monday      = 1;
    let saturday    = 6;
    let friday      = 5;
    let january     = 0;
    let march       = 2;
    let june        = 5;    
    let july        = 6;
    let septembre   = 8;
    let novembre    = 10;
    let december    = 11;

    var sound = true;
    var s = "Closed";

    let CloseMarketColor = theme_sell;
    let OpenMarketColor = theme_buy;
    let MarketBkColor = '';

    let Color = CloseMarketColor;
    let BColor = MarketBkColor;

    SYDNEY_CLOSE    = false;
    TOKYO_CLOSE     = false;
    LONDON_CLOSE    = false;
    NY_CLOSE        = false;

    let usopening = 'U.S. markets are opened ';  // 13h30 - 20h
    let usclosing =  'U.S. markets are closed ';
    let uslabeltime;

//DJ    
/*
London Stock Exchange (LSE) - opens at 07:00 GMT and closes at 15:30 GMT.
New York Stock Exchange (NYSE), NASDAQ - opens at 13:30 GMT and closes at 20:00 GMT.
Japanese Stock Exchange (only on CFD) - opens at 00:00 GMT and closes at 06:00 GMT with a break between 2:30 and 3:30.
Sydney Stock Exchange (only on CFD) - opens at 23:00 GMT and closes at 05:00 GMT. 
*/

    if (day == saturday || day == sunday) {
            NYSTOCKMARKET = 'closed';
            uslabeltime = usclosing;
            setfield('USMARKETS', uslabeltime, Color, BColor);            
    } else
    if (day == monday && month == septembre && date <= 7) {
        NYSTOCKMARKET = 'closed';
        uslabeltime = usclosing + 'Martin Luther King, Jr. Day';
        setfield('USMARKETS', uslabeltime, Color, BColor);            
    }    
    else
    if (month == july && date == 4) {
        NYSTOCKMARKET = 'closed';
        uslabeltime = usclosing + 'Independence Day';
        setfield('USMARKETS', uslabeltime, Color, BColor);            
    }      
    else
    if (month == december && date == 26) {
        NYSTOCKMARKET = 'closed';
        uslabeltime = usclosing + 'Christmas';
        setfield('USMARKETS', uslabeltime, Color, BColor);            
    }             
    else {
        var opentime, 
            closetime;
        if (((month == march && date >= 13)  || month > march) && (month < novembre || (month == novembre && date < 6))) { //summer time
            openhour = 13;
            closehour = 20;
        } else {
            openhour = 14;
            closehour = 21;
        }

        if (((hour == openhour && minutes >= 30) || hour >= openhour+1)  && hour < closehour) { 
            NYSTOCKMARKET = 'opened';
            Color = theme_buy;            
            uslabeltime = usopening;
            var nowtime = Date.UTC(year, month, day, hour, minutes, seconds);
            var closetime = Date.UTC(year, month, day, closehour);
            var timetoclose = secondsToDhms ((closetime - nowtime)/1000);         
            setfield('USMARKETS', 'U.S. markets close in ' + timetoclose, Color, BColor);   
        }
        else {
            NYSTOCKMARKET = 'closed';
            uslabeltime = usclosing; 
            if (hour >= 7 && ((hour == openhour && minutes <= 30) || hour < openhour)){
                var nowtime = Date.UTC(year, month, day, hour, minutes, seconds);
                var opentime = Date.UTC(year, month, day, openhour, 30);
                var timetoopen = secondsToDhms ((opentime - nowtime)/1000);         
                setfield('USMARKETS', 'U.S. markets open in ' + timetoopen, Color, BColor);               
            }
            else {
                setfield('USMARKETS', uslabeltime, Color, BColor);           
            }
        }    
    }        

    
//FOREX    
    if ((day == sunday && (hour < 21 || (hour == 21 && minutes < 55))) || day == saturday) {
        setfield('SYDNEY', s, Color, BColor);
        setfield('TOKYO', s, Color, BColor);
        setfield('LONDON', s, Color, BColor);
        setfield('NY', s, Color, BColor);
        SYDNEY_CLOSE    = TOKYO_CLOSE = LONDON_CLOSE = NY_CLOSE = true;
        return;
    }
    if ((day != friday && hour >= 22) || hour < 7) {
        Color = OpenMarketColor;
        if (hour == 6 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = CloseMarketColor;
            if (minutes == 55 && seconds == 0) DisplayOperation("Sydney Close in 5 minutes", sound);
        } else {
            s = "Opened";
            BColor = MarketBkColor;
        }
        setfield('SYDNEY', s, Color, BColor);
    } else {
        SYDNEY_CLOSE = true;
        Color = CloseMarketColor;
        if (day != friday && hour == 21 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = theme_buy;
            if (minutes == 55 && seconds == 0) DisplayOperation("Sydney Open in 5 minutes", sound);
        } else {
            s = "Closed";
            BColor = MarketBkColor;
        }
        setfield('SYDNEY', s, Color, BColor);
    }
    if (hour >= 0 && hour < 9) {
        Color = OpenMarketColor;
        if (hour == 8 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = CloseMarketColor;
            if (minutes == 55 && seconds == 0) DisplayOperation("Tokyo Close in 5 minutes", sound);
        } else {
            s = "Opened";
            BColor = MarketBkColor;
        }
        setfield('TOKYO', s, Color, BColor);
    } else {
        TOKYO_CLOSE = true;
        Color = CloseMarketColor;
        if (day != friday && hour == 23 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = theme_buy;
            if (minutes == 55 && seconds == 0) DisplayOperation("Tokyo Open in 5 minutes", sound);
        } else {
            s = "Closed";
            BColor = MarketBkColor;
        }
        setfield('TOKYO', s, Color, BColor);
    }
    if (hour >= 8 && hour < 17) {
        Color = OpenMarketColor;
        if (hour == 16 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = CloseMarketColor;
            if (minutes == 55 && seconds == 0) DisplayOperation("London Close in 5 minutes", sound);
        } else {
            s = "Opened";
            BColor = MarketBkColor;
        }
        setfield('LONDON', s, Color, BColor);
    } else {
        LONDON_CLOSE = true;
        Color = CloseMarketColor;
        if (hour == 7 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = theme_buy;
            if (minutes == 55 && seconds == 0) DisplayOperation("London Open in 5 minutes", sound);
        } else {
            s = "Closed";
            BColor = MarketBkColor;
        }
        setfield('LONDON', s, Color, BColor);
    }
    if (hour >= 13 && hour < 22) {
        Color = OpenMarketColor;
        if (day != sunday && hour == 21 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = CloseMarketColor;
            if (minutes == 55 && seconds == 0) DisplayOperation("New York close in 5 minutes", sound);
        } else {
            s = "Opened";
            BColor = MarketBkColor;
        }
        setfield('NY', s, Color, BColor);
    } else {
        NY_CLOSE = true;
        Color = CloseMarketColor;
        if (hour == 12 && minutes >= 55) {
            s = szTime;
            BColor = 'black';
            Color = theme_buy;
            if (minutes == 55 && seconds == 0) DisplayOperation("New York Open in 5 minutes", sound);
        } else {
            s = "Closed";
            BColor = MarketBkColor;
        }
        setfield('NY', s, Color, BColor);
    }
}