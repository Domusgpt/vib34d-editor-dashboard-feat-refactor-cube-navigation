/**
 * VIB34D Transition Coordinator
 * 
 * Handles mathematical coordination between visualizers during transitions:
 * - Page transitions with outgoing/incoming coordination
 * - Card emergence/submersion animations
 * - Mathematical relationship preservation
 * - Timing and easing coordination
 */

class VIB34DTransitionCoordinator {
    constructor(visualizerSystem = null) {
        this.visualizerSystem = visualizerSystem;
        this.transitionStyle = 'slide_portal';
        this.isTransitioning = false;
        this.transitionQueue = [];
        
        // Mathematical relationship preservation
        this.conservationLaws = {
            density: true,      // Total density conservation
            energy: true,       // Motion energy conservation  
            color: true,        // Color harmonic preservation
            geometry: true      // Geometric morphing relationships
        };
        
        this.transitionTimings = {
            overlap: 300,
            stagger: 50,
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        };
    }
    
    /**
     * Execute page transition between sections
     */
    async executePageTransition(fromSection, toSection, options = {}) {
        if (this.isTransitioning) {
            this.transitionQueue.push({ fromSection, toSection, options });
            return;
        }
        
        this.isTransitioning = true;
        
        try {
            const transitionConfig = this.getTransitionConfig(options.style || this.transitionStyle);
            
            // Phase 1: Outgoing section preparation
            await this.prepareOutgoingSection(fromSection, transitionConfig);
            
            // Phase 2: Coordinated transition execution
            await this.executeCoordinatedTransition(fromSection, toSection, transitionConfig);
            
            // Phase 3: Incoming section stabilization
            await this.stabilizeIncomingSection(toSection, transitionConfig);
            
        } catch (error) {
            console.error('Transition failed:', error);
        } finally {
            this.isTransitioning = false;
            this.processTransitionQueue();
        }
    }
    
    /**
     * Get transition configuration
     */
    getTransitionConfig(style) {
        const configs = {
            fade_cross: {
                outgoing: {
                    phase1: { type: 'density_collapse', duration: 400 },
                    phase2: { type: 'color_fade_to_black', duration: 400, delay: 200 },
                    phase3: { type: 'translucency_to_zero', duration: 400, delay: 400 }
                },
                incoming: {
                    phase1: { type: 'translucency_from_zero', duration: 400, delay: 500 },
                    phase2: { type: 'color_bloom', duration: 400, delay: 700 },
                    phase3: { type: 'density_expansion', duration: 400, delay: 900 }
                },
                mathematical: {
                    density_conservation: true,
                    color_harmonic: 'complementary_progression',
                    geometric_morphing: 'fade_morph'
                }
            },
            
            slide_portal: {
                outgoing: {
                    phase1: { type: 'slide_to_edge', duration: 500, direction: 'auto' },
                    phase2: { type: 'geometry_dissolve', duration: 300, delay: 200 },
                    phase3: { type: 'dimensional_collapse', duration: 400, delay: 300 }
                },
                incoming: {
                    phase1: { type: 'dimensional_emerge', duration: 400, delay: 300 },
                    phase2: { type: 'geometry_crystallize', duration: 300, delay: 500 },
                    phase3: { type: 'slide_from_opposite', duration: 500, delay: 600 }
                },
                mathematical: {
                    density_conservation: true,
                    color_harmonic: 'slide_progression',
                    geometric_morphing: 'directional_morph'
                }
            },
            
            spiral_morph: {
                outgoing: {
                    phase1: { type: 'spiral_collapse_start', duration: 600 },
                    phase2: { type: 'parameter_spiral', duration: 400, delay: 200 },
                    phase3: { type: 'center_convergence', duration: 400, delay: 400 }
                },
                incoming: {
                    phase1: { type: 'center_emergence', duration: 400, delay: 400 },
                    phase2: { type: 'parameter_unspiral', duration: 400, delay: 600 },
                    phase3: { type: 'spiral_expansion', duration: 600, delay: 800 }
                },
                mathematical: {
                    density_conservation: true,
                    color_harmonic: 'spiral_progression',
                    geometric_morphing: 'spiral_transform'
                }
            },
            
            glitch_burst: {
                outgoing: {
                    phase1: { type: 'reality_glitch', duration: 200 },
                    phase2: { type: 'chromatic_separation', duration: 300, delay: 100 },
                    phase3: { type: 'digital_dissolve', duration: 300, delay: 200 }
                },
                incoming: {
                    phase1: { type: 'digital_reconstruct', duration: 300, delay: 150 },
                    phase2: { type: 'chromatic_reunite', duration: 300, delay: 250 },
                    phase3: { type: 'reality_stabilize', duration: 200, delay: 400 }
                },
                mathematical: {
                    density_conservation: false, // Chaos-based
                    color_harmonic: 'chaotic_progression',
                    geometric_morphing: 'glitch_transform'
                }
            }
        };
        
        return configs[style] || configs.slide_portal;
    }
    
