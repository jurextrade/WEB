const childprocess = require('child_process'); 

const net    = Require('net');
const http   = Require('http');
const https  = Require('https');
const socket = Require('socket.io');
const fs     = Require('fs');
const moment = Require("moment");
const xmlhttprequest = Require("xmlhttprequest")

function Require (module) {
    try {
        let result = childprocess.execSync('npm list ' + module + ' || npm install ' + module);       
        if (result.indexOf("'UNMET DEPENDENCY'") != -1) {
            console.log ('module do not exist : ' + module + ' Installation done');
        }

        let myModule = require(module); 
        return myModule;
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        process.exit(1);
    }            
}
childprocess.execSync('title EMVRouter');       

const XMLHttpRequest = xmlhttprequest.XMLHttpRequest;



const TERMINAL         = "TERMINAL";
const CARD             = "CARD";
const ROUTER           = "ROUTER";


var ServerName         = "jurextrade.com"; 
var FTPUserName        = "uk4ibca5";   				//Your username for a ftp session
var FTPPassword        = "]!42fksf14)]";            //Your password for a ftp session
var FTPPort            = 21;
var FTPRootPath 	   = "/public_html/members/"; //"/public_html/members/";


var EMVServerAdress   = '127.0.0.1';
var EMVPort           = 2008;

var HTTPPort          = 5080;
var SHTTPPort         = 5443;

var CardsPort         = 3007;
var TerminalPort      = 3008;


// EMV Server listening on 2000;      // connection from Card Client
// Router Server listening on 3007;   // connection from Card Client
// Router Server listening on 542;    // connection from Web  Client


function emvconnection () {
    this.Socket 		= null;
    this.Connected 		= false;
}

function cardClient (userid, userservername, username, userpassword) {
	this.UserID 		= userid;
    this.UserName       = username;
    this.UserPassword   = userpassword;
    this.UserServerName = userservername;
    this.Socket 		= null;
    this.Connected 		= false;
    this.InitRequest 	= null;
    this.EmvConnection  = new emvconnection();

}

function webClient (userid, socket) {
    this.UserID 		= userid;
    this.Socket 	    = socket;
	this.CanSend 		= true;	
    this.ProjectName    = "";	
	this.ShouldReload   = false;		// inform server to reload;
}

function emvServer () {
    this.Socket 		= null;
    this.Connected 		= false;
    this.ProjectName    = "";		
}


function Print (sdisplay) {
    const today = moment();
    console.log(today.format('YYYY-MM-DD hh:mm:ss') + " " + sdisplay);
}

NS = new nodeserver(CardsPort, TerminalPort, HTTPPort, SHTTPPort);

