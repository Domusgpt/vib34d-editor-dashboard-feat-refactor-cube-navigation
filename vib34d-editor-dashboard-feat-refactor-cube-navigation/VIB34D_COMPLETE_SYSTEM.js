/**
 * VIB34D COMPLETE SYSTEM IMPLEMENTATION
 * Revolutionary 4D Interactive Visualization Framework
 * 
 * REFACTORED: Audio reactivity → User interaction reactivity
 * - u_audioBass → scroll intensity/velocity
 * - u_audioMid → click/hold intensity  
 * - u_audioHigh → mouse movement/hover intensity
 * - Pitch detection → Interaction pattern analysis
 */

// ============================================================================
// 🎛️ VIB34D INTERACTION ANALYSIS ENGINE
// ============================================================================

class VIB34DInteractionEngine {
    constructor() {
        this.interactionData = {
            // Primary interaction channels (replacing audio bands)
            scroll: { intensity: 0, velocity: 0, direction: 0, smoothed: 0 },
            click: { intensity: 0, duration: 0, pattern: 'single', smoothed: 0 },
            mouse: { intensity: 0, velocity: 0, position: [0.5, 0.5], smoothed: 0 },
            
            // Interaction pattern detection (replacing pitch detection)
            pattern: {
                type: 'casual',        // casual, rhythmic, intense, precise
                frequency: 0,          // interactions per second
                consistency: 0,        // pattern regularity (0-1)
                complexity: 0          // multi-modal interaction (0-1)
            },
            
            // Derived interaction states
            energy: 0,               // Overall interaction energy
            focus: 0,                // Attention/concentration level
            exploration: 0           // Discovery/browsing behavior
        };
        
        this.smoothingFactors = {
            scroll: 0.15,
            click: 0.2,
            mouse: 0.1
        };
        
        this.setupInteractionTracking();
    }
    
    setupInteractionTracking() {
        // Scroll tracking with velocity calculation
        let lastScrollY = window.scrollY;
        let lastScrollTime = performance.now();
        
        window.addEventListener('scroll', (e) => {
            const currentTime = performance.now();
            const currentScrollY = window.scrollY;
            const deltaTime = currentTime - lastScrollTime;
            const deltaScroll = currentScrollY - lastScrollY;
            
            if (deltaTime > 0) {
                const velocity = Math.abs(deltaScroll) / deltaTime;
                const direction = Math.sign(deltaScroll);
                
                this.interactionData.scroll.velocity = velocity;
                this.interactionData.scroll.direction = direction;
                this.interactionData.scroll.intensity = Math.min(1.0, velocity / 5.0);
            }
            
            lastScrollY = currentScrollY;
            lastScrollTime = currentTime;
        }, { passive: true });
        
        // Click/hold tracking with pattern detection
        let clickStartTime = 0;
        let clickCount = 0;
        let clickPattern = [];
        
        document.addEventListener('mousedown', (e) => {
            clickStartTime = performance.now();
            clickCount++;
            
            // Reset click count after 2 seconds of no clicks
            setTimeout(() => {
                if (performance.now() - clickStartTime > 2000) {
                    clickCount = 0;
                    clickPattern = [];
                }
            }, 2000);
        });
        
        document.addEventListener('mouseup', (e) => {
            const holdDuration = performance.now() - clickStartTime;
            const intensity = Math.min(1.0, holdDuration / 1000.0);
            
            this.interactionData.click.duration = holdDuration;
            this.interactionData.click.intensity = intensity;
            
            // Pattern detection
            clickPattern.push(holdDuration);
            if (clickPattern.length > 5) clickPattern.shift();
            
            this.analyzeClickPattern(clickPattern);
        });
        
        // Mouse movement tracking with velocity
        let lastMousePos = [0, 0];
        let lastMouseTime = performance.now();
        
        document.addEventListener('mousemove', (e) => {
            const currentTime = performance.now();
            const currentPos = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
            const deltaTime = currentTime - lastMouseTime;
            
            if (deltaTime > 0) {
                const deltaX = currentPos[0] - lastMousePos[0];
                const deltaY = currentPos[1] - lastMousePos[1];
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const velocity = distance / deltaTime * 1000; // pixels per second
                
                this.interactionData.mouse.velocity = velocity;
                this.interactionData.mouse.position = currentPos;
                this.interactionData.mouse.intensity = Math.min(1.0, velocity / 1000.0);
            }
            
            lastMousePos = currentPos;
            lastMouseTime = currentTime;
        });
        
        // Idle detection
        let lastActivity = performance.now();
        const resetActivity = () => { lastActivity = performance.now(); };
        
        ['mousedown', 'mousemove', 'scroll', 'keydown'].forEach(event => {
            document.addEventListener(event, resetActivity, { passive: true });
        });
        
        // Check for idle state
        setInterval(() => {
            const idleTime = performance.now() - lastActivity;
            const isIdle = idleTime > 3000; // 3 seconds
            
            if (isIdle) {
                // Decay interaction intensities
                this.interactionData.scroll.intensity *= 0.95;
                this.interactionData.click.intensity *= 0.95;
                this.interactionData.mouse.intensity *= 0.95;
            }
        }, 100);
    }
    
    analyzeClickPattern(pattern) {
        if (pattern.length < 2) return;
        
        // Analyze rhythm and consistency
        const intervals = [];
        for (let i = 1; i < pattern.length; i++) {
            intervals.push(pattern[i] - pattern[i-1]);
        }
        
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((acc, val) => acc + Math.pow(val - avgInterval, 2), 0) / intervals.length;
        const consistency = 1.0 - Math.min(1.0, variance / 1000000); // Normalize variance
        
        this.interactionData.pattern.frequency = 1000 / avgInterval; // Hz equivalent
        this.interactionData.pattern.consistency = consistency;
        
        // Classify pattern type
        if (consistency > 0.8 && this.interactionData.pattern.frequency > 2) {
            this.interactionData.pattern.type = 'rhythmic';
        } else if (this.interactionData.pattern.frequency > 4) {
            this.interactionData.pattern.type = 'intense';
        } else if (consistency > 0.9) {
            this.interactionData.pattern.type = 'precise';
        } else {
            this.interactionData.pattern.type = 'casual';
        }
    }
    
