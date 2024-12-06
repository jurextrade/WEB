<!DOCTYPE html>
<?php 
    $action1 = (isset($_GET['action'])) ? $_GET['action'] : '';
    $key = (isset($_GET['key'])) ? $_GET['key'] : '';
    $login = (isset($_GET['login'])) ? $_GET['login'] : '';
    $error = (isset($_GET['error'])) ? $_GET['error'] : '';

    require( dirname(__FILE__) . '../../wp-load.php' );
    global $current_user;
    get_currentuserinfo();
?>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>NETPROG</title>
    <link href="res/eagle.svg" type="image/x-icon"                                                  rel="icon">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"          rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"   rel="stylesheet">  

    <script src='https://www.google.com/recaptcha/api.js'                                           type="text/javascript"></script>               	
    <script src="/js/tools/script_solution.js"                                                      type="text/javascript"></script>  
    <!--   <style>
       img {
            vertical-align: 80px;
            animation: myanim 10s;
         }
         @keyframes myanim {
                from {
                    margin-left: 0%;
                    width: 6%;
                    margin-top: 0%;
                }

                45% {
                    margin-left: 25%;
                    margin-top: 10%;                    
                    width: 30%;
                }

                to {
                    margin-left: 38%;
                    margin-top: 18%;
                    width: 300px;
                }
            }
        #loader {
            animation: spin 2s linear infinite;
        }    
      </style>
    -->      
</head>

<body style="margin:0; overflow:hidden">
    <div class="sb_load_page"  style="position: absolute;width:100%;height:100%;background-color: #222336;z-index: 300;">
      <div class="sb_image_page" style="position:absolute; width:300px; height:300px; margin-top: -250px; margin-left: -150px; left:50%; top:50%; right:50%; bottom:50%;display: flex;
                    flex-direction: column;align-items: center;">
            <img  src="./res/eagle.svg" style="width:300px; height:300px;">
            <div style="color:white"> Loading ...</div>
            <div id="loader" style="position: fixed;max-width: 120px;max-height: 120px;border-width: 16px;border-style: solid;border-color: gray white white;border-image: initial;border-radius: 50%;width: 120px;height: 120px;animation: spin 2s linear infinite;left: 50%;top: 55%;z-index: 599;margin-top: -60px;margin-left: -60px;"></div>           
      </div>    
    </div>   
    <script type="text/javascript">
        function LoaderInit() {

            var iLoader = document.createElement('div');
            document.body.appendChild(iLoader);

            iLoader.id                 = 'loader';

            iLoader.style.position     = "fixed";
            iLoader.style.maxWidth     = "120px";
            iLoader.style.maxHeight    = "120px";
            iLoader.style.border       = "16px solid white";
            iLoader.style.borderTop    = "16px solid gray";
            iLoader.style.borderRadius = "50%";
            iLoader.style.width        = "120px";
            iLoader.style.height       = "120px";
            iLoader.style.animation    = "spin 2s linear infinite";
            iLoader.style.position     = "absolute";
            iLoader.style.left         = "50%";
            iLoader.style.top          = "55%";
            iLoader.style.zIndex       = "599";
            iLoader.style.position     = "fixed";
            iLoader.style.marginTop    = "-60px"; 
            iLoader.style.marginLeft   = "-60px";     
        }

        function LoaderRemove () {
            if (document.getElementById('loader')) {
                document.getElementById('loader').remove();
            }
        }

        function LoaderDisplay(display) {
            if (display) {
                LoaderInit();
            } else {
                LoaderRemove();        
            }
        }    

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
            $(".sb_load_page" ).remove();                      
            InitApp (solution)  
        };
        setTimeout(call, 5);
    </script>
</body>

</html>