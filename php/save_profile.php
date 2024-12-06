<?php
$savestring = $_POST['content'];
$userid = $_POST['user_id'];
$terminalfolder = $_POST['terminalfolder'];
$terminaltype = $_POST['terminaltype'];

$cwd            =  dirname(getcwd() ,1);

if ($terminaltype === 'Terminal') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/MQL4/Files';
}
else
if ($terminaltype === 'Tester') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/tester/files';
}
else  {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/Files';
}

$fp = fopen($destdir . '/PG_Profile.txt', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>