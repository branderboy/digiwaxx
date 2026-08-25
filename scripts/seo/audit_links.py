#!/usr/bin/env python3
"""Audit the site's internal link graph and on-page SEO tags.

Reports orphans, thin inbound-link counts, click depth from the homepage, and
any missing/over-length metadata. Run it after any structural change; a page
with one inbound link is a page Google will discover and then decline to crawl.

Usage: audit_links.py [--verbose]
"""
import os, re, sys, json, glob, html
from collections import defaultdict, deque, Counter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = "https://promote.digiwaxx.com"
SKIP = ("/api/", "/scripts/", "/seo-audit/", "google564ae809c7f9d6c9")


def url_for(path):
    """Map a file on disk to the URL Vercel serves it at (cleanUrls: true)."""
    rel = os.path.relpath(path, ROOT)[:-5]
    if rel == "index":
        return "/"
    if rel.endswith("/index"):
        return "/" + rel[: -len("/index")]
    return "/" + rel


def normalize(href):
    """Reduce an href to a comparable site-relative URL, or None if external."""
    h = href.split("#")[0].split("?")[0].strip()
    h = h.replace(SITE, "")
    if not h.startswith("/"):
        return None
    if h.endswith(".html"):
        h = h[:-5]
    if h.endswith("/index"):
        h = h[: -len("/index")]
    return (h.rstrip("/") or "/")


def main():
    verbose = "--verbose" in sys.argv
    files = [f for f in sorted(glob.glob(f"{ROOT}/*.html")) + sorted(glob.glob(f"{ROOT}/*/*.html"))
             if not any(s in f for s in SKIP)]
    pages = {url_for(f): f for f in files}

    inbound, outbound = defaultdict(set), defaultdict(set)
    meta, broken = {}, []
    for f in files:
        s = open(f, encoding="utf-8").read()
        src = url_for(f)

        def g(p):
            m = re.search(p, s, re.I | re.S)
            return m.group(1).strip() if m else ""

        ld = []
        for b in re.findall(r'application/ld\+json[^>]*>(.*?)</script>', s, re.S):
            try:
                j = json.loads(b)
            except Exception as e:
                broken.append((src, str(e)[:50]))
                continue
            for it in (j if isinstance(j, list) else [j]):
                if isinstance(it, dict):
                    ld.append(it.get("@type"))
        meta[src] = {
            "noindex": "noindex" in g(r'name="robots"\s+content="([^"]*)"').lower(),
            "title": html.unescape(g(r"<title[^>]*>(.*?)</title>")),
            "desc": html.unescape(g(r'name="description"\s+content="([^"]*)"')),
            "canonical": g(r'rel="canonical"\s+href="([^"]*)"'),
            "h1": len(re.findall(r"<h1[^>]*>", s)),
            "ld": [t for t in ld if t],
        }
        for href in re.findall(r'href="([^"]+)"', s):
            dst = normalize(href)
            if dst and dst != src:
                outbound[src].add(dst)
                if dst in pages:
                    inbound[dst].add(src)

    # Click depth from the homepage via BFS over the internal link graph.
    depth, q = {"/": 0}, deque(["/"])
    while q:
        cur = q.popleft()
        for dst in outbound[cur]:
            if dst in pages and dst not in depth:
                depth[dst] = depth[cur] + 1
                q.append(dst)

    # noindex pages are deliberately excluded from indexing, so holding them to
    # indexable-page standards would just be permanent noise in the report.
    noindex = {u for u, m in meta.items() if m["noindex"]}
    indexable = {u for u in pages if u not in noindex}
    print(f"=== {len(pages)} pages ({len(indexable)} indexable, "
          f"{len(noindex)} noindex: {', '.join(sorted(noindex))}) ===\n")
    dead = sorted({d for s in outbound for d in outbound[s]
                   if d not in pages and not d.startswith(("/assets", "/images", "/api"))
                   and "." not in d.rsplit("/", 1)[-1]})
    print(f"broken internal links : {len(dead)}")
    for d in dead:
        print(f"   -> {d}  (from {sorted(s for s in outbound if d in outbound[s])[:3]})")

    orphans = [u for u in indexable if not inbound[u] and u != "/"]
    print(f"\norphan pages (0 inbound): {len(orphans)}")
    for u in orphans:
        print("   ", u)

    thin = sorted((len(inbound[u]), u) for u in indexable if u != "/" and len(inbound[u]) < 5)
    print(f"\npages with <5 inbound links: {len(thin)}")
    if verbose:
        for n, u in thin:
            print(f"    {n}  {u}")

    print("\ninbound distribution:")
    for k, v in sorted(Counter(len(inbound[u]) for u in indexable).items()):
        print(f"   {k:4d} inbound: {v} pages")

    print("\nclick depth from homepage:")
    for k, v in sorted(Counter(depth.get(u, -1) for u in indexable).items()):
        print(f"   depth {k}: {v} pages" + ("   <-- UNREACHABLE" if k < 0 else ""))

    print("\n=== on-page tags ===")
    idx = {u: m for u, m in meta.items() if u in indexable}
    issues = {
        "missing title": [u for u, m in idx.items() if not m["title"]],
        "title > 60 chars": [u for u, m in idx.items() if len(m["title"]) > 60],
        "missing description": [u for u, m in idx.items() if not m["desc"]],
        "description > 160": [u for u, m in idx.items() if len(m["desc"]) > 160],
        "missing canonical": [u for u, m in idx.items() if not m["canonical"]],
        "h1 count != 1": [u for u, m in idx.items() if m["h1"] != 1],
        "no structured data": [u for u, m in idx.items() if not m["ld"]],
        "invalid JSON-LD": [u for u, _ in broken],
    }
    for k, v in issues.items():
        print(f"   {k:22s}: {len(v)}")
        if v and (verbose or len(v) <= 6):
            for u in v[:12]:
                print(f"        {u}")

    dupes = {k: v for k, v in Counter(m["title"] for m in idx.values()).items() if v > 1}
    print(f"   {'duplicate titles':22s}: {len(dupes)}")
    for t, c in dupes.items():
        print(f"        x{c} {t}")

    print("\nschema types in use:", dict(Counter(t for m in idx.values() for t in m["ld"])))
    fail = bool(dead or orphans or broken or issues["missing title"] or issues["no structured data"])
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