function nodeserver (cardsport, terminalport, httpport, shttpport) {
    this.emvServer   = new emvServer;

    this.cardClients = [];
    this.webClients  = [];
    
	this.GetCardClientFromEmvSocket = function (socket) {
        for (i = 0; i < this.cardClients.length; i++) {
            if (this.cardClients[i].EmvConnection.Socket == socket)
                return this.cardClients[i];
        }
        return null;
    }

	this.GetCardClientFromSocket = function (socket) {
        for (i = 0; i < this.cardClients.length; i++) {
            if (this.cardClients[i].Socket == socket)
                return this.cardClients[i];
        }
        return null;
    }

    this.GetWebClientFromSocket = function (socket) {
        for (i = 0; i < this.webClients.length; i++) {
            if (this.webClients[i].Socket == socket)
                return this.webClients[i];
        }
        return null;
    }	
    
    this.GetWebClientFromUserId = function (userid) {
        for (i = 0; i < this.webClients.length; i++) {
            if (this.webClients[i].UserID == userid)
                return this.webClients[i];
        }
        return null;
    }	

    this.GetCardClientFromUserId = function (userid) {  // First cardClient
        for (i = 0; i < this.cardClients.length; i++) {
            if (this.cardClients[i].UserID == userid)
                return this.cardClients[i];
        }
        return null; 'savefile'
    }
    this.GetCardClientFromUser = function (servername, username, password) {  // First cardClient
        for (i = 0; i < this.cardClients.length; i++) {
            console.log (this.cardClients[i].Connected + '*' + this.cardClients[i].UserServerName + '*' +  this.cardClients[i].UserName  + '*' +  this.cardClients[i].UserPassword + '*')
            if (this.cardClients[i].Connected       == true &&
                this.cardClients[i].UserServerName  == servername &&
                this.cardClients[i].UserName        == username &&
                this.cardClients[i].UserPassword    == password)
                return this.cardClients[i];
        }
        return null;
    }    
	this.SendToWebClient = function (cardclient, origin, message, toall) {                      
		for (i = 0; i < NS.webClients.length; i++) {
//            console.log (NS.webClients.length);
			if (this.webClients[i].Socket.connected &&  
				(this.webClients[i].UserID == cardclient.UserID)){ //  || cardclient.UserID == 1 && NS.webClients[i].UserID == 0)) {
				if (toall == 1 || this.webClients[i].CanSend){
					NS.webClients[i].Socket.emit('message', ":" + origin + "*" + message);	
                }
			}
		}
	}	
    this.SendToAllWebClients = function (origin, message) {
		for (i = 0; i < NS.webClients.length; i++) {
    		this.webClients[i].Socket.emit('message', ":" + origin + "*" + message);	
        }
	}
	
    this.EmitToWebClient = function (socket, message) {
		if (socket)
			socket.emit('message', message);
	}
	this.EmitToCardClient = function (socket, message) {
		if (socket)
			socket.write(message);
	}
    ListenTerminal(terminalport);
    ListenCards(cardsport);
	ListenHTTP(httpport);	
	ListenHTTP(shttpport);	    
}

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


    io.on('connection', function (socket) {

        Print("==== HTTP CONNECTION " + socket.handshake.address + "     <============= WEB CLIENT CONNECTED");
        if (NS.emvServer.Connected  == true) {
            NS.EmitToWebClient(socket, ":TERMINAL**CONNECT^EMVSERVER^1*")
        } else {
            NS.EmitToWebClient(socket, ":TERMINAL**CONNECT^EMVSERVER^0*")
        }

		NS.webClients.push(new webClient(0, socket));

		for (var i = NS.webClients.length - 1; i >= 0; i--) {
			if (NS.webClients[i].Socket.disconnected) {
				NS.webClients.splice(i, 1);
			}
		}

		socket.on('message', function (message) {

			var client = NS.GetWebClientFromSocket (socket);
			if (!client) return;

			var values = message.split('*');
// LOGIN 			
			if (values[1] == "LOGIN") {
				let userid      = values[0];

				client.UserID       = userid;

				
				Print('<====  HTTP LOGIN : [' + userid + ']');			
				let foundconnection = false;

				for (var i = 0; i < NS.cardClients.length; i++) {

					if  (NS.cardClients[i].UserID == userid) { // || (userid == 0 && NS.cardClients[i].UserID == 1)) {
						if (NS.cardClients[i].Connected) {
                            foundconnection = true;
					//		client.CanSend = false;  // need to ask me to send again
							Print('====>  HTTP LOGIN : [' + userid + ']'  + 'A CLIENT IS RUNNING for userid ' + NS.cardClients[i].UserID);
							NS.EmitToWebClient(socket, ":CARD**LOGIN^OK*");  
                            NS.EmitToCardClient(NS.cardClients[i].Socket,  userid + "*WEBCLIENT*OK*");
    			        }
                    }
				}
				if (!foundconnection) {
					NS.EmitToWebClient(socket, ":CARD**LOGIN^KO*");  
					Print('====>  HTTP LOGIN : [' + userid + ']'  + ' NO CLIENT IS RUNNING FOR userid ' + userid);
				}
			} else
            if (values[1] == "DISTRIBUTE") {
				let userid      = values[0];
                let projectname = values[2];

				client.ProjectName   = projectname;
                client.ShouldReload = true;

				
				Print('<====  HTTP DISTRIBUTE : [' + userid + ' , ' + projectname + ']');		

				let foundconnection = false;

				for (var i = 0; i < NS.cardClients.length; i++) {

					if  (NS.cardClients[i].UserID == userid) { // || (userid == 0 && NS.cardClients[i].UserID == 1)) {
						if (NS.cardClients[i].Connected) {
                            foundconnection = true;
							NS.EmitToWebClient(socket, ":CARD**DISTRIBUTE^" + "OK^" +"*");  
                            NS.EmitToCardClient(NS.cardClients[i].Socket,  userid + "*DISTRIBUTE*" + projectname + "*");
    			        }
                    }
				}
				if (!foundconnection) {
					NS.EmitToWebClient(socket, ":CARD**DISTRIBUTE^" + "KO*");  
					Print('====>  HTTP DISTRIBUTE : [' + userid + ']'  + ' NO CLIENT IS RUNNING FOR userid ' + userid);
				}   
            }  else {			
				var userid  = values[0];
				var command = values[1];
                var par     = values[2];

                Print('recu message de HTTP : ' + userid + ' ' + command);
				
				let cardclient = NS.GetCardClientFromUserId(userid);

                if (cardclient == null || cardclient.Connected == false) {
                    Print('cardclient == null');                    
                    return;
                }

                Print('envoi message : ' + userid + ' ' + command);

				NS.EmitToCardClient(cardclient.Socket, message);
			}
		});


		socket.on('close', function (data) {
			Print("CLOSE HTTP Patform connection closed");
			Print(HTTPsockets);
		});
		
	
		socket.on('disconnect',
            (reason) => {
		
				Print (" DISCONNECT HTTP Socket : " + socket.handshake.address + " Reason : " + reason);   
				for (var i = NS.webClients.length - 1; i >= 0; i--) {
					if (NS.webClients[i].Socket.disconnected) {
						NS.webClients.splice(i, 1);
					}
				}
				
				if (reason === 'io server disconnect') {
                }
            });	
		socket.on('error',
			function(data) {
				Print (" CLOSED HTTP Socket on Error : " + socket.handshake.address );    			
			});		
    });
    Print("HTTP listening on port " + port);
    server.listen(port);
}


