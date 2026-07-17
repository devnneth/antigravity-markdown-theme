#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

"$SCRIPT_DIR/build.sh"

VERSION="$(node -p "require('$EXTENSION_DIR/package.json').version")"
VSIX_PATH="$EXTENSION_DIR/antigravity-markdown-theme-${VERSION}.vsix"

if [[ -n "${VSCODE_CLI:-}" ]]; then
  CLI="$VSCODE_CLI"
elif command -v code >/dev/null 2>&1; then
  CLI="$(command -v code)"
elif [[ -x "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" ]]; then
  CLI="/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
else
  printf 'VS Code CLI를 찾을 수 없습니다. VSCODE_CLI 환경 변수를 지정하세요.\n' >&2
  exit 1
fi

"$CLI" --install-extension "$VSIX_PATH" --force
printf 'Installed for VS Code: %s\n' "$VSIX_PATH"
