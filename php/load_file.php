<?php
  $file       = isset($_REQUEST['file']) ? $_REQUEST['file'] : '';  
  $cwd       = dirname(getcwd() ,1);
  $filename  = $cwd . $file;
  

  $content = file_get_contents($filename);
  
  if ($content === false) {
        echo "Error: Could not read the file '{$filename}'.";
    } else {
        echo $content;
    }
  
 
?>