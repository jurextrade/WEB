const childprocess = require('child_process'); 
const mysql = Require('mysql');

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



let connection = mysql.createConnection({
    host: 'jurextrade.com',
    user: 'uk4ibca5_jurextrade',
    password: 'sqljurex123',
    database: 'uk4ibca5_jurexdb'
});


connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
});

connection.query('SELECT * FROM 0_users WHERE 1', function (error, results, fields) {
    if (error)
        throw error;

    console.log(results);
});


connection.end(function(err) {
    if (err) {
        return console.log('error:' + err.message);
    }
    console.log('Close the database connection.');
    });
    
    
    // To force the connection close immediately, you can use the destroy() method. 
    // The destroy() method guarantees that no more callbacks or events will be triggered for the connection.

    //connection.destroy();