let net    = require('net');
let http   = require('http');
let https  = require('https');
let socket = require('socket.io');
let fs     = require('fs');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var moment      = require('moment');




var ServerName          = "jurextrade.com"; 
var FTPUserName         = "uk4ibca5";   				//Your username for a ftp session
var FTPPassword         = "]!42fksf14)]";            //Your password for a ftp session
var FTPPort             = 21;
var FTPRootPath 	    = "/public_html/members/"; //"/public_html/members/";
var FTPMODE             = false;



var HTTPPort            = 2080;
var SHTTPPort           = 2443;


var MT4Port             = 2007;

const C_MAKE_COMMAND        = "mingw32-make";
const C_COMPILE_COMMAND     = "g++";
const C_SOURCE_PATH         = "./Compile/C/Files/input/";
const C_OBJ_PATH            = "./Compile/C/Files/output/";

const MQ4_COMPILE_COMMAND   = "metaeditor.exe";
const MQ4_COMPILE_PATH      = "./Compile/MQL4/";
const MQ4_SOURCE_PATH       = "./Compile/MQL4/Experts/";

function Print (sdisplay) {
    const today = moment();
    console.log(today.format('YYYY-MM-DD hh:mm:ss') + " " + sdisplay);
}

function Connection(userid, terminalname, terminaltype, symbol, port) {  //MT4 CONNECTION
	this.UserID         = userid;
    this.Socket         = null;
    this.Symbol         = symbol;
    this.Port           = port;
    this.Connected      = false;
    this.InitRequest    = null;
	this.TerminalType   = terminaltype;
	this.TerminalName   = terminalname;
}


function nodeclient(userid, socket) {									// HTTP CONNECTION
    this.HTTPsocket     = socket;
    this.Port           = 0;
    this.UserID         = userid;
	this.TerminalType   = '';	
	this.TerminalName   = '';
	this.CanSend        = false;	
}

function nodeserver (mt4port,  httpport, shttpport) {

    this.Connections = [];
    this.Clients     = [];
    
	this.GetConnectionFromSocket = function (socket) {
        for (i = 0; i < this.Connections.length; i++) {
            if (this.Connections[i].Socket == socket)
                return this.Connections[i];
        }
        return null;
    }

    this.GetConnectionFromUserId = function (userid) {  // First Connection
        for (i = 0; i < this.Connections.length; i++) {
            if (this.Connections[i].UserID == userid)
                return this.Connections[i];
        }
        return null;
    }
	
    this.GetConnectionFromTerminal = function (userid, terminalname, terminaltype, symbol) {
        for (i = 0; i < this.Connections.length; i++) {
            if ((this.Connections[i].Symbol == "ANY" || this.Connections[i].Symbol == symbol) && this.Connections[i].TerminalName == terminalname && this.Connections[i].TerminalType == terminaltype && this.Connections[i].UserID == userid)
                return this.Connections[i];
        }
        return null;
    }
    this.GetClientFromSocket = function (socket) {
        for (i = 0; i < this.Clients.length; i++) {
            if (this.Clients[i].HTTPsocket == socket)
                return this.Clients[i];
        }
        return null;
    }	
	this.SendToClient = function (connection, message, toall) {
		for (i = 0; i < NS.Clients.length; i++) {
			if (NS.Clients[i].HTTPsocket.connected &&  
			    NS.Clients[i].TerminalName == connection.TerminalName && 
				NS.Clients[i].TerminalType == connection.TerminalType && 
				(NS.Clients[i].UserID == connection.UserID  || connection.UserID == 1 && NS.Clients[i].UserID == 0)) {
				if (toall == 1 || NS.Clients[i].CanSend)
					NS.Clients[i].HTTPsocket.emit('message', ":" + connection.Symbol + "*" + message);	
			}
		}
	}	
	this.SendToHTTPClient = function (socket, message) {
		if (socket)
			socket.emit('message', message);
	}

    ListenMT4(mt4port);
    ListenHTTP(shttpport);	
	ListenHTTP(httpport);	

	process.argv.forEach(function (val, index, array) {
		console.log(index + ': ' + val);
		if (index == 2) {
			ServerName         = val;
		} else
		if (index == 3) {
			FTPRootPath			= val;
		}
	  });
};

