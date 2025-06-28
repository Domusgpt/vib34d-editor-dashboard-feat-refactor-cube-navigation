/**
 * VIB3HomeMaster.js - The Single Source of Truth
 * 
 * Implements the "Foundational Trinity" principle: Home-Master Controls Everything
 * This is the central authority that drives all 13 visualizers in the NEOSKEUOMORPHIC_HOLOGRAPHIC_UI
 * through fixed modifiers, ensuring deep visual coherence across the entire system.
 * 
 * Architecture: Master State → Section Parameters → Role-Specific Instance Parameters
 */

class VIB3HomeMaster {
    constructor() {
        console.log('🏠 VIB3HomeMaster - Single Source of Truth Initializing...');
        
        // Configuration system integration
        this.editorConfig = null;
        this.siteContentData = null;
        this.loadEditorConfiguration();
        this.loadSiteContentData();
        
        // Master State - The single source of truth for all visual parameters
        this.masterState = {
            intensity: 0.8,        // Global energy level (0.0 - 1.0)
            speed: 1.0,           // Global animation speed multiplier
            density: 1.0,         // Global grid density multiplier  
            dimension: 3.5,       // 4D projection dimension (3.0 - 4.0)
            complexity: 0.5,      // Morphing and chaos intensity
            coherence: 1.0,       // System-wide visual unity factor
            
            // Interactive state
            mouseIntensity: 0.0,
            clickPulse: 0.0,
            scrollChaos: 0.0,
            
            // Current section context
            activeSection: 0,     // 0=home, 1=tech, 2=media, 3=audio, 4=quantum
            transitionProgress: 1.0,
            
            // Editor configuration state
            editorOverrides: {}
        };
        
        // Section Modifiers - Relational mathematical relationships (configurable)
        // Each section's parameters = masterState × sectionModifier
        this.sectionModifiers = {
            0: { // HOME - Hypercube Foundation
                intensityMod: 1.0,
                speedMod: 1.0, 
                densityMod: 1.0,
                complexityMod: 1.0,
                geometry: 0.0,
                baseColor: [1.0, 0.0, 1.0], // Magenta sovereignty
                name: 'HOME'
            },
            1: { // TECH - Tetrahedron Precision  
                intensityMod: 0.8,
                speedMod: 0.6,
                densityMod: 0.7,
                complexityMod: 0.4,
                geometry: 1.0,
                baseColor: [0.0, 1.0, 1.0], // Cyan precision
                name: 'TECH'
            },
            2: { // MEDIA - Sphere Potential
                intensityMod: 1.3,
                speedMod: 1.4,
                densityMod: 1.2,
                complexityMod: 1.1,
                geometry: 2.0,
                baseColor: [1.0, 1.0, 0.0], // Yellow infinite potential
                name: 'MEDIA'
            },
            3: { // AUDIO - Torus Flow
                intensityMod: 0.9,
                speedMod: 1.1,
                densityMod: 0.8,
                complexityMod: 0.9,
                geometry: 3.0,
                baseColor: [0.0, 1.0, 0.0], // Green flow
                name: 'AUDIO'
            },
            4: { // QUANTUM - Wave Nexus
                intensityMod: 1.5,
                speedMod: 1.2,
                densityMod: 1.4,
                complexityMod: 1.3,
                geometry: 6.0,
                baseColor: [1.0, 0.0, 0.5], // Pink probability
                name: 'QUANTUM'
            }
        };
        
        // Instance Role Modifiers - Applied after section calculation
        // These create the multi-layer depth system found in NEOSKEUOMORPHIC_HOLOGRAPHIC_UI
        this.instanceRoles = {
            'background': {
                gridScale: 0.4,
                morphScale: 0.2,
                rotationScale: 0.3,
                dimensionBoost: -0.2,
                interactionSensitivity: 0.3,
                color: 'base'
            },
            'shadow': {
                gridScale: 0.8,
                morphScale: 0.3,
                rotationScale: 0.5,
                dimensionBoost: -0.1,
                interactionSensitivity: 0.5,
                color: 'darken'
            },
            'content': {
                gridScale: 1.0,
                morphScale: 1.0,
                rotationScale: 1.0,
                dimensionBoost: 0.0,
                interactionSensitivity: 1.0,
                color: 'base'
            },
            'highlight': {
                gridScale: 1.5,
                morphScale: 0.8,
                rotationScale: 1.2,
                dimensionBoost: 0.1,
                interactionSensitivity: 1.2,
                color: 'brighten'
            },
            'accent': {
                gridScale: 0.6,
                morphScale: 0.4,
                rotationScale: 0.4,
                dimensionBoost: 0.2,
                interactionSensitivity: 1.5,
                color: 'complement'
            }
        };
        
        // Interaction decay rates
        this.decayRates = {
            mouseIntensity: 0.95,
            clickPulse: 0.92,
            scrollChaos: 0.96
        };
        
        // Performance monitoring
        this.lastUpdateTime = performance.now();
        this.updateInterval = 16; // ~60fps
        
        this.startUpdateLoop();
    }
    
