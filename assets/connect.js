/* Connect, For Real · legal, support and shared-link pages.
   Language (EN/FR, same key as getconnectapp.github.io), nav, index, copy email. */
(function () {
  'use strict';
  var root = document.documentElement;
  var base = root.getAttribute('data-base') || '';
  var KEY = 'connect-lang';
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  function badges() {
    var fr = root.lang === 'fr';
    document.querySelectorAll('[data-badge]').forEach(function (img) {
      img.src = base + 'assets/appstore-' + (dark.matches ? 'white' : 'black') + '-' + (fr ? 'fr-fr' : 'en-us') + '.svg';
      img.alt = fr ? "Télécharger dans l'App Store" : 'Download on the App Store';
    });
  }

  function setLang(lang) {
    var fr = lang === 'fr';
    root.lang = lang;
    document.querySelectorAll('[data-l]').forEach(function (el) { el.hidden = el.getAttribute('data-l') !== lang; });
    document.querySelectorAll('[data-fr]').forEach(function (el) {
      if (el.getAttribute('data-en') === null) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = fr ? el.getAttribute('data-fr') : el.getAttribute('data-en');
    });
    var t = root.getAttribute(fr ? 'data-title-fr' : 'data-title-en');
    if (t) document.title = t;
    var seg = document.getElementById('lang');
    if (seg) {
      var btns = seg.querySelectorAll('button');
      btns.forEach(function (b, i) {
        var on = b.getAttribute('data-lang') === lang;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) seg.querySelector('.seg__pill').style.transform = 'translateX(' + (i * 100) + '%)';
      });
    }
    badges();
    store.set(KEY, lang);
    document.dispatchEvent(new CustomEvent('connect:lang', { detail: lang }));
    watchToc();
  }

  /* index: highlight the section being read */
  var tocIo = null;
  function watchToc() {
    if (!('IntersectionObserver' in window)) return;
    if (tocIo) tocIo.disconnect();
    var toc = document.querySelector('.toc:not([hidden])');
    if (!toc) return;
    var links = toc.querySelectorAll('a');
    tocIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) tocIo.observe(s); });
  }

  var asked = (location.search.match(/[?&]lang=(en|fr)/) || [])[1];
  setLang(asked || store.get(KEY) || ((navigator.language || '').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en'));
  document.querySelectorAll('#lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
  if (dark.addEventListener) dark.addEventListener('change', badges);

  // close the mobile index after a pick
  document.querySelectorAll('.toc__m a').forEach(function (a) { a.addEventListener('click', function () { a.closest('details').open = false; }); });

  /* nav hides while reading down */
  var nav = document.getElementById('nav'), lastY = window.scrollY;
  if (nav) window.addEventListener('scroll', function () {
    var y = window.scrollY; nav.classList.toggle('is-hidden', y > lastY && y > 240); lastY = y;
  }, { passive: true });

  /* copy email */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('.mail');
      if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(function () {
        box.classList.add('is-copied'); setTimeout(function () { box.classList.remove('is-copied'); }, 1800);
      }, function () {});
    });
  });
})();
