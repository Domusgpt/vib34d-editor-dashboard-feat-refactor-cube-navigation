/**
 * VIB34D CHROMATIC EMERGENCE SYSTEM
 * Dynamic color generation through translucent layer interaction
 * 
 * PRINCIPLE: Colors emerge from overlapping translucent windows
 * - Yellow + Blue = Green emergence
 * - Magenta + Cyan = Blue emergence  
 * - Red + Green = Yellow emergence
 * - Dynamic ranges shift based on interaction intensity
 */

// ============================================================================
// 🎨 VIB34D CHROMATIC ENGINE
// ============================================================================

class VIB34DChromaticEngine {
    constructor() {
        // Base color wheels for each geometry (in HSL for better mixing)
        this.geometryColorWheels = {
            hypercube: {
                primary: { h: 300, s: 100, l: 50 },    // Magenta
                secondary: { h: 180, s: 100, l: 50 },  // Cyan
                range: { hueShift: 30, satRange: 20, lightRange: 20 }
            },
            tetrahedron: {
                primary: { h: 180, s: 100, l: 50 },    // Cyan
                secondary: { h: 60, s: 100, l: 50 },   // Yellow
                range: { hueShift: 20, satRange: 30, lightRange: 15 }
            },
            sphere: {
                primary: { h: 60, s: 100, l: 50 },     // Yellow
                secondary: { h: 240, s: 100, l: 50 },  // Blue
                range: { hueShift: 40, satRange: 25, lightRange: 25 }
            },
            torus: {
                primary: { h: 120, s: 100, l: 50 },    // Green
                secondary: { h: 0, s: 100, l: 50 },    // Red
                range: { hueShift: 25, satRange: 35, lightRange: 20 }
            },
            klein: {
                primary: { h: 30, s: 100, l: 50 },     // Orange
                secondary: { h: 270, s: 100, l: 50 },  // Purple
                range: { hueShift: 35, satRange: 30, lightRange: 30 }
            },
            fractal: {
                primary: { h: 270, s: 100, l: 50 },    // Purple
                secondary: { h: 90, s: 100, l: 50 },   // Green-Yellow
                range: { hueShift: 45, satRange: 40, lightRange: 35 }
            },
            wave: {
                primary: { h: 330, s: 100, l: 50 },    // Pink
                secondary: { h: 150, s: 100, l: 50 },  // Blue-Green
                range: { hueShift: 50, satRange: 30, lightRange: 25 }
            },
            crystal: {
                primary: { h: 165, s: 100, l: 50 },    // Mint
                secondary: { h: 345, s: 100, l: 50 },  // Rose
                range: { hueShift: 30, satRange: 25, lightRange: 20 }
            }
        };
        
        // Chromatic mixing rules for emergent colors
        this.chromaticMixing = {
            // Additive color mixing in light
            'yellow+blue': { h: 120, s: 80, l: 60 },      // Green
            'magenta+cyan': { h: 240, s: 90, l: 55 },     // Blue
            'red+green': { h: 60, s: 85, l: 55 },         // Yellow
            'cyan+yellow': { h: 90, s: 75, l: 60 },       // Lime
            'magenta+yellow': { h: 30, s: 90, l: 55 },    // Orange
            'cyan+magenta': { h: 270, s: 85, l: 50 },     // Purple
            
            // Subtractive mixing variations
            'blue+orange': { h: 180, s: 40, l: 40 },      // Teal gray
            'purple+yellow': { h: 45, s: 60, l: 45 },     // Warm gray
            'green+red': { h: 60, s: 40, l: 40 }          // Olive
        };
        
        // Dynamic range parameters
        this.dynamicRange = {
            hueVelocity: 0,          // How fast hue shifts
            saturationPulse: 0,      // Saturation breathing
            luminanceWave: 0,        // Brightness oscillation
            mixIntensity: 0.5        // Layer mixing strength
        };
        
        this.time = 0;
        this.lastUpdateTime = performance.now();
    }
    
    /**
     * Update chromatic engine with interaction data
     */
    update(interactionData) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
        this.time += deltaTime;
        this.lastUpdateTime = currentTime;
        
