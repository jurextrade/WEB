<?php
$userid = $_POST['user_id'];
$projectname = $_POST['project_name'];
$projectfolder = $_POST['project_folder'];

$cwd            =  dirname(getcwd() ,1);

$dir = $cwd  . '/members/' . $userid . '/Projects/' . $projectfolder;

if (!is_dir ($dir)) mkdir($dir, 0777);


if (!is_dir ($dir . '/MQL4'))                     mkdir($dir . '/MQL4', 0777);
if (!is_dir ($dir . '/MQL4/Libraries'))           mkdir($dir . '/MQL4/Libraries', 0777);
if (!is_dir ($dir . '/MQL4/Experts'))             mkdir($dir . '/MQL4/Experts', 0777);
if (!is_dir ($dir . '/MQL4/Indicators'))          mkdir($dir . '/MQL4/Indicators', 0777);

if (!is_dir ($dir . '/MQL4/Files'))          mkdir($dir . '/MQL4/Files', 0777);
if (!is_dir ($dir . '/MQL4/Files/input'))    mkdir($dir . '/MQL4/Files/input', 0777);
if (!is_dir ($dir . '/MQL4/Files/output'))   mkdir($dir . '/MQL4/Files/output', 0777);
if (!is_dir ($dir.  '/MQL4/Files/input/ss')) mkdir($dir . '/MQL4/Files/input/ss', 0777);

if (!is_dir ($dir . '/config'))   mkdir($dir . '/config', 0777);

$content = "{\r\n\t\"Name\": \"" . $projectname . "\",\r\n\t\"Path\": \"" . $projectfolder . "\"\r\n}";

$fp = fopen($dir . '/config/project.ini', 'w');
fwrite($fp, $content);
fclose($fp);
?>