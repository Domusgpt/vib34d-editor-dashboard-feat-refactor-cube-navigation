/**
 * VIB34D STYLE PRESETS LIBRARY
 * 
 * Pre-configured style packages demonstrating the range of
 * configurable visual experiences for the VIB34D Styles Pack system.
 * 
 * Each preset defines:
 * - Visual geometry and projection settings
 * - 4D mathematical parameters 
 * - User interaction reactivity levels
 * - Theme-specific visual effects
 */

class VIB34DStylePresets {
    constructor() {
        this.presets = new Map();
        this.categories = new Map();
        this.loadAllPresets();
        
        console.log('🎨 VIB34D Style Presets Library loaded');
    }
    
    loadAllPresets() {
        // Core Brand Styles
        this.registerPreset('hypercube-sovereignty', this.createHypercubeSovereignty());
        this.registerPreset('technical-precision', this.createTechnicalPrecision());
        this.registerPreset('infinite-potential', this.createInfinitePotential());
        
        // Interactive Styles
        this.registerPreset('reactive-hypercube', this.createReactiveHypercube());
        this.registerPreset('gentle-sphere', this.createGentleSphere());
        this.registerPreset('dynamic-tetrahedron', this.createDynamicTetrahedron());
        
        // Artistic Styles
        this.registerPreset('quantum-wave', this.createQuantumWave());
        this.registerPreset('crystalline-order', this.createCrystallineOrder());
        this.registerPreset('topological-klein', this.createTopologicalKlein());
        
        // Performance Styles
        this.registerPreset('minimal-lattice', this.createMinimalLattice());
        this.registerPreset('maximum-detail', this.createMaximumDetail());
        this.registerPreset('smooth-flow', this.createSmoothFlow());
        
        // Experimental Styles
        this.registerPreset('fractal-emergence', this.createFractalEmergence());
        this.registerPreset('reality-glitch', this.createRealityGlitch());
        this.registerPreset('hyperdimensional-storm', this.createHyperdimensionalStorm());
        
        this.categorizePresets();
    }
    
    registerPreset(id, preset) {
        this.presets.set(id, preset);
    }
    
    getPreset(id) {
        return this.presets.get(id);
    }
    
    getAllPresets() {
        return Array.from(this.presets.entries()).map(([id, preset]) => ({
            id,
            ...preset
        }));
    }
    
    getPresetsByCategory(category) {
        return this.categories.get(category) || [];
    }
    
    categorizePresets() {
        this.categories.set('brand', [
            'hypercube-sovereignty',
            'technical-precision', 
            'infinite-potential'
        ]);
        
        this.categories.set('interactive', [
            'reactive-hypercube',
            'gentle-sphere',
            'dynamic-tetrahedron'
        ]);
        
        this.categories.set('artistic', [
            'quantum-wave',
            'crystalline-order',
            'topological-klein'
        ]);
        
        this.categories.set('performance', [
            'minimal-lattice',
            'maximum-detail',
            'smooth-flow'
        ]);
        
        this.categories.set('experimental', [
            'fractal-emergence',
            'reality-glitch',
            'hyperdimensional-storm'
        ]);
    }
    
    // ========================================================================
    // CORE BRAND STYLES
    // ========================================================================
    
    createHypercubeSovereignty() {
        return {
            name: "Hypercube Sovereignty",
            type: "4D Lattice",
            description: "Primary brand identity with magenta 4D hypercube lattice representing digital sovereignty",
            category: "brand",
            geometry: "hypercube",
            projection: "perspective",
            parameters: {
                u_dimension: 4.0,
                u_morphFactor: 0.7,
                u_gridDensity: 15.0,
                u_rotationSpeed: 0.8,
                u_patternIntensity: 1.5,
                u_universeModifier: 1.2,
                u_lineThickness: 0.03,
                u_glitchIntensity: 0.02,
                u_colorShift: 0.0,
                u_shellWidth: 0.025,
                u_tetraThickness: 0.035
            },
            reactivity: {
                hoverIntensity: 1.2,
                clickResponse: 2.0,
                scrollReactivity: 0.8
            },
            colors: {
                primary: [255, 0, 255],    // Magenta
                secondary: [200, 0, 200],  // Deep magenta
                accent: [255, 100, 255]    // Light magenta
            },
            performance: {
                targetFPS: 60,
                complexity: 'high'
            }
        };
    }
    
