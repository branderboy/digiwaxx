// The shipped nav and footer, lifted verbatim from the built pages.
//
// These two blocks drifted away from lib.js: commits after the generator was
// written added the logo images, the Contact Us link, the Global Campaigns
// and Blog & Press columns, and the genre/city/platform split, all of them
// edited straight into the built HTML. Regenerating threw that work away.
//
// They are curated content now, not something the generator can derive from
// the page list: the press link points off-site and the market links are a
// business decision about which of the thirteen markets to surface. So they
// live here as content, the way scripts/seo/lib.py already holds the same
// chrome for the pages it builds. Edit this file to change the site chrome,
// and both the Node generator and the built pages stay in agreement.
//
// Only the copyright year is interpolated.

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
  <p class="cfooter-copy">&copy; ${new Date().getFullYear()} Digiwaxx Media. All rights reserved.</p>
</footer>`;

module.exports = { NAV, FOOTER };
