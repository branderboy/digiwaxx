# Conversion & Lead Generation Audit

Basis: full interactive browser testing of every funnel path, the lead form (success/failure/empty states), and mobile rendering, performed in this session; plus code reading of `index.html`, `submit.html`, `api/[...path].js`, `admin.html`.

## What works (verified by test, not assumption)

- Lead form (`#leadForm`): 4 required fields, HTML5 validation blocks empty submits, success modal on 200, error toast on failure, network-error toast on fetch failure. POSTs to `/api/leads` → Postgres. ✅
- Funnel math correct on all paths (Starter $99 → upsell +$50 → add-ons $25–45 → guest post $25 → totals verified to $264; Elite $199; downsell $75; session $50). ✅
- `paypal-click` tracking fires with `keepalive: true` before redirect. ✅
- Mobile: sales page renders correctly 320–390px; content-page nav overflow fixed this session. ✅
- Prices/copy editable from `admin.html` with hardcoded fallbacks. ✅

## Problems, by severity

### 1. Payment is a bare PayPal.me link (highest-impact conversion problem)
`index.html:2858`: `window.location.href = 'https://paypal.me/' + paypalUsername + '/' + total`.
- The buyer lands on a page that says "pay $264 to digiwaxx" with **no order summary, no item list, no receipt of what was bought**.
- Nothing stops them paying a different amount, or abandoning silently — and there is no way to know (see #2).
- No post-payment onboarding: the buyer is never told to go to `/submit` to deliver files. `submit.html` (the file-delivery form, 12 fields, working) is only reachable from the sales-page footer. A paying customer has to find it on their own.
**Fix:** PayPal Checkout buttons or hosted checkout with line items and a return URL to a `/thank-you` page that (a) records the purchase via the existing `/api/purchases` route, (b) sends the buyer straight into `/submit`, (c) fires the conversion event. The API already has `purchases` and a PATCH status route — the backend is ready; only the front half is missing.

### 2. Purchases can never be attributed
`checkPurchaseReturn()` (`index.html:2884`) waits for `?purchase=success&tier=...`. PayPal.me never redirects back with parameters, so this code cannot execute from a real payment. Consequence: the `purchases` table only fills if an admin marks it manually; conversion rate per page/source/tier is unknowable. Same fix as #1.

### 3. No soft conversion anywhere (biggest lead-volume problem)
125 content pages have exactly one CTA type: "Submit Your Record →" → `/#pricing` (a $99+ decision). No email capture, no lead magnet, no "get the checklist" — a reader of `guides/music-promotion-for-beginners` (definitionally not ready to buy) has no smaller yes. The `leads` API exists; an email-capture variant with a `source` field is a small addition. Expected effect: first recurring lead flow from existing traffic.

### 4. Trust gaps at the point of payment
On `/` between the pricing cards and payment there is: no testimonial with a name, no artist logos, no guarantee/refund line, no "what happens next" sequence, no support contact. The trust section says "TRUSTED BY 30,000+ DJs" (a claim about DJs, not about buyers). The funnel summary pane shows only order lines and a PayPal button. Minimum viable fix: one line under the pay button — "You'll get a confirmation email and your campaign starts within X business days. Questions? support@… / 1-800-665-1259" — plus refund terms link. (Note: **no email address exists anywhere on the public site**; the phone appears once.)

### 5. `submit.html` flow is disconnected
- Not linked from the success modal after a lead is captured, nor from any funnel pane, nor from a thank-you page (which doesn't exist).
- 12 fields with no save-progress; acceptable for post-purchase, but only if buyers are actually routed to it.

### 6. Journey/goals/tools pages ask for the sale too early
`journey/i-made-a-song` (a pre-release visitor) CTAs straight to `/#pricing`. These pages are where the checklist/spec-sheet lead magnets belong instead.

## Per-page conversion assessment (major pages)

| Page | Visitor's expected action | Obvious? | Enough trust? | Change most likely to lift conversion |
|---|---|---|---|---|
| `/` (sales) | Fill lead form or buy | Yes — CTA above fold, form present, pricing clear | Partly — claims strong, proof absent | Named testimonials + case-study links beside pricing; support contact + refund line in funnel summary |
| `/#pricing` funnel | Complete PayPal payment | Yes | **No** — bare PayPal.me handoff | Real checkout w/ line items + thank-you → `/submit` |
| `compare/*` (4) | Choose Digiwaxx over alternative | Yes | Partly — arguments made, outcomes unproven | Link case studies; add "switch" CTA ("ran a SubmitHub campaign? here's what a pool adds") |
| `promotion/*` city (60) | Buy or inquire from a city | Yes | Weak — zero local proof on any city page | One local proof element per major city (local case study quote, venue/mixshow names) |
| `guides/`, `answers/` (37) | Read → ? | CTA exists but wrong altitude ($99 ask on TOFU reads) | n/a | Email-capture lead magnet block mid-article |
| `tools/*` (6) | Use tool → ? | Tool works; no capture | n/a | Gate results export/PDF behind email (keep tool itself free) |
| `submit.html` | Deliver files post-purchase | Only if found | Yes (buyer already) | Route buyers to it from thank-you page |

## Recommended lead funnel (target state)

1. TOFU (guides/answers/journey/tools): email capture via checklist/spec-sheet → `leads` table with `source` → automated email sequence (3–4 messages: proof, how it works, case study, offer).
2. MOFU (city/genre/compare/goals): same capture + "see results" case-study links + `/#pricing` CTA.
3. BOFU (`/` + funnel): lead form (exists) → checkout with real order + return URL → `/thank-you` → `/submit` onboarding → post-purchase email.
4. Measurement joins each step (see MEASUREMENT-PLAN.md).

## Mobile conversion notes
- Funnel overlay tested and usable at 390px; buy buttons ≥44px touch targets. ✅
- The sticky/pulse "featured" Pro button animation is fine for users (it broke only automated clicking).
- No sticky mobile CTA bar on long content pages — consider one ("Get the checklist" on TOFU, "Pricing" on MOFU) after soft conversion exists.
