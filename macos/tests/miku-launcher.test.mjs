import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const installer = path.join(root, "scripts", "install-miku-launcher-macos.sh");
const mainInstaller = path.join(root, "scripts", "install-dream-skin-macos.sh");
const starter = path.join(root, "scripts", "start-dream-skin-macos.sh");
const appIcon = path.join(root, "assets", "miku-codex-app-icon.icns");
const appIconSource = path.join(root, "assets", "miku-codex-app-icon.svg");
assert.ok(fs.existsSync(installer), "The persistent MIKU launcher installer must exist.");
assert.ok(fs.existsSync(appIconSource), "The MIKU launcher icon needs an auditable SVG source.");
assert.ok(fs.existsSync(appIcon), "The MIKU launcher installer needs a complete macOS ICNS asset.");

const source = fs.readFileSync(installer, "utf8");
assert.match(source, /MIKU Codex\.app/);
assert.match(source, /--restart-existing/,
  "Launching the explicit MIKU entry must recover a normally started Codex that lacks CDP.");
assert.match(source, /com\.openai\.codex-dream-skin-studio\.miku-launcher/);
assert.match(source, /CFBundleIconFile[^\n]*MIKUCodex\.icns/,
  "The launcher plist must declare the themed app icon.");
assert.match(source, /Contents\/Resources\/MIKUCodex\.icns/,
  "The installer must copy the themed ICNS into the signed app bundle.");
assert.doesNotMatch(source, /KeepAlive[^\n]*true/,
  "The launcher must never force Codex to reopen after a user quits.");
assert.doesNotMatch(source, /(cp|mv|rsync|plutil)[^\n]*(CODEX_BUNDLE|app\.asar)/,
  "The launcher installer must not write into the official Codex bundle.");
const mainInstallerSource = fs.readFileSync(mainInstaller, "utf8");
const starterSource = fs.readFileSync(starter, "utf8");
assert.match(
  mainInstallerSource,
  /install-miku-launcher-macos\.sh" --port "\$PORT" --target "\$HOME\/Applications\/MIKU Codex\.app"/,
  "The stable user Applications entry must be installed explicitly.",
);
assert.match(
  mainInstallerSource,
  /install-miku-launcher-macos\.sh" --port "\$PORT" --target "\$HOME\/Desktop\/MIKU Codex\.app"/,
  "The desktop MIKU entry must be installed explicitly.",
);
assert.match(
  starterSource,
  /run_with_timeout\(\)[\s\S]{0,900}\/bin\/kill -TERM "\$command_pid"/,
  "The startup verifier needs a bounded, local watchdog instead of allowing a stuck CDP verify process to outlive the launcher.",
);
assert.match(
  starterSource,
  /run_with_timeout 24 "\$NODE" "\$INJECTOR" --verify[\s\S]{0,240}--timeout-ms 20000/,
  "The first soft verify must have both a protocol timeout and a process-level timeout.",
);
assert.match(
  starterSource,
  /run_with_timeout 16 "\$NODE" "\$INJECTOR" --verify[\s\S]{0,240}--timeout-ms 12000/,
  "The fallback verify must also be unable to remain orphaned.",
);
const watchdogStart = starterSource.indexOf("run_with_timeout() {");
const watchdogEnd = starterSource.indexOf("\n\nPORT=9341", watchdogStart);
const watchdogFunction = starterSource.slice(watchdogStart, watchdogEnd);
assert.ok(watchdogFunction.includes("run_with_timeout()"));
const watchdogResult = spawnSync("/bin/bash", ["-c", `set -Eeuo pipefail
${watchdogFunction}
started=$SECONDS
if run_with_timeout 1 /bin/sleep 10; then
  status=0
else
  status=$?
fi
elapsed=$((SECONDS - started))
[ "$status" -eq 124 ] && [ "$elapsed" -lt 5 ]
`], {
  encoding: "utf8",
  timeout: 8_000,
});
assert.equal(
  watchdogResult.status,
  0,
  `The local verifier watchdog must terminate only its own hung child promptly. ${watchdogResult.stderr}`,
);

