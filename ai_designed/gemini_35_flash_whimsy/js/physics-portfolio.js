/**
 * Antigravity Physics Engine & UI Controller
 * Created by Antigravity (Google DeepMind Team)
 * Integrates Matter.js with DOM elements for an interactive cosmic physics playground.
 */

(function () {
    // ------------------------------------------------------------
    // 1. Audio Synthesizer (Web Audio API)
    // ------------------------------------------------------------
    let audioCtx = null;
    let isMuted = true; // Start muted by default to respect browser policies

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playCollisionSound(velocity, mass) {
        if (isMuted) return;
        initAudio();
        if (!audioCtx) return;

        // Resume context if suspended (browser security)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        try {
            const now = audioCtx.currentTime;
            
            // Map relative velocity (0 to 15+) to volume
            const vol = Math.min(0.2, (velocity / 15) * 0.15 + 0.02);
            
            // Map mass/size to frequency (larger mass = lower pitch)
            // Default mass is around 20-200. Let's map to 80Hz - 600Hz
            const baseFreq = Math.max(80, Math.min(800, 12000 / (mass + 10)));

            // Synth chime: sine + triangle for retro tone
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(baseFreq, now);
            // Quick frequency sweep down for laser/drop effect
            osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.15);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Harmonic

            gainNode.gain.setValueAtTime(vol, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25); // Fade out

            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.start(now);
            osc2.start(now);
            
            osc1.stop(now + 0.3);
            osc2.stop(now + 0.3);
        } catch (e) {
            console.warn("Audio play failed:", e);
        }
    }

    function playFlingSound(speed) {
        if (isMuted) return;
        initAudio();
        if (!audioCtx || audioCtx.state === 'suspended') return;

        try {
            const now = audioCtx.currentTime;
            const vol = Math.min(0.1, (speed / 20) * 0.08);
            if (vol < 0.01) return;

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(800 + speed * 10, now + 0.2);

            gainNode.gain.setValueAtTime(0.01, now);
            gainNode.gain.linearRampToValueAtTime(vol, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    }

    function playWarningSound() {
        if (isMuted) return;
        initAudio();
        if (!audioCtx || audioCtx.state === 'suspended') return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(300, now + 0.1);
            osc.frequency.linearRampToValueAtTime(150, now + 0.2);

            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {}
    }


    // ------------------------------------------------------------
    // 2. State & Constants
    // ------------------------------------------------------------
    const STATE = {
        physicsActive: false,
        engine: null,
        world: null,
        runner: null,
        bodiesMap: new Map(), // domElement -> Matter.Body
        originalStyles: new Map(), // domElement -> style properties
        placeholders: new Map(), // domElement -> placeholder element
        boundaries: [],
        mouseConstraint: null,
        draggedBody: null,
        dragOffset: { x: 0, y: 0 },
        gravityMode: 'normal', // normal (earth), low, zero, anti (float up)
        windStrength: 0,
        bounciness: 0.6,
        particles: [],
        lastPointerPos: { x: 0, y: 0 },
        isPointerDown: false
    };

    // Particles array limits
    const MAX_PARTICLES = 60;

    // Pixel Dinosaur SVG templates
    const DINO_SVGS = [
        `<svg viewBox="0 0 24 24" width="36" height="36" fill="#20c7b7"><path d="M7 2h5v2h3v2h2v2h2v4h-2v2h-2v2H9v-2H7v-2H5V8h2V6H5V4h2V2zm0 12h2v6H7v-6zm6 0h2v6h-2v-6zm6-6h2v4h-2V8z"/></svg>`,
        `<svg viewBox="0 0 24 24" width="36" height="36" fill="#ff6aa2"><path d="M12 2h6v2h2v4h-2v2h-2v2h-4v2H8v-2H6v-2H4V8h2V6h2V4h4V2zm-4 12h2v6H8v-6zm8 0h2v6h-2v-6z"/></svg>`,
        `<svg viewBox="0 0 24 24" width="36" height="36" fill="#f8d74a"><path d="M6 2h10v2h2v2h2v4h-2v2h-2v2H8v-2H6v-2H4V6h2V4h2v2h2V2zm0 12h2v6H6v-6zm10 0h2v6h-2v-6z"/></svg>`
    ];


    // ------------------------------------------------------------
    // 3. Stardust Particles Canvas
    // ------------------------------------------------------------
    let particleCanvas = null;
    let particleCtx = null;

    function initParticleCanvas() {
        if (particleCanvas) return;
        particleCanvas = document.createElement('canvas');
        particleCanvas.id = 'stardust-canvas';
        particleCanvas.style.position = 'fixed';
        particleCanvas.style.top = '0';
        particleCanvas.style.left = '0';
        particleCanvas.style.width = '100vw';
        particleCanvas.style.height = '100vh';
        particleCanvas.style.pointerEvents = 'none';
        particleCanvas.style.zIndex = '9998'; // Just below standard overlay controls but above cards
        document.body.appendChild(particleCanvas);
        particleCtx = particleCanvas.getContext('2d');
        resizeParticleCanvas();
        window.addEventListener('resize', resizeParticleCanvas);
    }

    function resizeParticleCanvas() {
        if (!particleCanvas) return;
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function spawnParticle(x, y, color) {
        if (STATE.particles.length > MAX_PARTICLES) {
            STATE.particles.shift();
        }
        STATE.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 1,
            alpha: 1.0,
            size: Math.random() * 6 + 3,
            color: color || '#ff6aa2'
        });
    }

    function updateAndDrawParticles() {
        if (!particleCtx) return;
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        for (let i = STATE.particles.length - 1; i >= 0; i--) {
            const p = STATE.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.025;
            p.size *= 0.96;

            if (p.alpha <= 0 || p.size < 0.5) {
                STATE.particles.splice(i, 1);
                continue;
            }

            particleCtx.save();
            particleCtx.globalAlpha = p.alpha;
            particleCtx.fillStyle = p.color;
            particleCtx.shadowColor = p.color;
            particleCtx.shadowBlur = 8;
            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            particleCtx.fill();
            particleCtx.restore();
        }
    }


    // ------------------------------------------------------------
    // 4. Custom Starfield Background
    // ------------------------------------------------------------
    function buildCosmicBackground() {
        const bg = document.createElement('div');
        bg.className = 'cosmic-background';
        bg.innerHTML = `
            <div class="stars stars-small"></div>
            <div class="stars stars-medium"></div>
            <div class="stars stars-large"></div>
            <div class="nebula nebula-pink"></div>
            <div class="nebula nebula-blue"></div>
            <div class="space-grid"></div>
        `;
        document.body.insertBefore(bg, document.body.firstChild);

        // Slow mouse parallax for starfield
        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.015;
            bg.querySelector('.stars-small').style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
            bg.querySelector('.stars-medium').style.transform = `translate(${moveX}px, ${moveY}px)`;
            bg.querySelector('.stars-large').style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
        });
    }


    // ------------------------------------------------------------
    // 5. Physics Controller Floating UI Panel
    // ------------------------------------------------------------
    function buildPhysicsControls() {
        // Warning Banner
        const banner = document.createElement('div');
        banner.className = 'physics-warning-banner';
        banner.innerHTML = `
            <div class="banner-stripes"></div>
            <div class="banner-text">WARNING: ANTIGRAVITY ENGINE ENGAGED • VIEWPORT PHYSICS UNLOCKED</div>
            <div class="banner-stripes"></div>
        `;
        document.body.appendChild(banner);

        // Control Panel
        const panel = document.createElement('div');
        panel.className = 'physics-control-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <span class="panel-icon">⚙️</span>
                <span class="panel-title">Antigravity Console</span>
                <button class="mute-toggle" title="Toggle sound effects">🔇</button>
            </div>
            
            <div class="panel-group">
                <label>Gravity Mode</label>
                <div class="gravity-selector">
                    <button class="grav-btn active" data-grav="normal">Earth (9.8m/s²)</button>
                    <button class="grav-btn" data-grav="low">Moon (1.6m/s²)</button>
                    <button class="grav-btn" data-grav="zero">Orbit (0m/s²)</button>
                    <button class="grav-btn" data-grav="anti">Antigravity (-3m/s²)</button>
                </div>
            </div>

            <div class="panel-group">
                <div class="slider-row">
                    <label>Solar Wind Force</label>
                    <span id="wind-val">0</span>
                </div>
                <input type="range" id="wind-slider" min="-1" max="1" step="0.1" value="0">
            </div>

            <div class="panel-group">
                <div class="slider-row">
                    <label>Elastic Bounciness</label>
                    <span id="bounce-val">60%</span>
                </div>
                <input type="range" id="bounce-slider" min="0.1" max="1.0" step="0.05" value="0.60">
            </div>

            <div class="panel-actions">
                <button class="action-btn dino-btn" title="Spawn physical bouncy dinos">🦕 Spawn Dino</button>
                <button class="action-btn meteor-btn" title="Spawn a heavy rollable meteor">☄️ Meteor Strike</button>
                <button class="action-btn reset-layout-btn" title="Synthesize layout back to normal">⚡ Reset Physics</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Float switch button (Bottom Right)
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'physics-floating-toggle';
        toggleBtn.innerHTML = `
            <div class="toggle-glow"></div>
            <span class="toggle-emoji">🪐</span>
            <span class="toggle-text">BREAK PHYSICS</span>
        `;
        document.body.appendChild(toggleBtn);

        // Add event listeners to panel controls
        toggleBtn.addEventListener('click', () => {
            if (STATE.physicsActive) {
                disablePhysics();
            } else {
                enablePhysics();
            }
        });

        panel.querySelector('.reset-layout-btn').addEventListener('click', () => {
            disablePhysics();
        });

        // Mute button
        const muteBtn = panel.querySelector('.mute-toggle');
        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
            muteBtn.classList.toggle('active', !isMuted);
            initAudio();
            if (!isMuted && audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        });

        // Gravity Buttons
        panel.querySelectorAll('.grav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                panel.querySelectorAll('.grav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setGravityMode(btn.dataset.grav);
            });
        });

        // Wind Slider
        const windSlider = panel.querySelector('#wind-slider');
        const windVal = panel.querySelector('#wind-val');
        windSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            STATE.windStrength = val;
            windVal.textContent = val > 0 ? `→ ${val}` : val < 0 ? `← ${Math.abs(val)}` : '0';
            updateGravitySettings();
        });

        // Bounciness Slider
        const bounceSlider = panel.querySelector('#bounce-slider');
        const bounceVal = panel.querySelector('#bounce-val');
        bounceSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            STATE.bounciness = val;
            bounceVal.textContent = `${Math.round(val * 100)}%`;
            updateBouncinessSettings();
        });

        // Spawners
        panel.querySelector('.dino-btn').addEventListener('click', spawnPhysicalDino);
        panel.querySelector('.meteor-btn').addEventListener('click', spawnPhysicalMeteor);
    }

    function setGravityMode(mode) {
        STATE.gravityMode = mode;
        updateGravitySettings();
    }

    function updateGravitySettings() {
        if (!STATE.world) return;
        
        let gravY = 1.0; // Earth default
        if (STATE.gravityMode === 'low') gravY = 0.16;
        else if (STATE.gravityMode === 'zero') gravY = 0;
        else if (STATE.gravityMode === 'anti') gravY = -0.3;

        STATE.world.gravity.y = gravY;
        STATE.world.gravity.x = STATE.windStrength * 0.5;
    }

    function updateBouncinessSettings() {
        STATE.bodiesMap.forEach((body) => {
            body.restitution = STATE.bounciness;
        });
    }


    // ------------------------------------------------------------
    // 6. Physics Engine Setup (Matter.js)
    // ------------------------------------------------------------
    function loadMatterJS(callback) {
        if (window.Matter) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
        script.onload = callback;
        script.onerror = () => {
            alert("Could not load physics library from CDN. Please verify internet connection.");
        };
        document.head.appendChild(script);
    }

    function enablePhysics() {
        if (STATE.physicsActive) return;
        
        loadMatterJS(() => {
            playWarningSound();
            initParticleCanvas();

            // Lock body scroll to make viewport a strict gamebox
            document.body.style.overflow = 'hidden';
            document.body.classList.add('physics-running');
            
            // Show HUD panel and Warning Banner
            document.querySelector('.physics-control-panel').classList.add('open');
            document.querySelector('.physics-warning-banner').classList.add('open');
            document.querySelector('.physics-floating-toggle').innerHTML = `
                <div class="toggle-glow"></div>
                <span class="toggle-emoji">🪐</span>
                <span class="toggle-text">RESTORE GRAVITY</span>
            `;

            // Initialize Matter.js
            const { Engine, World, Bodies, Runner, Composite } = Matter;
            
            STATE.engine = Engine.create({
                positionIterations: 8,
                velocityIterations: 8
            });
            STATE.world = STATE.engine.world;
            
            updateGravitySettings();

            // Setup Boundaries (Walls)
            createBoundaries();

            // Capture all layout panels to detach them
            const cards = document.querySelectorAll('.physics-card, .headshot, .map-container-outer');
            
            cards.forEach((card) => {
                // Skip if hidden
                if (card.offsetWidth === 0 || card.offsetHeight === 0) return;

                const rect = card.getBoundingClientRect();
                const scrollX = window.scrollX || window.pageXOffset;
                const scrollY = window.scrollY || window.pageYOffset;
                
                // Store original layout styles
                STATE.originalStyles.set(card, {
                    position: card.style.position,
                    top: card.style.top,
                    left: card.style.left,
                    width: card.style.width,
                    height: card.style.height,
                    transform: card.style.transform,
                    margin: card.style.margin,
                    zIndex: card.style.zIndex,
                    transition: card.style.transition
                });

                // Create a placeholder block to preserve flow spacing
                const placeholder = document.createElement('div');
                placeholder.className = 'physics-placeholder-block';
                placeholder.style.width = `${rect.width}px`;
                placeholder.style.height = `${rect.height}px`;
                placeholder.style.margin = window.getComputedStyle(card).margin;
                placeholder.style.float = window.getComputedStyle(card).float;
                placeholder.style.display = window.getComputedStyle(card).display;
                card.parentNode.insertBefore(placeholder, card);
                STATE.placeholders.set(card, placeholder);

                // Absolutely position the cards relative to viewport
                card.style.position = 'fixed';
                card.style.margin = '0';
                card.style.width = `${rect.width}px`;
                card.style.height = `${rect.height}px`;
                card.style.left = `0px`;
                card.style.top = `0px`;
                card.style.zIndex = '500';
                
                // Set structural transforms
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;

                card.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;

                // Create Matter.js rigid body
                // Give small random angle to make collisions interesting
                const bodyAngle = (Math.random() - 0.5) * 0.15;
                const body = Bodies.rectangle(cx, cy, rect.width, rect.height, {
                    restitution: STATE.bounciness,
                    friction: 0.05,
                    frictionAir: 0.015,
                    angle: bodyAngle
                });

                body.domElement = card;
                body.elementWidth = rect.width;
                body.elementHeight = rect.height;
                body.isDomNode = true;

                STATE.bodiesMap.set(card, body);
                Composite.add(STATE.world, body);
            });

            // Start Matter.js runner
            STATE.runner = Runner.create();
            Runner.run(STATE.runner, STATE.engine);

            // Listen to collisions for audio play
            Matter.Events.on(STATE.engine, 'collisionStart', handleCollisions);

            // Start animation loop
            STATE.physicsActive = true;
            requestAnimationFrame(physicsStep);

            // Hook Drag events on DOM elements
            setupDOMPointerEvents();
        });
    }

    function createBoundaries() {
        const { Bodies, Composite } = Matter;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const thickness = 200;

        // Ground, roof, walls outside the visible window
        const ground = Bodies.rectangle(w / 2, h + thickness / 2, w * 2, thickness, { isStatic: true, restitution: 0.8 });
        const roof = Bodies.rectangle(w / 2, -thickness / 2, w * 2, thickness, { isStatic: true, restitution: 0.8 });
        const leftWall = Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 2, { isStatic: true, restitution: 0.8 });
        const rightWall = Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 2, { isStatic: true, restitution: 0.8 });

        STATE.boundaries = [ground, roof, leftWall, rightWall];
        Composite.add(STATE.world, STATE.boundaries);
    }

    function handleCollisions(event) {
        event.pairs.forEach((pair) => {
            const speed = Math.abs(pair.collision.normalWidth || 2) * pair.collision.depth * 3;
            if (speed > 1.2) {
                // Retrieve heavier body mass
                const maxMass = Math.max(pair.bodyA.mass, pair.bodyB.mass);
                playCollisionSound(speed, maxMass);

                // Spawn stardust spark at collision contacts
                if (pair.activeContacts && pair.activeContacts.length) {
                    const c = pair.activeContacts[0].vertex;
                    const sparkColor = pair.bodyA.isDino || pair.bodyB.isDino ? '#f8d74a' : 
                                       pair.bodyA.isMeteor || pair.bodyB.isMeteor ? '#ff5a5f' : '#20c7b7';
                    for (let k = 0; k < 6; k++) {
                        spawnParticle(c.x, c.y, sparkColor);
                    }
                }
            }
        });
    }

    function physicsStep() {
        if (!STATE.physicsActive) return;

        // 1. Sync Matter.js positions with absolute DOM transforms
        STATE.bodiesMap.forEach((body, card) => {
            // Keep elements in viewport boundary if they glitches out
            const vx = body.position.x;
            const vy = body.position.y;
            const buffer = 40;

            if (vx < -200 || vx > window.innerWidth + 200 || vy < -200 || vy > window.innerHeight + 200) {
                // Reset body to center of screen
                Matter.Body.setPosition(body, { x: window.innerWidth / 2, y: 150 });
                Matter.Body.setVelocity(body, { x: 0, y: 0 });
            }

            const x = body.position.x - body.elementWidth / 2;
            const y = body.position.y - body.elementHeight / 2;
            const angle = body.angle;

            card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
        });

        // 2. Process Particle Canvas frame
        updateAndDrawParticles();

        // 3. Keep loop running
        requestAnimationFrame(physicsStep);
    }

    // Adjust boundaries on resize
    window.addEventListener('resize', () => {
        if (!STATE.physicsActive || !STATE.world) return;
        const { Composite, Body } = Matter;

        // Remove old boundaries
        Composite.remove(STATE.world, STATE.boundaries);
        
        // Build new ones
        createBoundaries();
    });


    // ------------------------------------------------------------
    // 7. Drag-and-Throw Controls
    // ------------------------------------------------------------
    function setupDOMPointerEvents() {
        const handleStart = (e) => {
            const targetCard = e.currentTarget;
            const body = STATE.bodiesMap.get(targetCard);
            if (!body) return;

            // Focus card visually
            targetCard.style.zIndex = '600';

            const pointer = e.touches ? e.touches[0] : e;
            const x = pointer.clientX;
            const y = pointer.clientY;

            STATE.draggedBody = body;
            STATE.dragOffset = {
                x: x - body.position.x,
                y: y - body.position.y
            };
            STATE.lastPointerPos = { x, y };
            STATE.isPointerDown = true;
            
            // Set body inertia to high to avoid crazy spinning during drag
            body.tempInertia = body.inertia;
            Matter.Body.setAngularVelocity(body, 0);

            // Highlight drag
            targetCard.classList.add('dragging-phys');

            // If mobile, prevent default scrolling
            if (e.type === 'touchstart') {
                e.preventDefault();
            }
        };

        STATE.bodiesMap.forEach((body, card) => {
            card.addEventListener('mousedown', handleStart);
            card.addEventListener('touchstart', handleStart, { passive: false });
        });

        // Pointer move and up listeners are on window to handle high-velocity flings
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchend', handlePointerUp);
    }

    function handlePointerMove(e) {
        if (!STATE.isPointerDown || !STATE.draggedBody) return;

        const pointer = e.touches ? e.touches[0] : e;
        const x = pointer.clientX;
        const y = pointer.clientY;

        // Calculate drag velocity vector
        const targetX = x - STATE.dragOffset.x;
        const targetY = y - STATE.dragOffset.y;

        const velocityPullX = (targetX - STATE.draggedBody.position.x) * 0.3;
        const velocityPullY = (targetY - STATE.draggedBody.position.y) * 0.3;

        // Move body towards pointer using physics calculations to retain collisions
        Matter.Body.setVelocity(STATE.draggedBody, { x: velocityPullX, y: velocityPullY });
        Matter.Body.setPosition(STATE.draggedBody, {
            x: STATE.draggedBody.position.x + velocityPullX,
            y: STATE.draggedBody.position.y + velocityPullY
        });

        // Spawn drag stardust trails
        const color = STATE.draggedBody.isDino ? '#f8d74a' : STATE.draggedBody.isMeteor ? '#e23122' : '#ff6aa2';
        spawnParticle(STATE.draggedBody.position.x, STATE.draggedBody.position.y, color);

        STATE.lastPointerPos = { x, y };

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    function handlePointerUp(e) {
        if (!STATE.isPointerDown || !STATE.draggedBody) return;

        const speed = Math.hypot(STATE.draggedBody.velocity.x, STATE.draggedBody.velocity.y);
        playFlingSound(speed);

        // Restore original inertia
        if (STATE.draggedBody.tempInertia) {
            Matter.Body.setInertia(STATE.draggedBody, STATE.draggedBody.tempInertia);
        }

        const card = STATE.draggedBody.domElement;
        if (card) {
            card.classList.remove('dragging-phys');
            card.style.zIndex = '500';
        }

        STATE.isPointerDown = false;
        STATE.draggedBody = null;
    }


    // ------------------------------------------------------------
    // 8. Custom Whimsical Spawners (Dinos & Meteors)
    // ------------------------------------------------------------
    function spawnPhysicalDino() {
        if (!STATE.physicsActive || !STATE.world) return;
        const { Bodies, Composite } = Matter;

        const spawnX = Math.random() * (window.innerWidth - 100) + 50;
        const spawnY = -50; // Drop from top
        
        // Spawn SVG Dino Node
        const container = document.createElement('div');
        container.className = 'physical-toy dino-toy';
        container.innerHTML = DINO_SVGS[Math.floor(Math.random() * DINO_SVGS.length)];
        document.body.appendChild(container);

        container.style.position = 'fixed';
        container.style.left = '0px';
        container.style.top = '0px';
        container.style.zIndex = '450';
        container.style.width = '36px';
        container.style.height = '36px';

        const body = Bodies.circle(spawnX, spawnY, 18, {
            restitution: 0.85,
            friction: 0.05,
            frictionAir: 0.01
        });

        body.domElement = container;
        body.elementWidth = 36;
        body.elementHeight = 36;
        body.isDomNode = true;
        body.isDino = true;

        // Allow pointer dragging on this toy too!
        const handleDinoDragStart = (e) => {
            const pointer = e.touches ? e.touches[0] : e;
            STATE.draggedBody = body;
            STATE.dragOffset = { x: pointer.clientX - body.position.x, y: pointer.clientY - body.position.y };
            STATE.lastPointerPos = { x: pointer.clientX, y: pointer.clientY };
            STATE.isPointerDown = true;
            container.style.zIndex = '600';
            if (e.cancelable) e.preventDefault();
        };
        container.addEventListener('mousedown', handleDinoDragStart);
        container.addEventListener('touchstart', handleDinoDragStart, { passive: false });

        STATE.bodiesMap.set(container, body);
        Composite.add(STATE.world, body);

        // Add stardust explosions
        for (let i = 0; i < 8; i++) {
            spawnParticle(spawnX, 10, '#f8d74a');
        }
    }

    function spawnPhysicalMeteor() {
        if (!STATE.physicsActive || !STATE.world) return;
        const { Bodies, Composite } = Matter;

        const spawnX = window.innerWidth / 2;
        const spawnY = -80;
        
        // Spawn SVG Meteor
        const container = document.createElement('div');
        container.className = 'physical-toy meteor-toy';
        container.innerHTML = `
            <svg viewBox="0 0 100 100" width="80" height="80">
                <defs>
                    <radialGradient id="fireGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#ff9d00" />
                        <stop offset="70%" stop-color="#ff3300" />
                        <stop offset="100%" stop-color="#3d0300" />
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="url(#fireGrad)" filter="drop-shadow(0 0 12px #ff5a5f)" />
                <path d="M25,25 Q35,10 50,22 Q60,35 75,25 Q90,45 60,65 Q30,85 25,25 Z" fill="#2d2222" opacity="0.65" />
            </svg>
        `;
        document.body.appendChild(container);

        container.style.position = 'fixed';
        container.style.left = '0px';
        container.style.top = '0px';
        container.style.zIndex = '450';
        container.style.width = '80px';
        container.style.height = '80px';

        // Heavy mass/density
        const body = Bodies.circle(spawnX, spawnY, 40, {
            restitution: 0.4,
            friction: 0.15,
            frictionAir: 0.01,
            density: 0.05 // Heavy mass multiplier!
        });

        body.domElement = container;
        body.elementWidth = 80;
        body.elementHeight = 80;
        body.isDomNode = true;
        body.isMeteor = true;

        const handleMeteorDragStart = (e) => {
            const pointer = e.touches ? e.touches[0] : e;
            STATE.draggedBody = body;
            STATE.dragOffset = { x: pointer.clientX - body.position.x, y: pointer.clientY - body.position.y };
            STATE.lastPointerPos = { x: pointer.clientX, y: pointer.clientY };
            STATE.isPointerDown = true;
            container.style.zIndex = '600';
            if (e.cancelable) e.preventDefault();
        };
        container.addEventListener('mousedown', handleMeteorDragStart);
        container.addEventListener('touchstart', handleMeteorDragStart, { passive: false });

        STATE.bodiesMap.set(container, body);
        Composite.add(STATE.world, body);

        // Shake viewport briefly
        document.body.classList.add('shake-anim');
        setTimeout(() => document.body.classList.remove('shake-anim'), 300);

        for (let i = 0; i < 15; i++) {
            spawnParticle(spawnX, 10, '#ff5a5f');
        }
    }


    // ------------------------------------------------------------
    // 9. Graceful Restructuring (Restore Normal Flow)
    // ------------------------------------------------------------
    function disablePhysics() {
        if (!STATE.physicsActive) return;

        STATE.physicsActive = false;

        // 1. Play restore sound
        playWarningSound();

        // 2. Hide control panel & Banner
        document.querySelector('.physics-control-panel').classList.remove('open');
        document.querySelector('.physics-warning-banner').classList.remove('open');
        document.querySelector('.physics-floating-toggle').innerHTML = `
            <div class="toggle-glow"></div>
            <span class="toggle-emoji">🪐</span>
            <span class="toggle-text">BREAK PHYSICS</span>
        `;

        // 3. Delete Toys (Dinos and Meteors)
        document.querySelectorAll('.physical-toy').forEach(el => el.remove());

        // 4. Stop Matter.js engine
        const { Runner, World, Composite } = Matter;
        Runner.stop(STATE.runner);
        
        // 5. Animate cards back to their layout placeholders
        const animationPromises = [];

        STATE.bodiesMap.forEach((body, card) => {
            // Keep boundary bodies intact but clear cards
            if (!body.isDomNode || body.isDino || body.isMeteor) return;

            const placeholder = STATE.placeholders.get(card);
            const origStyle = STATE.originalStyles.get(card);

            if (!placeholder || !origStyle) return;

            // Get target rect of layout placeholder
            const targetRect = placeholder.getBoundingClientRect();
            
            // Set transition class
            card.classList.add('transitioning-back');
            card.style.transition = 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s';

            // Calculate translation target
            card.style.transform = `translate3d(${targetRect.left}px, ${targetRect.top}px, 0) rotate(0rad)`;

            // Wait for transition completion to restore flow
            const promise = new Promise((resolve) => {
                card.addEventListener('transitionend', function handler(e) {
                    if (e.propertyName === 'transform') {
                        card.removeEventListener('transitionend', handler);
                        
                        // Restore original static properties
                        card.classList.remove('transitioning-back');
                        card.style.position = origStyle.position;
                        card.style.top = origStyle.top;
                        card.style.left = origStyle.left;
                        card.style.width = origStyle.width;
                        card.style.height = origStyle.height;
                        card.style.transform = origStyle.transform;
                        card.style.margin = origStyle.margin;
                        card.style.zIndex = origStyle.zIndex;
                        card.style.transition = origStyle.transition;

                        // Remove placeholder
                        placeholder.remove();
                        
                        resolve();
                    }
                });
            });
            animationPromises.push(promise);
        });

        // 6. Restore page overflow and cleanup once all finished
        Promise.all(animationPromises).then(() => {
            document.body.style.overflow = '';
            document.body.classList.remove('physics-running');

            // Clear state lists
            STATE.bodiesMap.clear();
            STATE.originalStyles.clear();
            STATE.placeholders.clear();
            STATE.boundaries = [];
            STATE.particles = [];
            
            // Delete Matter.js context
            World.clear(STATE.world, false);
            STATE.engine = null;
            STATE.world = null;
            STATE.runner = null;

            // Clear particle canvas
            if (particleCanvas) {
                particleCanvas.remove();
                particleCanvas = null;
                particleCtx = null;
            }
        });
    }


    // ------------------------------------------------------------
    // 10. Initialization
    // ------------------------------------------------------------
    function init() {
        buildCosmicBackground();
        buildPhysicsControls();

        // Check if there are polaroids to drop on map click (personal page integration)
        setupMapSabbaticalIntegration();
    }

    // Special bridge for the travel map photo spawner
    function setupMapSabbaticalIntegration() {
        // Expose a function to global context so map click handler can call it
        window.spawnPhysicalPhotoFromMap = function (imageSrc, cityName) {
            if (!STATE.physicsActive) {
                // Auto-engage physics if clicked travel point
                enablePhysics();
            }

            // Stagger spawn shortly after engine initializes
            setTimeout(() => {
                const { Bodies, Composite } = Matter;
                if (!STATE.world) return;

                const spawnX = Math.random() * (window.innerWidth - 300) + 150;
                const spawnY = -250;

                // Create Polaroid style card element
                const polaroid = document.createElement('div');
                polaroid.className = 'physical-toy polaroid-toy physics-card';
                polaroid.innerHTML = `
                    <div class="polaroid-image-container">
                        <img src="${imageSrc}" alt="${cityName}" class="polaroid-photo">
                    </div>
                    <div class="polaroid-caption">${cityName}</div>
                `;
                document.body.appendChild(polaroid);

                polaroid.style.position = 'fixed';
                polaroid.style.left = '0px';
                polaroid.style.top = '0px';
                polaroid.style.zIndex = '480';
                polaroid.style.width = '240px';
                polaroid.style.height = '280px';

                const body = Bodies.rectangle(spawnX, spawnY, 240, 280, {
                    restitution: 0.5,
                    friction: 0.1,
                    frictionAir: 0.015,
                    angle: (Math.random() - 0.5) * 0.3
                });

                body.domElement = polaroid;
                body.elementWidth = 240;
                body.elementHeight = 280;
                body.isDomNode = true;
                body.isPolaroid = true;

                // Drag handle
                const handlePolaroidDragStart = (e) => {
                    const pointer = e.touches ? e.touches[0] : e;
                    STATE.draggedBody = body;
                    STATE.dragOffset = { x: pointer.clientX - body.position.x, y: pointer.clientY - body.position.y };
                    STATE.lastPointerPos = { x: pointer.clientX, y: pointer.clientY };
                    STATE.isPointerDown = true;
                    polaroid.style.zIndex = '600';
                    if (e.cancelable) e.preventDefault();
                };
                polaroid.addEventListener('mousedown', handlePolaroidDragStart);
                polaroid.addEventListener('touchstart', handlePolaroidDragStart, { passive: false });

                // Double click to open full-scale image
                polaroid.addEventListener('dblclick', () => {
                    if (window.openLightbox) {
                        window.openLightbox(imageSrc);
                    }
                });

                STATE.bodiesMap.set(polaroid, body);
                Composite.add(STATE.world, body);

                // Sound trigger
                playWarningSound();
            }, 300);
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
