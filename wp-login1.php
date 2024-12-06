<?php  
header('Content-Type: text/plain');

class user {
    public $AccountNumber;
    public $AccountName;  
}

class terminal {
    public $User;
    public $Name; 
    public $DataPath;     
    public $Type;             
}   

function url(){
    if(isset($_SERVER['HTTPS'])){
        $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
    }
    else{
        $protocol = 'http';
    }
    return $protocol . "://" . $_SERVER['HTTP_HOST'];
}    


require( dirname(__FILE__) . '/wp-load.php' );


$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'login';
$registration_redirect = ! empty( $_REQUEST['redirect_to'] ) ? $_REQUEST['redirect_to'] : '';

$http_post     = ( 'POST' === $_SERVER['REQUEST_METHOD'] );

if ( isset($_GET['key']) )
	$action = 'resetpassword';

//We shall SQL escape all inputs  



$username       = isset($_REQUEST['user_login']) ? $_REQUEST['user_login'] : '';  
$useremail      = isset($_REQUEST['user_email']) ? $_REQUEST['user_email'] : '';  
$password       = isset($_REQUEST['user_password']) ? $_REQUEST['user_password'] : '';  
$passwordconf   = isset($_REQUEST['user_password_conf']) ? $_REQUEST['user_password_conf'] : '';  
$remember       = isset($_REQUEST['rememberme']) ? $_REQUEST['rememberme'] : '';  
$accountnumber  = isset($_REQUEST['accountnumber']) ? $_REQUEST['accountnumber'] : '';  
$accountname    = isset($_REQUEST['accountname']) ? $_REQUEST['accountname'] : '';  
$terminalname   = isset($_REQUEST['terminalname']) ? $_REQUEST['terminalname'] : '';   
$datapath       = isset($_REQUEST['datapath']) ? $_REQUEST['datapath'] : '';   
$terminaltype   = isset($_REQUEST['terminaltype']) ? $_REQUEST['terminaltype'] : '';    

$cwd            = getcwd();

if($remember) $remember = "true";  
else $remember = "false";  


