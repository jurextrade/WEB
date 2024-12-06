<?php

$userpath      = isset($_REQUEST['userpath']) ? $_REQUEST['userpath'] : "userpath not set";  
$content       = isset($_REQUEST['content']) ? $_REQUEST['content'] : "content not set";  
$filename      = isset($_REQUEST['filename']) ? $_REQUEST['filename'] : "filename not set";  

$cwd            =  dirname(getcwd() ,1);
echo $userpath;  
echo $content;  
echo $filename;  

$historydir = $cwd . $userpath . '/history/';
echo $historydir;  
if (!is_dir ($historydir)) {
    mkdir($historydir, 0777);
    echo $historydir;  
}


$fp = fopen($historydir . $filename, 'w');
fwrite($fp, $content);
fclose($fp);
echo "Username already exists, please try another";  
?>