<?php
$tablename = isset($_REQUEST['tablename']) ? $_REQUEST['tablename'] : '';  
$fieldname = isset($_REQUEST['fieldname']) ? $_REQUEST['fieldname'] . '=' : '';  
$valuename = isset($_REQUEST['valuename']) ? '\'' . $_REQUEST['valuename']. '\'' : '1';  


$hostname  = $_SERVER['HTTP_HOST'];
$database  = ($hostname == 'www.jurextrade.com') ? 'uk4ibca5_' .'jurexdb' : 'jurexdb';
$username  = ($hostname == 'www.jurextrade.com') ? 'uk4ibca5_' . 'jurextrade' : 'jurextrade';
$hostname = 'localhost';
$password  = 'sqljurex123';


$con = mysqli_connect($hostname, $username, $password, $database); // or die("Error " . mysqli_error($con));

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
  }
// fetch records

$sql = "SELECT * FROM " . $tablename . " WHERE " . $fieldname . $valuename ;

$result = mysqli_query($con, $sql);

//echo "Returned rows are: " . $result -> num_rows;

while($row = mysqli_fetch_assoc($result)) {
    //$row["hsk_id"]   = mb_convert_encoding($row["hsk_id"] , 'UTF-8', 'ISO-8859-1');
    //$row["hsk_ch"]   = mb_convert_encoding($row["hsk_ch"] , 'UTF-8', 'ISO-8859-1');
    //$row["hsk_ch_s"] = mb_convert_encoding($row["hsk_ch_s"] , 'UTF-8', 'ISO-8859-1');
   // echo  $row["hsk_id"];
   // echo  $row["hsk_ch"];
   // echo  $row["hsk_ch_s"];


    $array[] = $row;
}

$dataset = array(
    "echo" => 1,
    "recordsTotal" => count($array),
    "data" => $array
);

try {
    $json = json_encode($dataset, JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_IGNORE);

    echo $json;

} catch (JsonException $e) {

    echo "JSON encoding error: " . $e->getMessage();
}

//echo json_encode($dataset, JSON_UNESCAPED_UNICODE);

?>