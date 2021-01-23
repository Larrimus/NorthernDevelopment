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
					<p>Owner Northern Development Inc.</p>
					<p>David has worked as a general contractor, offering exceptional service for many years. Our goal at Northern Development is to satisfy our customers by extending affordable, high quality and professional services for your next project. Our main goal is to provide an excellent customer experience. If we can't complete your project, there's a good chance we can find someone who will.</p>
                </div><!--first-->
				
                <!--footer-->	
				<?php
				require("Footer.html");
				?>
			</div><!--main-->
		</div><!--container-->
	</body>
</html>