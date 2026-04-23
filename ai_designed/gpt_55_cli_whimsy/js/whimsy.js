(() => {
  const canvas = document.getElementById("signal-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let particles = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(34, Math.min(92, Math.floor(width * height / 16500)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.8,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      hue: i % 3 === 0 ? "#63e8ff" : i % 3 === 1 ? "#ff4f8f" : "#e8ff5f"
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((p, i) => {
      if (!reduced) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }
      const pull = pointer.active ? Math.max(0, 1 - Math.hypot(pointer.x - p.x, pointer.y - p.y) / 260) : 0;
      ctx.beginPath();
      ctx.fillStyle = p.hue;
      ctx.globalAlpha = 0.24 + pull * 0.5;
      ctx.arc(p.x + (pointer.x - width / 2) * pull * 0.018, p.y + (pointer.y - height / 2) * pull * 0.018, p.r + pull * 3.2, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 118) {
          ctx.globalAlpha = (1 - dist / 118) * 0.13;
          ctx.strokeStyle = p.hue;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    if (!reduced) requestAnimationFrame(frame);
  }

  function installTilt() {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (reduced) return;
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${py * -5}deg) rotateY(${px * 7}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
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
  frame();
  installTilt();
})();
