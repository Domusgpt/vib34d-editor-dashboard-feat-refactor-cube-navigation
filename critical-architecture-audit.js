#!/usr/bin/env node

/**
 * CRITICAL VIB34D ARCHITECTURE AUDIT
 * Tests actual implementation against documentation specifications
 * BE FUCKING THOROUGH AND CRITICAL - Paul's orders
 */

const puppeteer = require('puppeteer');

async function criticalArchitectureAudit() {
    console.log('🚨 CRITICAL VIB34D ARCHITECTURE AUDIT');
    console.log('='.repeat(70));
    console.log('📋 Testing ACTUAL implementation vs documentation claims');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1920, height: 1080 }
    });
    const page = await browser.newPage();
    
    // Capture ALL console messages for analysis
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: Date.now()
        });
    });
    
    // Track JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => {
        jsErrors.push({
            message: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });
    });
    
    await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });
    await new Promise(r => setTimeout(r, 8000)); // Let system fully load
    
    console.log('\n🔍 PHASE 1: CORE ARCHITECTURE AUDIT');
    console.log('-'.repeat(50));
    
    const phase1Results = await page.evaluate(() => {
        const results = {
            classes: {},
            instances: {},
            methods: {},
            errors: []
        };
        
        console.log('🏗️ Testing Phase 1 Core Architecture...');
        
        // Test for 6 core classes from documentation
        const coreClasses = [
            'BaseGeometry', 'BaseProjection', 'GeometryManager', 
            'ProjectionManager', 'ShaderManager', 'HypercubeCore'
        ];
        
        coreClasses.forEach(className => {
            try {
                // Check if Phase 1 exports the class
                const phase1 = window.VIB34D_Phase1;
                if (phase1 && phase1[className]) {
                    results.classes[className] = { 
                        exists: true, 
                        constructor: typeof phase1[className] === 'function',
                        prototype: !!phase1[className].prototype
                    };
                    
                    // Try to create instance if it's a constructor
                    if (className === 'GeometryManager' || className === 'ProjectionManager') {
                        try {
                            const instance = new phase1[className]();
                            results.instances[className] = { 
                                created: true,
                                methods: Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
                            };
                        } catch (e) {
                            results.instances[className] = { created: false, error: e.message };
                        }
                    }
                } else {
                    results.classes[className] = { exists: false };
                }
            } catch (e) {
                results.errors.push(`Phase 1 ${className}: ${e.message}`);
            }
        });
        
        return results;
    });
    
    console.log('\n🎨 PHASE 2: GEOMETRY SYSTEM AUDIT');
    console.log('-'.repeat(50));
    
    const phase2Results = await page.evaluate(() => {
        const results = {
            geometries: {},
            shaderCode: {},
            parameters: {},
            errors: []
        };
        
        console.log('📐 Testing Phase 2 Geometry System...');
        
        // Test for 8 geometry classes from documentation
        const geometryClasses = [
            'HypercubeGeometry', 'HypersphereGeometry', 'HypertetrahedronGeometry',
            'TorusGeometry', 'KleinBottleGeometry', 'FractalGeometry', 
            'WaveGeometry', 'CrystalGeometry'
        ];
        
        geometryClasses.forEach(className => {
            try {
                const phase2 = window.VIB34D_Phase2;
                if (phase2 && phase2[className]) {
                    results.geometries[className] = { 
                        exists: true,
                        constructor: typeof phase2[className] === 'function'
                    };
                    
                    // Test geometry creation and methods
                    try {
                        const geometry = new phase2[className]();
                        results.parameters[className] = {
                            hasValidateParameters: typeof geometry.validateParameters === 'function',
                            hasGetShaderCode: typeof geometry.getShaderCode === 'function',
                            hasUpdateParameters: typeof geometry.updateParameters === 'function'
                        };
                        
                        // Test shader code generation
                        if (typeof geometry.getShaderCode === 'function') {
                            const shaderCode = geometry.getShaderCode();
                            results.shaderCode[className] = {
                                generated: typeof shaderCode === 'string',
                                length: shaderCode ? shaderCode.length : 0,
                                hasLatticeFunction: shaderCode ? shaderCode.includes('Lattice') : false,
                                has4DMath: shaderCode ? shaderCode.includes('rotateXW') : false
                            };
                        }
                    } catch (e) {
                        results.errors.push(`${className} instantiation: ${e.message}`);
                    }
                } else {
                    results.geometries[className] = { exists: false };
                }
            } catch (e) {
                results.errors.push(`Phase 2 ${className}: ${e.message}`);
            }
        });
        
        return results;
    });
    
    console.log('\n🎛️ PHASE 4: SHADER UNIFORM AUDIT');
    console.log('-'.repeat(50));
    
    const phase4Results = await page.evaluate(() => {
        const results = {
            shaderManager: {},
            uniforms: {},
            validation: {},
            errors: []
        };
        
        console.log('🎛️ Testing Phase 4 Shader Uniform System...');
        
        try {
            const phase4 = window.VIB34D_Phase4;
            if (phase4 && phase4.ShaderManager) {
                results.shaderManager.exists = true;
                
                // Test ShaderManager functionality
                try {
                    const shaderManager = new phase4.ShaderManager();
                    results.shaderManager.instantiated = true;
                    results.shaderManager.methods = Object.getOwnPropertyNames(Object.getPrototypeOf(shaderManager));
                    
                    // Test the 17 uniforms from documentation
                    const requiredUniforms = [
                        'u_resolution', 'u_time', 'u_mouse', 'u_dimension',
                        'u_gridDensity', 'u_lineThickness', 'u_universeModifier', 'u_patternIntensity',
                        'u_morphFactor', 'u_rotationSpeed',
                        'u_shellWidth', 'u_tetraThickness', 'u_glitchIntensity',
                        'u_colorShift', 'u_audioBass', 'u_audioMid', 'u_audioHigh'
                    ];
                    
                    requiredUniforms.forEach(uniformName => {
                        try {
                            if (typeof shaderManager.registerUniform === 'function') {
                                // Test uniform registration
                                shaderManager.registerUniform(uniformName, 'float', 0.0, {min: 0, max: 1});
                                results.uniforms[uniformName] = { registered: true };
                                
                                // Test uniform updates
                                if (typeof shaderManager.setUniform === 'function') {
                                    shaderManager.setUniform(uniformName, 0.5);
                                    results.uniforms[uniformName].updated = true;
                                }
                            } else {
                                results.uniforms[uniformName] = { error: 'No registerUniform method' };
                            }
                        } catch (e) {
                            results.uniforms[uniformName] = { error: e.message };
                        }
                    });
                    
                } catch (e) {
                    results.shaderManager.error = e.message;
                }
            } else {
                results.shaderManager.exists = false;
            }
        } catch (e) {
            results.errors.push(`Phase 4 audit: ${e.message}`);
        }
        
        return results;
    });
    
    console.log('\n🎮 PHASE 5: INTERACTION SYSTEM AUDIT');
    console.log('-'.repeat(50));
    
    const phase5Results = await page.evaluate(() => {
        const results = {
            interactionEngine: {},
            eventHandlers: {},
            parameterMapping: {},
            errors: []
        };
        
        console.log('🎮 Testing Phase 5 Interaction System...');
        
        try {
            const phase5 = window.VIB34D_Phase5;
            if (phase5 && phase5.VIB34DInteractionEngine) {
                results.interactionEngine.exists = true;
                
                // Test interaction engine creation
                try {
                    const engine = new phase5.VIB34DInteractionEngine();
                    results.interactionEngine.instantiated = true;
                    results.interactionEngine.methods = Object.getOwnPropertyNames(Object.getPrototypeOf(engine));
                    
                    // Test documented interaction mappings
                    const mappings = ['scroll_to_bass', 'click_to_mid', 'mouse_to_high'];
                    mappings.forEach(mapping => {
                        if (typeof engine.configureMapping === 'function') {
                            try {
                                engine.configureMapping(mapping, { smoothing: 0.1 });
                                results.parameterMapping[mapping] = { configured: true };
                            } catch (e) {
                                results.parameterMapping[mapping] = { error: e.message };
                            }
                        }
                    });
                    
                } catch (e) {
                    results.interactionEngine.error = e.message;
                }
            } else {
                results.interactionEngine.exists = false;
            }
        } catch (e) {
            results.errors.push(`Phase 5 audit: ${e.message}`);
        }
        
        return results;
    });
    
    console.log('\n🎨 VISUAL SYSTEM REALITY CHECK');
    console.log('-'.repeat(50));
    
    const visualResults = await page.evaluate(() => {
        const results = {
            canvases: {},
            webgl: {},
            rendering: {},
            errors: []
        };
        
        console.log('👁️ Testing actual visual system...');
        
        // Analyze actual canvas elements
        const canvases = document.querySelectorAll('canvas');
        results.canvases.count = canvases.length;
        results.canvases.details = [];
        
        canvases.forEach((canvas, i) => {
            const gl = canvas.getContext('webgl');
            const detail = {
                id: canvas.id || `canvas-${i}`,
                width: canvas.width,
                height: canvas.height,
                hasWebGL: !!gl,
                programs: 0
            };
            
            if (gl) {
                // Count shader programs
                try {
                    const ext = gl.getExtension('WEBGL_debug_renderer_info');
                    detail.renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
                } catch (e) {
                    // Ignore
                }
            }
            
            results.canvases.details.push(detail);
        });
        
        // Test actual face system
        const faces = [];
        for (let i = 0; i < 8; i++) {
            const face = document.querySelector(`#face-${i}`);
            if (face) {
                faces.push({
                    id: `face-${i}`,
                    visible: face.style.display !== 'none',
                    hasContent: face.children.length > 0,
                    canvasCount: face.querySelectorAll('canvas').length
                });
            }
        }
        results.rendering.faces = faces;
        
        return results;
    });
    
    // COMPILE CRITICAL FINDINGS
    console.log('\n🚨 CRITICAL AUDIT RESULTS');
    console.log('='.repeat(70));
    
    console.log('\n📊 PHASE 1 - CORE ARCHITECTURE:');
    const phase1Classes = Object.values(phase1Results.classes).filter(c => c.exists).length;
    console.log(`  Classes Found: ${phase1Classes}/6 required`);
    Object.entries(phase1Results.classes).forEach(([name, data]) => {
        const status = data.exists ? '✅' : '❌';
        console.log(`  ${status} ${name}`);
    });
    
    console.log('\n📊 PHASE 2 - GEOMETRY SYSTEM:');
    const phase2Geometries = Object.values(phase2Results.geometries).filter(g => g.exists).length;
    console.log(`  Geometries Found: ${phase2Geometries}/8 required`);
    Object.entries(phase2Results.geometries).forEach(([name, data]) => {
        const status = data.exists ? '✅' : '❌';
        console.log(`  ${status} ${name}`);
    });
    
    console.log('\n📊 PHASE 4 - SHADER UNIFORMS:');
    const phase4Uniforms = Object.values(phase4Results.uniforms).filter(u => u.registered).length;
    console.log(`  Uniforms Working: ${phase4Uniforms}/17 required`);
    console.log(`  ShaderManager: ${phase4Results.shaderManager.exists ? '✅' : '❌'}`);
    
    console.log('\n📊 PHASE 5 - INTERACTION SYSTEM:');
    console.log(`  InteractionEngine: ${phase5Results.interactionEngine.exists ? '✅' : '❌'}`);
    const mappings = Object.values(phase5Results.parameterMapping).filter(m => m.configured).length;
    console.log(`  Parameter Mappings: ${mappings}/3 required`);
    
    console.log('\n📊 VISUAL SYSTEM REALITY:');
    console.log(`  Canvas Elements: ${visualResults.canvases.count}`);
    console.log(`  WebGL Contexts: ${visualResults.canvases.details.filter(c => c.hasWebGL).length}`);
    console.log(`  Active Faces: ${visualResults.rendering.faces.filter(f => f.visible).length}/8`);
    
    // CRITICAL GAPS ANALYSIS
    console.log('\n🚨 CRITICAL GAPS IDENTIFIED:');
    const criticalIssues = [];
    
    if (phase1Classes < 6) {
        criticalIssues.push(`Missing ${6 - phase1Classes} core architecture classes`);
    }
    
    if (phase2Geometries < 8) {
        criticalIssues.push(`Missing ${8 - phase2Geometries} geometry implementations`);
    }
    
    if (phase4Uniforms < 17) {
        criticalIssues.push(`Missing ${17 - phase4Uniforms} shader uniforms`);
    }
    
    if (jsErrors.length > 0) {
        criticalIssues.push(`${jsErrors.length} JavaScript runtime errors`);
    }
    
    if (criticalIssues.length > 0) {
        criticalIssues.forEach(issue => console.log(`  ❌ ${issue}`));
        console.log('\n⚠️  SYSTEM NOT READY - MAJOR GAPS EXIST');
    } else {
        console.log('  ✅ No critical gaps - system appears functional');
        console.log('\n🎯 SYSTEM READY FOR DEPLOYMENT');
    }
    
    // JavaScript Errors Report
    if (jsErrors.length > 0) {
        console.log('\n🔥 JAVASCRIPT ERRORS:');
        jsErrors.forEach(error => {
            console.log(`  ❌ ${error.message}`);
        });
    }
    
    console.log('\n🔍 Full audit complete - check results above');
    
    await page.screenshot({ path: 'critical-architecture-audit.png' });
    
    // Keep browser open for manual verification
    console.log('\n🔍 Browser kept open for manual inspection...');
    console.log('Press Ctrl+C when done');
    
    await new Promise(() => {}); // Keep running
}

criticalArchitectureAudit().catch(console.error);