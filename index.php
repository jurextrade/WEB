<!DOCTYPE html>
<?php 
    $action1 = (isset($_GET['action'])) ? $_GET['action'] : '';
    $key     = (isset($_GET['key'])) ? $_GET['key'] : '';
    $login   = (isset($_GET['login'])) ? $_GET['login'] : '';
    $error   = (isset($_GET['error'])) ? $_GET['error'] : '';
    $dynamic = (isset($_GET['dynamic'])) ? 'true' : 'false';
    $appli = (isset($_GET['appli'])) ? $_GET['appli'] : null;

    $mainarray = ''; 
    $rightarraymenu = ''; 
    $rightarraypanel = '';   
    $footerarray = '';     
    global $current_user;

    require( dirname(__FILE__) . '/wp-load.php' );
    get_currentuserinfo();

    if ($dynamic == 'false') {
        loadgen($current_user->ID, $appli);
    } else {
               
        echo '<html lang="en"> 
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
        <title>NETPROG</title>
        <link href="/A_PLATFORMS/netprog/res/netprog.svg" type="image/x-icon"                             rel="icon">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"          rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"   rel="stylesheet">  
    
        <link href="/B_COMMON/css/style_solution.css" 											                      rel="stylesheet">      
        <script src="https://www.google.com/recaptcha/api.js"                                           type="text/javascript"></script> 
        <script src="/C_TOOLS/js/script_solution.js"                                                    type="text/javascript"></script>  
    
</head>';
    }


