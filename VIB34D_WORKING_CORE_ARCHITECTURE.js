/**
 * VIB34D WORKING CORE ARCHITECTURE
 * 
 * Based on proven HyperAV system components
 * Direct adaptation from working C:\Users\millz\HyperAV\core\ files
 * 
 * WORKING IMPLEMENTATION with actual geometry code
 */

// ============================================================================
// 🎨 BASE GEOMETRY CLASSES (WORKING IMPLEMENTATIONS)
// ============================================================================

class BaseGeometry { 
    constructor() {} 
    getShaderCode() { 
        throw new Error(`getShaderCode() must be implemented.`); 
    } 
}

class HypercubeGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            // Uniforms used: u_dimension, u_time, u_morphFactor, u_gridDensity, u_lineThickness
            // u_universeModifier, u_audioBass, u_audioMid, u_audioHigh, u_rotationSpeed
            float calculateLattice(vec3 p) {
                float dynamicGridDensity = max(0.1, u_gridDensity * (1.0 + u_audioBass * 0.7));
                float dynamicLineThickness = max(0.002, u_lineThickness * (1.0 - u_audioMid * 0.6));

                vec3 p_grid3D = fract(p * dynamicGridDensity * 0.5 + u_time * 0.01);
                vec3 dist3D = abs(p_grid3D - 0.5);
                float box3D = max(dist3D.x, max(dist3D.y, dist3D.z));
                float lattice3D = smoothstep(0.5, 0.5 - dynamicLineThickness, box3D);

                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);

                if (dim_factor > 0.01) {
                    float w_coord = sin(p.x*1.4 - p.y*0.7 + p.z*1.5 + u_time * 0.25)
                                  * cos(length(p) * 1.1 - u_time * 0.35 + u_audioMid * 2.5)
                                  * dim_factor * (0.4 + u_morphFactor * 0.6 + u_audioHigh * 0.6);

                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 1.0;
                    float time_rot1 = u_time * 0.33 * baseSpeed + u_audioHigh * 0.25 + u_morphFactor * 0.45;
                    float time_rot2 = u_time * 0.28 * baseSpeed - u_audioMid * 0.28;
                    float time_rot3 = u_time * 0.25 * baseSpeed + u_audioBass * 0.35;
                    p4d = rotXW(time_rot1) * rotYZ(time_rot2 * 1.1) * rotZW(time_rot3 * 0.9) * p4d;
                    p4d = rotYW(u_time * -0.22 * baseSpeed + u_morphFactor * 0.3) * p4d;

                    vec3 projectedP = project4Dto3D(p4d);
                    vec3 p_grid4D_proj = fract(projectedP * dynamicGridDensity * 0.5 + u_time * 0.015);
                    vec3 dist4D_proj = abs(p_grid4D_proj - 0.5);
                    float box4D_proj = max(dist4D_proj.x, max(dist4D_proj.y, dist4D_proj.z));
                    float lattice4D_proj = smoothstep(0.5, 0.5 - dynamicLineThickness, box4D_proj);
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(finalLattice, 1.0 / max(0.1, u_universeModifier));
            }
        `;
    }
}

class HypersphereGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            // Uniforms used: u_dimension, u_time, u_morphFactor, u_gridDensity, u_shellWidth
            // u_universeModifier, u_audioBass, u_audioMid, u_audioHigh, u_rotationSpeed
            float calculateLattice(vec3 p) {
                float radius3D = length(p);
                float densityFactor = max(0.1, u_gridDensity * 0.7 * (1.0 + u_audioBass * 0.5));
                float dynamicShellWidth = max(0.005, u_shellWidth * (1.0 + u_audioMid * 1.5));
                float phase = radius3D * densityFactor * 6.28318 - u_time * u_rotationSpeed * 0.8 + u_audioHigh * 3.0;
                float shells3D = 0.5 + 0.5 * sin(phase);
                shells3D = smoothstep(1.0 - dynamicShellWidth, 1.0, shells3D);

                float finalLattice = shells3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);

                if (dim_factor > 0.01) {
                    float w_coord = cos(radius3D * 2.5 - u_time * 0.55)
                                  * sin(p.x*1.0 + p.y*1.3 - p.z*0.7 + u_time*0.2)
                                  * dim_factor * (0.5 + u_morphFactor * 0.5 + u_audioMid * 0.5);

                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 0.85;
                    float time_rot1 = u_time * 0.38 * baseSpeed + u_audioHigh * 0.2;
                    float time_rot2 = u_time * 0.31 * baseSpeed + u_morphFactor * 0.6;
                    float time_rot3 = u_time * -0.24 * baseSpeed + u_audioBass * 0.25;
                    p4d = rotXW(time_rot1 * 1.05) * rotYZ(time_rot2) * rotYW(time_rot3 * 0.95) * p4d;

                    vec3 projectedP = project4Dto3D(p4d);
                    float radius4D_proj = length(projectedP);
                    float phase4D = radius4D_proj * densityFactor * 6.28318 - u_time * u_rotationSpeed * 0.8 + u_audioHigh * 3.0;
                    float shells4D_proj = 0.5 + 0.5 * sin(phase4D);
                    shells4D_proj = smoothstep(1.0 - dynamicShellWidth, 1.0, shells4D_proj);
                    finalLattice = mix(shells3D, shells4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

class HypertetrahedronGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            // Uniforms used: u_dimension, u_time, u_morphFactor, u_gridDensity, u_tetraThickness
            // u_universeModifier, u_audioBass, u_audioMid, u_audioHigh, u_rotationSpeed
            float calculateLattice(vec3 p) {
                float density = max(0.1, u_gridDensity * 0.65 * (1.0 + u_audioBass * 0.4));
                float dynamicThickness = max(0.003, u_tetraThickness * (1.0 - u_audioMid * 0.7));

                vec3 c1=normalize(vec3(1,1,1)), c2=normalize(vec3(-1,-1,1)), c3=normalize(vec3(-1,1,-1)), c4=normalize(vec3(1,-1,-1));
                vec3 p_mod3D = fract(p * density * 0.5 + 0.5 + u_time * 0.005) - 0.5;
                float d1=dot(p_mod3D, c1), d2=dot(p_mod3D, c2), d3=dot(p_mod3D, c3), d4=dot(p_mod3D, c4);
                float minDistToPlane3D = min(min(abs(d1), abs(d2)), min(abs(d3), abs(d4)));
                float lattice3D = 1.0 - smoothstep(0.0, dynamicThickness, minDistToPlane3D);

                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);

                if (dim_factor > 0.01) {
                    float w_coord = cos(p.x*1.8 - p.y*1.5 + p.z*1.2 + u_time*0.24) * sin(length(p)*1.4 + u_time*0.18 - u_audioMid*2.0) * dim_factor * (0.45 + u_morphFactor*0.55 + u_audioHigh*0.4);
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 1.15;
                    float time_rot1 = u_time*0.28*baseSpeed + u_audioHigh*0.25; 
                    float time_rot2 = u_time*0.36*baseSpeed - u_audioBass*0.2 + u_morphFactor*0.4; 
                    float time_rot3 = u_time*0.32*baseSpeed + u_audioMid*0.15;
                    p4d = rotXW(time_rot1*0.95) * rotYW(time_rot2*1.05) * rotZW(time_rot3) * p4d;
                    vec3 projectedP = project4Dto3D(p4d);

                    vec3 p_mod4D_proj = fract(projectedP * density * 0.5 + 0.5 + u_time * 0.008) - 0.5;
                    float dp1=dot(p_mod4D_proj,c1), dp2=dot(p_mod4D_proj,c2), dp3=dot(p_mod4D_proj,c3), dp4=dot(p_mod4D_proj,c4);
                    float minDistToPlane4D = min(min(abs(dp1), abs(dp2)), min(abs(dp3), abs(dp4)));
                    float lattice4D_proj = 1.0 - smoothstep(0.0, dynamicThickness, minDistToPlane4D);
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// Additional geometries for the 8-geometry system
class TorusGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                float density = max(0.1, u_gridDensity * 0.8 * (1.0 + u_audioBass * 0.6));
                vec3 p_mod = fract(p * density) - 0.5;
                float r1 = sqrt(p_mod.x*p_mod.x + p_mod.y*p_mod.y);
                float r2 = sqrt((r1 - 0.3)*(r1 - 0.3) + p_mod.z*p_mod.z);
                float torus = 1.0 - smoothstep(0.0, 0.1, r2);
                return pow(max(0.0, torus), max(0.1, u_universeModifier));
            }
        `;
    }
}

class KleinGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                float density = max(0.1, u_gridDensity * 0.9 * (1.0 + u_audioBass * 0.5));
                vec3 q = fract(p * density);
                float u = q.x * 2.0 * 3.14159;
                float v = q.y * 2.0 * 3.14159;
                float x = cos(u) * (3.0 + cos(u/2.0) * sin(v) - sin(u/2.0) * sin(2.0*v));
                float klein = length(vec2(x, q.z)) - 0.1;
                return 1.0 - smoothstep(0.0, 0.05, abs(klein));
            }
        `;
    }
}

class FractalGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                vec3 q = p * u_gridDensity;
                float scale = 1.0;
                float fractal = 0.0;
                for(int i = 0; i < 4; i++) {
                    q = fract(q) - 0.5;
                    fractal += abs(length(q)) / scale;
                    scale *= 2.0;
                    q *= 2.0;
                }
                return 1.0 - smoothstep(0.0, 1.0, fractal);
            }
        `;
    }
}

class WaveGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                vec3 q = p * u_gridDensity;
                float wave = sin(q.x * 2.0) * sin(q.y * 2.0) * sin(q.z * 2.0 + u_time);
                return smoothstep(-0.5, 0.5, wave);
            }
        `;
    }
}

class CrystalGeometry extends BaseGeometry {
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                vec3 q = fract(p * u_gridDensity) - 0.5;
                float d = max(max(abs(q.x), abs(q.y)), abs(q.z));
                return 1.0 - smoothstep(0.3, 0.5, d);
            }
        `;
    }
}

// ============================================================================
// 🎯 GEOMETRY MANAGER (WORKING IMPLEMENTATION)
// ============================================================================

class GeometryManager {
    constructor(options = {}) { 
        this.options = { defaultGeometry: 'hypercube', ...options }; 
        this.geometries = {}; 
        this._initGeometries(); 
    }
    
    _initGeometries() { 
        this.registerGeometry('hypercube', new HypercubeGeometry()); 
        this.registerGeometry('hypersphere', new HypersphereGeometry()); 
        this.registerGeometry('hypertetrahedron', new HypertetrahedronGeometry());
        this.registerGeometry('torus', new TorusGeometry());
        this.registerGeometry('klein', new KleinGeometry());
        this.registerGeometry('fractal', new FractalGeometry());
        this.registerGeometry('wave', new WaveGeometry());
        this.registerGeometry('crystal', new CrystalGeometry());
    }
    
    registerGeometry(name, instance) { 
        const lowerCaseName = name.toLowerCase(); 
        if (!(instance instanceof BaseGeometry)) { 
            console.error(`Invalid geometry object for '${lowerCaseName}'.`); 
            return; 
        } 
        this.geometries[lowerCaseName] = instance; 
        console.log(`📐 Registered geometry: ${lowerCaseName}`);
    }
    
    getGeometry(name) { 
        const lowerCaseName = name ? name.toLowerCase() : this.options.defaultGeometry; 
        const geometry = this.geometries[lowerCaseName]; 
        if (!geometry) { 
            console.warn(`Geometry '${name}' not found. Using default.`); 
            return this.geometries[this.options.defaultGeometry.toLowerCase()]; 
        } 
        return geometry; 
    }
    
    getGeometryTypes() { 
        return Object.keys(this.geometries); 
    }
}

// ============================================================================
// 📐 BASE PROJECTION CLASSES (WORKING IMPLEMENTATIONS)
// ============================================================================

class BaseProjection { 
    constructor() {} 
    getShaderCode() { 
        throw new Error(`getShaderCode() must be implemented.`); 
    } 
}

class PerspectiveProjection extends BaseProjection {
    constructor(viewDistance = 2.5) { 
        super(); 
        this.viewDistance = Math.max(0.1, viewDistance); 
    }
    
