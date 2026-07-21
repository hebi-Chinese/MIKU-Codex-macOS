# MIKU Love Words Script

`miku-love-words-script.woff2` is a web-only subset derived from **Ma Shan Zheng Regular**, the handwriting display face published by the Google Fonts project. The source font is licensed under the SIL Open Font License 1.1; the complete license is preserved in `OFL.txt`.

The subset request is defined by `glyphs.txt` and covers all 175 CJK characters used by the MIKU support phrases, permission presentations, and inspiration controls, plus the source font's supported Latin and punctuation. Kaomoji and ornamental symbols not present in Ma Shan Zheng intentionally continue through the declared fallback stack. CSS exposes the subset through the local alias `MIKU Love Words Script`; it is embedded into the renderer payload as a WOFF2 data URL and is not installed as a system or desktop font.

Upstream source: <https://github.com/google/fonts/tree/main/ofl/mashanzheng>

Rebuild outline:

1. Download `ofl/mashanzheng/MaShanZheng-Regular.ttf` from the official `google/fonts` repository.
2. Keep the upstream name tables and expose the subset through the CSS alias `MIKU Love Words Script`.
3. Run `pyftsubset` with `--text-file=glyphs.txt`, `--flavor=woff2`, `--layout-features=*`, and preserved name tables.
4. Verify the output begins with the WOFF2 magic bytes `wOF2`, contains every required CJK glyph in `glyphs.txt`, and resolves through the `MIKU Love Words Script` CSS alias. Decorative symbols may use the explicit fallback fonts.

Copyright 2018 The Ma Shan Zheng Project Authors. This repository does not claim authorship of the source typeface.