    update() {
        // Apply smoothing to interaction data
        const smooth = (current, target, factor) => current * (1 - factor) + target * factor;
        
        this.interactionData.scroll.smoothed = smooth(
            this.interactionData.scroll.smoothed, 
            this.interactionData.scroll.intensity, 
            this.smoothingFactors.scroll
        );
        
        this.interactionData.click.smoothed = smooth(
            this.interactionData.click.smoothed,
            this.interactionData.click.intensity,
            this.smoothingFactors.click
        );
        
        this.interactionData.mouse.smoothed = smooth(
            this.interactionData.mouse.smoothed,
            this.interactionData.mouse.intensity,
            this.smoothingFactors.mouse
        );
        
        // Calculate derived states
        this.interactionData.energy = (
            this.interactionData.scroll.smoothed * 0.4 +
            this.interactionData.click.smoothed * 0.3 +
            this.interactionData.mouse.smoothed * 0.3
        );
        
        this.interactionData.focus = this.interactionData.pattern.consistency;
        this.interactionData.exploration = this.interactionData.mouse.smoothed * 0.7 + this.interactionData.scroll.smoothed * 0.3;
    }
}

// ============================================================================
// 🎨 VIB34D CORE VISUALIZER (8 GEOMETRIES)
// ============================================================================

class VIB34DCore {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        this.instanceId = options.instanceId || 'default';
        this.instanceRole = options.role || 'content'; // 'background', 'content', 'accent'
        this.parameterModifier = options.modifier || 1.0;
        this.currentGeometry = options.geometry || 'hypercube';
        
        this.state = {
            // Core uniforms (mapped from interaction engine)
            time: 0,
            resolution: [canvas.width, canvas.height],
            mouse: [0.5, 0.5],
            
            // 4D mathematics parameters
            dimension: 4.0,
            morphFactor: 0.5,
            rotationSpeed: 0.5,
            
            // Grid and lattice
            gridDensity: 8.0,
            lineThickness: 0.03,
            universeModifier: 1.0,
            patternIntensity: 1.0,
            
            // Geometry-specific parameters
            shellWidth: 0.025,        // hypersphere
            tetraThickness: 0.035,    // hypertetrahedron
            torusMinorRadius: 0.3,    // torus
            kleinBottleParam: 0.5,    // klein bottle
            fractalIterations: 4,     // fractal
            waveFrequency: 2.0,       // wave
            crystallineFactor: 0.8,   // crystal
            
            // Effects parameters (driven by interactions)
            glitchIntensity: 0.0,
            colorShift: 0.0,
            
            // Interaction levels (replacing audio levels)
            interactionBass: 0,    // scroll intensity
            interactionMid: 0,     // click intensity  
            interactionHigh: 0,    // mouse intensity
            
            // Colors
            primaryColor: [1.0, 0.0, 1.0],    // Magenta
            secondaryColor: [0.0, 1.0, 1.0], // Cyan
            backgroundColor: [0.05, 0.0, 0.2]
        };
        
        this.geometryShaders = this.initializeGeometryShaders();
        this.currentShaderProgram = null;
        
