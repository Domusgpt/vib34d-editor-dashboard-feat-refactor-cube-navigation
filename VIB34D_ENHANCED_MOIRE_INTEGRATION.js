/**
 * VIB34D ENHANCED MOIRÉ INTEGRATION
 * 
 * Integrates Moiré RGB effects with existing VIB34D system
 * Adds reactive borders, offset lattice grids, and RGB channel interference
 */

// ============================================================================
// 🌈 ENHANCED VIB34D MOIRÉ INTEGRATION
// ============================================================================

class VIB34DEnhancedMoireIntegration {
    constructor() {
        this.moireEngine = null;
        this.existingSystem = null;
        this.isIntegrated = false;
        
        // Enhanced shader fragments for existing geometries
        this.moireShaderEnhancements = {
            hypercube: this.getHypercubeMoireShader(),
            hypersphere: this.getHypersphereMoireShader(),
            hypertetrahedron: this.getHypertetrahedronMoireShader(),
            torus: this.getTorusMoireShader(),
            kleinbottle: this.getKleinBottleMoireShader(),
            fractal: this.getFractalMoireShader(),
            wave: this.getWaveMoireShader(),
            crystal: this.getCrystalMoireShader()
        };
        
        console.log('🌈 VIB34D Enhanced Moiré Integration initialized');
    }
    
    /**
     * Integrate with existing VIB34D system
     */
    async integrate(existingVIB34DSystem) {
        try {
            this.existingSystem = existingVIB34DSystem;
            
            // Initialize Moiré RGB engine
            this.moireEngine = new VIB34DMoireRGBEngine();
            await this.moireEngine.initialize();
            
            // Enhance existing shaders
            this.enhanceExistingShaders();
            
            // Setup reactive card borders
            this.setupReactiveCardBorders();
            
            // Add offset lattice grids to visualizers
            this.addOffsetLatticeGrids();
            
            // Integrate with interaction system
            this.integrateWithInteractionSystem();
            
            this.isIntegrated = true;
            console.log('🌈 Enhanced Moiré integration complete');
            
        } catch (error) {
            console.error('❌ Moiré integration failed:', error);
        }
    }
    
    /**
     * Enhance existing shader system with Moiré effects
     */
    enhanceExistingShaders() {
        if (!this.existingSystem || !this.existingSystem.shaderManager) return;
        
        // Add Moiré uniforms to shader manager
        const moireUniforms = this.moireEngine.getMoireUniforms();
        Object.entries(moireUniforms).forEach(([name, value]) => {
            this.existingSystem.shaderManager.setUniform(name, value);
        });
        
        // Enhance geometry shader code
        Object.entries(this.moireShaderEnhancements).forEach(([geometryType, enhancement]) => {
            if (this.existingSystem.geometryManager.hasGeometry(geometryType)) {
                const geometry = this.existingSystem.geometryManager.getGeometry(geometryType);
                if (geometry.enhanceWithMoire) {
                    geometry.enhanceWithMoire(enhancement);
                }
            }
        });
    }
    
    /**
     * Setup reactive card borders with Moiré RGB effects
     */
    setupReactiveCardBorders() {
        const cards = document.querySelectorAll('.blog-card, .content-card, .hypercube-face');
        
        cards.forEach((card, index) => {
            const existingBorder = card.querySelector('.moire-border');
            if (existingBorder) return; // Already has border
            
            const moireBorder = document.createElement('div');
            moireBorder.className = 'moire-rgb-border';
            moireBorder.innerHTML = `
                <div class="moire-layer moire-red"></div>
                <div class="moire-layer moire-green"></div>
                <div class="moire-layer moire-blue"></div>
                <div class="moire-interference"></div>
            `;
            
            moireBorder.style.cssText = `
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                pointer-events: none;
                z-index: 1;
                opacity: 0;
                transition: opacity 0.3s ease;
                border-radius: inherit;
                overflow: hidden;
            `;
            
            // Ensure card positioning
            if (getComputedStyle(card).position === 'static') {
                card.style.position = 'relative';
            }
            
            card.appendChild(moireBorder);
            
            // Setup enhanced interactions
            this.setupEnhancedCardInteractions(card, moireBorder, index);
        });
        
        this.addEnhancedMoireCSS();
    }
    
