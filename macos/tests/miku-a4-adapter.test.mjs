import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { loadPayload } from "../scripts/injector.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const source = await fs.readFile(
  path.resolve(here, "..", "assets", "miku-a4-adapter.js"),
  "utf8",
);
const cssSource = await fs.readFile(
  path.resolve(here, "..", "assets", "miku-a4.css"),
  "utf8",
);
const iconSource = await fs.readFile(
  path.resolve(here, "..", "assets", "miku-love-words-icons.svg"),
  "utf8",
);
const artGlyphSource = await fs.readFile(
  path.resolve(here, "..", "assets", "fonts", "glyphs.txt"),
  "utf8",
);
const fixtureWindow = {};
vm.runInNewContext(source, { window: fixtureWindow });

const factory = fixtureWindow.__CODEX_DREAM_MIKU_A4_FACTORY__;
assert.equal(typeof factory, "function", "The browser payload must expose the A4 adapter factory.");
assert.equal(typeof factory.model?.projectRecipeFor, "function");
assert.equal(typeof factory.model?.taskWindowsFor, "function");
assert.equal(typeof factory.model?.chooseSupportPhrase, "function");
assert.equal(
  factory.model?.installContract,
  "miku-native-v2-2026-07-20.4",
  "The installed adapter needs a stable public-install contract identifier.",
);
assert.equal(factory.model?.supportPhraseCatalogCount, 15);
assert.equal(factory.model?.permissionPresentationCount, 4);
assert.equal(factory.model?.minimumIconSymbolCount, 56);
const requiredArtCopy = [
  ...factory.model.supportPresentations.flatMap(({ text, face, tail }) => [text, face, tail]),
  ...factory.model.permissionPresentations.flat(),
  ...factory.model.composerPermissionPresentations.flat(),
  "灵感启发",
  "灵感迸发",
].join("");
for (const character of new Set(requiredArtCopy)) {
  if (!/[\u3400-\u9fff]/u.test(character)) continue;
  assert.ok(
    artGlyphSource.includes(character),
    `The bundled art-font subset must declare the live CJK character ${character}.`,
  );
}

assert.deepEqual(
  [...factory.model.sidebarActionIcons].map((item) => [...item]),
  [
    ["新建任务", "dream-icon-nav-new-task"],
    ["拉取请求", "dream-icon-nav-pull-request"],
    ["站点", "dream-icon-nav-sites"],
    ["已安排", "dream-icon-nav-scheduled"],
    ["插件", "dream-icon-nav-plugins"],
  ],
  "The five native product entries need stable MIKU SVG recipes.",
);
assert.deepEqual(
  [...factory.model.environmentActionIcons],
  [
    "dream-icon-env-changes",
    "dream-icon-env-local",
    "dream-icon-env-branch",
    "dream-icon-env-publish",
  ],
  "The four environment rows need order-stable SVG recipes inside the native summary section.",
);
assert.deepEqual(
  [...factory.model.homeCapabilityIcons].map((item) => [...item]),
  [
    ["探索并理解代码", "dream-icon-home-explore"],
    ["构建新功能、应用或工具", "dream-icon-home-build"],
    ["审查代码并提出修改建议", "dream-icon-home-review"],
    ["修复问题和失败", "dream-icon-home-repair"],
  ],
  "The four real home capabilities need label-bound SVG recipes.",
);
assert.deepEqual(
  { ...factory.model.homeUtilityIcons },
  {
    project: "dream-icon-composer-project",
    local: "dream-icon-composer-local",
    branch: "dream-icon-composer-branch",
    inspiration: "dream-icon-inspiration",
  },
  "The native home utility bar needs stable project-context SVG recipes.",
);
assert.deepEqual(
  { ...factory.model.composerControlIcons },
  {
    add: "dream-icon-composer-add",
    model: "dream-icon-composer-model",
    microphone: "dream-icon-composer-mic",
    send: "dream-icon-composer-send",
    stop: "dream-icon-composer-stop",
  },
  "Every native composer state, including interrupt, needs a semantic MIKU SVG recipe.",
);
assert.deepEqual(
  { ...factory.model.shellControlIcons },
  {
    search: "dream-icon-shell-search",
    help: "dream-icon-shell-help",
    sidebarToggle: "dream-icon-shell-sidebar-toggle",
    bottomPanelToggle: "dream-icon-shell-bottom-panel-toggle",
    panelExpand: "dream-icon-shell-panel-expand",
  },
  "Verified shell controls need stable SVG recipes instead of a generic unknown-icon rewrite.",
);
assert.deepEqual(
  [...factory.model.rightPanelActionIcons].map((item) => [...item]),
  [
    ["审阅", "dream-icon-right-review"],
    ["终端", "dream-icon-right-terminal"],
    ["浏览器", "dream-icon-right-browser"],
    ["文件", "dream-icon-right-files"],
    ["侧边任务", "dream-icon-right-side-task"],
  ],
  "Every native right-workspace entry needs one label-bound MIKU SVG recipe.",
);
assert.deepEqual(
  { ...factory.model.modelSpeedIcons },
  {
    快速: "dream-icon-speed-fast",
    标准: "dream-icon-speed-standard",
  },
  "Fast and standard must remain distinct model-speed states.",
);
assert.deepEqual(
  [...factory.model.permissionDescriptions].map((item) => [...item]),
  [
    ["请求批准", "每一步先对拍，再让旋律继续 ♪"],
    ["替我审批", "只在风险变奏处举起应援灯 ☆"],
    ["完全访问权限", "全开舞台模式，也要看清边界 01"],
    ["自定义", "按你的 config.toml 谱面演奏 ～"],
  ],
  "Permission theming must replace only the visual description with the approved support line.",
);
assert.deepEqual(
  [...factory.model.permissionPresentations].map((item) => [...item]),
  [
    ["请求批准", "逐拍确认 · 请求批准", "每一步先对拍，再让旋律继续 ♪", "dream-icon-permission-request"],
    ["替我审批", "风险变奏 · 替我审批", "只在风险变奏处举起应援灯 ☆", "dream-icon-permission-agent"],
    ["完全访问权限", "全开舞台 · 完全访问", "全开舞台模式，也要看清边界 01", "dream-icon-permission-full"],
    ["自定义", "自定义谱面 · 自定义", "按你的 config.toml 谱面演奏 ～", "dream-icon-permission-custom"],
  ],
  "Each permission needs its own themed title, support line, and semantic SVG recipe.",
);
assert.deepEqual(
  [...factory.model.composerPermissionPresentations].map((item) => [...item]),
  [
    ["请求批准", "逐拍确认", "dream-icon-permission-request"],
    ["替我审批", "风险变奏", "dream-icon-permission-agent"],
    ["完全访问", "全开舞台", "dream-icon-permission-full"],
    ["自定义", "自定义谱面", "dream-icon-permission-custom"],
  ],
  "The composer permission trigger needs compact themed labels without changing permission state.",
);
for (const symbolId of [
  ...factory.model.sidebarActionIcons.map(([, symbolId]) => symbolId),
  ...factory.model.environmentActionIcons,
  ...factory.model.homeCapabilityIcons.map(([, symbolId]) => symbolId),
  ...Object.values(factory.model.homeUtilityIcons),
  ...Object.values(factory.model.composerControlIcons),
  ...Object.values(factory.model.shellControlIcons),
  ...factory.model.rightPanelActionIcons.map(([, symbolId]) => symbolId),
  ...Object.values(factory.model.modelSpeedIcons),
  ...factory.model.permissionPresentations.map((item) => item[3]),
]) {
  assert.match(iconSource, new RegExp(`<symbol id="${symbolId}"`));
}

