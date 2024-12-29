//------------------------------------------------------------------------------------------------------------------------------------------------------------


function interface_RemoveEntity (father, fieldname, entity) {
    if (!defined(field)) {
        return NULL;
    }

    var classarray = father[fieldname];

    for (var i = 0; i <  classarray.length; i++) {
        if (classarray[i] == entity) {
            interface_ArrayRemove (classarray, entity);
            return true;
        }
    }
    return NULL;
}

function interface_GetEntity (father, fieldname, attribute, name) {   // father = 'netprog_mamager || netprog_manager.DialogClasses.MessageClasses

    if (!defined(father)) {
        return NULL;
    }
    
    if (!defined(fieldname)) {
        return NULL;
    }

    var classarray = father[fieldname];
    
    for (var i = 0; i <  classarray.length; i++) {
        if (classarray[i][attribute] == name)
            return classarray[i];
    }
    return NULL;
}

function interface_GetEntityMenu (father, fieldname, attribute, name){
    var menu = [];
    var classarray = father[fieldname];
    for (var i = 0; i <  classarray.length; i++) {
        menu.push ({id: i, text: classarray[i][attribute]})
    }
    return menu;    
}

//---------------------------------------------------------------- LIST ---------------------------------------------------------
function interface_ArrayRemove (array, elt) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === elt) {
            array.splice(i, 1);
        }
    }
}

function interface_ArrayInsert (array, elt) {
    if (defined(array)) {
        array.push (elt);
    } else {
        array= [elt];
    }
}

function interface_ArrayLength (array) {
    if (defined (array)) return array.length;
    return 0;
}


function interface_ArrayMove(array, from, to) {
    let numberOfDeletedElm = 1;
  
    const elm = array.splice(from, numberOfDeletedElm)[0];
  
    numberOfDeletedElm = 0;
  
    array.splice(to, numberOfDeletedElm, elm);
  }


// ---------------------------------------------------------------HEXA ASCII -------------------------------------------------------

function hexa_to_ascii (data) {                                                                                                         // input hexa string -- ouput ascii string
    var str = '';
    for (var i = 0; i < data.length; i += 2)
        str += String.fromCharCode(parseInt(data.substr(i, 2), 16));
    return str;
}

function ascii_to_hexa (data, datasize) {
	let hexa_array = [];
	for (var i = 0; i < datasize; i++) {
		let  hex = "00" + data.charCodeAt(i).toString(16);
        hex  = hex.substring(hex.length - 2).toUpperCase();
		hexa_array.push(hex);
	 }
	return hexa_array.join('');
}

// shift more than 32 bits , input array of char , output big int
binary_to_hexa = (BinaryStr, nbrbytes) => parseInt(BinaryStr , 2).toString(16).padStart(nbrbytes*2, '0').toUpperCase()                   // input binary string -- output hexa string
array_to_int = Uint8Array => [...Uint8Array].reverse().reduce((prev, curr, index) => BigInt(prev) | (BigInt(curr) << BigInt(index * 8))) // input array of hexa -- ouput int with shift
hexa_to_array = HexaString => HexaString.split(/(..)/g).filter(s => s).map(elt => parseInt(elt, 16))                                     // input hexa string -- ouput array of hexa
hexa_to_int  = HexaString => array_to_int(hexa_to_array(HexaString))                                                                     // input hexa string -- ouput int with shift
hexa_to_bin  = HexaString => parseInt(HexaString, 16).toString(2).padStart(8, "0")                                                       // input hexa string -- ouput 8 bits

//---------------------------------------------------------------- COOKIES ---------------------------------------------------------



function RegisterWithCookie () {
    setCookie("Registering", "true", 1);    
    DrawLoginPanel(ACTION_REGISTER);  
}

//---------------------------------------------------------------- GENERAL SUBMIT ---------------------------------------------------------
  
function url_stringifypar (type, parstruct){
    var content = '';
    var keys = Object.keys(parstruct);

    for (var i= 0; i < keys.length; i++) {
        content += (i == 0 && type == 'GET' ? '?' : '&') + keys[i] + '=' +  encodeURIComponent(parstruct[ keys[i]]);
    }
    return content;
}