    /**
     * Add enhanced Moiré CSS with RGB channel separation
     */
    addEnhancedMoireCSS() {
        if (document.getElementById('enhanced-moire-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'enhanced-moire-styles';
        style.textContent = `
            .moire-rgb-border {
                background: transparent;
            }
            
            .moire-layer {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    45deg,
                    transparent 0px,
                    currentColor 1px,
                    transparent 2px,
                    transparent 12px
                );
                animation: moireOffset 3s linear infinite;
            }
            
            .moire-red {
                color: rgba(255, 0, 255, 0.4);
                transform: rotate(0deg) translate(0px, 0px);
            }
            
            .moire-green {
                color: rgba(0, 255, 255, 0.4);
                transform: rotate(0.5deg) translate(1px, -0.5px);
                animation-delay: -1s;
            }
            
            .moire-blue {
                color: rgba(255, 255, 0, 0.4);
                transform: rotate(-0.3deg) translate(-0.5px, 1px);
                animation-delay: -2s;
            }
            
            .moire-interference {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    repeating-linear-gradient(
                        0deg,
                        transparent 0px,
                        rgba(255, 255, 255, 0.1) 0.5px,
                        transparent 1px,
                        transparent 8px
                    ),
                    repeating-linear-gradient(
                        90deg,
                        transparent 0px,
                        rgba(255, 255, 255, 0.1) 0.5px,
                        transparent 1px,
                        transparent 9px
                    );
                animation: moireInterference 4s ease-in-out infinite;
                mix-blend-mode: overlay;
            }
            
            @keyframes moireOffset {
                0% {
                    transform: translateX(0px) translateY(0px) rotate(var(--rotation, 0deg));
                }
                33% {
                    transform: translateX(2px) translateY(-1px) rotate(calc(var(--rotation, 0deg) + 0.2deg));
                }
                66% {
                    transform: translateX(-1px) translateY(2px) rotate(calc(var(--rotation, 0deg) - 0.1deg));
                }
                100% {
                    transform: translateX(0px) translateY(0px) rotate(var(--rotation, 0deg));
                }
            }
            
            @keyframes moireInterference {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(1) rotate(0deg);
                }
                25% {
                    opacity: 0.7;
                    transform: scale(1.01) rotate(0.1deg);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(0.99) rotate(-0.1deg);
                }
                75% {
                    opacity: 0.8;
                    transform: scale(1.005) rotate(0.05deg);
                }
            }
            
            /* Interaction states */
            .moire-rgb-border.hover {
                opacity: 1 !important;
            }
            
            .moire-rgb-border.hover .moire-layer {
                animation-duration: 1s;
            }
            
            .moire-rgb-border.hover .moire-interference {
                animation-duration: 2s;
                opacity: 0.8;
            }
            
            .moire-rgb-border.click .moire-layer {
                animation-duration: 0.3s;
                filter: brightness(1.5) contrast(1.3);
            }
            
            .moire-rgb-border.focus {
                opacity: 0.9 !important;
            }
            
            .moire-rgb-border.focus .moire-interference {
                opacity: 1;
                filter: brightness(1.2);
            }
            
            /* Offset lattice grids for visualizers */
            .offset-lattice-grid {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2;
                opacity: 0.4;
                background-image: 
                    /* Primary grid - Red channel */
                    repeating-linear-gradient(
                        0deg,
                        transparent 0px,
                        rgba(255, 0, 255, 0.15) 0.5px,
                        transparent 1px,
                        transparent var(--primary-grid-size, 12px)
                    ),
                    repeating-linear-gradient(
                        90deg,
                        transparent 0px,
                        rgba(255, 0, 255, 0.15) 0.5px,
                        transparent 1px,
                        transparent var(--primary-grid-size, 12px)
                    ),
                    /* Offset grid - Green channel */
                    repeating-linear-gradient(
                        0deg,
                        transparent 0px,
                        rgba(0, 255, 255, 0.12) 0.5px,
                        transparent 1px,
                        transparent var(--offset-grid-size, 11px)
                    ),
                    repeating-linear-gradient(
                        90deg,
                        transparent 0px,
                        rgba(0, 255, 255, 0.12) 0.5px,
                        transparent 1px,
                        transparent var(--offset-grid-size, 11px)
                    ),
                    /* Tertiary grid - Blue channel */
                    repeating-linear-gradient(
                        45deg,
                        transparent 0px,
                        rgba(255, 255, 0, 0.08) 0.5px,
                        transparent 1px,
                        transparent var(--tertiary-grid-size, 13px)
                    );
                animation: latticeShift 6s ease-in-out infinite;
            }
            
            @keyframes latticeShift {
                0%, 100% {
                    transform: translate(0px, 0px) scale(1);
                    filter: hue-rotate(0deg) contrast(1);
                }
                16% {
                    transform: translate(0.5px, -0.2px) scale(1.001);
                    filter: hue-rotate(15deg) contrast(1.1);
                }
                33% {
                    transform: translate(0.2px, 0.5px) scale(0.999);
                    filter: hue-rotate(30deg) contrast(1.2);
                }
                50% {
                    transform: translate(-0.3px, 0.1px) scale(1.002);
                    filter: hue-rotate(45deg) contrast(1.15);
                }
                66% {
                    transform: translate(0.1px, -0.4px) scale(0.998);
                    filter: hue-rotate(30deg) contrast(1.25);
                }
                83% {
                    transform: translate(-0.2px, 0.3px) scale(1.001);
                    filter: hue-rotate(15deg) contrast(1.05);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Setup enhanced card interactions with RGB effects
     */
    setupEnhancedCardInteractions(card, moireBorder, index) {
        // Hover effects
        card.addEventListener('mouseenter', () => {
            moireBorder.classList.add('hover');
            moireBorder.style.opacity = '1';
            
            // Update CSS custom properties for dynamic effects
            moireBorder.style.setProperty('--rotation', '0deg');
            moireBorder.style.setProperty('--primary-grid-size', '10px');
            moireBorder.style.setProperty('--offset-grid-size', '9px');
        });
        
        card.addEventListener('mouseleave', () => {
            moireBorder.classList.remove('hover');
            moireBorder.style.opacity = '0';
        });
        
        // Click effects
        card.addEventListener('mousedown', () => {
            moireBorder.classList.add('click');
        });
        
        card.addEventListener('mouseup', () => {
            moireBorder.classList.remove('click');
        });
        
        // Focus effects
        card.addEventListener('focus', () => {
            moireBorder.classList.add('focus');
            moireBorder.style.opacity = '0.8';
        });
        
        card.addEventListener('blur', () => {
            moireBorder.classList.remove('focus');
            if (!moireBorder.classList.contains('hover')) {
                moireBorder.style.opacity = '0';
            }
        });
    }
    
    /**
     * Add offset lattice grids to visualizers
     */
    addOffsetLatticeGrids() {
        const visualizers = document.querySelectorAll('canvas[id*="visualizer"], .bezel-visualizer');
        
        visualizers.forEach((visualizer, index) => {
            const existingGrid = visualizer.parentElement?.querySelector('.offset-lattice-grid');
            if (existingGrid) return; // Already has grid
            
            const latticeGrid = document.createElement('div');
            latticeGrid.className = 'offset-lattice-grid';
            latticeGrid.id = `lattice-grid-${index}`;
            
            // Set custom properties based on visualizer position
            const gridVariations = [
                { primary: '12px', offset: '11px', tertiary: '13px' },
                { primary: '10px', offset: '9px', tertiary: '11px' },
                { primary: '14px', offset: '13px', tertiary: '15px' },
                { primary: '8px', offset: '7px', tertiary: '9px' }
            ];
            
            const variation = gridVariations[index % gridVariations.length];
            latticeGrid.style.setProperty('--primary-grid-size', variation.primary);
            latticeGrid.style.setProperty('--offset-grid-size', variation.offset);
            latticeGrid.style.setProperty('--tertiary-grid-size', variation.tertiary);
            
            const container = visualizer.parentElement;
            if (container) {
                if (getComputedStyle(container).position === 'static') {
                    container.style.position = 'relative';
                }
                container.appendChild(latticeGrid);
            }
        });
    }
    
    /**
     * Integrate with existing interaction system
     */
    integrateWithInteractionSystem() {
        if (!this.existingSystem || !this.existingSystem.interactionEngine) return;
        
        // Hook into existing interaction updates
        const originalUpdate = this.existingSystem.interactionEngine.updateInteraction;
        if (originalUpdate) {
            this.existingSystem.interactionEngine.updateInteraction = (scroll, click, mouse) => {
                // Call original update
                originalUpdate.call(this.existingSystem.interactionEngine, scroll, click, mouse);
                
                // Update Moiré system
                if (this.moireEngine) {
                    this.moireEngine.interactionData.scroll = scroll;
                    this.moireEngine.interactionData.click = click;
                    this.moireEngine.interactionData.mouse = mouse;
                    this.moireEngine.updateMoireParameters();
                }
                
                // Update grid parameters based on interaction
                this.updateGridParameters(scroll, click, mouse);
            };
        }
    }
    
    /**
     * Update grid parameters based on interaction
     */
    updateGridParameters(scroll, click, mouse) {
        const grids = document.querySelectorAll('.offset-lattice-grid');
        
        grids.forEach(grid => {
            // Adjust opacity based on interaction energy
            const energy = (scroll + click + (mouse.x + mouse.y) * 0.5) / 3.0;
            grid.style.opacity = Math.max(0.2, 0.4 + energy * 0.4);
            
            // Adjust animation speed
            const animationSpeed = Math.max(2.0, 6.0 - energy * 4.0);
            grid.style.animationDuration = `${animationSpeed}s`;
            
            // Dynamic grid size adjustments
            const basePrimary = 12;
            const baseOffset = 11;
            const baseTertiary = 13;
            
            const primarySize = basePrimary + (scroll * 3);
            const offsetSize = baseOffset + (click * 2);
            const tertiarySize = baseTertiary + (energy * 4);
            
            grid.style.setProperty('--primary-grid-size', `${primarySize}px`);
            grid.style.setProperty('--offset-grid-size', `${offsetSize}px`);
            grid.style.setProperty('--tertiary-grid-size', `${tertiarySize}px`);
        });
    }
    
    /**
     * Get enhanced shader fragments for each geometry
     */
    getHypercubeMoireShader() {
        return `
            // Enhanced hypercube with RGB moiré interference
            float hypercubeMoire = hypercubeLattice(p, gridSize);
            
            // RGB channel separation
            float redGrid = hypercubeLattice(p + vec3(u_redOffset, 0.0), gridSize * 1.1);
            float greenGrid = hypercubeLattice(p + vec3(u_greenOffset, 0.0), gridSize * 0.9);
            float blueGrid = hypercubeLattice(p + vec3(u_blueOffset, 0.0), gridSize * 1.05);
            
            // Interference calculation
            float interference = sin(redGrid * 6.28) * cos(greenGrid * 6.28) * sin(blueGrid * 6.28);
            hypercubeMoire += interference * u_interferenceIntensity;
        `;
    }
    
    getHypersphereMoireShader() {
        return `
            // Enhanced hypersphere with shell interference
            float sphereMoire = sphereLattice(p, gridSize);
            
            // Multi-shell RGB separation
            float redShell = sphereLattice(p + vec3(u_redOffset, 0.0), gridSize * 1.2);
            float greenShell = sphereLattice(p + vec3(u_greenOffset, 0.0), gridSize * 0.8);
            float blueShell = sphereLattice(p + vec3(u_blueOffset, 0.0), gridSize);
            
            // Shell interference patterns
            float shellInterference = cos(redShell * 4.0) * sin(greenShell * 5.0) * cos(blueShell * 3.0);
            sphereMoire += shellInterference * u_interferenceIntensity * 0.7;
        `;
    }
    
    getHypertetrahedronMoireShader() {
        return `
            // Enhanced tetrahedron with plane interference
            float tetraMoire = tetrahedronLattice(p, gridSize);
            
            // RGB plane offsets
            float redPlane = tetrahedronLattice(p + vec3(u_redOffset, 0.0), gridSize * 1.15);
            float greenPlane = tetrahedronLattice(p + vec3(u_greenOffset, 0.0), gridSize * 0.85);
            float bluePlane = tetrahedronLattice(p + vec3(u_blueOffset, 0.0), gridSize * 1.05);
            
            // Plane interference
            float planeInterference = (redPlane + greenPlane + bluePlane) / 3.0;
            tetraMoire = mix(tetraMoire, planeInterference, u_interferenceIntensity);
        `;
    }
    
    // Additional geometry shaders...
    getTorusMoireShader() {
        return `// Torus with flow interference`;
    }
    
    getKleinBottleMoireShader() {
        return `// Klein bottle with topological interference`;
    }
    
    getFractalMoireShader() {
        return `// Fractal with recursive interference`;
    }
    
    getWaveMoireShader() {
        return `// Wave function with probability interference`;
    }
    
    getCrystalMoireShader() {
        return `// Crystal lattice with ordered interference`;
    }
    
    /**
     * Enable/disable Moiré enhancements
     */
    setEnabled(enabled) {
        if (this.moireEngine) {
            this.moireEngine.setEnabled(enabled);
        }
        
        const borders = document.querySelectorAll('.moire-rgb-border');
        const grids = document.querySelectorAll('.offset-lattice-grid');
        
        borders.forEach(border => {
            border.style.display = enabled ? 'block' : 'none';
        });
        
        grids.forEach(grid => {
            grid.style.display = enabled ? 'block' : 'none';
        });
    }
    
    /**
     * Get integration status
     */
    getStatus() {
        return {
            integrated: this.isIntegrated,
            moireEngine: this.moireEngine?.getStatus(),
            enhancedShaders: Object.keys(this.moireShaderEnhancements).length,
            cardBorders: document.querySelectorAll('.moire-rgb-border').length,
            latticeGrids: document.querySelectorAll('.offset-lattice-grid').length
        };
    }
}

// ============================================================================
// 🚀 AUTO-INTEGRATION WITH EXISTING SYSTEM
// ============================================================================

console.log('🌈 VIB34D Enhanced Moiré Integration script loaded');

// Auto-integrate when existing system is available
const waitForVIB34DSystem = () => {
    if (window.vib34dRealIntegration || window.hypercubeCore) {
        console.log('🌈 Existing VIB34D system detected - integrating Moiré RGB effects...');
        
        const moireIntegration = new VIB34DEnhancedMoireIntegration();
        const existingSystem = window.vib34dRealIntegration || window.hypercubeCore;
        
        moireIntegration.integrate(existingSystem).then(() => {
            window.vib34dMoireIntegration = moireIntegration;
            console.log('🌈 Moiré RGB integration complete! Status:', moireIntegration.getStatus());
        });
        
    } else {
        setTimeout(waitForVIB34DSystem, 500);
    }
};

// Start integration check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForVIB34DSystem);
} else {
    waitForVIB34DSystem();
}

// Console helpers
window.vib34dMoire = {
    status: () => window.vib34dMoireIntegration?.getStatus(),
    enable: () => window.vib34dMoireIntegration?.setEnabled(true),
    disable: () => window.vib34dMoireIntegration?.setEnabled(false),
    test: () => {
        const tester = new VIB34DMoireRGBTester();
        return tester.runAllTests();
    }
};

console.log('🌈 Moiré RGB console helpers: vib34dMoire.status(), .enable(), .disable(), .test()');