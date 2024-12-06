<!DOCTYPE html>
<?php 
    $action1 = (isset($_GET['action'])) ? $_GET['action'] : '';
    $key = (isset($_GET['key'])) ? $_GET['key'] : '';
    $login = (isset($_GET['login'])) ? $_GET['login'] : '';
    $error = (isset($_GET['error'])) ? $_GET['error'] : '';

    require( dirname(__FILE__) . '/wp-load.php' );
    global $current_user;
    get_currentuserinfo();
?>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>NETPROG</title>
    <link href="/A_PLATFORMS/netprog/res/netprog.svg" type="image/x-icon"                             rel="icon">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"          rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"   rel="stylesheet">  

    <link href="/B_COMMON/css/style_solution.css" 											                      rel="stylesheet">      
    <script src='https://www.google.com/recaptcha/api.js'                                           type="text/javascript"></script> 
    <script src="/C_TOOLS/js/script_solution.js"                                                    type="text/javascript"></script>  

</head>

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

            let dynamic            = true;
            
            solution = new SOLUTION(userid, username, usermail, userfirstname, userlastname, userdname, userphoto, action, key, login, error, dynamic);
            document.getElementsByClassName("sb_load_page")[0].remove()          
            CookieBanner_init();              
        }
        setTimeout(call, 5);
    </script>
</body>

</html>