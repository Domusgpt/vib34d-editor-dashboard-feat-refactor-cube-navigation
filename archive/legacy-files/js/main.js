/**
 * main.js - The Orchestrator
 * Initializes and connects all VIB3STYLEPACK subsystems
 */

import VIB3StyleSystem from './VIB3StyleSystem.js';
import InteractionCoordinator from './InteractionCoordinator.js';
import PresetManager from './PresetManager.js';

class VIB3DOrchestrator {
    constructor() {
        this.presetManager = null;
        this.styleSystem = null;
        this.interactionCoordinator = null;
        this.isInitialized = false;
    }

    async init() {
        console.log('[VIB3D] 🚀 Initializing VIB3STYLEPACK Ecosystem...');

        try {
            // 1. Initialize PresetManager (The Library)
            console.log('[VIB3D] 📚 Loading preset library...');
            this.presetManager = new PresetManager();
            await this.presetManager.loadPresets('./presets/');

            // 2. Initialize VIB3StyleSystem (The Conductor)
            console.log('[VIB3D] 🎼 Starting style conductor...');
            this.styleSystem = new VIB3StyleSystem(this.presetManager);

            // 3. Initialize InteractionCoordinator (The Central Nervous System)
            console.log('[VIB3D] 🧠 Connecting nervous system...');
            this.interactionCoordinator = new InteractionCoordinator(
                this.presetManager,
                this.styleSystem
            );

            this.isInitialized = true;
            console.log('[VIB3D] ✨ Ecosystem initialized successfully!');

            // Emit global ready event
            document.dispatchEvent(new CustomEvent('vib3d-ready', {
                detail: {
                    orchestrator: this,
                    visualizers: this.styleSystem.getVisualizers(),
                    presets: this.presetManager.listAvailablePresets()
                }
            }));

        } catch (error) {
            console.error('[VIB3D] ❌ Initialization failed:', error);
            this.handleInitializationFailure(error);
        }
    }

    handleInitializationFailure(error) {
        // Graceful degradation - show content without effects
        document.body.classList.add('vib3d-fallback');
        console.log('[VIB3D] 🔄 Running in fallback mode');
    }

    // Public API for runtime control
    getSystem(name) {
        const systems = {
            presets: this.presetManager,
            styles: this.styleSystem,
            interactions: this.interactionCoordinator
        };
        return systems[name];
    }

    triggerGlobalEffect(effectName, intensity = 1.0) {
        if (this.interactionCoordinator) {
            this.interactionCoordinator.triggerGlobalEffect(effectName, intensity);
        }
    }

    switchTheme(themeName) {
        if (this.presetManager) {
            return this.presetManager.switchTheme(themeName);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.VIB3D = new VIB3DOrchestrator();
    await window.VIB3D.init();
});

// Export for module systems
export default VIB3DOrchestrator;