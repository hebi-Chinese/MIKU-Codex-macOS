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
