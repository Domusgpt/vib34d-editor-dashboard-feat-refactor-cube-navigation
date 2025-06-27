/**
 * VIB34D EMERGING BUTTON CRYSTALLIZATION SYSTEM
 * 
 * Proximity-based UI materialization with crystal growth patterns
 * that respond to user presence and interaction patterns.
 */

// ============================================================================
// 💎 VIB34D EMERGING BUTTON CRYSTALLIZATION ENGINE
// ============================================================================

class VIB34DEmergingButtonEngine {
    constructor() {
        this.isInitialized = false;
        this.emergingButtons = new Map();
        this.crystalNodes = new Map();
        
        // Crystallization configuration
        this.config = {
            // Detection parameters
            proximityThreshold: 150, // pixels
            activationThreshold: 50,  // pixels
            fullFormationDistance: 25, // pixels
            
            // Growth animation
            formationSpeed: 0.8,      // seconds
            dissolutionSpeed: 1.2,    // seconds
            crystallineGrowth: true,  // use crystal growth pattern
            
            // Visual parameters
            baseOpacity: 0.0,
            maxOpacity: 0.95,
            glowIntensity: 0.7,
            facetCount: 6,           // hexagonal crystals
            
            // Interaction responsiveness
            hoverMultiplier: 1.5,
            clickRippleSize: 200,
            feedbackDuration: 400,
            
            // Crystal lattice parameters
            latticeSpacing: 8,       // pixels between crystal nodes
            nodeSize: 3,             // base crystal node size
            connectionThickness: 1,   // crystal connection lines
            
            // Color scheme
            primaryColor: [0, 255, 255],    // cyan
            secondaryColor: [255, 0, 255],  // magenta
            accentColor: [255, 255, 0],     // yellow
            growthColor: [255, 255, 255]    // white crystalline
        };
        
        // Mouse tracking
        this.mousePosition = { x: 0, y: 0 };
        this.interactionIntensity = 0.0;
        
        console.log('💎 VIB34D Emerging Button Engine initialized');
    }
    
    /**
     * Initialize the Emerging Button system
     */
    initialize() {
        this.setupMouseTracking();
        this.setupCrystalCSS();
        this.scanForEmergingElements();
        this.startCrystallizationLoop();
        
        this.isInitialized = true;
        console.log('💎 Emerging Button Crystallization System activated');
    }
    
