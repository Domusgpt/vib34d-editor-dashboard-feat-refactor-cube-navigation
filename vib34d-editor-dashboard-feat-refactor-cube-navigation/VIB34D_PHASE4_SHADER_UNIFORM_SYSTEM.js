/**
 * VIB34D PHASE 4: COMPLETE SHADER UNIFORM SYSTEM
 * 
 * Implementing the complete shader uniform system with all 17 parameters:
 * - Core Mathematics & Timing (4 uniforms)
 * - Grid & Lattice Parameters (4 uniforms)
 * - Morphing & Animation (2 uniforms)
 * - Geometry-Specific Parameters (3 uniforms)
 * - Color & Effects (1 uniform)
 * - Interaction Reactivity (3 uniforms)
 * 
 * CHECKLIST REFERENCE: VIB34D_IMPLEMENTATION_CHECKLIST.md - Phase 4
 * STATUS: Phase 4 - Complete Shader Uniform System (IN PROGRESS)
 * 
 * BASED ON: VIB3_COMPLETE_PARAMETER_CODEX.md - Complete uniform specifications
 */

// ============================================================================
// 🎛️ ENHANCED SHADER MANAGER CLASS (from Phase 1)
// ============================================================================

class EnhancedShaderManager extends window.VIB34D_Phase1.ShaderManager {
    constructor(gl, options = {}) {
        super(gl); // Call base ShaderManager constructor
        this.options = {
            enableDebug: false,
            enableValidation: true,
            batchUpdates: true,
            ...options
        };
        
        this.program = null;
        this.uniforms = new Map();
        this.uniformLocations = new Map();
        this.dirtyUniforms = new Set();
        this.lastUpdateTime = 0;
        this.updateStats = {
            totalUpdates: 0,
            batchUpdates: 0,
            individualUpdates: 0
        };
        
        // Define all 17 shader uniforms as per VIB3_COMPLETE_PARAMETER_CODEX.md
        this.uniformDefinitions = this.initializeUniformDefinitions();
        
        // Initialize uniforms with default values
        this.resetToDefaults();
        
        console.log('✅ Enhanced ShaderManager initialized with 17 uniforms');
        this.logUniformSummary();
    }
    
