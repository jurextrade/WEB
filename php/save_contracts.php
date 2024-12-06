<?php
$savestring = $_POST['content'];
$userid = $_POST['user_id'];
$terminalfolder = $_POST['terminalfolder'];
$symbolname = $_POST['symbolname'];

$cwd            =  dirname(getcwd() ,1);

$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/' . $symbolname;

if (!is_dir ($destdir)) mkdir($destdir, 0777);
if (!is_dir ($destdir . '/contracts')) mkdir($destdir . '/contracts', 0777);


$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder . '/' . $symbolname . '/contracts/' ;


$fp = fopen($destdir . "contracts.txt', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>