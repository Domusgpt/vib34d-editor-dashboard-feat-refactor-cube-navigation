/**
 * ReactiveHyperAVCore.js - Advanced WebGL 4D Visualization Engine
 * 
 * Implements sophisticated 4D polytope rendering with:
 * - 8 sacred geometries (hypercube, tetrahedron, sphere, torus, klein, fractal, wave, crystal)
 * - JSON-driven parameter configuration
 * - Real-time interaction responsiveness
 * - Mathematical parameter relationships
 * - Performance optimization and context pooling
 */

import ShaderManager from './ShaderManager.js';
import GeometryManager from './GeometryManager.js';
import ProjectionManager from './ProjectionManager.js';

class ReactiveHyperAVCore {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.error('WebGL not supported for ReactiveHyperAVCore');
            throw new Error('WebGL not supported');
        }
        
        console.log('🎨 ReactiveHyperAVCore initializing...');
        
        // Configuration system
        this.config = {
            visualsConfig: null,
            behaviorConfig: null,
            contentConfig: null,
            currentSection: 0,
            currentTheme: 'hypercube',
            ...options
        };
        
        // Core state
        this.startTime = Date.now();
        this.currentTheme = this.config.currentTheme;
        this.currentGeometry = 'hypercube';
        
        // Interaction state tracking
        this.interactionState = {
            type: 'idle',
            intensity: 0,
            lastActivity: Date.now(),
            holdStart: 0,
            isHolding: false,
            scrollVelocity: 0,
            mouseX: 0.5,
            mouseY: 0.5,
            dragActive: false,
            resizeActive: false
        };
        
        // Default parameters (overridden by JSON config)
        this.baseParameters = {
            dimension: 3.5,
            morphFactor: 0.5,
            gridDensity: 12.0,
            glitchIntensity: 0.3,
            rotationSpeed: 0.5,
            interactionIntensity: 0.0,
            baseColor: [1.0, 0.0, 1.0],
            accentColor: [0.0, 1.0, 1.0]
        };
        
        // Current active parameters
        this.activeParameters = { ...this.baseParameters };
        
        // Core rendering systems
        this.shaderManager = null;
        this.geometryManager = null;
        this.projectionManager = null;
        
        // Geometry mapping for shader uniforms
        this.geometryMap = {
            'hypercube': 0, 'tetrahedron': 1, 'sphere': 2, 'torus': 3,
            'kleinbottle': 4, 'fractal': 5, 'wave': 6, 'crystal': 7
        };
        
        // Performance tracking
        this.performance = {
            frameCount: 0,
            lastFrameTime: 0,
            fps: 0,
            renderTime: 0
        };
        
        this.initializeSystems();
        this.setupInteractions();
        this.setupCanvas();
        this.startRenderLoop();
        
        console.log('✅ ReactiveHyperAVCore initialized');
    }
    
    async initializeSystems() {
        try {
            // Initialize core rendering systems in correct order
            this.geometryManager = new GeometryManager();
            this.projectionManager = new ProjectionManager();
            this.shaderManager = new ShaderManager(this.gl, this.geometryManager, this.projectionManager);
            
            // Load and compile default shader program
            await this.createVisualizationProgram();
            
            // Initialize buffers
            this.initBuffers();
            
            console.log('🔧 Core rendering systems initialized');
        } catch (error) {
            console.error('❌ Failed to initialize rendering systems:', error);
            throw error;
        }
    }
    
    async createVisualizationProgram() {
        try {
            // Use ShaderManager's dynamic program creation with geometry and projection
            this.program = this.shaderManager.createDynamicProgram(
                'reactiveHyperAV', 
                this.currentGeometry, 
                'perspective'
            );
            
            if (!this.program) {
                throw new Error('Failed to create reactive HyperAV shader program');
            }
            
            // Use the shader manager to set active program
            this.shaderManager.useProgram('reactiveHyperAV');
            
            console.log('🎨 ReactiveHyperAV shader program created and active');
        } catch (error) {
            console.error('❌ Failed to create visualization program:', error);
            throw error;
        }
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
    
    setupCanvas() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }
    
    setupInteractions() {
        let lastScrollY = window.scrollY;
        let lastScrollTime = Date.now();
        
        // Mouse movement tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.interactionState.mouseX = (e.clientX - rect.left) / rect.width;
            this.interactionState.mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
            this.interactionState.lastActivity = Date.now();
            this.updateInteractionState('move', 0.3);
        });
        
        // Click/Touch interactions
        const startInteraction = (e) => {
            this.interactionState.isHolding = true;
            this.interactionState.holdStart = Date.now();
            this.updateInteractionState('hold', 1.0);
            e.preventDefault();
        };
        
        const endInteraction = () => {
            this.interactionState.isHolding = false;
            this.updateInteractionState('release', 0.1);
        };
        
        this.canvas.addEventListener('mousedown', startInteraction);
        this.canvas.addEventListener('mouseup', endInteraction);
        this.canvas.addEventListener('touchstart', startInteraction, { passive: false });
        this.canvas.addEventListener('touchend', endInteraction);
        
        // Scroll tracking
        window.addEventListener('scroll', () => {
            const currentTime = Date.now();
            const currentY = window.scrollY;
            const deltaY = Math.abs(currentY - lastScrollY);
            const deltaTime = currentTime - lastScrollTime;
            
            if (deltaTime > 0) {
                this.interactionState.scrollVelocity = deltaY / deltaTime * 100;
                this.updateInteractionState('scroll', Math.min(this.interactionState.scrollVelocity / 20, 1.0));
            }
            
            lastScrollY = currentY;
            lastScrollTime = currentTime;
            this.interactionState.lastActivity = currentTime;
        });
        
        // Inactivity detection
        setInterval(() => {
            const timeSinceActivity = Date.now() - this.interactionState.lastActivity;
            if (timeSinceActivity > 3000) {
                this.updateInteractionState('idle', 0.0);
            }
        }, 1000);
    }
    
    updateInteractionState(type, intensity) {
        this.interactionState.type = type;
        this.interactionState.intensity = Math.max(this.interactionState.intensity * 0.9, intensity);
        this.activeParameters.interactionIntensity = this.interactionState.intensity;
    }
    
    // JSON Configuration Integration
    loadVisualConfiguration(visualsConfig) {
        this.config.visualsConfig = visualsConfig;
        
        if (visualsConfig.themes && visualsConfig.themes[this.currentTheme]) {
            const themeConfig = visualsConfig.themes[this.currentTheme];
            
            // Apply theme parameters
            Object.assign(this.activeParameters, themeConfig.parameters);
            this.activeParameters.baseColor = themeConfig.baseColor || this.baseParameters.baseColor;
            this.activeParameters.accentColor = themeConfig.accentColor || this.baseParameters.accentColor;
            
            console.log(`🎨 Applied visual theme: ${this.currentTheme}`);
        }
    }
    
    loadBehaviorConfiguration(behaviorConfig) {
        this.config.behaviorConfig = behaviorConfig;
        
        if (behaviorConfig.vib34dGeometries && behaviorConfig.vib34dGeometries[this.currentGeometry]) {
            const geometryConfig = behaviorConfig.vib34dGeometries[this.currentGeometry];
            Object.assign(this.activeParameters, geometryConfig.defaultParameters);
            
            console.log(`🔧 Applied geometry behavior: ${this.currentGeometry}`);
        }
    }
    
    loadContentConfiguration(contentConfig) {
        this.config.contentConfig = contentConfig;
        this.config.currentSection = contentConfig.currentSection || 0;
        
        console.log(`📄 Applied content configuration for section: ${this.config.currentSection}`);
    }
    
    // Theme and geometry switching
    setTheme(themeName) {
        if (!this.config.visualsConfig || !this.config.visualsConfig.themes[themeName]) {
            console.warn(`Theme '${themeName}' not found in configuration`);
            return;
        }
        
        this.currentTheme = themeName;
        const themeConfig = this.config.visualsConfig.themes[themeName];
        
        // Smooth transition to new theme
        this.transitionToParameters(themeConfig.parameters);
        this.activeParameters.baseColor = themeConfig.baseColor;
        this.activeParameters.accentColor = themeConfig.accentColor;
        
        console.log(`🎨 Theme changed to: ${themeName}`);
    }
    
    async setGeometry(geometryName) {
        if (!this.geometryMap.hasOwnProperty(geometryName)) {
            console.warn(`Geometry '${geometryName}' not supported`);
            return;
        }
        
        this.currentGeometry = geometryName;
        
        // Recreate shader program with new geometry
        try {
            this.program = this.shaderManager.createDynamicProgram(
                'reactiveHyperAV', 
                this.currentGeometry, 
                'perspective'
            );
            
            if (this.program) {
                this.shaderManager.useProgram('reactiveHyperAV');
            }
        } catch (error) {
            console.error('❌ Failed to recreate shader for new geometry:', error);
        }
        
        // Apply geometry-specific parameters if available
        if (this.config.behaviorConfig && this.config.behaviorConfig.vib34dGeometries[geometryName]) {
            const geometryConfig = this.config.behaviorConfig.vib34dGeometries[geometryName];
            this.transitionToParameters(geometryConfig.defaultParameters);
        }
        
        console.log(`🔧 Geometry changed to: ${geometryName}`);
    }
    
    transitionToParameters(targetParams, duration = 1000) {
        const startParams = { ...this.activeParameters };
        const startTime = Date.now();
        
        const transition = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            
            Object.keys(targetParams).forEach(key => {
                if (typeof targetParams[key] === 'number' && typeof startParams[key] === 'number') {
                    this.activeParameters[key] = startParams[key] + (targetParams[key] - startParams[key]) * eased;
                }
            });
            
            if (progress < 1.0) {
                requestAnimationFrame(transition);
            }
        };
        
        transition();
    }
    
    updateParameters(newParams) {
        Object.assign(this.activeParameters, newParams);
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
        const startTime = performance.now();
        
        // Handle hold interactions (dimensional shift)
        let holdEffect = 0;
        if (this.interactionState.isHolding) {
            const holdDuration = Date.now() - this.interactionState.holdStart;
            holdEffect = Math.min(holdDuration / 2000, 1.0);
        }
        
        const currentDimension = this.activeParameters.dimension + holdEffect * 0.5;
        const currentGridDensity = this.activeParameters.gridDensity * (1.0 + this.interactionState.intensity * 0.2);
        const geometryIndex = this.geometryMap[this.currentGeometry] || 0;
        
        // Clear and setup
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.shaderManager.useProgram('reactiveHyperAV');
        
        // Setup vertex attributes using ShaderManager
        const positionLocation = this.shaderManager.getAttributeLocation('a_position');
        if (positionLocation !== null && this.positionBuffer) {
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        } else if (!this.positionBuffer) {
            // Reinitialize buffers if missing
            console.warn('⚠️ Position buffer missing, reinitializing...');
            this.initBuffers();
            if (positionLocation !== null) {
                this.gl.enableVertexAttribArray(positionLocation);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
                this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            }
        }
        
        // Set uniforms using ShaderManager
        const uniforms = {
            'u_resolution': [this.canvas.width, this.canvas.height],
            'u_time': (Date.now() - this.startTime) / 1000,
            'u_dimension': currentDimension,
            'u_morphFactor': this.activeParameters.morphFactor,
            'u_gridDensity': currentGridDensity,
            'u_glitchIntensity': this.activeParameters.glitchIntensity,
            'u_rotationSpeed': this.activeParameters.rotationSpeed,
            'u_patternIntensity': this.interactionState.intensity,
            'u_primaryColor': this.activeParameters.baseColor,
            'u_secondaryColor': this.activeParameters.accentColor,
            'u_backgroundColor': [0.02, 0.05, 0.1],
            'u_audioBass': 0.0,
            'u_audioMid': 0.0,
            'u_audioHigh': 0.0,
            'u_colorShift': 0.0,
            'u_universeModifier': geometryIndex,
            'u_lineThickness': 1.0,
            'u_shellWidth': 1.0,
            'u_tetraThickness': 1.0
        };
        
        // Set each uniform
        for (const [name, value] of Object.entries(uniforms)) {
            const location = this.shaderManager.getUniformLocation(name);
            if (location !== null) {
                if (Array.isArray(value)) {
                    if (value.length === 2) {
                        this.gl.uniform2f(location, value[0], value[1]);
                    } else if (value.length === 3) {
                        this.gl.uniform3fv(location, value);
                    }
                } else {
                    this.gl.uniform1f(location, value);
                }
            }
        }
        
        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        // Performance tracking
        this.performance.renderTime = performance.now() - startTime;
        this.performance.frameCount++;
    }
    
    startRenderLoop() {
        const animate = () => {
            this.resize();
            this.render();
            
            // Decay interaction intensity
            this.interactionState.intensity *= 0.98;
            this.activeParameters.interactionIntensity = this.interactionState.intensity;
            
            requestAnimationFrame(animate);
        };
        
        animate();
        console.log('🔄 Render loop started');
    }
    
    getSystemState() {
        return {
            currentTheme: this.currentTheme,
            currentGeometry: this.currentGeometry,
            activeParameters: { ...this.activeParameters },
            interactionState: { ...this.interactionState },
            performance: { ...this.performance },
            canvasSize: { width: this.canvas.width, height: this.canvas.height }
        };
    }
    
    dispose() {
        console.log('🧹 Disposing ReactiveHyperAVCore...');
        
        if (this.gl && !this.gl.isContextLost()) {
            if (this.positionBuffer) {
                this.gl.deleteBuffer(this.positionBuffer);
            }
            
            if (this.shaderManager) {
                this.shaderManager.dispose();
            }
        }
        
        this.canvas = null;
        this.gl = null;
        console.log('✅ ReactiveHyperAVCore disposed');
    }
}

export default ReactiveHyperAVCore;