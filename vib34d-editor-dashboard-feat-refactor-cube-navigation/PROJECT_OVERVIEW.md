# VIB3STYLEPACK Production - Project Overview

This project is an "emergent interface system" designed for a revolutionary user experience, not a typical web application.

## Core Architecture Principles:
- **Mathematical Interconnectedness**: Every visual element is mathematically linked.
- **Centralized Synchronization**: Animations and interactions are synchronized via `VIB3HomeMaster.js` (parameter authority) and `UnifiedReactivityBridge.js` (JS-CSS-GLSL synchronization).
- **Ecosystem-Wide Reactivity**: User interactions trigger responses across the entire visual ecosystem.
- **Editor-Configurable**: All aspects are controlled via a preset system (JSON configurations in `/presets/`) and an editor dashboard.
- **Complex Visuals**: Involves 4D mathematics, 17 shader uniforms, and 8 geometry classes.
- **Parameter Web (CRITICAL)**: Every element is connected in a parameter web where:
    1.  **Hover a card** → Other cards dim/brighten based on relatedness.
    2.  **Focus an element** → Background geometry shifts to reflect that element's properties.
    3.  **Change parameters** → Cascading visual updates that show system relationships.
    4.  **Interaction state** → Everything responds systematically to convey the current mode.

## Current Development Target:
- `index.html`: This file represents the "FIXED ARCHITECTURE - Reusable Canvas System." It aims to reduce WebGL contexts from 31 (as in the legacy monolithic version) to 5 by reusing canvases and dynamically updating their geometry and parameters. This is the current primary development target.

## Key Components:
- `/core/VIB3HomeMaster.js`: Single source of truth for all visual parameters.
- `/core/UnifiedReactivityBridge.js`: JS-CSS-GLSL synchronization layer.
- `/presets/*.json`: JSON configuration files for editor control.
- `VIB34D_ADAPTIVE_CARD_VISUALIZER.js`: Handles the WebGL rendering for individual cards.
- `VIB3_ENHANCED_INTERACTION_SYSTEM.js`: Manages enhanced user interactions.

## Current Status & Critical Issues:
- **WebGL Rendering Failure**: The core issue of black content areas persists in `index.html`. This indicates a problem in the WebGL rendering pipeline or how content is drawn onto the canvases, likely stemming from `VIB34D_ADAPTIVE_CARD_VISUALIZER.js`.
- **Shader Compilation Error**: The `REFACTOR_PLAN.md` mentions `Vec3/Vec2` type mismatches causing shader compilation errors. This is highly likely the root cause of the rendering failure in `VIB34D_ADAPTIVE_CARD_VISUALIZER.js`.
- **Navigation Visual Discrepancy**: While navigation logic is active (e.g., face names displayed), the visual output remains black, confirming a rendering problem.

## Immediate Goal:
**Fix the WebGL rendering pipeline and content display issues within `index.html` to ensure the 4D cube navigation visually functions as intended.** This involves resolving shader compilation errors in `VIB34D_ADAPTIVE_CARD_VISUALIZER.js` and ensuring content is correctly drawn onto the canvases.