    createTechnicalPrecision() {
        return {
            name: "Technical Precision", 
            type: "Geometric Tetrahedron",
            description: "Cyan wireframe tetrahedron with geometric precision for technical documentation",
            category: "brand",
            geometry: "hypertetrahedron",
            projection: "orthographic",
            parameters: {
                u_dimension: 3.8,
                u_morphFactor: 0.3,
                u_gridDensity: 8.0,
                u_rotationSpeed: 0.5,
                u_patternIntensity: 1.8,
                u_universeModifier: 0.8,
                u_lineThickness: 0.02,
                u_glitchIntensity: 0.0,
                u_colorShift: 0.3,
                u_shellWidth: 0.015,
                u_tetraThickness: 0.05
            },
            reactivity: {
                hoverIntensity: 0.6,
                clickResponse: 1.0,
                scrollReactivity: 0.3
            },
            colors: {
                primary: [0, 255, 255],    // Cyan
                secondary: [0, 200, 200],  // Deep cyan
                accent: [100, 255, 255]    // Light cyan
            },
            performance: {
                targetFPS: 60,
                complexity: 'medium'
            }
        };
    }
    
    createInfinitePotential() {
        return {
            name: "Infinite Potential",
            type: "Hypersphere Expansion", 
            description: "Yellow hypersphere representing infinite possibilities and growth potential",
            category: "brand",
            geometry: "hypersphere",
            projection: "stereographic",
            parameters: {
                u_dimension: 4.2,
                u_morphFactor: 1.0,
                u_gridDensity: 12.0,
                u_rotationSpeed: 0.6,
                u_patternIntensity: 1.3,
                u_universeModifier: 1.4,
                u_lineThickness: 0.025,
                u_glitchIntensity: 0.01,
                u_colorShift: 0.15,
                u_shellWidth: 0.03,
                u_tetraThickness: 0.025
            },
            reactivity: {
                hoverIntensity: 1.0,
                clickResponse: 1.8,
                scrollReactivity: 1.2
            },
            colors: {
                primary: [255, 255, 0],    // Yellow
                secondary: [200, 200, 0],  // Deep yellow
                accent: [255, 255, 100]    // Light yellow
            },
            performance: {
                targetFPS: 60,
                complexity: 'high'
            }
        };
    }
    
    // ========================================================================
    // INTERACTIVE STYLES  
    // ========================================================================
    
    createReactiveHypercube() {
        return {
            name: "Reactive Hypercube",
            type: "High Interaction",
            description: "Hypercube with maximum interaction responsiveness for engaging user experiences",
            category: "interactive",
            geometry: "hypercube",
            projection: "perspective",
            parameters: {
                u_dimension: 4.0,
                u_morphFactor: 0.8,
                u_gridDensity: 18.0,
                u_rotationSpeed: 1.2,
                u_patternIntensity: 1.6,
                u_universeModifier: 1.3,
                u_lineThickness: 0.04,
                u_glitchIntensity: 0.05,
                u_colorShift: 0.1,
                u_shellWidth: 0.03,
                u_tetraThickness: 0.04
            },
            reactivity: {
                hoverIntensity: 2.0,    // Very responsive to hover
                clickResponse: 3.0,     // Strong click effects
                scrollReactivity: 1.5   // High scroll sensitivity
            },
            colors: {
                primary: [255, 0, 255],
                secondary: [0, 255, 255], 
                accent: [255, 255, 0]
            },
            performance: {
                targetFPS: 60,
                complexity: 'high'
            }
        };
    }
    
    createGentleSphere() {
        return {
            name: "Gentle Sphere",
            type: "Subtle Interaction",
            description: "Calm hypersphere with gentle interactions for peaceful, contemplative experiences",
            category: "interactive", 
            geometry: "hypersphere",
            projection: "perspective",
            parameters: {
                u_dimension: 3.6,
                u_morphFactor: 0.4,
                u_gridDensity: 6.0,
                u_rotationSpeed: 0.3,
                u_patternIntensity: 0.8,
                u_universeModifier: 0.7,
                u_lineThickness: 0.02,
                u_glitchIntensity: 0.0,
                u_colorShift: -0.1,
                u_shellWidth: 0.02,
                u_tetraThickness: 0.02
            },
            reactivity: {
                hoverIntensity: 0.3,    // Subtle hover response
                clickResponse: 0.8,     // Gentle click effects
                scrollReactivity: 0.2   // Minimal scroll influence
            },
            colors: {
                primary: [100, 255, 200],  // Soft mint
                secondary: [80, 200, 160], // Deep mint
                accent: [150, 255, 220]    // Light mint
            },
            performance: {
                targetFPS: 60,
                complexity: 'low'
            }
        };
    }
    
