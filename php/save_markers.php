<?php
$userid = $_POST['user_id'];
$savestring = $_POST['content'];
$terminalfolder = $_POST['project_folder'];
$terminaltype = $_POST['project_name'];

$cwd            =  dirname(getcwd() ,1);

$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/MQL4/Files';

if ($terminaltype === 'Tester') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/tester/files';
}
if ($terminaltype === 'Yahoo') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/Files';
}
if ($terminaltype === 'project') {
    $destdir = $cwd . '/members/' . $userid . '/Projects/' . $terminalfolder . '/MQL4/Files';
}


$fp = fopen($destdir . '/PG_Markers.sc', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>

