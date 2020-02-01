"use strict";
if(typeof documentBody === 'undefined')
	var documentBody = document.body;

/*Since the display attribute of 'block' is applied in a separate style.css document,
and  the display attribute of 'none' is applied in a separate mobile.css document,
and not the HTML, getComputedStyle() must be used in place of .style*/
if(isMobile & 1){
	var href = document.getElementsByTagName("nav")[0].children;
	orderList();
	prepareList();
}

setFooterDate();

/************************************************************/
/* Reorders the list relative to the page the user is on   */
/**********************************************************/
function orderList() {
	/* This will return the name of the file on the end of the page URL, or an empty string if the URL doesn't have a filename on the end. */
	var page = document.location.pathname.match(/[^\/]+$/)||[""][0];
	var nav = href[0].parentNode;
	var is404 = true;
	if(page[0] != undefined){
		for(var itterator = 1; itterator < href.length; itterator++){
			if(href[itterator].getAttribute("href") == page[0]){
				//Reorder the matching link to the beginning
				nav.insertBefore(href[itterator], href[0]);
				//Set is404 to false indicating that the links have been reordered, the current page is not index.php,
				is404 = false; //and that everything is done with regards to ordering the list
				//End the loop
				itterator = href.length;
			}
		}
	}
	/*In this case is404 being true simply means the file at the end of the URL didn't match
	the href attributes of all but the first link, and that the list has not been ordered. 
	If is404 is true, the current page is either the home page, or not in the nav bar.*/
	if(is404){
		//If the file name at the end of the page is not index.php or blank...
		if(href[0].getAttribute("href") != page[0] && page[0] != undefined){
			//the user is on a page not in the nav, so add a Navigation link at the top of the nav list.
			//href.unshift("<a href='404NotFound.php'><img src='images/404-icon.png'><span>Navigation</span></a>");
			var hrefLink = document.createElement("A"),
				imgAtr = document.createElement("IMG"),
				spanAtr = document.createElement("SPAN"),
				spanText = document.createTextNode("Navigation");
			//imgAtr.src = "images/404-icon.png";
			spanAtr.appendChild(spanText);
			hrefLink.appendChild(imgAtr);
			hrefLink.appendChild(spanAtr);
			nav.insertBefore(hrefLink, href[0]);
		}
	}
	//Place the first link on top of the second link, on top of the third link, etcetera
	for(var itterator = 0, hrefLengthMinusOne = href.length - 1; itterator < hrefLengthMinusOne; itterator++)
		href[itterator].style.zIndex = hrefLengthMinusOne - itterator;
	//Move the links down instantaneously (to be slid up later to help the user understand the nav bar is dynamic)
	for(var itterator = 1, hrefLength = href.length, linkHeight = href[0].clientHeight; itterator < hrefLength; itterator++)
		href[itterator].style.top = itterator * linkHeight;
};

/*****************************************************************/
/* Prepares the list to be dynamically expandable/collapsible   */
/***************************************************************/
function prepareList() {
	/*Used to determine the height each link needs to get up to when moving down the menu
	(created because referencing navHeight is a LOT faster than referencing
	href[0].clientHeight 1000 times every time the menu needs to be slid down)*/
	var navHeight = href[0].clientHeight;
	
	/*Put the first links span text into a variable so that we don't have to slice() off the last character every time to add on a '+' or '-' sign.
	It should be noted that navSpanText is not an HTML element (so changing it will not change the HTML span text).
	Because of that, & because href[0].children[1].textContent calls more than two child elements. navSpan is an HTML element,
	referencing navSpanText is over 60^2 times faster than href[0].children[1].textContent.
	but because it's only one call, it's still orders of magnitude faster than href[0].children[1].textContent*/
	var navSpan = href[0].children[1];
	var navSpanText = navSpan.textContent + " ";
	var navSpanTextLength = navSpanText.length - 1;
	//add a plus to the first nav link making it more obvious that it's the button to open the nav
	navSpan.textContent = navSpanText + "∨";
	/*Create a function (& appropriate variables) to hide the remaining nav links with animations that move them up,
	at a speed, and to a postion, relative to how far they are from the first nav link.
	These functions are created locally as closures so as not to make global functions that recreate these closures every time.*/
	var currentTick;
	var lastTick = Date.now(); //System time before tick changed the DOM
	var hrefFactor = -navHeight; //navHeight when the menu needs to be slid down & -navHeight when the menu needs to be slid up
	var hrefPosition = navHeight; //Used to hold the new position of the first link so as not to have to grab it from the DOM every time
	var itterator; //Used in for loops to itterate through the nav links
	var tick = function() {
		//console.log("lastTick: " + lastTick + ", hrefPosition: " + hrefPosition + ", hrefFactor: " + hrefFactor);
		currentTick = Date.now();
		hrefPosition += (currentTick - lastTick) * hrefFactor / 400;
		lastTick = currentTick;
		/* The for loop is to make this work no matter the number of links in the nav bar
		(as the function executed before this may add a link to the nav bar)*/
		for(itterator = href.length - 1; itterator > 0; itterator--)
			href[itterator].style.top = hrefPosition * itterator;
		
		//requestAnimationFrame(tickUp) will only loop tickUp if the animation can be performed: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
		if ((hrefFactor > 0 && hrefPosition < navHeight) || (hrefFactor < 0 && hrefPosition > 0))
			requestAnimationFrame(tick);
		else if (hrefFactor > 0) //To prevent rounding errors from messing up the final positions
			for(itterator = href.length - 1; itterator > 0; itterator--)
				href[itterator].style.top = navHeight * itterator;
		else //To prevent rounding errors from messing up the final postions
			for(itterator = href.length - 1; itterator > 0; itterator--)
				href[itterator].style.removeProperty("top");
	};
	//Actually slide the nav menu up
	tick();
	
	//Add an event listener to make the menu slide up & down by tapping on the first link
	href[0].addEventListener('click', function(event){
		event.preventDefault();
		if(hrefFactor < 0){
			lastTick = Date.now();
			hrefPosition = 0;
			hrefFactor = navHeight;
			tick();
			//replace the '+' with a '-' making it more obvious that it's now the button to close the nav
			navSpan.textContent = navSpanText + "∧";
		}else{
			lastTick = Date.now();
			hrefPosition = navHeight;
			hrefFactor = -navHeight;
			tick();
			//replace the '-' with a '+' making it more obvious that it's now the button to open the nav
			navSpan.textContent = navSpanText + "∨";
		}
	});
}


/*****************************************************************/
/* Sets the date in the footer to the current year */
/***************************************************************/
function setFooterDate() {
	var topFooterString = document.getElementsByTagName("footer")[0].children[0].textContent;
	var itterator;
	for (itterator = 0; topFooterString[itterator] != '©'; itterator++);
	itterator++;
	topFooterString = topFooterString.slice(0, itterator) + " " + new Date().getFullYear() + "," + topFooterString.slice(itterator);
	document.getElementsByTagName("footer")[0].children[0].textContent = topFooterString;
}