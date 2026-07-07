// Layer 6 — Artist Journey: organized by what the artist is thinking,
// not by keyword. Each stage pushes one level deeper into the funnel.
module.exports = [
  {
    slug: 'i-made-a-song',
    category: 'journey',
    featured: true,
    title: '“I Made a Song.” — Now What?',
    navLabel: 'Stage 1: I Made a Song',
    metaTitle: 'I Made a Song — Now What? The Complete Next Steps | Digiwaxx',
    description: 'You finished a song. The exact next steps: mastering, versions, artwork, metadata, ISRC, distribution, and lining up the people who will play it.',
    question: 'I made a song — what do I do now?',
    quickAnswer: 'Before anyone hears it: master it, cut clean and instrumental versions, lock your metadata and splits, get 3000×3000 artwork, distribute with 3+ weeks lead time — and line up the humans (DJs, curators) who will actually play it, before release day.',
    longAnswer: 'A finished song and a releasable record are different products. The gap between them is a checklist, not a mystery — and every item on it exists because someone downstream (a DSP, a DJ, a radio station, a royalty system) needs it. Here is the full path from bounce to release-ready.',
    sections: [
      {
        h2: 'Make It a Record, Not a File',
        html: `<ul>
<li><strong>Master it</strong> — professionally if possible; your mix competing next to major releases is the standard</li>
<li><strong>Cut your versions:</strong> clean edit, instrumental, and the main. Radio and most DJs cannot use an explicit-only file — this single step multiplies who can play you</li>
<li><strong>Artwork:</strong> 3000×3000, readable at thumbnail size, no logos you don't have rights to</li>
</ul>`
      },
      {
        h2: 'The Paperwork That Pays You',
        html: `<ul>
<li><strong>Metadata:</strong> exact artist name (matching every platform), title, features, producers — decided once, spelled identically everywhere</li>
<li><strong>Splits:</strong> who owns what, agreed in writing while everyone is still friends</li>
<li><strong>ISRC:</strong> the tracking code for your recording — your distributor typically assigns one free</li>
<li><strong>Publishing basics:</strong> register with a PRO (ASCAP/BMI/SESAC) so performance royalties from radio and venues have somewhere to go</li>
</ul>`
      },
      {
        h2: 'Distribution — and the Step Everyone Skips',
        html: `<p>Pick a distributor and upload with at least three weeks of lead time so you can pitch editorial and build a pre-save. Then the skipped step: <strong>line up the people</strong>. Platforms make your record available; people make it heard. Service the record to DJs before release so it enters the world with rooms already testing it — that is the difference between launching to an audience and launching to a void.</p>`
      },
    ],
    faq: [
      { q: 'Should I copyright my song before releasing it?', a: 'Your work is copyrighted upon creation; formal registration (e.g., with the US Copyright Office) adds legal enforcement power. Registering finished works — individually or in batches — is cheap insurance before wide release.' },
      { q: 'Do I need a label to release a song?', a: 'No. Distribution, DJ service, playlist pitching, and radio are all directly accessible to independents now. What a label provides is money and staff — both replaceable with knowledge and consistency at the single level.' },
    ],
    related: ['how-to-release-a-single', 'music-marketing-checklist', 'i-released-it', 'release-day-checklist'],
  },
  {
    slug: 'i-released-it',
    category: 'journey',
    title: '“I Released It… and Nothing Happened.”',
    navLabel: 'Stage 2: I Released It',
    metaTitle: 'I Released My Song and Nothing Happened — The Fix | Digiwaxx',
    description: 'No streams, no saves, no playlist adds after release? Why silence is the default for unpromoted records, and the exact recovery plan.',
    question: 'I released my song and nothing happened — what now?',
    quickAnswer: 'Nothing happened because release ≠ promotion: an upload makes your song available to people who already know it exists. The fix is adding discovery channels now — DJ service, curator pitching, content waves — all of which work on already-released records.',
    longAnswer: 'This is the most common moment in an independent career, and the most dangerous — it is where artists conclude the music is bad, or the game is rigged, and quit. The truth is more boring and more fixable: with ~100,000 tracks uploaded daily, silence is the default outcome for any record that no external audience was ever exposed to. You skipped a step; you did not fail a test.',
    sections: [
      {
        h2: 'Read the Data Before You React',
        html: `<p>Open Spotify for Artists: where did the few streams come from? If it is all your own profile and followers, you have a discovery problem (normal, fixable). If external sources delivered listeners who skipped fast, you may have a first-30-seconds or packaging problem. Different problems, different fixes — thirty seconds of data beats a week of self-doubt.</p>`
      },
      {
        h2: 'The Recovery Sequence',
        html: `<ol>
<li><strong>Fix packaging gaps</strong> — clean version, instrumental, correct tags, professional artwork</li>
<li><strong>Open a discovery channel:</strong> service the record to DJs (pools take released records — DJs care whether it works, not when it dropped)</li>
<li><strong>Run a two-week content burst</strong> around one hook moment, not the whole song</li>
<li><strong>Pitch with whatever the above produces</strong> — a DJ download report, one club clip, or a small streams uptick is a real pitch to curators and mixshows</li>
</ol>`
      },
      {
        h2: 'What Not to Do',
        html: `<ul>
<li><strong>Don't delete and re-upload</strong> — you lose history and fix nothing</li>
<li><strong>Don't buy streams</strong> — botted numbers poison the data platforms use to evaluate you and risk removal</li>
<li><strong>Don't drop the next song as an escape</strong> — the same missing promotion produces the same silence; add the promotion layer first, then keep releasing on top of it</li>
</ul>`
      },
    ],
    faq: [
      { q: 'How long should I keep promoting a song that started slow?', a: 'Give an active push 4–6 weeks before judging. A slow start with zero promotion is no verdict at all — verdicts come from qualified audiences (DJs, rooms, targeted listeners) actually hearing it.' },
      { q: 'Is it normal to get almost no streams on a first release?', a: 'Completely. Nearly every working artist’s first releases did tiny numbers. The difference-maker is what they did next: added distribution channels for attention, not just files.' },
    ],
    related: ['my-song-isnt-getting-streams', 'how-to-promote-a-single-after-release', 'i-need-people', 'why-nobody-listens-to-my-music'],
  },
  {
    slug: 'i-need-people',
    category: 'journey',
    featured: true,
    title: '“I Need People.” — Building Your Amplification Network',
    navLabel: 'Stage 3: I Need People',
    metaTitle: 'Your Record Needs People: DJs, Radio, Curators, Blogs | Digiwaxx',
    description: 'The people layer of music promotion: DJs, radio, playlist curators, blogs, and influencers — what each one does, in what order, and how to reach them.',
    question: 'Who are the people who can amplify my music, and how do I reach them?',
    quickAnswer: 'Five groups amplify records: DJs (real-world reaction), radio (mass trust), playlist curators (streaming scale), blogs/press (narrative), and influencers (short-form reach). Work them in that order — DJ reaction creates the proof every other group responds to.',
    longAnswer: 'Every record that grows beyond its maker’s reach was carried by other people’s audiences. This page is the map of those people: what each group actually does for a record, what they need from you, and the order that makes each group easier to win than the last. The order matters — most artists pitch press and playlists first, with nothing to show, and get silence.',
    sections: [
      {
        h2: 'The Five Amplifier Groups',
        html: `<ul>
<li><strong>DJs (club, mixshow, mobile):</strong> the reaction engine — full-attention exposure in rooms, honest feedback, and the earliest possible proof a record works. Reached at scale through record pools; Digiwaxx has serviced DJs since 1998 and reaches ${'30,000+'}.</li>
<li><strong>Radio:</strong> mass familiarity and legitimacy — entered through mixshows and college radio, which run on DJ culture</li>
<li><strong>Playlist curators:</strong> streaming-scale distribution for records with visible momentum</li>
<li><strong>Blogs & press:</strong> the narrative layer — they cover stories, and traction is the story</li>
<li><strong>Influencers/creators:</strong> short-form reach that converts when the record has a usable moment (a hook, a dance, a mood)</li>
</ul>`
      },
      {
        h2: 'Why DJs Come First',
        html: `<p>Every other group's decision gets easier when the record has proof, and DJs are the fastest, most accessible source of proof: service the record, get real spins and clips, and suddenly your curator pitch has receipts, your mixshow pitch has club activity, your press pitch has a story, and your influencer outreach has crowd footage. One layer unlocks the next four.</p>`
      },
      {
        h2: 'The Outreach Rules (All Groups)',
        html: `<ul>
<li>Make it effortless: right files, right links, two-sentence pitch</li>
<li>Bring proof, not adjectives — one clip of a room reacting beats any bio</li>
<li>Give before asking: support their work visibly and specifically</li>
<li>Follow up once, a week later, then move on — volume of qualified targets beats pressure on one</li>
</ul>`
      },
    ],
    faq: [
      { q: 'Do music blogs still matter?', a: 'Less as traffic, still meaningful as credibility: press coverage seeds your search results, feeds editorial and AI answers about you, and gives radio and playlist gatekeepers third-party validation.' },
      { q: 'How do I get influencers to use my song?', a: 'Make it easy and specific: identify creators whose content already fits the record’s moment, offer the sound with a clear idea, and consider paid seeding once organic reaction proves the record has a usable hook.' },
    ],
    related: ['how-to-reach-djs', 'how-to-get-radio-play', 'get-playlist-placement', 'im-getting-traction'],
  },
  {
    slug: 'im-getting-traction',
    category: 'journey',
    title: '“I’m Getting Traction.” — Converting Momentum Into a Career',
    navLabel: 'Stage 4: Getting Traction',
    metaTitle: 'Your Song Is Getting Traction — Convert It: Bookings, Royalties, Publishing | Digiwaxx',
    description: 'The record is moving — now convert: bookings, complete royalty collection, publishing, performance rights, sync, and the next-release flywheel.',
    question: 'My song is getting traction — how do I capitalize on it?',
    quickAnswer: 'Convert traction on four fronts at once: monetize attention (bookings, merch), collect every royalty stream (distribution, publishing, PRO, neighboring rights), deepen the markets that are reacting, and ship the follow-up while the audience is warm.',
    longAnswer: 'Traction is perishable. Spins, streams, and attention decay unless they are converted into durable assets: fans you can reach, income you collect, relationships that outlast the single, and a catalog that compounds. This is the stage where hobbyists celebrate and professionals build systems.',
    sections: [
      {
        h2: 'Collect All the Money You’re Owed',
        html: `<ul>
<li><strong>Recording royalties:</strong> via your distributor — already flowing</li>
<li><strong>Performance royalties:</strong> a PRO (ASCAP/BMI/SESAC) collects when your song plays on radio, in venues, on streams — unregistered songwriters simply forfeit this</li>
<li><strong>Publishing administration:</strong> a publishing admin collects mechanicals and international royalties PROs miss</li>
<li><strong>Digital performance royalties</strong> (SoundExchange in the US) for non-interactive streams and internet radio</li>
<li><strong>Sync:</strong> a moving record with an instrumental on file is exactly what TV/ad/game supervisors license</li>
</ul>`
      },
      {
        h2: 'Convert Attention Into Bookings and Fans',
        html: `<p>Book the cities where the record reacts while it is warm — DJ spin geography tells you exactly where. Every show mints superfans; every superfan needs a capture point (mailing list, community, socials) you own. The record made strangers care; the machine you build now decides whether they still care in a year.</p>`
      },
      {
        h2: 'Feed the Flywheel',
        html: `<p>The follow-up release matters more now than any release before it: you finally have an audience primed to respond on day one, which means every algorithm and gatekeeper watches the next drop with interest. Keep the cadence (4–8 weeks), keep servicing DJs — the network that broke the last record is warm for the next one — and reinvest a fixed share of new income into the next campaign. Careers are built by artists who treat traction as fuel, not a finish line.</p>`
      },
    ],
    faq: [
      { q: 'When should I register with a PRO?', a: 'Now — before the next spin. Performance royalties are only collectable going forward in most cases; every month unregistered while your record plays on radio and in venues is money permanently lost.' },
      { q: 'Should I sign the label deal that traction attracts?', a: 'Only from leverage and only with representation. Traction you built independently is exactly what makes deals better — the longer you can keep growing alone, the better the terms get. Never sign anything without an entertainment lawyer.' },
      { q: 'How do I keep momentum between releases?', a: 'Alternate assets: remix, video, live version, acoustic — each is a new wave for the same record. Between records, DJs keep the song alive in rooms; keep feeding and thanking that network.' },
    ],
    related: ['get-booked-for-shows', 'how-many-songs-should-i-release', 'why-my-song-stopped-growing', 'get-radio-spins'],
  },
];
