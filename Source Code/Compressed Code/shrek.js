"use strict";function initializeSlideShow(){var t=document.getElementById("slideshow"),e=t.children;return t.position="relative",t.style.height=e[0].naturalHeight*e[0].clientWidth/e[0].naturalWidth,window.addEventListener("resize",function(){t.style.height=e[0].naturalHeight*e[0].clientWidth/e[0].naturalWidth}),e}function startSlideShow(t){var e,i,n,l,a;for(e=t.length-1;0<e;e--)t[e].style.opacity=0;function o(){a=Date.now(),n+=(a-l)/2e3,l=a,(t[e].style.opacity=n)<1?requestAnimationFrame(o):(i.style.opacity=0,t[e].style.opacity=1)}setInterval(function(){l=Date.now(),i=t[e],e<t.length-1?e++:e=0,t[e].style.zIndex=1,i.style.zIndex=0,n=0,o()},6e3)}startSlideShow(initializeSlideShow());