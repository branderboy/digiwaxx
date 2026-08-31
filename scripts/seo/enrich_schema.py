#!/usr/bin/env python3
"""Strengthen the structured data across the site.

Three things happen here:

1. The homepage declares a single canonical Organization and WebSite node with
   stable @ids. Every other page references those @ids instead of restating
   (and drifting from) the publisher details.
2. Article nodes gain the properties Google actually reads: mainEntityOfPage,
   isPartOf, inLanguage, articleSection, wordCount, and a refreshed
   dateModified. City and genre pages additionally get contentLocation and a
   Service node with areaServed, which is the signal that ties
   "hip hop promotion houston" to a real serviced market.
3. /university gets the CollectionPage + ItemList it never had, despite being
   the most-linked page on the site.

Re-running is safe: nodes are matched by @type and rewritten in place.

Usage: enrich_schema.py [--apply]
"""
import os, re, sys, json, glob, html, datetime
import lib
from lib import ROOT, SITE

ORG_ID = f"{SITE}#organization"
SITE_ID = f"{SITE}#website"
TODAY = os.environ.get("SEO_BUILD_DATE") or datetime.date.today().isoformat()

SECTION_LABEL = {
    "promote": "Promotion Services", "campaigns": "Campaign Blueprints",
    "guides": "Guides", "goals": "Artist Goals", "answers": "Answers",
    "promotion": "Cities, Genres & Platforms", "compare": "Comparisons",
    "journey": "Artist Journey", "tools": "Free Tools",
}


def dumps(obj):
    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False)


def word_count(s):
    """Words of actual article prose.

    Chrome, the generated link mesh, and the related-links blocks are stripped:
    they are navigation, and counting their anchor text would overstate how much
    the page actually says.
    """
    body = re.sub(r"(?is)<(script|style|nav|footer)[^>]*>.*?</\1>", " ", s)
    body = re.sub(r"(?s)<!-- seo:mesh -->.*?<!-- /seo:mesh -->", " ", body)
    body = re.sub(r'(?is)<section class="related">.*?</section>', " ", body)
    return len(re.sub(r"<[^>]+>", " ", body).split())


def blocks(s):
    """Yield (match, parsed) for each JSON-LD script block."""
    for m in re.finditer(r'(<script type="application/ld\+json">)(.*?)(</script>)', s, re.S):
        try:
            yield m, json.loads(m.group(2))
        except json.JSONDecodeError:
            continue


def replace_block(s, m, obj):
    return s[: m.start(2)] + dumps(obj) + s[m.end(2):]


# ---------------------------------------------------------------- homepage

def enrich_home(s):
    for m, j in list(blocks(s)):
        if j.get("@type") == "Organization":
            j["@id"] = ORG_ID
            j.setdefault("logo", {})
            j["logo"] = {"@type": "ImageObject", "@id": f"{SITE}#logo",
                         "url": f"{SITE}/assets/logo-org.png", "width": 1200, "height": 300}
            j["image"] = {"@id": f"{SITE}#logo"}
            j["slogan"] = "Breaking records since 1998."
            j["knowsAbout"] = ["Music promotion", "DJ promotion", "Record pools",
                               "Radio promotion", "Playlist promotion", "Independent music marketing"]
            s = replace_block(s, m, j)
    for m, j in list(blocks(s)):
        if j.get("@type") == "WebSite":
            j["@id"] = SITE_ID
            j["publisher"] = {"@id": ORG_ID}
            j["inLanguage"] = "en-US"
            j["description"] = ("Record pool and music promotion service connecting artists' "
                                "records to a network of 30,000+ working DJs since 1998.")
            s = replace_block(s, m, j)
    return s


# --------------------------------------------------------------- /university

def enrich_university(s, cat):
    if "CollectionPage" in s:
        s = re.sub(r'<script type="application/ld\+json">\{"@context":"https://schema\.org",'
                   r'"@type":"CollectionPage".*?</script>\n?', "", s, flags=re.S)
        s = re.sub(r'<script type="application/ld\+json">\{"@context":"https://schema\.org",'
                   r'"@type":"BreadcrumbList".*?</script>\n?', "", s, flags=re.S)

    hubs = [(lib_section, cfg) for lib_section, cfg in HUB_TITLES.items()]
    collection = {
        "@context": "https://schema.org", "@type": "CollectionPage",
        "@id": f"{SITE}/university#collection",
        "name": "Digiwaxx University",
        "description": ("Free guides, answers, city and genre playbooks, comparisons, and tools "
                        "on DJ promotion, radio, playlists, and breaking records as an "
                        "independent artist."),
        "url": f"{SITE}/university",
        "isPartOf": {"@id": SITE_ID},
        "publisher": {"@id": ORG_ID},
        "inLanguage": "en-US",
        "dateModified": TODAY,
        "mainEntity": {
            "@type": "ItemList",
            "name": "Digiwaxx University sections",
            "numberOfItems": len(hubs),
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "url": f"{SITE}/{sec}", "name": name}
                for i, (sec, name) in enumerate(hubs)]},
    }
    crumbs = lib.breadcrumb_ld([("Digiwaxx", "/"), ("University", "/university")])
    add = f'<script type="application/ld+json">{dumps(collection)}</script>\n' \
          f'<script type="application/ld+json">{dumps(crumbs)}</script>\n'
    return s.replace("</head>", add + "</head>", 1)


