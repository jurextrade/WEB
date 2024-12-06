<?php
$savestring = $_POST['content'];
$fp = fopen('../Terminal/MQL4/Files/PG_News.csv', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>