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
$projectname    = $_POST['project_name'];
$projectfolder  = $_POST['project_folder'];

$cwd            =  dirname(getcwd() ,1);


$dir = $cwd . '/members/' . $userid . '/Projects/' . $projectfolder;
if ($userid == '0') return;
deleteDir ($dir);
?>