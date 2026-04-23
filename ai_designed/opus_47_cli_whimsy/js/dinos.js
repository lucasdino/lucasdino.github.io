// DinOS main runtime — desktop, icons, window manager.
import { DESKTOP_ICONS, WINDOWS } from "./content.js";
import { startBoot } from "./boot.js";
import { startAmbient } from "./ambient.js";

const state = {
  windows: new Map(), // id -> { el, data, x, y, w, h }
  zTop: 100,
  dragging: null,
  resizing: null,
};

// ------------------------------------------------------------
// Build the desktop scaffold
// ------------------------------------------------------------
function buildDesktop() {
  const desktop = document.createElement("div");
  desktop.id = "dinos-desktop";
  desktop.innerHTML = `
    <canvas id="dinos-stars"></canvas>
    <div id="dinos-horizon"></div>
    <div id="dinos-horizon-front"></div>
    <div id="dinos-parade"></div>
    <div id="dinos-icons"></div>
  `;
  document.body.appendChild(desktop);

  // icons
  const iconsEl = desktop.querySelector("#dinos-icons");
  DESKTOP_ICONS.forEach((icon) => {
    const el = document.createElement("div");
    el.className = "desktop-icon";
    el.dataset.windowId = icon.windowId;
    el.innerHTML = `<img class="icon-art" src="${icon.icon}" alt="${icon.label}"><div class="icon-label">${icon.label}</div>`;
    el.addEventListener("dblclick", () => openWindow(icon.windowId));
    // single click on mobile / touch — also open after a brief "select" state
    let clickTimer;
    el.addEventListener("click", () => {
      document.querySelectorAll(".desktop-icon.selected").forEach((e) => e.classList.remove("selected"));
      el.classList.add("selected");
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => el.classList.remove("selected"), 1200);
    });
    // On touch devices a single tap should open it
    el.addEventListener("touchend", (e) => {
      e.preventDefault();
      openWindow(icon.windowId);
    });
    iconsEl.appendChild(el);
  });

  // Click outside of icons on desktop deselects
  desktop.addEventListener("mousedown", (e) => {
    if (e.target === desktop || e.target.id === "dinos-stars") {
      document.querySelectorAll(".desktop-icon.selected").forEach((el) => el.classList.remove("selected"));
      closeStartMenu();
    }
  });
}

// ------------------------------------------------------------
// Taskbar
// ------------------------------------------------------------
function buildTaskbar() {
  const bar = document.createElement("div");
  bar.id = "dinos-taskbar";
  bar.innerHTML = `
    <button class="start-btn" id="dinos-start">
      <span>🦖</span> DinOS
    </button>
    <div class="dock-dino" id="dock-dino" title="rawr"></div>
    <div class="open-windows" id="open-windows"></div>
    <div class="tb-stats" id="tb-stats">cretaceous kernel · mem ok · 66 Mya</div>
  `;
  document.body.appendChild(bar);

  document.getElementById("dinos-start").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });

  const dino = document.getElementById("dock-dino");
  let rawrCount = 0;
  dino.addEventListener("click", () => {
    dino.classList.remove("happy");
    void dino.offsetWidth;
    dino.classList.add("happy");
    rawrCount++;
    const msgs = ["RAWR 🦖", "rawr!", "ancient kernel purring", "🦕 *geological rumble*", "you've unlocked nothing", "ok now seek help"];
    toast(msgs[rawrCount % msgs.length]);
  });

  // Start menu
  const sm = document.createElement("div");
  sm.id = "dinos-startmenu";
  sm.innerHTML = `
    <div class="sm-header">🦖 DinOS 1.0</div>
    ${Object.values(WINDOWS).map((w) => `
      <div class="sm-entry" data-window="${w.id}">
        <span class="emoji">${w.emoji}</span>
        <span>${w.id}</span>
      </div>
    `).join("")}
    <div class="sm-footer">cretaceous kernel · built by Opus 4.7</div>
  `;
  document.body.appendChild(sm);
  sm.addEventListener("click", (e) => {
    e.stopPropagation();
    const entry = e.target.closest(".sm-entry");
    if (entry) {
      closeStartMenu();
      openWindow(entry.dataset.window);
    }
  });
  document.addEventListener("click", closeStartMenu);

  // Clock
  setInterval(updateClock, 1000);
  updateClock();
}

