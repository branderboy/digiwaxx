# 30 / 60 / 90 Day Plan

Owner types: **You** (business owner — facts, accounts, approvals), **Claude/dev** (implementable in this repo), **Writer** (you or delegated with your facts). Success metrics assume GSC+GA4 live by day 7.

## Days 1–30 — Foundation: get counted, get trusted, stop losing leads

| # | Task | Priority | Owner | Effort | Impact | Depends on | Success metric |
|---|---|---|---|---|---|---|---|
| 1 | Verify GSC + Bing, submit sitemap, request indexing for `/`, 4 compare pages, top 6 city pages, `what-is-a-record-pool` | Critical | You (+Claude for meta tag) | XS | High | domain access | 127 URLs discovered in GSC; indexing report populating |
| 2 | GA4 property + static snippet on all pages; events per MEASUREMENT-PLAN | Critical | Claude/dev after you create property | S | High | GA account | page_view from all clusters; events visible |
| 3 | Confirm apex→www 301 in Vercel; confirm `ADMIN_PASSWORD` env var set (fallback removed this session, commit 199c0d9) | Critical | You | XS | Med | Vercel access | curl shows 301; admin login works |
| 4 | Publish About/History, Contact, Privacy, Terms+Refund; add to all footers | High | You (facts) + Claude (build) | M | High | your business facts | pages live; footer links sitewide |
| 5 | Replace PayPal.me with PayPal Checkout + `/thank-you` → routes buyer to `/submit`; fire `purchase` event; backend routes already exist | High | Claude/dev + your PayPal account | M | High | PayPal business account | purchases recorded automatically; attribution gap →0 |
| 6 | Support email address (e.g. support@digiwaxxrecordpool.com) + show phone/email in funnel summary and footer | High | You | XS | Med | mailbox | contact visible at point of payment |
| 7 | 3 case studies published under `/results/` + linked from pricing section and compare pages | High | You (artist permissions/data) + Writer | M | High | real campaign data | pages live; internal links in place |
| 8 | Email-capture block (checklist PDF magnet) on all 125 content pages; `source_page` column on leads | High | Claude/dev | S–M | High | none | first email leads within 30 days |
| 9 | Delete 5.8 MB unused images; re-encode 12 MB video to ≤3 MB | Med | Claude/dev | XS–S | Low | none | repo/page weight down |
| 10 | Trim 15 over-length titles (list in PAGE-INVENTORY.csv) | Med | Claude/dev | S | Low | none | all titles ≤60 chars |
| 11 | Homepage footer "Learn" block (INTERNAL-LINKING-PLAN #1) | Med | Claude/dev | XS | Med | none | homepage links 8 content pages |

**Not this month:** backlink outreach, new city pages, paid traffic scale-up, redesigns.

## Days 31–60 — Relevance and proof

| # | Task | Priority | Owner | Effort | Impact | Depends on | Success metric |
|---|---|---|---|---|---|---|---|
| 12 | Localize the 6 biggest-metro page sets (Atlanta, NYC, Chicago, Houston, Miami, LA): local DJ/mixshow/venue names, local case-study pull-quote, "Also in {city}" link blocks | High | You (local facts) + Claude | L | High | case studies | similarity of touched pairs <70%; city impressions in GSC |
| 13 | Standalone `/pricing` page (indexable) + offer-FAQ section | High | Claude + you | S | Med | none | ranks for brand+pricing queries |
| 14 | Contextual linking mesh (~25 in-body links per INTERNAL-LINKING-PLAN) | Med | Claude | S | Med | none | in-degree ≥2 for all listed pages |
| 15 | Missing BOFU compare pages: record-pool-vs-playlist-promotion, digiwaxx-vs-radio-promoters | High | Writer | M | High | case studies | indexed; impressions on "vs" queries |
| 16 | Email nurture sequence (3–4 sends) for captured emails | High | You + Writer | M | High | task 8, ESP choice | capture→lead-form conversion measurable |
| 17 | House/EDM + amapiano + reggaeton genre pages (same 700+ word standard) | Med | Writer | M | Med | none | indexed, impressions |
| 18 | First "records moving in the pool" monthly roundup | Med | You | S | Med | none | published; becomes recurring |
| 19 | Original-data study page: methodology behind the 100k-songs funnel chart on `/` | Med | You (data) + Writer | M | High (link asset) | your data | page live, cited stat available |

## Days 61–90 — Authority and iteration

| # | Task | Priority | Owner | Effort | Impact | Depends on | Success metric |
|---|---|---|---|---|---|---|---|
| 20 | Digital PR: pitch history page + data study to hip-hop media, DJ blogs, production YouTubers | High | You/PR | M–L | High | tasks 4, 19 | 5–10 referring domains |
| 21 | DJ interview series (3 posts) + those DJs sharing links | Med | You | M | Med | DJ relationships | posts + natural links |
| 22 | Review generation: post-campaign email asks buyers for a testimonial/review (Trustpilot or on-site with schema **only if** genuine) | Med | You + Claude | S | High | task 5 (buyer emails) | 10+ real testimonials |
| 23 | GSC-driven iteration: expand pages with impressions-but-low-CTR (rewrite titles/descriptions), build content for surfacing queries | High | Claude + Writer | recurring | High | 60 days of GSC data | CTR/position improvements documented |
| 24 | Partnerships: producer communities, studio directories, artist-services marketplaces listing Digiwaxx | Med | You | M | Med | trust pages | referral traffic in GA4 |
| 25 | Re-run CWV via PageSpeed Insights; fix what field data shows | Low | Claude | S | Low | traffic exists | green CWV |

## Expectations (honest)

With a 2-week-old site: days 1–30 create *measurability and convertibility*, not traffic. Days 31–60 should show first impressions in GSC on long-tail answers/compare queries. Days 61–90 is when city/commercial pages can start moving **if** the proof and localization land — and any meaningful ranking on "record pool"-class terms will follow authority (links), not further on-page work. Leads in month 1 will come from existing warm channels (Instagram bio → site) via the new email capture, not from Google.
