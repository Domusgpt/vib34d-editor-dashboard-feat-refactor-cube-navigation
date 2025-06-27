/**
 * UnifiedReactivityBridge.js - The JS-CSS-GLSL Bridge
 * 
 * Creates synchronized multi-layer reactions across HTML/CSS/WebGL rendering layers.
 * Implements the "unified field" of reactivity where JavaScript serves as the central conductor
 * for all system-wide visual responses, ensuring perfect synchronization between:
 * - CSS Custom Properties and animations
 * - WebGL GLSL uniform updates  
 * - DOM class state management
 */

class UnifiedReactivityBridge {
    constructor(homeMaster, visualizers) {
        console.log('🌉 UnifiedReactivityBridge - Synchronizing multi-layer reactions...');
        
        this.homeMaster = homeMaster;
        this.visualizers = visualizers || [];
        this.presetManager = null;
        
        // CSS Custom Properties for unified reactivity (editor-configurable)
        this.cssProperties = {
            '--global-intensity': '0.0',
            '--chaos-intensity': '0.0', 
            '--micro-interaction-scale': '1.0',
            '--scroll-progress': '0.0',
            '--mouse-influence': '0.0',
            '--system-coherence': '1.0',
            '--dimensional-depth': '3.5',
            '--portal-energy': '0.0',
            
            // Editor dashboard parameters
            '--master-intensity': '0.8',
            '--grid-layers': '3',
            '--crystal-accents-enabled': '1',
            '--color-saturation': '0.9',
            '--animation-speed': '1.0',
            
            // Navigation parameters
            '--drag-threshold': '80',
            '--tension-buildup': '0.02',
            '--snap-strength': '1.0',
            
            // Content interaction
            '--content-gravity-strength': '0.3',
            '--content-gravity-radius': '150px',
            '--hover-scale-factor': '1.15',
            '--hover-glow-intensity': '0.6'
        };
        
        // CSS Animation library for coordinated effects
        this.animationClasses = {
            'vhs-glitch-effect': {
                duration: 'calc(2s / (1.0 + var(--global-intensity, 0) * 4.0))',
                properties: ['clip-path', 'text-shadow', 'animation']
            },
            'portal-transition-effect': {
                duration: 'calc(0.8s / (1.0 + var(--global-intensity, 0) * 2.0))',
                properties: ['filter', 'opacity', 'transform']
            },
            'reality-inverted': {
                duration: '1.2s',
                properties: ['filter', 'hue-rotate', 'invert']
            },
            'dimensional-shift': {
                duration: 'calc(1.0s * var(--system-coherence, 1.0))',
                properties: ['transform', 'perspective', 'transform-style']
            },
            'consciousness-breathing': {
                duration: 'calc(3.0s / var(--system-coherence, 1.0))',
                properties: ['opacity', 'transform', 'filter']
            }
        };
        
        // Event coordination system
        this.eventQueue = [];
        this.isProcessingEvents = false;
        this.maxEventsPerFrame = 3;
        
        // Performance monitoring
        this.performanceProfile = 'standard';
        this.frameTime = 0;
        this.lastFrameTime = performance.now();
        
        this.initialize();
    }
    
    setPresetManager(presetManager) {
        this.presetManager = presetManager;
        console.log('🔗 UnifiedReactivityBridge connected to PresetManager');
    }
    
    initialize() {
        this.setupCSSVariableSystem();
        this.setupEventCoordination();
        this.setupPerformanceMonitoring();
        this.startUpdateLoop();
        
        console.log('✅ UnifiedReactivityBridge initialized - Multi-layer synchronization active');
    }
    
    setupCSSVariableSystem() {
        // Initialize CSS custom properties on document root
        const root = document.documentElement;
        Object.entries(this.cssProperties).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Create dynamic CSS for animation classes
        this.injectDynamicCSS();
    }
    
