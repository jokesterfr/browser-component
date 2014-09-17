Browser-component
=================

Browser component is a web component designed for displaying browser headers into the browser itself. It can be used to extend a headless browser, or give some more features to a web application, such as firefox/xulrunner/chrome/chromium based apps.
You can get it by directly cloning this repository, or using bower:

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

### <browser-component>

TODO

### <browser-tabsbar>

TODO

### <browser-tab>

TODO

### <browser-add-tab>

TODO

### <browser-toolbar>

TODO

### <browser-button>

TODO

### <browser-back-button>

TODO

### <browser-forward-button>

TODO

### <browser-location>

TODO

### <browser-home-button>

TODO

### <browser-zoomin-button>

TODO

### <browser-zoomout-button>

TODO

### <browser-content>

TODO

# Licence

This work is a largely inspired by Firefox Australis UI.

[Mozilla Public License - Version 2.0](https://www.mozilla.org/MPL/2.0/)
