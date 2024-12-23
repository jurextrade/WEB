<?php
header('Content-Type: application/json charset=UTF-8');


$request = isset($_REQUEST['message']) ? $_REQUEST['message'] : "message not set";  

$message = json_decode($request , false);

$messagename   = $message->Name;
$messagevalues = $message->Values;



class Message {
    public $Name;
    public $Values = Array();
    public $Error = false;
}

class Node {
  public $Name;
  public $Type;               // file or dir
  public $Files = Array();    // for dir
}

$returnmessage = new Message();
$returnmessage->Name = $message->Name;



switch ($messagename) {
    case 'getdir':
        array_push($returnmessage->Values, getcwd());        
        echo json_encode($returnmessage);
    break;

    case 'changedir':
        $userpath     = $messagevalues[0];
        $dirname      = $messagevalues[1];

        chdir ($_SERVER['DOCUMENT_ROOT'] . "/" . $userpath);
        $cwd = getcwd();

        $dir = $cwd . "/" . $dirname;
        chdir($dir);
        $cwd            =  getcwd();

        array_push($returnmessage->Values, $cwd);        
        echo json_encode($returnmessage);
    break;  

    case 'makedir':
        $userpath     = $messagevalues[0];
        $dirname      = $messagevalues[1];

        chdir ($_SERVER['DOCUMENT_ROOT'] . "/" . $userpath);
        $cwd = getcwd();

        $dir = $cwd;

        if ($dirname != '.') {
            $dir = $cwd . "/" . $dirname;
        }

        if (!is_dir ($dir)) {
            mkdir($dir, 0777);
            array_push($returnmessage->Values, $dir);        
        } else {
            $returnmessage->Error = true;
            array_push($returnmessage->Values, "Already exist");             
        }        
        echo json_encode($returnmessage);
    break;

    case 'deletedir':
        $userpath     = $messagevalues[0];
        $dirname      = $messagevalues[1];

        chdir ($_SERVER['DOCUMENT_ROOT'] . "/" . $userpath);
        $cwd = getcwd();

        $dir = $cwd;
        if ($dirname != '.') {
            $dir = $cwd . "/" . $dirname;
        }

        if (is_dir ($dir)) {
            deleteDir ($dir);    
            array_push($returnmessage->Values, "ok");        
        } else {
            $returnmessage->Error = true;
            array_push($returnmessage->Values, "dir not existing");        
        }
        echo json_encode($returnmessage);
    break;

    case 'scandir_r' :
        $userpath     = $messagevalues[0];
        $dirname      = $messagevalues[1];

        chdir ($_SERVER['DOCUMENT_ROOT'] . "/" . $userpath);
        $cwd = getcwd();

        $dir = $cwd;

        if ($dirname != '.') {
            $dir = $cwd . "/" . $dirname;
        }

        if ($dirname == '.') {
            $dirname = "";
        }

        $node = scanDir_r ($dir, $dirname);
        array_push($returnmessage->Values, $node) ;
        echo json_encode($returnmessage);
    break;  

    case 'scandir':
        $userpath     = $messagevalues[0];
        $dirname      = $messagevalues[1];

        chdir ($_SERVER['DOCUMENT_ROOT'] . "/" . $userpath);
        $cwd = getcwd();

        if ($dirname != '.') {
            $dir = $cwd . "/" . $dirname;
        }

        if (is_dir ($dir)) {
            foreach (scandir($dir) as $f) {
            if ($f !== '.' and $f !== '..')  {
                array_push($returnmessage->Values, $f);    
            }
            }
        } else {
            $returnmessage->Error = true;
            array_push($returnmessage->Values, "dir not existing");      
        }
        echo json_encode($returnmessage);
    break;  

    case 'savefile':

        $filename      = $messagevalues[0];  
        $content       = $messagevalues[1]; 
//        if (file_exists($filename)) {  

            $fp = fopen($filename, 'w');
            fwrite($fp, $content);
            fclose($fp);
            array_push($returnmessage->Values, "ok");  
//        } else {
//            $returnmessage->Error = true;
//            array_push($returnmessage->Values,  'unexisting file' . $filename);     
//        }              
        echo json_encode($returnmessage);     
    break;

    case 'readfile':
        
        $filename      = $messagevalues[0];  

        $content = "";
        if (file_exists ($filename)) {   
            if (filesize ($filename) != 0) {
                $fp = fopen($filename, 'r'); 
                $content = fread ($fp, filesize($filename));
                fclose($fp);      
            }
           
            $node = new Node ();
            $info          = new SplFileInfo($filename);        
            $node->Name    = $info->getFilename();
            $node->CName   = $filename;      
            $node->Folder  = $info->getPath();      
            $node->Content = $content;  
            $node->Type    = "file";   

            array_push($returnmessage->Values, $node);        
        } else {
            $returnmessage->Error = true;
            array_push($returnmessage->Values,  'unexisting file' . $filename);     
        }

        echo json_encode($returnmessage); 
    break;

    case 'deleteFile':
        $filename      = $messagevalues[0];  
        $status = unlink($filename);    

        if ($status) {  
            array_push($returnmessage->Values,  "File deleted successfully");
        } else {  
            $returnmessage->Error = true;
            array_push($returnmessage->Values, 'unexisting file' . $filename);   
        }         
        echo json_encode($returnmessage);     
    break;

    default:
        echo "unknown message";
    return;
}



