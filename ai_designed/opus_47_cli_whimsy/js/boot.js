// Boot sequence — ephemeral window that types itself out then vanishes.

const LINES = [
  ["booting DinOS 1.0 (Cretaceous Kernel)", 14],
  ["(c) Opus 4.7 Systems · 66,000,000 BCE — present", 10],
  ["", 80],
  ["checking RAM ................ ok [640K should be enough]", 12],
  ["checking CPU ................ ok [biological, reptilian]", 12],
  ["checking GPU ................ flinty but functional", 12],
  ["mounting /dev/dino .......... ok", 10],
  ["loading bio.txt ............. ok", 8],
  ["loading field.work .......... ok", 8],
  ["loading lab.ipynb ........... ok", 8],
  ["loading travels ............. ok", 8],
  ["loading pet.sitter.agent .... ok", 8],
  ["compiling whimsy ............ ok", 8],
  ["", 200],
  ["welcome, guest. time to meet Lucas.", 30],
  ["", 120],
];

export function startBoot(onDone) {
  const overlay = document.createElement("div");
  overlay.className = "dinos-window boot-window focused open";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "10000";
  overlay.style.borderRadius = "0";
  overlay.style.boxShadow = "none";
  overlay.innerHTML = `
    <div class="win-chrome">
      <div class="win-lights">
        <span class="win-light close"></span>
        <span class="win-light minimize"></span>
        <span class="win-light maximize"></span>
      </div>
      <div class="win-title"><span class="emoji">🦖</span>DinOS 1.0 — boot</div>
      <div class="win-stamp">press any key to skip</div>
    </div>
    <div class="win-body">
      <div class="boot-logo">  ██████╗ ██╗███╗   ██╗ ██████╗ ███████╗
  ██╔══██╗██║████╗  ██║██╔═══██╗██╔════╝
  ██║  ██║██║██╔██╗ ██║██║   ██║███████╗
  ██║  ██║██║██║╚██╗██║██║   ██║╚════██║
  ██████╔╝██║██║ ╚████║╚██████╔╝███████║
  ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
         v1.0 · cretaceous kernel</div>
<div id="boot-output"></div>`;
  document.body.appendChild(overlay);

  const out = overlay.querySelector("#boot-output");
  let i = 0;
  let cancelled = false;

  const next = () => {
    if (cancelled) return;
    if (i >= LINES.length) {
      finish();
      return;
    }
    const [line, delay] = LINES[i++];
    typeLine(out, line, 6, () => {
      setTimeout(next, delay);
    });
  };

  const finish = () => {
    overlay.classList.add("closing");
    overlay.classList.remove("open");
    setTimeout(() => {
      overlay.remove();
      onDone && onDone();
    }, 300);
  };

  // allow skip
  const skip = () => {
    if (cancelled) return;
    cancelled = true;
    finish();
  };
  window.addEventListener("keydown", skip, { once: true });
  overlay.addEventListener("click", skip, { once: true });

  next();
}

function typeLine(container, text, speed, done) {
  const line = document.createElement("div");
  container.appendChild(line);
  if (!text) { done(); return; }
  let i = 0;
  const tick = () => {
    line.textContent = text.slice(0, i);
    if (i <= text.length) {
      i++;
      setTimeout(tick, speed);
    } else {
      done();
    }
  };
  tick();
  // scroll to bottom
  container.scrollTop = container.scrollHeight;
}
