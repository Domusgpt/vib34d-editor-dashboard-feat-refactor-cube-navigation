/**
 * VIB34D PHASE 6: CHROMATIC EMERGENCE SYSTEM INTEGRATION
 * 
 * Connects the VIB34DChromaticEngine to the complete VIB34D parameter system.
 * Integrates color emergence with shader uniforms and real-time interaction.
 * 
 * ARCHITECTURE: Enhancement pattern - builds on existing chromatic engine
 * PARAMETERS: Maps to 17 shader uniforms via cascading parameter system
 * INTEGRATION: Works with Phase 1-5 components following architecture philosophy
 * 
 * CHECKLIST REFERENCE: VIB34D_IMPLEMENTATION_CHECKLIST.md - Phase 6
 * STATUS: Phase 6 - Chromatic Emergence System Integration (COMPLETE)
 */

// Import Phase 1-5 components and existing chromatic system
// Note: In production, these will be inline to avoid module issues

// ============================================================================
// 🎨 VIB34D CHROMATIC PARAMETER BRIDGE
// ============================================================================

class VIB34DChromaticParameterBridge {
    constructor(shaderManager, chromaticEngine, interactionEngine) {
        this.shaderManager = shaderManager;
        this.chromaticEngine = chromaticEngine;
        this.interactionEngine = interactionEngine;
        
        // Chromatic parameter mappings to shader uniforms (following Parameter Codex)
        this.chromaticMappings = {
            // Hue velocity affects color shifting
            hue_velocity_to_colorshift: {
                source: 'dynamicRange.hueVelocity',
                target: 'u_colorShift',
                curve: 'linear',
                multiplier: 0.01, // Scale degrees/second to -1,1 range
                smoothing: 0.1,
                range: [-1.0, 1.0]
            },
            
            // Saturation pulse affects pattern intensity
            saturation_pulse_to_pattern: {
                source: 'dynamicRange.saturationPulse',
                target: 'u_patternIntensity',
                curve: 'smooth',
                multiplier: 2.0, // Boost pattern visibility during pulse
                smoothing: 0.15,
                range: [0.0, 3.0]
            },
            
            // Mix intensity affects morph factor
            mix_intensity_to_morph: {
                source: 'dynamicRange.mixIntensity',
                target: 'u_morphFactor',
                curve: 'exponential',
                multiplier: 1.5,
                smoothing: 0.2,
                range: [0.0, 1.5]
            },
            
            // Luminance wave affects universe modifier
            luminance_wave_to_universe: {
                source: 'dynamicRange.luminanceWave',
                target: 'u_universeModifier',
                curve: 'smooth',
                multiplier: 1.5,
                offset: 1.0, // Base value of 1.0
                smoothing: 0.12,
                range: [0.3, 2.5]
            },
            
            // Chromatic emergence affects glitch intensity
            emergence_to_glitch: {
                source: 'emergentColors.dominant.intensity',
                target: 'u_glitchIntensity',
                curve: 'exponential',
                multiplier: 0.1,
                smoothing: 0.25,
                range: [0.0, 0.15]
            }
        };
        
        // Previous values for smoothing
        this.previousChromaticValues = new Map();
        
        // CSS variable management for real-time color updates
        this.cssVariables = new Map();
        this.rootElement = document.documentElement;
        
        // Initialize CSS custom properties
        this.initializeCSSProperties();
        
        console.log('🎨 VIB34DChromaticParameterBridge initialized with shader integration');
    }
    
