/**
 * VIB34D PHASE 1: CORE ARCHITECTURE FOUNDATION
 * 
 * Building the complete class hierarchy:
 * BaseGeometry → BaseProjection → GeometryManager → ProjectionManager → ShaderManager → HypercubeCore
 * 
 * CHECKLIST REFERENCE: VIB34D_IMPLEMENTATION_CHECKLIST.md - Phase 1
 * STATUS: Phase 1 - Core Architecture Foundation (IN PROGRESS)
 */

// ============================================================================
// 🎨 BASE GEOMETRY ABSTRACT CLASS
// ============================================================================

class BaseGeometry {
    constructor(name = 'BaseGeometry') {
        if (this.constructor === BaseGeometry) {
            throw new Error('BaseGeometry is abstract and cannot be instantiated directly');
        }
        
        this.name = name;
        this.parameters = {
            gridDensity: 8.0,
            lineThickness: 0.03,
            morphFactor: 0.7,
            dimension: 4.0,
            rotationSpeed: 0.5
        };
    }
    
    /**
     * Abstract method: Must be implemented by subclasses
     * Returns the GLSL shader code for this geometry's calculateLattice() function
     */
    getShaderCode() {
        throw new Error(`getShaderCode() must be implemented by ${this.constructor.name}`);
    }
    
    /**
     * Abstract method: Must be implemented by subclasses  
     * Updates geometry-specific parameters
     */
    updateParameters(newParams) {
        throw new Error(`updateParameters() must be implemented by ${this.constructor.name}`);
    }
    
    /**
     * Get parameter ranges for this geometry
     */
    getParameterRanges() {
        return {
            gridDensity: { min: 1.0, max: 25.0, default: 8.0 },
            lineThickness: { min: 0.002, max: 0.1, default: 0.03 },
            morphFactor: { min: 0.0, max: 1.5, default: 0.7 },
            dimension: { min: 3.0, max: 5.0, default: 4.0 },
            rotationSpeed: { min: 0.0, max: 3.0, default: 0.5 }
        };
    }
    
    /**
     * Validate parameter values against ranges
     */
    validateParameters(params) {
        const ranges = this.getParameterRanges();
        const validated = {};
        
        for (const [key, value] of Object.entries(params)) {
            if (ranges[key]) {
                const range = ranges[key];
                validated[key] = Math.max(range.min, Math.min(range.max, value));
            } else {
                validated[key] = value; // Pass through unknown parameters
            }
        }
        
        return validated;
    }
}

// ============================================================================
// 📐 BASE PROJECTION ABSTRACT CLASS  
// ============================================================================

class BaseProjection {
    constructor(name = 'BaseProjection') {
        if (this.constructor === BaseProjection) {
            throw new Error('BaseProjection is abstract and cannot be instantiated directly');
        }
        
        this.name = name;
        this.parameters = {
            viewDistance: 2.5,
            morphFactor: 0.7,
            audioMid: 0.0,
            audioHigh: 0.0
        };
    }
    
    /**
     * Abstract method: Must be implemented by subclasses
     * Returns the GLSL shader code for this projection's project4Dto3D() function
     */
    getShaderCode() {
        throw new Error(`getShaderCode() must be implemented by ${this.constructor.name}`);
    }
    
    /**
     * Update projection parameters
     */
    updateParameters(newParams) {
        Object.assign(this.parameters, newParams);
    }
    
    /**
     * Get parameter ranges for projections
     */
    getParameterRanges() {
        return {
            viewDistance: { min: 0.1, max: 10.0, default: 2.5 },
            morphFactor: { min: 0.0, max: 1.5, default: 0.7 },
            audioMid: { min: 0.0, max: 1.0, default: 0.0 },
            audioHigh: { min: 0.0, max: 1.0, default: 0.0 }
        };
    }
}

// ============================================================================
// 🎯 GEOMETRY MANAGER CLASS
// ============================================================================

class GeometryManager {
    constructor(options = {}) {
        this.options = {
            defaultGeometry: 'hypercube',
            ...options
        };
        
        this.geometries = new Map();
        this.currentGeometry = null;
        
        console.log('✅ GeometryManager initialized');
    }
    
