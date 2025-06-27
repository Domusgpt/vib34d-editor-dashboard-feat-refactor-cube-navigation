/**
 * VIB3 REACTIVE HYPERAV CORE
 * 
 * Unified system combining ReactiveHyperAVCore with VIB3 parameter hierarchy
 * Extracts working shader system and integrates with VIB3HomeMaster/UnifiedReactivityBridge
 */

class VIB3ReactiveHyperAVCore {
    constructor(canvas, homeMaster, reactivityBridge) {
        this.canvas = canvas;
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        // Core state
        this.startTime = Date.now();
        this.currentTheme = 'hypercube';
        this.interactionState = {
            type: 'idle',
            intensity: 0,
            lastActivity: Date.now(),
            holdStart: 0,
            isHolding: false,
            scrollVelocity: 0,
            mouseX: 0.5,
            mouseY: 0.5
        };
        
        // Theme configurations integrated with VIB3 parameter system
        this.themeConfigs = {
            hypercube: {
                baseColor: [1.0, 0.0, 1.0],      // Magenta - Section 0 (HOME)
                gridDensity: 12.0,
                morphFactor: 0.5,
                dimension: 3.5,
                glitchIntensity: 0.3,
                rotationSpeed: 0.5,
                geometry: 'hypercube',
                sectionIndex: 0
            },
            tetrahedron: {
                baseColor: [0.0, 1.0, 1.0],      // Cyan - Section 1 (TECH)
                gridDensity: 8.0,
                morphFactor: 0.7,
                dimension: 3.2,
                glitchIntensity: 0.2,
                rotationSpeed: 0.7,
                geometry: 'tetrahedron',
                sectionIndex: 1
            },
            sphere: {
                baseColor: [1.0, 1.0, 0.0],      // Yellow - Section 2 (MEDIA)
                gridDensity: 15.0,
                morphFactor: 0.3,
                dimension: 3.8,
                glitchIntensity: 0.1,
                rotationSpeed: 0.3,
                geometry: 'sphere',
                sectionIndex: 2
            },
            torus: {
                baseColor: [0.0, 1.0, 0.0],      // Green - Section 3 (AUDIO)
                gridDensity: 10.0,
                morphFactor: 0.8,
                dimension: 3.6,
                glitchIntensity: 0.4,
                rotationSpeed: 0.6,
                geometry: 'torus',
                sectionIndex: 3
            },
            klein: {
                baseColor: [1.0, 0.5, 0.0],      // Orange - Section 4 (QUANTUM)
                gridDensity: 14.0,
                morphFactor: 0.9,
                dimension: 3.9,
                glitchIntensity: 0.5,
                rotationSpeed: 0.4,
                geometry: 'klein',
                sectionIndex: 4
            },
            fractal: {
                baseColor: [0.5, 0.0, 1.0],      // Purple
                gridDensity: 20.0,
                morphFactor: 0.6,
                dimension: 3.7,
                glitchIntensity: 0.6,
                rotationSpeed: 0.8,
                geometry: 'fractal',
                sectionIndex: 5
            },
            wave: {
                baseColor: [1.0, 0.0, 0.5],      // Pink
                gridDensity: 16.0,
                morphFactor: 0.4,
                dimension: 3.3,
                glitchIntensity: 0.3,
                rotationSpeed: 0.9,
                geometry: 'wave',
                sectionIndex: 6
            },
            crystal: {
                baseColor: [0.0, 1.0, 0.5],      // Mint
                gridDensity: 18.0,
                morphFactor: 0.2,
                dimension: 3.1,
                glitchIntensity: 0.2,
                rotationSpeed: 0.2,
                geometry: 'crystal',
                sectionIndex: 7
            }
        };
        
        // Current parameters (reactive and VIB3-integrated)
        this.params = { ...this.themeConfigs.hypercube };
        
        this.initShaders();
        this.initBuffers();
        this.setupVIB3Integration();
        this.setupInteractions();
        this.resize();
        this.animate();
        
        console.log('✅ VIB3 Reactive HyperAV Core initialized');
    }
    
