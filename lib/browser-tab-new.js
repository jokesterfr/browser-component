/* browser-tab-new */
;(function () {
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