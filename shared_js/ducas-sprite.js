(function () {
  const sprite = document.querySelector(".ducas-sprite");
  const progressFill = document.getElementById("scroll-progress-fill");
  const root = document.documentElement;
  const body = document.body;

  const bottomThreshold = 18;
  const updateProgress = () => {
    const scrollMax = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollMax));
    const bottomDistance = root.scrollHeight - (window.scrollY + window.innerHeight);

    if (progressFill) progressFill.style.width = `${progress * 100}%`;
    body.classList.toggle("at-page-bottom", bottomDistance <= bottomThreshold);
  };

  if (!sprite) {
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    return;
  }

  const cols = 8;
  const rows = 9;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cells = (row, frames) => frames.map((col) => ({ row, col }));
  const actions = {
    idle: { frames: cells(0, [0, 1, 2, 3, 4, 5]), frameMs: 220 },
    cameo: {
      frames: [
        ...cells(0, [0, 1, 2, 3, 4, 5]),
        ...cells(3, [0, 1, 2, 3]),
        ...cells(4, [0, 2, 4]),
        ...cells(7, [0, 1, 2, 3]),
        ...cells(8, [0, 1, 2, 3, 4, 5]),
      ],
      frameMs: 260,
    },
    walkRight: { frames: cells(1, [0, 1, 2, 3, 4, 5, 6, 7]), frameMs: 120 },
    walkLeft: { frames: cells(2, [0, 1, 2, 3, 4, 5, 6, 7]), frameMs: 120 },
    beekeeping: { frames: cells(3, [0, 1, 2, 3]), frameMs: 230 },
    marshmallow: {
      frames: [
        ...cells(4, [0, 1, 2, 3, 4]),
        ...cells(5, [0, 1, 2, 3, 4, 5, 6, 7]),
      ],
      frameMs: 205,
    },
    coding: { frames: cells(8, [0, 1, 2, 3, 4, 5]), frameMs: 210 },
    tennis: { frames: cells(7, [0, 1, 2, 3, 4, 5]), frameMs: 155 },
  };

  let currentMode = "idle";
  let frameIndex = 0;
  let timerId = null;
  let lastScrollY = window.scrollY;
  let scrollDirection = "down";
  let scrollTicking = false;
  let isScrolling = false;
  let scrollStopId = null;

  function setFrame(frame) {
    const x = (frame.col / (cols - 1)) * 100;
    const y = (frame.row / (rows - 1)) * 100;
    sprite.style.backgroundPosition = `${x}% ${y}%`;
  }

  function restartSnap() {
    sprite.classList.remove("is-snapping");
    void sprite.offsetWidth;
    sprite.classList.add("is-snapping");
  }

  function setMode(mode) {
    if (!actions[mode]) mode = "idle";
    if (mode === currentMode) return;

    currentMode = mode;
    frameIndex = 0;
    restartSnap();
    setFrame(actions[currentMode].frames[0]);
  }

  function getActiveSection() {
    const sections = document.querySelectorAll("[data-sprite-mode]");
    const viewportAnchor = window.scrollY + window.innerHeight * 0.45;
    let active = sections[0];
    let bestDistance = Infinity;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionMiddle = sectionTop + section.offsetHeight / 2;
      const distance = Math.abs(sectionMiddle - viewportAnchor);

      if (viewportAnchor >= sectionTop - 90 && distance < bestDistance) {
        bestDistance = distance;
        active = section;
      }
    });

    return active;
  }

  function sectionModeFromScrollPosition() {
    const activeSection = getActiveSection();
    return activeSection ? activeSection.dataset.spriteMode : "cameo";
  }

  function modeFromScrollPosition() {
    if (isScrolling) {
      return scrollDirection === "up" ? "walkLeft" : "walkRight";
    }

    return sectionModeFromScrollPosition();
  }

  function settleToSectionMode() {
    isScrolling = false;
    setMode(sectionModeFromScrollPosition());
  }

  function updateModeFromScroll() {
    const currentY = window.scrollY;
    const didMove = Math.abs(currentY - lastScrollY) > 2;

    if (didMove) {
      scrollDirection = currentY > lastScrollY ? "down" : "up";
      lastScrollY = currentY;
      isScrolling = true;

      if (scrollStopId) window.clearTimeout(scrollStopId);
      scrollStopId = window.setTimeout(settleToSectionMode, 180);
    }

    setMode(modeFromScrollPosition());
    updateProgress();
    scrollTicking = false;
  }

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateModeFromScroll);
  }

  function animate() {
    const action = actions[currentMode];
    setFrame(action.frames[frameIndex]);
    frameIndex = (frameIndex + 1) % action.frames.length;
    timerId = window.setTimeout(animate, action.frameMs);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  setMode(sectionModeFromScrollPosition());
  updateProgress();

  if (!reducedMotion) {
    animate();
  } else {
    setFrame(actions[currentMode].frames[0]);
  }

  window.addEventListener("pagehide", () => {
    if (timerId) window.clearTimeout(timerId);
    if (scrollStopId) window.clearTimeout(scrollStopId);
  });
}());