    setupVIB3Integration() {
        // Register with VIB3HomeMaster for parameter authority
        if (this.homeMaster) {
            this.homeMaster.registerVisualizer('hyperav-core', this);
            
            // Listen for section changes
            this.homeMaster.onSectionChange = (sectionIndex) => {
                const themeMap = ['hypercube', 'tetrahedron', 'sphere', 'torus', 'klein'];
                const themeName = themeMap[sectionIndex] || 'hypercube';
                this.setTheme(themeName);
            };
        }
        
        // Register with UnifiedReactivityBridge for synchronization
        if (this.reactivityBridge) {
            this.reactivityBridge.registerVisualizer('hyperav-core', this);
        }
    }
    
    // VIB3 parameter update interface
    updateParameters(newParams) {
        if (typeof newParams === 'object') {
            Object.assign(this.params, newParams);
            
            // Sync with reactivity bridge
            if (this.reactivityBridge) {
                this.reactivityBridge.syncShaderUniforms(this.getShaderUniforms());
            }
        }
    }
    
    // Get current shader uniforms for VIB3 synchronization
    getShaderUniforms() {
        const geometryMap = {
            'hypercube': 0, 'tetrahedron': 1, 'sphere': 2, 'torus': 3,
            'klein': 4, 'fractal': 5, 'wave': 6, 'crystal': 7
        };
        
        return {
            u_dimension: this.params.dimension,
            u_morphFactor: this.params.morphFactor,
            u_gridDensity: this.params.gridDensity,
            u_rotationSpeed: this.params.rotationSpeed,
            u_glitchIntensity: this.params.glitchIntensity,
            u_baseColor: this.params.baseColor,
            u_geometry: geometryMap[this.params.geometry] || 0,
            u_interactionIntensity: this.interactionState.intensity
        };
    }
    
