const http = require('http');

function fetchAndAnalyze(url, callback) {
    http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => callback(null, data));
    }).on('error', err => callback(err));
}

console.log('🔍 Testing VIB34D Demo Status...');

// Test 1: Check main HTML loads
fetchAndAnalyze('http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html', (err, html) => {
    if (err) {
        console.log('❌ Main HTML failed:', err.message);
        return;
    }
    
    console.log('✅ Main HTML loads successfully');
    
    // Check key elements in HTML
    const hasVisualizerGrid = html.includes('visualizer-grid');
    const hasControlButtons = html.includes('control-button');
    const hasDashboard = html.includes('state-dashboard');
    const hasScriptTags = html.includes('<script src="VIB34D_WORKING_CORE_ARCHITECTURE.js">');
    const hasInitFunction = html.includes('initializeDemo');
    const hasDOMListener = html.includes('DOMContentLoaded');
    
    console.log('📊 HTML Structure Analysis:');
    console.log(`- Visualizer Grid: ${hasVisualizerGrid ? '✅' : '❌'}`);
    console.log(`- Control Buttons: ${hasControlButtons ? '✅' : '❌'}`);
    console.log(`- State Dashboard: ${hasDashboard ? '✅' : '❌'}`);
    console.log(`- Script References: ${hasScriptTags ? '✅' : '❌'}`);
    console.log(`- Init Function: ${hasInitFunction ? '✅' : '❌'}`);
    console.log(`- DOM Listener: ${hasDOMListener ? '✅' : '❌'}`);
    
    // Test 2: Check Working Core Architecture loads
    fetchAndAnalyze('http://localhost:8000/VIB34D_WORKING_CORE_ARCHITECTURE.js', (err, coreJs) => {
        if (err) {
            console.log('❌ Core Architecture failed:', err.message);
            return;
        }
        
        console.log('✅ Core Architecture loads successfully');
        
        // Check key classes
        const hasBaseGeometry = coreJs.includes('class BaseGeometry');
        const hasGeometryManager = coreJs.includes('class GeometryManager');
        const hasHypercubeCore = coreJs.includes('class HypercubeCore');
        const hasExportStatement = coreJs.includes('window.VIB34D_WorkingCore');
        
        console.log('🏗️ Core Architecture Analysis:');
        console.log(`- BaseGeometry Class: ${hasBaseGeometry ? '✅' : '❌'}`);
        console.log(`- GeometryManager Class: ${hasGeometryManager ? '✅' : '❌'}`);
        console.log(`- HypercubeCore Class: ${hasHypercubeCore ? '✅' : '❌'}`);
        console.log(`- Window Export: ${hasExportStatement ? '✅' : '❌'}`);
        
        // Test 3: Check Central State Manager loads
        fetchAndAnalyze('http://localhost:8000/VIB34D_CENTRAL_STATE_MANAGER.js', (err, stateJs) => {
            if (err) {
                console.log('❌ Central State Manager failed:', err.message);
                return;
            }
            
            console.log('✅ Central State Manager loads successfully');
            
            const hasCentralStateManager = stateJs.includes('class VIB34DCentralStateManager');
            const hasHandleUserEvent = stateJs.includes('handleUserEvent');
            const hasStateExport = stateJs.includes('window.VIB34DCentralStateManager');
            
            console.log('🎯 Central State Manager Analysis:');
            console.log(`- CentralStateManager Class: ${hasCentralStateManager ? '✅' : '❌'}`);
            console.log(`- User Event Handler: ${hasHandleUserEvent ? '✅' : '❌'}`);
            console.log(`- Window Export: ${hasStateExport ? '✅' : '❌'}`);
            
            // Summary
            console.log('\n🎯 DEMO READINESS ASSESSMENT:');
            const htmlReady = hasVisualizerGrid && hasControlButtons && hasDashboard && hasInitFunction;
            const coreReady = hasBaseGeometry && hasGeometryManager && hasHypercubeCore;
            const stateReady = hasCentralStateManager && hasHandleUserEvent;
            
            console.log(`- HTML Structure: ${htmlReady ? '✅ READY' : '❌ ISSUES'}`);
            console.log(`- Core Architecture: ${coreReady ? '✅ READY' : '❌ ISSUES'}`);
            console.log(`- State Management: ${stateReady ? '✅ READY' : '❌ ISSUES'}`);
            
            if (htmlReady && coreReady && stateReady) {
                console.log('\n🚀 DEMO STATUS: READY TO LAUNCH');
                console.log('Open http://localhost:8000/VIB34D_PHASE1_INTEGRATED_DEMO.html in your browser');
                console.log('Expected to see:');
                console.log('- 8 visualizer cards with WebGL canvases');
                console.log('- Interactive control buttons at bottom');
                console.log('- Live state dashboard on left');
                console.log('- Phase 1 integration indicator on right');
            } else {
                console.log('\n❌ DEMO STATUS: HAS ISSUES');
                console.log('Check the failed components above');
            }
        });
    });
});