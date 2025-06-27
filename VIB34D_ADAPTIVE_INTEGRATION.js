/**
 * VIB34D ADAPTIVE INTEGRATION
 * Integrates the adaptive card visualizer system into existing blog cards
 */

console.log('🎴 VIB34D Adaptive Integration System Initializing...');

// Wait for all systems to load and check for AdaptiveCardVisualizer with enhanced detection
document.addEventListener('DOMContentLoaded', () => {
    // Check multiple times until AdaptiveCardVisualizer is available
    let checkCount = 0;
    const maxChecks = 30; // Increased attempts
    
    const checkAndIntegrate = () => {
        console.log(`🔍 Enhanced AdaptiveCardVisualizer Detection (attempt ${checkCount + 1}/${maxChecks})...`);
        
        // Detailed logging of available classes and namespaces
        console.log('🔍 Available window objects:', {
            VIB34D: !!window.VIB34D,
            AdaptiveCardVisualizer: !!window.AdaptiveCardVisualizer,
            'VIB34D.AdaptiveCardVisualizer': !!(window.VIB34D && window.VIB34D.AdaptiveCardVisualizer),
            'window keys containing VIB': Object.keys(window).filter(k => k.includes('VIB')),
            'window keys containing Adaptive': Object.keys(window).filter(k => k.includes('Adaptive'))
        });
        
        // Try multiple locations for the AdaptiveCardVisualizer class
        let VisualizerClass = null;
        let classLocation = '';
        
        // Location 1: window.VIB34D.AdaptiveCardVisualizer (preferred)
        if (window.VIB34D && window.VIB34D.AdaptiveCardVisualizer) {
            VisualizerClass = window.VIB34D.AdaptiveCardVisualizer;
            classLocation = 'window.VIB34D.AdaptiveCardVisualizer';
            console.log('✅ AdaptiveCardVisualizer found at window.VIB34D.AdaptiveCardVisualizer');
        }
        // Location 2: window.AdaptiveCardVisualizer (global fallback)
        else if (window.AdaptiveCardVisualizer) {
            VisualizerClass = window.AdaptiveCardVisualizer;
            classLocation = 'window.AdaptiveCardVisualizer';
            console.log('✅ AdaptiveCardVisualizer found at window.AdaptiveCardVisualizer');
        }
        // Location 3: Try VIB34D namespace variations
        else if (window.VIB3 && window.VIB3.AdaptiveCardVisualizer) {
            VisualizerClass = window.VIB3.AdaptiveCardVisualizer;
            classLocation = 'window.VIB3.AdaptiveCardVisualizer';
            console.log('✅ AdaptiveCardVisualizer found at window.VIB3.AdaptiveCardVisualizer');
        }
        // Location 4: Check for class constructor in global scope
        else if (typeof AdaptiveCardVisualizer !== 'undefined') {
            VisualizerClass = AdaptiveCardVisualizer;
            classLocation = 'global AdaptiveCardVisualizer';
            console.log('✅ AdaptiveCardVisualizer found in global scope');
        }
        
        if (VisualizerClass) {
            console.log(`🎯 AdaptiveCardVisualizer detected at ${classLocation}, verifying class...`);
            
            // Verify it's actually a constructor function
            if (typeof VisualizerClass === 'function') {
                console.log('✅ AdaptiveCardVisualizer is a valid constructor function');
                console.log('🚀 Starting enhanced integration with detailed logging...');
                integrateAdaptiveVisualizers(VisualizerClass, classLocation);
            } else {
                console.error('❌ AdaptiveCardVisualizer found but is not a constructor function:', typeof VisualizerClass);
                checkCount++;
                if (checkCount < maxChecks) {
                    setTimeout(checkAndIntegrate, 300); // Reduced interval for faster detection
                } else {
                    console.error('❌ AdaptiveCardVisualizer verification failed after all attempts');
                    logDetailedErrorInfo();
                }
            }
        } else {
            console.log('⏳ AdaptiveCardVisualizer not yet available, continuing search...');
            checkCount++;
            if (checkCount < maxChecks) {
                setTimeout(checkAndIntegrate, 300); // Reduced interval for faster detection
            } else {
                console.error('❌ AdaptiveCardVisualizer not found after all attempts');
                logDetailedErrorInfo();
            }
        }
    };
    
    checkAndIntegrate();
});