    /**
     * Initialize all 17 uniform definitions with complete specifications
     */
    initializeUniformDefinitions() {
        return {
            // ==========================================
            // CORE MATHEMATICS & TIMING (4 uniforms)
            // ==========================================
            u_resolution: { 
                type: '2f', 
                default: [1920, 1080],
                category: 'core',
                description: 'Canvas dimensions in pixels',
                updateFrequency: 'resize'
            },
            u_time: { 
                type: '1f', 
                default: 0.0,
                category: 'core',
                description: 'Animation time in seconds',
                updateFrequency: 'frame'
            },
            u_mouse: { 
                type: '2f', 
                default: [0.5, 0.5],
                range: [0.0, 1.0],
                category: 'core',
                description: 'Mouse position normalized [0-1]',
                updateFrequency: 'interaction'
            },
            u_dimension: { 
                type: '1f', 
                default: 4.0, 
                range: [3.0, 5.0],
                category: 'core',
                description: '3D to 4D+ transition control',
                updateFrequency: 'parameter'
            },
            
            // ==========================================
            // GRID & LATTICE PARAMETERS (4 uniforms)
            // ==========================================
            u_gridDensity: { 
                type: '1f', 
                default: 8.0, 
                range: [1.0, 25.0],
                category: 'lattice',
                description: 'Lattice density/grid size',
                updateFrequency: 'parameter'
            },
            u_lineThickness: { 
                type: '1f', 
                default: 0.03, 
                range: [0.002, 0.1],
                category: 'lattice',
                description: 'Line/edge thickness',
                updateFrequency: 'parameter'
            },
            u_universeModifier: { 
                type: '1f', 
                default: 1.0, 
                range: [0.3, 2.5],
                category: 'lattice',
                description: 'Universe scaling power curve',
                updateFrequency: 'parameter'
            },
            u_patternIntensity: { 
                type: '1f', 
                default: 1.3, 
                range: [0.0, 3.0],
                category: 'lattice',
                description: 'Overall brightness/contrast',
                updateFrequency: 'parameter'
            },
            
            // ==========================================
            // MORPHING & ANIMATION (2 uniforms)
            // ==========================================
            u_morphFactor: { 
                type: '1f', 
                default: 0.7, 
                range: [0.0, 1.5],
                category: 'animation',
                description: 'Morph intensity 3D→4D',
                updateFrequency: 'parameter'
            },
            u_rotationSpeed: { 
                type: '1f', 
                default: 0.5, 
                range: [0.0, 3.0],
                category: 'animation',
                description: '4D rotation speed',
                updateFrequency: 'parameter'
            },
            
            // ==========================================
            // GEOMETRY-SPECIFIC PARAMETERS (3 uniforms)
            // ==========================================
            u_shellWidth: { 
                type: '1f', 
                default: 0.025, 
                range: [0.005, 0.08],
                category: 'geometry',
                description: 'Hypersphere shell thickness',
                updateFrequency: 'parameter',
                geometrySpecific: ['hypersphere']
            },
            u_tetraThickness: { 
                type: '1f', 
                default: 0.035, 
                range: [0.003, 0.1],
                category: 'geometry',
                description: 'Hypertetrahedron plane thickness',
                updateFrequency: 'parameter',
                geometrySpecific: ['hypertetrahedron']
            },
            u_glitchIntensity: { 
                type: '1f', 
                default: 0.02, 
                range: [0.0, 0.15],
                category: 'geometry',
                description: 'RGB glitch effect amount',
                updateFrequency: 'parameter'
            },
            
            // ==========================================
            // COLOR & EFFECTS (1 uniform)
            // ==========================================
            u_colorShift: { 
                type: '1f', 
                default: 0.0, 
                range: [-1.0, 1.0],
                category: 'color',
                description: 'Hue rotation shift',
                updateFrequency: 'parameter'
            },
            
            // ==========================================
            // INTERACTION REACTIVITY (3 uniforms)
            // ==========================================
            u_audioBass: { 
                type: '1f', 
                default: 0.0, 
                range: [0.0, 1.0],
                category: 'interaction',
                description: 'Bass level → scroll intensity',
                updateFrequency: 'interaction',
                mappedTo: 'scroll'
            },
            u_audioMid: { 
                type: '1f', 
                default: 0.0, 
                range: [0.0, 1.0],
                category: 'interaction',
                description: 'Mid level → click/hold intensity',
                updateFrequency: 'interaction',
                mappedTo: 'click'
            },
            u_audioHigh: { 
                type: '1f', 
                default: 0.0, 
                range: [0.0, 1.0],
                category: 'interaction',
                description: 'High level → mouse movement intensity',
                updateFrequency: 'interaction',
                mappedTo: 'mouse'
            }
        };
    }
    
    /**
     * Reset all uniforms to their default values
     */
    resetToDefaults() {
        this.uniforms.clear();
        this.dirtyUniforms.clear();
        
        for (const [name, def] of Object.entries(this.uniformDefinitions)) {
            this.uniforms.set(name, this.cloneValue(def.default));
            this.dirtyUniforms.add(name);
        }
        
        console.log('🔄 All uniforms reset to default values');
    }
    
    /**
     * Clone value to prevent reference issues
     */
    cloneValue(value) {
        return Array.isArray(value) ? [...value] : value;
    }
    
    /**
     * Log uniform system summary
     */
    logUniformSummary() {
        const categories = {};
        Object.entries(this.uniformDefinitions).forEach(([name, def]) => {
            if (!categories[def.category]) {
                categories[def.category] = [];
            }
            categories[def.category].push(name);
        });
        
        console.log('📊 Uniform System Summary:');
        Object.entries(categories).forEach(([category, uniforms]) => {
            console.log(`  ${category}: ${uniforms.length} uniforms -`, uniforms);
        });
    }
    
    /**
     * Compile and link shader program with uniform location caching
     */
    createProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        
        // Compile vertex shader
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
        if (!vertexShader) return null;
        
