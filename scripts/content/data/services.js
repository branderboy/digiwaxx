// Money pages (release campaigns + outcome head terms) and audience pages.
// These are conversion pages: outcome first, the actual offer, then proof.
const OFFER = `<ul>
<li><strong>Record pool placement</strong> — your record serviced to the Digiwaxx network of 30,000+ club, mixshow, and radio DJs</li>
<li><strong>Spotify playlist placement</strong> and Digiwaxx radio rotation</li>
<li><strong>DJ blast email feature</strong> — direct to the DJ list that has trusted Digiwaxx since 1998</li>
<li><strong>Official Digiwaxx.com artist coverage</strong> — an SEO-indexed artist spotlight that keeps working after the campaign</li>
<li>Pro and Elite add socials pushes, featured DJ Call spins, a one-on-one interview, and a performance snapshot report</li>
</ul>`;

const releaseCampaign = (fmt) => ({
  slug: `promote-my-${fmt.slug}`,
  category: 'services',
  featured: fmt.featured,
  title: `Promote My ${fmt.name} to 30,000+ DJs`,
  navLabel: `Promote My ${fmt.name}`,
  metaTitle: `Promote My ${fmt.name}: DJ, Radio & Playlist Campaign | Digiwaxx`,
  description: `Promote your ${fmt.name.toLowerCase()} to 30,000+ DJs, radio, and playlists in one campaign. One-time payment, no contracts — from the network trusted since 1998.`,
  question: `How do I promote my ${fmt.name.toLowerCase()}?`,
  quickAnswer: `Promote a ${fmt.name.toLowerCase()} by putting it in front of people who play music for audiences: ${fmt.answer} One Digiwaxx campaign services it to 30,000+ DJs with radio, playlist, and coverage layers on top.`,
  longAnswer: fmt.intro,
  sections: [
    { h2: `What a ${fmt.name} Campaign Includes`, html: OFFER },
    { h2: `How It Works for a ${fmt.name}`, html: fmt.how },
    {
      h2: 'Why DJs First',
      html: `<p>Every format benefits from the same physics: DJs are the last audiences with no skip button. A ${fmt.name.toLowerCase()} with real DJ activity behind it generates the searches, saves, and clips that make every other channel — playlists, radio, press, bookings — easier to win. That access is what you are buying: one submission, the whole network.</p>`,
    },
  ],
  faq: fmt.faq,
  related: fmt.related,
  cta: { kicker: 'Ready?', headline: `Launch your ${fmt.name.toLowerCase()} campaign.`, sub: 'Starter $99 · Pro $149 · Elite $199 — one-time payment, no contracts, live since 1998.', button: 'Promote My Record' },
});