    /**
     * Register a geometry instance
     */
    registerGeometry(name, geometryInstance) {
        const lowerCaseName = name.toLowerCase();
        
        if (!(geometryInstance instanceof BaseGeometry)) {
            console.error(`Invalid geometry object for '${lowerCaseName}'. Must extend BaseGeometry.`);
            return false;
        }
        
        if (this.geometries.has(lowerCaseName)) {
            console.warn(`Overwriting geometry '${lowerCaseName}'.`);
        }
        
        this.geometries.set(lowerCaseName, geometryInstance);
        console.log(`📐 Registered geometry: ${lowerCaseName}`);
        
        // Set as current if it's the first or default
        if (!this.currentGeometry || lowerCaseName === this.options.defaultGeometry) {
            this.currentGeometry = lowerCaseName;
        }
        
        return true;
    }
    
    /**
     * Get a geometry instance by name
     */
    getGeometry(name) {
        const lowerCaseName = name ? name.toLowerCase() : this.options.defaultGeometry;
        const geometry = this.geometries.get(lowerCaseName);
        
        if (!geometry) {
            console.warn(`Geometry '${name}' not found. Using default: ${this.options.defaultGeometry}`);
            return this.geometries.get(this.options.defaultGeometry.toLowerCase());
        }
        
        return geometry;
    }
    
    /**
     * Get current active geometry
     */
    getCurrentGeometry() {
        return this.getGeometry(this.currentGeometry);
    }
    
    /**
     * Set current active geometry
     */
    setCurrentGeometry(name) {
        const geometry = this.getGeometry(name);
        if (geometry) {
            this.currentGeometry = name.toLowerCase();
            return true;
        }
        return false;
    }
    
    /**
     * Get list of available geometry names
     */
    getGeometryTypes() {
        return Array.from(this.geometries.keys());
    }
    
    /**
     * Update parameters for current geometry
     */
    updateParameters(params) {
        const currentGeom = this.getCurrentGeometry();
        if (currentGeom) {
            const validatedParams = currentGeom.validateParameters(params);
            currentGeom.updateParameters(validatedParams);
            return validatedParams;
        }
        return {};
    }
}

// ============================================================================
// 📐 PROJECTION MANAGER CLASS
// ============================================================================

class ProjectionManager {
    constructor(options = {}) {
        this.options = {
            defaultProjection: 'perspective',
            ...options
        };
        
        this.projections = new Map();
        this.currentProjection = null;
        
        this._initDefaultProjections();
        console.log('✅ ProjectionManager initialized');
    }
    
    /**
     * Initialize default projection types
     */
    _initDefaultProjections() {
        // We'll implement actual projection classes in Phase 3
        // For now, create placeholder objects that extend BaseProjection
        
        class PerspectiveProjection extends BaseProjection {
            constructor(viewDistance = 2.5) {
                super('perspective');
                this.parameters.viewDistance = Math.max(0.1, viewDistance);
            }
            
            getShaderCode() {
                return `
                    vec3 project4Dto3D(vec4 p) {
                        float baseDistance = ${this.parameters.viewDistance.toFixed(2)};
                        float dynamicDistance = max(0.2, baseDistance * (1.0 + u_morphFactor * 0.4 - u_audioMid * 0.35));
                        float w_factor = dynamicDistance / max(0.1, dynamicDistance + p.w);
                        return p.xyz * w_factor;
                    }
                `;
            }
        }
        
        class OrthographicProjection extends BaseProjection {
            constructor() {
                super('orthographic');
            }
            
            getShaderCode() {
                return `
                    vec3 project4Dto3D(vec4 p) {
                        vec3 orthoP = p.xyz;
                        float basePerspectiveDistance = 2.5;
                        float dynamicPerspectiveDistance = max(0.2, basePerspectiveDistance * (1.0 - u_audioMid * 0.4));
                        float perspDenominator = dynamicPerspectiveDistance + p.w;
                        float persp_w_factor = dynamicPerspectiveDistance / max(0.1, perspDenominator);
                        vec3 perspP = p.xyz * persp_w_factor;
                        float morphT = smoothstep(0.0, 1.0, u_morphFactor);
                        return mix(orthoP, perspP, morphT);
                    }
                `;
            }
        }
        
        class StereographicProjection extends BaseProjection {
            constructor(projectionPoleW = -1.5) {
                super('stereographic');
                this.parameters.projectionPoleW = Math.abs(projectionPoleW) < 0.01 ? -1.0 : projectionPoleW;
            }
            
            getShaderCode() {
                return `
                    vec3 project4Dto3D(vec4 p) {
                        float basePoleW = ${this.parameters.projectionPoleW.toFixed(2)};
                        float dynamicPoleW = sign(basePoleW) * max(0.1, abs(basePoleW + u_audioHigh * 0.4 * sign(basePoleW)));
                        float denominator = p.w - dynamicPoleW;
                        
                        if (abs(denominator) < 0.001) {
                            return normalize(p.xyz + vec3(0.001)) * 1000.0;
                        } else {
                            float scale = (-dynamicPoleW) / denominator;
                            vec3 projectedP = p.xyz * scale;
                            vec3 orthoP = p.xyz;
                            float morphT = smoothstep(0.0, 1.0, u_morphFactor * 0.8);
                            return mix(projectedP, orthoP, morphT);
                        }
                    }
                `;
            }
        }
        
        // Register default projections
        this.registerProjection('perspective', new PerspectiveProjection());
        this.registerProjection('orthographic', new OrthographicProjection());
        this.registerProjection('stereographic', new StereographicProjection());
    }
    
