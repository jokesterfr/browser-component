
/* browser-button */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-button');

	// Hack url of css style
	// @see https://www.w3.org/Bugs/Public/show_bug.cgi?id=20976#c8
	var importBaseURL = document.currentScript.ownerDocument.baseURI;
	// var style = template.content.querySelector('link[rel="stylesheet"]');
	// var href = new URL(style.getAttribute('href'), importBaseURL).toString();
	// style.setAttribute('href', href);
	var style = template.content.querySelector('style');
	style.innerHTML.replace(/\"\.\.\/icons/g, importBaseURL + '/.../img');
	
	prototype.createdCallback = function() {
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));
	};
	
	document.registerElement('browser-button', {
		prototype: prototype
	});
})();
;

/* browser-tabbar */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-tabbar');

	prototype.createdCallback = function() {
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		// Register listeners
		this.addEventListener('new-tab', newTabListener, false);
		this.addEventListener('add-tab', addTabListener, false);
		this.addEventListener('closed-tab', closedTabListener, false);
		this.addEventListener('select-tab', selectTabListener, false);
	};
	
	/**
	 * Append a new tab to the bar, after the last browser-tab
	 * @param {CustomEvent} evt 
	 */
	function addTabListener(evt) {
		var tab = document.createElement('browser-tab');
		var lastTab = this.querySelector('browser-tab:last-of-type');
		if (lastTab) {
			if (lastTab.nextSibling) {
				this.insertBefore(tab, lastTab.nextSibling);
			} else {
				this.appendChild(tab);
			}
		} else {
			this.insertBefore(tab, this.firstChild);
		}

		// Calculate width margin
		var nb = this.querySelectorAll('browser-tab').length;
		var tabNewWidth = this.querySelector('browser-tab-new').clientWidth;
		var tabWidth = this.querySelector('browser-tab').clientWidth - 37;
		var maxtabs = (this.clientWidth - tabNewWidth) / tabWidth;
		var margin = parseInt((maxtabs - nb) * tabWidth, 10);
		if (margin < 0) this.style.left = margin + 'px';
	}

	/**
	 * Activate the last added tab
	 * @param {CustomEvent} evt 
	 */
	function newTabListener(evt) {
		var tabs = this.querySelectorAll('browser-tab');
		[].forEach.call(tabs, function (tab) {
			tab.classList.remove('active');
		})
		evt.detail.source.classList.add('active');
	}

	/**
	 * Close the tab and activate the last added tab
	 * @param {CustomEvent} evt 
	 */
	function closedTabListener(evt) {
		this.removeChild(evt.detail.source);
		var tabs = this.querySelectorAll('browser-tab');
		if (!tabs.length) {
			tabs[0].select(evt);
		} else {
			[].forEach.call(tabs, function (tab, i) {
				if ((i + 1) === tabs.length) {
					tab.select(evt);
				} else {
					tab.classList.remove('active');
				}
			})
		}

		// Calculate width margin
		var nb = this.querySelectorAll('browser-tab').length;
		var tabNewWidth = this.querySelector('browser-tab-new').clientWidth;
		var tabWidth = this.querySelector('browser-tab').clientWidth - 37;
		var maxtabs = (this.clientWidth - tabNewWidth) / tabWidth;
		var margin = parseInt((maxtabs - nb) * tabWidth, 10);
		this.style.left = (margin > 0 ? 0 : margin) + 'px';
	}

	/**
	 * Select the given tab
	 * @param {CustomEvent} evt 
	 */
	function selectTabListener(evt) {
		var tabs = this.querySelectorAll('browser-tab');
		[].forEach.call(tabs, function (tab) {
			tab.classList.remove('active');
		})
		evt.detail.source.classList.add('active');
	}

	document.registerElement('browser-tabbar', {
		prototype: prototype
	});
})();
;

