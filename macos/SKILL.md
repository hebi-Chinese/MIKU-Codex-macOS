---
name: miku-codex-macos
description: Install, launch, verify, repair, update, or restore MIKU Codex for macOS from the official public product repository or complete client package. Use when a user needs the full native-v2 MIKU adapter, semantic SVG system, support phrases, permission presentation, inspiration controls, persistent launcher, or safe loopback troubleshooting.
compatibility: macOS, official Codex Desktop app, signed bundled Node.js 20 or newer
---

# MIKU Codex for macOS

This file is an optional Codex capability entry for a complete standalone engine. In a Git checkout, the root `AGENTS.md` **MIKU Public Install Contract** is the source of truth. The product repository is `https://github.com/hebi-Chinese/MIKU-Codex-macOS.git`; do not substitute the acknowledged Fei-Away upstream. Required version: `1.3.4`. Required contract: `miku-native-v2-2026-07-20.4`. Required renderer reconciliation: `stream-safe-v1`.

## Workflow

1. Inspect `git status --short --branch` before updating. Preserve dirty work; never reset or overwrite it. A clean checkout may update with `git pull --ff-only`, then must prove local HEAD equals the public remote `main` SHA.
2. Install the whole engine with `scripts/install-dream-skin-macos.sh --no-launchers --no-launch`. Never copy only the background, CSS, adapter, or SVG.
3. From `~/.codex/codex-dream-skin-studio`, install `MIKU Codex.app` to both `~/Applications` and `~/Desktop`, then select `preset-miku-love-words --no-apply`.
4. Treat the image role as a hard semantic contract: **《爱言叶 V》官方 MV 插画 = 右侧聊天栏 / 侧边任务背景图**. It is neither the main wallpaper nor the left project sidebar. The repository does not redistribute it. Ask the user for an absolute path to their own local copy, never download it automatically, then run `scripts/configure-miku-side-chat-macos.sh --file "<absolute-path>" --no-apply`. If no file is supplied, report the public fallback as a known visual difference.
5. Byte-compare the installed `miku-a4-adapter.js`, `miku-a4.css`, `miku-love-words-icons.svg`, bundled `miku-love-words-script.woff2`, public side-chat image, MIKU preset metadata, and both `configure-miku-side-chat` scripts with the source. The SVG sprite must contain exactly 56 symbols.
6. With explicit user authorization, quit Codex once and launch through `MIKU Codex.app`, not the ordinary Codex icon. `--no-apply` is staging, not live proof.
7. Run `scripts/doctor-macos.sh --require-live` and `scripts/verify-dream-skin-macos.sh --reload`. Success requires `version=1.3.4`, `mikuContractPass=true`, contract `miku-native-v2-2026-07-20.4`, renderer reconciliation `stream-safe-v1`, 15 support phrases, 4 permission presentations, at least 56 live SVG symbols, `artTypographyPass=true`, `permissionArtTypographyPass=true` while the permission menu is open, `sideChatArtLoaded=true`, and `sideChatPanelCoveragePass=true`.
8. Inspect home, a normal task, a newly opened window, the permission menu, and side chat. Restore the official appearance only on user request with `scripts/restore-dream-skin-macos.sh`.

## Failure signatures

- A MIKU wallpaper with native “随心输入” is a partial install, not success.
- Unthemed “完全访问” without the visual “全开舞台”, missing “灵感迸发”, old home-card icons, or a white native side-chat panel all fail acceptance.
- Ordinary fallback typography fails acceptance: art strings must use the bundled `MIKU Love Words Script` WOFF2, not only a destination Mac system font.
- Four legacy `Codex Dream Skin*.command` files are not MIKU acceptance evidence.
- A current Git checkout can still have a stale stable engine; require byte comparisons.
- One themed existing window is insufficient; new windows and side chat must attach too.
- If a local official *Love Words V* image was supplied, showing it in the main window or left navigation instead of only the right-side chat/side-task background fails acceptance.

## Guardrails

- Never modify the official `.app`, `app.asar`, or its code signature.
- Use the official Codex app's signed Node.js runtime only after validating its signature, Team ID, architecture, and minimum version.
- Bind CDP to loopback, verify that the listener belongs to Codex, and reject non-Codex renderer targets.
- Preserve all native cards, navigation, project selectors, task content, composer controls, permission values, accessibility text, and keyboard focus.
- Theme images must be UI-free wallpapers. Paint one 16:9 image continuously across the window; keep home expressive and task routes quieter. `appearance: auto` follows Codex/native or system appearance rather than image brightness.
- Keep decoration at `pointer-events: none`.
- Require explicit authorization before restarting an already-running Codex instance.
- Stop an injector only when its recorded PID, executable, command line, and start time all match.

## Key resources

- `AGENTS.md` (Git checkout root): complete public install contract and lessons learned.
- `README.md`: engine guide; repository root README contains the copyable Agent prompt.
- `CLIENT_DEPLOY_PROMPT.md`: complete prompt to send to the destination Mac's Codex Agent.
- `assets/miku-a4-adapter.js`: native-v2 DOM adapter and feature catalog.
- `assets/miku-love-words-icons.svg`: 56-symbol semantic SVG sprite.
- `scripts/injector.mjs`: CDP connection, injection, removal, verification, and screenshots.
- `assets/dream-skin.css`: live native interface styling.
- `assets/renderer-inject.js`: idempotent DOM integration and cleanup.
- `scripts/doctor-macos.sh`: signed-runtime, payload, and optional live-session self-check.
- `references/qa-inventory.md`: release and visual acceptance criteria.
