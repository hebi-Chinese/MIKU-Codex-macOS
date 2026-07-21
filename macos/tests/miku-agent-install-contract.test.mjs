import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MIKU_INSTALL_CONTRACT,
  RENDERER_RECONCILIATION_CONTRACT,
  meetsMikuInstallContract,
} from "../scripts/injector.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const macosRoot = path.resolve(here, "..");
const repoRoot = path.resolve(macosRoot, "..");
const read = (relativePath) => fs.readFile(path.join(repoRoot, relativePath), "utf8");
const readBytes = (relativePath) => fs.readFile(path.join(repoRoot, relativePath));

const [
  agents,
  readme,
  readmeEnglish,
  macosReadme,
  deployPrompt,
  deliveryPrompt,
  deliveryGuide,
  changelog,
  buildClientSource,
  injectorSource,
  skillGuide,
] = await Promise.all([
  read("AGENTS.md"),
  read("README.md"),
  read("README.en.md"),
  read("macos/README.md"),
  read("macos/CLIENT_DEPLOY_PROMPT.md"),
  read("macos/client-delivery/给 Codex 的部署提示词.md"),
  read("macos/client-delivery/使用说明.txt"),
  read("macos/CHANGELOG.md"),
  read("macos/scripts/build-client-release.sh"),
  read("macos/scripts/injector.mjs"),
  read("macos/SKILL.md"),
]);

assert.equal(
  deployPrompt,
  deliveryPrompt,
  "The repository and client-delivery Agent prompts must stay byte-identical.",
);

for (const [label, content] of [
  ["AGENTS.md", agents],
  ["README.md", readme],
  ["README.en.md", readmeEnglish],
  ["macos/CLIENT_DEPLOY_PROMPT.md", deployPrompt],
]) {
  assert.match(content, /hebi-Chinese\/MIKU-Codex-macOS/, `${label} must name the product repository.`);
  assert.match(content, /preset-miku-love-words/, `${label} must select the complete MIKU preset.`);
  assert.match(content, /MIKU Codex\.app/, `${label} must require the persistent MIKU launcher.`);
  assert.match(content, /miku-native-v2-2026-07-20\.6/, `${label} must name the current install contract.`);
}