    /**
     * Load editor dashboard configuration
     */
    async loadEditorConfiguration() {
        try {
            const response = await fetch('./presets/editor-dashboard-config.json');
            this.editorConfig = await response.json();
            console.log('📊 Editor configuration loaded:', this.editorConfig.editorDashboard.version);
            
            // Apply master controls from config
            this.applyEditorMasterControls();
        } catch (error) {
            console.warn('⚠️ Editor configuration not found, using defaults');
            this.editorConfig = { editorDashboard: { masterControls: {}, pageRelations: {} } };
        }
    }

    /**
     * Load site content data for dynamic content rendering
     */
    async loadSiteContentData() {
        try {
            const response = await fetch('./site-content.json');
            this.siteContentData = await response.json();
            console.log('📄 Site content data loaded:', this.siteContentData.sections?.length || 0, 'sections');
        } catch (error) {
            console.warn('⚠️ Site content data not found, dynamic content disabled');
            this.siteContentData = { sections: [] };
        }
    }
    
    /**
     * Apply editor master control defaults
     */
    applyEditorMasterControls() {
        const masterControls = this.editorConfig?.editorDashboard?.masterControls;
        if (!masterControls) return;
        
        if (masterControls.visualIntensity) {
            this.masterState.intensity = masterControls.visualIntensity.default;
        }
        if (masterControls.animationSpeed) {
            this.masterState.speed = masterControls.animationSpeed.default;
        }
        if (masterControls.gridComplexity) {
            this.masterState.density = masterControls.gridComplexity.default / 3.0; // Normalize
        }
        
        console.log('🎛️ Master controls applied from editor config');
    }
    
    /**
     * Update parameter from editor dashboard
     */
    updateFromEditor(parameter, value) {
        console.log(`🎛️ Editor update: ${parameter} = ${value}`);
        
        switch(parameter) {
            case 'visualIntensity':
                this.masterState.intensity = value;
                this.masterState.editorOverrides.intensity = value;
                break;
            case 'animationSpeed':
                this.masterState.speed = value;
                this.masterState.editorOverrides.speed = value;
                break;
            case 'gridComplexity':
                this.masterState.density = value / 3.0; // Normalize from 1-5 to 0.33-1.67
                this.masterState.editorOverrides.density = value;
                break;
            case 'colorVibrancy':
                this.masterState.editorOverrides.colorVibrancy = value;
                break;
        }
        
        // Trigger immediate parameter sync
        if (window.vib3Bridge) {
            window.vib3Bridge.syncAllLayers();
        }
    }
    
