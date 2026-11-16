#!/usr/bin/env python3
"""Hand-written title and description records for the pages Search Console
shows ranking but not getting clicked.

Same method as the Add A Guest Post page meta records: each page gets one key
question, a title written from it (a statement for service pages, the question
itself for answer pages) and a description written to the searcher as "you".

Rules every record must pass, or the script refuses to write anything:
  - title 60 characters or fewer
  - description 150 to 160 characters, whole sentences
  - no prices in titles or descriptions
  - no title or description shared with another record

Source for which pages are here: Search Console Performance export, last 3
months to 2026-11-11 (promote-digiwaxx-gsc-report-2026-11-14.md). Each record
notes the impressions and average position that put it on the list.

The record wins over whatever the page had. og:title, twitter:title,
og:description, twitter:description and the Article schema description are
kept in step. Run before fix_meta.py (build.sh does).

Usage: meta_records.py [--apply]
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# path: (key question, title, description, why it is here)
RECORDS = {
    "index.html": (
        "Is Digiwaxx still running, and how do I get my record to its DJs?",
        "Digiwaxx Record Pool: Get Your Music to 30,000+ DJs",
        "Digiwaxx is still servicing new records to DJs in 2026. Send your song to "
        "30,000+ club, mixshow and radio DJs, plus Digiwaxx Radio. Running since 1998.",
        "brand query 'digiwaxx' 260 impressions, position 4.42, 0 clicks",
    ),
    "promote/music-promotion-service.html": (
        "What does a real music promotion service do?",
        "Music Promotion Service: Your Record to 30,000+ DJs",
        "Get your record placed with 30,000+ working DJs and played on Digiwaxx "
        "Radio, with published coverage on the top tier. One payment, no contract, since 1998.",
        "121 impressions, position 4.21, 0 clicks",
    ),
    "answers/do-djs-still-break-records.html": (
        "Do DJs still break records, or do algorithms do it now?",
        "Do DJs Still Break Records in 2026? Yes, Here Is How",
        "Yes. DJs still break records: a spinning song creates the Shazams, searches "
        "and saves that algorithms then scale. See how it happens and where you fit.",
        "118 impressions, position 2.41, 0 clicks",
    ),
    "compare/best-record-pools.html": (
        "What is the best DJ pool in 2026?",
        "Best DJ Pool 2026: The Digiwaxx Record Pool For DJs And Labels",
        "Looking for the best DJ pool in 2026? See the pools DJs rate, like DJcity and "
        "BPM Supreme, and how artists and labels get records into the Digiwaxx pool.",
        "131 impressions, position 7.54, 0 clicks; Fix List 2026-11-16: "
        "'best dj pool 2026' 5 impressions at 16.8, 'indie label record pool' at 20",
    ),
    "answers/how-record-pools-work.html": (
        "How does a record pool actually work?",
        "How Do Record Pools Work? From Artist to DJ, Step by Step",
        "You submit one DJ-ready record, verified DJs download what fits their rooms, "
        "and spins and feedback come back to you. Here is the whole record pool flow.",
        "49 impressions, position 4.43, 0 clicks",
    ),
    "campaigns/60-day-release-plan.html": (
        "What does a complete 60-day single campaign look like?",
        "60-Day Release Plan: A Dated, Week-by-Week Single Rollout",
        "Copy this 60-day plan for your next single: lock assets, pitch editorial, "
        "service DJs, run release week, then fire a second wave. Every step is dated.",
        "48 impressions, position 3.77, 0 clicks",
    ),
    "compare/digiwaxx-vs-submithub.html": (
        "Should I use Digiwaxx or SubmitHub?",
        "Digiwaxx vs SubmitHub: A SubmitHub Alternative for DJs",
        "SubmitHub sells you per-pitch credits to blogs and curators. Digiwaxx "
        "services your record to 30,000+ working DJs in one campaign. See which one fits you.",
        "38 impressions, position 4.87, 0 clicks",
    ),
    "labels.html": (
        "How does an international label get releases to American DJs?",
        "U.S. DJ Promotion for International Labels and Distributors",
        "Get your label's releases to 30,000+ U.S. club, mixshow, radio and mobile "
        "DJs, with campaign reporting back to your team. Breaking records since 1998.",
        "70 impressions, position 6.69, 0 clicks",
    ),
    "campaigns/90-day-new-artist-launch.html": (
        "How does a brand-new artist launch in 90 days?",
        "90-Day New Artist Launch Plan: Month-by-Month Rollout",
        "New artist? Use this 90-day plan: build the foundation in month one, release "
        "your first record with DJ service in month two, then release again in three.",
        "59 impressions, position 6.36, 0 clicks",
    ),
    "answers/how-much-does-music-promotion-cost.html": (
        "How much does it cost to promote a song?",
        "How Much Does Music Promotion Cost in 2026?",
        "See what you should expect to spend to promote a song, channel by channel: "
        "DJ servicing, playlists, radio and PR, plus the spending order that really works.",
        "43 impressions, position 7.14, 0 clicks",
    ),
    "promote/promote-my-single.html": (
        "How do I promote my single?",
        "Promote My Single: Get Your Song to 30,000+ DJs",
        "Put your single in front of 30,000+ DJs before and during release week, with "
        "Digiwaxx Radio and the DJ Call feature on top. One payment and no contract.",
        "39 impressions, position 9.56, 0 clicks",
    ),
    "university.html": (
        "Where can I learn how to promote my music?",
        "Digiwaxx University: Free Music Promotion Guides",
        "Learn how to promote your music with free guides, straight answers and tools "
        "on DJ promotion, radio, release plans and breaking records as an independent.",
        "36 impressions, position 5.81, 0 clicks",
    ),
    "promotion/music-promotion-new-york.html": (
        "How do I promote my music in New York?",
        "Music Promotion in New York: Get Your Song to NYC DJs",
        "Promote your music in New York the way records break there: get it into the "
        "crates of working NYC club, mixshow and mobile DJs, then build on the reaction.",
        "37 impressions, position 10.41, 0 clicks",
    ),
    "answers/is-spotify-playlist-promotion-worth-it.html": (
        "Is paying for Spotify playlist promotion worth it?",
        "Is Spotify Playlist Promotion Worth It? An Honest Answer",
        "Spotify playlist promotion is worth it when you pay for real curator pitching "
        "as one layer of a campaign. Guaranteed placements and bot playlists hurt you.",
        "181 impressions, position 57.5; carries 'spotify playlist promotion'",
    ),
}

TITLE_MAX = 60
# Titles Kawani supplied word for word (The Fix List, 2026-11-16). Kept
# exactly as given even past 60 characters, because the supplied file wins.
EXACT_TITLES = {"compare/best-record-pools.html"}
DESC_MIN, DESC_MAX = 150, 160
PRICE = re.compile(r"\$\s?\d")


def vlen(s):
    return len(html.unescape(s))


def check():
    errors, seen = [], {}
    for path, (_, title, desc, _) in RECORDS.items():
        if not os.path.exists(os.path.join(ROOT, path)):
            errors.append(f"{path}: file not found")
        if vlen(title) > TITLE_MAX and path not in EXACT_TITLES:
            errors.append(f"{path}: title {vlen(title)} chars > {TITLE_MAX}")
        if not DESC_MIN <= vlen(desc) <= DESC_MAX:
            errors.append(f"{path}: description {vlen(desc)} chars, need {DESC_MIN}-{DESC_MAX}")
        if not desc.rstrip().endswith((".", "?", "!")):
            errors.append(f"{path}: description does not end on a whole sentence")
        for kind, text in (("title", title), ("description", desc)):
            if PRICE.search(text):
                errors.append(f"{path}: price in {kind}")
            if text in seen:
                errors.append(f"{path}: {kind} duplicates {seen[text]}")
            seen[text] = path
    return errors


def attr(s):
    return html.escape(s, quote=True).replace("&#x27;", "'")


def set_meta(s, key, value, by="property"):
    pat = r'(<meta\s+%s="%s"\s+content=")([^"]*)(")' % (by, re.escape(key))
    return re.sub(pat, lambda m: m.group(1) + value + m.group(3), s, count=1)


def apply_record(path, title, desc, write):
    full = os.path.join(ROOT, path)
    s = orig = open(full, encoding="utf-8").read()
    t, d = attr(title), attr(desc)
    s = re.sub(r"(<title[^>]*>)(.*?)(</title>)", lambda m: m.group(1) + t + m.group(3), s, count=1, flags=re.S)
    s = set_meta(s, "description", d, by="name")
    s = set_meta(s, "og:title", t)
    s = set_meta(s, "og:description", d)
    s = set_meta(s, "twitter:title", t, by="name")
    s = set_meta(s, "twitter:description", d, by="name")

    # Article / WebPage schema description follows the meta description. The
    # /university CollectionPage is owned by enrich_schema.py, so it is left alone.
    def fix_ld(m):
        try:
            data = json.loads(m.group(2))
        except ValueError:
            return m.group(0)
        if isinstance(data, dict) and data.get("@type") in ("Article", "WebPage") and "description" in data:
            data["description"] = html.unescape(desc)
            return m.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + m.group(3)
        return m.group(0)

    s = re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', fix_ld, s, flags=re.S)
    if write and s != orig:
        open(full, "w", encoding="utf-8").write(s)
    return s != orig


def main():
    write = "--apply" in sys.argv
    errors = check()
    if errors:
        print("\n".join(errors))
        sys.exit(1)
    changed = [p for p, (_, t, d, _) in RECORDS.items() if apply_record(p, t, d, write)]
    for p in changed:
        print(f"[record] {p}")
    print(f"\n{'APPLIED' if write else 'DRY RUN'}: {len(changed)} of {len(RECORDS)} page(s) changed")


if __name__ == "__main__":
    main()
