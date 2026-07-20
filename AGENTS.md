# Repository Guidelines

## MIKU Public Install Contract

This section is the source of truth for any AI agent installing this repository on another Mac. The product repository is `https://github.com/hebi-Chinese/MIKU-Codex-macOS.git`; `Fei-Away/Codex-Dream-Skin` is the acknowledged upstream, not the install source. The current required runtime contract is `miku-native-v2-2026-07-20.3`, the renderer reconciliation contract is `stream-safe-v1`, and the release version is `1.3.3`.

### Required Agent Posture

- Perform the install and gather evidence. Do not stop after paraphrasing this file or printing commands for the user.
- Before changing an existing checkout, run `git status --short --branch`. If it is dirty, preserve those changes and stop for user direction; 不得使用 `git reset --hard`、`git checkout --` 或覆盖本地修改。
- For a clean existing checkout, fetch the exact product URL, check out `main`, and use `git pull --ff-only https://github.com/hebi-Chinese/MIKU-Codex-macOS.git main`. For a fresh install, run `git clone --branch main --single-branch https://github.com/hebi-Chinese/MIKU-Codex-macOS.git`. Confirm `git rev-parse HEAD` equals `git ls-remote https://github.com/hebi-Chinese/MIKU-Codex-macOS.git refs/heads/main | awk '{print $1}'`.
- Read this file, the root `README.md`, and `macos/README.md` completely before installation. Do not infer the MIKU workflow from older Dream Skin launchers.
- A restart or quit of Codex requires explicit user authorization. When authorized, allow one controlled Codex quit/relaunch and launch through `MIKU Codex.app`; do not restart unrelated apps.
- Never modify the official Codex `.app`, `app.asar`, code signature, Team ID, API keys, providers, task data, or macOS security settings. CDP must remain loopback-only.

### Exact Install Procedure

From the verified checkout root, use the complete engine. Never copy only the background, CSS, adapter, or SVG file.

```bash
cd macos
./scripts/install-dream-skin-macos.sh --no-launchers --no-launch

STUDIO="$HOME/.codex/codex-dream-skin-studio"
"$STUDIO/scripts/install-miku-launcher-macos.sh" \
  --target "$HOME/Applications/MIKU Codex.app"
"$STUDIO/scripts/install-miku-launcher-macos.sh" \
  --target "$HOME/Desktop/MIKU Codex.app"
"$STUDIO/scripts/switch-theme-macos.sh" \
  --id preset-miku-love-words --no-apply
```

When the user expects the maintainer's personal side-chat composition, the asset contract is exact: **《爱言叶 V》官方 MV 插画 = 右侧聊天栏 / 侧边任务背景图**. It is not the main window background and not the left product/project sidebar. The official illustration is intentionally absent from this public repository. Ask the user to select their own local PNG/JPEG/WebP copy and provide its absolute path; do not download, scrape, screenshot, commit, package, or redistribute it for them.

目标 Agent 必须先向用户索取其本机已有图片的绝对路径；缺少该路径时只能报告公开替代图状态，不能自行寻找官方图。

After the user provides that local path, create the persistent personal alias before launch:

```bash
LOVE_WORDS_V_SIDE_CHAT="/absolute/path/from-the-user.jpg"
"$STUDIO/scripts/configure-miku-side-chat-macos.sh" \
  --file "$LOVE_WORDS_V_SIDE_CHAT" --no-apply
```

This command copies the image only into the ignored local `CodexDreamSkinStudio` theme library, preserves the main background and left sidebar, writes `sideChatImage` under `custom-miku-love-words`, and selects that personal theme. If the user does not provide a local file, retain the public side-chat fallback but report `official Love Words V side-chat image: not configured`; do not claim exact visual parity.

`--no-apply` only selects the preset; it is not evidence that the live renderer changed. After the user-authorized quit, open `$HOME/Applications/MIKU Codex.app` (or the identical Desktop copy), not the ordinary Codex icon.

Before launch, prove that the stable engine is current:

