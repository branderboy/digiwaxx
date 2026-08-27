#!/usr/bin/env python3
"""Build /feed.xml — the RSS 2.0 feed for Digiwaxx University.

Every page that carries Article schema is a feed candidate; the newest
NEWEST_N by datePublished (ties broken by title, so the output is stable
between runs) become items. Titles, links, descriptions, dates, sections
and bylines are read back out of each page's own JSON-LD rather than kept
in a second list that could drift from the pages themselves.

Usage: build_feed.py [--apply]
"""
import os, re, sys, json, glob, html
from email.utils import format_datetime
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = "https://promote.digiwaxx.com"
FEED_PATH = "feed.xml"
NEWEST_N = 25

CHANNEL_TITLE = "Digiwaxx University"
CHANNEL_DESC = ("Guides, straight answers and campaign playbooks on DJ promotion, "
                "radio, playlists and breaking records — from the record pool "
                "that has served working DJs since 1998.")


def esc(s):
    return html.escape(str(s), quote=False).replace('"', "&quot;")


def rfc822(day):
    """A YYYY-MM-DD publication date as an RFC-822 stamp at midnight UTC."""
    return format_datetime(datetime.strptime(day, "%Y-%m-%d").replace(tzinfo=timezone.utc))


def articles():
    """Every built page carrying Article schema, newest first."""
    found = []
    for path in sorted(glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(path, ROOT)
        src = open(path, encoding="utf-8", errors="replace").read()
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
            try:
                node = json.loads(block)
            except ValueError:
                continue
            if node.get("@type") != "Article":
                continue
            author = node.get("author") or {}
            found.append({
                "title": node.get("headline") or "",
                "url": node.get("url") or "",
                "description": node.get("description") or "",
                "published": node.get("datePublished") or "",
                "section": node.get("articleSection") or "",
                "author": author.get("name") if isinstance(author, dict) else None,
                "file": rel,
            })
            break
    found = [a for a in found if a["title"] and a["url"] and a["published"]]
    found.sort(key=lambda a: (a["published"], a["title"]), reverse=True)
    return found


def build(items, built):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" '
             'xmlns:dc="http://purl.org/dc/elements/1.1/">',
             '  <channel>',
             f'    <title>{esc(CHANNEL_TITLE)}</title>',
             f'    <link>{SITE}/university</link>',
             f'    <description>{esc(CHANNEL_DESC)}</description>',
             '    <language>en-us</language>',
             f'    <lastBuildDate>{built}</lastBuildDate>',
             '    <ttl>1440</ttl>',
             f'    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>',
             '    <image>',
             f'      <url>{SITE}/assets/logo-org.png</url>',
             f'      <title>{esc(CHANNEL_TITLE)}</title>',
             f'      <link>{SITE}/university</link>',
             '    </image>']
    for a in items:
        lines += ['    <item>',
                  f'      <title>{esc(a["title"])}</title>',
                  f'      <link>{a["url"]}</link>',
                  f'      <guid isPermaLink="true">{a["url"]}</guid>',
                  f'      <description>{esc(a["description"])}</description>',
                  f'      <pubDate>{rfc822(a["published"])}</pubDate>']
        if a["section"]:
            lines.append(f'      <category>{esc(a["section"])}</category>')
        if a["author"]:
            lines.append(f'      <dc:creator>{esc(a["author"])}</dc:creator>')
        lines.append('    </item>')
    lines += ['  </channel>', '</rss>', '']
    return "\n".join(lines)


def main():
    apply = "--apply" in sys.argv
    found = articles()
    items = found[:NEWEST_N]
    # lastBuildDate tracks the newest post, not the clock, so an unchanged
    # site rebuilds to a byte-identical feed.
    built = rfc822(items[0]["published"]) if items else rfc822("1998-01-01")
    xml = build(items, built)
    print(f"{len(found)} article pages found; feed carries the newest {len(items)}")
    for a in items[:5]:
        print(f"  {a['published']}  {a['title'][:64]}")
    if not apply:
        print("\n(dry run — pass --apply to write feed.xml)")
        return
    open(os.path.join(ROOT, FEED_PATH), "w", encoding="utf-8").write(xml)
    print(f"\nwrote {FEED_PATH} ({len(xml)} bytes)")


if __name__ == "__main__":
    main()
