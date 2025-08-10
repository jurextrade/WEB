function Require (module) {
    try {
        const myModule = require(module); 
        return myModule;

    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error('Module ' + module + ' not found at the specified path. Launching npm... please wait');
            try {
                require('child_process').execSync('npm install ' + module);       
                const myModule = require(module); 
                return myModule;                     

            } catch (error) {
                console.error(`Error executing command: ${error.message}`);
            }            
        } else {
            console.error('An error occurred during module loading: ' + module, error);
        }
    }
    return null;
}

const http         = Require('http1');
const https        = Require('https');
const socket       = Require('socket.io');
const fs           = Require('fs');
const childprocess = Require('child_process'); 



var HTTPPort            = 4080;
var SHTTPPort           = 4443;
ListenHTTP(HTTPPort);	
ListenHTTP(SHTTPPort);	

function upload_file (servername, filename, tofilename) {                //http

    let content = Require('fs').readFileSync(filename)    
    
    let url = 'http://' + servername + '/php/upload_file.php';  
     
    let FormData = Require('form-data');
    let formdata = new FormData();
    formdata.append('file',      tofilename);
    formdata.append('content',   content);
  

    require('axios').post(url, formdata, {
        headers: {
            'Content-Type': 'application/octet-stream', // Or the specific MIME type
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    })
    .then(response => {
          var strerror = "UPLOAD " +  filename + " to " + tofilename  + " OK successfully uploaded";
          console.log(strerror);
          console.log (response.data)          

    })
    .catch(error => {
   
          var strerror = "UPLOAD " +  filename + " to " +  tofilename  + " Failed: " + error;    
          console.log(strerror);
    });    
}

async function download_file(servername, filename, tofilename) {

    let url = 'http://' + servername + '/' + filename;  
    try {
      const downloadLink = url;
      const response = await require('axios').get(downloadLink, { responseType: 'arraybuffer' });

      const fileData = Buffer.from(response.data, 'binary');
      
      await Require('fs').writeFileSync(tofilename, fileData);
      
      var strerror = "DOWNLOAD " +  filename + " to " + tofilename  + " OK successfully downloaded";
      console.log(strerror);

    } catch (error) {
      
        var strerror = "DOWNLOAD " +  filename + " to " +  tofilename  + " Failed: " + error;    
        console.log(strerror);        

    }
}


//upload_file ('jurextrade.com', './trade_Install.json', '/Servers/trade_Install.json')
//download_file('jurextrade.com', 'members/1/Projects/DemoProject/MQL4/Experts', './trade_Install.json');


function send (servername, message, onrecvcallback, values)  {

    let url = 'http://' + servername + '/php/solution_dialog.php';  
    let par =  new URLSearchParams({ message: JSON.stringify(message) }).toString();


    Require('axios').post(url,  new URLSearchParams({ message: JSON.stringify(message) }), {
        headers: 'application/x-www-form-urlencoded',
             })
        .then(response => {

            if (onrecvcallback) { 
               onrecvcallback (response.data, values);
            } else {
                
            }            
        })
        .catch(error => {
            console.error('Error send axios:', error);
        });
}    

class npfile {
    constructor (cname, rname, name, folder, type) {
        this.Entity  = null;
        this.Content = '';
        this.Folder  = folder;
        this.Name    = name;
        this.CName   = cname;
        this.RName   = rname;
        this.Loaded  = false;
        this.Type    = type ? type : 'file';
    }
}

function files_explore  (servername, filenode, levels) {

    let type   = filenode.Type;
    let name   = filenode.Name
    let cname  = filenode.CName // .replace(/\\/g, '/'); 
    let folder = filenode.Folder//  .replace(/\\/g, '/'); 
    let rname  = filenode.RName // .replace(/\\/g, '/'); 
    
    let file;

    
    if (type == 'file') {

        file = new npfile (cname, rname, name, folder)
        download_file (servername, file.RName, process.cwd() + '/' + file.Name)       
  
    } else {
        file = new npfile (cname, rname, name, folder, 'folder')
        levels[0]++;
  
        try {
            Require('fs').mkdirSync( process.cwd() + '/' + file.Name)

        } catch (err) {
            if (err.code === 'EEXIST') {
//                 console.log('Directory already exists.');
            } else {
                console.error('Error creating directory:', err);
                return;                
            }
        }
        try {
            process.chdir(file.Name);

        } catch (err) {
            console.error('Error changing directory:', err);
            return;
        }
        filenode.Files.sort (function (a, b) {
            let x = a.Type;
            let y = b.Type;
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;                    
        })      
        for (var index = 0; index < filenode.Files.length; index++) {
            files_explore(servername, filenode.Files[index], levels)
        }
        levels[0]--;      
        process.chdir('..');  
    }
}


send ('localhost', {Name: 'scandir_r', Values: ['conf', '']}, function (content, values) {
    let fileexplorer = content.Values[0]
    files_explore (values[0], fileexplorer, [0])
    }, 
    ['localhost'])

  

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

    let io = socket(server, {cors: {origin: origin, credentials: true}});

    io.on('connection', function (socket) {

		console.log('<==== HTTP CONNECTION : ' + socket.handshake.address);


		socket.on('message', function (message) {
            exec_command(socket, message);
		});


		socket.on('close', function (data) {
			console.log("CLOSE HTTP Patform connection closed");
		});
		
		socket.on('disconnect',
            (reason) => {
		
				console.log (" DISCONNECT HTTP Socket : " + socket.handshake.address + " Reason : " + reason);   
            });	
		socket.on('error',
			function(data) {
				console.log (" CLOSED HTTP Socket on Error : " + socket.handshake.address );    			
			});		
    });
    console.log("HTTP listening on port " + port);
    server.listen(port);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function exec_command (socket, message) {
    var nodemessage = JSON.parse (message);
    console.log (nodemessage);
    try {
        nodemessage.return =  'ok: ' +  eval(nodemessage.command)
    } catch (error) {
        if (error instanceof SyntaxError) {
            nodemessage.return = 'SyntaxError: ' + error.message;
        } else 
        if (error instanceof ReferenceError) {
            nodemessage.return = 'ReferenceError: ' + error.message;
        } else 
        if (error instanceof RangeError) {
            nodemessage.return = 'RangeError: ' + error.message;
        } else 
        if (error instanceof TypeError) {
            nodemessage.return = 'TypeError: ' + error.message;
        } else 
        if (error instanceof URIError) {
            nodemessage.return = 'URIError: ' + error.message;
        } else 
        {
            nodemessage.return = 'Which Error!!  : ' + error.message;            
            //  throw error;
        }

    }
    socket.emit ('message', JSON.stringify (nodemessage, null, 2));   

 /*
  
    return childprocess.exec (message,  (err, stdout, stderr) => {
		if (err) {
			console.log('exec error!');
            socket.emit ('message', stderr)
			return 1;
		}
        socket.emit ('message', stdout)
		console.log ('exc ok!');	
		return 1;
	})
*/    
}

function exec_detach (socket, message) {
    
    let process = childprocess.spawn(message);
    let data = '';
    let error = '';

    process.stdout.on('data', stdout => {
        socket.emit ('message', stdout)
    });
    
    process.stderr.on('data', stderr => {
        socket.emit ('message', stderr)
    });

    process.on('error', err => {
      console.log(err);
    })
    
    process.on('close', code => {
        if (code !== 0) {
            console.log(error)
        } else {
            console.log(data)
        }
        process.stdin.end();
    });
}