        // Compile fragment shader
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);
        if (!fragmentShader) return null;
        
        // Link program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Shader program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        
        // Clean up shaders
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        
        // Store program and cache uniform locations
        this.program = program;
        this.cacheUniformLocations();
        
        console.log('✅ Shader program compiled and linked successfully');
        return program;
    }
    
    /**
     * Compile individual shader with enhanced error reporting
     */
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const typeName = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
            const error = gl.getShaderInfoLog(shader);
            
            console.error(`${typeName} shader compile error:`, error);
            
            // Enhanced error reporting with line numbers
            if (this.options.enableDebug) {
                const lines = source.split('\n');
                lines.forEach((line, index) => {
                    console.log(`${(index + 1).toString().padStart(3)}: ${line}`);
                });
            }
            
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    /**
     * Cache uniform locations for efficient updates
     */
    cacheUniformLocations() {
        const gl = this.gl;
        
        if (!this.program) {
            console.error('No shader program available for uniform location caching');
            return;
        }
        
        this.uniformLocations.clear();
        let foundUniforms = 0;
        let missingUniforms = [];
        
        for (const uniformName of Object.keys(this.uniformDefinitions)) {
            const location = gl.getUniformLocation(this.program, uniformName);
            if (location !== null) {
                this.uniformLocations.set(uniformName, location);
                foundUniforms++;
            } else {
                missingUniforms.push(uniformName);
                if (this.options.enableDebug) {
                    console.warn(`Uniform ${uniformName} not found in shader`);
                }
            }
        }
        
        console.log(`✅ Cached ${foundUniforms}/17 uniform locations`);
        if (missingUniforms.length > 0) {
            console.warn('⚠️ Missing uniforms:', missingUniforms);
        }
    }
    
    /**
     * Set uniform value with validation and dirty flagging
     */
    setUniform(name, value) {
        const definition = this.uniformDefinitions[name];
        if (!definition) {
            if (this.options.enableDebug) {
                console.warn(`Unknown uniform: ${name}`);
            }
            return false;
        }
        
        // Validate and clamp value if range is defined
        let validatedValue = value;
        if (this.options.enableValidation && definition.range) {
            validatedValue = this.validateValue(value, definition);
        }
        
        // Check if value actually changed
        const currentValue = this.uniforms.get(name);
        if (this.valuesEqual(currentValue, validatedValue)) {
            return true; // No change, skip update
        }
        
        // Store value and mark as dirty
        this.uniforms.set(name, this.cloneValue(validatedValue));
        this.dirtyUniforms.add(name);
        
        if (this.options.enableDebug) {
            console.log(`🎛️ Uniform ${name} = ${this.formatValue(validatedValue)}`);
        }
        
        return true;
    }
    
    /**
     * Validate uniform value against its definition
     */
    validateValue(value, definition) {
        if (!definition.range) {
            return value;
        }
        
        if (Array.isArray(value)) {
            // For vector uniforms, clamp each component
            return value.map(component => 
                Math.max(definition.range[0], Math.min(definition.range[1], component))
            );
        } else {
            // For scalar uniforms
            return Math.max(definition.range[0], Math.min(definition.range[1], value));
        }
    }
    
    /**
     * Check if two values are equal (handles arrays)
     */
    valuesEqual(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            return a.length === b.length && a.every((val, index) => val === b[index]);
        }
        return a === b;
    }
    
    /**
     * Format value for display
     */
    formatValue(value) {
        if (Array.isArray(value)) {
            return `[${value.map(v => v.toFixed(3)).join(', ')}]`;
        }
        return typeof value === 'number' ? value.toFixed(3) : value;
    }
    
    /**
     * Update multiple uniforms at once
     */
    setUniforms(uniformObject) {
        let updatedCount = 0;
        
        for (const [name, value] of Object.entries(uniformObject)) {
            if (this.setUniform(name, value)) {
                updatedCount++;
            }
        }
        
        if (this.options.enableDebug && updatedCount > 0) {
            console.log(`🎛️ Batch updated ${updatedCount} uniforms`);
        }
        
        return updatedCount;
    }
    
    /**
     * Apply all dirty uniforms to GPU with batching
     */
    updateUniforms() {
        const gl = this.gl;
        
        if (!this.program || this.dirtyUniforms.size === 0) {
            return false;
        }
        
        const startTime = performance.now();
        gl.useProgram(this.program);
        
        let updatedCount = 0;
        
        for (const uniformName of this.dirtyUniforms) {
            const location = this.uniformLocations.get(uniformName);
            const value = this.uniforms.get(uniformName);
            const definition = this.uniformDefinitions[uniformName];
            
            if (location !== undefined && value !== undefined && definition) {
                this.uploadUniform(location, definition.type, value);
                updatedCount++;
            }
        }
        
        this.dirtyUniforms.clear();
        
        // Update statistics
        this.updateStats.totalUpdates++;
        if (updatedCount > 1) {
            this.updateStats.batchUpdates++;
        } else if (updatedCount === 1) {
            this.updateStats.individualUpdates++;
        }
        
        const elapsed = performance.now() - startTime;
        this.lastUpdateTime = elapsed;
        
        if (this.options.enableDebug && updatedCount > 0) {
            console.log(`⚡ GPU updated ${updatedCount} uniforms in ${elapsed.toFixed(2)}ms`);
        }
        
        return updatedCount > 0;
    }
    
    /**
     * Upload single uniform to GPU based on type
     */
    uploadUniform(location, type, value) {
        const gl = this.gl;
        
        try {
            switch (type) {
                case '1f':
                    gl.uniform1f(location, value);
                    break;
                case '2f':
                    gl.uniform2f(location, value[0], value[1]);
                    break;
                case '3f':
                    gl.uniform3f(location, value[0], value[1], value[2]);
                    break;
                case '4f':
                    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                    break;
                case '1i':
                    gl.uniform1i(location, value);
                    break;
                case '2i':
                    gl.uniform2i(location, value[0], value[1]);
                    break;
                case '3i':
                    gl.uniform3i(location, value[0], value[1], value[2]);
                    break;
                case '4i':
                    gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                    break;
                default:
                    console.warn(`Unknown uniform type: ${type}`);
            }
        } catch (error) {
            console.error(`Error uploading uniform (${type}):`, error);
        }
    }
    
    /**
     * Get current uniform value
     */
    getUniform(name) {
        return this.cloneValue(this.uniforms.get(name));
    }
    
    /**
     * Get all current uniform values
     */
    getAllUniforms() {
        const result = {};
        this.uniforms.forEach((value, name) => {
            result[name] = this.cloneValue(value);
        });
        return result;
    }
    
    /**
     * Get uniforms by category
     */
    getUniformsByCategory(category) {
        const result = {};
        
        Object.entries(this.uniformDefinitions).forEach(([name, def]) => {
            if (def.category === category) {
                result[name] = this.cloneValue(this.uniforms.get(name));
            }
        });
        
        return result;
    }
    
    /**
     * Get uniform definition (type, range, default, etc.)
     */
    getUniformDefinition(name) {
        return this.uniformDefinitions[name];
    }
    
    /**
     * Get all uniform definitions
     */
    getAllUniformDefinitions() {
        return { ...this.uniformDefinitions };
    }
    
    /**
     * Get uniforms that are geometry-specific
     */
    getGeometrySpecificUniforms(geometryType) {
        const result = {};
        
        Object.entries(this.uniformDefinitions).forEach(([name, def]) => {
            if (def.geometrySpecific && def.geometrySpecific.includes(geometryType)) {
                result[name] = this.cloneValue(this.uniforms.get(name));
            }
        });
        
        return result;
    }
    
    /**
     * Update uniforms for specific interaction mapping
     */
    updateInteractionUniforms(interactionData) {
        const interactionMappings = {
            u_audioBass: interactionData.scroll?.intensity || 0,
            u_audioMid: interactionData.click?.intensity || 0,
            u_audioHigh: interactionData.mouse?.intensity || 0
        };
        
        return this.setUniforms(interactionMappings);
    }
    
    /**
     * Update time-based uniforms
     */
    updateTimeUniforms(time, deltaTime) {
        return this.setUniforms({
            u_time: time * 0.001 // Convert to seconds
        });
    }
    
    /**
     * Update resolution uniform (for canvas resize)
     */
    updateResolution(width, height) {
        return this.setUniform('u_resolution', [width, height]);
    }
    
    /**
     * Update mouse position uniform
     */
    updateMouse(x, y) {
        return this.setUniform('u_mouse', [x, y]);
    }
    
    /**
     * Get system performance statistics
     */
    getStats() {
        return {
            totalUniforms: Object.keys(this.uniformDefinitions).length,
            cachedLocations: this.uniformLocations.size,
            dirtyUniforms: this.dirtyUniforms.size,
            lastUpdateTime: this.lastUpdateTime,
            ...this.updateStats
        };
    }
    
    /**
     * Get detailed system status
     */
    getStatus() {
        return {
            programReady: this.program !== null,
            uniformsInitialized: this.uniforms.size === Object.keys(this.uniformDefinitions).length,
            locationsReady: this.uniformLocations.size > 0,
            dirtyCount: this.dirtyUniforms.size,
            stats: this.getStats(),
            categories: this.getCategorySummary()
        };
    }
    
    /**
     * Get summary of uniforms by category
     */
    getCategorySummary() {
        const summary = {};
        
        Object.entries(this.uniformDefinitions).forEach(([name, def]) => {
            if (!summary[def.category]) {
                summary[def.category] = {
                    count: 0,
                    uniforms: []
                };
            }
            summary[def.category].count++;
            summary[def.category].uniforms.push(name);
        });
        
        return summary;
    }
    
    /**
     * Validate entire uniform system
     */
    validateSystem() {
        const results = {
            allUniformsDefined: true,
            allLocationsFound: true,
            validationErrors: [],
            missingUniforms: [],
            invalidValues: []
        };
        
        // Check all uniforms are defined
        Object.keys(this.uniformDefinitions).forEach(name => {
            if (!this.uniforms.has(name)) {
                results.allUniformsDefined = false;
                results.missingUniforms.push(name);
            }
            
            // Validate current values
            const value = this.uniforms.get(name);
            const definition = this.uniformDefinitions[name];
            
            if (definition.range && !this.isValueInRange(value, definition.range)) {
                results.invalidValues.push({
                    uniform: name,
                    value,
                    range: definition.range
                });
            }
        });
        
        // Check uniform locations
        results.allLocationsFound = this.uniformLocations.size === Object.keys(this.uniformDefinitions).length;
        
        return results;
    }
    
    /**
     * Check if value is within valid range
     */
    isValueInRange(value, range) {
        if (Array.isArray(value)) {
            return value.every(component => component >= range[0] && component <= range[1]);
        }
        return value >= range[0] && value <= range[1];
    }
    
    // ============================================================================
    // 🔧 CRITICAL MISSING METHODS FOR MCP COMPATIBILITY
    // ============================================================================
    
    /**
     * Register a new uniform with type, default value, and validation range
     * Required by external systems and MCP integration
     */
    registerUniform(name, type, defaultValue, range) {
        console.log(`🎛️ Registering uniform: ${name} (${type})`);
        
        // Add to uniform definitions if not exists
        if (!this.uniformDefinitions[name]) {
            this.uniformDefinitions[name] = {
                type: type === 'float' ? '1f' : type, // Convert common types
                default: defaultValue,
                range: range ? [range.min, range.max] : null,
                category: 'custom',
                description: `Custom registered uniform: ${name}`
            };
        }
        
        // Set initial value
        this.setUniform(name, defaultValue);
        
        console.log(`✅ Uniform ${name} registered successfully`);
        return true;
    }
    
    /**
     * Batch update multiple uniforms efficiently 
     * Required by external systems and MCP integration
     */
    batchUpdateUniforms(uniformObject) {
        console.log(`🎛️ Batch updating ${Object.keys(uniformObject).length} uniforms`);
        
        // Use existing setUniforms method which is more efficient
        const successCount = this.setUniforms(uniformObject);
        
        console.log(`✅ Batch updated ${successCount} uniforms`);
        return successCount;
    }
    
    /**
     * Synchronize all dirty uniforms to GPU
     * Required by external systems and MCP integration
     */
    syncToGPU() {
        console.log('⚡ Syncing uniforms to GPU...');
        
        // Use existing updateUniforms method for GPU sync
        const success = this.updateUniforms();
        
        if (success) {
            console.log(`✅ GPU sync completed successfully`);
        } else {
            console.warn('⚠️ GPU sync failed - no program or dirty uniforms');
        }
        
        return success;
    }
}

