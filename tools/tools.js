// Trading Tools – Übersicht und Detailansicht. Alle Einträge stehen in tools.json.
// Neue Einträge: dort ein Objekt ergänzen; sortiert wird automatisch alphabetisch.
// V21: Texte in Deutsch / Englisch / Arabisch (Sprache aus der Reiter-Leiste); Inhalte aus tools.json bleiben vorerst Deutsch
const LGI = () => ({ de: 0, en: 1, ar: 2 })[window.SITE_LANG] ?? 0, TL = v => Array.isArray(v) ? v[LGI()] ?? v[0] : v;
const TT = k => TL({
  lead: ['Indikatoren, Expert Advisors und Programme, die ich für mein Trading gebaut habe – zum Anschauen, Testen und Herunterladen.', 'Indicators, expert advisors and programs I built for my trading – to view, test and download.', 'مؤشرات وروبوتات تداول وبرامج بنيتها لتداولي – للمشاهدة والتجربة والتنزيل.'],
  ph: ['Suchen, z. B. Fibonacci', 'Search, e.g. Fibonacci', 'بحث، مثلاً فيبوناتشي'], ul: ['Unterstriche', 'Underlines', 'خطوط سفلية'], frame: ['Rahmenfarbe', 'Frame colour', 'لون الإطار'],
  open: ['Klicken zum Aufklappen', 'Click to expand', 'انقر للتوسيع'], close: ['Klicken zum Zuklappen', 'Click to collapse', 'انقر للطي'], nohit: ['Keine Treffer in', 'No results in', 'لا نتائج في'],
  note: ['Detail-Texte der Tools sind vorerst nur auf Deutsch.', 'Tool detail texts are in German for now.', 'نصوص تفاصيل الأدوات بالألمانية حالياً.']
}[k]);
const CATS = [
  { id: 'metatrader', title: 'MetaTrader', sub: ['Indikatoren und Expert Advisors für MT4 / MT5', 'Indicators and expert advisors for MT4 / MT5', 'مؤشرات وروبوتات تداول لـ MT4 / MT5'],
    empty: ['Hier kommen bald die MT4/MT5-Indikatoren und EAs – mit Download (.mq4 / .ex4 / ZIP) oder Link zum MQL5 Market.', 'MT4/MT5 indicators and EAs are coming soon – with download (.mq4 / .ex4 / ZIP) or a link to the MQL5 Market.', 'مؤشرات وروبوتات MT4/MT5 قريباً – مع تنزيل (.mq4 / .ex4 / ZIP) أو رابط إلى سوق MQL5.'] },
  { id: 'tradingview', title: 'TradingView', sub: ['Pine-Script-Indikatoren und Strategien', 'Pine Script indicators and strategies', 'مؤشرات واستراتيجيات Pine Script'],
    empty: ['Die TradingView-Skripte werden hier nach und nach eingetragen – mit Vorschau und Link zur Veröffentlichung auf TradingView.', 'TradingView scripts are added here step by step – with preview and link to the publication on TradingView.', 'تُضاف سكربتات TradingView هنا تدريجياً – مع معاينة ورابط النشر على TradingView.'] },
  { id: 'desktop', title: 'Desktop-Tools', sub: ['Programme für Windows', 'Programs for Windows', 'برامج لويندوز'], empty: ['Noch keine Programme.', 'No programs yet.', 'لا توجد برامج بعد.'] },
  // V21: Verknüpfungen zu Plattformen und Hilfsprogrammen (Wunsch: TradingView, MT4, NetTime)
  { id: 'links', title: ['Verknüpfungen', 'Shortcuts', 'روابط'], sub: ['TradingView, MetaTrader, Zeit-Synchronisation …', 'TradingView, MetaTrader, time sync …', 'TradingView و MetaTrader ومزامنة الوقت …'], empty: '' },
  { id: 'geschuetzt', title: ['Geschützter Bereich', 'Protected area', 'منطقة محمية'], sub: ['nur mit Passwort · für später gemerkt', 'password only · planned for later', 'بكلمة مرور فقط · مخطط لاحقاً'], empty: '' },
];
const SHORTCUTS = [
  ['TradingView', 'https://www.tradingview.com/', ['Charts, Pine-Script-Indikatoren, Alarme', 'Charts, Pine Script indicators, alerts', 'رسوم بيانية ومؤشرات Pine Script وتنبيهات']],
  ['MetaTrader 4', 'https://www.metatrader4.com/', ['Plattform für Forex/CFD mit Indikatoren und EAs (MQL4)', 'Forex/CFD platform with indicators and EAs (MQL4)', 'منصة فوركس/CFD مع مؤشرات وروبوتات (MQL4)']],
  ['MetaTrader 5', 'https://www.metatrader5.com/', ['Nachfolger von MT4 (MQL5), Strategie-Tester', 'Successor of MT4 (MQL5), strategy tester', 'خليفة MT4 (MQL5) مع مختبر الاستراتيجيات']],
  ['MQL5 Market', 'https://www.mql5.com/en/market', ['Indikatoren und EAs für MT4/MT5 kaufen oder testen', 'Buy or test indicators and EAs for MT4/MT5', 'شراء أو تجربة مؤشرات وروبوتات MT4/MT5']],
  ['NetTime', 'https://www.timesynctool.com/', ['Hält die Windows-Uhr per Zeitserver genau – wichtig für zeitgenaue Kerzen, EAs und Alarme', 'Keeps the Windows clock exact via time servers – important for exact candles, EAs and alerts', 'يضبط ساعة ويندوز بدقة عبر خوادم الوقت – مهم للشموع الدقيقة والروبوتات والتنبيهات']],
];
const SHORT_HTML = () => `<div class="grid">${SHORTCUTS.slice().sort((a, b) => a[0].localeCompare(b[0])).map(([n, u, d]) => `<a class="card" href="${esc(u)}" target="_blank" rel="noopener"><div class="card-body"><h3>${esc(n)} ↗</h3><p>${esc(TL(d))}</p></div></a>`).join('')}</div>`;
// Platzhalter: Inhalte werden später verschlüsselt abgelegt (Passwort legt nur der Besitzer fest)
const LOCKED = `<div class="locked">
  <div class="lock-ico">🔒</div>
  <div class="lock-txt"><b>Für später gemerkt</b>
    <p>Hier kann später ein Bereich entstehen, den man nur mit Passwort öffnen kann – zum Beispiel für versteckte Skripte,
      Kopien anderer Autoren oder private Downloads. Der Inhalt wird dann verschlüsselt gespeichert; ohne Passwort kann ihn niemand lesen.</p>
    <div class="lock-form"><input type="password" placeholder="Passwort" disabled aria-label="Passwort (noch nicht eingerichtet)">
      <button disabled>Öffnen</button><span>Noch leer – noch kein Passwort festgelegt.</span></div>
  </div></div>`;
