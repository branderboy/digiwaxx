// Layer 5 — Programmatic pages: Genre × City. Composed from genre blurbs
// plus city scene data from cities.js. Add a pair to COMBOS → page appears.
const { CITIES } = require('./cities');

const GENRES = {
  'hip-hop': {
    name: 'Hip Hop',
    how: 'Hip hop breaks through DJs before anything else — club tests, mixshow spins, and peer-to-peer DJ co-signs move a rap record long before playlists commit. The promotion order is: DJ service, room reaction, content from the rooms, then radio and playlists on top of the proof.',
    djNote: 'Rap DJs need clean, dirty, and instrumental versions — mixshows cannot touch an explicit-only file, and instrumentals feed freestyles and DJ edits that extend a record’s life.',
  },
  'rnb': {
    name: 'R&B',
    how: 'R&B moves through a distinct circuit: grown-and-sexy club nights, day parties, steppers sets, quiet-storm radio hours, and mood playlists. It rewards consistency and catalog — R&B listeners become deep fans — and DJs who program these rooms are intensely loyal to records that work.',
    djNote: 'R&B DJs prize records that hold a vibe: correct tempo tags and a clean version for early evening and radio are essential, and acoustic or slowed alternates give DJs extra tools.',
  },
  'afrobeats': {
    name: 'Afrobeats',
    how: 'Afrobeats breaks through the diaspora party circuit — African student associations, diaspora club nights, Caribbean-adjacent rooms — where specialist DJs hold enormous sway. A record that wins the diaspora parties in US cities feeds back into the global afrobeats conversation, and platforms like Audiomack amplify it across African markets.',
    djNote: 'Afrobeats DJs blend across dancehall, amapiano, and hip hop — a record that mixes cleanly into those lanes (and arrives with an instrumental) gets more work.',
  },
  'reggae': {
    name: 'Reggae & Dancehall',
    how: 'Reggae and dancehall run on sound-system culture: selectors, juggling sets, and dubplates. The Caribbean diaspora circuit in major cities decides what runs, and specialist selectors — not general playlists — are the gatekeepers. Riddim culture means instrumentals and clean versions are working currency.',
    djNote: 'Selectors expect proper service: clean edits for radio jugglings, instrumentals for dubs, and correct tempo/riddim info. A record embraced by a city’s selector community gets played for years, not weeks.',
  },
  'drill': {
    name: 'Drill',
    how: 'Drill is hyper-local by nature — records rep blocks and boroughs — and it moves through a young club-and-party circuit plus a voracious online ecosystem of reaction channels and edits. The DJs who run drill parties and mixshow segments are the bridge from neighborhood anthem to city-wide record.',
    djNote: 'Clean versions are decisive in drill: radio and many rooms cannot run the explicit, and the records that cross over are the ones DJs can actually program everywhere.',
  },
  'latin': {
    name: 'Latin Music',
    how: 'Latin music breaks through a full-stack ecosystem of its own: Latin club nights, Spanish-language radio, and bilingual open-format DJs who now treat reggaeton and urbano as core repertoire. Lane precision matters — urbano, regional mexican, and tropical each have their own rooms and tastemakers.',
    djNote: 'Lane-correct tags are essential so DJs file the record right, plus clean edits for radio and mixable structure. Bilingual records should be packaged for both markets they serve.',
  },
  'gospel': {
    name: 'Gospel',
    how: 'Gospel moves through the most loyal infrastructure in music: gospel radio and announcers with decades of trust, the church and conference circuit, and gospel DJs running Sunday shows, brunches, and events. Relationships and message-fit matter more than in any other genre — and support, once earned, lasts.',
    djNote: 'Broadcast-clean by definition, correct metadata for chart tracking, and a one-sheet with your story — gospel programmers care who the artist is, not just how the record sounds.',
  },
};

