/**
 * VIB3 ENHANCED INTERACTION SYSTEM
 * Adds comprehensive visual feedback, UI discoverability, and enhanced navigation
 * Integrates seamlessly with existing VIB3HomeMaster and UnifiedReactivityBridge
 */

class VIB3EnhancedInteractionSystem {
    constructor(homeMaster, reactivityBridge) {
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        
        // Configuration
        this.config = {
            // Visual feedback settings
            feedback: {
                enabled: true,
                intensity: 0.8,
                hapticStrength: 0.6,
                cursorChanges: true,
                hoverEffects: true
            },
            
            // UI discovery settings
            discovery: {
                showHints: true,
                animateEdges: true,
                tutorialMode: false,
                breadcrumbs: true,
                navigationMenu: true
            },
            
            // Interaction settings
            interaction: {
                dragThreshold: 50,
                momentumEnabled: true,
                previewTransitions: true,
                multiTouch: true,
                smartSensitivity: true
            },
            
            // Accessibility
            accessibility: {
                reducedMotion: false,
                highContrast: false,
                keyboardNav: true,
                screenReader: true
            }
        };
        
        // State tracking
        this.state = {
            isHovering: false,
            isDragging: false,
            dragDirection: null,
            tension: 0,
            lastInteraction: Date.now(),
            currentFace: 0,
            hoverZone: null
        };
        
        // UI elements
        this.uiElements = {
            edgeIndicators: [],
            navigationMenu: null,
            breadcrumbs: null,
            tutorialOverlay: null,
            feedbackLayer: null
        };
        
        this.init();
    }
    
    init() {
        console.log('🎮 Initializing VIB3 Enhanced Interaction System...');
        
        // Create UI elements
        this.createFeedbackLayer();
        this.createEdgeIndicators();
        this.createNavigationMenu();
        this.createBreadcrumbs();
        this.createTutorialOverlay();
        
        // Setup event listeners
        this.setupEnhancedEventListeners();
        
        // Initialize visual feedback
        this.initializeVisualFeedback();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        console.log('✅ VIB3 Enhanced Interaction System initialized');
    }
    
    createFeedbackLayer() {
        // Create overlay for visual feedback effects
        this.uiElements.feedbackLayer = document.createElement('div');
        this.uiElements.feedbackLayer.className = 'vib3-feedback-layer';
        this.uiElements.feedbackLayer.innerHTML = `
            <div class="tension-meter">
                <div class="tension-bar"></div>
                <div class="tension-label">Tension</div>
            </div>
            <div class="direction-indicator">
                <div class="arrow arrow-up">↑</div>
                <div class="arrow arrow-down">↓</div>
                <div class="arrow arrow-left">←</div>
                <div class="arrow arrow-right">→</div>
            </div>
            <div class="transition-preview"></div>
        `;
        document.body.appendChild(this.uiElements.feedbackLayer);
    }
    
    createEdgeIndicators() {
        // Create edge zone indicators for drag areas
        const edges = ['top', 'bottom', 'left', 'right'];
        
        edges.forEach(edge => {
            const indicator = document.createElement('div');
            indicator.className = `vib3-edge-indicator edge-${edge}`;
            indicator.innerHTML = `
                <div class="edge-glow"></div>
                <div class="edge-hint">${this.getEdgeHintText(edge)}</div>
                <div class="edge-particles"></div>
            `;
            
            // Add hover detection
            indicator.addEventListener('mouseenter', () => this.handleEdgeHover(edge, true));
            indicator.addEventListener('mouseleave', () => this.handleEdgeHover(edge, false));
            
            this.uiElements.edgeIndicators.push(indicator);
            document.body.appendChild(indicator);
        });
    }
    
