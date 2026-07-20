# Notices

Codex Dream Skin Studio is an **unofficial** customization project and is **not affiliated with, endorsed by, or sponsored by OpenAI**.

## Software license

The MIT License in `LICENSE` applies to the **software source code** in this repository (scripts, CSS, injectors, docs that describe the software, and the abstract demo asset generated for this repo).

It does **not** grant rights to:

- OpenAI or Codex trademarks, product names, logos, or trade dress
- Official Codex / ChatGPT application binaries, `.app` bundles, or `app.asar`
- Any user-supplied images or third-party artwork you drop into a theme
- Character likenesses, franchise art, or celebrity imagery

## Demo artwork

`assets/portal-hero.png` is original abstract geometric art generated for this open-source repository (no characters). Replace it with your own image before shipping a branded theme to customers.

## MIKU fan-theme assets

The following maintainer-provided, unofficial MIKU fan-theme files are distributed as a separate non-commercial preset and are **excluded from the MIT software license**:

- `presets/preset-miku-love-words/background.png`
- `presets/preset-miku-love-words/side-chat-background.png`

The second file is a crop derived from the first. The repository does not claim ownership of Hatsune Miku or grant trademark, character, or commercial-use rights. Hatsune Miku and related character rights belong to Crypton Future Media, INC. Downstream users must follow the current [Piapro Character License and character guidelines](https://piapro.jp/license/character_guideline).

The public preset does **not** contain the official OTOIRO / DECO*27 *Love Words V* music-video illustration by おむたつ. OTOIRO's published terms state that official works may not be reused in their original form or as an alteration, so the locally configured official side-chat artwork is intentionally excluded from this repository. See [OTOIRO's terms](https://otoiro.co.jp/s_terms/) and the [official Love Words V listing](https://otoiro.co.jp/special/).

## Arina Hashimoto reference material

The following user/maintainer-supplied files are excluded from the MIT software license:

- `presets/preset-romantic-rose/background.jpg`
- `../windows/assets/dream-reference.jpg`
- `../docs/images/presets/romantic-rose-source.png`
- `../docs/images/presets/romantic-rose-light.jpg`
- `../docs/images/presets/romantic-rose-dark.jpg`

They are included at the maintainer's direction as a local theme preset, source archive, and real runtime previews. They are not official OpenAI/Codex artwork. Their inclusion does not certify or grant third-party likeness, model-output, or redistribution rights. Downstream redistribution and commercial use require an independent rights review; the two runtime screenshots are documentation previews and must never be imported as wallpapers.

## Runtime

This project does not redistribute Node.js. At runtime it validates and uses the Node.js executable already signed and bundled inside the user's official Codex desktop application.

## Security model

Themes are applied through Chromium DevTools Protocol on **loopback only**. While a themed session is running, treat the local debugging port as sensitive: do not run untrusted local software that could attach to it. Use the Restore launcher to tear down the themed session and debugging port.
