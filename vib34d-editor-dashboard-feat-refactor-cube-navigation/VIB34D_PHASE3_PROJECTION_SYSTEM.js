/**
 * VIB34D PHASE 3: PROJECTION SYSTEM IMPLEMENTATION
 * 
 * Implementing the complete 4D→3D projection system with all 3 projection methods:
 * - PerspectiveProjection: Dynamic distance modulation
 * - OrthographicProjection: Orthographic→perspective blending  
 * - StereographicProjection: Pole-based 4D→3D mapping
 * 
 * CHECKLIST REFERENCE: VIB34D_IMPLEMENTATION_CHECKLIST.md - Phase 3
 * STATUS: Phase 3 - Projection System (IN PROGRESS)
 * 
 * BASED ON: VIB3_COMPLETE_PARAMETER_CODEX.md projection specifications
 */

// ============================================================================
// 📐 ENHANCE BASE PROJECTION CLASS (from Phase 1)
// ============================================================================

// Enhanced parameter validation for BaseProjection (Phase 1 enhancement)
if (window.VIB34D_Phase1 && window.VIB34D_Phase1.BaseProjection) {
    // Enhance the existing BaseProjection.prototype with validation
    const BaseProjectionProto = window.VIB34D_Phase1.BaseProjection.prototype;
    
    // Enhanced updateParameters with validation
    BaseProjectionProto.updateParametersWithValidation = function(newParams) {
        const ranges = this.getParameterRanges();
        const validated = {};
        
        for (const [key, value] of Object.entries(newParams)) {
            if (ranges[key]) {
                const range = ranges[key];
                validated[key] = Math.max(range.min, Math.min(range.max, value));
            } else {
                validated[key] = value; // Pass through unknown parameters
            }
        }
        
        Object.assign(this.parameters, validated);
        return validated;
    };
    
    // Enhanced getParameterRanges
    BaseProjectionProto.getParameterRanges = function() {
        return {
            viewDistance: { min: 0.1, max: 10.0, default: 2.5 },
            morphFactor: { min: 0.0, max: 1.5, default: 0.7 },
            audioMid: { min: 0.0, max: 1.0, default: 0.0 },
            audioHigh: { min: 0.0, max: 1.0, default: 0.0 }
        };
    };
    
    // Enhanced getParameters
    BaseProjectionProto.getParameters = function() {
        return { ...this.parameters };
    };
    
    console.log('✅ Enhanced BaseProjection with Phase 3 validation features');
}

// ============================================================================
// 📐 PERSPECTIVE PROJECTION CLASS
// ============================================================================

class PerspectiveProjection extends window.VIB34D_Phase1.BaseProjection {
    constructor(viewDistance = 2.5) {
        super('perspective');
        this.parameters.viewDistance = Math.max(0.1, viewDistance);
    }
    
    /**
     * Enhanced parameter ranges for perspective projection
     */
    getParameterRanges() {
        return {
            ...super.getParameterRanges(),
            perspectiveStrength: { min: 0.1, max: 2.0, default: 1.0 },
            distanceModulation: { min: 0.0, max: 1.0, default: 0.4 }
        };
    }
    
    /**
     * Generate GLSL shader code for perspective projection
     * Based on VIB3_COMPLETE_PARAMETER_CODEX.md specification
     */
    getShaderCode() {
        return `
            vec3 project4Dto3D(vec4 p) {
                // Dynamic distance calculation with morphFactor and audioMid modulation
                float baseDistance = ${this.parameters.viewDistance.toFixed(2)};
                float dynamicDistance = max(0.2, baseDistance * (1.0 + u_morphFactor * 0.4 - u_audioMid * 0.35));
                
                // W-factor calculation for perspective division
                float denominator = dynamicDistance + p.w;
                float w_factor = dynamicDistance / max(0.1, denominator);
                
                // Apply perspective projection
                return p.xyz * w_factor;
            }
        `;
    }
    