        // Map interactions to chromatic dynamics
        this.dynamicRange.hueVelocity = interactionData.scroll.smoothed * 30; // degrees/second
        this.dynamicRange.saturationPulse = interactionData.click.smoothed * 0.3;
        this.dynamicRange.luminanceWave = interactionData.mouse.smoothed * 0.2;
        this.dynamicRange.mixIntensity = 0.3 + interactionData.energy * 0.7;
    }
    
    /**
     * Get dynamic color for a specific geometry and role
     */
    getColorForInstance(geometry, role, modifier = 1.0) {
        const colorWheel = this.geometryColorWheels[geometry];
        if (!colorWheel) return { r: 1.0, g: 1.0, b: 1.0 }; // White fallback
        
        // Base colors with dynamic range applied
        const primary = this.applyDynamicRange(colorWheel.primary, colorWheel.range, role, 0);
        const secondary = this.applyDynamicRange(colorWheel.secondary, colorWheel.range, role, Math.PI);
        
        // Mix based on role and modifier
        const mixRatio = this.calculateMixRatio(role, modifier);
        const mixed = this.mixColorsHSL(primary, secondary, mixRatio);
        
        // Convert to RGB for shader
        return this.hslToRgb(mixed.h, mixed.s, mixed.l);
    }
    
    /**
     * Apply dynamic range to a base color
     */
    applyDynamicRange(baseColor, range, role, phaseOffset) {
        const rolePhaseMod = {
            'background': 0,
            'content': Math.PI * 0.66,
            'accent': Math.PI * 1.33
        };
        
        const phase = this.time + phaseOffset + (rolePhaseMod[role] || 0);
        
        // Hue oscillation
        const hueShift = Math.sin(phase * this.dynamicRange.hueVelocity * 0.1) * range.hueShift;
        
        // Saturation breathing
        const satShift = Math.sin(phase * 2.0 + this.dynamicRange.saturationPulse) * range.satRange;
        
        // Luminance wave
        const lightShift = Math.sin(phase * 1.5 + this.dynamicRange.luminanceWave * Math.PI) * range.lightRange;
        
        return {
            h: (baseColor.h + hueShift + 360) % 360,
            s: Math.max(20, Math.min(100, baseColor.s + satShift)),
            l: Math.max(20, Math.min(80, baseColor.l + lightShift))
        };
    }
    
    /**
     * Calculate mix ratio based on role and modifier
     */
    calculateMixRatio(role, modifier) {
        const baseRatios = {
            'background': 0.3,
            'content': 0.5,
            'accent': 0.7
        };
        
        const baseRatio = baseRatios[role] || 0.5;
        const modifiedRatio = baseRatio * modifier;
        
        // Add oscillation
        const oscillation = Math.sin(this.time * 0.5) * 0.2;
        
        return Math.max(0, Math.min(1, modifiedRatio + oscillation));
    }
    
    /**
     * Mix two HSL colors with proper color emergence
     */
    mixColorsHSL(color1, color2, ratio) {
        // Check for special chromatic mixing cases
        const mixKey = this.getChromicMixKey(color1, color2);
        const specialMix = this.chromaticMixing[mixKey];
        
        if (specialMix && this.dynamicRange.mixIntensity > 0.5) {
            // Use special chromatic mix with dynamic blending
            const standardMix = {
                h: this.circularInterpolate(color1.h, color2.h, ratio),
                s: color1.s * (1 - ratio) + color2.s * ratio,
                l: color1.l * (1 - ratio) + color2.l * ratio
            };
            
            const specialRatio = (this.dynamicRange.mixIntensity - 0.5) * 2; // 0 to 1
            
            return {
                h: this.circularInterpolate(standardMix.h, specialMix.h, specialRatio),
                s: standardMix.s * (1 - specialRatio) + specialMix.s * specialRatio,
                l: standardMix.l * (1 - specialRatio) + specialMix.l * specialRatio
            };
        }
        
        // Standard HSL mixing
        return {
            h: this.circularInterpolate(color1.h, color2.h, ratio),
            s: color1.s * (1 - ratio) + color2.s * ratio,
            l: color1.l * (1 - ratio) + color2.l * ratio
        };
    }
    
    /**
     * Get chromatic mix key for special color emergence
     */
    getChromicMixKey(color1, color2) {
        // Simplified color classification
        const classifyHue = (h) => {
            if (h >= 45 && h < 75) return 'yellow';
            if (h >= 165 && h < 195) return 'cyan';
            if (h >= 285 && h < 315) return 'magenta';
            if (h >= 225 && h < 255) return 'blue';
            if (h >= 105 && h < 135) return 'green';
            if (h >= 345 || h < 15) return 'red';
            if (h >= 15 && h < 45) return 'orange';
            if (h >= 255 && h < 285) return 'purple';
            return null;
        };
        
        const class1 = classifyHue(color1.h);
        const class2 = classifyHue(color2.h);
        
        if (class1 && class2) {
            const key1 = `${class1}+${class2}`;
            const key2 = `${class2}+${class1}`;
            
            return this.chromaticMixing[key1] ? key1 : key2;
        }
        
        return null;
    }
    
    /**
     * Circular interpolation for hue values
     */
    circularInterpolate(h1, h2, ratio) {
        const diff = h2 - h1;
        
        if (diff > 180) {
            h2 -= 360;
        } else if (diff < -180) {
            h2 += 360;
        }
        
        let result = h1 + (h2 - h1) * ratio;
        
        if (result < 0) result += 360;
        if (result >= 360) result -= 360;
        
        return result;
    }
    
    /**
     * Convert HSL to RGB
     */
    hslToRgb(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // Achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return { r, g, b };
    }
    
    /**
     * Get chromatic blend mode for overlapping instances
     */
    getChromaticBlendMode(role1, role2) {
        // Define how different layer roles should blend
        const blendMatrix = {
            'background+content': 'multiply',
            'content+accent': 'screen',
            'background+accent': 'overlay',
            'content+content': 'soft-light',
            'accent+accent': 'color-dodge'
        };
        
        const key = `${role1}+${role2}`;
        return blendMatrix[key] || 'normal';
    }
    
    /**
     * Calculate emergent color from multiple overlapping instances
     */
    calculateEmergentColor(instances) {
        if (instances.length === 0) return { r: 0, g: 0, b: 0 };
        if (instances.length === 1) return instances[0].color;
        
        // Sort by z-index
        instances.sort((a, b) => a.zIndex - b.zIndex);
        
        // Start with the bottom layer
        let resultColor = { ...instances[0].color };
        
        // Blend each subsequent layer
        for (let i = 1; i < instances.length; i++) {
            const layer = instances[i];
            const blendMode = this.getChromaticBlendMode(instances[i-1].role, layer.role);
            
            resultColor = this.blendColors(resultColor, layer.color, layer.opacity, blendMode);
        }
        
        return resultColor;
    }
    
    /**
     * Blend two colors based on blend mode
     */
    blendColors(base, blend, opacity, mode) {
        const apply = (baseVal, blendVal, blendFunc) => {
            const blended = blendFunc(baseVal, blendVal);
            return baseVal * (1 - opacity) + blended * opacity;
        };
        
        switch (mode) {
            case 'multiply':
                return {
                    r: apply(base.r, blend.r, (b, t) => b * t),
                    g: apply(base.g, blend.g, (b, t) => b * t),
                    b: apply(base.b, blend.b, (b, t) => b * t)
                };
                
            case 'screen':
                return {
                    r: apply(base.r, blend.r, (b, t) => 1 - (1 - b) * (1 - t)),
                    g: apply(base.g, blend.g, (b, t) => 1 - (1 - b) * (1 - t)),
                    b: apply(base.b, blend.b, (b, t) => 1 - (1 - b) * (1 - t))
                };
                
            case 'overlay':
                const overlay = (b, t) => b < 0.5 ? 2 * b * t : 1 - 2 * (1 - b) * (1 - t);
                return {
                    r: apply(base.r, blend.r, overlay),
                    g: apply(base.g, blend.g, overlay),
                    b: apply(base.b, blend.b, overlay)
                };
                
            case 'soft-light':
                const softLight = (b, t) => t < 0.5 
                    ? b * (1 + t) 
                    : b + t - b * t;
                return {
                    r: apply(base.r, blend.r, softLight),
                    g: apply(base.g, blend.g, softLight),
                    b: apply(base.b, blend.b, softLight)
                };
                
            case 'color-dodge':
                const dodge = (b, t) => t === 1 ? 1 : Math.min(1, b / (1 - t));
                return {
                    r: apply(base.r, blend.r, dodge),
                    g: apply(base.g, blend.g, dodge),
                    b: apply(base.b, blend.b, dodge)
                };
                
            default: // normal
                return {
                    r: apply(base.r, blend.r, (b, t) => t),
                    g: apply(base.g, blend.g, (b, t) => t),
                    b: apply(base.b, blend.b, (b, t) => t)
                };
        }
    }
}