    /**
     * Register a projection instance
     */
    registerProjection(name, projectionInstance) {
        const lowerCaseName = name.toLowerCase();
        
        if (!(projectionInstance instanceof BaseProjection)) {
            console.error(`Invalid projection object for '${lowerCaseName}'. Must extend BaseProjection.`);
            return false;
        }
        
        if (this.projections.has(lowerCaseName)) {
            console.warn(`Overwriting projection '${lowerCaseName}'.`);
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
     * Get a projection instance by name
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
     * Set current active projection
     */
    setCurrentProjection(name) {
        const projection = this.getProjection(name);
        if (projection) {
            this.currentProjection = name.toLowerCase();
            return true;
        }
        return false;
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
            currentProj.updateParameters(params);
            return currentProj.parameters;
        }
        return {};
    }
}

// ============================================================================
// 🎛️ SHADER MANAGER CLASS
// ============================================================================

class ShaderManager {
    constructor(gl, options = {}) {
        this.gl = gl;
        this.options = {
            enableDebug: false,
            ...options
        };
        
        this.program = null;
        this.uniforms = new Map();
        this.uniformLocations = new Map();
        this.dirtyUniforms = new Set();
        
        // Define all 17 shader uniforms as per VIB3_COMPLETE_PARAMETER_CODEX.md
        this.uniformDefinitions = {
            // Core Mathematics & Timing (4 uniforms)
            u_resolution: { type: '2f', default: [1920, 1080] },
            u_time: { type: '1f', default: 0.0 },
            u_mouse: { type: '2f', default: [0.5, 0.5] },
            u_dimension: { type: '1f', default: 4.0, range: [3.0, 5.0] },
            
            // Grid & Lattice Parameters (4 uniforms)
            u_gridDensity: { type: '1f', default: 8.0, range: [1.0, 25.0] },
            u_lineThickness: { type: '1f', default: 0.03, range: [0.002, 0.1] },
            u_universeModifier: { type: '1f', default: 1.0, range: [0.3, 2.5] },
            u_patternIntensity: { type: '1f', default: 1.3, range: [0.0, 3.0] },
            
            // Morphing & Animation (2 uniforms)
            u_morphFactor: { type: '1f', default: 0.7, range: [0.0, 1.5] },
            u_rotationSpeed: { type: '1f', default: 0.5, range: [0.0, 3.0] },
            
            // Geometry-Specific Parameters (3 uniforms)
            u_shellWidth: { type: '1f', default: 0.025, range: [0.005, 0.08] },
            u_tetraThickness: { type: '1f', default: 0.035, range: [0.003, 0.1] },
            u_glitchIntensity: { type: '1f', default: 0.02, range: [0.0, 0.15] },
            
            // Color & Effects (1 uniform)
            u_colorShift: { type: '1f', default: 0.0, range: [-1.0, 1.0] },
            
            // Interaction Reactivity (3 uniforms)
            u_audioBass: { type: '1f', default: 0.0, range: [0.0, 1.0] },
            u_audioMid: { type: '1f', default: 0.0, range: [0.0, 1.0] },
            u_audioHigh: { type: '1f', default: 0.0, range: [0.0, 1.0] }
        };
        
        // Initialize uniforms with default values
        for (const [name, def] of Object.entries(this.uniformDefinitions)) {
            this.uniforms.set(name, def.default);
        }
        
        console.log('✅ ShaderManager initialized with 17 uniforms');
    }
    