assert.match(agents, /## MIKU Public Install Contract/);
assert.match(agents, /git pull --ff-only/);
assert.match(agents, /git ls-remote/);
assert.match(agents, /不得.*reset|must not.*reset/i);
assert.match(agents, /随心输入/);
assert.match(agents, /灵感迸发/);
assert.match(agents, /全开舞台/);
assert.match(agents, /56/);
assert.match(agents, /MIKU Love Words Script/);
assert.match(agents, /Ma Shan Zheng/);
assert.match(agents, /permissionArtTypographyPass/);
assert.match(agents, /artLayerPresent/);
assert.match(agents, /artLayerPosition/);
assert.match(agents, /sideChatArtLoaded/);
assert.match(agents, /sideChatPanelCoveragePass/);
assert.match(agents, /《爱言叶 V》官方 MV 插画.*右侧聊天栏.*侧边任务背景图/s);
assert.match(agents, /用户.*本机.*绝对路径/s);
assert.match(agents, /configure-miku-side-chat-macos\.sh/);
assert.match(agents, /all nine `cmp` checks/);
assert.match(agents, /stream-safe-v2/);

assert.match(readme, /## 交给 Codex Agent 安装/);
assert.match(readme, /完整阅读.*AGENTS\.md/);
assert.match(readmeEnglish, /## Install with a Codex Agent/);
assert.match(macosReadme, /完整的 MIKU 安装流程.*根目录.*AGENTS\.md/);

assert.match(deployPrompt, /MIKU Codex for macOS｜Agent 部署提示词/);
assert.match(deployPrompt, /git pull --ff-only/);
assert.match(deployPrompt, /git clone --branch main --single-branch/);
assert.match(deployPrompt, /cmp/);
assert.match(deployPrompt, /doctor-macos\.sh"? --require-live/);
assert.match(deployPrompt, /verify-dream-skin-macos\.sh/);
assert.match(deployPrompt, /15 条/);
assert.match(deployPrompt, /4 组/);
assert.match(deployPrompt, /56 个/);
assert.match(deployPrompt, /《爱言叶 V》官方 MV 插画.*右侧聊天栏.*侧边任务背景图/s);
assert.match(deployPrompt, /configure-miku-side-chat-macos\.sh/);
assert.match(deployPrompt, /九条 cmp/);
assert.match(deployPrompt, /cmp assets\/renderer-inject\.js/);
assert.match(deployPrompt, /stream-safe-v2/);
assert.match(deployPrompt, /Ma Shan Zheng/);
assert.match(deployPrompt, /artLayerPresent/);
assert.match(deployPrompt, /artLayerPosition/);
assert.match(deployPrompt, /cmp scripts\/configure-miku-side-chat-macos\.sh/);
assert.match(deployPrompt, /cmp scripts\/configure-miku-side-chat\.mjs/);
assert.match(deployPrompt, /不得.*自动下载|禁止.*自动下载/s);
assert.doesNotMatch(deployPrompt, /项目自带的示例主题/);
assert.doesNotMatch(deployPrompt, /桌面四个入口|以下四个入口/);

assert.match(deliveryGuide, /MIKU Codex for macOS 1\.3\.6/);
assert.match(deliveryGuide, /MIKU Codex\.app/);
assert.doesNotMatch(deliveryGuide, /四个入口/);
assert.match(changelog, /## 1\.3\.6 — 2026-07-20/);
assert.match(buildClientSource, /--no-launchers --no-launch/);
assert.match(buildClientSource, /install-miku-launcher-macos\.sh/);
assert.match(buildClientSource, /preset-miku-love-words --no-apply/);
assert.match(injectorSource, /mikuContractRequired/);
assert.match(injectorSource, /mikuContractPass/);
assert.match(
  injectorSource,
  /reconciliationContract:\s*RENDERER_RECONCILIATION_CONTRACT/,
  "Static payload checks must expose the renderer reconciliation contract.",
);
assert.match(injectorSource, /iconSymbolCount >= 56/);
assert.match(skillGuide, /miku-native-v2-2026-07-20\.6/);
assert.match(skillGuide, /preset-miku-love-words/);
assert.match(skillGuide, /随心输入/);
assert.match(skillGuide, /灵感迸发/);
assert.match(skillGuide, /《爱言叶 V》官方 MV 插画.*右侧聊天栏.*侧边任务背景图/s);

for (const relativePath of [
  "macos/VERSION",
  "macos/package.json",
  "macos/scripts/common-macos.sh",
  "macos/scripts/injector.mjs",
  "macos/scripts/build-client-release.sh",
]) {
  assert.match(await read(relativePath), /1\.3\.6/, `${relativePath} must publish version 1.3.6.`);
}

const artFont = await readBytes("macos/assets/fonts/miku-love-words-script.woff2");
assert.equal(artFont.subarray(0, 4).toString("ascii"), "wOF2");
assert.ok(artFont.length > 1000 && artFont.length < 2 * 1024 * 1024);
assert.match(await read("macos/assets/fonts/OFL.txt"), /SIL OPEN FONT LICENSE Version 1\.1/);
assert.match(await read("macos/assets/fonts/OFL.txt"), /Copyright 2018 The Ma Shan Zheng Project Authors/);
assert.match(await read("macos/assets/fonts/README.md"), /Ma Shan Zheng/);

assert.equal(MIKU_INSTALL_CONTRACT, "miku-native-v2-2026-07-20.6");
assert.equal(RENDERER_RECONCILIATION_CONTRACT, "stream-safe-v2");
const completeMikuReport = Object.freeze({
  installed: true,
  contractVersion: MIKU_INSTALL_CONTRACT,
  reconciliationContract: RENDERER_RECONCILIATION_CONTRACT,
  artLayerPresent: true,
  artLayerPosition: "fixed",
  supportPhraseCatalogCount: 15,
  permissionPresentationCount: 4,
  iconSymbolCount: 56,
  permissionArtTypographyPass: true,
  artTypographyPass: true,
  sideChatImageConfigured: true,
  sideChatArtLoaded: true,
  sideChatPanelCoveragePass: true,
});
assert.equal(meetsMikuInstallContract(completeMikuReport), true);
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  reconciliationContract: null,
}), false, "A renderer without stream-safe reconciliation must fail live verification.");
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  artLayerPresent: false,
}), false, "A renderer without the persistent art layer must fail live verification.");
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  iconSymbolCount: 55,
}), false, "A partial or stale SVG sprite must fail live verification.");
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  artTypographyPass: false,
}), false, "An install that falls back to an ordinary UI font must fail live verification.");
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  sideChatArtLoaded: false,
}), false, "A white side-chat panel without its configured artwork must fail live verification.");
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  sideChatPanelCoveragePass: false,
}), false, "An unthemed open side-chat panel must fail live verification.");
assert.equal(meetsMikuInstallContract({
  ...completeMikuReport,
  installed: false,
}), false, "A wallpaper-only install must never pass the MIKU contract.");

console.log("miku-agent-install-contract.test.mjs: ok");
