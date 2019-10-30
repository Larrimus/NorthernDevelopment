<?php
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/
include("bot-trap/blacklist.php");
?>
<!DOCTYPE html
Cache-Control: public, max-age=2400000, must-revalidate>
	<html lang="en">
    <head>
		<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="description" content="Northern Development: Your resource for everyday remodeling, maintenance, and repair."/>
		<title>Gallery: Northern Development</title>
		<?php
        include("headdefaults.php");
        ?>
		<script type="text/javascript" src="attackhelicopter.js" defer></script>
		<style type="text/css">
			div#container{
				overflow:visible;
			}
			header{
				overflow:hidden;
			}
			footer{
				padding: 25px 0;
			}
			footer h6{
				color: white;
			}
			footer a:link{
				color: LightBlue;
			}
			footer a:visited{
				color: MediumPurple;
			}
			@media handheld, screen and (max-device-width: 900px), (max-width: 320px), (-webkit-device-pixel-ratio: 1.5)
			{
				div#container{
					overflow:hidden;
				}
				footer{
					padding: 5% 0;
					margin-top:0;
				}
				footer h6{
					font-size:.6em;
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
			<?php
			require("Header.html");
			?>
			<!--navigation-->
			<?php
			require("Navigation.html");
			$galleryPath = "images/gallery/";
			$thumbnailPath = $galleryPath . "thumbnails/";
			$galleryImages = new SplDoublyLinkedList();
			$galleryImagesOrder;
			$directoryExisted = true;
			if (!file_exists($thumbnailPath)) {
				mkdir($thumbnailPath, 0755, true);
				$directoryExisted = false;
			}
			
			$fileReader = fopen($galleryPath . "order", "r");
			if ($fileReader) {
				$galleryImagesOrder = new SplDoublyLinkedList();
				//Process the file line by line (reading each line into $line)
				while (($line = fgets($fileReader)) !== false) {
					$galleryImagesOrder->push(substr($line, 0, -1));
				}
				fclose($fileReader);
				
				foreach (glob($galleryPath . "*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}", GLOB_BRACE) as $filePath) {
					$fileName = basename($filePath);
					$fileThumbnailPath = $thumbnailPath . $fileName;
					//If a smaller version of the image does not exist in the "images/gallery/thumbnails/ directory, create it
					if (!($directoryExisted) || !(file_exists($fileThumbnailPath))) {
						// Get original dimensions
						list($originalWidth, $originalHeight) = getimagesize($filePath);
						echo "\t\t\t<!--originalWidth: " . $originalWidth . ",\toriginalHeight: " . $originalHeight . "-->\n";
						
						$originalImage;
						$extension = substr($filePath, -4); //Last 4 characters of the filePath
						if($extension == ".jpg" || $extension == ".JPG" || $extension == "jpeg" || $extension == "JPEG")
							$originalImage = imagecreatefromjpeg($filePath);
						else if($extension == ".png" || $extension == ".PNG")
							$originalImage = imagecreatefrompng($filePath);
						else if($extension == ".gif" || $extension == ".GIF")
							$originalImage = imagecreatefromgif($filePath);
						else
							$originalImage = false;

						$croppedImage;
						if($originalWidth > $originalHeight){
							$offset = ($originalWidth - $originalHeight) / 2;
							$croppedImage = imagecrop($originalImage, ['x' => $offset, 'y' => 0, 'width' => ($originalWidth - $offset), 'height' => $originalHeight]);
							$originalWidth = $originalHeight;
						}else{
							$offset = ($originalHeight - $originalWidth) / 2;
							$croppedImage = imagecrop($originalImage, ['x' => 0, 'y' => $offset, 'width' => $originalWidth, 'height' => $originalWidth/*($originalHeight - $offset)*/]);
							$originalHeight = $originalWidth;
						}
						// Free up memory
						imagedestroy($originalImage);
						// Resample
						$newHeight = 200;
						$newWidth = $newHeight;
						$newImage = imagecreatetruecolor($newWidth, $newHeight);
						imagecopyresampled($newImage, $croppedImage, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);
						// Free up memory
						imagedestroy($croppedImage);
						// Save the image as a jpg with 90 quality
						imagejpeg($newImage, $fileThumbnailPath, 90);
						// Free up memory
						imagedestroy($newImage);
					}
					
					//Find the file name after the matching file name in $galleryImagesOrder
					$galleryImagesOrder->rewind();
					$galleryImagesOrderPosition = 0; //Used to stop if the end of the list is reached
					$galleryImagesOrderSize = $galleryImagesOrder->count(); //Number of elements in the list
					//echo "\n\t\t\t<!--fileName: " . $fileName . "-->\n";
					while($galleryImagesOrderPosition < $galleryImagesOrderSize && $galleryImagesOrder->current() != $fileName) {
						//echo "\t\t\t<!--galleryImagesOrder->offsetGet(" . $galleryImagesPosition . "): " . $galleryImagesOrder->current() . "-->\n";
						$galleryImagesOrderPosition++;
						$galleryImagesOrder->next();
					}
					
					$galleryImagesPosition = 0;
					$galleryImagesSize = $galleryImages->count();
					if($galleryImagesSize){
						//echo "\n\t\t\t<!--fileName: " . $fileName . "-->\n";
						$orderFlag = true;
						while($galleryImagesOrderPosition < $galleryImagesOrderSize && $orderFlag) {
							//echo "\t\t\t<!--galleryImagesOrder->offsetGet(" . $galleryImagesOrderPosition . "): " . $galleryImagesOrder->current() . "-->\n";
							$galleryImagesOrderPosition++;
							$galleryImagesOrder->next();
							$galleryImagesPosition = 0;
							$galleryImages->rewind();
							while($galleryImagesPosition < $galleryImagesSize && $orderFlag) {
								//echo "\t\t\t<!--galleryImagesOrder->offsetGet(" . $galleryImagesOrderPosition . "): " . $galleryImagesOrder->current() . ",\t\t\tgalleryImages->offsetGet(" . $galleryImagesPosition . "): " . $galleryImages->current() . "-->\n";
								if($galleryImages->current() == $galleryImagesOrder->current()) {
									$orderFlag = false;
									//echo "\t\t\t<!--galleryImages->current() == galleryImagesOrder->current()-->\n";
								} else {
									$galleryImagesPosition+=2;
									$galleryImages->next();
									$galleryImages->next();
								}
							}
						}
					}
					
					//Read EXIF Data (into an array defined by $exifData) if it contains a comment, otherwise set $exifData to false
					$exifData = exif_read_data($filePath, "COMMENT", true);
					
					if($galleryImagesOrderPosition < $galleryImagesOrderSize){
						$galleryImages->add($galleryImagesPosition, $fileName);
						if($exifData) $galleryImages->add($galleryImagesPosition + 1, $exifData["COMMENT"][0]);
						else $galleryImages->add($galleryImagesPosition + 1, $exifData);
					} else {
						$galleryImages->push($fileName);
						if($exifData) $galleryImages->push($exifData["COMMENT"][0]);
						else $galleryImages->push($exifData);
					}
				}
			} else { // Error opening the file.
				$galleryImagesOrder = false;
				echo "Error opening file: " . $galleryPath . "order \t " . $fileReader . "\n";
			}
			echo "\t\t\t<div id=\"thumbnails\">\n";
			$galleryImages->rewind();
			$galleryImagesPosition = 0;
			$galleryImagesSize = $galleryImages->count();
			//echo "\t\t\t\t<!--galleryImagesSize: ". $galleryImagesSize . ",\tgalleryImages->count(): " . $galleryImages->count() . "galleryImages->offsetGet(0)" . $galleryImages->offsetGet(0) . "-->\n";
			while($galleryImagesPosition < $galleryImagesSize) {
				//echo "galleryImages->offsetGet(" . $galleryImagesPosition . ")" . $galleryImages->current() . ", galleryImagesOrder->current(): " . $galleryImagesOrder->current() . "\n";
				echo "\t\t\t\t<img src=\"" . $thumbnailPath . $galleryImages->current() . "\"";
				$galleryImages->next();
				if($galleryImages->current()) {
					echo " alt=\"" . $galleryImages->current() . "\"";
				}
				echo "/>\n";
				$galleryImages->next();				
				$galleryImagesPosition+=2;
			}
			echo "\t\t\t</div><!--thumbnails-->\n";
			
			echo "\t\t\t<div id=\"gallery\">\n";
			$galleryImages->rewind();
			$galleryImagesPosition = 0;
			$galleryImagesSize = $galleryImages->count();
			while($galleryImagesPosition < $galleryImagesSize) {
				echo "\t\t\t\t<div><div><img src=\"" . $galleryPath . $galleryImages->current() . "\"";
				$galleryImages->next();
				if($galleryImages->current()) 
					echo " alt=\"" . $galleryImages->current() . "\"";
				echo "/></div></div>\n";
				$galleryImages->next();				
				$galleryImagesPosition+=2;
			}
			echo "\t\t\t</div><!--gallery-->\n";
			
			//Footer
			require("Footer.html");
			?>
		</div><!--container-->
	</body>
</html>