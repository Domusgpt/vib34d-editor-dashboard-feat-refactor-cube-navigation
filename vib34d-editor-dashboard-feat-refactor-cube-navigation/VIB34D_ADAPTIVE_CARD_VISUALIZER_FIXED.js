/**
 * VIB34D ADAPTIVE CARD VISUALIZER - FIXED VERSION
 * Comprehensive fixes for WebGL rendering issues with robust fallbacks
 */

// WebGL Context Pool Manager - Enhanced version
class WebGLContextPool {
    constructor() {
        this.pool = [];
        this.activeContexts = new Set();
        this.maxContexts = 4;
        this.canvasIndex = 0;
        this.contextLossHandlers = new Map();
    }
    
    getContext(width = 400, height = 300) {
        // Reuse existing context if available
        for (let i = 0; i < this.pool.length; i++) {
            const contextData = this.pool[i];
            if (!this.activeContexts.has(contextData.canvas)) {
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
        
        // Create new context with better error handling
        return this.createNewContext(width, height);
    }

    createNewContext(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.className = 'vib34d-pooled-canvas';
        canvas.id = `vib34d-canvas-${this.canvasIndex++}`;
        
        // Enhanced context creation with multiple fallbacks
        const contextOptions = { 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: 'default', // Try default first
            failIfMajorPerformanceCaveat: false
        };
        
        let gl = null;
        
        // Try WebGL 2 first
        try {
            gl = canvas.getContext('webgl2', contextOptions);
        } catch (e) {
            console.warn('WebGL2 failed:', e.message);
        }
        
        // Fall back to WebGL 1
        if (!gl) {
            try {
                gl = canvas.getContext('webgl', contextOptions);
            } catch (e) {
                console.warn('WebGL failed:', e.message);
            }
        }
        
        // Fall back to experimental-webgl
        if (!gl) {
            try {
                gl = canvas.getContext('experimental-webgl', contextOptions);
            } catch (e) {
                console.warn('Experimental WebGL failed:', e.message);
            }
        }
        
        if (!gl) {
            console.error('❌ Failed to create any WebGL context');
            return null;
        }
        
        // Setup context loss recovery
        this.setupContextLossRecovery(canvas, gl);
        
        const contextData = { canvas, gl, id: canvas.id };
        this.pool.push(contextData);
        this.activeContexts.add(canvas);
        
        console.log(`✨ Created new WebGL context ${contextData.id} (${this.pool.length}/${this.maxContexts})`);
        return contextData;
    }

    setupContextLossRecovery(canvas, gl) {
        canvas.addEventListener('webglcontextlost', (event) => {
            console.warn('⚠️ WebGL context lost for canvas:', canvas.id);
            event.preventDefault();
            
            // Notify any handlers
            const handler = this.contextLossHandlers.get(canvas);
            if (handler) {
                handler.onContextLost();
            }
        });
        
        canvas.addEventListener('webglcontextrestored', (event) => {
            console.log('✅ WebGL context restored for canvas:', canvas.id);
            
            // Notify any handlers
            const handler = this.contextLossHandlers.get(canvas);
            if (handler) {
                handler.onContextRestored();
            }
        });
    }

    registerContextLossHandler(canvas, handler) {
        this.contextLossHandlers.set(canvas, handler);
    }
    
    releaseContext(canvas) {
        this.activeContexts.delete(canvas);
        this.contextLossHandlers.delete(canvas);
        console.log(`🔓 Released WebGL context ${canvas.id}`);
    }
    
    clearInactiveContexts() {
        this.pool = this.pool.filter(contextData => {
            if (!document.body.contains(contextData.canvas)) {
                this.activeContexts.delete(contextData.canvas);
                this.contextLossHandlers.delete(contextData.canvas);
                console.log(`🗑️ Cleaned up orphaned context ${contextData.id}`);
                return false;
            }
            return true;
        });
    }
}

// Create global context pool
window.vib34dContextPool = window.vib34dContextPool || new WebGLContextPool();

class AdaptiveCardVisualizerFixed {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.buffers = {};
        this.isInitialized = false;
        this.contextLost = false;
        this.renderingMode = 'webgl'; // 'webgl' or 'canvas2d'
        
        // Card-specific options
        this.options = {
            width: options.width || 400,
            height: options.height || 300,
            geometry: options.geometry || 0,
            theme: options.theme || 'hypercube',
            responsive: options.responsive !== false,
            masterKey: options.masterKey || 1.0,
            subclasses: options.subclasses || [],
            editorMode: options.editorMode || false,
            forceCanvas2D: options.forceCanvas2D || false,
            ...options
        };
        
        // Geometry configurations
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
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        
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
        console.log(`🎨 Initializing Fixed AdaptiveCardVisualizer for geometry ${this.options.geometry}...`);
        
        try {
            // Force Canvas 2D if requested or if WebGL is known to be problematic
            if (this.options.forceCanvas2D || !this.checkWebGLSupport()) {
                this.initCanvas2DMode();
                return;
            }

            // Try WebGL first
            if (this.initWebGLMode()) {
                console.log(`✅ WebGL mode initialized successfully`);
            } else {
                console.log(`⚠️ WebGL mode failed, falling back to Canvas 2D`);
                this.initCanvas2DMode();
            }
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            this.initCanvas2DMode();
        }
    }

    checkWebGLSupport() {
        try {
            const testCanvas = document.createElement('canvas');
            const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    initWebGLMode() {
        try {
            // Get WebGL context
            if (this.options.canvas) {
                this.canvas = this.options.canvas;
                this.canvas.width = this.options.width;
                this.canvas.height = this.options.height;
                this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
                this.contextId = this.canvas.id || 'provided-canvas';
            } else {
                const contextData = window.vib34dContextPool.getContext(this.options.width, this.options.height);
                
                if (!contextData) {
                    console.warn('WebGL context pool exhausted');
                    return false;
                }
                
                this.canvas = contextData.canvas;
                this.gl = contextData.gl;
                this.contextId = contextData.id;
                
                // Register for context loss recovery
                window.vib34dContextPool.registerContextLossHandler(this.canvas, {
                    onContextLost: () => this.handleContextLoss(),
                    onContextRestored: () => this.handleContextRestore()
                });
            }

            if (!this.gl) {
                console.warn('Failed to get WebGL context');
                return false;
            }
            
            // Setup canvas styling
            this.setupCanvasStyle();
            
            // Append canvas if needed
            if (!this.options.canvas) {
                this.container.appendChild(this.canvas);
            }
            
            // Initialize WebGL components
            if (!this.setupWebGLShaders()) {
                console.warn('Shader setup failed');
                return false;
            }
            
            this.setupWebGLBuffers();
            this.setupWebGLUniforms();
            this.setupInteraction();
            
            if (this.options.responsive) {
                this.setupResponsive();
            }
            
            // Set rendering mode and start animation
            this.renderingMode = 'webgl';
            this.isInitialized = true;
            this.animate();
            
            return true;
            
        } catch (error) {
            console.error('WebGL initialization failed:', error);
            return false;
        }
    }

    initCanvas2DMode() {
        console.log(`🎨 Initializing Canvas 2D fallback mode...`);
        
        try {
            // Create or use existing canvas
            if (this.options.canvas) {
                this.canvas = this.options.canvas;
            } else {
                this.canvas = document.createElement('canvas');
                this.canvas.id = `vib34d-canvas2d-${Date.now()}`;
                this.container.appendChild(this.canvas);
            }
            
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            
            // Get 2D context
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Failed to get 2D context');
            }
            
            // Setup canvas styling
            this.setupCanvasStyle();
            this.setupInteraction();
            
            if (this.options.responsive) {
                this.setupResponsive();
            }
            
            // Set rendering mode and start animation
            this.renderingMode = 'canvas2d';
            this.isInitialized = true;
            this.animate();
            
            console.log(`✅ Canvas 2D mode initialized successfully`);
            
        } catch (error) {
            console.error('❌ Canvas 2D initialization failed:', error);
        }
    }

    setupCanvasStyle() {
        this.canvas.className = 'vib34d-adaptive-canvas';
        this.canvas.style.display = 'block';
        this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        this.canvas.style.border = '1px solid rgba(0, 255, 255, 0.3)';
        
        // Apply dynamic subclasses
        if (this.options.subclasses.length > 0) {
            this.canvas.className += ' ' + this.options.subclasses.join(' ');
        }
    }

    setupWebGLShaders() {
        try {
            // FIXED: Simplified, guaranteed-to-work shaders
            const vertexShaderSource = `
                precision mediump float;
                attribute vec3 a_position;
                uniform mat4 u_mvpMatrix;
                uniform float u_time;
                uniform float u_scale;
                varying vec3 v_position;
                varying vec3 v_color;
                
                void main() {
                    v_position = a_position;
                    
                    // Simple rotation around Y axis
                    float angle = u_time * 0.5;
                    float cosA = cos(angle);
                    float sinA = sin(angle);
                    
                    vec3 rotated = vec3(
                        a_position.x * cosA - a_position.z * sinA,
                        a_position.y,
                        a_position.x * sinA + a_position.z * cosA
                    );
                    
                    rotated *= u_scale;
                    
                    // Fixed: Use simple orthographic projection instead of complex matrices
                    gl_Position = vec4(rotated.xy * 0.5, rotated.z * 0.1, 1.0);
                    
                    // Generate vertex color based on position
                    v_color = normalize(abs(rotated)) * 0.8 + 0.2;
                }
            `;
            
            const fragmentShaderSource = `
                precision mediump float;
                uniform float u_time;
                uniform float u_intensity;
                uniform float u_geometry;
                uniform float u_colorShift;
                varying vec3 v_position;
                varying vec3 v_color;
                
                void main() {
                    // Create dynamic, visible colors
                    float hue = u_geometry * 0.3 + u_colorShift * 0.01 + u_time * 0.1;
                    
                    vec3 color = vec3(
                        0.5 + 0.5 * sin(hue),
                        0.5 + 0.5 * sin(hue + 2.0),
                        0.5 + 0.5 * sin(hue + 4.0)
                    );
                    
                    // Mix with vertex color
                    color = mix(color, v_color, 0.5);
                    
                    // Ensure minimum brightness - CRITICAL FIX
                    color = max(color, vec3(0.3));
                    
                    // Apply intensity with pulsing
                    float pulse = 0.8 + 0.2 * sin(u_time * 2.0);
                    color *= u_intensity * pulse;
                    
                    // Ensure alpha is always 1.0 for visibility
                    gl_FragColor = vec4(color, 1.0);
                }
            `;
            
            // Compile shaders
            const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
            
            if (!vertexShader || !fragmentShader) {
                console.error('❌ Shader compilation failed');
                return false;
            }
            
            // Create and link program
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, vertexShader);
            this.gl.attachShader(this.program, fragmentShader);
            this.gl.linkProgram(this.program);
            
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                console.error('❌ Shader program linking failed:', this.gl.getProgramInfoLog(this.program));
                return false;
            }
            
            console.log('✅ WebGL shaders compiled and linked successfully');
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
    
    setupWebGLBuffers() {
        // Create enhanced geometry with more visible structure
        const geometry = this.createEnhancedGeometry(this.options.geometry);
        
        // Position buffer
        this.buffers.position = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), this.gl.STATIC_DRAW);
        
        // Index buffer
        this.buffers.indices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.indices), this.gl.STATIC_DRAW);
        
        this.indexCount = geometry.indices.length;
        
        console.log(`📐 Created geometry with ${geometry.vertices.length / 3} vertices and ${geometry.indices.length} indices`);
    }
    
    createEnhancedGeometry(type) {
        const config = this.geometryConfigs[type] || this.geometryConfigs[0];
        
        // FIXED: Create larger, more visible cube geometry
        const size = 1.2 * config.multiplier; // Increased size
        const vertices = [
            // Front face - made larger and more distinct
            -size, -size,  size,   size, -size,  size,   size,  size,  size,  -size,  size,  size,
            // Back face
            -size, -size, -size,  -size,  size, -size,   size,  size, -size,   size, -size, -size,
            // Top face
            -size,  size, -size,  -size,  size,  size,   size,  size,  size,   size,  size, -size,
            // Bottom face
            -size, -size, -size,   size, -size, -size,   size, -size,  size,  -size, -size,  size,
            // Right face
             size, -size, -size,   size,  size, -size,   size,  size,  size,   size, -size,  size,
            // Left face
            -size, -size, -size,  -size, -size,  size,  -size,  size,  size,  -size,  size, -size
        ];
        
        // Enhanced indices for better visibility
        const indices = [
            0,  1,  2,    0,  2,  3,    // front
            4,  5,  6,    4,  6,  7,    // back
            8,  9,  10,   8,  10, 11,   // top
            12, 13, 14,   12, 14, 15,   // bottom
            16, 17, 18,   16, 18, 19,   // right
            20, 21, 22,   20, 22, 23    // left
        ];
        
        return { vertices, indices };
    }
    
    setupWebGLUniforms() {
        // Get uniform locations with error checking
        const uniformNames = [
            'u_mvpMatrix', 'u_time', 'u_intensity', 'u_geometry', 'u_scale',
            'u_colorShift', 'u_masterKey'
        ];
        
        uniformNames.forEach(name => {
            this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
            if (this.uniforms[name] === null) {
                console.warn(`⚠️ Uniform ${name} not found in shader`);
            }
        });
        
        // Get attribute location
        this.uniforms.a_position = this.gl.getAttribLocation(this.program, 'a_position');
        if (this.uniforms.a_position === -1) {
            console.error('❌ Position attribute not found in shader');
        }
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
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    this.canvas.width = width;
                    this.canvas.height = height;
                    if (this.gl) {
                        this.gl.viewport(0, 0, width, height);
                    }
                }
            });
            
            resizeObserver.observe(this.container);
        }
    }

    handleContextLoss() {
        console.warn('🔥 WebGL context lost, switching to Canvas 2D');
        this.contextLost = true;
        
        // Cancel current animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Switch to Canvas 2D mode
        this.initCanvas2DMode();
    }

    handleContextRestore() {
        console.log('✅ WebGL context restored, attempting to reinitialize');
        this.contextLost = false;
        
        // Try to reinitialize WebGL
        if (this.initWebGLMode()) {
            console.log('✅ WebGL mode restored successfully');
        } else {
            console.log('❌ Failed to restore WebGL, staying in Canvas 2D mode');
        }
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        // Update time and FPS
        const currentTime = performance.now();
        this.time += 0.016; // ~60fps
        
        if (currentTime - this.lastFrameTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
        }
        this.frameCount++;
        
        // Render based on current mode
        if (this.renderingMode === 'webgl' && this.gl && !this.contextLost) {
            this.renderWebGL();
        } else {
            this.renderCanvas2D();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    renderWebGL() {
        if (!this.gl || !this.program) return;
        
        // Clear with better background color for visibility
        this.gl.clearColor(0.05, 0.05, 0.1, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Setup rendering state
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Use program
        this.gl.useProgram(this.program);
        
        // Update uniforms
        if (this.uniforms.u_time) {
            this.gl.uniform1f(this.uniforms.u_time, this.time);
        }
        if (this.uniforms.u_intensity) {
            this.gl.uniform1f(this.uniforms.u_intensity, this.editorParams.intensity);
        }
        if (this.uniforms.u_geometry) {
            this.gl.uniform1f(this.uniforms.u_geometry, this.options.geometry);
        }
        if (this.uniforms.u_scale) {
            this.gl.uniform1f(this.uniforms.u_scale, this.editorParams.scale);
        }
        if (this.uniforms.u_colorShift) {
            this.gl.uniform1f(this.uniforms.u_colorShift, this.editorParams.colorShift);
        }
        if (this.uniforms.u_masterKey) {
            this.gl.uniform1f(this.uniforms.u_masterKey, this.options.masterKey);
        }
        
        // Create and set MVP matrix (simplified)
        const mvpMatrix = this.createSimpleMVPMatrix();
        if (this.uniforms.u_mvpMatrix) {
            this.gl.uniformMatrix4fv(this.uniforms.u_mvpMatrix, false, mvpMatrix);
        }
        
        // Bind buffers and setup attributes
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        if (this.uniforms.a_position !== -1) {
            this.gl.enableVertexAttribArray(this.uniforms.a_position);
            this.gl.vertexAttribPointer(this.uniforms.a_position, 3, this.gl.FLOAT, false, 0, 0);
        }
        
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        
        // Draw triangles
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
        
        // Check for errors
        const error = this.gl.getError();
        if (error !== this.gl.NO_ERROR) {
            console.error('WebGL error during rendering:', error);
        }
    }

    createSimpleMVPMatrix() {
        // FIXED: Much simpler matrix that definitely works
        const matrix = new Float32Array(16);
        
        // Identity matrix
        matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1.0;
        
        // Apply simple transformations
        const scale = this.editorParams.scale * 0.8; // Scale down to fit viewport
        matrix[0] = scale;
        matrix[5] = scale;
        matrix[10] = scale;
        
        return matrix;
    }

    renderCanvas2D() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Clear with fade for trail effect
        this.ctx.globalAlpha = 0.15;
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.globalAlpha = 1.0;
        
        // Get geometry configuration
        const config = this.geometryConfigs[this.options.geometry] || this.geometryConfigs[0];
        const baseRadius = Math.min(centerX, centerY) * 0.6;
        const radius = baseRadius * config.multiplier * this.editorParams.scale;
        
        // Base color from geometry index with color shift
        const baseHue = (this.options.geometry * 45 + this.editorParams.colorShift) % 360;
        
        // Enhanced rendering for each geometry type
        this.renderGeometry2D(centerX, centerY, radius, baseHue);
        
        // Add center glow effect
        this.addCenterGlow(centerX, centerY, baseHue);
    }

    renderGeometry2D(centerX, centerY, radius, hue) {
        switch (this.options.geometry) {
            case 0: // Hypercube
                this.draw2DEnhancedHypercube(centerX, centerY, radius, hue);
                break;
            case 1: // Tetrahedron
                this.draw2DEnhancedTetrahedron(centerX, centerY, radius, hue);
                break;
            case 2: // Sphere
                this.draw2DEnhancedSphere(centerX, centerY, radius, hue);
                break;
            case 3: // Torus
                this.draw2DEnhancedTorus(centerX, centerY, radius, hue);
                break;
            case 4: // Klein
                this.draw2DEnhancedKlein(centerX, centerY, radius, hue);
                break;
            case 5: // Fractal
                this.draw2DEnhancedFractal(centerX, centerY, radius, hue);
                break;
            case 6: // Wave
                this.draw2DEnhancedWave(centerX, centerY, radius, hue);
                break;
            case 7: // Crystal
                this.draw2DEnhancedCrystal(centerX, centerY, radius, hue);
                break;
        }
    }

    draw2DEnhancedHypercube(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        const layers = 3;
        
        for (let layer = 0; layer < layers; layer++) {
            const layerRadius = radius * (1 - layer * 0.3);
            const alpha = this.editorParams.intensity * (1 - layer * 0.2);
            const rotation = this.time * (0.5 + layer * 0.2) + this.editorParams.rotation;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            
            // Draw enhanced cube outline
            ctx.strokeStyle = `hsla(${hue + layer * 60}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 3 - layer;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 10;
            
            const size = layerRadius;
            ctx.strokeRect(-size/2, -size/2, size, size);
            
            // Add corner connections
            ctx.beginPath();
            ctx.moveTo(-size/2, -size/2);
            ctx.lineTo(size/2, size/2);
            ctx.moveTo(size/2, -size/2);
            ctx.lineTo(-size/2, size/2);
            ctx.stroke();
            
            ctx.restore();
        }
    }

    draw2DEnhancedTetrahedron(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        const points = 3;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.time * 0.7 + this.editorParams.rotation);
        
        // Draw multiple rotating triangles
        for (let i = 0; i < 2; i++) {
            ctx.rotate(Math.PI / 3 * i);
            ctx.strokeStyle = `hsla(${hue + i * 120}, 100%, 60%, ${this.editorParams.intensity})`;
            ctx.lineWidth = 4 - i;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 15;
            
            ctx.beginPath();
            for (let j = 0; j <= points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const x = Math.cos(angle) * radius * (1 - i * 0.3);
                const y = Math.sin(angle) * radius * (1 - i * 0.3);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.restore();
    }

    draw2DEnhancedSphere(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        
        // Multiple concentric circles with breathing effect
        for (let i = 1; i <= 6; i++) {
            const r = radius * (i / 6) * (0.8 + 0.2 * Math.sin(this.time * 2 + i));
            const alpha = this.editorParams.intensity * (1 - i / 7);
            
            ctx.strokeStyle = `hsla(${hue + i * 15}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 8;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    draw2DEnhancedTorus(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        const segments = 24;
        
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;
        
        // Flowing torus pattern with enhanced dynamics
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * Math.PI * 2 + this.time;
            const angle2 = ((i + 1) / segments) * Math.PI * 2 + this.time;
            
            const r1 = radius + Math.sin(angle1 * 3 + this.time) * radius * 0.4;
            const r2 = radius + Math.sin(angle2 * 3 + this.time) * radius * 0.4;
            
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(angle1) * r1, centerY + Math.sin(angle1) * r1);
            ctx.lineTo(centerX + Math.cos(angle2) * r2, centerY + Math.sin(angle2) * r2);
            ctx.stroke();
        }
    }

    draw2DEnhancedKlein(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        const segments = 40;
        
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
        
        // Enhanced Klein bottle approximation
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 4 + this.time * 0.5;
            const scale = 1 + Math.sin(this.time) * 0.2;
            const x = centerX + radius * Math.cos(t) * (1 + Math.cos(t / 2) * 0.5) * scale;
            const y = centerY + radius * Math.sin(t) * Math.sin(t / 2) * 0.5 * scale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    draw2DEnhancedFractal(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        
        // Enhanced recursive fractal with better visibility
        const drawBranch = (x, y, length, angle, depth) => {
            if (depth === 0 || length < 2) return;
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            ctx.strokeStyle = `hsla(${hue + depth * 30}, 100%, 60%, ${this.editorParams.intensity * (depth / 5)})`;
            ctx.lineWidth = Math.max(depth, 1);
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 5;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            const newLength = length * 0.75;
            const angleOffset = 0.6 + Math.sin(this.time * 0.5) * 0.2;
            drawBranch(endX, endY, newLength, angle - angleOffset, depth - 1);
            drawBranch(endX, endY, newLength, angle + angleOffset, depth - 1);
        };
        
        drawBranch(centerX, centerY + radius * 0.4, radius * 0.7, -Math.PI / 2, 5);
    }

    draw2DEnhancedWave(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        const segments = 60;
        
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        
        // Enhanced wave function with multiple harmonics
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const x = centerX - radius + (i / segments) * radius * 2;
            const wave1 = Math.sin((i / segments) * Math.PI * 4 + this.time * 2) * radius * 0.3;
            const wave2 = Math.sin((i / segments) * Math.PI * 8 + this.time * 3) * radius * 0.1;
            const y = centerY + wave1 + wave2;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    draw2DEnhancedCrystal(centerX, centerY, radius, hue) {
        const ctx = this.ctx;
        const points = 6;
        
        // Enhanced crystal lattice with multiple rings
        for (let ring = 1; ring <= 4; ring++) {
            const r = radius * (ring / 4);
            const alpha = this.editorParams.intensity * (1 - ring / 5);
            
            ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = ctx.strokeStyle;
            ctx.shadowBlur = 6;
            
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2 + this.time * 0.3;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                
                // Draw connections to center
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
                
                // Draw ring connections
                const nextAngle = ((i + 1) / points) * Math.PI * 2 + this.time * 0.3;
                const nextX = centerX + Math.cos(nextAngle) * r;
                const nextY = centerY + Math.sin(nextAngle) * r;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, nextY);
                ctx.stroke();
            }
        }
    }

    addCenterGlow(centerX, centerY, hue) {
        const ctx = this.ctx;
        const pulseRadius = 20 + Math.sin(this.time * 3) * 10;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, ${this.editorParams.intensity * 0.8})`);
        gradient.addColorStop(0.7, `hsla(${hue}, 100%, 60%, ${this.editorParams.intensity * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    updateGeometry(geometryIndex) {
        this.options.geometry = geometryIndex;
        
        // Update WebGL buffers if in WebGL mode
        if (this.renderingMode === 'webgl' && this.gl && this.buffers) {
            this.setupWebGLBuffers();
        }
    }
    
    updateParams(params) {
        Object.assign(this.editorParams, params);
    }

    // Get current performance metrics
    getPerformanceMetrics() {
        return {
            fps: this.fps,
            renderingMode: this.renderingMode,
            contextLost: this.contextLost,
            initialized: this.isInitialized
        };
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Release WebGL context back to pool
        if (this.canvas && this.contextId && window.vib34dContextPool) {
            window.vib34dContextPool.releaseContext(this.canvas);
            console.log(`🔓 Released context ${this.contextId} back to pool`);
        }
        
        if (this.canvas && this.canvas.parentNode && !this.options.canvas) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.gl = null;
        this.ctx = null;
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

// Factory function
function createFixedCardVisualizer(container, options) {
    return new AdaptiveCardVisualizerFixed(container, options);
}

// Global exports
window.AdaptiveCardVisualizerFixed = AdaptiveCardVisualizerFixed;
window.createFixedCardVisualizer = createFixedCardVisualizer;

// Integration with VIB34D
if (window.VIB34D) {
    window.VIB34D.AdaptiveCardVisualizerFixed = AdaptiveCardVisualizerFixed;
    window.VIB34D.createFixedCardVisualizer = createFixedCardVisualizer;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveCardVisualizerFixed, createFixedCardVisualizer };
}