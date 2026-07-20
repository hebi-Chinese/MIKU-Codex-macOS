#!/bin/bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
MACOS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"
SOURCE="$MACOS_ROOT/assets/miku-codex-app-icon.svg"
OUTPUT="${1:-$MACOS_ROOT/assets/miku-codex-app-icon.icns}"

[ -f "$SOURCE" ] || { printf 'Missing MIKU app icon source: %s\n' "$SOURCE" >&2; exit 1; }
case "$OUTPUT" in /*.icns) ;; *) printf 'Output must be an absolute .icns path.\n' >&2; exit 1 ;; esac

TEMP_ROOT="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/miku-codex-icon.XXXXXX")"
cleanup() { /bin/rm -rf "$TEMP_ROOT"; }
trap cleanup EXIT

BASE_PNG="$TEMP_ROOT/miku-codex-1024.png"
ICONSET="$TEMP_ROOT/MIKUCodex.iconset"
/bin/mkdir -p "$ICONSET" "$(dirname "$OUTPUT")"
/usr/bin/sips -s format png "$SOURCE" --out "$BASE_PNG" >/dev/null

make_icon() {
  local pixels="$1"
  local filename="$2"
  /usr/bin/sips -z "$pixels" "$pixels" "$BASE_PNG" --out "$ICONSET/$filename" >/dev/null
}

make_icon 16 icon_16x16.png
make_icon 32 icon_16x16@2x.png
make_icon 32 icon_32x32.png
make_icon 64 icon_32x32@2x.png
make_icon 128 icon_128x128.png
make_icon 256 icon_128x128@2x.png
make_icon 256 icon_256x256.png
make_icon 512 icon_256x256@2x.png
make_icon 512 icon_512x512.png
make_icon 1024 icon_512x512@2x.png

/usr/bin/iconutil -c icns "$ICONSET" -o "$OUTPUT"
/bin/chmod 644 "$OUTPUT"
printf 'Built MIKU Codex app icon at %s\n' "$OUTPUT"
