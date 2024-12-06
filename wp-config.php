<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'jurexdb' );

/** Database username */
define( 'DB_USER', 'jurextrade' );

/** Database password */
define( 'DB_PASSWORD', 'sqljurex123' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'oe`c!UJFH-.`n_8ASlu83{00OH8.s]L6Z^]IS DQ93T]pG8|Pe-6~C4d5yqaN]}B' );
define( 'SECURE_AUTH_KEY',  '!jZ8fnt+93xr6*5?_aY!~*]xSk&n8$qj3pEz]2cQpv$o|j6iDce1i:*kAtYo{EXn' );
define( 'LOGGED_IN_KEY',    '>1`{ndC{a<}yAt,dc`0oTNwxmC[T_-uz{HKTQYKKxT2D$Dr;3_!zPF?y8CxG5WLY' );
define( 'NONCE_KEY',        '*{jF(A2Y?bA/*CB{dm`|=]WvY)p6rfIb$E{6XWIeO.%^4~M352On2e!?Sor*>]0>' );
define( 'AUTH_SALT',        '4*jM8if_of-N,A#)5R5%vyxP=s+ y[xs3i,PrI~$G@nvbGSaH=TMF^^!X[tjahx$' );
define( 'SECURE_AUTH_SALT', '8},8{c*Npc37Z#0z_Pc<:[Q|$b:TPzgJZ*0nOKlV`>Re5N KMJneEG33 m6)$`?Y' );
define( 'LOGGED_IN_SALT',   '@kp`Pl}I8qG`$A&zzci-&[bF:uTXO+v3lf9@#D}yH4}IO!ec}373Zx@v;[n&*0aO' );
define( 'NONCE_SALT',       'uz8t.+~F,Z9hdJ.hF.8yuF$iU6CCfEQ1$<^]BadC[XAI{O-5q$Nl5Ivpa]_E*rOw' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = '0_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
