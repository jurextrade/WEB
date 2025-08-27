function Application_Launch (name){       
    let netprogappli  = interface_GetEntity ('netprog_manager', 'Applications', 'Name', name);
    let servermachine = interface_GetEntity ('netprog_manager', 'Machines',     'Name', netprogappli.Machine);       
    let port          = netprogappli.Ports[0];
    let address       = servermachine.IPAddress;
    let server        = solution.GetServerFromMachine(netprogappli.Machine);
    
    let execrepertory = netprogappli.ExecRepertory;
    let execcommand   = netprogappli.ExecCommand;
    let execparameters= netprogappli.ExecParameters;
    
 
    let command = 
    `process.chdir('${execrepertory}')
    require('child_process').exec('start cmd.exe /K ${execcommand} ${execparameters}')`
    
    server.sendmessage (command)
}

