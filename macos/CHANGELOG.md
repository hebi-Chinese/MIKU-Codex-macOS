# Changelog

## 1.3.6 — 2026-07-20

### 修复

- 按最终视觉选择，把应援语、权限主题文案与灵感标题恢复为 1.3.4 使用的 `Ma Shan Zheng` 手写展示体；字体二进制与对应字号、字距表现均回到已确认版本，而不是继续使用 1.3.5 的 `ZCOOL KuaiLe`。
- 保留 1.3.5 的固定全窗口合成层、语义化 DOM 对账和 `stream-safe-v2` 防闪屏适配，不回退流式回答期间的稳定性修复。
- 版本提升为 `1.3.6`，MIKU 安装契约提升为 `miku-native-v2-2026-07-20.6`；目标 Agent 必须验证仓库内嵌 WOFF2 的真实加载结果，不能用本机系统字体替代。

### 说明

- 正文、项目、任务、代码和原生控件继续使用稳定 UI 字体；手写展示体只覆盖 MIKU 短文案。
- `Ma Shan Zheng` 子集覆盖主题实际使用的全部 175 个 CJK 字符，SIL OFL 1.1 与官方来源随仓库保留。

## 1.3.5 — 2026-07-20

### 修复

- 将短应援语、权限主题文案与灵感标题的内嵌字体替换为 Google Fonts 官方 `ZCOOL KuaiLe` 中文展示字。它在 13–19px 仍有明显圆润、跳跃的图形特征，不再把“技术上命中 Web Font”误当成“视觉上已经是艺术字”。
- renderer 对账升级为语义白名单：普通回答、工具进度和未知非结构 DOM 增量不再触发整套 route sync；composer、sidebar、菜单、右侧 panel 等明确结构变化仍按帧合并同步。
- 新增稳定的 `codex-dream-skin-art-layer` 固定合成层。全窗口背景不再绘制在依赖动态 `:has(main...)` 的 body 背景上，流式正文重绘不会拆装或切换大图节点。
- live verify 新增 art layer 存在、固定定位和 pointer-events 契约。版本提升为 `1.3.5`，MIKU 安装契约提升为 `miku-native-v2-2026-07-20.5`，renderer 增量同步契约提升为 `stream-safe-v2`。

### 说明

- `ZCOOL KuaiLe` 子集覆盖主题实际使用的全部 175 个 CJK 字符；颜文字和字体本身没有的装饰符号继续通过显式 fallback 渲染。原始 SIL OFL 1.1 与官方来源随仓库保留。
- 正文、项目、任务、代码和原生控件仍使用稳定 UI 字体；展示字只覆盖 MIKU 短文案。

## 1.3.4 — 2026-07-20

### 修复

- 将应援语、权限标题、权限说明与灵感标题使用的内嵌艺术字，从视觉接近普通正文的 LXGW WenKai GB 子集替换为 Google Fonts 官方 `Ma Shan Zheng` 手写展示字体子集；继续通过 `MIKU Love Words Script` CSS 别名内嵌，不依赖目标 Mac 的系统字体。
- 权限标题与说明固定使用字体真实的 400 字重并关闭浏览器合成粗体，避免 500/600 伪粗体把手写笔触压回普通系统字效果。
- adapter verify 新增 `permissionArtFontFamilies` 与 `permissionArtTypographyPass`，权限菜单打开时逐项验证艺术字体；安装契约提升为 `miku-native-v2-2026-07-20.4`，版本提升为 `1.3.4`。

### 说明

- 字体来源与 SIL OFL 1.1 许可同步更新到官方 `google/fonts/ofl/mashanzheng`；子集仍只覆盖主题实际使用的应援语、权限、灵感与符号字符。
- 本轮不重启或 live 覆盖当前 Codex；稳定目录和当前窗口只有在重新安装/应用 1.3.4 后才会切换到新字体。

## 1.3.3 — 2026-07-20

### 修复

