<?php
  $url       = isset($_REQUEST['url']) ? $_REQUEST['url'] : '';  

  $content = file_get_contents($url);
  echo  $content  
?>