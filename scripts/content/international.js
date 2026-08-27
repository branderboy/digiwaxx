#!/usr/bin/env node
/**
 * The international label pages and the Africa acquisition cluster.
 *
 * Sixteen pages: a Korean and a Spanish label sales page plus the English
 * /labels page (an hreflang trio), the /africa hub with five market pages
 * (Nigeria, South Africa, Ghana, Kenya standing for East Africa, and the
 * Afrobeats USA pillar), and six supporting guides that feed them.
 *
 * These sell label and distributor campaigns, a different buyer from the
 * $99 artist funnel: the CTA is a campaign request form posting to
 * /api/campaign-leads, not the pricing table. The pricing table still gets
 * a block at the bottom of each page, because an artist who lands here with
 * one record is better served by the standard funnel than by a form asking
 * for a release schedule.
 *
 * Every page is a distinct offer written for its own buyer. The Nigeria
 * page and the Ghana page share a funnel shape and nothing else; if
 * swapping their country names ever reads as plausible, the copy has
 * failed and should be rewritten, not patched.
 *
 * Claims policy: the only Digiwaxx claims printed are the ones the rest of
 * the site already makes (30,000+ DJs, servicing records since 1998, the
 * ~100K daily uploads context stat). Market statistics appear only with
 * their source named in the same sentence, all of them from Spotify's own
 * Africa reporting. Cities are targeting language, never trend claims.
 *
 * Usage: node scripts/content/international.js   (writes pages in place)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SITE = 'https://promote.digiwaxx.com';

// Alt text for the shared social card — one image site-wide, so the text
// describes the card, not the page linking to it.
const CARD_ALT = 'Digiwaxx — Get Your New Release in Front of 30,000+ DJs. '
  + 'Clubs, radio and playlists since 1998.';

// og:locale wants a region. <html lang> carries only the language on the
// Spanish-language market pages, so the market directory picks the region.
const LOCALES = { 'en': 'en_US', 'en-GB': 'en_GB', 'es': 'es_ES', 'pt-BR': 'pt_BR',
  'fr': 'fr_FR', 'ja': 'ja_JP', 'ko': 'ko_KR', 'id': 'id_ID' };
const DIR_LOCALES = { mx: 'es_MX', co: 'es_CO', conosur: 'es_AR', br: 'pt_BR',
  ca: 'en_CA', uk: 'en_GB', india: 'en_IN', ph: 'en_PH' };
const ogLocale = (slug, lang) => DIR_LOCALES[String(slug || '').split('/')[0]]
  || LOCALES[lang] || LOCALES[String(lang || '').split('-')[0]] || 'en_US';

const FEED_LINK = `    <link rel="alternate" type="application/rss+xml" title="Digiwaxx University" href="${SITE}/feed.xml">`;

/* ------------------------------------------------------------------ chrome */

const HEAD_FONTS = `    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/content.css">
    <link rel="stylesheet" href="/assets/light.css">`;

const NAV = `<nav class="cnav">
  <div class="cnav-inner">
    <a class="cnav-logo" href="/" aria-label="Digiwaxx home"><img src="/assets/logo.png" alt="Digiwaxx" width="150" height="25" decoding="async"></a>
    <div class="cnav-links">
      <a href="/university">University</a>
      <a href="/campaigns">Campaigns</a>
      <a href="/guides">Guides</a>
      <a href="/answers">Answers</a>
      <a href="/promotion">Cities &amp; Platforms</a>
      <a href="/tools">Tools</a>
    </div>
    <a class="cnav-cta" href="/#pricing">Submit Your Record &rarr;</a>
  </div>
</nav>`;

const FOOTER = `<footer class="cfooter">
  <div class="cfooter-inner">
    <div class="cfooter-brand"><img src="/assets/logo.png" alt="Digiwaxx" width="180" height="30" decoding="async"><p>Trusted by 30,000+ DJs since 1998.</p>
      <a class="cfooter-cta" href="/#pricing">Submit Your Record &rarr;</a>
      <a class="cfooter-hub" href="/university">Browse Digiwaxx University &rarr;</a>
      <a class="cfooter-hub" href="/contact">Contact Us &rarr;</a>
    </div>
    <div class="cfooter-cols">
      <div class="cfooter-col"><h4><a href="/promote">Promotion Services</a></h4>
        <a href="/promote/promote-my-single">Promote My Single</a>
        <a href="/promote/music-promotion-service">Music Promotion Service</a>
        <a href="/promote/independent-music-promotion">Independent Music Promotion</a>
        <a href="/promote/promote-my-album">Promote My Album</a>
        <a href="/promote/promote-my-ep">Promote My EP</a>
        <a class="cfooter-more" href="/promote">View all 10 &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/labels">Global Campaigns</a></h4>
        <a href="/labels">International Labels</a>
        <a href="/africa">Africa Hub</a>
        <a href="/ko/us-dj-promotion-for-korean-labels">Korea</a>
        <a href="/es/promocion-dj-estados-unidos">Latin America</a>
        <a href="/br/promocao-dj-eua">Brazil</a>
        <a href="/mx/promocion-musica-mexicana-eeuu">Mexico</a>
        <a class="cfooter-more" href="/labels">All markets &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/guides">Blog &amp; Press</a></h4>
        <a href="/guides/how-shazam-works-for-artists">How Shazam Works for Artists</a>
        <a href="/guides/mixshow-vs-rotation">Mixshow vs. Rotation</a>
        <a href="/guides/dj-data-spins-crates-charts">DJ Data: Spins &amp; Charts</a>
        <a href="/guides/music-metrics-that-actually-matter">Music Metrics That Matter</a>
        <a href="/guides/how-songs-break-city-by-city">How Songs Break City by City</a>
        <a href="https://addaguestpost.com/newsroom/digiwaxx-goes-global-us-dj-promotion-international" target="_blank" rel="noopener">Press: Digiwaxx Goes Global</a>
        <a class="cfooter-more" href="/guides">All articles &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/campaigns">Campaign Blueprints</a></h4>
        <a href="/campaigns/60-day-release-plan">60-Day Release Plan</a>
        <a href="/campaigns/30-day-post-release-sprint">30-Day Post-Release Sprint</a>
        <a href="/campaigns/club-record-campaign">Club Record Campaign</a>
        <a href="/campaigns/90-day-new-artist-launch">90-Day New Artist Launch</a></div>
      <div class="cfooter-col"><h4><a href="/guides">Release &amp; Promotion Guides</a></h4>
        <a href="/guides/my-song-isnt-getting-streams">Song Isn't Getting Streams</a>
        <a href="/guides/how-to-promote-a-single-after-release">Promote After Release</a>
        <a href="/guides/how-to-release-a-single">How to Release a Single</a>
        <a href="/guides/how-to-promote-a-rap-song">Promote a Rap Song</a>
        <a href="/guides/how-to-get-djs-to-play-my-song">Get DJs to Play Your Song</a>
        <a class="cfooter-more" href="/guides">View all 29 &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/goals">Artist Goals</a></h4>
        <a href="/goals/get-more-fans">Get More Fans</a>
        <a href="/goals/get-club-plays">Get Club Plays</a>
        <a href="/goals/get-booked-for-shows">Get Booked</a>
        <a href="/goals/grow-spotify-listeners">Grow Spotify Listeners</a>
        <a href="/goals/get-playlist-placement">Get Playlist Placement</a>
        <a class="cfooter-more" href="/goals">View all 6 &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/answers">Straight Answers</a></h4>
        <a href="/answers/does-dj-promotion-still-work">Does DJ Promotion Still Work?</a>
        <a href="/answers/how-record-pools-work">How Record Pools Work</a>
        <a href="/answers/how-much-does-music-promotion-cost">Promotion Costs</a>
        <a href="/answers/is-spotify-playlist-promotion-worth-it">Is Playlist Promotion Worth It?</a>
        <a href="/answers/do-djs-still-break-records">Do DJs Still Break Records?</a>
        <a class="cfooter-more" href="/answers">View all 16 &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/promotion">Promotion by Genre</a></h4>
        <a href="/promotion/hip-hop-promotion">Hip Hop Promotion</a>
        <a href="/promotion/afrobeats-promotion">Afrobeats Promotion</a>
        <a href="/promotion/rnb-promotion">R&amp;B Promotion</a>
        <a href="/promotion/latin-music-promotion">Latin Music Promotion</a>
        <a href="/promotion/dancehall-promotion">Dancehall Promotion</a>
        <a href="/promotion/gospel-promotion">Gospel Promotion</a>
        <a href="/promotion/reggae-promotion">Reggae Promotion</a></div>
      <div class="cfooter-col"><h4><a href="/promotion">Promotion by City</a></h4>
        <a href="/promotion/music-promotion-new-york">Music Promotion New York</a>
        <a href="/promotion/music-promotion-atlanta">Music Promotion Atlanta</a>
        <a href="/promotion/music-promotion-los-angeles">Music Promotion Los Angeles</a>
        <a href="/promotion/music-promotion-houston">Music Promotion Houston</a>
        <a href="/promotion/music-promotion-chicago">Music Promotion Chicago</a>
        <a href="/promotion/music-promotion-miami">Music Promotion Miami</a>
        <a class="cfooter-more" href="/promotion">View all 57 &rarr;</a></div>
      <div class="cfooter-col"><h4><a href="/promotion">Promotion by Platform</a></h4>
        <a href="/promotion/spotify-playlist-promotion">Spotify Playlist Promotion</a>
        <a href="/promotion/youtube-music-promotion">YouTube Music Promotion</a>
        <a href="/promotion/apple-music-promotion">Apple Music Promotion</a>
        <a href="/promotion/audiomack-promotion">Audiomack Promotion</a>
        <a href="/promotion/tidal-promotion">TIDAL Promotion</a></div>
      <div class="cfooter-col"><h4><a href="/compare">Comparisons</a></h4>
        <a href="/compare/digiwaxx-vs-playlist-push">vs. Playlist Push</a>
        <a href="/compare/digiwaxx-vs-submithub">vs. SubmitHub</a>
        <a href="/compare/digiwaxx-vs-groover">vs. Groover</a>
        <a href="/compare/best-record-pools">Best Record Pools</a></div>
      <div class="cfooter-col"><h4><a href="/journey">The Artist Journey</a></h4>
        <a href="/journey/i-made-a-song">Stage 1: I Made a Song</a>
        <a href="/journey/i-released-it">Stage 2: I Released It</a>
        <a href="/journey/i-need-people">Stage 3: I Need People</a>
        <a href="/journey/im-getting-traction">Stage 4: Getting Traction</a></div>
      <div class="cfooter-col"><h4><a href="/tools">Free Artist Tools</a></h4>
        <a href="/tools/release-day-checklist">Release Day Checklist (Tool)</a>
        <a href="/tools/release-budget-calculator">Release Budget Calculator</a>
        <a href="/tools/dj-pitch-generator">DJ Pitch Generator</a>
        <a href="/tools/artist-bio-generator">Artist Bio Generator</a>
        <a href="/tools/epk-builder">EPK Builder</a>
        <a class="cfooter-more" href="/tools">View all 6 &rarr;</a></div>
    </div>
  </div>
  <p class="cfooter-copy">&copy; 2026 Digiwaxx Media. All rights reserved.</p>
</footer>`;

/* Small additions content.css does not carry: the campaign form grid. */
const FORM_CSS = `<style>
.cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; margin-top: 1rem; }
.cf-grid .cf-wide { grid-column: 1 / -1; }
@media (max-width: 640px) { .cf-grid { grid-template-columns: 1fr; } }
.calc-field textarea { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.18); border-radius: 6px; color: #fff; font-family: inherit; font-size: 0.95rem; padding: 0.6rem 0.7rem; min-height: 90px; }
.cf-opt { color: var(--text-muted); font-weight: 400; text-transform: none; letter-spacing: 0; }
.cf-btn { margin-top: 1.2rem; }
.cf-note { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.7rem; }
.cf-hp { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; opacity: 0; pointer-events: none; }
.lang-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0 0 1.2rem; }
.lang-row a, .lang-row span { font-family: var(--font-head); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.8rem; padding: 0.3rem 0.9rem; border: 1px solid rgba(255,255,255,0.25); border-radius: 999px; color: var(--text-white); text-decoration: none; }
.lang-row span { background: var(--accent); border-color: var(--accent); color: #1a0a18; }
.lang-row a:hover { border-color: var(--accent); color: var(--accent); }
</style>`;

/* ------------------------------------------------------------------ helpers */

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const attr = esc;

function field(name, label, { type = 'text', req = true, opt = '' } = {}) {
  return `<div class="calc-field${['artist', 'message', 'link'].includes(name) ? ' cf-wide' : ''}">
      <label for="cf-${name}">${esc(label)}${req ? '' : ` <span class="cf-opt">${esc(opt)}</span>`}</label>
      ${name === 'message'
        ? `<textarea id="cf-${name}" name="${name}"></textarea>`
        : `<input id="cf-${name}" name="${name}" type="${type}"${req ? ' required' : ''}>`}
    </div>`;
}

function selectField(name, label, options) {
  return `<div class="calc-field">
      <label for="cf-${name}">${esc(label)}</label>
      <select id="cf-${name}" name="${name}">${options.map((o) => `<option>${esc(o)}</option>`).join('')}</select>
    </div>`;
}

function campaignForm(p) {
  const f = p.form;
  const extras = (f.extras || []).map((x) => selectField(x.name, x.label, x.options)).join('\n    ');
  return `<section class="body-section" id="campaign-form">
  <h2>${esc(f.title)}</h2>
  <form id="cf" novalidate>
    <div class="cf-grid">
      ${field('company', f.company)}
      ${field('name', f.name)}
      ${field('email', f.email, { type: 'email' })}
      ${field('phone', f.phone, { type: 'tel', req: false, opt: f.optional })}
      ${selectField('role', f.role, f.roles)}
      ${selectField('timing', f.timing, f.timings)}
      ${field('artist', f.artist)}
      ${field('link', f.link, { type: 'url', req: false, opt: f.optional })}
      ${selectField('intent', f.intent, f.intents)}
      ${extras}
      ${field('message', f.message, { req: false, opt: f.optional })}
    </div>
    <input class="cf-hp" type="text" name="company_hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="cta-btn cf-btn" type="submit">${esc(f.submit)} &rarr;</button>
    <p class="cf-note" id="cf-note">${esc(f.note)}</p>
  </form>
</section>
<script>(function(){
  var M=${JSON.stringify({ sending: f.sending, ok: f.ok, fail: f.fail, invalid: f.invalid })};
  var form=document.getElementById('cf');if(!form)return;
  var note=document.getElementById('cf-note'),btn=form.querySelector('button'),busy=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();if(busy)return;
    if(!form.reportValidity||form.reportValidity()){
      busy=true;btn.disabled=true;var was=btn.textContent;btn.textContent=M.sending;
      var d={page:${JSON.stringify('/' + p.slug)}};new FormData(form).forEach(function(v,k){d[k]=v;});
      fetch('/api/campaign-leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)})
        .then(function(r){return r.json();})
        .then(function(j){if(j&&j.ok){form.reset();note.textContent=M.ok;}else{note.textContent=(j&&j.error)||M.fail;}})
        .catch(function(){note.textContent=M.fail;})
        .finally(function(){busy=false;btn.disabled=false;btn.textContent=was;});
    } else { note.textContent=M.invalid; }
  });
})();</script>`;
}

function related(title, cards) {
  return `<section class="related">
  <h2>${esc(title)}</h2>
  <div class="related-grid">
    ${cards.map((c) => `<a class="related-card" href="${attr(c.href)}"><span class="related-cat">${esc(c.cat)}</span><span class="related-t">${esc(c.t)}</span></a>`).join('\n    ')}
  </div>
</section>`;
}

/* ---------------------------------------------------------------- taxonomy
 *
 * The content hierarchy, per the brief: 1. music industry (who you are),
 * 2. country (where you are), 3. music category (what you make). Every
 * conversion page renders the same three browse rails from these lists,
 * with itself filtered out, so the cluster reads as one organised catalogue
 * rather than pages that happen to link each other. Genres without a page
 * of their own point at the page that owns them.
 */

const TAX_INDUSTRY = [
  { href: '/labels', t: 'International Labels & Distributors' },
  { href: '/africa', t: 'African Labels & Artist Teams' },
  { href: '/promote/music-promotion-for-record-labels', t: 'Record Labels' },
  { href: '/promote/music-promotion-for-managers', t: 'Managers' },
  { href: '/promote/music-promotion-for-producers', t: 'Producers' },
  { href: '/promote/music-promotion-for-djs', t: 'DJs' },
];

const TAX_COUNTRY = [
  { href: '/ko/us-dj-promotion-for-korean-labels', t: 'Korea' },
  { href: '/es/promocion-dj-estados-unidos', t: 'Latin America & Spain' },
  { href: '/africa/nigeria-us-dj-promotion', t: 'Nigeria' },
  { href: '/africa/south-africa-amapiano-dj-promotion', t: 'South Africa' },
  { href: '/africa/ghana-afrobeats-dj-promotion', t: 'Ghana' },
  { href: '/africa/kenya-east-africa-music-promotion', t: 'Kenya & East Africa' },
  { href: '/mx/promocion-musica-mexicana-eeuu', t: 'Mexico' },
  { href: '/br/promocao-dj-eua', t: 'Brazil' },
  { href: '/co/promocion-musica-urbana-eeuu', t: 'Colombia' },
  { href: '/conosur/promocion-dj-eeuu', t: 'Chile & Argentina' },
  { href: '/uk/us-dj-promotion-for-uk-labels', t: 'United Kingdom' },
  { href: '/fr/promotion-dj-etats-unis', t: 'France & Francophone Africa' },
  { href: '/ca/us-dj-promotion-for-canadian-artists', t: 'Canada' },
  { href: '/jp/us-dj-promotion', t: 'Japan' },
  { href: '/india/us-dj-promotion-for-indian-artists', t: 'India & South Asia' },
  { href: '/id/promosi-musik-dj-amerika', t: 'Indonesia' },
  { href: '/ph/us-dj-promotion-for-filipino-artists', t: 'Philippines' },
];

const TAX_GENRE = [
  { href: '/africa/afrobeats-dj-promotion-usa', t: 'Afrobeats' },
  { href: '/africa/south-africa-amapiano-dj-promotion', t: 'Amapiano & Afro-House' },
  { href: '/ko/us-dj-promotion-for-korean-labels', t: 'K-Pop & K-Hip-Hop' },
  { href: '/es/promocion-dj-estados-unidos', t: 'Reggaet\u00f3n & Latin Urbano' },
  { href: '/promotion/latin-music-promotion', t: 'Latin' },
  { href: '/promotion/hip-hop-promotion', t: 'Hip Hop' },
  { href: '/promotion/rnb-promotion', t: 'R&B' },
  { href: '/promotion/dancehall-promotion', t: 'Dancehall' },
  { href: '/africa/ghana-afrobeats-dj-promotion', t: 'Highlife & Hiplife' },
  { href: '/africa/kenya-east-africa-music-promotion', t: 'Bongo Flava & Gengetone' },
  { href: '/mx/promocion-musica-mexicana-eeuu', t: 'Regional Mexicano & Corridos' },
  { href: '/br/promocao-dj-eua', t: 'Brazilian Funk & Trap' },
  { href: '/uk/us-dj-promotion-for-uk-labels', t: 'UK Rap & Drill' },
  { href: '/india/us-dj-promotion-for-indian-artists', t: 'Punjabi & South Asian' },
];

function taxonomyBlocks(self) {
  const rail = (title, cat, list) =>
    related(title, list.filter((x) => x.href !== self).map((x) => ({ href: x.href, cat, t: x.t })));
  return [
    rail('Campaigns by Music Industry Role', 'Industry', TAX_INDUSTRY),
    rail('Campaigns by Country', 'Country', TAX_COUNTRY),
    rail('Campaigns by Music Category', 'Genre', TAX_GENRE),
  ].join('\n\n');
}

