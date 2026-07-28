#!/usr/bin/env python3
"""Bring the generated content pages back in line with the homepage brand.

The content pages had drifted from index.html in three ways:

1. A made-up text logo, "DIGI<span>WAXX</span>", instead of the real Digiwaxx
   mark. Replaced with assets/logo.png (the real logo with its baked-in black
   plate keyed out, so it sits flush on dark backgrounds).
2. Yellow used as the accent for everything: links, borders, headings, stat
   numbers, FAQ markers, footer links. On the homepage yellow is reserved for
   the single primary CTA; the accent colour is the dusty pink #d4a0a0
   (--dot-purple on index.html, already present here as --pink).
3. Grey footer link text. Now white.

Yellow is kept exactly where the homepage keeps it: the primary CTA buttons.

Usage: rebrand.py [--apply]
"""
import os, re, sys, glob
from lib import ROOT

LOGO_IMG = ('<img src="/assets/logo.png" alt="Digiwaxx" '
            'width="150" height="25" decoding="async">')
FOOTER_LOGO = ('<img src="/assets/logo.png" alt="Digiwaxx" '
               'width="180" height="30" decoding="async">')

# (description, pattern, replacement) applied to assets/content.css.
CSS_EDITS = [
    ("accent tokens: pink accent, yellow demoted to CTA-only",
     r"    --accent-yellow: #FFB800;\n    --accent-yellow-hover: #FFD54F;",
     "    /* Yellow is the primary-CTA colour only, matching index.html.\n"
     "       The general accent is the brand pink (--dot-purple on the homepage). */\n"
     "    --cta-yellow: #FFB800;\n"
     "    --cta-yellow-hover: #FFD54F;\n"
     "    --accent: #d4a0a0;\n"
     "    --accent-hover: #e8c4c4;"),
    ("body links use the pink accent, not yellow",
     r"a \{ color: var\(--accent-yellow\); text-decoration: none; \}\n"
     r"a:hover \{ color: var\(--accent-yellow-hover\); \}",
     "a { color: var(--accent); text-decoration: none; }\n"
     "a:hover { color: var(--accent-hover); }"),
    ("nav links white",
     r"\.cnav-links a \{ color: var\(--text-muted\);",
     ".cnav-links a { color: var(--text-white);"),
    ("footer column links white, per brand direction",
     r"\.cfooter-col a \{ display: block; color: var\(--text-muted\);",
     ".cfooter-col a { display: block; color: var(--text-white);"),
    ("footer 'view all' links white-bold rather than yellow",
     r"\.cfooter-col \.cfooter-more \{ color: var\(--accent-yellow\);",
     ".cfooter-col .cfooter-more { color: var(--accent);"),
    ("footer tagline lifted out of low-contrast grey",
     r"(\.cfooter-brand p \{[^}]*?)color: var\(--text-muted\);",
     r"\1color: var(--text-body);"),
    ("footer logo replaces the made-up wordmark span",
     r"\.cfooter-brand span \{ color: var\(--accent-yellow\); \}",
     ".cfooter-brand img { display: block; height: auto; max-width: 180px; margin-bottom: 0.2rem; }"),
    ("nav logo image sizing",
     r"\.cnav-logo \{[^}]*\}",
     ".cnav-logo { display: flex; align-items: center; }\n"
     ".cnav-logo img { display: block; height: 25px; width: auto; }"),
    ("nav logo span rule no longer needed",
     r"\.cnav-logo span \{ color: var\(--accent-yellow\); \}\n", ""),
]

# Remaining var renames. Primary CTAs keep yellow; everything else takes --accent.
CTA_CONTEXTS = (".cnav-cta", ".cta-btn")


def edit_css(apply):
    path = f"{ROOT}/assets/content.css"
    s = orig = open(path, encoding="utf-8").read()
    applied = []
    for desc, pat, rep in CSS_EDITS:
        new = re.sub(pat, rep, s, count=1)
        if new != s:
            applied.append(desc)
            s = new
        else:
            print(f"  !! no match: {desc}")

    # Line-by-line: CTA rules keep yellow, all other yellow becomes the accent.
    out = []
    for line in s.split("\n"):
        if "accent-yellow" in line:
            if any(c in line for c in CTA_CONTEXTS) or "#FFE066" in line:
                line = (line.replace("var(--accent-yellow-hover)", "var(--cta-yellow-hover)")
                            .replace("var(--accent-yellow)", "var(--cta-yellow)"))
            else:
                line = (line.replace("var(--accent-yellow-hover)", "var(--accent-hover)")
                            .replace("var(--accent-yellow)", "var(--accent)"))
        out.append(line)
    s = "\n".join(out)
    s = s.replace("#FFD54F", "var(--cta-yellow-hover)")

    if apply and s != orig:
        open(path, "w", encoding="utf-8").write(s)
    left = len(re.findall(r"accent-yellow", s))
    print(f"  content.css: {len(applied)} edits, {left} stale --accent-yellow refs left")
    return s


def edit_pages(apply):
    """Swap the made-up text wordmark for the real logo in nav and footer."""
    # Excluded by full path, not basename: the root landing/utility pages carry
    # their own inline styles and markup, while section hubs (promotion/index.html
    # and friends) share the content.css chrome and must be included.
    skip = {f"{ROOT}/{n}.html" for n in ("index", "funnel", "submit", "admin")}
    files = [f for f in sorted(glob.glob(f"{ROOT}/*.html")) + sorted(glob.glob(f"{ROOT}/*/*.html"))
             if "/api/" not in f and f not in skip]
    n = 0
    for f in files:
        s = orig = open(f, encoding="utf-8").read()
        s = s.replace('<a class="cnav-logo" href="/">DIGI<span>WAXX</span></a>',
                      f'<a class="cnav-logo" href="/" aria-label="Digiwaxx home">{LOGO_IMG}</a>')
        s = s.replace('<div class="cfooter-brand">DIGI<span>WAXX</span><p>',
                      f'<div class="cfooter-brand">{FOOTER_LOGO}<p>')
        if s != orig:
            n += 1
            if apply:
                open(f, "w", encoding="utf-8").write(s)
    print(f"  logo swapped on {n} pages")
    return n


def main():
    apply = "--apply" in sys.argv
    print("rebranding content pages to match index.html:")
    edit_css(apply)
    edit_pages(apply)
    print(f"\n{'APPLIED' if apply else 'DRY RUN'}")


if __name__ == "__main__":
    main()
