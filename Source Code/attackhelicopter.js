"use strict";
if(typeof documentBody === 'undefined')
	var documentBody = document.body;
var galleryDiv = document.getElementById('gallery');
var galleryImageDivs = galleryDiv.children;

var thumbnailDiv = document.getElementById('thumbnails');
//var thumbnailDivs = thumbnailDiv.children;
//var thumbnails = thumbnailDiv.children;


var windowHeight;
var windowWidth;

var currentImage = -1; //Index of the current gallery image in focus, -1 when no image is in focus

var backgroundDiv;

//Will be assigned to a CSS attribute in the HTML file created by grabStyle() that controls the style of galleryImageDivs
var galleryDivsStyle; //This will be used to modify the height of all the galleryImageDivs at once
//Will be assigned to a CSS attribute in the CSS file found by grabStyle() that controls the style of galleryImageDivs & thumbnailDiv.children
var columnWidthStyle; //This will be used to modify the width of galleryImageDivs & thumbnailDiv.children at once
var columnMarginStyle; //This will be used to modify the top & left margin of galleryImageDivs & thumbnailDiv.children at once
var imageColumns; //Number of columns
var columnMargin; //Percentage space between columns


removeTextNodes();
setUpBackground();
grabStyle();
resizeDivs();
loadAnimationTriggers();


