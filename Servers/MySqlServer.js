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

let mysql = Require('mysql');



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