(function () {
  const versions = [
    { id: "pages", label: "Current Site", defaultSite: true },
    { id: "old_design", label: "Prior Version" },
    { id: "opus_47_cli", label: "Claude Opus 4.7" },
    { id: "opus_47_cli_whimsy", label: "Claude Opus 4.7 Whimsy" },
    { id: "gpt_55_cli", label: "GPT 5.5" },
    { id: "gpt_55_cli_whimsy", label: "GPT 5.5 Whimsy" },
    { id: "gpt_55_cli_whimsy_xhigh", label: "GPT 5.5 Whimsy xHigh" },
    { id: "gpt_54_cli", label: "GPT 5.4" },
    { id: "gpt_54_cli_whimsy", label: "GPT 5.4 Whimsy" },
    { id: "gemini_31_cli", label: "Gemini 3.1" },
    { id: "gemini_31_cli_whimsy", label: "Gemini 3.1 Whimsy" },
  ];

  const currentVersion = "gpt_55_cli_whimsy_xhigh";
  const atlasStops = {
    nebraska: {
      meta: "Departure gate",
      title: "McCook to somewhere louder",
      image: "/assets/pics/sabbatical/mccookairport.jpg",
      text: "A one-room airport, a backpack, and no return date. The trip started with family, cornfields, and the decision to treat the year like a mobile research residency.",
    },
    colombia: {
      meta: "Warm-up anomaly",
      title: "Cartagena, Medellin, and an unreasonable amount of motion",
      image: "/assets/pics/sabbatical/thiswasheinous.jpg",
      text: "Colombia was the first proof that the year would not be neat. Seafood, street art, beaches, cheap beer, and a reminder that adventure still needs judgment.",
    },
    croatia: {
      meta: "Festival week",
      title: "Croatia with boat rides, castles, and house music",
      image: "/assets/pics/sabbatical/disconinjas.jpg",
      text: "A week near Tisno made the study year feel less like escape and more like calibration: sketching, old towns, beach venues, and a boat day that stuck.",
    },
    greece: {
      meta: "Old country",
      title: "Olympus, Kalamata, Delphi, Corfu",
      image: "/assets/pics/sabbatical/olympus.jpg",
      text: "The favorite leg: hikes, family history, ruins, gyros, libraries, machine learning notes, and a promise to someday build a mosaic floor.",
    },
    australia: {
      meta: "Library residency",
      title: "Tasmania and the long study bunker",
      image: "/assets/pics/sabbatical/dotty.jpg",
      text: "Tasmania became a perfect hunker-down phase: quiet routines, clean air, cheap living, long study days, and one very good pet-sit companion.",
    },
    home: {
      meta: "Return vector",
      title: "Twenty-two flights later",
      image: "/assets/pics/sabbatical/backpack.jpg",
      text: "Around the world in 153 days, then straight into finishing grad school applications. Not exactly rest, but definitely a better story.",
    },
  };

  function currentPageName() {
    const page = window.location.pathname.split("/").pop();
    return page || "index.html";
  }

  function versionUrl(versionId) {
    const page = currentPageName();
    const version = versions.find((item) => item.id === versionId);
    if (version && version.defaultSite) {
      return page === "index.html" ? "/index.html" : `/pages/${page}`;
    }
    return `/ai_designed/${versionId}/${page}`;
  }

  function initVersionSelect() {
    const select = document.getElementById("versionSelect");
    if (!select) return;

    select.replaceChildren();
    versions.forEach((version) => {
      const option = document.createElement("option");
      option.value = version.id;
      option.textContent = version.label;
      option.selected = version.id === currentVersion;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      window.location.href = versionUrl(select.value);
    });
  }

  function initCanvas() {
    const canvas = document.getElementById("signalCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes = [];
    const pointer = { x: 0, y: 0, active: false };
    const colors = ["#e23122", "#20c7b7", "#f8d74a", "#ff6aa2", "#59b36a"];

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(32, Math.min(82, Math.floor((width * height) / 16000)));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 2 + Math.random() * 3,
        color: colors[index % colors.length],
      }));
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(21, 18, 15, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 46) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 40, height);
        ctx.stroke();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      nodes.forEach((node, index) => {
        if (!prefersReduced) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }

        for (let j = index + 1; j < nodes.length; j += 1) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 125) {
            ctx.strokeStyle = `rgba(21, 18, 15, ${0.11 * (1 - dist / 125)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(226, 49, 34, ${0.28 * (1 - dist / 150)})`;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(21, 18, 15, 0.8)";
        ctx.stroke();
      });

      if (!prefersReduced) requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });
    resize();
    draw();
  }

  function initTiltCards() {
    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function initProjectStage() {
    const stage = document.querySelector("[data-project-stage]");
    if (!stage) return;
    const image = document.getElementById("spotlightImage");
    const title = document.getElementById("spotlightTitle");
    const text = document.getElementById("spotlightText");
    document.querySelectorAll(".cartridge").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        image.src = card.dataset.image;
        title.textContent = card.dataset.title;
        text.textContent = card.dataset.summary;
      });
      card.addEventListener("focus", () => {
        image.src = card.dataset.image;
        title.textContent = card.dataset.title;
        text.textContent = card.dataset.summary;
      });
    });
  }

  function initAtlas() {
    const image = document.getElementById("atlasImage");
    if (!image) return;
    const meta = document.getElementById("atlasMeta");
    const title = document.getElementById("atlasTitle");
    const text = document.getElementById("atlasText");
    const buttons = document.querySelectorAll(".atlas-stop");

    function setStop(key) {
      const stop = atlasStops[key];
      if (!stop) return;
      image.src = stop.image;
      image.alt = stop.title;
      meta.textContent = stop.meta;
      title.textContent = stop.title;
      text.textContent = stop.text;
      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.stop === key);
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => setStop(button.dataset.stop));
    });
  }

  function initScramble() {
    const elements = document.querySelectorAll("[data-scramble]");
    if (!elements.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    elements.forEach((element) => {
      const original = element.textContent;
      let running = false;
      const scramble = () => {
        if (running) return;
        running = true;
        let frame = 0;
        const timer = window.setInterval(() => {
          const settled = Math.floor(frame / 2);
          element.textContent = original
            .split("")
            .map((char, index) => {
              if (char === " " || index < settled) return char;
              return alphabet[Math.floor(Math.random() * alphabet.length)];
            })
            .join("");
          frame += 1;
          if (settled >= original.length) {
            element.textContent = original;
            running = false;
            window.clearInterval(timer);
          }
        }, 30);
      };
      element.addEventListener("mouseenter", scramble);
      element.addEventListener("focus", scramble);
    });
  }

  initVersionSelect();
  initCanvas();
  initTiltCards();
  initProjectStage();
  initAtlas();
  initScramble();
})();
