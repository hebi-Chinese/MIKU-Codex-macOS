# MIKU structure prototype evidence

Date: 2026-07-17

This is disposable evidence for PRD-002, not an approved production layout.

## Shared information model

All variants render the same product shell and data:

- Main navigation: 新建任务、已安排、技能、站点、拉取请求、聊天
- Project: 系统搭建 / main / 本地
- Recent tasks: the five real task names already present in the repository's real Codex screenshot
- Native home capabilities: 探索并理解代码、构建新功能或工具、审查代码并提出建议、修复问题和失败
- Composer controls: attachment, project, environment, branch, permission, model label, task creation
- Bottom boundary: 设置 and DK local account

## Playwright evidence

| Variant | 900 × 760 composer | 1024 × 768 composer | 1440 × 900 composer | Overflow | Face-safe overlap |
| --- | --- | --- | --- | --- | --- |
| A | 658 × 138 | 768 × 138 | 1160 × 238 | none | none |
| B | 658 × 138 | 768 × 138 | 1080 × 142 | none | none |
| C | 658 × 138 | 768 × 138 | 1160 × 205 | none | none |

At every size, the sidebar remained unclipped and all four capability entries were present.
The only raster resource loaded by the prototype was `/background.png`, served directly from
the approved `/Users/mac/Downloads/已生成图像 1 (12).png`. All new UI symbols are SVG.

Keyboard focus produced a 2px teal outline with 2px offset. Under
`prefers-reduced-motion: reduce`, prototype transitions resolve to `0.00001s`.
The browser console reported zero errors and zero warnings after the final reload.

## Comparison notes

- A: clearest hierarchy and lowest production adaptation risk. The bounded poster protects the
  portrait, while the four-entry rail and full-width composer remain immediately scannable.
- B: strongest immersion and surface contrast. Narrow windows depend most on background focal
  positioning, and the large opaque workbench has the highest risk of feeling heavy.
- C: strongest editorial relationship between product content and portrait. It preserves the
  largest full-width composer but would require the most careful native DOM/grid adaptation.

Screenshots are under `output/playwright/miku-structure-v03/` and remain local evidence.

## A2 theme-expression refinement

A2 keeps A's information architecture and adds the second-round feedback without replacing
real Codex data:

- `Miku Codex` uses the installed Snell Roundhand display face; the Chinese hero heading uses
  Songti SC; navigation, project/task data, status, and controls remain on the system UI stack.
- Sidebar, project, capability, prompt, attachment, model, ribbon, sparkle, and postcard details
  are multicolour SVG symbols. No emoji characters or new raster UI assets were introduced.
- The five supplied MIKU phrases are operable composer templates. The inspiration library adds
  歌词生成器、虚拟演唱会页面、音源海报工坊、今日穿搭、灵感收藏夹、Miku 灵感星球 as
  input templates rather than fabricated projects or task history.
- The postcard reuses `/background.png` as a second crop. Its paper, clip, stamp, and framing are
  CSS/SVG, and it no longer overlaps the fourth capability entry.
- The composer waveform only animates while focused or populated. Under reduced motion its
  animation resolves from `a2-input-signal / 0.9s` to `none / 0s`; transitions resolve to `1e-05s`.

| A2 viewport | Composer | Overflow | Face-safe overlap | Postcard / fourth entry overlap |
| --- | --- | --- | --- | --- |
| 900 × 760 | 658 × 146 | 0 × 0 | 0 | 0 |
| 1024 × 768 | 768 × 146 | 0 × 0 | 0 | 0 |
| 1440 × 900 | 1160 × 196 | 0 × 0 | 0 | 0 |

Playwright also verified that a primary prompt and an inspiration-library prompt populate the
textarea, the model selector changes to `5.6 Sol · 标准`, and the textarea exposes a 2px teal
focus outline. Final screenshots are under `output/playwright/miku-structure-a2-v03/`; the
browser console reported zero errors and zero warnings.

## A3 real-composer and complete-poster refinement