function toggleStartMenu() {
  const sm = document.getElementById("dinos-startmenu");
  sm.classList.toggle("open");
}
function closeStartMenu() {
  const sm = document.getElementById("dinos-startmenu");
  if (sm) sm.classList.remove("open");
}

function updateClock() {
  const el = document.querySelector(".topbar .menu-clock");
  if (!el) return;
  const d = new Date();
  const parts = d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  el.textContent = parts;
}

// ------------------------------------------------------------
// Toasts
// ------------------------------------------------------------
let toastTimer = null;
export function toast(msg) {
  let t = document.getElementById("dinos-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "dinos-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ------------------------------------------------------------
// Topbar: add clock span and hook nav clicks
// ------------------------------------------------------------
function enrichTopbar() {
  const bar = document.querySelector(".topbar");
  if (!bar) return;
  // insert clock between navpointers and version switcher
  const clock = document.createElement("span");
  clock.className = "menu-clock";
  clock.textContent = "—";
  const versionSwitcher = bar.querySelector(".version-switcher");
  if (versionSwitcher) bar.insertBefore(clock, versionSwitcher);
  else bar.appendChild(clock);

  // The shared version-switcher config uses id "opus_47_cli_whimsical"
  // but our folder is "opus_47_cli_whimsy" — so on THIS site, the switcher
  // falls back to default ("Current Site"). Give it an honest label instead.
  const fixBtn = () => {
    const btn = bar.querySelector(".version-btn");
    if (!btn) return;
    if (btn.textContent.trim().startsWith("Current Site")) {
      btn.innerHTML = '✨ Opus 4.7 (Whimsy) <span class="arrow">▼</span>';
    }
  };
  // switcher injects on DOMContentLoaded; we may be before or after
  setTimeout(fixBtn, 0);
  setTimeout(fixBtn, 200);

  // For each navpointer, intercept clicks so it opens the right window instead of navigating
  bar.querySelectorAll(".navpointer").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const match = href.match(/(professional|research|personal|contact)\.html$/);
    if (!match) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openWindow(match[1]);
    });
  });
  // title → opens about
  const titleLink = bar.querySelector(".title");
  if (titleLink) {
    titleLink.addEventListener("click", (e) => {
      e.preventDefault();
      openWindow("about");
    });
  }
}

// ------------------------------------------------------------
// WINDOW MANAGER
// ------------------------------------------------------------
export function openWindow(id) {
  if (state.windows.has(id)) {
    focusWindow(id);
    return state.windows.get(id).el;
  }
  const data = WINDOWS[id];
  if (!data) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const w = Math.min(data.width, vw - 40);
  const h = Math.min(data.height, vh - 120);

  // Cascading position: each new window opens offset from the prior
  const count = state.windows.size;
  const offset = count * 28;
  let x = Math.max(20, Math.min(vw - w - 20, (data.x ?? 120) + offset));
  let y = Math.max(40, Math.min(vh - h - 60, (data.y ?? 80) + offset));

  const el = document.createElement("div");
  el.className = `dinos-window opening ${data.bodyClass || ""}`;
  el.dataset.winId = id;
  el.style.width = w + "px";
  el.style.height = h + "px";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.zIndex = ++state.zTop;
  el.innerHTML = `
    <div class="win-chrome">
      <div class="win-lights">
        <span class="win-light close" title="close"></span>
        <span class="win-light minimize" title="minimize"></span>
        <span class="win-light maximize" title="maximize"></span>
      </div>
      <div class="win-title"><span class="emoji">${data.emoji}</span>${data.title}</div>
      <div class="win-stamp">${data.stamp || ""}</div>
    </div>
    <div class="win-body">${data.html}</div>
    <div class="win-resize"></div>
  `;
  document.body.appendChild(el);

  const record = { el, data, x, y, w, h };
  state.windows.set(id, record);

  // animation
  requestAnimationFrame(() => {
    el.classList.remove("opening");
    el.classList.add("open");
  });

  // hooks
  const chrome = el.querySelector(".win-chrome");
  chrome.addEventListener("mousedown", (e) => startDrag(e, id));
  chrome.addEventListener("touchstart", (e) => startDrag(e, id), { passive: false });
  chrome.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("win-light")) return;
    toggleMaximize(id);
  });

  el.querySelector(".win-light.close").addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id); });
  el.querySelector(".win-light.minimize").addEventListener("click", (e) => {
    e.stopPropagation();
    toast(`(${id}) stowed — click taskbar to re‑open`);
    el.style.display = "none";
    updateTaskbar();
  });
  el.querySelector(".win-light.maximize").addEventListener("click", (e) => { e.stopPropagation(); toggleMaximize(id); });
  el.querySelector(".win-resize").addEventListener("mousedown", (e) => startResize(e, id));
  el.querySelector(".win-resize").addEventListener("touchstart", (e) => startResize(e, id), { passive: false });

  // intra-site links with data-open
  el.querySelectorAll("[data-open]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openWindow(a.dataset.open);
    });
  });

  el.addEventListener("mousedown", () => focusWindow(id));

  focusWindow(id);
  updateTaskbar();

  // mount hook (map, terminal)
  if (typeof data.onMount === "function") {
    try { data.onMount(el); } catch (err) { console.error(err); }
  }

  return el;
}