```bash
cmp assets/miku-a4-adapter.js "$STUDIO/assets/miku-a4-adapter.js"
cmp assets/renderer-inject.js "$STUDIO/assets/renderer-inject.js"
cmp assets/miku-a4.css "$STUDIO/assets/miku-a4.css"
cmp assets/miku-love-words-icons.svg "$STUDIO/assets/miku-love-words-icons.svg"
cmp assets/fonts/miku-love-words-script.woff2 \
  "$STUDIO/assets/fonts/miku-love-words-script.woff2"
cmp presets/preset-miku-love-words/side-chat-background.png \
  "$STUDIO/presets/preset-miku-love-words/side-chat-background.png"
cmp presets/preset-miku-love-words/theme.json \
  "$STUDIO/presets/preset-miku-love-words/theme.json"
cmp scripts/configure-miku-side-chat-macos.sh \
  "$STUDIO/scripts/configure-miku-side-chat-macos.sh"
cmp scripts/configure-miku-side-chat.mjs \
  "$STUDIO/scripts/configure-miku-side-chat.mjs"
test "$(grep -c '<symbol id=' assets/miku-love-words-icons.svg)" -eq 56
```

### Mandatory Live Verification

After launching through `MIKU Codex.app`, run:

```bash
STUDIO="$HOME/.codex/codex-dream-skin-studio"
"$STUDIO/scripts/doctor-macos.sh" --require-live
"$STUDIO/scripts/verify-dream-skin-macos.sh" \
  --reload --screenshot "$HOME/Desktop/miku-codex-home-verification.png"
```

The MIKU target is accepted only when live verification reports all of the following:

- `pass: true`, `version: 1.3.3`, `reconciliationContract: stream-safe-v1`, and `themeId: preset-miku-love-words` (or the supported personal alias `custom-miku-love-words`).
- `mikuContractRequired: true` and `mikuContractPass: true`.
- Adapter `installed: true`, `contractVersion: miku-native-v2-2026-07-20.3`, `supportPhraseCatalogCount: 15`, `permissionPresentationCount: 4`, and `iconSymbolCount >= 56`.
- Typography `artFontFamily: MIKU Love Words Script`, `artFontLoaded: true`, and `artTypographyPass: true`. A declared fallback font name is not evidence; the bundled WOFF2 must actually load in the renderer.
- Side chat `sideChatImageConfigured: true`, `sideChatArtLoaded: true`, and adapter `sideChatPanelCoveragePass: true`. When a side-chat panel is open, `sideChatPanelCount` must equal `sideChatThemedPanelCount`.
- The home route, an ordinary task route, the permission menu, and a side-chat/side-task panel remain usable. Empty composers show a rotating themed support phrase and offer “灵感迸发”; typing real text hides the inspiration affordance.

### Known Failure Signatures and Lessons

- **Wallpaper-only is failure.** If the MIKU background appears but the composer still says “随心输入”, the permission UI still shows only the unthemed native “完全访问” instead of the visual title “全开舞台”, “灵感迸发” is missing, or the four home cards use old/default icons, the current adapter did not install. Continue diagnosing; do not call it a responsive variation.
- **Ordinary typography is failure.** The art strings must resolve through the bundled `MIKU Love Words Script` WOFF2. Do not accept `PingFang SC`, `sans-serif`, or a destination-only system font as the sole computed face for support phrases, permission copy, or inspiration headings.
- **A white side-chat panel is failure.** Merely shipping `side-chat-background.png` is insufficient. Require the renderer load flags and per-panel coverage fields above, then inspect a currently open side-chat/side-task panel.
- **The wrong art in the wrong surface is failure.** When the user supplied the official *Love Words V* illustration, it must appear only behind the right-side chat/side-task surface. Replacing the main wallpaper or left project sidebar with it is not an acceptable workaround.
- **The old generic customer prompt is obsolete.** Do not install a demo theme, do not customize a random image, and do not use the four legacy `Codex Dream Skin*.command` files as acceptance evidence.
- **The wrong repository produces the wrong product.** Installing the acknowledged upstream or an old cached clone can provide the base wallpaper engine without current MIKU behavior.
- **The stable runtime can be stale even when Git is current.** A successful pull does not update `~/.codex/codex-dream-skin-studio`; rerun the installer and require all nine `cmp` checks, including `renderer-inject.js`.
- **The normal Codex icon is not the persistent theme entry.** Future cold launches must use the colored `MIKU Codex.app`. A normal launch can omit the required Chromium/CDP startup path.
- **One good window is insufficient.** Verify a newly opened window and a side-chat panel; the adapter must attach to every live renderer, not only the window that existed during install.
- **Streaming flicker is failure.** While Codex is answering, ordinary assistant-content mutations must not repeatedly increase renderer `routePasses`, `rootPasses`, or `layoutReads`. Require `reconciliationContract: stream-safe-v1`; an old renderer can preserve the wallpaper while repeatedly rescanning the full shell on every GPT token batch.
- **Project/task names differ by machine.** Do not copy fixture data or compare literal project names. Compare structure, native interactivity, semantic SVG treatment, support phrases, permission presentation, and inspiration behavior.
- **Do not weaken checks to get green.** Read logs under `~/Library/Application Support/CodexDreamSkinStudio/`, compare the installed engine, and repair the install source or launch path.