    createDynamicTetrahedron() {
        return {
            name: "Dynamic Tetrahedron",
            type: "Balanced Interaction",
            description: "Tetrahedron with balanced interaction responses for professional applications",
            category: "interactive",
            geometry: "hypertetrahedron", 
            projection: "perspective",
            parameters: {
                u_dimension: 3.9,
                u_morphFactor: 0.6,
                u_gridDensity: 10.0,
                u_rotationSpeed: 0.7,
                u_patternIntensity: 1.2,
                u_universeModifier: 1.0,
                u_lineThickness: 0.03,
                u_glitchIntensity: 0.01,
                u_colorShift: 0.2,
                u_shellWidth: 0.02,
                u_tetraThickness: 0.045
            },
            reactivity: {
                hoverIntensity: 1.0,    // Moderate hover response
                clickResponse: 1.5,     // Good click feedback
                scrollReactivity: 0.7   // Balanced scroll influence
            },
            colors: {
                primary: [0, 200, 255],    // Sky blue
                secondary: [0, 150, 200],  // Deep blue
                accent: [100, 220, 255]    // Light blue
            },
            performance: {
                targetFPS: 60,
                complexity: 'medium'
            }
        };
    }
    
    // ========================================================================
    // ARTISTIC STYLES
    // ========================================================================
    
    createQuantumWave() {
        return {
            name: "Quantum Wave",
            type: "Probability Function",
            description: "Wave function geometry representing quantum probability states and research",
            category: "artistic",
            geometry: "wave",
            projection: "stereographic",
            parameters: {
                u_dimension: 4.3,
                u_morphFactor: 1.2,
                u_gridDensity: 14.0,
                u_rotationSpeed: 0.9,
                u_patternIntensity: 1.7,
                u_universeModifier: 1.6,
                u_lineThickness: 0.025,
                u_glitchIntensity: 0.08,
                u_colorShift: 0.4,
                u_shellWidth: 0.035,
                u_tetraThickness: 0.03
            },
            reactivity: {
                hoverIntensity: 1.3,
                clickResponse: 2.2,
                scrollReactivity: 1.0
            },
            colors: {
                primary: [255, 100, 200],  // Pink
                secondary: [200, 50, 150], // Deep pink
                accent: [255, 150, 220]    // Light pink
            },
            performance: {
                targetFPS: 60,
                complexity: 'high'
            }
        };
    }
    
    createCrystallineOrder() {
        return {
            name: "Crystalline Order",
            type: "Systematic Innovation",
            description: "Crystal lattice representing ordered complexity and systematic advancement",
            category: "artistic",
            geometry: "crystal",
            projection: "orthographic",
            parameters: {
                u_dimension: 3.7,
                u_morphFactor: 0.5,
                u_gridDensity: 20.0,
                u_rotationSpeed: 0.4,
                u_patternIntensity: 2.0,
                u_universeModifier: 0.9,
                u_lineThickness: 0.015,
                u_glitchIntensity: 0.0,
                u_colorShift: -0.2,
                u_shellWidth: 0.02,
                u_tetraThickness: 0.025
            },
            reactivity: {
                hoverIntensity: 0.8,
                clickResponse: 1.2,
                scrollReactivity: 0.4
            },
            colors: {
                primary: [150, 255, 200],  // Mint
                secondary: [100, 200, 150], // Deep mint
                accent: [200, 255, 220]    // Light mint
            },
            performance: {
                targetFPS: 60,
                complexity: 'high'
            }
        };
    }
    
    createTopologicalKlein() {
        return {
            name: "Topological Klein",
            type: "Boundary Transcendence",
            description: "Klein bottle topology representing community connection and boundary transcendence",
            category: "artistic",
            geometry: "klein",
            projection: "perspective",
            parameters: {
                u_dimension: 4.1,
                u_morphFactor: 0.9,
                u_gridDensity: 11.0,
                u_rotationSpeed: 0.6,
                u_patternIntensity: 1.4,
                u_universeModifier: 1.3,
                u_lineThickness: 0.035,
                u_glitchIntensity: 0.03,
                u_colorShift: 0.25,
                u_shellWidth: 0.04,
                u_tetraThickness: 0.035
            },
            reactivity: {
                hoverIntensity: 1.1,
                clickResponse: 1.7,
                scrollReactivity: 0.9
            },
            colors: {
                primary: [255, 150, 0],    // Orange
                secondary: [200, 100, 0],  // Deep orange
                accent: [255, 200, 100]    // Light orange
            },
            performance: {
                targetFPS: 60,
                complexity: 'high'
            }
        };
    }
    
