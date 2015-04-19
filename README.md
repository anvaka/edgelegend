# edgelegend

Creates dat.gui legend to change ngraph.pixel edges. [Click here](https://anvaka.github.io/ngraph.pixel/demo/edit/index.html)
to see the demo of this plugin.

# usage

``` js
var renderGraph = require('ngraph.pixel');
var createLegend = require('edgelegend');

var renderer = renderGraph(graph, {
  settings: true // show the settings ui
});

// add a new group called "Groups", with two colors:
createLegend(renderer, 'Groups', [{
  name: 'First',
  color: 0xff0000,
  filter: function(link) {
    return link.fromId <= 50;
  }
}, {
  name: 'Second',
  color: 0x00ff00,
  filter: function(link) {
    return link.fromId > 50;
  }
}]);
```


# install

With [npm](https://npmjs.org) do:

```
npm install edgelegend
```

# license

MIT
