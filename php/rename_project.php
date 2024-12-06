<?php
$userid = $_POST['user_id'];
$projectname = $_POST['project_name'];
$projectfolder = $_POST['project_folder'];

$newprojectfolder = $_POST['project_folder'];


$cwd            =  dirname(getcwd() ,1);

$dir = $cwd  . '/members/' . $userid . '/Projects/' . $projectfolder;


$content = "{\r\n\t\"Name\": \"" . $projectname . "\",\r\n\t\"Path\": \"" . $projectname . "\"\r\n}";


$fp = fopen($dir . '/config/project.ini', 'w');
fwrite($fp, $content);
fclose($fp);

$strategiesfile = $dir . '/MQL4/Files/PG_Strategies.csv';

// read into array
$arr = file($strategiesfile);

// edit first line
$arr[0] = $projectname . PHP_EOL;

// write back to file
file_put_contents($strategiesfile, implode($arr));


rename ($dir,  $cwd  . '/members/' . $userid . '/Projects/' .$projectname);

?>