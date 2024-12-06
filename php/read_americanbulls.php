<?php
$ticker = $_POST['ticker'];
$content = file_get_contents('https://www.americanbulls.com/m/SignalPage.aspx?lang=en&Ticker=' . $ticker);
//$content = 'https://www.americanbulls.com/SignalPage.aspx?lang=en&Ticker=' . $ticker;

echo  $content  
?>