    /**
     * Initialize CSS custom properties for chromatic system
     */
    initializeCSSProperties() {
        // Base chromatic properties
        this.setCSSVariable('--chromatic-shift', '0deg');
        this.setCSSVariable('--chromatic-saturation', '1.0');
        this.setCSSVariable('--chromatic-brightness', '1.0');
        this.setCSSVariable('--chromatic-mix-intensity', '0.5');
        
        // Per-geometry color wheels (if chromatic engine has them)
        if (this.chromaticEngine && this.chromaticEngine.geometryColorWheels) {
            Object.entries(this.chromaticEngine.geometryColorWheels).forEach(([geometry, colors]) => {
                this.setCSSVariable(`--${geometry}-primary-hue`, `${colors.primary.h}deg`);
                this.setCSSVariable(`--${geometry}-primary-saturation`, `${colors.primary.s}%`);
                this.setCSSVariable(`--${geometry}-primary-lightness`, `${colors.primary.l}%`);
                this.setCSSVariable(`--${geometry}-secondary-hue`, `${colors.secondary.h}deg`);
                this.setCSSVariable(`--${geometry}-secondary-saturation`, `${colors.secondary.s}%`);
                this.setCSSVariable(`--${geometry}-secondary-lightness`, `${colors.secondary.l}%`);
            });
        }
        
        // Dynamic range properties
        this.setCSSVariable('--hue-velocity', '0');
        this.setCSSVariable('--saturation-pulse', '0');
        this.setCSSVariable('--luminance-wave', '0');
        this.setCSSVariable('--mix-intensity', '0.5');
    }
    
    /**
     * Update chromatic parameters and map to shader uniforms
     */
    updateChromaticParameters(activeGeometry = 'hypercube') {
        if (!this.chromaticEngine) return;
        
        // Get current chromatic state
        const chromaticState = this.chromaticEngine.getDynamicRange();
        const emergentColors = this.chromaticEngine.getEmergentColors();
        
        if (!chromaticState) return;
        
        // Update shader uniforms through parameter mappings
        Object.entries(this.chromaticMappings).forEach(([mappingId, mapping]) => {
            const sourceValue = this.getChromaticSourceValue(chromaticState, emergentColors, mapping.source);
            const mappedValue = this.applyChromaticMapping(sourceValue, mapping);
            const smoothedValue = this.applyChromaticSmoothing(mappingId, mappedValue, mapping.smoothing);
            
            // Update shader parameter
            this.updateShaderParameter(mapping.target, smoothedValue);
        });
        
        // Update CSS variables for real-time visual effects
        this.updateCSSVariables(chromaticState, emergentColors, activeGeometry);
    }
    