NS = new nodeserver(MT4Port, HTTPPort, SHTTPPort);

function ListenHTTP (port) {
	var server;
	var port;
	
	if (port == SHTTPPort) { //SSL
		server = https.createServer({key: fs.readFileSync('./server.key'), cert: fs.readFileSync('./server.crt')});
	}
	else {
		server = http.createServer();
	}
	let origin =  [
          "http://localhost",
          "https://localhost",
          "http://127.0.0.1",
          "https://127.0.0.1",
          "http://www.jurextrade.com",
          "https://www.jurextrade.com",
        ];

	var io = socket(server, {cors: {origin: origin, credentials: true}});

    io.sockets.on('connection', function (socket) {

		Print('<==== HTTP CONNECTION : ' + socket.handshake.address) ;

		NS.Clients.push(new nodeclient(0, socket));

		for (var i = NS.Clients.length - 1; i >= 0; i--) {
			if (NS.Clients[i].HTTPsocket.disconnected) {
				NS.Clients.splice(i, 1);
			}
		}

//	Print('Nbr Connections :' +  NS.Clients.length);

		socket.on('message', function (message) {

			var client = NS.GetClientFromSocket (socket);
			if (!client) return;

			var values = message.split('*');
// LOGIN 			
			if (values[1] == "LOGIN") {
				var userid   		= values[0];
				var terminaltype	= values[2];
				var terminalname 	= values[3];
				
		
				client.UserID = userid;
	
				
				Print('<====  HTTP LOGIN : [' + userid + ']' + ' Terminal Name :' + terminalname + ' Terminal Type :' + terminaltype);			
				var foundconnection = false;
				for (var i = 0; i < NS.Connections.length; i++) {

					if  (NS.Connections[i].TerminalType == terminaltype && NS.Connections[i].TerminalName== terminalname && 
					     (NS.Connections[i].UserID == userid || (userid == 0 && NS.Connections[i].UserID == 1))) {
							 
						if (NS.Connections[i].Connected) {

							client.CanSend = false;  // need to ask me to send again
							Print('====>  HTTP LOGIN : [' + userid + ']' + ' Terminal Name :' + terminalname + ' Terminal Type :' + terminaltype + ' Symbol : ' + NS.Connections[i].Symbol + ' RUNNING');
							NS.SendToHTTPClient(socket, ":" + NS.Connections[i].Symbol + "**LOGIN^" + userid + "^" + terminalname +  "^" + terminaltype + "^" + + NS.Connections[i].Symbol + "^"  +"OK*");  
							foundconnection = true;
						}
					}
				}
				if (!foundconnection) {
					NS.SendToHTTPClient(socket, ":______**LOGIN^" + userid + "^" + terminalname +  "^" + terminaltype + "^" + "______" +  "^"  +"KO*");  
			//		Print('====>  HTTP LOGIN : [' + userid + ']' + ' Terminal Name :' + terminalname + ' Terminal Type :' + terminaltype + ' NOT RUNNING');
				}
			}	
			else
// receive START return INIT from mt4 		

			if (values[1] == "START") {
				var userid   		= values[0];
				var terminaltype	= values[2];
				var terminalname 	= values[3];
				var start 			= +values[4];
		
				client.UserID       = userid;
				client.TerminalType = terminaltype;
				client.TerminalName = terminalname;
				
				Print('<====  HTTP START : [' + userid + ']' +  ' Terminal Name : ' + terminalname + ' Terminal Type : ' + terminaltype + 'Start : ' + values[1]);			
				var foundconnection = false;
				for (var i = 0; i < NS.Connections.length; i++) {
					if  (NS.Connections[i].TerminalType == terminaltype && NS.Connections[i].TerminalName== terminalname && 
					     (NS.Connections[i].UserID == userid || (userid == 0 && NS.Connections[i].UserID == 1))) {
						if (NS.Connections[i].Connected) {
						   
				            Print('====>  HTTP START : [' + userid + ']' +  ' Terminal Name : ' + terminalname + ' Terminal Type : ' + terminaltype + ' Symbol : ' + NS.Connections[i].Symbol+ 'Start : ' + values[1]);			
							client.CanSend = (start == 0 ? false : true);
							if (client.CanSend == true)
								NS.SendToHTTPClient(socket, NS.Connections[i].InitRequest);	
							foundconnection = true;	
						}
					}
				}
				if (!foundconnection) {
					Print('====>  HTTP START : [' + userid + ']' + ' Terminal Name :' + terminalname + ' Terminal Type :' + terminaltype + ' Nothing found to start');
				}
				
			}
			else		
// COMPILE				
			if (values[1] == "COMPILE") {
				let userid          = values[0];
				let projectfolder   = values[2];
				let filename        = values[3];	
				let langtype        = values[4];
                let terminaltype    = values[5];

				var n = message.search(terminaltype);
				var data = message.substring (n + terminaltype.length + 1);
				Print('<====  HTTP COMPILE : [' + userid  + ']' + ' Language : ' + langtype + ' Project Folder : ' + projectfolder + ' File Name : '  + filename + ' Terminal Type : ' + terminaltype);
				Compile (socket, userid, projectfolder, filename, data, langtype, terminaltype);
			}	
			else
// DISTRIBUTE					
			if (values[1] == "DISTRIBUTE") {
				let userid          = values[0];
				let projectfolder   = values[2];
				let filename        = values[3];	
				let langtype        = values[4];
				let terminalpath    = values[5];

				Print('<====  HTTP DISTRIBUTE : [' + userid  + ']' + ' Language : ' + langtype + ' Project Folder : ' + projectfolder + ' File Name : '  + filename + ' Terminal Path : ' + terminalpath);
				Distribute (socket, userid, projectfolder, filename, langtype, terminalpath);
			}	
			else
// RELOADPROJECT			
			if (values[1] == "RELOADPROJECT") {
				var userid       	= values[0];
				var symbol 			= values[2];
				var terminalname	= values[3];
				var terminaltype 	= values[4];

				Print('<====  HTTP RELOADPROJECT : [' + userid + ']' + ' Terminal Name : ' + terminalname + ' Terminal Type : ' + terminaltype);
				var connection = NS.GetConnectionFromTerminal(userid, terminalname, terminaltype, symbol);
				if (connection == null) return;
				if (connection.Connected == false) return;				

				Print('send reload project to terminal');
				connection.Socket.write('*RELOADPROJECT ' + terminaltype + '*');
			}						
			else {			


				let userid          = values[0];
				let symbol          = values[1];
				let command         = values[2];
				console.log ('userid : ' + userid)
				console.log ('symbol : ' + symbol)
				console.log ('command : ' + command)


				Print('recu message de HTTP : ' + userid + ' ' + symbol + ' ' + command);
			
				var connection = NS.GetConnectionFromTerminal(userid, client.TerminalName, client.TerminalType, symbol);
			
			
				Print('envoi message : ' + userid + ' ' + symbol + ' ' + command + ' ' + client.TerminalName + ' ' + client.TerminalType);
				if (connection == null) return;
				if (connection.Connected == false) return;
				
				connection.Socket.write('*' + command + '*');
			}
		});


		socket.on('close', function (data) {
			Print("CLOSE HTTP Patform connection closed");
			Print(HTTPsockets);
		});
		
		
		socket.on('disconnect',
            (reason) => {
//Print('Nbr Connections before :' +  NS.Clients.length);				
				Print (" DISCONNECT HTTP Socket : " + socket.handshake.address + " Reason : " + reason);   
				for (var i = NS.Clients.length - 1; i >= 0; i--) {
					if (NS.Clients[i].HTTPsocket.disconnected) {
						NS.Clients.splice(i, 1);
					}
				}
//Print('Nbr Connections after :' +  NS.Clients.length);				
            });	

        socket.on('error',
			function(data) {
				Print (" CLOSED HTTP Socket on Error : " + socket.handshake.address );    			
			});		
    });

    Print("HTTP listening on port " + port);
    server.listen(port);
}