// ============================================================================
// 🎨 ENHANCED VIB34D CORE WITH CHROMATIC SYSTEM
// ============================================================================

class VIB34DCoreChromatic extends VIB34DCore {
    constructor(canvas, options = {}) {
        super(canvas, options);
        
        this.chromaticEngine = options.chromaticEngine || new VIB34DChromaticEngine();
        
        // Enhanced state for chromatic system
        this.state.chromaticParams = {
            colorEmergence: 1.0,      // How much colors emerge from mixing
            chromaticShift: 0.0,      // Global chromatic shift
            layerBlending: 1.0,       // Layer blending intensity
            spectralSpread: 0.5       // How spread out colors are in spectrum
        };
    }
    
    updateFromInteractionEngine(interactionData) {
        super.updateFromInteractionEngine(interactionData);
        
        // Update chromatic engine
        this.chromaticEngine.update(interactionData);
        
        // Get dynamic colors for this instance
        const dynamicColors = this.chromaticEngine.getColorForInstance(
            this.currentGeometry,
            this.instanceRole,
            this.parameterModifier
        );
        
        // Update shader colors
        this.state.primaryColor = [dynamicColors.r, dynamicColors.g, dynamicColors.b];
        
        // Calculate secondary color with phase shift
        const secondaryColors = this.chromaticEngine.getColorForInstance(
            this.currentGeometry,
            this.instanceRole,
            this.parameterModifier * 1.5 // Different modifier for variety
        );
        
        this.state.secondaryColor = [secondaryColors.r, secondaryColors.g, secondaryColors.b];
        
        // Update chromatic parameters based on interaction
        this.state.chromaticParams.colorEmergence = 0.5 + interactionData.pattern.complexity * 0.5;
        this.state.chromaticParams.chromaticShift = 
            Math.sin(performance.now() * 0.001) * interactionData.mouse.smoothed * 0.3;
        this.state.chromaticParams.layerBlending = 0.7 + interactionData.energy * 0.3;
        this.state.chromaticParams.spectralSpread = 0.3 + interactionData.exploration * 0.7;
    }
    
