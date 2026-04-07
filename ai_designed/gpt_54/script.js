document.documentElement.classList.add("js");

function fixFilePreviewNavigation() {
  if (window.location.protocol !== "file:") {
    return;
  }

  const pageMap = {
    Professional: "professional.html",
    Research: "research.html",
    Personal: "personal.html",
    Contact: "contact.html",
  };

  const titleLink = document.querySelector(".topbar .title");
  if (titleLink) {
    titleLink.setAttribute("href", "index.html");
  }

  document.querySelectorAll(".topbar .navpointer").forEach((link) => {
    const label = link.textContent.trim();
    if (pageMap[label]) {
      link.setAttribute("href", pageMap[label]);
    }
  });

  const switcher = document.querySelector(".version-switcher");
  if (switcher) {
    switcher.style.display = "none";
  }
}

function initRevealAnimations() {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!items.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  items.forEach((item, index) => {
    item.style.transition =
      "opacity 480ms ease, transform 480ms cubic-bezier(0.22, 1, 0.36, 1)";
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    observer.observe(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fixFilePreviewNavigation();
  initRevealAnimations();
});
