/**
 * VIB34D STYLE SYSTEM - CORE VISUALIZER
 * Extracted from working demo, enhanced for multi-instance framework
 * 
 * Provides the mathematical foundation for reactive UI design
 * where form maintains relational coherence even when scrambled
 */

console.log('🌌 VIB34D Core System Loading...');

const MAX_SHADER_LAYERS = 4; // Max layers the shader will support

// ===== VIB34D REACTIVE VISUALIZER CORE =====
class VIB34DCore {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported for VIB34D Core');
            return;
        }
        
        // Instance configuration
        this.instanceId = options.instanceId || `vib34d-${Date.now()}`;
        // this.instanceRole = options.role || 'background'; // Role is now per-layer, managed by MultiInstance
        // this.parameterModifier = options.modifier || 1.0; // Modifier is now per-layer, managed by MultiInstance
        
        // Core state
        this.startTime = Date.now();
        this.currentTheme = options.geometry || 'hypercube'; // Base geometry for this core/section
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
        
        // Theme configurations (EXACT from working demo with crystal included)
        this.themeConfigs = {
            hypercube: {
                baseColor: [1.0, 0.0, 1.0],      // Magenta
                gridDensity: 12.0,
                morphFactor: 0.5,
                dimension: 3.5,
                glitchIntensity: 0.3,
                rotationSpeed: 0.5,
                geometry: 'hypercube'
            },
            tetrahedron: {
                baseColor: [0.0, 1.0, 1.0],      // Cyan
                gridDensity: 8.0,
                morphFactor: 0.7,
                dimension: 3.2,
                glitchIntensity: 0.2,
                rotationSpeed: 0.7,
                geometry: 'tetrahedron'
            },
            sphere: {
                baseColor: [1.0, 1.0, 0.0],      // Yellow
                gridDensity: 15.0,
                morphFactor: 0.3,
                dimension: 3.8,
                glitchIntensity: 0.1,
                rotationSpeed: 0.3,
                geometry: 'sphere'
            },
            torus: {
                baseColor: [0.0, 1.0, 0.0],      // Green
                gridDensity: 10.0,
                morphFactor: 0.8,
                dimension: 3.6,
                glitchIntensity: 0.4,
                rotationSpeed: 0.6,
                geometry: 'torus'
            },
            klein: {
                baseColor: [1.0, 0.5, 0.0],      // Orange
                gridDensity: 14.0,
                morphFactor: 0.9,
                dimension: 3.9,
                glitchIntensity: 0.5,
                rotationSpeed: 0.4,
                geometry: 'klein'
            },
            fractal: {
                baseColor: [0.5, 0.0, 1.0],      // Purple
                gridDensity: 20.0,
                morphFactor: 0.6,
                dimension: 3.7,
                glitchIntensity: 0.6,
                rotationSpeed: 0.8,
                geometry: 'fractal'
            },
            wave: {
                baseColor: [1.0, 0.0, 0.5],      // Pink
                gridDensity: 16.0,
                morphFactor: 0.4,
                dimension: 3.3,
                glitchIntensity: 0.3,
                rotationSpeed: 0.9,
                geometry: 'wave'
            },
            crystal: {
                baseColor: [0.0, 1.0, 0.5],      // Mint - Universal UI Framework
                gridDensity: 18.0,
                morphFactor: 0.2,
                dimension: 3.1,
                glitchIntensity: 0.2,
                rotationSpeed: 0.2,
                geometry: 'crystal'
            }
        };
        
        // Current parameters (reactive) with instance modifier applied
        this.params = this.applyInstanceModifier({ ...this.themeConfigs[this.currentTheme] });
        
        this.initShaders();
        this.initBuffers();
        this.resize();
        
        // Don't auto-start animation - controlled by MultiInstanceManager
        this.isActive = false;
        this.activeEffects = {}; // To store original values during temporary effects
        
        console.log(`✅ VIB34D Core [${this.instanceId}] initialized - ${this.currentTheme}`);
    }
    
    // applyInstanceModifier is removed as modifiers are handled by VIB34DMultiInstance before params are passed to VIB34DCore layers.
    // VIB34DCore now expects pre-calculated parameters for each layer if rendering multiple layers,
    // or uses its this.params as the single source of truth if rendering one configuration.
    
    initShaders() {
        const vertexShaderSource = `
          attribute vec2 a_position;
          void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `;
        
        // EXACT fragment shader from working demo
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
          
          // Geometry generators (EXACT from demo)
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
        
        if (!vertexShader || !fragmentShader) {
            console.error('VIB34D shader compilation failed');
            return;
        }
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('VIB34D program linking failed:', this.gl.getProgramInfoLog(this.program));
            return;
        }
        
        // Get uniform locations
        this.uniforms = {
            resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
            interactionIntensity: this.gl.getUniformLocation(this.program, 'u_interactionIntensity'),
            geometry: this.gl.getUniformLocation(this.program, 'u_geometry'), // Global for all layers in this instance

            // Layer-specific array uniforms
            // Note: WebGL1 requires array uniforms to be addressed like 'u_LayerOpacities[0]' in gl.getUniformLocation
            // For simplicity here, we'll fetch the base name and assume the shader handles array indexing.
            // Or, more commonly, one sets each element u_LayerOpacities[0], u_LayerOpacities[1], ... individually.
            layerOpacities: [],
            layerBaseColors: [],
            layerGridDensities: [],
            layerMorphFactors: [],
            layerGlitchIntensities: [],
            layerRotationSpeeds: [],
            layerDimensions: []
        };

        for (let i = 0; i < MAX_SHADER_LAYERS; i++) {
            this.uniforms.layerOpacities[i] = this.gl.getUniformLocation(this.program, `u_LayerOpacities[${i}]`);
            this.uniforms.layerBaseColors[i] = this.gl.getUniformLocation(this.program, `u_LayerBaseColors[${i}]`);
            this.uniforms.layerGridDensities[i] = this.gl.getUniformLocation(this.program, `u_LayerGridDensities[${i}]`);
            this.uniforms.layerMorphFactors[i] = this.gl.getUniformLocation(this.program, `u_LayerMorphFactors[${i}]`);
            this.uniforms.layerGlitchIntensities[i] = this.gl.getUniformLocation(this.program, `u_LayerGlitchIntensities[${i}]`);
            this.uniforms.layerRotationSpeeds[i] = this.gl.getUniformLocation(this.program, `u_LayerRotationSpeeds[${i}]`);
            this.uniforms.layerDimensions[i] = this.gl.getUniformLocation(this.program, `u_LayerDimensions[${i}]`);
        }
        // Add u_numLayers uniform to tell shader how many layers are active
        this.uniforms.numLayers = this.gl.getUniformLocation(this.program, 'u_numLayers');
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('VIB34D shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    initBuffers() {
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    applyTemporaryEffect(effectParams) {
        if (!effectParams || typeof effectParams !== 'object') return;

        const { duration = 1000, glitchIntensityAdd = 0, dimensionShift = 0, rotationSpeedFactor = 1 } = effectParams;

        // Store original values before applying, if not already overridden by another effect
        if (this.activeEffects['glitchIntensity'] === undefined) {
            this.activeEffects['glitchIntensity'] = this.params.glitchIntensity;
        }
        if (this.activeEffects['dimension'] === undefined) {
            this.activeEffects['dimension'] = this.params.dimension;
        }
        if (this.activeEffects['rotationSpeed'] === undefined) {
            this.activeEffects['rotationSpeed'] = this.params.rotationSpeed;
        }

        // Apply effects (additive or multiplicative as appropriate)
        this.params.glitchIntensity += glitchIntensityAdd;
        this.params.dimension += dimensionShift; // Could also be a target value if shader supports it well
        this.params.rotationSpeed *= rotationSpeedFactor;

        // Clamp parameters to sensible ranges to avoid breaking visuals
        this.params.glitchIntensity = Math.max(0, Math.min(1.0, this.params.glitchIntensity));
        this.params.dimension = Math.max(3.0, Math.min(4.0, this.params.dimension));
        this.params.rotationSpeed = Math.max(0, Math.min(5.0, this.params.rotationSpeed));

        console.log(`💥 VIB34DCore [${this.instanceId}] applying temp effect. New params:`, this.params);

        // Set a timeout to revert the effect
        setTimeout(() => {
            console.log(`💥 VIB34DCore [${this.instanceId}] reverting temp effect.`);
            // Revert to stored original values
            this.params.glitchIntensity = this.activeEffects['glitchIntensity'];
            this.params.dimension = this.activeEffects['dimension'];
            this.params.rotationSpeed = this.activeEffects['rotationSpeed'];

            // Clear stored originals for these specific parameters
            delete this.activeEffects['glitchIntensity'];
            delete this.activeEffects['dimension'];
            delete this.activeEffects['rotationSpeed'];

            // Potentially re-apply instance modifier if base params changed during effect
            // This requires knowing the true 'base' parameters from HomeMaster for this section/geometry
            // For now, this simple revert assumes base params didn't change.
        }, duration);
    }
    
    resize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.gl.viewport(0, 0, width, height);
        }
    }
    
    updateTheme(newTheme, baseParamsForTheme = null) {
        // This method now primarily updates the base geometry type for the section's renderer
        // and its own default 'this.params'.
        // The MultiInstanceManager is responsible for creating the varied layer parameters.
        if (this.themeConfigs[newTheme]) {
            this.currentTheme = newTheme;
            // Update own 'this.params' to the defaults for this new theme.
            // These params might be used if render() is called without arrayOfLayerParams,
            // or as a fallback.
            this.params = { ...(baseParamsForTheme || this.themeConfigs[newTheme]) };
            console.log(`🎨 VIB34DCore [${this.instanceId}] base theme set to: ${newTheme}`);
        } else {
            console.warn(`🎨 VIB34DCore [${this.instanceId}] unknown theme: ${newTheme}`);
        }
    }
    
    updateInteractionState(state) {
        Object.assign(this.interactionState, state);
        
        // Enhanced interaction parameter modification
        switch(state.type) {
            case 'scroll':
                const scrollModifier = Math.min(state.scrollVelocity / 20, 1.0);
                this.params.gridDensity = (this.params.gridDensity / this.parameterModifier) * this.parameterModifier * (1.0 + scrollModifier * 0.5);
                this.params.dimension = (this.params.dimension / this.parameterModifier) * this.parameterModifier + scrollModifier * 0.3;
                break;
                
            case 'hold':
                if (state.isHolding) {
                    const holdDuration = (Date.now() - state.holdStart) / 1000;
                    this.params.morphFactor = Math.min((this.params.morphFactor / this.parameterModifier) * this.parameterModifier + holdDuration * 0.2, 1.0);
                    this.params.dimension = Math.min((this.params.dimension / this.parameterModifier) * this.parameterModifier + holdDuration * 0.1, 4.0);
                }
                break;
        }
    }
    
    render(arrayOfLayerParams = []) {
        if (!this.program || !this.isActive || !this.glContext) return; // Check glContext too
        
        this.resize(); // Ensure canvas size is up-to-date
        this.gl.useProgram(this.program);
        
        const time = (Date.now() - this.startTime) / 1000;
        
        // Set global uniforms (apply to all layers)
        this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.time, time);
        this.gl.uniform2f(this.uniforms.mouse, this.interactionState.mouseX, this.interactionState.mouseY);
        this.gl.uniform1f(this.uniforms.interactionIntensity, this.interactionState.intensity);

        const geometryMap = {
            hypercube: 0, tetrahedron: 1, sphere: 2, torus: 3,
            klein: 4, fractal: 5, wave: 6, crystal: 7
        };
        // currentTheme is the base geometry for the section (all layers share this base geometric type)
        this.gl.uniform1f(this.uniforms.geometry, geometryMap[this.currentTheme] || 0);

        let numActiveLayers = 0;
        if (arrayOfLayerParams && arrayOfLayerParams.length > 0) {
            numActiveLayers = Math.min(arrayOfLayerParams.length, MAX_SHADER_LAYERS);
            for (let i = 0; i < numActiveLayers; i++) {
                const layerParams = arrayOfLayerParams[i];
                if (!layerParams) continue;

                // Set layer-specific uniforms
                // Ensure VIB34DMultiInstance provides these correctly structured, including defaults.
                if(this.uniforms.layerOpacities[i]) this.gl.uniform1f(this.uniforms.layerOpacities[i], layerParams.opacity || 0.5);
                if(this.uniforms.layerBaseColors[i]) this.gl.uniform3fv(this.uniforms.layerBaseColors[i], new Float32Array(layerParams.baseColor || [1,0,1]));
                if(this.uniforms.layerGridDensities[i]) this.gl.uniform1f(this.uniforms.layerGridDensities[i], layerParams.gridDensity || 10.0);
                if(this.uniforms.layerMorphFactors[i]) this.gl.uniform1f(this.uniforms.layerMorphFactors[i], layerParams.morphFactor || 0.5);
                if(this.uniforms.layerGlitchIntensities[i]) this.gl.uniform1f(this.uniforms.layerGlitchIntensities[i], layerParams.glitchIntensity || 0.1);
                if(this.uniforms.layerRotationSpeeds[i]) this.gl.uniform1f(this.uniforms.layerRotationSpeeds[i], layerParams.rotationSpeed || 0.5);
                if(this.uniforms.layerDimensions[i]) this.gl.uniform1f(this.uniforms.layerDimensions[i], layerParams.dimension || 3.5);
            }
        } else {
            // Fallback: Render a single layer using this.params if no array is provided
            // This is useful for CrystalUIElement or simple single-layer visualizers
            numActiveLayers = 1;
            if(this.uniforms.layerOpacities[0]) this.gl.uniform1f(this.uniforms.layerOpacities[0], this.params.opacity || 0.8); // Assuming opacity is in this.params
            if(this.uniforms.layerBaseColors[0]) this.gl.uniform3fv(this.uniforms.layerBaseColors[0], new Float32Array(this.params.baseColor || [1,0,1]));
            if(this.uniforms.layerGridDensities[0]) this.gl.uniform1f(this.uniforms.layerGridDensities[0], this.params.gridDensity || 10.0);
            if(this.uniforms.layerMorphFactors[0]) this.gl.uniform1f(this.uniforms.layerMorphFactors[0], this.params.morphFactor || 0.5);
            if(this.uniforms.layerGlitchIntensities[0]) this.gl.uniform1f(this.uniforms.layerGlitchIntensities[0], this.params.glitchIntensity || 0.1);
            if(this.uniforms.layerRotationSpeeds[0]) this.gl.uniform1f(this.uniforms.layerRotationSpeeds[0], this.params.rotationSpeed || 0.5);
            if(this.uniforms.layerDimensions[0]) this.gl.uniform1f(this.uniforms.layerDimensions[0], this.params.dimension || 3.5);
        }

        if(this.uniforms.numLayers) this.gl.uniform1i(this.uniforms.numLayers, numActiveLayers);


        // Enable blending for multi-layer rendering
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); // Standard alpha blending
        // For additive screen-like effects, might use: gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        this.gl.disable(this.gl.BLEND); // Disable blend after drawing if not needed globally

        // Decay interaction intensity
        this.interactionState.intensity *= 0.95;
    }
    
    start() {
        this.isActive = true;
        console.log(`🎬 VIB34D [${this.instanceId}] started`);
    }
    
    pause() {
        this.isActive = false;
        console.log(`⏸️ VIB34D [${this.instanceId}] paused`);
    }
    
    destroy() {
        this.isActive = false;
        if (this.program) this.gl.deleteProgram(this.program);
        if (this.buffer) this.gl.deleteBuffer(this.buffer);
        console.log(`🗑️ VIB34D [${this.instanceId}] destroyed`);
    }
}

// Export for VIB34D Style System
window.VIB34DCore = VIB34DCore;
console.log('✅ VIB34D Core System loaded - Ready for multi-instance framework');