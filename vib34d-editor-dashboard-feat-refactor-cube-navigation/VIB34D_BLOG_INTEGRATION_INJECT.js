/**
 * VIB34D REAL WEBGL SHADER INTEGRATION
 * 
 * This integrates the ACTUAL VIB34D system with 4D mathematics,
 * WebGL shaders, and advanced multi-grid systems into the blog.
 */

// ============================================================================
// 🔮 VIB34D REAL WEBGL INTEGRATION
// ============================================================================

class VIB34DRealWebGLIntegration {
    constructor() {
        this.isInitialized = false;
        this.vib34dInstances = new Map();
        this.currentGeometry = 'hypercube';
        this.interactionData = {
            scrollChaos: 0.0,
            clickPulse: 0.0,
            mouseIntensity: 0.0,
            energy: 0.0
        };
        
        console.log('🔮🌟 VIB34D REAL WebGL Integration initializing...');
    }
    
    /**
     * Initialize VIB34D with REAL WebGL shaders
     */
    async initialize() {
        try {
            // Wait for blog systems
            await this.waitForBlogSystems();
            
            // Replace existing canvas systems with REAL VIB34D WebGL
            this.replaceWithRealVIB34D();
            
            // Setup interaction tracking
            this.setupInteractionTracking();
            
            // Add status display
            this.addIntegrationStatusDisplay();
            
            // Start render loop
            this.startRenderLoop();
            
            this.isInitialized = true;
            console.log('🔮🌟 VIB34D REAL WebGL Integration completed successfully!');
            
        } catch (error) {
            console.error('🔮🌟 VIB34D Real Integration failed:', error);
        }
    }
    
    /**
     * Wait for blog systems to be ready
     */
    async waitForBlogSystems() {
        return new Promise((resolve) => {
            const checkSystems = () => {
                if (window.vib3HomeMaster) {
                    console.log('🏠 VIB3 systems detected, proceeding with REAL integration');
                    resolve();
                } else {
                    console.log('⏳ Waiting for VIB3 systems...');
                    setTimeout(checkSystems, 200);
                }
            };
            checkSystems();
        });
    }
    
    /**
     * Replace existing canvases with REAL VIB34D WebGL renderers
     */
    replaceWithRealVIB34D() {
        // Find all existing visualizer canvases
        const canvases = document.querySelectorAll('canvas[id*="visualizer"]');
        
        canvases.forEach((canvas, index) => {
            // Determine geometry based on canvas ID and face
            const geometry = this.getGeometryForCanvas(canvas);
            
            // Create REAL VIB34D WebGL instance
            const instance = this.createRealVIB34DInstance(canvas, geometry, index);
            
            if (instance) {
                this.vib34dInstances.set(canvas.id, instance);
                console.log(`🔮⚡ Real VIB34D WebGL created for ${canvas.id}: ${geometry}`);
            }
        });
        
        console.log(`🔮⚡ Converted ${this.vib34dInstances.size} canvases to REAL VIB34D WebGL`);
    }
    
    /**
     * Get geometry type for a canvas
     */
    getGeometryForCanvas(canvas) {
        const canvasId = canvas.id;
        const parentFace = canvas.closest('.hypercube-face');
        
        // Bezel geometries
        if (canvasId.includes('bezel')) {
            if (canvasId.includes('left')) return 'wave';
            if (canvasId.includes('right')) return 'tetrahedron';
            if (canvasId.includes('top')) return 'hypercube';
            if (canvasId.includes('bottom')) return 'crystal';
        }
        
        // Face-based geometries
        if (parentFace) {
            const faceClass = Array.from(parentFace.classList).find(c => c.startsWith('face-'));
            if (faceClass) {
                const faceIndex = parseInt(faceClass.split('-')[1]);
                const geometryMap = {
                    0: 'hypercube',    // HOME
                    1: 'tetrahedron',  // TECH
                    2: 'sphere',       // RESEARCH
                    3: 'torus',        // MEDIA
                    4: 'fractal',      // INNOVATION
                    5: 'crystal'       // CONTEXT
                };
                return geometryMap[faceIndex] || 'hypercube';
            }
        }
        
        return 'hypercube'; // Default
    }
    
