<?php
require("bot-trap/blacklist.php");
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/
?>
<!DOCTYPE html
Cache-Control: public, max-age=2400000, must-revalidate>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
		<title>Northern Development: Contact</title>
        <?php
        include("headdefaults.php");
        ?>
		<script type="text/javascript" src="datBoi.js" defer></script>
		<script src="https://www.google.com/recaptcha/api.js?render=YOUR_PUBLIC_KEY_HERE" defer></script>
	</head>
	<body>
		<?php
		//ini_set("allow_url_include", true);
        include("noscript.html");
		//include("https://www.google.com/recaptcha/api.js?render=YOUR_PUBLIC_KEY_HERE");
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
				<div id="content"> 
					<?php
					echo "";
					if ($_SERVER['REQUEST_METHOD'] === 'POST'){
						if(isset($_POST['recaptcha_response'])) {
							// Build POST request:
							$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
							$recaptcha_secret = 'YOUR_PRIVATE_KEY_HERE';
							$recaptcha_response = $_POST['recaptcha_response'];
							// Make and decode POST request:
							$recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
							$recaptcha = json_decode($recaptcha);
							//Declare variables for the POST request
							$url = '/contact.php';
							$data["score"] = $recaptcha->score;
							// Take action based on the score returned:
							if ($recaptcha->score >= 0.5) {
								// Verified - send email
								// Enter your email address
								$mailto = "larrimus2@gmail.com";
								
								//get the user input
								$name = $_POST['name'];
								$email = $_POST['email'];
								$subject = $_POST['subject'];
								$message = $_POST['message'];
								
								// From
								$header = "from: $name <$email>";
								// Contact subject
								$subject = "$subject";
								
								// Details
								$message = stripslashes($message);
								
								//send the message
								$sent = mail($mailto, $subject, $message, $header);
								//send the message
								if($sent){
									//redirect to thank you page
									$data["mail"] = "sent";
								}else{
									$data["mail"] = "failed";
								}
							}
							// use key 'http' even if you send the request to https://...
							$options = array(
								'http' => array(
									'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
									'method'  => 'POST',
									'content' => http_build_query($data)
								)
							);
							$context  = stream_context_create($options);
							$result = file_get_contents($url, false, $context);
							if ($result === FALSE) { /* Handle error */ }

							var_dump($result);
                        } else {
                            // Not verified - show form error
							if($_POST["score"] < 0.5){
								echo "<h3 style='color:Firebrick;'>The reCAPTCHA wasn't entered correctly.</h3> 
					<p>Score: ".$_POST["score"].". Please try again.</p>\n";
							}else if($_POST["mail"] == "failed")
								echo "<p class='failed'>I'm sorry, but an error has occurred with the message you just sent. Please try again.</p>\n";
							else if($_POST["sent"] == "ticket"){
								echo "<h3>I see that you have an error to report</h3>
					<p class='failed'>To submit a ticket, fill out the form below:\n";
							}else
								echo "<h3 style='padding-left:20px; padding-bottom:20px;'>I have recieved your message and will get back to you as soon as possible.</h3>\n";
						}
					}
					else{
						echo "<h3>I&apos;m glad to see that you want to get in touch with me</h3> 
					<p>I can't post any of my contact information due to bots that will use it to spam me. So, if you would like to contact me, you can send me an E-mail by filling out and submitting the form below:</p>\n";
					}
					?>
					<form method="post" action="send_mail.php">
						<label for="name">Your Name:</label>
							<input class="type" type="text" name="name" /><br>
						<label for="email">Your E-Mail Address:</label>
							<input class="type" type="text" name="email" /><br>
						<label for="subject">Subject:</label>
							<input class="type" type="text" name="subject" /><br>
						<label for="message">Message:</label>
							<textarea name="message"></textarea><br>
						<input id="submit" type="submit" value="Send to me" />
						<input type="hidden" name="recaptcha_response" id="recaptchaResponse">
					</form>
				</div><!--content--> 
				<!--footer-->	
				<?php
				require("Footer.html");
				?>
			</div><!--main-->
		</div><!--container-->
		<script>
			//if(isMobile & 1) document.getElementsByTagName("footer")[0].style.padding = "15px 0";
			grecaptcha.ready(function () {
				grecaptcha.execute('YOUR_PUBLIC_KEY_HERE', { action: 'contact' }).then(function (token) {
					var recaptchaResponse = document.getElementById('recaptchaResponse');
					recaptchaResponse.value = token;
				});
			});
		</script>
	</body>
</html>