    /**
     * Calculate perspective-specific parameters
     */
    calculateDynamicParameters(morphFactor, audioMid) {
        const baseDistance = this.parameters.viewDistance;
        const dynamicDistance = Math.max(0.2, baseDistance * (1.0 + morphFactor * 0.4 - audioMid * 0.35));
        
        return {
            baseDistance,
            dynamicDistance,
            effectiveViewDistance: dynamicDistance
        };
    }
}

// ============================================================================
// 📐 ORTHOGRAPHIC PROJECTION CLASS  
// ============================================================================

class OrthographicProjection extends window.VIB34D_Phase1.BaseProjection {
    constructor() {
        super('orthographic');
        this.parameters.basePerspectiveDistance = 2.5;
    }
    
    /**
     * Enhanced parameter ranges for orthographic projection
     */
    getParameterRanges() {
        return {
            ...super.getParameterRanges(),
            basePerspectiveDistance: { min: 0.2, max: 10.0, default: 2.5 },
            orthographicBlend: { min: 0.0, max: 1.0, default: 0.5 }
        };
    }
    
    /**
     * Generate GLSL shader code for orthographic projection
     * Based on VIB3_COMPLETE_PARAMETER_CODEX.md specification
     */
    getShaderCode() {
        return `
            vec3 project4Dto3D(vec4 p) {
                // Pure orthographic projection (no W division)
                vec3 orthoP = p.xyz;
                
                // Perspective component for blending
                float basePerspectiveDistance = ${this.parameters.basePerspectiveDistance.toFixed(2)};
                float dynamicPerspectiveDistance = max(0.2, basePerspectiveDistance * (1.0 - u_audioMid * 0.4));
                float perspDenominator = dynamicPerspectiveDistance + p.w;
                float persp_w_factor = dynamicPerspectiveDistance / max(0.1, perspDenominator);
                vec3 perspP = p.xyz * persp_w_factor;
                
                // Smooth morphing transition between orthographic and perspective
                float morphT = smoothstep(0.0, 1.0, u_morphFactor);
                
                // Blend orthographic and perspective projections
                return mix(orthoP, perspP, morphT);
            }
        `;
    }
    
    /**
     * Calculate orthographic-specific parameters
     */
    calculateDynamicParameters(morphFactor, audioMid) {
        const basePerspectiveDistance = this.parameters.basePerspectiveDistance;
        const dynamicPerspectiveDistance = Math.max(0.2, basePerspectiveDistance * (1.0 - audioMid * 0.4));
        const morphT = Math.max(0, Math.min(1, morphFactor));
        
        return {
            basePerspectiveDistance,
            dynamicPerspectiveDistance,
            morphTransition: morphT,
            orthographicRatio: 1.0 - morphT,
            perspectiveRatio: morphT
        };
    }
}

// ============================================================================
// 📐 STEREOGRAPHIC PROJECTION CLASS
// ============================================================================

class StereographicProjection extends window.VIB34D_Phase1.BaseProjection {
    constructor(projectionPoleW = -1.5) {
        super('stereographic');
        this.parameters.projectionPoleW = Math.abs(projectionPoleW) < 0.01 ? -1.0 : projectionPoleW;
    }
    
    /**
     * Enhanced parameter ranges for stereographic projection
     */
    getParameterRanges() {
        return {
            ...super.getParameterRanges(),
            projectionPoleW: { min: -5.0, max: 5.0, default: -1.5 },
            stereographicScale: { min: 0.1, max: 3.0, default: 1.0 },
            poleModulation: { min: 0.0, max: 1.0, default: 0.4 }
        };
    }
    
