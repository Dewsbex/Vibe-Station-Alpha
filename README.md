# 🏛️ THE ARCHITECT’S WORKBENCH (v1.0)
## Asset Bundle for Steven Dewsbery // Systems Architect

This repository contains the "Gold Master" build of **The Architect's Workbench**, an interactive simulation environment designed to showcase systems engineering expertise through an 1980s NASA/Tektronix aesthetic.

---

## 📂 FILE MANIFEST
- **`index.html`**: The physical skeleton of the system. Contains high-fidelity DOM nodes for HUD, Oscilloscope, and Blueprint integration.
- **`style.css`**: The design system. Implements the NASA/Tektronix dashboard theme, CRT scanlines, and physics-based motion constants.
- **`script.js`**: The simulation engine. Handles the state machine, electrical physics (Voltage Sag, Thermal Drift), and coordinate math for blueprints.
- **`PRODUCTION_SPEC.md`**: Technical handbook for the motion engine. Defines easing curves, timing, and deterministic state transitions.

---

## 🚀 KEY ENGINE FEATURES
1. **Dual-State System**: 
   - *Client View (Idle)*: Clean, editorial, Swiss-inspired.
   - *Workbench Mode (Active)*: Dark, high-contrast engineering dashboard (`.workbench-mode`).
2. **Electrical Physics**:
   - **Voltage Sag**: 80ms brightness dip during power draw (state switch).
   - **Thermal Drift**: Continuous 0.5% grid jitter while active.
   - **Mechanical Haptics**: 50Hz micro-resistance on the physical breaker switch.
3. **Determinstic Logic**:
   - **Blueprint Renderer**: Orthogonal "stepped" routing between modules.
   - **Waveform Engine**: Phase-accurate Sine/Square wave transition on the oscilloscope.
4. **Diagnostic Layer**: High-contrast metrics overlay toggled via `CMD + .` or `CTRL + .`.

---

## 🛠️ IMPLEMENTATION NOTES
- **Grid Snapping**: All SVG anchors are floor-snapped to a 10px virtual grid.
- **Typography**: Uses Google Fonts (Archivo, Inter, Space Mono).
- **Accessibility**: Support for `prefers-reduced-motion` is baked into the CSS and JS engines.

**Status: ALL SYSTEMS NOMINAL.**  
**Trace Fidelity: ABSOLUTE.**
