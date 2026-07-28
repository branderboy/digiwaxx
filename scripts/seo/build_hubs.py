#!/usr/bin/env python3
"""Generate a real index page for every content section.

Before this, the only route into the 123 content pages was /university (a single
141-link hub) and footer links that pointed at anchors like /university#promotion.
Google discovered every page but crawled none of them. These hubs give each
section a genuine, topically-tight landing page at /answers, /guides, /promotion
and so on, cutting crawl depth and spreading link equity across nine entry
points instead of one.

Usage: build_hubs.py [--apply]
"""
import os, sys, json
import lib
from lib import ROOT, SITE

# Per-section copy. The intros are real prose, not filler: a hub that is itself
# thin is just another page Google will decline to crawl.
SECTIONS = {
    "promote": dict(
        label="Promotion Services",
        h1="Music Promotion Services",
        title="Music Promotion Services for Artists &amp; Labels",
        desc="Every Digiwaxx promotion service in one place: singles, albums, EPs and mixtapes, plus campaigns built for labels, managers, producers, and DJs.",
        sub="What a Digiwaxx campaign actually does, broken out by what you are releasing and who you are.",
        intro=[
            "A promotion campaign is not one product. What a label needs for a roster of ten artists is not what a first-time independent needs for one single, and the work behind an album rollout is not the work behind a mixtape. These pages break the service down by both axes: what you are putting out, and who you are when you put it out.",
            "Every campaign runs on the same spine, your record serviced to a network of 30,000+ club, radio, and mixshow DJs who have been taking music from Digiwaxx since 1998. What changes between them is the packaging, the sequencing, and what you do with the reactions once they come back.",
        ]),
    "campaigns": dict(
        label="Campaign Blueprints",
        h1="Music Campaign Blueprints",
        title="Music Promotion Campaign Blueprints &amp; Release Plans",
        desc="Complete, dated promotion campaigns you can run as written: 60-day release plans, 30-day post-release sprints, club record campaigns, and new artist launches.",
        sub="Full campaigns, start to finish, with dates attached. Copy one and run it.",
        intro=[
            "Most promotion advice tells you what to do without telling you when. These blueprints do the opposite: each one is a dated, sequenced campaign you can lift as-is and run against your own release date, from the first day of setup through the last day of follow-up.",
            "Pick by situation. If you have a date locked and time to prepare, start with the 60-day plan. If the record is already out and stalling, the 30-day post-release sprint is built for exactly that. If the record lives in clubs, or you are launching an artist with no history at all, there is a blueprint for each.",
        ]),
    "guides": dict(
        label="Guides",
        h1="Release &amp; Promotion Guides",
        title="Music Release &amp; Promotion Guides for Artists",
        desc="Step-by-step guides to releasing and promoting music: how to release a single, reach DJs, get radio play and playlist adds, and fix a release that stalled.",
        sub="Step-by-step playbooks for every stage of a release, before the drop and long after it.",
        intro=[
            "These are the mechanics: how to actually release a single, how to reach DJs without burning the relationship, how radio and playlist pitching really work, and what to do when a record that should be moving is not moving.",
            "The guides split roughly into three groups. Before the release: timing, anticipation, how many songs to put out. During: rollout sequencing, checklists, day-of execution. After: diagnosing a song that is not getting streams, reviving one that stopped growing, and converting whatever traction you do get into something durable.",
        ]),
    "goals": dict(
        label="Artist Goals",
        h1="Promotion by Artist Goal",
        title="Music Promotion by Goal: Plays, Fans, Spins &amp; Shows",
        desc="Start from what you actually want: club plays, radio spins, playlist placement, more Spotify listeners, more fans, or more bookings. Each goal has a path.",
        sub="Start from the outcome you want and work backwards to the campaign that gets you there.",
        intro=[
            "Artists rarely want &ldquo;promotion.&rdquo; They want a specific thing: to hear their record in a club, to get added to a playlist, to be booked, to see the monthly listener count move. Those goals do not all run through the same work, and chasing them in the wrong order wastes money.",
            "Each page here takes one goal, explains what actually produces it, what it realistically takes, and which part of a campaign moves that particular needle. If you are not sure which goal you should be chasing yet, the artist journey pages sort it by where you are.",
        ]),
    "answers": dict(
        label="Straight Answers",
        h1="Straight Answers on Music Promotion",
        title="Straight Answers on Music Promotion &amp; Record Pools",
        desc="Direct answers to the questions artists actually ask: does music promotion work, what it costs, how record pools work, and whether DJs still break records.",
        sub="The questions artists actually ask, answered directly, including the ones with uncomfortable answers.",
        intro=[
            "Every question here gets a straight answer in the first two sentences, then the reasoning behind it. Where the honest answer is &ldquo;it depends,&rdquo; we say what it depends on. Where the honest answer is no, we say no.",
            "Several of these cover things the promotion industry prefers to leave vague: what campaigns really cost, what results are and are not reasonable to expect, how long any of it takes, and which services are worth paying for. If you are deciding whether to spend money on promotion at all, start here rather than with a sales page.",
        ]),
    "promotion": dict(
        label="Cities, Genres &amp; Platforms",
        h1="Music Promotion by City, Genre &amp; Platform",
        title="Music Promotion by City, Genre &amp; Platform",
        desc="How records break city by city and genre by genre: DJ circuits in 19 markets, plus playbooks for hip hop, Afrobeats, R&amp;B, Latin, reggae, gospel and streaming.",
        sub="Records do not break nationally. They break in rooms, in cities, in scenes. Here is how each one works.",
        intro=[
            "A record breaks in a place before it breaks anywhere else. The DJs who run Houston are not the DJs who run Detroit, the rooms that matter in Atlanta are not the rooms that matter in the Bay, and a gospel record moves through a completely different circuit than a drill record in the same city.",
            "These pages map that. City pages cover the local DJ circuit, the rooms and stations that matter, and how to service a record into that market. Genre pages cover how a style actually travels. Genre-and-city pages sit at the intersection, which is usually where the real answer is. Platform pages cover the streaming side once the DJ side is working.",
        ]),
    "compare": dict(
        label="Comparisons",
        h1="Digiwaxx Compared to Other Services",
        title="Digiwaxx vs. Other Music Promotion Services",
        desc="Honest comparisons of Digiwaxx against SubmitHub, Playlist Push, and Groover, plus a straight look at how the best record pools actually differ.",
        sub="Where Digiwaxx fits, where it does not, and what the alternatives are genuinely better at.",
        intro=[
            "These comparisons are written to be useful rather than flattering. Digiwaxx services records to a DJ network. SubmitHub and Groover sell per-pitch access to curators with guaranteed feedback. Playlist Push runs playlist and creator campaigns. Those are different tools solving different problems, and for some releases the answer is genuinely not us.",
            "Each page lays out what the other service does well, what it costs, what you get back, and the specific situations where it is the better buy. If you are choosing between them, read the one that matches the service you are actually considering.",
        ]),
    "journey": dict(
        label="The Artist Journey",
        h1="The Artist Journey, Stage by Stage",
        title="The Independent Artist Journey, Stage by Stage",
        desc="Four stages every independent artist moves through, from finishing a song to converting real traction, with what to do and what to ignore at each one.",
        sub="Find where you actually are, then do only the work that stage calls for.",
        intro=[
            "Most wasted promotion money comes from doing stage-three work at stage one. Pitching playlists before the record is properly packaged, chasing bookings before anyone knows the song, buying promotion for a record that is not finished.",
            "These four pages describe the stages in order: you made a song, you released it, you need people to hear it, and it is getting traction. Each one names what matters right now, what can wait, and what to stop doing. Read the one that describes your situation today, not the one that describes where you want to be.",
        ]),
    "tools": dict(
        label="Free Artist Tools",
        h1="Free Tools for Independent Artists",
        title="Free Tools for Independent Musicians &amp; Artists",
        desc="Free artist tools: EPK builder, DJ pitch generator, artist bio generator, press release writer, budget calculator, and an interactive release day checklist.",
        sub="Free, no signup, nothing emailed to you. Use them and go.",
        intro=[
            "These are the pieces of paperwork that stand between a finished record and a real campaign: a press kit, a pitch a DJ will actually read, a bio in three lengths, a budget that adds up, and a checklist for release day.",
            "Everything here runs in your browser. Nothing requires an account, nothing is gated behind an email address, and nothing is stored on our end. Build what you need, copy it out, and get back to the record.",
        ]),
}