switch ($action) {
    case 'logout' :
    	wp_logout();
    	exit();
    break;
    case 'add' :
       
        $user = get_user_by ('login', $username);
        if (empty($user->ID)) {
            echo ($username);
            exit;
        }

        $dest = $cwd . '/members/' . $user->ID . '/Terminal';       
        if (!file_exists($dest)) {
            mkdir($dest);
        }        

        $datapath = str_replace('\\', '/', $datapath);

        $datafolder = basename($datapath);

        $dest = $dest . '/' . $datafolder;

        if (!file_exists($dest)) {
            mkdir($dest);
        }        
        
        
        if (!file_exists($dest . '/config')) {
            mkdir($dest . '/config');
        }        

        if ($datafolder  !=  'IB' && $datafolder  !=  'Yahoo' && $datafolder  !=  'Main') {
            $src = $cwd . '/Terminal/MQL4';  

            if (!file_exists($dest . '/MQL4')) {            
                copyr($src, $dest . '/MQL4');
            }        
            if (!file_exists($dest . '/tester')) {
                mkdir($dest . '/tester');            
                copyr($src . '/Files', $dest . '/tester/files');
            }        
        }
        else {
            if (!file_exists($dest . '/Files')) {
                mkdir($dest . '/Files');
            }
        }        

        $dest = $dest . '/config';
        chdir($dest);
        
        $file = 'terminal.ini';
        
        $terminal = new terminal();
        $user1     = new user();

        $user1->AccountNumber  = $accountnumber;
        $user1->AccountName    = $accountname;  

        $terminal->User       = $user1; 

        $terminal->Name       = $terminalname; 
        $terminal->DataPath   = $datapath;     
        $terminal->Type       = $terminaltype;           
        
        file_put_contents($file, json_encode ($terminal, JSON_PRETTY_PRINT));


        echo $user->ID;
        exit;  
    break;    
    case 'checkemv' :
        $user = get_user_by ('email', $username);
        if (!empty ($user->user_login))
            $username = $user->user_login;       

        $user = wp_authenticate_username_password( null, $username, $password ) ;
        
        if (empty($user->ID)) {
            echo ('0');
            exit;
        }
        
        $dest = $cwd . '/members/' . $user->ID . '/EMV';       

        if (!file_exists($dest)) {
            mkdir($dest);
        }        
        
        echo $user->ID;
        exit;  
    break; 
    case 'check' :
       
        $user = get_user_by ('email', $username);
        if (!empty ($user->user_login))
            $username = $user->user_login;       
        $user = wp_authenticate_username_password( null, $username, $password ) ;
         if (empty($user->ID)) {
            echo ('0');
            exit;
        }
        $dest = $cwd . '/members/' . $user->ID . '/Terminal';       

        if (!file_exists($dest)) {
            mkdir($dest);
        }        

        $datapath = str_replace('\\', '/', $datapath);

        $datafolder = basename($datapath);

        $dest = $dest . '/' . $datafolder;

        if (!file_exists($dest)) {
            mkdir($dest);
        }        
        
        
        if (!file_exists($dest . '/config')) {
            mkdir($dest . '/config');
        }        

        if ($datafolder  !=  'IB' || $datafolder  !=  'Yahoo') {
            $src = $cwd . '/Terminal/MQL4';  

            if (!file_exists($dest . '/MQL4')) {
                copyr($src, $dest . '/MQL4');
            }        
            if (!file_exists($dest . '/tester')) {
                mkdir($dest . '/tester');            
                copyr($src . '/Files', $dest . '/tester/files');
            }        
        }
        
        $dest = $dest . '/config';
        chdir($dest);
        
        $file = 'terminal.ini';
     
        $terminal = new terminal();
        $user1     = new user();

        $user1->AccountNumber  = $accountnumber;
        $user1->AccountName    = $accountname;  

        $terminal->User       = $user1; 

        $terminal->Name       = $terminalname; 
        $terminal->DataPath   = $datapath;     
        $terminal->Type       = $terminaltype;           
        
        file_put_contents($file, json_encode ($terminal, JSON_PRETTY_PRINT));



        echo $user->ID;
        exit;  
    break;    
    case 'login' :
        $user = get_user_by( 'email', $username );
        if (!empty( $user->user_login ))
            $username = $user->user_login;        
        $login_data = array();  

        $login_data['user_login'] = $username;  
        $login_data['user_password'] = $password;  
        $login_data['remember'] = $remember;          

        $user_verify = wp_signon( $login_data, false );   
        if (is_wp_error($user_verify))  {  
            echo 'Invalid login details';      
        }     
        if ($registration_redirect != '')
            wp_safe_redirect( $registration_redirect); 
      
        exit;  
    break;

    case 'register':
        
        // Check username is present and not already in use  
        if (strpos($username, ' ') !== false)  {  
            echo "Sorry, no spaces allowed in usernames";  
            exit;
        }  
        
        
        if (empty($username))  {  
            echo "Please enter a username";  
            exit;
        }  
        elseif (username_exists ($username)) {  
            echo "Username already exists, please try another";  
            exit;
        }  
        // Check email address is present and valid  
          

        if (!is_email ($useremail))  {  
            echo "Please enter a valid email";  
            exit;
        }  
        elseif (email_exists ($useremail)) {  
            echo "This email address is already in use";  
            exit;
        }  
          
        // Check password is valid  
          
        if (0 === preg_match ("/.{6,}/", $password)) {  
            echo "Password must be at least six characters";  
            exit;
        }  
          

        if (isset($_POST['g-recaptcha-response'])){
            $captcha = $_POST['g-recaptcha-response'];
        }
        
        if (!$captcha){
          echo 'Please check the the captcha form';
          exit;
        }
        $secretKey = "6LdenWoUAAAAAD3aNUI7sNvZe2RwocwPFwfXxJZK";
        
        
        $ip = $_SERVER['REMOTE_ADDR'];
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha."&remoteip=".$ip);
        $responseKeys = json_decode($response,true);
        
        if(intval($responseKeys["success"]) !== 1) {
          echo 'You are spammer !';
          exit;
        }         

        $new_user_id = wp_create_user($username, $password, $useremail);  
      
        // You could do all manner of other things here like send an email to the user, etc. I leave that to you.  

		if ( !is_wp_error($new_user_id) ) {
            $login_data = array();  
            $login_data['user_login'] = $username;  
            $login_data['user_password'] = $password;  
            $login_data['remember'] = false;          
    
            $current_user = wp_signon( $login_data, false );   

            if (!file_exists($cwd . '/members/' . $current_user->ID)) 
                mkdir($cwd . '/members/' . $current_user->ID);
            

            $src = $cwd . '/conf';  
            $dest = $cwd . '/members/' . $current_user->ID ;   // destination folder or file        
            
            copyr($src, $dest);

            if ($registration_redirect != '')
                wp_safe_redirect( $registration_redirect); 
			exit();
		}
		else {
          echo 'Registration Failed';
          exit;
        }         
    break;

    case 'lostpassword' :
   
		if ( $http_post ) {
			$errors = retrieve_password1();
            
			if (! is_wp_error($errors)) {
                echo nl2br("The email message was sent in your inbox for confirmation link\r\nPlease Check your spam folder if you can not see it");
				exit;
			}
            else {
                senderror ($errors);    
            }
		}
        exit;

        
    break;
    case 'rp':
    case 'resetpassword':    
		list( $rp_path ) = explode( '?', wp_unslash( $_SERVER['REQUEST_URI'] ) );
		$rp_cookie       = 'wp-resetpass-' . COOKIEHASH;


		if ( isset( $_GET['key'] ) && isset( $_GET['login'] ) ) {
            
			$value = sprintf( '%s:%s', wp_unslash( $_GET['login'] ), wp_unslash( $_GET['key'] ) );
			setcookie( $rp_cookie, $value, 0, $rp_path, COOKIE_DOMAIN, is_ssl(), true );

			wp_safe_redirect( remove_query_arg( array( 'key', 'login' ) ) );
			exit;
		}

		if ( isset( $_COOKIE[ $rp_cookie ] ) && 0 < strpos( $_COOKIE[ $rp_cookie ], ':' ) ) {
			list( $rp_login, $rp_key ) = explode( ':', wp_unslash( $_COOKIE[ $rp_cookie ] ), 2 );

			$user = check_password_reset_key( $rp_key, $rp_login );

			if ( isset( $_POST['pass1'] ) && ! hash_equals( $rp_key, $_POST['rp_key'] ) ) {
				$user = false;
			}
		} else {
			$user = false;
		}

		if ( ! $user || is_wp_error( $user ) ) {
			setcookie( $rp_cookie, ' ', time() - YEAR_IN_SECONDS, $rp_path, COOKIE_DOMAIN, is_ssl(), true );

			if ( $user && $user->get_error_code() === 'expired_key' ) {
				wp_redirect( site_url( '?action=lostpassword&error=expiredkey') );
			} else {
				wp_redirect( site_url( '?action=lostpassword&error=invalidkey') );
			}
			exit;
		}

		$errors = new WP_Error();

		if ( isset( $_POST['pass1'] ) && $_POST['pass1'] !== $_POST['pass2'] ) {
			$errors->add( 'password_reset_mismatch', __( '<strong>Error</strong>: The passwords do not match.' ) );
            echo 'The passwords do not match';
			exit;            
		}
        
		do_action( 'validate_password_reset', $errors, $user );

		if ( ( ! $errors->has_errors() ) && isset( $_POST['pass1'] ) && ! empty( $_POST['pass2'] ) ) {
			reset_password( $user, $_POST['pass1'] );
			setcookie( $rp_cookie, ' ', time() - YEAR_IN_SECONDS, $rp_path, COOKIE_DOMAIN, is_ssl(), true );
            echo 'Password Reset : Your password has been reset <a href="#" onclick= "onclick_signin()">' . 'Log in' . '</a></p>';
			exit;
		}

		wp_enqueue_script( 'utils' );
		wp_enqueue_script( 'user-profile' );
        wp_redirect( site_url( '?action=resetpassword' ) . '&key=' . esc_attr( $rp_key ) . '&login=' . esc_attr( $rp_login ));
        exit;
	break;    
    default:
        echo('0');
    break;
}


