const informationModel = Object.freeze({
  navItems: [
    { id: "new-task", label: "新建任务", icon: "plus" },
    { id: "scheduled", label: "已安排", icon: "clock" },
    { id: "skills", label: "技能", icon: "cube" },
    { id: "sites", label: "站点", icon: "grid" },
    { id: "pull-requests", label: "拉取请求", icon: "branch" },
    { id: "chat", label: "聊天", icon: "chat" },
  ],
  project: {
    id: "system-build",
    label: "系统搭建",
    branch: "main",
    iconRecipe: "system-grid",
  },
  tasks: [
    "检查 Codex Dream Skin",
    "分析 codex-miku-theme",
    "查询 Codex200 使用额度",
    "打造在线车库展示页",
    "公域内容拆解延伸",
  ],
  taskWindows: {
    global: [
      "检查 Codex Dream Skin",
      "分析 codex-miku-theme",
      "查询 Codex200 使用额度",
      "打造在线车库展示页",
      "公域内容拆解延伸",
    ],
    project: [
      "继续重构 MIKU 皮肤结构",
      "定位 Codex 换肤源码",
      "添加 Codex stop hook 提醒",
      "下载最新 GPT SoVITS 4版",
    ],
  },
  features: [
    { id: "explore", title: "探索并理解代码", detail: "定位实现、依赖与行为", icon: "code", cue: "EXPLORE" },
    { id: "build", title: "构建新功能或工具", detail: "从需求推进到可验证结果", icon: "build", cue: "BUILD" },
    { id: "review", title: "审查代码并提出建议", detail: "检查风险、回归与可维护性", icon: "review", cue: "REVIEW" },
    { id: "fix", title: "修复问题和失败", detail: "复现、诊断并验证修复", icon: "fix", cue: "REPAIR" },
  ],
  promptTemplates: [
    "写一段应援文案",
    "做一个演唱会落地页",
    "生成 Miku 配色组件",
    "设计直播间 UI",
    "修复前端样式问题",
  ],
  inspirationTemplates: [
    { label: "歌词生成器", prompt: "构建一个歌词生成器：支持主题、段落结构和押韵风格设置。" },
    { label: "虚拟演唱会页面", prompt: "制作一个虚拟演唱会页面：包含场次信息、节目单和响应式舞台视觉。" },
    { label: "音源海报工坊", prompt: "设计一个音源海报工坊：根据曲名、氛围和配色生成可编辑海报布局。" },
    { label: "今日穿搭", prompt: "构建一个今日穿搭灵感页：按天气、场景和 Miku 配色组织搭配建议。" },
    { label: "灵感收藏夹", prompt: "制作一个灵感收藏夹：支持标签、筛选、备注和快速创建任务。" },
    { label: "Miku 灵感星球", prompt: "设计一个 Miku 灵感星球页面：用可访问的空间导航组织创作主题。" },
  ],
  heading: "我们应该在系统搭建中构建什么？",
  description: "描述任务，Codex 会在当前项目和分支中工作。",
});

const variants = Object.freeze({
  A: { name: "有边界的海报 Hero" },
  A2: { name: "A · MIKU 主题表达强化" },
  A3: { name: "A · 真实输入比例与完整海报" },
  A4: { name: "A · 上下文工作台与生态面板" },
  B: { name: "全窗口结构化工作台" },
  C: { name: "编辑式左右分栏" },
});

let toastTimer = null;