    getShaderCode() { 
        return `vec3 project4Dto3D(vec4 p) { 
            float baseDistance = ${this.viewDistance.toFixed(2)}; 
            float dynamicDistance = max(0.2, baseDistance * (1.0 + u_morphFactor * 0.4 - u_audioMid * 0.35)); 
            float denominator = dynamicDistance + p.w; 
            float w_factor = dynamicDistance / max(0.1, denominator); 
            return p.xyz * w_factor; 
        }`; 
    }
}

class OrthographicProjection extends BaseProjection {
    getShaderCode() { 
        return `vec3 project4Dto3D(vec4 p) { 
            vec3 orthoP = p.xyz; 
            float basePerspectiveDistance = 2.5; 
            float dynamicPerspectiveDistance = max(0.2, basePerspectiveDistance * (1.0 - u_audioMid * 0.4)); 
            float perspDenominator = dynamicPerspectiveDistance + p.w; 
            float persp_w_factor = dynamicPerspectiveDistance / max(0.1, perspDenominator); 
            vec3 perspP = p.xyz * persp_w_factor; 
            float morphT = smoothstep(0.0, 1.0, u_morphFactor); 
            return mix(orthoP, perspP, morphT); 
        }`; 
    }
}

class StereographicProjection extends BaseProjection {
    constructor(projectionPoleW = -1.5) { 
        super(); 
        this.baseProjectionPoleW = Math.abs(projectionPoleW) < 0.01 ? -1.0 : projectionPoleW; 
    }
    
    getShaderCode() { 
        return `vec3 project4Dto3D(vec4 p) { 
            float basePoleW = ${this.baseProjectionPoleW.toFixed(2)}; 
            float dynamicPoleW = sign(basePoleW) * max(0.1, abs(basePoleW + u_audioHigh * 0.4 * sign(basePoleW))); 
            float denominator = p.w - dynamicPoleW; 
            vec3 projectedP; 
            float epsilon = 0.001; 
            if (abs(denominator) < epsilon) { 
                projectedP = normalize(p.xyz + vec3(epsilon)) * 1000.0; 
            } else { 
                float scale = (-dynamicPoleW) / denominator; 
                projectedP = p.xyz * scale; 
            } 
            float morphT = smoothstep(0.0, 1.0, u_morphFactor * 0.8); 
            vec3 orthoP = p.xyz; 
            return mix(projectedP, orthoP, morphT); 
        }`; 
    }
}

// ============================================================================
// 📐 PROJECTION MANAGER (WORKING IMPLEMENTATION)
// ============================================================================

class ProjectionManager {
    constructor(options = {}) { 
        this.options = { defaultProjection: 'perspective', ...options }; 
        this.projections = {}; 
        this._initProjections(); 
    }
    
    _initProjections() { 
        this.registerProjection('perspective', new PerspectiveProjection()); 
        this.registerProjection('orthographic', new OrthographicProjection()); 
        this.registerProjection('stereographic', new StereographicProjection()); 
    }
    
    registerProjection(name, instance) { 
        const lowerCaseName = name.toLowerCase(); 
        if (!(instance instanceof BaseProjection)) { 
            console.error(`Invalid projection object for '${lowerCaseName}'.`); 
            return; 
        } 
        this.projections[lowerCaseName] = instance; 
        console.log(`📐 Registered projection: ${lowerCaseName}`);
    }
    
    getProjection(name) { 
        const lowerCaseName = name ? name.toLowerCase() : this.options.defaultProjection; 
        const projection = this.projections[lowerCaseName]; 
        if (!projection) { 
            console.warn(`Projection '${name}' not found. Using default.`); 
            return this.projections[this.options.defaultProjection.toLowerCase()]; 
        } 
        return projection; 
    }
    
    getProjectionTypes() { 
        return Object.keys(this.projections); 
    }
}

// ============================================================================
// 🎛️ SHADER MANAGER (WORKING IMPLEMENTATION)
// ============================================================================

class ShaderManager {
    constructor(gl, geometryManager, projectionManager, options = {}) { 
        if (!gl) throw new Error("WebGL context needed."); 
        if (!geometryManager) throw new Error("GeometryManager needed."); 
        if (!projectionManager) throw new Error("ProjectionManager needed."); 
        this.gl = gl; 
        this.geometryManager = geometryManager; 
        this.projectionManager = projectionManager; 
        this.options = this._mergeDefaults(options); 
        this.shaderSources = {}; 
        this.compiledShaders = {}; 
        this.programs = {}; 
        this.uniformLocations = {}; 
        this.attributeLocations = {}; 
        this.currentProgramName = null; 
        this._initShaderTemplates(); 
    }
    
    _mergeDefaults(options){ 
        return { 
            baseVertexShaderName: 'base-vertex', 
            baseFragmentShaderName: 'base-fragment', 
            ...options 
        }; 
    }
    
    _initShaderTemplates(){ 
        this._registerShaderSource(this.options.baseVertexShaderName, this._getBaseVertexShaderSource(), this.gl.VERTEX_SHADER); 
        this._registerShaderSource(this.options.baseFragmentShaderName, this._getBaseFragmentShaderSource(), this.gl.FRAGMENT_SHADER); 
    }
    
    _registerShaderSource(name, source, type){ 
        this.shaderSources[name] = { source, type }; 
    }
    
