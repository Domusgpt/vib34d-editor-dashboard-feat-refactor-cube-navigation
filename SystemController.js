class SystemController {
    constructor() {
        this.jsonConfigSystem = new JsonConfigSystem();
        this.homeMaster = null;
        this.visualizerPool = null;
        this.interactionCoordinator = null;
        this.geometryRegistry = null;
        this.eventBus = new EventTarget();
        this.isInitialized = false;
        this.currentState = null;
        this.layoutEngine = new LayoutEngine();
        this.activeVisualizers = new Map();
    }

    async initialize() {
        try {
            console.log('🚀 VIB34D System Initializing...');
            
            await this.jsonConfigSystem.loadAllConfigs();
            
            this.jsonConfigSystem.addEventListener('configLoaded', (event) => {
                this.onConfigsLoaded(event.detail);
            });
            
            const configs = this.jsonConfigSystem.configs;
            
            this.currentState = configs.stateMap?.initialState || 'home';
            
            this.layoutEngine.initialize(configs.layout);
            this.generateStaticLayout();
            this.applyBasicTheming(configs.visuals);
            
            await this.initializeVisualizerSystem(configs.visuals);
            await this.attachVisualizersToCards(configs.layout.cards, configs.visuals);
            
            this.isInitialized = true;
            console.log('✅ VIB34D System Initialized');
            
            this.eventBus.dispatchEvent(new CustomEvent('systemInitialized', {
                detail: { configs, currentState: this.currentState }
            }));
            
        } catch (error) {
            console.error('❌ System initialization failed:', error);
            throw error;
        }
    }

    onConfigsLoaded(configs) {
        console.log('📋 All configurations loaded:', Object.keys(configs));
    }

    generateStaticLayout() {
        const layoutConfig = this.jsonConfigSystem.getConfig('layout');
        if (!layoutConfig) {
            console.error('❌ No layout configuration found');
            return;
        }

        console.log('🏗️ Generating static layout...');
        
        this.setupMainGrid(layoutConfig.layout.grid);
        this.renderComponents(layoutConfig.components);
        this.renderCards(layoutConfig.cards);
        
        console.log('✅ Static layout generated');
    }

    setupMainGrid(gridConfig) {
        const container = document.getElementById('vib34d-container') || document.body;
        
        if (gridConfig) {
            container.style.display = 'grid';
            container.style.gridTemplateColumns = gridConfig.columns || '300px 1fr 300px';
            container.style.gridTemplateRows = gridConfig.rows || 'auto 1fr';
            container.style.gap = gridConfig.gap || '20px';
            container.style.height = '100vh';
            container.style.padding = gridConfig.padding || '20px';
        }
    }

    renderComponents(components) {
        if (!components || !Array.isArray(components)) return;
        
        components.forEach(component => {
            const element = this.createComponent(component);
            if (element) {
                this.appendToLayout(element, component.layoutArea);
            }
        });
    }

    renderCards(cards) {
        if (!cards || !Array.isArray(cards)) return;
        
        const cardsContainer = document.getElementById('cards-container') || this.createCardsContainer();
        
        cards.forEach(card => {
            const cardElement = this.createAdaptiveCard(card);
            if (cardElement) {
                cardsContainer.appendChild(cardElement);
            }
        });
    }

    createComponent(componentConfig) {
        const { id, type, layoutArea, ...props } = componentConfig;
        
        const element = document.createElement('div');
        element.id = id;
        element.className = `vib34d-component vib34d-${type.toLowerCase()}`;
        element.setAttribute('data-component-type', type);
        element.setAttribute('data-layout-area', layoutArea || 'auto');
        
        switch (type) {
            case 'NavContainer':
                this.setupNavContainer(element, props);
                break;
            case 'ParamSlider':
                this.setupParamSlider(element, props);
                break;
            default:
                console.warn(`Unknown component type: ${type}`);
        }
        
        return element;
    }

    createAdaptiveCard(cardConfig) {
        const { id, title, content, videoId, ...props } = cardConfig;
        
        const card = document.createElement('div');
        card.id = id;
        card.className = 'adaptive-card vib34d-micro-interactive';
        card.setAttribute('data-card-id', id);
        
        const canvas = document.createElement('canvas');
        canvas.className = 'card-visualizer';
        canvas.id = `${id}-visualizer`;
        canvas.width = 400;
        canvas.height = 300;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'card-content';
        
        if (title) {
            const titleElement = document.createElement('h3');
            titleElement.className = 'card-title';
            titleElement.textContent = title;
            contentDiv.appendChild(titleElement);
        }
        
        if (content) {
            const contentElement = document.createElement('div');
            contentElement.className = 'card-text';
            contentElement.innerHTML = content;
            contentDiv.appendChild(contentElement);
        }
        
        if (videoId) {
            const videoElement = document.createElement('div');
            videoElement.className = 'card-video';
            videoElement.setAttribute('data-video-id', videoId);
            contentDiv.appendChild(videoElement);
        }
        
        card.appendChild(canvas);
        card.appendChild(contentDiv);
        
        return card;
    }

    createCardsContainer() {
        const container = document.createElement('div');
        container.id = 'cards-container';
        container.className = 'vib34d-cards-grid';
        container.style.gridArea = 'main';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        container.style.gap = '20px';
        container.style.padding = '20px';
        
        const mainContainer = document.getElementById('vib34d-container') || document.body;
        mainContainer.appendChild(container);
        
        return container;
    }

    setupNavContainer(element, props) {
        element.innerHTML = `
            <nav class="vib34d-navigation">
                <div class="nav-brand">VIB34D</div>
                <div class="nav-controls">
                    <button class="nav-btn" data-action="navigate" data-target="home">Home</button>
                    <button class="nav-btn" data-action="navigate" data-target="tech">Tech</button>
                    <button class="nav-btn" data-action="navigate" data-target="media">Media</button>
                </div>
            </nav>
        `;
        
        if (props.layoutArea) {
            element.style.gridArea = props.layoutArea;
        }
    }

    setupParamSlider(element, props) {
        const { label, parameter, min = 0, max = 1, step = 0.01, defaultValue = 0.5 } = props;
        
        element.innerHTML = `
            <label class="param-slider-label">${label || parameter}</label>
            <input type="range" 
                   class="param-slider-input" 
                   min="${min}" 
                   max="${max}" 
                   step="${step}" 
                   value="${defaultValue}"
                   data-parameter="${parameter}">
            <span class="param-slider-value">${defaultValue}</span>
        `;
        
        const slider = element.querySelector('.param-slider-input');
        const valueDisplay = element.querySelector('.param-slider-value');
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
            this.eventBus.dispatchEvent(new CustomEvent('parameterUpdated', {
                detail: { param: parameter, value: parseFloat(e.target.value) }
            }));
        });
    }

    appendToLayout(element, layoutArea) {
        const container = document.getElementById('vib34d-container') || document.body;
        
        if (layoutArea) {
            element.style.gridArea = layoutArea;
        }
        
        container.appendChild(element);
    }

    applyBasicTheming(visualsConfig) {
        if (!visualsConfig || !visualsConfig.themes) return;
        
        console.log('🎨 Applying basic theming...');
        
        const defaultTheme = visualsConfig.themes.dark_matter || Object.values(visualsConfig.themes)[0];
        
        if (defaultTheme) {
            const root = document.documentElement;
            
            Object.entries(defaultTheme).forEach(([key, value]) => {
                const cssVar = `--vib34d-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                root.style.setProperty(cssVar, value);
            });
            
            document.body.style.backgroundColor = defaultTheme.background || '#000';
            document.body.style.color = defaultTheme.primary || '#FFF';
        }
        
        console.log('✅ Basic theming applied');
    }

    async initializeVisualizerSystem(visualsConfig) {
        console.log('🎭 Initializing visualizer system...');
        
        this.geometryRegistry = new GeometryRegistry();
        await this.geometryRegistry.initialize(visualsConfig);
        
        this.visualizerPool = new VisualizerPool();
        await this.visualizerPool.initialize(this.geometryRegistry);
        
        this.homeMaster = new HomeMaster();
        this.homeMaster.initialize(this.jsonConfigSystem.getConfig('stateMap'));
        
        this.interactionCoordinator = new InteractionCoordinator();
        this.interactionCoordinator.initialize(this.homeMaster, this.jsonConfigSystem.getConfig('behavior'));
        
        this.setupVisualizerEventListeners();
        this.setupStateEventListeners();
        
        console.log('✅ Visualizer system initialized');
    }

    async attachVisualizersToCards(cards, visualsConfig) {
        if (!cards || !Array.isArray(cards)) return;
        
        console.log('🔗 Attaching visualizers to cards...');
        
        for (const card of cards) {
            const cardElement = document.getElementById(card.id);
            if (!cardElement) continue;
            
            const canvas = cardElement.querySelector('.card-visualizer');
            if (!canvas) continue;
            
            const geometry = card.geometry || 'hypercube';
            const parameters = {
                ...visualsConfig.parameters ? Object.fromEntries(
                    Object.entries(visualsConfig.parameters).map(([k, v]) => [k, v.default])
                ) : {},
                ...card.parameters || {}
            };
            
            try {
                const visualizer = await this.visualizerPool.createVisualizer(
                    canvas, 
                    geometry, 
                    parameters
                );
                
                this.activeVisualizers.set(card.id, visualizer);
                console.log(`✅ Attached ${geometry} visualizer to card: ${card.id}`);
                
            } catch (error) {
                console.error(`❌ Failed to attach visualizer to ${card.id}:`, error);
            }
        }
        
        console.log(`🎨 ${this.activeVisualizers.size} visualizers attached`);
    }

    setupVisualizerEventListeners() {
        this.visualizerPool.addEventListener('visualizerCreated', (event) => {
            console.log('🎨 Visualizer created:', event.detail);
        });
        
        this.visualizerPool.addEventListener('renderFrame', (event) => {
            const { time, visualizerCount } = event.detail;
            if (Math.floor(time) % 5 === 0 && time % 1 < 0.1) {
                console.log(`🎬 Rendering ${visualizerCount} visualizers at ${time.toFixed(1)}s`);
            }
        });
        
        this.eventBus.addEventListener('parameterUpdated', (event) => {
            const { param, value } = event.detail;
            if (this.visualizerPool) {
                this.visualizerPool.updateGlobalParameter(param, value);
            }
        });
    }

    setupStateEventListeners() {
        if (!this.homeMaster) return;

        this.homeMaster.addEventListener('stateWillChange', (event) => {
            console.log('🔄 State transition starting:', event.detail);
            this.prepareStateTransition(event.detail.from, event.detail.to);
        });

        this.homeMaster.addEventListener('stateDidChange', (event) => {
            console.log('✅ State transition complete:', event.detail);
            this.completeStateTransition(event.detail);
        });

        this.homeMaster.addEventListener('activeCardsChanged', (event) => {
            this.updateCardVisibility(event.detail.activeCards);
        });

        this.homeMaster.addEventListener('themeChanged', (event) => {
            this.applyTheme(event.detail.theme);
        });

        this.homeMaster.addEventListener('masterParameterChanged', (event) => {
            const { parameter, value } = event.detail;
            if (this.visualizerPool) {
                this.visualizerPool.updateGlobalParameter(parameter, value);
            }
        });

        this.homeMaster.addEventListener('backgroundGeometryChanged', (event) => {
            this.updateBackgroundGeometry(event.detail.geometry);
        });
    }

    prepareStateTransition(fromState, toState) {
        const cards = document.querySelectorAll('.adaptive-card');
        cards.forEach(card => {
            card.classList.add('transitioning');
        });
    }

    completeStateTransition(transitionData) {
        const { newState, config } = transitionData;
        
        setTimeout(() => {
            const cards = document.querySelectorAll('.adaptive-card');
            cards.forEach(card => {
                card.classList.remove('transitioning');
            });
        }, 500);

        this.eventBus.dispatchEvent(new CustomEvent('stateDidChange', {
            detail: { newState, config }
        }));
    }

    updateCardVisibility(activeCardIds) {
        const allCards = document.querySelectorAll('.adaptive-card');
        allCards.forEach(card => {
            const cardId = card.id;
            if (activeCardIds.includes(cardId)) {
                card.style.display = 'block';
                card.classList.add('state-active');
                card.classList.remove('state-inactive');
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.classList.add('state-inactive');
                card.classList.remove('state-active');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    applyTheme(themeName) {
        const visualsConfig = this.jsonConfigSystem.getConfig('visuals');
        const theme = visualsConfig?.themes?.[themeName];
        
        if (theme) {
            const root = document.documentElement;
            Object.entries(theme).forEach(([key, value]) => {
                const cssVar = `--vib34d-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                root.style.setProperty(cssVar, value);
            });
            
            document.body.style.backgroundColor = theme.background || '#000';
            document.body.style.color = theme.primary || '#FFF';
            
            console.log(`🎨 Applied theme: ${themeName}`);
        }
    }

    updateBackgroundGeometry(geometryName) {
        const backgroundCanvas = document.querySelector('#background-visualizer');
        if (backgroundCanvas && this.visualizerPool) {
            this.visualizerPool.setVisualizerGeometry(backgroundCanvas.id, geometryName);
        }
    }

    navigateTo(stateId) {
        if (this.homeMaster) {
            return this.homeMaster.navigateTo(stateId);
        }
        
        console.error('❌ HomeMaster not initialized');
        return false;
    }

    addEventListener(eventType, listener) {
        this.eventBus.addEventListener(eventType, listener);
    }

    removeEventListener(eventType, listener) {
        this.eventBus.removeEventListener(eventType, listener);
    }

    getState() {
        return {
            currentState: this.currentState,
            isInitialized: this.isInitialized,
            configs: this.jsonConfigSystem.configs
        };
    }
}

class LayoutEngine {
    constructor() {
        this.layoutConfig = null;
    }

    initialize(layoutConfig) {
        this.layoutConfig = layoutConfig;
        console.log('🏗️ Layout Engine initialized');
    }

    generateLayout() {
        console.log('📐 Generating layout from config');
    }
}

window.SystemController = SystemController;