#!/usr/bin/env python3
"""Repoint every /university#anchor link at the real section hub page.

The nav, footer, and breadcrumbs all linked to fragments of a single page
(/university#promotion and friends). A fragment is not a crawlable destination:
it gave Google exactly one URL to reach 123 pages through. Now that /promotion,
/guides, /answers and the rest exist as real pages, those links point at them,
which is what turns nine hub pages into nine actual crawl entry points.

Usage: rewire_links.py [--apply]
"""
import os, re, sys, glob
import lib
from lib import ROOT

ANCHOR_TO_HUB = {
    "services": "/promote",
    "campaigns": "/campaigns",
    "guides": "/guides",
    "goals": "/goals",
    "answers": "/answers",
    "promotion": "/promotion",
    "compare": "/compare",
    "journey": "/journey",
    "tools": "/tools",
}


def rewire(s):
    """Replace /university#<anchor> with the hub URL, in href="" and in JSON-LD."""
    def sub(m):
        return ANCHOR_TO_HUB.get(m.group(1), m.group(0))
    # Covers both href="/university#promotion" and "item":"https://.../university#promotion".
    s = re.sub(r'(?<=")/university#([a-z]+)(?=")', sub, s)
    s = re.sub(r'(?<=")https://www\.digiwaxxrecordpool\.com/university#([a-z]+)(?=")',
               lambda m: "https://promote.digiwaxx.com" + ANCHOR_TO_HUB.get(m.group(1), "/university#" + m.group(1)),
               s)
    return s


def main():
    apply = "--apply" in sys.argv
    files = sorted(glob.glob(f"{ROOT}/*.html")) + sorted(glob.glob(f"{ROOT}/*/*.html"))
    files = [f for f in files if "/api/" not in f and "/scripts/" not in f]
    total, touched = 0, 0
    for f in files:
        s = open(f, encoding="utf-8").read()
        new = rewire(s)
        if new != s:
            n = len(re.findall(r"/university#[a-z]+", s)) - len(re.findall(r"/university#[a-z]+", new))
            total += n
            touched += 1
            if apply:
                open(f, "w", encoding="utf-8").write(new)
    print(f"{'APPLIED' if apply else 'DRY RUN'}: {total} links rewired across {touched} files")


if __name__ == "__main__":
    main()