- renderer 的全局 MutationObserver 现在区分产品结构变化与回答内容流：普通 GPT/assistant 文本持续写入不再触发首页、侧栏、composer、右侧面板和 SVG 的整套 route reconcile；新增 composer、侧栏、菜单或 panel 仍按帧合并同步。
- 修复 root observer 自激回路：已存在的 `codex-dream-skin` 根类不再被重复写入，避免一次 root ensure 连续唤醒下一次 root ensure。
- 4 秒恢复巡检改为健康检查；主题 style、SVG chrome、主壳层和 MIKU 布局标记完整时保持零写入，只有骨架缺失时才执行恢复。
- 新增 `stream-safe-v1` renderer reconciliation contract，live verify 与 Agent 安装契约会拒绝仍可能在 GPT 流式回答期间全壳层重扫的旧 renderer。稳定目录字节校验增加 `renderer-inject.js`，版本提升为 `1.3.3`，安装契约提升为 `miku-native-v2-2026-07-20.3`。

### 说明

- Playwright 在 1440×900 fixture 连续写入 120 帧回答内容并跨过两个 4 秒巡检窗口；`rootPasses`、`routePasses`、`layoutReads` 均保持不变，style、SVG chrome 和背景 URL 身份稳定，控制台 0 error / 0 warning。
- 本轮未重启或 live 覆盖当前 Codex；完整测试套件仍受已记录的 bundled Node/runtime-state 恢复问题影响，不把定向测试与 fixture 验证包装成全量测试通过。

## 1.3.2 — 2026-07-20

### 新增

- 新增 `configure-miku-side-chat-macos.sh`：目标用户可把自己本机已有的《爱言叶 V》官方 MV 插画导入为 `custom-miku-love-words` 的右侧聊天栏 / 侧边任务背景图；图片只进入 Git 忽略的本机主题库，不随仓库或客户包再分发。
- 根 `AGENTS.md`、MIKU skill、README 与两份客户部署提示词明确区分主背景、左侧项目栏和右侧聊天栏。目标 Agent 必须先向用户索取本机图片绝对路径，禁止自动下载或把公开替代图误报为完全一致。

### 修复

- 主题暂存和切换现在会把 `sideChatImage` 与主图、配置作为同一完整快照搬运，并在清理旧活动主题时保留独立侧聊图；修复“配置存在但切换时图片丢失”的路径。
- 安装契约升级为 `miku-native-v2-2026-07-20.2`，版本升级为 `1.3.2`。

### 说明

- 官方《爱言叶 V》插画仍不进入公开 Git、Release 或客户 ZIP；没有用户提供的本机文件时，公开侧聊替代图继续作为可用降级。
- 完整测试套件仍受已记录的 bundled Node/runtime-state 恢复问题影响；本版本不把定向契约与载荷测试包装成全量测试通过。

## 1.3.1 — 2026-07-20

### 修复

- 随引擎内嵌 `MIKU Love Words Script` 中文艺术字 WOFF2 子集，覆盖应援语、权限呈现与灵感标题；不再依赖目标 Mac 是否恰好安装 HanziPen/Hannotate，并保留 SIL OFL 1.1、字形清单和上游说明。
- renderer 明确报告侧聊图片是否已配置、是否成功载入；adapter 对每个打开的侧聊/侧边任务 panel 统计主题覆盖率，白色原生侧栏不再能通过强契约。
- 安装契约升级为 `miku-native-v2-2026-07-20.1`，Agent 必须字节比较字体与侧聊图，并取得 `artTypographyPass`、`sideChatArtLoaded`、`sideChatPanelCoveragePass` 三项真实运行证据。

### 说明

- 完整测试套件仍受已记录的 bundled Node/runtime-state 恢复问题影响；本版本不把定向契约与载荷测试包装成全量测试通过。

## 1.3.0 — 2026-07-20

### 修复

- 增加公开 MIKU 安装契约 `miku-native-v2-2026-07-20`，让另一台 Codex Agent 能区分完整 native-v2 主题与“只有背景/旧注入层”的残缺安装。
- live verifier 对 MIKU 预设强制检查当前 adapter、15 条应援语目录、4 组权限呈现和至少 56 个 SVG symbol；旧的“随心输入”、原生“完全访问”或缺少“灵感迸发”不再能被背景级校验掩盖。
- 根 `AGENTS.md`、README 和客户部署提示词统一为 MIKU 专用流程，锁定正式仓库、稳定引擎、公开 preset、两个 `MIKU Codex.app` 入口、字节级同步与失败锚点。