export function closeWindow(id) {
  const rec = state.windows.get(id);
  if (!rec) return;
  rec.el.classList.remove("open");
  rec.el.classList.add("closing");
  setTimeout(() => {
    rec.el.remove();
    state.windows.delete(id);
    updateTaskbar();
    // focus the topmost remaining window
    let top = null;
    let topZ = -1;
    state.windows.forEach((r, rid) => {
      const z = parseInt(r.el.style.zIndex, 10) || 0;
      if (z > topZ) { topZ = z; top = rid; }
    });
    if (top) focusWindow(top);
  }, 200);
}

function focusWindow(id) {
  const rec = state.windows.get(id);
  if (!rec) return;
  state.windows.forEach((r) => r.el.classList.remove("focused"));
  rec.el.classList.add("focused");
  rec.el.style.zIndex = ++state.zTop;
  if (rec.el.style.display === "none") rec.el.style.display = "";
  updateTaskbar();
}

function toggleMaximize(id) {
  const rec = state.windows.get(id);
  if (!rec) return;
  if (rec.maximized) {
    rec.el.style.left = rec.prev.x + "px";
    rec.el.style.top = rec.prev.y + "px";
    rec.el.style.width = rec.prev.w + "px";
    rec.el.style.height = rec.prev.h + "px";
    rec.maximized = false;
  } else {
    rec.prev = {
      x: parseInt(rec.el.style.left, 10),
      y: parseInt(rec.el.style.top, 10),
      w: parseInt(rec.el.style.width, 10),
      h: parseInt(rec.el.style.height, 10),
    };
    rec.el.style.left = "20px";
    rec.el.style.top = "42px";
    rec.el.style.width = (window.innerWidth - 40) + "px";
    rec.el.style.height = (window.innerHeight - 100) + "px";
    rec.maximized = true;
  }
  // Give map a nudge to re-render
  if (id === "personal" && window.L) {
    setTimeout(() => {
      const mapEl = document.getElementById("travel_map");
      if (mapEl && mapEl._leaflet_map) mapEl._leaflet_map.invalidateSize();
    }, 250);
  }
}

// Drag + resize
function startDrag(e, id) {
  const rec = state.windows.get(id);
  if (!rec) return;
  if (e.target.classList.contains("win-light")) return;
  if (rec.maximized) return;
  focusWindow(id);
  const pt = e.touches ? e.touches[0] : e;
  state.dragging = {
    id,
    startX: pt.clientX,
    startY: pt.clientY,
    origX: parseInt(rec.el.style.left, 10),
    origY: parseInt(rec.el.style.top, 10),
  };
  e.preventDefault();
}

