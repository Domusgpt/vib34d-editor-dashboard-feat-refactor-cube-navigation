/**
 * VIB34D ADAPTIVE CARD VISUALIZER
 * Adapts the working demo's ReactiveHyperAVCore into card-based architecture
 * with dynamic subclasses and master key integration
 */

// WebGL Context Pool Manager - Prevents context overflow
class WebGLContextPool {
    constructor() {
        this.pool = [];
        this.activeContexts = new Set();
        this.maxContexts = 4; // Maximum active WebGL contexts
        this.canvasIndex = 0;
    }
    
    getContext(width = 400, height = 300) {
        // Reuse existing context if available
        for (let i = 0; i < this.pool.length; i++) {
            const contextData = this.pool[i];
            if (!this.activeContexts.has(contextData.canvas)) {
                // Resize canvas to requested dimensions
                contextData.canvas.width = width;
                contextData.canvas.height = height;
                this.activeContexts.add(contextData.canvas);
                console.log(`🔄 Reusing WebGL context ${i}`);
                return contextData;
            }
        }
        
        // If we've hit the limit, reuse the oldest context
        if (this.pool.length >= this.maxContexts) {
            const oldestContext = this.pool[0];
            this.releaseContext(oldestContext.canvas);
            oldestContext.canvas.width = width;
            oldestContext.canvas.height = height;
            this.activeContexts.add(oldestContext.canvas);
            console.log(`🔄 Recycling oldest WebGL context`);
            return oldestContext;
        }
        
        // Create new context
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.className = 'vib34d-pooled-canvas';
        canvas.id = `vib34d-canvas-${this.canvasIndex++}`;
        
        const gl = canvas.getContext('webgl', { 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: false // Optimize memory
        }) || canvas.getContext('experimental-webgl', { 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: false
        });
        
        if (!gl) {
            console.error('❌ Failed to create WebGL context');
            return null;
        }
        
        const contextData = { canvas, gl, id: canvas.id };
        this.pool.push(contextData);
        this.activeContexts.add(canvas);
        
        console.log(`✨ Created new WebGL context ${contextData.id} (${this.pool.length}/${this.maxContexts})`);
        return contextData;
    }
    
    releaseContext(canvas) {
        this.activeContexts.delete(canvas);
        console.log(`🔓 Released WebGL context ${canvas.id}`);
    }
    
    clearInactiveContexts() {
        // Clean up contexts that are no longer in DOM
        this.pool = this.pool.filter(contextData => {
            if (!document.body.contains(contextData.canvas)) {
                this.activeContexts.delete(contextData.canvas);
                console.log(`🗑️ Cleaned up orphaned context ${contextData.id}`);
                return false;
            }
            return true;
        });
    }
}

// Create global context pool
window.vib34dContextPool = window.vib34dContextPool || new WebGLContextPool();

class AdaptiveCardVisualizer {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.buffers = {};
        this.isInitialized = false;
        
        // Card-specific options
        this.options = {
            width: options.width || 400,
            height: options.height || 300,
            geometry: options.geometry || 0, // 0-7 for 8 geometry types
            theme: options.theme || 'hypercube',
            responsive: options.responsive !== false,
            masterKey: options.masterKey || 1.0,
            subclasses: options.subclasses || [],
            editorMode: options.editorMode || false,
            ...options
        };
        
        // Geometry configurations from demo (as multipliers of hypercube base)
        this.geometryConfigs = {
            0: { name: 'hypercube', multiplier: 1.0, complexity: 1.0 },
            1: { name: 'tetrahedron', multiplier: 0.618, complexity: 0.5 },
            2: { name: 'sphere', multiplier: 1.414, complexity: 0.8 },
            3: { name: 'torus', multiplier: 2.0, complexity: 1.2 },
            4: { name: 'klein', multiplier: 1.618, complexity: 1.5 },
            5: { name: 'fractal', multiplier: 2.718, complexity: 2.0 },
            6: { name: 'wave', multiplier: 3.141, complexity: 0.7 },
            7: { name: 'crystal', multiplier: 1.732, complexity: 1.3 }
        };
        
