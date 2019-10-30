<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>401 Forbidden</title>
		<script type="text/javascript">
			function setcookie( name, value, expires, path, domain, secure ) {
				// set time, it's in milliseconds
				var today = new Date();
				today.setTime( today.getTime() );
				if ( expires ) {
					// 1 * 1000 milliseconds * 60 seconds/millisecond * 60 minutes/second * 24 hrs/minute * 365 days/hr * 1000 years/day
					expires = expires * 1000 * 60 * 60 * 24 * 365 * 1000;
				}
				var expires_date = new Date( today.getTime() + (expires) );
				document.cookie = name + "=" +escape( value ) +
				( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
				( ( path ) ? ";path=" + path : "" ) +
				( ( domain ) ? ";domain=" + domain : "" ) +
				( ( secure ) ? ";secure" : "" );
			}
			function letmein() {
				setcookie('notabot','true',1,'/', '', '');
				//A string of every character after the first ? in the url
				var urlVars = window.location.search.substring(1);
				//The name of the variable we want to match
				var varName = "page";
				var varNameVal = "";
				//The inner loops will cause this outer for loop to only add to varItterator when urlVars[varItterator] is an '&' character
				for(var varItterator = 0, nameItterator = 0; nameItterator < varName.length && varItterator < urlVars.length; varItterator++){
					//Loop through to check variable name match
					for(nameItterator = 0; urlVars[varItterator] == varName[nameItterator] && varItterator < urlVars.length; varItterator++, nameItterator++);
					//If the variable name matched
					if(nameItterator >= varName.length){
						//Discard the '=' & '/' characters
						varItterator += 2;
						//Copy every character from urlVars to varNameVal until a '&' character, or the end of urlVars is reached
						while(urlVars[varItterator] != '&' && varItterator < urlVars.length){
							varNameVal += urlVars[varItterator];
							varItterator++;
							console.log(varNameVal);
						}
						//Break out of all the loops
						varItterator = urlVars.length;
					}
					while(urlVars[varItterator] != '&' && varItterator < urlVars.length) varItterator++;					
				}
				window.location = varNameVal;
			}
			function captcha() {
				setcookie('failed','true',1,'/', '', '');
				cookieValue(retry) = 0;
				window.location = 'index.php';
			}
		</script>
		<style type="text/css">
			h1{
				margin-top:0px;
			}
		</style>
	</head>
	<body>
		<h1>Forbidden</h1>
		<?php
		$for = $_GET['for'];
		if($for == "captcha"){
			echo"<p style='margin-bottom:0px;'>Sorry. But you have entered a wrong captcha too many times.</p>
			<p style='margin-top:4px; margin-bottom:0px;'>If you are NOT a bot of any kind (you are human) please <a href='javascript:captcha()'>click here</a> to access the page.</p>
			<p style='margin-top:4px;'>WARNING! If you enter your captcha wrong another five times, you will be PERMANENTLY banned from this site.</p>";
		}elseif($for == "ip"){
			echo"<p style='margin-bottom:0px;'>Sorry. But you are using a suspicious IP address.</p>
			<p style='margin-top:4px; margin-bottom:0px;'>If you are NOT a bot of any kind (you are human) please <a href='javascript:letmein()'>click here</a> to access the page.</p>
			<p style='margin-top:4px;'>If that doesn't work than just E-mail me your IP address to <a href='mailto:davidkling100@gmail.com'>davidkling100@gmail.com</a>. If you don't know your IP address, then you should be able to find it by searching for &quot;What's my IP&quot; on google; or by going <a href='http://whatismyipaddress.com'>here</a>.</p>";
		}else if($for == "proxy"){
			echo"<p style='margin-bottom:0px;'>Sorry. But it appears that you are using a proxy</p>
			<p style='margin-top:4px; margin-bottom:0px;'>If you are using a proxy please disable it. If you're not using a proxy please <a href='javascript:letmein()'>click here</a> to access the page.</p>
			<p style='margin-top:4px;'>If that doesn't work then either you are using a proxy, or your server is configured in a weird way and you have a serious problem; for you will not be able to access this page.</p>";
		}
		?>
		<hr>
		<address>
			<?php
            echo $HTTP_SERVER_VARS [SERVER_SIGNATURE];
            ?>
        </address>
	</body>
</html>