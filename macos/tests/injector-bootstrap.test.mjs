import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { codexProbeExpression, earlyPayloadFor } from "../scripts/injector.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const injectorPath = path.resolve(here, "../scripts/injector.mjs");
const source = await fs.readFile(injectorPath, "utf8");

function createFixture() {
  const observers = [];
  const timers = new Map();
  let nextTimer = 1;
  const markers = { legacyShell: false, currentShell: false, sidebar: false };
  const context = {
    window: { installs: [] },
    location: { href: "app://-/index.html" },
    document: {
      title: "Codex",
      documentElement: {},
      querySelector(selector) {
        const selectors = selector.split(",").map((item) => item.trim());
        if (selectors.includes("main.main-surface") && markers.legacyShell) return {};
        if (
          selectors.includes('main[data-app-shell-main-surface]')
          && markers.currentShell
        ) return {};
        if (selector === "aside.app-shell-left-panel") return markers.sidebar ? {} : null;
        return null;
      },
    },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        this.connected = true;
        observers.push(this);
      }
      observe() {}
      disconnect() { this.connected = false; }
    },
    setTimeout(callback) {
      const id = nextTimer++;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
  };
  return { context, markers, observers };
}

const guarded = createFixture();
vm.runInNewContext(earlyPayloadFor('window.installs.push("guarded")', "guarded"), guarded.context);
assert.deepEqual(guarded.context.window.installs, [], "Auxiliary app targets must remain untouched.");
guarded.markers.legacyShell = true;
guarded.observers[0].callback([]);
assert.deepEqual(guarded.context.window.installs, [], "A main surface without the Codex sidebar is not sufficient.");

const currentShell = createFixture();
vm.runInNewContext(earlyPayloadFor('window.installs.push("current")', "current"), currentShell.context);
currentShell.markers.currentShell = true;
currentShell.markers.sidebar = true;
currentShell.observers[0].callback([]);
assert.deepEqual(
  currentShell.context.window.installs,
  ["current"],
  "Codex 26.727 main surfaces must pass the guarded early injection path.",
);
assert.equal(
  vm.runInNewContext(codexProbeExpression(), currentShell.context).codex,
  true,
  "The full watcher probe must recognize the same Codex 26.727 shell as early injection.",
);

const generations = createFixture();
vm.runInNewContext(earlyPayloadFor('window.installs.push("old")', "old"), generations.context);
vm.runInNewContext(earlyPayloadFor('window.installs.push("new")', "new"), generations.context);
generations.markers.legacyShell = true;
generations.markers.sidebar = true;
for (const observer of generations.observers) observer.callback([]);
assert.deepEqual(
  generations.context.window.installs,
  ["new"],
  "A stale early script must yield to the newest watcher generation.",
);
assert.equal(generations.context.window.__CODEX_DREAM_SKIN_EARLY_APPLIED__, "new");

const discoveryStart = source.indexOf("record.earlyScriptId = await registerEarly");
const probeStart = source.indexOf("const probe = await waitForCodexProbe", discoveryStart);
assert.ok(discoveryStart >= 0 && probeStart > discoveryStart, "Early registration must happen before full shell probing.");
assert.match(
  source,
  /finally\s*\{[\s\S]*Promise\.all\(\[\.\.\.sessions\.values\(\)\][\s\S]*removeEarly\(record\)/,
  "Watcher shutdown must unregister persistent Page scripts before closing CDP sessions.",
);
assert.match(
  source,
  /const earlyApplied = await session\.evaluate\([\s\S]*if \(!earlyApplied\) \{[\s\S]*applyToSession/,
  "The watcher must not run the full payload twice after a successful early install.",
);
assert.match(
  source,
  /const hero = box\(\s*home\?\.querySelector\('\.dream-miku-home-hero-band'\)/,
  "Live verification must prefer the adapter-owned home hero marker over Codex child positions.",
);

console.log("PASS: early injection is shell-guarded, generation-safe, and removed on shutdown.");
