/**
 * VIB3StyleSystem.js - The Conductor (Enhanced)
 * Orchestrates visualizers, presets, and content integration
 */
import VIB34D from './VIB34D.js';
import PresetManager from './PresetManager.js';
import InteractionCoordinator from './InteractionCoordinator.js';

class VIB3StyleSystem {
    constructor(options = {}) {
        // Core configuration
        this.container = options.container || document.body;
        this.presetPath = options.presetPath || './presets/';
        this.theme = options.theme || 'vib3code-blog';
        this.performance = options.performance || 'auto';
        
        // System components
        this.presetManager = new PresetManager();
        this.interactionCoordinator = null;
        this.visualizers = [];
        this.sectionConfigs = new Map();
        
        // State management
        this.isInitialized = false;
        this.currentTheme = null;
        this.performanceMode = 'balanced';
        
        // Performance monitoring
        this.metrics = {
            frameRate: 60,
            memoryUsage: 0,
            activeVisualizers: 0,
            lastPerformanceCheck: Date.now()
        };

        console.log('[VIB3StyleSystem] Initialized with options:', options);
    }

    /**
     * Initialize the complete system
     * @returns {Promise<boolean>} Success status
     */
    async init() {
        try {
            console.log('[VIB3StyleSystem] Starting initialization...');
            
            // Load all preset configurations
            await this.presetManager.loadPresets(this.presetPath);
            
            // Auto-detect or apply specified theme
            const detectedTheme = this.presetManager.autoDetectTheme(this.container);
            const themeToUse = this.theme === 'auto' ? detectedTheme : this.theme;
            
            // Apply theme to container
            this.currentTheme = this.presetManager.applyTheme(themeToUse, this.container);
            
            // Detect performance mode
            this.detectPerformanceMode();
            
            // Find and initialize visualizer elements
            await this.discoverAndInitializeVisualizers();
            
            // Set up interaction coordination
            this.interactionCoordinator = new InteractionCoordinator(
                this.presetManager, 
                this,
                this.performanceMode
            );
            
            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            // Apply responsive configuration
            this.applyResponsiveConfiguration();
            
            this.isInitialized = true;
            console.log('[VIB3StyleSystem] Initialization complete');
            
            // Emit initialization event
            this.container.dispatchEvent(new CustomEvent('vib3-initialized', {
                detail: { 
                    theme: themeToUse, 
                    visualizers: this.visualizers.length,
                    performance: this.performanceMode
                }
            }));
            
            return true;
        } catch (error) {
            console.error('[VIB3StyleSystem] Initialization failed:', error);
            return false;
        }
    }

    /**
     * Discover elements that need visualizers and create them
     */
    async discoverAndInitializeVisualizers() {
        // Find elements with data-vib3-style attributes
        const elementsWithStyles = this.container.querySelectorAll('[data-vib3-style]');
        
        // Find elements with data-vib3-section attributes
        const elementsWithSections = this.container.querySelectorAll('[data-vib3-section]');
        
        // Find elements with CSS classes that match theme sections
        const themeConfig = this.currentTheme?.config;
        const sectionElements = [];
        
        if (themeConfig?.sections) {
            Object.keys(themeConfig.sections).forEach(sectionName => {
                const elements = this.container.querySelectorAll(`.${sectionName}, [data-section="${sectionName}"]`);
                elements.forEach(el => {
                    el.dataset.vib3Section = sectionName;
                    sectionElements.push(el);
                });
            });
        }

        // Combine all discovered elements
        const allElements = new Set([
            ...elementsWithStyles,
            ...elementsWithSections,
            ...sectionElements
        ]);

        console.log(`[VIB3StyleSystem] Found ${allElements.size} elements to visualize`);

        // Create visualizers for each element
        for (const element of allElements) {
            await this.createVisualizerForElement(element);
        }
        
        // If no specific elements found, create default background visualizer
        if (allElements.size === 0) {
            await this.createDefaultBackgroundVisualizer();
        }
    }

