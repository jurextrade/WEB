

//process.argv[0]                                           // node exec emplacement with repertory
//process.argv[1]                                           // process name with repertory
//require('path').basename(__filename)                        // process name without repertory
//require('path').dirname(process.argv[1])                    // process repertory without name
//__dirname                                                 //process current repertory  same as process.cwd()
//process.cwd()                                               //process current directory
let install_graphql  = function (content) {
    process.chdir('../Server')
    require('child_process').execSync('start cmd.exe /K node MT4Server.js') 
    process.chdir (require('path').dirname(process.argv[1]))    //process change dir
    //process.cwd ()
    process.chdir('../../../')
    var appliname = 'appligraphql'
    if (require('fs').existsSync(appliname))                     // check exist and remove dir
        require('fs').rmdir(appliname, function (err) {
            if (err) console.log('dir not empty')
            else console.log('rmdir ok!')})
    require('fs').mkdir(appliname, function (err) {                // make dir
            if (err) console.log('dir exist')
            else console.log('mkdir ok!')})
    //rename dir
    //require('fs').renameSync('graphql1','graphql');
    process.chdir(appliname)
    process.cwd()
    require('child_process').execSync('npm init --yes')
    require('child_process').execSync('npm i express express-graphql graphql')
    
    require('fs').writeFile('index.js', 'Hello content!', function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
}

