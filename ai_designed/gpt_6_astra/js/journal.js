import { mapLocations } from './maplocations.js';

// Keep the original travel notes and coordinates; the journal is a new view of them.
const chapterNames = Object.keys(mapLocations).filter(name => mapLocations[name].drawMarker && name !== "Headin' Home");
chapterNames.push("Headin' Home");
const stops = chapterNames.flatMap(chapter => {
  const group = mapLocations[chapter];
  return group.locations
    ? group.locations.filter(stop => stop.mark).map(stop => ({ ...stop, chapter }))
    : [{ name: chapter, chapter, latLng: group.markerLocation, photo: group.parentPhoto, blurb: group.parentBlurb }];
}).map((stop, index) => ({ ...stop, index }));

const regionSelect = document.getElementById('region-select');
const stopList = document.getElementById('stop-list');
const previous = document.getElementById('previous-stop');
const next = document.getElementById('next-stop');
const photo = document.getElementById('stop-photo');
const photoButton = document.querySelector('.story-photo');
const story = document.getElementById('stop-story');
const count = document.getElementById('stop-count');
let filtered = [...stops];
let selected = null;
let map;
let markers = [];
let lineLayer;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const name of chapterNames) {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  regionSelect.append(option);
}

function renderStopButtons() {
  stopList.replaceChildren();
  for (const stop of filtered) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = stop.name;
    button.dataset.stop = stop.index;
    button.setAttribute('aria-pressed', String(selected?.index === stop.index));
    button.addEventListener('click', () => showStop(stop, true, true));
    stopList.append(button);
  }
}

function updateNavigation() {
  const index = filtered.findIndex(stop => stop.index === selected?.index);
  previous.disabled = index <= 0;
  next.disabled = index >= filtered.length - 1;
  count.textContent = index < 0 ? `${filtered.length} stops · Around the world` : `${String(index + 1).padStart(2, '0')} / ${String(filtered.length).padStart(2, '0')} stops`;
  stopList.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stop) === selected?.index)));
}

// The notes contain paragraph separators. Preserve words without injecting HTML.
function appendNote(text) {
  const output = document.getElementById('stop-blurb');
  output.replaceChildren();
  if (!text) text = 'A stop along the way.';
  const parsed = new DOMParser().parseFromString(`<p>${text}</p>`, 'text/html');
  const paragraphs = [...parsed.querySelectorAll('p')].map(p => p.textContent.trim()).filter(Boolean);
  for (const value of paragraphs) {
    const p = document.createElement('p');
    p.textContent = value;
    output.append(p);
  }
}

function showStop(stop, moveMap = true, revealStory = false) {
  selected = stop;
  document.getElementById('stop-region').textContent = stop.chapter;
  document.getElementById('stop-name').textContent = stop.name;
  photoButton.hidden = !stop.photo;
  if (stop.photo) {
    photo.src = stop.photo;
    photo.alt = `Lucas's travel photograph from ${stop.name}`;
    photoButton.setAttribute('aria-label', `Enlarge photograph from ${stop.name}`);
  }
  appendNote(stop.blurb);
  document.getElementById('stop-map-link').href = `https://www.openstreetmap.org/?mlat=${stop.latLng[0]}&mlon=${stop.latLng[1]}#map=11/${stop.latLng[0]}/${stop.latLng[1]}`;
  story.scrollTop = 0;
  updateNavigation();
  markers.forEach(({marker, stop: item}) => {
    const isSelected = item.index === stop.index;
    marker.getElement()?.classList.toggle('selected', isSelected);
    marker.setZIndexOffset(isSelected ? 1000 : 0);
  });
  if (map && moveMap) {
    const zoom = regionSelect.value === 'all' ? 5 : Math.max(map.getZoom(), 6);
    map.setView(stop.latLng, zoom, { animate: !reduceMotion.matches });
  }
  if (revealStory && matchMedia('(max-width: 760px)').matches) {
    document.querySelector('.journal-reader').scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start' });
  }
}

function fitChapter() {
  if (!map) return;
  if (regionSelect.value === 'all') map.fitBounds(stops.map(stop => stop.latLng), { padding: [28,28], maxZoom: 2, animate: !reduceMotion.matches });
  else map.fitBounds(filtered.map(stop => stop.latLng), { padding: [38, 38], maxZoom: 9, animate: !reduceMotion.matches });
}

function renderMap() {
  if (!map) return;
  markers.forEach(({marker}) => marker.remove());
  markers = [];
  lineLayer.clearLayers();
  const chapters = regionSelect.value === 'all' ? chapterNames : [regionSelect.value];
  for (const chapter of chapters) {
    const locations = mapLocations[chapter].locations || [];
    for (let i = 1; i < locations.length; i++) {
      const a = locations[i - 1];
      const b = locations[i];
      // Avoid a line crossing the world when a route passes the date line.
      if (Math.abs(a.latLng[1] - b.latLng[1]) > 180) continue;
      L.polyline([a.latLng, b.latLng], { color: '#2145e5', weight: 1.6, opacity: .48, dashArray: a.dashed ? '4 5' : undefined, interactive: false }).addTo(lineLayer);
    }
  }
  markers = filtered.map(stop => {
    const marker = L.marker(stop.latLng, {
      icon: L.divIcon({ className: 'map-stop', iconSize: [24,24], iconAnchor: [12,12] }),
      title: stop.name, alt: stop.name, keyboard: true
    }).addTo(map).bindTooltip(stop.name, {direction:'top', offset:[0,-8]});
    marker.on('click', () => showStop(stop, false, true));
    return { marker, stop };
  });
  fitChapter();
}

regionSelect.addEventListener('change', () => {
  filtered = regionSelect.value === 'all' ? [...stops] : stops.filter(stop => stop.chapter === regionSelect.value);
  renderStopButtons();
  renderMap();
  showStop(filtered[0], false);
});
previous.addEventListener('click', () => {
  const index = filtered.findIndex(stop => stop.index === selected?.index);
  if (index > 0) showStop(filtered[index - 1]);
});
next.addEventListener('click', () => {
  const index = filtered.findIndex(stop => stop.index === selected?.index);
  if (index < filtered.length - 1) showStop(filtered[index + 1]);
});
document.getElementById('map-reset').addEventListener('click', fitChapter);

const dialog = document.getElementById('photo-dialog');
photoButton.addEventListener('click', () => {
  const large = document.getElementById('large-photo');
  large.src = photo.src;
  large.alt = photo.alt;
  document.getElementById('large-photo-caption').textContent = selected ? `${selected.name} · ${selected.chapter}` : 'Everything I carried for the next five months.';
  dialog.showModal();
});
dialog.querySelector('.close-photo').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});

renderStopButtons();
updateNavigation();

// Keep the journal usable if the external map library or tiles cannot load.
function initializeMap() {
  if (!window.L) {
    document.querySelector('.map-fallback').textContent = 'The map is unavailable right now. All photos and notes are still available through the chapter menu and stop buttons.';
    document.getElementById('map-reset').disabled = true;
    return;
  }
  document.querySelector('.map-fallback')?.remove();
  map = L.map('travel-map', { center: [19,22], zoom: 1, minZoom: 0, maxZoom: 16, scrollWheelZoom: false, worldCopyJump: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  }).addTo(map);
  lineLayer = L.layerGroup().addTo(map);
  renderMap();
  new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById('travel-map'));
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeMap, {once:true});
else initializeMap();
