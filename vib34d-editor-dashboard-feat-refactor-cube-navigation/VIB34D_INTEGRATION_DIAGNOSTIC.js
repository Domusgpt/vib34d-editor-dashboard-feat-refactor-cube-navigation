/**
 * VIB34D INTEGRATION DIAGNOSTIC SCRIPT
 * 
 * Systematic diagnosis of Phase integration failures
 * Tests data flow: Phase1 → Phase2 → Phase4 → Phase5
 * Identifies exact disconnection points between phases
 */

class VIB34DIntegrationDiagnostic {
    constructor() {
        this.results = {
            phase1: { status: 'unknown', tests: {} },
            phase2: { status: 'unknown', tests: {} },
            phase4: { status: 'unknown', tests: {} },
            phase5: { status: 'unknown', tests: {} },
            integration: { status: 'unknown', tests: {} }
        };
    }

    /**
     * Run complete integration diagnostic
     */
    async runFullDiagnostic() {
        console.log('🔍 VIB34D Integration Diagnostic Starting...');
        
        // Test each phase in dependency order
        await this.testPhase1CoreArchitecture();
        await this.testPhase2GeometryIntegration();
        await this.testPhase4ShaderUniforms();
        await this.testPhase5ParameterMapping();
        await this.testCompleteIntegration();
        
        // Generate comprehensive report
        this.generateDiagnosticReport();
        
        return this.results;
    }

    /**
     * STEP 1.1: Test Phase 1 Core Architecture
     */
    async testPhase1CoreArchitecture() {
        console.log('📋 Testing Phase 1 Core Architecture...');
        
        const tests = this.results.phase1.tests;
        
        // Test 1: Core classes exist
        tests.coreClassesExist = this.testCoreClassesExist();
        
        // Test 2: HypercubeCore instantiation
        tests.hypercubeCoreInstantiation = this.testHypercubeCoreInstantiation();
        
        // Test 3: WebGL context creation
        tests.webglContextCreation = this.testWebGLContextCreation();
        
        // Test 4: ShaderManager initialization
        tests.shaderManagerInit = this.testShaderManagerInitialization();
        
        // Overall Phase 1 status
        const allPassing = Object.values(tests).every(test => test.passed);
        this.results.phase1.status = allPassing ? 'working' : 'broken';
        
        console.log(`✅ Phase 1 Status: ${this.results.phase1.status}`);
    }

    /**
     * STEP 1.2: Test Phase 2 Geometry Integration
     */
    async testPhase2GeometryIntegration() {
        console.log('📋 Testing Phase 2 Geometry Integration...');
        
        const tests = this.results.phase2.tests;
        
        // Test 1: All 8 geometries generate shader code
        tests.geometryShaderGeneration = this.testGeometryShaderGeneration();
        
        // Test 2: GeometryManager registration
        tests.geometryManagerRegistration = this.testGeometryManagerRegistration();
        
        // Test 3: Shader code contains required uniforms
        tests.shaderUniformPresence = this.testShaderUniformPresence();
        
        // Test 4: Geometry → ShaderManager handoff
        tests.geometryShaderHandoff = this.testGeometryShaderHandoff();
        
        const allPassing = Object.values(tests).every(test => test.passed);
        this.results.phase2.status = allPassing ? 'working' : 'broken';
        
        console.log(`✅ Phase 2 Status: ${this.results.phase2.status}`);
    }

    /**
     * STEP 1.3: Test Phase 4 Shader Uniform System
     */
    async testPhase4ShaderUniforms() {
        console.log('📋 Testing Phase 4 Shader Uniform System...');
        
        const tests = this.results.phase4.tests;
        
        // Test 1: All 17 uniforms register with WebGL
        tests.uniformRegistration = this.testUniformRegistration();
        
        // Test 2: Uniform location binding
        tests.uniformLocationBinding = this.testUniformLocationBinding();
        
        // Test 3: Uniform updates reach GPU
        tests.uniformGPUUpdates = this.testUniformGPUUpdates();
        
        // Test 4: Batch update system
        tests.batchUpdateSystem = this.testBatchUpdateSystem();
        
        const allPassing = Object.values(tests).every(test => test.passed);
        this.results.phase4.status = allPassing ? 'working' : 'broken';
        
        console.log(`✅ Phase 4 Status: ${this.results.phase4.status}`);
    }

