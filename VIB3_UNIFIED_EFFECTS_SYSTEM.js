/**
 * VIB3 UNIFIED EFFECTS SYSTEM
 * 
 * Hierarchical class system for coordinated visual effects across all visualizers
 * Creates total system coherence with intuitive, natural, "woah" factor
 * 
 * HIERARCHY:
 * System Level → Face Level → Card Level → Element Level
 * All effects cascade down with mathematical relationships
 */

class VIB3UnifiedEffectsSystem {
    constructor(homeMaster, reactivityBridge) {
        this.homeMaster = homeMaster;
        this.bridge = reactivityBridge;
        
        // Effect hierarchy levels
        this.effectLevels = {
            SYSTEM: 'system',      // Global system-wide effects
            FACE: 'face',          // Tesseract face-level effects  
            CARD: 'card',          // Individual card effects
            ELEMENT: 'element'     // Micro-element effects
        };
        
        // Effect intensity multipliers by hierarchy
        this.hierarchyMultipliers = {
            system: 1.0,           // Full intensity
            face: 0.8,             // 80% of system
            card: 0.6,             // 60% of system  
            element: 0.4           // 40% of system
        };
        
        // Current active effects state
        this.activeEffects = {
            system: new Map(),
            face: new Map(), 
            card: new Map(),
            element: new Map()
        };
        
        // CSS custom property manager
        this.cssProperties = new Map();
        
        this.initializeEffectPresets();
        this.setupCSSVariableSystem();
        
        console.log('🌊 VIB3 Unified Effects System initialized');
    }
    