    initShaders() {
        const vertexShaderSource = `
          attribute vec2 a_position;
          void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `;
        
        // Enhanced fragment shader with all 8 geometry types
        const fragmentShaderSource = `
          precision highp float;
          
          uniform vec2 u_resolution;
          uniform float u_time;
          uniform vec2 u_mouse;
          uniform float u_morphFactor;
          uniform float u_glitchIntensity;
          uniform float u_rotationSpeed;
          uniform float u_dimension;
          uniform float u_gridDensity;
          uniform vec3 u_baseColor;
          uniform float u_interactionIntensity;
          uniform float u_geometry; // 0=hypercube, 1=tetrahedron, 2=sphere, 3=torus, 4=klein, 5=fractal, 6=wave, 7=crystal
          
          // 4D rotation matrices
          mat4 rotateXW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(c, 0, 0, -s, 0, 1, 0, 0, 0, 0, 1, 0, s, 0, 0, c);
          }
          
          mat4 rotateYW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(1, 0, 0, 0, 0, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c);
          }
          
          mat4 rotateZW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, c, -s, 0, 0, s, c);
          }
          
          vec3 project4Dto3D(vec4 p) {
            float w = 2.0 / (2.0 + p.w);
            return vec3(p.x * w, p.y * w, p.z * w);
          }
          
          // Geometry generators
          float hypercubeLattice(vec3 p, float gridSize) {
            vec3 grid = fract(p * gridSize);
            vec3 edges = 1.0 - smoothstep(0.0, 0.03, abs(grid - 0.5));
            return max(max(edges.x, edges.y), edges.z);
          }
          
          float tetrahedronLattice(vec3 p, float gridSize) {
            vec3 q = fract(p * gridSize) - 0.5;
            float d1 = length(q);
            float d2 = length(q - vec3(0.5, 0.0, 0.0));
            float d3 = length(q - vec3(0.0, 0.5, 0.0));
            float d4 = length(q - vec3(0.0, 0.0, 0.5));
            return 1.0 - smoothstep(0.0, 0.1, min(min(d1, d2), min(d3, d4)));
          }
          
          float sphereLattice(vec3 p, float gridSize) {
            vec3 q = fract(p * gridSize) - 0.5;
            float r = length(q);
            return 1.0 - smoothstep(0.2, 0.5, r);
          }
          
          float torusLattice(vec3 p, float gridSize) {
            vec3 q = fract(p * gridSize) - 0.5;
            float r1 = sqrt(q.x*q.x + q.y*q.y);
            float r2 = sqrt((r1 - 0.3)*(r1 - 0.3) + q.z*q.z);
            return 1.0 - smoothstep(0.0, 0.1, r2);
          }
          
          float kleinLattice(vec3 p, float gridSize) {
            vec3 q = fract(p * gridSize);
            float u = q.x * 2.0 * 3.14159;
            float v = q.y * 2.0 * 3.14159;
            float x = cos(u) * (3.0 + cos(u/2.0) * sin(v) - sin(u/2.0) * sin(2.0*v));
            float klein = length(vec2(x, q.z)) - 0.1;
            return 1.0 - smoothstep(0.0, 0.05, abs(klein));
          }
          
          float fractalLattice(vec3 p, float gridSize) {
            vec3 q = p * gridSize;
            float scale = 1.0;
            float fractal = 0.0;
            for(int i = 0; i < 4; i++) {
              q = fract(q) - 0.5;
              fractal += abs(length(q)) / scale;
              scale *= 2.0;
              q *= 2.0;
            }
            return 1.0 - smoothstep(0.0, 1.0, fractal);
          }
          
          float waveLattice(vec3 p, float gridSize) {
            vec3 q = p * gridSize;
            float wave = sin(q.x * 2.0) * sin(q.y * 2.0) * sin(q.z * 2.0 + u_time);
            return smoothstep(-0.5, 0.5, wave);
          }
          
          float crystalLattice(vec3 p, float gridSize) {
            vec3 q = fract(p * gridSize) - 0.5;
            float d = max(max(abs(q.x), abs(q.y)), abs(q.z));
            return 1.0 - smoothstep(0.3, 0.5, d);
          }
          
          float getGeometryValue(vec3 p, float gridSize, float geomType) {
            if (geomType < 0.5) return hypercubeLattice(p, gridSize);
            else if (geomType < 1.5) return tetrahedronLattice(p, gridSize);
            else if (geomType < 2.5) return sphereLattice(p, gridSize);
            else if (geomType < 3.5) return torusLattice(p, gridSize);
            else if (geomType < 4.5) return kleinLattice(p, gridSize);
            else if (geomType < 5.5) return fractalLattice(p, gridSize);
            else if (geomType < 6.5) return waveLattice(p, gridSize);
            else return crystalLattice(p, gridSize);
          }
          
          void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float aspectRatio = u_resolution.x / u_resolution.y;
            uv.x *= aspectRatio;
            
            vec2 center = vec2(u_mouse.x * aspectRatio, u_mouse.y);
            vec3 p = vec3(uv - center, 0.0);
            
            // Interaction-driven rotation
            float timeRotation = u_time * 0.2 * u_rotationSpeed * (1.0 + u_interactionIntensity);
            mat2 rotation = mat2(cos(timeRotation), -sin(timeRotation), sin(timeRotation), cos(timeRotation));
            p.xy = rotation * p.xy;
            p.z = sin(u_time * 0.1) * 0.5;
            
            // Apply 4D transformations based on interaction
            if (u_dimension > 3.0) {
              float w = sin(length(p) * 3.0 + u_time * 0.3) * (u_dimension - 3.0) * (1.0 + u_interactionIntensity * 0.5);
              vec4 p4d = vec4(p, w);
              
              p4d = rotateXW(timeRotation * 0.31) * p4d;
              p4d = rotateYW(timeRotation * 0.27) * p4d;
              p4d = rotateZW(timeRotation * 0.23) * p4d;
              
              p = project4Dto3D(p4d);
            }
            
            // Dynamic grid density based on interaction
            float dynamicGridDensity = u_gridDensity * (1.0 + u_interactionIntensity * 0.3);
            
            // Get geometry value
            float lattice = getGeometryValue(p, dynamicGridDensity, u_geometry);
            
            // Interaction-driven glitch effects
            float glitchAmount = u_glitchIntensity * (0.1 + 0.1 * sin(u_time * 5.0)) * (1.0 + u_interactionIntensity);
            
            vec2 rOffset = vec2(glitchAmount, glitchAmount * 0.5);
            vec2 gOffset = vec2(-glitchAmount * 0.3, glitchAmount * 0.2);
            vec2 bOffset = vec2(glitchAmount * 0.1, -glitchAmount * 0.4);
            
            float r = getGeometryValue(vec3(p.xy + rOffset, p.z), dynamicGridDensity, u_geometry);
            float g = getGeometryValue(vec3(p.xy + gOffset, p.z), dynamicGridDensity, u_geometry);
            float b = getGeometryValue(vec3(p.xy + bOffset, p.z), dynamicGridDensity, u_geometry);
            
            // Base colors with theme-specific tinting
            vec3 baseColor = vec3(0.02, 0.05, 0.1);
            vec3 latticeColor = u_baseColor * (0.8 + 0.2 * u_interactionIntensity);
            
            vec3 color = mix(baseColor, latticeColor, vec3(r, g, b));
            
            // Interaction-responsive glow
            color += u_baseColor * 0.1 * (0.5 + 0.5 * sin(u_time * 0.5)) * u_interactionIntensity;
            
            // Vignette
            float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - vec2(center.x, center.y)));
            color *= vignette;
            
            gl_FragColor = vec4(color, 0.95);
          }
        `;
        
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = this.createProgram(vertexShader, fragmentShader);
        
        // Get uniform locations
        this.uniforms = {
            resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
            morphFactor: this.gl.getUniformLocation(this.program, 'u_morphFactor'),
            glitchIntensity: this.gl.getUniformLocation(this.program, 'u_glitchIntensity'),
            rotationSpeed: this.gl.getUniformLocation(this.program, 'u_rotationSpeed'),
            dimension: this.gl.getUniformLocation(this.program, 'u_dimension'),
            gridDensity: this.gl.getUniformLocation(this.program, 'u_gridDensity'),
            baseColor: this.gl.getUniformLocation(this.program, 'u_baseColor'),
            interactionIntensity: this.gl.getUniformLocation(this.program, 'u_interactionIntensity'),
            geometry: this.gl.getUniformLocation(this.program, 'u_geometry')
        };
        
        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Shader error:", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("Program error:", this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    
    initBuffers() {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
            this.gl.STATIC_DRAW
        );
    }
    
