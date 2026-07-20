#!/bin/bash

set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd -P)/common-macos.sh"

OUTPUT="$HOME/Downloads/MIKU Codex 个人版-$(/bin/date +%Y-%m-%d).zip"
THEME_SOURCE="$STATE_ROOT/theme"
RUN_TESTS="true"

if [ "$#" -gt 0 ] && [ "${1#--}" = "$1" ]; then
  OUTPUT="$1"
  shift
fi
while [ "$#" -gt 0 ]; do
  case "$1" in
    --theme-dir) THEME_SOURCE="${2:-}"; shift 2 ;;
    --skip-tests) RUN_TESTS="false"; shift ;;
    *) fail "Unknown MIKU client release argument: $1" ;;
  esac
done

case "$OUTPUT" in
  *.zip) ;;
  *) fail "MIKU client release output must end in .zip: $OUTPUT" ;;
esac
[ -d "$THEME_SOURCE" ] || fail "MIKU theme directory was not found: $THEME_SOURCE"
THEME_SOURCE="$(cd "$THEME_SOURCE" && pwd -P)"
[ -f "$THEME_SOURCE/theme.json" ] || fail "MIKU theme.json was not found in $THEME_SOURCE"
[ -z "$(/usr/bin/find "$THEME_SOURCE" -type l -print -quit)" ] \
  || fail "MIKU theme packages cannot contain symbolic links."
[ ! -e "$OUTPUT" ] || fail "Refusing to overwrite an existing archive: $OUTPUT"
[ ! -e "$OUTPUT.sha256" ] || fail "Refusing to overwrite an existing checksum: $OUTPUT.sha256"

discover_codex_app
require_macos_runtime
"$NODE" "$INJECTOR" --check-payload --theme-dir "$THEME_SOURCE" >/dev/null
if [ "$RUN_TESTS" = "true" ]; then
  NODE="$NODE" "$PROJECT_ROOT/tests/run-tests.sh"
fi

read_theme_asset() {
  local key="$1"
  "$NODE" -e '
    const fs = require("node:fs");
    const path = require("node:path");
    const [file, key] = process.argv.slice(1);
    const value = JSON.parse(fs.readFileSync(file, "utf8"))[key];
    if (value == null && key === "sideChatImage") process.exit(0);
    if (typeof value !== "string" || !value || path.basename(value) !== value) process.exit(2);
    process.stdout.write(value);
  ' "$THEME_SOURCE/theme.json" "$key" \
    || fail "Theme field $key must be a safe file name."
}

THEME_IMAGE="$(read_theme_asset image)"
SIDE_CHAT_IMAGE="$(read_theme_asset sideChatImage)"
[ -f "$THEME_SOURCE/$THEME_IMAGE" ] || fail "Theme image is missing: $THEME_IMAGE"
if [ -n "$SIDE_CHAT_IMAGE" ]; then
  [ -f "$THEME_SOURCE/$SIDE_CHAT_IMAGE" ] \
    || fail "Side-chat image is missing: $SIDE_CHAT_IMAGE"
fi

TEMPORARY="$(/usr/bin/mktemp -d /tmp/miku-codex-client.XXXXXX)"
cleanup_release() { /bin/rm -rf "$TEMPORARY"; }
trap cleanup_release EXIT
PACKAGE_ROOT="$TEMPORARY/MIKU Codex 个人版"
ENGINE="$PACKAGE_ROOT/.miku-codex-engine"
PRESET="$ENGINE/presets/preset-miku-love-words"
/bin/mkdir -p "$ENGINE" "$PRESET"

/usr/bin/rsync -a \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude '.playwright-cli/' \
  --exclude 'node_modules/' \
  --exclude 'output/' \
  --exclude 'prototypes/' \
  --exclude 'release/' \
  --exclude 'runtime/' \
  "$PROJECT_ROOT/" "$ENGINE/"

/bin/cp "$THEME_SOURCE/theme.json" "$PRESET/theme.json"
/bin/cp "$THEME_SOURCE/$THEME_IMAGE" "$PRESET/$THEME_IMAGE"
if [ -n "$SIDE_CHAT_IMAGE" ]; then
  /bin/cp "$THEME_SOURCE/$SIDE_CHAT_IMAGE" "$PRESET/$SIDE_CHAT_IMAGE"
fi
if [ -f "$THEME_SOURCE/README.md" ]; then
  /bin/cp "$THEME_SOURCE/README.md" "$PRESET/README.md"
fi
"$NODE" -e '
  const fs = require("node:fs");
  const file = process.argv[1];
  const theme = JSON.parse(fs.readFileSync(file, "utf8"));
  theme.id = "preset-miku-love-words";
  fs.writeFileSync(file, `${JSON.stringify(theme, null, 2)}\n`, { mode: 0o600 });
' "$PRESET/theme.json"

