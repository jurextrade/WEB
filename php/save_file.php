<?php
$userid = $_POST['user_id'];
$savestring = $_POST['content'];
$projectname = $_POST['project_name'];
$filetype = $_POST['file_type'];
$fileoperation = $_POST['file_operation'];
$rule = $_POST['rule'];


$CODE_SS        = 0;
$CODE_CPP       = 1;

$OP_BUY         = 0;
$OP_SELL        = 1;
$OP_BUYSELL     = 2;
$cwd            =  dirname(getcwd() ,1);
$dir = $cwd . '/members/' . $userid . '/Projects/' . $projectname;




if ($fileoperation == $OP_BUYSELL) {
    $fileextension = "BUYSELL";
}
if ($fileoperation == $OP_BUY) {
    $fileextension = "BUY";
}
if ($fileoperation == $OP_SELL) {
    $fileextension = "SELL";
}


if ($filetype == $CODE_SS)      {                  //SC
    
    $filename =  $dir . '/MQL4/Files/input/ss/' . 'R_' . $rule . '_' . $fileextension . '.ss';
}

if ($filetype == $CODE_CPP)      {                  //SC
    
    $filename =  $dir . '/MQL4/Files/input/' . 'R_' . $rule . '.cpp';
}

$fp = fopen( $filename, 'w');
fwrite($fp, $savestring);
fclose($fp);
?>