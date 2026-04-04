(function () {
  const VERSIONS = [
    { id: "pages", label: "Original", isDefault: true },
    { id: "opus_46", label: "Claude Opus 4.6" },
    { id: "gemini_31", label: "Gemini 3.1" },
    { id: "gpt_54", label: "GPT 5.4" },
  ];

  const AI_PREFIX = "ai_designed";

  const INFO_TEXT =
    "Want to see how good AI agents have gotten? I asked each to redesign my website. One single prompt and let them cook.";

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