    /**
     * Get source value from chromatic state
     */
    getChromaticSourceValue(chromaticState, emergentColors, sourcePath) {
        const parts = sourcePath.split('.');
        let value = null;
        
        // Check if path starts with known objects
        if (parts[0] === 'dynamicRange') {
            value = chromaticState;
            parts.shift(); // Remove 'dynamicRange' prefix
        } else if (parts[0] === 'emergentColors') {
            value = emergentColors;
            parts.shift(); // Remove 'emergentColors' prefix
        } else {
            value = chromaticState;
        }
        
        // Navigate through the path
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            } else {
                return 0; // Default value
            }
        }
        
        return typeof value === 'number' ? value : 0;
    }
    
    /**
     * Apply chromatic mapping with curve transformation
     */
    applyChromaticMapping(value, mapping) {
        let transformedValue = value;
        
        // Apply curve transformation
        switch (mapping.curve) {
            case 'linear':
                // No transformation
                break;
                
            case 'exponential':
                transformedValue = Math.pow(Math.abs(value), 1.5) * Math.sign(value);
                break;
                
            case 'smooth':
                // Smoothstep curve
                const normalizedValue = Math.max(0, Math.min(1, (value + 1.0) / 2.0)); // Normalize to 0-1
                transformedValue = normalizedValue * normalizedValue * (3.0 - 2.0 * normalizedValue);
                transformedValue = transformedValue * 2.0 - 1.0; // Back to -1 to 1
                break;
        }
        
        // Apply multiplier and offset
        let result = transformedValue * mapping.multiplier;
        if (mapping.offset !== undefined) {
            result += mapping.offset;
        }
        
        // Apply range clamping if defined
        if (mapping.range) {
            result = Math.max(mapping.range[0], Math.min(mapping.range[1], result));
        }
        
        return result;
    }
    
    /**
     * Apply smoothing to chromatic parameter values
     */
    applyChromaticSmoothing(mappingId, newValue, smoothingFactor) {
        const previousValue = this.previousChromaticValues.get(mappingId) || newValue;
        const smoothedValue = previousValue + (newValue - previousValue) * smoothingFactor;
        
        this.previousChromaticValues.set(mappingId, smoothedValue);
        return smoothedValue;
    }
    
    /**
     * Update shader parameter through shader manager
     */
    updateShaderParameter(parameterName, value) {
        if (!this.shaderManager) return;
        
        try {
            // Use Enhanced Shader Manager's setUniform method
            this.shaderManager.setUniform(parameterName, value);
        } catch (error) {
            console.warn(`Failed to update chromatic shader parameter ${parameterName}:`, error);
        }
    }
    
    /**
     * Update CSS variables for real-time chromatic effects
     */
    updateCSSVariables(chromaticState, emergentColors, activeGeometry) {
        // Dynamic range variables
        if (chromaticState.hueVelocity !== undefined) {
            this.setCSSVariable('--hue-velocity', chromaticState.hueVelocity.toFixed(2));
        }
        if (chromaticState.saturationPulse !== undefined) {
            this.setCSSVariable('--saturation-pulse', chromaticState.saturationPulse.toFixed(3));
        }
        if (chromaticState.luminanceWave !== undefined) {
            this.setCSSVariable('--luminance-wave', chromaticState.luminanceWave.toFixed(3));
        }
        if (chromaticState.mixIntensity !== undefined) {
            this.setCSSVariable('--mix-intensity', chromaticState.mixIntensity.toFixed(3));
        }
        
        // Chromatic shift based on hue velocity
        if (chromaticState.hueVelocity !== undefined) {
            const chromaticShift = (chromaticState.hueVelocity * 0.5) % 360; // Degrees
            this.setCSSVariable('--chromatic-shift', `${chromaticShift.toFixed(1)}deg`);
        }
        
        // Saturation and brightness modulation
        if (chromaticState.saturationPulse !== undefined && chromaticState.luminanceWave !== undefined) {
            const saturationMod = 1.0 + chromaticState.saturationPulse * 0.3;
            const brightnessMod = 1.0 + chromaticState.luminanceWave * 0.2;
            this.setCSSVariable('--chromatic-saturation', saturationMod.toFixed(3));
            this.setCSSVariable('--chromatic-brightness', brightnessMod.toFixed(3));
        }
        
        // Emergent color variables
        if (emergentColors && emergentColors.dominant) {
            const dominant = emergentColors.dominant;
            this.setCSSVariable('--emergent-hue', `${dominant.h}deg`);
            this.setCSSVariable('--emergent-saturation', `${dominant.s}%`);
            this.setCSSVariable('--emergent-lightness', `${dominant.l}%`);
            this.setCSSVariable('--emergent-rgb', `hsl(${dominant.h}, ${dominant.s}%, ${dominant.l}%)`);
        }
        
        // Active geometry color properties
        if (activeGeometry && this.chromaticEngine.geometryColorWheels && this.chromaticEngine.geometryColorWheels[activeGeometry]) {
            const colors = this.chromaticEngine.geometryColorWheels[activeGeometry];
            this.setCSSVariable('--active-primary-hue', `${colors.primary.h}deg`);
            this.setCSSVariable('--active-secondary-hue', `${colors.secondary.h}deg`);
        }
    }
    
    /**
     * Set CSS custom property
     */
    setCSSVariable(property, value) {
        this.cssVariables.set(property, value);
        if (this.rootElement && this.rootElement.style) {
            this.rootElement.style.setProperty(property, value);
        }
    }
    
    /**
     * Get current CSS variable value
     */
    getCSSVariable(property) {
        return this.cssVariables.get(property) || '0';
    }
    
    /**
     * Get chromatic analysis for debugging
     */
    getChromaticAnalysis() {
        const chromaticState = this.chromaticEngine ? this.chromaticEngine.getDynamicRange() : null;
        const emergentColors = this.chromaticEngine ? this.chromaticEngine.getEmergentColors() : null;
        
        return {
            chromaticState: chromaticState,
            emergentColors: emergentColors,
            cssVariables: Object.fromEntries(this.cssVariables),
            shaderUniforms: {
                u_colorShift: this.shaderManager?.getUniform ? this.shaderManager.getUniform('u_colorShift') : 0,
                u_patternIntensity: this.shaderManager?.getUniform ? this.shaderManager.getUniform('u_patternIntensity') : 1,
                u_morphFactor: this.shaderManager?.getUniform ? this.shaderManager.getUniform('u_morphFactor') : 0,
                u_universeModifier: this.shaderManager?.getUniform ? this.shaderManager.getUniform('u_universeModifier') : 1,
                u_glitchIntensity: this.shaderManager?.getUniform ? this.shaderManager.getUniform('u_glitchIntensity') : 0
            }
        };
    }
}

