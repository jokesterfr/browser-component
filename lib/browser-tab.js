/* browser-tab */
;(function () {
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