/* browser-tab */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-tab');

	prototype.createdCallback = function () {
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		// Register inner components
		this.label = shadow.querySelector('#label');
		this.favicon = shadow.querySelector('#favicon');
		this.closeBtn = shadow.querySelector('#close-btn');

		// If an url attribute has been set
		this.url = this.getAttribute('url');

		// Fill label
		var label = this.getAttribute('label') || 'New tab';
		this.label.textContent = label;

		// Register select and close events
		this.addEventListener('click', this.select.bind(this), false);
		this.closeBtn.addEventListener('click', this.close.bind(this), false);
	};

	prototype.attachedCallback = function () {
		this.parentNode.dispatchEvent(
			new CustomEvent('new-tab', { 
				detail: { source: this },
				bubbles: true
			})
		);
	};

	prototype.attributeChangedCallback = function (attr) {
		switch (attr) {
			case 'url':
				console.log('url attribute changed!!');
				// var label = this.shadow.getElementById('label');
				break;

			case 'label':
				var label = this.getAttribute('label') || 'New tab';
				this.label.textContent = label;
				break;
		}
	};

	/**
	 * Start the loading effect on tab
	 */
	prototype.startLoading = function () {
		this.classList.add('loading');
	}

	/**
	 * Stop the loading effect on tab
	 */
	prototype.stopLoading = function () {
		this.classList.remove('loading');
	}

	/**
	 * Sets the tab title
	 * @param {String} title
	 */
	prototype.setTitle = function (title) {
		this.label.textContent = title;
	}

	/**
	 * Last tab cannot be closed
	 */
	prototype.closable = function () {
		return this.parentNode.querySelectorAll('browser-tab').length > 1;
	}

	/**
	 * Set favicon
	 * @param {Image blob} blob
	 */
	prototype.setFavicon = function (blob) {
		this.favicon.innerHTML = '';
		if (!blob) return;
		var img = document.createElement('img');
		img.src = window.URL.createObjectURL(blob);
		img.addEventListener('error', function() { img.style.display = 'none' });
		this.favicon.appendChild(img);
	}

	/**
	 * On click, select this tab as current
	 * @param {DOMEvent} evt
	 */
	prototype.select = function (evt) {
		if (evt.which === 2) {
			// middle click button case
			return this.close(evt);
		}

		if (!this.closable()) {
			this.classList.add('not-closable');
		} else {
			this.classList.remove('not-closable');
		}

		evt.stopPropagation();
		this.parentNode.dispatchEvent(
			new CustomEvent('select-tab', { 
				detail: { source: this },
				bubbles: true
			})
		);
	}

	/**
	 * On close icon click, destroy this tab
	 */
	prototype.close = function (evt) {
		evt.stopPropagation();
		if (!this.closable()) return;
		this.parentNode.dispatchEvent(
			new CustomEvent('closed-tab', { 
				detail: { source: this },
				bubbles: true
			})
		);
	}

	/**
	 * Register the element protoype
	 */
	document.registerElement('browser-tab', {
		prototype: prototype
	});
})();
;

/* browser-tab-separator */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-tab-separator');

	prototype.createdCallback = function() {	
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));
	};
	
	document.registerElement('browser-tab-separator', {
		prototype: prototype
	});
})();
;

/* browser-tab-new */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-tab-new');

	prototype.createdCallback = function() {
		var shadow = this.createShadowRoot()
		shadow.appendChild(template.content.cloneNode(true));

		this.addEventListener('click', function (evt) {
			addTab.call(this, evt);
		}.bind(this), false);
	};
	
	/**
	 * Select the current tab
	 */
	function addTab(evt) {
		evt.stopPropagation();
		evt = new CustomEvent('add-tab', { detail: { source: this }});
		this.parentNode.dispatchEvent(evt);
	}

	/**
	 * Register the element protoype
	 */
	document.registerElement('browser-tab-new', {
		prototype: prototype
	});
})();
;

/* browser-toolbar */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-toolbar');

	prototype.createdCallback = function() {
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		// Get browser parent
		this.browser = this;
		while (this.browser = this.browser.parentNode) {
			if (this.browser.tagName === 'BROWSER-COMPONENT') break;
		}

		this.addEventListener('click', function (evt) {
			evt.stopPropagation();
			if (evt.target.tagName !== 'BROWSER-BUTTON') return;
			switch (evt.target.getAttribute('type')) {
				case 'zoom-in':
					this.browser.zoomIn();
					break;
				case 'zoom-out':
					this.browser.zoomOut();
					break;
				case 'home':
					this.browser.goHome();
					break;
			}
		});
	};

	document.registerElement('browser-toolbar', {
		prototype: prototype
	});
})();
;

