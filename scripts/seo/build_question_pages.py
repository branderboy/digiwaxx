#!/usr/bin/env python3
"""Pages built from the November 2026 Search Console and Keyword Planner data.

  /answers/is-digiwaxx-still-in-service   "is digiwaxx still in serbice 2026"
                                          114 impressions, position 1.82, 0 clicks
  /guides/how-to-promote-your-music       the 16 Keyword Planner questions at
                                          100-1K searches a month, all one intent
  /promotion/soundcloud-promotion         23 SoundCloud questions, 4 at 100-1K,
                                          no page on the site

The Add A Guest Post answer-page pattern: the question is the H1, a direct
answer comes first, the query variants are H2s on the one page (not new URLs),
FAQPage schema. Nothing here claims Digiwaxx sells plays, placements or
SoundCloud results; the packages are DJ servicing, Digiwaxx Radio, the DJ Call
feature and Elite coverage.

Writes the pages, then ./build.sh --apply picks them up for hubs, mesh,
llms.txt and the sitemaps.

Usage: build_question_pages.py [--apply]
"""
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import ROOT, SITE, head, chrome, breadcrumb_ld  # noqa: E402

TODAY = "2026-11-14"
SECTION_NAMES = {"answers": "Answers", "guides": "Guides", "promotion": "Promotion"}

STATS = """<div class="stats-row">
  <div class="stat"><div class="stat-n">30,000+</div><div class="stat-l">DJs in the Digiwaxx network</div></div>
  <div class="stat"><div class="stat-n">1998</div><div class="stat-l">Serving records to DJs since</div></div>
  <div class="stat"><div class="stat-n">72 hrs</div><div class="stat-l">Submissions reviewed within</div></div>
</div>"""

CTA = """<section class="cta-block">
  <p class="cta-kicker">Ready?</p>
  <h2>Submit your record to Digiwaxx.</h2>
  <p class="cta-sub">Your music in front of 30,000+ club, radio and mixshow DJs, the network that has been breaking records since 1998.</p>
  <a class="cta-btn" href="/#pricing">Promote My Record &rarr;</a>
  <p class="cta-tiers">Starter $99 &middot; Pro $149 &middot; Elite $199, one-time payment, no contracts.</p>
</section>

<div class="funnel-strip">
  <span>Question</span><i>&rarr;</i><span>Guide</span><i>&rarr;</i>
  <a href="/university">University</a><i>&rarr;</i>
  <a href="/#pricing">Pricing</a><i>&rarr;</i>
  <a href="/#pricing"><b>Submit Your Record</b></a>
</div>"""

