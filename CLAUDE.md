# Digiwaxx repo rules

## Modern Web Guidance is mandatory

Kawani's rule (2026-11-15): Modern Web Guidance, the Google Chrome team's
skill pack, is used on every website and app build in this repo. No
exceptions.

The skill is installed in the repo at `.agents/skills/modern-web-guidance`,
linked for Claude Code at `.claude/skills/modern-web-guidance`, and pinned in
`skills-lock.json`. Source: https://github.com/GoogleChrome/modern-web-guidance

### What counts as a website or app build

Any change to HTML, CSS or client-side JavaScript: the sales page
(`index.html`), every content page, the admin (`admin.html`), `/submit`,
`/contact`, the tools, the page templates and generators in `scripts/`, and
any new page or app. Copy-only edits inside existing markup count too when
they touch the markup around the words.

Backend-only work (`api/`), SEO data scripts that only change text, CI
workflows and git chores are outside it, as the skill itself says.

### The steps, every time

1. **Before writing code**, search the guidance for each web feature the task
   touches, then retrieve the matching guides and follow them:

   ```bash
   npx -y modern-web-guidance@latest search "<2-5 word feature query>"
   ```

   ```bash
   npx -y modern-web-guidance@latest retrieve "<guide-id>"
   ```

2. **Before committing**, check the changed code against the retrieved
   guides, as the skill's Step 3 describes.
3. **When delivering**, end the reply with the `### Modern Web Guidance`
   section the skill asks for, naming the guides used.
4. **For a full audit or modernization pass**, run the legacy scan on the
   whole repo and report what it finds. It covers only the ~20% of guides
   that have deterministic rules, so say so in the report.

   ```bash
   npx -y modern-web-guidance@latest legacy-scan . --json
   ```

### Keeping it current

Update the installed skill with:

```bash
npx -y modern-web-guidance@latest install
```

Commit the refreshed `.agents/skills/modern-web-guidance`,
`.claude/skills/modern-web-guidance` and `skills-lock.json` together.

The tool sends Google anonymous usage data unless `DISABLE_TELEMETRY=1` is
set in the shell.