    setupInteractions() {
        let lastScrollY = window.scrollY;
        let lastScrollTime = Date.now();
        
        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.interactionState.mouseX = (e.clientX - rect.left) / rect.width;
            this.interactionState.mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
            this.interactionState.lastActivity = Date.now();
            this.updateInteractionState('move', 0.3);
        });
        
        // Click/Touch interactions
        const startHold = (e) => {
            this.interactionState.isHolding = true;
            this.interactionState.holdStart = Date.now();
            this.updateInteractionState('hold', 1.0);
            
            // Register interaction with VIB3HomeMaster
            if (this.homeMaster) {
                this.homeMaster.registerInteraction('hold', 1.0, 2000);
            }
            
            e.preventDefault();
        };
        
        const endHold = () => {
            this.interactionState.isHolding = false;
            this.updateInteractionState('release', 0.1);
        };
        
        this.canvas.addEventListener('mousedown', startHold);
        this.canvas.addEventListener('mouseup', endHold);
        this.canvas.addEventListener('touchstart', startHold, { passive: false });
        this.canvas.addEventListener('touchend', endHold);
        
        // Scroll tracking
        window.addEventListener('scroll', () => {
            const currentTime = Date.now();
            const currentY = window.scrollY;
            const deltaY = Math.abs(currentY - lastScrollY);
            const deltaTime = currentTime - lastScrollTime;
            
            if (deltaTime > 0) {
                this.interactionState.scrollVelocity = deltaY / deltaTime * 100;
                const intensity = Math.min(this.interactionState.scrollVelocity / 20, 1.0);
                this.updateInteractionState('scroll', intensity);
                
                // Register with VIB3HomeMaster
                if (this.homeMaster) {
                    this.homeMaster.registerInteraction('scroll', intensity, 500);
                }
            }
            
            lastScrollY = currentY;
            lastScrollTime = currentTime;
            this.interactionState.lastActivity = currentTime;
        });
        
        // Inactivity detection
        setInterval(() => {
            const timeSinceActivity = Date.now() - this.interactionState.lastActivity;
            if (timeSinceActivity > 3000) { // 3 seconds of inactivity
                this.updateInteractionState('idle', 0.0);
            }
        }, 1000);
        
        window.addEventListener('resize', () => this.resize());
    }
    
    updateInteractionState(type, intensity) {
        this.interactionState.type = type;
        this.interactionState.intensity = Math.max(this.interactionState.intensity * 0.9, intensity);
        
        // Trigger reactivity bridge update
        if (this.reactivityBridge) {
            this.reactivityBridge.triggerEffect('interaction-state-change', {
                type: type,
                intensity: intensity
            });
        }
    }
    
    setTheme(themeName) {
        if (this.currentTheme === themeName) return;
        
        this.currentTheme = themeName;
        const config = this.themeConfigs[themeName];
        
        if (!config) {
            console.warn(`Theme '${themeName}' not found`);
            return;
        }
        
        // Smooth transition to new theme
        const startParams = { ...this.params };
        const targetParams = { ...config };
        
        const transitionDuration = 1000; // 1 second
        const startTime = Date.now();
        
        const transition = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / transitionDuration, 1.0);
            const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI); // Smooth ease
            
            // Interpolate parameters
            Object.keys(targetParams).forEach(key => {
                if (typeof targetParams[key] === 'number') {
                    this.params[key] = startParams[key] + (targetParams[key] - startParams[key]) * eased;
                } else if (Array.isArray(targetParams[key])) {
                    this.params[key] = startParams[key].map((val, i) => 
                        val + (targetParams[key][i] - val) * eased
                    );
                } else {
                    this.params[key] = targetParams[key];
                }
            });
            
            if (progress < 1.0) {
                requestAnimationFrame(transition);
            }
        };
        
        transition();
        
        // Notify VIB3HomeMaster of theme change
        if (this.homeMaster && config.sectionIndex !== undefined) {
            this.homeMaster.transitionToSection(config.sectionIndex);
        }
        
        console.log(`🎨 Theme changed to: ${themeName}`);
    }
    
    resize() {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    render() {
        // Apply interaction effects to parameters
        const interactionMultiplier = 1.0 + this.interactionState.intensity * 0.5;
        const currentMorphFactor = this.params.morphFactor * interactionMultiplier;
        const currentGridDensity = this.params.gridDensity * (1.0 + this.interactionState.intensity * 0.2);
        
        // Handle hold interactions (dimensional shift)
        let holdEffect = 0;
        if (this.interactionState.isHolding) {
            const holdDuration = Date.now() - this.interactionState.holdStart;
            holdEffect = Math.min(holdDuration / 2000, 1.0); // 2 second max hold
        }
        const currentDimension = this.params.dimension + holdEffect * 0.5;
        
        // Map geometry name to number
        const geometryMap = {
            'hypercube': 0, 'tetrahedron': 1, 'sphere': 2, 'torus': 3,
            'klein': 4, 'fractal': 5, 'wave': 6, 'crystal': 7
        };
        const geometryIndex = geometryMap[this.params.geometry] || 0;
        
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        
        // Setup vertex attributes
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        // Set uniforms
        this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.time, (Date.now() - this.startTime) / 1000);
        this.gl.uniform2f(this.uniforms.mouse, this.interactionState.mouseX, this.interactionState.mouseY);
        this.gl.uniform1f(this.uniforms.morphFactor, currentMorphFactor);
        this.gl.uniform1f(this.uniforms.glitchIntensity, this.params.glitchIntensity);
        this.gl.uniform1f(this.uniforms.rotationSpeed, this.params.rotationSpeed);
        this.gl.uniform1f(this.uniforms.dimension, currentDimension);
        this.gl.uniform1f(this.uniforms.gridDensity, currentGridDensity);
        this.gl.uniform3fv(this.uniforms.baseColor, this.params.baseColor);
        this.gl.uniform1f(this.uniforms.interactionIntensity, this.interactionState.intensity);
        this.gl.uniform1f(this.uniforms.geometry, geometryIndex);
        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    
    animate() {
        this.render();
        
        // Decay interaction intensity
        this.interactionState.intensity *= 0.98;
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Debug method for manual state changes
    forceStateChange(state) {
        console.log(`🔧 Forcing state change: ${JSON.stringify(state)}`);
        
        if (state.theme) {
            this.setTheme(state.theme);
        }
        
        if (state.params) {
            this.updateParameters(state.params);
        }
        
        if (state.interaction) {
            this.updateInteractionState(state.interaction.type || 'debug', state.interaction.intensity || 1.0);
        }
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.VIB3ReactiveHyperAVCore = VIB3ReactiveHyperAVCore;
    console.log('🌈 VIB3 Reactive HyperAV Core loaded and ready for integration');
}