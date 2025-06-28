/**
 * VIB3 DEV CONTROLS
 * 
 * Simple development control system for testing and debugging
 * Single button for forcing state changes, theme switching, and parameter testing
 */

class VIB3DevControls {
    constructor() {
        this.isVisible = false;
        this.hyperavCore = null;
        this.homeMaster = null;
        this.reactivityBridge = null;
        
        this.presets = {
            'Reset': {
                theme: 'hypercube',
                params: {
                    dimension: 3.5,
                    morphFactor: 0.5,
                    gridDensity: 12.0,
                    rotationSpeed: 0.5,
                    glitchIntensity: 0.3
                },
                interaction: { type: 'reset', intensity: 0.0 }
            },
            'High Energy': {
                theme: 'fractal',
                params: {
                    dimension: 4.2,
                    morphFactor: 1.2,
                    gridDensity: 25.0,
                    rotationSpeed: 1.8,
                    glitchIntensity: 0.8
                },
                interaction: { type: 'energy', intensity: 1.0 }
            },
            'Calm Sphere': {
                theme: 'sphere',
                params: {
                    dimension: 3.1,
                    morphFactor: 0.2,
                    gridDensity: 8.0,
                    rotationSpeed: 0.2,
                    glitchIntensity: 0.1
                },
                interaction: { type: 'calm', intensity: 0.1 }
            },
            'Hypercube Max': {
                theme: 'hypercube',
                params: {
                    dimension: 4.9,
                    morphFactor: 2.0,
                    gridDensity: 30.0,
                    rotationSpeed: 2.5,
                    glitchIntensity: 1.0
                },
                interaction: { type: 'maximum', intensity: 1.0 }
            },
            'Cycle Themes': {
                action: 'cycleThemes'
            },
            'Test Navigation': {
                action: 'testNavigation'
            }
        };
        
        this.currentPresetIndex = 0;
        this.presetNames = Object.keys(this.presets);
        
        this.createDevUI();
        this.setupKeyboardShortcuts();
        
        console.log('🔧 VIB3 Dev Controls initialized');
    }
    
    setReferences(hyperavCore, homeMaster, reactivityBridge) {
        this.hyperavCore = hyperavCore;
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        console.log('🔧 Dev Controls connected to VIB3 systems');
    }
    