    injectDynamicCSS() {
        const style = document.createElement('style');
        style.id = 'vib3-unified-reactivity-css';
        
        style.textContent = `
            /* VHS/Glitch Effect with dynamic intensity */
            .vhs-glitch-effect {
                position: relative;
            }
            
            .vhs-glitch-effect[data-text]::before,
            .vhs-glitch-effect[data-text]::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-color, #0a0a0a);
                overflow: hidden;
                animation-duration: calc(2s / (1.0 + var(--global-intensity, 0) * 4.0));
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-direction: alternate-reverse;
            }
            
            .vhs-glitch-effect[data-text]::before {
                left: calc(2px * var(--chaos-intensity, 0));
                text-shadow: calc(-1px * var(--chaos-intensity, 0)) 0 red;
                animation-name: vhs-noise-1;
            }
            
            .vhs-glitch-effect[data-text]::after {
                left: calc(-2px * var(--chaos-intensity, 0));
                text-shadow: calc(-1px * var(--chaos-intensity, 0)) 0 blue;
                animation-name: vhs-noise-2;
            }
            
            /* Portal Transition with chromatic aberration */
            .portal-transition-effect {
                animation: chromatic-portal var(--portal-duration, 0.8s) ease-out forwards;
                animation-duration: calc(0.8s / (1.0 + var(--global-intensity, 0) * 2.0));
            }
            
            @keyframes chromatic-portal {
                0% {
                    filter: none;
                    opacity: 1;
                }
                25% {
                    filter: drop-shadow(calc(3px * var(--portal-energy, 1)) 0 0 red) 
                            drop-shadow(calc(-3px * var(--portal-energy, 1)) 0 0 cyan);
                }
                50% {
                    filter: drop-shadow(calc(6px * var(--portal-energy, 1)) 0 0 red) 
                            drop-shadow(calc(-6px * var(--portal-energy, 1)) 0 0 cyan);
                    opacity: 1;
                }
                99% {
                    filter: drop-shadow(calc(20px * var(--portal-energy, 1)) 0 0 red) 
                            drop-shadow(calc(-20px * var(--portal-energy, 1)) 0 0 cyan);
                    opacity: 0;
                }
                100% {
                    filter: none;
                    opacity: 0;
                }
            }
            
            /* Reality Inversion */
            .reality-inverted {
                filter: invert(1) hue-rotate(180deg) contrast(var(--chaos-intensity, 1));
                transition: filter 0.3s ease;
            }
            
            /* Dimensional Shift */
            .dimensional-shift {
                transform: perspective(calc(1200px + var(--dimensional-depth, 3.5) * 200px)) 
                          rotateX(calc(var(--mouse-influence, 0) * 5deg)) 
                          rotateY(calc(var(--mouse-influence, 0) * 3deg));
                transition: transform calc(0.3s * var(--system-coherence, 1.0)) ease-out;
            }
            
            /* Consciousness Breathing */
            .consciousness-breathing {
                animation: unified-breathing calc(3s / var(--system-coherence, 1.0)) ease-in-out infinite;
            }
            
            @keyframes unified-breathing {
                0%, 100% {
                    transform: scale(1) translateZ(0);
                    opacity: var(--global-intensity, 0.8);
                }
                50% {
                    transform: scale(calc(1 + var(--global-intensity, 0) * 0.05)) translateZ(calc(var(--dimensional-depth, 3.5) * 10px));
                    opacity: calc(var(--global-intensity, 0.8) + 0.1);
                }
            }
            
            /* Micro-interactions with global scaling */
            .micro-interactive:hover {
                transform: scale(var(--micro-interaction-scale, 1.05));
                transition: transform 0.2s ease;
            }
            
            /* Responsive visual elements */
            .reactive-element {
                opacity: calc(0.5 + var(--global-intensity, 0) * 0.5);
                transform: translateY(calc(var(--scroll-progress, 0) * -10px));
                filter: brightness(calc(1 + var(--global-intensity, 0) * 0.3));
                transition: all 0.1s ease;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventCoordination() {
        // Intercept and coordinate all interaction events
        this.setupMouseCoordination();
        this.setupScrollCoordination();
        this.setupClickCoordination();
        this.setupKeyboardCoordination();
    }
    
    setupMouseCoordination() {
        let mouseTimeout;
        
        document.addEventListener('mousemove', (e) => {
            const mouseData = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - (e.clientY / window.innerHeight),
                velocity: Math.sqrt(e.movementX**2 + e.movementY**2),
                timestamp: performance.now()
            };
            
            this.queueEvent('mouse', mouseData);
            
            // Auto-decay mouse influence
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.updateCSSProperty('--mouse-influence', '0.0');
            }, 100);
        });
    }
    
    setupScrollCoordination() {
        let scrollAccumulation = 0;
        let scrollTimeout;
        
        document.addEventListener('wheel', (e) => {
            const velocity = Math.abs(e.deltaY);
            const direction = e.deltaY > 0 ? 1 : -1;
            
            scrollAccumulation += velocity;
            
            const scrollData = {
                velocity: velocity,
                direction: direction,
                accumulated: scrollAccumulation,
                position: window.scrollY,
                timestamp: performance.now()
            };
            
            this.queueEvent('scroll', scrollData);
            
            // Decay scroll accumulation
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollAccumulation *= 0.9;
                if (scrollAccumulation < 1) scrollAccumulation = 0;
            }, 100);
        });
    }
    
    setupClickCoordination() {
        document.addEventListener('click', (e) => {
            const clickData = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - (e.clientY / window.innerHeight),
                target: e.target,
                timestamp: performance.now()
            };
            
            this.queueEvent('click', clickData);
        });
    }
    
    setupKeyboardCoordination() {
        document.addEventListener('keydown', (e) => {
            // Special key combinations for debug/effects
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'G': // Glitch effect
                        this.triggerEffect('reality-glitch');
                        break;
                    case 'P': // Portal burst
                        this.triggerEffect('portal-burst');
                        break;
                    case 'D': // Dimensional shift
                        this.triggerEffect('dimensional-shift');
                        break;
                }
            }
        });
    }
    
    queueEvent(type, data) {
        this.eventQueue.push({ type, data, timestamp: performance.now() });
        
        // Prevent queue overflow
        if (this.eventQueue.length > 50) {
            this.eventQueue = this.eventQueue.slice(-30);
        }
    }
    
    processEventQueue() {
        if (this.isProcessingEvents || this.eventQueue.length === 0) return;
        
        this.isProcessingEvents = true;
        const eventsThisFrame = Math.min(this.maxEventsPerFrame, this.eventQueue.length);
        
        for (let i = 0; i < eventsThisFrame; i++) {
            const event = this.eventQueue.shift();
            this.processEvent(event.type, event.data);
        }
        
        this.isProcessingEvents = false;
    }
    
    processEvent(type, data) {
        switch(type) {
            case 'mouse':
                this.processMouse(data);
                break;
            case 'scroll':
                this.processScroll(data);
                break;
            case 'click':
                this.processClick(data);
                break;
            case 'editorUpdate':
                this.processEditorUpdate(data);
                break;
            case 'cubeNavigation':
                this.processCubeNavigation(data);
                break;
        }
    }
    
    /**
     * Process editor dashboard parameter updates
     */
    processEditorUpdate(data) {
        console.log(`🎛️ Editor parameter update: ${data.parameter} = ${data.value}`);
        
        switch(data.parameter) {
            case 'visualIntensity':
                this.updateCSSProperty('--master-intensity', data.value.toString());
                break;
            case 'gridComplexity':
                this.updateCSSProperty('--grid-layers', data.value.toString());
                break;
            case 'crystallineAccents':
                this.updateCSSProperty('--crystal-accents-enabled', data.value ? '1' : '0');
                break;
            case 'colorVibrancy':
                this.updateCSSProperty('--color-saturation', data.value.toString());
                break;
            case 'animationSpeed':
                this.updateCSSProperty('--animation-speed', data.value.toString());
                break;
        }
        
        // Update HomeMaster with new parameter
        if (this.homeMaster.updateFromEditor) {
            this.homeMaster.updateFromEditor(data.parameter, data.value);
        }
        
        // Sync all visualizers
        this.syncAllLayers();
    }
    
    /**
     * Process cube navigation events with editor configuration
     */
    processCubeNavigation(data) {
        const { direction, tension, snapPoint } = data;
        
        // Apply drag threshold from editor config
        const dragThreshold = parseFloat(this.cssProperties['--drag-threshold']);
        const tensionRate = parseFloat(this.cssProperties['--tension-buildup']);
        const snapStrength = parseFloat(this.cssProperties['--snap-strength']);
        
        if (tension * 100 < dragThreshold) {
            // Build tension visual feedback
            this.updateCSSProperty('--cube-tension', (tension * tensionRate).toString());
            return;
        }
        
        // Trigger navigation with snap feedback
        this.updateCSSProperty('--portal-energy', snapStrength.toString());
        
        // Register with HomeMaster
        if (this.homeMaster.registerInteraction) {
            this.homeMaster.registerInteraction('cubeRotation', tension * snapStrength);
        }
        
        console.log(`🎲 Cube navigation: ${direction} (tension: ${tension}, snap: ${snapStrength})`);
    }
    
    processMouse(data) {
        const intensity = Math.min(1.0, data.velocity / 40);
        
        // Update CSS variables
        this.updateCSSProperty('--mouse-influence', intensity.toFixed(3));
        this.updateCSSProperty('--micro-interaction-scale', (1.0 + intensity * 0.05).toFixed(3));
        
        // Update HomeMaster
        this.homeMaster.updateInteraction('mouse', {
            x: data.x,
            y: data.y,
            intensity: intensity
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.updateInteraction) {
                viz.updateInteraction(data.x, data.y, intensity);
            }
        });
    }
    
    processScroll(data) {
        const normalizedVelocity = Math.min(1.0, data.velocity / 100);
        const chaosIntensity = Math.min(1.0, data.accumulated / 500);
        
        // Update CSS variables
        this.updateCSSProperty('--global-intensity', normalizedVelocity.toFixed(3));
        this.updateCSSProperty('--chaos-intensity', chaosIntensity.toFixed(3));
        this.updateCSSProperty('--scroll-progress', (data.position / document.body.scrollHeight).toFixed(3));
        
        // Check for portal burst threshold
        if (data.velocity > 1500) {
            this.triggerPortalBurst(data.velocity);
        }
        
        // Update HomeMaster
        this.homeMaster.updateInteraction('scroll', {
            velocity: normalizedVelocity,
            chaos: chaosIntensity
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.updateChaos) {
                viz.updateChaos(chaosIntensity);
            }
        });
    }
    
    processClick(data) {
        // Update CSS variables for click pulse
        this.updateCSSProperty('--global-intensity', '1.0');
        
        // Auto-decay after click
        setTimeout(() => {
            this.updateCSSProperty('--global-intensity', '0.0');
        }, 300);
        
        // Update HomeMaster
        this.homeMaster.updateInteraction('click', {
            x: data.x,
            y: data.y
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.triggerClick) {
                viz.triggerClick(data.x, data.y);
            }
        });
        
        // Create CSS ripple effect
        this.createRippleEffect(data.x * window.innerWidth, data.y * window.innerHeight);
    }
    
    triggerPortalBurst(velocity) {
        const intensity = Math.min(2.0, velocity / 1000);
        
        // Update CSS for portal effect
        this.updateCSSProperty('--portal-energy', intensity.toFixed(3));
        this.updateCSSProperty('--chaos-intensity', '1.0');
        
        // Add portal burst class to body
        document.body.classList.add('portal-transition-effect');
        
        // Remove class after animation
        setTimeout(() => {
            document.body.classList.remove('portal-transition-effect');
            this.updateCSSProperty('--portal-energy', '0.0');
        }, 800);
        
        console.log(`🌀 Portal Burst triggered - velocity: ${velocity}, intensity: ${intensity}`);
    }
    
    triggerEffect(effectName) {
        switch(effectName) {
            case 'reality-glitch':
                this.triggerRealityGlitch();
                break;
            case 'portal-burst':
                this.triggerPortalBurst(2000);
                break;
            case 'dimensional-shift':
                this.triggerDimensionalShift();
                break;
        }
    }
    
    triggerRealityGlitch() {
        // CSS reality inversion
        document.body.classList.add('reality-inverted');
        this.updateCSSProperty('--chaos-intensity', '1.0');
        
        // Update HomeMaster for coordinated effect
        this.homeMaster.updateInteraction('click', { intensity: 1.0 });
        
        // WebGL inversion
        this.visualizers.forEach(viz => {
            if (viz.updateParameters) {
                viz.updateParameters({ 
                    glitchIntensity: 1.0,
                    colorInvert: true 
                });
            }
        });
        
        // Remove effect after duration
        setTimeout(() => {
            document.body.classList.remove('reality-inverted');
            this.updateCSSProperty('--chaos-intensity', '0.0');
        }, 1200);
        
        console.log('⚡ Reality Glitch triggered - Full system inversion');
    }
    
    triggerDimensionalShift() {
        const newDimension = 3.8;
        
        // CSS dimensional shift
        this.updateCSSProperty('--dimensional-depth', newDimension.toString());
        document.body.classList.add('dimensional-shift');
        
        // HomeMaster dimension update
        this.homeMaster.overrideParameters({ dimension: newDimension });
        
        // WebGL dimension update
        this.visualizers.forEach(viz => {
            if (viz.updateParameters) {
                viz.updateParameters({ dimension: newDimension });
            }
        });
        
        // Return to baseline
        setTimeout(() => {
            document.body.classList.remove('dimensional-shift');
            this.updateCSSProperty('--dimensional-depth', '3.5');
            this.homeMaster.overrideParameters({ dimension: 3.5 });
        }, 2000);
        
        console.log(`🌌 Dimensional Shift triggered - New dimension: ${newDimension}`);
    }
    
    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'unified-ripple-effect';
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 50}px;
            top: ${y - 50}px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, transparent 70%);
            pointer-events: none;
            z-index: 10000;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    }
    
    updateCSSProperty(property, value) {
        this.cssProperties[property] = value;
        document.documentElement.style.setProperty(property, value);
    }
    
    setupPerformanceMonitoring() {
        // Adjust performance based on frame rate
        setInterval(() => {
            const currentTime = performance.now();
            this.frameTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            // Adjust event processing based on performance
            if (this.frameTime > 32) { // < 30 FPS
                this.maxEventsPerFrame = 1;
                this.performanceProfile = 'minimal';
            } else if (this.frameTime > 20) { // < 50 FPS
                this.maxEventsPerFrame = 2;
                this.performanceProfile = 'standard';
            } else {
                this.maxEventsPerFrame = 3;
                this.performanceProfile = 'premium';
            }
        }, 1000);
    }
    
    startUpdateLoop() {
        const update = () => {
            this.processEventQueue();
            
            // Update system coherence based on HomeMaster state
            if (this.homeMaster) {
                const systemState = this.homeMaster.getSystemState();
                this.updateCSSProperty('--system-coherence', systemState.masterState.coherence.toFixed(3));
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
        console.log('🔄 UnifiedReactivityBridge update loop started - Multi-layer synchronization active');
    }
    
    /**
     * Sync all visual layers with current parameter state
     */
    syncAllLayers() {
        // Update all CSS custom properties
        Object.entries(this.cssProperties).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.updateParameters) {
                viz.updateParameters(this.getWebGLParameters());
            }
        });
        
        console.log('🔄 All visual layers synchronized');
    }
    
    /**
     * Get current parameters formatted for WebGL shaders
     */
    getWebGLParameters() {
        return {
            masterIntensity: parseFloat(this.cssProperties['--master-intensity']),
            gridLayers: parseInt(this.cssProperties['--grid-layers']),
            colorSaturation: parseFloat(this.cssProperties['--color-saturation']),
            animationSpeed: parseFloat(this.cssProperties['--animation-speed']),
            contentGravityStrength: parseFloat(this.cssProperties['--content-gravity-strength']),
            globalIntensity: parseFloat(this.cssProperties['--global-intensity']),
            chaosIntensity: parseFloat(this.cssProperties['--chaos-intensity']),
            dimensionalDepth: parseFloat(this.cssProperties['--dimensional-depth'])
        };
    }
    
    /**
     * Update parameter from editor dashboard
     */
    updateFromEditor(parameter, value) {
        this.queueEvent('editorUpdate', { parameter, value });
    }
    
    /**
     * Trigger cube navigation event
     */
    triggerCubeNavigation(direction, tension, snapPoint = false) {
        this.queueEvent('cubeNavigation', { direction, tension, snapPoint });
    }
    
    // Public API for manual effect triggering
    setPreset(presetName) {
        if (this.presetManager) {
            const preset = this.presetManager.getInteractionPreset(presetName);
            if (preset) {
                this.queueEvent('preset', { preset: preset });
            }
        }
    }
    
    getSystemState() {
        return {
            cssProperties: {...this.cssProperties},
            eventQueueLength: this.eventQueue.length,
            performanceProfile: this.performanceProfile,
            frameTime: this.frameTime,
            visualizerCount: this.visualizers.length,
            editorParameters: this.getWebGLParameters(),
            isEditorConnected: !!this.homeMaster?.editorConfig
        };
    }
}

export default UnifiedReactivityBridge;