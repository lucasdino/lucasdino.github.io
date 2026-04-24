(function () {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function byId(id) {
    return document.getElementById(id);
  }

  function setupCanvasBackground() {
    const canvas = byId("backgroundCanvas");
    if (!canvas || reducedMotionQuery.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, active: false };
    const styles = getComputedStyle(document.body);
    const colors = [
      styles.getPropertyValue("--accent").trim() || "#ff6b2c",
      styles.getPropertyValue("--accent-2").trim() || "#54d9ff",
      styles.getPropertyValue("--accent-3").trim() || "#ffe36c",
    ];

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createParticle() {
      return {
        x: random(0, width),
        y: random(0, height),
        vx: random(-0.26, 0.26),
        vy: random(-0.24, 0.24),
        radius: random(1.2, 2.8),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(54, Math.floor(width / 28)));
      particles = Array.from({ length: count }, createParticle);
    }

    function drawLink(a, b, alpha) {
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 160) {
            drawLink(particle, other, (1 - distance / 160) * 0.09);
          }
        }

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 180) {
            const strength = (1 - distance / 180) * 0.4;
            particle.vx += dx * 0.00002;
            particle.vy += dy * 0.00002;
            drawLink(particle, pointer, strength * 0.3);
          }
        }

        particle.vx *= 0.998;
        particle.vy *= 0.998;
        particle.vx = Math.max(-0.36, Math.min(0.36, particle.vx));
        particle.vy = Math.max(-0.36, Math.min(0.36, particle.vy));

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });

    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    window.addEventListener("resize", resize);

    resize();
    tick();

    window.addEventListener("beforeunload", () => window.cancelAnimationFrame(rafId), { once: true });
  }

  function setupTilt() {
    const items = document.querySelectorAll("[data-tilt]");
    if (!items.length) return;

    items.forEach((item) => {
      const maxTilt = reducedMotionQuery.matches ? 0 : 7;

      item.addEventListener("pointermove", (event) => {
        if (!maxTilt) return;
        const rect = item.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        item.style.transform =
          `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });

      item.addEventListener("pointerleave", () => {
        item.style.transform = "";
      });
    });
  }

  function setupReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function setupFilters() {
    const buttons = document.querySelectorAll("[data-filter-group]");
    if (!buttons.length) return;

    const groups = new Map();
    buttons.forEach((button) => {
      const group = button.dataset.filterGroup;
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(button);
    });

    groups.forEach((groupButtons, group) => {
      const items = document.querySelectorAll(`[data-filter-item="${group}"]`);
      groupButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.filter || "all";
          groupButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
          items.forEach((item) => {
            if (filter === "all") {
              item.classList.remove("is-dimmed");
              return;
            }
            const tags = (item.dataset.tags || "").split(/\s+/);
            item.classList.toggle("is-dimmed", !tags.includes(filter));
          });
        });
      });
    });
  }

  function setupCopyButtons() {
    const buttons = document.querySelectorAll("[data-copy-value]");
    if (!buttons.length) return;

    const status = byId("copyStatus");

    async function copyText(value) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }

      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      const success = document.execCommand("copy");
      document.body.removeChild(input);
      return success;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.copyValue || "";
        try {
          const success = await copyText(value);
          if (success) {
            if (status) status.textContent = "Copied to clipboard.";
            button.textContent = "Copied";
            window.setTimeout(() => {
              button.textContent = "Copy email";
            }, 1800);
          }
        } catch (error) {
          if (status) status.textContent = "Clipboard blocked. The address is still right there.";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupCanvasBackground();
    setupTilt();
    setupReveals();
    setupFilters();
    setupCopyButtons();
  });
})();
