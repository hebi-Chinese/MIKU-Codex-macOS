(function installDreamMikuNativeFactory(global) {
  "use strict";

  const FACTORY_KEY = "__CODEX_DREAM_MIKU_A4_FACTORY__";
  const INSTALL_CONTRACT = "miku-native-v2-2026-07-20.4";
  const ART_FONT_FAMILY = "MIKU Love Words Script";
  const MINIMUM_ICON_SYMBOL_COUNT = 56;
  const LAYOUT_ATTR = "data-dream-miku-layout";
  const PANEL_CLASS = "dream-miku-context-panel";
  const PANEL_MARK_CLASSES = Object.freeze([
    PANEL_CLASS,
    "dream-miku-context-action",
    "dream-miku-native-action-icon",
  ]);
  const ALLOWED_RECIPES = new Set(["system-grid", "wave-note", "neutral-folder"]);
  const SIDEBAR_CLASS = "dream-miku-sidebar-skin";
  const SIDEBAR_MARK_CLASSES = Object.freeze([
    SIDEBAR_CLASS,
    "dream-miku-sidebar-header",
    "dream-miku-sidebar-mode-button",
    "dream-miku-sidebar-mode-label",
    "dream-miku-sidebar-search",
    "dream-miku-sidebar-new-task",
    "dream-miku-sidebar-action",
    "dream-miku-native-action-icon",
    "dream-miku-sidebar-scroll",
    "dream-miku-sidebar-section",
    "dream-miku-sidebar-section-toggle",
    "dream-miku-sidebar-profile",
  ]);
  const SIDE_CHAT_CLASS = "dream-miku-side-chat";
  const RIGHT_WORKSPACE_CLASS = "dream-miku-right-workspace";
  const RIGHT_WORKSPACE_MARK_CLASSES = Object.freeze([
    RIGHT_WORKSPACE_CLASS,
    "dream-miku-right-workspace-surface",
    "dream-miku-right-workspace-toolbar",
    "dream-miku-right-workspace-launcher",
    "dream-miku-right-launcher-list",
    "dream-miku-right-launcher-card",
    "dream-miku-right-launcher-flow",
    "dream-miku-right-launcher-surface",
    "dream-miku-right-action",
    "dream-miku-right-tab",
    "dream-miku-right-panel",
    "dream-miku-native-right-icon",
  ]);
  const SIDE_CHAT_MARK_CLASSES = Object.freeze([
    SIDE_CHAT_CLASS,
    "dream-miku-side-chat-surface",
    "dream-miku-side-chat-toolbar",
    "dream-miku-side-chat-tab",
    "dream-miku-side-chat-panel",
    "dream-miku-side-chat-scroll",
    "dream-miku-side-chat-content",
    "dream-miku-side-chat-user-message",
    "dream-miku-side-chat-assistant-message",
    "dream-miku-side-chat-composer",
  ]);
  const SHELL_CONTROL_MARK_CLASSES = Object.freeze([
    "dream-miku-shell-control",
    "dream-miku-shell-search",
    "dream-miku-shell-help",
    "dream-miku-shell-sidebar-toggle",
    "dream-miku-shell-bottom-panel-toggle",
    "dream-miku-shell-panel-expand",
    "dream-miku-native-control-icon",
  ]);
  const SIDEBAR_ACTION_ICONS = Object.freeze([
    Object.freeze(["新建任务", "dream-icon-nav-new-task"]),
    Object.freeze(["拉取请求", "dream-icon-nav-pull-request"]),
    Object.freeze(["站点", "dream-icon-nav-sites"]),
    Object.freeze(["已安排", "dream-icon-nav-scheduled"]),
    Object.freeze(["插件", "dream-icon-nav-plugins"]),
  ]);
  const ENVIRONMENT_ACTION_ICONS = Object.freeze([
    "dream-icon-env-changes",
    "dream-icon-env-local",
    "dream-icon-env-branch",
    "dream-icon-env-publish",
  ]);
  const HOME_CAPABILITY_ICONS = Object.freeze([
    Object.freeze(["探索并理解代码", "dream-icon-home-explore"]),
    Object.freeze(["构建新功能、应用或工具", "dream-icon-home-build"]),
    Object.freeze(["审查代码并提出修改建议", "dream-icon-home-review"]),
    Object.freeze(["修复问题和失败", "dream-icon-home-repair"]),
  ]);
  const HOME_UTILITY_ICONS = Object.freeze({
    project: "dream-icon-composer-project",
    local: "dream-icon-composer-local",
    branch: "dream-icon-composer-branch",
    inspiration: "dream-icon-inspiration",
  });
  const COMPOSER_CONTROL_ICONS = Object.freeze({
    add: "dream-icon-composer-add",
    model: "dream-icon-composer-model",
    microphone: "dream-icon-composer-mic",
    send: "dream-icon-composer-send",
    stop: "dream-icon-composer-stop",
  });
  const SHELL_CONTROL_ICONS = Object.freeze({
    search: "dream-icon-shell-search",
    help: "dream-icon-shell-help",
    sidebarToggle: "dream-icon-shell-sidebar-toggle",
    bottomPanelToggle: "dream-icon-shell-bottom-panel-toggle",
    panelExpand: "dream-icon-shell-panel-expand",
  });
  const RIGHT_PANEL_ACTION_ICONS = Object.freeze([
    Object.freeze(["审阅", "dream-icon-right-review"]),
    Object.freeze(["终端", "dream-icon-right-terminal"]),
    Object.freeze(["浏览器", "dream-icon-right-browser"]),
    Object.freeze(["文件", "dream-icon-right-files"]),
    Object.freeze(["侧边任务", "dream-icon-right-side-task"]),
  ]);
  const MODEL_SPEED_ICONS = Object.freeze({
    快速: "dream-icon-speed-fast",
    标准: "dream-icon-speed-standard",
  });
  const PERMISSION_PRESENTATIONS = Object.freeze([
    Object.freeze([
      "请求批准",
      "逐拍确认 · 请求批准",
      "每一步先对拍，再让旋律继续 ♪",
      "dream-icon-permission-request",
    ]),
    Object.freeze([
      "替我审批",
      "风险变奏 · 替我审批",
      "只在风险变奏处举起应援灯 ☆",
      "dream-icon-permission-agent",
    ]),
    Object.freeze([
      "完全访问权限",
      "全开舞台 · 完全访问",
      "全开舞台模式，也要看清边界 01",
      "dream-icon-permission-full",
    ]),
    Object.freeze([
      "自定义",
      "自定义谱面 · 自定义",
      "按你的 config.toml 谱面演奏 ～",
      "dream-icon-permission-custom",
    ]),
  ]);
  const PERMISSION_DESCRIPTIONS = Object.freeze(PERMISSION_PRESENTATIONS.map(
    ([nativeTitle, _visualTitle, visualDescription]) =>
      Object.freeze([nativeTitle, visualDescription]),
  ));
  const COMPOSER_PERMISSION_PRESENTATIONS = Object.freeze([
    Object.freeze(["请求批准", "逐拍确认", "dream-icon-permission-request"]),
    Object.freeze(["替我审批", "风险变奏", "dream-icon-permission-agent"]),
    Object.freeze(["完全访问", "全开舞台", "dream-icon-permission-full"]),
    Object.freeze(["自定义", "自定义谱面", "dream-icon-permission-custom"]),
  ]);
  const composerPermissionPresentationFor = (label) => {
    const normalized = cleanLabel(label);
    return COMPOSER_PERMISSION_PRESENTATIONS.find(([nativeLabel]) =>
      normalized === nativeLabel
      || normalized.startsWith(`${nativeLabel} (`)
      || (nativeLabel === "完全访问" && normalized === "完全访问权限")) || null;
  };
  const SUPPORT_PHRASE_ATTR = "data-dream-miku-support-phrase";
  const SUPPORT_PHRASE_PHASE_ATTR = "data-dream-miku-support-phase";
  const SUPPORT_PHRASE_EDITOR_ATTR = "data-dream-miku-support-editor";
  const SUPPORT_PHRASE_TONE_ATTR = "data-dream-miku-support-tone";
  const SUPPORT_PHRASE_EMBLEM_ATTR = "data-dream-miku-support-emblem";
  const SUPPORT_PHRASE_VARIABLE = "--dream-miku-support-phrase";
  const SUPPORT_PHRASE_FACE_VARIABLE = "--dream-miku-support-face";
  const SUPPORT_PHRASE_TAIL_VARIABLE = "--dream-miku-support-tail";
  const SUPPORT_PHRASE_INTERVAL_MS = 7600;
  const SUPPORT_PHRASES = Object.freeze([
    "青绿色的灯已经亮起，一起开场吧",
    "01号歌声就位，把灵感写进今天",
    "今天也把喜欢，认真写进代码里",
    "下一颗音符，就藏在这一行之后",
    "双音符正在靠近，新的点子已就位",
    "给未完成的作品，再多一点勇气",
    "把感谢留在旋律里，把想法落进项目",
    "这一行写给未来，也写给同行的你",
    "让歌声陪你，完成今天的创作",
    "39份心意已送达，现在开始创造吧",
    "调好音色，也调好今天的开发节奏",
    "灵感不会迟到，下一束光就在这里",
    "把小小的愿望，编译成可抵达的未来",
    "舞台灯亮起前，我们先完成这一版",
    "谢谢一路同行，今天也向未来出发",
  ]);
  const SUPPORT_DECORATIONS = Object.freeze([
    { face: "(ᵔᵕᵔ)", tail: "☆⋆", tone: "mint" },
    { face: "(•̀ᴗ•́)و", tail: "♪～", tone: "yellow" },
    { face: "(˶ᵔᵕᵔ˶)", tail: "♡～", tone: "pink" },
    { face: "(´▽｀)", tail: "♪～", tone: "coral" },
    { face: "(ᵔ◡ᵔ)", tail: "♪⋆", tone: "mint" },
    { face: "(•̀ᴗ•́)و", tail: "☆·", tone: "yellow" },
    { face: "", tail: "♡～", tone: "coral", emblem: "pocket" },
    { face: "(˘ᵕ˘)", tail: "⋆～", tone: "mint" },
    { face: "(´▽｀)", tail: "♪～", tone: "pink" },
    { face: "", tail: "♡～", tone: "pink", emblem: "pocket" },
    { face: "(•̀ᴗ•́)و", tail: "♪·", tone: "yellow" },
    { face: "(ᵔ▽ᵔ)", tail: "☆⋆", tone: "coral" },
    { face: "", tail: "♡～", tone: "mint", emblem: "pocket" },
    { face: "(•̀ᴗ•́)و", tail: "☆～", tone: "coral" },
    { face: "", tail: "♡～", tone: "pink", emblem: "pocket" },
  ]);
  const SUPPORT_PRESENTATIONS = Object.freeze(SUPPORT_PHRASES.map((text, index) =>
    Object.freeze({ text, emblem: "none", ...SUPPORT_DECORATIONS[index] })));

  const cleanLabel = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

  const chooseSupportPhrase = (previousPhrase, randomValue = 0) => {
    const numeric = Number(randomValue);
    const normalized = Number.isFinite(numeric) ? Math.max(0, Math.min(0.999999, numeric)) : 0;
    let index = Math.floor(normalized * SUPPORT_PHRASES.length);
    if (SUPPORT_PHRASES[index] === previousPhrase) index = (index + 1) % SUPPORT_PHRASES.length;
    return SUPPORT_PHRASES[index];
  };

  const supportPresentationFor = (phrase) =>
    SUPPORT_PRESENTATIONS.find((item) => item.text === phrase) || SUPPORT_PRESENTATIONS[0];

  const projectRecipeFor = (projectKey, registry = {}) => {
    if (!projectKey || !registry || typeof registry !== "object") return "neutral-folder";
    const recipe = registry[projectKey];
    return ALLOWED_RECIPES.has(recipe) ? recipe : "neutral-folder";
  };

  const taskWindowsFor = (candidates, {
    context = "global",
    projectKey = null,
    limit = 6,
  } = {}) => {
    const source = Array.isArray(candidates) ? candidates : [];
    const scoped = context === "project"
      ? (projectKey ? source.filter((item) => item?.projectKey === projectKey) : [])
      : source;
    const seen = new Set();
    const result = [];
    for (const item of scoped) {
      const label = cleanLabel(item?.label);
      if (!label || seen.has(label) || !item?.source) continue;
      seen.add(label);
      result.push({ ...item, label });
      if (result.length >= Math.max(1, Math.min(8, Number(limit) || 6))) break;
    }
    return result;
  };

  function factory({ document, window, theme = {}, random = Math.random } = {}) {
    if (!document || !window) throw new TypeError("MIKU native adapter requires a renderer document and window.");

    const markedPanelNodes = new Map();
    const markedSidebarNodes = new Map();
    const markedRightWorkspaceNodes = new Map();
    const markedSideChatNodes = new Map();
    const markedHomeNodes = new Map();
    const markedComposerNodes = new Map();
    const markedPortalNodes = new Map();
    const markedShellControlNodes = new Map();
    const insertedSidebarNodes = new Set();
    const insertedPanelNodes = new Set();
    const insertedRightWorkspaceNodes = new Set();
    const insertedHomeNodes = new Set();
    const insertedComposerNodes = new Set();
    const insertedPortalNodes = new Set();
    const insertedShellControlNodes = new Set();
    const supportPhraseStates = new Map();
    const randomSource = typeof random === "function" ? random : Math.random;
    let currentSupportPhrase = "";
    let supportPhraseSequence = 0;
    let supportPhraseTimer = null;
    let reducedMotionQuery = null;
    let reducedMotionHandler = null;
    let inspirationState = null;
    const composerInspirationStates = new Map();
    let composerInspirationSequence = 0;

    const markNode = (current, node, className) => {
      if (!node) return;
      node.classList.add(className);
      const classes = current.get(node) || new Set();
      classes.add(className);
      current.set(node, classes);
    };

    const composerHasFocus = ({ composer, editor }) => {
      if (composer.matches?.(":focus-within")) return true;
      const activeElement = document.activeElement;
      return activeElement === editor || Boolean(activeElement && editor.contains?.(activeElement));
    };

    const syncSupportPhraseEmblem = (state, presentation) => {
      const shouldShowPocket = presentation.emblem === "pocket";
      if (!state.emblem && shouldShowPocket) {
        const emblem = document.createElement("span");
        emblem.className = "dream-miku-support-emblem";
        emblem.setAttribute("aria-hidden", "true");
        emblem.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><use href="#dream-icon-project-neutral-folder"></use></svg>';
        state.composer.prepend(emblem);
        state.emblem = emblem;
      }
      if (state.emblem) state.emblem.hidden = !shouldShowPocket;
    };

    const restoreSupportPhraseState = (state) => {
      state.composer?.removeAttribute(SUPPORT_PHRASE_ATTR);
      state.composer?.removeAttribute(SUPPORT_PHRASE_PHASE_ATTR);
      state.composer?.removeAttribute(SUPPORT_PHRASE_TONE_ATTR);
      state.composer?.removeAttribute(SUPPORT_PHRASE_EMBLEM_ATTR);
      state.composer?.style?.removeProperty(SUPPORT_PHRASE_VARIABLE);
      state.composer?.style?.removeProperty(SUPPORT_PHRASE_FACE_VARIABLE);
      state.composer?.style?.removeProperty(SUPPORT_PHRASE_TAIL_VARIABLE);
      state.emblem?.remove();
      state.emblem = null;
      if (state.editor?.getAttribute(SUPPORT_PHRASE_EDITOR_ATTR) === "true") {
        if (state.originalAriaPlaceholder == null) state.editor.removeAttribute("aria-placeholder");
        else state.editor.setAttribute("aria-placeholder", state.originalAriaPlaceholder);
        state.editor.removeAttribute(SUPPORT_PHRASE_EDITOR_ATTR);
      }
    };

    const stateIsEmpty = (state) => Boolean(
      state.composer?.querySelector('.ProseMirror p.placeholder[data-placeholder]') &&
      state.editor?.isConnected &&
      cleanLabel(state.editor.textContent) === ""
    );

    const stateCanRotate = (state) => stateIsEmpty(state) && !composerHasFocus(state);

    const applySupportPhrase = (state) => {
      if (!currentSupportPhrase || !stateIsEmpty(state)) return false;
      const presentation = supportPresentationFor(currentSupportPhrase);
      state.composer.setAttribute(SUPPORT_PHRASE_ATTR, "true");
      state.composer.setAttribute(
        SUPPORT_PHRASE_PHASE_ATTR,
        supportPhraseSequence % 2 === 0 ? "even" : "odd",
      );
      state.composer.style.setProperty(
        SUPPORT_PHRASE_VARIABLE,
        JSON.stringify(currentSupportPhrase),
      );
      state.composer.style.setProperty(
        SUPPORT_PHRASE_FACE_VARIABLE,
        JSON.stringify(presentation.face),
      );
      state.composer.style.setProperty(
        SUPPORT_PHRASE_TAIL_VARIABLE,
        JSON.stringify(presentation.tail),
      );
      state.composer.setAttribute(SUPPORT_PHRASE_TONE_ATTR, presentation.tone);
      state.composer.setAttribute(SUPPORT_PHRASE_EMBLEM_ATTR, presentation.emblem);
      syncSupportPhraseEmblem(state, presentation);
      state.editor.setAttribute(SUPPORT_PHRASE_EDITOR_ATTR, "true");
      state.editor.setAttribute("aria-placeholder", currentSupportPhrase);
      return true;
    };

    const rotateSupportPhrase = () => {
      if (document.hidden || [...supportPhraseStates.values()].some(composerHasFocus)) return false;
      const idleStates = [...supportPhraseStates.values()].filter(stateCanRotate);
      if (!idleStates.length) return false;
      currentSupportPhrase = chooseSupportPhrase(currentSupportPhrase, randomSource());
      supportPhraseSequence += 1;
      for (const state of idleStates) applySupportPhrase(state);
      return true;
    };

    const stopSupportPhraseTimer = () => {
      if (supportPhraseTimer == null) return;
      window.clearInterval(supportPhraseTimer);
      supportPhraseTimer = null;
    };

    const startSupportPhraseTimer = () => {
      if (supportPhraseTimer != null || reducedMotionQuery?.matches || !supportPhraseStates.size) return;
      if (typeof window.setInterval !== "function") return;
      supportPhraseTimer = window.setInterval(rotateSupportPhrase, SUPPORT_PHRASE_INTERVAL_MS);
    };

    const ensureReducedMotionListener = () => {
      if (reducedMotionQuery || typeof window.matchMedia !== "function") return;
      reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotionHandler = () => {
        if (reducedMotionQuery.matches) stopSupportPhraseTimer();
        else startSupportPhraseTimer();
      };
      reducedMotionQuery.addEventListener?.("change", reducedMotionHandler);
    };

    const releaseReducedMotionListener = () => {
      if (reducedMotionHandler && reducedMotionQuery) {
        reducedMotionQuery.removeEventListener?.("change", reducedMotionHandler);
      }
      reducedMotionQuery = null;
      reducedMotionHandler = null;
    };

    const composerTargetsFor = (shellMain) => {
      const composers = new Set();
      const mainComposer = shellMain?.querySelector?.(
        '[data-thread-scroll-footer="true"] [data-codex-composer-root] .composer-surface-chrome',
      ) || shellMain?.querySelector?.(
        '[data-codex-composer-root] .composer-surface-chrome',
      );
      if (mainComposer) composers.add(mainComposer);
      for (const sideChatPanel of document.querySelectorAll(
        '[data-app-shell-tab-panel-controller="right"][data-tab-id^="sidechat:"]',
      )) {
        const sideChatComposer = sideChatPanel.querySelector(".composer-surface-chrome");
        if (sideChatComposer) composers.add(sideChatComposer);
      }
      return composers;
    };

    const syncSupportPhrases = (shellMain) => {
      const currentComposers = composerTargetsFor(shellMain);
      for (const [composer, state] of supportPhraseStates) {
        if (currentComposers.has(composer)) continue;
        restoreSupportPhraseState(state);
        supportPhraseStates.delete(composer);
      }
      for (const composer of currentComposers) {
        const editor = composer.querySelector(
          '.ProseMirror[contenteditable="true"][data-codex-composer="true"]',
        );
        let state = supportPhraseStates.get(composer);
        if (!editor) {
          if (state) restoreSupportPhraseState(state);
          supportPhraseStates.delete(composer);
          continue;
        }
        if (!state || state.editor !== editor) {
          if (state) restoreSupportPhraseState(state);
          state = { composer, editor, originalAriaPlaceholder: editor.getAttribute("aria-placeholder") };
          supportPhraseStates.set(composer, state);
        }
      }
      for (const state of supportPhraseStates.values()) {
        if (!stateIsEmpty(state)) restoreSupportPhraseState(state);
      }
      if (supportPhraseStates.size) {
        ensureReducedMotionListener();
        if (!currentSupportPhrase) {
          const emptyStates = [...supportPhraseStates.values()].filter(stateIsEmpty);
          if (emptyStates.length) {
            currentSupportPhrase = chooseSupportPhrase(currentSupportPhrase, randomSource());
            supportPhraseSequence += 1;
            for (const state of emptyStates) applySupportPhrase(state);
          }
        } else {
          for (const state of supportPhraseStates.values()) applySupportPhrase(state);
        }
        startSupportPhraseTimer();
      } else {
        stopSupportPhraseTimer();
        releaseReducedMotionListener();
      }
      return [...supportPhraseStates.values()].filter((state) =>
        state.composer?.hasAttribute(SUPPORT_PHRASE_ATTR)).length;
    };

    const ensureSidebarSigil = (parent, className, symbolId, { prepend = true, text = "" } = {}) => {
      if (!parent) return null;
      let mark = [...parent.children].find((node) => node.classList?.contains(className));
      if (!mark) {
        mark = document.createElement("span");
        mark.className = className;
        mark.classList.add(className);
        mark.setAttribute("aria-hidden", "true");
        mark.innerHTML = text || `<svg viewBox="0 0 24 24" focusable="false"><use href="#${symbolId}"></use></svg>`;
        if (prepend) parent.prepend(mark);
        else parent.append(mark);
      }
      insertedSidebarNodes.add(mark);
      return mark;
    };

    const ensureActionIcon = (parent, symbolId, insertedNodes) => {
      if (!parent) return null;
      let mark = [...parent.children].find((node) =>
        node.classList?.contains("dream-miku-action-icon"));
      if (!mark) {
        mark = document.createElement("span");
        mark.className = "dream-miku-action-icon";
        mark.classList.add("dream-miku-action-icon");
        mark.setAttribute("aria-hidden", "true");
        mark.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><use href="#${symbolId}"></use></svg>`;
        parent.prepend(mark);
      }
      insertedNodes.add(mark);
      return mark;
    };

    const ensureControlIcon = ({
      current,
      currentInsertedNodes,
      insertedNodes,
      control,
      host,
      nativeIcon,
      symbolId,
      controlClass,
      iconClass = "dream-miku-control-icon",
    }) => {
      if (!control || !host || !symbolId) return null;
      markNode(current, control, controlClass);
      markNode(current, nativeIcon, "dream-miku-native-control-icon");
      let mark = [...(host.children || [])].find((node) =>
        node.classList?.contains(iconClass));
      if (!mark) {
        mark = document.createElement("span");
        mark.className = iconClass;
        mark.classList.add(iconClass);
        mark.setAttribute("aria-hidden", "true");
        host.prepend(mark);
      }
      if (mark.getAttribute("data-dream-miku-symbol") !== symbolId) {
        mark.setAttribute("data-dream-miku-symbol", symbolId);
        mark.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><use href="#${symbolId}"></use></svg>`;
      }
      insertedNodes.add(mark);
      currentInsertedNodes.add(mark);
      return mark;
    };

    const leadingControlSlot = (control) =>
      control?.querySelector?.(":scope > span:first-child") || null;

    const taskCandidatesFromSidebar = () => {
      const projectRows = [...document.querySelectorAll("[data-app-action-sidebar-project-row]")];
      const projectGroups = projectRows.map((row) => ({
        row,
        projectKey: cleanLabel(
          row.getAttribute("data-app-action-sidebar-project-label")
          || row.getAttribute("aria-label")
          || row.textContent,
        ),
        container: row.parentElement?.parentElement || row.parentElement,
      }));
      return [...document.querySelectorAll("[data-app-action-sidebar-thread-row]")].map((source) => {
        const project = projectGroups.find((candidate) => candidate.container?.contains?.(source));
        return {
          label: cleanLabel(
            source.getAttribute("data-app-action-sidebar-thread-title")
            || source.querySelector?.("[data-thread-title]")?.textContent
            || source.textContent,
          ),
          source,
          projectKey: project?.projectKey || null,
        };
      });
    };

    const closeInspiration = ({ restoreFocus = false } = {}) => {
      if (!inspirationState) return;
      inspirationState.wrapper.classList.remove("is-open");
      inspirationState.popover.hidden = true;
      inspirationState.trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) inspirationState.trigger.focus?.();
    };

    const releaseInspiration = () => {
      if (!inspirationState) return;
      document.removeEventListener?.("pointerdown", inspirationState.onPointerDown, true);
      document.removeEventListener?.("keydown", inspirationState.onKeyDown, true);
      inspirationState.wrapper.remove();
      inspirationState.popover.remove();
      insertedHomeNodes.delete(inspirationState.wrapper);
      insertedHomeNodes.delete(inspirationState.popover);
      inspirationState = null;
    };

    const renderInspirationItems = (items) => {
      if (!inspirationState) return;
      const { list, empty } = inspirationState;
      const signature = items.map((item) => [
        item.label,
        item.source.getAttribute?.("data-app-action-sidebar-thread-id") || "",
      ].join("::")).join("||");
      if (signature === inspirationState.itemSignature) return;
      inspirationState.itemSignature = signature;
      list.replaceChildren?.();
      while (list.firstChild) list.removeChild(list.firstChild);
      empty.hidden = items.length > 0;
      for (const item of items) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dream-miku-inspiration-item";
        button.setAttribute("data-dream-miku-inspiration-task", "true");
        button.innerHTML = `<span aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#dream-icon-twin-note"></use></svg></span><span></span>`;
        const label = button.children?.[1];
        if (label) label.textContent = item.label;
        else button.textContent = item.label;
        button.addEventListener("click", () => {
          closeInspiration();
          item.source.click?.();
        });
        list.append?.(button);
      }
    };

    const ensureInspiration = ({ utilityBar, branchControl, context, projectKey, items }) => {
      const anchor = branchControl?.parentElement || branchControl;
      if (!utilityBar || !anchor) {
        releaseInspiration();
        return null;
      }
      if (inspirationState && inspirationState.utilityBar !== utilityBar) releaseInspiration();
      if (!inspirationState) {
        const wrapper = document.createElement("span");
        wrapper.className = "dream-miku-inspiration";
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "dream-miku-inspiration-trigger";
        trigger.setAttribute("aria-label", "打开灵感启发");
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-controls", "dream-miku-inspiration-popover");
        trigger.innerHTML = `<span class="dream-miku-control-icon" aria-hidden="true" data-dream-miku-symbol="${HOME_UTILITY_ICONS.inspiration}"><svg viewBox="0 0 24 24"><use href="#${HOME_UTILITY_ICONS.inspiration}"></use></svg></span><span class="dream-miku-inspiration-label">灵感启发</span>`;
        const popover = document.createElement("div");
        popover.className = "dream-miku-inspiration-popover";
        popover.id = "dream-miku-inspiration-popover";
        popover.hidden = true;
        popover.setAttribute("role", "dialog");
        popover.setAttribute("aria-label", "灵感启发中的真实任务");
        popover.innerHTML = `<header><span>灵感启发</span><small></small></header><div class="dream-miku-inspiration-list"></div><p class="dream-miku-inspiration-empty" hidden>这个项目暂时没有可继续的任务</p>`;
        wrapper.append?.(trigger);
        document.body?.append?.(popover);
        anchor.after?.(wrapper);
        const onPointerDown = (event) => {
          if (!wrapper.contains?.(event.target) && !popover.contains?.(event.target)) {
            closeInspiration();
          }
        };
        const onKeyDown = (event) => {
          if (event.key === "Escape" && !popover.hidden) {
            event.preventDefault?.();
            closeInspiration({ restoreFocus: true });
          }
        };
        trigger.addEventListener("click", () => {
          if (trigger.disabled) return;
          const nextOpen = popover.hidden;
          if (nextOpen) {
            closeAllComposerInspirations();
            const triggerRect = trigger.getBoundingClientRect?.();
            const popoverWidth = Math.min(320, Math.max(240, window.innerWidth - 32));
            const preferredLeft = (triggerRect?.left || 16) - popoverWidth - 8;
            const fallbackLeft = (triggerRect?.right || 16) - popoverWidth;
            const left = Math.min(
              window.innerWidth - popoverWidth - 16,
              Math.max(16, preferredLeft >= 16 ? preferredLeft : fallbackLeft),
            );
            popover.style.setProperty("--dream-miku-inspiration-left", `${left}px`);
            popover.style.setProperty(
              "--dream-miku-inspiration-bottom",
              `${Math.max(16, window.innerHeight - (triggerRect?.top || 0) + 8)}px`,
            );
            wrapper.classList.add("is-open");
            popover.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            window.requestAnimationFrame?.(() =>
              popover.querySelector?.(".dream-miku-inspiration-item")?.focus?.());
          } else closeInspiration();
        });
        document.addEventListener?.("pointerdown", onPointerDown, true);
        document.addEventListener?.("keydown", onKeyDown, true);
        inspirationState = {
          utilityBar,
          wrapper,
          trigger,
          popover,
          list: popover.querySelector(".dream-miku-inspiration-list"),
          empty: popover.querySelector(".dream-miku-inspiration-empty"),
          subtitle: popover.querySelector("header small"),
          onPointerDown,
          onKeyDown,
          itemSignature: null,
        };
        insertedHomeNodes.add(wrapper);
        insertedHomeNodes.add(popover);
      }
      const nextDisabled = items.length === 0;
      if (inspirationState.trigger.disabled !== nextDisabled) {
        inspirationState.trigger.disabled = nextDisabled;
      }
      const nextTitle = items.length ? "查看真实任务灵感" : "当前没有可继续的真实任务";
      if (inspirationState.trigger.getAttribute("title") !== nextTitle) {
        inspirationState.trigger.setAttribute("title", nextTitle);
      }
      const nextSubtitle = context === "project"
        ? `${projectKey} · 项目任务`
        : "最近任务";
      if (inspirationState.subtitle.textContent !== nextSubtitle) {
        inspirationState.subtitle.textContent = nextSubtitle;
      }
      renderInspirationItems(items);
      return inspirationState.wrapper;
    };

    const closeComposerInspiration = (state, { restoreFocus = false } = {}) => {
      if (!state) return;
      state.wrapper.classList.remove("is-open");
      state.popover.hidden = true;
      state.trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus && !state.wrapper.hidden) {
        window.requestAnimationFrame?.(() => state.trigger.focus?.());
      }
    };

    const closeAllComposerInspirations = ({ exceptState = null } = {}) => {
      for (const state of composerInspirationStates.values()) {
        if (state !== exceptState) closeComposerInspiration(state);
      }
    };

    const releaseComposerInspiration = (state) => {
      if (!state) return;
      const editor = state.editor;
      editor.removeEventListener?.("input", state.onInput);
      document.removeEventListener?.("pointerdown", state.onPointerDown, true);
      document.removeEventListener?.("keydown", state.onKeyDown, true);
      state.composer.classList.remove("dream-miku-composer-inspiration-empty");
      state.wrapper.remove();
      state.popover.remove();
      composerInspirationStates.delete(state.composer);
    };

    const composerInspirationContext = () => {
      const candidates = taskCandidatesFromSidebar();
      const active = candidates.find(({ source }) =>
        source.matches?.('[data-app-action-sidebar-thread-active="true"]')
        || source.getAttribute?.("data-app-action-sidebar-thread-active") === "true");
      const context = active?.projectKey ? "project" : "global";
      const items = taskWindowsFor(
        candidates.filter((item) => item.source !== active?.source),
        {
          context,
          projectKey: context === "project" ? active.projectKey : null,
          limit: 6,
        },
      );
      return {
        active,
        context,
        projectKey: active?.projectKey || null,
        items,
      };
    };

    const renderComposerInspirationItems = (state, { context, projectKey, items }) => {
      const signature = items.map((item) => [
        item.label,
        item.source.getAttribute?.("data-app-action-sidebar-thread-id") || "",
      ].join("::")).join("||");
      if (signature !== state.itemSignature) {
        state.itemSignature = signature;
        state.list.replaceChildren?.();
        while (state.list.firstChild) state.list.removeChild(state.list.firstChild);
        state.empty.hidden = items.length > 0;
        for (const item of items) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "dream-miku-inspiration-item";
          button.setAttribute("data-dream-miku-composer-inspiration-task", "true");
          button.innerHTML = '<span aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#dream-icon-twin-note"></use></svg></span><span></span>';
          const label = button.children?.[1];
          if (label) label.textContent = item.label;
          else button.textContent = item.label;
          button.addEventListener?.("click", () => {
            closeComposerInspiration(state);
            item.source.click?.();
          });
          state.list.append?.(button);
        }
      }
      state.trigger.disabled = items.length === 0;
      state.trigger.setAttribute(
        "title",
        items.length ? "从真实任务中迸发灵感" : "当前没有可继续的真实任务",
      );
      state.subtitle.textContent = context === "project"
        ? `${projectKey} · 项目任务`
        : "最近任务";
    };

    const syncComposerInspirationVisibility = (state) => {
      const isEmpty = Boolean(
        state.editor?.isConnected && cleanLabel(state.editor.textContent) === "",
      );
      state.wrapper.hidden = !isEmpty;
      state.composer.classList.toggle("dream-miku-composer-inspiration-empty", isEmpty);
      if (!isEmpty) closeComposerInspiration(state);
      return isEmpty;
    };

    const positionComposerInspiration = (state) => {
      const triggerRect = state.trigger.getBoundingClientRect?.();
      const popoverWidth = Math.min(320, Math.max(240, window.innerWidth - 32));
      const preferredLeft = (triggerRect?.right || window.innerWidth - 16) - popoverWidth;
      const left = Math.min(
        window.innerWidth - popoverWidth - 16,
        Math.max(16, preferredLeft),
      );
      state.popover.style.setProperty("--dream-miku-inspiration-left", `${left}px`);
      state.popover.style.setProperty(
        "--dream-miku-inspiration-bottom",
        `${Math.max(16, window.innerHeight - (triggerRect?.top || 0) + 8)}px`,
      );
    };

    const ensureComposerInspiration = (composer) => {
      const editor = composer.querySelector(
        '.ProseMirror[contenteditable="true"][data-codex-composer="true"]',
      );
      let state = composerInspirationStates.get(composer);
      if (!editor) {
        releaseComposerInspiration(state);
        return null;
      }
      if (state && state.editor !== editor) {
        releaseComposerInspiration(state);
        state = null;
      }
      if (!state) {
        const wrapper = document.createElement("span");
        wrapper.className = "dream-miku-composer-inspiration";
        const trigger = document.createElement("button");
        const popoverId = `dream-miku-composer-inspiration-popover-${++composerInspirationSequence}`;
        trigger.type = "button";
        trigger.className = "dream-miku-inspiration-trigger";
        trigger.setAttribute("aria-label", "打开灵感迸发");
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-controls", popoverId);
        trigger.innerHTML = `<span class="dream-miku-control-icon" aria-hidden="true" data-dream-miku-symbol="${HOME_UTILITY_ICONS.inspiration}"><svg viewBox="0 0 24 24"><use href="#${HOME_UTILITY_ICONS.inspiration}"></use></svg></span><span class="dream-miku-inspiration-label">灵感迸发</span>`;
        const popover = document.createElement("div");
        popover.className = "dream-miku-inspiration-popover dream-miku-composer-inspiration-popover";
        popover.id = popoverId;
        popover.hidden = true;
        popover.setAttribute("role", "dialog");
        popover.setAttribute("aria-label", "灵感迸发中的真实任务");
        const popoverHeader = document.createElement("header");
        const popoverTitle = document.createElement("span");
        const subtitle = document.createElement("small");
        const list = document.createElement("div");
        const empty = document.createElement("p");
        popoverTitle.textContent = "灵感迸发";
        list.className = "dream-miku-inspiration-list";
        empty.className = "dream-miku-inspiration-empty";
        empty.textContent = "这个项目暂时没有可继续的任务";
        empty.hidden = true;
        popoverHeader.append?.(popoverTitle, subtitle);
        popover.append?.(popoverHeader, list, empty);
        wrapper.append?.(trigger);
        composer.append?.(wrapper);
        document.body?.append?.(popover);
        state = {
          composer,
          editor,
          wrapper,
          trigger,
          popover,
          list,
          empty,
          subtitle,
          itemSignature: null,
          onInput: null,
          onPointerDown: null,
          onKeyDown: null,
        };
        state.onInput = () => syncComposerInspirationVisibility(state);
        state.onPointerDown = (event) => {
          if (!wrapper.contains?.(event.target) && !popover.contains?.(event.target)) {
            closeComposerInspiration(state);
          }
        };
        state.onKeyDown = (event) => {
          if (event.key === "Escape" && !popover.hidden) {
            event.preventDefault?.();
            closeComposerInspiration(state, { restoreFocus: true });
          }
        };
        trigger.addEventListener?.("click", () => {
          if (trigger.disabled) return;
          const nextOpen = popover.hidden;
          if (nextOpen) {
            closeInspiration();
            closeAllComposerInspirations({ exceptState: state });
            positionComposerInspiration(state);
            wrapper.classList.add("is-open");
            popover.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            window.requestAnimationFrame?.(() =>
              popover.querySelector?.(".dream-miku-inspiration-item")?.focus?.());
          } else closeComposerInspiration(state);
        });
        editor.addEventListener?.("input", state.onInput);
        document.addEventListener?.("pointerdown", state.onPointerDown, true);
        document.addEventListener?.("keydown", state.onKeyDown, true);
        composerInspirationStates.set(composer, state);
      }
      renderComposerInspirationItems(state, composerInspirationContext());
      syncComposerInspirationVisibility(state);
      return state;
    };

    const syncComposerInspirations = (shellMain) => {
      const currentComposers = composerTargetsFor(shellMain);
      for (const [composer, state] of composerInspirationStates) {
        if (!currentComposers.has(composer)) releaseComposerInspiration(state);
      }
      let visibleCount = 0;
      for (const composer of currentComposers) {
        const state = ensureComposerInspiration(composer);
        if (state && !state.wrapper.hidden) visibleCount += 1;
      }
      return visibleCount;
    };

    const nativeActionIconSlotFor = (control, { environment = false } = {}) => {
      const exactSlot = environment
        ? control?.querySelector?.('[data-slot="thread-summary-panel-item-leading"]')
        : control?.querySelector?.(":scope > div > span:first-child > svg")?.parentElement;
      if (exactSlot) return exactSlot;
      return [...(control?.children || [])].find((child) => child.tagName === "SVG") || null;
    };

    const rowContainerFor = (control, sidebar) => {
      let candidate = control?.parentElement || null;
      while (candidate && candidate !== sidebar) {
        const className = String(candidate.className || "");
        if (className.includes("h-[var(--height-token-row)]")) return candidate;
        candidate = candidate.parentElement;
      }
      return control?.parentElement || null;
    };

    const syncSidebar = () => {
      const current = new Map();
      const currentInsertedNodes = new Set();
      const sidebar = document.querySelector("aside.app-shell-left-panel");
      if (sidebar) {
        markNode(current, sidebar, SIDEBAR_CLASS);
        const modeButton = sidebar.querySelector('button[aria-label^="切换模式"]');
        const modeLabel = modeButton?.querySelector("span.truncate") || null;
        const header = modeButton?.parentElement || null;
        markNode(current, header, "dream-miku-sidebar-header");
        markNode(current, modeButton, "dream-miku-sidebar-mode-button");
        markNode(current, modeLabel, "dream-miku-sidebar-mode-label");
        markNode(current, sidebar.querySelector('button[aria-label="搜索"]'), "dream-miku-sidebar-search");
        currentInsertedNodes.add(
          ensureSidebarSigil(modeButton, "dream-miku-sidebar-brand-mark", "dream-icon-wave-heart"),
        );
        currentInsertedNodes.add(
          ensureSidebarSigil(modeButton, "dream-miku-sidebar-edition", "", { prepend: false, text: "01" }),
        );

        const newTaskControl = [...sidebar.querySelectorAll("button")]
          .find((button) => cleanLabel(button.textContent) === "新建任务");
        markNode(
          current,
          rowContainerFor(newTaskControl, sidebar),
          "dream-miku-sidebar-new-task",
        );
        for (const [label, symbolId] of SIDEBAR_ACTION_ICONS) {
          const control = [...sidebar.querySelectorAll("button")]
            .find((button) => cleanLabel(button.textContent) === label);
          if (!control) continue;
          markNode(current, control, "dream-miku-sidebar-action");
          markNode(
            current,
            nativeActionIconSlotFor(control),
            "dream-miku-native-action-icon",
          );
          currentInsertedNodes.add(ensureActionIcon(control, symbolId, insertedSidebarNodes));
        }
        markNode(
          current,
          sidebar.querySelector("[data-app-action-sidebar-scroll]"),
          "dream-miku-sidebar-scroll",
        );

        for (const section of sidebar.querySelectorAll("[data-app-action-sidebar-section-heading]")) {
          markNode(current, section, "dream-miku-sidebar-section");
          const toggle = section.querySelector("[data-app-action-sidebar-section-toggle]");
          markNode(current, toggle, "dream-miku-sidebar-section-toggle");
          const heading = section.getAttribute("data-app-action-sidebar-section-heading");
          const symbolId = heading === "Projects"
            ? "dream-icon-signal-orbit"
            : heading === "Pinned" ? "dream-icon-twin-note" : "dream-icon-word-bloom";
          currentInsertedNodes.add(
            ensureSidebarSigil(toggle, "dream-miku-sidebar-section-sigil", symbolId),
          );
        }

        markNode(
          current,
          sidebar.querySelector('button[aria-label="打开个人资料菜单"]'),
          "dream-miku-sidebar-profile",
        );
      }

      for (const [node, classes] of markedSidebarNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedSidebarNodes.clear();
      for (const [node, classes] of current) markedSidebarNodes.set(node, classes);
      for (const node of [...insertedSidebarNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedSidebarNodes.delete(node);
      }
      return Boolean(sidebar);
    };

    const syncShellControls = () => {
      const current = new Map();
      const currentInsertedNodes = new Set();
      const recipes = [
        ['button[aria-label="搜索"]', SHELL_CONTROL_ICONS.search, "dream-miku-shell-search"],
        ['button[aria-label="打开帮助菜单"]', SHELL_CONTROL_ICONS.help, "dream-miku-shell-help"],
        [
          'button[aria-label="显示/隐藏侧边栏"]',
          SHELL_CONTROL_ICONS.sidebarToggle,
          "dream-miku-shell-sidebar-toggle",
        ],
        [
          'button[aria-label="隐藏边栏"]',
          SHELL_CONTROL_ICONS.sidebarToggle,
          "dream-miku-shell-sidebar-toggle",
        ],
        [
          'button[aria-label="显示边栏"]',
          SHELL_CONTROL_ICONS.sidebarToggle,
          "dream-miku-shell-sidebar-toggle",
        ],
        [
          'button[aria-label="切换底部面板显示"]',
          SHELL_CONTROL_ICONS.bottomPanelToggle,
          "dream-miku-shell-bottom-panel-toggle",
        ],
        ['button[aria-label="展开面板"]', SHELL_CONTROL_ICONS.panelExpand, "dream-miku-shell-panel-expand"],
      ];
      let shellControlCandidateCount = 0;
      let shellControlIconCount = 0;

      for (const [selector, symbolId, specificClass] of recipes) {
        for (const control of document.querySelectorAll(selector)) {
          shellControlCandidateCount += 1;
          markNode(current, control, specificClass);
          const icon = ensureControlIcon({
            current,
            currentInsertedNodes,
            insertedNodes: insertedShellControlNodes,
            control,
            host: control,
            nativeIcon: control.querySelector(":scope > svg"),
            symbolId,
            controlClass: "dream-miku-shell-control",
            iconClass: "dream-miku-shell-control-icon",
          });
          if (icon) shellControlIconCount += 1;
        }
      }

      for (const [node, classes] of markedShellControlNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedShellControlNodes.clear();
      for (const [node, classes] of current) markedShellControlNodes.set(node, classes);
      for (const node of [...insertedShellControlNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedShellControlNodes.delete(node);
      }
      return {
        shellControlCandidateCount,
        shellControlIconCount,
        unmatchedShellControlCount: Math.max(0, shellControlCandidateCount - shellControlIconCount),
      };
    };

    const rightPanelSymbolForTab = (tabId) => {
      if (tabId === "diff") return "dream-icon-right-review";
      if (tabId.startsWith("terminal:")) return "dream-icon-right-terminal";
      if (tabId.startsWith("browser:")) return "dream-icon-right-browser";
      if (tabId.startsWith("file:") || tabId.startsWith("files:")) return "dream-icon-right-files";
      if (tabId.startsWith("sidechat:")) return "dream-icon-right-side-task";
      return null;
    };

    const nativeRightIconSlotFor = (control) => {
      const leading = [...(control?.children || [])].find((child) =>
        !child.classList?.contains("dream-miku-action-icon") &&
        (child.tagName === "SVG" || child.querySelector?.("svg")));
      return leading || null;
    };

    const syncRightWorkspace = () => {
      const current = new Map();
      const currentSideChat = new Map();
      const currentInsertedNodes = new Set();
      let sideChatCount = 0;
      let rightActionIconCount = 0;
      const actionRecipes = new Map(RIGHT_PANEL_ACTION_ICONS);

      for (const workspace of document.querySelectorAll(
        'aside[data-app-shell-focus-area="right-panel"]',
      )) {
        const surface = workspace.querySelector('[data-app-shell-tabs="true"]');
        const tabStrip = surface?.querySelector('[data-app-shell-tab-strip-controller="right"]');
        markNode(current, workspace, RIGHT_WORKSPACE_CLASS);
        markNode(current, surface, "dream-miku-right-workspace-surface");
        markNode(current, tabStrip?.parentElement, "dream-miku-right-workspace-toolbar");

        const launcherButtons = [];
        for (const button of workspace.querySelectorAll("button")) {
          if (button.closest?.('[data-app-shell-tab-controller="right"]')) continue;
          const text = cleanLabel(button.textContent);
          const recipe = [...actionRecipes].find(([label]) => text.startsWith(label));
          if (!recipe) continue;
          const [, symbolId] = recipe;
          launcherButtons.push(button);
          markNode(current, button, "dream-miku-right-action");
          markNode(current, button.parentElement, "dream-miku-right-workspace-launcher");
          markNode(current, nativeRightIconSlotFor(button), "dream-miku-native-right-icon");
          const icon = ensureActionIcon(button, symbolId, insertedRightWorkspaceNodes);
          if (icon) {
            currentInsertedNodes.add(icon);
            rightActionIconCount += 1;
          }
        }
        const launcherList = launcherButtons[0]?.closest?.("ul") || null;
        const launcherCard = launcherList?.parentElement || null;
        const launcherFlow = launcherCard?.parentElement || null;
        const launcherSurface = launcherFlow?.parentElement || null;
        markNode(current, launcherList, "dream-miku-right-launcher-list");
        markNode(current, launcherCard, "dream-miku-right-launcher-card");
        markNode(current, launcherFlow, "dream-miku-right-launcher-flow");
        markNode(current, launcherSurface, "dream-miku-right-launcher-surface");

        const tabs = [...(surface?.querySelectorAll?.(
          '[data-app-shell-tab-controller="right"][data-tab-id]',
        ) || [])];
        for (const tab of tabs) {
          const tabId = tab.getAttribute("data-tab-id") || "";
          const symbolId = rightPanelSymbolForTab(tabId);
          const control = tab.querySelector('button[role="tab"]') || tab.querySelector("button");
          markNode(current, tab, "dream-miku-right-tab");
          if (!symbolId || !control) continue;
          markNode(current, control, "dream-miku-right-action");
          markNode(current, nativeRightIconSlotFor(control), "dream-miku-native-right-icon");
          const icon = ensureActionIcon(control, symbolId, insertedRightWorkspaceNodes);
          if (icon) {
            currentInsertedNodes.add(icon);
            rightActionIconCount += 1;
          }
        }

        for (const panel of surface?.querySelectorAll?.(
          '[data-app-shell-tab-panel-controller="right"][data-tab-id]',
        ) || []) {
          markNode(current, panel, "dream-miku-right-panel");
        }

        const sideChatPanels = [...(surface?.querySelectorAll?.(
          '[data-app-shell-tab-panel-controller="right"][data-tab-id^="sidechat:"]',
        ) || [])];
        if (sideChatPanels.length) {
          markNode(currentSideChat, workspace, SIDE_CHAT_CLASS);
          markNode(currentSideChat, surface, "dream-miku-side-chat-surface");
          markNode(currentSideChat, tabStrip?.parentElement, "dream-miku-side-chat-toolbar");
        }
        for (const panel of sideChatPanels) {
          sideChatCount += 1;
          const tabId = panel.getAttribute("data-tab-id");
          const tab = tabs.find((candidate) => candidate.getAttribute("data-tab-id") === tabId);
          markNode(currentSideChat, tab, "dream-miku-side-chat-tab");
          markNode(currentSideChat, panel, "dream-miku-side-chat-panel");
          markNode(
            currentSideChat,
            panel.querySelector("[data-app-action-timeline-scroll]"),
            "dream-miku-side-chat-scroll",
          );
          markNode(
            currentSideChat,
            panel.querySelector('[data-mcp-app-portal-target="true"]'),
            "dream-miku-side-chat-content",
          );
          for (const message of panel.querySelectorAll('[data-user-message-bubble="true"]')) {
            markNode(currentSideChat, message, "dream-miku-side-chat-user-message");
          }
          for (const message of panel.querySelectorAll(
            '[data-local-conversation-final-assistant="true"]',
          )) {
            markNode(currentSideChat, message, "dream-miku-side-chat-assistant-message");
          }
          markNode(
            currentSideChat,
            panel.querySelector(".composer-surface-chrome"),
            "dream-miku-side-chat-composer",
          );
        }
      }

      for (const [node, classes] of markedRightWorkspaceNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedRightWorkspaceNodes.clear();
      for (const [node, classes] of current) markedRightWorkspaceNodes.set(node, classes);
      for (const node of [...insertedRightWorkspaceNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedRightWorkspaceNodes.delete(node);
      }

      for (const [node, classes] of markedSideChatNodes) {
        const nextClasses = currentSideChat.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedSideChatNodes.clear();
      for (const [node, classes] of currentSideChat) markedSideChatNodes.set(node, classes);

      return {
        rightWorkspaceCount: [...markedRightWorkspaceNodes.values()]
          .filter((classes) => classes.has(RIGHT_WORKSPACE_CLASS)).length,
        sideChatCount,
        rightActionIconCount,
      };
    };

    const syncComposerControls = (shellMain) => {
      const current = new Map();
      const currentInsertedNodes = new Set();
      let composerIconCount = 0;
      let composerPermissionCount = 0;
      for (const composer of composerTargetsFor(shellMain)) {
        markNode(current, composer, "dream-miku-native-composer-controls");
        const addControl = composer.querySelector(
          '[data-composer-navigation-target="add-context"], button[aria-label="添加文件等内容"]',
        );
        const modelControl = composer.querySelector(
          '[data-composer-navigation-target="reasoning"]',
        );
        const microphoneControl = composer.querySelector('button[aria-label="听写"]');
        const sendControl = [...(composer.querySelectorAll?.("button.bg-token-foreground") || [])]
          .find((button) => button.getAttribute("aria-label") !== "停止") || null;
        const stopControl = composer.querySelector('button[aria-label="停止"]');
        const modelNativeIcon = modelControl?.querySelector(
          '[class*="_ModelPickerTriggerInlineFastIcon_"]',
        ) || null;
        const modelHost = modelNativeIcon?.parentElement || modelControl?.querySelector(
          '[class*="_ModelPickerTriggerContent_"] > [class*="_ModelPickerTriggerLabel_"]',
        ) || modelControl;
        const controls = [
          {
            control: addControl,
            host: addControl,
            nativeIcon: addControl?.querySelector(":scope > svg"),
            symbolId: COMPOSER_CONTROL_ICONS.add,
          },
          {
            control: modelControl,
            host: modelHost,
            nativeIcon: modelNativeIcon,
            symbolId: COMPOSER_CONTROL_ICONS.model,
          },
          {
            control: microphoneControl,
            host: microphoneControl,
            nativeIcon: microphoneControl?.querySelector(":scope > svg"),
            symbolId: COMPOSER_CONTROL_ICONS.microphone,
          },
          {
            control: sendControl,
            host: sendControl,
            nativeIcon: sendControl?.querySelector(":scope > svg"),
            symbolId: COMPOSER_CONTROL_ICONS.send,
          },
          {
            control: stopControl,
            host: stopControl,
            nativeIcon: stopControl?.querySelector(":scope > svg"),
            symbolId: COMPOSER_CONTROL_ICONS.stop,
            controlClass: "dream-miku-composer-stop",
          },
        ];
        for (const item of controls) {
          if (ensureControlIcon({
            current,
            currentInsertedNodes,
            insertedNodes: insertedComposerNodes,
            ...item,
            controlClass: item.controlClass || "dream-miku-composer-control",
            iconClass: "dream-miku-composer-control-icon",
          })) composerIconCount += 1;
        }

        const permissionControl = composer.querySelector(
          '[data-composer-navigation-target="permissions"]',
        );
        const permissionNativeLabel = permissionControl?.querySelector(
          '[data-tooltip-overflow-target="true"]',
        ) || null;
        const permissionPresentation = composerPermissionPresentationFor(
          permissionNativeLabel?.textContent,
        );
        if (permissionControl && permissionNativeLabel && permissionPresentation) {
          const [nativeLabel, visualLabelText, symbolId] = permissionPresentation;
          const permissionNativeIcon = permissionControl.querySelector(
            ':scope > span > svg:first-of-type',
          );
          const permissionIconHost = permissionNativeIcon?.parentElement || null;
          const permissionLabelHost = permissionNativeLabel.parentElement || null;
          const permissionIcon = ensureControlIcon({
            current,
            currentInsertedNodes,
            insertedNodes: insertedComposerNodes,
            control: permissionControl,
            host: permissionIconHost,
            nativeIcon: permissionNativeIcon,
            symbolId,
            controlClass: "dream-miku-composer-permission",
            iconClass: "dream-miku-composer-permission-icon",
          });
          if (permissionIcon && permissionLabelHost) {
            markNode(
              current,
              permissionNativeLabel,
              "dream-miku-composer-permission-native-label",
            );
            markNode(
              current,
              permissionLabelHost,
              "dream-miku-composer-permission-label-host",
            );
            markNode(
              current,
              permissionControl,
              `dream-miku-composer-permission-${nativeLabel === "完全访问" ? "full" : "safe"}`,
            );
            let visualLabel = [...(permissionLabelHost.children || [])].find((node) =>
              node.classList?.contains("dream-miku-composer-permission-visual-label"));
            if (!visualLabel) {
              visualLabel = document.createElement("span");
              visualLabel.className = "dream-miku-composer-permission-visual-label";
              visualLabel.classList.add("dream-miku-composer-permission-visual-label");
              visualLabel.setAttribute("aria-hidden", "true");
              permissionLabelHost.append?.(visualLabel);
            }
            if (visualLabel.textContent !== visualLabelText) {
              visualLabel.textContent = visualLabelText;
            }
            insertedComposerNodes.add(visualLabel);
            currentInsertedNodes.add(visualLabel);
            composerPermissionCount += 1;
          }
        }
      }

      for (const [node, classes] of markedComposerNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedComposerNodes.clear();
      for (const [node, classes] of current) markedComposerNodes.set(node, classes);
      for (const node of [...insertedComposerNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedComposerNodes.delete(node);
      }
      return { composerIconCount, composerPermissionCount };
    };

    const syncPortalMenus = () => {
      const current = new Map();
      const currentInsertedNodes = new Set();
      let speedIconCount = 0;
      let permissionIconCount = 0;
      let permissionTitleCount = 0;
      let permissionDescriptionCount = 0;

      for (const item of document.querySelectorAll('[role="menuitem"][aria-label^="速度 "]')) {
        const speed = cleanLabel(item.getAttribute("aria-label")).replace(/^速度\s*/, "");
        const symbolId = MODEL_SPEED_ICONS[speed];
        if (!symbolId) continue;
        markNode(current, item, "dream-miku-model-speed-item");
        const host = item.querySelector(":scope > div") || item;
        let icon = [...(host.children || [])].find((node) =>
          node.classList?.contains("dream-miku-model-speed-icon"));
        if (!icon) {
          icon = document.createElement("span");
          icon.className = "dream-miku-model-speed-icon";
          icon.classList.add("dream-miku-model-speed-icon");
          icon.setAttribute("aria-hidden", "true");
          host.prepend(icon);
        }
        if (icon.getAttribute("data-dream-miku-symbol") !== symbolId) {
          icon.setAttribute("data-dream-miku-symbol", symbolId);
          icon.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><use href="#${symbolId}"></use></svg>`;
        }
        insertedPortalNodes.add(icon);
        currentInsertedNodes.add(icon);
        speedIconCount += 1;
      }

      for (const item of document.querySelectorAll('[role="menuitem"]')) {
        for (const [title, visualTitleText, visualDescriptionText, symbolId]
          of PERMISSION_PRESENTATIONS) {
          const titleNode = [...item.querySelectorAll("span")].find((node) => {
            const label = cleanLabel(node.textContent);
            return label === title || label.startsWith(`${title} (`);
          });
          const host = titleNode?.parentElement;
          const nativeDescription = [...(host?.children || [])].find((node) =>
            node !== titleNode
            && node.getAttribute?.("aria-hidden") !== "true"
            && cleanLabel(node.textContent));
          const nativeIcon = item.querySelector(":scope > div > svg:first-of-type");
          const rowHost = nativeIcon?.parentElement;
          if (!host || !nativeDescription || !nativeIcon || !rowHost) continue;
          markNode(current, item, "dream-miku-permission-item");
          markNode(current, titleNode, "dream-miku-permission-native-title");
          markNode(current, nativeDescription, "dream-miku-permission-native-description");
          markNode(current, nativeIcon, "dream-miku-permission-native-icon");

          let icon = [...(rowHost.children || [])].find((node) =>
            node.classList?.contains("dream-miku-permission-icon"));
          if (!icon) {
            icon = document.createElement("span");
            icon.className = "dream-miku-permission-icon";
            icon.classList.add("dream-miku-permission-icon");
            icon.setAttribute("aria-hidden", "true");
            rowHost.prepend?.(icon);
          }
          if (icon.getAttribute("data-dream-miku-symbol") !== symbolId) {
            icon.setAttribute("data-dream-miku-symbol", symbolId);
            icon.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><use href="#${symbolId}"></use></svg>`;
          }

          let visualTitle = [...(host.children || [])].find((node) =>
            node.classList?.contains("dream-miku-permission-visual-title"));
          if (!visualTitle) {
            visualTitle = document.createElement("span");
            visualTitle.className = "dream-miku-permission-visual-title";
            visualTitle.classList.add("dream-miku-permission-visual-title");
            visualTitle.setAttribute("aria-hidden", "true");
            host.prepend?.(visualTitle);
          }
          visualTitle.classList.toggle(
            "dream-miku-permission-visual-title-warning",
            title === "完全访问权限",
          );
          if (visualTitle.textContent !== visualTitleText) {
            visualTitle.textContent = visualTitleText;
          }

          let visualDescription = [...(host.children || [])].find((node) =>
            node.classList?.contains("dream-miku-permission-visual-description"));
          if (!visualDescription) {
            visualDescription = document.createElement("span");
            visualDescription.className = "dream-miku-permission-visual-description";
            visualDescription.classList.add("dream-miku-permission-visual-description");
            visualDescription.setAttribute("aria-hidden", "true");
            host.append?.(visualDescription);
          }
          if (visualDescription.textContent !== visualDescriptionText) {
            visualDescription.textContent = visualDescriptionText;
          }
          insertedPortalNodes.add(icon);
          currentInsertedNodes.add(icon);
          insertedPortalNodes.add(visualTitle);
          currentInsertedNodes.add(visualTitle);
          insertedPortalNodes.add(visualDescription);
          currentInsertedNodes.add(visualDescription);
          permissionIconCount += 1;
          permissionTitleCount += 1;
          permissionDescriptionCount += 1;
          break;
        }
      }

      for (const [node, classes] of markedPortalNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedPortalNodes.clear();
      for (const [node, classes] of current) markedPortalNodes.set(node, classes);
      for (const node of [...insertedPortalNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedPortalNodes.delete(node);
      }
      return {
        speedIconCount,
        permissionIconCount,
        permissionTitleCount,
        permissionDescriptionCount,
        permissionLabelCount: permissionDescriptionCount,
      };
    };

    const syncPanels = () => {
      const current = new Map();
      const currentInsertedNodes = new Set();
      const root = document.querySelector('[data-pip-obstacle="thread-summary-panel"]');
      const section = root?.querySelector("section") || null;
      const card = section?.parentElement?.parentElement || null;
      if (card && section) {
        markNode(current, card, PANEL_CLASS);
        const actions = [...section.querySelectorAll("button")]
          .filter((button) => String(button.className).includes("group/summary-panel-item"))
          .slice(0, ENVIRONMENT_ACTION_ICONS.length);
        actions.forEach((button, index) => {
          markNode(current, button, "dream-miku-context-action");
          markNode(
            current,
            nativeActionIconSlotFor(button, { environment: true }),
            "dream-miku-native-action-icon",
          );
          currentInsertedNodes.add(
            ensureActionIcon(button, ENVIRONMENT_ACTION_ICONS[index], insertedPanelNodes),
          );
        });
      }
      for (const [node, classes] of markedPanelNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedPanelNodes.clear();
      for (const [node, classes] of current) markedPanelNodes.set(node, classes);
      for (const node of [...insertedPanelNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedPanelNodes.delete(node);
      }
      return Boolean(card);
    };

    const syncHomeControls = (home) => {
      const current = new Map();
      const currentInsertedNodes = new Set();
      let capabilityIconCount = 0;
      let utilityIconCount = 0;

      if (home) {
        markNode(current, home, "dream-miku-home-controls");
        const flow = home.querySelector?.(":scope > div:first-child") || null;
        const heroBand = flow?.querySelector?.(":scope > div:first-child") || null;
        const composerBand = [...(flow?.children || [])].find((node) =>
          node.querySelector?.("[data-codex-composer-root]")) || null;
        markNode(current, flow, "dream-miku-home-flow");
        markNode(current, heroBand, "dream-miku-home-hero-band");
        markNode(current, composerBand, "dream-miku-home-composer-band");

        const suggestions = home.querySelector?.(".group\\/home-suggestions") || null;
        markNode(current, suggestions, "dream-miku-home-capabilities");
        const iconByLabel = new Map(HOME_CAPABILITY_ICONS);
        for (const control of suggestions?.querySelectorAll?.("button") || []) {
          const symbolId = iconByLabel.get(cleanLabel(control.textContent));
          if (!symbolId) continue;
          const host = control.querySelector?.(":scope > span:first-child > span:first-child") || null;
          const nativeIcon = host?.querySelector?.(":scope > svg") || null;
          if (ensureControlIcon({
            current,
            currentInsertedNodes,
            insertedNodes: insertedHomeNodes,
            control,
            host,
            nativeIcon,
            symbolId,
            controlClass: "dream-miku-home-capability",
          })) capabilityIconCount += 1;
        }

        const utilitySurface = home.querySelector?.(".dream-skin-home-utility") || null;
        const utilityBar = utilitySurface?.querySelector?.(
          "[data-composer-utility-bar-scroll-area]",
        ) || null;
        markNode(current, utilitySurface, "dream-miku-home-utility-surface");
        markNode(current, utilityBar, "dream-miku-home-utility-bar");
        const utilityControls = {
          project: utilityBar?.querySelector?.(
            '[data-composer-navigation-target="workspace-project"]',
          ),
          local: utilityBar?.querySelector?.(
            '[data-composer-navigation-target="run-location"]',
          ),
          branch: utilityBar?.querySelector?.(
            '[data-composer-navigation-target="branch"]',
          ),
        };
        for (const [kind, control] of Object.entries(utilityControls)) {
          const host = leadingControlSlot(control);
          const nativeIcon = host?.querySelector?.(
            ":scope > svg, :scope > [data-project-selector-icon]",
          ) || null;
          if (ensureControlIcon({
            current,
            currentInsertedNodes,
            insertedNodes: insertedHomeNodes,
            control,
            host,
            nativeIcon,
            symbolId: HOME_UTILITY_ICONS[kind],
            controlClass: "dream-miku-home-utility-control",
          })) utilityIconCount += 1;
        }

        const projectControl = utilityControls.project;
        const rawProjectLabel = cleanLabel(
          projectControl?.getAttribute?.("aria-label") || projectControl?.textContent,
        );
        const projectKey = cleanLabel(
          rawProjectLabel.replace(/^切换项目\s*[：:]\s*/, ""),
        );
        const context = projectKey && !/^(选择项目|项目)$/.test(projectKey)
          ? "project"
          : "global";
        const inspirationItems = taskWindowsFor(taskCandidatesFromSidebar(), {
          context,
          projectKey: context === "project" ? projectKey : null,
          limit: 6,
        });
        const inspiration = ensureInspiration({
          utilityBar,
          branchControl: utilityControls.branch,
          context,
          projectKey,
          items: inspirationItems,
        });
        if (inspiration) {
          currentInsertedNodes.add(inspiration);
          currentInsertedNodes.add(inspirationState?.popover);
        }

      } else {
        releaseInspiration();
      }

      for (const [node, classes] of markedHomeNodes) {
        const nextClasses = current.get(node);
        for (const className of classes) {
          if (!nextClasses?.has(className)) node.classList.remove(className);
        }
      }
      markedHomeNodes.clear();
      for (const [node, classes] of current) markedHomeNodes.set(node, classes);
      for (const node of [...insertedHomeNodes]) {
        if (currentInsertedNodes.has(node)) continue;
        node.remove();
        insertedHomeNodes.delete(node);
      }
      return {
        capabilityIconCount,
        utilityIconCount,
        inspirationCount: inspirationState && !inspirationState.trigger.disabled ? 1 : 0,
      };
    };

    const sync = ({ home = null, shellMain = null } = {}) => {
      document.documentElement.setAttribute(LAYOUT_ATTR, "native-v2");
      document.documentElement.classList.toggle("dream-miku-home-route", Boolean(home));
      const sidebar = syncSidebar();
      const rightWorkspace = syncRightWorkspace();
      const hasPanel = syncPanels();
      const supportPhraseCount = syncSupportPhrases(shellMain);
      const { composerIconCount, composerPermissionCount } = syncComposerControls(shellMain);
      const composerInspirationCount = syncComposerInspirations(shellMain);
      const shellControls = syncShellControls();
      const portalMenus = syncPortalMenus();
      const homeControls = syncHomeControls(home);
      return {
        home: Boolean(home),
        sidebar,
        sideChat: rightWorkspace.sideChatCount > 0,
        panelCount: hasPanel ? 1 : 0,
        supportPhraseCount,
        composerIconCount,
        composerPermissionCount,
        composerInspirationCount,
        ...shellControls,
        ...rightWorkspace,
        ...portalMenus,
        ...homeControls,
      };
    };

    const cleanup = () => {
      for (const [node, classes] of markedPanelNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedPanelNodes.clear();
      for (const node of insertedPanelNodes) node.remove();
      insertedPanelNodes.clear();
      for (const [node, classes] of markedSidebarNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedSidebarNodes.clear();
      for (const node of insertedSidebarNodes) node.remove();
      insertedSidebarNodes.clear();
      for (const [node, classes] of markedRightWorkspaceNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedRightWorkspaceNodes.clear();
      for (const node of insertedRightWorkspaceNodes) node.remove();
      insertedRightWorkspaceNodes.clear();
      for (const [node, classes] of markedSideChatNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedSideChatNodes.clear();
      for (const className of SIDEBAR_MARK_CLASSES) {
        document.querySelectorAll(`.${className}`).forEach((node) => node.classList.remove(className));
      }
      for (const className of PANEL_MARK_CLASSES) {
        document.querySelectorAll(`.${className}`).forEach((node) => node.classList.remove(className));
      }
      for (const className of RIGHT_WORKSPACE_MARK_CLASSES) {
        document.querySelectorAll(`.${className}`).forEach((node) => node.classList.remove(className));
      }
      for (const className of SIDE_CHAT_MARK_CLASSES) {
        document.querySelectorAll(`.${className}`).forEach((node) => node.classList.remove(className));
      }
      releaseInspiration();
      for (const state of [...composerInspirationStates.values()]) {
        releaseComposerInspiration(state);
      }
      for (const [node, classes] of markedHomeNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedHomeNodes.clear();
      for (const node of insertedHomeNodes) node.remove();
      insertedHomeNodes.clear();
      for (const [node, classes] of markedComposerNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedComposerNodes.clear();
      for (const node of insertedComposerNodes) node.remove();
      insertedComposerNodes.clear();
      for (const [node, classes] of markedShellControlNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedShellControlNodes.clear();
      for (const node of insertedShellControlNodes) node.remove();
      insertedShellControlNodes.clear();
      for (const className of SHELL_CONTROL_MARK_CLASSES) {
        document.querySelectorAll(`.${className}`).forEach((node) => node.classList.remove(className));
      }
      for (const [node, classes] of markedPortalNodes) {
        for (const className of classes) node.classList.remove(className);
      }
      markedPortalNodes.clear();
      for (const node of insertedPortalNodes) node.remove();
      insertedPortalNodes.clear();
      stopSupportPhraseTimer();
      for (const state of supportPhraseStates.values()) restoreSupportPhraseState(state);
      supportPhraseStates.clear();
      releaseReducedMotionListener();
      document.documentElement.classList.remove("dream-miku-home-route");
      document.documentElement.removeAttribute(LAYOUT_ATTR);
    };

    const verify = () => {
      const sideChatPanelCount = document.querySelectorAll(
        '[data-app-shell-tab-panel-controller="right"][data-tab-id^="sidechat:"]',
      ).length;
      const sideChatThemedPanelCount = document.querySelectorAll(
        ".dream-miku-side-chat-panel",
      ).length;
      const supportPlaceholder = [...supportPhraseStates.values()]
        .map((state) => state.composer?.querySelector?.(".ProseMirror p.placeholder"))
        .find(Boolean) || null;
      let supportArtFontFamily = "";
      try {
        supportArtFontFamily = supportPlaceholder
          ? window.getComputedStyle?.(supportPlaceholder, "::after")?.fontFamily || ""
          : "";
      } catch {}
      let artFontLoaded = false;
      try {
        artFontLoaded = document.fonts?.check?.(
          `16px "${ART_FONT_FAMILY}"`,
          "初音未来",
        ) === true;
      } catch {}
      const permissionArtNodes = [
        ...document.querySelectorAll(".dream-miku-permission-visual-title"),
        ...document.querySelectorAll(".dream-miku-permission-visual-description"),
      ];
      const permissionArtFontFamilies = permissionArtNodes.map((node) => {
        try {
          return window.getComputedStyle?.(node)?.fontFamily || "";
        } catch {
          return "";
        }
      });
      const permissionArtTypographyPass = permissionArtFontFamilies.every((family) =>
        family.includes(ART_FONT_FAMILY));
      const artTypographyPass = artFontLoaded && (
        !supportPlaceholder || supportArtFontFamily.includes(ART_FONT_FAMILY)
      ) && permissionArtTypographyPass;
      return ({
      installed: document.documentElement.getAttribute(LAYOUT_ATTR) === "native-v2",
      contractVersion: INSTALL_CONTRACT,
      artFontFamily: ART_FONT_FAMILY,
      artFontLoaded,
      supportArtFontFamily,
      permissionArtFontFamilies,
      permissionArtTypographyPass,
      artTypographyPass,
      supportPhraseCatalogCount: SUPPORT_PHRASES.length,
      permissionPresentationCount: PERMISSION_PRESENTATIONS.length,
      iconSymbolCount: document.querySelectorAll("#codex-dream-skin-chrome symbol").length,
      sidebar: Boolean(document.querySelector(`aside.app-shell-left-panel.${SIDEBAR_CLASS}`)),
      sideChat: Boolean(document.querySelector(
        `aside[data-app-shell-focus-area="right-panel"].${SIDE_CHAT_CLASS}`,
      )),
      sideChatPanelCount,
      sideChatThemedPanelCount,
      sideChatPanelCoveragePass: sideChatPanelCount === sideChatThemedPanelCount,
      rightWorkspaceCount: document.querySelectorAll(
        `aside[data-app-shell-focus-area="right-panel"].${RIGHT_WORKSPACE_CLASS}`,
      ).length,
      rightActionIconCount: document.querySelectorAll(
        ".dream-miku-right-action > .dream-miku-action-icon",
      ).length,
      panelCount: [...markedPanelNodes.values()].filter((classes) => classes.has(PANEL_CLASS)).length,
      supportPhraseCount: [...supportPhraseStates.values()].filter((state) =>
        state.composer?.hasAttribute(SUPPORT_PHRASE_ATTR)).length,
      supportPhraseRotation: supportPhraseTimer == null ? "paused" : "running",
      capabilityIconCount: document.querySelectorAll(".dream-miku-home-capability").length,
      utilityIconCount: document.querySelectorAll(".dream-miku-home-utility-control").length,
      composerIconCount: document.querySelectorAll(
        ".dream-miku-composer-control, .dream-miku-composer-stop",
      ).length,
      composerPermissionCount: document.querySelectorAll(
        ".dream-miku-composer-permission-visual-label",
      ).length,
      shellControlIconCount: document.querySelectorAll(".dream-miku-shell-control-icon").length,
      inspirationCount: document.querySelectorAll(".dream-miku-inspiration").length,
      composerInspirationCount: document.querySelectorAll(
        ".dream-miku-composer-inspiration:not([hidden])",
      ).length,
      speedIconCount: document.querySelectorAll(".dream-miku-model-speed-icon").length,
      permissionIconCount: document.querySelectorAll(".dream-miku-permission-icon").length,
      permissionTitleCount: document.querySelectorAll(
        ".dream-miku-permission-visual-title",
      ).length,
      permissionDescriptionCount: document.querySelectorAll(
        ".dream-miku-permission-visual-description",
      ).length,
      permissionLabelCount: document.querySelectorAll(
        ".dream-miku-permission-visual-description",
      ).length,
      projectRecipes: theme.projectIcons || {},
      });
    };

    return {
      sync,
      cleanup,
      verify,
      projectRecipeFor: (key) => projectRecipeFor(key, theme.projectIcons),
    };
  }

  factory.model = Object.freeze({
    installContract: INSTALL_CONTRACT,
    supportPhraseCatalogCount: SUPPORT_PHRASES.length,
    permissionPresentationCount: PERMISSION_PRESENTATIONS.length,
    minimumIconSymbolCount: MINIMUM_ICON_SYMBOL_COUNT,
    cleanLabel,
    projectRecipeFor,
    taskWindowsFor,
    supportPhrases: SUPPORT_PHRASES,
    supportPresentations: SUPPORT_PRESENTATIONS,
    chooseSupportPhrase,
    supportPresentationFor,
    sidebarActionIcons: SIDEBAR_ACTION_ICONS,
    environmentActionIcons: ENVIRONMENT_ACTION_ICONS,
    homeCapabilityIcons: HOME_CAPABILITY_ICONS,
    homeUtilityIcons: HOME_UTILITY_ICONS,
    composerControlIcons: COMPOSER_CONTROL_ICONS,
    shellControlIcons: SHELL_CONTROL_ICONS,
    rightPanelActionIcons: RIGHT_PANEL_ACTION_ICONS,
    modelSpeedIcons: MODEL_SPEED_ICONS,
    permissionPresentations: PERMISSION_PRESENTATIONS,
    permissionDescriptions: PERMISSION_DESCRIPTIONS,
    permissionLabels: PERMISSION_DESCRIPTIONS,
    composerPermissionPresentations: COMPOSER_PERMISSION_PRESENTATIONS,
    composerPermissionPresentationFor,
  });
  global[FACTORY_KEY] = factory;
})(window);
