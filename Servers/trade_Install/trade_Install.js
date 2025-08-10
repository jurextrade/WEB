const data = require('./trade_Install.json');
for (var i = 0; i < data.modules.length; i++) {
    Require (data.modules[i])
}

function Require (module) {
    try {
        const myModule = require(module); 
     //   console.log('Module loaded successfully:', module);
        return myModule;

    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error('Error: Module ' + module + ' not found at the specified path.');
            require('child_process').execSync('npm install ' + module);            
        } else {
            console.error('An error occurred during module loading: ' + module, error);
        }
    }
}

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