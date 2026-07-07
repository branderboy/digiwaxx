// Shared config + HTML renderer for the Digiwaxx programmatic content engine.
// Every content page on the site is generated from data files in ./data
// by running:  node scripts/content/generate.js

// Update this when the production domain changes — canonicals & sitemap use it.
const SITE_URL = 'https://digiwaxx.com';

const BRAND = {
  name: 'Digiwaxx',
  djCount: '30,000+',
  since: '1998',
  pricingUrl: '/#pricing',
  tiers: [
    { name: 'Starter', price: 99 },
    { name: 'Pro', price: 149 },
    { name: 'Elite', price: 199 },
  ],
};

const CATEGORIES = {
  guides: { dir: 'guides', label: 'Guides', hubTitle: 'Release & Promotion Guides' },
  goals: { dir: 'goals', label: 'Artist Goals', hubTitle: 'Artist Goals' },
  answers: { dir: 'answers', label: 'Answers', hubTitle: 'Straight Answers' },
  promotion: { dir: 'promotion', label: 'Promotion', hubTitle: 'Promotion Hubs' },
  journey: { dir: 'journey', label: 'Artist Journey', hubTitle: 'The Artist Journey' },
  tools: { dir: 'tools', label: 'Tools', hubTitle: 'Free Artist Tools' },
  stories: { dir: 'stories', label: 'Success Stories', hubTitle: 'Success Stories' },
};

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const stripTags = (s) => String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function pageUrl(page) {
  return `/${CATEGORIES[page.category].dir}/${page.slug}`;
}

function jsonLd(page, faq) {
  const url = SITE_URL + pageUrl(page);
  const blocks = [];
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url,
    author: { '@type': 'Organization', name: 'Digiwaxx', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Digiwaxx', url: SITE_URL },
  });
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Digiwaxx', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'University', item: SITE_URL + '/university' },
      { '@type': 'ListItem', position: 3, name: CATEGORIES[page.category].label, item: SITE_URL + '/university#' + page.category },
      { '@type': 'ListItem', position: 4, name: page.title, item: url },
    ],
  });
  if (faq && faq.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: stripTags(f.q),
        acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
      })),
    });
  }
  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join('\n');
}

function nav() {
  return `
<nav class="cnav">
  <div class="cnav-inner">
    <a class="cnav-logo" href="/">DIGI<span>WAXX</span></a>
    <div class="cnav-links">
      <a href="/university">University</a>
      <a href="/university#guides">Guides</a>
      <a href="/university#answers">Answers</a>
      <a href="/university#promotion">Cities &amp; Platforms</a>
      <a href="/university#tools">Tools</a>
    </div>
    <a class="cnav-cta" href="${BRAND.pricingUrl}">Submit Your Record &rarr;</a>
  </div>
</nav>`;
}

// Footer organized by category — curated: top links per category plus a
// "View all" into the University hub, which is the full directory.
const FOOTER_LINK_LIMIT = 5;
function footer(allPages) {
  const order = ['guides', 'goals', 'answers', 'promotion', 'journey', 'tools', 'stories'];
  const cols = order.map((cat) => {
    const pages = (allPages || []).filter((p) => p.category === cat);
    if (!pages.length) return '';
    const featured = pages.filter((p) => p.featured);
    const rest = pages.filter((p) => !p.featured);
    const shown = featured.concat(rest).slice(0, FOOTER_LINK_LIMIT);
    const links = shown.map((p) => `        <a href="${pageUrl(p)}">${esc(p.navLabel || p.title)}</a>`).join('\n');
    const viewAll = pages.length > shown.length
      ? `\n        <a class="cfooter-more" href="/university#${cat}">View all ${pages.length} &rarr;</a>` : '';
    return `      <div class="cfooter-col"><h4><a href="/university#${cat}">${esc(CATEGORIES[cat].hubTitle)}</a></h4>\n${links}${viewAll}</div>`;
  }).filter(Boolean).join('\n');
  return `
<footer class="cfooter">
  <div class="cfooter-inner">
    <div class="cfooter-brand">DIGI<span>WAXX</span><p>Trusted by ${BRAND.djCount} DJs since ${BRAND.since}.</p>
      <a class="cfooter-cta" href="${BRAND.pricingUrl}">Submit Your Record &rarr;</a>
      <a class="cfooter-hub" href="/university">Browse Digiwaxx University &rarr;</a>
    </div>
    <div class="cfooter-cols">
${cols}
    </div>
  </div>
  <p class="cfooter-copy">&copy; ${new Date().getFullYear()} Digiwaxx Media. All rights reserved.</p>
</footer>`;
}

