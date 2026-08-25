#!/usr/bin/env python3
"""Push URLs to search engines for (re)crawling.

Read this before expecting miracles: **there is no API that forces Google to
index a page.** Google retired the sitemap ping endpoint in January 2024, and
the Indexing API is officially limited to JobPosting and BroadcastEvent pages.
What actually moves URLs out of "Discovered - currently not indexed" is fixing
the crawl-priority signals (internal links, hub pages, real lastmod) and then
letting Google recrawl. This script handles the parts that *are* automatable:

  indexnow   Submit to IndexNow. Bing, Yandex, Seznam and Naver honour this and
             usually crawl within hours. Google does not participate.
  google     Submit to the Google Indexing API. Requires a service account with
             the Indexer role. Unsupported for article pages, so treat any
             success as a bonus rather than the plan.
  list       Print the URLs that need attention, ranked, for manual submission
             through Search Console's URL Inspection tool (~10-20/day quota).

Usage:
  submit_urls.py list [--stuck path/to/Table.csv]
  submit_urls.py indexnow [--limit N] [--dry-run]
  submit_urls.py google --credentials sa.json [--limit N] [--dry-run]
"""
import os, re, sys, csv, json, glob, signal, argparse, urllib.request, urllib.error

# Let `submit_urls.py list | head` exit quietly instead of raising BrokenPipeError.
signal.signal(signal.SIGPIPE, signal.SIG_DFL)

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = "https://promote.digiwaxx.com"
HOST = "promote.digiwaxx.com"
# Static key; the matching file must be served at {SITE}/{KEY}.txt containing this value.
KEY_FILE = os.path.join(ROOT, "indexnow-key.txt")


def sitemap_urls():
    urls = []
    for f in sorted(glob.glob(f"{ROOT}/sitemaps/*.xml")):
        urls += re.findall(r"<loc>(.*?)</loc>", open(f, encoding="utf-8").read())
    return sorted(set(urls))


def indexnow_key():
    """Return the IndexNow key, creating it and its public key file if needed.

    IndexNow verifies ownership by fetching {SITE}/{key}.txt and checking that
    it contains the key. Both files are written here so the served copy can
    never drift from the key we submit.
    """
    if not os.path.exists(KEY_FILE):
        open(KEY_FILE, "w").write(os.urandom(16).hex())
        print(f"generated new IndexNow key -> {KEY_FILE}")
    key = open(KEY_FILE).read().strip()
    public = os.path.join(ROOT, f"{key}.txt")
    if not os.path.exists(public):
        open(public, "w").write(key)
        print(f"wrote verification file -> {public}")
    return key


def cmd_list(args):
    """Rank URLs for manual Search Console submission, hubs first."""
    urls = sitemap_urls()
    stuck = set()
    if args.stuck and os.path.exists(args.stuck):
        with open(args.stuck) as f:
            for row in csv.DictReader(f):
                u = (row.get("URL") or "").strip()
                if u:
                    stuck.add(u.rstrip("/"))

    def rank(u):
        path = u.replace(SITE, "") or "/"
        depth = path.strip("/").count("/")
        # Hubs first: indexing a hub gives Google a fresh crawl path to its children.
        return (depth, 0 if u.rstrip("/") in stuck else 1, u)

    ordered = sorted(urls, key=rank)
    print(f"# {len(ordered)} URLs, hubs first. Submit the top ones via Search Console")
    print("# > URL Inspection > Request Indexing (quota is roughly 10-20/day).\n")
    for u in ordered:
        print(("STUCK  " if u.rstrip("/") in stuck else "       ") + u)


def post(url, payload):
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode()[:400]


def cmd_indexnow(args):
    key = indexnow_key()
    urls = sitemap_urls()[: args.limit] if args.limit else sitemap_urls()
    payload = {"host": HOST, "key": key,
               "keyLocation": f"{SITE}/{key}.txt", "urlList": urls}
    print(f"IndexNow: {len(urls)} urls, key {key[:8]}...")
    print(f"NOTE: {SITE}/{key}.txt must serve the key before this validates.")
    if args.dry_run:
        print("(dry run, nothing sent)")
        return
    try:
        status, body = post("https://api.indexnow.org/indexnow", payload)
        print(f"HTTP {status} {body}")
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()[:400]}")


def cmd_google(args):
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
    except ImportError:
        sys.exit("pip install google-auth first")
    creds = service_account.Credentials.from_service_account_file(
        args.credentials, scopes=["https://www.googleapis.com/auth/indexing"])
    session = AuthorizedSession(creds)
    urls = sitemap_urls()[: args.limit] if args.limit else sitemap_urls()
    print(f"Google Indexing API: {len(urls)} urls (daily quota is 200 by default)")
    ok = 0
    for u in urls:
        if args.dry_run:
            print(f"  would submit {u}")
            continue
        r = session.post("https://indexing.googleapis.com/v3/urlNotifications:publish",
                         json={"url": u, "type": "URL_UPDATED"})
        if r.status_code == 200:
            ok += 1
        else:
            print(f"  {r.status_code} {u}: {r.text[:160]}")
    if not args.dry_run:
        print(f"accepted: {ok}/{len(urls)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("list", help="rank URLs for manual Search Console submission")
    p.add_argument("--stuck", help="GSC coverage drilldown Table.csv to flag known-stuck URLs")
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("indexnow", help="submit to IndexNow (Bing/Yandex/Seznam/Naver)")
    p.add_argument("--limit", type=int)
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_indexnow)

    p = sub.add_parser("google", help="submit to the Google Indexing API")
    p.add_argument("--credentials", required=True)
    p.add_argument("--limit", type=int)
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_google)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
