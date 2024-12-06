var net = require('net');
var http = require('https');
var moment = require('moment');
var util = require('util');
var chalk = require('chalk');
var ServerIP           = "127.0.0.1"; //"47.241.22.29";
var ServerPort			   = 2008;
var ServerSocket 	   = null;
var contractdetailsresult = [];
var ReqId = 100;
var Periods = ['1 min', '5 mins','15 mins', '30 mins', '1 hour', '4 hours', '1 day', '1 week', '1 month'];
var Duration = ['1 M', '1 M','1 M', '1 M', '1 Y', '1 Y', '5 Y', '5 Y', '5 Y'];
var j = 110;

function IBSymbol(name, reqid) {
	this.Ticker = name;
	this.Name = name;
	this.Contracts = [];
	this.ReqId = reqid;
	this.NbrContracts = 0;
	this.Buffer = [];
}

function IB() {
    this.ServerIP = ServerIP;
    this.ServerPort = 2008;
    this.Symbols = [];
	this.Client = null;
	this.IBServer = null;

    this.GetSymbolFromReqId = function (ReqId) {
		for (var i = 0; i < this.Symbols.length; i++) {
			var symbol = this.Symbols[i];
			if (symbol.ReqId == ReqId)
				return symbol;
		}
		return null;
	},


    this.GetSymbolFromName = function (name) {
		for (var i = 0; i < this.Symbols.length; i++) {
			var symbol = this.Symbols[i];
			if (symbol.Name == name)
				return symbol;
		}
		return null;
	},
	this.AddSymbol = function (symbol) {
		var ibsymbol = this.GetSymbolFromName (symbol);
		if (!ibsymbol) {
			ibsymbol = new IBSymbol(symbol,  this.Symbols.length + 1);
			this.Symbols.push (ibsymbol);
		}		
		return ibsymbol;
		
	},
	this.SendToClient = function (message) {
		if (!this.Client) { 
			this.ConnectToServer ();
		}
		if (this.Client) 
			this.Client.write(message);
		else
			console.log ("Je ne peux pas : " + this.Client);
	},

	this.ConnectToServer = function (ibsession) {
		this.Client = net.createConnection(this.ServerPort, this.ServerIP);
	
		this.Client.on('connect', function (socket) {
			console.log("To Server connection opened ");
			ibsession.SendToClient("*LOGIN^ANY^admin^stephgaby^XXXXXX^Jureidini Gabriel^Interactive Brokers^//IB^0*");
		});
	
		this.Client.on('data', function (data) {
			var message = String.fromCharCode.apply(null, data);
			console.log(message);	
			var values = message.split('^');
			
			if (values[0] == "*GET_HISTORY") {
				var symbol = values[1];
				var ibsymbol = ibsession.AddSymbol (symbol);
				ibsession.IBServer.cancelMktData(ibsymbol.ReqId);				
				ibsymbol.Buffer = [];
				ibsession.IBServer.reqHistoricalData(ibsymbol.ReqId, ibsession.IBServer.contract.stock(symbol,'SMART','USD'), '', Duration[+(values[2].charAt(1))], Periods[+(values[2].charAt(1))], 'TRADES', 1, 1, false);
			}
			else
			if (values[0] == "*GET_CONTRACTDETAILS") {
				var symbol = values[1];
				var price = values[2];
				var ibsymbol = ibsession.AddSymbol (symbol);
				if (ibsymbol.NbrContracts != 0) { 
					for (var i = 0; i < ibsymbol.NbrContracts; i++) {
						ibsession.IBServer.cancelMktData(ibsymbol.ReqId * 1000 + i);
					}
					ibsymbol.NbrContracts = 0;
				}		

				
				ibsession.IBServer.cancelMktData(ibsymbol.ReqId);
				ibsession.IBServer.reqMktData(ibsymbol.ReqId, ibsession.IBServer.contract.stock(symbol, 'SMART','USD'), '', false, false);			
				ibsession.IBServer.reqContractDetails(ibsymbol.ReqId, ibsession.IBServer.contract.option(symbol, '', 0, ''));			
				/*
				for (var i = 1; i < 100; i++) {
					IB.reqContractDetails(i, IB.contract.option(symbol, '2023', i, 'C'));			
					IB.reqContractDetails(i+100, IB.contract.option(symbol, '2023', i, 'P'));			
				}		
	*/					
			}
			else
			if (values[0] == "*GET_TICKOPTIONCOMPUTATION") {
				var symbol = values[1];
				var reqid = +values[2];
				var expiry = values[3];
				var strike = +values[4];
				var right  = values[5];	
				ibsession.IBServer.reqMktData(reqid, IB.contract.option(symbol, expiry, strike, right), '', false, false);	
			}
		});
	
	
		this.Client.on('error', function (data) {
			console.log("Connexion erreur avec le serveur");
		});
	
	
		this.Client.on('close', function (data) {
			console.log("Connexion coupee avec le serveur");
		});
		
		return this.Client;
	},
	this.Connect = function (ibsession) {
		var ib = new (require('ib'))();


		ib.on('connected', function () {
			console.log(chalk.inverse('CONNECTED'));
		})


		ib.on('disconnected', function () {
			console.log(chalk.inverse('DISCONNECTED'));
		})
		
		ib.on('received', function (tokens) {
//			var result = JSON.stringify(tokens);
//			console.info('%s %s', chalk.cyan('<<< RECV <<<'), result);

		})

		ib.on('sent', function (tokens) {
			console.info('%s %s', chalk.yellow('>>> SENT >>>'), JSON.stringify(tokens));
		})

		ib.on('server', function (version, connectionTime) {
			console.log(chalk.inverse(util.format('Server Version: %s', version)));
			console.log(chalk.inverse(util.format('Server Connection Time: %s', connectionTime)));
		})

		ib.on('error', function (err) {
			console.error(chalk.red(util.format('@@@ ERROR: %s @@@', err.message)));
		})
		ib.on('result', function (event, args) {
//			console.log(chalk.green(util.format('======= %s =======', event)));
	/*	  
			args.forEach(function (arg, i) {
			console.log('%s %s',
				chalk.green(util.format('[%d]', i + 1)),
				JSON.stringify(arg)
			);
			});
	*/	  
		})
	

		ib.on('historicalData', function (reqId, date, open, high, low, close, volume, barCount, WAP, hasGaps) {
			var symbol = ibsession.GetSymbolFromReqId (reqId);
			if (!symbol) return;
			if (symbol.Buffer.length == 0) {
				symbol.Buffer = '[{ "date" : "' + date + '", "open" : ' + open + ', "low" : ' + low + ', "high" : ' + high + ', "close" : ' + close + ', "volume" : ' + volume + '}';
				return;
			}
			if (date.startsWith("finished")) {
				symbol.Buffer += ']';
				ibsession.SendToClient ('*HISTORY^' + reqId + '^'  + symbol.Buffer + '*');
				console.log ("Sending HISTORY to client " + reqId + " " + symbol.Name);
			}
			else
				symbol.Buffer += ',{ "date" : "' + date + '", "open" : ' + open + ',"low" : ' + low + ',"high" : ' + high + ',"close" : ' + close + ', "volume" : ' + volume + '}';
		})

		ib.on('contractDetails', function (reqId, contract) {
			var symbol = ibsession.GetSymbolFromReqId (reqId);
			if (!symbol) return;
						
			ibsession.SendToClient ('*CONTRACTDETAILS^' +  reqId + '^'  + JSON.stringify(contract) + '*');		
			console.log ("Sending CONTRACTDETAILS to client " + reqId + " " + symbol.Name);			
			ibsession.IBServer.reqMktData(symbol.ReqId * 1000 + symbol.NbrContracts, ibsession.IBServer.contract.option(symbol.Name, contract.summary.expiry, contract.summary.strike, contract.summary.right), '', false, false);			
			symbol.NbrContracts++;
		})
		
		ib.on('contractDetailsEnd', function (reqId) {
			var symbol = ibsession.GetSymbolFromReqId (reqId);
			if (!symbol) return;

			ibsession.SendToClient ('*CONTRACTDETAILS^' +  reqId + '^'  + "END" + '*');		
			console.log ("Finish Sending CONTRACTDETAILS to client " + reqId + " " + symbol.Name);			
		})
		
		ib.on('tickOptionComputation', function (tickerId, tickType, impliedVol, delta, optPrice, pvDividend, gamma, vega, theta, undPrice) {

			ibsession.SendToClient ('*TICKOPTIONCOMPUTATION^' + tickerId + '^'  + impliedVol + '^'  + delta + '^'  + optPrice + '^'  + pvDividend + '^'  + gamma + '^'  + vega + '^'  + theta + '^'  + undPrice + '*');		
			console.log ("Sending TICKOPTIONCOMPUTATION to client " + tickerId);	
			}
		)		
		ib.on('tickPrice', function (tickerId, tickType, price, canAutoExecute) {
			ibsession.SendToClient ('*PRICE^' +  tickerId + '^'  + ib.util.tickTypeToString(tickType) + '^' + price + '*');					
		})

		ib.on('tickSize', function (tickerId, sizeTickType, size) {
			ibsession.SendToClient ('*SIZE^' +  tickerId + '^'  +  ib.util.tickTypeToString(sizeTickType) +  '^' + size + '*');		
		})		

		ib.on('tickEFP', function (tickerId, tickType, basisPoints, formattedBasisPoints, impliedFuturesPrice, holdDays, futureExpiry, dividendImpact, dividendsToExpiry) {
			console.log(
			'%s %s%d %s%d %s%s %s%d %s%d %s%s %s%d %s%d',
			chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
			chalk.bold('tickerId='), tickerId,
			chalk.bold('basisPoints='), basisPoints,
			chalk.bold('formattedBasisPoints='), formattedBasisPoints,
			chalk.bold('impliedFuturesPrice='), impliedFuturesPrice,
			chalk.bold('holdDays='), holdDays,
			chalk.bold('futureExpiry='), futureExpiry,
			chalk.bold('dividendImpact='), dividendImpact,
			chalk.bold('dividendsToExpiry='), dividendsToExpiry
			);
		})

		ib.on('tickGeneric', function (tickerId, tickType, value) {
			console.log(
			'%s %s%d %s%d',
			chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
			chalk.bold('tickerId='), tickerId,
			chalk.bold('value='), value
			);
		})


		ib.on('tickString', function (tickerId, tickType, value) {
			/*
			console.log(
			'%s %s%d %s%s',
			chalk.cyan(util.format('[%s]', ib.util.tickTypeToString(tickType))),
			chalk.bold('tickerId='), tickerId,
			chalk.bold('value='), value
			);
			*/	  
		})
	

		ib.connect();
		this.IBServer = ib;
		return ib;
	}
}



 	