Do not claim the entire `npm test` suite passed while the documented bundled Node/runtime-state recovery blocker exists. Report targeted tests, doctor, live verify, screenshot path, checkout SHA, remote SHA, stable-engine byte comparisons, launcher paths, and any remaining mismatch separately.

## Project Structure & Module Organization

- `macos/` is the primary product: shell launchers, `scripts/` runtime logic, `assets/` CSS/injection payloads, `menubar/` SwiftBar integration, and `tests/` checks.
- `windows/` contains PowerShell launch/install/restore scripts, Node CDP injection, platform assets, references, and Windows-specific tests.
- `docs/` holds platform notes, project history, promotional copy, and preview images. Files under `docs/images/gallery/` are composites, not theme backgrounds.
- `.github/` contains issue and pull-request templates. Keep platform behavior documented in `docs/platforms.md`.

## Build, Test, and Development Commands

- `cd macos && npm test`: run shell/JavaScript syntax, payload, configuration round-trip, signature, and doctor checks.
- `macos/scripts/doctor-macos.sh`: validate the installed Codex app, signed bundled Node runtime, theme payload, and optional live session.
- `macos/scripts/build-release.sh`: test and build the macOS release ZIP plus SHA-256 file.
- `macos/scripts/build-client-release.sh <output.zip>`: create the customer-facing double-click package.
- `powershell -File windows/tests/run-tests.ps1`: run Windows configuration and static regression checks.

Do not bypass failing checks. Document platform-only test blockers in the PR.

## Coding Style & Naming Conventions

Use two-space indentation in shell, PowerShell, JavaScript, JSON, and CSS. Shell entry points use `set -euo pipefail`; Node files use ESM. Follow existing kebab-case script names such as `start-dream-skin-macos.sh`. Prefer existing platform helpers over new dependencies. Keep comments short and focused on safety or non-obvious behavior.

## Testing Guidelines

Tests must cover changed install, start, inject, verify, pause, and restore behavior. For renderer or CSS changes, run live verification and inspect both home and task routes. Configuration tests must include Chinese/non-ASCII project names and prove unrelated TOML content survives install/restore. Never rewrite `config.toml` through an encoding-dependent API; require strict UTF-8, atomic writes, and a recoverable backup.

## Commit & Pull Request Guidelines

Prefer `type(scope): summary`, for example `fix(windows): preserve UTF-8 config on restore`. Complete the PR template with platform, rationale, actual test results, linked issues, and screenshots for visual changes. Do not include private chats, API keys, `auth.json`, or customer data.

## Security & Release Notes

CDP must remain loopback-only. Never modify official `.app`, WindowsApps, `app.asar`, signatures, API keys, or Base URLs. Update `macos/CHANGELOG.md` for user-visible macOS changes and bump `macos/VERSION` for release-worthy work. Maintain a clearly labeled Windows changelog as parity features and fixes ship.
