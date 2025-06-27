/**
 * Debug script to test VIB34D demo components
 */

// Check if running in browser or Node.js
if (typeof window === 'undefined') {
    // Node.js environment - use jsdom
    const jsdom = require('jsdom');
    const fs = require('fs');
    
    console.log('🔍 Loading demo HTML...');
    const html = fs.readFileSync('VIB34D_PHASE1_INTEGRATED_DEMO.html', 'utf8');
    
    const dom = new jsdom.JSDOM(html, {
        url: 'http://localhost:8000/',
        resources: 'usable',
        runScripts: 'dangerously'
    });
    
    global.window = dom.window;
    global.document = dom.window.document;
} else {
    // Browser environment
    console.log('🌐 Running in browser environment');
}

function debugDemo() {
    console.log('=== VIB34D Demo Debug ===');
    
    // Check 1: Working Core Architecture
    console.log('1. Working Core Architecture:', typeof window.VIB34D_WorkingCore);
    if (window.VIB34D_WorkingCore) {
        console.log('   Available classes:', Object.keys(window.VIB34D_WorkingCore));
    }
    
    // Check 2: Central State Manager
    console.log('2. Central State Manager:', typeof window.VIB34DCentralStateManager);
    
    // Check 3: DOM elements
    const grid = document.getElementById('visualizer-grid');
    console.log('3. Visualizer Grid:', grid ? 'Found' : 'Missing');
    if (grid) {
        console.log('   Grid children:', grid.children.length);
    }
    
    // Check 4: Try creating HypercubeCore
    if (window.VIB34D_WorkingCore) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const core = new window.VIB34D_WorkingCore.HypercubeCore(canvas);
            console.log('4. HypercubeCore Creation: SUCCESS');
        } catch (error) {
            console.log('4. HypercubeCore Creation: FAILED -', error.message);
        }
    }
    
    // Check 5: Try creating Central State Manager
    if (window.VIB34DCentralStateManager) {
        try {
            const manager = new window.VIB34DCentralStateManager();
            console.log('5. Central State Manager Creation: SUCCESS');
        } catch (error) {
            console.log('5. Central State Manager Creation: FAILED -', error.message);
        }
    }
    
    // Check 6: Look for specific initialization functions
    const initFunctions = ['initializeDemo', 'createVisualizerCards', 'checkPhase1Architecture'];
    initFunctions.forEach(func => {
        console.log(`6. Function ${func}:`, typeof window[func]);
    });
    
    // Check 7: System status
    const systemStatus = document.getElementById('system-status');
    if (systemStatus) {
        console.log('7. System Status HTML:', systemStatus.innerHTML.substring(0, 200));
    }
    
    // Check 8: Architecture status indicators
    const indicators = [
        'architectureStatus',
        'centralStateStatus', 
        'hypercubeCoreCount',
        'baseGeometryStatus',
        'hypercubeCoreStatus'
    ];
    
    indicators.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`8. ${id}:`, el.textContent);
        }
    });
}

// Run debug if in browser
if (typeof window !== 'undefined') {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', debugDemo);
    } else {
        debugDemo();
    }
} else {
    // Export for Node.js
    module.exports = { debugDemo };
}