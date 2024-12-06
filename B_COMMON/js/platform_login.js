

const ACTION_HIDELOGINPANEL = 0;
const ACTION_LOGIN          = 1;
const ACTION_REGISTER       = 2;
const ACTION_LOSTPASSWORD   = 3;
const ACTION_RESETPASSWORD  = 4;



var assistant_mode               = false; 
var assistant_login              = false;
/*    
if (solution.get('navigator').getCookie('assistant_login') != '') {
    assistant_mode = true;
    solution.get('navigator').setCookie ('assistant_login', '')
} 
*/
function SignOut () {
    let clogin = solution.get('login')        
    $.post(clogin.url_logout).done(
        function (response) {
            window.location = window.location.pathname;
        }
    );    
}

function SignIn () {
    let cuser  = solution.get('user')    

    cuser.registering = true;    
    DrawLoginPanel(ACTION_LOGIN);
}

function Register () {
    let cuser  = solution.get('user')    

    cuser.registering = true;    
    DrawLoginPanel(ACTION_REGISTER);  
}

function LostPassword (error) {
    let cuser  = solution.get('user')    

    cuser.registering = true;        
    DrawLoginPanel(ACTION_LOSTPASSWORD);  
    if (error != '') {
        $("#lostpassword_message").html (error + ' : Please enter your username or email address. You will receive an email message with instructions on how to reset your password');
    } 
    else {
        $("#lostpassword_message").html ('Please enter your username or email address. You will receive an email message with instructions on how to reset your password');
    }
}

function ResetPassword (key, login) {
    let cuser  = solution.get('user')    

    cuser.registering = true;        
    DrawLoginPanel(ACTION_RESETPASSWORD);  
    document.getElementById("reset_key").setAttribute('value', key);
    document.getElementById("reset_login").setAttribute('value', login);    
    $("#resetpassword_message").html ('Please enter your new password');    
}

function DrawLoginPanel(draw) {
    let cuser  = solution.get('user')    

    var content = '';
    switch (draw) {

        case ACTION_HIDELOGINPANEL :
            $(".sb_login_page").remove();
            cuser.registering = false;
        break;

        case ACTION_LOGIN :         
        case ACTION_REGISTER :     
        case ACTION_LOSTPASSWORD :       
        case ACTION_RESETPASSWORD :  
            $('body').append (LoginPanel ());     
            grecaptcha.render('g-recaptcha', {'sitekey' : '6LdenWoUAAAAAM3CFhtlb0TfVfKGP2PEb9gaeBbX',   'callback' : function(response) { } });        
            DrawLoginForm(draw)
        break;
    }
}

function DrawLoginForm (draw) {
    $('#rc-anchor-container').css('background', 'var(--theme-main-bg-color)');
    switch (draw) {
        case ACTION_LOGIN :    
            $("#login").addClass('activate');
            $("#signup").removeClass('activate');
        
            $("#loginform").css('display', '');
            $("#resetpasswordform").css('display', 'none');
            $("#registerform").css('display', 'none');
            $("#lostpasswordform").css('display', 'none');             
        break;

        case ACTION_REGISTER :    
            $("#signup").addClass('activate');
            $("#login").removeClass('activate');
        
            $("#loginform").css('display', 'none');
            $("#registerform").css('display', '');
            $("#resetpasswordform").css('display', 'none');
            $("#lostpasswordform").css('display', 'none');         
        break;
        case ACTION_LOSTPASSWORD :     
            $("#loginform").css('display', 'none');
            $("#resetpasswordform").css('display', 'none');
            $("#registerform").css('display', 'none');
            $("#lostpasswordform").css('display', '');          
        break;
        case ACTION_RESETPASSWORD :  
            $("#loginform").css('display', 'none');
            $("#resetpasswordform").css('display', '');
            $("#registerform").css('display', 'none');
            $("#lostpasswordform").css('display', 'none');
        break;        
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removeAlert(id) {
    var objTo = document.getElementById(id).innerHTML = '';
}

function generateAlert(id, txt) {
    var objTo = document.getElementById(id).innerHTML = txt;
}

function onclick_signin() {
    DrawLoginForm(ACTION_LOGIN)
}

function onclick_register() {
    DrawLoginForm(ACTION_REGISTER);
}

function onclick_lostpassword() {
    DrawLoginForm(ACTION_LOSTPASSWORD);
}

function onclick_restpassword() {
    DrawLoginForm(ACTION_RESETPASSWORD);
}

//submit

function onsubmit_loginform(elt, event) {
    let cuser  = solution.get('user')    

    if (assistant_login) {
        solution.get('navigator').setCookie('assistant_login',$('#user_login_name').val(), 1);      
    }

    event.preventDefault();
    removeAlert('login_errormsg');
    if (document.getElementById('user_login_name').value.length == 0) {
        generateAlert("login_errormsg", 'Please Fill User Name Field');
        return;
    }
    if (document.getElementById('user_login_password').value.length == 0) {
        generateAlert("login_errormsg", 'Please Fill Password Field');
        return;
    }
    var form = $(elt);
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
    }).done(function (answer) {
        if (answer.length) {
            generateAlert("login_errormsg", answer);
            if (!cuser.registering) {
                
                $('#mt4assistantpanel').html (answer); 
                var  user_mail          = $("#register1").attr ("user_mail");
                var  user_id            = $("#register1").attr ("user_id");
                var  user_name          = $("#register1").attr ("user_name");
                var  user_firstname     = $("#register1").attr ("user_firstname");
                var  user_lastname      = $("#register1").attr ("user_lastname");
                var  user_displayname   = $("#register1").attr ("user_displayname");
                var  user_url           = $("#register1").attr ("user_url");
                var  news               = solution.StreamNews;
                var  projectname        = "";
                var  strategyname       = "";
                // OnLoad(user_id, user_mail, user_name,  user_firstname, user_lastname, user_displayname, user_url, projectname, strategyname, news) ;
            }
        }
        else {
            if (cuser.registering) {
                window.location = window.location.pathname;
//                        window.location.reload(true)
            }
        } 
    }).fail(function (answer) {
        alert("Handler for .submit() called Failed." + answer);
    });
}