    /**
     * Create a visualizer for a specific element
     * @param {HTMLElement} element - Element to attach visualizer to
     */
    async createVisualizerForElement(element) {
        try {
            // Determine configuration source priority:
            // 1. Explicit data-vib3-style attribute
            // 2. Theme section configuration
            // 3. Element class-based detection
            // 4. Fallback default
            
            let config = null;
            let configSource = '';

            // Check for explicit style attribute
            const explicitStyle = element.dataset.vib3Style;
            if (explicitStyle) {
                config = this.presetManager.getSectionConfiguration(explicitStyle);
                configSource = `explicit:${explicitStyle}`;
            }
            
            // Check for section-based configuration
            const sectionName = element.dataset.vib3Section;
            if (!config && sectionName) {
                config = this.presetManager.getSectionConfiguration(sectionName);
                configSource = `section:${sectionName}`;
            }
            
            // Content-based auto-detection
            if (!config) {
                const detectedType = this.detectElementType(element);
                config = this.presetManager.getSectionConfiguration(detectedType);
                configSource = `detected:${detectedType}`;
            }
            
            // Apply performance optimization if needed
            if (this.performanceMode === 'optimized' && config?.visual) {
                const optimizedVisual = this.presetManager.getOptimizedPreset(config.visual.name);
                if (optimizedVisual) {
                    config.visual = optimizedVisual;
                    configSource += '+optimized';
                }
            }

            // Create canvas container
            const canvas = this.createCanvasForElement(element);
            
            // Initialize VIB34D visualizer
            const visualizer = new VIB34D(canvas, {
                ...config.visual.parameters,
                geometry: config.visual.geometry,
                reactivity: config.reactivity,
                performanceMode: this.performanceMode
            });
            
            // Store references
            visualizer.element = element;
            visualizer.canvas = canvas;
            visualizer.config = config;
            visualizer.configSource = configSource;
            visualizer.sectionName = sectionName || 'auto';
            
            this.visualizers.push(visualizer);
            this.sectionConfigs.set(element, config);
            
            // Add identifying attributes
            element.classList.add('vib3-visualized');
            element.dataset.vib3Visualizer = this.visualizers.length - 1;
            
            console.log(`[VIB3StyleSystem] Created visualizer for element (${configSource})`);
            
        } catch (error) {
            console.error('[VIB3StyleSystem] Failed to create visualizer for element:', error);
        }
    }

    /**
     * Create canvas element for visualizer
     * @param {HTMLElement} element - Parent element
     * @returns {HTMLCanvasElement} Created canvas
     */
    createCanvasForElement(element) {
        // Check if canvas already exists
        let canvas = element.querySelector('.vib3-visualizer-canvas');
        
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.className = 'vib3-visualizer-canvas';
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            `;
            
            // Ensure parent has relative positioning
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.position === 'static') {
                element.style.position = 'relative';
            }
            
            element.appendChild(canvas);
        }
        
        return canvas;
    }

    /**
     * Detect element type based on content and structure
     * @param {HTMLElement} element - Element to analyze
     * @returns {string} Detected section type
     */
    detectElementType(element) {
        // Check semantic HTML elements
        if (element.tagName === 'HEADER' || element.classList.contains('hero')) {
            return 'hero';
        }
        if (element.tagName === 'ARTICLE' || element.classList.contains('article')) {
            return 'article_content';
        }
        if (element.tagName === 'NAV' || element.classList.contains('navigation')) {
            return 'sidebar';
        }
        if (element.tagName === 'FOOTER' || element.classList.contains('footer')) {
            return 'footer';
        }
        
        // Check for specific content patterns
        if (element.querySelectorAll('pre, code').length > 0) {
            return 'technical_deep';
        }
        if (element.classList.contains('card') || element.dataset.interactive) {
            return 'interactive_cards';
        }
        if (element.querySelector('.pricing, .plan, .feature')) {
            return 'pricing_clarity';
        }
        
        // Default fallback
        return 'article_list';
    }

    /**
     * Create default background visualizer when no specific elements found
     */
    async createDefaultBackgroundVisualizer() {
        console.log('[VIB3StyleSystem] Creating default background visualizer');
        
        // Create background container
        const backgroundContainer = document.createElement('div');
        backgroundContainer.className = 'vib3-default-background';
        backgroundContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1000;
            pointer-events: none;
        `;
        
        // Insert at beginning of container
        this.container.insertBefore(backgroundContainer, this.container.firstChild);
        
        // Create visualizer with default hero configuration
        backgroundContainer.dataset.vib3Section = 'hero';
        await this.createVisualizerForElement(backgroundContainer);
    }

    /**
     * Detect optimal performance mode based on device capabilities
     */
    detectPerformanceMode() {
        if (this.performance !== 'auto') {
            this.performanceMode = this.performance;
            return;
        }

        // Device capability detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            this.performanceMode = 'minimal';
            return;
        }

        // Memory and CPU heuristics
        const memoryInfo = performance.memory;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowPoweredDevice = navigator.hardwareConcurrency <= 2;
        
        if (isMobile || isLowPoweredDevice) {
            this.performanceMode = 'optimized';
        } else if (memoryInfo && memoryInfo.jsHeapSizeLimit < 1073741824) { // < 1GB
            this.performanceMode = 'balanced';
        } else {
            this.performanceMode = 'full';
        }

