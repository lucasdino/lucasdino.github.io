// DinOS content registry. All windows are defined here.
// Each entry: { id, title, emoji, stamp, icon (svg), width, height, x, y, html, onMount? }

// Reusable SVG icon factory (pixel-style dino icons)
function svgIcon(bg, glyph) {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect x='4' y='4' width='56' height='56' fill='${encodeURIComponent(bg)}' stroke='%231a140f' stroke-width='2'/>${glyph}</svg>`;
}

export const DESKTOP_ICONS = [
  {
    id: "about",
    label: "bio.txt",
    windowId: "about",
    icon: svgIcon(
      "#f4e6c4",
      // parchment with lines
      `<line x1='14' y1='18' x2='50' y2='18' stroke='%238c2e1c' stroke-width='2'/>
       <line x1='14' y1='26' x2='50' y2='26' stroke='%23b8482f' stroke-width='1.5'/>
       <line x1='14' y1='34' x2='50' y2='34' stroke='%23b8482f' stroke-width='1.5'/>
       <line x1='14' y1='42' x2='42' y2='42' stroke='%23b8482f' stroke-width='1.5'/>
       <line x1='14' y1='50' x2='48' y2='50' stroke='%23b8482f' stroke-width='1.5'/>`
    ),
  },
  {
    id: "professional",
    label: "field.work",
    windowId: "professional",
    icon: svgIcon(
      "#b8482f",
      // filing cabinet
      `<rect x='14' y='16' width='36' height='14' fill='%23f4e6c4' stroke='%231a140f' stroke-width='1.5'/>
       <rect x='14' y='34' width='36' height='14' fill='%23f4e6c4' stroke='%231a140f' stroke-width='1.5'/>
       <circle cx='32' cy='23' r='1.5' fill='%231a140f'/>
       <circle cx='32' cy='41' r='1.5' fill='%231a140f'/>`
    ),
  },
  {
    id: "research",
    label: "lab.ipynb",
    windowId: "research",
    icon: svgIcon(
      "#4a5e37",
      `<rect x='14' y='12' width='36' height='44' fill='%23f4e6c4' stroke='%231a140f' stroke-width='1.5'/>
       <line x1='20' y1='20' x2='44' y2='20' stroke='%234a5e37' stroke-width='1.2'/>
       <line x1='20' y1='26' x2='40' y2='26' stroke='%234a5e37' stroke-width='1.2'/>
       <line x1='20' y1='32' x2='42' y2='32' stroke='%238c2e1c' stroke-width='1.5'/>
       <line x1='20' y1='40' x2='44' y2='40' stroke='%234a5e37' stroke-width='1.2'/>
       <line x1='20' y1='46' x2='36' y2='46' stroke='%234a5e37' stroke-width='1.2'/>`
    ),
  },
  {
    id: "personal",
    label: "travels",
    windowId: "personal",
    icon: svgIcon(
      "#1b1438",
      // globe
      `<circle cx='32' cy='32' r='16' fill='%232b1c3e' stroke='%23e89b3c' stroke-width='1.5'/>
       <ellipse cx='32' cy='32' rx='16' ry='6' fill='none' stroke='%23e89b3c' stroke-width='1'/>
       <line x1='32' y1='16' x2='32' y2='48' stroke='%23e89b3c' stroke-width='1'/>
       <path d='M 22 24 Q 28 28 24 34 Q 28 40 34 36 Q 40 34 38 28' fill='%234a5e37' stroke='none'/>`
    ),
  },
  {
    id: "contact",
    label: "contact",
    windowId: "contact",
    icon: svgIcon(
      "#0f1510",
      // phosphor terminal
      `<rect x='12' y='16' width='40' height='32' fill='%230f1510' stroke='%237dff9b' stroke-width='1.5'/>
       <text x='18' y='30' font-family='monospace' font-size='10' fill='%237dff9b'>&gt; hi</text>
       <rect x='34' y='34' width='6' height='8' fill='%237dff9b'/>`
    ),
  },
  {
    id: "terminal",
    label: "terminal",
    windowId: "terminal",
    icon: svgIcon(
      "#0f1510",
      `<rect x='10' y='14' width='44' height='32' fill='%230f1510' stroke='%23e89b3c' stroke-width='1.5'/>
       <circle cx='16' cy='20' r='1.5' fill='%23d85a3a'/>
       <circle cx='22' cy='20' r='1.5' fill='%23e8c341'/>
       <circle cx='28' cy='20' r='1.5' fill='%2385b550'/>
       <text x='14' y='36' font-family='monospace' font-size='9' fill='%237dff9b'>&gt;_</text>`
    ),
  },
];

// --- window builders -----------------------------------------

function socialsSVGs() {
  // Return the existing SVG markup reused from original site for consistency
  return `
    <a href="https://www.linkedin.com/in/lucasdionisopoulos/" target="_blank" rel="noopener" title="LinkedIn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
    </a>
    <a href="https://x.com/dinoacropolis" target="_blank" rel="noopener" title="X / Twitter">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>
    <a href="https://github.com/lucasdino" target="_blank" rel="noopener" title="GitHub">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
    </a>`;
}

export const WINDOWS = {
  about: {
    id: "about",
    title: "bio.txt — field notes on one L. Dionisopoulos",
    emoji: "🦴",
    stamp: "specimen #001",
    width: 720,
    height: 540,
    x: 140,
    y: 80,
    bodyClass: "about-window",
    html: `
      <div class="polaroid">
        <img src="/assets/pics/lucasducas.png" alt="Lucas (and Ducas)">
        <div class="caption">lucas &amp; ducas, c. 2023</div>
      </div>
      <h1>Hi — I'm Lucas.</h1>
      <p>A Nebraskan by upbringing, a dinosaur by online handle, and a recovering investment banker by trade. Currently doing ML research at UCSD. I pivoted into this late and have been moving fast ever since.</p>
      <hr>
      <ul class="field-list">
        <li>Studied finance at <b>WashU</b> in St. Louis</li>
        <li>Spent two years in investment banking at <a href="https://www.ftpartners.com/" target="_blank">FT Partners</a></li>
        <li>Realized I needed a career change — when better than in your early 20s? Motivation <a href="https://lucasdino.notion.site/Why-Pivot-7736665e93394c3886f78950ca66f7d2" target="_blank">here</a></li>
        <li>Took a year off to study math, ML, and CS while pet‑sitting around the world (<a href="#" data-open="personal">see the map ↗</a>). Studied <a href="https://www.notion.so/lucasdino/What-I-Studied-on-my-Year-Off-271c748e5e4a80c6bc90d2b6e1edf9d6" target="_blank">a lot</a></li>
        <li><span class="highlight-now">now</span> at UCSD on RL + LLMs. Building a corporate sim as a multi‑turn RL environment. Recently led <a href="https://arxiv.org/abs/2604.05134" target="_blank">work on chess reasoning</a> (oral @ NeurIPS 2025)</li>
      </ul>
      <p class="signoff">I promise I'm more of a person than a bulleted list. Come say hi 👋</p>
      <div class="socials">${socialsSVGs()}</div>
    `,
  },

  professional: {
    id: "professional",
    title: "field.work — things I've built",
    emoji: "🔧",
    stamp: "drawer 02",
    width: 720,
    height: 580,
    x: 220,
    y: 110,
    html: `
      <p>Building things is how I learn. Resume <a href="/assets/files/resume_redacted.pdf" target="_blank">here</a> if you want the LinkedIn‑shaped version.</p>

      <div class="section-heading">Code I've written</div>

      <a class="listline" href="https://lucasdino.notion.site/RL-Benchmarking-300c748e5e4a80cb9a42e3d8be2f7c58?source=copy_link" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/breakout_rainbow.gif" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">RL Benchmarking Gym</div>
          <div class="listline-summary">A clean, hackable RL gym engine from scratch to implement and ablate algorithms from baseline to SoTA.</div>
        </div>
      </a>

      <a class="listline" href="https://lucasdino.notion.site/Dungeon-Coder-20dc748e5e4a802cb281ce01fe6272b7?source=copy_link" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/dungeoncoder_overview.gif" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">Dungeon Coder</div>
          <div class="listline-summary">Full‑stack webapp that turns a prompt into a 3D printable dungeon. React + Three.js + self‑hosted image‑to‑3D models.</div>
        </div>
      </a>

      <a class="listline" href="https://lucasdino.notion.site/4-Wheel-Rover-Autonomous-Control-31ec748e5e4a8081a7c7ec3951d27317?source=copy_link" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/ekfslam_webster.gif" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">SLAM‑Based Autonomy for 4‑Wheel Rover</div>
          <div class="listline-summary">Autonomy stack for an uncalibrated differential‑drive rover — vision, EKF‑SLAM (from scratch), path planning. ROS2 + OpenCV + Python.</div>
        </div>
      </a>

      <a class="listline" href="https://lucasdino.notion.site/Teaching-AI-to-Drive-my-Custom-Racing-Game-214e45ce19704294bd365308a77c68b4" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/rldriver_originaltrack.gif" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">Reinforcement Learning Driver</div>
          <div class="listline-summary">Built a racing game in Pygame and taught an RL agent to drive it using Double Q‑learning.</div>
        </div>
      </a>

      <a class="listline" href="https://lucasdino.notion.site/Anomaly-Detection-12bc748e5e4a807e8c7afff86b16d975" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/anomalydetection_thumbnail.jpg" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">ML Anomaly Detection</div>
          <div class="listline-summary">Real‑time, interpretable anomaly detection over noisy time‑series using kernel ridge regression, for a San Diego healthtech company.</div>
        </div>
      </a>

      <a class="listline" href="https://lucasdino.notion.site/Recreating-Word2Vec-25c1e86e08f14087a49c027a85bd5198" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/recreating_word2vec.jpg" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">Recreating Word2Vec</div>
          <div class="listline-summary">Word2Vec vector arithmetic entirely from scratch — from tokenizer to cleaning English Wikipedia to training an embedding model.</div>
        </div>
      </a>

      <div class="section-heading">Essays</div>
      <ul class="blogs-list">
        <li><a href="https://lucasdino.notion.site/Why-Pivot-7736665e93394c3886f78950ca66f7d2" target="_blank">Why Pivot?</a> — leaving finance, a gap year, and grad school.</li>
        <li><a href="https://lucasdino.notion.site/My-Honest-Working-Hours-as-an-Investment-Banking-Analyst-03845324522a4b7785f6b752cf8b0da2" target="_blank">My Honest Hours as an Investment Banking Analyst</a> — two years, tracked.</li>
        <li><a href="https://lucasdino.notion.site/What-is-a-SoTA-Transformer-Model-90d21f0a142349629a416ecce45cd671" target="_blank">From Attention is All You Need to Llama 3</a> — a technical tour.</li>
        <li><a href="https://lucasdino.notion.site/Nvidia-s-Multi-Trillion-Dollar-Moat-Explained-187c748e5e4a803dbd35dfeea250913a" target="_blank">Nvidia's Multi‑Trillion Dollar Moat, Explained</a> — why the GPU king sits on his throne.</li>
      </ul>
    `,
  },

  research: {
    id: "research",
    title: "lab.ipynb — current research & bookshelf",
    emoji: "🧪",
    stamp: "notebook 07",
    width: 720,
    height: 560,
    x: 260,
    y: 130,
    html: `
      <p>Working on RL + LLMs with the <a href="https://pearls-lab.github.io/" target="_blank">PEARLS Lab</a> at UCSD.</p>
      <p>My current project is a corporate simulation used as a multi‑turn RL environment for LLMs. The goal: simulate market dynamics with semi‑optimal competition, then use it to generate realistic tasks in finance, data analysis, and corporate strategy — tasks that require multi‑turn tool use with actual costs attached.</p>
      <p><em>More to come.</em></p>

      <div class="section-heading">Publications &amp; projects</div>

      <a class="listline listline--research" href="https://arxiv.org/abs/2604.05134" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/llmchess_takeaway.jpg" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">
            Reasoning Through Chess: How Reasoning Evolves from Data Through Fine‑Tuning and RL
            <span class="badge badge--neurips">NeurIPS 2025 · FoRLM · Oral</span>
          </div>
          <div class="listline-summary"><b>Lead author.</b> Outperformed SoTA open‑source reasoning models on chess via SFT + RL on a 7B LM. The focus: how fine‑tuning data shapes post‑RL reasoning (quantitatively and qualitatively). <i>Under review for ICML 2026.</i></div>
        </div>
      </a>

      <a class="listline listline--research" href="https://lucasdino.notion.site/Attempted-Neural-A-Guided-Search-on-ARC-AGI-171c748e5e4a801796f6d7e13f78714c" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/arcprize_pcfg_thumbnail.jpg" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">A* Neural‑Guided Search on ARC‑AGI</div>
          <div class="listline-summary">Trained an image embedding model from scratch (modified iBOT) via a synthetic data pipeline, combined with a probabilistic context‑free grammar in a neurosymbolic approach to ARC‑AGI.</div>
        </div>
      </a>

      <a class="listline listline--research" href="https://lucasdino.notion.site/Philosophize-That-147c748e5e4a8054b857eee9e47bf62d" target="_blank">
        <div class="listline-thumb"><img src="/assets/thumbnails/philosophize_thumbnail.jpg" alt=""></div>
        <div class="listline-body">
          <div class="listline-title">Philosophize That</div>
          <div class="listline-summary">Built a philosophy corpus, isolated signal from correlated noise, and trained a document‑embedding model to classify the philosophical basis of my own journal entries.</div>
        </div>
      </a>
    `,
  },

  personal: {
    id: "personal",
    title: "travels — a year of long airbnbs & pet sits",
    emoji: "🌍",
    stamp: "atlas / 2023",
    width: 820,
    height: 540,
    x: 200,
    y: 90,
    bodyClass: "map-window",
    html: `
      <div class="map-split">
        <div id="travel_map"></div>
        <div class="map-sidebar">
          <h3>The Sabbatical</h3>
          <p>When I finished banking, I wanted to lock in on ML — but I also wanted to see the world. The compromise: long‑term Airbnbs and pet sits scattered across the globe, with a lot of studying in between.</p>
          <p>Click a dot to open it up. The big red one is where I started (Singapore). The little ones are side trips.</p>
          <p><em>Also — a lot of <a href="https://www.notion.so/lucasdino/What-I-Studied-on-my-Year-Off-271c748e5e4a80c6bc90d2b6e1edf9d6" target="_blank">actual work</a> happened.</em></p>
          <div class="section-heading" style="margin-top:18px;">Other cool stuff</div>
          <a class="listline" href="https://leelounsbury.com/john-muir-trail-2025-09/" target="_blank" style="padding:8px 10px;">
            <div class="listline-thumb" style="width:64px;height:48px;"><img src="/assets/thumbnails/jmt_2025.jpg" alt=""></div>
            <div class="listline-body">
              <div class="listline-title" style="font-size:13px;">JMT 2025</div>
              <div class="listline-summary" style="font-size:11.5px;">Thwarted attempt (wildfires). Pics remain 📷</div>
            </div>
          </a>
          <a class="listline" href="https://www.notion.so/lucasdino/Clean-Our-Green-271c748e5e4a800d8b54de1c0886d2b5" target="_blank" style="padding:8px 10px;">
            <div class="listline-thumb" style="width:64px;height:48px;"><img src="/assets/thumbnails/clean_our_green.jpg" alt=""></div>
            <div class="listline-body">
              <div class="listline-title" style="font-size:13px;">Clean Our Green</div>
              <div class="listline-summary" style="font-size:11.5px;">A college project to clean St. Louis parks.</div>
            </div>
          </a>
        </div>
      </div>
    `,
    onMount: () => {
      // Load leaflet if needed, then init the map
      const initMap = () => {
        const el = document.getElementById("travel_map");
        if (!el || el._leaflet_inited) return;
        el._leaflet_inited = true;
        const script = document.createElement("script");
        script.type = "module";
        script.src = "./js/sabbaticalmap.js?cachebust=" + Date.now();
        document.body.appendChild(script);
      };
      // Ensure leaflet css/js are loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(l);
      }
      if (!window.L) {
        const s = document.createElement("script");
        s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        s.onload = () => {
          if (!window.jQuery) {
            const jq = document.createElement("script");
            jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
            jq.onload = initMap;
            document.body.appendChild(jq);
          } else {
            initMap();
          }
        };
        document.body.appendChild(s);
      } else {
        initMap();
      }
    },
  },

  contact: {
    id: "contact",
    title: "contact — establish signal",
    emoji: "📡",
    stamp: "priority mail",
    width: 500,
    height: 320,
    x: 320,
    y: 180,
    bodyClass: "contact-window",
    html: `
      <div class="term-line dim">> opening secure channel...</div>
      <div class="term-line dim">> handshake ok.</div>
      <br>
      <div class="term-line">Feel free to reach out. I read everything.</div>
      <br>
      <div class="term-line">📬 <b>lucasdionisopoulos</b>&nbsp;<span class="dim">[at]</span>&nbsp;<b>gmail</b>&nbsp;<span class="dim">[dot]</span>&nbsp;<b>com</b></div>
      <div class="socials-row">
        <a href="https://www.linkedin.com/in/lucasdionisopoulos/" target="_blank">linkedin</a>
        <a href="https://x.com/dinoacropolis" target="_blank">x / twitter</a>
        <a href="https://github.com/lucasdino" target="_blank">github</a>
      </div>
      <br>
      <div class="term-line dim">&gt; channel idle. <span class="blinker"></span></div>
    `,
  },

  terminal: {
    id: "terminal",
    title: "terminal — /bin/rawr",
    emoji: "▮",
    stamp: "dinOS tty0",
    width: 640,
    height: 420,
    x: 360,
    y: 200,
    bodyClass: "terminal-window",
    html: `<div class="term-output"></div>
           <div class="term-input-row">
             <span class="prompt">guest@dinos:~$</span>
             <input class="term-input" autocomplete="off" autocapitalize="off" spellcheck="false" />
           </div>`,
    onMount: (win) => {
      import("./terminal.js").then((m) => m.startTerminal(win));
    },
  },
};