const recoveryStart = starterSource.indexOf("codex_bundle_version() {");
const recoveryEnd = starterSource.indexOf("\n\nPORT=9341", recoveryStart);
assert.ok(
  recoveryStart >= 0 && recoveryEnd > recoveryStart,
  "The MIKU startup path needs a bounded recovery seam for an in-flight Codex update.",
);
const recoveryFunctions = starterSource.slice(recoveryStart, recoveryEnd);
const recoveryResult = spawnSync("/bin/bash", ["-c", `set -Eeuo pipefail
trace="$(/usr/bin/mktemp -d)/trace"
${recoveryFunctions}
codex_bundle_version() { printf '%s\\n' '26.810.52044'; }
codex_main_pids() { printf '%s\\n' '222'; }
verified_cdp_endpoint() { return 1; }
discover_codex_app() { CODEX_VERSION='26.810.52044'; }
require_macos_runtime() { :; }
stop_codex() { printf '%s\\n' stop >> "$trace"; }
launch_codex_with_cdp() { printf '%s\\n' launch >> "$trace"; }
wait_for_cdp() { return 0; }
recover_after_codex_update '26.810.50856' '111' '9341' '1'
[ "$(/bin/cat "$trace")" = $'stop\\nlaunch' ]
`], { encoding: "utf8", timeout: 4_000 });
assert.equal(
  recoveryResult.status,
  0,
  `A launcher-started Codex that updates and restarts without CDP must be relaunched exactly once. ${recoveryResult.stderr}`,
);
const recoveryGuardResult = spawnSync("/bin/bash", ["-c", `set -Eeuo pipefail
${recoveryFunctions}
verified_cdp_endpoint() { [ "$1" = '19434' ]; }
if codex_update_restart_ready '26.810.50856' '111' '26.810.50856' '222' '19431'; then exit 1; fi
if codex_update_restart_ready '26.810.50856' '111' '26.810.52044' '111' '19432'; then exit 1; fi
if codex_update_restart_ready '26.810.50856' '111' '26.810.52044' '' '19433'; then exit 1; fi
if codex_update_restart_ready '26.810.50856' '111' '26.810.52044' '222' '19434'; then exit 1; fi
codex_update_restart_ready '26.810.50856' '111' '26.810.52044' '222' '19435'
`], { encoding: "utf8", timeout: 4_000 });
assert.equal(
  recoveryGuardResult.status,
  0,
  `Update recovery must require a changed version, a replacement PID, and a missing verified CDP endpoint. ${recoveryGuardResult.stderr}`,
);
const updateHandoffResult = spawnSync("/bin/bash", ["-c", `set -Eeuo pipefail
${recoveryFunctions}
INJECTOR_LOG="$(/usr/bin/mktemp)"
printf '%s\\n' '[dream-skin] injected verified Codex target fixture' > "$INJECTOR_LOG"
verified_cdp_endpoint() { [ "$1" != '19434' ]; }
codex_theme_ready_for_start '26.810.50856' '111' '26.810.50856' '111' '19431'
if codex_theme_ready_for_start '26.810.50856' '111' '26.810.52044' '111' '19432'; then exit 1; fi
codex_theme_ready_for_start '26.810.50856' '111' '26.810.52044' '222' '19433'
if codex_theme_ready_for_start '26.810.50856' '111' '26.810.52044' '222' '19434'; then exit 1; fi
`], { encoding: "utf8", timeout: 4_000 });
assert.equal(
  updateHandoffResult.status,
  0,
  `A downloaded update must keep the launcher alive until the main PID is replaced; an unchanged launch or a CDP-preserving replacement may finish. ${updateHandoffResult.stderr}`,
);
assert.match(
  starterSource,
  /\[ "\$verify_code" -ne 0 \] && \[ "\$RESTART_EXISTING" = "true" \][\s\S]{0,260}recover_after_codex_update/,
  "Automatic update recovery must remain behind the explicit restart authorization flag.",
);

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "miku-launcher-test."));
try {
  const engineRoot = path.join(fixture, "engine with spaces");
  const engineScripts = path.join(engineRoot, "scripts");
  const engineAssets = path.join(engineRoot, "assets");
  const target = path.join(fixture, "Applications", "MIKU Codex.app");
  fs.mkdirSync(engineScripts, { recursive: true });
  fs.mkdirSync(engineAssets, { recursive: true });
  fs.copyFileSync(appIcon, path.join(engineAssets, "miku-codex-app-icon.icns"));
  const start = path.join(engineScripts, "start-dream-skin-macos.sh");
  fs.writeFileSync(start, "#!/bin/bash\nexit 0\n", { mode: 0o700 });

  const result = spawnSync("/bin/bash", [installer, "--port", "19431", "--target", target], {
    env: { ...process.env, HOME: fixture, CODEX_DREAM_SKIN_ENGINE: engineRoot },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const plist = path.join(target, "Contents", "Info.plist");
  const installedIcon = path.join(target, "Contents", "Resources", "MIKUCodex.icns");
  assert.ok(fs.existsSync(plist));
  const executableNameResult = spawnSync("/usr/bin/plutil", [
    "-extract", "CFBundleExecutable", "raw", "-o", "-", plist,
  ], { encoding: "utf8" });
  assert.equal(executableNameResult.status, 0, executableNameResult.stderr);
  const executable = path.join(
    target, "Contents", "MacOS", executableNameResult.stdout.trim(),
  );
  assert.ok(fs.existsSync(executable));
  assert.ok(fs.existsSync(installedIcon));
  const executableFormat = spawnSync("/usr/bin/file", [executable], { encoding: "utf8" });
  assert.equal(executableFormat.status, 0, executableFormat.stderr);
  assert.match(executableFormat.stdout, /Mach-O/,
    "The launcher must be a LaunchServices-compatible Mach-O executable, not a shell script.");
  assert.notEqual(fs.readFileSync(executable).subarray(0, 2).toString(), "#!",
    "Finder and Dock reject a text script used directly as CFBundleExecutable.");

  const launcherScript = path.join(target, "Contents", "Resources", "Scripts", "main.scpt");
  assert.ok(fs.existsSync(launcherScript), "The native applet must contain its AppleScript entrypoint.");
  const decompiledLauncher = spawnSync("/usr/bin/osadecompile", [launcherScript], { encoding: "utf8" });
  assert.equal(decompiledLauncher.status, 0, decompiledLauncher.stderr);
  assert.match(decompiledLauncher.stdout, /property launchPort : "19431"/);
  assert.match(decompiledLauncher.stdout, /" --port " & quoted form of launchPort & " --restart-existing"/);
  assert.match(decompiledLauncher.stdout, /engine\\ with\\ spaces|engine with spaces/,
    "The applet must call the stable engine path, including paths with spaces.");

  const plistResult = spawnSync("/usr/bin/plutil", ["-extract", "CFBundleIdentifier", "raw", "-o", "-", plist], {
    encoding: "utf8",
  });
  assert.equal(plistResult.status, 0, plistResult.stderr);
  assert.equal(plistResult.stdout.trim(), "com.openai.codex-dream-skin-studio.miku-launcher");
  const iconPlistResult = spawnSync("/usr/bin/plutil", [
    "-extract", "CFBundleIconFile", "raw", "-o", "-", plist,
  ], { encoding: "utf8" });
  assert.equal(iconPlistResult.status, 0, iconPlistResult.stderr);
  assert.equal(iconPlistResult.stdout.trim(), "MIKUCodex.icns");
  const iconNamePlistResult = spawnSync("/usr/bin/plutil", [
    "-extract", "CFBundleIconName", "raw", "-o", "-", plist,
  ], { encoding: "utf8" });
  assert.notEqual(iconNamePlistResult.status, 0,
    "The installed launcher must remove osacompile's CFBundleIconName=applet override so Finder uses MIKUCodex.icns.");
  assert.deepEqual(fs.readFileSync(installedIcon), fs.readFileSync(appIcon));

  const second = spawnSync("/bin/bash", [installer, "--port", "19431", "--target", target], {
    env: { ...process.env, HOME: fixture, CODEX_DREAM_SKIN_ENGINE: engineRoot },
    encoding: "utf8",
  });
  assert.equal(second.status, 0, second.stderr || second.stdout);
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}

console.log("PASS: MIKU launcher is user-local, idempotent, and does not mutate Codex.app.");
