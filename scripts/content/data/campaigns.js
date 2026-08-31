// Campaign Blueprints — sample campaigns an artist can launch as-is.
// Each page is a complete, dated plan that ends at submission.
module.exports = [
  {
    slug: '60-day-release-plan',
    category: 'campaigns',
    featured: true,
    title: 'The 60-Day Single Release Plan',
    navLabel: '60-Day Release Plan',
    metaTitle: 'The 60-Day Release Plan: A Complete Campaign You Can Launch Today | Digiwaxx',
    description: 'A complete 60-day single campaign, week by week: assets, distribution, DJ service, pre-save push, release week, and two post-release waves. Copy it and launch.',
    question: 'What does a complete 60-day single campaign look like?',
    quickAnswer: 'Days 1–14: lock assets and distribute. Days 15–28: pitch editorial, launch pre-saves, service the record to DJs. Days 29–35: release week — concentrate everything. Days 36–60: work reactions into playlists, radio, and bookings, then fire wave two. Every step below is dated.',
    longAnswer: 'Day 1 is 60 days before your release date, so start by working backwards from the date you have. This is a sample campaign you can run exactly as written — a 60-day window with release day on Day 29. It assumes one finished song and a modest budget, and it front-loads the work that most campaigns skip: getting the record into DJ hands before the public can stream it. Print it, put real dates on it, and start on Day 1.',
    sections: [
      {
        h2: 'Days 1–7: Lock the Record',
        html: `<ul>
<li><strong>Day 1:</strong> final master approved — test it on a car system, earbuds, and a loud speaker</li>
<li><strong>Days 2–3:</strong> cut the clean edit and export the instrumental; 320kbps MP3 + WAV of all three versions</li>
<li><strong>Days 4–5:</strong> artwork final at 3000×3000; metadata sheet written (exact artist name, title, features, producers, BPM, genre); splits agreed in writing</li>
<li><strong>Days 6–7:</strong> claim/update Spotify for Artists and Apple Music for Artists; make every profile photo, name, and bio match</li>
</ul>`
      },
      {
        h2: 'Days 8–14: Paperwork and Ammunition',
        html: `<ul>
<li><strong>Day 8:</strong> upload to your distributor with release date = Day 29 (this buys the full editorial pitch window)</li>
<li><strong>Days 9–11:</strong> shoot your content batch in one or two sessions — the announcement post, 3–5 hook teasers (same 10–15 seconds each time), and release-week clips. Release week is for posting, not producing.</li>
<li><strong>Days 12–13:</strong> register with a PRO if you haven't (ASCAP/BMI/SESAC); set up your link-in-bio page</li>
<li><strong>Day 14:</strong> write your one-sheet: who you are, the record, notable activity, contact</li>
</ul>`
      },
      {
        h2: 'Days 15–21: Open the Campaign',
        html: `<ul>
<li><strong>Day 15:</strong> pitch Spotify editorial via Spotify for Artists — every field filled</li>
<li><strong>Day 15:</strong> pre-save link live; announcement post goes up (artwork + date)</li>
<li><strong>Days 16–21:</strong> teaser #1 runs; every post carries one ask: pre-save</li>
<li><strong>Days 18–21:</strong> personally tell your inner circle (20–50 people) the date — individual messages, not a blast</li>
</ul>`
      },
      {
        h2: 'Days 22–28: Service the DJs',
        html: `<p><strong>This is the week that separates this plan from a normal rollout.</strong></p>
<ul>
<li><strong>Day 22:</strong> submit the record for DJ service — clean, dirty, and instrumental with correct metadata. One submission through Digiwaxx reaches ${'30,000+'} club, mixshow, and radio DJs, so working DJs have the record a full week before the public.</li>
<li><strong>Days 23–27:</strong> teaser #2 + behind-the-song story; watch for early DJ downloads and feedback</li>
<li><strong>Day 27:</strong> repost any early spins or DJ reactions — "out Friday" hits different when rooms already heard it</li>
<li><strong>Day 28:</strong> "tomorrow" post; final personal reminders; tomorrow's checklist ready</li>
</ul>`
      },
      {
        h2: 'Days 29–35: Release Week — Concentrate Everything',
        html: `<ul>
<li><strong>Day 29 (Release Day):</strong> verify live on every DSP at midnight; every link updated within hour one; announcement posted; personal messages out; every share and spin amplified in real time. Run the <a href="/tools/release-day-checklist">interactive checklist</a>.</li>
<li><strong>Days 30–32:</strong> daily content from your batch; reply to every comment; thank every DJ, curator, and supporter by name</li>
<li><strong>Days 33–35:</strong> log week-one numbers (streams, saves, playlist adds, DJ downloads, any spins) — this becomes your pitch kit</li>
</ul>`
      },
      {
        h2: 'Days 36–49: Work the Reactions',
        html: `<ul>
<li><strong>Days 36–38:</strong> pitch independent playlist curators with the week-one proof attached — two sentences, direct link, receipts</li>
<li><strong>Days 39–42:</strong> pitch mixshows and college radio in any city where DJ activity showed up; include the clean version and one-sheet</li>
<li><strong>Days 43–49:</strong> concentrate on the reacting market: repost clips, tag venues and DJs, reach out to promoters about performing where the record is warm</li>
</ul>`
      },
      {
        h2: 'Days 50–60: Fire Wave Two',
        html: `<ul>
<li><strong>Days 50–53:</strong> release the second asset — video, visualizer upgrade, remix, or acoustic version — as a fresh news moment</li>
<li><strong>Days 54–57:</strong> second content burst around the new asset; re-pitch anyone who went quiet, now with 30 days of data</li>
<li><strong>Days 58–60:</strong> full campaign review — what reacted, where, and through whom. Feed every lesson into the next release, and keep the DJs who supported you fed first next time.</li>
</ul>`
      },
    ],
    stats: [
      { n: '29', l: 'Day your record drops — with DJs already on it a week early' },
      { n: '30,000+', l: 'DJs reached in the Day-22 service step' },
      { n: '2', l: 'Promotion waves built into the plan — most campaigns quit after one' },
    ],
    faq: [
      { q: 'Can I compress this into 30 days?', a: 'Yes — cut days 1–14 to one week (assets and distribution) and keep everything from Day 15 on in sequence. The two things you must not cut: 3+ weeks of distributor lead time and pre-release DJ service.' },
      { q: 'What budget does this plan assume?', a: 'It works from roughly $200–$500: packaging (mastering/edits if needed), DJ service, and a small content budget. Use the Release Budget Calculator to get your exact split.' },
      { q: 'What if the record is already out?', a: 'Switch to the 30-Day Post-Release Sprint — same machinery, re-ordered for a live record. Everything except editorial pitching still works after release.' },
    ],
    related: ['30-day-post-release-sprint', 'release-day-checklist', 'release-budget-calculator', 'song-rollout-timeline'],
    cta: { kicker: 'Day 22 is one click', headline: 'Launch the DJ service step now.', sub: 'The rest of the plan is your work. This step is ours: your record serviced to 30,000+ DJs, packaged the way they need it.', button: 'Submit Your Record' },
  },
  {
    slug: '30-day-post-release-sprint',
    category: 'campaigns',
    featured: true,
    title: 'The 30-Day Post-Release Sprint',
    navLabel: '30-Day Post-Release Sprint',
    metaTitle: 'The 30-Day Post-Release Sprint: Revive a Released Record | Digiwaxx',
    description: 'A dated 30-day campaign for a record that is already out: packaging fixes, DJ service, a two-week content burst, and proof-backed pitching.',
    question: 'How do I run a real campaign on a song that is already released?',
    quickAnswer: 'Days 1–5: fix packaging and submit to DJ service. Days 6–19: run a two-week content burst around one hook moment while DJs test the record. Days 20–30: pitch curators and mixshows with the proof the sprint produced, and book the plan for wave two.',
    longAnswer: 'This is the campaign for the most common situation in independent music: the song is out, the launch was quiet, and you want a structured way to give it a real shot. It runs 30 days, needs no re-upload, and is built around one principle — a released record does not need another platform; it needs people. Put real dates on it and start.',
    sections: [
      {
        h2: 'Days 1–5: Repair and Service',
        html: `<ul>
<li><strong>Day 1:</strong> audit the record like a stranger — clean version? instrumental? correct tags? artwork that reads professional at thumbnail size?</li>
<li><strong>Days 2–3:</strong> fix what failed the audit; export clean, dirty, and instrumental at full quality</li>
<li><strong>Day 4:</strong> submit for DJ service — pools take released records every day; DJs care whether it works in a room, not when it dropped</li>
<li><strong>Day 5:</strong> set your baseline: screenshot current streams, saves, listeners, and sources so you can measure the sprint honestly</li>
</ul>`
      },
      {
        h2: 'Days 6–19: The Burst',
        html: `<ul>
<li><strong>Pick one moment:</strong> the 10–15 seconds of the song people react to — every post in the burst uses it</li>
<li><strong>Post daily or near-daily</strong> for two weeks: performance clips, the story behind the record, any DJ activity the service produces</li>
<li><strong>Days 8–12:</strong> personal outreach round — 20–50 individual messages to real supporters with a direct link</li>
<li><strong>Every DJ download, spin, or comment gets amplified same-day</strong> — tag the DJ, thank them publicly, save every clip to your proof kit</li>
</ul>`
      },
      {
        h2: 'Days 20–30: Pitch With Receipts',
        html: `<ul>
<li><strong>Days 20–23:</strong> pitch independent curators — two sentences, the strongest clip or stat from the burst, direct link</li>
<li><strong>Days 24–26:</strong> pitch mixshows and college radio in any market where the record showed life; clean version and one-sheet attached</li>
<li><strong>Days 27–29:</strong> compare against your Day-5 baseline: sources, cities, save rate. Decide wave two — video, remix, or doubling down on the one city that moved</li>
<li><strong>Day 30:</strong> schedule wave two. A record with two waves behind it is a campaign; a record with one is an attempt.</li>
</ul>`
      },
    ],
    stats: [
      { n: '0', l: 'Re-uploads required — never delete a live record to relaunch it' },
      { n: '14', l: 'Days of concentrated content in the burst window' },
      { n: '30,000+', l: 'DJs the Day-4 service step puts your record in front of' },
    ],
    faq: [
      { q: 'My song has been out for months — does this still apply?', a: 'Yes. DJs, curators, and algorithms respond to current activity, not release dates. A six-month-old record with fresh spins and content is a current record.' },
      { q: 'What results should I expect in 30 days?', a: 'Honest answer: movement, not miracles — DJ downloads and feedback, first spins, measurable source changes in Spotify for Artists, and a proof kit that makes every next pitch stronger. Records compound across waves, not weeks.' },
    ],
    related: ['60-day-release-plan', 'how-to-promote-a-single-after-release', 'my-song-isnt-getting-streams', 'release-budget-calculator'],
    cta: { kicker: 'Day 4 is one click', headline: 'Start the sprint with the service step.', sub: 'Your record in front of 30,000+ working DJs this week — the people layer your launch was missing.', button: 'Submit Your Record' },
  },
  {
    slug: 'club-record-campaign',
    category: 'campaigns',
    featured: true,
    title: 'The Club Record Campaign',
    navLabel: 'Club Record Campaign',
    metaTitle: 'The Club Record Campaign: From Serviced to Spinning | Digiwaxx',
    description: 'A focused 6-week campaign to get a record tested and spinning in club rooms: packaging, DJ service, reaction harvesting, and converting spins into bookings.',
    question: 'How do I run a campaign to get my record played in clubs?',
    quickAnswer: 'Six weeks: week 1 packaging (clean/dirty/instrumental, mixable structure), week 2 DJ service to the full network, weeks 3–4 harvesting reactions (clips, tags, DJ relationships), weeks 5–6 concentrating on the rooms and cities that reacted — and converting spins into bookings.',
    longAnswer: 'This campaign has one goal: real spins in real rooms. It works for hip hop, R&B, afrobeats, dancehall, Latin, and any record built for a dance floor. It is also the highest-leverage campaign in this library, because club reaction feeds everything else — content, radio, playlists, bookings — for months after the six weeks end.',
    sections: [
      {
        h2: 'Week 1: Build a Record DJs Can Use',
        html: `<ul>
<li>Test the mix on a loud system — club translation is pass/fail</li>
<li>Export clean, dirty, and instrumental; consider a DJ edit with a longer intro</li>
<li>Metadata exactly right: artist, title, features, BPM, genre — it has to file correctly in a DJ library</li>
</ul>`
      },
      {
        h2: 'Week 2: Service Wide',
        html: `<p>Submit to the pool and let the network do what one artist never could: put the record in thousands of professional crates at once — club residents, mixshow jocks, mobile DJs across every major market. Digiwaxx has run this pipeline since 1998; the record goes out to ${'30,000+'} DJs, and download activity starts telling you immediately which formats and cities are picking it up.</p>`
      },
      {
        h2: 'Weeks 3–4: Harvest Every Reaction',
        html: `<ul>
<li>Watch the feedback: which DJs downloaded it, what they said, where it is getting tested</li>
<li>Every spin becomes content — crowd clips, DJ shoutouts, venue tags, posted same-week</li>
<li>Thank every DJ personally; the ones who respond become your five core DJ relationships</li>
<li>Other DJs copy what works: one visibly reacting room is your pitch to ten more</li>
</ul>`
      },
      {
        h2: 'Weeks 5–6: Concentrate and Convert',
        html: `<ul>
<li>Pick the one or two cities where reaction is strongest and pour in: local content, local tags, local mixshow pitches with local proof</li>
<li>Contact promoters at the venues where it is spinning — the room already knows the song; performing it is the natural next step</li>
<li>Feed the geographic streaming spike: the searches and Shazams club play creates are exactly what algorithms amplify</li>
</ul>`
      },
    ],
    stats: [
      { n: '3', l: 'Versions a club campaign lives or dies on: clean, dirty, instrumental' },
      { n: '30,000+', l: 'DJ crates one submission reaches' },
      { n: '2', l: 'Cities to concentrate on once reactions map — depth beats spray' },
    ],
    faq: [
      { q: 'What kind of record works for this campaign?', a: 'Anything a DJ can program: club tempo and energy, a mixable structure, and professional sound on a big system. If your record is a bedroom-listening ballad, run the 60-Day Release Plan instead and lean on playlists and content.' },
      { q: 'How do I know if it’s working?', a: 'In order: DJ downloads (days), DJ feedback (week one), first spins and clips (weeks 2–4), repeat spins — the real signal — and Shazam/search activity in spin cities (weeks 3–6).' },
    ],
    related: ['get-club-plays', 'how-club-djs-discover-new-songs', '60-day-release-plan', 'get-booked-for-shows'],
    cta: { kicker: 'Week 2 is one click', headline: 'Service your record to the network.', sub: 'The campaign starts when the record hits the crates: 30,000+ DJs, one submission.', button: 'Submit Your Record' },
  },
  {
    slug: '90-day-new-artist-launch',
    category: 'campaigns',
    featured: true,
    title: 'The 90-Day New Artist Launch',
    navLabel: '90-Day New Artist Launch',
    metaTitle: 'The 90-Day New Artist Launch Plan | Digiwaxx',
    description: 'Launching from zero: a 90-day plan covering foundation (profiles, sound, first record), first release with DJ service, and the second-release compounding cycle.',
    question: 'How does a brand-new artist launch in 90 days?',
    quickAnswer: 'Month 1: foundation — identity, profiles, and two finished records. Month 2: release record one on the full playbook, including DJ service. Month 3: read the data, release record two into the warmed-up channels, and lock the 4–8 week cadence that compounds from here.',
    longAnswer: 'Launching from zero is actually an advantage used correctly: you can build the foundation right the first time, and your first release can enter the world through professional channels instead of a friends-and-family upload. This plan produces something specific by Day 90 — two released records, real DJ exposure, first data, and a repeatable cycle.',
    sections: [
      {
        h2: 'Days 1–30: Foundation',
        html: `<ul>
<li><strong>Identity:</strong> artist name (searchable, unclaimed — check every platform and Google first), photo, 2–3 sentence bio naming your city and sound</li>
<li><strong>Profiles:</strong> claim everything with identical name/photo/bio — Spotify, Apple, YouTube, Instagram, TikTok, Audiomack</li>
<li><strong>Product:</strong> finish TWO records to release standard (mastered, clean edits, instrumentals) — record one launches, record two is loaded behind it</li>
<li><strong>Study:</strong> run through the release guides in <a href="/university">Digiwaxx University</a> once now — 90 days goes fast</li>
</ul>`
      },
      {
        h2: 'Days 31–60: First Release, Full Playbook',
        html: `<ul>
<li><strong>Days 31–38:</strong> distribute record one (release date ≈ Day 59); pitch editorial; shoot the content batch</li>
<li><strong>Days 45–52:</strong> pre-save push and teasers; service the record to DJs — as a new artist, this is the one channel where you compete on equal footing: DJs judge the record, not the follower count. One submission reaches ${'30,000+'} working DJs.</li>
<li><strong>Days 59–60:</strong> release day on the <a href="/tools/release-day-checklist">checklist</a>; concentrate everything into 72 hours</li>
</ul>`
      },
      {
        h2: 'Days 61–90: Read, Release, Repeat',
        html: `<ul>
<li><strong>Days 61–74:</strong> work record one's reactions — curator and mixshow pitches with proof, content from any DJ activity, personal thank-yous that start real relationships</li>
<li><strong>Days 75–82:</strong> tee up record two: distribute with lead time, pitch editorial, tease — every channel is warmer this time (followers, Release Radar, DJs who know the name)</li>
<li><strong>Days 83–90:</strong> release record two and compare data ruthlessly: which song, which content, which cities. That comparison is your sound and your market talking to you — the next 90 days follow it.</li>
</ul>`
      },
    ],
    stats: [
      { n: '2', l: 'Records released by Day 90 — cadence beats perfection' },
      { n: '30,000+', l: 'DJs your first record reaches — the channel where new artists compete evenly' },
      { n: '4–8', l: 'Week release cadence to lock in after launch' },
    ],
    faq: [
      { q: 'Why two records instead of a perfect debut?', a: 'Because the second release is where everything compounds: Release Radar has followers, DJs recognize the name, and you have data instead of guesses. One "perfect" debut with nothing behind it restarts from zero.' },
      { q: 'Should a new artist spend money on promotion?', a: 'Modestly and in the right order: packaging first, DJ service second, small content budget third — the same priorities as the Release Budget Calculator. Skip ads entirely until something is organically reacting.' },
    ],
    related: ['60-day-release-plan', 'music-promotion-for-beginners', 'i-made-a-song', 'how-many-songs-should-i-release'],
    cta: { kicker: 'Ready to launch?', headline: 'Give your first record the full playbook.', sub: 'New artists compete evenly in one place: the record itself, in front of 30,000+ DJs.', button: 'Submit Your Record' },
  },
];
