(function () {
  const VERSIONS = [
    { id: "pages", label: "Current Site", style: "professional", isDefault: true },
    { id: "old_design", label: "Prior Version (Reference)", style: "professional", headline: "Earlier version of my site", thoughts: "An earlier version of my website all models are provided with as a consistent checkpoint to rebuild." },
    { id: "opus_47_cli", label: "Claude Opus 4.7 (xHigh)", style: "professional", headline: "Tasteful w/ a full redesign", thoughts: "Seriously an improvement on Opus 4.6 -- tasteful design but it actually took on the task of redoing the entire webpage. Lots of elements I like about this! Also, great agentic ability in digging into each link to source info for summaries. Total API cost: $6." },
    { id: "opus_47_cli_whimsy", label: "Claude Opus 4.7 (xHigh)", style: "whimsical", favorite: true, headline: "King Claudius", thoughts: "YUP. This is insane. SO GOOD. Totally took on the creative ask and delivered. Small details are just 🤌🏼. Cannot believe this was a one-shot, so impressive (though it did mess up the map...can't be perfect :) ). Total API cost: $7." },
    { id: "opus_46", label: "Claude Opus 4.6 (Max)", style: "professional", headline: "Claude has taste", thoughts: "Super clean design but wasn't the most ambitious on doing a full rebuild of my website (despite me asking). Cost me ~$6 in API credits for this single request too! Anyway, Claude has taste.", archived: true },
    { id: "sonnet_46", label: "Claude Sonnet 4.6 (Med)", style: "professional", headline: "Solid Opus 4.6 distillation", thoughts: "This isn't even their top model. This wasn't even highest thinking mode. Great design, but basically same feel + feedback as I have for Opus 4.6 (Max) -- just about 3x cheaper.", archived: true },
    { id: "gpt_55_cli", label: "GPT 5.5 (xHigh)", style: "professional", headline: "OpenAI crushed with 5.5", thoughts: "Very similar thoughts on 5.4 (strong agentic ability, actually undertook a full redesign, result is super clean). Still a lot of cringe-writing. But it really took on the ask, used tons of tool calls to QA (w/ Playwright). Best agentic ability IMO." },
    { id: "gpt_55_cli_whimsy", label: "GPT 5.5 (xHigh)", style: "whimsical", headline: "Quite decent", thoughts: "It's kind of fun...I like triangulation effect. It is very similar to GPT 5.4 -- clearly a similar model (not spud...) but much more polished. Website has some spunk to it. Overall decent, nothing to hate but doesn't blow me away." },
    { id: "gpt_54_cli", label: "GPT 5.4 (xHigh)", style: "professional", headline: "Impressive but cringe writing", thoughts: "It actually took on the task to 'redo' the whole website. Started by reading some of my blogs then rebuilt the whole messaging + structure. Used tons of MCP calls to get screenshots and QA its work. Looks clean (despite some dumb phrases) -- overall really impressive agentic ability.", archived: true },
    { id: "gpt_54_cli_whimsy", label: "GPT 5.4 (xHigh)", style: "whimsical", headline: "Fine but buggy", thoughts: "It went with this interesting triangulation design that I kind of like. But the actual website is fairly buggy UX-wise. It did make several calls to Playwright but a bit lacking on the QA side.", archived: true },
    { id: "gemini_31_cli", label: "Gemini 3.1 (Pro)", style: "professional", headline: "Great designer, underwhelming agent", thoughts: "Fun and unique design. Issue is that I asked it to not just redesign but restructure the whole website -- which it didn't do. So as a designer? Excellent. As an instruction-following agent? May want to work on that." },
    { id: "gemini_31_cli_whimsy", label: "Gemini 3.1 (Pro)", style: "whimsical", headline: "Kinda fun 🦖", thoughts: "It's fun but not that interesting. Just restyled of my old website, didn't think for that long. I like the vibe, but a bit underwhelming." },
  ];

  const AI_PREFIX = "ai_designed";

  const INFO_TEXT =
    "Want to see how good AI coding has become? I asked each to rebuild my website. One single prompt and let 'em cook.";

  const STYLE_ICONS = {
    professional: "💼",
    whimsical: "✨",
  };

  const STYLE_LABELS = {
    professional: "professional",
    whimsical: "whimsical",
  };

  function styleIcon(version) {
    return STYLE_ICONS[version.style] || STYLE_ICONS.professional;
  }

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

  function buildThoughtBubble(version) {
    if (!version.headline && !version.thoughts) return null;

    const bubble = document.createElement("span");
    bubble.className = "thought-bubble";
    if (version.headline) {
      const h = document.createElement("div");
      h.className = "tb-headline";
      h.textContent = version.headline;
      bubble.appendChild(h);
    }
    if (version.thoughts) {
      const t = document.createElement("span");
      t.textContent = version.thoughts;
      bubble.appendChild(t);
    }
    return bubble;
  }

  function buildVersionLink(version, page, currentVersion) {
    const a = document.createElement("a");
    a.href = buildUrl(version.id, page);
    a.textContent = styleIcon(version) + " " + version.label;
    if (version.id === currentVersion) a.classList.add("active");
    if (version.favorite) {
      a.classList.add("favorite-version");
      const crown = document.createElement("span");
      crown.className = "favorite-crown";
      crown.textContent = "👑";
      a.appendChild(crown);
    }

    const bubble = buildThoughtBubble(version);
    if (bubble) a.appendChild(bubble);

    return a;
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
        padding: 10px 12px 8px;
        border-bottom: 1px solid #e0e0e0;
        line-height: 1.4;
      }
      .version-dropdown .vd-legend {
        display: flex;
        gap: 10px;
        margin-top: 6px;
        font-size: 8pt;
        color: #666;
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
      .version-dropdown a.favorite-version {
        margin: 5px 6px;
        padding: 8px 12px;
        color: #4a3300;
        background:
          radial-gradient(circle at top left, rgba(255, 223, 120, 0.55), transparent 42%),
          linear-gradient(180deg, rgba(255, 249, 225, 0.95), rgba(255, 255, 255, 0.88));
        border: 1px solid rgba(214, 158, 46, 0.48);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(214, 158, 46, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.72);
        font-weight: 600;
      }
      .version-dropdown a.favorite-version:hover,
      .version-dropdown a.favorite-version.active {
        color: #8a5100;
        background:
          radial-gradient(circle at top left, rgba(255, 214, 102, 0.68), transparent 44%),
          linear-gradient(180deg, rgba(255, 244, 202, 0.98), rgba(255, 255, 255, 0.92));
        border-color: rgba(214, 158, 46, 0.78);
        box-shadow: 0 3px 12px rgba(214, 158, 46, 0.24), inset 0 0 0 1px rgba(255, 255, 255, 0.82);
      }
      .favorite-crown {
        position: absolute;
        top: -10px;
        left: -9px;
        transform: rotate(-22deg);
        font-size: 15px;
        line-height: 1;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);
        pointer-events: none;
      }
      .archive-entry {
        position: relative;
        border-top: 1px solid #e0e0e0;
      }
      .archive-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-family: "Kode Mono", monospace;
        font-size: 0.85vw;
        text-align: left;
        color: #333;
        background: var(--subtle-white);
        border: 0;
        padding: 7px 12px;
        cursor: pointer;
        white-space: nowrap;
      }
      .archive-toggle:hover,
      .archive-entry.open .archive-toggle,
      .archive-toggle.active {
        background: rgba(226,13,13,0.06);
        color: var(--ooh-red-hot);
      }
      .archive-menu {
        display: none;
        position: absolute;
        top: -1px;
        right: calc(100% + 8px);
        background: var(--subtle-white);
        border: 1.5px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        z-index: 10001;
        min-width: 220px;
      }
      .archive-entry.open .archive-menu { display: block; }
      .archive-menu a { font-size: 0.82vw; }
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
    const mount = document.querySelector(".version-switcher-mount") || document.querySelector(".topbar");
    if (!mount) return;

    const ctx = detectContext();
    if (document.querySelector(".topbar")) fixNavLinks(ctx.version);

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
    const infoText = document.createElement("div");
    infoText.textContent = INFO_TEXT;
    info.appendChild(infoText);

    const legend = document.createElement("div");
    legend.className = "vd-legend";
    Object.keys(STYLE_LABELS).forEach((style) => {
      const item = document.createElement("span");
      item.textContent = STYLE_ICONS[style] + " " + STYLE_LABELS[style];
      legend.appendChild(item);
    });
    info.appendChild(legend);
    dropdown.appendChild(info);

    const mainVersions = VERSIONS.filter((v) => !v.archived);
    const archivedVersions = VERSIONS.filter((v) => v.archived);

    mainVersions.forEach((v) => {
      dropdown.appendChild(buildVersionLink(v, ctx.page, ctx.version));
    });

    if (archivedVersions.length) {
      const archiveEntry = document.createElement("div");
      archiveEntry.className = "archive-entry";

      const archiveToggle = document.createElement("button");
      archiveToggle.type = "button";
      archiveToggle.className = "archive-toggle";
      archiveToggle.innerHTML = '<span>Archive</span><span class="arrow">&#9666;</span>';

      const archiveMenu = document.createElement("div");
      archiveMenu.className = "archive-menu";

      const currentIsArchived = archivedVersions.some((v) => v.id === ctx.version);
      if (currentIsArchived) {
        archiveEntry.classList.add("open");
        archiveToggle.classList.add("active");
      }

      archivedVersions.forEach((v) => {
        archiveMenu.appendChild(buildVersionLink(v, ctx.page, ctx.version));
      });

      archiveToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        archiveEntry.classList.toggle("open");
      });

      archiveEntry.appendChild(archiveToggle);
      archiveEntry.appendChild(archiveMenu);
      dropdown.appendChild(archiveEntry);
    }

    wrapper.appendChild(btn);
    wrapper.appendChild(dropdown);
    mount.appendChild(wrapper);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
      const archiveEntry = dropdown.querySelector(".archive-entry");
      const archiveToggle = dropdown.querySelector(".archive-toggle");
      if (archiveEntry && archiveToggle && !archiveToggle.classList.contains("active")) {
        archiveEntry.classList.remove("open");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { injectStyles(); injectSwitcher(); });
  } else {
    injectStyles();
    injectSwitcher();
  }
})();
