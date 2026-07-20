import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPayload } from "../scripts/injector.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const macosRoot = resolve(here, "..");
const repositoryRoot = resolve(macosRoot, "..");
const preset = join(macosRoot, "presets", "preset-miku-love-words");
const background = join(preset, "background.png");
const sideChatBackground = join(preset, "side-chat-background.png");

const sha256 = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

const payload = await loadPayload(preset);
assert.equal(payload.theme.id, "preset-miku-love-words");
assert.equal(payload.theme.image, "background.png");
assert.equal(payload.theme.sideChatImage, "side-chat-background.png");
assert.deepEqual(payload.theme.projectIcons, {});
assert.equal(payload.theme.artMetadata.width, 1672);
assert.equal(payload.theme.artMetadata.height, 941);
assert.equal(payload.theme.sideChatArtMetadata.width, 1200);
assert.equal(payload.theme.sideChatArtMetadata.height, 1200);
assert.equal(
  sha256(background),
  "09147b7c58da8aa4e25e43fdb1ebe4a66024ed557e5c7b8ceda582b61b237d33",
);
assert.equal(
  sha256(sideChatBackground),
  "488380702789ae08c005097153baf025c534cb04763b64bacf32ec6391837298",
);
assert.equal(existsSync(join(preset, "love-words-v-official.jpg")), false);

const readme = readFileSync(join(repositoryRoot, "README.md"), "utf8");
const englishReadme = readFileSync(join(repositoryRoot, "README.en.md"), "utf8");
for (const expectedPath of [
  "macos/presets/preset-miku-love-words/background.png",
  "macos/presets/preset-miku-love-words/side-chat-background.png",
  "macos/assets/miku-codex-app-icon.svg",
  "macos/assets/miku-love-words-icons.svg",
  "docs/images/miku-svg-system.svg",
]) {
  assert.match(readme, new RegExp(expectedPath.replaceAll("/", "\\/")));
  assert.match(englishReadme, new RegExp(expectedPath.replaceAll("/", "\\/")));
}
assert.doesNotMatch(readme, /角色背景不随公开源码分发/);
assert.doesNotMatch(englishReadme, /character background is not distributed/i);

console.log("PASS: public MIKU preset ships both backgrounds and discoverable SVG sources.");