    /**
     * Get the derived parameters for a specific section with editor configuration
     * This implements both "Home-Master Controls Everything" and relational modifiers
     */
    getParametersForSection(sectionKey) {
        const modifier = this.sectionModifiers[sectionKey];
        if (!modifier) {
            console.warn(`[VIB3HomeMaster] Unknown section: ${sectionKey}`);
            return this.getParametersForSection(0); // Default to HOME
        }
        
        // Get page relation config from editor
        const pageRelation = this.editorConfig?.editorDashboard?.pageRelations?.[this.getSectionName(sectionKey)];
        
        // Calculate final modifiers (config overrides defaults)
        const finalIntensityMod = pageRelation?.modifiers?.intensityModifier || modifier.intensityMod;
        const finalSpeedMod = pageRelation?.modifiers?.speedModifier || modifier.speedMod;
        const finalGridMod = pageRelation?.modifiers?.gridModifier || modifier.densityMod;
        const finalComplexityMod = pageRelation?.modifiers?.complexityModifier || modifier.complexityMod;
        
        // Apply section modifiers to master state
        const baseParams = {
            geometry: modifier.geometry,
            intensity: this.masterState.intensity * finalIntensityMod,
            speed: this.masterState.speed * finalSpeedMod,
            density: this.masterState.density * finalGridMod,
            dimension: this.masterState.dimension,
            complexity: this.masterState.complexity * finalComplexityMod,
            baseColor: pageRelation?.colorBase || modifier.baseColor,
            
            // Interactive parameters (applied globally)
            mouseIntensity: this.masterState.mouseIntensity,
            clickPulse: this.masterState.clickPulse,
            scrollChaos: this.masterState.scrollChaos,
            
            // Coherence factor ensures system-wide unity
            coherence: this.masterState.coherence
        };
        
        // Apply editor overrides
        if (this.masterState.editorOverrides.colorVibrancy) {
            baseParams.colorVibrancy = this.masterState.editorOverrides.colorVibrancy;
        }
        
        return baseParams;
    }
    
    /**
     * Get section name from key for editor config lookup
     */
    getSectionName(sectionKey) {
        const sectionNames = ['home', 'tech', 'media', 'audio', 'quantum'];
        return sectionNames[sectionKey] || 'home';
    }
    
    /**
     * Get final parameters for a specific visualizer instance
     * Applies role-based modifiers to section parameters
     */
    getInstanceParameters(sectionKey, role) {
        const sectionParams = this.getParametersForSection(sectionKey);
        const roleConfig = this.instanceRoles[role];
        
        if (!roleConfig) {
            console.warn(`[VIB3HomeMaster] Unknown role: ${role}`);
            return sectionParams;
        }
        
        // Apply role-specific modifiers
        const finalParams = {
            geometry: sectionParams.geometry,
            gridDensity: sectionParams.density * roleConfig.gridScale,
            rotationSpeed: sectionParams.speed * roleConfig.rotationScale,
            morphFactor: sectionParams.complexity * roleConfig.morphScale,
            dimension: sectionParams.dimension + roleConfig.dimensionBoost,
            intensity: sectionParams.intensity,
            
            // Color modifications based on role
            baseColor: this.applyColorModification(sectionParams.baseColor, roleConfig.color),
            
            // Interactive responsiveness
            mouseIntensity: sectionParams.mouseIntensity * roleConfig.interactionSensitivity,
            clickPulse: sectionParams.clickPulse * roleConfig.interactionSensitivity,
            scrollChaos: sectionParams.scrollChaos * roleConfig.interactionSensitivity,
            
            // System coherence
            coherence: sectionParams.coherence
        };
        
        return finalParams;
    }
    
    /**
     * Apply color modifications based on role
     */
    applyColorModification(baseColor, colorMod) {
        switch(colorMod) {
            case 'darken':
                return baseColor.map(c => c * 0.7);
            case 'brighten':
                return baseColor.map(c => Math.min(1.0, c * 1.3));
            case 'complement':
                // Simple complement calculation
                return [1.0 - baseColor[0], 1.0 - baseColor[1], 1.0 - baseColor[2]];
            case 'base':
            default:
                return [...baseColor];
        }
    }
    
    /**
     * Update master state based on user interactions
     */
    updateInteraction(type, data) {
        switch(type) {
            case 'mouse':
                this.masterState.mouseIntensity = Math.min(1.0, data.intensity);
                break;
                
            case 'click':
                this.masterState.clickPulse = Math.min(1.0, this.masterState.clickPulse + 0.8);
                break;
                
            case 'scroll':
                this.masterState.scrollChaos = Math.min(1.0, Math.abs(data.chaos));
                // Scroll can also affect global intensity
                this.masterState.intensity = Math.min(1.0, 
                    this.masterState.intensity + Math.abs(data.velocity) * 0.1);
                break;
                
            case 'section':
                this.transitionToSection(data.section);
                break;
        }
    }
    
    /**
     * Transition to a new section with smooth interpolation
     */
    transitionToSection(newSection) {
        if (newSection === this.masterState.activeSection) return;
        
        console.log(`🌀 VIB3HomeMaster transitioning: ${this.sectionModifiers[this.masterState.activeSection].name} → ${this.sectionModifiers[newSection].name}`);
        
        this.masterState.activeSection = newSection;
        this.masterState.transitionProgress = 0.0;
        
        // Trigger coherence enhancement during transitions
        this.masterState.coherence = 1.5; // Temporarily boost system unity
    }
    
