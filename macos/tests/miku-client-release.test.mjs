import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(testDir, "..");
const builder = join(root, "scripts", "build-miku-client-release.sh");
const temporary = mkdtempSync(join(tmpdir(), "miku-client-release-test."));
const themeDir = join(temporary, "theme");
const output = join(temporary, "MIKU Codex test.zip");
const extracted = join(temporary, "extracted");

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function walk(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? [child, ...walk(child)] : [child];
  });
}

try {
  mkdirSync(themeDir);
  const fixtureImage = join(root, "assets", "portal-hero.png");
  copyFileSync(fixtureImage, join(themeDir, "background.png"));
  copyFileSync(fixtureImage, join(themeDir, "side-chat.png"));
  writeFileSync(
    join(themeDir, "theme.json"),
    `${JSON.stringify({
      schemaVersion: 1,
      id: "custom-miku-test",
      name: "MIKU 测试主题",
      image: "background.png",
      sideChatImage: "side-chat.png",
    }, null, 2)}\n`,
  );
  chmodSync(builder, 0o755);

  execFileSync(builder, [output, "--theme-dir", themeDir, "--skip-tests"], {
    cwd: root,
    stdio: "pipe",
  });
  execFileSync("/usr/bin/ditto", ["-x", "-k", output, extracted]);

  const packageRoot = join(extracted, "MIKU Codex 个人版");
  const engine = join(packageRoot, ".miku-codex-engine");
  const preset = join(engine, "presets", "preset-miku-love-words");
  const installedTheme = JSON.parse(readFileSync(join(preset, "theme.json"), "utf8"));
  assert.equal(installedTheme.id, "preset-miku-love-words");
  assert.equal(installedTheme.name, "MIKU 测试主题");
  assert.equal(sha256(join(preset, "background.png")), sha256(join(themeDir, "background.png")));
  assert.equal(sha256(join(preset, "side-chat.png")), sha256(join(themeDir, "side-chat.png")));

  const expectedEntries = [
    "安装 MIKU Codex.command",
    "验证 MIKU Codex.command",
    "恢复 Codex 原版.command",
    "使用说明.txt",
  ];
  for (const entry of expectedEntries) {
    assert.ok(statSync(join(packageRoot, entry)).isFile(), `missing ${entry}`);
  }
  for (const entry of expectedEntries.filter((name) => name.endsWith(".command"))) {
    assert.notEqual(statSync(join(packageRoot, entry)).mode & 0o111, 0, `${entry} must be executable`);
  }

  const installCommand = readFileSync(join(packageRoot, "安装 MIKU Codex.command"), "utf8");
  assert.match(installCommand, /install-dream-skin-macos\.sh/);
  assert.match(installCommand, /switch-theme-macos\.sh/);
  assert.match(installCommand, /preset-miku-love-words/);
  assert.match(installCommand, /start-dream-skin-macos\.sh/);

  const entries = walk(packageRoot).map((path) => path.slice(packageRoot.length + 1));
  assert.ok(!entries.some((path) => path.endsWith("MIKU Codex.app")));
  assert.ok(!entries.some((path) => /(^|\/)\.git(\/|$)/.test(path)));
  assert.ok(!entries.some((path) => /(^|\/)\.playwright-cli(\/|$)/.test(path)));
  assert.ok(!entries.some((path) => /(^|\/)output(\/|$)/.test(path)));
  assert.ok(!entries.some((path) => /(^|\/)(auth|state)\.json$/.test(path)));

  const expectedArchiveHash = sha256(output);
  const checksum = readFileSync(`${output}.sha256`, "utf8").trim().split(/\s+/)[0];
  assert.equal(checksum, expectedArchiveHash);
  console.log("PASS: MIKU client ZIP is self-contained, themed, and excludes live state.");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
