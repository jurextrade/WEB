<?php
$tablename = isset($_REQUEST['tablename']) ? $_REQUEST['tablename'] : '';  
$fieldname = isset($_REQUEST['fieldname']) ? $_REQUEST['fieldname'] . '=' : '';  
$valuename = isset($_REQUEST['valuename']) ? '\'' . $_REQUEST['valuename']. '\'' : '1';  

$hostname  = 'localhost';
$username  = 'jurextrade';
$password  = 'sqljurex123';
$database  = 'jurexdb';


$con = mysqli_connect($hostname, $username, $password, $database) or die("Error " . mysqli_error($con));

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
  }
// fetch records

$sql = "SELECT * FROM " . $tablename . " WHERE " . $fieldname . $valuename ;

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