    /**
     * Main update loop - applies decay and manages transitions
     */
    startUpdateLoop() {
        const update = (currentTime) => {
            const deltaTime = currentTime - this.lastUpdateTime;
            
            if (deltaTime >= this.updateInterval) {
                // Apply decay to interactive parameters
                this.masterState.mouseIntensity *= this.decayRates.mouseIntensity;
                this.masterState.clickPulse *= this.decayRates.clickPulse;
                this.masterState.scrollChaos *= this.decayRates.scrollChaos;
                
                // Smooth transition progress
                if (this.masterState.transitionProgress < 1.0) {
                    this.masterState.transitionProgress = Math.min(1.0, 
                        this.masterState.transitionProgress + 0.02);
                }
                
                // Return coherence to baseline
                if (this.masterState.coherence > 1.0) {
                    this.masterState.coherence *= 0.98;
                }
                
                // Return intensity to baseline when no interaction
                if (this.masterState.mouseIntensity < 0.01 && 
                    this.masterState.clickPulse < 0.01 && 
                    this.masterState.scrollChaos < 0.01) {
                    this.masterState.intensity *= 0.99;
                    this.masterState.intensity = Math.max(0.3, this.masterState.intensity); // Minimum baseline
                }
                
                this.lastUpdateTime = currentTime;
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
        console.log('🔄 VIB3HomeMaster update loop started - Managing 13 visualizers hierarchically');
    }
    
    /**
     * Get current system state for debugging/monitoring
     */
    getSystemState() {
        return {
            masterState: {...this.masterState},
            currentSection: this.sectionModifiers[this.masterState.activeSection],
            totalVisualizers: Object.keys(this.instanceRoles).length * Object.keys(this.sectionModifiers).length
        };
    }
    
    /**
     * Register interaction with editor-configurable responses
     */
    registerInteraction(type, intensity, duration = 1000) {
        const interactionConfig = this.editorConfig?.editorDashboard?.interactionPresets;
        
        console.log(`🎮 Interaction registered: ${type} (intensity: ${intensity})`);
        
        switch(type) {
            case 'cubeRotation':
                if (interactionConfig?.cubeNavigation?.enabled) {
                    const config = interactionConfig.cubeNavigation;
                    const tensionStrength = config.tensionBuildup?.default || 0.02;
                    this.updateInteraction('mouse', { intensity: intensity * tensionStrength });
                }
                break;
                
            case 'hover':
                if (interactionConfig?.hoverEffects?.enabled) {
                    const config = interactionConfig.hoverEffects;
                    const glowIntensity = config.glowIntensity?.default || 0.6;
                    this.updateInteraction('mouse', { intensity: intensity * glowIntensity });
                }
                break;
                
            case 'contentGravity':
                if (interactionConfig?.contentGravity?.enabled) {
                    const config = interactionConfig.contentGravity;
                    const gravityStrength = config.gravityStrength?.default || 0.3;
                    this.masterState.editorOverrides.contentGravity = gravityStrength;
                }
                break;
        }
    }
    
    /**
     * Get current configuration state for editor dashboard
     */
    getEditorState() {
        return {
            masterState: {...this.masterState},
            editorConfig: this.editorConfig,
            currentParameters: this.getParametersForSection(this.masterState.activeSection),
            availablePresets: this.editorConfig?.editorDashboard || {}
        };
    }
    
    /**
     * Manual parameter override for specific effects
     */
    overrideParameters(overrides) {
        Object.assign(this.masterState, overrides);
        Object.assign(this.masterState.editorOverrides, overrides);
    }
    
    /**
     * Reset to baseline state
     */
    reset() {
        this.masterState = {
            intensity: 0.5,
            speed: 0.5,
            density: 1.0,
            dimension: 3.5,
            complexity: 0.5,
            coherence: 1.0,
            mouseIntensity: 0.0,
            clickPulse: 0.0,
            scrollChaos: 0.0,
            activeSection: 0,
            transitionProgress: 1.0
        };
        
        console.log('🔄 VIB3HomeMaster reset to baseline state');
    }
}

export default VIB3HomeMaster;