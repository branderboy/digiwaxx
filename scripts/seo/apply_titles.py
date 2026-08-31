#!/usr/bin/env python3
"""Apply the approved SERP titles and meta descriptions to the built pages.

Rewrites <title>, <meta name="description"> and the og:/twitter: mirrors of
both, so a page's four title tags and three description tags never disagree.

Three sources of new copy:

  EXACT     hand-written title and description for the twelve pages the audit
            covered individually, plus the thirteen country landing pages,
            whose titles are taken from their own natively written H1 rather
            than translated from English.

  CITY      the 57 genre-by-city pages, rewritten from a template: the tail
            "DJs, Clubs & Radio | Digiwaxx" said nothing a competitor could
            not say, and the brand suffix was spending characters the local
            promise needed.

  SUFFIX    everything else keeps its title but loses a trailing
            "| Digiwaxx" when the title already reads as a complete promise
            without it.

fix_meta.py trims titles over 60 characters at a clause boundary, silently,
so every title here is checked against that cap before it is written and the
run refuses to apply if any would be trimmed.

Usage: apply_titles.py [--apply]
"""
import os, re, sys, glob, html

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TITLE_MAX, DESC_MAX = 60, 160

# ---------------------------------------------------------------- exact copy

EXACT = {
 "index.html": (
   "DJ Promotion From $99: 30,000+ DJs, Clubs, Radio, Playlists",
   "Service your record to a 30,000+ DJ network built since 1998: record pool "
   "placement, radio rotation, playlists and artist coverage. One-time $99 to $199."),

 "promote/promote-my-single.html": (
   "Promote My Single: DJ Service, Radio and Playlists From $99",
   "One single, one campaign: serviced to 30,000+ working DJs, pitched for radio "
   "rotation and playlists, with a Digiwaxx artist page. $99 to $199, one-time."),
 "promote/promote-my-album.html": (
   "Promote My Album: Service Every Track to 30,000+ DJs",
   "An album is a campaign, not one upload: lead single serviced first, the rest "
   "worked behind it across DJs, radio and playlists. $99 to $199, one-time."),
 "promote/promote-my-ep.html": (
   "Promote My EP: Pick the Lead, Work the Rest to 30,000+ DJs",
   "An EP gives DJs a choice, which is an advantage if you service it properly. "
   "Lead track first, the others behind it, to 30,000+ DJs. $99 to $199, one-time."),
 "promote/promote-my-mixtape.html": (
   "Promote My Mixtape: Get It Into DJ Crates, From $99",
   "Mixtapes live or die in DJ crates. Get yours serviced to 30,000+ club, mixshow "
   "and radio DJs, with the versions they can actually play. $99 to $199, one-time."),

 "promote/music-promotion-service.html": (
   "Music Promotion Is Access, Not Advertising: How Ours Works",
   "Most promotion buys impressions. Digiwaxx sells access: your record placed with "
   "30,000+ working DJs, plus radio, playlists and published coverage. No contracts."),

 "labels.html": (
   "U.S. DJ Servicing for Labels: 30,000+ DJs, Reported",
   "Take a roster or a single release into the U.S. market: servicing to 30,000+ "
   "American club, mixshow and radio DJs, with media kits and campaign reporting."),

 "africa/index.html": (
   "Afrobeats & Amapiano to U.S. DJs: Clubs, Mixshows, Radio",
   "Service afrobeats, amapiano or African pop into the U.S.: 30,000+ DJs plus the "
   "diaspora club and mixshow circuit that breaks African records stateside."),

 "answers/how-much-does-music-promotion-cost.html": (
   "How Much Does Music Promotion Cost? Real Ranges by Channel",
   "What DJ servicing, playlist campaigns, radio pushes and PR actually cost, which to "
   "buy first on a small budget, and the spends that reliably return nothing."),

 "tools/release-day-checklist.html": (
   "Release Day Checklist: 19 Interactive Steps, Progress Saved",
   "Work through release day without missing a step: 19 checks from final master to "
   "first-night momentum, ticked off in the browser with your progress kept. Free."),

 "campaigns/60-day-release-plan.html": (
   "The 60-Day Single Release Plan: Every Week, Start to Spins",
   "A full single campaign mapped week by week: asset prep, distribution timing, DJ "
   "servicing, the pre-save push, release week, and the two waves after. Copy it."),

 # Three titles left a comma where an em dash used to sit, which reads as a
 # run-on. A colon restores the break the sentence was written with.
 "journey/i-released-it.html": (
   "I Released My Song and Nothing Happened: The Fix", None),
 "guides/my-song-isnt-getting-streams.html": (
   "My Song Isn't Getting Streams: Here's Why, and What to Do", None),
 "answers/can-independent-artists-use-digiwaxx.html": (
   "Can Independent Artists Use Digiwaxx? Yes, Here’s How", None),

 "contact.html": (
   "Contact Digiwaxx: Campaigns, Partnerships, Artist Support",
   "Reach the right desk directly: Kay Ali for campaigns, CL Llewellyn for partnerships "
   "and distribution, Will Gordon for artist support. Or call 1-800-665-1259."),

 # --- the thirteen market pages. Each title is that page's own H1, written
 # in-market by whoever authored the page, rather than a translation of the
 # English pattern. Descriptions are left exactly as they are.
 "br/promocao-dj-eua.html": ("Leve sua música aos DJs profissionais dos Estados Unidos", None),
 "ca/us-dj-promotion-for-canadian-artists.html": ("Canadian Releases Into U.S. DJ Booths, Clubs and Radio", None),
 "co/promocion-musica-urbana-eeuu.html": ("Del estudio en Medellín a los DJs de Estados Unidos", None),
 "conosur/promocion-dj-eeuu.html": ("Trap y urbano del Cono Sur hacia los DJs de EE. UU.", None),
 "es/promocion-dj-estados-unidos.html": ("Promoción de música para DJs profesionales en EE. UU.", None),
 "fr/promotion-dj-etats-unis.html": ("Faites jouer vos sorties par les DJs américains", None),
 "id/promosi-musik-dj-amerika.html": ("Bawa rilisan Anda ke DJ profesional di Amerika Serikat", None),
 "india/us-dj-promotion-for-indian-artists.html": ("U.S. DJ Promotion for Punjabi and Bollywood Releases", None),
 "jp/us-dj-promotion.html": ("あなたのリリースをアメリカのDJへ | Digiwaxx", None),
 "ko/us-dj-promotion-for-korean-labels.html": ("한국 레이블을 위한 미국 DJ 프로모션", None),
 "mx/promocion-musica-mexicana-eeuu.html": ("Promoción de Regional Mexicano y Corridos con DJs de EE. UU.", None),
 "ph/us-dj-promotion-for-filipino-artists.html": ("OPM and Filipino Releases to U.S. DJs and Mixshows", None),
 "uk/us-dj-promotion-for-uk-labels.html": ("UK Rap, Drill and Afroswing Into U.S. DJ Rotation", None),
}