    createDevUI() {
        // Create dev control button
        this.devButton = document.createElement('button');
        this.devButton.innerHTML = '🔧 DEV';
        this.devButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            color: #00ffff;
            border: 1px solid #00ffff;
            border-radius: 5px;
            padding: 8px 12px;
            font-family: monospace;
            font-size: 12px;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        
        this.devButton.addEventListener('click', () => this.toggleDevPanel());
        this.devButton.addEventListener('mouseover', () => {
            this.devButton.style.background = 'rgba(0, 255, 255, 0.2)';
            this.devButton.style.transform = 'scale(1.1)';
        });
        this.devButton.addEventListener('mouseout', () => {
            this.devButton.style.background = 'rgba(0, 0, 0, 0.8)';
            this.devButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(this.devButton);
        
        // Create dev panel
        this.devPanel = document.createElement('div');
        this.devPanel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ffff;
            border-radius: 10px;
            padding: 15px;
            font-family: monospace;
            font-size: 12px;
            color: #fff;
            backdrop-filter: blur(20px);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            min-width: 250px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        this.updateDevPanel();
        document.body.appendChild(this.devPanel);
    }
    
    updateDevPanel() {
        this.devPanel.innerHTML = `
            <div style="color: #00ffff; font-weight: bold; margin-bottom: 10px; text-align: center;">
                VIB3 DEV CONTROLS
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="color: #ffff00; font-size: 10px; margin-bottom: 5px;">QUICK PRESETS</div>
                ${this.presetNames.map((name, index) => `
                    <button 
                        onclick="window.vib3DevControls.applyPreset('${name}')"
                        style="
                            display: block;
                            width: 100%;
                            margin: 2px 0;
                            padding: 5px;
                            background: ${index === this.currentPresetIndex ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
                            color: #fff;
                            border: 1px solid #666;
                            border-radius: 3px;
                            cursor: pointer;
                            font-family: monospace;
                            font-size: 10px;
                        "
                        onmouseover="this.style.background='rgba(0, 255, 255, 0.2)'"
                        onmouseout="this.style.background='${index === this.currentPresetIndex ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}'"
                    >
                        ${name}
                    </button>
                `).join('')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="color: #ffff00; font-size: 10px; margin-bottom: 5px;">CURRENT STATE</div>
                <div style="font-size: 9px; color: #ccc; line-height: 1.3;">
                    <div>Theme: <span style="color: #00ff00;">${this.hyperavCore?.currentTheme || 'Unknown'}</span></div>
                    <div>Interaction: <span style="color: #00ff00;">${this.hyperavCore?.interactionState?.type || 'Unknown'}</span></div>
                    <div>Intensity: <span style="color: #00ff00;">${(this.hyperavCore?.interactionState?.intensity || 0).toFixed(2)}</span></div>
                    <div>Dimension: <span style="color: #00ff00;">${(this.hyperavCore?.params?.dimension || 0).toFixed(2)}</span></div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="color: #ffff00; font-size: 10px; margin-bottom: 5px;">KEYBOARD SHORTCUTS</div>
                <div style="font-size: 9px; color: #ccc; line-height: 1.2;">
                    <div>D - Toggle Panel</div>
                    <div>Space - Next Preset</div>
                    <div>R - Reset to Default</div>
                    <div>C - Cycle Themes</div>
                    <div>T - Test Navigation</div>
                </div>
            </div>
            
            <div>
                <button 
                    onclick="window.vib3DevControls.resetAll()"
                    style="
                        width: 100%;
                        padding: 8px;
                        background: rgba(255, 0, 0, 0.3);
                        color: #fff;
                        border: 1px solid #ff0000;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: monospace;
                        font-size: 10px;
                    "
                    onmouseover="this.style.background='rgba(255, 0, 0, 0.5)'"
                    onmouseout="this.style.background='rgba(255, 0, 0, 0.3)'"
                >
                    🔄 RESET ALL SYSTEMS
                </button>
            </div>
        `;
    }
    
    toggleDevPanel() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.devPanel.style.transform = 'translateX(0)';
            this.devButton.innerHTML = '✖️ DEV';
            this.updateDevPanel(); // Refresh state display
        } else {
            this.devPanel.style.transform = 'translateX(100%)';
            this.devButton.innerHTML = '🔧 DEV';
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key.toLowerCase()) {
                case 'd':
                    e.preventDefault();
                    this.toggleDevPanel();
                    break;
                case ' ':
                    e.preventDefault();
                    this.nextPreset();
                    break;
                case 'r':
                    e.preventDefault();
                    this.applyPreset('Reset');
                    break;
                case 'c':
                    e.preventDefault();
                    this.cycleThemes();
                    break;
                case 't':
                    e.preventDefault();
                    this.testNavigation();
                    break;
            }
        });
    }
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) {
            console.warn(`Preset '${presetName}' not found`);
            return;
        }
        
        console.log(`🔧 Applying preset: ${presetName}`);
        
        // Handle special actions
        if (preset.action) {
            switch(preset.action) {
                case 'cycleThemes':
                    this.cycleThemes();
                    break;
                case 'testNavigation':
                    this.testNavigation();
                    break;
            }
            return;
        }
        
        // Apply preset to HyperAV Core
        if (this.hyperavCore && preset.theme) {
            this.hyperavCore.setTheme(preset.theme);
        }
        
        if (this.hyperavCore && preset.params) {
            this.hyperavCore.updateParameters(preset.params);
        }
        
        if (this.hyperavCore && preset.interaction) {
            this.hyperavCore.updateInteractionState(preset.interaction.type, preset.interaction.intensity);
        }
        
        // Update current preset index
        this.currentPresetIndex = this.presetNames.indexOf(presetName);
        
        // Update panel if visible
        if (this.isVisible) {
            this.updateDevPanel();
        }
        
        // Trigger reactivity bridge update
        if (this.reactivityBridge) {
            this.reactivityBridge.triggerEffect('dev-preset-applied', { preset: presetName });
        }
    }
    
    nextPreset() {
        this.currentPresetIndex = (this.currentPresetIndex + 1) % this.presetNames.length;
        const presetName = this.presetNames[this.currentPresetIndex];
        this.applyPreset(presetName);
    }
    
    cycleThemes() {
        if (!this.hyperavCore) return;
        
        const themes = ['hypercube', 'tetrahedron', 'sphere', 'torus', 'klein', 'fractal', 'wave', 'crystal'];
        const currentIndex = themes.indexOf(this.hyperavCore.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        console.log(`🎨 Cycling theme: ${this.hyperavCore.currentTheme} → ${nextTheme}`);
        this.hyperavCore.setTheme(nextTheme);
        
        if (this.isVisible) {
            this.updateDevPanel();
        }
    }
    
    testNavigation() {
        console.log('🧪 Testing navigation system...');
        
        // Test section transitions if homeMaster is available
        if (this.homeMaster) {
            const sections = [0, 1, 2, 3, 4];
            let sectionIndex = 0;
            
            const testTransition = () => {
                this.homeMaster.transitionToSection(sections[sectionIndex]);
                sectionIndex = (sectionIndex + 1) % sections.length;
                
                if (sectionIndex < sections.length) {
                    setTimeout(testTransition, 2000); // 2 second between transitions
                }
            };
            
            testTransition();
        }
        
        // Test interaction patterns
        if (this.hyperavCore) {
            const interactions = [
                { type: 'scroll', intensity: 0.8 },
                { type: 'hold', intensity: 1.0 },
                { type: 'move', intensity: 0.5 },
                { type: 'idle', intensity: 0.0 }
            ];
            
            let interactionIndex = 0;
            
            const testInteraction = () => {
                const interaction = interactions[interactionIndex];
                this.hyperavCore.updateInteractionState(interaction.type, interaction.intensity);
                interactionIndex = (interactionIndex + 1) % interactions.length;
                
                if (interactionIndex < interactions.length) {
                    setTimeout(testInteraction, 1500); // 1.5 seconds between interactions
                }
            };
            
            setTimeout(testInteraction, 500); // Start after short delay
        }
    }
    
    resetAll() {
        console.log('🔄 Resetting all VIB3 systems...');
        
        // Reset HyperAV Core
        if (this.hyperavCore) {
            this.hyperavCore.setTheme('hypercube');
            this.hyperavCore.updateParameters({
                dimension: 3.5,
                morphFactor: 0.5,
                gridDensity: 12.0,
                rotationSpeed: 0.5,
                glitchIntensity: 0.3
            });
            this.hyperavCore.updateInteractionState('reset', 0.0);
        }
        
        // Reset HomeMaster
        if (this.homeMaster) {
            this.homeMaster.transitionToSection(0); // Return to home
        }
        
        // Trigger reactivity bridge reset
        if (this.reactivityBridge) {
            this.reactivityBridge.triggerEffect('system-reset', {});
        }
        
        this.currentPresetIndex = 0;
        
        if (this.isVisible) {
            this.updateDevPanel();
        }
    }
    
    // Get current system status for debugging
    getStatus() {
        return {
            hyperavCore: {
                theme: this.hyperavCore?.currentTheme,
                interaction: this.hyperavCore?.interactionState,
                params: this.hyperavCore?.params
            },
            devControls: {
                visible: this.isVisible,
                currentPreset: this.presetNames[this.currentPresetIndex]
            },
            systems: {
                homeMaster: !!this.homeMaster,
                reactivityBridge: !!this.reactivityBridge,
                hyperavCore: !!this.hyperavCore
            }
        };
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.VIB3DevControls = VIB3DevControls;
    console.log('🔧 VIB3 Dev Controls loaded');
}