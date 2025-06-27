/**
 * VIB34D ADAPTIVE CARD VISUALIZER
 * Adapts the working demo's ReactiveHyperAVCore into card-based architecture
 * with dynamic subclasses and master key integration
 */

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
            // Create canvas element
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            this.canvas.className = 'vib34d-adaptive-canvas';
            
            // Apply dynamic subclasses
            if (this.options.subclasses.length > 0) {
                this.canvas.className += ' ' + this.options.subclasses.join(' ');
            }
            
            this.container.appendChild(this.canvas);
            
            // Try WebGL initialization
            console.log('🔧 Attempting WebGL context creation...');
            this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: true }) || 
                     this.canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
            
            if (!this.gl) {
                console.log('⚠️ WebGL not supported, falling back to Canvas 2D');
                this.initCanvas2DFallback();
                return;
            }
            
            console.log('✅ WebGL context created successfully');
            
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
            // Vertex shader adapted from demo
            const vertexShaderSource = `
                attribute vec3 a_position;
                uniform mat4 u_matrix;
                uniform float u_time;
                uniform float u_geometry;
                uniform float u_masterKey;
                varying vec3 v_position;
                varying float v_depth;
                
                void main() {
                    vec3 pos = a_position;
                    
                    // Apply geometry-specific transformations
                    float geomMultiplier = mix(1.0, u_geometry * 0.5 + 0.5, u_masterKey);
                    pos *= geomMultiplier;
                    
                    // 4D rotation for hypercube effect
                    float angle = u_time * 0.5;
                    float c = cos(angle);
                    float s = sin(angle);
                    
                    // XW rotation
                    float w = pos.x * -s + 0.5 * c;
                    pos.x = pos.x * c + 0.5 * s;
                    
                    v_position = pos;
                    v_depth = w;
                    gl_Position = u_matrix * vec4(pos, 1.0);
                }
            `;
            
            // Fragment shader with all 17 uniforms from VIB34D spec
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
                
                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }
                
                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution;
                    
                    // Base color from position and depth
                    float hue = u_colorShift + v_depth * 0.5 + u_time * 0.1;
                    float saturation = 0.8 + sin(u_time + length(v_position)) * 0.2;
                    float value = u_intensity * (0.5 + v_depth * 0.5);
                    
                    vec3 color = hsv2rgb(vec3(hue, saturation, value));
                    
                    // Add holographic rainbow effect
                    float rainbow = sin(v_position.x * 10.0 + u_time) * 0.5 + 0.5;
                    color = mix(color, hsv2rgb(vec3(rainbow, 1.0, 1.0)), u_holographic * 0.3);
                    
                    // Crystallization effect
                    float crystal = step(0.5, fract(length(v_position) * u_crystallization * 10.0));
                    color = mix(color, vec3(1.0), crystal * u_crystallization * 0.2);
                    
                    // Emergence glow (fixed vec3/vec2 type mismatch)
                    float glow = 1.0 / (1.0 + length(v_position.xy - u_mouse) * 5.0);
                    color += vec3(glow) * u_emergence * 0.5;
                    
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
        
        // Clear
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
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
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    createPerspectiveMatrix() {
        const aspect = this.canvas.width / this.canvas.height;
        const fov = Math.PI / 4;
        const near = 0.1;
        const far = 100;
        
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const rangeInv = 1.0 / (near - far);
        
        const matrix = new Float32Array(16);
        matrix[0] = f / aspect;
        matrix[5] = f;
        matrix[10] = (near + far) * rangeInv;
        matrix[11] = -1;
        matrix[14] = near * far * rangeInv * 2;
        
        // Apply rotation based on time and editor params
        const rotX = this.time * 0.5 + this.editorParams.rotation;
        const rotY = this.time * 0.3;
        
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        
        // Simplified rotation application
        const scale = this.editorParams.scale;
        matrix[0] *= scale;
        matrix[5] *= scale;
        
        return matrix;
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
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.isInitialized = false;
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