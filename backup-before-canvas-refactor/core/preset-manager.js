/**
 * VIB34D Preset Manager
 * 
 * Handles loading, switching, and management of preset banks:
 * - Visualizer settings (density, speed, reactivity, colors)
 * - Transition animations (page, card, effects)
 * - Interaction behaviors (hover, click, scroll)
 * - Effect presets (visual effects and responses)
 */

class VIB34DPresetManager {
    constructor(visualizerSystem = null) {
        this.visualizerSystem = visualizerSystem;
        this.currentPresets = {
            visualizer: 'standard',
            transitions: 'slide_portal',
            interactions: 'responsive',
            effects: 'subtle_glow'
        };
        
        this.presetBanks = {
            visualizer: {},
            transitions: {},
            interactions: {},
            effects: {}
        };
        
        this.customPresets = new Map();
        this.transitionQueue = [];
        this.isTransitioning = false;
        
        this.initializeDefaultPresets();
    }
    
    /**
     * Initialize default preset banks
     */
    initializeDefaultPresets() {
        // Visualizer Setting Presets
        this.presetBanks.visualizer = {
            minimal: {
                density: { base: 4.0, variation: 1.0 },
                speed: { base: 0.3, variation: 0.1 },
                reactivity: { mouse: 0.2, click: 0.1, scroll: 0.1 },
                colors: { palette: 'monochrome', intensity: 0.6 }
            },
            
            standard: {
                density: { base: 8.0, variation: 2.0 },
                speed: { base: 0.6, variation: 0.2 },
                reactivity: { mouse: 0.6, click: 0.4, scroll: 0.3 },
                colors: { palette: 'complementary', intensity: 1.0 }
            },
            
            dense: {
                density: { base: 16.0, variation: 4.0 },
                speed: { base: 1.2, variation: 0.4 },
                reactivity: { mouse: 1.0, click: 0.8, scroll: 0.6 },
                colors: { palette: 'triadic', intensity: 1.3 }
            },
            
            maximum: {
                density: { base: 32.0, variation: 8.0 },
                speed: { base: 2.0, variation: 0.8 },
                reactivity: { mouse: 1.5, click: 1.2, scroll: 1.0 },
                colors: { palette: 'rainbow', intensity: 1.6 }
            }
        };
        
        // Transition Animation Presets
        this.presetBanks.transitions = {
            fade_cross: {
                outgoing: 'fade_to_black',
                incoming: 'fade_from_black',
                overlap: 200,
                easing: 'ease-in-out',
                duration: 800
            },
            
            slide_portal: {
                outgoing: 'slide_to_edge_dissolve',
                incoming: 'slide_from_opposite_edge',
                overlap: 300,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                duration: 1000
            },
            
            spiral_morph: {
                outgoing: 'spiral_collapse_to_center',
                incoming: 'spiral_emerge_from_center',
                overlap: 400,
                easing: 'ease-out-expo',
                duration: 1200
            },
            
            glitch_burst: {
                outgoing: 'vhs_glitch_dissolve',
                incoming: 'chromatic_aberration_emerge',
                overlap: 150,
                easing: 'ease-in-bounce',
                duration: 600
            }
        };
        
        // Interaction Behavior Presets
        this.presetBanks.interactions = {
            passive: {
                hover_effect: 'subtle_glow',
                click_effect: 'color_inversion',
                scroll_effect: 'momentum_trails',
                sensitivity: 0.5
            },
            
            responsive: {
                hover_effect: 'magnetic_attraction',
                click_effect: 'reality_glitch',
                scroll_effect: 'chaos_buildup',
                sensitivity: 1.0
            },
            
            highly_reactive: {
                hover_effect: 'reality_distortion',
                click_effect: 'quantum_collapse',
                scroll_effect: 'harmonic_resonance',
                sensitivity: 1.5
            },
            
            hypersensitive: {
                hover_effect: 'reality_distortion',
                click_effect: 'quantum_collapse',
                scroll_effect: 'harmonic_resonance',
                sensitivity: 2.0
            }
        };
        
        // Effect and Response Presets
        this.presetBanks.effects = {
            subtle_glow: {
                target_enhancement: 'soft_luminous_glow',
                others_response: 'slight_dimming',
                transition_speed: 'fast',
                intensity: 0.7
            },
            
            magnetic_attraction: {
                target_enhancement: 'density_increase_with_pull_effect',
                others_response: 'density_decrease_with_push_effect',
                transition_speed: 'medium',
                intensity: 1.0
            },
            
            reality_distortion: {
                target_enhancement: 'geometry_warping_and_color_shift',
                others_response: 'stability_compensation',
                transition_speed: 'slow',
                intensity: 1.3
            }
        };
    }
    