/* browser-navigation */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-navigation');

	prototype.createdCallback = function() {
		this.browser = this;
		while (this.browser = this.browser.parentNode) {
			if (this.browser.tagName === 'BROWSER-COMPONENT') break;
		}

		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		this.backBtn = document.createElement('browser-button');
		this.backBtn.setAttribute('type', 'back');
		this.backBtn.setAttribute('class', 'rounded disabled');
		shadow.appendChild(this.backBtn);
		this.backBtn.addEventListener('click', function (evt) {
			this.browser.back();
		}.bind(this));

		this.forwardBtn = document.createElement('browser-button');
		this.forwardBtn.setAttribute('type', 'forward');
		this.forwardBtn.setAttribute('class', 'disabled');
		shadow.appendChild(this.forwardBtn);
		this.forwardBtn.addEventListener('click', function (evt) {
			this.browser.forward();
		}.bind(this));

		// Force the button states to the browser context
		this.browser.addEventListener('loading', setButtonStates.bind(this));
		this.browser.addEventListener('idle', setButtonStates.bind(this));
		this.browser.addEventListener('tab-selected', setButtonStates.bind(this));
	};

	/**
	 * Set the states of back / forward navigation buttons
	 */
	var setButtonStates = function() {
		if (this.browser.canGoForward()) {
			this.forwardBtn.classList.remove('disabled');
			this.forwardBtn.classList.add('show');
		} else {
			this.forwardBtn.classList.add('disabled');
		}

		if (this.browser.canGoBack()) {
			this.backBtn.classList.remove('disabled');
		} else {
			this.backBtn.classList.add('disabled');
		}
	}

	document.registerElement('browser-navigation', {
		prototype: prototype
	});
})();
;