# How the /promotion/ hub is subdivided, in the order the groups appear.
PROMO_GROUPS = [
    ("cities", "Music Promotion by City",
     "How records break market by market: the local DJ circuit, the rooms that matter, and how to service a record into each city."),
    ("genres", "Music Promotion by Genre",
     "How each style actually travels, who moves it, and what a record needs before the right DJs will touch it."),
    ("genre-cities", "Genre &times; City Playbooks",
     "The intersection, which is usually where the real answer lives: a specific genre inside a specific market."),
    ("platforms", "Promotion by Platform",
     "The streaming and video side, once the DJ side is working."),
]


def card(section, slug, meta, cat_label):
    return (f'    <a class="related-card" href="/{section}/{slug}">'
            f'<span class="related-cat">{cat_label}</span>'
            f'<span class="related-t">{meta["h1"]}</span></a>')


def promo_groups(cat):
    groups = {k: [] for k, _, _ in PROMO_GROUPS}
    for slug, meta in cat["promotion"].items():
        k = lib.classify(slug)
        if k["kind"] == "city":
            groups["cities"].append((slug, meta, "City"))
        elif k["kind"] == "genre":
            groups["genres"].append((slug, meta, "Genre"))
        elif k["kind"] == "platform":
            groups["platforms"].append((slug, meta, lib.PLATFORMS[slug]))
        else:
            groups["genre-cities"].append((slug, meta, lib.GENRE_NAMES.get(k["genre"], "Genre")))
    for v in groups.values():
        v.sort(key=lambda t: t[1]["h1"])
    return groups