    getEnhancedFragmentShader() {
        return `
            precision highp float;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec3 u_primaryColor;
            uniform vec3 u_secondaryColor;
            uniform vec3 u_backgroundColor;
            uniform float u_colorEmergence;
            uniform float u_chromaticShift;
            uniform float u_layerBlending;
            uniform float u_spectralSpread;
            
            // Include geometry-specific calculation
            ${this.geometryShaders[this.currentGeometry]}
            
            // Chromatic emergence functions
            vec3 chromaticMix(vec3 color1, vec3 color2, float ratio) {
                // Convert RGB to HSL for better mixing
                vec3 hsl1 = rgb2hsl(color1);
                vec3 hsl2 = rgb2hsl(color2);
                
                // Check for emergent color conditions
                float hueDiff = abs(hsl1.x - hsl2.x);
                if (hueDiff > 0.5) hueDiff = 1.0 - hueDiff; // Wrap around
                
                // Emergent color calculation
                vec3 emergent = hsl1;
                
                // Yellow + Blue = Green
                if (isYellow(hsl1) && isBlue(hsl2) || isBlue(hsl1) && isYellow(hsl2)) {
                    emergent.x = 0.33; // Green hue
                    emergent.y = mix(hsl1.y, hsl2.y, 0.5) * 1.2; // Boost saturation
                }
                // Magenta + Cyan = Blue
                else if (isMagenta(hsl1) && isCyan(hsl2) || isCyan(hsl1) && isMagenta(hsl2)) {
                    emergent.x = 0.67; // Blue hue
                    emergent.y = mix(hsl1.y, hsl2.y, 0.5) * 1.1;
                }
                // Red + Green = Yellow
                else if (isRed(hsl1) && isGreen(hsl2) || isGreen(hsl1) && isRed(hsl2)) {
                    emergent.x = 0.17; // Yellow hue
                    emergent.y = mix(hsl1.y, hsl2.y, 0.5) * 1.15;
                }
                else {
                    // Standard HSL interpolation
                    emergent = mix(hsl1, hsl2, ratio);
                }
                
                // Apply chromatic emergence factor
                vec3 standard = mix(hsl1, hsl2, ratio);
                vec3 result = mix(standard, emergent, u_colorEmergence);
                
                return hsl2rgb(result);
            }
            
            // Color classification helpers
            bool isYellow(vec3 hsl) { return hsl.x > 0.125 && hsl.x < 0.208; }
            bool isBlue(vec3 hsl) { return hsl.x > 0.583 && hsl.x < 0.694; }
            bool isMagenta(vec3 hsl) { return hsl.x > 0.792 && hsl.x < 0.875; }
            bool isCyan(vec3 hsl) { return hsl.x > 0.458 && hsl.x < 0.542; }
            bool isRed(vec3 hsl) { return hsl.x < 0.042 || hsl.x > 0.958; }
            bool isGreen(vec3 hsl) { return hsl.x > 0.292 && hsl.x < 0.375; }
            
            // RGB to HSL conversion
            vec3 rgb2hsl(vec3 rgb) {
                float maxVal = max(rgb.r, max(rgb.g, rgb.b));
                float minVal = min(rgb.r, min(rgb.g, rgb.b));
                float diff = maxVal - minVal;
                
                vec3 hsl = vec3(0.0, 0.0, (maxVal + minVal) / 2.0);
                
                if (diff > 0.0001) {
                    hsl.y = hsl.z < 0.5 
                        ? diff / (maxVal + minVal) 
                        : diff / (2.0 - maxVal - minVal);
                    
                    if (maxVal == rgb.r) {
                        hsl.x = (rgb.g - rgb.b) / diff + (rgb.g < rgb.b ? 6.0 : 0.0);
                    } else if (maxVal == rgb.g) {
                        hsl.x = (rgb.b - rgb.r) / diff + 2.0;
                    } else {
                        hsl.x = (rgb.r - rgb.g) / diff + 4.0;
                    }
                    
                    hsl.x /= 6.0;
                }
                
                return hsl;
            }
            
            // HSL to RGB conversion
            vec3 hsl2rgb(vec3 hsl) {
                vec3 rgb;
                
                if (hsl.y == 0.0) {
                    rgb = vec3(hsl.z);
                } else {
                    float q = hsl.z < 0.5 
                        ? hsl.z * (1.0 + hsl.y) 
                        : hsl.z + hsl.y - hsl.z * hsl.y;
                    float p = 2.0 * hsl.z - q;
                    
                    rgb.r = hue2rgb(p, q, hsl.x + 1.0/3.0);
                    rgb.g = hue2rgb(p, q, hsl.x);
                    rgb.b = hue2rgb(p, q, hsl.x - 1.0/3.0);
                }
                
                return rgb;
            }
            
            float hue2rgb(float p, float q, float t) {
                if (t < 0.0) t += 1.0;
                if (t > 1.0) t -= 1.0;
                if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
                if (t < 1.0/2.0) return q;
                if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
                return p;
            }
            
            // Spectral spread function
            vec3 applySpectralSpread(vec3 color, float spread, vec2 position) {
                vec3 hsl = rgb2hsl(color);
                
                // Create position-based hue variation
                float positionInfluence = sin(position.x * 3.14159) * cos(position.y * 3.14159);
                hsl.x = mod(hsl.x + positionInfluence * spread * 0.1 + u_chromaticShift, 1.0);
                
                // Saturation waves
                hsl.y *= 0.8 + 0.2 * sin(u_time * 2.0 + position.x * 10.0);
                
                return hsl2rgb(hsl);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                
                // Get base lattice value from geometry
                vec3 p = vec3((uv - 0.5) * 2.0, 0.0);
                float latticeValue = calculateLattice(p);
                
                // Calculate chromatic color based on position and lattice
                float mixRatio = latticeValue * u_spectralSpread + (1.0 - u_spectralSpread) * 0.5;
                vec3 baseColor = chromaticMix(u_primaryColor, u_secondaryColor, mixRatio);
                
                // Apply spectral spread
                baseColor = applySpectralSpread(baseColor, u_spectralSpread, uv);
                
                // Layer blending for translucent effect
                vec3 backgroundColor = u_backgroundColor * (1.0 - latticeValue * u_layerBlending);
                vec3 finalColor = mix(backgroundColor, baseColor, latticeValue * u_layerBlending);
                
                // Chromatic aberration based on interaction
                vec2 rOffset = vec2(u_chromaticShift * 0.01, 0.0);
                vec2 bOffset = vec2(-u_chromaticShift * 0.01, 0.0);
                
                float rLattice = calculateLattice(vec3((uv + rOffset - 0.5) * 2.0, 0.0));
                float bLattice = calculateLattice(vec3((uv + bOffset - 0.5) * 2.0, 0.0));
                
                finalColor.r = mix(finalColor.r, baseColor.r, rLattice * 0.2);
                finalColor.b = mix(finalColor.b, baseColor.b, bLattice * 0.2);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
    }
}

// ============================================================================
// 🎨 ENHANCED MULTI-INSTANCE WITH CHROMATIC BLENDING
// ============================================================================

class VIB34DMultiInstanceChromatic extends VIB34DMultiInstance {
    constructor(container, sectionKey, options = {}) {
        super(container, sectionKey, options);
        
        // Shared chromatic engine for all instances
        this.chromaticEngine = new VIB34DChromaticEngine();
        
        // Canvas blend modes for CSS
        this.setupChromaticBlending();
    }
    
    createInstances() {
        // Create chromatic engine first
        this.chromaticEngine = new VIB34DChromaticEngine();
        
        Object.entries(this.config.instanceTemplates).forEach(([role, template]) => {
            const canvas = document.createElement('canvas');
            canvas.className = `vib34d-instance vib34d-${role}`;
            
            // Enhanced styling for chromatic blending
            canvas.style.cssText = `
                position: absolute;
                top: 0; left: 0; 
                width: 100%; height: 100%;
                opacity: ${template.opacity};
                z-index: ${template.zIndex};
                pointer-events: none;
                mix-blend-mode: ${this.getBlendModeForRole(role)};
            `;
            
            this.container.appendChild(canvas);
            
            // Use enhanced chromatic core
            const instance = new VIB34DCoreChromatic(canvas, {
                instanceId: `${this.sectionKey}-${role}`,
                role: template.role,
                modifier: template.modifier,
                geometry: this.config.geometryType,
                chromaticEngine: this.chromaticEngine // Share engine
            });
            
            this.instances.set(role, instance);
        });
    }
    
    getBlendModeForRole(role) {
        const blendModes = {
            'background': 'multiply',
            'content': 'screen',
            'accent': 'overlay'
        };
        
        return blendModes[role] || 'normal';
    }
    
    setupChromaticBlending() {
        // Add CSS for enhanced blending effects
        const style = document.createElement('style');
        style.textContent = `
            .vib34d-instance {
                transition: opacity 0.3s ease;
            }
            
            .vib34d-background {
                filter: saturate(1.2) hue-rotate(var(--chromatic-shift, 0deg));
            }
            
            .vib34d-content {
                filter: contrast(1.1) brightness(1.05);
            }
            
            .vib34d-accent {
                filter: saturate(1.3) contrast(1.2);
                animation: chromaticPulse 4s ease-in-out infinite;
            }
            
            @keyframes chromaticPulse {
                0%, 100% { filter: saturate(1.3) contrast(1.2) hue-rotate(0deg); }
                50% { filter: saturate(1.5) contrast(1.3) hue-rotate(10deg); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    updateFromInteraction(interactionData) {
        if (!this.isActive) return;
        
        // Update chromatic engine first
        this.chromaticEngine.update(interactionData);
        
        // Update all instances
        super.updateFromInteraction(interactionData);
        
        // Apply dynamic CSS variables based on interaction
        this.container.style.setProperty(
            '--chromatic-shift', 
            `${interactionData.mouse.smoothed * 30}deg`
        );
    }
    
    /**
     * Calculate emergent color at a specific screen position
     */
    getEmergentColorAt(x, y) {
        const instanceData = [];
        
        this.instances.forEach((instance, role) => {
            const template = this.config.instanceTemplates[role];
            const color = this.chromaticEngine.getColorForInstance(
                instance.currentGeometry,
                role,
                instance.parameterModifier
            );
            
            instanceData.push({
                color,
                opacity: template.opacity,
                zIndex: template.zIndex,
                role
            });
        });
        
        return this.chromaticEngine.calculateEmergentColor(instanceData);
    }
}

// Export enhanced chromatic system
export { VIB34DChromaticEngine, VIB34DCoreChromatic, VIB34DMultiInstanceChromatic };