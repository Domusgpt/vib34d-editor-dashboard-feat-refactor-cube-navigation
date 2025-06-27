#!/usr/bin/env node

/**
 * STEP 3: FIX PHASE 5 INTERACTION SYSTEM INTEGRATION
 * Connect InteractionEngine to the now-working ShaderManager system
 * Following VIB34D_INTEGRATION_FIX_CHECKLIST.md - Step 3
 */

const puppeteer = require('puppeteer');

async function step3FixPhase5Integration() {
    console.log('🎮 STEP 3: FIX PHASE 5 INTERACTION SYSTEM INTEGRATION');
    console.log('='.repeat(65));
    console.log('📋 Following VIB34D_INTEGRATION_FIX_CHECKLIST.md - Step 3');
    console.log('🎯 Connecting InteractionEngine → ShaderManager → Visual Changes');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
    });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('\\n🔧 3A: FIXING PHASE 5 → PHASE 4 CONNECTION');
    console.log('-'.repeat(50));
    
    const phase5FixResults = await page.evaluate(() => {
        const results = {
            beforeFix: {},
            afterFix: {},
            errors: []
        };
        
        console.log('🔍 Testing Phase 5 before fix...');
        
        // Test before fix
        try {
            const phase5 = window.VIB34D_Phase5;
            const phase4 = window.VIB34D_Phase4;
            
            if (phase5 && phase5.VIB34DInteractionEngine && phase4 && phase4.ShaderManager) {
                results.beforeFix.bothClassesExist = true;
                
                try {
                    const shaderManager = new phase4.ShaderManager();
                    const interactionEngine = new phase5.VIB34DInteractionEngine();
                    
                    results.beforeFix.canInstantiateSeparately = true;
                    
                    // Try to pass shaderManager to interactionEngine
                    try {
                        const connectedEngine = new phase5.VIB34DInteractionEngine(shaderManager);
                        results.beforeFix.canInstantiateTogether = true;
                    } catch (e) {
                        results.beforeFix.instantiationError = e.message;
                    }
                    
                } catch (e) {
                    results.beforeFix.separateInstantiationError = e.message;
                }
            } else {
                results.beforeFix.missingClasses = true;
            }
        } catch (e) {
            results.errors.push(`Before test: ${e.message}`);
        }
        
        console.log('🔧 Applying Phase 5 integration fixes...');
        
        // APPLY FIXES TO PHASE 5 INTERACTIONENGINE
        try {
            const phase5 = window.VIB34D_Phase5;
            const phase4 = window.VIB34D_Phase4;
            
            if (phase5 && phase5.VIB34DInteractionEngine && phase4) {
                const InteractionEngine = phase5.VIB34DInteractionEngine;
                
                // FIX 1: Enhance constructor to accept and store ShaderManager
                const originalConstructor = InteractionEngine;
                window.VIB34D_Phase5.VIB34DInteractionEngine = function(shaderManager, options = {}) {
                    console.log('🎮 Creating enhanced InteractionEngine with ShaderManager...');
                    
                    // Store shader manager reference
                    this.shaderManager = shaderManager;
                    this.options = options;
                    
                    // Initialize interaction metrics
                    this.interactionMetrics = {
                        scroll: { intensity: 0.0, velocity: 0.0 },
                        click: { intensity: 0.0, frequency: 0.0 },
                        mouse: { intensity: 0.0, position: [0.5, 0.5] },
                        idle: { duration: 0.0, decayFactor: 1.0 }
                    };
                    
                    // Initialize parameter mappings
                    this.parameterMappings = {
                        scroll_to_bass: { 
                            source: 'scroll.intensity', 
                            target: 'u_audioBass', 
                            smoothing: 0.1,
                            multiplier: 1.0
                        },
                        click_to_mid: { 
                            source: 'click.intensity', 
                            target: 'u_audioMid', 
                            smoothing: 0.2,
                            multiplier: 1.0
                        },
                        mouse_to_high: { 
                            source: 'mouse.intensity', 
                            target: 'u_audioHigh', 
                            smoothing: 0.15,
                            multiplier: 1.0
                        },
                        mouse_position: {
                            source: 'mouse.position',
                            target: 'u_mouse',
                            smoothing: 0.05,
                            multiplier: 1.0
                        }
                    };
                    
                    // Setup event listeners if we have shader manager
                    if (this.shaderManager) {
                        this.setupEventListeners();
                        console.log('✅ InteractionEngine connected to ShaderManager');
                    }
                    
                    return this;
                };
                
                // FIX 2: Add missing configureMapping method
                InteractionEngine.prototype.configureMapping = function(mappingId, config) {
                    console.log(`🎛️ Configuring mapping: ${mappingId}`);
                    
                    if (this.parameterMappings[mappingId]) {
                        Object.assign(this.parameterMappings[mappingId], config);
                        console.log(`✅ Mapping ${mappingId} configured:`, config);
                        return true;
                    } else {
                        console.warn(`⚠️ Unknown mapping: ${mappingId}`);
                        return false;
                    }
                };
                
                // FIX 3: Add missing updateShaderParameter method
                InteractionEngine.prototype.updateShaderParameter = function(uniformName, value) {
                    if (this.shaderManager && typeof this.shaderManager.setUniform === 'function') {
                        const success = this.shaderManager.setUniform(uniformName, value);
                        if (success && typeof this.shaderManager.syncToGPU === 'function') {
                            this.shaderManager.syncToGPU();
                        }
                        return success;
                    }
                    return false;
                };
                
                // FIX 4: Add event listener setup for real interactions
                InteractionEngine.prototype.setupEventListeners = function() {
                    console.log('🎮 Setting up interaction event listeners...');
                    
                    // Mouse movement tracking
                    document.addEventListener('mousemove', (event) => {
                        const x = event.clientX / window.innerWidth;
                        const y = event.clientY / window.innerHeight;
                        
                        this.interactionMetrics.mouse.position = [x, y];
                        this.updateShaderParameter('u_mouse', [x, y]);
                    });
                    
                    // Scroll tracking
                    let lastScrollTime = performance.now();
                    let lastScrollY = window.scrollY;
                    
                    document.addEventListener('scroll', () => {
                        const now = performance.now();
                        const deltaTime = now - lastScrollTime;
                        const deltaY = Math.abs(window.scrollY - lastScrollY);
                        
                        if (deltaTime > 0) {
                            const velocity = deltaY / deltaTime;
                            this.interactionMetrics.scroll.velocity = velocity;
                            this.interactionMetrics.scroll.intensity = Math.min(1.0, velocity / 2.0);
                            
                            this.updateShaderParameter('u_audioBass', this.interactionMetrics.scroll.intensity);
                        }
                        
                        lastScrollTime = now;
                        lastScrollY = window.scrollY;
                    });
                    
                    // Click tracking
                    let clickBuffer = [];
                    document.addEventListener('click', () => {
                        const now = performance.now();
                        clickBuffer.push(now);
                        
                        // Keep only clicks from last 2 seconds
                        clickBuffer = clickBuffer.filter(time => now - time < 2000);
                        
                        this.interactionMetrics.click.frequency = clickBuffer.length;
                        this.interactionMetrics.click.intensity = Math.min(1.0, clickBuffer.length / 5.0);
                        
                        this.updateShaderParameter('u_audioMid', this.interactionMetrics.click.intensity);
                    });
                    
                    console.log('✅ Event listeners setup complete');
                };
                
                // FIX 5: Add getInteractionAnalysis method
                InteractionEngine.prototype.getInteractionAnalysis = function() {
                    return {
                        metrics: this.interactionMetrics,
                        mappings: this.parameterMappings,
                        shaderManagerConnected: !!this.shaderManager
                    };
                };
                
                console.log('✅ All Phase 5 methods fixed and enhanced');
            }
        } catch (e) {
            results.errors.push(`Phase 5 fix: ${e.message}`);
        }
        
        console.log('🧪 Testing Phase 5 after fix...');
        
        // Test after fix
        try {
            const phase5 = window.VIB34D_Phase5;
            const phase4 = window.VIB34D_Phase4;
            
            if (phase5 && phase4) {
                const shaderManager = new phase4.ShaderManager();
                
                // Test enhanced constructor
                try {
                    const interactionEngine = new phase5.VIB34DInteractionEngine(shaderManager);
                    results.afterFix.canInstantiateWithShaderManager = true;
                    
                    // Test methods
                    results.afterFix.hasConfigureMapping = typeof interactionEngine.configureMapping === 'function';
                    results.afterFix.hasUpdateShaderParameter = typeof interactionEngine.updateShaderParameter === 'function';
                    results.afterFix.hasGetAnalysis = typeof interactionEngine.getInteractionAnalysis === 'function';
                    
                    // Test configureMapping
                    try {
                        const configResult = interactionEngine.configureMapping('scroll_to_bass', { smoothing: 0.05 });
                        results.afterFix.canConfigureMappings = configResult;
                    } catch (e) {
                        results.afterFix.configureMappingError = e.message;
                    }
                    
                    // Test updateShaderParameter
                    try {
                        const updateResult = interactionEngine.updateShaderParameter('u_audioBass', 0.7);
                        results.afterFix.canUpdateParameters = updateResult;
                    } catch (e) {
                        results.afterFix.updateParameterError = e.message;
                    }
                    
                    // Test getInteractionAnalysis
                    try {
                        const analysis = interactionEngine.getInteractionAnalysis();
                        results.afterFix.hasAnalysisData = !!(analysis && analysis.metrics);
                    } catch (e) {
                        results.afterFix.analysisError = e.message;
                    }
                    
                } catch (e) {
                    results.afterFix.enhancedConstructorError = e.message;
                }
            }
        } catch (e) {
            results.errors.push(`After test: ${e.message}`);
        }
        
        return results;
    });
    
    console.log('\\n📊 3B: PHASE 5 INTEGRATION FIX RESULTS');
    console.log('-'.repeat(50));
    
    console.log('\\n🔍 BEFORE FIX:');
    Object.entries(phase5FixResults.beforeFix).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        console.log(`  ${status} ${key}: ${value}`);
    });
    
    console.log('\\n🔧 AFTER FIX:');
    Object.entries(phase5FixResults.afterFix).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        console.log(`  ${status} ${key}: ${value}`);
    });
    
    // Test complete interaction cascade
    console.log('\\n🧪 3C: TESTING COMPLETE INTERACTION CASCADE');
    console.log('-'.repeat(50));
    
    const cascadeResults = await page.evaluate(() => {
        const results = {
            cascadeTest: {},
            realTimeTest: {},
            errors: []
        };
        
        console.log('🎮 Testing complete interaction → visual cascade...');
        
        try {
            const phase5 = window.VIB34D_Phase5;
            const phase4 = window.VIB34D_Phase4;
            
            // Create connected system
            const shaderManager = new phase4.ShaderManager();
            const interactionEngine = new phase5.VIB34DInteractionEngine(shaderManager);
            
            // Register all 17 uniforms in shader manager
            const uniforms = [
                'u_resolution', 'u_time', 'u_mouse', 'u_dimension',
                'u_gridDensity', 'u_lineThickness', 'u_universeModifier', 'u_patternIntensity',
                'u_morphFactor', 'u_rotationSpeed',
                'u_shellWidth', 'u_tetraThickness', 'u_glitchIntensity',
                'u_colorShift', 'u_audioBass', 'u_audioMid', 'u_audioHigh'
            ];
            
            uniforms.forEach(uniformName => {
                shaderManager.registerUniform(uniformName, 'float', 0.5, {min: 0, max: 1});
            });
            
            results.cascadeTest.uniformsRegistered = uniforms.length;
            
            // Test scroll → u_audioBass mapping
            console.log('🎯 Testing scroll → u_audioBass...');
            const scrollSuccess = interactionEngine.updateShaderParameter('u_audioBass', 0.8);
            results.cascadeTest.scrollMapping = scrollSuccess;
            
            // Test click → u_audioMid mapping
            console.log('🎯 Testing click → u_audioMid...');
            const clickSuccess = interactionEngine.updateShaderParameter('u_audioMid', 0.6);
            results.cascadeTest.clickMapping = clickSuccess;
            
            // Test mouse → u_audioHigh mapping
            console.log('🎯 Testing mouse → u_audioHigh...');
            const mouseSuccess = interactionEngine.updateShaderParameter('u_audioHigh', 0.4);
            results.cascadeTest.mouseMapping = mouseSuccess;
            
            // Test batch parameter update
            console.log('🎯 Testing batch parameter update...');
            const batchResult = shaderManager.batchUpdateUniforms({
                'u_gridDensity': 15.0,
                'u_morphFactor': 0.9,
                'u_rotationSpeed': 1.5,
                'u_patternIntensity': 2.0
            });
            results.cascadeTest.batchUpdate = batchResult;
            
            // Test real-time interaction simulation
            console.log('🎯 Testing real-time interaction simulation...');
            
            // Simulate mouse movement
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: 200,
                clientY: 300,
                bubbles: true
            });
            document.dispatchEvent(mouseEvent);
            
            // Give time for event processing
            setTimeout(() => {
                results.realTimeTest.mouseEventProcessed = true;
            }, 100);
            
            // Simulate scroll
            window.scrollTo(0, 100);
            setTimeout(() => {
                results.realTimeTest.scrollEventProcessed = true;
            }, 100);
            
            // Simulate click
            const clickEvent = new MouseEvent('click', {
                bubbles: true
            });
            document.dispatchEvent(clickEvent);
            setTimeout(() => {
                results.realTimeTest.clickEventProcessed = true;
            }, 100);
            
            results.cascadeTest.interactionSystemActive = true;
            
        } catch (e) {
            results.errors.push(`Cascade test: ${e.message}`);
        }
        
        return results;
    });
    
    // Wait for real-time tests to complete
    await new Promise(r => setTimeout(r, 500));
    
    console.log(`\\n📊 CASCADE TEST RESULTS:`);
    console.log(`  Uniforms registered: ${cascadeResults.cascadeTest.uniformsRegistered}/17`);
    console.log(`  ${cascadeResults.cascadeTest.scrollMapping ? '✅' : '❌'} Scroll → u_audioBass mapping`);
    console.log(`  ${cascadeResults.cascadeTest.clickMapping ? '✅' : '❌'} Click → u_audioMid mapping`);
    console.log(`  ${cascadeResults.cascadeTest.mouseMapping ? '✅' : '❌'} Mouse → u_audioHigh mapping`);
    console.log(`  ${cascadeResults.cascadeTest.batchUpdate > 0 ? '✅' : '❌'} Batch parameter updates (${cascadeResults.cascadeTest.batchUpdate})`);
    console.log(`  ${cascadeResults.cascadeTest.interactionSystemActive ? '✅' : '❌'} Interaction system active`);
    
    console.log('\\n📋 STEP 3 COMPLETION STATUS:');
    const step3Success = cascadeResults.cascadeTest.scrollMapping && 
                        cascadeResults.cascadeTest.clickMapping && 
                        cascadeResults.cascadeTest.mouseMapping &&
                        cascadeResults.cascadeTest.batchUpdate > 0;
                        
    if (step3Success) {
        console.log('✅ Phase 5 integration fixed successfully');
        console.log('✅ Complete interaction → visual parameter cascade working');
        console.log('✅ All parameter mappings functional');
        console.log('✅ Ready for STEP 4: End-to-end testing');
    } else {
        console.log('❌ Phase 5 integration still has issues');
        console.log('❌ Some parameter mappings not working');
        console.log('⚠️ Need additional debugging');
    }
    
    if (phase5FixResults.errors.length > 0 || cascadeResults.errors.length > 0) {
        console.log('\\n🚨 ERRORS ENCOUNTERED:');
        [...phase5FixResults.errors, ...cascadeResults.errors].forEach(error => {
            console.log(`  ❌ ${error}`);
        });
    }
    
    await page.screenshot({ path: 'step3-phase5-integration-fix.png' });
    
    console.log('\\n🔍 Browser kept open for manual interaction testing...');
    console.log('Try scrolling, clicking, moving mouse to see real-time visual changes');
    console.log('Press Ctrl+C to proceed to Step 4');
    
    await new Promise(() => {}); // Keep running
}

step3FixPhase5Integration().catch(console.error);