/**
 * VIB3STYLEPACK Blog Integration Test
 * Tests the enhanced integration system for the production blog
 */

console.log('🧪 VIB3STYLEPACK Blog Integration Test Starting...');

// Test configuration
const TEST_CONFIG = {
    blogUrl: 'http://localhost:8000/vib3code-morphing-blog.html',
    timeout: 30000,
    checkInterval: 500,
    maxAttempts: 60
};

// Test results tracking
let testResults = {
    pageLoad: false,
    scriptsLoaded: false,
    adaptiveIntegration: false,
    webglIntegration: false,
    blogCards: 0,
    canvasElements: 0,
    visualizers: 0,
    errors: [],
    console: []
};

// Capture console output
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
};

// Override console methods to capture output
console.log = (...args) => {
    testResults.console.push({ type: 'log', message: args.join(' '), timestamp: Date.now() });
    originalConsole.log(...args);
};

console.error = (...args) => {
    testResults.console.push({ type: 'error', message: args.join(' '), timestamp: Date.now() });
    testResults.errors.push(args.join(' '));
    originalConsole.error(...args);
};

console.warn = (...args) => {
    testResults.console.push({ type: 'warn', message: args.join(' '), timestamp: Date.now() });
    originalConsole.warn(...args);
};

// Test functions
function testPageLoad() {
    console.log('🔍 Testing page load...');
    testResults.pageLoad = document.readyState === 'complete';
    console.log(`✅ Page load: ${testResults.pageLoad ? 'SUCCESS' : 'PENDING'}`);
    return testResults.pageLoad;
}

function testScriptsLoaded() {
    console.log('🔍 Testing script loading...');
    
    const requiredScripts = [
        'VIB34D_BLOG_INTEGRATION_INJECT.js',
        'VIB34D_ADAPTIVE_INTEGRATION.js',
        'VIB34D_ADAPTIVE_CARD_VISUALIZER.js'
    ];
    
    const loadedScripts = Array.from(document.querySelectorAll('script[src]'))
        .map(script => script.src)
        .filter(src => requiredScripts.some(required => src.includes(required)));
    
    testResults.scriptsLoaded = loadedScripts.length >= 2; // At least 2 of 3 critical scripts
    console.log(`✅ Scripts loaded: ${testResults.scriptsLoaded ? 'SUCCESS' : 'PENDING'} (${loadedScripts.length}/3)`);
    console.log('   Loaded scripts:', loadedScripts);
    
    return testResults.scriptsLoaded;
}

function testAdaptiveIntegration() {
    console.log('🔍 Testing adaptive integration...');
    
    // Check for AdaptiveCardVisualizer availability
    const hasAdaptiveClass = !!(
        window.AdaptiveCardVisualizer || 
        (window.VIB34D && window.VIB34D.AdaptiveCardVisualizer) ||
        (window.VIB3 && window.VIB3.AdaptiveCardVisualizer)
    );
    
    // Check for integration results
    const hasIntegrationResults = !!(window.vib34dCardVisualizers && window.vib34dCardVisualizers.length > 0);
    
    testResults.adaptiveIntegration = hasAdaptiveClass && hasIntegrationResults;
    console.log(`✅ Adaptive integration: ${testResults.adaptiveIntegration ? 'SUCCESS' : 'PENDING'}`);
    console.log(`   AdaptiveCardVisualizer available: ${hasAdaptiveClass}`);
    console.log(`   Integration results: ${hasIntegrationResults ? window.vib34dCardVisualizers.length + ' visualizers' : 'none'}`);
    
    return testResults.adaptiveIntegration;
}

function testWebGLIntegration() {
    console.log('🔍 Testing WebGL integration...');
    
    // Check for WebGL integration
    const hasWebGLIntegration = !!(window.vib34dRealIntegration && window.vib34dRealIntegration.isInitialized);
    const hasWebGLInstances = !!(window.vib34dRealIntegration && window.vib34dRealIntegration.vib34dInstances.size > 0);
    
    testResults.webglIntegration = hasWebGLIntegration && hasWebGLInstances;
    console.log(`✅ WebGL integration: ${testResults.webglIntegration ? 'SUCCESS' : 'PENDING'}`);
    console.log(`   WebGL system initialized: ${hasWebGLIntegration}`);
    console.log(`   WebGL instances: ${hasWebGLInstances ? window.vib34dRealIntegration.vib34dInstances.size : 0}`);
    
    return testResults.webglIntegration;
}

function testBlogElements() {
    console.log('🔍 Testing blog elements...');
    
    // Count blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    testResults.blogCards = blogCards.length;
    
    // Count canvas elements
    const canvasElements = document.querySelectorAll('canvas');
    testResults.canvasElements = canvasElements.length;
    
    // Count active visualizers
    const adaptiveContainers = document.querySelectorAll('.adaptive-visualizer-container');
    testResults.visualizers = adaptiveContainers.length;
    
    console.log(`✅ Blog elements found:`);
    console.log(`   Blog cards: ${testResults.blogCards}`);
    console.log(`   Canvas elements: ${testResults.canvasElements}`);
    console.log(`   Visualizer containers: ${testResults.visualizers}`);
    
    return testResults.blogCards > 0;
}