function ListenCards (port) {
    var server = net.createServer( function (socket) {
		socket.on('data', function (data) {

			let cardclient 	= NS.GetCardClientFromSocket(socket);
			
			let message 	= String.fromCharCode.apply(null, data);
	
			let lines = message.split('*'); 
			for (var j = 0; j < lines.length; j++) {
				if (lines[j] == '.') continue;
				if (lines[j].length  < 1 ) continue;

				let values = lines[j].split('^');

				if (values[0] == "LOGIN") {
					let servername 		= values[1];
                    let username 		= values[2];
					let password 		= values[3];

					Print("Recu Message Login from Card Client: " + servername + ' , ' + username + ' , ' + password);
					
					result = VerifyUser (socket, port, servername, username, password);
					return;
				} else 
				if (values[0] == "START") {
					let userid 			= values[1];

					Print("Recu Message start from Card Client: " + userid);
					Print("Server is " + (NS.emvServer.Connected ? "connected" : "not connected") + " Project Name : " + NS.emvServer.ProjectName);
					let webclient = NS.GetWebClientFromUserId (userid);
					Print("Web Client is " + (webclient ? "connected" : "not connected") + " Project Name : " + webclient.ProjectName);
				}
			} 
			
			if (!cardclient) {
				Print("Client Not found ! you need to login");
				return;
			}

			NS.SendToWebClient(cardclient, CARD, message);					

		});

		socket.on('close', function (data) {
			let cardclient = NS.GetCardClientFromSocket(socket);
			if (!cardclient) return;
			NS.SendToWebClient(cardclient, CARD, "*CONNECT^" + cardclient.UserID +"^0*", 1);			
			cardclient.Connected    = false;
			cardclient.Socket       = null;
			cardclient.InitRequest  = null;			
            Print("Customer connection closed " + cardclient.UserID + "                         <============= CARD READER CLOSED");            

		});

		socket.on('error', function (data) {
			let cardclient = NS.GetCardClientFromSocket(socket);
			if (!cardclient) return;
			NS.SendToWebClient(cardclient, CARD, "*CONNECT^" + cardclient.UserID +"^0*", 1);
			cardclient.Connected    = false;
			cardclient.Socket       = null;
			cardclient.InitRequest  = null;
            Print("Customer connection closed " + cardclient.UserID + "                         <============= CARD READER CLOSED");            
		});
	});
    server.on('connection', function (socket) {
        Print("Customer connection opened " + socket.remoteAddress + ':' + socket.remotePort + "     <============= CARD READER CONNECTED");
		for (var i = NS.cardClients.length - 1; i >= 0; i--) {
			if (NS.cardClients[i].Connected == false) {
				NS.cardClients.splice(i, 1);
			}
		}
    });
    Print("EMV Router For Cards listening on port " + port);
    server.listen(port);
}