const STATUS = {
  download: ['Download', 'ok'], invite: ['Nur auf Einladung', 'inv'], market: ['MQL5 Market', 'mkt'],
  free: ['Kostenlos', 'ok'], soon: ['Bald verfügbar', 'soon'], private: ['Privat', 'soon'],
};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';
const byName = (a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
const badge = key => { const s = STATUS[key]; return s ? `<span class="badge ${s[1]}">${s[0]}</span>` : ''; };
const latest = it => (it.versions || [])[0];
let ITEMS = [], QUERY = '';

function card(it) {
  const img = it.images?.[0]?.src;
  const v = latest(it);
  return `<a class="card" href="#/${encodeURIComponent(it.id)}">
    ${img ? `<div class="thumb" style="background-image:url('${esc(img)}')"></div>` : `<div class="thumb none">${esc(it.platform || '')}</div>`}
    <div class="card-body">
      <h3>${esc(it.name)}</h3>
      <p>${esc(it.short)}</p>
      <div class="meta">${it.platform ? `<span class="badge plat">${esc(it.platform)}</span>` : ''}${badge(it.status)}
        ${v ? `<span>V${esc(v.v)} · ${fmtDate(v.date)}</span>` : ''}</div>
    </div></a>`;
}

function matches(it) {
  if (!QUERY) return true;
  const hay = [it.name, it.short, it.platform, ...(it.features || []), ...(it.tags || [])].join(' ').toLowerCase();
  return QUERY.split(/\s+/).every(w => hay.includes(w));
}

function overview() {
  document.title = 'Trading Tools · VrilyaSS';
  const count = id => id === 'links' ? SHORTCUTS.length : id === 'tradingview' && window.TVV?.ready() ? TVV.count() : ITEMS.filter(i => i.category === id).length;
  $('#app').innerHTML = `
    <div class="page">
      <div class="hero">
        <div><h1>Trading <span>Tools</span></h1>
          <p>${TT('lead')}</p>${LGI() ? `<p class="muted" style="font-size:12.5px">${TT('note')}</p>` : ''}</div>
        <label class="search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input id="q" type="search" placeholder="${TT('ph')}" value="${esc(QUERY)}" aria-label="Tools durchsuchen"></label>
      </div>
      <div class="navrow">
        <div class="catnav">${CATS.map(c => `<button data-go="${c.id}">${TL(c.title)} <b>${count(c.id)}</b></button>`).join('')}</div>
        <div class="viewopts" title="Aussehen der Bereiche (merkt sich dein Browser)">
          <label><input type="checkbox" id="ulsw" ${PREF.ul ? 'checked' : ''}> ${TT('ul')}</label>
          <label>${TT('frame')} <input type="color" id="framecol" value="${esc(PREF.frame)}"></label>
          <button id="framereset" title="Rahmenfarbe zurück auf Weiß">↺</button>
        </div>
      </div>
      <div id="cats"></div>
    </div>`;
  $('#q').addEventListener('input', e => { QUERY = e.target.value.trim().toLowerCase(); renderCats(); });
  $('#ulsw').onchange = e => { PREF.ul = e.target.checked; savePref(); applyPref(); };
  $('#framecol').oninput = e => { PREF.frame = e.target.value; savePref(); applyPref(); };
  $('#framereset').onclick = () => { PREF.frame = '#ffffff'; $('#framecol').value = PREF.frame; savePref(); applyPref(); };
  applyPref();
  // Knopf oben: Bereich aufklappen und hinspringen
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
    OPEN_CATS.add(b.dataset.go); saveOpen(); renderCats();
    document.getElementById('cat-' + b.dataset.go)?.scrollIntoView();
  });
  renderCats();
}

