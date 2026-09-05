# Lucas × Astra

A complete static redesign of Lucas Dionisopoulos's website. All changes live in this directory. The shared assets and version switcher are read from their existing paths.

## Pages

- `index.html`: introduction, selected work, and travel.
- `professional.html`: six projects and four essays.
- `research.html`: the ICML paper and two other investigations.
- `personal.html`: travel journal with 48 stops in 12 chapters, a map, photos, and notes.
- `contact.html`: email and social profiles.

## Editing

Edit the content and shared HTML in `build.py`, the styling in `stylesheet.css`, and interactions in `js/site.js` and `js/journal.js`. The original travel data lives in `js/maplocations.js`.

Run `python ai_designed/gpt_6_astra/build.py` from the repository root to regenerate all five pages. There are no build dependencies; Python 3.12 works. The generated HTML is committed alongside its source so GitHub Pages can serve it directly.

For a local preview, serve the **repository root**, since the existing assets use root-relative URLs:

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/ai_designed/gpt_6_astra/index.html`.

Fonts load from Google Fonts. The map uses Leaflet 1.9.4, OpenStreetMap data, and CARTO tiles. The journal remains navigable if the map library fails to load. All main page content and navigation are static HTML; the map and version selector require JavaScript.

## Validation

- Five pages checked at 320, 390, 768, and 1440 pixels wide.
- No horizontal overflow after responsive fixes.
- All 103 static local references and anchors resolve.
- All 32 travel photographs exist.
- All 12 travel chapters checked, including stops without photos.
- Previous/next navigation, photo enlargement, version archive, Escape dismissal, and switching to the matching page in another version checked in the browser.
- JavaScript syntax checks pass; no browser errors observed on the redesigned pages.

External Notion articles remain linked to their original URLs. The paper and project repositories were checked against arXiv and GitHub; some Notion pages were unavailable to the research tool.
