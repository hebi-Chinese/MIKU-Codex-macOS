#!/bin/bash

set -Eeuo pipefail
. "$(cd "$(dirname "$0")" && pwd -P)/common-macos.sh"

record_start_error() {
  local code="$1"
  local line="$2"
  ensure_state_root
  printf '%s exit=%s line=%s\n' "$(/bin/date -u '+%Y-%m-%dT%H:%M:%SZ')" "$code" "$line" >> "$START_ERROR_LOG"
  printf 'Codex Dream Skin Studio: start failed at line %s (exit %s). See %s\n' "$line" "$code" "$START_ERROR_LOG" >&2
}
trap 'code=$?; record_start_error "$code" "$LINENO"' ERR

# injector.mjs has its own CDP deadline, but a socket/runtime edge case must
# never leave its verify child attached to the MIKU launcher indefinitely.
# Keep this watchdog local to verification: it does not restart Codex, touch
# the watcher, or signal any process whose PID was not spawned by this shell.
run_with_timeout() {
  local timeout_seconds="$1"
  shift
  "$@" &
  local command_pid="$!"
  local deadline=$((SECONDS + timeout_seconds))
  while /bin/kill -0 "$command_pid" 2>/dev/null; do
    if [ "$SECONDS" -ge "$deadline" ]; then
      /bin/kill -TERM "$command_pid" 2>/dev/null || true
      local terminate_deadline=$((SECONDS + 2))
      while /bin/kill -0 "$command_pid" 2>/dev/null && [ "$SECONDS" -lt "$terminate_deadline" ]; do
        /bin/sleep 0.1
      done
      if /bin/kill -0 "$command_pid" 2>/dev/null; then
        /bin/kill -KILL "$command_pid" 2>/dev/null || true
      fi
      wait "$command_pid" 2>/dev/null || true
      return 124
    fi
    /bin/sleep 0.1
  done
  wait "$command_pid"
}

codex_bundle_version() {
  /usr/bin/plutil -extract CFBundleShortVersionString raw -o - \
    "$CODEX_BUNDLE/Contents/Info.plist" 2>/dev/null || true
}

codex_update_restart_ready() {
  local initial_version="$1"
  local initial_pid="$2"
  local current_version="$3"
  local current_pid="$4"
  local port="$5"
  [ -n "$initial_version" ] && [ -n "$initial_pid" ] || return 1
  [ -n "$current_version" ] && [ "$current_version" != "$initial_version" ] || return 1
  [ -n "$current_pid" ] && [ "$current_pid" != "$initial_pid" ] || return 1
  ! verified_cdp_endpoint "$port"
}

codex_theme_ready_for_start() {
  local initial_version="$1"
  local initial_pid="$2"
  local current_version="$3"
  local current_pid="$4"
  local port="$5"
  verified_cdp_endpoint "$port" || return 1
  /usr/bin/grep -q 'injected verified Codex target' "$INJECTOR_LOG" 2>/dev/null || return 1
  [ "$current_version" = "$initial_version" ] || [ "$current_pid" != "$initial_pid" ]
}

# A signed in-app update can replace and relaunch Codex after the MIKU entry
# starts. Recover only when both the bundle version and main PID changed during
# this invocation; a normal user quit must never satisfy that boundary.
recover_after_codex_update() {
  local initial_version="$1"
  local initial_pid="$2"
  local port="$3"
  local timeout_seconds="${4:-120}"
  local deadline=$((SECONDS + timeout_seconds))
  local current_version=""
  local current_pid=""

  while [ "$SECONDS" -lt "$deadline" ]; do
    current_version="$(codex_bundle_version)"
    current_pid="$(codex_main_pids | /usr/bin/head -n 1)"
    if codex_theme_ready_for_start \
      "$initial_version" "$initial_pid" "$current_version" "$current_pid" "$port"; then
      return 0
    fi
    if codex_update_restart_ready \
      "$initial_version" "$initial_pid" "$current_version" "$current_pid" "$port"; then
      printf 'Codex updated from %s to %s during startup; restoring the verified loopback launch once…\n' \
        "$initial_version" "$current_version" >&2
      discover_codex_app
      require_macos_runtime
      stop_codex true
      launch_codex_with_cdp "$port"
      wait_for_cdp "$port" || return 1
      return 0
    fi

    # No version change means a missing process is a user quit, not an updater
    # handoff. Fail closed instead of turning the MIKU entry into KeepAlive.
    if [ -z "$current_pid" ] && [ "$current_version" = "$initial_version" ]; then
      return 1
    fi
    /bin/sleep 0.5
  done
  return 1
}