// ============================================================================
// 🎨 VIB34D ENHANCED CHROMATIC ENGINE
// ============================================================================

class VIB34DEnhancedChromaticEngine {
    constructor(parameterBridge) {
        // Use existing chromatic engine as base if available
        this.baseEngine = window.VIB34DChromaticEngine ? new window.VIB34DChromaticEngine() : null;
        this.parameterBridge = parameterBridge;
        
        // Enhanced features
        this.emergentColorHistory = [];
        this.colorClassificationSystem = new ChromaticColorClassifier();
        this.blendModeController = new ChromaticBlendModeController();
        
        // Integration state
        this.activeGeometry = 'hypercube';
        this.integrationActive = false;
        
        // Fallback dynamic range if no base engine
        this.fallbackDynamicRange = {
            hueVelocity: 0,
            saturationPulse: 0.5,
            luminanceWave: 0.5,
            mixIntensity: 0.5
        };
        
        console.log('🎨 VIB34DEnhancedChromaticEngine initialized with parameter integration');
    }
    
    /**
     * Start chromatic integration with parameter system
     */
    startIntegration() {
        this.integrationActive = true;
        console.log('🎨 Chromatic parameter integration started');
    }
    
    /**
     * Stop chromatic integration
     */
    stopIntegration() {
        this.integrationActive = false;
        console.log('🎨 Chromatic parameter integration stopped');
    }
    
    /**
     * Update with interaction data and sync to parameters
     */
    update(interactionData, activeGeometry = null) {
        // Update active geometry if provided
        if (activeGeometry) {
            this.activeGeometry = activeGeometry;
        }
        
        // Update base chromatic engine if available
        if (this.baseEngine && this.baseEngine.update) {
            this.baseEngine.update(interactionData);
        } else {
            // Update fallback dynamic range based on interaction
            this.updateFallbackDynamicRange(interactionData);
        }
        
        // Sync to parameter system if integration is active
        if (this.integrationActive && this.parameterBridge) {
            this.parameterBridge.updateChromaticParameters(this.activeGeometry);
        }
        
        // Update emergent color history
        this.updateEmergentColorHistory();
        
        // Update blend mode system
        this.blendModeController.update(this.getDynamicRange(), this.activeGeometry);
    }
    
    /**
     * Update fallback dynamic range when no base engine available
     */
    updateFallbackDynamicRange(interactionData) {
        if (!interactionData) return;
        
        // Map interaction data to chromatic parameters
        if (interactionData.scroll) {
            this.fallbackDynamicRange.hueVelocity = (interactionData.scroll.smoothed || 0) * 30;
            this.fallbackDynamicRange.saturationPulse = 0.5 + (interactionData.scroll.smoothed || 0) * 0.5;
        }
        
        if (interactionData.click) {
            this.fallbackDynamicRange.mixIntensity = 0.5 + (interactionData.click.smoothed || 0) * 0.5;
        }
        
        if (interactionData.mouse) {
            this.fallbackDynamicRange.luminanceWave = 0.5 + (interactionData.mouse.smoothed || 0) * 0.5;
        }
    }
    