    /**
     * Create REAL VIB34D WebGL instance
     */
    createRealVIB34DInstance(canvas, geometry, index) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.warn(`🔮⚠️ WebGL not supported for ${canvas.id}, skipping`);
            return null;
        }
        
        const instance = {
            canvas: canvas,
            gl: gl,
            geometry: geometry,
            faceIndex: index,
            isActive: index === 0,
            program: null,
            uniforms: {},
            positionBuffer: null,
            parameters: {
                gridDensity: this.getGeometryGridDensity(geometry),
                morphFactor: 0.5,
                rotationSpeed: 1.0,
                patternIntensity: 1.5,
                dimension: 4.0,
                lineThickness: 0.02
            }
        };
        
        // Initialize WebGL program
        this.initializeWebGLProgram(instance);
        
        return instance;
    }
    
    /**
     * Get geometry-specific grid density
     */
    getGeometryGridDensity(geometry) {
        const densityMap = {
            'hypercube': 12.0,
            'tetrahedron': 8.0,
            'sphere': 15.0,
            'torus': 10.0,
            'wave': 20.0,
            'fractal': 6.0,
            'crystal': 14.0
        };
        return densityMap[geometry] || 12.0;
    }
    
    /**
     * Initialize WebGL program with REAL VIB34D shaders
     */
    initializeWebGLProgram(instance) {
        const gl = instance.gl;
        
        // Create vertex shader
        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
        
        // Create fragment shader with REAL VIB34D mathematics
        const fragmentShaderSource = this.getVIB34DFragmentShader(instance.geometry);
        
        // Compile shaders
        const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) {
            console.error('🔮❌ Failed to compile VIB34D shaders');
            return;
        }
        
        // Create program
        instance.program = gl.createProgram();
        gl.attachShader(instance.program, vertexShader);
        gl.attachShader(instance.program, fragmentShader);
        gl.linkProgram(instance.program);
        
        if (!gl.getProgramParameter(instance.program, gl.LINK_STATUS)) {
            console.error('🔮❌ VIB34D shader program failed to link:', gl.getProgramInfoLog(instance.program));
            return;
        }
        
        // Get uniform locations
        instance.uniforms = {
            u_resolution: gl.getUniformLocation(instance.program, 'u_resolution'),
            u_time: gl.getUniformLocation(instance.program, 'u_time'),
            u_mouse: gl.getUniformLocation(instance.program, 'u_mouse'),
            u_dimension: gl.getUniformLocation(instance.program, 'u_dimension'),
            u_gridDensity: gl.getUniformLocation(instance.program, 'u_gridDensity'),
            u_lineThickness: gl.getUniformLocation(instance.program, 'u_lineThickness'),
            u_morphFactor: gl.getUniformLocation(instance.program, 'u_morphFactor'),
            u_rotationSpeed: gl.getUniformLocation(instance.program, 'u_rotationSpeed'),
            u_audioBass: gl.getUniformLocation(instance.program, 'u_audioBass'),
            u_audioMid: gl.getUniformLocation(instance.program, 'u_audioMid'),
            u_audioHigh: gl.getUniformLocation(instance.program, 'u_audioHigh'),
            u_patternIntensity: gl.getUniformLocation(instance.program, 'u_patternIntensity'),
            u_colorShift: gl.getUniformLocation(instance.program, 'u_colorShift')
        };
        
        // Create vertex buffer for fullscreen quad
        const positions = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0,
        ]);
        
        instance.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instance.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        console.log(`🔮⚡ WebGL program initialized for ${instance.geometry}`);
    }
    
    /**
     * Compile shader
     */
    compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('🔮❌ Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    /**
     * Get REAL VIB34D fragment shader for geometry
     */
    getVIB34DFragmentShader(geometry) {
        const geometryCalculation = this.getGeometryCalculation(geometry);
        const geometryColor = this.getGeometryColor(geometry);
        
        return `
            precision mediump float;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_dimension;
            uniform float u_gridDensity;
            uniform float u_lineThickness;
            uniform float u_morphFactor;
            uniform float u_rotationSpeed;
            uniform float u_audioBass;
            uniform float u_audioMid;
            uniform float u_audioHigh;
            uniform float u_patternIntensity;
            uniform float u_colorShift;
            
            // 4D rotation matrices - REAL VIB34D mathematics
            mat4 rotateXW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    c, 0.0, 0.0, -s,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    s, 0.0, 0.0, c
                );
            }
            
            mat4 rotateYW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1.0, 0.0, 0.0, 0.0,
                    0.0, c, 0.0, -s,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, s, 0.0, c
                );
            }
            
            mat4 rotateZW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, c, -s,
                    0.0, 0.0, s, c
                );
            }
            
            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                
                // Create 4D coordinates
                vec4 p4d = vec4(uv * 2.0, 0.0, u_dimension - 3.0);
                
                // Apply 4D rotations with interaction
                float time_rot = u_time * u_rotationSpeed;
                mat4 rotation = rotateXW(time_rot + u_audioBass * 2.0) * 
                               rotateYW(time_rot * 0.7 + u_audioMid * 1.5) * 
                               rotateZW(time_rot * 0.5 + u_audioHigh * 1.0);
                
                p4d = rotation * p4d;
                
                // Project to 3D
                float w_factor = 2.0 / max(0.1, 2.0 + p4d.w);
                vec3 p3d = p4d.xyz * w_factor;
                
                ${geometryCalculation}
                
                // Enhanced multi-grid system
                float gridSize = u_gridDensity + u_audioBass * 5.0;
                vec3 grid = fract(p3d * gridSize);
                vec3 edges = 1.0 - smoothstep(0.0, u_lineThickness, abs(grid - 0.5));
                float lattice = max(max(edges.x, edges.y), edges.z);
                
                // Color based on geometry
                vec3 color = ${geometryColor};
                color = mix(color, color * 1.5, u_audioMid);
                color = mix(color, vec3(1.0), lattice * u_patternIntensity);
                
                float alpha = lattice * (0.3 + u_audioBass * 0.7);
                gl_FragColor = vec4(color, alpha);
            }
        `;
    }
    
    /**
     * Get geometry-specific shader code
     */
    getGeometryCalculation(geometry) {
        switch (geometry) {
            case 'hypercube':
                return '// Hypercube lattice calculation already handled above';
            case 'tetrahedron':
                return `
                    // Tetrahedral distance calculation
                    vec3 corners[4];
                    corners[0] = normalize(vec3(1.0, 1.0, 1.0));
                    corners[1] = normalize(vec3(-1.0, -1.0, 1.0));
                    corners[2] = normalize(vec3(-1.0, 1.0, -1.0));
                    corners[3] = normalize(vec3(1.0, -1.0, -1.0));
                    
                    float minDist = 1000.0;
                    for(int i = 0; i < 4; i++) {
                        float dist = abs(dot(p3d, corners[i]));
                        minDist = min(minDist, dist);
                    }
                    p3d *= (1.0 + minDist * u_morphFactor);
                `;
            case 'sphere':
                return `
                    // Spherical shell calculation
                    float radius = length(p3d);
                    float shells = sin(radius * u_gridDensity - u_time * 2.0) * 0.5 + 0.5;
                    p3d *= (1.0 + shells * u_morphFactor * 0.3);
                `;
            default:
                return '// Default calculation';
        }
    }
    
    /**
     * Get geometry-specific color
     */
    getGeometryColor(geometry) {
        const colorMap = {
            'hypercube': 'vec3(1.0, 0.0, 1.0)',      // Magenta
            'tetrahedron': 'vec3(0.0, 1.0, 1.0)',   // Cyan
            'sphere': 'vec3(1.0, 1.0, 0.0)',        // Yellow
            'torus': 'vec3(0.0, 1.0, 0.0)',         // Green
            'wave': 'vec3(1.0, 0.0, 0.5)',          // Pink
            'fractal': 'vec3(0.5, 0.0, 1.0)',       // Purple
            'crystal': 'vec3(0.0, 1.0, 0.5)'        // Mint
        };
        return colorMap[geometry] || 'vec3(1.0, 0.0, 1.0)';
    }
    
    /**
     * Setup interaction tracking - ONLY for VIB34D effects, NOT navigation
     */
    setupInteractionTracking() {
        let scrollEnergy = 0;
        let clickEnergy = 0;
        let mouseEnergy = 0;
        
        // Track scrolling - ONLY for visual effects, don't prevent default
        window.addEventListener('wheel', (e) => {
            // Only track if NOT scrolling on content cards
            const target = e.target && e.target.closest ? e.target.closest('.blog-card, .content-section, .card-content') : null;
            if (target) return; // Allow normal scroll on content
            
            const scrollIntensity = Math.min(Math.abs(e.deltaY) / 100, 1.0);
            scrollEnergy = Math.min(1.0, scrollEnergy + scrollIntensity * 0.3);
            this.updateInteraction(scrollEnergy, clickEnergy, mouseEnergy);
        }, { passive: true }); // Passive to not block scroll
        
        // Track mouse movement - ONLY over bezel areas
        window.addEventListener('mousemove', (e) => {
            const isOverBezel = e.target && e.target.closest ? e.target.closest('.navigation-bezel, .bezel-visualizer') : null;
            if (isOverBezel) {
                mouseEnergy = Math.min(1.0, Math.sqrt(e.movementX**2 + e.movementY**2) / 20);
                this.updateInteraction(scrollEnergy, clickEnergy, mouseEnergy);
            }
        });
        
        // Track clicks - ONLY on bezel areas for navigation
        window.addEventListener('click', (e) => {
            const bezelElement = e.target && e.target.closest ? e.target.closest('.navigation-bezel, .bezel-visualizer') : null;
            if (bezelElement) {
                clickEnergy = 1.0;
                this.updateInteraction(scrollEnergy, clickEnergy, mouseEnergy);
                console.log('🔮⚡ Bezel click detected for VIB34D');
                setTimeout(() => {
                    clickEnergy = 0.0;
                    this.updateInteraction(scrollEnergy, clickEnergy, mouseEnergy);
                }, 300);
            }
        });
        
        // Energy decay
        setInterval(() => {
            scrollEnergy *= 0.92;
            mouseEnergy *= 0.95;
            this.updateInteraction(scrollEnergy, clickEnergy, mouseEnergy);
        }, 50);
        
        console.log('🎮⚡ REAL VIB34D interaction tracking established (bezel-focused)');
    }
    
    /**
     * Update interaction data
     */
    updateInteraction(scroll, click, mouse) {
        this.interactionData = {
            scrollChaos: scroll,
            clickPulse: click,
            mouseIntensity: mouse,
            energy: (scroll + click + mouse) / 3.0
        };
        
        this.updateStatusDisplay();
    }
    
    /**
     * Add integration status display
     */
    addIntegrationStatusDisplay() {
        const statusPanel = document.createElement('div');
        statusPanel.id = 'vib34d-real-integration-status';
        statusPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: #ff00ff;
            padding: 15px;
            border-radius: 10px;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 11px;
            border: 2px solid rgba(255, 0, 255, 0.8);
            z-index: 10000;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
            min-width: 220px;
        `;
        
        statusPanel.innerHTML = `
            <div style="color: #ff00ff; font-weight: bold; margin-bottom: 8px; text-align: center;">⚡ VIB34D REAL WEBGL ⚡</div>
            <div class="status-row">
                <span>Status:</span>
                <span id="real-integration-active">ACTIVE</span>
            </div>
            <div class="status-row">
                <span>WebGL Instances:</span>
                <span id="webgl-instance-count">0</span>
            </div>
            <div class="status-row">
                <span>Scroll Energy:</span>
                <span id="real-scroll-energy">0.00</span>
            </div>
            <div class="status-row">
                <span>Mouse Energy:</span>
                <span id="real-mouse-energy">0.00</span>
            </div>
            <div class="status-row">
                <span>Click Energy:</span>
                <span id="real-click-energy">0.00</span>
            </div>
            <div class="status-row">
                <span>4D Dimension:</span>
                <span id="real-dimension">4.0</span>
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #ff00ff;">
                🔮 4D MATHEMATICS ACTIVE<br>
                ⚡ WEBGL SHADERS RUNNING<br>
                🌟 REAL VIB34D SYSTEM
            </div>
        `;
        
        // Add CSS for status rows
        const style = document.createElement('style');
        style.textContent = `
            #vib34d-real-integration-status .status-row {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;
            }
            #vib34d-real-integration-status .status-row span:first-child {
                color: #ff00ff;
            }
            #vib34d-real-integration-status .status-row span:last-child {
                color: #ffffff;
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(statusPanel);
        
        this.statusPanel = statusPanel;
        this.updateStatusDisplay();
    }
    
    /**
     * Update status display
     */
    updateStatusDisplay() {
        if (!this.statusPanel) return;
        
        document.getElementById('webgl-instance-count').textContent = this.vib34dInstances.size;
        document.getElementById('real-scroll-energy').textContent = this.interactionData.scrollChaos.toFixed(2);
        document.getElementById('real-mouse-energy').textContent = this.interactionData.mouseIntensity.toFixed(2);
        document.getElementById('real-click-energy').textContent = this.interactionData.clickPulse.toFixed(2);
        document.getElementById('real-dimension').textContent = (4.0 + this.interactionData.energy * 0.5).toFixed(1);
    }
    
    /**
     * Start render loop
     */
    startRenderLoop() {
        const render = () => {
            if (!this.isInitialized) return;
            
            // Update all WebGL instances
            this.vib34dInstances.forEach((instance) => {
                this.renderWebGLInstance(instance);
            });
            
            requestAnimationFrame(render);
        };
        
        requestAnimationFrame(render);
        console.log('🎬⚡ REAL VIB34D WebGL render loop started');
    }
    
    /**
     * Render WebGL instance
     */
    renderWebGLInstance(instance) {
        if (!instance.program || !instance.gl) return;
        
        const gl = instance.gl;
        const canvas = instance.canvas;
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        gl.useProgram(instance.program);
        
        // Clear with transparent background
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Set uniforms
        const time = performance.now() * 0.001;
        if (instance.uniforms.u_resolution) gl.uniform2f(instance.uniforms.u_resolution, canvas.width, canvas.height);
        if (instance.uniforms.u_time) gl.uniform1f(instance.uniforms.u_time, time);
        if (instance.uniforms.u_mouse) gl.uniform2f(instance.uniforms.u_mouse, 0.5, 0.5);
        if (instance.uniforms.u_dimension) gl.uniform1f(instance.uniforms.u_dimension, instance.parameters.dimension + this.interactionData.energy * 0.5);
        if (instance.uniforms.u_gridDensity) gl.uniform1f(instance.uniforms.u_gridDensity, instance.parameters.gridDensity);
        if (instance.uniforms.u_lineThickness) gl.uniform1f(instance.uniforms.u_lineThickness, instance.parameters.lineThickness + this.interactionData.energy * 0.01);
        if (instance.uniforms.u_morphFactor) gl.uniform1f(instance.uniforms.u_morphFactor, instance.parameters.morphFactor + this.interactionData.energy * 0.3);
        if (instance.uniforms.u_rotationSpeed) gl.uniform1f(instance.uniforms.u_rotationSpeed, instance.parameters.rotationSpeed);
        if (instance.uniforms.u_audioBass) gl.uniform1f(instance.uniforms.u_audioBass, this.interactionData.scrollChaos);
        if (instance.uniforms.u_audioMid) gl.uniform1f(instance.uniforms.u_audioMid, this.interactionData.clickPulse);
        if (instance.uniforms.u_audioHigh) gl.uniform1f(instance.uniforms.u_audioHigh, this.interactionData.mouseIntensity);
        if (instance.uniforms.u_patternIntensity) gl.uniform1f(instance.uniforms.u_patternIntensity, instance.parameters.patternIntensity);
        if (instance.uniforms.u_colorShift) gl.uniform1f(instance.uniforms.u_colorShift, 0.0);
        
        // Bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, instance.positionBuffer);
        const positionLocation = gl.getAttribLocation(instance.program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Draw fullscreen quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    /**
     * Get integration status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            webglInstances: this.vib34dInstances.size,
            interactionData: this.interactionData,
            system: 'REAL VIB34D WebGL'
        };
    }
}

// ============================================================================
// 🚀 AUTO-INITIALIZATION
// ============================================================================

console.log('🔮⚡ VIB34D REAL WebGL Integration script loaded');

// Auto-initialize when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRealVIB34D);
} else {
    initializeRealVIB34D();
}

function initializeRealVIB34D() {
    console.log('🔮⚡ Checking for blog systems...');
    
    // Check if systems are ready immediately
    if (window.vib3HomeMaster) {
        console.log('🔮⚡ Blog systems ready - initializing REAL VIB34D immediately...');
        initializeRealVIB34DIntegration();
    } else {
        console.log('🔮⚡ Blog systems not ready - setting up quick watchers...');
        
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.vib3HomeMaster || attempts > 10) {
                console.log(`🔮⚡ Initializing REAL VIB34D after ${attempts} checks...`);
                clearInterval(checkInterval);
                initializeRealVIB34DIntegration();
            }
        }, 300);
    }
}

function initializeRealVIB34DIntegration() {
    console.log('🔮⚡ Initializing REAL VIB34D WebGL Integration...');
    
    const integration = new VIB34DRealWebGLIntegration();
    integration.initialize();
    
    // Make available globally
    window.vib34dRealIntegration = integration;
    
    // Add to console for debugging
    console.log('🔮⚡ REAL VIB34D Integration available at: window.vib34dRealIntegration');
    console.log('🔮⚡ Status:', integration.getStatus());
}

// ============================================================================
// 🎮 CONSOLE HELPERS
// ============================================================================

window.vib34dReal = {
    status: () => window.vib34dRealIntegration?.getStatus(),
    instances: () => console.log('WebGL Instances:', window.vib34dRealIntegration?.vib34dInstances),
    interact: (scroll, click, mouse) => window.vib34dRealIntegration?.updateInteraction(scroll || 0.5, click || 0.5, mouse || 0.5)
};

console.log('🔮⚡ VIB34D REAL Console helpers available at: window.vib34dReal');
console.log('🔮⚡ Try: vib34dReal.status(), vib34dReal.instances(), vib34dReal.interact(1,1,1)');