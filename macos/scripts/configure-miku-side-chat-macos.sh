#!/bin/bash

set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd -P)/common-macos.sh"

LOCAL_IMAGE=""
APPLY_NOW="false"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --file) LOCAL_IMAGE="${2:-}"; shift 2 ;;
    --apply) APPLY_NOW="true"; shift ;;
    --no-apply) APPLY_NOW="false"; shift ;;
    *) fail "Unknown MIKU side-chat argument: $1" ;;
  esac
done

[ -n "$LOCAL_IMAGE" ] || fail "Pass --file <user-provided Love Words V image>."
[ -f "$LOCAL_IMAGE" ] || fail "User-provided side-chat image not found: $LOCAL_IMAGE"
[ ! -L "$LOCAL_IMAGE" ] || fail "User-provided side-chat image must not be a symbolic link."

ensure_state_root
ensure_node_runtime
seed_bundled_presets

THEMES_ROOT="$STATE_ROOT/themes"
CUSTOM_THEME="$THEMES_ROOT/custom-miku-love-words"
BASE_THEME="$THEMES_ROOT/preset-miku-love-words"
if [ -f "$CUSTOM_THEME/theme.json" ]; then
  BASE_THEME="$CUSTOM_THEME"
fi
[ -f "$BASE_THEME/theme.json" ] || fail "The MIKU Love Words preset is not installed."

STAGE="$(/usr/bin/mktemp -d "$STATE_ROOT/.miku-side-chat.XXXXXX")"
PREVIOUS=""
cleanup_side_chat_stage() {
  [ -z "$STAGE" ] || /bin/rm -rf "$STAGE"
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    /bin/rm -rf "$CUSTOM_THEME"
    /bin/mv "$PREVIOUS" "$CUSTOM_THEME"
  fi
}
trap cleanup_side_chat_stage EXIT

"$NODE" "$SCRIPT_DIR/stage-theme.mjs" "$BASE_THEME" "$STAGE" >/dev/null
SIDE_CHAT_IMAGE="$("$NODE" "$SCRIPT_DIR/configure-miku-side-chat.mjs" "$STAGE" "$LOCAL_IMAGE")"
"$NODE" "$INJECTOR" --check-payload --theme-dir "$STAGE" >/dev/null

if [ -d "$CUSTOM_THEME" ]; then
  PREVIOUS="$THEMES_ROOT/.custom-miku-love-words.previous.$$"
  /bin/mv "$CUSTOM_THEME" "$PREVIOUS"
fi
/bin/mv "$STAGE" "$CUSTOM_THEME"
STAGE=""
/bin/chmod 700 "$CUSTOM_THEME"
/bin/chmod 600 "$CUSTOM_THEME"/* 2>/dev/null || true

switch_args=(--id custom-miku-love-words)
[ "$APPLY_NOW" = "true" ] || switch_args+=(--no-apply)
"$SCRIPT_DIR/switch-theme-macos.sh" "${switch_args[@]}"

if [ -n "$PREVIOUS" ]; then
  /bin/rm -rf "$PREVIOUS"
  PREVIOUS=""
fi
trap - EXIT

printf 'Configured %s as the right-side chat / side-task background only.\n' "$SIDE_CHAT_IMAGE"
printf 'The main background and left product sidebar were not replaced.\n'