function icon(name, className = "") {
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="/icons.svg#icon-${name}"></use></svg>`;
}

const a2NavIcons = Object.freeze({
  "new-task": "plus-pop",
  scheduled: "calendar-pop",
  skills: "cube-pop",
  sites: "grid-pop",
  "pull-requests": "branch-pop",
  chat: "chat-pop",
});

const projectIconRecipes = Object.freeze({
  "system-grid": "project-system",
  default: "folder",
});

function usesDetailedMikuShell(variant) {
  return variant === "A2" || variant === "A3" || variant === "A4";
}

function getContextTasks(context) {
  return informationModel.taskWindows[context] || informationModel.taskWindows.global;
}

function renderProjectGlyph(project) {
  const recipe = project.iconRecipe in projectIconRecipes ? project.iconRecipe : "default";
  return icon(projectIconRecipes[recipe], "color-icon project-recipe-icon")
    .replace("<svg", `<svg data-project-key="${project.id}" data-icon-recipe="${recipe}"`);
}

function renderSidebar(variant, context = "project") {
  const detailedShell = usesDetailedMikuShell(variant);
  const sidebarTasks = variant === "A4" ? getContextTasks(context) : informationModel.tasks;
  const navButtons = informationModel.navItems.map((item, index) => `
    <button class="sidebar-button ${index === 0 ? "is-active" : ""}" type="button"
      data-action="nav" data-value="${item.id}" data-label="${item.label}">
      ${icon(detailedShell ? a2NavIcons[item.id] : item.icon, detailedShell ? "color-icon" : "")}<span>${item.label}</span>
    </button>`).join("");
  const taskButtons = sidebarTasks.map((task) => `
    <button class="task-button" type="button" data-action="${variant === "A4" ? "task-window" : "task"}" data-label="${task}">
      ${icon(detailedShell ? "task-glint" : "task", detailedShell ? "color-icon" : "")}<span>${task}</span>
    </button>`).join("");

  return `
    <aside class="app-sidebar ${detailedShell ? "a2-sidebar" : ""} ${variant === "A4" ? "a4-sidebar" : ""}" aria-label="Codex 产品导航">
      <header class="sidebar-top">
        <div class="sidebar-brand ${detailedShell ? "a2-sidebar-brand" : ""}" aria-label="MIKU Codex 01">
          <span class="brand-mark">${icon(detailedShell ? "brand-note" : "wave", detailedShell ? "color-icon" : "")}</span>
          <span>${detailedShell ? "<b>Miku Codex</b><small>LOVE WORDS · 01</small>" : "<b>MIKU CODEX</b><small>LOVE WORDS · 01</small>"}</span>
        </div>
        <button class="icon-button" type="button" data-action="search" aria-label="搜索任务">${icon("search")}</button>
      </header>
      <div class="sidebar-scroll">
        <input class="sidebar-search" type="search" aria-label="搜索项目和任务" placeholder="搜索项目和任务">
        <nav class="sidebar-nav" aria-label="主导航">${navButtons}</nav>
        <section class="sidebar-section" aria-labelledby="project-heading">
          <div class="sidebar-section-title" id="project-heading"><span>项目</span><small>1</small></div>
          <div class="sidebar-list">
            <button class="project-button ${context === "project" ? "is-active" : ""}" type="button" data-action="project" data-label="${informationModel.project.label}">
              ${variant === "A4" ? renderProjectGlyph(informationModel.project) : icon(detailedShell ? "project-planet" : "folder", detailedShell ? "color-icon" : "")}<span>${informationModel.project.label}</span>
            </button>
          </div>
        </section>
        <section class="sidebar-section" aria-labelledby="tasks-heading">
          <div class="sidebar-section-title" id="tasks-heading"><span>${variant === "A4" && context === "project" ? "项目任务" : "最近任务"}</span><small>${sidebarTasks.length}</small></div>
          <div class="sidebar-list">${taskButtons}</div>
        </section>
      </div>
      <footer class="sidebar-bottom">
        <div class="account-popover" role="dialog" aria-label="账户与设置边界">
          <b>DK · 本地账户</b>
          <span>设置与账户保留为产品壳层的独立边界。</span>
        </div>
        <button class="settings-button" type="button" data-action="account">${icon("settings")}<span>设置</span></button>
        <button class="account-button" type="button" data-action="account">
          <span class="account-avatar">DK</span><span>DK</span><small>本地</small>
        </button>
      </footer>
    </aside>`;
}

function renderTopbar(variant, context = "project", panelOpen = false) {
  const inProject = context === "project";
  return `
    <header class="app-topbar">
      <button class="icon-button ${panelOpen ? "is-active" : ""}" type="button" data-action="${variant === "A4" ? "panel-toggle" : "shell"}" aria-label="${variant === "A4" ? "切换环境侧栏" : "切换侧栏"}" aria-pressed="${panelOpen}">${icon("panel")}</button>
      <button class="icon-button" type="button" data-action="history" aria-label="返回">${icon("back")}</button>
      <button class="icon-button" type="button" data-action="history" aria-label="前进">${icon("forward")}</button>
      <div class="topbar-path"><b>${inProject ? informationModel.project.label : "Codex"}</b><span>/ 首页</span></div>
      <div class="topbar-status"><span class="status-dot" aria-hidden="true"></span><span>本地</span>${inProject ? `<span>${informationModel.project.branch}</span>` : ""}</div>
    </header>`;
}

function renderHeading(className) {
  return `
    <div class="main-heading ${className}" data-risk-surface="heading">
      <div class="context-line">Codex / ${informationModel.project.label} / ${informationModel.project.branch}</div>
      <h1>我们应该在<span class="project-inline">${icon("folder")} ${informationModel.project.label}</span>中构建什么？</h1>
      <p>${informationModel.description}</p>
    </div>`;
}

function renderFeatureButton(feature, index, variant) {
  if (variant === "C") {
    return `
      <button class="feature-button" type="button" data-action="feature" data-label="${feature.title}">
        <span class="c-feature-number">0${index + 1}</span>
        <span class="feature-copy"><b>${feature.title}</b><small>${feature.detail}</small></span>
        ${icon("forward", "c-feature-arrow")}
      </button>`;
  }
  if (variant === "A2" || variant === "A3" || variant === "A4") {
    return `
      <button class="feature-button" type="button" data-action="feature" data-label="${feature.title}">
        <span class="a2-feature-index">0${index + 1} / ${feature.cue}</span>
        <span class="feature-icon">${icon(`${feature.icon}-pop`, "color-icon")}</span>
        <span class="feature-copy"><b>${feature.title}</b><small>${feature.detail}</small></span>
        <span class="a2-feature-glint">${icon("sparkle-pop", "color-icon")}</span>
      </button>`;
  }
  return `
    <button class="feature-button" type="button" data-action="feature" data-label="${feature.title}">
      <span class="feature-icon">${icon(feature.icon)}</span>
      <span class="feature-copy"><b>${feature.title}</b><small>${feature.detail}</small></span>
    </button>`;
}

function renderFeatures(variant, className) {
  return `<section class="${className}" aria-label="Codex 功能入口">
    ${informationModel.features.map((feature, index) => renderFeatureButton(feature, index, variant)).join("")}
  </section>`;
}

function renderComposer(className) {
  return `
    <form class="composer ${className}" data-risk-surface="composer" aria-label="任务输入工作台">
      <textarea id="task-input" aria-label="描述任务" placeholder="描述你要完成的任务"></textarea>
      <span class="composer-status" aria-live="polite"></span>
      <div class="composer-controls">
        <input class="attachment-input" id="attachment-input" type="file" aria-label="添加附件">
        <button class="attachment-label" type="button" data-action="attachment" aria-label="添加附件">${icon("attach")}</button>
        <select class="control-select project-select" aria-label="选择项目">
          <option>${informationModel.project.label}</option>
        </select>
        <select class="control-select" aria-label="执行环境"><option>本地</option></select>
        <select class="control-select" aria-label="选择分支"><option>${informationModel.project.branch}</option></select>
        <select class="control-select" aria-label="权限模式"><option>完全访问</option></select>
        <span class="control-spacer"></span>
        <span class="model-label">5.6 Sol · 轻度</span>
        <button class="send-button" type="submit" aria-label="创建任务" disabled>${icon("send")}</button>
      </div>
    </form>`;
}

function renderPromptButton(label, className = "prompt-template", prompt = label) {
  return `<button class="${className}" type="button" data-action="prompt" data-label="${label}" data-prompt="${prompt}" title="${label}">${label}</button>`;
}

function renderPromptRail() {
  const primaryPrompts = informationModel.promptTemplates.map((prompt) => renderPromptButton(prompt)).join("");
  const inspirationPrompts = informationModel.inspirationTemplates
    .map((item) => renderPromptButton(item.label, "inspiration-template", item.prompt))
    .join("");

  return `
    <section class="a2-prompt-rail" aria-label="MIKU 任务提示词">
      <span class="a2-prompt-label">${icon("double-note-pop", "color-icon")}<b>灵感起拍</b></span>
      <div class="a2-prompt-list">${primaryPrompts}</div>
      <button class="inspiration-toggle" type="button" data-action="inspiration" aria-expanded="false">
        ${icon("star-pocket", "color-icon")}<span>灵感库</span>${icon("chevron")}
      </button>
      <div class="inspiration-popover" aria-label="更多 MIKU 灵感模板" hidden>${inspirationPrompts}</div>
    </section>`;
}

function renderTaskWindowNode(task, index) {
  return `
    <button class="a4-task-node a4-task-node-${index + 1}" type="button" data-action="task-window" data-label="${task}">
      <span>${icon("task-glint", "color-icon")}</span><b>${task}</b><small>任务窗口 ${String(index + 1).padStart(2, "0")}</small>
    </button>`;
}

function renderPromptRailA4(context) {
  const primaryPrompts = informationModel.promptTemplates.map((prompt) => renderPromptButton(prompt)).join("");
  const tasks = getContextTasks(context);
  const libraryOpen = getLibraryOpen();
  const contextLabel = context === "project" ? `${informationModel.project.label} · 项目内` : "最近任务 · 非项目";

  return `
    <section class="a2-prompt-rail a4-prompt-rail" aria-label="MIKU 任务提示词与上下文任务窗口">
      <span class="a2-prompt-label">${icon("double-note-pop", "color-icon")}<b>灵感起拍</b></span>
      <div class="a2-prompt-list">${primaryPrompts}</div>
      <button class="inspiration-toggle" type="button" data-action="inspiration" aria-expanded="${libraryOpen}">
        ${icon("star-pocket", "color-icon")}<span>灵感库</span>${icon("chevron")}
      </button>
      <div class="inspiration-popover a4-library-popover" aria-label="${contextLabel}任务窗口" ${libraryOpen ? "" : "hidden"}>
        <header class="a4-library-head">
          <span>${icon(context === "project" ? "project-system" : "calendar-pop", "color-icon")}</span>
          <span><small>CONTEXT WINDOW / 01</small><b>${contextLabel}</b></span>
          <em>${tasks.length} 个窗口</em>
        </header>
        <svg class="a4-node-lines" viewBox="0 0 420 118" preserveAspectRatio="none" aria-hidden="true">
          <path d="M38 35C98 7 143 83 205 48S315 15 382 40M45 91c62-35 105 12 165-10s116 23 177 1"/>
          <circle cx="38" cy="35" r="3"/><circle cx="205" cy="48" r="3"/><circle cx="382" cy="40" r="3"/>
        </svg>
        <div class="a4-task-nodes">${tasks.map(renderTaskWindowNode).join("")}</div>
        <footer>由当前 Codex 上下文筛选；皮肤不创建新任务，也不改写标题。</footer>
      </div>
    </section>`;
}

function renderEnvironmentPanel() {
  return `
    <aside class="a4-context-panel" aria-label="环境信息侧栏">
      <header>
        <span><small>WORKSPACE / 01</small><b>环境信息</b></span>
        <button class="icon-button" type="button" data-action="panel-toggle" aria-label="关闭环境侧栏">${icon("panel")}</button>
      </header>
      <section class="a4-panel-section">
        <div class="a4-panel-row is-strong">${icon("task-glint", "color-icon")}<span>变更</span><em>0</em></div>
        <details open>
          <summary>${icon("folder")}<span>本地</span><i class="a4-summary-chevron">${icon("chevron")}</i></summary>
          <div class="a4-panel-row">${icon("branch-pop", "color-icon")}<span>${informationModel.project.branch}</span></div>
          <div class="a4-panel-row">${icon("wave")}<span>提交或推送</span></div>
          <div class="a4-panel-row is-muted">${icon("task")}<span>无法获取拉取请求状态</span></div>
        </details>
      </section>
      <section class="a4-panel-section">
        <h2>后台进程</h2>
        <div class="a4-panel-row">${icon("code")}<span>node server.mjs</span><i class="a4-live-dot" aria-label="运行中"></i></div>
      </section>
      <section class="a4-panel-section">
        <h2>来源</h2>
        <div class="a4-panel-row">${icon("project-system", "color-icon")}<span>Codex-Dream-Skin</span></div>
        <div class="a4-panel-row is-muted">${icon("attach")}<span>A3 1440×900.png</span></div>
      </section>
      <footer><span>${icon("double-note-pop", "color-icon")}主题只覆盖表面与状态，不替换原生数据。</span></footer>
    </aside>`;
}

function renderComposerA2() {
  return `
    <form class="composer a2-composer" data-risk-surface="composer" aria-label="任务输入工作台">
      <div class="a2-composer-head">
        <span>${icon("sparkle-pop", "color-icon")}<b>01 · LOVE WORDS</b><small>把灵感写成可执行任务</small></span>
        <span class="a2-input-wave" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
        </span>
      </div>
      <textarea id="task-input" aria-label="描述任务" placeholder="写下第一句：例如，为 Miku 演唱会做一个响应式落地页"></textarea>
      <span class="composer-status" aria-live="polite"></span>
      <div class="composer-controls">
        <input class="attachment-input" id="attachment-input" type="file" aria-label="添加附件">
        <button class="attachment-label" type="button" data-action="attachment" aria-label="添加附件">${icon("paperclip-pop", "color-icon")}</button>
        <select class="control-select project-select" aria-label="选择项目">
          <option>${informationModel.project.label}</option>
        </select>
        <select class="control-select" aria-label="执行环境"><option>本地</option></select>
        <select class="control-select" aria-label="选择分支"><option>${informationModel.project.branch}</option></select>
        <select class="control-select" aria-label="权限模式"><option>完全访问</option></select>
        <span class="control-spacer"></span>
        <label class="a2-model-control">${icon("model-star", "color-icon")}<span class="sr-only">选择模型</span>
          <select aria-label="选择模型"><option>5.6 Sol · 轻度</option><option>5.6 Sol · 标准</option></select>
        </label>
        <button class="send-button" type="submit" aria-label="创建任务" disabled>${icon("send")}</button>
      </div>
    </form>`;
}

function renderPostcard() {
  return `
    <aside class="a2-postcard" data-risk-surface="postcard" aria-label="MIKU 主题明信片装饰">
      <span class="a2-paperclip" aria-hidden="true">${icon("paperclip-pop", "color-icon")}</span>
      <span class="a2-postcard-picture" aria-hidden="true"></span>
      <span class="a2-postcard-copy"><b>Be together</b><small>BUILD THE FUTURE · 01</small></span>
      <span class="a2-postcard-stamp" aria-hidden="true">${icon("postcard-stamp", "color-icon")}</span>
    </aside>`;
}

function renderComposerA3() {
  return `
    <form class="composer a3-composer" data-risk-surface="composer" aria-label="紧凑任务输入框">
      <textarea id="task-input" aria-label="描述任务" placeholder="要求后续变更"></textarea>
      <span class="composer-status" aria-live="polite"></span>
      <span class="a3-input-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <div class="composer-controls">
        <input class="attachment-input" id="attachment-input" type="file" aria-label="添加附件">
        <button class="attachment-label" type="button" data-action="attachment" aria-label="添加附件">${icon("plus-pop", "color-icon")}</button>
        <select class="control-select a3-permission" aria-label="权限模式"><option>完全访问</option><option>仅工作区</option></select>
        <span class="control-spacer"></span>
        <label class="a3-model-control">${icon("model-star", "color-icon")}<span class="sr-only">选择模型</span>
          <select aria-label="选择模型"><option>5.6 Sol · 极高</option><option>5.6 Sol · 标准</option></select>
        </label>
        <button class="a3-voice-button" type="button" data-action="voice" aria-label="语音输入">${icon("microphone-pop", "color-icon")}</button>
        <button class="send-button" type="submit" aria-label="创建任务" disabled>${icon("send")}</button>
      </div>
    </form>`;
}

function renderReliefPostcard() {
  return `
    <aside class="a3-postcard" data-risk-surface="postcard" aria-label="含泪释然、双手贴近胸口的 MIKU 感谢明信片">
      <span class="a3-postcard-picture" aria-hidden="true">${icon("postcard-relief", "color-icon")}</span>
      <span class="a3-postcard-copy"><b>Thank you, always.</b><small>LOVE WORDS · MEMORY 01</small></span>
      <span class="a3-postcard-stamp" aria-hidden="true">${icon("postcard-stamp", "color-icon")}</span>
    </aside>`;
}

function renderVariantA() {
  return `
    <section class="variant-stage variant-a" aria-label="A：有边界的海报 Hero">
      <div class="a-layout">
        <section class="a-hero" aria-label="MIKU 主题视觉">
          <span class="portrait-safe" data-face-safe="A" aria-hidden="true"></span>
          ${renderHeading("a-heading")}
        </section>
        ${renderFeatures("A", "a-features")}
        ${renderComposer("a-composer")}
      </div>
    </section>`;
}

function renderVariantA2() {
  return `
    <section class="variant-stage variant-a2" aria-label="A2：MIKU 主题表达强化">
      <div class="a2-layout">
        <section class="a2-hero" aria-label="MIKU 主题视觉">
          <span class="portrait-safe" data-face-safe="A2" aria-hidden="true"></span>
          <div class="a2-soundline" aria-hidden="true">${icon("soundline-pop", "color-icon")}</div>
          <div class="a2-hero-badge" aria-hidden="true">${icon("ribbon-pop", "color-icon")}<span>MIKU / CODEX / 01</span></div>
          <div class="main-heading a2-heading" data-risk-surface="heading">
            <div class="a2-script-title">Miku Codex</div>
            <div class="context-line">Codex / ${informationModel.project.label} / ${informationModel.project.branch}</div>
            <h1>我们应该在<span class="project-inline">${icon("project-planet", "color-icon")} ${informationModel.project.label}</span>中构建什么？</h1>
            <p>${informationModel.description}</p>
            <span class="a2-love-note">Love, code &amp; future.</span>
          </div>
          ${renderPostcard()}
        </section>
        ${renderFeatures("A2", "a2-features")}
        ${renderPromptRail()}
        ${renderComposerA2()}
      </div>
    </section>`;
}

function renderVariantA3() {
  return `
    <section class="variant-stage variant-a3" aria-label="A3：真实 Codex 输入比例与完整海报">
      <div class="a3-layout">
        <section class="a3-hero" aria-label="MIKU 完整主题海报">
          <span class="portrait-safe" data-face-safe="A3" aria-hidden="true"></span>
          <div class="a3-memory-ribbon" aria-hidden="true">
            ${icon("double-note-pop", "color-icon")}<span>THANK YOU FOR THIS YEAR</span><i></i><span>LOVE WORDS · 01</span>
          </div>
          <div class="main-heading a3-heading" data-risk-surface="heading">
            <div class="a3-script-title">Miku Codex</div>
            <div class="context-line">Codex / ${informationModel.project.label} / ${informationModel.project.branch}</div>
            <h1>我们应该在<span class="project-inline">${icon("project-planet", "color-icon")} ${informationModel.project.label}</span>中构建什么？</h1>
            <p>${informationModel.description}</p>
          </div>
          <div class="a3-soundline" aria-hidden="true">${icon("soundline-pop", "color-icon")}</div>
          ${renderReliefPostcard()}
        </section>
        ${renderFeatures("A3", "a2-features")}
        ${renderPromptRail()}
        ${renderComposerA3()}
      </div>
    </section>`;
}

function renderVariantA4(context, panelOpen) {
  const inProject = context === "project";
  return `
    <section class="variant-stage variant-a4 ${panelOpen ? "has-context-panel" : ""}" aria-label="A4：上下文工作台与生态面板">
      <div class="a4-layout">
        <section class="a3-hero a4-hero" aria-label="MIKU 完整主题海报">
          <span class="portrait-safe" data-face-safe="A4" aria-hidden="true"></span>
          <div class="a3-memory-ribbon" aria-hidden="true">
            ${icon("double-note-pop", "color-icon")}<span>THANK YOU FOR THIS YEAR</span><i></i><span>LOVE WORDS · 01</span>
          </div>
          <div class="main-heading a3-heading a4-heading" data-risk-surface="heading">
            <div class="a3-script-title">Miku Codex</div>
            <div class="context-line">${inProject ? `Codex / ${informationModel.project.label} / ${informationModel.project.branch}` : "Codex / 最近任务 / 本地"}</div>
            <h1>${inProject ? `我们应该在<span class="project-inline">${renderProjectGlyph(informationModel.project)} ${informationModel.project.label}</span>中构建什么？` : "我们今天要构建什么？"}</h1>
            <p>${inProject ? informationModel.description : "描述任务；选择项目后，Codex 会在对应工作区中继续。"}</p>
          </div>
          <div class="a3-soundline" aria-hidden="true">${icon("soundline-pop", "color-icon")}</div>
        </section>
        ${renderFeatures("A4", "a2-features a4-features")}
        ${renderPromptRailA4(context)}
        <div class="a4-bottom-row">
          ${renderComposerA3().replace("a3-composer", "a3-composer a4-composer")}
          ${renderReliefPostcard().replace("a3-postcard", "a3-postcard a4-postcard")}
        </div>
      </div>
      ${panelOpen ? renderEnvironmentPanel() : ""}
    </section>`;
}

function renderVariantB() {
  return `
    <section class="variant-stage variant-b" aria-label="B：全窗口结构化工作台">
      <span class="portrait-safe" data-face-safe="B" aria-hidden="true"></span>
      <div class="b-layout">
        <section class="b-workbench" data-risk-surface="workbench">
          ${renderHeading("b-heading")}
          ${renderFeatures("B", "b-features")}
        </section>
        ${renderComposer("b-composer")}
      </div>
    </section>`;
}

function renderVariantC() {
  return `
    <section class="variant-stage variant-c" aria-label="C：编辑式左右分栏">
      <div class="c-layout">
        <section class="c-editorial" data-risk-surface="editorial">
          ${renderHeading("c-heading")}
          ${renderFeatures("C", "c-features")}
        </section>
        <section class="c-visual" aria-label="MIKU 主题视觉">
          <span class="portrait-safe" data-face-safe="C" aria-hidden="true"></span>
          <span class="visual-index">${icon("note")} 01 / LOVE WORDS</span>
        </section>
        ${renderComposer("c-composer")}
      </div>
    </section>`;
}

function getVariant() {
  const value = new URLSearchParams(location.search).get("variant")?.toUpperCase();
  return variants[value] ? value : "A";
}

function getContext() {
  return new URLSearchParams(location.search).get("context") === "global" ? "global" : "project";
}

function getPanelOpen() {
  return new URLSearchParams(location.search).get("panel") === "1";
}

function getLibraryOpen() {
  return new URLSearchParams(location.search).get("library") === "1";
}

function render() {
  const variant = getVariant();
  const context = variant === "A4" ? getContext() : "project";
  const panelOpen = variant === "A4" && getPanelOpen();
  const renderers = { A: renderVariantA, A2: renderVariantA2, A3: renderVariantA3, A4: renderVariantA4, B: renderVariantB, C: renderVariantC };
  const variantMarkup = renderers[variant](context, panelOpen);
  document.body.dataset.variant = variant;
  document.body.dataset.context = context;
  document.body.dataset.panel = String(panelOpen);
  document.body.dataset.capture = String(new URLSearchParams(location.search).get("capture") === "1");
  document.getElementById("app").innerHTML = `
    <div class="prototype-shell" data-variant="${variant}">
      ${renderSidebar(variant, context)}
      <main class="app-main" aria-label="Codex 首页">
        ${renderTopbar(variant, context, panelOpen)}
        ${variantMarkup}
      </main>
    </div>`;
  document.getElementById("prototype-variant").textContent = variant;
  document.getElementById("prototype-name").textContent = variants[variant].name;
  bindInteractions();
}

function showToast(message) {
  const toast = document.getElementById("prototype-toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function setActiveButton(button) {
  const group = button.closest(".sidebar-nav, .sidebar-list");
  group?.querySelectorAll(".is-active").forEach((item) => item.classList.remove("is-active"));
  button.classList.add("is-active");
}

function bindInteractions() {
  const input = document.getElementById("task-input");
  const send = document.querySelector(".send-button");
  const status = document.querySelector(".composer-status");
  input.addEventListener("input", () => {
    send.disabled = input.value.trim().length === 0;
    status.textContent = "";
    document.querySelector(".composer").classList.toggle("has-input", input.value.trim().length > 0);
  });
  input.addEventListener("focus", () => document.querySelector(".composer").classList.add("is-focused"));
  input.addEventListener("blur", () => document.querySelector(".composer").classList.remove("is-focused"));

  document.querySelector(".composer").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!input.value.trim()) return;
    status.textContent = "结构原型未连接任务后端";
    showToast("输入已保留；本地结构原型不会创建真实任务。");
  });

  document.getElementById("attachment-input").addEventListener("change", (event) => {
    const count = event.target.files?.length || 0;
    if (count) showToast(`已选择 ${count} 个本地附件；原型不会上传。`);
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const label = button.dataset.label;
      if (action === "feature") {
        input.value = `${label}：`;
        input.dispatchEvent(new Event("input"));
        input.focus();
        return;
      }
      if (action === "prompt") {
        input.value = button.dataset.prompt;
        input.dispatchEvent(new Event("input"));
        input.focus();
        document.querySelector(".inspiration-popover")?.setAttribute("hidden", "");
        document.querySelector(".inspiration-toggle")?.setAttribute("aria-expanded", "false");
        return;
      }
      if (action === "inspiration") {
        const popover = document.querySelector(".inspiration-popover");
        const willOpen = popover.hasAttribute("hidden");
        popover.toggleAttribute("hidden", !willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
        if (getVariant() === "A4") {
          const url = new URL(location.href);
          if (willOpen) url.searchParams.set("library", "1");
          else url.searchParams.delete("library");
          history.replaceState({}, "", url);
        }
        return;
      }
      if (action === "panel-toggle") {
        const url = new URL(location.href);
        if (getPanelOpen()) url.searchParams.delete("panel");
        else url.searchParams.set("panel", "1");
        history.replaceState({}, "", url);
        render();
        return;
      }
      if (action === "task-window") {
        const matchingSidebarTask = [...document.querySelectorAll(".task-button")]
          .find((item) => item.dataset.label === label);
        if (matchingSidebarTask) setActiveButton(matchingSidebarTask);
        const path = document.querySelector(".topbar-path span");
        if (path) path.textContent = `/ ${label}`;
        showToast(`已在原型中打开任务窗口：${label}`);
        return;
      }
      if (action === "voice") {
        showToast("语音入口已保留；结构原型不会请求麦克风权限。");
        return;
      }
      if (action === "attachment") {
        document.getElementById("attachment-input").click();
        return;
      }
      if (action === "new-task") return;
      if (action === "search") {
        const search = document.querySelector(".sidebar-search");
        search.classList.toggle("is-visible");
        if (search.classList.contains("is-visible")) search.focus();
        return;
      }
      if (action === "account") {
        document.querySelector(".account-popover").classList.toggle("is-visible");
        return;
      }
      if (action === "nav" || action === "task" || action === "project") {
        setActiveButton(button);
        if (button.dataset.value === "new-task") {
          input.value = "";
          input.dispatchEvent(new Event("input"));
          input.focus();
        } else {
          showToast(`${label}已在本地原型中选中。`);
        }
        return;
      }
      showToast("该原生壳层控件已保留；结构原型不改变 Codex 窗口状态。");
    });
  });
}

function switchVariant(direction) {
  const keys = Object.keys(variants);
  const currentIndex = keys.indexOf(getVariant());
  const nextIndex = (currentIndex + direction + keys.length) % keys.length;
  const url = new URL(location.href);
  url.searchParams.set("variant", keys[nextIndex]);
  history.replaceState({}, "", url);
  render();
}

document.querySelector('[data-switch="previous"]').addEventListener("click", () => switchVariant(-1));
document.querySelector('[data-switch="next"]').addEventListener("click", () => switchVariant(1));
document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  if (event.target.matches("input, textarea, select, [contenteditable='true']")) return;
  switchVariant(event.key === "ArrowLeft" ? -1 : 1);
});
window.addEventListener("popstate", render);
render();