PAGES = [
    {
        "path": "answers/is-digiwaxx-still-in-service",
        "title": "Is Digiwaxx Still in Service in 2026? Yes, Still Running",
        "desc": "Yes. Digiwaxx is still in service in 2026 and still takes new records. "
                "You can submit your song today to 30,000+ DJs and Digiwaxx Radio. Running since 1998.",
        "h1": "Is Digiwaxx Still in Service in 2026?",
        "question": "Is Digiwaxx still in service, and can I still send it my music?",
        "qa": "Yes. Digiwaxx is still in service in 2026. It has serviced records to DJs since 1998, "
              "and this site, promote.digiwaxx.com, takes artist and label submissions right now "
              "through three campaigns: Starter, Pro and Elite.",
        "long": "People search this because Digiwaxx has been around a long time and the music business "
                "has changed around it. The short version: the record pool is still running, the DJ "
                "network is still being serviced, and new records are still going out to it.",
        "sections": [
            ("What Digiwaxx Does in 2026", """<ul>
<li><strong>Record pool placement:</strong> your record goes into the Digiwaxx DJ network of 30,000+ club, mixshow, radio and mobile DJs</li>
<li><strong>Digiwaxx Radio:</strong> every campaign gets the &ldquo;Make It or Break It&rdquo; feature</li>
<li><strong>DJ Call:</strong> Pro campaigns are featured on the NEW MUSIC WEDNESDAYS DJ Call, plus an Instagram story on @digiwaxx</li>
<li><strong>Coverage and reporting:</strong> Elite adds a Performance Snapshot Report and an official Digiwaxx.com artist write-up</li>
</ul>"""),
            ("How to Check for Yourself", """<p>You do not have to take a page's word for it. Submit a record through the form on the <a href="/#pricing">home page</a> and the team reviews it within 72 hours. You can also reach the desk directly on the <a href="/contact">contact page</a>, or see what is being posted on Instagram at @digiwaxx.</p>"""),
            ("Who Uses Digiwaxx Now", """<p>Independent artists use it for single, EP, album and mixtape campaigns. Managers and producers use it for their rosters. International labels and distributors use it to get releases to U.S. DJs, with markets across <a href="/africa">Africa</a>, <a href="/es/promocion-dj-estados-unidos">Latin America</a> and Asia. Start from <a href="/promote/promote-my-single">Promote My Single</a> or <a href="/labels">the label page</a>, depending on which one you are.</p>"""),
        ],
        "faq": [
            ("Is Digiwaxx a record pool?",
             "Yes. Digiwaxx is a record pool: it delivers new music from artists and labels to working DJs, and it has done that since 1998."),
            ("How do I submit my music to Digiwaxx?",
             "Fill out the form on the home page with your artist name, song title and a link to the record, then choose Starter, Pro or Elite. It is a one-time payment with no contract."),
            ("Can artists outside the U.S. use Digiwaxx?",
             "Yes. International artists, labels and distributors send releases to the U.S. DJ network. The labels page and the Africa, Latin America and Asia pages explain how."),
            ("How long until my record goes out?",
             "Submissions are reviewed within 72 hours. Once your campaign is confirmed, the record is placed into the DJ network and Digiwaxx Radio."),
        ],
        "related": [("/answers/can-independent-artists-use-digiwaxx", "Answers", "Can Independent Artists Use Digiwaxx?"),
                    ("/answers/what-happens-after-you-submit-music", "Answers", "What Happens After You Submit Music?"),
                    ("/answers/how-record-pools-work", "Answers", "How Record Pools Work"),
                    ("/promote/music-promotion-service", "Services", "Music Promotion Service")],
    },
    {
        "path": "guides/how-to-promote-your-music",
        "title": "How to Promote Your Music in 2026: A Step-by-Step Plan",
        "desc": "Learn how to promote your music, market it and get it heard: what to do before "
                "release, in release week and after, and where to post your song so it lands.",
        "h1": "How to Promote Your Music",
        "question": "How do I promote my music so people actually hear it?",
        "qa": "Promote your music in this order: finish and package the record, set a release date and "
              "plan backward from it, put the song in front of people who already play music for "
              "audiences (DJs, radio hosts, curators) before release week, post content around it the "
              "whole way through, then put money behind whatever is already reacting. Uploading is not "
              "promotion.",
        "long": "Most artists search this after the upload, when nothing happened. The fix is the same "
                "whether you call it promoting, marketing or advertising your music: borrow audiences "
                "that already exist, give them a reason to react, and make sure there is somewhere for "
                "that reaction to land.",
        "sections": [
            ("How to Promote Your Music, Step by Step", """<ol>
<li><strong>Package the record.</strong> Final master, clean and dirty versions, artwork, a short bio and one good photo. DJs and curators skip anything that is not ready to use. The <a href="/tools/epk-builder">EPK builder</a> and <a href="/tools/artist-bio-generator">bio generator</a> get this done fast.</li>
<li><strong>Pick a date and work backward.</strong> Four to eight weeks of runway lets you deliver to your distributor, pitch editorial and line up everything below. The <a href="/campaigns/60-day-release-plan">60-day release plan</a> dates every step.</li>
<li><strong>Get it to the people who play music for others.</strong> DJs, radio and mixshow hosts, and curators turn one play into a room or a show full of listeners. Record pool service reaches thousands of working DJs in one submission.</li>
<li><strong>Post around the record, not just about it.</strong> Short clips of the hook, the story behind the song, reactions from rooms where it played. Plan two or three weeks of content before release day.</li>
<li><strong>Concentrate release week.</strong> Everything lands in the same seven days: socials, DJ spins, radio, emails, so every platform sees a spike at once.</li>
<li><strong>Work the reaction for 60 days.</strong> Follow up with the DJs and outlets that responded, push the clips that worked, and fire a second wave. The <a href="/guides/how-to-promote-a-single-after-release">after-release guide</a> covers this part.</li>
</ol>"""),
            ("How to Market Your Music", """<p>Marketing is the plan; promotion is the push. Marketing your music means deciding who the song is for, what the artist looks and sounds like everywhere, and when each release lands. Write those three things down before you spend anything. Then every push, from a DJ campaign to a paid post, points at the same listener with the same story. The <a href="/guides/music-marketing-checklist">music marketing checklist</a> puts it on one page.</p>"""),
            ("How to Advertise Your Music", """<p>Paid ads work best as an amplifier, not a starting point. Run them after a song shows organic signal: a clip that outperforms your others, a city where DJs are playing it, a spike in saves. Then put a small budget behind that exact clip, aimed at that exact audience. Ads aimed at a song nobody has reacted to yet usually buy views that do not turn into fans. The <a href="/tools/release-budget-calculator">release budget calculator</a> helps you split the money.</p>"""),
            ("How to Get Your Music Heard", """<p>If nobody is listening yet, do not try to build an audience from zero. Borrow one. DJs, radio hosts, playlist curators, blogs and creators already have people listening to them; your job is to get the record to them in a form they can use. That is the whole idea behind <a href="/guides/how-to-reach-djs">reaching DJs</a>: one DJ playing your song in a full room is more listeners than most new uploads get in a month. If you are stuck here, read <a href="/guides/why-nobody-listens-to-my-music">why nobody listens to my music</a>.</p>"""),
            ("Where to Post and Promote Your Music", """<ul>
<li><strong>Streaming services</strong> (Spotify, Apple Music, TIDAL): through a distributor, where most fans end up listening</li>
<li><strong>SoundCloud and Audiomack:</strong> direct uploads with no distributor, good for early versions and DJ culture. See <a href="/promotion/soundcloud-promotion">SoundCloud promotion</a> and <a href="/promotion/audiomack-promotion">Audiomack promotion</a></li>
<li><strong>YouTube:</strong> the video, a visualizer and Shorts. See <a href="/promotion/youtube-music-promotion">YouTube music promotion</a></li>
<li><strong>Short video</strong> (TikTok, Reels, Shorts): clips of the hook and the story, where most discovery starts</li>
<li><strong>Record pools:</strong> where working DJs download new music</li>
<li><strong>Blogs and press:</strong> once you have something to say, a press release helps. The <a href="/tools/press-release-generator">press release generator</a> drafts one</li>
</ul>"""),
            ("How to Promote Your Music on Spotify, SoundCloud, YouTube and Apple Music", """<p>Every platform rewards the same thing: people finding the song on their own and coming back to it. Each one has its own levers, from editorial pitching on Spotify to reposts on SoundCloud. The platform playbooks go through them one by one: <a href="/promotion/spotify-playlist-promotion">Spotify</a>, <a href="/promotion/soundcloud-promotion">SoundCloud</a>, <a href="/promotion/youtube-music-promotion">YouTube</a>, <a href="/promotion/apple-music-promotion">Apple Music</a> and <a href="/promotion/audiomack-promotion">Audiomack</a>. The demand that moves all of them usually starts off-platform, in rooms and on radio.</p>"""),
            ("How to Promote a Song Before and After Release", """<p>Before release, the goal is anticipation: pre-saves, teasers, and the record already in DJs' hands. After release, the goal is momentum: following up the reaction and giving the song a second wave. Read <a href="/guides/how-to-build-anticipation">how to build anticipation</a> for the first half and <a href="/guides/song-rollout-timeline">the song rollout timeline</a> for the whole arc.</p>"""),
        ],
        "faq": [
            ("What is the best way to promote your music?",
             "Get the song to people who already have listeners, like DJs, radio hosts and curators, before and during release week, and back it with steady content. Paid ads come after the song shows a reaction, not before."),
            ("How long should you promote a song?",
             "Plan for about 60 days: two to four weeks before release, a concentrated release week, and four to five weeks working the reaction with a second wave."),
            ("Should I pay for music promotion?",
             "Pay for access you cannot get on your own, such as DJ servicing or real curator pitching. Never pay for guaranteed streams, plays or playlist placements; they break platform rules and poison your data."),
            ("How do I get my music to DJs?",
             "Package the record properly and send it through a record pool, which reaches thousands of working DJs in one submission. Digiwaxx has done that since 1998."),
        ],
        "related": [("/guides/music-promotion-for-beginners", "Guides", "Music Promotion for Beginners"),
                    ("/guides/how-to-promote-a-single-after-release", "Guides", "How to Promote a Single After Release"),
                    ("/answers/how-much-does-music-promotion-cost", "Answers", "How Much Does Music Promotion Cost?"),
                    ("/promote/promote-my-single", "Services", "Promote My Single")],
    },
    {
        "path": "promotion/soundcloud-promotion",
        "title": "SoundCloud Promotion: How to Promote Music on SoundCloud",
        "desc": "Promote your music on SoundCloud the way it works now: direct uploads, reposts, "
                "timestamped comments and DJ culture. Then take the reaction to DJs and radio.",
        "h1": "SoundCloud Promotion",
        "question": "How do you promote a song on SoundCloud?",
        "qa": "SoundCloud rewards the activity around a track more than the upload. Upload directly, "
              "with no distributor needed, tag the genre accurately, post early versions and DJ-friendly "
              "edits, trade reposts with artists and DJs in your lane, answer every comment, and send "
              "listeners there from everywhere else. Its real value is that DJs and producers already "
              "live on it.",
        "long": "SoundCloud is not the biggest streaming service, and that is not why you use it. You use "
                "it because it is fast, because it is social in a way the big services are not, and "
                "because DJ and producer culture never left. A track that moves there has a direct line "
                "to the people who play records out.",
        "sections": [
            ("Why SoundCloud Still Matters", """<ul>
<li><strong>Direct uploads:</strong> no distributor lead time, so freestyles, remixes, edits and early versions go up the same day</li>
<li><strong>DJ and producer culture:</strong> DJs post mixes there and dig for edits and new records there</li>
<li><strong>Reposts:</strong> a repost puts your track in front of everyone who follows that account, which is how songs travel on the platform</li>
<li><strong>Timestamped comments:</strong> listeners react to the exact moment in the song, which tells you where the hook lands</li>
</ul>"""),
            ("How to Promote a Song on SoundCloud", """<ol>
<li><strong>Finish the profile.</strong> Photo, banner, a short bio and links to your other platforms, so a new listener can follow you everywhere.</li>
<li><strong>Upload it right.</strong> Clear title (Artist, Song), one accurate genre tag, credits and links in the description, and artwork that reads at thumbnail size.</li>
<li><strong>Release on a schedule.</strong> Regular uploads give followers a reason to come back. Use it for the material that does not need full distribution.</li>
<li><strong>Trade reposts in your lane.</strong> Work with artists, DJs and pages whose followers would actually like the record. Reposts from the wrong audience do nothing.</li>
<li><strong>Answer every comment.</strong> Early on, every listener counts. A reply turns a play into a follower.</li>
<li><strong>Point traffic at it.</strong> Share the link in clips, bios and DMs. SoundCloud does better with listeners you bring than with listeners it has to find for you.</li>
</ol>"""),
            ("How to Get Your Music Heard on SoundCloud", """<p>The tracks that grow there have life outside it: a DJ playing the record in a room, a clip people share, a radio spin. That is what sends new listeners to search for the song. Use SoundCloud as the place the reaction lands, and do the work of starting the reaction elsewhere. <a href="/guides/how-to-promote-your-music">How to promote your music</a> covers the full plan.</p>"""),
            ("What SoundCloud Will Not Do for You", """<p>Do not buy plays, followers or repost packages that promise numbers. Fake activity breaks SoundCloud's rules and gives you numbers that do not turn into fans. And SoundCloud alone will not put your song in clubs or on radio. Digiwaxx does not sell SoundCloud plays; what it does is service your record to 30,000+ working DJs, and the submission form takes a SoundCloud link, so the track you are already building there can be the one that goes out.</p>"""),
        ],
        "faq": [
            ("Is SoundCloud good for promoting music?",
             "Yes, for speed and DJ culture. Uploads are direct, reposts spread tracks through followers, and DJs dig there for new records. Use it alongside full distribution, not instead of it."),
            ("Should I pay for SoundCloud plays or reposts?",
             "No. Bought plays and repost packages that promise numbers break SoundCloud's rules and leave you with activity that does not become fans. Trade reposts with real accounts in your lane instead."),
            ("Can I send a SoundCloud link to Digiwaxx?",
             "Yes. The submission form takes a link to your record on SoundCloud, Spotify, Apple Music or anywhere else, and the team reviews it within 72 hours."),
        ],
        "related": [("/promotion/audiomack-promotion", "Promotion", "Audiomack Promotion"),
                    ("/promotion/youtube-music-promotion", "Promotion", "YouTube Music Promotion"),
                    ("/promotion/spotify-playlist-promotion", "Promotion", "Spotify Playlist Promotion"),
                    ("/guides/how-to-get-djs-to-play-my-song", "Guides", "How to Get DJs to Play My Song")],
    },
]


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def render(p):
    section = p["path"].split("/")[0]
    url = "/" + p["path"]
    full = SITE + url
    body_words = " ".join([p["qa"], p["long"]] + [text(b) for _, b in p["sections"]] + [a for _, a in p["faq"]])
    article = {
        "@context": "https://schema.org", "@type": "Article", "headline": text(p["h1"]),
        "description": p["desc"], "url": full,
        "image": {"@type": "ImageObject", "url": f"{SITE}/assets/share-card.png", "width": 1200, "height": 630},
        "datePublished": TODAY, "dateModified": TODAY,
        "author": {"@id": f"{SITE}#organization"}, "publisher": {"@id": f"{SITE}#organization"},
        "@id": f"{full}#article", "mainEntityOfPage": {"@type": "WebPage", "@id": full},
        "isPartOf": {"@id": f"{SITE}#website"}, "inLanguage": "en-US",
        "articleSection": SECTION_NAMES[section], "wordCount": len(body_words.split()),
    }
    faq = {"@context": "https://schema.org", "@type": "FAQPage",
           "mainEntity": [{"@type": "Question", "name": q,
                           "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]}
    crumbs = breadcrumb_ld([("Digiwaxx", "/"), ("University", "/university"),
                            (SECTION_NAMES[section], f"/{section}"), (text(p["h1"]), url)])
    nav, footer = chrome()
    esc = lambda s: html.escape(s, quote=True)
    sections = "\n\n".join(f'<section class="body-section">\n  <h2>{h}</h2>\n{b}\n</section>'
                           for h, b in p["sections"])
    faqs = "\n".join(f'  <details><summary>{esc(q)}</summary><div class="faq-a"><p>{esc(a)}</p></div></details>'
                     for q, a in p["faq"])
    related = "\n".join(f'    <a class="related-card" href="{h}"><span class="related-cat">{c}</span>'
                        f'<span class="related-t">{esc(t)}</span></a>' for h, c, t in p["related"])
    return f"""{head(esc(p["title"]), esc(p["desc"]), url, "article", (article, crumbs, faq))}
<body>

{nav}
<main class="cmain">
  <div class="breadcrumb">
    <a href="/">Home</a> / <a href="/university">University</a> / <a href="/{section}">{SECTION_NAMES[section]}</a>
  </div>
  <article>
    <h1>{p["h1"]}</h1>
    <p class="page-question">{esc(p["question"])}</p>

<div class="quick-answer">
  <p class="qa-label">Quick Answer</p>
  <p class="qa-text">{esc(p["qa"])}</p>
</div>
<p class="long-answer">{esc(p["long"])}</p>


{sections}

{STATS}

<section class="faq">
  <h2>Frequently Asked Questions</h2>
{faqs}
</section>

<!-- seo:mesh -->
<!-- /seo:mesh -->

<section class="related">
  <h2>Keep Going</h2>
  <div class="related-grid">
{related}
  </div>
</section>

{CTA}
  </article>
</main>

{footer}
</body>
</html>
"""


def check(p):
    errs = []
    if len(html.unescape(p["title"])) > 60:
        errs.append(f'{p["path"]}: title {len(p["title"])} > 60')
    if not 150 <= len(p["desc"]) <= 160:
        errs.append(f'{p["path"]}: description {len(p["desc"])}, need 150-160')
    for field in ("title", "desc"):
        if re.search(r"\$\s?\d", p[field]):
            errs.append(f'{p["path"]}: price in {field}')
    if "—" in json.dumps(p, ensure_ascii=False):
        errs.append(f'{p["path"]}: em dash in copy')
    return errs


def main():
    apply = "--apply" in sys.argv
    errs = [e for p in PAGES for e in check(p)]
    if errs:
        print("\n".join(errs))
        sys.exit(1)
    for p in PAGES:
        out = os.path.join(ROOT, p["path"] + ".html")
        new = render(p)
        if os.path.exists(out):
            # Keep the mesh block build_mesh.py wrote, so re-running is a no-op.
            old = open(out, encoding="utf-8").read()
            m = re.search(r"<!-- seo:mesh -->.*?<!-- /seo:mesh -->", old, re.S)
            if m:
                new = new.replace("<!-- seo:mesh -->\n<!-- /seo:mesh -->", m.group(0))
            # The Article block is finished by enrich_schema.py (wordCount,
            # about, dates), which runs later in build.sh; keep its version.
            art = r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"Article".*?</script>'
            m = re.search(art, old, re.S)
            if m:
                new = re.sub(art, lambda _: m.group(0), new, count=1, flags=re.S)
        status = "unchanged" if os.path.exists(out) and open(out, encoding="utf-8").read() == new else "write"
        print(f"[{status}] {p['path']}.html")
        if apply and status == "write":
            open(out, "w", encoding="utf-8").write(new)
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}: {len(PAGES)} page(s)")


if __name__ == "__main__":
    main()
