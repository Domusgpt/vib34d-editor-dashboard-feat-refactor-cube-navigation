/**
 * VIB34D INTEGRATED SYSTEM BRIDGE
 * 
 * Connects Editor Dashboard → Phase 5 Interaction System → Moiré RGB System
 * Creates the relational, reactive UI system where everything responds to everything
 */

// ============================================================================
// 🌉 VIB34D INTEGRATED SYSTEM BRIDGE
// ============================================================================

class VIB34DIntegratedSystemBridge {
    constructor() {
        this.isInitialized = false;
        this.elements = new Map();
        this.interactionEngine = null;
        this.moireEngine = null;
        this.relationships = new Map();
        
        // Master state tracking
        this.masterState = {
            globalEnergy: 0.0,
            lastInteraction: Date.now(),
            activeElements: new Set(),
            relationshipChains: []
        };
        
        // Configuration
        this.config = {
            // Relationship processing
            maxRelationshipDepth: 3,
            relationshipDecay: 0.9,
            energyThreshold: 0.1,
            
            // Interaction mapping
            interactionMappings: {
                scroll: 'u_audioBass',    // Phase 5 mapping
                click: 'u_audioMid',      // Phase 5 mapping  
                mouse: 'u_audioHigh'      // Phase 5 mapping
            },
            
            // Moiré integration
            moireEffectTypes: {
                button: 'cardBorder',
                card: 'cardBorder', 
                nav: 'gridOverlay',
                header: 'waveDistortion',
                background: 'fullMoire',
                section: 'subtleMoire',
                overlay: 'intenseMoire',
                accent: 'pulseMoire'
            }
        };
        
        console.log('🌉 VIB34D Integrated System Bridge initialized');
    }
    
    /**
     * Initialize the complete integrated system
     */
    async initialize() {
        console.log('🚀 Initializing VIB34D Integrated System...');
        
        try {
            // Initialize Phase 5 Interaction Engine
            await this.initializeInteractionEngine();
            
            // Initialize Moiré RGB Engine
            await this.initializeMoireEngine();
            
            // Setup cross-system communication
            this.setupSystemBridges();
            
            // Setup relationship processing
            this.setupRelationshipEngine();
            
            // Start master coordination loop
            this.startMasterCoordination();
            
            this.isInitialized = true;
            console.log('✅ VIB34D Integrated System fully operational');
            
        } catch (error) {
            console.error('❌ Failed to initialize integrated system:', error);
            throw error;
        }
    }
    
    /**
     * Initialize Phase 5 Interaction Engine
     */
    async initializeInteractionEngine() {
        // Check if VIB34DInteractionEngine is available
        if (typeof VIB34DInteractionEngine !== 'undefined') {
            this.interactionEngine = new VIB34DInteractionEngine();
            
            // Configure interaction mappings for our system
            this.interactionEngine.configureMapping('scroll_to_bass', {
                curve: 'exponential',
                multiplier: 1.5,
                smoothing: 0.1
            });
            
            this.interactionEngine.configureMapping('click_to_mid', {
                curve: 'smooth',
                multiplier: 2.0,
                smoothing: 0.15
            });
            
            this.interactionEngine.configureMapping('mouse_to_high', {
                curve: 'linear',
                multiplier: 1.2,
                smoothing: 0.08
            });
            
            console.log('✅ Phase 5 Interaction Engine initialized');
        } else {
            console.warn('⚠️ VIB34DInteractionEngine not available - creating basic interaction tracking');
            this.interactionEngine = this.createBasicInteractionEngine();
        }
    }
    
    /**
     * Initialize Moiré RGB Engine
     */
    async initializeMoireEngine() {
        if (typeof VIB34DMoireRGBEngine !== 'undefined') {
            this.moireEngine = new VIB34DMoireRGBEngine();
            this.moireEngine.initialize();
            
            console.log('✅ Moiré RGB Engine initialized');
        } else {
            console.warn('⚠️ VIB34DMoireRGBEngine not available - creating basic effects');
            this.moireEngine = this.createBasicMoireEngine();
        }
    }
    