/* browser-location */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-location');

	prototype.createdCallback = function() {	
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		// Get browser parent
		this.browser = this;
		while (this.browser = this.browser.parentNode) {
			if (this.browser.tagName === 'BROWSER-COMPONENT') break;
		}

		// Create control button (stop / reload)
		this.controlButton = document.createElement('browser-button');
		this.controlButton.setAttribute('type', 'reload');
		this.controlButton.classList.add('blue');
		shadow.appendChild(this.controlButton);
		this.controlButton.addEventListener('click', function (evt) {
			switch (this.controlButton.getAttribute('type')) {
				case 'reload':
					this.browser.reload();
					break;
				case 'stop':
					this.browser.stop();
					break;
			}
		}.bind(this));

		// Listen input change
		this.input = shadow.querySelector('input');
		this.input.addEventListener('keypress', function (evt) {
			if (evt.keyIdentifier !== 'Enter') return;
			this.browser.go(this.input.value);
		}.bind(this), false);

		// Listen to external notifications
		this.browser.addEventListener('loading', function (evt) {
			if (!evt || !evt.detail || !evt.detail.uri) return;
			this.input.value = decodeURIComponent(evt.detail.uri);
			this.controlButton.setAttribute('type', 'stop');
		}.bind(this));

		this.browser.addEventListener('idle', function (evt) {
			if (!evt || !evt.detail || !evt.detail.uri) return;
			this.input.value = decodeURIComponent(evt.detail.uri);
			this.controlButton.setAttribute('type', 'reload');
		}.bind(this));

		this.browser.addEventListener('tab-selected', function (evt) {
			if (!evt || !evt.detail || !evt.detail.uri) return;
			if (evt.detail.loading) {
				this.controlButton.setAttribute('type', 'stop');
			} else {
				this.controlButton.setAttribute('type', 'reload');
			}
			this.input.value = decodeURIComponent(evt.detail.uri);
		}.bind(this));
	};
	
	document.registerElement('browser-location', {
		prototype: prototype
	});
})();
;

	(function () {
		'use strict';

		/**
		 * Generate a custom webview
		 * @param {DOMElement browser-tab} tab
		 * @return {DOMElement webview}
		 */
		window.customWebview = function (tab) {
			var webview = new WebView();
			webview.tab = tab;
	
			webview.addEventListener('loadstart', function (evt) {
				evt.stopPropagation();

				// Timeout to avoid any blinking effects with the tab loader
				if (webview.t) clearTimeout(webview.t);
				if (webview.classList.contains('active')) {
					// Only active webview exposes event to the parent
					webview.dispatchEvent(new CustomEvent('loading', {
						detail: { uri: webview.src }
					}));
				}
				webview.loading = true;
				webview.tab.startLoading();
			});

			webview.addEventListener('loadstop', function (evt) {
				evt.stopPropagation();

				// Timeout to avoid any blinking effects with the tab loader
				if (webview.t) clearTimeout(webview.t);
				webview.t = setTimeout(function () {
					if (webview.classList.contains('active')) {
						// Only active webview exposes event to the parent
						webview.dispatchEvent(new CustomEvent('idle', {
							detail: { uri: webview.src  }
						}));
					}
					webview.loading = false;
					webview.tab.stopLoading();
				}, 300);
			}.bind(webview));

			webview.addEventListener('contentload', function (evt) {
				evt.stopPropagation();

				// Check if domain changed
				var anchor = document.createElement('a');
				anchor.href = webview.src;
				var domain = anchor.protocol + '//' + anchor.hostname;
				if (webview.domain !== domain) {
					webview.dispatchEvent(
						new CustomEvent('domain-changed', { 
							detail: { domain: domain },
							bubbles: true
						})
					);
				}
				webview.domain = domain;

				// Update tab title
				webview.executeScript(
					{ code: 'document && document.title' },
					function (title) {
						if (title && title[0] && title[0].length) {
							webview.tab.setTitle(title);
						} else {
							var path = webview.src.split('/');
							webview.tab.setTitle(path[path.length - 1]);
						}
					}
				);

			});

			webview.addEventListener('loadabort', function (evt) {
				evt.stopPropagation();

				// Reset tab loader
				if (webview.classList.contains('active')) {
					// Only active webview exposes event to the parent
					webview.dispatchEvent(new CustomEvent('idle', {
						detail: { uri: webview.src }
					}));
				}
				webview.loading = false;
				webview.tab.stopLoading();
			});

			webview.addEventListener('newwindow', function (evt) {
				var newwebview = document.createElement('webview');
				document.body.appendChild(newwebview);
				evt.window.attach(newwebview);
			});

			webview.addEventListener('permissionrequest', function (evt) {
				if (evt.permission === 'media') evt.request.allow();
			});

			webview.style.webkitTransition = 'opacity 250ms';
			webview.addEventListener('unresponsive', function () {
				webview.style.opacity = '0.5';
			});

			webview.addEventListener('responsive', function () {
				webview.style.opacity = '1';
			});

			/**
			 * On domain change, update favicon
			 * @param {DOMEvent} evt
			 */
			webview.addEventListener('domain-changed', function (evt) {
				webview.getFavicon(evt.detail.domain);
			});

			/**
			 * Get the page favicon
			 * @param {String} baseuri - like "http://google.com"
			 * @param {String} ext - ico or png
			 */
			webview.getFavicon = function (baseuri, ext) {
				ext = ext || 'ico';
				var anchor = document.createElement('a');
				anchor.href = webview.src;
				var uri = baseuri + '/favicon.' + ext;

				var xhr = new XMLHttpRequest();
				xhr.open('GET', uri, true);
				xhr.responseType = 'blob';
				xhr.onload = function (evt) {
					if (this.status === 200) {
						var type = ext === 'png' ? 'image/png' : 'image/x-icon';
						var blob = new Blob([this.response], { type: type });
						if (blob.size) {
							return webview.tab.setFavicon(blob);
						}
					}
					if (ext === 'ico') {
						// Retry with png if ico not found or empty
						webview.getFavicon(baseuri, 'png');
					} else {
						// Reset icon
						return webview.tab.setFavicon(null);
					}
				};
				xhr.send();
			}

			webview.attributeChangedCallback = function (attr) {
				console.log(attr);
			}

			return webview;
		};
	})();
