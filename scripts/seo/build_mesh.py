#!/usr/bin/env python3
"""Add a contextual internal-link mesh to every content page.

Hub pages fixed discovery, but most content pages still had only two inbound
links (their hub and the footer). Crawlers treat a page that nothing links to
as a page nothing values.

Two strategies:

  * /promotion/ pages get a *semantic* mesh. A genre-and-city page links to the
    other genres working in that same city, to the same genre in other cities,
    and up to both parent hubs. Those are the links a reader actually wants,
    which is also what makes them worth following.
  * Every other section gets a rotating sibling window: page i links to the six
    pages after it, wrapping around. Rotating rather than picking "top" pages
    means every page receives exactly six inbound links instead of the same
    handful hoarding them all.

The block is delimited by HTML comments so re-running replaces it in place.

Usage: build_mesh.py [--apply]
"""
import os, re, sys, glob, html
import lib
from lib import ROOT

START, END = "<!-- seo:mesh -->", "<!-- /seo:mesh -->"
WINDOW = 6
GENRE_HUB_SLUG = {v: k for k, v in lib.GENRE_HUBS.items()}

# Markets that have genre pages but no standalone city page of their own. Without
# these, Brooklyn/Bay Area/DMV pages have no parent to link up to and end up as
# near-orphans; each maps to the city page that actually covers its metro.
CITY_PARENT = {"brooklyn": "new-york", "bay-area": "oakland", "dmv": "washington-dc"}
# Genres with no hub page of their own, mapped to the closest hub that exists.
GENRE_PARENT = {"drill": "hip-hop"}


def card(href, cat, title):
    return (f'    <a class="related-card" href="{href}">'
            f'<span class="related-cat">{cat}</span>'
            f'<span class="related-t">{title}</span></a>')


def group(heading, cards):
    if not cards:
        return ""
    return (f'<section class="related">\n  <h2>{heading}</h2>\n'
            f'  <div class="related-grid">\n' + "\n".join(cards) + "\n  </div>\n</section>")


def rotate(items, i, n):
    """The n items following index i, wrapping around."""
    return [items[(i + k + 1) % len(items)] for k in range(min(n, len(items) - 1))]


def promotion_mesh(slug, cat):
    pages = cat["promotion"]
    k = lib.classify(slug)
    by_city, by_genre = {}, {}
    for s in pages:
        c = lib.classify(s)
        if c["kind"] == "genre-city":
            by_city.setdefault(c["city"], []).append((s, c["genre"]))
            by_genre.setdefault(c["genre"], []).append((s, c["city"]))
    out = []

    def h1(s):
        return pages[s]["h1"]

    if k["kind"] == "genre-city":
        city, genre = k["city"], k["genre"]
        gname = html.unescape(lib.GENRE_NAMES[genre])
        cname = lib.CITY_NAMES.get(city, city)

        parents = []
        city_page = f"music-promotion-{city}"
        if city_page not in pages and city in CITY_PARENT:
            city_page = f"music-promotion-{CITY_PARENT[city]}"
        if city_page in pages:
            parents.append(card(f"/promotion/{city_page}", "City", h1(city_page)))
        hub = GENRE_HUB_SLUG.get(genre) or GENRE_HUB_SLUG.get(GENRE_PARENT.get(genre))
        if hub in pages:
            parents.append(card(f"/promotion/{hub}", "Genre", h1(hub)))
        siblings = [s for s, g in sorted(by_city.get(city, [])) if g != genre]
        # cname already carries its article where one is needed ("the DMV").
        out.append(group(f"More in {cname}",
                         parents + [card(f"/promotion/{s}", "Genre &times; City", h1(s)) for s in siblings]))

        family = sorted(s for s, _ in by_genre.get(genre, []))
        others = rotate(family, family.index(slug), 8)
        out.append(group(f"{gname} in Other Cities",
                         [card(f"/promotion/{s}", "Genre &times; City", h1(s)) for s in others]))

    elif k["kind"] == "city":
        city = k["city"]
        cname = lib.CITY_NAMES.get(city, city)
        # Include the metros that sit under this city but have no page of their
        # own (Brooklyn under New York), so the reverse edge exists too.
        covered = [city] + [c for c, parent in CITY_PARENT.items() if parent == city]
        local = [card(f"/promotion/{s}", "Genre &times; City", h1(s))
                 for c in covered for s, _ in sorted(by_city.get(c, []))]
        out.append(group(f"By Genre in {cname}", local))
        cities = sorted(s for s in pages if lib.classify(s)["kind"] == "city")
        i = cities.index(slug)
        out.append(group("Other Markets",
                         [card(f"/promotion/{s}", "City", h1(s)) for s in rotate(cities, i, WINDOW)]))

    elif k["kind"] == "genre":
        genre = k["genre"]
        gname = html.unescape(lib.GENRE_NAMES[genre])
        out.append(group(f"{gname} by City",
                         [card(f"/promotion/{s}", "Genre &times; City", h1(s))
                          for s, _ in sorted(by_genre.get(genre, []))]))
        hubs = sorted(s for s in pages if lib.classify(s)["kind"] == "genre")
        i = hubs.index(slug)
        out.append(group("Other Genres",
                         [card(f"/promotion/{s}", "Genre", h1(s)) for s in rotate(hubs, i, WINDOW)]))

    elif k["kind"] == "platform":
        plats = sorted(s for s in pages if lib.classify(s)["kind"] == "platform")
        i = plats.index(slug)
        out.append(group("Other Platforms",
                         [card(f"/promotion/{s}", lib.PLATFORMS[s], h1(s)) for s in rotate(plats, i, WINDOW)]))
        cities = sorted(s for s in pages if lib.classify(s)["kind"] == "city")
        out.append(group("Promotion by Market",
                         [card(f"/promotion/{s}", "City", h1(s)) for s in cities[:WINDOW]]))

    return [x for x in out if x]