        this.setupWebGL();
        this.setupGeometry(this.currentGeometry);
    }
    
    initializeGeometryShaders() {
        return {
            hypercube: this.getHypercubeShader(),
            tetrahedron: this.getTetrahedronShader(),
            sphere: this.getSphereShader(),
            torus: this.getTorusShader(),
            klein: this.getKleinBottleShader(),
            fractal: this.getFractalShader(),
            wave: this.getWaveShader(),
            crystal: this.getCrystalShader()
        };
    }
    
    // ========================================================================
    // 🔺 GEOMETRY SHADER IMPLEMENTATIONS
    // ========================================================================
    
    getHypercubeShader() {
        return `
            float calculateLattice(vec3 p) {
                float dynamicGridDensity = max(0.1, u_gridDensity * (1.0 + u_interactionBass * 0.7));
                float dynamicLineThickness = max(0.002, u_lineThickness * (1.0 - u_interactionMid * 0.6));
                
                vec3 p_grid3D = fract(p * dynamicGridDensity * 0.5 + u_time * 0.01);
                vec3 dist3D = abs(p_grid3D - 0.5);
                float box3D = max(dist3D.x, max(dist3D.y, dist3D.z));
                float lattice3D = smoothstep(0.5, 0.5 - dynamicLineThickness, box3D);
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    float w_coord = sin(p.x*1.4 - p.y*0.7 + p.z*1.5 + u_time * 0.25)
                                  * cos(length(p) * 1.1 - u_time * 0.35 + u_interactionMid * 2.5)
                                  * dim_factor * (0.4 + u_morphFactor * 0.6 + u_interactionHigh * 0.6);
                    
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 1.0;
                    float time_rot1 = u_time * 0.33 * baseSpeed + u_interactionHigh * 0.25 + u_morphFactor * 0.45;
                    float time_rot2 = u_time * 0.28 * baseSpeed - u_interactionMid * 0.28;
                    float time_rot3 = u_time * 0.25 * baseSpeed + u_interactionBass * 0.35;
                    
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
    
    getTetrahedronShader() {
        return `
            float calculateLattice(vec3 p) {
                float density = max(0.1, u_gridDensity * 0.65 * (1.0 + u_interactionBass * 0.4));
                float dynamicThickness = max(0.003, u_tetraThickness * (1.0 - u_interactionMid * 0.7));
                
                vec3 c1=normalize(vec3(1,1,1)), c2=normalize(vec3(-1,-1,1)), 
                     c3=normalize(vec3(-1,1,-1)), c4=normalize(vec3(1,-1,-1));
                vec3 p_mod3D = fract(p * density * 0.5 + 0.5 + u_time * 0.005) - 0.5;
                float d1=dot(p_mod3D, c1), d2=dot(p_mod3D, c2), d3=dot(p_mod3D, c3), d4=dot(p_mod3D, c4);
                float minDistToPlane3D = min(min(abs(d1), abs(d2)), min(abs(d3), abs(d4)));
                float lattice3D = 1.0 - smoothstep(0.0, dynamicThickness, minDistToPlane3D);
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    float w_coord = cos(p.x*1.8 - p.y*1.5 + p.z*1.2 + u_time*0.24) * 
                                   sin(length(p)*1.4 + u_time*0.18 - u_interactionMid*2.0) * 
                                   dim_factor * (0.45 + u_morphFactor*0.55 + u_interactionHigh*0.4);
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 1.15;
                    float time_rot1 = u_time*0.28*baseSpeed + u_interactionHigh*0.25;
                    float time_rot2 = u_time*0.36*baseSpeed - u_interactionBass*0.2 + u_morphFactor*0.4;
                    float time_rot3 = u_time*0.32*baseSpeed + u_interactionMid*0.15;
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
    
    getSphereShader() {
        return `
            float calculateLattice(vec3 p) {
                float radius3D = length(p);
                float densityFactor = max(0.1, u_gridDensity * 0.7 * (1.0 + u_interactionBass * 0.5));
                float dynamicShellWidth = max(0.005, u_shellWidth * (1.0 + u_interactionMid * 1.5));
                float phase = radius3D * densityFactor * 6.28318 - u_time * u_rotationSpeed * 0.8 + u_interactionHigh * 3.0;
                float shells3D = 0.5 + 0.5 * sin(phase);
                shells3D = smoothstep(1.0 - dynamicShellWidth, 1.0, shells3D);
                
                float finalLattice = shells3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    float w_coord = cos(radius3D * 2.5 - u_time * 0.55)
                                  * sin(p.x*1.0 + p.y*1.3 - p.z*0.7 + u_time*0.2)
                                  * dim_factor * (0.5 + u_morphFactor * 0.5 + u_interactionMid * 0.5);
                    
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 0.85;
                    float time_rot1 = u_time * 0.38 * baseSpeed + u_interactionHigh * 0.2;
                    float time_rot2 = u_time * 0.31 * baseSpeed + u_morphFactor * 0.6;
                    float time_rot3 = u_time * -0.24 * baseSpeed + u_interactionBass * 0.25;
                    p4d = rotXW(time_rot1 * 1.05) * rotYZ(time_rot2) * rotYW(time_rot3 * 0.95) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    float radius4D_proj = length(projectedP);
                    float phase4D = radius4D_proj * densityFactor * 6.28318 - u_time * u_rotationSpeed * 0.8 + u_interactionHigh * 3.0;
                    float shells4D_proj = 0.5 + 0.5 * sin(phase4D);
                    shells4D_proj = smoothstep(1.0 - dynamicShellWidth, 1.0, shells4D_proj);
                    finalLattice = mix(shells3D, shells4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
    
    getTorusShader() {
        return `
            float calculateLattice(vec3 p) {
                float majorRadius = 1.0;
                float minorRadius = max(0.1, u_torusMinorRadius * (1.0 + u_interactionBass * 0.5));
                float density = max(0.1, u_gridDensity * 0.8 * (1.0 + u_interactionMid * 0.3));
                
                // Convert to torus coordinates
                float r = length(p.xy) - majorRadius;
                vec3 torusP = vec3(r, p.z, 0.0);
                float torusDistance = length(torusP.xy) - minorRadius;
                
                // Create grid on torus surface
                float angle1 = atan(p.y, p.x) * density;
                float angle2 = atan(p.z, r) * density;
                vec2 gridCoords = vec2(angle1, angle2);
                vec2 gridLines = abs(fract(gridCoords) - 0.5);
                float lineWidth = 0.02 + u_interactionHigh * 0.03;
                float grid = max(
                    1.0 - smoothstep(0.0, lineWidth, gridLines.x),
                    1.0 - smoothstep(0.0, lineWidth, gridLines.y)
                );
                
                // Surface proximity
                float surfaceProximity = 1.0 - smoothstep(0.0, 0.1, abs(torusDistance));
                float lattice3D = grid * surfaceProximity;
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    float w_coord = sin(angle1 * 0.5 + u_time * 0.3) * cos(angle2 * 0.5 - u_time * 0.2) * 
                                   dim_factor * (0.3 + u_morphFactor * 0.7 + u_interactionMid * 0.4);
                    vec4 p4d = vec4(p, w_coord);
                    
                    float baseSpeed = u_rotationSpeed * 0.9;
                    p4d = rotXW(u_time * 0.25 * baseSpeed + u_interactionHigh * 0.3) * 
                          rotYW(u_time * 0.31 * baseSpeed + u_interactionBass * 0.2) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // Recalculate for 4D projected position
                    float r4D = length(projectedP.xy) - majorRadius;
                    vec3 torusP4D = vec3(r4D, projectedP.z, 0.0);
                    float torusDistance4D = length(torusP4D.xy) - minorRadius;
                    
                    float angle1_4D = atan(projectedP.y, projectedP.x) * density;
                    float angle2_4D = atan(projectedP.z, r4D) * density;
                    vec2 gridCoords4D = vec2(angle1_4D, angle2_4D);
                    vec2 gridLines4D = abs(fract(gridCoords4D) - 0.5);
                    float grid4D = max(
                        1.0 - smoothstep(0.0, lineWidth, gridLines4D.x),
                        1.0 - smoothstep(0.0, lineWidth, gridLines4D.y)
                    );
                    
                    float surfaceProximity4D = 1.0 - smoothstep(0.0, 0.1, abs(torusDistance4D));
                    float lattice4D_proj = grid4D * surfaceProximity4D;
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
    
    getKleinBottleShader() {
        return `
            float calculateLattice(vec3 p) {
                float a = 2.0; // Klein bottle parameter
                float density = max(0.1, u_gridDensity * 0.6 * (1.0 + u_interactionBass * 0.4));
                float param = max(0.1, u_kleinBottleParam * (1.0 + u_interactionMid * 0.8));
                
                // Klein bottle parametric surface approximation
                float u = atan(p.y, p.x) + u_time * 0.1;
                float v = length(p.xy) * 0.5 + p.z * 0.3 + u_time * 0.05;
                
                // Klein bottle surface equation (simplified)
                vec3 kleinPoint;
                kleinPoint.x = (a + cos(v * 0.5)) * cos(u);
                kleinPoint.y = (a + cos(v * 0.5)) * sin(u);
                kleinPoint.z = sin(v * 0.5) * param;
                
                float distanceToSurface = length(p - kleinPoint * 0.3);
                
                // Create grid on Klein bottle surface
                vec2 gridCoords = vec2(u * density, v * density);
                vec2 gridLines = abs(fract(gridCoords) - 0.5);
                float lineWidth = 0.03 + u_interactionHigh * 0.04;
                float grid = max(
                    1.0 - smoothstep(0.0, lineWidth, gridLines.x),
                    1.0 - smoothstep(0.0, lineWidth, gridLines.y)
                );
                
                float surfaceProximity = 1.0 - smoothstep(0.0, 0.15, distanceToSurface);
                float lattice3D = grid * surfaceProximity;
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // Add 4D Klein bottle twist
                    float w_coord = cos(u * 2.0 + v * 1.5 + u_time * 0.4) * 
                                   sin(v * 3.0 - u * 2.0 + u_time * 0.3) *
                                   dim_factor * (0.4 + u_morphFactor * 0.6 + u_interactionHigh * 0.5);
                    
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 1.1;
                    p4d = rotXW(u_time * 0.27 * baseSpeed + u_interactionMid * 0.4) * 
                          rotZW(u_time * 0.33 * baseSpeed + u_interactionBass * 0.3) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // Recalculate Klein bottle for 4D projection
                    float u4D = atan(projectedP.y, projectedP.x) + u_time * 0.1;
                    float v4D = length(projectedP.xy) * 0.5 + projectedP.z * 0.3 + u_time * 0.05;
                    
                    vec3 kleinPoint4D;
                    kleinPoint4D.x = (a + cos(v4D * 0.5)) * cos(u4D);
                    kleinPoint4D.y = (a + cos(v4D * 0.5)) * sin(u4D);
                    kleinPoint4D.z = sin(v4D * 0.5) * param;
                    
                    float distanceToSurface4D = length(projectedP - kleinPoint4D * 0.3);
                    
                    vec2 gridCoords4D = vec2(u4D * density, v4D * density);
                    vec2 gridLines4D = abs(fract(gridCoords4D) - 0.5);
                    float grid4D = max(
                        1.0 - smoothstep(0.0, lineWidth, gridLines4D.x),
                        1.0 - smoothstep(0.0, lineWidth, gridLines4D.y)
                    );
                    
                    float surfaceProximity4D = 1.0 - smoothstep(0.0, 0.15, distanceToSurface4D);
                    float lattice4D_proj = grid4D * surfaceProximity4D;
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
    
    getFractalShader() {
        return `
            float calculateLattice(vec3 p) {
                int maxIterations = int(max(1.0, u_fractalIterations * (1.0 + u_interactionBass * 2.0)));
                float density = max(0.1, u_gridDensity * 0.5 * (1.0 + u_interactionMid * 0.6));
                
                vec3 z = p * density;
                float dr = 1.0;
                float r = 0.0;
                
                // Mandelbulb-style fractal
                for (int i = 0; i < 8; i++) {
                    if (i >= maxIterations) break;
                    
                    r = length(z);
                    if (r > 2.0) break;
                    
                    // Convert to polar coordinates
                    float theta = acos(z.z / r) + u_time * 0.05;
                    float phi = atan(z.y, z.x) + u_time * 0.03;
                    dr = pow(r, 7.0) * 8.0 * dr + 1.0;
                    
                    // Scale and rotate the point
                    float zr = pow(r, 8.0);
                    theta = theta * 8.0 + u_interactionHigh * 0.5;
                    phi = phi * 8.0 + u_interactionMid * 0.3;
                    
                    // Convert back to cartesian coordinates
                    z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
                    z += p * density;
                }
                
                float fractalValue = 0.25 * log(r) * r / dr;
                float lattice3D = 1.0 - smoothstep(0.0, 0.01, fractalValue);
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D fractal extension
                    float w_coord = sin(length(p) * 3.0 + u_time * 0.2) * 
                                   cos(p.x * 2.0 + p.y * 1.5 + u_time * 0.15) *
                                   dim_factor * (0.3 + u_morphFactor * 0.7 + u_interactionBass * 0.4);
                    
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 0.8;
                    p4d = rotXW(u_time * 0.22 * baseSpeed + u_interactionHigh * 0.35) * 
                          rotYW(u_time * 0.28 * baseSpeed + u_interactionMid * 0.25) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // Simplified fractal for 4D projection
                    vec3 z4D = projectedP * density;
                    float r4D = length(z4D);
                    
                    for (int i = 0; i < 4; i++) { // Reduced iterations for performance
                        if (r4D > 2.0) break;
                        z4D = z4D * z4D * z4D + projectedP * density;
                        r4D = length(z4D);
                    }
                    
                    float fractalValue4D = 0.25 * log(r4D) * r4D;
                    float lattice4D_proj = 1.0 - smoothstep(0.0, 0.01, fractalValue4D);
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
    
    getWaveShader() {
        return `
            float calculateLattice(vec3 p) {
                float frequency = max(0.1, u_waveFrequency * (1.0 + u_interactionBass * 1.5));
                float density = max(0.1, u_gridDensity * 0.7 * (1.0 + u_interactionMid * 0.4));
                
                // Multi-dimensional wave interference
                float wave1 = sin(p.x * frequency + u_time * 1.2 + u_interactionHigh * 2.0);
                float wave2 = sin(p.y * frequency * 1.3 - u_time * 0.8 + u_interactionMid * 1.5);
                float wave3 = sin(p.z * frequency * 0.9 + u_time * 1.5 + u_interactionBass * 1.8);
                
                // Circular waves
                float radialWave = sin(length(p) * frequency * 2.0 - u_time * 2.0 + u_interactionHigh * 3.0);
                
                // Combine waves
                float waveField = (wave1 + wave2 + wave3 + radialWave) * 0.25;
                
                // Create contour lines
                float contourWidth = 0.02 + u_interactionMid * 0.03;
                float contours = 1.0 - smoothstep(0.0, contourWidth, abs(fract(waveField * density) - 0.5));
                
                // Standing wave patterns
                float standingWave = sin(p.x * frequency + u_time) * cos(p.y * frequency - u_time * 0.5);
                float standingContours = 1.0 - smoothstep(0.0, contourWidth, abs(fract(standingWave * density * 0.5) - 0.5));
                
                float lattice3D = max(contours, standingContours * 0.7);
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D wave propagation
                    float w_coord = sin(p.x * frequency + p.y * frequency * 1.2 + u_time * 0.8) *
                                   cos(p.z * frequency * 0.8 - u_time * 1.1) *
                                   dim_factor * (0.4 + u_morphFactor * 0.6 + u_interactionHigh * 0.5);
                    
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 0.7;
                    p4d = rotXW(u_time * 0.35 * baseSpeed + u_interactionBass * 0.4) * 
                          rotYW(u_time * 0.28 * baseSpeed + u_interactionMid * 0.3) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D wave calculation
                    float wave1_4D = sin(projectedP.x * frequency + u_time * 1.2 + u_interactionHigh * 2.0);
                    float wave2_4D = sin(projectedP.y * frequency * 1.3 - u_time * 0.8 + u_interactionMid * 1.5);
                    float wave3_4D = sin(projectedP.z * frequency * 0.9 + u_time * 1.5 + u_interactionBass * 1.8);
                    float radialWave4D = sin(length(projectedP) * frequency * 2.0 - u_time * 2.0 + u_interactionHigh * 3.0);
                    
                    float waveField4D = (wave1_4D + wave2_4D + wave3_4D + radialWave4D) * 0.25;
                    float contours4D = 1.0 - smoothstep(0.0, contourWidth, abs(fract(waveField4D * density) - 0.5));
                    
                    finalLattice = mix(lattice3D, contours4D, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
    
    getCrystalShader() {
        return `
            float calculateLattice(vec3 p) {
                float crystalline = max(0.1, u_crystallineFactor * (1.0 + u_interactionBass * 0.6));
                float density = max(0.1, u_gridDensity * 0.8 * (1.0 + u_interactionMid * 0.5));
                
                // Crystal lattice structure (FCC-like)
                vec3 latticeP = p * density;
                vec3 cell = floor(latticeP);
                vec3 frac = fract(latticeP);
                
                // Crystal vertices at specific positions
                vec3 crystalVertices[4];
                crystalVertices[0] = vec3(0.0, 0.0, 0.0);
                crystalVertices[1] = vec3(0.5, 0.5, 0.0);
                crystalVertices[2] = vec3(0.5, 0.0, 0.5);
                crystalVertices[3] = vec3(0.0, 0.5, 0.5);
                
                float minDist = 1.0;
                for (int i = 0; i < 4; i++) {
                    vec3 vertex = crystalVertices[i];
                    float dist = length(frac - vertex);
                    minDist = min(minDist, dist);
                }
                
                // Crystal edges
                float edgeWidth = 0.02 + u_interactionHigh * 0.03;
                float crystalEdges = 1.0 - smoothstep(0.0, edgeWidth, minDist);
                
                // Crystal faces with normal interference
                vec3 normal = normalize(frac - 0.5);
                float facePattern = abs(dot(normal, vec3(1.0, 1.0, 1.0))) * crystalline;
                float faceIntensity = 1.0 - smoothstep(0.8, 1.0, facePattern);
                
                float lattice3D = max(crystalEdges, faceIntensity * 0.6);
                
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D crystal structure
                    float w_coord = sin(cell.x + cell.y + cell.z + u_time * 0.1) *
                                   cos(length(frac - 0.5) * 3.14159 + u_time * 0.08) *
                                   dim_factor * (0.5 + u_morphFactor * 0.5 + u_interactionMid * 0.3);
                    
                    vec4 p4d = vec4(p, w_coord);
                    float baseSpeed = u_rotationSpeed * 0.6;
                    p4d = rotXW(u_time * 0.18 * baseSpeed + u_interactionHigh * 0.2) * 
                          rotYW(u_time * 0.23 * baseSpeed + u_interactionBass * 0.15) * 
                          rotZW(u_time * 0.26 * baseSpeed + u_interactionMid * 0.25) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D crystal lattice
                    vec3 latticeP4D = projectedP * density;
                    vec3 frac4D = fract(latticeP4D);
                    
                    float minDist4D = 1.0;
                    for (int i = 0; i < 4; i++) {
                        vec3 vertex = crystalVertices[i];
                        float dist = length(frac4D - vertex);
                        minDist4D = min(minDist4D, dist);
                    }
                    
                    float crystalEdges4D = 1.0 - smoothstep(0.0, edgeWidth, minDist4D);
                    
                    vec3 normal4D = normalize(frac4D - 0.5);
                    float facePattern4D = abs(dot(normal4D, vec3(1.0, 1.0, 1.0))) * crystalline;
                    float faceIntensity4D = 1.0 - smoothstep(0.8, 1.0, facePattern4D);
                    
                    float lattice4D_proj = max(crystalEdges4D, faceIntensity4D * 0.6);
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
    
    // ========================================================================
    // 🎛️ PARAMETER UPDATE METHODS
    // ========================================================================
    
    updateParameters(params) {
        Object.entries(params).forEach(([key, value]) => {
            if (this.state.hasOwnProperty(key)) {
                this.state[key] = value;
            }
        });
        
        this.updateShaderUniforms();
    }
    
    updateFromInteractionEngine(interactionData) {
        // Map interaction data to shader uniforms
        this.state.interactionBass = interactionData.scroll.smoothed;
        this.state.interactionMid = interactionData.click.smoothed;
        this.state.interactionHigh = interactionData.mouse.smoothed;
        
        // Update mouse position
        this.state.mouse = interactionData.mouse.position;
        
        // Pattern-based parameter adjustments
        const pattern = interactionData.pattern;
        
        if (pattern.type === 'rhythmic') {
            this.state.rotationSpeed = this.state.rotationSpeed * (1.0 + pattern.frequency * 0.1);
        } else if (pattern.type === 'intense') {
            this.state.glitchIntensity = Math.min(0.1, this.state.glitchIntensity + pattern.frequency * 0.02);
        } else if (pattern.type === 'precise') {
            this.state.lineThickness = this.state.lineThickness * (1.0 - pattern.consistency * 0.3);
        }
        
        // Apply parameter modifier for multi-instance
        const effectiveParams = {};
        Object.entries(this.state).forEach(([key, value]) => {
            if (typeof value === 'number' && key !== 'time') {
                effectiveParams[key] = value * this.parameterModifier;
            } else {
                effectiveParams[key] = value;
            }
        });
        
        this.updateShaderUniforms();
    }
    
    setupWebGL() {
        // WebGL setup code...
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }
    
    setupGeometry(geometryType) {
        this.currentGeometry = geometryType;
        // Compile shader for specific geometry...
    }
    
    updateShaderUniforms() {
        // Update all shader uniforms from current state...
    }
    
    render() {
        this.state.time = performance.now() * 0.001;
        this.updateShaderUniforms();
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Render geometry...
        
        requestAnimationFrame(() => this.render());
    }
}

// ============================================================================
// 🏗️ VIB34D MULTI-INSTANCE MANAGER
// ============================================================================

class VIB34DMultiInstance {
    constructor(container, sectionKey, options = {}) {
        this.container = container;
        this.sectionKey = sectionKey;
        this.instances = new Map();
        this.isActive = false;
        
        this.config = {
            geometryType: options.geometry || 'hypercube',
            instanceCount: options.instanceCount || 3,
            instanceTemplates: options.instanceTemplates || {
                background: { modifier: 0.7, opacity: 0.4, zIndex: 1, role: 'background' },
                content: { modifier: 1.0, opacity: 0.6, zIndex: 2, role: 'content' },
                accent: { modifier: 1.3, opacity: 0.8, zIndex: 3, role: 'accent' }
            }
        };
        
        this.createInstances();
    }
    
    createInstances() {
        Object.entries(this.config.instanceTemplates).forEach(([role, template]) => {
            const canvas = document.createElement('canvas');
            canvas.className = `vib34d-instance vib34d-${role}`;
            canvas.style.cssText = `
                position: absolute;
                top: 0; left: 0; 
                width: 100%; height: 100%;
                opacity: ${template.opacity};
                z-index: ${template.zIndex};
                pointer-events: none;
            `;
            
            this.container.appendChild(canvas);
            
            const instance = new VIB34DCore(canvas, {
                instanceId: `${this.sectionKey}-${role}`,
                role: template.role,
                modifier: template.modifier,
                geometry: this.config.geometryType
            });
            
            this.instances.set(role, instance);
        });
    }
    
    updateFromInteraction(interactionData) {
        if (!this.isActive) return;
        
        this.instances.forEach((instance, role) => {
            instance.updateFromInteractionEngine(interactionData);
        });
    }
    
    transitionToGeometry(newGeometry, transitionDuration = 2000) {
        this.instances.forEach((instance, role) => {
            instance.setupGeometry(newGeometry);
        });
    }
    
    activate() {
        this.isActive = true;
        this.instances.forEach(instance => instance.render());
    }
    
    deactivate() {
        this.isActive = false;
    }
}

// ============================================================================
// 🎯 VIB34D HOME MASTER (Parameter Derivation Engine)
// ============================================================================

class VIB34DHomeMaster {
    constructor() {
        this.masterParameters = {
            // Base parameter values (HOME section defines all others)
            dimension: 4.0,
            morphFactor: 0.5,
            rotationSpeed: 0.5,
            gridDensity: 8.0,
            lineThickness: 0.03,
            universeModifier: 1.0,
            patternIntensity: 1.0,
            glitchIntensity: 0.0,
            colorShift: 0.0
        };
        
        this.sectionConfig = {
            home: { 
                geometry: 'hypercube', 
                modifier: 1.0,
                description: 'Base parameters - source of truth'
            },
            articles: { 
                geometry: 'tetrahedron', 
                modifier: 0.8,
                description: 'Articles = Home × 0.8 (more structured)'
            },
            videos: { 
                geometry: 'sphere', 
                modifier: 1.2,
                description: 'Videos = Home × 1.2 (more expansive)'
            },
            podcasts: { 
                geometry: 'torus', 
                modifier: 1.1,
                description: 'Podcasts = Home × 1.1 (continuous flow)'
            },
            community: { 
                geometry: 'klein', 
                modifier: 0.9,
                description: 'Community = Home × 0.9 (boundary transcendence)'
            },
            development: { 
                geometry: 'fractal', 
                modifier: 1.4,
                description: 'Development = Home × 1.4 (complex recursion)'
            },
            research: { 
                geometry: 'wave', 
                modifier: 0.7,
                description: 'Research = Home × 0.7 (probability spaces)'
            },
            innovation: { 
                geometry: 'crystal', 
                modifier: 1.1,
                description: 'Innovation = Home × 1.1 (structured creativity)'
            }
        };
        
        this.interactionMappings = {
            // How different interaction types affect parameter derivation
            scroll: {
                dimension: 0.3,          // Scroll affects dimensionality
                rotationSpeed: 0.5,      // Primary rotation driver
                gridDensity: 0.2        // Secondary grid modification
            },
            click: {
                morphFactor: 0.6,       // Click drives morphing
                glitchIntensity: 0.4,   // Click creates glitch effects
                patternIntensity: 0.3   // Click enhances patterns
            },
            mouse: {
                lineThickness: 0.4,     // Mouse affects detail level
                colorShift: 0.5,        // Mouse drives color changes
                universeModifier: 0.2   // Mouse fine-tunes universe
            }
        };
    }
    
    deriveParametersForSection(sectionKey, interactionData) {
        const sectionConfig = this.sectionConfig[sectionKey];
        if (!sectionConfig) return this.masterParameters;
        
        const derivedParams = {};
        const modifier = sectionConfig.modifier;
        
        // Apply mathematical scaling to base parameters
        Object.entries(this.masterParameters).forEach(([key, baseValue]) => {
            derivedParams[key] = baseValue * modifier;
        });
        
        // Apply interaction-based modulation
        if (interactionData) {
            Object.entries(this.interactionMappings).forEach(([interactionType, mappings]) => {
                const intensity = this.getInteractionIntensity(interactionData, interactionType);
                
                Object.entries(mappings).forEach(([paramKey, influence]) => {
                    if (derivedParams[paramKey] !== undefined) {
                        derivedParams[paramKey] *= (1.0 + intensity * influence);
                    }
                });
            });
        }
        
        return {
            ...derivedParams,
            geometry: sectionConfig.geometry
        };
    }
    
    getInteractionIntensity(interactionData, type) {
        switch (type) {
            case 'scroll': return interactionData.scroll.smoothed;
            case 'click': return interactionData.click.smoothed;
            case 'mouse': return interactionData.mouse.smoothed;
            default: return 0;
        }
    }
    
    updateMasterParameters(newParams) {
        Object.assign(this.masterParameters, newParams);
        
        // Trigger cascade update to all sections
        this.onParameterUpdate && this.onParameterUpdate(this.masterParameters);
    }
}

// ============================================================================
// 🌊 VIB34D INFINITE SCROLL + PORTAL TRANSITIONS
// ============================================================================

class VIB34DInfiniteScroll {
    constructor(homeMaster, interactionEngine) {
        this.homeMaster = homeMaster;
        this.interactionEngine = interactionEngine;
        this.sections = new Map();
        this.currentSection = 'home';
        this.isTransitioning = false;
        
        this.scrollConfig = {
            snapThreshold: 0.3,      // Snap when 30% scrolled
            transitionDuration: 1500, // Portal transition time
            portalIntensity: 0.5     // Base portal effect strength
        };
        
        this.setupScrollDetection();
    }
    
    registerSection(sectionKey, element, options = {}) {
        const multiInstance = new VIB34DMultiInstance(element, sectionKey, {
            geometry: this.homeMaster.sectionConfig[sectionKey]?.geometry || 'hypercube',
            ...options
        });
        
        this.sections.set(sectionKey, {
            element,
            multiInstance,
            isVisible: false,
            snapPoint: element.offsetTop
        });
    }
    
    setupScrollDetection() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Update interaction engine with scroll data
            this.interactionEngine.update();
            
            // Check for section transitions
            this.checkSectionTransitions(scrollY, windowHeight);
            
            // Portal effect based on scroll velocity
            const scrollVelocity = this.interactionEngine.interactionData.scroll.velocity;
            if (scrollVelocity > 10 && !this.isTransitioning) {
                this.triggerPortalTransition(scrollVelocity);
            }
            
            // Smooth scroll end detection
            scrollTimeout = setTimeout(() => {
                this.snapToNearestSection(scrollY, windowHeight);
            }, 150);
        }, { passive: true });
    }
    
    checkSectionTransitions(scrollY, windowHeight) {
        const viewportCenter = scrollY + windowHeight / 2;
        
        this.sections.forEach((sectionData, sectionKey) => {
            const element = sectionData.element;
            const sectionCenter = element.offsetTop + element.offsetHeight / 2;
            const distance = Math.abs(viewportCenter - sectionCenter);
            const threshold = windowHeight * 0.5;
            
            const shouldBeVisible = distance < threshold;
            
            if (shouldBeVisible && !sectionData.isVisible) {
                this.activateSection(sectionKey);
            } else if (!shouldBeVisible && sectionData.isVisible) {
                this.deactivateSection(sectionKey);
            }
        });
    }
    
    activateSection(sectionKey) {
        const sectionData = this.sections.get(sectionKey);
        if (!sectionData) return;
        
        sectionData.isVisible = true;
        sectionData.multiInstance.activate();
        
        // Update current section if this is the primary visible section
        if (this.shouldBePrimarySection(sectionKey)) {
            this.currentSection = sectionKey;
        }
        
        console.log(`VIB34D: Activated section ${sectionKey}`);
    }
    
    deactivateSection(sectionKey) {
        const sectionData = this.sections.get(sectionKey);
        if (!sectionData) return;
        
        sectionData.isVisible = false;
        sectionData.multiInstance.deactivate();
        
        console.log(`VIB34D: Deactivated section ${sectionKey}`);
    }
    
    shouldBePrimarySection(sectionKey) {
        // Logic to determine if this should be the primary section
        // based on viewport position and scroll direction
        return true; // Simplified for now
    }
    
    triggerPortalTransition(scrollVelocity) {
        this.isTransitioning = true;
        
        const intensity = Math.min(1.0, scrollVelocity / 50.0);
        const duration = this.scrollConfig.transitionDuration * (1.0 - intensity * 0.3);
        
        // Apply portal effects to all visible sections
        this.sections.forEach((sectionData, sectionKey) => {
            if (sectionData.isVisible) {
                this.applyPortalEffects(sectionData.multiInstance, intensity);
            }
        });
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, duration);
        
        console.log(`VIB34D: Portal transition triggered with intensity ${intensity.toFixed(2)}`);
    }
    
    applyPortalEffects(multiInstance, intensity) {
        const portalParams = {
            glitchIntensity: intensity * 0.8,
            morphFactor: 0.5 + intensity * 0.5,
            dimension: 4.0 + intensity * 0.5,
            colorShift: (Math.random() - 0.5) * intensity * 2.0
        };
        
        multiInstance.instances.forEach(instance => {
            instance.updateParameters(portalParams);
        });
    }
    
    snapToNearestSection(scrollY, windowHeight) {
        // Find nearest section snap point
        let nearestSection = null;
        let minDistance = Infinity;
        
        this.sections.forEach((sectionData, sectionKey) => {
            const distance = Math.abs(scrollY - sectionData.snapPoint);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSection = sectionKey;
            }
        });
        
        if (nearestSection && minDistance > windowHeight * this.scrollConfig.snapThreshold) {
            this.smoothScrollToSection(nearestSection);
        }
    }
    
    smoothScrollToSection(sectionKey) {
        const sectionData = this.sections.get(sectionKey);
        if (!sectionData) return;
        
        window.scrollTo({
            top: sectionData.snapPoint,
            behavior: 'smooth'
        });
    }
    
    update() {
        // Update all visible sections with current interaction data
        const interactionData = this.interactionEngine.interactionData;
        
        this.sections.forEach((sectionData, sectionKey) => {
            if (sectionData.isVisible) {
                const sectionParams = this.homeMaster.deriveParametersForSection(sectionKey, interactionData);
                sectionData.multiInstance.updateFromInteraction(interactionData);
            }
        });
    }
}

// ============================================================================
// 🎛️ VIB34D MAIN SYSTEM ORCHESTRATOR
// ============================================================================

class VIB34DSystem {
    constructor(options = {}) {
        this.interactionEngine = new VIB34DInteractionEngine();
        this.homeMaster = new VIB34DHomeMaster();
        this.infiniteScroll = new VIB34DInfiniteScroll(this.homeMaster, this.interactionEngine);
        
        this.isInitialized = false;
        this.animationId = null;
        
        this.config = {
            targetFPS: options.targetFPS || 60,
            debugMode: options.debugMode || false,
            editorMode: options.editorMode || false
        };
        
        this.setupHomeMasterCallbacks();
    }
    
    setupHomeMasterCallbacks() {
        this.homeMaster.onParameterUpdate = (newParams) => {
            // Cascade parameter updates to all sections
            this.infiniteScroll.sections.forEach((sectionData, sectionKey) => {
                const sectionParams = this.homeMaster.deriveParametersForSection(sectionKey, this.interactionEngine.interactionData);
                sectionData.multiInstance.updateFromInteraction(this.interactionEngine.interactionData);
            });
        };
    }
    
    initialize() {
        if (this.isInitialized) return;
        
        // Auto-detect sections with vib34d-section class
        document.querySelectorAll('.vib34d-section').forEach(element => {
            const sectionKey = element.dataset.section || element.id;
            const geometry = element.dataset.geometry;
            
            this.infiniteScroll.registerSection(sectionKey, element, { geometry });
        });
        
        this.startAnimationLoop();
        this.isInitialized = true;
        
        console.log('VIB34D System initialized with sections:', Array.from(this.infiniteScroll.sections.keys()));
    }
    
    startAnimationLoop() {
        const targetInterval = 1000 / this.config.targetFPS;
        let lastTime = 0;
        
        const animate = (currentTime) => {
            if (currentTime - lastTime >= targetInterval) {
                this.update();
                lastTime = currentTime;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    update() {
        // Update interaction engine
        this.interactionEngine.update();
        
        // Update infinite scroll system
        this.infiniteScroll.update();
        
        // Debug output
        if (this.config.debugMode) {
            this.logDebugInfo();
        }
    }
    
    logDebugInfo() {
        const interaction = this.interactionEngine.interactionData;
        console.log('VIB34D Debug:', {
            scroll: interaction.scroll.smoothed.toFixed(3),
            click: interaction.click.smoothed.toFixed(3),
            mouse: interaction.mouse.smoothed.toFixed(3),
            pattern: interaction.pattern.type,
            currentSection: this.infiniteScroll.currentSection
        });
    }
    
    // ========================================================================
    // 🎛️ PUBLIC API FOR EDITOR INTEGRATION
    // ========================================================================
    
    updateMasterParameters(params) {
        this.homeMaster.updateMasterParameters(params);
    }
    
    transitionToSection(sectionKey) {
        this.infiniteScroll.smoothScrollToSection(sectionKey);
    }
    
    setGeometryForSection(sectionKey, geometry) {
        const sectionData = this.infiniteScroll.sections.get(sectionKey);
        if (sectionData) {
            sectionData.multiInstance.transitionToGeometry(geometry);
        }
    }
    
    getSystemState() {
        return {
            currentSection: this.infiniteScroll.currentSection,
            interactionData: this.interactionEngine.interactionData,
            masterParameters: this.homeMaster.masterParameters,
            visibleSections: Array.from(this.infiniteScroll.sections.entries())
                .filter(([key, data]) => data.isVisible)
                .map(([key]) => key)
        };
    }
}

// ============================================================================
// 🚀 GLOBAL INITIALIZATION
// ============================================================================

// Initialize VIB34D system when DOM is ready
let VIB34D_SYSTEM = null;

document.addEventListener('DOMContentLoaded', () => {
    // Read configuration from global object or data attributes
    const config = window.VIB34DConfig || {};
    
    VIB34D_SYSTEM = new VIB34DSystem(config);
    VIB34D_SYSTEM.initialize();
    
    // Expose to global scope for editor integration
    window.VIB34D = VIB34D_SYSTEM;
    
    console.log('🌟 VIB34D System initialized successfully!');
});

export { VIB34DSystem, VIB34DCore, VIB34DMultiInstance, VIB34DHomeMaster, VIB34DInfiniteScroll, VIB34DInteractionEngine };