function url_submit (type, url, par /*object {}*/, async, callback, values /* array []*/, aftercallback, aftervalues)  {           //depends engine
    var callbackreturn = null;    //case synchrone
    if (!async) async = false;
    
    var xhttp = new XMLHttpRequest();
    var params = (par != null ?  url_stringifypar(type, par) : '');

    if (type == 'POST') {
        xhttp.open(type, url, async);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');        
    } else {
        xhttp.open(type, url + params, async);
    }
   
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (callback) { 
                callbackreturn = callback (this.responseText, values);
            } else {
                callbackreturn = this.responseText;
            }
            if (aftercallback)  aftercallback (this.responseText, aftervalues);    
                  
        }
        if (this.readyState == 4 && this.status == 404) {
            console.log ('Erreur in Reading Request');
        }            
    };
    try {
        xhttp.send((type == 'POST' ? params : null));
    } catch (error) {
        console.log (error)
    }
    return callbackreturn;    
}    

//---------------------------------------------------------------- LOAD SCRIPT FILE DYNAMICALLY ---------------------------------------------------------

function get_contents(urlfile){
    var xhr = new XMLHttpRequest();
    xhr.open('get', urlfile, false);
    xhr.send();
    return xhr.responseText;
}
 
function script_link_load(filename, mime){
    var content = get_contents(filename);
    var fileref;
    if (mime == "text/css"){ //if filename is an external CSS file

        fileref = document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
    } else {    
        fileref = document.createElement('script');
    }

    fileref.setAttribute("type", mime);
    fileref.innerHTML = content;

    if (typeof fileref != "undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}

//---------------------------------------------------------------- LOAD FILE LOCAL  ---------------------------------------------------------

function readFrom_LocalFile (callback) {          //dialog prompted
    
    var link = document.createElement("input");
    link.setAttribute('style', "visibility:hidden");

    link.setAttribute('type', 'file');

    document.body.appendChild(link);
    link.addEventListener('change', function() {
        var fr = new FileReader();
        fr.onload = function () {
            callback(fr.result);
        }
        fr.readAsText(this.files[0]);
    });

    link.click();
    link.remove();
   
}

async function read_LocalFile (mimetype, callback, par) {
    let [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: '',
                accept: {
                    'text/scscript': mimetype == 'text/scscript' ? ['.sc'] : [],
                }
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    });
    let fileData = await fileHandle.getFile ();
    let content = await fileData.text();
    callback (fileData, content, par)

}

//---------------------------------------------------------------- SAVE FILE LOCAL  ---------------------------------------------------------

async function saveAs_LocalFile (mimetype, data) {
    let fileHandle = await window.showSaveFilePicker({
        types: [
            {
                description: '',
                accept: {
                    'text/scscript': mimetype == 'text/scscript' ? ['.sc'] : [],
                }
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    });
    let stream = await fileHandle.createWritable ();
    await stream.write(data);
    await stream.close();
}

function saveIn_LocalFile (data, filename, mimetype) {
    var mimetype = defined(mimetype) ? mimetype : 'application/octet-stream';
    var uri = 'data:' + mimetype + ','  + encodeURIComponent(data);

    SaveURIInFile(uri, filename);
}

function SaveURIInFile (uri, filename) {   // this.will reload page if not  event.preventDefault();    

    var link = document.createElement("a");
    link.setAttribute('style', "visibility:hidden");

    // If you don't know the name or want to use
    // the webserver default set name = ''

    link.href = uri;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    

    document.body.appendChild(link);
    link.click();
    link.remove();
   
}

function SaveDataInFile (data, fileName, mimetype) {
 
    var type = defined(mimetype) ? mimetype : 'application/octet-stream';
    var uri = 'data:' + mimetype + ','  + encodeURIComponent(data);

    var link = document.createElement("a");
    link.setAttribute('style', "visibility:hidden");

    
    link.href =  uri;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }


/*---------------------------------------------------------------- JSON ----------------------------------------------------------------*/

// ===   equality in type of object
// ==    equality in value
const js_datatypes = [
    'string',
    'number',
    'bigint',
    'boolean',
    'object',
    'symbol',
    'undefined',
    'function',
 ]
 
 const js_objectypes = [
     'Object',
     'Date',
     'Array',
     'RegExp',
     'Null',
     'HTMLDocument',
     'SpeechSynthesisUtterance',
     'SpeechSynthesisVoice',
     'SpeechSynthesis',     
     'SpeechRecognition',
     'MediaDevices',
     'InputDeviceInfo',
     'MediaDeviceInfo',
 ]

function js_objecttype(obj){
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function js_jsonstringfy_infile (obj, filename) {           // save js obj in json filename without extension .json will be added
    saveIn_LocalFile(JSON.stringify(obj, null, 2), filename, 'application/json');
}

function js_jsonparse_fromfile (callback) {           // load a json file
    readFrom_LocalFile(callback);
}

//---------------------------------------------------------------- CONNECTION  ---------------------------------------------------------
const ASYNCHRONE = true;
const SYNCHRONE  = false;

function ip_class (address) {
    if (!ip_valid (address)) {
        return 'Invalid IP address';
    }
    var values = address.split('.');
    var first_octet = parseInt(values[0]);
  
    if (first_octet < 128) {
        return 'Class A';
    } else 
    if (first_octet < 192) {
        return 'Class B';
    } else 
    if (first_octet < 224) {
        return 'Class C';
    } else {
        return 'Unknow Class'
    }
}

function ip_valid (address) {
//  const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
//    return regexExp.test(str);

    return IsMatch(address, "\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}");
}
  
function ip_detect_webserver (address) {

    if (document.location.host == '127.0.0.1' || document.location.host == 'locahost') {
        // internal server;
    } 

}
const connect_default_options = {
    onconnectfunction:        function (com)       {console.log(com)},
    ondisconnectfunction:     function (com, data) {console.log(data)},
    onmessagefunction:        function (com, data) {console.log(data)},    
    onclosefunction:          function (com, data) {console.log(data)},
    onerrorfunction:          function (com, data) {console.log(data)},   
    onupdatefunction:         function (com, data) {console.log(data)},
    onconnect_errorfunction:  function (com, data) {console.log(data)},
    onconnect_failedfunction: function (com, data) {console.log(data)},    
    reconnection:             true,             
}


class connect {   //'http://100.119.36.131:80'

    constructor (hostname, port, options) {

        this.address    = hostname  + ':' + port;
        this.options    = defined(options) ? {...connect_default_options, ...options} : connect_default_options;
        
        this.Socket     = io.connect(this.address, {reconnection: options.reconnection})//, {'reconnection': false});
        this.Socket.com = this;
    
        this.Socket.onconnectfunction        = this.options.onconnectfunction;
        this.Socket.ondisconnectfunction     = this.options.ondisconnectfunction;
        this.Socket.onmessagefunction        = this.options.onmessagefunction;
        this.Socket.onclosefunction          = this.options.onclosefunction;   
        this.Socket.onerrorfunction          = this.options.onerrorfunction;
        this.Socket.onupdatefunction         = this.options.onupdatefunction;
        this.Socket.onconnect_errorfunction  = this.options.onconnect_errorfunction;
        this.Socket.onconnect_failedfunction = this.options.onconnect_failedfunction;
        
      

        this.Socket.on('connect', function () {
            this.onconnectfunction (this.com);
        });

        this.Socket.on('disconnect',   function (data) {
            this.ondisconnectfunction (this.com, data);        
        });

        this.Socket.on('message',  function (data) {
            this.onmessagefunction(this.com, data)        
        });    

        this.Socket.on('close', function (data) {
            this.onclosefunction(this.com, data)
        });

        this.Socket.on('error', function (data) {
            this.onerrorfunction (this.com, data)
        });	

        this.Socket.on('update', function (data) {
            this.onupdatefunction (this.com, data)
        })
        
        this.Socket.on('connect_error',function (data) {
            this.onconnect_errorfunction(this.com, data)
        })
        
        this.Socket.on('connect_failed', function (data) {
                this.onconnect_failedfunction(this.com, data)
        })
        return this;        
    }
    Send = function (buffer) {
        this.Socket.emit('message', buffer);
    }
    Close = function () {
        this.Socket.disconnect();
    }
}

//---------------------------------------------------------------- ARRAY MERGE  ---------------------------------------------------------

function binaryInsert2fields (value, field, field1, array, appendduplicate, startVal, endVal){
	var length = array.length;
	
    var start   = typeof(startVal) != 'undefined' ? startVal : 0;
	var end     = typeof(endVal)   != 'undefined' ? endVal : length - 1;        //!! endVal could be 0 don't use || syntax
	
    var m = start + Math.floor((end - start)/2);

	

	if (length == 0){
		array.push(value);
		return;
	}

	if (value[field] > array[end][field] || (value[field] == array[end][field] && value[field1] > array[end][field1])) {
		array.splice(end + 1, 0, value);
		return;
	}

	if (value[field] < array[start][field] || (value[field] == array[start][field] && value[field1] < array[start][field1])) {
		array.splice(start, 0, value);
		return;
	}

	if (start > end){
	    return;
	}
	
	if (value[field] < array[m][field] || (value[field] == array[m][field] && value[field1] < array[m][field1])) {
		binaryInsert2fields(value, field, field1, array, appendduplicate, start, m - 1);
    	return;
	}

	if (value[field] > array[m][field] || (value[field] == array[m][field] && value[field1] > array[m][field1])) {
		binaryInsert2fields(value, field, field1, array, appendduplicate, m + 1, end);
    	return;
    }

	if (value[field] == array[m][field] && value[field1] == array[m][field1]){
        if (appendduplicate) {
            array[m] = {...array[m], ...value};
            return;
        }
        else {
		    array.splice(m + 1, 0, value);
		    return;
        }
	}
}

function binaryInsert(value, field, array, appendduplicate, startVal, endVal){
	var length = array.length;
	var start = typeof(startVal) != 'undefined' ? startVal : 0;
	var end = typeof(endVal) != 'undefined' ? endVal : length - 1;//!! endVal could be 0 don't use || syntax
	var m = start + Math.floor((end - start)/2);
	
	if(length == 0){
		array.push(value);
		return;
	}
	if(value[field] > array[end][field]){
		array.splice(end + 1, 0, value);
		return;
	}
	if(value[field] < array[start][field]){//!!
		array.splice(start, 0, value);
		return;
	}
	if (start > end){
		return;
	}
	if(value[field] < array[m][field]){
		binaryInsert(value, field, array, appendduplicate, start, m - 1);
		return;
	}
	if(value[field] > array[m][field]){
		binaryInsert(value, field, array, appendduplicate, m + 1, end);
		return;
	}
	if (appendduplicate && value[field] == array[m][field]){
        array[m] = {...array[m], ...value};
        return;
	}
}

function movearray(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function swaparray (array, index_A, index_B) {
    let temp = array[index_A];

    array[index_A] = array[index_B];
    array[index_B] = temp;
}

function swaptab(tab, fromsymbolname, tosymbolname) {
    var indexA, indexB;
    for (var i = 0; i < tab.length; i++) {
        if (tab[i].text == fromsymbolname) indexA = i;
        if (tab[i].text == tosymbolname) indexB = i;
    }
    var temp = tab[indexA];
    tab.splice(indexA, 1);
    tab.splice(indexB, 0, temp);
}

function swapcolumn(tab, fromsymbolname, tosymbolname) {
    var indexA, indexB;
    for (var i = 0; i < tab.length; i++) {
        if (tab[i].caption == fromsymbolname) indexA = i;
        if (tab[i].caption == tosymbolname) indexB = i;
    }
    var temp = tab[indexA];
    tab.splice(indexA, 1);
    tab.splice(indexB, 0, temp);
}


//---------------------------------------------------------------- INPUT OR DIV SET  ---------------------------------------------------------
// --------------------------------------------------------------- HTML -------------------------------------------------------

function allowDrop(event) {
    event.preventDefault();
}

function setfield(id, content, color, bgcolor, div) {
    if (document.getElementById(id) == null) return;
    if (div) {
        document.getElementById(id).innerHTML = content;
    }
    else {
        document.getElementById(id).value = content;
    }

    if (bgcolor) {
         document.getElementById(id).style.background = bgcolor;
    }
    if (color) {
        document.getElementById(id).style.color = color;
    }
}

//------------------------------------------------------ DATE -------------------------------------------------   

Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

Date.prototype.getWeek = function () {
    var dt = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7);
};

// Returns the four-digit year corresponding to the ISO week of the date.

Date.prototype.getWeekYear = function () {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

Date.prototype.getWeek1 = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

Date.prototype.getMonthWeek = function(){
    var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDay)/7);
}

function ReturnElapsedTime(time, formattext) {
    var s = "";
    if (time <= 0) return s;
    
    
    time = time / 1000;
    if (formattext) {
        s = day + " Day(s) " + hour + " Hour(s) " + minute + " Minute(s)";
        var day = Math.floor(time / (24 * 60 * 60));
        
        var remain = time % (24 * 60 * 60);
        var hour   = Math.floor(remain / (60 * 60));
        var minute = Math.floor(remain % (60 * 60) / 60);
        s = day + " Day(s) " + hour + " Hour(s) " + minute + " Minute(s)";
    }
    else {
        s = (time / 60).toFixed(0);            // minutes only
    }
    
    return (s);
}

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

function daystominutes (d) {
    return d/24/60;
}

function GetHourFromAMPMFormat(strTime) {
    var nTimeColonPos = strTime.search(":");
    var strHour = strTime.substring(0, nTimeColonPos);
    var strMinute = strTime.substring(nTimeColonPos + 1, nTimeColonPos + 3);
    var strAM_PM = strTime.substring(nTimeColonPos + 4, strTime.length);
    var nHour24 = parseInt(strHour);
    if ((strAM_PM == "pm" || strAM_PM == "PM") && nHour24 != 12) nHour24 += 12;
    if ((strAM_PM == "am" || strAM_PM == "AM") && nHour24 == 12) nHour24 = 0;
    strHour = nHour24.toString();
    if (strHour.length == 1) strHour = "0" + strHour;
    return strHour + ":" + strMinute;
}

function toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":")
}

// --------------------------------------------------------------- STRING -------------------------------------------------------

//[a, b, b] => "a|b|c"

function ReturnMatchStringFromArray (array) {
    var string = '(';
    for (var i = 0; i < array.length;  i++) {
        if (i != array.length - 1)  string += array[i].Name + '|'
        else string += array[i].Name + ')'
    }
    return string;
}

//--------------------------------------------------------------- look if key event is a number ----------------------------------

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}

