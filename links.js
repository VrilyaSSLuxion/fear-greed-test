/* V21: gemeinsame Link-Seiten (Playlisten, Strategien, Indikatoren, EA-Creators, Interviews, Kurse, Anbieter, Broker, Backtest, Prop-Firmen, YouTube, Accounts).
   Jede Seite setzt window.LINKPAGE = { title, lead, note?, groups: [{ name, items: [...] }] } (Texte als { de, en, ar } oder einfacher Text)
   und bindet ../links.css, ../links.js und ../nav.js ein.
   Eintrag: { name, url?, yt? (Suchbegriff → YouTube-Suche), ico? ('yt'|'web'|'tv'|'mt'|'tg'|'dc'|'x'|'book'|'tool'), desc?, tags?, see? [{ label, href }],
             links? [{ k: 'telegram'|'discord'|'web'|'youtube', url? }] (ohne url = „folgt“), soon? (Link folgt), aff? (true = Partner-Link, 'soon' = Partner-Link folgt) }
   Ansicht Liste (Standard) oder Kacheln, alphabetisch, Suche; Sprache folgt der Reiter-Leiste (Ereignis „sitelang“). */
(function () {
  var P = window.LINKPAGE || { groups: [] }, L = { de: 0, en: 1, ar: 2 };
  // V21b: Handbuch dieser Seite (Knopf „📖 Handbuch“ in der Reiter-Leiste) – eigenes aus LINKPAGE.manual, sonst ein allgemeines
  var lead = function (l) { var v = P.lead; return v == null ? '' : typeof v === 'string' ? v : v[l] || v.de || ''; }, ttl = function (l) { var v = P.title; return String(v == null ? '' : typeof v === 'string' ? v : v[l] || v.de || '').replace(/<[^>]+>/g, ''); };
  window.PAGE_MANUAL = P.manual || {
    de: '<h2>' + ttl('de') + '</h2><p>' + lead('de') + '</p><h3>So benutzt du die Seite</h3><ul><li><b>Suchen</b>: Name, Beschreibung oder Stichwort eintippen – die Liste filtert sofort.</li><li><b>Liste / Kacheln</b>: Ansicht umschalten (merkt sich dein Browser). Alles ist alphabetisch sortiert.</li><li>Klick auf einen Namen öffnet die Seite in einem neuen Tab. Einträge mit <b>🔎</b> öffnen die YouTube-Suche, bis der genaue Link eingetragen ist.</li><li><b>Siehe auch</b> führt zu passenden Seiten hier (z. B. Strategie → Indikator).</li><li><b>Partner-Link</b>: Registrierungs-Link des Seitenbetreibers (kann ihm eine Provision bringen, für dich ändert sich nichts). „Partner-Link folgt“ = wird noch eingetragen.</li></ul><h3>Sprache</h3><p>Oben rechts „DE ▾“ – gilt für alle Seiten.</p><p class="muted">Keine Anlageberatung.</p>',
    en: '<h2>' + ttl('en') + '</h2><p>' + lead('en') + '</p><h3>How to use this page</h3><ul><li><b>Search</b>: type a name, description or tag – the list filters instantly.</li><li><b>List / tiles</b>: switch the view (your browser remembers it). Everything is sorted alphabetically.</li><li>Clicking a name opens the site in a new tab. Entries with <b>🔎</b> open YouTube search until the exact link is added.</li><li><b>See also</b> leads to matching pages here (e.g. strategy → indicator).</li><li><b>Partner link</b>: the site owner’s sign-up link (may earn a commission, nothing changes for you). “Partner link coming” = not added yet.</li></ul><h3>Language</h3><p>Top right “DE ▾” – applies to all pages.</p><p class="muted">Not investment advice.</p>',
    ar: '<h2>' + ttl('ar') + '</h2><p>' + lead('ar') + '</p><h3>كيفية استخدام الصفحة</h3><ul><li><b>البحث</b>: اكتب اسماً أو وصفاً أو وسماً – تتم التصفية فوراً.</li><li><b>قائمة / بطاقات</b>: تبديل العرض (يتذكره المتصفح). كل شيء مرتب أبجدياً.</li><li>النقر على الاسم يفتح الموقع في تبويب جديد. العناصر ذات <b>🔎</b> تفتح بحث يوتيوب حتى يُضاف الرابط الدقيق.</li><li><b>انظر أيضاً</b> يقود إلى صفحات مناسبة هنا.</li><li><b>رابط شريك</b>: رابط تسجيل لصاحب الموقع (قد يمنحه عمولة دون تغيير بالنسبة لك).</li></ul><h3>اللغة</h3><p>أعلى اليمين «DE ▾» – تسري على كل الصفحات.</p><p class="muted">ليست نصيحة استثمارية.</p>'
  };
  var getLang = function () {
    var q = new URLSearchParams(location.search).get('lang'); if (q && q in L) return q;
    try { var s = sessionStorage.getItem('site_lang'); if (s && s in L) return s; } catch (e) { }
    try { var d = localStorage.getItem('fg9_deflang'); if (d && d in L) return d; } catch (e) { }
    return 'de';
  };
  var lang = getLang(), view = 'list', q = '';
  try { view = localStorage.getItem('site_view') || 'list'; } catch (e) { }
  var UI = {
    search: ['Suchen …', 'Search …', 'بحث …'], list: ['Liste', 'List', 'قائمة'], tiles: ['Kacheln', 'Tiles', 'بطاقات'],
    soon: ['Link folgt', 'Link coming', 'الرابط قريباً'], ytSearch: ['öffnet die YouTube-Suche', 'opens YouTube search', 'يفتح بحث يوتيوب'],
    aff: ['Partner-Link', 'Partner link', 'رابط شريك'], affSoon: ['Partner-Link folgt', 'Partner link coming', 'رابط الشريك قريباً'],
    none: ['Nichts gefunden.', 'Nothing found.', 'لا توجد نتائج.'], see: ['Siehe auch', 'See also', 'انظر أيضاً'], follows: ['folgt', 'coming', 'قريباً'],
    entries: ['Einträge', 'entries', 'عناصر'],
    foot: ['Keine Anlageberatung – Trading ist mit Risiken verbunden. Inhalte und Marken gehören den jeweiligen Erstellern. Mit „Partner-Link“ markierte Links können dem Seitenbetreiber eine Provision bringen; für dich ändert sich nichts. © VrilyaSS',
      'Not investment advice – trading involves risk. Content and brands belong to their creators. Links marked “partner link” may earn the site owner a commission; nothing changes for you. © VrilyaSS',
      'ليست نصيحة استثمارية – التداول ينطوي على مخاطر. المحتوى والعلامات التجارية ملك أصحابها. الروابط المعلّمة «رابط شريك» قد تمنح صاحب الموقع عمولة دون أي تغيير بالنسبة لك. © VrilyaSS']
  };
  var tx = function (v) { if (v == null) return ''; if (typeof v === 'string') return v; return v[lang] != null ? v[lang] : v.de != null ? v.de : v.en || ''; };
  var ui = function (k) { return UI[k][L[lang]]; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ICO = {
    yt: ['#3a0f14', '<svg width="26" height="26" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" fill="#ff3b3b"/><path d="M10 9l5 3-5 3z" fill="#fff"/></svg>'],
    web: ['#1b2a33', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7fd6ff" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>'],
    tv: ['#1e2a4a', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b9cff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-6 4 3 6-8"/><path d="M15 6h3v3"/></svg>'],
    mt: ['#2a2410', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f6c453" stroke-width="2"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 14l3-4 3 2 4-5M8 21h8"/></svg>'],
    tg: ['#10293a', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 11.5l17-7-3 15-5-4-3 3v-4.5l8-7-10 6z" fill="#2aa3e0"/></svg>'],
    dc: ['#1e1f3d', '<svg width="24" height="24" viewBox="0 0 24 24" fill="#8b93ff"><path d="M6 6c3-1.5 9-1.5 12 0 1.5 3 2.5 6 2 10-1.5 1.2-3 2-4.5 2.3l-1-1.6c1-.3 1.8-.7 2.5-1.2-4 1.8-8 1.8-12 0 .7.5 1.5.9 2.5 1.2l-1 1.6C5 18 3.5 17.2 2 16c-.5-4 .5-7 2-10z"/><circle cx="9" cy="12" r="1.4" fill="#1e1f3d"/><circle cx="15" cy="12" r="1.4" fill="#1e1f3d"/></svg>'],
    x: ['#202020', '<svg width="22" height="22" viewBox="0 0 24 24" fill="#eee"><path d="M4 4h4l4 5.5L16.5 4H20l-6.2 7.4L20.5 20h-4l-4.4-6-5 6H3.5l6.8-8z"/></svg>'],
    book: ['#2a1630', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d65ac9" stroke-width="2"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/><path d="M8 7h7"/></svg>'],
    tool: ['#162a22', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#33d39a" stroke-width="2"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>'],
    user: ['#2a2410', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f6c453" stroke-width="2.2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/></svg>']
  };
  var LK = { telegram: ['tg', 'Telegram'], discord: ['dc', 'Discord'], web: ['web', 'Web'], youtube: ['yt', 'YouTube'], x: ['x', 'X'], tradingview: ['tv', 'TradingView'] };
  var urlOf = function (it) { return it.url || (it.yt ? 'https://www.youtube.com/results?search_query=' + encodeURIComponent(it.yt) : ''); };
  function item(it) {
    var u = urlOf(it), ic = ICO[it.ico || (it.yt || /youtube\.com/.test(u) ? 'yt' : 'web')] || ICO.web, d = tx(it.desc);
    var flags = (it.aff ? '<span class="lp-aff' + (it.aff === 'soon' ? ' off' : '') + '">' + esc(ui(it.aff === 'soon' || !it.url ? 'affSoon' : 'aff')) + '</span>' : '') + (it.soon && !it.aff ? '<span class="lp-soon">' + esc(ui('soon')) + '</span>' : '') + (!it.url && it.yt ? '<span class="lp-hint">🔎 ' + esc(ui('ytSearch')) + '</span>' : '');
    var extra = (it.links || []).map(function (l) { var k = LK[l.k] || ['web', l.k]; return l.url ? '<a class="lp-chip" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(k[1]) + ' ↗</a>' : '<span class="lp-chip off">' + esc(k[1]) + ' · ' + esc(ui('follows')) + '</span>'; }).join('');
    var see = (it.see || []).map(function (s) { return '<a class="lp-see" href="' + esc(s.href) + '">→ ' + esc(tx(s.label)) + '</a>'; }).join('');
    var head = u ? '<a class="lp-name" href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(tx(it.name)) + ' <span class="go">↗</span></a>' : '<span class="lp-name">' + esc(tx(it.name)) + '</span>';
    return '<div class="lp-item"><span class="lp-ico" style="background:' + ic[0] + '">' + ic[1] + '</span><div class="lp-txt">' + head + (d ? '<p>' + esc(d) + '</p>' : '') +
      ((it.tags || []).length ? '<div class="lp-tags">' + it.tags.map(function (t) { return '<span>' + esc(tx(t)) + '</span>'; }).join('') + '</div>' : '') +
      (flags || extra ? '<div class="lp-meta">' + flags + extra + '</div>' : '') + (see ? '<div class="lp-seebox"><b>' + esc(ui('see')) + ':</b> ' + see + '</div>' : '') + '</div></div>';
  }
  function render() {
    var root = document.getElementById('lp'); if (!root) return;
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (P.docTitle) document.title = tx(P.docTitle);
    var ql = q.trim().toLowerCase(), n = 0;
    var groups = (P.groups || []).map(function (g) {
      var items = (g.items || []).filter(function (it) { if (!ql) return true; return [tx(it.name), tx(it.desc), (it.tags || []).map(tx).join(' ')].join(' ').toLowerCase().indexOf(ql) >= 0; });
      if (g.sort !== false) items = items.slice().sort(function (a, b) { return tx(a.name).localeCompare(tx(b.name), lang, { sensitivity: 'base' }); });
      n += items.length; return { g: g, items: items };
    }).filter(function (x) { return x.items.length || (!ql && x.g.empty); });
    var h = '<div class="lp-head"><h1>' + tx(P.title) + '</h1>' + (P.lead ? '<p class="lead">' + tx(P.lead) + '</p>' : '') + '</div>' + (P.note ? '<div class="lp-note">' + tx(P.note) + '</div>' : '');
    h += '<div class="lp-bar"><input id="lpQ" type="search" placeholder="' + esc(ui('search')) + '" value="' + esc(q) + '"><span class="lp-seg">' + ['list', 'tiles'].map(function (v) { return '<button type="button" data-v="' + v + '" class="' + (view === v ? 'on' : '') + '">' + esc(ui(v)) + '</button>'; }).join('') + '</span><span class="lp-n">' + n + ' ' + esc(ui('entries')) + '</span></div>';
    if (!groups.length) h += '<p class="lead">' + esc(ui('none')) + '</p>';
    groups.forEach(function (x) { h += '<section class="lp-grp">' + (x.g.name ? '<h2>' + esc(tx(x.g.name)) + '</h2>' : '') + (x.g.note ? '<p class="lp-gnote">' + tx(x.g.note) + '</p>' : '') + '<div class="lp-' + view + '">' + (x.items.length ? x.items.map(item).join('') : '<p class="lp-gnote">' + tx(x.g.empty) + '</p>') + '</div></section>'; });
    var had = document.activeElement && document.activeElement.id === 'lpQ', pos = had ? document.activeElement.selectionStart : 0;
    root.innerHTML = h;
    var foot = document.getElementById('lpFoot'); if (foot) foot.textContent = ui('foot');
    if (had) { var e = document.getElementById('lpQ'); e.focus(); try { e.setSelectionRange(pos, pos); } catch (er) { } }
  }
  document.addEventListener('input', function (e) { if (e.target && e.target.id === 'lpQ') { q = e.target.value; render(); } });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.lp-seg button'); if (!b) return; view = b.getAttribute('data-v'); try { localStorage.setItem('site_view', view); } catch (er) { } render(); });
  window.addEventListener('sitelang', function (e) { lang = e.detail; render(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