### 说明

- 完整测试套件仍受已记录的 bundled Node/runtime-state 恢复问题影响；本版本不把定向契约与载荷测试包装成全量测试通过。

## 1.2.0 — 2026-07-17

### 新增

- 增加 MIKU 个人版客户包构建器：把当前有效主题、完整引擎和安装/验证/恢复三个双击入口封装为独立 ZIP，并生成相邻 SHA-256 文件。安装时在目标 Mac 重新生成原生 MIKU applet，不把源机器用户路径或预生成 `.app` 写入归档。
- 增加用户级 `MIKU Codex.app` 双入口，可同时安装到桌面和用户 Applications；入口只调用稳定的 loopback 启动器，不修改或重签官方 Codex 包。
- `MIKU Codex.app` 增加原创亮色应用图标：代码括号、双音符、双尾波形与珊瑚红 `01` 组合为完整 macOS ICNS，不再显示灰色通用应用图标。
- MIKU 原生适配层增加权限说明行主题文案、运行中停止态，以及搜索、帮助、侧栏、底部面板和右工作区的受控 SVG 图标配方；所有动效支持 `prefers-reduced-motion`。
- 权限菜单增加四套独立的 MIKU SVG 与双行主题标题/说明；composer 权限入口同步显示紧凑状态名，完全访问态视觉显示“全开舞台”，原生权限值与可访问名称不变。
- 自适应图像主题引擎：通过本地 Canvas 分析亮度、主色、视觉焦点、左右安全区和图像比例，为任意背景图生成协调的浅色/深色外观；图片不会上传到外部服务。
- 主题新增 `appearance: auto | light | dark` 与 `art.focusX/focusY`（`0..1`）、`art.safeArea: auto | left | right | center | none`、`art.taskMode: auto | ambient | banner | off` 配置；显式值优先于自动分析。
- 首页与任务页按图像比例采用不同呈现：超宽图在任务页使用横幅和纵向渐隐，普通比例图使用低噪环境背景，也可用 `taskMode=off` 关闭任务页图像。
- 内置「桥本有菜」实测精选预设与 5 套可复现的程序化抽象预设；安装后幂等播种到主题库，菜单栏或 `switch-theme-macos.sh` 可直接切换，且绝不覆盖 `custom-*` 用户主题。
- 新增中英文参考图生图指南：明确 `2560 × 1440`、Image 1/2/3 职责、裁切安全区、原创/已授权成年身份两套流程，以及“文案和小照片不烘焙进背景”的约束。

### 改进

- 安装器会显式创建桌面和用户 Applications 两个 MIKU 入口；官方 Codex 可放在 `~/Applications/Codex.app`，发现与验签流程会在下次主题启动时使用该路径。
- MIKU 入口安装器会把同一 `MIKUCodex.icns` 写入两个 app bundle、声明 `CFBundleIconFile` 后再原子替换和签名；重复安装保持幂等。
- 权限菜单把四个原生标题与说明视觉替换为已确认的双行 MIKU 文案，同时把原始文本继续留在 DOM 与可访问树；composer 窄输入区遵循 Codex 原生图标态，不为主题短标签强行扩宽。
- watcher 在文档壳层出现后立即注入，按 CSS/主题/图片内容哈希热刷新并复用静态 payload；同一主题切换不再重复启动守护进程，减少原生界面闪现和后台轮询。
- 主题切换先完整暂存图片，最后原子发布 `theme.json`；全新安装在没有活动主题时先启用通用的「午夜极光」，已有活动主题保持不变。
- `load-image-theme-macos.sh` 可通过 `--appearance`、`--focus-x`、`--focus-y`、`--safe-area`、`--task-mode` 精确调节构图；旧主题缺省时使用安全自适应值。

### 修复

