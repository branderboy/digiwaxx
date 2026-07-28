#!/usr/bin/env python3
"""Trim over-length <title> and meta description tags to SERP-safe lengths.

Titles are capped at 60 visible chars, descriptions at 160. Rather than hard
truncating, we generate clause-boundary candidates and keep the longest one
that fits, so we lose as few keywords as possible. The " | Digiwaxx" brand
suffix is dropped only when keeping it would cost more than it is worth.

Usage: fix_meta.py [--apply]
"""
import os, re, sys, glob, html

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BRAND = " | Digiwaxx"
TITLE_MAX, DESC_MAX = 60, 160
TITLE_MIN, DESC_MIN = 30, 120
SPLITS = [": ", ", ", " & ", " and ", " - ", " – "]

# Descriptions that ran over 160 chars. These are rewritten by hand rather than
# clause-trimmed: each was only a few chars over, and dropping a whole trailing
# clause cost more meaning than it saved.
DESC_OVERRIDES = {
    "answers/can-independent-artists-use-digiwaxx.html":
        "Yes, most Digiwaxx campaigns are for independent artists. What you need, what it costs ($99 to $199 one-time), and what happens after you submit.",
    "answers/does-radio-promotion-still-work.html":
        "Radio still reaches most adults weekly and converts to streams, legitimacy, and bookings. What radio promotion does in 2026 and how independents access it.",
    "answers/how-record-pools-work.html":
        "What a record pool is, how music flows from artists to working DJs, what each side gets, and why pools have anchored music promotion since the 1970s.",
    "answers/what-is-a-record-pool.html":
        "Record pool, defined: a membership service distributing new music to verified working DJs. Its 1970s origins, digital shift, and role in breaking records.",
    "answers/will-promotion-increase-streams.html":
        "How promotion converts to streams: exposure &rarr; searches and saves &rarr; algorithmic pickup. What to expect, what not to, and why bought streams destroy the loop.",
    "compare/digiwaxx-vs-groover.html":
        "Groover sells guaranteed-feedback pitches to curators, radio, and labels; Digiwaxx services records to 30,000+ US-rooted DJs. An honest comparison.",
    "compare/digiwaxx-vs-playlist-push.html":
        "An honest comparison: Playlist Push runs playlist curator and TikTok creator campaigns; Digiwaxx services records to a 30,000+ DJ network. Different jobs.",
    "compare/digiwaxx-vs-submithub.html":
        "SubmitHub sells per-pitch access to curators, blogs, and labels with guaranteed feedback; Digiwaxx services your record to 30,000+ DJs. Honest comparison.",
    "guides/how-to-get-djs-to-play-my-song.html":
        "What working DJs need before they play your record: proper files, easy delivery, and the record pool system that reaches thousands of DJs at once.",
    "promote/independent-music-promotion.html":
        "Independent music promotion that rents you the label machine: DJ servicing to 30,000+ DJs, radio, playlists, and published coverage, while you keep 100%.",
    "promote/music-promotion-for-record-labels.html":
        "How indie labels use Digiwaxx: DJ servicing for the whole roster, per-release campaigns without the infrastructure, and reaction data for A&amp;R calls.",
    "promotion/youtube-music-promotion.html":
        "How to promote music on YouTube: the second-biggest search engine, Shorts as a discovery engine, visualizers vs. videos, and turning views into fans.",
}



def vlen(s):
    """Length as a search engine renders it (HTML entities count as one char)."""
    return len(html.unescape(s))


def clause_candidates(text):
    """Every prefix of text produced by dropping trailing clauses, longest first."""
    seen, out, queue = set(), [], [text]
    while queue:
        cur = queue.pop(0)
        if cur in seen:
            continue
        seen.add(cur)
        out.append(cur)
        for sep in SPLITS:
            if sep in cur:
                head = cur.rsplit(sep, 1)[0].rstrip(" ,&-–")
                if head:
                    queue.append(head)
    return sorted(out, key=vlen, reverse=True)


def best(candidates, limit, floor):
    """Longest candidate within limit; falls back to the shortest overall."""
    fits = [c for c in candidates if vlen(c) <= limit]
    good = [c for c in fits if vlen(c) >= floor]
    if good:
        return max(good, key=vlen)
    if fits:
        return max(fits, key=vlen)
    shortest = min(candidates, key=vlen)
    return shortest[:limit].rsplit(" ", 1)[0].rstrip(" ,;:-&")


def fit_title(title):
    base = title[: -len(BRAND)] if title.endswith(BRAND) else title
    branded = "digiwaxx" in html.unescape(base).lower()
    cands = clause_candidates(base)
    # Offer each clause-trimmed variant both with and without the brand suffix.
    pool = list(cands) + ([] if branded else [c + BRAND for c in cands])
    return best(pool, TITLE_MAX, TITLE_MIN)


def fit_desc(desc):
    cands = clause_candidates(desc)
    # Sentence boundaries too, but never split on an abbreviation like "vs.".
    for m in re.finditer(r"(?<![A-Z])(?<!\bvs)(?<!\betc)(?<!\bi\.e)(?<!\be\.g)\.\s", desc):
        head = desc[: m.start() + 1]
        if head:
            cands.append(head)
    out = best(sorted(set(cands), key=vlen, reverse=True), DESC_MAX, DESC_MIN)
    return out.rstrip(" ,;:-&") if not out.endswith(".") else out


def sync(s, prop, new):
    """Mirror the corrected title into an og:/twitter: meta tag."""
    pat = r'(<meta\s+(?:property|name)="%s"\s+content=")([^"]*)(")' % re.escape(prop)
    return re.sub(pat, lambda m: m.group(1) + new + m.group(3), s, count=1)


def process(path, apply):
    rel = os.path.relpath(path, ROOT)
    s = orig = open(path, encoding="utf-8").read()
    changes = []

    m = re.search(r"(<title[^>]*>)(.*?)(</title>)", s, re.I | re.S)
    if m:
        old = m.group(2).strip()
        if vlen(old) > TITLE_MAX:
            new = fit_title(old)
            if new != old:
                changes.append(("title", old, new))
                s = s[: m.start(2)] + new + s[m.end(2):]
                for p in ("og:title", "twitter:title"):
                    s = sync(s, p, new)

    m = re.search(r'(<meta\s+name="description"\s+content=")([^"]*)(")', s, re.I)
    if m:
        old = m.group(2)
        if vlen(old) > DESC_MAX:
            new = DESC_OVERRIDES.get(rel) or fit_desc(old)
            if new != old:
                changes.append(("desc", old, new))
                s = s[: m.start(2)] + new + s[m.end(2):]
                for p in ("og:description", "twitter:description"):
                    s = sync(s, p, new)

    if changes and apply and s != orig:
        open(path, "w", encoding="utf-8").write(s)
    return changes


def main():
    apply = "--apply" in sys.argv
    files = sorted(glob.glob(f"{ROOT}/*/*.html")) + [f"{ROOT}/university.html", f"{ROOT}/index.html"]
    files = [f for f in files if "/api/" not in f and "/scripts/" not in f]
    n = 0
    for f in files:
        for kind, old, new in process(f, apply):
            n += 1
            print(f"[{kind}] {os.path.relpath(f, ROOT)}\n   {vlen(old):3d} {old}\n   {vlen(new):3d} {new}")
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}: {n} tag(s)")


if __name__ == "__main__":
    main()