    /**
     * Generate GLSL shader code for stereographic projection
     * Based on VIB3_COMPLETE_PARAMETER_CODEX.md specification
     */
    getShaderCode() {
        return `
            vec3 project4Dto3D(vec4 p) {
                // Dynamic pole position with audioHigh modulation
                float basePoleW = ${this.parameters.projectionPoleW.toFixed(2)};
                float dynamicPoleW = sign(basePoleW) * max(0.1, abs(basePoleW + u_audioHigh * 0.4 * sign(basePoleW)));
                
                // Calculate denominator for stereographic projection
                float denominator = p.w - dynamicPoleW;
                
                vec3 projectedP;
                float epsilon = 0.001;
                
                // Handle division by zero case
                if (abs(denominator) < epsilon) {
                    // Point at infinity - normalize and scale large
                    projectedP = normalize(p.xyz + vec3(epsilon)) * 1000.0;
                } else {
                    // Standard stereographic projection
                    float scale = (-dynamicPoleW) / denominator;
                    projectedP = p.xyz * scale;
                }
                
                // Morphing blend with orthographic projection
                float morphT = smoothstep(0.0, 1.0, u_morphFactor * 0.8);
                vec3 orthoP = p.xyz;
                
                // Blend stereographic with orthographic based on morph factor
                return mix(projectedP, orthoP, morphT);
            }
        `;
    }
    
    /**
     * Calculate stereographic-specific parameters
     */
    calculateDynamicParameters(morphFactor, audioHigh) {
        const basePoleW = this.parameters.projectionPoleW;
        const dynamicPoleW = Math.sign(basePoleW) * Math.max(0.1, 
            Math.abs(basePoleW + audioHigh * 0.4 * Math.sign(basePoleW)));
        const morphT = Math.max(0, Math.min(1, morphFactor * 0.8));
        
        return {
            basePoleW,
            dynamicPoleW,
            poleModulation: audioHigh * 0.4,
            morphTransition: morphT,
            stereographicRatio: 1.0 - morphT,
            orthographicRatio: morphT
        };
    }
    
    /**
     * Check if point is near pole (for special handling)
     */
    isNearPole(wCoordinate, epsilon = 0.001) {
        const dynamicPoleW = this.calculateDynamicParameters(0, 0).dynamicPoleW;
        return Math.abs(wCoordinate - dynamicPoleW) < epsilon;
    }
}

// ============================================================================
// 📐 ENHANCED PROJECTION MANAGER CLASS (from Phase 1)
// ============================================================================

class EnhancedProjectionManager extends window.VIB34D_Phase1.ProjectionManager {
    constructor(options = {}) {
        super(); // Call base ProjectionManager constructor
        
        this.options = {
            defaultProjection: 'perspective',
            enableDebug: false,
            ...options
        };
        
        // Enhanced features for Phase 3
        this.currentProjection = null;
        this.transitionState = {
            isTransitioning: false,
            fromProjection: null,
            toProjection: null,
            progress: 0.0,
            duration: 1000 // ms
        };
        
        this._initDefaultProjections();
        console.log('✅ Enhanced ProjectionManager initialized');
    }
    
    /**
     * Initialize all default projection types
     */
    _initDefaultProjections() {
        // Create and register all three projection types
        this.registerProjection('perspective', new PerspectiveProjection());
        this.registerProjection('orthographic', new OrthographicProjection());
        this.registerProjection('stereographic', new StereographicProjection());
        
        console.log('📐 Registered 3 projection types:', this.getProjectionTypes());
    }
    
    /**
     * Register a projection instance with validation
     */
    registerProjection(name, projectionInstance) {
        const lowerCaseName = name.toLowerCase();
        
        if (!(projectionInstance instanceof window.VIB34D_Phase1.BaseProjection)) {
            console.error(`Invalid projection object for '${lowerCaseName}'. Must extend BaseProjection.`);
            return false;
        }
        
        if (this.projections.has(lowerCaseName)) {
            if (this.options.enableDebug) {
                console.warn(`Overwriting projection '${lowerCaseName}'.`);
            }
        }
        
        this.projections.set(lowerCaseName, projectionInstance);
        console.log(`📐 Registered projection: ${lowerCaseName}`);
        
        // Set as current if it's the first or default
        if (!this.currentProjection || lowerCaseName === this.options.defaultProjection) {
            this.currentProjection = lowerCaseName;
        }
        
        return true;
    }
    
