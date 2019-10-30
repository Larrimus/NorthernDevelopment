<?php
include("bot-trap/blacklist.php");
?>
<!DOCTYPE html
Cache-Control: public, max-age=2400000, must-revalidate>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
		<title>Northern Development: About</title>
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
				<h2>David Kling</h2>
                <div id="first">
					<p>Owner Northern Development Inc.<a href="images/"><img style="width:36%; min-height:100px; min-width:200px" src="images/" alt="Images" /></a>
					&nbsp;&nbsp;&nbsp;<br>
					&nbsp;&nbsp;&nbsp;</p>
                </div><!--first-->
				
                <!--footer-->	
				<?php
				require("Footer.html");
				?>
			</div><!--main-->
		</div><!--container-->
	</body>
</html>