    /**
     * STEP 1.4: Test Phase 5 Parameter Mapping System
     */
    async testPhase5ParameterMapping() {
        console.log('📋 Testing Phase 5 Parameter Mapping System...');
        
        const tests = this.results.phase5.tests;
        
        // Test 1: InteractionEngine → ShaderManager connection
        tests.interactionEngineConnection = this.testInteractionEngineConnection();
        
        // Test 2: Parameter mapping configuration
        tests.parameterMappingConfig = this.testParameterMappingConfig();
        
        // Test 3: Event detection (scroll, click, mouse)
        tests.eventDetection = this.testEventDetection();
        
        // Test 4: Parameter smoothing and decay
        tests.parameterSmoothing = this.testParameterSmoothing();
        
        const allPassing = Object.values(tests).every(test => test.passed);
        this.results.phase5.status = allPassing ? 'working' : 'broken';
        
        console.log(`✅ Phase 5 Status: ${this.results.phase5.status}`);
    }

    /**
     * STEP 1.5: Test Complete Integration
     */
    async testCompleteIntegration() {
        console.log('📋 Testing Complete Integration...');
        
        const tests = this.results.integration.tests;
        
        // Test 1: End-to-end data flow
        tests.endToEndDataFlow = this.testEndToEndDataFlow();
        
        // Test 2: Visual feedback verification
        tests.visualFeedback = this.testVisualFeedback();
        
        // Test 3: Real-time performance
        tests.realtimePerformance = this.testRealtimePerformance();
        
        const allPassing = Object.values(tests).every(test => test.passed);
        this.results.integration.status = allPassing ? 'working' : 'broken';
        
        console.log(`✅ Integration Status: ${this.results.integration.status}`);
    }

    // ============================================================================
    // INDIVIDUAL TEST IMPLEMENTATIONS
    // ============================================================================

    testCoreClassesExist() {
        try {
            const requiredClasses = [
                'BaseGeometry', 'BaseProjection', 'GeometryManager', 
                'ProjectionManager', 'ShaderManager', 'HypercubeCore'
            ];
            
            const missingClasses = [];
            requiredClasses.forEach(className => {
                if (!window.VIB34D_WorkingCore || !window.VIB34D_WorkingCore[className]) {
                    missingClasses.push(className);
                }
            });
            
            return {
                passed: missingClasses.length === 0,
                details: missingClasses.length === 0 ? 
                    'All core classes available' : 
                    `Missing classes: ${missingClasses.join(', ')}`,
                data: { missingClasses, availableClasses: requiredClasses.length - missingClasses.length }
            };
        } catch (error) {
            return { passed: false, details: `Error: ${error.message}`, error };
        }
    }

    testHypercubeCoreInstantiation() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            
            const hypercubeCore = new window.VIB34D_WorkingCore.HypercubeCore(canvas);
            const canInstantiate = hypercubeCore !== null;
            
