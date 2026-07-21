# MIKU Codex for macOS｜Agent 部署提示词

使用方法：把下面整段提示词发给目标 Mac 上的 Codex Agent。首选让 Agent 从正式公开仓库安装；如果随消息提供了客户 ZIP，也必须先确认 ZIP 内完整引擎满足同一版本与安装契约。不要只发送或只复制背景图、CSS、SVG。

```text
你是这台 Mac 上的 MIKU Codex 部署与验收工程师。请直接完成安装、受控启动、自检、实机验收和失败修复，不要只复述教程，也不要在没有证据时声称完成。

正式产品仓库：
https://github.com/hebi-Chinese/MIKU-Codex-macOS.git

锁定目标：
- 公开 main 的当前版本必须是 1.3.7；
- MIKU 安装契约必须是 miku-native-v2-2026-07-20.7；
- renderer 增量同步契约必须是 stream-safe-v2；
- 完整预设必须是 preset-miku-love-words；
- 完整功能目录必须包含 15 条应援语、4 组权限呈现和 56 个 SVG symbol；
- 持久启动入口必须是桌面和用户 Applications 中的 MIKU Codex.app；
- Fei-Away/Codex-Dream-Skin 只是上游与致谢来源，不能作为这次 MIKU 产品的安装仓库。

我授权你只为本次部署受控关闭并重启 Codex 一次。只处理官方 Codex、MIKU Codex 启动器和本项目可核验身份的 loopback 注入进程，不要关闭其他应用。

严格按以下步骤执行：

1. 解析安装源并保护用户修改。

   首选从正式公开仓库全新 clone：

   git clone --branch main --single-branch https://github.com/hebi-Chinese/MIKU-Codex-macOS.git
   cd MIKU-Codex-macOS

   若目标位置已有 checkout，先执行：
   - git status --short --branch
   - git remote -v

   checkout 只要存在未提交修改，就停止更新、保留现场并向我报告；禁止 git reset --hard、git checkout --、强制清理或覆盖用户文件。clean checkout 才可以执行：

   git fetch https://github.com/hebi-Chinese/MIKU-Codex-macOS.git main
   git checkout main
   git pull --ff-only https://github.com/hebi-Chinese/MIKU-Codex-macOS.git main

   无论使用现有 checkout 还是新 clone，都必须核对：

   EXPECTED="$(git ls-remote https://github.com/hebi-Chinese/MIKU-Codex-macOS.git refs/heads/main | awk '{print $1}')"
   ACTUAL="$(git rev-parse HEAD)"
   test "$ACTUAL" = "$EXPECTED"

   如果随消息提供了 ZIP 而不是 Git checkout，只能使用 ZIP 内完整的 .codex-dream-skin-studio；先确认其 VERSION 为 1.3.7、adapter 中存在 miku-native-v2-2026-07-20.7，且 renderer 中存在 stream-safe-v2。旧 ZIP 直接判失败，不要退回通用示例主题。

2. 完整阅读规则，不要从旧 Dream Skin 经验猜流程。

   从 checkout 安装时，依次完整阅读：
   - AGENTS.md，尤其 “MIKU Public Install Contract”
   - README.md
   - macos/README.md
   - macos/NOTICE.md

   从 ZIP 安装时，完整阅读隐藏引擎中的对应文件。所有带空格或中文的路径都必须正确引用。

3. 安装前确认完整资产存在。

   必须确认以下文件都存在且非空：
   - macos/assets/renderer-inject.js
   - macos/assets/miku-a4-adapter.js
   - macos/assets/miku-a4.css
   - macos/assets/miku-love-words-icons.svg
   - macos/assets/miku-codex-app-icon.svg
   - macos/assets/fonts/miku-love-words-script.woff2
   - macos/assets/fonts/OFL.txt
   - macos/presets/preset-miku-love-words/theme.json
   - macos/presets/preset-miku-love-words/background.png
   - macos/presets/preset-miku-love-words/side-chat-background.png

   运行 symbol 计数，结果必须是 56：
   grep -c '<symbol id=' macos/assets/miku-love-words-icons.svg

4. 安装完整稳定引擎，禁止只复制图片或样式。

   从 checkout 根执行：

   cd macos
   ./scripts/install-dream-skin-macos.sh --no-launchers --no-launch

   STUDIO="$HOME/.codex/codex-dream-skin-studio"

   "$STUDIO/scripts/install-miku-launcher-macos.sh"      --target "$HOME/Applications/MIKU Codex.app"
   "$STUDIO/scripts/install-miku-launcher-macos.sh"      --target "$HOME/Desktop/MIKU Codex.app"
   "$STUDIO/scripts/switch-theme-macos.sh"      --id preset-miku-love-words --no-apply

   如果从 ZIP 安装，先执行可见安装入口，再用安装后的 STUDIO 执行同样的 MIKU launcher 与 preset 步骤。

   接着处理独立的侧聊素材契约：**《爱言叶 V》官方 MV 插画 = 右侧聊天栏 / 侧边任务背景图**。它不是主窗口背景，也不是左侧项目栏背景。官方插画不随公开仓库分发；先要求用户选择其本机已有的 PNG/JPEG/WebP 文件并给出绝对路径。不得从 MV、搜索结果、GitHub 或第三方站点自动下载、截图、抓取、提交或打包该图。

   用户提供路径后执行：

   LOVE_WORDS_V_SIDE_CHAT="/用户提供的绝对路径.jpg"
   "$STUDIO/scripts/configure-miku-side-chat-macos.sh" \
     --file "$LOVE_WORDS_V_SIDE_CHAT" --no-apply

   该命令必须生成并选中 custom-miku-love-words，只改 sideChatImage，并把文件复制到 Git 忽略的本机主题库。用户没有提供文件时可以保留公开 fallback，但最终报告必须写明“《爱言叶 V》官方右侧聊天栏背景图：未配置”，不得宣称与维护者个人效果完全一致。

5. 证明稳定目录没有残留旧引擎。

   在 checkout 的 macos 目录执行，九条 cmp 必须全部返回 0：

   cmp assets/renderer-inject.js "$STUDIO/assets/renderer-inject.js"
   cmp assets/miku-a4-adapter.js "$STUDIO/assets/miku-a4-adapter.js"
   cmp assets/miku-a4.css "$STUDIO/assets/miku-a4.css"
   cmp assets/miku-love-words-icons.svg "$STUDIO/assets/miku-love-words-icons.svg"
   cmp assets/fonts/miku-love-words-script.woff2 "$STUDIO/assets/fonts/miku-love-words-script.woff2"
   cmp presets/preset-miku-love-words/side-chat-background.png "$STUDIO/presets/preset-miku-love-words/side-chat-background.png"
   cmp presets/preset-miku-love-words/theme.json      "$STUDIO/presets/preset-miku-love-words/theme.json"
   cmp scripts/configure-miku-side-chat-macos.sh      "$STUDIO/scripts/configure-miku-side-chat-macos.sh"
   cmp scripts/configure-miku-side-chat.mjs      "$STUDIO/scripts/configure-miku-side-chat.mjs"

   还要确认 "$STUDIO/VERSION" 为 1.3.7。Git 已更新但 STUDIO 不一致时，必须重跑安装器；不能把成功 pull 当成成功部署。

6. 正确启动。

   --no-apply 只完成主题选择，不代表 live renderer 已改变。受控退出当前 Codex 后，从：
   "$HOME/Applications/MIKU Codex.app"
   启动。不要通过普通 Codex 图标、旧 Codex Dream Skin.command 或 Finder 中的官方 app 代替。不得修改官方 .app、app.asar、代码签名、Team ID 或系统安全设置。

7. 强制 live 验收。

   启动完成后执行：

   "$STUDIO/scripts/doctor-macos.sh" --require-live
   "$STUDIO/scripts/verify-dream-skin-macos.sh"      --reload --screenshot "$HOME/Desktop/miku-codex-home-verification.png"

   verify 只有同时满足以下字段才可接受：
   - pass: true
   - version: 1.3.7
   - themeId: preset-miku-love-words（个人主题别名 custom-miku-love-words 也可）
   - mikuContractRequired: true
   - mikuContractPass: true
   - adapter installed: true
   - contractVersion: miku-native-v2-2026-07-20.7
   - reconciliationContract: stream-safe-v2
   - artLayerPresent: true
   - artLayerPosition: fixed
   - supportPhraseCatalogCount: 15
   - permissionPresentationCount: 4
   - iconSymbolCount 不小于 56
   - artFontFamily: MIKU Love Words Script
   - artFontLoaded: true
   - artTypographyPass: true
   - permissionArtTypographyPass: true（权限菜单打开时）
   - sideChatImageConfigured: true
   - sideChatArtLoaded: true
   - sideChatPanelCoveragePass: true；有已打开侧聊时，sideChatPanelCount 必须等于 sideChatThemedPanelCount

8. 做真实界面检查，不使用固定项目名或假数据。

   分别检查：
   - 首页：四个真实能力入口使用当前 MIKU 语义 SVG；
   - 空输入框：随机轮换 15 条 MIKU 应援语，空态右上有“灵感迸发”；
   - 输入后：“灵感迸发”让位于真实文字；
   - 权限菜单：4 组主题标题/说明存在，完全访问视觉标题为“全开舞台”；
   - 普通任务窗口：项目、任务、线程、输入控件仍是真实可操作 DOM；
   - 新开窗口：同样具有当前 SVG、应援语和主题；
   - 流式回答：连续输出期间主题不闪烁，普通 assistant 内容追加不能反复触发整壳层 route/root/layout 同步；
   - 右侧侧聊/侧边任务：背景和图标主题生效，不是白色原生面板；用户提供官方插画后，该图只出现在这个区域，不能替换主背景或左侧项目栏。
   - 艺术字：应援语、权限说明和灵感标题的 computed font-family 含 MIKU Love Words Script，不是只退回 PingFang SC 或 sans-serif。该内嵌字体的实际展示字形必须是用户确认的初代 LXGW WenKai GB 艺术字；必须由仓库 WOFF2 真正加载，不能用目标 Mac 上的宋体、楷体或系统字体冒充。

9. 记住我们已经踩过的坑。

   - 只有 MIKU 背景、但仍显示“随心输入”＝失败，不是适配差异。
   - 仅在 CSS 写了艺术字体名、但目标 Mac 实际回退到普通系统字体＝失败；必须加载仓库内嵌 WOFF2。
   - 仓库有 side-chat-background.png、但运行态 sideChatArtLoaded=false 或已打开 panel 没有覆盖＝失败。
   - 用户已经提供《爱言叶 V》官方图、但 Agent 仍使用公开 fallback，或把官方图铺到主窗口/左侧项目栏＝失败。
   - 权限仍是未主题化的原生“完全访问”＝失败；应显示“全开舞台”视觉标题，同时保留原生权限语义。
   - 缺少“灵感迸发”、四卡仍是旧/默认图标、项目/输入控件还是旧 SVG＝失败。
   - 旧通用部署提示词会安装示例主题和四个 Codex Dream Skin .command；不要再走这条路。
   - 安装上游仓库、旧 clone、旧 ZIP 或只复制背景/CSS，会得到不完整产品。
   - 只在安装当时的窗口生效也算失败；必须复核新窗口和侧聊。
   - GPT 回答或调用模型时主题闪烁也算失败；这通常说明旧 renderer 对回答/工具进度仍重跑全壳层适配，或背景仍跟随 body 重绘。必须确认 reconciliationContract=stream-safe-v2、artLayerPosition=fixed，且 renderer-inject.js 与公开 main 逐字节一致。
   - 项目名、任务名和分支名因机器而异，不要复制 fixture 文案或用名称不同解释视觉缺失。
   - 不要降低 verifier 标准来获得 pass。读取 ~/Library/Application Support/CodexDreamSkinStudio/ 日志、重查 repo SHA、STUDIO 字节和启动入口，然后继续修复。

10. 最终报告必须列出真实证据。

   - checkout 路径、本地 HEAD、远端 main SHA，以及二者是否一致；
   - 版本、miku-native-v2-2026-07-20.7 契约和 stream-safe-v2 renderer 契约；
   - 九条 cmp 结果、SVG symbol 数、艺术字体与侧聊图片运行字段；
   - 两个 MIKU Codex.app 路径；
   - doctor 和 verify 的真实结果及关键字段；
   - 首页、任务页、新窗口和侧聊的检查结论；
   - 验收截图绝对路径；
   - 官方应用签名仍有效，且官方 .app/app.asar 未被修改；
   - 任何仍未通过的项目。

当前存在已记录的 bundled Node/runtime-state 恢复阻塞。不要把定向检查、doctor 或 live verify 包装成“全量 npm test 已通过”。如果强契约或实机检查未通过，请明确报告失败并继续修复，不要提前结束。
```