- 修复 `MIKU Codex.app` 从 Finder 或 Dock 点击时因文本脚本被声明为 bundle executable 而触发 LaunchServices `-10669`、导致冷启动无响应且主题无法恢复的问题。入口现在使用系统生成的通用 Mach-O applet，保留 loopback/非 KeepAlive 边界，并在失败时写稳定日志和显示明确提示。
- 修复首页输入工作台在原生能力卡未挂载时悬在窗口底部上方的问题。hero 恢复轻量 16/12/8px 位移，composer 不再继承标题 transform，而在原生 flex 流中用自动上边距吸收剩余空间；900/1024/1440/1728 四档输入面均保持在底部 16px 安全区内且无页面溢出。
- 修复亮色背景图在 ChatGPT/Codex 暗色模式下错误生成浅色皮肤壳的问题。`appearance=auto` 现在跟随原生/系统外观，避免白字叠在浅色面板上导致界面不可读。
- 修复从“设置 > 外观”返回“已安排的任务”等无输入框路由后，验证器因找不到 composer 而拒绝合法 Codex 主界面的问题。
- 首页不再在原生标题栏注入主题名称和圆形伪按钮；watcher 为后续完整导航注册更早的注入并缩短目标探测间隔，以减少原生界面先闪现再换肤的时间。
- 超宽任务横幅不再让背景伪元素在固定高度直接结束；图片仍按原比例置顶，遮罩与渐隐延续到整页，减少明显的底部截断感。
- 修复普通宽屏图片被 `contain` 与 `cover` 双层重复绘制的问题；标准 16:9 现在始终使用一张 `cover` 整窗背景，并按安全区和焦点保留主体。
- 修复沉浸任务页侧栏原生缩放热区继承背景后向主区延伸 20px、形成明显竖向分割的问题；同时统一顶栏、侧栏与输入框的半透明材质，并为输入框补上不受原生边框宽度影响的内描边。
- 16:9 宽图现在在首页也使用单张整窗背景，不再把同一图片重复绘制成 hero 卡片；插件、已安排和 Pull Requests 等工具路由会清除原生整块黑底，并将搜索框和撰写器统一为单层表面。任务页同时移除独立顶栏底色和撰写器后的原生底部渐变，避免顶部、底部出现重叠面板。
- SwiftBar 菜单栏标题恢复调色板图标，并加入静态回归检查，避免升级后只剩 `Skin ON` 文本。
- 浅色模式撰写器改为更通透的珍珠白表面，并修复占位文字被原生双重透明度削弱的问题；暗色模式继续使用单层实色表面。
- 兼容 Codex Desktop 更名：官方桌面端在 26.707 从 `Codex.app` 更名为 `ChatGPT.app`（bundle id 仍是 com.openai.codex）。发现 / 启动流程现在两种名字都识别，且 `state.json` 缓存的旧 app 路径若已不存在则不再劫持启动——此前更新后会因指向旧 `Codex.app` 而启动失败
- 菜单栏与 `status-dream-skin-macos.sh` 不再依赖 `/usr/bin/python3`（macOS 12.3+ 默认不预装）读取主题名与运行状态，改用纯 shell 解析；此前在未装 Xcode 命令行工具的机器上，主题名会退化成 id、`--json` 状态直接失效

### 安全

- CDP 端点必须由已验证的官方 Codex 可执行文件或其子进程监听；WebSocket 还会校验 loopback、page ID、路径、无重定向，并安全处理畸形消息和发送异常。
- 主题配置与图片使用真实路径 containment，拒绝 symlink 越界、空文件、超过 16 MB、单边超过 16384 px 或超过 50 MP 的图片；主题展示文本拒绝换行和控制字符。
- AppleScript 动态内容全部通过 argv 传递；SwiftBar 过滤主题 ID、文件名和菜单文本，避免主题元数据改变菜单属性或命令参数。
- `config.toml` 只按严格 UTF-8 读取，拒绝 NUL、歧义多行 TOML、重复 `[desktop]`，通过用户级锁、原始字节核验和同目录原子替换保护中文配置与并发写入。
- 暂停和恢复会在 TERM/KILL 前后核验 watcher 的 PID、启动时间、Node 和 injector 路径；不匹配的进程绝不结束，已确认 watcher 若无法停止则保留 state 并中止，不再报告假成功。

