<?php
$userid = $_POST['user_id'];
$projectfolder = $_POST['project_folder'];

$cwd            =  dirname(getcwd() ,1);

$dir = $cwd . '/members/' . $userid . '/Projects/' . $projectfolder . '/MQL4/Experts';

$dir = opendir($dir);
while ($file = readdir($dir)) {
    if ($file == '.' || $file == '..') {
        continue;
    }

    echo $file . ',';
}
closedir($dir);
?>