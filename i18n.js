/* Phraortes site — language system.
   English is the source text. To add a language: add lang/<code>.js (it sets PHR_LANGS.<code> = {"English text": "translation"})
   and register the code in LANGS below. Dictionaries load as plain scripts, so they work from any host and are cached by the browser. Units are whole elements (inline tags kept), so sentences translate as sentences.
   PHR_I18N.collect() lists every translatable string on the current page (used to build the dictionaries). */
(function () {
  "use strict";
  var LANGS = { en: { n: "English", dir: "ltr" }, fa: { n: "فارسی", dir: "rtl" }, de: { n: "Deutsch", dir: "ltr" }, ru: { n: "Русский", dir: "ltr" }, zh: { n: "中文", dir: "ltr" } };
  window.PHR_LANGS = window.PHR_LANGS || {};
  var BASE = (function () { try { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*(\?.*)?$/, "") : "" } catch (e) { return "" } })();
  var V = "3", KEY = "phr_lang", dict = null, cur = "en", mo = null, busy = false;
  var INL = /^(A|EM|STRONG|B|I|SPAN|SMALL|BR|MARK|SUP|SUB|U|KBD|Q|TIME|ABBR|S|WBR)$/;
  var SKIP = /^(SCRIPT|STYLE|NOSCRIPT|CANVAS|SVG|CODE|PRE|TEXTAREA|INPUT|SELECT|IFRAME|PATH)$/;
  var ATTR = ["alt", "title", "placeholder", "aria-label"];
  function skip(e) { return SKIP.test(e.tagName) || e.closest && e.closest("[translate=no],.no-i18n") }
  function inlineOnly(e) { var all = e.getElementsByTagName("*"); for (var i = 0; i < all.length; i++) { if (!INL.test(all[i].tagName)) return false } return true }
  function hasText(e) { for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true; return false }
  function norm(s) { return String(s).replace(/\s+/g, " ").trim() }
  function units(root, out) {
    (function visit(e) {
      if (e.nodeType !== 1 || skip(e)) return;
      if (hasText(e) && inlineOnly(e)) { out.push(e); return }
      for (var n = e.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 1) visit(n);
        else if (n.nodeType === 3 && n.nodeValue.trim() && e.tagName !== "BODY") out.push(n);
      }
    })(root);
    return out;
  }
  function attrs(root, out) {
    var all = root.querySelectorAll ? [].slice.call(root.querySelectorAll("[alt],[title],[placeholder],[aria-label]")) : [];
    if (root.getAttribute) all.push(root);
    all.forEach(function (e) { if (skip(e)) return; ATTR.forEach(function (a) { var v = e.getAttribute(a); if (v && v.trim()) out.push([e, a, v]) }) });
    return out;
  }
  function apply(root) {
    if (!dict || busy) return; busy = true;
    try {
      units(root, []).forEach(function (u) {
        if (u.nodeType === 3) { var k = norm(u.nodeValue), t = dict[k]; if (t != null) { if (u.__o == null) u.__o = u.nodeValue; u.nodeValue = t } return }
        var key = norm(u.innerHTML); if (u.__k) key = u.__k; var tr = dict[key];
        if (tr != null) { if (u.__o == null) { u.__o = u.innerHTML; u.__k = key } u.innerHTML = tr }
      });
      attrs(root, []).forEach(function (x) { var k = x[1] + "|" + norm(x[2]), t = dict[k] || dict[norm(x[2])]; if (t != null) { var h = "__a_" + x[1]; if (x[0][h] == null) x[0][h] = x[2]; x[0].setAttribute(x[1], t) } });
    } finally { busy = false }
  }
  function revert() {
    busy = true;
    try {
      var all = document.body.getElementsByTagName("*");
      for (var i = 0; i < all.length; i++) {
        var e = all[i];
        if (e.__o != null) { e.innerHTML = e.__o; e.__o = null; e.__k = null }
        ATTR.forEach(function (a) { var h = "__a_" + a; if (e[h] != null) { e.setAttribute(a, e[h]); e[h] = null } });
        for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.__o != null) { n.nodeValue = n.__o; n.__o = null }
      }
    } finally { busy = false }
  }
  function meta(en) {
    if (en) { if (document.__t0) document.title = document.__t0; var m = document.querySelector('meta[name=description]'); if (m && m.__c0) m.content = m.__c0; return }
    if (!document.__t0) document.__t0 = document.title;
    var t = dict[norm(document.__t0)]; if (t) document.title = t;
    var d = document.querySelector('meta[name=description]'); if (d) { if (!d.__c0) d.__c0 = d.content; var c = dict[norm(d.__c0)]; if (c) d.content = c }
  }
  function watch() {
    if (mo || !window.MutationObserver) return;
    var t = 0, q = [];
    mo = new MutationObserver(function (ms) {
      if (busy || cur === "en") return;
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) q.push(n) }) });
      clearTimeout(t); t = setTimeout(function () { var r = q.splice(0); r.forEach(function (n) { if (document.body.contains(n)) apply(n) }) }, 40);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  function paint(code) {
    var L = LANGS[code] || LANGS.en;
    document.documentElement.lang = code; document.documentElement.dir = L.dir || "ltr";
    var sl = document.getElementById("lgsel"); if (sl) sl.value = code;
    [].forEach.call(document.querySelectorAll("[data-lang-now]"), function (e) { e.textContent = code.toUpperCase() });
    [].forEach.call(document.querySelectorAll("[data-lang-opt]"), function (b) { b.setAttribute("aria-checked", b.dataset.langOpt === code ? "true" : "false") });
  }
  var loading = {}, token = 0;
  function loadDict(code) {
    if (window.PHR_LANGS[code]) return Promise.resolve(window.PHR_LANGS[code]);
    if (loading[code]) return loading[code];
    loading[code] = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.async = true; s.src = BASE + "lang/" + code + ".js?v=" + V;
      s.onload = function () { window.PHR_LANGS[code] ? res(window.PHR_LANGS[code]) : rej(0) };
      s.onerror = function () { s.remove(); rej(0) };
      document.head.appendChild(s);
    }).catch(function (e) { loading[code] = null; throw e });
    return loading[code];
  }
  function notice(m) {
    try { var t = document.createElement("div"); t.textContent = m; t.style.cssText = "position:fixed;left:12px;right:12px;bottom:16px;z-index:99999;background:#1b1812;color:#f1ece0;border:1px solid #e8c468;border-radius:14px;padding:12px 14px;font:13px/1.4 -apple-system,system-ui,sans-serif;text-align:center"; document.body.appendChild(t); setTimeout(function () { t.remove() }, 6000) } catch (e) { }
  }
  function swap(fn) {
    var h = document.documentElement; h.classList.add("i18n-sw");
    setTimeout(function () { try { fn() } finally { requestAnimationFrame(function () { h.classList.remove("i18n-sw") }) } }, 140);
  }
  function set(code) {
    if (!LANGS[code]) code = "en";
    var my = ++token, prev = cur;
    try { localStorage.setItem(KEY, code) } catch (e) { }
    var sl = document.getElementById("lgsel"); if (sl) sl.value = code;
    if (code === "en") { swap(function () { if (my !== token) return; cur = "en"; dict = null; revert(); meta(true); paint("en") }); return Promise.resolve() }
    return loadDict(code).then(function (j) {
      if (my !== token) return;
      swap(function () {
        if (my !== token) return;
        if (cur !== "en") revert(); dict = j; cur = code; apply(document.body); meta(false); paint(code); watch();
      });
    }).catch(function () {
      if (my !== token) return;
      /* keep what the user sees (the previous language) and say why; the choice is NOT reset, so a retry works */
      if (sl) sl.value = prev;
      notice("Couldn't load the " + LANGS[code].n + " texts. Check that lang/" + code + ".js is uploaded, then try again.");
    });
  }
  function init() {
    var c = "en"; try { c = new URLSearchParams(location.search).get("lang") || localStorage.getItem(KEY) || "en" } catch (e) { }
    paint("en"); if (c !== "en" && LANGS[c]) { var sl = document.getElementById("lgsel"); if (sl) sl.value = c; token++; var my = token; loadDict(c).then(function (j) { if (my !== token) return; dict = j; cur = c; apply(document.body); meta(false); paint(c); watch() }, function () { var s2 = document.getElementById("lgsel"); if (s2) s2.value = "en" }) }
  }
  window.PHR_I18N = {
    langs: LANGS, set: set, get: function () { return cur }, init: init,
    collect: function () {
      var out = {}; units(document.body, []).forEach(function (u) { var k = u.nodeType === 3 ? norm(u.nodeValue) : norm(u.__k || u.innerHTML); if (k) out[k] = 1 });
      attrs(document.body, []).forEach(function (x) { var k = norm(x[2]); if (k) out[k] = 1 });
      if (document.title) out[norm(document.__t0 || document.title)] = 1;
      var d = document.querySelector("meta[name=description]"); if (d && d.content) out[norm(d.content)] = 1;
      return Object.keys(out);
    }
  };
})();
