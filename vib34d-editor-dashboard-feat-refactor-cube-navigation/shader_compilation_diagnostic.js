/**
 * VIB34D SHADER COMPILATION DIAGNOSTIC
 * 
 * Analyzes shader compilation error "Link error program 'maleficarumViz': No compiled shaders"
 */

const fs = require('fs');
const { JSDOM } = require('jsdom');

// Mock WebGL for testing
function createMockWebGL() {
    const mockGL = {
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        COMPILE_STATUS: 35713,
        LINK_STATUS: 35714,
        CURRENT_PROGRAM: 35725,
        ARRAY_BUFFER: 34962,
        STATIC_DRAW: 35044,
        TRIANGLE_STRIP: 5,
        COLOR_BUFFER_BIT: 16384,
        BLEND: 3042,
        SRC_ALPHA: 770,
        ONE_MINUS_SRC_ALPHA: 771,
        DEPTH_TEST: 2929,
        
        _shaders: new Map(),
        _programs: new Map(),
        _nextId: 1,
        
        createShader: function(type) {
            const id = this._nextId++;
            const shader = { id, type, source: null, compiled: false };
            this._shaders.set(id, shader);
            return { id };
        },
        
        shaderSource: function(shader, source) {
            const shaderObj = this._shaders.get(shader.id);
            if (shaderObj) {
                shaderObj.source = source;
                console.log(`📝 Shader ${shader.id} source set (${source.length} chars)`);
            }
        },
        
        compileShader: function(shader) {
            const shaderObj = this._shaders.get(shader.id);
            if (shaderObj && shaderObj.source) {
                shaderObj.compiled = true;
                console.log(`✅ Shader ${shader.id} compiled successfully`);
            } else {
                console.log(`❌ Shader ${shader.id} compilation failed - no source`);
            }
        },
        
        getShaderParameter: function(shader, param) {
            const shaderObj = this._shaders.get(shader.id);
            if (param === this.COMPILE_STATUS) {
                return shaderObj ? shaderObj.compiled : false;
            }
            return true;
        },
        
        getShaderInfoLog: function(shader) {
            return 'Mock shader info log';
        },
        
        createProgram: function() {
            const id = this._nextId++;
            const program = { id, shaders: [], linked: false };
            this._programs.set(id, program);
            console.log(`🔗 Program ${id} created`);
            return { id };
        },
        
        attachShader: function(program, shader) {
            const programObj = this._programs.get(program.id);
            const shaderObj = this._shaders.get(shader.id);
            if (programObj && shaderObj) {
                programObj.shaders.push(shader.id);
                console.log(`🔗 Shader ${shader.id} attached to program ${program.id}`);
            }
        },
        
        linkProgram: function(program) {
            const programObj = this._programs.get(program.id);
            if (programObj) {
                const attachedShaders = programObj.shaders.map(id => this._shaders.get(id));
                const compiledShaders = attachedShaders.filter(s => s && s.compiled);
                
                console.log(`🔗 Linking program ${program.id}:`);
                console.log(`   Attached shaders: ${attachedShaders.length}`);
                console.log(`   Compiled shaders: ${compiledShaders.length}`);
                
                if (compiledShaders.length >= 2) {
                    programObj.linked = true;
                    console.log(`✅ Program ${program.id} linked successfully`);
                } else {
                    console.log(`❌ Program ${program.id} link failed - not enough compiled shaders`);
                }
            }
        },
        
        getProgramParameter: function(program, param) {
            const programObj = this._programs.get(program.id);
            if (param === this.LINK_STATUS) {
                return programObj ? programObj.linked : false;
            }
            return true;
        },
        
        getProgramInfoLog: function(program) {
            const programObj = this._programs.get(program.id);
            if (programObj) {
                const attachedShaders = programObj.shaders.map(id => this._shaders.get(id));
                const compiledShaders = attachedShaders.filter(s => s && s.compiled);
                
                if (compiledShaders.length === 0) {
                    return 'No compiled shaders';
                } else if (compiledShaders.length < 2) {
                    return `Only ${compiledShaders.length} compiled shader(s), need at least 2`;
                }
            }
            return 'Mock program info log';
        },
        
        deleteShader: function(shader) {
            this._shaders.delete(shader.id);
        },
        
        deleteProgram: function(program) {
            this._programs.delete(program.id);
        },
        
        useProgram: function(program) {
            // Mock implementation
        },
        
        getParameter: function(param) {
            return null;
        },
        
        getUniformLocation: function(program, name) {
            return { name };
        },
        
        getAttribLocation: function(program, name) {
            return 0;
        },
        
        // Mock other WebGL methods
        createBuffer: () => ({ id: 'buffer' }),
        bindBuffer: () => {},
        bufferData: () => {},
        viewport: () => {},
        clearColor: () => {},
        clear: () => {},
        enable: () => {},
        disable: () => {},
        blendFunc: () => {},
        enableVertexAttribArray: () => {},
        vertexAttribPointer: () => {},
        drawArrays: () => {},
        uniform1f: () => {},
        uniform2fv: () => {},
        uniform3fv: () => {},
        getExtension: () => null,
        isContextLost: () => false
    };
    
    return mockGL;
}

