# MIKU Love Words Script

`miku-love-words-script.woff2` is a web-only subset derived from **ZCOOL KuaiLe Regular**, the playful Chinese display face published by the Google Fonts project. It is intentionally more graphic than a body or Kaishu-style handwriting face, so short support phrases and permission flavor copy remain visibly thematic at composer sizes. The source font is licensed under the SIL Open Font License 1.1; the complete license is preserved in `OFL.txt`.

The subset request is defined by `glyphs.txt` and covers all 175 CJK characters used by the MIKU support phrases, permission presentations, and inspiration controls, plus the source font's supported Latin and punctuation. Kaomoji and ornamental symbols not present in ZCOOL KuaiLe intentionally continue through the declared fallback stack. CSS exposes the subset through the local alias `MIKU Love Words Script`; it is embedded into the renderer payload as a WOFF2 data URL and is not installed as a system or desktop font.

Upstream source: <https://github.com/google/fonts/tree/main/ofl/zcoolkuaile>

Rebuild outline:

1. Download `ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf` from the official `google/fonts` repository.
2. Keep the upstream name tables and expose the subset through the CSS alias `MIKU Love Words Script`.
3. Run `pyftsubset` with `--text-file=glyphs.txt`, `--flavor=woff2`, `--layout-features=*`, and preserved name tables.
4. Verify the output begins with the WOFF2 magic bytes `wOF2`, contains every required CJK glyph in `glyphs.txt`, and resolves through the `MIKU Love Words Script` CSS alias. Decorative symbols may use the explicit fallback fonts.

Copyright 2018 The ZCOOL KuaiLe Project Authors. This repository does not claim authorship of the source typeface.