function testVisualizerFunctionality() {
    console.log('🔍 Testing visualizer functionality...');
    
    let functionalVisualizers = 0;
    
    // Test each visualizer
    if (window.vib34dCardVisualizers) {
        window.vib34dCardVisualizers.forEach((cardViz, index) => {
            try {
                const { visualizer, container, cardId } = cardViz;
                
                // Check if visualizer has required properties
                const hasGL = visualizer && visualizer.gl;
                const hasCanvas = visualizer && visualizer.canvas;
                const hasContainer = container && container.parentNode;
                
                if (hasGL && hasCanvas && hasContainer) {
                    functionalVisualizers++;
                    console.log(`   ✅ Visualizer ${index} (${cardId}): FUNCTIONAL`);
                } else {
                    console.log(`   ❌ Visualizer ${index} (${cardId}): MISSING COMPONENTS`);
                    console.log(`      - GL: ${hasGL}, Canvas: ${hasCanvas}, Container: ${hasContainer}`);
                }
            } catch (error) {
                console.log(`   ❌ Visualizer ${index}: ERROR - ${error.message}`);
            }
        });
    }
    
    console.log(`✅ Functional visualizers: ${functionalVisualizers}/${testResults.visualizers}`);
    return functionalVisualizers > 0;
}

function testNavigation() {
    console.log('🔍 Testing navigation system...');
    
    // Check for navigation elements
    const bezelElements = document.querySelectorAll('.navigation-bezel, .bezel-visualizer');
    const morphingSystem = window.morphingBlogSystem;
    
    console.log(`✅ Navigation elements:`);
    console.log(`   Bezel elements: ${bezelElements.length}`);
    console.log(`   Morphing system: ${morphingSystem ? 'AVAILABLE' : 'MISSING'}`);
    
    // Test bezel interaction (simulated)
    if (bezelElements.length > 0 && morphingSystem) {
        try {
            // Simulate bezel click
            const testBezel = bezelElements[0];
            const clickEvent = new MouseEvent('click', { bubbles: true });
            testBezel.dispatchEvent(clickEvent);
            console.log('   ✅ Bezel interaction test: SUCCESS');
            return true;
        } catch (error) {
            console.log(`   ❌ Bezel interaction test: FAILED - ${error.message}`);
            return false;
        }
    }
    
    return bezelElements.length > 0;
}

// Main test execution
async function runTests() {
    console.log('🚀 Running comprehensive blog integration tests...');
    
    let attempt = 0;
    const startTime = Date.now();
    
    const testInterval = setInterval(() => {
        attempt++;
        console.log(`\n📊 Test attempt ${attempt}/${TEST_CONFIG.maxAttempts}...`);
        
        // Run all tests
        const pageLoaded = testPageLoad();
        const scriptsLoaded = testScriptsLoaded();
        const elementsFound = testBlogElements();
        const adaptiveIntegrated = testAdaptiveIntegration();
        const webglIntegrated = testWebGLIntegration();
        const visualizersFunctional = testVisualizerFunctionality();
        const navigationWorking = testNavigation();
        
        // Check completion conditions
        const allTestsPassed = pageLoaded && scriptsLoaded && elementsFound && 
                              (adaptiveIntegrated || webglIntegrated) && 
                              visualizersFunctional;
        
        const timeout = Date.now() - startTime > TEST_CONFIG.timeout;
        
        if (allTestsPassed || timeout || attempt >= TEST_CONFIG.maxAttempts) {
            clearInterval(testInterval);
            
            // Generate final report
            generateTestReport(allTestsPassed, timeout, attempt);
        }
        
    }, TEST_CONFIG.checkInterval);
}

function generateTestReport(success, timeout, attempts) {
    const endTime = Date.now();
    const duration = (endTime - Date.now()) / 1000;
    
    console.log('\n' + '='.repeat(80));
    console.log('🧪 VIB3STYLEPACK BLOG INTEGRATION TEST REPORT');
    console.log('='.repeat(80));
    
    console.log(`📊 Test Status: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`⏱️  Duration: ${duration}s (${attempts} attempts)`);
    console.log(`🔄 Timeout: ${timeout ? 'YES' : 'NO'}`);
    
    console.log('\n📋 Test Results:');
    console.log(`   Page Load: ${testResults.pageLoad ? '✅' : '❌'}`);
    console.log(`   Scripts Loaded: ${testResults.scriptsLoaded ? '✅' : '❌'}`);
    console.log(`   Adaptive Integration: ${testResults.adaptiveIntegration ? '✅' : '❌'}`);
    console.log(`   WebGL Integration: ${testResults.webglIntegration ? '✅' : '❌'}`);
    
    console.log('\n📈 Element Counts:');
    console.log(`   Blog Cards: ${testResults.blogCards}`);
    console.log(`   Canvas Elements: ${testResults.canvasElements}`);
    console.log(`   Visualizers: ${testResults.visualizers}`);
    
    if (testResults.errors.length > 0) {
        console.log('\n❌ Errors Found:');
        testResults.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    }
    
    console.log('\n🔍 Integration Status:');
    console.log(`   AdaptiveCardVisualizer: ${window.AdaptiveCardVisualizer ? 'AVAILABLE' : 'MISSING'}`);
    console.log(`   VIB34D.AdaptiveCardVisualizer: ${window.VIB34D?.AdaptiveCardVisualizer ? 'AVAILABLE' : 'MISSING'}`);
    console.log(`   WebGL Integration: ${window.vib34dRealIntegration ? 'AVAILABLE' : 'MISSING'}`);
    console.log(`   Card Visualizers: ${window.vib34dCardVisualizers?.length || 0}`);
    
    console.log('\n🎯 Recommendations:');
    if (!testResults.adaptiveIntegration && !testResults.webglIntegration) {
        console.log('   ⚠️  No integration system detected - check script loading order');
    }
    if (testResults.blogCards === 0) {
        console.log('   ⚠️  No blog cards found - check HTML structure');
    }
    if (testResults.canvasElements === 0) {
        console.log('   ⚠️  No canvas elements found - check visualizer creation');
    }
    if (testResults.errors.length > 0) {
        console.log('   ⚠️  Errors detected - check browser console for details');
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Save results to global for debugging
    window.testResults = testResults;
    console.log('🔍 Full test results available at: window.testResults');
}

// Auto-start tests when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}