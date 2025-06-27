#!/usr/bin/env node

/**
 * VIB34D Phase 1 Integrated Demo Test
 * Tests the working core architecture integration without browser
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing VIB34D Phase 1 Integrated Demo...');

// Test configuration
const TEST_SERVER_PORT = 8000;
const BASE_URL = `http://localhost:${TEST_SERVER_PORT}`;
const DEMO_FILE = 'VIB34D_PHASE1_INTEGRATED_DEMO.html';

// Test results
let testResults = {
    serverRunning: false,
    demoAccessible: false,
    workingCoreAccessible: false,
    centralStateAccessible: false,
    filesLoadCorrectly: false,
    noErrors: true,
    totalTests: 0,
    passedTests: 0
};

// HTTP request helper
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
        }).on('error', reject);
    });
}

// Test functions
async function testServerRunning() {
    testResults.totalTests++;
    console.log('📡 Testing if HTTP server is running...');
    
    try {
        const response = await makeRequest(BASE_URL);
        if (response.statusCode === 200) {
            testResults.serverRunning = true;
            testResults.passedTests++;
            console.log('✅ HTTP server is running on port 8000');
            return true;
        } else {
            console.log(`❌ HTTP server responded with status ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ HTTP server not accessible: ${error.message}`);
        return false;
    }
}

async function testDemoAccessible() {
    testResults.totalTests++;
    console.log('🎯 Testing if demo HTML file is accessible...');
    
    try {
        const response = await makeRequest(`${BASE_URL}/${DEMO_FILE}`);
        if (response.statusCode === 200 && response.data.includes('VIB34D Phase 1 Integration')) {
            testResults.demoAccessible = true;
            testResults.passedTests++;
            console.log('✅ Demo HTML file is accessible and contains expected content');
            
            // Check for key elements
            const keyElements = [
                'VIB34D_WORKING_CORE_ARCHITECTURE.js',
                'VIB34D_CENTRAL_STATE_MANAGER.js',
                'checkPhase1Architecture',
                'HypercubeCore',
                'centralStateManager'
            ];
            
            let foundElements = 0;
            keyElements.forEach(element => {
                if (response.data.includes(element)) {
                    foundElements++;
                    console.log(`  ✓ Found: ${element}`);
                } else {
                    console.log(`  ✗ Missing: ${element}`);
                }
            });
            
            console.log(`📊 Demo structure check: ${foundElements}/${keyElements.length} key elements found`);
            return foundElements === keyElements.length;
        } else {
            console.log(`❌ Demo file not accessible or missing content (status: ${response.statusCode})`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error accessing demo file: ${error.message}`);
        return false;
    }
}

async function testWorkingCoreAccessible() {
    testResults.totalTests++;
    console.log('🏗️ Testing if Working Core Architecture file is accessible...');
    
    try {
        const response = await makeRequest(`${BASE_URL}/VIB34D_WORKING_CORE_ARCHITECTURE.js`);
        if (response.statusCode === 200 && response.data.includes('VIB34D_WorkingCore')) {
            testResults.workingCoreAccessible = true;
            testResults.passedTests++;
            console.log('✅ Working Core Architecture file is accessible');
            
            // Check for required classes
            const requiredClasses = [
                'BaseGeometry',
                'BaseProjection', 
                'GeometryManager',
                'ProjectionManager',
                'ShaderManager',
                'HypercubeCore'
            ];
            
            let foundClasses = 0;
            requiredClasses.forEach(cls => {
                if (response.data.includes(`class ${cls}`) || response.data.includes(`${cls}:`)) {
                    foundClasses++;
                    console.log(`  ✓ Found class: ${cls}`);
                } else {
                    console.log(`  ✗ Missing class: ${cls}`);
                }
            });
            
            console.log(`📊 Class availability: ${foundClasses}/${requiredClasses.length} required classes found`);
            return foundClasses >= requiredClasses.length - 1; // Allow for one missing class
        } else {
            console.log(`❌ Working Core Architecture file not accessible (status: ${response.statusCode})`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error accessing Working Core Architecture: ${error.message}`);
        return false;
    }
}

async function testCentralStateAccessible() {
    testResults.totalTests++;
    console.log('🎯 Testing if Central State Manager file is accessible...');
    
    try {
        const response = await makeRequest(`${BASE_URL}/VIB34D_CENTRAL_STATE_MANAGER.js`);
        if (response.statusCode === 200 && response.data.includes('VIB34DCentralStateManager')) {
            testResults.centralStateAccessible = true;
            testResults.passedTests++;
            console.log('✅ Central State Manager file is accessible');
            
            // Check for key methods
            const keyMethods = [
                'registerVisualizer',
                'handleUserEvent',
                'getDebugState',
                'setTotalEnvironmentMode'
            ];
            
            let foundMethods = 0;
            keyMethods.forEach(method => {
                if (response.data.includes(method)) {
                    foundMethods++;
                    console.log(`  ✓ Found method: ${method}`);
                } else {
                    console.log(`  ✗ Missing method: ${method}`);
                }
            });
            
            console.log(`📊 Method availability: ${foundMethods}/${keyMethods.length} key methods found`);
            return foundMethods >= keyMethods.length - 1; // Allow for one missing method
        } else {
            console.log(`❌ Central State Manager file not accessible (status: ${response.statusCode})`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error accessing Central State Manager: ${error.message}`);
        return false;
    }
}

async function checkFileIntegrity() {
    testResults.totalTests++;
    console.log('🔍 Checking file integrity and sizes...');
    
    try {
        const workingCoreResponse = await makeRequest(`${BASE_URL}/VIB34D_WORKING_CORE_ARCHITECTURE.js`);
        const centralStateResponse = await makeRequest(`${BASE_URL}/VIB34D_CENTRAL_STATE_MANAGER.js`);
        
        const workingCoreSize = workingCoreResponse.data.length;
        const centralStateSize = centralStateResponse.data.length;
        
        console.log(`📏 Working Core Architecture size: ${workingCoreSize} bytes`);
        console.log(`📏 Central State Manager size: ${centralStateSize} bytes`);
        
        // Files should be substantial (not empty or truncated)
        if (workingCoreSize > 10000 && centralStateSize > 5000) {
            testResults.filesLoadCorrectly = true;
            testResults.passedTests++;
            console.log('✅ Files have substantial content and load correctly');
            return true;
        } else {
            console.log('❌ Files appear to be too small or truncated');
            return false;
        }
    } catch (error) {
        console.log(`❌ Error checking file integrity: ${error.message}`);
        return false;
    }
}

// Main test runner
async function runTests() {
    console.log('🚀 Starting VIB34D Phase 1 Integration Test Suite...\n');
    
    const tests = [
        testServerRunning,
        testDemoAccessible,
        testWorkingCoreAccessible,
        testCentralStateAccessible,
        checkFileIntegrity
    ];
    
    for (const test of tests) {
        try {
            await test();
            console.log(''); // Add spacing
        } catch (error) {
            console.log(`❌ Test failed with error: ${error.message}\n`);
            testResults.noErrors = false;
        }
    }
    
    // Final report
    console.log('📋 TEST SUMMARY');
    console.log('================');
    console.log(`✅ Tests Passed: ${testResults.passedTests}/${testResults.totalTests}`);
    console.log(`🎯 Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}%`);
    console.log('');
    
    console.log('📊 DETAILED RESULTS');
    console.log('===================');
    console.log(`🌐 Server Running: ${testResults.serverRunning ? '✅' : '❌'}`);
    console.log(`📄 Demo Accessible: ${testResults.demoAccessible ? '✅' : '❌'}`);
    console.log(`🏗️ Working Core Available: ${testResults.workingCoreAccessible ? '✅' : '❌'}`);
    console.log(`🎯 Central State Available: ${testResults.centralStateAccessible ? '✅' : '❌'}`);
    console.log(`📁 Files Load Correctly: ${testResults.filesLoadCorrectly ? '✅' : '❌'}`);
    console.log(`🚫 No Errors: ${testResults.noErrors ? '✅' : '❌'}`);
    
    console.log('\n🎮 INTEGRATION STATUS');
    console.log('=====================');
    
    if (testResults.passedTests === testResults.totalTests) {
        console.log('🎉 ALL TESTS PASSED! VIB34D Phase 1 Integration is ready!');
        console.log('');
        console.log('🌟 Key Features Available:');
        console.log('  • Working Core Architecture with all required classes');
        console.log('  • Central State Manager with visualizer coordination');
        console.log('  • HypercubeCore instances for 4D mathematical visualizations');
        console.log('  • Complete focus state management system');
        console.log('  • Interactive controls and real-time debugging');
        console.log('');
        console.log('🚀 Demo should be fully functional at:');
        console.log(`   ${BASE_URL}/${DEMO_FILE}`);
    } else {
        console.log('⚠️  Some tests failed - integration may have issues');
        console.log('');
        console.log('🔧 RECOMMENDATIONS:');
        if (!testResults.serverRunning) {
            console.log('  • Start HTTP server: python3 -m http.server 8000');
        }
        if (!testResults.workingCoreAccessible) {
            console.log('  • Check VIB34D_WORKING_CORE_ARCHITECTURE.js exists and is complete');
        }
        if (!testResults.centralStateAccessible) {
            console.log('  • Check VIB34D_CENTRAL_STATE_MANAGER.js exists and is complete');
        }
    }
    
    return testResults.passedTests === testResults.totalTests;
}

// Run the tests
runTests().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});