# MOTION SPECIFICATION: THE ARCHITECT’S WORKBENCH (v1.0)

**Project:** Steven Dewsbery Personal OS  
**Target Runtime:** 60fps / CSS + Canvas/SVG  
**Aesthetic:** Swiss International (Client) + NASA/Tektronix (Workbench)

---

## 1. GLOBAL VARIABLES (CSS CONFIG)

*Copy this block directly into the root stylesheet. These are the physics constants.*

```css
:root {
    /* TIMING */
    --duration-instant: 0ms;
    --duration-flash: 80ms;
    --duration-mech: 120ms;
    --duration-boot: 300ms;
    --duration-draw: 1.2s;

    /* EASING (THE PHYSICS ENGINE) */
    /* Client View: Calm, editorial, smooth */
    --ease-editorial: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    /* Workbench: High tension, snap-to-grid */
    --ease-snap: cubic-bezier(0.34, 1.56, 0.64, 1); /* The "Overshoot" */
    --ease-linear: linear;
    
    /* Analog: Digital steps for grid/text */
    --ease-stepped: steps(4, end); 

    /* VARIABLES */
    --grid-unit: 4px;
    --drift-amplitude: 0.5%;
}
```

---

## 2. STATE MACHINE LOGIC

The site operates on a rigid state machine. Motion is defined by the transition *between* these states.

| State | CSS Class | Visual Logic | Motion Profile |
| --- | --- | --- | --- |
| **0. Idle** | (Default) | Light Mode, Clean Typography | `--ease-editorial` |
| **1. Engaging** | `.system-engaging` | Voltage Sag (Brightness Dip) | Linear / Instant |
| **2. Workbench** | `.workbench-mode` | Blueprints, Oscilloscope, Grid | `--ease-snap` & `--ease-stepped` |
| **3. Diagnostic** | `.diag-mode` | Metrics Overlay, Code Rain | `steps(4)` |

---

## 3. COMPONENT MOTION SPECS

### 3.1 The Breaker Switch (The Trigger)

*This is the core interaction. It must feel heavy.*

* **Interaction Chain:**
1. **MouseDown:** Apply `transform: translateX(±1px)` via JS loop (50ms interval). *Effect: Micro-Resistance.*
2. **Drag/Toggle:** Switch moves. Shadow casts hard (no blur).
3. **MouseUp (Release):**
    * Add class `.snapping`
    * Apply `transform: translateY(4px)` (Overshoot) using `--ease-snap`.
    * Resolve to `0px`.
* **Audio Trigger:** `assets/thunk.mp3` (Start immediately).

### 3.2 Global Voltage Sag (The Transition)

*Simulates high-current draw when the "Workbench" engine starts.*

* **Trigger:** On `toggleSystemState()` event.
* **Target:** `<body>` or Root Wrapper.
* **Keyframes:**
```css
@keyframes voltage-sag {
    0% { filter: brightness(1); }
    50% { filter: brightness(0.8); } /* The Dip */
    100% { filter: brightness(1); }
}
```
* **Timing:** 100ms Total.
* **Note:** This must happen *before* the Workbench overlay appears.

### 3.3 The Oscilloscope (The Heartbeat)

*Canvas/SVG animation.*

* **State A (Client):** Sine Wave. Opacity 0.1. Static or very slow phase shift.
* **Transition (Sync):**
    1. Flatten amplitude to 0 (Straight line). Duration: 150ms.
    2. **Phosphor Bloom:** Filter `drop-shadow(0 0 10px #33FF00)`. Duration: 80ms.
* **State B (Workbench):** Square Wave. Opacity 0.9.
* **Thermal Drift:** Apply a 10Hz noise loop to the amplitude `(base_amp + Math.random() * 0.05)`.

### 3.4 Blueprint Renderer (The Structure)

*SVG Path Animation.*

* **Target:** `<path class="blueprint-line" />`
* **Logic:**
    * Set `stroke-dasharray` to path length.
    * Animate `stroke-dashoffset` from length to 0.
* **Timing:** `--duration-draw` (1.2s).
* **Easing:** `--ease-editorial` (Smooth start, smooth end).
* **Connectors:** Small circle anchors (`<circle>`) scale from 0 to 1 *after* the line passes their coordinates (requires JS calculation or staggered delay).

---

## 4. ANALOG IMPERFECTIONS (Workbench Mode Only)

*These scripts only run when `.workbench-mode` is active to save CPU.*

1. **Thermal Drift:**
    * Target: Grid Overlay Opacity & Waveform Amplitude.
    * Logic: `requestAnimationFrame` loop.
    * Value: `CurrentValue ± (Random * 0.005)`.
    * *Result: The UI feels like it is "breathing" or vibrating slightly.*

2. **Signal Noise:**
    * Target: Terminal Footer.
    * Logic: `setInterval(30000)`.
    * Action: Inject `<div class="static-line"></div>`.
    * CSS: `opacity: 0.2`, `mix-blend-mode: screen`.

3. **Phosphor Decay:**
    * Target: Terminal Logs.
    * CSS:
```css
transition: text-shadow 4s ease-out;
.new-log { text-shadow: 0 0 8px var(--color-phosphor); }
.old-log { text-shadow: none; opacity: 0.7; }
```

---

## 5. DIAGNOSTIC BOOT SEQUENCE (CMD + .)

*This is a scripted animation sequence. Do not use random timing.*

1. **T+0ms:** Overlay container `display: flex`.
2. **T+50ms:** Text "LOADING SENSORS..." appears.
3. **T+150ms:** Text "CALIBRATING GRID..." replaces previous.
4. **T+300ms:**
    * Text "SYSTEM NOMINAL".
    * Gridlines slide in (TranslateX/Y) using `steps(4)`.
    * **Log Injection:** `> DIAGNOSTICS_LAYER_ENGAGED`.

---

## 6. ACCESSIBILITY & PERFORMANCE

* **`prefers-reduced-motion`:**
    * Disable Voltage Sag (can trigger seizures).
    * Disable Thermal Drift (can cause nausea).
    * Switch Breaker Switch to instant toggle (no overshoot).
* **Performance:**
    * Animate `transform` and `opacity` only.
    * Use `will-change: transform` on the Breaker Switch during interaction.
    * Limit "Thermal Drift" JS loop to every 2nd frame if FPS drops below 55.

---

### Implementation Note for Devs:

This system relies on the **separation of concerns**:

* **CSS** handles the transitions (snaps, eases, fades).
* **JS** handles the state logic (adding classes) and the physics loops (drift, resistance).
* **SVG** handles the structural rendering (blueprints).

**Do not use JavaScript for simple hover states.** Use CSS transitions for everything except the Physics Engine features.
