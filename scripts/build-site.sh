#!/usr/bin/env bash
# Assemble InterINNL hub + AquaChain into dist/site for Render.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npx nx run-many -t build -p interinnl,aquachain --configuration=production

SITE="$ROOT/dist/site"
rm -rf "$SITE"
mkdir -p "$SITE/aquachain"

cp -a "$ROOT/dist/apps/interinnl/browser/." "$SITE/"
cp -a "$ROOT/dist/apps/aquachain/browser/." "$SITE/aquachain/"

# Hub owns host-level SPA redirects (includes /aquachain/*).
if [[ -f "$ROOT/apps/interinnl/public/_redirects" ]]; then
  cp "$ROOT/apps/interinnl/public/_redirects" "$SITE/_redirects"
fi

# Render still publishes dist/apps/aquachain/browser; mirror the site there.
LEGACY="$ROOT/dist/apps/aquachain/browser"
rm -rf "$LEGACY"
mkdir -p "$LEGACY"
cp -a "$SITE/." "$LEGACY/"

echo "Site ready: $SITE (also mirrored to $LEGACY for Render publish path)"
