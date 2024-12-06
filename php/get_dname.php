<?php
  $ipaddress = isset($_REQUEST['ipaddress']) ? $_REQUEST['ipaddress'] : '';  
  
  $dname = gethostbyaddr($ipaddress);
  
  echo  $dname  
?>