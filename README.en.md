# MIKU Codex for macOS

<p align="center">
  <a href="./README.md">中文</a> · <strong>English</strong>
</p>

<p align="center">
  <img src="macos/assets/miku-codex-app-icon.svg" alt="MIKU Codex icon" width="112">
</p>

<p align="center">
  <strong>A MIKU-inspired macOS skin for the real Codex workspace.</strong><br>
  Native DOM adaptation · loopback-only injection · persistent MIKU Codex launcher
</p>

> Unofficial and not affiliated with OpenAI or Crypton Future Media. This project does not modify the official `Codex.app`, `app.asar`, or code signature.

## Preview

<p align="center">
  <img src="docs/images/miku-codex-preview.png" alt="MIKU Codex running in the real macOS app" width="1100">
  <br>
  <sub>Real Codex injection. The repository owner confirmed that the visible screenshot content may be published.</sub>
</p>

The character background shown in the preview is not distributed with the public source. Import a UI-free image you have the right to use after installation. The sidebar, projects, tasks, environment state, composer, and menus remain native Codex UI.

## What it changes

- Keeps real Codex projects, tasks, threads, state, input controls, and interactions instead of replacing the app with a screenshot.
- Applies semantic SVG recipes to primary navigation, projects, the four home capabilities, environment panels, and composer controls. Projects do not need per-item bitmap assets.
- Adds an independent empty-state **灵感迸发** control to the main composer and each side-task composer. Suggestions still come from real tasks in the current project.
- Rotates 15 MIKU support phrases with restrained display type, kaomoji, and text symbols, then yields immediately when the user starts typing.
- Themes model speed and permission menus, including the visual **全开舞台** label, while preserving native permission values and accessibility semantics.
- Covers home, task, environment, and side-chat surfaces, with `prefers-reduced-motion` support.
- Installs a bright `MIKU Codex.app` launcher. Future launches restore the theme, while quitting Codex still leaves it stopped.

## Requirements

- macOS 13 or newer
- Official Codex Desktop installed and launched successfully at least once
- Quit Codex before installation so it cannot write its configuration concurrently
- No separate global Node.js install is required; the runtime validates and uses Codex's signed bundled Node

## Install

```bash
git clone https://github.com/hebi-Chinese/MIKU-Codex-macOS.git
cd MIKU-Codex-macOS/macos

# Install the stable engine without legacy Dream Skin desktop commands or auto-launch
./scripts/install-dream-skin-macos.sh --no-launchers --no-launch

STUDIO="$HOME/.codex/codex-dream-skin-studio"

# Install the only MIKU launch entry (Desktop + user Applications)
"$STUDIO/scripts/install-miku-launcher-macos.sh" \
  --target "$HOME/Applications/MIKU Codex.app"
"$STUDIO/scripts/install-miku-launcher-macos.sh" \
  --target "$HOME/Desktop/MIKU Codex.app"

# Choose your own background and apply the theme
"$STUDIO/scripts/customize-theme-macos.sh"
```

For future launches, open `MIKU Codex.app` from the Desktop or user Applications folder. The launcher starts the installed official Codex app and restores theme injection on `127.0.0.1:9341`.

## Verify and restore

```bash
STUDIO="$HOME/.codex/codex-dream-skin-studio"

# Verify the current loopback session and theme markers
"$STUDIO/scripts/verify-dream-skin-macos.sh"

# Remove the theme configuration and relaunch stock Codex
"$STUDIO/scripts/restore-dream-skin-macos.sh" \
  --restore-base-theme --restart-codex
```

## Security boundary

- CDP binds to loopback only; do not run untrusted local software while the themed session is active.
- The injector accepts only a validated Codex process and expected `app://` renderer targets.
- The official app bundle, `app.asar`, Team ID, and code signature remain unchanged.
- The theme never rewrites API keys, base URLs, model providers, or task data.
- Backgrounds, runtime state, logs, caches, personal theme archives, and build outputs are ignored by Git.

## Source map

- [`macos/assets/miku-a4-adapter.js`](./macos/assets/miku-a4-adapter.js): native DOM discovery, icon recipes, inspiration controls, and lifecycle
- [`macos/assets/miku-a4.css`](./macos/assets/miku-a4.css): MIKU visual layer, responsive rules, and reduced motion
- [`macos/assets/miku-love-words-icons.svg`](./macos/assets/miku-love-words-icons.svg): theme SVG sprite
- [`macos/assets/miku-codex-app-icon.svg`](./macos/assets/miku-codex-app-icon.svg): source for the MIKU Codex app icon
- [`macos/scripts/`](./macos/scripts/): install, start, verify, restore, and package scripts

This repository currently focuses on the macOS MIKU build. A known bundled Node/runtime-state restore blocker is still documented, so this README does not claim that the entire `npm test` suite passes.

## Upstream and license

This project builds on [Fei-Away/Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin). Special thanks to **Fei-Away** and every contributor to the original project for establishing the external theming, macOS injection, and safe-restore foundations. This repository preserves the upstream MIT license and notices; see [`macos/LICENSE`](./macos/LICENSE) and [`macos/NOTICE.md`](./macos/NOTICE.md).

Hatsune Miku, Codex, and all related names, characters, trademarks, and assets belong to their respective rights holders. This is an unofficial fan project. Clear the rights for any character artwork or background before public or commercial distribution.