    /**
     * Prepare outgoing section for transition
     */
    async prepareOutgoingSection(section, config) {
        const outgoingVisualizers = this.getVisualizersForSection(section);
        const phases = Object.values(config.outgoing);
        
        // Calculate total density and energy for conservation
        const totalDensity = this.calculateTotalDensity(outgoingVisualizers);
        const totalEnergy = this.calculateTotalEnergy(outgoingVisualizers);
        
        // Store for conservation laws
        this.conservationState = {
            totalDensity,
            totalEnergy,
            visualizerCount: outgoingVisualizers.length
        };
        
        // Execute outgoing phases with stagger
        const phasePromises = phases.map((phase, index) => {
            const delay = (phase.delay || 0) + (index * this.transitionTimings.stagger);
            
            return new Promise(resolve => {
                setTimeout(() => {
                    this.executeTransitionPhase(outgoingVisualizers, phase, 'outgoing')
                        .then(resolve);
                }, delay);
            });
        });
        
        await Promise.all(phasePromises);
    }
    
    /**
     * Execute coordinated transition between sections
     */
    async executeCoordinatedTransition(fromSection, toSection, config) {
        const outgoingVisualizers = this.getVisualizersForSection(fromSection);
        const incomingVisualizers = this.getVisualizersForSection(toSection);
        
        // Apply mathematical relationships
        if (config.mathematical.density_conservation && this.conservationLaws.density) {
            await this.applyDensityConservation(outgoingVisualizers, incomingVisualizers);
        }
        
        if (config.mathematical.color_harmonic && this.conservationLaws.color) {
            await this.applyColorHarmonic(outgoingVisualizers, incomingVisualizers, config.mathematical.color_harmonic);
        }
        
        if (config.mathematical.geometric_morphing && this.conservationLaws.geometry) {
            await this.applyGeometricMorphing(outgoingVisualizers, incomingVisualizers, config.mathematical.geometric_morphing);
        }
    }
    
    /**
     * Stabilize incoming section after transition
     */
    async stabilizeIncomingSection(section, config) {
        const incomingVisualizers = this.getVisualizersForSection(section);
        const phases = Object.values(config.incoming);
        
        // Execute incoming phases with stagger
        const phasePromises = phases.map((phase, index) => {
            const delay = (phase.delay || 0) + (index * this.transitionTimings.stagger);
            
            return new Promise(resolve => {
                setTimeout(() => {
                    this.executeTransitionPhase(incomingVisualizers, phase, 'incoming')
                        .then(resolve);
                }, delay);
            });
        });
        
        await Promise.all(phasePromises);
        
        // Final stabilization
        await this.finalizeSection(incomingVisualizers);
    }
    