    // ========================================================================
    // PERFORMANCE STYLES
    // ========================================================================
    
    createMinimalLattice() {
        return {
            name: "Minimal Lattice",
            type: "Performance Optimized",
            description: "Simplified geometry with minimal resource usage for maximum performance",
            category: "performance",
            geometry: "hypercube",
            projection: "orthographic",
            parameters: {
                u_dimension: 3.5,
                u_morphFactor: 0.2,
                u_gridDensity: 4.0,
                u_rotationSpeed: 0.3,
                u_patternIntensity: 0.8,
                u_universeModifier: 0.6,
                u_lineThickness: 0.02,
                u_glitchIntensity: 0.0,
                u_colorShift: 0.0,
                u_shellWidth: 0.015,
                u_tetraThickness: 0.02
            },
            reactivity: {
                hoverIntensity: 0.5,
                clickResponse: 0.8,
                scrollReactivity: 0.2
            },
            colors: {
                primary: [100, 100, 255],  // Soft blue
                secondary: [80, 80, 200],  // Deep blue
                accent: [150, 150, 255]    // Light blue
            },
            performance: {
                targetFPS: 120,
                complexity: 'minimal'
            }
        };
    }
    
    createMaximumDetail() {
        return {
            name: "Maximum Detail",
            type: "Visual Showcase",
            description: "High-detail visualization showcasing maximum visual complexity and effects",
            category: "performance",
            geometry: "hypercube",
            projection: "perspective",
            parameters: {
                u_dimension: 4.5,
                u_morphFactor: 1.5,
                u_gridDensity: 25.0,
                u_rotationSpeed: 1.0,
                u_patternIntensity: 2.0,
                u_universeModifier: 2.0,
                u_lineThickness: 0.05,
                u_glitchIntensity: 0.1,
                u_colorShift: 0.3,
                u_shellWidth: 0.05,
                u_tetraThickness: 0.08
            },
            reactivity: {
                hoverIntensity: 1.8,
                clickResponse: 2.5,
                scrollReactivity: 1.3
            },
            colors: {
                primary: [255, 0, 128],    // Hot pink
                secondary: [200, 0, 100],  // Deep pink
                accent: [255, 100, 180]    // Light pink
            },
            performance: {
                targetFPS: 30,
                complexity: 'maximum'
            }
        };
    }
    
    createSmoothFlow() {
        return {
            name: "Smooth Flow",
            type: "Optimized Motion",
            description: "Torus flow patterns optimized for smooth 60fps performance with fluid motion",
            category: "performance",
            geometry: "torus",
            projection: "perspective",
            parameters: {
                u_dimension: 3.8,
                u_morphFactor: 0.6,
                u_gridDensity: 8.0,
                u_rotationSpeed: 0.5,
                u_patternIntensity: 1.0,
                u_universeModifier: 1.0,
                u_lineThickness: 0.025,
                u_glitchIntensity: 0.0,
                u_colorShift: 0.1,
                u_shellWidth: 0.02,
                u_tetraThickness: 0.03
            },
            reactivity: {
                hoverIntensity: 0.8,
                clickResponse: 1.2,
                scrollReactivity: 0.6
            },
            colors: {
                primary: [0, 255, 150],    // Green
                secondary: [0, 200, 100],  // Deep green
                accent: [100, 255, 180]    // Light green
            },
            performance: {
                targetFPS: 60,
                complexity: 'optimized'
            }
        };
    }
    
    // ========================================================================
    // EXPERIMENTAL STYLES
    // ========================================================================
    
    createFractalEmergence() {
        return {
            name: "Fractal Emergence",
            type: "Recursive Complexity",
            description: "Fractal geometry showing recursive emergence and development complexity",
            category: "experimental",
            geometry: "fractal",
            projection: "stereographic",
            parameters: {
                u_dimension: 4.2,
                u_morphFactor: 1.1,
                u_gridDensity: 16.0,
                u_rotationSpeed: 0.8,
                u_patternIntensity: 1.8,
                u_universeModifier: 1.5,
                u_lineThickness: 0.03,
                u_glitchIntensity: 0.06,
                u_colorShift: 0.35,
                u_shellWidth: 0.035,
                u_tetraThickness: 0.04
            },
            reactivity: {
                hoverIntensity: 1.4,
                clickResponse: 2.0,
                scrollReactivity: 1.1
            },
            colors: {
                primary: [150, 0, 255],    // Purple
                secondary: [100, 0, 200],  // Deep purple
                accent: [200, 100, 255]    // Light purple
            },
            performance: {
                targetFPS: 45,
                complexity: 'experimental'
            }
        };
    }
    
