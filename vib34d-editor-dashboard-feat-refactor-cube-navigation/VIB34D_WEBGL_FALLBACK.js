/**
 * VIB34D WEBGL FALLBACK SYSTEM
 * 
 * Canvas 2D fallback renderers for environments where WebGL is not available.
 * Provides simplified but functional visualizations using 2D canvas API.
 */

class VIB34DWebGLFallback {
    constructor() {
        this.isWebGLSupported = this.checkWebGLSupport();
        this.fallbackRenderers = new Map();
        
        console.log(`🎨 VIB34D WebGL Support: ${this.isWebGLSupported ? 'AVAILABLE' : 'USING FALLBACK'}`);
    }
    
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    createFallbackVisualizer(canvas, config = {}) {
        if (this.isWebGLSupported) {
            // Return null to let normal WebGL system handle it
            return null;
        }
        
        const renderer = new VIB34DCanvas2DRenderer(canvas, config);
        const id = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.fallbackRenderers.set(id, renderer);
        
        console.log(`🎨 Created fallback visualizer: ${id}`);
        return renderer;
    }
    
    destroyFallbackVisualizer(id) {
        const renderer = this.fallbackRenderers.get(id);
        if (renderer) {
            renderer.destroy();
            this.fallbackRenderers.delete(id);
        }
    }
}

class VIB34DCanvas2DRenderer {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = {
            geometryType: config.geometryType || 'hypercube',
            gridDensity: config.gridDensity || 12.0,
            rotationSpeed: config.rotationSpeed || 0.8,
            patternIntensity: config.patternIntensity || 1.3,
            morphFactor: config.morphFactor || 0.7,
            dimension: config.dimension || 4.0,
            lineThickness: config.lineThickness || 0.03,
            colorShift: config.colorShift || 0.0,
            ...config
        };
        
        this.animationState = {
            time: 0,
            rotation: 0,
            phase: 0,
            isRunning: false
        };
        
        this.colors = this.getGeometryColors();
        this.setupCanvas();
        
