/**
 * VIB34D CENTRAL STATE MANAGER
 * 
 * Central orchestration system for total environment reactivity.
 * Manages all visualizer states with user event-driven parameter cascading.
 * 
 * INTEGRATES WITH WORKING CORE ARCHITECTURE:
 * - Uses HypercubeCore instances for each visualizer
 * - Leverages ShaderManager for uniform updates
 * - Follows GeometryManager/ProjectionManager patterns
 * - Maintains Working Core parameter validation system
 * 
 * KEY PRINCIPLES:
 * - Focused elements get MORE (zoom in, increase parameters)
 * - Non-focused elements get LESS (zoom out, decrease parameters) 
 * - All movements are coordinated through central authority
 * - Parameters follow VIB3_COMPLETE_PARAMETER_CODEX system
 */

class VIB34DCentralStateManager {
    constructor() {
        console.log('🎯 VIB34D Central State Manager Initializing...');
        
        // Check for Working Core Architecture availability
        if (!window.VIB34D_WorkingCore) {
            console.error('❌ VIB34D Working Core Architecture not found! Load VIB34D_WORKING_CORE_ARCHITECTURE.js first');
            throw new Error('Missing VIB34D Working Core dependency');
        }
        
        // Reference to Working Core classes
        this.WorkingCore = window.VIB34D_WorkingCore;
        
        // Core state tracking
        this.visualizers = new Map(); // HypercubeCore instances by ID
        this.globalState = {
            focusedElement: null,
            interactionType: 'idle',
            interactionIntensity: 0.0,
            lastActivity: Date.now(),
            mousePosition: { x: 0.5, y: 0.5 },
            scrollVelocity: 0.0,
            totalEnvironmentMode: true // Master switch for coordinated reactions
        };
        
        // Parameter system matching Working Core ShaderManager uniform definitions
        this.baseParameters = {
            // Core Mathematics & Timing (4 uniforms)
            u_resolution: [1920, 1080],
            u_time: 0.0,
            u_mouse: [0.5, 0.5],
            u_dimension: 4.0,           // 3.0→5.0 (3D to 4D+ hypercube)
            
            // Grid & Lattice Parameters (4 uniforms)
            u_gridDensity: 8.0,         // 1.0→25.0 (lattice density)
            u_lineThickness: 0.03,      // 0.002→0.1 (line width)
            u_universeModifier: 1.0,    // 0.3→2.5 (universe scaling power)
            u_patternIntensity: 1.3,    // 0.0→3.0 (overall brightness/contrast)
            
            // Morphing & Animation (2 uniforms)
            u_morphFactor: 0.7,         // 0.0→1.5 (morph intensity)
            u_rotationSpeed: 0.5,       // 0.0→3.0 (4D rotation speed)
            
            // Geometry-Specific Parameters (3 uniforms)
            u_shellWidth: 0.025,        // 0.005→0.08 (shell thickness)
            u_tetraThickness: 0.035,    // 0.003→0.1 (plane thickness)
            u_glitchIntensity: 0.02,    // 0.0→0.15 (RGB glitch amount)
            
            // Color & Effects (1 uniform)
            u_colorShift: 0.0,          // -1.0→1.0 (hue rotation)
            
            // Interaction Reactivity (3 uniforms) - replaces audio
            u_audioBass: 0.0,           // 0.0→1.0 (primary interaction intensity)
            u_audioMid: 0.0,            // 0.0→1.0 (secondary modulation)
            u_audioHigh: 0.0            // 0.0→1.0 (detail/effect level)
        };
        
        // Focus modifiers for total environment reactions
        this.focusModifiers = {
            focused: {
                scale: 1.4,             // Focused elements get bigger
                intensity: 1.6,         // Higher parameter multiplier
                priority: 1.0           // Full attention
            },
            adjacent: {
                scale: 0.9,             // Adjacent elements slightly smaller
                intensity: 0.8,         // Reduced parameters
                priority: 0.6           // Moderate attention
            },
            distant: {
                scale: 0.7,             // Distant elements much smaller
                intensity: 0.4,         // Minimal parameters
                priority: 0.2           // Background attention
            }
        };
        
        // Event-to-parameter mapping system (using proper uniform names)
        this.eventMappings = {
            hover: {
                u_morphFactor: { base: 1.2, decay: 0.95 },
                u_gridDensity: { base: 1.3, decay: 0.98 },
                u_audioBass: { base: 0.4, decay: 0.9 }
            },
            click: {
                u_morphFactor: { base: 1.8, decay: 0.85 },
                u_patternIntensity: { base: 2.0, decay: 0.9 },
                u_glitchIntensity: { base: 4.0, decay: 0.8 },
                u_audioBass: { base: 1.0, decay: 0.85 }
            },
            scroll: {
                u_rotationSpeed: { base: 1.5, decay: 0.95 },
                u_dimension: { base: 1.2, decay: 0.98 },
                u_audioMid: { base: 0.6, decay: 0.92 }
            },
            drag: {
                u_dimension: { base: 1.4, decay: 0.9 },
                u_universeModifier: { base: 1.6, decay: 0.88 },
                u_audioHigh: { base: 0.8, decay: 0.85 }
            },
            keypress: {
                u_glitchIntensity: { base: 3.0, decay: 0.75 },
                u_colorShift: { base: 2.0, decay: 0.8 },
                u_audioHigh: { base: 0.9, decay: 0.8 }
            }
        };
        
        // Active parameter modifiers (for smooth transitions)
        this.activeModifiers = new Map(); // visualizerID -> { parameter: { value, decay } }
        
        this.initializeEventListeners();
        this.startUpdateLoop();
        
        console.log('✅ VIB34D Central State Manager Ready');
    }
    
