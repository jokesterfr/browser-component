/* browser-tabbar */
;(function () {
  'use strict';
  var prototype = Object.create(HTMLElement.prototype);
  var currentScript = document.currentScript;
  var template = currentScript.ownerDocument.querySelector('template#browser-tabbar');

  prototype.createdCallback = function() {
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

    // Calculate width margin
    var nb = this.querySelectorAll('browser-tab').length;
    var tabNewWidth = this.querySelector('browser-tab-new').clientWidth;
    var tabWidth = this.querySelector('browser-tab').clientWidth - 37;
    var maxtabs = (this.clientWidth - tabNewWidth) / tabWidth;
    var margin = parseInt((maxtabs - nb) * tabWidth, 10);
    if (margin < 0) this.style.left = margin + 'px';
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
      tabs[0].select(evt);
    } else {
      [].forEach.call(tabs, function (tab, i) {
        if ((i + 1) === tabs.length) {
          tab.select(evt);
        } else {
          tab.classList.remove('active');
        }
      })
    }

    // Calculate width margin
    var nb = this.querySelectorAll('browser-tab').length;
    var tabNewWidth = this.querySelector('browser-tab-new').clientWidth;
    var tabWidth = this.querySelector('browser-tab').clientWidth - 37;
    var maxtabs = (this.clientWidth - tabNewWidth) / tabWidth;
    var margin = parseInt((maxtabs - nb) * tabWidth, 10);
    this.style.left = (margin > 0 ? 0 : margin) + 'px';
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
})();