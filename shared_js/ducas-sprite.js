(function () {
  const sprite = document.querySelector(".ducas-sprite");
  const stage = document.querySelector(".ducas-stage");
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
  let isDragging = false;
  let didDrag = false;
  let suppressNextClick = false;
  let suppressClickId = null;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastPointerX = 0;
  let draggedLeft = 0;
  let draggedTop = 0;
  let hasUserPosition = false;

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
    if (!isDragging) restartSnap();
    setFrame(actions[currentMode].frames[0]);
  }

  function clampSpritePosition(left, top) {
    const rect = stage.getBoundingClientRect();
    const width = rect.width || sprite.offsetWidth;
    const height = rect.height || sprite.offsetHeight;
    const margin = 8;
    const maxLeft = Math.max(margin, window.innerWidth - width - margin);
    const maxTop = Math.max(margin, window.innerHeight - height - margin);

    return {
      left: Math.min(maxLeft, Math.max(margin, left)),
      top: Math.min(maxTop, Math.max(margin, top)),
    };
  }

  function moveDraggedSprite(left, top) {
    const next = clampSpritePosition(left, top);
    draggedLeft = next.left;
    draggedTop = next.top;
    stage.style.left = `${draggedLeft}px`;
    stage.style.top = `${draggedTop}px`;
    stage.style.right = "auto";
    stage.style.bottom = "auto";
    hasUserPosition = true;
  }

  function onPointerDown(event) {
    if (!event.isPrimary || event.button > 0) return;

    const rect = stage.getBoundingClientRect();
    isDragging = true;
    didDrag = false;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;
    lastPointerX = event.clientX;
    draggedLeft = rect.left;
    draggedTop = rect.top;

    stage.classList.add("is-dragging");
    sprite.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!isDragging || event.pointerId !== dragPointerId) return;

    const deltaX = event.clientX - lastPointerX;
    const totalDelta = Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY);

    if (Math.abs(deltaX) > 1) {
      setMode(deltaX > 0 ? "walkRight" : "walkLeft");
      lastPointerX = event.clientX;
    }

    if (totalDelta > 3) didDrag = true;
    moveDraggedSprite(event.clientX - dragOffsetX, event.clientY - dragOffsetY);
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (!isDragging || event.pointerId !== dragPointerId) return;

    isDragging = false;
    dragPointerId = null;
    stage.classList.remove("is-dragging");
    if (sprite.hasPointerCapture(event.pointerId)) {
      sprite.releasePointerCapture(event.pointerId);
    }
    if (didDrag) {
      suppressNextClick = true;
      if (suppressClickId) window.clearTimeout(suppressClickId);
      suppressClickId = window.setTimeout(() => {
        suppressNextClick = false;
        didDrag = false;
      }, 120);
    }
    setMode(sectionModeFromScrollPosition());
    event.preventDefault();
  }

  function onDocumentClick(event) {
    if (!suppressNextClick) return;
    suppressNextClick = false;
    didDrag = false;
    if (suppressClickId) window.clearTimeout(suppressClickId);
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
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
    if (isDragging) {
      updateProgress();
      scrollTicking = false;
      return;
    }

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
  window.addEventListener("resize", () => {
    if (hasUserPosition) moveDraggedSprite(draggedLeft, draggedTop);
    onScroll();
  });
  sprite.addEventListener("pointerdown", onPointerDown);
  sprite.addEventListener("pointermove", onPointerMove);
  sprite.addEventListener("pointerup", onPointerUp);
  sprite.addEventListener("pointercancel", onPointerUp);
  document.addEventListener("click", onDocumentClick, true);
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
    if (suppressClickId) window.clearTimeout(suppressClickId);
  });
}());