    /**
     * CORE EFFECT PRESETS - Intuitive, Natural, "Woah" Factor
     */
    initializeEffectPresets() {
        this.effectPresets = {
            
            // ============ FOCUS EFFECTS ============
            'focus-in': {
                level: this.effectLevels.SYSTEM,
                description: 'Element comes into focus, others fade back',
                effects: {
                    focused: {
                        scale: 1.05,
                        opacity: 1.0,
                        blur: 0,
                        glow: 0.8,
                        zIndex: 100,
                        dimensional: 0.2 // Pull forward in 4D space
                    },
                    unfocused: {
                        scale: 0.98,
                        opacity: 0.6,
                        blur: 2,
                        glow: 0.0,
                        zIndex: 10,
                        dimensional: -0.1 // Push back in 4D space
                    },
                    system: {
                        globalIntensity: 0.9,
                        coherence: 1.2,
                        backgroundDim: 0.3
                    }
                }
            },
            
            'focus-out': {
                level: this.effectLevels.SYSTEM,
                description: 'Return all elements to baseline state',
                effects: {
                    all: {
                        scale: 1.0,
                        opacity: 1.0,
                        blur: 0,
                        glow: 0.0,
                        zIndex: 'auto',
                        dimensional: 0.0
                    },
                    system: {
                        globalIntensity: 0.8,
                        coherence: 1.0,
                        backgroundDim: 0.0
                    }
                }
            },
            
            // ============ CLICK/ACTIVATION EFFECTS ============
            'click-pulse': {
                level: this.effectLevels.CARD,
                description: 'Ripple effect from clicked element through system',
                effects: {
                    clicked: {
                        scale: [1.0, 1.15, 1.0], // Keyframe animation
                        glow: [0.0, 1.0, 0.3],
                        dimensional: [0.0, 0.5, 0.1],
                        duration: 600
                    },
                    neighbors: {
                        scale: [1.0, 1.02, 1.0],
                        glow: [0.0, 0.4, 0.0],
                        delay: 100
                    },
                    distant: {
                        scale: [1.0, 0.98, 1.0],
                        opacity: [1.0, 0.8, 1.0],
                        delay: 200
                    },
                    system: {
                        portalIntensity: [0.0, 0.8, 0.0],
                        realityTear: [0.0, 0.3, 0.0],
                        duration: 800
                    }
                }
            },
            
            'click-reality-invert': {
                level: this.effectLevels.SYSTEM,
                description: 'Reality inversion effect on click',
                effects: {
                    clicked: {
                        invert: [0, 1, 0],
                        hueRotate: [0, 180, 0],
                        contrast: [1, 2, 1],
                        duration: 400
                    },
                    system: {
                        globalInvert: [0, 0.3, 0],
                        chaosIntensity: [0, 0.6, 0],
                        duration: 600
                    }
                }
            },
            
            // ============ NAVIGATION EFFECTS ============
            'tesseract-fold': {
                level: this.effectLevels.FACE,
                description: 'Tesseract folding transition between faces',
                effects: {
                    currentFace: {
                        rotateY: [0, -90, -90],
                        scale: [1.0, 0.8, 0.0],
                        opacity: [1.0, 0.5, 0.0],
                        dimensional: [0.0, -0.5, -1.0],
                        duration: 800
                    },
                    targetFace: {
                        rotateY: [90, 0, 0],
                        scale: [0.0, 0.8, 1.0],
                        opacity: [0.0, 0.5, 1.0],
                        dimensional: [-1.0, -0.5, 0.0],
                        delay: 400,
                        duration: 800
                    },
                    system: {
                        tensionIntensity: [0.0, 1.0, 0.0],
                        portalEnergy: [0.0, 0.8, 0.2],
                        globalIntensity: [0.8, 1.2, 0.8],
                        duration: 1200
                    }
                }
            },
            
            'portal-transition': {
                level: this.effectLevels.SYSTEM,
                description: 'Portal-style transition with chromatic aberration',
                effects: {
                    all: {
                        chromaticRed: [0, 3, 6, 20, 0],
                        chromaticCyan: [0, -3, -6, -20, 0],
                        opacity: [1.0, 1.0, 1.0, 0.0, 0.0],
                        duration: 800
                    },
                    system: {
                        portalIntensity: [0.0, 0.25, 0.5, 0.99, 0.0],
                        duration: 800
                    }
                }
            },
            
            // ============ BREATHING/CONSCIOUSNESS EFFECTS ============
            'consciousness-breathing': {
                level: this.effectLevels.SYSTEM,
                description: 'Unified breathing pattern across all elements',
                effects: {
                    all: {
                        scale: { 
                            pattern: 'sine', 
                            amplitude: 0.02, 
                            frequency: 0.5, 
                            phase: 'staggered' 
                        },
                        opacity: { 
                            pattern: 'sine', 
                            amplitude: 0.1, 
                            frequency: 0.5, 
                            phase: 'synchronized' 
                        },
                        dimensional: { 
                            pattern: 'sine', 
                            amplitude: 0.1, 
                            frequency: 0.5, 
                            phase: 'inverse' 
                        },
                        continuous: true
                    }
                }
            },
            
            // ============ CHAOS/GLITCH EFFECTS ============
            'vhs-glitch-cascade': {
                level: this.effectLevels.SYSTEM,
                description: 'VHS glitch effect cascading through system',
                effects: {
                    textElements: {
                        glitchIntensity: [0.0, 0.8, 0.4, 0.0],
                        chromaticShift: [0, 2, 4, 0],
                        textShadowRed: [0, -1, -2, 0],
                        textShadowBlue: [0, 1, 2, 0],
                        duration: 1000,
                        stagger: 100
                    },
                    system: {
                        chaosIntensity: [0.0, 0.6, 0.3, 0.0],
                        microChaos: [0.0, 0.4, 0.2, 0.0],
                        duration: 1200
                    }
                }
            },
            
            // ============ QUANTUM ENTANGLEMENT EFFECTS ============
            'quantum-entanglement': {
                level: this.effectLevels.SYSTEM,
                description: 'Synchronized quantum effects across visualizers',
                effects: {
                    visualizers: {
                        parameter: 'morphFactor',
                        synchronization: 'quantum',
                        entanglementStrength: 0.8,
                        phaseShift: [0, 60, 120, 180, 240, 300], // Different phases per visualizer
                        amplitude: 0.3,
                        frequency: 0.3,
                        continuous: true
                    },
                    system: {
                        quantumCoherence: 1.0,
                        entanglementField: 0.6
                    }
                }
            },
            
            // ============ DIMENSIONAL SHIFT EFFECTS ============
            'dimensional-shift': {
                level: this.effectLevels.FACE,
                description: 'Shift between dimensional perspectives',
                effects: {
                    all: {
                        perspective: [1200, 800, 1600, 1200],
                        rotateX: [0, 15, -10, 0],
                        rotateY: [0, -8, 12, 0],
                        dimensional: [3.5, 4.2, 3.8, 3.5],
                        duration: 1500
                    },
                    system: {
                        dimensionalDepth: [3.5, 4.5, 3.8, 3.5],
                        spatialCoherence: [1.0, 0.7, 0.9, 1.0],
                        duration: 1500
                    }
                }
            }
        };
    }
    
