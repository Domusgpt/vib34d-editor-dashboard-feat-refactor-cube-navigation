# Shader Compilation Error Fix

## Error Analysis
```
ERROR: 0:50: '-' : wrong operand types - no operation '-' exists that takes a left-hand operand of type 'varying mediump 3-component vector of float' and a right operand of type 'uniform mediump 2-component vector of float'
```

## Problem
The shader is trying to subtract a `vec2` (2-component) from a `vec3` (3-component) vector, which is invalid in GLSL.

## Common Causes
1. **Mouse position being passed as vec2** but used in vec3 calculations
2. **UV coordinates (vec2) being subtracted from world position (vec3)**
3. **Missing component extension** when converting vec2 to vec3

## Fix Strategies

### Strategy 1: Component Extension
```glsl
// WRONG:
vec3 worldPos = vPosition;
vec2 mousePos = u_mouse;
vec3 diff = worldPos - mousePos; // ERROR!

// RIGHT:
vec3 worldPos = vPosition;
vec2 mousePos = u_mouse;
vec3 diff = worldPos - vec3(mousePos, 0.0); // Fixed!
```

### Strategy 2: Dimension Reduction
```glsl
// WRONG:
vec3 worldPos = vPosition;
vec2 mousePos = u_mouse;
vec3 diff = worldPos - mousePos; // ERROR!

// RIGHT:
vec3 worldPos = vPosition;
vec2 mousePos = u_mouse;
vec2 diff = worldPos.xy - mousePos; // Use only x,y components
```

### Strategy 3: Proper Variable Declaration
```glsl
// Check uniform declarations match usage
uniform vec2 u_mouse;     // If mouse is 2D
uniform vec3 u_mouse;     // If mouse needs 3D

// Check varying declarations
varying vec3 vPosition;   // 3D position
varying vec2 vUv;         // 2D UV coordinates
```

## Implementation
The error is likely in the adaptive card visualizer around line 50 of the fragment shader. Need to check:
1. How `u_mouse` is declared and used
2. How `vPosition` or similar varying is being calculated
3. Whether vec2/vec3 conversions are handled properly