        console.log(`🎨 Canvas 2D Renderer created for ${this.config.geometryType}`);
    }
    
    setupCanvas() {
        // Set up canvas for high DPI displays
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Enable smooth rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    getGeometryColors() {
        const colorMap = {
            'hypercube': { primary: '#ff00ff', secondary: '#ff44ff', accent: '#cc00cc' },
            'hypersphere': { primary: '#ffff00', secondary: '#ffff44', accent: '#cccc00' },
            'hypertetrahedron': { primary: '#00ffff', secondary: '#44ffff', accent: '#00cccc' },
            'torus': { primary: '#00ff00', secondary: '#44ff44', accent: '#00cc00' },
            'klein': { primary: '#ff8800', secondary: '#ffaa44', accent: '#cc6600' },
            'fractal': { primary: '#8800ff', secondary: '#aa44ff', accent: '#6600cc' },
            'wave': { primary: '#ff0088', secondary: '#ff44aa', accent: '#cc0066' },
            'crystal': { primary: '#88ff88', secondary: '#aaffaa', accent: '#66cc66' }
        };
        
        return colorMap[this.config.geometryType] || colorMap['hypercube'];
    }
    
    start() {
        if (this.animationState.isRunning) return;
        
        this.animationState.isRunning = true;
        this.animate();
        
        console.log(`🎬 Started fallback animation for ${this.config.geometryType}`);
    }
    
    stop() {
        this.animationState.isRunning = false;
    }
    
    animate() {
        if (!this.animationState.isRunning) return;
        
        this.animationState.time += 0.016; // ~60fps
        this.animationState.rotation += this.config.rotationSpeed * 0.01;
        this.animationState.phase += 0.02;
        
        this.render();
        
        requestAnimationFrame(() => this.animate());
    }
    
    render() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        ctx.fillRect(0, 0, width, height);
        
        // Set up coordinate system
        ctx.save();
        ctx.translate(width / 2, height / 2);
        
        // Render geometry-specific pattern
        switch (this.config.geometryType) {
            case 'hypercube':
                this.renderHypercubeFallback();
                break;
            case 'hypersphere':
                this.renderHypersphereFallback();
                break;
            case 'hypertetrahedron':
                this.renderTetrahedronFallback();
                break;
            case 'torus':
                this.renderTorusFallback();
                break;
            case 'klein':
                this.renderKleinFallback();
                break;
            case 'fractal':
                this.renderFractalFallback();
                break;
            case 'wave':
                this.renderWaveFallback();
                break;
            case 'crystal':
                this.renderCrystalFallback();
                break;
            default:
                this.renderHypercubeFallback();
        }
        
        ctx.restore();
    }
    
    renderHypercubeFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        const gridDensity = config.gridDensity;
        const time = animationState.time;
        
        // Draw 3D cube projection with lattice
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 100;
        
        // Rotating cube vertices
        const vertices = this.generateCubeVertices(size, time * config.rotationSpeed);
        
        // Draw cube edges
        this.drawCubeEdges(vertices);
        
        // Draw lattice grid overlay
        this.drawLatticeGrid(size, gridDensity, time);
        
        // Add 4D dimension effect
        if (config.dimension > 3.5) {
            this.draw4DProjectionEffect(vertices, time);
        }
    }
    
    renderHypersphereFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        const time = animationState.time;
        
        // Draw concentric spherical shells
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 50;
        
        const shells = Math.floor(config.gridDensity / 2);
        for (let i = 1; i <= shells; i++) {
            const radius = (size * i) / shells;
            const alpha = 0.3 + (Math.sin(time + i * 0.5) * 0.3);
            
            ctx.globalAlpha = alpha * config.patternIntensity;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Add spherical grid lines
        this.drawSphericalGrid(size, config.gridDensity, time);
        ctx.globalAlpha = 1.0;
    }
    
    renderTetrahedronFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.25;
        const time = animationState.time;
        
        // Draw geometric tetrahedron with precise lines
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 80;
        
        const vertices = this.generateTetrahedronVertices(size, time * config.rotationSpeed);
        this.drawTetrahedronEdges(vertices);
        
        // Add geometric precision indicators
        this.drawGeometricGrid(size, config.gridDensity, time);
    }
    
    renderTorusFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.2;
        const time = animationState.time;
        
        // Draw torus flow patterns
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 60;
        
        const majorRadius = size;
        const minorRadius = size * 0.3;
        
        // Draw torus cross-sections with flow
        this.drawTorusFlow(majorRadius, minorRadius, config.gridDensity, time);
    }
    
    renderKleinFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.25;
        const time = animationState.time;
        
        // Draw Klein bottle topology approximation
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 70;
        
        this.drawKleinBottleProjection(size, config.gridDensity, time);
    }
    
    renderFractalFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        const time = animationState.time;
        
        // Draw recursive fractal pattern
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 40;
        
        const depth = Math.floor(config.gridDensity / 3);
        this.drawFractalPattern(0, 0, size, depth, time);
    }
    
    renderWaveFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        const time = animationState.time;
        
        // Draw wave function interference patterns
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 30;
        
        this.drawWaveInterference(size, config.gridDensity, time);
    }
    
    renderCrystalFallback() {
        const { ctx, colors, config, animationState } = this;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        const time = animationState.time;
        
        // Draw crystal lattice structure
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = config.lineThickness * 50;
        
        this.drawCrystalLattice(size, config.gridDensity, time);
    }
    
    // Geometry-specific drawing methods
    generateCubeVertices(size, rotation) {
        const vertices = [];
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        for (let x = -1; x <= 1; x += 2) {
            for (let y = -1; y <= 1; y += 2) {
                for (let z = -1; z <= 1; z += 2) {
                    // Apply 3D rotation
                    const rotX = x * cos - z * sin;
                    const rotZ = x * sin + z * cos;
                    
                    vertices.push({
                        x: rotX * size * 0.5,
                        y: y * size * 0.5,
                        z: rotZ * size * 0.5,
                        screenX: rotX * size * 0.5,
                        screenY: y * size * 0.5
                    });
                }
            }
        }
        
        return vertices;
    }
    
    drawCubeEdges(vertices) {
        const { ctx } = this;
        
        // Define cube edge connections
        const edges = [
            [0,1],[1,3],[3,2],[2,0], // front face
            [4,5],[5,7],[7,6],[6,4], // back face
            [0,4],[1,5],[2,6],[3,7]  // connecting edges
        ];
        
        edges.forEach(([a, b]) => {
            const va = vertices[a];
            const vb = vertices[b];
            
            ctx.beginPath();
            ctx.moveTo(va.screenX, va.screenY);
            ctx.lineTo(vb.screenX, vb.screenY);
            ctx.stroke();
        });
    }
    
    drawLatticeGrid(size, density, time) {
        const { ctx, colors } = this;
        const spacing = size / density;
        
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        
        // Draw grid lines
        for (let i = -density; i <= density; i++) {
            const offset = spacing * i;
            const wave = Math.sin(time + i * 0.2) * 5;
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(-size, offset + wave);
            ctx.lineTo(size, offset + wave);
            ctx.stroke();
            
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(offset + wave, -size);
            ctx.lineTo(offset + wave, size);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    draw4DProjectionEffect(vertices, time) {
        const { ctx, colors } = this;
        
        // Add 4D hypercube projection visualization
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        // Draw projected 4D edges with time-based W coordinate
        vertices.forEach((vertex, i) => {
            const w = Math.sin(time + i * 0.5) * 20;
            const projectedX = vertex.screenX + w * 0.3;
            const projectedY = vertex.screenY + w * 0.2;
            
            ctx.beginPath();
            ctx.moveTo(vertex.screenX, vertex.screenY);
            ctx.lineTo(projectedX, projectedY);
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1.0;
    }
    
    drawSphericalGrid(size, density, time) {
        const { ctx, colors } = this;
        
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        // Draw meridians and parallels
        const segments = Math.floor(density);
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const phase = time + i * 0.3;
            
            // Meridians
            ctx.beginPath();
            for (let t = 0; t <= Math.PI; t += 0.1) {
                const x = size * Math.sin(t) * Math.cos(angle + phase * 0.1);
                const y = size * Math.cos(t) + Math.sin(phase) * 5;
                
                if (t === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    generateTetrahedronVertices(size, rotation) {
        const vertices = [
            { x: 0, y: -size * 0.6, z: 0 },
            { x: -size * 0.5, y: size * 0.3, z: -size * 0.3 },
            { x: size * 0.5, y: size * 0.3, z: -size * 0.3 },
            { x: 0, y: size * 0.3, z: size * 0.6 }
        ];
        
        // Apply rotation
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        return vertices.map(v => ({
            x: v.x * cos - v.z * sin,
            y: v.y,
            z: v.x * sin + v.z * cos,
            screenX: (v.x * cos - v.z * sin),
            screenY: v.y
        }));
    }
    
    drawTetrahedronEdges(vertices) {
        const { ctx } = this;
        
        // Define tetrahedron edge connections
        const edges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
        
        edges.forEach(([a, b]) => {
            const va = vertices[a];
            const vb = vertices[b];
            
            ctx.beginPath();
            ctx.moveTo(va.screenX, va.screenY);
            ctx.lineTo(vb.screenX, vb.screenY);
            ctx.stroke();
        });
    }
    
    drawGeometricGrid(size, density, time) {
        const { ctx, colors } = this;
        
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        // Draw precise geometric construction lines
        const segments = Math.floor(density / 2);
        
        for (let i = 0; i < segments; i++) {
            const radius = (size * (i + 1)) / segments;
            const rotation = time * 0.2 + i * 0.5;
            
            // Draw geometric construction circles
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw construction lines
            const x = Math.cos(rotation) * radius;
            const y = Math.sin(rotation) * radius;
            
            ctx.beginPath();
            ctx.moveTo(-x, -y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawTorusFlow(majorRadius, minorRadius, density, time) {
        const { ctx, colors } = this;
        
        ctx.strokeStyle = colors.primary;
        ctx.globalAlpha = 0.7;
        
        const segments = Math.floor(density);
        
        for (let i = 0; i < segments; i++) {
            const phi = (i / segments) * Math.PI * 2;
            const flow = time + i * 0.2;
            
            ctx.beginPath();
            for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
                const x = (majorRadius + minorRadius * Math.cos(theta + flow)) * Math.cos(phi);
                const y = minorRadius * Math.sin(theta + flow);
                
                if (theta === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawKleinBottleProjection(size, density, time) {
        const { ctx, colors } = this;
        
        ctx.strokeStyle = colors.primary;
        ctx.globalAlpha = 0.6;
        
        // Simplified Klein bottle projection
        const segments = Math.floor(density);
        
        for (let i = 0; i < segments; i++) {
            const u = (i / segments) * Math.PI * 2;
            const phase = time + i * 0.1;
            
            ctx.beginPath();
            for (let v = 0; v <= Math.PI; v += 0.1) {
                const x = size * (Math.cos(u) * (1 + Math.sin(v + phase)) * 0.5);
                const y = size * (Math.sin(u + phase) * 0.3 + Math.cos(v) * 0.5);
                
                if (v === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawFractalPattern(x, y, size, depth, time) {
        if (depth <= 0 || size < 2) return;
        
        const { ctx, colors } = this;
        const newSize = size * 0.6;
        const angle = time + depth * 0.5;
        
        ctx.globalAlpha = 0.7 / depth;
        
        // Draw current level
        ctx.beginPath();
        ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
        ctx.stroke();
        
        // Recursive calls
        const branches = 4;
        for (let i = 0; i < branches; i++) {
            const branchAngle = (i / branches) * Math.PI * 2 + angle;
            const newX = x + Math.cos(branchAngle) * size * 0.3;
            const newY = y + Math.sin(branchAngle) * size * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(newX, newY);
            ctx.stroke();
            
            this.drawFractalPattern(newX, newY, newSize, depth - 1, time);
        }
    }
    
    drawWaveInterference(size, density, time) {
        const { ctx, colors } = this;
        
        ctx.strokeStyle = colors.primary;
        ctx.globalAlpha = 0.5;
        
        const waves = Math.floor(density / 2);
        
        for (let w = 0; w < waves; w++) {
            const frequency = (w + 1) * 0.5;
            const phase = time + w * Math.PI * 0.3;
            
            ctx.beginPath();
            for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
                const radius = size * 0.3 + size * 0.2 * Math.sin(frequency * angle + phase);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawCrystalLattice(size, density, time) {
        const { ctx, colors } = this;
        
        ctx.strokeStyle = colors.primary;
        ctx.globalAlpha = 0.6;
        
        const latticeSpacing = size / density;
        
        // Draw crystalline structure
        for (let x = -size; x <= size; x += latticeSpacing) {
            for (let y = -size; y <= size; y += latticeSpacing) {
                const distance = Math.sqrt(x * x + y * y);
                if (distance > size) continue;
                
                const wave = Math.sin(time + distance * 0.1) * 3;
                
                // Draw crystal nodes
                ctx.beginPath();
                ctx.arc(x + wave, y + wave, 2, 0, Math.PI * 2);
                ctx.stroke();
                
                // Draw connections
                if (x + latticeSpacing <= size) {
                    ctx.beginPath();
                    ctx.moveTo(x + wave, y + wave);
                    ctx.lineTo(x + latticeSpacing + wave, y + wave);
                    ctx.stroke();
                }
                
                if (y + latticeSpacing <= size) {
                    ctx.beginPath();
                    ctx.moveTo(x + wave, y + wave);
                    ctx.lineTo(x + wave, y + latticeSpacing + wave);
                    ctx.stroke();
                }
            }
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    updateParameters(newParams) {
        Object.assign(this.config, newParams);
        this.colors = this.getGeometryColors();
        
        console.log(`🎨 Updated fallback renderer parameters for ${this.config.geometryType}`);
    }
    
    destroy() {
        console.log(`🧹 Destroying Canvas 2D fallback renderer`);
        
        // Stop animation loop
        this.stop();
        
        // Clear canvas
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = 1;
            this.canvas.height = 1;
        }
        
        // Clear references
        this.canvas = null;
        this.ctx = null;
        this.config = null;
        this.animationState = null;
        this.colors = null;
        
        console.log(`✅ Canvas 2D fallback renderer destroyed`);
    }
    
    dispose() {
        // Alias for destroy for compatibility
        this.destroy();
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.VIB34DWebGLFallback = VIB34DWebGLFallback;
    window.VIB34DCanvas2DRenderer = VIB34DCanvas2DRenderer;
    
    // Create global fallback instance
    window.VIB34D_WEBGL_FALLBACK = new VIB34DWebGLFallback();
    
    console.log('🎨 VIB34D WebGL Fallback System loaded and exported to window');
}

console.log('✅ VIB34D WebGL Fallback System ready for environments without hardware acceleration');