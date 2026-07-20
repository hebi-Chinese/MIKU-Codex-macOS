import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const macosRoot = path.resolve(here, "..");
const configureScript = path.join(macosRoot, "scripts", "configure-miku-side-chat.mjs");
const fixtureAsset = path.join(macosRoot, "assets", "portal-hero.png");
const tempRoot = await fs.mkdtemp(path.join("/tmp", "miku-local-side-chat-"));

function runConfigure(themeDir, imagePath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [configureScript, themeDir, imagePath], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr || `configure-miku-side-chat exited with ${code}`));
    });
  });
}

try {
  const themeDir = path.join(tempRoot, "theme");
  const localArt = path.join(tempRoot, "user-provided-love-words-v.png");
  await fs.mkdir(themeDir);
  await fs.copyFile(fixtureAsset, path.join(themeDir, "background.png"));
  await fs.copyFile(fixtureAsset, path.join(themeDir, "old-side-chat.png"));
  await fs.copyFile(fixtureAsset, localArt);
  await fs.writeFile(
    path.join(themeDir, "theme.json"),
    `${JSON.stringify({
      schemaVersion: 1,
      id: "preset-miku-love-words",
      name: "MIKU · 爱言叶",
      image: "background.png",
      sideChatImage: "old-side-chat.png",
    })}\n`,
  );

  const configuredName = await runConfigure(themeDir, localArt);
  assert.equal(configuredName, "love-words-v-side-chat.png");
  const theme = JSON.parse(await fs.readFile(path.join(themeDir, "theme.json"), "utf8"));
  assert.equal(theme.id, "custom-miku-love-words");
  assert.equal(theme.image, "background.png", "The main background must not be replaced.");
  assert.equal(theme.sideChatImage, configuredName);
  assert.deepEqual(
    await fs.readFile(path.join(themeDir, configuredName)),
    await fs.readFile(localArt),
  );
  await assert.rejects(fs.access(path.join(themeDir, "old-side-chat.png")));

  const invalid = path.join(tempRoot, "not-an-image.png");
  await fs.writeFile(invalid, "not an image");
  await assert.rejects(runConfigure(themeDir, invalid), /valid PNG, JPEG, or WebP/);

  const linked = path.join(tempRoot, "linked.png");
  await fs.symlink(localArt, linked);
  await assert.rejects(runConfigure(themeDir, linked), /symbolic link/);

  console.log("PASS: local Love Words V art is isolated to a custom side-chat theme asset.");
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}