/usr/bin/printf '%s\n' \
  '#!/bin/bash' \
  'set -Eeuo pipefail' \
  'ROOT="$(cd "$(dirname "$0")" && pwd -P)"' \
  'ENGINE="$ROOT/.miku-codex-engine"' \
  'STABLE_ENGINE="$HOME/.codex/codex-dream-skin-studio"' \
  'on_error() {' \
  '  status=$?' \
  '  printf "\\nMIKU Codex 安装失败（状态 %s）。请保留这个窗口中的错误信息。\\n" "$status" >&2' \
  '  read -r -p "按回车键关闭窗口。" _ || true' \
  '  exit "$status"' \
  '}' \
  'trap on_error ERR' \
  '"$ENGINE/scripts/install-dream-skin-macos.sh" --no-launch' \
  '"$STABLE_ENGINE/scripts/switch-theme-macos.sh" --id preset-miku-love-words --no-apply' \
  '"$STABLE_ENGINE/scripts/start-dream-skin-macos.sh" --port 9341 --prompt-restart' \
  'printf "\\nMIKU Codex 已安装。以后请打开桌面或 Applications 中的 MIKU Codex.app。\\n"' \
  'read -r -p "按回车键关闭窗口。" _ || true' \
  > "$PACKAGE_ROOT/安装 MIKU Codex.command"

/usr/bin/printf '%s\n' \
  '#!/bin/bash' \
  'set -Eeuo pipefail' \
  'VERIFY="$HOME/.codex/codex-dream-skin-studio/scripts/verify-dream-skin-macos.sh"' \
  '[ -x "$VERIFY" ] || { printf "请先安装 MIKU Codex。\\n" >&2; read -r -p "按回车键关闭窗口。" _ || true; exit 1; }' \
  '"$VERIFY"' \
  'printf "\\nMIKU Codex 验证完成。\\n"' \
  'read -r -p "按回车键关闭窗口。" _ || true' \
  > "$PACKAGE_ROOT/验证 MIKU Codex.command"

/usr/bin/printf '%s\n' \
  '#!/bin/bash' \
  'set -Eeuo pipefail' \
  'RESTORE="$HOME/.codex/codex-dream-skin-studio/scripts/restore-dream-skin-macos.sh"' \
  '[ -x "$RESTORE" ] || { printf "没有找到可恢复的 MIKU Codex 安装。\\n" >&2; read -r -p "按回车键关闭窗口。" _ || true; exit 1; }' \
  '"$RESTORE" --restore-base-theme --restart-codex' \
  'printf "\\nCodex 原版外观已恢复。\\n"' \
  'read -r -p "按回车键关闭窗口。" _ || true' \
  > "$PACKAGE_ROOT/恢复 Codex 原版.command"

/usr/bin/printf '%s\n' \
  'MIKU Codex 个人版' \
  '' \
  '安装前：' \
  '1. 确认官方 Codex 已安装并至少启动过一次。' \
  '2. 完全退出 Codex。' \
  '3. 双击“安装 MIKU Codex.command”。' \
  '' \
  '安装完成后，请从桌面或“应用程序”中的 MIKU Codex.app 启动。' \
  '“验证 MIKU Codex.command”用于检查当前注入状态。' \
  '“恢复 Codex 原版.command”用于恢复官方外观。' \
  '' \
  '本包不会修改官方 Codex.app、app.asar 或官方签名。' \
  '这是未做 Apple 公证的个人本地包；复制到其他 Mac 后可能出现 Gatekeeper 提示。' \
  '主题图片只按个人备份用途封装，不代表获得公开再分发授权。' \
  > "$PACKAGE_ROOT/使用说明.txt"

/bin/chmod 755 "$PACKAGE_ROOT"/*.command
/bin/chmod 700 "$ENGINE"/*.command "$ENGINE"/scripts/*.sh "$ENGINE"/tests/*.sh 2>/dev/null || true
/usr/bin/xattr -cr "$PACKAGE_ROOT"
if [ -n "$(/usr/bin/find "$PACKAGE_ROOT" -type l -print -quit)" ]; then
  fail "Refusing to package symbolic links."
fi
if /usr/bin/find "$PACKAGE_ROOT" -type f \
  \( -name 'auth.json' -o -name 'state.json' -o -name '*.log' \) -print -quit \
  | /usr/bin/grep -q .; then
  fail "Refusing to package authentication, state, or log files."
fi

/bin/mkdir -p "$(dirname "$OUTPUT")"
COPYFILE_DISABLE=1 /usr/bin/ditto -c -k --keepParent --norsrc --noextattr \
  "$PACKAGE_ROOT" "$OUTPUT"
SHA256="$(/usr/bin/shasum -a 256 "$OUTPUT" | /usr/bin/awk '{print $1}')"
/usr/bin/printf '%s  %s\n' "$SHA256" "$(basename "$OUTPUT")" > "$OUTPUT.sha256"
/usr/bin/printf 'Created %s\nSHA-256 %s\n' "$OUTPUT" "$SHA256"
