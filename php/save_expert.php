<?php


$userid         = $_REQUEST['user_id'];
$filename       = $_REQUEST['filename'];
$projectfolder  = $_REQUEST['projectfolder'];
$content        = $_REQUEST['content'] ? $_REQUEST['content'] : 'this is content';
$emplacement    = $_REQUEST['emplacement'];

$cwd            =  dirname(getcwd() ,1);

$dir = $cwd . '/members/' . $userid . '/Projects/' . $projectfolder . '/MQL4/' . $emplacement . '/';



$fp = fopen($dir . $filename, 'w');
fwrite($fp, $content);
fclose($fp);
echo $dir . $filename;
?>