var IBSession  = new IB ();
IBSession.Connect(IBSession);
IBSession.ConnectToServer (IBSession);
IBSession.IBServer.reqMarketDataType (2);
/*
.calculateImpliedVolatility(reqId, contract, optionPrice, underPrice)
.calculateOptionPrice(reqId, contract, volatility, underPrice)
.cancelAccountSummary(reqId)
.cancelAccountUpdatesMulti(requestId)
.cancelCalculateImpliedVolatility(reqId)
.cancelCalculateOptionPrice(reqId)
.cancelFundamentalData(reqId)
.cancelHistoricalData(tickerId)
.cancelMktData(tickerId)
.cancelMktDepth(tickerId)
.cancelNewsBulletins()
.cancelOrder(id)
.cancelPositions()
.cancelPositionsMulti(requestId)
.cancelRealTimeBars(tickerId)
.cancelScannerSubscription(tickerId)
.cancelTickByTickData(tickerId)
.exerciseOptions(tickerId, contract, exerciseAction, exerciseQuantity, account, override)
.placeOrder(id, contract, order)
.replaceFA(faDataType, xml)
.reqAccountSummary(reqId, group, tags)
.reqAccountUpdates(subscribe, acctCode)
.reqAccountUpdatesMulti(requestId, account, modelCode, ledgerAndNLV)
.reqAllOpenOrders()
.reqAutoOpenOrders(bAutoBind)
.reqContractDetails(reqId, contract)
.reqCurrentTime()
.reqExecutions(reqId, filter)
.reqFundamentalData(reqId, contract, reportType)
.reqGlobalCancel()
.reqHistoricalData(tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate)
.reqHistoricalTicks(tickerId, contract, startDateTime, endDateTime, numberOfTicks, whatToShow, useRTH, ignoreSize)
.reqTickByTickData(tickerId, contract, tickType, numberOfTicks, ignoreSize)
.reqIds(numIds)
.reqManagedAccts()
.reqMarketDataType(marketDataType)
.reqMktData(tickerId, contract, genericTickList, snapshot, regulatorySnapshot)
.reqMktDepth(tickerId, contract, numRows)
.reqNewsBulletins(allMsgs)
.reqOpenOrders()
.reqPositions()
.reqPositionsMulti(requestId, account, modelCode)
.reqRealTimeBars(tickerId, contract, barSize, whatToShow, useRTH)
.reqScannerParameters()
.reqScannerSubscription(tickerId, subscription)
.requestFA(faDataType)
.queryDisplayGroups(reqId)
.subscribeToGroupEvents(reqId, group)
.unsubscribeToGroupEvents(reqId)
.updateDisplayGroup(reqId, contract)
.setServerLogLevel(logLevel)
*/
//.contract.option(symbol, expiry, strike, right, exchange, currency)
//.contract.stock(symbol, exchange, currency)
//	ib.reqMktData(21, ib.contract.option('TECK', '20200619', 12, 'C'), '', false, false);
//	ib.reqMktData(22, ib.contract.option('SLV', '2020', 13, 'P'), '', false, false);
//	ib.reqMktData(23, ib.contract.option('SLV', '2021', 13, 'P'), '', false, false);
//	ib.reqMktData(24, ib.contract.option('SLV', '2022', 13, 'P'), '', false, false);
//	ib.reqMktData(25, ib.contract.option('SLV', '2021', 14, 'P'), '', false, false);
//	ib.reqMktData(26, ib.contract.option('SLV', '2020', 14, 'P'), '', false, false);	
//	ib.reqMktData(27, ib.contract.option('SLV', '2020', 60, 'P'), '', false, false);	

// tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate


	//ib.reqHistoricalData(1, ib.contract.stock('SLV','SMART','USD'), '', '5 D', '1 hour', 'TRADES', 1, 1, false);
	//ib.reqMktData(23, ib.contract.option('AGQ', '202006', 22, 'C'), '', false, false);
//	ib.reqContractDetails(24, ib.contract.option('AGQ', '2020', 22, 'C'));
	//ib.reqContractDetails(25, ib.contract.option('SLV', '2020', 22, 'C'));	