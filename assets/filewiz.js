/* file.niveshsahayak.in: "Which form do I file?" wizards. The questions and answers are English content in filecore.js
   (every rule dated, every source marked read or to-confirm); the buttons and headings here come from NS.t('fw.*').
   The state is the wizard name and the answers after #, e.g. #itr=0.1.0, so a link opens the same answer (no server). */
(function () {
  'use strict';
  var NS = window.NS, $ = NS.$, esc = NS.esc, F = window.NSFile;
  function T(k, v) { return NS.t(k, v); }
  var root, tree = null, ans = [];

  function setHash() { try { history.replaceState(null, '', tree ? F.toHash(tree, ans) : location.pathname); } catch (e) {} }
  function srcHtml(id) {
    var s = F.SRC[id], ok = s.st === 'read';
    return '<li><span class="fw-badge ' + (ok ? 'ok' : 'chk') + '">' + esc(T(ok ? 'fw.read' : 'fw.check')) + '</span> <a href="' + esc(s.url) + '" rel="noopener" target="_blank">' + esc(s.name) + '</a> <small>' + esc(NS.fmtDate(s.on)) + '</small></li>';
  }
  function list(a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }

  function home() {
    return '<div class="gt-card"><h2>' + esc(T('fw.pick')) + '</h2><div class="fw-grid">' + F.ORDER.map(function (k) {
      return '<button type="button" class="fw-pick" data-fw="start" data-t="' + k + '"><b>' + esc(T('fw.t.' + k)) + '</b><span>' + esc(T('fw.d.' + k)) + '</span></button>';
    }).join('') + '</div><p class="note">' + esc(T('fw.asof', { d: NS.fmtDate(F.AS_OF) })) + '</p></div>';
  }
  function crumbs(w) {
    return w.path.map(function (p) { return '<li><small>' + esc(p.node.q.length > 90 ? p.node.q.slice(0, 88) + '…' : p.node.q) + '</small><br><b>' + esc(p.node.o[p.pick][0]) + '</b></li>'; }).join('');
  }
  function draw() {
    if (!tree) { root.innerHTML = home(); return; }
    var w = F.walk(tree, ans);
    if (!w || !w.ok) { ans = []; w = F.walk(tree, ans); }
    var n = w.node, h = '<div class="gt-card"><h2>' + esc(T('fw.t.' + tree)) + '</h2>';
    if (w.path.length) h += '<ol class="fw-crumbs">' + crumbs(w) + '</ol>';
    if (!n.leaf) {
      h += '<h3 class="fw-q">' + esc(n.q) + '</h3><div class="fw-opts">' + n.o.map(function (o, i) { return '<button type="button" class="btn" data-fw="pick" data-i="' + i + '">' + esc(o[0]) + '</button>'; }).join('') + '</div>';
    } else {
      h += '<div class="fw-ans"><h3>' + esc(n.title) + '</h3>' +
        '<p><b>' + esc(T('fw.form')) + ':</b> ' + esc(n.form) + '</p><p><b>' + esc(T('fw.when')) + ':</b> ' + esc(n.due) + '</p>' +
        '<h4>' + esc(T('fw.do')) + '</h4>' + list(n.do) + (n.fill.length ? '<h4>' + esc(T('fw.fill')) + '</h4>' + list(n.fill) : '') +
        (n.tools.length ? '<h4>' + esc(T('fw.tools')) + '</h4><div class="row">' + n.tools.map(function (t) { return '<a class="btn sm" href="' + esc(t[1]) + '">' + esc(t[0]) + '</a>'; }).join('') + '</div>' : '') +
        (n.note ? '<p class="note">' + esc(n.note) + '</p>' : '') +
        '<h4>' + esc(T('fw.src')) + '</h4><ul class="fw-src">' + n.src.map(srcHtml).join('') + '</ul><p class="note">' + esc(T('fw.asof', { d: NS.fmtDate(F.AS_OF) })) + ' ' + esc(T('fw.not')) + '</p></div>' +
        '<div class="row gt-acts"><button type="button" class="btn sm primary" data-fw="link">' + esc(T('fw.copylink')) + '</button> <button type="button" class="btn sm" data-fw="text">' + esc(T('fw.copytext')) + '</button> <button type="button" class="btn sm" data-fw="print">' + esc(T('fw.print')) + '</button></div><p id="fw-msg" class="note" role="status" hidden></p>';
    }
    h += '<div class="row gt-noprint">' + (ans.length ? '<button type="button" class="btn sm" data-fw="back">' + esc(T('fw.back')) + '</button> ' : '') + '<button type="button" class="btn sm" data-fw="home">' + esc(T('fw.restart')) + '</button></div></div>';
    root.innerHTML = h;
  }
  function say(m) { var p = $('#fw-msg', root); if (p) { p.textContent = m; p.hidden = false; } }
  function copy(txt, ok) { (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { say(ok); }, function () { try { window.prompt('', txt); } catch (e) {} }); }

  function wire() {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fw]'); if (!b) return; var a = b.getAttribute('data-fw');
      if (a === 'start') { tree = b.getAttribute('data-t'); ans = []; }
      else if (a === 'pick') ans.push(b.getAttribute('data-i'));
      else if (a === 'back') ans.pop();
      else if (a === 'home') { tree = null; ans = []; }
      else if (a === 'link') { copy(location.origin + location.pathname + F.toHash(tree, ans), T('fw.copied')); return; }
      else if (a === 'text') { copy(F.text(tree, ans), T('fw.copiedtext')); return; }
      else if (a === 'print') { window.print(); return; }
      setHash(); draw(); var f = $('.fw-q', root) || $('.fw-ans h3', root); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    });
    window.addEventListener('hashchange', function () { fromHash(); draw(); });
    document.addEventListener('ns-lang', draw);
  }
  function fromHash() { var h = F.fromHash(location.hash); if (h) { tree = h.tree; ans = h.answers; } else { tree = null; ans = []; } }
  function init() { root = $('#fw-tool'); if (!root) return; fromHash(); draw(); wire(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
