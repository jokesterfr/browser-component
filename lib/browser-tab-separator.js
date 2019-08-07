/* browser-tab-separator */
;(function () {
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