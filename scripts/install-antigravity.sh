#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

"$SCRIPT_DIR/build.sh"

VERSION="$(node -p "require('$EXTENSION_DIR/package.json').version")"
VSIX_PATH="$EXTENSION_DIR/antigravity-markdown-theme-${VERSION}.vsix"

if [[ -n "${ANTIGRAVITY_CLI:-}" ]]; then
  CLI="$ANTIGRAVITY_CLI"
elif command -v antigravity-ide >/dev/null 2>&1; then
  CLI="$(command -v antigravity-ide)"
elif [[ -x "/Applications/Antigravity IDE.app/Contents/Resources/app/bin/antigravity-ide" ]]; then
  CLI="/Applications/Antigravity IDE.app/Contents/Resources/app/bin/antigravity-ide"
else
  printf 'Antigravity IDE CLI를 찾을 수 없습니다. ANTIGRAVITY_CLI 환경 변수를 지정하세요.\n' >&2
  exit 1
fi

"$CLI" --install-extension "$VSIX_PATH" --force
printf 'Installed for Antigravity IDE: %s\n' "$VSIX_PATH"