// The "funnel strip" — Layer 9 internal linking: every page points upward.
function funnelStrip() {
  return `
<div class="funnel-strip">
  <span>Question</span><i>&rarr;</i><span>Guide</span><i>&rarr;</i>
  <a href="/university">University</a><i>&rarr;</i>
  <a href="${BRAND.pricingUrl}">Pricing</a><i>&rarr;</i>
  <a href="${BRAND.pricingUrl}"><b>Submit Your Record</b></a>
</div>`;
}

function ctaBlock(cta) {
  const c = Object.assign({
    kicker: 'Ready?',
    headline: 'Submit your record to Digiwaxx.',
    sub: `Your music in front of ${BRAND.djCount} club, radio and mixshow DJs — the network that has been breaking records since ${BRAND.since}.`,
    button: 'Promote My Record',
  }, cta || {});
  return `
<section class="cta-block">
  <p class="cta-kicker">${esc(c.kicker)}</p>
  <h2>${esc(c.headline)}</h2>
  <p class="cta-sub">${esc(c.sub)}</p>
  <a class="cta-btn" href="${BRAND.pricingUrl}">${esc(c.button)} &rarr;</a>
  <p class="cta-tiers">Starter $99 &middot; Pro $149 &middot; Elite $199 &mdash; one-time payment, no contracts.</p>
</section>`;
}

function statsBlock(stats) {
  const items = stats || [
    { n: BRAND.djCount, l: 'DJs in the Digiwaxx network' },
    { n: BRAND.since, l: 'Serving records to DJs since' },
    { n: '~100K', l: 'Tracks uploaded to streaming daily — you need more than an upload' },
  ];
  return `
<div class="stats-row">
${items.map((s) => `  <div class="stat"><div class="stat-n">${esc(s.n)}</div><div class="stat-l">${esc(s.l)}</div></div>`).join('\n')}
</div>`;
}

function faqBlock(faq) {
  if (!faq || !faq.length) return '';
  return `
<section class="faq">
  <h2>Frequently Asked Questions</h2>
${faq.map((f) => `  <details><summary>${esc(stripTags(f.q))}</summary><div class="faq-a"><p>${f.a}</p></div></details>`).join('\n')}
</section>`;
}

function relatedBlock(page, allBySlug) {
  const rel = (page.related || []).map((slug) => allBySlug[slug]).filter(Boolean);
  if (!rel.length) return '';
  return `
<section class="related">
  <h2>Keep Going</h2>
  <div class="related-grid">
${rel.map((r) => `    <a class="related-card" href="${pageUrl(r)}"><span class="related-cat">${esc(CATEGORIES[r.category].label)}</span><span class="related-t">${esc(r.title)}</span></a>`).join('\n')}
  </div>
</section>`;
}

// Full page renderer. `page` fields:
// slug, category, title, metaTitle?, description, question?, quickAnswer?,
// longAnswer?, sections[{h2, html}], stats?, faq[{q,a}], related[slugs],
// cta?, bodyHtml? (replaces answer+sections for custom pages e.g. tools),
// headScript? (extra <head> content for tools)
function renderPage(page, allBySlug) {
  const url = SITE_URL + pageUrl(page);
  const answer = page.quickAnswer ? `
<div class="quick-answer">
  <p class="qa-label">Quick Answer</p>
  <p class="qa-text">${page.quickAnswer}</p>
</div>
${page.longAnswer ? `<p class="long-answer">${page.longAnswer}</p>` : ''}` : '';

  const sections = (page.sections || []).map((s) => `
<section class="body-section">
  <h2>${esc(s.h2)}</h2>
${s.html}
</section>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(page.metaTitle || page.title + ' | Digiwaxx')}</title>
    <meta name="description" content="${esc(page.description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${esc(page.metaTitle || page.title)}">
    <meta property="og:description" content="${esc(page.description)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/content.css">
${jsonLd(page, page.faq)}
${page.headScript || ''}
</head>
<body>
${nav()}
<main class="cmain">
  <div class="breadcrumb">
    <a href="/">Home</a> / <a href="/university">University</a> / <a href="/university#${page.category}">${esc(CATEGORIES[page.category].label)}</a>
  </div>
  <article>
    <h1>${esc(page.title)}</h1>
    ${page.question ? `<p class="page-question">${esc(page.question)}</p>` : ''}
${answer}
${page.bodyHtml || ''}
${sections}
${statsBlock(page.stats)}
${faqBlock(page.faq)}
${relatedBlock(page, allBySlug)}
${ctaBlock(page.cta)}
${funnelStrip()}
  </article>
</main>
${footer(allBySlug.__all || [])}
</body>
</html>
`;
}

module.exports = { SITE_URL, BRAND, CATEGORIES, esc, stripTags, pageUrl, renderPage, nav, footer, ctaBlock, statsBlock, funnelStrip };