    createRealityGlitch() {
        return {
            name: "Reality Glitch",
            type: "Digital Distortion",
            description: "High glitch intensity creating reality distortion effects and digital artifacts",
            category: "experimental",
            geometry: "hypercube",
            projection: "perspective",
            parameters: {
                u_dimension: 4.0,
                u_morphFactor: 0.8,
                u_gridDensity: 13.0,
                u_rotationSpeed: 1.5,
                u_patternIntensity: 1.6,
                u_universeModifier: 1.2,
                u_lineThickness: 0.04,
                u_glitchIntensity: 0.15,  // Maximum glitch
                u_colorShift: 0.5,
                u_shellWidth: 0.03,
                u_tetraThickness: 0.035
            },
            reactivity: {
                hoverIntensity: 1.6,
                clickResponse: 2.8,
                scrollReactivity: 1.4
            },
            colors: {
                primary: [255, 255, 255],  // White
                secondary: [255, 0, 0],    // Red
                accent: [0, 255, 0]        // Green
            },
            performance: {
                targetFPS: 50,
                complexity: 'experimental'
            }
        };
    }
    
    createHyperdimensionalStorm() {
        return {
            name: "Hyperdimensional Storm",
            type: "Chaos Mathematics",
            description: "Extreme 4D transformation with chaotic parameters pushing system limits",
            category: "experimental",
            geometry: "hypersphere",
            projection: "stereographic",
            parameters: {
                u_dimension: 4.5,         // Maximum dimension
                u_morphFactor: 1.5,       // Maximum morph
                u_gridDensity: 22.0,      // High density
                u_rotationSpeed: 2.0,     // Fast rotation
                u_patternIntensity: 2.0,  // Maximum intensity
                u_universeModifier: 2.5,  // Reality scaling
                u_lineThickness: 0.06,    // Thick lines
                u_glitchIntensity: 0.12,
                u_colorShift: 0.8,
                u_shellWidth: 0.06,
                u_tetraThickness: 0.07
            },
            reactivity: {
                hoverIntensity: 2.0,      // Maximum reactivity
                clickResponse: 3.0,       // Extreme response
                scrollReactivity: 1.8     // High scroll influence
            },
            colors: {
                primary: [255, 0, 255],
                secondary: [0, 255, 255],
                accent: [255, 255, 0]
            },
            performance: {
                targetFPS: 30,
                complexity: 'extreme'
            }
        };
    }
    
    // ========================================================================
    // UTILITY METHODS
    // ========================================================================
    
    exportPreset(presetId) {
        const preset = this.getPreset(presetId);
        if (!preset) {
            throw new Error(`Preset '${presetId}' not found`);
        }
        
        return {
            ...preset,
            exported: new Date().toISOString(),
            version: '1.0.0',
            id: presetId
        };
    }
    
    importPreset(presetData, customId = null) {
        const id = customId || presetData.id || `imported-${Date.now()}`;
        this.registerPreset(id, presetData);
        return id;
    }
    
    validatePreset(preset) {
        const required = ['name', 'type', 'geometry', 'projection', 'parameters', 'reactivity'];
        return required.every(field => preset.hasOwnProperty(field));
    }
    
    getPresetSummary() {
        const summary = {
            total: this.presets.size,
            categories: {}
        };
        
        for (const [category, presetIds] of this.categories.entries()) {
            summary.categories[category] = presetIds.length;
        }
        
        return summary;
    }
}

// Export for browser and Node.js use
if (typeof window !== 'undefined') {
    window.VIB34DStylePresets = VIB34DStylePresets;
    console.log('🎨 VIB34D Style Presets Library loaded and exported to window');
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = VIB34DStylePresets;
}

// Create global instance
const VIB34D_STYLE_PRESETS = new VIB34DStylePresets();

console.log(`✅ VIB34D Style Presets: ${VIB34D_STYLE_PRESETS.presets.size} presets loaded across ${VIB34D_STYLE_PRESETS.categories.size} categories`);