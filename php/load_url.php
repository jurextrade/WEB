<?php
  $url       = isset($_REQUEST['url']) ? $_REQUEST['url'] : '';  
  $cwd       = dirname(getcwd() ,1);
  $filename  = $cwd . $url;
  

  $content = file_get_contents($filename);
  
  if ($content === false) {
        echo "Error: Could not read the file '{$filename}'.";
    } else {
        echo $content;
    }
  
 
?>