const supportPhrases = [...factory.model.supportPhrases];
assert.equal(supportPhrases.length, 15, "The MIKU theme needs exactly 15 support phrases.");
assert.equal(new Set(supportPhrases).size, 15, "Support phrases must remain unique.");
assert.ok(
  supportPhrases.every((phrase) => phrase.length <= 24),
  "Support phrases must fit the native compact composer without becoming mini paragraphs.",
);
assert.equal(factory.model.chooseSupportPhrase(null, 0), supportPhrases[0]);
assert.notEqual(
  factory.model.chooseSupportPhrase(supportPhrases[0], 0),
  supportPhrases[0],
  "Random rotation must not immediately repeat the visible phrase.",
);

const supportPresentations = [...factory.model.supportPresentations];
assert.equal(supportPresentations.length, 15, "Every support phrase needs one fixed visual recipe.");
assert.deepEqual(
  [...supportPresentations].map((item) => item.text),
  supportPhrases,
  "Visual recipes must preserve the approved support-phrase order and wording.",
);
assert.equal(
  supportPresentations.filter((item) => item.emblem === "pocket").length,
  4,
  "Exactly four keepsake/gratitude phrases should reuse the existing pocket SVG.",
);
assert.ok(
  supportPresentations.every((item) =>
    item.tail.length === 2 && ["mint", "coral", "pink", "yellow"].includes(item.tone)),
  "Every visual recipe needs a two-symbol tail and an approved MIKU color tone.",
);

const recipes = {
  "project://system-build": "system-grid",
  "project://music-tools": "wave-note",
};
assert.equal(factory.model.projectRecipeFor("project://system-build", recipes), "system-grid");
assert.equal(factory.model.projectRecipeFor("project://unknown", recipes), "neutral-folder");

assert.doesNotMatch(source, /codex-dream-miku-a4/,
  "The native-v2 adapter must not create a second full-window MIKU stage.");
assert.doesNotMatch(source, /ensureRoot|dream-miku-a4-heading|dream-miku-a4-prompts/,
  "The native-v2 adapter must not duplicate the native hero or composer hierarchy.");
assert.match(source, /aside\.app-shell-left-panel/,
  "Sidebar theming must start from the exact native Codex shell.");
assert.match(source, /button\[aria-label\^="切换模式"\]/,
  "The visual brand must bind to the native mode switch instead of adding a fake header.");
assert.match(source, /data-app-action-sidebar-section-heading/,
  "Section accents must bind to native semantic sidebar sections.");
assert.match(source, /aria-label="打开个人资料菜单"/,
  "The account boundary must remain the native profile control.");
assert.match(source, /data-app-shell-focus-area="right-panel"/,
  "Side-chat theming must start from the exact native right-panel boundary.");
assert.match(source, /data-app-shell-tab-panel-controller="right"\]\[data-tab-id\^="sidechat:"\]/,
  "The adapter must distinguish a side-chat tab from the environment summary panel.");
