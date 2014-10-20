
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
		var self = this;
		
		// Create shadow dom
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
		var self = this;
		
		// Create shadow dom
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
		tab.setAttribute('url', 'https://google.com');
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
			tabs[0].classList.add('active');
		} else {
			[].forEach.call(tabs, function (tab, i) {
				if ((i + 1) === tabs.length) {
					tab.classList.add('active');
				} else {
					tab.classList.remove('active');
				}
			})
		}
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

	// /**
	//  * Hide separator when surrounding tabs are hovered
	//  * waiting for CSS4 property: !.tab + tabSeparator { }
	//  */
	// var tabs = document.querySelectorAll('.tab');
	// [].forEach.call(document.querySelectorAll('.tabBar .tab'), function (el) {
	// 	el.addEventListener('mouseover', function (evt) {
	// 		var nextEl = el.nextElementSibling;
	// 		if (nextEl && nextEl.classList.contains('tabSeparator')) {
	// 			nextEl.classList.add('tabSeparatorHidden');
	// 		}
	// 		var prevEl = el.previousElementSibling;
	// 		if (prevEl && prevEl.classList.contains('tabSeparator')) {
	// 			prevEl.classList.add('tabSeparatorHidden');
	// 		}
	// 	});
	// 	el.addEventListener('mouseout', function (evt) {
	// 		var nextEl = el.nextElementSibling;
	// 		if (nextEl && nextEl.classList.contains('tabSeparator')) {
	// 			nextEl.classList.remove('tabSeparatorHidden');
	// 		}
	// 		var prevEl = el.previousElementSibling;
	// 		if (prevEl && prevEl.classList.contains('tabSeparator')) {
	// 			prevEl.classList.remove('tabSeparatorHidden');
	// 		}
	// 	});
	// });

})();
;

/* browser-tab */
(function () {
	'use strict';
	var prototype = Object.create(HTMLElement.prototype);
	var currentScript = document.currentScript;
	var template = currentScript.ownerDocument.querySelector('template#browser-tab');

	prototype.createdCallback = function() {
		var self = this;
		
		// Create shadow dom
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		// Register inner components
		this.close = shadow.querySelector('#close');
		this.label = shadow.querySelector('#label');
		this.favicon = shadow.querySelector('#favicon');

		// Fill label
		var label = this.getAttribute('label');
		label = label || 'New tab';
		this.label.textContent = label;

		// Register close event
		this.close.addEventListener('click', function (evt) {
			closeTab.call(self, evt);
		}, false);

		// Register select event
		this.addEventListener('click', function (evt) {
			selectTab.call(self, evt);
		}, false);
	};

	prototype.attachedCallback = function() {
		var self = this;
		var evt = new CustomEvent('new-tab', { detail: { source: self }});
		self.parentNode.dispatchEvent(evt);
	};

	prototype.attributeChangedCallback = function (attr) {
		switch (attr) {
			case 'url':
				console.log('url attribute changed!!');
				// var label = this.shadow.getElementById('label');
				break;

			case 'label':
				var label = this.getAttribute('label');
				label = label || 'New tab';
				this.label.textContent = label;
				break;
		}
	};

	/**
	 * Select the current tab
	 */
	function selectTab(evt) {
		if (evt.which === 2) {
			return closeTab.call(this, evt);
		}
		evt.stopPropagation();
		evt = new CustomEvent('select-tab', { detail: { source: this }});
		this.parentNode.dispatchEvent(evt);
	}

	/**
	 * On clicking close icon, destroy current tab
	 */
	function closeTab(evt) {
		evt.stopPropagation();
		evt = new CustomEvent('closed-tab', { detail: { source: this }});
		this.parentNode.dispatchEvent(evt);
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
		var self = this;
		
		// Create shadow dom
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
		var self = this;
		
		// Create shadow dom
		var shadow = this.createShadowRoot()
		shadow.appendChild(template.content.cloneNode(true));

		// Register new tab event
		this.addEventListener('click', function (evt) {
			addTab.call(self, evt);
		}, false);
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
		var self = this;
		
		// Create shadow dom
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));
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
		var self = this;
		
		// Create shadow dom
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));

		var button = document.createElement('browser-button');
		button.setAttribute('type', 'back');
		button.classList.add('rounded');
		shadow.appendChild(button);

		var button = document.createElement('browser-button');
		button.setAttribute('type', 'forward');
		button.classList.add('hidable');
		shadow.appendChild(button);

		var browser = self;
		while (browser = browser.parentNode) {
			if (browser.tagName === 'BROWSER-COMPONENT') break;
		}
		browser.addEventListener('history-changed', function (evt) {
			console.log('TODO');
		});
	};
	
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
		var self = this;
		
		// Create shadow dom
		var shadow = this.createShadowRoot();
		shadow.appendChild(template.content.cloneNode(true));
		var button = document.createElement('browser-button');
		button.setAttribute('type', 'reload');
		button.classList.add('blue');
		shadow.appendChild(button);

		// Get browser parent
		var parent = self;
		while (parent = parent.parentNode) {
			if (parent && parent.tagName.toLowerCase() === 'browser-component') break;
		}

		// Listen input change
		var input = shadow.querySelector('input');
		input.addEventListener('keypress', function (evt) {
			button.setAttribute('type', 'forward');
		}, false);

		input.addEventListener('change', function (evt) {
			evt = new CustomEvent('location-changed', {
				detail: {
					uri: input.value
				}
			});
			parent.dispatchEvent(evt);
		}, false);
	};
	
	document.registerElement('browser-location', {
		prototype: prototype
	});
})();
;

	(function () {
		'use strict';
		var prototype = Object.create(HTMLElement.prototype);
		var template = document.currentScript.ownerDocument.querySelector('template#browser-component');

		prototype.createdCallback = function () {
			var shadow = this.createShadowRoot();
			shadow.appendChild(template.content.cloneNode(true));
			var content = shadow.querySelector('content');

			// Add browser against type
			switch (this.getAttribute('type')) {
				case 'iframe':
					var iframe = document.createElement('iframe');
					iframe.setAttribute('id', 'browser');
					iframe.setAttribute('width', '100%');
					iframe.setAttribute('height', '100%');
					iframe.setAttribute('frameBorder', '0');
					iframe.setAttribute('seamless', 'seamless');
					iframe.setAttribute('sandbox', 'allow-forms allow-scripts allow-top-navigation allow-same-origin');
					content.parentNode.insertBefore(iframe, content.nextSibling);
					break;
				case 'webview':
				default:
					var webview = document.createElement('webview');
					webview.setAttribute('id', 'browser');
					content.parentNode.insertBefore(webview, content.nextSibling);
					break;
			}
			this.addEventListener('select-tab', function () {
				console.log('lfkdfldkjldfkjk')
			});

			this.addEventListener('location-changed', function (evt) {
				var uri = evt.detail.uri;
				shadow.querySelector('#browser').src = uri;
			});
		};

		prototype.attributeChangedCallback = function () {
			console.log('browser component attribute changed!!');
		};

		document.registerElement('browser-component', {
			prototype: prototype
		});
	})();