    createNavigationMenu() {
        // Create backup navigation menu
        this.uiElements.navigationMenu = document.createElement('div');
        this.uiElements.navigationMenu.className = 'vib3-navigation-menu';
        this.uiElements.navigationMenu.innerHTML = `
            <div class="nav-header">
                <span class="nav-title">Navigate</span>
                <button class="nav-toggle">☰</button>
            </div>
            <div class="nav-faces">
                <button class="nav-face" data-face="0">
                    <div class="face-icon">🏠</div>
                    <div class="face-name">HOME</div>
                </button>
                <button class="nav-face" data-face="1">
                    <div class="face-icon">⚡</div>
                    <div class="face-name">TECH</div>
                </button>
                <button class="nav-face" data-face="2">
                    <div class="face-icon">🔬</div>
                    <div class="face-name">RESEARCH</div>
                </button>
                <button class="nav-face" data-face="3">
                    <div class="face-icon">🎬</div>
                    <div class="face-name">MEDIA</div>
                </button>
                <button class="nav-face" data-face="4">
                    <div class="face-icon">🚀</div>
                    <div class="face-name">INNOVATION</div>
                </button>
            </div>
        `;
        
        // Add navigation event listeners
        this.uiElements.navigationMenu.addEventListener('click', (e) => {
            if (e.target.closest('.nav-face')) {
                const face = parseInt(e.target.closest('.nav-face').dataset.face);
                this.navigateToFace(face);
            }
            if (e.target.closest('.nav-toggle')) {
                this.toggleNavigationMenu();
            }
        });
        
        document.body.appendChild(this.uiElements.navigationMenu);
    }
    
    createBreadcrumbs() {
        // Create breadcrumb navigation
        this.uiElements.breadcrumbs = document.createElement('div');
        this.uiElements.breadcrumbs.className = 'vib3-breadcrumbs';
        this.updateBreadcrumbs();
        document.body.appendChild(this.uiElements.breadcrumbs);
    }
    
    createTutorialOverlay() {
        // Create tutorial/onboarding overlay
        this.uiElements.tutorialOverlay = document.createElement('div');
        this.uiElements.tutorialOverlay.className = 'vib3-tutorial-overlay hidden';
        this.uiElements.tutorialOverlay.innerHTML = `
            <div class="tutorial-content">
                <h2>Welcome to VIB3 Hypercube Navigation</h2>
                <div class="tutorial-step active" data-step="1">
                    <h3>Step 1: Drag from Edges</h3>
                    <p>Drag from the edges of the screen to navigate between faces:</p>
                    <ul>
                        <li>↑ Top edge: RESEARCH</li>
                        <li>↓ Bottom edge: HOME</li>
                        <li>← Left edge: TECH</li>
                        <li>→ Right edge: MEDIA</li>
                    </ul>
                </div>
                <div class="tutorial-step" data-step="2">
                    <h3>Step 2: Watch the Visual Feedback</h3>
                    <p>Notice the tension meter and direction indicators as you drag.</p>
                </div>
                <div class="tutorial-step" data-step="3">
                    <h3>Step 3: Use Alternative Navigation</h3>
                    <p>Use the navigation menu or breadcrumbs for direct access.</p>
                </div>
                <div class="tutorial-controls">
                    <button class="tutorial-prev">Previous</button>
                    <button class="tutorial-next">Next</button>
                    <button class="tutorial-skip">Skip Tutorial</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.uiElements.tutorialOverlay);
        
        // Show tutorial on first visit
        if (!localStorage.getItem('vib3-tutorial-completed')) {
            this.showTutorial();
        }
    }
    
    setupEnhancedEventListeners() {
        // Enhanced mouse/touch event handling
        document.addEventListener('mousemove', (e) => this.handleEnhancedMouseMove(e));
        document.addEventListener('touchmove', (e) => this.handleEnhancedTouchMove(e));
        
        // Drag detection with enhanced feedback
        let dragStart = null;
        let dragCurrent = null;
        
        const startDrag = (x, y) => {
            dragStart = { x, y };
            this.state.isDragging = true;
            this.showDragFeedback();
        };
        
        const updateDrag = (x, y) => {
            if (!dragStart) return;
            
            dragCurrent = { x, y };
            const deltaX = x - dragStart.x;
            const deltaY = y - dragStart.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Update tension meter
            this.state.tension = Math.min(distance / this.config.interaction.dragThreshold, 1);
            this.updateTensionMeter(this.state.tension);
            
            // Determine direction
            if (distance > 20) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.state.dragDirection = deltaX > 0 ? 'right' : 'left';
                } else {
                    this.state.dragDirection = deltaY > 0 ? 'down' : 'up';
                }
                this.updateDirectionIndicator(this.state.dragDirection);
            }
            
            // Show transition preview
            if (this.config.interaction.previewTransitions && this.state.tension > 0.3) {
                this.showTransitionPreview();
            }
        };
        
        const endDrag = () => {
            if (this.state.tension > 0.7 && this.state.dragDirection) {
                this.triggerNavigation(this.state.dragDirection);
            }
            this.resetDragState();
        };
        
        // Mouse events
        document.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        document.addEventListener('mousemove', (e) => updateDrag(e.clientX, e.clientY));
        document.addEventListener('mouseup', () => endDrag());
        
        // Touch events
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                startDrag(touch.clientX, touch.clientY);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                updateDrag(touch.clientX, touch.clientY);
            }
        });
        
        document.addEventListener('touchend', () => endDrag());
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.config.accessibility.keyboardNav) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateToFace(2); // RESEARCH
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateToFace(0); // HOME
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateToFace(1); // TECH
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateToFace(3); // MEDIA
                    break;
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
                case '?':
                case 'h':
                    this.showTutorial();
                    break;
                case 'Escape':
                    this.hideTutorial();
                    break;
            }
        });
    }
    
    initializeVisualFeedback() {
        // Add CSS for visual feedback
        const style = document.createElement('style');
        style.textContent = `
            .vib3-feedback-layer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999;
            }
            
