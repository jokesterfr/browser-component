/* browser-location */
;(function () {
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