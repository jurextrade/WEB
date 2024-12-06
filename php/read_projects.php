<?php
$userid     = $_POST['user_id'];
$cwd        =  dirname(getcwd() ,1);

$dir = $cwd  . '/members/' . $userid . '/Projects';

$projects = Array ();

foreach (scandir($dir) as $f) {
    if ($f !== '.' and $f !== '..')  {
        $file = $dir . '/' . $f . '/config/' . 'project.ini';      
        if (file_exists($file)) {      
            $fp = fopen($file, 'r'); 
            $content = fread ($fp, filesize($file));
            array_push($projects, json_decode($content));     
            fclose($fp);        
        }
    }
}
echo json_encode($projects);
?>