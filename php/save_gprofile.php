<?php
$savestring = $_POST['content'];
$userid = $_POST['user_id'];
$fp = fopen('../members/' . $userid . '/PG_Profile.txt', 'w');
fwrite($fp, $savestring);
fclose($fp);
?>