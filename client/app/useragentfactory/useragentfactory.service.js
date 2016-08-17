'use strict';
angular.module('svampeatlasApp')
	.factory('UserAgentService', function() {

		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;



		var browserName = navigator.appName;
		var fullVersion = '' + parseFloat(navigator.appVersion);
		var majorVersion = parseInt(navigator.appVersion, 10);
		var nameOffset, verOffset, ix;

		// In Opera, the true version is after "Opera" or after "Version"
		if (nAgt.indexOf("Opera") != -1 || nAgt.indexOf("OPR/") != -1) {
			browserName = "Opera";

		} else if (nAgt.indexOf("Edge") != -1) {
			browserName = "Edge";
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((nAgt.indexOf("MSIE")) != -1) {
			browserName = "Microsoft Internet Explorer";

		}
		// In Chrome, the true version is after "Chrome" 
		else if (nAgt.indexOf("Chrome") != -1 || nAgt.indexOf("CriOS") !== -1) {
			browserName = "Chrome";

		}
		// In Safari, the true version is after "Safari" or after "Version" 
		else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
			browserName = "Safari";

		}
		// In Firefox, the true version is after "Firefox" 
		else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
			browserName = "Firefox";

		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
			(verOffset = nAgt.lastIndexOf('/'))) {
			browserName = nAgt.substring(nameOffset, verOffset);

			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}





		var isIDevice = (/iphone|ipod|ipad/i).test(nAgt);

		var isMobileIE = nAgt.indexOf('Windows Phone') > -1;


		var OSName = "Unknown OS";

		if (isMobileIE) OSName = 'Windows Phone';
		if (isIDevice) OSName = 'IOS';
		if (isIDevice && (/ipad/i).test(nAgt)) OSName = 'IOS iPad';
		if (nAgt.indexOf('Android') && !isIDevice && !isMobileIE) OSName = 'Android';
		if (nAgt.indexOf('Mobi') === -1) {
			if (navigator.appVersion.indexOf("Win") != -1 && !isMobileIE) OSName = "Windows";
			if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
			if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
			if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
		}


		return {
			getBrowser: function() {
				return browserName;
			},
			getOS: function() {
				return OSName;
			}
		}

	})
