// VIB34D Demo State Diagnostic Tool
// Analyzes why the 8 visualizer cards aren't showing

console.log('🔍 VIB34D Demo State Diagnostic Starting...');

// Check if we're in browser context
if (typeof window !== 'undefined') {
    // Browser-based diagnostic
    runBrowserDiagnostic();
} else {
    // Node.js diagnostic
    console.log('❌ This diagnostic must run in a browser context');
    console.log('💡 Open http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html and check the console');
}

function runBrowserDiagnostic() {
    console.log('🌐 Running Browser-Based VIB34D Diagnostic...');
    
    const diagnosticResults = {
        timestamp: new Date().toISOString(),
        coreArchitecture: null,
        centralStateManager: null,
        visualizerGrid: null,
        errors: [],
        warnings: [],
        fixes: []
    };
    
    // Step 1: Check Working Core Architecture
    console.log('📋 Step 1: Checking Working Core Architecture...');
    
    if (typeof window.VIB34D_WorkingCore === 'undefined') {
        diagnosticResults.errors.push('❌ VIB34D_WorkingCore not found in window object');
        diagnosticResults.fixes.push('🔧 Ensure VIB34D_WORKING_CORE_ARCHITECTURE.js loads before the demo');
    } else {
        const requiredClasses = [
            'BaseGeometry', 'BaseProjection', 'GeometryManager', 
            'ProjectionManager', 'ShaderManager', 'HypercubeCore'
        ];
        
        const missingClasses = requiredClasses.filter(className => 
            !window.VIB34D_WorkingCore[className]
        );
        
        if (missingClasses.length > 0) {
            diagnosticResults.errors.push(`❌ Missing classes: ${missingClasses.join(', ')}`);
            diagnosticResults.fixes.push('🔧 Reload VIB34D_WORKING_CORE_ARCHITECTURE.js - file may be corrupted');
        } else {
            diagnosticResults.coreArchitecture = '✅ All required classes available';
            console.log('✅ Working Core Architecture: OK');
            console.log('📊 Available classes:', Object.keys(window.VIB34D_WorkingCore));
        }
    }
    
    // Step 2: Check Central State Manager
    console.log('📋 Step 2: Checking Central State Manager...');
    
    if (typeof VIB34DCentralStateManager === 'undefined') {
        diagnosticResults.errors.push('❌ VIB34DCentralStateManager class not defined');
        diagnosticResults.fixes.push('🔧 Ensure VIB34D_CENTRAL_STATE_MANAGER.js loads properly');
    } else {
        diagnosticResults.centralStateManager = '✅ Class definition available';
        console.log('✅ Central State Manager class: OK');
    }
    
    // Step 3: Check DOM Elements
    console.log('📋 Step 3: Checking DOM Elements...');
    
    const visualizerGrid = document.getElementById('visualizer-grid');
    if (!visualizerGrid) {
        diagnosticResults.errors.push('❌ visualizer-grid element not found');
        diagnosticResults.fixes.push('🔧 Check HTML structure - visualizer-grid div missing');
    } else {
        const gridChildren = visualizerGrid.children.length;
        diagnosticResults.visualizerGrid = {
            element: '✅ Found',
            children: gridChildren,
            expectedChildren: 8
        };
        
        console.log(`📊 Visualizer Grid: ${gridChildren}/8 cards present`);
        
        if (gridChildren === 0) {
            diagnosticResults.errors.push('❌ No visualizer cards created');
            diagnosticResults.fixes.push('🔧 createVisualizerCards() function likely failed');
        } else if (gridChildren < 8) {
            diagnosticResults.warnings.push(`⚠️ Only ${gridChildren}/8 cards created`);
            diagnosticResults.fixes.push('🔧 Some visualizer configurations failed - check console for HypercubeCore errors');
        }
    }
    
    // Step 4: Check Status Elements
    console.log('📋 Step 4: Checking Status Elements...');
    
    const statusElements = [
        'architectureStatus', 'hypercubeCoreCount', 'centralStateStatus',
        'baseGeometryStatus', 'baseProjectionStatus', 'geometryManagerStatus',
        'projectionManagerStatus', 'shaderManagerStatus', 'hypercubeCoreStatus'
    ];
    
    statusElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`📊 ${elementId}: ${element.textContent}`);
        } else {
            diagnosticResults.warnings.push(`⚠️ Status element ${elementId} not found`);
        }
    });
    
    // Step 5: Check Global Variables
    console.log('📋 Step 5: Checking Global Variables...');
    
    if (typeof centralStateManager !== 'undefined' && centralStateManager !== null) {
        console.log('✅ centralStateManager instance exists');
        console.log('📊 Manager state:', centralStateManager.getDebugState());
    } else {
        diagnosticResults.errors.push('❌ centralStateManager instance not created');
        diagnosticResults.fixes.push('🔧 initializeCentralStateManager() failed - check constructor errors');
    }
    
    if (typeof visualizers !== 'undefined') {
        console.log(`📊 Visualizers array: ${visualizers.length} items`);
        visualizers.forEach((viz, index) => {
            console.log(`  ${index}: ${viz.id} (${viz.config.geometry})`);
        });
    } else {
        diagnosticResults.warnings.push('⚠️ visualizers array not defined');
    }
    
    // Step 6: Test Core Functionality
    console.log('📋 Step 6: Testing Core Functionality...');
    
    try {
        if (window.VIB34D_WorkingCore && window.VIB34D_WorkingCore.HypercubeCore) {
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 100;
            testCanvas.height = 100;
            
            const testCore = new window.VIB34D_WorkingCore.HypercubeCore(testCanvas);
            console.log('✅ HypercubeCore instantiation: OK');
            console.log('📊 Test core status:', testCore.getStatus());
            
            testCanvas.remove(); // Cleanup
        }
    } catch (error) {
        diagnosticResults.errors.push(`❌ HypercubeCore test failed: ${error.message}`);
        diagnosticResults.fixes.push('🔧 HypercubeCore constructor has issues - check WebGL support');
    }
    
    // Step 7: Generate Final Report
    console.log('📋 Step 7: Generating Diagnostic Report...');
    
    console.log('\n🎯 DIAGNOSTIC SUMMARY:');
    console.log('==========================================');
    
    if (diagnosticResults.errors.length > 0) {
        console.log('\n❌ CRITICAL ERRORS:');
        diagnosticResults.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (diagnosticResults.warnings.length > 0) {
        console.log('\n⚠️ WARNINGS:');
        diagnosticResults.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    if (diagnosticResults.fixes.length > 0) {
        console.log('\n🔧 RECOMMENDED FIXES:');
        diagnosticResults.fixes.forEach(fix => console.log(`  ${fix}`));
    }
    
    // Determine root cause
    let rootCause = 'Unknown issue';
    
    if (diagnosticResults.errors.some(e => e.includes('VIB34D_WorkingCore not found'))) {
        rootCause = 'Working Core Architecture script not loaded';
    } else if (diagnosticResults.errors.some(e => e.includes('Missing classes'))) {
        rootCause = 'Working Core Architecture incomplete';
    } else if (diagnosticResults.errors.some(e => e.includes('VIB34DCentralStateManager'))) {
        rootCause = 'Central State Manager script not loaded';
    } else if (diagnosticResults.errors.some(e => e.includes('centralStateManager instance not created'))) {
        rootCause = 'Central State Manager initialization failed';
    } else if (diagnosticResults.errors.some(e => e.includes('No visualizer cards created'))) {
        rootCause = 'Visualizer creation process failed';
    } else if (diagnosticResults.warnings.some(w => w.includes('Only') && w.includes('cards created'))) {
        rootCause = 'Partial visualizer creation failure';
    } else if (diagnosticResults.visualizerGrid && diagnosticResults.visualizerGrid.children === 8) {
        rootCause = 'All systems appear functional - possible UI/CSS issue';
    }
    
    console.log(`\n🎯 ROOT CAUSE: ${rootCause}`);
    
    // Save diagnostic to window for inspection
    window.VIB34D_DiagnosticResults = diagnosticResults;
    
    console.log('\n📊 Full diagnostic saved to window.VIB34D_DiagnosticResults');
    console.log('🔍 Diagnostic Complete!');
    
    return diagnosticResults;
}

// Auto-run if we're in the demo page
if (typeof window !== 'undefined' && window.location && window.location.href.includes('VIB34D_PHASE1_INTEGRATED_DEMO.html')) {
    // Wait for DOM and scripts to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runBrowserDiagnostic, 1000);
        });
    } else {
        setTimeout(runBrowserDiagnostic, 1000);
    }
}