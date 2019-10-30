<link rel="shortcut icon" href="images/favicon.ico"/>
		<link rel="stylesheet" href="default.css" />
		<link rel="stylesheet" href="style.css" />
		<?php
		if ($isMobile)
			echo "\t\t<link rel=\"stylesheet\" href=\"mobile.css\"/>\n";
		echo "\t\t<script type=\"text/javascript\" async> var isMobile = 0b" . decbin($isMobile) . "; </script>\n";
		?>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Asul">
		<script type="text/javascript" src="obama.js" defer></script>