;

	(function () {
		'use strict';
		var prototype = Object.create(HTMLElement.prototype);
		var template = document.currentScript.ownerDocument.querySelector('template#browser-component');

		prototype.createdCallback = function () {
			this.shadow = this.createShadowRoot();
			this.shadow.appendChild(template.content.cloneNode(true));
			this.content = this.shadow.querySelector('content');

			// Register listeners
			this.addEventListener('new-tab', newTabListener.bind(this));
			this.addEventListener('closed-tab', closedTabListener.bind(this));
			this.addEventListener('select-tab', selectTabListener.bind(this));
		};

		prototype.attributeChangedCallback = function () {
			console.log('browser component attribute changed!!');
		};

		/** 
		 * Tells the current webview to go to a specific uri
		 * @param {String} uri
		 */
		prototype.go = function (uri) {
			if (uri === this.currentWebView.src) return;
			if (!uri) uri = this.getAttribute('defaultPage');

			var parser = document.createElement('a');
			parser.href = uri;
			if (parser.protocol === 'chrome-extension:') {
				uri	= 'http://' + uri;
			}

			this.currentWebView.src = uri;
		};

		/**
		 * Tells the current webview to go to the default uri
		 */
		prototype.goHome = function () {
			this.currentWebView.src = this.getAttribute('defaultPage');
		};

		/** 
		 * Zoom-in the current webview
		 */
		prototype.zoomIn = function () {
			var webview = this.currentWebView;
			webview.getZoom(function (level) {
				level = level > 0 ? level + 0.1 : 1.1;
				if (level > 3) level = 3;
				webview.setZoom(level);
			});
		};

		/** 
		 * Zoom-out the current webview
		 */
		prototype.zoomOut = function () {
			var webview = this.currentWebView;
			webview.getZoom(function (level) {
				level = level > 0 ? level - 0.1 : 0.9;
				if (level < 0.1) level = 0.1;
				webview.setZoom(level);
			});
		};

		/** 
		 * Stop the current webview
		 */
		prototype.stop = function () {
			this.currentWebView.stop();
		};

		/** 
		 * Reload the current webview
		 */
		prototype.reload = function () {
			this.currentWebView.reload();
		};

		/**
		 * Tells the current webview to go back
		 * @return {Boolean} previous history state
		 */
		prototype.back = function() {
			return this.currentWebView.back();
		}

		/**
		 * Tells the current webview to go forward
		 * @return {Boolean} previous history state
		 */
		prototype.forward = function() {
			return this.currentWebView.forward();
		}

		/**
		 * Check if the current webview can go back
		 * @return {Boolean} previous history state
		 */
		prototype.canGoBack = function() {
			return this.currentWebView.canGoBack();
		}

		/**
		 * Check if the current webview can go forward
		 * @return {Boolean} previous history state
		 */
		prototype.canGoForward = function() {
			return this.currentWebView.canGoForward();
		}

		/**
		 * Shows the browser top controls
		 */
		prototype.showControls = function() {
			this.removeAttribute('controls');
		}

		/**
		 * Shows the browser top controls
		 */
		prototype.hideControls = function() {
			this.setAttribute('controls', 'hidden');
		}

		/**
		 * Create a webview for the given new tab
		 * @param {CustomEvent} evt
		 */
		function newTabListener(evt) {
			var webview = customWebview(evt.detail.source);
			this.shadow.insertBefore(webview, this.shadow.nextSibling);
			selectTabListener.call(this, evt);
			this.go(evt.detail.source.url);
		}

		/**
		 * Delete the webview of the given tab
		 * @param {CustomEvent} evt
		 */
		function closedTabListener(evt) {
			var webviews = this.shadow.querySelectorAll('webview');
			[].forEach.call(webviews, function (webview) {
				if (webview.tab === evt.detail.source) {
					this.shadow.removeChild(webview);
					return;
				}
			}.bind(this));
		}

		/**
		 * Select the webview of the given tab
		 * @param {CustomEvent} evt
		 */
		function selectTabListener(evt) {
			var webviews = this.shadow.querySelectorAll('webview');
			[].forEach.call(webviews, function (webview) {
				if (webview.tab === evt.detail.source) {
					if (webview !== this.currentWebView) {
						if (this.currentWebView) {
							this.currentWebView.classList.remove('active');
						}
						webview.classList.add('active');
						this.currentWebView = webview;
						this.dispatchEvent(new CustomEvent('tab-selected', {
							detail: { 
								uri: this.currentWebView.src,
								loading: webview.loading
							}	
						}));
					}
					return;
				}
			}.bind(this));
		}

		document.registerElement('browser-component', {
			prototype: prototype
		});
	})();
