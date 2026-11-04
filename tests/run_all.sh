#!/usr/bin/env bash
# Regression suite: routes, navigation, films, legacy links, accessibility (desktop + phone), reduced motion.
# Needs: python3 -m pip install playwright  &&  (cd tests && npm install)
set -u
cd "$(dirname "$0")"
ROOT="$(cd .. && pwd)"
python3 "$ROOT/scripts/build.py" --check || { echo "Run python3 scripts/build.py first."; exit 1; }
if ! curl -s -o /dev/null http://127.0.0.1:8765/; then
  (python3 -m http.server 8765 --directory "$ROOT/public" >/dev/null 2>&1 &) ; sleep 1.5
fi
for t in routes_test nav_test film2_test link_test wix_urls_test seo_test launch_check reduced_motion_test; do echo "== $t"; python3 "$t.py" 2>&1 | tail -12; done
echo "== axe_audit (desktop)"; python3 axe_audit.py d
echo "== axe_audit (phone)"; python3 axe_audit.py m
echo "(axe prints nothing when there are no violations)"
