<?php
  $dname        = isset($_REQUEST['dname']) ? $_REQUEST['dname'] : '';  

  if ($dname === '') {
    if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
      $ipaddress = $_SERVER['REMOTE_ADDR'];
    }
  }
  else {
   $ipaddress = gethostbyname($dname);  
  }
  echo  $ipaddress  
?>