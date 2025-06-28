/**
 * VIB34DCanvasPool.js - Smart Canvas Pool Management
 * 
 * Manages 5-7 persistent WebGL canvas instances that dynamically change
 * content based on hypercube face and interaction state.
 * 
 * Architecture:
 * - 1 Primary Background Canvas (fullscreen reactive background)
 * - 4 Dynamic Content Canvases (reused for visible cards)
 * - 1 Navigation Canvas (bezel/UI overlays)
 * - 1 Effects Canvas (particles, transitions, highlights)
 * 
 * Total: 7 persistent canvases maximum
 */

import ReactiveHyperAVCore from './ReactiveHyperAVCore.js';

class VIB34DCanvasPool {
    constructor(homeMaster, reactivityBridge) {
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        
        // Pool configuration
        this.poolSize = 7;
        this.canvasPool = new Map();
        this.activeAssignments = new Map();
        this.contentQueue = [];
        
        // Canvas roles
        this.canvasRoles = {
            BACKGROUND: 'background',    // 1x - Fullscreen reactive background
            CONTENT_A: 'content_a',      // 4x - Dynamic content canvases
            CONTENT_B: 'content_b',
            CONTENT_C: 'content_c', 
            CONTENT_D: 'content_d',
            NAVIGATION: 'navigation',    // 1x - Bezel/UI overlays
            EFFECTS: 'effects'           // 1x - Particles, transitions
        };
        
        // Current state tracking
        this.currentFace = 0;
        this.visibleCards = [];
        this.pendingTransitions = [];
        
        console.log('🎨 VIB34DCanvasPool initialized with smart pooling architecture');
    }
    
    async initialize() {
        console.log('🚀 Initializing VIB34D Canvas Pool System...');
        
        try {
            // Create persistent canvas pool
            await this.createCanvasPool();
            
            // Set up dynamic content management
            this.setupContentManagement();
            
            // Initialize with home face
            await this.loadFaceContent(0);
            
            console.log(`✅ Canvas Pool initialized: ${this.canvasPool.size} persistent canvases`);
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize canvas pool:', error);
            throw error;
        }
    }
    
    async createCanvasPool() {
        const roles = Object.values(this.canvasRoles);
        
        for (const role of roles) {
            try {
                // Find or create canvas for this role
                let canvas = document.getElementById(`pool-canvas-${role}`);
                
                if (!canvas) {
                    // Create canvas if it doesn't exist
                    canvas = this.createPoolCanvas(role);
                }
                
                // Initialize ReactiveHyperAVCore for this canvas
                const visualizer = new ReactiveHyperAVCore(canvas, {
                    role: role,
                    currentTheme: 'hypercube',
                    currentGeometry: this.getGeometryForRole(role)
                });
                
                // Load configurations
                if (this.homeMaster.visualsConfig) {
                    visualizer.loadVisualConfiguration(this.homeMaster.visualsConfig);
                }
                if (this.homeMaster.behaviorConfig) {
                    visualizer.loadBehaviorConfiguration(this.homeMaster.behaviorConfig);
                }
                
                this.canvasPool.set(role, {
                    canvas: canvas,
                    visualizer: visualizer,
                    role: role,
                    currentContent: null,
                    isActive: role === this.canvasRoles.BACKGROUND, // Background always active
                    lastUpdate: Date.now()
                });
                
                console.log(`✅ Created pool canvas: ${role}`);
                
            } catch (error) {
                console.error(`❌ Failed to create canvas for role ${role}:`, error);
                
                // Create fallback 2D canvas
                const canvas = this.createPoolCanvas(role);
                this.canvasPool.set(role, {
                    canvas: canvas,
                    visualizer: null,
                    role: role,
                    currentContent: null,
                    isActive: false,
                    fallback2D: true
                });
            }
        }
    }
    
