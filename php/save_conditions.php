<?php
$userid = $_POST['user_id'];
$savestring = $_POST['content'];
$projectfolder = $_POST['project_folder'];

$cwd            =  dirname(getcwd() ,1);
$dir = $cwd . '/members/' . $userid . '/Projects/' . $projectfolder;


$fp = fopen($dir . '/MQL4/Files/input/ss/' . 'PG_Logicals.ss', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>