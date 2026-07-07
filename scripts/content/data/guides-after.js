// Layer 1 — SEO: "After Release" artist intent
// CTA theme for this group: "Your record doesn't need another upload. It needs people."
const afterCta = {
  kicker: 'The Fix',
  headline: "Your record doesn't need another upload. It needs people.",
  sub: 'Put your song in front of 30,000+ working DJs — clubs, mixshows, radio — through the network trusted since 1998.',
  button: 'Submit Your Record',
};

module.exports = [
  {
    slug: 'my-song-isnt-getting-streams',
    category: 'guides',
    featured: true,
    title: "My Song Isn't Getting Streams",
    navLabel: "Song Isn't Getting Streams",
    metaTitle: "My Song Isn't Getting Streams — Here's Why, and What to Do | Digiwaxx",
    description: 'Why your song isn’t getting streams: the discovery gap, the four causes, and the fixes that actually move plays — in order of impact.',
    question: 'Why is my song not getting any streams?',
    quickAnswer: 'Songs stall for one core reason: nobody outside your existing circle is being exposed to the record. Uploading creates availability, not discovery. Streams start moving when other people with audiences — DJs, curators, algorithms — start playing it.',
    longAnswer: 'Roughly 100,000 tracks hit streaming services every day. A song with no external exposure isn’t being rejected by listeners — it’s simply never reaching any. Before rebuying ads or blaming the mix, diagnose which of the four causes below is actually stalling your record, because each has a different fix.',
    sections: [
      {
        h2: 'Cause 1: No Discovery Channels (Most Common)',
        html: `<p>Your streams come from your own followers, and that well is finite. Check Spotify for Artists → where listeners found the song. If it is almost all "your profile and catalog," no discovery source is feeding you: no playlists, no radio, no DJ play, no algorithmic surfaces. <strong>Fix:</strong> add an amplification channel. Service the record to DJs, pitch independent curators, get the song into rooms. External plays generate the listener signals that wake up algorithmic playlists.</p>`
      },
      {
        h2: 'Cause 2: Weak First-Week Signals',
        html: `<p>If the release went up quietly, the algorithm sampled it, saw low saves and skips-per-listen, and shelved it. <strong>Fix:</strong> you can restart momentum without re-uploading — a remix, video, or DJ service wave gives the same record a second velocity event.</p>`
      },
      {
        h2: 'Cause 3: Packaging Problems',
        html: `<p>Wrong genre tags, no clean version, artwork that reads as amateur, inconsistent artist name splitting your profile. These quietly kill curator and DJ pickup. <strong>Fix:</strong> audit the record like a stranger: would a DJ who found this trust it enough to play it?</p>`
      },
      {
        h2: 'Cause 4: The Song Hasn’t Found Its Room Yet',
        html: `<p>Some records don’t react online first — they react in clubs, in cars, on mixshows. Plenty of hits were floor records months before they were streaming records. <strong>Fix:</strong> test it where it might live. Getting a record in front of thousands of DJs is precisely the test: if rooms react, you have a promotion plan; the reactions become your content and your pitch.</p>`
      },
    ],
    faq: [
      { q: 'Should I delete and re-upload a song that isn’t streaming?', a: 'No. You lose the stream count, playlist adds, and any algorithmic history, and you gain nothing — the discovery problem comes with you. Add promotion to the existing record instead.' },
      { q: 'Do low streams mean my song is bad?', a: 'Not by itself. With ~100,000 uploads a day, silence is the default for unpromoted records regardless of quality. Judge the song by reactions from people who heard it — not by counts of people who never did.' },
      { q: 'How long does it take for a song to pick up streams?', a: 'With active promotion, discovery channels typically show movement within 2–6 weeks. Without promotion, time alone changes nothing — a record does not age into an audience.' },
    ],
    related: ['why-nobody-listens-to-my-music', 'how-to-promote-a-single-after-release', 'spotify-algorithm-tips', 'i-released-it'],
    cta: afterCta,
  },
  {
    slug: 'why-nobody-listens-to-my-music',
    category: 'guides',
    title: 'Why Nobody Listens to Your Music (Yet)',
    navLabel: 'Why Nobody Listens Yet',
    metaTitle: 'Why Nobody Listens to My Music: The Honest Diagnosis | Digiwaxx',
    description: 'The honest reasons nobody is listening to your music yet — exposure math, trust signals, and the fixable gap between good songs and heard songs.',
    question: 'Why does nobody listen to my music?',
    quickAnswer: 'Almost always: exposure, not quality. Listeners can’t choose a song they never encounter, and self-promotion to your own followers recycles the same small pool. The gap is closed by borrowed audiences — DJs, playlists, radio, co-signs — not louder posting.',
    longAnswer: 'It feels personal, but it is math. Your posts reach a fraction of your followers; your followers are a fraction of your city; and streaming adds ~100,000 new tracks a day to the pile. "Nobody listens" is the default state of every record until somebody with an audience plays it forward. The question that matters is: whose audience will hear you first?',
    sections: [
      {
        h2: 'The Exposure Math',
        html: `<p>Say 800 people follow you and 10% see a post: 80 impressions per post, mostly people who already decided how they feel about your music. Compare one club spin — 300 strangers hearing the record at full attention — or one mixshow play reaching thousands. Borrowed audiences beat owned audiences by orders of magnitude at this stage. That is not a moral failing of your content; it is why amplification channels exist.</p>`
      },
      {
        h2: 'Trust Signals Decide Who Clicks',
        html: `<p>When strangers do encounter you, they decide in seconds using proxies: artwork, profile consistency, monthly listeners, who else has played you. A record with DJ spins, a playlist add, or a co-sign carries borrowed trust. This is why working the DJ layer does double duty — it creates plays <em>and</em> the proof that makes the next stranger press play.</p>`
      },
      {
        h2: 'What Actually Closes the Gap',
        html: `<ul>
<li><strong>Get played by people who play music for a living.</strong> A record pool puts your song in front of thousands of working DJs — Digiwaxx has run that network since 1998.</li>
<li><strong>Turn every external play into content.</strong> Clips of real rooms reacting outperform any promo graphic.</li>
<li><strong>Concentrate, don’t spray.</strong> One city, one scene, one sound — depth creates the density where word-of-mouth starts.</li>
</ul>`
      },
    ],
    faq: [
      { q: 'How do I know if my music is actually good?', a: 'Get it in front of neutral, qualified ears. DJ feedback is brutally honest — DJs only replay records their rooms respond to. Real reactions from strangers beat opinions from friends in either direction.' },
      { q: 'Does posting more content fix low listenership?', a: 'Posting more to the same small audience mostly produces fatigue. Content works as fuel after new people are being exposed to the record through DJs, playlists, or radio — it rarely creates that exposure alone.' },
    ],
    related: ['my-song-isnt-getting-streams', 'get-more-fans', 'does-dj-promotion-still-work', 'i-need-people'],
    cta: afterCta,
  },
  {
    slug: 'spotify-algorithm-tips',
    category: 'guides',
    title: 'Spotify Algorithm Tips That Actually Work',
    navLabel: 'Spotify Algorithm Tips',
    metaTitle: 'Spotify Algorithm Tips: How to Trigger Release Radar & Discover Weekly | Digiwaxx',
    description: 'How the Spotify algorithm actually decides to push a song — the signals it reads, how to feed them legitimately, and what gets records shelved.',
    question: 'How do you get the Spotify algorithm to push your song?',
    quickAnswer: 'The algorithm follows listeners, not tricks. It promotes songs with strong engagement signals: saves, playlist adds, low skip rates, repeat listens, and search-by-name. Drive real external listeners to the record — DJ plays, content, curators — and the algorithm amplifies what it sees.',
    longAnswer: 'Spotify’s algorithmic surfaces — Release Radar, Discover Weekly, Radio, Autoplay — are recommendation engines trained on listener behavior. They do not evaluate your marketing; they evaluate what real listeners do when they meet your song. Every legitimate "algorithm tip" is a way to improve those behavioral signals.',
    sections: [
      {
        h2: 'The Signals Spotify Actually Reads',
        html: `<ul>
<li><strong>Save rate</strong> — listeners adding the song to their library or playlists</li>
<li><strong>Completion / skip rate</strong> — do people finish it, especially the first 30 seconds</li>
<li><strong>Repeat listens</strong> and inclusion in user playlists</li>
<li><strong>Active search</strong> — people typing your song name (a huge intent signal, and exactly what club and radio play generates)</li>
<li><strong>Follower conversion</strong> — listeners following you after hearing it</li>
</ul>`
      },
      {
        h2: 'Feed It Real Listeners',
        html: `<p>Every surface that exposes strangers to your record feeds the machine: a DJ spinning it in a club sends people to Shazam and search; a mixshow play creates name-searches in that city; a TikTok clip creates streams from fresh accounts. This is why records with real-world activity "mysteriously" catch algorithmic playlists — Spotify is detecting demand that started offline.</p>`
      },
      {
        h2: 'What Gets Records Shelved',
        html: `<ul>
<li><strong>Bought streams and bot playlists</strong> — garbage engagement teaches the algorithm your song makes listeners skip, and can trigger removal</li>
<li><strong>Blasting your link to cold audiences</strong> — clicks from unengaged listeners who bounce at 10 seconds actively hurt you</li>
<li><strong>Ignoring Release Radar</strong> — followers are your guaranteed day-one audience; growing followers before release day raises your floor</li>
</ul>`
      },
      {
        h2: 'Practical Checklist',
        html: `<ul>
<li>Pitch via Spotify for Artists 3+ weeks out (this also guarantees Release Radar for followers)</li>
<li>Ask for the <em>save</em>, not just the stream, in every post</li>
<li>Drive external plays (DJ service, content, curators) in a concentrated window</li>
<li>Watch skip rate in Spotify for Artists — if the first 30 seconds lose people, lead with a different edit next release</li>
</ul>`
      },
    ],
    faq: [
      { q: 'How many streams do you need to trigger the Spotify algorithm?', a: 'There is no public number, and quality beats quantity: a few hundred highly engaged listeners (saves, repeats, searches) outperforms tens of thousands of low-engagement plays. Velocity and engagement rate matter more than totals.' },
      { q: 'Do club and radio plays affect Spotify?', a: 'Indirectly and powerfully: people who hear a record in the real world search for it, Shazam it, save it, and playlist it — precisely the high-intent signals the algorithm weighs most.' },
      { q: 'Is buying streams ever worth it?', a: 'No. Botted streams destroy your engagement ratios, can get tracks removed under Spotify’s artificial streaming policies, and make every future real signal harder to read.' },
    ],
    related: ['grow-spotify-listeners', 'how-to-get-more-playlist-adds', 'is-spotify-playlist-promotion-worth-it', 'my-song-isnt-getting-streams'],
    cta: afterCta,
  },
  {
    slug: 'how-to-get-more-playlist-adds',
    category: 'guides',
    title: 'How to Get More Playlist Adds',
    navLabel: 'Get More Playlist Adds',
    metaTitle: 'How to Get More Playlist Adds: Editorial, Independent & Algorithmic | Digiwaxx',
    description: 'The three kinds of playlists — editorial, independent curator, and algorithmic — and the realistic playbook for getting added to each.',
    question: 'How do I get my song added to more playlists?',
    quickAnswer: 'Work all three playlist types differently: pitch editorial through Spotify for Artists with 3+ weeks lead time, pitch independent curators with proof of traction (spins, clips, numbers), and earn algorithmic playlists by driving engaged listeners from outside Spotify.',
    sections: [
      {
        h2: 'Editorial Playlists (Spotify, Apple)',
        html: `<p>One pitch, through the official tools, before release. Fill in every field — genre, mood, story, city. Odds on any single release are low; artists who land editorial usually did everything else on this page first, because editors also look at how records are moving.</p>`
      },
      {
        h2: 'Independent Curator Playlists',
        html: `<p>Thousands of real people run real playlists, and they respond to two things: fit and momentum. Pitch short, personal, and with receipts — "getting club play in Houston, here's the clip" beats "check out my new single" every time. Avoid any curator selling guaranteed adds; paid third-party placement violates Spotify policy and those playlists are usually botted anyway.</p>`
      },
      {
        h2: 'Algorithmic Playlists (the Big Prize)',
        html: `<p>Release Radar, Discover Weekly, and Radio drive more sustained streams than most editorial placements — and you cannot pitch them. They trigger on engagement: saves, low skips, searches, repeat listens. External exposure is how you feed them: every DJ spin, mixshow play, and viral clip creates the search-and-save behavior the algorithm promotes. A record moving in the real world pulls its own playlist adds behind it.</p>`
      },
      {
        h2: 'The Order of Operations',
        html: `<ol>
<li>Pitch editorial 3+ weeks pre-release (free, one shot, do it every time)</li>
<li>Service the record to DJs so there is real activity in week one</li>
<li>Pitch independent curators in weeks 1–4 <em>with the proof</em> that activity generated</li>
<li>Keep feeding engaged listeners; let algorithmic surfaces compound</li>
</ol>`
      },
    ],
    faq: [
      { q: 'Should I pay for playlist placement?', a: 'Never pay for guaranteed placement on third-party Spotify playlists — it violates platform rules and most such playlists are botted, which can get your track flagged. Paying for legitimate promotion services (DJ service, pitching tools, radio campaigns) that don’t sell the placement itself is a different category.' },
      { q: 'How many playlists do I need to grow?', a: 'A handful of playlists with real, engaged listeners in your genre beats a hundred junk placements. Watch streams-per-playlist-listener in Spotify for Artists to see which adds are real.' },
    ],
    related: ['is-spotify-playlist-promotion-worth-it', 'spotify-algorithm-tips', 'get-playlist-placement', 'spotify-playlist-promotion'],
    cta: afterCta,
  },
  {
    slug: 'how-to-reach-djs',
    category: 'guides',
    title: 'How to Reach DJs With Your Music',
    navLabel: 'How to Reach DJs',
    metaTitle: 'How to Reach DJs: Record Pools, Relationships & What Not to Do | Digiwaxx',
    description: 'The channels that actually reach working DJs — record pools, events, radio staff — and the outreach mistakes that get artists ignored.',
    question: 'What is the best way to reach DJs with a new record?',
    quickAnswer: 'Reach DJs through the channel built for it: record pools, where thousands of working DJs go specifically to find new records. Layer personal relationships on top — at events, through mutual contacts — but let the pool do the mass delivery a record needs.',
    longAnswer: 'There are two ways to reach DJs and they are not in competition: distribution (getting your record into the crates of thousands of DJs you will never meet) and relationships (the handful of DJs in your city who become genuine allies). Artists fail when they try to do distribution via DMs, or expect a pool submission to also build friendships. Do both, on purpose.',
    sections: [
      {
        h2: 'Mass Reach: The Record Pool',
        html: `<p>A record pool is the standing pipeline between new music and working DJs — club, mixshow, mobile, and radio jocks who subscribe specifically to find records. One properly packaged submission (clean, dirty, instrumental, correct metadata) reaches the whole network at once. Digiwaxx has serviced records to DJs since 1998 and reaches ${'30,000+'} DJs — that is the scale a record needs to find its rooms.</p>`
      },
      {
        h2: 'Deep Reach: The Five DJs Who Matter Most',
        html: `<p>Identify the five DJs closest to your scene: the club DJ at the room your crowd goes to, the mixshow DJ on your city's station, the mobile DJ doing every party, the college radio DJ, the tastemaker whose crates others copy. Support them before you need them — pull up to their nights, repost their sets, buy the drink. When your record is ready, they already know your name, and their spins mean more because they chose you.</p>`
      },
      {
        h2: 'What Gets You Ignored',
        html: `<ul>
<li>Cold DMs with a link and "check this out" — no files, no versions, no context</li>
<li>Sending explicit-only records to radio DJs</li>
<li>Following up daily; DJs work nights — give it a week</li>
<li>Asking for a spin before you've given anything: attention, support, or at minimum a professional package</li>
</ul>`
      },
    ],
    faq: [
      { q: 'Can I email DJs directly?', a: 'For the handful you have real context with, yes — short email, private streaming link, download link with all versions, one line on why it fits their sets. For the other thousands, use a pool; unsolicited mass email lands in spam and burns goodwill.' },
      { q: 'Do DJs check record pools for new music?', a: 'Constantly — that is what a pool is for. Working DJs need fresh, properly tagged records every week, and the pool is the professional channel built to deliver exactly that.' },
    ],
    related: ['how-to-get-djs-to-play-my-song', 'how-record-pools-work', 'how-club-djs-discover-new-songs', 'get-club-plays'],
    cta: afterCta,
  },
  {
    slug: 'how-to-get-radio-play',
    category: 'guides',
    title: 'How to Get Radio Play',
    navLabel: 'How to Get Radio Play',
    metaTitle: 'How to Get Radio Play as an Independent Artist | Digiwaxx',
    description: 'The realistic path to radio for independents: mixshows first, clean versions always, and the DJ activity programmers look for before adding a record.',
    question: 'How does an independent artist get on the radio?',
    quickAnswer: 'Enter radio through the side door: mixshows and weekend specialty shows, where DJs pick their own records. Bring a clean version, proper packaging, and proof of activity — club spins, streams, local buzz. Rotation comes after mixshow reaction, not before.',
    longAnswer: 'Daytime rotation on a commercial station is programmed conservatively — music directors add records that are already proving themselves. But every station has hours where DJs control the crate: mixshows, Friday night mixes, local-artist shows, college radio. That is where independent records enter the building, and mixshow DJs are exactly the people record pools service.',
    sections: [
      {
        h2: 'The Radio Food Chain',
        html: `<ol>
<li><strong>College & community radio</strong> — most open, real spins, real charting (some report to national charts)</li>
<li><strong>Mixshows on commercial stations</strong> — DJ's choice; reachable through DJ channels and record pools</li>
<li><strong>Specialty/local shows</strong> — programmed for exactly your lane</li>
<li><strong>Daytime rotation</strong> — follows proof from the levels above plus streaming and sales data</li>
</ol>`
      },
      {
        h2: 'Non-Negotiables Before You Pitch',
        html: `<ul>
<li><strong>Broadcast-clean version</strong> — not just muted curses; genuinely clean audio</li>
<li><strong>Correct metadata and ISRC</strong> so spins can be tracked and reported</li>
<li><strong>A one-sheet:</strong> who you are, the record, notable activity (club play, streaming numbers, press), contact</li>
</ul>`
      },
      {
        h2: 'Mixshow DJs Are DJs First',
        html: `<p>The DJs running mixshows are club DJs during the weekend — they discover records through the same crates and pools as everyone else. When a record arrives properly serviced and is already reacting in clubs, the mixshow spin is a natural next step, and mixshow spins are what music directors see when deciding adds. This is why the club→mixshow→rotation ladder has been the independent route for decades.</p>`
      },
    ],
    faq: [
      { q: 'Do I need a radio promoter?', a: 'For a national rotation campaign, eventually. For mixshows and college radio, no — proper DJ service plus direct pitches to specialty shows is how independents get their first real spins.' },
      { q: 'Is internet radio worth it?', a: 'Legitimate internet and college stations with real audiences, yes — spins, interviews, and aircheck clips all become proof for the next level. Random "pay for 500 spins" internet stations with no listeners, no.' },
      { q: 'How do stations track my spins?', a: 'Monitoring services fingerprint broadcast audio and match it to registered tracks — one more reason correct metadata and ISRCs matter before you go for radio.' },
    ],
    related: ['get-radio-spins', 'how-to-reach-djs', 'do-djs-still-break-records', 'how-to-promote-a-rap-song'],
    cta: afterCta,
  },
  {
    slug: 'why-my-song-stopped-growing',
    category: 'guides',
    title: 'Why Your Song Stopped Growing',
    navLabel: 'Song Stopped Growing',
    metaTitle: 'Why My Song Stopped Growing (and How to Restart It) | Digiwaxx',
    description: 'Streams flatlined after a good start? The four reasons songs plateau and the second-wave playbook for restarting momentum without re-uploading.',
    question: 'Why did my song stop growing after a good start?',
    quickAnswer: 'Songs plateau when their discovery sources get exhausted: the release-week push ended, Release Radar rotated out, a playlist stopped delivering, or content stopped. Growth restarts when you open a new exposure channel — a video, remix, DJ wave, or new city.',
    longAnswer: 'A plateau is not death — it is a spent fuel source. Release Radar lasts a few weeks. A playlist add delivers for a while and fades. Your launch content ran its course. The artists who turn singles into long-running records treat promotion as waves: every 3–6 weeks, a new reason for new people to meet the same song.',
    sections: [
      {
        h2: 'Diagnose Which Fuel Ran Out',
        html: `<p>Open Spotify for Artists and look at the source of streams over time. Playlist streams fading → the adds rotated out. Profile/catalog streams fading → your own audience finished bingeing. Algorithmic streams fading → engagement signals cooled. Each points to the same conclusion from a different angle: the record needs fresh external exposure.</p>`
      },
      {
        h2: 'The Second-Wave Playbook',
        html: `<ul>
<li><strong>New asset:</strong> music video, remix, acoustic/slowed version, acapella — each is a fresh news moment and a fresh pitch</li>
<li><strong>New channel:</strong> if wave one was all online, take it offline — service the record to DJs and let it find rooms; if it had club life, now push curators with those receipts</li>
<li><strong>New geography:</strong> look where the record over-indexed and concentrate there — content, DJs, and shows in the city that already likes it</li>
</ul>`
      },
      {
        h2: 'Timing the Waves',
        html: `<p>Plan waves at week 4–6 and week 10–12 after release. A record with three promotion waves gets three velocity events for the algorithm to read — and plenty of records break on wave two or three, months after "release day." A song is only old when you stop working it.</p>`
      },
    ],
    faq: [
      { q: 'Is it too late to promote a song released months ago?', a: 'No. DJs, curators, and algorithms respond to current activity, not release dates. A six-month-old record with fresh spins and fresh content is a current record.' },
      { q: 'Should I release a new song instead of pushing the old one?', a: 'If the old record showed real reaction (saves, repeat listeners, DJ feedback), it has earned another wave — proven records are rarer than new ones. If it never reacted anywhere, put the next wave of energy into the next release.' },
    ],
    related: ['how-to-promote-a-single-after-release', 'my-song-isnt-getting-streams', 'spotify-algorithm-tips', 'im-getting-traction'],
    cta: afterCta,
  },
  {
    slug: 'how-to-promote-a-single-after-release',
    category: 'guides',
    featured: true,
    title: 'How to Promote a Single After Release',
    navLabel: 'Promote After Release',
    metaTitle: 'How to Promote a Single After It’s Already Out | Digiwaxx',
    description: 'Missed the pre-release window? The post-release promotion plan: DJ service, curator pitching, content waves, and second-wind tactics that work on live records.',
    question: 'How do you promote a single that is already released?',
    quickAnswer: 'A released single is a live asset — promote it in waves: service it to DJs now (pools take released records), pitch independent curators with any traction, ship a new asset (video or remix) as a news moment, and concentrate content in 2–3 week bursts.',
    longAnswer: 'Plenty of guides assume you have six weeks of runway before release day. Real life: the song is out, the launch was quiet, and you want to know what still works. Good news — almost everything except Spotify editorial pitching works just as well after release, and some things (pitching with real data) work better.',
    sections: [
      {
        h2: 'What You Can Still Do (Almost Everything)',
        html: `<ul>
<li><strong>DJ service:</strong> record pools service released records every day — DJs care whether it works in a room, not when it dropped</li>
<li><strong>Independent curators:</strong> pitch with the numbers and clips you have; a record with any live data is an easier pitch than an unreleased promise</li>
<li><strong>Mixshow and college radio:</strong> spins go to records that are reacting, whenever they came out</li>
<li><strong>Content:</strong> the song's story, live clips, reactions — the feed does not know your release date</li>
</ul>
<p>The only real casualty of a missed pre-release window is editorial playlist pitching — and editorial was never the make-or-break channel for independent records anyway.</p>`
      },
      {
        h2: 'The 30-Day Post-Release Sprint',
        html: `<ul>
<li><strong>Days 1–5:</strong> package properly (clean/dirty/instrumental), submit to DJ service, fix any metadata issues</li>
<li><strong>Days 5–15:</strong> content burst around one hook moment; personal outreach to your core; watch for DJ feedback</li>
<li><strong>Days 15–30:</strong> pitch curators and mixshows with everything the first two weeks produced; book anything bookable; plan wave two (video or remix)</li>
</ul>`
      },
      {
        h2: 'Re-Release Only as a Last Resort',
        html: `<p>Do not take the record down to "relaunch" it. You lose counts, adds, and history. If the original upload is genuinely broken (wrong master, wrong name), fix and move on. Otherwise: same record, new wave.</p>`
      },
    ],
    faq: [
      { q: 'How late is too late to promote a single?', a: 'There is no expiry. Records have broken a year after release because a DJ, a playlist, or a clip finally connected. The record is promotable as long as you are willing to work it.' },
      { q: 'Can I still get playlist adds after release?', a: 'Independent curator and algorithmic playlists, absolutely — both respond to current traction. Only the official editorial pitch is pre-release.' },
    ],
    related: ['why-my-song-stopped-growing', 'my-song-isnt-getting-streams', 'how-to-get-more-playlist-adds', 'what-happens-after-you-submit-music'],
    cta: afterCta,
  },
];