A3 responds to the supplied real Codex screenshot without treating it as a production DOM
fixture. The screenshot's composer occupies roughly 54% of the main content width and about
100 CSS pixels of visual height. A3 therefore centers a compact composer with deliberate empty
space on both sides instead of preserving A2's full-width workbench.

- The approved background now fills the whole bounded hero. Only the lower-left heading uses a
  local translucent surface, so the previously empty middle-left area remains part of one
  continuous image.
- The lower-right postcard is an original SVG illustration: relaxed closed eyes, two visible
  tear drops, a small relieved smile, and hands meeting around a heart. Its pose does not reuse
  the source portrait, and no new raster asset was created.
- The composer keeps only the native task controls relevant at this scale: attachment,
  permission, model, voice entry, and send. Project, branch, environment, recent tasks, and
  status remain visible in the surrounding real Codex shell rather than being duplicated.

| A3 viewport | Composer | Empty space left / right | Overflow | Face / heading / postcard overlap |
| --- | --- | --- | --- | --- |
| 900 × 760 | 513.23 × 108 | 85.38 / 85.39 | 0 × 0 | 0 / 0 / 0 |
| 1024 × 768 | 599.03 × 108 | 97.48 / 97.48 | 0 × 0 | 0 / 0 / 0 |
| 1440 × 900 | 680 × 112 | 256 / 256 | 0 × 0 | 0 / 0 / 0 |

Playwright verified five prompt buttons, four capability entries, prompt-to-textarea input,
send-state enablement, model switching to `5.6 Sol · 标准`, and the non-permission-requesting
voice placeholder. The waveform changes from `a3-input-signal` while focused/populated to
`none / 0s` under reduced motion. The only raster resource was `/background.png`; the browser
console reported zero errors and zero warnings. Final evidence is under
`output/playwright/miku-structure-a3-v01/`.

## A4 context and ecosystem refinement

A4 keeps the A3 poster and native capability model, but moves the composer to the left work
origin and gives the postcard its own grid slot to the right. The postcard is no longer a child
of the hero, so it cannot cover the supplied background at any tested width.

The inspiration library is now a context-driven task-window index. Project context shows the
four real task-window titles for the current project; non-project context shows the five real
recent-task titles already used by the shell. Clicking a node selects the matching sidebar task
and updates the topbar path. The project icon is selected by the stable `system-grid` SVG recipe;
unknown recipes have a neutral folder fallback instead of generated or random artwork.

| A4 viewport | Composer | Stage inset left / right | Postcard / hero | Face / heading / library | Feature / library | Overflow |
| --- | --- | --- | --- | --- | --- | --- |
| 900 × 760 | 467 × 104 | 41 / 176 | 0 | 0 / 0 / 0 | 0 | 0 × 0 |
| 1024 × 768 | 543.44 × 104 | 53.95 / 196.61 | 0 | 0 / 0 / 0 | 0 | 0 × 0 |
| 1440 × 900 | 680 × 112 | 64 / 448 | 0 | 0 / 0 / 0 | 0 | 0 × 0 |

The environment-panel state uses coordinated sidebars below 1100px: the left product shell
collapses to a 72px SVG icon rail while the right environment panel remains a readable fixed
surface. This preserves the center workbench instead of overlaying it.

| Panel viewport | Left rail | Right panel | Hero width | Composer width | Panel / hero / composer / postcard |
| --- | --- | --- | --- | --- | --- |
| 900 × 760 | 72 | 272 × 688 | 517 | 326 | 0 / 0 / 0 |
| 1024 × 768 | 72 | 278 × 696 | 635 | 410.44 | 0 / 0 / 0 |
| 1440 × 900 | 248 | 278 × 824 | 868 | 616 | 0 / 0 / 0 |

All panel-state controls, including send, remain inside the composer. The panel close action
removes both the DOM surface and `panel` URL state.

Playwright also verified project/global task counts (4/5), project inactive state outside a
project, prompt-to-textarea input, model switching to `5.6 Sol · 标准`, and `none / 0s` waveform
animation under reduced motion. The only raster resource is `/background.png`; console output
contains zero errors and zero warnings. Evidence is under
`output/playwright/miku-structure-a4-v01/`.
