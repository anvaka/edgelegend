module.exports = createLegend;

function createLegend(allSettings, folderName, legend) {
  var renderer = allSettings.renderer();
  var gui = allSettings.gui();
  var group = gui.addFolder(folderName);
  var model = Object.create(null);
  var hiddenLinks = Object.create(null);

  for (var i = 0; i < legend.length; ++i) {
    var item = legend[i];
    model[item.name] = item.color;
    hiddenLinks[item.name] = [];
    group.addColor(model, item.name)
      .onChange(colorLinks)
      .name(toggle(item.name));
  }

  group.open();

  listToToggleEvents();
  colorLinks();

  function listToToggleEvents() {
    var checkboxes = group.domElement.querySelectorAll('input.toggle');

    for (var i = 0; i < checkboxes.length; ++i) {
      checkboxes[i].addEventListener('change', handleChange, false);
    }

    function handleChange(e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.checked) {
        showGroup(this.id);
      } else {
        hideGroup(this.id);
      }
    }
  }

  function colorLinks() {
    var graph = renderer.graph();
    graph.forEachLink(colorLink);
    renderer.focus();

    function colorLink(link) {
      for (var i = 0; i < legend.length; ++i) {
        var item = legend[i];
        if (!item.filter(link)) continue;
        var ui = renderer.getLink(link.id);
        if (ui) {
          ui.fromColor = model[item.name];
          ui.toColor = model[item.name];
        }
        return;
      }
    }
  }

  function showGroup(groupName) {
    var links = hiddenLinks[groupName];
    if (!links) return;

    var graph = renderer.graph();
    graph.beginUpdate();
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      graph.addLink(link.fromId, link.toId, link.data);
    }
    graph.endUpdate();

    links.splice(0, links.length);
    colorLinks();
  }

  function hideGroup(groupName) {
    var links = hiddenLinks[groupName];
    if (!links) return;
    var legendItem = getLegendItemByName(groupName);
    if (!legendItem) return;

    var graph = renderer.graph();
    graph.forEachLink(noteLinksToRemove);

    graph.beginUpdate();
    for (var i = 0; i < links.length; ++i) {
      graph.removeLink(links[i]);
    }
    graph.endUpdate();

    colorLinks();

    function noteLinksToRemove(link) {
      if (legendItem.filter(link)) links.push(link);
    }
  }

  function getLegendItemByName(name) {
    for (var i = 0; i < legend.length; ++i) {
      if (legend[i].name === name) return legend[i];
    }
  }

  function toggle(name) {
    return [
      '<span style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">',
      '<input type="checkbox" name="checkbox" id="' + name + '" class="toggle" value="value" checked>',
      '<label for="' + name + '">' + name + '</label>',
      '</span>'
    ].join('\n');
  }
}
