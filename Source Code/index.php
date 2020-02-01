<?php
include("bot-trap/blacklist.php");
?>
<!DOCTYPE html
Cache-Control: public, max-age=2400000, must-revalidate>
	<html lang="en">
    <head>
		<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="description" content="Northern Development: Your resource for everyday remodeling, maintenance, and repair."/>
		<title>Welcome: Northern Development</title>
		<?php
        include("headdefaults.php");
        ?>
		<script type="text/javascript" src="shrek.js" defer></script>
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
			$slideshowPath = "images/homepage slideshow/";
			$mobilePath = $slideshowPath . "mobile/";
			$slideshowImages = new SplDoublyLinkedList();
			$slideshowImagesOrder;
			$directoryExisted = true;
			if (!file_exists($mobilePath)) {
				mkdir($mobilePath, 0755, true);
				$directoryExisted = false;
			}
			
			$fileReader = fopen($slideshowPath . "order", "r");
			if ($fileReader) {
				$slideshowImagesOrder = new SplDoublyLinkedList();
				//Process the file line by line (reading each line into $line)
				while (($line = fgets($fileReader)) !== false) {
					$slideshowImagesOrder->push(substr($line, 0, -1));
				}
				fclose($fileReader);
				
				foreach (glob($slideshowPath . "*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}", GLOB_BRACE) as $filePath) {
					$fileName = basename($filePath);
					$fileMobilePath = $mobilePath . $fileName;
					//If a smaller version of the image does not exist in the "images/homepage slideshow/mobile/ directory, create it
					if (!($directoryExisted) || !(file_exists($fileMobilePath))) {
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
						imagejpeg($newImage, $fileMobilePath, 90);
						// Free up memory
						imagedestroy($newImage);
					}
					
					//Find the file name after the matching file name in $slideshowImagesOrder
					$slideshowImagesOrder->rewind();
					$slideshowImagesOrderPosition = 0; //Used to stop if the end of the list is reached
					$slideshowImagesOrderSize = $slideshowImagesOrder->count(); //Number of elements in the list
					//echo "\n\t\t\t<!--fileName: " . $fileName . "-->\n";
					while($slideshowImagesOrderPosition < $slideshowImagesOrderSize && $slideshowImagesOrder->current() != $fileName) {
						//echo "\t\t\t<!--galleryImagesOrder->offsetGet(" . $slideshowImagesPosition . "): " . $slideshowImagesOrder->current() . "-->\n";
						$slideshowImagesOrderPosition++;
						$slideshowImagesOrder->next();
					}
					
					$slideshowImagesPosition = 0;
					$slideshowImagesSize = $slideshowImages->count();
					if($slideshowImagesSize){
						//echo "\n\t\t\t<!--fileName: " . $fileName . "-->\n";
						$orderFlag = true;
						while($slideshowImagesOrderPosition < $slideshowImagesOrderSize && $orderFlag) {
							//echo "\t\t\t<!--galleryImagesOrder->offsetGet(" . $slideshowImagesOrderPosition . "): " . $slideshowImagesOrder->current() . "-->\n";
							$slideshowImagesOrderPosition++;
							$slideshowImagesOrder->next();
							$slideshowImagesPosition = 0;
							$slideshowImages->rewind();
							while($slideshowImagesPosition < $slideshowImagesSize && $orderFlag) {
								//echo "\t\t\t<!--galleryImagesOrder->offsetGet(" . $slideshowImagesOrderPosition . "): " . $slideshowImagesOrder->current() . ",\t\t\tgalleryImages->offsetGet(" . $slideshowImagesPosition . "): " . $slideshowImages->current() . "-->\n";
								if($slideshowImages->current() == $slideshowImagesOrder->current()) {
									$orderFlag = false;
									//echo "\t\t\t<!--galleryImages->current() == galleryImagesOrder->current()-->\n";
								} else {
									$slideshowImagesPosition+=2;
									$slideshowImages->next();
									$slideshowImages->next();
								}
							}
						}
					}
					
					//Read EXIF Data (into an array defined by $exifData) if it contains a comment, otherwise set $exifData to false
					$exifData = exif_read_data($filePath, "COMMENT", true);
					
					if($slideshowImagesOrderPosition < $slideshowImagesOrderSize){
						$slideshowImages->add($slideshowImagesPosition, $fileName);
						if($exifData) $slideshowImages->add($slideshowImagesPosition + 1, $exifData["COMMENT"][0]);
						else $slideshowImages->add($slideshowImagesPosition + 1, $exifData);
					} else {
						$slideshowImages->push($fileName);
						if($exifData) $slideshowImages->push($exifData["COMMENT"][0]);
						else $slideshowImages->push($exifData);
					}
				}
				
				echo "\t\t\t<div id=\"slideshow\">\n";
				$slideshowImages->rewind();
				$slideshowImagesPosition = 0;
				$slideshowImagesSize = $slideshowImages->count();
				while($slideshowImagesPosition < $slideshowImagesSize) {
					echo "\t\t\t\t<img src=\"" . $slideshowPath . $slideshowImages->current() . "\"";
					$slideshowImages->next();
					if($slideshowImages->current()) 
						echo " alt=\"" . $slideshowImages->current() . "\"";
					echo "/>\n";
					$slideshowImages->next();				
					$slideshowImagesPosition+=2;
				}
				echo "\t\t\t</div><!--slideshow-->\n";
				
			} else { // Error opening the file.
				$slideshowImagesOrder = false;
				echo "Error opening file: " . $slideshowPath . "order \t " . $fileReader . "\n";
			}
			?>
			<!--footer-->	
			<?php
			require("Footer.html");
			?>
		</div><!--container-->
	</body>
</html>