function startResize(e, id) {
  const rec = state.windows.get(id);
  if (!rec) return;
  if (rec.maximized) return;
  focusWindow(id);
  const pt = e.touches ? e.touches[0] : e;
  state.resizing = {
    id,
    startX: pt.clientX,
    startY: pt.clientY,
    origW: parseInt(rec.el.style.width, 10),
    origH: parseInt(rec.el.style.height, 10),
  };
  e.preventDefault();
  e.stopPropagation();
}

function onMove(e) {
  const pt = e.touches ? e.touches[0] : e;
  if (state.dragging) {
    const d = state.dragging;
    const rec = state.windows.get(d.id);
    if (!rec) return;
    let nx = d.origX + (pt.clientX - d.startX);
    let ny = d.origY + (pt.clientY - d.startY);
    nx = Math.max(-40, Math.min(window.innerWidth - 80, nx));
    ny = Math.max(34, Math.min(window.innerHeight - 80, ny));
    rec.el.style.left = nx + "px";
    rec.el.style.top = ny + "px";
  }
  if (state.resizing) {
    const r = state.resizing;
    const rec = state.windows.get(r.id);
    if (!rec) return;
    const nw = Math.max(320, r.origW + (pt.clientX - r.startX));
    const nh = Math.max(200, r.origH + (pt.clientY - r.startY));
    rec.el.style.width = nw + "px";
    rec.el.style.height = nh + "px";
    if (r.id === "personal" && window.L) {
      const mapEl = document.getElementById("travel_map");
      if (mapEl && mapEl._leaflet_map) mapEl._leaflet_map.invalidateSize();
    }
  }
}

function onUp() {
  state.dragging = null;
  state.resizing = null;
}

// ------------------------------------------------------------
// Taskbar (dynamic window list)
// ------------------------------------------------------------
function updateTaskbar() {
  const container = document.getElementById("open-windows");
  if (!container) return;
  container.innerHTML = "";
  state.windows.forEach((rec, id) => {
    const b = document.createElement("div");
    b.className = "tb-window";
    b.textContent = `${rec.data.emoji} ${id}`;
    if (rec.el.classList.contains("focused") && rec.el.style.display !== "none") b.classList.add("focused");
    b.addEventListener("click", () => {
      if (rec.el.style.display === "none") {
        rec.el.style.display = "";
        focusWindow(id);
      } else if (rec.el.classList.contains("focused")) {
        rec.el.style.display = "none";
        updateTaskbar();
      } else {
        focusWindow(id);
      }
    });
    container.appendChild(b);
  });
}

// ------------------------------------------------------------
// Easter eggs: konami => invert colors to "cretaceous timewarp"
// ------------------------------------------------------------
function installEasterEggs() {
  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let idx = 0;
  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k.toLowerCase() === konami[idx].toLowerCase() || k === konami[idx]) {
      idx++;
      if (idx >= konami.length) {
        idx = 0;
        document.documentElement.classList.toggle("timewarp");
        toast("🦴 geological timewarp engaged");
      }
    } else {
      idx = 0;
    }
  });
  // add timewarp style
  const st = document.createElement("style");
  st.textContent = `
    html.timewarp #dinos-desktop { filter: hue-rotate(150deg) saturate(1.4); }
    html.timewarp .dinos-window { filter: hue-rotate(-30deg); }
  `;
  document.head.appendChild(st);
}

// ------------------------------------------------------------
// Boot
// ------------------------------------------------------------
export function boot() {
  document.body.classList.add("dinos-active");
  buildDesktop();
  buildTaskbar();
  enrichTopbar();
  installEasterEggs();
  startAmbient();

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);

  const preopen = document.body.dataset.preopen || "about";
  const skipBoot = sessionStorage.getItem("dinos-booted") === "1";

  const openInitial = () => {
    openWindow(preopen);
  };

  if (skipBoot) {
    openInitial();
  } else {
    sessionStorage.setItem("dinos-booted", "1");
    startBoot(() => {
      setTimeout(openInitial, 150);
    });
  }
}

// Auto-start when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

// Expose for terminal + debugging
window.DinOS = { openWindow, closeWindow, toast };