function ListenMT4 (port) {
    var server = net.createServer(function (socket) {
		socket.on('data', function (data) {
			var connection = NS.GetConnectionFromSocket(socket);
			var message = String.fromCharCode.apply(null, data);
		
			if (connection && connection.InitRequest != null) {
				NS.SendToClient(connection, message);
				return;
			}
			
			var lines = message.split('*');
			for (var j = 0; j < lines.length; j++) {

				if (lines[j] == '.') continue;
				if (lines[j].length  < 1 ) continue;

				var values = lines[j].split('^');

				if (values[0] == "LOGIN") {
					
					let symbolname 		= values[1];       
					let loginserver	    = values[2];					             
					let username 	    = values[3];
					let password 	    = values[4];
					let accountnumber   = values[5];		
					let accountname     = values[6];					
					let terminalname    = values[7];
					let datapath 	    = values[8];					
					let terminaltype    = +values[9] == 0 ? 'Terminal' : 'Tester';

					Print("Recu Message Login " + loginserver + ' , ' + username + ' , ' + password  + ' accountname : ' + accountname   + ' terminalname : ' + terminalname   + ' datapath : ' + datapath   + ' terminaltype : ' + terminaltype);
	
                    result = VerifyUser (socket, port, symbolname, loginserver, username, password, accountnumber, accountname, terminalname, terminaltype, datapath);
					return;
				}
				if (!connection) 
					return;
				
				if (values[0] == "INIT") {
					let symbolname 	= values[1];
					let terminalname = values[20];
					let message		 = "*INIT^" + connection.UserID + "^" + connection.TerminalName + "^" + connection.TerminalType + "^" + connection.Symbol + lines[j].substr(4) + "*";

					connection.InitRequest = ":" + symbolname +  "*" + message;
					Print("Store New Init for http client with terminal name : " + terminalname + " and symbol : " + symbolname); 	
				}
			}
			NS.SendToClient(connection, message);					
		});

		socket.on('close', function (data) {
			var connection = NS.GetConnectionFromSocket(socket);
			if (!connection) return;
			NS.SendToClient(connection, "*CONNECT^" + connection.UserID + "^" + connection.TerminalName + "^" + connection.TerminalType + "^" + connection.Symbol + "^" + "KO*", 1);			
			connection.Connected = false;
			connection.Socket = null;
			connection.InitRequest = null;			
			Print("Connexion coupee " + connection.Symbol);
		});


		socket.on('error', function (data) {
			var connection = NS.GetConnectionFromSocket(socket);
			if (!connection) return;
			NS.SendToClient(connection, "*CONNECT^" + connection.UserID + "^" + connection.TerminalName + "^" + connection.TerminalType + "^" + connection.Symbol + "^" + "KO*", 1);			
			connection.Connected = false;
			connection.Socket = null;
			connection.InitRequest = null;
			Print("Connexion coupee " + connection.Symbol);
		});
	});
    server.on('connection', function (socket) {
        Print("MT4 Platform connection opened " + socket.remoteAddress + ':' + socket.remotePort + "     <============= MT4");
		for (var i = NS.Connections.length - 1; i >= 0; i--) {
			if (NS.Connections[i].Connected == false) {
				NS.Connections.splice(i, 1);
			}
		}
    });
    Print("MT4 listening on port " + port);
    server.listen(port);
}