//-------------------------------------------------------------- convert big number to KMB format ---------------------------------- 

function formatNumber(num, precision = 2) {
    const map = [
      { suffix: 'T', threshold: 1e12 },
      { suffix: 'B', threshold: 1e9 },
      { suffix: 'M', threshold: 1e6 },
      { suffix: 'K', threshold: 1e3 },
      { suffix: '', threshold: 1 },
    ];
  
    const found = map.find((x) => Math.abs(num) >= x.threshold);
    if (found) {
      const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
      return formatted;
    }
    return num;
}

// --------------------------------------------------------------- COLOR -------------------------------------------------------

function binToRGB(bin) {
    var pbin = parseFloat(bin);
    var r = pbin & 0xff;
    var g = (pbin >> 8) & 0xff;
    var b = (pbin >> 16) & 0xff;
    return [r, g, b];
}

function RGBToHex(r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return '#' + new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase());
}

// -------------------------------------------------------------- ARRAY MANIPULATION -----------------------------------------------

class sb_Array extends Array {
    constructor (name, ...elements) {
        super(...elements)
        this.onPush = [];
        this.NodeName = name;
    }
    push(...elements) {
        super.push(...elements)
        for (var i=0; i < this.onPush.length; i++){
            this.onPush[i](this, ...elements);
        }
     //   this.onPush = function ?.(this, ...elements) 
    }
}

// -------------------------------------------------------------- LOADER -----------------------------------------------
function LoaderInit() {

    var iLoader = document.createElement('div');
    document.body.appendChild(iLoader);

    iLoader.id                 = 'loader';

    iLoader.style.position     = "fixed";
    iLoader.style.maxWidth     = "120px";
    iLoader.style.maxHeight    = "120px";
    iLoader.style.border       = "16px solid white";
    iLoader.style.borderTop    = "16px solid gray";
    iLoader.style.borderRadius = "50%";
    iLoader.style.width        = "120px";
    iLoader.style.height       = "120px";
    iLoader.style.animation    = "spin 2s linear infinite";
    iLoader.style.position     = "absolute";
    iLoader.style.left         = "50%";
    iLoader.style.top          = "55%";
    iLoader.style.zIndex       = "599";
    iLoader.style.position     = "fixed";
    iLoader.style.marginTop    = "-60px"; 
    iLoader.style.marginLeft   = "-60px";     
    }

function LoaderRemove () {
    if (document.getElementById('loader')) {
        document.getElementById('loader').remove();
    }
}

function LoaderDisplay(display) {
    if (display) {
        LoaderInit();
    } else {
        LoaderRemove();        
    }
}   