function onsubmit_registerform(elt, event) {
    let cuser  = solution.get('user')    

    if (assistant_login) {
        setCookie('assistant_login', $('#user_name').val(), 1);       
    }
    event.preventDefault();
    removeAlert('register_errormsg');
    if (document.getElementById('user_name').value.length == 0) {
        generateAlert("register_errormsg", 'Please Fill User Name Field');
        return;
    }
    if (document.getElementById('user_email').value.length == 0) {
        generateAlert("register_errormsg", 'Please Fill Email Field');
        return;
    }
    if (document.getElementById('user_password').value.length == 0) {
        generateAlert("register_errormsg", 'Please Fill Password Field');
        return;
    }
    if (document.getElementsByClassName('recaptcha-checkbox-checkmark').checked == true) {
        generateAlert("register_errormsg", 'Please Check Robot');
        return;
    }
    var form = $(elt);
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
    }).done(function (answer) {
        if (answer.length) {
            if (answer == 'Sorry, no spaces allowed in usernames') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'Please enter a username') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'Username already exists, please try another') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'Please enter a valid email') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'This email address is already in use') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'Password must be at least six characters') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'Please check the the captcha form') {
                generateAlert("register_errormsg", answer);
            } else 
            if (answer == 'You are spammer') {
                generateAlert("register_errormsg", answer);
            } else {
                if (!cuser.registering) {
                    $('#mt4assistantpanel').html (answer); 
                }
            }
        }
        else {
            if (cuser.registering) {
                window.location = window.location.pathname;
//                        window.location.reload(true)
            }
        } 
    }).fail(function (answer) {
        alert("Handler for .submit() called Failed." + answer);
    });    
}

function onsubmit_lostpasswordform(elt, event) {
    if (assistant_login) {
        setCookie('assistant_login', $('#user_reset_name').val(), 1);     
    }
    event.preventDefault();
    var form = $(elt);
   
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
    }).done(function (answer) {
        if (answer.length) {
            $('#lostpassword_message').html(answer);
        }
    }).fail(function (answer) {
        alert("Handler for .submit() called Failed." + answer);
    });
    $('#lostpassword_message').html('Reset Password request');        
}

function onsubmit_resetpasswordform(elt, event) {
    if (assistant_login) {
        setCookie('assistant_login', $('#reset_login').val(), 1);       
    }
    event.preventDefault();
    var form = $(elt);


    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize()
    }).done(function (answer) {
        if (answer.length) {
            $('#resetpassword_message').html(answer);
        }
        else {
            $('#resetpassword_message').html ('Reset Succeeded'); 
        }
    }).fail(function (answer) {
        alert("Handler for .submit() called Failed." + answer);
    });
    $('#resetpassword_message').html('Save New Password request');         
}

