// Ambient effects: starfield + occasional dinosaur parade.

export function startAmbient() {
  startStars();
  startParade();
}

function startStars() {
  const canvas = document.getElementById("dinos-stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let mx = 0.5, my = 0.5;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7, // upper portion (sky)
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.5 + 0.1,
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  });

  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const px = (mx - 0.5) * 18;
    const py = (my - 0.5) * 10;
    for (const s of stars) {
      const a = s.a * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
      ctx.fillStyle = `rgba(255, 240, 210, ${a})`;
      ctx.beginPath();
      ctx.arc(s.x + px * s.depth, s.y + py * s.depth, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // occasional shooting star
    if (Math.random() < 0.0015) {
      const sx = Math.random() * canvas.width;
      const sy = Math.random() * canvas.height * 0.5;
      const len = 80 + Math.random() * 60;
      const grad = ctx.createLinearGradient(sx, sy, sx + len, sy + len * 0.3);
      grad.addColorStop(0, "rgba(255, 240, 200, 0.9)");
      grad.addColorStop(1, "rgba(255, 240, 200, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + len, sy + len * 0.3);
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ------------------------------------------------------------
// Dino parade — pixelart SVGs trot across the bottom
// ------------------------------------------------------------
const DINO_SVGS = {
  trex: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><g fill='#1a140f'><rect x='8' y='34' width='36' height='14'/><rect x='40' y='26' width='12' height='14'/><rect x='48' y='22' width='8' height='10'/><rect x='52' y='26' width='4' height='2' fill='%23e89b3c'/><rect x='14' y='48' width='4' height='10'/><rect x='30' y='48' width='4' height='10'/><rect x='6' y='38' width='4' height='6'/><rect x='44' y='40' width='4' height='4' fill='%231a140f'/><rect x='50' y='25' width='2' height='2' fill='%23f4e6c4'/></g></svg>`,
  longneck: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><g fill='#1a140f'><rect x='20' y='46' width='60' height='16'/><rect x='12' y='50' width='12' height='10'/><rect x='76' y='40' width='10' height='10'/><rect x='82' y='32' width='8' height='10'/><rect x='86' y='22' width='8' height='12'/><rect x='92' y='14' width='10' height='10'/><rect x='100' y='10' width='10' height='8'/><rect x='96' y='12' width='2' height='2' fill='%23e89b3c'/><rect x='28' y='62' width='6' height='12'/><rect x='58' y='62' width='6' height='12'/><rect x='38' y='62' width='5' height='10'/><rect x='68' y='62' width='5' height='10'/></g></svg>`,
  stego: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 60'><g fill='#1a140f'><rect x='10' y='30' width='60' height='14'/><rect x='4' y='34' width='8' height='8'/><rect x='66' y='26' width='12' height='12'/><polygon points='20,30 24,16 28,30'/><polygon points='32,30 36,12 40,30'/><polygon points='44,30 48,14 52,30'/><polygon points='56,30 60,18 64,30'/><rect x='16' y='44' width='5' height='10'/><rect x='50' y='44' width='5' height='10'/><rect x='76' y='30' width='2' height='2' fill='%23e89b3c'/></g></svg>`,
  raptor: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 70 50'><g fill='#1a140f'><rect x='6' y='26' width='40' height='12'/><rect x='42' y='18' width='12' height='12'/><rect x='50' y='12' width='10' height='10'/><rect x='56' y='14' width='4' height='2' fill='%23e89b3c'/><polygon points='46,18 50,10 54,18'/><rect x='14' y='38' width='4' height='8'/><rect x='30' y='38' width='4' height='8'/><rect x='2' y='30' width='6' height='4'/></g></svg>`,
};

function startParade() {
  const layer = document.getElementById("dinos-parade");
  if (!layer) return;

  const kinds = [
    { key: "trex", cls: "", weight: 3, duration: [18, 28] },
    { key: "raptor", cls: "tiny", weight: 2, duration: [10, 16] },
    { key: "stego", cls: "", weight: 2, duration: [22, 34] },
    { key: "longneck", cls: "long-neck", weight: 1, duration: [30, 46] },
  ];
  const totalWeight = kinds.reduce((a, k) => a + k.weight, 0);

  function pickKind() {
    let r = Math.random() * totalWeight;
    for (const k of kinds) {
      if ((r -= k.weight) <= 0) return k;
    }
    return kinds[0];
  }

  function sendDino() {
    const kind = pickKind();
    const dino = document.createElement("div");
    dino.className = "dino-walker " + kind.cls;
    dino.innerHTML = DINO_SVGS[kind.key];
    layer.appendChild(dino);

    const direction = Math.random() < 0.55 ? 1 : -1; // 1 = left-to-right
    const duration = (kind.duration[0] + Math.random() * (kind.duration[1] - kind.duration[0])) * 1000;

    const startX = direction === 1 ? -200 : window.innerWidth + 200;
    const endX = direction === 1 ? window.innerWidth + 200 : -200;
    const yJitter = Math.random() * 16 - 8;
    dino.style.transform = `translate(${startX}px, ${yJitter}px) scaleX(${direction})`;
    dino.style.transition = `transform ${duration}ms linear`;

    requestAnimationFrame(() => {
      dino.style.transform = `translate(${endX}px, ${yJitter}px) scaleX(${direction})`;
    });

    setTimeout(() => dino.remove(), duration + 500);
  }

  // initial stagger
  setTimeout(sendDino, 2500);
  setInterval(() => {
    if (document.hidden) return;
    if (Math.random() < 0.6) sendDino();
  }, 8000);
}