    /**
     * CSS VARIABLE SYSTEM SETUP
     */
    setupCSSVariableSystem() {
        // Initialize all CSS custom properties
        this.cssVariables = {
            // Global system variables
            '--global-intensity': 0.8,
            '--system-coherence': 1.0,
            '--dimensional-depth': 3.5,
            '--portal-intensity': 0.0,
            '--chaos-intensity': 0.0,
            '--micro-chaos': 0.0,
            '--reality-tear': 0.0,
            '--tension-intensity': 0.0,
            
            // Focus system variables
            '--focused-element': -1,
            '--focus-intensity': 0.0,
            '--unfocus-blur': 0.0,
            '--background-dim': 0.0,
            
            // Mouse influence variables
            '--mouse-influence': 0.0,
            '--mouse-intensity': 0.0,
            '--click-pulse': 0.0,
            
            // Portal/transition variables
            '--portal-energy': 1.0,
            '--portal-duration': 0.8,
            '--chromatic-red': 0,
            '--chromatic-cyan': 0,
            
            // Quantum variables
            '--quantum-coherence': 0.0,
            '--entanglement-field': 0.0,
            
            // Breathing/consciousness variables
            '--breathing-amplitude': 0.02,
            '--breathing-frequency': 0.5,
            '--consciousness-phase': 0.0
        };
        
        this.applyCSSVariables();
    }
    
