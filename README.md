Browser-component
=================

*Browser component* is a web component designed to get a browser into the browser itself. It can be used to extend a headless browser, or give some more features to a web application, such as *firefox/xulrunner* or *chrome/chromium apps*. This project comes with many sub components, to let you customize the browser of your wish.

## Overview

Get it directly by cloning this repository:

```bash
git clone https://github.com/jokesterfr/browser-component.git
```

Or use bower:

```bash
bower install browser-component
```

Import it in your page like so:

```html
<link rel="import" href="./bower_components/browser-component/browser-component.html" />
```

And use it:

```html
<browser-component type="webview" homepage="https://www.google.com">
  <browser-tabbar>
    <browser-tab url="http://www.chucknorrisfacts.com"></browser-tab>
    <browser-tab url="http://lestrans.com"></browser-tab>
    <browser-addtab></browser-addtab>
  </browser-tabbar>
  <browser-toolbar>
    <browser-navigation></browser-navigation>
    <browser-location></browser-location>
  </browser-toolbar>
</browser-component>
```

## Components API

### browser-component

Browser component can be based upon *"iframe"* element, or "webview" (default) element.

#### webview

A webview is a non standard HTML5 element, designed for usage in a __chrome/chromium__ app or extension. This component is specifically designed for safely browsing within the browser, iframe is not.
Please refer to the [following documentation](https://developer.chrome.com/apps/tags/webview) for more information. 

#### iframe

If you use an iframe, you may encounter many issues, due to protections activated by your browser. This is not recommended, and experimental. To unlock your browser protections, please read down this page the [cors-policy](CORS Policy) and [x-frame-options](X-Frame-Options) sections.

### browser-tabbar

The browser tabbar will display all tabs you filled in, you can use the selected attribute to choose the default tab to be selected (or the last one will be by default):

```html
<browser-tabbar>
  <browser-tab selected url="https://www.google.fr"></browser-tab>
  <browser-tab url="http://lestrans.com"></browser-tab>
</browser-tabbar>
```

If you add the `<browser-addtab>` component, you will be able to add some more tabs dynamically.

### browser-tab

Tabs sorting out currently browsed contents. Here are the available attributes for tabs:
* __url__: URL of the content to browse
* __selected__: Only one tabbar tab can be selected this way, selected tab url content is displayed in browser. Defaults to false.
* __closable__: If the tab can be closed (using middle-click or clicking the top-right cross). Defaults to true.
* __pinned__: Only the tab favicon is displayed, taking less space in the tabbar. Defaults to false.

### browser-add-new

Allows you to add some more tabs dynamically. To be placed right after the `<browser-tab>` element(s).

### browser-toolbar

A tool bar is a generic space to let customize the browser like you want it. You may place buttons or location fields in it, feel free to suggest any other components of your like to be used here.

### browser-button

A simple button, customizable with an icon if you specify a type like:

* __back__
* __bookmark__
* __download__
* __feed__
* __forward__
* __history__
* __home__
* __menu__
* __new-window__
* __print__
* __reload__
* __zoom-in__
* __zoom-out__
* __zoom__

The list can of course grow, feel free to submit any new one.

### browser-navigation

This component is made of a back button and a forward button. The forward button disappear when there is no next page in the browsing history. Simple.

### browser-location

The input letting you choosing how to browse the web! Comes with a go/reload button on its right, and a nice favicon retrieved from the browsed website.

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

# X-Frame-Options

Browsing web content within an iframe can be nice, but allowing your browser doing it is very risky: phishing attacks may occur! Keep that in mind.
If you already disabled CORS protection of your browser for testing purpose, you may also want to disable the `X-Frame-Options` header sent whithin the context of the iframe. For instance, if you target `http://google.com` this error will pop out in your developper console:

  Refused to display 'https://www.google.com/?gws_rd=ssl' in a frame because it set 'X-Frame-Options' to 'SAMEORIGIN'.

This is because *google* protected their website from phishing / clickjacking within an iframe. That's great, or may be not so great, depending on what your are doing. Definitely, I would not recommend the use of iframes for such a generalistic browsing purpose, but if you wanna do so:
[Ignore X-Frame Header](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe/) is a Chrome extension letting you all the nasty things you want to do within an Iframe. You can also perform this kind of stuff with Firefox, using the extension [modify-headers](https://addons.mozilla.org/fr/firefox/addon/modify-headers) for example.

You can also digg deeper into browsing threw a third party webservice, such as the yahoo api. A POOC is available on [jsfiddle](http://jsfiddle.net/dkdnaxaq/4/light/), I let you play with it, and won't support this kind of hack any time soon.

## Browser compatibility

At this date, web components are not natively supported by Firefox 32, and you won't be able to test this out.
Chrome and chromium support web components since version 35.

[Check browser compatibility](http://caniuse.com/#feat=shadowdom).

# Licence

This work is largely inspired by Firefox Australis UI.

[Mozilla Public License - Version 2.0](https://www.mozilla.org/MPL/2.0/)
