/* browser-button */
;(function () {
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