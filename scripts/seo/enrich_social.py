#!/usr/bin/env python3
"""Complete the Open Graph / Twitter card block and close the JSON-LD @id gaps.

Four passes over every built page:

  social    og:image dimensions and alt text, twitter:description and
            twitter:image:alt, og:locale from the page's own <html lang>
            (regionalised per market directory), and article:published_time /
            article:modified_time on og:type=article pages.

  feed      <link rel="alternate" type="application/rss+xml"> discovery.

  graph     Article.publisher, Service.provider, Person.worksFor and
            isPartOf all point at "#organization" / "#website" @ids that were
            only ever *defined* on the home page, leaving the reference
            dangling on every other page. Each page that references them
            now carries a compact definition of its own.

  offers    Service nodes gain the published campaign pricing as an
            AggregateOffer.

Shared images live under /assets, which vercel.json serves as immutable for a
year, correct only if the URL changes when the bytes do, so social image URLs
are stamped with a short content hash.

Usage: enrich_social.py [--apply]
"""
import os, re, sys, json, glob, hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = "https://promote.digiwaxx.com"

CARD_ALT = ("Digiwaxx: Get Your New Release in Front of 30,000+ DJs. "
            "Clubs, radio and playlists since 1998.")
VERSIONED = ["assets/share-card.png", "assets/logo-org.png"]

# Campaign pricing as published on the home page: one-time, three tiers.
TIERS = [("Starter", "99"), ("Pro", "149"), ("Elite", "199")]

# og:locale needs a region. <html lang> carries only the language on the
# Spanish-speaking market pages, so the directory picks the region apart.
LOCALES = {"en": "en_US", "en-GB": "en_GB", "es": "es_ES", "pt-BR": "pt_BR",
           "fr": "fr_FR", "ja": "ja_JP", "ko": "ko_KR", "id": "id_ID"}
DIR_LOCALES = {"mx": "es_MX", "co": "es_CO", "conosur": "es_AR", "br": "pt_BR",
               "ca": "en_CA", "uk": "en_GB", "india": "en_IN", "ph": "en_PH"}


def dumps(obj):
    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False)


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def asset_versions():
    """Short content hashes for the assets whose URLs must change with them."""
    out = {}
    for rel in VERSIONED:
        path = os.path.join(ROOT, rel)
        if os.path.exists(path):
            out[rel] = hashlib.sha1(open(path, "rb").read()).hexdigest()[:8]
    return out


def indent_of(src, needle):
    m = re.search(r"^([ \t]*)" + re.escape(needle), src, re.M)
    return m.group(1) if m else "    "


def after(src, anchor_re, addition):
    """Insert `addition` on the line after the first match of `anchor_re`."""
    m = re.search(anchor_re, src, re.M)
    if not m:
        return src
    end = src.index("\n", m.end()) + 1
    return src[:end] + addition + src[end:]


def version_assets(src, versions):
    for rel, h in versions.items():
        src = re.sub(r"(" + re.escape(SITE + "/" + rel) + r")(\?v=[0-9a-f]+)?",
                     r"\1?v=" + h, src)
    return src


def og_locale(rel_path, src):
    top = rel_path.split("/")[0] if "/" in rel_path else ""
    if top in DIR_LOCALES:
        return DIR_LOCALES[top]
    m = re.search(r'<html lang="([^"]+)"', src)
    lang = m.group(1) if m else "en"
    return LOCALES.get(lang, LOCALES.get(lang.split("-")[0], "en_US"))


def article_dates(src):
    m = re.search(r'"@type":"Article".*?"datePublished":"(\d{4}-\d\d-\d\d)"', src, re.S)
    pub = m.group(1) if m else None
    m = re.search(r'"@type":"Article".*?"dateModified":"(\d{4}-\d\d-\d\d)"', src, re.S)
    mod = m.group(1) if m else None
    return pub, mod


def enrich_social(src, rel_path):
    pad = indent_of(src, "<meta property=\"og:image\"")

    # Alt text is canonical, not merely defaulted: a page carrying an older
    # wording is brought back in line rather than left behind.
    src = re.sub(r'(<meta (?:property="og:image:alt"|name="twitter:image:alt") content=")[^"]*(">)',
                 lambda m: m.group(1) + esc(CARD_ALT) + m.group(2), src)
    if 'property="og:image"' in src and 'property="og:image:width"' not in src:
        src = after(src, r'^[ \t]*<meta property="og:image" content="[^"]*">',
                    f'{pad}<meta property="og:image:width" content="1200">\n'
                    f'{pad}<meta property="og:image:height" content="630">\n'
                    f'{pad}<meta property="og:image:alt" content="{esc(CARD_ALT)}">\n')

    if 'name="twitter:image"' in src and 'name="twitter:image:alt"' not in src:
        src = after(src, r'^[ \t]*<meta name="twitter:image" content="[^"]*">',
                    f'{pad}<meta name="twitter:image:alt" content="{esc(CARD_ALT)}">\n')

    # The university hub ships a card with no twitter:title at all, so the
    # title is filled from og:title before the description hangs off it.
    if 'name="twitter:card"' in src and 'name="twitter:title"' not in src:
        m = re.search(r'<meta property="og:title" content="([^"]*)">', src)
        if m:
            src = after(src, r'^[ \t]*<meta name="twitter:card" content="[^"]*">',
                        f'{pad}<meta name="twitter:title" content="{m.group(1)}">\n')

    if 'name="twitter:description"' not in src:
        m = re.search(r'<meta property="og:description" content="([^"]*)">', src)
        if m and 'name="twitter:title"' in src:
            src = after(src, r'^[ \t]*<meta name="twitter:title" content="[^"]*">',
                        f'{pad}<meta name="twitter:description" content="{m.group(1)}">\n')

    if 'property="og:locale"' not in src and 'property="og:site_name"' in src:
        src = after(src, r'^[ \t]*<meta property="og:site_name" content="[^"]*">',
                    f'{pad}<meta property="og:locale" content="{og_locale(rel_path, src)}">\n')

    if '<meta property="og:type" content="article">' in src and "article:published_time" not in src:
        pub, mod = article_dates(src)
        if pub:
            tags = f'{pad}<meta property="article:published_time" content="{pub}T00:00:00+00:00">\n'
            if mod:
                tags += f'{pad}<meta property="article:modified_time" content="{mod}T00:00:00+00:00">\n'
            tags += f'{pad}<meta property="article:publisher" content="{SITE}">\n'
            src = after(src, r'^[ \t]*<meta property="og:type" content="article">', tags)
    return src


