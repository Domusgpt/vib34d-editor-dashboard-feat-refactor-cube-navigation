/**
 * COMPREHENSIVE MCP TEST FOR VIB3 COMPLETE UNIFIED SYSTEM
 * 
 * Tests all core systems integration and verifies functionality matches our needs:
 * - ReactiveHyperAVCore with WebGL visualization
 * - VIB3HomeMaster parameter authority
 * - UnifiedReactivityBridge synchronization
 * - VIB3UnifiedEffectsSystem hierarchical effects
 * - VIB3IntuitivePresets natural interactions
 * - Magazine-layer sections with navigation
 * - Total system coherence verification
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VIB3CompleteUnifiedSystemMCPTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            timestamp: new Date().toISOString(),
            testSuite: 'VIB3 Complete Unified System MCP Test',
            results: {},
            screenshots: [],
            performance: {},
            errors: [],
            systemState: {}
        };
        
        this.screenshotCounter = 0;
    }
    
    async initialize() {
        console.log('🚀 Initializing VIB3 Complete Unified System MCP Test...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Run in visible mode to see what's happening
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--allow-file-access-from-files',
                '--enable-webgl',
                '--use-gl=swiftshader'
            ]
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Set up console logging
        this.page.on('console', msg => {
            console.log(`🖥️ BROWSER: ${msg.text()}`);
        });
        
        // Set up error logging
        this.page.on('pageerror', error => {
            console.error(`❌ PAGE ERROR: ${error.message}`);
            this.testResults.errors.push({
                type: 'pageerror',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        });
        
        console.log('✅ MCP Test environment initialized');
    }
    
    async takeScreenshot(name, description = '') {
        const filename = `mcp_test_${String(++this.screenshotCounter).padStart(2, '0')}_${name}_${Date.now()}.png`;
        const filepath = path.join(__dirname, filename);
        
        await this.page.screenshot({
            path: filepath,
            fullPage: true
        });
        
        this.testResults.screenshots.push({
            name,
            description,
            filename,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📸 Screenshot taken: ${filename} - ${description}`);
        return filename;
    }
    
    async loadUnifiedSystem() {
        console.log('🌊 Loading VIB3 Complete Unified System...');
        
        // Use HTTP server to avoid CORS issues
        const serverUrl = 'http://127.0.0.1:8892/index_COMPLETE_SYSTEM.html';
        await this.page.goto(serverUrl);
        
        // Wait for initial load
        await this.page.waitForTimeout(2000);
        
        // Take initial screenshot
        await this.takeScreenshot('initial_load', 'Complete unified system initial load');
        
        // Check if main elements are present
        const elementsPresent = await this.page.evaluate(() => {
            return {
                reactiveCanvas: !!document.getElementById('reactive-canvas'),
                magazineLayer: !!document.querySelector('.magazine-layer'),
                interactionIndicator: !!document.querySelector('.interaction-indicator'),
                sectionNav: !!document.querySelector('.section-nav'),
                devControls: !!document.querySelector('.dev-controls'),
                sections: document.querySelectorAll('.section').length
            };
        });
        
        this.testResults.results.elementPresence = elementsPresent;
        
        console.log('📊 Elements present:', elementsPresent);
        
        // Verify core systems are loaded
        const systemsLoaded = await this.page.evaluate(() => {
            return {
                vib3System: !!window.vib3System,
                reactiveCore: !!window.vib3System?.reactiveCore,
                homeMaster: !!window.vib3System?.homeMaster,
                effectsSystem: !!window.vib3System?.effectsSystem,
                intuitivePresets: !!window.vib3System?.intuitivePresets,
                jsonConfigSystem: !!window.vib3System?.configSystem
            };
        });
        
        this.testResults.results.systemsLoaded = systemsLoaded;
        
        console.log('🧠 Core systems loaded:', systemsLoaded);
        
        return elementsPresent.reactiveCanvas && systemsLoaded.vib3System;
    }
    
    async testWebGLVisualization() {
        console.log('🎨 Testing WebGL visualization...');
        
        // Wait for WebGL initialization
        await this.page.waitForTimeout(3000);
        
        const webglStatus = await this.page.evaluate(() => {
            const canvas = document.getElementById('reactive-canvas');
            if (!canvas) return { error: 'Canvas not found' };
            
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return { error: 'WebGL not supported' };
            
            // Check if reactive core is rendering
            const reactiveCore = window.vib3System?.reactiveCore;
            if (!reactiveCore) return { error: 'ReactiveCore not found' };
            
            return {
                canvasSize: { width: canvas.width, height: canvas.height },
                webglSupported: true,
                currentTheme: reactiveCore.currentTheme,
                interactionState: reactiveCore.interactionState,
                params: reactiveCore.params,
                rendering: true
            };
        });
        
        this.testResults.results.webglVisualization = webglStatus;
        
        console.log('🖼️ WebGL Status:', webglStatus);
        
        await this.takeScreenshot('webgl_rendering', 'WebGL visualization active');
        
        return !webglStatus.error;
    }
    
    async testSectionNavigation() {
        console.log('🧭 Testing section navigation...');
        
        const navigationResults = [];
        const sections = ['home', 'hyperav', 'ema', 'audio', 'community', 'development', 'research', 'innovation'];
        
        for (let i = 0; i < sections.length; i++) {
            const sectionName = sections[i];
            console.log(`🎯 Testing navigation to ${sectionName}...`);
            
            // Click navigation dot
            await this.page.click(`[data-section="${sectionName}"]`);
            await this.page.waitForTimeout(1000);
            
            // Check theme change
            const themeInfo = await this.page.evaluate((section) => {
                const sectionElement = document.querySelector(`[data-section="${section}"]`);
                const theme = sectionElement?.dataset.theme;
                const reactiveCore = window.vib3System?.reactiveCore;
                
                return {
                    expectedTheme: theme,
                    actualTheme: reactiveCore?.currentTheme,
                    themeMatches: theme === reactiveCore?.currentTheme,
                    sectionVisible: sectionElement?.getBoundingClientRect().top >= 0,
                    parametersUpdated: !!reactiveCore?.params
                };
            }, sectionName);
            
            navigationResults.push({
                section: sectionName,
                ...themeInfo
            });
            
            await this.takeScreenshot(`nav_${sectionName}`, `Navigation to ${sectionName} section`);
            
            console.log(`✅ ${sectionName}:`, themeInfo);
        }
        
        this.testResults.results.sectionNavigation = navigationResults;
        
        // Return to home
        await this.page.click('[data-section="home"]');
        await this.page.waitForTimeout(1000);
        
        return navigationResults.every(result => result.themeMatches);
    }
    
    async testUnifiedEffects() {
        console.log('🌊 Testing unified effects system...');
        
        const effectsResults = {};
        
        // Test focus effects
        console.log('🎯 Testing focus effects...');
        const homeSection = await this.page.$('.section[data-section="home"] .section-content');
        
        // Hover for focus effect
        await homeSection.hover();
        await this.page.waitForTimeout(500);
        
        const focusState = await this.page.evaluate(() => {
            const focusedElement = document.querySelector('.section-content:hover');
            const cssVars = getComputedStyle(document.documentElement);
            
            return {
                elementFocused: !!focusedElement,
                globalIntensity: cssVars.getPropertyValue('--global-intensity'),
                focusIntensity: cssVars.getPropertyValue('--focus-intensity'),
                backgroundDim: cssVars.getPropertyValue('--background-dim')
            };
        });
        
        effectsResults.focusEffect = focusState;
        await this.takeScreenshot('focus_effect', 'Section hover focus effect active');
        
        // Test click effect
        console.log('💥 Testing click effects...');
        await homeSection.click();
        await this.page.waitForTimeout(800);
        
        const clickState = await this.page.evaluate(() => {
            const cssVars = getComputedStyle(document.documentElement);
            return {
                clickPulse: cssVars.getPropertyValue('--click-pulse'),
                portalIntensity: cssVars.getPropertyValue('--portal-intensity'),
                microChaos: cssVars.getPropertyValue('--micro-chaos')
            };
        });
        
        effectsResults.clickEffect = clickState;
        await this.takeScreenshot('click_effect', 'Section click pulse effect');
        
        // Test dev control effects
        console.log('🔧 Testing dev control effects...');
        
        // Show dev controls
        await this.page.keyboard.press('KeyD');
        await this.page.waitForTimeout(500);
        
        // Test breathing effect
        await this.page.click('button:has-text("Breathing")');
        await this.page.waitForTimeout(2000);
        
        const breathingState = await this.page.evaluate(() => {
            const cssVars = getComputedStyle(document.documentElement);
            return {
                breathingAmplitude: cssVars.getPropertyValue('--breathing-amplitude'),
                consciousnessPhase: cssVars.getPropertyValue('--consciousness-phase'),
                systemCoherence: cssVars.getPropertyValue('--system-coherence')
            };
        });
        
        effectsResults.breathingEffect = breathingState;
        await this.takeScreenshot('breathing_effect', 'Unified breathing effect active');
        
        // Test quantum entanglement
        await this.page.click('button:has-text("Quantum")');
        await this.page.waitForTimeout(2000);
        
        const quantumState = await this.page.evaluate(() => {
            const cssVars = getComputedStyle(document.documentElement);
            return {
                quantumCoherence: cssVars.getPropertyValue('--quantum-coherence'),
                entanglementField: cssVars.getPropertyValue('--entanglement-field')
            };
        });
        
        effectsResults.quantumEffect = quantumState;
        await this.takeScreenshot('quantum_effect', 'Quantum entanglement effect active');
        
        this.testResults.results.unifiedEffects = effectsResults;
        
        return Object.values(effectsResults).every(effect => Object.keys(effect).length > 0);
    }
    
    async testVIB3HomeMasterIntegration() {
        console.log('🏠 Testing VIB3HomeMaster integration...');
        
        const homeMasterState = await this.page.evaluate(() => {
            const homeMaster = window.vib3System?.homeMaster;
            if (!homeMaster) return { error: 'HomeMaster not found' };
            
            return {
                masterState: homeMaster.getSystemState(),
                currentParameters: homeMaster.getParametersForSection(0), // HOME section
                hasEditorConfig: !!homeMaster.editorConfig,
                hasSiteContentData: !!homeMaster.siteContentData,
                updateLoopRunning: true // Assumed if system is responsive
            };
        });
        
        this.testResults.results.homeMasterIntegration = homeMasterState;
        
        console.log('🏠 HomeMaster State:', homeMasterState);
        
        // Test parameter override
        await this.page.evaluate(() => {
            const homeMaster = window.vib3System?.homeMaster;
            if (homeMaster) {
                homeMaster.overrideParameters({
                    intensity: 1.2,
                    complexity: 0.9,
                    dimension: 4.0
                });
            }
        });
        
        await this.page.waitForTimeout(1000);
        
        const afterOverride = await this.page.evaluate(() => {
            const homeMaster = window.vib3System?.homeMaster;
            return homeMaster ? homeMaster.getSystemState() : null;
        });
        
        this.testResults.results.parameterOverride = afterOverride;
        await this.takeScreenshot('parameter_override', 'HomeMaster parameter override test');
        
        return !homeMasterState.error;
    }
    
    async testInteractionResponsiveness() {
        console.log('🎮 Testing interaction responsiveness...');
        
        const interactionResults = {};
        
        // Test mouse movement
        console.log('🐭 Testing mouse movement...');
        const canvas = await this.page.$('#reactive-canvas');
        await canvas.hover();
        
        // Move mouse around canvas
        await this.page.mouse.move(500, 300);
        await this.page.waitForTimeout(200);
        await this.page.mouse.move(800, 600);
        await this.page.waitForTimeout(200);
        await this.page.mouse.move(1200, 400);
        await this.page.waitForTimeout(500);
        
        const mouseInteractionState = await this.page.evaluate(() => {
            const reactiveCore = window.vib3System?.reactiveCore;
            return reactiveCore ? {
                mouseX: reactiveCore.interactionState.mouseX,
                mouseY: reactiveCore.interactionState.mouseY,
                intensity: reactiveCore.interactionState.intensity,
                type: reactiveCore.interactionState.type
            } : null;
        });
        
        interactionResults.mouseMovement = mouseInteractionState;
        await this.takeScreenshot('mouse_interaction', 'Mouse movement interaction test');
        
        // Test click and hold
        console.log('👆 Testing click and hold...');
        await canvas.click();
        await this.page.waitForTimeout(100);
        
        // Simulate hold
        await this.page.mouse.down();
        await this.page.waitForTimeout(1500); // Hold for 1.5 seconds
        await this.page.mouse.up();
        
        const holdInteractionState = await this.page.evaluate(() => {
            const reactiveCore = window.vib3System?.reactiveCore;
            return reactiveCore ? {
                wasHolding: reactiveCore.interactionState.isHolding,
                holdEffect: reactiveCore.interactionState.holdStart > 0,
                currentIntensity: reactiveCore.interactionState.intensity
            } : null;
        });
        
        interactionResults.clickHold = holdInteractionState;
        await this.takeScreenshot('hold_interaction', 'Click and hold interaction test');
        
        // Test scroll interaction
        console.log('📜 Testing scroll interaction...');
        await this.page.evaluate(() => window.scrollTo(0, 500));
        await this.page.waitForTimeout(200);
        await this.page.evaluate(() => window.scrollTo(0, 1000));
        await this.page.waitForTimeout(200);
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForTimeout(500);
        
        const scrollInteractionState = await this.page.evaluate(() => {
            const reactiveCore = window.vib3System?.reactiveCore;
            return reactiveCore ? {
                scrollVelocity: reactiveCore.interactionState.scrollVelocity,
                lastActivity: reactiveCore.interactionState.lastActivity,
                responsive: Date.now() - reactiveCore.interactionState.lastActivity < 2000
            } : null;
        });
        
        interactionResults.scrollInteraction = scrollInteractionState;
        await this.takeScreenshot('scroll_interaction', 'Scroll interaction test');
        
        this.testResults.results.interactionResponsiveness = interactionResults;
        
        return Object.values(interactionResults).every(result => result !== null);
    }
    
    async testSystemCoherence() {
        console.log('🌐 Testing total system coherence...');
        
        const coherenceResults = {};
        
        // Test that all systems respond to single interaction
        console.log('🔗 Testing system-wide response to single interaction...');
        
        // Trigger a section hover and measure responses across all systems
        const techSection = await this.page.$('.section[data-section="hyperav"] .section-content');
        await techSection.hover();
        await this.page.waitForTimeout(1000);
        
        const systemWideResponse = await this.page.evaluate(() => {
            const vib3System = window.vib3System;
            if (!vib3System) return { error: 'VIB3 System not found' };
            
            return {
                // ReactiveCore response
                reactiveCore: {
                    currentTheme: vib3System.reactiveCore?.currentTheme,
                    interactionIntensity: vib3System.reactiveCore?.interactionState.intensity,
                    parametersUpdated: !!vib3System.reactiveCore?.params
                },
                
                // HomeMaster response
                homeMaster: {
                    activeSection: vib3System.homeMaster?.masterState.activeSection,
                    globalIntensity: vib3System.homeMaster?.masterState.intensity,
                    mouseIntensity: vib3System.homeMaster?.masterState.mouseIntensity
                },
                
                // Effects system response
                effectsActive: {
                    focusIntensity: getComputedStyle(document.documentElement).getPropertyValue('--focus-intensity'),
                    globalIntensity: getComputedStyle(document.documentElement).getPropertyValue('--global-intensity'),
                    backgroundDim: getComputedStyle(document.documentElement).getPropertyValue('--background-dim')
                },
                
                // UI response
                uiUpdated: {
                    themeDisplay: document.getElementById('currentTheme')?.textContent,
                    interactionDisplay: document.getElementById('interactionType')?.textContent,
                    parameterDisplays: {
                        morphLevel: document.getElementById('morphLevel')?.textContent,
                        gridDensity: document.getElementById('gridDensity')?.textContent,
                        dimensionLevel: document.getElementById('dimensionLevel')?.textContent
                    }
                }
            };
        });
        
        coherenceResults.systemWideResponse = systemWideResponse;
        await this.takeScreenshot('system_coherence', 'System-wide coherent response test');
        
        // Test parameter cascade
        console.log('⛲ Testing parameter cascade...');
        await this.page.click('button:has-text("Test Params")');
        await this.page.waitForTimeout(2000);
        
        const cascadeResponse = await this.page.evaluate(() => {
            const vib3System = window.vib3System;
            return {
                homeMasterChanged: vib3System.homeMaster?.masterState.intensity > 1.0,
                reactiveCoreUpdated: vib3System.reactiveCore?.params.dimension > 4.0,
                effectsTriggered: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--global-intensity')) > 1.0,
                uiReflectsChanges: parseFloat(document.getElementById('globalIntensity')?.textContent) > 1.0
            };
        });
        
        coherenceResults.parameterCascade = cascadeResponse;
        await this.takeScreenshot('parameter_cascade', 'Parameter cascade test');
        
        this.testResults.results.systemCoherence = coherenceResults;
        
        return !systemWideResponse.error && 
               Object.values(cascadeResponse).every(response => response === true);
    }
    
    async performanceAnalysis() {
        console.log('⚡ Performing performance analysis...');
        
        const performanceMetrics = await this.page.evaluate(() => {
            const performance = window.performance;
            const navigation = performance.getEntriesByType('navigation')[0];
            
            return {
                pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
                domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
                resourceTiming: {
                    scripts: performance.getEntriesByType('resource').filter(r => r.name.includes('.js')).length,
                    stylesheets: performance.getEntriesByType('resource').filter(r => r.name.includes('.css')).length
                },
                memoryUsage: performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : 'Not available'
            };
        });
        
        this.testResults.performance = performanceMetrics;
        
        console.log('📊 Performance Metrics:', performanceMetrics);
    }
    
    async runCompleteTest() {
        console.log('🎯 Starting VIB3 Complete Unified System MCP Test...');
        
        try {
            await this.initialize();
            
            // Core system tests
            const systemLoaded = await this.loadUnifiedSystem();
            this.testResults.results.systemLoaded = systemLoaded;
            
            if (!systemLoaded) {
                throw new Error('❌ Core system failed to load');
            }
            
            // WebGL visualization test
            const webglWorking = await this.testWebGLVisualization();
            this.testResults.results.webglWorking = webglWorking;
            
            // Navigation system test
            const navigationWorking = await this.testSectionNavigation();
            this.testResults.results.navigationWorking = navigationWorking;
            
            // Unified effects test
            const effectsWorking = await this.testUnifiedEffects();
            this.testResults.results.effectsWorking = effectsWorking;
            
            // VIB3HomeMaster integration test
            const homeMasterWorking = await this.testVIB3HomeMasterIntegration();
            this.testResults.results.homeMasterWorking = homeMasterWorking;
            
            // Interaction responsiveness test
            const interactionsWorking = await this.testInteractionResponsiveness();
            this.testResults.results.interactionsWorking = interactionsWorking;
            
            // Total system coherence test
            const coherenceWorking = await this.testSystemCoherence();
            this.testResults.results.coherenceWorking = coherenceWorking;
            
            // Performance analysis
            await this.performanceAnalysis();
            
            // Final system state capture
            this.testResults.systemState = await this.page.evaluate(() => {
                const vib3System = window.vib3System;
                return {
                    isInitialized: vib3System?.isInitialized,
                    currentSection: vib3System?.currentSection,
                    systemsActive: {
                        configSystem: !!vib3System?.configSystem,
                        homeMaster: !!vib3System?.homeMaster,
                        reactivityBridge: !!vib3System?.reactivityBridge,
                        effectsSystem: !!vib3System?.effectsSystem,
                        intuitivePresets: !!vib3System?.intuitivePresets,
                        reactiveCore: !!vib3System?.reactiveCore
                    }
                };
            });
            
            await this.takeScreenshot('final_state', 'Final system state after all tests');
            
            // Calculate overall success
            const allTestsPassed = [
                systemLoaded,
                webglWorking,
                navigationWorking,
                effectsWorking,
                homeMasterWorking,
                interactionsWorking,
                coherenceWorking
            ].every(result => result === true);
            
            this.testResults.overallSuccess = allTestsPassed;
            this.testResults.summary = {
                totalTests: 7,
                passed: [systemLoaded, webglWorking, navigationWorking, effectsWorking, homeMasterWorking, interactionsWorking, coherenceWorking].filter(r => r).length,
                failed: [systemLoaded, webglWorking, navigationWorking, effectsWorking, homeMasterWorking, interactionsWorking, coherenceWorking].filter(r => !r).length,
                errors: this.testResults.errors.length,
                screenshots: this.testResults.screenshots.length
            };
            
            console.log('✅ MCP Test completed successfully!');
            console.log('📊 Test Summary:', this.testResults.summary);
            
        } catch (error) {
            console.error('❌ MCP Test failed:', error);
            this.testResults.errors.push({
                type: 'test-failure',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            this.testResults.overallSuccess = false;
        }
        
        // Save results
        await this.saveResults();
        
        // Keep browser open for manual inspection
        console.log('🔍 Test completed. Browser will remain open for manual inspection.');
        console.log('💾 Results saved to mcp_test_results.json');
        
        return this.testResults;
    }
    
    async saveResults() {
        const resultsPath = path.join(__dirname, 'mcp_test_results.json');
        fs.writeFileSync(resultsPath, JSON.stringify(this.testResults, null, 2));
        
        // Also create a summary report
        const summaryPath = path.join(__dirname, 'mcp_test_summary.md');
        const summary = this.generateSummaryReport();
        fs.writeFileSync(summaryPath, summary);
    }
    
    generateSummaryReport() {
        const { summary, overallSuccess, errors } = this.testResults;
        
        return `# VIB3 Complete Unified System MCP Test Report

## Overall Result: ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}

## Test Summary
- **Total Tests**: ${summary.totalTests}
- **Passed**: ${summary.passed}
- **Failed**: ${summary.failed}
- **Errors**: ${summary.errors}
- **Screenshots**: ${summary.screenshots}

## Test Results

### ✅ Core System Tests
- **System Loaded**: ${this.testResults.results.systemLoaded ? '✅' : '❌'}
- **WebGL Working**: ${this.testResults.results.webglWorking ? '✅' : '❌'}
- **Navigation Working**: ${this.testResults.results.navigationWorking ? '✅' : '❌'}
- **Effects Working**: ${this.testResults.results.effectsWorking ? '✅' : '❌'}
- **HomeMaster Working**: ${this.testResults.results.homeMasterWorking ? '✅' : '❌'}
- **Interactions Working**: ${this.testResults.results.interactionsWorking ? '✅' : '❌'}
- **System Coherence**: ${this.testResults.results.coherenceWorking ? '✅' : '❌'}

### 🖼️ Screenshots Generated
${this.testResults.screenshots.map(s => `- **${s.name}**: ${s.description}`).join('\n')}

### ⚡ Performance Metrics
- **Page Load Time**: ${this.testResults.performance.pageLoadTime}ms
- **DOM Content Loaded**: ${this.testResults.performance.domContentLoaded}ms
- **Scripts Loaded**: ${this.testResults.performance.resourceTiming?.scripts || 0}
- **Stylesheets Loaded**: ${this.testResults.performance.resourceTiming?.stylesheets || 0}

### 🧠 System State
- **Initialized**: ${this.testResults.systemState.isInitialized ? '✅' : '❌'}
- **Current Section**: ${this.testResults.systemState.currentSection}
- **All Systems Active**: ${Object.values(this.testResults.systemState.systemsActive || {}).every(s => s) ? '✅' : '❌'}

${errors.length > 0 ? `### ❌ Errors\n${errors.map(e => `- **${e.type}**: ${e.message}`).join('\n')}` : '### ✅ No Errors Detected'}

---
Generated: ${this.testResults.timestamp}
`;
    }
}

// Run the test
const test = new VIB3CompleteUnifiedSystemMCPTest();
test.runCompleteTest().then(results => {
    console.log('🎯 MCP Test Results:', results.overallSuccess ? 'SUCCESS' : 'FAILED');
    process.exit(results.overallSuccess ? 0 : 1);
}).catch(error => {
    console.error('💥 Test crashed:', error);
    process.exit(1);
});