function statsRow(stats) {
  return `<div class="stats-row">
  ${stats.map((s) => `<div class="stat"><div class="stat-n">${esc(s.n)}</div><div class="stat-l">${esc(s.l)}</div></div>`).join('\n  ')}
</div>`;
}

function breadcrumbLd(crumbs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(([name, url], i) => ({
      '@type': 'ListItem', position: i + 1, name, item: `${SITE}${url}`,
    })),
  });
}

function serviceLd(p) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE}/${p.slug}#service`,
    name: p.serviceName,
    serviceType: 'Music promotion and DJ record servicing',
    provider: { '@id': `${SITE}#organization` },
    description: p.description,
    url: `${SITE}/${p.slug}`,
    audience: { '@type': 'Audience', audienceType: p.audience },
    areaServed: { '@type': 'Country', name: 'United States' },
    inLanguage: p.lang,
  });
}

/* -------------------------------------------------------- conversion pages */

/**
 * The hreflang trio and the Africa family, as data. `family` names which
 * switcher a page belongs to; the trio also forms the hreflang cluster with
 * /labels as x-default. Africa pages are distinct offers, not translations,
 * so they get the switcher and no hreflang.
 */

const MARKETS = ['Nigeria', 'Ghana', 'South Africa', 'Kenya / East Africa', 'Tanzania', 'Uganda', 'Francophone Africa', 'Africa diaspora / global'];
const GENRES = ['Afrobeats', 'Amapiano', 'Afro-house', 'Afro-pop', 'Highlife / hiplife', 'Bongo Flava', 'Dancehall', 'Hip-hop / rap', 'Other'];
const TARGETS = ['United States', 'United Kingdom', 'Canada', 'Europe', 'Africa', 'Global diaspora'];
const first = (list, lead) => [lead, ...list.filter((x) => x !== lead)];
const filters = (market, genre) => [
  { name: 'market', label: 'Market', options: first(MARKETS, market) },
  { name: 'genre', label: 'Genre', options: first(GENRES, genre) },
  { name: 'target', label: 'Primary target market', options: TARGETS },
];

const EN_FORM = (title, submit, extras) => ({
  title, submit, extras,
  company: 'Label or company', name: 'Your name', email: 'Work email',
  phone: 'WhatsApp or phone', role: 'Company type',
  roles: ['Label', 'Management', 'Distributor', 'Artist', 'Other'],
  artist: 'Artist and release', link: 'Link to the music',
  timing: 'Start', timings: ['This month', 'Next month', 'Within three months', 'No date yet'],
  intent: 'What you need',
  intents: ['U.S. DJ promotion campaign', 'Label media kit', 'Submit an upcoming release'],
  message: 'Anything else', optional: 'optional',
  note: 'We reply within two business days.',
  sending: 'Sending…', ok: 'Got it. We reply within two business days.',
  fail: 'We could not send that. Try again in a moment.',
  invalid: 'Please fill in the required fields.',
});

const STAT_DJS = { n: '30,000+', l: 'DJs in the Digiwaxx network' };
const STAT_SINCE = { n: '1998', l: 'Serving records to DJs since' };
const STAT_UPLOADS = { n: '~100K', l: 'Tracks uploaded to streaming daily, you need more than an upload' };

const AFRICA_FAMILY = [
  { href: '/africa', label: 'Africa' },
  { href: '/africa/nigeria-us-dj-promotion', label: 'Nigeria' },
  { href: '/africa/south-africa-amapiano-dj-promotion', label: 'South Africa' },
  { href: '/africa/ghana-afrobeats-dj-promotion', label: 'Ghana' },
  { href: '/africa/kenya-east-africa-music-promotion', label: 'East Africa' },
  { href: '/africa/afrobeats-dj-promotion-usa', label: 'Afrobeats USA' },
];

const TRIO_FAMILY = [
  { href: '/ko/us-dj-promotion-for-korean-labels', label: '한국어' },
  { href: '/es/promocion-dj-estados-unidos', label: 'Español' },
  { href: '/labels', label: 'English' },
];

