class InteractionCoordinator {
    constructor() {
        this.homeMaster = null;
        this.behaviorConfig = null;
        this.eventBus = new EventTarget();
        this.activeInteractions = new Map();
        this.isInitialized = false;
        this.keyboardListeners = new Set();
        this.mouseListeners = new Set();
        this.touchListeners = new Set();
    }

    initialize(homeMaster, behaviorConfig) {
        this.homeMaster = homeMaster;
        this.behaviorConfig = behaviorConfig;
        
        console.log('🎮 InteractionCoordinator initializing...');
        
        this.setupGlobalEventListeners();
        this.setupInteractionBlueprints();
        this.setupNavigationHandlers();
        
        this.isInitialized = true;
        console.log('✅ InteractionCoordinator initialized');
        
        this.eventBus.dispatchEvent(new CustomEvent('interactionCoordinatorReady', {
            detail: { 
                blueprintCount: Object.keys(this.behaviorConfig?.interactionBlueprints || {}).length
            }
        }));
    }

    setupGlobalEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardEvent(event);
        });

        document.addEventListener('mousemove', (event) => {
            this.handleMouseEvent(event);
        });

        document.addEventListener('wheel', (event) => {
            this.handleWheelEvent(event);
        });

        document.addEventListener('click', (event) => {
            this.handleClickEvent(event);
        });

        document.addEventListener('touchstart', (event) => {
            this.handleTouchEvent(event);
        }, { passive: false });

        document.addEventListener('touchmove', (event) => {
            this.handleTouchEvent(event);
        }, { passive: false });

        console.log('🎯 Global event listeners attached');
    }

    setupInteractionBlueprints() {
        if (!this.behaviorConfig?.interactionBlueprints) return;

        Object.entries(this.behaviorConfig.interactionBlueprints).forEach(([name, blueprint]) => {
            this.registerInteractionBlueprint(name, blueprint);
        });

        console.log(`📋 Registered ${Object.keys(this.behaviorConfig.interactionBlueprints).length} interaction blueprints`);
    }

    registerInteractionBlueprint(name, blueprint) {
        const { trigger, selector, reactions } = blueprint;
        
        if (!trigger || !selector || !reactions) {
            console.warn(`⚠️ Invalid blueprint: ${name}`);
            return;
        }

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            this.attachBlueprintToElement(element, name, blueprint);
        });
    }

    attachBlueprintToElement(element, blueprintName, blueprint) {
        const { trigger, reactions, revertOn, revertAnimation } = blueprint;
        
        const handleInteraction = (event) => {
            this.executeBlueprint(element, blueprint, event);
        };

        const handleRevert = (event) => {
            if (revertAnimation) {
                this.executeRevertAnimation(element, blueprint, event);
            }
        };

        switch (trigger) {
            case 'onHover':
                element.addEventListener('mouseenter', handleInteraction);
                if (revertOn === 'onLeave') {
                    element.addEventListener('mouseleave', handleRevert);
                }
                break;
            case 'onClick':
                element.addEventListener('click', handleInteraction);
                if (revertOn === 'onRelease') {
                    element.addEventListener('mouseup', handleRevert);
                }
                break;
            case 'onInput':
                element.addEventListener('input', handleInteraction);
                if (revertOn === 'onInputEnd') {
                    element.addEventListener('blur', handleRevert);
                }
                break;
        }

        element.setAttribute('data-blueprint', blueprintName);
    }

    executeBlueprint(subjectElement, blueprint, event) {
        const { reactions } = blueprint;
        
        reactions.forEach(reaction => {
            const targetElements = this.resolveTargets(subjectElement, reaction.target);
            targetElements.forEach(targetElement => {
                this.applyReaction(targetElement, reaction, event);
            });
        });

        this.eventBus.dispatchEvent(new CustomEvent('blueprintExecuted', {
            detail: { 
                blueprint: blueprint,
                subject: subjectElement,
                event: event.type
            }
        }));
    }

    resolveTargets(subjectElement, targetType) {
        switch (targetType) {
            case 'subject':
                return [subjectElement];
            
            case 'parent':
                return subjectElement.parentElement ? [subjectElement.parentElement] : [];
            
            case 'siblings':
                const parent = subjectElement.parentElement;
                if (!parent) return [];
                return Array.from(parent.children).filter(child => child !== subjectElement);
            
            case 'children':
                return Array.from(subjectElement.children);
            
            case 'ecosystem':
                const allCards = document.querySelectorAll('.adaptive-card');
                return Array.from(allCards).filter(card => card !== subjectElement && !subjectElement.contains(card));
            
            case 'global':
                return [document.body];
            
            default:
                console.warn(`⚠️ Unknown target type: ${targetType}`);
                return [];
        }
    }

    applyReaction(targetElement, reaction, event) {
        const { animation } = reaction;
        if (!animation) return;

        Object.entries(animation).forEach(([property, animationData]) => {
            this.animateProperty(targetElement, property, animationData, event);
        });
    }

    animateProperty(element, property, animationData, event) {
        const { to, curve = 'easeOut', duration = 300, delay = 0, direction = 'normal' } = animationData;
        
        setTimeout(() => {
            if (property.startsWith('u_')) {
                this.animateShaderUniform(element, property, to, duration, curve);
            } else if (property.startsWith('transform.')) {
                this.animateTransform(element, property, to, duration, curve);
            } else {
                this.animateCSS(element, property, to, duration, curve);
            }
        }, delay);
    }

    animateShaderUniform(element, uniform, targetValue, duration, curve) {
        const canvas = element.querySelector('.card-visualizer') || element;
        if (!canvas) return;

        const visualizerId = canvas.id;
        
        this.eventBus.dispatchEvent(new CustomEvent('animateUniform', {
            detail: {
                visualizerId: visualizerId,
                uniform: uniform,
                targetValue: this.parseValue(targetValue),
                duration: duration,
                curve: curve
            }
        }));
    }

    animateTransform(element, transformProperty, targetValue, duration, curve) {
        const property = transformProperty.split('.')[1];
        const currentTransform = element.style.transform || '';
        
        element.style.transition = `transform ${duration}ms ${this.getCSSEasing(curve)}`;
        
        switch (property) {
            case 'scale':
                element.style.transform = `${currentTransform} scale(${targetValue})`;
                break;
            case 'rotate':
                element.style.transform = `${currentTransform} rotate(${targetValue}deg)`;
                break;
            case 'translate':
                element.style.transform = `${currentTransform} translate(${targetValue})`;
                break;
        }
    }

    animateCSS(element, property, targetValue, duration, curve) {
        element.style.transition = `${property} ${duration}ms ${this.getCSSEasing(curve)}`;
        element.style[property] = targetValue;
    }

    parseValue(value) {
        if (typeof value === 'string') {
            if (value.startsWith('*=')) {
                return { operation: 'multiply', value: parseFloat(value.slice(2)) };
            } else if (value.startsWith('+=')) {
                return { operation: 'add', value: parseFloat(value.slice(2)) };
            } else if (value === 'initial') {
                return { operation: 'reset' };
            }
        }
        return { operation: 'set', value: parseFloat(value) || value };
    }

    getCSSEasing(curve) {
        const easingMap = {
            'linear': 'linear',
            'easeIn': 'ease-in',
            'easeOut': 'ease-out',
            'easeInOut': 'ease-in-out',
            'parabolic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            'cubic-bezier': curve.includes('cubic-bezier') ? curve : 'ease-out'
        };
        
        return easingMap[curve] || 'ease-out';
    }

    setupNavigationHandlers() {
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.setupScrollNavigation();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            if (this.homeMaster && this.homeMaster.handleKeyboardNavigation) {
                const handled = this.homeMaster.handleKeyboardNavigation(event.keyCode, event.key);
                if (handled) {
                    event.preventDefault();
                }
            }
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        });

        document.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            const deltaTime = Date.now() - touchStartTime;
            
            const minSwipeDistance = 50;
            const maxSwipeTime = 500;
            
            if (deltaTime < maxSwipeTime && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.homeMaster?.navigatePrevious();
                } else {
                    this.homeMaster?.navigateNext();
                }
                event.preventDefault();
            }
        });
    }

    setupScrollNavigation() {
        let scrollTimeout;
        
        document.addEventListener('wheel', (event) => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (this.homeMaster && this.homeMaster.handleScrollInteraction) {
                    this.homeMaster.handleScrollInteraction(event.deltaY, event.deltaX);
                }
            }, 50);
        });
    }

    handleKeyboardEvent(event) {
        this.keyboardListeners.forEach(listener => {
            listener(event);
        });
    }

    handleMouseEvent(event) {
        this.mouseListeners.forEach(listener => {
            listener(event);
        });
    }

    handleWheelEvent(event) {
        this.eventBus.dispatchEvent(new CustomEvent('wheelEvent', {
            detail: { deltaY: event.deltaY, deltaX: event.deltaX, event }
        }));
    }

    handleClickEvent(event) {
        this.eventBus.dispatchEvent(new CustomEvent('clickEvent', {
            detail: { target: event.target, event }
        }));
    }

    handleTouchEvent(event) {
        this.touchListeners.forEach(listener => {
            listener(event);
        });
    }

    addKeyboardListener(listener) {
        this.keyboardListeners.add(listener);
    }

    removeKeyboardListener(listener) {
        this.keyboardListeners.delete(listener);
    }

    addMouseListener(listener) {
        this.mouseListeners.add(listener);
    }

    removeMouseListener(listener) {
        this.mouseListeners.delete(listener);
    }

    addTouchListener(listener) {
        this.touchListeners.add(listener);
    }

    removeTouchListener(listener) {
        this.touchListeners.delete(listener);
    }

    addEventListener(eventType, listener) {
        this.eventBus.addEventListener(eventType, listener);
    }

    removeEventListener(eventType, listener) {
        this.eventBus.removeEventListener(eventType, listener);
    }

    getActiveInteractions() {
        return Array.from(this.activeInteractions.entries());
    }

    isInteractionActive(interactionId) {
        return this.activeInteractions.has(interactionId);
    }
}

window.InteractionCoordinator = InteractionCoordinator;