def enrich_feed(src):
    if 'type="application/rss+xml"' in src:
        return src
    pad = indent_of(src, '<link rel="icon"')
    tag = (f'{pad}<link rel="alternate" type="application/rss+xml" '
           f'title="Digiwaxx University" href="{SITE}/feed.xml">\n')
    m = re.search(r'^[ \t]*<link rel="icon"', src, re.M)
    if not m:
        return src.replace("</head>", tag + "</head>", 1)
    return src[:m.start()] + tag + src[m.start():]


def enrich_graph(src, versions):
    """Define #organization and #website on any page that only references them."""
    refs = "#organization" in src or "#website" in src
    defined = '"@type":"Organization"' in src and '"@id":"' + SITE + '#organization"' in src
    if not refs or defined:
        return src
    logo = f"{SITE}/assets/logo-org.png"
    if "assets/logo-org.png" in versions:
        logo += "?v=" + versions["assets/logo-org.png"]
    graph = {"@context": "https://schema.org", "@graph": [
        {"@type": "Organization", "@id": f"{SITE}#organization", "name": "Digiwaxx",
         "url": SITE, "foundingDate": "1998",
         "logo": {"@type": "ImageObject", "@id": f"{SITE}#logo", "url": logo,
                  "width": 1200, "height": 300},
         "sameAs": ["https://www.instagram.com/digiwaxx"]},
        {"@type": "WebSite", "@id": f"{SITE}#website", "name": "Digiwaxx", "url": SITE,
         "publisher": {"@id": f"{SITE}#organization"}, "inLanguage": "en-US"}]}
    return src.replace("</head>", f'<script type="application/ld+json">{dumps(graph)}</script>\n</head>', 1)


def enrich_offers(src):
    """Give Service nodes the published campaign pricing."""
    def add(m):
        block = m.group(1)
        if '"@type":"Service"' not in block or '"offers"' in block:
            return m.group(0)
        node = json.loads(block)
        node["offers"] = {
            "@type": "AggregateOffer", "priceCurrency": "USD",
            "lowPrice": TIERS[0][1], "highPrice": TIERS[-1][1],
            "offerCount": len(TIERS), "availability": "https://schema.org/InStock",
            "url": f"{SITE}/#pricing",
            "offers": [{"@type": "Offer", "name": f"{name} campaign", "price": price,
                        "priceCurrency": "USD", "availability": "https://schema.org/InStock",
                        "url": f"{SITE}/#pricing"} for name, price in TIERS]}
        return f'<script type="application/ld+json">{dumps(node)}</script>'
    return re.sub(r'<script type="application/ld\+json">(\{.*?\})</script>', add, src, flags=re.S)


def main():
    apply = "--apply" in sys.argv
    versions = asset_versions()
    print("asset versions: " + ", ".join(f"{k} -> ?v={v}" for k, v in versions.items()) + "\n")
    counts = {"social": 0, "feed": 0, "graph": 0, "offers": 0, "versioned": 0}
    changed = 0

    for path in sorted(glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(path, ROOT)
        src = original = open(path, encoding="utf-8", errors="replace").read()
        if 'property="og:title"' not in src:
            continue  # utility pages (admin, 404, verification) carry no card

        step = enrich_social(src, rel)
        counts["social"] += step != src
        src = step
        step = enrich_feed(src)
        counts["feed"] += step != src
        src = step
        step = enrich_graph(src, versions)
        counts["graph"] += step != src
        src = step
        step = enrich_offers(src)
        counts["offers"] += step != src
        src = step
        step = version_assets(src, versions)
        counts["versioned"] += step != src
        src = step

        if src != original:
            changed += 1
            if apply:
                open(path, "w", encoding="utf-8").write(src)

    for k, v in counts.items():
        print(f"  {v:4d} pages  {k}")
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}: {changed} pages changed")


if __name__ == "__main__":
    main()