// aufgeklappte Bereiche (MetaTrader, TradingView, …) merkt sich der Browser
const OPEN_CATS = new Set((() => { try { return JSON.parse(localStorage.getItem('tt_bereiche') || '[]'); } catch (e) { return []; } })());
const saveOpen = () => { try { localStorage.setItem('tt_bereiche', JSON.stringify([...OPEN_CATS])); } catch (e) { } };
// Link mit ?bereich=tradingview (mehrere mit Komma) öffnet diese Bereiche
for (const b of (new URLSearchParams(location.search).get('bereich') || '').split(',')) if (b) OPEN_CATS.add(b);
// Aussehen der Bereichs-Kästen: Unterstrich unter der Überschrift (an/aus) und Rahmenfarbe
const PREF = Object.assign({ ul: true, frame: '#ffffff' }, (() => { try { return JSON.parse(localStorage.getItem('tt_optik') || '{}'); } catch (e) { return {}; } })());
const savePref = () => { try { localStorage.setItem('tt_optik', JSON.stringify(PREF)); } catch (e) { } };
const applyPref = () => { document.body.classList.toggle('tt-ul', !!PREF.ul); document.body.style.setProperty('--frame', PREF.frame); };

function renderCats() {
  const count = id => id === 'links' ? SHORTCUTS.length : id === 'tradingview' && window.TVV?.ready() ? TVV.count() : ITEMS.filter(i => i.category === id).length;
  $('#cats').innerHTML = `<div class="page">${CATS.map(c => {
    // bei einer Suche sind alle Bereiche offen, sonst nur die angeklickten
    const isOpen = OPEN_CATS.has(c.id) || !!QUERY;
    const head = `<button class="cat-head" data-cat="${c.id}" aria-expanded="${isOpen}">
      <span class="chev">${isOpen ? '▾' : '▸'}</span><span class="ttl"><h2>${TL(c.title)}</h2><span class="sub">– (${esc(TL(c.sub))}) –</span></span>
      <span class="clk">${isOpen ? TT('close') : TT('open')}</span><b class="cnt">${count(c.id)}</b></button>`;
    if (!isOpen) return `<section class="cat" id="cat-${c.id}">${head}</section>`;
    const all = ITEMS.filter(i => i.category === c.id).sort(byName);
    const hits = all.filter(matches);
    let body;
    // TradingView hat eine eigene Ansicht (Gruppen / Einzelliste / Versteckt) aus tradingview.json
    if (c.id === 'tradingview' && window.TVV?.ready()) body = `<div id="tvbox">${TVV.html(QUERY)}</div>`;
    else if (c.id === 'geschuetzt') body = LOCKED;
    else if (c.id === 'links') body = SHORT_HTML();
    else if (!all.length) body = `<div class="empty">${esc(TL(c.empty))}</div>`;
    else if (!hits.length) body = `<p class="nohit">${TT('nohit')} ${esc(TL(c.title))}.</p>`;
    else body = `<div class="grid">${hits.map(card).join('')}</div>`;
    return `<section class="cat open" id="cat-${c.id}">${head}<div class="cat-body">${body}</div></section>`;
  }).join('')}</div>`;
  document.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => {
    const id = b.dataset.cat; OPEN_CATS.has(id) ? OPEN_CATS.delete(id) : OPEN_CATS.add(id); saveOpen(); renderCats();
  });
  if (window.TVV?.ready()) TVV.bind(() => QUERY);
}