assert.match(
  source,
  /querySelectorAll\(\s*['"]\[data-app-shell-tab-panel-controller="right"\]\[data-tab-id\^="sidechat:"\]['"]\s*,?\s*\)/,
  "Every live side-chat panel must be collected instead of theming only the first one.",
);
assert.match(source, /aria-label\^="速度 "/,
  "The model-speed decoration must bind to the native accessible speed row.");
assert.match(source, /dream-miku-permission-visual-description/,
  "Permission flavor copy must replace the visual description without adding a third line.");
assert.match(source, /dream-miku-permission-native-description/,
  "The native risk description must remain in the DOM and accessibility tree.");
assert.match(source, /dream-miku-permission-visual-title/,
  "The approved themed permission title must replace the native title visually.");
assert.match(source, /dream-miku-permission-native-title/,
  "The native permission title must remain in the DOM and accessibility tree.");
assert.match(source, /dream-miku-permission-native-icon/,
  "The verified native leading glyph needs a precise restoration marker.");
assert.match(source, /:scope > div > svg:first-of-type/,
  "Only the leading permission glyph may be replaced; the selected-state check must survive.");
assert.match(source, /data-composer-navigation-target="permissions"/,
  "The composer permission replacement must bind to the exact native permission trigger.");
assert.match(source, /data-tooltip-overflow-target="true"/,
  "The visual short label must bind to the native current-permission label, not rewrite the button.");
assert.match(source, /dream-miku-composer-permission-native-label/,
  "The native permission label must remain in the DOM and accessibility tree.");
assert.match(source, /dream-miku-composer-permission-visual-label/,
  "The composer permission trigger needs an aria-hidden themed short label.");
assert.match(source, /dream-miku-composer-permission-icon/,
  "The composer permission trigger needs its matching MIKU SVG.");
assert.doesNotMatch(source, /dream-miku-permission-caption/,
  "The obsolete bottom permission caption must be removed.");
assert.match(source, /button\[aria-label="打开帮助菜单"\]/,
  "The help icon must bind to the exact native control.");
assert.match(source, /button\[aria-label="显示\/隐藏侧边栏"\]/,
  "Both native sidebar-toggle controls must use the same semantic recipe.");
assert.match(source, /button\[aria-label="隐藏边栏"\]/,
  "Route-specific sidebar-collapse labels must share the themed toggle recipe.");
assert.match(source, /button\[aria-label="显示边栏"\]/,
  "The collapsed sidebar state must retain the themed toggle recipe.");
assert.match(source, /button\[aria-label="切换底部面板显示"\]/,
  "The native bottom-panel toggle needs its own semantic MIKU recipe.");
assert.match(source, /button\[aria-label="停止"\]/,
  "The running composer interrupt state needs an explicit semantic target.");
assert.match(source, /dream-miku-right-workspace/,
  "Right-panel theming must start at the native workspace boundary even before side chat opens.");
assert.match(source, /text\.startsWith\(label\)/,
  "Right-panel launcher labels must tolerate shortcut text being concatenated without whitespace.");

const allTasks = [
  { label: "继续重构 MIKU 皮肤结构", source: { id: "task-1" }, projectKey: "project://system-build" },
  { label: "定位 Codex 换肤源码", source: { id: "task-2" }, projectKey: "project://system-build" },
  { label: "查询 Codex 使用额度", source: { id: "task-3" }, projectKey: "project://finance" },
  { label: "继续重构 MIKU 皮肤结构", source: { id: "duplicate" }, projectKey: "project://system-build" },
];

const projectTasks = factory.model.taskWindowsFor(allTasks, {
  context: "project",
  projectKey: "project://system-build",
  limit: 6,
});
assert.deepEqual(
  [...projectTasks].map((item) => item.label),
  ["继续重构 MIKU 皮肤结构", "定位 Codex 换肤源码"],
  "Project context must filter and deduplicate real task windows without rewriting their titles.",
);
assert.equal(projectTasks[0].source.id, "task-1", "The adapter must retain the real native task target.");

const globalTasks = factory.model.taskWindowsFor(allTasks, {
  context: "global",
  projectKey: null,
  limit: 2,
});
assert.deepEqual(
  [...globalTasks].map((item) => item.label),
  ["继续重构 MIKU 皮肤结构", "定位 Codex 换肤源码"],
);

assert.deepEqual(
  [...factory.model.taskWindowsFor(allTasks, {
    context: "project",
    projectKey: "project://missing",
    limit: 6,
  })],
  [],
  "A project-scoped inspiration library must not leak unrelated global tasks when the project is empty.",
);

const makeClassList = () => {
  const values = new Set();
  return {
    add(...names) { for (const name of names) values.add(name); },
    remove(...names) { for (const name of names) values.delete(name); },
    toggle(name, force) {
      if (force === true) values.add(name);
      else if (force === false) values.delete(name);
      else if (values.has(name)) values.delete(name);
      else values.add(name);
      return values.has(name);
    },
    contains(name) { return values.has(name); },
  };
};

const makeAttributeNode = (initialAttributes = {}) => {
  const attributes = new Map(Object.entries(initialAttributes));
  const styles = new Map();
  const children = [];
  return {
    children,
    isConnected: true,
    hidden: false,
    classList: makeClassList(),
    style: {
      getPropertyValue(name) { return styles.get(name) ?? ""; },
      setProperty(name, value) { styles.set(name, String(value)); },
      removeProperty(name) { styles.delete(name); },
    },
    getAttribute(name) { return attributes.get(name) ?? null; },
    hasAttribute(name) { return attributes.has(name); },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    removeAttribute(name) { attributes.delete(name); },
    prepend(node) {
      children.unshift(node);
      node.parentElement = this;
    },
    remove() {
      if (!this.parentElement?.children) return;
      const index = this.parentElement.children.indexOf(this);
      if (index >= 0) this.parentElement.children.splice(index, 1);
      this.parentElement = null;
    },
  };
};

const placeholder = makeAttributeNode({ "data-placeholder": "随心输入" });
const editor = makeAttributeNode({ contenteditable: "true", "data-codex-composer": "true" });
editor.textContent = "";
editor.contains = (node) => node === editor;
const composer = makeAttributeNode();
composer.matches = () => false;
composer.querySelector = (selector) => {
  if (selector.includes("data-codex-composer")) return editor;
  if (selector.includes("p.placeholder")) return placeholder;
  if (selector.includes("dream-miku-support-emblem")) {
    return composer.children.find((node) => node.className === "dream-miku-support-emblem") || null;
  }
  return null;
};
const shellMain = {
  querySelector(selector) {
    return selector.includes('data-thread-scroll-footer="true"') ? composer : null;
  },
};
const sidePlaceholder = makeAttributeNode({ "data-placeholder": "随心输入" });
const sideEditor = makeAttributeNode({ contenteditable: "true", "data-codex-composer": "true" });
sideEditor.textContent = "";
sideEditor.contains = (node) => node === sideEditor;
const sideComposer = makeAttributeNode();
sideComposer.matches = () => false;
sideComposer.querySelector = (selector) => {
  if (selector.includes("data-codex-composer")) return sideEditor;
  if (selector.includes("p.placeholder")) return sidePlaceholder;
  if (selector.includes("dream-miku-support-emblem")) {
    return sideComposer.children.find((node) => node.className === "dream-miku-support-emblem") || null;
  }
  return null;
};
const makeActionButton = (label, { trailingIcon = false } = {}) => {
  const button = makeAttributeNode();
  button.textContent = label;
  button.className = "native-action";
  const nativeIcon = makeAttributeNode();
  nativeIcon.tagName = "SVG";
  nativeIcon.parentElement = button;
  button.children.push(nativeIcon);
  let trailing = null;
  if (trailingIcon) {
    trailing = makeAttributeNode();
    trailing.tagName = "SVG";
    trailing.parentElement = button;
    button.children.push(trailing);
  }
  return { button, nativeIcon, trailing };
};
const sidebarActions = new Map(factory.model.sidebarActionIcons.map(([label]) => [
  label,
  makeActionButton(label),
]));
const sidebar = makeAttributeNode();
sidebar.className = "app-shell-left-panel";
sidebar.querySelector = () => null;
sidebar.querySelectorAll = (selector) => selector === "button"
  ? [...sidebarActions.values()].map(({ button }) => button)
  : [];
for (const { button } of sidebarActions.values()) {
  const row = makeAttributeNode();
  row.className = "h-[var(--height-token-row)]";
  row.parentElement = sidebar;
  button.parentElement = row;
}
const environmentActions = factory.model.environmentActionIcons.map((_, index) =>
  makeActionButton(`environment-${index}`, { trailingIcon: index === 1 || index === 2 }));
environmentActions.forEach(({ button }) => {
  button.className = "group/summary-panel-item";
});
const environmentCard = makeAttributeNode();
const environmentScroll = makeAttributeNode();
const environmentSection = makeAttributeNode();
environmentSection.parentElement = environmentScroll;
environmentScroll.parentElement = environmentCard;
environmentSection.querySelectorAll = (selector) => selector === "button"
  ? environmentActions.map(({ button }) => button)
  : [];
const environmentRoot = makeAttributeNode();
environmentRoot.querySelector = (selector) => selector === "section" ? environmentSection : null;
let environmentRootVisible = true;
let sideChatPanel = null;
const fixtureRoot = makeAttributeNode();
const timers = new Map();
let nextTimer = 0;
const composerDocument = {
  activeElement: null,
  hidden: false,
  documentElement: fixtureRoot,
  fonts: {
    check(font) { return font.includes("MIKU Love Words Script"); },
  },
  querySelector(selector) {
    if (selector === "aside.app-shell-left-panel") return sidebar;
    if (selector.includes('data-pip-obstacle="thread-summary-panel"')) {
      return environmentRootVisible ? environmentRoot : null;
    }
    return selector.includes('data-tab-id^="sidechat:"') ? sideChatPanel : null;
  },
  querySelectorAll(selector) {
    if (selector === ".dream-miku-side-chat-panel") {
      return sideChatPanel?.classList?.contains("dream-miku-side-chat-panel")
        ? [sideChatPanel]
        : [];
    }
    return selector.includes('data-tab-id^="sidechat:"') && sideChatPanel
      ? [sideChatPanel]
      : [];
  },
  createElement() { return makeAttributeNode(); },
};
const reducedMotionListeners = new Set();
let prefersReducedMotion = false;
const reducedMotionQuery = {
  get matches() { return prefersReducedMotion; },
  addEventListener(_name, listener) { reducedMotionListeners.add(listener); },
  removeEventListener(_name, listener) { reducedMotionListeners.delete(listener); },
};
const composerWindow = {
  getComputedStyle(_node, pseudo) {
    return {
      fontFamily: pseudo === "::after"
        ? '"MIKU Love Words Script", "HanziPen SC", sans-serif'
        : '-apple-system, "PingFang SC", sans-serif',
    };
  },
  matchMedia() { return reducedMotionQuery; },
  setInterval(callback, delay) {
    const id = ++nextTimer;
    timers.set(id, { callback, delay });
    return id;
  },
  clearInterval(id) { timers.delete(id); },
};
let supportRandom = 0;
const composerAdapter = factory({
  document: composerDocument,
  window: composerWindow,
  random: () => supportRandom,
});
composerDocument.activeElement = editor;
composerAdapter.sync({ shellMain });
for (const [label, symbolId] of factory.model.sidebarActionIcons) {
  const { button, nativeIcon } = sidebarActions.get(label);
  const themedIcons = button.children.filter((node) =>
    node.classList.contains("dream-miku-action-icon"));
  assert.equal(themedIcons.length, 1, `${label} should receive exactly one themed SVG.`);
  assert.match(themedIcons[0].innerHTML, new RegExp(symbolId));
  assert.equal(themedIcons[0].getAttribute("aria-hidden"), "true");
  assert.equal(nativeIcon.classList.contains("dream-miku-native-action-icon"), true);
}
environmentActions.forEach(({ button, nativeIcon, trailing }, index) => {
  const themedIcons = button.children.filter((node) =>
    node.classList.contains("dream-miku-action-icon"));
  assert.equal(themedIcons.length, 1, `Environment row ${index + 1} needs one themed SVG.`);
  assert.match(themedIcons[0].innerHTML, new RegExp(factory.model.environmentActionIcons[index]));
  assert.equal(nativeIcon.classList.contains("dream-miku-native-action-icon"), true);
  if (trailing) assert.equal(trailing.classList.contains("dream-miku-native-action-icon"), false);
});
assert.equal(environmentCard.classList.contains("dream-miku-context-panel"), true);
environmentRootVisible = false;
composerAdapter.sync({ shellMain });
for (const { button, nativeIcon, trailing } of environmentActions) {
  assert.equal(button.children.some((node) =>
    node.classList.contains("dream-miku-action-icon")), false);
  assert.equal(nativeIcon.classList.contains("dream-miku-native-action-icon"), false);
  if (trailing) assert.equal(trailing.classList.contains("dream-miku-native-action-icon"), false);
}
assert.equal(environmentCard.classList.contains("dream-miku-context-panel"), false);
environmentRootVisible = true;
composerAdapter.sync({ shellMain });
environmentActions.forEach(({ button, nativeIcon, trailing }, index) => {
  const themedIcons = button.children.filter((node) =>
    node.classList.contains("dream-miku-action-icon"));
  assert.equal(themedIcons.length, 1, `Environment row ${index + 1} must rehydrate once.`);
  assert.match(themedIcons[0].innerHTML, new RegExp(factory.model.environmentActionIcons[index]));
  assert.equal(nativeIcon.classList.contains("dream-miku-native-action-icon"), true);
  if (trailing) assert.equal(trailing.classList.contains("dream-miku-native-action-icon"), false);
});
assert.equal(environmentCard.classList.contains("dream-miku-context-panel"), true);
assert.equal(placeholder.getAttribute("data-placeholder"), "随心输入");
assert.equal(composer.getAttribute("data-dream-miku-support-phrase"), "true");
assert.ok(supportPhrases.includes(editor.getAttribute("aria-placeholder")));
assert.equal(
  editor.getAttribute("aria-placeholder"),
  supportPhrases[0],
  "An auto-focused empty composer must still receive its initial support phrase.",
);
assert.equal(
  composer.style.getPropertyValue("--dream-miku-support-face"),
  JSON.stringify(supportPresentations[0].face),
);
assert.equal(
  composer.style.getPropertyValue("--dream-miku-support-tail"),
  JSON.stringify(supportPresentations[0].tail),
);
assert.equal(composer.getAttribute("data-dream-miku-support-tone"), "mint");
assert.equal(composer.getAttribute("data-dream-miku-support-emblem"), "none");
assert.equal(editor.textContent, "", "Applying a phrase must not write into ProseMirror content.");
const composerVerification = composerAdapter.verify();
assert.equal(composerVerification.contractVersion, "miku-native-v2-2026-07-20.4");
assert.equal(composerVerification.supportPhraseCatalogCount, 15);
assert.equal(composerVerification.permissionPresentationCount, 4);
assert.equal(composerVerification.iconSymbolCount, 0, "The fixture deliberately omits the live sprite.");
assert.equal(composerVerification.supportPhraseCount, 1);
assert.equal(composerVerification.supportPhraseRotation, "running");
assert.equal(composerVerification.artTypographyPass, true);
assert.equal(composerVerification.permissionArtTypographyPass, true);
assert.equal(composerVerification.artFontFamily, "MIKU Love Words Script");
assert.equal(composerVerification.sideChatPanelCoveragePass, true);
assert.equal(timers.size, 1, "The adapter should use one shared rotation timer.");
assert.equal(reducedMotionListeners.size, 1);
const visiblePhrase = editor.getAttribute("aria-placeholder");
sideChatPanel = makeAttributeNode();
sideChatPanel.querySelector = () => sideComposer;
sideChatPanel.closest = () => null;
sideChatPanel.classList.add("dream-miku-side-chat-panel");
composerAdapter.sync({ shellMain });
assert.equal(sideEditor.getAttribute("aria-placeholder"), visiblePhrase);
assert.equal(timers.size, 1, "Opening side chat must not create a second rotation timer.");
assert.equal(composerAdapter.verify().sideChatPanelCount, 1);
assert.equal(composerAdapter.verify().sideChatThemedPanelCount, 1);
assert.equal(composerAdapter.verify().sideChatPanelCoveragePass, true);
const rotationTimer = [...timers.values()][0];
rotationTimer.callback();
assert.equal(editor.getAttribute("aria-placeholder"), visiblePhrase);
assert.equal(sideEditor.getAttribute("aria-placeholder"), visiblePhrase);
composerDocument.activeElement = null;
supportRandom = 6 / supportPhrases.length;
rotationTimer.callback();
const rotatedPhrase = editor.getAttribute("aria-placeholder");
assert.notEqual(rotatedPhrase, visiblePhrase);
assert.equal(sideEditor.getAttribute("aria-placeholder"), rotatedPhrase);
assert.equal(rotatedPhrase, supportPhrases[6]);
for (const currentComposer of [composer, sideComposer]) {
  const emblem = currentComposer.querySelector(".dream-miku-support-emblem");
  assert.ok(emblem, "Pocket recipes should reuse one decorative emblem in each native composer.");
  assert.equal(emblem.hidden, false);
  assert.equal(emblem.getAttribute("aria-hidden"), "true");
  assert.match(emblem.innerHTML, /dream-icon-project-neutral-folder/);
}
composerDocument.activeElement = editor;
rotationTimer.callback();
assert.equal(editor.getAttribute("aria-placeholder"), rotatedPhrase);
assert.equal(sideEditor.getAttribute("aria-placeholder"), rotatedPhrase);
composerDocument.activeElement = null;
supportRandom = 0;
rotationTimer.callback();
assert.equal(editor.getAttribute("aria-placeholder"), supportPhrases[0]);
for (const currentComposer of [composer, sideComposer]) {
  assert.equal(
    currentComposer.querySelector(".dream-miku-support-emblem")?.hidden,
    true,
    "Moving from a pocket recipe to a kaomoji recipe must hide the decorative SVG.",
  );
}
prefersReducedMotion = true;
for (const listener of reducedMotionListeners) listener({ matches: true });
assert.equal(timers.size, 0);
assert.equal(composerAdapter.verify().supportPhraseRotation, "paused");
prefersReducedMotion = false;
for (const listener of reducedMotionListeners) listener({ matches: false });
assert.equal(timers.size, 1);
editor.textContent = "用户正在输入真实内容";
composerAdapter.sync({ shellMain });
assert.equal(editor.textContent, "用户正在输入真实内容");
assert.equal(editor.hasAttribute("aria-placeholder"), false);
assert.equal(composer.hasAttribute("data-dream-miku-support-phrase"), false);
sideChatPanel = null;
const emptyShellMain = { querySelector: () => null };
composerAdapter.sync({ shellMain: emptyShellMain });
assert.equal(sideComposer.hasAttribute("data-dream-miku-support-phrase"), false);
assert.equal(sideEditor.hasAttribute("aria-placeholder"), false);
assert.equal(sideComposer.querySelector(".dream-miku-support-emblem"), null);
assert.equal(timers.size, 0, "Removing all native composers must release the shared timer.");
assert.equal(reducedMotionListeners.size, 0, "Removing all native composers must release media listeners.");
composerAdapter.cleanup();
for (const { button, nativeIcon } of sidebarActions.values()) {
  assert.equal(button.children.some((node) =>
    node.classList.contains("dream-miku-action-icon")), false);
  assert.equal(nativeIcon.classList.contains("dream-miku-native-action-icon"), false);
}
for (const { button, nativeIcon, trailing } of environmentActions) {
  assert.equal(button.children.some((node) =>
    node.classList.contains("dream-miku-action-icon")), false);
  assert.equal(nativeIcon.classList.contains("dream-miku-native-action-icon"), false);
  if (trailing) assert.equal(trailing.classList.contains("dream-miku-native-action-icon"), false);
}
assert.equal(environmentCard.classList.contains("dream-miku-context-panel"), false);
assert.equal(placeholder.getAttribute("data-placeholder"), "随心输入");
assert.equal(composer.hasAttribute("data-dream-miku-support-phrase"), false);
assert.equal(sideComposer.hasAttribute("data-dream-miku-support-phrase"), false);
assert.equal(composer.style.getPropertyValue("--dream-miku-support-phrase"), "");
assert.equal(sideComposer.style.getPropertyValue("--dream-miku-support-phrase"), "");
assert.equal(composer.style.getPropertyValue("--dream-miku-support-face"), "");
assert.equal(composer.style.getPropertyValue("--dream-miku-support-tail"), "");
assert.equal(composer.hasAttribute("data-dream-miku-support-tone"), false);
assert.equal(composer.hasAttribute("data-dream-miku-support-emblem"), false);
assert.equal(composer.querySelector(".dream-miku-support-emblem"), null);
assert.equal(editor.hasAttribute("aria-placeholder"), false);
assert.equal(timers.size, 0, "Cleanup must cancel support-phrase timers.");
assert.equal(reducedMotionListeners.size, 0);

const productionPayload = await loadPayload(
  path.resolve(here, "..", "presets", "preset-miku-love-words"),
);
assert.match(productionPayload.payload, /data-dream-miku-layout/);
assert.match(productionPayload.payload, /native-v2/);
assert.match(productionPayload.payload, /data-app-action-sidebar-project-row/);
assert.match(productionPayload.payload, /data-sidebar-project-drop-zone/);
assert.doesNotMatch(cssSource, /nav\s+:is\(a,\s*button\)/,
  "The MIKU layer must not change every nested sidebar control.");
assert.doesNotMatch(cssSource, /#codex-dream-miku-a4/,
  "The production CSS must not contain the rejected fixed A4 stage.");
assert.match(cssSource, /dream-miku-sidebar-mode-label::after[\s\S]*content: "Miku Codex"/,
  "The native sidebar needs a visible MIKU identity without rewriting its accessible label.");
assert.match(cssSource, /dream-miku-sidebar-new-task/,
  "The real new-task row should receive the sidebar's primary themed treatment.");
assert.match(
  source,
  /data-pip-obstacle="thread-summary-panel"/,
  "Environment theming must start from Codex's exact thread-summary boundary.",
);
assert.doesNotMatch(
  source,
  /querySelectorAll\(\?"aside\?"\)/,
  "Environment actions must not be inferred from every aside in the renderer.",
);
assert.match(
  cssSource,
  /\.dream-miku-action-icon\s*\{[\s\S]{0,220}width:\s*20px;[\s\S]{0,100}height:\s*20px;[\s\S]{0,180}pointer-events:\s*none;/,
  "Themed native actions need a bounded, non-interactive 20px SVG slot.",
);
assert.match(
  cssSource,
  /\.dream-miku-native-action-icon\s*\{[\s\S]{0,80}display:\s*none !important;/,
  "Only the verified native leading icon should be hidden after its themed replacement exists.",
);
assert.match(cssSource, /dream-miku-side-chat-panel[\s\S]*var\(--dream-miku-side-chat-art, var\(--dream-skin-art\)\)/,
  "The native side chat must use the official side-chat art with a safe primary-art fallback.");
assert.match(cssSource, /background-position: center, center, 42% center/,
  "The side chat needs a stable official-MV crop across native split widths.");
assert.doesNotMatch(
  cssSource,
  /:is\([^)]*dream-miku-side-chat-panel[^)]*\)\s*\{\s*background:\s*transparent\s*!important;/,
  "The transparent inner-chat reset must not erase the side-chat panel art.",
);
assert.match(
  cssSource,
  /dream-miku-right-workspace-surface[\s\S]*var\(--dream-miku-side-chat-art, var\(--dream-skin-art\)\)/,
  "Review, terminal, browser, files, and side-task launchers need a persistent low-opacity art layer.",
);
assert.match(cssSource, /\.dream-miku-permission-visual-description\s*\{/,
  "Permission flavor text needs a readable replacement-description treatment.");
assert.match(cssSource, /\.dream-miku-permission-native-description\s*\{/,
  "The native risk description must stay in the DOM while becoming visually hidden.");
assert.match(cssSource, /\.dream-miku-permission-visual-title\s*\{/,
  "Permission theme titles need their own readable first-line treatment.");
assert.match(cssSource, /\.dream-miku-permission-native-title\s*\{/,
  "Native permission titles must be visually hidden without leaving the accessibility tree.");
assert.match(cssSource, /\.dream-miku-permission-icon\s*\{/,
  "Permission SVG replacements need a stable 20px leading slot.");
assert.match(cssSource, /\.dream-miku-permission-native-icon\s*\{[\s\S]{0,100}display:\s*none !important;/,
  "The native leading glyph must hide only after a themed replacement exists.");
assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*dream-miku-permission-icon/,
  "Permission icon motion must stop when reduced motion is requested.");
assert.match(cssSource, /\.dream-miku-composer-permission-icon\s*\{/,
  "The composer permission SVG needs a stable native-sized slot.");
assert.match(cssSource, /\.dream-miku-composer-permission-native-label\s*\{/,
  "The native composer permission label must be visually hidden without leaving accessibility.");
assert.match(cssSource, /\.dream-miku-composer-permission-visual-label\s*\{/,
  "The compact themed permission label needs its own visual treatment.");
assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*dream-miku-composer-permission-icon/,
  "Composer permission icon motion must stop when reduced motion is requested.");
assert.match(cssSource, /\.dream-miku-composer-stop[\s\S]*animation:/,
  "The interrupt SVG needs a semantic running-state motion treatment.");
assert.match(cssSource, /prefers-reduced-motion:\s*reduce[\s\S]*dream-miku-composer-stop/,
  "Reduced motion must stop the interrupt animation.");
assert.equal(productionPayload.theme.id, "preset-miku-love-words");
assert.equal(productionPayload.theme.sideChatImage, "side-chat-background.png");
assert.equal(productionPayload.theme.sideChatArtMetadata.width, 1200);
assert.equal(productionPayload.theme.sideChatArtMetadata.height, 1200);
assert.match(productionPayload.payload, /--dream-miku-side-chat-art/);
assert.match(productionPayload.payload, /data:font\/woff2;base64,/);
assert.doesNotMatch(productionPayload.payload, /__DREAM_MIKU_ART_FONT_URL__/);
assert.match(
  source,
  /data-thread-scroll-footer=\\?"true\\?"[^\n]*data-codex-composer-root[^\n]*composer-surface-chrome/,
  "The main support phrase must bind to the native primary thread footer composer.",
);
assert.match(
  cssSource,
  /composer-surface-chrome\[data-dream-miku-support-phrase="true"\][\s\S]{0,120}\.ProseMirror p\.placeholder::after\s*\{[\s\S]{0,140}content:\s*var\(--dream-miku-support-phrase\)\s*" "\s*var\(--dream-miku-support-tail\) !important/,
  "The visible phrase must use the native ProseMirror placeholder pseudo-element and outer CSS variable.",
);
assert.match(
  cssSource,
  /p\.placeholder::before\s*\{[\s\S]{0,180}content:\s*var\(--dream-miku-support-face\)[\s\S]{0,180}font-family:\s*var\(--miku-support-face\)/,
  "The native placeholder prefix should render through the bundled art-font token.",
);
assert.match(
  cssSource,
  /p\.placeholder::after\s*\{[\s\S]{0,220}content:\s*var\(--dream-miku-support-phrase\)\s*" "\s*var\(--dream-miku-support-tail\)[\s\S]{0,220}font-family:\s*var\(--miku-support-art\)/,
  "The Chinese phrase and tail should render together through the bundled art-font token.",
);
assert.match(
  cssSource,
  /\.dream-miku-permission-visual-title\s*\{[\s\S]{0,280}font-family:\s*var\(--miku-support-art\)\s*!important;[\s\S]{0,160}font-weight:\s*400;[\s\S]{0,100}font-synthesis:\s*none;/,
  "Permission titles must preserve the real handwriting face instead of synthesizing a system-like bold weight.",
);
assert.match(
  cssSource,
  /\.dream-miku-permission-visual-description\s*\{[\s\S]{0,280}font-family:\s*var\(--miku-support-art\)\s*!important;[\s\S]{0,160}font-weight:\s*400;[\s\S]{0,100}font-synthesis:\s*none;/,
  "Permission descriptions must preserve the bundled handwriting strokes.",
);
assert.match(
  cssSource,
  /p\.placeholder::after\s*\{[\s\S]{0,520}position:\s*static !important;[\s\S]{0,120}inset:\s*auto !important;[\s\S]{0,120}width:\s*auto !important;[\s\S]{0,160}white-space:\s*normal !important;/,
  "The phrase must re-enter inline flow instead of overlapping the kaomoji at the native absolute origin.",
);
assert.match(
  cssSource,
  /data-dream-miku-support-phrase="true"[\s\S]{0,140}p\.placeholder > br\.ProseMirror-trailingBreak\s*\{[\s\S]{0,60}display:\s*none;/,
  "The native empty-paragraph trailing break must not split the kaomoji and phrase onto separate lines.",
);
for (const tone of ["mint", "coral", "pink", "yellow"]) {
  assert.match(
    cssSource,
    new RegExp(`data-dream-miku-support-tone="${tone}"[\\s\\S]{0,180}--miku-support-copy:[\\s\\S]{0,100}--miku-support-accent:`),
    `The ${tone} recipe needs explicit readable copy and accent tokens.`,
  );
}
assert.match(
  cssSource,
  /\.dream-miku-support-emblem\s*\{[\s\S]{0,260}position:\s*absolute[\s\S]{0,260}pointer-events:\s*none/,
  "The reused pocket SVG must remain a decorative overlay outside ProseMirror content.",
);
assert.match(cssSource, /\.dream-miku-support-emblem > svg\s*\{[\s\S]{0,120}width:\s*18px/);
assert.match(
  cssSource,
  /@container thread-content \(max-width:\s*480px\)[\s\S]{0,520}p\.placeholder::before[\s\S]{0,140}font-size:\s*13px[\s\S]{0,260}p\.placeholder::after[\s\S]{0,140}font-size:\s*14\.5px/,
  "Native split composers need a compact art-type scale without changing composer geometry.",
);
assert.match(cssSource, /data-dream-miku-support-phase="odd"[\s\S]{0,180}dream-miku-support-phrase-odd/);
assert.match(cssSource, /data-dream-miku-support-phase="even"[\s\S]{0,180}dream-miku-support-phrase-even/);
assert.match(
  cssSource,
  /data-dream-miku-support-phase="odd"[^\{]*p\.placeholder::before\s*\{[\s\S]{0,120}dream-miku-support-phrase-odd/,
  "Kaomoji should arrive with the phrase instead of continuously animating on its own.",
);
assert.match(
  cssSource,
  /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*p\.placeholder::before[\s\S]*p\.placeholder::after[\s\S]*transition:\s*none !important/,
  "Support-phrase motion must stop under reduced motion.",
);
for (const target of ["workspace-project", "run-location", "branch", "add-context", "reasoning"]) {
  assert.match(
    source,
    new RegExp(`data-composer-navigation-target="${target}"`),
    `The ${target} icon must bind to its exact native composer target.`,
  );
}
assert.match(source, /button\[aria-label="听写"\]/,
  "The microphone replacement must bind to the native dictation label.");
assert.match(source, /button\.bg-token-foreground/,
  "The send replacement must stay inside the native foreground composer action.");
assert.match(
  source,
  /:scope > svg, :scope > \[data-project-selector-icon\]/,
  "The project utility replacement must hide its native icon wrapper instead of leaving a double glyph.",
);
assert.match(source, /data-app-action-sidebar-thread-row/,
  "Inspiration items must be sourced from real native task rows.");
assert.match(source, /signature === inspirationState\.itemSignature/,
  "The inspiration list must be mutation-idempotent instead of rebuilding on every observer pass.");
assert.match(source, /const composerInspirationStates = new Map\(\)/,
  "Every mounted main or side-chat composer needs its own inspiration state.");
assert.match(source, /dream-miku-composer-inspiration/,
  "The empty composer needs a dedicated inspiration trigger rather than a homepage-only control.");
assert.match(source, /灵感迸发/,
  "The per-composer empty-state action must use the approved 灵感迸发 wording.");
assert.match(source, /editor\.addEventListener\?\.\("input", state\.onInput\)/,
  "Composer inspiration visibility must respond immediately to native editor input.");
assert.match(source, /editor\.removeEventListener\?\.\("input", state\.onInput\)/,
  "Composer inspiration input listeners must be released with the composer lifecycle.");
assert.match(source, /source\.matches\?\.\('\[data-app-action-sidebar-thread-active="true"\]'\)/,
  "The active native task must be excluded from composer inspiration candidates.");
assert.match(
  cssSource,
  /\.dream-miku-composer-inspiration\s*\{[\s\S]{0,260}position:\s*absolute;[\s\S]{0,180}top:\s*8px;[\s\S]{0,100}right:\s*10px;/,
  "The per-composer inspiration trigger must occupy the approved upper-right empty-state slot.",
);
assert.match(
  cssSource,
  /\.dream-miku-composer-inspiration\[hidden\]\s*\{[\s\S]{0,80}display:\s*none !important;/,
  "Typed composers must fully remove the empty-state trigger from layout and focus order.",
);
assert.match(
  cssSource,
  /@media \(max-width: 1100px\)[\s\S]*\.dream-miku-composer-inspiration \.dream-miku-inspiration-label[\s\S]{0,80}display:\s*inline;/,
  "Narrow composers must keep the approved 灵感迸发 label instead of becoming icon-only.",
);
assert.doesNotMatch(
  source,
  /继续重构 MIKU 皮肤结构|定位 Codex 换肤源码|添加 Codex stop hook 提醒|下载最新 GPT SoVITS 4版/,
  "Production code must not hard-code fixture task titles into the inspiration library.",
);
assert.match(cssSource, /--dream-miku-card-composer-gap:\s*56px/,
  "Wide native home routes need the Designer-approved 56px card-to-composer rhythm.");
assert.match(cssSource, /@media \(max-width: 1100px\) and \(max-height: 800px\)[\s\S]*--dream-miku-card-composer-gap:\s*32px/,
  "The 1024-class viewport needs the approved 32px rhythm when native cards are present.");
assert.match(cssSource, /@media \(max-width: 900px\)[\s\S]*--dream-miku-card-composer-gap:\s*24px/,
  "The 900px viewport needs the approved 24px rhythm when native cards are present.");
assert.match(
  cssSource,
  /@media \(max-width: 1100px\) and \(max-height: 800px\)[\s\S]*--dream-miku-hero-height:\s*248px;[\s\S]{0,100}--dream-miku-capability-height:\s*118px;/,
  "The 1024-class budget must use the measured native hero and card heights.",
);
assert.match(
  cssSource,
  /@media \(max-width: 900px\)[\s\S]*--dream-miku-hero-height:\s*248px;[\s\S]{0,100}--dream-miku-capability-height:\s*118px;/,
  "The 900px budget must keep the measured native hero and card heights.",
);
assert.match(cssSource, /--dream-miku-home-visual-shift:\s*16px/,
  "Wide native home routes should restore the light 16px hero shift after the composer-only clarification.");
assert.match(
  cssSource,
  /@media \(max-width: 1100px\) and \(max-height: 800px\)[\s\S]*--dream-miku-home-visual-shift:\s*12px/,
  "The medium viewport needs the restored 12px hero shift.",
);
assert.match(
  cssSource,
  /@media \(max-width: 900px\)[\s\S]*--dream-miku-home-visual-shift:\s*8px/,
  "The narrow viewport needs the restored 8px hero shift without crowding the composer.",
);
assert.match(
  cssSource,
  /\.dream-miku-home-hero-band\s*\{[\s\S]{0,120}transform:\s*translateY\(var\(--dream-miku-home-visual-shift\)\)/,
  "Only the hero band should keep the light visual shift.",
);
assert.match(
  cssSource,
  /\.dream-miku-home-composer-band\s*\{[^}]*margin-top:\s*auto !important;/,
  "The home composer band must absorb remaining native flex space and stay at the viewport bottom.",
);
assert.doesNotMatch(
  cssSource,
  /:is\(\.dream-miku-home-hero-band, \.dream-miku-home-composer-band\)[^{]*\{[^}]*transform|\.dream-miku-home-composer-band\s*\{[^}]*transform:/,
  "The composer must not inherit the hero translation after the composer-only clarification.",
);
assert.match(
  cssSource,
  /\.dream-miku-home-capability > span:first-child > span:first-child\s*\{[\s\S]{0,120}display:\s*grid !important;[\s\S]{0,80}place-content:\s*center !important;[\s\S]{0,80}place-items:\s*center !important;/,
  "Every native capability badge slot must center the replacement SVG geometrically.",
);
assert.match(
  cssSource,
  /\.dream-miku-home-utility-control \.dream-miku-control-icon\s*\{[\s\S]{0,100}width:\s*16px;[\s\S]{0,60}height:\s*16px;/,
  "Project utility glyphs must fit the native 16px slot instead of overflowing it.",
);
assert.doesNotMatch(
  cssSource,
  /\.dream-miku-home-composer-band[^\{]*\{[^}]*position:\s*(?:fixed|absolute)|\.dream-miku-home-composer-band[^\{]*\{[^}]*margin[^:]*:\s*-/is,
  "The composer rhythm must remain in native flex flow without fixed positioning or negative margins.",
);
assert.doesNotMatch(cssSource, /dream-miku-sidebar[^\n{]*\{[^}]*position:\s*fixed/is,
  "Sidebar decoration must not establish a second fixed layout.");
assert.doesNotMatch(cssSource, /dream-miku-side-chat[^\n{]*\{[^}]*position:\s*fixed/is,
  "Side-chat decoration must preserve Codex's native split geometry.");
assert.match(productionPayload.payload, /__CODEX_DREAM_MIKU_A4_FACTORY__/);
assert.doesNotMatch(
  productionPayload.payload,
  /@keyframes dream-miku-card-icon/,
  "The A4 payload must omit the rejected legacy MIKU layout block.",
);
assert.deepEqual(
  productionPayload.theme.projectIcons,
  {},
  "The public preset must not publish personal project-name mappings.",
);

console.log("PASS: MIKU native-v2 keeps native layout and themes exact sidebar/project nodes.");
