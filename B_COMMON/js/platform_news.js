//---------------------------------------------------- NEWS    ------------------------------------------------   
var forexnews;
var calendarnews;
var nextcalendarnews;

const no_news_label    = 'No More Important News This Week';

const calendarnewslink = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';         //forexfactory        
const forexnewslink    = 'https://widgets.myfxbook.com/widgets/news.html';                 //myfxbook

const BlinkNewsTime   = 3600000;          //half hour
var Interval_newsblink          = 0;
var NewsCount                   = 0;

//-------------------------------------------------------CURRENCIES----------------------------------------------------------------------------------------

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

var ForexString  = ReturnMatchStringFromArray (ForexCurrencies);
var MarketString = ReturnMatchStringFromArray (MarketCurrencies);


function GetCurrencyPair (symbolname) {
    var fromname = symbolname.substring(0, 3);
    var toname = symbolname.substring(3);
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


function news_init () {
    forexnews = new news (
        {
            url: forexnewslink,
            interval: 30000,                //0.5 minutes or 30 sec	
            table: news_forextable,
            readfunction:   ReadForexNews,
            resultfunction: ResultReadForexNews,
            updatefunction: ForexNews_Update,
        }
    )
    
    calendarnews = new news (
        {
            url: calendarnewslink,
            interval: 0,                //0.5 minutes or 30 sec	
            table: news_calendartable,
            readfunction:   ReadCalendarNews,
            resultfunction: ResultReadCalendarNews,
            updatefunction: CalendarNews_Update,
        }
    )    
    nextcalendarnews = new news (
        {
            url: calendarnewslink,
            interval: 30000,                //0.5 minutes or 30 sec	
            table: news_nextcalendartable,
            readfunction:   ReadNextCalendarNews,
            resultfunction: ResultReadNextCalendarNews,
            updatefunction: NextCalendarNews_Update,
        }
    )        
    solution.calendarnews = calendarnews;
    solution.forexnews = forexnews;
    solution.nextcalendarnews = nextcalendarnews;        
    /*
    CalendarNews_Read()  
    ForexNews_Read();    

    setInterval(NextNewsPanel_Update, 300000, '#nextnewspanel', NextNewsTable); //5 minutes 300000	    
    setInterval(ForexNews_Read, 30000, ); //0.5 minutes or 30 sec	    	
    */
}

function news_end () {
    clearInterval(solution.calendarnews.intervalid);
    clearInterval(solution.forexnews.intervalid);
    clearInterval(solution.nextcalendarnews.intervalid);        
}


const news_default_options = {
    url: '',
    interval: 0,     //0	   
    readfunction:  function (result) {console.log('news read function')},     
    resultfunction:  function (result) {console.log(result)},    
    updatefunction:  function () {console.log('news update function')},
}

class news {
    constructor (options) {
        this.options    = defined(options) ? {...news_default_options, ...options} : news_default_options;
        this.readfunction   = this.options.readfunction;   
        this.resultfunction = this.options.resultfunction;
        this.updatefunction = this.options.updatefunction;
        this.table          = this.options.table;
        this.url            = this.options.url;      
        this.interval       = this.options.interval;
        this.intervalid     = null;
        this.newsarray = [];               
        this.init () 
    }   
    
    init () {
        this.readfunction (this);
        if (this.interval != 0) {
            this.intervalid = setInterval(this.readfunction, this.interval, this); //0.5 minutes or 30 sec	   
        }
    }
    result (content, par) {

        let news = !this ? par[0] : this;

        news.resultfunction (content)
        news.update();
    } 
    update () {
        this.updatefunction ()        
    }
}

//---------------------------------------------------------------- NEWS FOREX ------------------------------------------------------------------

function onclick_forexnewsrow(elt) {
    var rows = elt.id.split ('_');
    var rowindex = rows[rows.length -1];
}

function FxNewsReceived (records, href) {
    for (var i = 0; i < records.length; i++) {
        if (records[i].href == href)
            return i;
    }    
    return -1;
}

function ReturnPNameFromNameinArray (array,name) {
    for (var i = 0; i < array.length;  i++) {
        if (array[i].Name.toLowerCase() == name.toLowerCase())  return array[i].PName
    }
    return '';
}

function ReadForexNews (news) {
    url_submit ('GET', solution.site.address  + '/php/load_url.php', {url: news.url}, true, news.result, [news])  
}

function ResultReadForexNews(response) {
    let news        = this;
    let arr         = response;
    let doc         = new DOMParser().parseFromString(arr, "text/html");
    let table       = doc.getElementById('newsWidgetTable')
    if (!table) {
        return;
    }
    let lpostedOnes = table.children;
    let insertpos   = 0;
    
   // console.log ('read forex news')
    for (var i = lpostedOnes.length - 1; i >= 0 ; i--) {

        let lposted  = lpostedOnes[i];
        let id       = lposted.id;
        let href     = $(doc.querySelector('#' + id + ' a')).attr('href');
        let time     = $(doc.querySelector('#' + id + ' span')).attr('time');
        let newsline = $(doc.querySelector('#' + id + ' a')).html();
        let date     = new Date();
        let fnews    = '<a href="' + href + '" target="_blank">' + newsline + '</a>';

        date.setTime(time);
        if (FxNewsReceived (news.newsarray, href) != -1) continue;
        news.newsarray.unshift ({id: news.newsarray.length, fxnews: lpostedOnes[i], news: fnews, time: date, href : href});

    }
}

function ForexNews_Update () {
    let news = this;
    let table = news.table;
    sb.table_clear (table);

    var forexpatterns  = new RegExp(ForexString, "g")
    var marketpatterns = new RegExp(MarketString, "gi")

    var currency;
    var link;
    for (var i = 0; i < news.newsarray.length; i++) {
        link = '';
        var forexmatchresult  =  news.newsarray[i].news.match (forexpatterns);
        var marketmatchresult =  news.newsarray[i].news.match (marketpatterns);
        currency = '';

        if (!forexmatchresult && !marketmatchresult)  {
        }
        else {
            if (!forexmatchresult)  {   // only market result
                currency = ReturnPNameFromNameinArray (MarketCurrencies, marketmatchresult[0]);
            }
            else
            if (!marketmatchresult) {   // only forex result
                 if (forexmatchresult.length >= 2) {
                    currency = forexmatchresult[0] + forexmatchresult[1] + '=X';
                }                
            }
            else {                      // market and forex result                                  
                if (forexmatchresult.length >= 2) {
                    currency = forexmatchresult[0] + forexmatchresult[1] + '=X';
                }
                else {
                    currency = ReturnPNameFromNameinArray (MarketCurrencies, marketmatchresult[0]);
                }
                
            }
            link = '<div class="mg-item-category"><a class="newsup-categories category-color-2" title="' + currency + '" onclick="OnClickNewsCurrency (\'' + currency +'\');" alt="View all posts in Features"> <i class="fas fa-chart-line"></i></a></div>';
            
        }
        table.rows.push ([news.newsarray[i].news , link]); 
    }
    let content = sb.render (table);
    $('#news_forexbox .sb_boxbody').html (content); 
}

//---------------------------------------------------------------- NEWS CALENDAR ------------------------------------------------------------------

function NewsLine (day, time, date, gmt, currency, event, importance, actual, forecast, previous, gettime) {
    this.Day = day;
    this.Time = time;
    this.Date = date;
    this.GMT = gmt;
    this.Currency = currency;
    this.Event = event;
    this.Importance = importance;
    this.Actual = actual;
    this.Forecast = forecast;
    this.Previous = previous;
    this.gettime = gettime;
}


function UpdateNewsStyle (panelelt, table) {
    let theme_news_text_color           = '';
    let theme_news_bg_color             = '';
    let theme_news_high_text_color      = '#ff5858';  // danger
    let theme_news_high_bg_color        = '#433337';
    let theme_news_high_border_color   =  '#5e4037';
    let theme_news_medium_text_color    = '#ffb684'; // warning
    let theme_news_medium_bg_color      = '';
    let theme_news_low_text_color       = '';
    let theme_news_low_bg_color         = '';   



    for (var i = 0; i < table.rows.length; i++) {

        let newsline = table.rows[i];

        let  newstextcolor = theme_news_text_color;
        let  newsbkgcolor = theme_news_bg_color;

        let importance = sb.table_getcellcontent (table, i, 'Importance');
        switch (importance) {
            case 'High':
                newsbkgcolor = theme_news_high_bg_color;
                newstextcolor = theme_news_high_text_color;
                break;
            case 'Medium':
                newsbkgcolor = theme_news_medium_bg_color;
                newstextcolor = theme_news_medium_text_color;
                break;
            case 'Low':
                newsbkgcolor = theme_news_low_bg_color;
                newstextcolor = theme_news_low_text_color;
                break;
            default:
                break;
        }
        $(panelelt + ' #' + table.id + '_' + i).css('color', newstextcolor);
        $(panelelt + ' #' + table.id + '_' + i).css('background', newsbkgcolor);   
        if (importance == 'High') {
            $(panelelt + ' #' + table.id + '_' + i).css('border', '1px solid ' + theme_news_high_border_color);
          };         
    }    
}

function ReadCalendarNews (news) {
    url_submit ('GET', solution.site.address  + '/php/load_url.php', {url: news.url}, false, news.result, [news])  
}


function ResultReadCalendarNews (response) {
    let news = this;
    var date = new Date();
    var nowtime = date.getTime() + solution.DifferenceHoursTime;
    var notset = 1;
    var items = jQuery(response).find("event");

       
    for (var i = 0; i < items.length; i++) {

        var ret = [];
        ret[0] = jQuery(items[i]).find('title').html();
        ret[0] = ret[0].replace('&lt;![CDATA[', '');
        ret[0] = ret[0].replace('<!--[CDATA[', '');
        ret[0] = ret[0].replace(']]&gt;', '');
        ret[0] = ret[0].replace(']]-->', '');
        ret[6] = jQuery(items[i]).find('country').html();
        ret[6] = ret[6].replace('&lt;![CDATA[', '');
        ret[6] = ret[6].replace('<!--[CDATA[', '');
        ret[6] = ret[6].replace(']]&gt;', '');
        ret[6] = ret[6].replace(']]-->', '');
        ret[1] = jQuery(items[i]).find('date').html();
        ret[1] = ret[1].replace('&lt;![CDATA[', '');
        ret[1] = ret[1].replace('<!--[CDATA[', '');
        ret[1] = ret[1].replace(']]&gt;', '');
        ret[1] = ret[1].replace(']]-->', '');
        ret[2] = jQuery(items[i]).find('time').html();
        ret[2] = ret[2].replace('&lt;![CDATA[', '');
        ret[2] = ret[2].replace('<!--[CDATA[', '');
        ret[2] = ret[2].replace(']]&gt;', '');
        ret[2] = ret[2].replace(']]-->', '');
        ret[3] = jQuery(items[i]).find('impact').html();
        ret[3] = ret[3].replace('&lt;![CDATA[', '');
        ret[3] = ret[3].replace('<!--[CDATA[', '');
        ret[3] = ret[3].replace(']]&gt;', '');
        ret[3] = ret[3].replace(']]-->', '');
        ret[4] = jQuery(items[i]).find('forecast').html();
        ret[4] = ret[4].replace('&lt;![CDATA[', '');
        ret[4] = ret[4].replace('<!--[CDATA[', '');
        ret[4] = ret[4].replace(']]&gt;', '');
        ret[4] = ret[4].replace(']]-->', '');
        ret[5] = jQuery(items[i]).find('previous').html();
        ret[5] = ret[5].replace('&lt;![CDATA[', '');
        ret[5] = ret[5].replace('<!--[CDATA[', '');
        ret[5] = ret[5].replace(']]&gt;', '');
        ret[5] = ret[5].replace(']]-->', '');
        var strDate = ret[1];
        var datasplit = strDate.split('-');
        strDate = datasplit[2] + "-" + datasplit[0] + "-" + datasplit[1];
        var myDate = new Date(strDate);
        var final_date = myDate.getDay();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var day     = weekday[myDate.getDay()];
        var strYear = strDate.substring(0, 4);
        var strMonth = strDate.substring(5, 7);
        var strDay = strDate.substring(8, 10);
        var nMonth = parseInt(strMonth) - 1;
        var strTime = ret[2];
        var nTimeColonPos = strTime.search(":");
        var sevent = ret[0];
        sevent = sevent.replace('&', '');
        var strHour = strTime.substring(0, nTimeColonPos);
        var strMinute = strTime.substring(nTimeColonPos + 1, nTimeColonPos + 3);
        var strAM_PM = strTime.substring(nTimeColonPos + 3, strTime.length);
        var nHour24 = parseInt(strHour);

        if ((strAM_PM == "pm" || strAM_PM == "PM") && nHour24 != 12) nHour24 += 12;
        if ((strAM_PM == "am" || strAM_PM == "AM") && nHour24 == 12) nHour24 = 0;
        strHour = nHour24.toString();
        if (strHour.length == 1) strHour = "0" + strHour;
        ret[2] = strHour + ":" + strMinute;
        let reserv = new Date(strYear, nMonth.toString(), strDay, strHour, strMinute);
        let reservtime = reserv.getTime();
      

        news.newsarray.push(new NewsLine(day, ret[2], ret[1], ret[2], ret[6], sevent, ret[3], ret[4], ret[4], ret[5], reservtime));
    }
    
//    NextNewsPanel_Update('#nextnewspanel', NextNewsTable);
//    $('#newspanel').html ($('#news_calendarbox .sb_boxbody').html());
}

function CalendarNews_Update () {
    let news = this;

    CalendarNews_Save(news);

    let table = news.table;
    
    sb.table_clear (table);

    for (var i = 0; i < news.newsarray.length; i++) {
        newsline = news.newsarray[i];
        table.rows.push ([newsline.Day, newsline.Date, newsline.GMT, newsline.Currency, newsline.Event,  newsline.Importance, newsline.Forecast, newsline.Previous]);
    }

    let content = sb.render (table);
    $('#news_calendarbox .sb_boxbody').html (content); 
    UpdateNewsStyle('#news_calendarbox .sb_boxbody', news.table)    
}

function CalendarNews_Save (news) {
    var content = "";
    for (var i = 0; i < news.newsarray.length; i++) {
        newsline = news.newsarray[i];

        content += 
            newsline.Date + ',' + 
            newsline.GMT + ',' + 
            newsline.Currency + ',' + 
            newsline.Event + ',' + 
            newsline.Importance + ',' + 
            newsline.Actual + ',' + 
            newsline.Forecast + ',' + 
            newsline.Previous + '\n';
    }        
    SubmitRequest(content, '/php/save_news.php');
    return content;
}

//---------------------------------------------------------------- NEXT CALENDAR ------------------------------------------------------------------

function ReadNextCalendarNews (news) {

    news.newsarray = [];        
    let nowtime = new Date().getTime() + solution.DifferenceHoursTime;

    
    for (var i = 0; i < calendarnews.newsarray.length; i++) {
        let newsline = calendarnews.newsarray[i];
        let newstime = newsline.gettime
 
        if (newstime >= nowtime && newsline.Importance != 'Low') {
            news.newsarray.push (newsline)
        }
    }
    news.result();
}


function ResultReadNextCalendarNews(content) {
    let news = this;
    let table = news.table;

    let date = new Date();
    let nowtime = date.getTime() + solution.DifferenceHoursTime;
    let notset = 1;

    let NextNewsId = -1;
    let NextNewsTime = 0;
 
    $('#newslink').html('No More Important News This Week');
    
    sb.table_clear (table);

    for (var i = 0; i < news.newsarray.length; i++) {

        let newsline = news.newsarray[i];
        let newstime = newsline.gettime

        if (newsline.Importance == 'High') {
            if (notset) {
                $('#newslink').html(newsline.Currency + ' ' + newsline.Event + ' --- ' + newsline.Day + ' ' + newsline.Date + ' ' + newsline.GMT + ' GMT');
                notset = 0;
                if ((newstime - nowtime) <= BlinkNewsTime) { // 1 HOUR
                    NewsLink_Update (newsline.Event, newstime);
                } else {
                    clearInterval(Interval_newsblink);
                }

            }
        }
        
        table.rows.push ([newsline.Day, newsline.Date, newsline.GMT, newsline.Currency, newsline.Event,  newsline.Importance, newsline.Forecast, newsline.Previous]);                      
    }
}

function NextCalendarNews_Update () {
    let news = this;
    if (news.newsarray.length == 0) {
        $('#news_nextcalendarbox .sb_boxbody').html (sb.render(ReturnWarningALert(no_news_label)));
        return; 
    }
    let content = sb.render (news.table);
    $('#news_nextcalendarbox .sb_boxbody').html (content); 
    UpdateNewsStyle('#news_nextcalendarbox .sb_boxbody', news.table)    
}


//------------------------------------------------------------ NEWS LINK  ----------------------------------------------------------

function onclick_newsLink () {
    onclick_rightsidebarmenu('rightsidebar_news', 1)    
    sb.box_toggle ('news_nextcalendarbox', 1);     
}


function BlinkNewsLink (elt, line, newstime) {
    var blinkcolor = theme_sell;
    var blinkbg = 'red';

    var date = new Date();    
    var nowtime = date.getTime() + solution.DifferenceHoursTime;    


    var timetonews = secondsToDhms ((newstime - nowtime)/1000);
    elt.children().html (line + ' in ' + timetonews);

    if (NewsCount % 2) {
        elt.children().attr("style", "color: '' !important; background-color:  '' !important;");        
    } else {
        elt.children().attr("style", "color: var(--theme-bar-color) !important;); // background-color: var(--theme-button-bg-color) !important;");        
    }
    NewsCount++;
}


function NewsLink_Update (line, newstime) {
    id = 'market_newsgroup';
    let elt = $('#' + id);    

    if (elt.length == 0) {
        $('body').append(sb.render(headerbar_news));
    }
    clearInterval(Interval_newsblink);
    NewsCount = 0;
    elt.children().html(line);
    BlinkNewsLink(elt, line, newstime);
    Interval_newsblink = setInterval(BlinkNewsLink, 500, elt, line, newstime);
}