function detail(it) {
  document.title = `${it.name} · Trading Tools`;
  const cat = CATS.find(c => c.id === it.category);
  const v = latest(it);
  const imgs = it.images || [];
  const dl = (it.downloads || []).map((d, i) => `<a class="btn${i === 0 ? ' primary' : ''}" href="${esc(d.url)}" rel="noopener">
      <span>⬇ ${esc(d.label)}</span><small>${esc(d.size || '')}</small></a>`).join('');
  const links = (it.links || []).map(l => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener"><span>${esc(l.label)} ↗</span><small>${esc(l.note || '')}</small></a>`).join('');
  $('#app').innerHTML = `
    <div class="page">
      <a class="back" href="#">← Alle Tools</a>
      <div class="detail">
        <div class="main-col">
          <div>
            <div class="meta" style="margin-bottom:8px"><span class="badge">${esc(cat?.title || '')}</span>${it.platform ? `<span class="badge plat">${esc(it.platform)}</span>` : ''}${badge(it.status)}</div>
            <h1>${esc(it.name)}</h1>
            <p style="color:var(--muted);margin-top:6px">${esc(it.short)}</p>
          </div>
          ${imgs.length ? `<div class="box gallery">
            <div class="main" id="gMain" role="img" aria-label="${esc(imgs[0].caption || it.name)}" style="background-image:url('${esc(imgs[0].src)}')"></div>
            <div class="cap" id="gCap">${esc(imgs[0].caption || '')}</div>
            ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((im, i) => `<button class="${i ? '' : 'on'}" data-i="${i}" title="${esc(im.caption || '')}" style="background-image:url('${esc(im.src)}')"></button>`).join('')}</div>` : ''}
          </div>` : ''}
          ${(it.description || []).length ? `<div class="box desc"><h2>Beschreibung</h2>${it.description.map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
          ${(it.features || []).length ? `<div class="box"><h2>Funktionen</h2><ul class="feat">${it.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
        </div>
        <aside class="side">
          <div class="box"><h2>Überblick</h2><dl class="facts">
            <dt>Version</dt><dd>${v ? 'V' + esc(v.v) : '–'}</dd>
            <dt>Erstellt</dt><dd>${fmtDate(it.created)}</dd>
            <dt>Aktualisiert</dt><dd>${fmtDate(it.updated || v?.date)}</dd>
            ${it.platform ? `<dt>Plattform</dt><dd>${esc(it.platform)}</dd>` : ''}
            ${it.requires ? `<dt>Benötigt</dt><dd>${esc(it.requires)}</dd>` : ''}
          </dl></div>
          ${dl || links ? `<div class="box"><h2>${dl ? 'Download' : 'Links'}</h2><div class="actions">${dl}${links}</div></div>` : ''}
          ${(it.hints || []).length ? `<div class="box"><h2>Gut zu wissen</h2>${it.hints.map(h => `<div class="hint">${esc(h)}</div>`).join('')}</div>` : ''}
          ${(it.versions || []).length ? `<div class="box"><h2>Versionsverlauf</h2><div class="versions">${it.versions.map((x, i) => `<div class="ver">
              <h3>Version ${esc(x.v)}${i ? '' : '<em>neueste</em>'}<span>${fmtDate(x.date)}</span></h3>
              ${(x.notes || []).length ? `<ul>${x.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
              ${(x.downloads || []).length ? `<div class="vdl">${x.downloads.map(d => `<a href="${esc(d.url)}" rel="noopener">⬇ ${esc(d.label)} <small>${esc(d.size || '')}</small></a>`).join('')}</div>` : ''}</div>`).join('')}</div></div>` : ''}
        </aside>
      </div>
    </div>`;
  let cur = 0;
  document.querySelectorAll('.thumbs button').forEach(b => b.onclick = () => {
    cur = +b.dataset.i;
    $('#gMain').style.backgroundImage = `url('${imgs[cur].src}')`;
    $('#gMain').setAttribute('aria-label', imgs[cur].caption || it.name);
    $('#gCap').textContent = imgs[cur].caption || '';
    document.querySelectorAll('.thumbs button').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#gMain')?.addEventListener('click', () => { const lb = $('#lightbox'); lb.querySelector('img').src = imgs[cur].src; lb.classList.remove('hidden'); });
  scrollTo(0, 0);
}

function route() {
  const m = location.hash.match(/^#\/(.+)$/);
  const it = m && ITEMS.find(i => i.id === decodeURIComponent(m[1]));
  if (it) detail(it); else overview();
}

$('#lightbox').onclick = () => $('#lightbox').classList.add('hidden');
addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').classList.add('hidden'); });
addEventListener('hashchange', route);
addEventListener('sitelang', () => { if (ITEMS.length) route(); });   // V21: Sprache aus der Reiter-Leiste
Promise.all([
  fetch('tools.json', { cache: 'no-store' }).then(r => r.json()),
  fetch('tradingview.json', { cache: 'no-store' }).then(r => r.json()).catch(() => null),
]).then(([j, tv]) => { ITEMS = j.items || []; if (tv && window.TVV) TVV.init(tv); route(); })
  .catch(() => { $('#app').innerHTML = '<p class="nohit">Die Liste konnte nicht geladen werden. Bitte Seite neu laden.</p>'; });
