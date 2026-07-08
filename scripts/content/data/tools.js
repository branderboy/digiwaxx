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
  {
    slug: 'dj-pitch-generator',
    category: 'tools',
    title: 'DJ Pitch Generator',
    navLabel: 'DJ Pitch Generator',
    metaTitle: 'Free DJ Pitch Generator: Write a Pitch DJs Actually Read | Digiwaxx',
    description: 'Free tool: enter your record’s details and get a short, professional DJ pitch — built on what working DJs say they want from artist outreach.',
    question: 'What should I say when I send my song to a DJ?',
    quickAnswer: 'Keep it under 80 words: who you are, what the record is (with BPM and versions available), one line of proof or context, and a frictionless link. Fill in the fields below and the generator writes it in that exact shape.',
    bodyHtml: `
<div class="tool-card">
  <h3>Your Record</h3>
  <div class="calc-field"><label for="pArtist">Artist name</label><input type="text" id="pArtist" placeholder="e.g. J Rome"></div>
  <div class="calc-field"><label for="pSong">Song title</label><input type="text" id="pSong" placeholder="e.g. Late Nights"></div>
  <div class="calc-field"><label for="pGenre">Genre / lane</label><input type="text" id="pGenre" placeholder="e.g. R&B, club tempo"></div>
  <div class="calc-field"><label for="pBpm">BPM (optional)</label><input type="text" id="pBpm" placeholder="e.g. 98" inputmode="numeric"></div>
  <div class="calc-field"><label for="pCity">Your city</label><input type="text" id="pCity" placeholder="e.g. Atlanta"></div>
  <div class="calc-field"><label for="pProof">One line of proof or context (optional)</label><input type="text" id="pProof" placeholder="e.g. Getting spins at Compound the last two weekends"></div>
  <div class="calc-field"><label for="pLink">Download link (all versions)</label><input type="text" id="pLink" placeholder="https://..."></div>
  <div class="calc-field"><label for="pDj">DJ name (optional — personalization doubles reply rates)</label><input type="text" id="pDj" placeholder="e.g. DJ Smoke"></div>
</div>
<div class="calc-result">
  <h3>Your Pitch</h3>
  <pre id="pitchOut" style="white-space:pre-wrap;font-family:inherit;color:var(--text-white);margin:0 0 1rem;line-height:1.6;"></pre>
  <button type="button" id="copyBtn" class="cta-btn" style="border:none;cursor:pointer;font-size:1.05rem;padding:0.7rem 1.6rem;">Copy Pitch</button>
  <p style="margin:1rem 0 0;font-size:0.85rem;">Rules the generator follows: under 80 words, versions stated, no "check out my music," one link, no attachments talk. Send it, then don't follow up for a week.</p>
</div>
<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ids = ['pArtist','pSong','pGenre','pBpm','pCity','pProof','pLink','pDj'];
  function build() {
    var artist = $('pArtist').value.trim() || '[Artist]';
    var song = $('pSong').value.trim() || '[Song Title]';
    var genre = $('pGenre').value.trim() || '[genre]';
    var bpm = $('pBpm').value.trim();
    var city = $('pCity').value.trim() || '[city]';
    var proof = $('pProof').value.trim();
    var link = $('pLink').value.trim() || '[download link]';
    var dj = $('pDj').value.trim();
    var lines = [];
    lines.push((dj ? 'What up ' + dj + ',' : 'What up,'));
    lines.push('');
    lines.push(artist + ' out of ' + city + ' — new record “' + song + '”, ' + genre + (bpm ? ' at ' + bpm + ' BPM' : '') + '. Clean, dirty, and instrumental in the link, tagged and ready.');
    if (proof) { lines.push(''); lines.push(proof + '.'); }
    lines.push('');
    lines.push(link);
    lines.push('');
    lines.push('If it works for your rooms, it’s yours. Appreciate you either way.');
    lines.push('— ' + artist);
    $('pitchOut').textContent = lines.join('\\n');
  }
  ids.forEach(function (id) { $(id).addEventListener('input', build); });
  $('copyBtn').addEventListener('click', function () {
    navigator.clipboard.writeText($('pitchOut').textContent).then(function () {
      $('copyBtn').textContent = 'Copied!';
      setTimeout(function () { $('copyBtn').textContent = 'Copy Pitch'; }, 1500);
    });
  });
  build();
})();
</script>`,
    faq: [
      { q: 'Should I send this pitch to hundreds of DJs?', a: 'No — personal pitches are for the handful of DJs you have real context with. For scale, service the record through the pool: one submission reaches 30,000+ DJs in the channel they already check.' },
      { q: 'Why does the pitch mention versions and BPM?', a: 'Because those are the first two practical questions a working DJ has. Answering them up front signals you know how DJs work — which is most of the battle for a reply.' },
    ],
    related: ['how-to-reach-djs', 'how-to-get-djs-to-play-my-song', 'artist-bio-generator', 'release-day-checklist'],
    cta: { kicker: 'Skip the one-by-one?', headline: 'Service the whole network instead.', sub: 'The pitch is for your five key DJs. For the other 30,000+, one submission does the delivery, packaging, and follow-through.', button: 'Submit Your Record' },
  },
  {
    slug: 'artist-bio-generator',
    category: 'tools',
    title: 'Artist Bio Generator',
    navLabel: 'Artist Bio Generator',
    metaTitle: 'Free Artist Bio Generator: Short, Medium & Press Bios | Digiwaxx',
    description: 'Free tool: enter your details and get three ready-to-paste artist bios — 1-line social, short streaming-profile, and full press/EPK versions.',
    question: 'How do I write an artist bio?',
    quickAnswer: 'A working bio answers four things fast: who you are, where you’re from, what you sound like, and one thing that proves motion. Fill in the fields and get all three lengths — social one-liner, streaming profile, and press/EPK.',
    bodyHtml: `
<div class="tool-card">
  <h3>Your Details</h3>
  <div class="calc-field"><label for="bName">Artist name</label><input type="text" id="bName" placeholder="e.g. J Rome"></div>
  <div class="calc-field"><label for="bCity">City / region</label><input type="text" id="bCity" placeholder="e.g. Houston, TX"></div>
  <div class="calc-field"><label for="bGenre">Genre / sound</label><input type="text" id="bGenre" placeholder="e.g. melodic rap with Southern bounce"></div>
  <div class="calc-field"><label for="bInfl">Influences or comparisons (optional)</label><input type="text" id="bInfl" placeholder="e.g. early Drake, UGK"></div>
  <div class="calc-field"><label for="bWork">Current release or project</label><input type="text" id="bWork" placeholder='e.g. the single "Late Nights"'></div>
  <div class="calc-field"><label for="bProof">Best achievement or proof so far (optional)</label><input type="text" id="bProof" placeholder="e.g. club spins across Texas and 200K independent streams"></div>
</div>
<div class="calc-result">
  <h3>Your Bios</h3>
  <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--pink);margin-bottom:0.3rem;">One-liner (social profiles)</p>
  <p id="bioShort" style="color:var(--text-white);"></p>
  <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--pink);margin:1rem 0 0.3rem;">Short (streaming profiles)</p>
  <p id="bioMed" style="color:var(--text-white);"></p>
  <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--pink);margin:1rem 0 0.3rem;">Full (press / EPK)</p>
  <p id="bioLong" style="color:var(--text-white);margin-bottom:1rem;"></p>
  <button type="button" id="bioCopy" class="cta-btn" style="border:none;cursor:pointer;font-size:1.05rem;padding:0.7rem 1.6rem;">Copy All Three</button>
</div>
<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ids = ['bName','bCity','bGenre','bInfl','bWork','bProof'];
  function build() {
    var name = $('bName').value.trim() || '[Artist]';
    var city = $('bCity').value.trim() || '[City]';
    var genre = $('bGenre').value.trim() || '[genre]';
    var infl = $('bInfl').value.trim();
    var work = $('bWork').value.trim() || 'new music';
    var proof = $('bProof').value.trim();
    $('bioShort').textContent = name + ' · ' + genre + ' · ' + city + ' · ' + work + ' out now';
    $('bioMed').textContent = name + ' is a ' + genre + ' artist from ' + city + '.'
      + (proof ? ' ' + proof.charAt(0).toUpperCase() + proof.slice(1) + '.' : '')
      + ' Now pushing ' + work + '.';
    $('bioLong').textContent = name + ' is a ' + genre + ' artist out of ' + city + '.'
      + (infl ? ' Drawing on ' + infl + ', ' + name + ' has built a sound that belongs to ' + city + ' and travels beyond it.' : '')
      + (proof ? ' ' + proof.charAt(0).toUpperCase() + proof.slice(1) + '.' : '')
      + ' The current focus is ' + work + ' — a record built for real rooms and serviced to working DJs.'
      + ' For bookings, press, and music, all links are in the artist’s bio.';
  }
  ids.forEach(function (id) { $(id).addEventListener('input', build); });
  $('bioCopy').addEventListener('click', function () {
    var all = ['ONE-LINER:', $('bioShort').textContent, '', 'SHORT:', $('bioMed').textContent, '', 'FULL:', $('bioLong').textContent].join('\\n');
    navigator.clipboard.writeText(all).then(function () {
      $('bioCopy').textContent = 'Copied!';
      setTimeout(function () { $('bioCopy').textContent = 'Copy All Three'; }, 1500);
    });
  });
  build();
})();
</script>`,
    faq: [
      { q: 'How long should an artist bio be?', a: 'Three lengths cover every use: a one-liner for social profiles, 2–3 sentences for streaming platforms, and 100–150 words for press and EPKs. Longer than that, nobody reads.' },
      { q: 'What makes a bio actually work?', a: 'Specifics: your city, your sound named precisely, and one verifiable proof point. "Versatile artist making waves" says nothing; "Houston melodic rap with club spins across Texas" books shows.' },
    ],
    related: ['dj-pitch-generator', 'get-more-fans', 'i-made-a-song', 'music-marketing-checklist'],
    cta: { kicker: 'Bio done?', headline: 'Give it a record worth reading about.', sub: 'A Digiwaxx campaign adds the proof line every bio needs: serviced to 30,000+ DJs, featured on Digiwaxx.com.', button: 'Submit Your Record' },
  },
  {
    slug: 'epk-builder',
    category: 'tools',
    title: 'EPK Builder',
    navLabel: 'EPK Builder',
    metaTitle: 'Free EPK Builder: One-Page Electronic Press Kit in Minutes | Digiwaxx',
    description: 'Free tool: build a clean one-page EPK — bio, record, proof, links, contact — formatted the way promoters, programmers, and press actually read them.',
    question: 'What goes in an artist EPK?',
    quickAnswer: 'A working EPK is one page: who you are (bio + city + sound), the current record, your best proof (spins, streams, coverage), two or three links, and a direct contact. Fill in the fields and copy the formatted kit below.',
    bodyHtml: `
<div class="tool-card">
  <h3>Your Details</h3>
  <div class="calc-field"><label for="eName">Artist name</label><input type="text" id="eName" placeholder="e.g. J Rome"></div>
  <div class="calc-field"><label for="eCity">City / region</label><input type="text" id="eCity" placeholder="e.g. Houston, TX"></div>
  <div class="calc-field"><label for="eGenre">Genre / sound</label><input type="text" id="eGenre" placeholder="e.g. melodic rap with Southern bounce"></div>
  <div class="calc-field"><label for="eBio">Two-sentence bio</label><textarea id="eBio" rows="2" style="width:100%;padding:0.8rem 1rem;border-radius:10px;border:1px solid var(--card-border);background:#0d050d;color:#fff;font-family:var(--font-body);font-size:1rem;" placeholder="Who you are and what makes your sound yours."></textarea></div>
  <div class="calc-field"><label for="eRecord">Current record / project</label><input type="text" id="eRecord" placeholder='e.g. "Late Nights" (single, out now)'></div>
  <div class="calc-field"><label for="eProof">Proof points — one per line</label><textarea id="eProof" rows="3" style="width:100%;padding:0.8rem 1rem;border-radius:10px;border:1px solid var(--card-border);background:#0d050d;color:#fff;font-family:var(--font-body);font-size:1rem;" placeholder="Club spins across Texas&#10;200K independent streams&#10;Featured on Digiwaxx.com"></textarea></div>
  <div class="calc-field"><label for="eLinks">Links — one per line (music, video, socials)</label><textarea id="eLinks" rows="3" style="width:100%;padding:0.8rem 1rem;border-radius:10px;border:1px solid var(--card-border);background:#0d050d;color:#fff;font-family:var(--font-body);font-size:1rem;" placeholder="https://open.spotify.com/artist/...&#10;https://youtube.com/...&#10;https://instagram.com/..."></textarea></div>
  <div class="calc-field"><label for="eContact">Booking / contact</label><input type="text" id="eContact" placeholder="e.g. bookings@artist.com · 555-555-5555"></div>
</div>
<div class="calc-result">
  <h3>Your EPK</h3>
  <pre id="epkOut" style="white-space:pre-wrap;font-family:inherit;color:var(--text-white);margin:0 0 1rem;line-height:1.6;"></pre>
  <button type="button" id="epkCopy" class="cta-btn" style="border:none;cursor:pointer;font-size:1.05rem;padding:0.7rem 1.6rem;">Copy EPK</button>
  <p style="margin:1rem 0 0;font-size:0.85rem;">Paste into an email, a doc, or a one-pager PDF. Keep it to one page — promoters decide in 30 seconds, and the kit's job is making those 30 seconds easy.</p>
</div>
<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ids = ['eName','eCity','eGenre','eBio','eRecord','eProof','eLinks','eContact'];
  function lineify(v, bullet) {
    return v.split('\\n').map(function (s) { return s.trim(); }).filter(Boolean)
      .map(function (s) { return bullet + s; }).join('\\n');
  }
  function build() {
    var name = $('eName').value.trim() || '[ARTIST NAME]';
    var city = $('eCity').value.trim() || '[City]';
    var genre = $('eGenre').value.trim() || '[genre]';
    var bio = $('eBio').value.trim() || '[Two-sentence bio]';
    var record = $('eRecord').value.trim() || '[Current record]';
    var proof = lineify($('eProof').value, '  • ') || '  • [Your best proof point]';
    var links = lineify($('eLinks').value, '  ') || '  [links]';
    var contact = $('eContact').value.trim() || '[contact]';
    $('epkOut').textContent = [
      name.toUpperCase(), genre + ' — ' + city, '',
      'ABOUT', bio, '',
      'CURRENT RECORD', record, '',
      'HIGHLIGHTS', proof, '',
      'LISTEN & WATCH', links, '',
      'BOOKING & CONTACT', contact,
    ].join('\\n');
  }
  ids.forEach(function (id) { $(id).addEventListener('input', build); });
  $('epkCopy').addEventListener('click', function () {
    navigator.clipboard.writeText($('epkOut').textContent).then(function () {
      $('epkCopy').textContent = 'Copied!';
      setTimeout(function () { $('epkCopy').textContent = 'Copy EPK'; }, 1500);
    });
  });
  build();
})();
</script>`,
    faq: [
      { q: 'Do I need a designed PDF EPK or a website?', a: 'The content matters more than the container. This one-pager pasted into an email outperforms a beautiful PDF nobody opens. When you do design it, keep it to one page with these exact sections.' },
      { q: 'What if I don’t have proof points yet?', a: 'That is the signal to run a campaign before pitching promoters: DJ service, spins, and a published feature are exactly the highlight lines an empty EPK is missing.' },
    ],
    related: ['artist-bio-generator', 'press-release-generator', 'get-booked-for-shows', 'dj-pitch-generator'],
    cta: { kicker: 'EPK looking thin?', headline: 'Earn the highlight lines.', sub: 'A Digiwaxx campaign fills the Highlights section: serviced to 30,000+ DJs, radio rotation, and a published Digiwaxx.com feature.', button: 'Submit Your Record' },
  },
  {
    slug: 'press-release-generator',
    category: 'tools',
    title: 'Press Release Generator',
    navLabel: 'Press Release Generator',
    metaTitle: 'Free Music Press Release Generator | Digiwaxx',
    description: 'Free tool: generate a properly formatted press release for your single or project — headline, dateline, quote, boilerplate — ready to send to blogs and media.',
    question: 'How do I write a press release for a music release?',
    quickAnswer: 'Follow the standard structure media expects: a headline stating the news, a dateline, a lead paragraph with who/what/when, one strong quote, supporting detail, a boilerplate about the artist, and contact info. Fill in the fields and it’s formatted below.',
    bodyHtml: `
<div class="tool-card">
  <h3>The News</h3>
  <div class="calc-field"><label for="rArtist">Artist name</label><input type="text" id="rArtist" placeholder="e.g. J Rome"></div>
  <div class="calc-field"><label for="rTitle">Release title</label><input type="text" id="rTitle" placeholder='e.g. Late Nights'></div>
  <div class="calc-field"><label for="rType">Release type</label><select id="rType"><option>single</option><option>EP</option><option>album</option><option>mixtape</option><option>music video</option></select></div>
  <div class="calc-field"><label for="rDate">Release date</label><input type="text" id="rDate" placeholder="e.g. March 14, 2026"></div>
  <div class="calc-field"><label for="rCity">City</label><input type="text" id="rCity" placeholder="e.g. Houston, TX"></div>
  <div class="calc-field"><label for="rGenre">Genre / sound</label><input type="text" id="rGenre" placeholder="e.g. melodic Southern rap"></div>
  <div class="calc-field"><label for="rHook">What makes this release a story? (one sentence)</label><input type="text" id="rHook" placeholder="e.g. the follow-up to a record that earned club spins across Texas"></div>
  <div class="calc-field"><label for="rQuote">A quote from you about the record</label><textarea id="rQuote" rows="2" style="width:100%;padding:0.8rem 1rem;border-radius:10px;border:1px solid var(--card-border);background:#0d050d;color:#fff;font-family:var(--font-body);font-size:1rem;" placeholder="I made this record for..."></textarea></div>
  <div class="calc-field"><label for="rBoiler">One-sentence artist boilerplate</label><input type="text" id="rBoiler" placeholder="e.g. J Rome is a Houston artist blending melodic rap with Southern bounce."></div>
  <div class="calc-field"><label for="rContact">Media contact</label><input type="text" id="rContact" placeholder="e.g. press@artist.com"></div>
</div>
<div class="calc-result">
  <h3>Your Press Release</h3>
  <pre id="prOut" style="white-space:pre-wrap;font-family:inherit;color:var(--text-white);margin:0 0 1rem;line-height:1.6;"></pre>
  <button type="button" id="prCopy" class="cta-btn" style="border:none;cursor:pointer;font-size:1.05rem;padding:0.7rem 1.6rem;">Copy Press Release</button>
</div>
<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ids = ['rArtist','rTitle','rType','rDate','rCity','rGenre','rHook','rQuote','rBoiler','rContact'];
  function build() {
    var artist = $('rArtist').value.trim() || '[Artist]';
    var title = $('rTitle').value.trim() || '[Title]';
    var type = $('rType').value;
    var date = $('rDate').value.trim() || '[release date]';
    var city = $('rCity').value.trim() || '[CITY]';
    var genre = $('rGenre').value.trim() || '[genre]';
    var hook = $('rHook').value.trim();
    var quote = $('rQuote').value.trim() || '[Quote about the record]';
    var boiler = $('rBoiler').value.trim() || artist + ' is a ' + genre + ' artist based in ' + city + '.';
    var contact = $('rContact').value.trim() || '[media contact]';
    $('prOut').textContent = [
      'FOR IMMEDIATE RELEASE', '',
      artist.toUpperCase() + ' ANNOUNCES NEW ' + type.toUpperCase() + ' “' + title.toUpperCase() + '” — OUT ' + date.toUpperCase(),
      '',
      city.toUpperCase() + ' — ' + artist + ' releases the new ' + type + ' “' + title + '” on ' + date + '.'
        + (hook ? ' The release marks ' + hook + '.' : '')
        + ' The ' + genre + ' record is available on all streaming platforms.',
      '',
      '“' + quote.replace(/^"|"$/g, '') + ',” says ' + artist + '.',
      '',
      'The record has been serviced to the Digiwaxx DJ network of 30,000+ club, mixshow, and radio DJs.',
      '',
      'ABOUT ' + artist.toUpperCase(),
      boiler,
      '',
      'MEDIA CONTACT',
      contact,
      '',
      '###',
    ].join('\\n');
  }
  ids.forEach(function (id) { $(id).addEventListener('input', build); $(id).addEventListener('change', build); });
  $('prCopy').addEventListener('click', function () {
    navigator.clipboard.writeText($('prOut').textContent).then(function () {
      $('prCopy').textContent = 'Copied!';
      setTimeout(function () { $('prCopy').textContent = 'Copy Press Release'; }, 1500);
    });
  });
  build();
})();
</script>`,
    faq: [
      { q: 'Who do I send a music press release to?', a: 'Targeted, small lists beat blasts: local outlets in your city, genre blogs that cover your lane, college papers, and the newsletters DJs and curators read. Personal one-line intros with the release pasted below convert best.' },
      { q: 'Note: the generated release mentions Digiwaxx servicing — should I keep that line?', a: 'Keep it if your record has actually been serviced through a campaign — it is a real, verifiable distribution fact media can cite. Delete it if not; never claim promotion that didn’t happen.' },
    ],
    related: ['epk-builder', 'artist-bio-generator', 'how-to-release-a-single', 'i-need-people'],
    cta: { kicker: 'Want the line to be true?', headline: 'Service the record first.', sub: 'One submission makes the distribution claim real: 30,000+ DJs, radio rotation, and a published feature to link in the release.', button: 'Submit Your Record' },
  },
];
