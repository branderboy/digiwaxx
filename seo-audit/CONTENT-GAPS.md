# Content Gaps — prioritized by business impact

What exists today (from PAGE-INVENTORY.csv): 125 content pages across answers (17), guides (20), promotion/city+genre (60), promote/audience (10), compare (4), goals (6), campaigns (4), journey (4), tools (6). What follows is what's *missing*, ordered by expected impact on revenue, not ease of writing.

## 1. Trust content (blocks everything else)
- **About / Our Story** — the 1998→2026 history, the people behind it, photos, the office/studio, how the DJ network was built. This is simultaneously an E-E-A-T fix, a conversion asset, and the site's only realistic backlink magnet. *No page like this exists.*
- **Contact** — email, phone (1-800-665-1259 appears once, in `index.html:2277` only), response-time promise. *Zero email addresses exist on the public site.*
- **Privacy Policy + Terms + Refund policy** — legally expected for a site taking payments; PayPal disputes are lost without published terms.
- **"How our numbers work"** — one page backing the 30,000+ DJs / since-1998 claims, even loosely (network composition, how DJs join). Every page repeats these claims; none supports them.

## 2. Case studies / results (the proof layer)
Zero case studies exist. Highest-impact missing pages on the entire site:
- 3–5 pages: `/results/<artist-record>` — tier bought, what was serviced, DJ feedback screenshots, spins/adds, what happened after. Real names with permission.
- A `/results` index page linked from the sales page pricing section ("See what a $149 campaign did →").
- These feed every other cluster: city pages cite the local case study, compare pages cite outcomes, the funnel cites them at the point of payment.

## 3. Bottom-of-funnel commercial pages
- **`/pricing`** as a standalone indexable page. Searches like "digiwaxx pricing", "record pool cost" currently have to land on `/#pricing` (a fragment, not a page). The answers page on promotion cost exists but is generic-informational, not the offer.
- **`/compare/digiwaxx-vs-radio-promoters`** and **`/compare/record-pool-vs-playlist-promotion`** — the two substitute decisions artists actually weigh; existing compare set (SubmitHub/Groover/Playlist Push — good choices) misses them.
- **FAQ page for the offer itself** (what do I get, how fast, what formats, refunds) — the funnel answers none of this at point of payment.

## 4. Missing genre clusters (national intent, no local data needed)
Current genre set: hip-hop, rap/drill, R&B, afrobeats, latin, gospel, reggae, dancehall. Missing genres with real search demand and native fit for a record pool:
- **House/EDM/dance** — record pools are historically core to dance music; complete absence is conspicuous.
- **Amapiano** (rising, low competition), **Reggaeton** (only generic "latin" exists), **Country** (fast-growing indie scene), **Pop/Top-40 mixshow**.
Only add these with the same 700+ word standard as existing pages.

## 5. Lead magnets / email-capture assets (soft conversion)
Nothing on the site captures an email except the purchase-intent lead form on `/`. Missing:
- **PDF version of the Release Day Checklist** (interactive tool already exists at `tools/release-day-checklist` — gate the download).
- **"DJ-Ready Files" spec sheet** (clean/dirty/instrumental/tags) — matches `submit.html` requirements; artists search this.
- Email capture block on all 125 content pages (the `leads` API and table already exist; add a `source` field).

## 6. Linkable assets (needed before any backlink outreach)
- **The history page** (see #1) — pitchable to hip-hop media as "the record pool that survived 25 years of format changes".
- **Original data study**: "What N submissions taught us about what DJs actually play" — the hero chart on `/` implies this data exists ("100,000 songs uploaded, 0.001% meaningful impact"); publishing the methodology behind it creates the only citable statistic in the niche.
- **DJ interview series** (3–5 short interviews with named pool DJs) — cited by DJ blogs, links naturally to city pages.

## 7. Content clusters that exist but are incomplete
- `answers/` covers "what is a record pool" but not **"how to submit music to a record pool"**, **"record pool vs DSP editorial"**, **"do record pools cost money"** — adjacent queries with the same intent-owner.
- `journey/` (4 stages) has no stage for **"my song is on DSPs but nobody plays it live"** — the exact pain the product solves.

## 8. Freshness surface
Everything is dated 2026-07-08 and static. Missing: any recurring content type (monthly "records moving in the pool" roundup is the natural one — it's also proof and a reason for DJs/artists to return). One page/month is enough; the point is a heartbeat, not a blog.

## Explicitly NOT recommended now
- More city pages (60 exist without proof or rankings; adding more increases doorway risk — see TECHNICAL-SEO-AUDIT #4).
- Generic "music marketing tips" TOFU articles — the 37 existing guides/answers already cover this band; the gap is proof and BOFU, not more TOFU.