        // Animation state
        this.time = 0;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        
        // Editor parameters
        this.editorParams = {
            rotation: 0,
            scale: 1,
            intensity: 1,
            complexity: 1,
            colorShift: 0,
            distortion: 0,
            ...options.editorParams
        };
        
        this.init();
    }
    
    init() {
        console.log(`🎨 Initializing AdaptiveCardVisualizer for geometry ${this.options.geometry}...`);
        
        try {
            // Use existing canvas if provided, otherwise get from pool
            if (this.options.canvas) {
                console.log('🎨 Using provided canvas element:', this.options.canvas.id);
                this.canvas = this.options.canvas;
                this.canvas.width = this.options.width;
                this.canvas.height = this.options.height;
                this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: true });
                this.contextId = this.canvas.id || 'provided-canvas';
            } else {
                // Get WebGL context from pool
                console.log('🔧 Getting WebGL context from pool...');
                const contextData = window.vib34dContextPool.getContext(this.options.width, this.options.height);
                
                if (!contextData) {
                    console.log('⚠️ WebGL context pool exhausted, falling back to Canvas 2D');
                    this.initCanvas2DFallback();
                    return;
                }
                
                this.canvas = contextData.canvas;
                this.gl = contextData.gl;
                this.contextId = contextData.id;
            }
            
            // Update canvas styling and make it visible
            this.canvas.className = 'vib34d-adaptive-canvas';
            this.canvas.style.display = 'block';
            this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            this.canvas.style.border = '1px solid rgba(0, 255, 255, 0.3)';
            console.log(`🖼️ Canvas styled and made visible: ${this.canvas.width}x${this.canvas.height}`);
            
            // Apply dynamic subclasses
            if (this.options.subclasses.length > 0) {
                this.canvas.className += ' ' + this.options.subclasses.join(' ');
            }
            
            // Only append if canvas not already in container
            if (!this.options.canvas) {
                this.container.appendChild(this.canvas);
            }
            
            console.log(`✅ Using WebGL context ${this.contextId}`);
            
            // Setup WebGL components
            if (!this.setupShaders()) {
                console.log('❌ Shader setup failed, falling back to Canvas 2D');
                this.initCanvas2DFallback();
                return;
            }
            
            this.setupBuffers();
            this.setupUniforms();
            
            // Add interactivity
            this.setupInteraction();
            
            // Handle responsive sizing
            if (this.options.responsive) {
                this.setupResponsive();
            }
            
            // Start WebGL animation
            this.isInitialized = true;
            this.animate();
            
            console.log(`✅ WebGL visualizer initialized for geometry ${this.options.geometry}`);
            
        } catch (error) {
            console.error('❌ Error during initialization, falling back to Canvas 2D:', error);
            this.initCanvas2DFallback();
        }
    }
    
    setupShaders() {
        try {
            // DEBUG: Simplified vertex shader that MUST work
            const vertexShaderSource = `
                precision mediump float;
                attribute vec3 a_position;
                uniform mat4 u_matrix;
                uniform float u_time;
                uniform float u_geometry;
                uniform float u_masterKey;
                varying vec3 v_position;
                varying float v_depth;
                
                void main() {
                    // DEBUG: Use simple position with no complex transformations
                    vec3 pos = a_position * 0.5; // Make smaller to ensure it's in view
                    
                    // Simple rotation only
                    float angle = u_time * 0.2;
                    float c = cos(angle);
                    float s = sin(angle);
                    
                    vec3 rotated = vec3(
                        pos.x * c - pos.z * s,
                        pos.y,
                        pos.x * s + pos.z * c
                    );
                    
                    v_position = rotated;
                    v_depth = 0.0;
                    
                    // DEBUG: Use simple orthographic projection instead of complex matrix
                    gl_Position = vec4(rotated.xy, 0.0, 1.0);
                }
            `;
            
            // DEBUG: Simple fragment shader that MUST be visible
            const fragmentShaderSource = `
                precision mediump float;
                
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform vec2 u_mouse;
                uniform float u_geometry;
                uniform float u_intensity;
                uniform float u_complexity;
                uniform float u_rotation;
                uniform float u_scale;
                uniform float u_colorShift;
                uniform float u_distortion;
                uniform float u_audioLevel;
                uniform float u_beatPulse;
                uniform float u_dimension;
                uniform float u_projection;
                uniform float u_emergence;
                uniform float u_crystallization;
                uniform float u_holographic;
                
                varying vec3 v_position;
                varying float v_depth;
                
                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution;
                    
                    // DEBUG: Force bright, obvious colors that MUST be visible
                    vec3 debugColor = vec3(
                        0.5 + 0.5 * sin(u_time + uv.x * 10.0),
                        0.5 + 0.5 * sin(u_time + uv.y * 10.0 + 2.0),
                        0.5 + 0.5 * sin(u_time + (uv.x + uv.y) * 10.0 + 4.0)
                    );
                    
                    // Ensure minimum brightness - FORCE visibility
                    debugColor = max(debugColor, vec3(0.3));
                    
                    // Add pulsing to make it obvious
                    float pulse = 0.7 + 0.3 * sin(u_time * 3.0);
                    debugColor *= pulse;
                    
                    // Force full opacity
                    gl_FragColor = vec4(debugColor, 1.0);
                }
            `;
            
            // Compile shaders
            const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
            
            if (!vertexShader || !fragmentShader) {
                console.error('❌ Shader compilation failed');
                return false;
            }
            
            // Create program
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, vertexShader);
            this.gl.attachShader(this.program, fragmentShader);
            this.gl.linkProgram(this.program);
            
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                console.error('❌ Shader program failed to link:', this.gl.getProgramInfoLog(this.program));
                return false;
            }
            
            console.log('✅ Shaders compiled and linked successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Error in shader setup:', error);
            return false;
        }
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }
    
    setupBuffers() {
        // Create geometry based on current geometry type
        const geometry = this.createGeometry(this.options.geometry);
        
        // Position buffer
        this.buffers.position = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), this.gl.STATIC_DRAW);
        
        // Index buffer
        this.buffers.indices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.indices), this.gl.STATIC_DRAW);
        
        this.indexCount = geometry.indices.length;
    }
    
    createGeometry(type) {
        const config = this.geometryConfigs[type] || this.geometryConfigs[0];
        
        // Base hypercube vertices (8 vertices of a cube for simplicity)
        const baseVertices = [
            -1, -1, -1,  1, -1, -1,  1,  1, -1, -1,  1, -1,
            -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1
        ];
        
        // Apply geometry-specific transformation
        const vertices = [];
        for (let i = 0; i < baseVertices.length; i += 3) {
            vertices.push(
                baseVertices[i] * config.multiplier,
                baseVertices[i + 1] * config.multiplier,
                baseVertices[i + 2] * config.multiplier
            );
        }
        
        // Cube indices
        const indices = [
            0, 1, 2, 0, 2, 3,  // Front
            4, 5, 6, 4, 6, 7,  // Back
            0, 4, 5, 0, 5, 1,  // Bottom
            2, 6, 7, 2, 7, 3,  // Top
            0, 4, 7, 0, 7, 3,  // Left
            1, 5, 6, 1, 6, 2   // Right
        ];
        
        return { vertices, indices };
    }
    
    setupUniforms() {
        // Get all uniform locations
        const uniformNames = [
            'u_matrix', 'u_time', 'u_resolution', 'u_mouse', 'u_geometry',
            'u_intensity', 'u_complexity', 'u_rotation', 'u_scale',
            'u_colorShift', 'u_distortion', 'u_audioLevel', 'u_beatPulse',
            'u_dimension', 'u_projection', 'u_emergence', 'u_crystallization',
            'u_holographic', 'u_masterKey'
        ];
        
        uniformNames.forEach(name => {
            this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
        });
        
        // Get attribute location
        this.uniforms.a_position = this.gl.getAttribLocation(this.program, 'a_position');
    }
    
    setupInteraction() {
        // Mouse tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height * 2 - 1);
        });
        
        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.mouse.x = (touch.clientX - rect.left) / rect.width * 2 - 1;
                this.mouse.y = -((touch.clientY - rect.top) / rect.height * 2 - 1);
            }
        });
    }
    
    setupResponsive() {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.canvas.width = width;
                this.canvas.height = height;
                this.gl.viewport(0, 0, width, height);
            }
        });
        
        resizeObserver.observe(this.container);
    }
    
    updateGeometry(geometryIndex) {
        this.options.geometry = geometryIndex;
        this.setupBuffers();
    }
    
    updateParams(params) {
        Object.assign(this.editorParams, params);
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        this.time += 0.016; // ~60fps
        
        // Clear with subtle background that shows geometry
        const bgAlpha = 0.1 + Math.sin(this.time * 0.5) * 0.05; // Subtle pulsing background
        const bgIntensity = 0.03 + this.editorParams.intensity * 0.02;
        this.gl.clearColor(
            bgIntensity, 
            bgIntensity * 0.7, 
            bgIntensity * 1.2, 
            bgAlpha
        );
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Enable depth testing and blending for proper 3D rendering
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Use program
        this.gl.useProgram(this.program);
        
        // Update uniforms
        this.gl.uniform1f(this.uniforms.u_time, this.time);
        this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.uniforms.u_mouse, this.mouse.x, this.mouse.y);
        this.gl.uniform1f(this.uniforms.u_geometry, this.options.geometry);
        this.gl.uniform1f(this.uniforms.u_masterKey, this.options.masterKey);
        
        // Editor parameters
        this.gl.uniform1f(this.uniforms.u_intensity, this.editorParams.intensity);
        this.gl.uniform1f(this.uniforms.u_complexity, this.editorParams.complexity);
        this.gl.uniform1f(this.uniforms.u_rotation, this.editorParams.rotation);
        this.gl.uniform1f(this.uniforms.u_scale, this.editorParams.scale);
        this.gl.uniform1f(this.uniforms.u_colorShift, this.editorParams.colorShift);
        this.gl.uniform1f(this.uniforms.u_distortion, this.editorParams.distortion);
        
        // Fixed values for now
        this.gl.uniform1f(this.uniforms.u_audioLevel, 0.5);
        this.gl.uniform1f(this.uniforms.u_beatPulse, Math.sin(this.time * 2) * 0.5 + 0.5);
        this.gl.uniform1f(this.uniforms.u_dimension, 4.0);
        this.gl.uniform1f(this.uniforms.u_projection, 1.0);
        this.gl.uniform1f(this.uniforms.u_emergence, 0.8);
        this.gl.uniform1f(this.uniforms.u_crystallization, 0.6);
        this.gl.uniform1f(this.uniforms.u_holographic, 1.0);
        
        // Create perspective matrix
        const matrix = this.createPerspectiveMatrix();
        this.gl.uniformMatrix4fv(this.uniforms.u_matrix, false, matrix);
        
        // Bind buffers and draw
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.enableVertexAttribArray(this.uniforms.a_position);
        this.gl.vertexAttribPointer(this.uniforms.a_position, 3, this.gl.FLOAT, false, 0, 0);
        
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        
        // Draw filled triangles
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
        
        // Also draw wireframe for extra visibility
        this.gl.enable(this.gl.POLYGON_OFFSET_FILL);
        this.gl.polygonOffset(1.0, 1.0);
        
        // Set wireframe color uniform (brighter)
        this.gl.uniform1f(this.uniforms.u_intensity, this.editorParams.intensity * 2.0);
        
        // Draw wireframe lines
        for (let i = 0; i < this.indexCount; i += 3) {
            this.gl.drawElements(this.gl.LINE_LOOP, 3, this.gl.UNSIGNED_SHORT, i * 2);
        }
        
        this.gl.disable(this.gl.POLYGON_OFFSET_FILL);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    createPerspectiveMatrix() {
        const aspect = this.canvas.width / this.canvas.height;
        const fov = Math.PI / 4;
        const near = 0.1;
        const far = 100;
        
        // Create perspective projection matrix
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const rangeInv = 1.0 / (near - far);
        
        const perspective = new Float32Array(16);
        perspective[0] = f / aspect;
        perspective[5] = f;
        perspective[10] = (near + far) * rangeInv;
        perspective[11] = -1;
        perspective[14] = near * far * rangeInv * 2;
        perspective[15] = 0;
        
        // Create view matrix (camera positioned back to see geometry)
        const view = new Float32Array(16);
        view[0] = 1; view[5] = 1; view[10] = 1; view[15] = 1; // Identity
        view[14] = -5; // Move camera back 5 units to see geometry
        
        // Create rotation matrix
        const rotX = this.time * 0.5 + this.editorParams.rotation;
        const rotY = this.time * 0.3;
        const rotZ = this.time * 0.2;
        
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);
        
        // Combined rotation matrix
        const rotation = new Float32Array(16);
        rotation[0] = cosY * cosZ;
        rotation[1] = -cosY * sinZ;
        rotation[2] = sinY;
        rotation[4] = cosX * sinZ + sinX * sinY * cosZ;
        rotation[5] = cosX * cosZ - sinX * sinY * sinZ;
        rotation[6] = -sinX * cosY;
        rotation[8] = sinX * sinZ - cosX * sinY * cosZ;
        rotation[9] = sinX * cosZ + cosX * sinY * sinZ;
        rotation[10] = cosX * cosY;
        rotation[15] = 1;
        
        // Apply scale - make geometry much larger and more visible
        const scale = this.editorParams.scale * 2.0; // Doubled scale for visibility
        rotation[0] *= scale;
        rotation[5] *= scale;
        rotation[10] *= scale;
        
        // Multiply matrices: perspective * view * rotation
        const result = new Float32Array(16);
        this.multiplyMatrices(result, perspective, view);
        this.multiplyMatrices(result, result, rotation);
        
        return result;
    }
    
    multiplyMatrices(out, a, b) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        
        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
        
        out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
        out[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
        out[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
        out[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
        out[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
        out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
        out[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
        out[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
        out[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
        out[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
        out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
        out[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
        out[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
        out[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
        out[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
        out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    }
    
    initCanvas2DFallback() {
        console.log(`🎨 Initializing Canvas 2D fallback for geometry ${this.options.geometry}`);
        
        try {
            this.ctx = this.canvas.getContext('2d');
            this.isInitialized = true;
            
            // Start 2D animation
            this.animate2D();
            
            console.log(`✅ Canvas 2D fallback initialized for geometry ${this.options.geometry}`);
        } catch (error) {
            console.error('❌ Canvas 2D fallback failed:', error);
        }
    }
    
    animate2D() {
        if (!this.isInitialized || !this.ctx) return;
        
        this.time += 0.016;
        
        // Clear canvas with slight fade for trail effect
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1.0;
        
        // Get geometry configuration
        const config = this.geometryConfigs[this.options.geometry] || this.geometryConfigs[0];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.6;
        const radius = baseRadius * config.multiplier * this.editorParams.scale;
        
        // Base color from geometry index with color shift
        const baseHue = (this.options.geometry * 45 + this.editorParams.colorShift) % 360;
        
        // Draw geometry-specific pattern
        switch (this.options.geometry) {
            case 0: // Hypercube
                this.draw2DHypercube(centerX, centerY, radius, baseHue);
                break;
            case 1: // Tetrahedron
                this.draw2DTetrahedron(centerX, centerY, radius, baseHue);
                break;
            case 2: // Sphere
                this.draw2DSphere(centerX, centerY, radius, baseHue);
                break;
            case 3: // Torus
                this.draw2DTorus(centerX, centerY, radius, baseHue);
                break;
            case 4: // Klein
                this.draw2DKlein(centerX, centerY, radius, baseHue);
                break;
            case 5: // Fractal
                this.draw2DFractal(centerX, centerY, radius, baseHue);
                break;
            case 6: // Wave
                this.draw2DWave(centerX, centerY, radius, baseHue);
                break;
            case 7: // Crystal
                this.draw2DCrystal(centerX, centerY, radius, baseHue);
                break;
        }
        
        // Add holographic center glow
        const pulseRadius = 15 + Math.sin(this.time * 3) * 8;
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        gradient.addColorStop(0, `hsla(${baseHue}, 100%, 80%, ${this.editorParams.intensity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        requestAnimationFrame(() => this.animate2D());
    }
    
    draw2DHypercube(centerX, centerY, radius, hue) {
        const points = 8;
        const innerRadius = radius * 0.5;
        
        // Outer cube
        this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2 + this.time + this.editorParams.rotation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        
        // Inner cube with connections
        this.ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 100%, 50%, ${this.editorParams.intensity * 0.7})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2 - this.time + this.editorParams.rotation;
            const x = centerX + Math.cos(angle) * innerRadius;
            const y = centerY + Math.sin(angle) * innerRadius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
    
    draw2DTetrahedron(centerX, centerY, radius, hue) {
        const points = 3;
        this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2 + this.time + this.editorParams.rotation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
    
    draw2DSphere(centerX, centerY, radius, hue) {
        // Multiple concentric circles
        for (let i = 1; i <= 5; i++) {
            const r = radius * (i / 5);
            const alpha = this.editorParams.intensity * (1 - i / 6);
            this.ctx.strokeStyle = `hsla(${hue + i * 20}, 100%, 60%, ${alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    draw2DTorus(centerX, centerY, radius, hue) {
        // Flowing torus pattern
        const segments = 16;
        this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * Math.PI * 2 + this.time;
            const angle2 = ((i + 1) / segments) * Math.PI * 2 + this.time;
            const r1 = radius + Math.sin(angle1 * 3) * radius * 0.3;
            const r2 = radius + Math.sin(angle2 * 3) * radius * 0.3;
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + Math.cos(angle1) * r1, centerY + Math.sin(angle1) * r1);
            this.ctx.lineTo(centerX + Math.cos(angle2) * r2, centerY + Math.sin(angle2) * r2);
            this.ctx.stroke();
        }
    }
    
    draw2DKlein(centerX, centerY, radius, hue) {
        // Klein bottle topology approximation
        const segments = 20;
        this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 4 + this.time;
            const x = centerX + radius * Math.cos(t) * (1 + Math.cos(t / 2) * 0.5);
            const y = centerY + radius * Math.sin(t) * Math.sin(t / 2) * 0.5;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
    
    draw2DFractal(centerX, centerY, radius, hue) {
        // Recursive fractal pattern
        const drawBranch = (x, y, length, angle, depth) => {
            if (depth === 0) return;
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            this.ctx.strokeStyle = `hsla(${hue + depth * 30}, 100%, 60%, ${this.editorParams.intensity * (depth / 4)})`;
            this.ctx.lineWidth = depth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            
            const newLength = length * 0.7;
            drawBranch(endX, endY, newLength, angle - 0.5 + this.time * 0.1, depth - 1);
            drawBranch(endX, endY, newLength, angle + 0.5 - this.time * 0.1, depth - 1);
        };
        
        drawBranch(centerX, centerY + radius * 0.3, radius * 0.6, -Math.PI / 2, 4);
    }
    
    draw2DWave(centerX, centerY, radius, hue) {
        // Wave function pattern
        const segments = 50;
        this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i <= segments; i++) {
            const x = centerX - radius + (i / segments) * radius * 2;
            const y = centerY + Math.sin((i / segments) * Math.PI * 4 + this.time * 2) * radius * 0.3;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
    
    draw2DCrystal(centerX, centerY, radius, hue) {
        // Crystal lattice structure
        const points = 6;
        for (let ring = 1; ring <= 3; ring++) {
            const r = radius * (ring / 3);
            this.ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity * (1 - ring / 4)})`;
            this.ctx.lineWidth = 2;
            
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2 + this.time * 0.5;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                
                // Draw connections to center
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                
                // Draw connections to adjacent points
                const nextAngle = ((i + 1) / points) * Math.PI * 2 + this.time * 0.5;
                const nextX = centerX + Math.cos(nextAngle) * r;
                const nextY = centerY + Math.sin(nextAngle) * r;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(nextX, nextY);
                this.ctx.stroke();
            }
        }
    }
    
    updateGeometry(newGeometry, vib3Params = {}) {
        if (!this.isInitialized) return;
        
        this.options.geometry = newGeometry;
        this.vib3Params = vib3Params;
        console.log(`🔄 Geometry updated to: ${newGeometry} with VIB3 params:`, vib3Params);
        
        // Update WebGL uniforms to reflect new geometry and VIB3 parameters
        if (this.gl && this.program) {
            this.setupUniforms(); // Use existing method
            this.updateVIB3Uniforms(vib3Params);
        }
    }
    
    updateVIB3Uniforms(params) {
        if (!this.gl || !this.program) return;
        
        const gl = this.gl;
        
        // Apply VIB3 parameters to shader uniforms with visual feedback
        if (params.intensity !== undefined) {
            const intensityLocation = gl.getUniformLocation(this.program, 'u_intensity');
            if (intensityLocation) gl.uniform1f(intensityLocation, params.intensity);
        }
        
        if (params.dimension !== undefined) {
            const dimensionLocation = gl.getUniformLocation(this.program, 'u_dimension');
            if (dimensionLocation) gl.uniform1f(dimensionLocation, params.dimension);
        }
        
        if (params.complexity !== undefined) {
            const complexityLocation = gl.getUniformLocation(this.program, 'u_emergence');
            if (complexityLocation) gl.uniform1f(complexityLocation, params.complexity);
        }
        
        if (params.coherence !== undefined) {
            const coherenceLocation = gl.getUniformLocation(this.program, 'u_crystallization');
            if (coherenceLocation) gl.uniform1f(coherenceLocation, params.coherence);
        }
        
        // Update geometry uniform based on current geometry
        const geometryMap = {
            'hypercube': 1.0,
            'tetrahedron': 2.0,
            'sphere': 3.0,
            'torus': 4.0,
            'fractal': 5.0
        };
        
        const geometryValue = geometryMap[this.options.geometry] || 1.0;
        const geometryLocation = gl.getUniformLocation(this.program, 'u_geometry');
        if (geometryLocation) {
            gl.uniform1f(geometryLocation, geometryValue);
            console.log(`🔄 Geometry uniform updated: ${this.options.geometry} = ${geometryValue}`);
        }
        
        console.log('✅ VIB3 uniforms updated with visual changes');
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Release WebGL context back to pool
        if (this.canvas && this.contextId && window.vib34dContextPool) {
            window.vib34dContextPool.releaseContext(this.canvas);
            console.log(`🔓 Released WebGL context ${this.contextId} back to pool`);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.gl = null;
        this.contextId = null;
        this.isInitialized = false;
    }
    
    // Static method to clean up inactive contexts
    static cleanupContextPool() {
        if (window.vib34dContextPool) {
            window.vib34dContextPool.clearInactiveContexts();
        }
    }
}

// Factory function for creating card visualizers
function createCardVisualizer(container, options) {
    return new AdaptiveCardVisualizer(container, options);
}

// Global window exports for direct usage
window.AdaptiveCardVisualizer = AdaptiveCardVisualizer;
window.createCardVisualizer = createCardVisualizer;

// Integration with VIB3STYLEPACK
if (window.VIB34D) {
    window.VIB34D.AdaptiveCardVisualizer = AdaptiveCardVisualizer;
    window.VIB34D.createCardVisualizer = createCardVisualizer;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveCardVisualizer, createCardVisualizer };
}