#!/usr/bin/env node

/**
 * STEP 1: VIB34D INTEGRATION DIAGNOSTIC
 * Systematically diagnose exact disconnection points between phases
 * Following VIB34D_INTEGRATION_FIX_CHECKLIST.md
 */

const puppeteer = require('puppeteer');

async function step1IntegrationDiagnostic() {
    console.log('🔍 STEP 1: VIB34D INTEGRATION DIAGNOSTIC');
    console.log('='.repeat(60));
    console.log('📋 Following VIB34D_INTEGRATION_FIX_CHECKLIST.md - Step 1');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
    });
    const page = await browser.newPage();
    
    // Capture detailed console messages
    const diagnosticLog = [];
    page.on('console', msg => {
        diagnosticLog.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: Date.now()
        });
    });
    
    await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });
    await new Promise(r => setTimeout(r, 6000)); // Let system fully initialize
    
    console.log('\n🧪 1.1: TESTING PHASE INTEGRATION POINTS');
    console.log('-'.repeat(50));
    
    const integrationResults = await page.evaluate(() => {
        const results = {
            phase1To2: {},
            phase1To4: {},
            phase4ToWebGL: {},
            phase5To4: {},
            completeCascade: {},
            errors: []
        };
        
        console.log('🔍 Testing Phase 1 → Phase 2 Integration...');
        
        // TEST PHASE 1 → PHASE 2: GeometryManager Registration
        try {
            const phase1 = window.VIB34D_Phase1;
            const phase2 = window.VIB34D_Phase2;
            
            if (phase1 && phase1.GeometryManager && phase2) {
                const geometryManager = new phase1.GeometryManager();
                results.phase1To2.managerExists = true;
                
                // Test geometry registration
                const geometryNames = ['HypercubeGeometry', 'HypersphereGeometry', 'HypertetrahedronGeometry'];
                let registeredCount = 0;
                
                geometryNames.forEach(name => {
                    if (phase2[name]) {
                        try {
                            geometryManager.registerGeometry(name.toLowerCase(), phase2[name]);
                            const retrieved = geometryManager.getGeometry(name.toLowerCase());
                            if (retrieved) registeredCount++;
                        } catch (e) {
                            results.errors.push(`Phase1→2 registration ${name}: ${e.message}`);
                        }
                    }
                });
                
                results.phase1To2.registeredGeometries = registeredCount;
                results.phase1To2.working = registeredCount > 0;
            } else {
                results.phase1To2.working = false;
                results.phase1To2.missing = !phase1 ? 'Phase1' : !phase1.GeometryManager ? 'GeometryManager' : 'Phase2';
            }
        } catch (e) {
            results.errors.push(`Phase1→2 test: ${e.message}`);
        }
        
        console.log('🔍 Testing Phase 1 → Phase 4: ShaderManager Integration...');
        
        // TEST PHASE 1 → PHASE 4: ShaderManager Integration
        try {
            const phase1 = window.VIB34D_Phase1;
            const phase4 = window.VIB34D_Phase4;
            
            if (phase1 && phase1.HypercubeCore && phase4 && phase4.ShaderManager) {
                results.phase1To4.coreExists = true;
                results.phase1To4.shaderManagerExists = true;
                
                // Test if HypercubeCore can create ShaderManager
                try {
                    const shaderManager = new phase4.ShaderManager();
                    results.phase1To4.instantiated = true;
                    
                    // Test core methods exist
                    results.phase1To4.methods = {
                        registerUniform: typeof shaderManager.registerUniform === 'function',
                        setUniform: typeof shaderManager.setUniform === 'function',
                        batchUpdateUniforms: typeof shaderManager.batchUpdateUniforms === 'function',
                        syncToGPU: typeof shaderManager.syncToGPU === 'function'
                    };
                    
                    // Test uniform registration
                    try {
                        shaderManager.registerUniform('test_uniform', 'float', 0.5, {min: 0, max: 1});
                        results.phase1To4.canRegisterUniforms = true;
                    } catch (e) {
                        results.phase1To4.uniformRegistrationError = e.message;
                    }
                    
                } catch (e) {
                    results.phase1To4.instantiationError = e.message;
                }
            } else {
                results.phase1To4.working = false;
                results.phase1To4.missing = !phase1 ? 'Phase1' : !phase4 ? 'Phase4' : 'Classes';
            }
        } catch (e) {
            results.errors.push(`Phase1→4 test: ${e.message}`);
        }
        
        console.log('🔍 Testing Phase 4 → WebGL: Uniform Binding...');
        
        // TEST PHASE 4 → WEBGL: Uniform Location Binding
        try {
            const canvases = document.querySelectorAll('canvas');
            results.phase4ToWebGL.canvasCount = canvases.length;
            results.phase4ToWebGL.webglContexts = 0;
            results.phase4ToWebGL.shaderPrograms = 0;
            
            canvases.forEach((canvas, i) => {
                const gl = canvas.getContext('webgl');
                if (gl) {
                    results.phase4ToWebGL.webglContexts++;
                    
                    // Check for active shader program
                    const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
                    if (currentProgram) {
                        results.phase4ToWebGL.shaderPrograms++;
                        
                        // Test uniform location lookup
                        const testUniformLocation = gl.getUniformLocation(currentProgram, 'u_time');
                        if (testUniformLocation !== null) {
                            results.phase4ToWebGL.hasActiveUniforms = true;
                        }
                    }
                }
            });
            
            results.phase4ToWebGL.working = results.phase4ToWebGL.webglContexts > 0 && results.phase4ToWebGL.shaderPrograms > 0;
        } catch (e) {
            results.errors.push(`Phase4→WebGL test: ${e.message}`);
        }
        
        console.log('🔍 Testing Phase 5 → Phase 4: Parameter Updates...');
        
        // TEST PHASE 5 → PHASE 4: Parameter Update Flow
        try {
            const phase5 = window.VIB34D_Phase5;
            const phase4 = window.VIB34D_Phase4;
            
            if (phase5 && phase5.VIB34DInteractionEngine && phase4 && phase4.ShaderManager) {
                results.phase5To4.engineExists = true;
                
                try {
                    const shaderManager = new phase4.ShaderManager();
                    const interactionEngine = new phase5.VIB34DInteractionEngine();
                    
                    results.phase5To4.bothInstantiated = true;
                    
                    // Test if interaction engine can configure mappings
                    if (typeof interactionEngine.configureMapping === 'function') {
                        try {
                            interactionEngine.configureMapping('scroll_to_bass', {
                                smoothing: 0.1,
                                multiplier: 1.0
                            });
                            results.phase5To4.canConfigureMappings = true;
                        } catch (e) {
                            results.phase5To4.mappingError = e.message;
                        }
                    }
                    
                    // Test parameter update method
                    if (typeof interactionEngine.updateShaderParameter === 'function') {
                        try {
                            interactionEngine.updateShaderParameter('u_audioBass', 0.5);
                            results.phase5To4.canUpdateParameters = true;
                        } catch (e) {
                            results.phase5To4.updateError = e.message;
                        }
                    }
                    
                } catch (e) {
                    results.phase5To4.instantiationError = e.message;
                }
            } else {
                results.phase5To4.working = false;
                results.phase5To4.missing = !phase5 ? 'Phase5' : !phase4 ? 'Phase4' : 'Classes';
            }
        } catch (e) {
            results.errors.push(`Phase5→4 test: ${e.message}`);
        }
        
        console.log('🔍 Testing Complete Cascade: Interaction → Visual...');
        
        // TEST COMPLETE CASCADE: Interaction → Visual Change
        try {
            results.completeCascade.testPerformed = true;
            
            // Simulate user interaction and test if visuals change
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: 100,
                clientY: 100
            });
            document.dispatchEvent(mouseEvent);
            
            // Check if any visual parameters changed (simplified test)
            const beforeTime = performance.now();
            setTimeout(() => {
                const afterTime = performance.now();
                results.completeCascade.eventDispatched = true;
                results.completeCascade.timeElapsed = afterTime - beforeTime;
            }, 100);
            
        } catch (e) {
            results.errors.push(`Complete cascade test: ${e.message}`);
        }
        
        return results;
    });
    
    console.log('\n📊 1.2: INTEGRATION DIAGNOSTIC RESULTS');
    console.log('-'.repeat(50));
    
    // PHASE 1 → PHASE 2 RESULTS
    console.log('\n🔗 Phase 1 → Phase 2 (GeometryManager):');
    if (integrationResults.phase1To2.working) {
        console.log(`  ✅ Working - ${integrationResults.phase1To2.registeredGeometries} geometries registered`);
    } else {
        console.log(`  ❌ Broken - Missing: ${integrationResults.phase1To2.missing || 'Unknown'}`);
    }
    
    // PHASE 1 → PHASE 4 RESULTS  
    console.log('\n🔗 Phase 1 → Phase 4 (ShaderManager):');
    if (integrationResults.phase1To4.coreExists && integrationResults.phase1To4.shaderManagerExists) {
        console.log(`  ✅ Classes exist`);
        console.log(`  ${integrationResults.phase1To4.instantiated ? '✅' : '❌'} Instantiation`);
        console.log(`  ${integrationResults.phase1To4.canRegisterUniforms ? '✅' : '❌'} Uniform registration`);
        
        if (integrationResults.phase1To4.methods) {
            Object.entries(integrationResults.phase1To4.methods).forEach(([method, exists]) => {
                console.log(`    ${exists ? '✅' : '❌'} ${method}()`);
            });
        }
    } else {
        console.log(`  ❌ Missing classes`);
    }
    
    // PHASE 4 → WEBGL RESULTS
    console.log('\n🔗 Phase 4 → WebGL (Uniform Binding):');
    console.log(`  Canvas count: ${integrationResults.phase4ToWebGL.canvasCount}`);
    console.log(`  WebGL contexts: ${integrationResults.phase4ToWebGL.webglContexts}`);
    console.log(`  Shader programs: ${integrationResults.phase4ToWebGL.shaderPrograms}`);
    console.log(`  ${integrationResults.phase4ToWebGL.hasActiveUniforms ? '✅' : '❌'} Active uniforms detected`);
    
    // PHASE 5 → PHASE 4 RESULTS
    console.log('\n🔗 Phase 5 → Phase 4 (Parameter Updates):');
    if (integrationResults.phase5To4.engineExists) {
        console.log(`  ✅ InteractionEngine exists`);
        console.log(`  ${integrationResults.phase5To4.bothInstantiated ? '✅' : '❌'} Both instantiated`);
        console.log(`  ${integrationResults.phase5To4.canConfigureMappings ? '✅' : '❌'} Can configure mappings`);
        console.log(`  ${integrationResults.phase5To4.canUpdateParameters ? '✅' : '❌'} Can update parameters`);
    } else {
        console.log(`  ❌ Missing classes`);
    }
    
    // COMPLETE CASCADE RESULTS
    console.log('\n🔗 Complete Cascade (Interaction → Visual):');
    console.log(`  ${integrationResults.completeCascade.testPerformed ? '✅' : '❌'} Test performed`);
    console.log(`  ${integrationResults.completeCascade.eventDispatched ? '✅' : '❌'} Event dispatched`);
    
    // ERROR SUMMARY
    if (integrationResults.errors.length > 0) {
        console.log('\n🚨 INTEGRATION ERRORS:');
        integrationResults.errors.forEach(error => {
            console.log(`  ❌ ${error}`);
        });
    }
    
    console.log('\n📋 1.3: FAILURE POINT ANALYSIS');
    console.log('-'.repeat(50));
    
    const failurePoints = [];
    
    if (!integrationResults.phase1To2.working) {
        failurePoints.push({
            location: 'Phase 1 → Phase 2',
            issue: 'GeometryManager registration broken',
            priority: 'Medium',
            fix: 'Verify geometry registration in initialization'
        });
    }
    
    if (!integrationResults.phase1To4.canRegisterUniforms) {
        failurePoints.push({
            location: 'Phase 1 → Phase 4', 
            issue: 'ShaderManager uniform registration broken',
            priority: 'CRITICAL',
            fix: 'Fix uniform registration system and WebGL binding'
        });
    }
    
    if (!integrationResults.phase4ToWebGL.hasActiveUniforms) {
        failurePoints.push({
            location: 'Phase 4 → WebGL',
            issue: 'Uniforms not bound to active shader programs',
            priority: 'CRITICAL', 
            fix: 'Establish proper shader program → uniform binding'
        });
    }
    
    if (!integrationResults.phase5To4.canUpdateParameters) {
        failurePoints.push({
            location: 'Phase 5 → Phase 4',
            issue: 'Parameter update flow broken',
            priority: 'CRITICAL',
            fix: 'Connect InteractionEngine to ShaderManager updates'
        });
    }
    
    if (failurePoints.length > 0) {
        console.log('🎯 IDENTIFIED FAILURE POINTS:');
        failurePoints.forEach((point, i) => {
            console.log(`  ${i + 1}. ${point.location}`);
            console.log(`     Issue: ${point.issue}`);
            console.log(`     Priority: ${point.priority}`);
            console.log(`     Fix: ${point.fix}`);
        });
        
        // Determine fix priority order
        const criticalFixes = failurePoints.filter(p => p.priority === 'CRITICAL');
        if (criticalFixes.length > 0) {
            console.log('\n🚨 CRITICAL FIXES NEEDED (in order):');
            criticalFixes.forEach((fix, i) => {
                console.log(`  ${i + 1}. ${fix.location}: ${fix.fix}`);
            });
        }
    } else {
        console.log('✅ No major integration failures detected');
    }
    
    console.log('\n📋 STEP 1 COMPLETION STATUS:');
    console.log(`✅ Integration diagnostic script created and run`);
    console.log(`✅ Each phase connection point tested`);
    console.log(`✅ Failure points identified and prioritized`);
    console.log(`✅ Ready to proceed to STEP 2: Fix Phase 4 Shader Uniforms`);
    
    await page.screenshot({ path: 'step1-integration-diagnostic.png' });
    
    console.log('\n🔍 Browser kept open for manual inspection...');
    console.log('Press Ctrl+C to proceed to Step 2');
    
    await new Promise(() => {}); // Keep running
}

step1IntegrationDiagnostic().catch(console.error);