function path_lastdir($p) {
    $p=str_replace('\\','/',trim($p));
    if (substr($p,-1)=='/') $p=substr($p,0,-1);
    $a=explode('/', $p);
    return array_pop($a);
}

function scanDir_r ($source, $sourcedir) {
  // Check for symlinks
  $node = null;

  if (is_link($source)) {
      return null;
  }
 
  // Simple copy for a file
  if (is_file($source)) {
      $info         = new SplFileInfo($source);    
      $node         = new Node ();
      $node->Root   = $_SERVER['DOCUMENT_ROOT'];           
      $node->Name   = $info->getFilename(); //$source;      
      $node->CName  = $info->getPathName();
      $node->Folder = $info->getPath();
      $node->Type   = 'file';
 
      return $node;
  }
  $lastdir =  path_lastdir($source);
  $sdir    = $sourcedir . "/" . $lastdir;

  $dir  = dir($source);


  // Loop through the folder

  $node = new Node ();
  $node->Root   = $_SERVER['DOCUMENT_ROOT'];    
  $node->Name   = $lastdir;  
  $node->CName  = $sdir;
  $node->Type   = 'dir';
  $node->Folder = $sourcedir;

  
  while (false !== $entry = $dir->read()) {

      if ($entry == '.' || $entry == '..') {
          continue;
      }
      array_push($node->Files, scanDir_r("$source/$entry", "$sdir"));
  }

  // Clean up
  $dir->close();
  return $node;
}

function deleteDir($path) {
  if (empty($path)) { 
      return false;
  }
  return is_file($path) ?
          @unlink($path) :
          array_map(__FUNCTION__, glob($path.'/*')) == @rmdir($path);
}

function copyDir_r ($source, $dest) {
  // Check for symlinks
  if (is_link($source)) {
      return symlink(readlink($source), $dest);
  }
  
  // Simple copy for a file
  if (is_file($source)) {
      return copy($source, $dest);
  }

  // Make destination directory
  if (!is_dir($dest)) {
      mkdir($dest);
  }

  // Loop through the folder
  $dir = dir($source);
  while (false !== $entry = $dir->read()) {
      // Skip pointers
      if ($entry == '.' || $entry == '..') {
          continue;
      }

      // Deep copy directories
      copyDir_r("$source/$entry", "$dest/$entry");
  }

  // Clean up
  $dir->close();
  return true;
}

?>