#!/usr/bin/env python3
"""Rebuild sitemap.xml as a sitemap index with one child sitemap per section.

The old sitemap was a single flat file where all 127 URLs carried the same
lastmod (2026-07-08) and near-identical priority. That gives Google no freshness
signal to act on and no way to tell which part of the site changed.

Splitting per section also makes Search Console useful: coverage is reported per
submitted sitemap, so "which section is not getting indexed" becomes a question
you can answer by looking rather than guessing.

lastmod is real, not invented: it comes from the file's last git commit date, or
today's date when the file has uncommitted changes.

Usage: build_sitemap.py [--apply]
"""
import os, re, sys, glob, subprocess, datetime
import lib
from lib import ROOT, SITE

TODAY = os.environ.get("SEO_BUILD_DATE") or datetime.date.today().isoformat()
OUTDIR = f"{ROOT}/sitemaps"

# Pages that must never appear in a sitemap: noindex, admin, or error pages.
EXCLUDE = {"/404", "/admin", "/submit", "/funnel"}


def dirty_files():
    try:
        out = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout
    except Exception:
        return set()
    return {line[3:].strip() for line in out.splitlines() if line.strip()}


def git_date(rel):
    try:
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT,
                           capture_output=True, text=True, check=True).stdout.strip()
        return d or TODAY
    except Exception:
        return TODAY


def url_for(path):
    rel = os.path.relpath(path, ROOT)[:-5]
    if rel == "index":
        return "/"
    if rel.endswith("/index"):
        return "/" + rel[: -len("/index")]
    return "/" + rel


def priority(url):
    if url == "/":
        return "1.0"
    depth = url.strip("/").count("/")
    if depth == 0:                      # /university and the nine section hubs
        return "0.9"
    slug = url.rsplit("/", 1)[-1]
    if url.startswith("/promotion/"):
        kind = lib.classify(slug)["kind"]
        return {"city": "0.8", "genre": "0.8", "platform": "0.8"}.get(kind, "0.7")
    return "0.7"


def changefreq(url):
    return "weekly" if url.strip("/").count("/") == 0 else "monthly"


def urlset(entries):
    body = "\n".join(
        f"  <url><loc>{SITE}{u}</loc><lastmod>{d}</lastmod>"
        f"<changefreq>{changefreq(u)}</changefreq><priority>{priority(u)}</priority></url>"
        for u, d in entries)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f"{body}\n</urlset>\n")


def main():
    apply = "--apply" in sys.argv
    dirty = dirty_files()

    def entry(path):
        rel = os.path.relpath(path, ROOT)
        return url_for(path), (TODAY if rel in dirty else git_date(rel))

    groups = {}
    core = [entry(f"{ROOT}/index.html"), entry(f"{ROOT}/university.html")]
    for section in lib.SECTIONS:
        core.append(entry(f"{ROOT}/{section}/index.html"))
        pages = [entry(f) for f in sorted(glob.glob(f"{ROOT}/{section}/*.html"))
                 if not f.endswith("/index.html")]
        groups[section] = sorted(pages)
    groups["core"] = core

    # The international conversion pages are hand-authored rather than
    # section-globbed, so they ride in from the explicit list in lib.py.
    groups["international"] = sorted(entry(f"{ROOT}/{rel}") for rel in lib.INTERNATIONAL)

    order = ["core"] + lib.SECTIONS + ["international"]
    written = []
    for name in order:
        entries = [(u, d) for u, d in groups[name] if u not in EXCLUDE]
        xml = urlset(entries)
        path = f"{OUTDIR}/{name}.xml"
        if apply:
            os.makedirs(OUTDIR, exist_ok=True)
            open(path, "w", encoding="utf-8").write(xml)
        written.append((name, len(entries)))

    index = ('<?xml version="1.0" encoding="UTF-8"?>\n'
             '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
             + "\n".join(f"  <sitemap><loc>{SITE}/sitemaps/{n}.xml</loc>"
                         f"<lastmod>{TODAY}</lastmod></sitemap>" for n, _ in written)
             + "\n</sitemapindex>\n")
    if apply:
        open(f"{ROOT}/sitemap.xml", "w", encoding="utf-8").write(index)

    total = sum(c for _, c in written)
    for n, c in written:
        print(f"  /sitemaps/{n}.xml  {c:3d} urls")
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}: sitemap index + {len(written)} sitemaps, {total} urls")


if __name__ == "__main__":
    main()
