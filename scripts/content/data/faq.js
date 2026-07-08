// FAQ cluster — standalone one-question answer pages (category: answers).
// Same AEO structure as answers.js; these target the buying-intent questions.
module.exports = [
  {
    slug: 'does-music-promotion-work',
    category: 'answers',
    title: 'Does Music Promotion Work?',
    navLabel: 'Does Music Promotion Work?',
    metaTitle: 'Does Music Promotion Work? An Honest Answer | Digiwaxx',
    description: 'Music promotion works when it buys real exposure to new audiences — and fails when it buys fake numbers. How to tell the difference before spending.',
    question: 'Does paying for music promotion actually work?',
    quickAnswer: 'Yes — when "promotion" means real exposure to audiences you can’t reach alone: DJs, radio, playlists, press. It fails when it means bought streams, botted playlists, or spam. The test: does the money buy access to real listeners, or just numbers?',
    longAnswer: 'The question is really "which music promotion works," because the label covers opposites: decades-old channels that break records (DJ servicing, radio campaigns, curator pitching) and scams that damage them (stream farms, fake playlists). Every working form of promotion shares one property — a real human audience on the other end.',
    sections: [
      {
        h2: 'Promotion That Works',
        html: `<ul>
<li><strong>DJ servicing:</strong> your record in professional crates, tested on real rooms — the oldest working promotion in the business, and the reaction data is honest by design</li>
<li><strong>Radio campaigns:</strong> mixshow and specialty spins building market familiarity</li>
<li><strong>Legitimate playlist pitching:</strong> real curators, real listeners, no guaranteed placements</li>
<li><strong>Press and content:</strong> narrative and proof that compound your search footprint</li>
</ul>
<p>What they share: measurable exposure to strangers, and assets (spins, relationships, coverage) that outlive the campaign.</p>`,
      },
      {
        h2: 'Promotion That Backfires',
        html: `<p>Bought streams and botted playlists don’t just waste money — they poison the engagement data platforms use to evaluate you, and DSPs actively remove artificial streams. "Guaranteed placement/spins" offers are the tell: nobody honest sells reactions, because real audiences decide those.</p>`,
      },
      {
        h2: 'What "Working" Looks Like',
        html: `<p>Set the right expectation: promotion creates qualified exposure and proof, not overnight fame. A working campaign shows up as DJ downloads and feedback, first spins, search and Shazam activity, save-rate improvements, and receipts you can pitch with — which compound release over release. One campaign is a wave; a career is several.</p>`,
      },
    ],
    faq: [
      { q: 'How do I know if a promotion service is legitimate?', a: 'Verifiable access (a real network with history), deliverables you can see, and no guaranteed-outcome promises. Digiwaxx, for example, guarantees servicing to its 30,000+ DJ network and its coverage deliverables — never specific spins, because DJs decide those.' },
      { q: 'What results should a first campaign produce?', a: 'Reaction data and assets: DJ activity, early spins, feedback, coverage, and measurable movement in searches and saves. Those are the raw material every next move is built from.' },
    ],
    related: ['should-i-pay-for-music-promotion', 'how-much-does-music-promotion-cost', 'does-dj-promotion-still-work', 'music-promotion-service'],
  },
  {
    slug: 'how-much-does-music-promotion-cost',
    category: 'answers',
    featured: true,
    title: 'How Much Does Music Promotion Cost?',
    navLabel: 'Promotion Costs',
    metaTitle: 'How Much Does Music Promotion Cost in 2026? Real Numbers | Digiwaxx',
    description: 'Real music promotion price ranges: DJ service, playlist campaigns, radio pushes, PR — what each costs, what’s worth it first, and where budgets get wasted.',
    question: 'How much does it cost to promote a song?',
    quickAnswer: 'Meaningful promotion starts around $100–$500 per single: record pool campaigns run $99–$199 (Digiwaxx tiers), playlist campaigns typically hundreds, indie radio pushes hundreds to low thousands, PR retainers $500–$2,000+/month. Spend on packaging and DJ service before ads.',
    longAnswer: 'Prices confuse artists because channels are priced differently: one-time campaigns, per-pitch credits, monthly retainers, and ad budgets all get called "promotion." Here are honest ranges by channel, and — more useful — the order to spend in so early dollars build assets instead of impressions.',
    sections: [
      {
        h2: 'Typical Ranges by Channel',
        html: `<ul>
<li><strong>Record pool / DJ campaign:</strong> ~$99–$199 one-time (Digiwaxx: Starter $99, Pro $149, Elite $199)</li>
<li><strong>Per-pitch platforms (SubmitHub/Groover style):</strong> a few dollars per contact; $50–$200 covers a serious testing round</li>
<li><strong>Playlist campaign platforms:</strong> commonly $200–$1,000+ per campaign depending on reach</li>
<li><strong>Independent radio campaigns:</strong> hundreds to low thousands for mixshow/college pushes; serious commercial rotation campaigns cost far more</li>
<li><strong>PR/publicist:</strong> $500–$2,000+ per month, usually 2–3 month minimums</li>
<li><strong>Ads:</strong> any budget — but they amplify momentum rather than create it</li>
</ul>`,
      },
      {
        h2: 'The Spending Order That Works',
        html: `<ol>
<li><strong>Packaging first</strong> (mastering, clean edit, instrumental — under $200 if outsourced): multiplies every later dollar</li>
<li><strong>DJ service second</strong> ($99–$199): real-world exposure plus reusable proof</li>
<li><strong>Content third</strong> (can be $0 with a phone): converts the exposure</li>
<li><strong>Pitching/playlists fourth</strong>, with receipts attached</li>
<li><strong>Ads and PR last</strong>, once data shows what converts and there is a story to tell</li>
</ol>
<p>Run your own numbers in the <a href="/tools/release-budget-calculator">Release Budget Calculator</a>.</p>`,
      },
      {
        h2: 'Where Budgets Die',
        html: `<p>The three classic wastes: bought streams (worse than nothing — they poison your data), "guaranteed placement" playlist schemes (policy-violating and usually botted), and ads on a record with no packaging, no proof, and no capture points. If a dollar doesn’t buy real ears or a durable asset, keep it.</p>`,
      },
    ],
    faq: [
      { q: 'Can I promote a song with $100?', a: 'Yes — $99 covers a Starter DJ campaign, which buys the highest-leverage exposure available at that price. Add free content around any reactions and you have a real, if lean, campaign.' },
      { q: 'How much do labels spend promoting a single?', a: 'Majors spend tens to hundreds of thousands per priority single across radio, DSP, and media. The point of independent channels is renting the same mechanisms at single-record scale.' },
    ],
    related: ['release-budget-calculator', 'should-i-pay-for-music-promotion', 'is-spotify-playlist-promotion-worth-it', 'music-promotion-service'],
  },
  {
    slug: 'should-i-pay-for-music-promotion',
    category: 'answers',
    title: 'Should I Pay for Music Promotion?',
    navLabel: 'Should I Pay for Promotion?',
    metaTitle: 'Should I Pay for Music Promotion? When Yes, When No | Digiwaxx',
    description: 'When paying for promotion makes sense, when it doesn’t, and the checklist your record should pass before you spend a dollar.',
    question: 'Should I pay to promote my music?',
    quickAnswer: 'Pay when three things are true: the record is genuinely finished (mastered, clean versions ready), the money buys real access (DJs, radio, curators — not bots), and you can work the results (content, follow-ups). If the record isn’t packaged yet, spend there first.',
    longAnswer: 'The honest answer is a checklist, not a yes/no. Promotion multiplies what exists — a great record properly packaged gets multiplied; an unmastered file with no profiles gets multiplied by zero. Here is the readiness test, and the decision logic on the other side of it.',
    sections: [
      {
        h2: 'The Readiness Checklist',
        html: `<ul>
<li>Mastered audio that survives a big system</li>
<li>Clean, dirty, and instrumental versions exported</li>
<li>Consistent, claimed profiles everywhere (a stranger who searches you finds you)</li>
<li>Somewhere for new attention to land — link-in-bio, a follow-worthy profile, a capture point</li>
<li>Time to work the campaign: post reactions, thank DJs, pitch with receipts</li>
</ul>
<p>Pass all five and paid promotion buys leverage. Fail any and that's where your first dollars go instead.</p>`,
      },
      {
        h2: 'What to Pay For (In Order)',
        html: `<p>Access beats impressions: DJ service puts your record in front of ${'30,000+'} working DJs — exposure you cannot DM your way into. Then legitimate pitching with the proof that service generates, then ads only on records with demonstrated reaction. Never pay for guaranteed streams, spins, or placements — real audiences can't be pre-sold, and fake ones damage you.</p>`,
      },
      {
        h2: 'The Free Work That Makes Paid Work',
        html: `<p>Paid exposure converts through free labor: content around the record, replies to every comment, personal outreach to supporters, and relationships with the DJs and curators who respond. Artists who "paid for promotion and got nothing" usually bought the exposure and skipped the conversion.</p>`,
      },
    ],
    faq: [
      { q: 'Is it bad to pay for promotion as a new artist?', a: 'No — every label in history has paid for promotion; it is how records reach strangers. What is bad is paying before the record is packaged, or paying for fake numbers instead of access.' },
      { q: 'What is the minimum sensible spend?', a: 'Roughly $100–$300 per single covers packaging gaps plus a DJ campaign — the two highest-leverage purchases. Below that, spend time instead: content, outreach, and the free halves of every channel.' },
    ],
    related: ['how-much-does-music-promotion-cost', 'does-music-promotion-work', 'music-promotion-for-beginners', 'release-budget-calculator'],
  },
  {
    slug: 'how-long-does-music-promotion-take',
    category: 'answers',
    title: 'How Long Does Music Promotion Take?',
    navLabel: 'How Long Promotion Takes',
    metaTitle: 'How Long Does Music Promotion Take to Work? Real Timelines | Digiwaxx',
    description: 'Realistic promotion timelines: what happens in week one, weeks 2–6, and months 2–6 — and how long before a record shows real results.',
    question: 'How long does it take for music promotion to show results?',
    quickAnswer: 'First signals arrive in days (DJ downloads, feedback); real-world traction builds over 2–6 weeks (spins, searches, saves); careers compound over months of repeated waves. Any promise of overnight results is selling fake numbers.',
    longAnswer: 'Promotion timelines disappoint artists mainly because nobody states them honestly: exposure is fast, reaction takes weeks, and compounding takes releases. Here is the realistic clock for a serviced record, stage by stage — and the moment most artists quit exactly when they shouldn’t.',
    sections: [
      {
        h2: 'The Realistic Timeline',
        html: `<ul>
<li><strong>Days 1–7:</strong> the record is serviced; DJ downloads and first feedback arrive — reach is instant, judgment begins</li>
<li><strong>Weeks 2–4:</strong> testing: club tries, mixshow looks, early clips; searches and Shazams start in reacting markets</li>
<li><strong>Weeks 4–8:</strong> the compounding window: repeat spins (the real signal), curator pitches landing off the proof, algorithmic surfaces waking up</li>
<li><strong>Months 2–6:</strong> waves two and three (video, remix, city concentration) — where records that break usually break</li>
</ul>`,
      },
      {
        h2: 'Why Week Three Is Where Artists Quit',
        html: `<p>Week one feels exciting (downloads! feedback!), week two feels quiet, and week three is where most artists conclude "it didn't work" — precisely when DJs who downloaded the record are still cycling it into sets, and when the follow-up work (thanking DJs, posting clips, pitching with receipts) determines whether testing becomes traction. The campaign starts the clock; working it is what fills the weeks.</p>`,
      },
      {
        h2: 'What Speeds It Up',
        html: `<ul>
<li>Perfect packaging (nothing stalls a record like a missing clean version)</li>
<li>Fast response to every reaction — same-day reposts and thank-yous</li>
<li>Concentrating on reacting markets instead of waiting for all markets</li>
<li>A planned wave two so momentum has somewhere to go (see the <a href="/campaigns/60-day-release-plan">60-Day Release Plan</a>)</li>
</ul>`,
      },
    ],
    faq: [
      { q: 'How long should I promote one single?', a: 'Actively for 6–8 weeks minimum, with waves at weeks 4–6 and 10–12 if the record shows life. Records keep getting discovered in DJ crates long after that.' },
      { q: 'When should I give up on a record?', a: 'After it has actually been tested: proper packaging, real DJ exposure, a worked follow-up, and still no reaction anywhere. That is data, not failure — feed it into the next release.' },
    ],
    related: ['what-happens-after-you-submit-music', 'why-my-song-stopped-growing', '60-day-release-plan', 'does-music-promotion-work'],
  },
  {
    slug: 'how-many-djs-receive-my-record',
    category: 'answers',
    title: 'How Many DJs Receive My Record?',
    navLabel: 'How Many DJs Get My Record?',
    metaTitle: 'How Many DJs Receive My Record With Digiwaxx? | Digiwaxx',
    description: 'A Digiwaxx campaign services your record to a network of 30,000+ verified working DJs — club, mixshow, radio, and mobile. What that number means in practice.',
    question: 'How many DJs will actually receive my record?',
    quickAnswer: 'A Digiwaxx campaign services your record to the network of 30,000+ working DJs — club, mixshow, radio, and mobile jocks — built continuously since 1998. Every member can access the record; the ones whose rooms it fits download and test it.',
    longAnswer: 'The honest mechanics matter more than the headline number, so here they are: servicing means your record — packaged clean/dirty/instrumental with correct metadata — is placed into the pool that 30,000+ verified working DJs actively check for new music. Downloads are the DJs’ choice; that self-selection is exactly what makes the resulting data meaningful.',
    sections: [
      {
        h2: 'Who Is in the Network',
        html: `<ul>
<li><strong>Club DJs</strong> — residencies and party circuits in every major market</li>
<li><strong>Mixshow and radio DJs</strong> — the broadcast entry point for independent records</li>
<li><strong>Mobile DJs</strong> — weddings, parties, campus events: massive cumulative audiences</li>
<li><strong>Open-format and specialist jocks</strong> across hip hop, R&B, afrobeats, dancehall, Latin, and dance lanes</li>
</ul>
<p>Membership is verified — the curation is what makes the network worth servicing into, on both sides.</p>`,
      },
      {
        h2: 'Reach vs. Reaction (Read This Part)',
        html: `<p>Reach is guaranteed; reaction is earned. Out of a serviced network, the DJs who pull your record are the ones whose formats and rooms it fits — and that filter is the product. A thousand qualified downloads beats thirty thousand forced sends, because every download is a professional saying "I might play this." The feedback loop (downloads, ratings, spins by market) then tells you exactly where to concentrate.</p>`,
      },
    ],
    faq: [
      { q: 'Will every DJ in the network play my song?', a: 'No — and distrust anyone who says otherwise. DJs program for their rooms. Servicing guarantees qualified exposure; the record earns its spins, and the ones it earns are real.' },
      { q: 'Can I see what happened after servicing?', a: 'Campaign deliverables include activity and feedback from the network — and Elite adds a performance snapshot report. Read it like a map: it tells you which cities and formats to work next.' },
    ],
    related: ['what-happens-after-you-submit-music', 'how-record-pools-work', 'how-do-djs-find-new-music', 'music-promotion-service'],
  },
  {
    slug: 'can-independent-artists-use-digiwaxx',
    category: 'answers',
    title: 'Can Independent Artists Use Digiwaxx?',
    navLabel: 'Can Indie Artists Use Digiwaxx?',
    metaTitle: 'Can Independent Artists Use Digiwaxx? Yes — Here’s How | Digiwaxx',
    description: 'Yes — most Digiwaxx campaigns are for independent artists. What you need (a finished record), what it costs ($99–$199 one-time), and what happens after you submit.',
    question: 'Can independent artists use Digiwaxx, or is it labels only?',
    quickAnswer: 'Yes — independent artists are the majority of Digiwaxx campaigns. You need a finished, mastered record (ideally clean, dirty, and instrumental versions), $99–$199 one-time, and no label, contract, or connections. The network judges records, not rosters.',
    longAnswer: 'Record pools began as label infrastructure, which is why the question is fair — but the modern pool democratized exactly that access. Digiwaxx has serviced independent records alongside label releases for years: same network, same packaging standards, same feedback loop. What is required is professionalism, not a deal.',
    sections: [
      {
        h2: 'What You Need (and Don’t)',
        html: `<ul>
<li><strong>Need:</strong> a mastered record; clean/dirty/instrumental versions; final artwork; correct metadata</li>
<li><strong>Don’t need:</strong> a label, a manager, prior releases, follower counts, or anyone’s permission</li>
</ul>
<p>The packaging bar exists because DJs are professionals — meet it and your record sits in the same crates as major releases.</p>`,
      },
      {
        h2: 'What a Campaign Looks Like for an Independent',
        html: `<p>Pick a tier (Starter $99, Pro $149, Elite $199 — one-time, no contracts), submit your files, and the record is serviced to the ${'30,000+'} DJ network with radio rotation, playlist placement, and an SEO-indexed artist feature layered in. You keep 100% of your masters, royalties, and rights — the campaign never touches ownership. Then read <a href="/answers/what-happens-after-you-submit-music">what happens after you submit</a> and work the reactions.</p>`,
      },
    ],
    faq: [
      { q: 'Do I need a certain number of streams or followers to qualify?', a: 'No. DJs evaluate the record, not your metrics — which is precisely why the DJ channel is the fairest arena an unknown artist can compete in.' },
      { q: 'Does Digiwaxx take any rights or royalties?', a: 'No — campaigns are a one-time promotion fee. Masters, publishing, and royalties stay entirely yours.' },
    ],
    related: ['independent-music-promotion', 'what-happens-after-you-submit-music', 'how-much-does-music-promotion-cost', 'promote-my-single'],
  },
  {
    slug: 'will-promotion-increase-streams',
    category: 'answers',
    title: 'Will Promotion Increase My Streams?',
    navLabel: 'Will Promotion Increase Streams?',
    metaTitle: 'Will Music Promotion Increase My Streams? The Honest Mechanics | Digiwaxx',
    description: 'How real promotion converts to streams: exposure → searches and saves → algorithmic pickup. What to expect, what not to, and why bought streams destroy the loop.',
    question: 'Will paying for promotion actually increase my streams?',
    quickAnswer: 'Real promotion increases streams indirectly and durably: exposure (DJ spins, radio, playlists) creates searches, Shazams, and saves, which trigger algorithmic playlists — the biggest stream driver on every platform. Nobody honest promises a specific number, because listeners decide.',
    longAnswer: 'Streams are an output, not a purchase — and understanding the conversion chain protects you from both scams and disappointment. Here is exactly how a serviced record turns into streaming growth, where the loop can break, and the difference between streams that build a career and streams that end one.',
    sections: [
      {
        h2: 'The Conversion Chain',
        html: `<ol>
<li><strong>Exposure:</strong> DJs, radio, playlists, and content put the record in front of strangers</li>
<li><strong>Intent signals:</strong> the ones it hits search the name, Shazam it, save it, add it to playlists</li>
<li><strong>Algorithmic pickup:</strong> platforms read those high-intent signals and start recommending the record (Release Radar, Discover Weekly, Radio, Autoplay)</li>
<li><strong>Compounding:</strong> algorithmic reach creates more listeners, more saves, more data — the loop feeds itself while you fire the next wave</li>
</ol>
<p>Every legitimate channel plugs into step 1. Real-world DJ play is disproportionately powerful because rooms generate the highest-intent signal there is: a stranger pulling out their phone to find your song.</p>`,
      },
      {
        h2: 'Where the Loop Breaks',
        html: `<ul>
<li><strong>Unfindable artist:</strong> exposure happens, searches fail — mismatched names, empty profiles</li>
<li><strong>No capture:</strong> listeners arrive, nothing asks them to save or follow</li>
<li><strong>First-30-seconds problem:</strong> exposure converts to skips — the data will tell you</li>
<li><strong>Bought streams:</strong> the loop in reverse — zero-intent plays teach the algorithm your record loses listeners, and DSPs remove artificial streams</li>
</ul>`,
      },
    ],
    faq: [
      { q: 'How many streams should a promotion campaign generate?', a: 'Anyone who quotes you a number is guessing or botting. Honest expectation: measurable movement in searches, saves, and sources within 2–6 weeks, compounding across waves — with the size determined by the record and how hard you work the reactions.' },
      { q: 'Why did my streams rise then fall after a campaign?', a: 'A fuel source got exhausted — normal wave behavior, not failure. Sustained growth comes from stacked waves and algorithmic pickup; see "Why Your Song Stopped Growing" for the restart plan.' },
    ],
    related: ['spotify-algorithm-tips', 'does-music-promotion-work', 'why-my-song-stopped-growing', 'grow-spotify-listeners'],
  },
  {
    slug: 'does-radio-promotion-still-work',
    category: 'answers',
    title: 'Does Radio Promotion Still Work?',
    navLabel: 'Does Radio Promotion Work?',
    metaTitle: 'Does Radio Promotion Still Work in the Streaming Era? | Digiwaxx',
    description: 'Radio still reaches most adults weekly and still converts to streams, legitimacy, and bookings. What radio promotion does in 2026 and how independents access it.',
    question: 'Does radio promotion still matter in the streaming era?',
    quickAnswer: 'Yes — broadcast radio still reaches the large majority of adults every week, and a spinning record still converts to searches, streams, legitimacy, and bookings. What changed is the entry point: independents get in through mixshows and specialty shows, where DJs choose the records.',
    longAnswer: 'Radio was declared dead by every new format since television, yet it still commands weekly reach most platforms envy — cars, workplaces, cities. For artists, radio’s value stack goes beyond audience: a spin is third-party validation programmers, promoters, and press all recognize. The realistic question is not whether radio works but which radio an independent can actually reach.',
    sections: [
      {
        h2: 'What Radio Still Does (That Nothing Else Does)',
        html: `<ul>
<li><strong>Mass passive reach:</strong> radio plays your record to people who never chose it — the discovery playlists can't replicate</li>
<li><strong>Market saturation:</strong> rotation makes a record inescapable in a metro, the fastest route to local ubiquity</li>
<li><strong>Legitimacy:</strong> "spinning on radio" still changes how promoters, curators, and listeners treat you</li>
<li><strong>Measurable spins:</strong> monitored plays chart, report, and become permanent receipts</li>
</ul>`,
      },
      {
        h2: 'The Independent Entry Points',
        html: `<p>Daytime rotation is the last domino, not the first. Independents enter through mixshows (DJ-programmed hours on commercial stations), specialty and local-artist shows, and college/community radio — all programmed by DJs and hosts who pick their own records, and all reachable through DJ channels. That is why pool servicing matters for radio: mixshow DJs source from the same crates as club DJs, and Digiwaxx's network includes the radio and mixshow jocks alongside them, with the campaign's radio rotation layer on top.</p>`,
      },
    ],
    faq: [
      { q: 'Is internet radio worth anything?', a: 'Legitimate internet and community stations with real audiences, yes — real spins, interviews, and airchecks that become proof. "Pay for 500 spins" stations with no listeners, no.' },
      { q: 'How do radio spins affect streaming?', a: 'The same way club spins do, at broadcast scale: passive exposure converts to searches, Shazams, and saves in the broadcast market — high-intent signals algorithms amplify. Radio and streaming are a loop, not rivals.' },
    ],
    related: ['how-to-get-radio-play', 'get-radio-spins', 'does-dj-promotion-still-work', 'do-djs-still-break-records'],
  },
];
