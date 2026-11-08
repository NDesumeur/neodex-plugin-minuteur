// Minuteur : plusieurs minuteurs en même temps, chacun avec son anneau, son nom et sa sonnerie.
// Plugin d'exemple entièrement autonome (seulement la permission « storage »). Les minuteurs gardent leur heure de fin : ils continuent même si tu fermes l'onglet.
export default function (ctx) {
  const S = ctx.el('style');
  S.textContent = `
    .mn{display:flex;flex-direction:column;gap:18px;padding:22px;box-sizing:border-box;max-width:880px;margin:0 auto;color:var(--shell,#fff)}
    .mn h2{font:16px var(--title,monospace);margin:0;letter-spacing:1px}
    .mn .new{display:flex;flex-direction:column;gap:12px;padding:16px;background:color-mix(in srgb,var(--line2,#3a2a6e) 45%,#000);box-shadow:inset 0 0 0 2px var(--line2,#3a2a6e)}
    .mn .set{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .mn input{font:22px var(--title,monospace);width:64px;text-align:center;color:#fff;background:#0d0820;border:2px solid var(--line2,#3a2a6e);padding:8px 4px}
    .mn input.name{flex:0 0 220px;width:220px;font-size:14px;text-align:left;padding:10px}
    .mn .sep{font:22px var(--title,monospace)}
    .mn .row{display:flex;gap:8px;flex-wrap:wrap}
    .mn button{font:12px var(--title,monospace);color:#fff;border:0;padding:10px 14px;cursor:pointer;background:color-mix(in srgb,var(--violet,#8a5cf0) 80%,#000);box-shadow:inset 0 2px 0 rgba(255,255,255,.25),inset 0 -3px 0 rgba(0,0,0,.35)}
    .mn button.main{background:color-mix(in srgb,var(--magenta,#e01ec8) 80%,#000)}
    .mn button.q{padding:8px 11px;background:color-mix(in srgb,var(--line2,#3a2a6e) 80%,transparent)}
    .mn button:active{transform:translateY(1px)}
    .mn .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
    .mn .card{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 10px 12px;background:color-mix(in srgb,var(--line2,#3a2a6e) 45%,#000);box-shadow:inset 0 0 0 2px var(--line2,#3a2a6e)}
    .mn .card.run{box-shadow:inset 0 0 0 2px var(--magenta,#e01ec8)}
    .mn .card.done{animation:mnBlink .6s steps(2) infinite}
    .mn .ring{position:relative;width:132px;height:132px}
    .mn canvas{width:132px;height:132px;image-rendering:pixelated}
    .mn .t{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:20px var(--title,monospace);text-shadow:0 0 10px rgba(var(--pkr,255,90,217),.5)}
    .mn .nm{font:12px var(--title,monospace);color:var(--lilac,#c9bde6);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .mn .x{position:absolute;top:6px;right:6px;padding:4px 8px}
    .mn .empty{opacity:.7;text-align:center;padding:30px 0}
    @keyframes mnBlink{50%{box-shadow:inset 0 0 0 2px var(--pink,#ff5ad9),0 0 18px var(--pink,#ff5ad9)}}`;
  const root = ctx.el('div', 'mn'), grid = ctx.el('div', 'grid');
  const inp = (cls, val, max) => { const i = ctx.el('input', cls); i.value = val; if (max) { i.type = 'number'; i.min = 0; i.max = max; } return i; };
  const iH = inp('', 0, 99), iM = inp('', 5, 999), iS = inp('', 0, 59), iName = inp('name', ''); iName.placeholder = 'Nom (facultatif)';
  const sep = () => ctx.el('span', 'sep', ':');
  const bAdd = ctx.el('button', 'main', 'AJOUTER LE MINUTEUR'), presets = ctx.el('div', 'row');
  const setTime = s => { iH.value = s / 3600 | 0; iM.value = s % 3600 / 60 | 0; iS.value = s % 60; };
  for (const [l, s] of [['1 min', 60], ['3 min', 180], ['5 min', 300], ['10 min', 600], ['15 min', 900], ['25 min', 1500], ['45 min', 2700], ['1 h', 3600]]) { const b = ctx.el('button', 'q', l); b.onclick = () => setTime(s); presets.append(b); }
  const form = ctx.el('div', 'new'), set = ctx.el('div', 'set');
  set.append(iH, sep(), iM, sep(), iS, iName, bAdd);
  form.append(ctx.el('h2', '', 'NOUVEAU MINUTEUR'), set, presets);
  root.append(form, ctx.el('h2', '', 'MES MINUTEURS'), grid);
  ctx.view.append(S, root);

  let timers = [], raf = null;
  const save = () => ctx.storage.set({ timers: timers.map(({ ui, ...t }) => t) });
  const fmt = s => (s >= 3600 ? (s / 3600 | 0) + ':' : '') + String(s % 3600 / 60 | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const left = t => t.endAt ? Math.max(0, Math.ceil((t.endAt - Date.now()) / 1000)) : t.left;
  function beep() {  // trois bips, sans fichier son
    try { const a = new AudioContext(); [0, .28, .56].forEach(d => { const o = a.createOscillator(), g = a.createGain(); o.type = 'square'; o.frequency.value = 880; g.gain.value = .08; o.connect(g); g.connect(a.destination); o.start(a.currentTime + d); o.stop(a.currentTime + d + .16); }); setTimeout(() => a.close(), 1200); } catch {}
  }
  function ring(cv, frac, on) {  // un anneau fait de 40 petits blocs
    const g = cv.getContext('2d'), N = 40, R = 26; g.clearRect(0, 0, 66, 66);
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2 - Math.PI / 2, x = Math.round(33 + Math.cos(a) * R) - 2, y = Math.round(33 + Math.sin(a) * R) - 2, lit = i < Math.round(frac * N);
      g.fillStyle = lit ? (on ? '#ff5ad9' : '#9d7bff') : '#2a1d52'; g.fillRect(x, y, 4, 4);
    }
  }
  function draw(t) {
    const u = t.ui, l = left(t), frac = t.total ? l / t.total : 0;
    u.t.textContent = fmt(l); ring(u.cv, frac, !!t.endAt); u.card.classList.toggle('run', !!t.endAt); u.card.classList.toggle('done', !!t.done);
    u.go.textContent = t.endAt ? 'PAUSE' : t.done || l <= 0 ? 'RELANCER' : l < t.total ? 'REPRENDRE' : 'DÉMARRER';
  }
  function card(t) {
    const c = ctx.el('div', 'card'), ringBox = ctx.el('div', 'ring'), cv = ctx.el('canvas'); cv.width = cv.height = 66;
    const tt = ctx.el('div', 't'), nm = ctx.el('div', 'nm', t.name || fmt(t.total)), row = ctx.el('div', 'row'), go = ctx.el('button', 'main'), rs = ctx.el('button', '', '↺'), x = ctx.el('button', 'x', '✕');
    rs.title = 'Remettre à zéro'; x.title = 'Supprimer';
    ringBox.append(cv, tt); row.append(go, rs); c.append(ringBox, nm, row, x);
    t.ui = { card: c, cv, t: tt, go };
    go.onclick = () => {
      if (t.endAt) { t.left = left(t); t.endAt = 0; } else { if (t.done || t.left <= 0) t.left = t.total; t.done = false; t.endAt = Date.now() + t.left * 1000; }
      save(); draw(t); loop();
    };
    rs.onclick = () => { t.endAt = 0; t.left = t.total; t.done = false; save(); draw(t); };
    x.onclick = () => { timers = timers.filter(o => o !== t); c.remove(); save(); empty(); };
    grid.append(c); draw(t);
  }
  function empty() { grid.querySelector('.empty')?.remove(); if (!timers.length) grid.append(ctx.el('div', 'empty', 'Aucun minuteur : choisis une durée ci-dessus.')); }
  function loop() {
    cancelAnimationFrame(raf);
    const step = () => {
      let any = false;
      for (const t of timers) {
        if (t.endAt) { any = true; if (left(t) <= 0 && !t.done) { t.endAt = 0; t.left = 0; t.done = true; save(); beep(); ctx.ui.toast((t.name || 'Minuteur') + ' : terminé !'); } draw(t); }
      }
      if (any) raf = requestAnimationFrame(() => setTimeout(step, 250));
    };
    step();
  }
  bAdd.onclick = () => {
    const total = Math.min(99 * 3600, (+iH.value || 0) * 3600 + (+iM.value || 0) * 60 + (+iS.value || 0)); if (total <= 0) return ctx.ui.toast('Choisis une durée.');
    const t = { id: Date.now().toString(36), name: iName.value.trim(), total, left: total, endAt: Date.now() + total * 1000, done: false };
    timers.push(t); grid.querySelector('.empty')?.remove(); card(t); iName.value = ''; save(); loop();
  };
  ctx.onOpen(async () => {
    const d = await ctx.storage.get(); grid.replaceChildren(); timers = (d && d.timers) || [];
    for (const t of timers) { if (t.endAt && t.endAt <= Date.now()) { t.endAt = 0; t.left = 0; t.done = true; } card(t); }
    empty(); loop();
  });
  ctx.onClose(() => cancelAnimationFrame(raf));
}