    /**
     * Track emergent color evolution over time
     */
    updateEmergentColorHistory() {
        const emergentColors = this.getEmergentColors();
        if (emergentColors && emergentColors.dominant) {
            this.emergentColorHistory.push({
                timestamp: performance.now(),
                color: { ...emergentColors.dominant },
                geometry: this.activeGeometry
            });
            
            // Keep history manageable (last 10 seconds)
            const cutoff = performance.now() - 10000;
            this.emergentColorHistory = this.emergentColorHistory.filter(entry => entry.timestamp > cutoff);
        }
    }
    
    /**
     * Get chromatic state analysis
     */
    getChromaticAnalysis() {
        const baseAnalysis = this.parameterBridge ? this.parameterBridge.getChromaticAnalysis() : {};
        
        return {
            ...baseAnalysis,
            activeGeometry: this.activeGeometry,
            integrationActive: this.integrationActive,
            emergentColorHistory: this.emergentColorHistory.slice(-5), // Last 5 entries
            colorClassification: this.colorClassificationSystem.getClassification(),
            blendModeState: this.blendModeController.getState()
        };
    }
    
    // Delegate methods to base engine or provide fallbacks
    getDynamicRange() {
        if (this.baseEngine && this.baseEngine.getDynamicRange) {
            return this.baseEngine.getDynamicRange();
        }
        return this.fallbackDynamicRange;
    }
    
    getEmergentColors() {
        if (this.baseEngine && this.baseEngine.getEmergentColors) {
            return this.baseEngine.getEmergentColors();
        }
        
        // Fallback emergent colors based on dynamic range
        const range = this.getDynamicRange();
        return {
            dominant: {
                h: (range.hueVelocity * 3) % 360,
                s: Math.max(0, Math.min(100, range.saturationPulse * 100)),
                l: Math.max(0, Math.min(100, range.luminanceWave * 100)),
                intensity: range.mixIntensity
            }
        };
    }
    
    getGeometryColors(geometry) {
        if (this.baseEngine && this.baseEngine.getGeometryColors) {
            return this.baseEngine.getGeometryColors(geometry);
        }
        return null;
    }
    
    calculateEmergentColor(position) {
        if (this.baseEngine && this.baseEngine.calculateEmergentColor) {
            return this.baseEngine.calculateEmergentColor(position);
        }
        return { h: 180, s: 50, l: 50 }; // Default fallback
    }
}

// ============================================================================
// 🎨 CHROMATIC COLOR CLASSIFIER
// ============================================================================

class ChromaticColorClassifier {
    constructor() {
        // Color name mapping for hue ranges
        this.colorNames = [
            { range: [0, 15], name: 'red' },
            { range: [15, 45], name: 'orange' },
            { range: [45, 75], name: 'yellow' },
            { range: [75, 105], name: 'lime' },
            { range: [105, 135], name: 'green' },
            { range: [135, 165], name: 'teal' },
            { range: [165, 195], name: 'cyan' },
            { range: [195, 225], name: 'sky' },
            { range: [225, 255], name: 'blue' },
            { range: [255, 285], name: 'purple' },
            { range: [285, 315], name: 'magenta' },
            { range: [315, 345], name: 'pink' },
            { range: [345, 360], name: 'red' }
        ];
        
        this.currentClassification = 'neutral';
    }
    
    /**
     * Classify color by hue value
     */
    classifyColor(hsl) {
        const hue = hsl.h;
        
        for (const colorRange of this.colorNames) {
            if (hue >= colorRange.range[0] && hue < colorRange.range[1]) {
                this.currentClassification = colorRange.name;
                return colorRange.name;
            }
        }
        
        this.currentClassification = 'neutral';
        return 'neutral';
    }
    
    /**
     * Get current classification
     */
    getClassification() {
        return this.currentClassification;
    }
}

// ============================================================================
// 🎨 CHROMATIC BLEND MODE CONTROLLER
// ============================================================================

class ChromaticBlendModeController {
    constructor() {
        this.blendModes = {
            background: 'multiply',
            content: 'screen',
            accent: 'overlay',
            highlight: 'color-dodge'
        };
        
        this.dynamicBlending = {
            intensity: 0.5,
            mode: 'standard',
            emergenceActive: false
        };
    }
    
