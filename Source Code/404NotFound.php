<?php
include("bot-trap/blacklist.php");
?>
<!DOCTYPE html
Cache-Control: public, max-age=2400000, must-revalidate>
	<html lang="en">
    <head>
		<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
		<title>404 Not Found</title>
        <?php
        include("headdefaults.html");
        ?>
        <!--<link rel="stylesheet" media="handheld and (min-device-width: 481px) and (max-device-width: 900px), screen and (min-device-width: 481px) and (max-device-width: 900px)" href="tablet.css" />-->
		<!--[if lt IE 9]>
			<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
        <style type="text/css">
			@media handheld, screen and (max-device-width: 900px), (max-width: 320px), (-webkit-device-pixel-ratio: 1.5)
			{
				div#main img{
					width:96%;
				}
			}
			@media handheld and (min-device-width: 481px) and (max-device-width: 900px), screen and (min-device-width: 481px) and (max-device-width: 900px)
			{
				div#main img{
					width:initial;
				}
			}
		</style>
	</head>
	<body>
		<?php
        include("noscript.html");
        ?>
		<div id="container">
			<!--header-->
            <header>
				<?php
				require("Logo.html");
				?>
	    	</header>
			<!--navigation-->
			<?php
			require("Navigation.html");
			?>
			<!--main content-->
			<div id="main">
				<div id="errormessage">
					<p>We're sorry, you've attempted to access a page that doesn't appear to exist.</p>
					<p>If you believe this is an error, please <a href="contact.php?mail=ticket">notify the administrator</a>.</p>
				</div><!--404-message-->
				<p>Alternatively you could try:</p>
				<ul>
					<li>Checking the URL you went to.</li>
					<li>If you bookmarked this URL, you might want to try accessing it through the links on this page &ndash; something might have changed.</li>
					<li>If you were linked here, you might want to let the provider of the link know that the link's broken now.</li>
					<li><a href="//google.com">Google?</a></li>
				</ul>
				<center><img src="images/404kitten.jpg" alt="404 Kitty" /></center>
			<!--footer-->	
			<?php
			require("Footer.html");
			?>
			</div><!--main-->
		</div><!--container-->
	</body>
</html>