    /**
     * Get a projection instance by name with fallback
     */
    getProjection(name) {
        const lowerCaseName = name ? name.toLowerCase() : this.options.defaultProjection;
        const projection = this.projections.get(lowerCaseName);
        
        if (!projection) {
            console.warn(`Projection '${name}' not found. Using default: ${this.options.defaultProjection}`);
            return this.projections.get(this.options.defaultProjection.toLowerCase());
        }
        
        return projection;
    }
    
    /**
     * Get current active projection
     */
    getCurrentProjection() {
        return this.getProjection(this.currentProjection);
    }
    
    /**
     * Set current active projection with optional smooth transition
     */
    setCurrentProjection(name, smoothTransition = false) {
        const projection = this.getProjection(name);
        if (!projection) {
            return false;
        }
        
        const newProjectionName = name.toLowerCase();
        
        if (smoothTransition && this.currentProjection !== newProjectionName) {
            this.startTransition(this.currentProjection, newProjectionName);
        } else {
            this.currentProjection = newProjectionName;
        }
        
        return true;
    }
    
    /**
     * Start smooth transition between projections
     */
    startTransition(fromProjection, toProjection, duration = 1000) {
        this.transitionState = {
            isTransitioning: true,
            fromProjection,
            toProjection,
            progress: 0.0,
            duration,
            startTime: performance.now()
        };
        
        console.log(`🔄 Starting projection transition: ${fromProjection} → ${toProjection}`);
    }
    
    /**
     * Update transition progress
     */
    updateTransition(currentTime) {
        if (!this.transitionState.isTransitioning) {
            return false;
        }
        
        const elapsed = currentTime - this.transitionState.startTime;
        const progress = Math.min(1.0, elapsed / this.transitionState.duration);
        
        this.transitionState.progress = progress;
        
        if (progress >= 1.0) {
            // Transition complete
            this.currentProjection = this.transitionState.toProjection;
            this.transitionState.isTransitioning = false;
            console.log(`✅ Projection transition completed: ${this.currentProjection}`);
            return true; // Transition finished
        }
        
        return false; // Transition continuing
    }
    
    /**
     * Get list of available projection names
     */
    getProjectionTypes() {
        return Array.from(this.projections.keys());
    }
    
    /**
     * Update parameters for current projection
     */
    updateParameters(params) {
        const currentProj = this.getCurrentProjection();
        if (currentProj) {
            const validated = currentProj.updateParameters(params);
            return validated;
        }
        return {};
    }
    
    /**
     * Update parameters for all projections
     */
    updateAllProjections(params) {
        const results = {};
        
        this.projections.forEach((projection, name) => {
            results[name] = projection.updateParameters(params);
        });
        
        return results;
    }
    
    /**
     * Get current projection status and parameters
     */
    getStatus() {
        const currentProj = this.getCurrentProjection();
        
        return {
            currentProjection: this.currentProjection,
            availableProjections: this.getProjectionTypes(),
            isTransitioning: this.transitionState.isTransitioning,
            transitionProgress: this.transitionState.progress,
            parameters: currentProj ? currentProj.getParameters() : {},
            shaderCode: currentProj ? currentProj.getShaderCode() : null
        };
    }
    
    /**
     * Generate blended shader code during transitions
     */
    getTransitionShaderCode() {
        if (!this.transitionState.isTransitioning) {
            const currentProj = this.getCurrentProjection();
            return currentProj ? currentProj.getShaderCode() : '';
        }
        
        // During transition, generate blended projection code
        const fromProj = this.getProjection(this.transitionState.fromProjection);
        const toProj = this.getProjection(this.transitionState.toProjection);
        const progress = this.transitionState.progress;
        
        return `
            vec3 project4Dto3D(vec4 p) {
                // Transition between projections
                float transitionProgress = ${progress.toFixed(3)};
                
                // From projection
                vec3 fromResult;
                ${fromProj.getShaderCode().replace('vec3 project4Dto3D(vec4 p) {', '').replace(/return ([^;]+);/, 'fromResult = $1;')}
                
                // To projection  
                vec3 toResult;
                ${toProj.getShaderCode().replace('vec3 project4Dto3D(vec4 p) {', '').replace(/return ([^;]+);/, 'toResult = $1;')}
                
                // Smooth blend between projections
                return mix(fromResult, toResult, smoothstep(0.0, 1.0, transitionProgress));
            }
        `;
    }
}

