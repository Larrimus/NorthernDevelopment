"use strict";

startSlideShow(initializeSlideShow());

function initializeSlideShow() {
	var slideshowDiv = document.getElementById('slideshow');
	var slideshowImages = slideshowDiv.children;
	//Prepare the slideshow division for the animation
	slideshowDiv.position = "relative";
	//Image pixel height * image width on the page / image pixel width
	//This is necessary instead of straight up grabbing the image height on the page, as the image height on the page defaults to 0.
	slideshowDiv.style.height = slideshowImages[0].naturalHeight * slideshowImages[0].clientWidth / slideshowImages[0].naturalWidth;
	window.addEventListener("resize", function() {
		slideshowDiv.style.height = slideshowImages[0].naturalHeight * slideshowImages[0].clientWidth / slideshowImages[0].naturalWidth;
	});
	return slideshowImages;
}

function startSlideShow(slideshowImages) {
	var itterator;
	//Itterate down to zero so that the slideshow actually starts on the first image
	for (itterator = slideshowImages.length - 1; itterator > 0; itterator--)
		slideshowImages[itterator].style.opacity = 0.0;

	var previousImage; //Sacrifice memory for about two CPU cycles per slide by keeping track of the previous image to be hidden only after the next image has acheived 100% opacity
	var currentImageOpacity; //Use this instead of referencing the DOM every time the current images opacity needs to be checked
	var lastTick;
	var currentTick;

	//Do something (the transition to the next image) every 6 seconds
	setInterval(function () {
		//Fade the new image in over 2 seconds
		lastTick = Date.now();
		
		previousImage = slideshowImages[itterator];
		
		//Loop the itterator from 0 to one minus the number of images
		if(itterator < slideshowImages.length - 1)
			itterator++;
		else //And back again
			itterator = 0;
		
		//Give the next image a higher z-index to put it in front
		slideshowImages[itterator].style.zIndex = 1;
		//and the previous image a lower z-index to put it in the back
		previousImage.style.zIndex = 0;
		
		currentImageOpacity = 0;	
		tick();
		
	}, 6000);

	function tick() {
		currentTick = Date.now();
		currentImageOpacity += (currentTick - lastTick) / 2000; //milliseconds
		lastTick = currentTick;
		
		slideshowImages[itterator].style.opacity = currentImageOpacity;
		
		//requestAnimationFrame(tick) will only loop tick if the animation can be performed: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
		if (currentImageOpacity < 1)
			requestAnimationFrame(tick);
		else { //Only hide the previous image once the next one has become completely opaque
			previousImage.style.opacity = 0.0;
			slideshowImages[itterator].style.opacity = 1.0;
		}
	}
}