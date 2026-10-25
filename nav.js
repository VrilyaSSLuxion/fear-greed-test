/* V21: gemeinsame Reiter-Leiste für alle Seiten der Website (Startseite, Fear & Greed, Heatmap, Tools, Link-Seiten …).
   Einbinden: <nav class="apptabs" id="siteNav" data-page="heatmap"></nav> + <script src="../nav.js"></script>.
   V21b: zwei Zeilen – oben die Hauptseiten, darunter jede Link-Seite als eigener Reiter (kein „Mehr ▾“ mehr);
   rechts Sprache als Auswahl „DE ▾“ und „📖 Handbuch“ (Inhalt je Seite aus window.PAGE_MANUAL = { de, en, ar } bzw. window.siteManual()).
   data-nolang = Seite hat eine eigene Sprachwahl, data-noman = Seite hat einen eigenen Handbuch-Knopf.
   Sprache: gilt für alle Seiten (sessionStorage „site_lang“; ohne Wahl die Start-Sprache der Fear-&-Greed-Seite).
   Seiten, die selbst übersetzen, hören auf das Ereignis „sitelang“ (event.detail = 'de' | 'en' | 'ar'). */
(function () {
  var me = document.currentScript, base = me ? me.src.replace(/nav\.js(\?.*)?$/, '') : '../';
  var L = { de: 0, en: 1, ar: 2 };
  var MAIN = [
    ['home', '', ['Start', 'Home', 'الرئيسية']],
    ['fear-greed', 'fear-greed/', ['Fear & Greed', 'Fear & Greed', 'Fear & Greed']],
    ['heatmap', 'heatmap/', ['Liquidation Heatmap', 'Liquidation Heatmap', 'خريطة التصفيات']],
    ['tools', 'tools/', ['Trading Tools', 'Trading Tools', 'أدوات التداول']],
    ['youtube', 'youtube/', ['YouTube', 'YouTube', 'يوتيوب']],
    ['accounts', 'accounts/', ['Accounts', 'Accounts', 'الحسابات']]
  ];
  var MORE = [
    ['playlisten', 'playlisten/', ['Playlisten', 'Playlists', 'قوائم التشغيل']],
    ['strategien', 'strategien/', ['Strategien', 'Strategies', 'الاستراتيجيات']],
    ['indikatoren', 'indikatoren/', ['Indikatoren', 'Indicators', 'المؤشرات']],
    ['ea-creators', 'ea-creators/', ['EA-Creators', 'EA creators', 'مطوّرو الروبوتات']],
    ['interviews', 'interviews/', ['Interviews', 'Interviews', 'المقابلات']],
    ['kurse', 'kurse/', ['Kurse', 'Courses', 'الدورات']],
    ['anbieter', 'anbieter/', ['Indikatoren & EAs', 'Indicators & EAs', 'مؤشرات وروبوتات']],
    ['broker', 'broker/', ['Broker & Börsen', 'Brokers & exchanges', 'الوسطاء والبورصات']],
    ['backtest', 'backtest/', ['Backtest', 'Backtest', 'الاختبار الرجعي']],
    ['propfirmen', 'propfirmen/', ['Prop-Firmen', 'Prop firms', 'شركات التمويل']]
  ];
  var LANGS = [['de', 'DE'], ['en', 'EN'], ['ar', 'AR']];
  var MAN = ['📖 Handbuch', '📖 Manual', '📖 الدليل'], CLOSE = ['Schließen', 'Close', 'إغلاق'], LANGT = ['Sprache', 'Language', 'اللغة'];
  var getLang = function () {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && q in L) return q;
    try { var s = sessionStorage.getItem('site_lang'); if (s && s in L) return s; } catch (e) { }
    try { var d = localStorage.getItem('fg9_deflang'); if (d && d in L) return d; } catch (e) { }
    return 'de';
  };
  var lang = getLang();
  window.SITE_LANG = lang;
  window.siteSetLang = function (l, fromPage) {
    if (!(l in L)) return; lang = l; window.SITE_LANG = l;
    try { sessionStorage.setItem('site_lang', l); } catch (e) { }
    render(); if (document.getElementById('siteMan')?.classList.contains('open')) openMan();
    if (!fromPage) window.dispatchEvent(new CustomEvent('sitelang', { detail: l }));
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function render() {
    var nav = document.getElementById('siteNav');
    if (!nav) { nav = document.createElement('nav'); nav.className = 'apptabs'; nav.id = 'siteNav'; document.body.insertBefore(nav, document.body.firstChild); }
    var page = nav.getAttribute('data-page') || document.body.getAttribute('data-page') || '', i = L[lang];
    var off = location.protocol === 'file:';            // Einzeldatei: Links auf die Website
    var href = function (p) { return (off ? 'https://vrilyassluxion.github.io/' : base) + p; };
    var tab = function (t) { return t[0] === page ? '<span class="on">' + esc(t[2][i]) + '</span>' : '<a href="' + href(t[1]) + '">' + esc(t[2][i]) + '</a>'; };
    var right = '';
    if (nav.getAttribute('data-nolang') == null) right += '<select class="navlangsel" title="' + esc(LANGT[i]) + '">' + LANGS.map(function (l) { return '<option value="' + l[0] + '"' + (l[0] === lang ? ' selected' : '') + '>' + l[1] + '</option>'; }).join('') + '</select>';
    if (nav.getAttribute('data-noman') == null && (window.siteManual || window.PAGE_MANUAL)) right += '<button type="button" class="navman">' + esc(MAN[i]) + '</button>';
    if (window.SITE_TEST) right += '<a class="navtest" href="' + esc(window.SITE_TEST.live || '#') + '" title="Das ist die Testversion. Hier geht es zur Live-Seite.">' + esc(window.SITE_TEST.label) + ' · Live ↗</a>';
    nav.innerHTML = '<div class="navrow">' + MAIN.map(tab).join('') + (right ? '<span class="navright">' + right + '</span>' : '') + '</div>'
      + '<div class="navrow sub">' + MORE.map(tab).join('') + '</div>';
    nav.classList.add('sitenav');
  }
  // Handbuch-Fenster (für Seiten ohne eigenes): Inhalt aus window.PAGE_MANUAL in der gewählten Sprache
  function openMan() {
    if (window.siteManual) { window.siteManual(); return; }
    var M = window.PAGE_MANUAL || {}, html = M[lang] || M.de || '', w = document.getElementById('siteMan');
    if (!w) { w = document.createElement('div'); w.id = 'siteMan'; w.className = 'siteman'; document.body.appendChild(w);
      w.addEventListener('click', function (e) { if (e.target === w || e.target.closest('[data-manclose]')) w.classList.remove('open'); }); }
    w.innerHTML = '<div class="siteman-dlg" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '"><div class="siteman-body">' + html + '</div><div class="siteman-btns"><button type="button" data-manclose="1">' + esc(CLOSE[L[lang]]) + '</button></div></div>';
    w.classList.add('open');
  }
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#siteNav .navman')) openMan(); });
  document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('#siteNav .navlangsel')) window.siteSetLang(e.target.value); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.getElementById('siteMan')?.classList.remove('open'); });
  try { var f = JSON.parse(localStorage.getItem('tt_optik') || '{}').frame; if (f) document.documentElement.style.setProperty('--frame', f); } catch (e) { }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
