/**
 * VIB34D PHASE 2: GEOMETRY IMPLEMENTATIONS (8 Total)
 * 
 * Implementing all 8 geometry classes with proper 4D mathematics:
 * - 3 Core geometries from HyperAV (Hypercube, Hypersphere, Hypertetrahedron)
 * - 5 Extended geometries for VIB3 system (Torus, Klein, Fractal, Wave, Crystal)
 * 
 * CHECKLIST REFERENCE: VIB34D_IMPLEMENTATION_CHECKLIST.md - Phase 2
 * STATUS: Phase 2 - Geometry Implementation (IN PROGRESS)
 */

// Import Phase 1 core classes
// Note: In production, this will be inline to avoid module issues

// ============================================================================
// 🔮 CORE GEOMETRY 1: HYPERCUBE GEOMETRY
// ============================================================================

class HypercubeGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('hypercube');
        
        // Hypercube-specific parameter ranges
        this.parameterRanges = {
            ...this.getParameterRanges(),
            // Hypercube uses standard ranges from base class
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            // Advanced Multi-Grid Hypercube with Moiré Interference
            // Based on hypercubeapp0.2 advanced grid system
            
            // Distance to nearest edge in 3D lattice
            float latticeEdges(vec3 p, float gridSize, float lineWidth) {
                vec3 grid = fract(p * gridSize);
                vec3 edges = 1.0 - smoothstep(0.0, lineWidth, abs(grid - 0.5));
                return max(max(edges.x, edges.y), edges.z);
            }
            
            // Distance to nearest vertex in 3D lattice
            float latticeVertices(vec3 p, float gridSize, float vertexSize) {
                vec3 grid = fract(p * gridSize);
                vec3 distToVertex = min(grid, 1.0 - grid);
                float minDist = min(min(distToVertex.x, distToVertex.y), distToVertex.z);
                return 1.0 - smoothstep(0.0, vertexSize, minDist);
            }
            
            // Complete Hypercube lattice with multi-grid system
            float calculateLattice(vec3 p) {
                // Dynamic parameter calculation with interaction modulation
                float dynamicGridDensity = max(0.1, u_gridDensity * (1.0 + u_audioBass * 0.7));
                float dynamicLineThickness = max(0.002, u_lineThickness * (1.0 - u_audioMid * 0.6));
                
                // Create base cubic lattice using advanced functions
                float edges = latticeEdges(p, dynamicGridDensity, 0.03);
                float vertices = latticeVertices(p, dynamicGridDensity, 0.05);
                
                // Add time-based distortion to simulate hypercube morphing
                float timeFactor = u_time * 0.2 * u_rotationSpeed;
                
                // Apply non-linear distortion based on morphFactor
                vec3 distortedP = p;
                distortedP.x += sin(p.z * 2.0 + timeFactor) * u_morphFactor * 0.2;
                distortedP.y += cos(p.x * 2.0 + timeFactor) * u_morphFactor * 0.2;
                distortedP.z += sin(p.y * 2.0 + timeFactor) * u_morphFactor * 0.1;
                
                // Apply 4D rotation projection when morphing to a hypercube
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                if (dim_factor > 0.01) {
                    // Create a 4D point by extending our 3D point
                    float w = sin(length(p) * 3.0 + u_time * 0.3) * (u_dimension - 3.0);
                    vec4 p4d = vec4(distortedP, w);
                    
                    // Apply 4D rotations (using exact sequence from hypercubeapp0.2)
                    p4d = rotateXW(timeFactor * 0.31) * p4d;
                    p4d = rotateYW(timeFactor * 0.27) * p4d;
                    p4d = rotateZW(timeFactor * 0.23) * p4d;
                    
                    // Project back to 3D
                    distortedP = project4Dto3D(p4d);
                }
                
                // Calculate lattice values for the distorted position
                float distortedEdges = latticeEdges(distortedP, dynamicGridDensity, 0.03);
                float distortedVertices = latticeVertices(distortedP, dynamicGridDensity, 0.05);
                
                // Blend between regular and distorted lattice based on morphFactor
                edges = mix(edges, distortedEdges, u_morphFactor);
                vertices = mix(vertices, distortedVertices, u_morphFactor);
                
                // Create moiré pattern by overlaying slightly offset grids
                float moireGrid1 = max(latticeEdges(p, dynamicGridDensity * 1.01, 0.03),
                                      latticeVertices(p, dynamicGridDensity * 1.01, 0.05));
                float moireGrid2 = max(latticeEdges(p, dynamicGridDensity * 0.99, 0.03),
                                      latticeVertices(p, dynamicGridDensity * 0.99, 0.05));
                float moire = abs(moireGrid1 - moireGrid2) * 0.5;
                
                // Combine base lattice
                float baseLattice = max(edges, vertices);
                
                // Blend moiré pattern based on pattern intensity
                float finalLattice = mix(baseLattice, moire, 0.4 * u_patternIntensity);
                
                // Apply universe modifier power curve
                return pow(finalLattice, 1.0 / max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🌐 CORE GEOMETRY 2: HYPERSPHERE GEOMETRY
// ============================================================================

class HypersphereGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('hypersphere');
        
        // Hypersphere-specific parameter ranges
        this.parameterRanges = {
            ...this.getParameterRanges(),
            shellWidth: { min: 0.005, max: 0.08, default: 0.025 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            // Advanced Multi-Grid Hypersphere with Concentric Shells
            // Based on hypercubeapp0.2 multi-grid principles adapted for spherical geometry
            
            // Spherical edge detection (radial shells)
            float sphericalShells(vec3 p, float gridSize, float shellWidth) {
                float radius = length(p);
                float shells = fract(radius * gridSize);
                return 1.0 - smoothstep(0.0, shellWidth, abs(shells - 0.5));
            }
            
            // Spherical vertex detection (polar intersections)
            float sphericalNodes(vec3 p, float gridSize, float nodeSize) {
                // Convert to spherical coordinates
                float r = length(p);
                if (r < 0.001) return 1.0; // Handle origin
                
                vec3 normalized = p / r;
                float theta = atan(normalized.y, normalized.x); // Azimuth
                float phi = acos(normalized.z); // Polar angle
                
                // Grid in spherical coordinates
                vec2 sphericalGrid = fract(vec2(theta, phi) * gridSize / 6.28318);
                vec2 distToNode = min(sphericalGrid, 1.0 - sphericalGrid);
                float minDist = min(distToNode.x, distToNode.y);
                return 1.0 - smoothstep(0.0, nodeSize, minDist);
            }
            
            float calculateLattice(vec3 p) {
                // Dynamic parameter calculation with interaction modulation
                float dynamicGridDensity = max(0.1, u_gridDensity * 0.7 * (1.0 + u_audioBass * 0.5));
                float dynamicShellWidth = max(0.005, u_shellWidth * (1.0 + u_audioMid * 1.5));
                
                // Create base spherical lattice using advanced functions
                float shells = sphericalShells(p, dynamicGridDensity, dynamicShellWidth);
                float nodes = sphericalNodes(p, dynamicGridDensity, dynamicShellWidth * 2.0);
                
                // Add time-based distortion for hypersphere morphing
                float timeFactor = u_time * 0.2 * u_rotationSpeed;
                
                // Apply spherical distortion based on morphFactor
                vec3 distortedP = p;
                float r = length(p);
                if (r > 0.001) {
                    vec3 normalized = p / r;
                    // Spherical harmonic distortion
                    float distortion = sin(normalized.x * 4.0 + timeFactor) * 
                                     cos(normalized.y * 3.0 + timeFactor * 0.7) * 
                                     sin(normalized.z * 5.0 + timeFactor * 1.3);
                    distortedP = p * (1.0 + distortion * u_morphFactor * 0.3);
                }
                
                // Apply 4D rotation projection when morphing to a hypersphere
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                if (dim_factor > 0.01) {
                    // Create a 4D point by extending our 3D point
                    float w = cos(length(p) * 2.5 - u_time * 0.55) * 
                             sin(p.x*1.0 + p.y*1.3 - p.z*0.7 + u_time*0.2) * 
                             (u_dimension - 3.0);
                    vec4 p4d = vec4(distortedP, w);
                    
                    // Apply 4D rotations (spherical-optimized sequence)
                    p4d = rotateXW(timeFactor * 0.38) * p4d;
                    p4d = rotateYZ(timeFactor * 0.31) * p4d;
                    p4d = rotateYW(timeFactor * -0.24) * p4d;
                    
                    // Project back to 3D
                    distortedP = project4Dto3D(p4d);
                }
                
                // Calculate lattice values for the distorted position
                float distortedShells = sphericalShells(distortedP, dynamicGridDensity, dynamicShellWidth);
                float distortedNodes = sphericalNodes(distortedP, dynamicGridDensity, dynamicShellWidth * 2.0);
                
                // Blend between regular and distorted lattice based on morphFactor
                shells = mix(shells, distortedShells, u_morphFactor);
                nodes = mix(nodes, distortedNodes, u_morphFactor);
                
                // Create moiré pattern with offset spherical grids
                float moireShells1 = sphericalShells(p, dynamicGridDensity * 1.02, dynamicShellWidth);
                float moireShells2 = sphericalShells(p, dynamicGridDensity * 0.98, dynamicShellWidth);
                float moire = abs(moireShells1 - moireShells2) * 0.6;
                
                // Combine base lattice
                float baseLattice = max(shells, nodes);
                
                // Blend moiré pattern based on pattern intensity
                float finalLattice = mix(baseLattice, moire, 0.3 * u_patternIntensity);
                
                // Apply universe modifier
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🔺 CORE GEOMETRY 3: HYPERTETRAHEDRON GEOMETRY
// ============================================================================

class HypertetrahedronGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('hypertetrahedron');
        
        // Hypertetrahedron-specific parameter ranges
        this.parameterRanges = {
            ...this.getParameterRanges(),
            tetraThickness: { min: 0.003, max: 0.1, default: 0.035 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                // ORIGINAL TETRAHEDRAL PLANE SYSTEM (PRESERVED)
                float density = max(0.1, u_gridDensity * 0.65 * (1.0 + u_audioBass * 0.4));
                float dynamicThickness = max(0.003, u_tetraThickness * (1.0 - u_audioMid * 0.7));
                
                // Tetrahedron corner vertices (normalized) - ORIGINAL MATH
                vec3 c1 = normalize(vec3(1,1,1));
                vec3 c2 = normalize(vec3(-1,-1,1));
                vec3 c3 = normalize(vec3(-1,1,-1));
                vec3 c4 = normalize(vec3(1,-1,-1));
                
                // 3D tetrahedral plane distance calculation - ORIGINAL
                vec3 p_mod3D = fract(p * density * 0.5 + 0.5 + u_time * 0.005) - 0.5;
                float d1 = dot(p_mod3D, c1);
                float d2 = dot(p_mod3D, c2);
                float d3 = dot(p_mod3D, c3);
                float d4 = dot(p_mod3D, c4);
                
                float minDistToPlane3D = min(min(abs(d1), abs(d2)), min(abs(d3), abs(d4)));
                float lattice3D = 1.0 - smoothstep(0.0, dynamicThickness, minDistToPlane3D);
                
                // MULTI-GRID ENHANCEMENT: Add edge and vertex detection
                // Tetrahedral edges using the original vertex system
                float tetraEdges = 0.0;
                for (int i = 0; i < 4; i++) {
                    vec3 edgeVec = (i == 0) ? c1 : (i == 1) ? c2 : (i == 2) ? c3 : c4;
                    float edgeDist = abs(dot(p_mod3D, edgeVec));
                    tetraEdges = max(tetraEdges, 1.0 - smoothstep(0.0, dynamicThickness * 0.8, edgeDist));
                }
                
                // MULTI-GRID ENHANCEMENT: Tetrahedral vertices
                float tetraVertices = 0.0;
                for (int i = 0; i < 4; i++) {
                    vec3 vertexPos = (i == 0) ? c1 : (i == 1) ? c2 : (i == 2) ? c3 : c4;
                    float vertexDist = length(p_mod3D - vertexPos * 0.3);
                    tetraVertices = max(tetraVertices, 1.0 - smoothstep(0.0, dynamicThickness * 2.0, vertexDist));
                }
                
                // Combine original lattice with multi-grid enhancements
                float enhancedLattice3D = max(lattice3D, max(tetraEdges * 0.8, tetraVertices * 0.6));
                
                // 4D extension calculation - ORIGINAL MATH PRESERVED
                float finalLattice = enhancedLattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D coordinate calculation for hypertetrahedron - ORIGINAL
                    float w_coord = cos(p.x*1.8 - p.y*1.5 + p.z*1.2 + u_time*0.24) 
                                  * sin(length(p)*1.4 + u_time*0.18 - u_audioMid*2.0) 
                                  * dim_factor * (0.45 + u_morphFactor*0.55 + u_audioHigh*0.4);
                    
                    // 4D vector construction - ORIGINAL
                    vec4 p4d = vec4(p, w_coord);
                    
                    // 4D rotation matrix application - ORIGINAL MATH PRESERVED
                    float baseSpeed = u_rotationSpeed * 1.15;
                    float time_rot1 = u_time*0.28*baseSpeed + u_audioHigh*0.25;
                    float time_rot2 = u_time*0.36*baseSpeed - u_audioBass*0.2 + u_morphFactor*0.4;
                    float time_rot3 = u_time*0.32*baseSpeed + u_audioMid*0.15;
                    
                    p4d = rotXW(time_rot1*0.95) * rotYW(time_rot2*1.05) * rotZW(time_rot3) * p4d;
                    
                    // 4D→3D projection - ORIGINAL
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D tetrahedral plane calculation - ORIGINAL
                    vec3 p_mod4D_proj = fract(projectedP * density * 0.5 + 0.5 + u_time * 0.008) - 0.5;
                    float dp1 = dot(p_mod4D_proj, c1);
                    float dp2 = dot(p_mod4D_proj, c2);
                    float dp3 = dot(p_mod4D_proj, c3);
                    float dp4 = dot(p_mod4D_proj, c4);
                    
                    float minDistToPlane4D = min(min(abs(dp1), abs(dp2)), min(abs(dp3), abs(dp4)));
                    float lattice4D_proj = 1.0 - smoothstep(0.0, dynamicThickness, minDistToPlane4D);
                    
                    // MULTI-GRID ENHANCEMENT: Add 4D edges and vertices
                    float tetraEdges4D = 0.0;
                    float tetraVertices4D = 0.0;
                    for (int i = 0; i < 4; i++) {
                        vec3 edgeVec = (i == 0) ? c1 : (i == 1) ? c2 : (i == 2) ? c3 : c4;
                        float edgeDist4D = abs(dot(p_mod4D_proj, edgeVec));
                        tetraEdges4D = max(tetraEdges4D, 1.0 - smoothstep(0.0, dynamicThickness * 0.8, edgeDist4D));
                        
                        vec3 vertexPos4D = edgeVec;
                        float vertexDist4D = length(p_mod4D_proj - vertexPos4D * 0.3);
                        tetraVertices4D = max(tetraVertices4D, 1.0 - smoothstep(0.0, dynamicThickness * 2.0, vertexDist4D));
                    }
                    
                    float enhanced4D = max(lattice4D_proj, max(tetraEdges4D * 0.8, tetraVertices4D * 0.6));
                    
                    // MULTI-GRID ENHANCEMENT: Moiré interference pattern
                    float moire4D1 = 0.0;
                    float moire4D2 = 0.0;
                    vec3 p_moire1 = fract(projectedP * density * 0.51) - 0.5;
                    vec3 p_moire2 = fract(projectedP * density * 0.49) - 0.5;
                    
                    for (int i = 0; i < 4; i++) {
                        vec3 edgeVec = (i == 0) ? c1 : (i == 1) ? c2 : (i == 2) ? c3 : c4;
                        moire4D1 = max(moire4D1, 1.0 - smoothstep(0.0, dynamicThickness, abs(dot(p_moire1, edgeVec))));
                        moire4D2 = max(moire4D2, 1.0 - smoothstep(0.0, dynamicThickness, abs(dot(p_moire2, edgeVec))));
                    }
                    
                    float moire = abs(moire4D1 - moire4D2) * 0.5;
                    enhanced4D = mix(enhanced4D, moire, 0.3 * u_patternIntensity);
                    
                    // Blend 3D and 4D lattices - ORIGINAL
                    finalLattice = mix(enhancedLattice3D, enhanced4D, smoothstep(0.0, 1.0, u_morphFactor));
                } else {
                    // MULTI-GRID ENHANCEMENT: 3D Moiré pattern
                    float moire3D1 = 0.0;
                    float moire3D2 = 0.0;
                    vec3 p_moire1 = fract(p * density * 0.51 + 0.5) - 0.5;
                    vec3 p_moire2 = fract(p * density * 0.49 + 0.5) - 0.5;
                    
                    for (int i = 0; i < 4; i++) {
                        vec3 edgeVec = (i == 0) ? c1 : (i == 1) ? c2 : (i == 2) ? c3 : c4;
                        moire3D1 = max(moire3D1, 1.0 - smoothstep(0.0, dynamicThickness, abs(dot(p_moire1, edgeVec))));
                        moire3D2 = max(moire3D2, 1.0 - smoothstep(0.0, dynamicThickness, abs(dot(p_moire2, edgeVec))));
                    }
                    
                    float moire = abs(moire3D1 - moire3D2) * 0.5;
                    finalLattice = mix(enhancedLattice3D, moire, 0.3 * u_patternIntensity);
                }
                
                // Apply universe modifier - ORIGINAL
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🍩 EXTENDED GEOMETRY 4: TORUS GEOMETRY  
// ============================================================================

class TorusGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('torus');
        
        this.parameterRanges = {
            ...this.getParameterRanges(),
            majorRadius: { min: 0.5, max: 2.0, default: 1.0 },
            minorRadius: { min: 0.1, max: 0.8, default: 0.3 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                // Enhanced Torus Flow Pattern with Multi-Grid
                // Based on vibecodestyle demo torus implementation
                float density = max(0.1, u_gridDensity * 0.8 * (1.0 + u_audioBass * 0.6));
                float dynamicThickness = max(0.005, u_lineThickness * (1.0 + u_audioMid * 0.8));
                
                // 3D torus calculation - ENHANCED VERSION
                vec3 q = fract(p * density) - 0.5;
                float r1 = sqrt(q.x*q.x + q.y*q.y);
                float r2 = sqrt((r1 - 0.3)*(r1 - 0.3) + q.z*q.z);
                float torusLattice = 1.0 - smoothstep(0.0, 0.1, r2);
                
                // 4D extension with flow patterns
                float finalLattice = torusLattice;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D torus coordinate with flow modulation
                    float w_coord = sin(atan(p.y, p.x) * 3.0 + u_time * 0.4) * 
                                   cos(length(p.xz) * 2.0 - u_time * 0.3) * 
                                   dim_factor * (0.5 + u_morphFactor * 0.5 + u_audioHigh * 0.4);
                    
                    vec4 p4d = vec4(p, w_coord);
                    
                    // 4D rotations for torus flow
                    float baseSpeed = u_rotationSpeed * 0.9;
                    p4d = rotateXW(u_time * 0.35 * baseSpeed) * p4d;
                    p4d = rotateYW(u_time * 0.28 * baseSpeed) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D torus calculation
                    vec3 q4d = fract(projectedP * density) - 0.5;
                    float r1_4d = sqrt(q4d.x*q4d.x + q4d.y*q4d.y);
                    float r2_4d = sqrt((r1_4d - 0.3)*(r1_4d - 0.3) + q4d.z*q4d.z);
                    float torus4D = 1.0 - smoothstep(0.0, 0.1, r2_4d);
                    
                    // Multi-grid enhancement: Flow interference
                    float flow1 = 1.0 - smoothstep(0.0, 0.08, r2_4d * 1.1);
                    float flow2 = 1.0 - smoothstep(0.0, 0.12, r2_4d * 0.9);
                    float flowMoire = abs(flow1 - flow2) * 0.6;
                    
                    torus4D = mix(torus4D, flowMoire, 0.4 * u_patternIntensity);
                    finalLattice = mix(torusLattice, torus4D, u_morphFactor);
                } else {
                    // 3D flow moiré
                    float flow1 = 1.0 - smoothstep(0.0, 0.08, r2 * 1.1);
                    float flow2 = 1.0 - smoothstep(0.0, 0.12, r2 * 0.9);
                    float flowMoire = abs(flow1 - flow2) * 0.6;
                    finalLattice = mix(torusLattice, flowMoire, 0.4 * u_patternIntensity);
                }
                
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🎭 EXTENDED GEOMETRY 5: KLEIN BOTTLE GEOMETRY
// ============================================================================

class KleinBottleGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('klein');
        
        this.parameterRanges = {
            ...this.getParameterRanges(),
            bottleScale: { min: 0.5, max: 2.0, default: 1.0 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                // Klein bottle topology (non-orientable surface)
                float density = max(0.1, u_gridDensity * 0.75 * (1.0 + u_audioBass * 0.5));
                float dynamicThickness = max(0.008, u_lineThickness * (1.0 + u_audioMid * 1.2));
                
                // Klein bottle parametric equations
                float u = atan(p.y, p.x) + u_time * u_rotationSpeed * 0.5;
                float v = length(p.xy) * 0.5 + u_time * u_rotationSpeed * 0.3;
                
                // Klein bottle surface calculation
                float r = 2.0 + cos(u * 2.0);
                vec3 klein = vec3(
                    r * cos(u) * cos(v),
                    r * sin(u) * cos(v),
                    sin(u) * sin(v) + cos(u) * sin(2.0 * v)
                );
                
                float dist = length(p - klein * 0.3);
                float lattice3D = 1.0 - smoothstep(0.0, dynamicThickness, dist);
                
                // Add topology flow lines
                float flow = sin(u * density) * cos(v * density) * sin((u + v) * density * 0.5);
                lattice3D = max(lattice3D, 1.0 - smoothstep(0.0, dynamicThickness * 0.5, abs(flow * 0.1)));
                
                // 4D extension
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D Klein bottle coordinate
                    float w_coord = sin(u * 3.0 + v * 2.0 + u_time * 0.6)
                                  * cos(length(p) * 2.0 - u_time * 0.4)
                                  * dim_factor * (0.5 + u_morphFactor * 0.5 + u_audioHigh * 0.4);
                    
                    vec4 p4d = vec4(p, w_coord);
                    
                    // 4D rotation for Klein bottle
                    float baseSpeed = u_rotationSpeed * 0.7;
                    p4d = rotXW(u_time * 0.35 * baseSpeed) * rotYW(u_time * 0.25 * baseSpeed) * rotZW(u_time * 0.3 * baseSpeed) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D Klein bottle calculation
                    float u4d = atan(projectedP.y, projectedP.x) + u_time * u_rotationSpeed * 0.5;
                    float v4d = length(projectedP.xy) * 0.5 + u_time * u_rotationSpeed * 0.3;
                    
                    float r4d = 2.0 + cos(u4d * 2.0);
                    vec3 klein4d = vec3(
                        r4d * cos(u4d) * cos(v4d),
                        r4d * sin(u4d) * cos(v4d),
                        sin(u4d) * sin(v4d) + cos(u4d) * sin(2.0 * v4d)
                    );
                    
                    float dist4d = length(projectedP - klein4d * 0.3);
                    float lattice4D_proj = 1.0 - smoothstep(0.0, dynamicThickness, dist4d);
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🌿 EXTENDED GEOMETRY 6: FRACTAL GEOMETRY
// ============================================================================

class FractalGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('fractal');
        
        this.parameterRanges = {
            ...this.getParameterRanges(),
            fractalDepth: { min: 2, max: 8, default: 4 },
            fractalScale: { min: 1.5, max: 3.0, default: 2.0 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                // Recursive fractal structure
                float density = max(0.1, u_gridDensity * 0.6 * (1.0 + u_audioBass * 0.7));
                float dynamicThickness = max(0.01, u_lineThickness * (1.0 + u_audioMid * 1.5));
                
                vec3 pos = p * density;
                float scale = 2.0;
                float fractal = 0.0;
                
                // Recursive fractal calculation (4 iterations)
                for (int i = 0; i < 4; i++) {
                    pos = abs(pos) - 1.0;
                    float r2 = dot(pos, pos);
                    
                    if (r2 < 1.0) {
                        pos *= 1.0 / r2;
                        scale *= 1.0 / r2;
                    }
                    
                    pos = pos * scale + p * density;
                    scale *= 2.0 + sin(u_time * u_rotationSpeed + float(i)) * 0.1;
                    
                    // Add time-based morphing
                    pos += sin(pos * 0.5 + u_time * u_rotationSpeed * 0.1) * 0.1;
                }
                
                float dist = length(pos) / scale;
                float lattice3D = 1.0 - smoothstep(0.0, dynamicThickness, dist);
                
                // 4D extension
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D fractal coordinate
                    float w_coord = sin(length(p) * 4.0 + u_time * 0.5)
                                  * cos(dot(p, vec3(1.1, 1.3, 0.9)) * 3.0 - u_time * 0.3)
                                  * dim_factor * (0.4 + u_morphFactor * 0.6 + u_audioHigh * 0.6);
                    
                    vec4 p4d = vec4(p, w_coord);
                    
                    // 4D rotation for fractal
                    float baseSpeed = u_rotationSpeed * 1.2;
                    p4d = rotXW(u_time * 0.4 * baseSpeed) * rotYZ(u_time * 0.35 * baseSpeed) * rotZW(u_time * 0.3 * baseSpeed) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D fractal calculation
                    vec3 pos4d = projectedP * density;
                    float scale4d = 2.0;
                    
                    for (int i = 0; i < 4; i++) {
                        pos4d = abs(pos4d) - 1.0;
                        float r2_4d = dot(pos4d, pos4d);
                        
                        if (r2_4d < 1.0) {
                            pos4d *= 1.0 / r2_4d;
                            scale4d *= 1.0 / r2_4d;
                        }
                        
                        pos4d = pos4d * scale4d + projectedP * density;
                        scale4d *= 2.0 + sin(u_time * u_rotationSpeed + float(i)) * 0.1;
                        pos4d += sin(pos4d * 0.5 + u_time * u_rotationSpeed * 0.1) * 0.1;
                    }
                    
                    float dist4d = length(pos4d) / scale4d;
                    float lattice4D_proj = 1.0 - smoothstep(0.0, dynamicThickness, dist4d);
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🌊 EXTENDED GEOMETRY 7: WAVE GEOMETRY
// ============================================================================

class WaveGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('wave');
        
        this.parameterRanges = {
            ...this.getParameterRanges(),
            waveFrequency: { min: 0.5, max: 4.0, default: 2.0 },
            waveAmplitude: { min: 0.1, max: 1.0, default: 0.5 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                // Probability wave function calculation
                float density = max(0.1, u_gridDensity * 0.9 * (1.0 + u_audioBass * 0.8));
                float dynamicThickness = max(0.005, u_lineThickness * (1.0 + u_audioMid * 1.0));
                
                // Multiple wave interference patterns
                float freq1 = 2.0 + u_audioHigh * 2.0;
                float freq2 = 1.5 + u_audioMid * 1.5;
                float freq3 = 3.0 + u_audioBass * 1.0;
                
                float wave1 = sin(p.x * freq1 + u_time * u_rotationSpeed * 2.0) 
                            * cos(p.y * freq1 + u_time * u_rotationSpeed * 1.5);
                            
                float wave2 = sin(p.y * freq2 + u_time * u_rotationSpeed * 1.8) 
                            * cos(p.z * freq2 + u_time * u_rotationSpeed * 1.2);
                            
                float wave3 = sin(p.z * freq3 + u_time * u_rotationSpeed * 2.2) 
                            * cos(p.x * freq3 + u_time * u_rotationSpeed * 1.7);
                
                // Wave interference
                float interference = (wave1 + wave2 + wave3) / 3.0;
                float probability = abs(interference);
                
                float lattice3D = smoothstep(0.5 - dynamicThickness, 0.5 + dynamicThickness, probability);
                
                // 4D extension
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D wave coordinate
                    float w_coord = sin(dot(p, vec3(1.2, 0.8, 1.5)) * 2.0 + u_time * 0.7)
                                  * cos(length(p) * 1.8 - u_time * 0.5)
                                  * dim_factor * (0.5 + u_morphFactor * 0.5 + u_audioHigh * 0.5);
                    
                    vec4 p4d = vec4(p, w_coord);
                    
                    // 4D rotation for wave
                    float baseSpeed = u_rotationSpeed * 0.8;
                    p4d = rotXW(u_time * 0.3 * baseSpeed) * rotYW(u_time * 0.4 * baseSpeed) * rotYZ(u_time * 0.25 * baseSpeed) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D wave calculation
                    float wave1_4d = sin(projectedP.x * freq1 + u_time * u_rotationSpeed * 2.0) 
                                    * cos(projectedP.y * freq1 + u_time * u_rotationSpeed * 1.5);
                                    
                    float wave2_4d = sin(projectedP.y * freq2 + u_time * u_rotationSpeed * 1.8) 
                                    * cos(projectedP.z * freq2 + u_time * u_rotationSpeed * 1.2);
                                    
                    float wave3_4d = sin(projectedP.z * freq3 + u_time * u_rotationSpeed * 2.2) 
                                    * cos(projectedP.x * freq3 + u_time * u_rotationSpeed * 1.7);
                    
                    float interference4d = (wave1_4d + wave2_4d + wave3_4d) / 3.0;
                    float probability4d = abs(interference4d);
                    
                    float lattice4D_proj = smoothstep(0.5 - dynamicThickness, 0.5 + dynamicThickness, probability4d);
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 💎 EXTENDED GEOMETRY 8: CRYSTAL GEOMETRY
// ============================================================================

class CrystalGeometry extends window.VIB34D_Phase1.BaseGeometry {
    constructor() {
        super('crystal');
        
        this.parameterRanges = {
            ...this.getParameterRanges(),
            crystalScale: { min: 0.5, max: 2.0, default: 1.0 },
            crystalComplexity: { min: 1, max: 6, default: 3 }
        };
    }
    
    updateParameters(newParams) {
        const validated = this.validateParameters(newParams);
        Object.assign(this.parameters, validated);
    }
    
    getShaderCode() {
        return `
            float calculateLattice(vec3 p) {
                // Ordered crystalline lattice structure
                float density = max(0.1, u_gridDensity * 1.1 * (1.0 + u_audioBass * 0.4));
                float dynamicThickness = max(0.003, u_lineThickness * (1.0 - u_audioMid * 0.5));
                
                // Crystal lattice with multiple scales
                vec3 p1 = fract(p * density * 0.5 + u_time * 0.02) - 0.5;
                vec3 p2 = fract(p * density * 0.25 + u_time * 0.01) - 0.5;
                vec3 p3 = fract(p * density * 0.125 + u_time * 0.005) - 0.5;
                
                // Multiple crystal face orientations
                float face1 = abs(dot(p1, normalize(vec3(1, 1, 0))));
                float face2 = abs(dot(p1, normalize(vec3(1, 0, 1))));
                float face3 = abs(dot(p1, normalize(vec3(0, 1, 1))));
                float face4 = abs(dot(p2, normalize(vec3(1, 1, 1))));
                
                float minFace = min(min(face1, face2), min(face3, face4));
                float lattice3D = 1.0 - smoothstep(0.0, dynamicThickness, minFace);
                
                // Add crystal defects and grain boundaries
                float defects = sin(length(p3) * 20.0 + u_time * u_rotationSpeed) * 0.1;
                lattice3D = max(lattice3D, 1.0 - smoothstep(0.0, dynamicThickness * 2.0, abs(defects)));
                
                // 4D extension
                float finalLattice = lattice3D;
                float dim_factor = smoothstep(3.0, 4.5, u_dimension);
                
                if (dim_factor > 0.01) {
                    // 4D crystal coordinate
                    float w_coord = cos(length(p) * 3.0 + u_time * 0.4)
                                  * sin(dot(p, vec3(1.0, 1.0, 1.0)) * 2.5 - u_time * 0.3)
                                  * dim_factor * (0.3 + u_morphFactor * 0.7 + u_audioHigh * 0.3);
                    
                    vec4 p4d = vec4(p, w_coord);
                    
                    // 4D rotation for crystal
                    float baseSpeed = u_rotationSpeed * 0.6;
                    p4d = rotXW(u_time * 0.2 * baseSpeed) * rotYZ(u_time * 0.25 * baseSpeed) * rotZW(u_time * 0.15 * baseSpeed) * p4d;
                    
                    vec3 projectedP = project4Dto3D(p4d);
                    
                    // 4D crystal calculation
                    vec3 p1_4d = fract(projectedP * density * 0.5 + u_time * 0.02) - 0.5;
                    vec3 p2_4d = fract(projectedP * density * 0.25 + u_time * 0.01) - 0.5;
                    
                    float face1_4d = abs(dot(p1_4d, normalize(vec3(1, 1, 0))));
                    float face2_4d = abs(dot(p1_4d, normalize(vec3(1, 0, 1))));
                    float face3_4d = abs(dot(p1_4d, normalize(vec3(0, 1, 1))));
                    float face4_4d = abs(dot(p2_4d, normalize(vec3(1, 1, 1))));
                    
                    float minFace4d = min(min(face1_4d, face2_4d), min(face3_4d, face4_4d));
                    float lattice4D_proj = 1.0 - smoothstep(0.0, dynamicThickness, minFace4d);
                    
                    finalLattice = mix(lattice3D, lattice4D_proj, smoothstep(0.0, 1.0, u_morphFactor));
                }
                
                return pow(max(0.0, finalLattice), max(0.1, u_universeModifier));
            }
        `;
    }
}

// ============================================================================
// 🎯 GEOMETRY REGISTRATION AND INITIALIZATION
// ============================================================================

class VIB34DGeometryRegistry {
    static initializeAllGeometries(geometryManager) {
        console.log('🎨 Registering all 8 VIB34D geometries...');
        
        // Register Core 3 Geometries
        geometryManager.registerGeometry('hypercube', new HypercubeGeometry());
        geometryManager.registerGeometry('hypersphere', new HypersphereGeometry());
        geometryManager.registerGeometry('hypertetrahedron', new HypertetrahedronGeometry());
        
        // Register Extended 5 Geometries
        geometryManager.registerGeometry('torus', new TorusGeometry());
        geometryManager.registerGeometry('klein', new KleinBottleGeometry());
        geometryManager.registerGeometry('fractal', new FractalGeometry());
        geometryManager.registerGeometry('wave', new WaveGeometry());
        geometryManager.registerGeometry('crystal', new CrystalGeometry());
        
        console.log(`✅ All ${geometryManager.getGeometryTypes().length} geometries registered successfully`);
        console.log('📐 Available geometries:', geometryManager.getGeometryTypes());
        
        return geometryManager.getGeometryTypes();
    }
    
    static getGeometryThemes() {
        return {
            hypercube: { color: 'magenta', theme: 'Sovereignty', section: 'HOME' },
            hypertetrahedron: { color: 'cyan', theme: 'Precision', section: 'TECH' },
            hypersphere: { color: 'yellow', theme: 'Potential', section: 'MEDIA' },
            torus: { color: 'green', theme: 'Flow', section: 'AUDIO' },
            klein: { color: 'orange', theme: 'Transcendence', section: 'COMMUNITY' },
            fractal: { color: 'purple', theme: 'Emergence', section: 'INNOVATION' },
            wave: { color: 'pink', theme: 'Probability', section: 'RESEARCH' },
            crystal: { color: 'mint', theme: 'Structure', section: 'CONTEXT' }
        };
    }
}

// ============================================================================
// 🎯 EXPORT PHASE 2 GEOMETRY IMPLEMENTATIONS
// ============================================================================

// Export all geometry classes for use in production system
window.VIB34D_Phase2 = {
    // Core 3 Geometries
    HypercubeGeometry,
    HypersphereGeometry,
    HypertetrahedronGeometry,
    
    // Extended 5 Geometries
    TorusGeometry,
    KleinBottleGeometry,
    FractalGeometry,
    WaveGeometry,
    CrystalGeometry,
    
    // Registry utility
    VIB34DGeometryRegistry
};

console.log('✅ VIB34D Phase 2 Geometry Implementations loaded successfully');
console.log('🎨 Available geometries:', Object.keys(window.VIB34D_Phase2).filter(k => k.includes('Geometry')));
console.log('📊 Total geometry classes: 8 complete with full 4D mathematics');