<?php
function deleteDir($path) {
    if (empty($path)) { 
        return false;
    }
    return is_file($path) ?
            @unlink($path) :
            array_map(__FUNCTION__, glob($path.'/*')) == @rmdir($path);
}

$userid         = $_POST['user_id'];
$project_name    = $_POST['project_name'];
$project_folder  = $_POST['project_folder'];
$platform_folder   = $_POST['platform_folder'];

$cwd            =  dirname(getcwd() ,1);


$dir = $cwd . '/members/' . $userid . '/' . $platform_folder . '/' . $project_folder;
if ($userid == '0') return;


deleteDir ($dir);
?>