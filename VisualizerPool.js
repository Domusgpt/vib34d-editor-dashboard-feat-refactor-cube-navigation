class VisualizerPool {
    constructor() {
        this.visualizers = new Map();
        this.geometryRegistry = null;
        this.activeContexts = new Set();
        this.eventBus = new EventTarget();
        this.animationFrameId = null;
        this.isRendering = false;
        this.globalUniforms = {};
    }

    async initialize(geometryRegistry) {
        this.geometryRegistry = geometryRegistry;
        
        console.log('🎭 VisualizerPool initializing...');
        
        this.setupGlobalUniforms();
        this.setupInteractionListeners();
        this.startRenderLoop();
        
        console.log('✅ VisualizerPool initialized');
        
        this.eventBus.dispatchEvent(new CustomEvent('visualizerPoolReady', {
            detail: { poolSize: this.visualizers.size }
        }));
    }

    setupGlobalUniforms() {
        this.globalUniforms = {
            u_time: 0.0,
            u_resolution: [800, 600],
            u_dimension: 4.0,
            u_morphFactor: 0.5,
            u_rotationSpeed: 1.0,
            u_gridDensity: 8.0,
            u_lineThickness: 0.02,
            u_patternIntensity: 1.0,
            u_colorShift: 0.0,
            u_glitchIntensity: 0.05,
            u_tetraThickness: 0.02,
            u_shellWidth: 0.1,
            u_universeModifier: 1.0
        };
    }

    setupInteractionListeners() {
        // Listen for uniform animation events from InteractionCoordinator
        document.addEventListener('animateUniform', (event) => {
            this.handleUniformAnimation(event.detail);
        });
        
        console.log('🎯 Interaction listeners set up for uniform animations');
    }

    handleUniformAnimation(animationData) {
        const { visualizerId, uniform, targetValue, duration, curve } = animationData;
        
        const visualizer = this.visualizers.get(visualizerId);
        if (!visualizer) {
            console.warn(`⚠️ Visualizer not found: ${visualizerId}`);
            return;
        }

        this.animateVisualizer(visualizer, uniform, targetValue, duration, curve);
    }

    animateVisualizer(visualizer, uniform, targetValue, duration, curve) {
        const startTime = performance.now();
        const startValue = visualizer.uniforms[uniform] || 0;
        
        // Parse target value operations
        let finalValue;
        if (targetValue.operation === 'multiply') {
            finalValue = startValue * targetValue.value;
        } else if (targetValue.operation === 'add') {
            finalValue = startValue + targetValue.value;
        } else if (targetValue.operation === 'reset') {
            finalValue = this.globalUniforms[uniform] || 0;
        } else {
            finalValue = targetValue.value;
        }

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing curve
            const easedProgress = this.applyEasing(progress, curve);
            
            // Interpolate value
            const currentValue = startValue + (finalValue - startValue) * easedProgress;
            
            // Update uniform
            visualizer.uniforms[uniform] = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                console.log(`✅ Uniform animation complete: ${uniform} = ${finalValue}`);
            }
        };

        requestAnimationFrame(animate);
    }

    applyEasing(t, curve) {
        switch (curve) {
            case 'linear': return t;
            case 'easeIn': return t * t;
            case 'easeOut': return 1 - Math.pow(1 - t, 2);
            case 'easeInOut': return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 'parabolic': return t * t * (3 - 2 * t);
            default: return 1 - Math.pow(1 - t, 2); // Default to easeOut
        }
    }

    async createVisualizer(canvasElement, geometryName, parameters = {}) {
        if (!this.geometryRegistry) {
            throw new Error('GeometryRegistry not initialized');
        }

        const visualizerId = canvasElement.id || `visualizer-${Date.now()}`;
        
        try {
            console.log(`🎨 Creating visualizer: ${visualizerId} with geometry: ${geometryName}`);
            
            const gl = this.initializeWebGLContext(canvasElement);
            const geometry = this.geometryRegistry.getGeometry(geometryName);
            const shader = this.geometryRegistry.getShader(geometryName);
            
            if (!geometry || !shader) {
                throw new Error(`Geometry or shader not found for: ${geometryName}`);
            }
            
            const program = await this.createShaderProgram(gl, shader.vertex, shader.fragment);
            const buffers = this.createGeometryBuffers(gl);
            
            const visualizer = {
                id: visualizerId,
                canvas: canvasElement,
                gl: gl,
                program: program,
                buffers: buffers,
                geometry: geometry,
                shader: shader,
                uniforms: {},
                parameters: { ...this.globalUniforms, ...parameters },
                isActive: true,
                lastRender: 0
            };
            
            this.setupUniforms(visualizer);
            this.visualizers.set(visualizerId, visualizer);
            this.activeContexts.add(gl);
            
            console.log(`✅ Visualizer created: ${visualizerId}`);
            
            this.eventBus.dispatchEvent(new CustomEvent('visualizerCreated', {
                detail: { id: visualizerId, geometry: geometryName }
            }));
            
            return visualizer;
            
        } catch (error) {
            console.error(`❌ Failed to create visualizer ${visualizerId}:`, error);
            throw error;
        }
    }

    initializeWebGLContext(canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        return gl;
    }

    async createShaderProgram(gl, vertexSource, fragmentSource) {
        const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Shader program linking failed: ${error}`);
        }
        
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        
        return program;
    }

    compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compilation failed: ${error}`);
        }
        
        return shader;
    }

    createGeometryBuffers(gl) {
        const vertices = new Float32Array([
            -1, -1,  0,  0,
             1, -1,  1,  0,
            -1,  1,  0,  1,
             1,  1,  1,  1
        ]);
        
        const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
        
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        
        return {
            vertex: vertexBuffer,
            index: indexBuffer,
            vertexCount: indices.length
        };
    }

    setupUniforms(visualizer) {
        const { gl, program } = visualizer;
        gl.useProgram(program);
        
        visualizer.uniforms = {};
        
        Object.keys(visualizer.parameters).forEach(uniformName => {
            const location = gl.getUniformLocation(program, uniformName);
            if (location !== null) {
                visualizer.uniforms[uniformName] = location;
            }
        });
        
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
        
        visualizer.attributes = {
            position: positionLocation,
            texCoord: texCoordLocation
        };
    }

    startRenderLoop() {
        if (this.isRendering) return;
        
        this.isRendering = true;
        const startTime = performance.now();
        
        const render = (currentTime) => {
            const deltaTime = (currentTime - startTime) / 1000.0;
            this.globalUniforms.u_time = deltaTime;
            
            this.renderAllVisualizers(deltaTime);
            
            this.eventBus.dispatchEvent(new CustomEvent('renderFrame', {
                detail: { time: deltaTime, visualizerCount: this.visualizers.size }
            }));
            
            if (this.isRendering) {
                this.animationFrameId = requestAnimationFrame(render);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(render);
        console.log('🎬 Render loop started');
    }

    renderAllVisualizers(deltaTime) {
        for (const visualizer of this.visualizers.values()) {
            if (visualizer.isActive) {
                this.renderVisualizer(visualizer, deltaTime);
            }
        }
    }

    renderVisualizer(visualizer, deltaTime) {
        const { gl, program, buffers, uniforms, attributes, parameters, canvas } = visualizer;
        
        try {
            gl.useProgram(program);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            this.updateUniforms(visualizer, deltaTime);
            this.bindGeometry(visualizer);
            
            gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0);
            
            visualizer.lastRender = deltaTime;
            
        } catch (error) {
            console.error(`❌ Render error for visualizer ${visualizer.id}:`, error);
            visualizer.isActive = false;
        }
    }

    updateUniforms(visualizer, deltaTime) {
        const { gl, uniforms, parameters } = visualizer;
        
        parameters.u_time = deltaTime;
        parameters.u_resolution = [visualizer.canvas.width, visualizer.canvas.height];
        
        Object.entries(uniforms).forEach(([name, location]) => {
            const value = parameters[name];
            if (value !== undefined) {
                this.setUniform(gl, location, name, value);
            }
        });
    }

    setUniform(gl, location, name, value) {
        if (Array.isArray(value)) {
            switch (value.length) {
                case 2:
                    gl.uniform2fv(location, value);
                    break;
                case 3:
                    gl.uniform3fv(location, value);
                    break;
                case 4:
                    gl.uniform4fv(location, value);
                    break;
            }
        } else {
            gl.uniform1f(location, value);
        }
    }

    bindGeometry(visualizer) {
        const { gl, buffers, attributes } = visualizer;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
        
        if (attributes.position !== -1) {
            gl.enableVertexAttribArray(attributes.position);
            gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 16, 0);
        }
        
        if (attributes.texCoord !== -1) {
            gl.enableVertexAttribArray(attributes.texCoord);
            gl.vertexAttribPointer(attributes.texCoord, 2, gl.FLOAT, false, 16, 8);
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
    }

    updateVisualizerParameter(visualizerId, parameterName, value) {
        const visualizer = this.visualizers.get(visualizerId);
        if (visualizer) {
            visualizer.parameters[parameterName] = value;
            
            this.eventBus.dispatchEvent(new CustomEvent('visualizerParameterUpdated', {
                detail: { id: visualizerId, parameter: parameterName, value }
            }));
        }
    }

    updateGlobalParameter(parameterName, value) {
        this.globalUniforms[parameterName] = value;
        
        for (const visualizer of this.visualizers.values()) {
            visualizer.parameters[parameterName] = value;
        }
        
        this.eventBus.dispatchEvent(new CustomEvent('globalParameterUpdated', {
            detail: { parameter: parameterName, value }
        }));
    }

    setVisualizerGeometry(visualizerId, geometryName) {
        const visualizer = this.visualizers.get(visualizerId);
        if (!visualizer) return false;
        
        const newGeometry = this.geometryRegistry.getGeometry(geometryName);
        const newShader = this.geometryRegistry.getShader(geometryName);
        
        if (!newGeometry || !newShader) {
            console.error(`Geometry or shader not found: ${geometryName}`);
            return false;
        }
        
        try {
            const newProgram = this.createShaderProgram(visualizer.gl, newShader.vertex, newShader.fragment);
            
            visualizer.gl.deleteProgram(visualizer.program);
            
            visualizer.program = newProgram;
            visualizer.geometry = newGeometry;
            visualizer.shader = newShader;
            
            this.setupUniforms(visualizer);
            
            console.log(`🔄 Updated visualizer ${visualizerId} to geometry: ${geometryName}`);
            
            this.eventBus.dispatchEvent(new CustomEvent('visualizerGeometryChanged', {
                detail: { id: visualizerId, geometry: geometryName }
            }));
            
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to update visualizer geometry:`, error);
            return false;
        }
    }

    removeVisualizer(visualizerId) {
        const visualizer = this.visualizers.get(visualizerId);
        if (!visualizer) return false;
        
        const { gl, program, buffers } = visualizer;
        
        gl.deleteProgram(program);
        gl.deleteBuffer(buffers.vertex);
        gl.deleteBuffer(buffers.index);
        
        this.activeContexts.delete(gl);
        this.visualizers.delete(visualizerId);
        
        console.log(`🗑️ Removed visualizer: ${visualizerId}`);
        
        this.eventBus.dispatchEvent(new CustomEvent('visualizerRemoved', {
            detail: { id: visualizerId }
        }));
        
        return true;
    }

    stopRenderLoop() {
        this.isRendering = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        console.log('⏹️ Render loop stopped');
    }

    getVisualizer(visualizerId) {
        return this.visualizers.get(visualizerId);
    }

    getAllVisualizers() {
        return Array.from(this.visualizers.values());
    }

    getActiveVisualizerCount() {
        return Array.from(this.visualizers.values()).filter(v => v.isActive).length;
    }

    addEventListener(eventType, listener) {
        this.eventBus.addEventListener(eventType, listener);
    }

    removeEventListener(eventType, listener) {
        this.eventBus.removeEventListener(eventType, listener);
    }
}

window.VisualizerPool = VisualizerPool;