// ============================================================================
// 🧪 UNIFORM SYSTEM TESTER
// ============================================================================

class UniformSystemTester {
    constructor(shaderManager) {
        this.shaderManager = shaderManager;
    }
    
    /**
     * Test all uniform parameter ranges
     */
    testParameterRanges() {
        console.log('🧪 Testing all uniform parameter ranges...');
        
        const results = {};
        const definitions = this.shaderManager.getAllUniformDefinitions();
        
        Object.entries(definitions).forEach(([name, def]) => {
            if (def.range) {
                const testValues = [
                    def.range[0], // Min
                    def.range[1], // Max
                    def.default,  // Default
                    (def.range[0] + def.range[1]) / 2, // Middle
                    def.range[0] - 1, // Below min (should clamp)
                    def.range[1] + 1  // Above max (should clamp)
                ];
                
                const testResults = [];
                testValues.forEach(testValue => {
                    this.shaderManager.setUniform(name, testValue);
                    const actualValue = this.shaderManager.getUniform(name);
                    testResults.push({
                        input: testValue,
                        output: actualValue,
                        clamped: testValue !== actualValue
                    });
                });
                
                results[name] = {
                    definition: def,
                    tests: testResults
                };
            }
        });
        
        return results;
    }
    
    /**
     * Test batch uniform updates
     */
    testBatchUpdates() {
        console.log('🧪 Testing batch uniform updates...');
        
        const testParams = {
            u_gridDensity: 12.0,
            u_lineThickness: 0.05,
            u_morphFactor: 0.9,
            u_dimension: 4.2,
            u_rotationSpeed: 1.5
        };
        
        const startTime = performance.now();
        const updatedCount = this.shaderManager.setUniforms(testParams);
        const elapsed = performance.now() - startTime;
        
        return {
            testParams,
            updatedCount,
            elapsed,
            success: updatedCount === Object.keys(testParams).length
        };
    }
    
