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


<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>jurextrade</title>   
    <link href="res/jurextrade.svg" type="image/x-icon"                        rel="icon">
    
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"            rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"              rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"     rel="stylesheet">
    
    
    <link href="/C_TOOLS/css/style_sb.css"											                          rel="stylesheet">  
    <link href="/C_TOOLS/css/quill.snow.css"                                                                  rel="stylesheet">  

    <link href="/B_COMMON/css/style_solution.css" 											                      rel="stylesheet">  
    <link href="/B_COMMON/css/style_market.css" 											                      rel="stylesheet">  
    <link href="/B_COMMON/css/style_speech.css" 											                      rel="stylesheet">  
    <link href="/B_COMMON/css/style_common.css" 											                      rel="stylesheet">  
    <link href="/B_COMMON/css/style-assistant.css" 											                      rel="stylesheet">  
    <link href="/B_COMMON/css/style-DATE.css" 											                          rel="stylesheet">  

    <link href="/A_PLATFORMS/tradedesk/css/style_tradedesk.css"											                  rel="stylesheet">      
    <link href="/A_PLATFORMS/project/css/style_project.css" 											                  rel="stylesheet">      
    <link href="/A_PLATFORMS/home/css/style_home.css"   											                      rel="stylesheet">      
    <link href="/A_PLATFORMS/option/css/style_option.css"   											                  rel="stylesheet">      



    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->


    <script src="https://www.google.com/recaptcha/api.js"                                               type="text/javascript"></script>               	
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"                     type="text/javascript"></script>        
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"               type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.2/jquery.validate.min.js"  type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"          type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.js"                          type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.js"                      type="text/javascript"></script> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"	                type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/ace.js" 	                            type="text/javascript"></script> 




        
    <script src="/C_TOOLS/js/d3.min.js"				                    type="text/javascript"></script>     
    <script src="/C_TOOLS/js//quill.min.js"                               type="text/javascript"></script>        
    <script src="/C_TOOLS/js/anime.min.js"                                type="text/javascript"></script>
    <script src="/C_TOOLS/js/jquery.steps.js"                             type="text/javascript"></script>
    <script src="/C_TOOLS/js/jquery-sortable-lists.js"                    type="text/javascript"></script>
    <script src="/C_TOOLS/js/beautify.min.js"                             type="text/javascript"></script> 
    <script src="/C_TOOLS/js/js-date-format.min.js"	                    type="text/javascript"></script>
    <script src="/C_TOOLS/js/react-stockcharts.js"                        type="text/javascript"></script>
    <script src="/C_TOOLS/js/icons.js"                                    type="text/javascript"></script>         
    <script src="/C_TOOLS/js/pinyin.js"							        type="text/javascript"></script>
    <script src="/C_TOOLS/js/hanzi-writer.js"					            type="text/javascript"></script>
    <script src="/C_TOOLS/js/script_tools.js"                             type="text/javascript"></script>           
    <script src="/C_TOOLS/js/script_aceeditor.js"                         type="text/javascript"></script>     
    <script	src="/C_TOOLS/js/script_openai.js"  		                    type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_gse.js"	                            type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_recognition.js"  		                type="text/javascript"></script>
    <script	src="/C_TOOLS/js/script_sound.js"  				            type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_translation.js"  		                type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_pinyin.js"    			            type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_hanzistroke.js"    		            type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_clock.js"    		                    type="text/javascript"></script>  
    <script	src="/C_TOOLS/js/script_sb.js"							    type="text/javascript"></script>    

    <script src="/C_TOOLS/js/ace/theme-sc_on_dark.js" 	                        type="text/javascript"></script> 
    <script src="/C_TOOLS/js/ace/mode-lisp.js" 	                                type="text/javascript"></script> 


    <script src="/B_COMMON/js/platform_login.js"                          type="text/javascript"></script>   
    <script	src="/B_COMMON/js/platforms.js"   	  	                    type="text/javascript"></script>   
    <script	src="/B_COMMON/js/interface_media.js"		                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/platform_media.js"		                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/interface_speech.js" 	                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/platform_speech.js"  	                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/interface_market.js" 	                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/platform_market.js"  	                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/platform_indicator.js" 			            type="text/javascript"></script> 
    <script	src="/B_COMMON/js/platform_chart.js"   			            type="text/javascript"></script> 
    <script	src="/B_COMMON/js/interface_chart.js" 			            type="text/javascript"></script>   
    <script	src="/B_COMMON/js/platform_gse.js"   			                type="text/javascript"></script> 
    <script	src="/B_COMMON/js/interface_gse.js" 			                type="text/javascript"></script>       
    <script src="/B_COMMON/js/interface_markereditor.js"                  type="text/javascript"></script>   
    <script src="/B_COMMON/js/platform_markereditor.js"                   type="text/javascript"></script>       
    <script src="/B_COMMON/js/interface_settings.js"                      type="text/javascript"></script>   
    <script src="/B_COMMON/js/platform_settings.js"                       type="text/javascript"></script>       
    <script	src="/B_COMMON/js/interface.js"   				            type="text/javascript"></script> 
    <script	src="/B_COMMON/js/platform_header.js"   			            type="text/javascript"></script> 
    <script src="/B_COMMON/js/interface_solution.js"                      type="text/javascript"></script>   
    <script src="/B_COMMON/js/platform_solution.js"                       type="text/javascript"></script>      
    <script	src="/C_TOOLS/js/script_solution.js"					        type="text/javascript"></script>       
    <script	src="/B_COMMON/js/platform_common.js"   			                    type="text/javascript"></script> 
    <script	src="/B_COMMON/js/interface_common.js" 			                    type="text/javascript"></script> 

    <script	src= "/B_COMMON/js/interface_date.js" 			                    type="text/javascript"></script> 
    <script	src= "/B_COMMON/js/platform_date.js"   			                    type="text/javascript"></script>                             

    <script	src="/js/pl.js" 	    				                    type="text/javascript"></script> 
    <script	src="/js/pg.js" 	    				                    type="text/javascript"></script> 	
    <script src="/js/platform_pg_gse.js"                                type="text/javascript"></script>        
    <script src="/js/interface_pg_common.js"                            type="text/javascript"></script>          
    <script src="/js/platform_pg_common.js"                             type="text/javascript"></script>    

    <script	src="/js/plparser.js"					                    type="text/javascript"></script> 
    <script	src="/js/plgeneration.js"				                    type="text/javascript"></script> 


    <script	src="/js/progress.js" 				                        type="text/javascript"></script>    
    <script	src="/js/interface_progress.js" 				            type="text/javascript"></script>     


    <script	src="/js/expert_signals.js"   	                            type="text/javascript"></script>     
    <script	src="/js/expert.js" 				                        type="text/javascript"></script>     
    

    <script src="/js/MT4-indicators.js"                                 type="text/javascript"></script>      
    <script	src="/js/MT4-panel.js" 					                    type="text/javascript"></script>     
    
    
    <script	src="/A_PLATFORMS/home/js/interface_home.js" 			                    type="text/javascript"></script>         
    <script	src="/A_PLATFORMS/home/js/platform_home.js"   			                    type="text/javascript"></script> 


    <script	src="/A_PLATFORMS/project/js/interface_project_assistant.js"                    type="text/javascript"></script> 
    <script	src="/A_PLATFORMS/project/js/platform_project_assistant.js"	                    type="text/javascript"></script>     
    <script	src="/A_PLATFORMS/project/js/interface_project.js" 			                    type="text/javascript"></script>         
    <script	src="/A_PLATFORMS/project/js/platform_project.js"   		                    type="text/javascript"></script> 

    <script	src="/A_PLATFORMS/tradedesk/js/platform_tradedesk_connect.js"		                    type="text/javascript"></script> 
    <script	src="/A_PLATFORMS/tradedesk/js/interface_tradedesk.js" 		                    type="text/javascript"></script> 
    <script	src="/A_PLATFORMS/tradedesk/js/platform_tradedesk.js"   		                    type="text/javascript"></script> 
   
    <script	src="/A_PLATFORMS/option/js/platform_option.js"   			                    type="text/javascript"></script> 
    <script	src="/A_PLATFORMS/option/js/interface_option.js" 			                    type="text/javascript"></script> 
    


    <script	src="/js/MT4-progress.js" 				                    type="text/javascript"></script>