// city extras for combos that reference sub-markets
const COMBOS = [
  { genre: 'hip-hop', city: 'atlanta', featured: true },
  { genre: 'hip-hop', city: 'chicago' },
  { genre: 'hip-hop', city: 'houston' },
  { genre: 'hip-hop', city: 'miami' },
  { genre: 'hip-hop', city: 'los-angeles' },
  { genre: 'hip-hop', city: 'new-york' },
  { genre: 'hip-hop', city: 'philadelphia' },
  { genre: 'hip-hop', city: 'detroit' },
  { genre: 'hip-hop', city: 'memphis' },
  { genre: 'hip-hop', city: 'new-orleans' },
  { genre: 'hip-hop', city: 'dallas' },
  { genre: 'hip-hop', city: 'washington-dc', citySuffix: 'the DMV', slugOverride: 'hip-hop-promotion-dmv', title: 'Hip Hop Promotion in the DMV' },
  { genre: 'hip-hop', city: 'oakland', citySuffix: 'the Bay Area', slugOverride: 'hip-hop-promotion-bay-area', title: 'Hip Hop Promotion in the Bay Area' },
  { genre: 'rnb', city: 'atlanta' },
  { genre: 'rnb', city: 'chicago' },
  { genre: 'rnb', city: 'houston' },
  { genre: 'rnb', city: 'washington-dc', citySuffix: 'DMV', slugOverride: 'rnb-promotion-dmv', title: 'R&B Promotion in the DMV' },
  { genre: 'afrobeats', city: 'houston' },
  { genre: 'afrobeats', city: 'new-york' },
  { genre: 'afrobeats', city: 'atlanta' },
  { genre: 'afrobeats', city: 'washington-dc', citySuffix: 'the DMV', slugOverride: 'afrobeats-promotion-dmv', title: 'Afrobeats Promotion in the DMV' },
  { genre: 'reggae', city: 'new-york' },
  { genre: 'reggae', city: 'miami' },
  { genre: 'drill', city: 'new-york', citySuffix: 'Brooklyn', slugOverride: 'drill-promotion-brooklyn', title: 'Drill Music Promotion in Brooklyn' },
  { genre: 'drill', city: 'chicago' },
  { genre: 'latin', city: 'miami' },
  { genre: 'latin', city: 'houston' },
  { genre: 'gospel', city: 'atlanta' },
  { genre: 'gospel', city: 'chicago' },
];

function comboPage(combo) {
  const g = GENRES[combo.genre];
  const c = CITIES.find((x) => x.slug === combo.city);
  const cityName = combo.citySuffix || c.name;
  const slug = combo.slugOverride || `${combo.genre}-promotion-${c.slug}`;
  const title = combo.title || `${g.name} Promotion in ${cityName}`;
  return {
    slug,
    category: 'promotion',
    featured: combo.featured,
    title,
    navLabel: `${g.name} — ${cityName}`,
    metaTitle: `${title}: DJs, Clubs & Radio | Digiwaxx`,
    description: `How ${g.name.toLowerCase()} records break in ${cityName}: the DJ circuit, the rooms that matter, and how to get your record serviced to ${cityName} DJs.`,
    question: `How do I promote a ${g.name.toLowerCase()} record in ${cityName}?`,
    quickAnswer: `Promote ${g.name.toLowerCase()} in ${cityName} through its DJ circuit: service the record properly (clean, dirty, instrumental), get it into the crates of the DJs who run ${cityName}'s ${g.name.toLowerCase()} rooms, and turn every room reaction into content, radio pitches, and bookings.`,
    longAnswer: `${g.how}`,
    sections: [
      { h2: `The ${cityName} Side of the Equation`, html: `<p>${c.scene}</p><p>${c.djCulture}</p>` },
      { h2: `What ${g.name} DJs Need From Your Record`, html: `<p>${g.djNote}</p><p>Packaging is the pass/fail gate: a properly serviced record — right versions, right tags, professional master — is the difference between a DJ who can work your song tonight and one who closes the file.</p>` },
      {
        h2: `The Play in ${cityName}`,
        html: `<ol>
<li><strong>Service wide, then read the map:</strong> one submission through the Digiwaxx pool reaches working DJs in ${cityName} and every other market — ${'30,000+'} DJs since 1998. Watch where the record reacts.</li>
<li><strong>Concentrate on reaction:</strong> when ${cityName} rooms respond, pour into that market — clips, venue tags, local mixshow pitches with local proof.</li>
<li><strong>Convert:</strong> room reaction becomes bookings, radio looks, and the geographic engagement spike streaming algorithms treat as authentic demand.</li>
</ol>`,
      },
    ],
    faq: [
      { q: `Who are the most important DJs for ${g.name.toLowerCase()} in ${cityName}?`, a: `The DJs who program the rooms where ${g.name.toLowerCase()} actually lives locally — club residencies, the party circuit, and the mixshow slots on local radio. Pool service reaches them at scale; personal relationships with the handful closest to your scene deepen it.` },
      { q: `Can an artist outside ${cityName} break a record there?`, a: `Yes — records travel through DJ networks, not zip codes. Service the market, and if ${cityName} reacts, treat it like a second hometown: visit, book, and feed the city that is feeding you.` },
      { q: `What versions of my record do I need?`, a: `Minimum: clean, dirty, and instrumental, professionally mastered with correct metadata. ${g.djNote}` },
    ],
    related: [
      `music-promotion-${c.slug}`,
      'how-to-get-djs-to-play-my-song',
      { 'hip-hop': 'how-to-promote-a-rap-song', 'gospel': 'how-to-get-radio-play', 'latin': 'latin-music-promotion' }[combo.genre] || 'get-club-plays',
      'does-dj-promotion-still-work',
    ],
  };
}

module.exports = COMBOS.map(comboPage);
