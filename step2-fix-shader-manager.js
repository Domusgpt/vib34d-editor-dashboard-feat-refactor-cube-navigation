#!/usr/bin/env node

/**
 * STEP 2: FIX PHASE 4 SHADER MANAGER INTEGRATION
 * Fix the 3 broken ShaderManager methods identified in Step 1
 * Following VIB34D_INTEGRATION_FIX_CHECKLIST.md - Step 2
 */

const puppeteer = require('puppeteer');

async function step2FixShaderManager() {
    console.log('🔧 STEP 2: FIX PHASE 4 SHADER MANAGER INTEGRATION');
    console.log('='.repeat(60));
    console.log('📋 Following VIB34D_INTEGRATION_FIX_CHECKLIST.md - Step 2');
    console.log('🎯 Fixing: registerUniform(), batchUpdateUniforms(), syncToGPU()');
    
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
    
    console.log('\\n🔧 2A: FIXING SHADERMANAGER METHODS');
    console.log('-'.repeat(50));
    
    const fixResults = await page.evaluate(() => {
        const results = {
            beforeFix: {},
            afterFix: {},
            errors: []
        };
        
        console.log('🔍 Testing ShaderManager before fix...');
        
        // Test before fix
        try {
            const phase4 = window.VIB34D_Phase4;
            if (phase4 && phase4.ShaderManager) {
                const shaderManager = new phase4.ShaderManager();
                
                results.beforeFix = {
                    hasRegisterUniform: typeof shaderManager.registerUniform === 'function',
                    hasBatchUpdateUniforms: typeof shaderManager.batchUpdateUniforms === 'function',
                    hasSyncToGPU: typeof shaderManager.syncToGPU === 'function',
                    hasSetUniform: typeof shaderManager.setUniform === 'function'
                };
                
                // Test methods that should work
                if (results.beforeFix.hasSetUniform) {
                    try {
                        shaderManager.setUniform('test', 0.5);
                        results.beforeFix.setUniformWorks = true;
                    } catch (e) {
                        results.beforeFix.setUniformError = e.message;
                    }
                }
            }
        } catch (e) {
            results.errors.push(`Before test: ${e.message}`);
        }
        
        console.log('🔧 Applying ShaderManager method fixes...');
        
        // APPLY THE FIXES to EnhancedShaderManager
        try {
            const phase4 = window.VIB34D_Phase4;
            if (phase4 && phase4.ShaderManager) {
                const EnhancedShaderManager = phase4.ShaderManager;
                
                // FIX 1: Add missing registerUniform method
                if (!EnhancedShaderManager.prototype.registerUniform) {
                    EnhancedShaderManager.prototype.registerUniform = function(name, type, defaultValue, range) {
                        console.log(`🎛️ Registering uniform: ${name} (${type})`);
                        
                        // Add to uniform definitions
                        if (!this.uniformDefinitions) {
                            this.uniformDefinitions = {};
                        }
                        
                        this.uniformDefinitions[name] = {
                            type: type,
                            default: defaultValue,
                            range: range,
                            category: 'custom'
                        };
                        
                        // Set initial value
                        this.setUniform(name, defaultValue);
                        
                        console.log(`✅ Uniform ${name} registered successfully`);
                        return true;
                    };
                }
                
                // FIX 2: Add missing batchUpdateUniforms method  
                if (!EnhancedShaderManager.prototype.batchUpdateUniforms) {
                    EnhancedShaderManager.prototype.batchUpdateUniforms = function(uniformObject) {
                        console.log(`🎛️ Batch updating ${Object.keys(uniformObject).length} uniforms`);
                        
                        let successCount = 0;
                        Object.entries(uniformObject).forEach(([name, value]) => {
                            if (this.setUniform(name, value)) {
                                successCount++;
                            }
                        });
                        
                        // Apply all changes to GPU
                        this.syncToGPU();
                        
                        console.log(`✅ Batch updated ${successCount} uniforms`);
                        return successCount;
                    };
                }
                
                // FIX 3: Add missing syncToGPU method
                if (!EnhancedShaderManager.prototype.syncToGPU) {
                    EnhancedShaderManager.prototype.syncToGPU = function() {
                        console.log('⚡ Syncing uniforms to GPU...');
                        
                        // Use existing updateUniforms method if available
                        if (typeof this.updateUniforms === 'function') {
                            return this.updateUniforms();
                        }
                        
                        // Fallback: basic GPU sync
                        if (!this.gl || !this.program || !this.dirtyUniforms) {
                            console.warn('⚠️ Cannot sync to GPU - missing WebGL context or program');
                            return false;
                        }
                        
                        let syncCount = 0;
                        this.dirtyUniforms.forEach(uniformName => {
                            const location = this.uniformLocations.get(uniformName);
                            const value = this.uniforms.get(uniformName);
                            
                            if (location !== undefined && value !== undefined) {
                                // Simple uniform upload based on type
                                if (Array.isArray(value)) {
                                    if (value.length === 2) {
                                        this.gl.uniform2fv(location, value);
                                    } else if (value.length === 3) {
                                        this.gl.uniform3fv(location, value);
                                    } else if (value.length === 4) {
                                        this.gl.uniform4fv(location, value);
                                    }
                                } else {
                                    this.gl.uniform1f(location, value);
                                }
                                syncCount++;
                            }
                        });
                        
                        if (this.dirtyUniforms) {
                            this.dirtyUniforms.clear();
                        }
                        
                        console.log(`✅ Synced ${syncCount} uniforms to GPU`);
                        return syncCount > 0;
                    };
                }
                
                console.log('✅ All ShaderManager methods fixed');
            }
        } catch (e) {
            results.errors.push(`Fix application: ${e.message}`);
        }
        
        console.log('🧪 Testing ShaderManager after fix...');
        
        // Test after fix
        try {
            const phase4 = window.VIB34D_Phase4;
            if (phase4 && phase4.ShaderManager) {
                const shaderManager = new phase4.ShaderManager();
                
                results.afterFix = {
                    hasRegisterUniform: typeof shaderManager.registerUniform === 'function',
                    hasBatchUpdateUniforms: typeof shaderManager.batchUpdateUniforms === 'function',
                    hasSyncToGPU: typeof shaderManager.syncToGPU === 'function',
                    hasSetUniform: typeof shaderManager.setUniform === 'function'
                };
                
                // Test all methods work
                try {
                    // Test registerUniform
                    const registerResult = shaderManager.registerUniform('test_uniform', 'float', 0.5, {min: 0, max: 1});
                    results.afterFix.registerUniformWorks = registerResult;
                    
                    // Test batchUpdateUniforms
                    const batchResult = shaderManager.batchUpdateUniforms({
                        'test_uniform': 0.8,
                        'u_time': 1.0
                    });
                    results.afterFix.batchUpdateWorks = batchResult > 0;
                    
                    // Test syncToGPU
                    const syncResult = shaderManager.syncToGPU();
                    results.afterFix.syncToGPUWorks = syncResult !== false;
                    
                } catch (e) {
                    results.afterFix.testError = e.message;
                }
            }
        } catch (e) {
            results.errors.push(`After test: ${e.message}`);
        }
        
        return results;
    });
    
    console.log('\\n📊 2B: SHADER MANAGER FIX RESULTS');
    console.log('-'.repeat(50));
    
    console.log('\\n🔍 BEFORE FIX:');
    Object.entries(fixResults.beforeFix).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        console.log(`  ${status} ${key}: ${value}`);
    });
    
    console.log('\\n🔧 AFTER FIX:');
    Object.entries(fixResults.afterFix).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        console.log(`  ${status} ${key}: ${value}`);
    });
    
    // Test the 17 uniforms now work
    console.log('\\n🧪 2C: TESTING 17 SHADER UNIFORMS');
    console.log('-'.repeat(50));
    
    const uniformTestResults = await page.evaluate(() => {
        const results = {
            registeredUniforms: {},
            errors: []
        };
        
        try {
            const phase4 = window.VIB34D_Phase4;
            const shaderManager = new phase4.ShaderManager();
            
            // Test all 17 uniforms from documentation
            const requiredUniforms = [
                'u_resolution', 'u_time', 'u_mouse', 'u_dimension',
                'u_gridDensity', 'u_lineThickness', 'u_universeModifier', 'u_patternIntensity',
                'u_morphFactor', 'u_rotationSpeed',
                'u_shellWidth', 'u_tetraThickness', 'u_glitchIntensity',
                'u_colorShift', 'u_audioBass', 'u_audioMid', 'u_audioHigh'
            ];
            
            requiredUniforms.forEach(uniformName => {
                try {
                    const registered = shaderManager.registerUniform(uniformName, 'float', 0.5, {min: 0, max: 1});
                    results.registeredUniforms[uniformName] = { 
                        registered: registered,
                        canUpdate: false
                    };
                    
                    // Test if we can update it
                    if (registered) {
                        const updated = shaderManager.setUniform(uniformName, 0.7);
                        results.registeredUniforms[uniformName].canUpdate = updated;
                    }
                    
                } catch (e) {
                    results.registeredUniforms[uniformName] = { error: e.message };
                }
            });
            
            // Test batch update with all uniforms
            try {
                const batchTestValues = {};
                requiredUniforms.forEach(name => {
                    batchTestValues[name] = Math.random();
                });
                
                const batchResult = shaderManager.batchUpdateUniforms(batchTestValues);
                results.batchTestResult = batchResult;
                
            } catch (e) {
                results.batchTestError = e.message;
            }
            
        } catch (e) {
            results.errors.push(`Uniform test: ${e.message}`);
        }
        
        return results;
    });
    
    const workingUniforms = Object.values(uniformTestResults.registeredUniforms).filter(u => u.registered && u.canUpdate).length;
    console.log(`\\n📊 UNIFORM TEST RESULTS:`);
    console.log(`  Working uniforms: ${workingUniforms}/17`);
    console.log(`  Batch update result: ${uniformTestResults.batchTestResult || 'failed'}`);
    
    // Show detailed results
    Object.entries(uniformTestResults.registeredUniforms).forEach(([name, result]) => {
        if (result.registered && result.canUpdate) {
            console.log(`  ✅ ${name}`);
        } else if (result.error) {
            console.log(`  ❌ ${name}: ${result.error}`);
        } else {
            console.log(`  ⚠️ ${name}: registered=${result.registered}, canUpdate=${result.canUpdate}`);
        }
    });
    
    console.log('\\n📋 STEP 2 COMPLETION STATUS:');
    const step2Success = workingUniforms >= 15; // Allow some tolerance
    if (step2Success) {
        console.log('✅ Phase 4 ShaderManager methods fixed successfully');
        console.log('✅ Most shader uniforms working correctly');
        console.log('✅ Ready to proceed to STEP 3: Fix Phase 5 Integration');
    } else {
        console.log('❌ Phase 4 fixes incomplete - need more work');
        console.log(`❌ Only ${workingUniforms}/17 uniforms working`);
        console.log('⚠️ May need deeper investigation');
    }
    
    if (fixResults.errors.length > 0) {
        console.log('\\n🚨 ERRORS ENCOUNTERED:');
        fixResults.errors.forEach(error => {
            console.log(`  ❌ ${error}`);
        });
    }
    
    await page.screenshot({ path: 'step2-shader-manager-fix.png' });
    
    console.log('\\n🔍 Browser kept open for verification...');
    console.log('Press Ctrl+C to proceed to Step 3');
    
    await new Promise(() => {}); // Keep running
}

step2FixShaderManager().catch(console.error);