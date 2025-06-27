/**
 * Browser Integration Test for VIB3STYLEPACK
 * This script will open the blog and capture detailed console output
 */

console.log('🌐 Starting browser integration test...');

// Test configuration
const testConfig = {
    blogUrl: 'http://localhost:8000/vib3code-morphing-blog.html',
    testRunnerUrl: 'http://localhost:8000/test_integration_runner.html',
    testDuration: 30000, // 30 seconds
    checkInterval: 1000   // 1 second
};

// Results collector
let testResults = {
    consoleMessages: [],
    pageLoadTime: null,
    scriptsLoaded: 0,
    integrationStatus: {},
    visualElements: {},
    errors: []
};

// Capture console output
const originalConsole = console.log;
console.log = function(...args) {
    testResults.consoleMessages.push({
        timestamp: Date.now(),
        type: 'log',
        message: args.join(' ')
    });
    originalConsole.apply(console, args);
};

// Test functions
function runBrowserTest() {
    console.log('🚀 Opening browser test...');
    
    // Method 1: Try to open the test runner
    console.log('📱 Opening test runner page...');
    window.open(testConfig.testRunnerUrl, '_blank', 'width=1200,height=900');
    
    // Method 2: Also try to open the blog directly
    setTimeout(() => {
        console.log('📱 Opening blog page directly...');
        window.open(testConfig.blogUrl, '_blank', 'width=1200,height=900');
    }, 2000);
    
    // Method 3: Show manual test instructions
    showManualTestInstructions();
}

function showManualTestInstructions() {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 MANUAL INTEGRATION TEST INSTRUCTIONS');
    console.log('='.repeat(80));
    
    console.log('\n1. 📱 OPEN THE BLOG:');
    console.log(`   URL: ${testConfig.blogUrl}`);
    console.log('   OR: http://localhost:8000/vib3code-morphing-blog.html');
    
    console.log('\n2. 🔍 OPEN BROWSER CONSOLE:');
    console.log('   - Right-click → Inspect → Console');
    console.log('   - Or press F12 → Console tab');
    
    console.log('\n3. 👀 LOOK FOR THESE MESSAGES:');
    console.log('   ✅ Expected Success Messages:');
    console.log('      - "🎯 Blog page loaded - AdaptiveCardVisualizer integration should begin shortly..."');
    console.log('      - "🔮🌟 VIB34D REAL WebGL Integration initializing..."');
    console.log('      - "🎴 VIB34D Adaptive Integration System Initializing..."');
    console.log('      - "✅ AdaptiveCardVisualizer found at [location]"');
    console.log('      - "🚀 Starting enhanced integration with detailed logging..."');
    console.log('      - "✅ Successfully created adaptive visualizer for [card]"');
    console.log('      - "🎴 Enhanced Adaptive Integration Complete"');
    
    console.log('\n   ❌ Potential Error Messages:');
    console.log('      - "❌ AdaptiveCardVisualizer not found after all attempts"');
    console.log('      - "❌ Failed to create visualizer for [card]"');
    console.log('      - "❌ VIB34D Real Integration failed"');
    
    console.log('\n4. 🎨 VISUAL CHECKS:');
    console.log('   - Blog cards should show animated geometric patterns');
    console.log('   - Each card should have different geometry (hypercube, tetrahedron, etc.)');
    console.log('   - Patterns should be smooth and responsive');
    console.log('   - Hover over cards should change the visualizations');
    
    console.log('\n5. 🎮 INTERACTION TESTS:');
    console.log('   - Try dragging from screen edges (bezel navigation)');
    console.log('   - Check if face transitions work');
    console.log('   - Verify card visualizations change with navigation');
    
    console.log('\n6. 🔧 DEBUG INFORMATION:');
    console.log('   In the console, try these commands:');
    console.log('   - window.vib34dCardVisualizers (should show array of visualizers)');
    console.log('   - window.vib34dRealIntegration (should show WebGL integration)');
    console.log('   - window.VIB34D (should show VIB34D namespace)');
    console.log('   - window.AdaptiveCardVisualizer (should show class constructor)');
    
    console.log('\n7. 📊 EXPECTED RESULTS:');
    console.log('   🎯 SUCCESS: 4-8 blog cards with unique animated visualizations');
    console.log('   🎯 SUCCESS: Smooth geometric patterns (hypercube, tetrahedron, etc.)');
    console.log('   🎯 SUCCESS: Interactive hover effects on cards');
    console.log('   🎯 SUCCESS: Bezel navigation changes visual states');
    console.log('   🎯 SUCCESS: No errors in console');
    
    console.log('\n8. 🚨 TROUBLESHOOTING:');
    console.log('   If visualizations don\'t appear:');
    console.log('   - Check if WebGL is enabled in browser');
    console.log('   - Verify all script files are loading (no 404 errors)');
    console.log('   - Look for JavaScript errors in console');
    console.log('   - Try refreshing the page');
    
    console.log('\n' + '='.repeat(80));
    console.log('🔍 For detailed analysis, also check:');
    console.log(`   Test Runner: ${testConfig.testRunnerUrl}`);
    console.log('   This provides automated testing within an iframe');
    console.log('='.repeat(80));
}

// Auto-run the test
runBrowserTest();

// Also provide detailed system information
console.log('\n🔧 SYSTEM INFORMATION:');
console.log(`   Browser: ${navigator.userAgent}`);
console.log(`   WebGL Support: ${!!document.createElement('canvas').getContext('webgl')}`);
console.log(`   Local Server: ${testConfig.blogUrl}`);
console.log(`   Test Runner: ${testConfig.testRunnerUrl}`);

// Check if we're already on the blog page
if (window.location.href.includes('vib3code-morphing-blog.html')) {
    console.log('\n🎯 ALREADY ON BLOG PAGE - RUNNING INTEGRATED TESTS:');
    
    // Run integrated tests
    setTimeout(() => {
        console.log('🔍 Checking integration status...');
        
        // Check for systems
        const checks = {
            'AdaptiveCardVisualizer': !!window.AdaptiveCardVisualizer,
            'VIB34D.AdaptiveCardVisualizer': !!(window.VIB34D && window.VIB34D.AdaptiveCardVisualizer),
            'vib34dCardVisualizers': !!window.vib34dCardVisualizers,
            'vib34dRealIntegration': !!window.vib34dRealIntegration,
            'Blog Cards': document.querySelectorAll('.blog-card').length,
            'Canvas Elements': document.querySelectorAll('canvas').length,
            'Visualizer Containers': document.querySelectorAll('.adaptive-visualizer-container').length
        };
        
        console.log('📊 Integration Status:', checks);
        
        // Report results
        const hasAdaptive = checks['AdaptiveCardVisualizer'] || checks['VIB34D.AdaptiveCardVisualizer'];
        const hasVisualizers = checks['vib34dCardVisualizers'] || checks['Visualizer Containers'] > 0;
        const hasElements = checks['Blog Cards'] > 0;
        
        if (hasAdaptive && hasVisualizers && hasElements) {
            console.log('🎉 INTEGRATION TEST: SUCCESS! All systems detected.');
        } else if (hasAdaptive && hasElements) {
            console.log('⚠️ INTEGRATION TEST: PARTIAL - Systems detected but visualizers may not be active.');
        } else {
            console.log('❌ INTEGRATION TEST: FAILED - Key systems missing.');
        }
        
    }, 5000);
}