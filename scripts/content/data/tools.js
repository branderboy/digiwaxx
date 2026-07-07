// Layer 8 — Interactive tools. Custom bodyHtml + inline JS; progress saved
// to localStorage. Every tool ends at the same door: submit your record.
const checklistItems = [
  { g: 'Before the Drop', items: [
    ['Master approved', 'Final master checked on car speakers, earbuds, and a big system'],
    ['Clean, dirty & instrumental versions exported', 'The three files DJs and radio need — no clean version means no mixshows'],
    ['Artwork final at 3000×3000', 'Readable at thumbnail size'],
    ['Metadata locked', 'Exact artist name, title, features, producers — identical everywhere'],
    ['Splits agreed in writing', 'Who owns what, settled while everyone is friends'],
    ['Distributed with 3+ weeks lead time', 'Buys you editorial pitching and pre-save runway'],
    ['Spotify editorial pitch submitted', 'Via Spotify for Artists — also secures Release Radar'],
    ['Pre-save link live and pinned', 'One ask in every teaser'],
    ['Record serviced to DJs', 'In DJ crates before street date so rooms can test it week one'],
    ['Content batch shot & scheduled', 'Teasers + announcement + release-week clips, made in advance'],
  ]},
  { g: 'Release Day', items: [
    ['Verified live on all DSPs', 'Spotify, Apple, YouTube, Tidal, Amazon, Audiomack — play it on each'],
    ['Every link updated within hour one', 'Link-in-bio, pinned posts, profile headers'],
    ['Announcement posted', 'The prepared one — today is for posting, not producing'],
    ['20–50 personal messages sent', 'Individual notes to real supporters, not a blast'],
    ['Every share & spin amplified', 'Repost, tag, thank — conversation reads as heat'],
  ]},
  { g: 'The Week After', items: [
    ['Day-one numbers logged', 'Streams, saves, playlist adds, DJ downloads'],
    ['DJ reactions collected', 'Clips, feedback, spin reports — this is your proof kit'],
    ['Curators & mixshows pitched with proof', 'Receipts attached, two sentences, direct link'],
    ['Wave two planned', 'Video, remix, or acoustic — scheduled for week 3–6'],
  ]},
];

const checklistBody = `
<div class="progress-wrap">
  <div class="progress-label"><span>Your Progress</span><span id="progressCount">0 / 0</span></div>
  <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
</div>
${checklistItems.map((group, gi) => `
<div class="tool-card">
  <h3>${group.g}</h3>
${group.items.map(([t, d], i) => `  <div class="check-item">
    <input type="checkbox" id="chk-${gi}-${i}" data-chk>
    <label for="chk-${gi}-${i}"><b>${t}</b><small>${d}</small></label>
  </div>`).join('\n')}
</div>`).join('\n')}
<script>
(function () {
  var boxes = document.querySelectorAll('[data-chk]');
  var KEY = 'dw-release-checklist';
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  boxes.forEach(function (b) {
    if (saved[b.id]) b.checked = true;
    b.addEventListener('change', update);
  });
  function update() {
    var done = 0, state = {};
    boxes.forEach(function (b) { if (b.checked) { done++; state[b.id] = 1; } });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    document.getElementById('progressCount').textContent = done + ' / ' + boxes.length;
    document.getElementById('progressFill').style.width = (done / boxes.length * 100) + '%';
  }
  update();
})();
</script>`;