function senderror ($errors) {
    $response = array( 'success' => false );
    foreach ( $errors->errors as $code => $messages ) {
        foreach ( $messages as $message ) {
            $result[] = array(
                'code'    => $code,
                'message' => $message,
            );
            echo $message;
        }
    }
    $response['data'] = $result;    
}


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

function retrieve_password1( $user_login = null ) {
	$errors    = new WP_Error();
	$user_data = false;

	// Use the passed $user_login if available, otherwise use $_POST['user_login'].
	if ( ! $user_login && ! empty( $_POST['user_login'] ) ) {
		$user_login = $_POST['user_login'];
	}

	if ( empty( $user_login ) ) {
		$errors->add( 'empty_username', __( '<strong>Error</strong>: Please enter a username or email address.' ) );
	} elseif ( strpos( $user_login, '@' ) ) {
		$user_data = get_user_by( 'email', trim( wp_unslash( $user_login ) ) );
		if ( empty( $user_data ) ) {
			$errors->add( 'invalid_email', __( '<strong>Error</strong>: There is no account with that username or email address.' ) );
		}
	} else {
		$user_data = get_user_by( 'login', trim( wp_unslash( $user_login ) ) );
	}


	$user_data = apply_filters( 'lostpassword_user_data', $user_data, $errors );


	do_action( 'lostpassword_post', $errors, $user_data );

	$errors = apply_filters( 'lostpassword_errors', $errors, $user_data );

	if ( $errors->has_errors() ) {
		return $errors;
	}

	if ( ! $user_data ) {
		$errors->add( 'invalidcombo', __( '<strong>Error</strong>: There is no account with that username or email address.' ) );
		return $errors;
	}

	// Redefining user_login ensures we return the right case in the email.
	$user_login = $user_data->user_login;
	$user_email = $user_data->user_email;
	$key        = get_password_reset_key( $user_data );

	if ( is_wp_error( $key ) ) {
		$errors->add( 'invalidKey', __( '<strong>Error</strong>: Error in Generating key.' ) );
        return $errors;
	}

	// Localize password reset message content for user.
	$locale = get_user_locale( $user_data );

	$switched_locale = switch_to_locale( $locale );

	if ( is_multisite() ) {
		$site_name = get_network()->site_name;
	} else {

		$site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
	}

	$message = __( 'Someone has requested a password reset for the following account:' ) . "\r\n\r\n";
	/* translators: %s: Site name. */
	$message .= sprintf( __( 'Site Name: %s' ), $site_name ) . "\r\n\r\n";
	/* translators: %s: User login. */
	$message .= sprintf( __( 'Username: %s' ), $user_login ) . "\r\n\r\n";
	$message .= __( 'If this was a mistake, ignore this email and nothing will happen.' ) . "\r\n\r\n";
	$message .= __( 'To reset your password, visit the following address:' ) . "\r\n\r\n";
	$message .= network_site_url( "wp-login1.php?action=rp&key=$key&login=" . rawurlencode( $user_login ), 'login' ) . '&wp_lang=' . $locale . "\r\n\r\n";

	if ( ! is_user_logged_in() ) {
		$requester_ip = $_SERVER['REMOTE_ADDR'];
		if ( $requester_ip ) {
			$message .= sprintf(
				/* translators: %s: IP address of password reset requester. */
				__( 'This password reset request originated from the IP address %s.' ),
				$requester_ip
			) . "\r\n";
		}
	}

	/* translators: Password reset notification email subject. %s: Site title. */
	$title = sprintf( __( '[%s] Password Reset' ), $site_name );
	$title = apply_filters( 'retrieve_password_title', $title, $user_login, $user_data );
	$message = apply_filters( 'retrieve_password_message', $message, $key, $user_login, $user_data );

	if ( $switched_locale ) {
		restore_previous_locale();
	}

    $headers = 'From: '. $site_name . ' <' . 'admin@' . $site_name . '.com>'; 



	if ( $message && ! wp_mail1( $user_email, wp_specialchars_decode( $title ), $message, $headers ) ) {
		$errors->add(
			'retrieve_password_email_failure',
			sprintf(
				/* translators: %s: Documentation URL. */
				__( '<strong>Error</strong>: The email could not be sent. Your site may not be correctly configured to send emails. <a href="%s">Get support for resetting your password</a>.' ),
				esc_url( __( 'https://wordpress.org/support/article/resetting-your-password/' ) )
			)
		);
		return $errors;
	}

	return true;
}

  
/**
	 * Sends an email, similar to PHP's mail function.
	 *
	 * A true return value does not automatically mean that the user received the
	 * email successfully. It just only means that the method used was able to
	 * process the request without any errors.
	 *
	 * The default content type is `text/plain` which does not allow using HTML.
	 * However, you can set the content type of the email by using the
	 * {@see 'wp_mail_content_type'} filter.
	 *
	 * The default charset is based on the charset used on the blog. The charset can
	 * be set using the {@see 'wp_mail_charset'} filter.
	 *
	 * @since 1.2.1
	 * @since 5.5.0 is_email() is used for email validation,
	 *              instead of PHPMailer's default validator.
	 *
	 * @global PHPMailer\PHPMailer\PHPMailer $phpmailer
	 *
	 * @param string|string[] $to          Array or comma-separated list of email addresses to send message.
	 * @param string          $subject     Email subject.
	 * @param string          $message     Message contents.
	 * @param string|string[] $headers     Optional. Additional headers.
	 * @param string|string[] $attachments Optional. Paths to files to attach.
	 * @return bool Whether the email was sent successfully.
	 */