// ============================================================================
// 🎯 PROJECTION TESTING AND VALIDATION
// ============================================================================

class ProjectionTester {
    constructor(projectionManager) {
        this.projectionManager = projectionManager;
    }
    
    /**
     * Test all projection parameter ranges
     */
    testParameterRanges() {
        const results = {};
        
        this.projectionManager.getProjectionTypes().forEach(projectionName => {
            const projection = this.projectionManager.getProjection(projectionName);
            const ranges = projection.getParameterRanges();
            
            console.log(`🧪 Testing ${projectionName} parameter ranges:`, ranges);
            
            // Test boundary values
            const testParams = {};
            Object.entries(ranges).forEach(([param, range]) => {
                testParams[param + '_min'] = range.min;
                testParams[param + '_max'] = range.max;
                testParams[param + '_default'] = range.default;
            });
            
            const validated = projection.updateParameters(testParams);
            results[projectionName] = {
                ranges,
                testParams,
                validated,
                passed: Object.keys(validated).length > 0
            };
        });
        
        return results;
    }
    
    /**
     * Test projection transitions
     */
    testTransitions() {
        const projections = this.projectionManager.getProjectionTypes();
        const results = [];
        
        for (let i = 0; i < projections.length; i++) {
            for (let j = 0; j < projections.length; j++) {
                if (i !== j) {
                    const from = projections[i];
                    const to = projections[j];
                    
                    console.log(`🔄 Testing transition: ${from} → ${to}`);
                    
                    this.projectionManager.setCurrentProjection(from);
                    this.projectionManager.startTransition(from, to, 100); // Fast transition for test
                    
                    const shaderCode = this.projectionManager.getTransitionShaderCode();
                    
                    results.push({
                        from,
                        to,
                        shaderCodeGenerated: shaderCode.length > 0,
                        shaderCode: shaderCode.substring(0, 200) + '...' // Truncated for display
                    });
                }
            }
        }
        
        return results;
    }
    
    /**
     * Validate shader code generation
     */
    validateShaderCode() {
        const results = {};
        
        this.projectionManager.getProjectionTypes().forEach(projectionName => {
            const projection = this.projectionManager.getProjection(projectionName);
            const shaderCode = projection.getShaderCode();
            
            // Basic validation checks
            const checks = {
                hasFunction: shaderCode.includes('vec3 project4Dto3D(vec4 p)'),
                hasReturn: shaderCode.includes('return'),
                hasUniforms: shaderCode.includes('u_morphFactor') && shaderCode.includes('u_audioMid'),
                hasValidSyntax: shaderCode.split('{').length === shaderCode.split('}').length,
                codeLength: shaderCode.length
            };
            
            results[projectionName] = {
                shaderCode,
                checks,
                isValid: Object.values(checks).every(check => typeof check === 'boolean' ? check : true)
            };
        });
        
        return results;
    }
}

// ============================================================================
// 🎯 EXPORT PHASE 3 PROJECTION SYSTEM
// ============================================================================

// Export all projection classes for use in production system
window.VIB34D_Phase3 = {
    // Use Phase 1 BaseProjection (enhanced with validation)
    BaseProjection: window.VIB34D_Phase1.BaseProjection,
    PerspectiveProjection,
    OrthographicProjection,
    StereographicProjection,
    ProjectionManager: EnhancedProjectionManager,
    ProjectionTester
};

console.log('✅ VIB34D Phase 3 Projection System loaded successfully');
console.log('📐 Available projections:', ['PerspectiveProjection', 'OrthographicProjection', 'StereographicProjection']);
console.log('🎯 Projection system ready for Phase 4 integration');