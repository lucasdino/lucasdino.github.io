# The Detour Machine

A playable pinball autobiography for Lucas Dionisopoulos. Static HTML, CSS, JavaScript modules, and Canvas 2D. No build step, package installation, backend, or API key.

## Preview

Serve the repository root (absolute asset URLs intentionally reuse the site's existing assets):

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/ai_designed/gpt_6_astra_whimsy/index.html . GitHub Pages serves the same files directly.

## Controls

- Space or either Launch button: launch; during play, nudge (rate limited).
- Left / Right arrows or A / D: flippers. The on-table buttons support keyboard and simultaneous touch pointers.
- Sound: opt-in synthesized arcade sounds; off by default.
- Pause: stops play and the scrolling text ribbon. Play also suspends when the table is off screen or a story dialog is open.
- Click any bumper to read its story. No content requires playing or scoring.
- The field guide exposes project, research, and writing links. Travel postcards open longer stories.

The original version selector is mounted from `/shared_js/version-switcher.js`. Only this version's CSS and accessibility enhancements change its presentation. The shared file is untouched. Previous `professional.html`, `research.html`, `personal.html`, and `contact.html` URLs redirect to the relevant section of this version.

## Files

- `index.html`: page structure and metadata.
- `stylesheet.css`: visual design and responsive layouts.
- `js/content.js`: biography, source links, and six travel postcards, based on the supplied snapshot.
- `js/physics.mjs`: browser-independent fixed-step physics engine.
- `js/machine.js`: drawing, game controls, stories, dialogs, and accessibility.
- `physics.test.mjs`: collision, flipper, drain, and 100-round seeded simulation checks.

Run the physics checks with `node physics.test.mjs` from this directory. Node may emit a harmless module-type warning for `content.js` because this static site has no package manifest.

Fonts load from Google Fonts with local fallbacks. All photos, thumbnails, and the favicon use the supplied repository assets. Sounds are synthesized locally. No new analytics or network services were added.
