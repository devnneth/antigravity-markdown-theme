#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$EXTENSION_DIR"

VERSION="$(node -p "require('./package.json').version")"
VSIX_NAME="antigravity-markdown-theme-${VERSION}.vsix"

npm run check
npm test
npm exec -- vsce package --out "$VSIX_NAME"

printf 'Built: %s\n' "$EXTENSION_DIR/$VSIX_NAME"
