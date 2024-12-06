<!DOCTYPE html>
<?php 
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"       rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"          rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.1.3/cerulean/bootstrap.min.css" rel="stylesheet">  

    <link href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"   rel="stylesheet">
    <link href="/css/style_sb.css" 				                                                    rel="stylesheet">          
    <link href="/css/style_common.css" 				                                                rel="stylesheet">      
    <link href="./css/style_chinese.css" 				                                            rel="stylesheet">       
    <link href="./css/style_example.css" 				                                            rel="stylesheet">       
    <link href="./css/style_constructor.css"                                                        rel="stylesheet">       
    <link href="./css/style_netprog.css" 				                                            rel="stylesheet">     
    <link href="./css/style_emv.css"     				                                            rel="stylesheet">     
    <link href="/css/style-assistant.css" 											                  rel="stylesheet">       
    <link href="./css/style.css" 				                                                    rel="stylesheet"> 
    <link href="/css//datatable.css"                                                                rel='stylesheet'>    
</head>

<body>
    <script src='https://www.google.com/recaptcha/api.js'                                           type="text/javascript"></script>               	
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"                 type="text/javascript"></script>        
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"           type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.2/jquery.validate.min.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.js"                      type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.js"                  type="text/javascript"></script> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"	            type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/ace.js" 	                        type="text/javascript"></script> 
    <script src="https://cdn.datatables.net/v/dt/dt-1.13.1/datatables.min.js"                       type="text/javascript"></script>    
   

    <script src="/js/ace/theme-sc_on_dark.js" 	                        type="text/javascript"></script> 

    <script src="/js/tools/d3.min.js"				                    type="text/javascript"></script>     
    <script src="/js/tools/quill.min.js"                                type="text/javascript"></script>        
    <script src="/js/tools/anime.min.js"                                type="text/javascript"></script>
    
    <script src="/js/tools/jquery.steps.js"                             type="text/javascript"></script>
    <script src="/js/tools/jquery-sortable-lists.js"                    type="text/javascript"></script>
    <script src="/js/tools/beautify.min.js"                             type="text/javascript"></script> 
    <script src="/js/tools/js-date-format.min.js"	                    type="text/javascript"></script>
    <script src="/js/tools/react-stockcharts.js"                        type="text/javascript"></script>
    
    <script src="/js/tools/icons.js"                                    type="text/javascript"></script>         
    <script src="/js/tools/pinyin.js"							        type="text/javascript"></script>
    <script src="/js/tools/hanzi-writer.js"					            type="text/javascript"></script>
    <script src="/js/tools/script_tools.js"                             type="text/javascript"></script>     
    <script src="/js/tools/script_aceeditor.js"                         type="text/javascript"></script>     
    <script	src="/js/tools/script_openai.js"  		                    type="text/javascript"></script>  
    <script	src="/js/tools/script_gse.js"	                            type="text/javascript"></script>  
    <script	src="/js/tools/script_recognition.js"  		                type="text/javascript"></script>
    <script	src="/js/tools/script_sound.js"  				            type="text/javascript"></script>  
    <script	src="/js/tools/script_translation.js"  		                type="text/javascript"></script>  
    <script	src="/js/tools/script_pinyin.js"    			            type="text/javascript"></script>  
    <script	src="/js/tools/script_hanzistroke.js"    		            type="text/javascript"></script>  
    <script	src="/js/tools/script_clock.js"    		                    type="text/javascript"></script>  
    <script	src="/js/tools/script_solution.js"					        type="text/javascript"></script>
    <script	src="/js/tools/script_sb.js"							    type="text/javascript"></script>
    <script src="/js/tools/tlv.js"                                      type="text/javascript"></script>        
   
    <script src="/js/common/platform_login.js"                          type="text/javascript"></script>   
    <script	src="/js/common/platforms.js"   	  	                    type="text/javascript"></script>   

    <script	src="/js/common/interface_media.js"		                    type="text/javascript"></script> 
    <script	src="/js/common/platform_media.js"		                    type="text/javascript"></script> 
    <script	src="/js/common/interface_speech.js" 	                    type="text/javascript"></script> 
    <script	src="/js/common/platform_speech.js"  	                    type="text/javascript"></script> 
    <script	src="/js/common/interface_news.js" 	                        type="text/javascript"></script> 
    <script	src="/js/common/platform_news.js"  	                        type="text/javascript"></script> 
    <script	src="/js/common/platform_indicator.js" 			            type="text/javascript"></script> 
    <script	src="/js/common/platform_chart.js"   			            type="text/javascript"></script> 
    <script	src="/js/common/interface_chart.js" 			            type="text/javascript"></script>       
    <script src="/js/common/interface_markereditor.js"                  type="text/javascript"></script>   
    <script src="/js/common/platform_markereditor.js"                   type="text/javascript"></script>       
    <script src="/js/common/interface_settings.js"                      type="text/javascript"></script>   
    <script src="/js/common/platform_settings.js"                       type="text/javascript"></script>       
   
    <script	src="./js/netprog/mxdialogs.js"                             type="text/javascript"></script>  
    <script	src="./js/netprog/mxmanager.js"                             type="text/javascript"></script>  
    <script	src="./js/netprog/mxmanager_class.js"                       type="text/javascript"></script>  

