;(function () {
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