            .tension-meter {
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .tension-meter.active {
                opacity: 1;
            }
            
            .tension-bar {
                width: 4px;
                height: 200px;
                background: rgba(0, 255, 255, 0.2);
                border: 1px solid #00ffff;
                position: relative;
                overflow: hidden;
            }
            
            .tension-bar::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 0%;
                background: linear-gradient(to top, #ff0080, #00ffff);
                transition: height 0.1s ease;
            }
            
            .tension-label {
                color: #00ffff;
                font-size: 0.7rem;
                text-align: center;
                margin-top: 5px;
            }
            
            .direction-indicator {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .direction-indicator.active {
                opacity: 1;
            }
            
            .arrow {
                position: absolute;
                font-size: 2rem;
                color: #00ffff;
                opacity: 0.3;
                transition: all 0.3s ease;
            }
            
            .arrow.active {
                opacity: 1;
                transform: scale(1.5);
                text-shadow: 0 0 20px #00ffff;
            }
            
            .arrow-up { top: -40px; left: 50%; transform: translateX(-50%); }
            .arrow-down { bottom: -40px; left: 50%; transform: translateX(-50%); }
            .arrow-left { left: -40px; top: 50%; transform: translateY(-50%); }
            .arrow-right { right: -40px; top: 50%; transform: translateY(-50%); }
            
            .vib3-edge-indicator {
                position: fixed;
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: none;
            }
            
            .edge-top {
                top: 0;
                left: 0;
                width: 100%;
                height: 50px;
                background: linear-gradient(to bottom, rgba(0, 255, 255, 0.1), transparent);
                border-bottom: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .edge-bottom {
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50px;
                background: linear-gradient(to top, rgba(0, 255, 255, 0.1), transparent);
                border-top: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .edge-left {
                left: 0;
                top: 0;
                width: 50px;
                height: 100%;
                background: linear-gradient(to right, rgba(0, 255, 255, 0.1), transparent);
                border-right: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .edge-right {
                right: 0;
                top: 0;
                width: 50px;
                height: 100%;
                background: linear-gradient(to left, rgba(0, 255, 255, 0.1), transparent);
                border-left: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .vib3-edge-indicator.hint {
                opacity: 0.6;
                animation: pulse 2s infinite;
            }
            
            .edge-hint {
                position: absolute;
                color: #00ffff;
                font-size: 0.8rem;
                font-weight: bold;
                text-shadow: 0 0 10px #00ffff;
            }
            
            .edge-top .edge-hint {
                top: 15px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .edge-bottom .edge-hint {
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .edge-left .edge-hint {
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                writing-mode: vertical-rl;
            }
            
            .edge-right .edge-hint {
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                writing-mode: vertical-lr;
            }
            
            .vib3-navigation-menu {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #00ffff;
                border-radius: 10px;
                padding: 15px;
                z-index: 1000;
                transition: transform 0.3s ease;
            }
            
            .vib3-navigation-menu.collapsed {
                transform: translateX(calc(100% - 40px));
            }
            
            .nav-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .nav-title {
                color: #00ffff;
                font-weight: bold;
            }
            
            .nav-toggle {
                background: none;
                border: none;
                color: #00ffff;
                cursor: pointer;
                font-size: 1.2rem;
            }
            
            .nav-faces {
                display: grid;
                gap: 8px;
            }
            
            .nav-face {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 5px;
                padding: 8px 12px;
                color: #00ffff;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .nav-face:hover {
                background: rgba(0, 255, 255, 0.2);
                transform: translateX(5px);
            }
            
            .nav-face.active {
                background: rgba(0, 255, 255, 0.3);
                border-color: #00ffff;
            }
            
            .vib3-breadcrumbs {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                z-index: 1000;
            }
            
            .breadcrumb {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(0, 255, 255, 0.3);
                border: 2px solid rgba(0, 255, 255, 0.5);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .breadcrumb.active {
                background: #00ffff;
                transform: scale(1.3);
                box-shadow: 0 0 15px #00ffff;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
            
            @keyframes ripple {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(2); opacity: 0; }
            }
            
            .vib3-tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.3s ease;
            }
            
            .vib3-tutorial-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .tutorial-content {
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #00ffff;
                border-radius: 15px;
                padding: 30px;
                max-width: 600px;
                color: #00ffff;
            }
            
            .tutorial-step {
                display: none;
            }
            
            .tutorial-step.active {
                display: block;
            }
            
            .tutorial-controls {
                margin-top: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            .tutorial-controls button {
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid #00ffff;
                color: #00ffff;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .tutorial-controls button:hover {
                background: rgba(0, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Event handlers
    handleEnhancedMouseMove(e) {
        if (!this.config.feedback.cursorChanges) return;
        
        const edge = this.detectEdgeZone(e.clientX, e.clientY);
        if (edge) {
            document.body.style.cursor = 'grab';
            this.state.hoverZone = edge;
        } else {
            document.body.style.cursor = 'crosshair';
            this.state.hoverZone = null;
        }
        
        // Show edge hints on hover
        if (this.config.discovery.showHints) {
            this.updateEdgeHints();
        }
    }
    
    handleEnhancedTouchMove(e) {
        // Enhanced touch handling
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.handleEnhancedMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }
    
    handleEdgeHover(edge, isHovering) {
        const indicator = this.uiElements.edgeIndicators.find(el => el.classList.contains(`edge-${edge}`));
        if (!indicator) return;
        
        if (isHovering) {
            indicator.classList.add('hover');
            this.showEdgeHint(edge);
        } else {
            indicator.classList.remove('hover');
        }
    }
    
    // Visual feedback methods
    showDragFeedback() {
        const tensionMeter = document.querySelector('.tension-meter');
        const directionIndicator = document.querySelector('.direction-indicator');
        
        if (tensionMeter) tensionMeter.classList.add('active');
        if (directionIndicator) directionIndicator.classList.add('active');
    }
    
    updateTensionMeter(tension) {
        const tensionBar = document.querySelector('.tension-bar');
        if (tensionBar) {
            const after = tensionBar.querySelector('::after') || tensionBar;
            after.style.setProperty('--tension', `${tension * 100}%`);
        }
    }
    
    updateDirectionIndicator(direction) {
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => arrow.classList.remove('active'));
        
        const activeArrow = document.querySelector(`.arrow-${direction}`);
        if (activeArrow) activeArrow.classList.add('active');
    }
    
    showTransitionPreview() {
        // Implementation for transition preview
        if (this.reactivityBridge) {
            this.reactivityBridge.triggerEffect('preview-transition', {
                direction: this.state.dragDirection,
                intensity: this.state.tension
            });
        }
    }
    
    resetDragState() {
        this.state.isDragging = false;
        this.state.dragDirection = null;
        this.state.tension = 0;
        
        const tensionMeter = document.querySelector('.tension-meter');
        const directionIndicator = document.querySelector('.direction-indicator');
        
        if (tensionMeter) tensionMeter.classList.remove('active');
        if (directionIndicator) directionIndicator.classList.remove('active');
    }
    
    // Navigation methods
    triggerNavigation(direction) {
        const directionMap = {
            'up': 2,    // RESEARCH
            'down': 0,  // HOME
            'left': 1,  // TECH
            'right': 3  // MEDIA
        };
        
        const targetFace = directionMap[direction];
        if (targetFace !== undefined) {
            this.navigateToFace(targetFace);
        }
    }
    
    navigateToFace(faceIndex) {
        console.log(`🎮 Enhanced navigation to face ${faceIndex}`);
        
        // Add haptic feedback
        this.triggerHapticFeedback();
        
        // Update state
        this.state.currentFace = faceIndex;
        this.state.lastInteraction = Date.now();
        
        // Trigger navigation through existing system
        if (window.loadFace) {
            window.loadFace(faceIndex);
        }
        
        // Update UI
        this.updateBreadcrumbs();
        this.updateNavigationMenu();
        
        // Register with VIB3 systems
        if (this.homeMaster) {
            this.homeMaster.registerInteraction('enhancedNavigation', 1.0, 800);
        }
    }
    
    // Utility methods
    detectEdgeZone(x, y) {
        const threshold = 100;
        const { innerWidth, innerHeight } = window;
        
        if (y < threshold) return 'top';
        if (y > innerHeight - threshold) return 'bottom';
        if (x < threshold) return 'left';
        if (x > innerWidth - threshold) return 'right';
        
        return null;
    }
    
    getEdgeHintText(edge) {
        const hints = {
            'top': '↑ RESEARCH',
            'bottom': '↓ HOME',
            'left': '← TECH',
            'right': '→ MEDIA'
        };
        return hints[edge] || '';
    }
    
    updateEdgeHints() {
        this.uiElements.edgeIndicators.forEach(indicator => {
            if (this.state.hoverZone && indicator.classList.contains(`edge-${this.state.hoverZone}`)) {
                indicator.classList.add('hint');
            } else {
                indicator.classList.remove('hint');
            }
        });
    }
    
    updateBreadcrumbs() {
        if (!this.uiElements.breadcrumbs) return;
        
        const faces = ['HOME', 'TECH', 'RESEARCH', 'MEDIA', 'INNOVATION'];
        this.uiElements.breadcrumbs.innerHTML = faces.map((face, index) => 
            `<div class="breadcrumb ${index === this.state.currentFace ? 'active' : ''}" 
                  data-face="${index}" title="${face}"></div>`
        ).join('');
        
        // Add click handlers
        this.uiElements.breadcrumbs.addEventListener('click', (e) => {
            if (e.target.classList.contains('breadcrumb')) {
                const face = parseInt(e.target.dataset.face);
                this.navigateToFace(face);
            }
        });
    }
    
    updateNavigationMenu() {
        const faces = this.uiElements.navigationMenu.querySelectorAll('.nav-face');
        faces.forEach((face, index) => {
            face.classList.toggle('active', index === this.state.currentFace);
        });
    }
    
    toggleNavigationMenu() {
        this.uiElements.navigationMenu.classList.toggle('collapsed');
    }
    
    triggerHapticFeedback() {
        if (navigator.vibrate && this.config.feedback.hapticStrength > 0) {
            navigator.vibrate(Math.floor(this.config.feedback.hapticStrength * 100));
        }
    }
    
    // Tutorial methods
    showTutorial() {
        this.uiElements.tutorialOverlay.classList.remove('hidden');
        this.config.discovery.tutorialMode = true;
    }
    
    hideTutorial() {
        this.uiElements.tutorialOverlay.classList.add('hidden');
        this.config.discovery.tutorialMode = false;
        localStorage.setItem('vib3-tutorial-completed', 'true');
    }
    
    // Accessibility methods
    handleTabNavigation(e) {
        // Implementation for tab navigation
    }
    
    handleActivation(e) {
        // Implementation for enter/space activation
    }
    
    // Configuration methods
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        this.applyConfigChanges();
    }
    
    applyConfigChanges() {
        // Apply configuration changes to UI elements
        if (!this.config.discovery.showHints) {
            this.uiElements.edgeIndicators.forEach(indicator => {
                indicator.classList.remove('hint');
            });
        }
        
        if (!this.config.discovery.navigationMenu) {
            this.uiElements.navigationMenu.style.display = 'none';
        }
        
        if (!this.config.discovery.breadcrumbs) {
            this.uiElements.breadcrumbs.style.display = 'none';
        }
    }
}

// Auto-initialize when DOM is ready and VIB3 systems are available
document.addEventListener('DOMContentLoaded', () => {
    // Wait for VIB3 systems to be ready
    const initEnhancedSystem = () => {
        if (window.homeMaster && window.reactivityBridge) {
            window.enhancedInteractionSystem = new VIB3EnhancedInteractionSystem(
                window.homeMaster,
                window.reactivityBridge
            );
            console.log('✅ VIB3 Enhanced Interaction System ready');
        } else {
            setTimeout(initEnhancedSystem, 100);
        }
    };
    
    initEnhancedSystem();
});