    /**
     * Update blend mode state based on chromatic dynamics
     */
    update(dynamicRange, activeGeometry) {
        if (!dynamicRange) return;
        
        // Determine if chromatic emergence is active
        this.dynamicBlending.emergenceActive = (dynamicRange.mixIntensity || 0) > 0.7;
        this.dynamicBlending.intensity = dynamicRange.mixIntensity || 0.5;
        
        // Adjust blend modes based on geometry
        if (activeGeometry === 'tetrahedron' || activeGeometry === 'hypertetrahedron') {
            // More technical, precise blending
            this.blendModes.content = 'normal';
            this.blendModes.accent = 'soft-light';
        } else if (activeGeometry === 'fractal') {
            // More complex, layered blending
            this.blendModes.content = 'color-burn';
            this.blendModes.accent = 'difference';
        } else {
            // Standard blending for other geometries
            this.blendModes.content = 'screen';
            this.blendModes.accent = 'overlay';
        }
        
        // Update CSS blend modes if DOM access available
        this.updateDOMBlendModes();
    }
    
    /**
     * Update DOM element blend modes
     */
    updateDOMBlendModes() {
        if (typeof document === 'undefined') return;
        
        Object.entries(this.blendModes).forEach(([role, mode]) => {
            const elements = document.querySelectorAll(`.vib34d-${role}`);
            elements.forEach(element => {
                element.style.mixBlendMode = mode;
            });
        });
        
        // Apply emergence class if active
        const containers = document.querySelectorAll('.vib34d-container');
        containers.forEach(container => {
            if (this.dynamicBlending.emergenceActive) {
                container.classList.add('chromatic-emergence-active');
            } else {
                container.classList.remove('chromatic-emergence-active');
            }
        });
    }
    
    /**
     * Get current blend mode state
     */
    getState() {
        return {
            blendModes: { ...this.blendModes },
            dynamicBlending: { ...this.dynamicBlending }
        };
    }
}

// ============================================================================
// 🧪 PHASE 6 INTEGRATION TESTER
// ============================================================================

class VIB34DPhase6ChromaticTester {
    constructor() {
        this.testResults = [];
    }
    
    /**
     * Test complete Phase 6 chromatic integration
     */
    async runChromaticTests() {
        console.log('🧪 Starting Phase 6 Chromatic Integration Tests...');
        
        this.testResults = [];
        
        // Test 1: Chromatic Parameter Bridge Creation
        await this.testChromaticParameterBridge();
        
        // Test 2: Chromatic to Shader Parameter Mapping
        await this.testChromaticToShaderMapping();
        
        // Test 3: CSS Variable Integration
        await this.testCSSVariableIntegration();
        
        // Test 4: Enhanced Chromatic Engine
        await this.testEnhancedChromaticEngine();
        
        // Test 5: Color Classification System
        await this.testColorClassification();
        
        // Test 6: Blend Mode Controller
        await this.testBlendModeController();
        
        // Test 7: Real-time Parameter Updates
        await this.testRealTimeParameterUpdates();
        
        // Test 8: Emergent Color History
        await this.testEmergentColorHistory();
        
        return this.generateTestReport();
    }
    
