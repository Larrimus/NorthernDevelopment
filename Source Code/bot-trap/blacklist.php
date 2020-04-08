<?php
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/
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

session_start();

if(!isset($_SESSION['myvar'])){
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
	$thisIP = $_SERVER['REMOTE_ADDR'];
	/* look for the IP address in the blacklist file */
	$filename = "blacklist.txt";
	$fp;
	if (file_exists($filename)){
		$fp = fopen($filename, 'r') or die ("Error opening file ... <br>\n");
		while (!feof($fp)) {
			$line = fgets($fp,255);
			$u = explode(" ",$line);
			$u0 = $u[0];
			//echo $_SERVER['REMOTE_ADDR'] . ' vs ' . $u0;
			//if (preg_match('/$u0/',$_SERVER['REMOTE_ADDR']))
			if($u0 == $thisIP) {
				$badbot++;
				fseek($fp, 0, SEEK_END);
			}
		}
	}
	else
		$fp = fopen($filename, 'w') or die ("Error creating file ... <br>\n");
	fclose($fp);
	/* Log the IP address to a file */
	$filename = "IPlog";
	$fp = False;
	$fileOut;
	$fileOutName = "IPlogOut";
	if (file_exists($filename)) {
		$fp = fopen($filename, 'r');
		$fileOut = fopen($fileOutName, 'w') or die ("Error creating file " . $fileOutName . " <br>\n");
		$line = fgets($fp,255);
		$splitLine = explode(" ",$line);
		while (!feof($fp) && $splitLine[0] != $thisIP) {
			fwrite($fileOut, $line . "\n");
			$line = fgets($fp,255);
			$splitLine = explode(" ",$line);
			//echo "Test \n";
		}
	} else
		$fileOut = fopen($filename, 'w') or die ("Error creating file " . $filename . " <br>\n");


	if(isset($splitLine) && $splitLine[0] == $thisIP) {
		//echo $thisIP . ' vs ' . $splitLine[0] . "\n";
		$splitLine1 = (int)$splitLine[1];
		if ($splitLine1 >= 0)
			$splitLine1++;
		else
			$splitLine1--;
		fwrite($fileOut, $splitLine[0] . " " . (string)$splitLine1);
	} else {
		if ($badbot > 0)
			fwrite($fileOut, $thisIP . " -1");
		else
			fwrite($fileOut, $thisIP . " 1");
	}

	if ($badbot > 0) { 
		/* this is a bad bot, reject it */
		header('Location: bot-trap/banned.php');
	}
	elseif ((isset($_COOKIE['notabot']) && $_COOKIE['notabot'] == 'true') || $isMobile) {
		
	}
	elseif (in_array($_SERVER['REMOTE_PORT'], array(8080,80,6588,8000,3128,553,554))) {
		header('Location: blocked.php?for=proxy&badremoteport='.$_SERVER['REMOTE_PORT'].'&page='.$_SERVER['PHP_SELF']);
	}
	else{
		/*foreach($proxy_headers as $x) {
			if (isset($_SERVER[$x])) {
				//header('Location: blocked.php?for=proxy&baduseragent='.$x.'&page='.$_SERVER['PHP_SELF'].'&remoteport='.$_SERVER['REMOTE_PORT']);
				//echo $x . "\n";
			}
		}*/
	}
	fwrite($fileOut, " " . $_SERVER['REMOTE_PORT']);

	if($fp != False){
		while (!feof($fp)){
			fwrite($fileOut, "\n" . fgets($fp,255));
			echo "Test \n";
		}
		fclose($fp);

		// delete old source file
		//unlink($filename);
		// rename target file to source file
		rename($fileOutName, $filename);
	}
	fclose($fileOut);
	//echo file_get_contents($filename) . "<br>";
}

$_SESSION['myvar']=True;
?>