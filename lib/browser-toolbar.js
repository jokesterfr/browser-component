/* browser-toolbar */
;(function () {
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