async function runShaderDiagnostic() {
    console.log('🔍 VIB34D SHADER COMPILATION DIAGNOSTIC');
    console.log('==========================================\n');
    
    try {
        // Load the VIB34D architecture
        console.log('📥 Loading VIB34D_WORKING_CORE_ARCHITECTURE.js...');
        const architectureCode = fs.readFileSync('./VIB34D_WORKING_CORE_ARCHITECTURE.js', 'utf8');
        
        // Create DOM environment
        const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><canvas id="testCanvas"></canvas></body></html>`, {
            runScripts: "dangerously",
            resources: "usable"
        });
        
        const window = dom.window;
        global.window = window;
        global.document = window.document;
        global.HTMLCanvasElement = window.HTMLCanvasElement;
        global.performance = { now: () => Date.now() };
        global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
        global.cancelAnimationFrame = (id) => clearTimeout(id);
        
        // Execute the architecture code
        console.log('⚙️ Executing VIB34D architecture...');
        eval(architectureCode);
        
        if (!window.VIB34D_WorkingCore) {
            throw new Error('VIB34D_WorkingCore not found after execution');
        }
        
        console.log('✅ VIB34D_WorkingCore loaded successfully');
        
        // Test shader compilation step by step
        console.log('\n🧪 TESTING SHADER COMPILATION PIPELINE');
        console.log('======================================\n');
        
        const canvas = window.document.getElementById('testCanvas');
        canvas.width = 400;
        canvas.height = 400;
        
        // Mock WebGL context
        const mockGL = createMockWebGL();
        canvas.getContext = () => mockGL;
        
        // Test GeometryManager
        console.log('1️⃣ Testing GeometryManager...');
        const { GeometryManager, ProjectionManager, ShaderManager } = window.VIB34D_WorkingCore;
        
        const geometryManager = new GeometryManager();
        console.log('✅ GeometryManager created');
        console.log('   Available geometries:', geometryManager.getGeometryTypes());
        
        // Test ProjectionManager  
        console.log('\n2️⃣ Testing ProjectionManager...');
        const projectionManager = new ProjectionManager();
        console.log('✅ ProjectionManager created');
        console.log('   Available projections:', projectionManager.getProjectionTypes());
        
        // Test ShaderManager
        console.log('\n3️⃣ Testing ShaderManager...');
        const shaderManager = new ShaderManager(mockGL, geometryManager, projectionManager);
        console.log('✅ ShaderManager created');
        
        // Test shader source generation
        console.log('\n4️⃣ Testing shader source generation...');
        
        const hypercubeGeometry = geometryManager.getGeometry('hypercube');
        const perspectiveProjection = projectionManager.getProjection('perspective');
        
        console.log('   Hypercube geometry shader code:');
        const geomCode = hypercubeGeometry.getShaderCode();
        console.log(`   Length: ${geomCode.length} characters`);
        console.log(`   Preview: ${geomCode.substring(0, 100)}...`);
        
        console.log('   Perspective projection shader code:');
        const projCode = perspectiveProjection.getShaderCode();
        console.log(`   Length: ${projCode.length} characters`);
        console.log(`   Preview: ${projCode.substring(0, 100)}...`);
        
        // Test dynamic program creation
        console.log('\n5️⃣ Testing dynamic program creation...');
        const program = shaderManager.createDynamicProgram('maleficarumViz', 'hypercube', 'perspective');
        
        if (program) {
            console.log('✅ Program created successfully');
        } else {
            console.log('❌ Program creation failed');
        }
        
        // Test HypercubeCore
        console.log('\n6️⃣ Testing HypercubeCore...');
        const { HypercubeCore } = window.VIB34D_WorkingCore;
        
        try {
            const core = new HypercubeCore(canvas);
            console.log('✅ HypercubeCore created successfully');
            
            const status = core.getStatus();
            console.log('   Status:', status);
            
        } catch (error) {
            console.log('❌ HypercubeCore creation failed:', error.message);
            console.log('   Stack:', error.stack);
        }
        
    } catch (error) {
        console.log('❌ Diagnostic failed:', error.message);
        console.log('   Stack:', error.stack);
    }
}

// Run the diagnostic
if (require.main === module) {
    runShaderDiagnostic().catch(console.error);
}

module.exports = { runShaderDiagnostic };