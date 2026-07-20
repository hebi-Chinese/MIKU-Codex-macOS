#!/bin/bash

set -Eeuo pipefail
. "$(cd "$(dirname "$0")" && pwd -P)/common-macos.sh"

PORT=9341
TARGET="$HOME/Applications/MIKU Codex.app"
while [ "$#" -gt 0 ]; do
  case "$1" in
    --port) PORT="${2:-}"; shift 2 ;;
    --target) TARGET="${2:-}"; shift 2 ;;
    *) fail "Unknown MIKU launcher argument: $1" ;;
  esac
done
case "$PORT" in ''|*[!0-9]*) fail "Invalid port: $PORT" ;; esac
[ "$PORT" -ge 1024 ] && [ "$PORT" -le 65535 ] \
  || fail "Port must be between 1024 and 65535."
case "$TARGET" in
  /*/MIKU\ Codex.app) ;;
  *) fail "MIKU launcher target must be an absolute path ending in MIKU Codex.app." ;;
esac

ENGINE_ROOT="${CODEX_DREAM_SKIN_ENGINE:-$INSTALL_ROOT}"
if [ ! -x "$ENGINE_ROOT/scripts/start-dream-skin-macos.sh" ]; then
  ENGINE_ROOT="$PROJECT_ROOT"
fi
START_SCRIPT="$ENGINE_ROOT/scripts/start-dream-skin-macos.sh"
[ -x "$START_SCRIPT" ] || fail "Dream Skin start script is not executable: $START_SCRIPT"
ICON_SOURCE="$ENGINE_ROOT/assets/miku-codex-app-icon.icns"
[ -f "$ICON_SOURCE" ] || fail "MIKU launcher icon is missing: $ICON_SOURCE"

TARGET_PARENT="$(dirname "$TARGET")"
/bin/mkdir -p "$TARGET_PARENT"
STAGING_ROOT="$(/usr/bin/mktemp -d "$TARGET_PARENT/.miku-codex-launcher.XXXXXX")"
cleanup_staging() { /bin/rm -rf "$STAGING_ROOT"; }
trap cleanup_staging EXIT

STAGED_APP="$STAGING_ROOT/MIKU Codex.app"
STAGED_CONTENTS="$STAGED_APP/Contents"
STAGED_RESOURCES="$STAGED_CONTENTS/Resources"
STAGED_PLIST="$STAGED_CONTENTS/Info.plist"
STAGED_ICON="$STAGED_APP/Contents/Resources/MIKUCodex.icns"
APPLESCRIPT_SOURCE="$STAGING_ROOT/miku-codex-launcher.applescript"
MIKU_LAUNCH_LOG="$STATE_ROOT/miku-launcher.log"
MIKU_LAUNCH_ERROR_LOG="$STATE_ROOT/miku-launcher-error.log"

escape_applescript_string() {
  /usr/bin/printf '%s' "$1" | /usr/bin/sed 's/\\/\\\\/g; s/"/\\"/g'
}

START_APPLESCRIPT="$(escape_applescript_string "$START_SCRIPT")"
HOME_APPLESCRIPT="$(escape_applescript_string "$HOME")"
LOG_APPLESCRIPT="$(escape_applescript_string "$MIKU_LAUNCH_LOG")"
ERROR_LOG_APPLESCRIPT="$(escape_applescript_string "$MIKU_LAUNCH_ERROR_LOG")"

/usr/bin/printf '%s\n' \
  'property launcherMarker : "CodexDreamSkinStudio MIKU app launcher"' \
  "property startScript : \"$START_APPLESCRIPT\"" \
  "property userHome : \"$HOME_APPLESCRIPT\"" \
  "property launchPort : \"$PORT\"" \
  "property launchLog : \"$LOG_APPLESCRIPT\"" \
  "property errorLog : \"$ERROR_LOG_APPLESCRIPT\"" \
  '' \
  'on run' \
  '  set stateDirectory to do shell script "/usr/bin/dirname " & quoted form of launchLog' \
  '  do shell script "/bin/mkdir -p " & quoted form of stateDirectory & " && /bin/chmod 700 " & quoted form of stateDirectory' \
  '  set launchCommand to "/usr/bin/env HOME=" & quoted form of userHome & " /bin/bash " & quoted form of startScript & " --port " & quoted form of launchPort & " --restart-existing"' \
  '  try' \
  '    do shell script launchCommand & " >> " & quoted form of launchLog & " 2>> " & quoted form of errorLog' \
  '  on error errorMessage number errorNumber' \
  '    display alert "MIKU Codex 启动失败" message "启动器错误 " & errorNumber & "。详情已写入：" & errorLog as critical buttons {"完成"} default button "完成"' \
  '  end try' \
  'end run' \
  > "$APPLESCRIPT_SOURCE"

# Finder and Dock require an actual app executable. osacompile supplies the
# signed-system applet Mach-O; a text script in CFBundleExecutable is rejected
# by LaunchServices with -10669 even when the surrounding bundle is signed.
/usr/bin/osacompile -o "$STAGED_APP" "$APPLESCRIPT_SOURCE"
/bin/mkdir -p "$STAGED_RESOURCES"
/bin/cp "$ICON_SOURCE" "$STAGED_ICON"
/bin/chmod 600 "$STAGED_ICON"

for plist_key in \
  CFBundleDevelopmentRegion CFBundleDisplayName CFBundleIconFile CFBundleIconName \
  CFBundleIdentifier CFBundleInfoDictionaryVersion CFBundleName \
  CFBundlePackageType CFBundleShortVersionString CFBundleVersion \
  LSMinimumSystemVersion NSHighResolutionCapable; do
  /usr/bin/plutil -remove "$plist_key" "$STAGED_PLIST" >/dev/null 2>&1 || true
done
/usr/bin/plutil -insert CFBundleDevelopmentRegion -string 'zh_CN' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleDisplayName -string 'MIKU Codex' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleIconFile -string 'MIKUCodex.icns' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleIdentifier -string \
  'com.openai.codex-dream-skin-studio.miku-launcher' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleInfoDictionaryVersion -string '6.0' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleName -string 'MIKU Codex' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundlePackageType -string 'APPL' "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleShortVersionString -string "$SKIN_VERSION" "$STAGED_PLIST"
/usr/bin/plutil -insert CFBundleVersion -string '1' "$STAGED_PLIST"
/usr/bin/plutil -insert LSMinimumSystemVersion -string '13.0' "$STAGED_PLIST"
/usr/bin/plutil -insert NSHighResolutionCapable -bool true "$STAGED_PLIST"
/bin/chmod 600 "$STAGED_PLIST"
/usr/bin/codesign --force --sign - "$STAGED_APP" >/dev/null

if [ -e "$TARGET" ]; then
  EXISTING_ID="$(/usr/bin/plutil -extract CFBundleIdentifier raw -o - \
    "$TARGET/Contents/Info.plist" 2>/dev/null || true)"
  EXISTING_EXECUTABLE_NAME="$(/usr/bin/plutil -extract CFBundleExecutable raw -o - \
    "$TARGET/Contents/Info.plist" 2>/dev/null || true)"
  EXISTING_EXECUTABLE="$TARGET/Contents/MacOS/$EXISTING_EXECUTABLE_NAME"
  EXISTING_SCRIPT="$TARGET/Contents/Resources/Scripts/main.scpt"
  EXISTING_MARKER="false"
  if /usr/bin/grep -F -q '# CodexDreamSkinStudio MIKU app launcher' "$EXISTING_EXECUTABLE" 2>/dev/null; then
    EXISTING_MARKER="true"
  elif [ -f "$EXISTING_SCRIPT" ] \
    && /usr/bin/osadecompile "$EXISTING_SCRIPT" 2>/dev/null \
      | /usr/bin/grep -F -q 'CodexDreamSkinStudio MIKU app launcher'; then
    EXISTING_MARKER="true"
  fi
  [ "$EXISTING_ID" = 'com.openai.codex-dream-skin-studio.miku-launcher' ] \
    && [ "$EXISTING_MARKER" = 'true' ] \
    || fail "Refusing to replace an unrelated app at $TARGET"
  PREVIOUS_APP="$STAGING_ROOT/Previous MIKU Codex.app"
  /bin/mv "$TARGET" "$PREVIOUS_APP"
  if ! /bin/mv "$STAGED_APP" "$TARGET"; then
    /bin/mv "$PREVIOUS_APP" "$TARGET" 2>/dev/null || true
    fail "Could not install MIKU Codex.app"
  fi
else
  /bin/mv "$STAGED_APP" "$TARGET"
fi

/usr/bin/touch "$TARGET"
printf 'Installed the persistent MIKU launch entry at %s.\n' "$TARGET"
printf 'Open this entry for future Codex launches; it restores loopback injection without modifying Codex.app.\n'
