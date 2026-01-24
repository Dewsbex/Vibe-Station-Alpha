/* THE ARCHITECT'S WORKBENCH // ENGINE v4.0 [ELITE_UPGRADE] */

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrollToPlugin);

// 1. SOUND ENGINE
// 1. SOUND ENGINE v2.0 (With Toggle)
const SoundEngine = {
    ctx: null,
    enabled: false, // Default Muted

    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.bindToggle();
    },

    bindToggle() {
        const btn = document.getElementById('audio-toggle');
        const label = btn?.querySelector('.label');

        btn?.addEventListener('click', () => {
            this.enabled = !this.enabled;
            btn.classList.toggle('active', this.enabled);
            label.innerText = this.enabled ? "AUDIO: ON" : "AUDIO: OFF";

            if (this.enabled && this.ctx.state === 'suspended') this.ctx.resume();
            if (this.enabled) this.play('click');
        });
    },

    play(type) {
        if (!this.enabled || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        if (type === 'click') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(now + 0.05);
        } else if (type === 'hum') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(50, now); // 50Hz Hum
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(now + 0.4);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => SoundEngine.init());

document.addEventListener('DOMContentLoaded', () => {

    // 2. DOM ELEMENTS
    const body = document.body;
    const switchContainer = document.getElementById('breaker-switch');
    const switchHandle = switchContainer?.querySelector('.switch-handle');
    const reticle = document.getElementById('workbench-cursor');
    const reticleData = document.querySelector('.reticle-data');
    const logDisplay = document.getElementById('current-log');
    const calcSlider = document.getElementById('team-size-slider');
    const calcOutput = document.getElementById('calc-output');
    const calcReadout = document.querySelector('.calc-readout');

    // LENIS: SMOOTH SCROLL
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // HERO ENTRANCE (CINEMATIC)
    const heroTimeline = gsap.timeline();
    heroTimeline
        .from(".hero-word", {
            y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power4.out"
        })
        .from(".subline, .scroll-indicator", {
            y: 20, opacity: 0, duration: 1, ease: "power2.out"
        }, "-=0.5");

    // MODULE: SYSTEM MAP (The Work Triangle)
    function initSystemMap() {
        const svg = document.getElementById('system-graph');
        if (!svg) return;

        const nodes = [
            { x: 50, y: 20 }, // Top (User)
            { x: 20, y: 80 }, // Left (Tool)
            { x: 80, y: 80 }  // Right (Goal)
        ];

        // Create Triangle Path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'system-link');
        svg.appendChild(path);

        // Create Nodes
        nodes.forEach(n => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', `${n.x}%`);
            circle.setAttribute('cy', `${n.y}%`);
            circle.setAttribute('r', '6');
            circle.setAttribute('class', 'system-node');
            svg.appendChild(circle);
        });

        // Animate
        function draw() {
            // Simple elasticity logic could go here
            const d = `M ${nodes[0].x}% ${nodes[0].y}% L ${nodes[1].x}% ${nodes[1].y}% L ${nodes[2].x}% ${nodes[2].y}% Z`;
            path.setAttribute('d', d);
            requestAnimationFrame(draw);
        }
        draw();
    }
    initSystemMap();

    // 3. INERTIA CURSOR (UPGRADE 03)
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!body.classList.contains('workbench-mode')) return;
        reticleData.innerText = `X: ${e.clientX.toString().padStart(4, '0')} // Y: ${e.clientY.toString().padStart(4, '0')}`;
    });

    function updateCursor() {
        if (body.classList.contains('workbench-mode')) {
            ballX += (mouseX - ballX) * speed;
            ballY += (mouseY - ballY) * speed;
            reticle.style.left = `${ballX}px`;
            reticle.style.top = `${ballY}px`;
        }
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // 4. COMMAND PALETTE (UPGRADE 01: POWER USER)
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-input');
    const cmdItems = document.querySelectorAll('.cmd-item');

    const togglePalette = (show) => {
        if (show) {
            cmdPalette.classList.remove('hidden');
            cmdInput.value = '';
            gsap.fromTo(".cmd-box", { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
            setTimeout(() => cmdInput.focus(), 50);
        } else {
            gsap.to(".cmd-box", { scale: 0.95, opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => cmdPalette.classList.add('hidden') });
        }
    };

    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            togglePalette(cmdPalette.classList.contains('hidden'));
        }
        if (e.key === 'Escape') togglePalette(false);
    });

    // Command filtering
    cmdInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        cmdItems.forEach(item => {
            const text = item.innerText.toLowerCase();
            item.style.display = text.includes(val) ? 'flex' : 'none';
        });
    });

    cmdItems.forEach(item => {
        item.addEventListener('click', () => {
            handleCommand(item.dataset.action);
            togglePalette(false);
        });
    });

    function handleCommand(action) {
        const cmd = action.trim().toLowerCase();

        // Expanded logic for better "Shell" feel
        if (cmd.includes('lab') || cmd === 'g l') {
            document.getElementById('lab').scrollIntoView({ behavior: 'smooth' });
            injectLog("STATUS: SCROLLING_TO_LAB");
        } else if (cmd.includes('workbench') || cmd === 't w') {
            toggleSystemState();
        } else if (cmd.includes('email') || cmd === 'c e') {
            navigator.clipboard.writeText('steve@dewsbery.com');
            injectLog("CMD: EMAIL_COPIED_TO_CLIPBOARD");
        } else if (cmd.includes('status') || cmd === 's s') {
            injectLog("INTEGRITY: 100% // ALL SYSTEMS NOMINAL");
        } else if (cmd === 'clear') {
            document.getElementById('log-history').innerHTML = '';
            injectLog("BUFFER_CLEARED");
        } else if (cmd === 'help') {
            injectLog("AVAILABLE: LAB, WORKBENCH, EMAIL, STATUS, CLEAR");
        } else {
            // Check for direct action matches from Command Palette
            switch (action) {
                case 'go-lab': document.getElementById('lab').scrollIntoView({ behavior: 'smooth' }); break;
                case 'toggle-workbench': toggleSystemState(); break;
                case 'copy-email':
                    navigator.clipboard.writeText('steve@dewsbery.com');
                    injectLog("CMD: EMAIL_COPIED_TO_CLIPBOARD");
                    break;
                case 'system-status':
                    injectLog("ALL SYSTEMS NOMINAL");
                    break;
                default:
                    injectLog(`ERR: UNKNOWN_COMMAND_ '${cmd.toUpperCase()}'`);
            }
        }
    }

    // 5. MAGNETIC UI
    const magnets = document.querySelectorAll('.brand, .links a, #breaker-switch, .lab-entry');
    magnets.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const dist = Math.hypot(dx, dy);

            if (dist < 100) {
                gsap.to(el, { x: dx * 0.2, y: dy * 0.2, duration: 0.3, ease: "power2.out" });
            }
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 6. REAL-TIME PRESENCE
    const updatePresence = () => {
        const now = new Date();
        const ldnTime = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' });
        document.getElementById('local-time').innerText = `LND: ${ldnTime}`;
        const hour = now.getHours();
        const statusDot = document.getElementById('nav-status-dot');
        if (hour >= 9 && hour <= 18) {
            statusDot.className = 'status-dot online';
        } else {
            statusDot.className = 'status-dot afk';
        }
    };
    updatePresence();
    setInterval(updatePresence, 30000);

    // 7. SCROLLYTELLING CONNECTORS (UPGRADE 02)
    const drawConnectors = () => {
        const path = document.getElementById('scrolly-path');
        const packet = document.getElementById('data-packet-head');

        // Anchors
        const navDot = document.getElementById('nav-status-dot');
        const labAnchor = document.getElementById('lab-anchor'); // Ensure this ID exists on the Lab Section Meta
        const calcNode = document.getElementById('calculator-node');

        if (!navDot || !labAnchor || !calcNode) return;

        // Function to calculate and draw
        const updatePath = () => {
            const getCoord = (el) => {
                const r = el.getBoundingClientRect();
                return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY };
            };

            const p1 = getCoord(navDot);
            const p2 = getCoord(labAnchor);
            const p3 = getCoord(calcNode);

            // Bezier Logic: Draw from Nav -> Lab -> Calculator
            // Using S (Smooth) command for the second curve
            const d = `M ${p1.x} ${p1.y} 
                       C ${p1.x} ${p1.y + 150} ${p2.x - 50} ${p2.y - 150} ${p2.x} ${p2.y} 
                       S ${p3.x} ${p3.y - 150} ${p3.x} ${p3.y}`;

            path.setAttribute('d', d);

            const totalLength = path.getTotalLength();
            path.style.strokeDasharray = totalLength;
            path.style.strokeDashoffset = totalLength;
        };

        // Initial Draw
        updatePath();

        // Animate Line
        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5
            }
        });

        // Animate Data Packet
        gsap.to(packet, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: true
            },
            duration: 10,
            repeat: -1,
            ease: "linear"
        });

        // RE-CALCULATE ON RESIZE (CRITICAL FIX)
        window.addEventListener('resize', () => {
            updatePath();
            ScrollTrigger.refresh();
        });
    };

    // Wait for layout stability
    setTimeout(drawConnectors, 500);

    // 8. WIMBLEDON SCOUT TERMINAL (UPGRADE 03)
    // 8. WIMBLEDON SCOUT TERMINAL (UPGRADE 03)
    const feed = document.getElementById('wimbledon-feed');
    const scoutLogs = [
        { text: "> INIT_SEQUENCE...", class: "dim" },
        { text: "> TARGET: MERTON_LIB", class: "" },
        { text: "> SCANNING_SLOTS... [NULL]", class: "error" },
        { text: "> RETRY: POLKA_THEATRE", class: "" },
        { text: "> FOUND: SCIENCE_CLUB [SAT_10AM]", class: "success" }
    ];

    let scoutLineIndex = 0;

    function typeWriter() {
        if (!feed) return;
        if (scoutLineIndex >= scoutLogs.length) {
            setTimeout(() => { feed.innerHTML = ''; scoutLineIndex = 0; typeWriter(); }, 4000);
            return;
        }

        const line = document.createElement('div');
        line.className = `terminal-line ${scoutLogs[scoutLineIndex].class}`;
        line.innerText = scoutLogs[scoutLineIndex].text;
        feed.appendChild(line);

        scoutLineIndex++;
        setTimeout(typeWriter, 1200);
    }
    typeWriter();

    // 9. TIDY BOT VISION (UPGRADE 04)
    // GSAP Parallax for the vision interface
    const visionWindow = document.querySelector('.vision-interface');
    if (visionWindow) {
        visionWindow.addEventListener('mousemove', (e) => {
            const rect = visionWindow.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(visionWindow, {
                backgroundPosition: `${50 + x * 2}% ${50 + y * 2}%`,
                duration: 0.4
            });
        });
    }

    // 10. INDUSTRIAL CALCULATOR (UPGRADE 05)
    // 10. INDUSTRIAL CALCULATOR (UPGRADE 05)
    calcSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        let scrambles = 0;

        // Clear any existing interval to prevent overlapping
        if (window.calcInterval) clearInterval(window.calcInterval);

        // 1. Scramble Effect (Longer & Heavier)
        window.calcInterval = setInterval(() => {
            const random = Math.floor(Math.random() * 900) + 100;
            calcOutput.innerText = `Latency: ${random}ms`;
            scrambles++;

            // Increased scrambles for "Heavy" feel (approx 500ms total)
            if (scrambles > 15) {
                clearInterval(window.calcInterval);

                // 2. Final Calculation (Exponential Tax)
                const finalVal = Math.floor(val * val * 2.5);
                calcOutput.innerText = `Latency: ${finalVal}ms`;

                // 3. Color Logic
                if (finalVal > 800) {
                    calcOutput.style.color = '#FF4D00'; // Critical Red
                    injectLog("WARN: SYSTEM_LATENCY_CRITICAL");
                } else {
                    calcOutput.style.color = '#111'; // Safe Black
                }
            }
        }, 30);
    });

    // BREAKER LOGIC (PHYSICS)
    const triggerVoltageSag = () => {
        gsap.fromTo(body, { filter: 'brightness(1)' }, { filter: 'brightness(0.8)', duration: 0.1, yoyo: true, repeat: 1 });
    };

    const toggleSystemState = (forceOn = null) => {
        const isCurrentlyOn = body.classList.contains('workbench-mode');
        const nextState = forceOn !== null ? forceOn : !isCurrentlyOn;
        if (nextState === isCurrentlyOn) return;

        triggerVoltageSag();
        SoundEngine.play('click');
        body.classList.toggle('workbench-mode', nextState);
        injectLog(nextState ? "MODE: WORKBENCH_ACTIVE" : "MODE: CLIENT_VIEW");

        if (nextState) {
            startThermalDrift();
        } else {
            stopThermalDrift();
        }
    };

    const animateLock = (on) => {
        const targetXValue = on ? 16 : 0;
        gsap.to(switchHandle, { x: targetXValue, duration: 0.6, ease: "elastic.out(1, 0.5)", onComplete: () => toggleSystemState(on) });
        gsap.to(switchContainer, { scale: 1, duration: 0.2 });
    };

    switchContainer?.addEventListener('click', () => {
        const isCurrentlyOn = body.classList.contains('workbench-mode');
        animateLock(!isCurrentlyOn);
    });

    switchContainer?.addEventListener('mousedown', () => {
        gsap.to(switchContainer, { scale: 0.95, duration: 0.1 });
    });

    document.addEventListener('mouseup', () => {
        gsap.to(switchContainer, { scale: 1, duration: 0.2 });
    });

    // 11. WORKBENCH TERMINAL LOGIC
    const termInput = document.getElementById('terminal-input');
    termInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = termInput.value;
            injectLog(`CMD: ${val.toUpperCase()}`);
            handleCommand(val.toLowerCase()); // Link to existing CMD logic
            termInput.value = '';
        }
    });

    function injectLog(msg) {
        if (!logDisplay) return;
        const decay = document.createElement('span');
        decay.innerText = logDisplay.innerText;
        decay.className = 'decay-out';
        logDisplay.innerHTML = '';
        logDisplay.appendChild(decay);
        setTimeout(() => logDisplay.innerHTML = msg, 800);
    }

    injectLog("SYSTEM_OPERATIONAL");

    // THERMAL DRIFT LOGIC
    let driftInterval;
    function startThermalDrift() {
        const grid = document.querySelector('.diag-grid');
        if (driftInterval) clearInterval(driftInterval);

        driftInterval = setInterval(() => {
            // Jitter opacity
            const opacity = 0.1 + (Math.random() * 0.05);
            if (grid) grid.style.opacity = opacity;
        }, 100);
    }

    function stopThermalDrift() {
        if (driftInterval) clearInterval(driftInterval);
    }
});
