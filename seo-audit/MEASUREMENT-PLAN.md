# Measurement Plan

## What tracking exists today (from code)

| Item | Evidence | Status |
|---|---|---|
| First-party pageview logging | `index.html` POSTs `/api/pageview` → `page_views` table (page, referrer, UA, IP) | Works, **sales page only** — none of the 125 content pages call it |
| GA4 | Loaded dynamically **only if** `ga_measurement_id` exists in `site_content` DB table (`index.html:2615`) | Unknown if configured; content pages have no loader at all |
| Meta Pixel | Same pattern (`fb_pixel_id`), fires PageView, ViewContent (pricing in-view, correctly guarded by `_fbPixelLoaded`), Lead, InitiateCheckout | Same caveat; sales page only |
| PayPal click | `/api/paypal-click` with tier/price/lead_id, `keepalive` | Works (verified in browser test) |
| Leads | `/api/leads` → `leads` table | Works (verified) |
| Purchases | `/api/purchases` exists but front-end trigger depends on `?purchase=success` which PayPal.me never sends | **Structurally dead** |
| GSC / Bing | No verification token anywhere in repo | Unknown/likely missing |
| GTM, Clarity, call tracking, consent mode | Absent | n/a (consent: US-only audience assumed; revisit if EU traffic matters) |
| ManyChat | Conditional widget loader (`manychat_widget_id`) | Unknown if configured |

**The core blindness:** even with GA4 configured in the admin DB, 125 of 127 indexable pages emit nothing, and revenue events cannot fire. You could get traffic tomorrow and be unable to see it.

## Recommended GA4 event map

| Event name | Trigger | Conversion? | Parameters | Where | Business question |
|---|---|---|---|---|---|
| `page_view` | GA4 default, all pages | No | default | static snippet in all templates | Is content earning traffic? |
| `lead_form_submit` | `#leadForm` success (200 from `/api/leads`) | **Yes** | `selected_tier` | `index.html` | Are visitors raising hands? |
| `email_capture` | future lead-magnet form success | **Yes** | `source_page`, `magnet` | content template | Is TOFU producing leads? |
| `funnel_open` | `openFunnel()` | No | `tier` | `index.html` | Pricing→funnel rate |
| `funnel_upsell_accept` / `_decline` | upsell buttons | No | `from_tier` | `index.html` | Upsell take-rate |
| `begin_checkout` | `fnlCheckout()` (replaces bare paypal-click as GA event; keep the DB POST too) | **Yes (proxy until #purchase works)** | `value`, `items` | `index.html` | Checkout intent by page/source |
| `purchase` | `/thank-you` page (after real checkout return) | **Yes** | `value`, `transaction_id`, `tier` | new page | Actual revenue by source/page |
| `submit_files_complete` | `submit.html` form success | Yes (ops) | - | `submit.html` | Do buyers complete onboarding? |
| `tool_complete` | tool result generated | No | `tool_name` | `tools/*` | Which tools deserve investment? |
| `outbound_paypal` | temporary: paypal.me navigation | No | `value` | until checkout fix ships | Bridge metric |

Naming: snake_case, no spaces, keep this exact list — the current code's mixed vocabulary (`ViewContent` FB / `pageview` custom) stays but GA4 names follow this table. A lead = `lead_form_submit` or `email_capture` only; button clicks are never counted as leads.

## Setup requirements by source

- **Search Console**: verify (DNS preferred; or give me the HTML token to commit), submit `sitemap.xml`, then: coverage report weekly, queries report monthly feeds the 61–90-day content iteration.
- **Bing WMT**: import from GSC (one click) — Bing/Copilot surfaces matter for this niche's older DJ demographic.
- **GA4**: create property → either put the ID in admin `site_content` **and** extend the loader to content pages, or (simpler, recommended) static gtag snippet in all pages.
- **CRM/leads**: the Postgres `leads` table is the CRM for now. Add `source_page` column (API change, 1 line) so leads carry attribution; admin panel already lists leads.
- **Call tracking**: the 800 number appears once; if calls matter, a tracked number (CallRail-class) per channel later — not now.

## Dashboard spec (minimum viable, weekly review)

1. GSC: impressions, clicks, top queries, top pages (trend vs prior 28 days).
2. GA4: sessions by landing page cluster (`/guides`, `/answers`, `/promotion`, `/`), `lead_form_submit` + `email_capture` count, `begin_checkout` count, conversion rate per cluster.
3. DB (admin stats endpoint already computes some of this): leads this week, paypal clicks this week, purchases recorded.
4. One derived number: **cost of silence** = paypal_clicks − purchases recorded (until checkout fix ships this is your attribution gap, and it should trend to ~0 after).

## What cannot be claimed from the repo
- Whether the site has any current traffic, impressions, or rankings (needs GSC/GA4).
- Whether GA/pixel IDs are configured in the production DB (needs admin panel or DB access).
- Whether the domain redirects apex→www correctly (needs live DNS/Vercel check).
- Actual Core Web Vitals in the field (needs PageSpeed Insights/CrUX once traffic exists).