function loadgen($userid = '0', $appli) {
    global $configuration;
    global $mainarray; 
    global $rightarraymenu; 
    global $rightarraypanel;     
    global $footerarray;     

    $cwd  = getcwd();

    if ($userid == "0") {
        $dir = $cwd . '/conf';
    } else {
        $dir = $cwd . '/members/' . $userid;
    }

    $file = $dir . '/configuration.json';      
    if (file_exists($file)) {      
        if (filesize ($file) != 0) {
            $fp = fopen($file, 'r'); 
            $configuration = json_decode(fread ($fp, filesize($file)));
            fclose($fp);  
        }
    } else {
        
    }
    echo '
<html lang="en">
<head>    
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    ';
    
    echo   '<title>' . $configuration->title . '</title>';
    echo   '
    <link href="/A_PLATFORMS/netprog/res/netprog.svg" type="image/x-icon"                           rel="icon">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"          rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"   rel="stylesheet">  

    <link href="/B_COMMON/css/style_solution.css" 		                                            rel="stylesheet">      
    <script src="https://www.google.com/recaptcha/api.js"                                           type="text/javascript"></script> 
    <script src="/C_TOOLS/js/script_solution.js"                                                    type="text/javascript"></script> 
    
    ';
    $files = Array ();
    echo '
    <!-- global_library stylesheet -->
    ';

    for ($i = 0; $i < count($configuration->global_library->stylesheet); $i++) {
        if (!in_array($configuration->global_library->stylesheet[$i], $files)) {        
            array_push($files, $configuration->global_library->stylesheet[$i]);   
            echo '<link href="' . $configuration->global_library->stylesheet[$i] . '"                   rel="stylesheet">
    ';
        }
    }
    echo '
    <!-- tools_library stylesheet -->
    ';

    for ($i = 0; $i < count($configuration->tools_library->stylesheet); $i++) {
        if (!in_array($configuration->tools_library->stylesheet[$i], $files)) {        
            array_push($files, $configuration->tools_library->stylesheet[$i]);           
            echo '<link href="' . $configuration->tools_library->stylesheet[$i] . '"                    rel="stylesheet">
    ';
        }
    }
    echo '
    <!-- common_library stylesheet -->
    ';

    for ($i = 0; $i < count($configuration->common_library->stylesheet); $i++) {
        if (!in_array( $configuration->common_library->stylesheet[$i], $files)) {        
            array_push($files,  $configuration->common_library->stylesheet[$i]);         
            echo '<link href="' . $configuration->common_library->stylesheet[$i] . '"                   rel="stylesheet">
    ';
        }
    }
    echo '
    <!-- global_library javascript -->
    ';

    for ($i = 0; $i < count($configuration->global_library->javascript); $i++) {
        if (!in_array($configuration->global_library->javascript[$i], $files)) {        
            array_push($files, $configuration->global_library->javascript[$i]);         
            echo '<script src="' . $configuration->global_library->javascript[$i] . '"                  type="text/javascript"></script>
    ';
        }
    }
    echo '
    <!-- tools_library javascript -->
    ';

    for ($i = 0; $i < count($configuration->tools_library->javascript); $i++) {
        if (!in_array( $configuration->tools_library->javascript[$i], $files)) {     
            array_push($files, $configuration->tools_library->javascript[$i]);                   
            echo '<script src="' . $configuration->tools_library->javascript[$i] . '"                   type="text/javascript"></script>
    ';
        }
    }
    echo '
    <!-- common_library javascript -->
    ';

    for ($i = 0; $i < count($configuration->common_library->javascript); $i++) {
        if (!in_array($configuration->common_library->javascript[$i], $files)) {        
            array_push($files, $configuration->common_library->javascript[$i]);         
            echo '<script src="' . $configuration->common_library->javascript[$i] . '"                  type="text/javascript"></script>
    ';
        }
    }


  
    for ($j = 0; $j < count($configuration->body->main->modules); $j++) {
        $main = $configuration->body->main->modules[$j];
        if ($main->active && $appli == null || $appli ==  $main->pname) {
            if ($mainarray == '') {
                $mainarray = $main->pname . ($main->type == "root" ? 'platform' : $main->type);
            } else {
                $mainarray = $mainarray . ', ' . $main->pname . ($main->type == "root" ? 'platform' : $main->type);
            }
           
            echo '
    <!-- --------------------------------------------MODULE MAIN ' .  $main->pname . '-------------------------------------------------->
    ';
            echo '
    <!––library stylesheet) -->
    ';
            for ($i = 0; $i < count($main->library->stylesheet); $i++) {
                if (!in_array($main->library->stylesheet, $files)) {        
                    array_push($files, $main->library->stylesheet[$i]);                 
                    echo '<link href="' . $main->library->stylesheet[$i] . '"                   rel="stylesheet">
    ';                   
                }
            }
            echo '
    <!––library javascript) -->
    ';            
            for ($i = 0; $i < count($main->library->javascript); $i++) {
                if (!in_array($main->library->javascript[$i], $files)) {        
                    array_push($files,$main->library->javascript[$i]);                 
                    echo '<script src="' . $main->library->javascript[$i] . '"                  type="text/javascript"></script>
    ';
                }
            }     
        }   
    }

    for ($j = 0; $j < count($configuration->body->right->modules); $j++) {
       $right = $configuration->body->right->modules[$j];
       if ($right->active && $appli == null || $appli ==  $right->pname) {
            if ($rightarraypanel == '') {
                $rightarraypanel = '{id: "rightsidebarpanel_' . $right->pname . '", type: "panel",  class: "sb_panel sb_main", items: [' . $right->pname . $right->type . ']}';
                $rightarraymenu = '{id: "rightsidebar_' .  $right->pname . '", type: "link",' .  (isset($right->icon) ? 'icon: "' . $right->icon . '",' :  (isset($right->iconfile) ? 'iconfile: "' . $right->iconfile . '",' : '')) . ' events: {onclick: "onclick_rightsidebarmenu(this.id)"}' . (isset($right->title) ? ', title: "' . $right->title . '"'  : '') . '}'; 
            } else {
                $rightarraypanel = $rightarraypanel . ', '  . '{id: "rightsidebarpanel_' . $right->pname . '", type: "panel",  class: "sb_panel sb_main", items: [' . $right->pname . $right->type . ']}';
                $rightarraymenu = $rightarraymenu . ',  {id: "rightsidebar_' .  $right->pname . '", type: "link",' .  (isset($right->icon) ? 'icon: "' . $right->icon . '",' :  (isset($right->iconfile) ? 'iconfile: "' . $right->iconfile . '",' : '')) . ' events: {onclick: "onclick_rightsidebarmenu(this.id)"}' . (isset($right->title) ? ', title: "' . $right->title . '"'  : '') . '}';
            }
           
            echo '
    <!-- --------------------------------------------MODULE RIGHT ' . $right->pname . '-------------------------------------------------->
    ';
            echo '
    <!––library stylesheet) -->
    ';
            for ($i = 0; $i < count($right->library->stylesheet); $i++) {
                if (!in_array($right->library->stylesheet, $files)) {        
                    array_push($files, $right->library->stylesheet[$i]);                 
                    echo '<link href="' .$right->library->stylesheet[$i] . '"                   rel="stylesheet">
    ';                   
                }
            }
            echo '
    <!––library javascript) -->
    ';            
            for ($i = 0; $i < count($right->library->javascript); $i++) {
                if (!in_array($right->library->javascript[$i], $files)) {        
                    array_push($files,$right->library->javascript[$i]);                 
                    echo '<script src="' .$right->library->javascript[$i] . '"                  type="text/javascript"></script>
    ';
                }
            }     
        }   
    }
    for ($j = 0; $j < count($configuration->body->footer->modules); $j++) {
        $footer = $configuration->body->footer->modules[$j];
        if ($footer->active && $appli == null || $appli ==  $footer->pname) {
            if ($footerarray == '') {
                $footerarray =$footer->pname . ($footer->type == "root" ? 'platform' :$footer->type);
            } else {
                $footerarray = $footerarray . ', ' .$footer->pname . ($footer->type == "root" ? 'platform' :$footer->type);
            }
           
            echo '
    <!-- --------------------------------------------MODULE FOOTER ' . $footer->pname . '-------------------------------------------------->
    ';
            echo '
    <!––library stylesheet) -->
    ';
            for ($i = 0; $i < count($footer->library->stylesheet); $i++) {
                if (!in_array($footer->library->stylesheet, $files)) {        
                    array_push($files, $footer->library->stylesheet[$i]);                 
                    echo '<link href="' .$footer->library->stylesheet[$i] . '"                   rel="stylesheet">
    ';                   
                }
            }
            echo '
    <!––library javascript) -->
    ';            
            for ($i = 0; $i < count($footer->library->javascript); $i++) {
                if (!in_array($footer->library->javascript[$i], $files)) {        
                    array_push($files, $footer->library->javascript[$i]);                 
                    echo '<script src="' .$footer->library->javascript[$i] . '"                  type="text/javascript"></script>
    ';
                }
            }     
        }   
    }    
    echo '