    /**
     * Setup mouse tracking for proximity detection
     */
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.updateProximityEffects();
        });
        
        // Track interaction intensity
        document.addEventListener('click', () => {
            this.interactionIntensity = 1.0;
            this.triggerClickRipple();
        });
        
        document.addEventListener('scroll', () => {
            this.interactionIntensity = Math.min(1.0, this.interactionIntensity + 0.3);
        });
        
        // Decay interaction intensity
        setInterval(() => {
            this.interactionIntensity *= 0.95;
        }, 50);
    }
    
    /**
     * Setup CSS for crystal animations
     */
    setupCrystalCSS() {
        if (document.getElementById('emerging-button-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'emerging-button-styles';
        style.textContent = `
            .emerging-button {
                position: relative;
                opacity: 0;
                transform: scale(0.8);
                transition: all ${this.config.formationSpeed}s cubic-bezier(0.34, 1.56, 0.64, 1);
                pointer-events: none;
                overflow: visible;
            }
            
            .emerging-button.forming {
                opacity: var(--emergence-opacity, 0);
                transform: scale(var(--emergence-scale, 0.8));
                pointer-events: auto;
            }
            
            .emerging-button.crystallized {
                opacity: ${this.config.maxOpacity};
                transform: scale(1);
                pointer-events: auto;
            }
            
            .crystal-lattice {
                position: absolute;
                top: -20px;
                left: -20px;
                right: -20px;
                bottom: -20px;
                pointer-events: none;
                z-index: -1;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .crystal-node {
                position: absolute;
                width: ${this.config.nodeSize}px;
                height: ${this.config.nodeSize}px;
                border-radius: 50%;
                background: radial-gradient(circle, 
                    rgba(${this.config.growthColor.join(',')}, 1) 0%,
                    rgba(${this.config.primaryColor.join(',')}, 0.8) 50%,
                    transparent 100%);
                transform: scale(0);
                transition: transform 0.2s ease;
                box-shadow: 0 0 4px rgba(${this.config.primaryColor.join(',')}, 0.5);
            }
            
            .crystal-node.active {
                transform: scale(1);
                animation: crystalPulse 2s ease-in-out infinite;
            }
            
            .crystal-connection {
                position: absolute;
                height: ${this.config.connectionThickness}px;
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(${this.config.primaryColor.join(',')}, 0.3) 20%,
                    rgba(${this.config.secondaryColor.join(',')}, 0.5) 50%,
                    rgba(${this.config.primaryColor.join(',')}, 0.3) 80%,
                    transparent 100%);
                transform-origin: left center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .crystal-connection.active {
                opacity: 1;
                animation: energyFlow 1.5s linear infinite;
            }
            
            @keyframes crystalPulse {
                0%, 100% { 
                    box-shadow: 0 0 4px rgba(${this.config.primaryColor.join(',')}, 0.5);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 12px rgba(${this.config.secondaryColor.join(',')}, 0.8),
                                0 0 20px rgba(${this.config.accentColor.join(',')}, 0.4);
                    transform: scale(1.2);
                }
            }
            
            @keyframes energyFlow {
                0% {
                    background-position: -100% 0;
                }
                100% {
                    background-position: 100% 0;
                }
            }
            
            .click-ripple {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(${this.config.accentColor.join(',')}, 0.3) 0%,
                    rgba(${this.config.primaryColor.join(',')}, 0.2) 30%,
                    transparent 70%);
                pointer-events: none;
                animation: rippleExpand 0.4s ease-out;
                z-index: 1000;
            }
            
            @keyframes rippleExpand {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Faceted crystal effect */
            .emerging-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: conic-gradient(
                    from 0deg,
                    rgba(${this.config.primaryColor.join(',')}, 0.1) 0deg,
                    rgba(${this.config.secondaryColor.join(',')}, 0.15) 60deg,
                    rgba(${this.config.accentColor.join(',')}, 0.1) 120deg,
                    rgba(${this.config.primaryColor.join(',')}, 0.15) 180deg,
                    rgba(${this.config.secondaryColor.join(',')}, 0.1) 240deg,
                    rgba(${this.config.accentColor.join(',')}, 0.15) 300deg,
                    rgba(${this.config.primaryColor.join(',')}, 0.1) 360deg
                );
                border-radius: inherit;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: -1;
            }
            
            .emerging-button.crystallized::before {
                opacity: var(--crystal-facet-opacity, 0.6);
                animation: facetShimmer 3s ease-in-out infinite;
            }
            
            @keyframes facetShimmer {
                0%, 100% { 
                    filter: brightness(1) contrast(1);
                    transform: rotate(0deg);
                }
                50% { 
                    filter: brightness(1.3) contrast(1.2);
                    transform: rotate(1deg);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Scan for elements that should have emerging button behavior
     */
    scanForEmergingElements() {
        // Look for elements with data-emerging attribute
        const emergingElements = document.querySelectorAll('[data-emerging]');
        
        emergingElements.forEach((element, index) => {
            this.setupEmergingButton(element, index);
        });
        
        // Also scan for common interactive elements
        const commonSelectors = [
            'button:not([data-no-emergence])',
            '.link-button:not([data-no-emergence])',
            '.nav-button:not([data-no-emergence])',
            '.action-button:not([data-no-emergence])',
            'a[href]:not([data-no-emergence])'
        ];
        
        commonSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (!element.hasAttribute('data-emerging')) {
                    this.setupEmergingButton(element, `auto-${selector}-${index}`);
                }
            });
        });
    }
    
    /**
     * Setup individual emerging button
     */
    setupEmergingButton(element, id) {
        // Add emerging button class
        element.classList.add('emerging-button');
        
        // Create crystal lattice structure
        const lattice = this.createCrystalLattice(element);
        element.appendChild(lattice);
        
        // Store button data
        this.emergingButtons.set(id, {
            element: element,
            lattice: lattice,
            proximity: 0.0,
            formation: 0.0,
            isActive: false,
            lastUpdate: performance.now()
        });
        
        // Setup event handlers
        this.setupButtonInteractions(element, id);
    }
    
    /**
     * Create crystal lattice around button
     */
    createCrystalLattice(button) {
        const lattice = document.createElement('div');
        lattice.className = 'crystal-lattice';
        
        const rect = button.getBoundingClientRect();
        const nodeCount = Math.ceil(Math.max(rect.width, rect.height) / this.config.latticeSpacing);
        
        // Create crystal nodes in hexagonal pattern
        for (let i = 0; i < nodeCount; i++) {
            for (let j = 0; j < nodeCount; j++) {
                const node = document.createElement('div');
                node.className = 'crystal-node';
                
                // Hexagonal positioning
                const angle = (i * 60) * Math.PI / 180;
                const radius = j * this.config.latticeSpacing;
                const x = Math.cos(angle) * radius + rect.width / 2;
                const y = Math.sin(angle) * radius + rect.height / 2;
                
                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
                node.setAttribute('data-node-id', `${i}-${j}`);
                
                lattice.appendChild(node);
                
                // Create connections between adjacent nodes
                if (j > 0) {
                    const connection = this.createCrystalConnection(
                        { x: x, y: y },
                        { 
                            x: Math.cos(angle) * (radius - this.config.latticeSpacing) + rect.width / 2,
                            y: Math.sin(angle) * (radius - this.config.latticeSpacing) + rect.height / 2
                        }
                    );
                    lattice.appendChild(connection);
                }
            }
        }
        
        return lattice;
    }
    
    /**
     * Create connection line between crystal nodes
     */
    createCrystalConnection(start, end) {
        const connection = document.createElement('div');
        connection.className = 'crystal-connection';
        
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        connection.style.left = `${start.x}px`;
        connection.style.top = `${start.y}px`;
        connection.style.width = `${length}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        return connection;
    }
    
    /**
     * Setup button interaction handlers
     */
    setupButtonInteractions(button, id) {
        // Click handler with crystalline feedback
        button.addEventListener('click', (e) => {
            this.triggerCrystallineClick(button, e);
        });
        
        // Hover enhancement
        button.addEventListener('mouseenter', () => {
            const buttonData = this.emergingButtons.get(id);
            if (buttonData) {
                buttonData.isHovered = true;
                this.enhanceCrystallization(button);
            }
        });
        
        button.addEventListener('mouseleave', () => {
            const buttonData = this.emergingButtons.get(id);
            if (buttonData) {
                buttonData.isHovered = false;
            }
        });
    }
    
    /**
     * Update proximity effects for all buttons
     */
    updateProximityEffects() {
        this.emergingButtons.forEach((buttonData, id) => {
            const rect = buttonData.element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mousePosition.x - centerX, 2) + 
                Math.pow(this.mousePosition.y - centerY, 2)
            );
            
            // Calculate proximity (0 = far, 1 = very close)
            let proximity = 0;
            if (distance < this.config.proximityThreshold) {
                proximity = 1 - (distance / this.config.proximityThreshold);
            }
            
            buttonData.proximity = proximity;
            this.updateButtonCrystallization(buttonData, id);
        });
    }
    
    /**
     * Update button crystallization based on proximity
     */
    updateButtonCrystallization(buttonData, id) {
        const targetFormation = buttonData.proximity;
        const currentFormation = buttonData.formation;
        
        // Smooth interpolation
        const lerpSpeed = targetFormation > currentFormation ? 0.1 : 0.05;
        buttonData.formation += (targetFormation - currentFormation) * lerpSpeed;
        
        // Update visual state
        const element = buttonData.element;
        const lattice = buttonData.lattice;
        
        if (buttonData.formation > 0.01) {
            element.classList.add('forming');
            
            // Update CSS custom properties
            element.style.setProperty('--emergence-opacity', buttonData.formation * this.config.maxOpacity);
            element.style.setProperty('--emergence-scale', 0.8 + buttonData.formation * 0.2);
            element.style.setProperty('--crystal-facet-opacity', buttonData.formation * 0.6);
            
            // Activate crystal lattice
            lattice.style.opacity = buttonData.formation * 0.7;
            
            // Activate crystal nodes progressively
            const nodes = lattice.querySelectorAll('.crystal-node');
            const activeNodeCount = Math.floor(nodes.length * buttonData.formation);
            
            nodes.forEach((node, index) => {
                if (index < activeNodeCount) {
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            });
            
            // Activate connections
            const connections = lattice.querySelectorAll('.crystal-connection');
            const activeConnectionCount = Math.floor(connections.length * buttonData.formation);
            
            connections.forEach((connection, index) => {
                if (index < activeConnectionCount) {
                    connection.classList.add('active');
                } else {
                    connection.classList.remove('active');
                }
            });
            
            // Full crystallization
            if (buttonData.formation > 0.8) {
                element.classList.add('crystallized');
                buttonData.isActive = true;
            } else {
                element.classList.remove('crystallized');
                buttonData.isActive = false;
            }
            
        } else {
            element.classList.remove('forming', 'crystallized');
            lattice.style.opacity = 0;
            buttonData.isActive = false;
        }
    }
    
    /**
     * Trigger crystalline click effect
     */
    triggerCrystallineClick(button, event) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = this.config.clickRippleSize;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, this.config.feedbackDuration);
        
        // Flash crystallization
        button.style.filter = 'brightness(1.5) contrast(1.3)';
        setTimeout(() => {
            button.style.filter = '';
        }, 150);
    }
    
    /**
     * Enhance crystallization on hover
     */
    enhanceCrystallization(button) {
        const lattice = button.querySelector('.crystal-lattice');
        if (lattice) {
            lattice.style.transform = 'scale(1.1)';
            lattice.style.filter = 'brightness(1.2)';
        }
        
        setTimeout(() => {
            if (lattice) {
                lattice.style.transform = 'scale(1)';
                lattice.style.filter = 'brightness(1)';
            }
        }, 300);
    }
    
    /**
     * Start the crystallization update loop
     */
    startCrystallizationLoop() {
        const update = () => {
            this.updateProximityEffects();
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
    }
    
    /**
     * Trigger global click ripple
     */
    triggerClickRipple() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: ${this.mousePosition.y - 50}px;
            left: ${this.mousePosition.x - 50}px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle,
                rgba(${this.config.accentColor.join(',')}, 0.2) 0%,
                transparent 70%);
            pointer-events: none;
            z-index: 10000;
            animation: rippleExpand 0.6s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    /**
     * Get system status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            buttonsCount: this.emergingButtons.size,
            activeButtons: Array.from(this.emergingButtons.values()).filter(b => b.isActive).length,
            interactionIntensity: this.interactionIntensity,
            mousePosition: this.mousePosition,
            config: this.config
        };
    }
}

// ============================================================================
// 🧪 EMERGING BUTTON SYSTEM TESTER
// ============================================================================

class VIB34DEmergingButtonTester {
    constructor() {
        this.tests = [];
        this.results = { passed: 0, failed: 0, total: 0 };
    }
    
    async runAllTests() {
        console.log('🧪 Starting VIB34D Emerging Button System Tests...\n');
        
        await this.testSystemInitialization();
        await this.testButtonDetection();
        await this.testCrystalLatticeCreation();
        await this.testProximityDetection();
        await this.testCrystallizationAnimation();
        await this.testClickEffects();
        await this.testMouseTracking();
        await this.testPerformance();
        
        this.displayResults();
    }
    
    async testSystemInitialization() {
        console.log('Test 1: System Initialization');
        
        try {
            const engine = new VIB34DEmergingButtonEngine();
            engine.initialize();
            
            if (engine.isInitialized && engine.emergingButtons instanceof Map) {
                this.recordTest('System Initialization', true);
            } else {
                throw new Error('System not properly initialized');
            }
        } catch (error) {
            this.recordTest('System Initialization', false, error.message);
        }
    }
    
    async testButtonDetection() {
        console.log('Test 2: Button Detection');
        
        try {
            // Create test button
            const testButton = document.createElement('button');
            testButton.setAttribute('data-emerging', 'true');
            testButton.textContent = 'Test Button';
            document.body.appendChild(testButton);
            
            const engine = new VIB34DEmergingButtonEngine();
            engine.initialize();
            
            if (engine.emergingButtons.size > 0) {
                this.recordTest('Button Detection', true);
            } else {
                throw new Error('No buttons detected');
            }
            
            document.body.removeChild(testButton);
        } catch (error) {
            this.recordTest('Button Detection', false, error.message);
        }
    }
    
    recordTest(name, passed, error = null) {
        this.results.total++;
        if (passed) {
            this.results.passed++;
            console.log(`✅ ${name}`);
        } else {
            this.results.failed++;
            console.log(`❌ ${name}: ${error}`);
        }
    }
    
    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('VIB34D EMERGING BUTTON SYSTEM TEST RESULTS');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        if (this.results.failed === 0) {
            console.log('🎉 ALL EMERGING BUTTON TESTS PASSED!');
            console.log('💎 Crystal lattice formation active');
            console.log('🎯 Proximity detection operational');
            console.log('✨ Crystallization animations ready');
        }
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.VIB34DEmergingButtonEngine = VIB34DEmergingButtonEngine;
    window.VIB34DEmergingButtonTester = VIB34DEmergingButtonTester;
    console.log('💎 VIB34D Emerging Button System loaded and exported to window');
}