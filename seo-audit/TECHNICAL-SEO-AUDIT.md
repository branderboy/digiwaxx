# Technical SEO Audit

Method: scripted extraction across all 131 HTML files (titles, descriptions, canonicals, H1s, OG tags, schema, word counts, alt text, internal link graph), sitemap/robots parsing, plus real-browser rendering tests (desktop + 320/360/390/480px mobile) run in this session.

## What is already correct (verified, not assumed)

| Area | Evidence |
|---|---|
| Titles | 131/131 pages have unique, descriptive titles |
| Meta descriptions | 127/127 indexable pages have descriptions; none under 70 chars |
| Canonicals | 127/127 present, all `https://www.digiwaxxrecordpool.com/...`, clean-URL format matching `vercel.json` `cleanUrls: true` |
| H1s | Exactly one H1 per public page (admin.html has 2; it's noindexed) |
| Schema | All 125 content pages: Article + FAQPage + BreadcrumbList + Organization + ImageObject with `datePublished`/`dateModified`; index has Organization + WebSite |
| OG/Twitter | All indexable pages have og:title/description/image and twitter card |
| Robots/noindex | `robots.txt` allows all + disallows `/admin`; `404.html`, `admin.html`, `funnel.html`, `submit.html` correctly noindexed |
| Sitemap | 127 URLs, zero dead entries, zero indexable pages missing |
| Internal links | 0 broken internal links or images across 131 pages (link-checker run); no orphan indexable pages |
| Rendering | Site is pure static HTML — all content visible without JavaScript; only prices/copy are progressively enhanced from `/api/prices` with correct hardcoded fallbacks ($99/$149/$199 in markup) |
| Mobile | No horizontal overflow at 320–860px (nav overflow bug found and fixed in this session, commit 1954fcb) |
| Fonts | Google Fonts with `preconnect` + `display=swap` |
| Thin content | None under 495 words; median 771 |
| Alt text | 0 missing alts on public pages |
| 404 | Custom `404.html`, noindexed, correct for Vercel static hosting |

## Issues found

| # | Issue | Evidence (file) | Route | Severity | SEO impact | Recommended fix | Effort | Safe to fix directly? |
|---|---|---|---|---|---|---|---|---|
| 1 | No search engine verification anywhere | No `google*.html` file, no `google-site-verification` meta in any page; nothing for Bing | site-wide | **Critical** | If GSC is not DNS-verified, the site may be unsubmitted and unmonitored; 127 URLs published at once with no crawl request | Verify GSC + Bing WMT (DNS or meta tag), submit `sitemap.xml`, request indexing for top pages | XS | Partially (can add meta tag once you provide the token) |
| 2 | Purchase attribution structurally broken | `index.html` `checkPurchaseReturn()` reads `?purchase=success`; checkout is `window.location.href = 'https://paypal.me/' + user + '/' + total` — PayPal.me performs no return redirect | `/` | **High** (measurement, not crawl) | You cannot know which pages/keywords produce revenue; SEO ROI is unmeasurable | Replace PayPal.me with PayPal Checkout/Buttons (return URL + webhook, `/api/purchases` and PATCH route already exist), or at minimum record `paypal-click` as the conversion proxy in GA4 | M | Yes (code); needs PayPal account config |
| 3 | Analytics only load if a DB row exists | `index.html` loads GA4/FB Pixel only when `/api/site-content` returns `ga_measurement_id`/`fb_pixel_id`; content pages (125) have **no analytics loader at all** | all | **High** | Even if GA is configured in admin, 125 of 127 indexable pages send zero analytics | Add a static GA4 snippet to the shared content-page template & index (or confirm DB values and extend loader to content pages) | S | Yes, once GA4 ID provided |
| 4 | 60 programmatic pages 72–87% similar | Measured: `hip-hop-promotion-atlanta` vs `-chicago` 87%, `rnb-promotion-atlanta` vs `-houston` 87%, `music-promotion-memphis` vs `-nashville` 72% | `/promotion/*` | **High** | At 87% similarity the genre-city pages risk being classified as doorway pages; simultaneous publication amplifies it | Add per-city unique value: local DJ/venue/mixshow names, city case studies, city-specific stats; start with the 6 biggest metros; consider noindexing the weakest genre-city combos until they earn uniqueness | L | Partially (structure yes; local facts need you) |
| 5 | Zero trust pages | No about/contact/privacy/terms/refund file exists in repo (`ls` verified); footer links only to `/submit`, `/university`, tel:, tagglefish.com | site-wide | **High** | E-E-A-T deficit for a payment-taking site; also a PayPal/dispute liability | Create About, Contact, Privacy, Terms+Refunds; link from every footer | M | Yes (drafts); business details need you |
| 6 | 12 MB hero video served from Vercel static | `Digiwaxx__The_New_Music_Boost 2.mp4` (12 MB), `<source src="/Digiwaxx__...%202.mp4">` in `index.html:1959` | `/` | Medium | `preload="metadata"` avoids page-load cost (verified), but any play costs 12 MB; mobile abandonment + bandwidth | Re-encode to ~720p H.264 CRF 26 (~2–3 MB) or host on a video CDN | S | Yes |
| 7 | 5.8 MB of unreferenced images in repo root | `100000SONGS.png` (1.4M), `digidata.png` (1.3M), `video_thumbnail1.png` (1.8M), `comment-boost.jpg` (1.3M) — grep shows zero references; `.webp` versions in `/assets` are used instead | n/a | Low | Deploy weight only; risk of accidental future linking to 1.4MB PNG | Delete from repo | XS | Yes |
| 8 | 15 titles over 65 characters | e.g. `answers/what-is-a-record-pool.html` (74), `campaigns/60-day-release-plan.html` (76) — full list in PAGE-INVENTORY.csv | various | Low | Truncated SERP display, diluted keyword focus | Trim to ≤60 chars keeping primary phrase first | S | Yes |
| 9 | Single shared OG image site-wide | All pages use `/assets/share-card.png` | all | Low | Weaker social CTR on content pages | Per-cluster OG images (one per directory is enough) | M | Partially (needs design assets) |
| 10 | `www` vs apex handling not in repo | Canonicals are `www.`; `vercel.json` has no redirect config | site-wide | Unknown | If apex doesn't 301 to www, duplicate-host indexing | Confirm domain-level redirect in Vercel dashboard (external check) | XS | No (dashboard) |
| 11 | Organization schema `sameAs` lists only Instagram | `index.html` JSON-LD: `"sameAs":["https://www.instagram.com/digiwaxx"]` | `/` | Low | Weak entity corroboration for a 25-year-old brand | Add YouTube/X/Facebook/Wikipedia/MusicBrainz profiles that exist | XS | Yes, once URLs provided |
| 12 | Unverifiable claims sitewide | "30,000+ DJs" (8 locations), "100,000 songs uploaded [daily]" (hero image + chart), "Trusted since 1998" | `/`, all | Medium (trust/legal) | Unsupported numbers invite both user skepticism and dispute risk; no schema-fakery found (good) | Add a "where these numbers come from" line on About/methodology; keep claims you can defend | S | Needs your data |
| 13 | Heavy inline single-file sales page | `index.html` = 122 KB inline CSS+JS | `/` | Low | One request, no render-blocking external CSS — acceptable; CWV risk is mainly the background gradients + animations | Leave as-is; re-check with PageSpeed Insights after launch (external) | - | n/a |

No hreflang needed (single-language site, `lang="en"` present). No pagination exists. No query-parameter duplication exists (no faceted routes). No redirect chains exist in-repo (no redirects defined at all — see #10).

## Crawl/AI-engine readiness

- `llms.txt` (31 KB, well-structured index of all clusters with one-line summaries) — ahead of most sites for AI/answer engines.
- FAQPage schema on 125 pages positions the answers cluster for featured snippets and AI citation.
- Recommendation: add `about` page URL and organization facts to `llms.txt` once created.
