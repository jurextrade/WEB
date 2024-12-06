<?php
$projectname = $_POST['project_name'];
$userid = $_POST['user_id'];
$mode = $_POST['mode'];

$srcdir = '/customers/1/3/4/mt4-progress.com/httpd.www/wp-content/wps-pro-content/members/' . $userid . '/Projects/' . $projectname . '/MQL4/files';
$destdir = '/customers/1/3/4/mt4-progress.com/httpd.www/wp-content/wps-pro-content/members/' . $userid . '/tester/files' ;

if ($mode !== 'tester') {
    $destdir = '/customers/1/3/4/mt4-progress.com/httpd.www/wp-content/wps-pro-content/members/' . $userid . '/MQL4/files' ;
}

rmdir($destdir);
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