function VerifyUser (socket, port, symbol, loginserver, username, password, accountnumber, accountname, terminalname, terminaltype, datapath) {
	
    var http = new XMLHttpRequest();
	var typeterminal;
	
	if (terminaltype == 'Terminal' ||  terminaltype == 'Tester')
		typeterminal = 'MT4';
	else
		if (terminaltype == 'IB')
			typeterminal = 'IB';

	
    var url = 'http://' + loginserver +'/wp-login1.php?action=check&' + 
			  'user_login=' + username + 
			  '&user_password=' + password + 
			  '&accountnumber=' + accountnumber + 
			  '&accountname=' + accountname + 
			  '&terminalname=' + terminalname + 
			  '&datapath=' + datapath + 
			  '&terminaltype=' + typeterminal;
    http.open('POST', url, false);
    
    Print ('Sending request to verify user :' + username + ' password : ' + password);
    
	http.onreadystatechange = function() {//Call a function when the state chan
	    if(http.readyState == 4 && http.status == 200) {
		Print("recu : *" + http.responseText + "*");
		var userid = 0;
		if (http.responseText == '0') 
			{
				Print("Authentification Echoue : " + userid);
				socket.end ();
			}
			else
			{
				userid = http.responseText;
				Print("Authentification Reussie : " + userid);
				socket.write(userid);
				var connection = NS.GetConnectionFromTerminal(userid, terminalname, terminaltype, symbol);
				if (!connection) {
					connection = new Connection(userid, terminalname, terminaltype, symbol, port);
					NS.Connections.push(connection);
				}
				connection.Connected = true;
                connection.Socket = socket;
				NS.SendToClient(connection, "*CONNECT^" + connection.UserID + "^" + connection.TerminalName + "^" + connection.TerminalType + "^" + connection.Symbol + "^" + "OK*", 1);			
			}

		}
	}
    http.send(null);
}



