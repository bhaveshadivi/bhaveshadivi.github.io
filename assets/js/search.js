/* ==========================================================================
   Command+K search overlay powered by Lunr.js + generated search index
   ========================================================================== */

(function () {
  'use strict';

  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var lunr = null;
  var lunrIndex = null;
  var docsById = {};
  var docsArray = [];
  var results = [];
  var active = -1;
  var indexLoaded = false;
  var indexLoading = false;

  function loadIndex() {
    if (indexLoaded) return Promise.resolve();
    if (indexLoading) return new Promise(function (resolve) {
      var check = setInterval(function () {
        if (indexLoaded) { clearInterval(check); resolve(); }
      }, 50);
    });
    indexLoading = true;

    // Load lunr.js from CDN
    var lunrPromise = new Promise(function (resolveScript) {
      if (window.lunr) {
        lunr = window.lunr || window.Lunr;
        resolveScript();
      } else {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lunr@2.3.9/dist/lunr.min.js';
        script.onload = function () {
          lunr = window.lunr || window.Lunr;
          resolveScript();
        };
        script.onerror = function () {
          lunr = null;
          resolveScript();
        };
        document.head.appendChild(script);
      }
    });

    return lunrPromise.then(function () {
      return fetch('/search_index.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          docsById = {};
          docsArray = data.docs || [];
          docsArray.forEach(function (doc) {
            var ref = doc.id || doc.url;
            doc.__ref = ref;
            docsById[ref] = doc;
          });
          if (lunr) {
            lunrIndex = lunr(function () {
              this.ref('id');
              this.field('title', { boost: 10 });
              this.field('excerpt', { boost: 5 });
              this.field('category', { boost: 2 });
              docsArray.forEach(function (doc) {
                var ref = doc.id || doc.url;
                this.add({ id: ref, title: doc.title, excerpt: doc.excerpt, category: doc.category });
              });
            });
          }
          indexLoaded = true;
        });
    });
  }

  function fallbackSearch(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var scored = [];
    docsArray.forEach(function (doc) {
      var haystack = ((doc.title || '') + ' ' + (doc.excerpt || '') + ' ' + (doc.category || '')).toLowerCase();
      var score = 0;
      var matched = false;
      terms.forEach(function (term) {
        if (haystack.indexOf(term) >= 0) {
          matched = true;
          score += 1;
        }
      });
      if (matched) {
        scored.push({ doc: doc, score: score });
      }
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    results = scored.map(function (s) { return s.doc; });
  }

  function render() {
    var q = input.value.trim();
    if (!overlay.classList.contains('search-overlay--open')) return;

    if (!q) {
      resultsEl.innerHTML = '<div class="search-overlay__empty">Start typing to search the site</div>';
      return;
    }

    if (!indexLoaded) {
      resultsEl.innerHTML = '<div class="search-overlay__empty">Loading search index…</div>';
      loadIndex().then(function () { render(); });
      return;
    }

    if (lunrIndex) {
      try {
        var hits = lunrIndex.search(q);
        results = hits.map(function (hit) { return docsById[hit.ref]; }).filter(Boolean);
      } catch (e) {
        results = [];
      }
    } else {
      fallbackSearch(q);
    }

    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="search-overlay__empty">No results for "<span>' + escapeHtml(q) + '</span>"</div>';
      return;
    }

    var html = '<ul class="search-overlay__list">';
    results.forEach(function (doc, i) {
      var cls = (i === active) ? 'search-overlay__item search-overlay__item--active' : 'search-overlay__item';
      html += '<li class="' + cls + '" data-idx="' + i + '">';
      html += '<span class="search-overlay__title">' + escapeHtml(doc.title) + '</span>';
      html += '<span class="search-overlay__meta">' + escapeHtml(doc.category) + '</span>';
      html += '</li>';
    });
    html += '</ul>';
    resultsEl.innerHTML = html;
    if (active < 0 || active >= results.length) activate(0);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function activate(i) {
    if (results.length === 0) return;
    if (i < 0) i = results.length - 1;
    if (i >= results.length) i = 0;
    active = i;
    render();
    var el = resultsEl.querySelector('.search-overlay__item--active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function go() {
    if (active < 0 || active >= results.length) return;
    close();
    window.location.href = results[active].url;
  }

  document.addEventListener('keydown', function (e) {
    var isMac = navigator.platform && navigator.platform.toLowerCase().indexOf('mac') >= 0;
    var modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      open();
      return;
    }

    if (!overlay.classList.contains('search-overlay--open')) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); activate(active + 1); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); activate(active - 1); return; }
    if (e.key === 'Enter') { e.preventDefault(); go(); return; }
  });

  input.addEventListener('input', render);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); activate(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activate(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(); }
  });

  resultsEl.addEventListener('click', function (e) {
    var li = e.target.closest('.search-overlay__item');
    if (!li) return;
    var doc = results[parseInt(li.dataset.idx, 10)];
    if (doc) { close(); window.location.href = doc.url; }
  });

  overlay.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-search-close')) close();
  });

  function open() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('search-overlay--open');
    document.body.classList.add('search-overlay-open');
    loadIndex().then(function () { input.focus(); input.select(); });
  }

  function close() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('search-overlay--open');
    document.body.classList.remove('search-overlay-open');
    input.value = '';
    results = [];
    active = -1;
    resultsEl.innerHTML = '<div class="search-overlay__empty">Start typing to search the site</div>';
  }

  window.openSearch = open;
  window.closeSearch = close;

  var searchBtn = document.getElementById('search-button');
  if (searchBtn) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      open();
    });
  }
})();
