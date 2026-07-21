# MIKU Love Words Script

`miku-love-words-script.woff2` is a web-only subset derived from **LXGW WenKai GB Regular**. The source font is licensed under the SIL Open Font License 1.1; the complete license is preserved in `OFL.txt`.

The subset contains only the characters used by the MIKU support phrases, permission presentations, inspiration controls, and a small punctuation/Latin fallback set listed in `glyphs.txt`. Its internal family name is changed to `MIKU Love Words Script`; it is embedded into the renderer payload as a WOFF2 data URL and is not installed as a system or desktop font.

The approved checked-in GitHub preview is **native-font first**: `HanziPen SC`
for support/permission copy and `Hannotate SC` for kaomoji. This WOFF2 is a
verified missing-glyph and cross-machine fallback only; it must remain after
those native faces in the CSS stack and must not replace the approved preview
appearance on a Mac where those fonts are available.

Upstream source: <https://github.com/lxgw/LxgwWenkaiGB>

Rebuild outline:

1. Download `fonts/TTF/LXGWWenKaiGB-Regular.ttf` from the upstream repository.
2. Use FontTools to rename name IDs 1, 4, 6, 16, and 17 to the non-reserved MIKU family names.
3. Run `pyftsubset` with `--text-file=glyphs.txt`, `--flavor=woff2`, `--layout-features=*`, and preserved name tables.
4. Verify the output begins with the WOFF2 magic bytes `wOF2` and that its family name is `MIKU Love Words Script`.

Copyright 2022–2026 LXGW; Copyright 2020 The Klee Project Authors. This repository does not claim authorship of the source typeface.