    setupContentManagement() {
        console.log('🔧 Setting up dynamic content management system...');
        
        // Initialize content tracking
        this.contentQueue = [];
        this.activeAssignments = new Map();
        
        // Set up resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Set up intersection observer for canvas visibility
        if (window.IntersectionObserver) {
            this.visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const canvasId = entry.target.id;
                    const canvasData = Array.from(this.canvasPool.values())
                        .find(data => data.canvas.id === canvasId);
                    
                    if (canvasData && canvasData.visualizer) {
                        if (entry.isIntersecting) {
                            canvasData.visualizer.resume();
                        } else {
                            canvasData.visualizer.pause();
                        }
                    }
                });
            });
            
            // Observe all pool canvases
            for (const canvasData of this.canvasPool.values()) {
                this.visibilityObserver.observe(canvasData.canvas);
            }
        }
        
        console.log('✅ Content management system ready');
    }
    
    handleResize() {
        for (const [role, canvasData] of this.canvasPool) {
            if (role === 'background' || role === 'navigation' || role === 'effects') {
                // Fullscreen canvases
                canvasData.canvas.width = window.innerWidth;
                canvasData.canvas.height = window.innerHeight;
            }
            
            if (canvasData.visualizer) {
                canvasData.visualizer.resize();
            }
        }
    }
    
    createPoolCanvas(role) {
        const canvas = document.createElement('canvas');
        canvas.id = `pool-canvas-${role}`;
        canvas.className = `vib34d-pool-canvas pool-canvas-${role}`;
        
        // Set canvas properties based on role
        switch (role) {
            case this.canvasRoles.BACKGROUND:
                canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1;
                    pointer-events: none;
                `;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                break;
                
            case this.canvasRoles.NAVIGATION:
                canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 100;
                    pointer-events: none;
                `;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                break;
                
            case this.canvasRoles.EFFECTS:
                canvas.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 50;
                    pointer-events: none;
                `;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                break;
                
            default:
                // Content canvases - positioned dynamically
                canvas.style.cssText = `
                    position: absolute;
                    width: 300px;
                    height: 200px;
                    z-index: 10;
                    border-radius: 8px;
                    opacity: 0;
                    transition: all 0.3s ease;
                `;
                canvas.width = 300;
                canvas.height = 200;
                break;
        }
        
        // Add to DOM
        document.body.appendChild(canvas);
        
        return canvas;
    }
    
    async loadFaceContent(faceIndex) {
        console.log(`🔄 Loading content for face ${faceIndex}...`);
        
        this.currentFace = faceIndex;
        
        // Get face configuration
        const faceConfig = this.getFaceConfiguration(faceIndex);
        
        // Update background canvas
        await this.updateBackgroundCanvas(faceConfig);
        
        // Get visible cards for this face
        const visibleCards = this.getVisibleCardsForFace(faceIndex);
        this.visibleCards = visibleCards;
        
        // Assign content canvases to visible cards
        await this.assignContentCanvases(visibleCards);
        
        // Update navigation canvas
        await this.updateNavigationCanvas(faceConfig);
        
        console.log(`✅ Face ${faceIndex} content loaded with ${visibleCards.length} visible cards`);
    }
    
    async updateBackgroundCanvas(faceConfig) {
        const bgCanvas = this.canvasPool.get(this.canvasRoles.BACKGROUND);
        if (!bgCanvas || !bgCanvas.visualizer) return;
        
        // Update theme and geometry based on face
        bgCanvas.visualizer.setTheme(faceConfig.theme);
        bgCanvas.visualizer.setGeometry(faceConfig.backgroundGeometry);
        
        // Apply face-specific parameters
        const bgParams = this.homeMaster.getInstanceParameters(this.currentFace, 'background');
        bgCanvas.visualizer.updateParameters(bgParams);
        
        bgCanvas.currentContent = `face-${this.currentFace}-background`;
        bgCanvas.lastUpdate = Date.now();
    }
    
    async assignContentCanvases(visibleCards) {
        const contentRoles = [
            this.canvasRoles.CONTENT_A,
            this.canvasRoles.CONTENT_B, 
            this.canvasRoles.CONTENT_C,
            this.canvasRoles.CONTENT_D
        ];
        
        // Clear previous assignments
        for (const role of contentRoles) {
            const canvas = this.canvasPool.get(role);
            if (canvas) {
                canvas.canvas.style.opacity = '0';
                canvas.isActive = false;
                canvas.currentContent = null;
            }
        }
        
        // Assign canvases to visible cards (max 4)
        const cardsToShow = visibleCards.slice(0, 4);
        
        for (let i = 0; i < cardsToShow.length; i++) {
            const card = cardsToShow[i];
            const canvasRole = contentRoles[i];
            const canvas = this.canvasPool.get(canvasRole);
            
            if (canvas && canvas.visualizer) {
                // Position canvas over the card
                await this.positionCanvasOverCard(canvas, card);
                
                // Update content
                canvas.visualizer.setTheme(card.theme);
                canvas.visualizer.setGeometry(card.geometry);
                
                const cardParams = this.homeMaster.getInstanceParameters(this.currentFace, card.role);
                canvas.visualizer.updateParameters(cardParams);
                
                canvas.currentContent = card.id;
                canvas.isActive = true;
                canvas.lastUpdate = Date.now();
                
                // Show canvas
                canvas.canvas.style.opacity = '1';
                
                console.log(`📍 Assigned ${canvasRole} to card ${card.id}`);
            }
        }
    }
    
    async positionCanvasOverCard(canvasData, card) {
        const cardElement = document.getElementById(card.elementId);
        if (!cardElement) return;
        
        const rect = cardElement.getBoundingClientRect();
        const canvas = canvasData.canvas;
        
        canvas.style.left = `${rect.left}px`;
        canvas.style.top = `${rect.top}px`;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Resize the visualizer
        if (canvasData.visualizer) {
            canvasData.visualizer.resize();
        }
    }
    
    getFaceConfiguration(faceIndex) {
        const faceConfigs = [
            { name: 'HOME', theme: 'hypercube', backgroundGeometry: 'hypercube' },
            { name: 'TECH', theme: 'tetrahedron', backgroundGeometry: 'tetrahedron' },
            { name: 'MEDIA', theme: 'sphere', backgroundGeometry: 'sphere' },
            { name: 'AUDIO', theme: 'torus', backgroundGeometry: 'torus' },
            { name: 'QUANTUM', theme: 'kleinbottle', backgroundGeometry: 'kleinbottle' },
            { name: 'CONTEXT', theme: 'crystal', backgroundGeometry: 'crystal' },
            { name: 'INNOVATION', theme: 'fractal', backgroundGeometry: 'fractal' },
            { name: 'RESEARCH', theme: 'wave', backgroundGeometry: 'wave' }
        ];
        
        return faceConfigs[faceIndex] || faceConfigs[0];
    }
    
    getVisibleCardsForFace(faceIndex) {
        // Define cards for each face (max 4 visible at once)
        const faceCards = {
            0: [ // HOME
                { id: 'home-card-1', elementId: 'blog-card-1-home', theme: 'hypercube', geometry: 'hypercube', role: 'content' },
                { id: 'home-card-2', elementId: 'blog-card-2-home', theme: 'hypercube', geometry: 'tetrahedron', role: 'highlight' },
                { id: 'home-card-3', elementId: 'blog-card-3-home', theme: 'hypercube', geometry: 'sphere', role: 'accent' },
                { id: 'home-card-4', elementId: 'blog-card-4-home', theme: 'hypercube', geometry: 'torus', role: 'content' }
            ],
            1: [ // TECH
                { id: 'tech-card-1', elementId: 'blog-card-1-tech', theme: 'tetrahedron', geometry: 'tetrahedron', role: 'content' },
                { id: 'tech-card-2', elementId: 'blog-card-2-tech', theme: 'tetrahedron', geometry: 'hypercube', role: 'highlight' },
                { id: 'tech-card-3', elementId: 'blog-card-3-tech', theme: 'tetrahedron', geometry: 'fractal', role: 'accent' },
                { id: 'tech-card-4', elementId: 'blog-card-4-tech', theme: 'tetrahedron', geometry: 'crystal', role: 'content' }
            ],
            2: [ // MEDIA
                { id: 'media-card-1', elementId: 'blog-card-1-media', theme: 'sphere', geometry: 'sphere', role: 'content' },
                { id: 'media-card-2', elementId: 'blog-card-2-media', theme: 'sphere', geometry: 'wave', role: 'highlight' },
                { id: 'media-card-3', elementId: 'blog-card-3-media', theme: 'sphere', geometry: 'torus', role: 'accent' },
                { id: 'media-card-4', elementId: 'blog-card-4-media', theme: 'sphere', geometry: 'kleinbottle', role: 'content' }
            ],
            3: [ // AUDIO
                { id: 'audio-card-1', elementId: 'blog-card-1-audio', theme: 'torus', geometry: 'torus', role: 'content' },
                { id: 'audio-card-2', elementId: 'blog-card-2-audio', theme: 'torus', geometry: 'wave', role: 'highlight' },
                { id: 'audio-card-3', elementId: 'blog-card-3-audio', theme: 'torus', geometry: 'sphere', role: 'accent' },
                { id: 'audio-card-4', elementId: 'blog-card-4-audio', theme: 'torus', geometry: 'fractal', role: 'content' }
            ],
            4: [ // QUANTUM
                { id: 'quantum-card-1', elementId: 'blog-card-1-quantum', theme: 'kleinbottle', geometry: 'kleinbottle', role: 'content' },
                { id: 'quantum-card-2', elementId: 'blog-card-2-quantum', theme: 'kleinbottle', geometry: 'hypercube', role: 'highlight' },
                { id: 'quantum-card-3', elementId: 'blog-card-3-quantum', theme: 'kleinbottle', geometry: 'fractal', role: 'accent' },
                { id: 'quantum-card-4', elementId: 'blog-card-4-quantum', theme: 'kleinbottle', geometry: 'wave', role: 'content' }
            ],
            5: [ // CONTEXT
                { id: 'context-card-1', elementId: 'blog-card-1-context', theme: 'crystal', geometry: 'crystal', role: 'content' },
                { id: 'context-card-2', elementId: 'blog-card-2-context', theme: 'crystal', geometry: 'sphere', role: 'highlight' },
                { id: 'context-card-3', elementId: 'blog-card-3-context', theme: 'crystal', geometry: 'tetrahedron', role: 'accent' }
            ],
            6: [ // INNOVATION
                { id: 'innovation-card-1', elementId: 'blog-card-1-innovation', theme: 'fractal', geometry: 'fractal', role: 'content' },
                { id: 'innovation-card-2', elementId: 'blog-card-2-innovation', theme: 'fractal', geometry: 'kleinbottle', role: 'highlight' },
                { id: 'innovation-card-3', elementId: 'blog-card-3-innovation', theme: 'fractal', geometry: 'hypercube', role: 'accent' }
            ],
            7: [ // RESEARCH
                { id: 'research-card-1', elementId: 'blog-card-1-research', theme: 'wave', geometry: 'wave', role: 'content' },
                { id: 'research-card-2', elementId: 'blog-card-2-research', theme: 'wave', geometry: 'torus', role: 'highlight' },
                { id: 'research-card-3', elementId: 'blog-card-3-research', theme: 'wave', geometry: 'sphere', role: 'accent' }
            ]
        };
        
        return faceCards[faceIndex] || [];
    }
    
    async updateNavigationCanvas(faceConfig) {
        const navCanvas = this.canvasPool.get(this.canvasRoles.NAVIGATION);
        if (!navCanvas || !navCanvas.visualizer) return;
        
        // Update navigation visualization
        navCanvas.visualizer.setTheme(faceConfig.theme);
        navCanvas.visualizer.setGeometry('crystal'); // Navigation uses crystal geometry
        
        const navParams = this.homeMaster.getInstanceParameters(this.currentFace, 'bezel');
        navCanvas.visualizer.updateParameters(navParams);
        
        navCanvas.currentContent = `face-${this.currentFace}-navigation`;
        navCanvas.lastUpdate = Date.now();
    }
    
    getGeometryForRole(role) {
        const geometryMap = {
            background: 'hypercube',
            content_a: 'tetrahedron',
            content_b: 'sphere', 
            content_c: 'torus',
            content_d: 'fractal',
            navigation: 'crystal',
            effects: 'wave'
        };
        
        return geometryMap[role] || 'hypercube';
    }
    
    async transitionToFace(newFaceIndex) {
        if (newFaceIndex === this.currentFace) return;
        
        console.log(`🔄 Transitioning from face ${this.currentFace} to ${newFaceIndex}...`);
        
        // Trigger transition effects
        const effectsCanvas = this.canvasPool.get(this.canvasRoles.EFFECTS);
        if (effectsCanvas && effectsCanvas.visualizer) {
            effectsCanvas.visualizer.updateInteractionState('transition', 1.0);
        }
        
        // Load new face content
        await this.loadFaceContent(newFaceIndex);
        
        console.log(`✅ Transition to face ${newFaceIndex} complete`);
    }
    
    getSystemState() {
        const poolState = {};
        
        for (const [role, canvas] of this.canvasPool) {
            poolState[role] = {
                isActive: canvas.isActive,
                currentContent: canvas.currentContent,
                lastUpdate: canvas.lastUpdate,
                hasVisualizer: !!canvas.visualizer,
                fallback2D: canvas.fallback2D || false
            };
        }
        
        return {
            poolSize: this.canvasPool.size,
            currentFace: this.currentFace,
            visibleCards: this.visibleCards.length,
            canvasStates: poolState
        };
    }
    
    dispose() {
        console.log('🧹 Disposing VIB34D Canvas Pool...');
        
        for (const [role, canvasData] of this.canvasPool) {
            if (canvasData.visualizer) {
                canvasData.visualizer.dispose();
            }
            
            if (canvasData.canvas && canvasData.canvas.parentNode) {
                canvasData.canvas.parentNode.removeChild(canvasData.canvas);
            }
        }
        
        this.canvasPool.clear();
        this.activeAssignments.clear();
        
        console.log('✅ Canvas Pool disposed');
    }
}

export default VIB34DCanvasPool;