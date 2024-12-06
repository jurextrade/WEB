<?php

    function get_IP_address()  {
        foreach (array('HTTP_CLIENT_IP',
                    'HTTP_X_FORWARDED_FOR',
                    'HTTP_X_FORWARDED',
                    'HTTP_X_CLUSTER_CLIENT_IP',
                    'HTTP_FORWARDED_FOR',
                    'HTTP_FORWARDED',
                    'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $IPaddress){
                    $IPaddress = trim($IPaddress); // Just to be safe

                    if (filter_var($IPaddress,
                                FILTER_VALIDATE_IP,
                                FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)
                        !== false) {

                        return $IPaddress;
                    }
                }
            }
        }
    }

  $ipaddress_caller = get_IP_address();
  $ipaddress = isset($_REQUEST['ipaddress']) ? $_REQUEST['ipaddress'] : '';  
  
  $url = 'http://www.geoplugin.net/json.gp?ip=' . $ipaddress;

  $info = file_get_contents($url);
  echo $info
?>