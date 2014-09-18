/**
 * A class for finding a website’s favicon URL, if any. Requires a context, like
 * a browser extension, that allows cross-origin requests.
 * Largely inspired by work from Disconnect, Inc.:
 * @see https://github.com/disconnectme/favicon
 * @licence Mozilla Public Licence
 */
(function(global) {
	'use strict';
	var _protocols = ['http://', 'https://'];
	var _subdomains = ['www.'];
	var _paths = [ '/favicon.ico' ];
	var _anchor = document.createElement('a');

	var getFavicon = function(url, callback) {
		var favicon = this.getAlt();
		if (typeof favicon != 'undefined') {
			return callback(favicon);
		}

		if (url.indexOf('/') + 1) {
			_anchor.href = url;
			url = _anchor.hostname;
		}

		var domain = url.slice(url.indexOf('.') + 1);

		_subdomains = [''].concat(_subdomains);
		for (var i = 0; i < _protocols.length; i++) {
			for (var j = 0; j < _subdomains.length; j++) {
				for (var k = 0; k < _paths.length; k++) {
					favicon = _protocols[i] + _subdomains[j] + url + _paths[k];
					console.log(favicon)
					var xhr = new XMLHttpRequest();
					xhr.open('GET', favicon, true);
					xhr.onload = function(e) {
						if (this.status == 200) {
							var type = xhr.getResponseHeader('Content-Type');
							if (type && type.indexOf('image/') + 1 && data) {
								return callback(favicon);
							}
						}
					};
					xhr.send();
				}
			}
		}
		return null;
	}

	// export
	global.getFavicon = getFavicon;
})(window);