// Enhanced error logging function
function logDetailedErrorInfo() {
    console.group('🔍 Detailed AdaptiveCardVisualizer Detection Report');
    console.log('Available window properties:', Object.keys(window).filter(k => 
        k.includes('VIB') || k.includes('Adaptive') || k.includes('Card')
    ));
    
    if (window.VIB34D) {
        console.log('VIB34D namespace contents:', Object.keys(window.VIB34D));
    }
    
    console.log('All script tags:', Array.from(document.querySelectorAll('script')).map(s => s.src || s.textContent.substring(0, 100)));
    console.log('Canvas elements found:', document.querySelectorAll('canvas').length);
    console.log('Blog cards found:', document.querySelectorAll('.blog-card').length);
    console.groupEnd();
}

function integrateAdaptiveVisualizers(VisualizerClass, classLocation) {
    console.log(`🔄 Enhanced Canvas Replacement with AdaptiveCardVisualizer from ${classLocation}...`);
    
    // Get all blog cards and canvas elements
    const blogCards = document.querySelectorAll('.blog-card');
    const allCanvases = document.querySelectorAll('canvas');
    const cardVisualizers = [];
    
    console.log(`🔍 Found ${blogCards.length} blog cards and ${allCanvases.length} canvas elements`);
    
    // Enhanced geometry mapping for each card based on content
    const cardGeometryMap = {
        'blog-card-1': 0, // Hypercube for main article
        'blog-card-2': 1, // Tetrahedron for tech sidebar
        'blog-card-3': 3, // Torus for related articles
        'blog-card-4': 4, // Klein for navigation
        'blog-card-5': 5, // Fractal for article list
        'blog-card-6': 7  // Crystal for footer/meta
    };
    
    // Process blog cards first
    blogCards.forEach((card, index) => {
        const cardId = card.id || `blog-card-${index}`;
        
        // Look for multiple possible canvas selectors
        const existingCanvas = card.querySelector('.card-visualizer') || 
                              card.querySelector('canvas') || 
                              card.querySelector('[id*="visualizer"]');
        
        console.log(`🎯 Processing card ${cardId}:`, {
            hasCanvas: !!existingCanvas,
            canvasId: existingCanvas?.id,
            canvasSize: existingCanvas ? `${existingCanvas.width}x${existingCanvas.height}` : 'N/A'
        });
        
        if (existingCanvas) {
            try {
                // Create container for adaptive visualizer
                const vizContainer = document.createElement('div');
                vizContainer.className = 'adaptive-visualizer-container';
                vizContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    opacity: 0.8;
                    z-index: 1;
                `;
                
                // Get canvas dimensions before replacement
                const canvasRect = existingCanvas.getBoundingClientRect();
                const canvasWidth = existingCanvas.width || canvasRect.width || 300;
                const canvasHeight = existingCanvas.height || canvasRect.height || 200;
                
                console.log(`🔧 Canvas dimensions for ${cardId}:`, { canvasWidth, canvasHeight });
                
                // Replace canvas with container
                existingCanvas.parentNode.replaceChild(vizContainer, existingCanvas);
                
                // Determine geometry based on card ID or face state
                const geometry = cardGeometryMap[cardId] || index % 8;
                
                // Create adaptive visualizer with enhanced options
                const options = {
                    width: canvasWidth,
                    height: canvasHeight,
                    geometry: geometry,
                    theme: getThemeForGeometry(geometry),
                    responsive: true,
                    masterKey: 1.0,
                    subclasses: ['blog-card-viz', `geometry-${geometry}`, `card-${index}`],
                    editorMode: false,
                    editorParams: {
                        intensity: 0.8 + (index * 0.1), // Slightly different intensity per card
                        complexity: 1.0,
                        colorShift: geometry * 45, // Different color per geometry (in degrees)
                        holographic: 1.0,
                        crystallization: 0.6,
                        rotation: index * 30 // Different rotation per card
                    }
                };
                
                console.log(`🚀 Creating visualizer for ${cardId} with options:`, options);
                
                // Create visualizer instance using the provided class
                const visualizer = new VisualizerClass(vizContainer, options);
                
                cardVisualizers.push({
                    card: card,
                    visualizer: visualizer,
                    geometry: geometry,
                    cardId: cardId,
                    container: vizContainer
                });
                
                console.log(`✅ Successfully created adaptive visualizer for ${cardId} with ${options.theme} geometry`);
                
            } catch (error) {
                console.error(`❌ Failed to create visualizer for ${cardId}:`, {
                    error: error.message,
                    stack: error.stack,
                    VisualizerClass: typeof VisualizerClass,
                    classLocation: classLocation,
                    cardElement: card,
                    canvasElement: existingCanvas
                });
                
                // Try to restore original canvas on error
                try {
                    if (vizContainer && vizContainer.parentNode) {
                        vizContainer.parentNode.replaceChild(existingCanvas, vizContainer);
                        console.log(`🔄 Restored original canvas for ${cardId} after error`);
                    }
                } catch (restoreError) {
                    console.error(`❌ Failed to restore canvas for ${cardId}:`, restoreError);
                }
            }
        } else {
            console.log(`⚠️ No canvas found in card ${cardId}, skipping...`);
        }
    });
    
    // Also check for standalone canvas elements that might need replacement
    const standaloneCanvases = Array.from(allCanvases).filter(canvas => 
        !canvas.closest('.blog-card') && 
        (canvas.id.includes('visualizer') || canvas.className.includes('visualizer'))
    );
    
    console.log(`🔍 Found ${standaloneCanvases.length} standalone canvas elements for replacement`);
    
    standaloneCanvases.forEach((canvas, index) => {
        try {
            const containerId = `standalone-adaptive-${index}`;
            const geometry = index % 8;
            
            console.log(`🎯 Processing standalone canvas: ${canvas.id} -> geometry ${geometry}`);
            
            const vizContainer = document.createElement('div');
            vizContainer.id = containerId;
            vizContainer.className = 'adaptive-visualizer-container standalone';
            vizContainer.style.cssText = canvas.style.cssText + '; opacity: 0.8;';
            
            const canvasRect = canvas.getBoundingClientRect();
            const options = {
                width: canvas.width || canvasRect.width || 300,
                height: canvas.height || canvasRect.height || 200,
                geometry: geometry,
                theme: getThemeForGeometry(geometry),
                responsive: true,
                masterKey: 1.0,
                subclasses: ['standalone-viz', `geometry-${geometry}`],
                editorMode: false
            };
            
            canvas.parentNode.replaceChild(vizContainer, canvas);
            const visualizer = new VisualizerClass(vizContainer, options);
            
            cardVisualizers.push({
                card: null,
                visualizer: visualizer,
                geometry: geometry,
                cardId: containerId,
                container: vizContainer,
                isStandalone: true
            });
            
            console.log(`✅ Successfully replaced standalone canvas ${canvas.id}`);
            
        } catch (error) {
            console.error(`❌ Failed to replace standalone canvas ${canvas.id}:`, error);
        }
    });
    
    // Integrate with face navigation system
    if (window.morphingBlogSystem) {
        console.log('🔗 Integrating with face navigation system...');
        
        // Hook into face transitions
        const originalTransition = window.morphingBlogSystem.transitionToFace;
        window.morphingBlogSystem.transitionToFace = function(faceIndex) {
            // Call original transition
            if (originalTransition) {
                originalTransition.call(this, faceIndex);
            }
            
            // Update card visualizers based on face
            updateVisualizersForFace(faceIndex, cardVisualizers);
        };
    }
    
    // Add interaction handlers
    addCardInteractions(cardVisualizers);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        cardVisualizers.forEach(({ visualizer }) => {
            if (visualizer && visualizer.gl) {
                visualizer.gl.viewport(0, 0, visualizer.canvas.width, visualizer.canvas.height);
            }
        });
    });
    
    // Enhanced success reporting
    const successfulCards = cardVisualizers.filter(cv => cv.visualizer && !cv.error);
    const failedCards = cardVisualizers.filter(cv => cv.error);
    const standaloneCount = cardVisualizers.filter(cv => cv.isStandalone).length;
    const blogCardCount = cardVisualizers.length - standaloneCount;
    
    console.group(`🎴 Enhanced Adaptive Integration Complete`);
    console.log(`✅ Successfully integrated: ${successfulCards.length} visualizers`);
    console.log(`   📱 Blog cards: ${blogCardCount}`);
    console.log(`   🎯 Standalone canvases: ${standaloneCount}`);
    
    if (failedCards.length > 0) {
        console.log(`❌ Failed integrations: ${failedCards.length}`);
    }
    
    console.log(`🔧 AdaptiveCardVisualizer source: ${classLocation}`);
    console.log(`🎨 Geometry distribution:`, 
        successfulCards.reduce((acc, cv) => {
            const geom = getThemeForGeometry(cv.geometry);
            acc[geom] = (acc[geom] || 0) + 1;
            return acc;
        }, {})
    );
    
    console.log(`🎮 Integration features active:`);
    console.log(`   - Face navigation system: ${!!window.morphingBlogSystem}`);
    console.log(`   - Card interactions: ✅`);
    console.log(`   - Responsive resize: ✅`);
    console.log(`   - Error recovery: ✅`);
    
    console.groupEnd();
    
    // Make cardVisualizers available globally for debugging
    window.vib34dCardVisualizers = cardVisualizers;
    console.log(`🔍 Debug access: window.vib34dCardVisualizers (${cardVisualizers.length} items)`);
    
    return cardVisualizers;
}

function getThemeForGeometry(geometryIndex) {
    const themes = [
        'hypercube',
        'tetrahedron', 
        'sphere',
        'torus',
        'klein',
        'fractal',
        'wave',
        'crystal'
    ];
    return themes[geometryIndex] || 'hypercube';
}

function updateVisualizersForFace(faceIndex, cardVisualizers) {
    console.log(`🎯 Updating visualizers for face ${faceIndex}`);
    
    // Map face index to content theme
    const faceThemes = {
        0: { masterKey: 1.0, intensity: 1.0 },    // Home
        1: { masterKey: 0.8, intensity: 0.9 },    // Tech
        2: { masterKey: 1.2, intensity: 1.1 },    // Media
        3: { masterKey: 0.9, intensity: 0.8 },    // Audio
        4: { masterKey: 1.1, intensity: 1.0 },    // Community
        5: { masterKey: 1.3, intensity: 1.2 },    // Innovation
        6: { masterKey: 0.7, intensity: 0.85 },   // Research
        7: { masterKey: 1.0, intensity: 0.95 }    // Context
    };
    
    const theme = faceThemes[faceIndex] || faceThemes[0];
    
    cardVisualizers.forEach(({ visualizer, card }, index) => {
        if (visualizer) {
            // Update master key and intensity based on face
            visualizer.options.masterKey = theme.masterKey;
            visualizer.editorParams.intensity = theme.intensity;
            
            // Update geometry for specific cards on face change
            if (faceIndex !== 0 && index === 0) {
                // Main card changes geometry with face
                visualizer.updateGeometry(faceIndex);
            }
            
            // Adjust card opacity based on face
            const cardContent = card.querySelector('.card-content');
            if (cardContent) {
                cardContent.style.transition = 'opacity 0.8s ease';
                cardContent.style.opacity = faceIndex === 0 ? '0.9' : '0.7';
            }
        }
    });
}

function addCardInteractions(cardVisualizers) {
    cardVisualizers.forEach(({ card, visualizer }) => {
        // Hover effects
        card.addEventListener('mouseenter', () => {
            if (visualizer) {
                visualizer.editorParams.scale = 1.2;
                visualizer.editorParams.intensity = 1.2;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (visualizer) {
                visualizer.editorParams.scale = 1.0;
                visualizer.editorParams.intensity = 1.0;
            }
        });
        
        // Click effects
        card.addEventListener('click', () => {
            if (visualizer) {
                // Pulse effect
                const originalIntensity = visualizer.editorParams.intensity;
                visualizer.editorParams.intensity = 2.0;
                visualizer.editorParams.crystallization = 1.0;
                
                setTimeout(() => {
                    visualizer.editorParams.intensity = originalIntensity;
                    visualizer.editorParams.crystallization = 0.6;
                }, 300);
            }
        });
    });
}

// Add styles for adaptive visualizers
const style = document.createElement('style');
style.textContent = `
    .adaptive-visualizer-container {
        z-index: 1;
        mix-blend-mode: screen;
    }
    
    .vib34d-adaptive-canvas {
        width: 100% !important;
        height: 100% !important;
        image-rendering: optimizeQuality;
    }
    
    .blog-card:hover .adaptive-visualizer-container {
        mix-blend-mode: color-dodge;
    }
    
    /* Geometry-specific styles */
    .geometry-0 { filter: hue-rotate(0deg); }
    .geometry-1 { filter: hue-rotate(45deg); }
    .geometry-2 { filter: hue-rotate(90deg); }
    .geometry-3 { filter: hue-rotate(135deg); }
    .geometry-4 { filter: hue-rotate(180deg); }
    .geometry-5 { filter: hue-rotate(225deg); }
    .geometry-6 { filter: hue-rotate(270deg); }
    .geometry-7 { filter: hue-rotate(315deg); }
`;
document.head.appendChild(style);

console.log('🎴 VIB34D Adaptive Integration System Ready');