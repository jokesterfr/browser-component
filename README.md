Browser-component
=================

Browser component is a web component designed for displaying browser headers into the browser itself. It can be used to extend a headless browser, or give some more features to a web application, such as firefox/xulrunner or chrome/chromium apps. Browser component is made of many sub components, so you are free to customize your browser like you want.

## Overview

Get it by directly cloning this repository, or using bower:

```bash
bower install browser-component
```

Import it in your page like so:

```html
<link rel="import" href="./bower_components/browser-component/browser-component.html" />
```

And use it:

```html
<browser-component>
  <browser-tabsbar>
    <browser-tab url="https://www.google.fr"></browser-tab>
    <browser-tab url="http://lestrans.com"></browser-tab>
    <browser-addtab></browser-addtab>
  </browser-tabsbar>
  <browser-toolbar>
    <browser-back-button rounded></browser-back-button>
    <browser-forward-button ></browser-forward-button>
    <browser-location></browser-location>
    <browser-home-button homepage="https://www.google.fr"></browser-home-button>
    <browser-zoomin-button></browser-zoomin-button>
    <browser-zoomout-button></browser-zoomout-button>
  </browser-toolbar>
  <browser-content type="iframe"></browser-content>
</browser-component>
```

## Components API

### browser-component

TODO

### browser-tabsbar

TODO

### browser-tab>

TODO

### browser-add-tab

TODO

### browser-toolbar

TODO

### browser-button

TODO

### browser-back-button

TODO

### browser-forward-button

TODO

### browser-location

TODO

### browser-home-button

TODO

### browser-zoomin-button

TODO

### browser-zoomout-button

TODO

### browser-content

TODO

# CORS Policy

Browser's CORS (Cross-origin resource sharing) policy may prevent this component to be fully suitable for testing. If you try to launch it from a standard hosted page, or even from the locale filesystem, you may refer to these commands to start-up your brower:

## Chrome

```bash
google-chrome --disable-web-security file:///path-to-browser-component/index.html
```

## Chromium

```bash
chromium --disable-web-security file:///path-to-browser-component/index.html
```

## Firefox

Open "about:config" in a page, then modify the property "security.fileuri.strict_origin_policy" to false.

## Browser compatibility

At this date, web components are not natively supported by Firefox 32, and you won't be able to test this out.
Chrome and chromium support web components since version 35.

[Check browser compatibility](http://caniuse.com/#feat=shadowdom).

# Licence

This work is largely inspired by Firefox Australis UI.

[Mozilla Public License - Version 2.0](https://www.mozilla.org/MPL/2.0/)