    /**
     * Switch to a different preset in any category
     */
    async switchPreset(category, presetName, options = {}) {
        if (!this.presetBanks[category] || !this.presetBanks[category][presetName]) {
            console.warn(`Preset ${presetName} not found in category ${category}`);
            return false;
        }
        
        const previousPreset = this.currentPresets[category];
        this.currentPresets[category] = presetName;
        
        try {
            await this.applyPreset(category, presetName, options);
            
            // Trigger preset change event
            this.triggerPresetChangeEvent(category, presetName, previousPreset);
            
            return true;
        } catch (error) {
            console.error(`Failed to apply preset ${presetName}:`, error);
            // Rollback
            this.currentPresets[category] = previousPreset;
            return false;
        }
    }
    
    /**
     * Apply a preset to the visualizer system
     */
    async applyPreset(category, presetName, options = {}) {
        const preset = this.presetBanks[category][presetName];
        const duration = options.duration || 500;
        const easing = options.easing || 'ease-out';
        
        switch (category) {
            case 'visualizer':
                await this.applyVisualizerPreset(preset, duration, easing);
                break;
                
            case 'transitions':
                this.applyTransitionPreset(preset);
                break;
                
            case 'interactions':
                this.applyInteractionPreset(preset);
                break;
                
            case 'effects':
                this.applyEffectPreset(preset);
                break;
        }
    }
    