function LoginPanel (compact) {
    let clogin = solution.get('login')  
      
    var content = 
'   <div class="sb_login_page">' +
'   <div class="sb_login_close" onclick="DrawLoginPanel(0)" ><svg class="checkmark" viewBox="0 0 52 52"><path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" /></svg></i></div>' + 
'   <div class="sb_login_container">' +    
'       <div class="sb_login_header"> ' +
'        	<div id="login" class="signingdialogtab" onclick="onclick_signin()" >LOG IN</div>' +
'       	<img id="loginlogo" src="' + header.brand.logo + '">' +
'       	<div id="signup" class="signingdialogtab" onclick="onclick_register()">REGISTER</div>' +
'       </div>' +

'		<form id="loginform" class="sb_login_form" method="post" action="' + clogin.url_login + '" onsubmit="onsubmit_loginform(this, event)">' +
'			<div class="login_fields">' +
'			    <div class="username">' +
'			    	<label class="login_label">Username or E-Mail</label>' +
'			    	<input id="user_login_name" name="user_login" type="text" class="form-control"  value="">' +
'			    </div>' +
'			    <div class="password">' +
'			    	<label class="login_label">Password</label>' +
'			    	<input  id="user_login_password" name="user_password" type="password" class="form-control" value="">' +
'			    </div>' +
'               <label class="forget_label" onclick="onclick_lostpassword()">Forgot Password?</label>' +
'               <div class="sb_check custom-control custom-checkbox rememberme">' + 
'                  <input class="custom-control-input" id="rememberme" name="rememberme" type="checkbox" value="forever" checked="checked">' +
'                  <label class="custom-control-label" for="rememberme" class="custom-control-label">Remember me</label>' +                        
'               </div>' +
'			</div>' +
'			<input type="hidden" name="user-cookie" value="1">' +
'			<button class="sb_login_button sb_button" name="user-submit" value="Log In" type="submit">Log In</button>' +
'			<div id="login_errormsg" class="sb_login_error" ></div>				' +
'		</form>' +

'		<form id="registerform" class="sb_login_form" method="post" action="' + clogin.url_register + '" onsubmit="onsubmit_registerform(this, event)" style="display:none">' +
'			<div class="login_fields">' +
'			    <div class="username">' +
'			    	<label class="login_label">UserName</label>' +
'			    	<input id="user_name" name="user_login" type="text" class="form-control" value="">' +
'			    </div>' +
'			    <div class="useremail">' +
'			    	<label class="login_label">E-Mail</label>' +
'			    	<input id="user_email" name="user_email" type="text" class="form-control" value="">' +
'			    </div>' +
'			    <div class="password">' +
'			    	<label class="login_label">Password</label>' +
'			    	<input id="user_password" name="user_password" type="password" class="form-control" value="">' +
'			    </div>' +
'               <div id="g-recaptcha" class="g-recaptcha"' + ($("body").attr("theme") != 'light' ? ' data-theme="dark"' : '') +  '></div>' +
'			    <input type="hidden" name="register=true">' +
'			    <input type="hidden" name="user-cookie" value="1">' +
'			</div>' +
'           <button class="sb_login_button sb_button" name="user-submit" value="Register" tabindex="103" type="submit">Sign Up</button>' +
'			<div id="register_errormsg" class="sb_login_error"></div>' +
'		</form>' +

'		<form id="lostpasswordform" class="sb_login_form" method="post" action="' + clogin.url_lostpass + '" onsubmit="onsubmit_lostpasswordform(this, event)" style="display:none">' +
'			<div class="login_fields">' +
'               <div id="lostpassword_message" class="loginmessage">' +
'                   Please enter your username or email address. You will receive an email message with instructions on how to reset your password.' +
'               </div>' +
'			    <div class="username">' +
'			    	<label class="login_label">Username or Email</label>				    ' +
'			    	<input id="user_reset_name" name="user_login" type="text" class="form-control" value="">' +
'			    </div>' +
'			</div>' +
'			<button class="sb_login_button sb_button" name="user-submit" value="Reset my password" type="submit">Reset Password</button>						' +
'    		<div id="resetpassword_errormsg" class="sb_login_error"></div>				' +
'			<input type="hidden" name="reset=true">' +
'			<input type="hidden" name="user-cookie" value="1">' +
'		</form>' +

'       <form  id="resetpasswordform" class="sb_login_form" method="post" action="' + clogin.url_resetpass + '" autocomplete="off" name="resetpassform" onsubmit="onsubmit_resetpasswordform(this, event)" style="display:none">' +
'           <input type="hidden" id="reset_login" value="<?php echo esc_attr( $rp_login ); ?>" autocomplete="off" />' +
'		    <div class="login_fields">' +
'               <div id="resetpassword_message" class="loginmessage">' +
'                     Please enter your new  password.' +
'               </div>' +
'		        <div class="password">' +
'                   <label class="login_label">New password</label>' +
'                   <input id="pass1" name="pass1" type="password" class="form-control" value="" autocomplete="off" />' +
'               </div>' +
'		        <div class="password">' +
'                   <label lass="login_label">Confirm new password</label>' +
'                   <input id="pass2" name="pass2" type="password" class="form-control" value="" autocomplete="off" />' +
'               </div>' +
'           </div>' +
'           <button class="sb_login_button sb_button" type="submit" name="wp-submit" value="Save Password">Save Password</button>' +
'   		<div id="resetpassword_errormsg" class="sb_login_error"></div>				' +
'           <input id= "reset_key"  name="rp_key" type="hidden"value="<?php echo esc_attr( $rp_key ); ?>" />' +
'       </form>' +
'   </div>' +
'	</div>';
    return content;
}