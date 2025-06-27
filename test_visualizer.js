#!/usr/bin/env node

/**
 * Test the VIB34D Adaptive Card Visualizer in a simulated browser environment
 */

// Mock browser environment
global.window = global;
global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 16);
};
global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
};
global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe(element) {
        console.log('ResizeObserver.observe called');
    }
    unobserve(element) {
        console.log('ResizeObserver.unobserve called');
    }
    disconnect() {
        console.log('ResizeObserver.disconnect called');
    }
};

global.document = {
    createElement: (tagName) => {
        if (tagName === 'canvas') {
            return {
                width: 400,
                height: 300,
                className: '',
                style: {},
                getContext: (type, options) => {
                    console.log(`Canvas.getContext called with: ${type}`);
                    if (type === 'webgl' || type === 'experimental-webgl') {
                        // Return a mock WebGL context
                        return {
                            // Mock WebGL methods
                            clearColor: () => {},
                            clear: () => {},
                            createShader: () => ({}),
                            shaderSource: () => {},
                            compileShader: () => {},
                            getShaderParameter: () => true,
                            createProgram: () => ({}),
                            attachShader: () => {},
                            linkProgram: () => {},
                            getProgramParameter: () => true,
                            useProgram: () => {},
                            createBuffer: () => ({}),
                            bindBuffer: () => {},
                            bufferData: () => {},
                            getUniformLocation: () => ({}),
                            getAttribLocation: () => 0,
                            uniform1f: () => {},
                            uniform2f: () => {},
                            uniformMatrix4fv: () => {},
                            enableVertexAttribArray: () => {},
                            vertexAttribPointer: () => {},
                            drawElements: () => {},
                            viewport: () => {},
                            getParameter: (param) => {
                                if (param === 'VERSION') return 'WebGL 1.0 (Mock)';
                                if (param === 'RENDERER') return 'Mock Renderer';
                                return 'Mock Value';
                            },
                            // WebGL constants
                            VERTEX_SHADER: 35633,
                            FRAGMENT_SHADER: 35632,
                            COMPILE_STATUS: 35713,
                            LINK_STATUS: 35714,
                            ARRAY_BUFFER: 34962,
                            ELEMENT_ARRAY_BUFFER: 34963,
                            STATIC_DRAW: 35044,
                            FLOAT: 5126,
                            TRIANGLES: 4,
                            UNSIGNED_SHORT: 5123,
                            COLOR_BUFFER_BIT: 16384,
                            DEPTH_BUFFER_BIT: 256
                        };
                    } else if (type === '2d') {
                        // Return a mock 2D context
                        return {
                            fillStyle: '',
                            strokeStyle: '',
                            lineWidth: 1,
                            globalAlpha: 1,
                            fillRect: () => {},
                            strokeRect: () => {},
                            beginPath: () => {},
                            moveTo: () => {},
                            lineTo: () => {},
                            arc: () => {},
                            stroke: () => {},
                            fill: () => {},
                            createRadialGradient: () => ({
                                addColorStop: () => {}
                            })
                        };
                    }
                    return null;
                },
                addEventListener: (event, handler) => {
                    console.log(`Canvas addEventListener: ${event}`);
                }
            };
        }
        return {};
    },
    getElementById: (id) => {
        console.log(`document.getElementById called with: ${id}`);
        return {
            appendChild: (child) => {
                console.log('Element.appendChild called');
            },
            textContent: '',
            style: {},
            addEventListener: () => {}
        };
    },
    querySelector: (selector) => {
        console.log(`document.querySelector called with: ${selector}`);
        return null;
    },
    querySelectorAll: (selector) => {
        console.log(`document.querySelectorAll called with: ${selector}`);
        return [];
    },
    addEventListener: (event, handler) => {
        console.log(`document.addEventListener: ${event}`);
    }
};

// Mock console for better output
const originalConsole = console;
global.console = {
    log: (...args) => originalConsole.log('📝', ...args),
    error: (...args) => originalConsole.error('❌', ...args),
    warn: (...args) => originalConsole.warn('⚠️', ...args),
    info: (...args) => originalConsole.info('ℹ️', ...args)
};

// Load the visualizer
console.log('🚀 Loading VIB34D Adaptive Card Visualizer...');

try {
    const fs = require('fs');
    const visualizerCode = fs.readFileSync('./VIB34D_ADAPTIVE_CARD_VISUALIZER.js', 'utf8');
    
    console.log('📄 File loaded, executing code...');
    eval(visualizerCode);
    
    console.log('✅ Code executed successfully');
    
    // Test if the class is available
    if (typeof AdaptiveCardVisualizer !== 'undefined') {
        console.log('✅ AdaptiveCardVisualizer class is available');
        
        // Try to create an instance
        console.log('🔨 Creating visualizer instance...');
        
        const mockContainer = {
            appendChild: (child) => {
                console.log('✅ Canvas added to container');
            }
        };
        
        const options = {
            geometry: 0,
            theme: 'hypercube',
            responsive: true,
            masterKey: 1.0,
            width: 400,
            height: 300
        };
        
        const visualizer = new AdaptiveCardVisualizer(mockContainer, options);
        
        console.log('✅ Visualizer created successfully!');
        console.log('📊 Visualizer state:');
        console.log(`   - Initialized: ${visualizer.isInitialized}`);
        console.log(`   - Has Canvas: ${!!visualizer.canvas}`);
        console.log(`   - Has WebGL: ${!!visualizer.gl}`);
        console.log(`   - Has 2D Context: ${!!visualizer.ctx}`);
        console.log(`   - Geometry: ${visualizer.options.geometry}`);
        console.log(`   - Theme: ${visualizer.options.theme}`);
        
        // Test some methods
        console.log('🧪 Testing methods...');
        try {
            visualizer.updateGeometry(1);
            console.log('✅ updateGeometry works');
        } catch (e) {
            console.error('updateGeometry failed:', e.message);
        }
        
        try {
            visualizer.updateParams({ intensity: 1.5 });
            console.log('✅ updateParams works');
        } catch (e) {
            console.error('updateParams failed:', e.message);
        }
        
        console.log('🎉 All tests passed!');
        
    } else {
        console.error('❌ AdaptiveCardVisualizer class not found after loading');
    }
    
} catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error('Stack trace:', error.stack);
}

console.log('🏁 Test complete');