HUB_TITLES = {
    "promote": "Music Promotion Services",
    "campaigns": "Campaign Blueprints",
    "guides": "Release & Promotion Guides",
    "goals": "Promotion by Artist Goal",
    "answers": "Straight Answers on Music Promotion",
    "promotion": "Music Promotion by City, Genre & Platform",
    "compare": "Digiwaxx Compared to Other Services",
    "journey": "The Artist Journey",
    "tools": "Free Tools for Independent Artists",
}


# ------------------------------------------------------------ content pages

def card_url(s):
    """The share card as this page already references it, version and all."""
    m = re.search(r'<meta property="og:image" content="([^"]+)">', s)
    return m.group(1) if m else f"{SITE}/assets/share-card.png"


def place_node(city_key):
    return {"@type": "City", "name": lib.city_label(city_key),
            "address": {"@type": "PostalAddress",
                        "addressLocality": lib.city_label(city_key),
                        "addressRegion": lib.CITY_REGION.get(city_key, ""),
                        "addressCountry": "US"}}


def enrich_page(path, s, section, slug, cat):
    url = f"{SITE}/{section}/{slug}"
    meta = cat[section][slug]
    kind = lib.classify(slug) if section == "promotion" else {"kind": "other", "genre": None, "city": None}

    for m, j in list(blocks(s)):
        if j.get("@type") != "Article":
            continue
        j["@id"] = f"{url}#article"
        j["mainEntityOfPage"] = {"@type": "WebPage", "@id": url}
        j["isPartOf"] = {"@id": SITE_ID}
        j["publisher"] = {"@id": ORG_ID}
        j["author"] = {"@id": ORG_ID}
        j["inLanguage"] = "en-US"
        j["articleSection"] = SECTION_LABEL.get(section, section.title())
        j["wordCount"] = word_count(s)
        # dateModified belongs to the page, not to the build. The generator
        # keeps an honest per-page date in scripts/content/dates.json, moved
        # only when that page's content hash changes; stamping TODAY over it
        # on every run told Google all 137 pages changed again each time the
        # build was invoked. Keep what the page already carries.
        j.setdefault("dateModified", j.get("datePublished", TODAY))
        # The card URL is versioned by enrich_social, so take it from the page
        # rather than rebuilding it here and dropping the version.
        j["image"] = {"@type": "ImageObject", "url": card_url(s),
                      "width": 1200, "height": 630}
        about = [{"@type": "Thing", "name": "Music promotion"}]
        if kind["genre"]:
            about.append({"@type": "Thing",
                          "name": html.unescape(lib.GENRE_NAMES[kind["genre"]]) + " music"})
        j["about"] = about
        if kind["city"]:
            j["contentLocation"] = place_node(kind["city"])
        s = replace_block(s, m, j)

    # A Service node with areaServed is what connects a city page to the actual
    # offering; without it these read to Google as undifferentiated articles.
    # The node is rebuilt from scratch each run, so anything a later step hangs
    # off it has to be carried across: enrich_social owns the pricing, and
    # dropping it here left the two steps overwriting each other forever.
    carried = {}
    for _m, existing in blocks(s):
        if existing.get("@type") == "Service" and "offers" in existing:
            carried["offers"] = existing["offers"]
            break
    s = re.sub(r'<script type="application/ld\+json">\{"@context":"https://schema\.org",'
               r'"@type":"Service".*?</script>\n?', "", s, flags=re.S)
    if kind["kind"] in ("city", "genre", "genre-city"):
        name = html.unescape(meta["h1"])
        svc = {"@context": "https://schema.org", "@type": "Service",
               "@id": f"{url}#service",
               "name": name,
               "serviceType": "Music promotion and DJ record servicing",
               "provider": {"@id": ORG_ID},
               "description": html.unescape(meta["desc"]),
               "url": url,
               "audience": {"@type": "Audience", "audienceType":
                            "Independent artists, record labels, managers and producers"}}
        if kind["city"]:
            svc["areaServed"] = place_node(kind["city"])
        else:
            svc["areaServed"] = {"@type": "Country", "name": "United States"}
        svc.update(carried)
        s = s.replace("</head>", f'<script type="application/ld+json">{dumps(svc)}</script>\n</head>', 1)
    return s


def main():
    apply = "--apply" in sys.argv
    cat = lib.catalog()
    n = 0

    home = f"{ROOT}/index.html"
    s = open(home, encoding="utf-8").read()
    new = enrich_home(s)
    if new != s:
        n += 1
        if apply:
            open(home, "w", encoding="utf-8").write(new)
        print("enriched index.html (Organization + WebSite @ids)")

    uni = f"{ROOT}/university.html"
    s = open(uni, encoding="utf-8").read()
    new = enrich_university(s, cat)
    if new != s:
        n += 1
        if apply:
            open(uni, "w", encoding="utf-8").write(new)
        print("enriched university.html (CollectionPage + ItemList + BreadcrumbList)")

    for section in lib.SECTIONS:
        for f in sorted(glob.glob(f"{ROOT}/{section}/*.html")):
            slug = os.path.basename(f)[:-5]
            if slug == "index":
                continue
            s = open(f, encoding="utf-8").read()
            new = enrich_page(f, s, section, slug, cat)
            if new != s:
                n += 1
                if apply:
                    open(f, "w", encoding="utf-8").write(new)
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}: {n} pages enriched (build date {TODAY})")


if __name__ == "__main__":
    main()
