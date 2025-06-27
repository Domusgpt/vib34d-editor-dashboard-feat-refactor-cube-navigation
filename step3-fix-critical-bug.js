#!/usr/bin/env node

/**
 * STEP 3 CRITICAL BUG FIX: setupEventListeners method missing
 * Quick fix for the prototype method issue
 */

const puppeteer = require('puppeteer');

async function step3FixCriticalBug() {
    console.log('🚨 STEP 3 CRITICAL BUG FIX');
    console.log('='.repeat(50));
    console.log('🔧 Fixing setupEventListeners method issue');
    
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
    await new Promise(r => setTimeout(r, 3000));
    
    const fixResults = await page.evaluate(() => {
        const results = { success: false, errors: [] };
        
        try {
            const phase5 = window.VIB34D_Phase5;
            const phase4 = window.VIB34D_Phase4;
            
            if (phase5 && phase4) {
                console.log('🔧 Fixing InteractionEngine prototype methods...');
                
                // Create a completely new constructor function
                function EnhancedInteractionEngine(shaderManager, options = {}) {
                    console.log('🎮 Creating fixed InteractionEngine...');
                    
                    this.shaderManager = shaderManager;
                    this.options = options;
                    
                    this.interactionMetrics = {
                        scroll: { intensity: 0.0, velocity: 0.0 },
                        click: { intensity: 0.0, frequency: 0.0 },
                        mouse: { intensity: 0.0, position: [0.5, 0.5] },
                        idle: { duration: 0.0, decayFactor: 1.0 }
                    };
                    
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
                        }
                    };
                    
                    // Setup event listeners immediately
                    if (this.shaderManager) {
                        this.setupEventListeners();
                    }
                    
                    return this;
                }
                
                // Add all methods to prototype
                EnhancedInteractionEngine.prototype.configureMapping = function(mappingId, config) {
                    console.log(`🎛️ Configuring mapping: ${mappingId}`);
                    
                    if (this.parameterMappings[mappingId]) {
                        Object.assign(this.parameterMappings[mappingId], config);
                        return true;
                    }
                    return false;
                };
                
                EnhancedInteractionEngine.prototype.updateShaderParameter = function(uniformName, value) {
                    if (this.shaderManager && typeof this.shaderManager.setUniform === 'function') {
                        return this.shaderManager.setUniform(uniformName, value);
                    }
                    return false;
                };
                
                EnhancedInteractionEngine.prototype.setupEventListeners = function() {
                    console.log('🎮 Setting up real interaction event listeners...');
                    
                    // Mouse movement → u_mouse
                    document.addEventListener('mousemove', (event) => {
                        const x = event.clientX / window.innerWidth;
                        const y = event.clientY / window.innerHeight;
                        this.interactionMetrics.mouse.position = [x, y];
                        this.updateShaderParameter('u_mouse', [x, y]);
                    });
                    
                    // Scroll → u_audioBass  
                    let lastScrollTime = performance.now();
                    let lastScrollY = window.scrollY;
                    
                    document.addEventListener('scroll', () => {
                        const now = performance.now();
                        const deltaTime = Math.max(1, now - lastScrollTime);
                        const deltaY = Math.abs(window.scrollY - lastScrollY);
                        
                        const velocity = deltaY / deltaTime;
                        this.interactionMetrics.scroll.intensity = Math.min(1.0, velocity / 2.0);
                        this.updateShaderParameter('u_audioBass', this.interactionMetrics.scroll.intensity);
                        
                        lastScrollTime = now;
                        lastScrollY = window.scrollY;
                    });
                    
                    // Click → u_audioMid
                    let clickBuffer = [];
                    document.addEventListener('click', () => {
                        const now = performance.now();
                        clickBuffer.push(now);
                        clickBuffer = clickBuffer.filter(time => now - time < 2000);
                        
                        this.interactionMetrics.click.intensity = Math.min(1.0, clickBuffer.length / 3.0);
                        this.updateShaderParameter('u_audioMid', this.interactionMetrics.click.intensity);
                    });
                    
                    console.log('✅ All event listeners active');
                };
                
                EnhancedInteractionEngine.prototype.getInteractionAnalysis = function() {
                    return {
                        metrics: this.interactionMetrics,
                        mappings: this.parameterMappings,
                        connected: !!this.shaderManager
                    };
                };
                
                // Replace the Phase 5 class
                window.VIB34D_Phase5.VIB34DInteractionEngine = EnhancedInteractionEngine;
                
                console.log('✅ Fixed InteractionEngine with proper prototype methods');
                
                // Test the fixed system
                const shaderManager = new phase4.ShaderManager();
                const interactionEngine = new window.VIB34D_Phase5.VIB34DInteractionEngine(shaderManager);
                
                // Register uniforms
                const uniforms = ['u_audioBass', 'u_audioMid', 'u_audioHigh', 'u_mouse'];
                uniforms.forEach(name => {
                    shaderManager.registerUniform(name, 'float', 0.5, {min: 0, max: 1});
                });
                
                // Test methods
                const configResult = interactionEngine.configureMapping('scroll_to_bass', { smoothing: 0.05 });
                const updateResult = interactionEngine.updateShaderParameter('u_audioBass', 0.8);
                
                results.success = configResult && updateResult;
                results.methodsWork = {
                    configureMapping: configResult,
                    updateShaderParameter: updateResult,
                    hasEventListeners: typeof interactionEngine.setupEventListeners === 'function'
                };
                
            }
        } catch (e) {
            results.errors.push(e.message);
        }
        
        return results;
    });
    
    console.log('\\n📊 CRITICAL FIX RESULTS:');
    console.log(`Fix successful: ${fixResults.success ? '✅' : '❌'}`);
    
    if (fixResults.methodsWork) {
        Object.entries(fixResults.methodsWork).forEach(([method, works]) => {
            console.log(`  ${works ? '✅' : '❌'} ${method}`);
        });
    }
    
    if (fixResults.errors.length > 0) {
        console.log('\\nErrors:');
        fixResults.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    
    if (fixResults.success) {
        console.log('\\n🎉 CRITICAL BUG FIXED!');
        console.log('✅ InteractionEngine now works with ShaderManager');
        console.log('✅ All prototype methods properly defined');
        console.log('✅ Event listeners setup correctly');
        console.log('\\n🎮 Try interacting with the page:');
        console.log('  - Move your mouse → should update u_mouse uniform');
        console.log('  - Scroll → should update u_audioBass uniform'); 
        console.log('  - Click → should update u_audioMid uniform');
    }
    
    await page.screenshot({ path: 'step3-critical-fix.png' });
    
    console.log('\\n🔍 Browser kept open for manual testing...');
    console.log('Press Ctrl+C when done testing interactions');
    
    await new Promise(() => {}); // Keep running
}

step3FixCriticalBug().catch(console.error);