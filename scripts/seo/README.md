# SEO build scripts

Tooling that fixes and maintains the site's crawlability. Every script is
idempotent and takes `--apply`; without it they dry-run and print what they
would change.

```bash
./scripts/seo/build.sh           # dry run everything
./scripts/seo/build.sh --apply   # rebuild all generated artifacts, then audit
```

## The problem these were written for

Search Console reported 123 URLs as **"Discovered – currently not indexed"**,
every one with a last-crawl date of `1969-12-31` — Google had found them in the
sitemap and never crawled a single one.

The pages themselves were fine (~700 words each, unique prose, no duplicate
titles or descriptions, no hard orphans). The crawl *architecture* was not:

| | Before | After |
|---|---|---|
| Section index pages | none — `/promotion` etc. 404'd | 9 real hubs |
| Links into a typical content page | 1–2 | 8–15 |
| Pages with ≤2 inbound links | 54 | 0 |
| Hub links | `/university#promotion` (a fragment) | `/promotion` (a page) |
| Sitemap | 1 flat file, uniform stale `lastmod` | index + 10 section sitemaps, real `lastmod` |
| Titles over 60 chars | 91 | 0 |
| Structured data on `/university` | none | `CollectionPage` + `ItemList` |

## Scripts

Run in this order (`build.sh` does it for you): dashes go first because the
title trimmer splits on the punctuation they become; hubs and `llms.txt` read
page titles, so `fix_meta` trims and `apply_titles` writes the approved copy
before them; the mesh and sitemap read the hubs.

**Do not edit the built HTML by hand.** `scripts/content/chrome.js` holds the
site nav and footer, and everything else is generated. Commit 7334b86 edited
136 built pages directly and the generators did not know, so regenerating
silently deleted the work; that is what `chrome.js` exists to prevent.

| Script | What it does |
|---|---|
| `lib.py` | Shared constants, the `/promotion` slug → (genre, city) taxonomy, page catalog, and the nav/footer chrome lifted from existing pages |
| `strip_dashes.py` | Removes punctuation em/en dashes (characters and `&mdash;`/`&ndash;` entities) from every public page, so the convention set in 712fbf8 survives regeneration |
| `fix_meta.py` | Trims titles to ≤60 and descriptions to ≤160 chars at clause boundaries, keeping `og:`/`twitter:` in sync |
| `apply_titles.py` | Writes the approved SERP titles and descriptions over the trimmed ones, keeping `og:`/`twitter:` in step, and refuses to write anything the 60-char trimmer would clip |
| `build_hubs.py` | Generates `/{section}/index.html` for all 9 sections |
| `rewire_links.py` | Repoints `/university#anchor` links at the real hub pages |
| `build_mesh.py` | Injects the contextual internal-link mesh into each content page |
| `enrich_schema.py` | Adds `@id`-linked `Organization`/`WebSite`, enriches `Article`, adds `Service` + `areaServed` to city/genre pages |
| `enrich_social.py` | Completes the Open Graph / Twitter card block (image dimensions, alt text, `og:locale`, article times), adds RSS discovery, defines the `#organization`/`#website` nodes the `@id` references point at, prices `Service` nodes, and content-stamps the shared social images |
| `build_llms.py` | Regenerates `llms.txt`; links `/university` headings to their hubs |
| `build_sitemap.py` | Rebuilds `sitemap.xml` as an index over `/sitemaps/*.xml` |
| `build_feed.py` | Builds `/feed.xml`, the RSS 2.0 feed of the newest 25 article pages, read back out of their own JSON-LD |
| `audit_links.py` | Reports orphans, inbound-link counts, click depth, and tag problems. Exits non-zero on findings |
| `submit_urls.py` | IndexNow / Google Indexing API submission and a ranked manual-submission list |

`build_mesh.py` writes between `<!-- seo:mesh -->` markers, so re-running
replaces the block rather than stacking copies. Editing prose around it is safe.

## Getting the pages crawled

There is **no API that forces Google to index a page.** Google retired the
sitemap ping endpoint in January 2024, and the Indexing API is officially
limited to `JobPosting` and `BroadcastEvent`. What actually moves URLs out of
"Discovered – currently not indexed" is the crawl-signal work above, followed by:

1. **Resubmit the sitemaps** in Search Console → Sitemaps. Submit
   `sitemap.xml`; the 10 children are picked up from the index. Per-section
   sitemaps mean coverage is reported per section, so you can see *which* part
   is still stuck instead of guessing.
2. **Request indexing for the 9 hubs first**, via URL Inspection (quota is
   roughly 10–20/day). Indexing a hub gives Google a fresh crawl path to
   everything under it, which is worth far more than requesting 10 leaf pages.
   `python3 scripts/seo/submit_urls.py list --stuck Table.csv` prints them in
   that order.
3. **IndexNow** covers Bing, Yandex, Seznam and Naver, usually within hours:
   ```bash
   python3 scripts/seo/submit_urls.py indexnow
   ```
   Ownership is verified by fetching `/{key}.txt`; the script writes both that
   file and `indexnow-key.txt` so they cannot drift. Both must be deployed
   before submitting.
4. **Google Indexing API**, if you have a service account with the Indexer role
   — unsupported for article pages, so treat any success as a bonus:
   ```bash
   python3 scripts/seo/submit_urls.py google --credentials sa.json --dry-run
   ```

Expect recrawl to take days to weeks. Re-export the coverage drilldown from
Search Console after ~2 weeks and compare.

## Adding a page

Drop the HTML in the right section directory, then:

```bash
./scripts/seo/build.sh --apply
```

The hubs, mesh, `llms.txt`, and sitemaps all pick it up. `audit_links.py` will
flag it if it ends up under-linked.
