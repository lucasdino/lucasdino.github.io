// A playful terminal. Real commands, real history, real vibes.

const HELP = [
  ["help", "show this menu"],
  ["ls", "list files on the desktop"],
  ["cat <file>", "print a file's contents (try bio.txt, now.txt, ducas.txt)"],
  ["open <app>", "open a window (about, professional, research, personal, contact)"],
  ["whoami", "print the user"],
  ["pwd", "print working directory"],
  ["date", "show the date (approximate, given the age of this OS)"],
  ["rawr", "🦖"],
  ["sudo <...>", "...try it"],
  ["clear", "wipe the screen"],
  ["exit", "close the terminal"],
];

const FILES = {
  "bio.txt": [
    "Lucas Dionisopoulos. From Nebraska. Studied finance at WashU.",
    "Two years in investment banking at FT Partners. Quit, took a gap year,",
    "and studied ML while pet-sitting around the world. Now at UCSD doing",
    "RL + LLM research at PEARLS Lab. Chess paper at NeurIPS 2025.",
    "",
    "Online: @dinoacropolis. Dog: Ducas.",
  ],
  "now.txt": [
    "Building a corporate simulation as a multi-turn RL environment for LLMs.",
    "Finalizing the chess reasoning paper for ICML 2026.",
    "Drinking a lot of coffee.",
  ],
  "ducas.txt": [
    "Ducas is the dog. Ducas is good.",
    "10/10 would pet again.",
  ],
  "secret.txt": [
    "you found a secret. not much here. have a rawr on the house 🦖",
  ],
  "todo.md": [
    "[x] quit banking",
    "[x] year of pet sits",
    "[x] grad school",
    "[x] publish chess paper",
    "[ ] build the corporate sim",
    "[ ] train something enormous",
    "[ ] pet one (1) more dog",
  ],
};

const APPS = {
  about: "about", bio: "about", me: "about",
  professional: "professional", work: "professional", code: "professional",
  research: "research", lab: "research", papers: "research",
  personal: "personal", travels: "personal", map: "personal",
  contact: "contact", mail: "contact",
};

export function startTerminal(winEl) {
  const out = winEl.querySelector(".term-output");
  const input = winEl.querySelector(".term-input");
  const body = winEl.querySelector(".win-body");
  const history = [];
  let histIdx = -1;

  printLine(out, "DinOS Shell v1.0 — type 'help' or try `rawr`.", "dim");
  printLine(out, "");

  const focus = () => input.focus();
  body.addEventListener("click", focus);
  setTimeout(focus, 50);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const raw = input.value;
      input.value = "";
      echoPrompt(out, raw);
      if (raw.trim()) {
        history.unshift(raw);
        histIdx = -1;
        handle(raw.trim(), out, winEl);
      }
      body.scrollTop = body.scrollHeight;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length && histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx];
      } else {
        histIdx = -1;
        input.value = "";
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = "";
    }
  });
}

function echoPrompt(out, cmd) {
  const line = document.createElement("div");
  line.className = "term-line";
  line.innerHTML = `<span class="prompt">guest@dinos:~$</span> <span class="cmd">${escapeHTML(cmd)}</span>`;
  out.appendChild(line);
}

function printLine(out, text, cls = "") {
  const line = document.createElement("div");
  line.className = "term-line" + (cls ? " " + cls : "");
  line.textContent = text;
  out.appendChild(line);
}

function printHTML(out, html, cls = "") {
  const line = document.createElement("div");
  line.className = "term-line" + (cls ? " " + cls : "");
  line.innerHTML = html;
  out.appendChild(line);
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

function handle(raw, out, winEl) {
  const [cmd, ...args] = raw.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd) {
    case "help": {
      printLine(out, "available commands:");
      HELP.forEach(([c, d]) => {
        printHTML(out, `  <span style="color:var(--amber)">${escapeHTML(c.padEnd(16))}</span> ${escapeHTML(d)}`);
      });
      printLine(out, "");
      break;
    }
    case "ls": {
      printHTML(out, Object.keys(FILES).map((f) => `<span style="color:var(--bone)">${escapeHTML(f)}</span>`).join("  "));
      printLine(out, "");
      break;
    }
    case "cat": {
      if (!arg) { printLine(out, "cat: missing file operand", "warn"); break; }
      const f = FILES[arg];
      if (!f) { printLine(out, `cat: ${arg}: no such file. try 'ls'.`, "err"); break; }
      f.forEach((l) => printLine(out, l));
      printLine(out, "");
      break;
    }
    case "open": {
      if (!arg) { printLine(out, "open: usage — open <about|professional|research|personal|contact>", "warn"); break; }
      const target = APPS[arg.toLowerCase()];
      if (!target) { printLine(out, `open: unknown app '${arg}'.`, "err"); break; }
      window.DinOS.openWindow(target);
      printLine(out, `→ opening ${target}...`, "dim");
      break;
    }
    case "whoami": printLine(out, "guest"); printLine(out, ""); break;
    case "pwd": printLine(out, "/home/guest"); printLine(out, ""); break;
    case "date": {
      const d = new Date();
      printLine(out, `${d.toString()}  (also: Late Cretaceous, roughly)`);
      printLine(out, "");
      break;
    }
    case "rawr": {
      const art = String.raw`         .       .
        / \\_=_/ \\_
       |   .  .  |
        \\   "  /
         '----'
       ( R A W R )`;
      printLine(out, art);
      printLine(out, "");
      window.DinOS.toast("🦖 rawr");
      break;
    }
    case "sudo": {
      const comebacks = [
        "nice try. you're not a sudoer here.",
        "incident will be reported to the Mesozoic Council.",
        "access denied. rawr politely instead.",
        "you don't have permission to do that. neither do I.",
      ];
      printLine(out, comebacks[Math.floor(Math.random()*comebacks.length)], "err");
      printLine(out, "");
      break;
    }
    case "clear": out.innerHTML = ""; break;
    case "exit": {
      printLine(out, "goodbye.");
      setTimeout(() => window.DinOS.closeWindow("terminal"), 300);
      break;
    }
    case "theme": {
      document.documentElement.classList.toggle("timewarp");
      printLine(out, "theme: toggled.", "dim");
      printLine(out, "");
      break;
    }
    case "coffee": {
      printLine(out, "☕ brewing... beep boop... done. you can't actually drink it.");
      printLine(out, "");
      break;
    }
    case "": break;
    default:
      printLine(out, `${cmd}: command not found. try 'help'.`, "err");
      printLine(out, "");
  }
}