PORT=9341
PORT_EXPLICIT="false"
RESTART_EXISTING="false"
PROMPT_RESTART="false"
FOREGROUND_INJECTOR="false"
while [ "$#" -gt 0 ]; do
  case "$1" in
    --port) PORT="${2:-}"; PORT_EXPLICIT="true"; shift 2 ;;
    --restart-existing) RESTART_EXISTING="true"; shift ;;
    --prompt-restart) PROMPT_RESTART="true"; shift ;;
    --foreground-injector) FOREGROUND_INJECTOR="true"; shift ;;
    *) fail "Unknown start argument: $1" ;;
  esac
done
case "$PORT" in ''|*[!0-9]*) fail "Invalid port: $PORT" ;; esac
[ "$PORT" -ge 1024 ] && [ "$PORT" -le 65535 ] || fail "Port must be between 1024 and 65535."

discover_codex_app
require_macos_runtime
ensure_state_root
START_CODEX_VERSION="$CODEX_VERSION"

if [ "$PORT_EXPLICIT" = "false" ] && [ -f "$STATE_PATH" ]; then
  saved_port="$(state_field port)" || fail "Could not read the existing state port."
  [ -n "$saved_port" ] && PORT="$saved_port"
fi

DEBUG_READY="false"
if verified_cdp_endpoint "$PORT"; then DEBUG_READY="true"; fi

if codex_is_running && [ "$DEBUG_READY" = "false" ]; then
  if [ "$PROMPT_RESTART" = "true" ] && [ "$RESTART_EXISTING" = "false" ]; then
    /usr/bin/osascript -e 'display dialog "Codex 需要重启一次才能启用 Dream Skin。" buttons {"取消", "重启并应用"} default button "重启并应用" with title "Codex Dream Skin Studio"' >/dev/null \
      || fail "Theme launch was cancelled."
    RESTART_EXISTING="true"
  fi
  [ "$RESTART_EXISTING" = "true" ] || fail "Codex is already running without the verified skin CDP endpoint. Close it first or pass --restart-existing."
  stop_codex true
fi

if [ -f "$STATE_PATH" ]; then
  stop_recorded_injector
  /bin/rm -f "$STATE_PATH"
fi

INJECTOR_PID=""
if [ "$DEBUG_READY" = "false" ]; then
  PORT="$(select_available_port "$PORT")"
  printf 'Launching Codex with skin debug port %s…\n' "$PORT" >&2
  launch_codex_with_cdp "$PORT"
  # Start probing immediately instead of waiting for the native window to finish loading.
  if [ "$FOREGROUND_INJECTOR" != "true" ]; then
    INJECTOR_PID="$(launch_injector_daemon "$PORT")"
  fi
  if ! wait_for_cdp "$PORT"; then
    [ -z "$INJECTOR_PID" ] || /bin/kill -TERM "$INJECTOR_PID" 2>/dev/null || true
    fail "Codex did not expose a verified loopback CDP endpoint on port $PORT within 45 seconds. See $APP_LOG and $APP_ERROR_LOG"
  fi
fi

if [ "$FOREGROUND_INJECTOR" = "true" ]; then
  exec "$NODE" "$INJECTOR" --watch --port "$PORT" --theme-dir "$THEME_DIR"
fi

if [ -z "$INJECTOR_PID" ]; then
  INJECTOR_PID="$(launch_injector_daemon "$PORT")"