</head>';
}

?>

<body style="margin:0; overflow:hidden">

<div class="sb_load_page"  style="position: absolute;width:100%;height:100%;background-color: #222336;z-index: 300;">
        <img  src="/res/jurextrade.svg" style="
                animation-delay: 0s;
                position:absolute; 
                width:300px; 
                height:300px; 
                margin-top:-334px; 
                margin-left:-150px; 
                left:50%; 
                top:50%; 
                right:50%; 
                bottom:50%;
                z-index:100;
    
                ">
        <div id="startloader" class="ring">Loading<span></span></div>      
    </div>   

    <script type="text/javascript">

        function call () {  
            let dynamic            = <?php echo  $dynamic; ?>;
            if (!dynamic) {            
                main.items = <?php echo '[' .  $mainarray  .  ']' ?>;
                footer.items = <?php echo '[' .  $footerarray  .  ']' ?>;
                default_right_sidebarmenu.items[0].items = <?php echo '[' .  $rightarraymenu  .  ']' ?>;
                default_right_sidebarpanel.items = default_right_sidebarpanel.items.concat(<?php echo '[' .  $rightarraypanel  .  ']' ?>);
            }
            
            
            let  userid            = "<?php echo  $current_user->ID;  ?>";	                
            let  username          = "<?php echo  $current_user->user_login;  ?>";	
            let  usermail          = "<?php echo  $current_user->user_email; ?>"; 
            let  userfirstname     = "<?php echo  $current_user->user_firstname;  ?>";	
            let  userlastname      = "<?php echo  $current_user->user_lastname;  ?>";	
            let  userdname         = "<?php echo  $current_user->display_name;  ?>";	  
            let  userphoto         = "<?php echo  str_replace ('"', "'", get_avatar($current_user->ID, 28));  ?>";	

            let action             = "<?php echo  $action1; ?>"; 
            let key                = "<?php echo  $key; ?>"; 
            let login              = "<?php echo  $login; ?>"; 
            let error              = "<?php echo  $error; ?>"; 

            solution = new SOLUTION(userid, username, usermail, userfirstname, userlastname, userdname, userphoto, action, key, login, error, dynamic);
            document.getElementsByClassName("sb_load_page")[0].remove()          
            CookieBanner_init();              
        }
        setTimeout(call, 5);
    </script>
</body>

</html>