def section_mesh(section, slug, cat, label):
    pages = cat[section]
    order = sorted(pages)
    i = order.index(slug)
    sibs = rotate(order, i, WINDOW)
    return [group(f"More {label}",
                  [card(f"/{section}/{s}", label, pages[s]["h1"]) for s in sibs])]


SECTION_LABEL = {
    "answers": "Answers", "campaigns": "Campaigns", "compare": "Comparisons",
    "goals": "Goals", "guides": "Guides", "journey": "Artist Journey",
    "promote": "Services", "tools": "Tools",
}


def build_block(section, slug, cat):
    parts = (promotion_mesh(slug, cat) if section == "promotion"
             else section_mesh(section, slug, cat, SECTION_LABEL[section]))
    if section == "promotion":
        hub_name = "all cities, genres and platforms"
    else:
        hub_name = f"all {len(cat[section])} {SECTION_LABEL[section].lower()}"
    parts.append(
        f'<p class="hub-backlink"><a href="/{section}">&larr; Browse {hub_name}</a> '
        f'&middot; <a href="/university">Digiwaxx University</a></p>')
    return START + "\n" + "\n\n".join(parts) + "\n" + END


def inject(s, block):
    if START in s:
        return re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: block, s, flags=re.S)
    # Sit above the existing "Keep Going" block, or the CTA if there is none.
    for anchor in ('<section class="related">', '<section class="cta-block">'):
        if anchor in s:
            return s.replace(anchor, block + "\n\n" + anchor, 1)
    return s.replace("</article>", block + "\n</article>", 1)


def main():
    apply = "--apply" in sys.argv
    cat = lib.catalog()
    n = 0
    for section in lib.SECTIONS:
        for f in sorted(glob.glob(f"{ROOT}/{section}/*.html")):
            slug = os.path.basename(f)[:-5]
            if slug == "index":
                continue
            s = open(f, encoding="utf-8").read()
            new = inject(s, build_block(section, slug, cat))
            if new != s:
                n += 1
                if apply:
                    open(f, "w", encoding="utf-8").write(new)
    print(f"{'APPLIED' if apply else 'DRY RUN'}: mesh written to {n} pages")


if __name__ == "__main__":
    main()