function loadAnimationTriggers(){
	/*var performanceNow = performance.now();/*,
		tickTime,
		tickOpenCloseTime = 0,
		tickSideTime = 0,
		tickOpenCloseItterations = 0,
		tickSideItterations = 0;
	/*Create a function (& appropriate variables) to grow the image, center it,
	& give it a translucent black background with enough padding to fill the window.
	These functions & variables are created locally as closures so openCloseImage(itterator)
	doesn't have to recreate them every time.*/
	var lastTick; //System time before tick changed the DOM
	var nextTick; //System time after tick changed the DOM
	var nextTickFactor; //Difference of nextTick & lastTick divided by some factor
	var nextTickFactorRate; //The higher this, the slower the animation (this loosely translates to the number of miliseconds the animation should take)
	
	var finalImageWidth;       //Used to hold the new width to bring the image to
	var finalImageOpacity = 0; //Final image opacity (useful because it should always be 0 or 1)
	var finalShiftRight = 0;   //Final number of pixels the image needs to be shifted to the right
	var finalShiftUp = 0;      //Final number of pixels the image needs to be shifted up
	
	var imageWidth;   //Current image width
	var imageOpacity; //Current image opacity
	var shiftRight;   //Current number of pixels the image is shifted to the right
	var shiftUp;      //Current number of pixels the image is shifted up
	
	var imageWidthFactor;   //finalImageWidth minus initial imageWidth
	var imageOpacityFactor; //finalImageOpacity minus initial imageOpacity
	var shiftRightFactor;   //finalImagePadding minus finalShiftRight
	var shiftUpFactor;      //finalImagePadding minus finalShiftUp
	
	var galleryImages = galleryDiv.getElementsByTagName('img');
	
	/*isExecuting will be set to false when one of the functions that calls itself with requestAnimationFrame() finishes executing.
	If another animation needs to start & isExecuting is true, cancelAnimationFrame(animationFrameID) will be called*/
	var isExecuting = false;
	/*Set as the result of every recursive call to requestAnimationFrame in case it needs to be closed with cancelAnimationFrame.
	Technically the initial (non recursive) call to the "recursive" should also set this, but if a user is even able to start
	another animation before the first frame of the previous one can call a next frame, you have bigger issues. */
	var animationFrameID;
	
	//Open or close one of the images
	var tickOpenClose = function() {
		//tickTime = performance.now();
		nextTick = Date.now()
		nextTickFactor = (nextTick - lastTick) / 400;
		//console.log("nextTick: " + nextTick + ", lastTick: " + lastTick);
		lastTick = nextTick;
		imageWidth += nextTickFactor * imageWidthFactor;
		imageOpacity += nextTickFactor * imageOpacityFactor;
		shiftRight += nextTickFactor * shiftRightFactor;
		shiftUp += nextTickFactor * shiftUpFactor;
		
		//console.log("nextTickFactor: " + nextTickFactor + ", imageOpacity: " + imageOpacity + ", imageWidth: " + imageWidth + ", shiftRight: " + shiftRight + "; shiftUp: " + shiftUp + ", currentImage: " + currentImage);
		/*Surpisingly, setting each of these style attributes individually is faster than setting them all at once in a single change of the style attribute.
		This is probably due to the string concatenation of the four properties below—as well as padding & background which don't need changed otherwise.*/
		backgroundDiv.style.opacity = imageOpacity;
		galleryImages[currentImage].style.opacity = imageOpacity;
		galleryImages[currentImage].style.width = imageWidth;
		galleryImages[currentImage].style.left = shiftRight;
		galleryImages[currentImage].style.top = shiftUp;
		//tickOpenCloseItterations++;
		//tickOpenCloseTime = tickOpenCloseTime + (performance.now() - tickTime);
		
		//requestAnimationFrame(tickOpenClose) will only loop tickUp if the animation can be performed: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
		if ((finalImageOpacity && (imageWidth < finalImageWidth)) || (!finalImageOpacity && (imageWidth > finalImageWidth)))
			animationFrameID = requestAnimationFrame(tickOpenClose);
		else {//To prevent rounding errors from messing up the final position & dimensions
			backgroundDiv.style.opacity = finalImageOpacity;
			if (finalImageOpacity){
				galleryImages[currentImage].style.opacity = finalImageOpacity;
				galleryImages[currentImage].style.width = finalImageWidth;
				galleryImages[currentImage].style.left = finalShiftRight;
				galleryImages[currentImage].style.top = finalShiftUp;
			} else {
				galleryImages[currentImage].removeAttribute("style");
				currentImage = -1;
				backgroundDiv.style.zIndex = -1;
			}
			//console.log("nextTickFactor: " + nextTickFactor + ", finalImageOpacity: " + finalImageOpacity + ", finalImageWidth: " + finalImageWidth + ", finalShiftRight: " + finalShiftRight + ", finalShiftUp: " + finalShiftUp + ", currentImage: " + currentImage);
			//console.log("tickOpenClose() Time: " + tickOpenCloseTime);
			//console.log("tickOpenClose() Itterations: " + tickOpenCloseItterations);
			//console.log("\n");
			isExecuting = false;
		}
	};
	
	//Set up parameters to call tickOpenClose to close this image (made because this needs to be done in 3 different instances)
	function closeImage(){
		//If this isn't set early enough before calling tickOpenClose() the first nextTick will just be 0
		lastTick = Date.now();
		
		imageWidth = finalImageWidth;
		finalImageWidth = galleryImageDivs[0].clientWidth;
		
		imageOpacity = 1;
		finalImageOpacity = 0;
		
		shiftRight = finalShiftRight;
		shiftUp = finalShiftUp;
		
		finalShiftRight = 0;
		finalShiftUp = 0;
	
		imageWidthFactor = finalImageWidth - imageWidth;
		shiftRightFactor = finalShiftRight - shiftRight;
		shiftUpFactor = finalShiftUp - shiftUp;
		imageOpacityFactor = finalImageOpacity - imageOpacity;
	
		isExecuting = true;
		tickOpenClose();
		//currentImage is set to -1 in the terminating condition of tickOpenClose()
	}
	
	
	var tickSlideBack = function() {
		//tickTime = performance.now();
		nextTick = Date.now();
		//console.log("lastTick: " + lastTick + ", nextTick: " + nextTick + ", shiftRight: " + shiftRight + "; shiftRightFactor: " + shiftRightFactor);
		nextTickFactor = (nextTick - lastTick) / nextTickFactorRate;
		lastTick = nextTick;
		
		shiftRight += nextTickFactor * shiftRightFactor;
		
		//console.log("nextTickFactor: " + nextTickFactor + ", nextTickFactorRate: " + nextTickFactorRate + ", shiftRight: " + shiftRight);
		
		galleryImages[currentImage].style.left = shiftRight;
		//tickSlideBackItterations++;
		//tickSlideBackTime = tickSlideBackTime + (performance.now() - tickTime);
		
		/*console.log("(shiftRightFactor < 0): " + (shiftRightFactor < 0) + ", (shiftRight > finalShiftRight): " + (shiftRight > finalShiftRight) + ", (shiftRightFactor > 0): " + (shiftRightFactor > 0) + ", (shiftRight < finalShiftRight): " + (shiftRight < finalShiftRight));
		console.log(" ((shiftRightFactor < 0) && (shiftRight > finalShiftRight)): " + ((shiftRightFactor < 0) && (shiftRight > finalShiftRight)) + ", ((shiftRightFactor > 0) && (shiftRight < finalShiftRight)): " + ((shiftRightFactor > 0) && (shiftRight < finalShiftRight)));
		console.log("(((shiftRightFactor < 0) && (shiftRight > finalShiftRight)) || ((shiftRightFactor > 0) && (shiftRight < finalShiftRight))): " + (((shiftRightFactor < 0) && (shiftRight > finalShiftRight)) || ((shiftRightFactor > 0) && (shiftRight < finalShiftRight))));*/
		
		//requestAnimationFrame(tickOpen) will only loop tickUp if the animation can be performed: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
		if (((shiftRightFactor < 0) && (shiftRight > finalShiftRight)) || ((shiftRightFactor > 0) && (shiftRight < finalShiftRight)))
			animationFrameID = requestAnimationFrame(tickSlideBack);
		else {//To prevent rounding errors from messing up the final position
			documentBody.removeAttribute("style");
			galleryImages[currentImage].style.left = finalShiftRight;
			/*console.log("nextTick: " + nextTick + "; Next Image finalShiftRight: " + finalShiftRight + "; Current Image finalShiftRight: " + imageOpacity + ";");
			console.log("tickSlideBack() Time: " + tickSlideBackTime);
			console.log("tickSlideBack() Itterations: " + tickSlideBackItterations);
			console.log("\n");*/
			isExecuting = false;
		}
	};
	
	//Used to terminate the functions that call themselves with requestAnimationFrame() early
	var closeOtherFunctions = function(_callback){
		if (isExecuting) {
			cancelAnimationFrame(animationFrameID);
			documentBody.removeAttribute("style");
			//console.log("finalImageOpacity: " + finalImageOpacity + ", finalImageWidth: " + finalImageWidth + ", finalShiftRight: " + finalShiftRight);
			if (finalImageOpacity){				
				if(imageOpacity > -1 && imageOpacity < 2){
					backgroundDiv.style.opacity = finalImageOpacity;
					galleryImages[currentImage].style.opacity = finalImageOpacity;
					galleryImages[currentImage].style.width = finalImageWidth;
					galleryImages[currentImage].style.left = finalShiftRight;
					galleryImages[currentImage].style.top = finalShiftUp;
				} else {
					galleryImages[currentImage].removeAttribute("style");
					currentImage = nextImage;
					galleryImages[currentImage].style.left = finalShiftRight;
					galleryImages[currentImage].style.top = finalShiftUp;
				}
			} else {
				backgroundDiv.style.opacity = finalImageOpacity;
				galleryImages[currentImage].removeAttribute("style");
				backgroundDiv.style.zIndex = -1;
			}
		}
		_callback();
	}
	
	var container = document.getElementById("container");
	var header = container.children[0];
	var navBar = container.children[1];
	
	var imageRatio;  //image height / image width
	var windowRatio; //window height / window width
	
	var previousImage;
	var nextImage;
	
	var containerWidth;
	
	var imageDivMargin;
	
	for (var itterator = 0; itterator < galleryImages.length; itterator++) {
		//Give each image an id of its index so its index can be acquired in the event listener (so the event listener can know which image was clicked)
		galleryImages[itterator].id = itterator;
		
		//If this is a touchscreen device
		if (isMobile & 1) {
			galleryImages[itterator].addEventListener('touchstart', closeSlideImage);
			galleryImages[itterator].addEventListener('touchend', openImage);
		}
		//If this is a tablet or computer
		if (!(isMobile & 1)) {
			galleryImages[itterator].addEventListener('mousedown', closeSlideImage);
			galleryImages[itterator].addEventListener('mouseup', openImage);
		}
	}
	
	function closeSlideImage(event){
		// If event.button is 0 (left click) or undefined (a touch event)
		if (!event.button) {
			closeOtherFunctions(function() {
				if(currentImage > -1){
					event.preventDefault();
					var initialShiftRight = event.pageX;
					var initialShiftUp = event.pageY;
					var previousShiftRight; //Will be set to shiftRight every time shiftRight is given a new value
					var previousTime = 0;
					var onPointerMove; //Will be assigned to a function that either slides or closes the image after the user has finished moving it
					var leftRightMargin; //Will hold a number indicating the number of pixels between the side of the image and the window when the image is centered
					var deltaShiftRight; //event.pageX - initialShiftRight
					shiftRight = finalShiftRight;
					
					if (event.button == undefined) {
						//Move the image on touchmove
						document.addEventListener('touchmove', moveSlideClose);
						//Drop the image, remove unneeded handlers
						document.addEventListener('touchend', onPointerUp);
					} else {
						//Move the image on mousemove
						document.addEventListener('mousemove', moveSlideClose);
						//Drop the image, remove unneeded handlers
						document.addEventListener('mouseup', onPointerUp);
					}
					
					function moveSlideClose(event){
						if (event.button == undefined)
							document.removeEventListener('touchmove', moveSlideClose);
						else
							document.removeEventListener('mousemove', moveSlideClose);
						
						//If this is the rightmost image
						if(currentImage >= galleryImages.length - 1) {
							nextImage = 0;
							previousImage = currentImage - 1;
						} //If this is the leftmost image
						else if(currentImage == 0) {
							nextImage = currentImage + 1;
							previousImage = galleryImages.length - 1;
						} //If this isn't the leftmost or rightmost image
						else {
							nextImage = currentImage + 1;
							previousImage = currentImage - 1;
						}
						
						if (documentBody.clientWidth <= windowWidth)
							documentBody.style.overflowX = "hidden";
						
						shiftRight = event.pageX - initialShiftRight;
						shiftUp = event.pageY - initialShiftUp;
						
						if (shiftUp > Math.abs(shiftRight)){
							if (container.clientHeight <= windowHeight)
								documentBody.style.overflowY = "hidden";
							//While the users pointer is down, these variables will store the following values so they don't have to be recalculated in onPointerMove on each successive call
							shiftUpFactor = 2 * initialShiftUp;
							finalShiftRight = finalShiftRight - initialShiftRight; //(shiftRightFactor)
							finalShiftUp = finalShiftUp - initialShiftUp;  //(shiftUpFactor)
							onPointerMove = function(event) {
								shiftRight = finalShiftRight + event.pageX;
								shiftUp = finalShiftUp + event.pageY;
								imageWidth = finalImageWidth - (Math.abs(event.pageY - initialShiftUp) + Math.abs(event.pageX - initialShiftRight) * windowRatio) / 2;
								imageOpacity = 1 - Math.abs(event.pageY / shiftUpFactor - 0.5);
								galleryImages[currentImage].style.left = shiftRight;
								galleryImages[currentImage].style.top = shiftUp;
								galleryImages[currentImage].style.width = imageWidth;
								galleryImages[currentImage].style.opacity = imageOpacity;
								backgroundDiv.style.opacity = imageOpacity;
								/*console.log("shiftRight: " + shiftRight + ", shiftUp: " + shiftUp + ", imageWidth: " + imageWidth + ", imageOpacity: " + imageOpacity);
								console.log("pageX: " + event.pageX + ", pageY: " + event.pageY + ", initialShiftUp: " + initialShiftUp + ", initialShiftRight: " + initialShiftRight);
								console.log("finalImageWidth: " + finalImageWidth + ", |pageY - initialShiftUp|: " + Math.abs(event.pageY - initialShiftUp) + ", |pageX - initialShiftRight|: " + Math.abs(event.pageX - initialShiftRight) + ", windowRatio: " + windowRatio);*/
							};
						} else {
							imageWidth = galleryImageDivs[0].clientWidth;
							
							/**********************************************/
							/* Calculate position & size of previousImage */
							/**********************************************/
							imageRatio = galleryImages[previousImage].naturalHeight / galleryImages[previousImage].naturalWidth;
							
							//imageOpacityFactor will reflect previousImage finalImageWidth
							if(windowRatio < imageRatio) {
								imageOpacityFactor = windowHeight * 0.9 / imageRatio;
								//console.log("imageOpacityFactor: " + imageOpacityFactor + ", windowHeight: " + windowHeight + ", imageRatio: " + imageRatio);
							} else {
								imageOpacityFactor = windowWidth * 0.9;
								//console.log("imageOpacityFactor: " + imageOpacityFactor + ", windowWidth: " + windowWidth);
							}
							
							imageOpacity = (containerWidth - windowWidth) / 2 - imageOpacityFactor - imageDivMargin - (imageDivMargin + imageWidth) * (previousImage % imageColumns) + window.pageXOffset; //imageOpacity will be the initial shiftRight for previousImage
							
							shiftUpFactor = (windowHeight - imageOpacityFactor * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(previousImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset; //shiftUpFactor will be the finalShiftUp for previousImage
							
							/*console.log("previousImage: " + previousImage + ", currentImage: " + currentImage + ", nextImage: " + nextImage + ", imageColumns: " + imageColumns);
							console.log("windowHeight: " + windowHeight + ", imageHeight: " + (imageOpacityFactor * imageRatio) + ", imageDivMargin: " + imageDivMargin + ", imageWidth: " + imageWidth + ", Math.floor(previousImage / imageColumns): " + Math.floor(previousImage / imageColumns));*/
							
							/******************************************/
							/* Calculate position & size of nextImage */
							/******************************************/
							imageRatio = galleryImages[nextImage].naturalHeight / galleryImages[nextImage].naturalWidth;
							
							//imageWidthFactor will reflect nextImage finalImageWidth
							if(windowRatio < imageRatio)
								imageWidthFactor = windowHeight * 0.9 / imageRatio;
							else
								imageWidthFactor = windowWidth * 0.9;
							
							shiftRightFactor = (windowWidth + containerWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (nextImage % imageColumns) + window.pageXOffset; //shiftRightFactor will be the initial shiftRight for nextImage
							
							shiftUp = (windowHeight - imageWidthFactor * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(nextImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset; //shiftUp will be the finalShiftUp for nextImage
							
							/*console.log("windowHeight: " + windowHeight + ", imageHeight: " + (imageWidthFactor * imageRatio) + ", imageDivMargin: " + imageDivMargin + ", imageWidth: " + imageWidth + ", Math.floor(nextImage / imageColumns): " + Math.floor(nextImage / imageColumns));
							console.log("\n");*/
							
							galleryImages[previousImage].style.width = imageOpacityFactor;
							galleryImages[previousImage].style.top = shiftUpFactor;
							galleryImages[previousImage].style.left = imageOpacity;
							galleryImages[previousImage].style.opacity = 1;
							galleryImages[previousImage].style.zIndex = 3;
							
							galleryImages[nextImage].style.width = imageWidthFactor;
							galleryImages[nextImage].style.top = shiftUp;
							galleryImages[nextImage].style.left = shiftRightFactor;
							galleryImages[nextImage].style.opacity = 1;
							galleryImages[nextImage].style.zIndex = 3;
							
							//Save the space between the side of the image and the window when the image is centered
							leftRightMargin = (windowWidth - finalImageWidth) / 2;
							
							onPointerMove = function(event) {
								previousTime = Date.now();
								previousShiftRight = shiftRight;
								//How much the pointer moved right (+) or left (-) from the original position
								deltaShiftRight = event.pageX - initialShiftRight;
								shiftRight = finalShiftRight + deltaShiftRight;
								//console.log("deltaShiftRight: " + deltaShiftRight + ", leftRightMargin: " + leftRightMargin);
								if (deltaShiftRight > leftRightMargin) {
									galleryImages[previousImage].style.left = imageOpacity - leftRightMargin + deltaShiftRight;
									//console.log("imageOpacity: " + imageOpacity + ", leftRightMargin: " + leftRightMargin + ", deltaShiftRight: " + deltaShiftRight + ", previousImage position: " + (imageOpacity - leftRightMargin + deltaShiftRight));
								} else if (deltaShiftRight < -leftRightMargin) {
									galleryImages[nextImage].style.left = shiftRightFactor + leftRightMargin + deltaShiftRight;
									//console.log("shiftRightFactor: " + shiftRightFactor + ", leftRightMargin: " + leftRightMargin + ", deltaShiftRight: " + deltaShiftRight + ", nextImage position: " + (shiftRightFactor + leftRightMargin + deltaShiftRight));
								}
								galleryImages[currentImage].style.left = shiftRight;
							};
						}
						
						if (event.button == undefined)
							document.addEventListener('touchmove', onPointerMove);
						else
							document.addEventListener('mousemove', onPointerMove);
					}
					function onPointerUp() {
						//console.log("shiftUp: " + shiftUp + ", shiftRight: " + shiftRight + ", shiftRightFactor: " + shiftRightFactor + ", leftRightMargin: " + leftRightMargin + ", deltaShiftRight: " + deltaShiftRight + ", previousTime: " + previousTime);
						//If this isn't set early enough before calling tickSlideBack(), tickSide(), or tickOpenClose() the first nextTick will just be 0
						lastTick = Date.now();
						/* If the user moved the image more down than to the side, triggering the first branch determined by: if (shiftUp > Math.abs(shiftRight)) in moveSlideClose(),
							or the cursor was never moved, close image without worrying about any sliding. 
							This works because the branch in question doesn't modify previousTime from its inital 0 value,
							and not calling moveSlideClose() will also result in previousTime being left unmodified. */
						if (!previousTime) {
							if(onPointerMove) {
								finalImageWidth = galleryImageDivs[0].clientWidth;
								finalImageOpacity = 0;
								finalShiftRight = 0;
								finalShiftUp = 0;
							
								imageWidthFactor = finalImageWidth - imageWidth;
								shiftRightFactor = finalShiftRight - shiftRight;
								shiftUpFactor = finalShiftUp - shiftUp;
								imageOpacityFactor = finalImageOpacity - imageOpacity;
							
								isExecuting = true;
								tickOpenClose();
								//currentImage is set to -1 in the terminating condition of tickOpenClose()
								//console.log("Close Image Performance: " + (performance.now() - performanceNow));
							} else
								closeImage();
						}
						//If the image wasn't being moved when the user stopped touching the screen (onPointerMove hasn't been called in the last 50ms)
						else if (lastTick - 50 > previousTime){
							nextTickFactorRate = Math.log(Math.abs(deltaShiftRight) + 500) * 600 - 4000;
							//If nextImage & previousImage are off the screen & don't need to be moved
							if ((deltaShiftRight < leftRightMargin) && (deltaShiftRight > -leftRightMargin)) {
								galleryImages[previousImage].removeAttribute("style");
								galleryImages[nextImage].removeAttribute("style");
								shiftRightFactor = finalShiftRight - shiftRight;
								//console.log("shiftRightFactor: " + shiftRightFactor + ", finalShiftRight: " + finalShiftRight + ", shiftRight: " + shiftRight + ", Side Space: " + leftRightMargin);
								isExecuting = true;
								tickSlideBack();
							} else {
								/* If deltaShiftRight is less than zero, that means nextImage will be the image sharing the screen with currentImage,
									so previousImage can be forgotten about after it's CSS attributes applied by the JavaScript are removed. */
								if (deltaShiftRight < 0) {
									galleryImages[previousImage].removeAttribute("style");
									/* If currentImage is offset enough that nextImage is more on the screen than currentImage, slide currentImage out for the nextImage image.
										If the condition for this if statement is met, it means the opposite is true, and nextImage image will be slid out for currentImage. */
									if ((deltaShiftRight * -1) < (containerWidth / 2)) {
										//Set nextImage to currentImage, and currentImage to nextImage (using previousImage as a placeholder variable)
										previousImage = nextImage;
										nextImage = currentImage;
										currentImage = previousImage;
										/*tickSide() expects shiftRight to contain the shiftRight value for currentImage & shiftUp to contain the shiftRight value for nextImage.
										shiftRight already contains the shiftRight value for currentImage, so shiftRightFactor + leftRightMargin + deltaShiftRight just needs to be put into shiftUp. */
										shiftUp = shiftRightFactor + leftRightMargin + deltaShiftRight;
										//console.log("shiftUp: " + shiftUp + ", shiftRightFactor: " + shiftRightFactor + ", leftRightMargin: " + leftRightMargin + ", previousImage: " + previousImage + ", deltaShiftRight: " + deltaShiftRight);
									}
									/*If imageWidthFactor and finalImageWidth are different, reverse them (using previousImage as a placeholder variable), otherwise, don't bother.
									This ensures that finalImageWidth will be accurate for nextImage, even after it becomes currentImage. */
									else {
										/*tickSide() expects shiftRight to contain the shiftRight value for currentImage & deltaShiftRight to contain the shiftRight value for nextImage.
										The shiftRight needs to be put into deltaShiftRight, and shiftRightFactor - leftRightMargin + deltaShiftRight into shiftRight. */
										previousImage = deltaShiftRight;
										shiftUp = shiftRight;
										shiftRight = shiftRightFactor + leftRightMargin - previousImage;
										if (imageWidthFactor != finalImageWidth) {
											previousImage = imageWidthFactor;
											imageWidthFactor = finalImageWidth;
											finalImageWidth = previousImage;
										}
									}
									//tickSide() expects imageOpacity to contain the finalShiftRight value for currentImage & finalShiftRight to contain the finalShiftRight value for nextImage
									finalShiftRight = (containerWidth - finalImageWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (nextImage % imageColumns) + window.pageXOffset;
									if (Math.abs(deltaShiftRight) < (containerWidth / 2))
										imageOpacity = finalShiftRight + (windowWidth + imageWidthFactor) / 2; //imageOpacity will be the finalShiftRight for currentImage
									else
										imageOpacity = finalShiftRight - (windowWidth + imageWidthFactor) / 2;
									/*console.log("deltaShiftRight: " + deltaShiftRight);
									console.log("currentFinalShiftRight: " + imageOpacity + ", windowWidth: " + windowWidth + ", imageOpacityFactor: " + imageOpacityFactor);
									console.log("nextFinalShiftRight: " + finalShiftRight + ", containerWidth: " + containerWidth + ", finalImageWidth: " + finalImageWidth + ", imageDivMargin: " + imageDivMargin + ", (imageDivMargin + imageWidth): " + (imageDivMargin + imageWidth) + ", (nextImage % imageColumns): " + (nextImage % imageColumns) + ", pageXOffset: " + window.pageXOffset);*/
								} else if (deltaShiftRight > 0) {
									galleryImages[nextImage].removeAttribute("style");
									nextImage = previousImage;
									if (deltaShiftRight < (containerWidth / 2)) {
										previousImage = currentImage;
										currentImage = nextImage;
										nextImage = previousImage;
										shiftUp = imageOpacity - leftRightMargin + deltaShiftRight;
									} else {
										previousImage = deltaShiftRight;
										shiftUp = shiftRight;
										shiftRight = imageOpacity - leftRightMargin + previousImage;
										if (imageOpacityFactor != finalImageWidth) {
											previousImage = imageOpacityFactor;
											imageOpacityFactor = finalImageWidth;
											finalImageWidth = previousImage;
										}
									}
									finalShiftRight = (containerWidth - finalImageWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (nextImage % imageColumns) + window.pageXOffset;
									if (deltaShiftRight < (containerWidth / 2))
										imageOpacity = finalShiftRight - (windowWidth + imageOpacityFactor) / 2;
									else
										imageOpacity = finalShiftRight + (windowWidth + imageOpacityFactor) / 2;
									/*console.log("deltaShiftRight: " + deltaShiftRight);
									console.log("currentFinalShiftRight: " + imageOpacity + ", nextFinalShiftRight: " + finalShiftRight);
									console.log("\n");*/
								}
								
								if (deltaShiftRight) {
									shiftRightFactor = finalShiftRight - shiftRight;
									//console.log("shiftRightFactor: " + shiftRightFactor + ", finalShiftRight: " + finalShiftRight + ", shiftRight: " + shiftRight + ", Side Space: " + leftRightMargin);
									shiftUpFactor = imageOpacity - deltaShiftRight; //shiftUpFactor will be the shiftRightFactor for currentImage
									
									isExecuting = true;
									tickSide();
								}
							}
						} 
						//If the image was being moved when the user stopped touching the screen (onPointerMove has been called in the last 50ms)
						else {
							nextTickFactorRate = 100 + 800 * (lastTick - previousTime) / Math.abs(shiftRight - previousShiftRight);
							/*console.log("nextTickFactorRate: " + nextTickFactorRate + ", deltaShiftRight: " + deltaShiftRight);
							console.log("lastTick: " + lastTick + ", previousTime: " + previousTime + ", shiftRight: " + shiftRight + ", previousShiftRight: " + previousShiftRight);
							console.log("\n");*/
							
							//The value in previousImage will be used for the finalShiftRight for currentImage & nextImage so that it doesn't have to be recalculated
							previousTime = containerWidth / 2 - imageDivMargin + window.pageXOffset;
							//If the cursor is moving to the right
							if (shiftRight > previousShiftRight) {
								//If nextImage is on the screen, slide nextImage out for currentImage.
								if (deltaShiftRight < -leftRightMargin) {
									//If nextImage is on the screen, previousImage's attributes can be removed because it's not, & will not be, on the screen
									galleryImages[previousImage].removeAttribute("style");
									//Set nextImage to currentImage, and currentImage to nextImage (using previousImage as a placeholder variable)
									previousImage = currentImage;
									currentImage = nextImage;
									nextImage = previousImage;
									/*tickSide() expects shiftRight to contain the shiftRight value for currentImage & shiftUp to contain the shiftRight value for nextImage.
									shiftRight already contains the shiftRight value for currentImage, so shiftRightFactor + leftRightMargin + deltaShiftRight just needs to be put into shiftUp. */
									shiftUp = shiftRightFactor + leftRightMargin + deltaShiftRight;
								}
								//If nextImage is not on the screen, slide currentImage out for previousImage by making nextImage = previousImage.
								else {
									/*If nextImage is on the screen, nextImage's attributes can be removed because it's not, & will not be, on the screen.
										This is true even if previousImage isn't on the screen as currentImage is moving to the right. */
									galleryImages[nextImage].removeAttribute("style");
									nextImage = previousImage;
									if (imageOpacityFactor != finalImageWidth) {
										previousImage = imageOpacityFactor;
										imageOpacityFactor = finalImageWidth;
										finalImageWidth = previousImage;
									}
									/* If shiftUpFactor == finalShiftUp, don't bother changing finalShiftUp, but if they are different,
										set finalShiftUp = shiftUpFactor & don't bother saving finalShiftUp's value as the image it's
										attached to (currentImage) will be slid out of the window. */
									if (shiftUpFactor != finalShiftUp)
										finalShiftUp = shiftUpFactor;
									/*tickSide() expects shiftRight to contain the shiftRight value for currentImage & shiftUp to contain the shiftRight value for nextImage.
									The shiftRight needs to be put into shiftUp, and imageOpacity - leftRightMargin + deltaShiftRight into shiftRight. */
									shiftUp = shiftRight;
									shiftRight = imageOpacity - leftRightMargin + deltaShiftRight;
								}
								//imageOpacity will be the finalShiftRight for currentImage, & will be to the right of the screen as the cursor is moving to the right
								imageOpacity = previousTime + windowWidth / 1.96 - (imageDivMargin + imageWidth) * (currentImage % imageColumns);
							}
							//If the cursor is moving to the left
							else {
								//If previousImage is on the screen, slide previousImage out for currentImage.
								if (deltaShiftRight > leftRightMargin) {
									galleryImages[nextImage].removeAttribute("style");
									//Set nextImage to currentImage, and currentImage to previousImage
									nextImage = currentImage;
									currentImage = previousImage;
									
									shiftUp = imageOpacity - leftRightMargin + deltaShiftRight;
									imageOpacity = previousTime - imageOpacityFactor;
								} else {
									galleryImages[previousImage].removeAttribute("style");
									if (imageWidthFactor != finalImageWidth) {
										previousImage = imageWidthFactor;
										imageWidthFactor = finalImageWidth;
										finalImageWidth = previousImage;
									}
									if (shiftUp != finalShiftUp)
										finalShiftUp = shiftUp;
									
									shiftUp = shiftRight;
									shiftRight = shiftRightFactor + leftRightMargin + deltaShiftRight;
									imageOpacity = previousTime - imageWidthFactor;
								}
								imageOpacity = imageOpacity - windowWidth / 1.96 - (imageDivMargin + imageWidth) * (currentImage % imageColumns);
							}
							//console.log("shiftUp: " + shiftUp + ", shiftRight: " + shiftRight + ", shiftRightFactor: " + shiftRightFactor + ", leftRightMargin: " + leftRightMargin + ", deltaShiftRight: " + deltaShiftRight);
							//console.log("\n");
							//finalShiftRight will be the finalShiftRight for nextImage, & will center nextImage on the screen
							finalShiftRight = previousTime - finalImageWidth / 2 - (imageDivMargin + imageWidth) * (nextImage % imageColumns);
							
							shiftRightFactor = finalShiftRight - shiftRight;
							shiftUpFactor = imageOpacity - shiftUp; //shiftUpFactor will be the shiftRightFactor for currentImage
							
							//galleryImages[currentImage].style.left = imageOpacity;
							//galleryImages[nextImage].style.left = finalShiftRight;
							//console.log("Next Image shiftRight: " + shiftRight + ", Current Image shiftRight: " + shiftUp + ", shiftRightFactor: " + shiftRightFactor);
							//console.log("Next Image finalShiftRight: " + finalShiftRight + ", Current Image finalShiftRight: " + imageOpacity);
							
							isExecuting = true;
							tickSide();
						}
						if (event.button == undefined) {
							if (onPointerMove)
								document.removeEventListener('touchmove', onPointerMove);
							else
								document.removeEventListener('touchmove', moveSlideClose);
							document.removeEventListener('touchend', onPointerUp);
						} else {
							if (onPointerMove)
								document.removeEventListener('mousemove', onPointerMove);
							else
								document.removeEventListener('mousemove', moveSlideClose);
							document.removeEventListener('mouseup', onPointerUp);
						}
					}
				} else //Open image unless window.pageYOffset is different from imageRatio on touchend
					imageRatio = window.pageYOffset;
			});
		}
	}
	
	function openImage(event){
		//If the user hasn't moved scrolled between pointer down & pointer up
		if (imageRatio == window.pageYOffset) {
			//If this isn't set early enough before calling tickOpenClose() the first nextTick will just be 0
			lastTick = Date.now();
			
			backgroundDiv.style.top = imageRatio;
			backgroundDiv.style.left = window.pageXOffset;
			
			currentImage = ~~(event.target.id);
			
			imageWidth = event.target.clientWidth;
			
			imageDivMargin = galleryImageDivs[0].offsetTop;
			
			containerWidth = container.clientWidth;
			imageRatio = event.target.naturalHeight / event.target.naturalWidth;
			windowRatio = windowHeight / windowWidth;
			if(windowRatio < imageRatio)
				finalImageWidth = windowHeight * 0.9 / imageRatio;
			else
				finalImageWidth = windowWidth * 0.9;
			//finalShiftUp = finalShiftUp - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(currentImage / imageColumns) - containerWidth * 0.156 + window.pageYOffset;
			finalShiftUp = (windowHeight - finalImageWidth * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(currentImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset;
			finalShiftRight = (containerWidth - finalImageWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (currentImage % imageColumns) + window.pageXOffset;
			
			/*console.log("currentImage: " + currentImage + ", imageColumns: " + imageColumns);
			console.log("finalShiftUp: " + finalShiftUp + ", windowHeight: " + windowHeight + ", imageDivMargin: " + imageDivMargin + ", Math.floor(currentImage / imageColumns): " + Math.floor(currentImage / imageColumns) + ", header.clientHeight: " + header.clientHeight + ", navBar.clientHeight: " + navBar.clientHeight + ", window.pageYOffset: " + window.pageYOffset);
			console.log("finalShiftRight: " + finalShiftRight + ", containerWidth: " + containerWidth + ", imageDivMargin: " + imageDivMargin + ", imageWidth: " + imageWidth + ", (currentImage % imageColumns): " + (currentImage % imageColumns) + ", finalImageWidth: " + finalImageWidth + ", window.pageXOffset: " + window.pageXOffset);
			console.log("\n");*/
			
			imageWidthFactor = finalImageWidth - imageWidth;
			
			shiftRight = 0;
			shiftUp = 0;
			
			imageOpacity = 0;
			finalImageOpacity = 1;

			shiftRightFactor = finalShiftRight - shiftRight;
			shiftUpFactor = finalShiftUp - shiftUp;
			imageOpacityFactor = finalImageOpacity - imageOpacity;
			galleryImages[currentImage].style.zIndex = 3;
			backgroundDiv.style.zIndex = 2;
			
			isExecuting = true;
			tickOpenClose();
			//console.log("Open Image Performance: " + (performance.now() - performanceNow));
		}
	}
		
	backgroundDiv.addEventListener('click', function(){
		//performanceNow = performance.now();
		
		if(currentImage > -1){
			closeOtherFunctions(function() {
				closeImage();
				//console.log("Close Image Performance: " + (performance.now() - performanceNow));
			});
		}
	}, false);
	
	var tickSide = function() {
		//tickTime = performance.now();
		nextTick = Date.now()
		nextTickFactor = (nextTick - lastTick) / nextTickFactorRate;
		//console.log("nextTick: " + nextTick + ", lastTick: " + lastTick + ", nextTickFactor: " + nextTickFactor);
		lastTick = nextTick;
		
		shiftRight += nextTickFactor * shiftRightFactor;
		shiftUp += nextTickFactor * shiftRightFactor;
		
		//console.log("Next Image shiftRight: " + shiftRight + ", Next Image shiftRightFactor: " + shiftRightFactor);
		//console.log("Current Image shiftRight: " + shiftUp);
		galleryImages[nextImage].style.left = shiftRight;
		galleryImages[currentImage].style.left = shiftUp;
		//tickSideItterations++;
		//tickSideTime = tickSideTime + (performance.now() - tickTime);
		
		//requestAnimationFrame(tickOpen) will only loop tickUp if the animation can be performed: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
		if (((shiftRightFactor < 0) && (shiftRight > finalShiftRight)) || ((shiftRightFactor > 0) && (shiftRight < finalShiftRight)))
			animationFrameID = requestAnimationFrame(tickSide);
		else {//To prevent rounding errors from messing up the final position
			documentBody.removeAttribute("style");
			galleryImages[currentImage].removeAttribute("style");
			currentImage = nextImage;
			galleryImages[currentImage].style.left = finalShiftRight;
			//console.log("nextTick: " + nextTick + "; Next Image finalShiftRight: " + finalShiftRight + "; Current Image finalShiftRight: " + imageOpacity);
			//console.log("tickSide() Time: " + tickSideTime);
			//console.log("tickSide() Itterations: " + tickSideItterations);
			//console.log("\n");
			isExecuting = false;
		}
	};
	
	//If this is a tablet or computer
	//Don't do if this is a mobile device as such a device is very unlikely to have a keyboard & adding this event listener will only waste time
	if (!(isMobile & 1)) {
		//Add an event for Escape, ArrowRight, & ArrowLeft
		document.addEventListener("keydown", function(event){
			//performanceNow = performance.now();

			if(currentImage > -1){
				closeOtherFunctions(function() {
					//If this isn't set early enough before calling tickSide() or tickOpenClose() the first nextTick will just be 0
					lastTick = Date.now();
					
					//Close image
					if (event.code === "Escape") {
						closeImage();
						//console.log("Esc Close Image Performance: " + (performance.now() - performanceNow));
					}
					//Move left to previous image
					else if (event.code === "ArrowLeft") {
						if(imageWidth >= finalImageWidth)
							imageWidth = galleryImageDivs[0].clientWidth;
						
						shiftUp = finalShiftRight; //shiftUp will be the shiftRight for currentImage
						imageOpacity = shiftUp + (windowWidth + finalImageWidth) / 2; //imageOpacity will be the finalShiftRight for currentImage
						
						//If this is already the leftmost (previousmost) image
						if(currentImage == 0)
							nextImage = galleryImages.length - 1;
						else
							nextImage = currentImage - 1;
						
						imageRatio = galleryImages[nextImage].naturalHeight / galleryImages[nextImage].naturalWidth;
						if(windowRatio < imageRatio)
							finalImageWidth = windowHeight * 0.9 / imageRatio;
						else
							finalImageWidth = windowWidth * 0.9;
						
						shiftRight = (containerWidth - windowWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (nextImage % imageColumns) - finalImageWidth + window.pageXOffset;
						
						finalShiftRight = (windowWidth + finalImageWidth) / 2 + shiftRight;
						finalShiftUp = (windowHeight - finalImageWidth * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(nextImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset;
						
						/*console.log("currentImage: " + currentImage + ", nextImage: " + nextImage + ", imageColumns: " + imageColumns);
						console.log("Current Image finalShiftRight: " + imageOpacity + ", Current Image shiftRight: " + shiftUp + ", finalShiftUp: " + finalShiftUp + ", windowHeight: " + windowHeight + ", imageDivMargin: " + imageDivMargin + ", Math.floor(nextImage / imageColumns): " + Math.floor(nextImage / imageColumns) + ", header.clientHeight: " + header.clientHeight + ", navBar.clientHeight: " + navBar.clientHeight + ", window.pageYOffset: " + window.pageYOffset);
						console.log("Next Image finalShiftRight: " + finalShiftRight + ", Next Image shiftRight: " + shiftRight + ", containerWidth: " + containerWidth + ", imageDivMargin: " + imageDivMargin + ", imageWidth: " + imageWidth + ", (nextImage % imageColumns): " + (nextImage % imageColumns) + ", finalImageWidth: " + finalImageWidth + ", window.pageXOffset: " + window.pageXOffset);
						console.log("\n");*/
						
						shiftRightFactor = finalShiftRight - shiftRight;
						/*shiftUpFactor = imageOpacity - shiftUp;
						
						console.log("shiftRightFactor: " + shiftRightFactor + ", shiftUpFactor: " + shiftUpFactor);
						console.log("\n");
						console.log("\n");*/
						
						nextTickFactorRate = 200;
						
						if (documentBody.clientWidth <= windowWidth)
							documentBody.style.overflowX = "hidden";
						
						galleryImages[nextImage].style.width = finalImageWidth;
						galleryImages[nextImage].style.top = finalShiftUp;
						galleryImages[nextImage].style.opacity = 1;
						galleryImages[nextImage].style.zIndex = 3;
						
						/*galleryImages[nextImage].style.left = shiftRight;
						galleryImages[currentImage].style.left = imageOpacity;*/
						
						isExecuting = true;
						tickSide();
						//console.log("Shift Image Left Performance: " + (performance.now() - performanceNow));
					}
					//Move right to next image
					else if (event.code === "ArrowRight") {
						if(imageWidth >= finalImageWidth)
							imageWidth = galleryImageDivs[0].clientWidth;
						
						shiftUp = finalShiftRight; //shiftUp will be the shiftRight for currentImage
						imageOpacity = shiftUp - (windowWidth + finalImageWidth) / 2; //imageOpacity will be the finalShiftRight for currentImage
						
						//If this is already the rightmost (nextmost) image
						if(currentImage >= galleryImages.length - 1)
							nextImage = 0;
						else
							nextImage = currentImage + 1;
						
						imageRatio = galleryImages[nextImage].naturalHeight / galleryImages[nextImage].naturalWidth;
						if(windowRatio < imageRatio)
							finalImageWidth = windowHeight * 0.9 / imageRatio;
						else
							finalImageWidth = windowWidth * 0.9;
						
						shiftRight = windowWidth - imageDivMargin - (imageDivMargin + imageWidth) * (nextImage % imageColumns) + window.pageXOffset;
						
						finalShiftRight = shiftRight - windowWidth - (finalImageWidth - containerWidth) / 2;
						finalShiftUp = (windowHeight - finalImageWidth * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(nextImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset;
						
						shiftRightFactor = finalShiftRight - shiftRight;
						
						nextTickFactorRate = 200;
						
						if (documentBody.clientWidth <= windowWidth)
							documentBody.style.overflowX = "hidden";
						
						galleryImages[nextImage].style.width = finalImageWidth;
						galleryImages[nextImage].style.top = finalShiftUp;
						galleryImages[nextImage].style.opacity = 1;
						galleryImages[nextImage].style.zIndex = 3;
						
						isExecuting = true;
						tickSide();					
						//console.log("Shift Image Right Performance: " + (performance.now() - performanceNow));
					}
				});
			}
		});
	}
	
	document.addEventListener("scroll", function(event){
		if(currentImage > -1){
			backgroundDiv.style.top = window.pageYOffset;
			backgroundDiv.style.left = window.pageXOffset;
			
			imageWidth = galleryImageDivs[0].clientWidth;
			
			finalShiftRight = (containerWidth - finalImageWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (currentImage % imageColumns) + window.pageXOffset;
			finalShiftUp = (windowHeight - finalImageWidth * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(currentImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset;
			
			/*console.log("finalShiftRight: " + finalShiftRight + ", containerWidth: " + containerWidth + ", imageDivMargin: " + imageDivMargin + ", imageWidth: " + imageWidth + ", (currentImage % imageColumns): " + (currentImage % imageColumns) + ", finalImageWidth: " + finalImageWidth + ", window.pageXOffset: " + window.pageXOffset);
			console.log("finalShiftUp: " + finalShiftUp + ", windowHeight: " + windowHeight + ", imageDivMargin: " + imageDivMargin + ", Math.floor(currentImage / imageColumns): " + Math.floor(currentImage / imageColumns) + ", header.clientHeight: " + header.clientHeight + ", navBar.clientHeight: " + navBar.clientHeight + ", window.pageYOffset: " + window.pageYOffset);*/
			
			galleryImages[currentImage].style.left = finalShiftRight;
			galleryImages[currentImage].style.top = finalShiftUp;
		}
	});
	
	window.addEventListener("resize", function() {
		resizeDivs();
		
		if (currentImage > -1){
			containerWidth = container.clientWidth;
			
			imageDivMargin = galleryImageDivs[0].offsetLeft;
			
			imageWidth = galleryImageDivs[0].clientWidth;
			
			windowRatio = windowHeight / windowWidth;
			if(windowRatio < imageRatio)
				finalImageWidth = windowHeight * 0.9 / imageRatio;
			else
				finalImageWidth = windowWidth * 0.9;
			
			finalShiftRight = (containerWidth - finalImageWidth) / 2 - imageDivMargin - (imageDivMargin + imageWidth) * (currentImage % imageColumns) + window.pageXOffset;
			finalShiftUp = (windowHeight - finalImageWidth * imageRatio) / 2  - imageDivMargin - (imageDivMargin + imageWidth) * Math.floor(currentImage / imageColumns) - header.clientHeight - navBar.clientHeight + window.pageYOffset;
			
			galleryImages[currentImage].style.left = finalShiftRight;
			galleryImages[currentImage].style.top = finalShiftUp;
			galleryImages[currentImage].style.width = finalImageWidth;
		}
	});

	/*console.log("loadAnimationTriggers() Performance: " + (performance.now() - performanceNow));
	console.log("\n");*/
}


/****************************************************************/
/* Resize the divs in galleryDiv & adjust the number of columns */
/****************************************************************/
function resizeDivs(){
	imageColumns = Math.ceil(container.clientWidth / 220);
	columnMargin = 440 / ((imageColumns + 10)*(imageColumns + 10));
	columnMarginStyle.marginTop = columnMargin + "%";
	columnMarginStyle.marginLeft = columnMargin + "%";
	columnWidthStyle.width = (100 - (imageColumns + 1) * columnMargin) / imageColumns + "%";
	/*console.log("imageColumns: " + imageColumns + ", columnWidthStyle.marginLeft: " + columnWidthStyle.marginLeft + ", columnMarginStyle: " + columnMarginStyle);
	console.log("columnWidthStyle.width: " + columnWidthStyle.width + ", (100 - (imageColumns + 1) * columnMarginStyle) / imageColumns: " + (100 - (imageColumns + 1) * columnMarginStyle) / imageColumns);
	console.log(columnWidthStyle.marginLeft);
	console.log(columnWidthStyle);*/
	
	galleryDivsStyle.height = galleryImageDivs[0].clientWidth;
	
	windowHeight = backgroundDiv.clientHeight;
	//Changing the height of all the divs changes the body width & not its height for some reason
	windowWidth = backgroundDiv.clientWidth;
}

/***********************************************************************************************************************************/
/* Get the style attribute "div#thumbnails img, div#gallery div" from the appropriate CSS file & the column spacing from style.css */
/***********************************************************************************************************************************/
function grabStyle(){
	var cssStyle = document.styleSheets;
	var cssStyleLength = cssStyle.length - 2;
	
	//Save references to the CSS in the HTML document for efficiency (sacrifice memory for CPU time)
	var localCssStyle = cssStyle[cssStyleLength];
	var localCssStyleLength = localCssStyle.cssRules.length;
	
	localCssStyle.insertRule("div#gallery div{\n\n}", localCssStyleLength);
	galleryDivsStyle = localCssStyle.cssRules[localCssStyleLength].style;
	
	//console.log("cssStyleLength: " + cssStyleLength);
	
	var documentName;
	var documentNameItterator;
	
	//Loop through the documents
	for (var documentsItterator = 0; documentsItterator < cssStyleLength; documentsItterator++){
		//Save the document link & its length to local strings for increased traversal speed
		documentName = cssStyle[documentsItterator].href;
		documentNameItterator = documentName.length - 1;
		//Reverse search through the link to find the last '/' character (to cut off that character & every character before it)
		while (documentName[documentNameItterator] != "/" && documentNameItterator)
			documentNameItterator--;
		//If the file name has no '/' character, it obviously won't match, so don't waste cycles checking
		if (documentNameItterator){
			documentNameItterator++;
			//Cut off the URL part leaving only the name of each file
			documentName = documentName.substr(documentNameItterator);
			
			//Check if the name of this document matches any that we're looking for
			if (isMobile & 1) {
				if ("style.css" == documentName)
					columnMarginStyle = findStyleAttribute(cssStyle[documentsItterator].cssRules, "div#thumbnails img, div#gallery div");
				else if ("mobile.css" == documentName)
					//To be able to check that documentNameItterator is false instead of needing to waste cycles checking that isMobile is true, & that "mobile.css" == documentName again
					documentNameItterator = 0;
			} else if ("style.css" == documentName)
				//To be able to check that documentNameItterator is false instead of needing to waste cycles checking that isMobile is true, & that "mobile.css" == documentName again
				documentNameItterator = 0;
			if (!documentNameItterator){
				//Save the reference to that document
				cssStyle = cssStyle[documentsItterator].cssRules;
				//Break from the for loop
				documentsItterator = cssStyleLength;
			}
		}
	}
	
	if (isMobile & 1)
		columnWidthStyle = columnMarginStyle;
	else {
		//Find the attribute that controls the width of each image in the document
		columnWidthStyle = findStyleAttribute(cssStyle, "div#thumbnails img, div#gallery div");
		columnMarginStyle = columnWidthStyle;
	}
}

/*******************************************************************************************/
/* Find a style attribute in cssStyle that has selectorText that matches styleSelectorText */
/*******************************************************************************************/
function findStyleAttribute(cssStyle, styleSelectorText) {
	var cssStyleLength = cssStyle.length;
	//console.log("cssStyleLength: " + cssStyleLength);
	for (var documentItterator = 0; documentItterator < cssStyleLength; documentItterator++){
		if (cssStyle[documentItterator].selectorText == styleSelectorText){
			//Return the reference to that document
			return cssStyle[documentItterator].style;
		}
	}
	return false;
}

/**************************************************************************************************/
/* Add in a black background div with an opacity of 0.8 that has the height & width of the screen */
/**************************************************************************************************/
function setUpBackground(){
	var secondToLastElement = documentBody.children;
	secondToLastElement = secondToLastElement[secondToLastElement - 1];
	backgroundDiv = document.createElement("DIV")
	backgroundDiv.style = "position:absolute; background:rgba(0,0,0,0.8); width:100%; height:100%; opacity:0; z-index:-1; top:" + window.pageYOffset + "; right:" + window.pageXOffset;
	documentBody.appendChild(backgroundDiv);
}

/*************************************************************************************************/
/* Remove all the annoying text nodes in galleryDiv & thumbnailDiv created by the divs inside it */
/*************************************************************************************************/
function removeTextNodes(){
	var thumbnailNodes = thumbnailDiv.childNodes;
	var galleryNodes = galleryDiv.childNodes;
	for(var itterator = thumbnailNodes.length - 1; itterator >= 0; itterator-=2){
		thumbnailDiv.removeChild(thumbnailNodes[itterator]);
		galleryDiv.removeChild(galleryNodes[itterator]);
	}
}