    /**
     * Register a visualizer with the central system
     * Can accept either a HypercubeCore instance or canvas + config for creation
     */
    registerVisualizer(visualizerID, visualizerOrCanvas, config = {}) {
        console.log(`📝 Registering visualizer: ${visualizerID}`);
        
        let hypercubeCore;
        
        // Check if we received a HypercubeCore instance or need to create one
        if (visualizerOrCanvas instanceof this.WorkingCore.HypercubeCore) {
            hypercubeCore = visualizerOrCanvas;
        } else if (visualizerOrCanvas instanceof HTMLCanvasElement) {
            // Create HypercubeCore instance using Phase 1 architecture
            try {
                hypercubeCore = new this.WorkingCore.HypercubeCore(visualizerOrCanvas, {
                    enableDebug: false,
                    geometryType: config.geometry || 'hypercube',
                    projectionMethod: config.projection || 'perspective'
                });
            } catch (error) {
                console.error(`❌ Failed to create HypercubeCore for ${visualizerID}:`, error);
                return false;
            }
        } else {
            console.error(`❌ Invalid visualizer instance for ${visualizerID}. Expected HypercubeCore or Canvas element.`);
            return false;
        }
        
        this.visualizers.set(visualizerID, {
            hypercubeCore: hypercubeCore,
            config: {
                position: config.position || { x: 0.5, y: 0.5 },
                geometry: config.geometry || 'hypercube',
                projection: config.projection || 'perspective',
                role: config.role || 'content', // background, content, highlight, accent
                reactivityLevel: config.reactivityLevel || 1.0
            },
            currentParameters: { ...this.baseParameters },
            focusState: 'distant', // focused, adjacent, distant
            lastUpdate: Date.now()
        });
        
        // Initialize modifier tracking
        this.activeModifiers.set(visualizerID, new Map());
        
        // Start the HypercubeCore animation
        try {
            hypercubeCore.start();
            console.log(`🎬 Started HypercubeCore for ${visualizerID}`);
        } catch (error) {
            console.error(`❌ Failed to start HypercubeCore for ${visualizerID}:`, error);
        }
        
        console.log(`✅ Visualizer ${visualizerID} registered with HypercubeCore`);
        return true;
    }
    
    /**
     * Handle user events and trigger coordinated reactions
     */
    handleUserEvent(eventType, eventData = {}) {
        console.log(`🎮 User Event: ${eventType}`, eventData);
        
        // Update global state
        this.globalState.interactionType = eventType;
        this.globalState.lastActivity = Date.now();
        
        // Determine focus target
        const focusTarget = eventData.targetID || this.determineFocusTarget(eventData);
        
        if (focusTarget !== this.globalState.focusedElement) {
            this.updateFocusState(focusTarget);
        }
        
        // Apply event-specific parameter modifications
        this.applyEventParameters(eventType, eventData);
        
        // Update all visualizers with coordinated reactions
        this.updateAllVisualizers();
        
        // Update global indicators
        this.updateGlobalIndicators();
    }
    
