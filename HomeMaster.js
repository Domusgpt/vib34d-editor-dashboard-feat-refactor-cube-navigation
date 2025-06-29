class HomeMaster {
    constructor() {
        this.currentState = 'home';
        this.previousState = null;
        this.stateHistory = [];
        this.stateConfig = null;
        this.stateOrder = ['home', 'tech', 'media', 'innovation', 'context'];
        this.eventBus = new EventTarget();
        this.isTransitioning = false;
        this.activeCards = new Set();
        this.currentTheme = 'dark_matter';
        this.masterParameters = {};
    }

    initialize(stateMapConfig) {
        if (!stateMapConfig) {
            throw new Error('State map configuration required');
        }

        this.stateConfig = stateMapConfig;
        this.stateOrder = stateMapConfig.stateOrder || this.stateOrder;
        this.currentState = stateMapConfig.initialState || 'home';
        
        console.log('🏠 HomeMaster initialized with states:', Object.keys(stateMapConfig.states));
        
        this.applyCurrentState();
        
        this.eventBus.dispatchEvent(new CustomEvent('homeMasterReady', {
            detail: { 
                initialState: this.currentState,
                availableStates: Object.keys(stateMapConfig.states)
            }
        }));
    }

    navigateTo(targetState) {
        if (!this.isValidState(targetState)) {
            console.error(`❌ Invalid state: ${targetState}`);
            return false;
        }

        if (this.currentState === targetState) {
            console.log(`🔄 Already in state: ${targetState}`);
            return true;
        }

        if (this.isTransitioning) {
            console.warn(`⚠️ Navigation blocked - transition in progress`);
            return false;
        }

        console.log(`🚀 Navigating: ${this.currentState} → ${targetState}`);

        this.eventBus.dispatchEvent(new CustomEvent('stateWillChange', {
            detail: { from: this.currentState, to: targetState }
        }));

        this.isTransitioning = true;
        this.previousState = this.currentState;
        this.stateHistory.push(this.currentState);
        
        if (this.stateHistory.length > 10) {
            this.stateHistory.shift();
        }

        this.currentState = targetState;
        this.applyCurrentState();

        setTimeout(() => {
            this.isTransitioning = false;
            this.eventBus.dispatchEvent(new CustomEvent('stateDidChange', {
                detail: { 
                    newState: this.currentState,
                    previousState: this.previousState,
                    config: this.getCurrentStateConfig()
                }
            }));
        }, 100);

        return true;
    }

    navigateNext() {
        const currentIndex = this.stateOrder.indexOf(this.currentState);
        const nextIndex = (currentIndex + 1) % this.stateOrder.length;
        return this.navigateTo(this.stateOrder[nextIndex]);
    }

    navigatePrevious() {
        const currentIndex = this.stateOrder.indexOf(this.currentState);
        const prevIndex = (currentIndex - 1 + this.stateOrder.length) % this.stateOrder.length;
        return this.navigateTo(this.stateOrder[prevIndex]);
    }

    navigateBack() {
        if (this.stateHistory.length > 0) {
            const lastState = this.stateHistory.pop();
            return this.navigateTo(lastState);
        }
        return false;
    }

    cycleState() {
        return this.navigateNext();
    }

    applyCurrentState() {
        const stateConfig = this.getCurrentStateConfig();
        if (!stateConfig) {
            console.error(`❌ No configuration for state: ${this.currentState}`);
            return;
        }

        this.updateActiveCards(stateConfig.activeCards || []);
        this.updateTheme(stateConfig.activeTheme || 'dark_matter');
        this.updateMasterParameters(stateConfig.masterParameters || {});
        this.updateBackgroundGeometry(stateConfig.backgroundGeometry || 'hypercube');

        console.log(`✅ Applied state: ${this.currentState}`, {
            activeCards: this.activeCards.size,
            theme: this.currentTheme,
            parameters: Object.keys(this.masterParameters).length
        });
    }

    updateActiveCards(cardIds) {
        this.activeCards.clear();
        cardIds.forEach(cardId => this.activeCards.add(cardId));

        document.querySelectorAll('.adaptive-card').forEach(card => {
            const cardId = card.id;
            if (this.activeCards.has(cardId)) {
                card.style.display = 'block';
                card.classList.add('state-active');
                card.classList.remove('state-inactive');
            } else {
                card.style.display = 'none';
                card.classList.add('state-inactive');
                card.classList.remove('state-active');
            }
        });

        this.eventBus.dispatchEvent(new CustomEvent('activeCardsChanged', {
            detail: { activeCards: Array.from(this.activeCards) }
        }));
    }

    updateTheme(themeName) {
        this.currentTheme = themeName;
        
        document.body.setAttribute('data-vib34d-theme', themeName);
        
        this.eventBus.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
    }

    updateMasterParameters(parameters) {
        this.masterParameters = { ...this.masterParameters, ...parameters };
        
        Object.entries(parameters).forEach(([param, value]) => {
            this.eventBus.dispatchEvent(new CustomEvent('masterParameterChanged', {
                detail: { parameter: param, value: value }
            }));
        });
    }

    updateBackgroundGeometry(geometryName) {
        this.backgroundGeometry = geometryName;
        
        this.eventBus.dispatchEvent(new CustomEvent('backgroundGeometryChanged', {
            detail: { geometry: geometryName }
        }));
    }

    isValidState(stateName) {
        return this.stateConfig && this.stateConfig.states && this.stateConfig.states[stateName];
    }

    getCurrentStateConfig() {
        return this.stateConfig?.states?.[this.currentState] || null;
    }

    getStateParameter(parameterName) {
        const stateConfig = this.getCurrentStateConfig();
        return stateConfig?.masterParameters?.[parameterName] || null;
    }

    getAllStates() {
        return this.stateConfig?.states ? Object.keys(this.stateConfig.states) : [];
    }

    getStateHistory() {
        return [...this.stateHistory];
    }

    getCurrentState() {
        return this.currentState;
    }

    getPreviousState() {
        return this.previousState;
    }

    getActiveCards() {
        return Array.from(this.activeCards);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getMasterParameters() {
        return { ...this.masterParameters };
    }

    isTransitioningState() {
        return this.isTransitioning;
    }

    handleScrollInteraction(deltaY, deltaX) {
        if (this.isTransitioning) return;

        const sensitivity = 0.001;
        const scrollThreshold = 50;

        if (Math.abs(deltaY) > scrollThreshold) {
            if (deltaY > 0) {
                this.navigateNext();
            } else {
                this.navigatePrevious();
            }
        }
    }

    handleKeyboardNavigation(keyCode, key) {
        if (this.isTransitioning) return false;

        const navigation = this.stateConfig?.navigation || {};
        const action = navigation[key] || navigation[`Key${key.toUpperCase()}`] || navigation[`Digit${key}`];
        
        if (action) {
            return this.executeNavigationAction(action);
        }

        switch (keyCode) {
            case 37: // ArrowLeft
                return this.navigatePrevious();
            case 39: // ArrowRight
                return this.navigateNext();
            case 38: // ArrowUp
                return this.navigateTo('home');
            case 32: // Space
                return this.cycleState();
            case 8: // Backspace
                return this.navigateBack();
            default:
                return false;
        }
    }

    executeNavigationAction(action) {
        if (action.startsWith('navigateTo(')) {
            const match = action.match(/navigateTo\('(.+)'\)/);
            if (match) {
                return this.navigateTo(match[1]);
            }
        } else if (action === 'navigateNext()') {
            return this.navigateNext();
        } else if (action === 'navigatePrevious()') {
            return this.navigatePrevious();
        } else if (action === 'cycleState()') {
            return this.cycleState();
        } else if (action === 'navigateBack()') {
            return this.navigateBack();
        }
        
        return false;
    }

    addEventListener(eventType, listener) {
        this.eventBus.addEventListener(eventType, listener);
    }

    removeEventListener(eventType, listener) {
        this.eventBus.removeEventListener(eventType, listener);
    }

    exportState() {
        return {
            currentState: this.currentState,
            previousState: this.previousState,
            stateHistory: [...this.stateHistory],
            activeCards: Array.from(this.activeCards),
            currentTheme: this.currentTheme,
            masterParameters: { ...this.masterParameters },
            isTransitioning: this.isTransitioning
        };
    }

    restoreState(stateData) {
        this.currentState = stateData.currentState || 'home';
        this.previousState = stateData.previousState || null;
        this.stateHistory = stateData.stateHistory || [];
        this.currentTheme = stateData.currentTheme || 'dark_matter';
        this.masterParameters = stateData.masterParameters || {};
        this.isTransitioning = false;
        
        this.applyCurrentState();
        
        console.log('📥 HomeMaster state restored:', this.currentState);
    }
}

window.HomeMaster = HomeMaster;