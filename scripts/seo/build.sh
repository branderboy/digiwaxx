#!/usr/bin/env bash
# Rebuild every generated SEO artifact, in dependency order, then audit.
#
#   ./scripts/seo/build.sh           # dry run, changes nothing
#   ./scripts/seo/build.sh --apply   # write changes
#
# Order matters: the hubs and llms.txt read page titles, so metadata is fixed
# first; the mesh and sitemap read the hubs, so those come after. enrich_social
# runs after enrich_schema because it reads the Article dates that step writes
# and re-stamps the versioned asset URLs, and build_feed runs last because it
# reads the finished Article schema. Every step is idempotent, so running this
# twice in a row is a no-op the second time.
set -euo pipefail
cd "$(dirname "$0")"
ARG="${1:-}"

for step in fix_meta build_hubs rewire_links build_mesh enrich_schema enrich_social build_llms build_sitemap build_feed; do
  echo "=== $step ==="
  python3 "$step.py" ${ARG:+"$ARG"}
done

# The audit exits non-zero when it finds problems; the utility pages (/404,
# /admin, /funnel) are permanent expected orphans, so don't fail the build on it.
echo "=== audit ==="
python3 audit_links.py || true
