<? $allowed=array('',);$proxy_headers=array('HTTP_VIA','HTTP_X_FORWARDED_FOR','HTTP_FORWARDED_FOR','HTTP_X_FORWARDED','HTTP_FORWARDED','HTTP_CLIENT_IP','HTTP_FORWARDED_FOR_IP','VIA','X_FORWARDED_FOR','FORWARDED_FOR','X_FORWARDED','FORWARDED','CLIENT_IP','FORWARDED_FOR_IP','HTTP_PROXY_CONNECTION');if($_COOKIE['notabot']=='true'||in_array($_SERVER['REMOTE_ADDR'],$allowed)){}elseif((in_array(getIP(),$blocked))||(in_array(getIP(),$blacklist))){header('Location: bot-trap/banned.php');}elseif(in_array($_SERVER['REMOTE_PORT'],array(8080,80,6588,8000,3128,553,554))){header('Location: blocked.php?for=proxy');}else{foreach($proxy_headers as $x){if(isset($_SERVER[$x])){header('Location: blocked.php?for=proxy');}}}?>