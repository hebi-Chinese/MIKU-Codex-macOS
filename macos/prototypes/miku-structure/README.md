# MIKU structure prototype

Disposable UI prototype for PRD-002. It answers one question: which home-screen
structure should become the production design direction?

- `?variant=A`: bounded poster hero, four native capability entries, full-width composer
- `?variant=A2`: A refinement with MIKU display typography, multicolour SVG icons,
  operable prompt templates, a same-background postcard crop, and composer input signal
- `?variant=A3`: a third-round A refinement with a compact centered Codex composer, a
  full-bleed poster, and an original relieved-tears SVG postcard pose
- `?variant=A4&context=project&library=1`: a fourth-round refinement with a left-aligned
  composer, a separate postcard slot, and project-scoped task windows in the inspiration library
- `?variant=A4&context=global&library=1`: the same UI in non-project state, where the library
  indexes recent task windows instead of project task windows
- `?variant=A4&context=project&panel=1`: the themed native environment-panel open state
- `?variant=B`: full-window artwork, high-opacity structured workbench
- `?variant=C`: editorial split between product information and the portrait

All variants render the same Codex information model and local-only interactions. A2/A3's
MIKU phrases are composer templates, not fabricated projects, tasks, or threads.
They do not import or mutate the production injector, theme CSS, Codex DOM, or user data.
A4 replaces the old inspiration-template popover with context-filtered real task-window titles.

Run from this directory:

```bash
node server.mjs
```

Then open `http://127.0.0.1:4177/?variant=A`. The server exposes the approved source
background directly from `/Users/mac/Downloads/已生成图像 1 (12).png`; it does not create
another raster asset in the repository.

Final A2 screenshots and interaction evidence are under
`output/playwright/miku-structure-a2-v03/`. Earlier A/B/C evidence remains under
`output/playwright/miku-structure-v03/` and was not overwritten. A3 screenshots plus the
standalone postcard detail are under `output/playwright/miku-structure-a3-v01/`.
A4's three responsive screenshots, global library state, and environment-panel state are under
`output/playwright/miku-structure-a4-v01/`.