    /**
     * Compile and link shader program
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
        
        // Store program and get uniform locations
        this.program = program;
        this.cacheUniformLocations();
        
        console.log('✅ Shader program compiled and linked successfully');
        return program;
    }
    
    /**
     * Compile individual shader
     */
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const typeName = type === gl.VERTEX_SHADER ? 'vertex' : 'fragment';
            console.error(`${typeName} shader compile error:`, gl.getShaderInfoLog(shader));
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
        
        for (const uniformName of Object.keys(this.uniformDefinitions)) {
            const location = gl.getUniformLocation(this.program, uniformName);
            if (location !== null) {
                this.uniformLocations.set(uniformName, location);
            } else if (this.options.enableDebug) {
                console.warn(`Uniform ${uniformName} not found in shader`);
            }
        }
        
        console.log(`✅ Cached ${this.uniformLocations.size}/17 uniform locations`);
    }
    
    /**
     * Set uniform value (marks as dirty for batch updates)
     */
    setUniform(name, value) {
        if (this.uniformDefinitions[name]) {
            // Validate range if defined
            const def = this.uniformDefinitions[name];
            if (def.range) {
                if (typeof value === 'number') {
                    value = Math.max(def.range[0], Math.min(def.range[1], value));
                }
            }
            
            this.uniforms.set(name, value);
            this.dirtyUniforms.add(name);
            return true;
        } else {
            console.warn(`Unknown uniform: ${name}`);
            return false;
        }
    }
    
    /**
     * Update multiple uniforms at once
     */
    setUniforms(uniformObject) {
        for (const [name, value] of Object.entries(uniformObject)) {
            this.setUniform(name, value);
        }
    }
    
    /**
     * Apply all dirty uniforms to GPU
     */
    updateUniforms() {
        const gl = this.gl;
        
        if (!this.program || this.dirtyUniforms.size === 0) {
            return;
        }
        
        gl.useProgram(this.program);
        
        for (const uniformName of this.dirtyUniforms) {
            const location = this.uniformLocations.get(uniformName);
            const value = this.uniforms.get(uniformName);
            const type = this.uniformDefinitions[uniformName].type;
            
            if (location !== undefined && value !== undefined) {
                this.uploadUniform(location, type, value);
            }
        }
        
        this.dirtyUniforms.clear();
    }
    
    /**
     * Upload single uniform to GPU based on type
     */
    uploadUniform(location, type, value) {
        const gl = this.gl;
        
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
            default:
                console.warn(`Unknown uniform type: ${type}`);
        }
    }
    
    /**
     * Get current uniform value
     */
    getUniform(name) {
        return this.uniforms.get(name);
    }
    
    /**
     * Get all current uniform values
     */
    getAllUniforms() {
        return Object.fromEntries(this.uniforms);
    }
    
    /**
     * Get uniform definition (type, range, default)
     */
    getUniformDefinition(name) {
        return this.uniformDefinitions[name];
    }
    
    /**
     * Get all uniform definitions
     */
    getAllUniformDefinitions() {
        return this.uniformDefinitions;
    }
}

// ============================================================================
// 🎯 HYPERCUBE CORE - CENTRAL COORDINATION CLASS
// ============================================================================

class HypercubeCore {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = {
            enableDebug: false,
            defaultGeometry: 'hypercube',
            defaultProjection: 'perspective',
            ...options
        };
        
        // Initialize WebGL context
        this.gl = this.initWebGL();
        if (!this.gl) {
            throw new Error('Failed to initialize WebGL context');
        }
        