function ListenTerminal (port) {
    let server = net.createServer( function (socket) {
		socket.on('data', function (data) {

			var message 	= String.fromCharCode.apply(null, data);
			
            var lines = message.split('*'); 
			for (var j = 0; j < lines.length; j++) {
				if (lines[j] == '.') continue;
				if (lines[j].length  < 1 ) continue;

				var values = lines[j].split('^');

				if (values[0] == "LOGIN") {               // receive this message means card reader is connected;
					var servername 		= values[1];
                    var username 		= values[2];
					var password 		= values[3];

					Print("Recu Message Login from EMV Server : *" + servername + '* , *' + username + '* , *' + password + "*");

					let projectname = "";
					let shouldreload = "FALSE";
			

                    let cardclient 	= NS.GetCardClientFromUser (servername, username, password);     

                    if (!cardclient) {
                        socket.write( '0*NOK*?*-*no*');
                        console.log ('get connection from EMVServer but can not find client strange!')
                       // NS.SendToWebClient(cardclient, TERMINAL, '*LOGIN^KO^*');      
                        return;       
                    }
					let userid = cardclient.UserID;
					
					let webclient 	= NS.GetWebClientFromUserId (userid);     
					if (webclient) {
						projectname  = webclient.ProjectName == "" ? "-" : webclient.ProjectName;
						shouldreload = webclient.ShouldReload ? "yes" : "no";
                        webclient.ShouldReload = false;
					}               

					console.log ('get connection from  EMVServer client id is : ' + cardclient.UserID)
                    socket.write( userid + '*OK*' + (webclient ? 'OK' : 'NOK') + '*' + projectname + '*' + shouldreload + '*');

                    NS.SendToWebClient(cardclient, TERMINAL, '*LOGIN^OK^*');      
                    NS.SendToWebClient(cardclient, TERMINAL, '*TRACE^' + cardclient.UserID + '^Hello ' + username +  '\n^*');      
					return;

				} 
                var userid = values[1];
                let cardclient = NS.GetCardClientFromUserId (userid);          
//                console.log ('User id : ' + userid + ' message is ' + message)
                if (cardclient) {
                    NS.SendToWebClient(cardclient, TERMINAL, message);
                    return;       
                }                              

			}
		});

		socket.on('close', function (data) {
            Print("Server connection opened " + socket.remoteAddress + ':' + socket.remotePort + "     <============= EMV SERVER CLOSED");        
            NS.emvServer.Connected    = false;
			NS.emvServer.Socket       = null;    
            NS.SendToAllWebClients(TERMINAL, "*CONNECT^EMVSERVER^0*")
		});


		socket.on('error', function (data) {
            Print("Server connection opened " + socket.remoteAddress + ':' + socket.remotePort + "     <============= EMV SERVER ERROR");      
            NS.emvServer.Connected    = false;
			NS.emvServer.Socket       = null;                                
            NS.SendToAllWebClients(TERMINAL, "*CONNECT^EMVSERVER^0*")
		});
	});
    server.on('connection', function (socket) {
        Print("Server connection opened " + socket.remoteAddress + ':' + socket.remotePort + "     <============= EMV SERVER Connected");
        NS.emvServer.Connected    = true;
        NS.emvServer.Socket       = socket;          
        NS.SendToAllWebClients(TERMINAL, "*CONNECT^EMVSERVER^1*")
    });

    Print("EMV Router For Terminals listening on port " + port); 
    server.listen(port);
    return server;
}


function VerifyUser (socket, port, servername, username, password) {
	
    var http = new XMLHttpRequest();

    var url = 'http://' + servername +'/wp-login1.php?action=checkemv&' + 
			  'user_login=' + username + 
			  '&user_password=' + password;

    http.open('POST', url, false);
    
    Print ('Sending request to ' + servername + ' to verify user :' + username + ' password : ' + password);
    
	http.onreadystatechange = function() {

	    if (http.readyState == 4 && http.status == 200) {
        
            Print("recu : *" + http.responseText + "*");
        
            let userid =  http.responseText;
        
            if (userid == '0') 
                {
                    Print("Authentification Failed : " + userid);
                    socket.write(userid + "*LOGIN*KO*")            

                }
                else
                {
                    Print("Authentification Succeeded : " + userid);
                           
                    let connection = NS.GetCardClientFromUserId(userid);
                    if (!connection) {
                        connection = new cardClient(userid, servername, username, password);
                        NS.cardClients.push(connection);
                    }
                    connection.Connected = true;
                    connection.Socket = socket;
                    if (NS.GetWebClientFromUserId(userid)) {
                        socket.write(userid + "*LOGIN*OK*")    
                        NS.SendToWebClient(connection, CARD, "*CONNECT^" + connection.UserID +"^1*", 1);					
                    } else {
                        socket.write(userid + "*LOGIN*KO*")    
                    }
                }
            }
	}
    http.send(null);
}
