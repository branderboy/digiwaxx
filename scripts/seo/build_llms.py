#!/usr/bin/env python3
"""Regenerate llms.txt and link /university's section headings to their hubs.

llms.txt is built from the live page metadata, so it stops drifting every time a
title or description is edited. Each section now leads with its hub URL, which
gives an AI crawler the same entry points a search crawler gets.

The /university edit wraps each section heading in a link to that section's hub
and adds a "view all" link under the grid. Without it, university.html is the
only page on the site that talks about a section without linking to it.

Usage: build_llms.py [--apply]
"""
import os, re, sys, html
import lib
from lib import ROOT, SITE

# Section order, the llms.txt heading, and the hub each maps to.
ORDER = [
    ("promote", "Promotion Services", "Promotion Services"),
    ("campaigns", "Campaign Blueprints", "Campaign Blueprints"),
    ("guides", "Release & Promotion Guides", "Release &amp; Promotion Guides"),
    ("goals", "Artist Goals", "Artist Goals"),
    ("answers", "Straight Answers", "Straight Answers"),
    ("promotion", "Promotion Hubs: Cities, Genres & Platforms", "Promotion Hubs"),
    ("compare", "Comparisons", "Comparisons"),
    ("journey", "The Artist Journey", "The Artist Journey"),
    ("tools", "Free Artist Tools", "Free Artist Tools"),
]

HEADER = """# Digiwaxx

> Digiwaxx is a record pool and music promotion service operating since 1998,
> connecting artists' records to a network of 30,000+ working DJs (club,
> mixshow, radio, mobile), plus radio rotation, playlist placement, and
> published artist coverage. One-time campaigns: Starter $99, Pro $149,
> Elite $199. Main site: https://www.digiwaxxrecordpool.com, start at https://www.digiwaxxrecordpool.com/university.

## Section Indexes

Every section has a full index page listing all of its articles:

"""


def clean(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def build_llms(cat):
    out = [HEADER]
    for section, heading, _ in ORDER:
        out.append(f"- [{heading}]({SITE}/{section}): {len(cat[section])} pages\n")
    out.append("\n")
    for section, heading, _ in ORDER:
        out.append(f"## {heading}\n\nIndex: {SITE}/{section}\n\n")
        for slug in sorted(cat[section], key=lambda s: cat[section][s]["h1"]):
            m = cat[section][slug]
            out.append(f"- [{clean(m['h1'])}]({SITE}/{section}/{slug}): {clean(m['desc'])}\n")
        out.append("\n")
    return "".join(out).rstrip() + "\n"


def link_university(s, cat):
    """Make each /university section heading link to its hub, idempotently."""
    for section, _, h2 in ORDER:
        # Heading -> hub link.
        plain = f"<h2>{h2}</h2>"
        if plain in s:
            s = s.replace(plain, f'<h2><a href="/{section}">{h2}</a></h2>', 1)
        # "View all" link beneath the section grid, if not already present.
        marker = f'<a class="cfooter-more" href="/{section}">'
        if marker not in s:
            pat = re.compile(r'(<section class="hub-cat"[^>]*>\s*<h2><a href="/%s">.*?</div>)' % section, re.S)
            s = pat.sub(
                lambda m: m.group(1) + f'\n  <p class="hub-backlink">'
                          f'<a class="cfooter-more" href="/{section}">'
                          f'View all {len(cat[section])} &rarr;</a></p>', s, count=1)
    return s


def main():
    apply = "--apply" in sys.argv
    cat = lib.catalog()

    llms = build_llms(cat)
    if apply:
        open(f"{ROOT}/llms.txt", "w", encoding="utf-8").write(llms)
    print(f"llms.txt: {len(llms.splitlines())} lines, "
          f"{sum(len(v) for v in cat.values())} pages + {len(ORDER)} hub indexes")

    uni = f"{ROOT}/university.html"
    s = open(uni, encoding="utf-8").read()
    new = link_university(s, cat)
    n = len(re.findall(r'<h2><a href="/', new))
    if apply and new != s:
        open(uni, "w", encoding="utf-8").write(new)
    print(f"university.html: {n} section headings linked to hubs")
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}")


if __name__ == "__main__":
    main()
