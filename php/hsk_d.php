<?php
// db settings
$hostname = 'lhcp3204.webapps.net'; //localhost
$username = 'uk4ibca5_jurexdb'; //uk4ibca5_jurexdb
$password = 'sqljurex123';
$database = 'uk4ibca5_jurexdb'; //mt4_progress_co
$port     =  '3306';
// db connection
$con = mysqli_connect($hostname, $username, $password, $database, $port) or die("Error " . mysqli_error($con));
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
  }
// fetch records

$sql = "SELECT hsk_type, hsk_ch, hsk_pin, hsk_eng, hsk_pin_s, hsk_eng_s, hsk_ch_s, hsk_gr FROM hsk WHERE 1";
$result = mysqli_query($con, $sql);

//echo "Returned rows are: " . $result -> num_rows;

while($row = mysqli_fetch_assoc($result)) {
    $array[] = $row;
}

$dataset = array(
    "echo" => 1,
    "recordsTotal" => count($array),
    "data" => $array
);

echo json_encode($dataset);
?>