# The one duplicate H1 on the site: the guide and the tool both called
# themselves "Release Day Checklist". The guide takes its own title's tail,
# which splits the intent cleanly: the guide explains, the tool executes.
H1 = {
 "guides/release-day-checklist-guide.html": "What to Do the Day Your Song Drops",
 "tools/release-day-checklist.html": "Interactive Release Day Checklist",
}

# ------------------------------------------------------------- city template

CITY_TITLE = re.compile(r"^(?P<genre>.+?) Promotion in (?P<city>.+?): DJs, Clubs & Radio(?: \| Digiwaxx)?$")
# The city-only pages read "Music Promotion Atlanta", with no genre and no
# preposition. Same tail problem, so the same treatment.
CITY_ONLY = re.compile(r"^Music Promotion (?P<city>.+?): DJs, Clubs & Radio(?: \| Digiwaxx)?$")
CITY_TAILS = [": How Records Break Here", ": The DJ Circuit"]
CITY_DESC = ("How {genre_l} records break in {city}: the DJ circuit, the rooms that decide, "
             "the versions DJs need, and how to get serviced to {city} DJs from $99.")
CITY_DESC_PLAIN = ("How records break in {city}: the DJ circuit, the rooms that decide, the "
                   "versions DJs need, and how to get serviced to {city} DJs from $99.")


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def visible(s):
    return len(html.unescape(s))


def city_copy(title):
    """New title and description for a city page, genre-scoped or not, or None."""
    plain = html.unescape(title)
    m = CITY_TITLE.match(plain)
    if m:
        genre, city = m.group("genre"), m.group("city")
        head = f"{genre} Promotion in {city}"
    else:
        m = CITY_ONLY.match(plain)
        if not m:
            return None
        genre, city = None, m.group("city")
        head = f"Music Promotion in {city}"
    for tail in CITY_TAILS:
        if len(head + tail) <= TITLE_MAX:
            new_title = head + tail
            break
    else:
        return None  # no tail fits; leave the page alone
    genre_l = genre.lower().replace(" music", "") if genre else None
    desc = (CITY_DESC.format(genre_l=genre_l, city=city) if genre_l
            else CITY_DESC_PLAIN.format(city=city))
    if len(desc) > DESC_MAX:
        what = f"{genre_l} records" if genre_l else "records"
        desc = (f"How {what} break in {city}: the DJ circuit, the rooms that decide, "
                f"and the versions DJs need to play it. Get serviced from $99.")
    return new_title, desc