<!-- example -->

    <script src="./js/platform_example.js"                              type="text/javascript"></script>
    <script src="./js/interface_example.js"                             type="text/javascript"></script>

<!-- emv -->
    <script src="./js/emv_define.js"                                    type="text/javascript"></script>   
    <script src="./js/platform_emv_connect.js"                          type="text/javascript"></script>    

    <script src="./js/interface_emv_database.js"                        type="text/javascript"></script>   
    <script src="./js/platform_emv_database.js"                         type="text/javascript"></script>   

    <script src="./js/platform_emv_tlvparser.js"                        type="text/javascript"></script>    
    
    <script src="./js/interface_emv_tlvparser.js"                       type="text/javascript"></script>   

    <script src="./js/platform_emv_tester.js"                           type="text/javascript"></script>    
    <script src="./js/interface_emv_tester.js"                          type="text/javascript"></script>      

    <script src="./js/interface_emv_home.js"                            type="text/javascript"></script>   
    <script src="./js/platform_emv_home.js"                             type="text/javascript"></script>   

    <script src="./js/platform_emv.js"                                  type="text/javascript"></script>    
    <script src="./js/interface_emv.js"                                 type="text/javascript"></script>      


<!-- chinese -->
    <script src="./js/platform_chinese.js"                              type="text/javascript"></script>    
    <script src="./js/interface_chinese.js"                             type="text/javascript"></script>      

<!-- constructor -->

    <script src="./js/platform_constructor_gse.js"                      type="text/javascript"></script>        
    <script src="./js/interface_constructor_gse.js"                     type="text/javascript"></script>  


    <script src="./js/platform_constructor_jsoneditor.js"               type="text/javascript"></script>        
    <script src="./js/interface_constructor_jsoneditor.js"              type="text/javascript"></script>  

    <script src="./js/platform_constructor.js"                          type="text/javascript"></script>        
    <script src="./js/interface_constructor.js"                         type="text/javascript"></script>        

<!-- netprog -->

    <script src="./js/platform_netprog_gse.js"                          type="text/javascript"></script>        
    <script src="./js/interface_netprog_gse.js"                         type="text/javascript"></script>   

    <script src="./js/platform_netprog_jsoneditor.js"                   type="text/javascript"></script>        
    <script src="./js/interface_netprog_jsoneditor.js"                  type="text/javascript"></script>   

    <script src="./js/platform_netprog_server.js"                       type="text/javascript"></script>        
    <script src="./js/interface_netprog_server.js"                      type="text/javascript"></script>   

    <script src="./js/platform_netprog_jseditor.js"                     type="text/javascript"></script>        
    <script src="./js/interface_netprog_jseditor.js"                    type="text/javascript"></script>   

    <script src="./js/platform_netprog_siteview.js"                     type="text/javascript"></script>        
    <script src="./js/interface_netprog_siteview.js"                    type="text/javascript"></script>   

    <script src="./js/platform_netprog_filemanager.js"                  type="text/javascript"></script>        
    <script src="./js/interface_netprog_filemanager.js"                 type="text/javascript"></script>   

    <script src="./js/platform_netprog.js"                              type="text/javascript"></script>        
    <script src="./js/interface_netprog.js"                             type="text/javascript"></script>      


    <script src="/js/common/platform_header.js"                         type="text/javascript"></script>
    <script src="./js/interface_header.js"                              type="text/javascript"></script>

    <script src="./js/interface_main.js"                                type="text/javascript"></script>

    <script src="./js/platform_footer.js"                               type="text/javascript"></script>
    <script src="./js/interface_footer.js"                              type="text/javascript"></script>


    <script src="/js/common/interface.js"                               type="text/javascript"></script>        


    <script src="./js/VueApp_example.js"                                type="text/javascript"></script>    
    <script src="./js/VueApp_chinese.js"                                type="text/javascript"></script>
    <script src="./js/VueApp_netprog.js"                                type="text/javascript"></script>
    <script src="./js/VueApp_init.js"                                   type="text/javascript"></script>


    <script type="text/javascript">
        let  userid            = "<?php echo  $current_user->ID;  ?>";	                
        let  username          = "<?php echo  $current_user->user_login;  ?>";	
        let  usermail          = "<?php echo  $current_user->user_email; ?>"; 
        let  userfirstname     = "<?php echo  $current_user->user_firstname;  ?>";	
        let  userlastname      = "<?php echo  $current_user->user_lastname;  ?>";	
        let  userdname         = "<?php echo  $current_user->display_name;  ?>";	  
        InitApp(userid, usermail, username, userfirstname, userlastname, userdname);
    </script>

</body>

</html>