fi
/bin/sleep 0.15
/bin/kill -0 "$INJECTOR_PID" 2>/dev/null || fail "The injector exited during startup. See $INJECTOR_ERROR_LOG"
INJECTOR_STARTED_AT="$(process_started_at "$INJECTOR_PID")"
[ -n "$INJECTOR_STARTED_AT" ] || fail "Could not record the injector process start time."
CODEX_PID="$(codex_main_pids | /usr/bin/head -n 1)"
START_CODEX_PID="$CODEX_PID"
write_state "$PORT" "$INJECTOR_PID" "$INJECTOR_STARTED_AT" "$CODEX_PID"

# Soft verify: keep the injector even if secondary selectors differ by Codex version.
VERIFY_OUTPUT="$(/usr/bin/mktemp "${TMPDIR:-/tmp}/dream-skin-verify.XXXXXX")"
/bin/chmod 600 "$VERIFY_OUTPUT"
cleanup_verify_output() { /bin/rm -f "$VERIFY_OUTPUT"; }
trap cleanup_verify_output EXIT
if run_with_timeout 24 "$NODE" "$INJECTOR" --verify --port "$PORT" --theme-dir "$THEME_DIR" --timeout-ms 20000 >"$VERIFY_OUTPUT" 2>/dev/null; then
  verify_code=0
else
  verify_code=$?
fi
if [ "$verify_code" -ne 0 ]; then
  # One more force inject before giving up
  run_with_timeout 18 "$NODE" "$INJECTOR" --once --port "$PORT" --theme-dir "$THEME_DIR" --timeout-ms 15000 >/dev/null 2>&1 || true
  if run_with_timeout 16 "$NODE" "$INJECTOR" --verify --port "$PORT" --theme-dir "$THEME_DIR" --timeout-ms 12000 >"$VERIFY_OUTPUT" 2>/dev/null; then
    verify_code=0
  else
    verify_code=$?
  fi
fi
if [ "$verify_code" -ne 0 ] && [ "$RESTART_EXISTING" = "true" ]; then
  if recover_after_codex_update "$START_CODEX_VERSION" "$START_CODEX_PID" "$PORT" 120; then
    CODEX_PID="$(codex_main_pids | /usr/bin/head -n 1)"
    write_state "$PORT" "$INJECTOR_PID" "$INJECTOR_STARTED_AT" "$CODEX_PID"
    if run_with_timeout 36 "$NODE" "$INJECTOR" --verify --port "$PORT" \
      --theme-dir "$THEME_DIR" --timeout-ms 30000 >"$VERIFY_OUTPUT" 2>/dev/null; then
      verify_code=0
    else
      verify_code=$?
    fi
  fi
fi
if [ "$verify_code" -ne 0 ]; then
  # If CSS markers are present, treat as soft success (do not kill injector).
  if /usr/bin/grep -q '"installed": true' "$VERIFY_OUTPUT" 2>/dev/null; then
    printf 'Codex Dream Skin Studio %s is active (soft verify) on port %s.\n' "$SKIN_VERSION" "$PORT"
    cleanup_verify_output
    trap - EXIT
    exit 0
  fi
  # The watcher is normally launched directly (launchctl is only a fallback),
  # so a successful `launchctl remove` does not prove that the recorded PID
  # stopped.  Verify the PID/path/start-time tuple before deleting state; if
  # it cannot be stopped safely, preserve the state as evidence and fail
  # closed instead of leaving an orphan watcher that can reinject later.
  if ! stop_recorded_injector; then
    cleanup_verify_output
    trap - EXIT
    fail "Injection verification failed and the recorded injector could not be stopped safely; state was preserved. See $INJECTOR_ERROR_LOG"
  fi
  /bin/rm -f "$STATE_PATH"
  cleanup_verify_output
  trap - EXIT
  fail "Injection verification failed. The injector was stopped; see $INJECTOR_ERROR_LOG"
fi
cleanup_verify_output
trap - EXIT

printf 'Codex Dream Skin Studio %s is active on loopback port %s.\n' "$SKIN_VERSION" "$PORT"
