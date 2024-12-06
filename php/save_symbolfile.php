<?php
$savestring = $_POST['content'];
$userid = $_POST['user_id'];
$terminalfolder = $_POST['terminalfolder'];
$symbolname = $_POST['symbolname'];
$periodname = $_POST['periodname'];

$cwd            =  dirname(getcwd() ,1);

$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/' . $symbolname;

if (!is_dir ($destdir)) mkdir($destdir, 0777);
if (!is_dir ($destdir . '/history')) mkdir($destdir . '/history', 0777);


$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/' . $symbolname . '/history/' ;



$fp = fopen($destdir . $periodname . '.txt', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>