function wp_mail1( $to, $subject, $message, $headers = '', $attachments = array() ) {

    $atts = apply_filters( 'wp_mail', compact( 'to', 'subject', 'message', 'headers', 'attachments' ) );

    $pre_wp_mail = apply_filters( 'pre_wp_mail', null, $atts );

    if ( null !== $pre_wp_mail ) {
        return $pre_wp_mail;
    }
    if ( isset( $atts['to'] ) ) {
        $to = $atts['to'];
    }
    if ( ! is_array( $to ) ) {
        $to = explode( ',', $to );
    }
    if ( isset( $atts['subject'] ) ) {
        $subject = $atts['subject'];
    }

    if ( isset( $atts['message'] ) ) {
        $message = $atts['message'];
    }

    if ( isset( $atts['headers'] ) ) {
        $headers = $atts['headers'];
    }

    if ( isset( $atts['attachments'] ) ) {
        $attachments = $atts['attachments'];
    }

    if ( ! is_array( $attachments ) ) {
        $attachments = explode( "\n", str_replace( "\r\n", "\n", $attachments ) );
    }
    global $phpmailer;

    // (Re)create it, if it's gone missing.
    if ( ! ( $phpmailer instanceof PHPMailer\PHPMailer\PHPMailer ) ) {
        require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
        require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
        require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';
        $phpmailer = new PHPMailer\PHPMailer\PHPMailer( true );

        $phpmailer::$validator = static function ( $email ) {
            return (bool) is_email( $email );
        };
    }

    // Headers.
    $cc       = array();
    $bcc      = array();
    $reply_to = array();

    if ( empty( $headers ) ) {
        $headers = array();
    } else {
        if ( ! is_array( $headers ) ) {
            // Explode the headers out, so this function can take
            // both string headers and an array of headers.
            $tempheaders = explode( "\n", str_replace( "\r\n", "\n", $headers ) );
        } else {
            $tempheaders = $headers;
        }
        $headers = array();

        // If it's actually got contents.
        if ( ! empty( $tempheaders ) ) {
            // Iterate through the raw headers.
            foreach ( (array) $tempheaders as $header ) {
                if ( strpos( $header, ':' ) === false ) {
                    if ( false !== stripos( $header, 'boundary=' ) ) {
                        $parts    = preg_split( '/boundary=/i', trim( $header ) );
                        $boundary = trim( str_replace( array( "'", '"' ), '', $parts[1] ) );
                    }
                    continue;
                }
                // Explode them out.
                list( $name, $content ) = explode( ':', trim( $header ), 2 );

                // Cleanup crew.
                $name    = trim( $name );
                $content = trim( $content );

                switch ( strtolower( $name ) ) {
                    // Mainly for legacy -- process a "From:" header if it's there.
                    case 'from':
                        $bracket_pos = strpos( $content, '<' );
                        if ( false !== $bracket_pos ) {
                            // Text before the bracketed email is the "From" name.
                            if ( $bracket_pos > 0 ) {
                                $from_name = substr( $content, 0, $bracket_pos - 1 );
                                $from_name = str_replace( '"', '', $from_name );
                                $from_name = trim( $from_name );
                            }

                            $from_email = substr( $content, $bracket_pos + 1 );
                            $from_email = str_replace( '>', '', $from_email );
                            $from_email = trim( $from_email );

                            // Avoid setting an empty $from_email.
                        } elseif ( '' !== trim( $content ) ) {
                            $from_email = trim( $content );
                        }
                        break;
                    case 'content-type':
                        if ( strpos( $content, ';' ) !== false ) {
                            list( $type, $charset_content ) = explode( ';', $content );
                            $content_type                   = trim( $type );
                            if ( false !== stripos( $charset_content, 'charset=' ) ) {
                                $charset = trim( str_replace( array( 'charset=', '"' ), '', $charset_content ) );
                            } elseif ( false !== stripos( $charset_content, 'boundary=' ) ) {
                                $boundary = trim( str_replace( array( 'BOUNDARY=', 'boundary=', '"' ), '', $charset_content ) );
                                $charset  = '';
                            }

                            // Avoid setting an empty $content_type.
                        } elseif ( '' !== trim( $content ) ) {
                            $content_type = trim( $content );
                        }
                        break;
                    case 'cc':
                        $cc = array_merge( (array) $cc, explode( ',', $content ) );
                        break;
                    case 'bcc':
                        $bcc = array_merge( (array) $bcc, explode( ',', $content ) );
                        break;
                    case 'reply-to':
                        $reply_to = array_merge( (array) $reply_to, explode( ',', $content ) );
                        break;
                    default:
                        // Add it to our grand headers array.
                        $headers[ trim( $name ) ] = trim( $content );
                        break;
                }
            }
        }
    }

    // Empty out the values that may be set.
    $phpmailer->clearAllRecipients();
    $phpmailer->clearAttachments();
    $phpmailer->clearCustomHeaders();
    $phpmailer->clearReplyTos();

    // Set "From" name and email.

    // If we don't have a name from the input headers.
    if ( ! isset( $from_name ) ) {
        $from_name = 'WordPress';
    }

 
    if ( ! isset( $from_email ) ) {
        // Get the site domain and get rid of www.
        $sitename = wp_parse_url( network_home_url(), PHP_URL_HOST );
        if ( 'www.' === substr( $sitename, 0, 4 ) ) {
            $sitename = substr( $sitename, 4 );
        }

        $from_email = 'wordpress@' . $sitename;
    }

    $from_email = apply_filters( 'wp_mail_from', $from_email );


    $from_name = apply_filters( 'wp_mail_from_name', $from_name );

    try {
        $phpmailer->setFrom( $from_email, $from_name, false );
    } catch ( PHPMailer\PHPMailer\Exception $e ) {
        $mail_error_data                             = compact( 'to', 'subject', 'message', 'headers', 'attachments' );
        $mail_error_data['phpmailer_exception_code'] = $e->getCode();

        /** This filter is documented in wp-includes/pluggable.php */
        do_action( 'wp_mail_failed', new WP_Error( 'wp_mail_failed', $e->getMessage(), $mail_error_data ) );

        return false;
    }

    // Set mail's subject and body.
    $phpmailer->Subject = $subject;
    $phpmailer->Body    = $message;

    // Set destination addresses, using appropriate methods for handling addresses.
    $address_headers = compact( 'to', 'cc', 'bcc', 'reply_to' );

    foreach ( $address_headers as $address_header => $addresses ) {
        if ( empty( $addresses ) ) {
            continue;
        }

        foreach ( (array) $addresses as $address ) {
            try {
                // Break $recipient into name and address parts if in the format "Foo <bar@baz.com>".
                $recipient_name = '';

                if ( preg_match( '/(.*)<(.+)>/', $address, $matches ) ) {
                    if ( count( $matches ) == 3 ) {
                        $recipient_name = $matches[1];
                        $address        = $matches[2];
                    }
                }

                switch ( $address_header ) {
                    case 'to':
                        $phpmailer->addAddress( $address, $recipient_name );
                        break;
                    case 'cc':
                        $phpmailer->addCc( $address, $recipient_name );
                        break;
                    case 'bcc':
                        $phpmailer->addBcc( $address, $recipient_name );
                        break;
                    case 'reply_to':
                        $phpmailer->addReplyTo( $address, $recipient_name );
                        break;
                }
            } catch ( PHPMailer\PHPMailer\Exception $e ) {
                continue;
            }
        }
    }

    // Set to use PHP's mail().
    $phpmailer->isMail();

    // Set Content-Type and charset.

    // If we don't have a content-type from the input headers.
    if ( ! isset( $content_type ) ) {
        $content_type = 'text/plain';
    }

    /**
     * Filters the wp_mail() content type.
     *
     * @since 2.3.0
     *
     * @param string $content_type Default wp_mail() content type.
     */
    $content_type = apply_filters( 'wp_mail_content_type', $content_type );

    $phpmailer->ContentType = $content_type;

    // Set whether it's plaintext, depending on $content_type.
    if ( 'text/html' === $content_type ) {
        $phpmailer->isHTML( true );
    }

    // If we don't have a charset from the input headers.
    if ( ! isset( $charset ) ) {
        $charset = get_bloginfo( 'charset' );
    }

    $phpmailer->CharSet = apply_filters( 'wp_mail_charset', $charset );

    // Set custom headers.
    if ( ! empty( $headers ) ) {
        foreach ( (array) $headers as $name => $content ) {
            // Only add custom headers not added automatically by PHPMailer.
            if ( ! in_array( $name, array( 'MIME-Version', 'X-Mailer' ), true ) ) {
                try {
                    $phpmailer->addCustomHeader( sprintf( '%1$s: %2$s', $name, $content ) );
                } catch ( PHPMailer\PHPMailer\Exception $e ) {
                    continue;
                }
            }
        }

        if ( false !== stripos( $content_type, 'multipart' ) && ! empty( $boundary ) ) {
            $phpmailer->addCustomHeader( sprintf( 'Content-Type: %s; boundary="%s"', $content_type, $boundary ) );
        }
    }

    if ( ! empty( $attachments ) ) {
        foreach ( $attachments as $attachment ) {
            try {
                $phpmailer->addAttachment( $attachment );
            } catch ( PHPMailer\PHPMailer\Exception $e ) {
                continue;
            }
        }
    }

    do_action_ref_array( 'phpmailer_init', array( &$phpmailer ) );

    $mail_data = compact( 'to', 'subject', 'message', 'headers', 'attachments' );

    // Send!
    try {
        $send = $phpmailer->send();

        do_action( 'wp_mail_succeeded', $mail_data );

        return $send;
    } catch ( PHPMailer\PHPMailer\Exception $e ) {
        $mail_data['phpmailer_exception_code'] = $e->getCode();

        do_action( 'wp_mail_failed', new WP_Error( 'wp_mail_failed', $e->getMessage(), $mail_data ) );

        return false;
    }
}
/*        
        use PHPMailer\PHPMailer\Exception;
        use PHPMailer\PHPMailer\PHPMailer;
        require 'PHPMailer-master/src/PHPMailer.php';
        require 'PHPMailer-master/src/Exception.php';
        require 'PHPMailer-master/src/SMTP.php';

        $login_data['user_login'] = $username;  
        $login_data['user_password'] = $user->user_password;  

		$length = 16;	// integer larger than 15
		$token = bin2hex(openssl_random_pseudo_bytes($length));
        
        $url = 'http://www.jurextrade/' . 'reset_password&q=' . $token;

        $messages[] = "Send email with Reset Token";
        $mail = new PHPMailer(true);
        $smtphost = "smtp-fr.securemail.pro";          // SMTP Host Name
        $smtpuser = 'admin@jurextrade.com';  // SMTP User Name
        $smtppass = 'mailjurex456';                  // SMTP password

        try {

            $mail->isSMTP();                        // Set mailer to use SMTP
            $mail->Host       = $smtphost;          // Specify main and backup SMTP servers
            $mail->SMTPAuth   = true;               // Enable SMTP authentication
            $mail->Username   = $smtpuser;          // SMTP username
            $mail->Password   = $smtppass;          // SMTP password
            $mail->SMTPSecure = 'ssl';              // Enable TLS encryption, `ssl` also accepted
            $mail->Port       = 465 ;               // TCP port to connect to

        //    $mail->SMTPDebug  = 2;
            //Recipients
            $mail->setFrom('admin@jurextrade.com', $domain);
            $mail->addAddress($usermail);// Add a recipien
            // Content
            $mail->isHTML(true);                    // Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $mailbody;             //"{$url}reset-password.php?key={$reset_token}&id={$userid}";
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            $mail->send();
            echo "The email message was sent from " . $domain . " to " . $usermail;

        } catch (Exception $e) {
            echo "Problem sending email message. Mailer Error: {($mail->ErrorInfo - $smtphost - $smtpuser - $smtppass) }";
        }  
        $usermail = $username;
        $user = get_user_by( 'email', $username );
        if (!empty( $user->user_login )) {
            $usermail = $username;            
            $username = $user->user_login; 
        } 
        else {
            $user = get_user_by( 'login', $username );            
            if (empty( $user->user_login )) {
                echo 'Unknow email or name';
                exit;
            }
            $usermail = $user->user_email;
        }
        $username = $user->user_login; 

        $servername = $_SERVER['SERVER_NAME'];


        if ($servername == '127.0.0.1' || $servername === 'localhost') {
            $domain = 'localhost';
        }
        else {
         
            $domain   = explode('.', $servername)[1];
        }
    
        $subject  = $domain . ' '. " - Reset Your Password";
        
        $mailbody = "<p>You (or someone else) entered this email address : " . $usermail . " when trying to change the password at " . 
                    $domain . 
                    "<p>If you are a registered user and were expecting this email, please try again using the email address you used to register your account.</p>" . 
                    "<p>If you are not a registered user, please ignore this email.</p><p>Thanks!</p><p>Customer Support</p>";
        
        $header   = "From:admin@" . $domain . ".com\r\n";
        $header  .= "MIME-Version: 1.0\r\n";
        $header  .= "Content-type: text/html\r\n";             

  
        if(mail($usermail, $subject, $mailbody, $header)){ 
            echo "The email message was sent from " . $domain . " to " . $usermail;
        }else{  
            echo "Problem sending email message" ;
        }        
      
        exit;
*/ 
?>