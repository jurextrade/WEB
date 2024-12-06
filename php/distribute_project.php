<?php
$projectfolder  = $_POST['content'];
$userid         = $_POST['userid'];
$terminalfolder = $_POST['terminalfolder'];
$terminaltype   = $_POST['terminaltype'];

$cwd            =  dirname(getcwd() ,1);

$srcdir = $cwd . '/members/' . $userid . '/Projects/' . $projectfolder . '/MQL4';
$destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder. '/MQL4' ;

$fromlibraryfile = "PG_EntryRules.dll";
$tolibraryfile = "PG_EntryRules.dll";

if ($terminaltype === 'Tester') {
    $fromlibraryfile = "PG_TEntryRules.dll";    
    $tolibraryfile = "PG_TEntryRules.dll";
}



if (!copy($srcdir . "/Libraries/" . $fromlibraryfile,  $destdir  . "/Libraries/" . $tolibraryfile))
    echo "La copie $fromlibraryfile du fichier a échoué...\n";



copyr($srcdir . "/Indicators", $destdir  . "/Indicators");
copyr($srcdir . "/Experts",    $destdir  . "/Experts");


$srcdir = $srcdir . '/Files';


if ($terminaltype === 'Tester') {
    $destdir = $cwd . '/members/' . $userid . '/Terminal/' . $terminalfolder .  '/tester' ;
}

if (!is_dir ($destdir)) mkdir($destdir, 0777);


if ($terminaltype !== 'Tester') {
    $destdir = $destdir . '/Files';
}
if ($terminaltype == 'Tester') {
    $destdir = $destdir . '/files';
}

if (!is_dir ($destdir)) mkdir($destdir, 0777);

copyr($srcdir, $destdir);

function copyr ($source, $dest) {
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
        copyr("$source/$entry", "$dest/$entry");
    }

    // Clean up
    $dir->close();
    return true;
}
?>