const calculatorBody = `
<div class="tool-card">
  <h3>Your Release Budget</h3>
  <div class="calc-field">
    <label for="budget">Total budget for this release ($)</label>
    <input type="number" id="budget" min="0" step="25" value="500" inputmode="numeric">
  </div>
  <div class="calc-field">
    <label for="stage">Where is the record right now?</label>
    <select id="stage">
      <option value="pre">Not released yet</option>
      <option value="post">Already released</option>
    </select>
  </div>
  <div class="calc-field">
    <label for="mastered">Is it professionally mastered with clean &amp; instrumental versions?</label>
    <select id="mastered">
      <option value="no">Not yet</option>
      <option value="yes">Yes, all versions ready</option>
    </select>
  </div>
</div>
<div class="calc-result" id="calcResult">
  <h3>Recommended Allocation</h3>
  <div id="calcLines"></div>
  <div class="calc-total"><span>Total</span><span class="v" id="calcTotal"></span></div>
  <p id="calcNote" style="margin:1rem 0 0;font-size:0.9rem;"></p>
</div>
<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function money(n) { return '$' + Math.round(n); }
  function update() {
    var budget = Math.max(0, parseFloat($('budget').value) || 0);
    var needsPackaging = $('mastered').value === 'no';
    var pre = $('stage').value === 'pre';
    var lines = [];
    var remaining = budget;

    if (needsPackaging) {
      var pack = Math.min(remaining, Math.max(100, budget * 0.3));
      lines.push(['Packaging: mastering + clean/instrumental edits', pack,
        'Non-negotiable — this multiplies who can play the record.']);
      remaining -= pack;
    }
    var dj = Math.min(remaining, Math.max(99, remaining * 0.45));
    if (remaining > 0) {
      lines.push(['DJ service (record pool campaign)', dj,
        'Real-world exposure and the proof every other channel responds to.']);
      remaining -= dj;
    }
    if (remaining > 0) {
      var content = remaining * (pre ? 0.55 : 0.65);
      lines.push(['Content: clips, visualizer, reaction footage', content, '']);
      remaining -= content;
    }
    if (remaining > 0) {
      lines.push([pre ? 'Pre-save push & curator pitching' : 'Curator & mixshow pitching with your proof', remaining, '']);
    }

    $('calcLines').innerHTML = lines.map(function (l) {
      return '<div class="calc-line"><span>' + l[0] + '</span><span class="v">' + money(l[1]) + '</span></div>';
    }).join('');
    $('calcTotal').textContent = money(budget);
    $('calcNote').textContent = budget < 200
      ? 'Tight budget? Prioritize packaging and DJ service — skip paid content until the record has real reactions to film.'
      : (pre ? 'Spend the DJ service line 2–3 weeks before release day so rooms are testing the record in week one.'
             : 'Released records take DJ service every day — the pool doesn’t care about your release date, only whether the record works.');
  }
  ['budget', 'stage', 'mastered'].forEach(function (id) {
    $(id).addEventListener('input', update);
    $(id).addEventListener('change', update);
  });
  update();
})();
</script>`;

module.exports = [
  {
    slug: 'release-day-checklist',
    category: 'tools',
    featured: true,
    title: 'Release Day Checklist',
    navLabel: 'Release Day Checklist (Tool)',
    metaTitle: 'Free Interactive Release Day Checklist for Artists | Digiwaxx',
    description: 'Free interactive release checklist for independent artists — 19 steps from master to momentum, with progress saved in your browser.',
    question: 'What do I need to do before, during, and after my release?',
    quickAnswer: 'Work through the 19 steps below — pre-release, release day, and the week after. Your progress saves automatically in this browser, so keep the page open through your whole rollout.',
    bodyHtml: checklistBody,
    faq: [
      { q: 'Is my checklist progress saved?', a: 'Yes — in your browser (localStorage). Come back on the same device and browser and your checkmarks will be waiting.' },
      { q: 'What is the most important item on this list?', a: 'DJ service before release day. It is the one step that puts your record in front of new audiences rather than your existing followers — and it is the most commonly skipped.' },
    ],
    related: ['release-day-checklist-guide', 'how-to-release-a-single', 'release-budget-calculator', 'song-rollout-timeline'],
    cta: { kicker: 'Need help?', headline: 'Submit your record.', sub: 'The checklist gets you organized — the Digiwaxx network of 30,000+ DJs gets you heard.', button: 'Submit Your Record' },
  },
  {
    slug: 'release-budget-calculator',
    category: 'tools',
    featured: true,
    title: 'Release Budget Calculator',
    navLabel: 'Release Budget Calculator',
    metaTitle: 'Free Release Budget Calculator for Independent Artists | Digiwaxx',
    description: 'Enter your budget and release stage — get a recommended allocation across packaging, DJ service, content, and pitching, in priority order.',
    question: 'How should I split my music promotion budget?',
    quickAnswer: 'Allocate in priority order: packaging first (mastering, clean and instrumental versions), DJ service second (real-world exposure and proof), then content, then pitching. Enter your numbers below for a concrete split.',
    bodyHtml: calculatorBody,
    faq: [
      { q: 'Why does DJ service rank above ads in this calculator?', a: 'Because ads amplify momentum but rarely create it. DJ service generates real-world plays, honest feedback, and reusable proof — assets that make every later dollar (including ad dollars) work harder.' },
      { q: 'What if my budget is under $100?', a: 'Spend it on packaging: a clean edit and a solid master. A properly packaged record can be serviced and pitched credibly; an unmastered explicit-only file cannot — at any promotion budget.' },
    ],
    related: ['release-day-checklist', 'music-promotion-for-beginners', 'is-spotify-playlist-promotion-worth-it', 'how-to-promote-a-single-after-release'],
    cta: { kicker: 'Need help?', headline: 'Submit your record.', sub: 'Put the DJ-service line of your budget to work — 30,000+ DJs, one submission.', button: 'Submit Your Record' },
  },
];
