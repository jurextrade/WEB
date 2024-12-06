<?php
$userid     = $_POST['user_id'];
$cwd        =  dirname(getcwd() ,1);

$dir = $cwd  . '/members/' . $userid . '/EMV';

$projects = Array ();

foreach (scandir($dir) as $f) {
    if ($f !== '.' and $f !== '..')  {
        $file = $dir . '/' . $f . '/config/' . 'emv.ini';      
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