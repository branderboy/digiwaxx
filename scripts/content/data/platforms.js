// Layer 4 — Entity SEO: platform hub pages. Each platform is an entity page
// built from shared structure + per-platform specifics.
const PLATFORMS = [
  {
    slug: 'spotify-playlist-promotion',
    name: 'Spotify',
    title: 'Spotify Playlist Promotion',
    navLabel: 'Spotify Promotion',
    featured: true,
    description: 'How Spotify playlist promotion really works: editorial, curator, and algorithmic playlists, the engagement signals that matter, and the legitimate playbook.',
    question: 'How do you promote a song on Spotify?',
    quickAnswer: 'Promote on Spotify by working its three playlist layers: pitch editorial free via Spotify for Artists pre-release, earn independent curator adds with momentum and fit, and trigger algorithmic playlists (Release Radar, Discover Weekly, Radio) through saves, low skips, and searches.',
    intro: 'Spotify is the biggest discovery surface in streaming, and almost all of its discovery runs through playlists — editorial, user/curator, and algorithmic. The mistake artists make is treating "Spotify promotion" as buying placements. The durable version is engineering demand signals the platform rewards.',
    specifics: [
      {
        h2: 'The Three Playlist Layers',
        html: `<ul>
<li><strong>Editorial</strong> (RapCaviar, New Music Friday): pitched via Spotify for Artists 3+ weeks pre-release; competitive but free, and pitching also secures Release Radar delivery to your followers</li>
<li><strong>Independent curator</strong> playlists: won with fit and proof of momentum — never bought as guaranteed placements (policy violation, usually botted)</li>
<li><strong>Algorithmic</strong> (Release Radar, Discover Weekly, Radio, Autoplay): the biggest sustained driver — triggered by save rate, completion, repeat listens, and name-search</li>
</ul>`
      },
      {
        h2: 'Feeding the Algorithm From Outside',
        html: `<p>Spotify's algorithm amplifies demand it can measure — and much of that demand starts off-platform. Club spins and mixshow play create Shazams, name searches, and saves; short-form content drives profile visits; real-world reaction converts to exactly the signals Discover Weekly and Radio feed on. Servicing your record to ${'30,000+'} DJs is, functionally, a Spotify strategy.</p>`
      },
    ],
    faq: [
      { q: 'How do I pitch Spotify editorial playlists?', a: 'Through Spotify for Artists: submit one unreleased song at least 3–4 weeks before release, filling in genre, mood, location, and story completely. Every artist gets the same pitch tool — lead time and a moving record are what improve odds.' },
      { q: 'What is a good save rate on Spotify?', a: 'Rough rule of thumb: save rates above ~5–10% of listeners signal strong engagement. Watch it in Spotify for Artists and lead your promotion with the songs that earn the best ratios.' },
      { q: 'Can you pay Spotify for promotion?', a: 'Spotify offers official tools like Marquee and Discovery Mode in some markets — those are legitimate. Paying third parties for guaranteed playlist placement violates platform rules and risks penalties.' },
    ],
    related: ['is-spotify-playlist-promotion-worth-it', 'spotify-algorithm-tips', 'grow-spotify-listeners', 'how-to-get-more-playlist-adds'],
  },
  {
    slug: 'apple-music-promotion',
    name: 'Apple Music',
    title: 'Apple Music Promotion',
    navLabel: 'Apple Music Promotion',
    description: 'How to promote your music on Apple Music: Apple Music for Artists, editorial pitching, Shazam’s role, and why Apple listeners are worth targeting.',
    question: 'How do you promote a song on Apple Music?',
    quickAnswer: 'Promote on Apple Music by claiming Apple Music for Artists, pitching editorial through your distributor’s delivery lead time, and feeding Shazam — which Apple owns and watches. Apple’s paying listeners generate higher per-stream royalties and strong chart signals.',
    intro: 'Apple Music is the second pillar of streaming — a fully paid subscriber base, meaningfully higher per-stream payouts than free tiers, and charts the industry still watches closely. Its discovery culture is more editorial and less algorithmic than Spotify’s, which changes the playbook.',
    specifics: [
      {
        h2: 'What Makes Apple Music Different',
        html: `<ul>
<li><strong>All-paid audience:</strong> every listener is a subscriber — streams pay better and skew toward intentional listening</li>
<li><strong>Editorial weight:</strong> human-programmed playlists and radio (Apple Music 1) carry more of the discovery load than on Spotify</li>
<li><strong>Shazam integration:</strong> Apple owns Shazam; a record getting Shazamed in clubs feeds directly into Apple’s discovery ecosystem and city charts</li>
<li><strong>Charts that matter:</strong> Apple Music chart positions remain a currency with radio programmers and press</li>
</ul>`
      },
      {
        h2: 'The Club-to-Shazam-to-Apple Pipeline',
        html: `<p>Nobody Shazams a song from a link — they Shazam it from a room. Every club and mixshow spin your record earns produces Shazam pings tied to a city, and those pings move Shazam city charts and Apple's discovery surfaces. For club-driven genres, DJ service is the most direct Apple Music strategy that exists: it manufactures the exact moment (great song, unknown name, phone comes out) the platform is built to capture.</p>`
      },
    ],
    faq: [
      { q: 'How do I get on Apple Music editorial playlists?', a: 'Deliver early through your distributor (some offer direct Apple pitching), complete your Apple Music for Artists profile, and build the story — Apple editors respond to records with visible momentum: Shazam activity, chart movement, press.' },
      { q: 'Does Apple Music pay more than Spotify?', a: 'Per stream, generally yes — Apple has cited roughly a penny per stream, versus a fraction of that on ad-supported tiers elsewhere. A fanbase that streams on Apple is disproportionately valuable.' },
    ],
    related: ['spotify-playlist-promotion', 'grow-spotify-listeners', 'does-dj-promotion-still-work', 'get-radio-spins'],
  },
  {
    slug: 'audiomack-promotion',
    name: 'Audiomack',
    title: 'Audiomack Promotion',
    navLabel: 'Audiomack Promotion',
    description: 'How to promote music on Audiomack: free unlimited uploads, trending charts, the hip hop and afrobeats audience, and using Audiomack as your testing ground.',
    question: 'How do you promote a song on Audiomack?',
    quickAnswer: 'Use Audiomack as your fast lane: free unlimited uploads, a hip hop/afrobeats-heavy audience, trending charts an independent can realistically crack, and creator tools for monetization. Drop early versions and freestyles there, then push winners everywhere.',
    intro: 'Audiomack occupies a specific and valuable lane: a streaming platform built around hip hop, R&B, afrobeats, and the mixtape culture the majors abandoned — with free unlimited uploads and charts that independent records actually crack. Used correctly, it is both a promotion surface and an A&R tool for your own catalog.',
    specifics: [
      {
        h2: 'Why Audiomack Belongs in Your Stack',
        html: `<ul>
<li><strong>Zero-cost, instant uploads:</strong> no distributor lead time — test freestyles, remixes, and loosies same-day</li>
<li><strong>A culture-matched audience:</strong> the platform's center of gravity is exactly the genres that break through DJs — hip hop, afrobeats, dancehall, R&B</li>
<li><strong>Crackable charts:</strong> trending placements are within reach for a moving independent record, and they screenshot well for socials and pitches</li>
<li><strong>African market reach:</strong> Audiomack is a leading platform in several African markets — critical if you touch afrobeats or amapiano</li>
</ul>`
      },
      {
        h2: 'The Testing-Ground Play',
        html: `<p>Because uploads are free and instant, Audiomack is where you learn before you spend: drop three loosies, watch plays and re-ups, and take the reactor into full DSP release and DJ service. The same real-world loop applies — records spinning in clubs send searches to every platform, and a trending badge on Audiomack becomes one more receipt in your curator and radio pitches.</p>`
      },
    ],
    faq: [
      { q: 'Is Audiomack free for artists?', a: 'Yes — uploading is free and unlimited, with monetization available through its creator program. That makes it the lowest-friction platform for testing new material.' },
      { q: 'Does Audiomack replace Spotify and Apple Music?', a: 'No — it complements them. Use Audiomack for speed, testing, and its culture-specific audience; use full distribution for the records you are working seriously.' },
    ],
    related: ['spotify-playlist-promotion', 'how-to-promote-a-rap-song', 'afrobeats-promotion-houston', 'how-many-songs-should-i-release'],
  },
  {
    slug: 'tidal-promotion',
    name: 'Tidal',
    title: 'Tidal Promotion',
    navLabel: 'Tidal Promotion',
    description: 'How to promote music on Tidal: higher payouts, editorial playlists, Tidal Rising for emerging artists, and where Tidal fits in an independent release strategy.',
    question: 'How do you promote a song on Tidal?',
    quickAnswer: 'Promote on Tidal by ensuring clean delivery through your distributor, targeting its editorial and Tidal Rising programs for emerging artists, and leaning on its artist-friendly positioning — higher payouts and an audiophile, culture-focused audience.',
    intro: 'Tidal is smaller than Spotify or Apple, but strategically interesting for independents: artist-friendly economics, an audience that pays for quality, and editorial programs — notably Tidal Rising — explicitly built to spotlight emerging artists rather than chase what is already big.',
    specifics: [
      {
        h2: 'Where Tidal Earns Its Slot',
        html: `<ul>
<li><strong>Payout economics:</strong> Tidal has consistently ranked among the higher-paying major streaming services per stream</li>
<li><strong>Tidal Rising:</strong> a real editorial program dedicated to emerging artists — a lane Spotify-scale platforms rarely offer this explicitly</li>
<li><strong>Hi-fi audience:</strong> subscribers chose the platform for sound quality — your master actually gets heard as mixed</li>
<li><strong>Culture credibility:</strong> deep playlist coverage in hip hop and R&B lanes</li>
</ul>`
      },
      {
        h2: 'Working Tidal as an Independent',
        html: `<p>Deliver everything through your distributor (including hi-res masters where possible), keep your profile complete, and pitch your story toward Rising-style editorial: who you are, what is moving, which rooms and cities are reacting. As everywhere, momentum is the pitch — a record with DJ activity, Shazam pings, and growth elsewhere gives Tidal editors a reason to plant a flag on you early.</p>`
      },
    ],
    faq: [
      { q: 'Is Tidal worth it for independent artists?', a: 'As part of full distribution, absolutely — incremental royalties at better rates cost you nothing extra. As a promotion focus, it makes most sense once you have a story its emerging-artist editorial can pick up.' },
      { q: 'How do I get on Tidal playlists?', a: 'Through your distributor’s pitch channels and by building visible momentum. Tidal’s editorial team curates actively in hip hop and R&B, and its Rising program specifically looks for emerging artists on the way up.' },
    ],
    related: ['apple-music-promotion', 'spotify-playlist-promotion', 'grow-spotify-listeners', 'im-getting-traction'],
  },
  {
    slug: 'youtube-music-promotion',
    name: 'YouTube',
    title: 'YouTube Music Promotion',
    navLabel: 'YouTube Promotion',
    description: 'How to promote music on YouTube: the second-biggest search engine, Shorts as a discovery engine, visualizers vs. videos, and converting views into streams and fans.',
    question: 'How do you promote music on YouTube?',
    quickAnswer: 'Treat YouTube as search engine plus discovery engine: publish every song (visualizer minimum), work Shorts relentlessly with your hook moment, optimize titles for how fans actually search, and use the channel to convert viewers into subscribers you can reach forever.',
    intro: 'YouTube is the world’s biggest music platform by audience and its second-biggest search engine, period. When a club spin or radio play makes someone hunt for your song, YouTube is where half of them look. Not being properly present there means real-world promotion leaks away at the exact moment it converts.',
    specifics: [
      {
        h2: 'The Non-Negotiable Baseline',
        html: `<ul>
<li><strong>Every release on the channel:</strong> full video for priority singles, visualizer or art track for everything else</li>
<li><strong>Search-first titling:</strong> "Artist – Song (Official Video)" — title it the way a stranger who half-heard it in a club will search</li>
<li><strong>Official Artist Channel:</strong> consolidate your uploads and distributor-generated art tracks into one verified home</li>
</ul>`
      },
      {
        h2: 'Shorts: The Discovery Engine',
        html: `<p>Shorts is YouTube's answer to TikTok and currently its most generous discovery surface for unknown channels. Cut your hook — the same 10–15 seconds you tease everywhere — into multiple Shorts: performance, in-studio, club reaction clips, lyric moments. Club footage of a room reacting to your record is the highest-converting Short an independent artist can post, which is one more downstream payoff of getting the record into real rooms via DJ service.</p>`
      },
    ],
    faq: [
      { q: 'Do YouTube views count toward charts and royalties?', a: 'Yes — official video and art-track streams generate royalties and count into major chart calculations, and YouTube remains a primary revenue source in many countries.' },
      { q: 'Should I upload my song as a video if I have no budget?', a: 'Yes — a clean visualizer (artwork plus motion) costs nearly nothing and captures the search demand your promotion creates. No presence means those searches land on lyric rips or nothing at all.' },
    ],
    related: ['spotify-playlist-promotion', 'how-to-build-anticipation', 'get-more-fans', 'why-my-song-stopped-growing'],
  },
];

module.exports = PLATFORMS.map((p) => ({
  slug: p.slug,
  category: 'promotion',
  featured: p.featured,
  title: p.title,
  navLabel: p.navLabel,
  metaTitle: `${p.title}: The Independent Artist Playbook | Digiwaxx`,
  description: p.description,
  question: p.question,
  quickAnswer: p.quickAnswer,
  longAnswer: p.intro,
  sections: [
    ...p.specifics,
    {
      h2: `Where ${p.name} Fits in the Full Campaign`,
      html: `<p>No platform strategy works in isolation. The records that grow on ${p.name} are the ones with life outside it: DJ spins creating searches, content creating profile visits, and a release cadence giving the platform something new to measure. Build the demand engine once — packaging, DJ service, content waves — and every platform, ${p.name} included, becomes a harvesting surface for the same momentum.</p>`,
    },
  ],
  faq: p.faq,
  related: p.related,
}));
