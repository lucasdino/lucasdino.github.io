(function () {
  const VERSIONS = [
    { id: "pages", label: "Original", isDefault: true },
    { id: "opus_46", label: "Claude Opus 4.6", headline: "Waiting for off hours...", thoughts: "TBU! They nuke Claude's ability during peak hours so I want to do this at an odd hour." },
    { id: "sonnet_46", label: "Claude Sonnet 4.6 (Med)", headline: "Claude has taste", thoughts: "This isn't even their top model. This wasn't even highest thinking mode. Sure, it didn't really restructure the website, but it looks so nice. Claude is just a great model." },
    { id: "gemini_31_cli", label: "Gemini 3.1 (Pro)", headline: "Great designer, underwhelming agent", thoughts: "Really good design. Like should I just use this as my website now lol?! Issue is that I asked it to not just redesign but restructure the whole website -- which it didn't do. So as a designer? Excellent. As an instruction-following agent? May want to work on that Google." },
    { id: "gpt_54_cli", label: "GPT 5.4 (xHigh)", headline: "Impressive but cringe writing", thoughts: "It actually took on the task to 'redo' the whole website. Started by reading some of my blogs then rebuilt the whole messaging + structure. Used tons of MCP calls to get screenshots and QA its work. Looks clean (despite some dumb phrases) -- overall really impressive agentic ability." },
  ];

  const AI_PREFIX = "ai_designed";

  const INFO_TEXT =
    "Want to see how good AI coding has gotten? I asked each to rebuild my website. One single prompt and let 'em cook.";

  function versionPath(versionId) {
    const v = VERSIONS.find((x) => x.id === versionId);
    if (v && v.isDefault) return "/pages";
    return "/" + AI_PREFIX + "/" + versionId;
  }

  function detectContext() {
    const path = window.location.pathname;
    for (const v of VERSIONS) {
      if (v.isDefault) continue;
      const prefix = "/" + AI_PREFIX + "/" + v.id + "/";
      if (path.startsWith(prefix)) {
        const page = path.replace(prefix, "");
        return { version: v.id, page: page || "index.html" };
      }
    }
    if (path.startsWith("/pages/")) {
      return { version: "pages", page: path.replace("/pages/", "") };
    }
    return { version: "pages", page: "index.html" };
  }

  function buildUrl(versionId, page) {
    const v = VERSIONS.find((x) => x.id === versionId);
    if (v && v.isDefault) {
      return page === "index.html" ? "/index.html" : "/pages/" + page;
    }
    return "/" + AI_PREFIX + "/" + versionId + "/" + page;
  }

  function fixNavLinks(versionId) {
    const titleLink = document.querySelector(".topbar .title");
    if (titleLink) {
      titleLink.setAttribute("href", buildUrl(versionId, "index.html"));
    }
    document.querySelectorAll(".topbar .navpointer").forEach((a) => {
      const href = a.getAttribute("href");
      const match = href.match(/\/(?:pages|ai_designed\/[^/]+)\/(.+)/);
      if (match) {
        const page = match[1];
        a.setAttribute("href", versionPath(versionId) + "/" + page);
      }
    });
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .version-switcher {
        position: relative;
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .version-btn {
        font-family: "Kode Mono", monospace;
        font-size: 0.85vw;
        font-weight: 400;
        background: none;
        border: 1.5px solid #ccc;
        border-radius: 4px;
        padding: 3px 10px;
        cursor: pointer;
        color: #333;
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      }
      .version-btn:hover { border-color: var(--ooh-red-hot); color: var(--ooh-red-hot); }
      .version-btn .arrow { font-size: 0.6vw; }
      .version-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        background: var(--subtle-white);
        border: 1.5px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        z-index: 9999;
        min-width: 160px;
      }
      .version-dropdown.open { display: block; }
      .version-dropdown .vd-info {
        font-family: "Montserrat", sans-serif;
        font-size: 9pt;
        color: #555;
        padding: 10px 12px;
        border-bottom: 1px solid #e0e0e0;
        line-height: 1.4;
      }
      .version-dropdown a {
        display: block;
        font-family: "Kode Mono", monospace;
        font-size: 0.85vw;
        text-decoration: none;
        color: #333;
        padding: 7px 12px;
        white-space: nowrap;
      }
      .version-dropdown a:hover { background: rgba(226,13,13,0.06); color: var(--ooh-red-hot); }
      .version-dropdown a.active { color: var(--ooh-red-hot); font-weight: 500; }
      .version-dropdown a { position: relative; }
      .thought-bubble {
        display: none;
        position: absolute;
        right: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%);
        background: #fff;
        border-left: 3px solid var(--ooh-red-hot);
        border-radius: 3px;
        padding: 8px 12px;
        font-family: "Montserrat", sans-serif;
        font-size: 8pt;
        font-style: italic;
        color: #555;
        line-height: 1.45;
        width: 210px;
        white-space: normal;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        pointer-events: none;
        z-index: 10000;
      }
      .thought-bubble .tb-headline {
        font-style: normal;
        font-weight: 600;
        font-size: 8.5pt;
        color: #333;
        margin-bottom: 4px;
      }
      .version-dropdown a:hover .thought-bubble { display: block; }
    `;
    document.head.appendChild(style);
  }

  function injectSwitcher() {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;

    const ctx = detectContext();
    fixNavLinks(ctx.version);

    const currentLabel = VERSIONS.find((v) => v.id === ctx.version).label;

    const wrapper = document.createElement("div");
    wrapper.className = "version-switcher";

    const btn = document.createElement("button");
    btn.className = "version-btn";
    btn.innerHTML = currentLabel + ' <span class="arrow">▼</span>';

    const dropdown = document.createElement("div");
    dropdown.className = "version-dropdown";

    const info = document.createElement("div");
    info.className = "vd-info";
    info.textContent = INFO_TEXT;
    dropdown.appendChild(info);

    VERSIONS.forEach((v) => {
      const a = document.createElement("a");
      a.href = buildUrl(v.id, ctx.page);
      a.textContent = v.label;
      if (v.id === ctx.version) a.classList.add("active");
      if (v.headline || v.thoughts) {
        const bubble = document.createElement("span");
        bubble.className = "thought-bubble";
        if (v.headline) {
          const h = document.createElement("div");
          h.className = "tb-headline";
          h.textContent = v.headline;
          bubble.appendChild(h);
        }
        if (v.thoughts) {
          const t = document.createElement("span");
          t.textContent = v.thoughts;
          bubble.appendChild(t);
        }
        a.appendChild(bubble);
      }
      dropdown.appendChild(a);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(dropdown);
    topbar.appendChild(wrapper);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => dropdown.classList.remove("open"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { injectStyles(); injectSwitcher(); });
  } else {
    injectStyles();
    injectSwitcher();
  }
})();
