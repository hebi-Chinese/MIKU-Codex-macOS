# MIKU Codex for macOS

<p align="center">
  <strong>中文</strong> · <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img src="macos/assets/miku-codex-app-icon.svg" alt="MIKU Codex 图标" width="112">
</p>

<p align="center">
  <strong>把真实 Codex 工作台变成一套有 MIKU 气息的 macOS 主题。</strong><br>
  原生 DOM 适配 · 本机回环注入 · 独立 MIKU Codex 启动入口
</p>

> 非 OpenAI 或 Crypton Future Media 官方产品。本项目不会修改官方 `Codex.app`、`app.asar` 或代码签名。

## 效果预览

<p align="center">
  <img src="docs/images/miku-codex-preview.png" alt="MIKU Codex macOS 真实注入效果" width="1100">
  <br>
  <sub>真实 Codex 注入效果；截图内容已由仓库所有者确认为可公开展示。</sub>
</p>

仓库现在随附可直接安装的公开 MIKU 预设。主背景和侧聊专用背景都在 `macos/presets/preset-miku-love-words/`；侧聊公开图由同一主背景裁切，不是《爱言叶 V》官方 MV 原图。

## 内置 MIKU 资产

<p align="center">
  <a href="macos/presets/preset-miku-love-words/background.png"><img src="macos/presets/preset-miku-love-words/background.png" alt="MIKU Codex 主背景" width="520"></a>
  <a href="macos/presets/preset-miku-love-words/side-chat-background.png"><img src="macos/presets/preset-miku-love-words/side-chat-background.png" alt="MIKU Codex 侧聊背景" width="260"></a>
</p>

<p align="center">
  <a href="docs/images/miku-svg-system.svg"><img src="docs/images/miku-svg-system.svg" alt="MIKU Codex SVG 图标系统" width="780"></a>
  <br>
  <sub>图标不是截图切片：运行时从 SVG sprite 按真实控件语义动态选择。</sub>
</p>

- [`macos/presets/preset-miku-love-words/background.png`](./macos/presets/preset-miku-love-words/background.png)：主窗口背景
- [`macos/presets/preset-miku-love-words/side-chat-background.png`](./macos/presets/preset-miku-love-words/side-chat-background.png)：公开侧聊专用背景
- [`macos/assets/miku-love-words-icons.svg`](./macos/assets/miku-love-words-icons.svg)：完整 UI SVG sprite
- [`macos/assets/miku-codex-app-icon.svg`](./macos/assets/miku-codex-app-icon.svg)：彩色桌面应用图标 SVG 源
- [`macos/assets/fonts/miku-love-words-script.woff2`](./macos/assets/fonts/miku-love-words-script.woff2)：随主题内嵌的艺术字子集
- [`macos/assets/fonts/OFL.txt`](./macos/assets/fonts/OFL.txt)：艺术字字体许可

## 这套主题做了什么

- 保留真实 Codex 项目、任务、线程、状态、输入控件和点击行为，不用整窗截图伪装应用。
- 用语义化 SVG 配方覆盖主导航、项目、四个首页能力入口、环境侧栏和输入框控件；不需要为每个项目准备一张位图。
- 为主输入框和侧边任务输入框提供独立的空态“灵感迸发”，候选仍来自当前项目中的真实任务。
- 内置 15 条轮换的 MIKU 应援文案，使用克制的艺术字体、颜文字和文本符号；输入后立即让位于真实内容。
- 主题化模型速度、权限菜单和“全开舞台”等视觉短标签，同时保留原生权限值与可访问语义。
- 统一首页、任务页、右侧环境信息和侧边聊天背景，并为 `prefers-reduced-motion` 关闭非必要动效。
- 安装独立的彩色 `MIKU Codex.app`。以后从这个入口启动，主题会随 Codex 冷启动恢复；退出 Codex 后不会被后台强行拉起。

## 系统要求

- macOS 13 或更高版本
- 已安装官方 Codex Desktop，并至少正常启动过一次
- 安装时先退出 Codex，避免它同时写入本地配置
- 不需要单独安装全局 Node.js；运行时会验证并使用官方 Codex 自带的签名 Node

## 交给 Codex Agent 安装

如果是让另一台 Mac 上的 Codex 帮你部署，把下面这段完整发给它。详细的坑、禁止项、失败锚点和验收字段已经写入 [`AGENTS.md`](./AGENTS.md) 与 [`macos/CLIENT_DEPLOY_PROMPT.md`](./macos/CLIENT_DEPLOY_PROMPT.md)。