const FORMATS = [
  {
    slug: 'single', name: 'Single', featured: true,
    answer: 'service it to DJs before and during release week, stack playlist and radio pushes on the reaction, and keep waves coming for 60 days.',
    intro: 'A single is the format DJs are most willing to test, and the one most likely to disappear if nobody puts it in front of them. This page is for artists with one finished track, released or about to be, who want it in working DJs\' hands rather than sitting in a release-day inbox. Your record goes into the Digiwaxx record pool, where club, mixshow and radio DJs pull new music, with radio and playlist consideration running alongside it. Campaigns are one-time payments of $99, $149 or $199, no contract and no monthly fee. Album, EP and mixtape campaigns work the same way, with the format handled differently.',
    how: `<p>Submit the record (clean, dirty, and instrumental) and it goes out to the network while the radio, playlist, and coverage layers run alongside. Time it 1–2 weeks before release day for maximum week-one velocity, or run it on a live record — DJs care whether it works, not when it dropped. Pair it with the <a href="/campaigns/60-day-release-plan">60-Day Release Plan</a> to run the full rollout around it.</p>`,
    faq: [
      { q: 'When should I start promoting my single?', a: 'Ideally 2–3 weeks before release so DJs have it before street date. Already out? The same campaign works — pools service live records every day.' },
      { q: 'What files do I need?', a: 'Clean, dirty, and instrumental versions, mastered, with correct metadata. No clean version cuts your radio and mixshow reach to nearly zero.' },
    ],
    related: ['60-day-release-plan', 'how-to-release-a-single', 'how-to-promote-a-single-after-release', 'release-day-checklist'],
  },
  {
    slug: 'album', name: 'Album',
    answer: 'lead with the strongest 1–2 focus tracks serviced to DJs, run the album as a story across 8–12 weeks, and let each single pull listeners into the full project.',
    intro: 'An album is not one upload, it is a campaign with a lead. This page is for artists and labels with a finished project who want DJs working it rather than streaming it once and moving on. The lead track goes into the Digiwaxx record pool first, where 30,000+ club, mixshow and radio DJs pull new music, and the rest of the project works behind it as the reaction comes in. Radio and playlist consideration run alongside. Campaigns are one-time payments of $99, $149 or $199, with no contract and no monthly fee.',
    how: `<p>Pick the one or two records DJs can actually play — club energy, radio-clean — and campaign those through the network while the album provides the depth behind them. Coverage and interview layers (Pro/Elite) do more for albums than any other format: a project gives you a story worth telling, and an SEO-indexed feature gives that story a permanent home.</p>`,
    faq: [
      { q: 'Should I promote every song on the album?', a: 'No — campaign the 1–2 focus tracks hard and let the album absorb the attention. You can run a second focus track 6–8 weeks later as a fresh wave.' },
      { q: 'Before or after the album drops?', a: 'Start the first focus-track campaign 2–3 weeks before the album, then work post-release waves. Albums reward longer campaigns than singles.' },
    ],
    related: ['promote-my-single', 'how-many-songs-should-i-release', 'song-rollout-timeline', '60-day-release-plan'],
  },
  {
    slug: 'ep', name: 'EP',
    answer: 'treat it as 2–3 single campaigns sharing one identity — service the lead track to DJs, follow with the second focus track, and let the EP collect the audience.',
    intro: 'An EP gives DJs a choice, which is an advantage only if you service it properly. This page is for artists with three to six finished tracks who would rather a DJ decided which one works than guess at it themselves. You pick the lead, it goes into the Digiwaxx record pool where 30,000+ club, mixshow and radio DJs pull new music, and the other tracks sit behind it for the DJs who want something different. Radio and playlist consideration run alongside. Campaigns are one-time payments of $99, $149 or $199, with no contract.',
    how: `<p>Service the lead track to the DJ network 2 weeks before the EP drops; release the EP; then campaign the second focus track 4–6 weeks later as a fresh news moment on the same project. Two waves, one body of work, and every listener either wave earns lands on a page with more to play.</p>`,
    faq: [
      { q: 'How many tracks should an EP have?', a: 'Four to six is the sweet spot — enough to feel like a project, small enough that your two focus tracks are half the tracklist.' },
      { q: 'EP or three singles?', a: 'If the songs share a sound and story, the EP gives you a bigger artifact for press and coverage while still allowing single-style campaigns per track. If they don’t belong together, release them as singles.' },
    ],
    related: ['promote-my-single', 'promote-my-album', 'how-to-build-anticipation', 'song-rollout-timeline'],
  },
  {
    slug: 'mixtape', name: 'Mixtape',
    answer: 'lean into DJ culture — the format was born there: service the standout records to DJs, use free platforms like Audiomack for reach, and let the tape build the name.',
    intro: 'Mixtapes live or die in DJ crates, which is the one place a streaming upload cannot reach. This page is for artists with a full project who want DJs playing it in rooms, on mixshows and in radio mixes. The tape goes into the Digiwaxx record pool where 30,000+ working DJs pull new music, with the versions they can actually program: clean, dirty and instrumental. Radio and playlist consideration run alongside. Campaigns are one-time payments of $99, $149 or $199, with no contract and no monthly fee.',
    how: `<p>Pick the 1–2 hardest records on the tape and service them to the network with clean edits and instrumentals (freestyle-friendly instrumentals are mixtape currency). Run the tape itself free and frictionless — Audiomack, YouTube, DSPs if cleared — and use the DJ activity and coverage to make the tape an event, not an upload.</p>`,
    faq: [
      { q: 'Can mixtapes go on Spotify and Apple Music?', a: 'Only with cleared samples and beats you have rights to. Uncleared material stays on mixtape-native platforms — which is fine: the tape’s job is heat and name recognition, not royalties.' },
      { q: 'Do DJs still care about mixtapes?', a: 'DJs care about records that work. A standout mixtape record serviced properly gets treated exactly like a single — and a tape with two working records becomes a story.' },
    ],
    related: ['promote-my-single', 'how-to-promote-a-rap-song', 'audiomack-promotion', 'get-club-plays'],
  },
];

const headTerm = (p) => ({
  slug: p.slug,
  category: 'services',
  featured: p.featured,
  title: p.title,
  navLabel: p.navLabel,
  metaTitle: p.metaTitle,
  description: p.description,
  question: p.question,
  quickAnswer: p.quickAnswer,
  longAnswer: p.intro,
  sections: p.sections,
  faq: p.faq,
  related: p.related,
  cta: p.cta || { kicker: 'Ready?', headline: 'Submit your record to Digiwaxx.', sub: 'Starter $99 · Pro $149 · Elite $199 — one-time payment, no contracts, live since 1998.', button: 'Promote My Record' },
});