def replace_tag(src, pattern, value):
    return re.sub(pattern, lambda m: m.group(1) + value + m.group(2), src, count=1)


def rewrite(src, title, desc):
    if title is not None:
        t = esc(title)
        src = replace_tag(src, r"(<title>)(?:.*?)(</title>)", t)
        for pat in (r'(<meta property="og:title" content=")[^"]*(">)',
                    r'(<meta name="twitter:title" content=")[^"]*(">)'):
            src = replace_tag(src, pat, t)
    if desc is not None:
        d = esc(desc)
        for pat in (r'(<meta name="description" content=")[^"]*(">)',
                    r'(<meta property="og:description" content=")[^"]*(">)',
                    r'(<meta name="twitter:description" content=")[^"]*(">)'):
            src = replace_tag(src, pat, d)
    return src


def rewrite_h1(src, text):
    """Move the visible H1 and the Article headline together, so the page does
    not tell a reader one thing and a crawler another."""
    src = re.sub(r"(<h1[^>]*>)(?:.*?)(</h1>)", lambda m: m.group(1) + esc(text) + m.group(2),
                 src, count=1, flags=re.S)
    return re.sub(r'("@type":"Article","headline":")[^"]*(")',
                  lambda m: m.group(1) + text.replace('"', r'\"') + m.group(2), src, count=1)


def main():
    apply = "--apply" in sys.argv
    plan, problems = [], []

    for path in sorted(glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(path, ROOT)
        src = open(path, encoding="utf-8").read()
        m = re.search(r"<title>(.*?)</title>", src, re.S)
        if not m:
            continue
        cur_title = m.group(1).strip()
        m = re.search(r'<meta name="description" content="([^"]*)">', src)
        cur_desc = m.group(1) if m else None

        if rel in EXACT:
            title, desc = EXACT[rel]
            kind = "exact"
        else:
            city = city_copy(cur_title)
            if city:
                title, desc = city
                kind = "city"
            else:
                # Drop a trailing brand suffix where the title stands alone.
                stripped = re.sub(r"\s*\|\s*Digiwaxx$", "", html.unescape(cur_title))
                if stripped != html.unescape(cur_title) and len(stripped) >= 30:
                    title, desc, kind = stripped, None, "suffix"
                else:
                    continue

        if title and visible(esc(title)) > TITLE_MAX:
            problems.append((rel, "title", visible(esc(title)), title))
        if desc and len(desc) > DESC_MAX:
            problems.append((rel, "desc", len(desc), desc[:60]))
        plan.append((rel, kind, cur_title, title, cur_desc, desc, path, src))

    counts = {}
    for rel, kind, *_ in plan:
        counts[kind] = counts.get(kind, 0) + 1
    for kind in ("exact", "city", "suffix"):
        print(f"  {counts.get(kind, 0):4d} pages  {kind}")

    if problems:
        print("\nOVER THE CAP, nothing written:")
        for rel, what, n, val in problems:
            print(f"  {rel}  {what} {n}  {val}")
        sys.exit(1)

    if "--show" in sys.argv:
        for rel, kind, ct, title, cd, desc, _p, _s in plan:
            print(f"\n{rel}  [{kind}]")
            if title:
                print(f"  T- {ct}\n  T+ {title}  ({visible(esc(title))})")
            if desc:
                print(f"  D- {(cd or '')[:110]}\n  D+ {desc[:110]}")

    if not apply:
        print("\n(dry run, pass --apply to write)")
        return
    written = 0
    for rel, kind, _ct, title, _cd, desc, path, src in plan:
        new = rewrite(src, title, desc)
        if rel in H1:
            new = rewrite_h1(new, H1[rel])
        if new != src:
            open(path, "w", encoding="utf-8").write(new)
            written += 1
    # An H1 fix may land on a page whose title needs no change at all.
    for rel, text in H1.items():
        path = os.path.join(ROOT, rel)
        if rel in {p[0] for p in plan}:
            continue
        src = open(path, encoding="utf-8").read()
        new = rewrite_h1(src, text)
        if new != src:
            open(path, "w", encoding="utf-8").write(new)
    print(f"\nAPPLIED: {written} pages changed ({len(plan)} in the plan)")


if __name__ == "__main__":
    main()