    /**
     * Test interaction uniform mapping
     */
    testInteractionMapping() {
        console.log('🧪 Testing interaction uniform mapping...');
        
        const mockInteractionData = {
            scroll: { intensity: 0.7 },
            click: { intensity: 0.3 },
            mouse: { intensity: 0.9 }
        };
        
        const updatedCount = this.shaderManager.updateInteractionUniforms(mockInteractionData);
        
        const results = {
            u_audioBass: this.shaderManager.getUniform('u_audioBass'),
            u_audioMid: this.shaderManager.getUniform('u_audioMid'),
            u_audioHigh: this.shaderManager.getUniform('u_audioHigh')
        };
        
        return {
            mockInteractionData,
            updatedCount,
            results,
            success: results.u_audioBass === 0.7 && results.u_audioMid === 0.3 && results.u_audioHigh === 0.9
        };
    }
    
    /**
     * Run complete test suite
     */
    runCompleteTests() {
        console.log('🧪 Running complete uniform system test suite...');
        
        const results = {
            parameterRanges: this.testParameterRanges(),
            batchUpdates: this.testBatchUpdates(),
            interactionMapping: this.testInteractionMapping(),
            systemValidation: this.shaderManager.validateSystem(),
            systemStats: this.shaderManager.getStats()
        };
        
        const allTestsPassed = 
            results.batchUpdates.success &&
            results.interactionMapping.success &&
            results.systemValidation.allUniformsDefined;
        
        console.log(allTestsPassed ? '✅ All uniform tests passed!' : '❌ Some uniform tests failed');
        
        return {
            ...results,
            allTestsPassed
        };
    }
}

// ============================================================================
// 🎯 EXPORT PHASE 4 SHADER UNIFORM SYSTEM
// ============================================================================

// Export enhanced shader uniform system
window.VIB34D_Phase4 = {
    ShaderManager: EnhancedShaderManager,
    UniformSystemTester
};

console.log('✅ VIB34D Phase 4 Shader Uniform System loaded successfully');
console.log('🎛️ Complete uniform system with 17 parameters ready');
console.log('🧪 Testing utilities available for validation');