const PAGES = [
  /* ---- /labels : the English international page, x-default of the trio */
  {
    slug: 'labels', file: 'labels.html', lang: 'en', family: 'trio',
    title: 'U.S. DJ Promotion for International Labels | Digiwaxx',
    description: 'Digiwaxx services releases from international labels, management companies and distributors to 30,000+ U.S. DJs, with campaign reporting.',
    serviceName: 'U.S. DJ Promotion for International Labels',
    audience: 'International record labels, management companies and distributors',
    crumb: ['For International Labels', '/labels'],
    h1: 'U.S. DJ Promotion for International Labels &amp; Distributors',
    question: 'How does an international label get releases to American DJs?',
    quick: 'Digiwaxx services international releases to its network of 30,000+ U.S. club, mixshow, radio and mobile DJs, the same record pool that has been breaking records since 1998, with campaign reporting back to your team.',
    long: 'In the American market, a record starts moving in the DJ booth. Club, mixshow and radio DJs are the first people to test new music in front of a real crowd, and for an international release the practical question is simple: how does the record get into their hands, in the formats they actually play? That is DJ servicing, and it is what a record pool is for.',
    sections: [
      { h2: 'What a Label Campaign Includes', html: `<ul>
<li><b>DJ targeting:</b> a list built around the genre, format and market of your release, drawn from a 30,000+ DJ network</li>
<li><b>Digital delivery:</b> high quality audio and artwork, delivered the way U.S. DJs actually take music</li>
<li><b>Mixshow and club servicing:</b> focused on DJs who play records in rooms and on air, not on inflated numbers</li>
<li><b>Campaign reporting:</b> delivery and response, written up per campaign</li>
<li><b>DJ feedback:</b> collected and passed back where available</li>
</ul>` },
      { h2: 'For Labels and Distributors', html: `<p>Campaigns are planned around your release schedule, per single or across a catalogue. K-pop, Latin, Afrobeats, amapiano, hip-hop, R&amp;B, EDM and crossover releases all run through the same network with lists built per record. Write to us in English, Korean or Spanish; we reply within two business days.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version, the key to U.S. mixshow and radio play</li>
<li>DJ edits, extended intros, instrumentals or acapellas where they exist</li>
<li>High resolution artwork, artist bio and press kit (EPK)</li>
<li>Release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request a Label Campaign', 'Request U.S. DJ Promotion',
      [{ name: 'market', label: 'Market', options: ['International / global', 'Korea', 'Mexico', 'Brazil', 'Colombia', 'Chile / Argentina', 'Latin America / Spain', 'United Kingdom', 'France / Francophone', 'Canada', 'Japan', 'India / South Asia', 'Indonesia', 'Philippines', 'Africa', 'Europe', 'Other'] }]),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/answers/how-record-pools-work', cat: 'Straight Answers', t: 'How Record Pools Work' },
        { href: '/guides/how-to-reach-djs', cat: 'Guides', t: 'How to Reach DJs With Your Music' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The label form above is for release schedules and catalogues. A single record goes to the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /ko : the Korean sales page */
  {
    slug: 'ko/us-dj-promotion-for-korean-labels', file: 'ko/us-dj-promotion-for-korean-labels.html',
    lang: 'ko', family: 'trio',
    title: '미국 DJ 프로모션, 한국 레이블을 위한 Digiwaxx',
    description: 'Digiwaxx는 한국 레이블, 매니지먼트사, 유통사를 위해 미국 DJ 프로모션, 디지털 음원 딜리버리, 믹스쇼 서비싱, 캠페인 리포팅을 제공합니다. 1998년부터 3만 명 이상의 DJ에게 음원을 서비스해 온 레코드 풀입니다.',
    serviceName: 'U.S. DJ Promotion for Korean Labels',
    audience: 'Korean record labels, management companies and distributors',
    crumb: ['한국 레이블', '/ko/us-dj-promotion-for-korean-labels'],
    qaLabel: '요약',
    h1: '미국 DJ, 믹스쇼 및 음악 테이스트메이커에게 귀사의 아티스트 음악을 직접 전달하세요',
    question: '한국 레이블은 어떻게 미국 DJ에게 음원을 전달할 수 있나요?',
    quick: 'Digiwaxx는 한국 레이블, 매니지먼트사 및 유통사를 위해 미국 DJ 프로모션, DJ 서비스 및 캠페인 리포팅을 제공합니다. 1998년부터 클럽, 믹스쇼, 라디오, 모바일 DJ 3만 명 이상에게 음원을 서비스해 온 레코드 풀입니다.',
    long: '미국 시장에서 새로운 곡이 처음 검증되는 곳은 DJ 부스입니다. K-pop, K-hip-hop, K-R&amp;B, EDM, 크로스오버 릴리즈가 미국 청취자에게 닿으려면, 곡을 실제로 틀어 줄 사람의 손에 음원이 정확한 형식으로 도착해야 합니다. 그것이 DJ 서비싱이고, 레코드 풀이 하는 일입니다.',
    sections: [
      { h2: '캠페인에 포함되는 것', html: `<ul>
<li><b>DJ 타겟팅:</b> 3만 명 이상의 네트워크에서 장르, 포맷, 지역에 맞는 미국 DJ 리스트를 구성합니다</li>
<li><b>디지털 딜리버리:</b> 고음질 음원과 아트워크를 DJ가 실제로 사용하는 형식으로 전달합니다</li>
<li><b>믹스쇼 및 클럽 중심 서비싱:</b> 부풀려진 숫자가 아니라, 현장과 방송에서 곡을 트는 DJ에 집중합니다</li>
<li><b>캠페인 리포팅:</b> 전달 현황과 반응을 정리한 리포트를 제공합니다</li>
<li><b>DJ 피드백:</b> 수집 가능한 경우 정리해 전달합니다</li>
</ul>` },
      { h2: '레이블 및 유통사를 위해', html: `<p>릴리즈 일정에 맞춰 캠페인을 계획하고, 싱글 단위 또는 카탈로그 단위로 진행할 수 있습니다. 문의는 한국어 또는 영어로 보내 주셔도 됩니다. 2영업일 이내에 회신드립니다.</p>` },
      { h2: '캠페인에 필요한 자료', html: `<ul>
<li>고음질 음원: WAV 또는 320kbps MP3</li>
<li>클린 버전: 미국 믹스쇼와 라디오 플레이의 필수 조건입니다</li>
<li>DJ 에디트, 인스트루멘털, 아카펠라 (있는 경우)</li>
<li>고해상도 아트워크, 아티스트 소개와 보도자료 (EPK)</li>
<li>릴리즈 날짜와 공식 링크</li>
</ul>` },
    ],
    stats: [
      { n: '30,000+', l: '미국 전역의 Digiwaxx DJ 네트워크' },
      { n: '1998', l: 'DJ 음원 서비스를 시작한 해' },
      { n: '~100K', l: '매일 스트리밍에 업로드되는 트랙 수. 업로드만으로는 부족합니다' },
    ],
    form: {
      title: '캠페인 문의', submit: '미국 DJ 프로모션 문의',
      company: '회사명', name: '담당자 성함', email: '이메일',
      phone: 'WhatsApp 또는 전화번호', role: '회사 유형',
      roles: ['레이블', '매니지먼트사', '유통사', '아티스트', '기타'],
      artist: '아티스트 및 릴리즈', link: '음원 링크',
      timing: '시작 시기', timings: ['이번 달', '다음 달', '3개월 이내', '일정 미정'],
      intent: '문의 유형', intents: ['미국 DJ 프로모션 캠페인', '레이블 미디어 킷 요청', '발매 예정 곡 제출'],
      message: '추가 내용', optional: '선택',
      note: '2영업일 이내에 회신드립니다.',
      sending: '전송 중…', ok: '접수되었습니다. 2영업일 이내에 회신드리겠습니다.',
      fail: '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      invalid: '필수 항목을 입력해 주세요.',
      extras: [],
    },
    relatedBlocks: () => [],
    artistCta: { kicker: '아티스트이신가요?', h2: '싱글 한 곡의 표준 캠페인은 $99부터 시작합니다.', sub: '위 양식은 레이블과 유통사를 위한 것입니다. 한 곡의 릴리즈는 표준 제출 절차를 통해 같은 3만 DJ 네트워크에 전달됩니다.', btn: 'Promote My Record' },
  },

  /* ---- /es : the Spanish sales page */
  {
    slug: 'es/promocion-dj-estados-unidos', file: 'es/promocion-dj-estados-unidos.html',
    lang: 'es', family: 'trio',
    title: 'Promoción para DJs en Estados Unidos | Digiwaxx',
    description: 'Digiwaxx ayuda a sellos, managers y artistas latinos a llevar lanzamientos a más de 30,000 DJs y mixshows en Estados Unidos, con entrega y reportes.',
    serviceName: 'Promoción de música para DJs en Estados Unidos',
    audience: 'Sellos discográficos, managers y distribuidoras de música latina',
    crumb: ['Para Sellos Latinos', '/es/promocion-dj-estados-unidos'],
    qaLabel: 'Respuesta rápida',
    h1: 'Promoción de música para DJs profesionales en Estados Unidos',
    question: '¿Cómo llega un lanzamiento latino a los DJs en Estados Unidos?',
    quick: 'Digiwaxx ayuda a sellos, managers y artistas latinos a llevar nuevos lanzamientos a DJs, mixshows y tastemakers en el mercado estadounidense: un record pool con más de 30,000 DJs de club, mixshow, radio y mobile, activo desde 1998.',
    long: 'En el mercado estadounidense, una canción empieza a moverse en la cabina del DJ. Reggaetón, urbano, dembow, regional mexicano, bachata, salsa, afrobeat, pop latino, hip-hop, electrónica: para que el lanzamiento llegue al público, el audio tiene que llegar a las manos de la gente que realmente lo pone, en los formatos que realmente usa. Promoción dirigida a DJs profesionales. Sin bots, sin streams falsos y sin promesas vacías de playlists.',
    sections: [
      { h2: 'Qué incluye la campaña', html: `<ul>
<li><b>Selección de DJs:</b> una lista armada según el género, el formato y el mercado de tu lanzamiento, dentro de una red de más de 30,000 DJs</li>
<li><b>Entrega digital:</b> audio de alta calidad y arte de portada, en los formatos que los DJs realmente usan</li>
<li><b>Servicing para mixshows y clubes:</b> enfocado en los DJs que ponen música en vivo y al aire, no en números inflados</li>
<li><b>Reportes de campaña:</b> estado de entrega y respuesta, por campaña</li>
<li><b>Feedback de DJs:</b> recopilado y entregado cuando está disponible</li>
</ul>` },
      { h2: 'Para sellos y distribuidoras', html: `<p>Planificamos la campaña según tu calendario de lanzamientos, por sencillo o por catálogo. Puedes escribirnos en español o en inglés. Respondemos dentro de dos días hábiles.</p>` },
      { h2: 'Materiales necesarios', html: `<ul>
<li>Audio de alta calidad: WAV o MP3 de 320 kbps</li>
<li>Versión limpia: la llave del mixshow y la radio en Estados Unidos</li>
<li>DJ edits, instrumental o acapella (si existen)</li>
<li>Arte de portada en alta resolución, biografía y press kit (EPK)</li>
<li>Fecha de lanzamiento y enlaces oficiales</li>
</ul>` },
    ],
    stats: [
      { n: '30,000+', l: 'DJs en la red de Digiwaxx en Estados Unidos' },
      { n: '1998', l: 'Sirviendo música a DJs desde' },
      { n: '~100K', l: 'Canciones subidas a streaming cada día. Subir no alcanza' },
    ],
    form: {
      title: 'Solicitar una campaña', submit: 'Solicitar campaña para DJs en EE. UU.',
      company: 'Sello o empresa', name: 'Tu nombre', email: 'Correo electrónico',
      phone: 'WhatsApp o teléfono', role: 'Tipo de empresa',
      roles: ['Sello', 'Management', 'Distribuidora', 'Artista', 'Otro'],
      artist: 'Artista y lanzamiento', link: 'Enlace a la música',
      timing: 'Inicio', timings: ['Este mes', 'El próximo mes', 'Dentro de tres meses', 'Sin fecha definida'],
      intent: 'Qué necesitas', intents: ['Campaña para DJs en EE. UU.', 'Media kit para sellos', 'Enviar un próximo lanzamiento'],
      message: 'Algo más', optional: 'opcional',
      note: 'Respondemos dentro de dos días hábiles.',
      sending: 'Enviando…', ok: 'Recibido. Te respondemos dentro de dos días hábiles.',
      fail: 'No se pudo enviar. Intenta de nuevo en un momento.',
      invalid: 'Completa los campos obligatorios.',
      extras: [],
    },
    relatedBlocks: () => [
      related('Más de Digiwaxx', [
        { href: '/promotion/latin-music-promotion', cat: 'Género', t: 'Latin Music Promotion' },
        { href: '/promotion/latin-promotion-miami', cat: 'Género × Ciudad', t: 'Latin Promotion in Miami' },
      ]),
    ],
    artistCta: { kicker: '¿Eres artista?', h2: 'La campaña estándar empieza en $99.', sub: 'El formulario de arriba es para sellos y distribuidoras. Un sencillo llega a la misma red de más de 30,000 DJs por el proceso estándar.', btn: 'Promote My Record' },
  },

  /* ---- /africa : the hub */
  {
    slug: 'africa', file: 'africa/index.html', lang: 'en', family: 'africa',
    title: 'African Music Promotion to U.S. DJs | Digiwaxx',
    description: 'Digiwaxx services Afrobeats, amapiano and African pop releases to 30,000+ U.S. DJs and diaspora tastemakers, with campaign reporting for African labels.',
    serviceName: 'African Music Promotion to U.S. DJs',
    audience: 'African record labels, artist teams and distributors',
    crumb: ['For African Labels', '/africa'],
    h1: 'Get Your Afrobeats, Amapiano, Afro-House or African Pop Release Directly to U.S. DJs, Mixshows and Diaspora Tastemakers',
    question: 'How does an African release reach American DJs and diaspora rooms?',
    quick: 'Digiwaxx helps African labels, artist teams and distributors service priority releases to professional DJs across the United States, the UK, Canada and key diaspora markets, with campaign reporting and direct release support. Promotion aimed at working DJs. No bots, no fake streams, no empty playlist promises.',
    long: 'African music is not waiting to be discovered. Spotify reports Afrobeats streams from Nigeria have grown more than 5,000% since 2021, and its Africa reporting names amapiano as a force that crosses markets. What decides how far a record travels in the United States is who plays it out loud: the DJs running African nights in New York and New Jersey, DC, Atlanta, Houston, Chicago, Los Angeles, London, Toronto and Paris, and the mixshow and radio DJs who take a record from those rooms to a wider audience. Reaching them is not a playlist pitch. It is servicing, and it is what a record pool does.',
    familyHeading: 'Pick Your Market',
    sections: [
      { h2: 'What Digiwaxx Delivers', html: `<ul>
<li><b>DJ targeting:</b> a list built around your genre, your market and where your diaspora audience actually is, from a 30,000+ DJ network</li>
<li><b>Diaspora city focus:</b> campaigns weighted to the cities where African nights fill rooms</li>
<li><b>Digital delivery:</b> high quality audio and artwork, the way U.S. DJs actually take music</li>
<li><b>Mixshow and club servicing:</b> DJs who play records in rooms and on air, not inflated numbers</li>
<li><b>Campaign reporting:</b> delivery and response, written up per campaign</li>
</ul>` },
      { h2: 'For Labels and Distributors', html: `<p>Campaigns are planned around your release schedule, per single or across a catalogue, and scoped to the market you are actually chasing: the U.S., the UK, Canada, Europe or the global diaspora. Write to us in English or French. We reply within two business days.</p>` },
      { h2: 'What a Campaign Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>Clean and explicit versions where they apply</li>
<li>DJ edits, extended intros, instrumentals or acapellas where they exist</li>
<li>High resolution artwork, artist bio and press kit (EPK)</li>
<li>Release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, { n: '5,022%', l: 'Afrobeats stream growth from Nigeria since 2021, per Spotify' }],
    form: EN_FORM('Request a Campaign', 'Request Afrobeats DJ Promotion', filters('Africa diaspora / global', 'Afrobeats')),
    relatedBlocks: () => [
      related('Afrobeats in the Diaspora Cities', [
        { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
        { href: '/promotion/afrobeats-promotion-new-york', cat: 'Genre × City', t: 'Afrobeats Promotion in New York' },
        { href: '/promotion/afrobeats-promotion-atlanta', cat: 'Genre × City', t: 'Afrobeats Promotion in Atlanta' },
        { href: '/promotion/afrobeats-promotion-houston', cat: 'Genre × City', t: 'Afrobeats Promotion in Houston' },
        { href: '/promotion/afrobeats-promotion-dmv', cat: 'Genre × City', t: 'Afrobeats Promotion in the DMV' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels, teams and catalogues. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /africa/nigeria-us-dj-promotion */
  {
    slug: 'africa/nigeria-us-dj-promotion', file: 'africa/nigeria-us-dj-promotion.html', lang: 'en', family: 'africa',
    title: 'U.S. DJ Promotion for Nigerian Artists & Labels | Digiwaxx',
    description: 'Digiwaxx services Nigerian Afrobeats, Afropop and alté releases to 30,000+ U.S. DJs, mixshows and diaspora rooms, with campaign reporting to Lagos.',
    serviceName: 'U.S. DJ Promotion for Nigerian Artists and Labels',
    audience: 'Nigerian record labels, artist teams and distributors',
    crumb: ['Nigeria', '/africa/nigeria-us-dj-promotion'],
    h1: 'U.S. DJ Promotion for Nigerian Afrobeats Artists &amp; Labels',
    question: 'How does a Nigerian release get into American DJ booths?',
    quick: 'Digiwaxx takes Nigerian releases, Afrobeats, Afropop, Afrofusion, street-pop, alté, Afro-R&B, hip-hop and dancehall, to the American DJs, mixshows and diaspora rooms that break African records, with direct delivery and campaign reporting for Lagos based labels and artist teams.',
    long: "The demand signal is not in dispute. Spotify reports Afrobeats streams from Nigeria have grown 5,022% since 2021, Nigerian artists earned over $40 million on the platform in 2025 across 30.3 billion streams, and more than 80% of Nigeria's Daily Top 50 is Nigerian. What the numbers do not do is put your record in an American DJ booth. Between a release in Lagos, Abuja, Port Harcourt or Ibadan and a floor in New York, Houston, Atlanta or DC sits a practical step: the DJs who run those rooms need the record, serviced properly, with a clean version and a contact who answers.",
    sections: [
      { h2: 'What a Nigeria Campaign Includes', html: `<ul>
<li><b>Afrobeats DJ list:</b> U.S. DJs who actually play Afrobeats, street-pop and alté: African night residents, mixshow DJs and diaspora selectors, drawn from a 30,000+ DJ network</li>
<li><b>Diaspora market weighting:</b> New York and New Jersey, Houston, Atlanta, DC and Chicago first; London and Toronto on request</li>
<li><b>Direct delivery:</b> WAV or 320kbps MP3 with artwork, the way U.S. DJs take music</li>
<li><b>Mixshow and radio servicing:</b> clean versions to the DJs who bridge the club and the air</li>
<li><b>Campaign report:</b> who was serviced, what was delivered, what came back. Written for a label meeting in Lagos, not for a screenshot</li>
</ul>` },
      { h2: 'For Lagos Based Labels and Teams', html: `<p>Release schedules move fast in Lagos and a U.S. campaign has to keep up: we plan around your date, not ours, and a single can be in U.S. DJ hands inside the release window. Distributors and management companies can run campaigns across a roster; tell us the slate and we will scope it.</p>` },
      { h2: 'What Your Release Needs for the U.S.', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version: without it, mixshow and radio doors stay shut</li>
<li>DJ edits or extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, { n: '30.3B', l: 'Streams for Nigerian artists on Spotify in 2025, per Spotify' }],
    form: EN_FORM('Request a Nigeria Campaign', 'Request Afrobeats DJ Promotion', filters('Nigeria', 'Afrobeats')),
    relatedBlocks: () => [
      related('Where Your Diaspora Dances', [
        { href: '/promotion/afrobeats-promotion-new-york', cat: 'Genre × City', t: 'Afrobeats Promotion in New York' },
        { href: '/promotion/afrobeats-promotion-houston', cat: 'Genre × City', t: 'Afrobeats Promotion in Houston' },
        { href: '/promotion/afrobeats-promotion-atlanta', cat: 'Genre × City', t: 'Afrobeats Promotion in Atlanta' },
        { href: '/guides/how-nigerian-artists-promote-afrobeats-to-us-djs', cat: 'Guide', t: 'How Nigerian Artists Reach U.S. DJs' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /africa/south-africa-amapiano-dj-promotion */
  {
    slug: 'africa/south-africa-amapiano-dj-promotion', file: 'africa/south-africa-amapiano-dj-promotion.html', lang: 'en', family: 'africa',
    title: 'Amapiano & Afro-House Promotion to U.S. DJs | Digiwaxx',
    description: 'Digiwaxx services amapiano, Afro-house and SA dance releases to U.S. club, mixshow and house circuit DJs, extended mixes first, with reporting.',
    serviceName: 'Amapiano and Afro-House Promotion to U.S. DJs',
    audience: 'South African record labels, producers and distributors',
    crumb: ['South Africa', '/africa/south-africa-amapiano-dj-promotion'],
    h1: 'Amapiano &amp; Afro-House Promotion for U.S. DJs, Clubs and Mixshows',
    question: 'How does a South African dance record reach American floors?',
    quick: 'Digiwaxx services South African dance releases, amapiano, Afro-house, gqom, SA hip-hop, Afro-tech, to the American DJs who play them: club residencies, mixshows and the house circuit, with the extended mix treated as the primary asset and campaign reporting back to your label or distributor.',
    long: "Amapiano was built in the DJ booth: long-form mixes, log drum drops, records that reveal themselves over six minutes on a floor. A format born that way does not break abroad through thirty-second clips. It breaks when DJs in Johannesburg, Pretoria, Cape Town and Durban are matched by DJs in New York, London and Toronto with the same records in their hands. Spotify's Africa reporting singles out amapiano as a sound that crosses markets, and the market that crosses first is the DJ booth.",
    sections: [
      { h2: 'What SA Dance Servicing Includes', html: `<ul>
<li><b>Dance-weighted DJ list:</b> amapiano and Afro-house selectors, African night residents and U.S. house circuit DJs open to the crossover</li>
<li><b>Extended mixes first:</b> the six minute version is the record for this format. We deliver it that way, with radio edits alongside</li>
<li><b>Club and mixshow focus:</b> the rooms and shows where a groove gets its first American mile</li>
<li><b>Diaspora and dance-city targeting:</b> New York, DC, Atlanta, Houston and Chicago for the diaspora; the house lineage cities for the crossover</li>
<li><b>Campaign report:</b> delivery and response per record, written for your release meeting</li>
</ul>` },
      { h2: 'For SA Labels, Producers and Distributors', html: `<p>Singles, EPs or a producer catalogue: amapiano moves in packs and a campaign can carry more than one record when the sound hangs together. Gqom, Afro-tech and SA hip-hop are welcome on the same funnel; say what it is and we will build the list to match.</p>` },
      { h2: 'What a Dance Campaign Needs', html: `<ul>
<li>Extended mix in high quality: WAV or 320kbps MP3</li>
<li>Radio edit and clean version where vocals need one</li>
<li>Instrumental or DJ tool versions where they exist</li>
<li>High resolution artwork, artist or producer bio and press kit (EPK)</li>
<li>Release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request SA Dance Servicing', 'Request Amapiano DJ Servicing', filters('South Africa', 'Amapiano')),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
        { href: '/goals/get-club-plays', cat: 'Artist Goals', t: 'How to Get Club Plays' },
        { href: '/guides/amapiano-promotion-in-the-us', cat: 'Guide', t: 'Amapiano Promotion in the U.S.' },
      ]),
    ],
    artistCta: { kicker: 'One producer, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels, producers with catalogues and distributors. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /africa/ghana-afrobeats-dj-promotion */
  {
    slug: 'africa/ghana-afrobeats-dj-promotion', file: 'africa/ghana-afrobeats-dj-promotion.html', lang: 'en', family: 'africa',
    title: 'Ghana Music Promotion to U.S. DJs | Digiwaxx',
    description: 'Digiwaxx services Ghanaian Afrobeats, highlife and Afro-fusion releases from Accra to U.S. DJs, mixshows and diaspora rooms, with campaign reporting.',
    serviceName: 'U.S. DJ Promotion for Ghanaian Releases',
    audience: 'Ghanaian record labels, artist teams and distributors',
    crumb: ['Ghana', '/africa/ghana-afrobeats-dj-promotion'],
    h1: 'U.S. DJ Promotion for Ghanaian Afrobeats, Highlife &amp; Afro-Fusion Releases',
    question: 'How does a Ghanaian release reach the U.S. diaspora rooms?',
    quick: 'Digiwaxx takes Ghanaian releases, Afrobeats, highlife, hiplife, Afro-fusion, Afro-R&B, hip-hop and dancehall, to U.S. DJs, mixshows and the diaspora rooms where Ghanaian music already fills floors, with direct delivery and campaign reporting for Accra based labels and artist teams.',
    long: 'Every December proves the audience exists: the diaspora flies home, Accra fills up, and the records of that season come back to New York, DC, London and Toronto in suitcases and DJ folders. A Ghanaian release does not need to invent an American audience. It needs to reach the DJs who already play to it the other eleven months. Ghana also exports more than the new school: highlife and hiplife catalogues carry decades of records that U.S. DJs sample, edit and open sets with.',
    sections: [
      { h2: 'What a Ghana Campaign Includes', html: `<ul>
<li><b>Ghanaian diaspora rooms:</b> the DJs holding down Ghanaian and West African nights in New York, New Jersey, DC and beyond</li>
<li><b>Afrobeats and mixshow DJs:</b> the broader list for records built to cross over past the community, from a 30,000+ DJ network</li>
<li><b>Catalogue servicing:</b> highlife and hiplife records placed with the selectors, editors and diggers who actually use them</li>
<li><b>Direct delivery:</b> high quality audio and artwork, the way U.S. DJs take music</li>
<li><b>Campaign report:</b> delivery and response, written up per campaign for your team</li>
</ul>` },
      { h2: 'For Accra Based Labels and Teams', html: `<p>Planning around December? Say so early. The diaspora season is the best launch window Ghanaian music has, and servicing that lands in November beats servicing that lands in January. Catalogue owners: a properly tagged highlife archive is a campaign of its own. Tell us what you hold.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version for mixshow and radio DJs</li>
<li>DJ edits or extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request a Ghana Campaign', 'Request a Ghana Campaign', filters('Ghana', 'Afrobeats')),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/promotion/afrobeats-promotion-new-york', cat: 'Genre × City', t: 'Afrobeats Promotion in New York' },
        { href: '/promotion/afrobeats-promotion-dmv', cat: 'Genre × City', t: 'Afrobeats Promotion in the DMV' },
        { href: '/guides/how-to-release-african-music-to-us-djs', cat: 'Guide', t: 'Releasing African Music to U.S. DJs' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /africa/kenya-east-africa-music-promotion */
  {
    slug: 'africa/kenya-east-africa-music-promotion', file: 'africa/kenya-east-africa-music-promotion.html', lang: 'en', family: 'africa',
    title: 'East African Music Promotion to U.S. DJs | Digiwaxx',
    description: 'Digiwaxx services Kenyan, Tanzanian and Ugandan releases to U.S. DJs and mixshows as one East African campaign, with reporting to your team.',
    serviceName: 'East African Music Promotion to U.S. DJs',
    audience: 'Kenyan and East African record labels and artist teams',
    crumb: ['East Africa', '/africa/kenya-east-africa-music-promotion'],
    h1: 'East African Music Promotion to U.S. DJs and Mixshows',
    question: 'How do East African releases reach American DJs?',
    quick: 'Digiwaxx services East African releases to U.S. DJs: Kenyan Afro-pop and gengetone, Tanzanian Bongo Flava and Ugandan records, delivered to the American and diaspora DJs who play the region, with campaign reporting back to Nairobi, Dar es Salaam or Kampala.',
    long: "Spotify's Africa reporting names Kenya alongside Nigeria and South Africa as a market where local street sounds lead streaming, and Nairobi's scene runs its own direction: gengetone, drill, Afro-pop and a dance floor that absorbed amapiano on its own terms. Servicing an East African record inside a generic Afrobeats blast buries exactly what makes it work. The East African diaspora has its own rooms too, and the DJs holding those nights are reachable; they are just not on anyone's generic list.",
    sections: [
      { h2: 'What an East Africa Campaign Includes', html: `<ul>
<li><b>A regional DJ list:</b> U.S. and diaspora DJs who play East African records, built per release from a 30,000+ DJ network</li>
<li><b>Bongo Flava and gengetone context:</b> the pitch names what the record is. A DJ who knows the lane plays it; one who is guessing does not</li>
<li><b>Mixshow and club servicing:</b> clean versions to mixshow DJs, full records to the club and party DJs</li>
<li><b>Direct delivery:</b> high quality audio and artwork, the way U.S. DJs take music</li>
<li><b>Campaign report:</b> delivery and response per record, written for your team</li>
</ul>` },
      { h2: 'For Nairobi, Dar es Salaam and Kampala', html: `<p>One record or a regional slate: campaigns can cover Kenya, Tanzania and Uganda together when the release schedule does. Amapiano records from East African producers are welcome here or on the South Africa funnel, whichever market you are actually chasing. Until Tanzania and Uganda earn standalone pages, their campaigns run through this one, scoped per market on the form below.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version for mixshow and radio DJs</li>
<li>DJ edits or extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request an East Africa Campaign', 'Request an East Africa Campaign', filters('Kenya / East Africa', 'Afro-pop')),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/promotion/dancehall-promotion', cat: 'Genre', t: 'Dancehall Promotion' },
        { href: '/promotion/hip-hop-promotion', cat: 'Genre', t: 'Hip Hop Promotion' },
        { href: '/guides/how-to-release-african-music-to-us-djs', cat: 'Guide', t: 'Releasing African Music to U.S. DJs' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /africa/afrobeats-dj-promotion-usa : the broad pillar */
  {
    slug: 'africa/afrobeats-dj-promotion-usa', file: 'africa/afrobeats-dj-promotion-usa.html', lang: 'en', family: 'africa',
    title: 'Afrobeats DJ Promotion USA | Digiwaxx',
    description: 'Afrobeats DJ promotion in the USA: Digiwaxx services releases to 30,000+ American DJs, mixshows, clubs and diaspora radio, with campaign reporting.',
    serviceName: 'Afrobeats DJ Promotion in the USA',
    audience: 'Afrobeats labels, artist teams and distributors worldwide',
    crumb: ['Afrobeats USA', '/africa/afrobeats-dj-promotion-usa'],
    h1: 'Afrobeats DJ Promotion in the USA: Mixshows, Clubs and Diaspora Radio',
    question: 'How does an Afrobeats record actually break in America?',
    quick: 'An Afrobeats record does not arrive in the U.S. through an algorithm. It arrives through a DJ at an African night in Houston or Atlanta, a mixshow in New York, a hall party in New Jersey. Digiwaxx services your release to the American DJs who run those rooms, from a network of 30,000+ working DJs, with campaign reporting back to your team.',
    long: 'Afrobeats promotion in the USA is a servicing problem before it is a marketing problem. The DJs who run the diaspora party circuit, African student association bookings, dedicated Afrobeats club nights and open-format rooms need the record in their library, in the format they play from, before the release week conversation means anything to them. That is what a record pool is for, and it is the channel Afrobeats specialists already use to find records.',
    sections: [
      { h2: 'What the Campaign Covers', html: `<ul>
<li><b>Mixshow and radio DJs:</b> the DJs taking African records from the club to the air in U.S. markets</li>
<li><b>Club and party DJs:</b> the residents of African and Caribbean nights in New York, DC, Atlanta, Houston, Chicago and Los Angeles</li>
<li><b>Diaspora tastemakers:</b> the hosts and selectors whose rooms decide what the community plays next</li>
<li><b>Delivery and follow-up:</b> secure digital delivery, then the follow-up that turns a file received into a record played</li>
<li><b>Reporting:</b> delivery and response, written up per campaign so your team sees what moved</li>
</ul>` },
      { h2: 'For Labels and Artist Teams', html: `<p>One single or a release schedule. If you are planning a U.S. push around a tour, a December homecoming or a feature, tell us the dates and we plan the servicing around them. Not sure whether your record fits? Send it. Listening costs nothing and we would rather tell you the truth than run a campaign that will not land.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version: U.S. mixshow and radio play depends on it</li>
<li>DJ edits and extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Get Your Release to U.S. DJs', 'Get Your Release to U.S. DJs', filters('Africa diaspora / global', 'Afrobeats')),
    relatedBlocks: () => [
      related('Afrobeats by City', [
        { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
        { href: '/promotion/afrobeats-promotion-new-york', cat: 'Genre × City', t: 'Afrobeats Promotion in New York' },
        { href: '/promotion/afrobeats-promotion-atlanta', cat: 'Genre × City', t: 'Afrobeats Promotion in Atlanta' },
        { href: '/promotion/afrobeats-promotion-houston', cat: 'Genre × City', t: 'Afrobeats Promotion in Houston' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ================================================================ world
   * The viral-market pages: the cities whose communities consume music at
   * scale on Spotify and YouTube, ranked by budget and each addressed in
   * its own language. Standalone offers, no hreflang cluster and no pill
   * row; the Campaigns by Country rail is their shared navigation. Market
   * statistics print only with their source named (IFPI 2025 rankings,
   * Spotify's Africa reporting); everything else is the site's own claims.
   */

  /* ---- /mx : regional mexicano and corridos to the U.S. */
  {
    slug: 'mx/promocion-musica-mexicana-eeuu', file: 'mx/promocion-musica-mexicana-eeuu.html', lang: 'es',
    title: 'Promoción de Música Mexicana en EE. UU. | Digiwaxx',
    description: 'Digiwaxx lleva regional mexicano, corridos y música mexicana a más de 30,000 DJs en Estados Unidos: bailes, clubes y mixshows, con reportes de campaña.',
    serviceName: 'Promoción de música mexicana en Estados Unidos',
    audience: 'Sellos, managers y artistas de música mexicana',
    crumb: ['México', '/mx/promocion-musica-mexicana-eeuu'],
    qaLabel: 'Respuesta rápida',
    h1: 'Promoción de música mexicana con DJs en Estados Unidos',
    question: '¿Cómo llega la música mexicana a los DJs en Estados Unidos?',
    quick: 'El público mexicano en Estados Unidos llena bailes, jaripeos y clubes cada fin de semana, y los DJs de esos eventos deciden qué suena. Digiwaxx entrega tu lanzamiento a su red de más de 30,000 DJs, con los especialistas en regional y música latina de cada mercado, y te reporta los resultados.',
    long: 'El regional mexicano y los corridos ya son de los sonidos más grandes de Estados Unidos, no solo del público latino. La audiencia vive en Los Ángeles, Houston, Dallas, Chicago y Phoenix, gira en dólares y consume a escala en Spotify y YouTube. Lo que decide cuál canción se vuelve la del momento sigue siendo el DJ del baile.',
    sections: [
      { h2: 'Qué incluye la campaña', html: `<ul>
<li><b>Lista de DJs regional y latina:</b> los DJs que tocan en bailes, clubes y fiestas mexicanas en EE. UU., dentro de una red de más de 30,000</li>
<li><b>Entrega digital:</b> WAV o MP3 de 320 kbps con arte de portada, en los formatos que los DJs realmente usan</li>
<li><b>Bailes, clubes y mixshows:</b> los eventos donde el público mexicano realmente escucha música nueva</li>
<li><b>Reporte de campaña:</b> entrega y respuesta, por lanzamiento</li>
<li><b>Feedback de DJs:</b> recopilado y entregado cuando está disponible</li>
</ul>` },
      { h2: 'Para sellos y managers', html: `<p>Planificamos según tu calendario, por sencillo o por catálogo: corridos tumbados, banda, norteño, sierreño, cumbia y el urbano mexa corren por el mismo embudo con listas armadas por disco. Puedes escribirnos en español o en inglés. Respondemos dentro de dos días hábiles.</p>` },
      { h2: 'Materiales necesarios', html: `<ul>
<li>Audio de alta calidad: WAV o MP3 de 320 kbps</li>
<li>Versión limpia para mixshow y radio</li>
<li>DJ edits o intros extendidos (si existen)</li>
<li>Arte en alta resolución, biografía y press kit (EPK)</li>
<li>Fecha de lanzamiento y enlaces oficiales</li>
</ul>` },
    ],
    stats: [
      { n: '30,000+', l: 'DJs en la red Digiwaxx en EE. UU.' },
      { n: '1998', l: 'Sirviendo música a DJs desde' },
      { n: '#10', l: 'México en el ranking mundial de mercados musicales (IFPI 2025)' },
    ],
    form: {
      title: 'Solicitar una campaña', submit: 'Solicitar campaña en EE. UU.',
      company: 'Sello o empresa', name: 'Tu nombre', email: 'Correo electrónico',
      phone: 'WhatsApp o teléfono', role: 'Tipo de empresa',
      roles: ['Sello', 'Management', 'Distribuidora', 'Artista', 'Otro'],
      artist: 'Artista y lanzamiento', link: 'Enlace a la música',
      timing: 'Inicio', timings: ['Este mes', 'El próximo mes', 'Dentro de tres meses', 'Sin fecha definida'],
      intent: 'Qué necesitas', intents: ['Campaña para DJs en EE. UU.', 'Media kit para sellos', 'Enviar un próximo lanzamiento'],
      extras: [
        { name: 'market', label: 'Mercado', options: ['México', 'EE. UU. latino', 'Latinoamérica', 'Global'] },
        { name: 'genre', label: 'Género', options: ['Regional mexicano', 'Corridos tumbados', 'Banda', 'Norteño / sierreño', 'Reggaetón / urbano', 'Pop', 'Hip-hop', 'Otro'] },
        { name: 'target', label: 'Mercado principal', options: ['Estados Unidos', 'México', 'Global'] },
      ],
      message: 'Algo más', optional: 'opcional',
      note: 'Respondemos dentro de dos días hábiles.',
      sending: 'Enviando…', ok: 'Recibido. Te respondemos dentro de dos días hábiles.',
      fail: 'No se pudo enviar. Intenta de nuevo en un momento.',
      invalid: 'Completa los campos obligatorios.',
    },
    relatedBlocks: () => [
      related('Más de Digiwaxx', [
        { href: '/promotion/latin-promotion-houston', cat: 'Género × Ciudad', t: 'Latin Promotion in Houston' },
        { href: '/promotion/latin-music-promotion', cat: 'Género', t: 'Latin Music Promotion' },
        { href: '/es/promocion-dj-estados-unidos', cat: 'Latinoamérica', t: 'Promoción para DJs en EE. UU.' },
      ]),
    ],
    artistCta: { kicker: '¿Artista independiente?', h2: 'La campaña estándar empieza en $99.', sub: 'El formulario de arriba es para sellos y managers. Un sencillo llega a la misma red de más de 30,000 DJs por el proceso estándar.', btn: 'Promote My Record' },
  },

  /* ---- /br : Brazil, in Portuguese. The biggest unserved market on the list. */
  {
    slug: 'br/promocao-dj-eua', file: 'br/promocao-dj-eua.html', lang: 'pt-BR',
    title: 'Promoção de Música para DJs nos EUA | Digiwaxx',
    description: 'A Digiwaxx entrega lançamentos brasileiros a mais de 30.000 DJs nos Estados Unidos: funk, trap, sertanejo e pagode, com entrega digital e relatório de campanha.',
    serviceName: 'Promoção de música brasileira para DJs nos EUA',
    audience: 'Selos, equipes de artistas e distribuidoras do Brasil',
    crumb: ['Brasil', '/br/promocao-dj-eua'],
    qaLabel: 'Resposta rápida',
    h1: 'Leve sua música aos DJs profissionais dos Estados Unidos',
    question: 'Como um lançamento brasileiro chega aos DJs americanos?',
    quick: 'O Brasil é o 8º maior mercado de música do mundo e o funk já é som global. A Digiwaxx entrega seu lançamento à rede de mais de 30.000 DJs nos EUA, das noites brasileiras e latinas aos mixshows, com relatório de volta para sua equipe. Um record pool servindo DJs desde 1998.',
    long: 'Entre um hit em São Paulo e uma pista nos Estados Unidos existe um passo prático: o DJ precisa do arquivo certo. A diáspora brasileira lota festas em Boston, Newark, Orlando e Miami todo fim de semana, e o funk, o trap BR e o sertanejo entram no set de quem recebe o material do jeito certo: WAV, versão limpa, edit com intro.',
    sections: [
      { h2: 'O que a campanha inclui', html: `<ul>
<li><b>Lista de DJs certa:</b> as noites brasileiras e latinas nos EUA, mais os DJs de mixshow abertos ao crossover, dentro de uma rede de mais de 30.000</li>
<li><b>Entrega digital:</b> WAV ou MP3 320 kbps com capa, nos formatos que os DJs americanos realmente usam</li>
<li><b>Foco em pista e rádio:</b> DJs que tocam em festas e no ar, não números inflados</li>
<li><b>Relatório de campanha:</b> entrega e resposta, por lançamento</li>
<li><b>Feedback de DJs:</b> coletado e repassado quando disponível</li>
</ul>` },
      { h2: 'Para selos e distribuidoras', html: `<p>Planejamos pela sua agenda de lançamentos, por single ou por catálogo: funk, trap, sertanejo, pagode e eletrônica correm pelo mesmo funil com listas montadas por faixa. Pode escrever em português ou inglês. Respondemos em até dois dias úteis.</p>` },
      { h2: 'O que seu lançamento precisa', html: `<ul>
<li>Áudio em alta qualidade: WAV ou MP3 320 kbps</li>
<li>Versão limpa: a porta do mixshow e da rádio americana</li>
<li>DJ edits ou intro estendida (se existirem)</li>
<li>Capa em alta resolução, bio do artista e press kit (EPK)</li>
<li>Data de lançamento e links oficiais</li>
</ul>` },
    ],
    stats: [
      { n: '30.000+', l: 'DJs na rede Digiwaxx nos EUA' },
      { n: '1998', l: 'Servindo música a DJs desde' },
      { n: '8º', l: 'Lugar do Brasil entre os mercados mundiais de música (IFPI 2025)' },
    ],
    form: {
      title: 'Solicitar uma campanha', submit: 'Solicitar campanha nos EUA',
      company: 'Selo ou empresa', name: 'Seu nome', email: 'E-mail de trabalho',
      phone: 'WhatsApp ou telefone', role: 'Tipo de empresa',
      roles: ['Selo', 'Management', 'Distribuidora', 'Artista', 'Outro'],
      artist: 'Artista e lançamento', link: 'Link da música',
      timing: 'Início', timings: ['Este mês', 'Mês que vem', 'Em até três meses', 'Sem data'],
      intent: 'O que você precisa', intents: ['Campanha de DJs nos EUA', 'Media kit para selos', 'Enviar um lançamento'],
      extras: [
        { name: 'market', label: 'Mercado', options: ['Brasil', 'Diáspora brasileira nos EUA', 'Global'] },
        { name: 'genre', label: 'Gênero', options: ['Funk', 'Trap / hip-hop', 'Sertanejo', 'Pagode / samba', 'Eletrônica', 'Pop', 'Outro'] },
        { name: 'target', label: 'Mercado principal', options: ['Estados Unidos', 'Europa', 'Global'] },
      ],
      message: 'Algo mais', optional: 'opcional',
      note: 'Respondemos em até dois dias úteis.',
      sending: 'Enviando…', ok: 'Recebido. Respondemos em até dois dias úteis.',
      fail: 'Não foi possível enviar. Tente de novo em instantes.',
      invalid: 'Preencha os campos obrigatórios.',
    },
    relatedBlocks: () => [
      related('Mais da Digiwaxx', [
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
        { href: '/promotion/latin-promotion-miami', cat: 'Cidade', t: 'Latin Promotion in Miami' },
      ]),
    ],
    artistCta: { kicker: 'Artista com uma faixa?', h2: 'A campanha padrão começa em US$ 99.', sub: 'O formulário acima é para selos e equipes. Uma faixa chega à mesma rede de mais de 30.000 DJs pelo processo padrão.', btn: 'Promote My Record' },
  },

  /* ---- /co : Colombia, the urbano hit factory. */
  {
    slug: 'co/promocion-musica-urbana-eeuu', file: 'co/promocion-musica-urbana-eeuu.html', lang: 'es',
    title: 'Promoción de Música Urbana en EE. UU. | Digiwaxx',
    description: 'Digiwaxx lleva el urbano colombiano a más de 30,000 DJs en Estados Unidos: clubes latinos, mixshows y radio, con entrega digital y reportes de campaña.',
    serviceName: 'Promoción de música urbana colombiana en Estados Unidos',
    audience: 'Sellos, managers y artistas urbanos de Colombia',
    crumb: ['Colombia', '/co/promocion-musica-urbana-eeuu'],
    qaLabel: 'Respuesta rápida',
    h1: 'Del estudio en Medellín a los DJs de Estados Unidos',
    question: '¿Cómo llega el urbano colombiano a los DJs en Estados Unidos?',
    quick: 'Colombia exporta el sonido urbano del mundo, y el siguiente paso después del estudio sigue siendo la pista. Digiwaxx entrega tu lanzamiento a más de 30,000 DJs en EE. UU., con los DJs latinos y urbanos de Nueva York, Miami, Houston y Chicago al frente, y te reporta qué pasó.',
    long: 'Medellín y Bogotá producen éxitos globales en serie, y América Latina fue la región musical que más creció en 2025 según IFPI. Pero un lanzamiento no se vuelve himno de club en Estados Unidos por streaming: se vuelve himno cuando los DJs de los clubes latinos lo tienen, en el formato correcto, con la versión limpia para el mixshow.',
    sections: [
      { h2: 'Qué incluye la campaña', html: `<ul>
<li><b>Lista de DJs urbana y latina:</b> los residentes de clubes latinos y los DJs de mixshow que llevan un tema del club a la radio</li>
<li><b>Entrega digital:</b> WAV o MP3 de 320 kbps con arte, como los DJs americanos reciben música</li>
<li><b>Club primero:</b> la pista es donde un tema urbano demuestra que funciona</li>
<li><b>Reporte de campaña:</b> entrega y respuesta, por lanzamiento, para tu reunión de sello</li>
<li><b>Feedback de DJs:</b> recopilado cuando está disponible</li>
</ul>` },
      { h2: 'Para sellos y managers', html: `<p>Por sencillo o por catálogo, con el calendario de lanzamientos que ya tienes. Reggaetón, trap, dancehall en español y afrobeat latino corren por el mismo embudo con listas armadas por disco. Escríbenos en español o inglés; respondemos dentro de dos días hábiles.</p>` },
      { h2: 'Materiales necesarios', html: `<ul>
<li>Audio de alta calidad: WAV o MP3 de 320 kbps</li>
<li>Versión limpia para mixshow y radio</li>
<li>DJ edits, instrumental o acapella (si existen)</li>
<li>Arte en alta resolución, biografía y press kit (EPK)</li>
<li>Fecha de lanzamiento y enlaces oficiales</li>
</ul>` },
    ],
    stats: [
      { n: '30,000+', l: 'DJs en la red Digiwaxx en EE. UU.' },
      { n: '1998', l: 'Sirviendo música a DJs desde' },
      { n: '17.1%', l: 'Crecimiento de la música grabada en América Latina en 2025 (IFPI)' },
    ],
    form: {
      title: 'Solicitar una campaña', submit: 'Solicitar campaña en EE. UU.',
      company: 'Sello o empresa', name: 'Tu nombre', email: 'Correo electrónico',
      phone: 'WhatsApp o teléfono', role: 'Tipo de empresa',
      roles: ['Sello', 'Management', 'Distribuidora', 'Artista', 'Otro'],
      artist: 'Artista y lanzamiento', link: 'Enlace a la música',
      timing: 'Inicio', timings: ['Este mes', 'El próximo mes', 'Dentro de tres meses', 'Sin fecha definida'],
      intent: 'Qué necesitas', intents: ['Campaña para DJs en EE. UU.', 'Media kit para sellos', 'Enviar un próximo lanzamiento'],
      extras: [
        { name: 'market', label: 'Mercado', options: ['Colombia', 'EE. UU. latino', 'Latinoamérica', 'Global'] },
        { name: 'genre', label: 'Género', options: ['Reggaetón', 'Urbano / trap', 'Dancehall', 'Afrobeat latino', 'Salsa', 'Pop', 'Otro'] },
        { name: 'target', label: 'Mercado principal', options: ['Estados Unidos', 'Latinoamérica', 'Global'] },
      ],
      message: 'Algo más', optional: 'opcional',
      note: 'Respondemos dentro de dos días hábiles.',
      sending: 'Enviando…', ok: 'Recibido. Te respondemos dentro de dos días hábiles.',
      fail: 'No se pudo enviar. Intenta de nuevo en un momento.',
      invalid: 'Completa los campos obligatorios.',
    },
    relatedBlocks: () => [
      related('Más de Digiwaxx', [
        { href: '/promotion/latin-music-promotion', cat: 'Género', t: 'Latin Music Promotion' },
        { href: '/es/promocion-dj-estados-unidos', cat: 'Latinoamérica', t: 'Promoción para DJs en EE. UU.' },
      ]),
    ],
    artistCta: { kicker: '¿Artista independiente?', h2: 'La campaña estándar empieza en $99.', sub: 'El formulario de arriba es para sellos y managers. Un sencillo llega a la misma red de más de 30,000 DJs por el proceso estándar.', btn: 'Promote My Record' },
  },

  /* ---- /conosur : Chile and Argentina, the per-capita viral champions. */
  {
    slug: 'conosur/promocion-dj-eeuu', file: 'conosur/promocion-dj-eeuu.html', lang: 'es',
    title: 'Promoción para DJs en EE. UU.: Chile y Argentina | Digiwaxx',
    description: 'Digiwaxx lleva el trap y el urbano de Chile y Argentina a más de 30,000 DJs en Estados Unidos, con entrega digital y reporte de campaña por lanzamiento.',
    serviceName: 'Promoción de música del Cono Sur en Estados Unidos',
    audience: 'Sellos, managers y artistas de Chile y Argentina',
    crumb: ['Chile y Argentina', '/conosur/promocion-dj-eeuu'],
    qaLabel: 'Respuesta rápida',
    h1: 'Trap y urbano del Cono Sur hacia los DJs de Estados Unidos',
    question: '¿Cómo llega la música de Chile y Argentina a los DJs americanos?',
    quick: 'Santiago y Buenos Aires marcan tendencia viral en toda la región, y el paso que convierte esa fuerza en presencia real en Estados Unidos es el DJ booth. Digiwaxx entrega tu lanzamiento a más de 30,000 DJs en EE. UU., con reporte de vuelta para tu equipo. Un record pool sirviendo DJs desde 1998.',
    long: 'El trap argentino y el urbano chileno ya demostraron que no necesitan permiso de nadie: se escuchan a escala en Spotify y YouTube en todo el continente. Lo que falta entre esa escala y una pista en Nueva York o Miami es logística: el archivo correcto, la versión limpia, y el DJ latino que lo reciba de alguien que responde.',
    sections: [
      { h2: 'Qué incluye la campaña', html: `<ul>
<li><b>Lista de DJs latina y urbana:</b> los clubes latinos y mixshows de Nueva York, Miami, Houston y Chicago, dentro de una red de más de 30,000</li>
<li><b>Entrega digital:</b> WAV o MP3 de 320 kbps con arte, en los formatos correctos</li>
<li><b>Seguimiento:</b> el segundo contacto que convierte un archivo entregado en un tema sonando</li>
<li><b>Reporte de campaña:</b> entrega y respuesta, por lanzamiento</li>
</ul>` },
      { h2: 'Para sellos, managers y artistas', html: `<p>Escena que crece rápido con presupuesto medido: por eso existen dos puertas. El formulario de abajo escala campañas de sello por sencillo o catálogo, y la campaña estándar de $99 pone un solo tema en la misma red sin más vueltas. Escríbenos en español o inglés; respondemos dentro de dos días hábiles.</p>` },
      { h2: 'Materiales necesarios', html: `<ul>
<li>Audio de alta calidad: WAV o MP3 de 320 kbps</li>
<li>Versión limpia para mixshow y radio</li>
<li>DJ edits, instrumental o acapella (si existen)</li>
<li>Arte en alta resolución, biografía y press kit (EPK)</li>
<li>Fecha de lanzamiento y enlaces oficiales</li>
</ul>` },
    ],
    stats: [
      { n: '30,000+', l: 'DJs en la red Digiwaxx en EE. UU.' },
      { n: '1998', l: 'Sirviendo música a DJs desde' },
      { n: '17.1%', l: 'Crecimiento de la música grabada en América Latina en 2025 (IFPI)' },
    ],
    form: {
      title: 'Solicitar una campaña', submit: 'Solicitar campaña en EE. UU.',
      company: 'Sello o empresa', name: 'Tu nombre', email: 'Correo electrónico',
      phone: 'WhatsApp o teléfono', role: 'Tipo de empresa',
      roles: ['Sello', 'Management', 'Distribuidora', 'Artista', 'Otro'],
      artist: 'Artista y lanzamiento', link: 'Enlace a la música',
      timing: 'Inicio', timings: ['Este mes', 'El próximo mes', 'Dentro de tres meses', 'Sin fecha definida'],
      intent: 'Qué necesitas', intents: ['Campaña para DJs en EE. UU.', 'Media kit para sellos', 'Enviar un próximo lanzamiento'],
      extras: [
        { name: 'market', label: 'Mercado', options: ['Chile', 'Argentina', 'Latinoamérica', 'Global'] },
        { name: 'genre', label: 'Género', options: ['Trap / urbano', 'Reggaetón', 'RKT', 'Electrónica', 'Pop', 'Rock', 'Otro'] },
        { name: 'target', label: 'Mercado principal', options: ['Estados Unidos', 'Latinoamérica', 'Global'] },
      ],
      message: 'Algo más', optional: 'opcional',
      note: 'Respondemos dentro de dos días hábiles.',
      sending: 'Enviando…', ok: 'Recibido. Te respondemos dentro de dos días hábiles.',
      fail: 'No se pudo enviar. Intenta de nuevo en un momento.',
      invalid: 'Completa los campos obligatorios.',
    },
    relatedBlocks: () => [
      related('Más de Digiwaxx', [
        { href: '/es/promocion-dj-estados-unidos', cat: 'Latinoamérica', t: 'Promoción para DJs en EE. UU.' },
        { href: '/promotion/latin-music-promotion', cat: 'Género', t: 'Latin Music Promotion' },
      ]),
    ],
    artistCta: { kicker: '¿Artista independiente?', h2: 'La campaña estándar empieza en $99.', sub: 'Un sencillo llega a la misma red de más de 30,000 DJs por el proceso estándar, sin formularios de sello.', btn: 'Promote My Record' },
  },

  /* ---- /uk : London holds budgets for UK rap and half the diaspora. */
  {
    slug: 'uk/us-dj-promotion-for-uk-labels', file: 'uk/us-dj-promotion-for-uk-labels.html', lang: 'en-GB',
    title: 'U.S. DJ Promotion for UK Labels and Artists | Digiwaxx',
    description: 'Digiwaxx services UK rap, drill, afroswing and dance releases to 30,000+ U.S. DJs, clubs and mixshows, with campaign reporting back to London.',
    serviceName: 'U.S. DJ promotion for UK releases',
    audience: 'UK record labels, managers and artist teams',
    crumb: ['United Kingdom', '/uk/us-dj-promotion-for-uk-labels'],
    h1: 'U.S. DJ promotion for UK rap, drill, afroswing and dance',
    question: 'How does a UK release actually cross to American rooms?',
    quick: 'The UK is the third biggest music market on earth, and its records cross the Atlantic through DJ booths: drill up through New York, afroswing through the African and Caribbean nights, UK dance through the club circuit. Digiwaxx services your release to a network of 30,000+ U.S. DJs, with a report back to your team.',
    long: 'London holds the budgets for UK rap and for half the diaspora, and the transatlantic problem is always the same one: American DJs play what lands in their library in the right format. A UK record with a clean version, an intro edit and a contact who answers gets worked; a Spotify link gets mentioned.',
    sections: [
      { h2: 'What a UK Campaign Includes', html: `<ul>
<li><b>The right U.S. rooms:</b> drill and rap DJs in New York and the East Coast, African and Caribbean nights for afroswing, the club circuit for UK dance and garage</li>
<li><b>Digital delivery:</b> WAV or 320kbps MP3 with artwork, the way U.S. DJs take music</li>
<li><b>Mixshow and radio servicing:</b> clean versions to the DJs who bridge the club and the air</li>
<li><b>Campaign reporting:</b> delivery and response, written for a label meeting in London</li>
<li><b>DJ feedback:</b> collected and passed back where available</li>
</ul>` },
      { h2: 'For UK Labels and Managers', html: `<p>Per single or across a roster, planned around your release schedule. If the record is aimed at a U.S. tour window or a stateside feature, tell us the dates and the servicing lands inside them. We reply within two business days.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version: U.S. mixshow and radio play depends on it</li>
<li>DJ edits and extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, { n: '#3', l: 'The UK among world music markets (IFPI 2025)' }],
    form: EN_FORM('Request a UK Campaign', 'Request U.S. DJ Promotion', [
      { name: 'market', label: 'Market', options: ['United Kingdom', 'Africa diaspora / global', 'Europe', 'Global'] },
      { name: 'genre', label: 'Genre', options: ['UK rap / drill', 'Afroswing / afrobeats', 'Dance / UK garage', 'Grime', 'R&B', 'Pop', 'Other'] },
      { name: 'target', label: 'Primary target market', options: ['United States', 'Canada', 'Global'] },
    ]),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
        { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
        { href: '/promotion/hip-hop-promotion', cat: 'Genre', t: 'Hip Hop Promotion' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and managers. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /fr : Paris and the Francophone bridge, in French. */
  {
    slug: 'fr/promotion-dj-etats-unis', file: 'fr/promotion-dj-etats-unis.html', lang: 'fr',
    title: 'Promotion Musique vers les DJs aux États-Unis | Digiwaxx',
    description: 'Digiwaxx fait parvenir vos sorties rap, afro et coupé-décalé à plus de 30 000 DJs américains, clubs, mixshows et diaspora, avec rapport de campagne.',
    serviceName: 'Promotion de musique francophone vers les DJs américains',
    audience: 'Labels, managers et équipes francophones, de Paris à Abidjan',
    crumb: ['Francophonie', '/fr/promotion-dj-etats-unis'],
    qaLabel: 'En bref',
    h1: 'Faites jouer vos sorties par les DJs américains',
    question: 'Comment une sortie francophone atteint-elle les DJs aux États-Unis ?',
    quick: 'Le rap français, l’afro et le coupé-décalé traversent l’Atlantique par les cabines : les nuits africaines et caribéennes de New York, DC et Atlanta, et les mixshows qui font passer un titre du club à l’antenne. Digiwaxx sert vos sorties à un réseau de plus de 30 000 DJs américains depuis 1998, rapport de campagne inclus.',
    long: 'De Paris à Abidjan, Dakar et Kinshasa, la musique francophone tourne déjà à grande échelle sur Spotify et YouTube, et la diaspora remplit des salles de Bruxelles à Montréal. Ce qui manque entre cette échelle et une vraie présence américaine est logistique : le bon fichier, la version clean, et le DJ qui le reçoit de quelqu’un qui répond.',
    sections: [
      { h2: 'Ce que comprend la campagne', html: `<ul>
<li><b>La bonne liste de DJs :</b> nuits africaines et caribéennes, sélecteurs de la diaspora et DJs de mixshow, dans un réseau de plus de 30 000</li>
<li><b>Livraison numérique :</b> WAV ou MP3 320 kbps avec pochette, dans les formats que les DJs américains utilisent vraiment</li>
<li><b>Clubs et mixshows d’abord :</b> les salles où un titre fait ses preuves, pas des chiffres gonflés</li>
<li><b>Rapport de campagne :</b> livraison et retours, par sortie, pour votre réunion de label</li>
<li><b>Retours DJs :</b> collectés et transmis quand ils existent</li>
</ul>` },
      { h2: 'Pour les labels et distributeurs', html: `<p>Par single ou par catalogue, calé sur votre calendrier de sorties : rap FR, afro, coupé-décalé, rumba et dancehall passent par le même entonnoir avec des listes montées par disque. Écrivez-nous en français ou en anglais ; nous répondons sous deux jours ouvrés. Les labels d’Afrique francophone trouveront aussi le hub Afrique ci-dessous.</p>` },
      { h2: 'Ce qu’il faut préparer', html: `<ul>
<li>Audio haute qualité : WAV ou MP3 320 kbps</li>
<li>Version clean : la clé du mixshow et de la radio américaine</li>
<li>DJ edits, instrumental ou acapella (s’ils existent)</li>
<li>Pochette haute résolution, bio et press kit (EPK)</li>
<li>Date de sortie et liens officiels</li>
</ul>` },
    ],
    stats: [
      { n: '30 000+', l: 'DJs dans le réseau Digiwaxx aux États-Unis' },
      { n: '1998', l: 'Au service des DJs depuis' },
      { n: '15,2 %', l: 'Croissance 2025 de la musique en Afrique subsaharienne (IFPI)' },
    ],
    form: {
      title: 'Demander une campagne', submit: 'Demander une campagne DJ aux USA',
      company: 'Label ou société', name: 'Votre nom', email: 'E-mail professionnel',
      phone: 'WhatsApp ou téléphone', role: 'Type de société',
      roles: ['Label', 'Management', 'Distributeur', 'Artiste', 'Autre'],
      artist: 'Artiste et sortie', link: 'Lien vers la musique',
      timing: 'Début', timings: ['Ce mois-ci', 'Le mois prochain', 'Dans les trois mois', 'Pas encore de date'],
      intent: 'Votre besoin', intents: ['Campagne DJ aux États-Unis', 'Media kit label', 'Soumettre une sortie à venir'],
      extras: [
        { name: 'market', label: 'Marché', options: ['Afrique francophone', 'France / Belgique', 'Canada francophone', 'Diaspora / global'] },
        { name: 'genre', label: 'Genre', options: ['Rap FR', 'Afro / afrobeats', 'Coupé-décalé', 'Rumba / ndombolo', 'Dancehall', 'Pop', 'Autre'] },
        { name: 'target', label: 'Marché principal', options: ['États-Unis', 'Canada', 'Europe', 'Global'] },
      ],
      message: 'Autre chose', optional: 'optionnel',
      note: 'Nous répondons sous deux jours ouvrés.',
      sending: 'Envoi…', ok: 'Bien reçu. Nous répondons sous deux jours ouvrés.',
      fail: 'Échec de l’envoi. Réessayez dans un instant.',
      invalid: 'Merci de remplir les champs obligatoires.',
    },
    relatedBlocks: () => [
      related('Aussi chez Digiwaxx', [
        { href: '/africa', cat: 'Afrique', t: 'African Music Promotion Hub' },
        { href: '/promotion/afrobeats-promotion-new-york', cat: 'Genre × Ville', t: 'Afrobeats Promotion in New York' },
      ]),
    ],
    artistCta: { kicker: 'Artiste avec un seul titre ?', h2: 'La campagne standard commence à 99 $.', sub: 'Le formulaire ci-dessus est pour les labels et équipes. Un titre seul atteint le même réseau de plus de 30 000 DJs par le parcours standard.', btn: 'Promote My Record' },
  },

  /* ---- /ca : Toronto, the Punjabi wave HQ and diaspora capital. */
  {
    slug: 'ca/us-dj-promotion-for-canadian-artists', file: 'ca/us-dj-promotion-for-canadian-artists.html', lang: 'en',
    title: 'U.S. DJ Promotion for Canadian Artists | Digiwaxx',
    description: 'Digiwaxx services Canadian releases, rap, Punjabi, dancehall, soca and afrobeats, to 30,000+ U.S. DJs and mixshows, with campaign reporting.',
    serviceName: 'U.S. DJ promotion for Canadian releases',
    audience: 'Canadian labels, managers and artist teams',
    crumb: ['Canada', '/ca/us-dj-promotion-for-canadian-artists'],
    h1: 'From Toronto to U.S. DJ booths',
    question: 'How does a Canadian release cross into American rooms?',
    quick: 'Toronto runs three of the most exportable scenes in music: rap, the Punjabi wave, and the Caribbean and African diaspora sounds. The border they all cross is the DJ booth. Digiwaxx services your release to a network of 30,000+ U.S. DJs, with a report back to your team.',
    long: 'A Canadian record does not need convincing arguments in the U.S., it needs presence in the rooms: the desi parties and Punjabi nights from New Jersey to the Bay Area, the Caribbean rooms of New York and Miami for dancehall and soca, and the rap and mixshow circuit everywhere. Servicing puts it there in the right formats.',
    sections: [
      { h2: 'What a Canada Campaign Includes', html: `<ul>
<li><b>Scene-matched U.S. lists:</b> Punjabi and South Asian nights, Caribbean rooms, rap and mixshow DJs, from a 30,000+ DJ network</li>
<li><b>Digital delivery:</b> WAV or 320kbps MP3 with artwork, the way U.S. DJs take music</li>
<li><b>Clean versions to mixshow DJs:</b> the bridge from the club to the air</li>
<li><b>Campaign reporting:</b> delivery and response per release</li>
<li><b>DJ feedback:</b> collected and passed back where available</li>
</ul>` },
      { h2: 'For Canadian Labels and Managers', html: `<p>Per single or across a roster. The Punjabi scene especially moves on tour windows and wedding seasons; tell us the dates and the servicing lands inside them. We reply within two business days.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version for mixshow and radio DJs</li>
<li>DJ edits and extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request a Canada Campaign', 'Request U.S. DJ Promotion', [
      { name: 'market', label: 'Market', options: ['Canada', 'Punjabi / South Asian diaspora', 'Caribbean diaspora', 'Global'] },
      { name: 'genre', label: 'Genre', options: ['Hip-hop / rap', 'Punjabi', 'Dancehall / soca', 'Afrobeats', 'R&B', 'Pop', 'Other'] },
      { name: 'target', label: 'Primary target market', options: ['United States', 'Canada', 'Global'] },
    ]),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/india/us-dj-promotion-for-indian-artists', cat: 'Country', t: 'U.S. DJ Promotion for Indian Artists' },
        { href: '/promotion/dancehall-promotion', cat: 'Genre', t: 'Dancehall Promotion' },
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /jp : Japan, the #2 market. High budget, patient intent. */
  {
    slug: 'jp/us-dj-promotion', file: 'jp/us-dj-promotion.html', lang: 'ja',
    title: '米国DJプロモーション | Digiwaxx',
    description: 'Digiwaxxは日本のレーベル・マネジメント・ディストリビューターのために、米国の3万人以上のDJへ音源をサービスし、キャンペーンレポートをお届けします。1998年創業のレコードプールです。',
    serviceName: '日本のリリースの米国DJプロモーション',
    audience: '日本のレーベル、マネジメント、ディストリビューター',
    crumb: ['日本', '/jp/us-dj-promotion'],
    qaLabel: '要点',
    h1: 'あなたのリリースをアメリカのDJへ',
    question: '日本の楽曲はどうすれば米国のDJに届きますか？',
    quick: 'シティポップの再評価やアニメ発のヒットが示す通り、日本の音楽はすでに米国で聴かれています。次の一歩はDJブースです。Digiwaxxは1998年から3万人以上の米国DJに音源をサービスしてきたレコードプールで、キャンペーンごとにレポートをお返しします。',
    long: 'J-pop、シティポップ、日本のヒップホップやエレクトロニックが米国で実際に再生されるかどうかは、クラブとミックスショーのDJのライブラリに正しいフォーマットで入っているかで決まります。ストリーミングのリンクではなくファイルを、正しいメタデータとクリーンバージョンと共に届けることがサービシングです。',
    sections: [
      { h2: 'キャンペーンの内容', html: `<ul>
<li><b>DJターゲティング：</b>ジャンルとフォーマットに合わせ、3万人以上のネットワークから米国DJのリストを作成します</li>
<li><b>デジタルデリバリー：</b>WAVまたは320kbps MP3とアートワークを、米国のDJが実際に使う形式で届けます</li>
<li><b>クラブとミックスショー重視：</b>水増しされた数字ではなく、現場と放送で楽曲をかけるDJに集中します</li>
<li><b>キャンペーンレポート：</b>配信状況と反応をリリースごとにまとめてお届けします</li>
</ul>` },
      { h2: 'レーベルの方へ', html: `<p>シングル単位でもカタログ単位でも、御社のリリース計画に合わせて進行します。お問い合わせは日本語または英語でどうぞ。2営業日以内にご返信します。</p>` },
      { h2: '必要な素材', html: `<ul>
<li>高音質音源：WAVまたは320kbps MP3</li>
<li>クリーンバージョン：米国のミックスショーとラジオには必須です</li>
<li>DJエディットやインストゥルメンタル（あれば）</li>
<li>高解像度アートワーク、アーティスト紹介とプレスキット（EPK）</li>
<li>リリース日と公式リンク</li>
</ul>` },
    ],
    stats: [
      { n: '30,000+', l: 'Digiwaxxネットワークの米国DJ数' },
      { n: '1998', l: 'DJへの音源サービス開始年' },
      { n: '第2位', l: '日本の音楽市場の世界順位（IFPI 2025）' },
    ],
    form: {
      title: 'キャンペーンのお問い合わせ', submit: '米国DJプロモーションを相談する',
      company: '会社名', name: 'ご担当者名', email: 'メールアドレス',
      phone: 'WhatsAppまたは電話番号', role: '会社の種類',
      roles: ['レーベル', 'マネジメント', 'ディストリビューター', 'アーティスト', 'その他'],
      artist: 'アーティストとリリース', link: '音源リンク',
      timing: '開始時期', timings: ['今月', '来月', '3か月以内', '未定'],
      intent: 'ご希望内容', intents: ['米国DJプロモーション', 'メディアキット希望', 'リリース提出'],
      extras: [
        { name: 'market', label: '市場', options: ['日本', 'グローバル', 'その他'] },
        { name: 'genre', label: 'ジャンル', options: ['J-pop', 'シティポップ', 'ヒップホップ', 'エレクトロニック', 'ロック', 'アニメ関連', 'その他'] },
        { name: 'target', label: '主なターゲット市場', options: ['アメリカ', 'グローバル'] },
      ],
      message: 'その他', optional: '任意',
      note: '2営業日以内にご返信します。',
      sending: '送信中…', ok: '受け付けました。2営業日以内にご返信します。',
      fail: '送信できませんでした。しばらくしてからもう一度お試しください。',
      invalid: '必須項目をご入力ください。',
    },
    relatedBlocks: () => [
      related('Other Markets', [
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
        { href: '/ko/us-dj-promotion-for-korean-labels', cat: '한국어', t: '한국 레이블을 위한 미국 DJ 프로모션' },
      ]),
    ],
    artistCta: { kicker: 'アーティストの方へ', h2: '標準キャンペーンは$99から。', sub: '上のフォームはレーベル向けです。1曲のリリースは標準の提出手順で同じ3万人のDJネットワークに届きます。', btn: 'Promote My Record' },
  },

  /* ---- /india : Punjabi-forward, the budgeted lane of a huge market. */
  {
    slug: 'india/us-dj-promotion-for-indian-artists', file: 'india/us-dj-promotion-for-indian-artists.html', lang: 'en',
    title: 'U.S. DJ Promotion for Indian Artists | Digiwaxx',
    description: 'Digiwaxx services Punjabi, Bollywood and South Asian releases to 30,000+ U.S. DJs: desi nights, mixshows and diaspora rooms, with campaign reporting.',
    serviceName: 'U.S. DJ promotion for Indian and South Asian releases',
    audience: 'Indian and South Asian labels, managers and artist teams',
    crumb: ['India', '/india/us-dj-promotion-for-indian-artists'],
    h1: 'U.S. DJ promotion for Punjabi, Bollywood and South Asian releases',
    question: 'How does an Indian release reach American desi rooms?',
    quick: 'The Punjabi wave proved it: South Asian records break globally through the diaspora floor, the desi nights and wedding circuits of New Jersey, the Bay Area, Chicago, Houston and New York. The DJs who run those rooms are reachable, and servicing them properly is the whole job. Digiwaxx delivers to a network of 30,000+ U.S. DJs, with a report back to your team.',
    long: 'At home the audience consumes at a scale few markets can match, YouTube first. Abroad, the same audience is in rooms run by DJs, and a record that arrives as files with a clean version and a contact who answers gets played; a link gets forgotten. That gap between streaming scale and room presence is exactly what a campaign closes.',
    sections: [
      { h2: 'What an India Campaign Includes', html: `<ul>
<li><b>Desi night and wedding circuit DJs:</b> the rooms where South Asian records actually break in America, from a 30,000+ DJ network</li>
<li><b>Crossover servicing:</b> hip-hop and mixshow DJs for records built to travel past the community</li>
<li><b>Digital delivery:</b> WAV or 320kbps MP3 with artwork, the way U.S. DJs take music</li>
<li><b>Campaign reporting:</b> delivery and response per release, written for your team</li>
<li><b>DJ feedback:</b> collected and passed back where available</li>
</ul>` },
      { h2: 'For Labels and Artist Teams', html: `<p>Per single or across a roster: Punjabi, Bollywood and film soundtracks, hip-hop, indie and devotional catalogues all run through the same funnel with lists built per record. The Punjabi lane moves on tour and wedding seasons; tell us the dates. We reply within two business days.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version for mixshow and radio DJs</li>
<li>DJ edits and extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request an India Campaign', 'Request U.S. DJ Promotion', [
      { name: 'market', label: 'Market', options: ['India / South Asia', 'South Asian diaspora (US / Canada / UK)', 'Global'] },
      { name: 'genre', label: 'Genre', options: ['Punjabi', 'Bollywood / film', 'Hip-hop / rap', 'Indie / pop', 'Electronic', 'Bhangra', 'Other'] },
      { name: 'target', label: 'Primary target market', options: ['United States', 'Canada', 'United Kingdom', 'Global'] },
    ]),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/ca/us-dj-promotion-for-canadian-artists', cat: 'Country', t: 'U.S. DJ Promotion for Canadian Artists' },
        { href: '/promotion/hip-hop-promotion', cat: 'Genre', t: 'Hip Hop Promotion' },
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },

  /* ---- /id : Indonesia, in Bahasa. Scale-consumption market, early funnel. */
  {
    slug: 'id/promosi-musik-dj-amerika', file: 'id/promosi-musik-dj-amerika.html', lang: 'id',
    title: 'Promosi Musik ke DJ Amerika Serikat | Digiwaxx',
    description: 'Digiwaxx mengantarkan rilisan Indonesia ke jaringan lebih dari 30.000 DJ di Amerika Serikat, klub dan mixshow, dengan laporan kampanye untuk tim Anda.',
    serviceName: 'Promosi musik Indonesia ke DJ Amerika Serikat',
    audience: 'Label, manajemen, dan artis Indonesia',
    crumb: ['Indonesia', '/id/promosi-musik-dj-amerika'],
    qaLabel: 'Jawaban singkat',
    h1: 'Bawa rilisan Anda ke DJ profesional di Amerika Serikat',
    question: 'Bagaimana rilisan Indonesia sampai ke DJ di Amerika?',
    quick: 'Pendengar Indonesia termasuk yang terbesar di dunia di YouTube dan Spotify. Langkah berikutnya untuk sebuah rilisan adalah lantai dansa Amerika, dan pintunya adalah DJ. Digiwaxx melayani rilisan ke jaringan lebih dari 30.000 DJ AS sejak 1998, dengan laporan kampanye untuk tim Anda.',
    long: 'DJ Amerika memutar apa yang ada di library mereka, dalam format yang benar: WAV atau MP3 320 kbps, versi bersih untuk mixshow dan radio, artwork, dan kontak yang membalas. Itulah servicing, dan itulah yang dilakukan sebuah record pool.',
    sections: [
      { h2: 'Isi kampanye', html: `<ul>
<li><b>Daftar DJ yang tepat:</b> disusun per rilisan berdasarkan genre dan pasar, dari jaringan lebih dari 30.000 DJ</li>
<li><b>Pengiriman digital:</b> audio berkualitas tinggi dan artwork, dalam format yang benar-benar dipakai DJ</li>
<li><b>Fokus klub dan mixshow:</b> DJ yang memutar musik di lantai dansa dan di udara, bukan angka palsu</li>
<li><b>Laporan kampanye:</b> pengiriman dan respons, per rilisan</li>
</ul>` },
      { h2: 'Untuk label dan manajemen', html: `<p>Per single atau per katalog, mengikuti jadwal rilis Anda. Silakan menulis dalam bahasa Indonesia atau Inggris; kami membalas dalam dua hari kerja.</p>` },
      { h2: 'Materi yang dibutuhkan', html: `<ul>
<li>Audio berkualitas tinggi: WAV atau MP3 320 kbps</li>
<li>Versi bersih untuk mixshow dan radio</li>
<li>DJ edit atau intro panjang (jika ada)</li>
<li>Artwork resolusi tinggi, bio artis dan press kit (EPK)</li>
<li>Tanggal rilis dan tautan resmi</li>
</ul>` },
    ],
    stats: [
      { n: '30.000+', l: 'DJ dalam jaringan Digiwaxx di AS' },
      { n: '1998', l: 'Melayani DJ sejak' },
      { n: '~100K', l: 'Lagu diunggah ke streaming setiap hari. Mengunggah saja tidak cukup' },
    ],
    form: {
      title: 'Ajukan kampanye', submit: 'Ajukan kampanye DJ di AS',
      company: 'Label atau perusahaan', name: 'Nama Anda', email: 'Email kerja',
      phone: 'WhatsApp atau telepon', role: 'Jenis perusahaan',
      roles: ['Label', 'Manajemen', 'Distributor', 'Artis', 'Lainnya'],
      artist: 'Artis dan rilisan', link: 'Tautan musik',
      timing: 'Mulai', timings: ['Bulan ini', 'Bulan depan', 'Dalam tiga bulan', 'Belum pasti'],
      intent: 'Kebutuhan Anda', intents: ['Kampanye DJ di AS', 'Media kit label', 'Kirim rilisan'],
      extras: [
        { name: 'market', label: 'Pasar', options: ['Indonesia', 'Asia Tenggara', 'Global'] },
        { name: 'genre', label: 'Genre', options: ['Pop', 'Hip-hop', 'Dangdut / koplo', 'Elektronik', 'Indie', 'R&B', 'Lainnya'] },
        { name: 'target', label: 'Pasar utama', options: ['Amerika Serikat', 'Global'] },
      ],
      message: 'Lainnya', optional: 'opsional',
      note: 'Kami membalas dalam dua hari kerja.',
      sending: 'Mengirim…', ok: 'Diterima. Kami membalas dalam dua hari kerja.',
      fail: 'Gagal mengirim. Coba lagi sebentar lagi.',
      invalid: 'Lengkapi kolom wajib.',
    },
    relatedBlocks: () => [
      related('Other Markets', [
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
        { href: '/ph/us-dj-promotion-for-filipino-artists', cat: 'Country', t: 'U.S. DJ Promotion for Filipino Artists' },
      ]),
    ],
    artistCta: { kicker: 'Artis dengan satu lagu?', h2: 'Kampanye standar mulai dari $99.', sub: 'Formulir di atas untuk label dan tim. Satu lagu mencapai jaringan 30.000+ DJ yang sama lewat jalur standar.', btn: 'Promote My Record' },
  },

  /* ---- /ph : the Philippines. OPM, and the most storied DJ diaspora in America. */
  {
    slug: 'ph/us-dj-promotion-for-filipino-artists', file: 'ph/us-dj-promotion-for-filipino-artists.html', lang: 'en',
    title: 'U.S. DJ Promotion for Filipino Artists | Digiwaxx',
    description: 'Digiwaxx services OPM and Filipino releases to 30,000+ U.S. DJs, from the diaspora party circuit to mixshows, with campaign reporting to Manila.',
    serviceName: 'U.S. DJ promotion for Filipino releases',
    audience: 'OPM labels and Filipino artist teams',
    crumb: ['Philippines', '/ph/us-dj-promotion-for-filipino-artists'],
    h1: 'OPM and Filipino releases to U.S. DJs and mixshows',
    question: 'How does a Filipino release reach American rooms?',
    quick: 'Filipino-American communities are among the largest in Los Angeles, the Bay Area, Las Vegas, Hawaii and Seattle, and Filipino-American DJs are some of the most storied in American club culture. Digiwaxx services your release to a network of 30,000+ U.S. DJs, with a report back to Manila.',
    long: 'The Philippines streams at enormous scale, and OPM is finally exporting. The practical path into the U.S. is the one every genre uses: the diaspora party circuit first, the debuts and gatherings and club nights where the community actually dances, then mixshows for the crossover. DJs run all of it, and they play what lands in their library in the right format.',
    sections: [
      { h2: 'What a Philippines Campaign Includes', html: `<ul>
<li><b>Diaspora circuit DJs:</b> the Filipino-American party and club DJs of the West Coast, Vegas and Hawaii, from a 30,000+ DJ network</li>
<li><b>Crossover servicing:</b> R&B, pop and mixshow DJs for records built to travel past the community</li>
<li><b>Digital delivery:</b> WAV or 320kbps MP3 with artwork, the way U.S. DJs take music</li>
<li><b>Campaign reporting:</b> delivery and response per release</li>
<li><b>DJ feedback:</b> collected and passed back where available</li>
</ul>` },
      { h2: 'For OPM Labels and Teams', html: `<p>Per single or across a roster. Write in English or Filipino; we reply within two business days.</p>` },
      { h2: 'What Your Release Needs', html: `<ul>
<li>High quality audio: WAV or 320kbps MP3</li>
<li>A clean version for mixshow and radio DJs</li>
<li>DJ edits and extended intros where they exist</li>
<li>Instrumental or acapella if one exists</li>
<li>High resolution artwork, artist bio and press kit (EPK), release date and official links</li>
</ul>` },
    ],
    stats: [STAT_DJS, STAT_SINCE, STAT_UPLOADS],
    form: EN_FORM('Request a Philippines Campaign', 'Request U.S. DJ Promotion', [
      { name: 'market', label: 'Market', options: ['Philippines', 'Filipino diaspora (US)', 'Global'] },
      { name: 'genre', label: 'Genre', options: ['OPM / pop', 'Hip-hop', 'R&B', 'Dance / electronic', 'Rock', 'Other'] },
      { name: 'target', label: 'Primary target market', options: ['United States', 'Global'] },
    ]),
    relatedBlocks: () => [
      related('Keep Going', [
        { href: '/promotion/rnb-promotion', cat: 'Genre', t: 'R&B Promotion' },
        { href: '/id/promosi-musik-dj-amerika', cat: 'Country', t: 'Promosi Musik ke DJ Amerika' },
        { href: '/labels', cat: 'International', t: 'U.S. DJ Promotion for International Labels' },
      ]),
    ],
    artistCta: { kicker: 'One artist, one record?', h2: 'The standard campaign starts at $99.', sub: 'The form above is for labels and teams. A single record reaches the same 30,000+ DJs through the standard funnel.', btn: 'Promote My Record' },
  },
];

/* ------------------------------------------------------------------ guides */

const GUIDES = [
  {
    slug: 'how-nigerian-artists-promote-afrobeats-to-us-djs',
    title: 'How Nigerian Artists Reach U.S. DJs | Digiwaxx',
    h1: 'How Nigerian Artists Can Promote Afrobeats to DJs in the United States',
    question: 'How does a Nigerian artist get played by American DJs?',
    description: 'The streams say Nigeria already won. The rooms are the part you still have to work, and the rooms belong to DJs. A practical guide.',
    quick: 'Reach the DJs who already play African music to African and Caribbean audiences in the U.S. diaspora cities, service them properly (files, clean version, EPK, a contact who answers), and follow up. A record pool does the mass delivery; Digiwaxx has serviced DJs since 1998 and reaches 30,000+.',
    long: "By the numbers, Nigerian music does not need anyone's help. Spotify reports Afrobeats streams from Nigeria have grown 5,022% since 2021, Nigerian artists earned over $40 million on the platform in 2025, and more than 80% of Nigeria's Daily Top 50 is Nigerian. What does not export itself is the room. A record can be huge from Lagos to Ibadan and still be absent from the African night in Houston on Saturday, the mixshow in New York on Friday, the hall party in New Jersey where the diaspora actually dances. Those rooms are run by DJs, and nothing puts a record in their library except somebody putting it there.",
    sections: [
      { h2: 'Find the DJs Who Already Play to Your Audience', html: `<p>You do not need every DJ in America. You need the ones who already play African music to African and Caribbean audiences, and they cluster where the diaspora clusters: New York and New Jersey, Washington DC, Atlanta, Houston, Chicago, Los Angeles. Add the mixshow DJs who take records from those rooms to the air, and the university African student associations that book the parties, and the working list for a single is closer to a hundred names than ten thousand. A record pool sells you exactly this reach, maintained: one properly packaged submission through Digiwaxx reaches 30,000+ working DJs, including the Afrobeats specialists in every major market.</p>` },
      { h2: 'Service the Record Properly', html: `<p>A DJ plays what is playable. That means high quality audio, WAV or 320kbps MP3, never a streaming rip. It means a clean version, because American mixshow and radio play is impossible without one. It means artwork, a short EPK, the release date, and a contact who answers when a DJ replies. Records that arrive as a Spotify link with no files attached are not being serviced, they are being mentioned.</p><p>Then the follow-up, which is the half of the job that gets skipped. A file delivered is not a record played. The second touch, a week later, asking who tried it and what happened, is where the actual information lives: which rooms it works in, which version they reach for, whether the record needs an edit.</p>` },
      { h2: 'What a Campaign Looks Like', html: `<p>Run properly, a U.S. campaign for a Nigerian release is a few weeks of concentrated work: the list built to the record, delivery in the right formats, follow-up while the release is still fresh, and a report back to Lagos naming who was serviced and what came back. That report is the difference between promotion and hope. The <a href="/africa/nigeria-us-dj-promotion">Nigeria campaign page</a> explains what a Digiwaxx label campaign includes and takes the request directly.</p>` },
    ],
    related: [
      { href: '/africa/nigeria-us-dj-promotion', cat: 'Campaign', t: 'U.S. DJ Promotion for Nigerian Labels' },
      { href: '/africa/afrobeats-dj-promotion-usa', cat: 'Campaign', t: 'Afrobeats DJ Promotion USA' },
      { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
      { href: '/guides/how-to-reach-djs', cat: 'Guides', t: 'How to Reach DJs With Your Music' },
    ],
    cta: { kicker: 'Ready?', h2: 'Run the Nigeria campaign.', sub: 'Your release serviced to the U.S. DJs and diaspora rooms that break Afrobeats records, with a report back to your team.', href: '/africa/nigeria-us-dj-promotion#campaign-form', btn: 'Request a Campaign' },
  },
  {
    slug: 'afrobeats-dj-promotion-what-labels-need',
    title: 'Afrobeats DJ Promotion: What Labels Need | Digiwaxx',
    h1: 'Afrobeats DJ Promotion: What Labels Need for U.S. DJ Servicing',
    question: 'What should a label prepare for a U.S. Afrobeats campaign?',
    description: 'A checklist for the label side of a U.S. Afrobeats campaign: what to prepare, what a servicing partner should do, and what to refuse to pay for.',
    quick: 'Prepare every version as files (clean version included), artwork, a one page EPK and a contact who answers within a day. Expect four things from a servicing partner in writing: targeting, delivery, follow-up and reporting. Refuse anything that describes reach without naming rooms.',
    long: 'Afrobeats DJ promotion in the United States is a specific piece of work with specific inputs. Labels that arrive prepared get campaigns that start inside the release window. Labels that do not spend the release window assembling assets while the record cools.',
    sections: [
      { h2: 'What the Label Prepares', html: `<p>Audio first: WAV or 320kbps MP3 of every version that exists. The clean version is not optional for the U.S., it is the key to mixshow and radio play, and a record without one has closed those doors before the campaign starts. DJ edits and extended intros where they exist, an instrumental or acapella if one exists, high resolution artwork, and an EPK short enough to be read. One more thing, organisational rather than musical: a contact on your side who can answer a question inside a day. Campaigns stall on unanswered questions more often than on weak records.</p>` },
      { h2: 'What the Servicing Partner Does', html: `<p>Four things, and a label should expect all four in writing. Targeting: a DJ list built for this record, its genre and its market, not a recycled blast list. Delivery: secure digital servicing in the formats DJs use. Follow-up: the second and third touches that turn a delivered file into a played record, and that collect feedback where DJs give it. Reporting: who was serviced, what was delivered, what came back, in a document you can put in front of your own management.</p>` },
      { h2: 'What to Refuse to Pay For', html: `<p>Anything that describes reach without naming rooms. Bot streams, guaranteed playlist placements from accounts nobody runs, follower packages, screenshots of numbers you cannot audit. None of it touches the thing Afrobeats actually runs on in the U.S., which is DJs playing records to rooms of people who dance to them. The <a href="/africa/afrobeats-dj-promotion-usa">Afrobeats USA campaign page</a> covers what a Digiwaxx servicing run includes and takes the request directly.</p>` },
    ],
    related: [
      { href: '/africa/afrobeats-dj-promotion-usa', cat: 'Campaign', t: 'Afrobeats DJ Promotion USA' },
      { href: '/africa', cat: 'Campaign', t: 'African Music Promotion Hub' },
      { href: '/answers/how-record-pools-work', cat: 'Straight Answers', t: 'How Record Pools Work' },
    ],
    cta: { kicker: 'Ready?', h2: 'Request the Afrobeats campaign.', sub: 'Targeting, delivery, follow-up and a report, from the network that has serviced DJs since 1998.', href: '/africa/afrobeats-dj-promotion-usa#campaign-form', btn: 'Request a Campaign' },
  },
  {
    slug: 'amapiano-promotion-in-the-us',
    title: 'Amapiano Promotion in the U.S. | Digiwaxx',
    h1: 'Amapiano Promotion in the U.S.: DJs, Clubs, Mixshows and Diaspora Audiences',
    question: 'How does an amapiano record break in America?',
    description: 'A format born in the DJ booth breaks abroad through DJ booths. How a South African release actually reaches American floors.',
    quick: 'Amapiano is a set format, not a song format: service the extended mix as the primary asset, work both American doors (the African diaspora floor and the house circuit), and judge the campaign on rotation over months, not week two adds.',
    long: "Amapiano did not arrive through radio and it did not arrive through playlists. It arrived because DJs in Johannesburg and Pretoria built a format around the booth, long records that breathe, the log drum drop as an event, and because DJs elsewhere recognised a DJ format when they heard one. Spotify's Africa reporting calls amapiano a cross-market force, and the market that crossed first was the DJ booth. That origin decides the promotion: a song-first genre can chase radio; a set-first genre has to chase the people who play sets.",
    sections: [
      { h2: 'Two American Audiences, Not One', html: `<p>Amapiano has two distinct doors into the U.S. The first is the African diaspora floor: the same nights in New York, DC, Atlanta, Houston and Chicago that break Afrobeats records, where the audience knows the sound from home and the DJ needs no convincing, only the record. The second is the American dance audience, reached through house and Afro-house DJs, where amapiano reads as the newest branch of a house lineage those DJs already own. The records that travel furthest work both doors, and the two want different pitches.</p>` },
      { h2: 'The Extended Mix Is the Record', html: `<p>Servicing amapiano with a three minute radio edit is servicing the wrong file. The six minute version is the one a DJ can actually use, so it leads the delivery, with the edit alongside for mixshows and the clean version where vocals need one. Instrumentals and DJ tools earn plays in this genre especially, because amapiano DJs blend hard and long.</p>` },
      { h2: 'What a Campaign Looks Like', html: `<p>A U.S. amapiano campaign is a dance campaign: a DJ list weighted to selectors, African night residents and house circuit DJs, delivery that treats the extended mix as primary, follow-up while the record is fresh, and a report back to the label. Clubs and mixshows first; the streaming chart is the echo of those rooms, not the cause. The <a href="/africa/south-africa-amapiano-dj-promotion">South Africa campaign page</a> has the details and takes the request.</p>` },
    ],
    related: [
      { href: '/africa/south-africa-amapiano-dj-promotion', cat: 'Campaign', t: 'Amapiano & Afro-House Promotion' },
      { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
      { href: '/goals/get-club-plays', cat: 'Artist Goals', t: 'How to Get Club Plays' },
    ],
    cta: { kicker: 'Ready?', h2: 'Run the amapiano campaign.', sub: 'Extended mixes to the club, mixshow and house circuit DJs who actually play the format.', href: '/africa/south-africa-amapiano-dj-promotion#campaign-form', btn: 'Request a Campaign' },
  },
  {
    slug: 'how-to-release-african-music-to-us-djs',
    title: 'Releasing African Music to U.S. DJs | Digiwaxx',
    h1: 'How to Release African Music to U.S. DJs: Clean Versions, DJ Edits and EPK Requirements',
    question: 'What does an African release need before U.S. DJ servicing?',
    description: 'The unglamorous checklist that decides whether American DJs can actually play your record. Most campaigns that fail, fail here.',
    quick: 'Files, not links: WAV or 320 for every version. A clean version for anything beyond the club. Extended intros and DJ edits so the record mixes. A one page EPK with the genre named precisely and a contact who answers within a day.',
    long: 'Most African releases that go nowhere in the U.S. do not fail on the music. They fail on logistics: the mixshow DJ who never got a clean version, the club DJ who got a streaming link instead of a file, the selector who liked the record and could not find out who to reply to. This is the checklist that prevents that.',
    sections: [
      { h2: 'Audio, Clean Versions and Edits', html: `<p>WAV or 320kbps MP3 for every version. American DJs play from files; a Spotify link is a listening suggestion, not a serviceable record. The clean version is the whole ballgame for anything beyond the club: mixshow and radio play requires one, full stop, and a surprising number of strong African releases arrive without it. If the lyric needs no edit, say so explicitly, because a DJ will not assume it.</p><p>A record that opens cold on a vocal is hard to mix. An extended intro, eight or sixteen bars of instrumental runway, is cheap to make and measurably raises plays. For dance records, amapiano and Afro-house especially, the extended mix is the primary asset. Instrumentals and acapellas earn blends, and blends are how a new record sneaks into a cautious set.</p>` },
      { h2: 'The EPK', html: `<p>One page. Who the artist is in two sentences, what the record is, the release date, the genre named precisely, gengetone is not Afrobeats and a DJ who knows the difference is exactly the DJ you want, plus links and a contact who answers within a day. Photos help; a ten page biography does not.</p>` },
      { h2: 'Delivery and Follow-Up', html: `<p>Service files securely in the formats above, then follow up once the dust settles: who tried it, in what room, what happened. That feedback is the cheapest market research a label can get, and a campaign that skips it has thrown away half of what it paid for. All of this is the standing intake for a Digiwaxx Africa campaign; the <a href="/africa">Africa hub</a> lists every market funnel and takes requests directly.</p>` },
    ],
    related: [
      { href: '/africa', cat: 'Campaign', t: 'African Music Promotion Hub' },
      { href: '/tools/epk-builder', cat: 'Free Tools', t: 'EPK Builder' },
      { href: '/guides/how-to-get-djs-to-play-my-song', cat: 'Guides', t: 'How to Get DJs to Play Your Song' },
    ],
    cta: { kicker: 'Ready?', h2: 'Submit your release.', sub: 'Every market funnel, one intake: tell us what the record is and where it should go.', href: '/africa#campaign-form', btn: 'Submit a Release' },
  },
  {
    slug: 'lagos-accra-to-new-york-dj-promotion-plan',
    title: 'Lagos to New York: A DJ Promotion Plan | Digiwaxx',
    h1: 'From Lagos and Accra to New York, Atlanta and London: A DJ Promotion Plan',
    question: 'What does a diaspora DJ campaign look like week by week?',
    description: 'A six week servicing plan for taking an African release into the diaspora cities, in the order the rooms actually work.',
    quick: 'Two weeks out: assemble the package and pick two or three lead cities. Release week: service the club and party DJs. Weeks two and three: follow up and widen to mixshows. Weeks four to six: consolidate where it caught and write the report that plans the next single.',
    long: 'Diaspora cities are where an African release earns its passport. The pattern repeats across genres: the record fills rooms in Lagos or Accra, the diaspora DJs pick it up in New York, DC, Atlanta, Houston, Toronto and London, and whatever happens after that, mixshow play, a remix, a chart entry, starts in those rooms. Here is that pipeline as a plan.',
    sections: [
      { h2: 'Two Weeks Before Release', html: `<p>Assemble the package: WAV or 320 for every version, the clean version, edits and intros, artwork, the one page EPK, the contact who answers. Decide the market order deliberately. A Nigerian street-pop record probably leads with New York, Houston and Atlanta; a Ghanaian release leans New York, New Jersey and DC; an amapiano record adds the house circuit cities. Choose two or three, not ten.</p>` },
      { h2: 'Release Week, Then Weeks Two and Three', html: `<p>Service the club and party DJs in the lead cities first: the African night residents, the diaspora selectors, the university party circuit. These rooms move first because their audiences already know the sound and their DJs answer to the floor, not a format clock.</p><p>Then follow up and widen to mixshows. The first feedback tells you which version works and which rooms respond; the mixshow DJs, who bridge the club and the air, get the record with that context attached and the clean version on top. If London or Toronto is in the plan, this is when they start, using the U.S. response as the pitch.</p>` },
      { h2: 'Weeks Four to Six', html: `<p>Consolidate. Records that caught get a second push where they caught, with edits or tools if DJs asked for them. Records that did not get an honest report instead of a louder blast: which cities, which DJs, what came back, what to change before the next single. The report is the plan for the next release, which is the point of writing it. Digiwaxx runs this plan as a service, market by market, from the <a href="/africa">Africa hub</a>.</p>` },
    ],
    related: [
      { href: '/africa', cat: 'Campaign', t: 'African Music Promotion Hub' },
      { href: '/africa/nigeria-us-dj-promotion', cat: 'Campaign', t: 'U.S. DJ Promotion for Nigerian Labels' },
      { href: '/campaigns/60-day-release-plan', cat: 'Blueprints', t: '60-Day Release Plan' },
    ],
    cta: { kicker: 'Ready?', h2: 'Run the plan with the network.', sub: 'Your release serviced city by city to 30,000+ working DJs, with a report at the end.', href: '/africa#campaign-form', btn: 'Request a Campaign' },
  },
  {
    slug: 'afrobeats-vs-amapiano-promotion',
    title: 'Afrobeats vs. Amapiano Promotion | Digiwaxx',
    h1: 'Afrobeats vs. Amapiano Promotion: Different DJ Campaigns for Different Markets',
    question: 'Should Afrobeats and amapiano be promoted the same way?',
    description: 'One is a song format, one is a set format, and a campaign that treats them the same will underserve both.',
    quick: 'No. Afrobeats is a song format that travels through parties, mixshows and radio; amapiano is a set format that travels through DJ booths and dance floors. They need different primary assets, different rooms and different measures of success.',
    long: 'Afrobeats and amapiano get promoted together so often that the differences disappear into the word African, and the differences are exactly what a campaign is made of. One is a song format that lives in three to four minutes. The other is a set format that lives in six minute stretches. Same continent, different physics.',
    sections: [
      { h2: 'Different Primary Assets', html: `<p>An Afrobeats campaign leads with the song: the main version, the clean version for mixshow and radio doors, an intro edit so DJs can mix into it. An amapiano campaign leads with the extended mix, because the six minute version is the record; the radio edit is a courtesy copy. Servicing either genre with the other one's package is the most common unforced error in African music promotion.</p>` },
      { h2: 'Different Rooms', html: `<p>Afrobeats breaks through the diaspora party circuit: African nights, hall parties, university bookings in New York, DC, Atlanta and Houston, then mixshows, then radio. Amapiano works those diaspora floors too, but it has a second audience Afrobeats does not automatically get: the American house and Afro-house circuit, where it reads as the newest branch of a lineage those DJs already play. A good amapiano campaign pitches both doors with different language.</p>` },
      { h2: 'Different Measures of Working', html: `<p>An Afrobeats single that works shows up as repeat club plays, mixshow adds and diaspora radio spins inside the release window. An amapiano record that works shows up as DJs keeping it in rotation for months, asking for tools and folding it into mixes. Judging an amapiano campaign on week two mixshow adds, or an Afrobeats campaign on long tail set play, reads failure into records doing exactly what their format does. The practical conclusion: buy the campaign built for your record's format. Digiwaxx runs <a href="/africa/afrobeats-dj-promotion-usa">the Afrobeats campaign</a> and <a href="/africa/south-africa-amapiano-dj-promotion">the amapiano campaign</a> as separate funnels with separate lists.</p>` },
    ],
    related: [
      { href: '/africa/afrobeats-dj-promotion-usa', cat: 'Campaign', t: 'Afrobeats DJ Promotion USA' },
      { href: '/africa/south-africa-amapiano-dj-promotion', cat: 'Campaign', t: 'Amapiano & Afro-House Promotion' },
      { href: '/promotion/afrobeats-promotion', cat: 'Genre', t: 'Afrobeats Promotion' },
    ],
    cta: { kicker: 'Ready?', h2: 'Buy the right campaign.', sub: 'Two funnels, two lists, one network of 30,000+ working DJs.', href: '/africa#campaign-form', btn: 'Request a Campaign' },
  },

  {
    slug: 'how-shazam-works-for-artists',
    title: 'How Shazam Works for Artists | Digiwaxx',
    h1: 'How Shazam Works for Artists: From the Club Floor to the Charts',
    question: 'What does a Shazam actually tell an artist?',
    description: 'A Shazam is a stranger hunting down your record seconds after a DJ played it. Why that makes it one of the most honest demand signals in music.',
    author: { name: 'Kay Ali', title: 'Campaign Manager' },
    quick: 'A Shazam is a stranger, in a room, pulling out their phone to hunt down your record in the seconds after a DJ played it. Nobody Shazams a song they were sent. They Shazam a song that stopped them. That makes it one of the most honest demand signals in music, and it is built almost entirely on DJ play.',
    long: 'After nearly three decades of servicing records to DJs, we see the same sequence over and over: a record starts getting real play in rooms, and days later the artist writes to ask why their Shazam numbers are suddenly moving. The order is never the other way around. Understanding what the app actually measures tells you exactly where those numbers come from, and how to earn more of them.',
    sections: [
      { h2: 'What a Shazam Actually Is', html: `<p>The app records a few seconds of audio, converts it to an acoustic fingerprint, and matches it against a catalogue of tens of millions of tracks. What matters for an artist is not the technology but the context: a Shazam happens when someone hears a record they do not know, in a place they cannot ask, and wants it badly enough to reach for their phone. That is active discovery. It cannot be triggered by a banner ad or a playlist add someone scrolled past, and it is very hard to fake at any scale that matters, which is precisely why industry people watch it. Apple, which owns Shazam, publishes running <a href="https://www.shazam.com/charts" target="_blank" rel="noopener">discovery charts</a> from this data.</p>` },
      { h2: 'The City Charts Are the Interesting Part', html: `<p>The global chart is trivia. The city charts are intelligence. Shazam publishes top tracks per city, and because a Shazam happens where the listener is physically standing, those charts are a map of where your record is being played out and reacted to. A record can sit nowhere nationally and be top twenty in Houston, and that gap is the story: somebody in Houston is playing it, and rooms full of people want to know what it is. For a label deciding where to tour, where to buy ads or where to service harder, that is exactly the kind of signal worth acting on.</p>` },
      { h2: 'How to Earn Shazams', html: `<p>You cannot buy them in any way that survives contact with a fraud filter, and you do not need to. Shazams follow out-loud play in front of strangers: clubs, mixshows, parties, radio. The path is unglamorous and reliable, get the record into working DJs’ libraries in the formats they play from, and the discovery moments follow. One properly packaged submission through Digiwaxx reaches 30,000+ club, mixshow, mobile and radio DJs, which is another way of saying thirty thousand rooms where somebody might reach for their phone.</p>` },
    ],
    related: [
      { href: '/guides/how-songs-break-city-by-city', cat: 'Blog', t: 'How Songs Break City by City' },
      { href: '/guides/music-metrics-that-actually-matter', cat: 'Blog', t: 'The Music Metrics That Actually Matter' },
      { href: '/goals/get-club-plays', cat: 'Artist Goals', t: 'How to Get Club Plays' },
    ],
    cta: { kicker: 'Ready?', h2: 'Get played in rooms.', sub: 'Shazams follow DJ play. Your record serviced to 30,000+ working DJs, the network breaking records since 1998.', href: '/#pricing', btn: 'Promote My Record' },
  },
  {
    slug: 'mixshow-vs-rotation',
    title: 'Mixshow vs. Rotation: How Radio Airplay Works | Digiwaxx',
    h1: 'Mixshow vs. Rotation: How Radio Airplay Really Works',
    question: 'What is the difference between mixshow play and rotation?',
    description: 'The two-tier radio system nobody explains to artists: what a mixshow is, how spins get counted, and how records graduate to rotation.',
    author: { name: 'Kay Ali', title: 'Campaign Manager' },
    quick: 'A mixshow is a DJ-curated block, usually nights and weekends, where the DJ chooses the records. Rotation is the station’s programmed playlist, where a programmer chooses them. Mixshow is the tryout; rotation is the contract. Records earn the second by proving reaction in the first, and in the clubs the same DJs play.',
    long: 'Digiwaxx has serviced mixshow DJs since 1998, and the confusion never changes: an artist hears their record on the radio at midnight on a Saturday and expects to hear it at 3pm on a Tuesday. Those are two different systems with two different gatekeepers, and understanding the handoff between them is most of understanding radio.',
    sections: [
      { h2: 'What a Mixshow Is', html: `<p>The mixshow is the part of the broadcast the station hands to a DJ: a live or pre-recorded mix, blended like a club set, where new records get their first spins on air. Mixshow DJs are usually also club DJs, which is the whole point, they arrive at the station already knowing what rooms react to. That makes them the single most efficient audience for a new record: one person who can put your song both on a floor on Friday and on the air on Saturday.</p>` },
      { h2: 'How Spins Get Counted', html: `<p>Airplay is not self-reported. Monitoring services like <a href="https://www.mediabase.com/" target="_blank" rel="noopener">Mediabase</a> and <a href="https://luminatedata.com/" target="_blank" rel="noopener">Luminate</a> fingerprint broadcast audio around the clock and log every detected play, which is where airplay charts come from. A mixshow spin is a real, detected, charted spin. This is also why a clean version is non-negotiable: a record that cannot legally air never enters the count, no matter how much the DJ likes it.</p>` },
      { h2: 'How Records Graduate', html: `<p>Program directors add records to rotation when the risk is gone, and mixshow reaction is one of the main ways risk disappears: requests after a mixshow spin, floors reacting in the club, other stations’ mixshows picking it up. No servicing company can promise rotation, and you should walk away from any that does. What servicing actually does is put the record in front of the mixshow DJs with the right versions, so the tryout can happen at all. The graduation is earned by the record.</p>` },
    ],
    related: [
      { href: '/guides/how-to-get-radio-play', cat: 'Guides', t: 'How to Get Radio Play' },
      { href: '/guides/dj-data-spins-crates-charts', cat: 'Blog', t: 'DJ Data: Spins, Crates and Charts' },
      { href: '/promote/promote-my-single', cat: 'Services', t: 'Promote My Single' },
    ],
    cta: { kicker: 'Ready?', h2: 'Get in front of mixshow DJs.', sub: 'Clean versions, right formats, the DJs who bridge the club and the air. Serviced through the Digiwaxx network.', href: '/#pricing', btn: 'Promote My Record' },
  },
  {
    slug: 'dj-data-spins-crates-charts',
    title: 'DJ Data: Spins, Crates and Charts Explained | Digiwaxx',
    h1: 'The Data Trail DJs Leave: Spins, Crates, Charts and What They Tell You',
    question: 'What data do DJs generate, and how should a label read it?',
    description: 'Record pool downloads, detected spins and DJ charts are the earliest data in music. How each layer works and how to read a campaign report.',
    author: { name: 'Kay Ali', title: 'Campaign Manager' },
    quick: 'DJs generate the earliest data a record ever has: pool downloads show professional intent, detected spins show broadcast reality, and DJ charts show what working selectors are actually reaching for. A campaign report is how that trail comes back to the label, and knowing how to read one is knowing whether a record is working.',
    long: 'Streams tell you what listeners did last month. The DJ layer tells you what the people who program rooms are doing this week, before the public numbers move. Having run servicing campaigns since 1998, we treat these three layers as the record’s first honest reviews.',
    sections: [
      { h2: 'The Download Layer: Professional Intent', html: `<p>When a record is serviced through a pool, every download is a working DJ making a small professional bet: this might work in my rooms. Pool download charts are therefore a different animal from streaming charts, the audience is a few thousand professionals rather than millions of listeners, and each unit of attention costs the person something. A record that pool DJs pull hard in its first week has passed a filter most releases never even face.</p>` },
      { h2: 'The Spin Layer: Broadcast Reality', html: `<p>Downloads show intent; spins show follow-through. Monitoring services fingerprint radio around the clock, and DJ software ecosystems publish charts of what selectors are actually playing in sets. Neither can be bought convincingly, both are watched by the industry, and together they answer the only question that matters after servicing: did the people who took the record actually play it?</p>` },
      { h2: 'Reading a Campaign Report', html: `<p>A serious servicing report tells you three things: who was serviced (how many DJs, what kind, what markets), what was delivered (versions, formats), and what came back (pickups, spins where detected, DJ feedback where given). What it can never honestly contain is a guarantee. When we run a campaign at Digiwaxx, the report is written for a label meeting: it names what moved and what did not, because the honest version is the one you can plan the next single around. If a vendor’s report is a screenshot of a big number with no names attached, you paid for the screenshot.</p>` },
    ],
    related: [
      { href: '/labels', cat: 'Labels', t: 'U.S. DJ Promotion for International Labels' },
      { href: '/guides/afrobeats-dj-promotion-what-labels-need', cat: 'Blog', t: 'What Labels Need for U.S. DJ Servicing' },
      { href: '/answers/how-record-pools-work', cat: 'Straight Answers', t: 'How Record Pools Work' },
    ],
    cta: { kicker: 'Ready?', h2: 'Run a reported campaign.', sub: 'Delivery, pickup and feedback, written up per release for your team. That is what servicing with a report means.', href: '/labels#campaign-form', btn: 'Request a Campaign' },
  },
  {
    slug: 'music-metrics-that-actually-matter',
    title: 'The Music Metrics That Actually Matter | Digiwaxx',
    h1: 'Streaming Numbers Lie, Rooms Don’t: The Music Metrics That Actually Matter',
    question: 'Which music metrics matter, and which are vanity?',
    description: 'The effort test: metrics a listener has to earn, saves, searches, Shazams, repeat spins, beat any number that can be bought. Here is why.',
    author: { name: 'Kay Ali', title: 'Campaign Manager' },
    quick: 'Apply the effort test: does this number require a human to do something on purpose? Saves, name searches, Shazams, completions and repeat DJ spins pass. Raw stream counts, follower totals and playlist placements you paid strangers for do not. Platforms and A&Rs discount everything purchasable, because they can see exactly what you can see, plus everything you cannot.',
    long: 'Every week somebody brings us a record with a million streams and no fingerprints: no saves to speak of, no searches, no Shazams, no DJ who has ever heard of it. The number was bought, and everyone the artist wanted to impress can tell at a glance. The metrics worth chasing are the ones that cost the listener something.',
    sections: [
      { h2: 'Bought vs. Earned', html: `<p>Any metric that can be purchased eventually gets discounted to zero by the people it was meant to impress. Streaming platforms model normal listener behaviour and flag what deviates; label A&Rs look straight past totals to ratios, saves per listener, skip rates, where the listeners supposedly are. A bought number does not just fail to help. It marks the project, because it shows the team either did not know or hoped nobody would check.</p>` },
      { h2: 'The Effort Test', html: `<p>A save means someone decided to hear the record again. A name search means they remembered it. A Shazam means it stopped them in a room. A completion means it held them to the end, and a DJ keeping a record in rotation for weeks means it works on floors repeatedly. Each of these requires a human to spend attention on purpose, which is exactly why recommendation systems feed on them and why fraud cannot manufacture them in any pattern that looks human.</p>` },
      { h2: 'What This Means for Promotion', html: `<p>Buy the campaign that creates effortful signals, not the one that prints a number. Real-world play is the most concentrated generator of earned metrics there is: one good club or mixshow run creates searches, Shazams, saves and requests all at once, from people who chose the record with their own ears. It is why our whole service is aimed at working DJs, and why every page on this site says the same thing: no bots, no bought streams, no empty playlist promises.</p>` },
    ],
    related: [
      { href: '/guides/how-shazam-works-for-artists', cat: 'Blog', t: 'How Shazam Works for Artists' },
      { href: '/answers/is-spotify-playlist-promotion-worth-it', cat: 'Straight Answers', t: 'Is Playlist Promotion Worth It?' },
      { href: '/guides/my-song-isnt-getting-streams', cat: 'Guides', t: 'My Song Isn’t Getting Streams' },
    ],
    cta: { kicker: 'Ready?', h2: 'Earn signals that count.', sub: 'Real DJs, real rooms, real reactions. The metrics follow the floors.', href: '/#pricing', btn: 'Promote My Record' },
  },
  {
    slug: 'how-songs-break-city-by-city',
    title: 'How Songs Break City by City | Digiwaxx',
    h1: 'How Songs Break City by City: Viral Charts, Shazam Maps and Local Heat',
    question: 'Why do songs blow up in one city before everywhere else?',
    description: 'Charts are national but breakouts are local. How viral and city charts work, and why the ignition point is almost always a DJ booth.',
    author: { name: 'Kay Ali', title: 'Campaign Manager' },
    quick: 'Breakouts are local before they are national: a record ignites in the rooms of one metro, Houston, Mexico City, Lagos, London, and travels outward through DJs, diasporas and playlists. Viral charts measure that early velocity per market, Shazam maps it per city, and the ignition point is almost always a booth.',
    long: 'The charts everyone quotes are national summaries of things that happened locally weeks earlier. Having serviced records into American rooms since 1998, we watch the local layer, because by the time a record is a national story, the cities already voted.',
    sections: [
      { h2: 'Viral Charts Measure Velocity, Not Size', html: `<p>Spotify publishes two families of <a href="https://charts.spotify.com/" target="_blank" rel="noopener">charts</a> per market: the Top charts, which rank sheer volume, and the Viral charts, which rank momentum, how fast a record is being shared and discovered relative to its size. A song nobody has heard of can top a Viral chart in one country while sitting nowhere on any Top chart. That is not a bug; it is the entire value. Viral charts are per-market by design, which makes them an early-warning system for where a record is catching.</p>` },
      { h2: 'The City Layer', html: `<p>Underneath national markets is the city layer, and it is where breakouts are actually visible. Shazam’s city charts show what rooms in a specific metro are reacting to. Diaspora geography explains most of the pattern: Afrobeats surges through Houston and DC, regional mexicano through Los Angeles and Dallas, amapiano through the dance floors of New York and London, because those are the cities where those communities fill rooms every weekend. A record does not break in a country. It breaks in specific rooms in specific cities, and the data has finally caught up to that fact.</p>` },
      { h2: 'Working a Record City by City', html: `<p>The practical playbook falls out of the mechanics: choose two or three lead cities where your audience already dances, service the DJs who run those rooms, watch the local signals, searches, Shazams, requests, repeat spins, and widen to the next cities with the first ones as proof. It is how we structure campaigns for international labels, market by market rather than one undifferentiated blast, because the blast wins nowhere and the concentrated push wins somewhere, and somewhere is what travels.</p>` },
    ],
    related: [
      { href: '/africa', cat: 'Campaigns', t: 'African Music Promotion Hub' },
      { href: '/guides/lagos-accra-to-new-york-dj-promotion-plan', cat: 'Blog', t: 'Lagos to New York: A DJ Promotion Plan' },
      { href: '/guides/how-shazam-works-for-artists', cat: 'Blog', t: 'How Shazam Works for Artists' },
    ],
    cta: { kicker: 'Ready?', h2: 'Run it city by city.', sub: 'Lead cities chosen for your record, DJs serviced market by market, and a report on where it caught.', href: '/africa#campaign-form', btn: 'Request a Campaign' },
  },
];

/* --------------------------------------------------------------- rendering */

const TRIO_HREFLANG = `    <link rel="alternate" hreflang="ko" href="${SITE}/ko/us-dj-promotion-for-korean-labels">
    <link rel="alternate" hreflang="es" href="${SITE}/es/promocion-dj-estados-unidos">
    <link rel="alternate" hreflang="en" href="${SITE}/labels">
    <link rel="alternate" hreflang="x-default" href="${SITE}/labels">`;

/* ------------------------------------------------------------- contacts
 * The named humans behind the funnel, on every page. Kawani runs
 * campaigns; the partner desk handles distributors and partnerships.
 * Labels deciding whether to wire money abroad want a name that answers,
 * so the card sits right under the form and the same pair rides in the
 * footer sitewide.
 */
const CONTACT_STRINGS = {
  en: { title: 'Who to Contact', campaigns: 'Campaigns', partners: 'Partnerships & distributors', artists: 'Artists' },
  'en-GB': { title: 'Who to Contact', campaigns: 'Campaigns', partners: 'Partnerships & distributors', artists: 'Artists' },
  es: { title: 'A quién contactar', campaigns: 'Campañas', partners: 'Alianzas y distribuidoras', artists: 'Artistas' },
  'pt-BR': { title: 'Com quem falar', campaigns: 'Campanhas', partners: 'Parcerias e distribuidoras', artists: 'Artistas' },
  fr: { title: 'Qui contacter', campaigns: 'Campagnes', partners: 'Partenariats et distributeurs', artists: 'Artistes' },
  ko: { title: '문의처', campaigns: '캠페인 문의', partners: '파트너십 및 유통사', artists: '아티스트 문의' },
  ja: { title: 'お問い合わせ先', campaigns: 'キャンペーン', partners: 'パートナーシップ', artists: 'アーティスト' },
  id: { title: 'Kontak', campaigns: 'Kampanye', partners: 'Kemitraan & distributor', artists: 'Artis' },
};

function contactCard(lang) {
  const t = CONTACT_STRINGS[lang] || CONTACT_STRINGS.en;
  return `<section class="body-section contact-card">
  <h2>${esc(t.title)}</h2>
  <p><b>${esc(t.campaigns)}:</b> Kay Ali, Campaign Manager · <a href="mailto:kawani@digiwaxx.com">kawani@digiwaxx.com</a><br>
  <b>${esc(t.partners)}:</b> “CL” Llewellyn, Partner Manager · <a href="mailto:cl@digiwaxx.com">cl@digiwaxx.com</a><br>
  <b>${esc(t.artists)}:</b> Will Gordon, Artist Manager · <a href="mailto:will@digiwaxx.com">will@digiwaxx.com</a></p>
</section>`;
}

function langRow(p) {
  if (!p.family) return '';
  const family = p.family === 'africa' ? AFRICA_FAMILY : TRIO_FAMILY;
  const self = `/${p.slug}`;
  return `<div class="lang-row">
  ${family.map((f) => (f.href === self ? `<span>${esc(f.label)}</span>` : `<a href="${attr(f.href)}">${esc(f.label)}</a>`)).join('\n  ')}
</div>`;
}

function convertPage(p) {
  const url = `${SITE}/${p.slug}`;
  const crumbs = [['Digiwaxx', '/'], p.family === 'africa' && p.slug !== 'africa' ? ['For African Labels', '/africa'] : null, [p.crumb[0], p.crumb[1]]].filter(Boolean);
  const breadcrumbHtml = p.family === 'africa' && p.slug !== 'africa'
    ? `<a href="/">Home</a> / <a href="/africa">Africa</a> / ${esc(p.crumb[0])}`
    : `<a href="/">Home</a> / ${esc(p.crumb[0])}`;

  return `<!DOCTYPE html>
<html lang="${p.lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(p.title)}</title>
    <meta name="description" content="${attr(p.description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${attr(p.title)}">
    <meta property="og:description" content="${attr(p.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="Digiwaxx">
    <meta property="og:locale" content="${ogLocale(p.slug, p.lang)}">
    <meta property="og:image" content="${SITE}/assets/share-card.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${attr(CARD_ALT)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(p.title)}">
    <meta name="twitter:description" content="${attr(p.description)}">
    <meta name="twitter:image" content="${SITE}/assets/share-card.png">
    <meta name="twitter:image:alt" content="${attr(CARD_ALT)}">
    <meta name="robots" content="max-image-preview:large">
    <meta name="theme-color" content="#1a0a18">
${FEED_LINK}
${p.family === 'trio' ? TRIO_HREFLANG + '\n' : ''}${HEAD_FONTS}
${FORM_CSS}
<script type="application/ld+json">${serviceLd(p)}</script>
<script type="application/ld+json">${breadcrumbLd(crumbs)}</script>
</head>
<body class="light-page">

${NAV}
<main class="cmain">
  <div class="breadcrumb">
    ${breadcrumbHtml}
  </div>
  <article>
    ${langRow(p)}
    <h1>${p.h1}</h1>
    <p class="page-question">${esc(p.question)}</p>

<div class="quick-answer">
  <p class="qa-label">${esc(p.qaLabel || 'Quick Answer')}</p>
  <p class="qa-text">${esc(p.quick)}</p>
</div>
<p class="long-answer">${p.long}</p>

${p.slug === 'africa' ? related(p.familyHeading, AFRICA_FAMILY.filter((f) => f.href !== '/africa').map((f) => ({ href: f.href, cat: 'Campaign', t: f.label === 'Afrobeats USA' ? 'Afrobeats DJ Promotion USA' : `${f.label}: U.S. DJ Promotion` }))) + '\n' : ''}
${p.sections.map((s) => `<section class="body-section">
  <h2>${s.h2}</h2>
${s.html}
</section>`).join('\n\n')}

${statsRow(p.stats)}

${campaignForm(p)}\n\n${contactCard(p.lang)}

${taxonomyBlocks('/' + p.slug)}

${p.relatedBlocks(p).join('\n\n')}

<section class="cta-block">
  <p class="cta-kicker">${esc(p.artistCta.kicker)}</p>
  <h2>${esc(p.artistCta.h2)}</h2>
  <p class="cta-sub">${esc(p.artistCta.sub)}</p>
  <a class="cta-btn" href="/#pricing">${esc(p.artistCta.btn)} &rarr;</a>
  <p class="cta-tiers">Starter $99 &middot; Pro $149 &middot; Elite $199, one-time payment, no contracts.</p>
</section>
  </article>
</main>

${FOOTER}
</body>
</html>
`;
}

function guidePage(g) {
  const url = `${SITE}/guides/${g.slug}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(g.title)}</title>
    <meta name="description" content="${attr(g.description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${attr(g.title)}">
    <meta property="og:description" content="${attr(g.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="Digiwaxx">
    <meta property="og:locale" content="en_US">
    <meta property="article:published_time" content="2026-08-25T00:00:00+00:00">
    <meta property="article:modified_time" content="2026-08-25T00:00:00+00:00">
    <meta property="article:publisher" content="${SITE}">
    <meta property="og:image" content="${SITE}/assets/share-card.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${attr(CARD_ALT)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(g.title)}">
    <meta name="twitter:description" content="${attr(g.description)}">
    <meta name="twitter:image" content="${SITE}/assets/share-card.png">
    <meta name="twitter:image:alt" content="${attr(CARD_ALT)}">
    <meta name="robots" content="max-image-preview:large">
    <meta name="theme-color" content="#1a0a18">
${FEED_LINK}
${HEAD_FONTS}
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: g.h1, description: g.description, url,
    image: { '@type': 'ImageObject', url: `${SITE}/assets/share-card.png`, width: 1200, height: 630 },
    datePublished: '2026-08-25', dateModified: '2026-08-25',
    author: g.author ? { '@type': 'Person', name: g.author.name, jobTitle: g.author.title, worksFor: { '@id': `${SITE}#organization` }, url: `${SITE}/contact` } : { '@id': `${SITE}#organization` }, publisher: { '@id': `${SITE}#organization` },
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': `${SITE}#website` }, inLanguage: 'en-US',
    articleSection: 'Release & Promotion Guides',
  })}</script>
<script type="application/ld+json">${breadcrumbLd([['Digiwaxx', '/'], ['University', '/university'], ['Guides', '/guides'], [g.h1, `/guides/${g.slug}`]])}</script>
</head>
<body class="light-page">

${NAV}
<main class="cmain">
  <div class="breadcrumb">
    <a href="/">Home</a> / <a href="/university">University</a> / <a href="/guides">Guides</a>
  </div>
  <article>
    <h1>${esc(g.h1)}</h1>
    <p class="page-question">${esc(g.question)}</p>
${g.author ? `    <p class="guide-byline">By <b>${esc(g.author.name)}</b>, ${esc(g.author.title)} at Digiwaxx &middot; August 25, 2026</p>` : ''}

<div class="quick-answer">
  <p class="qa-label">Quick Answer</p>
  <p class="qa-text">${esc(g.quick)}</p>
</div>
<p class="long-answer">${g.long}</p>

${g.sections.map((s) => `<section class="body-section">
  <h2>${s.h2}</h2>
${s.html}
</section>`).join('\n\n')}

${statsRow([STAT_DJS, STAT_SINCE, STAT_UPLOADS])}

${related('Keep Going', g.related)}

<section class="cta-block">
  <p class="cta-kicker">${esc(g.cta.kicker)}</p>
  <h2>${esc(g.cta.h2)}</h2>
  <p class="cta-sub">${esc(g.cta.sub)}</p>
  <a class="cta-btn" href="${attr(g.cta.href)}">${esc(g.cta.btn)} &rarr;</a>
</section>
  </article>
</main>

${FOOTER}
</body>
</html>
`;
}

/* ----------------------------------------------------------- contact page
 * The one page the footer's Contact link points at. The three desks with
 * their names and addresses live here, and only here plus the card under
 * each campaign form; the footer carries the link, not the rolodex.
 */
function contactPageHtml() {
  const url = `${SITE}/contact`;
  const title = 'Contact Digiwaxx';
  const desc = 'Who to contact at Digiwaxx: Kay Ali for campaigns, "CL" Llewellyn for partnerships and distributors, Will Gordon for artists. Or call 1-800-665-1259.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${attr(desc)}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${attr(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="Digiwaxx">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="${SITE}/assets/share-card.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${attr(CARD_ALT)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${attr(desc)}">
    <meta name="twitter:image" content="${SITE}/assets/share-card.png">
    <meta name="twitter:image:alt" content="${attr(CARD_ALT)}">
    <meta name="robots" content="max-image-preview:large">
    <meta name="theme-color" content="#1a0a18">
${FEED_LINK}
${HEAD_FONTS}
${FORM_CSS}
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ContactPage',
    name: title, url, description: desc,
    isPartOf: { '@id': `${SITE}#website` }, inLanguage: 'en-US',
  })}</script>
<script type="application/ld+json">${breadcrumbLd([['Digiwaxx', '/'], ['Contact', '/contact']])}</script>
</head>
<body class="light-page">

${NAV}
<main class="cmain">
  <div class="breadcrumb">
    <a href="/">Home</a> / Contact
  </div>
  <article>
    <h1>Contact Digiwaxx</h1>
    <p class="page-question">Three desks. Write to the one that fits, and a person answers within two business days.</p>

<section class="body-section contact-card">
  <h2>Campaigns</h2>
  <p><b>Kay Ali</b>, Campaign Manager<br>
  <a href="mailto:kawani@digiwaxx.com">kawani@digiwaxx.com</a></p>
  <p style="margin-top:0.6rem">Label, management and distributor campaigns: U.S. DJ servicing, international releases, media kits and campaign reporting.</p>
</section>

<section class="body-section contact-card">
  <h2>Partnerships &amp; Distributors</h2>
  <p><b>“CL” Llewellyn</b>, Partner Manager<br>
  <a href="mailto:cl@digiwaxx.com">cl@digiwaxx.com</a></p>
  <p style="margin-top:0.6rem">Distribution deals, platform and brand partnerships, and anything that is bigger than one campaign.</p>
</section>

<section class="body-section contact-card">
  <h2>Artists</h2>
  <p><b>Will Gordon</b>, Artist Manager<br>
  <a href="mailto:will@digiwaxx.com">will@digiwaxx.com</a></p>
  <p style="margin-top:0.6rem">Questions about the standard campaign, your submission, or what package fits your record.</p>
</section>

<section class="body-section">
  <h2>Prefer the Phone?</h2>
  <p><a href="tel:+18006651259"><b>1-(800) 665-1259</b></a></p>
</section>

<section class="body-section" id="contact-form">
  <h2>Or Send a Message</h2>
  <form id="cf" novalidate>
    <div class="cf-grid">
      <div class="calc-field"><label for="cf-name">Your name</label><input id="cf-name" name="name" type="text" required></div>
      <div class="calc-field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" required></div>
      <div class="calc-field"><label for="cf-company">Company <span class="cf-opt">optional</span></label><input id="cf-company" name="company" type="text"></div>
      <div class="calc-field"><label for="cf-intent">Topic</label><select id="cf-intent" name="intent"><option>Campaigns</option><option>Partnerships &amp; distribution</option><option>Artist support</option><option>Press</option><option>Other</option></select></div>
      <div class="calc-field cf-wide"><label for="cf-message">Message</label><textarea id="cf-message" name="message" required></textarea></div>
    </div>
    <input class="cf-hp" type="text" name="company_hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="cta-btn cf-btn" type="submit">Send Message &rarr;</button>
    <p class="cf-note" id="cf-note">A person replies within two business days.</p>
  </form>
</section>
<script>(function(){
  var form=document.getElementById('cf');if(!form)return;
  var note=document.getElementById('cf-note'),btn=form.querySelector('button'),busy=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();if(busy)return;
    if(!form.reportValidity||form.reportValidity()){
      busy=true;btn.disabled=true;var was=btn.textContent;btn.textContent='Sending…';
      var d={page:'/contact'};new FormData(form).forEach(function(v,k){d[k]=v;});
      if(!d.company)d.company=d.name;
      fetch('/api/campaign-leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)})
        .then(function(r){return r.json();})
        .then(function(j){if(j&&j.ok){form.reset();note.textContent='Got it. A person replies within two business days.';}else{note.textContent=(j&&j.error)||'We could not send that. Email one of the desks above instead.';}})
        .catch(function(){note.textContent='Network trouble. Email one of the desks above instead.';})
        .finally(function(){busy=false;btn.disabled=false;btn.textContent=was;});
    } else { note.textContent='Please fill in the required fields.'; }
  });
})();</script>

<section class="body-section">
  <h2>Find Us</h2>
  <div style="position:relative;overflow:hidden;border-radius:16px;border:1px solid #f0e0e9;padding-top:56.25%">
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d386750.3451761157!2d-73.91186094999999!3d40.773304949999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259d11c03ea23%3A0x4cac38765f7bc59b!2sDigiwaxx%20DJ%20Service!5e0!3m2!1sen!2sus!4v1787699953048!5m2!1sen!2sus" style="position:absolute;inset:0;width:100%;height:100%;border:0" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="Digiwaxx DJ Service on Google Maps"></iframe>
  </div>
</section>

${related('Start Something', [
    { href: '/#pricing', cat: 'Artists', t: 'Submit Your Record, from $99' },
    { href: '/labels', cat: 'Labels', t: 'Request a Label Campaign' },
    { href: '/africa', cat: 'Africa', t: 'African Music Promotion Hub' },
    { href: '/university', cat: 'Free', t: 'Digiwaxx University' },
  ])}
  </article>
</main>

${FOOTER}
</body>
</html>
`;
}

/* ------------------------------------------------------------------- write */

let written = 0;
for (const p of PAGES) {
  const out = path.join(ROOT, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, convertPage(p));
  console.log('wrote', p.file);
  written++;
}
for (const g of GUIDES) {
  const out = path.join(ROOT, 'guides', `${g.slug}.html`);
  fs.writeFileSync(out, guidePage(g));
  console.log('wrote', `guides/${g.slug}.html`);
  written++;
}
fs.writeFileSync(path.join(ROOT, 'contact.html'), contactPageHtml());
console.log('wrote contact.html');
written++;
console.log(`${written} pages`);
