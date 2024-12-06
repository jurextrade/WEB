<?php
// db settings
$hostname = 'localhost';
$username = 'mt4_progress_co';
$password = 'sqljurex123';
$database = 'mt4_progress_co';

// db connection
$con = mysqli_connect($hostname, $username, $password, $database) or die("Error " . mysqli_error($con));

// fetch records

$sql = "SELECT hsk_type, hsk_ch, hsk_pin, hsk_eng, hsk_pin_s, hsk_eng_s, hsk_ch_s, hsk_gr FROM hsk WHERE 1";
$result = mysqli_query($con, $sql);

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