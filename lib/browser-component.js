/* browser-component */
;(function () {
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
      uri  = 'http://' + uri;
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