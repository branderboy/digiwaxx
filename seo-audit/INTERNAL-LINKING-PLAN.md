# Internal Linking Plan

## Current state (measured from the full link graph)

- **No orphaned indexable pages.** Every content page is reachable from `university.html` (hub) and the shared footer (which links all 9 cluster indexes and ~40 pages directly).
- **455 links to `/#pricing`** from content pages — the money path is well covered.
- **Weakly linked pages (in-degree = 1, footer/hub only):** `answers/does-radio-promotion-still-work`, `answers/how-long-does-music-promotion-take`, `answers/how-many-djs-receive-my-record`, `answers/will-promotion-increase-streams`, `promote/music-promotion-for-djs`, `-for-managers`, `-for-producers`, and most genre-city combos (`afrobeats-promotion-atlanta`, `drill-promotion-brooklyn`, `gospel-promotion-atlanta`, etc.). These receive no contextual (in-body) links from sibling pages.
- **Homepage links out to almost none of the content.** `index.html`'s footer links only `/submit`, `/university`, tel:, and tagglefish.com. The site's strongest page passes almost no internal authority to the clusters.

## Structural changes

| Change | Where | Why |
|---|---|---|
| Add a "Learn" footer block to the sales page with 6–8 links | `index.html` footer → `/university`, `/answers/what-is-a-record-pool`, `/compare/best-record-pools`, `/guides/how-to-promote-a-rap-song`, top 2 city pages, (future) `/results` | Homepage is the highest-authority URL; today it hoards it |
| Add trust links to every footer | all pages → About, Contact, Privacy, Terms (once created) | E-E-A-T + conversion |
| Breadcrumbs are schema-only | 125 pages have BreadcrumbList JSON-LD; visible breadcrumb exists in `.breadcrumb` — verify it links (it does: Home / section). Keep. | already OK |

## Contextual link additions (source → destination, suggested anchor)

City/genre mesh (fixes the in-degree-1 genre-city pages):
| Source | Destination | Anchor |
|---|---|---|
| `promotion/hip-hop-promotion-atlanta` | `promotion/rnb-promotion-atlanta`, `promotion/gospel-promotion-atlanta`, `promotion/afrobeats-promotion-atlanta` | "R&B promotion in Atlanta", etc. — a "Also in Atlanta" block |
| Each city page | its 2 nearest-market siblings (e.g. Atlanta ↔ Charlotte ↔ Nashville; NYC ↔ Brooklyn drill ↔ DMV) | "music promotion in {city}" |
| `promotion/hip-hop-promotion` (national) | all 12 hip-hop city pages | city-name anchors — currently the national page is the natural cluster head |

Answers/guides mesh (fixes in-degree-1 answers):
| Source | Destination | Anchor |
|---|---|---|
| `answers/how-record-pools-work` | `answers/how-many-djs-receive-my-record` | "how many DJs actually receive your record" |
| `guides/how-to-get-radio-play` | `answers/does-radio-promotion-still-work` | "whether radio promotion still works" |
| `guides/spotify-algorithm-tips` | `answers/will-promotion-increase-streams` | "will promotion increase your streams" |
| `answers/how-long-does-music-promotion-take` ← from | `campaigns/30-day-post-release-sprint`, `guides/song-rollout-timeline` | "how long promotion takes" |
| `promote/music-promotion-for-producers/-djs/-managers` ← from | `journey/*` pages and `university.html` audience row | role anchors ("if you're a producer…") |

Money-page reinforcement:
| Source | Destination | Anchor |
|---|---|---|
| All 4 `compare/*` pages | (future) `/results` case studies | "what campaigns actually produced" |
| `answers/how-much-does-music-promotion-cost` | (future) `/pricing` standalone | "Digiwaxx pricing" |
| `tools/*` (6 pages) | `submit.html` is noindexed — link tools to `/#pricing` instead; verified they already do via CTA box | keep |

## Anchor-text rules
Use the destination page's H1 phrase or a natural fragment of it; never "click here"; one contextual link per destination per page; keep 3–6 in-body links per 800-word page (current pages average near zero in-body links — the footer does all the work, which passes weaker topical signal than in-content links).

## Priority
1. Homepage footer "Learn" block (XS effort, highest-authority source on the site).
2. "Also in {city}" blocks across the 19 city sets (S–M, scriptable — the block is templatable even though anchor cities differ).
3. Answers/guides contextual mesh, ~25 links (S, manual but quick).