```text
请从 https://github.com/hebi-Chinese/MIKU-Codex-macOS.git 的公开 main 安装 MIKU Codex for macOS。开始前完整阅读仓库根目录 AGENTS.md、README.md 和 macos/README.md，并严格执行 AGENTS.md 的 “MIKU Public Install Contract”。不要只复制背景、CSS 或 SVG，不要安装 Fei-Away 上游仓库，也不要沿用四个旧 Dream Skin .command 入口。已有 checkout 必须先保护本地修改，再用 fast-forward 更新并核对本地/远端 SHA；随后重装稳定引擎、选择 preset-miku-love-words、逐字节比较 adapter、CSS、SVG、内嵌艺术字 WOFF2、侧聊图片和 preset，并安装桌面和 Applications 两个 MIKU Codex.app。《爱言叶 V》官方 MV 插画只允许作为右侧聊天栏 / 侧边任务背景图，不是主背景或左侧项目栏；请先向我索取本机已有图片的绝对路径，再运行 configure-miku-side-chat-macos.sh 本地导入，不得自动下载或上传该图。没有本机文件时必须报告使用公开 fallback，不能声称完全一致。我授权你只为本次安装受控关闭并重启 Codex 一次，必须从 MIKU Codex.app 启动。最后运行 doctor --require-live 和 live verify，只有 version=1.3.2、mikuContractPass=true、contractVersion=miku-native-v2-2026-07-20.2、15 条应援语、4 组权限呈现、至少 56 个 SVG symbol、artTypographyPass=true、sideChatArtLoaded=true 和 sideChatPanelCoveragePass=true 全部满足才算完成。若仍出现普通系统字体、“随心输入”、原生“完全访问”、缺少“灵感迸发”、旧四卡图标或白色侧聊面板，视为失败并继续修复，不要只说背景已经生效。
```

## 安装

```bash
git clone https://github.com/hebi-Chinese/MIKU-Codex-macOS.git
cd MIKU-Codex-macOS/macos

# 安装稳定运行目录；不创建旧的 Dream Skin 桌面快捷脚本，也不自动启动
./scripts/install-dream-skin-macos.sh --no-launchers --no-launch

STUDIO="$HOME/.codex/codex-dream-skin-studio"

# 安装唯一的 MIKU 启动入口（桌面 + 用户 Applications）
"$STUDIO/scripts/install-miku-launcher-macos.sh" \
  --target "$HOME/Applications/MIKU Codex.app"
"$STUDIO/scripts/install-miku-launcher-macos.sh" \
  --target "$HOME/Desktop/MIKU Codex.app"

# 选择仓库内置的完整 MIKU 预设
"$STUDIO/scripts/switch-theme-macos.sh" \
  --id preset-miku-love-words --no-apply
```

以后直接打开桌面或用户 Applications 中的 `MIKU Codex.app`。它会从系统中已安装的官方 Codex 启动真实应用，再恢复仅绑定 `127.0.0.1:9341` 的主题注入。

## 验证与恢复

```bash
STUDIO="$HOME/.codex/codex-dream-skin-studio"

# 验证当前 loopback 会话和主题标记
"$STUDIO/scripts/verify-dream-skin-macos.sh"

# 完整移除主题配置并按官方方式重新启动 Codex
"$STUDIO/scripts/restore-dream-skin-macos.sh" \
  --restore-base-theme --restart-codex
```

## 安全边界

- CDP 只绑定本机回环地址；主题运行期间仍不要运行来路不明的本机程序。
- 注入器只接受校验过的 Codex 进程及预期 `app://` renderer。
- 官方应用包、`app.asar`、Team ID 和代码签名保持不变。
- 主题不会改写 API Key、Base URL、模型供应商或你的任务数据。
- 内置公开预设进入 Git；个人背景、运行状态、日志、缓存、主题包和构建产物仍默认忽略。

## 源码位置

- [`macos/assets/miku-a4-adapter.js`](./macos/assets/miku-a4-adapter.js)：真实 DOM 识别、图标配方、灵感与生命周期
- [`macos/assets/miku-a4.css`](./macos/assets/miku-a4.css)：MIKU 视觉层、响应式与 reduced-motion
- [`macos/assets/miku-love-words-icons.svg`](./macos/assets/miku-love-words-icons.svg)：主题 SVG sprite
- [`macos/assets/miku-codex-app-icon.svg`](./macos/assets/miku-codex-app-icon.svg)：MIKU Codex 应用图标源文件
- [`macos/assets/fonts/miku-love-words-script.woff2`](./macos/assets/fonts/miku-love-words-script.woff2)：运行时内嵌艺术字子集
- [`macos/assets/fonts/OFL.txt`](./macos/assets/fonts/OFL.txt)：SIL OFL 1.1 与上游版权说明
- [`macos/presets/preset-miku-love-words/`](./macos/presets/preset-miku-love-words/)：可直接播种的主背景、侧聊背景与主题元数据
- [`docs/images/miku-svg-system.svg`](./docs/images/miku-svg-system.svg)：SVG 图标视觉总览
- [`macos/scripts/`](./macos/scripts/)：安装、启动、验证、恢复与打包脚本

本仓库当前以 macOS MIKU 版本为主。已知的 bundled Node/runtime-state 恢复阻塞仍在记录中，因此这里不声称全量 `npm test` 已通过。

## 上游与许可

本项目基于 [Fei-Away/Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin) 继续开发。特别感谢 **Fei-Away** 以及原项目的所有贡献者，为 Codex 外部换肤、macOS 注入与安全恢复机制打下基础。本仓库继续保留上游的 MIT 许可与 NOTICE；详见 [`macos/LICENSE`](./macos/LICENSE) 和 [`macos/NOTICE.md`](./macos/NOTICE.md)。

初音未来 / Hatsune Miku、Codex 及相关名称、角色、商标和素材权利归各自权利人。本仓库是非官方、非商业粉丝项目。内置 MIKU 背景不属于 MIT 软件许可；具体边界见 [`macos/NOTICE.md`](./macos/NOTICE.md)。《爱言叶 V》官方 MV 插画没有被提交到本仓库。