    /**
     * Execute individual transition phase
     */
    async executeTransitionPhase(visualizers, phase, direction) {
        const promises = visualizers.map((visualizer, index) => {
            if (!visualizer || !visualizer.updateParameters) return Promise.resolve();
            
            const phaseParams = this.calculatePhaseParameters(phase, visualizer, index, direction);
            
            return visualizer.updateParameters(phaseParams, {
                duration: phase.duration,
                easing: this.transitionTimings.easing,
                delay: index * 20 // Slight per-visualizer stagger
            });
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Calculate parameters for transition phase
     */
    calculatePhaseParameters(phase, visualizer, index, direction) {
        const baseParams = visualizer.config;
        let params = {};
        
        switch (phase.type) {
            case 'density_collapse':
                params.gridDensity = 0;
                break;
                
            case 'density_expansion':
                params.gridDensity = baseParams.gridDensity;
                break;
                
            case 'color_fade_to_black':
                params.colorIntensity = 0;
                params.colors = baseParams.colors.map(() => '#000000');
                break;
                
            case 'color_bloom':
                params.colorIntensity = baseParams.colorIntensity;
                params.colors = baseParams.colors;
                break;
                
            case 'translucency_to_zero':
                params.opacity = 0;
                break;
                
            case 'translucency_from_zero':
                params.opacity = 1;
                break;
                
            case 'geometry_dissolve':
                params.morphFactor = 0;
                params.coherence = 0;
                break;
                
            case 'geometry_crystallize':
                params.morphFactor = baseParams.morphFactor || 1;
                params.coherence = 1;
                break;
                
            case 'slide_to_edge':
                const screenWidth = window.innerWidth;
                params.offsetX = index % 2 === 0 ? -screenWidth : screenWidth;
                break;
                
            case 'slide_from_opposite':
                params.offsetX = 0;
                break;
                
            case 'spiral_collapse_start':
                params.rotationSpeed = baseParams.speed * 3;
                params.scale = 0.1;
                break;
                
            case 'spiral_expansion':
                params.rotationSpeed = baseParams.speed;
                params.scale = 1.0;
                break;
                
            case 'reality_glitch':
                params.glitchIntensity = 1.0;
                params.chromaticAberration = 0.1;
                break;
                
            case 'reality_stabilize':
                params.glitchIntensity = 0;
                params.chromaticAberration = 0;
                break;
        }
        
        return params;
    }
    
    /**
     * Apply density conservation law
     */
    async applyDensityConservation(outgoingVisualizers, incomingVisualizers) {
        if (!this.conservationState) return;
        
        const totalDensity = this.conservationState.totalDensity;
        const incomingCount = incomingVisualizers.length;
        
        if (incomingCount === 0) return;
        
        const densityPerVisualizer = totalDensity / incomingCount;
        
        const promises = incomingVisualizers.map(visualizer => {
            if (!visualizer || !visualizer.updateParameters) return Promise.resolve();
            
            return visualizer.updateParameters({
                gridDensity: densityPerVisualizer
            }, { duration: 0 }); // Instant for conservation
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Apply color harmonic progression
     */
    async applyColorHarmonic(outgoingVisualizers, incomingVisualizers, harmonicType) {
        const outgoingColors = this.extractDominantColors(outgoingVisualizers);
        const harmonicColors = this.calculateHarmonicProgression(outgoingColors, harmonicType);
        
        const promises = incomingVisualizers.map((visualizer, index) => {
            if (!visualizer || !visualizer.updateParameters) return Promise.resolve();
            
            const colorIndex = index % harmonicColors.length;
            return visualizer.updateParameters({
                colors: [harmonicColors[colorIndex]]
            }, { duration: 0 });
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Apply geometric morphing relationships
     */
    async applyGeometricMorphing(outgoingVisualizers, incomingVisualizers, morphType) {
        const morphingParams = this.calculateMorphingParameters(morphType);
        
        const promises = incomingVisualizers.map((visualizer, index) => {
            if (!visualizer || !visualizer.updateParameters) return Promise.resolve();
            
            return visualizer.updateParameters(morphingParams, { duration: 0 });
        });
        
        await Promise.all(promises);
    }
    
    /**
     * Card emergence animation
     */
    async executeCardEmergence(cardElement, emergenceType = 'from_background', options = {}) {
        const visualizer = this.findVisualizerForElement(cardElement);
        if (!visualizer) return;
        
        const emergenceConfigs = {
            from_background: {
                initial: { opacity: 0, scale: 0.8, depth: -50 },
                final: { opacity: 0.8, scale: 1.0, depth: 0 },
                duration: 1200
            },
            from_center: {
                initial: { scale: 0, rotation: 360, blur: 20 },
                final: { scale: 1.0, rotation: 0, blur: 0 },
                duration: 800
            }
        };
        
        const config = emergenceConfigs[emergenceType];
        if (!config) return;
        
        // Apply initial state
        await visualizer.updateParameters(config.initial, { duration: 0 });
        
        // Animate to final state
        return visualizer.updateParameters(config.final, {
            duration: options.duration || config.duration,
            easing: options.easing || 'ease-out'
        });
    }
    
    /**
     * Card submersion animation
     */
    async executeCardSubmersion(cardElement, submersionType = 'to_background', options = {}) {
        const visualizer = this.findVisualizerForElement(cardElement);
        if (!visualizer) return;
        
        const submersionConfigs = {
            to_background: {
                final: { opacity: 0, scale: 0.8, depth: -50 },
                duration: 1000
            },
            to_center: {
                final: { scale: 0, rotation: 360, blur: 20 },
                duration: 600
            }
        };
        
        const config = submersionConfigs[submersionType];
        if (!config) return;
        
        return visualizer.updateParameters(config.final, {
            duration: options.duration || config.duration,
            easing: options.easing || 'ease-in'
        });
    }
    
    /**
     * Helper methods
     */
    getVisualizersForSection(section) {
        if (!this.visualizerSystem || !this.visualizerSystem.visualizers) return [];
        
        return this.visualizerSystem.visualizers.filter(visualizer => {
            return visualizer && visualizer.section === section;
        });
    }
    
    calculateTotalDensity(visualizers) {
        return visualizers.reduce((total, visualizer) => {
            return total + (visualizer.config?.gridDensity || 0);
        }, 0);
    }
    
    calculateTotalEnergy(visualizers) {
        return visualizers.reduce((total, visualizer) => {
            const config = visualizer.config;
            return total + (config?.speed || 0) * (config?.gridDensity || 0);
        }, 0);
    }
    
    extractDominantColors(visualizers) {
        return visualizers.map(visualizer => {
            return visualizer.config?.colors?.[0] || '#ffffff';
        });
    }
    
    calculateHarmonicProgression(colors, harmonicType) {
        // Simple harmonic color calculation
        return colors.map((color, index) => {
            const hue = this.extractHue(color);
            let newHue;
            
            switch (harmonicType) {
                case 'complementary_progression':
                    newHue = (hue + 180) % 360;
                    break;
                case 'slide_progression':
                    newHue = (hue + 30) % 360;
                    break;
                case 'spiral_progression':
                    newHue = (hue + index * 60) % 360;
                    break;
                default:
                    newHue = hue;
            }
            
            return `hsl(${newHue}, 70%, 50%)`;
        });
    }
    
    calculateMorphingParameters(morphType) {
        const morphConfigs = {
            fade_morph: { morphFactor: 0.5, coherence: 0.8 },
            directional_morph: { morphFactor: 1.0, coherence: 0.6 },
            spiral_transform: { morphFactor: 1.5, coherence: 0.4 },
            glitch_transform: { morphFactor: 2.0, coherence: 0.2 }
        };
        
        return morphConfigs[morphType] || morphConfigs.fade_morph;
    }
    
    extractHue(color) {
        // Simple hue extraction - would need more robust implementation
        if (color.startsWith('hsl')) {
            const match = color.match(/hsl\((\d+),/);
            return match ? parseInt(match[1]) : 0;
        }
        return 0;
    }
    
    findVisualizerForElement(element) {
        // Find associated visualizer for DOM element
        const index = element.dataset?.visualizerIndex;
        if (index !== undefined && this.visualizerSystem?.visualizers) {
            return this.visualizerSystem.visualizers[parseInt(index)];
        }
        return null;
    }
    
    finalizeSection(visualizers) {
        // Ensure all visualizers are in stable state
        const promises = visualizers.map(visualizer => {
            if (!visualizer || !visualizer.stabilize) return Promise.resolve();
            return visualizer.stabilize();
        });
        
        return Promise.all(promises);
    }
    
    processTransitionQueue() {
        if (this.transitionQueue.length > 0) {
            const next = this.transitionQueue.shift();
            this.executePageTransition(next.fromSection, next.toSection, next.options);
        }
    }
    
    /**
     * Update transition style
     */
    updateTransitionStyle(style) {
        this.transitionStyle = style;
    }
    
    /**
     * Get available transition styles
     */
    getAvailableStyles() {
        return ['fade_cross', 'slide_portal', 'spiral_morph', 'glitch_burst'];
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VIB34DTransitionCoordinator;
}

// Global access
window.VIB34DTransitionCoordinator = VIB34DTransitionCoordinator;