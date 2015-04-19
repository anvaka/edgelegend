module.exports = createLegend;

function createLegend(renderer, folderName, legend) {
  var allSettings = renderer.settings();
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
        renderer.linkColor(link.id, model[item.name]);
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
      graph.addLink(link.fromId, link.toId);
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
      '<span>',
      '<input type="checkbox" name="checkbox" id="' + name + '" class="toggle" value="value" checked>',
      '<label for="' + name + '">' + name + '</label>',
      '</span>'
    ].join('\n');
  }
}