    /**
     * Determine which visualizer should be focused based on event data
     */
    determineFocusTarget(eventData) {
        if (eventData.mousePosition) {
            this.globalState.mousePosition = eventData.mousePosition;
            
            // Find closest visualizer to mouse position
            let closestID = null;
            let closestDistance = Infinity;
            
            this.visualizers.forEach((viz, id) => {
                const pos = viz.config.position;
                const distance = Math.sqrt(
                    Math.pow(pos.x - eventData.mousePosition.x, 2) +
                    Math.pow(pos.y - eventData.mousePosition.y, 2)
                );
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestID = id;
                }
            });
            
            return closestID;
        }
        
        return this.globalState.focusedElement; // Keep current focus
    }
    
    /**
     * Update focus state and calculate proximity-based reactions
     */
    updateFocusState(newFocusTarget) {
        this.globalState.focusedElement = newFocusTarget;
        
        if (!newFocusTarget) {
            // No focus - all elements return to base state
            this.visualizers.forEach((viz, id) => {
                viz.focusState = 'distant';
            });
            return;
        }
        
        const focusedViz = this.visualizers.get(newFocusTarget);
        if (!focusedViz) return;
        
        const focusPos = focusedViz.config.position;
        
        // Calculate proximity for all visualizers
        this.visualizers.forEach((viz, id) => {
            if (id === newFocusTarget) {
                viz.focusState = 'focused';
                return;
            }
            
            const distance = Math.sqrt(
                Math.pow(viz.config.position.x - focusPos.x, 2) +
                Math.pow(viz.config.position.y - focusPos.y, 2)
            );
            
            // Proximity-based focus assignment
            if (distance < 0.3) {
                viz.focusState = 'adjacent';
            } else {
                viz.focusState = 'distant';
            }
        });
        
        console.log(`🎯 Focus updated: ${newFocusTarget} (${this.visualizers.size} visualizers affected)`);
    }
    
    /**
     * Apply event-specific parameter modifications
     */
    applyEventParameters(eventType, eventData) {
        const mapping = this.eventMappings[eventType];
        if (!mapping) return;
        
        // Apply to focused visualizer with full intensity
        if (this.globalState.focusedElement) {
            this.applyParameterModifiers(this.globalState.focusedElement, mapping, 1.0);
        }
        
        // Apply to adjacent visualizers with reduced intensity
        this.visualizers.forEach((viz, id) => {
            if (viz.focusState === 'adjacent') {
                this.applyParameterModifiers(id, mapping, 0.6);
            } else if (viz.focusState === 'distant') {
                this.applyParameterModifiers(id, mapping, 0.3);
            }
        });
        
        // Handle specific event data
        if (eventType === 'scroll' && eventData.velocity) {
            this.globalState.scrollVelocity = eventData.velocity;
        }
        
        if (eventData.intensity) {
            this.globalState.interactionIntensity = eventData.intensity;
        }
    }
    
    /**
     * Apply parameter modifiers to a specific visualizer
     */
    applyParameterModifiers(visualizerID, mapping, intensityMultiplier) {
        const modifiers = this.activeModifiers.get(visualizerID);
        if (!modifiers) return;
        
        Object.keys(mapping).forEach(param => {
            const config = mapping[param];
            const currentModifier = modifiers.get(param) || { value: 1.0, decay: 1.0 };
            
            // Apply new modifier with intensity multiplication
            const newValue = config.base * intensityMultiplier;
            modifiers.set(param, {
                value: Math.max(currentModifier.value, newValue),
                decay: config.decay
            });
        });
    }
    
    /**
     * Update all visualizers with current parameters and focus states
     */
    updateAllVisualizers() {
        this.visualizers.forEach((viz, id) => {
            const focusModifier = this.focusModifiers[viz.focusState];
            const modifiers = this.activeModifiers.get(id);
            
            // Calculate effective parameters
            const effectiveParams = { ...this.baseParameters };
            
            // Apply parameter modifiers
            modifiers.forEach((modifier, param) => {
                if (effectiveParams.hasOwnProperty(param)) {
                    effectiveParams[param] *= modifier.value;
                }
            });
            
            // Apply focus-based scaling
            effectiveParams.u_morphFactor *= focusModifier.intensity;
            effectiveParams.u_gridDensity *= focusModifier.intensity;
            effectiveParams.u_patternIntensity *= focusModifier.intensity;
            
            // Apply inverse scaling for non-focused elements
            if (viz.focusState !== 'focused') {
                effectiveParams.u_rotationSpeed *= focusModifier.intensity;
                effectiveParams.u_dimension = this.baseParameters.u_dimension + 
                    (this.baseParameters.u_dimension - 3.0) * (focusModifier.intensity - 1.0);
            }
            
            // Update interaction levels based on focus state
            effectiveParams.u_audioBass = this.globalState.interactionIntensity * focusModifier.priority;
            effectiveParams.u_audioMid = this.globalState.interactionIntensity * focusModifier.priority * 0.8;
            effectiveParams.u_audioHigh = this.globalState.interactionIntensity * focusModifier.priority * 0.6;
            
            // Clamp parameters to valid ranges
            this.clampParameters(effectiveParams);
            
            // Update visualizer if parameters changed
            if (this.parametersChanged(viz.currentParameters, effectiveParams)) {
                // Use HypercubeCore.updateParameters() for proper Phase 1 integration
                viz.hypercubeCore.updateParameters(effectiveParams);
                viz.currentParameters = { ...effectiveParams };
                viz.lastUpdate = Date.now();
            }
        });
    }
    
    /**
     * Clamp parameters to valid ranges using Phase 1 ShaderManager validation
     */
    clampParameters(params) {
        // Use Phase 1 ShaderManager uniform definitions for proper validation
        const dummyCanvas = document.createElement('canvas');
        const gl = dummyCanvas.getContext('webgl');
        if (!gl) return; // Skip validation if WebGL unavailable
        
        // Create temporary managers for parameter validation
        const tempGeometryManager = new this.WorkingCore.GeometryManager();
        const tempProjectionManager = new this.WorkingCore.ProjectionManager();
        const tempShaderManager = new this.WorkingCore.ShaderManager(gl, tempGeometryManager, tempProjectionManager);
        
        // Define Working Core uniform parameter ranges based on shader specifications
        const uniformRanges = {
            u_time: [0.0, Infinity],
            u_dimension: [3.0, 4.0],
            u_morphFactor: [0.0, 1.5],
            u_rotationSpeed: [0.0, 5.0],
            u_universeModifier: [0.1, 3.0],
            u_patternIntensity: [0.0, 2.0],
            u_gridDensity: [0.1, 50.0],
            u_lineThickness: [0.001, 0.5],
            u_shellWidth: [0.001, 0.5],
            u_tetraThickness: [0.001, 0.5],
            u_glitchIntensity: [0.0, 1.0],
            u_colorShift: [-1.0, 1.0],
            u_audioBass: [0.0, 1.0],    // Used for interaction intensity mapping
            u_audioMid: [0.0, 1.0],     // Used for focus state intensity  
            u_audioHigh: [0.0, 1.0]     // Used for user event reactivity
        };
        
        // Apply range validation using Working Core uniform definitions
        Object.keys(params).forEach(key => {
            const range = uniformRanges[key];
            if (range && typeof params[key] === 'number') {
                params[key] = Math.max(range[0], Math.min(range[1], params[key]));
            }
        });
        
        // Temporary managers will be garbage collected automatically
    }
    
    /**
     * Check if parameters have meaningfully changed
     */
    parametersChanged(oldParams, newParams) {
        const threshold = 0.001;
        return Object.keys(newParams).some(key => 
            Math.abs((oldParams[key] || 0) - newParams[key]) > threshold
        );
    }
    
    /**
     * Initialize global event listeners
     */
    initializeEventListeners() {
        // Global mouse movement
        document.addEventListener('mousemove', (e) => {
            const mousePos = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - (e.clientY / window.innerHeight)
            };
            
            this.handleUserEvent('hover', { mousePosition: mousePos });
        });
        
        // Global click events
        document.addEventListener('click', (e) => {
            this.handleUserEvent('click', { intensity: 1.0 });
        });
        
        // Scroll events with velocity tracking
        let lastScrollTime = Date.now();
        let lastScrollY = window.scrollY;
        
        document.addEventListener('scroll', () => {
            const now = Date.now();
            const deltaTime = now - lastScrollTime;
            const deltaY = window.scrollY - lastScrollY;
            const velocity = Math.abs(deltaY) / Math.max(deltaTime, 1);
            
            this.handleUserEvent('scroll', { 
                velocity: Math.min(velocity / 10, 1.0),
                direction: deltaY > 0 ? 'down' : 'up'
            });
            
            lastScrollTime = now;
            lastScrollY = window.scrollY;
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleUserEvent('keypress', { 
                key: e.key,
                intensity: 0.8
            });
        });
        
        // Inactivity detection
        this.inactivityTimer = null;
        this.resetInactivityTimer();
    }
    
    /**
     * Reset inactivity timer
     */
    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        this.inactivityTimer = setTimeout(() => {
            this.handleUserEvent('idle', {});
        }, 3000); // 3 seconds of inactivity
    }
    
    /**
     * Main update loop for parameter decay and smooth transitions
     */
    startUpdateLoop() {
        const update = () => {
            const now = Date.now();
            let needsUpdate = false;
            
            // Decay active modifiers
            this.activeModifiers.forEach((modifiers, visualizerID) => {
                modifiers.forEach((modifier, param) => {
                    if (modifier.value > 1.0) {
                        modifier.value *= modifier.decay;
                        if (modifier.value < 1.001) {
                            modifier.value = 1.0;
                        }
                        needsUpdate = true;
                    }
                });
            });
            
            // Update interaction intensity decay
            if (this.globalState.interactionIntensity > 0.0) {
                this.globalState.interactionIntensity *= 0.98;
                if (this.globalState.interactionIntensity < 0.01) {
                    this.globalState.interactionIntensity = 0.0;
                }
                needsUpdate = true;
            }
            
            // Update scroll velocity decay
            if (this.globalState.scrollVelocity > 0.0) {
                this.globalState.scrollVelocity *= 0.95;
                if (this.globalState.scrollVelocity < 0.01) {
                    this.globalState.scrollVelocity = 0.0;
                }
                needsUpdate = true;
            }
            
            // Apply updates if needed
            if (needsUpdate) {
                this.updateAllVisualizers();
            }
            
            requestAnimationFrame(update);
        };
        
        update();
    }
    
    /**
     * Update global indicators in the UI
     */
    updateGlobalIndicators() {
        // Update interaction indicator if it exists
        const interactionEl = document.getElementById('interactionType');
        if (interactionEl) {
            interactionEl.textContent = this.globalState.interactionType;
        }
        
        // Update mouse position if it exists
        const mousePosEl = document.getElementById('mousePos');
        if (mousePosEl) {
            const pos = this.globalState.mousePosition;
            mousePosEl.textContent = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}`;
        }
        
        // Update focus indicator
        const focusEl = document.getElementById('focusedElement');
        if (focusEl) {
            focusEl.textContent = this.globalState.focusedElement || 'None';
        }
    }
    
    /**
     * Get current state for debugging
     */
    getDebugState() {
        return {
            globalState: this.globalState,
            visualizerCount: this.visualizers.size,
            activeModifiers: Array.from(this.activeModifiers.keys()).map(id => ({
                id,
                modifierCount: this.activeModifiers.get(id).size
            }))
        };
    }
    
    /**
     * Enable/disable total environment reactions
     */
    setTotalEnvironmentMode(enabled) {
        this.globalState.totalEnvironmentMode = enabled;
        console.log(`🌍 Total Environment Mode: ${enabled ? 'Enabled' : 'Disabled'}`);
    }
}

// Export for global usage
window.VIB34DCentralStateManager = VIB34DCentralStateManager;

console.log('✅ VIB34D Central State Manager loaded');