/* browser-navigation */
;(function () {
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