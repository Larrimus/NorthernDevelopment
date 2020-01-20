<?php
//https://raw.githubusercontent.com/serbanghita/Mobile-Detect/master/Mobile_Detect.php
require_once "Mobile_Detect.php";
$mobileDetect = new Mobile_Detect;
$isMobile = 0;
// Any tablet device.
if($mobileDetect->isTablet()){
	$isMobile ^= 1;
	$isMobile <<= 1;
}
// Any mobile device (phones or tablets).
if ($mobileDetect->isMobile()){
	$isMobile ^= 1;
}


$badbot = 0;
$useragent=$_SERVER['HTTP_USER_AGENT'];
$proxy_headers = array(
	'HTTP_VIA',
	'HTTP_X_FORWARDED_FOR',
	'HTTP_FORWARDED_FOR',
	'HTTP_X_FORWARDED',
	'HTTP_FORWARDED',
	'HTTP_CLIENT_IP',
	'HTTP_FORWARDED_FOR_IP',
	'VIA',
	'X_FORWARDED_FOR',
	'FORWARDED_FOR',
	'X_FORWARDED',
	'FORWARDED',
	'CLIENT_IP',
	'FORWARDED_FOR_IP',
	'HTTP_PROXY_CONNECTION'
);
/* look for the IP address in the blacklist file */
$filename = "blacklist.txt";
$fp = fopen($filename, 'r') or die ("Error opening file ... <br>\n");
//include "blacklist.txt";
while ($line = fgets($fp,255))
{
	$u = explode(" ",$line);
	$u0 = $u[0];
	//echo $_SERVER['REMOTE_ADDR'] . ' vs ' . $u0;
	//if (preg_match('/$u0/',$_SERVER['REMOTE_ADDR']))
	if($u0==$_SERVER['REMOTE_ADDR'])
	{
		$badbot++;
	}
}
fclose($fp);
if ($badbot > 0)
{ 
	/* this is a bad bot, reject it */
	header('Location: bot-trap/banned.php');
}
elseif ($_COOKIE['notabot'] == 'true' || $isMobile)
{
	
}
elseif (in_array($_SERVER['REMOTE_PORT'], array(8080,80,6588,8000,3128,553,554)))
{
    header('Location: blocked.php?for=proxy&badremoteport='.$_SERVER['REMOTE_PORT'].'&page='.$_SERVER['PHP_SELF']);
}
else{
	foreach($proxy_headers as $x){
        if (isset($_SERVER[$x]))
		{
			header('Location: blocked.php?for=proxy&baduseragent='.$x.'&page='.$_SERVER['PHP_SELF'].'&remoteport='.$_SERVER['REMOTE_PORT']);
		}
    }
}
?>