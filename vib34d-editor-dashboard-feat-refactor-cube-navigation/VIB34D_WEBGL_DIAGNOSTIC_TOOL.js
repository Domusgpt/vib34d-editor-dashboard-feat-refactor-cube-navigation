/**
 * VIB34D WebGL Diagnostic and Repair Tool
 * Comprehensive debugging and fallback system for WebGL rendering issues
 */

class WebGLDiagnosticTool {
    constructor() {
        this.diagnosticResults = {};
        this.repairs = [];
        this.fallbackStrategies = [];
    }

    // Run comprehensive WebGL diagnostics
    async runFullDiagnostic() {
        console.log('🔬 Starting comprehensive WebGL diagnostic...');
        
        const results = {
            webglSupport: this.checkWebGLSupport(),
            shaderCompilation: await this.testShaderCompilation(),
            bufferOperations: this.testBufferOperations(),
            uniformHandling: this.testUniformHandling(),
            matrixOperations: this.testMatrixOperations(),
            renderingPipeline: this.testRenderingPipeline(),
            commonIssues: this.checkCommonIssues(),
            performance: await this.testPerformance(),
            compatibility: this.checkBrowserCompatibility()
        };

        this.diagnosticResults = results;
        this.generateRecommendations();
        
        return results;
    }

    // Check WebGL support and capabilities
    checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        let gl = null;
        
        try {
            gl = canvas.getContext('webgl2', { antialias: true, alpha: true });
            if (!gl) {
                gl = canvas.getContext('webgl', { antialias: true, alpha: true });
            }
            if (!gl) {
                gl = canvas.getContext('experimental-webgl', { antialias: true, alpha: true });
            }
        } catch (e) {
            console.error('WebGL context creation failed:', e);
        }

        if (!gl) {
            return {
                supported: false,
                version: null,
                extensions: [],
                limits: {},
                error: 'WebGL not supported'
            };
        }

        // Get WebGL capabilities
        const extensions = gl.getSupportedExtensions() || [];
        const limits = {
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
            maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
            maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
            maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
            maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
        };

        const version = gl.getParameter(gl.VERSION);
        const vendor = gl.getParameter(gl.VENDOR);
        const renderer = gl.getParameter(gl.RENDERER);