/////////////////////////////////////////////////////////// COMPILATION /////////////////////////////////////////////////////////

function cleanFile (filename) {
	try {
        fs.unlinkSync(filename);
        console.log('File: ' + filename  + ' deleted successfully!');
    } catch (err) {
        console.error('Error deleting file ' + filename , err);
    }
}

function SendFileExpert (userid, fromfile, tofile, filetype, projectfolder, socket, emplacement) {                //http

   
    let content = fs.readFileSync(fromfile)    
    var http = new XMLHttpRequest();
    
    var url = 'http://' + ServerName + '/php/save_expert.php';  
    const params = new URLSearchParams();
 
    console.log (userid + '*' + tofile + '*' + projectfolder + '*' + emplacement)

    var FormData = require('form-data');
    var formdata = new FormData();
    formdata.append('user_id', userid);
    formdata.append('filename', tofile);
    formdata.append('projectfolder', projectfolder);
    formdata.append("emplacement", emplacement);
    formdata.append('content', content);


    const axios = require('axios');

    axios.post(url, formdata, {
        headers: {
            'Content-Type': 'application/octet-stream', // Or the specific MIME type
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    })
    .then(response => {
          var strerror = "\nUPLOAD " +  fromfile + " to " + response.data  + " OK successfully uploaded\n";
	      Print(strerror);
	      NS.SendToHTTPClient(socket, ":______**UPLOAD^" + fromfile   +  "^" + projectfolder  +  "^" + filetype +  "^OK^"  + strerror + "*");   	
//		  cleanFile (fromfile);		  
    })
    .catch(error => {
          var strerror = "\nUPLOAD " +  fromfile + " to " +   tofile  + " Failed: " + JSON.stringify(err) + "\n";    
          Print(strerror);
		  NS.SendToHTTPClient(socket, ":______**UPLOAD^" + fromfile   +  "^" + projectfolder  +  "^" + filetype + "^ERROR^" + strerror + "*");              
          console.error('Error uploading stream:', error);
		  cleanFile (fromfile);		  

    });    
}


function PutFileExpert (fromfile, tofile,  filetype, userid, projectfolder, socket, stdout) {

	var PromiseFtp = require('promise-ftp');

	
	var ftp = new PromiseFtp();    
        return ftp.connect({
        host:       ServerName,
        user:       FTPUserName,
        password:   FTPPassword
    })
    
    .then(() => {
      Print('connected');
      Print ("START SENDING " + fromfile + " to " +   tofile + " for PROJECT : " + projectfolder + " USERID = " + userid);


      return ftp.put(fromfile, tofile)
        .then(() => {
            
          var strerror = "\nUPLOAD " +  fromfile + " to " + tofile  + " OK successfully uploaded\n";
	      Print(strerror);
	      NS.SendToHTTPClient(socket, ":______**UPLOAD^" + fromfile   +  "^" + projectfolder  +  "^" + filetype +  "^OK^"  + strerror + stdout + "*");   	
		  cleanFile (fromfile);		  
        })
        .catch(err => {
            
          var strerror = "\nUPLOAD " +  fromfile + " to " +    tofile  + " Failed: " + JSON.stringify(err) + "\n";    
          Print(strerror);
		  NS.SendToHTTPClient(socket, ":______**UPLOAD^" + fromfile   +  "^" + projectfolder  +  "^" + filetype + "^ERROR^" + strerror + stdout + "*");              
		  cleanFile (fromfile);		  
        });
    })
    
    .then(() => ftp.end())
    .catch(err => {
      var strerror = "\nUPLOAD " +  fromfile + " to " +    tofile  + " Failed: " + JSON.stringify(err) + "\n";    
      NS.SendToHTTPClient(socket, ":______**UPLOAD^" + fromfile   +  "^" + projectfolder  +  "^" + filetype + "^ERROR^" + strerror + stdout + "*");              
      Print(strerror);
      cleanFile (fromfile);		  
    });
	
}

function CompileC (userid, terminaltype, projectfolder, filename, socket) {
	var projectfile = (terminaltype == "Tester") ? "PG_TEntryRules.dll" : "PG_EntryRules.dll";
    Print ("START COMPILING C " + projectfolder + " for PLATFORM : " + terminaltype  + " USERID = " + userid + " Library : " + projectfile);

	const { exec } = require('child_process'); 

	return exec(C_MAKE_COMMAND + ' ' + projectfile, (err, stdout, stderr) => {

		if (err) {
			Print('Compile error!');
			NS.SendToHTTPClient(socket, ":______**COMPILE^" + projectfile   +  "^"  + projectfolder  + "^C^ERROR^" + stderr + "*");    			
			return 1;
		}

		Print('Compile ok!');	
		NS.SendToHTTPClient(socket, ":______**COMPILE^" + projectfile   +  "^"  + projectfolder  + "^C^OK^" + "C Project Successfully Compiled*");   

        exec ('strip ' + projectfile);
		let fromfile =  C_OBJ_PATH + projectfile;
        if (FTPMODE) {
            let tofile   =  FTPRootPath + userid + '/Projects/' +  projectfolder +  '/MQL4/Libraries/' + projectfile;		
		    PutFileExpert (fromfile, tofile, 'C', userid, projectfolder, socket, stdout);

        } else {
            let tofile   = projectfile;		
            SendFileExpert (userid, fromfile, tofile, 'C',  projectfolder, socket, 'Libraries');           
        }
		return 1;
	});
}
 
function CompileMQ4 (userid, terminaltype, projectfolder, filename, socket) {
    var projectfile =  filename + '.mq4';
    var tofile   =  FTPRootPath + userid + '/Projects/' +  projectfolder +  '/MQL4/Experts/' + filename + '.mq4';		
    Print ("START COMPILING MQ4 STRATEGY " + filename + " for PROJECT : " + projectfolder  + " USERID = " + userid + " Experts : " + projectfile);

	const { exec } = require('child_process'); 
	return exec(MQ4_COMPILE_COMMAND + ' /compile:' +  './Experts/' + projectfile + ' /inc:' + './' + ' /log:' + 'error.log', {"cwd": MQ4_COMPILE_PATH}, (err, stdout, stderr) => {
		
		var myLines = fs.readFileSync(MQ4_COMPILE_PATH + 'error.log', "ascii").toString("ascii").split('\n');			
				
		if (err) {
	        Print('File MQ4 Compile OK');            
			NS.SendToHTTPClient(socket, ":______**COMPILE^" + filename + '.ex4'   +  "^" + projectfolder  +  "^MQL4^OK^"  + "MQ4 Successfully Compiled*");    

			let fromfile =  MQ4_SOURCE_PATH + filename + '.ex4';
            if (FTPMODE) {
                let tofile   =  FTPRootPath + userid + '/Projects/' +  projectfolder +  '/MQL4/Experts/' + filename + '.ex4'			
                PutFileExpert (fromfile, tofile, 'MQL4', userid, projectfolder, socket, "ok");	

            } else {
                let tofile   =  filename + '.ex4';			
                SendFileExpert (userid, fromfile, tofile, 'MQL4',  projectfolder, socket, 'Experts');       
                tofile   =  filename + '.mq4';			
				fromfile =  MQ4_SOURCE_PATH + filename + '.mq4';				
                SendFileExpert (userid, fromfile, tofile, 'MQL4',  projectfolder, socket, 'Experts');       

            }
			return 1;
		}
		NS.SendToHTTPClient(socket, ":______**COMPILE^" + filename + '.ex4'   +  "^" + projectfolder  +  "^MQL4^ERROR^" + " ERROR = " + myLines[myLines.length - 2] + "*");    
		Print('Compile error!');
		return -1;
	});
	
}

function MakeFile (projectfolder, filename, data, langtype) {

	if (langtype == 'MQL4') {

		var gfilename = MQ4_SOURCE_PATH + filename + '.mq4';
		
		fs.writeFileSync(gfilename, fs.readFileSync(MQ4_SOURCE_PATH + 'MProgress.mq4'));
		fs.appendFileSync(gfilename, data);
		
		Print('File MQ4 OK make!');
		return filename;	
	}
	else 
	if (langtype == 'C') {
		var gfilename = C_SOURCE_PATH + projectfolder + ".cpp";
		
		fs.writeFileSync(gfilename, fs.readFileSync(C_SOURCE_PATH + "Progress.cpp"));
		fs.appendFileSync(gfilename, data);
		
		var s = "";
		s += "OBJ= " + C_OBJ_PATH + projectfolder + ".o\n"; 
		s += "EXEC= " +  C_OBJ_PATH + "PG_EntryRules.dll\n";
		s += "TEXEC= " + C_OBJ_PATH + "PG_TEntryRules.dll\n\n";
		
		s += "PG_EntryRules.dll: $(EXEC)\n";
		s += "PG_TEntryRules.dll: $(TEXEC)\n\n";
		
		s += C_OBJ_PATH + "PG_EntryRules.dll: $(OBJ) " + C_OBJ_PATH + "PG_EntryRules.o\n";
		s += "	" + C_COMPILE_COMMAND + "  " + "-shared -o $@ $^\n"; 
		s += C_OBJ_PATH + "PG_TEntryRules.dll: $(OBJ) " + C_OBJ_PATH + "PG_TEntryRules.o\n";
		s += "	" + C_COMPILE_COMMAND + "  " + "-shared -o $@ $^\n\n"; 
		
		s += C_OBJ_PATH + "%.o: " + C_SOURCE_PATH + "%.cpp\n";
		s += "	" + C_COMPILE_COMMAND + "  " + "-o $@ -c $<\n";	

		fs.writeFileSync('makefile', s);
		Print('File C OK make!');
		return filename;	
	}

}	

function GenerateExpert (userid, projectfolder, filename, data, socket, langtype, terminaltype) {
	if (langtype == 'MQL4') {
		return (CompileMQ4 (userid, terminaltype, projectfolder, MakeFile (projectfolder, filename, data, langtype), socket));
		
	}
	else 
	if (langtype == 'C') {
		return (CompileC (userid, terminaltype, projectfolder, MakeFile (projectfolder, filename, data, langtype), socket));
	}	
	else
		return;
}

function Compile (socket, userid, projectfolder, filename, data, langtype, terminaltype) {
	var result = GenerateExpert (userid, projectfolder, filename, data, socket, langtype, terminaltype);
}

function Distribute (socket, userid, projectfolder, filename, langtype, terminalpath) {
	let sfilename = 'members/' + userid + '/Projects/' + projectfolder + '/MQL4/Experts/' + filename;
	download_file(socket, ServerName, sfilename, terminalpath + '/MQL4/Experts/' + filename); 
}

async function download_file(socket, servername, filename, tofilename) {

	let url = 'http://' + servername + '/' + filename;  
	try {
	  const downloadLink = url;
	  const response = await require('axios').get(downloadLink, { responseType: 'arraybuffer' });

	  const fileData = Buffer.from(response.data, 'binary');
	  
	  await fs.writeFileSync(tofilename, fileData);
	  
	  let strerror = "DOWNLOAD " +  filename + " to " + tofilename  + " OK successfully downloaded";
	  Print(strerror);

	  NS.SendToHTTPClient(socket, ":______**DISTRIBUTE^" + filename   +  "^" + tofilename +  "^OK^"  + strerror + "*"); 	  


	} catch (error) {
	  
		let strerror = "DOWNLOAD " +  filename + " to " +  tofilename  + " Failed: " + error;    
		Print(strerror);
		NS.SendToHTTPClient(socket, ":______**DISTRIBUTE^" + filename   +  "^" + tofilename  +  "^ERROR^" + strerror  + "*");              
	}
}