const HEAD_TERMS = [
  {
    slug: 'music-promotion-service', featured: true,
    title: 'Music Promotion Built on Access, Not Ad Spend',
    navLabel: 'Music Promotion Service',
    metaTitle: 'Music Promotion Service: DJs, Radio, Playlists — Since 1998 | Digiwaxx',
    description: 'A music promotion service built on access: 30,000+ DJs, radio rotation, playlist placement, and published artist coverage. One-time payment, no contracts.',
    question: 'What does a real music promotion service actually do?',
    quickAnswer: 'A real music promotion service delivers access, not ads: your record placed with working DJs, radio, and playlists, plus published coverage — channels you cannot reach alone. Digiwaxx has been that access point since 1998, with a network of 30,000+ DJs.',
    intro: 'Most services sold as music promotion are buying attention on your behalf: ads, submissions, impressions you cannot trace to a person. Digiwaxx works the other way round. Since 1998 we have run a record pool, which means a standing relationship with 30,000+ working DJs who come to us for new music, and your record enters that pool as one of the records they pull. Radio rotation, playlist placement and a published artist feature run alongside it. You are not renting an audience for a fortnight, you are being handed the distribution a label would otherwise own. Campaigns are one-time payments with no contract attached.<\/p><p class="long-answer">The alternatives are one of three cheap substitutes: ad management you could run yourself, botted numbers that poison your data, or spam blasts nobody opens. The test of a real service is simple — does it put your record in front of audiences you could not reach on your own? That is what a record pool with 27 years of DJ relationships does structurally.',
    sections: [
      { h2: 'What Your Campaign Includes', html: OFFER },
      {
        h2: 'How to Judge Any Promotion Service (Including Us)',
        html: `<ul>
<li><strong>Access you can verify:</strong> a real network with a real history — Digiwaxx has serviced DJs since 1998</li>
<li><strong>No fake guarantees:</strong> nobody honest promises specific spins or streams; DJs and audiences decide. Honest services guarantee delivery and reach, not reactions</li>
<li><strong>Real deliverables:</strong> placements, features, and reports you can see — not a dashboard of unverifiable "impressions"</li>
<li><strong>Clean methods:</strong> anything involving bots or bought streams can get your music removed from DSPs — walk away</li>
</ul>`,
      },
    ],
    faq: [
      { q: 'How much does the service cost?', a: 'Three one-time tiers: Starter $99, Pro $149, Elite $199. No subscriptions, no contracts — one campaign per record.' },
      { q: 'What do I need to get started?', a: 'A finished, mastered record — ideally with clean, dirty, and instrumental versions — plus artwork and your basic info. Submit and the campaign starts from there.' },
      { q: 'Do you work with unsigned artists?', a: 'Yes — most Digiwaxx campaigns are for independent artists. The network judges records, not rosters.' },
    ],
    related: ['independent-music-promotion', 'promote-my-single', 'how-much-does-music-promotion-cost', 'what-happens-after-you-submit-music'],
  },
  {
    slug: 'independent-music-promotion', featured: true,
    title: 'Independent Music Promotion',
    navLabel: 'Independent Music Promotion',
    metaTitle: 'Independent Music Promotion: Label Infrastructure, No Label | Digiwaxx',
    description: 'Independent music promotion that rents you the label machine: DJ servicing to 30,000+ DJs, radio, playlists, and published coverage — while you keep 100% of everything.',
    question: 'How does music promotion work for independent artists?',
    quickAnswer: 'Independent promotion means renting the infrastructure labels own — DJ servicing, radio pushes, playlist placement, press — campaign by campaign, while keeping your masters, your royalties, and your decisions. The DJ network is the piece you can access on day one.',
    intro: 'The independent advantage is real: you keep everything. The independent disadvantage is also real: labels have standing machinery — DJ servicing pipelines, radio relationships, press contacts — that took decades to build. The modern answer isn’t signing; it’s renting exactly the machinery you need, per release. That is what Digiwaxx has been for independent artists since 1998.',
    sections: [
      { h2: 'What You Get Per Campaign', html: OFFER },
      {
        h2: 'The Independent Playbook',
        html: `<ol>
<li><strong>Own your foundation:</strong> masters, splits in writing, PRO registration, consistent profiles</li>
<li><strong>Rent amplification per release:</strong> DJ service and coverage when a record is ready — no contracts, no points on your masters</li>
<li><strong>Keep the assets:</strong> every campaign leaves you with DJ relationships, spin history, published coverage, and data — things a label would own for you</li>
<li><strong>Compound:</strong> release every 4–8 weeks into an increasingly warm network</li>
</ol>`,
      },
    ],
    faq: [
      { q: 'Can independent artists really compete with label acts?', a: 'In the DJ channel, yes — DJs judge records, not rosters. A properly serviced independent record sits in the same crate as major releases and wins the same way: by moving rooms.' },
      { q: 'What should an independent artist spend on promotion?', a: 'A defensible starting range is $200–$500 per release across packaging, DJ service, and content — see the Release Budget Calculator for your split. Scale spend as data proves what works.' },
    ],
    related: ['music-promotion-service', 'music-promotion-for-beginners', 'can-independent-artists-use-digiwaxx', 'release-budget-calculator'],
  },
];

