/* V21: gemeinsame Reiter-Leiste für alle Seiten der Website (Startseite, Fear & Greed, Heatmap, Tools, Link-Seiten …).
   Einbinden: <nav class="apptabs" id="siteNav" data-page="heatmap"></nav> + <script src="../nav.js"></script>.
   V21b: zwei Zeilen – oben die Hauptseiten, darunter jede Link-Seite als eigener Reiter (kein „Mehr ▾“ mehr);
   rechts Sprache als Auswahl „DE ▾“ und „📖 Handbuch“ (Inhalt je Seite aus window.PAGE_MANUAL = { de, en, ar } bzw. window.siteManual()).
   data-nolang = Seite hat eine eigene Sprachwahl, data-noman = Seite hat einen eigenen Handbuch-Knopf.
   Sprache: gilt für alle Seiten (sessionStorage „site_lang“; ohne Wahl die Start-Sprache der Fear-&-Greed-Seite, sonst Englisch).
   Seiten, die selbst übersetzen, hören auf das Ereignis „sitelang“ (event.detail = 'de' | 'en' | 'ar'). */
(function () {
  var me = document.currentScript, base = me ? me.src.replace(/nav\.js(\?.*)?$/, '') : '../';
  var L = { de: 0, en: 1, ar: 2 };
  var MAIN = [
    ['home', '', ['Start', 'Home', 'الرئيسية']],
    ['github', '', ['GitHub', 'GitHub', 'GitHub'], 'https://github.com/VrilyaSSLuxion'],   // V22: eigener Reiter (öffnet das GitHub-Profil in neuem Tab)
    ['fear-greed', 'fear-greed/', ['Fear & Greed', 'Fear & Greed', 'Fear & Greed']],
    ['heatmap', 'heatmap/', ['Liquidation Heatmap', 'Liquidation Heatmap', 'خريطة التصفيات']],
    ['tools', 'tools/', ['Trading Tools', 'Trading Tools', 'أدوات التداول']],
    ['youtube', 'youtube/', ['YouTube', 'YouTube', 'يوتيوب']],
    ['accounts', 'accounts/', ['Accounts', 'Accounts', 'الحسابات']],
    ['testv', '', ['🧪 Testversion V23 – neu', '🧪 Test version V23 – new', '🧪 النسخة التجريبية V23'], 'https://vrilyassluxion.github.io/test/', 'navtestv']   // Reiter zur neuesten Testversion (neuer Tab, in der Testversion selbst ausgeblendet)
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
  var GHT = ['Mein GitHub-Profil: Code, alle Versionen, Downloads', 'My GitHub profile: code, all versions, downloads', 'ملفي على GitHub: الكود وكل الإصدارات والتنزيلات'];
  var MAN = ['📖 Handbuch', '📖 Manual', '📖 الدليل'], CLOSE = ['Schließen', 'Close', 'إغلاق'], LANGT = ['Sprache', 'Language', 'اللغة'];
  var getLang = function () {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && q in L) return q;
    try { var s = sessionStorage.getItem('site_lang'); if (s && s in L) return s; } catch (e) { }
    try { var d = localStorage.getItem('fg9_deflang'); if (d && d in L) return d; } catch (e) { }
    return 'en';   // V22: neue Besucher sehen die Website auf Englisch
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
    var GHI = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" style="vertical-align:-2px;margin-right:5px"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
    var tab = function (t) { if (t[3]) { if (t[0] === 'testv') return window.SITE_TEST ? '' : '<a class="navext navtestv" href="' + t[3] + '" target="_blank" rel="noopener">' + esc(t[2][i]) + ' ↗</a>'; return '<a class="navext" href="' + t[3] + '" target="_blank" rel="noopener" title="' + esc(GHT[i]) + '">' + GHI + esc(t[2][i]) + ' ↗</a>'; } return t[0] === page ? '<span class="on">' + esc(t[2][i]) + '</span>' : '<a href="' + href(t[1]) + '">' + esc(t[2][i]) + '</a>'; };
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
    w.innerHTML = '<div class="siteman-dlg" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '"><div class="siteman-body">' + html + '</div><div class="siteman-btns"><select class="navlangsel manlang" title="' + esc(LANGT[L[lang]]) + '">' + LANGS.map(function (l) { return '<option value="' + l[0] + '"' + (l[0] === lang ? ' selected' : '') + '>' + l[1] + '</option>'; }).join('') + '</select><button type="button" data-manclose="1">' + esc(CLOSE[L[lang]]) + '</button></div></div>';
    w.classList.add('open');
  }
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#siteNav .navman')) openMan(); });
  document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('#siteNav .navlangsel')) window.siteSetLang(e.target.value); });
  // V22: Sprache auch direkt im Handbuch-Fenster umstellen (Handbuch wird in der neuen Sprache neu aufgebaut)
  document.addEventListener('change', function (e) { if (e.target.classList && e.target.classList.contains('manlang')) { window.siteSetLang(e.target.value); openMan(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.getElementById('siteMan')?.classList.remove('open'); });
  try { var f = JSON.parse(localStorage.getItem('tt_optik') || '{}').frame; if (f) document.documentElement.style.setProperty('--frame', f); } catch (e) { }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
