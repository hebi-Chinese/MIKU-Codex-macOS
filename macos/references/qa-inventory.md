# QA inventory

## Required user-visible behavior

1. Home route paints one continuous wallpaper across sidebar and main content, with a live native heading, the real project utility row/composer, and any native suggestion cards exposed by the current Codex version.
2. Normal tasks show the selected image behind restrained gradients and translucent live content surfaces.
3. Sidebar, navigation, messages, approvals, project selector, attachments, composer, menus, hover, focus, and keyboard input remain native and interactive.
4. Decorative layers have `pointer-events: none`; no screenshot or raster UI is used as an overlay.
5. Route changes, renderer reloads, and ordinary refreshes reapply the current theme while the verified injector runs.
6. Official application signature and `app.asar` remain unchanged.
7. Restore removes live DOM/CSS, restores the two saved base-theme values, closes the CDP session after restart, and supports later reinstallation.

## Automated checks

- Shell and JavaScript syntax checks.
- Payload construction with bundled demo and an isolated custom theme.
- Reject unsupported theme config, unsafe image paths, invalid colors, oversized images, non-loopback WebSocket URLs, and unrecognized renderer targets.
- Exact install/restore round trip for the two TOML settings while preserving unrelated values.
- Empty `HOME` recovery.
- Official app and internal Node signature, Team ID, architecture, and version validation.
- Port collision selection and saved-port reuse.
- PID reuse protection through PID, start time, executable, script path, and command-line matching.
- Live verification after explicit diagnostic reload returns version `1.3.5` and `pass: true`; normal watcher/application paths do not reload the page.
- The MIKU preset additionally requires `mikuContractPass: true`, adapter contract `miku-native-v2-2026-07-20.5`, renderer reconciliation contract `stream-safe-v2`, a fixed persistent art layer, 15 support phrases, 4 permission presentations, at least 56 SVG symbols, loaded bundled ZCOOL KuaiLe display typography, `permissionArtTypographyPass: true` for an open permission menu, loaded side-chat art, and complete coverage of every open side-chat panel. A wallpaper-only, ordinary-font, synthetic-bold permission menu, white-side-chat, or GPT-streaming flicker state must fail.
- Strict home verification requires a visible wallpaper composition region of at least 320×160, composer, sidebar, non-interactive decoration, and no horizontal overflow. Suggestion cards and the standalone project button are optional only when the current Codex host does not render them.

## Visual checks

- Home at normal desktop size: the subject stays clear of the text-safe area, text remains live, native cards are not clipped when present, and the merged project/composer surface does not overlap content.
- Narrower window: wallpaper cropping preserves the declared focus and safe area before essential controls are compressed.
- Task route: background remains atmospheric, messages and output panels keep high contrast, and the composer remains reachable.
- Selected image contains no fake interface controls or raster text intended to impersonate Codex.
- Inspect sidebar selection, header, wallpaper edges, cards, project utility row, composer buttons, scrollbars, focus outlines, dialogs, and menus.

## Release signoff

- Run `tests/run-tests.sh` successfully.
- Install from a clean extracted copy with no global Node.js.
- Complete install → live verify → reload verify → restore → reinstall.
- Capture a real CDP screenshot and retain the verifier JSON.
- Confirm `codesign --verify --deep --strict` still succeeds for the official Codex app.
- Build ZIP and record SHA-256.
