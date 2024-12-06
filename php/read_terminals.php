<?php
$userid     = $_POST['user_id'];
$cwd        =  dirname(getcwd() ,1);

$dir = $cwd . '/members/' . $userid . '/Terminal';

$terminals = Array ();

foreach (scandir($dir) as $f) {
    if ($f !== '.' and $f !== '..')  {
        $file = $dir . '/' . $f . '/config/' . 'terminal.ini';        
        if (file_exists($file)) {      
            $fp = fopen($file, 'r'); 
            $content = fread ($fp, filesize($file));
            array_push($terminals, json_decode($content));        
            fclose($fp);        
        }
    }
}
echo json_encode($terminals);
?>