// Audience pages — who the service is for and how each uses it.
const audience = (a) => ({
  slug: `music-promotion-for-${a.slug}`,
  category: 'services',
  title: `Music Promotion for ${a.name}`,
  navLabel: `For ${a.name}`,
  metaTitle: `Music Promotion for ${a.name} | Digiwaxx`,
  description: a.description,
  question: `How do ${a.name.toLowerCase()} use Digiwaxx?`,
  quickAnswer: a.quickAnswer,
  longAnswer: a.intro,
  sections: a.sections,
  faq: a.faq,
  related: a.related,
});

const AUDIENCES = [
  {
    slug: 'record-labels', name: 'Record Labels',
    description: 'How indie labels use Digiwaxx: DJ servicing for the whole roster, per-release campaigns without per-release infrastructure, and reaction data for A&R decisions.',
    quickAnswer: 'Labels use Digiwaxx as their DJ-servicing department: every priority release goes to 30,000+ DJs through one pipeline, with feedback and spin activity flowing back as A&R-grade data — no in-house radio/club promo staff required.',
    intro: 'Every label knows the math: in-house DJ and radio promotion staff is a six-figure fixed cost, and most indie labels can’t carry it. The pool model turns that fixed cost into a per-release line item — the same servicing majors buy, purchased campaign by campaign.',
    sections: [
      {
        h2: 'How Labels Run It',
        html: `<ul>
<li><strong>Priority servicing:</strong> each focus release packaged and serviced to the full network on schedule</li>
<li><strong>Reaction data as A&R:</strong> which records DJs pull, in which cities, in which formats — before you commit marketing spend</li>
<li><strong>Roster coverage:</strong> artist spotlights and interview placements build each act's search footprint under your label's story</li>
<li><strong>No lock-in:</strong> per-record campaigns mean you scale servicing up and down with your release calendar</li>
</ul>`,
      },
      {
        h2: 'The Data Angle',
        html: `<p>The most underused label asset in the pool relationship is the feedback loop. DJ downloads and spins by market tell you where each record over-indexes — which is where your next video budget, radio push, and routing should go. Labels that read pool data spend their promotion budgets where reaction already exists.</p>`,
      },
    ],
    faq: [
      { q: 'Can we service multiple releases?', a: 'Yes — each release runs as its own campaign, so a label can put its whole front-line schedule through the network and prioritize by tier.' },
      { q: 'Do you work with distribution partners?', a: 'Pool servicing is independent of your distribution — it complements whatever DSP delivery you already have. Submit the DJ-ready files and the campaign runs alongside your release plan.' },
    ],
    related: ['music-promotion-service', 'how-record-pools-work', 'promote-my-single', 'what-happens-after-you-submit-music'],
  },
  {
    slug: 'managers', name: 'Managers',
    description: 'How artist managers use Digiwaxx: a repeatable promotion system per release, proof kits for pitching, and DJ data that guides booking and routing.',
    quickAnswer: 'Managers use Digiwaxx as the repeatable promotion layer in every release plan: one submission covers DJ servicing, radio, playlists, and coverage — and the reaction data becomes the manager’s ammunition for bookings, radio pitches, and label conversations.',
    intro: 'A manager’s job is leverage: turning an artist’s work into opportunities. Every opportunity conversation — promoters, programmers, editors, labels — starts with the same question: what’s moving? The pool campaign is how a manager manufactures the answer.',
    sections: [
      {
        h2: 'The Manager’s Workflow',
        html: `<ul>
<li><strong>Slot the campaign into every rollout:</strong> service 1–2 weeks pre-release, same calendar every time (see the <a href="/campaigns/60-day-release-plan">60-Day Release Plan</a>)</li>
<li><strong>Build the proof kit:</strong> DJ activity, spins, published coverage, and the performance snapshot become the one-sheet for every pitch</li>
<li><strong>Route off the data:</strong> book the cities where DJs are reacting — rooms where the record already works are rooms that convert</li>
<li><strong>Protect the artist:</strong> one-time campaign pricing, no contracts, nothing touching masters or royalties</li>
</ul>`,
      },
    ],
    faq: [
      { q: 'Can I manage campaigns for multiple artists?', a: 'Yes — each record is its own submission and campaign, so a manager can run their whole roster through the same system and calendar.' },
      { q: 'What makes the campaign useful beyond the spins?', a: 'The receipts. Published coverage, DJ feedback, and spin activity are third-party proof — the difference between a manager saying "trust me" and showing a moving record.' },
    ],
    related: ['music-promotion-for-record-labels', 'get-booked-for-shows', '60-day-release-plan', 'im-getting-traction'],
  },
  {
    slug: 'producers', name: 'Producers',
    description: 'How producers use Digiwaxx: break records you produced, put instrumentals in DJ crates, and build the producer name DJs and artists recognize.',
    quickAnswer: 'Producers use Digiwaxx two ways: campaign the records you produced (your name in the credits travels with every spin), and get instrumentals into DJ crates — where they feed freestyles, edits, and the rooms where producer reputations are made.',
    intro: 'Producers live one layer behind the artist, but DJ culture has always known the names on the beat — and a producer whose records work in rooms gets the next placement, the next tag shouted, the next artist calling. The pool is the producer’s distribution channel for reputation.',
    sections: [
      {
        h2: 'The Producer Plays',
        html: `<ul>
<li><strong>Campaign your placements:</strong> when a record you produced gets serviced, your credit rides 30,000+ crates — make sure metadata carries your name</li>
<li><strong>Instrumentals are currency:</strong> DJs use them for blends, edits, and freestyle sessions; every use is your sound in a room</li>
<li><strong>Producer-artist joint campaigns:</strong> split a campaign with the artist you produced — same record, both names build</li>
<li><strong>The coverage layer:</strong> an SEO-indexed feature about the record includes the story of who made it</li>
</ul>`,
      },
    ],
    faq: [
      { q: 'Can I submit a record I produced but don’t perform on?', a: 'Submit with the artist’s agreement — the campaign promotes the record, and correct credits make sure the production name travels with it.' },
      { q: 'Do DJs actually read producer credits?', a: 'The good ones, obsessively — knowing who is producing heat is part of the job. Correct metadata is how your name compounds across records.' },
    ],
    related: ['promote-my-single', 'how-club-djs-discover-new-songs', 'promote-my-mixtape', 'i-made-a-song'],
  },
  {
    slug: 'djs', name: 'DJs',
    description: 'What Digiwaxx offers DJs: a curated feed of new, DJ-ready records since 1998 — and how DJs in the network shape which records break.',
    quickAnswer: 'For DJs, Digiwaxx is the supply line: a curated feed of new records in DJ-ready form — clean, dirty, instrumental, correctly tagged — from labels and serious independents, plus the platform where your feedback helps decide what breaks next.',
    intro: 'Digiwaxx has been a DJ-side service since 1998 — the pool exists because working DJs need a steady, trusted source of playable records, and the artist side exists because that DJ network is real. If you play out — clubs, radio, mixshows, mobile — this is the room where new records reach you first.',
    sections: [
      {
        h2: 'What DJs Get',
        html: `<ul>
<li><strong>DJ-ready files:</strong> clean/dirty/instrumental versions, correct metadata and BPM — records you can drop into tonight's set</li>
<li><strong>First access:</strong> records serviced to the pool often land before public release</li>
<li><strong>A voice in what breaks:</strong> your downloads and feedback are the reaction data that moves records up the chain</li>
<li><strong>The network effect:</strong> 30,000+ working peers — the crates you check are the crates everyone checks</li>
</ul>`,
      },
    ],
    faq: [
      { q: 'How do I join the Digiwaxx DJ network?', a: 'Reach out through the site — pool membership is for working DJs, and verification is what keeps the network valuable on both sides.' },
      { q: 'What does Digiwaxx expect from member DJs?', a: 'What pools have always run on: play what works for your rooms and let the feedback flow — honest reaction data is the product.' },
    ],
    related: ['how-record-pools-work', 'how-do-djs-find-new-music', 'what-is-a-record-pool', 'does-dj-promotion-still-work'],
  },
];

module.exports = [
  ...FORMATS.map(releaseCampaign),
  ...HEAD_TERMS.map(headTerm),
  ...AUDIENCES.map(audience),
];
