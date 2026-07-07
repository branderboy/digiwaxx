#!/usr/bin/env node
// Digiwaxx programmatic content generator.
//   node scripts/content/generate.js
// Renders every page defined in ./data into the repo root (static hosting),
// plus the /university hub, sitemap.xml, and robots.txt.
const fs = require('fs');
const path = require('path');
const { SITE_URL, CATEGORIES, esc, pageUrl, renderPage, nav, footer } = require('./lib');

const ROOT = path.resolve(__dirname, '..', '..');

const pages = [
  ...require('./data/campaigns'),
  ...require('./data/guides-before'),
  ...require('./data/guides-after'),
  ...require('./data/goals'),
  ...require('./data/answers'),
  ...require('./data/platforms'),
  ...require('./data/cities').pages,
  ...require('./data/combos'),
  ...require('./data/journey'),
  ...require('./data/tools'),
  ...require('./data/stories'),
];

// Validate slugs are unique and related links resolve.
const bySlug = {};
for (const p of pages) {
  if (bySlug[p.slug]) throw new Error(`Duplicate slug: ${p.slug}`);
  bySlug[p.slug] = p;
}
bySlug.__all = pages;
let brokenLinks = 0;
for (const p of pages) {
  for (const r of p.related || []) {
    if (!bySlug[r]) { console.warn(`warn: ${p.slug} -> unknown related slug "${r}"`); brokenLinks++; }
  }
}

// Render all pages.
let count = 0;
for (const p of pages) {
  const dir = path.join(ROOT, CATEGORIES[p.category].dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${p.slug}.html`), renderPage(p, bySlug));
  count++;
}

// ---- University hub (Layer 10 authority cluster index) ----
const catOrder = ['campaigns', 'guides', 'goals', 'answers', 'promotion', 'journey', 'tools', 'stories'];
const catDescriptions = {
  campaigns: 'Complete sample campaigns you can launch as-is — dated, step-by-step, from Day 1 to done.',
  guides: 'Step-by-step playbooks for every stage of a release — before the drop and after it.',
  goals: 'Start from what you want — fans, bookings, club plays, spins — and work backward.',
  answers: 'One page, one question, answered straight: DJs, record pools, playlists, radio.',
  promotion: 'Platform hubs and city-by-city breakdowns of how records actually break.',
  journey: 'Organized by what you’re thinking right now — from "I made a song" to "I’m getting traction."',
  tools: 'Free interactive tools: checklists and calculators that end with a plan.',
  stories: 'Real campaigns, real spins, real outcomes from the Digiwaxx network.',
};
const hubSections = catOrder.map((cat) => {
  const catPages = pages.filter((p) => p.category === cat);
  if (!catPages.length) return '';
  return `
<section class="hub-cat" id="${cat}">
  <h2>${esc(CATEGORIES[cat].hubTitle)}</h2>
  <p class="hub-cat-desc">${esc(catDescriptions[cat])}</p>
  <div class="hub-grid">
${catPages.map((p) => `    <a class="related-card" href="${pageUrl(p)}"><span class="related-cat">${esc(CATEGORIES[cat].label)}</span><span class="related-t">${esc(p.title)}</span></a>`).join('\n')}
  </div>
</section>`;
}).join('\n');

const hubHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digiwaxx University | Music Promotion Guides, Answers & Tools</title>
    <meta name="description" content="Digiwaxx University: ${count} free guides, answers, city breakdowns, and tools on DJ promotion, radio, playlists, and breaking records as an independent artist.">
    <link rel="canonical" href="${SITE_URL}/university">
    <meta property="og:title" content="Digiwaxx University">
    <meta property="og:description" content="Free guides, answers, and tools on DJ promotion, radio, playlists, and breaking records.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/university">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/content.css">
</head>
<body>
${nav()}
<main class="hub-main">
  <div class="hub-hero">
    <h1>Digiwaxx <span style="color:var(--accent-yellow)">University</span></h1>
    <p class="hub-sub">Everything we know about breaking records — from the network that has served DJs since 1998. ${count} free guides, answers, city playbooks, and tools. No fluff, no gatekeeping.</p>
  </div>
${hubSections}
</main>
${footer(pages)}
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'university.html'), hubHtml);

// ---- sitemap.xml & robots.txt ----
const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  { loc: `${SITE_URL}/university`, priority: '0.9' },
  ...pages.map((p) => ({ loc: SITE_URL + pageUrl(p), priority: p.category === 'tools' ? '0.8' : '0.7' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /admin
Disallow: /submit

Sitemap: ${SITE_URL}/sitemap.xml
`);

console.log(`Generated ${count} content pages + university hub + sitemap (${urls.length} URLs) + robots.txt`);
if (brokenLinks) console.warn(`${brokenLinks} broken related link(s) — see warnings above`);
