<?php
$savestring     = $_POST['content'];
$userid         = $_POST['user_id'];
$terminalfolder = $_POST['terminalfolder'];
$terminaltype   = $_POST['terminaltype'];

$cwd            =  dirname(getcwd() ,1);

$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/MQL4/Files';

if ($terminaltype === 'Tester') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/tester/files';
}
if ($terminaltype === 'Yahoo') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/Files';
}

$fp = fopen($destdir . '/PG_Alerts.csv', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>