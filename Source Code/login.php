<?php
include("bot-trap/blacklist.php");
?>
<!DOCTYPE html
Cache-Control: public, max-age=2400000, must-revalidate>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
		<title>Northern Development: Skillsets</title>
        <?php
        include("headdefaults.php");
        ?>
	</head>
	<body>
		<?php
        include("noscript.html");
        ?>
		<div id="container">
			<!--header-->
			<?php
			require("Header.html");
			?>
			<!--navigation-->
			<?php
			require("Navigation.html");
			?>
			<!--main content-->
			<div id="main">
				<h2>Skillsets</h2>
                <div id="first">
					<p>General contractor.</p>
                </div><!--first-->
				
                <!--footer-->	
				<?php
				require("Footer.html");
				?>
			</div><!--main-->
		</div><!--container-->
	</body>
</html>