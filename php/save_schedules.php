<?php
$savestring = $_POST['content'];
$userid = $_POST['user_id'];
$terminalfolder = $_POST['terminalfolder'];
$terminaltype = $_POST['terminaltype'];

$cwd            =  dirname(getcwd() ,1);
if ($terminaltype === 'Tester') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/tester/files';
}
elseif ($terminaltype === 'Terminal') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/MQL4/Files';
}
else {
    $destdir = $cwd . '/members/' . $userid . '/Projects/' . $terminaltype .'/MQL4/Files/';
}

$fp = fopen($destdir . '/PG_Schedules.csv', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>