        // Initialize managers
        this.geometryManager = new GeometryManager({ 
            defaultGeometry: this.options.defaultGeometry 
        });
        this.projectionManager = new ProjectionManager({ 
            defaultProjection: this.options.defaultProjection 
        });
        this.shaderManager = new ShaderManager(this.gl, { 
            enableDebug: this.options.enableDebug 
        });
        
        // State tracking
        this.state = {
            lastTime: 0,
            mousePosition: [0.5, 0.5],
            isAnimating: false
        };
        
        // Setup
        this.setupCanvas();
        this.createShaderProgram();
        this.setupBuffers();
        this.setupEventListeners();
        
        console.log('✅ HypercubeCore initialized successfully');
        
        // Start animation loop
        this.startAnimation();
    }
    
    /**
     * Initialize WebGL context with proper settings
     */
    initWebGL() {
        const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
        
        if (!gl) {
            console.error('WebGL not supported');
            return null;
        }
        
        // Enable necessary extensions
        gl.getExtension('OES_standard_derivatives');
        
        // Set up WebGL state
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        return gl;
    }
    
    /**
     * Setup canvas size and handling
     */
    setupCanvas() {
        this.resize();
        
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        // Update resolution uniform
        this.shaderManager.setUniform('u_resolution', [this.canvas.width, this.canvas.height]);
    }
    
    /**
     * Create shader program using current geometry and projection
     */
    createShaderProgram() {
        const vertexSource = this.getVertexShader();
        const fragmentSource = this.getFragmentShader();
        
        const program = this.shaderManager.createProgram(vertexSource, fragmentSource);
        if (!program) {
            throw new Error('Failed to create shader program');
        }
        
        return program;
    }
    
    /**
     * Generate vertex shader source
     */
    getVertexShader() {
        return `
            precision highp float;
            attribute vec3 position;
            uniform vec2 u_resolution;
            
            void main() {
                vec2 clipSpace = ((position.xy / u_resolution) * 2.0) - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            }
        `;
    }
    
    /**
     * Generate fragment shader source using current geometry and projection
     */
    getFragmentShader() {
        const currentGeometry = this.geometryManager.getCurrentGeometry();
        const currentProjection = this.projectionManager.getCurrentProjection();
        
        if (!currentGeometry || !currentProjection) {
            console.error('No geometry or projection available for shader generation');
            return this.getFallbackFragmentShader();
        }
        
        return `
            precision highp float;
            
            // All 17 shader uniforms from VIB3_COMPLETE_PARAMETER_CODEX.md
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_dimension;
            uniform float u_gridDensity;
            uniform float u_lineThickness;
            uniform float u_universeModifier;
            uniform float u_patternIntensity;
            uniform float u_morphFactor;
            uniform float u_rotationSpeed;
            uniform float u_shellWidth;
            uniform float u_tetraThickness;
            uniform float u_glitchIntensity;
            uniform float u_colorShift;
            uniform float u_audioBass;
            uniform float u_audioMid;
            uniform float u_audioHigh;
            
            // 4D rotation matrices
            mat4 rotateXW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    c, 0, 0, s,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    -s, 0, 0, c
                );
            }
            
            mat4 rotateYZ(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1, 0, 0, 0,
                    0, c, -s, 0,
                    0, s, c, 0,
                    0, 0, 0, 1
                );
            }
            
            mat4 rotateZW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, c, s,
                    0, 0, -s, c
                );
            }
            
            mat4 rotateYW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1, 0, 0, 0,
                    0, c, 0, s,
                    0, 0, 1, 0,
                    0, -s, 0, c
                );
            }
            
            // Current projection method
            ${currentProjection.getShaderCode()}
            
            // Current geometry calculation
            ${currentGeometry.getShaderCode()}
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec3 p = vec3((uv - 0.5) * 2.0, 0.0);
                
                // Calculate lattice value using current geometry
                float latticeValue = calculateLattice(p);
                
                // Apply universe modifier
                latticeValue = pow(latticeValue, u_universeModifier);
                
                // Base color with interaction modulation
                vec3 baseColor = vec3(1.0, 0.0, 1.0); // Magenta default
                baseColor *= u_patternIntensity;
                baseColor += vec3(u_audioBass * 0.3, u_audioMid * 0.3, u_audioHigh * 0.3);
                
                // Color shift
                float hueShift = u_colorShift * 6.28318;
                mat3 hueRotation = mat3(
                    cos(hueShift), -sin(hueShift), 0,
                    sin(hueShift), cos(hueShift), 0,
                    0, 0, 1
                );
                baseColor = hueRotation * baseColor;
                
                // Glitch effect
                vec2 glitchOffset = vec2(u_glitchIntensity * sin(u_time * 10.0), 0);
                vec3 finalColor = mix(vec3(0), baseColor, latticeValue);
                
                gl_FragColor = vec4(finalColor, latticeValue);
            }
        `;
    }
    
    /**
     * Fallback fragment shader when geometry/projection unavailable
     */
    getFallbackFragmentShader() {
        return `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec3 color = vec3(uv.x, uv.y, sin(u_time));
                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }
    
    /**
     * Setup vertex buffers for full-screen quad
     */
    setupBuffers() {
        const gl = this.gl;
        
        // Full-screen quad vertices
        const vertices = new Float32Array([
            -1, -1, 0,
             1, -1, 0,
            -1,  1, 0,
             1,  1, 0
        ]);
        
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        // Get position attribute location
        this.positionAttribute = gl.getAttribLocation(this.shaderManager.program, 'position');
        gl.enableVertexAttribArray(this.positionAttribute);
        gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0);
    }
    
    /**
     * Setup event listeners for interaction
     */
    setupEventListeners() {
        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y
            
            this.state.mousePosition = [x, y];
            this.shaderManager.setUniform('u_mouse', [x, y]);
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    /**
     * Handle canvas resize
     */
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.shaderManager.setUniform('u_resolution', [this.canvas.width, this.canvas.height]);
        }
    }
    
    /**
     * Update all system parameters
     */
    updateParameters(params) {
        // Update geometry parameters
        this.geometryManager.updateParameters(params);
        
        // Update projection parameters  
        this.projectionManager.updateParameters(params);
        
        // Update shader uniforms
        this.shaderManager.setUniforms(params);
        
        // Regenerate shader if geometry or projection changed
        if (params.geometryType || params.projectionMethod) {
            if (params.geometryType) {
                this.geometryManager.setCurrentGeometry(params.geometryType);
            }
            if (params.projectionMethod) {
                this.projectionManager.setCurrentProjection(params.projectionMethod);
            }
            this.createShaderProgram();
        }
    }
    
    /**
     * Start animation loop
     */
    startAnimation() {
        this.state.isAnimating = true;
        this.animate(0);
    }
    
    /**
     * Stop animation loop
     */
    stopAnimation() {
        this.state.isAnimating = false;
    }
    
    /**
     * Main animation loop
     */
    animate(time) {
        if (!this.state.isAnimating) return;
        
        // Update time uniform
        this.shaderManager.setUniform('u_time', time * 0.001);
        
        // Update all dirty uniforms
        this.shaderManager.updateUniforms();
        
        // Render frame
        this.render();
        
        // Continue animation
        requestAnimationFrame((t) => this.animate(t));
    }
    
    /**
     * Render current frame
     */
    render() {
        const gl = this.gl;
        
        // Clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use shader program
        gl.useProgram(this.shaderManager.program);
        
        // Bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.positionAttribute);
        gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        // Draw full-screen quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    /**
     * Get current system status
     */
    getStatus() {
        return {
            geometry: this.geometryManager.currentGeometry,
            projection: this.projectionManager.currentProjection,
            uniforms: this.shaderManager.getAllUniforms(),
            isAnimating: this.state.isAnimating,
            availableGeometries: this.geometryManager.getGeometryTypes(),
            availableProjections: this.projectionManager.getProjectionTypes()
        };
    }
}

// ============================================================================
// 🎯 EXPORT PHASE 1 CORE ARCHITECTURE
// ============================================================================

// Export all core classes for use in production system
window.VIB34D_Phase1 = {
    BaseGeometry,
    BaseProjection,
    GeometryManager,
    ProjectionManager,
    ShaderManager,
    HypercubeCore
};

console.log('✅ VIB34D Phase 1 Core Architecture loaded successfully');
console.log('📊 Available classes:', Object.keys(window.VIB34D_Phase1));