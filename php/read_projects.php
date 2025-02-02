<?php
$user_id     = $_POST['user_id'];
$platform_folder   = $_POST['platform_folder'];
$platform_pname   = $_POST['platform_pname'];
$cwd        =  dirname(getcwd() ,1);


$dir = $cwd  . '/members/' . $user_id . '/' . $platform_folder;

$projects = Array ();

foreach (scandir($dir) as $f) {
    if ($f !== '.' and $f !== '..')  {
        $file = $dir . '/' . $f . '/config/' . $platform_pname . '.ini';      
        if (file_exists($file)) {      
            if (filesize ($file) != 0) {
                $fp = fopen($file, 'r'); 
                $content = fread ($fp, filesize($file));
                array_push($projects, json_decode($content));     
                fclose($fp);        
            } else {
                
            }
        }
    }
}
echo json_encode($projects);
?>