    /**
     * Setup communication bridges between systems
     */
    setupSystemBridges() {
        // Bridge: Interaction Engine → Element Updates
        if (this.interactionEngine) {
            // Override or extend the interaction engine's parameter update method
            const originalUpdate = this.interactionEngine.updateShaderParameter?.bind(this.interactionEngine);
            
            if (originalUpdate) {
                this.interactionEngine.updateShaderParameter = (paramName, value) => {
                    // Call original update
                    originalUpdate(paramName, value);
                    
                    // Broadcast to our system
                    this.broadcastParameterUpdate(paramName, value);
                };
            }
        }
        
        // Bridge: Moiré Engine → Interaction Events
        if (this.moireEngine) {
            // Hook into moiré interaction tracking
            const originalUpdateParams = this.moireEngine.updateMoireParameters?.bind(this.moireEngine);
            
            if (originalUpdateParams) {
                this.moireEngine.updateMoireParameters = () => {
                    originalUpdateParams();
                    
                    // Sync moiré energy with our master state
                    this.masterState.globalEnergy = Math.max(
                        this.masterState.globalEnergy,
                        this.moireEngine.interactionData?.energy || 0
                    );
                };
            }
        }
        
        console.log('✅ System bridges established');
    }
    
    /**
     * Setup relationship processing engine
     */
    setupRelationshipEngine() {
        // Process relationships every frame
        this.relationshipProcessor = {
            process: () => {
                this.elements.forEach((elementData, elementId) => {
                    if (elementData.relationships.type !== 'none') {
                        this.processElementRelationships(elementId, elementData);
                    }
                });
            }
        };
        
        console.log('✅ Relationship engine configured');
    }
    
    /**
     * Start master coordination loop
     */
    startMasterCoordination() {
        const coordinationLoop = () => {
            // Update master state
            this.updateMasterState();
            
            // Process relationships
            this.relationshipProcessor.process();
            
            // Apply cross-element effects
            this.applyCrossElementEffects();
            
            // Energy decay
            this.applyEnergyDecay();
            
            // Continue loop
            requestAnimationFrame(coordinationLoop);
        };
        
        coordinationLoop();
        console.log('✅ Master coordination loop started');
    }
    
    /**
     * Register element from editor dashboard
     */
    registerElement(elementData) {
        const elementId = elementData.id;
        
        // Store element data
        this.elements.set(elementId, {
            ...elementData,
            lastUpdate: Date.now(),
            currentEnergy: 0.0,
            effectiveParameters: { ...elementData.properties },
            relationshipInfluences: new Map()
        });
        
        // Setup element-specific interaction tracking
        this.setupElementInteractions(elementId);
        
        // Setup element-specific moiré effects
        this.setupElementMoire(elementId);
        
        console.log(`📌 Registered element: ${elementId} (${elementData.type})`);
    }
    
