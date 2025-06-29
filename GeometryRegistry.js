class GeometryRegistry {
    constructor() {
        this.geometries = new Map();
        this.shaders = new Map();
        this.visualsConfig = null;
        this.isInitialized = false;
        this.eventBus = new EventTarget();
    }

    async initialize(visualsConfig) {
        this.visualsConfig = visualsConfig;
        
        if (!visualsConfig.geometries) {
            throw new Error('No geometries configuration found');
        }

        console.log('🔷 GeometryRegistry initializing...');
        
        await this.loadGeometryDefinitions();
        await this.loadShaderPrograms();
        
        this.isInitialized = true;
        console.log('✅ GeometryRegistry initialized');
        
        this.eventBus.dispatchEvent(new CustomEvent('geometryRegistryReady', {
            detail: { 
                geometryCount: this.geometries.size,
                shaderCount: this.shaders.size
            }
        }));
    }

    async loadGeometryDefinitions() {
        const geometryDefinitions = this.visualsConfig.geometries;
        
        for (const geoDef of geometryDefinitions) {
            const geometry = {
                name: geoDef.name,
                shaderFile: geoDef.shaderFile,
                description: geoDef.description,
                vertexShader: null,
                fragmentShader: null,
                defaultParameters: this.extractDefaultParameters(geoDef.name)
            };
            
            this.geometries.set(geoDef.name, geometry);
            console.log(`📐 Registered geometry: ${geoDef.name}`);
        }
    }

    async loadShaderPrograms() {
        for (const [name, geometry] of this.geometries.entries()) {
            try {
                const shaderCode = await this.loadShaderCode(name);
                geometry.vertexShader = shaderCode.vertex;
                geometry.fragmentShader = shaderCode.fragment;
                
                this.shaders.set(name, {
                    vertex: geometry.vertexShader,
                    fragment: geometry.fragmentShader,
                    uniforms: this.extractShaderUniforms(shaderCode.fragment)
                });
                
                console.log(`🎨 Loaded shaders for: ${name}`);
            } catch (error) {
                console.warn(`⚠️ Could not load shaders for ${name}, using fallback:`, error.message);
                await this.createFallbackShader(name);
            }
        }
    }

    async loadShaderCode(geometryName) {
        const shaderFile = this.geometries.get(geometryName)?.shaderFile;
        
        if (shaderFile) {
            try {
                const response = await fetch(shaderFile);
                if (response.ok) {
                    const shaderSource = await response.text();
                    return this.parseShaderFile(shaderSource);
                }
            } catch (error) {
                console.warn(`Failed to fetch shader file ${shaderFile}:`, error);
            }
        }
        
        return this.generateProceduralShader(geometryName);
    }

    parseShaderFile(shaderSource) {
        const vertexMatch = shaderSource.match(/#vertex\s+([\s\S]*?)(?=#fragment|$)/);
        const fragmentMatch = shaderSource.match(/#fragment\s+([\s\S]*?)$/);
        
        return {
            vertex: vertexMatch ? vertexMatch[1].trim() : this.getDefaultVertexShader(),
            fragment: fragmentMatch ? fragmentMatch[1].trim() : this.getDefaultFragmentShader()
        };
    }

    generateProceduralShader(geometryName) {
        const vertex = this.getDefaultVertexShader();
        const fragment = this.generateGeometrySpecificFragmentShader(geometryName);
        
        return { vertex, fragment };
    }

    generateGeometrySpecificFragmentShader(geometryName) {
        const baseShader = this.getDefaultFragmentShader();
        
        let geometryFunction = '';
        
        switch (geometryName) {
            case 'hypercube':
                geometryFunction = `
                    float hypercubePattern(vec3 pos) {
                        vec3 grid = abs(fract(pos * u_gridDensity) - 0.5);
                        float d = length(max(grid - 0.3, 0.0));
                        return smoothstep(0.1, 0.0, d);
                    }
                    
                    vec3 hypercube4D(vec3 pos) {
                        float w = sin(u_time * 0.5) * u_dimension;
                        vec4 pos4d = vec4(pos, w);
                        
                        mat4 rotation = mat4(
                            cos(u_time * 0.3), -sin(u_time * 0.3), 0, 0,
                            sin(u_time * 0.3), cos(u_time * 0.3), 0, 0,
                            0, 0, cos(u_time * 0.2), -sin(u_time * 0.2),
                            0, 0, sin(u_time * 0.2), cos(u_time * 0.2)
                        );
                        
                        pos4d = rotation * pos4d;
                        return pos4d.xyz / (1.0 + abs(pos4d.w) * 0.3);
                    }
                `;
                break;
                
            case 'tetrahedron':
                geometryFunction = `
                    float tetrahedronSDF(vec3 p) {
                        float a = sqrt(3.0) / 3.0;
                        vec3 n1 = vec3(1, 1, 1);
                        vec3 n2 = vec3(-1, -1, 1);
                        vec3 n3 = vec3(1, -1, -1);
                        vec3 n4 = vec3(-1, 1, -1);
                        
                        float d1 = dot(p, normalize(n1)) - a;
                        float d2 = dot(p, normalize(n2)) - a;
                        float d3 = dot(p, normalize(n3)) - a;
                        float d4 = dot(p, normalize(n4)) - a;
                        
                        return max(max(d1, d2), max(d3, d4));
                    }
                `;
                break;
                
            case 'sphere':
                geometryFunction = `
                    float sphereHarmonics(vec3 pos) {
                        float r = length(pos);
                        float theta = atan(pos.y, pos.x);
                        float phi = acos(pos.z / r);
                        
                        float y22 = sin(2.0 * phi) * cos(2.0 * theta);
                        float modulation = 1.0 + u_morphFactor * y22 * 0.3;
                        
                        return abs(r - u_shellWidth * modulation);
                    }
                `;
                break;
                
            case 'torus':
                geometryFunction = `
                    float torusSDF(vec3 p) {
                        float major = 0.8;
                        float minor = 0.3;
                        vec2 q = vec2(length(p.xz) - major, p.y);
                        return length(q) - minor;
                    }
                    
                    vec3 torusFlow(vec3 pos) {
                        float angle = atan(pos.z, pos.x) + u_time * u_rotationSpeed;
                        float flow = sin(angle * 3.0 + u_time * 2.0) * u_universeModifier;
                        return pos + vec3(0, flow * 0.1, 0);
                    }
                `;
                break;
                
            case 'klein':
                geometryFunction = `
                    vec3 kleinBottle(vec3 pos) {
                        float u = pos.x * 3.14159;
                        float v = pos.y * 3.14159 * 2.0;
                        
                        float x = (2.0 + cos(v/2.0) * sin(u) - sin(v/2.0) * sin(2.0*u)) * cos(v);
                        float y = (2.0 + cos(v/2.0) * sin(u) - sin(v/2.0) * sin(2.0*u)) * sin(v);
                        float z = sin(v/2.0) * sin(u) + cos(v/2.0) * sin(2.0*u);
                        
                        return vec3(x, y, z) * 0.2;
                    }
                `;
                break;
                
            case 'fractal':
                geometryFunction = `
                    float mandelbulb(vec3 pos) {
                        vec3 z = pos;
                        float dr = 1.0;
                        float r = 0.0;
                        float power = 8.0;
                        
                        for (int i = 0; i < 8; i++) {
                            r = length(z);
                            if (r > 2.0) break;
                            
                            float theta = acos(z.z / r);
                            float phi = atan(z.y, z.x);
                            dr = pow(r, power - 1.0) * power * dr + 1.0;
                            
                            float zr = pow(r, power);
                            theta = theta * power;
                            phi = phi * power;
                            
                            z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
                            z += pos;
                        }
                        
                        return 0.5 * log(r) * r / dr;
                    }
                `;
                break;
                
            case 'wave':
                geometryFunction = `
                    float waveFunction(vec3 pos) {
                        float wave1 = sin(pos.x * 5.0 + u_time * 2.0) * cos(pos.z * 3.0 + u_time * 1.5);
                        float wave2 = sin(pos.y * 4.0 + u_time * 1.8) * cos(pos.x * 2.0 + u_time * 2.2);
                        float interference = wave1 * wave2 * u_patternIntensity;
                        
                        return abs(pos.y - interference * 0.3);
                    }
                `;
                break;
                
            case 'crystal':
                geometryFunction = `
                    float crystalLattice(vec3 pos) {
                        vec3 cell = fract(pos * u_gridDensity) - 0.5;
                        float d1 = length(cell) - 0.3;
                        
                        vec3 edge = abs(cell);
                        float d2 = max(edge.x, max(edge.y, edge.z)) - 0.1;
                        
                        return min(d1, d2);
                    }
                `;
                break;
                
            default:
                geometryFunction = `
                    float defaultPattern(vec3 pos) {
                        return length(fract(pos * 2.0) - 0.5) - 0.2;
                    }
                `;
        }

        return baseShader.replace('// GEOMETRY_FUNCTION_PLACEHOLDER', geometryFunction);
    }

    getDefaultVertexShader() {
        return `
            attribute vec3 a_position;
            attribute vec2 a_texCoord;
            
            uniform mat4 u_matrix;
            uniform float u_time;
            
            varying vec2 v_texCoord;
            varying vec3 v_position;
            
            void main() {
                v_texCoord = a_texCoord;
                v_position = a_position;
                gl_Position = vec4(a_position, 1.0);
            }
        `;
    }

    getDefaultFragmentShader() {
        return `
            precision mediump float;
            
            uniform float u_time;
            uniform float u_dimension;
            uniform float u_morphFactor;
            uniform float u_rotationSpeed;
            uniform float u_gridDensity;
            uniform float u_lineThickness;
            uniform float u_patternIntensity;
            uniform float u_colorShift;
            uniform float u_glitchIntensity;
            uniform float u_tetraThickness;
            uniform float u_shellWidth;
            uniform float u_universeModifier;
            uniform vec2 u_resolution;
            
            varying vec2 v_texCoord;
            varying vec3 v_position;
            
            // GEOMETRY_FUNCTION_PLACEHOLDER
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
                vec2 st = gl_FragCoord.xy / u_resolution.xy;
                vec3 pos = vec3((st - 0.5) * 2.0, sin(u_time * 0.5) * 0.5);
                
                float intensity = u_patternIntensity;
                vec3 color = hsv2rgb(vec3(u_colorShift + u_time * 0.1, 0.8, intensity));
                
                // Apply glitch effect
                if (u_glitchIntensity > 0.0) {
                    float glitch = sin(st.y * 100.0 + u_time * 10.0) * u_glitchIntensity;
                    color.r += glitch;
                    color.gb *= (1.0 - glitch * 0.5);
                }
                
                gl_FragColor = vec4(color, 0.8);
            }
        `;
    }

    async createFallbackShader(geometryName) {
        const fallbackShader = this.generateProceduralShader(geometryName);
        const geometry = this.geometries.get(geometryName);
        
        geometry.vertexShader = fallbackShader.vertex;
        geometry.fragmentShader = fallbackShader.fragment;
        
        this.shaders.set(geometryName, {
            vertex: fallbackShader.vertex,
            fragment: fallbackShader.fragment,
            uniforms: this.extractShaderUniforms(fallbackShader.fragment)
        });
    }

    extractDefaultParameters(geometryName) {
        const allParams = this.visualsConfig.parameters || {};
        const relevantParams = {};
        
        Object.entries(allParams).forEach(([key, value]) => {
            relevantParams[key] = value.default;
        });
        
        return relevantParams;
    }

    extractShaderUniforms(fragmentShader) {
        const uniformPattern = /uniform\s+(\w+)\s+(\w+);/g;
        const uniforms = {};
        let match;
        
        while ((match = uniformPattern.exec(fragmentShader)) !== null) {
            const type = match[1];
            const name = match[2];
            uniforms[name] = { type, name };
        }
        
        return uniforms;
    }

    getGeometry(name) {
        return this.geometries.get(name);
    }

    getShader(name) {
        return this.shaders.get(name);
    }

    getAllGeometries() {
        return Array.from(this.geometries.keys());
    }

    getAllShaders() {
        return Array.from(this.shaders.keys());
    }

    addEventListener(eventType, listener) {
        this.eventBus.addEventListener(eventType, listener);
    }

    removeEventListener(eventType, listener) {
        this.eventBus.removeEventListener(eventType, listener);
    }
}

window.GeometryRegistry = GeometryRegistry;