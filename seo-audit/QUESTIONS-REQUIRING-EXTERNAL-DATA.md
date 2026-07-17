# Questions Requiring External Data

Everything below cannot be proven from the repository. Each item says what's needed and what decision it feeds.

## Google Search Console
1. **Is the property verified at all (DNS)?** → If not, task #1 of the 30-day plan is literally step zero.
2. **Index coverage: how many of the 127 URLs are indexed vs "Discovered — currently not crawled"?** → Determines whether the problem is submission, crawl budget, or quality filtering; changes the city-page strategy (mass "Discovered not crawled" on `/promotion/*` = doorway signal → localize or prune).
3. **Any manual actions or security issues?** → Would override every other priority.
4. **Which queries get impressions today (if any)?** → Seeds the 61–90-day content iteration; validates or replaces my inferred keyword targets.

## GA4 (or admin DB `site_content` table)
5. **Are `ga_measurement_id` / `fb_pixel_id` set in production?** → Decides whether analytics work is "configure" or "build".
6. **Any historical traffic since launch, by source?** → Establishes the baseline; also tells us what Instagram currently sends.

## Google Business Profile
7. **Does a GBP exist for Digiwaxx (NYC)?** → The brand has a physical history; a GBP + address would unlock LocalBusiness schema and brand-panel trust. Decision: whether local pack is a channel at all, and what address (if any) goes on the Contact page.

## Bing Webmaster Tools
8. **Verified?** → One-click GSC import; affects Copilot/Bing answer surfacing.

## CRM / form database (Postgres via admin panel)
9. **How many rows are in `leads`, `paypal_clicks`, `purchases`, `page_views` since launch?** → The actual funnel baseline. If `paypal_clicks` > 0 and `purchases` = 0, that quantifies the attribution gap (Conversion Audit #2) and the revenue leak urgency.
10. **Lead quality: are lead emails real artists?** → Validates the lead form's field set.

## Call tracking
11. **Does 1-800-665-1259 receive calls, and is it answered?** → It's the only contact method on the site; if it's dead, it's a trust liability, not an asset.

## Backlink tool (Ahrefs/Semrush/Majestic)
12. **Does `digiwaxxrecordpool.com` have any referring domains?** → Confirms the authority diagnosis quantitatively.
13. **Does the legacy brand have links elsewhere (old domain digiwaxx.com, press mentions, Wikipedia)?** → If an old domain with equity exists and is controlled, a 301 migration is possibly the single highest-impact SEO action available to this business. Needs ownership confirmation + link data before recommending.

## Keyword research tool
14. **Volumes/difficulty for: "record pool", "record pool for hip hop", "music promotion service", "submit music to djs", "{genre} promotion", "{city} music promotion", competitor brand terms.** → Sets realistic targets; my intent mapping in PAGE-INVENTORY.csv is inferred from page content, not volume data.

## Live SERP review
15. **Who actually ranks for "best record pools" and "digiwaxx vs submithub"-class queries, and with what content depth?** → Calibrates whether the 4 compare pages can win as-is; identifies real competitors beyond the three named in `/compare/`.
16. **Does Google show a knowledge panel for "Digiwaxx"?** → Entity status changes the About/sameAs schema priority.

## PageSpeed Insights / CrUX
17. **Field CWV for `/` and one content page.** → The 122 KB inline sales page and animated gradients are fine in lab reasoning, but only field data decides if performance work is warranted.

## Competitor research
18. **What do SubmitHub/Groover/Playlist Push have that this site lacks (features, proof volume, review counts)?** → Feeds compare-page upgrades and the review-generation target (task #22). I did not invent their metrics anywhere in this audit.

## From the business owner (not a tool)
19. **Is "30,000+ DJs" defensible, and how?** → Determines whether the claim stays, gets sourced, or gets softened; it appears in 8 places including meta descriptions and schema.
20. **Which real campaigns/artists can be named in case studies?** → Blocks the proof layer (30-day tasks #7).
21. **Does the historic Digiwaxx brand control any old domains/socials?** → Feeds #13 and the sameAs schema list (currently Instagram only).