def build(section, cfg, cat):
    pages = cat[section]
    url = f"/{section}"
    trail = [("Digiwaxx", "/"), ("University", "/university"), (cfg["label"].replace("&amp;", "&"), url)]

    body = []
    if section == "promotion":
        groups = promo_groups(cat)
        ordered = []
        for key, heading, blurb in PROMO_GROUPS:
            items = groups[key]
            if not items:
                continue
            cards = "\n".join(card("promotion", s, m, lbl) for s, m, lbl in items)
            body.append(f'<section class="hub-cat" id="{key}">\n  <h2>{heading}</h2>\n'
                        f'  <p class="hub-cat-desc">{blurb}</p>\n'
                        f'  <div class="hub-grid">\n{cards}\n  </div>\n</section>')
            ordered += [s for s, _, _ in items]
    else:
        ordered = sorted(pages, key=lambda s: pages[s]["h1"])
        cards = "\n".join(card(section, s, pages[s], cfg["label"].replace("&amp;", "&")) for s in ordered)
        body.append(f'<section class="hub-cat">\n  <h2>All {len(ordered)} {cfg["label"]}</h2>\n'
                    f'  <div class="hub-grid">\n{cards}\n  </div>\n</section>')

    # ItemList makes the hub's membership explicit rather than leaving Google to
    # infer it from markup, and CollectionPage types the page itself.
    item_list = {"@context": "https://schema.org", "@type": "CollectionPage",
                 "@id": f"{SITE}{url}#collection",
                 "name": cfg["h1"].replace("&amp;", "&"),
                 "description": cfg["desc"].replace("&amp;", "&"),
                 "url": f"{SITE}{url}",
                 "isPartOf": {"@type": "WebSite", "@id": f"{SITE}#website"},
                 "inLanguage": "en-US",
                 "mainEntity": {
                     "@type": "ItemList",
                     "numberOfItems": len(ordered),
                     "itemListOrder": "https://schema.org/ItemListUnordered",
                     "itemListElement": [
                         {"@type": "ListItem", "position": i + 1,
                          "url": f"{SITE}/{section}/{s}",
                          "name": pages[s]["h1"].replace("&amp;", "&")}
                         for i, s in enumerate(ordered)]}}

    intro = "\n".join(f"    <p>{p}</p>" for p in cfg["intro"])
    nav, footer = lib.chrome()
    head = lib.head(cfg["title"], cfg["desc"], url, extra_ld=[item_list, lib.breadcrumb_ld(trail)])

    return f"""{head}
<body>

{nav}
<main class="hub-main">
  <div class="breadcrumb">
    <a href="/">Home</a> / <a href="/university">University</a> / {cfg["label"]}
  </div>
  <div class="hub-hero">
    <h1>{cfg["h1"]}</h1>
    <p class="hub-sub">{cfg["sub"]}</p>
  </div>

  <div class="body-section">
{intro}
  </div>

{chr(10).join(body)}

<section class="cta-block">
  <p class="cta-kicker">Ready?</p>
  <h2>Submit your record to Digiwaxx.</h2>
  <p class="cta-sub">Your music in front of 30,000+ club, radio and mixshow DJs, the network that has been breaking records since 1998.</p>
  <a class="cta-btn" href="/#pricing">Promote My Record &rarr;</a>
  <p class="cta-tiers">Starter $99 &middot; Pro $149 &middot; Elite $199, one-time payment, no contracts.</p>
</section>
</main>

{footer}
</body>
</html>
"""


def main():
    apply = "--apply" in sys.argv
    cat = lib.catalog()
    for section, cfg in SECTIONS.items():
        html = build(section, cfg, cat)
        path = f"{ROOT}/{section}/index.html"
        if apply:
            open(path, "w", encoding="utf-8").write(html)
        print(f"{'wrote' if apply else 'would write'} /{section}  ({len(cat[section])} pages, {len(html):,} bytes)")
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}: {len(SECTIONS)} hub pages")


if __name__ == "__main__":
    main()
