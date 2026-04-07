(function() {
  var DATA = window.NETWORK_DATA;
  var PROJECTS = DATA.PROJECTS;
  var PEOPLE = DATA.PEOPLE;
  var CONNECTIONS = DATA.CONNECTIONS;
  var CATEGORY_COLORS = DATA.CATEGORY_COLORS;

  var peopleMap = {};
  PEOPLE.forEach(function(p) { peopleMap[p.id] = p; });

  function getConnectionLabel(sourceId, targetId) {
    for (var i = 0; i < CONNECTIONS.length; i++) {
      var c = CONNECTIONS[i];
      if ((c.source === sourceId && c.target === targetId) ||
          (c.source === targetId && c.target === sourceId)) {
        return c.label;
      }
    }
    return null;
  }

  function getPrimaryColor(person) {
    if (!person.tags || !person.tags.length) return '#888';
    return CATEGORY_COLORS[person.tags[0]] || '#888';
  }

  function buildPersonChip(p, projectPeople) {
    var color = getPrimaryColor(p);
    var connLabel = projectPeople[0] !== p.id
      ? getConnectionLabel(projectPeople[0], p.id)
      : null;
    var roleText = connLabel || p.role;

    var a = document.createElement('a');
    a.href = 'index.html#' + p.id;
    a.className = 'person-chip';

    var dot = document.createElement('span');
    dot.className = 'person-dot';
    dot.style.background = color;

    var info = document.createElement('div');
    info.className = 'person-info';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'person-name';
    nameSpan.textContent = p.name;

    var roleSpan = document.createElement('span');
    roleSpan.className = 'person-role-label';
    roleSpan.textContent = roleText;

    info.appendChild(nameSpan);
    info.appendChild(roleSpan);

    var badge = document.createElement('span');
    badge.className = 'tier-badge ' + p.tier;
    badge.textContent = p.tier;

    a.appendChild(dot);
    a.appendChild(info);
    a.appendChild(badge);

    return a;
  }

  function renderProjects() {
    var container = document.getElementById('projects-list');

    PROJECTS.forEach(function(project, idx) {
      var card = document.createElement('div');
      card.className = 'project-card' + (idx === 0 ? ' open' : '');

      var people = project.people.map(function(id) { return peopleMap[id]; }).filter(Boolean);

      // Header
      var header = document.createElement('div');
      header.className = 'project-header';

      var headerLeft = document.createElement('div');
      headerLeft.className = 'project-header-left';

      var title = document.createElement('div');
      title.className = 'project-title';
      title.textContent = project.title;

      var meta = document.createElement('div');
      meta.className = 'project-meta';

      var typeSpan = document.createElement('span');
      typeSpan.className = 'project-type';
      typeSpan.textContent = project.type;

      var countSpan = document.createElement('span');
      countSpan.className = 'project-people-count';
      countSpan.textContent = people.length + ' people';

      meta.appendChild(typeSpan);
      meta.appendChild(countSpan);
      headerLeft.appendChild(title);
      headerLeft.appendChild(meta);

      var toggle = document.createElement('span');
      toggle.className = 'project-toggle';
      toggle.textContent = '\u203A';

      header.appendChild(headerLeft);
      header.appendChild(toggle);

      // Body
      var body = document.createElement('div');
      body.className = 'project-body';

      var desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = project.description;
      body.appendChild(desc);

      if (project.url) {
        var link = document.createElement('a');
        link.href = project.url;
        link.target = '_blank';
        link.className = 'project-link';
        link.textContent = '\u25B6 Watch / View \u2192';
        body.appendChild(link);
      }

      var grid = document.createElement('div');
      grid.className = 'people-grid';

      people.forEach(function(p) {
        grid.appendChild(buildPersonChip(p, project.people));
      });

      body.appendChild(grid);

      card.appendChild(header);
      card.appendChild(body);

      header.addEventListener('click', function() {
        card.classList.toggle('open');
      });

      container.appendChild(card);
    });
  }

  renderProjects();
})();
