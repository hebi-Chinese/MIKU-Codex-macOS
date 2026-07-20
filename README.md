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

预览中的角色背景不随公开源码分发。安装后请导入你有权使用的纯背景图；侧栏、项目、任务、环境信息、输入框和菜单继续来自真实 Codex。

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

# 选择你自己的背景并应用主题
"$STUDIO/scripts/customize-theme-macos.sh"
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
- 背景、运行状态、日志、缓存、个人主题包和构建产物默认不进入 Git。

## 源码位置

- [`macos/assets/miku-a4-adapter.js`](./macos/assets/miku-a4-adapter.js)：真实 DOM 识别、图标配方、灵感与生命周期
- [`macos/assets/miku-a4.css`](./macos/assets/miku-a4.css)：MIKU 视觉层、响应式与 reduced-motion
- [`macos/assets/miku-love-words-icons.svg`](./macos/assets/miku-love-words-icons.svg)：主题 SVG sprite
- [`macos/assets/miku-codex-app-icon.svg`](./macos/assets/miku-codex-app-icon.svg)：MIKU Codex 应用图标源文件
- [`macos/scripts/`](./macos/scripts/)：安装、启动、验证、恢复与打包脚本

本仓库当前以 macOS MIKU 版本为主。已知的 bundled Node/runtime-state 恢复阻塞仍在记录中，因此这里不声称全量 `npm test` 已通过。

## 上游与许可

本项目基于 [Fei-Away/Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin) 继续开发。特别感谢 **Fei-Away** 以及原项目的所有贡献者，为 Codex 外部换肤、macOS 注入与安全恢复机制打下基础。本仓库继续保留上游的 MIT 许可与 NOTICE；详见 [`macos/LICENSE`](./macos/LICENSE) 和 [`macos/NOTICE.md`](./macos/NOTICE.md)。

初音未来 / Hatsune Miku、Codex 及相关名称、角色、商标和素材权利归各自权利人。本仓库是非官方粉丝项目；公开或商业分发背景与角色素材前，请自行完成权利确认。