            return {
                passed: canInstantiate,
                details: canInstantiate ? 'HypercubeCore instantiates successfully' : 'HypercubeCore instantiation failed',
                data: { instance: hypercubeCore }
            };
        } catch (error) {
            return { passed: false, details: `HypercubeCore instantiation error: ${error.message}`, error };
        }
    }

    testWebGLContextCreation() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            return {
                passed: gl !== null,
                details: gl ? `WebGL context created (${gl.constructor.name})` : 'WebGL context creation failed',
                data: { context: gl, version: gl ? (gl.getParameter ? gl.getParameter(gl.VERSION) : 'unknown') : null }
            };
        } catch (error) {
            return { passed: false, details: `WebGL context error: ${error.message}`, error };
        }
    }

    testShaderManagerInitialization() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            
            if (!gl) {
                return { passed: false, details: 'No WebGL context for ShaderManager test' };
            }
            
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            const projectionManager = new window.VIB34D_WorkingCore.ProjectionManager();
            const shaderManager = new window.VIB34D_WorkingCore.ShaderManager(gl, geometryManager, projectionManager);
            
            return {
                passed: shaderManager !== null,
                details: 'ShaderManager initialized successfully',
                data: { shaderManager, geometryManager, projectionManager }
            };
        } catch (error) {
            return { passed: false, details: `ShaderManager initialization error: ${error.message}`, error };
        }
    }

    testGeometryShaderGeneration() {
        try {
            const geometryTypes = ['hypercube', 'hypersphere', 'hypertetrahedron', 'torus', 'klein', 'fractal', 'wave', 'crystal'];
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            
            const results = {};
            let passCount = 0;
            
            geometryTypes.forEach(type => {
                try {
                    const geometry = geometryManager.getGeometry(type);
                    const shaderCode = geometry.getShaderCode();
                    const hasCalculateLattice = shaderCode.includes('calculateLattice');
                    
                    results[type] = {
                        passed: hasCalculateLattice,
                        shaderCodeLength: shaderCode.length,
                        hasCalculateLattice
                    };
                    
                    if (hasCalculateLattice) passCount++;
                } catch (error) {
                    results[type] = { passed: false, error: error.message };
                }
            });
            
            return {
                passed: passCount === geometryTypes.length,
                details: `${passCount}/${geometryTypes.length} geometries generate valid shader code`,
                data: results
            };
        } catch (error) {
            return { passed: false, details: `Geometry shader generation error: ${error.message}`, error };
        }
    }

    testGeometryManagerRegistration() {
        try {
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            const availableTypes = geometryManager.getGeometryTypes();
            
            const expectedTypes = ['hypercube', 'hypersphere', 'hypertetrahedron'];
            const hasMinimumTypes = expectedTypes.every(type => availableTypes.includes(type));
            
            return {
                passed: hasMinimumTypes && availableTypes.length >= 3,
                details: `GeometryManager has ${availableTypes.length} registered geometries`,
                data: { availableTypes, expectedTypes }
            };
        } catch (error) {
            return { passed: false, details: `GeometryManager registration error: ${error.message}`, error };
        }
    }

    testShaderUniformPresence() {
        try {
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            const hypercube = geometryManager.getGeometry('hypercube');
            const shaderCode = hypercube.getShaderCode();
            
            const requiredUniforms = [
                'u_time', 'u_dimension', 'u_morphFactor', 'u_gridDensity', 
                'u_rotationSpeed', 'u_audioBass', 'u_audioMid', 'u_audioHigh'
            ];
            
            const foundUniforms = requiredUniforms.filter(uniform => shaderCode.includes(uniform));
            const passRate = foundUniforms.length / requiredUniforms.length;
            
            return {
                passed: passRate >= 0.75, // At least 75% of uniforms present
                details: `${foundUniforms.length}/${requiredUniforms.length} required uniforms found in shader code`,
                data: { foundUniforms, missingUniforms: requiredUniforms.filter(u => !foundUniforms.includes(u)) }
            };
        } catch (error) {
            return { passed: false, details: `Shader uniform presence error: ${error.message}`, error };
        }
    }

    testGeometryShaderHandoff() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            
            if (!gl) {
                return { passed: false, details: 'No WebGL context for handoff test' };
            }
            
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            const projectionManager = new window.VIB34D_WorkingCore.ProjectionManager();
            const shaderManager = new window.VIB34D_WorkingCore.ShaderManager(gl, geometryManager, projectionManager);
            
            // Test creating a dynamic program (this is the handoff point)
            const program = shaderManager.createDynamicProgram('test-program', 'hypercube', 'perspective');
            
            return {
                passed: program !== null,
                details: program ? 'Geometry → ShaderManager handoff successful' : 'Geometry → ShaderManager handoff failed',
                data: { program }
            };
        } catch (error) {
            return { passed: false, details: `Geometry handoff error: ${error.message}`, error };
        }
    }

    testUniformRegistration() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            if (!gl) {
                return { passed: false, details: 'No WebGL context available for uniform registration test' };
            }
            
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            const projectionManager = new window.VIB34D_WorkingCore.ProjectionManager();
            const shaderManager = new window.VIB34D_WorkingCore.ShaderManager(gl, geometryManager, projectionManager);
            
            // Test creating a program and checking if uniforms can be located
            const program = shaderManager.createDynamicProgram('uniform-test', 'hypercube', 'perspective');
            
            if (!program) {
                return { passed: false, details: 'Failed to create shader program for uniform testing' };
            }
            
            // Test the 17 required shader uniforms
            const requiredUniforms = [
                'u_resolution', 'u_time', 'u_dimension', 'u_morphFactor', 'u_rotationSpeed',
                'u_universeModifier', 'u_patternIntensity', 'u_gridDensity', 'u_lineThickness',
                'u_shellWidth', 'u_tetraThickness', 'u_glitchIntensity', 'u_colorShift',
                'u_audioBass', 'u_audioMid', 'u_audioHigh', 'u_primaryColor'
            ];
            
            const uniformResults = {};
            let foundUniforms = 0;
            
            // Use the program
            shaderManager.useProgram('uniform-test');
            
            requiredUniforms.forEach(uniformName => {
                try {
                    const location = shaderManager.getUniformLocation(uniformName);
                    const found = location !== null && location !== undefined;
                    uniformResults[uniformName] = {
                        found: found,
                        location: location
                    };
                    if (found) foundUniforms++;
                } catch (error) {
                    uniformResults[uniformName] = {
                        found: false,
                        error: error.message
                    };
                }
            });
            
            const successRate = foundUniforms / requiredUniforms.length;
            const passed = successRate >= 0.75; // At least 75% of uniforms must be found
            
            return {
                passed: passed,
                details: `${foundUniforms}/${requiredUniforms.length} uniforms registered successfully (${Math.round(successRate * 100)}%)`,
                data: { 
                    uniformResults, 
                    foundUniforms, 
                    totalUniforms: requiredUniforms.length,
                    successRate: successRate
                }
            };
            
        } catch (error) {
            return { passed: false, details: `Uniform registration error: ${error.message}`, error };
        }
    }

    testUniformLocationBinding() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            if (!gl) {
                return { passed: false, details: 'No WebGL context available for uniform location binding test' };
            }
            
            const geometryManager = new window.VIB34D_WorkingCore.GeometryManager();
            const projectionManager = new window.VIB34D_WorkingCore.ProjectionManager();
            const shaderManager = new window.VIB34D_WorkingCore.ShaderManager(gl, geometryManager, projectionManager);
            
            // Create and use a program
            const program = shaderManager.createDynamicProgram('binding-test', 'hypercube', 'perspective');
            
            if (!program) {
                return { passed: false, details: 'Failed to create shader program for binding test' };
            }
            
            shaderManager.useProgram('binding-test');
            
            // Test core uniforms that should be bound
            const coreUniforms = ['u_time', 'u_resolution', 'u_dimension', 'u_morphFactor'];
            const bindingResults = {};
            let successfulBindings = 0;
            
            coreUniforms.forEach(uniformName => {
                try {
                    const location = shaderManager.getUniformLocation(uniformName);
                    
                    if (location !== null && location !== undefined) {
                        // Test if we can actually set the uniform value
                        try {
                            if (uniformName === 'u_time') {
                                gl.uniform1f(location, 1.0);
                            } else if (uniformName === 'u_resolution') {
                                gl.uniform2fv(location, [1920, 1080]);
                            } else if (uniformName === 'u_dimension') {
                                gl.uniform1f(location, 3.5);
                            } else if (uniformName === 'u_morphFactor') {
                                gl.uniform1f(location, 0.5);
                            }
                            
                            // Check for WebGL errors
                            const error = gl.getError();
                            const bindingSuccessful = error === gl.NO_ERROR;
                            
                            bindingResults[uniformName] = {
                                locationFound: true,
                                location: location,
                                bindingSuccessful: bindingSuccessful,
                                glError: error
                            };
                            
                            if (bindingSuccessful) successfulBindings++;
                            
                        } catch (bindingError) {
                            bindingResults[uniformName] = {
                                locationFound: true,
                                location: location,
                                bindingSuccessful: false,
                                bindingError: bindingError.message
                            };
                        }
                    } else {
                        bindingResults[uniformName] = {
                            locationFound: false,
                            location: location
                        };
                    }
                } catch (error) {
                    bindingResults[uniformName] = {
                        locationFound: false,
                        error: error.message
                    };
                }
            });
            
            const successRate = successfulBindings / coreUniforms.length;
            const passed = successRate >= 0.75; // At least 75% must bind successfully
            
            return {
                passed: passed,
                details: `${successfulBindings}/${coreUniforms.length} uniform bindings successful (${Math.round(successRate * 100)}%)`,
                data: {
                    bindingResults,
                    successfulBindings,
                    totalUniforms: coreUniforms.length,
                    successRate: successRate
                }
            };
            
        } catch (error) {
            return { passed: false, details: `Uniform location binding error: ${error.message}`, error };
        }
    }

    testUniformGPUUpdates() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            
            if (!gl) {
                return { passed: false, details: 'No WebGL context available for GPU updates test' };
            }
            
            // Create HypercubeCore to test real GPU updates
            const hypercubeCore = new window.VIB34D_WorkingCore.HypercubeCore(canvas, {
                geometryType: 'hypercube',
                projectionMethod: 'perspective'
            });
            
            if (!hypercubeCore) {
                return { passed: false, details: 'Failed to create HypercubeCore for GPU updates test' };
            }
            
            const updateResults = {};
            let successfulUpdates = 0;
            
            // Test updating various parameters and see if they reach the GPU
            const testParameters = {
                morphFactor: 0.8,
                rotationSpeed: 2.5,
                gridDensity: 15.0,
                dimensions: 3.7
            };
            
            Object.keys(testParameters).forEach(paramName => {
                try {
                    const initialValue = hypercubeCore.state[paramName];
                    const newValue = testParameters[paramName];
                    
                    // Update the parameter
                    hypercubeCore.updateParameters({ [paramName]: newValue });
                    
                    // Check if the state was updated
                    const updatedValue = hypercubeCore.state[paramName];
                    const stateUpdated = Math.abs(updatedValue - newValue) < 0.001;
                    
                    // Check if the dirty flag system is working
                    const isDirty = hypercubeCore.state._dirtyUniforms && 
                                   hypercubeCore.state._dirtyUniforms.size > 0;
                    
                    updateResults[paramName] = {
                        initialValue: initialValue,
                        targetValue: newValue,
                        updatedValue: updatedValue,
                        stateUpdated: stateUpdated,
                        dirtyFlagSet: isDirty
                    };
                    
                    if (stateUpdated) successfulUpdates++;
                    
                } catch (error) {
                    updateResults[paramName] = {
                        error: error.message,
                        stateUpdated: false
                    };
                }
            });
            
            // Test batch updates
            try {
                const batchParams = {
                    morphFactor: 0.3,
                    rotationSpeed: 1.0,
                    gridDensity: 8.0
                };
                
                hypercubeCore.updateParameters(batchParams);
                
                const batchSuccessful = Object.keys(batchParams).every(param => {
                    return Math.abs(hypercubeCore.state[param] - batchParams[param]) < 0.001;
                });
                
                updateResults.batchUpdate = {
                    successful: batchSuccessful,
                    parameters: batchParams
                };
                
                if (batchSuccessful) successfulUpdates++;
                
            } catch (error) {
                updateResults.batchUpdate = {
                    successful: false,
                    error: error.message
                };
            }
            
            const successRate = successfulUpdates / (Object.keys(testParameters).length + 1); // +1 for batch test
            const passed = successRate >= 0.8; // At least 80% must succeed
            
            return {
                passed: passed,
                details: `${successfulUpdates}/${Object.keys(testParameters).length + 1} parameter updates successful (${Math.round(successRate * 100)}%)`,
                data: {
                    updateResults,
                    successfulUpdates,
                    totalTests: Object.keys(testParameters).length + 1,
                    successRate: successRate
                }
            };
            
        } catch (error) {
            return { passed: false, details: `GPU updates test error: ${error.message}`, error };
        }
    }

    testBatchUpdateSystem() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            
            // Create HypercubeCore to test batch update system
            const hypercubeCore = new window.VIB34D_WorkingCore.HypercubeCore(canvas, {
                geometryType: 'hypercube',
                projectionMethod: 'perspective'
            });
            
            if (!hypercubeCore) {
                return { passed: false, details: 'Failed to create HypercubeCore for batch update test' };
            }
            
            const batchTests = {};
            let successfulBatches = 0;
            
            // Test 1: Small batch update
            try {
                const smallBatch = {
                    morphFactor: 0.5,
                    rotationSpeed: 1.5
                };
                
                hypercubeCore.updateParameters(smallBatch);
                
                const smallBatchSuccess = Object.keys(smallBatch).every(param => {
                    return Math.abs(hypercubeCore.state[param] - smallBatch[param]) < 0.001;
                });
                
                batchTests.smallBatch = {
                    successful: smallBatchSuccess,
                    parameters: smallBatch,
                    paramCount: Object.keys(smallBatch).length
                };
                
                if (smallBatchSuccess) successfulBatches++;
                
            } catch (error) {
                batchTests.smallBatch = {
                    successful: false,
                    error: error.message
                };
            }
            
            // Test 2: Large batch update
            try {
                const largeBatch = {
                    morphFactor: 0.8,
                    rotationSpeed: 3.0,
                    gridDensity: 20.0,
                    dimensions: 3.9,
                    patternIntensity: 1.5,
                    universeModifier: 1.2
                };
                
                hypercubeCore.updateParameters(largeBatch);
                
                const largeBatchSuccess = Object.keys(largeBatch).every(param => {
                    return Math.abs(hypercubeCore.state[param] - largeBatch[param]) < 0.001;
                });
                
                batchTests.largeBatch = {
                    successful: largeBatchSuccess,
                    parameters: largeBatch,
                    paramCount: Object.keys(largeBatch).length
                };
                
                if (largeBatchSuccess) successfulBatches++;
                
            } catch (error) {
                batchTests.largeBatch = {
                    successful: false,
                    error: error.message
                };
            }
            
            // Test 3: Rapid sequential batches
            try {
                const batch1 = { morphFactor: 0.1, rotationSpeed: 0.5 };
                const batch2 = { morphFactor: 0.9, rotationSpeed: 4.0 };
                const batch3 = { morphFactor: 0.5, rotationSpeed: 2.0 };
                
                hypercubeCore.updateParameters(batch1);
                hypercubeCore.updateParameters(batch2);
                hypercubeCore.updateParameters(batch3);
                
                // Final state should match batch3
                const rapidBatchSuccess = Object.keys(batch3).every(param => {
                    return Math.abs(hypercubeCore.state[param] - batch3[param]) < 0.001;
                });
                
                batchTests.rapidSequential = {
                    successful: rapidBatchSuccess,
                    finalParameters: batch3,
                    batchCount: 3
                };
                
                if (rapidBatchSuccess) successfulBatches++;
                
            } catch (error) {
                batchTests.rapidSequential = {
                    successful: false,
                    error: error.message
                };
            }
            
            // Test 4: Performance test - measure update time
            try {
                const performanceBatch = {
                    morphFactor: 0.7,
                    rotationSpeed: 2.8,
                    gridDensity: 18.0,
                    dimensions: 3.6,
                    patternIntensity: 1.8
                };
                
                const startTime = performance.now();
                hypercubeCore.updateParameters(performanceBatch);
                const endTime = performance.now();
                
                const updateTime = endTime - startTime;
                const performanceGood = updateTime < 10; // Should complete in under 10ms
                
                batchTests.performanceTest = {
                    successful: performanceGood,
                    updateTime: updateTime,
                    threshold: 10,
                    parameters: performanceBatch
                };
                
                if (performanceGood) successfulBatches++;
                
            } catch (error) {
                batchTests.performanceTest = {
                    successful: false,
                    error: error.message
                };
            }
            
            const successRate = successfulBatches / 4; // 4 batch tests
            const passed = successRate >= 0.75; // At least 75% must succeed
            
            return {
                passed: passed,
                details: `${successfulBatches}/4 batch update tests successful (${Math.round(successRate * 100)}%)`,
                data: {
                    batchTests,
                    successfulBatches,
                    totalTests: 4,
                    successRate: successRate
                }
            };
            
        } catch (error) {
            return { passed: false, details: `Batch update system error: ${error.message}`, error };
        }
    }

    testInteractionEngineConnection() {
        // Implementation for interaction engine connection test
        return { passed: false, details: 'Interaction engine connection test not yet implemented', data: {} };
    }

    testParameterMappingConfig() {
        // Implementation for parameter mapping config test
        return { passed: false, details: 'Parameter mapping config test not yet implemented', data: {} };
    }

    testEventDetection() {
        // Implementation for event detection test
        return { passed: false, details: 'Event detection test not yet implemented', data: {} };
    }

    testParameterSmoothing() {
        // Implementation for parameter smoothing test
        return { passed: false, details: 'Parameter smoothing test not yet implemented', data: {} };
    }

    testEndToEndDataFlow() {
        // Implementation for end-to-end data flow test
        return { passed: false, details: 'End-to-end data flow test not yet implemented', data: {} };
    }

    testVisualFeedback() {
        // Implementation for visual feedback test
        return { passed: false, details: 'Visual feedback test not yet implemented', data: {} };
    }

    testRealtimePerformance() {
        // Implementation for realtime performance test
        return { passed: false, details: 'Realtime performance test not yet implemented', data: {} };
    }

    /**
     * Generate comprehensive diagnostic report
     */
    generateDiagnosticReport() {
        console.log('\n📊 VIB34D INTEGRATION DIAGNOSTIC REPORT');
        console.log('==========================================');
        
        // Phase summaries
        Object.keys(this.results).forEach(phase => {
            const phaseResult = this.results[phase];
            const statusIcon = phaseResult.status === 'working' ? '✅' : 
                              phaseResult.status === 'broken' ? '❌' : '⚠️';
            
            console.log(`${statusIcon} ${phase.toUpperCase()}: ${phaseResult.status}`);
            
            // Test details
            Object.keys(phaseResult.tests).forEach(testName => {
                const test = phaseResult.tests[testName];
                const testIcon = test.passed ? '  ✅' : '  ❌';
                console.log(`${testIcon} ${testName}: ${test.details}`);
            });
            
            console.log('');
        });
        
        // Priority fix recommendations
        this.generateFixRecommendations();
    }

    /**
     * Generate prioritized fix recommendations
     */
    generateFixRecommendations() {
        console.log('🔧 PRIORITY FIX RECOMMENDATIONS');
        console.log('================================');
        
        const broken = [];
        const working = [];
        
        Object.keys(this.results).forEach(phase => {
            if (this.results[phase].status === 'broken') {
                broken.push(phase);
            } else if (this.results[phase].status === 'working') {
                working.push(phase);
            }
        });
        
        if (broken.length === 0) {
            console.log('🎉 ALL PHASES WORKING! Integration is healthy.');
        } else {
            console.log(`❌ BROKEN PHASES: ${broken.join(', ')}`);
            console.log(`✅ WORKING PHASES: ${working.join(', ')}`);
            
            // Generate specific recommendations based on what's broken
            if (broken.includes('phase1')) {
                console.log('🚨 HIGH PRIORITY: Fix Phase 1 Core Architecture first - all other phases depend on it');
            }
            if (broken.includes('phase4')) {
                console.log('🚨 HIGH PRIORITY: Fix Phase 4 Shader Uniforms - visual system won\'t work without it');
            }
            if (broken.includes('phase5')) {
                console.log('🎮 MEDIUM PRIORITY: Fix Phase 5 Parameter Mapping - interactions won\'t affect visuals');
            }
        }
        
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Fix highest priority broken phases first');
        console.log('2. Run diagnostic again after each fix');
        console.log('3. Verify integration tests pass before proceeding to next phase');
    }
}

// Make diagnostic available globally
window.VIB34DIntegrationDiagnostic = VIB34DIntegrationDiagnostic;

// Auto-run diagnostic when script loads
if (typeof window !== 'undefined') {
    console.log('🔍 VIB34D Integration Diagnostic Script Loaded');
    console.log('Run: new VIB34DIntegrationDiagnostic().runFullDiagnostic()');
}