### 测试

- 增加 MIKU 客户包真实构建/解包回归：校验主题预设、三入口执行权限、背景哈希、归档 SHA-256，并拒绝 `.git`、Playwright/output、auth/state/log、符号链接与预生成 `MIKU Codex.app`。
- 覆盖每套预设的可注入性与播种幂等、首页/任务 renderer、早期注入、主题原子切换、中文与 CRLF/BOM 配置往返、非法 UTF-8/NUL/TOML 拒绝、路径穿越、symlink 越界、控制字符和像素炸弹。

### 说明

- 「桥本有菜」源图、标准化背景和浅/暗实机截图分别归档；截图只作预览，不能当背景导入。用户提供的图像不自动获得 MIT 素材许可，公开再分发前仍需确认相应权利。

---

## 1.1.2 — 2026-07-16

### 修复

- 修正内置主题引用了未随仓库发布的背景文件，恢复使用 bundled abstract demo 素材
- 更新主题配置往返测试：安装只备份外观键，不再错误断言强制切换深色模式
- 恢复原本没有 `[desktop]` 配置段的用户设置时，不再额外写入空段
- 热切换读取运行状态时复用 Codex 内置 Node.js，不再依赖系统 `python3` 或执行 `eval`
- 显式传入的 `--theme-dir` 缺少 `theme.json` 时立即报错，不再静默回退到内置 demo 主题

---

## 1.1.1 — 2026-07-16

### 修复

- 不再用 `launchctl submit` 托管带调试口的 Codex：退出 SwiftBar / 关掉 Codex 后不应再被 launchd 自动拉起
- 暂停与完全恢复时清理 `com.openai.codex-dream-skin-studio.app` 作业

---

## 1.1.0 — 2026-07-16

### 新增

- SwiftBar 菜单栏入口（`Install Menu Bar.command`）：应用 / 暂停 / 换图 / 切换已保存主题 / 从图片文件夹加载 / 完全恢复
- 主题库（`themes/`）与图片投放目录（`images/`）动态加载，不再把 README 图库合成图当背景素材
- 按 Codex 应用浅色 / 深色自动切换皮肤壳（`data-dream-shell`）

### 改进

- CDP 已就绪时热切换主题（重启 injector + 短时注入），换图更快
- 注入校验放宽（项目选择器等可选），避免误杀已生效皮肤
- 注入守护优先 `nohup`；暂停状态与路径大小写下停止逻辑更稳
- 安装时不再强制 `appearanceTheme=dark`，只备份桌面外观相关键，便于恢复与自动适配

### 视觉

- 以原版暗色 portal CSS 为结构底，叠加 light 壳与更薄横幅遮罩，减轻「换图看不清」
- 示例纯横幅：`docs/images/banner-arina-hashimoto-pure-no-ui.png`（无人机 UI 合成）

### 说明

- `docs/images/gallery/` 仅为效果预览，不要当 `theme` 背景导入

---

## 1.0.0 — 2026-07-15

- 发布 macOS 通用主题制作器，而不是固定角色皮肤。
- 加入 Finder 选图、自动 JPEG 转换、主题命名和高级配色参数。
- 主页使用独立横幅，任务页使用背景与磨砂层，完整保留原生交互。
- 改为复用并验证 Codex 官方签名 Node.js，不再附带大型运行时或依赖全局 Node。
- 增加独立安装目录、桌面启动/定制/验证/恢复入口。
- 增加官方签名、CDP 端口归属、PID 身份、刷新重注入和真实 DOM 自检。
- 增加原子配置备份、精确恢复、静态测试、安装恢复循环和发布打包脚本。
- 清理固定角色内部命名；传送门主题仅作为可替换示例素材。
- 开源树：示例横幅改为无角色抽象几何图；验收截图不入库；补充 NOTICE / README 商标与安全边界说明。
