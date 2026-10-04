/* The explorer is a local snapshot. It never sends repository data to a service. */
(() => {
  'use strict';
  const data = globalThis.TAXFLOW_ARCHITECTURE;
  const main = document.querySelector('#main');
  if (!data) {
    main.textContent =
      'The snapshot is missing. Run pnpm run explorer:build from the repository, then reopen this page.';
    return;
  }
  const files = new Map(data.files.map((file) => [file.path, file]));
  const modules = new Map(data.modules.map((module) => [module.id, module]));
  const details = document.querySelector('#details');
  const escape = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (character) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
    );
  const short = (path) => path.split('/').at(-1);
  const date = (value) =>
    value
      ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      : 'Not recorded';
  const href = (values) =>
    '#' +
    new URLSearchParams(
      Object.entries(values).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    ).toString();
  const sourceHref = (path, line) =>
    '../' + path.split('/').map(encodeURIComponent).join('/') + (line ? '#L' + line : '');
  const fileLink = (path, label = path, extra = {}) =>
    files.has(path)
      ? `<a href="${escape(href({ page: 'code', module: files.get(path).moduleId, file: path, ...extra }))}" title="${escape(path)}">${escape(label)}</a>`
      : sourceLink(path, null, label);
  const sourceLink = (path, line, label = 'Open source') =>
    location.protocol === 'file:'
      ? `<a class="evidence-link" href="${escape(sourceHref(path, line))}" target="_blank" rel="noopener">${escape(label)} ↗</a>`
      : `<span class="evidence-link" title="Open .archify/index.html locally to follow source links.">${label === 'Open source' ? 'Open the explorer locally for source links' : `${escape(label)} · ${escape(path)}`}</span>`;
  const badge = (file) =>
    `<span class="badge ${file.reviewStatus === 'needs-review' ? 'stale' : file.summaryKind === 'structural' ? 'structural' : ''}">${file.reviewStatus === 'needs-review' ? 'Review needs refresh' : file.summaryKind === 'reviewed' ? 'Reviewed explanation' : 'Structural facts'}</span>`;
  const list = (items, empty = 'None recorded.') =>
    items.length
      ? `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
      : `<p class="hint">${escape(empty)}</p>`;
  const header = (eyebrow, title, description) =>
    `<div class="page-head"><div class="eyebrow">${escape(eyebrow)}</div><h1>${escape(title)}</h1><p class="lede">${escape(description)}</p></div>`;
  let state = {};
  let limit = 80;
  let mapObserver;

  function navigate(values) {
    location.hash = href(values);
  }
  function moduleLink(id, label) {
    return `<a href="${escape(href({ page: 'code', module: id }))}">${escape(label || modules.get(id)?.label || id)}</a>`;
  }
  function stats() {
    const c = data.meta.counts;
    return `<div class="stats">${[
      [c.files, 'indexed files'],
      [c.modules, 'code areas'],
      [c.resolvedImports, 'resolved imports'],
      [c.reviewedFiles, 'reviewed file explanations'],
    ]
      .map(
        ([number, label]) =>
          `<div class="stat"><strong>${Number(number).toLocaleString()}</strong><span>${label}</span></div>`,
      )
      .join('')}</div>`;
  }
  function moduleCards(ids = data.modules.map((module) => module.id)) {
    return `<div class="module-grid">${ids
      .map((id) => {
        const module = modules.get(id);
        if (!module) return '';
        const count = data.files.filter((file) => file.moduleId === id).length;
        return `<a class="module-card" href="${escape(href({ page: 'code', module: id }))}"><span class="count">${count} files →</span><h3>${escape(module.label)}</h3><p>${escape(module.summary)}</p></a>`;
      })
      .join('')}</div>`;
  }

  function viewPage() {
    const view = data.views.find((entry) => entry.id === state.view) || data.views[0];
    if (!view)
      return header(
        'Perspectives',
        'No perspectives yet',
        'Add a view to scripts/architecture-explorer/content.json.',
      );
    const nodes = new Map(view.nodes.map((node) => [node.id, node]));
    const columns = Math.max(1, ...view.nodes.map((node) => Number(node.x || 0) + 1));
    return (
      header('System → subsystem → files', view.title, view.description) +
      stats() +
      `<div class="map-key">Select a block to see its responsibilities and source files. Connections describe reviewed architecture; the file explorer separately shows extracted imports.</div>
      <section class="map" aria-label="${escape(view.title)} diagram"><svg class="map-lines" aria-hidden="true"></svg><div class="map-grid" style="--cols:${Math.min(columns, 4)}">${view.nodes.map((node) => `<button class="map-node" data-node="${escape(node.id)}" data-kind="${escape(node.kind)}" style="--node-column:${Number(node.x || 0) + 1};--node-row:${Number(node.y || 0) + 1}"><span class="node-kind">${escape(node.kind || 'component')}</span><strong>${escape(node.label)}</strong><span class="node-detail">${escape(node.detail)}</span><span class="node-kind">Explore files ↗</span></button>`).join('')}</div></section>
      <div class="section-head"><h2>How the blocks connect</h2><span>${view.edges.length} relationships</span></div><div class="connection-list">${view.edges.map((edge) => `<div class="connection"><strong><button data-node="${escape(edge.from)}">${escape(nodes.get(edge.from)?.label || edge.from)}</button> → <button data-node="${escape(edge.to)}">${escape(nodes.get(edge.to)?.label || edge.to)}</button></strong><span class="rel">${escape(edge.label)}</span><span class="badge structural">${escape(edge.kind || 'reviewed relationship')}</span></div>`).join('')}</div>
      ${view.notes?.length ? `<div class="notes">${list(view.notes.map(escape))}</div>` : ''}
      <div class="section-head"><h2>Browse the code areas</h2><a href="#page=code">All files →</a></div>${moduleCards([...new Set(view.nodes.flatMap((node) => node.moduleIds || []))])}`
    );
  }
  function drawMap() {
    const map = document.querySelector('.map');
    if (!map || window.innerWidth < 740) return;
    const view = data.views.find((entry) => entry.id === state.view) || data.views[0];
    const bounds = map.getBoundingClientRect();
    const svg = map.querySelector('svg');
    const nodes = new Map(
      [...map.querySelectorAll('[data-node]')].map((node) => [
        node.dataset.node,
        node.getBoundingClientRect(),
      ]),
    );
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    svg.innerHTML =
      `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8da7b2"/></marker></defs>` +
      view.edges
        .map((edge) => {
          const from = nodes.get(edge.from),
            to = nodes.get(edge.to);
          if (!from || !to) return '';
          const fx = from.left + from.width / 2 - bounds.left,
            fy = from.top + from.height / 2 - bounds.top;
          const tx = to.left + to.width / 2 - bounds.left,
            ty = to.top + to.height / 2 - bounds.top;
          const vertical = Math.abs(ty - fy) > Math.abs(tx - fx) * 0.6;
          const x1 = fx + (vertical ? 0 : (Math.sign(tx - fx) * from.width) / 2);
          const y1 = fy + (vertical ? (Math.sign(ty - fy) * from.height) / 2 : 0);
          const x2 = tx - (vertical ? 0 : (Math.sign(tx - fx) * to.width) / 2);
          const y2 = ty - (vertical ? (Math.sign(ty - fy) * to.height) / 2 : 0);
          const path = vertical
            ? `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`
            : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
          return `<path d="${path}" fill="none" stroke="#8da7b2" stroke-width="1.5" ${edge.kind === 'dependency' ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#arrow)"/>`;
        })
        .join('');
  }
  function treeMarkup(records) {
    const tree = Object.create(null);
    for (const file of records) {
      let branch = tree;
      const segments = file.path.split('/');
      segments.forEach((segment, index) => {
        if (index === segments.length - 1) branch[segment] = file.path;
        else branch = branch[segment] ||= Object.create(null);
      });
    }
    function branchHtml(branch, depth = 0) {
      return Object.entries(branch)
        .sort(
          ([a, av], [b, bv]) =>
            (typeof av === 'string') - (typeof bv === 'string') || a.localeCompare(b),
        )
        .map(([name, child]) =>
          typeof child === 'string'
            ? `<div class="tree-file">${fileLink(child, name, { q: state.q })}</div>`
            : `<details ${depth < 1 || state.q ? 'open' : ''}><summary>${escape(name)}</summary>${branchHtml(child, depth + 1)}</details>`,
        )
        .join('');
    }
    return branchHtml(tree);
  }
  function neighborhood(file) {
    const local = file.imports.filter((entry) => entry.target);
    return `<section><h2 class="flow-title">${escape(short(file.path))} · file relationships</h2><p class="hint">These are module import links. A file can be imported without every exported function being called.</p><div class="dependency-columns"><div class="dependency-column"><h3>Imports ${local.length} local references</h3>${list(
      local.map(
        (entry) =>
          fileLink(entry.target) +
          ` <span class="badge structural">${entry.typeOnly ? 'type only' : entry.dynamic ? 'dynamic literal' : 'import'}</span>`,
      ),
      'No local imports resolved in this snapshot.',
    )}</div><div class="dependency-column"><h3>Imported by ${file.importedBy.length} files</h3>${list(
      file.importedBy.map((path) => fileLink(path)),
      'No indexed files directly import this file. It may still be an entry point or loaded dynamically.',
    )}</div></div></section>`;
  }
  function codePage() {
    const module = modules.get(state.module);
    const selected = files.get(state.file);
    const query = String(state.q || '').toLowerCase();
    const filtered = data.files.filter(
      (file) =>
        (!module || file.moduleId === module.id) &&
        (!state.kind || file.kind === state.kind) &&
        (!query ||
          [file.path, file.summary, modules.get(file.moduleId)?.label, ...file.exports]
            .join(' ')
            .toLowerCase()
            .includes(query)),
    );
    const kinds = [...new Set(data.files.map((file) => file.kind))].sort();
    return (
      `<div class="breadcrumbs"><a href="#">Whole system</a> / ${module ? moduleLink(module.id) : 'All code'}${selected ? ` / ${escape(short(selected.path))}` : ''}</div>` +
      header(
        'Code navigator',
        module?.label || 'Files & dependencies',
        module?.summary ||
          'Browse the real directory structure, search exports, and follow imports between files.',
      ) +
      (module
        ? `<div class="module-summary"><strong>Owner:</strong> ${escape(module.owner)}<p>${(module.prefixes || []).map((prefix) => `<code>${escape(prefix)}</code>`).join(' · ')}</p></div>`
        : '') +
      (selected ? neighborhood(selected) : '') +
      `<form id="code-filter" class="filters"><label class="sr-only" for="file-query">Filter files</label><input id="file-query" name="q" type="search" value="${escape(state.q)}" placeholder="Filter files, exports or descriptions…"><label class="sr-only" for="module-filter">Code area</label><select id="module-filter" name="module"><option value="">All code areas</option>${data.modules.map((entry) => `<option value="${escape(entry.id)}" ${entry.id === state.module ? 'selected' : ''}>${escape(entry.label)}</option>`).join('')}</select><label class="sr-only" for="kind-filter">File kind</label><select id="kind-filter" name="kind"><option value="">All kinds</option>${kinds.map((kind) => `<option ${kind === state.kind ? 'selected' : ''}>${escape(kind)}</option>`).join('')}</select><button class="secondary" type="submit">Apply</button></form><p class="filter-count">${filtered.length} files${query ? ` matching “${escape(state.q)}”` : ''} · ${filtered.filter((file) => file.summaryKind === 'reviewed').length} with reviewed explanations</p>
      <div class="file-layout"><nav class="tree" aria-label="Repository folders">${treeMarkup(filtered)}</nav><div class="file-results">${
        filtered
          .slice(0, limit)
          .map(
            (file) =>
              `<a class="file-row" href="${escape(href({ page: 'code', module: file.moduleId, file: file.path, q: state.q }))}"><strong>${escape(short(file.path))}</strong><small>${escape(file.path)}</small><p>${escape(file.summary)}</p><span class="row-meta">${badge(file)} ${file.lineCount} lines · ${file.imports.filter((entry) => entry.target).length} local imports · ${file.importedBy.length} importers</span></a>`,
          )
          .join('') || '<div class="empty">No files match these filters.</div>'
      }${filtered.length > limit ? `<button class="secondary load-more" id="load-more">Show next ${Math.min(80, filtered.length - limit)} files</button>` : ''}</div></div>`
    );
  }
  function stackPage() {
    return (
      header(
        'Declared dependencies',
        'Package inventory',
        'The versions below come from package.json files. They describe declared requirements, not a live deployment or the exact installed lockfile versions.',
      ) +
      `<div class="cards">${data.packages.map((pkg) => `<details class="card package"><summary><strong>${escape(pkg.name)}</strong><small>${escape(pkg.path)}</small><span>${pkg.dependencies.length} dependency declarations</span></summary><p>${fileLink(pkg.path, 'Inspect package file')}</p><table><thead><tr><th>Package</th><th>Declared version</th><th>Use</th></tr></thead><tbody>${pkg.dependencies.map((dependency) => `<tr><td>${escape(dependency.name)}</td><td><code>${escape(dependency.version)}</code></td><td>${escape(dependency.scope.replace('Dependencies', '').replace('dependencies', 'runtime'))}</td></tr>`).join('')}</tbody></table></details>`).join('')}</div>`
    );
  }
  function journeysPage() {
    return (
      header(
        'Follow the work',
        'How work gets done',
        'Follow the application paths from user intent to computation, review, and persistence. Open the source behind each step.',
      ) +
      data.journeys
        .map(
          (journey) =>
            `<section class="journey" id="${escape(journey.id)}"><h2>${escape(journey.title)}</h2><p>${escape(journey.description)}</p><ol class="steps">${journey.steps
              .map(
                (step) =>
                  `<li class="step"><h3>${escape(step.title)}</h3><p>${escape(step.description)}</p><div class="tag-list">${(step.moduleIds || []).map((id) => moduleLink(id)).join(' · ')}</div>${list(
                    (step.filePaths || []).map((path) => fileLink(path)),
                    'Architecture narrative; no individual file attached to this step.',
                  )}</li>`,
              )
              .join('')}</ol></section>`,
        )
        .join('')
    );
  }
  function diagramsPage() {
    const active = data.diagrams.find((diagram) => diagram.id === state.diagram);
    return (
      header(
        'Standalone diagrams',
        'Archify diagram library',
        'These detailed diagrams are reviewed snapshots. Their native controls support zoom, themes and exports. The perspectives above connect architecture blocks to the file index.',
      ) +
      `<div class="cards">${data.diagrams.map((diagram) => `<article class="card"><span class="eyebrow">${escape(diagram.kind || 'Architecture')}</span><h3>${escape(diagram.title)}</h3><p>${escape(diagram.description)}</p><div class="actions"><a class="primary" href="${escape(href({ page: 'diagrams', diagram: diagram.id }))}">View diagram</a><a class="secondary" href="${escape(diagram.path)}" target="_blank" rel="noopener">Open standalone ↗</a></div></article>`).join('')}</div>` +
      (active
        ? `<div class="section-head"><h2>${escape(active.title)}</h2><a href="${escape(active.path)}" target="_blank" rel="noopener">Full window ↗</a></div><iframe class="diagram-frame" title="${escape(active.title)}" src="${escape(active.path)}"></iframe>${active.filePaths?.length ? `<h3>Related source files</h3>${list(active.filePaths.map((path) => fileLink(path)))}` : ''}`
        : '<div class="notice">Choose a diagram to open it here.</div>')
    );
  }
  function aboutPage() {
    return (
      header(
        'Evidence & maintenance',
        'What this explorer knows',
        'The generated index and the written explanations have different refresh rules.',
      ) +
      stats() +
      `<div class="text-panel"><h2>Snapshot</h2><ul><li>Built: ${escape(date(data.meta.generatedAt))}</li><li>Git revision: <code>${escape(data.meta.revision)}</code></li><li>Working tree: ${data.meta.dirty ? 'contains local changes; the file index includes eligible working files' : 'no indexed local changes reported'}</li><li>${escape(data.meta.scope)}</li></ul><h2>Keep the code map current</h2><pre>pnpm run explorer:build</pre><p>Rebuilds this same page, file relationships, package inventory, and review status. Reopen or reload the page after it finishes.</p><pre>pnpm run explorer:watch</pre><p>Watches local changes and rebuilds the snapshot while this command runs. Refresh the browser to read the new snapshot. Stop the watcher with Ctrl+C.</p><pre>pnpm run explorer:check</pre><p>Fails if the generated explorer no longer matches its inputs. This can be used in a development or CI check.</p><h2>Reviewed explanations</h2><p>${data.meta.counts.reviewedFiles} key files have written explanations, source evidence, and a review date. When their content changes, their badges switch to “Review needs refresh”. Other files show extracted facts and explicitly say they have not been individually reviewed. Changes elsewhere can affect a reviewed file even when its own bytes are unchanged.</p><p>Semantic explanations, work journeys, and diagram narratives require another code review. The watcher does not call an AI model, update these narratives, or confirm runtime behavior. Ask Codex to review the affected architecture and regenerate the relevant Archify diagrams when responsibilities or flows change.</p><h2>Make changes</h2><p>Edit <code>scripts/architecture-explorer/content.json</code> to add perspectives, module ownership, file notes, journeys, or diagram entries. The interface is for exploring this material. It is not a visual diagram editor. Layout and viewer behavior live beside that content file. Rebuild after editing.</p><h2>What a relationship means</h2><p>${escape(data.meta.resolution)}</p><p>A test link indicates a direct import or a reviewer-selected reference; it is not a passing-test or coverage claim. Source file links work when this folder is opened locally with <code>file://</code>. Browser handling of local files varies; the full repository path is always shown.</p><p>Reviewed architecture describes the code at the cited revision. It does not verify live provider settings, deployment topology, production data, or a runtime function call graph. The browser loads local generated files and makes no AI requests.</p><h2>Documentation</h2><p>${sourceLink('docs/architecture-explorer.md', null, 'Explorer guide and change inventory')} · ${sourceLink('docs/ARCHITECTURE.md', null, 'Current implementation guide')} · ${sourceLink('docs/product/README.md', null, 'Intended product behavior')}</p></div>`
    );
  }
  function fileDetails(file) {
    const external = file.imports.filter((entry) => !entry.target);
    return `<div class="details-header"><span>FILE EXPLANATION</span><button class="close" aria-label="Close details">×</button></div><h2>${escape(short(file.path))}</h2><p class="path">${escape(file.path)}</p><div class="badge-row">${badge(file)}<span class="badge structural">${escape(file.kind)}</span></div><p class="description">${escape(file.summary)}</p><p>${moduleLink(file.moduleId)}</p><div class="detail-actions">${sourceLink(file.path)}<button class="quiet" id="copy-path">Copy path</button></div><p id="copy-status" class="hint" role="status"></p>
      ${file.summaryKind === 'reviewed' ? `<p class="hint">Explanation reviewed ${escape(file.reviewedAt)} against <code>${escape(file.reviewedRevision?.slice(0, 12) || 'recorded file hash')}</code>.</p><div class="notice ${file.reviewStatus === 'needs-review' ? 'warn' : ''}">${escape(file.reviewReason)}</div><h3>Reads / inputs</h3>${list(file.reads.map(escape))}<h3>Writes / changes</h3>${list(file.writes.map(escape))}<h3>Rules and boundaries</h3>${list(file.rules.map(escape))}` : '<div class="notice">This file has structural facts only. Its purpose, reads, writes, and runtime behavior still need individual review.</div>'}
      <h3>Exports</h3><div class="tag-list">${file.exports.map((name) => `<code>${escape(name)}</code>`).join(' ') || '<span class="hint">No named exports extracted.</span>'}</div>
      <h3>Local dependencies (${file.imports.filter((entry) => entry.target).length})</h3>${list(file.imports.filter((entry) => entry.target).map((entry) => fileLink(entry.target, short(entry.target)) + `<p class="hint">${escape(entry.specifier)}${entry.typeOnly ? ' · type only' : ''}${entry.dynamic ? ' · dynamic literal' : ''} · line ${entry.line}</p>`))}
      <h3>Imported by (${file.importedBy.length})</h3>${list(
        file.importedBy.map((path) => fileLink(path, short(path))),
        'No direct importer was found. This does not mean the file is unused.',
      )}
      <h3>External or unresolved imports (${external.length})</h3>${list(external.map((entry) => `<code>${escape(entry.specifier)}</code> · ${entry.resolution === 'unresolved' ? 'local target unresolved' : 'external library'}${entry.typeOnly ? ' · type only' : ''}`))}
      <h3>Related tests</h3>${list(
        file.tests.map(
          (test) =>
            fileLink(test.path, short(test.path)) +
            `<p class="hint">${escape(test.relationship)}</p>`,
        ),
        'No direct-import or curated test relationship recorded. This is not proof that the file is untested.',
      )}
      ${file.effects.length ? `<h3>Syntax observations</h3>${list(file.effects.map((effect) => escape(effect.text) + ` ${sourceLink(file.path, effect.line, 'Line ' + effect.line)}`))}` : ''}
      <h3>Source evidence</h3>${list(
        file.evidence
          .slice(0, 35)
          .map((entry) =>
            sourceLink(
              entry.path,
              entry.line,
              `${short(entry.path)}:${entry.line}${entry.endLine ? '–' + entry.endLine : ''}`,
            ),
          ),
        'Open the file to inspect its source.',
      )}${file.evidence.length > 35 ? '<p class="hint">Showing the first 35 source locations.</p>' : ''}<p class="hint">Index refreshed ${escape(date(data.meta.generatedAt))}. ${file.lineCount} lines. Import extraction does not establish runtime calls.</p>`;
  }
  function nodeDetails(node) {
    return `<div class="details-header"><span>COMPONENT</span><button class="close" aria-label="Close details">×</button></div><h2>${escape(node.label)}</h2><span class="badge">${escape(node.kind)}</span><p class="description">${escape(node.detail)}</p><h3>Code areas</h3>${list(
      (node.moduleIds || []).map((id) => moduleLink(id)),
      'External service or conceptual boundary; no local module assigned.',
    )}<h3>Start with these files</h3>${list(
      (node.filePaths || []).map((path) => fileLink(path)),
      'This component has no representative source file attached.',
    )}<p class="hint">Select a code area to browse every indexed file underneath it. Select a file to see its explanation, dependencies and evidence.</p>`;
  }
  function renderDetails() {
    const file = files.get(state.file);
    const view = data.views.find((entry) => entry.id === state.view) || data.views[0];
    const node = view?.nodes.find((entry) => entry.id === state.node);
    details.hidden = !(file || node);
    document.querySelector('#layout').classList.toggle('has-details', !details.hidden);
    details.innerHTML = file ? fileDetails(file) : node ? nodeDetails(node) : '';
    details.scrollTop = 0;
  }
  function render() {
    mapObserver?.disconnect();
    const previous = state;
    state = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
    state.page ||= 'view';
    main.innerHTML = (
      {
        code: codePage,
        stack: stackPage,
        journeys: journeysPage,
        diagrams: diagramsPage,
        about: aboutPage,
      }[state.page] || viewPage
    )();
    document.querySelector('#search').value = state.q || '';
    document.querySelectorAll('.sidebar nav a').forEach((link) => {
      const active =
        link.dataset.page === state.page &&
        (state.page !== 'view' || link.dataset.view === (state.view || data.views[0]?.id));
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    renderDetails();
    if (!details.hidden && window.innerWidth < 1000)
      requestAnimationFrame(() => details.scrollIntoView({ block: 'start', behavior: 'smooth' }));
    else if (['page', 'view', 'module', 'file', 'q'].some((key) => previous[key] !== state[key]))
      window.scrollTo(0, 0);
    const map = document.querySelector('.map');
    if (map) {
      mapObserver = new ResizeObserver(drawMap);
      mapObserver.observe(map);
      requestAnimationFrame(drawMap);
    }
    document.title = `${main.querySelector('h1')?.textContent || 'Architecture'} · TaxflowOS`;
  }
  document.querySelector('#perspectives').innerHTML = data.views
    .map(
      (view, index) =>
        `<a data-page="view" data-view="${escape(view.id)}" href="${escape(href({ page: 'view', view: view.id }))}"><span>${String(index + 1).padStart(2, '0')}</span>${escape(view.title)}</a>`,
    )
    .join('');
  document.querySelector('#snapshot-short').textContent =
    `${data.meta.revision?.slice(0, 8) || 'Local'} · ${date(data.meta.generatedAt)}`;
  document.querySelector('#global-search').addEventListener('submit', (event) => {
    event.preventDefault();
    navigate({ page: 'code', q: document.querySelector('#search').value.trim() });
  });
  document.querySelector('#reload').addEventListener('click', () => location.reload());
  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'code-filter') return;
    event.preventDefault();
    navigate({ page: 'code', ...Object.fromEntries(new FormData(event.target)) });
  });
  document.addEventListener('change', (event) => {
    if (['module-filter', 'kind-filter'].includes(event.target.id))
      event.target.form.requestSubmit();
  });
  document.addEventListener('click', async (event) => {
    if (event.target.closest('a[href="#main"]')) {
      event.preventDefault();
      main.focus();
      main.scrollIntoView({ block: 'start' });
      return;
    }
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.node)
      navigate({ page: 'view', view: state.view || data.views[0]?.id, node: button.dataset.node });
    if (button.classList.contains('close')) {
      const next = { ...state };
      delete next.file;
      delete next.node;
      navigate(next);
    }
    if (button.id === 'load-more') {
      const scroll = window.scrollY;
      limit += 80;
      render();
      window.scrollTo(0, scroll);
    }
    if (button.id === 'copy-path') {
      try {
        await navigator.clipboard.writeText(state.file);
        document.querySelector('#copy-status').textContent = 'Repository-relative path copied.';
      } catch {
        document.querySelector('#copy-status').textContent =
          'Clipboard access is unavailable. Select and copy the path above.';
      }
    }
  });
  document.addEventListener('keydown', (event) => {
    if (
      event.key === '/' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
    ) {
      event.preventDefault();
      document.querySelector('#search').focus();
    }
    if (event.key === 'Escape' && !details.hidden) details.querySelector('.close').click();
  });
  window.addEventListener('hashchange', () => {
    limit = 80;
    render();
  });
  window.addEventListener('resize', drawMap);
  render();
})();
