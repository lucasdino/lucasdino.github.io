import { mapLocations } from "./maplocations.js";

const CHAPTER_META = {
  "Family Reunion": {
    label: "Act 01",
    mood: "Launch sequence",
    facts: ["One backpack", "Family sendoff", "One-room airport"],
  },
  "Colombia": {
    label: "Act 02",
    mood: "Warm water, real caution",
    facts: ["Cartagena", "Rosario Islands", "Medellin"],
  },
  "Croatia": {
    label: "Act 03",
    mood: "Boat days and house music",
    facts: ["Defected week", "Kaprije", "Marijan's boat"],
  },
  "Greece": {
    label: "Act 04",
    mood: "The old country",
    facts: ["5 gyros in 48 hours", "Olympus", "Month in Kalamata"],
  },
  "Australia": {
    label: "Act 05",
    mood: "Pet sits and study caves",
    facts: ["37 days in Tasmania", "Brisbane library", "Hostel souvlaki"],
  },
  "Headin' Home": {
    label: "Finale",
    mood: "Grad apps loading",
    facts: ["153 days", "22 flights", "One heroic shower"],
  },
};

const CHAPTER_ORDER = [
  "Family Reunion",
  "Colombia",
  "Croatia",
  "Greece",
  "Australia",
  "Headin' Home",
];

function stripHtml(value) {
  const temp = document.createElement("div");
  temp.innerHTML = value || "";
  return temp.textContent || temp.innerText || "";
}

function cleanText(value) {
  return stripHtml(value)
    .replaceAll("â€¦", "...")
    .replaceAll("Ï„Î­Î»ÎµÎ¹Î¿Ï‚", "perfect")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(value) {
  const text = cleanText(value);
  const match = text.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

function buildChapters() {
  return CHAPTER_ORDER.map((key) => {
    const entry = mapLocations[key];
    const meta = CHAPTER_META[key];
    const stops = (entry.locations || [])
      .filter((location) => location.mark && location.blurb)
      .map((location) => ({
        name: location.name,
        photo: location.photo || "",
        blurb: cleanText(location.blurb),
        summary: firstSentence(location.blurb),
      }));

    const heroStop = stops.find((stop) => stop.photo) || stops[0];

    return {
      key,
      label: meta.label,
      mood: meta.mood,
      facts: meta.facts,
      title: key === "Headin' Home" ? "Heading Home" : key,
      blurb: cleanText(entry.parentBlurb),
      photo: entry.parentPhoto || (heroStop ? heroStop.photo : ""),
      stops,
    };
  });
}

function render() {
  const chapterRail = document.getElementById("odysseyChapterRail");
  const photo = document.getElementById("odysseyPhoto");
  const mood = document.getElementById("odysseyMood");
  const label = document.getElementById("odysseyLabel");
  const title = document.getElementById("odysseyTitle");
  const blurb = document.getElementById("odysseyBlurb");
  const facts = document.getElementById("odysseyFacts");
  const stopsContainer = document.getElementById("odysseyStops");
  const counter = document.getElementById("odysseyCounter");
  const stopTitle = document.getElementById("odysseyStopTitle");
  const stopBody = document.getElementById("odysseyStopBody");

  if (!chapterRail || !photo || !mood || !label || !title || !blurb || !facts || !stopsContainer || !counter || !stopTitle || !stopBody) {
    return;
  }

  const chapters = buildChapters();
  let activeChapterIndex = 0;
  let activeStopIndex = 0;

  function renderFacts(chapter) {
    facts.innerHTML = "";
    chapter.facts.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "fact-chip";
      chip.textContent = item;
      facts.appendChild(chip);
    });
  }

  function renderStopDetail(chapter, stopIndex) {
    const stop = chapter.stops[stopIndex];
    if (!stop) {
      counter.textContent = "Stop 0 / 0";
      stopTitle.textContent = "No stop selected yet";
      stopBody.textContent = "This chapter did not ship with a selected stop.";
      return;
    }

    counter.textContent = `Stop ${stopIndex + 1} / ${chapter.stops.length}`;
    stopTitle.textContent = stop.name;
    stopBody.textContent = stop.blurb;
    photo.src = stop.photo || chapter.photo || photo.src;
    photo.alt = stop.name;
  }

  function renderStops(chapter) {
    stopsContainer.innerHTML = "";

    chapter.stops.forEach((stop, stopIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stop-button";
      if (stopIndex === activeStopIndex) button.classList.add("is-active");

      const heading = document.createElement("strong");
      heading.textContent = stop.name;

      const summary = document.createElement("span");
      summary.textContent = stop.summary;

      button.appendChild(heading);
      button.appendChild(summary);
      button.addEventListener("click", () => {
        activeStopIndex = stopIndex;
        renderStops(chapter);
        renderStopDetail(chapter, activeStopIndex);
      });

      stopsContainer.appendChild(button);
    });

    renderStopDetail(chapter, activeStopIndex);
  }

  function renderChapterButtons() {
    chapterRail.innerHTML = "";

    chapters.forEach((chapter, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "odyssey-button";
      if (index === activeChapterIndex) button.classList.add("is-active");

      const strong = document.createElement("strong");
      strong.textContent = `${chapter.label} // ${chapter.title}`;

      const span = document.createElement("span");
      span.textContent = chapter.mood;

      button.appendChild(strong);
      button.appendChild(span);
      button.addEventListener("click", () => {
        activeChapterIndex = index;
        activeStopIndex = 0;
        renderChapterButtons();
        renderChapter(chapters[activeChapterIndex]);
      });

      chapterRail.appendChild(button);
    });
  }

  function renderChapter(chapter) {
    label.textContent = chapter.label;
    title.textContent = chapter.title;
    mood.textContent = chapter.mood;
    blurb.textContent = chapter.blurb;
    photo.src = chapter.photo || photo.src;
    photo.alt = chapter.title;
    renderFacts(chapter);
    renderStops(chapter);
  }

  renderChapterButtons();
  renderChapter(chapters[activeChapterIndex]);
}

document.addEventListener("DOMContentLoaded", render);
