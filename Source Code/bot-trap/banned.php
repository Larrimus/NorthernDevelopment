<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Banned</title>
		<style type="text/css">
			h1{
				margin-top:0px;
			}
		</style>
	</head>
	<body>
    	<a href="http://oregon.gov"><img src="images/pixel.gif" border="0" alt=" " width="1" height="1"></a>
		<h1>Banned</h1>
        <p style='margin-bottom:0px;'>Our servers have detected that you're a bot</p>
			<p style='margin-top:4px; margin-bottom:0px;'>If you are NOT a bot of any kind (you are human) you may need to update your browser or enable javascript to access the page.</p>
			<p style='margin-top:4px; margin-bottom:0px;'>If that doesn't work, use <a href="../contact.php"></a>send me an E-mail with your IP address and any questions you have.</p>
            <p style='margin-top:4px; margin-bottom:0px;'>If you don't know your IP address, then you should be able to find it by searching for &quot;What's my IP&quot; on google; or by going <a href='http://whatismyipaddress.com'>here</a>.</p>
		<hr>
		<address>
			<?php
            echo $HTTP_SERVER_VARS [SERVER_SIGNATURE];
            ?>
        </address>
    </body>
</html>