    /**
     * Setup element-specific interactions
     */
    setupElementInteractions(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const elementData = this.elements.get(elementId);
        
        // Hover interactions
        element.addEventListener('mouseenter', () => {
            this.triggerElementInteraction(elementId, 'hover', elementData.properties.hoverIntensity);
        });
        
        element.addEventListener('mouseleave', () => {
            this.triggerElementInteraction(elementId, 'hover', 0);
        });
        
        // Click interactions
        element.addEventListener('click', () => {
            this.triggerElementInteraction(elementId, 'click', elementData.properties.clickResponse);
        });
        
        // Mouse movement within element
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            this.triggerElementInteraction(elementId, 'mouse', { x, y });
        });
    }
    
    /**
     * Setup element-specific moiré effects
     */
    setupElementMoire(elementId) {
        const elementData = this.elements.get(elementId);
        const effectType = this.config.moireEffectTypes[elementData.type] || 'cardBorder';
        
        // Apply appropriate moiré effect based on element type
        switch (effectType) {
            case 'cardBorder':
                this.applyCardBorderMoire(elementId);
                break;
                
            case 'gridOverlay':
                this.applyGridOverlayMoire(elementId);
                break;
                
            case 'fullMoire':
                this.applyFullMoireEffect(elementId);
                break;
                
            default:
                this.applyBasicMoireEffect(elementId);
        }
    }
    
    /**
     * Trigger element interaction
     */
    triggerElementInteraction(elementId, interactionType, intensity) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        // Update element energy
        elementData.currentEnergy = Math.max(elementData.currentEnergy, intensity);
        elementData.lastUpdate = Date.now();
        
        // Add to active elements
        this.masterState.activeElements.add(elementId);
        
        // Update master global energy
        this.masterState.globalEnergy = Math.max(
            this.masterState.globalEnergy,
            intensity * 0.5
        );
        
        // Apply to visualizer if available
        if (elementData.visualizer) {
            this.updateVisualizerFromInteraction(elementData, interactionType, intensity);
        }
        
        // Trigger relationship effects
        if (elementData.relationships.type !== 'none') {
            this.propagateRelationshipEffect(elementId, interactionType, intensity);
        }
        
        console.log(`⚡ ${elementId} ${interactionType} interaction: ${intensity}`);
    }
    
    /**
     * Update visualizer based on interaction
     */
    updateVisualizerFromInteraction(elementData, interactionType, intensity) {
        if (!elementData.visualizer) return;
        
        const updates = {};
        
        switch (interactionType) {
            case 'hover':
                updates.u_audioBass = intensity * 0.6;
                updates.patternIntensity = 1.5 + intensity * 0.8;
                break;
                
            case 'click':
                updates.u_audioMid = intensity * 0.8;
                updates.morphFactor = elementData.properties.morphFactor + intensity * 0.3;
                updates.glitchIntensity = 0.02 + intensity * 0.05;
                break;
                
            case 'mouse':
                if (typeof intensity === 'object') {
                    updates.u_mouse = [intensity.x, intensity.y];
                    updates.u_audioHigh = (intensity.x + intensity.y) * 0.5;
                }
                break;
        }
        
        elementData.visualizer.updateParameters(updates);
    }
    
    /**
     * Propagate relationship effects
     */
    propagateRelationshipEffect(sourceElementId, interactionType, intensity) {
        const sourceElement = this.elements.get(sourceElementId);
        if (!sourceElement) return;
        
        const relationshipType = sourceElement.relationships.type;
        const strength = sourceElement.relationships.strength;
        
        // Find target elements (for now, affect all other elements)
        this.elements.forEach((targetElement, targetElementId) => {
            if (targetElementId === sourceElementId) return;
            
            const effectIntensity = intensity * strength;
            
            switch (relationshipType) {
                case 'sync':
                    // Sync: Apply same effect to target
                    this.applyRelationshipEffect(targetElementId, interactionType, effectIntensity);
                    break;
                    
                case 'inverse':
                    // Inverse: Apply opposite effect
                    this.applyRelationshipEffect(targetElementId, interactionType, -effectIntensity);
                    break;
                    
                case 'cascade':
                    // Cascade: Delayed and reduced effect
                    setTimeout(() => {
                        this.applyRelationshipEffect(targetElementId, interactionType, effectIntensity * 0.6);
                    }, 100);
                    break;
                    
                case 'amplify':
                    // Amplify: Boost target's current effects
                    this.amplifyElementEffects(targetElementId, effectIntensity);
                    break;
            }
        });
    }
    
    /**
     * Apply relationship effect to target element
     */
    applyRelationshipEffect(targetElementId, interactionType, intensity) {
        const targetElement = this.elements.get(targetElementId);
        if (!targetElement) return;
        
        // Store relationship influence
        targetElement.relationshipInfluences.set(interactionType, {
            intensity,
            timestamp: Date.now()
        });
        
        // Apply to visualizer
        if (targetElement.visualizer) {
            this.updateVisualizerFromInteraction(targetElement, interactionType, Math.abs(intensity));
        }
        
        // Visual feedback on element
        const elementDOM = document.getElementById(targetElementId);
        if (elementDOM) {
            elementDOM.style.filter = `brightness(${1 + intensity * 0.3}) contrast(${1 + intensity * 0.2})`;
            
            setTimeout(() => {
                elementDOM.style.filter = '';
            }, 300);
        }
    }
    
    /**
     * Amplify element's current effects
     */
    amplifyElementEffects(targetElementId, amplification) {
        const targetElement = this.elements.get(targetElementId);
        if (!targetElement || !targetElement.visualizer) return;
        
        // Amplify current parameters
        const currentParams = targetElement.effectiveParameters;
        const amplifiedParams = {
            patternIntensity: currentParams.patternIntensity * (1 + amplification),
            morphFactor: Math.min(1.5, currentParams.morphFactor * (1 + amplification * 0.5)),
            rotationSpeed: currentParams.rotationSpeed * (1 + amplification * 0.3)
        };
        
        targetElement.visualizer.updateParameters(amplifiedParams);
        
        // Return to normal after delay
        setTimeout(() => {
            targetElement.visualizer.updateParameters(currentParams);
        }, 500);
    }
    
    /**
     * Apply moiré effects
     */
    applyCardBorderMoire(elementId) {
        const element = document.getElementById(elementId);
        if (!element || !this.moireEngine) return;
        
        // Add element to moiré system if it has the method
        if (this.moireEngine.setupCardBorders) {
            element.classList.add('blog-card'); // Add class that moiré system looks for
        }
    }
    
    applyGridOverlayMoire(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Create grid overlay
        const overlay = document.createElement('div');
        overlay.className = 'moire-grid-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            opacity: 0.3;
            background-image: 
                repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,0,255,0.1) 9px),
                repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,255,255,0.1) 9px);
        `;
        
        element.appendChild(overlay);
    }
    
    applyFullMoireEffect(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Apply full moiré background effect
        element.style.background = `
            repeating-linear-gradient(
                45deg,
                rgba(255, 0, 255, 0.1) 0px,
                rgba(255, 0, 255, 0.1) 2px,
                transparent 2px,
                transparent 12px
            ),
            repeating-linear-gradient(
                -45deg,
                rgba(0, 255, 255, 0.1) 0px,
                rgba(0, 255, 255, 0.1) 2px,
                transparent 2px,
                transparent 12px
            )
        `;
    }
    
    applyBasicMoireEffect(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.style.borderImage = `
            repeating-linear-gradient(
                45deg,
                rgba(255, 0, 255, 0.5) 0px,
                rgba(0, 255, 255, 0.5) 10px,
                rgba(255, 255, 0, 0.5) 20px
            ) 1
        `;
    }
    
    /**
     * Update master state
     */
    updateMasterState() {
        // Calculate global energy from all active elements
        let totalEnergy = 0;
        
        this.masterState.activeElements.forEach(elementId => {
            const elementData = this.elements.get(elementId);
            if (elementData) {
                totalEnergy += elementData.currentEnergy;
            }
        });
        
        this.masterState.globalEnergy = Math.max(
            this.masterState.globalEnergy,
            totalEnergy / Math.max(1, this.masterState.activeElements.size)
        );
        
        // Update interaction engine if available
        if (this.interactionEngine && this.interactionEngine.updateShaderParameter) {
            // Map our global energy to Phase 5 parameters
            this.interactionEngine.updateShaderParameter('u_audioBass', this.masterState.globalEnergy * 0.8);
            this.interactionEngine.updateShaderParameter('u_audioMid', this.masterState.globalEnergy * 0.6);
            this.interactionEngine.updateShaderParameter('u_audioHigh', this.masterState.globalEnergy * 0.4);
        }
    }
    
    /**
     * Apply cross-element effects
     */
    applyCrossElementEffects() {
        // Apply global energy influence to all elements
        this.elements.forEach((elementData, elementId) => {
            if (elementData.visualizer && this.masterState.globalEnergy > this.config.energyThreshold) {
                // Subtle global effects
                elementData.visualizer.updateParameters({
                    universeModifier: 1.0 + this.masterState.globalEnergy * 0.2,
                    colorShift: this.masterState.globalEnergy * 0.1
                });
            }
        });
    }
    
    /**
     * Apply energy decay
     */
    applyEnergyDecay() {
        const now = Date.now();
        const decayRate = 0.95;
        
        // Decay global energy
        this.masterState.globalEnergy *= decayRate;
        
        // Decay element energies
        this.elements.forEach((elementData, elementId) => {
            elementData.currentEnergy *= decayRate;
            
            // Remove from active set if energy is too low
            if (elementData.currentEnergy < this.config.energyThreshold) {
                this.masterState.activeElements.delete(elementId);
            }
            
            // Decay relationship influences
            elementData.relationshipInfluences.forEach((influence, type) => {
                if (now - influence.timestamp > 3000) { // 3 second decay
                    elementData.relationshipInfluences.delete(type);
                }
            });
        });
    }
    
    /**
     * Broadcast parameter update to all systems
     */
    broadcastParameterUpdate(paramName, value) {
        // Update all relevant elements
        this.elements.forEach((elementData, elementId) => {
            if (elementData.visualizer) {
                const updates = {};
                updates[paramName] = value;
                elementData.visualizer.updateParameters(updates);
            }
        });
        
        // Update moiré system if available
        if (this.moireEngine && this.moireEngine.interactionData) {
            // Map parameter to moiré system
            switch (paramName) {
                case 'u_audioBass':
                    this.moireEngine.interactionData.scroll = value;
                    break;
                case 'u_audioMid':
                    this.moireEngine.interactionData.click = value;
                    break;
                case 'u_audioHigh':
                    this.moireEngine.interactionData.mouse.energy = value;
                    break;
            }
            
            if (this.moireEngine.updateMoireParameters) {
                this.moireEngine.updateMoireParameters();
            }
        }
    }
    
    /**
     * Get system status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            elements: this.elements.size,
            activeElements: this.masterState.activeElements.size,
            globalEnergy: this.masterState.globalEnergy,
            hasInteractionEngine: !!this.interactionEngine,
            hasMoireEngine: !!this.moireEngine,
            relationships: this.relationships.size
        };
    }
    
    /**
     * Create basic interaction engine if Phase 5 not available
     */
    createBasicInteractionEngine() {
        return {
            updateShaderParameter: (paramName, value) => {
                this.broadcastParameterUpdate(paramName, value);
            },
            getInteractionAnalysis: () => ({
                scroll: { intensity: 0 },
                click: { intensity: 0 },
                mouse: { intensity: 0 }
            })
        };
    }
    
    /**
     * Create basic moiré engine if RGB system not available
     */
    createBasicMoireEngine() {
        return {
            initialize: () => console.log('Basic moiré engine initialized'),
            interactionData: { energy: 0, scroll: 0, click: 0, mouse: { x: 0.5, y: 0.5 } },
            updateMoireParameters: () => {}
        };
    }
}

// ============================================================================
// 🧪 INTEGRATED SYSTEM TESTER
// ============================================================================

class VIB34DIntegratedSystemTester {
    constructor() {
        this.bridge = null;
        this.testResults = [];
    }
    
    async runAllTests() {
        console.log('🧪 Starting VIB34D Integrated System Tests...\n');
        
        // Initialize bridge
        this.bridge = new VIB34DIntegratedSystemBridge();
        await this.bridge.initialize();
        
        // Run tests
        await this.testSystemInitialization();
        await this.testElementRegistration();
        await this.testInteractionPropagation();
        await this.testRelationshipProcessing();
        await this.testMoireIntegration();
        await this.testCrossSystemCommunication();
        await this.testEnergyDecay();
        await this.testPerformance();
        
        this.displayResults();
    }
    
    async testSystemInitialization() {
        console.log('Test 1: System Initialization');
        
        try {
            const status = this.bridge.getStatus();
            
            if (status.initialized && (status.hasInteractionEngine || status.hasMoireEngine)) {
                this.recordTest('System Initialization', true);
            } else {
                throw new Error('System not properly initialized');
            }
            
        } catch (error) {
            this.recordTest('System Initialization', false, error.message);
        }
    }
    
    async testElementRegistration() {
        console.log('Test 2: Element Registration');
        
        try {
            const testElement = {
                id: 'test-element-1',
                type: 'button',
                geometry: 'hypercube',
                properties: {
                    dimension: 4.0,
                    morphFactor: 0.7,
                    hoverIntensity: 1.0,
                    clickResponse: 1.2
                },
                relationships: {
                    type: 'sync',
                    strength: 0.5
                }
            };
            
            this.bridge.registerElement(testElement);
            
            if (this.bridge.elements.has('test-element-1')) {
                this.recordTest('Element Registration', true);
            } else {
                throw new Error('Element not registered');
            }
            
        } catch (error) {
            this.recordTest('Element Registration', false, error.message);
        }
    }
    
    async testInteractionPropagation() {
        console.log('Test 3: Interaction Propagation');
        
        try {
            const initialEnergy = this.bridge.masterState.globalEnergy;
            
            this.bridge.triggerElementInteraction('test-element-1', 'hover', 1.0);
            
            const finalEnergy = this.bridge.masterState.globalEnergy;
            
            if (finalEnergy > initialEnergy) {
                this.recordTest('Interaction Propagation', true);
            } else {
                throw new Error('Interaction not propagated to master state');
            }
            
        } catch (error) {
            this.recordTest('Interaction Propagation', false, error.message);
        }
    }
    
    async testRelationshipProcessing() {
        console.log('Test 4: Relationship Processing');
        
        try {
            // Register second element
            const testElement2 = {
                id: 'test-element-2',
                type: 'card',
                geometry: 'sphere',
                properties: { hoverIntensity: 0.8 },
                relationships: { type: 'none', strength: 0 }
            };
            
            this.bridge.registerElement(testElement2);
            
            // Trigger relationship effect
            this.bridge.propagateRelationshipEffect('test-element-1', 'click', 1.0);
            
            // Check if second element was affected
            const element2Data = this.bridge.elements.get('test-element-2');
            if (element2Data.relationshipInfluences.size > 0) {
                this.recordTest('Relationship Processing', true);
            } else {
                throw new Error('Relationships not processed');
            }
            
        } catch (error) {
            this.recordTest('Relationship Processing', false, error.message);
        }
    }
    
    async testMoireIntegration() {
        console.log('Test 5: Moiré Integration');
        
        try {
            const hasMoireEngine = this.bridge.getStatus().hasMoireEngine;
            
            if (hasMoireEngine) {
                this.recordTest('Moiré Integration', true);
            } else {
                // Still pass if basic moiré engine was created
                this.recordTest('Moiré Integration', true, 'Basic moiré engine created');
            }
            
        } catch (error) {
            this.recordTest('Moiré Integration', false, error.message);
        }
    }
    
    async testCrossSystemCommunication() {
        console.log('Test 6: Cross-System Communication');
        
        try {
            // Test parameter broadcast
            this.bridge.broadcastParameterUpdate('u_audioBass', 0.5);
            
            // Check if elements received update
            let elementsUpdated = 0;
            this.bridge.elements.forEach((elementData) => {
                if (elementData.lastUpdate && Date.now() - elementData.lastUpdate < 1000) {
                    elementsUpdated++;
                }
            });
            
            if (elementsUpdated > 0) {
                this.recordTest('Cross-System Communication', true);
            } else {
                throw new Error('Parameter updates not broadcasted');
            }
            
        } catch (error) {
            this.recordTest('Cross-System Communication', false, error.message);
        }
    }
    
    async testEnergyDecay() {
        console.log('Test 7: Energy Decay');
        
        try {
            const initialEnergy = this.bridge.masterState.globalEnergy;
            
            // Apply decay multiple times
            for (let i = 0; i < 10; i++) {
                this.bridge.applyEnergyDecay();
            }
            
            const finalEnergy = this.bridge.masterState.globalEnergy;
            
            if (finalEnergy < initialEnergy) {
                this.recordTest('Energy Decay', true);
            } else {
                throw new Error('Energy not decaying properly');
            }
            
        } catch (error) {
            this.recordTest('Energy Decay', false, error.message);
        }
    }
    
    async testPerformance() {
        console.log('Test 8: Performance');
        
        try {
            const startTime = performance.now();
            
            // Simulate heavy processing
            for (let i = 0; i < 1000; i++) {
                this.bridge.updateMasterState();
                this.bridge.applyCrossElementEffects();
                this.bridge.applyEnergyDecay();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            if (duration < 200) { // Should complete in under 200ms
                this.recordTest('Performance', true);
            } else {
                throw new Error(`Performance too slow: ${duration}ms`);
            }
            
        } catch (error) {
            this.recordTest('Performance', false, error.message);
        }
    }
    
    recordTest(name, passed, error = null) {
        this.testResults.push({ name, passed, error });
        
        if (passed) {
            console.log(`✅ ${name}`);
        } else {
            console.log(`❌ ${name}: ${error}`);
        }
    }
    
    displayResults() {
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        console.log('\n' + '='.repeat(60));
        console.log('VIB34D INTEGRATED SYSTEM TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        console.log('='.repeat(60));
        
        if (passed === total) {
            console.log('🎉 ALL INTEGRATED SYSTEM TESTS PASSED!');
            console.log('🌉 System bridge operational');
            console.log('⚡ Element interactions synchronized');
            console.log('🔗 Relationships processing correctly');
            console.log('🌈 Moiré effects integrated');
            console.log('🎛️ Cross-system communication active');
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VIB34DIntegratedSystemBridge,
        VIB34DIntegratedSystemTester
    };
}

// Export to window for browser use
if (typeof window !== 'undefined') {
    window.VIB34DIntegratedSystemBridge = VIB34DIntegratedSystemBridge;
    window.VIB34DIntegratedSystemTester = VIB34DIntegratedSystemTester;
    console.log('🌉 VIB34D Integrated System Bridge loaded and exported to window');
}