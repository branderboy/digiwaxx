#!/usr/bin/env python3
"""Remove punctuation em/en dashes from public content.

Commit 712fbf8 did this once by hand over the built HTML, but the source
data files still hold their dashes, so every regeneration undid it. This is
that pass made repeatable: it runs first in build.sh, over the built pages,
so the convention survives `node scripts/content/generate.js`.

The three rules, matching what 712fbf8 actually did:

  numeric range   weeks 3-2, $99-$199   ->  weeks 3 to 2, $99 to $199
  spaced dash     a record - but it     ->  a record, but it
  tight dash      a record-but it       ->  a record, but it

Hyphens in words, URLs, slugs and code are untouched: only U+2014 and U+2013
are matched, never U+002D, and the &mdash;/&ndash; entities the templates
write are folded to the character first. admin.html is excluded, as before.

Usage: strip_dashes.py [--apply]
"""
import os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXCLUDE = {"admin.html"}
DASH = "[—–]"

# The templates write some dashes as entities, which look nothing like a dash
# to a regex. Fold them to the character first so one set of rules covers both.
ENTITY = re.compile(r"&(?:mdash|ndash|#8212|#8211|#x201[34]);", re.I)

RULES = [
    # A range between two figures reads as "to", not as a comma.
    (re.compile(r"(\d)\s*" + DASH + r"\s*(\$?\d)"), r"\1 to \2"),
    (re.compile(r"(\$\d[\d,.]*)\s*" + DASH + r"\s*(\$?\d)"), r"\1 to \2"),
    # A spaced dash is a clause break: it becomes a comma, and any comma or
    # colon already sitting in front of it wins so we never emit ", ,".
    (re.compile(r"\s*,\s*" + DASH + r"\s+"), ", "),
    (re.compile(r"\s*:\s*" + DASH + r"\s+"), ": "),
    (re.compile(r"\s+" + DASH + r"\s+"), ", "),
    # A tight dash between words is the same clause break, written closed up.
    (re.compile(r"(\w)" + DASH + r"(\w)"), r"\1, \2"),
    # Anything left over (leading, trailing, doubled) just goes.
    (re.compile(DASH), ""),
]


def convert(src):
    src = ENTITY.sub("—", src)
    for pattern, repl in RULES:
        src = pattern.sub(repl, src)
    # A dash directly after a closing quote or full stop leaves ".", which
    # reads as a typo; a colon is what that sentence wanted.
    src = src.replace('.”, ', '.”: ').replace('.", ', '.": ')
    return src


def main():
    apply = "--apply" in sys.argv
    changed = removed = 0
    for path in sorted(glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(path, ROOT)
        if rel in EXCLUDE:
            continue
        src = open(path, encoding="utf-8").read()
        n = len(re.findall(DASH, src)) + len(ENTITY.findall(src))
        new = convert(src)
        if new == src:
            continue
        removed += n - len(re.findall(DASH, new))
        changed += 1
        if apply:
            open(path, "w", encoding="utf-8").write(new)
    print(f"{'APPLIED' if apply else 'DRY RUN'}: {removed} dashes removed from {changed} pages")


if __name__ == "__main__":
    main()