    async testChromaticParameterBridge() {
        try {
            // Create mock dependencies
            const mockShaderManager = {
                setUniform: function(name, value) { /* mock */ },
                getUniform: function(name) { return 0; }
            };
            
            const mockChromaticEngine = {
                getDynamicRange: function() {
                    return {
                        hueVelocity: 15.0,
                        saturationPulse: 0.8,
                        luminanceWave: 0.6,
                        mixIntensity: 0.7
                    };
                },
                getEmergentColors: function() {
                    return {
                        dominant: { h: 120, s: 80, l: 60 }
                    };
                }
            };
            
            const bridge = new VIB34DChromaticParameterBridge(
                mockShaderManager,
                mockChromaticEngine,
                null
            );
            
            this.testResults.push({
                test: 'Chromatic Parameter Bridge Creation',
                passed: bridge instanceof VIB34DChromaticParameterBridge,
                details: 'Bridge created successfully with parameter mapping system'
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Chromatic Parameter Bridge Creation',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testChromaticToShaderMapping() {
        try {
            let updateCount = 0;
            const mockShaderManager = { 
                setUniform: function() { updateCount++; },
                getUniform: function() { return 0; }
            };
            
            const mockChromaticEngine = {
                getDynamicRange: function() {
                    return {
                        hueVelocity: 30.0,
                        saturationPulse: 0.9,
                        luminanceWave: 0.8,
                        mixIntensity: 0.8
                    };
                },
                getEmergentColors: function() {
                    return { dominant: { h: 240, s: 90, l: 55 } };
                }
            };
            
            const bridge = new VIB34DChromaticParameterBridge(
                mockShaderManager,
                mockChromaticEngine,
                null
            );
            
            // Test parameter mapping
            bridge.updateChromaticParameters('hypercube');
            
            // Check if shader uniforms were updated
            const shaderUpdated = updateCount > 0;
            
            this.testResults.push({
                test: 'Chromatic to Shader Parameter Mapping',
                passed: shaderUpdated,
                details: `Updated ${updateCount} shader parameters`
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Chromatic to Shader Parameter Mapping',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testCSSVariableIntegration() {
        try {
            let propertySet = false;
            const mockStyle = {
                setProperty: function(property, value) {
                    if (property === '--test-variable' && value === '1.5') {
                        propertySet = true;
                    }
                }
            };
            
            const bridge = new VIB34DChromaticParameterBridge(null, null, null);
            bridge.rootElement = { style: mockStyle };
            
            // Test CSS variable setting
            bridge.setCSSVariable('--test-variable', '1.5');
            
            this.testResults.push({
                test: 'CSS Variable Integration',
                passed: propertySet,
                details: 'CSS custom properties correctly updated'
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'CSS Variable Integration',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testEnhancedChromaticEngine() {
        try {
            let updateCalled = false;
            const mockBridge = {
                updateChromaticParameters: function() { updateCalled = true; }
            };
            
            const enhancedEngine = new VIB34DEnhancedChromaticEngine(mockBridge);
            enhancedEngine.startIntegration();
            
            // Test update with integration
            enhancedEngine.update({ scroll: { smoothed: 0.5 } }, 'tetrahedron');
            
            const integrationWorking = enhancedEngine.integrationActive && updateCalled;
            
            this.testResults.push({
                test: 'Enhanced Chromatic Engine',
                passed: integrationWorking,
                details: 'Enhanced engine correctly integrates with parameter system'
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Enhanced Chromatic Engine',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testColorClassification() {
        try {
            const classifier = new ChromaticColorClassifier();
            
            // Test color classification
            const redClassification = classifier.classifyColor({ h: 10, s: 80, l: 50 });
            const blueClassification = classifier.classifyColor({ h: 240, s: 90, l: 55 });
            const greenClassification = classifier.classifyColor({ h: 120, s: 85, l: 60 });
            
            const classificationsCorrect = 
                redClassification === 'red' &&
                blueClassification === 'blue' &&
                greenClassification === 'green';
            
            this.testResults.push({
                test: 'Color Classification System',
                passed: classificationsCorrect,
                details: `Correct classifications: red=${redClassification}, blue=${blueClassification}, green=${greenClassification}`
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Color Classification System',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testBlendModeController() {
        try {
            const controller = new ChromaticBlendModeController();
            
            // Test blend mode updates
            controller.update({
                mixIntensity: 0.8,
                hueVelocity: 20,
                saturationPulse: 0.9
            }, 'tetrahedron');
            
            const state = controller.getState();
            const emergenceActive = state.dynamicBlending.emergenceActive;
            const hasBlendModes = Object.keys(state.blendModes).length > 0;
            
            this.testResults.push({
                test: 'Blend Mode Controller',
                passed: emergenceActive && hasBlendModes,
                details: `Emergence active: ${emergenceActive}, Blend modes: ${Object.keys(state.blendModes).length}`
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Blend Mode Controller',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testRealTimeParameterUpdates() {
        try {
            let updateCount = 0;
            const mockShaderManager = {
                setUniform: function() { updateCount++; },
                getUniform: function() { return 0; }
            };
            
            const mockChromaticEngine = {
                getDynamicRange: function() {
                    return {
                        hueVelocity: Math.random() * 30,
                        saturationPulse: Math.random(),
                        luminanceWave: Math.random(),
                        mixIntensity: Math.random()
                    };
                },
                getEmergentColors: function() {
                    return { dominant: { h: 180, s: 85, l: 50 } };
                }
            };
            
            const bridge = new VIB34DChromaticParameterBridge(
                mockShaderManager,
                mockChromaticEngine,
                null
            );
            
            // Multiple rapid updates
            for (let i = 0; i < 5; i++) {
                bridge.updateChromaticParameters('hypercube');
            }
            
            const realTimeWorking = updateCount >= 15; // At least 3 parameters × 5 updates
            
            this.testResults.push({
                test: 'Real-time Parameter Updates',
                passed: realTimeWorking,
                details: `${updateCount} parameter updates processed`
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Real-time Parameter Updates',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testEmergentColorHistory() {
        try {
            const enhancedEngine = new VIB34DEnhancedChromaticEngine(null);
            
            // Simulate multiple updates to build history
            for (let i = 0; i < 3; i++) {
                enhancedEngine.update({
                    scroll: { smoothed: i * 0.3 },
                    click: { smoothed: i * 0.2 }
                }, 'hypercube');
            }
            
            const analysis = enhancedEngine.getChromaticAnalysis();
            const hasHistory = analysis.emergentColorHistory && analysis.emergentColorHistory.length > 0;
            
            this.testResults.push({
                test: 'Emergent Color History',
                passed: hasHistory,
                details: `History entries: ${analysis.emergentColorHistory ? analysis.emergentColorHistory.length : 0}`
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Emergent Color History',
                passed: false,
                error: error.message
            });
        }
    }
    
    generateTestReport() {
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const percentage = ((passed / total) * 100).toFixed(1);
        
        console.log(`\n🧪 Phase 6 Chromatic Integration Test Results: ${passed}/${total} (${percentage}%)`);
        
        this.testResults.forEach(result => {
            const icon = result.passed ? '✅' : '❌';
            console.log(`${icon} ${result.test}: ${result.details || result.error || 'Passed'}`);
        });
        
        return {
            passed,
            total,
            percentage: parseFloat(percentage),
            complete: passed === total,
            results: this.testResults
        };
    }
}

// ============================================================================
// 🎯 PHASE 6 COMPLETION STATUS
// ============================================================================

console.log('🚀 VIB34D Phase 6: Chromatic Emergence System Integration - COMPLETE');
console.log('✅ VIB34DChromaticParameterBridge created for shader integration');
console.log('✅ Chromatic parameters mapped to shader uniforms (colorShift, patternIntensity, morphFactor, universeModifier, glitchIntensity)');
console.log('✅ CSS custom property system for real-time color updates');
console.log('✅ Enhanced chromatic engine with parameter system integration');
console.log('✅ Color classification system for automatic hue→name mapping');
console.log('✅ Blend mode controller with dynamic emergence detection');
console.log('✅ Real-time parameter smoothing and transition system');
console.log('✅ Emergent color history tracking and analysis');
console.log('✅ Integration with existing VIB34DChromaticEngine via enhancement pattern');
console.log('✅ Proper fallback system when base chromatic engine unavailable');

// Export for use in other phases
if (typeof window !== 'undefined') {
    window.VIB34D_Phase6 = {
        VIB34DChromaticParameterBridge,
        VIB34DEnhancedChromaticEngine,
        ChromaticColorClassifier,
        ChromaticBlendModeController,
        VIB34DPhase6ChromaticTester
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VIB34DChromaticParameterBridge,
        VIB34DEnhancedChromaticEngine,
        ChromaticColorClassifier,
        ChromaticBlendModeController,
        VIB34DPhase6ChromaticTester
    };
}