    /**
     * APPLY CSS VARIABLES TO DOCUMENT ROOT
     */
    applyCSSVariables() {
        const root = document.documentElement;
        Object.entries(this.cssVariables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }
    
    /**
     * TRIGGER EFFECT PRESET
     */
    triggerEffect(presetName, target = null, options = {}) {
        const preset = this.effectPresets[presetName];
        if (!preset) {
            console.warn(`Effect preset '${presetName}' not found`);
            return;
        }
        
        console.log(`🌊 Triggering effect: ${presetName}`);
        
        // Apply effects based on preset configuration
        this.applyEffectPreset(preset, target, options);
        
        // Register with VIB3HomeMaster for system coordination
        if (this.homeMaster) {
            this.homeMaster.registerInteraction('visual-effect', 0.8, 1000);
        }
    }
    
    /**
     * APPLY EFFECT PRESET TO SYSTEM
     */
    applyEffectPreset(preset, target, options) {
        const effects = preset.effects;
        
        // Apply system-level effects
        if (effects.system) {
            this.applySystemEffects(effects.system);
        }
        
        // Apply element-specific effects
        Object.entries(effects).forEach(([elementType, effectConfig]) => {
            if (elementType === 'system') return; // Already handled
            
            this.applyElementEffects(elementType, effectConfig, target, options);
        });
    }
    
    /**
     * APPLY SYSTEM-LEVEL EFFECTS
     */
    applySystemEffects(systemEffects) {
        Object.entries(systemEffects).forEach(([property, value]) => {
            const cssVar = this.mapPropertyToCSSVariable(property);
            if (cssVar) {
                this.animateCSSVariable(cssVar, value, systemEffects.duration || 300);
            }
        });
    }
    
    /**
     * APPLY ELEMENT-SPECIFIC EFFECTS
     */
    applyElementEffects(elementType, effectConfig, target, options) {
        let elements = [];
        
        // Determine target elements based on type
        switch(elementType) {
            case 'focused':
                elements = target ? [target] : [];
                break;
            case 'unfocused':
                elements = this.getAllElementsExcept(target);
                break;
            case 'all':
                elements = this.getAllElements();
                break;
            case 'clicked':
                elements = target ? [target] : [];
                break;
            case 'neighbors':
                elements = this.getNeighborElements(target);
                break;
            case 'distant':
                elements = this.getDistantElements(target);
                break;
            case 'visualizers':
                this.applyVisualizerEffects(effectConfig);
                return;
            case 'textElements':
                elements = document.querySelectorAll('[data-text]');
                break;
            default:
                elements = document.querySelectorAll(`.${elementType}`);
        }
        
        // Apply effects to elements
        elements.forEach((element, index) => {
            this.applyElementEffect(element, effectConfig, index, options);
        });
    }
    
    /**
     * APPLY INDIVIDUAL ELEMENT EFFECT
     */
    applyElementEffect(element, effectConfig, index, options) {
        Object.entries(effectConfig).forEach(([property, value]) => {
            const delay = (effectConfig.delay || 0) + (effectConfig.stagger || 0) * index;
            const duration = effectConfig.duration || 300;
            
            setTimeout(() => {
                if (Array.isArray(value)) {
                    // Keyframe animation
                    this.animateElementKeyframes(element, property, value, duration);
                } else if (typeof value === 'object' && value.pattern) {
                    // Continuous pattern animation
                    this.startContinuousAnimation(element, property, value);
                } else {
                    // Simple property change
                    this.animateElementProperty(element, property, value, duration);
                }
            }, delay);
        });
    }
    
    /**
     * ANIMATE CSS VARIABLE
     */
    animateCSSVariable(cssVar, targetValue, duration) {
        if (Array.isArray(targetValue)) {
            // Keyframe animation for CSS variable
            this.animateCSSVariableKeyframes(cssVar, targetValue, duration);
        } else {
            // Simple transition
            const startValue = parseFloat(this.cssVariables[cssVar]) || 0;
            const endValue = targetValue;
            
            this.tweenValue(startValue, endValue, duration, (currentValue) => {
                this.cssVariables[cssVar] = currentValue;
                document.documentElement.style.setProperty(cssVar, currentValue);
            });
        }
    }
    
    /**
     * ANIMATE ELEMENT PROPERTY
     */
    animateElementProperty(element, property, value, duration) {
        switch(property) {
            case 'scale':
                element.style.transform = `scale(${value})`;
                break;
            case 'opacity':
                element.style.opacity = value;
                break;
            case 'blur':
                element.style.filter = `blur(${value}px)`;
                break;
            case 'glow':
                element.style.boxShadow = `0 0 ${value * 30}px rgba(0, 255, 255, ${value})`;
                break;
            case 'dimensional':
                const currentDepth = parseFloat(this.cssVariables['--dimensional-depth']) || 3.5;
                const newDepth = currentDepth + value;
                element.style.transform += ` translateZ(${value * 10}px)`;
                break;
            // Add more property mappings as needed
        }
        
        element.style.transition = `all ${duration}ms ease-out`;
    }
    
    /**
     * UTILITY FUNCTIONS
     */
    getAllElements() {
        return Array.from(document.querySelectorAll('.blog-card, .visualizer-board, .card-visualizer'));
    }
    
    getAllElementsExcept(excludeElement) {
        return this.getAllElements().filter(el => el !== excludeElement);
    }
    
    getNeighborElements(targetElement) {
        // Get elements that are spatially close to target
        // Implementation would depend on layout structure
        return [];
    }
    
    getDistantElements(targetElement) {
        // Get elements that are spatially distant from target
        // Implementation would depend on layout structure
        return [];
    }
    
    mapPropertyToCSSVariable(property) {
        const mapping = {
            'globalIntensity': '--global-intensity',
            'coherence': '--system-coherence',
            'backgroundDim': '--background-dim',
            'portalIntensity': '--portal-intensity',
            'realityTear': '--reality-tear',
            'chaosIntensity': '--chaos-intensity',
            'microChaos': '--micro-chaos',
            'tensionIntensity': '--tension-intensity',
            'dimensionalDepth': '--dimensional-depth',
            'quantumCoherence': '--quantum-coherence',
            'entanglementField': '--entanglement-field'
        };
        
        return mapping[property];
    }
    
    /**
     * TWEEN UTILITY
     */
    tweenValue(start, end, duration, callback) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = start + (end - start) * eased;
            
            callback(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * CREATE INTUITIVE PRESET COMBINATIONS
     */
    createPresetCombination(name, presets, timing = {}) {
        this.effectPresets[name] = {
            level: this.effectLevels.SYSTEM,
            description: `Combination preset: ${presets.join(' + ')}`,
            combination: true,
            presets: presets,
            timing: timing
        };
    }
    
    /**
     * AGENT-FRIENDLY PRESET CREATION API
     */
    createCustomPreset(name, config) {
        this.effectPresets[name] = {
            level: config.level || this.effectLevels.ELEMENT,
            description: config.description || `Custom preset: ${name}`,
            effects: config.effects,
            custom: true
        };
        
        console.log(`🎨 Custom preset '${name}' created`);
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.VIB3UnifiedEffectsSystem = VIB3UnifiedEffectsSystem;
    console.log('🌊 VIB3 Unified Effects System loaded');
}