    /**
     * Apply visualizer settings preset
     */
    async applyVisualizerPreset(preset, duration = 500, easing = 'ease-out') {
        if (!this.visualizerSystem || !this.visualizerSystem.visualizers) {
            console.warn('No visualizer system available');
            return;
        }
        
        const promises = this.visualizerSystem.visualizers.map(async (visualizer, index) => {
            if (!visualizer || !visualizer.updateParameters) return;
            
            const newParams = {
                gridDensity: preset.density.base + (Math.random() - 0.5) * preset.density.variation,
                speed: preset.speed.base + (Math.random() - 0.5) * preset.speed.variation,
                reactivity: preset.reactivity.mouse,
                colorIntensity: preset.colors.intensity
            };
            
            // Apply color palette
            if (preset.colors.palette) {
                newParams.colors = this.generateColorPalette(preset.colors.palette, index);
            }
            
            return visualizer.updateParameters(newParams, {
                duration,
                easing
            });
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Apply transition preset
     */
    applyTransitionPreset(preset) {
        if (this.visualizerSystem && this.visualizerSystem.transitionCoordinator) {
            this.visualizerSystem.transitionCoordinator.updateTransitionStyle(preset);
        }
    }
    
    /**
     * Apply interaction preset
     */
    applyInteractionPreset(preset) {
        if (this.visualizerSystem && this.visualizerSystem.interactionCoordinator) {
            this.visualizerSystem.interactionCoordinator.updateInteractionStyle(preset);
        }
    }
    
    /**
     * Apply effect preset
     */
    applyEffectPreset(preset) {
        if (this.visualizerSystem && this.visualizerSystem.effectSystem) {
            this.visualizerSystem.effectSystem.updateEffectStyle(preset);
        }
    }
    
    /**
     * Generate color palette based on preset type
     */
    generateColorPalette(paletteType, visualizerIndex = 0) {
        const baseHue = (visualizerIndex * 30) % 360; // Distribute hues across visualizers
        
        switch (paletteType) {
            case 'monochrome':
                return this.generateMonochromePalette(baseHue);
                
            case 'complementary':
                return this.generateComplementaryPalette(baseHue);
                
            case 'triadic':
                return this.generateTriadicPalette(baseHue);
                
            case 'analogous':
                return this.generateAnalogousPalette(baseHue);
                
            case 'rainbow':
                return this.generateRainbowPalette();
                
            default:
                return this.generateComplementaryPalette(baseHue);
        }
    }
    
    /**
     * Generate monochrome color palette
     */
    generateMonochromePalette(baseHue) {
        return [
            `hsl(${baseHue}, 60%, 30%)`,
            `hsl(${baseHue}, 80%, 50%)`,
            `hsl(${baseHue}, 90%, 70%)`,
            `hsl(${baseHue}, 70%, 85%)`
        ];
    }
    
    /**
     * Generate complementary color palette
     */
    generateComplementaryPalette(baseHue) {
        const complementaryHue = (baseHue + 180) % 360;
        return [
            `hsl(${baseHue}, 70%, 50%)`,
            `hsl(${complementaryHue}, 70%, 50%)`,
            `hsl(${baseHue}, 90%, 75%)`,
            `hsl(${complementaryHue}, 90%, 75%)`
        ];
    }
    
    /**
     * Generate triadic color palette
     */
    generateTriadicPalette(baseHue) {
        const hue2 = (baseHue + 120) % 360;
        const hue3 = (baseHue + 240) % 360;
        return [
            `hsl(${baseHue}, 70%, 50%)`,
            `hsl(${hue2}, 70%, 50%)`,
            `hsl(${hue3}, 70%, 50%)`,
            `hsl(${baseHue}, 50%, 80%)`
        ];
    }
    
    /**
     * Generate analogous color palette
     */
    generateAnalogousPalette(baseHue) {
        return [
            `hsl(${(baseHue - 30) % 360}, 70%, 50%)`,
            `hsl(${baseHue}, 70%, 50%)`,
            `hsl(${(baseHue + 30) % 360}, 70%, 50%)`,
            `hsl(${(baseHue + 60) % 360}, 70%, 70%)`
        ];
    }
    
    /**
     * Generate rainbow color palette
     */
    generateRainbowPalette() {
        return [
            'hsl(0, 70%, 50%)',    // Red
            'hsl(120, 70%, 50%)',  // Green
            'hsl(240, 70%, 50%)',  // Blue
            'hsl(300, 70%, 50%)'   // Magenta
        ];
    }
    
    /**
     * Create custom preset from current settings
     */
    createCustomPreset(name, description = '') {
        if (!this.visualizerSystem) {
            console.warn('No visualizer system available for creating preset');
            return false;
        }
        
        const customPreset = {
            name,
            description,
            timestamp: Date.now(),
            settings: {
                visualizer: this.extractCurrentVisualizerSettings(),
                transitions: this.currentPresets.transitions,
                interactions: this.currentPresets.interactions,
                effects: this.currentPresets.effects
            }
        };
        
        this.customPresets.set(name, customPreset);
        this.saveCustomPresets();
        
        return true;
    }
    
    /**
     * Extract current visualizer settings
     */
    extractCurrentVisualizerSettings() {
        if (!this.visualizerSystem || !this.visualizerSystem.visualizers) {
            return null;
        }
        
        return this.visualizerSystem.visualizers.map(visualizer => {
            if (!visualizer || !visualizer.config) return null;
            
            return {
                gridDensity: visualizer.config.gridDensity,
                speed: visualizer.config.speed,
                reactivity: visualizer.config.reactivity,
                colorIntensity: visualizer.config.colorIntensity,
                colors: [...visualizer.config.colors]
            };
        }).filter(config => config !== null);
    }
    
    /**
     * Load custom preset
     */
    async loadCustomPreset(name, options = {}) {
        const preset = this.customPresets.get(name);
        if (!preset) {
            console.warn(`Custom preset ${name} not found`);
            return false;
        }
        
        try {
            // Apply all preset categories
            await Promise.all([
                this.switchPreset('visualizer', 'custom', { customSettings: preset.settings.visualizer }),
                this.switchPreset('transitions', preset.settings.transitions),
                this.switchPreset('interactions', preset.settings.interactions),
                this.switchPreset('effects', preset.settings.effects)
            ]);
            
            return true;
        } catch (error) {
            console.error(`Failed to load custom preset ${name}:`, error);
            return false;
        }
    }
    
    /**
     * Get all available presets in a category
     */
    getAvailablePresets(category) {
        if (!this.presetBanks[category]) {
            return [];
        }
        
        const standardPresets = Object.keys(this.presetBanks[category]);
        
        if (category === 'visualizer') {
            const customPresets = Array.from(this.customPresets.keys());
            return [...standardPresets, ...customPresets];
        }
        
        return standardPresets;
    }
    
    /**
     * Get current preset configuration
     */
    getCurrentPresets() {
        return { ...this.currentPresets };
    }
    
    /**
     * Save custom presets to localStorage
     */
    saveCustomPresets() {
        try {
            const presetsArray = Array.from(this.customPresets.entries());
            localStorage.setItem('vib34d-custom-presets', JSON.stringify(presetsArray));
        } catch (error) {
            console.warn('Failed to save custom presets:', error);
        }
    }
    
    /**
     * Load custom presets from localStorage
     */
    loadCustomPresets() {
        try {
            const stored = localStorage.getItem('vib34d-custom-presets');
            if (stored) {
                const presetsArray = JSON.parse(stored);
                this.customPresets = new Map(presetsArray);
            }
        } catch (error) {
            console.warn('Failed to load custom presets:', error);
        }
    }
    
    /**
     * Delete custom preset
     */
    deleteCustomPreset(name) {
        const deleted = this.customPresets.delete(name);
        if (deleted) {
            this.saveCustomPresets();
        }
        return deleted;
    }
    
    /**
     * Trigger preset change event
     */
    triggerPresetChangeEvent(category, newPreset, previousPreset) {
        const event = new CustomEvent('vib34d-preset-changed', {
            detail: {
                category,
                newPreset,
                previousPreset,
                currentPresets: this.getCurrentPresets()
            }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Bulk preset application
     */
    async applyPresetProfile(profile) {
        const promises = Object.entries(profile).map(([category, presetName]) => {
            return this.switchPreset(category, presetName);
        });
        
        try {
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Failed to apply preset profile:', error);
            return false;
        }
    }
    
    /**
     * Export current configuration as preset profile
     */
    exportPresetProfile() {
        return {
            ...this.currentPresets,
            timestamp: Date.now(),
            version: '1.0'
        };
    }
    
    /**
     * Import preset profile
     */
    async importPresetProfile(profile) {
        if (!profile || typeof profile !== 'object') {
            console.warn('Invalid preset profile');
            return false;
        }
        
        return await this.applyPresetProfile(profile);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VIB34DPresetManager;
}

// Global access
window.VIB34DPresetManager = VIB34DPresetManager;