</head>


<body style="margin:0; overflow:hidden">
    <div class="sb_load_page"  style="position: absolute;width:100%;height:100%;background-color: #222336;z-index: 300;">
      <div class="sb_image_page" style="position:absolute; width:300px; height:300px; margin-top: -250px; margin-left: -150px; left:50%; top:50%; right:50%; bottom:50%;display: flex;
                    flex-direction: column;align-items: center;">
            <img  src="/res/jurextrade.svg" style="width:300px; height:300px;">
            <div style="color:white"> Loading ...</div>
            <div id="loader" style="position: fixed;max-width: 120px;max-height: 120px;border-width: 16px;border-style: solid;border-color: gray white white;border-image: initial;border-radius: 50%;width: 120px;height: 120px;animation: spin 2s linear infinite;left: 50%;top: 55%;z-index: 599;margin-top: -60px;margin-left: -60px;"></div>           
      </div>    
    </div>    

    <script type="text/javascript">


        function call () {    
         
            main.items = [marketpanel, homeplatform, tradedeskplatform, projectplatform, optionplatform],
            footer.items.unshift(signalnotificationpanel)


            
     //       script_link_load('/js/tools/script_solution.js', 'text/javascript')
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
            
            let dynamic            = false;

            solution = new SOLUTION(userid, username, usermail, userfirstname, userlastname, userdname, userphoto, action, key, login, error, dynamic);
            $(".sb_load_page" ).remove();    

            InitApp1 (solution)
           
        };
        setTimeout(call, 5);
    </script>        
</body>
</html>