        return {
            supported: true,
            version,
            vendor,
            renderer,
            extensions,
            limits,
            context: gl.constructor.name
        };
    }

    // Test shader compilation with various approaches
    async testShaderCompilation() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { success: false, error: 'No WebGL context' };
        }

        const testResults = {};

        // Test 1: Ultra-simple shaders (should always work)
        const simpleVertexShader = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const simpleFragmentShader = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;

        testResults.simple = this.compileShaderProgram(gl, simpleVertexShader, simpleFragmentShader);

        // Test 2: Basic 3D shaders
        const basic3DVertexShader = `
            precision mediump float;
            attribute vec3 a_position;
            uniform mat4 u_matrix;
            void main() {
                gl_Position = u_matrix * vec4(a_position, 1.0);
            }
        `;

        const basic3DFragmentShader = `
            precision mediump float;
            uniform float u_time;
            void main() {
                float intensity = 0.5 + 0.5 * sin(u_time);
                gl_FragColor = vec4(intensity, 0.0, 1.0 - intensity, 1.0);
            }
        `;

        testResults.basic3D = this.compileShaderProgram(gl, basic3DVertexShader, basic3DFragmentShader);

        // Test 3: Current VIB34D shaders (to identify specific issues)
        const vib34dVertexShader = `
            precision mediump float;
            attribute vec3 a_position;
            uniform mat4 u_matrix;
            uniform float u_time;
            uniform float u_geometry;
            uniform float u_masterKey;
            varying vec3 v_position;
            varying float v_depth;
            
            void main() {
                vec3 pos = a_position * 0.5;
                
                float angle = u_time * 0.2;
                float c = cos(angle);
                float s = sin(angle);
                
                vec3 rotated = vec3(
                    pos.x * c - pos.z * s,
                    pos.y,
                    pos.x * s + pos.z * c
                );
                
                v_position = rotated;
                v_depth = 0.0;
                
                gl_Position = vec4(rotated.xy, 0.0, 1.0);
            }
        `;

        const vib34dFragmentShader = `
            precision mediump float;
            
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform float u_geometry;
            uniform float u_intensity;
            uniform float u_complexity;
            uniform float u_rotation;
            uniform float u_scale;
            uniform float u_colorShift;
            uniform float u_distortion;
            uniform float u_audioLevel;
            uniform float u_beatPulse;
            uniform float u_dimension;
            uniform float u_projection;
            uniform float u_emergence;
            uniform float u_crystallization;
            uniform float u_holographic;
            
            varying vec3 v_position;
            varying float v_depth;
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution;
                
                vec3 debugColor = vec3(
                    0.5 + 0.5 * sin(u_time + uv.x * 10.0),
                    0.5 + 0.5 * sin(u_time + uv.y * 10.0 + 2.0),
                    0.5 + 0.5 * sin(u_time + (uv.x + uv.y) * 10.0 + 4.0)
                );
                
                debugColor = max(debugColor, vec3(0.3));
                
                float pulse = 0.7 + 0.3 * sin(u_time * 3.0);
                debugColor *= pulse;
                
                gl_FragColor = vec4(debugColor, 1.0);
            }
        `;

        testResults.vib34d = this.compileShaderProgram(gl, vib34dVertexShader, vib34dFragmentShader);

        return testResults;
    }

    // Helper to compile shader programs
    compileShaderProgram(gl, vertexSource, fragmentSource) {
        try {
            const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
            const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
            
            if (!vertexShader || !fragmentShader) {
                return { success: false, error: 'Shader compilation failed' };
            }

            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                const error = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                return { success: false, error: `Program linking failed: ${error}` };
            }

            return { success: true, program };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            console.error(`Shader compilation error (${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'}):`, error);
            return null;
        }

        return shader;
    }

    // Test buffer operations
    testBufferOperations() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { success: false, error: 'No WebGL context' };
        }

        try {
            // Test vertex buffer creation
            const vertices = new Float32Array([
                -1, -1, 0,  1, -1, 0,  0, 1, 0
            ]);

            const vertexBuffer = gl.createBuffer();
            if (!vertexBuffer) {
                return { success: false, error: 'Failed to create vertex buffer' };
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            // Test index buffer creation
            const indices = new Uint16Array([0, 1, 2]);
            const indexBuffer = gl.createBuffer();
            if (!indexBuffer) {
                return { success: false, error: 'Failed to create index buffer' };
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            return { 
                success: true, 
                vertexBuffer, 
                indexBuffer,
                vertexCount: vertices.length / 3,
                indexCount: indices.length 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Test uniform handling
    testUniformHandling() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { success: false, error: 'No WebGL context' };
        }

        const vertexShader = `
            attribute vec2 a_position;
            uniform float u_scale;
            uniform vec2 u_resolution;
            uniform mat4 u_matrix;
            void main() {
                gl_Position = vec4(a_position * u_scale, 0.0, 1.0);
            }
        `;

        const fragmentShader = `
            precision mediump float;
            uniform float u_time;
            uniform vec3 u_color;
            void main() {
                gl_FragColor = vec4(u_color, 1.0);
            }
        `;

        const result = this.compileShaderProgram(gl, vertexShader, fragmentShader);
        if (!result.success) {
            return result;
        }

        try {
            gl.useProgram(result.program);

            // Test different uniform types
            const uniforms = {
                u_scale: gl.getUniformLocation(result.program, 'u_scale'),
                u_resolution: gl.getUniformLocation(result.program, 'u_resolution'),
                u_matrix: gl.getUniformLocation(result.program, 'u_matrix'),
                u_time: gl.getUniformLocation(result.program, 'u_time'),
                u_color: gl.getUniformLocation(result.program, 'u_color')
            };

            // Test setting uniforms
            gl.uniform1f(uniforms.u_scale, 1.0);
            gl.uniform2f(uniforms.u_resolution, 800, 600);
            gl.uniform1f(uniforms.u_time, 0.0);
            gl.uniform3f(uniforms.u_color, 1.0, 0.0, 0.0);
            
            // Test matrix uniform
            const matrix = new Float32Array(16);
            matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1.0; // Identity matrix
            gl.uniformMatrix4fv(uniforms.u_matrix, false, matrix);

            return { success: true, uniforms };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Test matrix operations
    testMatrixOperations() {
        try {
            // Test basic matrix creation and multiplication
            const identity = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);

            const perspective = this.createPerspectiveMatrix(Math.PI / 4, 1.0, 0.1, 100.0);
            const view = this.createViewMatrix([0, 0, 5], [0, 0, 0], [0, 1, 0]);
            const model = this.createRotationMatrix(0.5, [1, 1, 1]);

            const mvp = new Float32Array(16);
            this.multiplyMatrices(mvp, perspective, view);
            this.multiplyMatrices(mvp, mvp, model);

            return { 
                success: true, 
                matrices: { identity, perspective, view, model, mvp },
                determinant: this.calculateDeterminant(mvp)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Test complete rendering pipeline
    testRenderingPipeline() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { success: false, error: 'No WebGL context' };
        }

        try {
            // Setup viewport
            gl.viewport(0, 0, canvas.width, canvas.height);
            
            // Test clear operations
            gl.clearColor(0.2, 0.2, 0.2, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            // Enable depth testing
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            
            // Test blending
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            
            // Simple render test
            const vertices = new Float32Array([
                0.0,  0.5, 0.0,
                -0.5, -0.5, 0.0,
                0.5, -0.5, 0.0
            ]);
            
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            
            const vertexShader = `
                attribute vec3 a_position;
                void main() {
                    gl_Position = vec4(a_position, 1.0);
                }
            `;
            
            const fragmentShader = `
                precision mediump float;
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                }
            `;
            
            const program = this.compileShaderProgram(gl, vertexShader, fragmentShader);
            if (!program.success) {
                return program;
            }
            
            gl.useProgram(program.program);
            
            const positionAttrib = gl.getAttribLocation(program.program, 'a_position');
            gl.enableVertexAttribArray(positionAttrib);
            gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
            
            // Draw triangle
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            
            // Check for errors
            const error = gl.getError();
            if (error !== gl.NO_ERROR) {
                return { success: false, error: `WebGL error: ${error}` };
            }
            
            // Test pixel reading
            const pixels = new Uint8Array(4);
            gl.readPixels(canvas.width / 2, canvas.height / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            
            return { 
                success: true, 
                canvas,
                pixelColor: Array.from(pixels),
                hasVisibleContent: pixels[0] > 0 || pixels[1] > 0 || pixels[2] > 0
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Check for common WebGL issues
    checkCommonIssues() {
        const issues = [];
        
        // Check for common problematic patterns
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            issues.push({
                type: 'fatal',
                message: 'WebGL context creation failed',
                solution: 'Use Canvas 2D fallback'
            });
            return { issues };
        }

        // Check for context loss
        const extension = gl.getExtension('WEBGL_lose_context');
        if (!extension) {
            issues.push({
                type: 'warning',
                message: 'WEBGL_lose_context extension not available',
                solution: 'Implement manual context recovery'
            });
        }

        // Check precision support
        const vertexPrecision = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
        const fragmentPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        
        if (vertexPrecision.precision === 0) {
            issues.push({
                type: 'warning',
                message: 'High precision floats not supported in vertex shaders',
                solution: 'Use mediump precision'
            });
        }
        
        if (fragmentPrecision.precision === 0) {
            issues.push({
                type: 'warning',
                message: 'High precision floats not supported in fragment shaders',
                solution: 'Use mediump precision'
            });
        }

        // Check texture limits
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTextureSize < 1024) {
            issues.push({
                type: 'warning',
                message: `Low maximum texture size: ${maxTextureSize}`,
                solution: 'Reduce texture sizes or use texture atlasing'
            });
        }

        return { issues };
    }

    // Test performance
    async testPerformance() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            return { success: false, error: 'No WebGL context' };
        }

        try {
            const startTime = performance.now();
            
            // Render 100 frames to test performance
            for (let i = 0; i < 100; i++) {
                gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            
            const endTime = performance.now();
            const avgFrameTime = (endTime - startTime) / 100;
            const estimatedFPS = 1000 / avgFrameTime;
            
            return {
                success: true,
                avgFrameTime,
                estimatedFPS,
                performance: estimatedFPS > 30 ? 'good' : estimatedFPS > 15 ? 'acceptable' : 'poor'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Check browser compatibility
    checkBrowserCompatibility() {
        const userAgent = navigator.userAgent;
        const issues = [];
        
        // Check for known problematic browsers
        if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            issues.push({
                type: 'warning',
                message: 'Internet Explorer detected - limited WebGL support',
                solution: 'Recommend modern browser upgrade'
            });
        }
        
        if (userAgent.includes('Mobile') && userAgent.includes('Safari')) {
            issues.push({
                type: 'info',
                message: 'Mobile Safari - may have WebGL limitations',
                solution: 'Test thoroughly and provide fallbacks'
            });
        }
        
        // Check WebGL extensions
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
            const extensions = gl.getSupportedExtensions();
            const importantExtensions = [
                'OES_texture_float',
                'OES_standard_derivatives',
                'WEBGL_depth_texture',
                'EXT_texture_filter_anisotropic'
            ];
            
            importantExtensions.forEach(ext => {
                if (!extensions.includes(ext)) {
                    issues.push({
                        type: 'info',
                        message: `Extension ${ext} not supported`,
                        solution: 'Implement fallbacks for advanced features'
                    });
                }
            });
        }
        
        return {
            userAgent,
            issues,
            webgl2Supported: !!canvas.getContext('webgl2')
        };
    }

    // Generate repair recommendations
    generateRecommendations() {
        const recommendations = [];
        
        if (!this.diagnosticResults.webglSupport.supported) {
            recommendations.push({
                priority: 'critical',
                issue: 'WebGL not supported',
                solution: 'Implement robust Canvas 2D fallback system',
                code: this.generateCanvas2DFallback()
            });
        }
        
        if (this.diagnosticResults.shaderCompilation && !this.diagnosticResults.shaderCompilation.vib34d.success) {
            recommendations.push({
                priority: 'high',
                issue: 'VIB34D shaders failing to compile',
                solution: 'Simplify shaders and add precision qualifiers',
                code: this.generateFixedShaders()
            });
        }
        
        if (this.diagnosticResults.renderingPipeline && !this.diagnosticResults.renderingPipeline.hasVisibleContent) {
            recommendations.push({
                priority: 'high',
                issue: 'Rendering produces no visible content',
                solution: 'Fix geometry, matrices, or clear color',
                code: this.generateVisibleRenderingFix()
            });
        }
        
        this.repairs = recommendations;
        return recommendations;
    }

    // Generate Canvas 2D fallback code
    generateCanvas2DFallback() {
        return `
// Robust Canvas 2D fallback implementation
class Canvas2DFallback {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear with gradient background
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, 'rgba(128, 0, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw animated geometry
        this.drawAnimatedGeometry(ctx, width/2, height/2, Math.min(width, height) * 0.3);
        
        this.time += 0.016;
        requestAnimationFrame(() => this.render());
    }
    
    drawAnimatedGeometry(ctx, centerX, centerY, radius) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.time);
        
        // Draw cube wireframe
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-radius/2, -radius/2, radius, radius);
        
        // Draw inner rotating square
        ctx.rotate(this.time * 1.5);
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
        ctx.strokeRect(-radius/3, -radius/3, radius * 2/3, radius * 2/3);
        
        ctx.restore();
    }
}`;
    }

    // Generate fixed shader code
    generateFixedShaders() {
        return `
// Fixed shader implementation with better error handling
const FIXED_VERTEX_SHADER = \`
precision mediump float;
attribute vec3 a_position;
uniform mat4 u_mvpMatrix;
uniform float u_time;
varying vec3 v_position;

void main() {
    v_position = a_position;
    
    // Simple rotation
    float angle = u_time * 0.5;
    mat3 rotation = mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
    );
    
    vec3 rotatedPos = rotation * a_position;
    gl_Position = u_mvpMatrix * vec4(rotatedPos, 1.0);
}
\`;

const FIXED_FRAGMENT_SHADER = \`
precision mediump float;
uniform float u_time;
uniform float u_intensity;
varying vec3 v_position;

void main() {
    // Create bright, visible colors
    vec3 color = vec3(
        0.5 + 0.5 * sin(u_time + v_position.x * 2.0),
        0.5 + 0.5 * sin(u_time + v_position.y * 2.0 + 2.0),
        0.5 + 0.5 * sin(u_time + v_position.z * 2.0 + 4.0)
    );
    
    // Ensure minimum brightness
    color = max(color, vec3(0.2));
    color *= u_intensity;
    
    gl_FragColor = vec4(color, 1.0);
}
\`;`;
    }

    // Generate visible rendering fix
    generateVisibleRenderingFix() {
        return `
// Fix for black/invisible rendering
function setupVisibleRendering(gl) {
    // Use lighter clear color to see dark geometry
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    
    // Disable depth testing if causing issues
    gl.disable(gl.DEPTH_TEST);
    
    // Use simpler projection - orthographic instead of perspective
    function createOrthographicMatrix(left, right, bottom, top, near, far) {
        const matrix = new Float32Array(16);
        matrix[0] = 2 / (right - left);
        matrix[5] = 2 / (top - bottom);
        matrix[10] = -2 / (far - near);
        matrix[12] = -(right + left) / (right - left);
        matrix[13] = -(top + bottom) / (top - bottom);
        matrix[14] = -(far + near) / (far - near);
        matrix[15] = 1;
        return matrix;
    }
    
    // Create larger geometry that's definitely visible
    function createVisibleCube() {
        const size = 0.8; // Larger size
        const vertices = [
            // Front face
            -size, -size,  size,   size, -size,  size,   size,  size,  size,  -size,  size,  size,
            // Back face
            -size, -size, -size,  -size,  size, -size,   size,  size, -size,   size, -size, -size,
            // Top face
            -size,  size, -size,  -size,  size,  size,   size,  size,  size,   size,  size, -size,
            // Bottom face
            -size, -size, -size,   size, -size, -size,   size, -size,  size,  -size, -size,  size,
            // Right face
             size, -size, -size,   size,  size, -size,   size,  size,  size,   size, -size,  size,
            // Left face
            -size, -size, -size,  -size, -size,  size,  -size,  size,  size,  -size,  size, -size
        ];
        
        const indices = [
            0,  1,  2,    0,  2,  3,    // front
            4,  5,  6,    4,  6,  7,    // back
            8,  9,  10,   8,  10, 11,   // top
            12, 13, 14,   12, 14, 15,   // bottom
            16, 17, 18,   16, 18, 19,   // right
            20, 21, 22,   20, 22, 23    // left
        ];
        
        return { vertices, indices };
    }
}`;
    }

    // Matrix utility functions
    createPerspectiveMatrix(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ]);
    }

    createViewMatrix(eye, center, up) {
        const matrix = new Float32Array(16);
        // Simplified view matrix implementation
        matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1;
        matrix[14] = -eye[2]; // Simple translation back
        return matrix;
    }

    createRotationMatrix(angle, axis) {
        const matrix = new Float32Array(16);
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const [x, y, z] = axis;
        
        matrix[0] = t * x * x + c;
        matrix[1] = t * x * y + s * z;
        matrix[2] = t * x * z - s * y;
        matrix[4] = t * x * y - s * z;
        matrix[5] = t * y * y + c;
        matrix[6] = t * y * z + s * x;
        matrix[8] = t * x * z + s * y;
        matrix[9] = t * y * z - s * x;
        matrix[10] = t * z * z + c;
        matrix[15] = 1;
        
        return matrix;
    }

    multiplyMatrices(out, a, b) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        
        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
        
        out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
        out[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
        out[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
        out[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
        out[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
        out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
        out[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
        out[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
        out[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
        out[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
        out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
        out[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
        out[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
        out[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
        out[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
        out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    }

    calculateDeterminant(matrix) {
        const m = matrix;
        return (
            m[0] * (m[5] * (m[10] * m[15] - m[11] * m[14]) - m[9] * (m[6] * m[15] - m[7] * m[14]) + m[13] * (m[6] * m[11] - m[7] * m[10])) -
            m[4] * (m[1] * (m[10] * m[15] - m[11] * m[14]) - m[9] * (m[2] * m[15] - m[3] * m[14]) + m[13] * (m[2] * m[11] - m[3] * m[10])) +
            m[8] * (m[1] * (m[6] * m[15] - m[7] * m[14]) - m[5] * (m[2] * m[15] - m[3] * m[14]) + m[13] * (m[2] * m[7] - m[3] * m[6])) -
            m[12] * (m[1] * (m[6] * m[11] - m[7] * m[10]) - m[5] * (m[2] * m[11] - m[3] * m[10]) + m[9] * (m[2] * m[7] - m[3] * m[6]))
        );
    }

    // Generate diagnostic report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            results: this.diagnosticResults,
            recommendations: this.repairs,
            summary: this.generateSummary()
        };

        return report;
    }

    generateSummary() {
        let summary = 'WebGL Diagnostic Summary:\n\n';
        
        if (this.diagnosticResults.webglSupport?.supported) {
            summary += `✅ WebGL Support: ${this.diagnosticResults.webglSupport.version}\n`;
            summary += `📊 Renderer: ${this.diagnosticResults.webglSupport.renderer}\n`;
        } else {
            summary += '❌ WebGL Support: Not available\n';
        }

        if (this.diagnosticResults.shaderCompilation) {
            const shaderResults = this.diagnosticResults.shaderCompilation;
            summary += `\n🔧 Shader Compilation:\n`;
            summary += `  Simple: ${shaderResults.simple?.success ? '✅' : '❌'}\n`;
            summary += `  Basic 3D: ${shaderResults.basic3D?.success ? '✅' : '❌'}\n`;
            summary += `  VIB34D: ${shaderResults.vib34d?.success ? '✅' : '❌'}\n`;
        }

        if (this.diagnosticResults.renderingPipeline) {
            const pipeline = this.diagnosticResults.renderingPipeline;
            summary += `\n🎨 Rendering Pipeline: ${pipeline.success ? '✅' : '❌'}\n`;
            if (pipeline.success) {
                summary += `  Visible Content: ${pipeline.hasVisibleContent ? '✅' : '❌'}\n`;
            }
        }

        if (this.repairs.length > 0) {
            summary += `\n🔨 Recommended Fixes: ${this.repairs.length}\n`;
            this.repairs.forEach(repair => {
                summary += `  - ${repair.issue} (${repair.priority})\n`;
            });
        } else {
            summary += '\n✅ No critical issues detected\n';
        }

        return summary;
    }
}

// Export for use
window.WebGLDiagnosticTool = WebGLDiagnosticTool;

// Auto-run diagnostic if requested
if (window.location.search.includes('diagnostic=true')) {
    const tool = new WebGLDiagnosticTool();
    tool.runFullDiagnostic().then(results => {
        console.log('🔬 WebGL Diagnostic Complete:', results);
        console.log(tool.generateSummary());
    });
}