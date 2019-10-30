<?php
/* whitelist: end processing end exit */
$file = "../whitelist.txt";
$fw = fopen($file, 'r') or die ("Error opening file ... <br>\n");
while ($line = fgets($fw,255))
{
	$w = explode(" ",$line);
	$w0 = $w[0];
	if (preg_match('/$w0/',$_SERVER['REMOTE_ADDR']))
	{
		exit;
	}
}
/* end of whitelist */
$badbot = 0;
/* scan the blacklist.txt file for addresses of SPAM robots
 to prevent filling it up with duplicates */
$filename = "../blacklist.txt";
$fp = fopen($filename, 'r') or die ("Error opening file ... <br>\n");
while ($line = fgets($fp,255))
{
	$u = explode(" ",$line);
	$u0 = $u[0];
	if (preg_match('/$u0/',$_SERVER['REMOTE_ADDR']))
	{
		$badbot++;
	}
}
fclose($fp);
if ($badbot == 0) { /* we've just seen a new bad bot not yet listed ! */
	/* send an E-mail to hostmaster */
	$tmestamp = time();
	$datum = date("Y-m-d (D) H:i:s",$tmestamp);
	/*$from = "badbot-watch@domain.tld";
	$to = "hostmaster@domain.tld";
	$subject = "domain-tld alert: bad robot";
	$msg = "A bad robot hit $_SERVER['REQUEST_URI'] $datum \n";
	$msg .= "address is $_SERVER['REMOTE_ADDR'], agent is $_SERVER['HTTP_USER_AGENT']\n";
	mail($to, $subject, $msg, "From: $from");
	/* append bad bot address data to blacklist log file: */
	$fp = fopen($filename,'a+');
	fwrite($fp,"$_SERVER[REMOTE_ADDR] - - [$datum] \"$_SERVER[REQUEST_METHOD] $_SERVER[REQUEST_URI] $_SERVER[SERVER_PROTOCOL]\" $_SERVER[HTTP_REFERER] $_SERVER[HTTP_USER_AGENT]\r\n");
	fclose($fp);
}
header('Location: banned.php');
?>