        console.log(`[VIB3StyleSystem] Detected performance mode: ${this.performanceMode}`);
    }

    /**
     * Apply responsive configuration based on viewport
     */
    applyResponsiveConfiguration() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        let deviceType = 'desktop';
        if (viewport.width <= 768) deviceType = 'mobile';
        else if (viewport.width <= 1024) deviceType = 'tablet';

        // Apply theme-specific responsive settings
        const themeConfig = this.currentTheme?.config;
        const responsiveConfig = themeConfig?.responsive?.[deviceType];
        
        if (responsiveConfig) {
            // Update performance mode if specified
            if (responsiveConfig.performance_mode) {
                this.performanceMode = responsiveConfig.performance_mode;
            }
            
            // Apply complexity reduction
            if (responsiveConfig.reduced_complexity) {
                this.visualizers.forEach(visualizer => {
                    if (visualizer.updateComplexity) {
                        visualizer.updateComplexity(responsiveConfig.reduced_complexity);
                    }
                });
            }
        }

        console.log(`[VIB3StyleSystem] Applied responsive config for ${deviceType}`);
    }

    /**
     * Start performance monitoring system
     */
    startPerformanceMonitoring() {
        setInterval(() => {
            this.checkPerformance();
        }, 2000); // Check every 2 seconds

        // Also monitor on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseVisualizers();
            } else {
                this.resumeVisualizers();
            }
        });
    }

    /**
     * Check system performance and adjust if needed
     */
    checkPerformance() {
        let totalFrameRate = 0;
        let activeCount = 0;

        this.visualizers.forEach(visualizer => {
            if (visualizer.isRendering && visualizer.getFrameRate) {
                totalFrameRate += visualizer.getFrameRate();
                activeCount++;
            }
        });

        if (activeCount > 0) {
            this.metrics.frameRate = totalFrameRate / activeCount;
            this.metrics.activeVisualizers = activeCount;
        }

        // Auto-adjust performance if needed
        if (this.metrics.frameRate < 30 && this.performanceMode !== 'minimal') {
            console.log('[VIB3StyleSystem] Performance degraded, reducing quality');
            this.reduceQuality();
        }
    }

    /**
     * Reduce quality for performance
     */
    reduceQuality() {
        this.visualizers.forEach(visualizer => {
            if (visualizer.reduceQuality) {
                visualizer.reduceQuality();
            }
        });
    }

    /**
     * Pause all visualizers (for performance)
     */
    pauseVisualizers() {
        this.visualizers.forEach(visualizer => {
            if (visualizer.pause) {
                visualizer.pause();
            }
        });
    }

    /**
     * Resume all visualizers
     */
    resumeVisualizers() {
        this.visualizers.forEach(visualizer => {
            if (visualizer.resume) {
                visualizer.resume();
            }
        });
    }

    /**
     * Switch to a different theme
     * @param {string} themeName - Name of new theme
     */
    async switchTheme(themeName) {
        console.log(`[VIB3StyleSystem] Switching to theme: ${themeName}`);
        
        // Apply new theme
        this.currentTheme = this.presetManager.applyTheme(themeName, this.container);
        
        // Update all visualizers with new configurations
        for (let i = 0; i < this.visualizers.length; i++) {
            const visualizer = this.visualizers[i];
            const element = visualizer.element;
            
            // Get new configuration for this element's section
            const sectionName = element.dataset.vib3Section || 'default';
            const newConfig = this.presetManager.getSectionConfiguration(sectionName);
            
            if (newConfig && visualizer.updateConfiguration) {
                visualizer.updateConfiguration(newConfig);
            }
        }
    }

    /**
     * Get all visualizers
     * @returns {Array} Array of VIB34D visualizers
     */
    getVisualizers() {
        return this.visualizers;
    }

    /**
     * Get visualizers by section
     * @param {string} sectionName - Name of section
     * @returns {Array} Array of visualizers in that section
     */
    getVisualizersBySection(sectionName) {
        return this.visualizers.filter(v => v.sectionName === sectionName);
    }

    /**
     * Update visualizer parameters globally
     * @param {Object} parameters - Parameters to update
     */
    updateGlobalParameters(parameters) {
        this.visualizers.forEach(visualizer => {
            if (visualizer.updateParameters) {
                visualizer.updateParameters(parameters);
            }
        });
    }

    /**
     * Get system status and metrics
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            theme: this.currentTheme?.name,
            visualizers: this.visualizers.length,
            performanceMode: this.performanceMode,
            metrics: this.metrics,
            presets: this.presetManager.listAvailablePresets()
        };
    }

    /**
     * Cleanup and destroy the system
     */
    destroy() {
        console.log('[VIB3StyleSystem] Destroying system...');
        
        // Stop all visualizers
        this.visualizers.forEach(visualizer => {
            if (visualizer.destroy) {
                visualizer.destroy();
            }
        });
        
        // Remove interaction coordinator
        if (this.interactionCoordinator && this.interactionCoordinator.destroy) {
            this.interactionCoordinator.destroy();
        }
        
        // Clean up DOM
        this.container.querySelectorAll('.vib3-visualizer-canvas').forEach(canvas => {
            canvas.remove();
        });
        
        // Clear references
        this.visualizers = [];
        this.sectionConfigs.clear();
        this.isInitialized = false;
        
        console.log('[VIB3StyleSystem] System destroyed');
    }
}

export default VIB3StyleSystem;