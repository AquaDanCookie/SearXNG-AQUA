#!/usr/bin/env bash
# Install a per-user desktop launcher and icon for SearXNG AQUA.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAUNCHER="$ROOT/bin/searxng-aqua-console"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
APPS_DIR="$DATA_HOME/applications"
ICON_DIR="$DATA_HOME/icons/hicolor/scalable/apps"
BIN_DIR="$HOME/.local/bin"

[ -x "$LAUNCHER" ] || { echo "Missing launcher: $LAUNCHER" >&2; exit 1; }

install -d "$APPS_DIR" "$ICON_DIR" "$BIN_DIR"
install -m 644 "$ROOT/packaging/searxng-aqua.svg" "$ICON_DIR/searxng-aqua.svg"
sed "s|@LAUNCHER@|$LAUNCHER|g" \
  "$ROOT/packaging/searxng-aqua.desktop.in" > "$APPS_DIR/searxng-aqua.desktop"
ln -sfn "$LAUNCHER" "$BIN_DIR/searxng-aqua-console"

if command -v kbuildsycoca6 >/dev/null 2>&1; then
  kbuildsycoca6 --noincremental >/dev/null 2>&1 || true
fi

echo "Installed the SearXNG AQUA desktop launcher."
echo "Run it from the application menu, or: $BIN_DIR/searxng-aqua-console"