    _compileShader(shaderIdentifier, source, type) { 
        if (this.compiledShaders[shaderIdentifier]) { 
            return this.compiledShaders[shaderIdentifier]; 
        } 
        const shader = this.gl.createShader(type); 
        if (!shader) { 
            console.error(`Failed create shader '${shaderIdentifier}'.`); 
            this.compiledShaders[shaderIdentifier] = null; 
            return null; 
        } 
        this.gl.shaderSource(shader, source); 
        this.gl.compileShader(shader); 
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) { 
            const log = this.gl.getShaderInfoLog(shader); 
            console.error(`Compile error shader '${shaderIdentifier}':\n${log}`); 
            this._logShaderSourceWithError(source, log); 
            this.gl.deleteShader(shader); 
            this.compiledShaders[shaderIdentifier] = null; 
            return null; 
        } 
        this.compiledShaders[shaderIdentifier] = shader; 
        return shader; 
    }
    
    _logShaderSourceWithError(source, errorLog) { 
        const lines=source.split('\n'); 
        const match=errorLog.match(/ERROR:\s*\d+:(\d+):/); 
        let errLine=match?parseInt(match[1],10):-1; 
        console.error("--- Shader Source ---"); 
        lines.forEach((line, i)=>{
            const p=(i+1===errLine)?">> ": "   "; 
            console.error(p+(i+1).toString().padStart(3)+": "+line);
        }); 
        console.error("--- Shader Source End ---"); 
    }
    
    _createProgram(programName, vertexShader, fragmentShader) { 
        if (this.programs[programName]) { 
            const old = this.programs[programName]; 
            if (old) { 
                try { 
                    const shaders = this.gl.getAttachedShaders(old); 
                    shaders?.forEach(s => this.gl.detachShader(old, s)); 
                    this.gl.deleteProgram(old); 
                } catch (e) {} 
            } 
            delete this.programs[programName]; 
            delete this.uniformLocations[programName]; 
            delete this.attributeLocations[programName]; 
        } 
        const program = this.gl.createProgram(); 
        if (!program) { 
            console.error(`Failed create program '${programName}'.`); 
            return null; 
        } 
        this.gl.attachShader(program, vertexShader); 
        this.gl.attachShader(program, fragmentShader); 
        this.gl.linkProgram(program); 
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) { 
            console.error(`Link error program '${programName}':\n${this.gl.getProgramInfoLog(program)}`); 
            try { 
                this.gl.detachShader(program, vertexShader); 
            } catch(e) {} 
            try { 
                this.gl.detachShader(program, fragmentShader); 
            } catch(e) {} 
            this.gl.deleteProgram(program); 
            this.programs[programName] = null; 
            return null; 
        } 
        this.programs[programName] = program; 
        this.uniformLocations[programName] = {}; 
        this.attributeLocations[programName] = {}; 
        console.log(`Program '${programName}' created/linked.`); 
        return program; 
    }
    
    createDynamicProgram(programName, geometryTypeName, projectionMethodName) { 
        console.log(`🔧 Creating shader program: ${programName} with geometry: ${geometryTypeName}, projection: ${projectionMethodName}`);
        
        const vsName = this.options.baseVertexShaderName; 
        const vsInfo = this.shaderSources[vsName]; 
        if (!vsInfo) { 
            console.error(`❌ Base VS source '${vsName}' missing.`); 
            return null; 
        } 
        
        console.log(`🔧 Compiling vertex shader: ${vsName}`);
        const vs = this._compileShader(vsName, vsInfo.source, vsInfo.type); 
        if (!vs) {
            console.error(`❌ Vertex shader compilation failed for: ${vsName}`);
            return null; 
        }
        console.log(`✅ Vertex shader compiled successfully`);
        
        const geom = this.geometryManager.getGeometry(geometryTypeName); 
        const proj = this.projectionManager.getProjection(projectionMethodName); 
        if (!geom || !proj) { 
            console.error(`❌ Geom/Proj provider missing. Geom: ${!!geom}, Proj: ${!!proj}`); 
            return null; 
        } 
        
        console.log(`🔧 Getting shader code from geometry: ${geometryTypeName} and projection: ${projectionMethodName}`);
        const geomGLSL = geom.getShaderCode(); 
        const projGLSL = proj.getShaderCode(); 
        
        console.log(`📝 Geometry GLSL length: ${geomGLSL ? geomGLSL.length : 'null'}`);
        console.log(`📝 Projection GLSL length: ${projGLSL ? projGLSL.length : 'null'}`);
        
        if (typeof geomGLSL !== 'string' || typeof projGLSL !== 'string') { 
            console.error(`❌ Invalid GLSL returned. GeomGLSL type: ${typeof geomGLSL}, ProjGLSL type: ${typeof projGLSL}`); 
            console.error(`❌ GeomGLSL preview:`, geomGLSL ? geomGLSL.substring(0, 100) : 'null');
            console.error(`❌ ProjGLSL preview:`, projGLSL ? projGLSL.substring(0, 100) : 'null');
            return null; 
        } 
        
        // Validate that required functions exist in the shader code
        if (!geomGLSL.includes('calculateLattice')) {
            console.error(`❌ Geometry shader missing calculateLattice function`);
            console.error(`❌ Geometry GLSL content:`, geomGLSL);
            return null;
        }
        
        if (!projGLSL.includes('project4Dto3D')) {
            console.error(`❌ Projection shader missing project4Dto3D function`);  
            console.error(`❌ Projection GLSL content:`, projGLSL);
            return null;
        }
        
        const fsName = this.options.baseFragmentShaderName; 
        const fsInfo = this.shaderSources[fsName]; 
        if (!fsInfo) { 
            console.error(`❌ Base FS source '${fsName}' missing.`); 
            return null; 
        } 
        
        console.log(`🔧 Injecting shader code into fragment shader template`);
        let fsSource = fsInfo.source; 
        fsSource = fsSource.replace('//__GEOMETRY_CODE_INJECTION_POINT__', geomGLSL); 
        fsSource = fsSource.replace('//__PROJECTION_CODE_INJECTION_POINT__', projGLSL); 
        
        // Validate injection worked
        if (fsSource.includes('//__GEOMETRY_CODE_INJECTION_POINT__') || fsSource.includes('//__PROJECTION_CODE_INJECTION_POINT__')) {
            console.error(`❌ Shader code injection failed - injection points still present`);
            return null;
        }
        
        console.log(`📝 Final fragment shader length: ${fsSource.length}`);
        console.log(`🔧 Compiling fragment shader: ${geometryTypeName}-${projectionMethodName}`);
        
        const fsId = `fragment-${geometryTypeName}-${projectionMethodName}`; 
        const fs = this._compileShader(fsId, fsSource, fsInfo.type); 
        if (!fs) {
            console.error(`❌ Fragment shader compilation failed`);
            console.error(`❌ Fragment shader source preview:`, fsSource.substring(0, 500));
            return null; 
        }
        console.log(`✅ Fragment shader compiled successfully`);
        
        console.log(`🔧 Linking shader program: ${programName}`);
        const newProg = this._createProgram(programName, vs, fs); 
        if (this.currentProgramName === programName) { 
            if (newProg) { 
                this.gl.useProgram(newProg); 
            } else { 
                this.gl.useProgram(null); 
                this.currentProgramName = null; 
                console.error(`Failed rebuild active program '${programName}'.`); 
            } 
        } 
        return newProg; 
    }
    
    useProgram(programName) { 
        if (programName === null) { 
            if (this.currentProgramName !== null) { 
                try { 
                    this.gl.useProgram(null); 
                } catch(e){} 
                this.currentProgramName = null; 
            } 
            return true; 
        } 
        const program = this.programs[programName]; 
        if (program) { 
            const currentGLProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM); 
            if (currentGLProgram !== program) { 
                try { 
                    this.gl.useProgram(program); 
                } catch(e) { 
                    console.error(`useProgram failed for ${programName}`, e); 
                    return false;
                } 
            } 
            this.currentProgramName = programName; 
            return true; 
        } else { 
            console.warn(`Program '${programName}' not found or invalid.`); 
            if (this.currentProgramName === programName) { 
                this.currentProgramName = null; 
                try { 
                    this.gl.useProgram(null); 
                } catch(e){} 
            } 
            return false;
        } 
    }
    
    getUniformLocation(name) { 
        if (!this.currentProgramName || !this.programs[this.currentProgramName]) { 
            return null; 
        } 
        const cache = this.uniformLocations[this.currentProgramName]; 
        if (cache.hasOwnProperty(name)) { 
            return cache[name]; 
        } 
        const loc = this.gl.getUniformLocation(this.programs[this.currentProgramName], name); 
        cache[name] = loc; 
        return loc; 
    }
    
    getAttributeLocation(name) { 
        if (!this.currentProgramName || !this.programs[this.currentProgramName]) { 
            return null; 
        } 
        const cache = this.attributeLocations[this.currentProgramName]; 
        if (cache.hasOwnProperty(name)) { 
            return cache[name]; 
        } 
        const loc = this.gl.getAttribLocation(this.programs[this.currentProgramName], name); 
        cache[name] = (loc === -1) ? null : loc; 
        return cache[name]; 
    }
    
    _getBaseVertexShaderSource() { 
        return `attribute vec2 a_position; varying vec2 v_uv; void main() { v_uv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`; 
    }
    
    _getBaseFragmentShaderSource() {
        return `
            precision highp float;
            uniform vec2 u_resolution; uniform float u_time;
            uniform float u_dimension; uniform float u_morphFactor; uniform float u_rotationSpeed;
            uniform float u_universeModifier; uniform float u_patternIntensity; uniform float u_gridDensity;
            uniform float u_lineThickness; uniform float u_shellWidth; uniform float u_tetraThickness;
            uniform float u_audioBass; uniform float u_audioMid; uniform float u_audioHigh;
            uniform float u_glitchIntensity; uniform float u_colorShift;
            uniform vec3 u_primaryColor; uniform vec3 u_secondaryColor; uniform vec3 u_backgroundColor;
            varying vec2 v_uv;
            mat4 rotXW(float a){float c=cos(a),s=sin(a);return mat4(c,0,0,-s, 0,1,0,0, 0,0,1,0, s,0,0,c);} 
            mat4 rotYW(float a){float c=cos(a),s=sin(a);return mat4(1,0,0,0, 0,c,0,-s, 0,0,1,0, 0,s,0,c);} 
            mat4 rotZW(float a){float c=cos(a),s=sin(a);return mat4(1,0,0,0, 0,1,0,0, 0,0,c,-s, 0,0,s,c);} 
            mat4 rotXY(float a){float c=cos(a),s=sin(a);return mat4(c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1);} 
            mat4 rotYZ(float a){float c=cos(a),s=sin(a);return mat4(1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1);} 
            mat4 rotXZ(float a){float c=cos(a),s=sin(a);return mat4(c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1);}
            vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1e-10;return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);} 
            vec3 hsv2rgb(vec3 c){vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);}
            //__PROJECTION_CODE_INJECTION_POINT__
            //__GEOMETRY_CODE_INJECTION_POINT__
            void main() {
                vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0); 
                vec2 uv = (v_uv * 2.0 - 1.0) * aspect;
                vec3 rayOrigin = vec3(0.0, 0.0, -2.5); 
                vec3 rayDirection = normalize(vec3(uv, 1.0));
                float camRotY = u_time * 0.05 * u_rotationSpeed + u_audioMid * 0.1; 
                float camRotX = sin(u_time * 0.03 * u_rotationSpeed) * 0.15 + u_audioHigh * 0.1;
                mat4 camMat = rotXY(camRotX) * rotYZ(camRotY); 
                rayDirection = (camMat * vec4(rayDirection, 0.0)).xyz;
                vec3 p = rayDirection * 1.5; 
                float latticeValue = calculateLattice(p);
                vec3 color = mix(u_backgroundColor, u_primaryColor, latticeValue);
                color = mix(color, u_secondaryColor, smoothstep(0.2, 0.7, u_audioMid) * latticeValue * 0.6);
                if (abs(u_colorShift) > 0.01) { 
                    vec3 hsv = rgb2hsv(color); 
                    hsv.x = fract(hsv.x + u_colorShift * 0.5 + u_audioHigh * 0.1); 
                    color = hsv2rgb(hsv); 
                }
                color *= (0.8 + u_patternIntensity * 0.7);
                color = pow(clamp(color, 0.0, 1.5), vec3(0.9));
                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }
}

// ============================================================================
// 🎯 HYPERCUBE CORE (WORKING IMPLEMENTATION)
// ============================================================================

const DEFAULT_STATE = {
    startTime: 0, lastUpdateTime: 0, deltaTime: 0, time: 0.0, resolution: [0, 0],
    geometryType: 'hypercube', projectionMethod: 'perspective', dimensions: 4.0,
    morphFactor: 0.5, rotationSpeed: 0.2, universeModifier: 1.0, patternIntensity: 1.0,
    gridDensity: 8.0, lineThickness: 0.03, shellWidth: 0.025, tetraThickness: 0.035,
    glitchIntensity: 0.0, colorShift: 0.0,
    audioLevels: { bass: 0, mid: 0, high: 0 },
    colorScheme: { primary: [1.0, 0.2, 0.8], secondary: [0.2, 1.0, 1.0], background: [0.05, 0.0, 0.2] },
    needsShaderUpdate: false, _dirtyUniforms: new Set(), isRendering: false, animationFrameId: null,
    shaderProgramName: 'maleficarumViz',
    callbacks: { onRender: null, onError: null }
};

class HypercubeCore {
    constructor(canvas, options = {}) {
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error("Valid HTMLCanvasElement needed.");
        }
        
        this.canvas = canvas;
        this.gl = this.initWebGL();
        if (!this.gl) {
            throw new Error("Failed to initialize WebGL context");
        }
        
        // Initialize managers
        this.geometryManager = new GeometryManager();
        this.projectionManager = new ProjectionManager();
        this.shaderManager = new ShaderManager(this.gl, this.geometryManager, this.projectionManager);
        
        this.quadBuffer = null;
        this.aPositionLoc = -1;
        
        // Initialize state
        this.state = { 
            ...DEFAULT_STATE, 
            ...options, 
            colorScheme: { ...DEFAULT_STATE.colorScheme, ...(options.colorScheme || {}) }, 
            audioLevels: { ...DEFAULT_STATE.audioLevels, ...(options.audioLevels || {}) }, 
            callbacks: { ...DEFAULT_STATE.callbacks, ...(options.callbacks || {}) }, 
            _dirtyUniforms: new Set() 
        };
        
        this.state.lineThickness = options.lineThickness ?? DEFAULT_STATE.lineThickness;
        this.state.shellWidth = options.shellWidth ?? DEFAULT_STATE.shellWidth;
        this.state.tetraThickness = options.tetraThickness ?? DEFAULT_STATE.tetraThickness;
        
        this._markAllUniformsDirty();
        
        if (options.geometryType) this.state.geometryType = options.geometryType;
        if (options.projectionMethod) this.state.projectionMethod = options.projectionMethod;
        if (options.shaderProgramName) this.state.shaderProgramName = options.shaderProgramName;
        
        try {
            this._setupWebGLState();
            this._initBuffers();
            this.state.needsShaderUpdate = true;
            this._updateShaderIfNeeded();
        } catch (error) {
            console.error("HypercubeCore Init Error:", error);
            this.state.callbacks.onError?.(error);
        }
    }
    
    initWebGL() {
        // Configure WebGL context attributes to prevent context loss
        const contextAttributes = {
            alpha: true,
            antialias: false, // Disable to reduce GPU load
            depth: false,
            stencil: false,
            preserveDrawingBuffer: false, // Set to false to reduce memory usage
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false
        };
        
        const gl = this.canvas.getContext('webgl2', contextAttributes) || 
                   this.canvas.getContext('webgl', contextAttributes);
        
        if (!gl) {
            console.error('WebGL not supported');
            return null;
        }
        
        // Add context loss/restore event handlers
        this.canvas.addEventListener('webglcontextlost', (event) => {
            console.warn('WebGL context lost for', this.canvas.id);
            event.preventDefault();
            this.stop();
        });
        
        this.canvas.addEventListener('webglcontextrestored', (event) => {
            console.log('WebGL context restored for', this.canvas.id);
            this._reinitializeAfterContextRestore();
        });
        
        // Enable necessary extensions
        gl.getExtension('OES_standard_derivatives');
        
        // Set up WebGL state with minimal operations
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        return gl;
    }
    
    _reinitializeAfterContextRestore() {
        try {
            this.gl = this.initWebGL();
            if (this.gl) {
                this._setupWebGLState();
                this._initBuffers();
                this.state.needsShaderUpdate = true;
                this._updateShaderIfNeeded();
                // Only restart if it was running before
                if (this.state.isRendering) {
                    this.start();
                }
            }
        } catch (error) {
            console.error('Failed to reinitialize after context restore:', error);
        }
    }
    
    _markAllUniformsDirty() { 
        this.state._dirtyUniforms = new Set(); 
        for (const key in DEFAULT_STATE) { 
            if (['_dirtyUniforms', 'isRendering', 'animationFrameId', 'callbacks', 'startTime', 'lastUpdateTime', 'deltaTime', 'needsShaderUpdate', 'geometryType', 'projectionMethod', 'shaderProgramName'].includes(key)) continue; 
            this._markUniformDirty(key); 
        } 
    }
    
    _markUniformDirty(stateKey) { 
        let uniformNames = []; 
        switch (stateKey) { 
            case 'time': uniformNames.push('u_time'); break; 
            case 'resolution': uniformNames.push('u_resolution'); break; 
            case 'dimensions': uniformNames.push('u_dimension'); break; 
            case 'morphFactor': uniformNames.push('u_morphFactor'); break; 
            case 'rotationSpeed': uniformNames.push('u_rotationSpeed'); break; 
            case 'universeModifier': uniformNames.push('u_universeModifier'); break; 
            case 'patternIntensity': uniformNames.push('u_patternIntensity'); break; 
            case 'gridDensity': uniformNames.push('u_gridDensity'); break; 
            case 'lineThickness': uniformNames.push('u_lineThickness'); break; 
            case 'shellWidth': uniformNames.push('u_shellWidth'); break; 
            case 'tetraThickness': uniformNames.push('u_tetraThickness'); break; 
            case 'glitchIntensity': uniformNames.push('u_glitchIntensity'); break; 
            case 'colorShift': uniformNames.push('u_colorShift'); break; 
            case 'audioLevels': uniformNames.push('u_audioBass', 'u_audioMid', 'u_audioHigh'); break; 
            case 'colorScheme': uniformNames.push('u_primaryColor', 'u_secondaryColor', 'u_backgroundColor'); break; 
            default: break; 
        } 
        uniformNames.forEach(name => this.state._dirtyUniforms.add(name)); 
    }
    
    _setupWebGLState() { 
        const gl = this.gl; 
        const bg = this.state.colorScheme.background; 
        gl.clearColor(bg[0], bg[1], bg[2], 1.0); 
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); 
        gl.disable(gl.DEPTH_TEST); 
        gl.enable(gl.BLEND); 
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); 
    }
    
    _initBuffers() { 
        const gl = this.gl; 
        const pos = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]); 
        this.quadBuffer = gl.createBuffer(); 
        if (!this.quadBuffer) throw new Error("Buffer creation failed."); 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer); 
        gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW); 
        gl.bindBuffer(gl.ARRAY_BUFFER, null); 
    }
    
    _updateShaderIfNeeded() { 
        if (!this.state.needsShaderUpdate) return true; 
        const progName=this.state.shaderProgramName, geomName=this.state.geometryType, projName=this.state.projectionMethod; 
        console.log(`Updating shader '${progName}' (G:${geomName}, P:${projName})`); 
        const program = this.shaderManager.createDynamicProgram(progName, geomName, projName); 
        if (!program) { 
            console.error(`Shader update failed.`); 
            this.state.callbacks.onError?.(new Error(`Shader update failed`)); 
            this.stop(); 
            return false; 
        } 
        this.state.needsShaderUpdate = false; 
        this.shaderManager.useProgram(progName); 
        this.aPositionLoc = this.shaderManager.getAttributeLocation('a_position'); 
        if (this.aPositionLoc === null) { 
            console.warn(`Attr 'a_position' missing.`); 
        } else { 
            try { 
                this.gl.enableVertexAttribArray(this.aPositionLoc); 
            } catch (e) { 
                console.error(`Enable attr error:`, e); 
                this.aPositionLoc = -1; 
            } 
        } 
        this._markAllUniformsDirty(); 
        console.log(`Shader updated.`); 
        return true; 
    }
    
    updateParameters(newParams) {
        let shaderNeedsUpdate = false;
        for (const key in newParams) {
            if (!Object.hasOwnProperty.call(this.state, key)) continue;
            const oldValue = this.state[key];
            const newValue = newParams[key];
            let changed = false;
            
            if (typeof oldValue === 'object' && oldValue !== null && !Array.isArray(oldValue)) {
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    this.state[key] = { ...oldValue, ...newValue };
                    changed = true;
                    if (key === 'colorScheme') {
                        if (newValue.hasOwnProperty('primary')) this._markUniformDirty('colorScheme.primary');
                        if (newValue.hasOwnProperty('secondary')) this._markUniformDirty('colorScheme.secondary');
                        if (newValue.hasOwnProperty('background')) this._markUniformDirty('colorScheme.background');
                    } else if (key === 'audioLevels') {
                        if (newValue.hasOwnProperty('bass')) this._markUniformDirty('audioLevels.bass');
                        if (newValue.hasOwnProperty('mid')) this._markUniformDirty('audioLevels.mid');
                        if (newValue.hasOwnProperty('high')) this._markUniformDirty('audioLevels.high');
                    }
                }
            } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.state[key] = newValue;
                changed = true;
                this._markUniformDirty(key);
                if (key === 'geometryType' || key === 'projectionMethod') {
                    shaderNeedsUpdate = true;
                }
            }
        }
        
        if (shaderNeedsUpdate) {
            this.state.needsShaderUpdate = true;
        }
    }
    
    start() {
        if (this.state.isRendering) return;
        console.log(`Starting render loop.`);
        this.state.isRendering = true;
        this.state.startTime = performance.now();
        this.state.time = 0;
        this.state.lastUpdateTime = this.state.startTime;
        
        if (this.state.needsShaderUpdate) {
            if (!this._updateShaderIfNeeded()) {
                console.error(`Initial shader update failed.`);
                this.state.isRendering = false;
                return;
            }
        }
        
        this._markAllUniformsDirty();
        this.state.animationFrameId = requestAnimationFrame(this._render.bind(this));
    }
    
    _render(timestamp) {
        if (!this.state.isRendering) return;
        const gl = this.gl;
        
        if (!gl || gl.isContextLost()) {
            console.warn(`Context lost - attempting recovery.`);
            this._attemptContextRecovery();
            return;
        }
        
        if (!this.state.startTime) this.state.startTime = timestamp;
        const currentTime = (timestamp - this.state.startTime) * 0.001;
        this.state.deltaTime = currentTime - this.state.time;
        this.state.time = currentTime;
        this.state.lastUpdateTime = timestamp;
        this._markUniformDirty('time');
        
        this._checkResize();
        
        if (this.state.needsShaderUpdate) {
            if (!this._updateShaderIfNeeded()) {
                return;
            }
        }
        
        this._setUniforms();
        
        const bg = this.state.colorScheme.background;
        gl.clearColor(bg[0], bg[1], bg[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        if (this.quadBuffer && this.aPositionLoc !== null && this.aPositionLoc >= 0) {
            try {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
                gl.enableVertexAttribArray(this.aPositionLoc);
                gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            } catch (e) {
                console.error("Draw error:", e);
                this.stop();
                this.state.callbacks.onError?.(new Error("WebGL draw error"));
            }
        }
        
        this.state.callbacks.onRender?.(this.state);
        this.state.animationFrameId = requestAnimationFrame(this._render.bind(this));
    }
    
    _checkResize() { 
        const gl=this.gl, c=this.canvas, dw=c.clientWidth, dh=c.clientHeight; 
        if(c.width!==dw || c.height!==dh){ 
            c.width=dw; 
            c.height=dh; 
            gl.viewport(0,0,dw,dh); 
            this.state.resolution=[dw,dh]; 
            this._markUniformDirty('resolution'); 
            return true; 
        } 
        return false; 
    }
    
    _setUniforms() {
        const gl = this.gl;
        const dirty = this.state._dirtyUniforms;
        const programName = this.state.shaderProgramName;
        
        if (!this.shaderManager.useProgram(programName) || this.shaderManager.currentProgramName !== programName) return;
        
        const timeLoc = this.shaderManager.getUniformLocation('u_time');
        if (timeLoc) gl.uniform1f(timeLoc, this.state.time);
        else dirty.add('u_time');
        
        const uniformsToRetry = new Set();
        dirty.forEach(name => {
            if (name === 'u_time') return;
            const loc = this.shaderManager.getUniformLocation(name);
            if (loc !== null) {
                try {
                    switch (name) {
                        case 'u_resolution': gl.uniform2fv(loc, this.state.resolution); break;
                        case 'u_dimension': gl.uniform1f(loc, this.state.dimensions); break;
                        case 'u_morphFactor': gl.uniform1f(loc, this.state.morphFactor); break;
                        case 'u_rotationSpeed': gl.uniform1f(loc, this.state.rotationSpeed); break;
                        case 'u_universeModifier': gl.uniform1f(loc, this.state.universeModifier); break;
                        case 'u_patternIntensity': gl.uniform1f(loc, this.state.patternIntensity); break;
                        case 'u_gridDensity': gl.uniform1f(loc, this.state.gridDensity); break;
                        case 'u_lineThickness': gl.uniform1f(loc, this.state.lineThickness); break;
                        case 'u_shellWidth': gl.uniform1f(loc, this.state.shellWidth); break;
                        case 'u_tetraThickness': gl.uniform1f(loc, this.state.tetraThickness); break;
                        case 'u_glitchIntensity': gl.uniform1f(loc, this.state.glitchIntensity); break;
                        case 'u_colorShift': gl.uniform1f(loc, this.state.colorShift); break;
                        case 'u_audioBass': gl.uniform1f(loc, this.state.audioLevels.bass); break;
                        case 'u_audioMid': gl.uniform1f(loc, this.state.audioLevels.mid); break;
                        case 'u_audioHigh': gl.uniform1f(loc, this.state.audioLevels.high); break;
                        case 'u_primaryColor': gl.uniform3fv(loc, this.state.colorScheme.primary); break;
                        case 'u_secondaryColor': gl.uniform3fv(loc, this.state.colorScheme.secondary); break;
                        case 'u_backgroundColor': gl.uniform3fv(loc, this.state.colorScheme.background); break;
                        default: break;
                    }
                } catch (e) {
                    console.error(`Error setting uniform '${name}':`, e);
                }
            } else {
                uniformsToRetry.add(name);
            }
        });
        this.state._dirtyUniforms = uniformsToRetry;
    }
    
    stop() {
        if (!this.state.isRendering) return;
        console.log(`Stopping render loop.`);
        if (this.state.animationFrameId) {
            cancelAnimationFrame(this.state.animationFrameId);
        }
        this.state.isRendering = false;
        this.state.animationFrameId = null;
    }
    
    _attemptContextRecovery() {
        if (this.state.contextRecoveryAttempts >= 3) {
            console.error('Maximum context recovery attempts reached. Stopping render loop.');
            this.stop();
            this.state.callbacks.onError?.(new Error('WebGL context permanently lost'));
            return;
        }
        
        this.state.contextRecoveryAttempts = (this.state.contextRecoveryAttempts || 0) + 1;
        console.log(`Context recovery attempt ${this.state.contextRecoveryAttempts}/3`);
        
        // Stop current rendering
        if (this.state.animationFrameId) {
            cancelAnimationFrame(this.state.animationFrameId);
            this.state.animationFrameId = null;
        }
        
        // Attempt to recreate WebGL context
        setTimeout(() => {
            try {
                // Force canvas context recreation
                const canvas = this.canvas;
                const contextAttributes = {
                    antialias: true,
                    alpha: true,
                    premultipliedAlpha: false,
                    preserveDrawingBuffer: false,
                    powerPreference: "default"
                };
                
                // Try to get new context
                this.gl = canvas.getContext('webgl2', contextAttributes) || 
                         canvas.getContext('webgl', contextAttributes);
                
                if (this.gl && !this.gl.isContextLost()) {
                    console.log('✅ WebGL context recovered successfully');
                    
                    // Reinitialize shader manager
                    this.shaderManager = new ShaderManager(this.gl);
                    this.shaderManager.setupShaderPrograms();
                    
                    // Mark all uniforms as dirty for reupload
                    this.state._dirtyUniforms = new Set([
                        'u_resolution', 'u_time', 'u_dimension', 'u_morphFactor', 
                        'u_rotationSpeed', 'u_universeModifier', 'u_patternIntensity', 
                        'u_gridDensity', 'u_lineThickness', 'u_shellWidth', 
                        'u_tetraThickness', 'u_glitchIntensity', 'u_colorShift',
                        'u_audioBass', 'u_audioMid', 'u_audioHigh', 'u_primaryColor'
                    ]);
                    
                    // Reset recovery counter
                    this.state.contextRecoveryAttempts = 0;
                    
                    // Resume rendering if it was active
                    if (this.state.isRendering) {
                        this.state.animationFrameId = requestAnimationFrame(this._render.bind(this));
                    }
                    
                } else {
                    throw new Error('Failed to recreate WebGL context');
                }
                
            } catch (error) {
                console.error(`Context recovery attempt ${this.state.contextRecoveryAttempts} failed:`, error);
                
                // Try again after longer delay if attempts remain
                if (this.state.contextRecoveryAttempts < 3) {
                    setTimeout(() => this._attemptContextRecovery(), 1000);
                } else {
                    this.stop();
                    this.state.callbacks.onError?.(new Error('WebGL context recovery failed permanently'));
                }
            }
        }, 500); // Wait 500ms before attempting recovery
    }
    
    getStatus() {
        return {
            geometry: this.state.geometryType,
            projection: this.state.projectionMethod,
            isAnimating: this.state.isRendering,
            availableGeometries: this.geometryManager.getGeometryTypes(),
            availableProjections: this.projectionManager.getProjectionTypes(),
            time: this.state.time,
            resolution: this.state.resolution
        };
    }
}

// ============================================================================
// 🎯 EXPORT WORKING CORE ARCHITECTURE
// ============================================================================

window.VIB34D_WorkingCore = {
    BaseGeometry,
    BaseProjection,
    HypercubeGeometry,
    HypersphereGeometry,
    HypertetrahedronGeometry,
    TorusGeometry,
    KleinGeometry,
    FractalGeometry,
    WaveGeometry,
    CrystalGeometry,
    PerspectiveProjection,
    OrthographicProjection,
    StereographicProjection,
    GeometryManager,
    ProjectionManager,
    ShaderManager,
    HypercubeCore
};

console.log('✅ VIB34D Working Core Architecture loaded successfully');
console.log('📊 Available geometries:', ['hypercube', 'hypersphere', 'hypertetrahedron', 'torus', 'klein', 'fractal', 'wave', 'crystal']);
console.log('📊 Available projections:', ['perspective', 'orthographic', 'stereographic']);